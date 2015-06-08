var TraceUnit = require('./trace-unit.js');
var inherits = require('util').inherits;

function FunctionCall (name, startTime, index) {
    TraceUnit.call(this);
    this.name = name;
    this.startTime = startTime;
    this.type = 'call';
    this.index = index;
}

FunctionCall.prototype.getIndex = function () {
    return this.index;
}

inherits(FunctionCall, TraceUnit);

module.exports = FunctionCall;