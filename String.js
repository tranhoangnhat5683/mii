module.exports = function() {
    var Helper_Array = null;
    var Helper_Regex = null;
    function arrayHelper()
    {
        if (!Helper_Array)
        {
            Helper_Array = require('./Array');
        }

        return Helper_Array;
    }

    function regexHelper()
    {
        if (!Helper_Regex)
        {
            Helper_Regex = require('./Regex');
        }

        return Helper_Regex;
    }

    var StringHelper = {};

    StringHelper.formatLength = function(str, length, options)
    {
        str += (new Array(length + 1).join(' '));
        return str.slice(0, length);
    };

    StringHelper.formatString = function(str)
    {
        if (!StringHelper.entities)
        {
            var Entities = require('html-entities').AllHtmlEntities;
            StringHelper.entities = new Entities();
        }

        if (!StringHelper.unorm)
        {
            StringHelper.unorm = require('unorm');
        }

        return StringHelper.unorm.nfc(StringHelper.entities.decode(str));
    };

    StringHelper.createEmptyWord = function(length, character)
    {
        if (!character)
        {
            character = '-';
        }
        var word = '';
        for (var i = 0; i < length; i++)
        {
            word += character;
        }
        return word;
    };

    StringHelper.createRepeatString = function(length, word, separator)
    {
        if (!word)
        {
            word = '-';
        }
        if (!separator)
        {
            separator = ' ';
        }
        var words = [];
        for (var i = 0; i < length; i++)
        {
            words.push(word);
        }
        return words.join(separator);
    };

    StringHelper.isJson = function(str)
    {
        try
        {
            JSON.parse(str);
        }
        catch (e)
        {
            return false;
        }

        return true;
    };

    StringHelper.haveCharacterInText = function(start, end, text)
    {
        var regCharater = /\,|\;/gi;
        var str = text.substring(start, end);
        var match = str.search(regCharater);
        if (match !== -1)
        {
            return true;
        }
        return false;
    };

    StringHelper.splitToParagraphs = function(str, separator)
    {
        if (!separator)
        {
            separator = regexHelper().paragraphSeparatorReg;
        }

        var sentences = str.split(separator);
        return arrayHelper().clean(sentences);
    };

    /*
     |----------------------------------------------------------
     | @TODO: cho nay can lam ro quan diem:
     | 1. Split sentence co can quan tam den paragraph khong?
     | Hien tai la khong quan tam.
     | 2. Sentence da duoc clean tu truoc: remove html, format, ...
     |----------------------------------------------------------
     */
    StringHelper.splitToSentence = function(str, separator)
    {
        if (!separator)
        {
            separator = regexHelper().sentencesSeparatorReg;
        }

        var sentences = str.split(separator);
        return arrayHelper().clean(sentences);
    };

    StringHelper.splitToSentenceWithoutMarks = function(str)
    {
        var sentences = str.split(regexHelper().sentencesSeparatorWithoutBracketReg);
        return arrayHelper().clean(sentences);
    };

    StringHelper.splitToWord = function(str, separator)
    {
        if (!separator)
        {
            separator = regexHelper().notACharacterNorNumberReg;
        }

        var words = str.split(separator);
        return arrayHelper().clean(words);
    };

    StringHelper.removeHtmlTag = function(str)
    {
        return str.replace(/(<([^>]+)>)/ig, "");
    };

    StringHelper.getLengthByWord = function(str)
    {
        return StringHelper.splitToWord(str).length;
    };

    StringHelper.detectLanguage = function(text, format) // options prop format
    {
        if (!format)
        {
            format = 'iso2';
        }

        if (!StringHelper.languageDetect)
        {
            StringHelper.languageDetect = {};
        }

        if (!StringHelper.languageDetect[format])
        {
            var LanguageDetect = require('languagedetect');
            StringHelper.languageDetect[format] = new LanguageDetect(format);
        }

        var arrLanguages = StringHelper.languageDetect[format].detect(text, 2);
        var lang = null;
        for (var i = 0; i < arrLanguages.length; i++)
        {
            lang = arrLanguages[i];
            if ((lang instanceof Array) && lang[0] !== null)
            {
                return lang[0];
            }
        }

        return 'un';
    };

    StringHelper.convertUnicodeToAscii = function(str)
    {
        if (!str) {
            return str;
        }
        //
        str = str.replace(/á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, 'e');
        str = str.replace(/í|ì|ỉ|ĩ|ị/g, 'i');
        str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, 'o');
        str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, 'u');
        str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/g, 'y');
        //
        str = str.replace(/Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ/g, 'A');
        str = str.replace(/Đ/g, 'D');
        str = str.replace(/É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ/g, 'E');
        str = str.replace(/Í|Ì|Ỉ|Ĩ|Ị/g, 'I');
        str = str.replace(/Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ/g, 'O');
        str = str.replace(/Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự/g, 'U');
        str = str.replace(/Ý|Ỳ|Ỷ|Ỹ|Ỵ/g, 'Y');
        return str;
    };

    StringHelper.getFrom = function(str, startToken, endToken)
    {
        var start = str.indexOf(startToken) + startToken.length;
        if (start < startToken.length)
        {
            return '';
        }

        var lastHalf = str.substring(start);
        var end = lastHalf.indexOf(endToken);
        return lastHalf.substring(0, end);
    };

    StringHelper.getFromAll = function(str, startToken, endToken) {
        var result = [];
        while (str.indexOf(startToken) >= 0)
        {
            str = str.substring(str.indexOf(startToken) + startToken.length);
            result.push(str.substring(0, str.indexOf(endToken)));
        }

        return result;
    };

    return arrayHelper;
}();