$(function () {
  App.requireLogin();
  App.initLayout("import");

  var parsed = [];
  var errors = [];
  var requiredHeaders = ["assetCode", "assetName", "assetType", "status", "spaceName", "installedAt"];
  var validStatuses = ["NORMAL", "INSPECTION", "BROKEN", "DISPOSED"];

  // 사용자가 바로 테스트할 수 있는 샘플 CSV를 반환한다.
  function sampleCsv() {
    return [
      "assetCode,assetName,assetType,status,projectName,buildingName,floorName,spaceName,bimElementId,installedAt",
      "VALVE-01,급수 밸브 1호,VALVE,NORMAL,스마트팩토리,A동,B1,펌프실,bim-valve-0001,2025-02-10",
      "SEN-12,온습도 센서 12,SENSOR,INSPECTION,스마트팩토리,C동,4F,서버실,bim-sen-0012,2025-07-15"
    ].join("\n");
  }

  // CSV 텍스트를 자산 객체 배열과 오류 목록으로 파싱한다.
  function parseCsv(text) {
    var lines = text.split(/\r?\n/).filter(function (line) { return $.trim(line); });
    if (lines.length < 2) return { rows: [], errors: ["CSV 데이터가 없습니다."] };

    var headers = lines[0].split(",").map(function (header) { return $.trim(header); });
    var headerErrors = validateHeaders(headers);
    if (headerErrors.length) return { rows: [], errors: headerErrors };

    var rows = [];
    var errorList = [];

    lines.slice(1).forEach(function (line, index) {
      var values = line.split(",");
      var row = {};
      headers.forEach(function (header, i) {
        row[header] = $.trim(values[i] || "");
      });

      var rowErrors = validateRow(row, values, headers, index + 2);
      if (rowErrors.length) {
        errorList = errorList.concat(rowErrors);
      } else {
        row.id = "A" + Date.now() + index;
        row.updatedAt = App.today();
        rows.push(row);
      }
    });

    return { rows: rows, errors: errorList };
  }

  // CSV 헤더에 필수 컬럼과 중복 컬럼이 있는지 검사한다.
  function validateHeaders(headers) {
    var missing = requiredHeaders.filter(function (key) { return headers.indexOf(key) === -1; });
    var duplicates = headers.filter(function (header, index) { return headers.indexOf(header) !== index; });
    var result = [];
    if (missing.length) result.push("헤더 필수 컬럼 누락: " + missing.join(", "));
    if (duplicates.length) result.push("헤더 중복 컬럼: " + duplicates.join(", "));
    return result;
  }

  // CSV 한 행의 필수값, 코드값, 날짜 형식을 검사한다.
  function validateRow(row, values, headers, rowNumber) {
    var result = [];
    var missing = requiredHeaders.filter(function (key) { return !row[key]; });

    if (values.length !== headers.length) {
      result.push(rowNumber + "행 컬럼 수 불일치: 헤더 " + headers.length + "개 / 데이터 " + values.length + "개");
    }
    if (missing.length) {
      result.push(rowNumber + "행 필수값 누락: " + missing.join(", "));
    }
    if (row.status && validStatuses.indexOf(row.status) === -1) {
      result.push(rowNumber + "행 상태 코드 오류: " + row.status + " - " + validStatuses.join(", ") + " 중 하나여야 합니다.");
    }
    if (row.installedAt && !isValidDate(row.installedAt)) {
      result.push(rowNumber + "행 설치일 형식 오류: YYYY-MM-DD 형식이어야 합니다.");
    }

    return result;
  }

  // YYYY-MM-DD 형식과 실제 존재하는 날짜인지 확인한다.
  function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    var parts = value.split("-").map(Number);
    var date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.getFullYear() === parts[0]
      && date.getMonth() === parts[1] - 1
      && date.getDate() === parts[2];
  }

  // 파싱 결과를 미리보기 테이블과 결과 영역에 표시한다.
  function renderPreview() {
    $("#previewBody").html(parsed.map(function (item) {
      return "<tr><td>" + App.escapeHtml(item.assetCode) + "</td><td>" + App.escapeHtml(item.assetName) + "</td><td>" + App.escapeHtml(item.assetType) + "</td><td>" + App.badge(item.status) + "</td><td>" + App.escapeHtml(item.spaceName) + "</td><td>" + App.escapeHtml(item.installedAt) + "</td></tr>";
    }).join("") || '<tr><td colspan="6" class="empty">미리보기 데이터가 없습니다.</td></tr>');

    $("#importResult").show().html("성공 가능 " + parsed.length + "건 / 실패 " + errors.length + "건" + (errors.length ? '<div class="error-list">' + errors.join("<br>") + "</div>" : ""));
  }

  $("#sampleCsvBtn").on("click", function () {
    $("#csvText").val(sampleCsv());
  });

  $("#parseCsvBtn").on("click", function () {
    var result = parseCsv($("#csvText").val());
    parsed = result.rows;
    errors = result.errors;
    renderPreview();
  });

  $("#importBtn").on("click", function () {
    if (!parsed.length) return alert("Import할 정상 데이터가 없습니다.");
    Api.loadAssets().done(function (assets) {
      Api.saveAssets(assets.concat(parsed));
      var successCount = parsed.length;
      $("#importResult").show().html("Import 완료: 성공 " + successCount + "건 / 실패 " + errors.length + "건");
      parsed = [];
      $("#previewBody").html('<tr><td colspan="6" class="empty">미리보기 데이터가 없습니다.</td></tr>');
    });
  });
});
