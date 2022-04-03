(function ($, mw) { $(function() {
    $('.ilh-all', mw.util.$content).each(function() {
        var d=dataValues(this);
        $(this).append($('<span class="noprint ilh-comment">（'+d.$foreignSpan+'）</span>'));
    });
}); })(jQuery, mediaWiki);