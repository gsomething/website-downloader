describe("Downloader", function() {

    var downloaderUtil;
    var chrome;

    beforeEach(function()
    {
        downloaderUtil= new DownloaderUtil();
        chrome= new ChromeMock();
    });

    it ("should extract the current url from the tab", function()
    {
        var mockTab= {
            url: "http://subdomain.domain.co.uk"
        }

        spyOn(downloaderUtil, 'setBaseUrlArray');

        downloaderUtil.extractUrlFromTab(mockTab);

        expect(downloaderUtil.setBaseUrlArray).toHaveBeenCalledWith(['subdomain','domain','co','uk']);
    });

    it("should set the url", function()
    {
        downloaderUtil.setBaseUrlArray(['a','b','z']);
        expect(downloaderUtil.baseUrlArray).toEqual(['a','b','z']);
    });
});
