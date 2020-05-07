export default {
  render(h) {
    let current = this._self._root._router.history.current;
    let matcher = this._self._root._router.matcher;
    return h(matcher[current]);
  }
};
