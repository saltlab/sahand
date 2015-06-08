var url = require('url');
var http = require('http');
//var jsdom = require('jsdom');
var cheerio = require('cheerio');

exports.instrumentResponse = function (req, res) {
    var options = {};
    var urlParts = url.parse(req.url, true);

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
            proxify(options, req.method, data, res);
        });
    }
    else if ('GET' == req.method) {
        proxify(options, req.method, '', res);
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

                var $ = cheerio.load(str);
                //console.log($.html());
                console.log($('title').html());
                //console.log($);
                //var head = $('head').html();
                //$('head').html('<script>var sahand = true;</script>' + head);

                $('head').html(getAppendedScripts() + $('head').html());

                console.log($.html());

/*
                jsdom.env(str, ["http://code.jquery.com/jquery.js"], function (error, window) {
                    console.log(window.document);
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
*/
            }
            else if (typeof contentType != 'undefined' && contentType.toLowerCase().indexOf('javascript') > -1) {
                console.log('javascript');
                /*
                var instrumentedAst = esinstrument.instrumentAst(str);
                var instrumentedScript = esinstrument.generateScript(instrumentedAst);
//                result.data = instrumentedScript;
                str = instrumentedScript;
                */
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

function getAppendedScripts() {
    var appendedScripts = '';

    appendedScripts += '<script sahand=true>window.sahand = true;</script>';
    appendedScripts += '\n';
    appendedScripts += '<script sahand=true src="javascripts/sahand-logs.js"></script>';
    appendedScripts += '\n';
    appendedScripts += '<script sahand=true src="javascripts/sahand-async.js"></script>';
    appendedScripts += '\n';

    return appendedScripts;
}
/*
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
*/