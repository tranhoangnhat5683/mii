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
            getter(object[arrProperty[i]], wrapper)
        );
    }

    return object;
}

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

function wrapperErrRes(callback, err, res)
{
    callback({
        err: err,
        res: res
    });
}

function wrapperRes(callback, res)
{
    callback(res);
}

module.exports = {
    toSyncMode: toSyncMode,
    wrapperErrRes: wrapperErrRes,
    wrapperRes: wrapperRes
};