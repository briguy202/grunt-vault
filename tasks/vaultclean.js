module.exports = function(grunt) {
    'use strict';
    grunt.registerMultiTask('vaultclean', 'Cleans vaulted content from an AEM instance to prepare it for source control.', function() {
        var options = this.options({
            removal_nodes: [],
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
                var cleanfile = f.dest || filepath,
                    // actiontaken determines if any operations have been done on the file.  If not, then we don't want to clean up in the end.
                    actiontaken = false,
                    regex;
                if (f.dest) {
                    grunt.verbose.writeln('\tDestination specified, using cleanfile \''+cleanfile+'\'.');
                    grunt.file.copy(filepath, f.dest);
                }

                grunt.verbose.writeln('\tClean: ' + cleanfile);

                var contents = grunt.file.read(cleanfile);

                // Remove the attributes passed in from the options
                if (options.removal_nodes.length > 0) {
                    actiontaken = true;
                    regex = new RegExp('.*(' + options.removal_nodes.join('|') + ')+=".+"(>|/>)?.*', 'ig');
                    grunt.verbose.writeln('\tRemoving nodes based on regex: ' + regex.source + '.');
                    contents = contents.replace(regex, '$2');
                }

                if (options.replacements.length > 0) {
                    actiontaken = true;
                    grunt.verbose.writeln('\tSubstituting replacements: ' + JSON.stringify(options.replacements) + '.');
                    options.replacements.forEach(function(r) {
                        regex = new RegExp(r.search, 'gi');
                        contents = contents.replace(regex, r.replacement);
                    });
                }

                if (actiontaken) {
                    // Fix up any lines that only have a closing bracket on them (due to the rest of the line being cleared).
                    grunt.verbose.writeln('\tCleaning trailing bracket lines.');
                    contents = contents.replace(/(.)(\r|\n|\r\n)+([/]?)>$/gm, '$1$3>');

                    // Clean out any empty lines
                    grunt.verbose.writeln('\tCleaning empty lines.');
                    contents = contents.replace(/^[\r\n]*/gm, '');
                }

                grunt.file.write(cleanfile, contents);
            });
        });
    });
};