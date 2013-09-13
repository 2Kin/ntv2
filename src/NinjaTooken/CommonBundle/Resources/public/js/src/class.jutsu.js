var Jutsu = Class.extend({
	init: function(calculateur, element){
		this.calculateur = calculateur;

		this.element = element;
		this.select = this.element.find('select[name=aptitude]');
		this.selectOptions = this.select.find('option');
		this.result = this.element.find('.result[data-id='+this.select.attr('data-id')+']');

		this.limitLvl = parseInt(this.element.attr('data-niveau'));
		this.limitClass = this.element.attr('data-limit');

		eval('var data='+this.select.attr('data-json'));
		eval('var attr='+this.select.attr('data-attr'));
		this.data = data;
		this.attr = attr;

		this.initSelect();
	},
	toggle: function(){
		this.element.toggle(this.isLimitOk());
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
	isLimitOk: function(){
		return (this.limitClass == "" || this.limitClass == this.calculateur.classe) && this.limitLvl<=this.calculateur.level;
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
				var _html = '<ul>';
				for(var n in calcul){
					// les valeurs en pourcentage
					if(_this.attr[n].indexOf('##%')!=-1 && calcul[n]<2){
						calcul[n] = calcul[n]*100;
					}
					_html += '<li>'+(_this.attr[n].replace('##', '<strong>'+(Math.round(calcul[n]*10000)/10000)+'</strong>'))+'</li>';
				}
				_html += '</ul>';
				_this.result.html(_html);
			}else
				_this.result.text('-');

			_this.calculateur.update();
		});
		_this.select.trigger('change');
	}
});