var express = require('express');
var proxy = require('./proxy');
var serverModifier = require('./server-modification');
require('./instrument/timeout');

var app = express();

app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function(req, res) {
//    instrumentServerFiles('./files/server/');


    serverModifier.instrument('./files/server/');

//    console.log(setTimeout);
//    console.log(__setTimeout);


//    setTimeout(temp, 2000);


    var host = server.address().address;
    var port = server.address().port;
    console.log('example app listening at http://%s:%s', host, port);


});

function temp() {
    console.log('to ******************************************');
}

app.get('/', function(req, res) {
    //res.send('hi');
    proxy.instrumentResponse(req, res);
});

//setTimeout(function() {console.log('to ******************************************');}, 0);
