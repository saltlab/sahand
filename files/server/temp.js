/*
var __enter = require('./log/server-logger').enter;
var __exit = require('./log/server-logger').exit;
var __call = require('./log/server-logger').call;

var __c_global = 0;
var __c_local = __c_global;
*/
//__enter('hello');
//__exit('hello');

function f1(i, cb) {
    if (i == 0) {
        //console.log('async delayed');
        setTimeout(cb, 200);
    }
    else if (i == 1) {
        //console.log('sync');
        cb();
        //cb();
    }
    else if (i == 2) {
        //console.log('async immediate');
        setTimeout(cb, 0);
    }
}

function f2() {
    for (var i = 0; i < 3; i ++) {
        (function (i) {
            f1(i, function () {
                console.log('callback being executed')
            });
        })(i);
    }
}

f2();


/*
function f1(i, cb) {
    var __c_local = __c_global++;
    __enter(arguments, __c_local);
    if (i == 0) {
        __call(arguments, __c_local, setTimeout(cb, 200));
    } else if (i == 1) {
        __call(arguments, __c_local, cb());
    } else if (i == 2) {
        __call(arguments, __c_local, setTimeout(cb, 0));
    }
    __exit(arguments, __c_local);
}
function f2() {
    var __c_local = __c_global++;
    __enter(arguments, __c_local);
    for (var i = 0; i < 3; i++) {
        (function (i) {
            var __c_local = __c_global++;
            __enter(arguments, __c_local);
            __call(arguments, __c_local, f1(i, function () {
                var __c_local = __c_global++;
                __enter(arguments, __c_local);
                console.log('callback being executed');
                __exit(arguments, __c_local);
            }));
            __exit(arguments, __c_local);
        }(i));
    }
    __exit(arguments, __c_local);
}
__call(null, __c_local, f2());
    */
/*

function f() {
    bar();
}

function bar() {
}
f();
 */
