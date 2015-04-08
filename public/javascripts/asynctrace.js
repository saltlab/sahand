alert('async trace');

var traceCounter = 0;

/*******************/
/**** SEND LOGS *****/
/*******************/

window.xhr = new XMLHttpRequest();
window.buffer = new Array();

function bufferLog(log) {
    window.buffer.push(log);
}

function sendLogs() {
    if (window.buffer.length > 0) {
        window.xhr.open('POST', document.location.href + '?sahand', false);
        window.xhr.send('[' + (window.buffer).toString() + ']');
        window.buffer = new Array();
    }
}

setInterval(sendLogs, 5000);


/**********************
 GET THE FILE NAME
 AND THE LINE NUMBER
 OF THE CALLER FUNCTION
 **********************/
//BEGIN
function getErrorObject() {
    try { throw Error('') } catch(err) { return err; }
}

/**********
 FOR FIREFOX
 **********/
function getStackTrace(e) {
    return e.stack.replace(/(?:\n@:0)?\s+$/m, '')
        .replace(/^(?:\((\S*)\))?@/gm, '{anonymous}($1)@')
        .split('\n');
}

function getCallerFunctionName(args) {
    var caller = args.callee.caller;
    var callerName = "null";
    if (caller != null)
        if (caller.name != "")
            callerName = args.callee.caller.name;

    if (callerName == "null") {
        var err = getErrorObject();
        // get the last url
        var stackTrace = getStackTrace(err);

        if (stackTrace.length > 0) {
            var latestFunction = stackTrace[stackTrace.length - 1];
            // console.log('++++++++++++++ ', latestFunction);
            // tokenize the string
            //		var arrayOfStrings = latestFunction.split("/");
            //		var scope = arrayOfStrings[arrayOfStrings.length - 1];

            var scope = latestFunction; // TODO TODO TODO
            callerName = scope; // TODO TODO TODO

            /**********
             console.log('(): ', callerName);
             console.log('()(): ', scope);
             callerName = callerName + "+" + scope; // TODO
             if (callerName.length > 1)
             callerName = callerName.substring(0, callerName.length - 1);
             **********/
        }
    }

    return callerName;
}
//END


var logger = {};

/**
 * Prints the information related to creation of a XMLHTTPRequest object to the
 * console
 */
logger.logXHROpen = function(xhr, method, callerName) {

    console.log("------------------------------------");
    console.log("XMLHTTPREQUEST: OPEN");

    var date = Date.now();
    var trace = JSON.stringify({messageType: "XHR_OPEN", timeStamp: date, id: xhr.id, methodType: method, url: url, async: async, counter: traceCounter++});
    bufferLog(trace);
};

/**
 * Prints the information related to sending a XHR object to server on the
 * console
 */
logger.logXHRSend = function(xhr, callerName) {

    console.log("------------------------------------");
    console.log("XMLHTTPREQUEST: SEND");

    var date = Date.now();
    var trace = JSON.stringify({messageType: "XHR_SEND", timeStamp: date, id: xhr.id, message: str, counter: traceCounter++});
    bufferLog(trace);
};

/**
 * Prints the information related to getting the response of a XHR object and
 * executing the callback function on the console
 */
logger.logXHRResponse = function(xhr, callerName) {

    console.log("------------------------------------");
    console.log("XMLHTTPREQUEST: RESPONSE");

    var date = Date.now();
    var trace;

    if (xhr.onreadystatechange != null) {
        trace = JSON.stringify({messageType: "XHR_RESPONSE", timeStamp: date, id: xhr.id, callbackFunction: xhr.onreadystatechange.name, response: xhr.response, counter: traceCounter++});
    } else if (xhr.onload != null) {
        trace = JSON.stringify({messageType: "XHR_RESPONSE", timeStamp: date, id: xhr.id, callbackFunction: xhr.onload.name, response: xhr.response, counter: traceCounter++});
    } else {
        trace = JSON.stringify({messageType: "XHR_RESPONSE", timeStamp: date, id: xhr.id, callbackFunction: "", response: xhr.response, counter: traceCounter++});
    }
    bufferLog(trace);
};


/**********************/
/*** XMLHTTPREQUEST ***/
/**********************/

var __XMLHttpRequest = XMLHttpRequest;

XMLHttpRequest = function() {

    var xhr = new __XMLHttpRequest();

    // TODO UNIQUE RANDOM ID?
    var id = generateRandomUniqueId();
    xhr.id = id;

    var __open = xhr.open;
    xhr.open = function(method, url, async) {
		logger.logXHROpen(xhr, method, url, async);
        return __open.apply(this, [ method, url, async ]);

    }

    var __send = xhr.send;
    xhr.send = function(str) {
        logger.logXHRSend(xhr, str);
        return __send.apply(this, [ str ]);
    }

    var onreadystatechange = function() {
        if (this.readyState == 4) {
            logger.logXHRResponse(this);
        }
    }

    var onload = function() {
        logger.logXHRResponse(this);
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

    var date = Date.now();
    var trace = JSON.stringify({messageType: "TIMEOUT_SET", timeStamp: date, callbackFunction: func.name, delay: delay, counter: traceCounter ++});
    //var trace = JSON.stringify({messageType: "TIMEOUT_SET", timeStamp: date, timeoutId: func.id, callbackFunction: func.name, delay: delay, counter: traceCounter ++});
    bufferLog(trace);

};

/**
 * Prints the information related to execution of the callback function of a
 * timeout to the console.
 */
logger.logTimeoutCallback = function(func) {

    console.log("------------")
    console.log("TIMEOUT CALLBACK")

    var date = Date.now();
    var trace;

    if (Object.prototype.toString.apply(func) === '[object Function]') {
        // Callback is Function object
        trace = JSON.stringify({messageType: "TIMEOUT_CALLBACK", timeStamp: date, timeoutId: func.id, callbackFunction: func.name, counter: traceCounter++});
    } else if (Object.prototype.toString.apply(func) === '[object String]') {
        // Callback is String
        trace = JSON.stringify({messageType: "TIMEOUT_CALLBACK", timeStamp: date, timeoutId: func.id, callbackFunction: func, counter: traceCounter++});
    } else {
        // Callback is unknown type
        trace = JSON.stringify({messageType: "TIMEOUT_CALLBACK", timeStamp: date, timeoutId: func.id, callbackFunction: func.name, counter: traceCounter++});
    }
    bufferLog(trace);
};


// Keep the current setTimeout function
window.__setTimeout = window.setTimeout;

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
    window.__SetTimeout(function(/* params */) {
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

// random xhr id generator

function generateRandomUniqueId() {
    return PseudoGuid.GetNew();
}

var PseudoGuid = new (function() {
//    this.empty = "00000000-0000-0000-0000-000000000000";
    this.empty = "000000000000";
    this.GetNew = function() {
        var fourChars = function() {
            return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1).toUpperCase();
        }
        return (fourChars() + fourChars() + fourChars());
//    	return (fourChars() + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + fourChars() + fourChars());
    };
})();