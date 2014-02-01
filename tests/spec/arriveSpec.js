jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;

$(function() {

	describe("Arrive", function() {

		describe("Create Event Tests", function() {
			describe("Selector involving single element: .test-elem", function() {
				var selector = ".test-elem";

				it("event should be fired when element with specified class is injected to DOM", function(done) {
					$(document).create(selector, done);
					$("body").append($("<div class='test-elem'></div>"));
			  	});

			});

			describe("Selector involving nested elements: div.container1 .container2 .btn.red", function() {
				var selector = "div.container1 .container2 .btn.red";
				$("body").append("<div class='container1'></div>");

				/*it("event should be fired when target element is nested within another element and the parent element is injected to DOM", function(done) {
					$(document).create(selector, done);
					$("body .container1").append($("<div class='container2'><span class='btn red'></span></div>"));
			  	});*/

			  	it("event should be fired when target element is directly injected in DOM", function(done) {
					$(document).create(selector, done);
					$("body .container1").append($("<div class='container2'>"));
					$("body .container1 .container2").append("<span class='btn red'></span>");
			  	});

			});

	  	});
	});

});