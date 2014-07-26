'use strict';

var pathrewrite = require('../lib/pathrewrite.js');

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

exports.pathrewrite =
{
    setUp: function(done)
    {
        // setup here
        done();
    },
    
    'simple': function(test)
    {
        test.expect(4);
        
        test.ok(pathrewrite);
        
        
        var rules = new pathrewrite.Rules();
        
        test.ok(rules);
        
        rules.add('pippo', 'baudo');
        
        var result = pathrewrite.go('/pippo/baudo/', rules);
        
        test.ok(result);
        
        test.deepEqual(result, '/baudo/baudo/');
        
        
        test.done();
    }
};
