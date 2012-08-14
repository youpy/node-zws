(function () {
  var ZWS = {};

  // global on the server, window in the browser
  var root         = this,
      previous_zws = root.ZWS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZWS;
  } else {
    root.ZWS = ZWS;
  }

  ZWS.noConflict = function () {
    root.ZWS = previous_zws;
    return ZWS;
  };

  ZWS.chars = ['\u200b', '\u200c'];

  ZWS.encode = function(text) {
    var binaryArray = reduce(text.split(regExpForSplit), function(result, c) {
      return result.concat(charCodeToUTF8BinaryArray(c.charCodeAt(0)));
    }, []);

    return reduce(binaryArray, function(result, item) {
      return result + ZWS.chars[+item];
    }, '');
  };

  ZWS.decode = function(mixedText) {
    return mixedText.replace(regExpForEncodedText(), function(encodedText) {
      return decode(encodedText);
    });
  };

  ZWS.isEncoded = function(text) {
    return regExpForEncodedText().test(text);
  };

  var regExpForSplit = new RegExp('');
  var regExpForEncodedText = function() {
    return new RegExp('[' + ZWS.chars.join('') + ']+', 'g');
  };

  var decode = function (encodedText) {
    var index        = 0,
        binaryString = encodedTextToBinaryString(encodedText),
        charCodes    = [],
        slicedStr,
        matched;

    while((slicedStr = binaryString.slice(index, index += 8)).length > 0) {
      matched = slicedStr.match(/^(1+)/);

      if(matched) {
        charCodes.push(
          parseInt(
            slicedStr + binaryString.slice(
              index,
              index += (8 * (matched[1].length - 1))),
            2));
      } else {
        charCodes.push(
          parseInt(slicedStr, 2));
      }        
    }

    return reduce(charCodes, function(result, charCode) {
      return result + decodeURIComponent(charCode.toString(16).replace(/.{2}/g, function(str) { return '%' + str; }));
    }, '');
  };

  var charCodeToUTF8BinaryArray = function(charCode) {
    var utf8 = charCode > 0x7f ?
      parseInt(encodeURIComponent(String.fromCharCode(charCode)).replace(/%/g, ''), 16) :
      charCode;

    return pad(utf8);
  };

  var pad = function(charCode) {
    var binaryString = charCode.toString(2),
        lengthToPad  = charCode > 0x7f ? 0 : 8 - binaryString.length;

    for(var i = 0; i < lengthToPad; i ++) {
      binaryString = '0' + binaryString;
    };

    return binaryString.split(regExpForSplit);
  };

  var encodedTextToBinaryString = function(encodedText) {
    return map(encodedText.split(regExpForSplit), function(c) {
      return c == ZWS.chars[0] ? '0' : '1';
    }).join('');
  };

  var map = function(items, callback) {
    var length = items.length,
        result = [];

    for(var i = 0; i < length; i ++) {
      result.push(callback.call(null, items[i]));
    }

    return result;
  };

  var reduce = function(items, callback, result) {
    var length = items.length,
        result = [];

    for(var i = 0; i < length; i ++) {
      result = callback.call(null, result, items[i]);
    }

    return result;
  };
}());
