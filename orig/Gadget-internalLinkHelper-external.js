(function ($, mw) { $(function() {
    $('.ilh-all', mw.util.$content).each(function() {
        var exta = $('.ilh-link a', this);
        if (exta.length == 0) return;
        $('.ilh-page a', this).removeClass('new').addClass('extiw')
            .attr('href', exta.attr('href'))
            .attr('title', exta.attr('title'));
    });
}); })(jQuery, mediaWiki);