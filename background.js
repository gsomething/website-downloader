
var trackedItems= [];
var rootDirectory = "equalexperts.com/";
var allowedUrls= ["*://*.equalexperts.com/*"];
var tracking= false;


function startTracking(){
	console.log("started tracking in BG!");
    tracking= true;

   // chrome.browsingData.remove({}, {},function(){
   // {
        chrome.webRequest.onBeforeRequest.addListener(
            track,
            {urls: allowedUrls},
            ["blocking"])

   // });
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