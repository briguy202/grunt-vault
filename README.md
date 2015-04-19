# grunt-vault

> Vaults content from an AEM instance down to a filesystem.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-vault --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-vault');
```

## The "vaultpull" task

### Overview
In your project's Gruntfile, add a section named `vaultpull` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  vaultpull: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.noop
Type: `Boolean`
Default value: `false`

A boolean value that determines whether the vault command will actually be called.  Useful only for testing.

#### options.username
Type: `String`
Default value: `'admin'`

A string value for the username used to connect to the AEM instance.

#### options.password
Type: `String`
Default value: `'admin'`

A string value for the password used to connect to the AEM instance.

#### options.environment
Type: `String`
Default value: `'http://127.0.0.1:4502'`

A string value representing the base URL used to connect to the AEM instance.

#### options.sourcepath
Type: `String`
Default value: `'/content/geometrixx'`

A string value for the path within the JCR that will be vaulted down to the filesystem.  Be sure to make this value as specific as it can be to avoid vaulting too much content from the repository.

#### options.destination
Type: `String`
Default value: `'vaultDefault'`

A string value defining the path where the content will be placed on the local filesystem once it is vaulted down.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  vaultpull: {
    options: {
      environment: 'http://localhost:4502',
      sourcepath: '/content/some/path',
      username: 'myusername',
      password: 'mypassword'
    },
    dev_site_content: {
      options: {
        destination: '.vaultedcontent'
      }
    }
  },
});
```

## The "vaultclean" task

### Overview
In your project's Gruntfile, add a section named `vaultclean` to the data object passed into `grunt.initConfig()`.

### Options

#### options.removal_nodes
Type: `Array[]`
Default value: `[]`

An array containing the list of attributes that will be removed from the content.  For example, specifying `['lastModified', 'lastModifiedBy', 'dam:sha1']` in the array will remove all instances of jcr:lastModified, jcr:lastModifiedBy, and dam:sha1 from the vaulted content.  This is useful for removing attributes that change frequently, causing noisy diffs whenever content is vaulted and placed in source control.

#### options.replacements
Type: `Array[]`
Default value: `[]`

An array containing the list of find-and-replace strings to be applied to the content.

### Usage Examples

#### Default Options
In this example, all XML files below `.vaultedcontent` will be cleaned.  The cleaning will replace two paths and strip out four attributes.

```js
grunt.initConfig({
  vaultclean: {
    target: {
      files: [
        { src: ['.vaultedcontent/**/.*.xml'] }
      ],
      options: {
        replacements: [
          { search: '/content/somepath/', replacement: '/content/dev/somepath/' },
          { search: '/dam/somepath/', replacement: '/dam/dev/somepath/' }
        ],
        removal_nodes: ['lastModified', 'lastModifiedBy', 'isCheckedOut', 'uuid']
      }
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
