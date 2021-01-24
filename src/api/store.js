export default class Store {
  constructor(storage) {
    this._storage = storage;
  }

  getData(key) {
    try {
      return JSON.parse(this._storage.getItem(key));
    } catch (err) {
      return {};
    }
  }

  getCommentsByFilmId(key, id) {
    const comments = this.getData(key);
    return comments[id];
  }

  setItem(key, data) {
    this._storage.setItem(
        key,
        JSON.stringify(data)
    );
  }

  remove(key, id) {
    const store = this.getData(key);

    delete store[id];

    this._storage.setItem(
        key,
        JSON.stringify(store)
    );
  }
}
