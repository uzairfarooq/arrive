describe("Arrive", function() {
  var createCallbackFired = false;

  it("should fire event that element has been injected in dom", function(done) {
    expect(createCallbackFired).toBeTruthy();
    done();
  });

  beforeEach(function(done) {
    $(document).create(".test-elem", function() {
      createCallbackFired = true;
      done();
    });
    $("body").append($("<div class='test-elem'></div>"));
  });

});