exports.test = function() {
    return 'serverinstrument';
};

var fs = require('fs');
var path = require('path');
//var esprima = require('esprima');
//var estraverse = require('estraverse');
var escodegen = require('escodegen');
var esinstrument = require('./esinstrument');

exports.instrument = function(dir) {
    var appFiles = fs.readdirSync(dir);

    appFiles.forEach(function (fileName) {
        var fileExt = path.extname(fileName);
        if ('.html' == fileExt || '.htm' == fileExt) {
            console.log('------- html');
        }
        else if ('.js' == fileExt) {
            console.log('js');
            var filePath = dir + '/' + fileName;
            var script = fs.readFileSync(filePath, 'utf8');
            var instrumentedAst = esinstrument.instrumentAst(script, filePath);
            var instrumentedScript = esinstrument.generateScript(instrumentedAst); // todo
            console.log('==============');
            console.log(instrumentedScript);
        }
    });
};
