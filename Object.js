module.exports = (function() {
    var Helper_Object = {};

    Helper_Object.clone = function(object)
    {
        return JSON.parse(JSON.stringify(object));
    };

    Helper_Object.objectToArray = function(object)
    {
        var result = [];
        for (var key in object)
        {
            result.push(object[key]);
        }

        return result;
    };

    Helper_Object.merge = function(dest, source)
    {
        for (var prop in source)
        {
            dest[prop] = source[prop];
        }
    };

    return Helper_Object;
})();