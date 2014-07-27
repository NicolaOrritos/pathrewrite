# pathrewrite

> Rewrite paths with simple 'replace' rules


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

You can also load multiple rules at once using the following:
```js
var rules = pathrewrite.Rule.loadMulti( [
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


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com).


## License

Copyright (c) 2014 Nicola Orritos  
Licensed under the MIT license.
