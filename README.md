# pathrewrite

> Rewrite paths with simple 'replace' rules


## Getting Started

Install the module with: `npm install pathrewrite`

```js
var pathrewrite = require('pathrewrite');

var rules = new pathrewrite.Rules();
rules.add("lost", 'back');

var result = pathrewrite.go('/I/am/lost/', rules);

// result is '/I/am/back/'
```


## Examples

_(Coming soon)_


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com).


## License

Copyright (c) 2014 Nicola Orritos  
Licensed under the MIT license.
