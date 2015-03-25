var url = require('url');
var jsdom = require('jsdom-nogyp');
var http = require('http');

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
                    str = window.document.innerHTML;
                });
            }
            else if (typeof contentType != 'undefined' && contentType.toLowerCase().indexOf('javascript') > -1) {
                console.log('javascript');
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
