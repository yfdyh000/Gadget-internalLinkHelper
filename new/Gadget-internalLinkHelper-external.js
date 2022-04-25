(function ($, mw) { $(function() {
            $('.ilh-all', mw.util.$content).each(function() {
                var d=new dataValues(this);

                var newurl ="https://"+mediaWiki.config.get('wgServerName').replace('zh', d.$langCode)+"/wiki/"+d.$foreignSpan;
        $('a', this).removeClass('new').addClass('extiw')
            .attr('href', newurl)
            .attr('title', d.$foreignSpan);
    });
}); })(jQuery, mediaWiki);