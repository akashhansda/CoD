
ATVI.components.gallery = ATVI.components.gallery || {};

(function($, ATVI) {

    var gallery = ATVI.components.gallery;

    window.ATVIVideoEls = window.ATVIVideoEls || [];
    var ytArr = []; //holds ATVI video elements
    var parentEl, overlay, modalContent, mediaContent, thumb, close, thumbsContainer;
	var currentFilter = "all"; //current filter is "all" on load

    var init = function(el, configs) {

        defineElements(el);
        initFilters(el);
        initModals();
        //initCarousel(configs);
    };

    var defineElements = function(el) {

        parentEl        = el;
		overlay         = el.find(".modal-overlay");
        thumbsContainer = el.find(".gallery-thumbs-inner");
        thumb           = thumbsContainer.find(".thumb-entry");
        modalContent    = overlay.find(".modal-content");
        mediaContent    = modalContent.find(".media-content");
        close           = overlay.find(".modal-close");

    };

    var initFilters = function(el) {

		var fbtns = el.find(".gallery-filter-btn"); //filter buttons

        //on filter button click
        fbtns.on("click", function() {
			currentFilter = $(this).data("filter"); //set new filter state

            if(currentFilter == "all") { //if filter is set to "all"
                thumb.filter(":hidden").show(); //show all gallery assets
            }	
            else { //if a different filter button is clicked
        		thumb.filter("[data-filter!='" + currentFilter + "']").hide(); //hide all gallery assets that are not the filter selected
                thumb.filter("[data-filter='" + currentFilter + "']").show(); //show only the gallery assets that match the current filter state
            }

            initCarouselItems();

        });

    };

    var initModals = function() {

        //Thumbnail click
        thumb.on("click", function() {

            openModal($(this)); //open modal and pass in thumb element

        });

        //On ENTER key down, open modal
        thumb.on("keydown", function(e) {

            if (event.keyCode === 13) {
            	openModal($(this)); //open modal and pass in thumb element
            }
        });

        //Close modal on close button or background
        overlay.add(close).click(function(e) {

            pauseVideo(); //pause all videos ... just in case one is in the middle of playing
            overlay.fadeOut(function() { //overlay fades out

                //Update aria expanded 
                var modalId = $(this).closest(".modal-overlay").attr("id");
                $(".thumb-entry[aria-controls='" + modalId + "']").attr("aria-expanded", "false");

				mediaContent.empty(); //remove image/video from modal 
            });

        });

        //if you click inside modal, nothing happens
		modalContent.on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        });

        //Modal navigation
        overlay.find(".modal-nav-prev").on("click", function() {

			var curSlide = mediaContent.find(".modal-item.current"); //get current slide
            var newSlide = curSlide.prev(); //find the previous slide
            if(newSlide.length == 0) newSlide = mediaContent.find(".modal-item").filter(":last-of-type"); //if there is no previous slide, then previous slide equals the last slide in list

            curSlide.removeClass("current"); //remove "current" class from current slide
            if(curSlide.data("type") == "video-entry") pauseVideo(); //if we're navigating away from current slide and is a video, then pause the video
            newSlide.addClass("current"); //set new slide as the current slide

        });

        overlay.find(".modal-nav-next").on("click", function() {

			var curSlide = mediaContent.find(".modal-item.current"); //get current slide
            var newSlide = curSlide.next(); //find the next slide
            if(newSlide.length == 0) newSlide = mediaContent.find(".modal-item").filter(":first-of-type"); //if next slide does not exist, then the first slide in list is the next slide

            curSlide.removeClass("current"); //remove "current" class from current slide
            if(curSlide.data("type") == "video-entry") pauseVideo(); //if we're navigating away from current slide and is a video, then pause the video
            newSlide.addClass("current"); //set new slide as the current slide

        });


    };

    var openModal = function(el) {

        //Update aria expanded 
        el.attr("aria-expanded", "true");

        //build the modal carousel while passing in what the current thumbnail that was clicked
        buildModalCarousel(el);

		//Set active thumbnail
        //thumb.filter(".active").removeClass("active");
        //selectedThumb.addClass("active");

        //Fade in overlay
        overlay.fadeIn();

    };

    var buildModalCarousel = function(selectedThumb) {

        var selectedId = selectedThumb.data("id"); //get id of selected thumbnail that was clicked to open the modal
		var autoplay = selectedThumb.data("autoplay");
        var agegate  = selectedThumb.data("agegate");

        var thumbs = getAssetsByFilter(); //get only the thumbnails that are part of the filtered current state

        thumbs.each(function(idx) { //for each thumbnail that was gathered

            var t         = $(this); 
            var thumbType = t.data("media"); //get "media" data
        	var alt       = t.data("alt"); //get "alt" data
            var id        = t.data("id"); //get "id" data

            var newEl = $("<div>", {"class": "modal-item", "data-type" : thumbType, "data-id": id}); //create new "div" tag with class name "modal-item and data-type = the media type (image/video), and data-id = id
            if(selectedId == id) newEl.addClass("current"); //if the selected thumbnail ID equals the id of the thumbnail being created, then set the "current" class to the div
            //if(id < selectedId)  newEl.addClass("previous-slide");

            if(thumbType == "image-entry") {
        		var img = $('<img>', {'src': t.data("full"), 'alt': alt}); //create image element with full source path and alt text
                newEl.append(img); //add image to created div element
            }
            else {
        		var vid = buildYtVideo(t.data("ytid"), "vid-" + idx, autoplay, agegate); //build youtube video
                newEl.append(vid); //add video to created div element
            }

            mediaContent.append(newEl); //add created div element that contains the image/video to the modal list

        });
    };

    var getAssetsByFilter = function() {

		var thumbs;

        if(currentFilter == "all") {
			thumbs = thumb; //thumb is defined on line 25, so we're just setting it to "thumbs" so that it represents all thumbnail assets
        }
        else {
        	thumbs = thumb.filter('[data-filter="' + currentFilter + '"]'); //select all thumbnails that have data-filter set to the current filters
        }

        return thumbs;

    };

    var buildYtVideo = function(ytid, vidId, autoplay, agegate) {

        var youtubeId = ytid,
            elId = vidId,
            $wrapperEl = $('<div>', {'id': elId, 'class': 'atvi-video-component', 'data-youtube-id': youtubeId}),
            $inner = $('<div>', { 'class': 'player atvi-instrument atvi-instrument-video-player'}),
            $embedEl = $('<div>', {'id': elId + '-embed'}),
            $el = $wrapperEl.append($inner.append($embedEl)),
            autoPlay = (!agegate && autoplay) ? 1 : 0,
            configObj = { youtubeId: youtubeId, start: 0, customControls: false, autoPlay: autoPlay};

        window.ATVIVideoEls.push({
            $el: $el,
            config: configObj
        });
        
        ytArr.push($el);
        
        ATVI.library.withDependency('atvi-video', function() {
            if (!ATVI.components.video.YTScriptLoaded) ATVI.components.video.initYtAPI();
            else {
                ATVI.components.video.generatePlayer($el, configObj);
                if (!$el.find('.' + $el.attr('id') + '-embed').children().length) {
                    setTimeout(function() {
                        ATVI.components.video.purgeContext($el);
                        ATVI.components.video.generatePlayer($el, configObj);
                    }, 500);
                }
            }
        });
        
        return $el;
    };

    var pauseVideo = function() {
		var i;
        for (i = 0; i < ytArr.length; i++) {
			var c = ATVI.components.video.getContext(ytArr[i]);
            if (c && c.pause) c.pause();
        }
    };

    var initCarousel = function(configs) { //only gets called on page load

        var filteredThumbs = getAssetsByFilter();

		//decide which items to show first
        reInitCarouselItems(configs);

        //if itemsPerSlide is less than total length of thumbs, then show arrows
        if(configs.itemsPerSlide < filteredThumbs) {
            parentEl.find(".gallery-nav-arrows-container").show();
        }

        //click handlers for navigation

        parentEl.find(".gallery-nav-arrows-container .gallery-nav-prev").on("click", function() {

        });

        parentEl.find(".gallery-nav-arrows-container .gallery-nav-next").on("click", function() {
			var newSet = getNewSet(configs);
        });

    };

    var reInitCarouselItems = function(configs) { //this will get re-called when filer btns are clicked and once on page load

        var filteredThumbs = getAssetsByFilter();

        filteredThumbs.each(function(idx) {
            if(idx < configs.itemsPerSlide) $(this).addClass("current");
        });

        //if itemsPerSlide is less than total length of thumbs, then show arrows
        if(configs.itemsPerSlide < filteredThumbs) {
            parentEl.find(".gallery-nav-arrows-container").show();
        }
        else {
			parentEl.find(".gallery-nav-arrows-container").hide();
        }

    };

    var getNewSet = function(configs) {

        //get last of type item that has current
        var currentSet = thumb.filter(".current").addClass("remove");
        var lastThumbIndex  = thumb.filter(".current").index(); //FIX THIS! Get index of last element matching .current
        var newSet;

        if(currentFilter == "all") {
			//.addClass("current");
            var counter = 0;
            for(var i = lastThumbIndex; i < thumb.length; i++) {
                if(counter <= configs.itemsPerSlide) {
					$(this).addClass("current");
                    counter++;
                }
            }
        }
        else {
        	//.addClass("current");
            var counter = 0;
            for(var i = lastThumbIndex; i < thumb.length; i++) {
                if($(this).data("filter") == currentFilter && counter <= configs.itemsPerSlide) {
					$(this).addClass("current");
                    counter++;
                }
            }
        }

        thumb.filter(".remove").removeClass("current").removeClass("remove");

    };

    ATVI.components.gallery.init = init;


})(jQuery, ATVI);
