	var dataAlias = {
		foreignArticleTitle: "fa",
		foreignCode: "fc",
		foreignLangLocalName: "fn",
		localArticleTitle: "la",
		//displayName: "d"
	};

(function ($, mw) { $(function() {
            $('.ilh-all', mw.util.$content).each(function() {
                var origTitle = $(this).text(),
                $foreignSpan =$(this).data(dataAlias.foreignArticleTitle), // foreign title
                $linkAnchor = $(this),
                $langCode = $(this).data(dataAlias.foreignCode), // foreign code raw
                $langName = $(this).data(dataAlias.foreignLangLocalName),
                $that = $( this ).data( 'internalLinkHelper-showing', false );
    
                var newurl ="https:"+mediaWiki.config.get('wgServer')+"/wiki/"+$langCode+":"+$foreignSpan;
        $('a', this).removeClass('new').addClass('extiw')
            .attr('href', newurl)
            .attr('title', $(this).data(dataAlias.foreignArticleTitle));
    });
}); })(jQuery, mediaWiki);