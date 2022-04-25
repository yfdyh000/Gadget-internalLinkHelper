// <nowiki>

(function($, mw) {
	mw.hook('wikipage.content').add(function($content) {
				$('span.ilh-all').each(function(_, item) {
					var d=new dataValues(this);
					item = $(item);
					if(item.hasClass('ilh-blue')) return;
					var a = item.clone();
					var title = a.attr('title') || extractTitleFromURL(a.attr('href'));
					if (title) {
						title = title.replace((a.hasClass('new') ? / ?(（[^（）]+）|\([^\(\)]+\))$/ : ''), '');
						a.text(title);
					}
					var tipHtml = wgUVS(
						'<span>条目$0尚未创建，可参考$1维基百科的对应页面$2。</span>',
						'<span>條目$0尚未創建，可參考$1維基百科的對應頁面$2。</span>')
						.replace('$0', a[0].innerHTML) // red link
						.replace('$1', d.$langName)
						.replace('$2', ($("<a />",{href:"https://"+mediaWiki.config.get('wgServerName').replace('zh', d.$langCode)+"/wiki/"+d.$foreignSpan}).text(d.$foreignSpan))[0].outerHTML);

						var popup = new OO.ui.PopupWidget( {
							$content: $(tipHtml),
							padded: true,
							//width: 450,
							head: true,
							invisibleLabel: true,
							label: wgUVS('条目尚未创建', '條目尚未創建')
						} );
						$(item).not( '.ilh-blue' ).children('a').off("click");
						$( item).append( popup.$element );
						$(item).not( '.ilh-blue' ).on("click",function(e){popup.toggle( true );e.preventDefault();});
				});
		});
})(jQuery, mediaWiki);

// </nowiki>