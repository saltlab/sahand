exports.Node = function (name) {
    this.name = name;
    this.source = [];
    this.sink = [];
}

Node.prototype.getName = function () {
    return this.name;
}

Node.prototype.getSource = function () {
    return this.source;
}

Node.prototype.addSource = function (newSource) {
    this.source.push(newSource);
}

Node.prototype.getSink = function () {
    return this.sink;
}

Node.prototype.addSink = function (newSink) {
    this.sink.pubDate(newSink);
}


Function.prototype = new Node();
Function.prototype.constructor = Function;

exports.Function = function (name) {
    this.name = name;
    this.lineNo = -1;
    this.body = '';
}

Function.prototype.getLineNo = function () {
    return this.lineNo;
}

Function.prototype.setLineNo = function (lineNo) {
    this.lineNo = lineNo;
}

Function.prototype.getBody = function () {
    return this.body;
}

Function.prototype.setBody = function (body) {
    this.body = body;
}

XHR.prototype = new Node();
XHR.prototype.constructor = XHR;

exports.XHR = function (name) {
    this.name = name;
    this.opener = null;
    this.sender = null;
    this.callback = null;
}

XHR.prototype.getOpener = function () {
    return this.opener;
}

XHR.prototype.setOpener = function (opener) {
    this.opener = opener;
}

XHR.prototype.getSender = function () {
    return this.sender;
}

XHR.prototype.setSender = function (sender) {
    this.sender = sender;
}

XHR.prototype.getCallback = function () {
    return this.callback;
}

XHR.prototype.setCallback = function (callback) {
    this.callback = callback;
}