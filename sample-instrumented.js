var __enter = require('./log/server-logger').enter;
var __exit = require('./log/server-logger').exit;
var __call = require('./log/server-logger').call;
var __cb = require('./log/server-logger').cb;

require('./instrument/timeout');

var __c_global = 0;
var __c_local = 0;


function f1(i, cb) {
    var __c_local = __c_global++;
    __enter(arguments, __c_local);
    if (i == 0) {
        __call(__cb('setTimeout', __c_local), arguments, __c_local, 'setTimeout', setTimeout(cb, 200));
    } else if (i == 1) {
        __call(__cb('cb', __c_local), arguments, __c_local, 'cb', cb());
    } else if (i == 2) {
        __call(__cb('setTimeout', __c_local), arguments, __c_local, 'setTimeout', setTimeout(cb, 0));
    }
    __exit(__c_local, arguments);
}
function f2() {
    var __c_local = __c_global++;
    __enter(arguments, __c_local);
    for (var i = 0; i < 3; i++) {
        (function (i) {
            var __c_local = __c_global++;
            __enter(arguments, __c_local);
            __call(__cb('f1', __c_local), arguments, __c_local, 'f1', f1(i, function () {
                var __c_local = __c_global++;
                __enter(arguments, __c_local);
                console.log('callback being executed');
                __exit(__c_local, arguments);
            }));
            __exit(__c_local, arguments);
        }(i));
    }
    __exit(__c_local, arguments);
}
__call(__cb('f2', __c_local), null, __c_local, 'f2', f2());