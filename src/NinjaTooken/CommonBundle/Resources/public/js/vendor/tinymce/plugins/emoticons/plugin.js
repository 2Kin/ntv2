/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */

tinymce.PluginManager.add('emoticons', function(editor, url) {
	var emoticons = [
		[";^", "=B", "angry", "are you for real ", "beaten", "boo!", "bouaaaaah", "brains...!"],
		["brzzzzz", "burnt", "confident", "dark mood", "disapointed", "disappearing", "dizzy", "enjoying mah playlist"],
		["evilish", "eyes on fire", "faill", "gangs", "graffiti", "grin", "have a nice day", "hidden"],
		["high", "hope my fake smile works again", "ignoring", "in love", "indifferent ", "innocent", "ka boom", "lll._."],
		["mah (chilling)", "meaw", "ninja", "nom nom", "nose bleed", "nose pick", "oh noes", "oh u !"],
		["omg", "on fire", "ouch...it hurts", "O_O", "pissed off", "psychotic", "relief", "scared"],
		["secret laugh", "serious business", "shocked...again", "shocked", "shout", "shy", "sick", "slow"],
		["snooty", "tastey", "teeth brushing ", "that dood is up to something", "TT TT", "want !", "want", "we all gonna die"],
		["whisper", "whistle", "wut", "X3", "XD", "x_x", "yaeh am not durnk", "yarr"],
		["yo !", "you seem to be serious", "you're kidding, right", "yum", "yuush", "-e--", "zzZ", "zzzZ"]
	];

	function getHtml() {
		var emoticonsHtml;

		emoticonsHtml = '<table role="presentation" class="mce-grid">';

		tinymce.each(emoticons, function(row) {
			emoticonsHtml += '<tr>';

			tinymce.each(row, function(icon) {
				var emoticonUrl = url + '/img/Yolks-50x50/' + icon + '.png';

				emoticonsHtml += '<td><a href="#" data-mce-url="' + emoticonUrl + '" tabindex="-1" title="'+icon+'"><img src="' +
					emoticonUrl + '" style="width: 50px; height: 50px" alt="'+icon+'"></a></td>';
			});

			emoticonsHtml += '</tr>';
		});

		emoticonsHtml += '</table>';

		return emoticonsHtml;
	}

	editor.addButton('emoticons', {
		type: 'panelbutton',
		popoverAlign: 'bc-tl',
		panel: {
			autohide: true,
			html: getHtml,
			onclick: function(e) {
				var linkElm = editor.dom.getParent(e.target, 'a');

				if (linkElm) {
					editor.insertContent('<img src="' + linkElm.getAttribute('data-mce-url') + '" />');
					this.hide();
				}
			}
		},
		tooltip: 'Emoticons'
	});
});
