var _media_id;
var _stub;
var _object_attribs;
var _object_params;

/**
* Parse given URL
*
* @param url string - href to check for embeded video
*
* @return boolean - whether or not the url contains valid/supported video
*/
function parseUrl(url) {
	for(var i=0;i<AutoEmbed_stubs.length;i++){
		var stub =  AutoEmbed_stubs[i];
		console.log(stub['url-match']);
		var match = url.match(new RegExp(stub['url-match'],'i'));
		if (match) {
			_stub = stub;
			_media_id = match[0];
			_setDefaultParams();
			return true;
		}
	}

	return false;
}

/**
* Convert the url to an embedable tag
*
* return string - the embed html
*/
function getEmbedCode() {
	if ( typeof _stub['iframe-player'] != "undefined" ){
		return _buildiFrame();
	}
	return _buildObject();
}

/**
* Return a thumbnail for the embeded video
*
* return string - the thumbnail href
*/
function getImageURL() {
	if (!_stub['image-src']) return false;

	var thumb = _stub['image-src'];

	for (var i=1; i<=_media_id.length; i++) {
		thumb = thumb.replace('/'+i+'/gi', _media_id[i - 1]);
	}

	return thumb;
}

/**
* Build a generic object skeleton 
*/
function _buildObject() {

	var object_attribs = object_params = '';

	for(var param in _object_attribs) {
		object_attribs += '  ' + param + '="' + _object_attribs[param] + '"';
	}

	for(var param in _object_params) {
		object_params += '<param name="' + param + '" value="' + _object_params[param] + '" />';
	}

	return "<object "+object_attribs+">"+object_params+"</object>";
}

/**
* Build an iFrame player
*/
function _buildiFrame() {
	var source = _stub['iframe-player'];

	for (var i=1; i<=_media_id.length; i++) {
		source = source.replace('/'+i+'/gi', _media_id[i - 1]);
	}

	return '<iframe type="text/html" width="'+_object_attribs['width']+'" height="'+_object_attribs['height']+'" src="'+source+'" frameborder="0"></iframe>';
}

/**
* Set the default params for the type of
* stub we are working with
*/
function _setDefaultParams() {
	var source = _stub['embed-src'];
	var flashvars = typeof _stub['flashvars'] != "undefined"? _stub['flashvars'] : null;

	for (var i=1; i<=_media_id.length; i++) {
		source = source.replace('/'+i+'/gi', _media_id[i - 1]);
		flashvars = flashvars.replace('/'+i+'/gi', _media_id[i - 1]);
	}

	source = htmlspecialchars(source, ENT_QUOTES, null, false);
	flashvars = htmlspecialchars(flashvars, ENT_QUOTES, null, false);

	_object_params = {
		'movie' : source,
		'quality' : 'high',
		'allowFullScreen' : 'true',
		'allowScriptAccess' : 'always',
		'pluginspage' : 'http://www.macromedia.com/go/getflashplayer',
		'autoplay' : 'false',
		'autostart' : 'false',
		'flashvars' : flashvars,
	};

	_object_attribs = {
		'type' : 'application/x-shockwave-flash',
		'data' : source,
		'width' : _stub['embed-width'],
		'height' : _stub['embed-height'],
	};
}