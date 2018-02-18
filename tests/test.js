const chai = require('chai');
const expect = chai.expect;

const fs = require('fs');
const os = require('os');
const path = require('path');
const child_process = require('child_process');

const executableFfmpeg = require('../src/ffmpeg');

const removeDirectory = dirPath => child_process.execSync(`rm -rf ${dirPath}`);

describe('Executable ffmpeg and ffprobe', function () {
    const executablePaths = {
        ffmpeg: path.join(os.tmpdir(), 'ffmpeg'),
        ffprobe: path.join(os.tmpdir(), 'ffprobe')
    };
    function areUnpacked(bool) {
        expect(fs.existsSync(executablePaths.ffmpeg)).to.be[bool];
        expect(fs.existsSync(executablePaths.ffprobe)).to.be[bool];
    }
    beforeEach(function () {
        ['ffmpeg', 'ffprobe'].forEach(binary => {
            if (fs.existsSync(executablePaths[binary])) {
                removeDirectory(executablePaths[binary]);
            }
        });
    });
    it('Should unpack the binaries and make them executable when they are not already', function () {
        areUnpacked(false);
        
        return executableFfmpeg()
        .then(fluentFfmpeg => {
            expect(fluentFfmpeg).to.exist;
            areUnpacked(true);
        })
        .catch(err => expect(err).to.not.exist);
    });
    it('Should return fluentFfmpeg with the paths set with the binaries were already unpacked', function () {
        areUnpacked(false);

        return executableFfmpeg()
        .then(() => {
            areUnpacked(true);
            return executableFfmpeg()
            .then(fluentFfmpeg => {
                expect(fluentFfmpeg).to.exist;
                areUnpacked(true);
                return expect(fluentFfmpeg().addInput).to.be.a('function');
            });
        })
        .catch(err => expect(err).to.not.exist);
    });
});