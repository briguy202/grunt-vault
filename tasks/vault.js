'use strict';

module.exports = function(grunt) {
    grunt.registerMultiTask('vaultpull', 'Vaults content from an AEM instance down to a filesystem.', function() {
        var options = this.options({
            noop: false,
            username: 'admin',
            password: 'admin',
            environment: 'http://127.0.0.1:4502',
            sourcepath: '/content/geometrixx',
            destination: 'vaultDefault'
        });

        if (grunt.file.exists(options.destination)) {
            grunt.log.writeln('Deleting ' + options.destination);
            grunt.file.delete(options.destination);
        }

        grunt.log.writeln('Vaulting from "' + options.environment + '" to "' + options.destination + '".  This will take a while ...');

        grunt.config.set('exec.username', options.username);
        grunt.config.set('exec.password', options.password);
        grunt.config.set('exec.environment', options.environment);
        grunt.config.set('exec.sourcepath', options.sourcepath);
        grunt.config.set('exec.destinationpath', options.destination);

        // Create the output path
        grunt.file.mkdir(options.destination);

        if (!options.noop) {
            grunt.task.run(['exec:vaultexec']);
        } else {
            grunt.log.writeln('Noop mode, not doing anything.');
        }
    });


    grunt.registerMultiTask('vaultclean', 'Cleans vaulted content from an AEM instance to prepare it for source control.', function() {
        var options = this.options({
            jcr_cq_nodes: [],
            replacements: []
        });

        if (this.files.length === 0) {
            grunt.log.warn('You must specify at least one file to clean.');
            return;
        }
        grunt.verbose.writeln('Executing vault clean over \'' + this.files.length + '\' file groups.');

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            var contents = f.src.filter(function(filepath) {
                // Remove nonexistent files (it's up to you to filter or warn here).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).forEach(function(filepath) {
                var cleanfile = filepath;
                if (f.dest) {
                    cleanfile = f.dest;
                    grunt.file.copy(filepath, f.dest);
                }
                grunt.verbose.writeln('Clean: ' + cleanfile);

                var contents = grunt.file.read(cleanfile);

                if (options.jcr_cq_nodes.length > 0) {
                    grunt.verbose.writeln('Replacing jcr/cq lines: ' + options.jcr_cq_nodes.join(', ') + '.');
                    var regex;

                    // Remove the attributes passed in from the options
                    regex = new RegExp('.*(jcr|cq)+:(' + options.jcr_cq_nodes.join('|') + ')+=".+"([>]?).*', 'ig');
                    contents = contents.replace(regex, '$3');

                    // Clean out any empty lines
                    contents = contents.replace(/^[\r\n]*/gm, '');
                }

                if (options.replacements.length > 0) {
                    grunt.verbose.writeln('Substituting replacements: ' + JSON.stringify(options.replacements) + '.');
                    options.replacements.forEach(function(r) {
                        regex = new RegExp(r.search, 'gi');
                        contents = contents.replace(regex, r.replacement);
                    });
                }

                grunt.file.write(cleanfile, contents);
            });
        });
    });
};