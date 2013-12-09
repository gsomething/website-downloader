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

        spyOn(downloaderUtil,'setBaseUrl');

        downloaderUtil.extractUrlFromTab(mockTab);

        expect(downloaderUtil.setBaseUrl).toHaveBeenCalledWith(['subdomain','domain','co','uk']);

    });



});
