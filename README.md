## About
Running ffmpeg on lambda can be tricky to get set up. Ffmpeg and ffprobe take up 100 Mb which can make your deployment package too large to use tools like claudia and serverless. Ffmpeg and ffprobe are unzipped when index.js is run, and lambda container reuse means the code outside of index.handler will not always be reinitialized.


## Setup
1. `git clone`
2. Install and use the same node version as lambda: `nvm install 6.10`,`nvm use 6.10`
3. `npm install`

## How to use
- Run your code in index.js after executableFfmpeg resolves
```
    executableFfmpeg
    .then(
        () => callback(null, 'Success'),
        err => callback(err, 'Failed')
    );
```
- you can ```require('fluent-ffmpeg')``` in any file as long as that file's code is run after executableFfmpeg resolves
- or you can use child_process.spawn
```
        return new Promise((resolve, reject) => {
            const child_process = require('child_process');
            const fs = require('fs');
            const ffmpeg = child_process.spawn(process.env.ffmpegPath, ['-i', '/tmp/infile.m4a','-f', 'mp3', 'pipe:1']);
            ffmpeg.stdout.pipe(fs.createWriteStream('/tmp/outfile.mp3'));
            ffmpeg.stderr.setEncoding('utf8');
            ffmpeg.stderr.on('data', console.log);
            ffmpeg.stdout.on('end', resolve);
            ffmpeg.stdout.on('error', reject);
        });
```

## Running Locally
- ffmpegPath='/usr/local/bin/ffmpeg' ffprobePath='/usr/local/bin/ffprobe' node index.js


## Deployment
- [set up aws credentials and claudia](https://claudiajs.com/tutorials/installing.html)


### Building Ffmpeg for Lambda
- Get the static build [here](https://www.johnvansickle.com/ffmpeg/)
- download x86_64 build for lambda
  - [lambda environemnt](https://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html)
- unzip the build, remove ffmpeg and ffprobe, then zip them and place them in ./vendor
    - zipping them decreases the deployment package size. This is useful when using tools such as claudia for deployment which have upload size limits.
