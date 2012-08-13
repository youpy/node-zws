# ZWS.js

ZWS is a library to encode/decode text using zero width spaces.

## Synopsis

```js
var encoded = ZWS.encode('hello');

console.log(encoded) //=> ""

console.log(ZWS.decode(encoded)) //=> "hello"
```

## Installation

    npm install zws
