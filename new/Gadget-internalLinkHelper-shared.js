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
    get $langName() { return langCodeToLocalName(this.langCode, getUserVariant()) || this.langCode; },
    get $that() { return $(this.that).data('internalLinkHelper-showing', false) }
}