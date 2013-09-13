// ==UserScript==
// @name fc2movie
// @description fc2movie vip player
// @version 1.0
// @update_url
// @match *://modimovie.com/*
// ==/UserScript==

var style = document.createElement("style");
style.innerHTML="object,embed{display:none;}";

document.head.appendChild(style);
window.onload = function(){
    var embed = document.querySelector('embed#flv2id');
    var obj = embed.parentNode;
    embed.src = embed.src.replace(/flv3/,'flv2');
    embed.style.display='block';
    obj.parentNode.insertBefore(embed,obj.nextSibling);
    obj.remove();
};
