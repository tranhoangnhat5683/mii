var Helper_Function = require('./index.js').Function;
var sumAsync = function(in1, in2, callback)
{
    process.nextTick(callback.bind(null, null, in1 + in2));
};

//var onSumAsync = function(err, res)
//{
//    console.log('onSumAsync', err, res);
//};
//var someGlobalVar = "hi";
//var myLookupKey = "someGlobalVar";
//console.log(global[myLookupKey]);

//console.log(this);
//Helper_Function();
//console.log('begin sumAsync');
//sumAsync(1, 2, onSumAsync);
//console.log('end sumAsync');
//
//console.log('begin sumAsync');
//var sum = Mii(sumAsync)(1, 2);
//console.log('onSumAsync', sum);
//console.log('end sumAsync');

var cache = Helper_Function.cache(function(val, callback) {
    setTimeout(function() {
        callback(null, val + 1000);
    }, 1000);
});

cache(1000, function(err, res) {
    console.log('1000: ', err, res);
});
cache(2000, function(err, res) {
    console.log('2000: ', err, res);
});