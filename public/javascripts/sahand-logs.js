var traceCounter = 0;   // TODO TODO TODO


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






/*******************/
/** FUNCTION LOGS **/
/*******************/
function _functionEnter(args) {
    var locName = getCallerFunctionName(args);
    // addDynamicFunctionArgs(locName, args);
    //logDynamicFunctionName(locName, args);
    console.log('FUNCTION ENTER: ', locName);
    /*	var name = args.callee.name;
     if (name == null || typeof name == 'undefined') {
     }
     console.log('1. ENTERed function', args.callee.name);
     if(args.length == 0) {
     console.log('dynamic: with NO args - ', window.numOfFuncsWithNoDynamicArgs ++);
     }
     else {
     console.log('dynamic: with args - ', window.numOfFuncsWithDynamicArgs ++);
     }
     */

    var trace = JSON.stringify({messageType: "FUNCTION_CALL", timeStamp: Date.now(), targetFunction: locName, counter: traceCounter++});
    bufferLog(trace);

    //console.log('xxxxxxxxxxx ', args);
    //console.log(getParamNames(arguments.callee.caller.toString()));
    //var argNames = getParamNames(args.callee.caller.toString());
    //console.log(argNames);

    for (var i = 0; i < args.length; i ++) {
        //console.log(args[i]);
        //console.log(args[i].toString());

        if (isFunction(args[i])) {
            var name = args[i].name;
            // TODO add a callback edge between the parent node and the named function
        }
    }
}


function _functionEnter_cb(args) { // means an anonymous callback
    var locName = getCallerFunctionName(args);
    console.log('FUNCTION ENTER CALLBACK: ', locName);

    var trace = JSON.stringify({messageType: "FUNCTION_CALL_CB", timeStamp: Date.now(), targetFunction: locName, counter: traceCounter++});
    bufferLog(trace);
}

function _functionExit(args) {
    console.log('FUNCTION EXIT: ', getCallerFunctionName(args));
    // console.log('1. EXITed function', args.callee.name, ' -- ', args.length);

    var locName = getCallerFunctionName(args);
    var trace = JSON.stringify({messageType: "FUNCTION_EXIT", timeStamp: Date.now(), targetFunction: locName, counter:traceCounter++});
    // scopeName ??
    bufferLog(trace);
}

function _functionReturn(args, orig_return) {
    var locName = getCallerFunctionName(args);
    // addDynamicFunctionRets(locName, orig_return);
    // console.log('1. RETURNed function', args.callee.name, ' -- ', orig_return, ' -- ', args.length);
    console.log('FUNCTION RETURN: ', locName);

    var trace = JSON.stringify({messageType: "RETURN_STATEMENT", timeStamp: Date.now(), label: locName, value: orig_return, counter: traceCounter++});
    bufferLog(trace);

    return orig_return;
}

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
        result = [];
    return result;
}

function isFunction(arg) {
    var getType = {};
    return arg && getType.toString.call(arg) === '[object Function]';
}