$(function () {
  $("#loginForm").on("submit", function (event) {
    event.preventDefault();
    $("#loginError").text("");

    if (!Validation.required($(this), ["userId", "password"])) return;

    Api.login($("#userId").val(), $("#password").val())
      .done(function (user) {
        App.saveLoginUser(user);
        location.replace("dashboard.html");
      })
      .fail(function (reason) {
        $("#loginError").text(reason === "INVALID_LOGIN" ? "ID 또는 password가 올바르지 않습니다." : "로그인 데이터를 불러오지 못했습니다.");
      });
  });
});
