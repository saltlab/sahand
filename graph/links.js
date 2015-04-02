function Link (name) {
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

function FunctionCall () {
    this.name = 'FunctionCall';
}



XHROpen.prototype = new Link();
XHROpen.prototype.constructor = XHROpen;

function XHROpen () {
    this.name = 'XHROpen';
}

XHRSend.prototype = new Link();
XHRSend.prototype.constructor = XHRSend;

function XHRSend () {
    this.name = 'XHRSend';
}

XHRCallback.prototype = new Link();
XHRCallback.prototype.constructor = XHRCallback;

function XHRCallback () {
    this.name = 'XHRCallback';
}


Callback.prototype = new Link();
Callback.prototype.constructor = Callback;

function Callback () {
    this.name = 'Callback';
}
