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
        if (compareFunction(registeredEvent)) {
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

  compareFunctions = {

  };

  function unbindArriveAll() {
  	var target = this[0];
  	arriveEvents.removeEvent(function(eventObj) {
      return eventObj.data.target === target;
    });
  }

  function unbindArriveCallback(callback) {
  	var target = this[0];
  	arriveEvents.removeEvent(function(eventObj) {
      return eventObj.data.target === target && eventObj.callback === callback;
    });
  }

   // to enable function overriding - By John Resig (MIT Licensed)
	function addMethod(object, name, fn){
    var old = object[ name ];
    object[ name ] = function(){
      if ( fn.length == arguments.length )
        return fn.apply( this, arguments );
      else if ( typeof old == 'function' )
        return old.apply( this, arguments );
    };
	}

  /* expose API */
  $.fn.arrive       = arrive;

  // expose unbindArrive function with overriding 
  addMethod($.fn, "unbindArrive", function() {
  	var target = this[0];
  	arriveEvents.removeEvent(function(eventObj) {
      return eventObj.data.target === target;
    });
  });

  addMethod($.fn, "unbindArrive", function(selector) {
  	var target = this[0], 
  			callback = selector, 
  			compareFunction;

  	if (typeof selector === "function") {
  		compareFunction = function(eventObj) {
  			return eventObj.data.target === target && eventObj.callback === callback;
  		};
  	}
  	else {
  		compareFunction = function(eventObj) {
  			return eventObj.data.target === target && eventObj.data.selector === selector;
  		};
  	}
  	arriveEvents.removeEvent(compareFunction);
  });

  addMethod($.fn, "unbindArrive", function(selector, callback) {
  	var target = this[0];
  	arriveEvents.removeEvent(function(eventObj) {
      return eventObj.data.target === target && eventObj.data.selector === selector && eventObj.callback === callback;
    });
  });

})(this, jQuery);
