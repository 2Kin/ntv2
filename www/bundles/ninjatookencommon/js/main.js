// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// permet de désactiver/activer le scrolling de la page
function disableWheel() {
    /* Gecko */
    addHandler(window, 'DOMMouseScroll', wheel);
    /* Opera */
    addHandler(window, 'mousewheel', wheel);
    /* IE */
    addHandler(document, 'mousewheel', wheel);
}
function enableWheel() {
	if(on)
		return;
    /* Gecko */
    removeHandler(window, 'DOMMouseScroll', wheel);
    /* Opera */
    removeHandler(window, 'mousewheel', wheel);
    /* IE */
    removeHandler(document, 'mousewheel', wheel);
}
function addHandler(object, event, handler, useCapture) {
    if (object.addEventListener) {
        object.addEventListener(event, handler, useCapture ? useCapture : false);
    } else if (object.attachEvent) {
        object.attachEvent('on' + event, handler);
    } else alert("Add handler is not supported");
}
function removeHandler(object, event, handler) {
    if (object.removeEventListener) {
        object.removeEventListener(event, handler, false);
    } else if (object.detachEvent) {
        object.detachEvent('on' + event, handler);
    } else alert("Remove handler is not supported");
}
// Wheel event handler
function wheel(event) {
    var delta; // Scroll direction
    // -1 - scroll down
    // 1  - scroll up
    event = event || window.event;
    // Opera & IE works with property wheelDelta
    if (event.wheelDelta) {
        delta = event.wheelDelta / 120;
        // In Опере value of wheelDelta the same but with opposite sign
        if (window.opera) delta = -delta;
        // Gecko uses property detail
    } else if (event.detail) {
        delta = -event.detail / 3;
    }
    // Disables processing events
    if (event.preventDefault) event.preventDefault();
    event.returnValue = false;
    return delta;
}

$(document).ready(function(){
	// les paramètres passés via l'url
	var prmstr = window.location.search.substr(1);
	var prmarr = prmstr.split ("&");
	var params = {};
	for ( var i = 0; i < prmarr.length; i++) {
		var tmparr = prmarr[i].split("=");
		params[tmparr[0]] = tmparr[1];
	}

	// le diaporama
	var diaporama = $('#diaporama');
	if(diaporama.length>0){
		$('#diaporama').bjqs({
			height			: 350,
			width			: 770,
			responsive		: true,
			animtype		: 'slide',
			automatic		: false,
			animduration	: 250,
			showcontrols	: false,
			centercontrols	: true,
		});
	}

	// focus et blur des champs de textes
	$('input[type=text]').each(function(){
		var _this = $(this);
		var _valInit = _this.val();
		_this.focus(function(){
			if(_this.val()==_valInit)
				_this.val('');
		});
		_this.blur(function(){
			if(_this.val()=='')
				_this.val(_valInit);
		});
	});

	// le menu responsive
	var ww = document.body.clientWidth;
	var _menuMobile = $("#menuMobile");
	var _nav = $(".menu>li>a");
	var adjustMenu = function() {
		if(ww < 768){
			_nav.unbind('click').bind('click', function(e) {
				e.preventDefault();
				$(this).parent("li").toggleClass("hover");
			});
		}else{
			_nav.parent("li").removeClass("hover");
			_nav.unbind('click');
		}
	}
	
	_menuMobile.click(function(e) {
		e.preventDefault();
		$(".menu").toggleClass("hidden-phone");
	});
	adjustMenu();

	$(window).bind('resize orientationchange', function() {
		ww = document.body.clientWidth;
		adjustMenu();
	});

	// l'éditeur de texte
	var _textarea = $('.textarea');
	if(_textarea.length>0){
		_textarea.tinymce({
			// General options
			plugins : "autolink link image lists pagebreak emoticons nt_media contextmenu paste noneditable nonbreaking textcolor",
			schema: "html5",
			theme: "modern",
			width : '100%',
			height:300,
			entity_encoding : "raw",
			element_format : "html",
			paste_auto_cleanup_on_paste : true,
			apply_source_formatting : true,
			convert_urls : false,
			relative_urls : false,
			media_strict: false,
			auto_focus : false,
			inline: true,
			// Theme options
			toolbar : "styleselect | bold italic underline strikethrough forecolor | link unlink | alignleft aligncenter alignright alignjustify bullist | emoticons image nt_media",
			menubar : false,
			statusbar : false,
			tab_focus : ':prev,:next',
			valid_elements : "@[id|class|title|style],span[data-mce-type|data-mce-style|align],a[href|target],legend,fieldset,img[src|alt|align|height|width],object[classid|width|height|codebase|*],param[name|value|_value],embed[type|width|height|src|*],iframe[type|width|height|src|frameborder|scrolling|marginheight|marginwidth|name|align],ul,li,ol,p[align],font[face|size|color],strong/b,em/i,u,strike,br",
			language : 'fr_FR',
			style_formats: [
				{title: 'entête 1', block : 'h3'},
				{title: 'entête 2', block : 'h4'},
				{title: 'entête 3', block : 'h5'},
				{title: 'entête 4', block : 'h6'}
			],
			formats : {
				alignleft : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', attributes: {"align":  'left'}},
				aligncenter : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', attributes: {"align":  'center'}},
				alignright : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', attributes: {"align":  'right'}},
				alignfull : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', attributes: {"align":  'justify'}}
			}
		});
	}

	// le jeu
	var unityPlayer = $("#unityPlayer");
	if(unityPlayer.length>0){
		if(typeof unityLoader != "undefined"){
			ntUnity = new UnityObject2({
				width:'100%',
				height:'100%',
				enableUnityAnalytics:false,
				enableGoogleAnalytics:false,
				params:{
					backgroundcolor: "333333",
					bordercolor: "333333",
					textcolor: "FFFFFF",
					disableContextMenu: true,
					disableExternalCall:true
				}
			});
			ntUnity.observeProgress(function (progress) {
				var $missingScreen = $(progress.targetEl).find(".missing");
				switch(progress.pluginStatus) {
					case "unsupported":
						showUnsupported();
						break;
					case "broken":
						alert("You will need to restart your browser after installation.");
						break;
					case "missing":
						$missingScreen.find("a").click(function (e) {
								e.stopPropagation();
								e.preventDefault();
								u.installPlugin();
								return false;
						});
						$missingScreen.show();
						break;
					case "installed":
						$missingScreen.remove();
						break;
					case "first":
						break;
				}
			});
			ntUnity.initPlugin(unityPlayer.get(0), unityLoader);

			if(typeof unityGame != "undefined"){
				ntUnityLoaded = window.setInterval(
					function(){
						var uO = ntUnity.getUnity();
						if(uO != null){
							window.clearInterval(ntUnityLoaded);
							setTimeout(function(){
								ntUnity.getUnity().SendMessage("loader", "initStream", unityGame);
							},1000);
						}
					},
					100
				);
			}
		}
	}

	// classements
	var _classe = $("#classe");
	if(_classe.length>0){
		var _data = [];
		_classe.find("li").each(function(){
			_data.push({
				value: parseInt($(this).find('.num').html()),
				color: $(this).css("color")
			});
		});
		_classe.before("<canvas width='200' height='200' id='"+_classe.attr("id")+"_chart' class='pull-left'></canvas>");
		new Chart($("#"+_classe.attr("id")+"_chart").get(0).getContext("2d")).Doughnut(_data);
	}

	// page de clan
	$('select[name="clan"]').on('change', function(){
		document.location.href = document.location.pathname+'?order='+$(this).find('option:selected').val();
	});

	// page de classement
	$('select[name="classe"]').on('change', function(){
		document.location.href = String(document.location.pathname).replace(/classement\/([0-9]*)/gi, 'classement/1')+'?filter='+$(this).find('option:selected').val()+'&order='+(typeof params['order']!="undefined"?params['order']:"")+'#classement';
	});

	// gestion de la popup
	var _popup = $('.popup-bg');
	if(_popup.length>0){
		var _referer = undefined;
		_popup.on('open', function(e){
			if(typeof _referer !="undefined"){
				_popup.addClass('on');
			}
		});
		_popup.find('a[href="confirm"]').on('click', function(){
			_popup.removeClass('on');
			_referer.trigger('validate');
			return false;
		});
		_popup.find('a[href="cancel"]').on('click', function(){
			_referer = undefined;
			_popup.removeClass('on');
			return false;
		});
		var _addPopupValidate = function(_element, _event){
			_element.attr('data-remove', '0');
			_element.on(_event, function(){
				if(_element.attr('data-remove')!='1'){
					_referer = _element;
					_popup.trigger('open');
					return false;
				}
			});
			_element.on('validate', function(){
				_element.attr('data-remove', '1');
				if(_event=='click'){
					document.location = _element.attr('href');
				}else
					_element.trigger(_event);
			});
		};

		// confirmation pour supprimer mon compte
		var _deleteAccount = $('form[name="deleteAccount"]');
		if(_deleteAccount.length>0){
			_addPopupValidate(_deleteAccount, 'submit');
		}
		// confirmation pour supprimer un thread/message
		var _delete = $('a.delete');
		if(_delete.length>0){
			var _event = 'click';
			_delete.each(function(){
				_addPopupValidate($(this), 'click');
			});
		}
	}

	// réponses
	var _answers = $("a.answer");
	if(_answers.length>0){
		var _answer = $("#answer");
		_answer.hide();
		_answers.each(function(){
			var _this = $(this);
			_this.click(function(e){
				e.preventDefault();
				e.stopImmediatePropagation();
				// ré-affiche tous les boutons de réponse
				_answers.show();
				// déplace le formulaire de réponse
				_this.parent().after(_answer);
				// affiche le formulaire de réponse
				_answer.show();
				// cache le bouton de réponse
				_this.hide();
				// déplace vers le message
				var scrollTop = _answer.parent().offset().top - 20;
				if(_answer.offset().top-_answer.parent().offset().top>$(window).height())
					scrollTop = _answer.offset().top + _answer.height() - $(window).height() + 20;
				$("html,body").animate({scrollTop: scrollTop },'slow');
			});
		});
	}

	// tag-it (champ destinataires)
	var _destination = $("#destinations");
	if(_destination.length>0){
		var request = _destination.attr('data-find');
		_destination.tagit({
			tags: function(input, autocomplete){
				if(_destination.query)
					_destination.query.abort();
				var q = $.trim(input.toLowerCase());
				if(q.length>2){
					_destination.query = $.ajax({
						dataType:'json',
						url:request+'?q='+q,
						complete:function(result){
							var json = result.responseJSON;
							_destination.tagit(
								"autocomplete",
								json,
								autocomplete
							);
						}
					});
				}
			},
			inputlibelle: "text",
			inputvalue: "id",
			field: "destinataires[]"
		});
	}

	// liste de kamon
	var _kamon = $('.kamon');
	if(_kamon.length>0){
		var _input = $('#clan_kamon');
		var _all = _kamon.find('div');
		_all.each(function(){
			var _this = $(this);
			_this.click(function(){
				_all.removeClass('selected');
				_this.addClass('selected');
				_input.val(_this.attr('data-val'));
			});
		});
	}

	// upload de fichier
	var _upload = $('form[name="editAvatar"] input[type="file"]');
	if(_upload.length>0){
		var _form = _upload.closest('form');
		var _btn = _upload.next();
		_btn.on('click', function(){
			_upload.trigger('click');
			return false;
		});
		_upload.on('change', function(e){
			var file = _upload.val().split("\\");
		    _btn.html(file[file.length-1]);
			_form.attr('action', _btn.attr('href'));
			_form.trigger('submit');
			e.preventDefault();
		});
	}
	var _upload = $('form[name="clan"] input[type="file"]');
	if(_upload.length>0){
		var _form = _upload.closest('form');
		var _btn = _upload.next();
		_btn.on('click', function(){
			_upload.trigger('click');
			return false;
		});
		_upload.on('change', function(e){
			var file = _upload.val().split("\\");
		    _btn.html(file[file.length-1]);
			e.preventDefault();
		});
	}

	// bracket pour tournoi
	var _bracketD = $("#bracket");
	/*var _bracket = {
		"teams": [
			["joueur avec un pseudo super long 1", "joueur 2"],
			["joueur 3", "joueur 4"],
			["joueur 5", "joueur 6"],
			["joueur 7", "joueur 8"]
		],
		"results": [
			[ 
				[
					[1, 2],
					[3, 4],
					[5, 6],
					[7, 8]
				],
				[
					[1, 2],
					[3, 4]
				],
				[
					[1, 2],
					[3, 4]
				]
			]
		]
	};*/
	if(_bracketD.length>0 && typeof _bracket!="undefined")
		_bracket.bracket({init: _bracket});

	// timeline des évènements
	var _timelineD = $("#timeline");
	if(_timelineD.length>0 && typeof _timeline!="undefined"){
		createStoryJS({
			type: 'timeline',
			width: '100%',
			height: '600',
			source: _timeline,
			embed_id: 'timeline'
		});
	}

	// captcha sur formulaire de contact
	$('#contact, #register').motionCaptcha({
		errorMsg: 'Ré-essayes...',
		successMsg: 'Captcha réussi'
	});
});