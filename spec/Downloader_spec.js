describe("Downloader", function() {

    var downloader;
    var chrome;

    beforeEach(function(){

        downloader= new Downloader();
        chrome= new ChromeMock();

    });



    it ("should set the current url", function() {

        spyOn(chrome.webRequest.onBeforeRequest, 'addListener');

        expect(chrome.webRequest.onBeforeRequest.toHaveBeenCalledWith());
    });

    it ("should change state when downloading begins", function() {
        expect(false).toBeTruthy();
    });
});
