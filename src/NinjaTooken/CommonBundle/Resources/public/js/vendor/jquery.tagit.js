/*
* jQuery tagit
*
* Copyright 2011, Nico Rehwaldt
* Released under the MIT license
* 
* !! version modifiée pour supporter les appels ajax et les résultats text/id !!
*/
(function($) {
    var tagit = {
        addTag: function(tag) {
            var self = $(this);
            var data = self.data("tagit");
			var value = '';
			var libelle = '';

            if (typeof tag === "string") {
                var selection = $(this).find("input[type=hidden]").filter(function() {
                    return $(this).val() == tag.attr('data-value');
                });
                // Tag already added
                if (selection.length) {
                    return;
                }
            } else {
				value = tag.attr('data-value');
				libelle = tag.attr('data-libelle');
            }
            var element = $('<li class="tag"></li>');

            var close = $('<a class="close">'+unescape("%D7")+'</a>');
            close.click(function() {
				$(this).parent().remove();
			});

            element
                .append($("<span>"+libelle+"</span>"))
                .append($('<input type="hidden" name="'+data.field+'" value="'+value+'"/>'))
				.append(close);

            if (!$(element).parent().length) {
               element.insertBefore($(".tagit-edit-handle", self));
            }

            self.trigger("tagit-tag-added", [tag]);
			tag.remove();
        }, 
        
        removeTag: function(tag) {
            var self = $(this);
            
            var selection = self.find("input[type=hidden]").filter(function() {
                return $(this).val() == tag;
            });
            
            if (selection.length) {
                selection.parent().remove();
                self.trigger("tagit-tag-removed", [tag]);
            }
        }, 
        
        getTags: function() {
            return $.map($(this).find("input[type=hidden]"), function(e) {
                return $(e).val();
            });
        },

        autocomplete: function (tags, autocomplete) {
			var self = $(this);
            var currentTags = self.tagit("getTags");
            var data = self.data("tagit");

            autocomplete.empty();

			var availableTags = [];
			if(typeof tags != "undefined"){
				availableTags = $.grep(tags, function (e) {
					return $.inArray(e[data.inputvalue], currentTags) == -1;
				});
			}
            var count = 0;
            $.each(availableTags, function (i, e) {
				autocomplete.append($('<li data-value="'+e[data.inputvalue]+'" data-libelle="'+e[data.inputlibelle]+'">'+e[data.inputlibelle]+'</li>'));
                count++;
            });
            autocomplete.toggleClass("open", count > 0);
        }
    };

    $.extend($.fn, {
        tagit: function() {
            var args = $.makeArray(arguments);

            var arg0 = args.shift();
            if (tagit[arg0]) {
                return tagit[arg0].apply(this, args);
            }

            return this.each(function() {
                var e = $(this);

                var options = $.extend({}, $.fn.tagit.defaults);
                if ($.isPlainObject(arg0)) {
                    options = $.extend(options, arg0);
                }

                if (e.is(".tagit")) {

                } else {
                    e.data("tagit", options);

                    var input = $('<input type="text" class="no-style" />');
                    var autocomplete = $("<ul></ul>");

                    e.bind("tagit-tag-added", function() {
                        autocomplete.removeClass("open");
                    });

                    e.bind("focusin", function(event) {
                        $(this)
                            .addClass("focused")
                            .find("input[type=text]")
                            .focus(function (event) {
								event.stopPropagation();
							}).focus();
                    }).bind("focusout", function(event) {
                        $(this).removeClass("focused");
                    });
                    
                    input.keydown(function(event) {
                        var self = $(this);
                        var tag = self.val();

                        var keyCode = event.which;

                        // enter key pressed
                        if (keyCode == 13) {
                            if (autocomplete.is(".open")) {
                                var selection = $("li.selected", autocomplete);
                                if (selection.length) {
                                    e.tagit("addTag", selection);
                                    self.val("");
                                }
                            }

                            event.preventDefault();
                        } else 
                        // tab key pressed
                        if (keyCode == 9) {
                            if (tag) {
                                e.tagit("addTag", self);
                                self.val("");
                                
                                event.preventDefault();
                            }
                        } else
                        // up / down arrows pressed
                        if (keyCode == 38 || keyCode == 40) {                                    
                            if (autocomplete.is(".open")) {
                                var elements = $("li", autocomplete);
                                var selection = $(elements).filter(".selected");
                                if (selection.length == 0 && elements.length > 0) {
                                    elements.eq(keyCode == 38 ? elements.length - 1 : 0)
                                            .addClass("selected");
                                } else {
                                    var selector = keyCode == 38 ? "prev" : "next";
                                    var newSelection = selection
                                        [selector]()
                                        .addClass("selected");

                                    if (newSelection.length) {
                                        selection.removeClass("selected");
                                    }
                                }
                                
                                event.preventDefault();
                            }
                        } else
                        // delete key pressed
                        if (keyCode == 8 && !tag) {
                            self.parent().prev().remove();
                            event.preventDefault();
                        } else {
                            tag = (tag + String.fromCharCode(keyCode)).toLowerCase();
                            if (tag) {
                                var tagitBase = $(this).parents(".tagit")
                                var tags = tagitBase.data("tagit").tags;
                                var currentTags = tagitBase.tagit("getTags");

                                if ($.isFunction(tags)) {
                                    tags(tag, autocomplete);
                                } else {
                                    autocomplete.empty();
                                    var availableTags = $.grep(tags, function (e) {
                                        return $.inArray(e[inputvalue], currentTags) == -1;
                                    });
                                    var count = 0;
                                    $.each(availableTags, function (i, e) {
                                        if (e.toLowerCase().indexOf(tag) == 0) {
											autocomplete.append($('<li data-'+data.inputvalue+'="'+e[data.inputvalue]+'" data-'+data.inputlibelle+'="'+e[data.inputlibelle]+'">'+e[data.inputlibelle]+'</li>'));
                                            count++;
                                        }
                                    });
                                    autocomplete.toggleClass("open", count > 0);
                                }
                            }
                        }
                    });

                    autocomplete.click(function(event) {
                        var target = $(event.target);
                        if (target.is("li")) {
                            $(e).tagit("addTag", target);
							$(e).find("input[type=text]").val("");
                        }
                    });
                    
                    e.append($('<li class="tagit-edit-handle"></li>').append(input).append(autocomplete))
                     .addClass("tagit");

                    $("li:not(.tagit-edit-handle)", e).each(function() {
                        $(e).tagit("addTag", $(this));
                    });
                }
            });
        }
    });

    $.fn.tagit.defaults = {
        field: "tag",
        inputlibelle: "text",
        inputvalue: "id",
        tags: []
    };
})(jQuery);