var ScheduledUnit = require('../model/scheduled-unit');
var ActiveUnit = require('../model/active-unit');
var InactiveUnit = require('../model/inactive-unit');
var TerminatedUnit = require('../model/terminated-unit');
var tracer = require('./read-trace');
var Lifeline = require('../model/lifeline');
var Branch = require('../model/branch');


tracer.getRawTrace(function (rawTrace) {
    console.log(JSON.stringify(rawTrace));
    buildLifelines(rawTrace['a']);

});




function buildLifelines(rawTrace) {
    var callStack = [];
    var lifelines = {};
    var lifelineNames = {}; // used for checking whether we have already created a lifeline for the function

    var mainBranch = new Branch('God', 0, 'none'); // TODO TODO TODO
    var branchStack = []; // TODO
    branchStack.push(mainBranch);

    var currentExecutingLifeline; ////////////////////

    var unitCounter = 0;
    while (unitCounter < rawTrace.length) {
        var unit = rawTrace[unitCounter ++];

//        if (unit.visited) // TODO
//            continue;


//        unit.markVisited(); // TODO

        var unitName = unit.name;
        if (typeof unitName == 'undefined') {
            console.log('ERROR: create-model::buildLifelines: unit name not set');

            // TODO TODO TODO OR TIMEOUTS AND STUFF
        }
        else {
            var lifeline;
            if (typeof lifelines[unitName] != 'undefined') {
                lifeline = lifelines[unitName];
            }
            else {
                lifeline = new Lifeline(unitName, unit.source);
                lifelines[unitName] = lifeline;
            }

            switch (unit.type) {
                case 'enter':
                    var branch;
                    if (branchStack[branchStack.length - 1].getLastUnit() instanceof ScheduledUnit)
                        branch = branchStack.get[branchStack.length - 1];
                    else {
                        branch = new Branch(branchStack[branchStack.length - 1], unit.getIndex(), lifeline);
                        branchStack.push(branch);
                    }

                    var activeUnit = new ActiveUnit(unitName, unit.startTime, '', branch);
                    branch.addUnit(activeUnit);

                    // TODO at exit add branch to lifeline???

                    break;
                case 'callback':
                    var branch = new Branch(branchStack[branchStack.length - 1], unit.getIndex(), lifeline);
                    // for the starttime, get the enter time of the branch function at the head of the stack - same for scheduler
                    // start time = scheduler.enter.startime
                    var scheduler = branchStack.get(branchStack.length - 1); // TODO
                    var scheduleTime = scheduler.getStartTime(); // TODO
                    if (scheduleTime == -1) // TODO
                        console.log("ERROR: create-model.js::buildLifelines: schedule time of callback error");
                    var scheduledUnit = new ScheduledUnit(unitName, scheduleTime, unit.time, branch, scheduler, 'callback', '?');
                    branch.addUnit(scheduledUnit);

                    branchStack.push(branch);

                    break;
                case 'exit':
                    var branch = branchStack.pop();
                    var terminatedUnit = new TerminatedUnit(unitName, unit.startTime, '?', branch);
                    branch.addUnit(terminatedUnit);

                    lifeline.addBranch(unit.getIndex(), branch);


                    break;
            }

        }




    }

    console.log(lifelines.toString());

}



function buildLifelines_old(rawTrace) {
    var callStack = [];
    var lifelines = [];
    var lifelineNames = {}; // used for checking whether we have already created a lifeline for the function


    var unitCounter = 0;
    while (unitCounter < rawTrace.length) {
        var unit = rawTrace[unitCounter ++];
        var unitName = unit.name;
        if (typeof unitName == 'undefined')
            console.log('ERROR: create-model::buildLifelines: unit name not set');
        switch (unit.type) {
            case 'enter':
                // check if lifeline was created for function before
                if (typeof lifelineNames[unitName] != 'undefined') {
                    // must extend the existing lifeline
                    var lifeline = lifelineNames[unitName];
                    var lastUnit = lifeline.getLastUnit();

                    lastUnit == new TerminatedUnit();

                    if (lastUnit != null) {
                        if (lastUnit instanceof TerminatedUnit) {
                            lastUnit.setEndtime(unit.getStartTime()); // TODO
                        }
                        else if (lastUnit instanceof ScheduledUnit) {
                            lastUnit.setEndTime(unit.getStartTime());
                        }
                        else {
                            console.log("ERROR: create-model::buildLifelines: wth happened before entering this function?");
                        }

                        var activeUnit = ActiveUnit(unitName, unit.startTime, 0, lifeline);
                        lifelineNames[name].addUnit(activeUnit)
                    }

                }
                else {
                    // must create a new lifeline
                    var lifeline = new Lifeline(unitName);
                    var activeUnit = new ActiveUnit(unitName, unit.startTime, 0, lifeline); // TODO owner = lifeline ???
                    lifeline.addUnit(activeUnit);
                    lifelines.push(lifeline);
//                    lifelines.add(lifeline);
                    lifelineNames.unitName = lifeline;// 'true'; // TODO
                }

                break;
            case 'exit':
                if (typeof lifelineNames[unitName] != 'undefined') {
//                    if (typeof lifelineNames[unitName] != 'undefined') {
                    // must extend the existing lifeline
                    var lifeline = lifelineNames[unitName];
                    var lastUnit = lifeline.getLastUnit();

                    if (lastUnit != null) {
                        if (lastUnit instanceof ActiveUnit) {
                            lastUnit.setEndTime(unit.startTime);
                        }
                        else {
                            console.log("ERROR: create-model::buildLifelines: should have entered the function before exiting");
                        }
                    }
//                    }

                }
                else {
                    console.log("ERROR: create-model::buildLifelines: should have entered the function before exiting");
                }

                break;
            case 'call':
                // TODO ?

                break;
            case 'callback':
                // TODO happens after 'enter'
                // TODO IS GOING TO CHANGE
                if (typeof lifelineNames[unitName] != 'undefined') {
                    var lifeline = lifelineNames[unitName];
                    var lastUnit = lifeline.getLastUnit();

                    if (lastUnit != null) {
                        if (lastUnit instanceof ActiveUnit) {
                            if (Math.abs(lastUnit.getStartTime() - unit.startTime) < 10) {
                                var activeUnit = lifeline.popLastUnit();
                                var scheduleUnit = new ScheduledUnit(unitName, unit.startTime, activeUnit.startTime, lifeLine, '', '', '');
                                lifeline.addUnit(scheduleUnit);
                                lifeline.addUnit(activeUnit);
                            }
                        }
                    }
                }
                else {
                    // TODO only valid after change
                }

                break;
            case 'to_set':

                break;
            case 'to_cb':

                break;

        }
    }

    console.log(lifelines.toString());

}




var act = new ActiveUnit('hi', '2', 3, 'man');

console.log(act.getName());

