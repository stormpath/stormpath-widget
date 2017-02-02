import { ExpectedConditions } from 'protractor';
import DomUtils from './dom-utils';

class DomObject {
  constructor(locator) {
    this.element = element(locator);
  }

  isPresent() {
    return this.element.isPresent();
  }

  isVisible() {
    return this.element.isDisplayed();
  }

  isFocused() {
    const activeElement = browser.driver.switchTo().activeElement();

    if (!activeElement) {
      return Promise.resolve(false);
    }

    return DomUtils.isSameElement(this.element, activeElement);
  }

  getText() {
    return this.element.getText();
  }

  waitUntilVisible(ms) {
    return browser.wait(ExpectedConditions.visibilityOf(this.element), ms | 10 * 1000);
  }

  waitUntilHidden(ms) {
    return browser.wait(ExpectedConditions.invisibilityOf(this.element), ms | 10 * 1000);
  }

  waitUntilRemoved(ms) {
    return browser.wait(ExpectedConditions.stalenessOf(this.element), ms | 10 * 1000);
  }
}

export default DomObject;
