// ==UserScript==
// @name livereload
// @description livereload 插件
// @version 2.0.2
// @include *//dev*
// ==/UserScript==

(function(){
    var script = document.createElement('script');
    //var path =  '//' + location.host;
    var path=  "https://dl.dropboxusercontent.com/u/35000411";
    script.src = path + "/livereload.js";
    document.head.insertBefore(script, document.head.firstChild);
})();
