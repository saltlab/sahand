var TraceUnit = require('./trace-unit.js');
var inherits = require('util').inherits;

function TimeoutSet (name, startTime, index) {
    TraceUnit.call(this);
    this.name = name;
    this.startTime = startTime;
    this.type = 'to_set';
    this.index = index;
}

TimeoutSet.prototype.getIndex = function () {
    return this.index;
}

inherits(TimeoutSet, TraceUnit);

module.exports = TimeoutSet;