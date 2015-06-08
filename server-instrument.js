var fs = require('fs');
//var script = fs.readFileSync('./temp.js');


var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');



exports.instrumentAst = function (script) {
    var ast = esprima.parse(script, {loc: true});
//    var ast = esprima.parse(script);

    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if ('ReturnStatement' == node.type) {
                //console.log('ReturnStatement');
                instrumentReturnStatement(node);
            }
            /*            else if ('FunctionDeclaration' == node.type || 'FunctionExpression' == node.type) {
             instrumentFunctionEnter(node);
             console.log('FunctionDeclaration');
             }
             */          else if ('FunctionDeclaration' == node.type) {
                instrumentFunctionEnter(node, false);
                //console.log('FunctionDeclaration');
            }
            else if ('FunctionExpression' == node.type) {
                // todo
                /*                if ('CallExpression' == parent.type) {  // CALLBACK
                 console.log('FunctionExpression - Callback');
                 instrumentFunctionEnter(node, true);
                 }
                 else {  // no callback, like function declaration
                 instrumentFunctionEnter(node, false);
                 console.log('FunctionExpression');
                 }
                 */
                instrumentFunctionEnter(node, false);
            }

        },
        leave: function(node, parent) {
            if ('VariableDeclarator' == node.type) {
//                console.log('VariableDeclarator');
            }
            else if ('CallExpression' == node.type) {

                if (typeof node.callee.name != 'undefined' && node.callee.name.substring(0, 2) != '__')
                    instrumentFunctionCall(node, parent);

            }
        }
    });

    return ast;
}

function instrumentReturnStatement(node) {
    var returnStatement = {};
    returnStatement["type"] = "CallExpression";
    returnStatement["callee"] = {};
    returnStatement["callee"]["type"] = "Identifier";
    returnStatement["callee"]["name"] = "__return";
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

function instrumentFunctionCall(node, parent) {
    if (typeof node.callee != 'undefined' && typeof node.callee.name != 'undefined' && node.callee.name.length > 2) {
        if (node.callee.name.substring(0, 2) == '__')
            return;
    }

    var calleeName = 'null';
    // TODO THIS CONDITION NEEDS TO GET UPDATED FOR OTHER TYPES OF FUNCTION INVOCATION (MEMBER EXPRESSION, OBJECT CREATION, ANONYMOUS, ETC)
    if (typeof node.callee != 'undefined' && typeof node.callee.name != 'undefined') {
        calleeName = node.callee.name;
    }

    var newNode = {
        "type": "CallExpression",
        "callee": {
            "type": "Identifier",
            "name": "__call"
        },
        "arguments": [
            {
                "type": "CallExpression",
                "callee": {
                    "type": "Identifier",
                    "name": "__cb"
                },
                "arguments": [
                    {
                        "type": "Literal",
                        "value": calleeName,
                        "raw": "'" + calleeName + "'"
                    },
                    {
                        "type": "Identifier",
                        "name": "__c_local"
                    }
                ]
            },
            {
                "type": "Identifier",
                "name": "arguments"
            },
            {
                "type": "Identifier",
                "name": "__c_local"
            },
            {
                "type": "Literal",
                "value": calleeName,
                "raw": "'" + calleeName + "'"
            },
//            {
//                "type": "Literal",
//                "value": passedArgs,
//                "raw": "'" + passedArgs + "'"
//            },
            {
                "type": "CallExpression",
                "callee": {
                    /*                    "type": "Identifier",
                     "name": "foo"
                     */                },
                "arguments": [
                    {
                        /*                        "type": "Identifier",
                         "name": "a"
                         */                    }
                ]
            }
        ]
    };
    /*
     newNode["arguments"][2] = node;
     */


    // TODO IF function call is in main window and has no arguments. maybe set a global arguments to null or something
    // TODO TODO TDOO
    // TODO TODO TDOO
    /*
     var currNode = node.parent;
     while (true) {
     if (currNode == null || typeof currNode == 'undefined' || currNode.type == 'FunctionExpression' || currNode.type == 'FunctionDeclaration')
     break;
     if (currNode.type == 'Program') {
     newNode.arguments[0].type = "Literal";
     newNode.arguments[0].value = null;
     newNode.arguments[0].raw = "null";
     break;
     }
     currNode = currNode.parent;
     }
     */
    // TODO TODO TDOO
    // TODO TODO TDOO


    newNode["arguments"][4].callee = node.callee;
    newNode["arguments"][4].arguments = node.arguments;
    node.callee = newNode.callee;
    node.arguments = newNode.arguments;


    //node = callStatment;
}

function instrumentFunctionEnter(node, isCallback) {
    var functionEnterName = '__enter';
    var name;

    // TODO TODO TODO TODO TODO TODO
    if (node.type == 'FunctionDeclaration') {
        // TODO TODO TODO TODO TODO TODO
        if (node.id.name.substring(0, 2) == '__')
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
    argumentField[1] = {};
    argumentField[1]["type"] = "Identifier";
    argumentField[1]["name"] = "__c_local";
    expressionField["arguments"] = argumentField;
    functionEnter["expression"] = expressionField;

    // Instrument the end of the body (before a return statement if one exists) to log function exits
    var functionExit = {};
    functionExit["type"] = "ExpressionStatement";
    var expressionField_exit = {};
    expressionField_exit["type"] = "CallExpression";
    var calleeField_exit = {};
    calleeField_exit["type"] = "Identifier";
    calleeField_exit["name"] = "__exit";
    expressionField_exit["callee"] = calleeField_exit;
    var argumentField_exit = [];
    var originalArguments_exit = {};
    originalArguments_exit["type"] = "Identifier";
    originalArguments_exit["name"] = "arguments";
    argumentField_exit[0] = {};
    argumentField_exit[0]["type"] = "Identifier";
    argumentField_exit[0]["name"] = "__c_local";
    argumentField_exit[1] = originalArguments_exit;
    /*
     var passedArgs = '';
     for (var m = 0; m < node.arguments.length; m ++) {
     if (node.arguments[m].type == 'Identifier')
     passedArgs = passedArgs + node.arguments[m].name + ",";
     }

     argumentField_exit[2] = {
     "type": "Literal",
     "value": calleeName,
     "raw": "'" + calleeName + "'"
     };
     */
    expressionField_exit["arguments"] = argumentField_exit;
    functionExit["expression"] = expressionField_exit;

    var localCounter = {
        "type": "VariableDeclaration",
        "declarations": [
            {
                "type": "VariableDeclarator",
                "id": {
                    "type": "Identifier",
                    "name": "__c_local"
                },
                "init": {
                    "type": "UpdateExpression",
                    "operator": "++",
                    "argument": {
                        "type": "Identifier",
                        "name": "__c_global"
                    },
                    "prefix": false
                }
            }
        ],
        "kind": "var"
    };
    //
//					console.log("copying functionEnter");
    instrumentedBody[0] = localCounter;
    instrumentedBody[1] = functionEnter;

    if (functionBody == null || typeof functionBody == 'undefined') {
        console.warn('functionBody UNDEFINED');
        // TODO TODO TODO
    }

    if (functionBody.length == 0) {
        instrumentedBody[2] = functionExit;
    }
    else {

        var lastExpression = functionBody[functionBody.length - 1];
//						console.log("length: ", functionBody.length);
//						console.log("lastExpression: ", lastExpression);
        if (lastExpression == null || lastExpression == undefined) {
//            console.log(functionBody);
//            console.log('>>');
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
                instrumentedBody[i + 2] = functionBody[i];
            }
            instrumentedBody[instrumentedBody.length] = functionExit;
        }
    }

    node.body.body = instrumentedBody; ////////////////////////////// TODO TODO TODO

}

exports.generateScript = function (ast) {
    return escodegen.generate(ast);
}

/*
var modifiedAst = instrumentAst(script);
//console.log(modifiedAst.toString());
script = generateScript(modifiedAst);
console.log(script.toString());
*/