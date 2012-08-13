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
    var i,
        len         = text.length,
        binaryArray = [],
        encodedText = '';

    for(i = 0; i < len; i ++) {
      Array.prototype.push.apply(binaryArray, charCodeToUTF8BinaryArray(text.charCodeAt(i)));
    }

    len = binaryArray.length;
    
    for(i = 0; i < len; i ++) {
      encodedText += ZWS.chars[+binaryArray[i]];
    }

    return encodedText;
  };

  ZWS.decode = function(mixedText) {
    var re = new RegExp('[' + ZWS.chars.join('') + ']+', 'g');

    return mixedText.replace(re, function(encodedText) {
      return decode(encodedText);
    });
  };

  var decode = function (encodedText) {
    var index        = 0,
        text         = '',
        binaryString = encodedTextToBinaryString(encodedText),
        charCodes    = [],
        slicedStr,
        len, matched;

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

    len = charCodes.length;

    for(var i = 0; i < len; i ++) {
      text += decodeURIComponent(charCodes[i].toString(16).replace(/.{2}/g, function(str) { return '%' + str; }));
    }

    return text;
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

    return binaryString.split(new RegExp(''));
  };

  var encodedTextToBinaryString = function(encodedText) {
    var binaryString = '',
        array        = encodedText.split(new RegExp('')),
        len          = array.length;

    for(var i = 0; i < len; i ++) {
      binaryString += array[i] == ZWS.chars[0] ? '0' : '1';
    }

    return binaryString;
  };
}());
