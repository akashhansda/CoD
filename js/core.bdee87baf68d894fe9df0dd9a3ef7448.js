var HUB = HUB || {};

(function($, HUB) {

    var init = function() {
        //initPurchase();
        //updateVanguardLinks();
    };

    var initPurchase = function() {

        var $btn = $(".cod-purchase a");

        $btn.click(function(e) {

            e.preventDefault();
            var $target = $(".portal-screen-container");

			$('html,body').animate({
                scrollTop: $target.offset().top - 50
            }, 1000);

            wtbPortal.screens.setFocus();

        });

    };

    var addWtbTabHandler = function() {
        document.addEventListener('wtbScreensReady', function() {
            wtbPortal.screens.addTabLimiters = function() {
                var screens = wtbPortal.screens,
                    subscreens = screens.getAllScreens();
                
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
                            if ($el.is(wtbPortal.screens.screensObj.initial.$screens.find('a').last())) {
								var $anchors = wtbPortal.screens.screensObj.initial.$screens.find('a');
								$('.subscribe-inner-modal #modal-email').focus();
                                e.preventDefault();
                            } else {
                                screens.setFocus($collection.first());
                                e.preventDefault();
                            }
                        }
                    });
                }
            };

            $('.subscribe-inner-modal #modal-email').on('keydown', function(e) {
                if (e.which == 9 && e.shiftKey) wtbPortal.screens.setFocus();
            });
        });
    };

    var updateVanguardLinks = function() {

		$(".root a").each(function() {

			var url = $(this).attr("href");
            var myarr = url.split("/");

            if(myarr.length > 7 && url.indexOf("/callofduty/vanguard/web") > 0) {
                var game = myarr[4];
                var lang = myarr[6];
                var page = myarr[7];

                var newUrl;

                if(lang == "en_gb")       lang = "uk/en";
                else if(lang == "en_ca")  lang = "ca/en";
                else if(lang == "en_au")  lang = "au/en";
                else if(lang == "en_nz")  lang = "nz/en";
                else if(lang == "fr_ca")  lang = "ca/fr";
                else if(lang == "en_ar")  lang = "ar/en";
                else if(lang == "fr_be")  lang = "be/fr";
                else if(lang == "es_mx")  lang = "mx/es";
                else if(lang == "pt_br")  lang = "br/pt";
                else if(lang == "nl_be")  lang = "be/nl";
                else if(lang == "zh_tw")  lang = "tw/zh";
                else if(lang == "zh_cn")  lang = "cn/zh";
    
                if(lang == "en") newUrl = "/" + game + "/" + page;
                else             newUrl = "/" + lang + "/" + game + "/" + page;

                $(this).attr("href", newUrl.replace(".html","").replace("/home",""));
            }

        });

    };

    addWtbTabHandler();

    $(init);

})(jQuery, HUB);

