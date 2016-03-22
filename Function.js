/* global Function */

module.exports = function() {
    var deasync = require('deasync');
    var shortid = require('shortid');

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

    Helper_Function.single = function(fn)
    {
        var flag = false;
        var _fn = function() {
            if (flag) { // Function is already running.
                var argv = Array.prototype.slice.call(arguments);
                // Then delay 50ms to try again.
                setTimeout(function() {
                    _fn.apply(this, argv);
                }.bind(this), 50);
                return;
            }

            flag = true;
            var key = getCallbackKeyFromArgv(arguments);
            var callback = arguments[key];

            var argv = Array.prototype.slice.call(arguments);
            argv[key] = function(err, res) {
                flag = false;
                callback(err, res);
            };

            return fn.apply(this, argv);
        };

        return _fn;
    };

    Helper_Function.cache = function(fn)
    {
        var uniqueId = shortid.generate();
        var _fn = function() {
            if (!this.mii_function_cache) {
                this.mii_function_cache = {};
            }
            if (!this.mii_function_cache_flag) {
                this.mii_function_cache_flag = {};
            }

            if (this.mii_function_cache_flag[uniqueId]) { // Function has call before
                if (!this.mii_function_cache[uniqueId]) { // But not done yet.
                    var argv = Array.prototype.slice.call(arguments);
                    // Then delay 50ms to try again.
                    setTimeout(function() {
                        _fn.apply(this, argv);
                    }.bind(this), 50);
                    return;
                }

                var key = getCallbackKeyFromArgv(arguments);
                arguments[key](this.mii_function_cache[uniqueId].err, this.mii_function_cache[uniqueId].res);// callback using cache
                return;
            }

            if (!this.mii_function_cache_flag[uniqueId]) // Function have not call yet.
            {
                // Then call it:
                this.mii_function_cache_flag[uniqueId] = true;
                var key = getCallbackKeyFromArgv(arguments);
                var callback = arguments[key];

                var argv = Array.prototype.slice.call(arguments);
                argv[key] = function(err, res) {
                    this.mii_function_cache[uniqueId] = {
                        err: err,
                        res: res
                    };

                    callback(err, res);
                }.bind(this);

                return fn.apply(this, argv);
            }
        };

        return _fn;
    };

    function getCallbackKeyFromArgv(argv) {
        var result = null;
        for (var key in argv) { // travel all of argv, and get last function.
            if (argv[key] instanceof Function) {
                result = key;
            }
        }

        if (!result) {
            throw new Error('Can not found callback');
        }

        return result;
    }

    return Helper_Function;
}();