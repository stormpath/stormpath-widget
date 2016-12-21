import {expect} from 'chai';
import UriParser from '../src/data/uri';

describe('UriParser', () => {
  it('should be a constructor', () => {
    expect(UriParser).to.be.function;
  });

  it('should create a parser with an undefined URI', () => {
    let parser = new UriParser();
    expect(parser).to.be.an('object');
  });

  it('should create a parser with a URI', () => {
    let parser = new UriParser('http://foo.bar.example');
    expect(parser).to.be.an('object');
  });

  describe('hasParameter()', () => {
    it('should return false for null URI', () => {
      let parser = new UriParser();
      expect(parser.hasParameter('foo')).to.be.false;
    });

    it('should return false for missing URI part', () => {
      let parser = new UriParser('http://foo');
      expect(parser.hasParameter('bar')).to.be.false;
    });

    it('should return true', () => {
      let parser = new UriParser('http://foo?bar=baz');
      expect(parser.hasParameter('bar')).to.be.true;
    });
  });

  describe('extract()', () => {
    it('should return the original URI unchanged for no match', () => {
      let parser = new UriParser('http://foo');
      expect(parser.extract('bar').original).to.eql('http://foo');
    });

    it('should return the original URI unchanged for a match', () => {
      let parser = new UriParser('http://foo?bar=1');
      expect(parser.extract('bar').original).to.eql('http://foo?bar=1');
    });

    it('should return a new URI with the parameter removed from the beginning', () => {
      let parser = new UriParser('http://foo?bar=1&baz=2');
      let result = parser.extract('bar');
      expect(result.new).to.eql('http://foo?baz=2');
      expect(result.value).to.eql('1');
    });

    it('should return a new URI with the parameter removed from the middle', () => {
      let parser = new UriParser('http://foo?baz=2&bar=1&qux=3');
      let result = parser.extract('bar');
      expect(result.new).to.eql('http://foo?baz=2&qux=3');
      expect(result.value).to.eql('1');
    });

    it('should return a new URI with the parameter removed from the end', () => {
      let parser = new UriParser('http://foo?baz=2&bar=1');
      let result = parser.extract('bar');
      expect(result.new).to.eql('http://foo?baz=2');
      expect(result.value).to.eql('1');
    });

    it('should remove the query mark if the match is the only parameter', () => {
      let parser = new UriParser('http://foo?bar=1');
      let result = parser.extract('bar');
      expect(result.new).to.eql('http://foo');
      expect(result.value).to.eql('1');
    });

    it('should ignore matching names before the query part', () => {
      let parser = new UriParser('http://foobar?bar=1');
      let result = parser.extract('bar');
      expect(result.new).to.eql('http://foobar');
      expect(result.value).to.eql('1');
    });
  });
});
