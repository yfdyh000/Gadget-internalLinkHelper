var dataAlias = {
    foreignArticleTitle: "fa", // 外语条目名称
    foreignCode: "fc", // 外部语言代码
    foreignLangLocalName: "fn", // 外语在本地的名称 如"英语"
    localArticleTitle: "la", // 本地条目名称
    //displayName: "d" // 链接显示名称
};
(function ($, mw) { $(function() {
    $('.ilh-all', mw.util.$content).each(function() {
        $foreignSpan =$(this).data(dataAlias.foreignArticleTitle);
        $(this).append($('<span class="noprint ilh-comment">（'+$foreignSpan+'）</span>'));
    });
}); })(jQuery, mediaWiki);