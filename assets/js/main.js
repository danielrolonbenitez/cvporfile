$(function() {
    $.validate({
        lang: "es"
    });

    var $window = $(window),
        $body = $("body"),
        $header = $("#header"),
        $footer = $("#footer"),
        $main = $("#main"),
        $btnSubmit = $("#btn-submit"),
        $dots = $("#dot-bricks"),
        $form = $("form"),
        $inputs = $("form :input"),
        settings = {
            // Parallax background effect?
            parallax: true,

            // Parallax factor (lower = more intense, higher = less intense).
            parallaxFactor: 20
        };

    // Breakpoints.
    breakpoints({
        xlarge: ["1281px", "1800px"],
        large: ["981px", "1280px"],
        medium: ["737px", "980px"],
        small: ["481px", "736px"],
        xsmall: [null, "480px"]
    });

    // Play initial animations on page load.
    $window.on("load", function() {
        window.setTimeout(function() {
            $body.removeClass("is-preload");
        }, 100);
    });

    // Touch?
    if (browser.mobile) {
        // Turn on touch mode.
        $body.addClass("is-touch");

        // Height fix (mostly for iOS).
        window.setTimeout(function() {
            $window.scrollTop($window.scrollTop() + 1);
        }, 0);
    }

    // Footer.
    breakpoints.on("<=medium", function() {
        $footer.insertAfter($main);
    });

    breakpoints.on(">medium", function() {
        $footer.appendTo($header);
    });

    // Header.

    // Parallax background.

    // Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
    if (browser.name == "ie" || browser.mobile) settings.parallax = false;

    if (settings.parallax) {
        breakpoints.on("<=medium", function() {
            $window.off("scroll.strata_parallax");
            $header.css("background-position", "");
        });

        breakpoints.on(">medium", function() {
            $header.css("background-position", "left 0px");

            $window.on("scroll.strata_parallax", function() {
                $header.css(
                    "background-position",
                    "left " +
                        -1 *
                            (parseInt($window.scrollTop()) /
                                settings.parallaxFactor) +
                        "px"
                );
            });
        });

        $window.on("load", function() {
            $window.triggerHandler("scroll");
        });
    }

    $form.on("submit", function(event) {
        event.preventDefault();
        event.stopPropagation();
        $btnSubmit.hide();
        $dots.show();
        $inputs.prop("readonly", true);

        $.ajax({
            type: "post",
            url: APP_CONFIG.SERVICE_URL,
            data: JSON.stringify(serializeToJson($(this))),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            success: function(data) {
                $btnSubmit.show();
                $dots.hide();
                $form.trigger("reset");

                toastr.success(
                    "Su mensaje ha sido enviado exitosamente, Gracias",
                    "Enviado!"
                );
            },
            error: function(data) {
                $btnSubmit.show();
                $dots.hide();
                toastr.error(
                    "Hemos tenido inconvenientes para enviar el mensaje, pronto estaré solucionando el problema.",
                    "Opps!"
                );
            }
        });
    });

    //This Snippet assume that you are using Jquery
    function serializeToJson($form) {
        var formData = $form.serializeArray();

        var data = {};
        $(formData).each(function(index, obj) {
            data[obj.name] = obj.value;
        });

        return data;
    }
});

/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
(function(w) {
    "use strict";
    /* exported loadCSS */
    var loadCSS = function(href, before, media, attributes) {
        // Arguments explained:
        // `href` [REQUIRED] is the URL for your CSS file.
        // `before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
        // By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
        // `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'
        // `attributes` [OPTIONAL] is the Object of attribute name/attribute value pairs to set on the stylesheet's DOM Element.
        var doc = w.document;
        var ss = doc.createElement("link");
        var ref;
        if (before) {
            ref = before;
        } else {
            var refs = (doc.body || doc.getElementsByTagName("head")[0])
                .childNodes;
            ref = refs[refs.length - 1];
        }

        var sheets = doc.styleSheets;
        // Set any of the provided attributes to the stylesheet DOM Element.
        if (attributes) {
            for (var attributeName in attributes) {
                if (attributes.hasOwnProperty(attributeName)) {
                    ss.setAttribute(attributeName, attributes[attributeName]);
                }
            }
        }
        ss.rel = "stylesheet";
        ss.href = href;
        // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
        ss.media = "only x";

        // wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
        function ready(cb) {
            if (doc.body) {
                return cb();
            }
            setTimeout(function() {
                ready(cb);
            });
        }
        // Inject link
        // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
        // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
        ready(function() {
            ref.parentNode.insertBefore(ss, before ? ref : ref.nextSibling);
        });
        // A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
        var onloadcssdefined = function(cb) {
            var resolvedHref = ss.href;
            var i = sheets.length;
            while (i--) {
                if (sheets[i].href === resolvedHref) {
                    return cb();
                }
            }
            setTimeout(function() {
                onloadcssdefined(cb);
            });
        };

        function loadCB() {
            if (ss.addEventListener) {
                ss.removeEventListener("load", loadCB);
            }
            ss.media = media || "all";
        }

        // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
        if (ss.addEventListener) {
            ss.addEventListener("load", loadCB);
        }
        ss.onloadcssdefined = onloadcssdefined;
        onloadcssdefined(loadCB);
        return ss;
    };
    // commonjs
    if (typeof exports !== "undefined") {
        exports.loadCSS = loadCSS;
    } else {
        w.loadCSS = loadCSS;
    }
})(typeof global !== "undefined" ? global : this);
