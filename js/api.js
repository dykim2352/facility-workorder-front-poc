var Api = (function () {
  var dataPaths = {
    assets: "data/assets.json",
    workOrders: "data/work-orders.json",
    spaces: "data/spaces.json",
    users: "data/users.json"
  };

  // JSON 파일을 AJAX로 읽어온다.
  function loadJson(path) {
    return $.getJSON(path);
  }

  // localStorage 데이터가 없을 때만 초기 JSON을 로딩한다.
  // 추후 백엔드 연동 시 이 함수는 GET /api/{name} 형태의 AJAX 호출로 교체한다.
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

  // 현재 저장은 localStorage라 즉시 완료되지만 Promise 형태로 맞춰 둔다.
  // 추후 백엔드 연동 시 $.ajax({ method: "POST" 또는 "PUT" }) 반환값으로 교체한다.
  function saveCollection(key, items) {
    Storage.set(key, items);
    return $.Deferred().resolve(items).promise();
  }

  // 데모 사용자 JSON으로 로그인한다. 추후 백엔드 연동 시 POST /api/login 호출로 교체한다.
  function login(userId, password) {
    return loadJson(dataPaths.users).then(function (users) {
      var user = users.find(function (item) {
        return item.userId === userId && item.password === password;
      });

      if (!user) {
        return $.Deferred().reject("INVALID_LOGIN").promise();
      }

      return user;
    });
  }

  return {
    login: login,
    loadAssets: function () {
      return loadCollection("assets");
    },
    saveAssets: function (items) {
      return saveCollection(Storage.keys.assets, items);
    },
    loadWorkOrders: function () {
      return loadCollection("workOrders");
    },
    saveWorkOrders: function (items) {
      return saveCollection(Storage.keys.workOrders, items);
    },
    loadHistories: function () {
      return $.Deferred().resolve(Storage.get(Storage.keys.histories, [])).promise();
    },
    addWorkOrderHistory: function (history) {
      var histories = Storage.get(Storage.keys.histories, []);
      histories.push(history);
      return saveCollection(Storage.keys.histories, histories);
    },
    loadSpaces: function () {
      return loadCollection("spaces");
    }
  };
})();
