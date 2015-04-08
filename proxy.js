var url = require('url');
var jsdom = require('jsdom');
var http = require('http');
var esinstrument = require('./esinstrument');
var $ = require('jQuery');

exports.instrumentResponse = function (req, res) {
    var instrumentedResponse = '';
    var options = {};
    var urlParts = url.parse(req.url, true);

    // TODO CHECK IF THE HEADER CONTAINS SAHAND MARK, SHOULD NOT BE INSTRUMENTED

    options = {
        host: req.headers.host,
        hostname: req.headers.host,
        path: urlParts.path,
        method: req.method,
        headers: req.headers
    };

    if ('POST' == req.method) {
        var postData = '';
        req.on('data', function(data) {
            postData += data;
        });
        req.on('end', function() {
            instrumentedResponse = proxify(options, req.method, data, res);
        });
    }
    else if ('GET' == req.method) {
        instrumentedResponse = proxify(options, req.method, '', res);
    }
}

function proxify (options, method, data, res) {
    var result = {};

    var callback = function (response) {
        var str = '';
        result.statusCode = response.statusCode;
        result.headers = response.headers;

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            var contentType = response.headers['content-type'];
            if ('undefined' == contentType) {
                console.log('content type undefined');
            }
            if (typeof contentType != 'undefined' && contentType.toLowerCase().indexOf('text/html') > -1) {
                console.log('html');
                jsdom.env(str, ["http://code.jquery.com/jquery.js"], function (error, window) {
//                    var $ = window.$;
                    if (!(typeof window.document.getElementsByTagName('title') == 'undefined') && !(typeof window.document.getElementsByTagName('title')[0] == 'undefined'))
                        console.log('title: ', window.document.getElementsByTagName('title')[0].innerHTML);
                    console.log('num of script tags: ', window.document.getElementsByTagName('script').length);

                    if (window.sahand == true) {

                    }
                    else {
                        appendSahandFiles(window.document);
/////////                           //instrumentInlineScript(window.document);
                        console.log('>>>>> ', window.document.outerHTML);
                        str = window.document.innerHTML;
                    }

                });
            }
            else if (typeof contentType != 'undefined' && contentType.toLowerCase().indexOf('javascript') > -1) {
                console.log('javascript');
                var instrumentedAst = esinstrument.instrumentAst(str);
                var instrumentedScript = esinstrument.generateScript(instrumentedAst);
//                result.data = instrumentedScript;
                str = instrumentedScript;
            }
            else {
                console.log('------- ', contentType);
            }

            result.data = str;
            res.writeHead(result.statusCode, result.headers);
            res.write(result.data);
            res.end();
        });
    }

    var request = http.request(options, callback)
    if (typeof method != 'undefined' && method.toLowerCase().indexOf('post') > -1) {
        request.write(data);
    }
    request.end();
}
/*
function instrumentInlineScript(document) {
    var existingScriptTags = document.getElementsByTagName('script');
    if (existingScriptTags == null || typeof existingScriptTags == 'undefined') {
        console.warn('existingScriptTags UNDEFINED');
    }
    else {
        for (var i = 0; i < existingScriptTags.length; i ++) {
            var elem = existingScriptTags[i];
            var instrumented = elem.getAttribute('instrumented');
            if ('true' == instrumented) {
                continue;
            }
            var srcAttr = elem.getAttribute('src');
            if (srcAttr == null || srcAttr == 'undefined') {
                replaceInlineScript(elem, document);
            }
            else {
                // TODO REPLACE EXTERNAL FILES TOO?
            }
        }
    }
}

function replaceInlineScript(node, document) {
    var scriptText = node.innerHTML;

    var instrumentedAst = esinstrument.instrumentAst(scriptText);
    var instrumentedScript = esinstrument.generateScript(instrumentedAst);

    var instrumentedNode = document.createElement('script');
    instrumentedScript.setAttribute('instrumented', 'true');
    instrumentedScript.innerHTML = instrumentedScript;

    node.parentNode.replaceChild(instrumentedNode, node);
}
*/
function appendSahandFiles(document) {
    var functionTraceFile = document.createElement('script');
    functionTraceFile['instrumented'] = true;
    functionTraceFile.src = 'javascripts/sahand-log.js';
    //functionTraceFile.setAttribute('instrumented', 'true');
    //functionTraceFile.setAttribute('src', 'javascripts/sahand-log.js');

    var asyncTraceFile = document.createElement('script');
    functionTraceFile.setAttribute('instrumented', 'true');
    functionTraceFile.setAttribute('src', 'javascripts/asynctrace.js');

    if (document.head.children.length > 0) {
        document.head.insertBefore(functionTraceFile, document.head.children[0]);
        document.head.insertBefore(asyncTraceFile, document.head.children[0]);
    }
    else {
        document.head.children[0] = asyncTraceFile;
        document.head.children[1] = functionTraceFile;
    }
}