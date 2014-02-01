"use strict";

(function(window, $, undefined) {
    function init() {
        
    }

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

    $.fn.create = function(selector, callback) {
        var target = this[0], 
            observer;

        if (target === window.document || target === window)
            target = window.document.body;

        // Create an observer instance
        observer = new MutationObserver(function(e) {
            onMutation.call(this, e, selector, callback);
        });

        // Configuration of the observer:
        var config = { 
            attributes: true, 
            attributeFilter: ["class"],
            childList: true, 
            subtree: true
        };
         
        // Pass in the target node, as well as the observer options
        observer.observe(target, config);
         
        // Later, you can stop observing
        //observer.disconnect();
    };

    init();
})(this, jQuery);
