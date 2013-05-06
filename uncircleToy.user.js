// ==UserScript==
// @name uncircleToy
// @description 清理圈子，清除尚未回圈你的人
// @version 2.0.1
// @match *://plus.google.com/*
// ==/UserScript==

(function(){
    var urls = {
        main:"https://plus.google.com/",
        remove:"https://plus.google.com/_/socialgraph/mutate/removemember/?_reqid=0&rt=j",
        getFollower:"https://plus.google.com/_/socialgraph/lookup/followers/?m=2500&_reqid=0&rt=j",
        getAll:"https://plus.google.com/_/socialgraph/lookup/circles/?ct=2&m=true&rt=j"
    };
    
    var spin = "data:image/gif;base64,R0lGODlhEAALAMQAAP////b58/X38vT2+fP27vL0+O706u/y9uvx5efu4Mvbvb/TrbPLnafDjJKzcH2nUf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCwAQACwAAAIAEAAHAAAFJmBxHAUEiaSJisNwmEf7QrFbzzcs57Ss276e6zcK8m4r1ah0WoYAACH5BAkLABAALAAAAAAQAAsAAAU0oPM8DmSeqPk0zZO+0NqeBIHWMetCNm/2BNkO+PsJi75kUIck8o7KJpTX+9mmMJOIlEWFAAAh+QQJCwAQACwAAAAAEAALAAAFQyAkjs7zOOO4MMwiPk3zpCKjKMwbz5BAEAIbTicTEQIBgjAHgRUhx+SSyIsqb0xnFXkdNndG7vT79AFXLSptDSmd1iEAIfkECQsAEAAsAAAAABAACwAABUIgJI6k6DyPU0ILwyzi0zQPkiSIyCgKE8+PhMGQ0PF8EBlNSDT2fsthEbJ7JoHMaRWpDEqdXKANB4Y+Vq2XebU6pUIAIfkECQsAEAAsAAABABAACQAABT4gJI6kuDDMIhCEICJJgoiMojBEEBBiYhgJmg2n40F8QOEtt+v9gpDasuhMRodMIxIqZaxar9jseiuZIadUCAAh+QQFCwAQACwAAAIAEAAHAAAFLaBAEAIEiaSJJAlCBAFhvrGZGEZCy9Bu4zoYzwe55YhEY7DWE/5yqNJpJF21QgAh+QQJFAAQACwAAAIAEAAHAAAFGyAkjqQoEMRZrkQQoGvZvrHswrU44/mej6dUCAA7";


    var lang = document.documentElement.lang;

    var xhr = new XMLHttpRequest();
    function ajax(method,url,cb,data){
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
        ajax("GET",urls.main,cb);
    }

    function getAll(cb){
        ajax("GET",urls.getAll,cb);
    }

    function getFollower(cb){
        ajax("GET",urls.getFollower,cb)
    } 

    function deleteMember(data,cb){
        ajax("POST",urls.remove,cb,data); 
    }

    function diff(a,b){
        var arr = [];
        b.forEach(function(i){
            arr.push(i[0][2]);
        });

        return a.filter(function(i,index){
            return arr.indexOf(i[0][2])==-1;
        })
    }

    function clean(circleName,isID,cb){
        if(!circleName) return;
        var getall,getfollower,uncirclers,key,circles={},data=[],output=[];

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

                // 当前圈子里你fo的人。
                circles[0] = getall[1][2].filter(function(i){
                    return i[3].join().indexOf(circles[circleName])!=-1;
                });

                getFollower(function(d){
                    getfollower = eval(d.slice(7,-1));
                    // getfollower[1][1] 为最近fo你的人。
                    // getfollower[1][2] 为以前fo你的人。
                    uncirclers = diff(circles[0],getfollower[1][1].concat(getfollower[1][2]));
                    uncirclers.forEach(function(i,index){
                        data.push('[null,null,"'+i[0][2]+'",null,"'+'//plus.google.com/'+i[0][2]+'"]');
                        output.push(i[2][0]);
                    });

                    data ='c=["'+circleName+'"]&m=[['+data.join()+']]&at='+key;

                    deleteMember(data,function(d){
                        cb();
                        if(lang=="zh"){
                            alert("清理完成\n"+output.join());
                        }else{
                            alert("Done\n"+output.join());
                        }
                    })
                });
            });
        });
    }

    function addButton(){
        var a = document.createElement("a");
        var node = document.querySelector("input[label][type=text][placeholder][aria-haspopup]");
        if(!node) return;
        var id = location.href.match(/circles\/p([^/]+)/)[1];

        if(lang == "zh"){
            a.innerHTML = "清理本圈<img style='display:none' id='cleanCircleLoading' src='"+spin+"' />";
            a.title = "清除本圈中尚未回圈你的人!!";
        }else{
            a.innerHTML = "UncircleToy <img style='display:none' id='cleanCircleLoading' src='"+spin+"' />";
            a.title = "Uncircle uncirclers!";
        }

        a.id = "cleanCircle";
        a.setAttribute("style","padding-top:10px;margin:0;display:inline-block");

        a.addEventListener("click",function(){
            if(xhr.readyState==0 || xhr.readyState==4){
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
        var url = location.href;

        setInterval(function(){
            if (!/\/circles\//.test(location.href) ) return; 
            if (document.getElementById("cleanCircle")) return;
            addButton();
        },50);
    }

    main();

})();