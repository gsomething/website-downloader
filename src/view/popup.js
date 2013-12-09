var BG;

document.addEventListener('DOMContentLoaded', function()
{
    initButtons();

    BG= chrome.extension.getBackgroundPage();

    if(BG.tracking == true){
        setButtonsStarted();

    }  else{
        setButtonsStopped();
    }
});

function initButtons()
{
    console.info('initting buttons');

    createButton('startBtn', "Start Network Capture", function(){ startTracking(); });
    createButton('downloadtBtn', "Download", function(){ downloadTracked(); });
    createButton('resetBtn', "Stop Network Capture", function(){ stopTracking(); });

    document.getElementById('buttons').style.display = "block";
}

function setButtonsStopped()
{
    document.getElementById('startBtn').style.display = 'block';
    document.getElementById('downloadtBtn').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('overwriteFlag').style.display = 'none';
}

function setButtonsStarted()
{
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('downloadtBtn').style.display = 'block';
    document.getElementById('resetBtn').style.display = 'block';
    document.getElementById('overwriteFlag').style.display = 'block';
}


function createButton(id, label,callback)
{
    var button= document.createElement('button');
    button.innerHTML= label;
    button.setAttribute("id", id);

    document.getElementById('buttons').appendChild(button);

    button.addEventListener('click', callback);
}

function startTracking(){

    console.info('tracking in popup')
    setButtonsStarted();

    BG.startTracking();
    window.close();
}

function downloadTracked()
{
    BG.downloadTracked();
}

function stopTracking()
{
    BG.stopTracking();
    setButtonsStopped();
    window.close();
}