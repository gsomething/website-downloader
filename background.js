
var trackedItems= [];
var rootDirectory = "";
var allowedUrls= [];
var tracking= false;


function startTracking(){
	console.log("started tracking in BG!");

    getCurrentBaseUrl();

    tracking= true;

    chrome.webRequest.onBeforeRequest.addListener(
        track,
        {urls: allowedUrls},
        ["blocking"])
}

function setBaseUrl(currentBasUrl)
{
    rootDirectory= currentBasUrl+'/';
    allowedUrls= ["*://*.'+currentBaseUrl+'/*"];

    alert('Beginning capture for domain: '+currentBasUrl);
}

function getCurrentBaseUrl()
{
    var baseUrl;

    chrome.tabs.getSelected(null, function(tab) {
        var tabId = tab.id;
        var tabUrl = tab.url;

        http://[something (n...)].[domainname.[something]]/

        // [^w{3}\.]([a-zA-Z0-9]([a-zA-Z0-9\-]{0,65}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}



        //var baseUrl= tabUrl.match(/[^w{3}\.]([a-zA-Z0-9]([a-zA-Z0-9\-]{0,65}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/gim)[0];

        var domainNameArray= tabUrl.split('/')[2].split('.');

        setBaseUrl(domainNameArray[domainNameArray.length-2]+'.'+domainNameArray[domainNameArray.length-1]);
    });


}


function stopTracking()
{
	trackedItems= [];
    chrome.webRequest.onBeforeRequest.removeListener(track);

    tracking= false;
}


var track= function(details)
{
    var url= details.url;

	if(url.match(/.*(\.(xml|ashx|css|woff|ttf|svg|js|swf|bmp|gif|jpe?g|png|tiff?)).*$/gi))
	{
		addToBucket(new Downloadable(url));
	} else {
		console.log("other:", url);
	}
}


function addToBucket(url)
{
	if(!trackedItems.contains(url))
	{
		trackedItems.push(url);
	}
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i].url == obj.url) {
            return true;
        }
    }
    return false;
}

function downloadTracked(){

	downloadCurrentPage();
	downloadResources();
	console.log("started downloading! resources: ");
}


function downloadCurrentPage()
{
	//get the current page source
	chrome.tabs.query({}, function(tabInfo){

		var url= tabInfo[0].url;		
		var path= fixPath(url);
		path =  path.replace(/\.do$/,'.html');

		console.info('path (before):', path);

		if(path.length < 1){
			path= 'index.html';
		}
        if(path[path.length-1]==='/'){
            path= path+'index.html';
        }

        console.info('path (after):', path);

		var conflictAction = "prompt";

        console.info('CONFLICT ACTION:', conflictAction);
			
		chrome.downloads.download({url: tabInfo[0].url, filename: rootDirectory + path, conflictAction: conflictAction},function(id) { console.log("downloaded " + id)});
	});	
}

function downloadResources()
{
	for(var i =0 ; i< trackedItems.length; i++){
        if(trackedItems[i].downloaded==false)
        {
            var url =  trackedItems[i].url;
            var fileNameAndPath = fixPath(url);

            //console.log("downloading "+ fileNameAndPath);
            chrome.downloads.download({url: url, filename: rootDirectory + fileNameAndPath,  conflictAction: 'overwrite'},function(downloadId) {
                //console.info("Downloaded (id)", downloadId);
                chrome.downloads.search({"id": downloadId },
                    function(results){

                        if(results[0]){
                            var result= results[0];
                            markAsDownloaded(results[0].url);
                        }
                         //console.info('downloaded: ', result);
                    }
                )
            });
        }
	}
}

function fixPath(url)
{
	var path= url.replace(/^https?:\/\/[^\/]+(\/?)+/i, '').replace(/[\?|;].*/g,'').replace(/%20/g,' ');

	return path;
}


function countTabs()
{
    chrome.windows.getAll({"populate" : true}, function(windows)
    {
        var tabCount= 0;

        for(var i = 0; i < windows.length; i++)
        {
            if(windows[i].type==="normal")
            {
                for(var j = 0; j < windows[i].tabs.length; j++)
                {
                    tabCount++;
                }
            }
        }

        verifyTabCount(tabCount);
    });
}

function markAsDownloaded(url)
{
    for(var i =0 ; i< trackedItems.length; i++){

        if(trackedItems[i].url=== url)
        {
            trackedItems[i].downloaded= true;
        }
    }
}

function verifyTabCount(tabCount)
{

    // if other tabs exist -->
    if(tabCount > 1)
    {
        showWarning();
    } else {
        initButtons();
    }

    console.log('tab count is: '+ tabCount);
}

function showWarning()
{
    document.getElementById('output').innerHTML="Please close all other windows and tabs to ensure you only get data required for this page";
}


var Downloadable= function(url){ this.init(url)}
Downloadable.prototype= {

    downloaded: false,
    url: null,

    init: function(url)
    {
        this.url= url;
    }

}