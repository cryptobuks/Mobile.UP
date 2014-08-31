// TODO: Logout Switch Missing

define([
		'jquery',
		'underscore',
		'backbone',
		'Session',
		'utils'
], function($, _, Backbone, Session, utils){

	/**
	 *	BackboneView - OptionsPageView
	 *	Login & Logout-Form which validates the username and password using the Moodle Webservice
	 *	TODO: will be substituted by use of local Accounts and by the use of the Mobile Proxy of the DFN
	 */
	var OptionsPageView = Backbone.View.extend({

		model: Session,
		attributes: {"id": 'options'},

		logintemplate: utils.rendertmpl('login'),
		logouttemplate: utils.rendertmpl('logout'),

		events: {
			'submit #loginform': 'login',
			'submit #logoutform': 'logout',
			'focus #loginform input': 'clearForm'
		},

		initialize: function(){
			this.loginAttempts = 0;
			this.listenTo(this.model,'change', this.render);
			this.listenTo(this, "errorHandler", this.errorHandler);
		},

		render: function(){

			if (this.model.get('up.session.authenticated')){
				$(this.el).html(this.logouttemplate({}));
			}else{
				$(this.el).html(this.logintemplate({}));
			}

			$(this.el).trigger("create");
			return this;
		},

		login: function(ev){
			ev.preventDefault();
			if(this.loginAttempts < 3){
				var username = $('#username').val();
				var password = $('#password').val();
				this.model.generateLoginURL({username: username, password: password});
				var that = this;
				this.model.fetch({
					success: function(model, response, options){

						// Response contains error, so go to errorHandler
						if(response['error']){
							console.log(response['error']);
							that.trigger("errorHandler");
						}else{
							// Everything fine, save Moodle Token and redirect to previous form
							that.model.set('up.session.authenticated', true);
							that.model.set('up.session.username', username);
            				that.model.set('up.session.password', password);
							that.model.set('up.session.MoodleToken', response['token']);

							console.log('success -logged in');
							if(that.model.get('up.session.redirectFrom')){
		                		var path = that.model.get('up.session.redirectFrom');
		                		that.model.unset('up.session.redirectFrom');
		                		Backbone.history.navigate(path, { trigger : true });
		            		}else{
		                		Backbone.history.navigate('', { trigger : true });
		            		}
						}

					},
					error: function(model, response, options){
						console.log(response);
						// render error view
						that.trigger("errorHandler");
					}
				});
			}else{
				this.$("#error3").css('display', 'block');
				this.$('#login').attr('disabled', 'disabled');
			}
		},

		logout: function(ev){
			ev.preventDefault();
			this.model.unset('up.session.authenticated');
            this.model.unset('up.session.username');
            this.model.unset('up.session.password');
            this.model.unset('up.session.MoodleToken');
			this.render();
		},

		errorHandler: function(){
			this.loginAttempts++;
			this.$("#error").css('display', 'block');
		},

		clearForm: function(){
			this.$("#error").css('display', 'none');
		}

	});

	return OptionsPageView;
});