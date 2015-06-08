var ExecutionUnit = require('./execution-unit.js');
var inherits = require('util').inherits;

function TerminatedUnit (name, startTime, endTime, owner) { //}, alternativeUnit) {
    ExecutionUnit.call(this);
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.owner = owner;
//    this.alternativeUnit = alternativeUnit;
    this.type = 'terminated';
}

TerminatedUnit.prototype.setEndtime = function (endTime) {
    this.endTime = endTime;
}

inherits(TerminatedUnit, ExecutionUnit);

module.exports = TerminatedUnit;
