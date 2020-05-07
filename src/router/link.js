export default {
  props: {
    to: String
  },
  render(h) {
    const mode = this._self._root._router.mode;
    return h('a', {
      domProps: {
        href: mode === 'hash' ? `#${this.to}` : this.to
      }
    }, this.$slots.default);
  }
};
