var TraceUnit = require('./trace-unit.js');
var inherits = require('util').inherits;

function CallbackInvocation (name, startTime, index) {
    TraceUnit.call(this);
    this.name = name;
    this.startTime = startTime;
    this.type = 'callback-old';
    this.index = index;
}

CallbackInvocation.prototype.getIndex = function () {
    return this.index;
}

inherits(CallbackInvocation, TraceUnit);

module.exports = CallbackInvocation;