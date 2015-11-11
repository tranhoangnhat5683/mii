module.exports = function() {
    var Function = require('./Function');
    var String = require('./String');
    var Object = require('./Object');
    var Array = require('./Array');
    var Regex = require('./Regex');

    var Mii = {
        Function: Function,
        Regex: Regex,
        Array: Array,
        Object: Object,
        String: String
    };

    return Mii;
}();