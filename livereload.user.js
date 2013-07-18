// ==UserScript==
// @name livereload
// @description livereload 插件
// @version 2.0.1
// @include *//dev*
// ==/UserScript==

(function(){
    var script = document.createElement('script');
    script.src="//dev:35729/livereload.js";
    document.head.insertBefore(script, document.head.firstChild);
})();
