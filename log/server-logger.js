var fs = require('fs');
var path = require('path');



function writeToFile(str) {
    var appDir = path.dirname(require.main.filename);
//    console.log('++++++ ', __dirname);
    /*
    var base = path.resolve('.'); //process.env.PWD;
    var p = base + '/files/log.txt';
    */
//    console.log('>>> ', appDir);

    var logFile = appDir + '/files/log.txt';
    fs.appendFileSync(logFile, str + '\n');
    /*
    fs.writeFile("/files/log.txt", str, function(err) {
        if(err) {
            return console.log(err);
        }
//        console.log("The file was saved!");
    });
    */
}


///// GET ARG NAMES
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
        result = [];
    return result;
}
//////



function getCurrentFunctionName(args) {
    var name = args.callee.toString();
    name = name.substr('function '.length);
    name = name.substr(0, name.indexOf('('));
    return name;
}


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
    var callerName = "null";

    if (args != null && typeof args != 'undefined') {
        var caller = args.callee.caller;
        if (caller != null)
            if (caller.name != "")
                callerName = args.callee.caller.name;
    }

    if (callerName == "null") {
        var err = getErrorObject();
        // get the last url
        var stackTrace = getStackTrace(err);

        if (stackTrace.length > 0) {
            var latestFunction = stackTrace[stackTrace.length - 1];
            // console.log('++++++++++++++ ', latestFunction);
            // tokenize the string
            //    var arrayOfStrings = latestFunction.split("/");
            //    var scope = arrayOfStrings[arrayOfStrings.length - 1];

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

    callerName = callerName.trim();

    if (callerName.indexOf('(') >= 0 && callerName.indexOf(')') >= 0) {
        callerName = callerName.substr(callerName.indexOf('('), callerName.indexOf(')'));
    }

    return callerName;
}
//END


function __enter(args, c) {
//    var name = getCallerFunctionName(args); // caller function
    var name = getCallerFunctionName(arguments); // existing function
    console.log('__enter > ', name);
    //console.log('enter <', name, '> : ', c, '  --  ', args, ' -- ', Date.now());
    var logObj = {'source': 'server', 'type': 'enter', 'name': name, 'index': c, 'time': Date.now()};
    console.log(JSON.stringify(logObj));

    writeToFile(JSON.stringify(logObj));

    // Check whether this function is passed a callback from the caller function
    /*
    var passedParams = tokenizeArgs(passedArgs);
    for (var i = 0; i < passedParams.length; i ++) {
        if ()
    }
    */



        /*
            // Check whether this is a callback invocation
            var callerParams = getParamNames(args.callee.caller); // caller function
        //    var callerParams = getParamNames(arguments.callee.caller); // existing function
        //    console.log("++++++++++++++ " + callerParams.toString());

        //    var currName = getCurrentFunctionName(f);
            for (var i = 0; i < callerParams.length; i ++) {
                console.log('- ', callerParams[i], '  --  ', fName);
                if (callerParams[i] == arguments) {
        //            console.log('CALLBACK');
                    logObj = {'type': 'callback', 'caller': name, 'callee': fName, 'index': c, 'time': Date.now()};
                    console.log(JSON.stringify(logObj));
                }
            }
            */
}

function __exit(c, args) {
//    var name = getCallerFunctionName(args); // caller function
    var name = getCallerFunctionName(arguments); // existing function
    console.log('> ', name);
    //console.log('exit  <', name, '> : ', c, '  --  ', args, ' -- ', Date.now());
    var logObj = {'source': 'server', 'type': 'exit', 'name': name, 'index': c, 'time': Date.now()};
    console.log(JSON.stringify(logObj));

    writeToFile(JSON.stringify(logObj));
}
/*
function __call(c, args, fName, passedArgs, f) {

//    var name = getCallerFunctionName(args); // caller function
    var name = getCallerFunctionName(arguments); // existing function
    console.log('__call > ', name);
    //console.log('exit  <', name, '> : ', c, '  --  ', args, ' -- ', Date.now());
    var logObj = {'source': 'server', 'type': 'call', 'caller': name, 'callee': fName, 'index': c, 'time': Date.now()};
    console.log(JSON.stringify(logObj));

    writeToFile(JSON.stringify(logObj));

    // TODO we keep these here in __call since we need the name used for invoking the function : may not be the name in function signature

    // Check whether this is a callback invocation
//    var callerParams = getParamNames(args.callee.caller); // caller function
    var callerParams = getParamNames(arguments.callee.caller); // existing function
//    console.log("++++++++++++++ " + callerParams.toString());

//    var currName = getCurrentFunctionName(f);
    for (var i = 0; i < callerParams.length; i ++) {
        console.log('- ', callerParams[i], '  --  ', fName);
        if (callerParams[i] == fName) {
//            console.log('CALLBACK');
            logObj = {'source': 'server', 'type': 'callback', 'caller': name, 'callee': fName, 'index': c, 'time': Date.now()};
            console.log(JSON.stringify(logObj));

            writeToFile(JSON.stringify(logObj));
        }
    }


    return f; // TODO TODO TODO
//    return f.apply(null, args); // TODO TODO TODO
}
*/
function __call(cbackLoggerFunc, args, c, fName, f) {

//    var name = getCallerFunctionName(args); // caller function
    var name = getCallerFunctionName(arguments); // existing function
    console.log('__call > ', name);
    //console.log('exit  <', name, '> : ', c, '  --  ', args, ' -- ', Date.now());
    var logObj = {'source': 'server', 'type': 'call', 'caller': name, 'callee': fName, 'index': c, 'time': Date.now()};
    console.log(JSON.stringify(logObj));

    writeToFile(JSON.stringify(logObj));

    // TODO we keep these here in __call since we need the name used for invoking the function : may not be the name in function signature
/*****************
    // Check whether this is a callback invocation
//    var callerParams = getParamNames(args.callee.caller); // caller function
    var callerParams = getParamNames(arguments.callee.caller); // existing function
//    console.log("++++++++++++++ " + callerParams.toString());

//    var currName = getCurrentFunctionName(f);
    for (var i = 0; i < callerParams.length; i ++) {
        console.log('- ', callerParams[i], '  --  ', fName);
        if (callerParams[i] == fName) {
//            console.log('CALLBACK');
            logObj = {'source': 'server', 'type': 'after_callback', 'caller': name, 'callee': fName, 'index': c, 'time': Date.now()};
            console.log(JSON.stringify(logObj));

            writeToFile(JSON.stringify(logObj));
        }
    }
***************/

    return f; // TODO TODO TODO
//    return f.apply(null, args); // TODO TODO TODO
}

function __cb(cbName, c) {
    if (typeof cbName == 'undefined' || cbName == 'null') {

    }
    else {
        var name = getCallerFunctionName(arguments); // existing function

        var callerParams = getParamNames(arguments.callee.caller); // existing function
//    console.log("++++++++++++++ " + callerParams.toString());

//    var currName = getCurrentFunctionName(f);
        for (var i = 0; i < callerParams.length; i ++) {
            console.log('- ', callerParams[i], '  --  ', cbName);
            if (callerParams[i] == cbName) {
//            console.log('CALLBACK');
                logObj = {'source': 'server', 'type': 'callback', 'caller': name, 'callee': cbName, 'index': c, 'time': Date.now()};
                console.log(JSON.stringify(logObj));

                writeToFile(JSON.stringify(logObj));
            }
        }

    }

}

function tokenizeArgs(args) {
    if (args == null || typeof args == 'undefined')
        return "";
    return args.split(",");
}

function __to_set(func, delay, params, id) {
    var date = Date.now();
    var trace = JSON.stringify({type: "to_set", time: date, callbackFunction: func.name, delay: delay, id: id}); //, index: index}); counter: traceCounter ++
    //var trace = JSON.stringify({messageType: "TIMEOUT_SET", timeStamp: date, timeoutId: func.id, callbackFunction: func.name, delay: delay, counter: traceCounter ++});
//    bufferLog(trace);
    writeToFile(trace);
}

function __to_callback(func, id) {
    var date = Date.now();
    var trace;

    console.log('>>>> ', func);

    var name = 'temp';//getCallerFunctionName(fund._original.arguments);

//    if (typeof func == 'function')
        trace = {type: "to_callback", time: date, callbackFunction: name, id: id};
//    else
//        console.log('func is not a FUNCTION');

//        trace = {messageType: "timeout_callback", time: date, timeoutId: func.id, callbackFunction: func.name, counter: traceCounter++};
/*
    if (Object.prototype.toString.apply(func) === '[object Function]') {
        // Callback is Function object
        trace = JSON.stringify({messageType: "timeout_callback", time: date, timeoutId: func.id, callbackFunction: func.name, counter: traceCounter++});
    } else if (Object.prototype.toString.apply(func) === '[object String]') {
        // Callback is String
        trace = JSON.stringify({messageType: "timeout_callback", time: date, timeoutId: func.id, callbackFunction: func, counter: traceCounter++});
    } else {
        // Callback is unknown type
        trace = JSON.stringify({messageType: "timeout_callback", time: date, timeoutId: func.id, callbackFunction: func.name, counter: traceCounter++});
    }
    */
//    bufferLog(trace);
    writeToFile(JSON.stringify(trace));
}

module.exports.enter = __enter;
module.exports.exit = __exit;
module.exports.call = __call;
module.exports.cb = __cb;

module.exports.to_set = __to_set;
module.exports.to_callback = __to_callback;



/*
function f(a, b, foo) {
    __enter(1, arguments);
//    console.log(getCallerFunctionName(arguments));
    var k = __call(1, arguments, 'foo', foo(1, 2));
    console.log(k);
//    __call(0, arguments, foo());
}

function bar(c, d) {
    console.log('bar');
    return 2;
//    __enter(0, arguments);
//    console.log(getCallerFunctionName(arguments));
}

//console.log(getCallerFunctionName(null));
f(1, 2, bar);
*/