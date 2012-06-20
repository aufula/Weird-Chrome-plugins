function addScript(){
    var w = window,
    d = document;
    if(typeof LiveReload != undefined){
        var tag = d.createElement("script");
        tag.src="/livereload.js";
        d.getElementsByTagName("head")[0].appendChild(tag);
    }
}

function updateIcon() {
  chrome.browserAction.setIcon({path:"icon19-on.png"});
  chrome.tabs.getCurrent(function(){
      addScript();
  });
}

chrome.browserAction.onClicked.addListener(updateIcon);
