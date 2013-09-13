var Calculateur = Class.extend({
	init: function(){
		this.jutsus = [];
		this.aptitudes = [];
		this.classe = "";
		this.level = 0;

		// les champs de totaux
		this.totalJutsus = $('.result[data-id=total-aptitudes]');
		this.totalAptitudes = $('.result[data-id=total-capacites]');
		this.ptsAptitude = 0;
		this.ptsJutsu = 0;

		var _this = this;

		// les jutsus
		var _jutsus = $('.calculateur-jutsu');
		if(_jutsus.length>0){
			_jutsus.each(function(){
				_this.jutsus.push(new Jutsu(_this, $(this)));
			});
		}

		// les aptitudes
		var _capacites = $('.calculateur-capacite');
		if(_capacites.length>0){
			_capacites.each(function(){
				_this.aptitudes.push(new Aptitude(_this, $(this)));
			});
		}

		// sélection de la classe
		$("select[name=calculateurLimit]").on('change', function(){
			_this.classe = $(this).find('option:selected').val();
			_this.toggleJutsus();
		}).trigger('change');

		// sélection du niveau
		var _niveaux = $("select[name=calculateurLevel]");
		if(_niveaux.length>0){
			eval('var _niveauxAptitude ='+_niveaux.attr('data-aptitude'));
			eval('var _niveauxCapacite ='+_niveaux.attr('data-capacite'));
			_niveaux.on('change', function(){
				_this.level = parseInt($(this).find('option:selected').val());
				_this.ptsJutsu = _niveauxAptitude.depart + _niveauxAptitude.val*_this.level;
				_this.ptsAptitude = _niveauxCapacite.depart + _niveauxCapacite.val*_this.level;
				$('[data-id=ptsCapacite]').text(_this.ptsAptitude);
				$('[data-id=ptsAptitude]').text(_this.ptsJutsu);

				_this.toggleJutsus();
			}).trigger('change');
		}
	},
	getData: function(_lvl, _data){
		var _lvlActuel, _lvlSuivant, _palierActuel, _palierSuivant, _val;
		var i = 1;
		// base
		_palierActuel = _data[0];
		_val = {};
		for(attr in _palierActuel){
			if(attr!='lvl')
				_val[attr] = _palierActuel[attr];
		}
		// ajout par niveau
		while(i<_data.length-1){
			_palierActuel = _data[i];
			_palierSuivant = _data[i+1];
			_lvlActuel	= _palierActuel.lvl;
			_lvlSuivant	= _palierSuivant.lvl;
			if(_lvl<_lvlActuel){
				return _val;
			}else if(_lvl>_lvlSuivant){
				for(attr in _palierActuel){
					if(attr!='lvl')
						_val[attr] += (_lvlSuivant-_lvlActuel)*_palierActuel[attr];
				}
			}else{
				for(attr in _palierActuel){
					if(attr!='lvl')
						_val[attr] += (_lvl-_lvlActuel)*_palierActuel[attr];
				}
				return _val;
			}
			i++;
		}
		if(_lvl>_palierActuel.lvl)
			_palierActuel = _data[_data.length-1];
		_lvlActuel	= _palierActuel.lvl;
		for(attr in _palierActuel){
			if(attr!='lvl')
				_val[attr] += (_lvl-_lvlActuel+1)*_palierActuel[attr];
		}
		return _val;
	},
	// calcul du total des points de jutsus dépensés
	getTotalJutsus: function(){
		var total = 0;
		for(var i=0;i<this.jutsus.length;i++){
			if(this.jutsus[i].isLimitOk())
				total += this.jutsus[i].getLevel();
		}
		return total;
	},
	// calcul du total des points d'aptitudes dépensés
	getTotalAptitudes: function(){
		var total = 0;
		for(var i=0;i<this.aptitudes.length;i++){
			total += this.aptitudes[i].getLevel();
		}
		return total;
	},
	update: function(){
		// met à jour le total des jutsus
		this.totalJutsus.text(this.ptsJutsu - this.getTotalJutsus()); 
		// met à jour le total des aptitudes
		this.totalAptitudes.text(this.ptsAptitude - this.getTotalAptitudes());

		// met à jour les options disponibles
		this.toggleOptions();
	},
	toggleJutsus: function(){
		for(var i=0;i<this.jutsus.length;i++){
			this.jutsus[i].toggle();
		}
		this.update();
	},
	toggleOptions: function(){
		var dispo = this.ptsJutsu - this.getTotalJutsus();
		for(var i=0;i<this.jutsus.length;i++){
			this.jutsus[i].toggleOptions(dispo);
		}
		dispo = this.ptsAptitude - this.getTotalAptitudes();
		for(var i=0;i<this.aptitudes.length;i++){
			this.aptitudes[i].toggleOptions(dispo);
		}
	}
});