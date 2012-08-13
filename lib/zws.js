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
      Array.prototype.push.apply(binaryArray, charCodeToBinaryArray(text.charCodeAt(i)));
    }

    len = binaryArray.length;
    
    for(i = 0; i < len; i ++) {
      encodedText += ZWS.chars[+binaryArray[i]];
    }

    return encodedText;
  };

  ZWS.decode = function(encodedText) {
    var index        = 0,
        text         = '',
        binaryString = encodedTextToBinaryString(encodedText),
        charCodes    = [],
        slicedStr,
        len;

    while((slicedStr = binaryString.slice(index, index += 8)).length > 0) {
      if(/^1111110/.test(slicedStr)) { // 6bytes
        charCodes.push(parseInt(slicedStr + binaryString.slice(index, index += 40), 2));
      } else if(/^111110/.test(slicedStr)) { // 5bytes
        charCodes.push(parseInt(slicedStr + binaryString.slice(index, index += 32), 2));
      } else if(/^11110/.test(slicedStr)) { // 4bytes
        charCodes.push(parseInt(slicedStr + binaryString.slice(index, index += 24), 2));
      } else if(/^1110/.test(slicedStr)) { // 3bytes
        charCodes.push(parseInt(slicedStr + binaryString.slice(index, index += 16), 2));
      } else if(/^110/.test(slicedStr)) { // 2bytes
        charCodes.push(parseInt(slicedStr + binaryString.slice(index, index += 8), 2));
      } else { // 1byte
        charCodes.push(parseInt(slicedStr, 2));
      }        
    }

    len = charCodes.length;

    for(var i = 0; i < len; i ++) {
      text += String.fromCharCode(charCodes[i]);
    }

    return text;
  };

  var charCodeToBinaryArray = function(charCode) {
    var length;

    if(charCode >= 0x4000000) { // 6bytes
      charCode += 0xfc << 40;
      length = 48;
    } else if(charCode >= 0x200000) { // 5bytes
      charCode += 0xf8 << 32;
      length = 40;
    } else if(charCode >= 0x10000) { // 4bytes
      charCode += 0xf0 << 24;
      length = 32;
    } else if(charCode >= 0x400) { // 3bytes
      charCode += 0xe0 << 16;
      length = 24;
    } else if(charCode & 0x80) { // 2bytes
      charCode += 0xc0 << 8;
      length = 16;
    } else { // 1byte
      length = 8;
    }

    return pad(charCode, length);
  };

  var pad = function(charCode, length) {
    var binaryString = charCode.toString(2),
        lengthToPad  = length - binaryString.length;

    for(var i = 0; i < lengthToPad; i ++) {
      binaryString = '0' + binaryString;
    };

    return binaryString.split(new RegExp(''));
  };

  var encodedTextToBinaryString = function(encodedText) {
    var binaryString = '',
        array        = encodedText.split(new RegExp('')),
        len          = encodedText.length;

    for(var i = 0; i < len; i ++) {
      binaryString += array[i] == ZWS.chars[0] ? '0' : '1';
    }

    return binaryString;
  };
}());
