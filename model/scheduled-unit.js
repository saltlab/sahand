var ExecutionUnit = require('./execution-unit.js');
var inherits = require('util').inherits;


function ScheduledUnit (name, startTime, endTime, owner, scheduler, callbackType, alternativeUnit) {
    ExecutionUnit.call(this);
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.owner = owner;
    this.scheduler = scheduler;
    this.callbackType = callbackType; // callback/timeout/etc
    this.alternativeUnit = alternativeUnit;
    this.type = 'scheduled';
}

inherits(ScheduledUnit, ExecutionUnit);

//ScheduledUnit.prototype = new ExecutionUnit();
//ScheduledUnit.prototype.constructor = ScheduledUnit;

ScheduledUnit.prototype.getScheduler = function () {
    return this.scheduler;
}

ScheduledUnit.prototype.getCallbackType = function () {
    return this.callbackType;
}

ScheduledUnit.prototype.getAlternativeUnit = function () {
    return this.alternativeUnit;
}

ScheduledUnit.prototype.setEndTime = function (endTime) {
    this.endTime = endTime;
}

module.exports = ScheduledUnit;

/*
function Cat() {
    Animal.call(this);
}

inherits(Cat, Animal);

Cat.prototype.pat = function pat() {
    console.log('purr');
};

Cat.prototype.lasagna = function() {
    console.log('lasagna!');
    this.walked = true;
};

module.exports = Cat;
*/