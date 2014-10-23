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


## Examples

Here are some other examples:
```js
// Remove previously added rules:
rules.clear();
rules.add("your", 'my');

// 'count' will be '1':
rules.count();

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
