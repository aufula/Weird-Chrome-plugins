(function() {
  var each = [].forEach;
  var init = function() {
    var Eembeds = document.embeds;
    var Eobject = document.querySelectorAll("object");

    if (Eembeds) {
      each.call(Eembeds, function(i, index) {
        if (i.src.indexOf("youku.com") != - 1 && i.src.indexOf("player") != - 1) {
          var fla_v = i.src.match(/sid\/([^\/]+)/) || i.attributes["flashvars"].value.match(/VideoIDS=([^&]+)&/i);
          if (fla_v) {
            fla_v = fla_v[1];
            var div = document.createElement("div");
            div.innerHTML = generateTag(fla_v, i.width, i.height);
            if (i.parentNode.nodeName.toLowerCase() == "object") {
              var pNode = i.parentNode;
              pNode.parentNode.replaceChild(div, pNode);
            } else {
              i.parentNode.replaceChild(div, i);
            }
          }
        }
      });
    }

    if (Eobject) {
      each.call(Eobject, function(i, index) {
        var flashvars = i.querySelector("[name=flashvars]");
        if (flashvars) {
          var fla_v = flashvars.value.match(/VideoIDS=([^&]+)&/i);
          if (fla_v) {
            fla_v = fla_v[1];
            var div = document.createElement("div");
            div.innerHTML = generateTag(fla_v, i.width, i.height);
            i.parentNode.replaceChild(div, i);
          }

        }
      });
    }

  }

  function generateTag(videoIDS, width, height) {
    /*
    * flashvars{
    winType interior|index|BDskin|exterior|touch|adshow    //_loc_1
    VideoIDS @S
    Light=on
    THX=on
    Tid=0
    show_ce=0  //ShowSideBar
    isAutoPlay @B  || P=1
    Version=/v1.0.0736
    isShowRelatedVideo  @B
    isLoop @B
    isMute @B
    trialJS  @B
    isRedirect=0
    passwordstr @S
    lang @S
    partnerid @S
    embedid @S
    extstring @S
    Type @S
    Fid
    Pt
    Ob
    Pf
    skin_url
    plugin_xml_url 
    firsttime  @INT
    adext
    skincolor1 /2 /3 
    skinalpha

    [_loc_2] : flv | mp4 | flvhd | hd2 
    }
    */
    var isAutoPlay;
    if (location.hostname == "v.youku.com") {
      isAutoPlay = "true";
    } else {
      isAutoPlay = "false";
    }

    return '<embed src="http://static.youku.com/v1.0.0212/v/swf/player.swf?VideoIDS=' + videoIDS + '&winType=index&isAutoPlay=' + isAutoPlay + '&isShowRelatedVideo=false&THX=on&show_ce=1" width="' + width + '" height="' + height + '" type="application/x-shockwave-flash" bgcolor="#000000" allowfullscreen="true" wmode="transparent">';
  }

  window.onload = init();

})();
