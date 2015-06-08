var TraceUnit = require('./trace-unit.js');
var inherits = require('util').inherits;

function FunctionEnter (name, startTime, index) {
    TraceUnit.call(this);
    this.name = name;
    this.startTime = startTime;
    this.type = 'enter';
    this.index = index;
}

FunctionEnter.prototype.getIndex = function () {
    return this.index;
}

inherits(FunctionEnter, TraceUnit);

module.exports = FunctionEnter;