define(['jquery', 'underscore', 'backbone', 'utils', 'q', 'modules/campusmenu', 'modules/timeselection', 'pmodules/sitemap/searchablemap'], function($, _, Backbone, utils, Q, campusmenu, timeselection, searchablemap){
	var rendertmpl = _.partial(utils.rendertmpl, _, "js/pmodules/sitemap");

	var settings = {};

	var terminals = "terminals";
	var institutes = "institutes";
	var canteens = "canteens";
	var parking = "parking";
	var associateinstitutes = "associateinstitutes";
	var student = "student";
	var sport = "sport";

	var categoryStore = new CategoryStore();
	var lastFinderId = undefined;
	var lastCampus = undefined;
	var searchView = undefined;

	settings =	{
		getCampus: function(name) {
			var result = this.url[name];
			return result || this.url.golm;
		},
		url: {
			griebnitzsee: {
				campus: "griebnitzsee"
			},
			neuespalais: {
				campus: "neuespalais"
			},
			golm: {
				campus: "golm"
			}
		},
		options: {
			terminals: { "icon": "img/up/puck-marker.png" },
			canteens: { "icon": "img/up/mensa-marker.png" },
			parking: {
				"strokeColor": "#fff",
			    "strokeOpacity": 1,
			    "strokeWeight": 2,
			    "fillColor": "#70c8dc",
			    "fillOpacity": 0.8
			},
			institutes: {
				"strokeColor": "#fff",
			    "strokeOpacity": 1,
			    "strokeWeight": 2,
			    "fillColor": "#e57967",
			    "fillOpacity": 0.8
			},
			associateinstitutes: {
				"strokeColor": "#fff",
			    "strokeOpacity": 1,
			    "strokeWeight": 2,
			    "fillColor": "#cf6da8",
			    "fillOpacity": 0.8
			},
			student: {
				"strokeColor": "#fff",
			    "strokeOpacity": 1,
			    "strokeWeight": 2,
			    "fillColor": "#897cc2",
			    "fillOpacity": 0.8
			},
			sport: {
				"strokeColor": "#fff",
			    "strokeOpacity": 1,
			    "strokeWeight": 2,
			    "fillColor": "#B6B6B4",
			    "fillOpacity": 0.8
			}
		}
	};

	var oneSidedGuard = {
		callback: function(options) { drawSelectedCampus(options); },
		isCalled: false,
		isBlocked: true,
		options: undefined,

		callMultiple: function(options) {
			if (this.isBlocked) {
				this.isCalled = true;
				this.options = options;
			} else {
				this.callback(options);
			}
		},

		disableBlock: function() {
			this.isBlocked = false;
			if (this.isCalled) {
				this.callback(this.options);
			}
		}
	};

	function checkUncheck(category) {
		return function() {
			var visibility = $(this).is(':checked');
			categoryStore.setVisibility(category, visibility);
			_.each(allMarkers.getElements(), function(a) { a.reset(); });
		};
	}


	/*
	 * initialize map when page is shown
	 * "pageshow" is deprecated (http://api.jquerymobile.com/pageshow/) but the replacement "pagecontainershow" doesn't seem to trigger
	 */
	$(document).on("pageshow", "#sitemap", function() {
		$("div[data-role='campusmenu']").campusmenu("pageshow");
		searchView = new SearchView({query: "input[data-type='search']", children: "#filterable-locations"});

		$('#Terminals:checkbox').click(checkUncheck(terminals));
		$('#Institute:checkbox').click(checkUncheck(institutes));
		$('#Mensen:checkbox').click(checkUncheck(canteens));
		$('#Parking:checkbox').click(checkUncheck(parking));
		$('#AnInstitute:checkbox').click(checkUncheck(associateinstitutes));
		$('#Living:checkbox').click(checkUncheck(student));
		$('#Sport:checkbox').click(checkUncheck(sport));

		settings.options.institutes.fillColor = $(".sitemap-institutes").css("background-color");
		settings.options.parking.fillColor = $(".sitemap-parking").css("background-color");
		settings.options.associateinstitutes.fillColor = $(".sitemap-associateinstitutes").css("background-color");
		settings.options.student.fillColor = $(".sitemap-living").css("background-color");
		settings.options.sport.fillColor = $(".sitemap-sport").css("background-color");
	});

	var Campus = Backbone.Model.extend({

		initialize: function(options) {
			var campus = settings.getCampus(options.campusName);
			this.set("campus", campus);

			var search = options.meta;
			this.set("search", search);
		}
	});

	/**
	 * - displayOptions
	 * - featureCollection
	 * - category
	 * - hasSimilarsCallback
	 */
	var CampusMapModel = Backbone.Model.extend({});

	var CampusMapCollection = Backbone.Collection.extend({

		initialize: function(models, options) {
			this.geo = options.geo;
			this.campus = options.campus;
		},

		fetch: function(options) {
			options = options || {};

			var success = _.bind(function() {
				if (options.success) options.success.call(options.context, this, undefined, options);
				this.trigger("sync", this, undefined, options);
			}, this);

			var error = _.bind(function() {
				if (options.error) options.error.call(options.context, this, undefined, options);
				this.trigger("error", this, undefined, options);
			}, this);

			var fetchSuccess = _.bind(function() {
				var campus = this.campus;
				var data = this.geo.filter(function(element) { return element.get("campus") === campus; });

				var insertCategory = _.bind(function(categoryName) {
					var categoryData = getGeoByCategory(data, categoryName);
					var options = settings.options[categoryName];
					var category = categoryName;
					var campus = this.campus;

					var model = new CampusMapModel({displayOptions: options, featureCollection: categoryData, category: category, hasSimilarsCallback: hasSimilarLocations(campus)});

					if (model.get("featureCollection")) {
						this.add(model);
					}
				}, this);

				insertCategory(terminals);
				insertCategory(institutes);
				insertCategory(canteens);
				insertCategory(parking);
				insertCategory(associateinstitutes);
				insertCategory(student);
				insertCategory(sport);

				success();
			}, this);

			this.geo.fetch({success: fetchSuccess, error: error});
		}
	});

	var CampusMapView = Backbone.View.extend({

		initialize: function () {
			this.listenToOnce(this.collection, "sync", this.render);
			this.collection.fetch();
		},

		render: function() {
			var url = this.model.get("campus");

			this.$el.append("<div data-role='searchablemap'></div>");
			this.$el.trigger("create");

			this.$("div[data-role='searchablemap']").searchablemap({ onSelected: onItemSelected, categoryStore: categoryStore });
			this.$("div[data-role='searchablemap']").searchablemap("pageshow", url.center);

			// Add map objects
			this.collection.each(function(model) {
				this.$("div[data-role='searchablemap']").searchablemap("insertSearchableFeatureCollectionObject", model);
			}, this);

			// Set search value
			var search = this.model.get("search");
			if (search !== undefined) {
				searchView.setSearchValue(search);
				$("div[data-role='searchablemap']").searchablemap("viewByName", search);
			}
		}
	});

	function drawSelectedCampus(options) {
		var uniqueDivId = _.uniqueId("id_");
		clearMenu(uniqueDivId);

		lastFinderId = uniqueDivId;
		lastCampus = options.campusName;

		var model = new Campus(options);
		var collection = new CampusMapCollection([], {geo: geo, campus: model.get("campus").campus});
		new CampusMapView({el: $("#" + uniqueDivId), collection: collection, model: model});
	}

	function clearMenu(uniqueDivId) {
		$("#currentCampus").empty().append("<div id=\"" + uniqueDivId + "\"></div>");
	}

	function onItemSelected(selection) {
		searchView.setSearchValue(selection);
		searchView.hideAllItems();
		// $("div[data-role='searchablemap']").searchablemap("viewByName", selection);
	}

	function getGeoByCategory(data, category) {
		var result = _.chain(data)
					.filter(function(element) { return element.get("category") === category; })
					.first()
					.value();
		if (result) {
			return result.get("geo");
		} else {
			return undefined;
		}
	}

	function hasSimilarLocations(campus) {
		return function(id) {
			var entry = geo.findEntryById(id);
			var similarHouses = geo.findHouseNumberOnOtherCampuses(entry.geo.properties.Name, campus);
			var similarDescriptions = geo.findDescriptionOnOtherCampuses(entry.geo.properties.description, campus);

			return similarHouses.length + similarDescriptions.length > 0;
		};
	}

	function CategoryStore() {

		var store = {};

		this.isVisible = function(category) {
			if (store[category] === undefined) {
				return true;
			}
			return store[category];
		};

		this.setVisibility = function(category, show) {
			store[category] = show;
		};
	}

	var SimilarLocationsView = Backbone.View.extend({

		render: function() {
			this.$el.empty();
			this.$el.append("<ul id='similarlocations' data-role='listview' data-icon='arrow-darkblue' style='padding-left:16px; margin-bottom:5px;margin-top:5px;'></ul>");
			this.$el.append("<button data-theme='a' onclick='app.currentView.sitemapReset();'>Zurück</button>");
			this.$el.trigger("create");

			_.each(this.collection, function(item) {
				$("#similarlocations").append("<li><a href='#' onclick='event.preventDefault(); app.currentView.sitemapNavigateTo(\"" + item.geo.properties.id + "\");'>" + item.geo.properties.Name + " (" + item.campus + ")</a></li>");
			});

			$("#similarlocations").listview("refresh");
		}
	});

	function findSimilarLocations(id) {
		var entry = geo.findEntryById(id);
		var similarHouses = geo.findHouseNumberOnOtherCampuses(entry.geo.properties.Name, lastCampus);
		var similarDescriptions = geo.findDescriptionOnOtherCampuses(entry.geo.properties.description, lastCampus);

		var similars = similarHouses.concat(similarDescriptions);
		similars = _.uniq(similars, false, function(item) {
			if (item && item.geo && item.geo.properties)
				return item.geo.properties.id;
			else
				return item.data;
		});

		return similars;
	}

	function searchSimilarLocations(id) {
		var similars = findSimilarLocations(id);
		var el =  $("#" + lastFinderId);

		var host = new SimilarLocationsView({el: el, collection: similars});
		host.render();
	}

	function sitemapReset() {
		$("div[data-role='campusmenu']").campusmenu("changeTo", lastCampus);
	}

	function sitemapNavigateTo(id) {
		var entry = geo.findEntryById(id);
		$("div[data-role='campusmenu']").campusmenu("changeTo", entry.campus, entry.geo.properties.Name);
	}

	var SearchView = Backbone.View.extend({

		initialize: function(options) {
			this.query = options.query;
			this.children = options.children;
		},

		setSearchValue: function(search, updateView) {
			$(this.query).val(search);
			if (updateView) {
				$(this.query).trigger("keyup");
			}
		},

		hideAllItems: function() {
			var host = $(this.children);
			$("li", host).removeClass("ui-first-child").remove("ui-last-child").addClass("ui-screen-hidden");
		}
	});

	var GeoBlock = Backbone.Model.extend({

		initialize: function() {
			this.insertId(this.get("geo"));
		},

		/**
		 * Inserts IDs into the properties objects of the given parameter.
		 *
		 * The expected structure is:
		 * "geo": {
		 *     features: [ {
		 *         "properties": {
		 *             "Name": ...,
		 *             "description": ...
		 *         }
		 *     } ]
		 * }
		 */
		insertId: function(geo) {
			_.each(geo.features, function(feature) {
				feature.properties.id = _.uniqueId();
			});
		}
	});

	var GeoCollection = Backbone.Collection.extend({
		url: "js/geojson/campus-geo.json",
		model: GeoBlock,

		initialize: function() {
			this.listenTo(this, "error", this.failed);
		},

		failed: function(error) {
			new utils.ErrorView({el: '#error-placeholder', msg: 'Die Daten konnten nicht geladen werden.', module:'sitemap', err: error});
		}
	});

	var SearchableGeoCollection = GeoCollection.extend({

		findHouseNumberOnOtherCampuses: function(house, currentCampus) {
			return this.chain()
						.filter(function(item) { return item.get("campus").toLowerCase() != currentCampus.toLowerCase(); })
						.map(function(item) {
							return _.chain(item.get("geo").features)
									.filter(function(feature) { return feature.properties.Name == house; })
									.map(function(feature) { return _.extend(_.clone(item.attributes), {geo: feature}); })
									.value();
						})
						.flatten()
						.value();
		},

		findDescriptionOnOtherCampuses: function(search, currentCampus) {
			return this.chain()
						.filter(function(item) { return item.get("campus").toLowerCase() != currentCampus.toLowerCase(); })
						.map(function(item) {
							return _.chain(item.get("geo").features)
									.filter(function(feature) { return (feature.properties.description || "").indexOf(search) !== -1; })
									.map(function(feature) { return _.extend(_.clone(item.attributes), {geo: feature}); })
									.value();
						})
						.flatten()
						.value();
		},

		findEntryById: function(id) {
			return this.chain()
						.map(function(item) {
							return _.chain(item.get("geo").features)
									.filter(function(feature) { return feature.properties.id == id; })
									.map(function(feature) { return _.extend(_.clone(item.attributes), {geo: feature}); })
									.value();
						})
						.flatten()
						.first()
						.value();
		}
	});

	var geo = new SearchableGeoCollection();
	
	app.views.SitemapIndex = Backbone.View.extend({

		initialize: function(){
			this.template = rendertmpl('sitemap');
			this._loadMap();
		},

		_loadMap: function() {
			$.getScript('https://www.google.com/jsapi').done(function(){
				google.load('maps', '3', {other_params: 'sensor=false', callback: function(){
					settings.url.griebnitzsee.center = new google.maps.LatLng(52.39345677934452, 13.128039836883545);
					settings.url.neuespalais.center = new google.maps.LatLng(52.400933, 13.011653);
					settings.url.golm.center = new google.maps.LatLng(52.408716, 12.976138);

					oneSidedGuard.disableBlock();
				}});
			}).fail(function(){
				new utils.ErrorView({el: '#error-placeholder', msg: 'Es ist ein Fehler aufgetreten wahrscheinlich besteht keine Internetverbindung.', module:'sitemap'});
			});
		},

		render: function(){
			this.$el = this.page;
			this.$el.html(this.template({}));
			$("div[data-role='campusmenu']").campusmenu({ onChange: function(options) { oneSidedGuard.callMultiple(options); } }).campusmenu("pageshow");
			$('#sitemaps-settings').panel().trigger('create');
			return this;
		},
		afterRender: function(){
			$('#header-settings-btn').click(function(){
				$('#sitemaps-settings').panel("toggle");
			});
		},

		searchSimilarLocations: function(id) {
			searchSimilarLocations(id);
		},

		sitemapReset: function() {
			sitemapReset();
		},

		sitemapNavigateTo: function(id) {
			sitemapNavigateTo(id);
		}
	});


	app.views.SitemapPage = Backbone.View.extend({
		attributes: {"id": 'sitemap'},

		initialize: function(){
		},

		render: function(){
			$(this.el).html('');
			return this;
		}
	});

	return app.views; //SitemapPageView;
});
