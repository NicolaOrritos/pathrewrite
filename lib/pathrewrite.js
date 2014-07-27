/*
 * pathrewrite
 * http://github.com/NicolaOrritos/pathrewrite
 *
 * Copyright (c) 2014 Nicola Orritos
 * Licensed under the MIT license.
 */

'use strict';


var path = require('path');


function stringEndsWith(str, searchString)
{
    var result = false;
    
    if (str && searchString)
    {
        var lastIndex = str.lastIndexOf(searchString);

        result = lastIndex !== -1 && lastIndex === (str.length - 1);
    }
    
    return result;
}


function Rules()
{
    this.num   = 0;
    this.rules = {};
}

Rules.prototype.add   = function(from, to)
{
    this.num++;
    
    this.rules[from]  = to;
};

Rules.prototype.all   = function()
{
    return this.rules;
};

Rules.prototype.count = function()
{
    return this.num;
};

Rules.prototype.clear = function()
{
    this.num   = 0;
    this.rules = {};
};

Rules.loadMulti       = function(arr)
{
    var result = new Rules();
    
    if (arr instanceof Array)
    {
        for (var a=0; a<arr.length; a++)
        {
            var item = arr[a];
            
            if (item.FROM && item.TO)
            {
                result.add(item.FROM, item.TO);
            }
        }
    }
    
    return result;
};


var process = function(inPath, rules)
{
    var result;

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
                    result = result.concat(path.sep);
                }
                else if (rls[splitted[a]])
                {
                    result = result.concat(rls[splitted[a]]);
                    result = result.concat(path.sep);
                }
                else
                {
                    result = result.concat(splitted[a]);
                    result = result.concat(path.sep);
                }
            }
            
            if ( !stringEndsWith(inPath, path.sep) && stringEndsWith(result, path.sep) )
            {
                result = result.slice(0, -1);
            }
            
            result = path.normalize(result);
        }
        else
        {
            result = inPath;
        }
    }
    else
    {
        result = inPath;
    }


    return result;
};


module.exports = {
    
    Rules: Rules,
    go:    process
};
