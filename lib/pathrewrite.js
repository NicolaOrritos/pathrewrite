/*
 * pathrewrite
 * http://github.com/NicolaOrritos/pathrewrite
 *
 * Copyright (c) 2014 Nicola Orritos
 * Licensed under the MIT license.
 */

'use strict';


const path = require('path');


function stringEndsWith(str, searchString)
{
    let result = false;

    if (str && searchString)
    {
        const lastIndex = str.lastIndexOf(searchString);

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
    let fromOK = false;
    let ok     = false;

    if (from !== undefined && from !== null && to !== undefined && to !== null)
    {
        if (isString(from))
        {
            if (from && from.trim())
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
                if (to.trim().length > 0 || to.length === 0)
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

            this.rules[from] = to;
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
    const result = new Rules(strict);

    if (arr instanceof Array)
    {
        for (const item of arr)
        {
            if (item)
            {
                result.add(item.FROM, item.TO);
            }
        }
    }

    return result;
};

Rules.prototype.checkStrictness = function(str)
{
    let result = false;

    if (this.strict)
    {
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
    }
    else
    {
        result = true;
    }

    return result;
};


module.exports =
{
    Rules: Rules,

    go: function(inPath, rules)
    {
        let result;

        if (inPath && rules instanceof Rules)
        {
            const rls   = rules.all();
            const split = inPath.split(path.sep);

            if (split.length > 0)
            {
                result = '';

                for (const item of split)
                {
                    if (item === '')
                    {
                        result = result.concat(path.sep);
                    }
                    else if (rls[item] === '')
                    {
                        /* Simply ignore this part of the original path,
                         * actually causing its removal */
                    }
                    else if (rls[item] !== undefined && rls[item] !== null)
                    {
                        result = result.concat(rls[item]);
                        result = result.concat(path.sep);
                    }
                    else if (item.indexOf('%') === 0 && item.length === 2)
                    {
                        let num = parseInt(item.slice(1), 10);

                        if (isNumber(num) && arguments[num + 1])
                        {
                            result = result.concat(arguments[num + 1]);
                            result = result.concat(path.sep);
                        }
                    }
                    else
                    {
                        result = result.concat(item);
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
    }
};
