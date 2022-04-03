var dataAlias = {
    foreignArticleTitle: "fa", // 外语条目名称
    foreignCode: "fc", // 外部语言代码
    foreignLangLocalName: "fn", // 外语在本地的名称 如"英语"
    localArticleTitle: "la", // 本地条目名称
    //displayName: "d" // 链接显示名称
};

var dataValues = function(that) {
    return {
        $origTitle: $(that).text(),
        $foreignSpan: $(that).data(dataAlias.foreignArticleTitle), // foreign title
        $linkAnchor: $(that),
        $langCode: $(that).data(dataAlias.foreignCode), // foreign code raw
        $langName: $(that).data(dataAlias.foreignLangLocalName) || "其他语言",
        $that: $(that).data( 'internalLinkHelper-showing', false )
    }
};
