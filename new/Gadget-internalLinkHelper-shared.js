var extractTitleFromURL = function(url) {
    try {
        if(url.indexOf('/w/index.php') > -1) { // 例如预览中
            url = url.replace(/.+\/index\.php\?title=([^&]+).+/, '$1').replace(/_/g, ' ');
            url = decodeURIComponent(url); // 后置，避免条目名含&
        } else {
            url = url.replace(/.+\/wiki\/([^?]+)/, '$1').replace(/_/g, ' ');
            url = decodeURIComponent(url);
        }
        return url;
    } catch (error) {
        return "iwHelper error";
    }
};

var getUserVariant = function() {
    var cur = mw.config.get("wgUserLanguage");
    if (cur.indexOf("zh-") < 0) { // 'zh' or non-Chinese UI preference
        cur = mw.config.get("wgUserVariant");
    }
    if (cur.indexOf("t")>0 || cur.indexOf("-hk")>0) {
        return "zh-hant";
    } else {
        return "zh-hans";
    }
}
var langCodeToLocalName = function(langCode, prefer) {
    if(typeof langLocalNames[langCode] == 'undefined') return "";
    var zhName = langLocalNames[langCode]["zh"];
    if(typeof zhName != 'undefined'){
        return zhName;
    } else {
        zhName = langLocalNames[langCode][prefer];
        return zhName || "";
    }
}

var dataValues = function(that) {
    var locUrl = $(that).children('a:first-child').attr('href') || "";
    var extUrl = $(that).find('a.extiw').attr('href') || "";
    var langCode = extUrl.replace(/.+\:\/\/([^.]+)\.wiki.+/, '$1');
    var langName = langCodeToLocalName(langCode, getUserVariant()) || langCode;
    return {
        $origTitle: extractTitleFromURL(locUrl),
        $foreignSpan: extractTitleFromURL(extUrl), // $foreignTitleFromUrl
        $linkAnchor: $(that).children('a:first-child'),
        $langCode: langCode, // foreign code
        $langName: langName,
        $that: $(that).data( 'internalLinkHelper-showing', false )
    }
};
