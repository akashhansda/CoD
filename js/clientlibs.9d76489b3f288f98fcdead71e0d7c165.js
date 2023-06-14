(function() {

    var init = function() {

		initModal();
        initAnalytics();

    }

    var initModal = function() {

        var overlay = $(".cod-pn-cta-modal .cod-pn-wtb-modal");
        var modalContent = overlay.find(".cod-pn-wtb-inner-modal");
        var ctaBtn = $(".cod-pn-cta-modal .cod-pn-modal-btn");
        var closeBtn = overlay.find(".cod-pn-wtb-modal-close");

        //Open modal on cta click
        ctaBtn.on("click", function() {

			openModal($(this));

        });

        //Close modal on modal background click
        $("body").on("click", function(e) {

            console.log("CLICKED:" + e.target);
            if(e.target.classList.contains("cod-pn-wtb-modal")) {
				//$(e.target).removeClass("active");
                $(e.target).fadeOut();
            }

        });

    	//Close modal on close button click
        closeBtn.click(function(e) {
			closeModal($(this));
        });


    };

    var openModal = function($el) {

        //Update aria expanded 
        $el.attr("aria-expanded", "true");

		//$el.next($(".cod-pn-wtb-modal")).addClass("active");
        $el.next($(".cod-pn-wtb-modal")).fadeIn();

    };

    var closeModal = function($el) {

		//$el.closest(".cod-pn-wtb-modal").removeClass("active");
        $el.closest(".cod-pn-wtb-modal").fadeOut(function() {

			//Update aria expanded 
                var modalId = $el.closest(".cod-pn-wtb-modal").attr("id");
                $("button[aria-controls='" + modalId + "']").attr("aria-expanded", "false");

        });

    };

    var initAnalytics = function() {

        if (!digitalData || !dataLayer) return;
        var d = digitalData.page;

        var ctaItems = $(".cod-pn-cta-modal .cod-pn-modal-btn");

		ctaItems.each(function() {

            let curHref = 'button'; 
            let fullHref = (curHref.startsWith("https:") || curHref == 'button') ? curHref : window.location.origin + curHref;
            let ctaName = $(this).attr("data-entext") || $(this).text().trim(); //text in cta
            let parentModule = ($(this).closest(".atvi-module-container[data-analytics-container]").length > 0) ? $(this).closest(".atvi-module-container[data-analytics-container]") : $(this).closest(".atvi-module-container[id]"); //get closest element that has data-analytics-container or .atvi-module-container element that has ID attribute
            let moduleName = parentModule.data("analytics-container") || parentModule.attr("id") || "atvi-module"; //if it cant find an .atvi-module-container element that has an ID or data-analytics, then by default use 'atvi-module' for name

            let aObj = {

                event: 'interaction', 
                action: moduleName + ":" + ctaName,
                category: 'interaction:' + d.pageInfo.pageName,
                label: ctaName

            };

            $(this).on("click", function() {

                dataLayer.push(aObj);

            });

        });


        //Platform click

        var $platformBtns = $(".cod-pn-wtb-modal .cod-pn-modal-platforms li a");

        $platformBtns.on("click", function() {

            var ev = "purchase";
            var cat = "purchase";
            var action = "wz:" + $(this).data("platform");
            var label = "standard:" + $(this).attr("href");
            var destinationURL = $(this).attr("href");
            var itpType = "purchase";
            var plat = $(this).data("platform");
            var prodBundle = "standard";
            var purchaseLink = $(this).attr("href");

            var platObj = {

                event: ev,
                category: cat,
                action: action,
                label: label,
                destinationURL: destinationURL,
                itpType: itpType,
                platform: plat,
                productBundle: prodBundle,
                purchaseLink: purchaseLink,
                gameName: "wz",
                pageURL: window.location.href

            };

            dataLayer.push(platObj);

        });

    };

	$(init);

})();
