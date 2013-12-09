var ChromeMock= function(){};

ChromeMock.prototype= {

    webRequest:
    {
        onBeforeRequest:
        {
            addListener: function(){}
        }
    },

    tabs: {},
    downloads: {},
    windows: {}
}