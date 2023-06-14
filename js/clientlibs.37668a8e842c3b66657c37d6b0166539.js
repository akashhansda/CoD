
var ATVI = ATVI || {};

(function($, ATVI) {

    var wtb = ATVI.components.wheretobuy,
        wtbp = wtbPortal || {},
        wz = wtbp.wtb_warzone = {};

    var $context;

    wz.els = {};
    wz.bundleId = 'magma';
    wz.currentBundle = undefined;
    wz.currentPlatform = undefined;
    wz.currentRegion = undefined;
    wz.currentRows = [];

    wtb.filterBundlesByRegion = function(){};

    wz.consts = {};
    wz.consts.REGIONCHANGELINK_class = 'region-change-link';
    wz.consts.TITLECHANGELINK_class = 'title-change-link';
    wz.consts.REGIONMODAL_class = 'region-select-modal';
    wz.consts.REOPENSTORETEXT_class = 'reopen-platform-store-text';
    wz.consts.RELEVANTTOUTS_class = 'relevant-touts';
    wz.consts.LOOKINGFORBP_class = 'looking-for-battlepass-text';

    wz.consts.PLATFORMID_data = 'platform-id';

    ATVI.library.withDependency('wtb-component', function() {
		var where = ATVI.components.wheretobuy;

        where.handleLocaleDetection = function(context, obj) {
            where.detectedLocale = ATVI.localeDetector.country;
            var region = where.processDetectedLocale(context);
            if (region != context.status.regions) {
                where.updateStatus(context, 'regions', region);
                where.updateForPossibleRows(context, where.widenPossibleRows(context));
                updateRegion();
            }
        };
    });

    var init = function() {
        defineContext();
        defineEls();
        addHandlers();
        ATVI.library.withDependency('wtb-component', function() {
	        updateRegion();
    	    updatePlatformLinks();
        });
    };

    var defineContext = function() {
		$context = $('.wtb-portal-screens-container.warzone');
    };

    var defineEls = function() {
		var o = wz.els;
        o.$platformLinks = $context.find('.platform-select .wtb-portal-tout-link');
        o.$wtbEl = $context.find('#warzone-wtb-module');
        o.$regionChangeLink = o.$wtbEl.find('.' + wz.consts.REGIONCHANGELINK_class);
        o.$titleChangeLink = o.$wtbEl.find('.' + wz.consts.TITLECHANGELINK_class);
        o.$regionModal = o.$wtbEl.find('.' + wz.consts.REGIONMODAL_class);
        o.$modalCloseButton = o.$regionModal.find('.modal-btn');
        o.$relevantTouts = $context.find('.' + wz.consts.RELEVANTTOUTS_class);
        o.$reopenPlatformStore = o.$relevantTouts.find('.' + wz.consts.REOPENSTORETEXT_class);
    };

    var addHandlers = function() {
        $.each(wz.els.$platformLinks, function() {
			var $thisLink = $(this),
                thisId = $thisLink.data(wtbp.constants.PLATFORMID_data);
            $thisLink.on('click', function(e) {
				e.preventDefault();
                var retailerLink = getRetailerLink(thisId) || '#',
                    con = wtb.getContext($context.find('.atvi-wheretobuy'));
                wz.currentPlatform = thisId;
                wtb.updateStatus(con, 'platforms', wz.currentPlatform);
                wtb.updateAnalyticsObject(con);
                pushAnalytics(con, retailerLink);
                if (retailerLink == '#') {
                    // error
                } else {
                    updateCompletionScreen();
                    advanceToNextScreen();
                    setTimeout(function() {
                        window.open(retailerLink, '_blank');
                    }, 350);

                }
            });
        });

        wz.els.$regionChangeLink.on('click', function(e) {
			e.preventDefault();
			initRegionModal();
        });

        wz.els.$titleChangeLink.on('click', function(e) {
			e.preventDefault();
            wtbPortal.screens.assignCurrentScreenPath('initial');
			wtbPortal.screens.assignCurrentSubScreen(0);
        });

        wz.els.$modalCloseButton.on('click', function(e) {
            e.preventDefault();
            closeRegionModal();
            updateRegion();
            updatePlatformLinks();
        });

        wz.els.$regionModal.find('.background-container').on('click', function() {
			if (wz.els.$regionModal.hasClass('active')) closeRegionModal();
        });

        $context.find('.' + wz.consts.LOOKINGFORBP_class + ' a').on('click', function(e) {
			e.preventDefault();
            wtbp.setPortalPosition('battlepass', 0);
        });

    };

    var updatePlatformLinks = function() {
        $.each(wz.els.$platformLinks, function() {
            var $thisLink = $(this),
                $thisParent = $thisLink.closest('.experiencefragment'),
                retailerLink = getRetailerLink($thisLink.data(wtbp.constants.PLATFORMID_data)) || '#',
                attrObj = {};
            if (retailerLink == '#') $thisParent.hide();
            else {
                $thisParent.show();
                attrObj['data-' + wtbp.constants.BUNDLEID_data] = wz.bundleId;
                attrObj['data-' + wtbp.constants.REGIONID_data] = wz.currentRegion;
                attrObj['data-' + wtbp.constants.RETAILERID_data] = retailerLink;
                attrObj['data-' + wtbp.constants.BUTTONTEXT_data] = 'play-now';
                attrObj['href'] = retailerLink;
    
                $thisLink.attr(attrObj);
            }
        });
    };

    var pushAnalytics = function(context, retailerUrl) {
        if (dataLayer) {
            dataLayer.push({
                event: 'purchase',
                category: 'purchase',
                itpType: 'purchase',
                action: 'wz:' + context.status.platforms,
                label: 'standard:' + retailerUrl,
                destinationURL: retailerUrl,
                pageURL: window.location.href,
                gameName: 'wz',
                platform: context.status.platforms,
                productBundle: 'standard',
                purchaseLink: retailerUrl
            });
        }
    };

    var getRetailerLink = function(id) {
		var con = wtb.getContext(wz.els.$wtbEl),
            rows = con.config.data.wtb.rows,
            row;
        row = $.grep(rows, function(entry) { return (entry.regions == wz.currentRegion && entry.bundles == wz.bundleId && entry.platforms == id); });
        if (!row.length) return false;
        return row[0].retailer.link;
    };

    var initRegionModal = function() {
		wz.els.$regionModal.addClass('active');
        setTimeout(function() {
	        evalWinPos();
        }, 700);
    };

    var closeRegionModal = function() {
		wz.els.$regionModal.removeClass('active').removeAttr('style');
    };

    var evalWinPos = function() {
		var rect = wz.els.$regionModal[0].getBoundingClientRect();
        if (rect.top >= 0) return;
		wz.els.$regionModal.css('top', -rect.top);
    };

    var updateRegion = function() {
        var $con = ($context) ? $context : defineContext();
		if (!$con) return;
        var wtbCon = wtb.getContext($con.find('.atvi-wheretobuy'));
        if (!wtbCon) return;
        wz.currentRegion = (wtbCon.status.regions) ? wtbCon.status.regions : wtbCon.config.opts.defaults.regions;
        updateRegionText();
    };

    var updateRegionText = function() {
		var $regionTextEl = $context.find('.region-display-container .dynamic-text');
        $regionTextEl.text(ATVI.countryCodes[wz.currentRegion]);
    };

    var updateCompletionScreen = function() {
		var $anchor = wz.els.$reopenPlatformStore.find('a'),
            wtbCon = wtb.getContext(wz.els.$wtbEl),
            platforms = wtbCon.config.data.wtb.platforms,
            platformsArr = [];
        platforms.forEach(function(v) { platformsArr.push(v.id) });
        wz.els.$reopenPlatformStore.removeClass(platformsArr.join(' ')).addClass(wz.currentPlatform);
        $anchor.attr('href', getRetailerLink(wz.currentPlatform));
    };

    var advanceToNextScreen = function() {
        wtbp.screens.assignCurrentSubScreen(wtbp.screens.currentScreen.index + 1);
    };


    $(init);


})(jQuery, ATVI);