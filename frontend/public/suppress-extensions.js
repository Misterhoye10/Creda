// Suppress third-party browser extension errors (e.g. MetaMask inpage.js) from triggering Next.js dev overlay
(function () {
  if (typeof window === "undefined") return;

  function isExtensionError(err, str) {
    var text = "";
    if (str) text += str + " ";
    if (err) {
      if (err.message) text += err.message + " ";
      if (err.stack) text += err.stack + " ";
      if (err.reason) {
        if (err.reason.message) text += err.reason.message + " ";
        if (err.reason.stack) text += err.reason.stack + " ";
      }
      try {
        text += String(err);
      } catch (e) {}
    }
    return (
      text.indexOf("MetaMask") !== -1 ||
      text.indexOf("Failed to connect to MetaMask") !== -1 ||
      text.indexOf("nkbihfbeogaeaoehlefnkodbefgpgknn") !== -1 ||
      text.indexOf("chrome-extension://") !== -1 ||
      text.indexOf("moz-extension://") !== -1 ||
      text.indexOf("safari-extension://") !== -1 ||
      text.indexOf("extension not found") !== -1 ||
      text.indexOf("inpage.js") !== -1
    );
  }

  // 1. Intercept window.addEventListener to wrap Next.js error overlay listeners
  var rawAddEventListener = window.addEventListener;
  window.addEventListener = function (type, listener, options) {
    if ((type === "unhandledrejection" || type === "error") && typeof listener === "function") {
      var wrappedListener = function (event) {
        var err = (event && event.reason) || (event && event.error) || event;
        var msg = (event && event.message) || "";
        if (isExtensionError(err, msg)) {
          if (event && event.preventDefault) event.preventDefault();
          if (event && event.stopImmediatePropagation) event.stopImmediatePropagation();
          return false;
        }
        return listener.apply(this, arguments);
      };
      return rawAddEventListener.call(this, type, wrappedListener, options);
    }
    return rawAddEventListener.apply(this, arguments);
  };

  // 2. Direct capture-phase listeners to stop events before any bubbling listener
  rawAddEventListener.call(
    window,
    "unhandledrejection",
    function (event) {
      var err = event && event.reason;
      if (isExtensionError(err, err && err.message)) {
        if (event && event.preventDefault) event.preventDefault();
        if (event && event.stopImmediatePropagation) event.stopImmediatePropagation();
      }
    },
    true
  );

  rawAddEventListener.call(
    window,
    "error",
    function (event) {
      var err = event && event.error;
      var msg = (event && event.message) || (event && event.filename) || "";
      if (isExtensionError(err, msg)) {
        if (event && event.preventDefault) event.preventDefault();
        if (event && event.stopImmediatePropagation) event.stopImmediatePropagation();
      }
    },
    true
  );

  // 3. Dynamic getter/setter on console.error so Next.js patch cannot bypass suppression
  var currentConsoleError = console.error;
  try {
    Object.defineProperty(console, "error", {
      configurable: true,
      enumerable: true,
      get: function () {
        return function () {
          for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (isExtensionError(arg, typeof arg === "string" ? arg : "")) {
              return;
            }
          }
          return currentConsoleError.apply(console, arguments);
        };
      },
      set: function (newFn) {
        currentConsoleError = newFn;
      },
    });
  } catch (e) {
    console.error = function () {
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (isExtensionError(arg, typeof arg === "string" ? arg : "")) {
          return;
        }
      }
      return currentConsoleError.apply(console, arguments);
    };
  }
})();
