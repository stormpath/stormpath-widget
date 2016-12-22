import { assert } from 'chai';
import sinon from 'sinon';
import Rivets from 'rivets';

import utils from '../src/utils';
import Stormpath from '../src/';

describe('Stormpath', () => {
  describe('constructor([options])', () => {
    describe('when options is undefined', () => {
      it('should return a new instance', () => {
        const stormpath = new Stormpath();
        assert.equal(typeof stormpath, 'object');
        assert.equal(stormpath.constructor, Stormpath);
      });

      it('should set default options', () => {
        const stormpath = new Stormpath();
        const options = stormpath.options;
        assert.equal(options.baseUri, null);
        assert.equal(options.authStrategy, 'cookie');
        assert.equal(typeof options.templates, 'object');
      });
    });
  });

  describe('static', () => {
    describe('.prefix', () => {
      it('should equal sp', () => {
        assert.equal(Stormpath.prefix, 'sp');
      });
    });

    describe('.version', () => {
      it('should equal version in package.json', () => {
        const packageJson = require('json-loader!../package.json');
        assert.equal(Stormpath.version, packageJson.version);
      });
    });
  });

  describe('instance', () => {
    let sandbox;
    let stormpathMock;
    let modal;
    let modalShowSpy;

    beforeEach(() => {
      sandbox = sinon.sandbox.create();

      stormpathMock = new Stormpath({
        authStrategy: 'mock'
      });

      modal = stormpathMock.modal;

      modalShowSpy = sinon.spy(modal, 'show');
    });

    afterEach(() => {
      sandbox.restore();
    });

    describe('.showEmailVerification([renderTo], [token])', () => {
      describe('when renderTo is undefined', () => {
        it('should show and render component to modal', () => {
          stormpathMock.showEmailVerification();
          assert.isTrue(modalShowSpy.calledOnce);
          assert.include(modal.element.innerHTML, '<div class="sp-verify-email-component">');
        });
      });

      describe('when renderTo is [DOMNode]', () => {
        let elementMock;

        beforeEach(() => {
          elementMock = document.createElement();
        });

        it('should render component to [DOMNode]', () => {
          stormpathMock.showEmailVerification(elementMock);
          assert.isFalse(modalShowSpy.called);
          assert.equal(modal.element.innerHTML, '');
          assert.include(elementMock.innerHTML, '<div class="sp-verify-email-component">');
        });
      });

      describe('when token is undefined', () => {
        let rivetsInitSpy;
        let utilsQueryStringStub;

        beforeEach(() => {
          rivetsInitSpy = sandbox.spy(Rivets, 'init');
          utilsQueryStringStub = sandbox.stub(utils, 'getWindowQueryString');
        });

        it('should pass value of query string ?sptoken=123 as token to component', () => {
          utilsQueryStringStub.returns('?sptoken=123');

          stormpathMock.showEmailVerification();

          assert.isTrue(rivetsInitSpy.calledOnce);

          const rivetsInitCall = rivetsInitSpy.getCall(0);
          const rivetsDataArg = rivetsInitCall.args[2];

          assert.equal(rivetsDataArg.token, '123');
        });
      });

      describe('when token is \'abc\'', () => {
        let rivetsInitSpy;

        beforeEach(() => {
          rivetsInitSpy = sandbox.spy(Rivets, 'init');
        });

        it('should pass \'abc\' as token to component', () => {
          stormpathMock.showEmailVerification(null, 'abc');

          assert.isTrue(rivetsInitSpy.calledOnce);

          const rivetsInitCall = rivetsInitSpy.getCall(0);
          const rivetsDataArg = rivetsInitCall.args[2];

          assert.equal(rivetsDataArg.token, 'abc');
        });
      });
    });
  });
});
