import extend from 'xtend';
import Rivets from 'rivets';

import utils from './utils';

import {
  ModalComponent,
  ContainerComponent,
  ChangePasswordComponent,
  ForgotPasswordComponent,
  FormFieldsComponent,
  FormFieldComponent,
  LoginComponent,
  PasswordFormFieldComponent,
  RegistrationComponent,
  SubmitButtonComponent,
  VerifyEmailComponent,
  MfaChallengeComponent,
  MfaEnrollComponent
} from './components';

class ViewManager {
  static defaultComponents = {
    [ContainerComponent.id]: {
      component: ContainerComponent,
      view: () => ContainerComponent.view
    },
    [ChangePasswordComponent.id]: {
      component: ChangePasswordComponent,
      view: () => ChangePasswordComponent.view
    },
    [FormFieldsComponent.id]: {
      component: FormFieldsComponent,
      view: () => FormFieldsComponent.view
    },
    [FormFieldComponent.id]: {
      component: FormFieldComponent,
      view: () => FormFieldComponent.view
    },
    [PasswordFormFieldComponent.id]: {
      component: PasswordFormFieldComponent,
      view: () => PasswordFormFieldComponent.view
    },
    [ForgotPasswordComponent.id]: {
      component: ForgotPasswordComponent,
      view: () => ForgotPasswordComponent.view
    },
    [LoginComponent.id]: {
      component: LoginComponent,
      view: () => LoginComponent.view
    },
    [RegistrationComponent.id]: {
      component: RegistrationComponent,
      view: () => RegistrationComponent.view
    },
    [SubmitButtonComponent.id]: {
      component: SubmitButtonComponent,
      view: () => SubmitButtonComponent.view
    },
    [VerifyEmailComponent.id]: {
      component: VerifyEmailComponent,
      view: () => VerifyEmailComponent.view
    },
    [MfaChallengeComponent.id]: {
      component: MfaChallengeComponent,
      view: () => MfaChallengeComponent.view
    },
    [MfaEnrollComponent.id]: {
      component: MfaEnrollComponent,
      view: () => MfaEnrollComponent.view
    }
  };

  constructor(prefix, userService, templates, container) {
    this.userService = userService;
    this.prefix = prefix;
    this.templates = templates;
    this._initializeRivets(extend(ViewManager.defaultComponents));
    this.setContainer(container);
  }

  _initializeRivets(components) {
    Rivets.formatters['is'] = (a, b) => a === b;
    Rivets.formatters['isnt'] = (a, b) => a !== b;
    Rivets.formatters['in'] = (a, b) => (b || '').split(',').indexOf(a) !== -1;
    Rivets.formatters['gt'] = (x, y) => x > y;
    Rivets.formatters['any'] = (arr) => (arr || []).length > 0;
    Rivets.formatters['contains'] = (arr, x) => (arr || []).includes(x);
    Rivets.formatters.prefix = utils.prefix;

    Rivets.binders.required = (el, val) => el.required = val === true;

    for (var id in components) {
      const data = components[id];
      const viewFunction = this._getViewFunction(id, data.view);

      Rivets.components[this.prefix + '-' + id] = {
        template: viewFunction,
        initialize: (el, d) => new data.component(d, el)
      };
    }
  }

  _getViewFunction(id, fallback) {
    let prettyId = utils.hyphensToCamelCase(id).replace('Component', '');

    if (!this.templates || !this.templates[prettyId]) {
      return fallback;
    }

    const template = this.templates[prettyId];

    if (typeof template === 'function') {
      return template;
    } else {
      return () => template;
    }
  }

  _createContainer(element) {
    const containerHandle = Rivets.init(
      utils.prefix(ContainerComponent.id, this.prefix, '-'),
      element,
      {}
    );

    return containerHandle.models._element.children[0];
  }

  _render(viewComponentId, data) {
    data = data || {};
    data.userService = this.userService;
    data.viewManager = utils.bindAll(this, [
      'remove',
      'showLogin',
      'showRegistration',
      'showForgotPassword',
      'showChangePassword',
      'showEmailVerification',
      'showChallengeMfa',
      'showEnrollMfa'
    ]);

    Rivets.init(
      utils.prefix(viewComponentId, this.prefix, '-'),
      this._createContainer(this.targetElement),
      data
    );

    if (this.modal) {
      this.modal.show();
    }
  }

  _modalExists() {
    return !!this.modal;
  }

  setContainer(container) {
    if (this.targetElement) {
      this.remove();
    }

    this.targetElement = container;

    if (!this.targetElement) {
      this.modal = new ModalComponent();
      this.targetElement = this.modal.element;
    } else {
      this.modal = null;
    }
  }

  remove() {
    if (this.modal) {
      this.modal.close();
      return;
    }

    this.targetElement.innerHTML = '';
  }

  showLogin() {
    this._render(LoginComponent.id, {
      autoClose: this._modalExists()
    });
  }

  showRegistration() {
    this._render(RegistrationComponent.id, {
      autoClose: this._modalExists()
    });
  }

  showForgotPassword() {
    this._render(ForgotPasswordComponent.id);
  }

  showChangePassword(token) {
    this._render(ChangePasswordComponent.id, { token });
  }

  showEmailVerification(token) {
    this._render(VerifyEmailComponent.id, { token });
  }

  showEnrollMfa(options) {
    this._render(MfaEnrollComponent.id, options);
  }

  showChallengeMfa(options) {
    this._render(MfaChallengeComponent.id, options);
  }
}

export default ViewManager;
