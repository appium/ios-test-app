module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    zip: {
      app: {
        src: ['build/Release-iphonesimulator/TestApp.app/*'],
        dest: 'TestApp.app.zip',
        cwd: 'build/Release-iphonesimulator'
      }
    }
  });

  var MAX_BUFFER_SIZE = 524288;
  var spawn = require('child_process').spawn;
  var exec = require('child_process').exec;

  var cleanApp = function(appRoot, sdk, done) {
    var cmd = 'xcodebuild -sdk ' + sdk + ' clean';
    var xcode = exec(cmd, {cwd: appRoot, maxBuffer: MAX_BUFFER_SIZE}, function (err, stdout, stderr) {
      if (err) {
        grunt.log.error("Failed cleaning app");
        grunt.warn(stderr);
      } else {
        done();
      }
    });
  }

  var buildApp = function(appRoot, sdk, done) {

    grunt.log.write("Building app...");
    var args = ['-sdk', sdk];
    xcode = spawn('xcodebuild', args, {
      cwd: appRoot
    });
    xcode.on("error", function (err) {
      grunt.warn("Failed spawning xcodebuild: " + err.message);
    });
    var output = '';
    var collect = function (data) { output += data; };
    xcode.stdout.on('data', collect);
    xcode.stderr.on('data', collect);
    xcode.on('exit', function (code) {
      if (code != 0) {
        grunt.log.error("Failed building app");
        grunt.warn(output);
      } else {
        grunt.log.write('done building ios app for sdk', sdk);
        done();
      }
    });
  };

  grunt.loadNpmTasks('grunt-zip');

  grunt.registerTask('build', 'build ios app', function(){ buildApp('.', 'iphonesimulator7.1', this.async()) } );
  grunt.registerTask('clean', 'cleaning', function(){ cleanApp('.', 'iphonesimulator7.1', this.async()) } );
  grunt.registerTask('default', ['clean', 'build', 'zip']);
}
