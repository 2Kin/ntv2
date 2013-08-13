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

$(document).ready(function(){

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
			plugins : "autolink link image lists pagebreak emoticons media contextmenu paste noneditable nonbreaking",
			schema: "html5",
			theme: "modern",
			width : '100%',
			height:300,
			entity_encoding : "raw",
			paste_auto_cleanup_on_paste : true,
			apply_source_formatting : true,
			force_br_newlines : true,
			convert_urls : false,
			relative_urls : false,
			media_strict: false,
			auto_focus : false,
			inline: true,
			// Theme options
			toolbar : "undo,redo,|,bold,italic,underline,strikethrough,forecolor,|,link,unlink,|,justifyleft,justifycenter,justifyright,justifyfull,bullist,|,emoticons,image,imageshack,media",
			menubar : false,
			statusbar : false,
			tab_focus : ':prev,:next',
			valid_elements : "@[id|class|title|style],span[data-mce-type|data-mce-style|align],a[href|target],legend,fieldset,img[src|alt|align|height|width],object[classid|width|height|codebase|*],param[name|value|_value],embed[type|width|height|src|*],ul,li,ol,p[align],font[face|size|color],strong/b,em/i,u,strike,br",
			language : 'fr_FR',
		});
	}

	// le jeu
	var unityPlayer = $("#unityPlayer");
	if(unityPlayer.length>0){
		var u = new UnityObject2({
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
		u.observeProgress(function (progress) {
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
		u.initPlugin(unityPlayer.get(0), "loader_.unity3d");
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
			tags: function(input, autocomplete) {
				if(_destination.query)
					_destination.query.abort();
				_destination.query = $.ajax({
					dataType:'json',
					url:request+'?q='+input.toLowerCase(),
					complete:function(result){
						var users = [];
						var json = result.responseJSON;
						if(typeof json != "undefined"){
							for(var i=0;i<json.length;i++){
								users.push(json[i].username);
							}
						}
						_destination.tagit(
							"autocomplete",
							users,
							autocomplete
						);
					}
				});
			},
			field: "destination"
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
});