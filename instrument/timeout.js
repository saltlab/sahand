var __to_set = require('../log/server-logger').to_set;
var __to_callback = require('../log/server-logger').to_callback;


var timeoutCounter = 0;


// Keep the current setTimeout function
__setTimeout = setTimeout;


// Redefine setTimeout
setTimeout = function(func, delay, params) {
    var wrapperFunc = new Object();

    var timeoutId = timeoutCounter ++;

    //var timeoutArgs = Array.prototype.slice.call(arguments, 2);
    var timeoutArgs = null;

    if (typeof func == 'function') {
        wrapperFunc._original = func;
//        wrapperFunc.name = func; // TODO TODO GET NAME
        // TODO SET ID
        func = wrapperFunc;
    }
    /*
     if (Object.prototype.toString.apply(func) === '[object String]') {
     wrapperFunc._original = func;
     wrapperFunc.name = func;
     func = wrapperFunc;
     }
     */
    // Log the creation of the timeout
    __to_set(func, delay, timeoutArgs, timeoutId);

    // Call the original timeout after logging
    __setTimeout(function() { // params ) {
        try {
            console.log('timeout');
//            logger.logTimeoutCallback(func); // TODO LOG
//            console.log('CALLBACK TO: ', func);
            __to_callback(func, timeoutId);

            if (typeof func._original == 'function')
                func._original.apply(null);
            else if (typeof func._original == 'object')
                eval(func._original);
            else
                console.log('INVALID timeout callback');

            /*            if (Object.prototype.toString.apply(func) === '[object Function]') {
             func.apply(null);
             } else if (Object.prototype.toString.apply(func) === '[object String]') {
             // eval(func);
             } else if (Object.prototype.toString.apply(func) === '[object Object]' && func._original) {
             eval(func._original);
             } else {
             console.log('Invalid timeout callback, must be Function or String.');
             }
             */
        } catch (exception) {
            // alert("Timeout exception");
        }
    }, delay);
};


//setTimeout(function() {console.log('to cb');}, 500);

