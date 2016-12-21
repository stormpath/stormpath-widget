import {expect} from 'chai';
import UriParser from '../src/data/uri';

describe('UriParser', () => {
  it('should be a constructor', () => {
    expect(UriParser).to.be.a('function');
  });

  it('should create a parser with an undefined uri', () => {
    let p = new UriParser();
    expect(p).to.be.an('object');
  });

  it('should create a parser with a uri', () => {
    let p = new UriParser('http://foo.bar.example');
    expect(p).to.be.an('object');
  });

  describe('hasParameter()', () => {
    it('should return false for null uri', () => {
      let p = new UriParser();
      expect(p.hasParameter('foo')).to.be.false;
    });

    it('should return false for missing uri part', () => {
      let p = new UriParser('http://foo');
      expect(p.hasParameter('bar')).to.be.false;
    });

    it('should return true', () => {
      let p = new UriParser('http://foo?bar=baz');
      expect(p.hasParameter('bar')).to.be.true;
    });
  });
});
