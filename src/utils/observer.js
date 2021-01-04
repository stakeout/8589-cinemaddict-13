export default class Observer {
  constructor() {
    this._observers = new Set();
  }

  addObserver(observer) {
    this._observers.add(observer);
  }

  removeObserver(observer) {
    this._observers.delete(observer);
  }

  _notify(updateType, updatedObject) {
    this._observers.forEach((observer) => observer(updateType, updatedObject));
  }
}
