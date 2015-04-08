exports.test = function() {
    return 'serverinstrument';
};

var fs = require('fs');
var path = require('path');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');


exports.instrumentAst = function (script) {
    var ast = esprima.parse(script, {loc: true});

    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if ('ReturnStatement' == node.type) {
                console.log('ReturnStatement');
                instrumentReturnStatement(node);
            }
/*            else if ('FunctionDeclaration' == node.type || 'FunctionExpression' == node.type) {
                instrumentFunctionEnter(node);
                console.log('FunctionDeclaration');
            }
*/          else if ('FunctionDeclaration' == node.type) {
                instrumentFunctionEnter(node, false);
                console.log('FunctionDeclaration');
            }
            else if ('FunctionExpression' == node.type) {
                // todo
                if ('CallExpression' == parent.type) {  // CALLBACK
                    console.log('FunctionExpression - Callback');
                    instrumentFunctionEnter(node, true);
                }
                else {  // no callback, like function declaration
                    instrumentFunctionEnter(node, false);
                    console.log('FunctionExpression');
                }
            }
            else if ('CallExpression' == node.type) {
                console.log('CallExpression');
            }
        },
        leave: function(node, parent) {
            if ('VariableDeclarator' == node.type) {
                console.log('VariableDeclarator');
            }
        }
    });

    return ast;
}

function instrumentReturnStatement(node) {
    var returnStatement = {};
    returnStatement["type"] = "CallExpression";
    returnStatement["callee"] = {};
    returnStatement["callee"]["type"] = "Identifier",
        returnStatement["callee"]["name"] = "_functionReturn";
    returnStatement["arguments"] = [];
    // the return statement is used without any arguments. for example: return;
    var originalArguments = {};
    originalArguments["type"] = "Identifier";
    originalArguments["name"] = "arguments";

    if (node.argument == null) {
        returnStatement["arguments"][0] = originalArguments;
    }
    else {
        returnStatement["arguments"][0] = originalArguments;
        returnStatement["arguments"][1] = node.argument;
    }
    node.argument = returnStatement;
}

function instrumentFunctionEnter(node, isCallback) {
    var functionEnterName = '_functionEnter_cb' ? isCallback : '_functionEnter';
    var name;

    // TODO TODO TODO TODO TODO TODO
    if (node.type == 'FunctionDeclaration') {
        // TODO TODO TODO TODO TODO TODO
        if (node.id.name == '_functionEnter' || node.id.name == '_functionExit' || node.id.name == '_functionEnter_callback')
            return estraverse.VisitorOption.Skip; //////////////// TODO TODO TODO ?????????????

        name = node.id.name;
//					console.log('***** DEC: ', name);
    }

    var functionBody = node.body.body;

    // TODO  TODO  TODO  TODO  TODO  TODO  TODO ???
    if (functionBody == null || functionBody == 'undefined') {//} || functionBody.length < 1) {
        console.warn('func-inst.js::instrumentAST -> empty function body');
    }
//								console.log(functionBody.length);


    // TODO TODO TODO  TODO TODO TODO ///////////////
    if (node.type == 'FunctionExpression') {
        name = node.id;
        if (name == null || typeof name == 'undefined') {
            // TODO TODO TODO
/////////////            name = sourcePage + ':' + node.body.loc.start.line + ':' + node.body.loc.start.column; ///// + '-' + node.body.loc.end.line + ':' + node.body.loc.end.column;
            // TODO TODO TODO
        }
    }
    // TODO TODO TODO  TODO TODO TODO ///////////////

    // TODO TODO ///////////////////////
    if (node.params.length == 0) {
        // saba here
        ////////////////////////////console.log('static: with NO args - ', window.numOfFuncsWithNoStaticArgs ++);
    }
    else {
        // saba here
        ////////////////////////////console.log('static: with args - ', window.numOfFuncsWithStaticArgs ++);
    }
    // TODO TODO TODO TODO
//////////////////////    logStaticFunctionName(name, node.params);
    // NEW VERSION SABA
    /***********
     addStaticFunctionArgs(name, node.params); // TODO TODO TODO TODO
     ***********/
    // TODO TODO TODO TODO

    // At the end of the execution of this function, this variable will contain the instrumented function body
    var instrumentedBody = [];

    // Instrument the beginning of the body by adding a logger function for entering each function
    var functionEnter = {};
    functionEnter["type"] = "ExpressionStatement";
    var expressionField = {};
    expressionField["type"] = "CallExpression";
    var calleeField = {};
    calleeField["type"] = "Identifier";
    calleeField["name"] = functionEnterName; // todo "_functionEnter";
    expressionField["callee"] = calleeField;
    var argumentField = [];
    var originalArguments = {};
    originalArguments["type"] = "Identifier";
    originalArguments["name"] = "arguments";
    argumentField[0] = originalArguments;
    expressionField["arguments"] = argumentField;
    functionEnter["expression"] = expressionField;

    // Instrument the end of the body (before a return statement if one exists) to log function exits
    var functionExit = {};
    functionExit["type"] = "ExpressionStatement";
    var expressionField_exit = {};
    expressionField_exit["type"] = "CallExpression";
    var calleeField_exit = {};
    calleeField_exit["type"] = "Identifier";
    calleeField_exit["name"] = "_functionExit";
    expressionField_exit["callee"] = calleeField_exit;
    var argumentField_exit = [];
    var originalArguments_exit = {};
    originalArguments_exit["type"] = "Identifier";
    originalArguments_exit["name"] = "arguments";
    argumentField_exit[0] = originalArguments_exit;
    expressionField_exit["arguments"] = argumentField_exit;
    functionExit["expression"] = expressionField_exit;
    //
//					console.log("copying functionEnter");
    instrumentedBody[0] = functionEnter;

    if (functionBody == null || typeof functionBody == 'undefined') {
        console.warn('functionBody UNDEFINED');
        // TODO TODO TODO
    }

    if (functionBody.length == 0) {
        instrumentedBody[1] = functionExit;
    }
    else {

        var lastExpression = functionBody[functionBody.length - 1];
//						console.log("length: ", functionBody.length);
//						console.log("lastExpression: ", lastExpression);
        if (lastExpression == null || lastExpression == undefined) {
            console.log(functionBody);
            console.log('>>');
        }
        if (lastExpression.type == 'ReturnStatement') {
            // Do not add _functionExit if the last statement is a return statement since the return statements must be instrumented separately
            // Just shift the statements to make room for _functionEnter

//						for (var i = 0; i < functionBody.length - 1; i ++) {
            for (var i = 0; i < functionBody.length; i ++) {
                instrumentedBody[i + 1] = functionBody[i];
            }
            /*	instrumentedBody[instrumentedBody.length] = functionExit;
             instrumentedBody[instrumentedBody.length] = functionBody[functionBody.length - 1];
             */
        }
        else {
            // Instrument function exit if the function does not end with a return statement
            for (var i = 0; i < functionBody.length; i ++) {
                instrumentedBody[i + 1] = functionBody[i];
            }
            instrumentedBody[instrumentedBody.length] = functionExit;
        }
    }

    node.body.body = instrumentedBody; ////////////////////////////// TODO TODO TODO
}

exports.generateScript = function (ast) {
    return escodegen.generate(ast);
}