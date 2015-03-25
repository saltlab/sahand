alert('async trace');

var logger = {};

/**
 * Prints the information related to creation of a XMLHTTPRequest object to the
 * console
 */
logger.logXHROpen = function(xhr, method, callerName) {

    console.log("------------------------------------");
    console.log("XMLHTTPREQUEST: OPEN");
};

/**
 * Prints the information related to sending a XHR object to server on the
 * console
 */
logger.logXHRSend = function(xhr, callerName) {

    console.log("------------------------------------");
    console.log("XMLHTTPREQUEST: SEND");
};

/**
 * Prints the information related to getting the response of a XHR object and
 * executing the callback function on the console
 */
logger.logXHRResponse = function(xhr, callerName) {

    console.log("------------------------------------");
    console.log("XMLHTTPREQUEST: RESPONSE");
};


/**********************/
/*** XMLHTTPREQUEST ***/
/**********************/

var XMLHttpRequest_original = XMLHttpRequest;

XMLHttpRequest = function() {

    var xhr = new XMLHttpRequest_original();

    // TODO UNIQUE RANDOM ID?
//    var id = generateRandomUniqueXHRId();
//    xhr.id = id;

    var open_original = xhr.open;
    xhr.open = function(method, url, async) {
		logger.logXHROpen(xhr, method, 'callerName_open');
        return open_original.apply(this, [ method, url, async ]);

    }

    var send_original = xhr.send;
    xhr.send = function(str) {
        logger.logXHRSend(xhr, 'callerName_send');
        return send_original.apply(this, [ str ]);
    }

    var onreadystatechange = function() {
        if (this.readyState == 4) {
            logger.logXHRResponse(this, 'callerName_response');
        }
    }

    var onload = function() {
        logger.logXHRResponse(this, 'callerName_response');
    }

    xhr.addEventListener("readystatechange", onreadystatechange, false);

    return xhr;
}



/**********************/
/*** XMLHTTPREQUEST ***/
/**********************/

logger.logSetTimeout = function(func, delay, params) {

    console.log("------------")
    console.log("SET TIMEOUT")

};

/**
 * Prints the information related to execution of the callback function of a
 * timeout to the console.
 */
logger.logTimeoutCallback = function(func) {

    console.log("------------")
    console.log("TIMEOUT CALLBACK")

};


// Keep the current setTimeout function
window.oldSetTimeout = window.setTimeout;

// Redefine setTimeout
window.setTimeout = function(func, delay, params) {
    var wrapperFunc = new Object();


    //var timeoutArgs = Array.prototype.slice.call(arguments, 2);
    var timeoutArgs = null;

    if (Object.prototype.toString.apply(func) === '[object String]') {
        wrapperFunc._original = func;
        wrapperFunc.name = func;
        func = wrapperFunc;
    }

    // Log the creation of the timeout
    logger.logSetTimeout(func, delay, timeoutArgs);

    // Call the original timeout after logging
    window.oldSetTimeout(function(/* params */) {
        try {
            logger.logTimeoutCallback(func);

            if (Object.prototype.toString.apply(func) === '[object Function]') {
                func.apply(null);
            } else if (Object.prototype.toString.apply(func) === '[object String]') {
                // eval(func);
            } else if (Object.prototype.toString.apply(func) === '[object Object]' && func._original) {
                eval(func._original);
            } else {
                window.console.log('Invalid timeout callback, must be Function or String.');
            }
        } catch (exception) {
            // alert("Timeout exception");
        }
    }, delay);
};