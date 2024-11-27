jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

describe("Arrive", function() {

    beforeEach(function() {
        // clear all binded events before running each test case
        Arrive.unbindAllArrive();
        Arrive.unbindAllLeave();
    });

    describe("Arrive Event Tests", function() {

        describe("Binding events to different element types:", function() {
            var selector = ".test-elem";

            it("event should be fired when 'arrive' event is binded to window", function(done) {
                var $appendedElem = $("<div class='test-elem'></div>");

                j(window).arrive(selector, function() {
                    expect(this).toBe($appendedElem[0]);
                    done();
                });
                $("body").append($appendedElem);
            });
        });

        describe("Selector involving single element:", function() {
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

                j(document).arrive(selector, function() {
                    expect(this).toBe($redBtn[0]);
                    done();
                });

                $("body .container1").append($appendedElem);
            });

            it("event should be fired when target element is directly injected in DOM", function(done) {
                $("body .container1").children().remove();

                var $redBtn = $("<span class='btn red'></span>");

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
                j(document).arrive(".container5 .btn.red", { fireOnAttributesModification: true }, function() {
                    expect(this).toBe($btn[0]);
                    done();
                });
                $btn.addClass("red");
            });

            it("Event should be fired when tooltip is added to an element and the element starts to satisfies event selector", function(done) {
                j(document).arrive(".container5 .btn[title='it works!']", { fireOnAttributesModification: true } , function() {
                    expect(this).toBe($btn[0]);
                    done(); 
                });
                $btn.attr("title", "it works!");
            });

            it("Event should be not fired when a class is added to an element and the element starts to satisfies event selector but fireOnAttributesModification option is false", function(done) {
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
                selector = ".test-elem",
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

            it("arrive event should not be fired once unbind is called from within arrive callback", function(done) {

                var callbackCount = 0;
                j(document).arrive(".some-class", { existing: true }, function () {
                    document.unbindArrive(".some-class");
                    callbackCount++;
                });

                $("body").append($("<div class='some-class'></div>"));
                $("body").append($("<div class='some-class'></div>"));

                setTimeout(function() {
                    expect(callbackCount).toBe(1);
                    done();
                }, 400);
            });
        });

        describe("Multiple events tests.", function() {
            var selector = ".test-elem",
                appendedElem = "<div class='test-elem'></div>";

            it("Callback should be called multiple times when multiple elements are injected", function(done) {
                var callCount = 0;

                j(document).arrive(selector, function() {
                    callCount += 1;

                    if (callCount >= 2) {
                      expect(true).toBe(true);
                      done();
                    }
                });

                $("body").append(appendedElem);
                $("body").append(appendedElem);
            });

            it("onceOnly argument should result in callback being called only once", function(done) {
                var callCount = 0;

                j(document).arrive(selector, {onceOnly: true}, function() {
                    callCount += 1;
                });

                $("body").append(appendedElem);
                $("body").append(appendedElem);

                setTimeout(function() {
                    expect(callCount).toBe(1);
                    done();
                }, 400);

            });
        });

        describe("options.timeout", function() {
            // Add beforeEach to clean up
            beforeEach(function() {
                $(".test-timeout-1, .test-timeout-2, .test-timeout-3, .test-timeout-4").remove();
            });

            afterEach(function() {
                // Clean up any remaining event listeners
                Arrive.unbindAllArrive();
            });

            it("should call callback with null when element is not found within timeout", function(done) {
                var selector = ".test-timeout-1";
                j(document).arrive(selector, { timeout: 200 }, function(elem) {
                    expect(elem).toBe(null);
                    done();
                });
            });

            it("should call callback with element when found before timeout", function(done) {
                var selector = ".test-timeout-2";
                var $appendedElem = $("<div class='test-timeout-2'></div>");

                j(document).arrive(selector, { timeout: 200 }, function(elem) {
                    expect(elem).toBe($appendedElem[0]);
                    done();
                });

                setTimeout(function() {
                    $("body").append($appendedElem);
                }, 100);
            });

            it("should call callback after timeout when onceOnly is true", function(done) {
                var selector = ".test-timeout-3";

                j(document).arrive(selector, { timeout: 200, onceOnly: true }, function(elem) {
                    expect(elem).toBe(null);
                    setTimeout(done, 200);
                });

                setTimeout(function() {
                    $("body").append($("<div class='test-timeout-3'></div>"));
                }, 300);
            });

            it("should not call callback if arrive has been unbinded", function(done) {
                var selector = ".test-timeout-4";
                var callCount = 0;
                var $elem = $("<div class='test-timeout-4'></div>");

                // Set up arrive handler
                j(document).arrive(selector, { timeout: 200 }, function(elem) {
                    callCount++;
                });

                // Unbind arrive before timeout
                setTimeout(function() {
                    Arrive.unbindAllArrive();
                    $("body").append($elem);
                }, 100);

                // Check after timeout that callback was not called
                setTimeout(function() {
                    expect(callCount).toBe(0);
                    done(); 
                }, 300);
            });

            it("should restart timeout when element is found and onceOnly is false", function(done) {
                var selector = ".test-timeout-4";
                var callCount = 0;
                var $firstElem = $("<div class='test-timeout-4'></div>");
                
                j(document).arrive(selector, { timeout: 300, onceOnly: false }, function(elem) {
                    callCount++;
                });

                // Add first element after 100ms
                setTimeout(function() {
                    $("body").append($firstElem);
                }, 100);

                // Check after 350ms (after timeout)
                setTimeout(function() {
                    expect(callCount).toBe(1);
                }, 350);

                // Check after 500ms (after timeout)
                setTimeout(function() {
                    expect(callCount).toBe(2);
                    done();
                }, 500);
            });

            it("should automatically unbind arrive event after timeout", function(done) {
                var selector = ".test-timeout-5";
                var callCount = 0;
                
                j(document).arrive(selector, { timeout: 200 }, function(elem) {
                    callCount++;
                });

                // Wait for timeout to pass
                setTimeout(function() {
                    // Add element after timeout
                    $("body").append($("<div class='test-timeout-5'></div>"));
                    
                    // Check after a delay that callback wasn't called
                    setTimeout(function() {
                        expect(callCount).toBe(1); // Should only be called once with null
                        done();
                    }, 200);
                }, 300);
            });
        });

        describe("options.existing", function() {
            var selector = ".test-existing";

            beforeEach(function() {
                $(".test-existing").remove();
            });

            it("callback should be called for existing element if options.existing is true", function(done) {
                var $existingElementA = $("<div class='" + selector.substring(1) + "'></div>");
                var $existingElementB = $existingElementA.clone();
                $("body").append($existingElementA).append($existingElementB);

                var count = 0;
                j(document).arrive(selector, { existing: true }, function() {
                    expect(this).toBe(!count ? $existingElementA[0] : $existingElementB[0]);
                    if ((count += 1) === 2) {
                        done();
                    }
                });
            });

            it("callback should be called for one existing element only if options.existing and options.onceOnly both are true", function(done) {
                var $existingElementA = $("<div class='" + selector.substring(1) + "'></div>");
                var $existingElementB = $existingElementA.clone();
                $("body").append($existingElementA).append($existingElementB);

                j(document).arrive(selector, { existing: true, onceOnly: true }, function() {
                    expect(this).toBe($existingElementA[0]);
                    done();
                });
            });
        });
        
        describe("Async/await and promise support:", function() {
            var selector = ".test-elem";
            
            beforeEach(function() {
                $(selector).remove();
            });
            
            it("should return the appended element", async function(done) {
                var $elemToAppend = $("<div class='test-elem'></div>");
                setTimeout(() => {$("body").append($elemToAppend);}, 250);
                var arrivedElem = await j(document).arrive(selector);
                expect(arrivedElem).toBe($elemToAppend[0]);
                done();
            });
            
            it("should return the existing element", async function(done) {
                var $existingElement = $("<div class='test-elem'></div>")[0];
                $("body").append($existingElement);
                var arrivedElem = await j(document).arrive(selector, {existing: true});
                expect(arrivedElem).toBe($existingElement);
                done();
            });
        });
    });

    describe("Leave Event Tests", function() {
        var selector = ".test-elem";

        it("event should be fired when element with specified class is removed from DOM", function(done) {
            $(selector).remove(); // remove any previous test element in DOM

            var $toBeRemoved = $("<div><div class='test-elem'></div></div>"), 
                $testElem    = $toBeRemoved.find(".test-elem");
            $("body").append($toBeRemoved);

            j(document).leave(selector, function() {
                expect(this).toBe($testElem[0]);
                done();
            });

            $(selector).remove();
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
                j(document).leave(selector, function() {
                    expect(this).toBe($redBtn[0]);
                    done();
                });
                $(".container2").remove();
            });

            it("event should be fired when target element is directly removed from DOM", function(done) {
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
        
        describe("Async/await and promise support:", function() {
            var selector = ".test-elem";
            
            beforeEach(function() {
                $(selector).remove();
                var $elemToBeRemoved = $("<div class='test-elem'></div>");
                $("body").append($elemToBeRemoved);
            });
            
            it("should finish once the existing element is removed", async function(done) {
                var $elemThatWillBeRemoved = $(selector)[0];
                setTimeout(() => {$(selector).remove();}, 250);
                var $removedEle = await j(document).leave(selector);
                expect($removedEle).toBe($elemThatWillBeRemoved);
                done();
            });
        });

        describe("options.timeout", function() {
            beforeEach(function() {
                $(".test-timeout-leave-1, .test-timeout-leave-2").remove();
            });

            afterEach(function() {
                Arrive.unbindAllLeave();
            });

            it("should call callback with null when element is not removed within timeout", function(done) {
                var selector = ".test-timeout-leave-1";
                var $elem = $("<div class='test-timeout-leave-1'></div>");
                $("body").append($elem);

                j(document).leave(selector, { timeout: 200 }, function(elem) {
                    expect(elem).toBe(null);
                    done();
                });
            });

            it("should call callback with element when removed before timeout", function(done) {
                var selector = ".test-timeout-leave-2";
                var $elem = $("<div class='test-timeout-leave-2'></div>");
                $("body").append($elem);

                j(document).leave(selector, { timeout: 200 }, function(elem) {
                    expect(elem).toBe($elem[0]);
                    done();
                });

                setTimeout(function() {
                    $elem.remove();
                }, 100);
            });
        });

        describe("Multiple leave events tests", function() {
            var selector = ".test-leave-multiple";

            beforeEach(function() {
                Arrive.unbindAllLeave();
                $(selector).remove();
            });

            it("Callback should be called multiple times when multiple elements are removed", function(done) {
                var callCount = 0;
                var $elements = $("<div class='test-leave-multiple'></div><div class='test-leave-multiple'></div>");
                $("body").append($elements);

                j(document).leave(selector, function() {
                    callCount += 1;
                    if (callCount >= 2) {
                        expect(callCount).toBe(2);
                        done();
                    }
                });

                $(selector).remove();
            });

            it("onceOnly option should result in callback being called only once", function(done) {
                var callCount = 0;
                var $elements = $("<div class='test-leave-multiple'></div><div class='test-leave-multiple'></div>");
                $("body").append($elements);

                j(document).leave(selector, { onceOnly: true }, function() {
                    callCount += 1;
                });

                $(selector).remove();

                setTimeout(function() {
                    expect(callCount).toBe(1);
                    done();
                }, 400);
            });
        });
    });

    describe("ES2015 arrow function support", function() {
        var selector = ".test-elem";
        it("Make sure the first argument equals `this` object", function(done) {
              var $appendedElem = $("<div class='test-elem'></div>");

              j(document).arrive(selector, function(elem) {
                  expect(this).toBe(elem);
                  done();
              });
              $("body").append($appendedElem);
        });

        it("Make sure the first argument equals `this` object with `options.onceOnly` and `options.existing`", function(done) {
              j(document).arrive(selector, {onceOnly: true, existing: true}, function(elem) {
                  expect(this).toBe(elem);
                  done();
                  $(selector).remove();
              });
        });
    });
});
