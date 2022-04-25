(function ($, mw) { $(function() {

var extractTitleFromURL = function (url) {
    try {
        if (url.indexOf('/w/index.php') > -1) { // 例如预览中
            url = url.replace(/.+\/index\.php\?title=([^&]+).+/, '$1').replace(/_/g, ' ');
            url = decodeURIComponent(url); // 先替换后转换，避免条目名含&
        } else {
            url = url.replace(/.+\/wiki\/([^?]+)/, '$1').replace(/_/g, ' ');
            url = decodeURIComponent(url);
        }
        return url;
    } catch (error) {
        return "iwHelper error";
    }
};

var getUserVariant = function () {
    var cur = mw.config.get("wgUserLanguage");
    if (cur.indexOf("zh-") < 0) { // 'zh' or non-Chinese UI preference
        cur = mw.config.get("wgUserVariant");
    }
    if (cur.indexOf("t") > 0 || cur.indexOf("-hk") > 0) {
        return "zh-hant";
    } else {
        return "zh-hans";
    }
}
var langCodeToLocalName = function (langCode, prefer) {
    if (typeof langLocalNames[langCode] == 'undefined') return "";
    var zhName = langLocalNames[langCode]["zh"];
    if (typeof zhName != 'undefined') {
        return zhName;
    } else {
        zhName = langLocalNames[langCode][prefer];
        return zhName || "";
    }
}

function dataValues(t) {
    this.that = t
};
dataValues.prototype = {
    get _locUrl() { return $(this.that).children('a:first-child').attr('href') || ""; },
    get _extUrl() { return $(this.that).find('a.extiw').attr('href') || ""; },
    get $origTitle() { return extractTitleFromURL(this._locUrl) },
    get $foreignSpan() { return extractTitleFromURL(this._extUrl) },
    get $linkAnchor() { return $(this.that).children('a:first-child') },
    get $langCode() { return this._extUrl.replace(/.+\:\/\/([^.]+)\.wiki.+/, '$1') || ""; }, // foreign code
    get $langName() { return langCodeToLocalName(this.$langCode, getUserVariant()) || this.langCode; },
    get $that() { return $(this.that).data('internalLinkHelper-showing', false) }
}

function csssets(newversion)
{
    this._legacy = !newversion
}
csssets.prototype = {
    get altcolor() {
        return this._legacy ? ".ilh-page a.new {    color: #007a5e;}.ilh-page a.new:hover {    color: #007a5e;}.ilh-page a.new:visited {    color: #428c7a;}.client-nojs .ilh-page a.new,.ilh-active .ilh-page a.new {    color: #BA0000;}.ilh-tool {    color: #007a5e;}" : ".ilh-all a.new {    color: #007a5e;}.ilh-all a.new:hover {    color: #007a5e;}.ilh-all a.new:visited {    color: #428c7a;}.client-nojs .ilh-all a.new,.ilh-active .ilh-all a.new {    color: #BA0000;}.ilh-tool {    color: #007a5e;}";
    },
    get cravix() {
        return this._legacy ? ".ilh-page a.new {    color: #080 !important;}.ilh-comment {    display: none;}" : ".ilh-all>a.new {    color: #080 !important;}";
    },
    get external() {
        return this._legacy ? ".ilh-page a.new {    color: #36b !important; /* mimic */}" : ".ilh-all a.new {    color: #36b !important; /* mimic */}";
    },
    get ilbluehl() {
        return this._legacy ? "span.ilh-blue span a {	color: #21a9ff;}span.ilh-blue span a:visited {	color: #2150ff;}" : "span.ilh-blue a {	color: #21a9ff;}span.ilh-blue a:visited {	color: #2150ff;}";
    },
    get redonly() {
        return ".ilh-comment {    display: none;}";
    },
    get redplain() {
        return this._legacy ? ".ilh-lang, .ilh-colon {     display: none; /* avoid spacing flash */}.ilh-link a {    color: inherit !important; /* try to mimic plain text before js is ready */}" : "";
    },
    get redtipsy() {
        return ".ilh-tipsy .tipsy-inner {    max-width: none;}";
    },
    get suffix() {
        return this._legacy ? ".ilh-comment { /* taken from [[Template:Languageicon]] */    font-family: sans-serif;    color: #54595d;    font-size: 0.8em;    bottom: 0.1em;    font-weight: bold;}.ilh-lang a {    color: inherit !important;}.ilh-colon, .ilh-link {    display: none;}" : ".ilh-comment { /* taken from [[Template:Languageicon]] */    font-family: sans-serif;    color: #54595d;    font-size: 0.8em;    bottom: 0.1em;    font-weight: bold;}.ilh-all a {    color: inherit !important;}";
    },
    _addStyle(cssText) {return mw.loader.addStyleTag(cssText);},
    _removeStyle(e) {e.remove();}
}

jssets_old = {
    cravix: function(){
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
    },
    external: function(){
        (function ($, mw) { $(function() {
            $('.ilh-all', mw.util.$content).each(function() {
                var exta = $('.ilh-link a', this);
                if (exta.length == 0) return;
                $('.ilh-page a', this).removeClass('new').addClass('extiw')
                    .attr('href', exta.attr('href'))
                    .attr('title', exta.attr('title'));
            });
        }); })(jQuery, mediaWiki);
    },
    redplain: function(){
        (function ($, mw) { $(function() {
            $('.ilh-link', mw.util.$content).each(function() {
                $(this).text($(this).text()); // remove link
            });
        }); })(jQuery, mediaWiki);
    },
    redtipsy: function(){
        mw.loader.using('jquery.tipsy', function(){
        ( function( $, mw, window ) { $( function() {

            mw.hook( 'wikipage.content' ).add( function( $content ) {
                $( '.ilh-all', $content ).not( '.ilh-blue' ).on( 'internalLinkHelper-close', function( event ) {
                    var $this = $( this );
                    if ( $this.data( 'internalLinkHelper-showing' ) ) {
                        $( this ).removeClass( 'ilh-active' ).find( '.ilh-page a' ).tipsy( 'hide' ).end()
                            .data( 'internalLinkHelper-showing', false );
                    }
                } ).each( function() {
                    var origTitle = $( this ).data( 'orig-title' ),
                        $foreignSpan = $( '.ilh-link', this ),
                        $linkAnchor = $( '.ilh-page a', this ),
                        $langCode = $( '.ilh-lang', this ),
                        langName = $langCode.text(),
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
                                + $( '<span/>' ).text( origTitle ).html()
                                + wgUVS( '”尚未创建，可参考', '」尚未創建，可參考' )
                                + $( '<span/>' ).text( langName ).html()
                                + wgUVS( '维基百科的对应页面：', '維基百科的對應頁面：' )
                                + $foreignSpan.html()
                                + '。</div>';
                        }
                    } )
                    .mouseleave( mouseleave ).mouseenter( mouseenter );
                } );
            } );
        } ); } )( jQuery, mediaWiki, window );
    });
    },
    suffix: function(){
        (function ($, mw) { $(function() {
            $('.ilh-lang', mw.util.$content).each(function() {
                $(this).text($(this).text());
            });
        }); })(jQuery, mediaWiki);
    }
}
jssets_new = {
    cravix: function(){
        // <nowiki>

(function($, mw) {
	mw.hook('wikipage.content').add(function($content) {
				$('span.ilh-all').each(function(_, item) {
					var d=new dataValues(this);
					item = $(item);
					if(item.hasClass('ilh-blue')) return;
                    // .children('a:first-child') is necessary for Mobile version
					var a = item.children('a:first-child').clone();
					var title = a.attr('title') || extractTitleFromURL(a.attr('href'));
					if (title) {
						title = title.replace((a.hasClass('new') ? / ?(（[^（）]+）|\([^\(\)]+\))$/ : ''), '');
						a.text(title);
					}

					var tipHtml = wgUVS(
						'<span>条目$0尚未创建，可参考$1维基百科的对应页面$2。</span>',
						'<span>條目$0尚未創建，可參考$1維基百科的對應頁面$2。</span>')
						.replace('$0', a[0].outerHTML) // red link
						.replace('$1', d.$langName)
						.replace('$2', ($("<a />",{href:"https://"+mediaWiki.config.get('wgServerName').replace('zh', d.$langCode)+"/wiki/"+d.$foreignSpan}).text(d.$foreignSpan))[0].outerHTML);

						var popup = new OO.ui.PopupWidget( { // todo: close button edge
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
    },
    external: function(){
        (function ($, mw) { $(function() {
            $('.ilh-all', mw.util.$content).each(function() {
                var d=new dataValues(this);

                var newurl ="https://"+mediaWiki.config.get('wgServerName').replace('zh', d.$langCode)+"/wiki/"+d.$foreignSpan;
        $('a', this).removeClass('new').addClass('extiw')
            .attr('href', newurl)
            .attr('title', d.$foreignSpan);
    });
}); })(jQuery, mediaWiki);
    },
    redplain: function(){
        (function ($, mw) { $(function() {
            $('.ilh-all', mw.util.$content).each(function() {
                var d=new dataValues(this);
                $(this).append($('<span class="noprint ilh-comment">（'+d.$foreignSpan+'）</span>'));
            });
        }); })(jQuery, mediaWiki);
    },
    redtipsy: function(){
        mw.loader.using('jquery.tipsy', function(){
            ( function( $, mw, window ) { $( function() {
                $( '.ilh-all', mw.util.$content ).not( '.ilh-blue' ).on( 'internalLinkHelper-close', function( event ) {
                    if ( $(this).data( 'internalLinkHelper-showing' ) ) {
                        $(this).removeClass( 'ilh-active' ).children('a:first-child').tipsy( 'hide' ).end()
                            .data( 'internalLinkHelper-showing', false );
                    }
                } ).each( function() {
                    var d=new dataValues(this);
                    if ( !d.$linkAnchor.length ) {
                        return;
                    }
                    var $that = $( this ).data( 'internalLinkHelper-showing', false );
        
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
                            $that.children('a:first-child').trigger( 'internalLinkHelper-close' );
                        }, 500 );
                    }, mouseenter = function() {
                        if ( $that.data( 'internalLinkHelper-showing' ) ) {
                            maybeClearTimeout();
                        } else {
                            $( '.ilh-all', mw.util.$content ).not( $that ).children('a:first-child').trigger( 'internalLinkHelper-close' );
                            $that.addClass( 'ilh-active' ).data( 'internalLinkHelper-showing', true );
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
                            return '<span>'
                                + wgUVS( '条目“', '條目「' )
                                + d.$origTitle
                                + wgUVS( '”尚未创建，可参考', '」尚未創建，可參考' )
                                + d.$langName
                                + wgUVS( '维基百科的对应页面：', '維基百科的對應頁面：' )
                                + $("<a />",{href:"https://"+mediaWiki.config.get('wgServerName').replace('zh', d.$langCode)+"/wiki/"+d.$foreignSpan}).text(d.$foreignSpan)[0].outerHTML
                                + '。</span>';
                        }
                    } )
                    .mouseleave( mouseleave ).mouseenter( mouseenter );
                } );
            } ); } )( jQuery, mediaWiki, window );})
    },
    suffix: function(){
        (function ($, mw) { $(function() {
            $('.ilh-all', mw.util.$content).each(function() {
                var d=new dataValues(this);
                $(this).append($('<span class="noprint ilh-comment">（<span class="ilh-lang">'+d.$langName+'</span>）</span>'));
            });
        }); })(jQuery, mediaWiki);
    }
}

var langLocalNames = {
    af: { zh: "南非语" },
    am: { zh: "阿姆哈拉语" },
    ar: { "zh-hant": "阿拉伯語", "zh-hans": "阿拉伯语" },
    az: { zh: "阿塞拜疆语" },
    be: { zh: "白俄羅斯語" },
    "be-tarask": { zh: "舊白俄羅斯語" },
    bg: { zh: "保加利亞語" },
    bn: { zh: "孟加拉語" },
    bo: { zh: "藏语" },
    bs: { zh: "波斯尼亚语" },
    ca: { zh: "加泰罗尼亚语" },
    cdo: { zh: "閩東語" },
    cs: { zh: "捷克語" },
    cy: { zh: "威尔士语" },
    da: { zh: "丹麥語" },
    de: { zh: "德语" },
    el: { zh: "希臘語" },
    en: { "zh-hant": "英語", "zh-hans": "英语" },
    eo: { zh: "世界语" },
    es: { "zh-hant": "西班牙語", "zh-hans": "西班牙语" },
    et: { zh: "爱沙尼亚语" },
    eu: { zh: "巴斯克语" },
    fa: { zh: "波斯語" },
    fi: { zh: "芬蘭語" },
    fo: { zh: "法罗语" },
    fr: { "zh-hant": "法語", "zh-hans": "法语" },
    frp: { "zh-hant": "阿爾卑坦語", "zh-hans": "阿尔卑坦语" },
    ga: { zh: "愛爾蘭語" },
    gan: { zh: "赣语" },
    gl: { zh: "加利西亞語" },
    gor: { "zh-hant": "哥倫打洛文", "zh-hans": "哥伦打洛文" },
    gu: { zh: "古吉拉特語" },
    gv: { zh: "马恩语" },
    he: { zh: "希伯來語" },
    hi: { zh: "印地語" },
    hr: { zh: "克羅地亞語" },
    ht: { zh: "海地克里奥尔语" },
    hu: { zh: "匈牙利语" },
    hy: { zh: "亞美尼亞語" },
    id: { zh: "印度尼西亚语" },
    inh: { "zh-hant": "印古什文", "zh-hans": "印古什文" },
    is: { zh: "冰島語" },
    it: { zh: "義大利語" },
    ja: { "zh-hant": "日語", "zh-hans": "日语" },
    ka: { zh: "格鲁吉亚语" },
    kk: { zh: "哈萨克语" },
    km: { "zh-hant": "高棉語", "zh-hans": "高棉语" },
    ko: { "zh-hant": "韓語", "zh-hans": "朝鲜语" },
    ku: { zh: "库尔德语" },
    ky: { zh: "柯爾克孜語" },
    la: { zh: "拉丁語" },
    lad: { zh: "拉迪诺语" },
    lb: { zh: "卢森堡语" },
    lo: { "zh-hant": "寮語", "zh-hans": "老挝语" },
    lt: { zh: "立陶宛语" },
    lv: { zh: "拉脫維亞語" },
    lzh: { zh: "文言文" },
    min: { zh: "米南加保语" },
    mk: { "zh-hant": "馬其頓語", "zh-hans": "马其顿语" },
    ml: { zh: "马拉雅姆语" },
    mn: { zh: "蒙古語" },
    ms: { zh: "馬來語" },
    mt: { zh: "马耳他语" },
    my: { zh: "缅甸语" },
    na: { zh: "瑙鲁语" },
    nan: { zh: "閩南語" },
    nds: { "zh-hant": "低地德语", "zh-hans": "低地德语" },
    ne: { zh: "尼泊尔语" },
    nl: { zh: "荷兰语" },
    no: { zh: "書面挪威語" },
    oc: { zh: "奥克语" },
    pl: { "zh-hant": "波蘭語", "zh-hans": "波兰语" },
    ps: { zh: "普什图语" },
    pt: { zh: "葡萄牙語" },
    qu: { "zh-hant": "克丘亞語", "zh-hans": "克丘亚语" },
    rm: { zh: "罗曼什语" },
    ro: { zh: "羅馬尼亞語" },
    ru: { zh: "俄语" },
    sa: { "zh-hant": "梵語", "zh-hans": "梵语" },
    sh: { zh: "塞爾維亞-克羅地亞語" },
    si: { zh: "僧伽罗语" },
    simple: { zh: "簡單英語" },
    sk: { zh: "斯洛伐克语" },
    sl: { zh: "斯洛維尼亞語" },
    smn: { "zh-hant": "伊納里薩米文", "zh-hans": "伊纳里萨米文" },
    so: { zh: "索馬利亞語" },
    sq: { zh: "阿尔巴尼亚语" },
    sr: { zh: "塞尔维亚语" },
    sv: { zh: "瑞典语" },
    sw: { zh: "斯瓦西裡語" },
    szy: { "zh-hant": "撒奇萊雅語", "zh-hans": "撒奇莱雅语" },
    ta: { zh: "泰米尔语" },
    te: { zh: "泰卢固语" },
    tg: { zh: "塔吉克语" },
    th: { zh: "泰语" },
    tl: { zh: "他加禄语" },
    tr: { zh: "土耳其語" },
    tt: { zh: "韃靼語" },
    tyv: { zh: "图瓦语" },
    uk: { zh: "烏克蘭語" },
    ur: { zh: "烏爾都語" },
    uz: { zh: "烏孜別克语" },
    vi: { zh: "越南语" },
    wuu: { zh: "吴语" },
    xmf: { zh: "明格列尔语" },
    yue: { zh: "粵语" },
    "zh-classical": { zh: "文言" }
};

function options() {}
options.prototype = {
    readOption: function(name, defValue){
        return localStorage.getItem(name) || defValue;
    },
    saveOption: function(name, value){
        return localStorage.setItem(name, value);
    },
    deleteOption: function(name){
        localStorage.removeItem(name);
    }
};
var optionHandler = new options();

var isOldLua = $('.ilh-all .ilh-lang').length > 0;

// options window
optionsManager = function(){
    this.windowManager = null;
    this.processDialog = null;
    this.optionInitialized = false;
}
optionsManager.prototype.optionInit = function(){
    function ProcessDialog( config ) {
        ProcessDialog.super.call( this, config );
    }
    OO.inheritClass( ProcessDialog, OO.ui.ProcessDialog );
    
    // Specify a name for .addWindows()
    ProcessDialog.static.name = 'myDialog';
    // Specify a static title and actions.
    ProcessDialog.static.title = '效果设置';
    ProcessDialog.static.actions = [
        /*{
            action: 'Save',
            label: '保存但不刷新页面',
            flags: ''
        },*/
        {
            action: 'Apply',
            label: '保存并刷新页面',
            flags: ['primary', 'progressive']
        },
        {
            label: '取消',
            flags: ['safe', 'close']
        }
    ];
    
    // Use the initialize() method to add content to the dialog's $body,
    // to initialize widgets, and to set up event handlers.
    ProcessDialog.prototype.initialize = function () {
        ProcessDialog.super.prototype.initialize.apply( this, arguments );
    
        this.dropdown = new OO.ui.DropdownWidget( {
            menu: {
                items: [
                    new OO.ui.MenuOptionWidget( {
                        data: 'disabled',
                        label: wgUVS('禁用小工具','停用小工具'),
                        indicator: 'clear'
                    } ),
                    new OO.ui.MenuOptionWidget( {
                        data: 'redonly',
                        label: wgUVS('只显示红链','只顯示紅鏈')
                    } ),
                    new OO.ui.MenuOptionWidget( {
                        data: 'redtipsy',
                        label: wgUVS('光标悬浮时显示Tooltip','在Tooltip中顯示原文連結'),
                        indicator: 'required'
                    } ),
                    new OO.ui.MenuOptionWidget( {
                        data: 'redplain',
                        label: wgUVS('显示红链和未链接原文','顯示紅鏈和未連結原文')
                    } ),
                    new OO.ui.MenuOptionWidget( {
                        data: 'external',
                        label: wgUVS('直接指向原文','直接指向原文')
                    } ),
                    new OO.ui.MenuOptionWidget( {
                        data: 'suffix',
                        label: wgUVS('指向原文和语言名后缀','指向原文和語言名後綴')
                    } ),
                    new OO.ui.MenuOptionWidget( {
                        data: 'cravix',
                        label: wgUVS('鼠标点击时显示Tooltip','滑鼠點擊時顯示Tooltip')
                    } ),
                    new OO.ui.MenuOptionWidget( {
                        data: 'altcolor',
                        label: wgUVS('光标悬浮时显示Tooltip','游標懸浮時顯示Tooltip')
                    } ),
                    new OO.ui.MenuOptionWidget( {
                        data: 'ilbluehl',
                        label: wgUVS('光标悬浮时显示Tooltip（对于已存在页面的情况下高亮表示）',
                                     '游標懸浮時顯示Tooltip（對於已存在頁面的情況下高亮表示）')
                    } ),
                ]
            }
        } )
        this.content = new OO.ui.PanelLayout( {
            padded: true,
            expanded: false
        } );
        //this.content.$element.append( '<p>This is a process dialog window. The header contains the title and two buttons: \'Cancel\' (a safe action) on the left and \'Done\' (a primary action) on the right. </p>' );
        this.content.$element.append(this.dropdown.$element)
    
        this.$body.append( this.content.$element );
    
        var curValue = optionHandler.readOption("gadget-iwhelper-effect", "");
        this.dropdown.getMenu().selectItemByData( curValue || 'redtipsy' );
    };

    // todo: disabled for Mobile
    // todo: mw.user.options for sync preference in gadget?
    
    // Use the getActionProcess() method to specify a process to handle the
    // actions (for the 'save' action, in this example).
    ProcessDialog.prototype.getActionProcess = function ( action ) {
        var dialog = this;
        if ( action ) {
            return new OO.ui.Process( function () {
                var optionName = "gadget-iwhelper-effect";
                var newOptionValue = dialog.dropdown.getMenu().findSelectedItem().getData();
                optionHandler.saveOption(optionName, newOptionValue);
                dialog.close( {action: action} );
                window.location.reload();
            } );
        }
    // Fallback to parent handler.
        return ProcessDialog.super.prototype.getActionProcess.call( this, action );
    };
    ProcessDialog.prototype.getBodyHeight = function () {
        return 380;
    };
    
    // Create and append the window manager.
    this.windowManager = new OO.ui.WindowManager();
    $( document.body ).append( this.windowManager.$element );
    
    // Create a new dialog window.
    this.processDialog = new ProcessDialog({
        size: 'medium'
    });
    
    // Add windows to window manager using the addWindows() method.
    this.windowManager.addWindows( [ this.processDialog ] );

    this.optionInitialized = true;
}

var optionsObj = new optionsManager();
function openOptions() {
    if(!optionsObj.optionInitialized){
        optionsObj.optionInit();
    }
    optionsObj.windowManager.openWindow( optionsObj.processDialog );
};
// todo: Effect preview.
// todo: mw.user.getId() for options saving in lawful multiple accounts?
// todo: Skip initialization if there is no matching link?

$.when( mw.loader.using('mediawiki.util'), $.ready ).then( function() {
    if($('#tb-iwhelper-options').length>0) return;
    var portletLink = mw.util.addPortletLink( 'p-tb', '#', wgUVS('跨语言链接效果', '跨語言連結效果'), 'tb-iwhelper-options', '设置 Template:Internal_link_helper 系列模板的呈现效果');
    $( portletLink ).click( function ( e ) {
        e.preventDefault();
        openOptions();
    });
} );

var isMobileView = mediaWiki.config.get('skin') == 'minerva';
function loadEffect() {
    var c = new csssets(!isOldLua);

    var curDisabled = false;
    var curValue = optionHandler.readOption("gadget-iwhelper-effect", 'redtipsy');

    if (isMobileView) {
        if (['redtipsy', 'altcolor', 'ilbluehl'].indexOf(curValue)>-1) { // todo: disables
            curValue = 'cravix'; // no hover
        }
    }

    switch (curValue) {
        case 'redonly':
            c._addStyle(c.redonly);
            break;
        case 'redtipsy':
            c._addStyle(c.redonly);
            c._addStyle(c.redtipsy);
            isOldLua ? jssets_old.redtipsy() : jssets_new.redtipsy();
            break;
        case 'redplain':
            c._addStyle(c.redplain);
            isOldLua ? jssets_old.redplain() : jssets_new.redplain();
            break;
        case 'external':
            c._addStyle(c.redonly);
            c._addStyle(c.external);
            isOldLua ? jssets_old.external() : jssets_new.external();
            break;
        case 'suffix':
            c._addStyle(c.external);
            c._addStyle(c.suffix);
            isOldLua ? jssets_old.external() : jssets_new.external();
            isOldLua ? jssets_old.suffix() : jssets_new.suffix();
            break;
        case 'cravix':
            c._addStyle(c.cravix);
            isOldLua ? jssets_old.cravix() : jssets_new.cravix();
            break;
        case 'altcolor':
            c._addStyle(c.redonly);
            c._addStyle(c.redtipsy);
            c._addStyle(c.altcolor);
            isOldLua ? jssets_old.redtipsy() : jssets_new.redtipsy();
            break;
        case 'ilbluehl':
            c._addStyle(c.redonly);
            c._addStyle(c.redtipsy);
            c._addStyle(c.altcolor);
            c._addStyle(c.ilbluehl);
            isOldLua ? jssets_old.redtipsy() : jssets_new.redtipsy();
            break;
        default:
            curDisabled = true;
            break;
    }
    if (curDisabled) {
        // Smaller than <small>. todo: move to TemplateStyles or common.js?
        c._addStyle(".ilh-all .extiw {font-size: 0.75em;}");
    } else {
        c._addStyle(".ilh-all .extiw {display:none;}"); // todo: move to somewhere .css to speed up
    }
}

var isConflict = (mw.user.options.get('gadget-internalLinkHelper-cravix') + 
mw.user.options.get('gadget-internalLinkHelper-external') + 
mw.user.options.get('gadget-internalLinkHelper-ilbluehl') + 
mw.user.options.get('gadget-internalLinkHelper-redonly') + 
mw.user.options.get('gadget-internalLinkHelper-redplain') + 
mw.user.options.get('gadget-internalLinkHelper-redtipsy') + 
mw.user.options.get('gadget-internalLinkHelper-suffix') > 0);

var libs = isMobileView ? 
['mediawiki.util','ext.gadget.site-lib'] : 
['mediawiki.util','jquery.tipsy','ext.gadget.site-lib'];
mw.loader.using(libs, function(){
    if (isConflict) {
        // credit: https://zh.wikipedia.org/wiki/MediaWiki:Gadget-Wordcount.js 
        var divj = $('<div />').html("新版与旧版internalLinkHelper小工具不能同时运行")
                .css({
                    'position': 'fixed',
                    'right': '0',
                    'bottom': '0',
                    'margin': '4px',
                    'padding': '6px'
                })
                .addClass('wordcount ui-state-highlight ui-corner-all')
                .appendTo('body');
                // we hook keyup, so this may make it flickering
                // eg when shift, ctrl.etc key up
                //.hide().fadeIn('slow');
            setTimeout(function() {
                divj.fadeOut('slow');
            }, 10000);
    } else {
        loadEffect();
    }
});

}); })(jQuery, mediaWiki);