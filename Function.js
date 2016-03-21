/* global Function */

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
        return function() {
            if (!flag)
            {
                flag = true;
                return fn.apply(this, arguments);
            }
        };
    };

    Helper_Function.cache = function(fn)
    {
        var cache = null;
        var flag = false;
        return function _fn() {
            if (flag) { // Function has call before
                if (!cache) { // But not done yet.
                    var args = Array.prototype.slice.call(arguments);
                    // Then delay 50ms to try again.
                    setTimeout(function() {
                        _fn.apply(this, args);
                    }.bind(this), 50);
                    return;
                }

                var key = getCallbackKeyFromArgv(arguments);
                arguments[key](cache.err, cache.res);// callback using cache
                return;
            }

            if (!flag) // Function have not call yet.
            {
                // Then call it:
                flag = true;
                var key = getCallbackKeyFromArgv(arguments);
                callback = arguments[key];
                arguments[key] = function(err, res) {
                    cache = {
                        err: err,
                        res: res
                    };

                    callback(err, res);
                };

                return fn.apply(this, arguments);
            }
        };
    };

    function getCallbackKeyFromArgv(argv) {
        for (var key in argv) {
            if (argv[key] instanceof Function) {
                return key;
            }
        }

        throw new Error('Can not found callback');
    }

    return Helper_Function;
}();
    