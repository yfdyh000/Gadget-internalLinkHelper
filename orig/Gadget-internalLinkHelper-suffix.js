(function ($, mw) { $(function() {
    $('.ilh-lang', mw.util.$content).each(function() {
        $(this).text($(this).text());
    });
}); })(jQuery, mediaWiki);