function Lifeline (name, side) {
    this.name = name;
    this.side = side; // server or client
    this.branches = {}; // map<c_id, branch>
//    this.execUnits = [];
}

Lifeline.prototype.getName = function () {
    return this.name;
}

Lifeline.prototype.getSide = function () {
    return this.side;
}

Lifeline.prototype.addBranch = function (index, branch) {
    this.branches[index] = branch;
}

/*
Lifeline.prototype.addUnit = function (unit) {
    this.execUnits.push(unit);
//    this.execUnits.add(unit);
//    this.execUnits[this.execUnits.length] = unit;
}

Lifeline.prototype.getUnits = function () {
    return this.execUnits;
}

Lifeline.prototype.getLastUnit = function () {
    if (execUnits.length <= 0)
        return null;
    return execUnits[execUnits.length - 1];
}

Lifeline.prototype.popLastUnit = function () {
    return this.execUnits.pop();
}
*/
module.exports = Lifeline;