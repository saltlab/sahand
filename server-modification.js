var fs = require('fs');
var path = require('path');
var esinstrument = require('./server-instrument');

//var __to_set = require('./log/server-logger').to_set;
//var __to_callback = require('./log/server-logger').to_callback;

exports.instrument = function (dir) {
    var appFiles = fs.readdirSync(dir);

    appFiles.forEach(function (fileName) {
        var fileExt = path.extname(fileName);
        if ('.html' == fileExt || '.htm' == fileExt) {
//            console.log('------- html');
        }
        else if ('.js' == fileExt) {
//            console.log('js');
            var filePath = dir + '/' + fileName;
            var script = fs.readFileSync(filePath, 'utf8');
            var instrumentedAst = esinstrument.instrumentAst(script);
            var instrumentedScript = esinstrument.generateScript(instrumentedAst);
            console.log(instrumentedScript);
        }
    });
};
/*
exports.modifyTimeouts = function () {
//    __setTimeout = window.setTimeout;
}
*/


/*

// Keep the current setTimeout function
__setTimeout = setTimeout;


// Redefine setTimeout
setTimeout = function(func, delay, params) {
    var wrapperFunc = new Object();


    //var timeoutArgs = Array.prototype.slice.call(arguments, 2);
    var timeoutArgs = null;

    if (typeof func == 'function') {
        wrapperFunc._original = func;
//        wrapperFunc.name = func; // TODO TODO GET NAME
        // TODO SET ID
        func = wrapperFunc;
    }

//    if (Object.prototype.toString.apply(func) === '[object String]') {
//        wrapperFunc._original = func;
//        wrapperFunc.name = func;
//        func = wrapperFunc;
//    }

    // Log the creation of the timeout
    __to_set(func, delay, timeoutArgs);

    // Call the original timeout after logging
    __setTimeout(function() { // params ) {
        try {
            console.log('timeout');
//            logger.logTimeoutCallback(func); // TODO LOG
//            console.log('CALLBACK TO: ', func);
            __to_callback(func);

            if (typeof func._original == 'function')
                func._original.apply(null);
            else if (typeof func._original == 'object')
                eval(func._original);
            else
                console.log('INVALID timeout callback');

//            if (Object.prototype.toString.apply(func) === '[object Function]') {
//                func.apply(null);
//            } else if (Object.prototype.toString.apply(func) === '[object String]') {
//                // eval(func);
//            } else if (Object.prototype.toString.apply(func) === '[object Object]' && func._original) {
//                eval(func._original);
//            } else {
//                console.log('Invalid timeout callback, must be Function or String.');
//            }

        } catch (exception) {
            // alert("Timeout exception");
        }
    }, delay);
};


//setTimeout(function() {console.log('to cb');}, 500);

*/