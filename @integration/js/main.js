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
				$("html,body").animate({scrollTop: _answer.parent().offset().top-20},'slow');
			});
		});
	}

	// tag-it (champ destinataires)
	var _destination = $("#destinations");
	if(_destination.length>0){
		_destination.tagit({
			tags: function(input, autocomplete) {
				if(_destination.query)
					_destination.query.abort();
				_destination.query = $.ajax({
					dataType:'json',
					url:'xml/destination.json?q='+input.toLowerCase(),
					complete:function(result){
						_destination.tagit(
							"autocomplete",
							eval(result.responseText),
							autocomplete
						);
					}
				});
			},
			field: "destination"
		});
	}

	// bracket pour tournoi
	var _bracket = $("#bracket");
	if(_bracket.length>0){
		_bracket.bracket({
			init: {
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
		}
		});
	}

	// timeline des évènements
	var _timeline = $("#timeline");
	if(_timeline.length>0){
		var _source = {
			"timeline":
			{
				"headline":"Sh*t People Say",
				"type":"default",
				"text":"People say stuff",
				"startDate":"2012,1,26",
				"date": [
					{
						"startDate":"2011,12,12",
						"endDate":"2012,1,27",
						"headline":"Vine",
						"text":"<p>Vine Test</p>",
						"asset":
						{
							"media":"https://vine.co/v/b55LOA1dgJU",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2012,1,26",
						"endDate":"2012,1,27",
						"headline":"Sh*t Politicians Say",
						"text":"<p>In true political fashion, his character rattles off common jargon heard from people running for office.</p>",
						"asset":
						{
							"media":"http://youtu.be/u4XpeU9erbg",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2012,1,10",
						"headline":"Sh*t Nobody Says",
						"text":"<p>Have you ever heard someone say “can I burn a copy of your Nickelback CD?” or “my Bazooka gum still has flavor!” Nobody says that.</p>",
						"asset":
						{
							"media":"http://youtu.be/f-x8t0JOnVw",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2012,1,26",
						"headline":"Sh*t Chicagoans Say",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/Ofy5gNkKGOo",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2011,12,12",
						"headline":"Sh*t Girls Say",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/u-yLGIH7W9Y",
							"credit":"",
							"caption":"Writers & Creators: Kyle Humphrey & Graydon Sheppard"
						}
					},
					{
						"startDate":"2012,1,4",
						"headline":"Sh*t Broke People Say",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/zyyalkHjSjo",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2012,1,4",
						"headline":"Sh*t Silicon Valley Says",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/BR8zFANeBGQ",
							"credit":"",
							"caption":"written, filmed, and edited by Kate Imbach & Tom Conrad"
						}
					},
					{
						"startDate":"2011,12,25",
						"headline":"Sh*t Vegans Say",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/OmWFnd-p0Lw",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2012,1,23",
						"headline":"Sh*t Graphic Designers Say",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/KsT3QTmsN5Q",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2011,12,30",
						"headline":"Sh*t Wookiees Say",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/vJpBCzzcSgA",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2012,1,17",
						"headline":"Sh*t People Say About Sh*t People Say Videos",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/c9ehQ7vO7c0",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2012,1,20",
						"headline":"Sh*t Social Media Pros Say",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/eRQe-BT9g_U",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2012,1,11",
						"headline":"Sh*t Old People Say About Computers",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/HRmc5uuoUzA",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2012,1,11",
						"headline":"Sh*t College Freshmen Say",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/rwozXzo0MZk",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2011,12,16",
						"headline":"Sh*t Girls Say - Episode 2",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/kbovd-e-hRg",
							"credit":"",
							"caption":"Writers & Creators: Kyle Humphrey & Graydon Sheppard"
						}
					},
					{
						"startDate":"2011,12,24",
						"headline":"Sh*t Girls Say - Episode 3 Featuring Juliette Lewis",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/bDHUhT71JN8",
							"credit":"",
							"caption":"Writers & Creators: Kyle Humphrey & Graydon Sheppard"
						}
					},
					{
						"startDate":"2012,1,27",
						"headline":"Sh*t Web Designers Say",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/MEOb_meSHhQ",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2012,1,12",
						"headline":"Sh*t Hipsters Say",
						"text":"No meme is complete without a bit of hipster-bashing.",
						"asset":
						{
							"media":"http://youtu.be/FUhrSVyu0Kw",
							"credit":"",
							"caption":"Written, Directed, Conceptualized and Performed by Carrie Valentine and Jessica Katz"
						}
					},
					{
						"startDate":"2012,1,6",
						"headline":"Sh*t Cats Say",
						"text":"No meme is complete without cats. This had to happen, obviously.",
						"asset":
						{
							"media":"http://youtu.be/MUX58Vi-YLg",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2012,1,21",
						"headline":"Sh*t Cyclists Say",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/GMCkuqL9IcM",
							"credit":"",
							"caption":"Video script, production, and editing by Allen Krughoff of Hardcastle Photography"
						}
					},
					{
						"startDate":"2011,12,30",
						"headline":"Sh*t Yogis Say",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/IMC1_RH_b3k",
							"credit":"",
							"caption":""
						}
					},
					{
						"startDate":"2012,1,18",
						"headline":"Sh*t New Yorkers Say",
						"text":"",
						"asset":
						{
							"media":"http://youtu.be/yRvJylbSg7o",
							"credit":"",
							"caption":"Directed and Edited by Matt Mayer, Produced by Seth Keim, Written by Eliot Glazer. Featuring Eliot and Ilana Glazer, who are siblings, not married."
						}
					}
				]
			}
		};
		createStoryJS({
			type:		'timeline',
			width:		'100%',
			height:		'600',
			source:		_source,
			embed_id:	'timeline'
		});
	}
});