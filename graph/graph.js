var entryPoints = [];
var functions = [];
var xhrs = [];
var timeouts = [];
var intervals = [];

var clientFunctions = [];
var serverFunctions = [];

var edges = [];

function addEntryPoint (node) {
    entryPoints.push(node);
}

function addFunction (f) {
    functions.push(f);
}

function addXhr (xhr) {
    xhrs.push(xhr);
}

function addTimeout (to) {
    timeouts.push(to);
}

function addInterval (interval) {
    intervals.push(interval);
}