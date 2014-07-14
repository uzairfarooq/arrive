function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

if (getParameterByName("withoutjQuery") == "true") {
  // run tests without jQuery
  delete jQuery;
  j = function(selector) {
    return $(selector)[0];
  };

  $("#jQueryBtn").text("Run tests with jQuery").val("false");
}
else {
  // run tests with jQuery
  j = $;
}