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

function isString(str)
{
    return (typeof str === 'string' || str instanceof String);
}

function isNumber(num)
{
    return !(isNaN(num));
}


function Rules(strict)
{
    this.strict = (strict === true);
    this.num    = 0;
    this.rules  = {};
}

Rules.prototype.add = function(from, to)
{
    var fromOK = false;
    var ok     = false;
    
    if (from !== undefined && from !== null && to !== undefined && to !== null)
    {
        if (isString(from))
        {
            if (from.length > 0 && from.trim().length > 0)
            {
                fromOK = true;
            }
            else
            {
                throw new Error('Parameter "from" was empty');
            }
        }
        else if (isNumber(from))
        {
            fromOK = true;
        }
        else
        {
            throw new Error('Parameter "from" was of a wrong type');
        }
        
        if (fromOK)
        {
            if (isString(to))
            {
                if (to.length > 0 && to.trim().length > 0)
                {
                    ok = true;
                }
                else if (to.length === 0)
                {
                    ok = true;
                }
                else
                {
                    throw new Error('Parameter "to" was malformed');
                }
            }
            else if (isNumber(to))
            {
                ok = true;
            }
            else
            {
                throw new Error('Parameter "to" was of a wrong type');
            }
        }
    
        if (ok)
        {
            this.num++;

            this.rules[from]  = to;
        }
    }
    else
    {
        throw new Error('Parameters "from" and/or "to" were empty or of a wrong type');
    }
};

Rules.prototype.all = function()
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

Rules.loadMulti = function(arr, strict)
{
    var result = new Rules(strict);
    
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

Rules.prototype.checkStrictness = function(str)
{
    var result = false;
    
    if (this.strict)
    {
        /* jshint laxbreak: true */
        if (   str !== undefined
            && str !== null
            && isString(str)
            && str.length > 0
            && str.indexOf('..') === -1
            && str.indexOf('%')  === -1
            && str.indexOf('$')  === -1)
        {
            result = true;
        }
        /* jshint laxbreak: false */
    }
    else
    {
        result = true;
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
                else if (rls[splitted[a]] !== undefined && rls[splitted[a]] !== null)
                {
                    result = result.concat(rls[splitted[a]]);
                    result = result.concat(path.sep);
                }
                else if (splitted[a].indexOf('%') === 0 && splitted[a].length === 2)
                {
                    var num = parseInt(splitted[a].slice(1), 10);
                    
                    if (isNumber(num) && arguments[num + 1])
                    {
                        result = result.concat(arguments[num + 1]);
                        result = result.concat(path.sep);
                    }
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
            
            if (rules.checkStrictness(result) === false)
            {
                throw new Error('The result did not match the "strict" requirement of the rules');
            }
            else
            {
                result = path.normalize(result);
            }
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
