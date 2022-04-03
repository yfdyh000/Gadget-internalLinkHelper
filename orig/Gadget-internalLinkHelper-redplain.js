(function ($, mw) { $(function() {
    $('.ilh-link', mw.util.$content).each(function() {
        $(this).text($(this).text()); // remove link
    });
}); })(jQuery, mediaWiki);