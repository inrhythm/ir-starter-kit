'use strict';

var fs =  require('fs'),
	path = require('path'),
	root,
	config,
	rel;

root = path.resolve(__dirname, '../');

process.chdir(path.resolve(root, '../../'));


function linkFile(filename) {
	config = path.resolve(__dirname, '../' + filename);
	rel = path.relative(process.cwd(), config);

	if (!fs.existsSync(filename)) {
		fs.symlinkSync(rel, filename);
	}	
}

['webpack.config.js', '.editorconfig', '.eslintrc', '.gitignore'].map(linkFile);

