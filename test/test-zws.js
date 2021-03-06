var ZWS    = require('../index'),
    should = require('should');

describe('ZWS', function() {
  it('should encode a text with zero width spaces', function(done) {
    var encoded = ZWS.encode("hello あああ");

    encoded.length.should.eql(120); // 24*3+8*6
    encoded.should.match(/^[\u200b\u200c]+$/);
    done();
  });

  it('should decode encoded text', function(done) {
    [
      'hello',
      'hello あああ اللغة العربية'
    ].forEach(function(text) {
      ZWS.decode(ZWS.encode(text)).should.eql(text);
    });
    
    done();
  });

  it('should decode mixed text', function(done) {
    var encoded = ZWS.encode('hello');

    ZWS.decode(encoded + ' world ' + encoded).should.eql('hello world hello');

    done();
  });

  it('should detect whether given text has encoded part', function(done) {
    ZWS.isEncoded('hello').should.not.be.true;
    ZWS.isEncoded(ZWS.encode('hello')).should.be.true;
    ZWS.isEncoded('aaa' + ZWS.encode('hello') + 'bbb').should.be.true;

    done();
  });
});
