var wtbPortal = wtbPortal || {};

(function($, ATVI) {

	var $context,
        iosUrl = 'https://app.appsflyer.com/id1287282214?pid=Community&c=Community_COD-Web',
        androidUrl = 'https://app.appsflyer.com/com.activision.callofduty.shooter?pid=Community&c=Community_COD-Web';


    var init = function() {
        defineContext();
        addIdClass();
		addHandlers();
        addDataAttributes();
        updateDom();
    };

    var defineContext = function() {
		$context = wtbPortal.screens.screensObj['initial'].$parentEl;
    };

    var addIdClass = function() {
        $.each($context.find('.title-tout-link'), function() {
            var $thisLink = $(this);
               $thisLink.closest('.experiencefragment').addClass($thisLink.attr('data-title-id'));
        });
    };

    var addHandlers = function() {
		var $toutLinks = $context.find('.tout-link');
        $.each($toutLinks, function() {
			var $thisLink = $(this),
                id = $thisLink.data('title-id');
            $thisLink.on('click', function(e) {
				e.preventDefault();
                if (id == 'battlepass') {
                    handleBattlepassClick(id);
                    return;
                }
                if (id == 'cod-mobile') {
                    handleCodMobileClick(id);
                }
                wtbPortal.screens.assignCurrentScreenPath(id);
                wtbPortal.screens.assignCurrentSubScreen(0);
            });
        });
    };

    var addDataAttributes = function() {
        var attrObj = {};
        attrObj['data-' + wtbPortal.constants.BUTTONTEXT_data] = 'download';
        attrObj['data-' + wtbPortal.constants.BUNDLEID_data] = 'cod-mobile';
        attrObj['data-' + wtbPortal.constants.REGIONID_data] = ATVI.pageLocale;
        if (ATVI.browser.isIos || ATVI.browser.isAndroid) {
            attrObj['data-' + wtbPortal.constants.RETAILERID_data] = (ATVI.browser.isIos) ? 'ios' : 'android';
            attrObj['data-' + wtbPortal.constants.PLATFORMID_data] = (ATVI.browser.isIos) ? 'ios' : 'android';
        } else {
            attrObj['data-' + wtbPortal.constants.RETAILERID_data] = 'none';
            attrObj['data-' + wtbPortal.constants.PLATFORMID_data] = 'none';
        }
		$context.find('.tout-link.cod-mobile').attr(attrObj);
    };

    var handleBattlepassClick = function(id) {
        wtbPortal.user.init(function() {
			wtbPortal.battlepassStore.initStore();
            if (!wtbPortal.user.loggedIn) {
                var baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname,
                    url = wtbPortal.loginUrl[ATVI.pageEnv] + encodeURIComponent(baseUrl) + encodeURIComponent('?wtbPortalPath=battlepass&wtbPortalScreen=1');
                window.location.assign(url);
            } else {
                wtbPortal.screens.assignCurrentScreenPath(id);
                wtbPortal.screens.assignCurrentSubScreen(1);
            }
        });

    };

    var handleCodMobileClick = function(id) {
        if (ATVI.browser.isIos) {
    		window.open(iosUrl);
        }
        if (ATVI.browser.isAndroid) {
			window.open(androidUrl);
        }
    };

    var updateDom = function() {
        // remove promo
		//$context.find('.promo-disclaimer-text').remove();

        $context.find('.wtb-portal-tout .promo-text').parent('.atvi-text').addClass('no-pointer-event');

        if (window.location.href.indexOf('/it/') > -1 || $('html').attr('lang').toLowerCase() == 'it') {
            var $textEl = $('<div>', { class: 'disclaimer', text: '†Offre la possibilità di effettuare acquisti opzionali' });

            if ($context.find('.promo-disclaimer-text').length) {
                var $targetEl = $context.find('.promo-disclaimer-text');
                $targetEl.append($textEl);
            } else {
                var $listEl = $context.find('.layout-container-element.screen-touts');
                $listEl.append($textEl);
            }
        }
	};

    $(init);

})(jQuery, ATVI);