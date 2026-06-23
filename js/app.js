var App = (function () {
  var labels = {
    NORMAL: "정상",
    INSPECTION: "점검중",
    BROKEN: "고장",
    DISPOSED: "폐기",
    OPEN: "접수",
    ASSIGNED: "배정",
    IN_PROGRESS: "진행중",
    DONE: "완료",
    CANCELED: "취소",
    LOW: "낮음",
    MEDIUM: "보통",
    HIGH: "높음",
    URGENT: "긴급"
  };

  // URL query string에서 단일 값을 읽는다.
  function getQuery(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  // ISO 날짜 문자열을 목록 표시용 문자열로 변환한다.
  function formatDate(value) {
    if (!value) return "-";
    return value.replace("T", " ").slice(0, 16);
  }

  // 테이블 렌더링 시 XSS를 피하기 위해 HTML 문자를 이스케이프한다.
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 상태/우선순위를 공통 badge UI로 렌더링한다.
  function badge(value) {
    var className = String(value || "").toLowerCase().replace("_", "-");
    return '<span class="badge badge-' + className + '">' + (labels[value] || value || "-") + "</span>";
  }

  // 로그인되지 않은 사용자를 로그인 화면으로 보낸다.
  function requireLogin() {
    if (!localStorage.getItem(Storage.keys.loginUser)) {
      location.href = "login.html";
    }
  }

  // 공통 header/sidebar 이벤트와 현재 메뉴 표시를 초기화한다.
  function initLayout(activePage) {
    var user = Storage.get(Storage.keys.loginUser, null);
    $("#loginUserName").text(user ? user.userId : "");
    $('.side-nav a[data-page="' + activePage + '"]').addClass("is-active");

    $("#menuToggle").on("click", function () {
      $("#sidebar").toggleClass("is-open");
    });

    $("#logoutBtn").on("click", function () {
      localStorage.removeItem(Storage.keys.loginUser);
      location.href = "login.html";
    });

    $("#clearStorageBtn").on("click", function () {
      if (!confirm("저장된 샘플 데이터와 로그인 정보를 모두 초기화하시겠습니까?")) return;
      Storage.clearAll();
      location.href = "login.html";
    });
  }

  return {
    labels: labels,
    getQuery: getQuery,
    today: today,
    formatDate: formatDate,
    escapeHtml: escapeHtml,
    badge: badge,
    requireLogin: requireLogin,
    initLayout: initLayout
  };
})();
