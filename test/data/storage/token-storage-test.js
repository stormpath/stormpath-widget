import sinon from 'sinon';
import chai, { assert } from 'chai';
import { HttpProvider } from '../../../src/data/http/';
import { MemoryStorage, TokenStorage } from '../../../src/data/storage/';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('TokenStorage', () => {
  let mockStorage;
  let mockHttpProvider;
  let tokenStorage;
  let mockTokens;

  beforeEach(() => {
    mockStorage = new MemoryStorage();
    mockHttpProvider = new HttpProvider();
    tokenStorage = new TokenStorage(mockStorage, mockHttpProvider);
    mockTokens = {
      accessTokenA: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImV4cCI6MX0.-x_DAYIg4R4R9oZssqgWyJP_oWO1ESj8DgKrGCk7i5o',
      accessTokenB: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzX3Rva2VuIn0.EMXmaqCC8awlLl-AVjakgZk6T2cWr2ahETLDEXiUTao',
      refreshTokenA: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M',
      refreshTokenB: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicmVmcmVzaF90b2tlbiJ9.uqUjcPA4itDBTuBtVlevfppYnYh8xFW7rAgQAHqX5aM',
      nonExpiredAccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
      expiredAccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImV4cCI6MX0.-x_DAYIg4R4R9oZssqgWyJP_oWO1ESj8DgKrGCk7i5o'
    };
  });

  describe('constructor(storage, httpProvider)', () => {
    describe('when called', () => {
      it('should return a new instance', () => {
        assert.equal(typeof tokenStorage, 'object');
        assert.equal(tokenStorage.constructor, TokenStorage);
      });
    });
  });

  describe('.getAccessToken()', () => {
    describe('when stormpath.access_token key in storage', () => {
      describe('and token has expired', () => {
        let mockToken;

        beforeEach((done) => {
          mockToken = mockTokens.expiredAccessToken;
          mockStorage.set('stormpath.access_token', mockToken).then(done);
        });

        describe('when stormpath.refresh_token key in storage', () => {
          let sandbox;
          let tokenRefreshMockResult;
          let testResult;

          beforeEach((done) => {
            sandbox = sinon.sandbox.create();

            tokenRefreshMockResult = {
              access_token: mockTokens.accessTokenB,
              refresh_token: mockTokens.refreshTokenB
            };

            sandbox.stub(mockHttpProvider, 'postForm')
              .withArgs('/oauth/token')
              .returns(Promise.resolve(tokenRefreshMockResult));

            mockStorage.set('stormpath.refresh_token', mockTokens.refreshTokenA).then(() => {
              testResult = tokenStorage.getAccessToken();
              testResult.then(() => done());
            });
          });

          afterEach(() => {
            sandbox.restore();
          });

          it('should return a new access token', (done) => {
            assert.becomes(testResult, tokenRefreshMockResult.access_token).notify(done);
          });

          it('should set storage key stormpath.refresh_token to new refresh token', (done) => {
            assert.becomes(mockStorage.get('stormpath.refresh_token'), tokenRefreshMockResult.refresh_token).notify(done);
          });

          it('should set storage key stormpath.access_token to new access token', (done) => {
            assert.becomes(mockStorage.get('stormpath.access_token'), tokenRefreshMockResult.access_token).notify(done);
          });
        });

        describe('when stormpath.refresh_token key not in storage', () => {
          it('should return access token from storage', (done) => {
            assert.becomes(tokenStorage.getAccessToken(), mockToken)
              .notify(done);
          });
        });
      });

      describe('and token hasn\'t expired', () => {
        let mockToken;

        beforeEach((done) => {
          mockToken = mockTokens.nonExpiredAccessToken;
          mockStorage.set('stormpath.access_token', mockToken).then(done);
        });

        it('should return token from storage', (done) => {
          assert.becomes(tokenStorage.getAccessToken(), mockToken)
            .notify(done);
        });
      });
    });
  });

  describe('.setAccessToken(token)', () => {
    describe('when token is a access token jwt', () => {
      it('should set storage key stormpath.access_token to that value', (done) => {
        tokenStorage.setAccessToken(mockTokens.accessTokenA).then(() => {
          assert.becomes(mockStorage.get('stormpath.access_token'), mockTokens.accessTokenA).notify(done);
        });
      });
    });
  });

  describe('.getRefreshToken()', () => {
    let mockToken;

    beforeEach((done) => {
      mockToken = mockTokens.refreshTokenA;
      mockStorage.set('stormpath.refresh_token', mockToken).then(done);
    });

    it('should get stormpath.refresh_token key from storage', (done) => {
      assert.becomes(tokenStorage.getRefreshToken(), mockToken).notify(done);
    });
  });

  describe('.setRefreshToken(token)', () => {
    describe('when token is a refresh token jwt', () => {
      it('should set storage key stormpath.refresh_token to that value', (done) => {
        tokenStorage.setRefreshToken(mockTokens.refreshTokenA).then(() => {
          assert.becomes(mockStorage.get('stormpath.refresh_token'), mockTokens.refreshTokenA).notify(done);
        });
      });
    });
  });

  describe('.removeAll()', () => {
    beforeEach((done) => {
      Promise.all([
        mockStorage.set('stormpath.access_token', mockTokens.accessTokenA),
        mockStorage.set('stormpath.refresh_token', mockTokens.refreshTokenA)
      ]).then(() => {
        tokenStorage.removeAll().then(() => done());
      });
    });

    it('should remove the stormpath.access_token storage key', (done) => {
      assert.becomes(mockStorage.get('stormpath.access_token'), undefined).notify(done);
    });

    it('should remove the stormpath.refresh_token storage key', (done) => {
      assert.becomes(mockStorage.get('stormpath.refresh_token'), undefined).notify(done);
    });
  });
});
