
var ATVI = ATVI || {};


(function($, ATVI) {

    var wtbp = wtbPortal,
        rt = wtbp.relevantTouts = {};

    rt.consts = {};
    rt.consts.LOGINPROMPT_class = 'login-tout';
    rt.consts.CREATEACCOUNT_class = 'create-an-account-tout';

	rt.$toutsHidden = [];
    rt.$toutsShown = [];

    rt.initTargetedTouts = function($context) {
		var $touts = $context.find('.relevant-tout'),
            loggedIn = (wtbp.user.loggedIn) ? true : wtbPortal.user.getLoggedInState();
        if ($touts.length <= 3) return;
        if (loggedIn && $touts.length > 3) {
            $.each($touts, function() {
				var $thisTout = $(this),
                    $thisParent = $thisTout.closest('.experiencefragment');
                if ($thisTout.attr('class').indexOf(rt.consts.LOGINPROMPT_class) > -1 || 
                   $thisTout.attr('class').indexOf(rt.consts.CREATEACCOUNT_class) > -1) {
                    rt.$toutsHidden.push($thisParent);
                    $thisParent.hide();
					rt.$toutsShown.push($touts.eq($touts.length - 1).closest('.experiencefragment'));
                    $touts.eq($touts.length - 1).closest('.experiencefragment').show();
                }
            });
        } else if (!loggedIn && $touts.length > 3) {
			var $parents = $touts.closest('.experiencefragment');
            $.each($parents, function(i) {
                if (i > 2) {
                    rt.$toutsHidden.push($(this));
                    $(this).hide();
                }
            });
        }
    };

    rt.resetTouts = function() {
        rt.$toutsHidden.forEach(function($el) {
			$el.show();
        });
		rt.$toutsHidden = [];
        rt.$toutsShown = [];
    };



})(jQuery, ATVI);