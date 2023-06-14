!function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(d){"use strict";var s,l=window.Slick||{};s=0,(l=function(i,e){var t,o=this;o.defaults={adaptiveHeight:!1,appendArrows:d(i),appendDots:d(i),arrows:!0,arrowsPlacement:null,asNavFor:null,prevArrow:'<button class="slick-prev" type="button"><span class="slick-prev-icon" aria-hidden="true"></span><span class="slick-sr-only">Previous</span></button>',nextArrow:'<button class="slick-next" type="button"><span class="slick-next-icon" aria-hidden="true"></span><span class="slick-sr-only">Next</span></button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(i,e){return d('<button type="button"><span class="slick-dot-icon" aria-hidden="true"></span><span class="slick-sr-only">Go to slide '+(e+1)+"</span></button>")},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,infinite:!0,initialSlide:0,instructionsText:null,lazyLoad:"ondemand",mobileFirst:!1,playIcon:'<span class="slick-play-icon" aria-hidden="true"></span>',pauseIcon:'<span class="slick-pause-icon" aria-hidden="true"></span>',pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,regionLabel:"carousel",respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useAutoplayToggleButton:!0,useCSS:!0,useGroupRole:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},o.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,$instructionsText:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$pauseButton:null,$pauseIcon:null,$playIcon:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},d.extend(o,o.initials),o.activeBreakpoint=null,o.animType=null,o.animProp=null,o.breakpoints=[],o.breakpointSettings=[],o.cssTransitions=!1,o.focussed=!1,o.interrupted=!1,o.hidden="hidden",o.paused=!0,o.positionProp=null,o.respondTo=null,o.rowCount=1,o.shouldClick=!0,o.$slider=d(i),o.$slidesCache=null,o.transformType=null,o.transitionType=null,o.visibilityChange="visibilitychange",o.windowWidth=0,o.windowTimer=null,t=d(i).data("slick")||{},o.options=d.extend({},o.defaults,e,t),o.currentSlide=o.options.initialSlide,o.originalSettings=o.options,void 0!==document.mozHidden?(o.hidden="mozHidden",o.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(o.hidden="webkitHidden",o.visibilityChange="webkitvisibilitychange"),o.autoPlay=d.proxy(o.autoPlay,o),o.autoPlayClear=d.proxy(o.autoPlayClear,o),o.autoPlayIterator=d.proxy(o.autoPlayIterator,o),o.autoPlayToggleHandler=d.proxy(o.autoPlayToggleHandler,o),o.changeSlide=d.proxy(o.changeSlide,o),o.clickHandler=d.proxy(o.clickHandler,o),o.selectHandler=d.proxy(o.selectHandler,o),o.setPosition=d.proxy(o.setPosition,o),o.swipeHandler=d.proxy(o.swipeHandler,o),o.dragHandler=d.proxy(o.dragHandler,o),o.instanceUid=s++,o.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,o.registerBreakpoints(),o.init(!0)}).prototype.addSlide=l.prototype.slickAdd=function(i,e,t){var o=this;if("boolean"==typeof e)t=e,e=null;else if(e<0||e>=o.slideCount)return!1;o.unload(),"number"==typeof e?0===e&&0===o.$slides.length?d(i).appendTo(o.$slideTrack):t?d(i).insertBefore(o.$slides.eq(e)):d(i).insertAfter(o.$slides.eq(e)):!0===t?d(i).prependTo(o.$slideTrack):d(i).appendTo(o.$slideTrack),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slides.each(function(i,e){d(e).attr("data-slick-index",i),d(e).attr("role","group"),d(e).attr("aria-label","slide "+i)}),o.$slidesCache=o.$slides,o.reinit()},l.prototype.animateHeight=function(){var i,e=this;1===e.options.slidesToShow&&!0===e.options.adaptiveHeight&&!1===e.options.vertical&&(i=e.$slides.eq(e.currentSlide).outerHeight(!0),e.$list.animate({height:i},e.options.speed))},l.prototype.animateSlide=function(i,e){var t={},o=this;o.animateHeight(),!0===o.options.rtl&&!1===o.options.vertical&&(i=-i),!1===o.transformsEnabled?!1===o.options.vertical?o.$slideTrack.animate({left:i},o.options.speed,o.options.easing,e):o.$slideTrack.animate({top:i},o.options.speed,o.options.easing,e):!1===o.cssTransitions?(!0===o.options.rtl&&(o.currentLeft=-o.currentLeft),d({animStart:o.currentLeft}).animate({animStart:i},{duration:o.options.speed,easing:o.options.easing,step:function(i){i=Math.ceil(i),!1===o.options.vertical?t[o.animType]="translate("+i+"px, 0px)":t[o.animType]="translate(0px,"+i+"px)",o.$slideTrack.css(t)},complete:function(){e&&e.call()}})):(o.applyTransition(),i=Math.ceil(i),!1===o.options.vertical?t[o.animType]="translate3d("+i+"px, 0px, 0px)":t[o.animType]="translate3d(0px,"+i+"px, 0px)",o.$slideTrack.css(t),e&&setTimeout(function(){o.disableTransition(),e.call()},o.options.speed))},l.prototype.getNavTarget=function(){var i=this.options.asNavFor;return i&&null!==i&&(i=d(i).not(this.$slider)),i},l.prototype.asNavFor=function(e){var i=this.getNavTarget();null!==i&&"object"==typeof i&&i.each(function(){var i=d(this).slick("getSlick");i.unslicked||i.slideHandler(e,!0)})},l.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},l.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},l.prototype.autoPlayClear=function(){this.autoPlayTimer&&clearInterval(this.autoPlayTimer)},l.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},l.prototype.autoPlayToggleHandler=function(){var i=this;i.paused?(i.$playIcon.css("display","none"),i.$pauseIcon.css("display","inline"),i.$pauseButton.find(".slick-play-text").attr("style","display: none"),i.$pauseButton.find(".slick-pause-text").removeAttr("style"),i.slickPlay()):(i.$playIcon.css("display","inline"),i.$pauseIcon.css("display","none"),i.$pauseButton.find(".slick-play-text").removeAttr("style"),i.$pauseButton.find(".slick-pause-text").attr("style","display: none"),i.slickPause())},l.prototype.buildArrows=function(){var i=this;if(!0===i.options.arrows)if(i.$prevArrow=d(i.options.prevArrow).addClass("slick-arrow"),i.$nextArrow=d(i.options.nextArrow).addClass("slick-arrow"),i.slideCount>i.options.slidesToShow){if(i.htmlExpr.test(i.options.prevArrow))if(null!=i.options.arrowsPlacement)switch(i.options.arrowsPlacement){case"beforeSlides":case"split":console.log("test"),i.$prevArrow.prependTo(i.options.appendArrows);break;case"afterSlides":i.$prevArrow.appendTo(i.options.appendArrows)}else i.$prevArrow.prependTo(i.options.appendArrows);if(i.htmlExpr.test(i.options.nextArrow))if(null!=i.options.arrowsPlacement)switch(i.options.arrowsPlacement){case"beforeSlides":console.log("test2"),i.$prevArrow.after(i.$nextArrow);break;case"afterSlides":case"split":i.$nextArrow.appendTo(i.options.appendArrows)}else i.$nextArrow.appendTo(i.options.appendArrows);!0!==i.options.infinite&&i.$prevArrow.addClass("slick-disabled").prop("disabled",!0)}else i.$prevArrow.add(i.$nextArrow).addClass("slick-hidden").prop("disabled",!0)},l.prototype.buildDots=function(){var i,e,t=this;if(!0===t.options.dots&&t.slideCount>t.options.slidesToShow){for(t.$slider.addClass("slick-dotted"),e=d("<ul />").addClass(t.options.dotsClass),i=0;i<=t.getDotCount();i+=1)e.append(d("<li />").append(t.options.customPaging.call(this,t,i)));t.$dots=e.appendTo(t.options.appendDots),t.$dots.find("li").first().addClass("slick-active")}},l.prototype.buildOut=function(){var t=this;t.$slides=t.$slider.children(t.options.slide+":not(.slick-cloned)").addClass("slick-slide"),t.slideCount=t.$slides.length,t.$slides.each(function(i,e){d(e).attr("data-slick-index",i).data("originalStyling",d(e).attr("style")||""),t.options.useGroupRole&&d(e).attr("role","group").attr("aria-label","slide "+(i+1))}),t.$slider.addClass("slick-slider"),t.$slider.attr("role","region"),t.$slider.attr("aria-label",t.options.regionLabel),t.$slideTrack=0===t.slideCount?d('<div class="slick-track"/>').appendTo(t.$slider):t.$slides.wrapAll('<div class="slick-track"/>').parent(),t.$list=t.$slideTrack.wrap('<div class="slick-list"/>').parent(),t.$slideTrack.css("opacity",0),!0!==t.options.centerMode&&!0!==t.options.swipeToSlide||(t.options.slidesToScroll=1),d("img[data-lazy]",t.$slider).not("[src]").addClass("slick-loading"),t.setupInfinite(),t.buildArrows(),t.buildDots(),t.updateDots(),t.setSlideClasses("number"==typeof t.currentSlide?t.currentSlide:0),!0===t.options.draggable&&t.$list.addClass("draggable"),t.options.autoplay&&t.options.useAutoplayToggleButton&&(t.$pauseIcon=d(t.options.pauseIcon).attr("aria-hidden",!0),t.$playIcon=d(t.options.playIcon).attr("aria-hidden",!0),t.$pauseButton=d('<button type="button" class="slick-autoplay-toggle-button">'),t.$pauseButton.append(t.$pauseIcon),t.$pauseButton.append(t.$playIcon.css("display","none")),t.$pauseButton.append(d('<span class="slick-pause-text slick-sr-only">Pause</span>')),t.$pauseButton.append(d('<span class="slick-play-text slick-sr-only" style="display: none">Play</span>')),t.$pauseButton.prependTo(t.$slider)),null!=t.options.instructionsText&&""!=t.options.instructionsText&&(t.$instructionsText=d('<p class="slick-instructions slick-sr-only">'+t.options.instructionsText+"</p>"),t.$instructionsText.prependTo(t.$slider))},l.prototype.buildRows=function(){var i,e,t,o=this,s=document.createDocumentFragment(),n=o.$slider.children();if(0<o.options.rows){for(t=o.options.slidesPerRow*o.options.rows,e=Math.ceil(n.length/t),i=0;i<e;i++){for(var l=document.createElement("div"),r=0;r<o.options.rows;r++){for(var a=document.createElement("div"),d=0;d<o.options.slidesPerRow;d++){var p=i*t+(r*o.options.slidesPerRow+d);n.get(p)&&a.appendChild(n.get(p))}l.appendChild(a)}s.appendChild(l)}o.$slider.empty().append(s),o.$slider.children().children().children().css({width:100/o.options.slidesPerRow+"%",display:"inline-block"})}},l.prototype.checkResponsive=function(i,e){var t,o,s,n=this,l=!1,r=n.$slider.width(),a=window.innerWidth||d(window).width();if("window"===n.respondTo?s=a:"slider"===n.respondTo?s=r:"min"===n.respondTo&&(s=Math.min(a,r)),n.options.responsive&&n.options.responsive.length&&null!==n.options.responsive){for(t in o=null,n.breakpoints)n.breakpoints.hasOwnProperty(t)&&(!1===n.originalSettings.mobileFirst?s<n.breakpoints[t]&&(o=n.breakpoints[t]):s>n.breakpoints[t]&&(o=n.breakpoints[t]));null!==o?null!==n.activeBreakpoint&&o===n.activeBreakpoint&&!e||(n.activeBreakpoint=o,"unslick"===n.breakpointSettings[o]?n.unslick(o):(n.options=d.extend({},n.originalSettings,n.breakpointSettings[o]),!0===i&&(n.currentSlide=n.options.initialSlide),n.refresh(i)),l=o):null!==n.activeBreakpoint&&(n.activeBreakpoint=null,n.options=n.originalSettings,!0===i&&(n.currentSlide=n.options.initialSlide),n.refresh(i),l=o),i||!1===l||n.$slider.trigger("breakpoint",[n,l])}},l.prototype.changeSlide=function(i,e){var t,o,s=this,n=d(i.currentTarget);switch(n.is("a")&&i.preventDefault(),n.is("li")||(n=n.closest("li")),t=s.slideCount%s.options.slidesToScroll!=0?0:(s.slideCount-s.currentSlide)%s.options.slidesToScroll,i.data.message){case"previous":o=0==t?s.options.slidesToScroll:s.options.slidesToShow-t,s.slideCount>s.options.slidesToShow&&s.slideHandler(s.currentSlide-o,!1,e);break;case"next":o=0==t?s.options.slidesToScroll:t,s.slideCount>s.options.slidesToShow&&s.slideHandler(s.currentSlide+o,!1,e);break;case"index":var l=0===i.data.index?0:i.data.index||n.index()*s.options.slidesToScroll;s.slideHandler(s.checkNavigable(l),!1,e),n.children().trigger("focus");break;default:return}},l.prototype.checkNavigable=function(i){var e=this.getNavigableIndexes(),t=0;if(i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},l.prototype.cleanUpEvents=function(){var i=this;i.options.autoplay&&i.options.useAutoplayToggleButton&&i.$pauseButton.off("click.slick",i.autoPlayToggleHandler),i.options.dots&&null!==i.$dots&&d("li",i.$dots).off("click.slick",i.changeSlide).off("mouseenter.slick",d.proxy(i.interrupt,i,!0)).off("mouseleave.slick",d.proxy(i.interrupt,i,!1)),i.$slider.off("focus.slick blur.slick"),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow&&i.$prevArrow.off("click.slick",i.changeSlide),i.$nextArrow&&i.$nextArrow.off("click.slick",i.changeSlide)),i.$list.off("touchstart.slick mousedown.slick",i.swipeHandler),i.$list.off("touchmove.slick mousemove.slick",i.swipeHandler),i.$list.off("touchend.slick mouseup.slick",i.swipeHandler),i.$list.off("touchcancel.slick mouseleave.slick",i.swipeHandler),i.$list.off("click.slick",i.clickHandler),d(document).off(i.visibilityChange,i.visibility),i.cleanUpSlideEvents(),d(window).off("orientationchange.slick.slick-"+i.instanceUid,i.orientationChange),d(window).off("resize.slick.slick-"+i.instanceUid,i.resize),d("[draggable!=true]",i.$slideTrack).off("dragstart",i.preventDefault),d(window).off("load.slick.slick-"+i.instanceUid,i.setPosition)},l.prototype.cleanUpSlideEvents=function(){var i=this;i.$list.off("mouseenter.slick",d.proxy(i.interrupt,i,!0)),i.$list.off("mouseleave.slick",d.proxy(i.interrupt,i,!1))},l.prototype.cleanUpRows=function(){var i;0<this.options.rows&&((i=this.$slides.children().children()).removeAttr("style"),this.$slider.empty().append(i))},l.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},l.prototype.destroy=function(i){var e=this;e.autoPlayClear(),e.touchObject={},e.cleanUpEvents(),d(".slick-cloned",e.$slider).detach(),e.options.autoplay&&e.options.useAutoplayToggleButton&&e.$pauseButton.remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.$prevArrow.length&&(e.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").prop("disabled",!1).css("display",""),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove()),e.$nextArrow&&e.$nextArrow.length&&(e.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").prop("disabled",!1).css("display",""),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove()),e.$slides&&(e.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){d(this).attr("style",d(this).data("originalStyling"))}),e.$slideTrack.children(this.options.slide).detach(),e.$slideTrack.detach(),e.$list.detach(),e.$slider.append(e.$slides)),e.cleanUpRows(),e.$slider.removeClass("slick-slider"),e.$slider.removeClass("slick-initialized"),e.$slider.removeClass("slick-dotted"),e.unslicked=!0,i||e.$slider.trigger("destroy",[e])},l.prototype.disableTransition=function(i){var e={};e[this.transitionType]="",!1===this.options.fade?this.$slideTrack.css(e):this.$slides.eq(i).css(e)},l.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},l.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},l.prototype.filterSlides=l.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},l.prototype.focusHandler=function(){var t=this;t.$slider.off("focus.slick blur.slick").on("focus.slick","*",function(i){var e=d(this);setTimeout(function(){t.options.pauseOnFocus&&e.is(":focus")&&(t.focussed=!0,t.autoPlay())},0)}).on("blur.slick","*",function(i){d(this);t.options.pauseOnFocus&&(t.focussed=!1,t.autoPlay())})},l.prototype.getCurrent=l.prototype.slickCurrentSlide=function(){return this.currentSlide},l.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},l.prototype.getLeft=function(i){var e,t,o,s,n=this,l=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),l=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(l=i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,l=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(l=n.slideOffset=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+l,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},l.prototype.getOption=l.prototype.slickGetOption=function(i){return this.options[i]},l.prototype.getNavigableIndexes=function(){for(var i=this,e=0,t=0,o=[],s=!1===i.options.infinite?i.slideCount:(e=-1*i.options.slidesToScroll,t=-1*i.options.slidesToScroll,2*i.slideCount);e<s;)o.push(e),e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;return o},l.prototype.getSlick=function(){return this},l.prototype.getSlideCount=function(){var s,n=this,i=!0===n.options.centerMode?Math.floor(n.$list.width()/2):0,l=-1*n.swipeLeft+i;return!0===n.options.swipeToSlide?(n.$slideTrack.find(".slick-slide").each(function(i,e){var t=d(e).outerWidth(),o=e.offsetLeft;if(!0!==n.options.centerMode&&(o+=t/2),l<o+t)return s=e,!1}),Math.abs(d(s).attr("data-slick-index")-n.currentSlide)||1):n.options.slidesToScroll},l.prototype.goTo=l.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},l.prototype.init=function(i){var e=this;d(e.$slider).hasClass("slick-initialized")||(d(e.$slider).addClass("slick-initialized"),e.buildRows(),e.buildOut(),e.setProps(),e.startLoad(),e.loadSlider(),e.initializeEvents(),e.updateArrows(),e.updateDots(),e.checkResponsive(!0),e.focusHandler()),i&&e.$slider.trigger("init",[e]),e.options.autoplay&&(e.paused=!1,e.autoPlay()),e.updateSlideVisibility(),null!=e.options.accessibility&&console.warn("accessibility setting is no longer supported."),null!=e.options.focusOnChange&&console.warn("focusOnChange is no longer supported."),null!=e.options.focusOnSelect&&console.warn("focusOnSelect is no longer supported.")},l.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide))},l.prototype.initDotEvents=function(){var i=this;!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&d("li",i.$dots).on("click.slick",{message:"index"},i.changeSlide),!0===i.options.dots&&!0===i.options.pauseOnDotsHover&&i.slideCount>i.options.slidesToShow&&d("li",i.$dots).on("mouseenter.slick",d.proxy(i.interrupt,i,!0)).on("mouseleave.slick",d.proxy(i.interrupt,i,!1))},l.prototype.initSlideEvents=function(){var i=this;i.options.pauseOnHover&&(i.$list.on("mouseenter.slick",d.proxy(i.interrupt,i,!0)),i.$list.on("mouseleave.slick",d.proxy(i.interrupt,i,!1)))},l.prototype.initializeEvents=function(){var i=this;i.initArrowEvents(),i.initDotEvents(),i.initSlideEvents(),i.options.autoplay&&i.options.useAutoplayToggleButton&&i.$pauseButton.on("click.slick",i.autoPlayToggleHandler),i.$list.on("touchstart.slick mousedown.slick",{action:"start"},i.swipeHandler),i.$list.on("touchmove.slick mousemove.slick",{action:"move"},i.swipeHandler),i.$list.on("touchend.slick mouseup.slick",{action:"end"},i.swipeHandler),i.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},i.swipeHandler),i.$list.on("click.slick",i.clickHandler),d(document).on(i.visibilityChange,d.proxy(i.visibility,i)),d(window).on("orientationchange.slick.slick-"+i.instanceUid,d.proxy(i.orientationChange,i)),d(window).on("resize.slick.slick-"+i.instanceUid,d.proxy(i.resize,i)),d("[draggable!=true]",i.$slideTrack).on("dragstart",i.preventDefault),d(window).on("load.slick.slick-"+i.instanceUid,i.setPosition),d(i.setPosition)},l.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},l.prototype.lazyLoad=function(){var i,e,t,n=this;function o(i){d("img[data-lazy]",i).each(function(){var i=d(this),e=d(this).attr("data-lazy"),t=d(this).attr("data-srcset"),o=d(this).attr("data-sizes")||n.$slider.attr("data-sizes"),s=document.createElement("img");s.onload=function(){i.animate({opacity:0},100,function(){t&&(i.attr("srcset",t),o&&i.attr("sizes",o)),i.attr("src",e).animate({opacity:1},200,function(){i.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,i,e])})},s.onerror=function(){i.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,i,e])},s.src=e})}if(!0===n.options.centerMode?t=!0===n.options.infinite?(e=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(e=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),n.options.slidesToShow/2+1+2+n.currentSlide):(e=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,t=Math.ceil(e+n.options.slidesToShow),!0===n.options.fade&&(0<e&&e--,t<=n.slideCount&&t++)),i=n.$slider.find(".slick-slide").slice(e,t),"anticipated"===n.options.lazyLoad)for(var s=e-1,l=t,r=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)s<0&&(s=n.slideCount-1),i=(i=i.add(r.eq(s))).add(r.eq(l)),s--,l++;o(i),n.slideCount<=n.options.slidesToShow?o(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?o(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&o(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},l.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},l.prototype.next=l.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},l.prototype.orientationChange=function(){this.checkResponsive(),this.setPosition()},l.prototype.pause=l.prototype.slickPause=function(){this.autoPlayClear(),this.paused=!0},l.prototype.play=l.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},l.prototype.postSlide=function(i){var e=this;e.unslicked||(e.$slider.trigger("afterChange",[e,i]),e.animating=!1,e.slideCount>e.options.slidesToShow&&e.setPosition(),e.swipeLeft=null,e.options.autoplay&&e.autoPlay(),e.updateSlideVisibility())},l.prototype.prev=l.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},l.prototype.preventDefault=function(i){i.preventDefault()},l.prototype.progressiveLazyLoad=function(i){i=i||1;var e,t,o,s,n,l=this,r=d("img[data-lazy]",l.$slider);r.length?(e=r.first(),t=e.attr("data-lazy"),o=e.attr("data-srcset"),s=e.attr("data-sizes")||l.$slider.attr("data-sizes"),(n=document.createElement("img")).onload=function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,e,t]),l.progressiveLazyLoad()},n.onerror=function(){i<3?setTimeout(function(){l.progressiveLazyLoad(i+1)},500):(e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,e,t]),l.progressiveLazyLoad())},n.src=t):l.$slider.trigger("allImagesLoaded",[l])},l.prototype.refresh=function(i){var e,t=this,o=t.slideCount-t.options.slidesToShow;!t.options.infinite&&t.currentSlide>o&&(t.currentSlide=o),t.slideCount<=t.options.slidesToShow&&(t.currentSlide=0),e=t.currentSlide,t.destroy(!0),d.extend(t,t.initials,{currentSlide:e}),t.init(),i||t.changeSlide({data:{message:"index",index:e}},!1)},l.prototype.registerBreakpoints=function(){var i,e,t,o=this,s=o.options.responsive||null;if("array"===d.type(s)&&s.length){for(i in o.respondTo=o.options.respondTo||"window",s)if(t=o.breakpoints.length-1,s.hasOwnProperty(i)){for(e=s[i].breakpoint;0<=t;)o.breakpoints[t]&&o.breakpoints[t]===e&&o.breakpoints.splice(t,1),t--;o.breakpoints.push(e),o.breakpointSettings[e]=s[i].settings}o.breakpoints.sort(function(i,e){return o.options.mobileFirst?i-e:e-i})}},l.prototype.reinit=function(){var i=this;i.$slides=i.$slideTrack.children(i.options.slide).addClass("slick-slide"),i.slideCount=i.$slides.length,i.currentSlide>=i.slideCount&&0!==i.currentSlide&&(i.currentSlide=i.currentSlide-i.options.slidesToScroll),i.slideCount<=i.options.slidesToShow&&(i.currentSlide=0),i.registerBreakpoints(),i.setProps(),i.setupInfinite(),i.buildArrows(),i.updateArrows(),i.initArrowEvents(),i.buildDots(),i.updateDots(),i.initDotEvents(),i.cleanUpSlideEvents(),i.initSlideEvents(),i.checkResponsive(!1,!0),i.setSlideClasses("number"==typeof i.currentSlide?i.currentSlide:0),i.setPosition(),i.focusHandler(),i.paused=!i.options.autoplay,i.autoPlay(),i.$slider.trigger("reInit",[i])},l.prototype.resize=function(){var i=this;d(window).width()!==i.windowWidth&&(clearTimeout(i.windowDelay),i.windowDelay=window.setTimeout(function(){i.windowWidth=d(window).width(),i.checkResponsive(),i.unslicked||i.setPosition()},50))},l.prototype.removeSlide=l.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},l.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled||(!(s={})===o.cssTransitions?s[o.animType]="translate("+e+", "+t+")":s[o.animType]="translate3d("+e+", "+t+", 0px)"),o.$slideTrack.css(s)},l.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},l.prototype.setFade=function(){var t,o=this;o.$slides.each(function(i,e){t=o.slideWidth*i*-1,!0===o.options.rtl?d(e).css({position:"relative",right:t,top:0,zIndex:o.options.zIndex-2,opacity:0}):d(e).css({position:"relative",left:t,top:0,zIndex:o.options.zIndex-2,opacity:0})}),o.$slides.eq(o.currentSlide).css({zIndex:o.options.zIndex-1,opacity:1})},l.prototype.setHeight=function(){var i,e=this;1===e.options.slidesToShow&&!0===e.options.adaptiveHeight&&!1===e.options.vertical&&(i=e.$slides.eq(e.currentSlide).outerHeight(!0),e.$list.css("height",i))},l.prototype.setOption=l.prototype.slickSetOption=function(){var i,e,t,o,s,n=this,l=!1;if("object"===d.type(arguments[0])?(t=arguments[0],l=arguments[1],s="multiple"):"string"===d.type(arguments[0])&&(o=arguments[1],l=arguments[2],"responsive"===(t=arguments[0])&&"array"===d.type(arguments[1])?s="responsive":void 0!==arguments[1]&&(s="single")),"single"===s)n.options[t]=o;else if("multiple"===s)d.each(t,function(i,e){n.options[i]=e});else if("responsive"===s)for(e in o)if("array"!==d.type(n.options.responsive))n.options.responsive=[o[e]];else{for(i=n.options.responsive.length-1;0<=i;)n.options.responsive[i].breakpoint===o[e].breakpoint&&n.options.responsive.splice(i,1),i--;n.options.responsive.push(o[e])}l&&(n.unload(),n.reinit())},l.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},l.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},l.prototype.setSlideClasses=function(i){var e,t,o,s,n=this,l=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true").attr("aria-label",function(){return d(this).attr("aria-label").replace(" (centered)","")});n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode?(o=n.options.slidesToShow%2==0?1:0,s=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(s<=i&&i<=n.slideCount-1-s?n.$slides.slice(i-s+o,i+s+1).addClass("slick-active").removeAttr("aria-hidden"):(e=n.options.slidesToShow+i,l.slice(e-s+1+o,e+s+2).addClass("slick-active").removeAttr("aria-hidden")),0===i?l.eq(n.options.slidesToShow+n.slideCount+1).addClass("slick-center").attr("aria-label",function(){return d(this).attr("aria-label")+" (centered)"}):i===n.slideCount-1&&l.eq(n.options.slidesToShow).addClass("slick-center").attr("aria-label",function(){return d(this).attr("aria-label")+" (centered)"})),n.$slides.eq(i).addClass("slick-center").attr("aria-label",function(){return d(this).attr("aria-label")+" (centered)"})):0<=i&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").removeAttr("aria-hidden"):l.length<=n.options.slidesToShow?l.addClass("slick-active").removeAttr("aria-hidden"):(t=n.slideCount%n.options.slidesToShow,e=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?l.slice(e-(n.options.slidesToShow-t),e+t).addClass("slick-active").removeAttr("aria-hidden"):l.slice(e,e+n.options.slidesToShow).addClass("slick-active").removeAttr("aria-hidden")),"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},l.prototype.setupInfinite=function(){var i,e,t,o=this;if(!0===o.options.fade&&(o.options.centerMode=!1),!0===o.options.infinite&&!1===o.options.fade&&(e=null,o.slideCount>o.options.slidesToShow)){for(t=!0===o.options.centerMode?o.options.slidesToShow+1:o.options.slidesToShow,i=o.slideCount;i>o.slideCount-t;--i)e=i-1,d(o.$slides[e]).clone(!0).attr("id","").attr("data-slick-index",e-o.slideCount).prependTo(o.$slideTrack).addClass("slick-cloned");for(i=0;i<t+o.slideCount;i+=1)e=i,d(o.$slides[e]).clone(!0).attr("id","").attr("data-slick-index",e+o.slideCount).appendTo(o.$slideTrack).addClass("slick-cloned");o.$slideTrack.find(".slick-cloned").find("[id]").each(function(){d(this).attr("id","")})}},l.prototype.interrupt=function(i){i||this.autoPlay(),this.interrupted=i},l.prototype.selectHandler=function(i){var e=d(i.target).is(".slick-slide")?d(i.target):d(i.target).parents(".slick-slide"),t=(t=parseInt(e.attr("data-slick-index")))||0;this.slideCount<=this.options.slidesToShow?this.slideHandler(t,!1,!0):this.slideHandler(t)},l.prototype.slideHandler=function(i,e,t){var o,s,n,l,r,a,d=this;if(e=e||!1,!(!0===d.animating&&!0===d.options.waitForAnimate||!0===d.options.fade&&d.currentSlide===i))if(!1===e&&d.asNavFor(i),o=i,r=d.getLeft(o),l=d.getLeft(d.currentSlide),d.currentLeft=null===d.swipeLeft?l:d.swipeLeft,!1===d.options.infinite&&!1===d.options.centerMode&&(i<0||i>d.getDotCount()*d.options.slidesToScroll))!1===d.options.fade&&(o=d.currentSlide,!0!==t&&d.slideCount>d.options.slidesToShow?d.animateSlide(l,function(){d.postSlide(o)}):d.postSlide(o));else if(!1===d.options.infinite&&!0===d.options.centerMode&&(i<0||i>d.slideCount-d.options.slidesToScroll))!1===d.options.fade&&(o=d.currentSlide,!0!==t&&d.slideCount>d.options.slidesToShow?d.animateSlide(l,function(){d.postSlide(o)}):d.postSlide(o));else{if(d.options.autoplay&&clearInterval(d.autoPlayTimer),s=o<0?d.slideCount%d.options.slidesToScroll!=0?d.slideCount-d.slideCount%d.options.slidesToScroll:d.slideCount+o:o>=d.slideCount?d.slideCount%d.options.slidesToScroll!=0?0:o-d.slideCount:o,d.animating=!0,d.$slider.trigger("beforeChange",[d,d.currentSlide,s]),n=d.currentSlide,d.currentSlide=s,d.setSlideClasses(d.currentSlide),d.options.asNavFor&&(a=(a=d.getNavTarget()).slick("getSlick")).slideCount<=a.options.slidesToShow&&a.setSlideClasses(d.currentSlide),d.updateDots(),d.updateArrows(),!0===d.options.fade)return!0!==t?(d.fadeSlideOut(n),d.fadeSlide(s,function(){d.postSlide(s)})):d.postSlide(s),void d.animateHeight();!0!==t&&d.slideCount>d.options.slidesToShow?d.animateSlide(r,function(){d.postSlide(s)}):d.postSlide(s)}},l.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},l.prototype.swipeDirection=function(){var i=this,e=i.touchObject.startX-i.touchObject.curX,t=i.touchObject.startY-i.touchObject.curY,o=Math.atan2(t,e),s=Math.round(180*o/Math.PI);return s<0&&(s=360-Math.abs(s)),s<=45&&0<=s||s<=360&&315<=s?!1===i.options.rtl?"left":"right":135<=s&&s<=225?!1===i.options.rtl?"right":"left":!0===i.options.verticalSwiping?35<=s&&s<=135?"down":"up":"vertical"},l.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1;if(o.interrupted=!1,o.shouldClick=!(10<o.touchObject.swipeLength),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},l.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},l.prototype.swipeMove=function(i){var e,t,o,s,n,l=this,r=void 0!==i.originalEvent?i.originalEvent.touches:null;return!(!l.dragging||l.scrolling||r&&1!==r.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==r?r[0].pageX:i.clientX,l.touchObject.curY=void 0!==r?r[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),n=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&4<n?!(l.scrolling=!0):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=n),t=l.swipeDirection(),void 0!==i.originalEvent&&4<l.touchObject.swipeLength&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,(l.touchObject.edgeHit=!1)===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},l.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return!(t.touchObject={});void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},l.prototype.unfilterSlides=l.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},l.prototype.unload=function(){var i=this;d(".slick-cloned",i.$slider).remove(),i.$dots&&i.$dots.remove(),i.$prevArrow&&i.htmlExpr.test(i.options.prevArrow)&&i.$prevArrow.remove(),i.$nextArrow&&i.htmlExpr.test(i.options.nextArrow)&&i.$nextArrow.remove(),i.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},l.prototype.unslick=function(i){this.$slider.trigger("unslick",[this,i]),this.destroy()},l.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2);!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").prop("disabled",!1),i.$nextArrow.removeClass("slick-disabled").prop("disabled",!1),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").prop("disabled",!0),i.$nextArrow.removeClass("slick-disabled").prop("disabled",!1)):(i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode||i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode)&&(i.$nextArrow.addClass("slick-disabled").prop("disabled",!0),i.$prevArrow.removeClass("slick-disabled").prop("disabled",!1)))},l.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").find("button").removeAttr("aria-current").end().end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active").find("button").attr("aria-current",!0).end().end())},l.prototype.updateSlideVisibility=function(){this.$slideTrack.find(".slick-slide").attr("aria-hidden","true").find("a, input, button, select").attr("tabindex","-1"),this.$slideTrack.find(".slick-active").removeAttr("aria-hidden").find("a, input, button, select").removeAttr("tabindex")},l.prototype.visibility=function(){this.options.autoplay&&(document[this.hidden]?this.interrupted=!0:this.interrupted=!1)},d.fn.slick=function(){for(var i,e=this,t=arguments[0],o=Array.prototype.slice.call(arguments,1),s=e.length,n=0;n<s;n++)if("object"==typeof t||void 0===t?e[n].slick=new l(e[n],t):i=e[n].slick[t].apply(e[n].slick,o),void 0!==i)return i;return e}});

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







var HUB = HUB || {};

(function($, HUB) {

    var init = function() {
        //initPurchase();
        //updateVanguardLinks();
        //initS4Touts();
    };

    /*var initPurchase = function() {

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

    };*/

    var initS4Touts = function() {

        //Tout 1
        $("#s4-tout-1, #s4-tout-3").on("click", function(e) {

			e.preventDefault();
            $("#sample-modal-1").click();

        });

        //Tout 2
        $("#s4-tout-2").on("click", function(e) {

			e.preventDefault();
            $("#sample-modal-2").click();

        });

    };

    //addWtbTabHandler();

    $(init);

})(jQuery, HUB);


(function() {

    var init = function() {

		initTag();

    };

    var initTag = function() {

		$("#wsow-cta-button-1").on('click', function(e) {
            dataLayer.push({
             'category': 'exit',
             'action': 'click',
             'label': e.target.href,
             'destinationURL': e.target.href,
             'pageURL': window.location.href,
             'event':'event'
        	});
        });

    };

	$(init);

})();
var ATVI = ATVI || {};

(function($, ATVI) {

    document.addEventListener('wtbScreensReady', function() {
        wtbPortal.initWtbPortal();
    });

})(jQuery, ATVI);

(function() {

    var updateSectionDataLayer = function(sectionName, label, destinationUrl) {
        if (!digitalData || !dataLayer) return;

        var d = digitalData.page,
            obj = {}; //'wtb-subsection';

        obj.event = "event";
        obj.category = "interaction:" + d.pageInfo.siteSubsection; //'interaction:home'
        obj.action = sectionName;
        obj.label = label + ":" + destinationUrl; // cta text, blog, game name 
        obj.pageURL = window.location.href;

        dataLayer.push(obj);
    }

    var initSectionAnalytics = function() {

        // Hero //taken care of in global analytics
        /*document.querySelectorAll('#hero-ctas li').forEach(function (node) {
            node.addEventListener('click', function (e) {
                if(this.dataset.modal == "yes") {
                    updateSectionDataLayer("hero", "watch trailer", window.location.href);
                } else {
                    updateSectionDataLayer("hero", "learn more", this.querySelector("a").getAttribute("href"));
                }
            });
        });*/

        // Touts
        /*document.querySelectorAll('#hub-main-small-banner .atvi-cta-container li > a').forEach(function (node) {
            node.addEventListener('click', function (e) {
                updateSectionDataLayer("touts", "learn more", this.getAttribute("href"));
            });
        });*/
        document.querySelectorAll('#hub-main-small-banner .tout-entry, #hub-touts .tout-entry').forEach(function (node) {
            node.addEventListener('click', function (e) {
                updateSectionDataLayer("touts", this.querySelector(".tout-title").innerText, this.querySelector("a").getAttribute("href"));
            });
        });

        // Latest News
        document.querySelectorAll('#cod-hub-news .news-entry > a').forEach(function (node) {
            node.addEventListener('click', function (e) {
                updateSectionDataLayer("latest news", "blog", this.getAttribute("href"));
            });
        });

        // Get the game (WTB)
        document.querySelectorAll('.wtb-portal-container a.title-tout-link').forEach(function (node) {
            node.addEventListener('click', function (e) {
                let gameName = this.dataset.titleId;
                updateSectionDataLayer("get the game", gameName, "https://www.callofduty.com/" + gameName + "/purchase-platform");
            });
        });

        // bonus weapon blueprint
        document.querySelectorAll('#blueprint-cta-container li a').forEach(function (node) {
            node.addEventListener('click', function (e) {
                updateSectionDataLayer("weapon blueprint", this.innerText, this.getAttribute("href"));
            });
        });

    }

    var addDataLayer = function(label) {

		if (!digitalData || !dataLayer) return;
        var url = window.location.href;
        var d = digitalData.page, obj = {};

		obj.event = "interaction";
		obj.category = "interaction";
        obj.action = "click";
        obj.label = label;
        obj.destinationURL = window.location.href;
        obj.pageURL = window.location.href;

        dataLayer.push(obj);
    };

    //Scroll Event Analytics
    var initScrollDataLayer = function(module) {

        if (!digitalData || !dataLayer) return;
        var url = window.location.href;
        var d = digitalData.page, obj = {};
        
        obj.event = "scroll";
        obj.category = "scroll";
        obj.action = d.pageInfo.pageName;
        obj.label = module;
        
        dataLayer.push(obj);

    };

    var initTitleRegionAnalytics = function () {
        var wtbContainer = document.querySelector(".wtb-portal-container");

        wtbContainer.addEventListener("click", function(e) {
            if (e.target.classList.contains('title-change-link')) {
                addDataLayer('change title');
            }
            if (e.target.classList.contains('region-change-link')) {
                addDataLayer('change region');
            }
        });
    };

    var initScrollAnalytics = function(){

        //track to make sure dataLayer is fired only once module is scrolled to
        var section1Visible = false;
        var section2Visible = false;
        var section3Visible = false;

        //Module names on homepage
        var module1 = $("#hub-touts");
        var module2 = $(".latest-news");
        var module3 = $(".portal-screen-container");

        $(window).scroll(function() { 

            if(!section1Visible && ATVI.utils.isInViewport(module1)) {
                section1Visible = true;
                initScrollDataLayer("hub-touts");
            }
            if(!section2Visible && ATVI.utils.isInViewport(module2)) {
                section2Visible = true;
                initScrollDataLayer("hub-news");
            }
            if(!section3Visible && ATVI.utils.isInViewport(module3)) {
                section3Visible = true;
                initScrollDataLayer("hub-WTB");
            }

        });
    };

    let init = function () {
        initSectionAnalytics();
        initTitleRegionAnalytics();
        initScrollAnalytics();
    };

    document.readyState !== "loading"
        ? init()
        : document.addEventListener("DOMContentLoaded", init);

})();
/**********************************************
1. Functionality to inject ember overlay in hero
2. Handle z-index issues for any modal popups in hero to show above the cod global header
***********************************************/

(function() {

    var init = function() {

		var vidString = "<video id='ember' playsinline loop muted autoplay><source src='/content/dam/atvi/callofduty/cod-touchui/hub/hero/ember-overlay.mp4' type='video/mp4'></video>";

		$("#cod-hub-hero-video .atvi-column-layout-bg-media-container").prepend(vidString);

        //zIndex();
        //resize();

    };

    var zIndex = function() {

        $("#hub-hero-content .thumb-entry").on("click", function() {

			$("#cod-hub-hero-video .atvi-column-inner-container").addClass("unsetIndex");

        });

    };

    var resize = function() {

        // select the video element
        var video = document.getElementById("ember");
        
        // set initial playback rate
        var playbackRate = 1;
        
        // listen for window resize events
        $(window).on('resize', function() {

          // get current window width
          var windowWidth = $(window).width();
        
          // update playback rate based on window size
          if (windowWidth < 1140) {
            	playbackRate = 0.5;
              	console.log("Playback rate: " + playbackRate);
          } else {
            	playbackRate = 1;
              	console.log("Playback rate: " + playbackRate);
          }
        
          // set playback rate on video element
          video.playbackRate = playbackRate;
        });

        // get current window width
        var windowWidth = $(window).width();
        
        // update playback rate based on window size
        if (windowWidth < 1140) {
            playbackRate = 0.5;
        } else {
            playbackRate = 1;
        }
        
        // set playback rate on video element
        video.playbackRate = playbackRate;

    };

	$(init);

})();

