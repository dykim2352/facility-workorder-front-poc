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

  return {
    keys: keys,
    get: get,
    set: set,
    clearAll: function () {
      localStorage.removeItem(keys.assets);
      localStorage.removeItem(keys.workOrders);
      localStorage.removeItem(keys.spaces);
      localStorage.removeItem(keys.histories);
      localStorage.removeItem(keys.loginUser);
    }
  };
})();
