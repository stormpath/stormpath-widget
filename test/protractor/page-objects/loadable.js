import DomObject from './dom';

class LoadableObject extends DomObject {
  waitUntilVisible() {
    return super.waitUntilVisible().then(() => {
      return this.loader().waitUntilHidden();
    });
  }

  loader() {
    return new DomObject(by.css('.sp-loader'));
  }
}

export default LoadableObject;
