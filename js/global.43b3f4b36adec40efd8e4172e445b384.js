
var wtbPortal = wtbPortal || {};

wtbPortal.constants = {};

wtbPortal.constants.MODALOPEN_class          = 'wtb-portal-modal-active';
wtbPortal.constants.MASTERSCREENCONTAINER_class = 'wtb-portal-master-screens-container';
wtbPortal.constants.SCREENCOLLECTIONCONTAINER_class = 'wtb-portal-screens-container';
wtbPortal.constants.SCREENCONTAINER_class    = 'portal-screen-container';
wtbPortal.constants.CLOSEBUTTON_class        = 'close-button-link';
wtbPortal.constants.TOUTLINK_class           = 'tout-link';
wtbPortal.constants.ACTIVE_class             = 'active-portal-screen';
wtbPortal.constants.EXITINGSCREEN_class      = 'exiting-screen';
wtbPortal.constants.SCREENFINISHED_class     = 'screen-finished';
wtbPortal.constants.BACKBUTTON_class         = 'back-button-link';
wtbPortal.constants.BUNDLELINK_class         = 'bundle-select-link';
wtbPortal.constants.PLATFORMLINK_class       = 'wtb-portal-tout-link';
wtbPortal.constants.REGIONCHANGELINK_class   = 'region-change-link';
wtbPortal.constants.TITLECHANGELINK_class    = 'title-change-link';
wtbPortal.constants.REGIONMODAL_class        = 'region-select-modal';
wtbPortal.constants.REOPENSTORETEXT_class    = 'reopen-platform-store-text';
wtbPortal.constants.RELEVANTTOUTS_class      = 'relevant-touts';
wtbPortal.constants.ADDITIONALCONTENT_class  = 'additional-content-container';
wtbPortal.constants.PLATFORMDISCLAIMER_class = 'platform-disclaimers';
wtbPortal.constants.FEATUREITEM_class        = 'feature-item';

wtbPortal.constants.PORTALID_data    = 'portal-container-id';
wtbPortal.constants.BUNDLEID_data    = 'bundle-id';
wtbPortal.constants.PLATFORMID_data  = 'platform-id';
wtbPortal.constants.REGIONID_data    = 'region-id';
wtbPortal.constants.RETAILERID_data  = 'retailer-id';
wtbPortal.constants.BUTTONTEXT_data  = 'button-type';

wtbPortal.constants.SCREENTRANSITIONTIME_time = '0';

wtbPortal.constants.PORTALPATH_query         = 'wtbPortalPath';
wtbPortal.constants.PORTALSCREENINDEX_query  = 'wtbPortalScreen';
var COD = COD || {};

(function(COD, $) {

    var getCsrfToken = function() {
		return ATVI.utils.getCookie('API_CSRF_TOKEN', true) || '';
    };

	if (COD.api) COD.api = COD.api;
    else {

        COD.api = {};
        COD.api.papi = COD.api.papi || {};
		COD.api.papi.crm = COD.api.papi.crm || {};

        COD.api.papi.crm.path = 'crm/'

		COD.api.dev     = window.location.hostname.indexOf('cmsauthor') >= 0;
        COD.api.preview = window.location.hostname.indexOf('preview') >= 0;
        COD.api.stage   = window.location.hostname.indexOf('stage') >= 0;

        COD.api.papi.url = '/api/papi-client/';

        if (COD.api.dev) {
            COD.api.papi.url = 'https://stage.callofduty.com/api/papi-client/';
        }

        COD.api.unoId = function() {
            var hashId = COD.api.hashId();
            return ATVI.utils.decodeBase64(hashId).split(':')[0];
        };

        COD.api.papi.error = function (endpoint, error) {
            return "API error: ".concat(error, " (").concat(endpoint, ").");
        };

        COD.api.papi.crm.get = function (endpoint, callback, error) {
            var cb = typeof callback === 'function' ? callback : function () {};
            var er = typeof error === 'function' ? error : function () {};
            return COD.api.papi.get(COD.api.papi.crm.path + endpoint, cb, function (err) {
              er("CRM ".concat(err));
            });
        };

        COD.api.papi.get = function (endpoint, callback, error, cacheable) {
            var cache = cacheable !== false;
            var url = COD.api.papi.url + endpoint;
            return COD.api.get(url, callback, error, cache);
        };

        COD.api.papi.post = function (endpoint, data, callback, error) {
            var url = COD.api.papi.url + endpoint;
            return COD.api.post(url, data, callback, error);
        };

        var hashId;
        COD.api.hashId = function() {
            var id = hashId = hashId || ATVI.utils.getCookie("ACT_SSO_COOKIE");
            return id;
        };
    
        COD.api.cache =  {};

        COD.api.error = function(call, error) {
            return 'API error: ' + error + ' (' + call + ').';
        };
    
        COD.api.ajax = function(url, opts, callback, error) {
            callback = typeof callback === 'function' ? callback : function(data) {};
            error = typeof error === 'function' ? error : function(err) {};
    
            var request = {
                url: url,
                type: 'GET',
                dataType: 'json',
                beforeSend: function(req) {
                    if(url.indexOf('papi') >= 0. && ATVI.utils.getCookie("API_CSRF_TOKEN")) {
                        req.setRequestHeader("X-CSRF-TOKEN", ATVI.utils.getCookie("API_CSRF_TOKEN"));
                    }
                },
                xhrFields: {
                    withCredentials: true
                }
            };
    
            var req = $.extend(request, opts);
    
            return $.ajax(req).done(function(res) {
                if (!res) {
                    error(COD.api.error(url, 'empty response'));
                    return;
                }
                callback(res);
            }).fail(function(err) {
                error(COD.api.error(url, err.statusText));
            });
        };
    
        COD.api.cacheify = function(url, data) {
            var now = Date.now()
            var expiration = (5 * 60) * 1000;
            for(var c in COD.api.cache) {
                if((now - COD.api.cache[c]['timestamp']) >= expiration){
                    delete(COD.api.cache[c])
                }
            }
    
            COD.api.cache[url] = {
                data: data,
                timestamp: now
            };
        };
    
        COD.api.get = function(url, callback, error, cache) {
            var currentTime = Date.now();
            var cacheAPI = COD.api.cache;
            var expiration = (5 * 60) * 1000;
            var isCacheable = cache !== false;
            var devUrl = url;
            if (COD.api.dev){
                devUrl += devUrl.indexOf("?") >= 0 ? "&nonprodAdmin=true" : "?nonprodAdmin=true";
            }
    
            if (isCacheable) {
                if(cacheAPI[url] && ((currentTime - cacheAPI[url].timestamp) < expiration)) {
                    callback(cacheAPI[url].data);
                } else {
                    COD.api.ajax(devUrl, {}, function(res) {
                        if (res.status === "success") {
                            COD.api.cacheify(url, res);
                        }
                        callback(res);
                    }, error);
                }
            } else {
                COD.api.ajax(url, {}, function(res) {
                    callback(res);
                }, error);
            }

        };

        COD.api.post = function(url, data, callback, error) {
            var opts = {
                type: 'POST',
                data: JSON.stringify(data),
                headers: { 'X-CSRF-TOKEN': getCsrfToken() },
                contentType: 'application/json'
            };
            COD.api.ajax(url, opts, callback, error);
        };

        COD.api.papi.crm.identities = function (callback, error) {
            var cb = typeof callback === 'function' ? callback : function () {};
            var er = typeof error === 'function' ? error : function () {};
            var hashId = COD.api.hashId();
            var endpoint = "cod/v2/identities/".concat(hashId);

            if (!hashId) {
              return error(COD.api.papi.error(endpoint, 'Cannot load SSO identities. No hashId id present in cookies.'));
            }

            if (COD.api.dev) {
              var unoId = COD.api.unoId();
              endpoint = "cod/v2/identities/platform/uno/id/".concat(unoId);
            }

            return COD.api.papi.crm.get(endpoint, function (res) {
              var data = (res.data || {}).titleIdentities || [];
              if (res.status !== 'success') return er(data.message || res.status);
              return cb(data);
            }, er);
        };

        COD.api.papi.getCurrency = function (game, platform, idType, id, callback, error) {
        	var cb = typeof callback === 'function' ? callback : function (data) {};
        	var er = typeof error === 'function' ? error : function (err) {};
        	var endpoint = ['inventory', 'v1', 'title', game, 'platform', platform, idType, encodeURIComponent(id), 'currency'].join('/');

        	if (!game || !platform || !idType || !id) {
          		return er(COD.api.papi.error(endpoint, 'invalid parameters.'));
          	}

          	return COD.api.papi.get(endpoint, function (res) {
            	var data = res.data || {};
            	if (res.status !== 'success') return er(data.message || res.status);
            	return cb(data);
          	}, er);
        };

        COD.api.papi.getPurchasableItems = function (game, platform, username, callback, error) {
          	var cb = typeof callback === 'function' ? callback : function (data) {};
          	var er = typeof error === 'function' ? error : function (err) {};
            var endpoint = "inventory/v1/title/".concat(game, "/platform/").concat(platform, "/purchasable/gamer/").concat(encodeURIComponent(username), "/").concat(ATVI.pageLocale.toLocaleLowerCase());

       	   if (!game || !platform || !username) {
               return er(COD.api.papi.error(endpoint, 'invalid parameters.'));
           }

          return COD.api.papi.get(endpoint, function (res) {
            if (res.status !== 'success') {
              return er(res.data.message || res.status);
            }
        
            return cb(res.data);
          }, er);
        };

        COD.api.papi.fetchLootStreams = function (payload, callback, error) {
            var path = "loot/title/".concat(payload.game, "/platform/").concat(payload.platform, "/gamer/").concat(encodeURIComponent(payload.gamer), "/status/").concat(ATVI.pageLocale.toLocaleLowerCase());
            COD.api.papi.get(path, callback, error);
        };

        COD.api.papi.purchaseItem = function (game, platform, idType, id, itemName, callback, error) {
            var cb = typeof callback === 'function' ? callback : function (data) {};
            var er = typeof error === 'function' ? error : function (err) {};
            var endpoint = "inventory/v1/title/".concat(game, "/platform/").concat(platform, "/").concat(idType, "/").concat(encodeURIComponent(id), "/item/").concat(itemName, "/purchaseWith/CODPoints");

            if (!game || !platform || !idType || !id || !itemName) {
              return er(COD.api.papi.error(endpoint, 'invalid parameters.'));
            }

            return COD.api.papi.post(endpoint, {}, function (res) {
              if (res.status === 'success') {
                return cb(res.data);
              }

              return er(res);
            }, er);
        };

    }

})(COD, jQuery);

var wtbPortal = wtbPortal || {};


(function($, ATVI) {

    var app = wtbPortal,
        acc = app.accessibility = {},
        assign = acc.assign = {};

    assign.ariaHidden = function($els) {
        // single el or jquery collection
        if (!$els.length) return;
        $.each($els, function() {
			$(this).attr('aria-hidden', true);
        });
    };

    assign.ariaVisible = function($els) {
        // single el or jquery collection
        if (!$els.length) return;
        $.each($els, function() {
			$(this).attr('aria-hidden', false);
        });
    };

})(jQuery, ATVI);

var wtbPortal = wtbPortal || {};

(function($, ATVI) {

	var wtbp = wtbPortal;

    wtbp.$wrapper = undefined;
    wtbp.els = {};
	wtbp.paths = [];
    wtbp.inited = false;
    wtbp.loginUrl = {dev: 'https://profile-stage.callofduty.com/cod/login?redirectUrl=', prod: 'https://profile.callofduty.com/cod/login?redirectUrl='};
	wtbp.loadedFromQueryParameters = false;

    var consts = wtbp.constants,
        queryParameters = {};


    wtbp.initWtbPortal = function(pathId, screenIndex, scroll, cb) {
        if (!$.isEmptyObject(queryParameters) && !wtbp.loadedFromQueryParameters && pathId == queryParameters[consts.PORTALPATH_query]) {
            wtbp.inited = true;
			wtbp.setPortalPosition(pathId, screenIndex, scroll, cb);
			wtbp.loadedFromQueryParameters = true;
            return;
        }
        if (wtbp.inited) return;
        wtbp.inited = true;
        if (ATVI.pageEnv == 'prod' || window.location.href.indexOf('profile-stage.') > -1) wtbp.user.init();
		if (!pathId) pathId = 'initial';
        if (screenIndex == undefined) screenIndex = 0;
        if (!scroll) scroll = false;

        $('body').addClass(consts.MODALOPEN_class);

        if (pathId == 'battlepass') {
            screenIndex = wtbp.handleBattlepassCondition();
        }
        wtbp.setPortalPosition(pathId, screenIndex, scroll, cb);
    };

    wtbp.openWtbPortal = function() {
		$('body').addClass(consts.MODALOPEN_class);
    }

    wtbp.closeWtbPortal = function() {
		wtbp.screens.reset();
		wtbp.inited = false;
		$('body').removeClass(consts.MODALOPEN_class);
		wtbp.$wrapper.removeClass('modal-mode');
    };

    wtbp.setPortalPosition = function(pathId, screenIndex, scroll, cb) {
        if (!wtbp.inited) wtbp.initWtbPortal(pathId, screenIndex, cb);
		if (!pathId) pathId = 'initial';
        if (screenIndex == undefined) screenIndex = 0;
        if (scroll == undefined) scroll = true;
        if (pathId == 'battlepass') screenIndex = wtbp.handleBattlepassCondition();
        else {
            if (scroll) wtbp.scrollIntoView();
            if (wtbPortal.screens.currentScreen.parentId == pathId && wtbPortal.screens.currentScreen.index == screenIndex) {}
            else {
                wtbPortal.screens.assignCurrentScreenPath(pathId);
            	wtbPortal.screens.assignCurrentSubScreen(screenIndex);
            }
        }
        if (cb) cb();
    };

    wtbp.advanceToNextScreen = function() {
		var currentScreen = wtbp.screens.currentScreen,
            screens = wtbp.screens.screensObj;
        if (currentScreen.index == screens[currentScreen.parentId].$screens.length - 1) return;
		wtbPortal.screens.assignCurrentSubScreen(currentScreen.index + 1);
    };

    wtbp.scrollIntoView = function() {
		var top = wtbp.$wrapper[0].getBoundingClientRect().top,
            isEmbedded = (top > 1) ? true : false;
        if (isEmbedded) {
            try {
                wtbp.$wrapper[0].scrollIntoView({behavior: 'smooth'});
            } catch(error) {
				wtbp.$wrapper[0].scrollIntoView();
            }
        }
    };

    var init = function() {
		defineEls();
        addHandlers();
		evalQueryParameters();
        wtbp.initFromQueryParameters();
    };

    var defineEls = function() {
        wtbp.$wrapper = $('.wtb-portal-container');

        var pathLinks = wtbp.$wrapper.find('.portal-screen-container.initial .title-tout-link');
        $.each(pathLinks,function() {
            wtbp.paths.push($(this).data('title-id'));
        });

        wtbp.els.$closeModalButton = wtbp.$wrapper.find('.' + consts.CLOSEBUTTON_class);
        wtbp.els.$backButton = wtbp.$wrapper.find('.' + consts.BACKBUTTON_class);
    };

    var addHandlers = function() {
        wtbp.els.$closeModalButton.on('click', function(e) {
			e.preventDefault();
            wtbp.closeWtbPortal();
        });

        wtbp.els.$backButton.on('click', function(e) {
            e.preventDefault();
            wtbp.goBack();
        });
    };

    wtbp.goBack = function() {
		var newIndex = wtbp.screens.currentScreen.index - 1;
		if (newIndex > -1) wtbPortal.screens.assignCurrentSubScreen(newIndex);
        else if (newIndex == -1 && wtbp.screens.history.originalScreen.parentId == 'initial' ||
                newIndex == 0 && wtbp.screens.history.originalScreen.parentId == 'initial' && wtbp.screens.currentScreen.parentId == 'battlepass') {
			wtbp.setPortalPosition('initial');
        }
    };

    wtbp.handleBattlepassCondition = function() {
        var screenIndex;
        wtbPortal.user.init(function() {
			if (!wtbPortal.user.loggedIn) {
                var baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname,
                    url = wtbPortal.loginUrl[ATVI.pageEnv] + encodeURIComponent(baseUrl) + encodeURIComponent('?wtbPortalPath=battlepass&wtbPortalScreen=1');
                window.location.assign(url);
            } else {
                wtbPortal.battlepassStore.initStore();
                screenIndex = 1;
                wtbp.scrollIntoView();
                wtbPortal.screens.assignCurrentScreenPath('battlepass');
                wtbPortal.screens.assignCurrentSubScreen(screenIndex);
            }

        });

        //screenIndex = (!wtbPortal.user.loggedIn) ? 0 : 1;  add back in after login update
    };

    var evalQueryParameters = function() {
        var q = ATVI.utils.getQueryParameters();
        if (q[consts.PORTALPATH_query]) queryParameters[consts.PORTALPATH_query] = q[consts.PORTALPATH_query];
        if (q[consts.PORTALSCREENINDEX_query]) queryParameters[consts.PORTALSCREENINDEX_query] = parseInt(q[consts.PORTALSCREENINDEX_query], 10);
        else if (q[consts.PORTALPATH_query]) queryParameters[consts.PORTALSCREENINDEX_query] = 0;
    };

    wtbp.initFromQueryParameters = function() {
		if ($.isEmptyObject(queryParameters)) return;
        wtbPortal.screens.init();
        var path = queryParameters[consts.PORTALPATH_query],
            screen = queryParameters[consts.PORTALSCREENINDEX_query];

        wtbPortal.initWtbPortal(path, screen);
    };


    $(init);

})(jQuery, ATVI);

var wtbPortal = wtbPortal || {};

(function($, ATVI) {

    var screens = wtbPortal.screens = {};

    screens.inited = false;
    screens.currentScreen = {parentId: undefined, index: undefined, $el: undefined};
    screens.screenContainerEls = [];
    screens.screensObj = {};
    screens.history = { originalScreen: undefined, visited: [] };

    var init = function() {
        if (screens.inited) return;
        populateScreensArr();
        datafyContainers(screens.screenContainerEls);
		buildScreensObj();
        addAccessibilityAttributes();
        screens.inited = true;
        fireScreensReadyEvent();
        screens.addTabLimiters();
    };

    var fireScreensReadyEvent = function() {
        var e = new CustomEvent('wtbScreensReady');
		document.dispatchEvent(e);
    };

    var populateScreensArr = function() {
		var $containers = wtbPortal.$wrapper.find('.' + wtbPortal.constants.MASTERSCREENCONTAINER_class + ' > .atvi-layout-container');
        $.each($containers, function() {
			screens.screenContainerEls.push($(this));
        });
    };

    var buildScreensObj = function() {
		var arr = screens.screenContainerEls;
        arr.forEach(function($el) {
            var id = $el.attr('data-' + wtbPortal.constants.PORTALID_data),
            	o = screens.screensObj[id] = {};
            o.$parentEl = $el;
            o.$screens = $el.find('.' + wtbPortal.constants.SCREENCONTAINER_class);
            o.isCurrentScreenPath = false;
            o.currentSubScreen = undefined;
        });
    };

    var addAccessibilityAttributes = function() {
		var arr = screens.getAllScreens();
		wtbPortal.accessibility.assign.ariaHidden(arr);
    };

    screens.getAllScreens = function() {
		var arr = Object.keys(screens.screensObj),
            newArr = [],
            i;
        for (i = 0; i < arr.length; i++) {
            $.each(screens.screensObj[arr[i]].$screens, function() {
                newArr.push($(this));
            });
        }
        return newArr;
    };

    var datafyContainers = function(els) {
        $.each(els, function() {
			datafyContainer($(this));
        });
    };

    var datafyContainer = function($el) {
		if ($el.attr('data-' + wtbPortal.constants.PORTALID_data)) return;
        var $idSrc = $el.find('.' + wtbPortal.constants.SCREENCOLLECTIONCONTAINER_class),
            id = getIdFromClass($idSrc);
        if (id) $el.attr('data-' + wtbPortal.constants.PORTALID_data, id);
    };

    var getIdFromClass = function($el) {
		var arr = wtbPortal.paths,
            classes = $el.attr('class'),
            id, i;
        for (i = 0; i < arr.length; i++) {
			if (classes.indexOf(arr[i]) > -1) return arr[i];
        }
        return 'initial';
    };

    var initTimeout = function(cb) {
		setTimeout(function() {
            cb();
        }, wtbPortal.constants.SCREENTRANSITIONTIME_time);
    };

    var doScreenExit = function($el) {
        if (!$el.length) return;
        wtbPortal.accessibility.assign.ariaHidden($el);
		$el.removeClass(wtbPortal.constants.ACTIVE_class).addClass(wtbPortal.constants.EXITINGSCREEN_class);
        initTimeout(function() {
			$el.addClass(wtbPortal.constants.SCREENFINISHED_class).removeClass(wtbPortal.constants.EXITINGSCREEN_class);
            initTimeout(function() {
				$el.removeClass(wtbPortal.constants.SCREENFINISHED_class);
            });
        });
    };

    var isTimeForBackButton = function() {
		var o = screens.currentScreen,
            total = screens.screensObj[o.parentId].$screens.length;
        if (screens.history.originalScreen.parentId == 'initial') {
			if (o.index == total - 1) return false;
            return true;
        }
        if (total > 2 && o.index != total - 1 && o.index > 0 && o.parentId != 'battlepass') return true;
        return false;
    };

    var enableBackButton = function() {
		wtbPortal.els.$backButton.closest('.back-button-container').addClass('active');
    };

    var disableBackButton = function() {
		wtbPortal.els.$backButton.closest('.back-button-container').removeClass('active');
    };

    screens.addTabLimiters = function() {
		var subscreens = screens.getAllScreens();

        subscreens.forEach(function($v) {
			var $anchors = $v.find('a');
            $.each($anchors, function() {
				addTabHandler($anchors, $(this));
            });
        });

        function addTabHandler($collection, $el) {
            $el.on('keydown', function(e) {
                $collection = $collection.filter(':visible');
                if ($el.is($collection.first()) && e.which == 9 && e.shiftKey) {
                    screens.setFocus($collection.last());
                	e.preventDefault();
            	}
                if ($el.is($collection.last()) && e.which == 9) {
                    screens.setFocus($collection.first());
                    e.preventDefault();
                }
            });
        }
    };

    screens.setFocus = function($el, screenObj) {
		if (!screenObj) screenObj = screens.currentScreen;
        if (!$el) $el = screenObj.$el.find('a:visible').first();
		$el.focus();
    };

    screens.reset = function() {
        screens.currentScreen.$el.removeClass(wtbPortal.constants.ACTIVE_class);
		screens.currentScreen = {parentId: undefined, index: undefined, $el: undefined};
        screens.history = { originalScreen: undefined, visited: [] };
        wtbPortal.relevantTouts.resetTouts();
    };

    screens.assignCurrentScreenPath = function(id, cb) {
		if (!id) id = 'initial';
        var isCurrentScreenPath = screens.screensObj[id].isCurrentScreenPath,
            keys = Object.keys(screens.screensObj),
            oldParentId = screens.currentScreen.parentId,
            $oldPathContainer = (oldParentId) ? screens.screensObj[oldParentId].$parentEl : undefined;
        if (!isCurrentScreenPath) {
            var i;
            for (i = 0; i < keys.length; i++) {
				screens.screensObj[keys[i]].isCurrentScreenPath = false;
            }
			screens.screensObj[id].isCurrentScreenPath = true;
        }
		// get rid of old path && extant subScreens
        if (oldParentId) {
            $oldPathContainer.removeClass(wtbPortal.constants.ACTIVE_class);
            doScreenExit(screens.screensObj[oldParentId].$screens.filter('.' + wtbPortal.constants.ACTIVE_class));
        }
        // housekeeping
        wtbPortal.$wrapper.attr('data-current-path', id);
        screens.currentScreen.parentId = id;

        if (cb) cb();
    };

    screens.assignCurrentSubScreen = function(index, cb) {
		if (index < 0 || index == undefined) index = 0;
        var parentId = screens.currentScreen.parentId,
            $newScreen = screens.screensObj[parentId].$screens.eq(index);
        // housekeeping
        screens.screensObj[parentId].currentSubScreen = index;
        screens.currentScreen.$el = $newScreen;
        screens.currentScreen.index = index;
        screens.history.visited.push(screens.currentScreen);
        wtbPortal.$wrapper.attr('data-current-screen', index);
        if (screens.history.originalScreen == undefined) screens.history.originalScreen = JSON.parse(JSON.stringify(screens.currentScreen));

		// handle classes
        doScreenExit(screens.screensObj[parentId].$screens.filter('.' + wtbPortal.constants.ACTIVE_class));
        initTimeout(function() {
            wtbPortal.accessibility.assign.ariaVisible($newScreen);
            $newScreen.addClass(wtbPortal.constants.ACTIVE_class);
            initTimeout(function() {
				if (screens.history.visited.length > 1 && isInViewport(wtbPortal.$wrapper[0])) screens.setFocus();
            });
        });
        // enable/disable back button
        if (isTimeForBackButton()) enableBackButton();
        else disableBackButton();

        // targeted touts
        if (screens.currentScreen.parentId != 'initial' && 
            screens.currentScreen.index == screens.screensObj[parentId].$screens.length - 1) {
            wtbPortal.relevantTouts.initTargetedTouts(screens.currentScreen.$el);
        }

        if (cb) cb();
    };

    var isInViewport = function(el) {
		var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        );
    };


    $(init);

    screens.init = init;

})(jQuery, ATVI);

var wtbPortal = wtbPortal || {};

(function($, ATVI) {

	var ssobarPresent;

    var user = wtbPortal.user = {};

    user.data = {};
    user.loggedIn = false;
    user.consts = {};

    user.init = function(cb) {
        ssobar.onReady(function() {
            user.getLoggedInState();
            if (user.loggedIn && $.isEmptyObject(user.data) || user.loggedIn && !user.data.username) {
                user.getUser(function() {
                    user.getCurrency();
                    user.getLootStreams();
                    if (cb) cb();
                });
            } else if (cb) cb();
        });
    };

    var scanForSso = function() {
        try {
			ssobarPresent = !!ssobar;
        } catch (e) {
			ssobarPresent = false;
        }
    };

    user.getLoggedInState = function() {
        scanForSso();
		if (!ssobarPresent) return false;
        if (ssobar.user && ssobar.user.isLoggedIn) {
            user.loggedIn = true;
            return true;
        }
    };

    user.getUser = function(cb) {
		user.data.hashId = COD.api.hashId();
        COD.api.papi.crm.identities(function(res) {
			user.data.identities = res;
            if (!user.data.identities.length) {}
			var mostRecentActivity = user.getMostRecentActivity();
            user.data.linkedAccount = (user.data.identities.length) ? user.data.identities : false;
			user.data.game = mostRecentActivity.title;
            user.data.platform = mostRecentActivity.platform;
            user.data.username = mostRecentActivity.username;
            if (cb) cb();
        }, function() {
			console.log('e r r o r');
            user.data.identities = false;
        });
    };

    user.getCurrency = function(cb) {
        COD.api.papi.getCurrency(wtbPortal.battlepassStore.currentGameKey, user.data.platform, 'gamer', user.data.username, function(res) {
            user.data.currency = res.codPoints;
            if (cb) cb();
        }, function() {
			console.log('e r r o r');
        });
    };

    user.getMostRecentActivity = function() {
		if (!user.data.identities.length) return false;
        var latestNode = undefined, i;
        for (i = 0; i < user.data.identities.length; i++) {
			var thisNode = user.data.identities[i];
            if (thisNode.platform == 'steam') continue;
			if (i == 0 || latestNode.activeDate < thisNode.activeDate) latestNode = thisNode;
        }
        return latestNode;
    };

    user.getLootStreams = function(cb) {
        if (!user.data.linkedAccount) return;
        var payload = {game: wtbPortal.battlepassStore.currentGameKey, platform: user.data.platform, gamer: user.data.username};
        COD.api.papi.fetchLootStreams(payload, function(d) {
			processLootStreams(d);
            if (cb) cb();
        }, function() {
			console.log('There was a problem fetching the Loot Streams');
        });
    };

    var processLootStreams = function(d) {
        if (wtbPortal.battlepassStore.currentSeasonKey.length) {
			user.data.purchasedBattlePass = d.data.streams[wtbPortal.battlepassStore.currentSeasonKey].premium;
        } else user.data.purchasedBattlePass = false;
    };



})(jQuery, ATVI);

var wtbPortal = wtbPortal || {};

(function($, ATVI) {

    wtbPortal.utils = wtbPortal.utils || {};

    wtbPortal.optimizely = {};


    wtbPortal.utils.fireCustomEvent = function(eventName) {
        if (eventName) {
            var e = new CustomEvent(eventName);
            document.dispatchEvent(e);
        }
    };

    wtbPortal.optimizely.appendLinkWithOptimizelyParameters = function(url, eventId) {
        if (!window.optimizely) return url;
        var hashIndex = url.indexOf('#'),
            hasQueryParameter = url.indexOf('?') > -1,
            hashString = (hashIndex > -1) ? url.slice(hashIndex) : '',
            optimizelyQueryParameter = '?oeu=' + optimizely.get('visitor').visitorId + '&atviOptId=18240914759' + '&optEventId=' + eventId;

        if (hasQueryParameter) {
            url = url.replace('?', optimizelyQueryParameter + '&');
        } else {
            url = url + optimizelyQueryParameter;
        }

        return url + hashString;
    };

})(jQuery, ATVI);
