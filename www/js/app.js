var app = {models:{},views:{},controllers:{}};
define([
	'jquery',
	'underscore',
	'backbone',
	'backboneMVC',
	'underscore.string',
	'utils',
	'q',
	'fastclick',
	'Session',
	'history',
	'i18next',
	'i18next-xhr-backend',
	'viewContainer',
	'controllerLoader',
	'jquerymobile',
	'datebox',
	'LocalStore'
	], function($, _, Backbone, BackboneMVC, _str, utils, Q, FastClick, Session, customHistory, i18n, Backend, ViewHelper, controllerLoader){
		var viewContainer = ViewHelper.viewContainer;
		viewContainer.initialize();
		var pageContainer = ViewHelper.pageContainer;

		//AppRouter-Klasse erstellen
		var AppRouter = BackboneMVC.Router.extend({
			before:function(route){ //wird komischerweise nur ausgeführt, wenn zurücknavigiert wird. Und genau dafür wird diese Funktion benutzt.
				window.backDetected = true;
			}
		});


		_.extend(app, {
			authUrls: [
				"https://api.uni-potsdam.de/endpoints/roomsAPI",
				"https://api.uni-potsdam.de/endpoints/libraryAPI",
				"https://api.uni-potsdam.de/endpoints/pulsAPI",
				"https://api.uni-potsdam.de/endpoints/moodleAPI",
				"https://api.uni-potsdam.de/endpoints/transportAPI/1.0/",
				"https://api.uni-potsdam.de/endpoints/errorAPI",
				"https://api.uni-potsdam.de/endpoints/personAPI",
				"https://api.uni-potsdam.de/endpoints/mensaAPI",
				"https://api.uni-potsdam.de/endpoints/staticContent"],
			router : new AppRouter(), //Router zuweisen
			viewManager: viewContainer,
			/*
			* Intitialisierung
			*/

			initialize: function(){

				i18n.init({
			        lng: 'de',
			        debug: true,
			        fallbackLng: false,
			        resources: {
			            en: {
			                translation: {
			                    "lang": {
			                        "en": "English",
			                        "fr": "French",
			                        "de": "German",
			                        "ru": "Russian",
			                        "pt": "Portuguese",
			                        "it": "Italian",
			                        "uk": "Ukrainian",
			                        "nl": "Dutch language",
			                        "choose": "Choose Language",
			                    },

			                    "weekdays": {
			                        "word next": { // The Russian language seems to use other words for next for some weekdays.
			                            "su": "next",
			                            "mo": "next",
			                            "tu": "next",
			                            "we": "next",
			                            "th": "next",
			                            "fr": "next",
			                            "sa": "next",
			                        }
			                    },
			                    "texts": {
			                        "filter": {
			                            "none": "Do not apply any filters",
			                            "error": "Error and warning messages",
			                            "warnOnly": "Warnings only",
			                            "errorOnly": "Error only",
			                            "open": "Only facilities which are open now",
			                            "unknown": "Only facilities which might be open now",
			                            "closed": "Only facilities which are closed now",
			                            "openOrUnknown": "Only facilities which are open or unknown now",
			                        },
			                        "title": "opening_hours evaluation tool",
			                        "open always": "Facility is always open",
			                        "unknown always": "Facility is always maybe open",
			                        "closed always": "Facility is always closed in the (near) future",
			                        "open now": "Facility is now open",
			                        "unknown now": "Facility might be open now",
			                        "closed now": "Facility is now closed",
			                        "will close": "but <a href=\"__href__\">will</a> close __timestring____comment__.",
			                        "will unknown": "but <a href=\"__href__\">will</a> maybe open __timestring____comment__.",
			                        "will open": "but <a href=\"__href__\">will</a> open __timestring____comment__.",
			                        "depends on": ", but that depends on __comment__.",
			                        "week stable": "Schedule is valid in any given week.",
			                        "not week stable": "Attention! This schedule might change for other weeks.",
			                        "value for": "value for",
			                        "value to compare": "value to compare to the first value",
			                        "MatchingRule": "Applied rule",
			                        "prettified value": 'prettified opening_hours value (this value can be safely used in OSM, after all warnings have been <a href="__copyFunc__">solved</a>)',
			                        "prettified value for displaying": "prettified opening_hours value for displaying (including newlines, do not use this as value for OSM)",
			                        "more information": "For more information you can check out the <a __href__>OSM wiki</a>.",
			                        "this website": "This website and the JavaScript library used for the evaluation of opening hours are developed on <a href=\"__url__\" target=\"_blank\">__hoster__</a>.",
			                        "if PH is between Mo and Fr": "Only if the public holiday is a weekday (Mo-Fr)",
			                        "check out error correction, prettify": "check out the error correction and the prettify function for the opening_hours value",
			                        "SH,PH or PH,SH": "This makes a small difference compared to the previous value. The name of the school holidays will override the PH names in the comment.",
			                        "config POIs": "configure POIs",
			                        "reload map": "reload map",
			                        "heading map": "Map with layer for the tag opening_hours based on OpenStreetMap",
			                        "map is showing": 'This map is showing objects with the tag <a rel="external" href="__wikiUrl__">opening_hours</a> as colored circles:',
			                        "error": "The value could not be parsed",
			                        "warning": "If there appeared warnings during evaluation, a blue __sign__ will show up in the status icon.",
			                        "map filter": "There are a few filters which can be applied to find and fix mistakes (QA) or to just display open or closed facilities:",
			                        "data source": 'The overlay data comes from __OSMStartaTag__ and is queried using the __APIaTag__. The map is __OSMaTag__.',
			                        "mode 0": 'Only time ranges are accepted (tags opening_hours, lit)',
			                        "mode 1": 'Only points in time are accepted',
			                        "mode 2": 'Time ranges and points in time are accepted (tags service_times, collection_times)',
			                        "value to long for osm": 'The value is too long for OSM. The OpenStreetMap database is currently limited to values with up to __maxLength__ characters. The prettified value has a length of __pretLength__ and the value you entered is __valLength__ characters long',
			                        "low zoom level": 'The POIs will start to appear at zoom level ${next} and above. You are currently on zoom level ${actual}.',
			                        "all n entries": 'All __total__ entries:',
			                        "the first entries": 'The first __number__ of __total__ entries:',
			                        "load all with JOSM": 'load all in JOSM',
			                        "evaluation tool": 'evaluation tool',
			                        "rule separator ;": 'rule separator (the next rule will be a normal rule)',
			                        "rule separator  ||": 'rule separator (the next rule will be a fallback rule which applies for any time not handled by previous rules)',
			                        "rule separator ,": 'rule separator (the next rule will be a additional rule which extends the times of previous rules and does not override them like normal rules would do)',
			                        "JOSM remote conn error": 'Could not connect to JOSM. Please make sure that JOSM is running and is configured for remote control on the default tcp port 8111.',
			                        "refer to yohours": 'This value can also be parsed by YoHours which is a simple editor for the opening_hours syntax. If you don’t need advanced features of the syntax, <a href=\"__href__\">give it a try</a>.',
			                    },
			                    "words": {
			                        "modifier": "__name__ modifier",
			                        "selector": "__name__ selector",
			                        "mode": "evaluation mode",
			                        "green": "green",
			                        "yellow": "yellow",
			                        "red": "red",
			                        "violet": "violet",
			                        "to": "to",
			                        "and": "and",
			                        "no": "no",
			                        "undefined": "undefined",
			                        "his": "his",
			                        "docu": "documentation",
			                        "of course": "of course",
			                        "open": "open",
			                        "unknown": "unknown",
			                        "closed": "closed",
			                        "comment": "comment",
			                        "today": "today",
			                        "tomorrow": "tomorrow",
			                        // "on weekday": "on", // not needed in this context
			                        "on weekday": " ",
			                        "in duration": "in",
			                        "region": "region",
			                        "position": "position",
			                        "lat": "latitude",
			                        "lon": "longitude",
			                        "country": "country",
			                        "state": "state",
			                        "status": "status",
			                        "examples": "Examples",
			                        "none": "none",
			                        "date": "date",
			                        "time": { // __count__ Can not cover need for Russian language (one, several, many).
			                            "minute": "minute",
			                            "minute_plural": "minutes",
			                            "minute many": "minutes",
			                            "hour": "hour",
			                            "hour_plural": "hours",
			                            "hour many": "hours",
			                            "day": "day",
			                            "day_plural": "days",
			                            "day many": "days",
			                            "year": "year",
			                            "year_plural": "years",
			                            "years many": "years",
			                            "hours minutes sep": "and ",
			                            "now": "now",
			                            "time": "time",
			                        },
			                    },
			                },
			            }, // }}}

			            // Dutch (nl) localization {{{
			            nl: {
			                translation: {
			                    "lang": {
			                        "en": "Engels",
			                        "fr": "Frans",
			                        "de": "Duits",
			                        "ru": "Russisch",
			                        "pt": "Portugees",
			                        "it": "Italiaans",
			                        "uk": "Oekraïens",
			                        "nl": "Nederlands",
			                        "choose": "Kies taal",
			                    },

			                    "weekdays": {
			                        "word next": { // The Russian language seems to use other words for next for some weekdays.
			                            "su": "volgende",
			                            "mo": "volgende",
			                            "tu": "volgende",
			                            "we": "volgende",
			                            "th": "volgende",
			                            "fr": "volgende",
			                            "sa": "volgende",
			                        }
			                    },
			                    "texts": {
			                        "filter": {
			                            "none": "Geen filters toepassen",
			                            "error": "Fouten en waarschuwingen",
			                            "warnOnly": "Enkel waarschuwingen",
			                            "errorOnly": "Enkel foutboodschappen",
			                            "open": "Enkel zaken die nu open zijn",
			                            "unknown": "Enkel zaken die nu mogelijks open zijn",
			                            "closed": "Enkel zaken die nu gesloten zijn",
			                            "openOrUnknown": "Enkel zaken die nu open zijn of die mogelijks open zijn",
			                        },
			                        "title": "opening_hours Evaluatie Gereedschap",
			                        "open always": "Zaak is altijd open",
			                        "unknown always": "Zaak is waarschijnlijk altijd open",
			                        "closed always": "Zaak is altijd gesloten in de (nabije) toekomst",
			                        "open now": "Zaak is nu open",
			                        "unknown now": "Zaak zou nu open kunnen zijn",
			                        "closed now": "Zaak is nu gesloten",
			                        "will close": "maar <a href=\"__href__\">zal</a> sluiten op __timestring____comment__.",
			                        "will unknown": "maar <a href=\"__href__\">zal</a> misschien open zjn op __timestring____comment__.",
			                        "will open": "maar <a href=\"__href__\">zal</a> openen op __timestring____comment__.",
			                        "depends on": ", maar hangt af van __comment__.",
			                        "week stable": "Openingsuren zijn altijd geldig.",
			                        "not week stable": "Opegelet! Openingsuren kunnen wijzigen afhankelijk van de gekozen week.",
			                        "value for": "waarde voor",
			                        "value to compare": "waarde om te vergelijken met de eerste waarde",
			                        "MatchingRule": "Toegepaste regel",
			                        "prettified value": 'Mooi gemaakte opening_hours waarde (deze waarde kan zonder problemen in OSM gebruikt worden, nadat alle waarschuwingen zijn  <a href="__copyFunc__">weggewerkt</a>)',
			                        "prettified value for displaying": "Mooi gemaakte opening_hours waarde om op het scherm te tonen (bevat verschillende lijnen, gebruik dit niet als waarde voor OSM)",
			                        "more information": "Voor meer informatie, raadpleef de <a __href__>OSM wiki</a>.",
			                        "this website": "Deze website en de JavaScript library die gebruikt wordt voor de evaluatie zijn ontwikkeld op <a href=\"__url__\" target=\"_blank\">__hoster__</a>.",
			                        "if PH is between Mo and Fr": "Enkel als de feestdag op een weekdag valt (Ma-Vr)",
			                        "check out error correction, prettify": "controleer de fout correctie en de mooi maak functie voor de opening_hours waarde",
			                        "SH,PH or PH,SH": "Dit maakt een klein verschil met de vorige waarde. De naam van de vrije schooldagen zal de namen van de feestdagen in de commentaar overschrijven.",
			                        "config POIs": "configureer POIs",
			                        "reload map": "herlaad kaart",
			                        "heading map": "Kaart met laag voor de opening_hours tag op on OpenStreetMap",
			                        "map is showing": 'Deze kaart toont de object met tag <a rel="external" href="__wikiUrl__">opening_hours</a> als gekleurde cirkels:',
			                        "error": "De waarde kon niet ontleed worden",
			                        "warning": "Indien er waarschuwingen getoond werden tijden de evaluatie, zal een blauw __sign__ getoond worden in het status icoon.",
			                        "map filter": "Er zijn een aantal filters die kunnen toegepast worden om fouten te vinden en te verbeteren (QA) of gewoon om gesloten of open zaken te tonen:",
			                        "data source": 'De overlay gegevens komen van __OSMStartaTag__ en is bevraagd met __APIaTag__. De kaart is __OSMaTag__.',
			                        "mode 0": 'Alleen tijdsperioden zijn toegestaan (zoals bij de tags opening_hours, lit)',
			                        "mode 1": 'Individuele tijdspunten zijn toegestaan',
			                        "mode 2": 'Zowel tijdsperioden als individuele tijdspunten zijn toegestaan (zoals bij de tags service_times, collection_times)',
			                        "value to long for osm": 'De waarde is te lang voor OSM. De OpenStreetMap databank is momenteel beperkt tot waardes met __maxLength__ karakter. De mooi gemaakte waarde heeft een lengte van __pretLength__ en de ingevoerde waarde is __valLength__ karakters lang',
			                        "low zoom level": 'De POIs verschijnen vanaf zoomniveau ${next}. U bent momenteel op zoomniveau ${actual}.',
			                        "all n entries": 'Alle resultaten (__total__):',
			                        "the first entries": 'De eerste __number__ van __total__ resultaten:',
			                        "load all with JOSM": 'laad alles in JOSM',
			                        "evaluation tool": 'evaluatie gereedschap',
			                        "rule separator ;": 'scheidingsteken voor regel (de volgende regel zal een normale regel zijn)',
			                        "rule separator  ||": 'scheidingsteken voor regel (de volgende regel will be a fallback rule which applies for any time not handled by previous rules)',
			                        "rule separator ,": 'scheidingsteken voor regel (de volgende regel is aanvullende regel die de tijden van de vorige regels uitbreid. De volgende regel overschrijft de vorige regels dus niet (zoals een normale regel wel doet)',
			                        "JOSM remote conn error": 'Kan niet connecteren met JOSM. Controleer aub dat  JOSM is opgestart en geconfigureerd is voor afstandbediening via de standaard tcp port 8111.',
			                        "refer to yohours": 'Deze waarde kan ook geïnterpreteerd worden door YoHours. Dit is een eenvoudige editor voor de opening_hours syntax.  Indien je de geavanceerde mogelijkheden van de syntax niet nodig hebt, <a href=\"__href__\">probeer YoHours dan eens</a>.',
			                    },
			                    "words": {
			                        "modifier": "__name__ wijziger (modifier)",
			                        "selector": "__name__ keuzeschakelaar (selector)",
			                        "mode": "evaluatie modus",
			                        "green": "groen",
			                        "yellow": "geel",
			                        "red": "rood",
			                        "violet": "violet",
			                        "to": "tot",
			                        "and": "en",
			                        "no": "nee",
			                        "his": "zijn",
			                        "docu": "documentatie",
			                        "of course": "natuurlijk",
			                        "open": "open",
			                        "unknown": "onbekend",
			                        "closed": "gesloten",
			                        "comment": "commentaar",
			                        "today": "vandaag",
			                        "tomorrow": "morgen",
			                        // "on weekday": "on", // not needed in this context
			                        "on weekday": " ",
			                        "in duration": "in",
			                        "region": "regio",
			                        "position": "positie",
			                        "lat": "latitude",
			                        "lon": "longitude",
			                        "country": "land",
			                        "state": "staat",
			                        "status": "status",
			                        "examples": "Voorbeelden",
			                        "none": "geen",
			                        "date": "datum",
			                        "time": { // __count__ Can not cover need for Russian language (one, several, many).
			                            "minute": "minuut",
			                            "minute_plural": "minuten",
			                            "minute many": "minuten",
			                            "hour": "uur",
			                            "hour_plural": "uren",
			                            "hour many": "uren",
			                            "day": "dag",
			                            "day_plural": "dagen",
			                            "day many": "dagen",
			                            "year": "jaar",
			                            "year_plural": "jaren",
			                            "years many": "jaren",
			                            "hours minutes sep": "en ",
			                            "now": "nu",
			                            "time": "tijd",
			                        },
			                    },
			                },
			            }, // }}}

			            // French (fr) localization {{{
			            fr: {
			                translation: {
			                    "lang": {
			                        "en": "Anglais",
			                        "fr": "Français",
			                        "de": "Allemand",
			                        "ru": "Russe",
			                        "pt": "Portugais",
			                        "it": "Italien",
			                        "uk": "Ukrainien",
			                        "choose": "Choisissez la langue",
			                    },

			                    "weekdays": {
			                        "word next": { // The Russian language seems to use other words for next for some weekdays.
			                            "mo": "prochain",
			                            "tu": "prochain",
			                            "we": "prochain",
			                            "th": "prochain",
			                            "fr": "prochain",
			                            "sa": "prochain",
			                            "su": "prochain",
			                        }
			                    },
			                    "texts": {
			                        "filter": {
			                            "none": "Do not apply any filters",
			                            "error": "Messages d'erreur et d'avertissement",
			                            "warnOnly": "Seulement les avertissements",
			                            "errorOnly": "Seulement les erreurs",
			                            "open": "Seulement les installations ouvertes en ce moment",
			                            "unknown": "Seulement les installations indéterminées en ce moment",
			                            "closed": "Seulement les installations fermées en ce moment",
			                            "openOrUnknown": "Seulement les installations ouvertes ou indéterminées en ce moment",
			                        },
			                        "open always": "L'installation est ouverte en permanence",
			                        "unknown always": "L'installation est peut-être ouverte en permanence",
			                        "closed always": "L'installation est fermée en permanence (à court terme)",
			                        "open now": "L'installation est ouverte en ce moment",
			                        "unknown now": "L'installation est indéterminée en ce moment",
			                        "closed now": "L'installation est fermée en ce moment",
			                        "will close": "mais <a href=\"__href__\">va</a> fermer __timestring____comment__.",
			                        "will unknown": "mais <a href=\"__href__\">va</a> peut-être ouvrir __timestring____comment__.",
			                        "will open": "mais <a href=\"__href__\">va</a> ouvrir __timestring____comment__.",
			                        "depends on": ", mais cela dépend de __comment__.",
			                        "week stable": "L'horaire est valable dans n'importe quelle semaine donnée.",
			                        "not week stable": "Attention ! Cet horaire peut changer pour les autres semaines.",
			                        "value for": "valeur pour",
			                        "MatchingRule": "Sous-chaîne utilisée par la règle appliquée",
			                        "prettified value": 'valeur opening_hours embellie (cette valeur peut être utilisée en toute sécurité dans OSM, après que tous les avertissements aient été <a href="__copyFunc__">corrigés</a>)',
			                        "prettified value for displaying": "valeur opening_hours embellie pour l'affichage (inclut des sauts de ligne, ne pas l'utiliser comme valeur pour OSM)",
			                        "more information": "Pour plus d'informations vous pouvez consulter le <a __href__>wiki OSM</a>.",
			                        "this website": "Ce site web et la bibliothèque JavaScript utilisée pour l'évaluation des horaires d'ouverture sont développés sur <a href=\"__url__\" target=\"_blank\">__hoster__</a>.",
			                        "if PH is between Mo and Fr": "Seulement si le jour férié est un jour de semaine (lundi-vendredi)",
			                        "check out error correction, prettify": "consultez la correction d'erreur et la fonction prettify pour la valeur de opening_hours",
			                        "SH,PH or PH,SH": "Ceci donne un petit écart par rapport à la valeur précédente. Le nom des vacances scolaires remplace les noms des jours fériés dans le commentaire.",
			                        "config POIs": "configurer les POIs",
			                        "reload map": "rafraîchir la carte",
			                        "heading map": "Carte avec calque pour le tag opening_hours basée sur OpenStreetMap",
			                        "map is showing": 'cette carte affiche les nœuds portant le tag <a rel="external" href="__wikiUrl__">opening_hours</a> comme des cercles colorés :',
			                        "error": "La valeur n'a pas pu être analysée",
			                        "warning": "S'il y a eu des avertissements lors de l'évaluation, un __sign__ bleu s'affichera dans l'icône d'état.",
			                        "map filter": "Il ya quelques filtres qui peuvent être appliqués pour trouver et corriger les erreurs (AQ) ou pour afficher seulement les installations ouvertes ou fermées:",
			                        "data source": "Les données en superposition viennent de __APIaTag__. La carte est __OSMaTag__.",
			                        "mode 0": "Seuls les intervalles de temps sont acceptés (tags opening_hours, lit)",
			                        "mode 1": "Seuls les points dans le temps sont acceptés",
			                        "mode 2": "Les plages horaires et les points dans le temps sont acceptés (tags service_times, collection_times)",
			                        "value to long for osm": "La valeur est trop longue pour OSM. La base de données OpenStreetMap est actuellement limitée à des valeurs d'un maximum de __maxLength__ caractères. La valeur embellie a une longueur de __pretLength__ et la valeur que vous avez entrée comporte __valLength__ caractères",
			                        "low zoom level": 'Les POIs vont commencer à apparaître au niveau de zoom ${next} et au-delà. Vous êtes actuellement au niveau de zoom ${actual}.',
			                        "all n entries": "Ensemble des __total__ entrées :",
			                        "the first entries": "Les __number__ premières entrées sur __total__ :",
			                        "refer to yohours": "Cette valeur peut également s'afficher dans YoHours, un éditeur simple d'horaires d'ouverture. Si vous n'utilisez pas les fonctionnalités avancées de la syntaxe, <a href=\"__href__\">vous pouvez l'essayer ici</a>.",
			                    },
			                    "words": {
			                        "mode": "mode d'évaluation",
			                        "green": "vert",
			                        "yellow": "jaune",
			                        "red": "rouge",
			                        "violet": "violet",
			                        "to": "à",
			                        "and": "et",
			                        "no": "pas de",
			                        "his": "son",
			                        "docu": "documentation",
			                        "of course": "bien sûr",
			                        "open": "ouvert",
			                        "unknown": "indéterminé",
			                        "closed": "fermé",
			                        "comment": "commentaire",
			                        "today": "aujourd'hui",
			                        "tomorrow": "demain",
			                        // "on weekday": "on", // not needed in this context
			                        "on weekday": " ",
			                        "in duration": "dans",
			                        "region": "région",
			                        "position": "emplacement",
			                        "lat": "latitude",
			                        "lon": "longitude",
			                        "country": "pays",
			                        "state": "état",
			                        "status": "statut",
			                        "examples": "Exemples",
			                        "none": "aucun",
			                        "date": "date",
			                        "time": { // __count__ Can not cover need for Russian language (one, several, many).
			                            "minute": "minute",
			                            "minute_plural": "minutes",
			                            "minute many": "minutes",
			                            "hour": "heure",
			                            "hour_plural": "heures",
			                            "hour many": "heures",
			                            "day": "jour",
			                            "day_plural": "jours",
			                            "day many": "jours",
			                            "hours minutes sep": "et ",
			                            "now": "en ce moment",
			                            "time": "heure",
			                        },
			                    },
			                },
			            }, // }}}

			            // German (de) localization {{{
			            de: {
			                translation: {
			                    "lang": {
			                        "en": "Englisch",
			                        "fr": "Französisch",
			                        "de": "Deutsch",
			                        "ru": "Russisch",
			                        "pt": "Portugiesisch",
			                        "it": "Italienisch",
			                        "uk": "Ukrainisch",
			                        "choose": "Wähle eine Sprache",
			                    },

			                    "weekdays": {
			                        "word next": {
			                            "su": "nächsten",
			                            "mo": "nächsten",
			                            "tu": "nächsten",
			                            "we": "nächsten",
			                            "th": "nächsten",
			                            "fr": "nächsten",
			                            "sa": "nächsten",
			                        }
			                    },
			                    "texts": {
			                        "filter": {
			                            "none": "Keinen Filter anwenden",
			                            "error": "Fehler und Warnungen",
			                            "warnOnly": "Nur Warnungen",
			                            "errorOnly": "Nur Fehler",
			                            "open": "Nur Einrichtungen welche jetzt geöffnet sind",
			                            "unknown": "Nur Einrichtungen die möglicherweise jetzt geöffnet sind",
			                            "closed": "Nur Einrichtungen die jetzt geschlossen sind",
			                            "openOrUnknown": "Nur Einrichtungen die jetzt geöffnet oder unbekannt sind",
			                        },
			                        "title": "opening_hours Auswertewerkzeug",
			                        "open always": "Die Einrichtung hat immer geöffnet.",
			                        "unknown always": "Die Öffnungszeit der Einrichtung ist immer unbekannt",
			                        "closed always": "Die Einrichtung wird in (naher) Zukunft nicht wieder öffnen.",
			                        "open now": "Die Einrichtung hat jetzt geöffnet",
			                        "unknown now": "Die Einrichtung ist möglicherweise jetzt geöffnet",
			                        "closed now": "Die Einrichtung ist jetzt geschlossen",
			                        "will close": "aber <a href=\"__href__\">wird</a> __timestring__ schließen__comment__.",
			                        "will unknown": "aber <a href=\"__href__\">wird</a> eventuell __timestring__ öffnen__comment__.",
			                        "will open": "aber <a href=\"__href__\">wird</a> __timestring__ öffnen__comment__.",
			                        "depends on": ", abhängig von __comment__.",
			                        "week stable": "Dieser Wochenplan gilt für jede Woche.",
			                        "not week stable": "Achtung! Dieser Wochenplan kann sich in anderen Wochen ändern.",
			                        "value for": "Wert für",
			                        "value to compare": "Wert, der mit dem ersten Wert verglichen werden soll",
			                        "MatchingRule": "Zur Anwendung gekommene Regel",
			                        "prettified value": 'Schön formatierter opening_hours Wert (dieser Wert sollte in OSM verwendet werden, nachdem alle Warnungen <a href="__copyFunc__">beseitigt wurden</a>)',
			                        "prettified value for displaying": "Schön formatierter opening_hours Wert für die Anzeige (mit Zeilenumbrüchen, nicht als Tag für OSM gedacht …)",
			                        "more information": "Für weitere Informationen kannst du dir das <a __href__>OSM-Wiki</a> anschauen.",
			                        "this website": "Die Entwicklung dieser Webseite und der JavaScript-Bibliothek zur Auswertung der Öffnungszeiten findet auf <a href=\"__url__\" target=\"_blank\">__hoster__</a> statt.",
			                        "if PH is between Mo and Fr": "Nur wenn der Feiertag auf einen Wochentag (Mo-Fr) fällt",
			                        "check out error correction, prettify": "Probiere die Fehlererkennung und schau dir den korrigierten opening_hours Wert an",
			                        "SH,PH or PH,SH": "Dieser Wert unterscheidet sich insofern zum vorherigen als dass der Name für Schulferien den Namen von Feiertagen im Kommentar überschreibt, wenn sich diese überlagern",
			                        "config POIs": "POIs konfigurieren",
			                        "reload map": "Karte aktualisieren",
			                        "heading map": "Karte zur Auswertung des Tags opening_hours basierend auf OpenStreetMap",
			                        "map is showing": 'Diese Karte zeigt Objekte mit dem Tag <a rel="external" href="__wikiUrl__">opening_hours</a> als farbige Kreise:',
			                        "error": "Die Öffnungszeit konnte nicht ausgewertet werden",
			                        "warning": "Sollte eine Öffnungszeit beim verarbeiten eine Warnung erzeugen, wird im Status Icon ein blaues __sign__ angezeigt.",
			                        "map filter": "Es gibt mehrere Filter um nur die Öffnungszeiten von Interesse anzuzeigen. Die Hauptgründe für die Verwendung eines Filters ist die Qualitätssicherung oder das finden von offenen Geschäften. Es folgt eine Liste der möglichen Filter:",
			                        "data source": 'Die auszuwertenden Daten stammen aus __OSMStartaTag__ und werden über die __APIaTag__ abgefragt. Die Karte ist __OSMaTag__.',
			                        "mode 0": 'Es werden nur Zeiträume akzeptiert (Tags opening_hours, lit)',
			                        "mode 1": 'Es werden nur Zeitpunkte akzeptiert',
			                        "mode 2": 'Zeiträume und Zeitpunkte werden akzeptiert (Tags service_times, collection_times)',
			                        "value to long for osm": 'Der opening_hours Wert ist zu lang für OSM. Die OpenStreetMap Datenbank unterstützt zur Zeit nur Werte mit bis zu __maxLength__ Zeichen. Der schön formatierte Wert ist __pretLength__ Zeichen lang und der eingegebene Wert __valLength__.',
			                        "low zoom level": 'Die Marker werden erst auf Zoom Stufe ${next} geladen. Aktuelle Zoom Stufe ist ${actual}.',
			                        "all n entries": 'Alle __total__ Einträge:',
			                        "the first entries": 'Die ersten __number__ von __total__ Einträgen:',
			                        "load all with JOSM": 'Alle in JOSM laden',
			                        "evaluation tool": 'Ausführlich testen',
			                        "rule separator ;": 'Begrenzungszeichen für Regeln (es folgt eine normale Regel)',
			                        "rule separator  ||": 'Begrenzungszeichen für Regeln (es folgt eine Oder-Verknüpfte Regel die nur auf Zeiten zutrifft, die nicht bereits von vorherigen Regeln behandelt werden)',
			                        "rule separator ,": 'Begrenzungszeichen für Regeln (es folgt eine additive Regel deren Zeiten vorherige Regeln erweitern und nicht überschreiben wie bei normalen Regeln)',
			                        "JOSM remote conn error": 'Es konnte keine Verbindung zu JOSM aufgebaut werden. Bitte prüfe, ob JOSM ausgeführt wird und Fernsteuerung auf dem Standard tcp Port 8111 erlaubt ist.',
			                        "refer to yohours": 'Dieser Wert kann auch von YoHours verarbeitet werden. YoHours ist ein benutzerfreundlicher Editor für die opening_hours Syntax. Falls keine fortschrittlichen Funktionen der Syntax benötigt werden ist YoHours eine einsteigerfreundliche Alternative. <a href=\"__href__\">Ausprobieren</a>.',
			                    },
			                    "words": {
			                        "modifier": "__name__ Regeleigenschaft",
			                        "selector": "__name__ Bereichsdefinition",
			                        "mode": "Auswerte Modus",
			                        "green": "Grün",
			                        "yellow": "Gelb",
			                        "red": "Rot",
			                        "violet": "Violett",
			                        "to": "bis",
			                        "and": "und",
			                        "no": "kein",
			                        "undefined": "undefiniert",
			                        "his": "seine",
			                        "docu": "Dokumentation",
			                        "of course": "natürlich",
			                        "open": "geöffnet",
			                        "unknown": "unbekannt",
			                        "closed": "geschlossen",
			                        "comment": "Kommentar",
			                        "today": "heute",
			                        "tomorrow": "morgen",
			                        // "on weekday": "on", // not needed in this context
			                        "on weekday": " ",
			                        "region": "Region",
			                        "position": "Position",
			                        "lat": "Breitengrad",
			                        "lon": "Längengrad",
			                        "country": "Land",
			                        "state": "Bundesstaat",
			                        "status": "Status",
			                        "examples": "Beispiele",
			                        "none": "keine",
			                        "date": "Datum",
			                        "time": { // __count__ Can not cover need for Russian language (one, several, many).
			                            "minute": "Minute",
			                            "minute_plural": "Minuten",
			                            "minute many": "Minuten",
			                            "hour": "Stunde",
			                            "hour_plural": "Stunden",
			                            "hour many": "Stunden",
			                            "day": "Tag",
			                            "day_plural": "Tage",
			                            "day many": "Tage",
			                            "year": "Jahr",
			                            "year_plural": "Jahre",
			                            "years many": "Jahre",
			                            "hours minutes sep": "und ",
			                            "now": "Jetzt",
			                            "time": "Zeit",
			                        },
			                    },
			                },
			            }, // }}}

			            // Russian (ru) localization {{{
			            ru: {
			                translation: {
			                    "lang": {
			                        "en": "английский",
			                        "fr": "французский",
			                        "de": "немецкий",
			                        "ru": "русский",
			                        "pt": "португальский",
			                        "it": "итальянский",
			                        "uk": "украинский",
			                        "choose": "Выберите язык",
			                    },

			                    "weekdays": {
			                        "word next": {
			                            "su": "ближайшее",
			                            "mo": "ближайший",
			                            "tu": "ближайший",
			                            "we": "ближайшую",
			                            "th": "ближайший",
			                            "fr": "ближайшую",
			                            "sa": "ближайшую",
			                        },
			                    },
			                    "texts": {
			                        "open always": "Заведение всегда открыто.",
			                        "closed always": "Заведение всегда закрыто.",
			                        "open now": "Сейчас заведение открыто",
			                        "closed now": "Сейчас заведение закрыто",
			                        "will close": "<a href=\"__href__\">Закроется</a> __timestring____comment__.",
			                        "will open": "<a href=\"__href__\">Откроется</a> __timestring____comment__.",
			                        "week stable": "Расписание верно для любой недели.",
			                        "not week stable": "ВНИМАНИЕ! Расписание меняется в другие недели.",
			                        "value for": "значение для",
			                        "MatchingRule": "использовать правила",
			                        "warn error": "об ошибках и предупреждения",
			                    },
			                    "words": {
			                        "green": "зелёный",
			                        "yellow": "жёлтый",
			                        "red": "красный",
			                        "violet": "фиолетовый",
			                        "to": "до",
			                        "and": "и",
			                        "no": "Нет",
			                        "open": "c",
			                        "unknown": "неизвестный",
			                        "closed": "закрыто",
			                        "comment": "комментариев",
			                        "today": "сегодня",
			                        "tomorrow": "завтра",
			                        "on weekday": "в ", // optionally in other languages
			                        "in duration": "через",
			                        "region": "регион",
			                        "position": "положение",
			                        "lat": "широта",
			                        "lon": "долгота",
			                        "country": "страна",
			                        "state": "штат",
			                        "status": "статус",
			                        "examples": "примеры",
			                        "date": "дата",
			                        "none": "никто",
			                        "time": {
			                            "minute": "минуту",
			                            "minute_plural_2": "минуты",
			                            "minute_plural_5": "минут",
			                            "hour": "час",
			                            "hour_plural_2": "часа",
			                            "hour_plural_5": "часов",
			                            "day": "день",
			                            "day_plural_2": "дня",
			                            "day_plural_5": "дней",
			                            "now": "сейчас",
			                            "time": "время",
			                            "hours minutes sep": "и ",
			                        },
			                    },
			                },
			            }, // }}}

			            // Portuguese (pt) localization {{{
			            pt: {
			                translation: {
			                    "lang": {
			                        "en": "Inglês",
			                        "fr": "Francês",
			                        "de": "Alemão",
			                        "ru": "Russo",
			                        "it": "Italiano",
			                        "pt": "Português",
			                        "uk": "Ucraniano",
			                        "choose": "Escolha a sua linguagem",
			                    },

			                    "weekdays": {
			                        "word next": { // palavra "próximo" antes de um dia da semana
			                            "su": "próximo",
			                            "mo": "próxima",
			                            "tu": "próxima",
			                            "we": "próxima",
			                            "th": "próxima",
			                            "fr": "próxima",
			                            "sa": "próximo",
			                        }
			                    },
			                    "texts": {
			                        "filter": {
			                            "none": "Do not apply any filters",
			                            "error": "Mensagens de erro e avisos",
			                            "warnOnly": "Somente avisos",
			                            "errorOnly": "Somente erros",
			                            "open": "Somente lugares que estão aberto agora",
			                            "unknown": "O lugar pode estar aberto agora",
			                            "closed": "Somente lugares que estão fechados agora",
			                            "openOrUnknown": "Somente lugares que estão aberto agora ou que talvez estejam",
			                        },
			                        "open always": "O lugar está sempre aberto",
			                        "unknown always": "Talvez o lugar sempre esteja aberto",
			                        "closed always": "O lugar está fechado e não se sabe quando ele vai reabrir",
			                        "open now": "O lugar está aberto agora",
			                        "unknown now": "O lugar pode estar aberto agora",
			                        "closed now": "O lugar está fechado agora",
			                        "will close": "Mas <a href=\"__href__\">vai</a> fechar __timestring____comment__.",
			                        "will unknown": "Mas talvez <a href=\"__href__\">vá</a> abrir __timestring____comment__.",
			                        "will open": "Mas <a href=\"__href__\">vai</a> abrir __timestring____comment__.",
			                        "depends on": ", Mas isso depende de __comment__.",
			                        "week stable": "O horário é o mesmo toda semana.",
			                        "not week stable": "Atenção! Este horário pode mudar em outras semanas.",
			                        "value for": "Valor para a etiqueta",
			                        "MatchingRule": "\"Substring\" usada pela regra aplicada", //como traduzir?
			                        "prettified value": 'Valor "embelezado" da chave opening_hours (este valor pode ser utilizado no OSM sem problemas depois que todos os avisos tenham sido <a href="__copyFunc__">resolvidos</a>)',
			                        "prettified value for displaying": "Exibição do valor \"embelezado\" da etiqueta \"opening_hours\" (inclui quebras de linha, não use isso como valor no OSM)",
			                        "more information": "Para mais informações, veja a <a __href__>wiki do OSM</a>.",
			                        "this website": "Este sítio e a biblioteca JavaScript usados para a avaliação dos horários de funcionamento são desenvolvidos no <a href=\"__url__\" target=\"_blank\">__hoster__</a>.",
			                        "if PH is between Mo and Fr": "Somente se o feriado for um dia da semana (Mo-Fr)",
			                        "check out error correction, prettify": "Verificar a correção dos erros e embelezar função para o valor da chave \"opening_hours\"",
			                        "SH,PH or PH,SH": "Isso tem uma pequena diferença comparado com o valor anterior. Aqui os nomes dos feriados escolares vão ter prioridade sobre os nomes de outros tipos de feriados nos comentários.",
			                        "config POIs": "Configurar Pontos de Interesse",
			                        "reload map": "Recarregar mapa",
			                        "heading map": "Mapa com uma camada para a etiqueta \"opening_hours\" baseado no OpenStreetMap",
			                        "map is showing": 'este mapa está mostrando como circulos coloridos os pontos que possuem a etiqueta <a rel="external" href="__wikiUrl__">opening_hours</a>:',
			                        "error": "O valor não pode ser analisado",
			                        "warning": "Se apareceram avisos durante a avaliação, um __sign__ azul vai aparecer na barra de estado",
			                        "map filter": "Alguns filtros podem ser aplicados para encontrar e consertar erros (CQ) ou para mostrar somente lugares abertos ou fechados:",
			                        "data source": 'Os dados da camada vem de __APIaTag__. O mapa é __OSMaTag__.',
			                        "mode 0": 'Somente intervalos de tempo são aceitos (etiquetas \"opening_hours\" e \"lit\")',
			                        "mode 1": 'Somente pontos específicos no tempo são aceitos',
			                        "mode 2": 'Intervalos de tempo e pontos específicos no tempo são aceitos (etiquetas \"service_times\" e \"collection_times\")',
			                        "value to long for osm": 'O valor é longo demais para o OSM. O banco de dados do OpenStreetMap atualmente é limitado a valores de até __maxLength__ caracteres. O valor "embelezado" tem um comprimento de __pretLength__ e o valor que você digitou tem __valLength__ caracteres',
			                        "low zoom level": 'Os Pontos de Interesse vão começar a aparecer em um nível de zoom maior ou igual a ${next}. Agora você está no nível de zoom ${actual}.',
			                        "all n entries": 'Todos os __total__ resultados:',
			                        "the first entries": 'Os primeiros __number__ de __total__ resultados:',
			                        "load all with JOSM": 'Carregar tudo no JOSM',
			                        "evaluation tool": 'Derramenta de avaliação',
			                    },
			                    "words": {
			                        "mode": "Modo de avaliação",
			                        "green": "verde",
			                        "yellow": "amarelo",
			                        "red": "vermelho",
			                        "violet": "violeta",
			                        "to": "até",
			                        "and": "e",
			                        "no": "sem",
			                        "his": "dele",
			                        "docu": "documentação",
			                        "of course": "é claro",
			                        "open": "Aberto de",
			                        "unknown": "Desconhecido",
			                        "closed": "Fechado",
			                        "comment": "comentário",
			                        "today": "hoje",
			                        "tomorrow": "amanhã",
			                        // "on weekday": "on", // not needed in this context
			                        "on weekday": " ", // revisar esta
			                        "in duration": "em",
			                        "region": "Região",
			                        "position": "Posição",
			                        "lat": "Latitude",
			                        "lon": "Longitude",
			                        "country": "País",
			                        "state": "Estado",
			                        "status": "Estado",
			                        "examples": "Exemplos", //revisar: maiusculo mesmo?
			                        "none": "nenhum",
			                        "date": "Data",
			                        "time": { // __count__ Can not cover need for Russian language (one, several, many).
			                            "minute": "minuto",
			                            "minute_plural": "minutos",
			                            "minute many": "minutos",
			                            "hour": "hora",
			                            "hour_plural": "horas",
			                            "hour many": "horas",
			                            "day": "dia",
			                            "day_plural": "dias",
			                            "day many": "dias",
			                            "hours minutes sep": "e ",
			                            "now": "Agora",
			                            "time": "tempo",
			                        },
			                    },
			                },
			            }, // }}}

			            // Italian (it) localization {{{
			            it: {
			                translation: {
			                    "lang": {
			                        "en": "Inglese",
			                        "fr": "Francese",
			                        "de": "Tedesco",
			                        "ru": "Russo",
			                        "it": "Italiano",
			                        "pt": "Portoghese",
			                        "uk": "Ucraino",
			                        "choose": "Scegli lingua",
			                    },

			                    "weekdays": {
			                        "word next": { // The italian language use other words for next for sunday.
			                            "mo": "il prossimo",
			                            "tu": "il prossimo",
			                            "we": "il prossimo",
			                            "th": "il prossimo",
			                            "fr": "il prossimo",
			                            "sa": "il prossimo",
			                            "su": "la prossima",
			                        }
			                    },
			                    "texts": {
			                        "filter": {
			                            "none": "Do not apply any filters",
			                            "error": "Messaggi di errore e di avviso",
			                            "warnOnly": "Solo avvertimenti",
			                            "errorOnly": "Solo errori",
			                            "open": "Solo strutture aperte in questo momento",
			                            "unknown": "Solo strutture che potrebbero essere aperte in questo momento",
			                            "closed": "Solo strutture che sono chiuse in questo momento",
			                            "openOrUnknown": "Solo strutture aperte o che potrebbero esserlo in questo momento",
			                        },
			                        "open always": "La struttura è sempre aperta",
			                        "unknown always": "La struttura può essere sempre aperta",
			                        "closed always": "La struttura è sempre chiusa (nel breve termine)",
			                        "open now": "In questo momento la struttura è aperta",
			                        "unknown now": "In questo momento la struttura potrebbe essere aperta",
			                        "closed now": "In questo momento la struttura è chiusa",
			                        "will close": "ma <a href=\"__href__\">sarà</a> chiusa __timestring____comment__.",
			                        "will unknown": "ma <a href=\"__href__\">potrebbe</a> essere aperta __timestring____comment__.",
			                        "will open": "ma <a href=\"__href__\">sarà</a> aperta __timestring____comment__.",
			                        "depends on": ", ma dipende da __comment__.",
			                        "week stable": "L'orario è valido per ogni settimana.",
			                        "not week stable": "Attenzione! Questo orario può variare nelle altre settimane.",
			                        "value for": "valore per",
			                        "MatchingRule": "valore base utilizzato dalla regola corrente",
			                        "prettified value": 'valore per opening_hours ottimizzato (questo valore è valido e può essere utilizzato su OSM, dopo aver <a href="__copyFunc__">risolto</a> tutti gli eventuali errori)',
			                        "prettified value for displaying": "valore per opening_hours ottimizzato per la visualizzazione (contiene dei caratteri di fine riga, non può essere usato come valore su OSM)",
			                        "more information": "Per ulteriori informazioni è possibile consultare il <a __href__>wiki di OSM</a>.",
			                        "this website": "Questo sito internet e la libreria Javascript utlizzata per la validazione degli orari di apertura sono sviluppati su <a href=\"__url__\" target=\"_blank\">__hoster__</a>.",
			                        "if PH is between Mo and Fr": "Solamente se la festività pubblica è un giorno della settimana (da Lunedì a Venerdì)",
			                        "check out error correction, prettify": "Controlla la correzione dell'errore e la funzione di ottimizzazione per il valore di opening_hours",
			                        "SH,PH or PH,SH": "Questo è leggermente diverso da quello precedente. Il nome delle festività scolastiche sovrascriverà quello delle festività pubbliche nei commenti.",
			                        "config POIs": "configura POI",
			                        "reload map": "ricarica mappa",
			                        "heading map": "Mappa con livelli relativi al tag opening_hours basata su OpenStreetMap",
			                        "map is showing": 'questa mappa mostra con dei cerchi colorati i nodi aventi il tag <a rel="external" href="__wikiUrl__">opening_hours</a>:',
			                        "error": "Il valore non può essere analizzato",
			                        "warning": "Se sono presenti degli avvertimenti durante la validazione apparirà una __sign__ blu nell'icona di stato.",
			                        "map filter": "Ci sono alcuni filtri che possono essere applicati per trovare e correggere gli errori o semplicemente per mostrare le strutture aperte o chiuse:",
			                        "data source": 'I dati provengono da __APIaTag__. La mappa è __OSMaTag__.',
			                        "mode 0": 'Solo intervalli di tempo (tag opening_hours, lit)',
			                        "mode 1": 'Solo orari precisi (es. Mo 20:00)',
			                        "mode 2": 'Intervalli di tempo e orari precisi (tag service_times, collection_times)',
			                        "value to long for osm": 'Il valore è troppo lungo per OSM. I valori del database OpenStreetMap sono attualmente limitati a __maxLength__ caratteri. Il valore ottimizzato ha una lunghezza di __pretLength__ e il valore inserito è lungo __valLength__ caratteri.',
			                        "low zoom level": 'I POI cominceranno ad apparire ad un livello di zoom di ${next} e superiore. Il livello di zoom attuale è ${actual}.',
			                        "all n entries": 'Tutti i __total__ risultati:',
			                        "the first entries": 'I primi __number__ di __total__ risultati:',
			                        "load all with JOSM": 'carica tutto in JOSM',
			                        "evaluation tool": 'tool di validazione',
			                    },
			                    "words": {
			                        "mode": "modalità di validazione",
			                        "green": "verde",
			                        "yellow": "giallo",
			                        "red": "rosso",
			                        "violet": "viola",
			                        "to": "a",
			                        "and": "e",
			                        "no": "no",
			                        "his": "suo",
			                        "docu": "documentazione",
			                        "of course": "certamente",
			                        "open": "aperto",
			                        "unknown": "sconosciuto",
			                        "closed": "chiuso",
			                        "comment": "commento",
			                        "today": "oggi",
			                        "tomorrow": "domani",
			                        // "on weekday": "on", // not needed in this context
			                        "on weekday": " ",
			                        "in duration": "tra",
			                        "region": "regione",
			                        "position": "posizione",
			                        "lat": "latitudine",
			                        "lon": "longitudine",
			                        "country": "nazione",
			                        "state": "stato",
			                        "status": "stato",
			                        "examples": "Esempi",
			                        "none": "nessuno",
			                        "date": "data",
			                        "time": { // __count__ Can not cover need for Russian language (one, several, many).
			                            "minute": "minuto",
			                            "minute_plural": "minuti",
			                            "minute many": "minuti",
			                            "hour": "ora",
			                            "hour_plural": "ore",
			                            "hour many": "ore",
			                            "day": "giorno",
			                            "day_plural": "giorni",
			                            "day many": "giorni",
			                            "hours minutes sep": "e ",
			                            "now": "adesso",
			                            "time": "ora",
			                        },
			                    },
			                },
			            }, // }}}

			            // Ukrainian (uk) localization {{{
			            uk: {
			                translation: {
			                    "lang": {
			                        "en": "англійська",
			                        "fr": "французька",
			                        "de": "німецька",
			                        "ru": "російська",
			                        "pt": "португальська",
			                        "it": "италійська",
			                        "uk": "українська",
			                        "choose": "Виберіть мову",
			                    },

			                    "weekdays": {
			                        "word next": {
			                            "su": "наступну",
			                            "mo": "наступний",
			                            "tu": "наступний",
			                            "we": "наступну",
			                            "th": "наступний",
			                            "fr": "наступну",
			                            "sa": "наступну",
			                        },
			                    },
			                    "texts": {
			                        "filter": {
			                            "none": "не використовувати фільтрів",
			                            "error": "про помилки і зауваження",
			                            "warnOnly": "Тільки попередження",
			                            "errorOnly": "Тільки помилки",
			                            "open": "Тільки заходи, що зараз відчинені",
			                            "unknown": "Тільки заходи, що можуть бути зараз відчинені",
			                            "closed": "Тільки заходи, що зараз зачинені",
			                            "openOrUnknown": "Тільки заходи, що зараз відчинені або чий стан невідомий",
			                        },
			                        "open always": "Захід завжди відчинений.",
			                        "closed always": "Захід завжди зачинений.",
			                        "open now": "Зараз захід відчинений",
			                        "closed now": "Зараз захід зачинений",
			                        "will close": "<a href=\"__href__\">Зачиниться</a> __timestring____comment__.",
			                        "will open": "<a href=\"__href__\">Відчинеться</a> __timestring____comment__.",
			                        "will unknown": "але можливо <a href=\"__href__\">відчиниться</a> __timestring____comment__.",
			                        "week stable": "Розклад вірний для всіх тижнів.",
			                        "not week stable": "УВАГА! Розклад змінюється щотижня.",
			                        "value for": "значення для",
			                        "MatchingRule": "використовувати правила",

			                        "unknown always": "Захід може бути завжди відчинений",
			                        "unknown now": "Захід може бути зараз відкритим",
			                        "depends on": ", але це залежить від __comment__.",
			                        "prettified value": 'припустиме значення opening_hours (цей вираз можна безпечно використовувати у OSM, після <a href="__copyFunc__">вирішення</a> всіх зауважень)',
			                        "prettified value for displaying": "'припустиме значення opening_hours для відображення (включає кілька рядків, не використовуйте це значення для OSM)",
			                        "more information": "Для додаткової інформації перейдіть на сторінку <a __href__>OSM wiki</a>.",
			                        "this website": "Цей вебсайт та бібліотека JavaScript, що використовуються для розрахунку часів роботи, розроблена на <a href=\"__url__\" target=\"_blank\">__hoster__</a>.",
			                        "if PH is between Mo and Fr": "Тільки якщо свято у робочий день (Пн-Пт)",
			                        "check out error correction, prettify": "перевірити виправлення помилок та функцію корекції для виразу opening_hours",
			                        "SH,PH or PH,SH": "Цей вираз трохи відрізняється від попереднього. Назва шкільних канікул замінить назви свят у коментарях.",
			                        "config POIs": "налаштувати POI",
			                        "reload map": "перезавантажити мапу",
			                        "heading map": "Мапа з шаром для тегу opening_hours, на основі OpenStreetMap",
			                        "map is showing": 'ця мапа покакзує вузли з тегом <a rel="external" href="__wikiUrl__">opening_hours</a> у вигляді кольорових as colored кіл:',
			                        "error": "Вираз неможливо розпізнати",
			                        "warning": "Якщо Ви отримуєте попередження під час розрахунку, синій __sign__ буде відображений на піктограмі стану.",
			                        "map filter": "Є кілька фільтрів, які можна застосовувати для пошуку і виправлення помилок (QA) або просто відображення відчинених або зачинених заходів:",
			                        "data source": 'Накладені дані взяті з __APIaTag__. Мапа - __OSMaTag__.',
			                        "mode 0": 'Підтримуються тільки часові діапазони (теги opening_hours, lit)',
			                        "mode 1": 'Підтримуються тільки моменти часу',
			                        "mode 2": 'Підтримуються часові діапазони та моменти часу (теги service_times, collection_times)',
			                        "value to long for osm": 'Вираз занадто довгий для OSM. База даних OpenStreetMap на цей час обмежена значеннями до __maxLength__ символів. Прийнятне значення має довжину __pretLength__, а Ваш вираз займає __valLength__ символів',
			                        "low zoom level": "POI почнуть з'являтися на рівні масштабування ${next} та вище. Зараз Ви на ${actual} рівні масштабування.",
			                        "all n entries": 'Усі __total__ записів:',
			                        "the first entries": 'Перші __number__ з __total__ записів:',
			                        "load all with JOSM": "завантажити всі об'єкти з цим виразом у JOSM",
			                        "evaluation tool": 'інструмент розрахунку',
			                    },
			                    "words": {
			                        "to": "до",
			                        "and": "і",
			                        "no": "Нема",
			                        "open": "з",
			                        "unknown": "невідомий",
			                        "closed": "зачинено",
			                        "comment": "коментарів",
			                        "today": "сьогодні",
			                        "tomorrow": "завтра",
			                        "on weekday": "у ", // optionally in other languages
			                        "in duration": "через",
			                        "region": "регіон",
			                        "position": "положення",
			                        "lat": "широта",
			                        "lon": "довгота",
			                        "country": "країна",
			                        "state": "штат",
			                        "status": "статус",
			                        "examples": "приклади",
			                        "none": "відсутні",
			                        "date": "дата",
			                        "time": {
			                            "minute": "хвилину",
			                            "minute_plural_2": "хвилини",
			                            "minute_plural_5": "хвилин",
			                            "hour": "годину",
			                            "hour_plural_2": "години",
			                            "hour_plural_5": "годин",
			                            "day": "день",
			                            "day_plural_2": "дні",
			                            "day_plural_5": "днів",
			                            "hours minutes sep": "та ",
			                            "now": "зараз",
			                            "time": "час",
			                        },
			                        "mode": "режим розрахунку",
			                        "green": "зелений",
			                        "yellow": "жовтий",
			                        "red": "червоний",
			                        "violet": "фіолетовий",
			                        "his": "його",
			                        "docu": "документація",
			                        "of course": "звісно",
			                    },
			                },
			            }
			        }

			    }, (err, t) => {
			      // initialized and ready to go!
			      var hw = i18n.t('key'); // hw = 'hello world'

			    });


				app.session = new Session;
				utils.detectUA($, navigator.userAgent);
				viewContainer.setIosHeaderFix();
				new FastClick(document.body);

				$(document).ready(function() {
  					document.addEventListener("deviceready", onDeviceReady, false);
				});

				/**
				 *	functions get exectuted when device is ready and handles hiding of splashscreen and backButton navigation
				 */
				function onDeviceReady() {
    				// hide splashscreen
    				navigator.splashscreen.hide();
    				// EventListener for BackButton
    				document.addEventListener("backbutton", function(e){
    					if(customHistory.length() == 1){
    						e.preventDefault();
    						navigator.app.exitApp();
    					}else{
							viewContainer.setReverseSlidefadeTransition();
							customHistory.goBack();
    					}
    				}, false);
				}

				// Initialize Backbone override
				$(utils.overrideBackboneSync);

				// Initialize external link override
				$(document).on("click", "a", _.partial(utils.overrideExternalLinks, _, viewContainer.removeActiveElementsOnCurrentPage));

				// Register global error handler
				window.onerror = utils.onError;

				//Globale Events zuordnen
				this.bindEvents();
				//Anwendungsurl ermitteln
				var baseUrl = document.location.pathname.replace(/\/index\.html/, '');
				//Backbone URL-Routing-Funktion starten
				customHistory.startTracking(baseUrl);

				this._gotoEntryPoint();
			},

			_gotoEntryPoint: function() {
				if(!window.location.hash) { //Wenn keine URL übergeben wurde, das Hauptmenü aufrufen
					this.route("main/menu");
				} else { //Sonst aktuelle URL in die app.history aufnehmen
					customHistory.pushSecondHistory(Backbone.history.fragment);
				}
			},

			/**
			* Wrapper für die Backbone route Funktion
			* @param url: zu routende URL
			* @param noTrigger: true: nur url ändern aber nicht Aktion ausführen
            * @param replace
			*/
			route:function(url, noTrigger, replace){
				var trigger = !noTrigger;
				replace = !!replace;
				if(trigger) {
					customHistory.pushSecondHistory(url);
				}
				url = this._cleanUrl(url);
				this.router.navigate(url, {trigger: trigger, replace: replace}); //Url auf Controller routen
			},
			/**
			 * Removes leading # and ensures the right entry point
			 * @param url Raw url
			 * @returns Cleaned url
			 */
			_cleanUrl: function(url) {
				if(url.charAt(0) == '#')
					url = url.slice(1);
				if(url == 'home' || url == '')
					url = 'main/menu';
				return url;
			},
			/*
			* Zur letzten URL zurückwechseln, die in app.history gespeichert ist
			* @noTrigger: Aktion ausführen: false, sonst true
			*/
			previous: function(noTrigger){
                customHistory.executeBack(_.bind(function(previous) {
                    this.route(previous, noTrigger);
                }, this));
			},
			/*
			* Wenn nötig Daten vom Server laden, Seite rendern und Seitenübergang vollführen
			* @c: Controllername
			* @a: Actionsname
			* @url: anzufragende URL oder Objekt mit Daten für den View
			* @transition: Als String: jQueryMobile-Pagetransitionsname (Standard: slide),
						   Oder als Objekt: Parameter für das Rendern des View
			*/
			loadPage: function(c, a, params, transition) {
				params = params || {};
				var q = Q.defer();

				var page = viewContainer.prepareViewForDomDisplay(c, params);

				// FIXME Transition parameter is ignored
				var transitionOptions = {
					page: page,
					extras: {
						c: c,
						a: a,
						page: page,
						params: params,
						q: q
					},
					route: {
						from: customHistory.currentRoute(),
						to: Backbone.history.fragment
					}
				};
				pageContainer.executeTransition(transitionOptions);

				return q.promise;
			},

			/**
			* Globale Events setzen
			*/
			bindEvents:function(){
				var self = this;
				$.ajaxSetup({
					  "error":function() { //Globale AJAX-Fehlerfunktion, wenn z.B. keine Internetverbindung besteht
						  app.locked = false;
						  viewContainer.notifyMissingServerConnection(app);
					  }
				});

				$(document).on('click', 'a[data-rel="back"]', function(){ //Backbutton clicks auf zurücknavigieren mappen
					customHistory.executeWindowBack();
				});
			}
		});

		return app;
});
