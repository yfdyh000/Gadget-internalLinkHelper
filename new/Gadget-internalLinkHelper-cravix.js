// <nowiki>

(function($, mw) {
	mw.loader.getScript('https://zh.wikipedia.org/w/index.php?title=MediaWiki:Tooltips.js&action=raw&ctype=text/javascript').then(function() {
		mw.hook('wikipage.content').add(function($content) {
			var baseUrl = '//upload.wikimedia.org/wikipedia/commons/';
			var buttonImages = [
				'f/f8/Tooltip-CloseButton.png',
				'5/5a/Tooltip-CloseButton-Hover.png',
				'd/df/Tooltip-CloseButton-Active.png'
			];
			var close_imgs = $.map(buttonImages, function(src) {
				return $('<img/>').attr('src', baseUrl + src).attr('width', 16)[0];
			});
			var createTips = function(clsname, tipclsname, attrs, isChild) {
				$('span.ilh-all').each(function(_, item) {
					var d=dataValues(this);

					item = $(item);
					if(item.hasClass('ilh-blue')) return;
					var chinese = item;
					chinese.addClass(clsname);
					var a = item.clone();
					var title = a.attr('title') || extractTitleFromURL(a.attr('href'));
					if (title) {
						title = title.replace((a.hasClass('new') ? / ?(（[^（）]+）|\([^\(\)]+\))$/ : ''), '');
						a.text(title);
					}
					var tipHtml = wgUVS(
						'条目$0尚未创建，可参考$1维基百科的对应页面$2。',
						'條目$0尚未創建，可參考$1維基百科的對應頁面$2。'
					)
						.replace('$0', a[0].outerHTML) // red link
						.replace('$1', d.$langName)
						.replace('$2', $('<div>').append($("<a />",{href:"https:"+mediaWiki.config.get('wgServer').replace('zh', d.$langCode)+"/wiki/"+d.$foreignSpan}).text(d.$foreignSpan)).html());

					var tip = $('<div/>').addClass(tipclsname).hide();
					tip.html(tipHtml);
					new Tooltip(isChild ? chinese[0].firstChild : chinese[0], tip[0], attrs, {
						border: "1px solid black",
						background: "#DDDDDD",
						padding: "0.5em"
					});
				});
			};

			createTips(
				'ILHClickButton',
				'ILHClickButton_tip',
				{
					mode: Tooltip.MOUSE,
					close_button: close_imgs,
					activate: Tooltip.CLICK,
					deactivate: Tooltip.CLICK_ELEM
				},
				true
			);
		});
	});
})(jQuery, mediaWiki);

// </nowiki>