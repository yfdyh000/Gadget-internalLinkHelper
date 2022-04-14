mw.loader.using('jquery.tipsy', function(){
( function( $, mw, window ) { $( function() {
	mw.hook( 'wikipage.content' ).add( function( $content ) {
		$( '.ilh-all', $content ).not( '.ilh-blue' ).on( 'internalLinkHelper-close', function( event ) {
			if ( $(this).data( 'internalLinkHelper-showing' ) ) {
				$(this).removeClass( 'ilh-active' ).tipsy( 'hide' ).end()
					.data( 'internalLinkHelper-showing', false );
			}
		} ).each( function() {
			var d=new dataValues(this);
			if ( !d.$linkAnchor.length ) {
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
					d.$that.trigger( 'internalLinkHelper-close' );
				}, 500 );
			}, mouseenter = function() {
				if ( d.$that.data( 'internalLinkHelper-showing' ) ) {
					maybeClearTimeout();
				} else {
					$( '.ilh-all', $content ).not( d.$that ).trigger( 'internalLinkHelper-close' );
					d.$that.addClass( 'ilh-active' ).data( 'internalLinkHelper-showing', true );
					var tipsy = d.$linkAnchor.tipsy( 'show' );
					// please revise as necessary
					if(tipsy) {
						tipsy = tipsy.tipsy( true );
						if(tipsy && tipsy.tip) {
							tipsy.tip().mouseleave( mouseleave ).mouseenter( mouseenter );
						}
					}
				}
			};
			d.$linkAnchor.tipsy( {
				className: 'ilh-tipsy',
				gravity: 'nw',
				html: true,
				trigger: 'manual',
				title: function() {
					return '<div>'
						+ wgUVS( '条目“', '條目「' )
						+ d.$origTitle
						+ wgUVS( '”尚未创建，可参考', '」尚未創建，可參考' )
						+ d.$langName
						+ wgUVS( '维基百科的对应页面：', '維基百科的對應頁面：' )
						+ $('<div>').append($("<a />",{href:"https:"+mediaWiki.config.get('wgServer').replace('zh', d.$langCode)+"/wiki/"+d.$foreignSpan}).text(d.$foreignSpan)).html()
						+ '。</div>';
				}
			} )
			.mouseleave( mouseleave ).mouseenter( mouseenter );
		} );
	} );
} ); } )( jQuery, mediaWiki, window );})