### Build documentation

To build documentation of the Javascript classes you have to use nodejs and [**JSDoc**](https://github.com/jsdoc3/jsdoc).

If you installed JSDoc locally, the JSDoc command-line tool is available in *./node_modules/.bin*. To generate documentation for the project, open a terminal in the *MeshLabJS/doc/* directory and run:
```
/path_to_JSDoc_install_folder/node_modules/.bin/jsdoc -c conf.json
```

Or if you installed JSDoc globally, simply run the jsdoc command:
```
jsdoc -c conf.json
```
All the javascript documentation is created in a local 'html' folder that is ignored by git and can be deleted without risks. For opening the documentation, go to *MeshLabJS/doc/html/* directory and open the *index.html* file.
