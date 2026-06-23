var Storage = (function () {
  var keys = {
    assets: "fw_assets",
    workOrders: "fw_workOrders",
    spaces: "fw_spaces",
    histories: "fw_workOrderHistories",
    loginUser: "loginUser"
  };

  function get(key, fallback) {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }

  function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function remove(key) {
    localStorage.removeItem(key);
  }

  return {
    keys: keys,
    get: get,
    set: set,
    remove: remove,
    clearAll: function () {
      remove(keys.assets);
      remove(keys.workOrders);
      remove(keys.spaces);
      remove(keys.histories);
      remove(keys.loginUser);
    }
  };
})();
