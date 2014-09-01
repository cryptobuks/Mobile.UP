define([
		'jquery',
		'underscore',
		'backbone',
		'utils',
		'Session'
], function($, _, Backbone, utils, Session){


	/**
	 * 	BackboneModel - Person
	 */
	var Person = Backbone.Model.extend({
		parse: function(response){
			return response.Person;
		}
	});


	/**
	 * 	BackboneCollection - PersonList
	 */
	var PersonList = Backbone.Collection.extend({
		model: Person,

		parse:function(response){
			return response.people;
		}
	});


	/**
	 * 	BackboneView - PersonView
	 */
	var PersonView = Backbone.View.extend({
		template: utils.rendertmpl('person'),
		attributes: {"data-role": 'collapsible'},
		model: Person,

		render: function(){
			this.$el.html(this.template({person: this.model}));
			return this;
		}
	});


	/**
	 *	BackvoneView - PeoplePageView
	 */
	var PeoplePageView = Backbone.View.extend({
		template: utils.rendertmpl('people'),
		attributes: {"id": "people"},

		events: {
			'submit form': 'submit',
		},

		initialize: function(){
			this.collection = new PersonList();
			this.session = new Session();
			this.listenTo(this.collection, "error", this.requestFail);
			this.collection.bind("reset", this.clearList);
			this.collection.bind("add", this.addPerson);
		},

		clearList: function(){
			// clear previous results
			$("#people-results").empty();
		},

		addPerson: function(model){
			personView = new PersonView({model: model});
			$("#people-results").append(personView.render().el);
			$("#people-results").trigger("create");
			return this;
		},

		submit: function(ev){
			ev.preventDefault();
			// get search query
			var inputs = $('#query-form :input').serializeArray();
      		var query = inputs[0].value;
			// generate url and set collection url
			var url = 'https://www.intern.uni-potsdam.de/personsearch/app/webroot/index.php/person/.json';
			url += '?value='+query;
			url += '&username=wuff';
			url += '&password=wuff';
			//url += '&username='+encodeURIComponent(this.session.get('up.session.username'));
			//url += '&password='+encodeURIComponent(this.session.get('up.session.password'));
			console.log(url);
			this.collection.reset();
			this.collection.url = url;
			this.collection.fetch();
		},

		requestFail: function(error) {
			var errorPage = new utils.ErrorView({el: '#people-results', msg: 'Die Personensuche ist momentan nicht erreichbar.', module: 'people', err: error});
		},

		render: function(){
			this.$el.html(this.template({}));
			this.LoadingView = new utils.LoadingView({collection: this.collection, el: this.$("#loadingSpinner")});
			this.$el.trigger("create");
			return this;
		}
	});

  return PeoplePageView;
});