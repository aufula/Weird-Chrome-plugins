// ==UserScript==
// @name fc2movie
// @description fc2movie vip player
// @version 1.0
// @update_url
// @match *://yantavideo.com/*
// ==/UserScript==

(function(){
    var embed = document.querySelector('embed#flv2id');
    var obj = embed.parentNode;
    embed.src = embed.src.replace(/flv3/,'flv2');
    embed.style.display='block';
    obj.parentNode.insertBefore(embed,obj.nextSibling);
    obj.remove();
})();
