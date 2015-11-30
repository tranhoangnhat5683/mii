/**
 * This file define some function to help communicate faster with array object.
 */

/**
 * The reason for this funtion is to avoid the case when you load array helper,
 * it automatic load object helper, and object helper automatic load some other
 * helper. This lead to an require loop. So instead of load object helper when
 * you load this class, we will load it only when you need to USE it, and save
 * it for later use.
 * @returns {Helper_Object}
 */
function objectHelper()
{
    if (!ArrayHelper['Helper_Object'])
    {
        ArrayHelper['Helper_Object']   = require('./Object');
    }

    return ArrayHelper['Helper_Object'];
};

var ArrayHelper = function()
{

};

ArrayHelper.clean = function(arr)
{
    var newArr = [];
    for (var i = 0; i < arr.length; i++)
    {
        if (arr[i])
        {
            newArr.push(arr[i]);
        }
    }
    return newArr;
};

ArrayHelper.unique = function(arr, arrProperty)
{
    if (arrProperty && !(arrProperty instanceof Array))
    {
        arrProperty = [arrProperty];
    }

    var _property = [];
    var unique = {};
    for (var i = 0; i < arr.length; i++)
    {
        _property = [];
        if (arrProperty)
        {
            for (var j = 0; j < arrProperty.length; j++)
            {
                _property.push(arr[i][arrProperty[j]]);
            }
        }
        else
        {
            _property.push(arr[i]);
        }

        unique[_property.join(" ")] = arr[i];
    }

    return objectHelper().objectToArray(unique);
};

ArrayHelper.get = function(arr, prop, options)
{
    if (!options)
    {
        options = {};
    }

    var newArr = [];
    for (var i = 0; i < arr.length; i++)
    {
        if (options.removeEmptyElement && !arr[i][prop])
        {
            continue;
        }
        newArr.push(arr[i][prop]);
    }

    return newArr;
};

ArrayHelper.join = function(arr, prop, options)
{
    if (!options)
    {
        options = {};
    }

    var newArr = ArrayHelper.get(arr, prop, options);
    /**
     |-------------------------------------------
     | Group TCX voi ky tu -
     |-------------------------------------------
     */
    var joiner = options.joiner || " - ";
    return newArr.join(joiner);
};

ArrayHelper.pushInDescOrder = function(arr, element, property)
{
    for (var i = 0; i < arr.length; i++)
    {
        if ((property && element[property] > arr[i][property])
            || (!property && element > arr[i]))
        {
            arr.splice(i, 0, element);
            return;
        }
    }

    arr.push(element);
};

ArrayHelper.sort = function(arr, property, order, options)
{
    if (!order)
    {
        order = 'asc';
    }

    var left = 0;
    var right = 0;
    switch (order){
        case 'asc':
            left = -1;
            right = 1;
            break;
        case 'desc':
            left = 1;
            right = -1;
            break;
    }

    arr.sort(
        function(a, b)
        {
            if (a[property] < b[property])
            {
                return left;
            }

            if (a[property] > b[property])
            {
                return right;
            }

            return 0;
        }
    );

    return arr;
};

ArrayHelper.search = function(arr, property, value)
{
    for (var i = 0; i < arr.length; i++)
    {
        if (arr[i][property] === value)
        {
            return arr[i];
        }
    }

    return false;
};

ArrayHelper.toObjectKey = function(arr, properties)
{
    var result = {};
    for (var i = 0; i < arr.length; i++)
    {
        if (!properties)
        {
            result[arr[i]] = arr[i];
        }
        else
        {
            result[arr[i][properties]] = arr[i];
        }
    }

    return result;
};

ArrayHelper.group = function(arr, properties)
{
    var result = {};
    var item = null;
    for (var i = 0; i < arr.length; i++)
    {
        item = arr[i];
        if (!result[item[properties]])
        {
            result[item[properties]] = [];
        }

        result[item[properties]].push(item);
    }

    return result;
};

/*
 * Compare two array.
 * @param {Array} left
 * @param {Array} right
 * @param {String|Array} properties
 */
ArrayHelper.compare = function(left, right, properties)
{
    var _left = {};
    var _right = {};
    var result = {
        left: [],
        both: [],
        right: []
    };

    // Build left's recognizer.
    for (var i = 0; i < left.length; i++)
    {
        _left[buildKey(left[i], properties)] = left[i];
    }

    // Build right's recognizer.
    for (var i = 0; i < right.length; i++)
    {
        _right[buildKey(right[i], properties)] = right[i];
    }

    // Compare left array with right's reconizer.
    for (var i = 0; i < left.length; i++)
    {
        if (_right[buildKey(left[i], properties)])
        {
            result.both.push(left[i]);
            continue;
        }

        result.left.push(left[i]);
    }

    // Compare right array with left's reconizer.
    for (var i = 0; i < right.length; i++)
    {
        if (_left[buildKey(right[i], properties)])
        {
            continue;
        }

        result.right.push(right[i]);
    }

    return result;
};

function buildKey(item, properties)
{
    if (!properties)
    {
        return item;
    }

    if (!(properties instanceof Array))
    {
        properties = [properties];
    }

    var key = [];

    for (var i = 0; i < properties.length; i++)
    {
        key.push(item[properties[i]] || '');
    }

    return key.join('_');
};

module.exports = ArrayHelper;