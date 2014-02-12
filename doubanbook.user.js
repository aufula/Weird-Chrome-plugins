// ==UserScript==
// @name doubanbook
// @description 在豆瓣读书的详情页增加一个搜索pdf的按钮,跳到ifindbook.net via http://www.ifindbook.net/search?q=abc+pdf
// @version 1.0
// @update_url http://github.com/aufula
// @match *://book.douban.com/subject/*
// ==/UserScript==

(function(){
    var container = document.getElementById('interest_sect_level');
    var fragment = document.createElement('span');
    var bookName = document.querySelector("[property='v:itemreviewed']").textContent;

    fragment.innerHTML = '<a target="_blank" href="http://www.ifindbook.net/search?q='+bookName+'+pdf" rel="nofollow" class="collect_btn colbutt ll" name="pbtn-24524405-wish"><span>下载</span></a>'
    container.insertBefore(fragment.children[0],container.children[0]);
})();
