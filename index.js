module.exports = function() {
    var deasync = require('deasync');
    var Helper_Function = require('./Function');

    var Mii = {
        Function: Helper_Function
    };

    return Mii;
}();