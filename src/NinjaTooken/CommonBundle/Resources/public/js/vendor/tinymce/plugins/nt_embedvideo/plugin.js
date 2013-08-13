tinymce.PluginManager.add('nt_embedvideo', function(editor) {
	function showDialog(linkList) {
		var data = {}, selection = editor.selection, dom = editor.dom, selectedElm, anchorElm, initialText;
		var win, linkListCtrl;

		function linkListChangeHandler(e) {
			var textCtrl = win.find('#text');

			if (!textCtrl.value() || (e.lastControl && textCtrl.value() == e.lastControl.text())) {
				textCtrl.value(e.control.text());
			}

			win.find('#href').value(e.control.value());
		}

		function buildLinkList() {
			var linkListItems = [{text: 'None', value: ''}];

			tinymce.each(linkList, function(link) {
				linkListItems.push({
					text: link.text || link.title,
					value: link.value || link.url,
					menu: link.menu
				});
			});

			return linkListItems;
		}

		function updateText() {
			if (!initialText && data.text.length === 0) {
				this.parent().parent().find('#text')[0].value(this.value());
			}
		}

		selectedElm = selection.getNode();
		anchorElm = dom.getParent(selectedElm, 'a[href]');

		data.text = initialText = anchorElm ? (anchorElm.innerText || anchorElm.textContent) : selection.getContent({format: 'text'});
		data.href = anchorElm ? dom.getAttrib(anchorElm, 'href') : '';

		if (selectedElm.nodeName == "IMG") {
			data.text = initialText = " ";
		}

		if (linkList) {
			linkListCtrl = {
				type: 'listbox',
				label: 'Link list',
				values: buildLinkList(),
				onselect: linkListChangeHandler
			};
		}

		win = editor.windowManager.open({
			title: 'Insert link',
			data: data,
			body: [
				{
					name: 'href',
					type: 'filepicker',
					filetype: 'file',
					size: 40,
					autofocus: true,
					label: 'Url',
					onchange: updateText,
					onkeyup: updateText
				}
			],
			onSubmit: function(e) {
				var data = e.data, href = data.href;

				// Delay confirm since onSubmit will move focus
				function delayedConfirm(message, callback) {
					window.setTimeout(function() {
						editor.windowManager.confirm(message, callback);
					}, 0);
				}

				if (data.text != initialText) {
					if (anchorElm) {
						editor.focus();
						anchorElm.innerHTML = data.text;

						dom.setAttribs(anchorElm, {
							href: href,
							target: data.target ? data.target : null,
							rel: data.rel ? data.rel : null
						});

						selection.select(anchorElm);
					} else {
						editor.insertContent(dom.createHTML('a', {
							href: href,
							target: data.target ? data.target : null,
							rel: data.rel ? data.rel : null
						}, data.text));
					}
				} else {
					editor.execCommand('mceInsertLink', false, {
						href: href,
						target: data.target,
						rel: data.rel ? data.rel : null
					});
				}
			}
		});
	}

	editor.addButton('nt_embedvideo', {
		icon: 'media',
		tooltip: 'Insert video',
		onclick: showDialog,
		stateSelector: 'img[data-mce-object=video]'
	});

	editor.addMenuItem('nt_embedvideo', {
		icon: 'media',
		text: 'Insert video',
		onclick: showDialog,
		context: 'insert',
		prependToContext: true
	});
});