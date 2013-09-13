var Aptitude = Class.extend({
	init: function(calculateur, element){
		this.calculateur = calculateur;

		this.element = element;
		this.select = this.element.find('select[name=capacite]');
		this.selectOptions = this.select.find('option');
		this.result = this.element.find('.result[data-id='+this.select.attr('data-id')+']');

		eval('var data='+this.select.attr('data-json'));
		this.data = data;

		this.initSelect();
	},
	toggleOptions: function(dispo){
		var actuel = this.getLevel();
		this.selectOptions.each(function(){
			var _this = $(this);
			if(parseInt(_this.val()) > actuel+dispo)
				_this.attr('disabled', 'disabled');
			else
				_this.removeAttr('disabled');
		});
	},
	getLevel: function(){
		return parseInt(this.select.find('option:selected').val());
	},
	initSelect: function(){
		var _this = this;
		_this.select.on('change', function(){
			var _lvl = _this.getLevel();
			if(_lvl>0){
				var calcul = _this.calculateur.getData(_lvl, _this.data);
				_this.result.empty();
				if(_this.select.attr('data-id')=='force'){
					_this.result.append('<strong> Katana</strong> : '+Math.round(calcul.val*6));
					_this.result.append('<strong> Kunaï</strong> : '+Math.round(calcul.val*2.5));
					_this.result.append('<strong> Shuriken</strong> : '+Math.round(calcul.val*1.75));
					_this.result.append('<strong> Shuriken de l\'ombre</strong> : '+Math.round(calcul.val*7));
				}else
					_this.result.append('<strong> Valeur</strong> : '+Math.round(calcul.val*10000)/10000);
			}else
				_this.result.text('-');
			_this.calculateur.update();
		});
		_this.select.trigger('change');
	}
});