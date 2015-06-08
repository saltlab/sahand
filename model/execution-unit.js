
function ExecutionUnit (name, startTime, endTime, owner) {
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.owner = owner;
    this.visited = false;
}

ExecutionUnit.prototype.getName = function () {
    return this.name;
}

ExecutionUnit.prototype.getStartTime = function () {
    return this.startTime;
}

ExecutionUnit.prototype.getEndTime = function () {
    return this.endTime;
}

ExecutionUnit.prototype.getOwner = function () {
    return this.owner;
}

ExecutionUnit.prototype.visited = function () {
    return this.visited;
}

ExecutionUnit.prototype.markVisited = function () {
    this.visited = true;
}

module.exports = ExecutionUnit;



/***********
* Scheduled (not started/executed unit)
* @param name
* @param startTime
* @param duration
* @param owner
* @param scheduler
* @param callbackType
* @param alternativeUnit
* @constructor
*/
//
//exports.ScheduledUnit.prototype = new ExecutionUnit();
//exports.ScheduledUnit.prototype.constructor = ScheduledUnit;
//
//exports.ScheduledUnit = function (name, startTime, duration, owner, scheduler, callbackType, alternativeUnit) {
//    this.name = name;
//    this.startTime = startTime;
//    this.duration = duration;
//    this.owner = owner;
//    this.scheduler = scheduler;
//    this.callbackType = callbackType;
//    this.alternativeUnit = alternativeUnit;
//}
//
//ScheduledUnit.prototype.getScheduler = function () {
//    return this.scheduler;
//}
//
//ScheduledUnit.prototype.getCallbackType = function () {
//    return this.callbackType;
//}
//
//ScheduledUnit.prototype.getAlternativeUnit = function () {
//    return this.alternativeUnit;
//}
//
///*
//ScheduledUnit.prototype.getName = function () {
//return this.name;
//}
//
//ScheduledUnit.prototype.getStartTime = function () {
//return this.startTime;
//}
//
//ScheduledUnit.prototype.getDuration = function () {
//return this.duration;
//}
//
//ScheduledUnit.prototype.getOwner = function () {
//return this.owner;
//}
//*/
//
///**
//* Unit being executed
//* @param name
//* @param startTime
//* @param duration
//* @param owner
//* @constructor
//*/
//
//exports.ActiveUnit = function (name, startTime, duration, owner) {
//    this.name = name;
//    this.startTime = startTime;
//    this.duration = duration;
//    this.owner = owner;
//}
//
//ActiveUnit.prototype = new ExecutionUnit();
//ActiveUnit.prototype.constructor = ActiveUnit;
//
///**
//* Inactive unit (other called function / callback / etc is being executed)
//* @param name
//* @param startTime
//* @param duration
//* @param owner
//* @param alternativeUnit
//* @constructor
//*/
//
//exports.InactiveUnit = function (name, startTime, duration, owner, alternativeUnit) {
//    this.name = name;
//    this.startTime = startTime;
//    this.duration = duration;
//    this.owner = owner;
//    this.alternativeUnit = alternativeUnit;
//}
//
//    InactiveUnit.prototype = new ExecutionUnit();
//    InactiveUnit.prototype.constructor = ScheduledUnit;
//
//    InactiveUnit.prototype.getAlternativeUnit = function () {
//    return this.alternativeUnit;
//}







//function ExecutionUnit (name, startTime, duration, owner) {
//    this.name = name;
//    this.startTime = startTime;
//    this.duration = duration;
//    this.owner = owner;
//}
//
//ExecutionUnit.prototype.getName = function () {
//    return this.name;
//}
//
//ExecutionUnit.prototype.getStartTime = function () {
//    return this.startTime;
//}
//
//ExecutionUnit.prototype.getDuration = function () {
//    return this.duration;
//}
//
//ExecutionUnit.prototype.getOwner = function () {
//    return this.owner;
//}
//
///***********
// * Scheduled (not started/executed unit)
// * @param name
// * @param startTime
// * @param duration
// * @param owner
// * @param scheduler
// * @param callbackType
// * @param alternativeUnit
// * @constructor
// */
//
//function ScheduledUnit (name, startTime, duration, owner, scheduler, callbackType, alternativeUnit) {
//    this.name = name;
//    this.startTime = startTime;
//    this.duration = duration;
//    this.owner = owner;
//    this.scheduler = scheduler;
//    this.callbackType = callbackType;
//    this.alternativeUnit = alternativeUnit;
//}
//
//ScheduledUnit.prototype = new ExecutionUnit();
//ScheduledUnit.prototype.constructor = ScheduledUnit;
//
//ScheduledUnit.prototype.getScheduler = function () {
//    return this.scheduler;
//}
//
//ScheduledUnit.prototype.getCallbackType = function () {
//    return this.callbackType;
//}
//
//ScheduledUnit.prototype.getAlternativeUnit = function () {
//    return this.alternativeUnit;
//}
//
///*
// ScheduledUnit.prototype.getName = function () {
// return this.name;
// }
//
// ScheduledUnit.prototype.getStartTime = function () {
// return this.startTime;
// }
//
// ScheduledUnit.prototype.getDuration = function () {
// return this.duration;
// }
//
// ScheduledUnit.prototype.getOwner = function () {
// return this.owner;
// }
// */
//
///**
// * Unit being executed
// * @param name
// * @param startTime
// * @param duration
// * @param owner
// * @constructor
// */
//
//function ActiveUnit (name, startTime, duration, owner) {
//    this.name = name;
//    this.startTime = startTime;
//    this.duration = duration;
//    this.owner = owner;
//}
//
//ActiveUnit.prototype = new ExecutionUnit();
//ActiveUnit.prototype.constructor = ActiveUnit;
//
///**
// * Inactive unit (other called function / callback / etc is being executed)
// * @param name
// * @param startTime
// * @param duration
// * @param owner
// * @param alternativeUnit
// * @constructor
// */
//
//function InactiveUnit (name, startTime, duration, owner, alternativeUnit) {
//    this.name = name;
//    this.startTime = startTime;
//    this.duration = duration;
//    this.owner = owner;
//    this.alternativeUnit = alternativeUnit;
//}
//
//ScheduledUnit.prototype = new ExecutionUnit();
//ScheduledUnit.prototype.constructor = ScheduledUnit;
//
//ScheduledUnit.prototype.getAlternativeUnit = function () {
//    return this.alternativeUnit;
//}

