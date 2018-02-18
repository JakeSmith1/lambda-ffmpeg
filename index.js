const executableFfmpeg = require('./src/ffmpeg')();

exports.handler = function(event, context, callback) {
    executableFfmpeg
    .then(
        () => callback(null, 'Success'),
        err => callback(err, 'Failed')
    );
 };
 exports.handler({}, {}, console.log);