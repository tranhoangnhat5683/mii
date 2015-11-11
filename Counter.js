var Counter = function(keys)
{
    if (keys && !(keys instanceof Array))
    {
        keys = [keys];
    }

    this.keys = keys;
    this.data = {};
    this.totalKey = 0;
    this.totalValue = 0;
};

Counter.getNewCounter = function(keys)
{
    return new Counter(keys);
};

Counter.prototype.add = function(data, incrPerItem)
{
    if (!incrPerItem)
    {
        incrPerItem = 1;
    }

    if (!(data instanceof Array))
    {
        data = [data];
    }

    var key = '';
    for (var i = 0; i < data.length; i++)
    {
        key = this.getKey(data[i]);

        if (!this.data[key])
        {
            this.data[key] = 0;
            this.totalKey++;
        }

        this.data[key] += incrPerItem;
        this.totalValue += incrPerItem;
    }
};

Counter.prototype.remove = function(data)
{
    if (!(data instanceof Array))
    {
        data = [data];
    }

    var key = '';
    for (var i = 0; i < data.length; i++)
    {
        key = this.getKey(data[i]);
        if (!this.data[key])
        {
//            console.log('It\'s weird. You are trying to remove an unavailable item. Is this a bug in your system?');
            continue;
        }

        this.data[key]--;
        this.totalValue--;
        if (this.data[key] === 0)
        {
            delete this.data[key];
            this.totalKey--;
        }
    }
};

Counter.prototype.get = function(key)
{
    return this.data[key];
};

Counter.prototype.getKey = function(data)
{
    if (!this.keys)
    {
        return data;
    }

    var key = '';
    for (var j = 0; j < this.keys.length; j++)
    {
        key += data[this.keys[j]] || '';
    }

    return key;
};

module.exports = Counter;
