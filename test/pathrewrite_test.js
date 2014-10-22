'use strict';

var pathrewrite = require('../lib/pathrewrite');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

function parametricTest(strict, test)
{
    test.expect(16);

    test.ok(pathrewrite);


    var rules  = new pathrewrite.Rules(strict);

    test.ok(rules);

    rules.add('pippo', 'baudo');

    test.deepEqual(rules.count(), 1);

    var result = pathrewrite.go('/pippo/baudo/', rules);

    test.ok(result);

    test.deepEqual(result, '/baudo/baudo/');


    rules.clear();
    rules.add('lost', 'back');

    result = pathrewrite.go('/I/am/lost/', rules);

    test.deepEqual(result, '/I/am/back/');


    rules.clear();
    rules.add('your', 'my');

    result = pathrewrite.go('/this/is/your/file.txt', rules);

    test.deepEqual(result, '/this/is/my/file.txt');


    rules.clear();
    rules.add('home', 'root');

    result = pathrewrite.go('/home//user/file.txt', rules);

    test.deepEqual(result, '/root/user/file.txt');


    rules.clear();
    rules.add('home', '');

    result = pathrewrite.go('/home/user/file.txt', rules);

    test.deepEqual(result, '/user/file.txt');


    rules.clear();
    test.throws(function(){rules.add('', 'somethingelse');});
    test.throws(function(){rules.add('something', ' ');});
    test.throws(function(){rules.add('', '');});
    test.throws(function(){rules.add(' ', '');});
    test.throws(function(){rules.add(' ', ' ');});
    test.throws(function(){rules.add('', ' ');});


    rules.clear();
    rules.add('home', '$HOME');

    if (strict)
    {
        test.throws(function(){pathrewrite.go('/home/user/file.txt', rules);});
    }
    else
    {
        result = pathrewrite.go('/home/user/file.txt', rules);

        test.deepEqual(result, '/$HOME/user/file.txt');
    }


    /* rules = new pathrewrite.Rules(false);
    rules.add('home', '..');

    test.deepEqual(result, '../user/file.txt'); */


    test.done();
}

exports.pathrewrite =
{
    setUp: function(done)
    {
        // setup here
        done();
    },
    
    'simple': function(test)
    {
        parametricTest(false, test);
    },
    
    'strict': function(test)
    {
        parametricTest(true, test);
    },
    
    'load multi': function(test)
    {
        test.expect(3);
        
        
        var rules = pathrewrite.Rules.loadMulti([{FROM: "a", TO: "b"}]);
        
        test.deepEqual(rules.count(), 1);
        
        
        rules = pathrewrite.Rules.loadMulti([{FROM: "a", TO: "b"}, {FROM: "c", TO: "d"}]);
        
        test.deepEqual(rules.count(), 2);
        
        
        var result = pathrewrite.go('/a/b/c/d', rules);

        test.deepEqual(result, '/b/b/d/d');
        
        
        test.done();
    }
};
