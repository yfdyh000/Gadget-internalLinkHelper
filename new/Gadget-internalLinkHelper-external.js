(function ($, mw) { $(function() {
            $('.ilh-all', mw.util.$content).each(function() {
                var d=dataValues(this);

                var newurl ="https:"+mediaWiki.config.get('wgServer').replace('zh', d.$langCode)+"/wiki/"+d.$foreignSpan;
        $('a', this).removeClass('new').addClass('extiw')
            .attr('href', newurl)
            .attr('title', $(this).data(dataAlias.foreignArticleTitle));
    });
}); })(jQuery, mediaWiki);