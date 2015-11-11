/* global Function, require, module */

var Entities        = require('html-entities').AllHtmlEntities;
var unorm           = require('unorm');
var S 				= require('string');
var ent 			= require('ent');
var cheerio			= require('cheerio');
var Platform		= require('../Core/Platform');
var SimpleKeeper 	= require('../SimpleKeeper');
var simpleAttachmentKeeper = new SimpleKeeper();
var Helper_Mention 	= {};

Helper_Mention.longMention = 1500;

Helper_Mention.getTitle = function(doc)
{
    if( Platform.checkPlatformHaveTitle(doc.id_table) )
	{
		if( Platform.isParentTable(doc.id_table) )
		{
			if( doc.search_text instanceof Array )
			{
				return doc.search_text[0];
			}
		}
		else {
			if( Platform.checkAppendTitleToComment(doc.id_table) )
			{
				if( doc.search_text instanceof Array )
				{
					return doc.search_text[0];
				}
			}
		}
	}
	return 'EMPTY';
};

Helper_Mention.getTitleSentimentaAndAttribute = function(doc)
{
    if( Platform.checkPlatformHaveTitle(doc.id_table) )
	{
		if( Platform.isParentTable(doc.id_table) )
		{
			if( doc.search_text instanceof Array )
			{
				return doc.search_text[0];
			}
		}
	}
	return 'EMPTY';
};

Helper_Mention.getContent = function(doc)
{
	var content = 'EMPTY';
	try {
		var search_text = doc.search_text;
		if( typeof search_text === 'string' )
		{
			search_text = [search_text];
		}
        
        content = this.getContentOfSearchTextArray(doc);
        if ( Platform.getPlaformByIdTable(doc.id_table) === 'FORUM' )
        {
            content = this.removeQuote(content);
        }
        content 	= this.removeTags(content);
	}
	catch (e)
	{
		content = 'EMPTY';
	}
	return content;
};

Helper_Mention.removeTags = function (content){    
    if (content){
        content = S(content).stripTags().s;
    }
    return content;
};

Helper_Mention.removeQuote = function (content){
    if (content){
        var $ = cheerio.load(content);
		$('.bbCodeBlock.bbCodeQuote').remove();
		$('.voz-bbcode-quote').remove();
		content = $.html();
		if( content ) {
			content = ent.decode(content);
		}
    }
    return content;
};

Helper_Mention.getContentOfSearchTextArray = function (doc){

    var content 		= 'EMPTY';
    var search_text 	= doc.search_text;
    /**
     |---------------------------------------------------
     | Can phan biet title voi content co danh hay khong
     |---------------------------------------------------
     */

    if( search_text instanceof String )
    {
    	content = search_text;
    }
    else{
    	if( !Platform.checkAppendTitleToComment(doc.id_table) )
    	{
    		content = search_text.join('. ');
    	}
    	else{
    		if( search_text.length > 1 ) {
				content = search_text[1];
		    }
		    else {
				content = 'EMPTY';
			}
    	}
    }

    return content;
};

Helper_Mention.getTitleRelationOfPlatform = function(plaform, mention)
{
	var func 		= 'getTitleRelationOfPlatform_' + plaform;
	var attachment 	= this.getAttachmentOfMention(mention);
	if( this[func] instanceof Function )
	{
		return this[func](mention, attachment);
	}
	return 'EMPTY';
};

Helper_Mention.getAttachmentOfMention = function (mention)
{
	if( simpleAttachmentKeeper.isAvailableValueFor(mention) )
	{
		return simpleAttachmentKeeper.getValue();
	}
	var attachment = mention.attachment;
	if (attachment instanceof Array)
	{
		attachment = mention.attachment[0];
	}
	if( !attachment )
	{
		attachment = {};
	}
	else if( typeof (attachment) === "string" )
	{
		try {
			attachment = JSON.parse(attachment);
		} catch (e) {
			console.log('Can not parse JSON from attachment.');
			attachment = {};
		}
	}
	simpleAttachmentKeeper.registerWatchingTo(mention);
	simpleAttachmentKeeper.setValue(attachment);
	return simpleAttachmentKeeper.getValue();
};

Helper_Mention.getTitleRelationOfPlatform_FACEBOOK = function(mention, attachment)
{
	if( Platform.isParentTable(mention.id_table) )
	{
		if ( attachment && attachment.media )
		{
			if ( attachment.media[0] )
			{
				if (attachment.media[0].type === 'link' && attachment.name)
				{
					return attachment.name;
				}
			}
		}		
	}
	return 'EMPTY';
};

Helper_Mention.getTitleRelationOfPlatform_NEWS = function(mention, attachment)
{
	// return 'EMPTY';
	// cho nay nen check ky, confirm vs anh phu
	if( Platform.isParentTable(mention.id_table) )
	{
		if( attachment && attachment.parent_info )
	    {
	    	if (attachment.parent_info.article_title){
	        	return attachment.parent_info.article_title;
			}
	    }
	}
 //    return 'EMPTY';
};

Helper_Mention.getTitleRelationOfPlatform_FORUM = function(attachment, attachment)
{
	if( attachment && attachment.parent_info )
    {
    	if (attachment.parent_info.thread_title){
        	return attachment.parent_info.thread_title;
		}
    }
    return 'EMPTY';
};

Helper_Mention.getTitleRelationOfPlatform_BLOG = function(mention, attachment)
{
	return 'EMPTY';
};

Helper_Mention.getTitleRelationOfPlatform_YOUTUBE = function (mention, attachment)
{
	if (attachment && attachment.parent_info)
	{
		if(attachment.parent_info.video_title)
		{
			return attachment.parent_info.video_title;
		}
	}
	return 'EMPTY';
};

// cai nay chua xu ly
Helper_Mention.getTitleRelationOfPlatform_REVIEWS = function(mention, attachment)
{
	return 'EMPTY';
};

Helper_Mention.getTitleRelationOfPlatform_ECOM = function(mention, attachment)
{

};

Helper_Mention.getContentRelationOfPlatform = function(mention)
{

};

Helper_Mention.appendResult = function(recognizer, result)
{
    if( !recognizer )
    {
    	recognizer 	= result;
    }

    Array.prototype.push.apply(recognizer.adverb, result.adverb);
    Array.prototype.push.apply(recognizer.ontology, result.ontology);
    Array.prototype.push.apply(recognizer.negation, result.negation);
    Array.prototype.push.apply(recognizer.properName, result.properName);

    recognizer.dictionary = Helper_Mention.cloneDictionary(result.dictionary, recognizer.dictionary);
    recognizer.dictionaryTopic = Helper_Mention.cloneDictionary(result.dictionaryTopic, recognizer.dictionaryTopic);
    // Array.prototype.push.apply(recognizer.dictionary, result.dictionary);
    // Array.prototype.push.apply(recognizer.dictionaryTopic, result.dictionaryTopic);

    return recognizer;
};

Helper_Mention.cloneDictionary = function(data, result)
{
	var temp = JSON.parse(JSON.stringify(data));
	Array.prototype.push.apply(result, temp);
	return result;
};

Helper_Mention.getSentenceInfo  = function(sentence)
{
    var result  = {
        type                : sentence.type,
        inPart              : sentence.part,
        content             : sentence.content,
        sentiment       	: sentence.sentiment,
        properNames         : Helper_Mention.deleteNextPrevious(sentence.infoRecognizer.properName),
        // shifters            : this.getDataRecognizerShifter(sentence.infoRecognizer.shifter),
        ontologies          : Helper_Mention.deleteNextPrevious(sentence.infoRecognizer.ontology),
        dictionaries        : Helper_Mention.deleteNextPrevious(sentence.infoRecognizer.dictionary),
        dictionariesTopic   : Helper_Mention.deleteNextPrevious(sentence.infoRecognizer.dictionaryTopic),
        negations           : Helper_Mention.deleteNextPrevious(sentence.infoRecognizer.negation),
        adverbs             : Helper_Mention.deleteNextPrevious(sentence.infoRecognizer.adverb),
        infoMatchShifter    : Helper_Mention.getDataRecognizerShifter(Helper_Mention.deleteNextPrevious(sentence.infoMatchShifter))
    };

    return result;
};

Helper_Mention.deleteNextPrevious = function(data)
{
	for( var i = 0; i < data.length; i++ )
	{
		if(data[i].next)
		{
			delete data[i].next;
		}
		if(data[i].previous)
		{
			delete data[i].previous;
		}
	}
	return data;
};

Helper_Mention.getDataRecognizerShifter = function(recognizers)
{
    var storages    = [];
    var temp 		= recognizers;
    if( !temp || !temp.length )
    {
    	return storages;
    }

    for(var i = 0; i < temp.length; i++ )
    {
        delete temp[i].data.arrDataOrigin;
        storages.push(temp[i]);
    }
    return storages;
};

module.exports = Helper_Mention;