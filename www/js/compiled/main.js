;(function($){"use strict";$.fn.bjqs=function(o){var defaults={width:700,height:300,animtype:'fade',animduration:450,animspeed:4000,automatic:true,showcontrols:true,centercontrols:true,nexttext:'Next',prevtext:'Prev',showmarkers:true,centermarkers:true,keyboardnav:true,hoverpause:true,usecaptions:true,randomstart:false,responsive:false};var settings=$.extend({},defaults,o);var $wrapper=this,$slider=$wrapper.find('ul.bjqs'),$slides=$slider.children('li'),$c_wrapper=null,$c_fwd=null,$c_prev=null,$m_wrapper=null,$m_markers=null,$canvas=null,$clone_first=null,$clone_last=null;var state={slidecount:$slides.length,animating:false,paused:false,currentslide:1,nextslide:0,currentindex:0,nextindex:0,interval:null};var responsive={width:null,height:null,ratio:null};var vars={fwd:'forward',prev:'previous'};var init=function(){$slides.addClass('bjqs-slide');if(settings.responsive){conf_responsive();}
else{conf_static();}
if(state.slidecount>1){if(settings.randomstart){conf_random();}
if(settings.showcontrols){conf_controls();}
if(settings.showmarkers){conf_markers();}
if(settings.keyboardnav){conf_keynav();}
if(settings.hoverpause&&settings.automatic){conf_hoverpause();}
if(settings.animtype==='slide'){conf_slide();}}else{settings.automatic=false;}
if(settings.usecaptions){conf_captions();}
if(settings.animtype==='slide'&&!settings.randomstart){state.currentindex=1;state.currentslide=2;}
$slider.show();$slides.eq(state.currentindex).show();if(settings.automatic){state.interval=setInterval(function(){go(vars.fwd,false);},settings.animspeed);}};var conf_responsive=function(){responsive.width=$wrapper.outerWidth();responsive.ratio=responsive.width/settings.width,responsive.height=settings.height*responsive.ratio;if(settings.animtype==='fade'){$slides.css({'height':settings.height,'width':'100%'});$slides.children('img').css({'height':settings.height,'width':'100%'});$slider.css({'height':settings.height,'width':'100%'});$wrapper.css({'height':settings.height,'max-width':settings.width,'position':'relative'});if(responsive.width<settings.width){$slides.css({'height':responsive.height});$slides.children('img').css({'height':responsive.height});$slider.css({'height':responsive.height});$wrapper.css({'height':responsive.height});}
$(window).resize(function(){responsive.width=$wrapper.outerWidth();responsive.ratio=responsive.width/settings.width,responsive.height=settings.height*responsive.ratio;$slides.css({'height':responsive.height});$slides.children('img').css({'height':responsive.height});$slider.css({'height':responsive.height});$wrapper.css({'height':responsive.height});});}
if(settings.animtype==='slide'){$slides.css({'height':settings.height,'width':settings.width});$slides.children('img').css({'height':settings.height,'width':settings.width});$slider.css({'height':settings.height,'width':settings.width*settings.slidecount});$wrapper.css({'height':settings.height,'max-width':settings.width,'position':'relative'});if(responsive.width<settings.width){$slides.css({'height':responsive.height});$slides.children('img').css({'height':responsive.height});$slider.css({'height':responsive.height});$wrapper.css({'height':responsive.height});}
$(window).resize(function(){responsive.width=$wrapper.outerWidth(),responsive.ratio=responsive.width/settings.width,responsive.height=settings.height*responsive.ratio;$slides.css({'height':responsive.height,'width':responsive.width});$slides.children('img').css({'height':responsive.height,'width':responsive.width});$slider.css({'height':responsive.height,'width':responsive.width*settings.slidecount});$wrapper.css({'height':responsive.height});$canvas.css({'height':responsive.height,'width':responsive.width});resize_complete(function(){go(false,state.currentslide);},200,"some unique string");});}};var resize_complete=(function(){var timers={};return function(callback,ms,uniqueId){if(!uniqueId){uniqueId="Don't call this twice without a uniqueId";}
if(timers[uniqueId]){clearTimeout(timers[uniqueId]);}
timers[uniqueId]=setTimeout(callback,ms);};})();var conf_static=function(){$slides.css({'height':settings.height,'width':settings.width});$slider.css({'height':settings.height,'width':settings.width});$wrapper.css({'height':settings.height,'width':settings.width,'position':'relative'});};var conf_slide=function(){$clone_first=$slides.eq(0).clone();$clone_last=$slides.eq(state.slidecount-1).clone();$clone_first.attr({'data-clone':'last','data-slide':0}).appendTo($slider).show();$clone_last.attr({'data-clone':'first','data-slide':0}).prependTo($slider).show();$slides=$slider.children('li');state.slidecount=$slides.length;$canvas=$('<div class="bjqs-wrapper"></div>');if(settings.responsive&&(responsive.width<settings.width)){$canvas.css({'width':responsive.width,'height':responsive.height,'overflow':'hidden','position':'relative'});$slider.css({'width':responsive.width*(state.slidecount+2),'left':-responsive.width*state.currentslide});}
else{$canvas.css({'width':settings.width,'height':settings.height,'overflow':'hidden','position':'relative'});$slider.css({'width':settings.width*(state.slidecount+2),'left':-settings.width*state.currentslide});}
$slides.css({'float':'left','position':'relative','display':'list-item'});$canvas.prependTo($wrapper);$slider.appendTo($canvas);};var conf_controls=function(){$c_wrapper=$('<ul class="bjqs-controls"></ul>');$c_fwd=$('<li class="bjqs-next"><a href="#" data-direction="'+vars.fwd+'">'+settings.nexttext+'</a></li>');$c_prev=$('<li class="bjqs-prev"><a href="#" data-direction="'+vars.prev+'">'+settings.prevtext+'</a></li>');$c_wrapper.on('click','a',function(e){e.preventDefault();var direction=$(this).attr('data-direction');if(!state.animating){if(direction===vars.fwd){go(vars.fwd,false);}
if(direction===vars.prev){go(vars.prev,false);}}});$c_prev.appendTo($c_wrapper);$c_fwd.appendTo($c_wrapper);$c_wrapper.appendTo($wrapper);if(settings.centercontrols){$c_wrapper.addClass('v-centered');var offset_px=($wrapper.height()-$c_fwd.children('a').outerHeight())/2,ratio=(offset_px/settings.height)*100,offset=ratio+'%';$c_fwd.find('a').css('top',offset);$c_prev.find('a').css('top',offset);}};var conf_markers=function(){$m_wrapper=$('<ol class="bjqs-markers"></ol>');$.each($slides,function(key,slide){var slidenum=key+1,gotoslide=key+1;if(settings.animtype==='slide'){gotoslide=key+2;}
var marker=$('<li><a href="#">'+slidenum+'</a></li>');if(slidenum===state.currentslide){marker.addClass('active-marker');}
marker.on('click','a',function(e){e.preventDefault();if(!state.animating&&state.currentslide!==gotoslide){go(false,gotoslide);}});marker.appendTo($m_wrapper);});$m_wrapper.appendTo($wrapper);$m_markers=$m_wrapper.find('li');if(settings.centermarkers){$m_wrapper.addClass('h-centered');var offset=(settings.width-$m_wrapper.width())/2;$m_wrapper.css('left',offset);}};var conf_keynav=function(){$(document).keyup(function(event){if(!state.paused){clearInterval(state.interval);state.paused=true;}
if(!state.animating){if(event.keyCode===39){event.preventDefault();go(vars.fwd,false);}else if(event.keyCode===37){event.preventDefault();go(vars.prev,false);}}
if(state.paused&&settings.automatic){state.interval=setInterval(function(){go(vars.fwd);},settings.animspeed);state.paused=false;}});};var conf_hoverpause=function(){$wrapper.hover(function(){if(!state.paused){clearInterval(state.interval);state.paused=true;}},function(){if(state.paused){state.interval=setInterval(function(){go(vars.fwd,false);},settings.animspeed);state.paused=false;}});};var conf_captions=function(){$.each($slides,function(key,slide){var caption=$(slide).children('img:first-child').attr('title');if(!caption){caption=$(slide).children('a').find('img:first-child').attr('title');}
if(caption){caption=$('<p class="bjqs-caption">'+caption+'</p>');caption.appendTo($(slide));}});};var conf_random=function(){var rand=Math.floor(Math.random()*state.slidecount)+1;state.currentslide=rand;state.currentindex=rand-1;};var set_next=function(direction){if(direction===vars.fwd){if($slides.eq(state.currentindex).next().length){state.nextindex=state.currentindex+1;state.nextslide=state.currentslide+1;}
else{state.nextindex=0;state.nextslide=1;}}
else{if($slides.eq(state.currentindex).prev().length){state.nextindex=state.currentindex-1;state.nextslide=state.currentslide-1;}
else{state.nextindex=state.slidecount-1;state.nextslide=state.slidecount;}}};var go=function(direction,position){if(!state.animating){state.animating=true;if(position){state.nextslide=position;state.nextindex=position-1;}
else{set_next(direction);}
if(settings.animtype==='fade'){if(settings.showmarkers){$m_markers.removeClass('active-marker');$m_markers.eq(state.nextindex).addClass('active-marker');}
$slides.eq(state.currentindex).fadeOut(settings.animduration);$slides.eq(state.nextindex).fadeIn(settings.animduration,function(){state.animating=false;state.currentslide=state.nextslide;state.currentindex=state.nextindex;});}
if(settings.animtype==='slide'){if(settings.showmarkers){var markerindex=state.nextindex-1;if(markerindex===state.slidecount-2){markerindex=0;}
else if(markerindex===-1){markerindex=state.slidecount-3;}
$m_markers.removeClass('active-marker');$m_markers.eq(markerindex).addClass('active-marker');}
if(settings.responsive&&(responsive.width<settings.width)){state.slidewidth=responsive.width;}
else{state.slidewidth=settings.width;}
$slider.animate({'left':-state.nextindex*state.slidewidth},settings.animduration,function(){state.currentslide=state.nextslide;state.currentindex=state.nextindex;if($slides.eq(state.currentindex).attr('data-clone')==='last'){$slider.css({'left':-state.slidewidth});state.currentslide=2;state.currentindex=1;}
else if($slides.eq(state.currentindex).attr('data-clone')==='first'){$slider.css({'left':-state.slidewidth*(state.slidecount-2)});state.currentslide=state.slidecount-1;state.currentindex=state.slidecount-2;}
state.animating=false;});}}};init();};})(jQuery);
var unityObject={javaInstallDone:function(d,a,b){var c=parseInt(d.substring(d.lastIndexOf("_")+1),10);if(!isNaN(c)){setTimeout(function(){UnityObject2.instances[c].javaInstallDoneCallback(d,a,b)},10)}}};var UnityObject2=function(J){var ac=[],i=window,Y=document,W=navigator,E=null,h=[],af=(document.location.protocol=="https:"),y=af?"https://ssl-webplayer.unity3d.com/":"http://webplayer.unity3d.com/",K="_unity_triedjava",G=a(K),r="_unity_triedclickonce",u=a(r),aa=false,B=[],O=false,w=null,f=null,P=null,l=[],T=null,q=[],V=false,U="installed",L="missing",b="broken",v="unsupported",C="ready",z="start",F="error",Z="first",A="java",s="clickonce",M=false,R=null,x={pluginName:"Unity Player",pluginMimeType:"application/vnd.unity",baseDownloadUrl:y+"download_webplayer-3.x/",fullInstall:false,autoInstall:false,enableJava:true,enableJVMPreloading:false,enableClickOnce:true,enableUnityAnalytics:false,enableGoogleAnalytics:true,params:{},attributes:{},referrer:null,debugLevel:0};x=jQuery.extend(true,x,J);if(x.referrer===""){x.referrer=null}if(af){x.enableUnityAnalytics=false}function a(ag){var ah=new RegExp(escape(ag)+"=([^;]+)");if(ah.test(Y.cookie+";")){ah.exec(Y.cookie+";");return RegExp.$1}return false}function e(ag,ah){document.cookie=escape(ag)+"="+escape(ah)+"; path=/"}function N(am){var an=0,ai,al,aj,ag,ah;if(am){var ak=am.toLowerCase().match(/^(\d+)(?:\.(\d+)(?:\.(\d+)([dabfr])?(\d+)?)?)?$/);if(ak&&ak[1]){ai=ak[1];al=ak[2]?ak[2]:0;aj=ak[3]?ak[3]:0;ag=ak[4]?ak[4]:"r";ah=ak[5]?ak[5]:0;an|=((ai/10)%10)<<28;an|=(ai%10)<<24;an|=(al%10)<<20;an|=(aj%10)<<16;an|={d:2<<12,a:4<<12,b:6<<12,f:8<<12,r:8<<12}[ag];an|=((ah/100)%10)<<8;an|=((ah/10)%10)<<4;an|=(ah%10)}}return an}function ae(al,ag){var ai=Y.getElementsByTagName("body")[0];var ah=Y.createElement("object");var aj=0;if(ai&&ah){ah.setAttribute("type",x.pluginMimeType);ah.style.visibility="hidden";ai.appendChild(ah);var ak=0;(function(){if(typeof ah.GetPluginVersion==="undefined"){if(ak++<10){setTimeout(arguments.callee,10)}else{ai.removeChild(ah);al(null)}}else{var am={};if(ag){for(aj=0;aj<ag.length;++aj){am[ag[aj]]=ah.GetUnityVersion(ag[aj])}}am.plugin=ah.GetPluginVersion();ai.removeChild(ah);al(am)}})()}else{al(null)}}function c(){var ag=x.fullInstall?"UnityWebPlayerFull.exe":"UnityWebPlayer.exe";if(x.referrer!==null){ag+="?referrer="+x.referrer}return ag}function ab(){var ag="UnityPlayer.plugin.zip";if(x.referrer!=null){ag+="?referrer="+x.referrer}return ag}function m(){return x.baseDownloadUrl+(t.win?c():ab())}function D(ai,ah,aj,ag){if(ai===L){M=true}if(jQuery.inArray(ai,q)===-1){if(M){j.send(ai,ah,aj,ag)}q.push(ai)}T=ai}var t=function(){var ai=W.userAgent,ak=W.platform;var al=/chrome/i.test(ai);var am={w3:typeof Y.getElementById!="undefined"&&typeof Y.getElementsByTagName!="undefined"&&typeof Y.createElement!="undefined",win:ak?/win/i.test(ak):/win/i.test(ai),mac:ak?/mac/i.test(ak):/mac/i.test(ai),ie:/msie/i.test(ai)?parseFloat(ai.replace(/^.*msie ([0-9]+(\.[0-9]+)?).*$/i,"$1")):false,ff:/firefox/i.test(ai),op:/opera/i.test(ai),ch:al,ch_v:/chrome/i.test(ai)?parseFloat(ai.replace(/^.*chrome\/(\d+(\.\d+)?).*$/i,"$1")):false,sf:/safari/i.test(ai)&&!al,wk:/webkit/i.test(ai)?parseFloat(ai.replace(/^.*webkit\/(\d+(\.\d+)?).*$/i,"$1")):false,x64:/win64/i.test(ai)&&/x64/i.test(ai),moz:/mozilla/i.test(ai)?parseFloat(ai.replace(/^.*mozilla\/([0-9]+(\.[0-9]+)?).*$/i,"$1")):0,mobile:/ipad/i.test(ak)||/iphone/i.test(ak)||/ipod/i.test(ak)||/android/i.test(ai)||/windows phone/i.test(ai)};am.clientBrand=am.ch?"ch":am.ff?"ff":am.sf?"sf":am.ie?"ie":am.op?"op":"??";am.clientPlatform=am.win?"win":am.mac?"mac":"???";var an=Y.getElementsByTagName("script");for(var ag=0;ag<an.length;++ag){var aj=an[ag].src.match(/^(.*)3\.0\/uo\/UnityObject2\.js$/i);if(aj){x.baseDownloadUrl=aj[1];break}}function ah(aq,ap){for(var ar=0;ar<Math.max(aq.length,ap.length);++ar){var ao=(ar<aq.length)&&aq[ar]?new Number(aq[ar]):0;var at=(ar<ap.length)&&ap[ar]?new Number(ap[ar]):0;if(ao<at){return -1}if(ao>at){return 1}}return 0}am.java=function(){if(W.javaEnabled()){var ar=(am.win&&am.ff);var av=false;if(ar||av){if(typeof W.mimeTypes!="undefined"){var au=ar?[1,6,0,12]:[1,4,2,0];for(var aq=0;aq<W.mimeTypes.length;++aq){if(W.mimeTypes[aq].enabledPlugin){var ao=W.mimeTypes[aq].type.match(/^application\/x-java-applet;(?:jpi-)?version=(\d+)(?:\.(\d+)(?:\.(\d+)(?:_(\d+))?)?)?$/);if(ao!=null){if(ah(au,ao.slice(1))<=0){return true}}}}}}else{if(am.win&&am.ie){if(typeof ActiveXObject!="undefined"){function ap(aw){try{return new ActiveXObject("JavaWebStart.isInstalled."+aw+".0")!=null}catch(ax){return false}}function at(aw){try{return new ActiveXObject("JavaPlugin.160_"+aw)!=null}catch(ax){return false}}if(ap("1.7.0")){return true}if(am.ie>=8){if(ap("1.6.0")){for(var aq=12;aq<=50;++aq){if(at(aq)){if(am.ie==9&&am.moz==5&&aq<24){continue}else{return true}}}return false}}else{return ap("1.6.0")||ap("1.5.0")||ap("1.4.2")}}}}}return false}();am.co=function(){if(am.win&&am.ie){var ao=ai.match(/(\.NET CLR [0-9.]+)|(\.NET[0-9.]+)/g);if(ao!=null){var ar=[3,5,0];for(var aq=0;aq<ao.length;++aq){var ap=ao[aq].match(/[0-9.]{2,}/g)[0].split(".");if(ah(ar,ap)<=0){return true}}}}return false}();return am}();var j=function(){var ag=function(){var ao=new Date();var an=Date.UTC(ao.getUTCFullYear(),ao.getUTCMonth(),ao.getUTCDay(),ao.getUTCHours(),ao.getUTCMinutes(),ao.getUTCSeconds(),ao.getUTCMilliseconds());return an.toString(16)+am().toString(16)}();var ai=0;var ah=window._gaq=(window._gaq||[]);ak();function am(){return Math.floor(Math.random()*2147483647)}function ak(){var at=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";var ap=Y.getElementsByTagName("script");var au=false;for(var ar=0;ar<ap.length;++ar){if(ap[ar].src&&ap[ar].src.toLowerCase()==at.toLowerCase()){au=true;break}}if(!au){var aq=Y.createElement("script");aq.type="text/javascript";aq.async=true;aq.src=at;var ao=document.getElementsByTagName("script")[0];ao.parentNode.insertBefore(aq,ao)}var an=(x.debugLevel===0)?"UA-16068464-16":"UA-16068464-17";ah.push(["unity._setDomainName","none"]);ah.push(["unity._setAllowLinker",true]);ah.push(["unity._setReferrerOverride"," "+this.location.toString()]);ah.push(["unity._setAccount",an]);ah.push(["unity._setCustomVar",1,"Revision","e0e43d8876fe",2])}function aj(ar,ap,at,ao){if(!x.enableUnityAnalytics){if(ao){ao()}return}var an="http://unityanalyticscapture.appspot.com/event?u="+encodeURIComponent(ag)+"&s="+encodeURIComponent(ai)+"&e="+encodeURIComponent(ar);an+="&v="+encodeURIComponent("e0e43d8876fe");if(x.referrer!==null){an+="?r="+x.referrer}if(ap){an+="&t="+encodeURIComponent(ap)}if(at){an+="&d="+encodeURIComponent(at)}var aq=new Image();if(ao){aq.onload=aq.onerror=ao}aq.src=an}function al(ap,an,aq,ay){if(!x.enableGoogleAnalytics){if(ay){ay()}return}var av="/webplayer/install/"+ap;var aw="?";if(an){av+=aw+"t="+encodeURIComponent(an);aw="&"}if(aq){av+=aw+"d="+encodeURIComponent(aq);aw="&"}if(ay){ah.push(function(){setTimeout(ay,1000)})}var at=x.src;if(at.length>40){at=at.replace("http://","");var ao=at.split("/");var ax=ao.shift();var ar=ao.pop();at=ax+"/../"+ar;while(at.length<40&&ao.length>0){var au=ao.pop();if(at.length+au.length+5<40){ar=au+"/"+ar}else{ar="../"+ar}at=ax+"/../"+ar}}ah.push(["unity._setCustomVar",2,"GameURL",at,3]);ah.push(["unity._setCustomVar",1,"UnityObjectVersion","2",3]);if(an){ah.push(["unity._setCustomVar",3,"installMethod",an,3])}ah.push(["unity._trackPageview",av])}return{send:function(aq,ap,at,an){if(x.enableUnityAnalytics||x.enableGoogleAnalytics){n("Analytics SEND",aq,ap,at,an)}++ai;var ar=2;var ao=function(){if(0==--ar){w=null;window.location=an}};if(at===null||at===undefined){at=""}aj(aq,ap,at,an?ao:null);al(aq,ap,at,an?ao:null)}}}();function I(ai,aj,ak){var ag,an,al,am,ah;if(t.win&&t.ie){an="";for(ag in ai){an+=" "+ag+'="'+ai[ag]+'"'}al="";for(ag in aj){al+='<param name="'+ag+'" value="'+aj[ag]+'" />'}ak.outerHTML="<object"+an+">"+al+"</object>"}else{am=Y.createElement("object");for(ag in ai){am.setAttribute(ag,ai[ag])}for(ag in aj){ah=Y.createElement("param");ah.name=ag;ah.value=aj[ag];am.appendChild(ah)}ak.parentNode.replaceChild(am,ak)}}function o(ag){if(typeof ag=="undefined"){return false}if(!ag.complete){return false}if(typeof ag.naturalWidth!="undefined"&&ag.naturalWidth==0){return false}return true}function H(aj){var ah=false;for(var ai=0;ai<l.length;ai++){if(!l[ai]){continue}var ag=Y.images[l[ai]];if(!o(ag)){ah=true}else{l[ai]=null}}if(ah){setTimeout(arguments.callee,100)}else{setTimeout(function(){d(aj)},100)}}function d(aj){var al=Y.getElementById(aj);if(!al){al=Y.createElement("div");var ag=Y.body.lastChild;Y.body.insertBefore(al,ag.nextSibling)}var ak=x.baseDownloadUrl+"3.0/jws/";var ah={id:aj,type:"application/x-java-applet",code:"JVMPreloader",width:1,height:1,name:"JVM Preloader"};var ai={context:aj,codebase:ak,classloader_cache:false,scriptable:true,mayscript:true};I(ah,ai,al);jQuery("#"+aj).show()}function S(ah){G=true;e(K,G);var aj=Y.getElementById(ah);var al=ah+"_applet_"+E;B[al]={attributes:x.attributes,params:x.params,callback:x.callback,broken:x.broken};var an=B[al];var ak={id:al,type:"application/x-java-applet",archive:x.baseDownloadUrl+"3.0/jws/UnityWebPlayer.jar",code:"UnityWebPlayer",width:1,height:1,name:"Unity Web Player"};if(t.win&&t.ff){ak.style="visibility: hidden;"}var am={context:al,jnlp_href:x.baseDownloadUrl+"3.0/jws/UnityWebPlayer.jnlp",classloader_cache:false,installer:m(),image:y+"installation/unitylogo.png",centerimage:true,boxborder:false,scriptable:true,mayscript:true};for(var ag in an.params){if(ag=="src"){continue}if(an.params[ag]!=Object.prototype[ag]){am[ag]=an.params[ag];if(ag.toLowerCase()=="logoimage"){am.image=an.params[ag]}else{if(ag.toLowerCase()=="backgroundcolor"){am.boxbgcolor="#"+an.params[ag]}else{if(ag.toLowerCase()=="bordercolor"){am.boxborder=true}else{if(ag.toLowerCase()=="textcolor"){am.boxfgcolor="#"+an.params[ag]}}}}}}var ai=Y.createElement("div");aj.appendChild(ai);I(ak,am,ai);jQuery("#"+ah).show()}function X(ag){setTimeout(function(){var ah=Y.getElementById(ag);if(ah){ah.parentNode.removeChild(ah)}},0)}function g(ak){var al=B[ak],aj=Y.getElementById(ak),ai;if(!aj){return}aj.width=al.attributes.width||600;aj.height=al.attributes.height||450;var ah=aj.parentNode;var ag=ah.childNodes;for(var am=0;am<ag.length;am++){ai=ag[am];if(ai.nodeType==1&&ai!=aj){ah.removeChild(ai)}}}function k(ai,ag,ah){n("_javaInstallDoneCallback",ai,ag,ah);if(!ag){D(F,A,ah)}}function ad(){ac.push(arguments);if(x.debugLevel>0&&window.console&&window.console.log){console.log(Array.prototype.slice.call(arguments))}}function n(){ac.push(arguments);if(x.debugLevel>1&&window.console&&window.console.log){console.log(Array.prototype.slice.call(arguments))}}function p(ag){if(/^[-+]?[0-9]+$/.test(ag)){ag+="px"}return ag}var Q={getLogHistory:function(){return ac},getConfig:function(){return x},getPlatformInfo:function(){return t},initPlugin:function(ag,ah){x.targetEl=ag;x.src=ah;n("ua:",t);this.detectUnity(this.handlePluginStatus)},detectUnity:function(ar,ah){var ap=this;var aj=L;var al;W.plugins.refresh();if(t.clientBrand==="??"||t.clientPlatform==="???"||t.mobile){aj=v}else{if(t.op&&t.mac){aj=v;al="OPERA-MAC"}else{if(typeof W.plugins!="undefined"&&W.plugins[x.pluginName]&&typeof W.mimeTypes!="undefined"&&W.mimeTypes[x.pluginMimeType]&&W.mimeTypes[x.pluginMimeType].enabledPlugin){aj=U;if(t.sf&&/Mac OS X 10_6/.test(W.appVersion)){ae(function(at){if(!at||!at.plugin){aj=b;al="OSX10.6-SFx64"}D(aj,P,al);ar.call(ap,aj,at)},ah);return}else{if(t.mac&&t.ch){ae(function(at){if(at&&(N(at.plugin)<=N("2.6.1f3"))){aj=b;al="OSX-CH-U<=2.6.1f3"}D(aj,P,al);ar.call(ap,aj,at)},ah);return}else{if(ah){ae(function(at){D(aj,P,al);ar.call(ap,aj,at)},ah);return}}}}else{if(typeof i.ActiveXObject!="undefined"){try{var aq=new ActiveXObject("UnityWebPlayer.UnityWebPlayer.1");var ai=aq.GetPluginVersion();if(ah){var an={};for(var ag=0;ag<ah.length;++ag){an[ah[ag]]=aq.GetUnityVersion(ah[ag])}an.plugin=ai}aj=U;if(ai=="2.5.0f5"){var ao=/Windows NT \d+\.\d+/.exec(W.userAgent);if(ao&&ao.length>0){var am=parseFloat(ao[0].split(" ")[2]);if(am>=6){aj=b;al="WIN-U2.5.0f5"}}}}catch(ak){if(t.win&&t.ie&&t.x64){aj=v;al="WIN-IEx64"}}}}}}D(aj,P,al);ar.call(ap,aj,an)},handlePluginStatus:function(ai,ag){var ah=x.targetEl;var ak=jQuery(ah);switch(ai){case U:this.notifyProgress(ak);this.embedPlugin(ak,x.callback);break;case L:this.notifyProgress(ak);var aj=this;var al=(x.debugLevel===0)?1000:8000;setTimeout(function(){x.targetEl=ah;aj.detectUnity(aj.handlePluginStatus)},al);break;case b:this.notifyProgress(ak);break;case v:this.notifyProgress(ak);break}},getPluginURL:function(){var ag="http://unity3d.com/webplayer/";if(t.win){ag=x.baseDownloadUrl+c()}else{if(W.platform=="MacIntel"){ag=x.baseDownloadUrl+(x.fullInstall?"webplayer-i386.dmg":"webplayer-mini.dmg");if(x.referrer!==null){ag+="?referrer="+x.referrer}}else{if(W.platform=="MacPPC"){ag=x.baseDownloadUrl+(x.fullInstall?"webplayer-ppc.dmg":"webplayer-mini.dmg");if(x.referrer!==null){ag+="?referrer="+x.referrer}}}}return ag},getClickOnceURL:function(){return x.baseDownloadUrl+"3.0/co/UnityWebPlayer.application?installer="+encodeURIComponent(x.baseDownloadUrl+c())},embedPlugin:function(aj,ar){aj=jQuery(aj).empty();var ap=x.src;var ah=x.width||"100%";var am=x.height||"100%";var aq=this;if(t.win&&t.ie){var ai="";for(var ag in x.attributes){if(x.attributes[ag]!=Object.prototype[ag]){if(ag.toLowerCase()=="styleclass"){ai+=' class="'+x.attributes[ag]+'"'}else{if(ag.toLowerCase()!="classid"){ai+=" "+ag+'="'+x.attributes[ag]+'"'}}}}var al="";al+='<param name="src" value="'+ap+'" />';al+='<param name="firstFrameCallback" value="UnityObject2.instances['+E+'].firstFrameCallback();" />';for(var ag in x.params){if(x.params[ag]!=Object.prototype[ag]){if(ag.toLowerCase()!="classid"){al+='<param name="'+ag+'" value="'+x.params[ag]+'" />'}}}var ao='<object classid="clsid:444785F1-DE89-4295-863A-D46C3A781394" style="display: block; width: '+p(ah)+"; height: "+p(am)+';"'+ai+">"+al+"</object>";var an=jQuery(ao);aj.append(an);h.push(aj.attr("id"));R=an[0]}else{var ak=jQuery("<embed/>").attr({src:ap,type:x.pluginMimeType,width:ah,height:am,firstFrameCallback:"UnityObject2.instances["+E+"].firstFrameCallback();"}).attr(x.attributes).attr(x.params).css({display:"block",width:p(ah),height:p(am)}).appendTo(aj);R=ak[0]}if(!t.sf||!t.mac){setTimeout(function(){R.focus()},100)}if(ar){ar()}},getBestInstallMethod:function(){var ag="Manual";if(x.enableJava&&t.java&&G===false){ag="JavaInstall"}else{if(x.enableClickOnce&&t.co&&u===false){ag="ClickOnceIE"}}return ag},installPlugin:function(ah){if(ah==null||ah==undefined){ah=this.getBestInstallMethod()}var ag=null;switch(ah){case"JavaInstall":this.doJavaInstall(x.targetEl.id);break;case"ClickOnceIE":var ai=jQuery("<iframe src='"+this.getClickOnceURL()+"' style='display:none;' />");jQuery(x.targetEl).append(ai);break;default:case"Manual":var ai=jQuery("<iframe src='"+this.getPluginURL()+"' style='display:none;' />");jQuery(x.targetEl).append(ai);break}P=ah;j.send(z,ah,null,null)},trigger:function(ah,ag){if(ag){n('trigger("'+ah+'")',ag)}else{n('trigger("'+ah+'")')}jQuery(document).trigger(ah,ag)},notifyProgress:function(ag){if(typeof aa!=="undefined"&&typeof aa==="function"){var ah={ua:t,pluginStatus:T,bestMethod:null,lastType:P,targetEl:x.targetEl,unityObj:this};if(T===L){ah.bestMethod=this.getBestInstallMethod()}if(f!==T){f=T;aa(ah)}}},observeProgress:function(ag){aa=ag},firstFrameCallback:function(){n("*** firstFrameCallback ("+E+") ***");T=Z;this.notifyProgress();if(M===true){j.send(T,P)}},setPluginStatus:function(ai,ah,aj,ag){D(ai,ah,aj,ag)},doJavaInstall:function(ag){S(ag)},jvmPreloaded:function(ag){X(ag)},appletStarted:function(ag){g(ag)},javaInstallDoneCallback:function(ai,ag,ah){k(ai,ag,ah)},getUnity:function(){return R}};E=UnityObject2.instances.length;UnityObject2.instances.push(Q);return Q};UnityObject2.instances=[];
/*
* jQuery tagit
*
* Copyright 2011, Nico Rehwaldt
* Released under the MIT license
* 
* !! version modifiée pour supporter les appels ajax et les résultats text/id !!
*/
(function($) {
    var tagit = {
        addTag: function(tag) {
            var self = $(this);
            var data = self.data("tagit");
			var value = '';
			var libelle = '';

            if (typeof tag === "string") {
                var selection = $(this).find("input[type=hidden]").filter(function() {
                    return $(this).val() == tag.attr('data-value');
                });
                // Tag already added
                if (selection.length) {
                    return;
                }
            } else {
				value = tag.attr('data-value');
				libelle = tag.attr('data-libelle');
            }
            var element = $('<li class="tag"></li>');

            var close = $('<a class="close">'+unescape("%D7")+'</a>');
            close.click(function() {
				$(this).parent().remove();
			});

            element
                .append($("<span>"+libelle+"</span>"))
                .append($('<input type="hidden" name="'+data.field+'" value="'+value+'"/>'))
				.append(close);

            if (!$(element).parent().length) {
               element.insertBefore($(".tagit-edit-handle", self));
            }

            self.trigger("tagit-tag-added", [tag]);
			tag.remove();
        }, 
        
        removeTag: function(tag) {
            var self = $(this);
            
            var selection = self.find("input[type=hidden]").filter(function() {
                return $(this).val() == tag;
            });
            
            if (selection.length) {
                selection.parent().remove();
                self.trigger("tagit-tag-removed", [tag]);
            }
        }, 
        
        getTags: function() {
            return $.map($(this).find("input[type=hidden]"), function(e) {
                return $(e).val();
            });
        },

        autocomplete: function (tags, autocomplete) {
			var self = $(this);
            var currentTags = self.tagit("getTags");
            var data = self.data("tagit");

            autocomplete.empty();

			var availableTags = [];
			if(typeof tags != "undefined"){
				availableTags = $.grep(tags, function (e) {
					return $.inArray(e[data.inputvalue], currentTags) == -1;
				});
			}
            var count = 0;
            $.each(availableTags, function (i, e) {
				autocomplete.append($('<li data-value="'+e[data.inputvalue]+'" data-libelle="'+e[data.inputlibelle]+'">'+e[data.inputlibelle]+'</li>'));
                count++;
            });
            autocomplete.toggleClass("open", count > 0);
        }
    };

    $.extend($.fn, {
        tagit: function() {
            var args = $.makeArray(arguments);

            var arg0 = args.shift();
            if (tagit[arg0]) {
                return tagit[arg0].apply(this, args);
            }

            return this.each(function() {
                var e = $(this);

                var options = $.extend({}, $.fn.tagit.defaults);
                if ($.isPlainObject(arg0)) {
                    options = $.extend(options, arg0);
                }

                if (e.is(".tagit")) {

                } else {
                    e.data("tagit", options);

                    var input = $('<input type="text" class="no-style" />');
                    var autocomplete = $("<ul></ul>");

                    e.bind("tagit-tag-added", function() {
                        autocomplete.removeClass("open");
                    });

                    e.bind("focusin", function(event) {
                        $(this)
                            .addClass("focused")
                            .find("input[type=text]")
                            .focus(function (event) {
								event.stopPropagation();
							}).focus();
                    }).bind("focusout", function(event) {
                        $(this).removeClass("focused");
                    });
                    
                    input.keydown(function(event) {
                        var self = $(this);
                        var tag = self.val();

                        var keyCode = event.which;

                        // enter key pressed
                        if (keyCode == 13) {
                            if (autocomplete.is(".open")) {
                                var selection = $("li.selected", autocomplete);
                                if (selection.length) {
                                    e.tagit("addTag", selection);
                                    self.val("");
                                }
                            }

                            event.preventDefault();
                        } else 
                        // tab key pressed
                        if (keyCode == 9) {
                            if (tag) {
                                e.tagit("addTag", self);
                                self.val("");
                                
                                event.preventDefault();
                            }
                        } else
                        // up / down arrows pressed
                        if (keyCode == 38 || keyCode == 40) {                                    
                            if (autocomplete.is(".open")) {
                                var elements = $("li", autocomplete);
                                var selection = $(elements).filter(".selected");
                                if (selection.length == 0 && elements.length > 0) {
                                    elements.eq(keyCode == 38 ? elements.length - 1 : 0)
                                            .addClass("selected");
                                } else {
                                    var selector = keyCode == 38 ? "prev" : "next";
                                    var newSelection = selection
                                        [selector]()
                                        .addClass("selected");

                                    if (newSelection.length) {
                                        selection.removeClass("selected");
                                    }
                                }
                                
                                event.preventDefault();
                            }
                        } else
                        // delete key pressed
                        if (keyCode == 8 && !tag) {
                            self.parent().prev().remove();
                            event.preventDefault();
                        } else {
                            tag = (tag + String.fromCharCode(keyCode)).toLowerCase();
                            if (tag) {
                                var tagitBase = $(this).parents(".tagit")
                                var tags = tagitBase.data("tagit").tags;
                                var currentTags = tagitBase.tagit("getTags");

                                if ($.isFunction(tags)) {
                                    tags(tag, autocomplete);
                                } else {
                                    autocomplete.empty();
                                    var availableTags = $.grep(tags, function (e) {
                                        return $.inArray(e[inputvalue], currentTags) == -1;
                                    });
                                    var count = 0;
                                    $.each(availableTags, function (i, e) {
                                        if (e.toLowerCase().indexOf(tag) == 0) {
											autocomplete.append($('<li data-'+data.inputvalue+'="'+e[data.inputvalue]+'" data-'+data.inputlibelle+'="'+e[data.inputlibelle]+'">'+e[data.inputlibelle]+'</li>'));
                                            count++;
                                        }
                                    });
                                    autocomplete.toggleClass("open", count > 0);
                                }
                            }
                        }
                    });

                    autocomplete.click(function(event) {
                        var target = $(event.target);
                        if (target.is("li")) {
                            $(e).tagit("addTag", target);
							$(e).find("input[type=text]").val("");
                        }
                    });
                    
                    e.append($('<li class="tagit-edit-handle"></li>').append(input).append(autocomplete))
                     .addClass("tagit");

                    $("li:not(.tagit-edit-handle)", e).each(function() {
                        $(e).tagit("addTag", $(this));
                    });
                }
            });
        }
    });

    $.fn.tagit.defaults = {
        field: "tag",
        inputlibelle: "text",
        inputvalue: "id",
        tags: []
    };
})(jQuery);
var Chart=function(s){function v(a,c,b){a=A((a-c.graphMin)/(c.steps*c.stepValue),1,0);return b*c.steps*a}function x(a,c,b,e){function h(){g+=f;var k=a.animation?A(d(g),null,0):1;e.clearRect(0,0,q,u);a.scaleOverlay?(b(k),c()):(c(),b(k));if(1>=g)D(h);else if("function"==typeof a.onAnimationComplete)a.onAnimationComplete()}var f=a.animation?1/A(a.animationSteps,Number.MAX_VALUE,1):1,d=B[a.animationEasing],g=a.animation?0:1;"function"!==typeof c&&(c=function(){});D(h)}function C(a,c,b,e,h,f){var d;a=
Math.floor(Math.log(e-h)/Math.LN10);h=Math.floor(h/(1*Math.pow(10,a)))*Math.pow(10,a);e=Math.ceil(e/(1*Math.pow(10,a)))*Math.pow(10,a)-h;a=Math.pow(10,a);for(d=Math.round(e/a);d<b||d>c;)a=d<b?a/2:2*a,d=Math.round(e/a);c=[];z(f,c,d,h,a);return{steps:d,stepValue:a,graphMin:h,labels:c}}function z(a,c,b,e,h){if(a)for(var f=1;f<b+1;f++)c.push(E(a,{value:(e+h*f).toFixed(0!=h%1?h.toString().split(".")[1].length:0)}))}function A(a,c,b){return!isNaN(parseFloat(c))&&isFinite(c)&&a>c?c:!isNaN(parseFloat(b))&&
isFinite(b)&&a<b?b:a}function y(a,c){var b={},e;for(e in a)b[e]=a[e];for(e in c)b[e]=c[e];return b}function E(a,c){var b=!/\W/.test(a)?F[a]=F[a]||E(document.getElementById(a).innerHTML):new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+a.replace(/[\r\t\n]/g," ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');");return c?
b(c):b}var r=this,B={linear:function(a){return a},easeInQuad:function(a){return a*a},easeOutQuad:function(a){return-1*a*(a-2)},easeInOutQuad:function(a){return 1>(a/=0.5)?0.5*a*a:-0.5*(--a*(a-2)-1)},easeInCubic:function(a){return a*a*a},easeOutCubic:function(a){return 1*((a=a/1-1)*a*a+1)},easeInOutCubic:function(a){return 1>(a/=0.5)?0.5*a*a*a:0.5*((a-=2)*a*a+2)},easeInQuart:function(a){return a*a*a*a},easeOutQuart:function(a){return-1*((a=a/1-1)*a*a*a-1)},easeInOutQuart:function(a){return 1>(a/=0.5)?
0.5*a*a*a*a:-0.5*((a-=2)*a*a*a-2)},easeInQuint:function(a){return 1*(a/=1)*a*a*a*a},easeOutQuint:function(a){return 1*((a=a/1-1)*a*a*a*a+1)},easeInOutQuint:function(a){return 1>(a/=0.5)?0.5*a*a*a*a*a:0.5*((a-=2)*a*a*a*a+2)},easeInSine:function(a){return-1*Math.cos(a/1*(Math.PI/2))+1},easeOutSine:function(a){return 1*Math.sin(a/1*(Math.PI/2))},easeInOutSine:function(a){return-0.5*(Math.cos(Math.PI*a/1)-1)},easeInExpo:function(a){return 0==a?1:1*Math.pow(2,10*(a/1-1))},easeOutExpo:function(a){return 1==
a?1:1*(-Math.pow(2,-10*a/1)+1)},easeInOutExpo:function(a){return 0==a?0:1==a?1:1>(a/=0.5)?0.5*Math.pow(2,10*(a-1)):0.5*(-Math.pow(2,-10*--a)+2)},easeInCirc:function(a){return 1<=a?a:-1*(Math.sqrt(1-(a/=1)*a)-1)},easeOutCirc:function(a){return 1*Math.sqrt(1-(a=a/1-1)*a)},easeInOutCirc:function(a){return 1>(a/=0.5)?-0.5*(Math.sqrt(1-a*a)-1):0.5*(Math.sqrt(1-(a-=2)*a)+1)},easeInElastic:function(a){var c=1.70158,b=0,e=1;if(0==a)return 0;if(1==(a/=1))return 1;b||(b=0.3);e<Math.abs(1)?(e=1,c=b/4):c=b/(2*
Math.PI)*Math.asin(1/e);return-(e*Math.pow(2,10*(a-=1))*Math.sin((1*a-c)*2*Math.PI/b))},easeOutElastic:function(a){var c=1.70158,b=0,e=1;if(0==a)return 0;if(1==(a/=1))return 1;b||(b=0.3);e<Math.abs(1)?(e=1,c=b/4):c=b/(2*Math.PI)*Math.asin(1/e);return e*Math.pow(2,-10*a)*Math.sin((1*a-c)*2*Math.PI/b)+1},easeInOutElastic:function(a){var c=1.70158,b=0,e=1;if(0==a)return 0;if(2==(a/=0.5))return 1;b||(b=1*0.3*1.5);e<Math.abs(1)?(e=1,c=b/4):c=b/(2*Math.PI)*Math.asin(1/e);return 1>a?-0.5*e*Math.pow(2,10*
(a-=1))*Math.sin((1*a-c)*2*Math.PI/b):0.5*e*Math.pow(2,-10*(a-=1))*Math.sin((1*a-c)*2*Math.PI/b)+1},easeInBack:function(a){return 1*(a/=1)*a*(2.70158*a-1.70158)},easeOutBack:function(a){return 1*((a=a/1-1)*a*(2.70158*a+1.70158)+1)},easeInOutBack:function(a){var c=1.70158;return 1>(a/=0.5)?0.5*a*a*(((c*=1.525)+1)*a-c):0.5*((a-=2)*a*(((c*=1.525)+1)*a+c)+2)},easeInBounce:function(a){return 1-B.easeOutBounce(1-a)},easeOutBounce:function(a){return(a/=1)<1/2.75?1*7.5625*a*a:a<2/2.75?1*(7.5625*(a-=1.5/2.75)*
a+0.75):a<2.5/2.75?1*(7.5625*(a-=2.25/2.75)*a+0.9375):1*(7.5625*(a-=2.625/2.75)*a+0.984375)},easeInOutBounce:function(a){return 0.5>a?0.5*B.easeInBounce(2*a):0.5*B.easeOutBounce(2*a-1)+0.5}},q=s.canvas.width,u=s.canvas.height;window.devicePixelRatio&&(s.canvas.style.width=q+"px",s.canvas.style.height=u+"px",s.canvas.height=u*window.devicePixelRatio,s.canvas.width=q*window.devicePixelRatio,s.scale(window.devicePixelRatio,window.devicePixelRatio));this.PolarArea=function(a,c){r.PolarArea.defaults={scaleOverlay:!0,
scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleShowLine:!0,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!0,scaleLabel:"<%=value%>",scaleFontFamily:"'Arial'",scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",scaleShowLabelBackdrop:!0,scaleBackdropColor:"rgba(255,255,255,0.75)",scaleBackdropPaddingY:2,scaleBackdropPaddingX:2,segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,animation:!0,animationSteps:100,animationEasing:"easeOutBounce",
animateRotate:!0,animateScale:!1,onAnimationComplete:null};var b=c?y(r.PolarArea.defaults,c):r.PolarArea.defaults;return new G(a,b,s)};this.Radar=function(a,c){r.Radar.defaults={scaleOverlay:!1,scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleShowLine:!0,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!1,scaleLabel:"<%=value%>",scaleFontFamily:"'Arial'",scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",scaleShowLabelBackdrop:!0,scaleBackdropColor:"rgba(255,255,255,0.75)",
scaleBackdropPaddingY:2,scaleBackdropPaddingX:2,angleShowLineOut:!0,angleLineColor:"rgba(0,0,0,.1)",angleLineWidth:1,pointLabelFontFamily:"'Arial'",pointLabelFontStyle:"normal",pointLabelFontSize:12,pointLabelFontColor:"#666",pointDot:!0,pointDotRadius:3,pointDotStrokeWidth:1,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0,animation:!0,animationSteps:60,animationEasing:"easeOutQuart",onAnimationComplete:null};var b=c?y(r.Radar.defaults,c):r.Radar.defaults;return new H(a,b,s)};this.Pie=function(a,
c){r.Pie.defaults={segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,animation:!0,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,onAnimationComplete:null};var b=c?y(r.Pie.defaults,c):r.Pie.defaults;return new I(a,b,s)};this.Doughnut=function(a,c){r.Doughnut.defaults={segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,percentageInnerCutout:50,animation:!0,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,
onAnimationComplete:null};var b=c?y(r.Doughnut.defaults,c):r.Doughnut.defaults;return new J(a,b,s)};this.Line=function(a,c){r.Line.defaults={scaleOverlay:!1,scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!0,scaleLabel:"<%=value%>",scaleFontFamily:"'Arial'",scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",scaleShowGridLines:!0,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,bezierCurve:!0,
pointDot:!0,pointDotRadius:4,pointDotStrokeWidth:2,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0,animation:!0,animationSteps:60,animationEasing:"easeOutQuart",onAnimationComplete:null};var b=c?y(r.Line.defaults,c):r.Line.defaults;return new K(a,b,s)};this.Bar=function(a,c){r.Bar.defaults={scaleOverlay:!1,scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!0,scaleLabel:"<%=value%>",scaleFontFamily:"'Arial'",
scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",scaleShowGridLines:!0,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,barShowStroke:!0,barStrokeWidth:2,barValueSpacing:5,barDatasetSpacing:1,animation:!0,animationSteps:60,animationEasing:"easeOutQuart",onAnimationComplete:null};var b=c?y(r.Bar.defaults,c):r.Bar.defaults;return new L(a,b,s)};var G=function(a,c,b){var e,h,f,d,g,k,j,l,m;g=Math.min.apply(Math,[q,u])/2;g-=Math.max.apply(Math,[0.5*c.scaleFontSize,0.5*c.scaleLineWidth]);
d=2*c.scaleFontSize;c.scaleShowLabelBackdrop&&(d+=2*c.scaleBackdropPaddingY,g-=1.5*c.scaleBackdropPaddingY);l=g;d=d?d:5;e=Number.MIN_VALUE;h=Number.MAX_VALUE;for(f=0;f<a.length;f++)a[f].value>e&&(e=a[f].value),a[f].value<h&&(h=a[f].value);f=Math.floor(l/(0.66*d));d=Math.floor(0.5*(l/d));m=c.scaleShowLabels?c.scaleLabel:null;c.scaleOverride?(j={steps:c.scaleSteps,stepValue:c.scaleStepWidth,graphMin:c.scaleStartValue,labels:[]},z(m,j.labels,j.steps,c.scaleStartValue,c.scaleStepWidth)):j=C(l,f,d,e,h,
m);k=g/j.steps;x(c,function(){for(var a=0;a<j.steps;a++)if(c.scaleShowLine&&(b.beginPath(),b.arc(q/2,u/2,k*(a+1),0,2*Math.PI,!0),b.strokeStyle=c.scaleLineColor,b.lineWidth=c.scaleLineWidth,b.stroke()),c.scaleShowLabels){b.textAlign="center";b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;var e=j.labels[a];if(c.scaleShowLabelBackdrop){var d=b.measureText(e).width;b.fillStyle=c.scaleBackdropColor;b.beginPath();b.rect(Math.round(q/2-d/2-c.scaleBackdropPaddingX),Math.round(u/2-k*(a+
1)-0.5*c.scaleFontSize-c.scaleBackdropPaddingY),Math.round(d+2*c.scaleBackdropPaddingX),Math.round(c.scaleFontSize+2*c.scaleBackdropPaddingY));b.fill()}b.textBaseline="middle";b.fillStyle=c.scaleFontColor;b.fillText(e,q/2,u/2-k*(a+1))}},function(e){var d=-Math.PI/2,g=2*Math.PI/a.length,f=1,h=1;c.animation&&(c.animateScale&&(f=e),c.animateRotate&&(h=e));for(e=0;e<a.length;e++)b.beginPath(),b.arc(q/2,u/2,f*v(a[e].value,j,k),d,d+h*g,!1),b.lineTo(q/2,u/2),b.closePath(),b.fillStyle=a[e].color,b.fill(),
c.segmentShowStroke&&(b.strokeStyle=c.segmentStrokeColor,b.lineWidth=c.segmentStrokeWidth,b.stroke()),d+=h*g},b)},H=function(a,c,b){var e,h,f,d,g,k,j,l,m;a.labels||(a.labels=[]);g=Math.min.apply(Math,[q,u])/2;d=2*c.scaleFontSize;for(e=l=0;e<a.labels.length;e++)b.font=c.pointLabelFontStyle+" "+c.pointLabelFontSize+"px "+c.pointLabelFontFamily,h=b.measureText(a.labels[e]).width,h>l&&(l=h);g-=Math.max.apply(Math,[l,1.5*(c.pointLabelFontSize/2)]);g-=c.pointLabelFontSize;l=g=A(g,null,0);d=d?d:5;e=Number.MIN_VALUE;
h=Number.MAX_VALUE;for(f=0;f<a.datasets.length;f++)for(m=0;m<a.datasets[f].data.length;m++)a.datasets[f].data[m]>e&&(e=a.datasets[f].data[m]),a.datasets[f].data[m]<h&&(h=a.datasets[f].data[m]);f=Math.floor(l/(0.66*d));d=Math.floor(0.5*(l/d));m=c.scaleShowLabels?c.scaleLabel:null;c.scaleOverride?(j={steps:c.scaleSteps,stepValue:c.scaleStepWidth,graphMin:c.scaleStartValue,labels:[]},z(m,j.labels,j.steps,c.scaleStartValue,c.scaleStepWidth)):j=C(l,f,d,e,h,m);k=g/j.steps;x(c,function(){var e=2*Math.PI/
a.datasets[0].data.length;b.save();b.translate(q/2,u/2);if(c.angleShowLineOut){b.strokeStyle=c.angleLineColor;b.lineWidth=c.angleLineWidth;for(var d=0;d<a.datasets[0].data.length;d++)b.rotate(e),b.beginPath(),b.moveTo(0,0),b.lineTo(0,-g),b.stroke()}for(d=0;d<j.steps;d++){b.beginPath();if(c.scaleShowLine){b.strokeStyle=c.scaleLineColor;b.lineWidth=c.scaleLineWidth;b.moveTo(0,-k*(d+1));for(var f=0;f<a.datasets[0].data.length;f++)b.rotate(e),b.lineTo(0,-k*(d+1));b.closePath();b.stroke()}c.scaleShowLabels&&
(b.textAlign="center",b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily,b.textBaseline="middle",c.scaleShowLabelBackdrop&&(f=b.measureText(j.labels[d]).width,b.fillStyle=c.scaleBackdropColor,b.beginPath(),b.rect(Math.round(-f/2-c.scaleBackdropPaddingX),Math.round(-k*(d+1)-0.5*c.scaleFontSize-c.scaleBackdropPaddingY),Math.round(f+2*c.scaleBackdropPaddingX),Math.round(c.scaleFontSize+2*c.scaleBackdropPaddingY)),b.fill()),b.fillStyle=c.scaleFontColor,b.fillText(j.labels[d],0,-k*(d+
1)))}for(d=0;d<a.labels.length;d++){b.font=c.pointLabelFontStyle+" "+c.pointLabelFontSize+"px "+c.pointLabelFontFamily;b.fillStyle=c.pointLabelFontColor;var f=Math.sin(e*d)*(g+c.pointLabelFontSize),h=Math.cos(e*d)*(g+c.pointLabelFontSize);b.textAlign=e*d==Math.PI||0==e*d?"center":e*d>Math.PI?"right":"left";b.textBaseline="middle";b.fillText(a.labels[d],f,-h)}b.restore()},function(d){var e=2*Math.PI/a.datasets[0].data.length;b.save();b.translate(q/2,u/2);for(var g=0;g<a.datasets.length;g++){b.beginPath();
b.moveTo(0,d*-1*v(a.datasets[g].data[0],j,k));for(var f=1;f<a.datasets[g].data.length;f++)b.rotate(e),b.lineTo(0,d*-1*v(a.datasets[g].data[f],j,k));b.closePath();b.fillStyle=a.datasets[g].fillColor;b.strokeStyle=a.datasets[g].strokeColor;b.lineWidth=c.datasetStrokeWidth;b.fill();b.stroke();if(c.pointDot){b.fillStyle=a.datasets[g].pointColor;b.strokeStyle=a.datasets[g].pointStrokeColor;b.lineWidth=c.pointDotStrokeWidth;for(f=0;f<a.datasets[g].data.length;f++)b.rotate(e),b.beginPath(),b.arc(0,d*-1*
v(a.datasets[g].data[f],j,k),c.pointDotRadius,2*Math.PI,!1),b.fill(),b.stroke()}b.rotate(e)}b.restore()},b)},I=function(a,c,b){for(var e=0,h=Math.min.apply(Math,[u/2,q/2])-5,f=0;f<a.length;f++)e+=a[f].value;x(c,null,function(d){var g=-Math.PI/2,f=1,j=1;c.animation&&(c.animateScale&&(f=d),c.animateRotate&&(j=d));for(d=0;d<a.length;d++){var l=j*a[d].value/e*2*Math.PI;b.beginPath();b.arc(q/2,u/2,f*h,g,g+l);b.lineTo(q/2,u/2);b.closePath();b.fillStyle=a[d].color;b.fill();c.segmentShowStroke&&(b.lineWidth=
c.segmentStrokeWidth,b.strokeStyle=c.segmentStrokeColor,b.stroke());g+=l}},b)},J=function(a,c,b){for(var e=0,h=Math.min.apply(Math,[u/2,q/2])-5,f=h*(c.percentageInnerCutout/100),d=0;d<a.length;d++)e+=a[d].value;x(c,null,function(d){var k=-Math.PI/2,j=1,l=1;c.animation&&(c.animateScale&&(j=d),c.animateRotate&&(l=d));for(d=0;d<a.length;d++){var m=l*a[d].value/e*2*Math.PI;b.beginPath();b.arc(q/2,u/2,j*h,k,k+m,!1);b.arc(q/2,u/2,j*f,k+m,k,!0);b.closePath();b.fillStyle=a[d].color;b.fill();c.segmentShowStroke&&
(b.lineWidth=c.segmentStrokeWidth,b.strokeStyle=c.segmentStrokeColor,b.stroke());k+=m}},b)},K=function(a,c,b){var e,h,f,d,g,k,j,l,m,t,r,n,p,s=0;g=u;b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;t=1;for(d=0;d<a.labels.length;d++)e=b.measureText(a.labels[d]).width,t=e>t?e:t;q/a.labels.length<t?(s=45,q/a.labels.length<Math.cos(s)*t?(s=90,g-=t):g-=Math.sin(s)*t):g-=c.scaleFontSize;d=c.scaleFontSize;g=g-5-d;e=Number.MIN_VALUE;h=Number.MAX_VALUE;for(f=0;f<a.datasets.length;f++)for(l=
0;l<a.datasets[f].data.length;l++)a.datasets[f].data[l]>e&&(e=a.datasets[f].data[l]),a.datasets[f].data[l]<h&&(h=a.datasets[f].data[l]);f=Math.floor(g/(0.66*d));d=Math.floor(0.5*(g/d));l=c.scaleShowLabels?c.scaleLabel:"";c.scaleOverride?(j={steps:c.scaleSteps,stepValue:c.scaleStepWidth,graphMin:c.scaleStartValue,labels:[]},z(l,j.labels,j.steps,c.scaleStartValue,c.scaleStepWidth)):j=C(g,f,d,e,h,l);k=Math.floor(g/j.steps);d=1;if(c.scaleShowLabels){b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;
for(e=0;e<j.labels.length;e++)h=b.measureText(j.labels[e]).width,d=h>d?h:d;d+=10}r=q-d-t;m=Math.floor(r/(a.labels.length-1));n=q-t/2-r;p=g+c.scaleFontSize/2;x(c,function(){b.lineWidth=c.scaleLineWidth;b.strokeStyle=c.scaleLineColor;b.beginPath();b.moveTo(q-t/2+5,p);b.lineTo(q-t/2-r-5,p);b.stroke();0<s?(b.save(),b.textAlign="right"):b.textAlign="center";b.fillStyle=c.scaleFontColor;for(var d=0;d<a.labels.length;d++)b.save(),0<s?(b.translate(n+d*m,p+c.scaleFontSize),b.rotate(-(s*(Math.PI/180))),b.fillText(a.labels[d],
0,0),b.restore()):b.fillText(a.labels[d],n+d*m,p+c.scaleFontSize+3),b.beginPath(),b.moveTo(n+d*m,p+3),c.scaleShowGridLines&&0<d?(b.lineWidth=c.scaleGridLineWidth,b.strokeStyle=c.scaleGridLineColor,b.lineTo(n+d*m,5)):b.lineTo(n+d*m,p+3),b.stroke();b.lineWidth=c.scaleLineWidth;b.strokeStyle=c.scaleLineColor;b.beginPath();b.moveTo(n,p+5);b.lineTo(n,5);b.stroke();b.textAlign="right";b.textBaseline="middle";for(d=0;d<j.steps;d++)b.beginPath(),b.moveTo(n-3,p-(d+1)*k),c.scaleShowGridLines?(b.lineWidth=c.scaleGridLineWidth,
b.strokeStyle=c.scaleGridLineColor,b.lineTo(n+r+5,p-(d+1)*k)):b.lineTo(n-0.5,p-(d+1)*k),b.stroke(),c.scaleShowLabels&&b.fillText(j.labels[d],n-8,p-(d+1)*k)},function(d){function e(b,c){return p-d*v(a.datasets[b].data[c],j,k)}for(var f=0;f<a.datasets.length;f++){b.strokeStyle=a.datasets[f].strokeColor;b.lineWidth=c.datasetStrokeWidth;b.beginPath();b.moveTo(n,p-d*v(a.datasets[f].data[0],j,k));for(var g=1;g<a.datasets[f].data.length;g++)c.bezierCurve?b.bezierCurveTo(n+m*(g-0.5),e(f,g-1),n+m*(g-0.5),
e(f,g),n+m*g,e(f,g)):b.lineTo(n+m*g,e(f,g));b.stroke();c.datasetFill?(b.lineTo(n+m*(a.datasets[f].data.length-1),p),b.lineTo(n,p),b.closePath(),b.fillStyle=a.datasets[f].fillColor,b.fill()):b.closePath();if(c.pointDot){b.fillStyle=a.datasets[f].pointColor;b.strokeStyle=a.datasets[f].pointStrokeColor;b.lineWidth=c.pointDotStrokeWidth;for(g=0;g<a.datasets[f].data.length;g++)b.beginPath(),b.arc(n+m*g,p-d*v(a.datasets[f].data[g],j,k),c.pointDotRadius,0,2*Math.PI,!0),b.fill(),b.stroke()}}},b)},L=function(a,
c,b){var e,h,f,d,g,k,j,l,m,t,r,n,p,s,w=0;g=u;b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;t=1;for(d=0;d<a.labels.length;d++)e=b.measureText(a.labels[d]).width,t=e>t?e:t;q/a.labels.length<t?(w=45,q/a.labels.length<Math.cos(w)*t?(w=90,g-=t):g-=Math.sin(w)*t):g-=c.scaleFontSize;d=c.scaleFontSize;g=g-5-d;e=Number.MIN_VALUE;h=Number.MAX_VALUE;for(f=0;f<a.datasets.length;f++)for(l=0;l<a.datasets[f].data.length;l++)a.datasets[f].data[l]>e&&(e=a.datasets[f].data[l]),a.datasets[f].data[l]<
h&&(h=a.datasets[f].data[l]);f=Math.floor(g/(0.66*d));d=Math.floor(0.5*(g/d));l=c.scaleShowLabels?c.scaleLabel:"";c.scaleOverride?(j={steps:c.scaleSteps,stepValue:c.scaleStepWidth,graphMin:c.scaleStartValue,labels:[]},z(l,j.labels,j.steps,c.scaleStartValue,c.scaleStepWidth)):j=C(g,f,d,e,h,l);k=Math.floor(g/j.steps);d=1;if(c.scaleShowLabels){b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;for(e=0;e<j.labels.length;e++)h=b.measureText(j.labels[e]).width,d=h>d?h:d;d+=10}r=q-d-t;m=
Math.floor(r/a.labels.length);s=(m-2*c.scaleGridLineWidth-2*c.barValueSpacing-(c.barDatasetSpacing*a.datasets.length-1)-(c.barStrokeWidth/2*a.datasets.length-1))/a.datasets.length;n=q-t/2-r;p=g+c.scaleFontSize/2;x(c,function(){b.lineWidth=c.scaleLineWidth;b.strokeStyle=c.scaleLineColor;b.beginPath();b.moveTo(q-t/2+5,p);b.lineTo(q-t/2-r-5,p);b.stroke();0<w?(b.save(),b.textAlign="right"):b.textAlign="center";b.fillStyle=c.scaleFontColor;for(var d=0;d<a.labels.length;d++)b.save(),0<w?(b.translate(n+
d*m,p+c.scaleFontSize),b.rotate(-(w*(Math.PI/180))),b.fillText(a.labels[d],0,0),b.restore()):b.fillText(a.labels[d],n+d*m+m/2,p+c.scaleFontSize+3),b.beginPath(),b.moveTo(n+(d+1)*m,p+3),b.lineWidth=c.scaleGridLineWidth,b.strokeStyle=c.scaleGridLineColor,b.lineTo(n+(d+1)*m,5),b.stroke();b.lineWidth=c.scaleLineWidth;b.strokeStyle=c.scaleLineColor;b.beginPath();b.moveTo(n,p+5);b.lineTo(n,5);b.stroke();b.textAlign="right";b.textBaseline="middle";for(d=0;d<j.steps;d++)b.beginPath(),b.moveTo(n-3,p-(d+1)*
k),c.scaleShowGridLines?(b.lineWidth=c.scaleGridLineWidth,b.strokeStyle=c.scaleGridLineColor,b.lineTo(n+r+5,p-(d+1)*k)):b.lineTo(n-0.5,p-(d+1)*k),b.stroke(),c.scaleShowLabels&&b.fillText(j.labels[d],n-8,p-(d+1)*k)},function(d){b.lineWidth=c.barStrokeWidth;for(var e=0;e<a.datasets.length;e++){b.fillStyle=a.datasets[e].fillColor;b.strokeStyle=a.datasets[e].strokeColor;for(var f=0;f<a.datasets[e].data.length;f++){var g=n+c.barValueSpacing+m*f+s*e+c.barDatasetSpacing*e+c.barStrokeWidth*e;b.beginPath();
b.moveTo(g,p);b.lineTo(g,p-d*v(a.datasets[e].data[f],j,k)+c.barStrokeWidth/2);b.lineTo(g+s,p-d*v(a.datasets[e].data[f],j,k)+c.barStrokeWidth/2);b.lineTo(g+s,p);c.barShowStroke&&b.stroke();b.closePath();b.fill()}}},b)},D=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)},F={}};

(function($){var JqueryBracket=function(opts){var align=opts.dir==='lr'?'right':'left'
var resultIdentifier
function defaultEdit(span,data,done){var input=$('<input type="text">')
input.val(data)
span.html(input)
input.focus()
input.blur(function(){done(input.val())})
input.keydown(function(e){var key=(e.keyCode||e.which)
if(key===9||key===13||key===27){e.preventDefault()
done(input.val(),(key!==27))}})}
function defaultRender(container,team,score){container.append(team)}
function assert(statement){if(!statement)
throw new Error('Assertion error')}
if(!opts)
throw new Error('Options not set')
if(!opts.el)
throw new Error('Invalid jQuery object as container')
if(!opts.init&&!opts.save)
throw new Error('No bracket data or save callback given')
if(opts.userData===undefined)
opts.userData=null
if(opts.decorator&&(!opts.decorator.edit||!opts.decorator.render))
throw new Error('Invalid decorator input')
else if(!opts.decorator)
opts.decorator={edit:defaultEdit,render:defaultRender}
var data
if(!opts.init)
opts.init={teams:[['','']],results:[]}
data=opts.init
var topCon=$('<div class="jQBracket '+opts.dir+'"></div>').appendTo(opts.el.empty())
function isNumber(n){return!isNaN(parseFloat(n))&&isFinite(n);}
function renderAll(save){resultIdentifier=0
w.render()
if(l&&f){l.render()
f.render()}
postProcess(topCon)
if(save){data.results[0]=w.results()
if(l&&f){data.results[1]=l.results()
data.results[2]=f.results()}
if(opts.save)
opts.save(data,opts.userData)}}
var Match=function(round,data,idx,results,renderCb){function connector(height,shift,teamCon){var width=parseInt($('.round:first').css('margin-right'),10)/2
var drop=true;if(height<0){drop=false;height=-height;}
if(height<2)
height=0
var src=$('<div class="connector"></div>').appendTo(teamCon);src.css('height',height);src.css('width',width+'px');src.css(align,(-width-2)+'px');if(shift>=0)
src.css('top',shift+'px');else
src.css('bottom',(-shift)+'px');if(drop)
src.css('border-bottom','none');else
src.css('border-top','none');var dst=$('<div class="connector"></div>').appendTo(src);dst.css('width',width+'px');dst.css(align,-width+'px');if(drop)
dst.css('bottom','0px');else
dst.css('top','0px');return src;}
function winner(){if(isNumber(data[0].score)&&isNumber(data[1].score)){if(data[0].score>data[1].score)
return data[0]
else if(data[0].score<data[1].score)
return data[1]}
return{source:null,name:null,id:-1,score:null}}
function loser(){if(isNumber(data[0].score)&&isNumber(data[1].score)){if(data[0].score>data[1].score)
return data[1]
else if(data[0].score<data[1].score)
return data[0]}
return{source:null,name:null,id:-1,score:null}}
function teamElement(round,team,isReady){var rId=resultIdentifier
var sEl=$('<span id="result-'+rId+'"></span>')
var score
if(!team.name||!isReady){score='--'}
else{if(!isNumber(team.score))
team.score=0
score=team.score}
sEl.append(score)
resultIdentifier+=1
var name=!team.name?'--':team.name
var tEl=$('<div class="team"></div>');var nEl=$('<b></b>').appendTo(tEl)
if(round===0)
tEl.attr('id','team-'+rId)
opts.decorator.render(nEl,name,score)
if(isNumber(team.idx))
tEl.attr('index',team.idx)
if(team.name===null)
tEl.addClass('na')
else if(winner().name===team.name)
tEl.addClass('win')
else if(loser().name===team.name)
tEl.addClass('lose')
tEl.append(sEl)
if(!(team.name===null||!isReady||!opts.save)&&opts.save){nEl.click(function(){var span=$(this)
function editor(){function done_fn(val,next){if(val)
opts.init.teams[~~(team.idx/2)][team.idx%2]=val
renderAll(true)
span.click(editor)
var labels=opts.el.find('#team-'+(team.idx+1)+' b:first')
if(labels.length&&next===true&&round===0)
$(labels).click()}
span.unbind()
opts.decorator.edit(span,team.name,done_fn)}
editor()})
if(team.name){sEl.click(function(){var span=$(this)
function editor(){span.unbind()
var score
if(!isNumber(team.score))
score='0'
else
score=span.text()
var input=$('<input type="text">')
input.val(score)
span.html(input)
input.focus().select()
input.keydown(function(e){if(!isNumber($(this).val()))
$(this).addClass('error')
else
$(this).removeClass('error')
var key=(e.keyCode||e.which)
if(key===9||key===13||key===27){e.preventDefault()
$(this).blur()
if(key===27)
return
var next=topCon.find('span[id=result-'+(rId+1)+']')
if(next)
next.click()}})
input.blur(function(){var val=input.val()
if((!val||!isNumber(val))&&!isNumber(team.score))
val='0'
else if((!val||!isNumber(val))&&isNumber(team.score))
val=team.score
span.html(val)
if(isNumber(val)&&score!==parseInt(val,10)){team.score=parseInt(val,10)
renderAll(true)}
span.click(editor)})}
editor()})}}
return tEl;}
var connectorCb=null
var alignCb=null
var matchCon=$('<div class="match"></div>')
var teamCon=$('<div class="teamContainer"></div>')
data[0].id=0
data[1].id=1
data[0].name=data[0].source().name
data[1].name=data[1].source().name
data[0].score=!results?null:results[0]
data[1].score=!results?null:results[1]
if((!data[0].name||!data[1].name)&&(isNumber(data[0].score)||isNumber(data[1].score))){console.log('ERROR IN SCORE DATA: '+data[0].source().name+': '+data[0].score+', '+data[1].source().name+': '+data[1].score)
data[0].score=data[1].score=null}
return{el:matchCon,id:idx,round:function(){return round},connectorCb:function(cb){connectorCb=cb},connect:function(cb){var connectorOffset=teamCon.height()/4
var matchupOffset=matchCon.height()/2
var shift
var height
if(!cb||cb===null){if(idx%2===0){if(this.winner().id===0){shift=connectorOffset
height=matchupOffset}
else if(this.winner().id===1){shift=connectorOffset*3
height=matchupOffset-connectorOffset*2}
else{shift=connectorOffset*2
height=matchupOffset-connectorOffset}}
else{if(this.winner().id===0){shift=-connectorOffset*3
height=-matchupOffset+connectorOffset*2}
else if(this.winner().id===1){shift=-connectorOffset
height=-matchupOffset}
else{shift=-connectorOffset*2
height=-matchupOffset+connectorOffset}}}
else{var info=cb(teamCon,this)
if(info===null)
return
shift=info.shift
height=info.height}
teamCon.append(connector(height,shift,teamCon));},winner:winner,loser:loser,first:function(){return data[0]},second:function(){return data[1]},setAlignCb:function(cb){alignCb=cb},render:function(){matchCon.empty()
teamCon.empty()
data[0].name=data[0].source().name
data[1].name=data[1].source().name
data[0].idx=data[0].source().idx
data[1].idx=data[1].source().idx
var isReady=false
if((data[0].name||data[0].name==='')&&(data[1].name||data[1].name===''))
isReady=true
if(!winner().name)
teamCon.addClass('np')
else
teamCon.removeClass('np')
teamCon.append(teamElement(round.id,data[0],isReady))
teamCon.append(teamElement(round.id,data[1],isReady))
matchCon.appendTo(round.el)
matchCon.append(teamCon)
this.el.css('height',(round.bracket.el.height()/round.size())+'px');teamCon.css('top',(this.el.height()/2-teamCon.height()/2)+'px');if(alignCb)
alignCb(teamCon)
var isLast=false
if(typeof(renderCb)==='function')
isLast=renderCb(this)
if(!isLast)
this.connect(connectorCb)},results:function(){return[data[0].score,data[1].score]}}}
var Round=function(bracket,previousRound,roundIdx,results,doRenderCb){var matches=[]
var roundCon=$('<div class="round"></div>')
return{el:roundCon,bracket:bracket,id:roundIdx,addMatch:function(teamCb,renderCb){var matchIdx=matches.length
var teams
if(teamCb!==null)
teams=teamCb()
else
teams=[{source:bracket.round(roundIdx-1).match(matchIdx*2).winner},{source:bracket.round(roundIdx-1).match(matchIdx*2+1).winner}]
var match=new Match(this,teams,matchIdx,!results?null:results[matchIdx],renderCb)
matches.push(match)
return match;},match:function(id){return matches[id]},prev:function(){return previousRound},size:function(){return matches.length},render:function(){roundCon.empty()
if(typeof(doRenderCb)==='function')
if(!doRenderCb())
return
roundCon.appendTo(bracket.el)
$.each(matches,function(i,ma){ma.render()})},results:function(){var results=[]
$.each(matches,function(i,ma){results.push(ma.results())})
return results}}}
var Bracket=function(bracketCon,results,teams){var rounds=[]
return{el:bracketCon,addRound:function(doRenderCb){var id=rounds.length
var previous=null
if(id>0)
previous=rounds[id-1]
var round=new Round(this,previous,id,!results?null:results[id],doRenderCb)
rounds.push(round)
return round;},dropRound:function(){rounds.pop()},round:function(id){return rounds[id]},size:function(){return rounds.length},final:function(){return rounds[rounds.length-1].match(0)},winner:function(){return rounds[rounds.length-1].match(0).winner()},loser:function(){return rounds[rounds.length-1].match(0).loser()},render:function(){bracketCon.empty()
for(var i=0;i<rounds.length;i+=1)
rounds[i].render()},results:function(){var results=[]
$.each(rounds,function(i,ro){results.push(ro.results())})
return results}}}
function isValid(data){var t=data.teams
var r=data.results
if(!t){console.log('no teams',data)
return false}
if(!r)
return true
if(t.length<r[0][0].length){console.log('more results than teams',data)
return false}
for(var b=0;b<r.length;b+=1){for(var i=0;i<~~(r[b].length/2);i+=1){if(r[b][2*i].length<r[b][2*i+1].length){console.log('previous round has less scores than next one',data)
return false}}}
for(var i=0;i<r[0].length;i+=1){if(!r[1]||!r[1][i*2])
break;if(r[0][i].length<=r[1][i*2].length){console.log('lb has more results than wb',data)
return false}}
try{$.each(r,function(i,br){$.each(br,function(i,ro){$.each(ro,function(i,ma){if(ma.length!==2){console.log('match size not valid',ma)
throw'match size not valid'}
if(!(isNumber(ma[0])?isNumber(ma[1]):!isNumber(ma[1]))){console.log('mixed results',ma)
throw'mixed results'}})})})}
catch(e){console.log(e)
return false}
return true}
function postProcess(container){var Track=function(teamIndex,cssClass){var index=teamIndex;var elements=container.find('.team[index='+index+']')
var addedClass
if(!cssClass)
addedClass='highlight'
else
addedClass=cssClass
return{highlight:function(){elements.each(function(){$(this).addClass(addedClass)
if($(this).hasClass('win'))
$(this).parent().find('.connector').addClass(addedClass)})},deHighlight:function(){elements.each(function(){$(this).removeClass(addedClass)
$(this).parent().find('.connector').removeClass(addedClass)})}}}
var source=f||w
var winner=source.winner()
var loser=source.loser()
var winTrack=null
var loseTrack=null
if(winner&&loser){winTrack=new Track(winner.idx,'highlightWinner');loseTrack=new Track(loser.idx,'highlightLoser');winTrack.highlight()
loseTrack.highlight()}
container.find('.team').mouseover(function(){var i=$(this).attr('index')
var track=new Track(i);track.highlight()
$(this).mouseout(function(){track.deHighlight()
$(this).unbind('mouseout')})})}
function winnerBubbles(match){var el=match.el
var winner=el.find('.team.win')
winner.append('<div class="bubble">1st</div>')
var loser=el.find('.team.lose')
loser.append('<div class="bubble">2nd</div>')
return true}
function consolationBubbles(match){var el=match.el
var winner=el.find('.team.win')
winner.append('<div class="bubble third">3rd</div>')
var loser=el.find('.team.lose')
loser.append('<div class="bubble fourth">4th</div>')
return true}
function prepareWinners(winners,data,isSingleElimination){var teams=data.teams;var results=data.results;var rounds=Math.log(teams.length*2)/Math.log(2);var matches=teams.length;var graphHeight=winners.el.height();var round
for(var r=0;r<rounds;r+=1){round=winners.addRound()
for(var m=0;m<matches;m+=1){var teamCb=null
if(r===0){teamCb=function(){var t=teams[m]
var i=m
return[{source:function(){return{name:t[0],idx:(i*2)}}},{source:function(){return{name:t[1],idx:(i*2+1)}}}]}}
if(!(r===rounds-1&&isSingleElimination)){round.addMatch(teamCb)}
else{var match=round.addMatch(teamCb,winnerBubbles)
match.setAlignCb(function(tC){tC.css('top','');tC.css('position','absolute');if(opts.skipConsolationRound)
tC.css('top',(match.el.height()/2-tC.height()/2)+'px');else
tC.css('bottom',(-tC.height()/2)+'px');})}}
matches/=2;}
if(isSingleElimination){winners.final().connectorCb(function(){return null})
if(teams.length>1&&!opts.skipConsolationRound){var third=winners.final().round().prev().match(0).loser
var fourth=winners.final().round().prev().match(1).loser
var consol=round.addMatch(function(){return[{source:third},{source:fourth}]},consolationBubbles)
consol.setAlignCb(function(tC){var height=(winners.el.height())/2
consol.el.css('height',(height)+'px');var topShift=tC.height()
tC.css('top',(topShift)+'px');})
consol.connectorCb(function(){return null})}}}
function prepareLosers(winners,losers,data){var teams=data.teams;var results=data.results;var rounds=Math.log(teams.length*2)/Math.log(2)-1;var matches=teams.length/2;var graphHeight=losers.el.height();for(var r=0;r<rounds;r+=1){for(var n=0;n<2;n+=1){var round=losers.addRound()
for(var m=0;m<matches;m+=1){var teamCb=null
if(!(n%2===0&&r!==0)){teamCb=function(){if(n%2===0&&r===0){return[{source:winners.round(0).match(m*2).loser},{source:winners.round(0).match(m*2+1).loser}]}
else{var winnerMatch=m
if(r%2===0)
winnerMatch=matches-m-1
return[{source:losers.round(r*2).match(m).winner},{source:winners.round(r+1).match(winnerMatch).loser}]}}}
var match=round.addMatch(teamCb)
var teamCon=match.el.find('.teamContainer')
match.setAlignCb(function(){teamCon.css('top',(match.el.height()/2-teamCon.height()/2)+'px');})
if(r<rounds-1||n<1){var cb=null
if(n%2===0){cb=function(tC,match){var connectorOffset=tC.height()/4
var height=0;var shift=0;if(match.winner().id===0){shift=connectorOffset}
else if(match.winner().id===1){height=-connectorOffset*2;shift=connectorOffset}
else{shift=connectorOffset*2}
return{height:height,shift:shift}}}
match.connectorCb(cb)}}}
matches/=2;}}
function prepareFinals(finals,winners,losers,data){var round=finals.addRound()
var match=round.addMatch(function(){return[{source:winners.winner},{source:losers.winner}]},function(match){var _isResized=false
if((match.winner().name!==null&&match.winner().name===losers.winner().name)){if(finals.size()===2)
return
var round=finals.addRound(function(){var rematch=((match.winner().name!==null&&match.winner().name===losers.winner().name))
if(_isResized===false){if(rematch){_isResized=true}}
if(!rematch&&_isResized){_isResized=false
finals.dropRound()}
return rematch})
var match2=round.addMatch(function(){return[{source:match.first},{source:match.second}]},winnerBubbles)
match.connectorCb(function(tC){return{height:0,shift:tC.height()/2}})
match2.connectorCb(function(){return null})
match2.setAlignCb(function(tC){var height=(winners.el.height()+losers.el.height())
match2.el.css('height',(height)+'px');var topShift=(winners.el.height()/2+winners.el.height()+losers.el.height()/2)/2-tC.height()
tC.css('top',(topShift)+'px')})
return false}
else{return winnerBubbles(match)}})
match.setAlignCb(function(tC){var height=(winners.el.height()+losers.el.height())
if(!opts.skipConsolationRound)
height/=2
match.el.css('height',(height)+'px');var topShift=(winners.el.height()/2+winners.el.height()+losers.el.height()/2)/2-tC.height()
tC.css('top',(topShift)+'px')})
var shift
var height
if(!opts.skipConsolationRound){var fourth=losers.final().round().prev().match(0).loser
var consol=round.addMatch(function(){return[{source:fourth},{source:losers.loser}]},consolationBubbles)
consol.setAlignCb(function(tC){var height=(winners.el.height()+losers.el.height())/2
consol.el.css('height',(height)+'px');var topShift=(winners.el.height()/2+winners.el.height()+losers.el.height()/2)/2+tC.height()/2-height
tC.css('top',(topShift)+'px');})
match.connectorCb(function(){return null})
consol.connectorCb(function(){return null})}
winners.final().connectorCb(function(tC){var connectorOffset=tC.height()/4
var topShift=(winners.el.height()/2+winners.el.height()+losers.el.height()/2)/2-tC.height()/2
var matchupOffset=topShift-winners.el.height()/2
if(winners.winner().id===0){height=matchupOffset+connectorOffset*2
shift=connectorOffset}
else if(winners.winner().id===1){height=matchupOffset
shift=connectorOffset*3}
else{height=matchupOffset+connectorOffset
shift=connectorOffset*2}
height-=tC.height()/2
return{height:height,shift:shift}})
losers.final().connectorCb(function(tC){var connectorOffset=tC.height()/4
var topShift=(winners.el.height()/2+winners.el.height()+losers.el.height()/2)/2-tC.height()/2
var matchupOffset=topShift-winners.el.height()/2
if(losers.winner().id===0){height=matchupOffset
shift=connectorOffset*3}
else if(losers.winner().id===1){height=matchupOffset+connectorOffset*2
shift=connectorOffset}
else{height=matchupOffset+connectorOffset
shift=connectorOffset*2}
height+=tC.height()/2
return{height:-height,shift:-shift}})}
var w,l,f
var r=data.results
function depth(a){function df(a,d){if(a instanceof Array)
return df(a[0],d+1)
return d}
return df(a,0)}
function wrap(a,d){if(d>0)
a=wrap([a],d-1)
return a}
r=wrap(r,4-depth(r))
data.results=r
var isSingleElimination=(r.length<=1)
if(opts.save){var tools=$('<div class="tools"></div>').appendTo(topCon)
var inc=$('<span class="increment">+</span>').appendTo(tools)
inc.click(function(){var i
var len=data.teams.length
for(i=0;i<len;i+=1)
data.teams.push(['',''])
return new JqueryBracket(opts)})
if(data.teams.length>1&&data.results.length===1||data.teams.length>2&&data.results.length===3){var dec=$('<span class="decrement">-</span>').appendTo(tools)
dec.click(function(){if(data.teams.length>1){data.teams=data.teams.slice(0,data.teams.length/2)
return new JqueryBracket(opts)}})}
var type
if(data.results.length===1&&data.teams.length>1){type=$('<span class="doubleElimination">de</span>').appendTo(tools)
type.click(function(){if(data.teams.length>1&&data.results.length<3){data.results.push([],[])
return new JqueryBracket(opts)}})}
else if(data.results.length===3&&data.teams.length>1){type=$('<span class="singleElimination">se</span>').appendTo(tools)
type.click(function(){if(data.results.length===3){data.results=data.results.slice(0,1)
return new JqueryBracket(opts)}})}}
var fEl,wEl,lEl
if(isSingleElimination){wEl=$('<div class="bracket"></div>').appendTo(topCon)}
else{fEl=$('<div class="finals"></div>').appendTo(topCon)
wEl=$('<div class="bracket"></div>').appendTo(topCon)
lEl=$('<div class="loserBracket"></div>').appendTo(topCon)}
var height=data.teams.length*60
wEl.css('height',height)
if(isSingleElimination&&data.teams.length<=2&&!opts.skipConsolationRound){height+=30
topCon.css('height',height)}
if(lEl)
lEl.css('height',wEl.height()/2)
var rounds
if(isSingleElimination)
rounds=Math.log(data.teams.length*2)/Math.log(2)
else
rounds=(Math.log(data.teams.length*2)/Math.log(2)-1)*2+1
w=new Bracket(wEl,!r||!r[0]?null:r[0],data.teams)
if(!isSingleElimination){l=new Bracket(lEl,!r||!r[1]?null:r[1],null)
f=new Bracket(fEl,!r||!r[2]?null:r[2],null)}
prepareWinners(w,data,isSingleElimination)
if(!isSingleElimination){prepareLosers(w,l,data);prepareFinals(f,w,l,data);}
renderAll(false)
return{data:function(){return opts.init}}}
var methods={init:function(opts){var that=this
opts.el=this
opts.dir=opts.dir||'lr'
opts.skipConsolationRound=opts.skipConsolationRound||false
if(opts.dir!=='lr'&&opts.dir!=='rl')
$.error('Direction must be either: "lr" or "rl"')
var bracket=new JqueryBracket(opts)
$(this).data('bracket',{target:that,obj:bracket})
return bracket},data:function(){var bracket=$(this).data('bracket')
return bracket.obj.data()}}
$.fn.bracket=function(method){if(methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof method==='object'||!method){return methods.init.apply(this,arguments)}else{$.error('Method '+method+' does not exist on jQuery.bracket')}}})(jQuery)
/*!
	TimelineJS
	Version 2.17
	Designed and built by Zach Wise at VéritéCo

	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
	
*//* **********************************************
     Begin VMM.StoryJS.License.js
********************************************** *//*!
	StoryJS
	Designed and built by Zach Wise at VéritéCo

	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*//* **********************************************
     Begin VMM.js
********************************************** *//**
	* VéritéCo JS Core
	* Designed and built by Zach Wise at VéritéCo zach@verite.co

	* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/.

*//*	Simple JavaScript Inheritance
	By John Resig http://ejohn.org/
	MIT Licensed.
================================================== *//*!
	StoryJS
	Designed and built by Zach Wise at VéritéCo

	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*//* **********************************************
     Begin LazyLoad.js
********************************************** */
/*jslint browser: true, eqeqeq: true, bitwise: true, newcap: true, immed: true, regexp: false *//*
LazyLoad makes it easy and painless to lazily load one or more external
JavaScript or CSS files on demand either during or after the rendering of a web
page.

Supported browsers include Firefox 2+, IE6+, Safari 3+ (including Mobile
Safari), Google Chrome, and Opera 9+. Other browsers may or may not work and
are not officially supported.

Visit https://github.com/rgrove/lazyload/ for more info.

Copyright (c) 2011 Ryan Grove <ryan@wonko.com>
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

@module lazyload
@class LazyLoad
@static
@version 2.0.3 (git)
*/
function getEmbedScriptPath(e){var t=document.getElementsByTagName("script"),n="",r="";for(var i=0;i<t.length;i++)t[i].src.match(e)&&(n=t[i].src);n!=""&&(r="/");return n.split("?")[0].split("/").slice(0,-1).join("/")+r}function createStoryJS(e,t){function g(){LoadLib.js(h.js,y)}function y(){l.js=!0;h.lang!="en"?LazyLoad.js(c.locale,b):l.language=!0;x()}function b(){l.language=!0;x()}function w(){l.css=!0;x()}function E(){l.font.css=!0;x()}function S(){l.font.js=!0;x()}function x(){if(l.checks>40)return;l.checks++;if(l.js&&l.css&&l.font.css&&l.font.js&&l.language){if(!l.finished){l.finished=!0;N()}}else l.timeout=setTimeout("onloaded_check_again();",250)}function T(){var e="storyjs-embed";r=document.createElement("div");h.embed_id!=""?i=document.getElementById(h.embed_id):i=document.getElementById("timeline-embed");i.appendChild(r);r.setAttribute("id",h.id);if(h.width.toString().match("%"))i.style.width=h.width.split("%")[0]+"%";else{h.width=h.width-2;i.style.width=h.width+"px"}if(h.height.toString().match("%")){i.style.height=h.height;e+=" full-embed";i.style.height=h.height.split("%")[0]+"%"}else if(h.width.toString().match("%")){e+=" full-embed";h.height=h.height-16;i.style.height=h.height+"px"}else{e+=" sized-embed";h.height=h.height-16;i.style.height=h.height+"px"}i.setAttribute("class",e);i.setAttribute("className",e);r.style.position="relative"}function N(){VMM.debug=h.debug;n=new VMM.Timeline(h.id);n.init(h);o&&VMM.bindEvent(global,onHeadline,"HEADLINE")}var n,r,i,s,o=!1,u="2.17",a="1.7.1",f="",l={timeout:"",checks:0,finished:!1,js:!1,css:!1,jquery:!1,has_jquery:!1,language:!1,font:{css:!1,js:!1}},c={base:embed_path,css:embed_path+"css/",js:embed_path+"js/",locale:embed_path+"js/locale/",jquery:"http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js",font:{google:!1,css:embed_path+"css/themes/font/",js:"http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"}},h={version:u,debug:!1,type:"timeline",id:"storyjs",embed_id:"timeline-embed",embed:!0,width:"100%",height:"100%",source:"https://docs.google.com/spreadsheet/pub?key=0Agl_Dv6iEbDadFYzRjJPUGktY0NkWXFUWkVIZDNGRHc&output=html",lang:"en",font:"default",css:c.css+"timeline.css?"+u,js:"",api_keys:{google:"",flickr:"",twitter:""},gmap_key:""},p=[{name:"Merriweather-NewsCycle",google:["News+Cycle:400,700:latin","Merriweather:400,700,900:latin"]},{name:"NewsCycle-Merriweather",google:["News+Cycle:400,700:latin","Merriweather:300,400,700:latin"]},{name:"PoiretOne-Molengo",google:["Poiret+One::latin","Molengo::latin"]},{name:"Arvo-PTSans",google:["Arvo:400,700,400italic:latin","PT+Sans:400,700,400italic:latin"]},{name:"PTSerif-PTSans",google:["PT+Sans:400,700,400italic:latin","PT+Serif:400,700,400italic:latin"]},{name:"PT",google:["PT+Sans+Narrow:400,700:latin","PT+Sans:400,700,400italic:latin","PT+Serif:400,700,400italic:latin"]},{name:"DroidSerif-DroidSans",google:["Droid+Sans:400,700:latin","Droid+Serif:400,700,400italic:latin"]},{name:"Lekton-Molengo",google:["Lekton:400,700,400italic:latin","Molengo::latin"]},{name:"NixieOne-Ledger",google:["Nixie+One::latin","Ledger::latin"]},{name:"AbrilFatface-Average",google:["Average::latin","Abril+Fatface::latin"]},{name:"PlayfairDisplay-Muli",google:["Playfair+Display:400,400italic:latin","Muli:300,400,300italic,400italic:latin"]},{name:"Rancho-Gudea",google:["Rancho::latin","Gudea:400,700,400italic:latin"]},{name:"Bevan-PotanoSans",google:["Bevan::latin","Pontano+Sans::latin"]},{name:"BreeSerif-OpenSans",google:["Bree+Serif::latin","Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800:latin"]},{name:"SansitaOne-Kameron",google:["Sansita+One::latin","Kameron:400,700:latin"]},{name:"Lora-Istok",google:["Lora:400,700,400italic,700italic:latin","Istok+Web:400,700,400italic,700italic:latin"]},{name:"Pacifico-Arimo",google:["Pacifico::latin","Arimo:400,700,400italic,700italic:latin"]}];if(typeof e=="object")for(s in e)Object.prototype.hasOwnProperty.call(e,s)&&(h[s]=e[s]);typeof t!="undefined"&&(h.source=t);if(typeof url_config=="object"){o=!0;h.source.match("docs.google.com")||h.source.match("json")||h.source.match("storify")||(h.source="https://docs.google.com/spreadsheet/pub?key="+h.source+"&output=html")}if(h.js.match("locale")){h.lang=h.js.split("locale/")[1].replace(".js","");h.js=c.js+"timeline-min.js?"+u}if(!h.js.match("/")){h.css=c.css+h.type+".css?"+u;h.js=c.js+h.type;h.debug?h.js+=".js?"+u:h.js+="-min.js?"+u;h.id="storyjs-"+h.type}h.lang.match("/")?c.locale=h.lang:c.locale=c.locale+h.lang+".js?"+u;T();LoadLib.css(h.css,w);if(h.font=="default"){l.font.js=!0;l.font.css=!0}else{var d;if(h.font.match("/")){d=h.font.split(".css")[0].split("/");c.font.name=d[d.length-1];c.font.css=h.font}else{c.font.name=h.font;c.font.css=c.font.css+h.font+".css?"+u}LoadLib.css(c.font.css,E);for(var v=0;v<p.length;v++)if(c.font.name==p[v].name){c.font.google=!0;WebFontConfig={google:{families:p[v].google}}}c.font.google?LoadLib.js(c.font.js,S):l.font.js=!0}try{l.has_jquery=jQuery;l.has_jquery=!0;if(l.has_jquery){var f=parseFloat(jQuery.fn.jquery);f<parseFloat(a)?l.jquery=!1:l.jquery=!0}}catch(m){l.jquery=!1}l.jquery?g():LoadLib.js(c.jquery,g);this.onloaded_check_again=function(){x()}}LazyLoad=function(e){function u(t,n){var r=e.createElement(t),i;for(i in n)n.hasOwnProperty(i)&&r.setAttribute(i,n[i]);return r}function a(e){var t=r[e],n,o;if(t){n=t.callback;o=t.urls;o.shift();i=0;if(!o.length){n&&n.call(t.context,t.obj);r[e]=null;s[e].length&&l(e)}}}function f(){var n=navigator.userAgent;t={async:e.createElement("script").async===!0};(t.webkit=/AppleWebKit\//.test(n))||(t.ie=/MSIE/.test(n))||(t.opera=/Opera/.test(n))||(t.gecko=/Gecko\//.test(n))||(t.unknown=!0)}function l(i,o,l,p,d){var v=function(){a(i)},m=i==="css",g=[],y,b,w,E,S,x;t||f();if(o){o=typeof o=="string"?[o]:o.concat();if(m||t.async||t.gecko||t.opera)s[i].push({urls:o,callback:l,obj:p,context:d});else for(y=0,b=o.length;y<b;++y)s[i].push({urls:[o[y]],callback:y===b-1?l:null,obj:p,context:d})}if(r[i]||!(E=r[i]=s[i].shift()))return;n||(n=e.head||e.getElementsByTagName("head")[0]);S=E.urls;for(y=0,b=S.length;y<b;++y){x=S[y];if(m)w=t.gecko?u("style"):u("link",{href:x,rel:"stylesheet"});else{w=u("script",{src:x});w.async=!1}w.className="lazyload";w.setAttribute("charset","utf-8");if(t.ie&&!m)w.onreadystatechange=function(){if(/loaded|complete/.test(w.readyState)){w.onreadystatechange=null;v()}};else if(m&&(t.gecko||t.webkit))if(t.webkit){E.urls[y]=w.href;h()}else{w.innerHTML='@import "'+x+'";';c(w)}else w.onload=w.onerror=v;g.push(w)}for(y=0,b=g.length;y<b;++y)n.appendChild(g[y])}function c(e){var t;try{t=!!e.sheet.cssRules}catch(n){i+=1;i<200?setTimeout(function(){c(e)},50):t&&a("css");return}a("css")}function h(){var e=r.css,t;if(e){t=o.length;while(--t>=0)if(o[t].href===e.urls[0]){a("css");break}i+=1;e&&(i<200?setTimeout(h,50):a("css"))}}var t,n,r={},i=0,s={css:[],js:[]},o=e.styleSheets;return{css:function(e,t,n,r){l("css",e,t,n,r)},js:function(e,t,n,r){l("js",e,t,n,r)}}}(this.document);LoadLib=function(e){function n(e){var n=0,r=!1;for(n=0;n<t.length;n++)t[n]==e&&(r=!0);if(r)return!0;t.push(e);return!1}var t=[];return{css:function(e,t,r,i){n(e)||LazyLoad.css(e,t,r,i)},js:function(e,t,r,i){n(e)||LazyLoad.js(e,t,r,i)}}}(this.document);var WebFontConfig;if(typeof embed_path=="undefined"||typeof embed_path=="undefined")var embed_path=getEmbedScriptPath("storyjs-embed.js").split("js/")[0];(function(){typeof url_config=="object"?createStoryJS(url_config):typeof timeline_config=="object"?createStoryJS(timeline_config):typeof storyjs_config=="object"?createStoryJS(storyjs_config):typeof config=="object"&&createStoryJS(config)})();
function trace(e){VMM.debug&&(window.console?console.log(e):typeof jsTrace!="undefined"&&jsTrace.send(e))}function onYouTubePlayerAPIReady(){trace("GLOBAL YOUTUBE API CALLED");VMM.ExternalAPI.youtube.onAPIReady()}(function(){var e=!1,t=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){};Class.extend=function(n){function o(){!e&&this.init&&this.init.apply(this,arguments)}var r=this.prototype;e=!0;var i=new this;e=!1;for(var s in n)i[s]=typeof n[s]=="function"&&typeof r[s]=="function"&&t.test(n[s])?function(e,t){return function(){var n=this._super;this._super=r[e];var i=t.apply(this,arguments);this._super=n;return i}}(s,n[s]):n[s];o.prototype=i;o.prototype.constructor=o;o.extend=arguments.callee;return o}})();var global=function(){return this||(1,eval)("this")}();if(typeof VMM=="undefined"){var VMM=Class.extend({});VMM.debug=!0;VMM.master_config={init:function(){return this},sizes:{api:{width:0,height:0}},vp:"Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo",api_keys_master:{flickr:"RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ==",google:"uQKadH1VMlCsp560gN2aOiMz4evWkl1s34yryl3F/9FJOsn+/948CbBUvKLN46U=",twitter:""},timers:{api:7e3},api:{pushques:[]},twitter:{active:!1,array:[],api_loaded:!1,que:[]},flickr:{active:!1,array:[],api_loaded:!1,que:[]},youtube:{active:!1,array:[],api_loaded:!1,que:[]},vimeo:{active:!1,array:[],api_loaded:!1,que:[]},vine:{active:!1,array:[],api_loaded:!1,que:[]},webthumb:{active:!1,array:[],api_loaded:!1,que:[]},googlemaps:{active:!1,map_active:!1,places_active:!1,array:[],api_loaded:!1,que:[]},googledocs:{active:!1,array:[],api_loaded:!1,que:[]},googleplus:{active:!1,array:[],api_loaded:!1,que:[]},wikipedia:{active:!1,array:[],api_loaded:!1,que:[],tries:0},soundcloud:{active:!1,array:[],api_loaded:!1,que:[]}}.init();VMM.createElement=function(e,t,n,r,i){var s="";if(e!=null&&e!=""){s+="<"+e;n!=null&&n!=""&&(s+=" class='"+n+"'");r!=null&&r!=""&&(s+=" "+r);i!=null&&i!=""&&(s+=" style='"+i+"'");s+=">";t!=null&&t!=""&&(s+=t);s=s+"</"+e+">"}return s};VMM.createMediaElement=function(e,t,n){var r="",i=!1;r+="<div class='media'>";if(e!=null&&e!=""){valid=!0;r+="<img src='"+e+"'>";n!=null&&n!=""&&(r+=VMM.createElement("div",n,"credit"));t!=null&&t!=""&&(r+=VMM.createElement("div",t,"caption"))}r+="</div>";return r};VMM.hideUrlBar=function(){var e=window,t=e.document;if(!location.hash||!e.addEventListener){window.scrollTo(0,1);var n=1,r=setInterval(function(){if(t.body){clearInterval(r);n="scrollTop"in t.body?t.body.scrollTop:1;e.scrollTo(0,n===1?0:1)}},15);e.addEventListener("load",function(){setTimeout(function(){e.scrollTo(0,n===1?0:1)},0)},!1)}}}Array.prototype.remove=function(e,t){var n=this.slice((t||e)+1||this.length);this.length=e<0?this.length+e:e;return this.push.apply(this,n)};Date.prototype.getWeek=function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil(((this-e)/864e5+e.getDay()+1)/7)};Date.prototype.getDayOfYear=function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil((this-e)/864e5)};var is={Null:function(e){return e===null},Undefined:function(e){return e===undefined},nt:function(e){return e===null||e===undefined},Function:function(e){return typeof e=="function"?e.constructor.toString().match(/Function/)!==null:!1},String:function(e){return typeof e=="string"?!0:typeof e=="object"?e.constructor.toString().match(/string/i)!==null:!1},Array:function(e){return typeof e=="object"?e.constructor.toString().match(/array/i)!==null||e.length!==undefined:!1},Boolean:function(e){return typeof e=="boolean"?!0:typeof e=="object"?e.constructor.toString().match(/boolean/i)!==null:!1},Date:function(e){return typeof e=="date"?!0:typeof e=="object"?e.constructor.toString().match(/date/i)!==null:!1},HTML:function(e){return typeof e=="object"?e.constructor.toString().match(/html/i)!==null:!1},Number:function(e){return typeof e=="number"?!0:typeof e=="object"?e.constructor.toString().match(/Number/)!==null:!1},Object:function(e){return typeof e=="object"?e.constructor.toString().match(/object/i)!==null:!1},RegExp:function(e){return typeof e=="function"?e.constructor.toString().match(/regexp/i)!==null:!1}},type={of:function(e){for(var t in is)if(is[t](e))return t.toLowerCase()}};if(typeof VMM!="undefined"){VMM.smoothScrollTo=function(e,t,n){if(typeof jQuery!="undefined"){var r="easein",i=1e3;t!=null&&(t<1?i=1:i=Math.round(t));n!=null&&n!=""&&(r=n);jQuery(window).scrollTop()!=VMM.Lib.offset(e).top&&VMM.Lib.animate("html,body",i,r,{scrollTop:VMM.Lib.offset(e).top})}};VMM.attachElement=function(e,t){typeof jQuery!="undefined"&&jQuery(e).html(t)};VMM.appendElement=function(e,t){typeof jQuery!="undefined"&&jQuery(e).append(t)};VMM.getHTML=function(e){var t;if(typeof jQuery!="undefined"){t=jQuery(e).html();return t}};VMM.getElement=function(e,t){var n;if(typeof jQuery!="undefined"){t?n=jQuery(e).parent().get(0):n=jQuery(e).get(0);return n}};VMM.bindEvent=function(e,t,n,r){var i,s="click",o={};n!=null&&n!=""&&(s=n);o!=null&&o!=""&&(o=r);typeof jQuery!="undefined"&&jQuery(e).bind(s,o,t)};VMM.unbindEvent=function(e,t,n){var r,i="click",s={};n!=null&&n!=""&&(i=n);typeof jQuery!="undefined"&&jQuery(e).unbind(i,t)};VMM.fireEvent=function(e,t,n){var r,i="click",s=[];t!=null&&t!=""&&(i=t);n!=null&&n!=""&&(s=n);typeof jQuery!="undefined"&&jQuery(e).trigger(i,s)};VMM.getJSON=function(e,t,n){if(typeof jQuery!="undefined"){jQuery.ajaxSetup({timeout:3e3});if(VMM.Browser.browser=="Explorer"&&parseInt(VMM.Browser.version,10)>=7&&window.XDomainRequest){trace("IE JSON");var r=e;if(r.match("^http://"))return jQuery.getJSON(r,t,n);if(r.match("^https://")){r=r.replace("https://","http://");return jQuery.getJSON(r,t,n)}return jQuery.getJSON(e,t,n)}return jQuery.getJSON(e,t,n)}};VMM.parseJSON=function(e){if(typeof jQuery!="undefined")return jQuery.parseJSON(e)};VMM.appendAndGetElement=function(e,t,n,r){var i,s="<div>",o="",u="",a="";t!=null&&t!=""&&(s=t);n!=null&&n!=""&&(o=n);r!=null&&r!=""&&(u=r);if(typeof jQuery!="undefined"){i=jQuery(t);i.addClass(o);i.html(u);jQuery(e).append(i)}return i};VMM.Lib={init:function(){return this},hide:function(e,t){t!=null&&t!=""?typeof jQuery!="undefined"&&jQuery(e).hide(t):typeof jQuery!="undefined"&&jQuery(e).hide()},remove:function(e){typeof jQuery!="undefined"&&jQuery(e).remove()},detach:function(e){typeof jQuery!="undefined"&&jQuery(e).detach()},append:function(e,t){typeof jQuery!="undefined"&&jQuery(e).append(t)},prepend:function(e,t){typeof jQuery!="undefined"&&jQuery(e).prepend(t)},show:function(e,t){t!=null&&t!=""?typeof jQuery!="undefined"&&jQuery(e).show(t):typeof jQuery!="undefined"&&jQuery(e).show()},load:function(e,t,n){var r={elem:e};r!=null&&r!=""&&(r=n);typeof jQuery!="undefined"&&jQuery(e).load(r,t)},addClass:function(e,t){typeof jQuery!="undefined"&&jQuery(e).addClass(t)},removeClass:function(e,t){typeof jQuery!="undefined"&&jQuery(e).removeClass(t)},attr:function(e,t,n){if(n!=null&&n!="")typeof jQuery!="undefined"&&jQuery(e).attr(t,n);else if(typeof jQuery!="undefined")return jQuery(e).attr(t)},prop:function(e,t,n){typeof jQuery=="undefined"||!/[1-9]\.[3-9].[1-9]/.test(jQuery.fn.jquery)?VMM.Lib.attribute(e,t,n):jQuery(e).prop(t,n)},attribute:function(e,t,n){if(n!=null&&n!="")typeof jQuery!="undefined"&&jQuery(e).attr(t,n);else if(typeof jQuery!="undefined")return jQuery(e).attr(t)},visible:function(e,t){if(t!=null)typeof jQuery!="undefined"&&(t?jQuery(e).show(0):jQuery(e).hide(0));else if(typeof jQuery!="undefined")return jQuery(e).is(":visible")?!0:!1},css:function(e,t,n){if(n!=null&&n!="")typeof jQuery!="undefined"&&jQuery(e).css(t,n);else if(typeof jQuery!="undefined")return jQuery(e).css(t)},cssmultiple:function(e,t){if(typeof jQuery!="undefined")return jQuery(e).css(t)},offset:function(e){var t;typeof jQuery!="undefined"&&(t=jQuery(e).offset());return t},position:function(e){var t;typeof jQuery!="undefined"&&(t=jQuery(e).position());return t},width:function(e,t){if(t!=null&&t!="")typeof jQuery!="undefined"&&jQuery(e).width(t);else if(typeof jQuery!="undefined")return jQuery(e).width()},height:function(e,t){if(t!=null&&t!="")typeof jQuery!="undefined"&&jQuery(e).height(t);else if(typeof jQuery!="undefined")return jQuery(e).height()},toggleClass:function(e,t){typeof jQuery!="undefined"&&jQuery(e).toggleClass(t)},each:function(e,t){typeof jQuery!="undefined"&&jQuery(e).each(t)},html:function(e,t){var n;if(typeof jQuery!="undefined"){n=jQuery(e).html();return n}if(t!=null&&t!="")typeof jQuery!="undefined"&&jQuery(e).html(t);else{var n;if(typeof jQuery!="undefined"){n=jQuery(e).html();return n}}},find:function(e,t){if(typeof jQuery!="undefined")return jQuery(e).find(t)},stop:function(e){typeof jQuery!="undefined"&&jQuery(e).stop()},delay_animate:function(e,t,n,r,i,s){if(VMM.Browser.device=="mobile"||VMM.Browser.device=="tablet"){var o=Math.round(n/1500*10)/10,u=o+"s";VMM.Lib.css(t,"-webkit-transition","all "+u+" ease");VMM.Lib.css(t,"-moz-transition","all "+u+" ease");VMM.Lib.css(t,"-o-transition","all "+u+" ease");VMM.Lib.css(t,"-ms-transition","all "+u+" ease");VMM.Lib.css(t,"transition","all "+u+" ease");VMM.Lib.cssmultiple(t,_att)}else typeof jQuery!="undefined"&&jQuery(t).delay(e).animate(i,{duration:n,easing:r})},animate:function(e,t,n,r,i,s){var o="easein",u=!1,a=1e3,f={};t!=null&&(t<1?a=1:a=Math.round(t));n!=null&&n!=""&&(o=n);i!=null&&i!=""&&(u=i);r!=null?f=r:f={opacity:0};if(VMM.Browser.device=="mobile"||VMM.Browser.device=="tablet"){var l=Math.round(a/1500*10)/10,c=l+"s";o=" cubic-bezier(0.33, 0.66, 0.66, 1)";for(x in f)if(Object.prototype.hasOwnProperty.call(f,x)){trace(x+" to "+f[x]);VMM.Lib.css(e,"-webkit-transition",x+" "+c+o);VMM.Lib.css(e,"-moz-transition",x+" "+c+o);VMM.Lib.css(e,"-o-transition",x+" "+c+o);VMM.Lib.css(e,"-ms-transition",x+" "+c+o);VMM.Lib.css(e,"transition",x+" "+c+o)}VMM.Lib.cssmultiple(e,f)}else typeof jQuery!="undefined"&&(s!=null&&s!=""?jQuery(e).animate(f,{queue:u,duration:a,easing:o,complete:s}):jQuery(e).animate(f,{queue:u,duration:a,easing:o}))}}}if(typeof jQuery!="undefined"){(function(e){window.XDomainRequest&&e.ajaxTransport(function(t){if(t.crossDomain&&t.async){if(t.timeout){t.xdrTimeout=t.timeout;delete t.timeout}var n;return{send:function(r,i){function o(t,r,s,o){n.onload=n.onerror=n.ontimeout=e.noop;n=undefined;i(t,r,s,o)}n=new XDomainRequest;n.open(t.type,t.url);n.onload=function(){o(200,"OK",{text:n.responseText},"Content-Type: "+n.contentType)};n.onerror=function(){o(404,"Not Found")};if(t.xdrTimeout){n.ontimeout=function(){o(0,"timeout")};n.timeout=t.xdrTimeout}n.send(t.hasContent&&t.data||null)},abort:function(){if(n){n.onerror=e.noop();n.abort()}}}}})})(jQuery);jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,t,n,r,i){return jQuery.easing[jQuery.easing.def](e,t,n,r,i)},easeInExpo:function(e,t,n,r,i){return t==0?n:r*Math.pow(2,10*(t/i-1))+n},easeOutExpo:function(e,t,n,r,i){return t==i?n+r:r*(-Math.pow(2,-10*t/i)+1)+n},easeInOutExpo:function(e,t,n,r,i){return t==0?n:t==i?n+r:(t/=i/2)<1?r/2*Math.pow(2,10*(t-1))+n:r/2*(-Math.pow(2,-10*--t)+2)+n},easeInQuad:function(e,t,n,r,i){return r*(t/=i)*t+n},easeOutQuad:function(e,t,n,r,i){return-r*(t/=i)*(t-2)+n},easeInOutQuad:function(e,t,n,r,i){return(t/=i/2)<1?r/2*t*t+n:-r/2*(--t*(t-2)-1)+n}})}if(typeof VMM!="undefined"&&typeof VMM.Browser=="undefined"){VMM.Browser={init:function(){this.browser=this.searchString(this.dataBrowser)||"An unknown browser";this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";this.OS=this.searchString(this.dataOS)||"an unknown OS";this.device=this.searchDevice(navigator.userAgent);this.orientation=this.searchOrientation(window.orientation)},searchOrientation:function(e){var t="";e==0||e==180?t="portrait":e==90||e==-90?t="landscape":t="normal";return t},searchDevice:function(e){var t="";e.match(/Android/i)||e.match(/iPhone|iPod/i)?t="mobile":e.match(/iPad/i)?t="tablet":e.match(/BlackBerry/i)||e.match(/IEMobile/i)?t="other mobile":t="desktop";return t},searchString:function(e){for(var t=0;t<e.length;t++){var n=e[t].string,r=e[t].prop;this.versionSearchString=e[t].versionSearch||e[t].identity;if(n){if(n.indexOf(e[t].subString)!=-1)return e[t].identity}else if(r)return e[t].identity}},searchVersion:function(e){var t=e.indexOf(this.versionSearchString);if(t==-1)return;return parseFloat(e.substring(t+this.versionSearchString.length+1))},dataBrowser:[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera",versionSearch:"Version"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone/iPod"},{string:navigator.userAgent,subString:"iPad",identity:"iPad"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};VMM.Browser.init()}typeof VMM!="undefined"&&typeof VMM.FileExtention=="undefined"&&(VMM.FileExtention={googleDocType:function(e){var t=e.replace(/\s\s*$/,""),n="",r=["DOC","DOCX","XLS","XLSX","PPT","PPTX","PDF","PAGES","AI","PSD","TIFF","DXF","SVG","EPS","PS","TTF","XPS","ZIP","RAR"],i=!1;n=t.substr(t.length-5,5);for(var s=0;s<r.length;s++)if(n.toLowerCase().match(r[s].toString().toLowerCase())||t.match("docs.google.com"))i=!0;return i}});if(typeof VMM!="undefined"&&typeof VMM.Date=="undefined"){VMM.Date={init:function(){return this},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' hh:MM TT",full_long_small_date:"hh:MM TT'<br/><small>mmm d',' yyyy'</small>'"},month:["January","February","March","April","May","June","July","August","September","October","November","December"],month_abbr:["Jan.","Feb.","March","April","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."],day:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],day_abbr:["Sun.","Mon.","Tues.","Wed.","Thurs.","Fri.","Sat."],hour:[1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12],hour_suffix:["am"],bc_format:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"dddd', 'h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"dddd',' mmm d',' yyyy 'at' hh:MM TT",full_long_small_date:"hh:MM TT'<br/><small>'dddd',' mmm d',' yyyy'</small>'"},setLanguage:function(e){trace("SET DATE LANGUAGE");VMM.Date.dateformats=e.dateformats;VMM.Date.month=e.date.month;VMM.Date.month_abbr=e.date.month_abbr;VMM.Date.day=e.date.day;VMM.Date.day_abbr=e.date.day_abbr;dateFormat.i18n.dayNames=e.date.day_abbr.concat(e.date.day);dateFormat.i18n.monthNames=e.date.month_abbr.concat(e.date.month)},parse:function(e,t){"use strict";var n,r,i,s,o={year:!1,month:!1,day:!1,hour:!1,minute:!1,second:!1,millisecond:!1};if(type.of(e)=="date")n=e;else{n=new Date(0,0,1,0,0,0,0);if(e.match(/,/gi)){r=e.split(",");for(var u=0;u<r.length;u++)r[u]=parseInt(r[u],10);if(r[0]){n.setFullYear(r[0]);o.year=!0}if(r[1]){n.setMonth(r[1]-1);o.month=!0}if(r[2]){n.setDate(r[2]);o.day=!0}if(r[3]){n.setHours(r[3]);o.hour=!0}if(r[4]){n.setMinutes(r[4]);o.minute=!0}if(r[5]){n.setSeconds(r[5]);o.second=!0}if(r[6]){n.setMilliseconds(r[6]);o.millisecond=!0}}else if(e.match("/")){if(e.match(" ")){s=e.split(" ");if(e.match(":")){i=s[1].split(":");if(i[0]>=0){n.setHours(i[0]);o.hour=!0}if(i[1]>=0){n.setMinutes(i[1]);o.minute=!0}if(i[2]>=0){n.setSeconds(i[2]);o.second=!0}if(i[3]>=0){n.setMilliseconds(i[3]);o.millisecond=!0}}r=s[0].split("/")}else r=e.split("/");if(r[2]){n.setFullYear(r[2]);o.year=!0}if(r[0]>=0){n.setMonth(r[0]-1);o.month=!0}if(r[1]>=0)if(r[1].length>2){n.setFullYear(r[1]);o.year=!0}else{n.setDate(r[1]);o.day=!0}}else if(e.match("now")){var a=new Date;n.setFullYear(a.getFullYear());o.year=!0;n.setMonth(a.getMonth());o.month=!0;n.setDate(a.getDate());o.day=!0;if(e.match("hours")){n.setHours(a.getHours());o.hour=!0}if(e.match("minutes")){n.setHours(a.getHours());n.setMinutes(a.getMinutes());o.hour=!0;o.minute=!0}if(e.match("seconds")){n.setHours(a.getHours());n.setMinutes(a.getMinutes());n.setSeconds(a.getSeconds());o.hour=!0;o.minute=!0;o.second=!0}if(e.match("milliseconds")){n.setHours(a.getHours());n.setMinutes(a.getMinutes());n.setSeconds(a.getSeconds());n.setMilliseconds(a.getMilliseconds());o.hour=!0;o.minute=!0;o.second=!0;o.millisecond=!0}}else if(e.length<=5){o.year=!0;n.setFullYear(parseInt(e,10));n.setMonth(0);n.setDate(1);n.setHours(0);n.setMinutes(0);n.setSeconds(0);n.setMilliseconds(0)}else if(e.match("T"))if(navigator.userAgent.match(/MSIE\s(?!9.0)/)){s=e.split("T");if(e.match(":")){i=s[1].split(":");if(i[0]>=1){n.setHours(i[0]);o.hour=!0}if(i[1]>=1){n.setMinutes(i[1]);o.minute=!0}if(i[2]>=1){n.setSeconds(i[2]);o.second=!0}if(i[3]>=1){n.setMilliseconds(i[3]);o.millisecond=!0}}r=s[0].split("-");if(r[0]){n.setFullYear(r[0]);o.year=!0}if(r[1]>=0){n.setMonth(r[1]-1);o.month=!0}if(r[2]>=0){n.setDate(r[2]);o.day=!0}}else n=new Date(Date.parse(e));else{o.year=!0;o.month=!0;o.day=!0;o.hour=!0;o.minute=!0;o.second=!0;o.millisecond=!0;n=new Date(parseInt(e.slice(0,4),10),parseInt(e.slice(4,6),10)-1,parseInt(e.slice(6,8),10),parseInt(e.slice(8,10),10),parseInt(e.slice(10,12),10))}}return t!=null&&t!=""?{date:n,precision:o}:n},prettyDate:function(e,t,n,r){var i,s,o,u,a=!1,f,l,c;if(r!=null&&r!=""&&typeof r!="undefined"){a=!0;trace("D2 "+r)}if(type.of(e)=="date"){type.of(n)=="object"?n.millisecond||n.second||n.minute?t?o=VMM.Date.dateformats.time_no_seconds_short:o=VMM.Date.dateformats.time_no_seconds_small_date:n.hour?t?o=VMM.Date.dateformats.time_no_seconds_short:o=VMM.Date.dateformats.time_no_seconds_small_date:n.day?t?o=VMM.Date.dateformats.full_short:o=VMM.Date.dateformats.full:n.month?t?o=VMM.Date.dateformats.month_short:o=VMM.Date.dateformats.month:n.year?o=VMM.Date.dateformats.year:o=VMM.Date.dateformats.year:e.getMonth()===0&&e.getDate()==1&&e.getHours()===0&&e.getMinutes()===0?o=VMM.Date.dateformats.year:e.getDate()<=1&&e.getHours()===0&&e.getMinutes()===0?t?o=VMM.Date.dateformats.month_short:o=VMM.Date.dateformats.month:e.getHours()===0&&e.getMinutes()===0?t?o=VMM.Date.dateformats.full_short:o=VMM.Date.dateformats.full:e.getMinutes()===0?t?o=VMM.Date.dateformats.time_no_seconds_short:o=VMM.Date.dateformats.time_no_seconds_small_date:t?o=VMM.Date.dateformats.time_no_seconds_short:o=VMM.Date.dateformats.full_long;i=dateFormat(e,o,!1);u=i.split(" ");for(var h=0;h<u.length;h++)if(parseInt(u[h],10)<0){trace("YEAR IS BC");f=u[h];l=Math.abs(parseInt(u[h],10));c=l.toString()+" B.C.";i=i.replace(f,c)}if(a){s=dateFormat(r,o,!1);u=s.split(" ");for(var p=0;p<u.length;p++)if(parseInt(u[p],10)<0){trace("YEAR IS BC");f=u[p];l=Math.abs(parseInt(u[p],10));c=l.toString()+" B.C.";s=s.replace(f,c)}}}else{trace("NOT A VALID DATE?");trace(e)}return a?i+" &mdash; "+s:i}}.init();var dateFormat=function(){var e=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,t=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,n=/[^-+\dA-Z]/g,r=function(e,t){e=String(e);t=t||2;while(e.length<t)e="0"+e;return e};return function(i,s,o){var u=dateFormat;if(arguments.length==1&&Object.prototype.toString.call(i)=="[object String]"&&!/\d/.test(i)){s=i;i=undefined}isNaN(i)&&trace("invalid date "+i);s=String(u.masks[s]||s||u.masks["default"]);if(s.slice(0,4)=="UTC:"){s=s.slice(4);o=!0}var a=o?"getUTC":"get",f=i[a+"Date"](),l=i[a+"Day"](),c=i[a+"Month"](),h=i[a+"FullYear"](),p=i[a+"Hours"](),d=i[a+"Minutes"](),v=i[a+"Seconds"](),m=i[a+"Milliseconds"](),g=o?0:i.getTimezoneOffset(),y={d:f,dd:r(f),ddd:u.i18n.dayNames[l],dddd:u.i18n.dayNames[l+7],m:c+1,mm:r(c+1),mmm:u.i18n.monthNames[c],mmmm:u.i18n.monthNames[c+12],yy:String(h).slice(2),yyyy:h,h:p%12||12,hh:r(p%12||12),H:p,HH:r(p),M:d,MM:r(d),s:v,ss:r(v),l:r(m,3),L:r(m>99?Math.round(m/10):m),t:p<12?"a":"p",tt:p<12?"am":"pm",T:p<12?"A":"P",TT:p<12?"AM":"PM",Z:o?"UTC":(String(i).match(t)||[""]).pop().replace(n,""),o:(g>0?"-":"+")+r(Math.floor(Math.abs(g)/60)*100+Math.abs(g)%60,4),S:["th","st","nd","rd"][f%10>3?0:(f%100-f%10!=10)*f%10]};return s.replace(e,function(e){return e in y?y[e]:e.slice(1,e.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"};dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]};Date.prototype.format=function(e,t){return dateFormat(this,e,t)}}typeof VMM!="undefined"&&typeof VMM.Util=="undefined"&&(VMM.Util={init:function(){return this},correctProtocol:function(e){var t=window.parent.location.protocol.toString(),n="",r=e.split("://",2);t.match("http")?n=t:n="https";return n+"://"+r[1]},mergeConfig:function(e,t){var n;for(n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e},getObjectAttributeByIndex:function(e,t){if(typeof e!="undefined"){var n=0;for(var r in e){if(t===n)return e[r];n++}return""}return""},ordinal:function(e){return["th","st","nd","rd"][!(e%10>3||Math.floor(e%100/10)==1)*(e%10)]},randomBetween:function(e,t){return Math.floor(Math.random()*(t-e+1)+e)},average:function(e){var t={mean:0,variance:0,deviation:0},n=e.length;for(var r,i=0,s=n;s--;i+=e[s]);for(r=t.mean=i/n,s=n,i=0;s--;i+=Math.pow(e[s]-r,2));return t.deviation=Math.sqrt(t.variance=i/n),t},customSort:function(e,t){var n=e,r=t;return n==r?0:n>r?1:-1},deDupeArray:function(e){var t,n=e.length,r=[],i={};for(t=0;t<n;t++)i[e[t]]=0;for(t in i)r.push(t);return r},number2money:function(e,t,n){var t=t!==null?t:!0,n=n!==null?n:!1,r=VMM.Math2.floatPrecision(e,2),i=this.niceNumber(r);!i.split(/\./g)[1]&&n&&(i+=".00");t&&(i="$"+i);return i},wordCount:function(e){var t=e+" ",n=/^[^A-Za-z0-9\'\-]+/gi,r=t.replace(n,""),i=/[^A-Za-z0-9\'\-]+/gi,s=r.replace(i," "),o=s.split(" "),u=o.length-1;t.length<2&&(u=0);return u},ratio:{fit:function(e,t,n,r){var i={width:0,height:0};i.width=e;i.height=Math.round(e/n*r);if(i.height>t){i.height=t;i.width=Math.round(t/r*n);i.width>e&&trace("FIT: DIDN'T FIT!!! ")}return i},r16_9:function(e,t){if(e!==null&&e!=="")return Math.round(t/16*9);if(t!==null&&t!=="")return Math.round(e/9*16)},r4_3:function(e,t){if(e!==null&&e!=="")return Math.round(t/4*3);if(t!==null&&t!=="")return Math.round(e/3*4)}},doubledigit:function(e){return(e<10?"0":"")+e},truncateWords:function(e,t,n){t||(t=30);n||(n=t);var r=/^[^A-Za-z0-9\'\-]+/gi,i=e.replace(r,""),s=i.split(" "),o=[];t=Math.min(s.length,t);n=Math.min(s.length,n);for(var u=0;u<t;u++)o.push(s[u]);for(var a=t;u<n;u++){var f=s[u];o.push(f);if(f.charAt(f.length-1)==".")break}return o.join(" ")},linkify:function(e,t,n){var r=/\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,i=/(^|[^\/])(www\.[\S]+(\b|$))/gim,s=/(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;return e.replace(r,"<a target='_blank' href='$&' onclick='void(0)'>$&</a>").replace(i,"$1<a target='_blank' onclick='void(0)' href='http://$2'>$2</a>").replace(s,"<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>")},linkify_with_twitter:function(e,t,n){function u(e){var t=/(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;return e.replace(t,"<a href='$1' target='_blank'>$3</a>")}var r=/\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,i=/(\()((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\))|(\[)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\])|(\{)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\})|(<|&(?:lt|#60|#x3c);)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(>|&(?:gt|#62|#x3e);)|((?:^|[^=\s'"\]])\s*['"]?|[^=\s]\s+)(\b(?:ht|f)tps?:\/\/[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]+(?:(?!&(?:gt|#0*62|#x0*3e);|&(?:amp|apos|quot|#0*3[49]|#x0*2[27]);[.!&',:?;]?(?:[^a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]|$))&[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]*)*[a-z0-9\-_~$()*+=\/#[\]@%])/img,s='$1$4$7$10$13<a href="$2$5$8$11$14" class="hyphenate">$2$5$8$11$14</a>$3$6$9$12',o=/(^|[^\/])(www\.[\S]+(\b|$))/gim,a=/(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim,f=/\B@([\w-]+)/gm,l=/(#([\w]+))/g;return e.replace(i,s).replace(o,"$1<a target='_blank' class='hyphenate' onclick='void(0)' href='http://$2'>$2</a>").replace(a,"<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>").replace(f,"<a href='http://twitter.com/$1' target='_blank' onclick='void(0)'>@$1</a>")},linkify_wikipedia:function(e){var t=/<i[^>]*>(.*?)<\/i>/gim;return e.replace(t,"<a target='_blank' href='http://en.wikipedia.org/wiki/$&' onclick='void(0)'>$&</a>").replace(/<i\b[^>]*>/gim,"").replace(/<\/i>/gim,"").replace(/<b\b[^>]*>/gim,"").replace(/<\/b>/gim,"")},unlinkify:function(e){if(!e)return e;e=e.replace(/<a\b[^>]*>/i,"");e=e.replace(/<\/a>/i,"");return e},untagify:function(e){if(!e)return e;e=e.replace(/<\s*\w.*?>/g,"");return e},nl2br:function(e){return e.replace(/(\r\n|[\r\n]|\\n|\\r)/g,"<br/>")},unique_ID:function(e){var t=function(e){return Math.floor(Math.random()*e)},n=function(){var e="abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";return e.substr(t(62),1)},r=function(e){var t="";for(var r=0;r<e;r++)t+=n();return t};return r(e)},isEven:function(e){return e%2===0?!0:!1},getUrlVars:function(e){var t=e.toString();t.match("&#038;")?t=t.replace("&#038;","&"):t.match("&#38;")?t=t.replace("&#38;","&"):t.match("&amp;")&&(t=t.replace("&amp;","&"));var n=[],r,i=t.slice(t.indexOf("?")+1).split("&");for(var s=0;s<i.length;s++){r=i[s].split("=");n.push(r[0]);n[r[0]]=r[1]}return n},toHTML:function(e){e=this.nl2br(e);e=this.linkify(e);return e.replace(/\s\s/g,"&nbsp;&nbsp;")},toCamelCase:function(e,t){t!==!1&&(t=!0);var n=(t?e.toLowerCase():e).split(" ");for(var r=0;r<n.length;r++)n[r]=n[r].substr(0,1).toUpperCase()+n[r].substr(1);return n.join(" ")},properQuotes:function(e){return e.replace(/\"([^\"]*)\"/gi,"&#8220;$1&#8221;")},niceNumber:function(e){e+="";x=e.split(".");x1=x[0];x2=x.length>1?"."+x[1]:"";var t=/(\d+)(\d{3})/;while(t.test(x1))x1=x1.replace(t,"$1,$2");return x1+x2},toTitleCase:function(e){if(VMM.Browser.browser=="Explorer"&&parseInt(VMM.Browser.version,10)>=7)return e.replace("_","%20");var t={__smallWords:["a","an","and","as","at","but","by","en","for","if","in","of","on","or","the","to","v[.]?","via","vs[.]?"],init:function(){this.__smallRE=this.__smallWords.join("|");this.__lowerCaseWordsRE=new RegExp("\\b("+this.__smallRE+")\\b","gi");this.__firstWordRE=new RegExp("^([^a-zA-Z0-9 \\r\\n\\t]*)("+this.__smallRE+")\\b","gi");this.__lastWordRE=new RegExp("\\b("+this.__smallRE+")([^a-zA-Z0-9 \\r\\n\\t]*)$","gi")},toTitleCase:function(e){var t="",n=e.split(/([:.;?!][ ]|(?:[ ]|^)["“])/);for(var r=0;r<n.length;++r){var i=n[r];i=i.replace(/\b([a-zA-Z][a-z.'’]*)\b/g,this.__titleCaseDottedWordReplacer);i=i.replace(this.__lowerCaseWordsRE,this.__lowerReplacer);i=i.replace(this.__firstWordRE,this.__firstToUpperCase);i=i.replace(this.__lastWordRE,this.__firstToUpperCase);t+=i}t=t.replace(/ V(s?)\. /g," v$1. ");t=t.replace(/(['’])S\b/g,"$1s");t=t.replace(/\b(AT&T|Q&A)\b/ig,this.__upperReplacer);return t},__titleCaseDottedWordReplacer:function(e){return e.match(/[a-zA-Z][.][a-zA-Z]/)?e:t.__firstToUpperCase(e)},__lowerReplacer:function(e){return e.toLowerCase()},__upperReplacer:function(e){return e.toUpperCase()},__firstToUpperCase:function(e){var t=e.split(/(^[^a-zA-Z0-9]*[a-zA-Z0-9])(.*)$/);t[1]&&(t[1]=t[1].toUpperCase());return t.join("")}};t.init();e=e.replace(/_/g," ");e=t.toTitleCase(e);return e}}.init());LazyLoad=function(e){function u(t,n){var r=e.createElement(t),i;for(i in n)n.hasOwnProperty(i)&&r.setAttribute(i,n[i]);return r}function a(e){var t=r[e],n,o;if(t){n=t.callback;o=t.urls;o.shift();i=0;if(!o.length){n&&n.call(t.context,t.obj);r[e]=null;s[e].length&&l(e)}}}function f(){var n=navigator.userAgent;t={async:e.createElement("script").async===!0};(t.webkit=/AppleWebKit\//.test(n))||(t.ie=/MSIE/.test(n))||(t.opera=/Opera/.test(n))||(t.gecko=/Gecko\//.test(n))||(t.unknown=!0)}function l(i,o,l,p,d){var v=function(){a(i)},m=i==="css",g=[],y,b,w,E,S,x;t||f();if(o){o=typeof o=="string"?[o]:o.concat();if(m||t.async||t.gecko||t.opera)s[i].push({urls:o,callback:l,obj:p,context:d});else for(y=0,b=o.length;y<b;++y)s[i].push({urls:[o[y]],callback:y===b-1?l:null,obj:p,context:d})}if(r[i]||!(E=r[i]=s[i].shift()))return;n||(n=e.head||e.getElementsByTagName("head")[0]);S=E.urls;for(y=0,b=S.length;y<b;++y){x=S[y];if(m)w=t.gecko?u("style"):u("link",{href:x,rel:"stylesheet"});else{w=u("script",{src:x});w.async=!1}w.className="lazyload";w.setAttribute("charset","utf-8");if(t.ie&&!m)w.onreadystatechange=function(){if(/loaded|complete/.test(w.readyState)){w.onreadystatechange=null;v()}};else if(m&&(t.gecko||t.webkit))if(t.webkit){E.urls[y]=w.href;h()}else{w.innerHTML='@import "'+x+'";';c(w)}else w.onload=w.onerror=v;g.push(w)}for(y=0,b=g.length;y<b;++y)n.appendChild(g[y])}function c(e){var t;try{t=!!e.sheet.cssRules}catch(n){i+=1;i<200?setTimeout(function(){c(e)},50):t&&a("css");return}a("css")}function h(){var e=r.css,t;if(e){t=o.length;while(--t>=0)if(o[t].href===e.urls[0]){a("css");break}i+=1;e&&(i<200?setTimeout(h,50):a("css"))}}var t,n,r={},i=0,s={css:[],js:[]},o=e.styleSheets;return{css:function(e,t,n,r){l("css",e,t,n,r)},js:function(e,t,n,r){l("js",e,t,n,r)}}}(this.document);LoadLib=function(e){function n(e){var n=0,r=!1;for(n=0;n<t.length;n++)t[n]==e&&(r=!0);if(r)return!0;t.push(e);return!1}var t=[];return{css:function(e,t,r,i){n(e)||LazyLoad.css(e,t,r,i)},js:function(e,t,r,i){n(e)||LazyLoad.js(e,t,r,i)}}}(this.document);typeof VMM!="undefined"&&typeof VMM.Language=="undefined"&&(VMM.Language={lang:"en",api:{wikipedia:"en"},date:{month:["January","February","March","April","May","June","July","August","September","October","November","December"],month_abbr:["Jan.","Feb.","March","April","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."],day:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],day_abbr:["Sun.","Mon.","Tues.","Wed.","Thurs.","Fri.","Sat."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'"
,full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"Loading Timeline... ",return_to_title:"Return to Title",expand_timeline:"Expand Timeline",contract_timeline:"Contract Timeline",wikipedia:"From Wikipedia, the free encyclopedia",loading_content:"Loading Content",loading:"Loading"}});typeof VMM!="undefined"&&typeof VMM.ExternalAPI=="undefined"&&(VMM.ExternalAPI={keys:{google:"",flickr:"",twitter:""},keys_master:{vp:"Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo",flickr:"RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ==",google:"jwNGnYw4hE9lmAez4ll0QD+jo6SKBJFknkopLS4FrSAuGfIwyj57AusuR0s8dAo=",twitter:""},init:function(){return this},setKeys:function(e){VMM.ExternalAPI.keys=e},pushQues:function(){VMM.master_config.googlemaps.active&&VMM.ExternalAPI.googlemaps.pushQue();VMM.master_config.youtube.active&&VMM.ExternalAPI.youtube.pushQue();VMM.master_config.soundcloud.active&&VMM.ExternalAPI.soundcloud.pushQue();VMM.master_config.googledocs.active&&VMM.ExternalAPI.googledocs.pushQue();VMM.master_config.googleplus.active&&VMM.ExternalAPI.googleplus.pushQue();VMM.master_config.wikipedia.active&&VMM.ExternalAPI.wikipedia.pushQue();VMM.master_config.vimeo.active&&VMM.ExternalAPI.vimeo.pushQue();VMM.master_config.vine.active&&VMM.ExternalAPI.vine.pushQue();VMM.master_config.twitter.active&&VMM.ExternalAPI.twitter.pushQue();VMM.master_config.flickr.active&&VMM.ExternalAPI.flickr.pushQue();VMM.master_config.webthumb.active&&VMM.ExternalAPI.webthumb.pushQue()},twitter:{tweetArray:[],get:function(e){var t={mid:e.id,id:e.uid};VMM.master_config.twitter.que.push(t);VMM.master_config.twitter.active=!0},create:function(e,t){var n=e.mid.toString(),r={twitterid:e.mid},i="http://api.twitter.com/1/statuses/show.json?id="+e.mid+"&include_entities=true&callback=?",s=setTimeout(VMM.ExternalAPI.twitter.errorTimeOut,VMM.master_config.timers.api,e),o=setTimeout(t,VMM.master_config.timers.api,e);VMM.getJSON(i,function(t){var n=t.id_str,r="<blockquote><p>",i=VMM.Util.linkify_with_twitter(t.text,"_blank");r+=i;r+="</p></blockquote>";typeof t.entities.media!="undefined"&&t.entities.media[0].type=="photo";r+="<div class='vcard author'>";r+="<a class='screen-name url' href='https://twitter.com/"+t.user.screen_name+"' data-screen-name='"+t.user.screen_name+"' target='_blank'>";r+="<span class='avatar'><img src=' "+t.user.profile_image_url+"'  alt=''></span>";r+="<span class='fn'>"+t.user.name+"</span>";r+="<span class='nickname'>@"+t.user.screen_name+"<span class='thumbnail-inline'></span></span>";r+="</a>";r+="</div>";VMM.attachElement("#"+e.id.toString(),r);VMM.attachElement("#text_thumb_"+e.id.toString(),t.text);VMM.attachElement("#marker_content_"+e.id.toString(),t.text)}).error(function(t,n,r){trace("TWITTER error");trace("TWITTER ERROR: "+n+" "+t.responseText);VMM.attachElement("#"+e.id,VMM.MediaElement.loadingmessage("ERROR LOADING TWEET "+e.mid))}).success(function(e){clearTimeout(s);clearTimeout(o);t()})},errorTimeOut:function(e){trace("TWITTER JSON ERROR TIMEOUT "+e.mid);VMM.attachElement("#"+e.id.toString(),VMM.MediaElement.loadingmessage("Still waiting on Twitter: "+e.mid));VMM.getJSON("http://api.twitter.com/1/account/rate_limit_status.json",function(t){trace("REMAINING TWITTER API CALLS "+t.remaining_hits);trace("TWITTER RATE LIMIT WILL RESET AT "+t.reset_time);var n="";if(t.remaining_hits==0){n="<p>You've reached the maximum number of tweets you can load in an hour.</p>";n+="<p>You can view tweets again starting at: <br/>"+t.reset_time+"</p>"}else n="<p>Still waiting on Twitter. "+e.mid+"</p>";VMM.attachElement("#"+e.id.toString(),VMM.MediaElement.loadingmessage(n))})},pushQue:function(){if(VMM.master_config.twitter.que.length>0){VMM.ExternalAPI.twitter.create(VMM.master_config.twitter.que[0],VMM.ExternalAPI.twitter.pushQue);VMM.master_config.twitter.que.remove(0)}},getHTML:function(e){var t="http://api.twitter.com/1/statuses/oembed.json?id="+e+"&callback=?";VMM.getJSON(t,VMM.ExternalAPI.twitter.onJSONLoaded)},onJSONLoaded:function(e){trace("TWITTER JSON LOADED");var t=e.id;VMM.attachElement("#"+t,VMM.Util.linkify_with_twitter(e.html))},parseTwitterDate:function(e){var t=new Date(Date.parse(e));return t},prettyParseTwitterDate:function(e){var t=new Date(Date.parse(e));return VMM.Date.prettyDate(t,!0)},getTweets:function(e){var t=[],n=e.length;for(var r=0;r<e.length;r++){var i="";e[r].tweet.match("status/")?i=e[r].tweet.split("status/")[1]:e[r].tweet.match("statuses/")?i=e[r].tweet.split("statuses/")[1]:i="";var s="http://api.twitter.com/1/statuses/show.json?id="+i+"&include_entities=true&callback=?";VMM.getJSON(s,function(e){var r={},i="<div class='twitter'><blockquote><p>",s=VMM.Util.linkify_with_twitter(e.text,"_blank");i+=s;i+="</p>";i+="— "+e.user.name+" (<a href='https://twitter.com/"+e.user.screen_name+"'>@"+e.user.screen_name+"</a>) <a href='https://twitter.com/"+e.user.screen_name+"/status/"+e.id+"'>"+VMM.ExternalAPI.twitter.prettyParseTwitterDate(e.created_at)+" </a></blockquote></div>";r.content=i;r.raw=e;t.push(r);if(t.length==n){var o={tweetdata:t};VMM.fireEvent(global,"TWEETSLOADED",o)}}).success(function(){trace("second success")}).error(function(){trace("error")}).complete(function(){trace("complete")})}},getTweetSearch:function(e,t){var n=40;t!=null&&t!=""&&(n=t);var r="http://search.twitter.com/search.json?q="+e+"&rpp="+n+"&include_entities=true&result_type=mixed",i=[];VMM.getJSON(r,function(e){for(var t=0;t<e.results.length;t++){var n={},r="<div class='twitter'><blockquote><p>",s=VMM.Util.linkify_with_twitter(e.results[t].text,"_blank");r+=s;r+="</p>";r+="— "+e.results[t].from_user_name+" (<a href='https://twitter.com/"+e.results[t].from_user+"'>@"+e.results[t].from_user+"</a>) <a href='https://twitter.com/"+e.results[t].from_user+"/status/"+e.id+"'>"+VMM.ExternalAPI.twitter.prettyParseTwitterDate(e.results[t].created_at)+" </a></blockquote></div>";n.content=r;n.raw=e.results[t];i.push(n)}var o={tweetdata:i};VMM.fireEvent(global,"TWEETSLOADED",o)})},prettyHTML:function(e,t){var e=e.toString(),n={twitterid:e},r="http://api.twitter.com/1/statuses/show.json?id="+e+"&include_entities=true&callback=?",i=setTimeout(VMM.ExternalAPI.twitter.errorTimeOut,VMM.master_config.timers.api,e);VMM.getJSON(r,VMM.ExternalAPI.twitter.formatJSON).error(function(t,n,r){trace("TWITTER error");trace("TWITTER ERROR: "+n+" "+t.responseText);VMM.attachElement("#twitter_"+e,"<p>ERROR LOADING TWEET "+e+"</p>")}).success(function(e){clearTimeout(i);t&&VMM.ExternalAPI.twitter.secondaryMedia(e)})},formatJSON:function(e){var t=e.id_str,n="<blockquote><p>",r=VMM.Util.linkify_with_twitter(e.text,"_blank");n+=r;n+="</p></blockquote>";n+="<div class='vcard author'>";n+="<a class='screen-name url' href='https://twitter.com/"+e.user.screen_name+"' data-screen-name='"+e.user.screen_name+"' target='_blank'>";n+="<span class='avatar'><img src=' "+e.user.profile_image_url+"'  alt=''></span>";n+="<span class='fn'>"+e.user.name+"</span>";n+="<span class='nickname'>@"+e.user.screen_name+"<span class='thumbnail-inline'></span></span>";n+="</a>";n+="</div>";typeof e.entities.media!="undefined"&&e.entities.media[0].type=="photo"&&(n+="<img src=' "+e.entities.media[0].media_url+"'  alt=''>");VMM.attachElement("#twitter_"+t.toString(),n);VMM.attachElement("#text_thumb_"+t.toString(),e.text)}},googlemaps:{maptype:"toner",setMapType:function(e){e!=""&&(VMM.ExternalAPI.googlemaps.maptype=e)},get:function(e){var t,n,r;e.vars=VMM.Util.getUrlVars(e.id);VMM.ExternalAPI.keys.google!=""?n=VMM.ExternalAPI.keys.google:n=Aes.Ctr.decrypt(VMM.ExternalAPI.keys_master.google,VMM.ExternalAPI.keys_master.vp,256);r="http://maps.googleapis.com/maps/api/js?key="+n+"&libraries=places&sensor=false&callback=VMM.ExternalAPI.googlemaps.onMapAPIReady";if(VMM.master_config.googlemaps.active)VMM.master_config.googlemaps.que.push(e);else{VMM.master_config.googlemaps.que.push(e);VMM.master_config.googlemaps.api_loaded||LoadLib.js(r,function(){trace("Google Maps API Library Loaded")})}},create:function(e){VMM.ExternalAPI.googlemaps.createAPIMap(e)},createiFrameMap:function(e){var t=e.id+"&output=embed",n="",r=e.uid.toString()+"_gmap";n+="<div class='google-map' id='"+r+"' style='width=100%;height=100%;'>";n+="<iframe width='100%' height='100%' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='"+t+"'></iframe>";n+="</div>";VMM.attachElement("#"+e.uid,n)},createAPIMap:function(e){function d(e){if(e in VMM.ExternalAPI.googlemaps.map_providers){t=VMM.ExternalAPI.googlemaps.map_attribution[VMM.ExternalAPI.googlemaps.map_providers[e].attribution];return VMM.ExternalAPI.googlemaps.map_providers[e]}if(VMM.ExternalAPI.googlemaps.defaultType(e)){trace("GOOGLE MAP DEFAULT TYPE");return google.maps.MapTypeId[e.toUpperCase()]}trace("Not a maptype: "+e)}function v(){var t=new google.maps.Geocoder,n=VMM.Util.getUrlVars(e.id).q,i;if(n.match("loc:")){var s=n.split(":")[1].split("+");u=new google.maps.LatLng(parseFloat(s[0]),parseFloat(s[1]));l=!0}t.geocode({address:n},function(e,t){if(t==google.maps.GeocoderStatus.OK){i=new google.maps.Marker({map:r,position:e[0].geometry.location});typeof e[0].geometry.viewport!="undefined"?r.fitBounds(e[0].geometry.viewport):typeof e[0].geometry.bounds!="undefined"?r.fitBounds(e[0].geometry.bounds):r.setCenter(e[0].geometry.location);l&&r.panTo(u);c&&r.setZoom(f)}else{trace("Geocode for "+n+" was not successful for the following reason: "+t);trace("TRYING PLACES SEARCH");l&&r.panTo(u);c&&r.setZoom(f);m()}})}function m(){function h(t,i){if(i==google.maps.places.PlacesServiceStatus.OK){for(var s=0;s<t.length;s++);if(l)r.panTo(u);else if(t.length>=1){r.panTo(t[0].geometry.location);c&&r.setZoom(f)}}else{trace("Place search for "+n.query+" was not successful for the following reason: "+i);trace("YOU MAY NEED A GOOGLE MAPS API KEY IN ORDER TO USE THIS FEATURE OF TIMELINEJS");trace("FIND OUT HOW TO GET YOUR KEY HERE: https://developers.google.com/places/documentation/#Authentication");if(l){r.panTo(u);c&&r.setZoom(f)}else{trace("USING SIMPLE IFRAME MAP EMBED");e.id[0].match("https")&&(e.id=e.url[0].replace("https","http"));VMM.ExternalAPI.googlemaps.createiFrameMap(e)}}}function p(e){var t,n;n=e.geometry.location;t=new google.maps.Marker({map:r,position:e.geometry.location});google.maps.event.addListener(t,"click",function(){i.setContent(e.name);i.open(r,this)})}var t,n,i,s,o,a;place_search=new google.maps.places.PlacesService(r);i=new google.maps.InfoWindow;n={query:"",types:["country","neighborhood","political","locality","geocode"]};type.of(VMM.Util.getUrlVars(e.id)["q"])=="string"&&(n.query=VMM.Util.getUrlVars(e.id).q);if(l){n.location=u;n.radius="15000"}else{o=new google.maps.LatLng(-89.999999,-179.999999);a=new google.maps.LatLng(89.999999,179.999999);s=new google.maps.LatLngBounds(o,a)}place_search.textSearch(n,h)}function g(){var t,n,i=!1;trace("LOADING PLACES API FOR GOOGLE MAPS");if(VMM.ExternalAPI.keys.google!=""){t=VMM.ExternalAPI.keys.google;i=!0}else{trace("YOU NEED A GOOGLE MAPS API KEY IN ORDER TO USE THIS FEATURE OF TIMELINEJS");trace("FIND OUT HOW TO GET YOUR KEY HERE: https://developers.google.com/places/documentation/#Authentication")}n="https://maps.googleapis.com/maps/api/place/textsearch/json?key="+t+"&sensor=false&language="+e.lang+"&";type.of(VMM.Util.getUrlVars(e.id)["q"])=="string"&&(n+="query="+VMM.Util.getUrlVars(e.id).q);l&&(n+="&location="+u);if(i)VMM.getJSON(n,function(t){trace("PLACES JSON");var n="",i="",s="",o="";trace(t);if(t.status=="OVER_QUERY_LIMIT"){trace("OVER_QUERY_LIMIT");if(l){r.panTo(u);c&&r.setZoom(f)}else{trace("DOING TRADITIONAL MAP IFRAME EMBED UNTIL QUERY LIMIT RESTORED");h=!0;VMM.ExternalAPI.googlemaps.createiFrameMap(e)}}else{if(t.results.length>=1){s=new google.maps.LatLng(parseFloat(t.results[0].geometry.viewport.northeast.lat),parseFloat(t.results[0].geometry.viewport.northeast.lng));o=new google.maps.LatLng(parseFloat(t.results[0].geometry.viewport.southwest.lat),parseFloat(t.results[0].geometry.viewport.southwest.lng));i=new google.maps.LatLngBounds(o,s);r.fitBounds(i)}else trace("NO RESULTS");l&&r.panTo(u);c&&r.setZoom(f)}}).error(function(e,t,n){trace("PLACES JSON ERROR");trace("PLACES JSON ERROR: "+t+" "+e.responseText)}).success(function(e){trace("PLACES JSON SUCCESS")});else if(l){r.panTo(u);c&&r.setZoom(f)}else{trace("DOING TRADITIONAL MAP IFRAME EMBED BECAUSE NO GOOGLE MAP API KEY WAS PROVIDED");VMM.ExternalAPI.googlemaps.createiFrameMap(e)}}function y(){var t,n,i,s;t=e.id+"&output=kml";t=t.replace("&output=embed","");n=new google.maps.KmlLayer(t,{preserveViewport:!0});i=new google.maps.InfoWindow;n.setMap(r);google.maps.event.addListenerOnce(n,"defaultviewport_changed",function(){l?r.panTo(u):r.fitBounds(n.getDefaultViewport());c&&r.setZoom(f)});google.maps.event.addListener(n,"click",function(e){function t(e){i.setContent(e);i.open(r)}s=e.featureData.description;t(s)})}var t="",n,r,i,s=e.uid.toString()+"_gmap",o="",u=new google.maps.LatLng(41.875696,-87.624207),a,f=11,l=!1,c=!1,h=!1,p;google.maps.VeriteMapType=function(e){if(VMM.ExternalAPI.googlemaps.defaultType(e))return google.maps.MapTypeId[e.toUpperCase()];var t=d(e);return google.maps.ImageMapType.call(this,{getTileUrl:function(e,n){var r=(n+e.x+e.y)%VMM.ExternalAPI.googlemaps.map_subdomains.length;return[t.url.replace("{S}",VMM.ExternalAPI.googlemaps.map_subdomains[r]).replace("{Z}",n).replace("{X}",e.x).replace("{Y}",e.y).replace("{z}",n).replace("{x}",e.x).replace("{y}",e.y)]},tileSize:new google.maps.Size(256,256),name:e,minZoom:t.minZoom,maxZoom:t.maxZoom})};google.maps.VeriteMapType.prototype=new google.maps.ImageMapType("_");VMM.ExternalAPI.googlemaps.maptype!=""?VMM.ExternalAPI.googlemaps.defaultType(VMM.ExternalAPI.googlemaps.maptype)?n=google.maps.MapTypeId[VMM.ExternalAPI.googlemaps.maptype.toUpperCase()]:n=VMM.ExternalAPI.googlemaps.maptype:n="toner";if(type.of(VMM.Util.getUrlVars(e.id)["ll"])=="string"){l=!0;a=VMM.Util.getUrlVars(e.id).ll.split(",");u=new google.maps.LatLng(parseFloat(a[0]),parseFloat(a[1]))}else if(type.of(VMM.Util.getUrlVars(e.id)["sll"])=="string"){a=VMM.Util.getUrlVars(e.id).sll.split(",");u=new google.maps.LatLng(parseFloat(a[0]),parseFloat(a[1]))}if(type.of(VMM.Util.getUrlVars(e.id)["z"])=="string"){c=!0;f=parseFloat(VMM.Util.getUrlVars(e.id).z)}i={zoom:f,draggable:!1,disableDefaultUI:!0,mapTypeControl:!1,zoomControl:!0,zoomControlOptions:{style:google.maps.ZoomControlStyle.SMALL,position:google.maps.ControlPosition.TOP_RIGHT},center:u,mapTypeId:n,mapTypeControlOptions:{mapTypeIds:[n]}};VMM.attachElement("#"+e.uid,"<div class='google-map' id='"+s+"' style='width=100%;height=100%;'></div>");r=new google.maps.Map(document.getElementById(s),i);if(!VMM.ExternalAPI.googlemaps.defaultType(VMM.ExternalAPI.googlemaps.maptype)){r.mapTypes.set(n,new google.maps.VeriteMapType(n));o="<div class='map-attribution'><div class='attribution-text'>"+t+"</div></div>";VMM.appendElement("#"+s,o)}type.of(VMM.Util.getUrlVars(e.id)["msid"])=="string"?y():type.of(VMM.Util.getUrlVars(e.id)["q"])=="string"&&v()},pushQue:function(){for(var e=0;e<VMM.master_config.googlemaps.que.length;e++)VMM.ExternalAPI.googlemaps.create(VMM.master_config.googlemaps.que[e]);VMM.master_config.googlemaps.que=[]},onMapAPIReady:function(){VMM.master_config.googlemaps.map_active=!0;VMM.master_config.googlemaps.places_active=!0;VMM.ExternalAPI.googlemaps.onAPIReady()},onPlacesAPIReady:function(){VMM.master_config.googlemaps.places_active=!0;VMM.ExternalAPI.googlemaps.onAPIReady()},onAPIReady:function(){if(!VMM.master_config.googlemaps.active&&VMM.master_config.googlemaps.map_active&&VMM.master_config.googlemaps.places_active){VMM.master_config.googlemaps.active=!0;VMM.ExternalAPI.googlemaps.pushQue()}},defaultType:function(e){return e.toLowerCase()=="satellite"||e.toLowerCase()=="hybrid"||e.toLowerCase()=="terrain"||e.toLowerCase()=="roadmap"?!0:!1},map_subdomains:["","a.","b.","c.","d."],map_attribution:{stamen:"Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>.",apple:"Map data &copy; 2012  Apple, Imagery &copy; 2012 Apple"},map_providers:{toner:{url:"http://{S}tile.stamen.com/toner/{Z}/{X}/{Y}.png",minZoom:0,maxZoom:20,attribution:"stamen"},"toner-lines":{url:"http://{S}tile.stamen.com/toner-lines/{Z}/{X}/{Y}.png",minZoom:0,maxZoom:20,attribution:"stamen"},"toner-labels":{url:"http://{S}tile.stamen.com/toner-labels/{Z}/{X}/{Y}.png",minZoom:0,maxZoom:20,attribution:"stamen"},sterrain:{url:"http://{S}tile.stamen.com/terrain/{Z}/{X}/{Y}.jpg",minZoom:4,maxZoom:20,attribution:"stamen"},apple:{url:"http://gsp2.apple.com/tile?api=1&style=slideshow&layers=default&lang=en_US&z={z}&x={x}&y={y}&v=9",minZoom:4,maxZoom:14,attribution:"apple"},watercolor:{url:"http://{S}tile.stamen.com/watercolor/{Z}/{X}/{Y}.jpg",minZoom:3,maxZoom:16,attribution:"stamen"}}},googleplus:{get:function(e){var t,n={user:e.user,activity:e.id,id:e.uid};VMM.master_config.googleplus.que.push(n);VMM.master_config.googleplus.active=!0},create:function(e,t){var n="",r="",i="",s="",o="",u,a;googleplus_timeout=setTimeout(VMM.ExternalAPI.googleplus.errorTimeOut,VMM.master_config.timers.api,e),callback_timeout=setTimeout(t,VMM.master_config.timers.api,e);VMM.master_config.Timeline.api_keys.google!=""?r=VMM.master_config.Timeline.api_keys.google:r=Aes.Ctr.decrypt(VMM.master_config.api_keys_master.google,VMM.master_config.vp,256);u="https://www.googleapis.com/plus/v1/people/"+e.user+"/activities/public?alt=json&maxResults=100&fields=items(id,url)&key="+r;n="GOOGLE PLUS API CALL";VMM.getJSON(u,function(t){for(var u=0;u<t.items.length;u++){trace("loop");if(t.items[u].url.split("posts/")[1]==e.activity){trace("FOUND IT!!");i=t.items[u].id;a="https://www.googleapis.com/plus/v1/activities/"+i+"?alt=json&key="+r;VMM.getJSON(a,function(t){trace(t);if(typeof t.annotation!="undefined"){s+="<div class='googleplus-annotation'>'"+t.annotation+"</div>";s+=t.object.content}else s+=t.object.content;if(typeof t.object.attachments!="undefined"){for(var r=0;r<t.object.attachments.length;r++){if(t.object.attachments[r].objectType=="photo")o="<a href='"+t.object.url+"' target='_blank'>"+"<img src='"+t.object.attachments[r].image.url+"' class='article-thumb'></a>"+o;else if(t.object.attachments[r].objectType=="video"){o="<img src='"+t.object.attachments[r].image.url+"' class='article-thumb'>"+o;o+="<div>";o+="<a href='"+t.object.attachments[r].url+"' target='_blank'>";o+="<h5>"+t.object.attachments[r].displayName+"</h5>";o+="</a>";o+="</div>"}else if(t.object.attachments[r].objectType=="article"){o+="<div>";o+="<a href='"+t.object.attachments[r].url+"' target='_blank'>";o+="<h5>"+t.object.attachments[r].displayName+"</h5>";o+="<p>"+t.object.attachments[r].content+"</p>";o+="</a>";o+="</div>"}trace(t.object.attachments[r])}o="<div class='googleplus-attachments'>"+o+"</div>"}n="<div class='googleplus-content'>"+s+o+"</div>";n+="<div class='vcard author'><a class='screen-name url' href='"+t.url+"' target='_blank'>";n+="<span class='avatar'><img src='"+t.actor.image.url+"' style='max-width: 32px; max-height: 32px;'></span>";n+="<span class='fn'>"+t.actor.displayName+"</span>";n+="<span class='nickname'><span class='thumbnail-inline'></span></span>";n+="</a></div>";VMM.attachElement("#googleplus_"+e.activity,n)});break}}}).error(function(t,n,r){var i=VMM.parseJSON(t.responseText);trace(i.error.message);VMM.attachElement("#googleplus_"+e.activity,VMM.MediaElement.loadingmessage("<p>ERROR LOADING GOOGLE+ </p><p>"+i.error.message+"</p>"))}).success(function(e){clearTimeout(googleplus_timeout);clearTimeout(callback_timeout);t()})},pushQue:function(){if(VMM.master_config.googleplus.que.length>0){VMM.ExternalAPI.googleplus.create(VMM.master_config.googleplus.que[0],VMM.ExternalAPI.googleplus.pushQue);VMM.master_config.googleplus.que.remove(0)}},errorTimeOut:function(e){trace("GOOGLE+ JSON ERROR TIMEOUT "+e.activity);VMM.attachElement("#googleplus_"+e.activity,VMM.MediaElement.loadingmessage("<p>Still waiting on GOOGLE+ </p><p>"+e.activity+"</p>"))}},googledocs:{get:function(e){VMM.master_config.googledocs.que.push(e);VMM.master_config.googledocs.active=!0},create:function(e){var t="";e.id.match(/docs.google.com/i)?t="<iframe class='doc' frameborder='0' width='100%' height='100%' src='"+e.id+"&amp;embedded=true'></iframe>":t="<iframe class='doc' frameborder='0' width='100%' height='100%' src='http://docs.google.com/viewer?url="+e.id+"&amp;embedded=true'></iframe>";VMM.attachElement("#"+e.uid,t)},pushQue:function(){for(var e=0;e<VMM.master_config.googledocs.que.length;e++)VMM.ExternalAPI.googledocs.create(VMM.master_config.googledocs.que[e]);VMM.master_config.googledocs.que=[]}},flickr:{get:function(e){VMM.master_config.flickr.que.push(e);VMM.master_config.flickr.active=!0},create:function(e,t){var n,r=setTimeout(t,VMM.master_config.timers.api,e);typeof VMM.master_config.Timeline!="undefined"&&VMM.master_config.Timeline.api_keys.flickr!=""?n=VMM.master_config.Timeline.api_keys.flickr:n=Aes.Ctr.decrypt(VMM.master_config.api_keys_master.flickr,VMM.master_config.vp,256);var i="http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+n+"&photo_id="+e.id+"&format=json&jsoncallback=?";VMM.getJSON(i,function(t){var n=t.sizes.size[0].url.split("photos/")[1].split("/")[1],r="#"+e.uid,i="#"+e.uid+"_thumb",s,o,u=!1,a="Large";a=VMM.ExternalAPI.flickr.sizes(VMM.master_config.sizes.api.height);for(var f=0;f<t.sizes.size.length;f++)if(t.sizes.size[f].label==a){u=!0;s=t.sizes.size[f].source}u||(s=t.sizes.size[t.sizes.size.length-2].source);o=t.sizes.size[0].source;VMM.Lib.attr(r,"src",s);VMM.attachElement(i,"<img src='"+o+"'>")}).error(function(e,t,n){trace("FLICKR error");trace("FLICKR ERROR: "+t+" "+e.responseText)}).success(function(e){clearTimeout(r);t()})},pushQue:function(){if(VMM.master_config.flickr.que.length>0){VMM.ExternalAPI.flickr.create(VMM.master_config.flickr.que[0],VMM.ExternalAPI.flickr.pushQue);VMM.master_config.flickr.que.remove(0)}},sizes:function(e){var t="";e<=75?t="Thumbnail":e<=180?t="Small":e<=240?t="Small 320":e<=375?t="Medium":e<=480?t="Medium 640":e<=600?t="Large":t="Large";return t}},instagram:{get:function(e,t){return t?"http://instagr.am/p/"+e.id+"/media/?size=t":"http://instagr.am/p/"+e.id+"/media/?size="+VMM.ExternalAPI.instagram.sizes(VMM.master_config.sizes.api.height)},sizes:function(e){var t="";e<=150?t="t":e<=306?t="m":t="l";return t}},soundcloud:{get:function(e){VMM.master_config.soundcloud.que.push(e);VMM.master_config.soundcloud.active=!0},create:function(e,t){var n="http://soundcloud.com/oembed?url="+e.id+"&format=js&callback=?";VMM.getJSON(n,function(n){VMM.attachElement("#"+e.uid,n.html);t()})},pushQue:function(){if(VMM.master_config.soundcloud.que.length>0){VMM.ExternalAPI.soundcloud.create(VMM.master_config.soundcloud.que[0],VMM.ExternalAPI.soundcloud.pushQue);VMM.master_config.soundcloud.que.remove(0)}}},wikipedia:{get:function(e){VMM.master_config.wikipedia.que.push(e);VMM.master_config.wikipedia.active=!0},create:function(e,t){var n="http://"+e.lang+".wikipedia.org/w/api.php?action=query&prop=extracts&redirects=&titles="+e.id+"&exintro=1&format=json&callback=?";callback_timeout=setTimeout(t,VMM.master_config.timers.api,e);if(VMM.Browser.browser=="Explorer"&&parseInt(VMM.Browser.version,10)>=7&&window.XDomainRequest){var r="<h4><a href='http://"+VMM.master_config.language.api.wikipedia+".wikipedia.org/wiki/"+e.id+"' target='_blank'>"+e.url+"</a></h4>";r+="<span class='wiki-source'>"+VMM.master_config.language.messages.wikipedia+"</span>";r+="<p>Wikipedia entry unable to load using Internet Explorer 8 or below.</p>";VMM.attachElement("#"+e.uid,r)}VMM.getJSON(n,function(t){if(t.query){var n,r,i="",s="",o=1,u=[];n=VMM.Util.getObjectAttributeByIndex(t.query.pages,0).extract;r=VMM.Util.getObjectAttributeByIndex(t.query.pages,0).title;n.match("<p>")?u=n.split("<p>"):u.push(n);for(var a=0;a<u.length;a++)a+1<=o&&a+1<u.length&&(s+="<p>"+u[a+1]);i="<h4><a href='http://"+VMM.master_config.language.api.wikipedia+".wikipedia.org/wiki/"+r+"' target='_blank'>"+r+"</a></h4>";i+="<span class='wiki-source'>"+VMM.master_config.language.messages.wikipedia+"</span>";i+=VMM.Util.linkify_wikipedia(s);n.match("REDIRECT")||VMM.attachElement("#"+e.uid,i)}}).error(function(n,r,i){trace("WIKIPEDIA error");trace("WIKIPEDIA ERROR: "+r+" "+n.responseText);trace(i);VMM.attachElement("#"+e.uid,VMM.MediaElement.loadingmessage("<p>Wikipedia is not responding</p>"));clearTimeout(callback_timeout);if(VMM.master_config.wikipedia.tries<4){trace("WIKIPEDIA ATTEMPT "+VMM.master_config.wikipedia.tries);trace(e);VMM.master_config.wikipedia.tries++;VMM.ExternalAPI.wikipedia.create(e,t)}else t()}).success(function(e){VMM.master_config.wikipedia.tries=0;clearTimeout(callback_timeout);t()})},pushQue:function(){if(VMM.master_config.wikipedia.que.length>0){trace("WIKIPEDIA PUSH QUE "+VMM.master_config.wikipedia.que.length);VMM.ExternalAPI.wikipedia.create(VMM.master_config.wikipedia.que[0],VMM.ExternalAPI.wikipedia.pushQue);VMM.master_config.wikipedia.que.remove(0)}}},youtube:{get:function(e){var t="http://gdata.youtube.com/feeds/api/videos/"+e.id+"?v=2&alt=jsonc&callback=?";VMM.master_config.youtube.que.push(e);VMM.master_config.youtube.active||VMM.master_config.youtube.api_loaded||LoadLib.js("http://www.youtube.com/player_api",function(){trace("YouTube API Library Loaded")});VMM.getJSON(t,function(t){VMM.ExternalAPI.youtube.createThumb(t,e)})},create:function(e){if(typeof e.start!="undefined"){var t=e.start.toString(),n=0,r=0;if(t.match("m")){n=parseInt(t.split("m")[0],10);r=parseInt(t.split("m")[1].split("s")[0],10);e.start=n*60+r}else e.start=0}else e.start=0;var i={active:!1,player:{},name:e.uid,playing:!1,hd:!1};typeof e.hd!="undefined"&&(i.hd=!0);i.player[e.id]=new YT.Player(e.uid,{height:"390",width:"640",playerVars:{enablejsapi:1,color:"white",showinfo:0,theme:"light",start:e.start,rel:0},videoId:e.id,events:{onReady:VMM.ExternalAPI.youtube.onPlayerReady,onStateChange:VMM.ExternalAPI.youtube.onStateChange}});VMM.master_config.youtube.array.push(i)},createThumb:function(e,t){trace("CREATE THUMB");trace(e);trace(t);if(typeof e.data!="undefined"){var n="#"+t.uid+"_thumb";VMM.attachElement(n,"<img src='"+e.data.thumbnail.sqDefault+"'>")}},pushQue:function(){for(var e=0;e<VMM.master_config.youtube.que.length;e++)VMM.ExternalAPI.youtube.create(VMM.master_config.youtube.que[e]);VMM.master_config.youtube.que=[]},onAPIReady:function(){VMM.master_config.youtube.active=!0;VMM.ExternalAPI.youtube.pushQue()},stopPlayers:function(){for(var e=0;e<VMM.master_config.youtube.array.length;e++)if(VMM.master_config.youtube.array[e].playing){var t=VMM.master_config.youtube.array[e].name;VMM.master_config.youtube.array[e].player[t].stopVideo()}},onStateChange:function(e){for(var t=0;t<VMM.master_config.youtube.array.length;t++){var n=VMM.master_config.youtube.array[t].name;if(VMM.master_config.youtube.array[t].player[n]==e.target&&e.data==YT.PlayerState.PLAYING){VMM.master_config.youtube.array[t].playing=!0;trace(VMM.master_config.youtube.array[t].hd);VMM.master_config.youtube.array[t].hd}}},onPlayerReady:function(e){}},vimeo:{get:function(e){VMM.master_config.vimeo.que.push(e);VMM.master_config.vimeo.active=!0},create:function(e,t){trace("VIMEO CREATE");var n="http://vimeo.com/api/v2/video/"+e.id+".json",r="http://player.vimeo.com/video/"+e.id+"?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff";VMM.getJSON(n,function(n){VMM.ExternalAPI.vimeo.createThumb(n,e);t()});VMM.attachElement("#"+e.uid,"<iframe autostart='false' frameborder='0' width='100%' height='100%' src='"+r+"'></iframe>")},createThumb:function(e,t){trace("VIMEO CREATE THUMB");var n="#"+t.uid+"_thumb";VMM.attachElement(n,"<img src='"+e[0].thumbnail_small+"'>")},pushQue:function(){if(VMM.master_config.vimeo.que.length>0){VMM.ExternalAPI.vimeo.create(VMM.master_config.vimeo.que[0],VMM.ExternalAPI.vimeo.pushQue);VMM.master_config.vimeo.que.remove(0)}}},vine:{get:function(e){VMM.master_config.vine.que.push(e);VMM.master_config.vine.active=!0},create:function(e,t){trace("VINE CREATE");var n="https://vine.co/v/"+e.id+"/embed/simple";VMM.attachElement("#"+e.uid,"<iframe frameborder='0' width='100%' height='100%' src='"+n+"'></iframe><script async src='http://platform.vine.co/static/scripts/embed.js' charset='utf-8'></script>")},pushQue:function(){if(VMM.master_config.vine.que.length>0){VMM.ExternalAPI.vine.create(VMM.master_config.vine.que[0],VMM.ExternalAPI.vine.pushQue);VMM.master_config.vine.que.remove(0)}}},webthumb:{get:function(e,t){VMM.master_config.webthumb.que.push(e);VMM.master_config.webthumb.active=!0},sizes:function(e){var t="";e<=150?t="t":e<=306?t="m":t="l";return t},create:function(e){trace("WEB THUMB CREATE");var t="http://free.pagepeeker.com/v2/thumbs.php?";url=e.id.replace("http://","");VMM.attachElement("#"+e.uid,"<a href='"+e.id+"' target='_blank'><img src='"+t+"size=x&url="+url+"'></a>");VMM.attachElement("#"+e.uid+"_thumb","<img src='"+t+"size=t&url="+url+"'>")},pushQue:function(){for(var e=0;e<VMM.master_config.webthumb.que.length;e++)VMM.ExternalAPI.webthumb.create(VMM.master_config.webthumb.que[e]);VMM.master_config.webthumb.que=[]}}}.init());typeof VMM!="undefined"&&typeof VMM.MediaElement=="undefined"&&(VMM.MediaElement={init:function(){return this},loadingmessage:function(e){return"<div class='vco-loading'><div class='vco-loading-container'><div class='vco-loading-icon'></div><div class='vco-message'><p>"+e+"</p></div></div></div>"},thumbnail:function(e,t,n,r){var i=16,s=24,o="";t!=null&&t!=""&&(i=t);n!=null&&n!=""&&(s=n);r!=null&&r!=""&&(o=r);if(e.media!=null&&e.media!=""){var u=!0,a="",f=VMM.MediaType(e.media);if(e.thumbnail!=null&&e.thumbnail!=""){trace("CUSTOM THUMB");a="<div class='thumbnail thumb-custom' id='"+r+"_custom_thumb'><img src='"+e.thumbnail+"'></div>";return a}if(f.type=="image"){a="<div class='thumbnail thumb-photo'></div>";return a}if(f.type=="flickr"){a="<div class='thumbnail thumb-photo' id='"+r+"_thumb'></div>";return a}if(f.type=="instagram"){a="<div class='thumbnail thumb-instagram' id='"+r+"_thumb'><img src='"+VMM.ExternalAPI.instagram.get(f.id,!0)+"'></div>";return a}if(f.type=="youtube"){a="<div class='thumbnail thumb-youtube' id='"+r+"_thumb'></div>";return a}if(f.type=="googledoc"){a="<div class='thumbnail thumb-document'></div>";return a}if(f.type=="vimeo"){a="<div class='thumbnail thumb-vimeo' id='"+r+"_thumb'></div>";return a}if(f.type=="vine"){a="<div class='thumbnail thumb-vine'></div>";return a}if(f.type=="dailymotion"){a="<div class='thumbnail thumb-video'></div>";return a}if(f.type=="twitter"){a="<div class='thumbnail thumb-twitter'></div>";return a}if(f.type=="twitter-ready"){a="<div class='thumbnail thumb-twitter'></div>";return a}if(f.type=="soundcloud"){a="<div class='thumbnail thumb-audio'></div>";return a}if(f.type=="google-map"){a="<div class='thumbnail thumb-map'></div>";return a}if(f.type=="googleplus"){a="<div class='thumbnail thumb-googleplus'></div>";return a}if(f.type=="wikipedia"){a="<div class='thumbnail thumb-wikipedia'></div>";return a}if(f.type=="storify"){a="<div class='thumbnail thumb-storify'></div>";return a}if(f.type=="quote"){a="<div class='thumbnail thumb-quote'></div>";return a}if(f.type=="iframe"){a="<div class='thumbnail thumb-video'></div>";return a}if(f.type=="unknown"){f.id.match("blockquote")?a="<div class='thumbnail thumb-quote'></div>":a="<div class='thumbnail thumb-plaintext'></div>";return a}if(f.type=="website"){a="<div class='thumbnail thumb-website' id='"+r+"_thumb'></div>";return a}a="<div class='thumbnail thumb-plaintext'></div>";return a}},create:function(e,t){var n=!1,r=VMM.MediaElement.loadingmessage(VMM.master_config.language.messages.loading+"...");if(e.media!=null&&e.media!=""){var i="",s="",o="",u="",a=!1,f;f=VMM.MediaType(e.media);f.uid=t;n=!0;e.credit!=null&&e.credit!=""&&(o="<div class='credit'>"+VMM.Util.linkify_with_twitter(e.credit,"_blank")+"</div>");e.caption!=null&&e.caption!=""&&(s="<div class='caption'>"+VMM.Util.linkify_with_twitter(e.caption,"_blank")+"</div>");if(f.type=="image"){f.id.match("https://")&&(f.id=f.id.replace("https://","http://"));i="<div class='media-image media-shadow'><img src='"+f.id+"' class='media-image'></div>"}else if(f.type=="flickr"){i="<div class='media-image media-shadow'><a href='"+f.link+"' target='_blank'><img id='"+t+"'></a></div>";VMM.ExternalAPI.flickr.get(f)}else if(f.type=="instagram")i="<div class='media-image media-shadow'><a href='"+f.link+"' target='_blank'><img src='"+VMM.ExternalAPI.instagram.get(f)+"'></a></div>"
;else if(f.type=="googledoc"){i="<div class='media-frame media-shadow doc' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.googledocs.get(f)}else if(f.type=="youtube"){i="<div class='media-shadow'><div class='media-frame video youtube' id='"+f.uid+"'>"+r+"</div></div>";VMM.ExternalAPI.youtube.get(f)}else if(f.type=="vimeo"){i="<div class='media-shadow media-frame video vimeo' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.vimeo.get(f)}else if(f.type=="dailymotion")i="<div class='media-shadow'><iframe class='media-frame video dailymotion' autostart='false' frameborder='0' width='100%' height='100%' src='http://www.dailymotion.com/embed/video/"+f.id+"'></iframe></div>";else if(f.type=="vine"){i="<div class='media-shadow media-frame video vine' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.vine.get(f)}else if(f.type=="twitter"){i="<div class='twitter' id='"+f.uid+"'>"+r+"</div>";a=!0;VMM.ExternalAPI.twitter.get(f)}else if(f.type=="twitter-ready"){a=!0;i=f.id}else if(f.type=="soundcloud"){i="<div class='media-frame media-shadow soundcloud' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.soundcloud.get(f)}else if(f.type=="google-map"){i="<div class='media-frame media-shadow map' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.googlemaps.get(f)}else if(f.type=="googleplus"){u="googleplus_"+f.id;i="<div class='googleplus' id='"+u+"'>"+r+"</div>";a=!0;VMM.ExternalAPI.googleplus.get(f)}else if(f.type=="wikipedia"){i="<div class='wikipedia' id='"+f.uid+"'>"+r+"</div>";a=!0;VMM.ExternalAPI.wikipedia.get(f)}else if(f.type=="storify"){a=!0;i="<div class='plain-text-quote'>"+f.id+"</div>"}else if(f.type=="iframe"){a=!0;i="<div class='media-shadow'><iframe class='media-frame video' autostart='false' frameborder='0' width='100%' height='100%' src='"+f.id+"'></iframe></div>"}else if(f.type=="quote"){a=!0;i="<div class='plain-text-quote'>"+f.id+"</div>"}else if(f.type=="unknown"){trace("NO KNOWN MEDIA TYPE FOUND TRYING TO JUST PLACE THE HTML");a=!0;i="<div class='plain-text'><div class='container'>"+VMM.Util.properQuotes(f.id)+"</div></div>"}else if(f.type=="website"){i="<div class='media-shadow website' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.webthumb.get(f)}else{trace("NO KNOWN MEDIA TYPE FOUND");trace(f.type)}i="<div class='media-container' >"+i+o+s+"</div>";return a?"<div class='text-media'><div class='media-wrapper'>"+i+"</div></div>":"<div class='media-wrapper'>"+i+"</div>"}}}.init());typeof VMM!="undefined"&&typeof VMM.MediaType=="undefined"&&(VMM.MediaType=function(e){var t=e.replace(/^\s\s*/,"").replace(/\s\s*$/,""),n=!1,r={type:"unknown",id:"",start:0,hd:!1,link:"",lang:VMM.Language.lang,uniqueid:VMM.Util.unique_ID(6)};if(t.match("div class='twitter'")){r.type="twitter-ready";r.id=t;n=!0}else if(t.match("(www.)?youtube|youtu.be")){t.match("v=")?r.id=VMM.Util.getUrlVars(t).v:t.match("/embed/")?r.id=t.split("embed/")[1].split(/[?&]/)[0]:t.match(/v\/|v=|youtu\.be\//)?r.id=t.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]:trace("YOUTUBE IN URL BUT NOT A VALID VIDEO");r.start=VMM.Util.getUrlVars(t).t;r.hd=VMM.Util.getUrlVars(t).hd;r.type="youtube";n=!0}else if(t.match("(player.)?vimeo.com")){r.type="vimeo";r.id=t.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0];n=!0}else if(t.match("(www.)?dailymotion.com")){r.id=t.split(/video\/|\/\/dailymotion\.com\//)[1];r.type="dailymotion";n=!0}else if(t.match("(www.)?vine.co")){trace("VINE");if(t.match("vine.co/v/")){r.id=t.split("vine.co/v/")[1];trace(r.id)}trace(t);r.type="vine";n=!0}else if(t.match("(player.)?soundcloud.com")){r.type="soundcloud";r.id=t;n=!0}else if(t.match("(www.)?twitter.com")&&t.match("status")){t.match("status/")?r.id=t.split("status/")[1]:t.match("statuses/")?r.id=t.split("statuses/")[1]:r.id="";r.type="twitter";n=!0}else if(t.match("maps.google")&&!t.match("staticmap")){r.type="google-map";r.id=t.split(/src=['|"][^'|"]*?['|"]/gi);n=!0}else if(t.match("plus.google")){r.type="googleplus";r.id=t.split("/posts/")[1];t.split("/posts/")[0].match("u/0/")?r.user=t.split("u/0/")[1].split("/posts")[0]:r.user=t.split("google.com/")[1].split("/posts/")[0];n=!0}else if(t.match("flickr.com/photos")){r.type="flickr";r.id=t.split("photos/")[1].split("/")[1];r.link=t;n=!0}else if(t.match("instagr.am/p/")){r.type="instagram";r.link=t;r.id=t.split("/p/")[1].split("/")[0];n=!0}else if(t.match(/jpg|jpeg|png|gif/i)||t.match("staticmap")||t.match("yfrog.com")||t.match("twitpic.com")){r.type="image";r.id=t;n=!0}else if(VMM.FileExtention.googleDocType(t)){r.type="googledoc";r.id=t;n=!0}else if(t.match("(www.)?wikipedia.org")){r.type="wikipedia";var i=t.split("wiki/")[1].split("#")[0].replace("_"," ");r.id=i.replace(" ","%20");r.lang=t.split("//")[1].split(".wikipedia")[0];n=!0}else if(t.indexOf("http://")==0){r.type="website";r.id=t;n=!0}else if(t.match("storify")){r.type="storify";r.id=t;n=!0}else if(t.match("blockquote")){r.type="quote";r.id=t;n=!0}else if(t.match("iframe")){r.type="iframe";trace("IFRAME");trace(t.match(/src\=([^\s]*)\s/)[1].split(/"/)[1]);r.id=t.match(/src\=([^\s]*)\s/)[1].split(/"/)[1];n=!0}else{trace("unknown media");r.type="unknown";r.id=t;n=!0}if(n)return r;trace("No valid media id detected");trace(t);return!1});typeof VMM!="undefined"&&typeof VMM.TextElement=="undefined"&&(VMM.TextElement={init:function(){return this},create:function(e){return e}}.init());typeof VMM!="undefined"&&typeof VMM.DragSlider=="undefined"&&(VMM.DragSlider=function(){function o(e,n){VMM.bindEvent(e,a,t.down,{element:n,delement:e});VMM.bindEvent(e,f,t.up,{element:n,delement:e});VMM.bindEvent(e,u,t.leave,{element:n,delement:e})}function u(n){VMM.unbindEvent(n.data.delement,l,t.move);e.touch||n.preventDefault();n.stopPropagation();if(e.sliding){e.sliding=!1;h(n.data.element,n.data.delement,n);return!1}return!0}function a(t){c(t.data.element,t.data.delement,t);e.touch||t.preventDefault();return!0}function f(t){e.touch||t.preventDefault();if(e.sliding){e.sliding=!1;h(t.data.element,t.data.delement,t);return!1}return!0}function l(e){p(e.data.element,e)}function c(n,r,i){if(e.touch){trace("IS TOUCH");VMM.Lib.css(n,"-webkit-transition-duration","0");e.pagex.start=i.originalEvent.touches[0].screenX;e.pagey.start=i.originalEvent.touches[0].screenY}else{e.pagex.start=i.pageX;e.pagey.start=i.pageY}e.left.start=v(n);e.time.start=(new Date).getTime();VMM.Lib.stop(n);VMM.bindEvent(r,l,t.move,{element:n})}function h(e,n,r){VMM.unbindEvent(n,l,t.move);d(e,r)}function p(t,n){var r,i;e.sliding=!0;if(e.touch){e.pagex.end=n.originalEvent.touches[0].screenX;e.pagey.end=n.originalEvent.touches[0].screenY}else{e.pagex.end=n.pageX;e.pagey.end=n.pageY}e.left.end=v(t);r=-(e.pagex.start-e.pagex.end-e.left.start);if(Math.abs(e.pagey.start)-Math.abs(e.pagey.end)>10){trace("SCROLLING Y");trace(Math.abs(e.pagey.start)-Math.abs(e.pagey.end))}if(Math.abs(r-e.left.start)>10){VMM.Lib.css(t,"left",r);n.preventDefault();n.stopPropagation()}}function d(t,n){var r={left:e.left.end,left_adjust:0,change:{x:0},time:((new Date).getTime()-e.time.start)*10,time_adjust:((new Date).getTime()-e.time.start)*10},o=3e3;e.touch&&(o=6e3);r.change.x=o*(Math.abs(e.pagex.end)-Math.abs(e.pagex.start));r.left_adjust=Math.round(r.change.x/r.time);r.left=Math.min(r.left+r.left_adjust);if(e.constraint)if(r.left>e.constraint.left){r.left=e.constraint.left;r.time>5e3&&(r.time=5e3)}else if(r.left<e.constraint.right){r.left=e.constraint.right;r.time>5e3&&(r.time=5e3)}VMM.fireEvent(i,"DRAGUPDATE",[r]);s||r.time>0&&(e.touch?VMM.Lib.animate(t,r.time,"easeOutCirc",{left:r.left}):VMM.Lib.animate(t,r.time,e.ease,{left:r.left}))}function v(e){return parseInt(VMM.Lib.css(e,"left").substring(0,VMM.Lib.css(e,"left").length-2),10)}var e={element:"",element_move:"",constraint:"",sliding:!1,pagex:{start:0,end:0},pagey:{start:0,end:0},left:{start:0,end:0},time:{start:0,end:0},touch:!1,ease:"easeOutExpo"},t={down:"mousedown",up:"mouseup",leave:"mouseleave",move:"mousemove"},n={down:"mousedown",up:"mouseup",leave:"mouseleave",move:"mousemove"},r={down:"touchstart",up:"touchend",leave:"mouseleave",move:"touchmove"},i=this,s=!1;this.createPanel=function(i,u,a,f,l){e.element=i;e.element_move=u;l!=null&&l!=""&&(s=l);a!=null&&a!=""?e.constraint=a:e.constraint=!1;f?e.touch=f:e.touch=!1;trace("TOUCH"+e.touch);e.touch?t=r:t=n;o(e.element,e.element_move)};this.updateConstraint=function(t){trace("updateConstraint");e.constraint=t};this.cancelSlide=function(n){VMM.unbindEvent(e.element,l,t.move);return!0}});typeof VMM!="undefined"&&typeof VMM.Slider=="undefined"&&(VMM.Slider=function(e,t){function S(){trace("onConfigSet")}function x(e,t){var r=!0,i=!1;e!=null&&(r=e);t!=null&&(i=t);m=n.slider.width;n.slider.nav.height=VMM.Lib.height(E.prevBtnContainer);VMM.Browser.device=="mobile"||m<=640?n.slider.content.padding=10:n.slider.content.padding=n.slider.content.padding_default;n.slider.content.width=m-n.slider.content.padding*2;VMM.Lib.width(u,h.length*n.slider.content.width);i&&VMM.Lib.css(o,"left",h[v].leftpos());B();j();VMM.Lib.css(E.nextBtn,"left",m-n.slider.nav.width);VMM.Lib.height(E.prevBtn,n.slider.height);VMM.Lib.height(E.nextBtn,n.slider.height);VMM.Lib.css(E.nextBtnContainer,"top",n.slider.height/2-n.slider.nav.height/2+10);VMM.Lib.css(E.prevBtnContainer,"top",n.slider.height/2-n.slider.nav.height/2+10);VMM.Lib.height(s,n.slider.height);VMM.Lib.width(s,m);r&&I(v,"linear",1);v==0&&VMM.Lib.visible(E.prevBtn,!1)}function T(e,t){trace("DRAG FINISH");trace(t.left_adjust);trace(n.slider.width/2);if(t.left_adjust<0)if(Math.abs(t.left_adjust)>n.slider.width/2)if(v==h.length-1)q();else{I(v+1,"easeOutExpo");O()}else q();else if(Math.abs(t.left_adjust)>n.slider.width/2)if(v==0)q();else{I(v-1,"easeOutExpo");O()}else q()}function N(e){if(v==h.length-1)q();else{I(v+1);O()}}function C(e){if(v==0)q();else{I(v-1);O()}}function k(e){switch(e.keyCode){case 39:N(e);break;case 37:C(e)}}function L(e,t){if(p.length==0)for(var r=0;r<h.length;r++)p.push(h[r].leftpos());if(typeof t.left=="number"){var i=t.left,s=-h[v].leftpos();i<s-n.slider_width/3?N():i>s+n.slider_width/3?C():VMM.Lib.animate(o,n.duration,n.ease,{left:s})}else VMM.Lib.animate(o,n.duration,n.ease,{left:s});typeof t.top=="number"&&VMM.Lib.animate(o,n.duration,n.ease,{top:-t.top})}function A(e){z()}function O(){n.current_slide=v;VMM.fireEvent(w,"UPDATE")}function M(e){c=e}function _(e){var t=0;VMM.attachElement(u,"");h=[];for(t=0;t<e.length;t++){var n=new VMM.Slider.Slide(e[t],u);h.push(n)}}function D(e){var t=0;if(e)P();else{for(t=0;t<h.length;t++)h[t].clearTimers();r=setTimeout(P,n.duration)}}function P(){var e=0;for(e=0;e<h.length;e++)h[e].enqueue=!0;for(e=0;e<n.preload;e++){if(!(v+e>h.length-1)){h[v+e].show();h[v+e].enqueue=!1}if(!(v-e<0)){h[v-e].show();h[v-e].enqueue=!1}}if(h.length>50)for(e=0;e<h.length;e++)h[e].enqueue&&h[e].hide();B()}function H(e){}function B(){var e=0,t=".slider-item .layout-text-media .media .media-container ",r=".slider-item .layout-media .media .media-container ",i=".slider-item .media .media-container",s=".slider-item .media .media-container .media-shadow .caption",o=!1,u={text_media:{width:n.slider.content.width/100*60,height:n.slider.height-60,video:{width:0,height:0},text:{width:n.slider.content.width/100*40-30,height:n.slider.height}},media:{width:n.slider.content.width,height:n.slider.height-110,video:{width:0,height:0}}};if(VMM.Browser.device=="mobile"||m<641)o=!0;VMM.master_config.sizes.api.width=u.media.width;VMM.master_config.sizes.api.height=u.media.height;u.text_media.video=VMM.Util.ratio.fit(u.text_media.width,u.text_media.height,16,9);u.media.video=VMM.Util.ratio.fit(u.media.width,u.media.height,16,9);VMM.Lib.css(".slider-item","width",n.slider.content.width);VMM.Lib.height(".slider-item",n.slider.height);if(o){u.text_media.width=n.slider.content.width-n.slider.content.padding*2;u.media.width=n.slider.content.width-n.slider.content.padding*2;u.text_media.height=n.slider.height/100*50-50;u.media.height=n.slider.height/100*70-40;u.text_media.video=VMM.Util.ratio.fit(u.text_media.width,u.text_media.height,16,9);u.media.video=VMM.Util.ratio.fit(u.media.width,u.media.height,16,9);VMM.Lib.css(".slider-item .layout-text-media .text","width","100%");VMM.Lib.css(".slider-item .layout-text-media .text","display","block");VMM.Lib.css(".slider-item .layout-text-media .text .container","display","block");VMM.Lib.css(".slider-item .layout-text-media .text .container","width",u.media.width);VMM.Lib.css(".slider-item .layout-text-media .text .container .start","width","auto");VMM.Lib.css(".slider-item .layout-text-media .media","float","none");VMM.Lib.addClass(".slider-item .content-container","pad-top");VMM.Lib.css(".slider-item .media blockquote p","line-height","18px");VMM.Lib.css(".slider-item .media blockquote p","font-size","16px");VMM.Lib.css(".slider-item","overflow-y","auto")}else{VMM.Lib.css(".slider-item .layout-text-media .text","width","40%");VMM.Lib.css(".slider-item .layout-text-media .text","display","table-cell");VMM.Lib.css(".slider-item .layout-text-media .text .container","display","table-cell");VMM.Lib.css(".slider-item .layout-text-media .text .container","width","auto");VMM.Lib.css(".slider-item .layout-text-media .text .container .start","width",u.text_media.text.width);VMM.Lib.removeClass(".slider-item .content-container","pad-top");VMM.Lib.css(".slider-item .layout-text-media .media","float","left");VMM.Lib.css(".slider-item .layout-text-media","display","table");VMM.Lib.css(".slider-item .media blockquote p","line-height","36px");VMM.Lib.css(".slider-item .media blockquote p","font-size","28px");VMM.Lib.css(".slider-item","display","table");VMM.Lib.css(".slider-item","overflow-y","auto")}VMM.Lib.css(t+".media-frame","max-width",u.text_media.width);VMM.Lib.height(t+".media-frame",u.text_media.height);VMM.Lib.width(t+".media-frame",u.text_media.width);VMM.Lib.css(t+"img","max-height",u.text_media.height);VMM.Lib.css(r+"img","max-height",u.media.height);VMM.Lib.css(t+"img","max-width",u.text_media.width);VMM.Lib.css(t+".avatar img","max-width",32);VMM.Lib.css(t+".avatar img","max-height",32);VMM.Lib.css(r+".avatar img","max-width",32);VMM.Lib.css(r+".avatar img","max-height",32);VMM.Lib.css(t+".article-thumb","max-width","50%");VMM.Lib.css(r+".article-thumb","max-width",200);VMM.Lib.width(t+".media-frame",u.text_media.video.width);VMM.Lib.height(t+".media-frame",u.text_media.video.height);VMM.Lib.width(r+".media-frame",u.media.video.width);VMM.Lib.height(r+".media-frame",u.media.video.height);VMM.Lib.css(r+".media-frame","max-height",u.media.video.height);VMM.Lib.css(r+".media-frame","max-width",u.media.video.width);VMM.Lib.height(r+".soundcloud",168);VMM.Lib.height(t+".soundcloud",168);VMM.Lib.width(r+".soundcloud",u.media.width);VMM.Lib.width(t+".soundcloud",u.text_media.width);VMM.Lib.css(i+".soundcloud","max-height",168);VMM.Lib.height(t+".map",u.text_media.height);VMM.Lib.width(t+".map",u.text_media.width);VMM.Lib.css(r+".map","max-height",u.media.height);VMM.Lib.width(r+".map",u.media.width);VMM.Lib.height(t+".doc",u.text_media.height);VMM.Lib.width(t+".doc",u.text_media.width);VMM.Lib.height(r+".doc",u.media.height);VMM.Lib.width(r+".doc",u.media.width);VMM.Lib.width(r+".wikipedia",u.media.width);VMM.Lib.width(r+".twitter",u.media.width);VMM.Lib.width(r+".plain-text-quote",u.media.width);VMM.Lib.width(r+".plain-text",u.media.width);VMM.Lib.css(i,"max-width",u.media.width);VMM.Lib.css(t+".caption","max-width",u.text_media.video.width);VMM.Lib.css(r+".caption","max-width",u.media.video.width);for(e=0;e<h.length;e++){h[e].layout(o);h[e].content_height()>n.slider.height+20?h[e].css("display","block"):h[e].css("display","table")}}function j(){var e=0,t=0;for(t=0;t<h.length;t++){e=t*(n.slider.width+n.spacing);h[t].leftpos(e)}}function F(e){var t="linear",r=0;for(r=0;r<h.length;r++)r==v?h[r].animate(n.duration,t,{opacity:1}):r==v-1||r==v+1?h[r].animate(n.duration,t,{opacity:.1}):h[r].opacity(e)}function I(e,t,r,s,u){var a=n.ease,f=n.duration,l=!1,p=!1,d="",m;VMM.ExternalAPI.youtube.stopPlayers();v=e;m=h[v].leftpos();v==0&&(p=!0);v+1>=h.length&&(l=!0);t!=null&&t!=""&&(a=t);r!=null&&r!=""&&(f=r);if(VMM.Browser.device=="mobile"){VMM.Lib.visible(E.prevBtn,!1);VMM.Lib.visible(E.nextBtn,!1)}else{if(p)VMM.Lib.visible(E.prevBtn,!1);else{VMM.Lib.visible(E.prevBtn,!0);d=VMM.Util.unlinkify(c[v-1].title);if(n.type=="timeline")if(typeof c[v-1].date=="undefined"){VMM.attachElement(E.prevDate,d);VMM.attachElement(E.prevTitle,"")}else{VMM.attachElement(E.prevDate,VMM.Date.prettyDate(c[v-1].startdate,!1,c[v-1].precisiondate));VMM.attachElement(E.prevTitle,d)}else VMM.attachElement(E.prevTitle,d)}if(l)VMM.Lib.visible(E.nextBtn,!1);else{VMM.Lib.visible(E.nextBtn,!0);d=VMM.Util.unlinkify(c[v+1].title);if(n.type=="timeline")if(typeof c[v+1].date=="undefined"){VMM.attachElement(E.nextDate,d);VMM.attachElement(E.nextTitle,"")}else{VMM.attachElement(E.nextDate,VMM.Date.prettyDate(c[v+1].startdate,!1,c[v+1].precisiondate));VMM.attachElement(E.nextTitle,d)}else VMM.attachElement(E.nextTitle,d)}}if(s)VMM.Lib.css(o,"left",-(m-n.slider.content.padding));else{VMM.Lib.stop(o);VMM.Lib.animate(o,f,a,{left:-(m-n.slider.content.padding)})}u&&VMM.fireEvent(w,"LOADED");if(h[v].height()>n.slider_height)VMM.Lib.css(".slider","overflow-y","scroll");else{VMM.Lib.css(w,"overflow-y","hidden");var g=0;try{g=VMM.Lib.prop(w,"scrollHeight");VMM.Lib.animate(w,f,a,{scrollTop:g-VMM.Lib.height(w)})}catch(y){g=VMM.Lib.height(w)}}D();VMM.fireEvent(i,"MESSAGE","TEST")}function q(){VMM.Lib.stop(o);VMM.Lib.animate(o,n.duration,"easeOutExpo",{left:-h[v].leftpos()+n.slider.content.padding})}function R(e,t,n){trace("showMessege "+t);VMM.attachElement(f,"<div class='vco-explainer'><div class='vco-explainer-container'><div class='vco-bezel'><div class='vco-gesture-icon'></div><div class='vco-message'><p>"+t+"</p></div></div></div></div>")}function U(){VMM.Lib.animate(f,n.duration,n.ease,{opacity:0},z)}function z(){VMM.Lib.detach(f)}function W(){var e="<div class='icon'>&nbsp;</div>";E.nextBtn=VMM.appendAndGetElement(i,"<div>","nav-next");E.prevBtn=VMM.appendAndGetElement(i,"<div>","nav-previous");E.nextBtnContainer=VMM.appendAndGetElement(E.nextBtn,"<div>","nav-container",e);E.prevBtnContainer=VMM.appendAndGetElement(E.prevBtn,"<div>","nav-container",e);if(n.type=="timeline"){E.nextDate=VMM.appendAndGetElement(E.nextBtnContainer,"<div>","date","");E.prevDate=VMM.appendAndGetElement(E.prevBtnContainer,"<div>","date","")}E.nextTitle=VMM.appendAndGetElement(E.nextBtnContainer,"<div>","title","");E.prevTitle=VMM.appendAndGetElement(E.prevBtnContainer,"<div>","title","");VMM.bindEvent(".nav-next",N);VMM.bindEvent(".nav-previous",C);VMM.bindEvent(window,k,"keydown")}function X(){var e=3e3;VMM.attachElement(w,"");i=VMM.getElement(w);s=VMM.appendAndGetElement(i,"<div>","slider-container-mask");o=VMM.appendAndGetElement(s,"<div>","slider-container");u=VMM.appendAndGetElement(o,"<div>","slider-item-container");W();_(c);if(VMM.Browser.device=="tablet"||VMM.Browser.device=="mobile"){n.duration=500;e=1e3;a=new VMM.DragSlider;a.createPanel(i,o,"",n.touch,!0);VMM.bindEvent(a,T,"DRAGUPDATE");f=VMM.appendAndGetElement(s,"<div>","vco-feedback","");R(null,"Swipe to Navigate");VMM.Lib.height(f,n.slider.height);VMM.bindEvent(f,A);VMM.bindEvent(f,A,"touchend")}x(!1,!0);VMM.Lib.visible(E.prevBtn,!1);I(n.current_slide,"easeOutExpo",e,!0,!0);b=!0}var n,r,i,s,o,u,a,f,l={},c=[],h=[],p=[],d="",v=0,m=960,g={move:!1,x:10,y:0,off:0,dampen:48},y="",b=!1,w=e,E={nextBtn:"",prevBtn:"",nextDate:"",prevDate:"",nextTitle:"",prevTitle:""};typeof t!="undefined"?n=t:n={preload:4,current_slide:0,interval:10,something:0,width:720,height:400,ease:"easeInOutExpo",duration:1e3,timeline:!1,spacing:15,slider:{width:720,height:400,content:{width:720,height:400,padding:120,padding_default:120},nav:{width:100,height:200}}};this.ver="0.6";n.slider.width=n.width;n.slider.height=n.height;this.init=function(e){h=[];p=[];typeof e!="undefined"?this.setData(e):trace("WAITING ON DATA")};this.width=function(e){if(e==null||e=="")return n.slider.width;n.slider.width=e;x()};this.height=function(e){if(e==null||e=="")return n.slider.height;n.slider.height=e;x()};this.setData=function(e){if(typeof e!="undefined"){c=e;X()}else trace("NO DATA")};this.getData=function(){return c};this.setConfig=function(e){typeof e!="undefined"?n=e:trace("NO CONFIG DATA")};this.getConfig=function(){return n};this.setSize=function(e,t){e!=null&&(n.slider.width=e);t!=null&&(n.slider.height=t);b&&x()};this.active=function(){return b};this.getCurrentNumber=function(){return v};this.setSlide=function(e){I(e)}});typeof VMM.Slider!="undefined"&&(VMM.Slider.Slide=function(e,t){var n,r,i,s,o,u,a=e,f={},o="",l="",c=!1,h=!1,p=!1,d=!0,v=!1,m="slide_",g=0,y={pushque:"",render:"",relayout:"",remove:"",skinny:!1},b={pushque:500,render:100,relayout:100,remove:3e4};m+=a.uniqueid;this.enqueue=d;this.id=m;o=VMM.appendAndGetElement(t,"<div>","slider-item");if(typeof a.classname!="undefined"){trace("HAS CLASSNAME");VMM.Lib.addClass(o,a.classname)}else{trace("NO CLASSNAME");trace(a)}u={slide:"",text:"",media:"",media_element:"",layout:"content-container layout",has:{headline:!1,text:!1,media:!1}};this.show=function(e){d=!1;y.skinny=e;v=!1;clearTimeout(y.remove);if(!c)if(h){clearTimeout(y.relayout);y.relayout=setTimeout(S,b.relayout)}else w(e)};this.hide=function(){if(c&&!v){v=!0;clearTimeout(y.remove);y.remove=setTimeout(E,b.remove)}};this.clearTimers=function(){clearTimeout(y.relayout);clearTimeout(y.pushque);clearTimeout(y.render)};this.layout=function(e){c&&h&&x(e)};this.elem=function(){return o};this.position=function(){return VMM.Lib.position(o)};this.leftpos=function(e){if(typeof e=="undefined")return VMM.Lib.position(o).left;VMM.Lib.css(o,"left",e)};this.animate=function(e,t,n){VMM.Lib.animate(o,e,t,n)};this.css=function(e,t){VMM.Lib.css(o,e,t)};this.opacity=function(e){VMM.Lib.css(o,"opacity",e)};this.width=function(){return VMM.Lib.width(o)};this.height=function(){return VMM.Lib.height(o)};this.content_height=function(){var e=VMM.Lib.find(o,".content")[0];return e!="undefined"&&e!=null?VMM.Lib.height(e):0};var w=function(e){trace("RENDER "+m);c=!0;h=!0;y.skinny=e;T();clearTimeout(y.pushque);clearTimeout(y.render);y.pushque=setTimeout(VMM.ExternalAPI.pushQues,b.pushque)},E=function(){trace("REMOVE SLIDE TIMER FINISHED");c=!1;VMM.Lib.detach(r);VMM.Lib.detach(n)},S=function(){c=!0;x(y.skinny,!0)},x=function(e,t){if(u.has.text){if(e){if(!p||t){VMM.Lib.removeClass(i,"pad-left");VMM.Lib.detach(r);VMM.Lib.detach(n);VMM.Lib.append(i,r);VMM.Lib.append(i,n);p=!0}}else if(p||t){VMM.Lib.addClass(i,"pad-left");VMM.Lib.detach(r);VMM.Lib.detach(n);VMM.Lib.append(i,n);VMM.Lib.append(i,r);p=!1}}else if(t){if(u.has.headline){VMM.Lib.detach(r);VMM.Lib.append(i,r)}VMM.Lib.detach(n);VMM.Lib.append(i,n)}},T=function(){trace("BUILDSLIDE");s=VMM.appendAndGetElement(o,"<div>","content");i=VMM.appendAndGetElement(s,"<div>");if(a.startdate!=null&&a.startdate!=""&&type.of(a.startdate)=="date"&&a.type!="start"){var e=VMM.Date.prettyDate(a.startdate,!1,a.precisiondate),t=VMM.Date.prettyDate(a.enddate,!1,a.precisiondate),f="";a.tag!=null&&a.tag!=""&&(f=VMM.createElement("span",a.tag,"slide-tag"));e!=t?u.text+=VMM.createElement("h2",e+" &mdash; "+t+f,"date"):u.text+=VMM.createElement("h2",e+f,"date")}if(a.headline!=null&&a.headline!=""){u.has.headline=!0;a.type=="start"?u.text+=VMM.createElement("h2",VMM.Util.linkify_with_twitter(a.headline,"_blank"),"start"):u.text+=VMM.createElement("h3",VMM.Util.linkify_with_twitter(a.headline,"_blank"))}if(a.text!=null&&a.text!=""){u.has.text=!0;u.text+=VMM.createElement("p",VMM.Util.linkify_with_twitter(a.text,"_blank"))}if(u.has.text||u.has.headline){u.text=VMM.createElement("div",u.text,"container");r=VMM.appendAndGetElement(i,"<div>","text",VMM.TextElement.create(u.text))}a.needs_slug;if(a.asset!=null&&a.asset!=""&&a.asset.media!=null&&a.asset.media!=""){u.has.media=!0;n=VMM.appendAndGetElement(i,"<div>","media",VMM.MediaElement.create(a.asset,a.uniqueid))}u.has.text&&(u.layout+="-text");u.has.media&&(u.layout+="-media");if(u.has.text)if(y.skinny){VMM.Lib.addClass(i,u.layout);p=!0}else{VMM.Lib.addClass(i,u.layout);VMM.Lib.addClass(i,"pad-left");VMM.Lib.detach(r);VMM.Lib.append(i,r)}else VMM.Lib.addClass(i,u.layout)}});var Aes={};Aes.cipher=function(e,t){var n=4,r=t.length/n-1,i=[[],[],[],[]];for(var s=0;s<4*n;s++)i[s%4][Math.floor(s/4)]=e[s];i=Aes.addRoundKey(i,t,0,n);for(var o=1;o<r;o++){i=Aes.subBytes(i,n);i=Aes.shiftRows(i,n);i=Aes.mixColumns(i,n);i=Aes.addRoundKey(i,t,o,n)}i=Aes.subBytes(i,n);i=Aes.shiftRows(i,n);i=Aes.addRoundKey(i,t,r,n);var u=new Array(4*n);for(var s=0;s<4*n;s++)u[s]=i[s%4][Math.floor(s/4)];return u};Aes.keyExpansion=function(e){var t=4,n=e.length/4,r=n+6,i=new Array(t*(r+1)),s=new Array(4);for(var o=0;o<n;o++){var u=[e[4*o],e[4*o+1],e[4*o+2],e[4*o+3]];i[o]=u}for(var o=n;o<t*(r+1);o++){i[o]=new Array(4);for(var a=0;a<4;a++)s[a]=i[o-1][a];if(o%n==0){s=Aes.subWord(Aes.rotWord(s));for(var a=0;a<4;a++)s[a]^=Aes.rCon[o/n][a]}else n>6&&o%n==4&&(s=Aes.subWord(s));for(var a=0;a<4;a++)i[o][a]=i[o-n][a]^s[a]}return i};Aes.subBytes=function(e,t){for(var n=0;n<4;n++)for(var r=0;r<t;r++)e[n][r]=Aes.sBox[e[n][r]];return e};Aes.shiftRows=function(e,t){var n=new Array(4);for(var r=1;r<4;r++){for(var i=0;i<4;i++)n[i]=e[r][(i+r)%t];for(var i=0;i<4;i++)e[r][i]=n[i]}return e};Aes.mixColumns=function(e,t){for(var n=0;n<4;n++){var r=new Array(4),i=new Array(4);for(var s=0;s<4;s++){r[s]=e[s][n];i[s]=e[s][n]&128?e[s][n]<<1^283:e[s][n]<<1}e[0][n]=i[0]^r[1]^i[1]^r[2]^r[3];e[1][n]=r[0]^i[1]^r[2]^i[2]^r[3];e[2][n]=r[0]^r[1]^i[2]^r[3]^i[3];e[3][n]=r[0]^i[0]^r[1]^r[2]^i[3]}return e};Aes.addRoundKey=function(e,t,n,r){for(var i=0;i<4;i++)for(var s=0;s<r;s++)e[i][s]^=t[n*4+s][i];return e};Aes.subWord=function(e){for(var t=0;t<4;t++)e[t]=Aes.sBox[e[t]];return e};Aes.rotWord=function(e){var t=e[0];for(var n=0;n<3;n++)e[n]=e[n+1];e[3]=t;return e};Aes.sBox=[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22];Aes.rCon=[[0,0,0,0],[1,0,0,0],[2,0,0,0],[4,0,0,0],[8,0,0,0],[16,0,0,0],[32,0,0,0],[64,0,0,0],[128,0,0,0],[27,0,0,0],[54,0,0,0]];Aes.Ctr={};Aes.Ctr.encrypt=function(e,t,n){var r=16;if(n!=128&&n!=192&&n!=256)return"";e=Utf8.encode(e);t=Utf8.encode(t);var i=n/8,s=new Array(i);for(var o=0;o<i;o++)s[o]=isNaN(t.charCodeAt(o))?0:t.charCodeAt(o);var u=Aes.cipher(s,Aes.keyExpansion(s));u=u.concat(u.slice(0,i-16));var a=new Array(r),f=(new Date).getTime(),l=f%1e3,c=Math.floor(f/1e3),h=Math.floor(Math.random()*65535);for(var o=0;o<2;o++)a[o]=l>>>o*8&255;for(var o=0;o<2;o++)a[o+2]=h>>>o*8&255;for(var o=0;o<4;o++)a[o+4]=c>>>o*8&255;var p="";for(var o=0;o<8;o++)p+=String.fromCharCode(a[o]);var d=Aes.keyExpansion(u),v=Math.ceil(e.length/r),m=new Array(v);for(var g=0;g<v;g++){for(var y=0;y<4;y++)a[15-y]=g>>>y*8&255;for(var y=0;y<4;y++)a[15-y-4]=g/4294967296>>>y*8;var b=Aes.cipher(a,d),w=g<v-1?r:(e.length-1)%r+1,E=new Array(w);for(var o=0;o<w;o++){E[o]=b[o]^e.charCodeAt(g*r+o);E[o]=String.fromCharCode(E[o])}m[g]=E.join("")}var S=p+m.join("");S=Base64.encode(S);return S};Aes.Ctr.decrypt=function(e,t,n){var r=16;if(n!=128&&n!=192&&n!=256)return"";e=Base64.decode(e);t=Utf8.encode(t);var i=n/8,s=new Array(i);for(var o=0;o<i;o++)s[o]=isNaN(t.charCodeAt(o))?0:t.charCodeAt(o);var u=Aes.cipher(s,Aes.keyExpansion(s));u=u.concat(u.slice(0,i-16));var a=new Array(8);ctrTxt=e.slice(0,8);for(var o=0;o<8;o++)a[o]=ctrTxt.charCodeAt(o);var f=Aes.keyExpansion(u),l=Math.ceil((e.length-8)/r),c=new Array(l);for(var h=0;h<l;h++)c[h]=e.slice(8+h*r,8+h*r+r);e=c;var p=new Array(e.length);for(var h=0;h<l;h++){for(var d=0;d<4;d++)a[15-d]=h>>>d*8&255;for(var d=0;d<4;d++)a[15-d-4]=(h+1)/4294967296-1>>>d*8&255;var v=Aes.cipher(a,f),m=new Array(e[h].length);for(var o=0;o<e[h].length;o++){m[o]=v[o]^e[h].charCodeAt(o);m[o]=String.fromCharCode(m[o])}p[h]=m.join("")}var g=p.join("");g=Utf8.decode(g);return g};var Base64={};Base64.code="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";Base64.encode=function(e,t){t=typeof t=="undefined"?!1:t;var n,r,i,s,o,u,a,f,l=[],c="",h,p,d,v=Base64.code;p=t?e.encodeUTF8():e;h=p.length%3;if(h>0)while(h++<3){c+="=";p+="\0"}for(h=0;h<p.length;h+=3){n=p.charCodeAt(h);r=p.charCodeAt(h+1);i=p.charCodeAt(h+2);s=n<<16|r<<8|i;o=s>>18&63;u=s>>12&63;a=s>>6&63;f=s&63;l[h/3]=v.charAt(o)+v.charAt(u)+v.charAt(a)+v.charAt(f)}d=l.join("");d=d.slice(0,d.length-c.length)+c;return d};Base64.decode=function(e,t){t=typeof t=="undefined"?!1:t;var n,r,i,s,o,u,a,f,l=[],c,h,p=Base64.code;h=t?e.decodeUTF8():e;for(var d=0;d<h.length;d+=4){s=p.indexOf(h.charAt(d));o=p.indexOf(h.charAt(d+1));u=p.indexOf(h.charAt(d+2));a=p.indexOf(h.charAt(d+3));f=s<<18|o<<12|u<<6|a;n=f>>>16&255;r=f>>>8&255;i=f&255;l[d/4]=String.fromCharCode(n,r,i);a==64&&(l[d/4]=String.fromCharCode(n,r));u==64&&(l[d/4]=String.fromCharCode(n))}c=l.join("");return t?c.decodeUTF8():c};var Utf8={};Utf8.encode=function(e){var t=e.replace(/[\u0080-\u07ff]/g,function(e){var t=e.charCodeAt(0);return String.fromCharCode(192|t>>6,128|t&63)});t=t.replace(/[\u0800-\uffff]/g,function(e){var t=e.charCodeAt(0);return String.fromCharCode(224|t>>12,128|t>>6&63,128|t&63)});return t};Utf8.decode=function(e){var t=e.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,function(e){var t=(e.charCodeAt(0)&15)<<12|(e.charCodeAt(1)&63)<<6|e.charCodeAt(2)&63;return String.fromCharCode(t)});t=t.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g,function(e){var t=(e.charCodeAt(0)&31)<<6|e.charCodeAt(1)&63;return String.fromCharCode(t)});return t};!function(e){"use strict";var t=function(e,t){this.init("tooltip",e,t)};t.prototype={constructor:t,init:function(t,n,r){var i,s;this.type=t;this.$element=e(n);this.options=this.getOptions(r);this.enabled=!0;if(this.options.trigger!="manual"){i=this.options.trigger=="hover"?"mouseenter":"focus";s=this.options.trigger=="hover"?"mouseleave":"blur";this.$element.on(i,this.options.selector,e.proxy(this.enter,this));this.$element.on(s,this.options.selector,e.proxy(this.leave,this))}this.options.selector?this._options=e.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(t){t=e.extend({},e.fn[this.type].defaults,t,this.$element.data());t.delay&&typeof t.delay=="number"&&(t.delay={show:t.delay,hide:t.delay});return t},enter:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);if(!n.options.delay||!n.options.delay.show)n.show();else{n.hoverState="in";setTimeout(function(){n.hoverState=="in"&&n.show()},n.options.delay.show)}},leave:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);if(!n.options.delay||!n.options.delay.hide)n.hide();else{n.hoverState="out";setTimeout(function(){n.hoverState=="out"&&n.hide()},n.options.delay.hide)}},show:function(){var e,t,n,r,i,s,o;if(this.hasContent()&&this.enabled){e=this.tip();this.setContent();this.options.animation&&e.addClass("fade");s=typeof this.options.placement=="function"?this.options.placement.call(this,e[0],this.$element[0]):this.options.placement;t=/in/.test(s);e.remove().css({top:0,left:0,display:"block"}).appendTo(t?this.$element:document.body);n=this.getPosition(t);r=e[0].offsetWidth;i=e[0].offsetHeight;switch(t?s.split(" ")[1]:s){case"bottom":o={top:n.top+n.height,left:n.left+n.width/2-r/2};break;case"top":o={top:n.top-i,left:n.left+n.width/2-r/2};break;case"left":o={top:n.top+n.height/2-i/2,left:n.left-r};break;case"right":o={top:n.top+n.height/2-i/2,left:n.left+n.width}}e.css(o).addClass(s).addClass("in")}},setContent:function(){var e=this.tip();e.find(".timeline-tooltip-inner").html(this.getTitle());e.removeClass("fade in top bottom left right")},hide:function(){function r(){var t=setTimeout(function(){n.off(e.support.transition.end).remove()},500);n.one(e.support.transition.end,function(){clearTimeout(t);n.remove()})}var t=this,n=this.tip();n.removeClass("in");e.support.transition&&this.$tip.hasClass("fade")?r():n.remove()},fixTitle:function(){var e=this.$element;(e.attr("title")||typeof e.attr("data-original-title")!="string")&&e.attr
("data-original-title",e.attr("title")||"").removeAttr("title")},hasContent:function(){return this.getTitle()},getPosition:function(t){return e.extend({},t?{top:0,left:0}:this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var e,t=this.$element,n=this.options;e=t.attr("data-original-title")||(typeof n.title=="function"?n.title.call(t[0]):n.title);e=e.toString().replace(/(^\s*|\s*$)/,"");return e},tip:function(){return this.$tip=this.$tip||e(this.options.template)},validate:function(){if(!this.$element[0].parentNode){this.hide();this.$element=null;this.options=null}},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass("in")?"hide":"show"]()}};e.fn.tooltip=function(n){return this.each(function(){var r=e(this),i=r.data("tooltip"),s=typeof n=="object"&&n;i||r.data("tooltip",i=new t(this,s));typeof n=="string"&&i[n]()})};e.fn.tooltip.Constructor=t;e.fn.tooltip.defaults={animation:!0,delay:0,selector:!1,placement:"top",trigger:"hover",title:"",template:'<div class="timeline-tooltip"><div class="timeline-tooltip-arrow"></div><div class="timeline-tooltip-inner"></div></div>'}}(window.jQuery);typeof VMM!="undefined"&&typeof VMM.StoryJS=="undefined"&&(VMM.StoryJS=function(){this.init=function(e){}});if(typeof VMM!="undefined"&&typeof VMM.Timeline=="undefined"){VMM.Timeline=function(e,t,n){function S(e){typeof embed_config=="object"&&(timeline_config=embed_config);if(typeof timeline_config=="object"){trace("HAS TIMELINE CONFIG");m=VMM.Util.mergeConfig(m,timeline_config)}else typeof e=="object"&&(m=VMM.Util.mergeConfig(m,e));if(VMM.Browser.device=="mobile"||VMM.Browser.device=="tablet")m.touch=!0;m.nav.width=m.width;m.nav.height=200;m.feature.width=m.width;m.feature.height=m.height-m.nav.height;m.nav.zoom.adjust=parseInt(m.start_zoom_adjust,10);VMM.Timeline.Config=m;VMM.master_config.Timeline=VMM.Timeline.Config;this.events=m.events;m.gmap_key!=""&&(m.api_keys.google=m.gmap_key);trace("VERSION "+m.version);c=m.version}function x(){r=VMM.getElement(h);VMM.Lib.addClass(r,"vco-timeline");VMM.Lib.addClass(r,"vco-storyjs");i=VMM.appendAndGetElement(r,"<div>","vco-container vco-main");s=VMM.appendAndGetElement(i,"<div>","vco-feature");u=VMM.appendAndGetElement(s,"<div>","vco-slider");a=VMM.appendAndGetElement(i,"<div>","vco-navigation");o=VMM.appendAndGetElement(r,"<div>","vco-feedback","");typeof m.language.right_to_left!="undefined"&&VMM.Lib.addClass(r,"vco-right-to-left");f=new VMM.Slider(u,m);l=new VMM.Timeline.TimeNav(a);g?VMM.Lib.width(r,m.width):m.width=VMM.Lib.width(r);y?VMM.Lib.height(r,m.height):m.height=VMM.Lib.height(r);m.touch?VMM.Lib.addClass(r,"vco-touch"):VMM.Lib.addClass(r,"vco-notouch")}function T(e,t){trace("onDataReady");d=t.timeline;type.of(d.era)!="array"&&(d.era=[]);X()}function N(){U()}function C(){W();f.setSize(m.feature.width,m.feature.height);l.setSize(m.width,m.height);j()&&H()}function k(e){m.loaded.slider=!0;L()}function L(e){m.loaded.percentloaded=m.loaded.percentloaded+25;m.loaded.slider&&m.loaded.timenav&&q()}function A(e){m.loaded.timenav=!0;L()}function O(e){w=!0;m.current_slide=f.getCurrentNumber();D(m.current_slide);l.setMarker(m.current_slide,m.ease,m.duration)}function M(e){w=!0;m.current_slide=l.getCurrentNumber();D(m.current_slide);f.setSlide(m.current_slide)}function _(e){if(e<=v.length-1&&e>=0){m.current_slide=e;f.setSlide(m.current_slide);l.setMarker(m.current_slide,m.ease,m.duration)}}function D(e){m.hash_bookmark&&(window.location.hash="#"+e.toString())}function P(){}function H(){var e="",t=B(window.orientation);VMM.Browser.device=="mobile"?t=="portrait"?e="width=device-width; initial-scale=0.5, maximum-scale=0.5":t=="landscape"?e="width=device-width; initial-scale=0.5, maximum-scale=0.5":e="width=device-width, initial-scale=1, maximum-scale=1.0":VMM.Browser.device=="tablet";document.getElementById("viewport")}function B(e){var t="";e==0||e==180?t="portrait":e==90||e==-90?t="landscape":t="normal";return t}function j(){var e=B(window.orientation);if(e==m.orientation)return!1;m.orientation=e;return!0}function F(e){VMM.getJSON(e,function(e){d=VMM.Timeline.DataObj.getData(e);VMM.fireEvent(global,m.events.data_ready)})}function I(e,t,n){trace("showMessege "+t);n?VMM.attachElement(o,t):VMM.attachElement(o,VMM.MediaElement.loadingmessage(t))}function q(){VMM.Lib.animate(o,m.duration,m.ease*4,{opacity:0},R)}function R(){VMM.Lib.detach(o)}function U(){parseInt(m.start_at_slide)>0&&m.current_slide==0&&(m.current_slide=parseInt(m.start_at_slide));m.start_at_end&&m.current_slide==0&&(m.current_slide=v.length-1);if(b){b=!0;VMM.fireEvent(global,m.events.messege,"Internet Explorer "+VMM.Browser.version+" is not supported by TimelineJS. Please update your browser to version 8 or higher.")}else{R();C();VMM.bindEvent(u,k,"LOADED");VMM.bindEvent(a,A,"LOADED");VMM.bindEvent(u,O,"UPDATE");VMM.bindEvent(a,M,"UPDATE");f.init(v);l.init(v,d.era);VMM.bindEvent(global,C,m.events.resize)}}function z(){trace("IE7 or lower");for(var e=0;e<v.length;e++)trace(v[e])}function W(){trace("UPDATE SIZE");m.width=VMM.Lib.width(r);m.height=VMM.Lib.height(r);m.nav.width=m.width;m.feature.width=m.width;m.feature.height=m.height-m.nav.height-3;VMM.Browser.device=="mobile";m.width<641?VMM.Lib.addClass(r,"vco-skinny"):VMM.Lib.removeClass(r,"vco-skinny")}function X(){v=[];VMM.fireEvent(global,m.events.messege,"Building Dates");W();for(var e=0;e<d.date.length;e++)if(d.date[e].startDate!=null&&d.date[e].startDate!=""){var t={},n=VMM.Date.parse(d.date[e].startDate,!0),r;t.startdate=n.date;t.precisiondate=n.precision;if(!isNaN(t.startdate)){d.date[e].endDate!=null&&d.date[e].endDate!=""?t.enddate=VMM.Date.parse(d.date[e].endDate):t.enddate=t.startdate;t.needs_slug=!1;d.date[e].headline==""&&d.date[e].slug!=null&&d.date[e].slug!=""&&(t.needs_slug=!0);t.title=d.date[e].headline;t.headline=d.date[e].headline;t.type=d.date[e].type;t.date=VMM.Date.prettyDate(t.startdate,!1,t.precisiondate);t.asset=d.date[e].asset;t.fulldate=t.startdate.getTime();t.text=d.date[e].text;t.content="";t.tag=d.date[e].tag;t.slug=d.date[e].slug;t.uniqueid=VMM.Util.unique_ID(7);t.classname=d.date[e].classname;v.push(t)}}d.type!="storify"&&v.sort(function(e,t){return e.fulldate-t.fulldate});if(d.headline!=null&&d.headline!=""&&d.text!=null&&d.text!=""){var i,n,t={},s=0,o;if(typeof d.startDate!="undefined"){n=VMM.Date.parse(d.startDate,!0);i=n.date}else i=!1;trace("HAS STARTPAGE");trace(i);if(i&&i<v[0].startdate)t.startdate=new Date(i);else{o=v[0].startdate;t.startdate=new Date(v[0].startdate);o.getMonth()===0&&o.getDate()==1&&o.getHours()===0&&o.getMinutes()===0?t.startdate.setFullYear(o.getFullYear()-1):o.getDate()<=1&&o.getHours()===0&&o.getMinutes()===0?t.startdate.setMonth(o.getMonth()-1):o.getHours()===0&&o.getMinutes()===0?t.startdate.setDate(o.getDate()-1):o.getMinutes()===0?t.startdate.setHours(o.getHours()-1):t.startdate.setMinutes(o.getMinutes()-1)}t.uniqueid=VMM.Util.unique_ID(7);t.enddate=t.startdate;t.precisiondate=n.precision;t.title=d.headline;t.headline=d.headline;t.text=d.text;t.type="start";t.date=VMM.Date.prettyDate(d.startDate,!1,t.precisiondate);t.asset=d.asset;t.slug=!1;t.needs_slug=!1;t.fulldate=t.startdate.getTime();m.embed&&VMM.fireEvent(global,m.events.headline,t.headline);v.unshift(t)}d.type!="storify"&&v.sort(function(e,t){return e.fulldate-t.fulldate});N()}var r,i,s,o,u,a,f,l,c="2.x",h="#timelinejs",p={},d={},v=[],m={},g=!1,y=!1,b=!1,w=!1;type.of(e)=="string"?e.match("#")?h=e:h="#"+e:h="#timelinejs";m={embed:!1,events:{data_ready:"DATAREADY",messege:"MESSEGE",headline:"HEADLINE",slide_change:"SLIDE_CHANGE",resize:"resize"},id:h,source:"nothing",type:"timeline",touch:!1,orientation:"normal",maptype:"toner",version:"2.x",preload:4,current_slide:0,hash_bookmark:!1,start_at_end:!1,start_at_slide:0,start_zoom_adjust:0,start_page:!1,api_keys:{google:"",flickr:"",twitter:""},interval:10,something:0,width:960,height:540,spacing:15,loaded:{slider:!1,timenav:!1,percentloaded:0},nav:{start_page:!1,interval_width:200,density:4,minor_width:0,minor_left:0,constraint:{left:0,right:0,right_min:0,right_max:0},zoom:{adjust:0},multiplier:{current:6,min:.1,max:50},rows:[1,1,1],width:960,height:200,marker:{width:150,height:50}},feature:{width:960,height:540},slider:{width:720,height:400,content:{width:720,height:400,padding:130,padding_default:130},nav:{width:100,height:200}},ease:"easeInOutExpo",duration:1e3,gmap_key:"",language:VMM.Language};if(t!=null&&t!=""){m.width=t;g=!0}if(n!=null&&n!=""){m.height=n;y=!0}if(window.location.hash){var E=window.location.hash.substring(1);isNaN(E)||(m.current_slide=parseInt(E))}window.onhashchange=function(){var e=window.location.hash.substring(1);m.hash_bookmark?w?_(parseInt(e)):w=!1:_(parseInt(e))};this.init=function(e,t){trace("INIT");H();S(e);x();type.of(t)=="string"&&(m.source=t);VMM.Date.setLanguage(m.language);VMM.master_config.language=m.language;VMM.ExternalAPI.setKeys(m.api_keys);VMM.ExternalAPI.googlemaps.setMapType(m.maptype);VMM.bindEvent(global,T,m.events.data_ready);VMM.bindEvent(global,I,m.events.messege);VMM.fireEvent(global,m.events.messege,m.language.messages.loading_timeline);(VMM.Browser.browser=="Explorer"||VMM.Browser.browser=="MSIE")&&parseInt(VMM.Browser.version,10)<=7&&(b=!0);type.of(m.source)=="string"||type.of(m.source)=="object"?VMM.Timeline.DataObj.getData(m.source):VMM.fireEvent(global,m.events.messege,"No data source provided")};this.iframeLoaded=function(){trace("iframeLoaded")};this.reload=function(e){trace("Load new timeline data"+e);VMM.fireEvent(global,m.events.messege,m.language.messages.loading_timeline);d={};VMM.Timeline.DataObj.getData(e);m.current_slide=0;f.setSlide(0);l.setMarker(0,m.ease,m.duration)}};VMM.Timeline.Config={}}typeof VMM.Timeline!="undefined"&&typeof VMM.Timeline.TimeNav=="undefined"&&(VMM.Timeline.TimeNav=function(e,t,n){function U(){trace("onConfigSet")}function z(e){b.nav.constraint.left=b.width/2;b.nav.constraint.right=b.nav.constraint.right_min-b.width/2;y.updateConstraint(b.nav.constraint);VMM.Lib.css(h,"left",Math.round(b.width/2)+2);VMM.Lib.css(p,"left",Math.round(b.width/2)-8);Y(b.current_slide,b.ease,b.duration,!0,e)}function W(){VMM.fireEvent(x,"UPDATE")}function X(){y.cancelSlide();if(b.nav.multiplier.current>b.nav.multiplier.min){b.nav.multiplier.current<=1?b.nav.multiplier.current=b.nav.multiplier.current-.25:b.nav.multiplier.current>5?b.nav.multiplier.current>16?b.nav.multiplier.current=Math.round(b.nav.multiplier.current-10):b.nav.multiplier.current=Math.round(b.nav.multiplier.current-4):b.nav.multiplier.current=Math.round(b.nav.multiplier.current-1);b.nav.multiplier.current<=0&&(b.nav.multiplier.current=b.nav.multiplier.min);K()}}function V(){y.cancelSlide();if(b.nav.multiplier.current<b.nav.multiplier.max){b.nav.multiplier.current>4?b.nav.multiplier.current>16?b.nav.multiplier.current=Math.round(b.nav.multiplier.current+10):b.nav.multiplier.current=Math.round(b.nav.multiplier.current+4):b.nav.multiplier.current=Math.round(b.nav.multiplier.current+1);b.nav.multiplier.current>=b.nav.multiplier.max&&(b.nav.multiplier.current=b.nav.multiplier.max);K()}}function $(e){y.cancelSlide();Y(0);W()}function J(e){var t=0,n=0;e||(e=window.event);e.originalEvent&&(e=e.originalEvent);if(typeof e.wheelDeltaX!="undefined"){t=e.wheelDeltaY/6;Math.abs(e.wheelDeltaX)>Math.abs(e.wheelDeltaY)?t=e.wheelDeltaX/6:t=0}if(t){e.preventDefault&&e.preventDefault();e.returnValue=!1}n=VMM.Lib.position(r).left+t;n>b.nav.constraint.left?n=b.width/2:n<b.nav.constraint.right&&(n=b.nav.constraint.right);VMM.Lib.css(r,"left",n)}function K(){trace("config.nav.multiplier "+b.nav.multiplier.current);ut(!0);at(!0);ft(a,k,!0,!0);ft(f,L,!0);b.nav.constraint.left=b.width/2;b.nav.constraint.right=b.nav.constraint.right_min-b.width/2;y.updateConstraint(b.nav.constraint)}function Q(e){y.cancelSlide();Y(e.data.number);W()}function G(e){VMM.Lib.toggleClass(e.data.elem,"zFront")}function Y(e,t,n,i,s){trace("GO TO MARKER");var o=b.ease,u=b.duration,a=!1,f=!1;O=e;H.left=b.width/2-C[O].pos_left;H.visible.left=Math.abs(H.left)-100;H.visible.right=Math.abs(H.left)+b.width+100;O==0&&(f=!0);O+1==C.length&&(a=!0);t!=null&&t!=""&&(o=t);n!=null&&n!=""&&(u=n);for(var l=0;l<C.length;l++)VMM.Lib.removeClass(C[l].marker,"active");if(b.start_page&&C[0].type=="start"){VMM.Lib.visible(C[0].marker,!1);VMM.Lib.addClass(C[0].marker,"start")}VMM.Lib.addClass(C[O].marker,"active");VMM.Lib.stop(r);VMM.Lib.animate(r,u,o,{left:H.left})}function Z(e,t){VMM.Lib.animate(r,t.time/2,b.ease,{left:t.left})}function et(){var e=0,t=0,n=0,r=[],i=0;for(i=0;i<C.length;i++)if(T[i].type!="start"){var s=ot(F,C[i].relative_pos),e=t;t=s.begin;n=t-e;r.push(n)}return VMM.Util.average(r).mean}function tt(){var e=0,t=0,n="",r=0,i=[],s=!0,o=0;for(o=0;o<T.length;o++)if(T[o].type=="start")trace("DATA DATE IS START");else{n=T[o].startdate;e=t;t=n;r=t-e;i.push(r)}return VMM.Util.average(i)}function nt(){var e=b.nav.multiplier.current,t=0;for(t=0;t<e;t++)et()<75&&b.nav.multiplier.current>1&&(b.nav.multiplier.current=b.nav.multiplier.current-1)}function rt(){var e=it(T[0].startdate),t=it(T[T.length-1].enddate);R.eon.type="eon";R.eon.first=e.eons;R.eon.base=Math.floor(e.eons);R.eon.last=t.eons;R.eon.number=S.eons;R.eon.multiplier=B.eons;R.eon.minor=B.eons;R.era.type="era";R.era.first=e.eras;R.era.base=Math.floor(e.eras);R.era.last=t.eras;R.era.number=S.eras;R.era.multiplier=B.eras;R.era.minor=B.eras;R.epoch.type="epoch";R.epoch.first=e.epochs;R.epoch.base=Math.floor(e.epochs);R.epoch.last=t.epochs;R.epoch.number=S.epochs;R.epoch.multiplier=B.epochs;R.epoch.minor=B.epochs;R.age.type="age";R.age.first=e.ages;R.age.base=Math.floor(e.ages);R.age.last=t.ages;R.age.number=S.ages;R.age.multiplier=B.ages;R.age.minor=B.ages;R.millenium.type="millenium";R.millenium.first=e.milleniums;R.millenium.base=Math.floor(e.milleniums);R.millenium.last=t.milleniums;R.millenium.number=S.milleniums;R.millenium.multiplier=B.millenium;R.millenium.minor=B.millenium;R.century.type="century";R.century.first=e.centuries;R.century.base=Math.floor(e.centuries);R.century.last=t.centuries;R.century.number=S.centuries;R.century.multiplier=B.century;R.century.minor=B.century;R.decade.type="decade";R.decade.first=e.decades;R.decade.base=Math.floor(e.decades);R.decade.last=t.decades;R.decade.number=S.decades;R.decade.multiplier=B.decade;R.decade.minor=B.decade;R.year.type="year";R.year.first=e.years;R.year.base=Math.floor(e.years);R.year.last=t.years;R.year.number=S.years;R.year.multiplier=1;R.year.minor=B.month;R.month.type="month";R.month.first=e.months;R.month.base=Math.floor(e.months);R.month.last=t.months;R.month.number=S.months;R.month.multiplier=1;R.month.minor=Math.round(B.week);R.week.type="week";R.week.first=e.weeks;R.week.base=Math.floor(e.weeks);R.week.last=t.weeks;R.week.number=S.weeks;R.week.multiplier=1;R.week.minor=7;R.day.type="day";R.day.first=e.days;R.day.base=Math.floor(e.days);R.day.last=t.days;R.day.number=S.days;R.day.multiplier=1;R.day.minor=24;R.hour.type="hour";R.hour.first=e.hours;R.hour.base=Math.floor(e.hours);R.hour.last=t.hours;R.hour.number=S.hours;R.hour.multiplier=1;R.hour.minor=60;R.minute.type="minute";R.minute.first=e.minutes;R.minute.base=Math.floor(e.minutes);R.minute.last=t.minutes;R.minute.number=S.minutes;R.minute.multiplier=1;R.minute.minor=60;R.second.type="decade";R.second.first=e.seconds;R.second.base=Math.floor(e.seconds);R.second.last=t.seconds;R.second.number=S.seconds;R.second.multiplier=1;R.second.minor=10}function it(e,t){var n={};n.days=e/j.day;n.weeks=n.days/j.week;n.months=n.days/j.month;n.years=n.months/j.year;n.hours=n.days*j.hour;n.minutes=n.days*j.minute;n.seconds=n.days*j.second;n.decades=n.years/j.decade;n.centuries=n.years/j.century;n.milleniums=n.years/j.millenium;n.ages=n.years/j.age;n.epochs=n.years/j.epoch;n.eras=n.years/j.era;n.eons=n.years/j.eon;return n}function st(e,t,n){var r,i,s=e.type,o={start:"",end:"",type:s};r=it(t);o.start=t.months;s=="eon"?o.start=r.eons:s=="era"?o.start=r.eras:s=="epoch"?o.start=r.epochs:s=="age"?o.start=r.ages:s=="millenium"?o.start=t.milleniums:s=="century"?o.start=r.centuries:s=="decade"?o.start=r.decades:s=="year"?o.start=r.years:s=="month"?o.start=r.months:s=="week"?o.start=r.weeks:s=="day"?o.start=r.days:s=="hour"?o.start=r.hours:s=="minute"&&(o.start=r.minutes);if(type.of(n)=="date"){i=it(n);o.end=n.months;s=="eon"?o.end=i.eons:s=="era"?o.end=i.eras:s=="epoch"?o.end=i.epochs:s=="age"?o.end=i.ages:s=="millenium"?o.end=n.milleniums:s=="century"?o.end=i.centuries:s=="decade"?o.end=i.decades:s=="year"?o.end=i.years:s=="month"?o.end=i.months:s=="week"?o.end=i.weeks:s=="day"?o.end=i.days:s=="hour"?o.end=i.hours:s=="minute"&&(o.end=i.minutes)}else o.end=o.start;return o}function ot(e,t){return{begin:(t.start-F.base)*(b.nav.interval_width/b.nav.multiplier.current),end:(t.end-F.base)*(b.nav.interval_width/b.nav.multiplier.current)}}function ut(e){var t=2,n=0,i=-2,s=0,o=0,u=150,a=6,f=0,l=b.width,c=[],h=6,p={left:H.visible.left-l,right:H.visible.right+l},d=0,v=0;b.nav.minor_width=b.width;VMM.Lib.removeClass(".flag","row1");VMM.Lib.removeClass(".flag","row2");VMM.Lib.removeClass(".flag","row3");for(d=0;d<C.length;d++){var m,g=C[d],y=ot(F,C[d].relative_pos),w=0,E=!1,S={id:d,pos:0,row:0},x=0;y.begin=Math.round(y.begin+i);y.end=Math.round(y.end+i);m=Math.round(y.end-y.begin);g.pos_left=y.begin;if(O==d){H.left=b.width/2-y;H.visible.left=Math.abs(H.left);H.visible.right=Math.abs(H.left)+b.width;p.left=H.visible.left-l;p.right=H.visible.right+l}Math.abs(y.begin)>=p.left&&Math.abs(y.begin)<=p.right&&(E=!0);if(e){VMM.Lib.stop(g.marker);VMM.Lib.animate(g.marker,b.duration/2,b.ease,{left:y.begin})}else{VMM.Lib.stop(g.marker);VMM.Lib.css(g.marker,"left",y.begin)}d==O&&(f=y.begin);if(m>5){VMM.Lib.css(g.lineevent,"height",a);VMM.Lib.css(g.lineevent,"top",u);e?VMM.Lib.animate(g.lineevent,b.duration/2,b.ease,{width:m}):VMM.Lib.css(g.lineevent,"width",m)}if(A.length>0){for(v=0;v<A.length;v++)if(v<b.nav.rows.current.length&&g.tag==A[v]){t=v;if(v==b.nav.rows.current.length-1){trace("ON LAST ROW");VMM.Lib.addClass(g.flag,"flag-small-last")}}w=b.nav.rows.current[t]}else{if(y.begin-n.begin<b.nav.marker.width+b.spacing)if(t<b.nav.rows.current.length-1)t++;else{t=0;s++}else{s=1;t=1}w=b.nav.rows.current[t]}n=y;S.pos=y;S.row=t;c.push(S);c.length>h&&c.remove(0);if(e){VMM.Lib.stop(g.flag);VMM.Lib.animate(g.flag,b.duration,b.ease,{top:w})}else{VMM.Lib.stop(g.flag);VMM.Lib.css(g.flag,"top",w)}b.start_page&&C[d].type=="start"&&VMM.Lib.visible(g.marker,!1);y>b.nav.minor_width&&(b.nav.minor_width=y);y<b.nav.minor_left&&(b.nav.minor_left=y)}if(e){VMM.Lib.stop(r);VMM.Lib.animate(r,b.duration/2,b.ease,{left:b.width/2-f})}}function at(e){var t=0,n=0;for(t=0;t<N.length;t++){var r=N[t],i=ot(F,r.relative_pos),s=0,o=0,u=b.nav.marker.height*b.nav.rows.full.length,a=i.end-i.begin;if(r.tag!=""){u=b.nav.marker.height*b.nav.rows.full.length/b.nav.rows.current.length;for(n=0;n<A.length;n++)n<b.nav.rows.current.length&&r.tag==A[n]&&(o=n);s=b.nav.rows.current[o]}else s=-1;if(e){VMM.Lib.stop(r.content);VMM.Lib.stop(r.text_content);VMM.Lib.animate(r.content,b.duration/2,b.ease,{top:s,left:i.begin,width:a,height:u});VMM.Lib.animate(r.text_content,b.duration/2,b.ease,{left:i.begin})}else{VMM.Lib.stop(r.content);VMM.Lib.stop(r.text_content);VMM.Lib.css(r.content,"left",i.begin);VMM.Lib.css(r.content,"width",a);VMM.Lib.css(r.content,"height",u);VMM.Lib.css(r.content,"top",s);VMM.Lib.css(r.text_content,"left",i.begin)}}}function ft(e,t,n,r){var s=0,o=0,u=b.width,a={left:H.visible.left-u,right:H.visible.right+u};not_too_many=!0,i=0;b.nav.minor_left=0;if(t.length>100){not_too_many=!1;trace("TOO MANY "+t.length)}for(i=0;i<t.length;i++){var f=t[i].element,l=t[i].date,c=t[i].visible,h=ot(F,t[i].relative_pos),p=h.begin,v=t[i].animation,m=!0,g=!1,y=50;v.pos=p;v.animate=!1;Math.abs(p)>=a.left&&Math.abs(p)<=a.right&&(g=!0);b.nav.multiplier.current>16&&r?m=!1:p-s<65&&(p-s<35?i%4==0?p==0&&(m=!1):m=!1:VMM.Util.isEven(i)||(m=!1));if(m){if(t[i].is_detached){VMM.Lib.append(e,f);t[i].is_detached=!1}}else{t[i].is_detached=!0;VMM.Lib.detach(f)}if(c)if(!m){v.opacity="0";n&&not_too_many&&(v.animate=!0);t[i].interval_visible=!1}else{v.opacity="100";n&&g&&(v.animate=!0)}else{v.opacity="100";if(m){n&&not_too_many?v.animate=!0:n&&g&&(v.animate=!0);t[i].interval_visible=!0}else n&&not_too_many&&(v.animate=!0)}s=p;p>b.nav.minor_width&&(b.nav.minor_width=p);p<b.nav.minor_left&&(b.nav.minor_left=p);if(v.animate)VMM.Lib.animate(f,b.duration/2,b.ease,{opacity:v.opacity,left:v.pos});else{VMM.Lib.css(f,"opacity",v.opacity);VMM.Lib.css(f,"left",p)}}b.nav.constraint.right_min=-b.nav.minor_width+b.width;b.nav.constraint.right=b.nav.constraint.right_min+b.width/2;VMM.Lib.css(d,"left",b.nav.minor_left-b.width/2);VMM.Lib.width(d,b.nav.minor_width+b.width+Math.abs(b.nav.minor_left))}function lt(e,t,n){var r=0,i=!0,s=0,o=0,u,a,f,l=Math.ceil(e.number)+2,c={flag:!1,offset:0},h=0;VMM.attachElement(n,"");e.date=new Date(T[0].startdate.getFullYear(),0,1,0,0,0);u=e.date.getTimezoneOffset();for(h=0;h<l;h++){trace(e.type);var p=!1,v={element:VMM.appendAndGetElement(n,"<div>",e.classname),date:new Date(T[0].startdate.getFullYear(),0,1,0,0,0),visible:!1,date_string:"",type:e.interval_type,relative_pos:0,is_detached:!1,animation:{animate:!1,pos:"",opacity:"100"}};if(e.type=="eon"){i&&(a=Math.floor(T[0].startdate.getFullYear()/5e8)*5e8);v.date.setFullYear(a+r*5e8);p=!0}else if(e.type=="era"){i&&(a=Math.floor(T[0].startdate.getFullYear()/1e8)*1e8);v.date.setFullYear(a+r*1e8);p=!0}else if(e.type=="epoch"){i&&(a=Math.floor(T[0].startdate.getFullYear()/1e7)*1e7);v.date.setFullYear(a+r*1e7);p=!0}else if(e.type=="age"){i&&(a=Math.floor(T[0].startdate.getFullYear()/1e6)*1e6);v.date.setFullYear(a+r*1e6);p=!0}else if(e.type=="millenium"){i&&(a=Math.floor(T[0].startdate.getFullYear()/1e3)*1e3);v.date.setFullYear(a+r*1e3);p=!0}else if(e.type=="century"){i&&(a=Math.floor(T[0].startdate.getFullYear()/100)*100);v.date.setFullYear(a+r*100);p=!0}else if(e.type=="decade"){i&&(a=Math.floor(T[0].startdate.getFullYear()/10)*10);v.date.setFullYear(a+r*10);p=!0}else if(e.type=="year"){i&&(a=T[0].startdate.getFullYear());v.date.setFullYear(a+r);p=!0}else if(e.type=="month"){i&&(a=T[0].startdate.getMonth());v.date.setMonth(a+r)}else if(e.type=="week"){i&&(a=T[0].startdate.getMonth());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(a+r*7)}else if(e.type=="day"){i&&(a=T[0].startdate.getDate());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(a+r)}else if(e.type=="hour"){i&&(a=T[0].startdate.getHours());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(T[0].startdate.getDate());v.date.setHours(a+r)}else if(e.type=="minute"){i&&(a=T[0].startdate.getMinutes());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(T[0].startdate.getDate());v.date.setHours(T[0].startdate.getHours());v.date.setMinutes(a+r)}else if(e.type=="second"){i&&(a=T[0].startdate.getSeconds());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(T[0].startdate.getDate());v.date.setHours(T[0].startdate.getHours());v.date.setMinutes(T[0].startdate.getMinutes());v.date.setSeconds(a+r)}else if(e.type=="millisecond"){i&&(a=T[0].startdate.getMilliseconds());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(T[0].startdate.getDate());v.date.setHours(T[0].startdate.getHours());v.date.setMinutes(T[0].startdate.getMinutes());v.date.setSeconds(T[0].startdate.getSeconds());v.date.setMilliseconds(a+r)}if(VMM.Browser.browser=="Firefox")if(v.date.getFullYear()=="1970"&&v.date.getTimezoneOffset()!=u){trace("FIREFOX 1970 TIMEZONE OFFSET "+v.date.getTimezoneOffset()+" SHOULD BE "+u);trace(e.type+" "+e.date);c.offset=v.date.getTimezoneOffset()/60;c.flag=!0;v.date.setHours(v.date.getHours()+c.offset)}else if(c.flag){c.flag=!1;v.date.setHours(v.date.getHours()+c.offset);p&&(c.flag=!0)}p?v.date.getFullYear()<0?v.date_string=Math.abs(v.date.getFullYear()).toString()+" B.C.":v.date_string=v.date.getFullYear():v.date_string=VMM.Date.prettyDate(v.date,!0);r+=1;i=!1;v.relative_pos=st(F,v.date);s=v.relative_pos.begin;v.relative_pos.begin>o&&(o=v.relative_pos.begin);VMM.appendElement(v.element,v.date_string);VMM.Lib.css(v.element,"text-indent",-(VMM.Lib.width(v.element)/2));VMM.Lib.css(v.element,"opacity","0");t.push(v)}VMM.Lib.width(d,o);ft(n,t)}function ct(){var e=0,t=0;VMM.attachElement(x,"");r=VMM.appendAndGetElement(x,"<div>","timenav");s=VMM.appendAndGetElement(r,"<div>","content");o=VMM.appendAndGetElement(r,"<div>","time");u=VMM.appendAndGetElement(o,"<div>","time-interval-minor");d=VMM.appendAndGetElement(u,"<div>","minor");f=VMM.appendAndGetElement(o,"<div>","time-interval-major");a=VMM.appendAndGetElement(o,"<div>","time-interval");l=VMM.appendAndGetElement(x,"<div>","timenav-background");h=VMM.appendAndGetElement(l,"<div>","timenav-line");p=VMM.appendAndGetElement(l,"<div>","timenav-indicator");c=VMM.appendAndGetElement(l,"<div>","timenav-interval-background","<div class='top-highlight'></div>");v=VMM.appendAndGetElement(x,"<div>","vco-toolbar");ht();pt();dt();nt();ut(!1);at();ft(a,k,!1,!0);ft(f,L);if(b.start_page){$backhome=VMM.appendAndGetElement(v,"<div>","back-home","<div class='icon'></div>");VMM.bindEvent(".back-home",$,"click");VMM.Lib.attribute($backhome,"title",VMM.master_config.language.messages.return_to_title);VMM.Lib.attribute($backhome,"rel","timeline-tooltip")}y=new VMM.DragSlider;y.createPanel(x,r,b.nav.constraint,b.touch);if(b.touch&&b.start_page){VMM.Lib.addClass(v,"touch");VMM.Lib.css(v,"top",55);VMM.Lib.css(v,"left",10)}else{b.start_page&&VMM.Lib.css(v,"top",27);m=VMM.appendAndGetElement(v,"<div>","zoom-in","<div class='icon'></div>");g=VMM.appendAndGetElement(v,"<div>","zoom-out","<div class='icon'></div>");VMM.bindEvent(m,X,"click");VMM.bindEvent(g,V,"click");VMM.Lib.attribute(m,"title",VMM.master_config.language.messages.expand_timeline);VMM.Lib.attribute(m,"rel","timeline-tooltip");VMM.Lib.attribute(g,"title",VMM.master_config.language.messages.contract_timeline);VMM.Lib.attribute(g,"rel","timeline-tooltip");v.tooltip({selector:"div[rel=timeline-tooltip]",placement:"right"});VMM.bindEvent(x,J,"DOMMouseScroll");VMM.bindEvent(x,J,"mousewheel")}if(b.nav.zoom.adjust!=0)if(b.nav.zoom.adjust<0)for(e=0;e<Math.abs(b.nav.zoom.adjust);e++)V();else for(t=0;t<b.nav.zoom.adjust;t++)X();M=!0;z(!0);VMM.fireEvent(x,"LOADED")}function ht(){var e=0,t=0;S=it(T[T.length-1].enddate-T[0].startdate,!0);trace(S);rt();if(S.centuries>T.length/b.nav.density){F=R.century;I=R.millenium;q=R.decade}else if(S.decades>T.length/b.nav.density){F=R.decade;I=R.century;q=R.year}else if(S.years>T.length/b.nav.density){F=R.year;I=R.decade;q=R.month}else if(S.months>T.length/b.nav.density){F=R.month;I=R.year;q=R.day}else if(S.days>T.length/b.nav.density){F=R.day;I=R.month;q=R.hour}else if(S.hours>T.length/b.nav.density){F=R.hour;I=R.day;q=R.minute}else if(S.minutes>T.length/b.nav.density){F=R.minute;I=R.hour;q=R.second}else if(S.seconds>T.length/b.nav.density){F=R.second;I=R.minute;q=R.second}else{trace("NO IDEA WHAT THE TYPE SHOULD BE");F=R.day;I=R.month;q=R.hour}trace("INTERVAL TYPE: "+F.type);trace("INTERVAL MAJOR TYPE: "+I.type);lt(F,k,a);lt(I,L,f);for(e=0;e<k.length;e++)for(t=0;t<L.length;t++)k[e].date_string==L[t].date_string&&VMM.attachElement(k[e].element,"")}function pt(){var e=2,t=0,n=0,r=0,i=0,o=0;C=[];N=[];for(r=0;r<T.length;r++){var u,a,f,c,h,p,d,v="",m=!1;u=VMM.appendAndGetElement(s,"<div>","marker");a=VMM.appendAndGetElement(u,"<div>","flag");f=VMM.appendAndGetElement(a,"<div>","flag-content");c=VMM.appendAndGetElement(u,"<div>","dot");h=VMM.appendAndGetElement(u,"<div>","line");p=VMM.appendAndGetElement(h,"<div>","event-line");_marker_relative_pos=st(F,T[r].startdate,T[r].enddate);_marker_thumb="";T[r].asset!=null&&T[r].asset!=""?VMM.appendElement(f,VMM.MediaElement.thumbnail(T[r].asset,24,24,T[r].uniqueid)):VMM.appendElement(f,"<div style='margin-right:7px;height:50px;width:2px;float:left;'></div>");if(T[r].title==""||T[r].title==" "){trace("TITLE NOTHING");if(typeof T[r].slug!="undefined"&&T[r].slug!=""){trace("SLUG");v=VMM.Util.untagify(T[r].slug);m=!0}else{var g=VMM.MediaType(T[r].asset.media);if(g.type=="quote"||g.type=="unknown"){v=VMM.Util.untagify(g.id);m=!0}else m=!1}}else if(T[r].title!=""||T[r].title!=" "){trace(T[r].title);v=VMM.Util.untagify(T[r].title);m=!0}else trace("TITLE SLUG NOT FOUND "+T[r].slug);if(m)VMM.appendElement(f,"<h3>"+v+"</h3>");else{VMM.appendElement(f,"<h3>"+v+"</h3>");VMM.appendElement(f,"<h3 id='marker_content_"+T[r].uniqueid+"'>"+v+"</h3>")}VMM.Lib.attr(u,"id",("marker_"+T[r].uniqueid).toString());VMM.bindEvent(a,Q,"",{number:r});VMM.bindEvent(a,G,"mouseenter mouseleave",{number:r,elem:a});d={marker:u,flag:a,lineevent:p,type:"marker",full:!0,relative_pos:_marker_relative_pos,tag:T[r].tag,pos_left:0};if(T[r].type=="start"){trace("BUILD MARKER HAS START PAGE");b.start_page=!0;d.type="start"}T[r].type=="storify"&&(d.type="storify");T[r].tag&&A.push(T[r].tag);C.push(d)}A=VMM.Util.deDupeArray(A);A.length>3?b.nav.rows.current=b.nav.rows.half:b.nav.rows.current=b.nav.rows.full;for(i=0;i<A.length;i++)if(i<b.nav.rows.current.length){var y=VMM.appendAndGetElement(l,"<div>","timenav-tag");VMM.Lib.addClass(y,"timenav-tag-row-"+(i+1));A.length>3?VMM.Lib.addClass(y,"timenav-tag-size-half"):VMM.Lib.addClass(y,"timenav-tag-size-full");VMM.appendElement(y,"<div><h3>"+A[i]+"</h3></div>")}if(A.length>3)for(o=0;o<C.length;o++){VMM.Lib.addClass(C[o].flag,"flag-small");C[o].full=!1}}function dt(){var e=6,t=0,n=0;for(n=0;n<_.length;n++){var r={content:VMM.appendAndGetElement(s,"<div>","era"),text_content:VMM.appendAndGetElement(a,"<div>","era"),startdate:VMM.Date.parse(_[n].startDate),enddate:VMM.Date.parse(_[n].endDate),title:_[n].headline,uniqueid:VMM.Util.unique_ID(6),tag:"",relative_pos:""},i=VMM.Date.prettyDate(r.startdate),o=VMM.Date.prettyDate(r.enddate),u="<div>&nbsp;</div>";typeof _[n].tag!="undefined"&&(r.tag=_[n].tag);r.relative_pos=st(F,r.startdate,r.enddate);VMM.Lib.attr(r.content,"id",r.uniqueid);VMM.Lib.attr(r.text_content,"id",r.uniqueid+"_text");VMM.Lib.addClass(r.content,"era"+(t+1));VMM.Lib.addClass(r.text_content,"era"+(t+1));t<e?t++:t=0;VMM.appendElement(r.content,u);VMM.appendElement(r.text_content,VMM.Util.unlinkify(r.title));N.push(r)}}trace("VMM.Timeline.TimeNav");var r,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b=VMM.Timeline.Config,w,E={},S={},x=e,T=[],N=[],C=[],k=[],L=[],A=[],O=0,M=!1,_,D,P={interval_position:""},H={left:"",visible:{left:"",right:""}},B={day:24,month:12,year:10,hour:60,minute:60,second:1e3,decade:10,century:100,millenium:1e3,age:1e6,epoch:1e7,era:1e8,eon:5e8,week:4.34812141,days_in_month:30.4368499,days_in_week:7,weeks_in_month:4.34812141,weeks_in_year:52.177457,days_in_year:365.242199,hours_in_day:24},j={day:864e5,week:7,month:30.4166666667,year:12,hour:24,minute:1440,second:86400,decade:10,century:100,millenium:1e3,age:1e6,epoch:1e7,era:1e8,eon:5e8},F={type:"year",number:10,first:1970,last:2011,multiplier:100,classname:"_idd",interval_type:"interval"},I={type:"year",number:10,first:1970,last:2011,multiplier:100,classname:"major",interval_type:"interval major"},q={type:"year",number:10,first:1970,last:2011,multiplier:100,classname:"_dd_minor",interval_type:"interval minor"},R={day:{},month:{},year:{},hour:{},minute:{},second:{},decade:{},century:{},millenium:{},week:{},age:{},epoch:{},era:{},eon:{}};w=b.nav.marker.height/2;b.nav.rows={full:[1,w*2,w*4],half:[1,w,w*2,w*3,w*4,w*5],current:[]};t!=null&&t!=""&&(b.nav.width=t);n!=null&&n!=""&&(b.nav.height=n);this.init=function(e,t){trace("VMM.Timeline.TimeNav init");typeof e!="undefined"?this.setData(e,t):trace("WAITING ON DATA")};this.setData=function(e,t){if(typeof e!="undefined"){T={};T=e;_=t;ct()}else trace("NO DATA")};this.setSize=function(e,t){e!=null&&(b.width=e);t!=null&&(b.height=t);M&&z()};this.setMarker=function(e,t,n,r){Y(e,t,n)};this.getCurrentNumber=function(){return O}});typeof VMM.Timeline!="undefined"&&typeof VMM.Timeline.DataObj=="undefined"&&(VMM.Timeline.DataObj={data_obj:{},model_array:[],getData:function(e){VMM.Timeline.DataObj.data_obj={};VMM.fireEvent(global,VMM.Timeline.Config.events.messege,VMM.Timeline.Config.language.messages.loading_timeline);if(type.of(e)=="object"){trace("DATA SOURCE: JSON OBJECT");VMM.Timeline.DataObj.parseJSON(e)}else if(type.of(e)=="string")if(e.match("%23")){trace("DATA SOURCE: TWITTER SEARCH");VMM.Timeline.DataObj.model.tweets.getData("%23medill")}else if(e.match("spreadsheet")){trace("DATA SOURCE: GOOGLE SPREADSHEET");VMM.Timeline.DataObj.model.googlespreadsheet.getData(e)}else if(e.match("storify.com")){trace("DATA SOURCE: STORIFY");VMM.Timeline.DataObj.model.storify.getData(e)}else if(e.match(".jsonp")){trace("DATA SOURCE: JSONP");LoadLib
.js(e,VMM.Timeline.DataObj.onJSONPLoaded)}else{trace("DATA SOURCE: JSON");var t="";e.indexOf("?")>-1?t=e+"&callback=onJSONP_Data":t=e+"?callback=onJSONP_Data";VMM.getJSON(t,VMM.Timeline.DataObj.parseJSON)}else if(type.of(e)=="html"){trace("DATA SOURCE: HTML");VMM.Timeline.DataObj.parseHTML(e)}else trace("DATA SOURCE: UNKNOWN")},onJSONPLoaded:function(){trace("JSONP IS LOADED");VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,storyjs_jsonp_data)},parseHTML:function(e){trace("parseHTML");trace("WARNING: THIS IS STILL ALPHA AND WILL NOT WORK WITH ID's other than #timeline");var t=VMM.Timeline.DataObj.data_template_obj;if(VMM.Lib.find("#timeline section","time")[0]){t.timeline.startDate=VMM.Lib.html(VMM.Lib.find("#timeline section","time")[0]);t.timeline.headline=VMM.Lib.html(VMM.Lib.find("#timeline section","h2"));t.timeline.text=VMM.Lib.html(VMM.Lib.find("#timeline section","article"));var n=!1;if(VMM.Lib.find("#timeline section","figure img").length!=0){n=!0;t.timeline.asset.media=VMM.Lib.attr(VMM.Lib.find("#timeline section","figure img"),"src")}else if(VMM.Lib.find("#timeline section","figure a").length!=0){n=!0;t.timeline.asset.media=VMM.Lib.attr(VMM.Lib.find("#timeline section","figure a"),"href")}if(n){VMM.Lib.find("#timeline section","cite").length!=0&&(t.timeline.asset.credit=VMM.Lib.html(VMM.Lib.find("#timeline section","cite")));VMM.Lib.find(this,"figcaption").length!=0&&(t.timeline.asset.caption=VMM.Lib.html(VMM.Lib.find("#timeline section","figcaption")))}}VMM.Lib.each("#timeline li",function(e,n){var r=!1,i={type:"default",startDate:"",headline:"",text:"",asset:{media:"",credit:"",caption:""},tags:"Optional"};if(VMM.Lib.find(this,"time")!=0){r=!0;i.startDate=VMM.Lib.html(VMM.Lib.find(this,"time")[0]);VMM.Lib.find(this,"time")[1]&&(i.endDate=VMM.Lib.html(VMM.Lib.find(this,"time")[1]));i.headline=VMM.Lib.html(VMM.Lib.find(this,"h3"));i.text=VMM.Lib.html(VMM.Lib.find(this,"article"));var s=!1;if(VMM.Lib.find(this,"figure img").length!=0){s=!0;i.asset.media=VMM.Lib.attr(VMM.Lib.find(this,"figure img"),"src")}else if(VMM.Lib.find(this,"figure a").length!=0){s=!0;i.asset.media=VMM.Lib.attr(VMM.Lib.find(this,"figure a"),"href")}if(s){VMM.Lib.find(this,"cite").length!=0&&(i.asset.credit=VMM.Lib.html(VMM.Lib.find(this,"cite")));VMM.Lib.find(this,"figcaption").length!=0&&(i.asset.caption=VMM.Lib.html(VMM.Lib.find(this,"figcaption")))}trace(i);t.timeline.date.push(i)}});VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,t)},parseJSON:function(e){trace("parseJSON");if(e.timeline.type=="default"){trace("DATA SOURCE: JSON STANDARD TIMELINE");VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,e)}else if(e.timeline.type=="twitter"){trace("DATA SOURCE: JSON TWEETS");VMM.Timeline.DataObj.model_Tweets.buildData(e)}else{trace("DATA SOURCE: UNKNOWN JSON");trace(type.of(e.timeline))}},model:{googlespreadsheet:{getData:function(e){function u(){t=VMM.getJSON(i,function(e){clearTimeout(s);VMM.Timeline.DataObj.model.googlespreadsheet.buildData(e)}).error(function(e,t,n){trace("Google Docs ERROR");trace("Google Docs ERROR: "+t+" "+e.responseText)}).success(function(e){clearTimeout(s)})}var t,n,r,i,s,o=0;n=VMM.Util.getUrlVars(e).key;r=VMM.Util.getUrlVars(e).worksheet;typeof r=="undefined"&&(r="od6");i="https://spreadsheets.google.com/feeds/list/"+n+"/"+r+"/public/values?alt=json";s=setTimeout(function(){trace("Google Docs timeout "+i);trace(i);if(o<3){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Still waiting on Google Docs, trying again "+o);o++;t.abort();u()}else VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Google Docs is not responding")},16e3);u()},buildData:function(e){function r(e){return typeof e!="undefined"?e.$t:""}var t=VMM.Timeline.DataObj.data_template_obj,n=!1;VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Parsing Google Doc Data");if(typeof e.feed.entry!="undefined"){n=!0;for(var i=0;i<e.feed.entry.length;i++){var s=e.feed.entry[i],o="";typeof s.gsx$type!="undefined"?o=s.gsx$type.$t:typeof s.gsx$titleslide!="undefined"&&(o=s.gsx$titleslide.$t);if(o.match("start")||o.match("title")){t.timeline.startDate=r(s.gsx$startdate);t.timeline.headline=r(s.gsx$headline);t.timeline.asset.media=r(s.gsx$media);t.timeline.asset.caption=r(s.gsx$mediacaption);t.timeline.asset.credit=r(s.gsx$mediacredit);t.timeline.text=r(s.gsx$text);t.timeline.type="google spreadsheet"}else if(o.match("era")){var u={startDate:r(s.gsx$startdate),endDate:r(s.gsx$enddate),headline:r(s.gsx$headline),text:r(s.gsx$text),tag:r(s.gsx$tag)};t.timeline.era.push(u)}else{var a={type:"google spreadsheet",startDate:r(s.gsx$startdate),endDate:r(s.gsx$enddate),headline:r(s.gsx$headline),text:r(s.gsx$text),tag:r(s.gsx$tag),asset:{media:r(s.gsx$media),credit:r(s.gsx$mediacredit),caption:r(s.gsx$mediacaption),thumbnail:r(s.gsx$mediathumbnail)}};t.timeline.date.push(a)}}}if(n){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Finished Parsing Data");VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,t)}else{VMM.fireEvent(global,VMM.Timeline.Config.events.messege,VMM.Language.messages.loading+" Google Doc Data (cells)");trace("There may be too many entries. Still trying to load data. Now trying to load cells to avoid Googles limitation on cells");VMM.Timeline.DataObj.model.googlespreadsheet.getDataCells(e.feed.link[0].href)}},getDataCells:function(e){function o(){t=VMM.getJSON(r,function(e){clearTimeout(i);VMM.Timeline.DataObj.model.googlespreadsheet.buildDataCells(e)}).error(function(e,t,n){trace("Google Docs ERROR");trace("Google Docs ERROR: "+t+" "+e.responseText)}).success(function(e){clearTimeout(i)})}var t,n,r,i,s=0;n=VMM.Util.getUrlVars(e).key;r="https://spreadsheets.google.com/feeds/cells/"+n+"/od6/public/values?alt=json";i=setTimeout(function(){trace("Google Docs timeout "+r);trace(r);if(s<3){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Still waiting on Google Docs, trying again "+s);s++;t.abort();o()}else VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Google Docs is not responding")},16e3);o()},buildDataCells:function(e){function a(e){return typeof e!="undefined"?e.$t:""}var t=VMM.Timeline.DataObj.data_template_obj,n=!1,r=["timeline"],i=[],s=0,o=0,u=0;VMM.fireEvent(global,VMM.Timeline.Config.events.messege,VMM.Language.messages.loading_timeline+" Parsing Google Doc Data (cells)");if(typeof e.feed.entry!="undefined"){n=!0;for(o=0;o<e.feed.entry.length;o++){var f=e.feed.entry[o];parseInt(f.gs$cell.row)>s&&(s=parseInt(f.gs$cell.row))}for(var o=0;o<s+1;o++){var l={type:"",startDate:"",endDate:"",headline:"",text:"",tag:"",asset:{media:"",credit:"",caption:"",thumbnail:""}};i.push(l)}for(o=0;o<e.feed.entry.length;o++){var f=e.feed.entry[o],c="",h="",p={content:a(f.gs$cell),col:f.gs$cell.col,row:f.gs$cell.row,name:""};if(p.row==1){p.content=="Start Date"?h="startDate":p.content=="End Date"?h="endDate":p.content=="Headline"?h="headline":p.content=="Text"?h="text":p.content=="Media"?h="media":p.content=="Media Credit"?h="credit":p.content=="Media Caption"?h="caption":p.content=="Media Thumbnail"?h="thumbnail":p.content=="Type"?h="type":p.content=="Tag"&&(h="tag");r.push(h)}else{p.name=r[p.col];i[p.row][p.name]=p.content}}for(o=0;o<i.length;o++){var l=i[o];if(l.type.match("start")||l.type.match("title")){t.timeline.startDate=l.startDate;t.timeline.headline=l.headline;t.timeline.asset.media=l.media;t.timeline.asset.caption=l.caption;t.timeline.asset.credit=l.credit;t.timeline.text=l.text;t.timeline.type="google spreadsheet"}else if(l.type.match("era")){var d={startDate:l.startDate,endDate:l.endDate,headline:l.headline,text:l.text,tag:l.tag};t.timeline.era.push(d)}else{var l={type:"google spreadsheet",startDate:l.startDate,endDate:l.endDate,headline:l.headline,text:l.text,tag:l.tag,asset:{media:l.media,credit:l.credit,caption:l.caption,thumbnail:l.thumbnail}};t.timeline.date.push(l)}}}if(n){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Finished Parsing Data");VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,t)}else VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Unable to load Google Doc data source")}},storify:{getData:function(e){var t,n,r;VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Loading Storify...");t=e.split("storify.com/")[1];n="http://api.storify.com/v1/stories/"+t+"?per_page=300&callback=?";r=setTimeout(function(){trace("STORIFY timeout");VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Storify is not responding")},6e3);VMM.getJSON(n,VMM.Timeline.DataObj.model.storify.buildData).error(function(e,t,n){trace("STORIFY error");trace("STORIFY ERROR: "+t+" "+e.responseText)}).success(function(e){clearTimeout(r)})},buildData:function(e){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Parsing Data");var t=VMM.Timeline.DataObj.data_template_obj;t.timeline.startDate=new Date(e.content.date.created);t.timeline.headline=e.content.title;trace(e);var n="",r=e.content.author.username,i="";if(typeof e.content.author.name!="undefined"){r=e.content.author.name;i=e.content.author.username+"&nbsp;"}typeof e.content.description!="undefined"&&e.content.description!=null&&(n+=e.content.description);n+="<div class='storify'>";n+="<div class='vcard author'><a class='screen-name url' href='"+e.content.author.permalink+"' target='_blank'>";n+="<span class='avatar'><img src='"+e.content.author.avatar+"' style='max-width: 32px; max-height: 32px;'></span>";n+="<span class='fn'>"+r+"</span>";n+="<span class='nickname'>"+i+"<span class='thumbnail-inline'></span></span>";n+="</a>";n+="</div>";n+="</div>";t.timeline.text=n;t.timeline.asset.media=e.content.thumbnail;t.timeline.type="storify";for(var s=0;s<e.content.elements.length;s++){var o=e.content.elements[s],u=!1,a=new Date(o.posted_at);trace(o.type);var f={type:"storify",startDate:o.posted_at,endDate:o.posted_at,headline:" ",slug:"",text:"",asset:{media:"",credit:"",caption:""}};if(o.type=="image"){if(typeof o.source.name!="undefined")if(o.source.name=="flickr"){f.asset.media="http://flickr.com/photos/"+o.meta.pathalias+"/"+o.meta.id+"/";f.asset.credit="<a href='"+f.asset.media+"'>"+o.attribution.name+"</a>";f.asset.credit+=" on <a href='"+o.source.href+"'>"+o.source.name+"</a>"}else if(o.source.name=="instagram"){f.asset.media=o.permalink;f.asset.credit="<a href='"+o.permalink+"'>"+o.attribution.name+"</a>";f.asset.credit+=" on <a href='"+o.source.href+"'>"+o.source.name+"</a>"}else{f.asset.credit="<a href='"+o.permalink+"'>"+o.attribution.name+"</a>";typeof o.source.href!="undefined"&&(f.asset.credit+=" on <a href='"+o.source.href+"'>"+o.source.name+"</a>");f.asset.media=o.data.image.src}else{f.asset.credit="<a href='"+o.permalink+"'>"+o.attribution.name+"</a>";f.asset.media=o.data.image.src}f.slug=o.attribution.name;if(typeof o.data.image.caption!="undefined"&&o.data.image.caption!="undefined"){f.asset.caption=o.data.image.caption;f.slug=o.data.image.caption}}else if(o.type=="quote"){if(o.permalink.match("twitter")){f.asset.media=o.permalink;f.slug=VMM.Util.untagify(o.data.quote.text)}else if(o.permalink.match("storify")){u=!0;f.asset.media="<blockquote>"+o.data.quote.text.replace(/<\s*\/?\s*b\s*.*?>/g,"")+"</blockquote>"}}else if(o.type=="link"){f.headline=o.data.link.title;f.text=o.data.link.description;o.data.link.thumbnail!="undefined"&&o.data.link.thumbnail!=""?f.asset.media=o.data.link.thumbnail:f.asset.media=o.permalink;f.asset.caption="<a href='"+o.permalink+"' target='_blank'>"+o.data.link.title+"</a>";f.slug=o.data.link.title}else if(o.type=="text"){if(o.permalink.match("storify")){u=!0;var l=e.content.author.username,c="";if(typeof o.attribution.name!="undefined"){r=o.attribution.name;i=o.attribution.username+"&nbsp;"}var h="<div class='storify'>";h+="<blockquote><p>"+o.data.text.replace(/<\s*\/?\s*b\s*.*?>/g,"")+"</p></blockquote>";h+="<div class='vcard author'><a class='screen-name url' href='"+o.attribution.href+"' target='_blank'>";h+="<span class='avatar'><img src='"+o.attribution.thumbnail+"' style='max-width: 32px; max-height: 32px;'></span>";h+="<span class='fn'>"+r+"</span>";h+="<span class='nickname'>"+i+"<span class='thumbnail-inline'></span></span>";h+="</a></div></div>";f.text=h;if(s+1>=e.content.elements.length)f.startDate=e.content.elements[s-1].posted_at;else if(e.content.elements[s+1].type=="text"&&e.content.elements[s+1].permalink.match("storify"))if(s+2>=e.content.elements.length)f.startDate=e.content.elements[s-1].posted_at;else if(e.content.elements[s+2].type=="text"&&e.content.elements[s+2].permalink.match("storify"))if(s+3>=e.content.elements.length)f.startDate=e.content.elements[s-1].posted_at;else if(e.content.elements[s+3].type=="text"&&e.content.elements[s+3].permalink.match("storify"))f.startDate=e.content.elements[s-1].posted_at;else{trace("LEVEL 3");f.startDate=e.content.elements[s+3].posted_at}else{trace("LEVEL 2");f.startDate=e.content.elements[s+2].posted_at}else{trace("LEVEL 1");f.startDate=e.content.elements[s+1].posted_at}f.endDate=f.startDate}}else if(o.type=="video"){f.headline=o.data.video.title;f.asset.caption=o.data.video.description;f.asset.caption=o.source.username;f.asset.media=o.data.video.src}else{trace("NO MATCH ");trace(o)}u&&(f.slug=VMM.Util.untagify(o.data.text));t.timeline.date.push(f)}VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,t)}},tweets:{type:"twitter",buildData:function(e){VMM.bindEvent(global,VMM.Timeline.DataObj.model.tweets.onTwitterDataReady,"TWEETSLOADED");VMM.ExternalAPI.twitter.getTweets(e.timeline.tweets)},getData:function(e){VMM.bindEvent(global,VMM.Timeline.DataObj.model.tweets.onTwitterDataReady,"TWEETSLOADED");VMM.ExternalAPI.twitter.getTweetSearch(e)},onTwitterDataReady:function(e,t){var n=VMM.Timeline.DataObj.data_template_obj;for(var r=0;r<t.tweetdata.length;r++){var i={type:"tweets",startDate:"",headline:"",text:"",asset:{media:"",credit:"",caption:""},tags:"Optional"};i.startDate=t.tweetdata[r].raw.created_at;type.of(t.tweetdata[r].raw.from_user_name)?i.headline=t.tweetdata[r].raw.from_user_name+" (<a href='https://twitter.com/"+t.tweetdata[r].raw.from_user+"'>"+"@"+t.tweetdata[r].raw.from_user+"</a>)":i.headline=t.tweetdata[r].raw.user.name+" (<a href='https://twitter.com/"+t.tweetdata[r].raw.user.screen_name+"'>"+"@"+t.tweetdata[r].raw.user.screen_name+"</a>)";i.asset.media=t.tweetdata[r].content;n.timeline.date.push(i)}VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,n)}}},data_template_obj:{timeline:{headline:"",description:"",asset:{media:"",credit:"",caption:""},date:[],era:[]}},date_obj:{startDate:"2012,2,2,11,30",headline:"",text:"",asset:{media:"http://youtu.be/vjVfu8-Wp6s",credit:"",caption:""},tags:"Optional"}});VMM.debug=!1;
/*!
 * jQuery MotionCAPTCHA v0.2
 * 
 * Proof of concept only for now, check the roadmap to see when it will be ready for wider use!
 * 
 * http://josscrowcroft.com/projects/motioncaptcha-jquery-plugin/
 * 
 * DEMO: http://josscrowcroft.com/demos/motioncaptcha/
 * CODE: https://github.com/josscrowcroft/MotionCAPTCHA
 * 
 * Copyright (c) 2011 Joss Crowcroft - joss[at]josscrowcroftcom | http://www.josscrowcroft.com
 * 
 * Incoporates other open source projects, attributed below.
 */
jQuery.fn.motionCaptcha || (function($) {
	
	/**
	 * Main plugin function definition
	 */
	$.fn.motionCaptcha = function(options) {
		
		/**
		 * Act on matched form element:
		 * This could be set up to iterate over multiple elements, but tbh would it ever be useful?
		 */
		return this.each(function() {
				
			// Build main options before element iteration:
			var opts = $.extend({}, $.fn.motionCaptcha.defaults, options);
			
			// Ensure option ID params are valid #selectors:
			opts.actionId = '#' + opts.actionId.replace(/\#/g, '');
			opts.canvasId = '#' + opts.canvasId.replace(/\#/g, '');
			opts.divId = '#' + opts.divId.replace(/\#/g, '');
			opts.submitId = ( opts.submitId ) ? '#' + opts.submitId.replace(/\#/g, '') : false;

			// Plugin setup:

			// Set up Harmony vars:
			var brush,
				locked = false;
				
			// Set up MotionCAPTCHA form and jQuery elements:
			var $body = $('body'),
				$form = $(this),
				$container = $(opts.divId),
				$canvas = $(opts.canvasId);
			
			// Set up MotionCAPTCHA canvas vars:
			var canvasWidth = $canvas.width(),
				canvasHeight = $canvas.height(),
				borderLeftWidth = 1 * $canvas.css('borderLeftWidth').replace('px', ''),
				borderTopWidth = 1 * $canvas.css('borderTopWidth').replace('px', '');			

			// Canvas setup:
			
			// Set the canvas DOM element's dimensions to match the display width/height (pretty important):
			$canvas[0].width = canvasWidth;
			$canvas[0].height = canvasHeight;
			
			// Get DOM reference to canvas context:
			var ctx = $canvas[0].getContext("2d");
			
			// Add canvasWidth and canvasHeight values to context, for Ribbon brush:
			ctx.canvasWidth = canvasWidth;
			ctx.canvasHeight = canvasHeight;
			
			// Set canvas context font and fillStyle:
			ctx.font = opts.canvasFont;
			ctx.fillStyle = opts.canvasTextColor;
			
			// Set random shape
			$canvas.addClass( opts.shapes[Math.floor(Math.random() * (opts.shapes.length) )] );
			
			// Set up Dollar Recognizer and drawing vars:
			var _isDown = false,
				_holdStill = false,
				_points = [], 
				_r = new DollarRecognizer();

			// Create the Harmony Ribbon brush:
			brush = new Ribbon(ctx);
			



			// Mousedown event
			// Start Harmony brushstroke and begin recording DR points:
			var touchStartEvent = function(event) {
				if ( locked )
					return false;
				
				// Prevent default action:
				event.preventDefault();
				
				// Get mouse position inside the canvas:
				var pos = getPos(event),
					x = pos[0],
					y = pos[1];
				
				// Internal drawing var	
				_isDown = true;
				
				// Prevent jumpy-touch bug on android, no effect on other platforms:
				_holdStill = true;
				
				// Disable text selection:
				$('body').addClass('mc-noselect');
				
				// Clear canvas:
				ctx.clearRect(0, 0, canvasWidth, canvasHeight);
				
				// Start brushstroke:
				brush.strokeStart(x, y);

				// Remove 'mc-invalid' and 'mc-valid' classes from canvas:
				$canvas.removeClass('mc-invalid mc-valid');
				
				// Add the first point to the points array:
				_points = [NewPoint(x, y)];

				return false;
			}; // mousedown/touchstart event

			// Mousemove event:
			var touchMoveEvent = function(event) {
				if ( _holdStill ) {
					return _holdStill = 0;
				}
				// If mouse is down and canvas not locked:
				if ( !locked && _isDown ) {
									
					// Prevent default action:
					event.preventDefault();

					// Get mouse position inside the canvas:
					var pos = getPos(event),
						x = pos[0],
						y = pos[1];
					
					// Append point to points array:
					_points[_points.length] = NewPoint(x, y);
					
					// Do brushstroke:
					brush.stroke(x, y);
				}
				return false;
			}; // mousemove/touchmove event
			
			
			// Mouseup event:
			var touchEndEvent = function(event) {
				// If mouse is down and canvas not locked:
				if ( !locked && _isDown ) {
					_isDown = false;
					
					// Allow text-selection again:
					$('body').removeClass('mc-noselect');
					
					// Dollar Recognizer result:
					if (_points.length >= 10) {
						var result = _r.Recognize(_points);
						// Check result:
						if ( $canvas.attr('class').match(result.Name) && result.Score > 0.7 ) {
							
							// Lock the canvas:
							locked = 1;
							
							// Destroy the Harmony brush (give it time to finish drawing)
							setTimeout( brush.destroy, 500 );
							
							// Add 'mc-valid' class to canvas:
							$canvas.addClass('mc-valid');
							
							// Write success message into canvas:
							ctx.fillText(opts.successMsg, 10, 24);
							
							// Call the onSuccess function to handle the rest of the business:
							// Pass in the form, the canvas, the canvas context:
							opts.onSuccess($form, $canvas, ctx);
							
						} else {
							
							// Add 'mc-invalid' class to canvas:
							$canvas.addClass('mc-invalid');
							
							// Write error message into canvas:
							ctx.fillText(opts.errorMsg, 10, 24);
							
							// Pass off to the error callback to finish up:
							opts.onError($form, $canvas, ctx);
						}
						
					} else { // fewer than 10 points were recorded:
						
						// Add 'mc-invalid' class to canvas:
						$canvas.addClass('mc-invalid');
						
						// Write error message into canvas:
						ctx.fillText(opts.errorMsg, 10, 24);

						// Pass off to the error callback to finish up:
						opts.onError($form, $canvas, ctx);
					}
				}
				return false;
			}; // mouseup/touchend event

			// Bind events to canvas:
			$canvas.bind({
				mousedown:  touchStartEvent,
				mousemove: touchMoveEvent,
				mouseup:  touchEndEvent,
			});

			// Mobile touch events:
			$canvas[0].addEventListener('touchstart', touchStartEvent, false);
			$canvas[0].addEventListener('touchmove', touchMoveEvent, false);
			$canvas[0].addEventListener('touchend', touchEndEvent, false);

			// Add active CSS class to form:
			$form.addClass(opts.cssClass.replace(/\./, ''))

		
			/**
			 * Get X/Y mouse position, relative to (/inside) the canvas
			 * 
			 * Handles cross-browser quirks rather nicely, I feel.
			 * 
			 * @todo For 1.0, if no way to obtain coordinates, don't activate MotionCAPTCHA.
			 */
			function getPos(event) {
				var x, y;
				
				// Check for mobile first to avoid android jumpy-touch bug (iOS / Android):
				if ( event.touches && event.touches.length > 0 ) {
					// iOS/android uses event.touches, relative to entire page:
					x = event.touches[0].pageX - $canvas.offset().left + borderLeftWidth;
					y = event.touches[0].pageY - $canvas.offset().top + borderTopWidth;
				} else if ( event.offsetX ) {
					// Chrome/Safari give the event offset relative to the target event:
					x = event.offsetX - borderLeftWidth;
					y = event.offsetY - borderTopWidth;
				} else {
					// Otherwise, subtract page click from canvas offset (Firefox uses this):
					x = event.pageX - $canvas.offset().left - borderLeftWidth;
					y = event.pageY - $canvas.offset().top - borderTopWidth;
				}
				return [x,y];
			}

		}); // this.each

	} // end main plugin function
	
	
	/**
	 * Exposed default plugin settings, which can be overridden in plugin call.
	 */
	$.fn.motionCaptcha.defaults = {
		actionId: '#mc-action',     // The ID of the input containing the form action
		divId: '#mc',               // If you use an ID other than '#mc' for the placeholder, pass it in here
		canvasId: '#mc-canvas',     // The ID of the MotionCAPTCHA canvas element
		submitId: false,            // If your form has multiple submit buttons, give the ID of the main one here
		cssClass: '.mc-active',     // This CSS class is applied to the form, when the plugin is active
	
		// An array of shape names that you want MotionCAPTCHA to use:
		shapes: ['triangle', 'x', 'rectangle', 'circle', 'check', 'caret', 'zigzag', 'arrow', 'leftbracket', 'rightbracket', 'v', 'delete', 'star', 'pigtail'],
		
		// Canvas vars:
		canvasFont: '15px "Lucida Grande"',
		canvasTextColor: '#111',
		
		// These messages are displayed inside the canvas after a user finishes drawing:
		errorMsg: 'Please try again.',
		successMsg: 'Captcha passed!',
		
		// This message is displayed if the user's browser doesn't support canvas:
		noCanvasMsg: "Your browser doesn't support <canvas> - try Chrome, FF4, Safari or IE9.",
		
		// This could be any HTML string (eg. '<label>Draw this shit yo:</label>'):
		label: '<p>Please draw the shape in the box to submit the form:</p>',
		
		// Callback function to execute when a user successfully draws the shape
		// Passed in the form, the canvas and the canvas context
		// Scope (this) is active plugin options object (opts)
		// NB: The default onSuccess callback function enables the submit button, and adds the form action attribute:
		onSuccess: function($form, $canvas, ctx) {
			var opts = this,
				$submit = opts.submitId ? $form.find(opts.submitId) : $form.find('input[type=submit]:disabled');
						
			// Set the form action:
			$form.attr( 'action', $(opts.actionId).val() );
			
			// Enable the submit button:
			$submit.prop('disabled', false);
			
			return;
		},
		
		// Callback function to execute when a user successfully draws the shape
		// Passed in the form, the canvas and the canvas context
		// Scope (this) is active plugin options object (opts)
		onError: function($form, $canvas, ctx) {
			var opts = this;
			return;
		}
	};
	




	/*!
	 * Harmony | mrdoob | Ribbon Brush class
	 * http://mrdoob.com/projects/harmony/
	 */
	
	function Ribbon( ctx ) {
		this.init( ctx );
	}
	
	Ribbon.prototype = {
		ctx: null,
		X: null, 
		Y: null,
		painters: null,
		interval: null,
		init: function( ctx ) {
			var scope = this,
				userAgent = navigator.userAgent.toLowerCase(),
				brushSize = ( userAgent.search("android") > -1 || userAgent.search("iphone") > -1 ) ? 2 : 1,
				strokeColor = [0, 0, 0];
			
			this.ctx = ctx;
			this.ctx.globalCompositeOperation = 'source-over';
			
			this.X = this.ctx.canvasWidth / 2;
			this.Y = this.ctx.canvasHeight / 2;
	
			this.painters = [];
			
			// Draw each of the lines:
			for ( var i = 0; i < 38; i++ ) {
				this.painters.push({
					dx: this.ctx.canvasWidth / 2, 
					dy: this.ctx.canvasHeight / 2, 
					ax: 0, 
					ay: 0, 
					div: 0.1, 
					ease: Math.random() * 0.18 + 0.60
				});
			}
			
			// Set the ticker:
			this.interval = setInterval( update, 1000/60 );
			
			function update() {
				var i;
				
				scope.ctx.lineWidth = brushSize;			
				scope.ctx.strokeStyle = "rgba(" + strokeColor[0] + ", " + strokeColor[1] + ", " + strokeColor[2] + ", " + 0.06 + ")";
				
				for ( i = 0; i < scope.painters.length; i++ ) {
					scope.ctx.beginPath();
					scope.ctx.moveTo(scope.painters[i].dx, scope.painters[i].dy);
					
					scope.painters[i].dx -= scope.painters[i].ax = (scope.painters[i].ax + (scope.painters[i].dx - scope.X) * scope.painters[i].div) * scope.painters[i].ease;
					scope.painters[i].dy -= scope.painters[i].ay = (scope.painters[i].ay + (scope.painters[i].dy - scope.Y) * scope.painters[i].div) * scope.painters[i].ease;
					scope.ctx.lineTo(scope.painters[i].dx, scope.painters[i].dy);
					scope.ctx.stroke();
				}
			}
		},
		destroy: function() {
			clearInterval(this.interval);
		},
		strokeStart: function( X, Y ) {
			this.X = X;
			this.Y = Y
	
			for (var i = 0; i < this.painters.length; i++) {
				this.painters[i].dx = X;
				this.painters[i].dy = Y;
			}
	
			this.shouldDraw = true;
		},
		stroke: function( X, Y ) {
			this.X = X;
			this.Y = Y;
		}
	};

	
	
	/*!
	 * The $1 Unistroke Recognizer
	 * http://depts.washington.edu/aimgroup/proj/dollar/
	 * 
	 * Jacob O. Wobbrock, Ph.D. | wobbrock@u.washington.edu
	 * Andrew D. Wilson, Ph.D. | awilson@microsoft.com
	 * Yang Li, Ph.D. | yangli@cs.washington.edu
	 * 
	 * Modified to include the Protractor gesture recognizing algorithm
	 * http://www.yangl.org/pdf/protractor-chi2010.pdf
	 * 
	 * Adapted and modified for purpose by Joss Crowcroft
	 * http://www.josscrowcroft.com
	 * 
	 * The original software is distributed under the "New BSD License" agreement
	 * 
	 * Copyright (c) 2007-2011, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li. All rights reserved.
	**/
	
	// Point class
	function Point(x, y) {
		this.X = x;
		this.Y = y;
	}
	
	// Wrapper for Point class (saves mega kb when compressing the template definitions):
	function NewPoint(x, y) {
		return new Point(x, y)
	}
	
	// Rectangle class
	function Rectangle(x, y, width, height) {
		this.X = x;
		this.Y = y;
		this.Width = width;
		this.Height = height;
	}
	
	// Template class: a unistroke template
	function Template(name, points) {
		this.Name = name;
		this.Points = Resample(points, NumPoints);
		var radians = IndicativeAngle(this.Points);
		this.Points = RotateBy(this.Points, -radians);
		this.Points = ScaleTo(this.Points, SquareSize);
		this.Points = TranslateTo(this.Points, Origin);
		this.Vector = Vectorize(this.Points); // for Protractor
	}
	
	// Result class
	function Result(name, score) {
		this.Name = name;
		this.Score = score;
	}
	
	// DollarRecognizer class constants
	var NumTemplates = 16,
		NumPoints = 64,
		SquareSize = 250.0,
		Origin = NewPoint(0,0);
	
	// DollarRecognizer class
	function DollarRecognizer() {
	
		// Predefined templates for each gesture type:
		this.Templates = [];
		
		this.Templates.push( new Template("triangle", [NewPoint(137,139),NewPoint(135,141),NewPoint(133,144),NewPoint(132,146),NewPoint(130,149),NewPoint(128,151),NewPoint(126,155),NewPoint(123,160),NewPoint(120,166),NewPoint(116,171),NewPoint(112,177),NewPoint(107,183),NewPoint(102,188),NewPoint(100,191),NewPoint(95,195),NewPoint(90,199),NewPoint(86,203),NewPoint(82,206),NewPoint(80,209),NewPoint(75,213),NewPoint(73,213),NewPoint(70,216),NewPoint(67,219),NewPoint(64,221),NewPoint(61,223),NewPoint(60,225),NewPoint(62,226),NewPoint(65,225),NewPoint(67,226),NewPoint(74,226),NewPoint(77,227),NewPoint(85,229),NewPoint(91,230),NewPoint(99,231),NewPoint(108,232),NewPoint(116,233),NewPoint(125,233),NewPoint(134,234),NewPoint(145,233),NewPoint(153,232),NewPoint(160,233),NewPoint(170,234),NewPoint(177,235),NewPoint(179,236),NewPoint(186,237),NewPoint(193,238),NewPoint(198,239),NewPoint(200,237),NewPoint(202,239),NewPoint(204,238),NewPoint(206,234),NewPoint(205,230),NewPoint(202,222),NewPoint(197,216),NewPoint(192,207),NewPoint(186,198),NewPoint(179,189),NewPoint(174,183),NewPoint(170,178),NewPoint(164,171),NewPoint(161,168),NewPoint(154,160),NewPoint(148,155),NewPoint(143,150),NewPoint(138,148),NewPoint(136,148)]) );
		
		this.Templates.push( new Template("x", [NewPoint(87,142),NewPoint(89,145),NewPoint(91,148),NewPoint(93,151),NewPoint(96,155),NewPoint(98,157),NewPoint(100,160),NewPoint(102,162),NewPoint(106,167),NewPoint(108,169),NewPoint(110,171),NewPoint(115,177),NewPoint(119,183),NewPoint(123,189),NewPoint(127,193),NewPoint(129,196),NewPoint(133,200),NewPoint(137,206),NewPoint(140,209),NewPoint(143,212),NewPoint(146,215),NewPoint(151,220),NewPoint(153,222),NewPoint(155,223),NewPoint(157,225),NewPoint(158,223),NewPoint(157,218),NewPoint(155,211),NewPoint(154,208),NewPoint(152,200),NewPoint(150,189),NewPoint(148,179),NewPoint(147,170),NewPoint(147,158),NewPoint(147,148),NewPoint(147,141),NewPoint(147,136),NewPoint(144,135),NewPoint(142,137),NewPoint(140,139),NewPoint(135,145),NewPoint(131,152),NewPoint(124,163),NewPoint(116,177),NewPoint(108,191),NewPoint(100,206),NewPoint(94,217),NewPoint(91,222),NewPoint(89,225),NewPoint(87,226),NewPoint(87,224)]) );
		
		this.Templates.push( new Template("rectangle", [NewPoint(78,149),NewPoint(78,153),NewPoint(78,157),NewPoint(78,160),NewPoint(79,162),NewPoint(79,164),NewPoint(79,167),NewPoint(79,169),NewPoint(79,173),NewPoint(79,178),NewPoint(79,183),NewPoint(80,189),NewPoint(80,193),NewPoint(80,198),NewPoint(80,202),NewPoint(81,208),NewPoint(81,210),NewPoint(81,216),NewPoint(82,222),NewPoint(82,224),NewPoint(82,227),NewPoint(83,229),NewPoint(83,231),NewPoint(85,230),NewPoint(88,232),NewPoint(90,233),NewPoint(92,232),NewPoint(94,233),NewPoint(99,232),NewPoint(102,233),NewPoint(106,233),NewPoint(109,234),NewPoint(117,235),NewPoint(123,236),NewPoint(126,236),NewPoint(135,237),NewPoint(142,238),NewPoint(145,238),NewPoint(152,238),NewPoint(154,239),NewPoint(165,238),NewPoint(174,237),NewPoint(179,236),NewPoint(186,235),NewPoint(191,235),NewPoint(195,233),NewPoint(197,233),NewPoint(200,233),NewPoint(201,235),NewPoint(201,233),NewPoint(199,231),NewPoint(198,226),NewPoint(198,220),NewPoint(196,207),NewPoint(195,195),NewPoint(195,181),NewPoint(195,173),NewPoint(195,163),NewPoint(194,155),NewPoint(192,145),NewPoint(192,143),NewPoint(192,138),NewPoint(191,135),NewPoint(191,133),NewPoint(191,130),NewPoint(190,128),NewPoint(188,129),NewPoint(186,129),NewPoint(181,132),NewPoint(173,131),NewPoint(162,131),NewPoint(151,132),NewPoint(149,132),NewPoint(138,132),NewPoint(136,132),NewPoint(122,131),NewPoint(120,131),NewPoint(109,130),NewPoint(107,130),NewPoint(90,132),NewPoint(81,133),NewPoint(76,133)]) );
		
		this.Templates.push( new Template("circle", [NewPoint(127,141),NewPoint(124,140),NewPoint(120,139),NewPoint(118,139),NewPoint(116,139),NewPoint(111,140),NewPoint(109,141),NewPoint(104,144),NewPoint(100,147),NewPoint(96,152),NewPoint(93,157),NewPoint(90,163),NewPoint(87,169),NewPoint(85,175),NewPoint(83,181),NewPoint(82,190),NewPoint(82,195),NewPoint(83,200),NewPoint(84,205),NewPoint(88,213),NewPoint(91,216),NewPoint(96,219),NewPoint(103,222),NewPoint(108,224),NewPoint(111,224),NewPoint(120,224),NewPoint(133,223),NewPoint(142,222),NewPoint(152,218),NewPoint(160,214),NewPoint(167,210),NewPoint(173,204),NewPoint(178,198),NewPoint(179,196),NewPoint(182,188),NewPoint(182,177),NewPoint(178,167),NewPoint(170,150),NewPoint(163,138),NewPoint(152,130),NewPoint(143,129),NewPoint(140,131),NewPoint(129,136),NewPoint(126,139)]) );
		
		this.Templates.push( new Template("check", [NewPoint(91,185),NewPoint(93,185),NewPoint(95,185),NewPoint(97,185),NewPoint(100,188),NewPoint(102,189),NewPoint(104,190),NewPoint(106,193),NewPoint(108,195),NewPoint(110,198),NewPoint(112,201),NewPoint(114,204),NewPoint(115,207),NewPoint(117,210),NewPoint(118,212),NewPoint(120,214),NewPoint(121,217),NewPoint(122,219),NewPoint(123,222),NewPoint(124,224),NewPoint(126,226),NewPoint(127,229),NewPoint(129,231),NewPoint(130,233),NewPoint(129,231),NewPoint(129,228),NewPoint(129,226),NewPoint(129,224),NewPoint(129,221),NewPoint(129,218),NewPoint(129,212),NewPoint(129,208),NewPoint(130,198),NewPoint(132,189),NewPoint(134,182),NewPoint(137,173),NewPoint(143,164),NewPoint(147,157),NewPoint(151,151),NewPoint(155,144),NewPoint(161,137),NewPoint(165,131),NewPoint(171,122),NewPoint(174,118),NewPoint(176,114),NewPoint(177,112),NewPoint(177,114),NewPoint(175,116),NewPoint(173,118)]) );
		
		this.Templates.push( new Template("caret", [NewPoint(79,245),NewPoint(79,242),NewPoint(79,239),NewPoint(80,237),NewPoint(80,234),NewPoint(81,232),NewPoint(82,230),NewPoint(84,224),NewPoint(86,220),NewPoint(86,218),NewPoint(87,216),NewPoint(88,213),NewPoint(90,207),NewPoint(91,202),NewPoint(92,200),NewPoint(93,194),NewPoint(94,192),NewPoint(96,189),NewPoint(97,186),NewPoint(100,179),NewPoint(102,173),NewPoint(105,165),NewPoint(107,160),NewPoint(109,158),NewPoint(112,151),NewPoint(115,144),NewPoint(117,139),NewPoint(119,136),NewPoint(119,134),NewPoint(120,132),NewPoint(121,129),NewPoint(122,127),NewPoint(124,125),NewPoint(126,124),NewPoint(129,125),NewPoint(131,127),NewPoint(132,130),NewPoint(136,139),NewPoint(141,154),NewPoint(145,166),NewPoint(151,182),NewPoint(156,193),NewPoint(157,196),NewPoint(161,209),NewPoint(162,211),NewPoint(167,223),NewPoint(169,229),NewPoint(170,231),NewPoint(173,237),NewPoint(176,242),NewPoint(177,244),NewPoint(179,250),NewPoint(181,255),NewPoint(182,257)]) );
		
		this.Templates.push( new Template("zigzag", [NewPoint(307,216),NewPoint(333,186),NewPoint(356,215),NewPoint(375,186),NewPoint(399,216),NewPoint(418,186)]) );
		
		this.Templates.push( new Template("arrow", [NewPoint(68,222),NewPoint(70,220),NewPoint(73,218),NewPoint(75,217),NewPoint(77,215),NewPoint(80,213),NewPoint(82,212),NewPoint(84,210),NewPoint(87,209),NewPoint(89,208),NewPoint(92,206),NewPoint(95,204),NewPoint(101,201),NewPoint(106,198),NewPoint(112,194),NewPoint(118,191),NewPoint(124,187),NewPoint(127,186),NewPoint(132,183),NewPoint(138,181),NewPoint(141,180),NewPoint(146,178),NewPoint(154,173),NewPoint(159,171),NewPoint(161,170),NewPoint(166,167),NewPoint(168,167),NewPoint(171,166),NewPoint(174,164),NewPoint(177,162),NewPoint(180,160),NewPoint(182,158),NewPoint(183,156),NewPoint(181,154),NewPoint(178,153),NewPoint(171,153),NewPoint(164,153),NewPoint(160,153),NewPoint(150,154),NewPoint(147,155),NewPoint(141,157),NewPoint(137,158),NewPoint(135,158),NewPoint(137,158),NewPoint(140,157),NewPoint(143,156),NewPoint(151,154),NewPoint(160,152),NewPoint(170,149),NewPoint(179,147),NewPoint(185,145),NewPoint(192,144),NewPoint(196,144),NewPoint(198,144),NewPoint(200,144),NewPoint(201,147),NewPoint(199,149),NewPoint(194,157),NewPoint(191,160),NewPoint(186,167),NewPoint(180,176),NewPoint(177,179),NewPoint(171,187),NewPoint(169,189),NewPoint(165,194),NewPoint(164,196)]) );
		
		this.Templates.push( new Template("leftbracket", [NewPoint(140,124),NewPoint(138,123),NewPoint(135,122),NewPoint(133,123),NewPoint(130,123),NewPoint(128,124),NewPoint(125,125),NewPoint(122,124),NewPoint(120,124),NewPoint(118,124),NewPoint(116,125),NewPoint(113,125),NewPoint(111,125),NewPoint(108,124),NewPoint(106,125),NewPoint(104,125),NewPoint(102,124),NewPoint(100,123),NewPoint(98,123),NewPoint(95,124),NewPoint(93,123),NewPoint(90,124),NewPoint(88,124),NewPoint(85,125),NewPoint(83,126),NewPoint(81,127),NewPoint(81,129),NewPoint(82,131),NewPoint(82,134),NewPoint(83,138),NewPoint(84,141),NewPoint(84,144),NewPoint(85,148),NewPoint(85,151),NewPoint(86,156),NewPoint(86,160),NewPoint(86,164),NewPoint(86,168),NewPoint(87,171),NewPoint(87,175),NewPoint(87,179),NewPoint(87,182),NewPoint(87,186),NewPoint(88,188),NewPoint(88,195),NewPoint(88,198),NewPoint(88,201),NewPoint(88,207),NewPoint(89,211),NewPoint(89,213),NewPoint(89,217),NewPoint(89,222),NewPoint(88,225),NewPoint(88,229),NewPoint(88,231),NewPoint(88,233),NewPoint(88,235),NewPoint(89,237),NewPoint(89,240),NewPoint(89,242),NewPoint(91,241),NewPoint(94,241),NewPoint(96,240),NewPoint(98,239),NewPoint(105,240),NewPoint(109,240),NewPoint(113,239),NewPoint(116,240),NewPoint(121,239),NewPoint(130,240),NewPoint(136,237),NewPoint(139,237),NewPoint(144,238),NewPoint(151,237),NewPoint(157,236),NewPoint(159,237)]) );
		
		this.Templates.push( new Template("rightbracket", [NewPoint(112,138),NewPoint(112,136),NewPoint(115,136),NewPoint(118,137),NewPoint(120,136),NewPoint(123,136),NewPoint(125,136),NewPoint(128,136),NewPoint(131,136),NewPoint(134,135),NewPoint(137,135),NewPoint(140,134),NewPoint(143,133),NewPoint(145,132),NewPoint(147,132),NewPoint(149,132),NewPoint(152,132),NewPoint(153,134),NewPoint(154,137),NewPoint(155,141),NewPoint(156,144),NewPoint(157,152),NewPoint(158,161),NewPoint(160,170),NewPoint(162,182),NewPoint(164,192),NewPoint(166,200),NewPoint(167,209),NewPoint(168,214),NewPoint(168,216),NewPoint(169,221),NewPoint(169,223),NewPoint(169,228),NewPoint(169,231),NewPoint(166,233),NewPoint(164,234),NewPoint(161,235),NewPoint(155,236),NewPoint(147,235),NewPoint(140,233),NewPoint(131,233),NewPoint(124,233),NewPoint(117,235),NewPoint(114,238),NewPoint(112,238)]) );
		
		this.Templates.push( new Template("v", [NewPoint(89,164),NewPoint(90,162),NewPoint(92,162),NewPoint(94,164),NewPoint(95,166),NewPoint(96,169),NewPoint(97,171),NewPoint(99,175),NewPoint(101,178),NewPoint(103,182),NewPoint(106,189),NewPoint(108,194),NewPoint(111,199),NewPoint(114,204),NewPoint(117,209),NewPoint(119,214),NewPoint(122,218),NewPoint(124,222),NewPoint(126,225),NewPoint(128,228),NewPoint(130,229),NewPoint(133,233),NewPoint(134,236),NewPoint(136,239),NewPoint(138,240),NewPoint(139,242),NewPoint(140,244),NewPoint(142,242),NewPoint(142,240),NewPoint(142,237),NewPoint(143,235),NewPoint(143,233),NewPoint(145,229),NewPoint(146,226),NewPoint(148,217),NewPoint(149,208),NewPoint(149,205),NewPoint(151,196),NewPoint(151,193),NewPoint(153,182),NewPoint(155,172),NewPoint(157,165),NewPoint(159,160),NewPoint(162,155),NewPoint(164,150),NewPoint(165,148),NewPoint(166,146)]) );
		
		this.Templates.push( new Template("delete", [NewPoint(123,129),NewPoint(123,131),NewPoint(124,133),NewPoint(125,136),NewPoint(127,140),NewPoint(129,142),NewPoint(133,148),NewPoint(137,154),NewPoint(143,158),NewPoint(145,161),NewPoint(148,164),NewPoint(153,170),NewPoint(158,176),NewPoint(160,178),NewPoint(164,183),NewPoint(168,188),NewPoint(171,191),NewPoint(175,196),NewPoint(178,200),NewPoint(180,202),NewPoint(181,205),NewPoint(184,208),NewPoint(186,210),NewPoint(187,213),NewPoint(188,215),NewPoint(186,212),NewPoint(183,211),NewPoint(177,208),NewPoint(169,206),NewPoint(162,205),NewPoint(154,207),NewPoint(145,209),NewPoint(137,210),NewPoint(129,214),NewPoint(122,217),NewPoint(118,218),NewPoint(111,221),NewPoint(109,222),NewPoint(110,219),NewPoint(112,217),NewPoint(118,209),NewPoint(120,207),NewPoint(128,196),NewPoint(135,187),NewPoint(138,183),NewPoint(148,167),NewPoint(157,153),NewPoint(163,145),NewPoint(165,142),NewPoint(172,133),NewPoint(177,127),NewPoint(179,127),NewPoint(180,125)]) );
		
		this.Templates.push( new Template("star", [NewPoint(75,250),NewPoint(75,247),NewPoint(77,244),NewPoint(78,242),NewPoint(79,239),NewPoint(80,237),NewPoint(82,234),NewPoint(82,232),NewPoint(84,229),NewPoint(85,225),NewPoint(87,222),NewPoint(88,219),NewPoint(89,216),NewPoint(91,212),NewPoint(92,208),NewPoint(94,204),NewPoint(95,201),NewPoint(96,196),NewPoint(97,194),NewPoint(98,191),NewPoint(100,185),NewPoint(102,178),NewPoint(104,173),NewPoint(104,171),NewPoint(105,164),NewPoint(106,158),NewPoint(107,156),NewPoint(107,152),NewPoint(108,145),NewPoint(109,141),NewPoint(110,139),NewPoint(112,133),NewPoint(113,131),NewPoint(116,127),NewPoint(117,125),NewPoint(119,122),NewPoint(121,121),NewPoint(123,120),NewPoint(125,122),NewPoint(125,125),NewPoint(127,130),NewPoint(128,133),NewPoint(131,143),NewPoint(136,153),NewPoint(140,163),NewPoint(144,172),NewPoint(145,175),NewPoint(151,189),NewPoint(156,201),NewPoint(161,213),NewPoint(166,225),NewPoint(169,233),NewPoint(171,236),NewPoint(174,243),NewPoint(177,247),NewPoint(178,249),NewPoint(179,251),NewPoint(180,253),NewPoint(180,255),NewPoint(179,257),NewPoint(177,257),NewPoint(174,255),NewPoint(169,250),NewPoint(164,247),NewPoint(160,245),NewPoint(149,238),NewPoint(138,230),NewPoint(127,221),NewPoint(124,220),NewPoint(112,212),NewPoint(110,210),NewPoint(96,201),NewPoint(84,195),NewPoint(74,190),NewPoint(64,182),NewPoint(55,175),NewPoint(51,172),NewPoint(49,170),NewPoint(51,169),NewPoint(56,169),NewPoint(66,169),NewPoint(78,168),NewPoint(92,166),NewPoint(107,164),NewPoint(123,161),NewPoint(140,162),NewPoint(156,162),NewPoint(171,160),NewPoint(173,160),NewPoint(186,160),NewPoint(195,160),NewPoint(198,161),NewPoint(203,163),NewPoint(208,163),NewPoint(206,164),NewPoint(200,167),NewPoint(187,172),NewPoint(174,179),NewPoint(172,181),NewPoint(153,192),NewPoint(137,201),NewPoint(123,211),NewPoint(112,220),NewPoint(99,229),NewPoint(90,237),NewPoint(80,244),NewPoint(73,250),NewPoint(69,254),NewPoint(69,252)]) );
		
		this.Templates.push( new Template("pigtail", [NewPoint(81,219),NewPoint(84,218),NewPoint(86,220),NewPoint(88,220),NewPoint(90,220),NewPoint(92,219),NewPoint(95,220),NewPoint(97,219),NewPoint(99,220),NewPoint(102,218),NewPoint(105,217),NewPoint(107,216),NewPoint(110,216),NewPoint(113,214),NewPoint(116,212),NewPoint(118,210),NewPoint(121,208),NewPoint(124,205),NewPoint(126,202),NewPoint(129,199),NewPoint(132,196),NewPoint(136,191),NewPoint(139,187),NewPoint(142,182),NewPoint(144,179),NewPoint(146,174),NewPoint(148,170),NewPoint(149,168),NewPoint(151,162),NewPoint(152,160),NewPoint(152,157),NewPoint(152,155),NewPoint(152,151),NewPoint(152,149),NewPoint(152,146),NewPoint(149,142),NewPoint(148,139),NewPoint(145,137),NewPoint(141,135),NewPoint(139,135),NewPoint(134,136),NewPoint(130,140),NewPoint(128,142),NewPoint(126,145),NewPoint(122,150),NewPoint(119,158),NewPoint(117,163),NewPoint(115,170),NewPoint(114,175),NewPoint(117,184),NewPoint(120,190),NewPoint(125,199),NewPoint(129,203),NewPoint(133,208),NewPoint(138,213),NewPoint(145,215),NewPoint(155,218),NewPoint(164,219),NewPoint(166,219),NewPoint(177,219),NewPoint(182,218),NewPoint(192,216),NewPoint(196,213),NewPoint(199,212),NewPoint(201,211)]) );
		

		// $1 Gesture Recognizer API (now using Protractor instead)
		this.Recognize = function(points) {
			var b = +Infinity,
				t = 0,
				radians,
				i,
				score,
				vector;
			
			points = Resample(points, NumPoints);
			radians = IndicativeAngle(points);
			points = RotateBy(points, -radians);
			vector = Vectorize(points); // for Protractor
			
			for (i = 0; i < this.Templates.length; i++) {
				var d = OptimalCosineDistance(this.Templates[i].Vector, vector);
				if (d < b) {
					b = d; // best (least) distance
					t = i; // unistroke template
				}
			}
			return new Result(this.Templates[t].Name, 1 / b);
		};
		
	}
	
	// Helper functions:
	function Resample(points, n) {
		var I = PathLength(points) / (n - 1), // interval length
			D = 0.0,
			newpoints = new Array(points[0]),
			i;
		for (i = 1; i < points.length; i++) {
			var d = Distance(points[i - 1], points[i]);
			if ((D + d) >= I) {
				var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X),
					qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y),
					q = NewPoint(qx, qy);
				newpoints[newpoints.length] = q; // append new point 'q'
				points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
				D = 0.0;
			}
			else D += d;
		}
		// somtimes we fall a rounding-error short of adding the last point, so add it if so
		if (newpoints.length == n - 1) {
			newpoints[newpoints.length] = NewPoint(points[points.length - 1].X, points[points.length - 1].Y);
		}
		return newpoints;
	}
	function IndicativeAngle(points) {
		var c = Centroid(points);
		return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
	}
	function RotateBy(points, radians) {
		var c = Centroid(points),
			cos = Math.cos(radians),
			sin = Math.sin(radians),
			newpoints = [],
			i;
		for (i = 0; i < points.length; i++) {
			var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X,
				qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
			newpoints[newpoints.length] = NewPoint(qx, qy);
		}
		return newpoints;
	}
	function ScaleTo(points, size) {
		var B = BoundingBox(points),
			newpoints = [],
			i;
		for (i = 0; i < points.length; i++) {
			var qx = points[i].X * (size / B.Width),
				qy = points[i].Y * (size / B.Height);
			newpoints[newpoints.length] = NewPoint(qx, qy);
		}
		return newpoints;
	}
	function TranslateTo(points, pt) {
		var c = Centroid(points),
			newpoints = [],
			i;
		for (i = 0; i < points.length; i++) {
			var qx = points[i].X + pt.X - c.X,
				qy = points[i].Y + pt.Y - c.Y;
			newpoints[newpoints.length] = NewPoint(qx, qy);
		}
		return newpoints;
	}
	function Vectorize(points) { // for Protractor
		var sum = 0.0,
			vector = [],
			i,
			magnitude;
		for ( i = 0; i < points.length; i++) {
			vector[vector.length] = points[i].X;
			vector[vector.length] = points[i].Y;
			sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
		}
		magnitude = Math.sqrt(sum);
		for ( i = 0; i < vector.length; i++ )
			vector[i] /= magnitude;
		return vector;
	}
	function OptimalCosineDistance(v1, v2) { // for Protractor
		var a = 0.0,
			b = 0.0,
			i,
			angle;
		for (i = 0; i < v1.length; i += 2) {
			a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
	                b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
		}
		angle = Math.atan(b / a);
		return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
	}
	function Centroid(points) {
		var x = 0.0, 
			y = 0.0,
			i;
		for (i = 0; i < points.length; i++) {
			x += points[i].X;
			y += points[i].Y;
		}
		x /= points.length;
		y /= points.length;
		return NewPoint(x, y);
	}
	function BoundingBox(points) {
		var minX = +Infinity, 
			maxX = -Infinity, 
			minY = +Infinity, 
			maxY = -Infinity,
			i;
		for (i = 0; i < points.length; i++) {
			if (points[i].X < minX)
				minX = points[i].X;
			if (points[i].X > maxX)
				maxX = points[i].X;
			if (points[i].Y < minY)
				minY = points[i].Y;
			if (points[i].Y > maxY)
				maxY = points[i].Y;
		}
		return new Rectangle(minX, minY, maxX - minX, maxY - minY);
	}
	function PathLength(points) {
		var d = 0.0,
			i;
		for (i = 1; i < points.length; i++) {
			d += Distance(points[i - 1], points[i]);
		}
		return d;
	}
	function Distance(p1, p2) {
		var dx = p2.X - p1.X,
			dy = p2.Y - p1.Y;
		return Math.sqrt(dx * dx + dy * dy);
	}

})(jQuery);
/* Simple JavaScript Inheritance
* By John Resig http://ejohn.org/
* MIT Licensed.
*/
// Inspired by base2 and Prototype
// http://ejohn.org/blog/simple-javascript-inheritance/
(function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function(name, fn){
				return function() {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[name];

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply(this, arguments);        
					this._super = tmp;

					return ret;
				};
            })(name, prop[name]) :
            prop[name];
        }

        // The dummy class constructor
        function Class() {
			// All construction is actually done in the init method
			if ( !initializing && this.init )
				this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();
var Calculateur = Class.extend({
	init: function(){
		this.jutsus = [];
		this.aptitudes = [];
		this.classe = "";
		this.level = 0;

		// les champs de totaux
		this.totalJutsus = $('.result[data-id=total-aptitudes]');
		this.totalAptitudes = $('.result[data-id=total-capacites]');
		this.ptsAptitude = 0;
		this.ptsJutsu = 0;

		var _this = this;

		// les jutsus
		var _jutsus = $('.calculateur-jutsu');
		if(_jutsus.length>0){
			_jutsus.each(function(){
				_this.jutsus.push(new Jutsu(_this, $(this)));
			});
		}

		// les aptitudes
		var _capacites = $('.calculateur-capacite');
		if(_capacites.length>0){
			_capacites.each(function(){
				_this.aptitudes.push(new Aptitude(_this, $(this)));
			});
		}

		// sélection de la classe
		$("select[name=calculateurLimit]").on('change', function(){
			_this.classe = $(this).find('option:selected').val();
			_this.toggleJutsus();
		}).trigger('change');

		// sélection du niveau
		var _niveaux = $("select[name=calculateurLevel]");
		if(_niveaux.length>0){
			eval('var _niveauxAptitude ='+_niveaux.attr('data-aptitude'));
			eval('var _niveauxCapacite ='+_niveaux.attr('data-capacite'));
			_niveaux.on('change', function(){
				_this.level = parseInt($(this).find('option:selected').val());
				_this.ptsJutsu = _niveauxAptitude.depart + _niveauxAptitude.val*_this.level;
				_this.ptsAptitude = _niveauxCapacite.depart + _niveauxCapacite.val*_this.level;
				$('[data-id=ptsCapacite]').text(_this.ptsAptitude);
				$('[data-id=ptsAptitude]').text(_this.ptsJutsu);

				_this.toggleJutsus();
			}).trigger('change');
		}
	},
	getData: function(_lvl, _data){
		var _lvlActuel, _lvlSuivant, _palierActuel, _palierSuivant, _val;
		var i = 1;
		// base
		_palierActuel = _data[0];
		_val = {};
		for(attr in _palierActuel){
			if(attr!='lvl')
				_val[attr] = _palierActuel[attr];
		}
		// ajout par niveau
		while(i<_data.length-1){
			_palierActuel = _data[i];
			_palierSuivant = _data[i+1];
			_lvlActuel	= _palierActuel.lvl;
			_lvlSuivant	= _palierSuivant.lvl;
			if(_lvl<_lvlActuel){
				return _val;
			}else if(_lvl>_lvlSuivant){
				for(attr in _palierActuel){
					if(attr!='lvl')
						_val[attr] += (_lvlSuivant-_lvlActuel)*_palierActuel[attr];
				}
			}else{
				for(attr in _palierActuel){
					if(attr!='lvl')
						_val[attr] += (_lvl-_lvlActuel)*_palierActuel[attr];
				}
				return _val;
			}
			i++;
		}
		if(_lvl>_palierActuel.lvl)
			_palierActuel = _data[_data.length-1];
		_lvlActuel	= _palierActuel.lvl;
		for(attr in _palierActuel){
			if(attr!='lvl')
				_val[attr] += (_lvl-_lvlActuel+1)*_palierActuel[attr];
		}
		return _val;
	},
	// calcul du total des points de jutsus dépensés
	getTotalJutsus: function(){
		var total = 0;
		for(var i=0;i<this.jutsus.length;i++){
			if(this.jutsus[i].isLimitOk())
				total += this.jutsus[i].getLevel();
		}
		return total;
	},
	// calcul du total des points d'aptitudes dépensés
	getTotalAptitudes: function(){
		var total = 0;
		for(var i=0;i<this.aptitudes.length;i++){
			total += this.aptitudes[i].getLevel();
		}
		return total;
	},
	update: function(){
		// met à jour le total des jutsus
		this.totalJutsus.text(this.ptsJutsu - this.getTotalJutsus()); 
		// met à jour le total des aptitudes
		this.totalAptitudes.text(this.ptsAptitude - this.getTotalAptitudes());

		// met à jour les options disponibles
		this.toggleOptions();
	},
	toggleJutsus: function(){
		for(var i=0;i<this.jutsus.length;i++){
			this.jutsus[i].toggle();
		}
		this.update();
	},
	toggleOptions: function(){
		var dispo = this.ptsJutsu - this.getTotalJutsus();
		for(var i=0;i<this.jutsus.length;i++){
			this.jutsus[i].toggleOptions(dispo);
		}
		dispo = this.ptsAptitude - this.getTotalAptitudes();
		for(var i=0;i<this.aptitudes.length;i++){
			this.aptitudes[i].toggleOptions(dispo);
		}
	}
});
var Aptitude = Class.extend({
	init: function(calculateur, element){
		this.calculateur = calculateur;

		this.element = element;
		this.select = this.element.find('select[name=capacite]');
		this.selectOptions = this.select.find('option');
		this.result = this.element.find('.result[data-id='+this.select.attr('data-id')+']');

		eval('var data='+this.select.attr('data-json'));
		this.data = data;

		this.initSelect();
	},
	toggleOptions: function(dispo){
		var actuel = this.getLevel();
		this.selectOptions.each(function(){
			var _this = $(this);
			if(parseInt(_this.val()) > actuel+dispo)
				_this.attr('disabled', 'disabled');
			else
				_this.removeAttr('disabled');
		});
	},
	getLevel: function(){
		return parseInt(this.select.find('option:selected').val());
	},
	initSelect: function(){
		var _this = this;
		_this.select.on('change', function(){
			var _lvl = _this.getLevel();
			if(_lvl>0){
				var calcul = _this.calculateur.getData(_lvl, _this.data);
				_this.result.empty();
				if(_this.select.attr('data-id')=='force'){
					_this.result.append('<strong> Katana</strong> : '+Math.round(calcul.val*6));
					_this.result.append('<strong> Kunaï</strong> : '+Math.round(calcul.val*2.5));
					_this.result.append('<strong> Shuriken</strong> : '+Math.round(calcul.val*1.75));
					_this.result.append('<strong> Shuriken de l\'ombre</strong> : '+Math.round(calcul.val*7));
				}else
					_this.result.append('<strong> Valeur</strong> : '+Math.round(calcul.val*10000)/10000);
			}else
				_this.result.text('-');
			_this.calculateur.update();
		});
		_this.select.trigger('change');
	}
});
var Jutsu = Class.extend({
	init: function(calculateur, element){
		this.calculateur = calculateur;

		this.element = element;
		this.select = this.element.find('select[name=aptitude]');
		this.selectOptions = this.select.find('option');
		this.result = this.element.find('.result[data-id='+this.select.attr('data-id')+']');

		this.limitLvl = parseInt(this.element.attr('data-niveau'));
		this.limitClass = this.element.attr('data-limit');

		eval('var data='+this.select.attr('data-json'));
		eval('var attr='+this.select.attr('data-attr'));
		this.data = data;
		this.attr = attr;

		this.initSelect();
	},
	toggle: function(){
		this.element.toggle(this.isLimitOk());
	},
	toggleOptions: function(dispo){
		var actuel = this.getLevel();
		this.selectOptions.each(function(){
			var _this = $(this);
			if(parseInt(_this.val()) > actuel+dispo)
				_this.attr('disabled', 'disabled');
			else
				_this.removeAttr('disabled');
		});
	},
	isLimitOk: function(){
		return (this.limitClass == "" || this.limitClass == this.calculateur.classe) && this.limitLvl<=this.calculateur.level;
	},
	getLevel: function(){
		return parseInt(this.select.find('option:selected').val());
	},
	initSelect: function(){
		var _this = this;
		_this.select.on('change', function(){
			var _lvl = _this.getLevel();
			if(_lvl>0){
				var calcul = _this.calculateur.getData(_lvl, _this.data);
				var _html = '<ul>';
				for(var n in calcul){
					// les valeurs en pourcentage
					if(_this.attr[n].indexOf('##%')!=-1 && calcul[n]<2){
						calcul[n] = calcul[n]*100;
					}
					_html += '<li>'+(_this.attr[n].replace('##', '<strong>'+(Math.round(calcul[n]*10000)/10000)+'</strong>'))+'</li>';
				}
				_html += '</ul>';
				_this.result.html(_html);
			}else
				_this.result.text('-');

			_this.calculateur.update();
		});
		_this.select.trigger('change');
	}
});
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// permet de désactiver/activer le scrolling de la page
function disableWheel() {
    /* Gecko */
    addHandler(window, 'DOMMouseScroll', wheel);
    /* Opera */
    addHandler(window, 'mousewheel', wheel);
    /* IE */
    addHandler(document, 'mousewheel', wheel);
}
function enableWheel() {
	if(on)
		return;
    /* Gecko */
    removeHandler(window, 'DOMMouseScroll', wheel);
    /* Opera */
    removeHandler(window, 'mousewheel', wheel);
    /* IE */
    removeHandler(document, 'mousewheel', wheel);
}
function addHandler(object, event, handler, useCapture) {
    if (object.addEventListener) {
        object.addEventListener(event, handler, useCapture ? useCapture : false);
    } else if (object.attachEvent) {
        object.attachEvent('on' + event, handler);
    } else alert("Add handler is not supported");
}
function removeHandler(object, event, handler) {
    if (object.removeEventListener) {
        object.removeEventListener(event, handler, false);
    } else if (object.detachEvent) {
        object.detachEvent('on' + event, handler);
    } else alert("Remove handler is not supported");
}
// Wheel event handler
function wheel(event) {
    var delta; // Scroll direction
    // -1 - scroll down
    // 1  - scroll up
    event = event || window.event;
    // Opera & IE works with property wheelDelta
    if (event.wheelDelta) {
        delta = event.wheelDelta / 120;
        // In Опере value of wheelDelta the same but with opposite sign
        if (window.opera) delta = -delta;
        // Gecko uses property detail
    } else if (event.detail) {
        delta = -event.detail / 3;
    }
    // Disables processing events
    if (event.preventDefault) event.preventDefault();
    event.returnValue = false;
    return delta;
}

$(document).ready(function(){
	// les paramètres passés via l'url
	var prmstr = window.location.search.substr(1);
	var prmarr = prmstr.split ("&");
	var params = {};
	for ( var i = 0; i < prmarr.length; i++) {
		var tmparr = prmarr[i].split("=");
		params[tmparr[0]] = tmparr[1];
	}

	// le diaporama
	var diaporama = $('#diaporama');
	if(diaporama.length>0){
		$('#diaporama').bjqs({
			height			: 350,
			width			: 770,
			responsive		: true,
			animtype		: 'slide',
			automatic		: false,
			animduration	: 250,
			showcontrols	: false,
			centercontrols	: true,
		});
	}

	// focus et blur des champs de textes
	$('input[type=text]').each(function(){
		var _this = $(this);
		var _valInit = _this.val();
		_this.focus(function(){
			if(_this.val()==_valInit)
				_this.val('');
		});
		_this.blur(function(){
			if(_this.val()=='')
				_this.val(_valInit);
		});
	});

	// le menu responsive
	var ww = document.body.clientWidth;
	var _menuMobile = $("#menuMobile");
	var _nav = $(".menu>li>a");
	var adjustMenu = function() {
		if(ww < 768){
			_nav.unbind('click').bind('click', function(e) {
				e.preventDefault();
				$(this).parent("li").toggleClass("hover");
			});
		}else{
			_nav.parent("li").removeClass("hover");
			_nav.unbind('click');
		}
	}
	
	_menuMobile.click(function(e) {
		e.preventDefault();
		$(".menu").toggleClass("hidden-phone");
	});
	adjustMenu();

	$(window).bind('resize orientationchange', function() {
		ww = document.body.clientWidth;
		adjustMenu();
	});

	// l'éditeur de texte
	var _textarea = $('.textarea');
	if(_textarea.length>0){
		_textarea.tinymce({
			// General options
			plugins : "autolink link image lists pagebreak emoticons nt_media contextmenu paste noneditable nonbreaking textcolor",
			schema: "html5",
			theme: "modern",
			width : '100%',
			height:300,
			entity_encoding : "raw",
			element_format : "html",
			paste_auto_cleanup_on_paste : true,
			apply_source_formatting : true,
			convert_urls : false,
			relative_urls : false,
			media_strict: false,
			auto_focus : false,
			inline: true,
			// Theme options
			toolbar : "styleselect | bold italic underline strikethrough forecolor | link unlink | alignleft aligncenter alignright alignjustify bullist | emoticons image nt_media",
			menubar : false,
			statusbar : false,
			tab_focus : ':prev,:next',
			valid_elements : "@[id|class|title|style],span[data-mce-type|data-mce-style|align],a[href|target],legend,fieldset,img[src|alt|align|height|width],object[classid|width|height|codebase|*],param[name|value|_value],embed[type|width|height|src|*],iframe[type|width|height|src|frameborder|scrolling|marginheight|marginwidth|name|align],ul,li,ol,p[align],font[face|size|color],strong/b,em/i,u,strike,br",
			language : 'fr_FR',
			style_formats: [
				{title: 'entête 1', block : 'h3'},
				{title: 'entête 2', block : 'h4'},
				{title: 'entête 3', block : 'h5'},
				{title: 'entête 4', block : 'h6'}
			],
			formats : {
				alignleft : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', attributes: {"align":  'left'}},
				aligncenter : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', attributes: {"align":  'center'}},
				alignright : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', attributes: {"align":  'right'}},
				alignfull : {selector : 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', attributes: {"align":  'justify'}}
			}
		});
	}

	// le jeu
	var unityPlayer = $("#unityPlayer");
	if(unityPlayer.length>0){
		if(typeof unityLoader != "undefined"){
			ntUnity = new UnityObject2({
				width:'100%',
				height:'100%',
				enableUnityAnalytics:false,
				enableGoogleAnalytics:false,
				params:{
					backgroundcolor: "333333",
					bordercolor: "333333",
					textcolor: "FFFFFF",
					disableContextMenu: true,
					disableExternalCall:true
				}
			});
			ntUnity.observeProgress(function (progress) {
				var $missingScreen = $(progress.targetEl).find(".missing");
				switch(progress.pluginStatus) {
					case "unsupported":
						showUnsupported();
						break;
					case "broken":
						alert("You will need to restart your browser after installation.");
						break;
					case "missing":
						$missingScreen.find("a").click(function (e) {
								e.stopPropagation();
								e.preventDefault();
								u.installPlugin();
								return false;
						});
						$missingScreen.show();
						break;
					case "installed":
						$missingScreen.remove();
						break;
					case "first":
						break;
				}
			});
			ntUnity.initPlugin(unityPlayer.get(0), unityLoader);

			if(typeof unityGame != "undefined"){
				ntUnityLoaded = window.setInterval(
					function(){
						var uO = ntUnity.getUnity();
						if(uO != null){
							window.clearInterval(ntUnityLoaded);
							setTimeout(function(){
								ntUnity.getUnity().SendMessage("loader", "initStream", unityGame);
							},1000);
						}
					},
					100
				);
			}
		}
	}

	// classements
	var _classe = $("#classe");
	if(_classe.length>0){
		var _data = [];
		_classe.find("li").each(function(){
			_data.push({
				value: parseInt($(this).find('.num').html()),
				color: $(this).css("color")
			});
		});
		_classe.before("<canvas width='200' height='200' id='"+_classe.attr("id")+"_chart' class='pull-left'></canvas>");
		new Chart($("#"+_classe.attr("id")+"_chart").get(0).getContext("2d")).Doughnut(_data);
	}

	// page de clan
	$('select[name="clan"]').on('change', function(){
		document.location.href = document.location.pathname+'?order='+$(this).find('option:selected').val();
	});

	// page de classement
	$('select[name="classe"]').on('change', function(){
		document.location.href = String(document.location.pathname).replace(/classement\/([0-9]*)/gi, 'classement/1')+'?filter='+$(this).find('option:selected').val()+'&order='+(typeof params['order']!="undefined"?params['order']:"")+'#classement';
	});

	// gestion de la popup
	var _popup = $('.popup-bg');
	if(_popup.length>0){
		var _referer = undefined;
		_popup.on('open', function(e){
			if(typeof _referer !="undefined"){
				_popup.addClass('on');
			}
		});
		_popup.find('a[href="confirm"]').on('click', function(){
			_popup.removeClass('on');
			_referer.trigger('validate');
			return false;
		});
		_popup.find('a[href="cancel"]').on('click', function(){
			_referer = undefined;
			_popup.removeClass('on');
			return false;
		});
		var _addPopupValidate = function(_element, _event){
			_element.attr('data-remove', '0');
			_element.on(_event, function(){
				if(_element.attr('data-remove')!='1'){
					_referer = _element;
					_popup.trigger('open');
					return false;
				}
			});
			_element.on('validate', function(){
				_element.attr('data-remove', '1');
				if(_event=='click'){
					document.location = _element.attr('href');
				}else
					_element.trigger(_event);
			});
		};

		// confirmation pour supprimer mon compte
		var _deleteAccount = $('form[name="deleteAccount"]');
		if(_deleteAccount.length>0){
			_addPopupValidate(_deleteAccount, 'submit');
		}
		// confirmation pour supprimer un thread/message
		var _delete = $('a.delete');
		if(_delete.length>0){
			var _event = 'click';
			_delete.each(function(){
				_addPopupValidate($(this), 'click');
			});
		}
	}

	// réponses
	var _answers = $("a.answer");
	if(_answers.length>0){
		var _answer = $("#answer");
		_answer.hide();
		_answers.each(function(){
			var _this = $(this);
			_this.click(function(e){
				e.preventDefault();
				e.stopImmediatePropagation();
				// ré-affiche tous les boutons de réponse
				_answers.show();
				// déplace le formulaire de réponse
				_this.parent().after(_answer);
				// affiche le formulaire de réponse
				_answer.show();
				// cache le bouton de réponse
				_this.hide();
				// déplace vers le message
				var scrollTop = _answer.parent().offset().top - 20;
				if(_answer.offset().top-_answer.parent().offset().top>$(window).height())
					scrollTop = _answer.offset().top + _answer.height() - $(window).height() + 20;
				$("html,body").animate({scrollTop: scrollTop },'slow');
			});
		});
	}

	// tag-it (champ destinataires)
	var _destination = $("#destinations");
	if(_destination.length>0){
		var request = _destination.attr('data-find');
		_destination.tagit({
			tags: function(input, autocomplete){
				if(_destination.query)
					_destination.query.abort();
				var q = $.trim(input.toLowerCase());
				if(q.length>2){
					_destination.query = $.ajax({
						dataType:'json',
						url:request+'?q='+q,
						complete:function(result){
							var json = result.responseJSON;
							_destination.tagit(
								"autocomplete",
								json,
								autocomplete
							);
						}
					});
				}
			},
			inputlibelle: "text",
			inputvalue: "id",
			field: "destinataires[]"
		});
	}

	// liste de kamon
	var _kamon = $('.kamon');
	if(_kamon.length>0){
		var _input = $('#clan_kamon');
		var _all = _kamon.find('div');
		_all.each(function(){
			var _this = $(this);
			_this.click(function(){
				_all.removeClass('selected');
				_this.addClass('selected');
				_input.val(_this.attr('data-val'));
			});
		});
	}

	// upload de fichier
	var _upload = $('form[name="editAvatar"] input[type="file"]');
	if(_upload.length>0){
		var _form = _upload.closest('form');
		var _btn = _upload.next();
		_btn.on('click', function(){
			_upload.trigger('click');
			return false;
		});
		_upload.on('change', function(e){
			var file = _upload.val().split("\\");
		    _btn.html(file[file.length-1]);
			_form.attr('action', _btn.attr('href'));
			_form.trigger('submit');
			e.preventDefault();
		});
	}
	var _upload = $('form[name="clan"] input[type="file"]');
	if(_upload.length>0){
		var _form = _upload.closest('form');
		var _btn = _upload.next();
		_btn.on('click', function(){
			_upload.trigger('click');
			return false;
		});
		_upload.on('change', function(e){
			var file = _upload.val().split("\\");
		    _btn.html(file[file.length-1]);
			e.preventDefault();
		});
	}

	// bracket pour tournoi
	var _bracketD = $("#bracket");
	/*var _bracket = {
		"teams": [
			["joueur avec un pseudo super long 1", "joueur 2"],
			["joueur 3", "joueur 4"],
			["joueur 5", "joueur 6"],
			["joueur 7", "joueur 8"]
		],
		"results": [
			[ 
				[
					[1, 2],
					[3, 4],
					[5, 6],
					[7, 8]
				],
				[
					[1, 2],
					[3, 4]
				],
				[
					[1, 2],
					[3, 4]
				]
			]
		]
	};*/
	if(_bracketD.length>0 && typeof _bracket!="undefined")
		_bracket.bracket({init: _bracket});

	// timeline des évènements
	var _timelineD = $("#timeline");
	if(_timelineD.length>0 && typeof _timeline!="undefined"){
		createStoryJS({
			type: 'timeline',
			width: '100%',
			height: '600',
			source: _timeline,
			embed_id: 'timeline'
		});
	}

	// captcha sur formulaire de contact
	$('#contact, #register').motionCaptcha({
		errorMsg: 'Ré-essayes...',
		successMsg: 'Captcha réussi'
	});

	// calculateur de jutsus
	var _calculateur = new Calculateur();
});