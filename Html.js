var sanitizeHtml        = require('sanitize-html');//Better than sanitizer about maintenance
var ent					= require('ent');


Helper_Html 	= {
};

Helper_Html.sanitizeHtmlConfig = {
    allowedTags : [
    	'img'
	    ,'h3'
	    ,'h4'
	    ,'h5'
	    ,'h6'
	    ,'blockquote'
	    ,'p'
	    ,'a'
	    ,'ul'
	    ,'ol'
	    ,'nl'
	    ,'li'
	    ,'b'
	    ,'i'
	    ,'strong'
	    ,'em'
	    ,'strike'
	    ,'code'
	    ,'hr'
	    ,'br'
	    ,'div'
	    ,'table'
	    ,'thead'
	    ,'caption'
	    ,'tbody'
	    ,'tr'
	    ,'th'
	    ,'td'
	    ,'pre'
	    ,'br'
    ],
    allowedAttributes: {
        a   : [ 'href', 'name', 'target' ],
        img : [ 'src' ]
    }
};
Helper_Html.removeNonASCIICharacter = function(html)
{
	return html.replace(/[^A-Za-z0-9ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, "");
}

Helper_Html.clean = function(html)
{
	html 	= this.removeNonASCIICharacter(html);
	html 	= sanitizeHtml(html, this.sanitizeHtmlConfig);
    html	= ent.decode(html);
    return html;
};




module.exports = Helper_Html;