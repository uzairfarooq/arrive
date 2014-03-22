# arrive.js

arrive.js provides events to watch for DOM elements creation and removal. It makes use of [Mutation Observers](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) internally.

[Download arrive-1.0.min.js](https://raw.githubusercontent.com/uzairfarooq/arrive/master/releases/arrive-1.0.min.js) (latest)

## Usage
###Watch for elements creation
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
###Watch for elements removal
Use `leave` event to watch for elements removal.
The first arugument to leave must not be a [descendent] (https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_selectors) or [child] (https://developer.mozilla.org/en-US/docs/Web/CSS/Child_selectors) selector i.e. you cannot pass `.page .test-elem`, instead, pass `.test-elem`. It's because of a limitation in MutationObserver's api.

```javascript
// watch for removal of an element which satisfies the selector ".test-elem"
$(".container-1").leave(".test-elem", function() {
    var $removedElem = $(this);
});
```

You can unbind the `leave` event in the same way as `arrive` event, using `unbindLeave` function.

##Browser Support
arrive.js is built over [Mutation Observers](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) which is introduced in DOM4. It's supported in latest versions of all popular browsers.

| Browser           | Supported Versions
| ------------------|:-----------------:|
| Google Chrome     | 27.0+             |
| Firefox           | 14.0+             |
| Safari            | 6.1+              |
| Internet Explorer | 11.0+             |
| Opera             | 14.0+             |
