var esprima = require('esprima');
var estraverse = require('estraverse');

var counter = 0;

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

function __enter(name, c, args) {
    //console.log('enter <', name, '> : ', c, '  --  ', args, ' -- ', Date.now());
    var logObj = {'type': 'enter', 'name': name, 'index': c, 'time': Date.now()};
    console.log(JSON.stringify(logObj));

    for (var i = 0; i < args.length; i ++) {
        if (typeof args[i] == 'function') {

////////////            console.log(args[i].name + ' is a function'); // TODO IF NOT NAMED TODO. GET THE NAME FROM THE LIST OF ARGUMENTS NOT FROM FUNCTION DECLARATION
            //console.log(args.callee.caller.toString());
////////////            console.log(arguments.callee.caller.toString());
            var functionScript = arguments.callee.caller.toString();
            var ast = esprima.parse(functionScript, {loc: true});

            var immediateCallback = false;
            // if callback argument is immediately called in the function
            estraverse.traverse(ast, {
                enter: function (node, parent) {
                    if ('ExpressionStatement' == node.type) {
                        if ('CallExpression' == node.expression.type) {
                            console.log('-------- ' + node['expression']['callee']['name'] + ' === ' + args[i].name + ' === ' + getParamNames(args.callee)[i]);
                            if (node['expression']['callee']['name'] == getParamNames(args.callee)[i]) { //args[i].name) {
                                //console.log('CALLBACK IS CALLED');
                                immediateCallback = true;

                                console.log('===================');
                                // TODO TODO TODO wrap this function invocation to know it's a callback
                                // todo
                                // todo
                                logObj = {'type': 'callback_immediate', 'name': node['expression']['callee']['name'], 'index': c, 'time': Date.now()};
                                console.log(JSON.stringify(logObj));
                            }
                        }
                    }
                }
            });

            if (immediateCallback) {
                // TODO
            }
            else {
                var passedCallback = false;
                // check if callback is passed as a param to another function
                estraverse.traverse(ast, {
                    enter: function (node, parent) {
                        if ('ExpressionStatement' == node.type) {
                            if ('CallExpression' == node.expression.type) {
                                var passedArgs = node['expression']['arguments'];
                                for (var argCtr = 0; argCtr < passedArgs.length; argCtr ++) {
                                    if (passedArgs[argCtr].name == getParamNames(args.callee)[argCtr]) {
                                        //console.log('CALLBACK PASSED AS ARG');
                                        passedCallback = true;

                                        // TODO instrument function call to show the callback goes further back - or find a way to connect
                                        logObj = {'type': 'callback_passed', 'name': passedArgs[argCtr].name, 'index': c, 'time': Date.now()};
                                        console.log(JSON.stringify(logObj));
                                    }
                                }
                            }
                        }
                    }
                });

                if (passedCallback) {
                    // TODO
                }
                else {
                    // TODO
                }
            }
        }
    }
}

function __exit(name, c, args) {
    //console.log('exit  <', name, '> : ', c, '  --  ', args, ' -- ', Date.now());
    var logObj = {'type': 'exit', 'name': name, 'index': c, 'time': Date.now()};
    console.log(JSON.stringify(logObj));
}

function __callback(cb, name, c, args) {
    var logObj = {'type': 'callback', 'name': name, 'index': c, 'time': Date.now()};
    console.log(JSON.stringify(logObj))
    return cb.apply(null, args);
}

function __callback_schedule(invocationContainingCb, schedulerFunc, cb, c, args) {
    var logObj = {'type': 'callback', 'scheduler': schedulerFunc, 'callbackName': cb, 'index': c, 'time': Date.now()};
    console.log(JSON.stringify(logObj));
    return invocationContainingCb;
    //return invocationContainingCb.apply(null, args);
}

function f1(i, cb) {
    var c = counter ++;
    __enter('f1', c, arguments);
    if (i == 0) {
        //console.log('async delayed');
        setTimeout(cb, 200);
    }
    else if (i == 1) {
        //console.log('sync');
        __callback(cb, 'cb', c, {});
    }
    else if (i == 2) {
        //console.log('async immediate');
        setTimeout(cb, 0);
    }
    __exit('f1', c, arguments);
}

function f2() {
    for (var i = 0; i < 3; i ++) {
        (function (i) {
            var c = counter ++;
            __enter('anon', c, arguments);
            __callback_schedule(f1(i, function () {
                var c = counter ++;
                __enter('callback', c, arguments);
                //console.log('callback');
                __exit('callback', c, arguments);
            }), 'anon', 'anon', c, {});
            __exit('anon', c, arguments);
        })(i);
    }
}

f2();

console.log("**************************");
/*
function f10(i, cb) {
    cb();
    return 2;
}
setTimeout(function () {
    var a = __callback_schedule(f10(10, function () {
       console.log('helloooo');
    }), 'anon', 'cb', 20, {});
    console.log(a);
}, 1500);
*/
/*

///////////////////
// closure

function add() {
    var c = counter ++;
    __enter('add', c, arguments);
    var ctr = 0;
    function plus() {
        var c = counter ++;
        __enter('add closure', c, arguments);
        ctr += 1;}
    plus();
    return ctr;
}

console.log(add());
console.log('=========');

var add2 = (function () {
    var c = counter ++;
    __enter('add 2', c, arguments);
    var ctr = 0;
    __exit('add 2', c, arguments);
    return function () {
        var c = counter ++;
        __enter('add 2 closure', c, arguments);
        __exit('add 2 closure', c, arguments);
        return ctr += 1;
    }
})();

console.log(add2());
console.log(add2());

console.log('+++++++++++++++++++++++++');

// repassing callbacks

// 1. callback passed, not called
function g1(cb) {
    var c = counter ++;
    __enter('g1', c, arguments);
    g2(cb, 5);
    __exit('g1', c, arguments);
}

function g2(cb) { // does not call the callback
    var c = counter ++;
    __enter('g2', c, arguments);

    __exit('g2', c, arguments);
}

// 2. callback passed. called
function g3(cb) {
    var c = counter ++;
    __enter('g3', c, arguments);
    g4(cb);
    __exit('g3', c, arguments);
}

function g4(cb) { // calls the repassed callback
    var c = counter ++;
    __enter('g4', c, arguments);
    cb();
    __exit('g4', c, arguments);
}

// 3. callback passed as another callback (settimeout, xhr response, (OR OTHER SYSTEM FUNCS???))
function g5(cb) {
    var c = counter ++;
    __enter('g5', c, arguments);
    setTimeout(cb, 1000);
    __exit('g5', c, arguments);
}

// 4. closure
function g6(cb) {
    var c = counter ++;
    __enter('g6', c, arguments);
    var ctr = 0;
    function plus() {
        ctr += 1;
    }
    plus(cb);
    __exit('g6', c, arguments);
    return ctr;
}

// 4.5 closure
function g7(cb) {
    var c = counter ++;
    __enter('g7', c, arguments);
    var ctr = 0;
    function plus(cb) {
        ctr += 1;
        cb();
    }
    plus(cb);
    __exit('g7', c, arguments);
    return ctr;
}

// 5. closure
var g8 = (function (cb) {
    var c = counter ++;
    __enter('g8', c, arguments);
    var ctr = 0;
    __exit('g8', c, arguments);
    return function (cb) {
        return ctr += 1;
    }
})();

// 5.5 closure
var g9 = (function (cb) {
    var c = counter ++;
    __enter('g9', c, arguments);
    var ctr = 0;
    __exit('g9', c, arguments);
    return function (cb) {
        cb();
        return ctr += 1;
    }
})();

function tempCb() {
    console.log('temp cb');
}

var tempCtr = 0;

*/
/*
console.log("g" + ++ tempCtr);
g1(tempCb);
tempCtr ++;
console.log("g" + ++ tempCtr);
*/
//g3(tempCb);
/*
console.log("g" + ++ tempCtr);
g4(tempCb);
console.log("g" + ++ tempCtr);
g5(tempCb);
console.log("g" + ++ tempCtr);
g6(tempCb);
console.log("g" + ++ tempCtr);
g7(tempCb);
console.log("g" + ++ tempCtr);
g8(tempCb);
console.log("g" + ++ tempCtr);
g9(tempCb);
    */