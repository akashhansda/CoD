
var ATVI = ATVI || {};

(function($, ATVI) {

    var wtb = ATVI.components.wheretobuy,
        wtbp = wtbPortal || {};

    var $context;

    wtbp.wtb_mw = {};
    wtbp.wtb_mw.els = {};
    wtbp.wtb_mw.consts = {};

    wtbp.wtb_mw.currentBundle = 'digital';
    wtbp.wtb_mw.currentPlatform = undefined;
    wtbp.wtb_mw.currentRegion = undefined;
    wtbp.wtb_mw.currentRows = [];

    wtb.filterBundlesByRegion = function(){};

    ATVI.library.withDependency('wtb-component', function() {
        var where = ATVI.components.wheretobuy;

        where.handleLocaleDetection = function(context, obj) {
            where.detectedLocale = ATVI.localeDetector.country;
            var region = where.processDetectedLocale(context);
            if (region !== context.status.regions) {
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
        addStatus();
        updateRegion();
        updatePlatformLinks();
    };

    var defineContext = function() {
        $context = $('.wtb-portal-screens-container.mw');
    };

    var defineEls = function() {
        wtbp.wtb_mw.els.$wtbEl = $context.find('#mw-wtb-module');
        wtbp.wtb_mw.els.$platformLinks = $context.find('.' + wtbp.constants.PLATFORMLINK_class);
        wtbp.wtb_mw.els.$regionChangeLink = $context.find('.' + wtbp.constants.REGIONCHANGELINK_class);
        wtbp.wtb_mw.els.$titleChangeLink = $context.find('.' + wtbp.constants.TITLECHANGELINK_class);
        wtbp.wtb_mw.els.$regionModal = $context.find('.' + wtbp.constants.REGIONMODAL_class);
        wtbp.wtb_mw.els.$modalCloseButton = wtbp.wtb_mw.els.$regionModal.find('.modal-btn');
        wtbp.wtb_mw.els.$relevantTouts = $context.find('.' + wtbp.constants.RELEVANTTOUTS_class);
        wtbp.wtb_mw.els.$reopenPlatformStore = wtbp.wtb_mw.els.$relevantTouts.find('.' + wtbp.constants.REOPENSTORETEXT_class);
    };

    var addHandlers = function() {

        $.each(wtbp.wtb_mw.els.$platformLinks, function() {
            var $thisLink = $(this);
            $thisLink.on('click', function(e) {
                e.preventDefault();
                var con = wtb.getContext($context.find('.atvi-wheretobuy'));
                wtbp.wtb_mw.currentPlatform = $thisLink.data(wtbp.constants.PLATFORMID_data);
                wtb.updateStatus(con, 'platforms', wtbp.wtb_mw.currentPlatform);
                wtb.updateAnalyticsObject(con);
                pushAnalytics(con, $thisLink.attr('href'));
                updateCompletionScreen();
                advanceToNextScreen();
                setTimeout(function() {
                    window.open($thisLink.attr('href'), '_blank');
                }, 350);
            });
        });

        $.each(wtbp.wtb_mw.els.$regionChangeLink, function() {
            $(this).on('click', function(e) {
                e.preventDefault();
                initRegionModal($(this).closest('.portal-screen-container').find('.wtb-component'));
            });
        });

        $.each(wtbp.wtb_mw.els.$titleChangeLink, function() {
            $(this).on('click', function(e) {
                e.preventDefault();
                wtbPortal.screens.assignCurrentScreenPath('initial');
                wtbPortal.screens.assignCurrentSubScreen(0);
            });
        });

        wtbp.wtb_mw.els.$modalCloseButton.on('click', function(e) {
            e.preventDefault();
            closeRegionModal();
            updateRegion();
            updatePlatformLinks();
        });

        $.each(wtbp.wtb_mw.els.$regionModal, function() {
            var $thisModal = $(this);
            $thisModal.find('.background-container').on('click', function() {
                if ($thisModal.hasClass('active')) closeRegionModal();
            });
        });

    };

    var addStatus = function() {
        var context = wtb.getContext(wtbp.wtb_mw.els.$wtbEl),
        	status = context.status,
            ldCountry = ATVI.localeDetector.country;
        status.bundles = wtbp.wtb_mw.currentBundle;
        status.regions = (status.regions) ? status.regions : ldCountry || context.config.opts.defaults.regions;
    };

    var pushAnalytics = function(context, retailerUrl) {
        if (dataLayer) {
            dataLayer.push({
                event: 'purchase',
                category: 'purchase',
                action: 'mw:' + context.status.platforms,
                label: context.status.bundles + ':' + retailerUrl,
                destinationURL: retailerUrl,
                pageURL: window.location.href,
                gameName: 'mw',
                platform: context.status.platforms,
                productBundle: context.status.bundles,
                purchaseLink: retailerUrl
            });
        }
    };

    var updatePlatformLinks = function() {
        $.each(wtbp.wtb_mw.els.$platformLinks, function() {
            var $thisLink = $(this),
                $thisParent = $thisLink.closest('.experiencefragment'),
                retailerLink = getRetailerLink($thisLink.data(wtbp.constants.PLATFORMID_data)) || '#',
                attrObj = {};
            if (retailerLink === '#') $thisParent.hide();
            else {
                $thisParent.show();
                attrObj['data-' + wtbp.constants.BUNDLEID_data] = wtbp.wtb_mw.currentBundle;
                attrObj['data-' + wtbp.constants.REGIONID_data] = wtbp.wtb_mw.currentRegion;
                attrObj['data-' + wtbp.constants.RETAILERID_data] = retailerLink;
                attrObj['data-' + wtbp.constants.BUTTONTEXT_data] = wtb.bundleBuyButtonStatus.default.buttonValue;
                attrObj['href'] = retailerLink;

                $thisLink.attr(attrObj);
            }
        });
    };

    var initRegionModal = function(context) {
        var $el = context.find('.' + wtbp.constants.REGIONMODAL_class);

        $el.addClass('active');
        setTimeout(function() {
            evalWinPos();
        }, 700);
    };

    var closeRegionModal = function() {
        wtbp.wtb_mw.els.$regionModal.removeClass('active').removeAttr('style');
    };

    var evalWinPos = function() {
        var rect = wtbp.wtb_mw.els.$regionModal[0].getBoundingClientRect();
        if (rect.top >= 0) return;
        wtbp.wtb_mw.els.$regionModal.css('top', -rect.top);
    };

    var getRetailerLink = function(id) {
        var context = wtb.getContext(wtbp.wtb_mw.els.$wtbEl),
            d = context.config.data.wtb.rows,
            row = $.grep(d, function(entry) { return (entry.regions === context.status.regions && entry.bundles == context.status.bundles && entry.platforms == id); });
        if (!row.length) return false;
        return row[0].retailer.link;
    };

    var updateRegion = function() {
        var wtbCon = wtb.getContext($context.find('.atvi-wheretobuy'));
        if (!wtbCon) return;
        wtbp.wtb_mw.currentRegion = (wtbCon.status.regions) ? wtbCon.status.regions : wtbCon.config.opts.defaults.regions;
        updateRegionText();
    };

    var updateRegionText = function() {
        var $regionTextEl = $context.find('.region-display-container .dynamic-text');
        $.each($regionTextEl, function() {
            $(this).text(ATVI.countryCodes[wtbp.wtb_mw.currentRegion]);
        });
    };

    var updateCompletionScreen = function() {
        var $anchor = wtbp.wtb_mw.els.$reopenPlatformStore.find('a'),
            wtbCon = wtb.getContext(wtbp.wtb_mw.els.$wtbEl),
            platforms = wtbCon.config.data.wtb.platforms,
            platformsArr = [];
        platforms.forEach(function(v) { platformsArr.push(v.id) });
        wtbp.wtb_mw.els.$reopenPlatformStore.removeClass(platformsArr.join(' ')).addClass(wtbp.wtb_mw.currentPlatform);
        $anchor.attr('href', getRetailerLink(wtbp.wtb_mw.currentPlatform));
    };

    var advanceToNextScreen = function() {
        wtbp.screens.assignCurrentSubScreen(wtbp.screens.currentScreen.index + 1);
    };

    $(init);

    wtbp.wtb_mw.init = init;

})(jQuery, ATVI);