
var wtbPortal = wtbPortal || {};

(function($, ATVI) {

    var $context, formObj = {};
    var redirectQueryDefault = 'redirectUrl=https%3A%2F%2Fwww.callofduty.com%2F',
        query = encodeURIComponent('?wtbPortalPath=battlepass&wtbPortalScreen=1'),
        loginPostUrl = {dev: 'https://profile-stage.callofduty.com/cod/ajax/login', prod: 'https://profile.callofduty.com/cod/ajax/login'};

    var init = function() {
		defineContext();
        buildFormObj();
        addHandlers();
    };


    var defineContext = function() {
		$context = wtbPortal.$wrapper.find('.login-form.battlepass');
    };

    var buildFormObj = function() {
		var o = formObj;
        o.els = {};
        o.els.$emailInput = $context.find('#battlepass-login-email-input');
        o.els.$pwInput = $context.find('#battlepass-login-password-input');
        o.els.$submit = $context.find('.form-submit-link');
        o.els.$signupLink = $context.find('.sign-up-prompt a');
    };

    var addHandlers = function() {
        $context.on('click', 'a', function(e) {
			var $thisLink = $(this);

            // signup prompt  >>>>>   TO DO ::  map siteUrl to stage/prod
            if ($thisLink.is(formObj.els.$signupLink)) {
				e.preventDefault();
                var baseLinkHref = $thisLink.attr('href'),
                    linkHref = (baseLinkHref[baseLinkHref.length - 1] == '/') ? baseLinkHref.slice(0, -1) : baseLinkHref,
                    siteUrl = window.location.href;
                if (siteUrl[siteUrl.length - 1] == '/') siteUrl = siteUrl.slice(0, -1);
				siteUrl = '?redirectUrl=' + encodeURIComponent(siteUrl) + query;
                window.location.assign(linkHref + siteUrl);
            }

            //  sign in submit
            if ($thisLink.is(formObj.els.$submit)) {
				e.preventDefault();
                // TO DO ::  validation?
                // TO DO ::  error handling/messaging
				submitLogin(formObj.els.$emailInput.val(), formObj.els.$pwInput.val());
            }
        });

    };

    var submitLogin = function(emailVal, passwordVal) {
		$.ajax({
            url: loginPostUrl[ATVI.pageEnv],
            headers: SSO.csrf.getCSRFObj(),
            contentType: "application/json",
            xhrFields: { withCredentials: true },
            type: "POST",
            data: JSON.stringify({
                "email": emailVal,
                "password": passwordVal
            })
        }).done(function(d) {
            console.log('done: ' + d);
        });
    };

    ////  >>>> after login --->  wtbPortal.user.getLoggedInState();


    $(init);

})(jQuery, ATVI);