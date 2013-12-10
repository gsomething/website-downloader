var DownloaderUtil= function(){}

DownloaderUtil.prototype=
{
    baseUrlArray: null,

    extractUrlFromTab: function(tab)
    {
        var tabUrl = tab.url;
        var domainNameArray= tabUrl.split('/')[2].split('.');

        this.setBaseUrlArray(domainNameArray);
    },

    setBaseUrlArray: function(baseUrlArray)
    {
        this.baseUrlArray= baseUrlArray;
    }
}