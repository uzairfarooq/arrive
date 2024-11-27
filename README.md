# arrive.js
[![CDNJS version](https://img.shields.io/cdnjs/v/arrive.svg)](https://cdnjs.com/libraries/arrive)

A lightweight JS library for watching DOM element creation and removal using [Mutation Observers](https://developer.mozilla.org/en/docs/Web/API/MutationObserver).

## Key Features
- Watch for element creation and removal in the DOM
- Zero dependencies
- Lightweight implementation
- Flexible configuration options

## Installation

```bash
npm install arrive --save   # Using NPM
```
Or [download arrive.min.js](https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js) directly.

## Usage

### Watch for New Elements
```javascript
// Basic usage
document.arrive(".test-elem", function(newElem) {
    // newElem is the newly created element
});

// Watch within a specific container (recommended for better performance)
document.querySelector(".container").arrive(".test-elem", function(newElem) {
    // More specific watching
});

// you can bind event to multiple elements at once
// this will bind arrive event to all the elements returned by document.querySelectorAll()
document.querySelectorAll(".box").arrive(".test-elem", function(newElem) {
});
```

### Promise-based Usage
> **Important:** Promise-based syntax resolves only for the first matching element. For monitoring multiple or continuous element creation, use the callback approach described above.
> 
> Note: There's no need to use the `onceOnly` option with Promise-based usage as Promises inherently resolve only once.

```javascript
var newElem = await document.arrive(".test-elem");
// do stuff with the element
```

### Options
The `arrive` event accepts an optional configuration object:

```javascript
{
    // Watch for changes to existing elements' attributes
    fireOnAttributesModification: false,    

    // Fire callback only once, then auto-unbind
    onceOnly: false,                        

    // Fire callback for elements that already exist in the DOM
    existing: false,                        

    // Call callback with null after specified milliseconds and Auto-unbind  (0 = disabled)
    timeout: 0                              
}
```

Example:
```javascript
document.arrive(".test-elem", {
    fireOnAttributesModification: true,  // Watch for attribute changes
    existing: true,                      // Include existing elements
    onceOnly: true,                      // Fire callback only once
    timeout: 5000                        // Auto-unbind after 5 seconds call callback with null
}, (newElem) => {
    console.log(newElem);
});
```

### Watch for Elements Removal
Use the `leave` event to detect when elements are removed from the DOM.

> **Important:** Due to MutationObserver API limitations, the selector must be direct (e.g., `.test-elem`) and cannot use descendant or child combinators (e.g., `.page .test-elem` is not allowed).

```javascript
// Watch for element removal
document.querySelector(".container-1").leave(".test-elem", function(removedElem) {
    // removedElem is the element that was just removed
});

// With options
document.querySelector(".container-1").leave(".test-elem", {
    onceOnly: true,    // Fire once per element
    timeout: 5000      // Auto-unbind after 5 seconds
}, function(removedElem) {
    // removedElem is the element that was just removed
});
```

### Unbinding Event Listeners
For better performance, make sure to remove listeners when they are no longer needed:

```javascript
// unbind all arrive events on document element
document.unbindArrive();

// unbind all arrive events on a specific element
document.querySelector(".box").unbindArrive();

// unbind all arrive events on document element which are watching for ".test-elem" selector
document.unbindArrive(".test-elem");

// unbind only a specific callback
document.unbindArrive(callbackFunc);

// unbind only a specific callback on ".test-elem" selector
document.unbindArrive(".test-elem", callbackFunc);

// unbind all arrive events (registered on any element)
Arrive.unbindAllArrive();

// Unbind all leave events on document element
document.unbindLeave();

// Unbind all leave events (registered on any element)
Arrive.unbindAllLeave();
```

## jQuery Support
If you use jQuery, you can call all arrive functions on jQuery elements as well:
```javascript
// watch for element creation in the whole HTML document
$(document).arrive(".test-elem", function(newElem) {
  // Note: newElem is a javascript element not a jQuery element
});

// this will attach arrive event to all elements returned by $(".container-1")
$(".container-1").arrive(".test-elem", function(newElem) {
  // Note: newElem is a javascript element not a jQuery element
});
```

## Browser Support
arrive.js is built over [Mutation Observers](https://developer.mozilla.org/en/docs/Web/API/MutationObserver) which is introduced in DOM4. It's supported in latest versions of all popular browsers.

| Browser           | Supported Versions
| ------------------|:-----------------:|
| Google Chrome     | 27.0+             |
| Firefox           | 14.0+             |
| Safari            | 6.1+              |
| Internet Explorer | 11.0+             |
| Opera             | 14.0+             |

## Contributing
#### Report a bug / Request a feature
If you want to report a bug or request a feature, use the [Issues](https://github.com/uzairfarooq/arrive/issues) section. Before creating a new issue, search the existing ones to make sure that you're not creating a duplicate. When reporting a bug, be sure to include OS/browser version and steps/code to reproduce the bug, a [JSFiddle](http://jsfiddle.net/) would be great.

#### Development
If you want to contribute to arrive, here is the workflow you should use:

1. Fork the repository.
2. Clone the forked repository locally.
3. From the `dev` branch, create and checkout a new feature branch to work upon. (If you want to work on some minor bug fix, you can skip this step and continue to work in `dev` branch)
4. Make your changes in that branch (the actual source file is `/src/arrive.js`).
5. If sensible, add some jasmine tests in `/tests/spec/arriveSpec.js` file.
6. Make sure there are no regressions by executing the unit tests by opening the file `/tests/SpecRunner.html` in a browser. There is a button 'Run tests without jQuery' at the top left of th page, click that button to make sure that the tests passes without jQuery. Run the test cases in all major browsers.
7. Push the changes to your github repository.
8. Submit a pull request from your repo back to the original repository.
9. Once it is accepted, remember to pull those changes back into your develop branch!

#### Some features/bugs you can send pull requests for
- [#70](https://github.com/uzairfarooq/arrive/issues/70): Add Typescript types to the project
- [#69](https://github.com/uzairfarooq/arrive/issues/69): Option to watch for text change

**Keywords**

javascript, js, jquery, node.js, watch, listen, creation, dynamically, removal, new, elements, DOM, dynamic, detect, insertions, event, bind, live, livequery
