
var wtbPortal = wtbPortal || {};

(function($, ATVI) {

    var bp = wtbPortal.battlepassStore = wtbPortal.battlepassStore || {},
        defaultBundle = 'basic',
        bundlesObj = {},
        buttonTextIdObj = {
            'buy'	: {'textId': 'buy'},
            'psn'	: {'textId': 'ps'},
            'xbl'	: {'textId': 'ms'},
            'battle': {'textId': 'battlenet'}
        };

    // update itemName with each season
    bundlesObj.psn = [{cmsId: 'basic', itemName: 'battle_pass_upgrade_5'}, {cmsId: 'bundle', itemName: 'battle_pass_upgrade_bundle_5'}];
	bundlesObj.xbl = [{cmsId: 'basic', itemName: 'battle_pass_upgrade_5'}, {cmsId: 'bundle', itemName: 'battle_pass_upgrade_bundle_5'}];
    bundlesObj.battle = [{cmsId: 'basic', itemName: 'battle_pass_upgrade_5'}, {cmsId: 'bundle', itemName: 'battle_pass_upgrade_bundle_5'}];

    bp.$wrapper = '';
    bp.els = {};
    bp.purchasables = undefined;
    bp.currentBundleObj = {};
    bp.apiAttempts = 0;
    bp.apiAttemptsMax = 4;

    bp.currentSeasonKey = 'loot_season_5'; // update with each season
    bp.currentGameKey = 'vg'; // update with new title/game release

    bp.consts = {};

    bp.consts.USERDATAPROCESSED_class = 'user-data-processed';
    bp.consts.INSUFFICIENTFUNDS_class = 'insufficient-funds';
    bp.consts.SUFFICIENTFUNDS_class = 'sufficient-funds';
    bp.consts.ALREADYPURCHASED_class = 'already-purchased';
    bp.consts.NOLINKEDACCOUNT_class = 'no-linked-account';
    bp.consts.NOCURRENTGAME_class = 'no-current-game';
    bp.consts.EMPTYDATA_class = 'empty-data';
    bp.consts.ERRORMESSAGE_class = 'error';
    bp.consts.SELECTEDTOUT_class = 'active';

    bp.consts.TRANSACTIONSTATUS_data = 'transaction-status';

    bp.utils = {};
    bp.utils.transactionToutClasses = [
        bp.consts.USERDATAPROCESSED_class,
        bp.consts.INSUFFICIENTFUNDS_class,
        bp.consts.SUFFICIENTFUNDS_class,
        bp.consts.ALREADYPURCHASED_class,
        bp.consts.ERRORMESSAGE_class,
        bp.consts.EMPTYDATA_class,
        bp.consts.NOLINKEDACCOUNT_class
    ];

    var ld = ATVI.localeDetector;

    ld.getCountry(function(d) {
        bp.currentCountry = d;
    });

    var access = wtbPortal.accessibility;

    var init = function() {
        defineContext();
        buildElsObj();
        addHandlers();
        applyDefaultSelection();
        addAccessibilityAttributes();
    };

    var defineContext = function() {
        bp.$wrapper = $('.portal-screen-container.battlepass.bundle-selection');
    };

    var buildElsObj = function() {
        bp.els.$touts = bp.$wrapper.find('.wtb-portal-tout');
        bp.els.$toutLinks = bp.els.$touts.find('.tout-link');
        bp.els.$transactionTout = bp.$wrapper.find('.wtb-portal-tout.transaction');
        bp.els.$buyButton = bp.els.$transactionTout.find('.purchase-cta-container .cta-link');
        bp.els.$accountTotalEl = bp.els.$transactionTout.find('.message-container .result-container .message');
        bp.els.$insufficientFundsMessageEl = bp.els.$transactionTout.find('.insufficient-funds-message');

        $.each(bundlesObj, function() {
            var arr = $(this), i;
            for (i = 0; i < arr.length; i++) {
                var thisNode = arr[i],
                    $tout = bp.els.$touts.filter('.battlepass.' + thisNode.cmsId);
                thisNode.$costEl = $tout.find('.battlepass-cost p');
                thisNode.$tout = $tout;
            }
        });
    };

    var applyDefaultSelection = function() {
        var defaultNode = bundlesObj.psn, i;
        for (i = 0; i < defaultNode.length; i++) {
            if (defaultNode[i].cmsId == defaultBundle) {
                defaultNode[i].$tout.addClass(bp.consts.SELECTEDTOUT_class);
                bp.currentBundleObj = defaultNode[i];
                break;
            }
        }
    };

    var addAccessibilityAttributes = function() {
        access.assign.ariaHidden(bp.els.$buyButton.find('span').add(bp.els.$insufficientFundsMessageEl));
    };

    var addHandlers = function() {

        $.each(bp.els.$toutLinks, function() {
            var $thisLink = $(this);
            $thisLink.on('click', function(e) {
                e.preventDefault();
                var $parentTout = $thisLink.closest('.wtb-portal-tout'),
                    id = $thisLink.data('battlepass-id');
                if ($parentTout.hasClass(bp.consts.SELECTEDTOUT_class)) return;
                bp.els.$touts.removeClass(bp.consts.SELECTEDTOUT_class);
                $parentTout.addClass(bp.consts.SELECTEDTOUT_class);
                updateCurrentBundle(id);
                updateTransactionStatus();
            });
        });

        bp.els.$buyButton.on('click', function(e) {

            if (bp.els.$transactionTout.hasClass(bp.consts.SUFFICIENTFUNDS_class)) {
                e.preventDefault();
                purchaseItem(bp.currentBundleObj.itemName);
                updateDataLayer(wtbPortal.user.data.game, bp.currentBundleObj.itemName);
                return;
            }

            if (bp.els.$transactionTout.hasClass(bp.consts.ALREADYPURCHASED_class)) {
                wtbPortal.screens.assignCurrentSubScreen(2);
            }
        });

        bp.els.$insufficientFundsMessageEl.find('a').on('click', function(e) {
            e.preventDefault();
            wtbPortal.user.getCurrency(function() {
                populateCurrencyField();
                updateTransactionStatus();
            });
        });
    };

    var filterPurchaseButton = function() {
        var $spans = bp.els.$buyButton.find('span'),
            $tout = bp.els.$transactionTout,
            $activeEl;
        $spans.removeClass('active');
        access.assign.ariaHidden($spans);
        if ($tout.hasClass(bp.consts.INSUFFICIENTFUNDS_class)) {
            $activeEl = $spans.filter(function() {
                return $(this).data(bp.consts.TRANSACTIONSTATUS_data) == buttonTextIdObj[wtbPortal.user.data.platform].textId;
            });
            $activeEl.addClass('active');
            access.assign.ariaVisible($activeEl);
            return;
        }
        if ($tout.hasClass(bp.consts.SUFFICIENTFUNDS_class)) {
            $activeEl = $spans.filter(function() {
                return $(this).data(bp.consts.TRANSACTIONSTATUS_data) == 'buy';
            });
            $activeEl.addClass('active');
            access.assign.ariaVisible($activeEl);
            return;
        }
        if ($tout.hasClass(bp.consts.ALREADYPURCHASED_class)) {
            $activeEl = $spans.filter(function() {
                return $(this).data(bp.consts.TRANSACTIONSTATUS_data) == 'already-purchased';
            });
            $activeEl.addClass('active');
            access.assign.ariaVisible($activeEl);
            return;
        }
    };

    var updatePurchaseButtonHref = function() {
        if (wtbPortal.user.data.purchasedBattlePass) {
            if (!bp.els.$transactionTout.hasClass(bp.consts.ALREADYPURCHASED_class)) {
                bp.els.$transactionTout.addClass(bp.consts.ALREADYPURCHASED_class)
            }
            var url = 'https://my.callofduty.com/player/battlepass';
            bp.els.$buyButton.attr({'href': url, 'target': '_blank'});
            return;
        }

        if (!wtbPortal.user.data.sufficientFunds) {
            var url = getVendorUrl() || '#';
            bp.els.$buyButton.attr({'href': url, 'target': '_blank'});
            return;
        }
    };

    var updateCurrentBundle = function(id) {
        var i;
        if (!id) {
			bp.currentBundleObj = bundlesObj[wtbPortal.user.data.platform][0];
            return;
        }
        for (i = 0; i < bundlesObj[wtbPortal.user.data.platform].length; i++) {
            if (bundlesObj[wtbPortal.user.data.platform][i].itemName == id) {
                bp.currentBundleObj = bundlesObj[wtbPortal.user.data.platform][i];
                break;
            }
        }
    };

    var purchaseItem = function(itemName) {
        COD.api.papi.purchaseItem(bp.currentGameKey, wtbPortal.user.data.platform, 'gamer', wtbPortal.user.data.username, itemName, function(d) {
            console.log('purchased ' + d.name);
            wtbPortal.screens.assignCurrentSubScreen(2);
        }, function() {
            console.log('There was a problem purchasing this item.');
        });
    };

    var populateBundleFields = function() {
        var i;
        for (i = 0; i < bundlesObj[wtbPortal.user.data.platform].length; i++) {
            var thisBundle = bundlesObj[wtbPortal.user.data.platform][i];
            thisBundle.$costEl.html('&nbsp;' + thisBundle.cost + '&nbsp;');
        }
    };

    var populateCurrencyField = function() {
        var val = (wtbPortal.user.data.currency >= 0) ? wtbPortal.user.data.currency : 0;
        bp.els.$accountTotalEl.text(val);
    };

    var processBattlePassBundleData = function() {
        if ($.isEmptyObject(bp.purchasables)) return;
        var obj = bp.purchasables.lootStream[bp.currentSeasonKey],
            platform = wtbPortal.user.data.platform,
            i;
        for (i = 0; i < bundlesObj[platform].length; i++) {
            var bundle = bundlesObj[platform][i];
            bundle.cost = obj[bundle.itemName].cost;
        }
		updateCurrentBundle();
    };

    var calculatePurchasingPower = function() {
        var classesArr = [bp.consts.USERDATAPROCESSED_class],
            cost = bp.currentBundleObj.cost,
            currency = wtbPortal.user.data.currency,
            sufficiency;
        bp.els.$transactionTout.removeClass(bp.utils.transactionToutClasses.join(' '));
        access.assign.ariaHidden(bp.els.$insufficientFundsMessageEl);

        if (wtbPortal.user.data.purchasedBattlePass) closeShop();
        if (currency == undefined) {
            sufficiency = bp.consts.ERRORMESSAGE_class;
            wtbPortal.user.data.sufficientFunds = false;
        } else if (currency < cost) {
            sufficiency = bp.consts.INSUFFICIENTFUNDS_class;
            wtbPortal.user.data.sufficientFunds = false;
        } else {
            sufficiency = bp.consts.SUFFICIENTFUNDS_class;
            wtbPortal.user.data.sufficientFunds = true;
        }

        classesArr.push(sufficiency);
        bp.els.$transactionTout.addClass(classesArr);
        if (sufficiency == bp.consts.INSUFFICIENTFUNDS_class) access.assign.ariaVisible(bp.els.$insufficientFundsMessageEl);
    };

    var updateTransactionStatus = function() {
        if (!wtbPortal.user.data.linkedAccount) {
            bp.els.$transactionTout.addClass(bp.consts.NOLINKEDACCOUNT_class);
            return;
        }
        if (!isQualified()) {
			bp.els.$transactionTout.addClass(bp.consts.NOCURRENTGAME_class);
            return;
        }
        if (wtbPortal.user.data.purchasedBattlePass) {
            closeShop();
            return;
        }
        calculatePurchasingPower();
        filterPurchaseButton();
        updatePurchaseButtonHref();
    };

    var getVendorUrl = function() {
        var d = bp.data.vendorUrls;
        return d[wtbPortal.user.data.platform] || false;
    };

    var closeShop = function() {
        if (bp.els.$transactionTout.hasClass(bp.consts.ALREADYPURCHASED_class)) return;
        bp.els.$transactionTout
            .removeClass(bp.utils.transactionToutClasses.join(' '))
            .addClass(bp.consts.ALREADYPURCHASED_class);

        populateCurrencyField();
        filterPurchaseButton();
        updatePurchaseButtonHref();
    };

    var updateDataLayer = function(gameId, bundleId) {
        if (dataLayer) {
            bundleId = (bundleId.indexOf('bundle') > -1) ? 'bpb' : 'bp';
            dataLayer.push({
                event: 'purchase',
                category: 'purchase',
                action: gameId + ':' + bundleId
            });
        }
    };

    var isQualified = function() {
		var d = wtbPortal.user.data,
            game = d.game,
            identities = d.identities,
            i;
        for (i = 0; i < identities.length; i++) {
			if (identities[i].title == bp.currentGameKey || identities[i].activityType == 'wz') return true;
        }
		return false;
    };

    bp.getBattlePassBundles = function() {
        var d = wtbPortal.user.data;
        if (!wtbPortal.user.data.linkedAccount || !isQualified()) {
            updateTransactionStatus();
            return;
        }
        COD.api.papi.getPurchasableItems(bp.currentGameKey, d.platform, d.username, function(res) {
            bp.purchasables = res;
            processBattlePassBundleData();
            populateBundleFields();
            if (wtbPortal.user.data.currency == undefined) {
                wtbPortal.user.getLootStreams(function() {
                    wtbPortal.user.getCurrency(function() {
                        populateCurrencyField();
                        updateTransactionStatus();
                        bp.apiAttempts = 0;
                    });
                });
            } else {
                populateCurrencyField();
                updateTransactionStatus();
                bp.apiAttempts = 0;
            }

        }, function() {
            console.log('Unable to get the Purchasable Items . . . ');
            if (bp.apiAttempts > bp.apiAttemptsMax) {
                // error messaging
                bp.apiAttempts = 0;
            } else {
                bp.apiAttempts += 1;
                setTimeout(function() {
                    wtbPortal.user.getLoggedInState();
                    wtbPortal.user.init(function() {
                        bp.getBattlePassBundles();
                    });
                }, 2000);
            }
        });
    };

    // basic init
    $(init);

    // store init
    bp.initStore = function() {
        wtbPortal.initWtbPortal('battlepass', 1);
        wtbPortal.user.getLoggedInState();
        wtbPortal.user.init(function() {
            bp.getBattlePassBundles();
        });
    };

})(jQuery, ATVI);