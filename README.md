# ZWS.js

ZWS is a library to encode/decode text using zero width spaces.

Inspired by [ucnv](https://twitter.com/ucnv/)'s [tweet](https://twitter.com/ucnv/status/234693886218498048).

## Synopsis

```js
var encoded = ZWS.encode('hello');

console.log(encoded) //=> ""

console.log(ZWS.decode(encoded)) //=> "hello"

console.log(ZWS.decode(encoded + ' world')) //=> "hello world"
```

## Installation

    npm install zws

## See also

- http://d.hatena.ne.jp/kazuhooku/20080828/1219913655
- http://search.cpan.org/dist/Convert-BaseN/