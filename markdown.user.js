// ==UserScript==
// @name markdown-previewer 
// @description read .md file and render it as html
// @version 1.0.1
// @include *.md
// ==/UserScript==
//


(function(){
    var fragment = document.createDocumentFragment();

    function appendMarkDownScript(){
        var script = document.createElement('script');
        script.src="http://aufula.github.io/codebase/Markdown.Converter.js";
        fragment.appendChild(script);
    }

    function appendMarkDownStyleSheet(){
        var link = document.createElement('link');
        link.href='http://aufula.github.io/codebase/Markdown.css';
        // link.href='http://kevinburke.bitbucket.org/markdowncss/markdown.css'; 
        link.rel='stylesheet';
        fragment.appendChild(link);
    }


    function appendMarkDownExecuteScript(){
        var script = document.createElement('script');
        script.innerHTML = 'var mdtime = setInterval(function(){ ' +
             ' if(typeof Markdown!=="undefined"){ clearInterval(mdtime); document.body.innerHTML = (new Markdown.Converter()).makeHtml(document.body.innerHTML) } '+
             '},100)';
        fragment.appendChild(script);
    }

    function appendRenderDom(){
        var div = document.createElement('div');
        div.innerHTML = (new Markdown.Converter()).makeHtml(document.body.innerHTML)
        document.body.innerHTML = '';
        document.body.appendChild(div);
    }


    function main(){
        appendMarkDownStyleSheet();
        appendMarkDownScript();
        appendMarkDownExecuteScript();
        document.head.appendChild(fragment);
    }

    main();


})();

