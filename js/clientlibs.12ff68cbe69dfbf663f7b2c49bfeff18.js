

var ATVI = ATVI || {};

(function($, ATVI) {

	var ld = ATVI.localeDetector; 
    //ld.region // ca, co, va, ct

    var init = function() {
		if (ld.region && (ld.region == 'ca' || ld.region == 'co' || ld.region == 'va' || ld.region == 'ct')) addPrivacyLink(ld.region);
        else {
			document.addEventListener('localeDetectionReady', function() {
                if (ld.region == 'ca' || ld.region == 'co' || ld.region == 'va' || ld.region == 'ct') addPrivacyLink(ld.region);
            });
        }

        if(ld.region && ld.region == 'ca') {
			addCALink();
        }
        else {
			document.addEventListener('localeDetectionReady', function() {
                if (ld.region == 'ca') addCALink();
            });
        }
    };

    var addPrivacyLink = function(r) {
        var anchor = $('<a/>', { 'href':'https://support.activision.com/privacyrequest?st=' + r, 'text': 'Your Privacy Choices', 'target': '_blank' }),
            item = $('<div/>', { 'class': 'basic-margin footer-link-item caps' }),
            list = $('<ul/>'),
            listItem = $('<li/>', { 'class': 'privacy-check' });
        listItem.append(anchor);
        list.append(listItem);
        item.append(list);
		$('.cod-global-footer .footer-links').append(item);
    };

    var addCALink = function() {

		var anchor = $('<a/>', { 'href':'https://www.activision.com/legal/privacy-policy#toc10b', 'text': 'California Privacy Notice', 'target': '_blank', 'class': 'no-dash-links' }),
            item = $('<li/>');
        item.append(anchor);
		$('.cod-global-footer .basic-margin.footer-link-item.caps ul').append(item);

    };

    $(init);

})(jQuery, ATVI);