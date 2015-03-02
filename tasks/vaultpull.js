module.exports = function(grunt) {
    'use strict';
    grunt.registerMultiTask('vaultpull', 'Vaults content from an AEM instance down to a filesystem.', function() {
        var options = this.options({
            noop: false,
            username: 'admin',
            password: 'admin',
            environment: 'http://127.0.0.1:4502',
            sourcepath: '/content/geometrixx',
            destination: 'vaultDefault'
        });

        var path = require('path'),
            basedir = path.join(__dirname, '..');

        if (grunt.file.exists(options.destination)) {
            grunt.log.writeln('Deleting ' + options.destination);
            grunt.file.delete(options.destination);
        }

        // Create the output path
        grunt.file.mkdir(options.destination);
        grunt.log.writeln('Vaulting from "' + options.environment + '" to "' + options.destination + '".  This will take a while ...');

        grunt.config('exec', {
            vaultexec: {
                cmd: path.join(basedir, 'bin/vlt-3.1.6') + ' -v --credentials '+options.username+':'+options.password+' export '+options.environment+'/crx '+options.sourcepath+' '+options.destination
            }
        });

        require('grunt-exec/tasks/exec')(grunt);

        if (!options.noop) {
            grunt.task.run(['exec']);
        } else {
            grunt.log.writeln('Noop mode, not doing anything.');
        }
    });
}