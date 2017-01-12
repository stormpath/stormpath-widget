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
  VerifyEmailComponent
} from './components';

class ViewManager {
  static defaultTemplates = {
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
    }
  };

  constructor(prefix, templates, userService) {
    this.prefix = prefix;
    this.userService = userService;
    this.modal = new ModalComponent();
    this._initializeRivets(extend(ViewManager.defaultTemplates, templates));
  }

  _initializeRivets(templates) {
    Rivets.formatters['is'] = (a, b) => a === b;
    Rivets.formatters['isnt'] = (a, b) => a !== b;
    Rivets.formatters['in'] = (a, b) => (b || '').split(',').indexOf(a) !== -1;
    Rivets.formatters['gt'] = (x, y) => x > y;
    Rivets.formatters.prefix = utils.prefix;

    Rivets.binders.required = (el, val) => el.required = val === true;

    for (var id in templates) {
      const options = templates[id];
      Rivets.components[this.prefix + '-' + id] = {
        template: options.view,
        initialize: (el, data) => new options.component(data, el)
      };
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

  _createTargetedViewManagerProxy(target) {
    return {
      hide: () => this.hide(target),
      showRegistration: () => this.showRegistration(target),
      showForgotPassword: () => this.showForgotPassword(target)
    };
  }

  _render(viewComponentId, targetElement, data) {
    let element = targetElement
      ? targetElement
      : this.modal.element;

    data = data || {};
    data.userService = this.userService;
    data.viewManager = this._createTargetedViewManagerProxy(targetElement);

    Rivets.init(
      utils.prefix(viewComponentId, this.prefix, '-'),
      this._createContainer(element),
      data
    );

    if (!targetElement) {
      this.modal.show();
    }
  }

  hide(target) {
    if (target) {
      target.innerHTML = '';
      return;
    }

    this.modal.close();
  }

  showLogin(target) {
    this._render(LoginComponent.id, target);
  }

  showRegistration(target) {
    this._render(RegistrationComponent.id, target);
  }

  showForgotPassword(target) {
    this._render(ForgotPasswordComponent.id, target);
  }

  showChangePassword(target, token) {
    this._render(ChangePasswordComponent.id, target, {
      token,
      showLogin: this.showLogin.bind(this, target),
      showForgotPassword: this.showForgotPassword.bind(this, target),
    });
  }

  showEmailVerification(target, token) {
    this._render(VerifyEmailComponent.id, target, {
      token,
      showLogin: this.showLogin.bind(this, target)
    });
  }
}

export default ViewManager;
