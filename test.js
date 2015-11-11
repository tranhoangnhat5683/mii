var Mii = require('./index.js');
var sumAsync = function(in1, in2, callback)
{
    process.nextTick(callback.bind(null, null, in1 + in2));
};

var onSumAsync = function(err, res)
{
    console.log('onSumAsync', err, res);
};

console.log('begin sumAsync');
sumAsync(1, 2, onSumAsync);
console.log('end sumAsync');

console.log('begin sumAsync');
var sum = Mii(sumAsync)(1, 2);
console.log('onSumAsync', sum);
console.log('end sumAsync');