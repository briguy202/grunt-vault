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
    test_no_options: function(test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/test_no_options_cleaned.xml');
        var expected = grunt.file.read('test/fixtures/dirty.xml');
        test.equal(actual, expected, 'Cleaning with no options should not modify the dirty file.');

        test.done();
    },
    test_replacements: function(test) {
        test.expect(6);

        var actual = grunt.file.read('tmp/test_replacements_cleaned.xml');
        var actual_sub = grunt.file.read('tmp/replacements/subfolder/dirty-sub-folder.xml');

        test.equal(actual, actual_sub, 'Cleaning should result in the same results no matter where the file is placed.');
        test.equal(actual.indexOf('/apps/geometrixx/'), -1, 'Should not be able to find \'/apps/geometrixx/\'');
        test.equal(actual.indexOf('/content/dam/geometrixx/'), -1, 'Should not be able to find \'/content/dam/geometrixx/\'');
        test.equal(actual.indexOf('lastModified'), -1, 'Should not be able to find \'lastModified\'');
        test.equal(actual.indexOf('isCheckedOut'), -1, 'Should not be able to find \'isCheckedOutd\'');
        test.equal(actual.indexOf('uuid'), -1, 'Should not be able to find \'uuidd\'');

        test.done();
    },
    test_skipped: function(test) {
        test.expect(1);

        test.equal(grunt.file.exists('tmp/skipped/skippedFolder/file1.txt'), false, 'Skipped files/folders should not exist.');
        test.done();
    }
};