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

    it('should not consume the query fragment', () => {
      let parser = new UriParser('http://foobar?bar=1#inbox');
      let result = parser.extract('bar');
      expect(result.new).to.eql('http://foobar#inbox');
      expect(result.value).to.eql('1');
    });

    it('should extract the jwtResponse', () => {
      let parser = new UriParser('http://localhost:3000/?jwtResponse=eyJraWQiOiJCT1NJWUg4QkNNMEtXUDRKSk9FVTVLR1FYIiwic3R0IjoiYXNzZXJ0aW9uIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiJodHRwczovL2FwaS5zdG9ybXBhdGguY29tL3YxL2FjY291bnRzLzRUWkg2OGNObXZOejdkakFzNWhvYkciLCJqdGkiOiI1ZTIyMjU4NC1iNjUwLTQ3MzgtYmIwZS0zNzdiMWQ0YzAzMzgiLCJpc3MiOiJodHRwczovL2FwaS5zdG9ybXBhdGguY29tL3YxL2FwcGxpY2F0aW9ucy8ybW9Obkl2SUU4aTV6c3JtcWlSek8zIiwiYXVkIjoiQk9TSVlIOEJDTTBLV1A0SkpPRVU1S0dRWCIsImlhdCI6MTQ4MjM0MjUyOSwiZXhwIjoxNDgyMzQyNTg5LCJzdGF0dXMiOiJBVVRIRU5USUNBVEVEIiwiaXNOZXdTdWIiOmZhbHNlLCJpcnQiOiI2Nzc3ZDBiNi0wNzcxLTQ1NTEtOGQ1ZS1kYzQ5Y2ZkMTVkYjUifQ.PyJRVMq18pC4TXNxcG98bC55Q7DbCd-GcE5fgnM6-Uc#_=_');
      let result = parser.extract('jwtResponse');
      expect(result.new).to.eql('http://localhost:3000/#_=_');
      expect(result.value).to.eql('eyJraWQiOiJCT1NJWUg4QkNNMEtXUDRKSk9FVTVLR1FYIiwic3R0IjoiYXNzZXJ0aW9uIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiJodHRwczovL2FwaS5zdG9ybXBhdGguY29tL3YxL2FjY291bnRzLzRUWkg2OGNObXZOejdkakFzNWhvYkciLCJqdGkiOiI1ZTIyMjU4NC1iNjUwLTQ3MzgtYmIwZS0zNzdiMWQ0YzAzMzgiLCJpc3MiOiJodHRwczovL2FwaS5zdG9ybXBhdGguY29tL3YxL2FwcGxpY2F0aW9ucy8ybW9Obkl2SUU4aTV6c3JtcWlSek8zIiwiYXVkIjoiQk9TSVlIOEJDTTBLV1A0SkpPRVU1S0dRWCIsImlhdCI6MTQ4MjM0MjUyOSwiZXhwIjoxNDgyMzQyNTg5LCJzdGF0dXMiOiJBVVRIRU5USUNBVEVEIiwiaXNOZXdTdWIiOmZhbHNlLCJpcnQiOiI2Nzc3ZDBiNi0wNzcxLTQ1NTEtOGQ1ZS1kYzQ5Y2ZkMTVkYjUifQ.PyJRVMq18pC4TXNxcG98bC55Q7DbCd-GcE5fgnM6-Uc');
    });
  });
});
