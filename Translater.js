/**
 * This class provide a way to mapping between column with different name
 * but have similar meaning, so that the abstract model can focus on
 * the logic, and the inherits models can use this to change only the
 * column name, and keep the login of the abstract model.
 * @return {Translater}
 */
var Translater = function()
{
    
};

/**
 * The minimal column that each translater of the module must have.
 * @type Object
 */
Translater.requirement = {
    'sourceCrawler': [
        'state', 'updated_at', 'last_data', 'last_status', 'failed_total'
    ],
    'itemCrawler': [
        'state', 'last_updated'
    ]
};

/**
 * Tranlater for module sourceCrawler. Used in crawler of yt and fb.
 * @type Object
 */
Translater.sourceCrawler = {
    'fb_group': {
        'state'         : 'updated_post_status',
        'last_status'   : 'last_updated_status',
        'updated_at'    : 'last_updated_post',
        'last_data'     : 'last_post_created',
        'failed_total'  : 'total_failed'
    },
    'fb_page': {
        'state'         : 'albumn_state',
        'last_status'   : 'albumn_last_status',
        'updated_at'    : 'albumn_last_updated',
        'last_data'     : 'last_post_created',
        'failed_total'  : 'albumn_total_failed'
    },
    'yt_channel': {
        'state'         : 'video_state',
        'last_status'   : 'video_last_status',
        'updated_at'    : 'video_last_updated',
        'last_data'     : 'video_last_data',
        'failed_total'  : 'video_total_failed'
    },
    'yt_video': {
        'state'         : 'comment_state',
        'last_status'   : 'comment_last_status',
        'updated_at'    : 'comment_last_updated',
        'last_data'     : 'comment_last_data',
        'failed_total'  : 'comment_total_failed',
        'created_date'  : 'created_at'
    },
    'yt_commenttogetreply': {
        'state'         : 'state',
        'last_status'   : 'last_status',
        'updated_at'    : 'updated_at',
        'last_data'     : 'last_data',
        'failed_total'  : 'failed_total'
    }
};

/**
 * Tranlater for module itemCrawler. Use in crawler of yt and fb.
 * @type Object
 */
Translater.itemCrawler = {
    'fb_group': {
        'state': 'state'
    }
};

/**
 * Check to make sure that the translater is math with the minimum requirement
 * define in Translater.requirement.
 * @param {String} module
 * @param {String} translater
 * @returns {void}
 * @throws Error [When the translater do not match with the requirement]
 */
Translater.checkTranslater = function(module, translater)
{
    var requirement = Translater.requirement[module];
    for (var i = 0; i < requirement.length; i++)
    {
        if (!translater[requirement[i]])
        {
            throw new Error(
                'Translater for module ' + module
                + ' does not meet the minimal requirement.'
                + ' It does not have a translate for column ' + requirement[i]
            );
        }
    }
};

/**
 * Get translater for module sourceCrawler.
 * @param {String} name
 * @returns {Function}
 * @throws Error [When the translater do not exist or not match with the requirement]
 */
Translater.getSourceCrawlerTranslater = function(name)
{
    return Translater.getTranslater('sourceCrawler', name);
};

/**
 * Get translater for module itemCrawler.
 * @param {String} name
 * @returns {Function}
 * @throws Error [When the translater do not exist or not match with the requirement]
 */
Translater.getItemCrawlerTranslater = function(name)
{
    return Translater.getTranslater('sourceCrawler', name);
};

/**
 * Get translater of a mudule.
 * @param {String} module
 * @param {String} name
 * @returns {Function}
 * @throws Error [When the translater do not exist or not match with the requirement]
 */
Translater.getTranslater = function(module, name)
{
    if ( !Translater[module] )
    {
        throw new Error('Translater for module ' + module + ' does not exist');
    }

    if ( !Translater[module][name] )
    {
        throw new Error('Translater name ' + name + ' of module ' + module + ' does not exist.');
    }

    var translater = Translater[module][name];
    Translater.checkTranslater(module, translater);

    return function(column)
    {
        return this[column] || column;
    }.bind(translater);
};

/**
 * Get default translater, which only return the input without any change.
 * @returns {Function}
 */
Translater.getDefaultTranslater = function()
{
    return function(column)
    {
        return column;
    };
};

module.exports = Translater;
