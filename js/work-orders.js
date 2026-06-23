$(function () {
  App.requireLogin();
  App.initLayout("work-orders");
  Modal.bindClose();

  var assets = [];
  var workOrders = [];
  var state = { page: 1, pageSize: 5 };

  $.when(Api.loadAssets(), Api.loadWorkOrders()).done(function (assetItems, workItems) {
    assets = assetItems;
    workOrders = workItems;
    renderAssetOptions();
    render();
  });

  // 작업지시의 assetId를 화면 표시용 자산명으로 변환한다.
  function assetName(assetId) {
    var asset = assets.find(function (item) { return item.id === assetId; });
    return asset ? asset.assetName : "-";
  }

  // 작업지시 등록 모달의 자산 선택 옵션을 만든다.
  function renderAssetOptions() {
    $("#woAssetId").html(assets.map(function (asset) {
      return '<option value="' + asset.id + '">' + App.escapeHtml(asset.assetName) + "</option>";
    }).join(""));
  }

  // 상태, 우선순위, 자산명, 담당자 조건으로 작업지시를 검색한다.
  function filterRows() {
    var status = $("#woStatus").val();
    var priority = $("#woPriority").val();
    var keyword = $.trim($("#woAssetName").val()).toLowerCase();
    var assignee = $.trim($("#woAssignee").val()).toLowerCase();

    return workOrders.filter(function (item) {
      return (!status || item.status === status)
        && (!priority || item.priority === priority)
        && (!keyword || assetName(item.assetId).toLowerCase().indexOf(keyword) > -1)
        && (!assignee || String(item.assignee).toLowerCase().indexOf(assignee) > -1);
    }).sort(function (a, b) {
      return b.requestedAt.localeCompare(a.requestedAt);
    });
  }

  // 작업지시 목록과 페이지네이션을 렌더링한다.
  function render() {
    var pageInfo = TableUtil.paginate(filterRows(), state.page, state.pageSize);
    state.page = pageInfo.page;
    $("#workOrderTableBody").html(pageInfo.rows.map(function (item) {
      return '<tr class="' + (item.priority === "URGENT" ? "is-urgent" : "") + '"><td>' + App.escapeHtml(item.title) + "</td><td>" 
      + App.escapeHtml(assetName(item.assetId)) + "</td><td>" + App.badge(item.priority) + "</td><td>" 
      + App.badge(item.status) + "</td><td>" + App.escapeHtml(item.assignee || "-") + "</td><td>" 
      + App.formatDate(item.requestedAt) + '</td><td><button class="btn btn-ghost btn-next" data-id="' + item.id + '">상태 변경</button> ' 
      + '<button class="btn btn-ghost btn-history" data-id="' + item.id + '">이력</button> ' 
      + '<button class="btn btn-danger btn-cancel" data-id="' + item.id + '">취소</button></td></tr>';
    }).join("") || '<tr><td colspan="7" class="empty">작업지시가 없습니다.</td></tr>');

    TableUtil.renderPagination($("#workOrderPagination"), pageInfo, function (page) {
      state.page = page;
      render();
    });
  }

  // OPEN -> ASSIGNED -> IN_PROGRESS -> DONE 순서로 다음 상태를 계산한다.
  function nextStatus(status) {
    var flow = ["OPEN", "ASSIGNED", "IN_PROGRESS", "DONE"];
    var index = flow.indexOf(status);
    return index > -1 && index < flow.length - 1 ? flow[index + 1] : status;
  }

  // 상태 변경 이력을 localStorage에 누적 저장한다.
  function saveHistory(id, from, to) {
    var histories = Storage.get(Storage.keys.histories, []);
    histories.push({ workOrderId: id, fromStatus: from, toStatus: to, changedAt: new Date().toISOString() });
    Storage.set(Storage.keys.histories, histories);
  }

  // 선택한 작업지시의 상태 변경 이력을 모달에 표시한다.
  function renderHistories(workOrderId) {
    var histories = Storage.get(Storage.keys.histories, []).filter(function (history) {
      return history.workOrderId === workOrderId;
    }).sort(function (a, b) {
      return b.changedAt.localeCompare(a.changedAt);
    });

    $("#historyTableBody").html(histories.map(function (history) {
      return "<tr><td>" + App.badge(history.fromStatus) + "</td><td>" + App.badge(history.toStatus) + "</td><td>" + App.formatDate(history.changedAt) + "</td></tr>";
    }).join("") || '<tr><td colspan="3" class="empty">상태 변경 이력이 없습니다.</td></tr>');
  }

  $("#woSearchBtn").on("click", function () {
    state.page = 1;
    render();
  });

  $("#woResetBtn").on("click", function () {
    $("#woSearchForm")[0].reset();
    state.page = 1;
    render();
  });

  $("#addWorkOrderBtn").on("click", function () {
    $("#workOrderForm")[0].reset();
    Validation.clear($("#workOrderForm"));
    $("#woRequestedAt").val(new Date().toISOString().slice(0, 16));
    Modal.open("#workOrderModal");
  });

  $("#workOrderForm").on("submit", function (event) {
    event.preventDefault();
    if (!Validation.required($(this), ["assetId", "title", "priority", "status", "requestedAt"])) return;

    var data = {};
    $(this).serializeArray().forEach(function (field) {
      data[field.name] = field.value;
    });
    data.id = "W" + Date.now();
    data.completedAt = data.status === "DONE" ? new Date().toISOString() : "";
    workOrders.push(data);
    Api.saveWorkOrders(workOrders);
    Modal.close("#workOrderModal");
    render();
  });

  $("#workOrderTableBody").on("click", ".btn-next", function () {
    var id = String($(this).data("id"));
    var item = workOrders.find(function (row) { return row.id === id; });
    var next = nextStatus(item.status);
    if (next === item.status) return alert("더 이상 변경할 상태가 없습니다.");
    saveHistory(item.id, item.status, next);
    item.status = next;
    item.completedAt = next === "DONE" ? new Date().toISOString() : item.completedAt;
    Api.saveWorkOrders(workOrders);
    render();
  });

  $("#workOrderTableBody").on("click", ".btn-history", function () {
    var id = String($(this).data("id"));
    var item = workOrders.find(function (row) { return row.id === id; });
    $("#historyModalTitle").text((item ? item.title : id) + " 상태 변경 이력");
    renderHistories(id);
    Modal.open("#historyModal");
  });

  $("#workOrderTableBody").on("click", ".btn-cancel", function () {
    var id = String($(this).data("id"));
    var item = workOrders.find(function (row) { return row.id === id; });
    if (!item || item.status === "CANCELED") return alert("이미 취소된 작업지시입니다.");
    if (item.status === "DONE") return alert("완료된 작업지시는 취소할 수 없습니다.");
    if (!confirm("작업지시를 취소하시겠습니까?")) return;
    saveHistory(item.id, item.status, "CANCELED");
    item.status = "CANCELED";
    Api.saveWorkOrders(workOrders);
    render();
  });
});
