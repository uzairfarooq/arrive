"use strict";

(function(window, $, undefined) {
    function init() {
        
    }

    $.fn.create = function(selector, callback) {
        var target = this[0];
        if (target == document || target == window)
            target = document.body;

        var $target = $(target);

        function onMutation(mutations) {
            mutations.forEach(function( mutation ) {
                var newNodes            = mutation.addedNodes, 
                    $targetNode          = $(mutation.target);

                if( newNodes !== null && newNodes.length > 0 ) { // If there are new nodes added
                    var $nodes = $( newNodes ); // jQuery set
                    $nodes.each(function() {
                        var $node = $( this );
                        if( $node.is(selector) && !$node.data("cr-create-fired")) {
                            $node.data("cr-create-fired", true);
                            callback.call($node[0]);
                        }
                    });
                }
                else if (mutation.type === "attributes" && mutation.attributeName == "class") {
                    //$matchingElems = $(selector, $target);
                    if( $targetNode.is(selector) && !$targetNode.data("cr-create-fired")) {
                        $targetNode.data("cr-create-fired", true);
                        callback.call($targetNode[0]);
                    }
                }
            });
        }

        // Create an observer instance
        var observer = new MutationObserver(onMutation);

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
