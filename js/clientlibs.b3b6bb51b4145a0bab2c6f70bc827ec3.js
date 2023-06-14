
var ATVI = ATVI || {};

(function($, ATVI) {

    var wtb = ATVI.components.wheretobuy,
        wtbp = wtbPortal || {};

    var $context;

    wtbp.wtb_cw = {};
    wtbp.wtb_cw.els = {};
    wtbp.wtb_cw.consts = {};

    wtbp.wtb_cw.currentBundle = undefined;
    wtbp.wtb_cw.currentPlatform = undefined;
    wtbp.wtb_cw.currentRegion = undefined;
    wtbp.wtb_cw.currentRows = [];
    wtbp.wtb_cw.platformCategories = {ps: 'playstation', ps4: 'playstation', ms: 'microsoft', xboxone: 'microsoft', pc:'pc', steam: 'steam'};


    wtb.filterBundlesByRegion = function(){};

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
        datafyBundleLinks();
        cloneAndPlaceDomEls();
        addHandlers();
        updateRegion();
        setDefaultBundle();
        addAccessibility();
        updatePlatformLinks();
    };

    var defineContext = function() {
        $context = $('.wtb-portal-screens-container.cold-war');
    };

    var defineEls = function() {
        wtbp.wtb_cw.els.$wtbEl = $context.find('#cold-war-wtb-module');
        wtbp.wtb_cw.els.$bundleLinks = $context.find('.' + wtbp.constants.BUNDLELINK_class);
        wtbp.wtb_cw.els.$platformLinks = $context.find('.' + wtbp.constants.PLATFORMLINK_class);
        wtbp.wtb_cw.els.$regionChangeLink = $context.find('.' + wtbp.constants.REGIONCHANGELINK_class);
        wtbp.wtb_cw.els.$titleChangeLink = $context.find('.' + wtbp.constants.TITLECHANGELINK_class);
        wtbp.wtb_cw.els.$regionModal = $context.find('.' + wtbp.constants.REGIONMODAL_class);
        wtbp.wtb_cw.els.$modalCloseButton = wtbp.wtb_cw.els.$regionModal.find('.modal-btn');
        wtbp.wtb_cw.els.$relevantTouts = $context.find('.' + wtbp.constants.RELEVANTTOUTS_class);
        wtbp.wtb_cw.els.$reopenPlatformStore = wtbp.wtb_cw.els.$relevantTouts.find('.' + wtbp.constants.REOPENSTORETEXT_class);
        wtbp.wtb_cw.els.$featureItems = $context.find('.' + wtbp.constants.FEATUREITEM_class);
    };

    var datafyBundleLinks = function() {
		$.each(wtbp.wtb_cw.els.$bundleLinks, function() {
            var $thisLink = $(this);
			$thisLink.attr('data-' + wtbp.constants.BUNDLEID_data, $thisLink.data('bundle-name'));
        });
    };

    var addHandlers = function() {

        $.each(wtbp.wtb_cw.els.$bundleLinks, function() {
            var $thisLink = $(this),
                thisDataId = $thisLink.data(wtbp.constants.BUNDLEID_data);

            $thisLink.on('click', function(e) {
                if ($thisLink.attr('href') == '#') e.preventDefault();
                if ($thisLink.data(wtbp.constants.BUNDLEID_data)) {
                    e.preventDefault();
                    wtbp.wtb_cw.handleBundleClick({$el: $thisLink});
                }
            });
        });

        $.each(wtbp.wtb_cw.els.$platformLinks, function() {
            var $thisLink = $(this);
            $thisLink.on('click', function(e) {
                if ($thisLink.attr('href') == '#') e.preventDefault();
                wtbp.wtb_cw.handlePlatformClick($thisLink.data(wtbp.constants.PLATFORMID_data));
            });
        });

        $.each(wtbp.wtb_cw.els.$regionChangeLink, function() {
            $(this).on('click', function(e) {
                e.preventDefault();
                initRegionModal($(this).closest('.sub-screen-container'));
            });
        });

        $.each(wtbp.wtb_cw.els.$titleChangeLink, function() {
            $(this).on('click', function(e) {
                e.preventDefault();
                wtbPortal.screens.assignCurrentScreenPath('initial');
                wtbPortal.screens.assignCurrentSubScreen(0);
            });
        });

        wtbp.wtb_cw.els.$modalCloseButton.on('click', function(e) {
            e.preventDefault();
            closeRegionModal();
            updateRegion();
            updateBundleLinks();
            updatePlatformLinks();
        });

        $.each(wtbp.wtb_cw.els.$regionModal, function() {
            var $thisModal = $(this);
            $thisModal.find('.background-container').on('click', function() {
                if ($thisModal.hasClass('active')) closeRegionModal();
            });
        });

    };

    var setDefaultBundle = function() {
		var wtbCon = wtb.getContext(wtbp.wtb_cw.els.$wtbEl);
        wtbCon.status.bundles = wtbCon.config.opts.defaults.bundles;
    };

    var addAccessibility = function() {
        $.each(wtbp.wtb_cw.els.$platformLinks, function() {
			$(this).attr('role', 'button');
        });

        $.each(wtbp.wtb_cw.els.$bundleLinks, function() {
			$(this).attr('role', 'link');
        });
    };


    wtbp.wtb_cw.handlePlatformClick = function(id) {
		var con = wtb.getContext(wtbp.wtb_cw.els.$wtbEl);

        wtb.updateStatus(con, 'platforms', id);
        wtb.updateAnalyticsObject(con);
        wtbp.wtb_cw.els.$wtbEl.attr('data-current-platform', con.status.platforms);
        filterFeatureItems();
        updateBundleLinks();
        advanceToNextScreen();
    };

    wtbp.wtb_cw.handleBundleClick = function(args) {
        var con = wtb.getContext(wtbp.wtb_cw.els.$wtbEl),
            rows = con.config.data.wtb.rows,
            bundleId = (args.id) ? args.id : args.$el.data(wtbp.constants.BUNDLEID_data);

        wtb.updateStatus(con, 'bundles', bundleId);
        wtb.updateAnalyticsObject(con);
        pushAnalytics(con, args.$el.attr('href'));
        updateBundleLinks();
        updateCompletionScreen();
	    advanceToNextScreen();
        setTimeout(function() {
	        window.open(args.$el.attr('href'), '_blank');
        }, 350);
    };

    wtb.sendAnalyticsEvent = function() { return false; }

    var pushAnalytics = function(context, retailerUrl) {
        if (dataLayer) {
            dataLayer.push({
                event: 'purchase',
                category: 'purchase',
                itpType: 'purchase',
                action: 'bocw:' + context.status.platforms,
                label: context.status.bundles + ':' + retailerUrl,
                destinationURL: retailerUrl,
                pageURL: window.location.href,
                gameName: 'bocw',
                platform: context.status.platforms,
                productBundle: context.status.bundles,
                purchaseLink: retailerUrl
            });
        }
    };

    var filterFeatureItems = function() {
        var wtbCon = wtb.getContext(wtbp.wtb_cw.els.$wtbEl),
            platforms = wtbCon.status.platforms,
            isPs = (platforms == 'ps' || platforms == 'ps4') ? true : false,
            $betaSpans = wtbp.wtb_cw.els.$featureItems.filter('.beta-access').find('span');

        wtbp.wtb_cw.els.$featureItems
        	.filter('.to-filter')
            .hide()
            .filter('.' + wtbp.wtb_cw.platformCategories[platforms])
            .show();

        $betaSpans.hide();
        if (isPs) $betaSpans.filter('.ps-only').show();
        else $betaSpans.filter('.default').show();
    };

    var updateBundleLinks = function() {
        var wtbCon = wtb.getContext(wtbp.wtb_cw.els.$wtbEl);

        $.each(wtbp.wtb_cw.els.$bundleLinks, function() {
            var $thisLink = $(this),
                retailerLink = getRetailerLink($thisLink.data(wtbp.constants.BUNDLEID_data)) || '#',
                attrObj = {};

            attrObj['data-' + wtbp.constants.PLATFORMID_data] = wtbCon.status.platforms;
            attrObj['data-' + wtbp.constants.REGIONID_data] = wtbCon.status.regions;
            attrObj['data-' + wtbp.constants.RETAILERID_data] = retailerLink;
            attrObj['data-' + wtbp.constants.BUTTONTEXT_data] = wtb.bundleBuyButtonStatus.default.buttonValue;
            attrObj['href'] = retailerLink;

            $thisLink.attr(attrObj);

        });
    };

    var cloneAndPlaceDomEls = function() {
        var $regionModal = $context.find('.' + wtbp.constants.REGIONMODAL_class),
            $additionalEl = $context.find('.' + wtbp.constants.ADDITIONALCONTENT_class),
            $cloned = $additionalEl.add($regionModal).clone(true),
            $platformDisclaimers = $context.find('.' + wtbp.constants.PLATFORMDISCLAIMER_class);

        $cloned.find('.disclaimers-container').empty();

        //if (wtbPortal.screens.screensObj['initial'].$parentEl.find('.cold-war').length) {
        if (wtbPortal.screens.screensObj['initial'].$parentEl.find('.cold-war .promo-text').length) {
			var $clone = wtbPortal.screens.screensObj['initial'].$parentEl.find('.promo-disclaimer-text').clone();
            $cloned.find('.disclaimers-container').append([$clone, $platformDisclaimers]);
        }
        $cloned.appendTo($context.find('.sub-screen-container.platforms'));
        wtbp.wtb_cw.els.$regionChangeLink = $context.find('.' + wtbp.constants.REGIONCHANGELINK_class);
        wtbp.wtb_cw.els.$titleChangeLink = $context.find('.' + wtbp.constants.TITLECHANGELINK_class);
        wtbp.wtb_cw.els.$regionModal = $context.find('.' + wtbp.constants.REGIONMODAL_class);
        wtbp.wtb_cw.els.$modalCloseButton = wtbp.wtb_cw.els.$regionModal.find('.modal-btn');
        $context.find('.sub-screen-container.platforms select').selectric({
            onChange: function(el) {
                var wtbCon = wtb.getContext(wtbp.wtb_cw.els.$wtbEl);
                wtbCon.status.regions = $(el).val();
                wtb.updateStatus(wtbCon, 'regions', wtbCon.status.regions);
                updateBundleLinks();
                updateRegion();
            },
            disableOnMobile: false,
            optionsItemBuilder: function(itemData) {
                return '<span data-option-item-id="' + itemData.value + '"></span>' + itemData.text;
            }
        });
    };

    var initRegionModal = function(context) {
        var wtbCon = wtb.getContext(wtbp.wtb_cw.els.$wtbEl),
            $el = context.find('.' + wtbp.constants.REGIONMODAL_class),
            $sel = $el.find('select'),
            currentIndex = $sel.prop('selectedIndex'),
            currentVal = $el.val();

        if (currentVal != wtbCon.status.regions) {
            handleClonedRegionModalInit($el);
        }
        $el.addClass('active');
        setTimeout(function() {
            evalWinPos();
        }, 700);
    };

    var handleClonedRegionModalInit = function($modalEl) {
        var wtbCon = wtb.getContext(wtbp.wtb_cw.els.$wtbEl),
            $sel = $modalEl.find('select'),
            newIndex = $sel.children().filter(function() { return $(this)[0].value == wtbCon.status.regions }).index();
        $sel.prop('selectedIndex', newIndex).selectric('refresh');
    };

    var closeRegionModal = function() {
        wtbp.wtb_cw.els.$regionModal.removeClass('active').removeAttr('style');
    };

    var evalWinPos = function() {
        var rect = wtbp.wtb_cw.els.$regionModal[0].getBoundingClientRect();
        if (rect.top >= 0) return;
        wtbp.wtb_cw.els.$regionModal.css('top', -rect.top);
    };

    var getRetailerLink = function(id) {
        var context = wtb.getContext(wtbp.wtb_cw.els.$wtbEl),
            d = context.config.data.wtb.rows,
            row = $.grep(d, function(entry) { return (entry.regions == context.status.regions && entry.platforms == context.status.platforms && entry.bundles == id); });
        if (!row.length) return false;
        return row[0].retailer.link;
    };

    var updateRegion = function() {
        var wtbCon = wtb.getContext($context.find('.atvi-wheretobuy'));
        if (!wtbCon) return;
        wtbp.wtb_cw.currentRegion = (wtbCon.status.regions) ? wtbCon.status.regions : wtbCon.config.opts.defaults.regions;
        updateRegionText();
    };

    var updateRegionText = function() {
        var wtbCon = wtb.getContext(wtbp.wtb_cw.els.$wtbEl),
            $regionTextEl = $context.find('.region-display-container .dynamic-text');
        $.each($regionTextEl, function() {
            $(this).text(ATVI.countryCodes[wtbCon.status.regions]);
        });
    };

    var updatePlatformLinks = function() {
        $.each(wtbp.wtb_cw.els.$platformLinks, function() {
            var $thisLink = $(this).parent().parent().parent(),
                $thisParent = $thisLink.closest('.experiencefragment'),
                attrObj = {};
            
            $thisParent.show();
            attrObj['data-' + wtbp.constants.REGIONID_data] = wtbp.wtb_cw.currentRegion;
            
            $thisLink.attr(attrObj);

        });
    }

    var updateCompletionScreen = function() {
        var $anchor = wtbp.wtb_cw.els.$reopenPlatformStore.find('a'),
            wtbCon = wtb.getContext(wtbp.wtb_cw.els.$wtbEl),
            rows = wtbCon.config.data.wtb.rows,
            platformsArr = [], row, link;
        wtbCon.config.data.wtb.platforms.forEach(function(item) { platformsArr.push(item.id); });
        row = $.grep(rows, function(entry) { return (entry.regions == wtbCon.status.regions && entry.platforms == wtbCon.status.platforms && entry.bundles == wtbCon.status.bundles); });
        link = (row.length) ? row[0].retailer.link : false;
        if (link) wtbp.wtb_cw.els.$reopenPlatformStore.removeClass(platformsArr.join(' ')).addClass(wtbCon.status.platforms);
        $anchor.attr('href', link);
    };

    var advanceToNextScreen = function() {
        wtbp.screens.assignCurrentSubScreen(wtbp.screens.currentScreen.index + 1);
    };

    $(init);

    wtbp.wtb_cw.init = init;

})(jQuery, ATVI);