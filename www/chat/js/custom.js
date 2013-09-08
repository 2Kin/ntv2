/*
 * @package AJAX_Chat
 * @author Sebastian Tschan
 * @copyright (c) Sebastian Tschan
 * @license GNU Affero General Public License
 * @link https://blueimp.net/ajax/
 */

// Overriding client side functionality:

/*
// Example - Overriding the replaceCustomCommands method:
ajaxChat.replaceCustomCommands = function(text, textParts) {
	return text;
}
 */

var forbidden = ["foutre", "pede", "pédé", "pede", "encul", "bougnoul", "connard", "connar", "conar", "couille", "branle", "connasse", "salope", "bite", "fuck", "putain", "trouduk", "enfoiré", "enfoire", "gouine", "tapette", "baltringue", "grognasse", "pédale", "pedale", "pouffiasse", "pétasse", "petasse", "enflure", "bordel", "tarlouze", "bâtard", "batard", "poufiasse", "pouffiasse", "cu", "cul", "chiotte", "emmerde", "gueule", "niquer", "fiotte", "pute", "racaille", "grognasse", "pourriture", "branleur", "sale porc", "ducon", "facho", "mange-merde", "enculé", "encule", "duc", "nique", "tantouse", "tantouze", "tg", "fdp", "ntm", "pd", "mongolien", "gogol", "trizo", "triso", "trisomique", "sob", "bitch", "whore", "hooker", "slut", "fuck", "fucker", "motherfucker", "mofo", "unclefucker", "motherfucking", "asshole", "shit", "dick", "prick", "bastard", "cunt", "twat", "piss", "screw", "cock","putin"];
var regex = new RegExp("("+forbidden.join('|')+")", "gi");

//Replace stuff people say:
ajaxChat.replaceCustomText = function(text) {
    return text.replace(regex, 'rogntudju');
}