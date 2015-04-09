exports.Link = function (name) {
    this.name = name;
    this.source = null;
    this.sink = null;
}

Link.prototype.getName = function () {
    return this.name;
}

Link.prototype.setName = function (name) {
    this.name = name;
}



FunctionCall.prototype = new Link();
FunctionCall.prototype.constructor = FunctionCall;

exports.FunctionCall = function () {
    this.name = 'FunctionCall';
}



XHROpen.prototype = new Link();
XHROpen.prototype.constructor = XHROpen;

exports.XHROpen = function () {
    this.name = 'XHROpen';
}

XHRSend.prototype = new Link();
XHRSend.prototype.constructor = XHRSend;

exports.XHRSend = function() {
    this.name = 'XHRSend';
}

XHRCallback.prototype = new Link();
XHRCallback.prototype.constructor = XHRCallback;

exports.XHRCallback = function () {
    this.name = 'XHRCallback';
}


Callback.prototype = new Link();
Callback.prototype.constructor = Callback;

exports.Callback = function () {
    this.name = 'Callback';
}
