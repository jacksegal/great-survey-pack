/* Get Source Code for BSD */
var sourceCode = getParameterByName('source');
var subSourceCode = getParameterByName('subsource');
$(function () {
    $(".source").val(sourceCode);
    $(".subsource").val(subSourceCode);
});

/* Default URL */
updateURL("join-in");

/* Submit form and trigger slide submit */
$(function () {
    $("form").submit(function (event) {

        /* disable the click */
        event.preventDefault();

        /* custom form validation for iOS */
        if (validateForm(this)) {

            /* Remove any Previous Errors */
            $("#requiredAlert").addClass('hidden');
            $(this).find('div.form-group').removeClass('has-error');

            /* force close keyboard on mobile */
            $(document.activeElement).blur();

            /* handle unsub */
            if ($('#details #privacyCheckbox input:checkbox').is(':checked')) {
            } else {
                var email = $("#inputEmail").val();
                $('#details #unsub').attr({value: email, name: "unsub"});
            }

            /* format postcode */
            $("#inputPostcode").val(function (index, value) {
                return formatPostcode(value);
            });

            /* submit form */
            var bsdFormId = $(this).attr("data-bsd-form-id");

            if (bsdFormId) {
                submitBsdForm(bsdFormId);
                fbq('track', 'CompleteRegistration');
            }

            $("#formErrorAlert ul").empty();

            /* move to next slide */
            var that = $(this);
            $(this).trigger("slide:submit", that);

        } else {

            $("#formErrorAlert ul").empty();

            $(this).find('input[type="email"]').filter(function () {
                return !isValidEmailAddress(this.value);
            }).closest('div.form-group').addClass('has-error').each(function () {
                /* Show Error Status */
                $("#formErrorAlert ul").append('<li>Please enter a valid email address</li>');
                $("#formErrorAlert").removeClass('hidden');
            });

            var postcode = $(this).find('#inputPostcode').val();
            if (postcode) {
                var re = new RegExp(/^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/g);
                if (re.test(formatPostcode(postcode))) {

                } else {
                    $("#formErrorAlert ul").append('<li>Please enter a valid UK postcode</li>');
                    $("#formErrorAlert").removeClass('hidden');
                    $('#inputPostcode').closest('div.form-group').addClass('has-error');
                }
            }

            /* Custom Validation Errors - highlight input(s) */
            $(this).find('input[required]').filter(function () {
                return !this.value;
            }).closest('div.form-group').addClass('has-error');

            /* Show Error Status */
            $("#formErrorAlert ul").append('<li>Please enter all required fields</li>');
            $("#formErrorAlert").removeClass('hidden');

        }

    });
});

/* Handle Custom Submits */
$(function () {

    /* Pack Selection - Choose UJ Route && Details Wording && Details Fields */
    $('#pack input:radio').change(function () {

        /* hide all text */
        $('#details [data-selection]').addClass('hidden');
        $('#thank-you [data-selection]').addClass('hidden');

        /* find text to display and show it */
        var detailsWordingSelector = $(this).attr("data-choice");
        $('[data-selection="' + detailsWordingSelector + '"]').removeClass('hidden');

        /* choose uj route */
        var target = $(this).attr("data-href");
        $('#details button[type="submit"]').attr("data-href", target);

        /* select pack type in details form */
        var packType = $(this).attr("data-value");
        $('#details #packType').val(packType);

        if (packType == 'post') {
            $('#first_line, #post_town').attr('required', true);
        }

    });

    /* Fill out Hidden Emails */
    $("#details form").submit(function (event) {
        var email = $("#inputEmail").val();
        $('input[data-email="true"]').val(email);
    });

    /* Concat address lines to one input */
    $('#details input.addressLine').change(function () {
        var address1 = $('#details #first_line').val();
        var address2 = $('#details #second_line').val();

        $('#details #addressLines').val(address1.replace(/&/g, 'and') + ', ' + address2.replace(/&/g, 'and'));
    });
});


/* Submit Form to BSD */
function submitBsdForm(id) {
    var form = 'form[data-bsd-form-id="' + id + '"]';
    $.ajax({
        type: "POST",
        data: $(form).serialize(),
        url: "https://tggt-survey.appspot.com/api/ijqw7dx/signup/" + id,
        dataType: "json",
        success: function (response) {
            console.log(response);
        }
    });
};


/* Custom Form Validation for iOS */
function validateForm(form) {

    /* check for required fields */
    var len = $(form).find('input[required]').filter(function () {
        return !this.value;
    }).length;

    /* check email format */
    var email = $('#details form').find('input[type="email"]').val();
    if (email) {
        if (isValidEmailAddress(email)) {
        } else {
            return false;
        }
    }

    var postcode = $(form).find('#inputPostcode').val();
    if (postcode) {
        var re = new RegExp(/^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/g);
        if (re.test(formatPostcode(postcode))) {

        } else {
            return false;
        }
    }

    /* validation response  */
    if (len) {
        return false;
    } else {
        return true;
    }

}

/* Validate Email */
function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}

/* Format Postcode */
function formatPostcode(postcode) {
    var parts = postcode.replace(/\s+/g, '').toUpperCase().match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)\s*(\d[A-Z]{2})$/);

    if (parts) {
        parts.shift();
        return (parts.join(' '));
    } else {
        return postcode;
    }
}

/* Get URL Parameter */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/* Update URL if using modern browser */
function updateURL(url) {
    if (typeof history.replaceState != 'undefined') {
        var currentState = history.state;
        window.history.replaceState(currentState, "", removeHash(url));
    }
}

/* Remove Hash (#) from String */
function removeHash(str) {
    return str.replace(/^#/, "");
}

/* Add signs */
$(function () {

    $("#signedOne").text(signups[Math.floor(Math.random() * signups.length)]);
    $("#signedTwo").text(signups[Math.floor(Math.random() * signups.length)]);
    $("#signedThree").text(signups[Math.floor(Math.random() * signups.length)]);

    setTimeout(function () {
        $("p.signers").first().fadeIn("slow", function showNext() {
            var that = this;
            setTimeout(function () {
                $(that).next("p.signers").fadeIn("slow", showNext);
            }, 2000);

        });
    }, 1500);
});

/* Do Signup Counter */
$(function () {

    /* Harcoded Numbers - Big Lunch & Mailchimp Import */
    var signupCount = (4225 + 5391);

    /* Get numbers from Form 20 */
    $.ajax({
        type: "GET",
        url: 'https://secure.jocoxfoundation.org/utils/cons_counter/signup_counter.ajax.php?signup_form_id=20',
        dataType: "json",
        success: function (response) {
            signupCount += response;

            /* Get numbers from Form 7 */
            $.ajax({
                type: "GET",
                url: 'https://secure.jocoxfoundation.org/utils/cons_counter/signup_counter.ajax.php?signup_form_id=7',
                dataType: "json",
                success: function (response) {
                    signupCount += response;

                    /* Update the Ticker */
                    ticker(signupCount, 'span#signupCount');
                }
            });

        }
    });

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function ticker(n, identifier) {

        /* Update the value */
        $(identifier).text(signupCount);

        /* Perform animation */
        $(identifier).each(function () {
            $(this).prop('Counter', 0).animate({
                Counter: $(this).text()
            }, {
                duration: 2000,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now));
                },

                /* Add comma */
                complete: function () {
                    $(identifier).text(numberWithCommas(n));
                }
            });
        });
    }
});