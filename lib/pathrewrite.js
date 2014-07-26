/*
 * pathrewrite
 * http://github.com/NicolaOrritos/pathrewrite
 *
 * Copyright (c) 2014 Nicola Orritos
 * Licensed under the MIT license.
 */

'use strict';


var path = require('path');


// String.endsWith() polyfill:
if (!String.prototype.endsWith)
{
    Object.defineProperty(String.prototype, 'endsWith',
    {
        enumerable: false,
        configurable: false,
        writable: false,
        
        value: function (searchString, position)
        {
            position = position || this.length;
            position = position - searchString.length;
            var lastIndex = this.lastIndexOf(searchString);
            return lastIndex !== -1 && lastIndex === position;
        }
    });
}


function Rules()
{
    this.rules = {};
}

Rules.prototype.add = function(from, to)
{
    this.rules[from] = to;
};

Rules.prototype.all = function()
{
    return this.rules;
};


module.exports = {
    
    Rules: Rules,
    
    go:    function rewrite(inPath, rules)
    {
        var result = inPath;
        
        if (inPath && rules instanceof Rules)
        {
            var rls      = rules.all();
            var splitted = inPath.split(path.sep);
            
            if (splitted.length > 0)
            {
                result = '';
                
                for (var a=0; a<splitted.length; a++)
                {
                    if (splitted[a] === '')
                    {
                        result += path.sep;
                    }
                    else if (rls[splitted[a]])
                    {
                        result += rls[splitted[a]] + path.sep;
                    }
                    else
                    {
                        result += splitted[a];
                    }
                }
            }
        }
        
        return result;
    }
};
