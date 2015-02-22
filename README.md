# inlineCSS

A [NodeJS](http://nodejs.org/) package for inlining external stylesheets and embedded style tags into html content.

## Install

`npm install inlinecss`

## Usage
	var inlineCSS = require('inlinecss');
	var html = inlineCSS.inlineHtml('<style>p{height:50px;}</style><p>Text</p>');

## Methods

### inlineHtml(html, options)

Inlines raw html content

- `html` - Raw html
- `options` - See Options below

### inlineFile(inFile, outFile, options)

Creates an inlined html file

- `inFile` - Location of file to be inlined
- `outFile` - Destination of generated file
- `options` - See Options below

## Options

#### options.cssRoot
Define an optional base directory for external stylesheets

Type: `String`  
Default: `''`

#### options.removeClasses
Remove class attributes

Type: `Boolean`  
Default: `true`

## Dependencies
- [cheerio](https://github.com/cheeriojs/cheerio)
- [css-rules](https://github.com/jonkemp/css-rules)

## License

MIT © Rɪpəl Labs
