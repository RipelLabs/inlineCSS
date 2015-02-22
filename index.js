var fs = require('fs'),
    cheerio = require('cheerio'),
    parseCSS = require('css-rules');

exports.inlineFile = function(inFile, outFile, options) {
    options = options || {};
    options.cssRoot = inFile.substring(0,Math.max(inFile.lastIndexOf("/"), inFile.lastIndexOf("\\"))+1);
    
    var html = inline(fs.readFileSync(inFile, 'utf8'), options);

    // Write to file
    fs.writeFileSync(outFile, html, 'utf8');
};

exports.inlineHtml = function(html, options) {
    options = options || {};
    return inline(html, options);
};

function inline(html, options) {
    var settings = {
        cssRoot: '',
        removeClasses: true
    };

    for(var prop in settings) { if(typeof options[prop] !== 'undefined') settings[prop] = options[prop]; }

    $ = cheerio.load(html);
    
    // Loop through external stylesheets   
    $('link').each(function(i, elem) {
        // Ignore remote files
        if(elem.attribs.href.substring(0, 4) != 'http' && elem.attribs.href.substring(0, 3) != 'ftp') {            
            embedStyles(fs.readFileSync(settings.cssRoot + elem.attribs.href, 'utf8'));
            $(this).remove();
        }
    });

    // Loop through embedded style tags
    $('style').each(function(i, elem) {
        embedStyles($(this).text());
        $(this).remove();
    });
    
    if(settings.removeClasses == true) {
        $('*').removeAttr('class');
    }
    
    return $.html();
}

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