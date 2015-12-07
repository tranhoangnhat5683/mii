module.exports = (function() {
    var Helper_Array    = null;
    var Helper_Regex    = null;
    var Helper_String   = {};

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

    Helper_String.formatLength = function(str, length, options)
    {
        str += (new Array(length + 1).join(' '));
        return str.slice(0, length);
    };

    Helper_String.formatString = function(str)
    {
        if (!Helper_String.entities)
        {
            var Entities = require('html-entities').AllHtmlEntities;
            Helper_String.entities = new Entities();
        }

        if (!Helper_String.unorm)
        {
            Helper_String.unorm = require('unorm');
        }

        return Helper_String.unorm.nfc(Helper_String.entities.decode(str));
    };

    Helper_String.createEmptyWord = function(length, character)
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

    Helper_String.createRepeatString = function(length, word, separator)
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

    Helper_String.isJson = function(str)
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

    Helper_String.haveCharacterInText = function(start, end, text)
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

    Helper_String.splitToParagraphs = function(str, separator)
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
    Helper_String.splitToSentence = function(str, separator)
    {
        if (!separator)
        {
            separator = regexHelper().sentencesSeparatorReg;
        }

        var sentences = str.split(separator);
        return arrayHelper().clean(sentences);
    };

    Helper_String.splitToSentenceWithoutMarks = function(str)
    {
        var sentences = str.split(regexHelper().sentencesSeparatorWithoutBracketReg);
        return arrayHelper().clean(sentences);
    };

    Helper_String.splitToWord = function(str, separator)
    {
        if (!separator)
        {
            separator = regexHelper().notACharacterNorNumberReg;
        }

        var words = str.split(separator);
        return arrayHelper().clean(words);
    };

    Helper_String.removeHtmlTag = function(str)
    {
        return str.replace(/(<([^>]+)>)/ig, "");
    };

    Helper_String.getLengthByWord = function(str)
    {
        return Helper_String.splitToWord(str).length;
    };

    Helper_String.detectLanguage = function(text, format) // options prop format
    {
        if (!format)
        {
            format = 'iso2';
        }

        if (!Helper_String.languageDetect)
        {
            Helper_String.languageDetect = {};
        }

        if (!Helper_String.languageDetect[format])
        {
            var LanguageDetect = require('languagedetect');
            Helper_String.languageDetect[format] = new LanguageDetect(format);
        }

        var arrLanguages = Helper_String.languageDetect[format].detect(text, 2);
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

    Helper_String.convertUnicodeToAscii = function(str)
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

    Helper_String.getFrom = function(str, startToken, endToken)
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

    Helper_String.getFromAll = function(str, startToken, endToken) {
        var result = [];
        while (str.indexOf(startToken) >= 0)
        {
            str = str.substring(str.indexOf(startToken) + startToken.length);
            result.push(str.substring(0, str.indexOf(endToken)));
        }

        return result;
    };

    return Helper_String;
})();