$(function () {
  if (!App.requireLogin()) return;
  App.initLayout("assets");

  var assetId = App.getQuery("id");

  $.when(Api.loadAssets(), Api.loadWorkOrders()).done(function (assets, workOrders) {
    var asset = assets.find(function (item) { return item.id === assetId; });
    if (!asset) {
      $("#detailArea").html('<div class="panel empty">자산 정보를 찾을 수 없습니다.</div>');
      return;
    }
    renderAsset(asset);
    renderWorkOrders(asset.id, workOrders);
    bindStatusChange(asset, assets);
  });

  // 선택된 자산의 기본정보와 위치정보를 표시한다.
  function renderAsset(asset) {
    $("#detailTitle").text(asset.assetName);
    $("#detailDescription").text(asset.assetName + " 상세 정보를 확인하고 상태를 변경합니다.");
    $("#detailArea").html(
      '<div class="panel"><h2 class="panel-title">자산 기본정보</h2><div class="detail-list">' +
      detail("자산코드", asset.assetCode) + detail("자산명", asset.assetName) 
      + detail("자산유형", asset.assetType) + detail("상태", App.badge(asset.status)) 
      + detail("설치일", asset.installedAt) + detail("수정일", asset.updatedAt) +
      '</div></div><div class="panel"><h2 class="panel-title">위치정보</h2><div class="detail-list">' +
      detail("프로젝트", asset.projectName) + detail("건물", asset.buildingName) 
      + detail("층", asset.floorName) + detail("공간", asset.spaceName) + detail("bimElementId", asset.bimElementId) +
      "</div></div>"
    );
  }

  // 상세 항목 UI 조각을 생성한다.
  function detail(label, value) {
    return '<div class="detail-item"><span>' + label + '</span><strong>' + (String(value).indexOf("<span") === 0 ? value : App.escapeHtml(value)) + "</strong></div>";
  }

  // 선택 자산에 연결된 작업지시만 표시한다.
  function renderWorkOrders(assetId, workOrders) {
    var rows = workOrders.filter(function (item) { return item.assetId === assetId; });
    $("#relatedWorkOrders").html(rows.map(function (item) {
      return "<tr><td>" + App.escapeHtml(item.title) 
        + "</td><td>" + App.badge(item.priority) 
        + "</td><td>" + App.badge(item.status) 
        + "</td><td>" + App.escapeHtml(item.assignee || "-") 
        + "</td><td>" + App.formatDate(item.requestedAt) + "</td></tr>";
    }).join("") || '<tr><td colspan="5" class="empty">관련 작업지시가 없습니다.</td></tr>');
  }

  // 상세 화면에서 변경한 자산 상태를 저장한다.
  function bindStatusChange(asset, assets) {
    $("#assetStatusSelect").val(asset.status);
    $("#changeStatusBtn").on("click", function () {
      asset.status = $("#assetStatusSelect").val();
      asset.updatedAt = App.today();
      // 추후 API 저장으로 바뀌어도 저장 완료 후 상세 화면을 다시 조회한다.
      Api.saveAssets(assets).done(function () {
        location.reload();
      });
    });
  }

  $("#backBtn").on("click", function () {
    location.href = "assets.html";
  });
});
