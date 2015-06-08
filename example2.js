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
                            //console.log('-------- ' + node['expression']['callee']['name'] + ' === ' + args[i].name + ' === ' + getParamNames(args.callee)[i]);
                            if ('__' != node['expression']['callee']['name'].substr(0, 2)) {
                                if (node['expression']['callee']['name'] == getParamNames(args.callee)[i]) { //args[i].name) {
                                    //console.log('CALLBACK IS CALLED');
                                    immediateCallback = true;

                                    // TODO TODO TODO wrap this function invocation to know it's a callback
                                    // todo
                                    // todo
                                    //logObj = {'type': 'callback_immediate', 'name': node['expression']['callee']['name'], 'index': c, 'time': Date.now()};
                                    //console.log(JSON.stringify(logObj));
                                }
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
                                if ('__' != node.expression.callee.name.substring(0, 2)) {
                                    console.log('=-=-=-=-== ', node.expression.toString());
                                    console.log('++++ ', node.expression.callee.name);
                                    var passedArgs = node['expression']['arguments'];
                                    var callerArgs = getParamNames(args.callee);
                                    //var passedArgs = node['expression']['arguments'][2];    // TODO TODO TODO
                                    for (var argCtr = 0; argCtr < passedArgs.length; argCtr++) {
                                        //console.log("---->>>>>> ", passedArgs[argCtr].name);
                                        //console.log(passedArgs[argCtr].name, ' ??==?? ', getParamNames(args.callee)[argCtr]);
                                        for (var newArgCtr = 0; newArgCtr < callerArgs.length; newArgCtr ++) {
                                            if (passedArgs[argCtr].name == callerArgs[newArgCtr]) {
                                                console.log('===================');
                                                //console.log('CALLBACK PASSED AS ARG');
                                                passedCallback = true;

                                                // TODO instrument function call to show the callback goes further back - or find a way to connect
                                                logObj = {
                                                    'type': 'callback_passed',
                                                    'name': passedArgs[argCtr].name,
                                                    'index': c,
                                                    'time': Date.now()
                                                };
                                                console.log(JSON.stringify(logObj));
                                            }
                                        }
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

function __callback(cback, name, c, args) {
    var logObj = {'type': 'callback', 'name': name, 'index': c, 'time': Date.now()};
    console.log(JSON.stringify(logObj))
    return cback.apply(null, args);
}

function __callback_schedule(invocationContainingCb, schedulerFunc, cback, c, args) {
    var logObj = {'type': 'callback_schedule', 'scheduler': schedulerFunc, 'callbackName': cback, 'index': c, 'time': Date.now()};
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
        //cb();
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
            __enter('for-anon', c, arguments);
            __callback_schedule(f1(i, function () {
                var c = counter ++;
                __enter('callback', c, arguments);
                //console.log('callback');
                __exit('callback', c, arguments);
            }), 'f1', 'for-anon', c, {});
            __exit('for-anon', c, arguments);
        })(i);
    }
}

f2();
