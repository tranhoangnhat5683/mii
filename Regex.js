module.exports = (function() {
    var Helper_Array    = null;
    var Helper_String   = null;
    var Helper_Regex    = {};

    function arrayHelper()
    {
        if (!Helper_Array)
        {
            Helper_Array = require('./Array');
        }

        return Helper_Array;
    }

    function stringHelper()
    {
        if (!Helper_String)
        {
            Helper_String = require('./String');
        }

        return Helper_String;
    }

    Helper_Regex.number = "0-9";
    Helper_Regex.lowerCaseCharacter = "a-zaáàảãạăắằẳẵặâấầẩẫậeéèẻẽẹêếềểễệiíìỉĩịoóòỏõọôốồổỗộơớờởỡợuúùủũụưứừửữựyýỳỷỹỵđ";
    Helper_Regex.specialCharacters = /(\.|\.\.\.|\…|\!|\"|\#|\$|\%|\&|\'|\(|\)|\*|\+|\,|\-|\/|\:|\;|\<|\=|\>|\?|\@|\[|\\|\]|\^|\_|\`|\{|\||\}|\~)/gi;
    Helper_Regex.specialString = "( |.|…|!|#|$|%|&|'|(|)|*|+|,|-|/|;|<|=|>|?|@|[|]|^|_|`|{|||}|~)";
    Helper_Regex.strNotSupportByIg = /\s|\=|\?|\>|\<|\`|\||\'|\"|\:|\.|\;|\#|\~|\/|\+|\!|\$|\%|\-|\^|\&|\*|\(|\)|\[|\]|\{|\}/gi;
    Helper_Regex.linkingWords = /(\,|và|va|hoặc|hay|với|and|or|\&|\s)+/gi;
    Helper_Regex.specialCharactersModify = "_____";
    Helper_Regex.upperCaseCharacter = Helper_Regex.lowerCaseCharacter.toUpperCase();
    Helper_Regex.allCaseCharacter = Helper_Regex.lowerCaseCharacter + Helper_Regex.upperCaseCharacter;
    Helper_Regex.characterAndNumber = Helper_Regex.number + Helper_Regex.allCaseCharacter;
    Helper_Regex.notACharacterNorNumber = "[^" + Helper_Regex.characterAndNumber + "]";
    Helper_Regex.notACharacterNorNumberReg = new RegExp(Helper_Regex.notACharacterNorNumber);
    Helper_Regex.beforeAWordWithBraket = "(^|" + Helper_Regex.notACharacterNorNumber + ")";
    Helper_Regex.afterAWordWithBraket = "($|" + Helper_Regex.notACharacterNorNumber + ")";
    Helper_Regex.sentencesSeparatorReg = /(\.|\?|\!|\.\.\.|\…)/;
    Helper_Regex.paragraphSeparatorReg = /\n/;
    Helper_Regex.sentencesSeparatorWithoutBracketReg = /\.|\?|\!|\.\.\.|\…/;

    /*
     |-----------------------------------------------
     | Danh rieng cho phan analyzer gan nham Entity
     |-----------------------------------------------
     */

    Helper_Regex.multiContent = /(chứ|còn|nên|vì|phen này|trong khi đó|thế này thì|thế này chắc|tóm lại|nói chung là)/gi;
    Helper_Regex.owner = /(của|thuộc về|dành cho|đối với|nghiêng về)/gi;

    Helper_Regex.anyWord = '*';
    Helper_Regex.negatedLookaheadWord = "?!";

    Helper_Regex.arrRegExpCharacters = [
        {
            character: "+",
            pattern: /\+/gi
        },
        {
            character: "*",
            pattern: /\*/gi
        }
    ];

    Helper_Regex.buildBeginAWord = function(word)
    {
        return Helper_Regex.beforeAWordWithBraket + word;
    };

    Helper_Regex.replaceRegExpCharacters = function(str)
    {
        for (var i = 0; i < Helper_Regex.arrRegExpCharacters.length; i++)
        {
            str = str.replace(Helper_Regex.arrRegExpCharacters[i].pattern,
                "\\" + Helper_Regex.arrRegExpCharacters[i].character);
        }
        return str;
    };

    Helper_Regex.buildEndAWord = function(word)
    {
        return word + Helper_Regex.afterAWordWithBraket;
    };

    Helper_Regex.buildFullWord = function(word)
    {
        return Helper_Regex.beforeAWordWithBraket + word + Helper_Regex.afterAWordWithBraket;
    };

    Helper_Regex.buildBeginASentence = function(word)
    {
        return "^(\\S+\\s+){0,3}" + word;
    };

    Helper_Regex.buildEndASentence = function(word)
    {
        return word + "(\\s+\\S+){0,3}$";
    };

    Helper_Regex.pregQuote = function(str, delimiter)
    {
        if (!delimiter)
        {
            delimiter = '';
        }

        var regex = new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + delimiter + '-]', 'g');
        return str.replace(regex, '\\$&');
    };

    Helper_Regex.buildMyRegex = function(allowValues)
    {
        allowValues = Helper_Regex.mapAnyCharater(allowValues);
        allowValues = Helper_Regex.mapNegatedLookaheadCharater(allowValues);
        allowValues = Helper_Regex.mapOrCharater(allowValues);

        return allowValues;
    };

    Helper_Regex.mapAnyCharater = function(allowValues)
    {
        var regex = '';
        var match = null;
        for (var i = 0; i < allowValues.length; i++)
        {
            regex = allowValues[i];
            match = regex.match(/<(\d+)>/);
            if (!match)
            {
                continue;
            }
            allowValues[i] = null;
            match = parseInt(match[1]);
            for (var j = 0; j <= match; j++)
            {
                allowValues.push(
                    regex.replace(/<(\d+)>/, stringHelper().createEmptyWord(j, Helper_Regex.anyWord + " ")).trim()
                    );
            }
        }
        allowValues = arrayHelper().clean(allowValues);
        return allowValues;
    };

    Helper_Regex.mapNegatedLookaheadCharater = function(allowValues)
    {
        var regex = '';
        var match = null;
        for (var i = 0; i < allowValues.length; i++)
        {
            regex = allowValues[i];
            match = regex.match(/<\?\!([^\<\>]+)>/);
            if (!match)
            {
                continue;
            }
            match = match[1].replace(/\s+/, "_");
            allowValues[i] = regex.replace(/<\?\!([^\<\>]+)>/, Helper_Regex.negatedLookaheadWord + match).trim();
        }
        allowValues = arrayHelper().clean(allowValues);
        return allowValues;
    };

    Helper_Regex.mapOrCharater = function(allowValues)
    {
        var regex = '';
        var match = null;
        for (var i = 0; i < allowValues.length; i++)
        {
            regex = allowValues[i];
            match = regex.match(/<([^\<\>]+)>/);
            if (!match)
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

    return Helper_Regex;
})();