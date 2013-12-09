var DownloaderUtil= function(){}

DownloaderUtil.prototype=
{
    extractUrlFromTab: function(tab)
    {
        var tabUrl = tab.url;
        var domainNameArray= tabUrl.split('/')[2].split('.');

        this.setBaseUrl(domainNameArray);
    },

    setBaseUrl: function(baseUrl)
    {

    }
}