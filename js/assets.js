$(function () {
  if (!App.requireLogin()) return;
  App.initLayout("assets");
  Modal.bindClose();

  var assets = [];
  var state = { page: 1, pageSize: 5, sortKey: "assetCode", sortDir: "asc" };

  Api.loadAssets().done(function (items) {
    assets = items;
    var queryStatus = App.getQuery("status");
    if (queryStatus) $("#status").val(queryStatus);
    render();
  });

  // 검색 폼의 현재 조건을 객체로 수집한다.
  function getFilters() {
    return {
      assetName: $.trim($("#assetName").val()).toLowerCase(),
      assetCode: $.trim($("#assetCode").val()).toLowerCase(),
      assetType: $.trim($("#assetType").val()).toLowerCase(),
      status: $("#status").val(),
      spaceName: $.trim($("#spaceName").val()).toLowerCase()
    };
  }

  // 검색 조건에 맞는 자산만 필터링한다.
  function filterRows() {
    var f = getFilters();
    return assets.filter(function (item) {
      return (!f.assetName || item.assetName.toLowerCase().indexOf(f.assetName) > -1)
        && (!f.assetCode || item.assetCode.toLowerCase().indexOf(f.assetCode) > -1)
        && (!f.assetType || item.assetType.toLowerCase().indexOf(f.assetType) > -1)
        && (!f.status || item.status === f.status)
        && (!f.spaceName || item.spaceName.toLowerCase().indexOf(f.spaceName) > -1);
    });
  }

  // 필터, 정렬, 페이지네이션을 적용해 자산 테이블을 갱신한다.
  function render() {
    var sorted = TableUtil.sortRows(filterRows(), state.sortKey, state.sortDir);
    var pageInfo = TableUtil.paginate(sorted, state.page, state.pageSize);
    state.page = pageInfo.page;

    $("#assetTableBody").html(pageInfo.rows.map(function (item) {
      return "<tr><td>" + App.escapeHtml(item.assetCode) + "</td><td>" + App.escapeHtml(item.assetName) + "</td><td>" + App.escapeHtml(item.assetType) 
      + "</td><td>" + App.badge(item.status) + "</td><td>" + App.escapeHtml(item.spaceName) + "</td><td>" + App.escapeHtml(item.updatedAt) + '</td><td>'
      + '<button class="btn btn-ghost btn-detail" data-id="' + item.id + '">상세</button>' 
      + ' <button class="btn btn-ghost btn-edit" data-id="' + item.id + '">수정</button>'
      + ' <button class="btn btn-danger btn-delete" data-id="' + item.id + '">삭제</button></td></tr>';
    }).join("") || '<tr><td colspan="7" class="empty">검색 결과가 없습니다.</td></tr>');

    TableUtil.renderPagination($("#assetPagination"), pageInfo, function (page) {
      state.page = page;
      render();
    });
  }

  // 등록/수정 모달 폼에 기본값 또는 선택 자산 값을 채운다.
  function fillForm(item) {
    Validation.clear($("#assetForm"));
    var defaults = { id: "", assetCode: "", assetName: "", assetType: "", status: "NORMAL", projectName: "스마트팩토리", buildingName: ""
                                  , floorName: "", spaceName: "", bimElementId: "", installedAt: App.today(), updatedAt: App.today() };
    var data = $.extend({}, defaults, item);
    Object.keys(data).forEach(function (key) {
      $('#assetForm [name="' + key + '"]').val(data[key]);
    });
  }

  $("#searchBtn").on("click", function () {
    state.page = 1;
    render();
  });

  $("#resetBtn").on("click", function () {
    $("#searchForm")[0].reset();
    state.page = 1;
    render();
  });

  $(".data-table").on("click", "th.is-sortable", function () {
    var key = $(this).data("sort");
    state.sortDir = state.sortKey === key && state.sortDir === "asc" ? "desc" : "asc";
    state.sortKey = key;
    render();
  });

  $("#addAssetBtn").on("click", function () {
    $("#assetModalTitle").text("자산 등록");
    fillForm();
    Modal.open("#assetModal");
  });

  $("#assetTableBody").on("click", ".btn-detail", function () {
    location.href = "asset-detail.html?id=" + $(this).data("id");
  });

  $("#assetTableBody").on("click", ".btn-edit", function () {
    var id = String($(this).data("id"));
    var item = assets.find(function (asset) { return asset.id === id; });
    $("#assetModalTitle").text("자산 수정");
    fillForm(item);
    Modal.open("#assetModal");
  });

  $("#assetTableBody").on("click", ".btn-delete", function () {
    var id = String($(this).data("id"));
    if (!confirm("자산을 삭제하시겠습니까?")) return;
    assets = assets.filter(function (item) { return item.id !== id; });
    // 추후 API 저장으로 바뀌어도 저장 완료 후 목록을 갱신하도록 Promise 흐름을 유지한다.
    Api.saveAssets(assets).done(function () {
      render();
    });
  });

  $("#assetForm").on("submit", function (event) {
    event.preventDefault();
    if (!Validation.required($(this), ["assetCode", "assetName", "assetType", "status", "spaceName"])) return;

    var formData = {};
    $(this).serializeArray().forEach(function (field) {
      formData[field.name] = field.value;
    });
    formData.updatedAt = App.today();

    if (formData.id) {
      assets = assets.map(function (item) { return item.id === formData.id ? formData : item; });
    } else {
      formData.id = "A" + Date.now();
      assets.push(formData);
    }

    // 추후 API 저장으로 바뀌어도 저장 완료 후 모달 닫기와 목록 갱신을 처리한다.
    Api.saveAssets(assets).done(function () {
      Modal.close("#assetModal");
      render();
    });
  });
});
