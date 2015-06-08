var TraceUnit = require('./trace-unit.js');
var inherits = require('util').inherits;

function FunctionCallback (name, startTime, index) {
    TraceUnit.call(this);
    this.name = name;
    this.startTime = startTime;
    this.type = 'callback';
    this.index = index;
}

FunctionCallback.prototype.getIndex = function () {
    return this.index;
}

inherits(FunctionCallback, TraceUnit);

module.exports = FunctionCallback;