'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.vault = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    test_output_dirs: function(test) {
        test.expect(5);
        test.equal(grunt.file.exists('./vaultDefault'), true, 'Unable to find default output directory.');
        test.equal(grunt.file.exists('./tmp/findme'), true, 'Unable to find the "findme" output directory.');
        test.equal(grunt.file.exists('./tmp/local'), true, 'Unable to find the "local" output directory.');
        test.equal(grunt.file.exists('./tmp/local/META-INF'), true, 'Unable to find the "META-INF" output directory.');
        test.equal(grunt.file.exists('./tmp/local/jcr_root/content/geometrixx'), true, 'Unable to find the "geometrixx" output directory.');
        test.done();
    }
};
