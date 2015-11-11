var deasync = require('deasync');

function toSyncMode(object, arrProperty, wrapper)
{
    if (!wrapper)
    {
        wrapper = wrapperErrRes;
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
            wrapper(object[arrProperty[i]])
            );
    }

    return object;
}

// wrap function in a getter that return a wrapper that will execute fn.
function wrapperErrRes(fn)
{
    // function getter
    return function() {
        // wrapper function (fn is the real function)
        return function() {
            var result = null;
            var args = Array.prototype.slice.call(arguments, 0); // clone arguments to array
            args.push(function(err, res) { // add callback to the end of args
                result = {
                    err: err,
                    res: res
                };
            });

            // call function
            fn.apply(this, args);

            // wait for callback to return result
            while (!result) {
                deasync.runLoopOnce();
            }

            // return result.
            return result;
        };
    };
}

// wrap function in a getter that return a wrapper that will execute fn.
function wrapperRes(fn)
{
    // function getter
    return function() {
        // wrapper function (fn is the real function)
        return function() {
            var result = null;
            var args = Array.prototype.slice.call(arguments, 0); // clone arguments to array
            args.push(function(res) { // add callback to the end of args
                result = res;
            });

            // call function
            fn.apply(this, args);

            // wait for callback to return result
            while (!result) {
                deasync.runLoopOnce();
            }

            // return result.
            return result;
        };
    };
}

module.exports = {
    toSyncMode: toSyncMode,
    wrapperErrRes: wrapperErrRes,
    wrapperRes: wrapperRes
};