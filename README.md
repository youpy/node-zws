# ZWS.js

ZWS is a library to decode/encode text using zero width spaces.

## Synopsis

```js
var encoded = ZWS.encode('hello');

console.log(encoded) //=> ""

console.log(ZWS.decode(encoded)) //=> "hello"
```
