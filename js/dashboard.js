$(function () {
  App.requireLogin();
  App.initLayout("dashboard");

  $.when(Api.loadAssets(), Api.loadWorkOrders()).done(function (assets, workOrders) {
    renderSummary(assets, workOrders);
    renderRecentWorkOrders(assets, workOrders);
  });

  // 지정한 필드 기준으로 건수를 집계한다.
  function countBy(items, key) {
    return items.reduce(function (acc, item) {
      acc[item[key]] = (acc[item[key]] || 0) + 1;
      return acc;
    }, {});
  }

  // 자산/작업지시 요약 카드와 차트를 렌더링한다.
  function renderSummary(assets, workOrders) {
    var assetCounts = countBy(assets, "status");
    var workCounts = countBy(workOrders, "status");
    $("#totalAssets").text(assets.length);
    $("#normalAssets").text(assetCounts.NORMAL || 0);
    $("#inspectionAssets").text(assetCounts.INSPECTION || 0);
    $("#brokenAssets").text(assetCounts.BROKEN || 0);
    $("#disposedAssets").text(assetCounts.DISPOSED || 0);
    $("#openWorkOrders").text(workCounts.OPEN || 0);
    $("#progressWorkOrders").text(workCounts.IN_PROGRESS || 0);
    $("#doneWorkOrders").text(workCounts.DONE || 0);

    renderBars("#assetStatusChart", ["NORMAL", "INSPECTION", "BROKEN", "DISPOSED"], assetCounts);
    renderBars("#workStatusChart", ["OPEN", "ASSIGNED", "IN_PROGRESS", "DONE"], workCounts);
  }

  // 별도 차트 라이브러리 없이 CSS 막대 그래프를 만든다.
  function renderBars(selector, keys, counts) {
    var max = Math.max.apply(null, keys.map(function (key) { return counts[key] || 0; })) || 1;
    var html = keys.map(function (key) {
      var value = counts[key] || 0;
      var width = Math.max(4, Math.round((value / max) * 100));
      return '<div class="bar-row"><span>' + App.labels[key] + '</span><div class="bar-track"><div class="bar-fill" style="width:' + width + '%"></div></div><strong>' + value + "</strong></div>";
    }).join("");
    $(selector).html(html);
  }

  // 요청일 기준 최근 작업지시 5건을 표시한다.
  function renderRecentWorkOrders(assets, workOrders) {
    var assetMap = {};
    assets.forEach(function (asset) {
      assetMap[asset.id] = asset.assetName;
    });
    var rows = workOrders.slice().sort(function (a, b) {
      return b.requestedAt.localeCompare(a.requestedAt);
    }).slice(0, 5);

    $("#recentWorkOrders").html(rows.map(function (item) {
      return "<tr><td>" + App.escapeHtml(item.title) + "</td><td>" + App.escapeHtml(assetMap[item.assetId]) + "</td><td>" + App.badge(item.priority) + "</td><td>" + App.badge(item.status) + "</td><td>" + App.formatDate(item.requestedAt) + "</td></tr>";
    }).join(""));
  }

  $(".status-filter").on("click", function () {
    location.href = "assets.html?status=" + $(this).data("status");
  });
});
