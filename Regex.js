function arrayHelper()
{
    if (!RegexHelper['Helper_Array'])
    {
        RegexHelper['Helper_Array']   = require('./Array');
    }

    return RegexHelper['Helper_Array'];
};

function stringHelper()
{
    if (!RegexHelper['Helper_String'])
    {
        RegexHelper['Helper_String']   = require('./String');
    }

    return RegexHelper['Helper_String'];
};

var RegexHelper = function()
{

};

RegexHelper.number                      = "0-9";
RegexHelper.lowerCaseCharacter          = "a-zaáàảãạăắằẳẵặâấầẩẫậeéèẻẽẹêếềểễệiíìỉĩịoóòỏõọôốồổỗộơớờởỡợuúùủũụưứừửữựyýỳỷỹỵđ";
RegexHelper.specialCharacters           = /(\.|\.\.\.|\…|\!|\"|\#|\$|\%|\&|\'|\(|\)|\*|\+|\,|\-|\/|\:|\;|\<|\=|\>|\?|\@|\[|\\|\]|\^|\_|\`|\{|\||\}|\~)/gi;
RegexHelper.specialString               = "( |.|…|!|#|$|%|&|'|(|)|*|+|,|-|/|;|<|=|>|?|@|[|]|^|_|`|{|||}|~)";
RegexHelper.strNotSupportByIg           = /\s|\=|\?|\>|\<|\`|\||\'|\"|\:|\.|\;|\#|\~|\/|\+|\!|\$|\%|\-|\^|\&|\*|\(|\)|\[|\]|\{|\}/gi;
RegexHelper.linkingWords                = /(\,|và|va|hoặc|hay|với|and|or|\&|\s)+/gi;
RegexHelper.specialCharactersModify     = "_____";
RegexHelper.upperCaseCharacter          = RegexHelper.lowerCaseCharacter.toUpperCase();
RegexHelper.allCaseCharacter            = RegexHelper.lowerCaseCharacter + RegexHelper.upperCaseCharacter;
RegexHelper.characterAndNumber          = RegexHelper.number + RegexHelper.allCaseCharacter;
RegexHelper.notACharacterNorNumber      = "[^" + RegexHelper.characterAndNumber + "]";
RegexHelper.notACharacterNorNumberReg   = new RegExp(RegexHelper.notACharacterNorNumber);
RegexHelper.beforeAWordWithBraket       = "(^|" + RegexHelper.notACharacterNorNumber + ")";
RegexHelper.afterAWordWithBraket        = "($|" + RegexHelper.notACharacterNorNumber + ")";
RegexHelper.sentencesSeparatorReg       = /(\.|\?|\!|\.\.\.|\…)/;
RegexHelper.paragraphSeparatorReg       = /\n/;
RegexHelper.sentencesSeparatorWithoutBracketReg = /\.|\?|\!|\.\.\.|\…/;

/*
 |-----------------------------------------------
 | Danh rieng cho phan analyzer gan nham Entity
 |-----------------------------------------------
 */

RegexHelper.multiContent    = /(chứ|còn|nên|vì|phen này|trong khi đó|thế này thì|thế này chắc|tóm lại|nói chung là)/gi;
RegexHelper.owner           = /(của|thuộc về|dành cho|đối với|nghiêng về)/gi;

RegexHelper.anyWord                     = '*';
RegexHelper.negatedLookaheadWord        = "?!";

RegexHelper.arrRegExpCharacters         = [
    {
        character   : "+",
        pattern     : /\+/gi
    },
    {
        character   : "*",
        pattern     : /\*/gi
    }
];

RegexHelper.buildBeginAWord = function(word)
{
    return RegexHelper.beforeAWordWithBraket + word;
};

RegexHelper.replaceRegExpCharacters = function(str)
{
    for( var i = 0; i < RegexHelper.arrRegExpCharacters.length; i++ )
    {
        str     = str.replace(RegexHelper.arrRegExpCharacters[i].pattern, 
                    "\\" + RegexHelper.arrRegExpCharacters[i].character);
    }
    return str;
};

RegexHelper.buildEndAWord = function(word)
{
    return word + RegexHelper.afterAWordWithBraket;
};

RegexHelper.buildFullWord = function(word)
{
    return RegexHelper.beforeAWordWithBraket + word + RegexHelper.afterAWordWithBraket;
};

RegexHelper.buildBeginASentence = function(word)
{
    return "^(\\S+\\s+){0,3}" + word;
};

RegexHelper.buildEndASentence = function(word)
{
    return word + "(\\s+\\S+){0,3}$";
};

RegexHelper.pregQuote = function(str, delimiter)
{
    if (!delimiter)
    {
        delimiter = '';
    }

    var regex = new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + delimiter + '-]', 'g');
    return str.replace(regex, '\\$&');
};

RegexHelper.buildMyRegex = function(allowValues)
{
    allowValues = RegexHelper.mapAnyCharater(allowValues);
    allowValues = RegexHelper.mapNegatedLookaheadCharater(allowValues);
    allowValues = RegexHelper.mapOrCharater(allowValues);

    return allowValues;
};

RegexHelper.mapAnyCharater = function(allowValues)
{
    var regex = '';
    var match = null;
    for (var i = 0; i < allowValues.length; i++)
    {
        regex = allowValues[i];
        match = regex.match(/<(\d+)>/);
        if ( !match )
        {
            continue;
        }
        allowValues[i] = null;
        match = parseInt(match[1]);
        for (var j = 0; j <= match; j++)
        {
            allowValues.push(
                regex.replace(/<(\d+)>/, stringHelper().createEmptyWord(j, RegexHelper.anyWord + " ")).trim()
            );
        }
    }
    allowValues = arrayHelper().clean(allowValues);
    return allowValues;
};

RegexHelper.mapNegatedLookaheadCharater = function(allowValues)
{
    var regex = '';
    var match = null;
    for (var i = 0; i < allowValues.length; i++)
    {
        regex = allowValues[i];
        match = regex.match(/<\?\!([^\<\>]+)>/);
        if ( !match )
        {
            continue;
        }
        match = match[1].replace(/\s+/, "_");
        allowValues[i] = regex.replace(/<\?\!([^\<\>]+)>/, RegexHelper.negatedLookaheadWord + match).trim();
    }
    allowValues = arrayHelper().clean(allowValues);
    return allowValues;
};

RegexHelper.mapOrCharater = function(allowValues)
{
    var regex = '';
    var match = null;
    for (var i = 0; i < allowValues.length; i++)
    {
        regex = allowValues[i];
        match = regex.match(/<([^\<\>]+)>/);
        if ( !match )
        {
            continue;
        }
        allowValues[i] = null;
        match = match[1].split("|");
        for (var j = 0; j < match.length; j++)
        {
            allowValues.push(
                regex.replace(/<([^\<\>]+)>/, match[j] + " ").trim()
            );
        }
    }
    allowValues = arrayHelper().clean(allowValues);
    return allowValues;
};

module.exports = RegexHelper;