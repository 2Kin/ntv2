(function () {
	_af = document.createElement("IFRAME");
	_am = document.createElement("IMG");
	_af.id = '_afd';
	_af.src = '/adimages/';
	_af.style.display = 'block';
	_af.style.border = 'none';
	_am.id = '_amd';
	_am.src = '/adimages/textlink-ads.jpg';
	_am.style.width = _af.style.width = '1px';
	_am.style.height = _af.style.height = '1px';
	_am.style.top = _af.style.top = '-1000px';
	_am.style.left = _af.style.left = '-1000px';
	document.body.appendChild(_af);
	document.body.appendChild(_am);
})();