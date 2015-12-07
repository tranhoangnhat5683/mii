module.exports = (function() {
    var Helper_Object   = null;
    var Helper_Array    = {};
    
    function objectHelper()
    {
        if (!Helper_Object)
        {
            Helper_Object = require('./Object');
        }

        return Helper_Object;
    }

    Helper_Array.clean = function(arr)
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

    Helper_Array.unique = function(arr, arrProperty)
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

    Helper_Array.get = function(arr, prop, options)
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

    Helper_Array.join = function(arr, prop, options)
    {
        if (!options)
        {
            options = {};
        }

        var newArr = Helper_Array.get(arr, prop, options);
        /**
         |-------------------------------------------
         | Group TCX voi ky tu -
         |-------------------------------------------
         */
        var joiner = options.joiner || " - ";
        return newArr.join(joiner);
    };

    Helper_Array.pushInDescOrder = function(arr, element, property)
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

    Helper_Array.sort = function(arr, property, order, options)
    {
        if (!order)
        {
            order = 'asc';
        }

        var left = 0;
        var right = 0;
        switch (order) {
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

    Helper_Array.search = function(arr, property, value)
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

    Helper_Array.toObjectKey = function(arr, properties)
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

    Helper_Array.group = function(arr, properties)
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
    Helper_Array.compare = function(left, right, properties)
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
    }

    return Helper_Array;
})();