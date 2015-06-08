var fs = require('fs');
var LineByLineReader = require('line-by-line');
require('javascript.util');
var ArrayList = javascript.util.ArrayList;
var FunctionEnter = require('./function-enter');
var FunctionExit = require('./function-exit');
var FunctionCall = require('./function-call');
var FunctionCallback = require('./function-callback');
var TimeoutSet = require('./timeout-set');
var TimeoutCallback = require('./timeout-callback');
var CallbackInvocation = require('./callback-invocation');
var CallbackSchedule = require('./callback-schedule');
var path = require('path');

var trace = new ArrayList();

/*
var events = require('events');
var eventEmitter = new events.EventEmitter();

eventEmitter.on('doorOpen', ringBell);

eventEmitter.emit('doorOpen');
*/

//var content = fs.readFileSync('../files/log.txt');


//
//lr.on('request', function (cb) {
//    cb(trace);
//});

function parseLogUnit(line) {
    if (typeof line.type == 'undefined')
        return;

    var traceUnit;

    switch (line.type) {
        case "enter":
            traceUnit = new FunctionEnter(line.name, line.time, line.index);

            break;
        case "exit":
            traceUnit = new FunctionExit(line.name, line.time, line.index);

            break;
        case "call":
            traceUnit = new FunctionCall(line.name, line.time, line.index);

            break;
        case "callback":
            traceUnit = new FunctionCallback(line.name, line.time, line.index);

            break;
        case "to_set":
            traceUnit = new TimeoutSet(line.name, line.time, line.index);

            break;
        case "to_callback":
            traceUnit = new TimeoutCallback(line.name, line.time, line.index);

            break;
/*        case "callback":  // TODO TODO TODO callback_immediate
            traceUnit = new CallbackInvocation(line.name, line.time, line.index);
            break;
        case "callback_schedule":
            traceUnit = new CallbackSchedule(line.name, line.time, line.index);
            break;
            */
    }

    return traceUnit;
    //console.log('trace unit');
    //trace.add(traceUnit);
}
/*
//var getRawTrace = function (traceIsTready) {
    console.log(1);
    var lr = new LineByLineReader('../files/log.txt');

    lr.on('error', function (err) {
        // 'err' contains error object
    });
    console.log(2);

    lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        var logUnit = JSON.parse(line);
        console.log(logUnit);
        var logObj = parseLogUnit(logUnit);
    });
    console.log(3);

    lr.on('end', function () {
        // All lines are read, file is closed now.
        //console.log(trace);
//////////////////////        traceIsTready(trace);
        module.exports.emit('ready');
        //traceReadyCallback(trace);
    });

    console.log(4);

        //lr.emit('request', traceIsTready);
    //traceReadyCallback = traceIsTready;
    //var lr = new LineByLineReader('../files/log.txt');
//}
*/
//getRawTrace(function (data) {console.log("DATA"); console.log(data);});

//module.exports = getRawTrace;
//exports = getRawTrace;

/*
console.log(1);
var lr = new LineByLineReader('../files/log.txt');

lr.on('error', function (err) {
    // 'err' contains error object
});
console.log(2);

lr.on('line', function (line) {
    console.log('line');
    // 'line' contains the current line without the trailing newline character.
    var logUnit = JSON.parse(line);
    console.log(logUnit);
    var logObj = parseLogUnit(logUnit);
});
console.log(3);

var ready = false;

lr.on('end', function () {
    console.log('end');
    ready = true;
    // All lines are read, file is closed now.
    //console.log(trace);
//////////////////////        traceIsTready(trace);
//        module.exports.emit('ready');
//    cb(trace);
    //traceReadyCallback(trace);
});
*/
//lr.on('request', function (cb) {
//    console.log('trace: ', trace);
//    cb(trace);
//})


function getRawTrace (cb) {
    /*
    setTimeout(function () {
        console.log(__filename);
    fs.readFile("files/log.txt", "utf8", function(error, data) {
        if (error) {
            console.log("ERROR", error);
        }
        console.log("+++++ ", data);
        cb(data);
    })}, 0);
*/

//    __setTimeout(function () { // TODO
      setTimeout(function () {
//        var fileName = path.dirname(require.main.filename) + '/files/log.txt';
//        var lr = new LineByLineReader('../files/log.txt');
        var lr = new LineByLineReader('../files/log.txt');//fileName);

        lr.on('error', function (err) {
            // 'err' contains error object
        });

        lr.on('line', function (line) {
            // 'line' contains the current line without the trailing newline character.
            var logUnit = JSON.parse(line);
            var logObj = parseLogUnit(logUnit);
            trace.add(logObj);
        });

        lr.on('end', function () {
            cb(trace);

    })}, 0);

    //var content = fs.readFileSync('/files/log.txt');
    //console.log(content);
}

exports.getRawTrace = getRawTrace;

//exports.hello = function(cb) {
//    console.log(__filename);
//    console.log(__dirname);
//    //cb('hi');
//
//    cb(content);
/*
    console.log(1);
    var lr = new LineByLineReader('../files/log.txt');

    lr.on('error', function (err) {
        // 'err' contains error object
    });
    console.log(2);

    lr.on('line', function (line) {
        console.log('line');
        // 'line' contains the current line without the trailing newline character.
        var logUnit = JSON.parse(line);
        console.log(logUnit);
        var logObj = parseLogUnit(logUnit);
    });
    console.log(3);
    lr.on('end', function () {
        console.log('end');
        cb('bye');
        //ready = true;
        // All lines are read, file is closed now.
        //console.log(trace);
//////////////////////        traceIsTready(trace);
//        module.exports.emit('ready');
//    cb(trace);
        //traceReadyCallback(trace);
    });
*/
    /*    while (true) {
            if (ready) {
                console.log('hello');
                lr.emit('request', cb);
                break;
            }
        }
    */

    //console.log(4);

    //return 'hello';

//}