var Modal = (function () {
  function open(selector) {
    $(selector).addClass("is-open");
  }

  function close(selector) {
    $(selector).removeClass("is-open");
  }

  function bindClose() {
    $(document).on("click", "[data-modal-close]", function () {
      close($(this).closest(".modal-backdrop"));
    });

    $(document).on("click", ".modal-backdrop", function (event) {
      if (event.target === this) close(this);
    });
  }

  return {
    open: open,
    close: close,
    bindClose: bindClose
  };
})();
