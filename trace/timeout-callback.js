var TraceUnit = require('./trace-unit.js');
var inherits = require('util').inherits;

function TimeoutCallback (name, startTime, index) {
    TraceUnit.call(this);
    this.name = name;
    this.startTime = startTime;
    this.type = 'to_cb';
    this.index = index;
}

TimeoutCallback.prototype.getIndex = function () {
    return this.index;
}

inherits(TimeoutCallback, TraceUnit);

module.exports = TimeoutCallback;