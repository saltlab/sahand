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


