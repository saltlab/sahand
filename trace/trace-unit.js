function TraceUnit (type, startTime, name, index) {
    this.name = name;
    this.startTime = startTime;
    this.type = type;
    this.index = index;
}

TraceUnit.prototype.getName = function () {
    return this.name;
}

TraceUnit.prototype.getStartTime = function () {
    return this.startTime;
}

TraceUnit.prototype.getType = function () {
    return this.type;
}

TraceUnit.prototype.getIndex = function () {
    return this.index;
}

module.exports = TraceUnit;