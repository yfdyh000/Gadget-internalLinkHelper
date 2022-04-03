mw.loader.using('jquery.tipsy', function(){
( function( $, mw, window ) { $( function() {
	var dataAlias = {
		foreignArticleTitle: "fa",
		foreignCode: "fc",
		foreignLangLocalName: "fn",
		localArticleTitle: "la",
		//displayName: "d"
	};

	mw.hook( 'wikipage.content' ).add( function( $content ) {
		$( '.ilh-all', $content ).not( '.ilh-blue' ).on( 'internalLinkHelper-close', function( event ) {
			var $this = $( this );
			if ( $this.data( 'internalLinkHelper-showing' ) ) {
				$( this ).removeClass( 'ilh-active' ).find( '.ilh-all a' ).tipsy( 'hide' ).end()
					.data( 'internalLinkHelper-showing', false );
			}
		} ).each( function() {
			var origTitle = $(this).text(),
				$foreignSpan =$(this).data(dataAlias.foreignArticleTitle), // foreign title
				$linkAnchor = $(this),
				$langCode = $(this).data(dataAlias.foreignCode), // foreign code raw
				$langName = $(this).data(dataAlias.foreignLangLocalName),
				$that = $( this ).data( 'internalLinkHelper-showing', false );

			if ( !$linkAnchor.length ) {
				return;
			}

			var timeout = null;
			
			var maybeClearTimeout = function() {
				if ( timeout !== null ) {
					clearTimeout( timeout );
				}
			}, autoSetTimeout = function() {
				maybeClearTimeout();
				timeout = setTimeout.apply( null, arguments );
			};
			
			var mouseleave = function() {
				autoSetTimeout( function() {
					$that.trigger( 'internalLinkHelper-close' );
				}, 500 );
			}, mouseenter = function() {
				if ( $that.data( 'internalLinkHelper-showing' ) ) {
					maybeClearTimeout();
				} else {
					$( '.ilh-all', $content ).not( $that ).trigger( 'internalLinkHelper-close' );
					$that.addClass( 'ilh-active' ).data( 'internalLinkHelper-showing', true );
					var tipsy = $linkAnchor.tipsy( 'show' );
					// please revise as necessary
					if(tipsy) {
						tipsy = tipsy.tipsy( true );
						if(tipsy && tipsy.tip) {
							tipsy.tip().mouseleave( mouseleave ).mouseenter( mouseenter );
						}
					}
				}
			};
			$linkAnchor.tipsy( {
				className: 'ilh-tipsy',
				gravity: 'nw',
				html: true,
				trigger: 'manual',
				title: function() {
					return '<div>'
						+ wgUVS( '条目“', '條目「' )
						+ origTitle
						+ wgUVS( '”尚未创建，可参考', '」尚未創建，可參考' )
						+ $langName
						+ wgUVS( '维基百科的对应页面：', '維基百科的對應頁面：' )
						+ $('<div>').append($("<a />",{href:"https:"+mediaWiki.config.get('wgServer')+"/wiki/"+$langCode+":"+$foreignSpan}).text($foreignSpan)).html()
						+ '。</div>';
				}
			} )
			.mouseleave( mouseleave ).mouseenter( mouseenter );
		} );
	} );
} ); } )( jQuery, mediaWiki, window );})