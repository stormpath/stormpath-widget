import utils from '../../utils';
import ModalComponent from '../modal/modal';
import ContainerComponent from '../container/container';

import ChangePasswordComponent from '../change-password/change-password';
import ForgotPasswordComponent from '../forgot-password/forgot-password';
import FormFieldsComponent from '../form-fields/form-fields';
import FormFieldComponent from '../form-fields/form-field';
import LoginComponent from '../login/login';
import PasswordFormFieldComponent from '../form-fields/password-form-field';
import RegistrationComponent from '../registration/registration';
import SubmitButtonComponent from '../submit-button/submit-button';
import VerifyEmailComponent from '../verify-email/verify-email';

class BaseComponent {

  static templates = {
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

  _initializeRivets(templates) {
    this.rivets.formatters['is'] = (a, b) => a === b;
    this.rivets.formatters['isnt'] = (a, b) => a !== b;
    this.rivets.formatters['in'] = (a, b) => (b || '').split(',').indexOf(a) !== -1;
    this.rivets.formatters['gt'] = (x, y) => x > y;
    this.rivets.formatters.prefix = utils.prefix;

    this.rivets.binders.required = (el, val) => el.required = val === true;

    for (var id in templates) {
      const options = templates[id];
      this.rivets.components[this.prefix + '-' + id] = {
        template: options.view,
        initialize: (el, data) => new options.component(data, el)
      };
    }
  }

  constructor(prefix, rivets, userService) {
    this.prefix = prefix;
    this.rivets = rivets;
    this.userService = userService;

    this._initializeRivets(BaseComponent.templates);
  }

  _render(viewComponentId, targetElement, data) {
    let element = targetElement;
    let modal = null;
    if (!element) {
      modal = new ModalComponent();
      element = modal.element;
    }

    // Set up the container
    var containerHandle = this.rivets.init(
      utils.prefix(ContainerComponent.id, this.prefix, '-'),
      element,
      {} // TODO data for the container
    );
    var containerElement = containerHandle.models._element.children[0];

    // Render the view
    data = data || {};
    data.userService = this.userService;

    // TODO see if we can remove this
    if (modal) {
      data.modal = this.modal;
    }

    this.rivets.init(
      utils.prefix(viewComponentId, this.prefix, '-'),
      containerElement,
      data
    );

    if (modal) {
      modal.show();
    }
  }

  showLogin(target) {
    this._render(LoginComponent.id, target, {
      showForgotPassword: this.showForgotPassword.bind(this, target),
      showRegistration: this.showRegistration.bind(this, target)
    });
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

export default BaseComponent;
