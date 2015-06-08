var TraceUnit = require('./trace-unit.js');
var inherits = require('util').inherits;

function FunctionExit (name, startTime, index) {
    TraceUnit.call(this);
    this.name = name;
    this.startTime = startTime;
    this.type = 'exit';
    this.index = index;
}

FunctionExit.prototype.getIndex = function () {
    return this.index;
}

inherits(FunctionExit, TraceUnit);

module.exports = FunctionExit;