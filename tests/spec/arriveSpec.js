jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;

describe("Arrive", function() {

    describe("Arrive Event Tests", function() {

        describe("Selector involving single element: .test-elem", function() {
            var selector = ".test-elem";

            it("event should be fired when element with specified class is injected to DOM", function(done) {
                j(document).arrive(selector, done);
                $("body").append($("<div class='test-elem'></div>"));
            });

        });

        describe("Selector involving nested elements: div.container1 .container2 .btn.red", function() {
            var selector = "div.container1 .container2 .btn.red";
            $("body").append("<div class='container1'></div>");

            it("event should be fired when a tree is inserted and it contains an element which satisfy the selector", function(done) {
                j(document).unbindArrive();
                j(document).arrive(selector, done);
                $("body .container1").append($("<div class='container2'><span class='btn red'></span></div>"));
            });

            it("event should be fired when target element is directly injected in DOM", function(done) {
                $("body .container1").children().remove();
                j(document).unbindArrive();
                j(document).arrive(selector, done);
                $("body .container1").append($("<div class='container2'>"));
                $("body .container1 .container2").append($("<span class='btn red'></span>"));
            });

        });

        describe("Arrive event on attribute modification of an element.", function() {
            var $elem       = $("<div class='container5'><div class='btn'></div></div>"), 
                $btn        = $elem.find(".btn");

            $("body").append($elem);

            it("Event should be fired when a class is added to an element and the element starts to satisfies event selector", function(done) {
                j(document).unbindArrive();
                j(document).arrive(".container5 .btn.red", done);
                $btn.addClass("red");
            });

            it("Event should be fired when tooltip is added to an element and the element starts to satisfies event selector", function(done) {
                j(document).unbindArrive();
                j(document).arrive(".container5 .btn[title='it works!']", done);
                $btn.attr("title", "it works!");
            });
        });

        describe("Event unbinding tests", function() {
            var eventFired, 
                selector = ".test-elem";
                callback = function() {
                    eventFired = true;
                };


            beforeEach(function() {
                eventFired = false;
                j(document).arrive(selector, callback);
            });

            it("arrive event should not be fired when unbind is called", function(done) {
                j(document).unbindArrive();
                $("body").append($("<div class='test-elem'></div>"));

                setTimeout(function() {
                    expect(eventFired).not.toBeTruthy();
                    done();
                }, 400);
            });

            it("arrive event should not be fired when unbind is called with selector as an argument", function(done) {
                j(document).unbindArrive(selector);
                $("body").append($("<div class='test-elem'></div>"));

                setTimeout(function() {
                    expect(eventFired).not.toBeTruthy();
                    done();
                }, 400);
            });

            it("arrive event should not be fired when unbind is called with callback as an argument", function(done) {
                j(document).unbindArrive(callback);
                $("body").append($("<div class='test-elem'></div>"));

                setTimeout(function() {
                    expect(eventFired).not.toBeTruthy();
                    done();
                }, 400);
            });

            it("arrive event should not be fired when unbind is called with selector and callback as arguments", function(done) {
                j(document).unbindArrive(selector, callback);
                $("body").append($("<div class='test-elem'></div>"));

                setTimeout(function() {
                    expect(eventFired).not.toBeTruthy();
                    done();
                }, 400);
            });
        });
    });

    describe("Leave Event Tests", function() {
        var selector = ".test-elem";

        it("event should be fired when element with specified class is removed from DOM", function(done) {
            $(".test-elem").remove(); // remove any previous test element in DOM
            $("body").append($("<div><div class='test-elem'></div></div>"));
            j(document).leave(selector, done);
            $(".test-elem").remove();
        });

        describe("Selector involving nested elements: div.container1 .container2 .btn.red", function() {
            var selector = ".btn.red";

            beforeEach(function() {
                $(".btn.red").remove();
                $("body").append("<div class='container1'><div class='container2'><span class='btn red'></span></div></div>");
            });

            it("event should be fired when a tree is removed and it contains an element which satisfy the selector", function(done) {
                j(document).unbindLeave();
                j(document).leave(selector, done);
                $(".container2").remove();
            });

            it("event should be fired when target element is directly removed from DOM", function(done) {
                j(document).unbindLeave();
                j(document).leave(selector, done);
                $(".btn.red").remove();
            });

        });
    });
});
