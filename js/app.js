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
  var loginTimeoutMs = 60 * 60 * 1000;

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

  // 긴급이면서 아직 종료되지 않은 작업지시인지 확인한다.
  function isActiveUrgent(item) {
    return item.priority === "URGENT" && item.status !== "DONE" && item.status !== "CANCELED";
  }

  // 완료/취소된 긴급 작업지시는 우선순위 강조를 낮춰 표시한다.
  function priorityBadge(item) {
    if (item.priority === "URGENT" && !isActiveUrgent(item)) {
      return '<span class="badge badge-muted">' + labels[item.priority] + "</span>";
    }
    return badge(item.priority);
  }

  // 로그인 사용자 정보를 생성한다.
  function createLoginUser(user) {
    return {
      userId: user.userId,
      userName: user.userName || user.userId,
      role: user.role || "USER",
      loginAt: new Date().toISOString(),
      expiresAt: Date.now() + loginTimeoutMs
    };
  }

  // 저장된 로그인 정보가 유효한지 확인한다.
  function getLoginUser() {
    var user = Storage.get(Storage.keys.loginUser, null);
    if (!user) return null;
    if (!user.expiresAt || Date.now() > user.expiresAt) {
      clearLoginUser();
      return null;
    }
    return user;
  }

  // 로그인 사용자 정보를 저장한다.
  function saveLoginUser(user) {
    Storage.set(Storage.keys.loginUser, createLoginUser(user));
  }

  // 저장된 로그인 사용자 정보를 삭제한다.
  function clearLoginUser() {
    Storage.remove(Storage.keys.loginUser);
  }

  // 로그인 후 돌아올 현재 화면 경로를 만든다.
  function getCurrentPagePath() {
    var pageName = location.pathname.split("/").pop() || "index.html";
    return pageName + location.search;
  }

  // 로그인되지 않은 사용자를 로그인 화면으로 보낸다.
  function requireLogin() {
    if (!getLoginUser()) {
      location.href = "login.html?redirect=" + encodeURIComponent(getCurrentPagePath());
    }
  }

  // 공통 header/sidebar 이벤트와 현재 메뉴 표시를 초기화한다.
  function initLayout(activePage) {
    var user = getLoginUser();
    $("#loginUserName").text(user ? user.userId : "");
    $('.side-nav a[data-page="' + activePage + '"]').addClass("is-active");

    $("#menuToggle").on("click", function () {
      $("#sidebar").toggleClass("is-open");
    });

    $("#logoutBtn").on("click", function () {
      clearLoginUser();
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
    isActiveUrgent: isActiveUrgent,
    priorityBadge: priorityBadge,
    createLoginUser: createLoginUser,
    getLoginUser: getLoginUser,
    saveLoginUser: saveLoginUser,
    clearLoginUser: clearLoginUser,
    requireLogin: requireLogin,
    initLayout: initLayout
  };
})();
