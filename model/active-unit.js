var ExecutionUnit = require('./execution-unit.js');
var inherits = require('util').inherits;

function ActiveUnit (name, startTime, endTime, owner) {
    ExecutionUnit.call(this);
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.owner = owner;
    this.type = 'active';
}

//ActiveUnit.prototype = new ExecutionUnit();
//ActiveUnit.prototype.constructor = ActiveUnit;

inherits(ActiveUnit, ExecutionUnit);

module.exports = ActiveUnit;
