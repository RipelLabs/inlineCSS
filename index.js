var fs = require('fs'),
    path = require('path'),
    cheerio = require('cheerio'),
    parseCSS = require('css-rules');

// EXPORTS: INLINE FILE
exports.inlineFile = function(inFile, outFile, param1, param2) {
    var options = {},
        callback = null;
    
    if(param1) {
        if(typeof param1 === 'object')
            options = param1;
        else if(typeof param1 === 'function')
            callback = param1;
    }
    
    if(param2) {
        if(typeof param2 === 'function' && callback === null) {
            callback = param2;
        } else {
            console.log('Error: Invalid param');
            return;   
        }
    }
    
    if(callback === null) {
        console.log('Error: No callback function specified');
        return;   
    }

    makeDirectoryRecursive(path.dirname(outFile), function() {
       options.cssRoot = inFile.substring(0,inFile.lastIndexOf(getPathSeparator(inFile))+1);

        fs.readFile(inFile, 'utf8', function(err, html) {
           inline(html, options, function(inlineHtml) {
                // Write to file
                fs.writeFile(outFile, inlineHtml, 'utf8', function() {
                    callback();   
                }); 
            }); 
        });        
    });
};

// EXPORTS: INLINE HTML
exports.inlineHtml = function(html, param1, param2) {
    var options = {},
        callback = null;
    
    if(param1) {
        if(typeof param1 === 'object')
            options = param1;
        else if(typeof param1 === 'function')
            callback = param1;
    }
    
    if(param2) {
        if(typeof param2 === 'function' && callback === null) {
            callback = param2;
        } else {
            console.log('Error: Invalid param');
            return;   
        }
    }
    
    if(callback === null) {
        console.log('Error: No callback function specified');
        return;   
    }
    
    inline(html, options, function(html) {
        callback(html);
    });
    
};

// FUNCTION: inline
function inline(html, options, callback) {
    var settings = {
        cssRoot: '',
        removeClasses: true
    };

    for(var prop in settings) { if(typeof options[prop] !== 'undefined') settings[prop] = options[prop]; }

    $ = cheerio.load(html);
    
    var stylesheets = [];
    
    $('link').each(function(i, elem) {
        // Ignore remote files
        if(elem.attribs.href.substring(0, 4) != 'http' && elem.attribs.href.substring(0, 3) != 'ftp')
            stylesheets.push(settings.cssRoot + elem.attribs.href);
            $(this).remove();
    });
    
    inlineStylesheetRecursive(stylesheets, function() {
        
        // Loop through embedded style tags
        $('style').each(function(i, elem) {
            embedStyles($(this).text());
            $(this).remove();
        });

        if(settings.removeClasses == true) {
            $('*').removeAttr('class');
        }

        callback($.html());     
    });  
}

// FUNCTION: inlineStylesheetRecursive
// Loop through external stylesheets
function inlineStylesheetRecursive(stylesheets, callback) {
    if(stylesheets.length > 0) {
        fs.readFile(stylesheets[0], 'utf8', function(err, css) {
            embedStyles(css);
            stylesheets.shift();
            inlineStylesheetRecursive(stylesheets, callback);
        });    
    } else {
        callback();   
    }
}

// FUNCTION: makeDirectoryRecursive
function makeDirectoryRecursive(dirPath, callback) {
    fs.exists(dirPath, function(exists) {
        if(!exists) {
            fs.mkdir(dirPath, function(err) {
                if (err && err.code == 'ENOENT') {
                      makeDirectoryRecursive(path.dirname(dirPath));
                      makeDirectoryRecursive(dirPath, callback);
                } else {
                    if(callback) callback();
                }
            });
        } else {
            if(callback) callback();
        }
    });  
}

// FUNCTION: getPathSeparator
function getPathSeparator(path) {
    if(path.indexOf('\\') > -1)
        return '\\';
    else
        return '/';   
};

// FUNCTION: embedStyles
function embedStyles(css) {
    parseCSS(css).forEach(function (rule) {
        var selector = rule[0];
            data = rule[1],
            style = '';

        // Not a pseudo-class
        if(!/\:.*/i.test(selector)) {
            var $elem = $(selector);

            if(typeof $elem.attr('style') !== 'undefined') {
                style = $elem.attr('style').trim();

                if(style.charAt(style.length - 1) != ';')
                    style += ';';
            }

            for(var i=0; i<data.length; i++)
                style += ' ' + data[i] + ':' + data[data[i]] + ';';

            $elem.attr('style', style.trim());
        }
    });
}