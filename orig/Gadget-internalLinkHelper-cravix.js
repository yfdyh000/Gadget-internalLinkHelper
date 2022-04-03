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
					item = $(item);
					if ($('.ilh-comment', item).length == 0) return;

					var chinese = $('span.ilh-page', item);

					chinese.addClass(clsname);
					var a = $('.ilh-page a', item).clone();
					if (a.length == 0) return;
					var title = a.attr('title') || a.attr('original-title');
					if (title) {
						title = title.replace((a.hasClass('new') ? / ?(（[^（）]+）|\([^\(\)]+\))$/ : ''), '');
						a.text(title);
					}
					var tipHtml = wgUVS(
						'条目$0尚未创建，可参考$1维基百科的对应页面$2。',
						'條目$0尚未創建，可參考$1維基百科的對應頁面$2。'
					)
						.replace('$0', a[0].outerHTML)
						.replace('$1', $('.ilh-lang', item).html())
						.replace('$2', $('.ilh-link', item).html());

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