var ObjectHelper = function()
{

};

ObjectHelper.clone = function(object)
{
    return JSON.parse(JSON.stringify(object));
};

ObjectHelper.objectToArray = function(object)
{
    var result = [];
    for (var key in object)
    {
        result.push(object[key]);
    }

    return result;
};

ObjectHelper.merge = function(dest, source)
{
    for(var prop in source)
    {
        dest[prop] = source[prop];
    }
};

module.exports = ObjectHelper;