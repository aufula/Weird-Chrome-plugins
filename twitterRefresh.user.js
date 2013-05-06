// ==UserScript==
// @name TwitterRefresh
// @description Automatically show full stream content of twitter
// @version 1.2
// @match *://twitter.com/*
// @update_url https://gist.github.com/raw/2029685/twitterRefresh.user.js
// ==/UserScript==

Element.prototype.triggerEvent = function(eventName){
    if (document.createEvent) {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(eventName, true, true);
        return this.dispatchEvent(evt);
    }

    if (this.fireEvent)
        return this.fireEvent('on' + eventName);
}


document.getElementById("page-outer").addEventListener("DOMNodeInserted",function(e){
    if(e.target.className=="stream-item"){
        if (e.target.children[0]){
            var scrollHeight = document.documentElement.scrollHeight - e.target.offsetHeight;
            e.target.children[0].triggerEvent("click");
            setTimeout(function(){
                window.scrollBy(0,document.documentElement.scrollHeight-scrollHeight);
            },100)
        }
    }
},false);
