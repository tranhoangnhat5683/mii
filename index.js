module.exports = function() {
    var deasync = require('deasync');
    var version = "0.0.3";

    var Mii = function(input, wrap)
    {
        if (input instanceof Function)
        {
            return new Mii.fn.init(input, wrap);
        }

        return new Mii.fn.init(input, wrap);
    };

    Mii.fn = Mii.prototype = {
        version: version
    };

    var init = Mii.fn.init = function(func, wrap)
    {
        return Mii.fn.wrapper(func, wrap);
    };
    init.prototype = Mii.fn;

    Mii.fn.wrapper = function(func, wrap)
    {
        if (!wrap)
        {
            wrap = Mii.fn.wrapperErrRes;
        }

        return wrap(func);
    };

    Mii.fn.wrapperErrRes = function(func)
    {
        return function() {
            var result = null;
            var args = Array.prototype.slice.call(arguments, 0); // clone arguments to array
            args.push(function(err, res) { // add callback to the end of args
                result = {
                    err: err,
                    res: res
                };
            });

            func.apply(this, args);
            while (!result) { // wait for callback to return result
                deasync.runLoopOnce();
            }

            return result;
        };
    };

    return Mii;
}();


////---------------------------------------------------------------------------------
//function toSyncMode(object, arrProperty, wrapper)
//{
//    if (!wrapper)
//    {
//        wrapper = wrapperErrRes;
//    }
//
//    for (var i = 0; i < arrProperty.length; i++)
//    {
//        // use getter to wrap function in wrapper
//        object.__defineGetter__(
//            arrProperty[i],
//            wrapper(object[arrProperty[i]])
//        );
//    }
//
//    return object;
//}
//
//// wrap function in a getter that return a wrapper that will execute fn.
//function wrapperErrRes(fn)
//{
//    // function getter
//    return function() {
//        // wrapper function (fn is the real function)
//        return function() {
//            var result = null;
//            var args = Array.prototype.slice.call(arguments, 0); // clone arguments to array
//            args.push(function(err, res) { // add callback to the end of args
//                result = {
//                    err: err,
//                    res: res
//                };
//            });
//
//            // call function
//            fn.apply(this, args);
//
//            // wait for callback to return result
//            while (!result) {
//                deasync.runLoopOnce();
//            }
//
//            // return result.
//            return result;
//        };
//    };
//}
//
//// wrap function in a getter that return a wrapper that will execute fn.
//function wrapperRes(fn)
//{
//    // function getter
//    return function() {
//        // wrapper function (fn is the real function)
//        return function() {
//            var result = null;
//            var args = Array.prototype.slice.call(arguments, 0); // clone arguments to array
//            args.push(function(res) { // add callback to the end of args
//                result = res;
//            });
//
//            // call function
//            fn.apply(this, args);
//
//            // wait for callback to return result
//            while (!result) {
//                deasync.runLoopOnce();
//            }
//
//            // return result.
//            return result;
//        };
//    };
//}