var HUB = HUB || {};

(function($, HUB) {

    var pageTop;

    var init = function() {
		$(window).on("load", addHandlers);
		initMobileMenu();
        initSSO();
        initScroll();
		initResize();
        initFocus();
    };

    var addHandlers = function() {
		var $globalNav = $('.cod-global-header, .mobile-global-nav'),
            $gameNav = $('.cod-game-header, .mobile-game-nav');

        $globalNav.find("a").each(function() {

            var that = $(this);
            that.click(function(e) {

				if ($(this).parent('div').hasClass('logo')) updateDataLayer($(this), 'sub nav');
                else if ($(this).parent('.cod-purchase')) {
                    // Purchase button clicked...add intent event
                    if (dataLayer) {
                        dataLayer.push({    
                            event: "event", // intent
                            category: "navigation", // purchase-intent
                            itpType: $(this).data('label'), 
                            action: "main nav",
                            label: $(this).data('label'),
                            pageURL: window.location.href,
                            gameName: ATVI.dataLayerGameName,
                            purchaseLink: $(this).attr('href')
                        });
                    }
                }
                else updateDataLayer($(this), 'main nav');

            });

        });

        /*$globalNav.find('a').on('click', function() {
			if ($(this).parent('div').hasClass('logo')) updateDataLayer($(this), 'sub nav');
            else updateDataLayer($(this), 'main nav');
            if ($(this).parent('.cod-purchase')) {
				// Purchase button clicked...add intent event
                if (dataLayer) {
                    dataLayer.push({    
                        event: "intent",
                        category: "purchase-intent",
                        itpType: $(this).data('label'), 
                        action: "nav-cta",
                        label: ATVI.dataLayerGameName,
                        pageURL: window.location.href,
                        gameName: ATVI.dataLayerGameName,
                        platform: "",
                        productBundle: "",
                        purchaseLink: $(this).attr('href'),
                    });
                }
            }
        });*/

        $gameNav.find('a').each(function() {

            var that = $(this);
            that.click(function() {
				updateDataLayer($(this), 'sub nav');
            });

        });

        /*$gameNav.find('a').on('click', function() {
            updateDataLayer($(this), 'sub nav');
        });*/

        //Purchase buttons
        /*$(".cod-purchase a").click(function() {
			if (dataLayer) {
                dataLayer.push({    
                    event: "intent",
                    category: "purchase-intent",
                    itpType: $(this).data('label'), 
                    action: "nav-cta",
                    label: ATVI.dataLayerGameName,
                    pageURL: window.location.href,
                    gameName: ATVI.dataLayerGameName,
                    purchaseLink: $(this).attr('href'),
                });
            }

        });*/

    };

    var updateDataLayer = function($el, action) {
        if (dataLayer) {
            var labelStr = ($el.data('label')) ? $el.data('label') : 'undefined',
                obj = {};
            obj.event = 'event',
            obj.category = 'navigation';
            obj.action = action;
            obj.label = labelStr;
            obj.destinationURL = $el.attr('href');
            obj.pageURL = window.location.href;
            if($el.attr('href').indexOf('/blog') == -1 && $el.attr('href').indexOf('callofdutyleague.com') == -1 && $el.attr('href').indexOf('support.activision') == -1 && !$el.is('.sso-login, .sso-signup, .sso-profile, .sso-logout, .mycod-btn a, .cod-purchase a')) {
                    obj.gameName = (action == 'main nav') ? $el.data('label') : ATVI.dataLayerGameName;
            }
            dataLayer.push(obj);
        }
    };

    var initFocus = function() {

		var $ddMenu = $("a[aria-haspopup='true']");

        $ddMenu.focus(function() {
			console.log("I am focused");
        });

    };

    var initMobileMenu = function() {

        //open menu
        var $burger = $(".mobile-burger");
        var $mobileHeader = $(".mobile-header");

        var pageTop;

        $burger.click(function(e) {
            if($mobileHeader.hasClass("active")) closeMobileMenu();
            else openMobileMenu();
        });

        //mobile sub menus

        $(".mobile-header li.dd > a[aria-haspopup='true'] > img").on("click", function(e) {
			e.preventDefault();
            e.stopPropagation();

            $(this).parent().parent().toggleClass("active");

        });

        $(".mobile-header li > a").on("click", function(e) {
            console.log('click');
            const link = $(this).attr('href');
            // Toggle active class for dd's without a link
            if($(this).parent().hasClass('dd') && !link || link.trim() == '#') {
                e.preventDefault();
                $(this).parent().toggleClass("active");
            }
            else {
                // make sure to close menu for relative links
				closeMobileMenu();
            }

        });


        //mobile drop down accessibility

        $("a[aria-haspopup='true']").on("keyup", function(e) {

            if (e.keyCode === 13) {

				e.preventDefault();
            	
                if($(this).attr("aria-expanded") == "false") {

                    $(this).attr("aria-expanded", "true");
                    $(this).parent().addClass("active");
    
                }
                else {
                    $(this).attr("aria-expanded", "false");
                    $(this).parent().removeClass("active");
                }

            } 


        });

    };

    var openMobileMenu = function() {
		var $burger = $(".mobile-burger");
        var $mobileHeader = $(".mobile-header");

        $burger.attr("aria-expanded", "true");

        $burger.addClass("active");
        $mobileHeader.find(".mobile-panel").show().delay(500);
        $mobileHeader.addClass("active");

    };

    var closeMobileMenu = function() {

        var $burger = $(".mobile-burger");
        var $mobileHeader = $(".mobile-header");

        $burger.attr("aria-expanded", "false");

        $burger.removeClass("active");
        $mobileHeader.removeClass("active");

        $mobileHeader.find(".mobile-panel").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
        	$(this).delay(1000).queue(function() {  // Wait for 1 second.
                $(this).hide();
        	});
    	});

    };
    var ssoTimeout = function() {
        setTimeout(function() {
            if (!(ssobar && ssobar.user && ssobar.user.isAuthenticated && ssobar.user.isLoggedIn)) { 
                updateAccountLinksFromSso(); 
            }
        }, 2000);
    }

    var initSSO = function() {
        var sb = window.ssobar;
        if(sb) {
            ssoTimeout();
            sb.onAuthentication(function() {
                clearTimeout(ssoTimeout);
                sb.onReady(updateAccountLinksFromSso);
            });
        }
        else {
			//$(".cod-global-header-container .mycod-link ul.logged-in").remove();
        }

    };

    var updateAccountLinksFromSso = function() {
        var $body = $("body");

        try {
            if(window.ssobar.user.isLoggedIn) {
                $body.addClass("sso-logged-in");
            }
        } catch(e) {}
        
        setTimeout(function() {
            $body.addClass("sso-auth-known"); 
        }, 20);

        //$(".sso-login").attr("href", ssobar.getLoginUrl() + "&" + "utm_source=redirect&utm_medium=cod&lang=" + ATVI.pageLocale.replace("-","_"));
        //$(".sso-signup").attr("href", ssobar.getSignupUrl() + "&" + "utm_source=redirect&utm_medium=cod&lang=" + ATVI.pageLocale.replace("-","_"));
	    $(".sso-login").attr("href", ssobar.getLoginUrl());
        $(".sso-signup").attr("href", ssobar.getSignupUrl());
        $(".sso-profile").attr("href", ssobar.getCompleteProfileUrl());
        $(".sso-logout").attr("href", ssobar.getLogoutUrl());

        if (window.location.host.indexOf("stage") == 0) {
			var infoLink = $(".sso-info").attr("href").replace("profile", "dev"),
                prefLink = $(".sso-preference").attr("href").replace("profile", "dev");
            $(".sso-info").attr("href", infoLink);
            $(".sso-preference").attr("href", prefLink);
        }
    };

    var initScroll = function() {

        var $header = $(".cod-header-container.double-header");

        var lastScrollTop = 0;

        $(window).scroll(function(e) {

            if(window.innerWidth > 1200) {

                var st = $(this).scrollTop();

                if(st > 300) {

                    if(st > lastScrollTop) {
                        // downscroll code
                        $header.addClass("g-collapse");
                        //$('body').addClass("header-collapse");
                        //$(".cod-global-header-container .desktop-header .nav-right .login").removeClass("active");
                    }
                    else {
                        // upscroll
                        $header.removeClass("g-collapse");
                        //$('body').removeClass("header-collapse");
                    }
                }

                else {
					$header.removeClass("g-collapse");
                    //$('body').removeClass("header-collapse");
                }

                lastScrollTop = st;

            }

            else {
				$header.removeClass("g-collapse");
                //$('body').removeClass("header-collapse");
            }

        });

        /*$header.find(".collapse-btn").click(function() {
            $header.addClass("g-active");
            $('body').addClass("header-collapse");
        });*/

    };

    var initResize = function() {

        $(window).resize(function() {

            if(window.innerWidth > 1200) {

                if($(".mobile-header").hasClass("active")) {
					closeMobileMenu();
                }

            }

        });

    };

    $(init);

})(jQuery, HUB);
// COD GLOBAL PLAYER PROFILE

var COD = COD || {}; 

(function($, COD) {

    COD.menu = COD.menu || {};
    
    var menu = COD.menu;

    var init = function() {
		ssoReady();
    };

    var ssoReady = function() {
        var sb = window.ssobar;
        if(sb) sb.onAuthentication(function() {
            sb.onReady(checkLoginState);
        });

    };

    var checkLoginState = function() {
        var sso = $(".SSO-BAR"); 
        var $body = $("body");

        try {
            if(window.ssobar.user.isLoggedIn) {
                var game = menu.game || getCurGame();
                menu.initPlayerProfile();
                setupMyCodLink();
            }
        } catch(e) {}

    };

	menu.initPlayerProfile = function() { 

        //$(".cod-global-header-container .desktop-header .nav-right .login").addClass("pp-ready");

        var defaultUsername, dataAvailable;
        menu.platformsAvailable = [];
		defaultIdentities = ssobar.user.identities;

        //Grab crm blob cookie from user
		var crmBlobCookie = ATVI.utils.getCookie("CRM_BLOB");
        if(crmBlobCookie) {
        	var decoded = atob(crmBlobCookie);
          	var crmBlob = JSON.parse(decoded);
			menu.crmBlob = crmBlob.plat;
        }

        //Check which platforms user has linked and add to array
        for(var i=0;i < defaultIdentities.length; i++) {

			if(defaultIdentities[i].provider == "psn" || 
               defaultIdentities[i].provider == "xbl" || 
               defaultIdentities[i].provider == "steam") {
				menu.platformsAvailable.push(defaultIdentities[i].provider);
            }
        }

        //Get uno username
        var unoUsername;
        for(var i = 0; i < defaultIdentities.length; i++) {
            if(defaultIdentities[i].provider == "uno") {
                unoUsername = defaultIdentities[i].username;
            }
        }

        //Do the real checking

        if(menu.platformsAvailable.length >= 1) { //if user has at least one major platform linked

            if(!menu.crmBlob) { // if crmBlob is not defined, display uno username only

				$(".cod-global-header-container, .cod-header-container").addClass("no-data");
                defaultUsername = unoUsername;
                dataAvailable = false;
            }

            else { // if crmBlob is working

                //what platforms are available for current game
                menu.platformsAvailableFromGame = getPlatformsAvailableFromGame(menu.game);

                if(menu.platformsAvailableFromGame.length <=0) { //if user does not have game, show forum id
				
                    $(".cod-global-header-container, .cod-header-container").addClass("no-data");
                    defaultUsername = unoUsername;
                    dataAvailable = false;
                    
                }
                else {
                    menu.platform = menu.platformsAvailableFromGame[0]; //get first platform
                    createPlatformDropDown(menu.platformsAvailableFromGame);
                    defaultUsername = getUsername(menu.platform);
                    $(".cod-global-header-container, .cod-header-container").removeClass("no-data");
                    $(".pp-header").find(".platform-selection, .pp-rank").show();
                    $(".pp-header").find(".link-account-btn").hide();
                    $(".pp-header").find(".mycod-cta").show();
                    dataAvailable = true;
                }

            }

        }

        else { //if user has no major platforms linked, display uno username only

			$(".cod-global-header-container, .cod-header-container").addClass("no-data");
            defaultUsername = unoUsername;
            dataAvailable = false;

        }

		//defaultUsername and menu.platform is now available
        menu.fillInPP(defaultUsername, dataAvailable)

    };


    menu.getProfile = function(game, defaultPlatform, gamer, defaultUsername, callback) {

        var obj = {};

        COD.api.papi.crm.profile(game, defaultPlatform, gamer, defaultUsername, function(res) {
            
            var pData    = res;
            obj.username = pData.username;
            obj.level    = pData.mp.level;
            obj.prestige = pData.mp.prestige;
            obj.avatar   = HUB.mycod.methods.getRankIcon(pData.mp, game);
            obj.platform = defaultPlatform;
            
            return callback(obj);
            
        });

    };

    var setupMyCodLink = function() {

		var $cta = $(".pp-header .mycod-cta a");
		var game = menu.game;
        var pageLocale = ATVI.pageLocale;
        var localeAvail = ["en","en_GB", "en_CA", "en_AU", "pt_BR", "es_MX", "it", "es", "de", "fr", "fr_CA"];
		var cleanLocale;

        for(var i = 0; i < localeAvail.length; i++) {

            if(pageLocale == localeAvail[i]) {

                if(pageLocale == "en_GB") {
					cleanLocale == "/uk/en";
                }
                else if(pageLocale == "en_CA") {
                    cleanLocale = "/ca/en";
                }	
                else if(pageLocale == "en_AU") {
                    cleanLocale = "/au/en";
                }
                else if(pageLocale == "pt_BR") {
                    cleanLocale = "/br/pt";
                }
                else if(pageLocale == "es_MX") {
                    cleanLocale = "/mx/es";
                }
                else if(pageLocale == "fr_CA") {
                    cleanLocale = "/ca/fr";
                }
                else if(pageLocale == "en") {
                    cleanLocale = "";
                }
                else {
                    cleanLocale = "/" + localeAvail[i].toLowerCase();
                }

            }
            else {
				cleanLocale = "";
            }

        }

        //var linkString = "https://my.callofduty.com" + cleanLocale + "/" + game + "/dashboard";
        var linkString = "https://my.callofduty.com/dashboard";
        $cta.attr("href", linkString);

    };

	var getPrestige = function(game, platform) {
		var plat;
		if     (platform == "psn")   plat = "p";
		else if(platform == "xbl")   plat = "x";
		else if(platform == "steam") plat = "pc";
		
		return menu.crmBlob[plat]['t'][game]["pres"];
	};
	
	var getLevel = function(game, platform) {
        var plat;
		if     (platform == "psn")   plat = "p";
		else if(platform == "xbl")   plat = "x";
		else if(platform == "steam") plat = "pc";
		return menu.crmBlob[plat]['t'][game]["lev"];
	};
	
	var getUsername = function(platform) {
		var identities = ssobar.user.identities;
		for(var i = 0; i < identities.length; i++) {
			if(identities[i].provider == platform) {
				return identities[i].username;
			} 
		}
	};

    var getRankIcon = function(game, platform) {

        var prestigeIconId = getPrestige(game, platform);
        var levelId = getLevel(game, platform);
        var bo4IcnSrc;

        if (game === 'iw') {
            levelId = levelId < 28 ? Math.ceil(levelId / 3) :
                10 + Math.floor((levelId - 28) / 2);
        } else if (game === 'wwii') { 
            levelId = levelId >= 50 ? levelId = levelId - 31 : 
            levelId >= 40 ?  14 + Math.floor((levelId - 40) / 2) :
                Math.ceil(levelId / 3) ;
        } else if (game === 'bo4') {
			var path = "https://www.callofduty.com/cdn/app/icons/bo4/";
            var mode = 'mp';
            var ext = mode == 'mp' ? '.png' : '_large.png';
            if(prestigeIconId) {
                var prest = prestigeIconId < 10 ? '0'+prestigeIconId : ''+prestigeIconId;
                return path + 'prestige/'+mode+'/ui_icon_'+mode+'_prestige_' + prest + ext;
            }
            else {
                var lvl = levelId < 10 ? '0'+levelId : ''+levelId;
            	return path + 'ranks/'+mode+'/ui_icon_rank_'+mode+'_level' + lvl + ext;
            }
        }


        var iconName = prestigeIconId  ? 'prestige-' + prestigeIconId : 'level-' + levelId;

        var playerIconPath = '/content/dam/atvi/callofduty/mycod/common/player-icons/';
        var imgSrc = playerIconPath + game + '/' + iconName + '.png';
        return imgSrc;
    };
	
	var getPlatformsAvailableFromGame = function(game) {
		
		var platArr = [];


        $.each(menu.crmBlob, function(key,value) {

            if(key == "p") {

				if(game in menu.crmBlob["p"]["t"]) {
                    //user has game	on psn
                    platArr.push("psn");
                }

            } else if (key == "x") {

                if(game in menu.crmBlob["x"]["t"]) {
                    //user has game on xbox
                    platArr.push("xbl");
                }

            } else if (key == "pc") {

                if(game in menu.crmBlob["pc"]["t"]) {
                    //user has game on steam
                    platArr.push("steam");
                }

            }

        });

		return platArr;
		
	};

    var getCurGame = function() {

        var game;
		var url = window.location.href;

        if(url.indexOf("/iw") > 0 || url.indexOf("/infinitewarfare") > 0) game = "iw";
        else if(url.indexOf("/bo3") > 0 || url.indexOf("/blackops3") > 0) game = "bo3";
        else if(url.indexOf("/wwii") > 0) game = "wwii";
        else if(url.indexOf("/blackops4") > 0 || url.indexOf("/bo4") > 0) game = "bo4";
        else game = "bo4";
        menu.game = game;
        return game;

    };

    var createPlatformDropDown = function(platformArr) {

		var $platformSelect = $(".pp-header .platform-selector");
        $platformSelect.find("select").empty();
        $platformSelect.find("select").append("<option disabled='disabled' value='0'>Select an account</option>");

        for(var i = 0; i < platformArr.length; i++) {

            var template = "<option value='" + platformArr[i] + "'>" + getUsername(platformArr[i]) + " (" + platformArr[i] + ")</option>";
            $platformSelect.find("select").append(template);
        }

        $platformSelect.off("change", "select", function() {

        });

        $platformSelect.on("change", "select", function() {

            var val = menu.platform = this.value;

			menu.platformChange(menu.platform); //update flyout menu
            menu.onPlatformChange(menu.platform); //update mycod page info

        });

    };

    menu.fillInPP = function(username, dataAvailable) {

        //pp menu
		var $container = $(".player-profile-menu");

        $(".cod-global-header-container .desktop-header .nav-right .login .username, .username").text(username);
        $container.find(".pp-username").text(username);
        $container.removeClass("iw bo3 wwii bo4").addClass(menu.game);
		if(dataAvailable != false) {
            $container.find(".emblem").show();
			$container.find(".pp-rank .pp-level").text(getLevel(menu.game, menu.platform));
			$container.find(".pp-rank .pp-prestige").text(getPrestige(menu.game, menu.platform));
			$container.find(".platform-selection").removeClass("steam psn xbl").addClass(menu.platform);
            $container.find(".emblem").css("background-image", "url(" + getRankIcon(menu.game, menu.platform) + ")"); 
            //$(".cod-global-header-container .desktop-header .nav-right .login .emblem-sm").css("background-image", "url(" + getRankIcon(menu.game, menu.platform) + ")"); 
			//$(".cod-global-header-container .desktop-header .nav-right .login .account-icon").hide();
        }

    };

    //for flyout menu
    menu.onGameChange = function(game) { //this gets triggered on mycod app end
        menu.game = game;
		menu.initPlayerProfile();
    };

    menu.platformChange = function(platform) { //this gets triggered from flyout menu platform selection to update flyout menu info

        menu.platform = platform;
		var username = getUsername(menu.platform);
        menu.fillInPP(username, dataAvailable);

    };

    //for mycod page info
    menu.onPlatformChange = function(platform) { //this gets triggered from flyout menu platform selection and will be overwritten on mycod app end to update the page info

    };

    $(init);

})(jQuery, COD);


/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/


var Menubar = function (domNode) {
    var elementChildren,
        msgPrefix = 'Menubar constructor argument menubarNode ';
    
    // Check whether menubarNode is a DOM element
    if (!domNode instanceof Element) {
        throw new TypeError(msgPrefix + 'is not a DOM Element.');
    }
    
    // Check whether menubarNode has descendant elements
    if (domNode.childElementCount === 0) {
        throw new Error(msgPrefix + 'has no element children.');
    }
    
    // Check whether menubarNode has A elements
    e = domNode.firstElementChild;
    while (e) {
        var menubarItem = e.firstElementChild;
        if (e && menubarItem && menubarItem.tagName !== 'A') {
            throw new Error(msgPrefix + 'has child elements are not A elements.');
        }
        e = e.nextElementSibling;
    }
    
    this.isMenubar = true;
    
    this.domNode = domNode;
    
    this.menubarItems = []; // See Menubar init method
    this.firstChars = []; // See Menubar init method
    
    this.firstItem = null; // See Menubar init method
    this.lastItem = null; // See Menubar init method
    
    this.hasFocus = false; // See MenubarItem handleFocus, handleBlur
    this.hasHover = false; // See Menubar handleMouseover, handleMouseout
};

/*
*   @method Menubar.prototype.init
*
*   @desc
*       Adds ARIA role to the menubar node
*       Traverse menubar children for A elements to configure each A element as a ARIA menuitem
*       and populate menuitems array. Initialize firstItem and lastItem properties.
*/
Menubar.prototype.init = function () {
    var menubarItem, childElement, menuElement, textContent, numItems;
    
    
    // Traverse the element children of menubarNode: configure each with
    // menuitem role behavior and store reference in menuitems array.
    elem = this.domNode.firstElementChild;
    
    while (elem) {
        var menuElement = elem.firstElementChild;
        
        if (elem && menuElement && menuElement.tagName === 'A') {
            menubarItem = new MenubarItem(menuElement, this);
            menubarItem.init();
            this.menubarItems.push(menubarItem);
            textContent = menuElement.textContent.trim();
            this.firstChars.push(textContent.substring(0, 1).toLowerCase());
        }
        
        elem = elem.nextElementSibling;
    }
    
    // Use populated menuitems array to initialize firstItem and lastItem.
    numItems = this.menubarItems.length;
    if (numItems > 0) {
        this.firstItem = this.menubarItems[ 0 ];
        this.lastItem = this.menubarItems[ numItems - 1 ];
    }
    this.firstItem.domNode.tabIndex = 0;
};

/* FOCUS MANAGEMENT METHODS */

Menubar.prototype.setFocusToItem = function (newItem) {
    
    var flag = false;
    
    for (var i = 0; i < this.menubarItems.length; i++) {
        var mbi = this.menubarItems[i];
        
        if (mbi.domNode.tabIndex == 0) {
            flag = mbi.domNode.getAttribute('aria-expanded') === 'true';
        }
        
        mbi.domNode.tabIndex = -1;
        if (mbi.popupMenu) {
            mbi.popupMenu.close();
        }
    }
    
    newItem.domNode.focus();
    newItem.domNode.tabIndex = 0;
    
    if (flag && newItem.popupMenu) {
        newItem.popupMenu.open();
    }
};

Menubar.prototype.setFocusToFirstItem = function (flag) {
    this.setFocusToItem(this.firstItem);
};

Menubar.prototype.setFocusToLastItem = function (flag) {
    this.setFocusToItem(this.lastItem);
};

Menubar.prototype.setFocusToPreviousItem = function (currentItem) {
    var index;
    
    if (currentItem === this.firstItem) {
        newItem = this.lastItem;
    }
    else {
        index = this.menubarItems.indexOf(currentItem);
        newItem = this.menubarItems[ index - 1 ];
    }
    
    this.setFocusToItem(newItem);

};

Menubar.prototype.setFocusToNextItem = function (currentItem) {
    var index;
    
    if (currentItem === this.lastItem) {
        newItem = this.firstItem;
    }
    else {
        index = this.menubarItems.indexOf(currentItem);
        newItem = this.menubarItems[ index + 1 ];
    }
    
    this.setFocusToItem(newItem);
    
};

Menubar.prototype.setFocusByFirstCharacter = function (currentItem, char) {
    var start, index, char = char.toLowerCase();
    var flag = currentItem.domNode.getAttribute('aria-expanded') === 'true';
    
    // Get start index for search based on position of currentItem
    start = this.menubarItems.indexOf(currentItem) + 1;
    if (start === this.menubarItems.length) {
        start = 0;
    }
    
    // Check remaining slots in the menu
    index = this.getIndexFirstChars(start, char);
    
    // If not found in remaining slots, check from beginning
    if (index === -1) {
        index = this.getIndexFirstChars(0, char);
    }
    
    // If match was found...
    if (index > -1) {
        this.setFocusToItem(this.menubarItems[ index ]);
    }
};

Menubar.prototype.getIndexFirstChars = function (startIndex, char) {
    for (var i = startIndex; i < this.firstChars.length; i++) {
        if (char === this.firstChars[ i ]) {
            return i;
        }
    }
    return -1;
};



/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
var MenubarItem = function (domNode, menuObj) {

  this.menu = menuObj;
  this.domNode = domNode;
  this.popupMenu = false;

  this.hasFocus = false;
  this.hasHover = false;

  this.isMenubarItem = true;

  this.keyCode = Object.freeze({
    'TAB': 9,
    'RETURN': 13,
    'ESC': 27,
    'SPACE': 32,
    'PAGEUP': 33,
    'PAGEDOWN': 34,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });
};

MenubarItem.prototype.init = function () {
 // this.domNode.tabIndex = -1;

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

  // Initialize pop up menus

  var nextElement = this.domNode.nextElementSibling;

  if (nextElement && nextElement.tagName === 'UL') {
    this.popupMenu = new PopupMenu(nextElement, this);
    this.popupMenu.init();
  }

};

MenubarItem.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    char = event.key,
    flag = false,
    clickEvent;

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
    case this.keyCode.DOWN:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToFirstItem();
        flag = true;
      }
      break;

    case this.keyCode.LEFT:
      this.menu.setFocusToPreviousItem(this);
      flag = true;
      break;

    case this.keyCode.RIGHT:
      this.menu.setFocusToNextItem(this);
      flag = true;
      break;

    case this.keyCode.UP:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToLastItem();
        flag = true;
      }
      break;

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      this.menu.setFocusToFirstItem();
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      this.menu.setFocusToLastItem();
      flag = true;
      break;

    case this.keyCode.TAB:
      if(this.popupMenu) this.popupMenu.close(true);
      break;

    case this.keyCode.ESC:
      if(this.popupMenu) this.popupMenu.close(true);
      break;

    default:
      if (isPrintableCharacter(char)) {
        this.menu.setFocusByFirstCharacter(this, char);
        flag = true;
      }
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenubarItem.prototype.setExpanded = function (value) {
  if (value) {
    this.domNode.setAttribute('aria-expanded', 'true');
  }
  else {
    this.domNode.setAttribute('aria-expanded', 'false');
  }
};

MenubarItem.prototype.handleFocus = function (event) {
  this.menu.hasFocus = true;
};

MenubarItem.prototype.handleBlur = function (event) {
  this.menu.hasFocus = false;
};

MenubarItem.prototype.handleMouseover = function (event) {
  this.hasHover = true;
  if(this.popupMenu) this.popupMenu.open();
};

MenubarItem.prototype.handleMouseout = function (event) {
  this.hasHover = false;
  if(this.popupMenu) setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
};

/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
var PopupMenu = function (domNode, controllerObj) {
  var elementChildren,
    msgPrefix = 'PopupMenu constructor argument domNode ';

  // Check whether domNode is a DOM element
  if (!domNode instanceof Element) {
    throw new TypeError(msgPrefix + 'is not a DOM Element.');
  }
  // Check whether domNode has child elements
  if (domNode.childElementCount === 0) {
    throw new Error(msgPrefix + 'has no element children.');
  }
  // Check whether domNode descendant elements have A elements
  var childElement = domNode.firstElementChild;
  while (childElement) {
    var menuitem = childElement.firstElementChild;
    if (menuitem && menuitem === 'A') {
      throw new Error(msgPrefix + 'has descendant elements that are not A elements.');
    }
    childElement = childElement.nextElementSibling;
  }

  this.isMenubar = false;

  this.domNode    = domNode;
  this.controller = controllerObj;

  this.menuitems = []; // See PopupMenu init method
  this.firstChars = []; // See PopupMenu init method

  this.firstItem = null; // See PopupMenu init method
  this.lastItem = null; // See PopupMenu init method

  this.hasFocus = false; // See MenuItem handleFocus, handleBlur
  this.hasHover = false; // See PopupMenu handleMouseover, handleMouseout
};

/*
*   @method PopupMenu.prototype.init
*
*   @desc
*       Add domNode event listeners for mouseover and mouseout. Traverse
*       domNode children to configure each menuitem and populate menuitems
*       array. Initialize firstItem and lastItem properties.
*/
PopupMenu.prototype.init = function () {
  var childElement, menuElement, menuItem, textContent, numItems, label;

  // Configure the domNode itself

  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

  // Traverse the element children of domNode: configure each with
  // menuitem role behavior and store reference in menuitems array.
  childElement = this.domNode.firstElementChild;

  while (childElement) {
    menuElement = childElement.firstElementChild;

    if (menuElement && menuElement.tagName === 'A') {
      menuItem = new MenuItem(menuElement, this);
      menuItem.init();
      this.menuitems.push(menuItem);
      textContent = menuElement.textContent.trim();
      this.firstChars.push(textContent.substring(0, 1).toLowerCase());
    }
    childElement = childElement.nextElementSibling;
  }

  // Use populated menuitems array to initialize firstItem and lastItem.
  numItems = this.menuitems.length;
  if (numItems > 0) {
    this.firstItem = this.menuitems[ 0 ];
    this.lastItem = this.menuitems[ numItems - 1 ];
  }
};

/* EVENT HANDLERS */

PopupMenu.prototype.handleMouseover = function (event) {
  this.hasHover = true;
};

PopupMenu.prototype.handleMouseout = function (event) {
  this.hasHover = false;
  setTimeout(this.close.bind(this, false), 1);
};

/* FOCUS MANAGEMENT METHODS */

PopupMenu.prototype.setFocusToController = function (command, flag) {

  if (typeof command !== 'string') {
    command = '';
  }

  function setFocusToMenubarItem (controller, close) {
    while (controller) {
      if (controller.isMenubarItem) {
        controller.domNode.focus();
        return controller;
      }
      else {
        if (close) {
          controller.menu.close(true);
        }
        controller.hasFocus = false;
      }
      controller = controller.menu.controller;
    }
    return false;
  }

  if (command === '') {
    if (this.controller && this.controller.domNode) {
      this.controller.domNode.focus();
    }
    return;
  }

  if (!this.controller.isMenubarItem) {
    this.controller.domNode.focus();
    this.close();

    if (command === 'next') {
      var menubarItem = setFocusToMenubarItem(this.controller, false);
      if (menubarItem) {
        menubarItem.menu.setFocusToNextItem(menubarItem, flag);
      }
    }
  }
  else {
    if (command === 'previous') {
      this.controller.menu.setFocusToPreviousItem(this.controller, flag);
    }
    else if (command === 'next') {
      this.controller.menu.setFocusToNextItem(this.controller, flag);
    }
  }

};

PopupMenu.prototype.setFocusToFirstItem = function () {
  this.firstItem.domNode.focus();
};

PopupMenu.prototype.setFocusToLastItem = function () {
  this.lastItem.domNode.focus();
};

PopupMenu.prototype.setFocusToPreviousItem = function (currentItem) {
  var index;

  if (currentItem === this.firstItem) {
    this.lastItem.domNode.focus();
  }
  else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[ index - 1 ].domNode.focus();
  }
};

PopupMenu.prototype.setFocusToNextItem = function (currentItem) {
  var index;

  if (currentItem === this.lastItem) {
    this.firstItem.domNode.focus();
  }
  else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[ index + 1 ].domNode.focus();
  }
};

PopupMenu.prototype.setFocusByFirstCharacter = function (currentItem, char) {
  var start, index, char = char.toLowerCase();

  // Get start index for search based on position of currentItem
  start = this.menuitems.indexOf(currentItem) + 1;
  if (start === this.menuitems.length) {
    start = 0;
  }

  // Check remaining slots in the menu
  index = this.getIndexFirstChars(start, char);

  // If not found in remaining slots, check from beginning
  if (index === -1) {
    index = this.getIndexFirstChars(0, char);
  }

  // If match was found...
  if (index > -1) {
    this.menuitems[ index ].domNode.focus();
  }
};

PopupMenu.prototype.getIndexFirstChars = function (startIndex, char) {
  for (var i = startIndex; i < this.firstChars.length; i++) {
    if (char === this.firstChars[ i ]) {
      return i;
    }
  }
  return -1;
};

/* MENU DISPLAY METHODS */

PopupMenu.prototype.open = function () {
  // Get position and bounding rectangle of controller object's DOM node
  var rect = this.controller.domNode.getBoundingClientRect();

  // Set CSS properties
  if (!this.controller.isMenubarItem) {
    this.domNode.parentNode.style.position = 'relative';
    this.domNode.style.display = 'block';
    this.domNode.style.position = 'absolute';
    this.domNode.style.left = rect.width + 'px';
    this.domNode.style.zIndex = 100;
  }
  else {
    this.domNode.style.display = 'block';
    this.domNode.style.position = 'absolute';
    this.domNode.style.top = (rect.height - 1) + 'px';
    this.domNode.style.zIndex = 100;
  }

  this.controller.setExpanded(true);

};

PopupMenu.prototype.close = function (force) {

  var controllerHasHover = this.controller.hasHover;

  var hasFocus = this.hasFocus;

  for (var i = 0; i < this.menuitems.length; i++) {
    var mi = this.menuitems[i];
    if (mi.popupMenu) {
      hasFocus = hasFocus | mi.popupMenu.hasFocus;
    }
  }

  if (!this.controller.isMenubarItem) {
    controllerHasHover = false;
  }

  if (force || (!hasFocus && !this.hasHover && !controllerHasHover)) {
    this.domNode.style.display = 'none';
    this.domNode.style.zIndex = 0;
    this.controller.setExpanded(false);
  }
};

/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
var MenuItem = function (domNode, menuObj) {

  if (typeof popupObj !== 'object') {
    popupObj = false;
  }

  this.domNode = domNode;
  this.menu = menuObj;
  this.popupMenu = false;
  this.isMenubarItem = false;

  this.keyCode = Object.freeze({
    'TAB': 9,
    'RETURN': 13,
    'ESC': 27,
    'SPACE': 32,
    'PAGEUP': 33,
    'PAGEDOWN': 34,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });
};

MenuItem.prototype.init = function () {
  this.domNode.tabIndex = -1;

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

  // Initialize flyout menu

  var nextElement = this.domNode.nextElementSibling;

  if (nextElement && nextElement.tagName === 'UL') {
    this.popupMenu = new PopupMenu(nextElement, this);
    this.popupMenu.init();
  }

};

MenuItem.prototype.isExpanded = function () {
  return this.domNode.getAttribute('aria-expanded') === 'true';
};

/* EVENT HANDLERS */

MenuItem.prototype.handleKeydown = function (event) {
  var tgt  = event.currentTarget,
    char = event.key,
    flag = false,
    clickEvent;

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToFirstItem();
      }
      else {

        // Create simulated mouse event to mimic the behavior of ATs
        // and let the event handler handleClick do the housekeeping.
        try {
          clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
          });
        }
        catch (err) {
          if (document.createEvent) {
            // DOM Level 3 for IE 9+
            clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('click', true, true);
          }
        }
        tgt.dispatchEvent(clickEvent);
      }

      flag = true;
      break;

    case this.keyCode.UP:
      this.menu.setFocusToPreviousItem(this);
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.menu.setFocusToNextItem(this);
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.menu.setFocusToController('previous', true);
      this.menu.close(true);
      flag = true;
      break;

    case this.keyCode.RIGHT:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToFirstItem();
      }
      else {
        this.menu.setFocusToController('next', true);
        this.menu.close(true);
      }
      flag = true;
      break;

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      this.menu.setFocusToFirstItem();
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      this.menu.setFocusToLastItem();
      flag = true;
      break;

    case this.keyCode.ESC:
      this.menu.setFocusToController();
      this.menu.close(true);
      flag = true;
      break;

    case this.keyCode.TAB:
      this.menu.setFocusToController();
      break;

    default:
      if (isPrintableCharacter(char)) {
        this.menu.setFocusByFirstCharacter(this, char);
        flag = true;
      }
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenuItem.prototype.setExpanded = function (value) {
  if (value) {
    this.domNode.setAttribute('aria-expanded', 'true');
  }
  else {
    this.domNode.setAttribute('aria-expanded', 'false');
  }
};

MenuItem.prototype.handleClick = function (event) {
  this.menu.setFocusToController();
  this.menu.close(true);
};

MenuItem.prototype.handleFocus = function (event) {
  this.menu.hasFocus = true;
};

MenuItem.prototype.handleBlur = function (event) {
  this.menu.hasFocus = false;
  setTimeout(this.menu.close.bind(this.menu, false), 300);
};

MenuItem.prototype.handleMouseover = function (event) {
  this.menu.hasHover = true;
  this.menu.open();
  if (this.popupMenu) {
    this.popupMenu.hasHover = true;
    this.popupMenu.open();
  }
};

MenuItem.prototype.handleMouseout = function (event) {
  if (this.popupMenu) {
    this.popupMenu.hasHover = false;
    this.popupMenu.close(true);
  }

  this.menu.hasHover = false;
  setTimeout(this.menu.close.bind(this.menu, false), 300);
};

