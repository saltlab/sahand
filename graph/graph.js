var entryPoints = [];
var functions = [];
var xhrs = [];
var timeouts = [];
var intervals = [];

var clientFunctions = [];
var serverFunctions = [];

var edges = [];

exports.addEntryPoint = function (node) {
    entryPoints.push(node);
}

exports.addFunction = function (f) {
    functions.push(f);
}

exports.addXhr = function (xhr) {
    xhrs.push(xhr);
}

exports.addTimeout = function (to) {
    timeouts.push(to);
}

exports.addInterval = function (interval) {
    intervals.push(interval);
}