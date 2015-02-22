var inlineCSS = require('../index'),
	fs = require('fs');
	
var inFile = 'test/html/in.html',
	outFile = 'test/html/out.html';
	
console.log('Test: Inlining file');
console.log('----------------------------------');
console.log('File: ' + inFile + '\n');

	inlineCSS.inlineFile(inFile, outFile);
console.log('Generated file `' + outFile + '`\n\n');

var html = '<style>\n\tp { height: 50px; } \n\t.info { font-weight: bold; }\n</style>\n<p class="info">This is a paragraph</p>';

console.log('Test: Inlining html' );
console.log('----------------------------------');
console.log('Html:\n' + html + '\n');
	html = inlineCSS.inlineHtml(html);
console.log('Generated:' + html);