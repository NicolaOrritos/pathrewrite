# pathrewrite

Rewrite paths with simple 'replace' rules.


## Getting Started

Install the module with: `npm install pathrewrite`

Then use the 'Rules' class and the 'go()' function to substitute paths:
```js
var pathrewrite = require('pathrewrite');

var rules = new pathrewrite.Rules();
rules.add("lost", 'back');

var result = pathrewrite.go('/I/am/lost/', rules);

// result is '/I/am/back/'
```

You can also load multiple rules at once using the following syntax:
```js
var rules = pathrewrite.Rules.loadMulti( [
    {
        FROM: 'a',
        TO: 'b'
    },
    {
        FROM: 'c',
        TO: 'd'
    }
] );
```


## "Strict" rules

Both the Rules constructor and the _loadMulti()_ method accept the optional _"strict"_ parameter, of type boolean.  
When _strict_ is _true_ an additional set of checks is enacted when calling the _pathrewrite.go()_ method.  
Currently the following are checked:
* The resulting path must not contain the string _".."_
* The resulting path must not contain the character _"%"_
* The resulting path must not contain the character _"$"_


## Positional parameters

_Positional-parameters_ substitutions can be requested right from the _run()_ method,
by passing to it an arbitrary number of arguments that will be substituted in the result.  
_"%n"-style_ placeholders must be put in the path to signal where the parameters should be inserted instead.
The order of the parameters is strictly position-based, hence the first argument to the _run()_ method after the _'rules'_ one
will fill the placeholder named _'%1'_ in the input path, as follows:
```js
var rules = pathrewrite.Rules.loadMulti([]); // Empty set of rules...
var result = pathrewrite.go('a/%1/c', rules, 'b');

// result is 'a/b/c'

result = pathrewrite.go('a/%1/%2/', rules, 'b', 'c');

// result is 'a/b/c/'
```

The index of the parameters position is 1-based. A parameter can be substituted as many times as it appears in the input path, regardless of the position it appears in it:
```js
result = pathrewrite.go('/%2/%1/%1/%1/%1/%1/%1/%1/%1/%1', rules, 'a', 'b');
        
// result is '/b/a/a/a/a/a/a/a/a/a'
```


## Examples

Here are some other examples:
```js
// Remove previously added rules:
rules.clear();
rules.add("your", 'my');

// 'count' will be '1':
console.log(rules.count());

result = pathrewrite.go('/this/is/your/file.txt', rules);

// result is '/this/is/my/file.txt'
```

And another one demo-ing some tolerance towards the inputs:
```js
rules.clear();
rules.add("home", 'root');

result = pathrewrite.go('/home//user/file.txt', rules);

// result is '/root/user/file.txt'
```

Finally, this one throws an error:
```js
var strict = true;
var rules  = new pathrewrite.Rules(strict);
rules.add('home', '..');

/* This 'go' method throws an error because of the ".." string
 * specified above, which gets caught by the "strict" checks. */
result = pathrewrite.go('home/root/file.txt', rules);
```


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com).


## License

Copyright (c) 2014 Nicola Orritos  
Licensed under the MIT license.
