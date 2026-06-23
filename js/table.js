var TableUtil = (function () {
  function sortRows(rows, sortKey, sortDir) {
    if (!sortKey) return rows;
    return rows.slice().sort(function (a, b) {
      var av = String(a[sortKey] || "");
      var bv = String(b[sortKey] || "");
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }

  function paginate(rows, page, pageSize) {
    var totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    var safePage = Math.min(Math.max(page, 1), totalPages);
    return {
      page: safePage,
      totalPages: totalPages,
      rows: rows.slice((safePage - 1) * pageSize, safePage * pageSize)
    };
  }

  function renderPagination($target, pageInfo, onChange) {
    var html = "";
    for (var i = 1; i <= pageInfo.totalPages; i += 1) {
      html += '<button type="button" class="page-btn ' + (i === pageInfo.page ? "is-active" : "") + '" data-page="' + i + '">' + i + "</button>";
    }
    $target.html(html);
    $target.find(".page-btn").on("click", function () {
      onChange(Number($(this).data("page")));
    });
  }

  return {
    sortRows: sortRows,
    paginate: paginate,
    renderPagination: renderPagination
  };
})();
