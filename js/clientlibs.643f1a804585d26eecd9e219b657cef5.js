/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*   https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html
*/
(function () {

    var tablist, tabs, panels, delay;

    var init = function() {
        tablist = $("[role='tablist']");
        tabs;
        panels;
        delay = 0;
        generateArrays();
    }

    function generateArrays () {
        tabs = $("[role='tab']");
        panels = $("[role='tabpanel']");

        // Bind listeners
        for (i = 0; i < tabs.length; ++i) {
            addListeners(i);
        };
    };
    
    // For easy reference
    var keys = {
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        delete: 46
    };
    
    // Add or substract depending on key pressed
    var direction = {
        37: -1,
        38: -1,
        39: 1,
        40: 1
    };


    function addListeners (index) {
        tabs[index].addEventListener('click', clickEventListener);
        tabs[index].addEventListener('keydown', keydownEventListener);
        tabs[index].addEventListener('keyup', keyupEventListener);
        
        // Build an array with all tabs (<button>s) in it
        tabs[index].index = index;
    };
    
    // When a tab is clicked, activateTab is fired to activate it
    function clickEventListener (event) {
        var tab = event.target;
        activateTab(tab, false);
    };
    
    // Handle keydown on tabs
    function keydownEventListener (event) {
        var key = event.keyCode;
        
        switch (key) {
            case keys.end:
                event.preventDefault();
                // Activate last tab
                activateTab(tabs[tabs.length - 1]);
                break;
            case keys.home:
                event.preventDefault();
                // Activate first tab
                activateTab(tabs[0]);
                break;
                
                // Up and down are in keydown
                // because we need to prevent page scroll >:)
            case keys.up:
            case keys.down:
                determineOrientation(event);
                break;
        };
    };
    
    // Handle keyup on tabs
    function keyupEventListener (event) {
        var key = event.keyCode;
        
        switch (key) {
            case keys.left:
            case keys.right:
                determineOrientation(event);
                break;
            case keys.delete:
                determineDeletable(event);
                break;
        };
    };
    
    // When a tablistâ€™s aria-orientation is set to vertical,
    // only up and down arrow should function.
    // In all other cases only left and right arrow function.
    function determineOrientation (event) {
        var key = event.keyCode;
        var vertical = tablist[0].getAttribute('aria-orientation') == 'vertical';
        var proceed = false;
        
        if (vertical) {
            if (key === keys.up || key === keys.down) {
                event.preventDefault();
                proceed = true;
            };
        }
        else {
            if (key === keys.left || key === keys.right) {
                proceed = true;
            };
        };
        
        if (proceed) {
            switchTabOnArrowPress(event);
        };
    };
    
    // Either focus the next, previous, first, or last tab
    // depening on key pressed
    function switchTabOnArrowPress (event) {
        var pressed = event.keyCode;
        
        for (x = 0; x < tabs.length; x++) {
            tabs[x].addEventListener('focus', focusEventHandler);
        };
        
        if (direction[pressed]) {
            var target = event.target;
            if (target.index !== undefined) {
                if (tabs[target.index + direction[pressed]]) {
                    tabs[target.index + direction[pressed]].focus();
                }
                else if (pressed === keys.left || pressed === keys.up) {
                    focusLastTab();
                }
                else if (pressed === keys.right || pressed == keys.down) {
                    focusFirstTab();
                };
            };
        };
    };
    
    // Activates any given tab panel
    function activateTab (tab, setFocus) {
        setFocus = setFocus || true;
        // Deactivate all other tabs
        deactivateTabs();
        
        // Remove tabindex attribute
        tab.removeAttribute('tabindex');
        
        // Set the tab as selected
        tab.setAttribute('aria-selected', 'true');
        
        // Get the value of aria-controls (which is an ID)
        var controls = tab.getAttribute('aria-controls');
        
        // Remove hidden attribute from tab panel to make it visible
        document.getElementById(controls).removeAttribute('hidden');
        
        // Set focus when required
        if (setFocus) {
            tab.focus();
        };
    };
    
    // Deactivate all tabs and tab panels
    function deactivateTabs () {
        for (t = 0; t < tabs.length; t++) {
            tabs[t].setAttribute('tabindex', '-1');
            tabs[t].setAttribute('aria-selected', 'false');
            tabs[t].removeEventListener('focus', focusEventHandler);
        };
        
        for (p = 0; p < panels.length; p++) {
            panels[p].setAttribute('hidden', 'hidden');
        };
    };
    
    // Make a guess
    function focusFirstTab () {
        tabs[0].focus();
    };
    
    // Make a guess
    function focusLastTab () {
        tabs[tabs.length - 1].focus();
    };
    
    // Detect if a tab is deletable
    function determineDeletable (event) {
        target = event.target;
        
        if (target.getAttribute('data-deletable') !== null) {
            // Delete target tab
            deleteTab(event, target);
            
            // Update arrays related to tabs widget
            generateArrays();
            
            // Activate the closest tab to the one that was just deleted
            if (target.index - 1 < 0) {
                activateTab(tabs[0]);
            }
            else {
                activateTab(tabs[target.index - 1]);
            };
        };
    };
    
    // Deletes a tab and its panel
    function deleteTab (event) {
        var target = event.target;
        var panel = document.getElementById(target.getAttribute('aria-controls'));
        
        target.parentElement.removeChild(target);
        panel.parentElement.removeChild(panel);
    };


    //
    function focusEventHandler (event) {
        var target = event.target;
        
        setTimeout(checkTabFocus, delay, target);
    };
    
    // Only activate tab on focus if it still has focus after the delay
    function checkTabFocus (target) {
        focused = document.activeElement;
        
        if (target === focused) {
            activateTab(target, false);
        };
    };

	$(init);

})();

var HUB = HUB || {};

(function($, HUB) {

	var mode;

    var init = function() {

        if(window.innerWidth <= 768) mode = "mobile";
        else mode = "desktop";

        //Load "all" blog items on page load
        filterNews("all");

        //Init filter buttons
        initFilter();

        //Init resize
        resize();



    };

    var filterNews = function(game) {

		$("#cod-hub-news .latest-news").attr("data-game", game);

        var $newsGroup = $("#cod-hub-news .news-content .news-group"); //grab all news group divs

        $newsGroup.filter(".slick-initialized").slick('unslick'); //destroy the current carousel
        $newsGroup.removeClass("active").hide(); //hide all carousels

        var $selectedNewsGroup = $newsGroup.filter("[data-category='" + game + "']");
        $selectedNewsGroup.addClass("active").show(); //show news group panel

        //Init mobile images
        if(mode == "mobile") {
            $selectedNewsGroup.find("img[data-lazy]:not([src])").each(function() {
    
                var src = $(this).data("lazy");
                $(this).attr("src", src);
    
            });
        }

        //Init Carousel
        initCarousel($selectedNewsGroup);

    };

    var initFilter = function() {

        var $btn = $("#cod-hub-news .news-header-filter button");

        $btn.click(function() {

			var game = $(this).attr("data-game");

            filterNews(game);

        });

    };

    var initCarousel = function($el) {

        var dir = (ATVI.pageLocale == "ar") ? true : false;

        if(window.innerWidth > 768) {

				$el.slick({
                    infinite: true,
                    lazyLoad: 'ondemand',
                    direction: dir,
                    arrows: true,
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    responsive: [
                        {
                          breakpoint: 1024,
                          settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1
                          }
                        }

                    ]
                });

        }

    };


    var resize = function() {

        $(window).resize(function() {

            var $curNewsGroup = $("#cod-hub-news .news-content .news-group.active"); //grab current news group carousel

            if(window.innerWidth > 768 && mode == 'mobile') {

				mode = "desktop";

				initCarousel($curNewsGroup);

            }

            else if(window.innerWidth <= 768 && mode == 'desktop') {

				mode = "mobile";

				$curNewsGroup.slick("unslick");

            }

        });

    };

    $(init);

})(jQuery, HUB);







