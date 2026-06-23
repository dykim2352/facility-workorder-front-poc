var Api = (function () {
  var dataPaths = {
    assets: "data/assets.json",
    workOrders: "data/work-orders.json",
    spaces: "data/spaces.json"
  };

  // JSON 파일을 AJAX로 읽어온다.
  function loadJson(path) {
    return $.getJSON(path);
  }

  // localStorage 데이터가 없을 때만 초기 JSON을 로딩한다.
  function loadCollection(name) {
    var key = Storage.keys[name];
    var saved = Storage.get(key, null);
    if (saved) {
      return $.Deferred().resolve(saved).promise();
    }

    return loadJson(dataPaths[name]).then(function (items) {
      Storage.set(key, items);
      return items;
    });
  }

  return {
    loadAssets: function () {
      return loadCollection("assets");
    },
    saveAssets: function (items) {
      Storage.set(Storage.keys.assets, items);
    },
    loadWorkOrders: function () {
      return loadCollection("workOrders");
    },
    saveWorkOrders: function (items) {
      Storage.set(Storage.keys.workOrders, items);
    },
    loadSpaces: function () {
      return loadCollection("spaces");
    }
  };
})();
