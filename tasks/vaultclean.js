module.exports = function(grunt) {
    'use strict';
    grunt.registerMultiTask('vaultclean', 'Cleans vaulted content from an AEM instance to prepare it for source control.', function() {
        var options = this.options({
            jcr_cq_nodes: [],
            replacements: []
        });

        if (this.files.length === 0) {
            grunt.log.warn('You must specify at least one file to clean.');
            return false;
        }
        grunt.verbose.writeln('Executing vault clean over \'' + this.files.length + '\' file groups.');

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            grunt.verbose.writeln('Processing file \'' + f.src + '\'.');
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
                    grunt.verbose.writeln('Destination specified, using cleanfile \''+cleanfile+'\'.');
                    grunt.file.copy(filepath, f.dest);
                }
                grunt.verbose.writeln('Clean: ' + cleanfile);

                var contents = grunt.file.read(cleanfile);

                if (options.jcr_cq_nodes.length > 0) {
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