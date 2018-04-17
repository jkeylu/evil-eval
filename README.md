# evil-eval

A JavaScript interpreter written in JavaScript.

## Why

Yout might working in a JavaScript environment where `eval()` and `new Function()` are not allowed (eg: WeChat Mini Program), and you probably have a good reason to use it.

## Usage

```js
import { runInContext } from 'evil-eval';

const code = `
    function hello(name) {
        return 'Hello ' + (name || defaultName) + '!';
    }

    module.exports = hello;
`;
const sandbox = { defaultName: 'World' };
const hello = runInContext(code, sandbox);
hello();
```

## Inspired by

- [jsjs](https://github.com/bramblex/jsjs)
- [vm.js](https://github.com/axetroy/vm.js)

## License

MIT
