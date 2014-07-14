jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;

describe("Arrive", function() {

    describe("Arrive Event Tests", function() {

        describe("Selector involving single element: .test-elem", function() {
            var selector = ".test-elem";

            it("event should be fired when element with specified class is injected to DOM", function(done) {
                var $appendedElem = $("<div class='test-elem'></div>");
                j(document).arrive(selector, function() {
                    expect(this).toBe($appendedElem[0]);
                    done();
                });
                $("body").append($appendedElem);
            });

        });

        describe("Selector involving nested elements: div.container1 .container2 .btn.red", function() {
            var selector = "div.container1 .container2 .btn.red";
            $("body").append("<div class='container1'></div>");

            it("event should be fired when a tree is inserted and it contains an element which satisfy the selector", function(done) {
                var $appendedElem   = $("<div class='container2'><span class='btn red'></span></div>"), 
                    $redBtn         = $appendedElem.find(".btn.red");

                j(document).unbindArrive();
                j(document).arrive(selector, function() {
                    expect(this).toBe($redBtn[0]);
                    done();
                });

                $("body .container1").append($appendedElem);
            });

            it("event should be fired when target element is directly injected in DOM", function(done) {
                $("body .container1").children().remove();

                var $redBtn = $("<span class='btn red'></span>");

                j(document).unbindArrive();
                j(document).arrive(selector, function() {
                    expect(this).toBe($redBtn[0]);
                    done();
                });

                $("body .container1").append($("<div class='container2'>"));
                $("body .container1 .container2").append($redBtn);
            });

        });

        describe("Arrive event on attribute modification of an element.", function() {
            var $elem       = $("<div class='container5'><div class='btn'></div></div>"), 
                $btn        = $elem.find(".btn");

            $("body").append($elem);

            it("Event should be fired when a class is added to an element and the element starts to satisfies event selector", function(done) {
                j(document).unbindArrive();
                j(document).arrive(".container5 .btn.red", { fireOnAttributesModification: true }, function() {
                    expect(this).toBe($btn[0]);
                    done();
                });
                $btn.addClass("red");
            });

            it("Event should be fired when tooltip is added to an element and the element starts to satisfies event selector", function(done) {
                j(document).unbindArrive();
                j(document).arrive(".container5 .btn[title='it works!']", { fireOnAttributesModification: true } , function() {
                    expect(this).toBe($btn[0]);
                    done(); 
                });
                $btn.attr("title", "it works!");
            });

            it("Event should be not fired when a class is added to an element and the element starts to satisfies event selector but fireOnAttributesModification option is false", function(done) {
                j(document).unbindArrive();

                var eventFired = false;
                j(document).arrive(".container5 .btn.red", function() {
                    eventFired = true;
                });
                $btn.addClass("red");

                setTimeout(function() {
                    expect(eventFired).not.toBeTruthy();
                    done();
                }, 400);
            });

            it("Event should be not fired when tooltip is added to an element and the element starts to satisfies event selector but fireOnAttributesModification option is false", function(done) {
                j(document).unbindArrive();

                var eventFired = false;
                j(document).arrive(".container5 .btn[title='it works!']", function() {
                    eventFired = true;
                });
                $btn.attr("title", "it works!");

                setTimeout(function() {
                    expect(eventFired).not.toBeTruthy();
                    done();
                }, 400);
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

            var $toBeRemoved = $("<div><div class='test-elem'></div></div>"), 
                $testElem    = $toBeRemoved.find(".test-elem");
            $("body").append($toBeRemoved);

            j(document).leave(selector, function() {
                expect(this).toBe($testElem[0]);
                done();
            });

            $(".test-elem").remove();
        });

        describe("Selector involving nested elements: div.container1 .container2 .btn.red", function() {
            var selector = ".btn.red", 
                $redBtn  = null;

            beforeEach(function() {
                $(".container1,.container5").remove();
                var $container1 = $("<div class='container1'><div class='container2'><span class='btn red'></span></div></div>");
                $redBtn = $container1.find(".btn.red");
                $("body").append($container1);
            });

            it("event should be fired when a tree is removed and it contains an element which satisfy the selector", function(done) {
                j(document).unbindLeave();
                j(document).leave(selector, function() {
                    expect(this).toBe($redBtn[0]);
                    done();
                });
                $(".container2").remove();
            });

            it("event should be fired when target element is directly removed from DOM", function(done) {
                j(document).unbindLeave();
                j(document).leave(selector, function() {
                    expect(this).toBe($redBtn[0]);
                    done();
                });
                $(".btn.red").remove();
            });

        });

        describe("Calling arrive function on NodeList and HTMLElement", function() {
            it("arrive function should be callable on NodeList", function() {
                document.getElementsByTagName("body").arrive(".test", function() {});
                expect(true).toBeTruthy();
            });

            it("arrive function should be callable on HTMLElement", function() {
                document.getElementsByTagName("body")[0].arrive(".test", function() {});
                expect(true).toBeTruthy();
            });
        });
    });
});
