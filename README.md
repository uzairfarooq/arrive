# arrive.js
====

arrive.js provides events to watch for DOM elements creation and deletion. It makes use of [Mutation Observers](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) internally.

### Usage
Use `arrive` event to watch for elements creation:
 ```javascript
// watch for creation of an element which satisfies the selector ".test-elem"
$(document).arrive(".test-elem", function() {
    // 'this' refers to the newly created element
    var $newElem = $(this);
});

// the above event would watch for creation of element in whole document
// it's better to be more specific whenever possible, for example
$(".container-1").arrive(".test-elem", function() {
    var $newElem = $(this);
});
```
Make sure to remove listeners when they are no longer needed, it's better for performance:
 ```javascript
// unbind all arrive events on document element
$(document).unbindArrive();

// unbind all arrive events on document element which are watching for ".test-elem" selector
$(document).unbindArrive(".test-elem");

// unbind only a specific callback
$(document).unbindArrive(callbackFunc);

// unbind only a specific callback on ".test-elem" selector
$(document).unbindArrive(".test-elem", callbackFunc);
```