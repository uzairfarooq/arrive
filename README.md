# arrive.js
========

arrive.js provides events to watch for DOM elements creation and deletion. It makes use of [Mutation Observers](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) internally.

### Usage
User `arrive` event to watch for elements creation:
 ```
$(document).arrive(".test-elem", function() {
    var $newlyInsertedElem = $(this);
});
```
