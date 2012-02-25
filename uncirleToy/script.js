(function(){
  var urls = {
    main:"https://plus.google.com/",
    remove:"https://plus.google.com/_/socialgraph/mutate/deletemem/",
    getFollower:"https://plus.google.com/_/socialgraph/lookup/followers/?m=2500&_reqid=0&rt=j",
    getAll:"https://plus.google.com/_/socialgraph/lookup/circles/?ct=2&m=1"
  };

  var xhr = new XMLHttpRequest();

  function fnXhr(method,url,cb,data){
    xhr.onreadystatechange = function(){
      if(xhr.readyState==4){
        cb(xhr.responseText);
      }
    }
    xhr.open(method,url,true);
    if(method.toLowerCase()=="post"){
      xhr.setRequestHeader("Accept", "text/plain, */*; q=0.01");
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(data);
    }else{
      xhr.send();
    }

  }

  function getKEY(cb){
    fnXhr("GET",urls.main,cb);
  }

  function getAll(cb){
    fnXhr("GET",urls.getAll,cb);
  }

  function getFollower(cb){
    fnXhr("GET",urls.getFollower,cb)
  } 

  function deleteMember(data,cb){
    fnXhr("POST",urls.remove,cb,data); 
  }

  function diff(a,b){
    var arr = [];
    b.forEach(function(i){
      arr.push(i[0][2]);
    })

    return a.filter(function(i,index){
      return arr.indexOf(i[0][2])==-1
    })
  }

  function clean(circleName,isID,cb){
    if(!circleName) return;
    var getall,getfollower,uncirclers,circles={},key,data=[],output=[];

    getKEY(function(d){
      key = d.match(/csi","([^"]+)"/)[1];

      getAll(function(d){
        getall = eval(d.slice(7,-1));

        if(!isID){
          circles = (function(){
            var obj = {};
            getall[1].forEach(function(i){
              obj[i[1][0]] = i[0][0];
            });
            return obj;
          })();
        }else{
          circles[circleName] = circleName;
        }

        circles[0] = getall[2].filter(function(i){
          return i[3].join().indexOf(circles[circleName])!=-1
        })

        getFollower(function(d){
          getfollower = eval(d.slice(7,-1));
          uncirclers = diff(circles[0],getfollower[1][2]);
          uncirclers.forEach(function(i,index){
            data.push("[null,null,\""+i[0][2]+"\"]");
            output.push(i[2][0]);
          });
          data ='m=[['+data.join()+']]&at='+key+'&rt=j';
          deleteMember(data,function(d){
            cb();
            alert("清理完成\n"+output.join());
            location.reload();
          })
        });
      });
    });
  }

  function addButton(){
    var a = document.createElement("a");
    var node = document.querySelector(".k-Ja-Me");
    var id = node.href.slice(-16,-1);
    a.innerHTML = "清理本圈<img id='cleanCircleLoading' src='"+chrome.extension.getURL('loading.gif')+"' />";
    a.title = "清除本圈中尚未回圈你的人!!";
    a.id = "cleanCircle";

    a.addEventListener("click",function(){
      if(xhr.readyState==0){
        var loading = this.children[0];
        loading.style.display='inline';
        clean(id,true,function(){
          loading.style.display='none';
        });
      }
    },false);

    node.parentNode.insertBefore( a, node.nextSibling );
  }

  function main(){
    if(document.querySelector(".k-Ja-Me")){
      if(document.getElementById("cleanCircle")) return;
      addButton();
    }else{
      //clean("test",false);
    }
  }

  setInterval(function(){
    main();
  },100);

})();
