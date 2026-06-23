var Validation = (function () {
  function clear($form) {
    $form.find(".field-error").text("");
  }

  function required($form, names) {
    var valid = true;
    clear($form);

    names.forEach(function (name) {
      var $field = $form.find('[name="' + name + '"]');
      if (!$.trim($field.val())) {
        $field.closest(".form-field").find(".field-error").text("필수값입니다.");
        valid = false;
      }
    });

    return valid;
  }

  return {
    clear: clear,
    required: required
  };
})();
