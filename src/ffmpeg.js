const os = require('os'),
	path = require('path'),
	fs = require('fs'),
	zlib = require('zlib'),
	fluentFfmpeg = require('fluent-ffmpeg');

function exists(target) {
	return new Promise((resolve, reject) => {
		fs.access(target, err => err ? reject(target) : resolve(target));
	});
}
function makeExecutable(target) {
	return new Promise(function (resolve, reject) {
		fs.chmod(target, '0700', err => err ? reject(target) : resolve(target));
	});
}
function unzip(binaryName) {
	return function (targetPath) {
		return new Promise((resolve, reject) => {
			const inflate = zlib.createGunzip();
			const outStream = fs.createWriteStream(targetPath);

			inflate
				.on('end', () => resolve(targetPath))
				.on('error', reject);

			fs.createReadStream(path.join(__dirname, '../vendor', binaryName + '.gz'))
				.pipe(inflate)
				.pipe(outStream);

		})
		.then(() => makeExecutable(targetPath));
	};
}
function findOrUnpack(binaryName) {
	return exists(path.join(os.tmpdir(), binaryName)).catch(unzip(binaryName));
}

module.exports = function ffmpeg() {
	return Promise.all([
		findOrUnpack('ffmpeg'),
		findOrUnpack('ffprobe')
	])
	.then(([ffmpegPath, ffprobePath]) => {
		fluentFfmpeg.setFfmpegPath(process.env.ffmpegPath || ffmpegPath);
		fluentFfmpeg.setFfprobePath(process.env.ffprobePath || ffprobePath);
		return fluentFfmpeg;
	});
};
