$(function () {
  var redirect = App.getQuery("redirect");

  // 로그인 성공 후 이동할 내부 페이지 경로를 반환한다.
  function getLoginSuccessUrl() {
    if (!redirect || redirect.indexOf("http") === 0 || redirect.indexOf("//") === 0 || redirect.charAt(0) === "/") {
      return "dashboard.html";
    }
    return redirect;
  }

  $("#loginForm").on("submit", function (event) {
    event.preventDefault();
    $("#loginError").text("");

    if (!Validation.required($(this), ["userId", "password"])) return;

    Api.login($("#userId").val(), $("#password").val())
      .done(function (user) {
        App.saveLoginUser(user);
        location.href = getLoginSuccessUrl();
      })
      .fail(function (reason) {
        $("#loginError").text(reason === "INVALID_LOGIN" ? "ID 또는 password가 올바르지 않습니다." : "로그인 데이터를 불러오지 못했습니다.");
      });
  });
});
