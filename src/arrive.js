"use strict";

(function(window, $, undefined) {

  // Class to mantain state of all registered events of a single type
  var EventsBucket = (function() {
    var EventsBucket = function() {
      // holds all the events
      this._eventsBucket    = [], 
      // function to be called while adding an event, the function should do the event initialization/registration
      this._beforeAdding    = null, 
      // function to be called while removing an event, the function should do the event destruction
      this._beforeRemoving  = null;
    };

    EventsBucket.prototype.addEvent = function(data, callback) {
      var newEvent = {
        data:       data, 
        callback:   callback
      };

      if (this._beforeAdding) {
        this._beforeAdding(newEvent);
      }
      
      this._eventsBucket.push(newEvent);
      return newEvent;
    };

    EventsBucket.prototype.removeEvent = function(compareFunction) {
      for (var i=0, registeredEvent; registeredEvent = this._eventsBucket[i]; i++) {
        if (compareFunction(registeredEvent.data)) {
          if (this._beforeRemoving) {
              this._beforeRemoving(registeredEvent);
          }
          this._eventsBucket.splice(i, 1);
        }
      }
    };

    EventsBucket.prototype.beforeAdding = function(beforeAdding) {
      this._beforeAdding = beforeAdding;
    };

    EventsBucket.prototype.beforeRemoving = function(beforeRemoving) {
      this._beforeRemoving = beforeRemoving;
    };

    return EventsBucket;
  })();


  var arriveEvents      = new EventsBucket(), 
      compareFunctions;

  // actual event registration before adding it to bucket
  arriveEvents.beforeAdding(function(registrationData) {
    var 
      target    = registrationData.data.target, 
      selector  = registrationData.data.selector, 
      callback  = registrationData.callback, 
      observer, 
      // Configuration of the observer
      config = { 
        attributes: true, 
        attributeFilter: ["class"],
        childList: true, 
        subtree: true
      };

    // mutation observer does not work on window or document
    if (target === window.document || target === window)
      target = window.document.body;

    // Create an observer instance
    observer = new MutationObserver(function(e) {
      onMutation.call(this, e, selector, callback);
    });
    
    observer.observe(target, config);

    registrationData.data.observer = observer;
  });

  // cleanup/unregister before removing an event
  arriveEvents.beforeRemoving(function(eventData) {
    eventData.data.observer.disconnect();
  });

  function onMutation(mutations, selectorToCheck, callback) {
    mutations.forEach(function( mutation ) {
      var newNodes    = mutation.addedNodes, 
          $targetNode = $(mutation.target);

      // If new nodes are added
      if( newNodes !== null && newNodes.length > 0 ) {
          // check each new node if it matches the selector
          for (var i=0, node; node = newNodes[i]; i++) {
              var $node = $(node);
              if ($node.is(selectorToCheck)) {
                  callback.call($node[0]);
              }
          }
      }
      /*else if (mutation.type === "attributes" && mutation.attributeName == "class") {
          //$matchingElems = $(selectorToCheck, $target);
          if( $targetNode.is(selectorToCheck) && !$targetNode.data("cr-create-fired")) {
              $targetNode.data("cr-create-fired", true);
              callback.call($targetNode[0]);
          }
      }*/
    });
  }

  function arrive(selector, callback) {
    arriveEvents.addEvent({
      target:   this[0], 
      selector: selector
    }, callback);
  }

  function unbindArrive(selector, callback) {
    var compareObj = {
      target: this[0]
    };

    if (arguments.length == 2) { 
      compareObj.selector = selector;
      compareObj.callback = callback;
    }
    if (arguments.length == 1) { 
      if (Object.prototype.toString.call(selector) == "[object Function]") {
        callback = selector; 
        compareObj.callback = callback;
      }
      else {
        compareObj.selector = selector; 
      }
    }

    arriveEvents.removeEvent(function(eventObj) {
      for (var prop in compareObj) {
        if (compareObj[prop] !== eventObj[prop]) {
          return false;
        }
      }
      return true;
    });
  }

  // expose API
  $.fn.arrive       = arrive;
  $.fn.unbindArrive = unbindArrive;

})(this, jQuery);
