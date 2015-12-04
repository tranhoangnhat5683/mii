module.exports = function() {
    var deasync = require('deasync');

    var Helper_Function = {};
    Helper_Function.toSyncMode = function(object, arrProperty, wrapper)
    {
        if (!wrapper)
        {
            wrapper = Helper_Function.wrapperErrRes;
        }

        for (var i = 0; i < arrProperty.length; i++)
        {
            if (!(object[arrProperty[i]] instanceof Function))
            {
                throw new Error('param is not a function');
            }

            // use getter to wrap function in wrapper
            object.__defineGetter__(
                arrProperty[i],
                getter(object[arrProperty[i]], wrapper)
                );
        }

        return object;
    };

    function getter(fn, wrapper)
    {
        return function() {
            return function() {
                var result = null;
                // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
                var args = Array.prototype.slice.call(arguments, 0); // clone arguments to array
                args.push(wrapper.bind(null, function(data) {
                    result = data;
                }));
                fn.apply(this, args);

                while (!result) {
                    deasync.runLoopOnce();
                }

                return result;
            };
        };
    }

    Helper_Function.wrapperErrRes = function(callback, err, res)
    {
        callback({
            err: err,
            res: res
        });
    };

    Helper_Function.wrapperRes = function(callback, res)
    {
        callback(res);
    };

    Helper_Function.once = function(fn)
    {
        var flag = false;
        return function () {
            if (!flag)
            {
                flag = true;
                return fn.apply(this, arguments);
            }
        };
    };

    return Helper_Function;
}();
    