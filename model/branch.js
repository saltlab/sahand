var FunctionEnter = require('../trace/function-enter');

function Branch (caller, callId, lifeline) {
    this.caller = caller;   // the lifeline/branch ??? (branch) that called / scheduled this branch
    this.callId = callId; // id (__c_local) used for this execution / invocation
    this.execUnits = [];
    this.lifeline = lifeline;
}

Branch.prototype.getCaller = function () {
    return this.caller;
}

Branch.prototype.getCallId = function () {
    return this.callId;
}

Branch.prototype.getLifeline = function () {
    return this.lifeline;
}

Branch.prototype.addUnit = function (unit) {
    this.execUnits.push(unit);
}

Branch.prototype.getUnits = function () {
    return this.execUnits;
}

Branch.prototype.getLastUnit = function () {
    if (this.execUnits.length <= 0)
        return null;
    return this.execUnits[this.execUnits.length - 1];
}

Branch.prototype.popLastUnit = function () {
    return this.execUnits.pop();
}

Branch.prototype.getStartTime = function () {
    for (var i = 0; i < this.execUnits.length; i ++)
        if (this.execUnits[i] instanceof FunctionEnter)
            return this.execUnits[i].getStartTime();
    return -1;
}

module.exports = Branch;