(function(){
 var urls = {
   main:"https://plus.google.com/",
   remove:"https://plus.google.com/_/socialgraph/mutate/deletemem/",
   getFollower:"https://plus.google.com/_/socialgraph/lookup/followers/?m=2500&_reqid=0&rt=j",
   getAll:"https://plus.google.com/_/socialgraph/lookup/circles/?ct=2&m=1"
};

function xhr(method,url,cb,data){
   var xhr = new XMLHttpRequest();
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
 xhr("GET",urls.main,cb);
}

function getAll(cb){
 xhr("GET",urls.getAll,cb);
}

function getFollower(cb){
   xhr("GET",urls.getFollower,cb)
} 

function deleteMember(data,cb){
 xhr("POST",urls.remove,cb,data); 
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

function clean(circleName,isID){
   if(!circleName) return console.log("empty");
   var getall,getfollower,uncirclers,circles={},key,data=[];

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
           });
            data ='m=[['+data.join()+']]&at='+key+'&rt=j';
            deleteMember(data,function(d){
              alert("done");
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
   a.innerText = "清理本圈";
   a.title = "清除本圈中尚未回圈你的人!!";
   a.style.marginLeft="10px";
   a.id = "cleanCircle";

   a.addEventListener("click",function(){
      clean(id,true);
   },false);

   node.parentNode.insertBefore( a, node.nextSibling );
}

function init(){
   if(document.querySelector(".k-Ja-Me")){
     if(document.getElementById("cleanCircle")) return;
     addButton();
   }else{
      //clean("test",false);
   }
}

setInterval(function(){
  init();
},100);

})();