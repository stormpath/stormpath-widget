import DomObject from './dom';

class OverlayObject extends DomObject {
  waitUntilVisible() {
    return super.waitUntilVisible().then(() => {
      return this.loader().waitUntilHidden();
    });
  }

  loader() {
    return new DomObject(by.css('.sp-loader'));
  }
}

export default OverlayObject;
