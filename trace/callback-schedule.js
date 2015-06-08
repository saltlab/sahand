var TraceUnit = require('./trace-unit.js');
var inherits = require('util').inherits;

function CallbackSchedule (name, startTime, index) {
    TraceUnit.call(this);
    this.name = name;
    this.startTime = startTime;
    this.type = 'callback_schedule';
    this.index = index;
}

CallbackSchedule.prototype.getIndex = function () {
    return this.index;
}

inherits(CallbackSchedule, TraceUnit);

module.exports = CallbackSchedule;