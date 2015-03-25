var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var proxy = require('./proxy');

var serverInst = require('./serverinstrument.js');

app.set('view engine', 'jade');
//app.use('/js', express.static(__dirname + 'public/javascripts'));
app.use(express.static(__dirname + '/public'));

// parse application/json
app.use(bodyParser.json())

var server = app.listen(3000, function(req, res) {
//    var a = serverInst.test();
//    console.log(a);
//    serverInst.instrument();
	var host = server.address().address;
	var port = server.address().port;
	console.log('example app listening at http://%s:%s', host, port);


});

app.get('/', function(req, res) {
//    res.sendFile('views/index.html', {root: __dirname })
    console.log(1);
    proxy.instrumentResponse(req, res);
});
/*
app.get('/temp', function(req, res) {
   res.send('hi');
});
*/

/*
app.get('/', function(req, res) {
	res.send('hello world!');
});

app.post('/', function(req, res) {
	res.send('post req');
});

var cb0 = function (req, res, next) {
	  console.log('CB0')
		    next()
}

var cb1 = function (req, res, next) {
	  console.log('CB1')
		    next()
}



app.get('/example', [cb0, cb1], function (req, res, next) {
	  console.log('response will be sent by the next function ...')
	  next()
}, function (req, res) {
        res.sendFile('views/temp.html', {root: __dirname })
//	  res.send('Hello!')
})



// CHALLENGE 3.a
var cb2 = function (req, res, next) {
    console.log('CB2')
    var region = locateClient(req.body.client);
    if (region.ASIA) {
        res.send(customizedRes(req.body.content));
    }
    next()
}

var cbacks = [cb0, cb1];
if (user.isLoggedIn) {
    cbacks.push(cb2);
}

app.get('/ex3a', function(req, res, next) {
    if (req.header('appStats')) {
        res.send(statCollectionResponse(req.body.stats))
    }
    next();
}, cbacks, function(req, res) {
    // do stuff
})

// CHALLENGE 3.b
app.post('/ex3b', function(req, res) {
    console.log(req.body);
    var list = req.body.list;
    foo(req.body, function(er, list) {
        list.forEach(function (row, index) {
            console.log('key', row);
            console.log('index', index);
            costumParse(row, req.body.format).extractArgs(row, function (instType) {
                console.log('--------');
                console.log(instType);
                row.forEach(function (arg, i) {
                    resolveAliases(instType, arguments[0]);
                })
            })
        })
    })
    // res
})

function foo(a, b) {
    b(null, a.list);
//    console.log('foo');
//    b(a.list);
}

function costumParse(a, b) {
    console.log('costumParse');
    console.log(a);
    a.extractArgs = function ex (aaa) {
        aaa('hi');
    }
    return a;
}
*/

/*
var fs = require('fs')
var path = require('path')

module.exports = function (dir, cb) {
    fs.readdir(dir, function (er, files) { // [1]
        if (er) return cb(er)
        var counter = files.length
        var errored = false
        var stats = []

        files.forEach(function (file, index) {
            fs.stat(path.join(dir,file), function (er, stat) { // [2]
                if (errored) return
                if (er) {
                    errored = true
                    return cb(er)
                }
                stats[index] = stat // [3]

                if (--counter == 0) { // [4]
                    var largest = stats
                        .filter(function (stat) { return stat.isFile() }) // [5]
                        .reduce(function (prev, next) { // [6]
                            if (prev.size > next.size) return prev
                            return next
                        })
                    cb(null, files[stats.indexOf(largest)]) // [7]
                }
            })
        })
    })
}
*/
/*
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
*/



