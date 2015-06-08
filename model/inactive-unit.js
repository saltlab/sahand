var ExecutionUnit = require('./execution-unit.js');
var inherits = require('util').inherits;

function InactiveUnit (name, startTime, endTime, owner, alternativeUnit) {
    ExecutionUnit.call(this);
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.owner = owner;
    this.alternativeUnit = alternativeUnit;
    this.type = 'inacive';
}

//InactiveUnit.prototype = new ExecutionUnit();
//InactiveUnit.prototype.constructor = ScheduledUnit;

InactiveUnit.prototype.getAlternativeUnit = function () {
    return this.alternativeUnit;
}

inherits(InactiveUnit, ExecutionUnit);

module.exports = InactiveUnit;
