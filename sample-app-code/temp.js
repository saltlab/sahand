/**
 * Created by Saba on 2015-03-24.
 */

temp(a, function() {

});

function foo() {
    console.log('hi');
    return 1;
}

function bar() {
    var a = foo();
}

bar();

foo(req, function(er, list) {
    list.forEach(function (row, index) {
        costumParse(row, req).extractArgs(row, function (instType) {
            row.forEach(function (arg, i) {
                resolveAliases(instType, arguments[0]);
            })
        })
    })
})
