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
	StoryJS
	Designed and built by Zach Wise at VéritéCo

	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*//* **********************************************
     Begin LazyLoad.js
********************************************** *//*jslint browser: true, eqeqeq: true, bitwise: true, newcap: true, immed: true, regexp: false *//*
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
*/function getEmbedScriptPath(e){var t=document.getElementsByTagName("script"),n="",r="";for(var i=0;i<t.length;i++)t[i].src.match(e)&&(n=t[i].src);n!=""&&(r="/");return n.split("?")[0].split("/").slice(0,-1).join("/")+r}function createStoryJS(e,t){function g(){LoadLib.js(h.js,y)}function y(){l.js=!0;h.lang!="en"?LazyLoad.js(c.locale,b):l.language=!0;x()}function b(){l.language=!0;x()}function w(){l.css=!0;x()}function E(){l.font.css=!0;x()}function S(){l.font.js=!0;x()}function x(){if(l.checks>40)return;l.checks++;if(l.js&&l.css&&l.font.css&&l.font.js&&l.language){if(!l.finished){l.finished=!0;N()}}else l.timeout=setTimeout("onloaded_check_again();",250)}function T(){var e="storyjs-embed";r=document.createElement("div");h.embed_id!=""?i=document.getElementById(h.embed_id):i=document.getElementById("timeline-embed");i.appendChild(r);r.setAttribute("id",h.id);if(h.width.toString().match("%"))i.style.width=h.width.split("%")[0]+"%";else{h.width=h.width-2;i.style.width=h.width+"px"}if(h.height.toString().match("%")){i.style.height=h.height;e+=" full-embed";i.style.height=h.height.split("%")[0]+"%"}else if(h.width.toString().match("%")){e+=" full-embed";h.height=h.height-16;i.style.height=h.height+"px"}else{e+=" sized-embed";h.height=h.height-16;i.style.height=h.height+"px"}i.setAttribute("class",e);i.setAttribute("className",e);r.style.position="relative"}function N(){VMM.debug=h.debug;n=new VMM.Timeline(h.id);n.init(h);o&&VMM.bindEvent(global,onHeadline,"HEADLINE")}var n,r,i,s,o=!1,u="2.24",a="1.7.1",f="",l={timeout:"",checks:0,finished:!1,js:!1,css:!1,jquery:!1,has_jquery:!1,language:!1,font:{css:!1,js:!1}},c={base:embed_path,css:embed_path+"css/",js:embed_path+"js/",locale:embed_path+"js/locale/",jquery:"http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js",font:{google:!1,css:embed_path+"css/themes/font/",js:"http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"}},h={version:u,debug:!1,type:"timeline",id:"storyjs",embed_id:"timeline-embed",embed:!0,width:"100%",height:"100%",source:"https://docs.google.com/spreadsheet/pub?key=0Agl_Dv6iEbDadFYzRjJPUGktY0NkWXFUWkVIZDNGRHc&output=html",lang:"en",font:"default",css:c.css+"timeline.css?"+u,js:"",api_keys:{google:"",flickr:"",twitter:""},gmap_key:""},p=[{name:"Merriweather-NewsCycle",google:["News+Cycle:400,700:latin","Merriweather:400,700,900:latin"]},{name:"NewsCycle-Merriweather",google:["News+Cycle:400,700:latin","Merriweather:300,400,700:latin"]},{name:"PoiretOne-Molengo",google:["Poiret+One::latin","Molengo::latin"]},{name:"Arvo-PTSans",google:["Arvo:400,700,400italic:latin","PT+Sans:400,700,400italic:latin"]},{name:"PTSerif-PTSans",google:["PT+Sans:400,700,400italic:latin","PT+Serif:400,700,400italic:latin"]},{name:"PT",google:["PT+Sans+Narrow:400,700:latin","PT+Sans:400,700,400italic:latin","PT+Serif:400,700,400italic:latin"]},{name:"DroidSerif-DroidSans",google:["Droid+Sans:400,700:latin","Droid+Serif:400,700,400italic:latin"]},{name:"Lekton-Molengo",google:["Lekton:400,700,400italic:latin","Molengo::latin"]},{name:"NixieOne-Ledger",google:["Nixie+One::latin","Ledger::latin"]},{name:"AbrilFatface-Average",google:["Average::latin","Abril+Fatface::latin"]},{name:"PlayfairDisplay-Muli",google:["Playfair+Display:400,400italic:latin","Muli:300,400,300italic,400italic:latin"]},{name:"Rancho-Gudea",google:["Rancho::latin","Gudea:400,700,400italic:latin"]},{name:"Bevan-PotanoSans",google:["Bevan::latin","Pontano+Sans::latin"]},{name:"BreeSerif-OpenSans",google:["Bree+Serif::latin","Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800:latin"]},{name:"SansitaOne-Kameron",google:["Sansita+One::latin","Kameron:400,700:latin"]},{name:"Lora-Istok",google:["Lora:400,700,400italic,700italic:latin","Istok+Web:400,700,400italic,700italic:latin"]},{name:"Pacifico-Arimo",google:["Pacifico::latin","Arimo:400,700,400italic,700italic:latin"]}];if(typeof e=="object")for(s in e)Object.prototype.hasOwnProperty.call(e,s)&&(h[s]=e[s]);typeof t!="undefined"&&(h.source=t);if(typeof url_config=="object"){o=!0;h.source.match("docs.google.com")||h.source.match("json")||h.source.match("storify")||(h.source="https://docs.google.com/spreadsheet/pub?key="+h.source+"&output=html")}if(h.js.match("locale")){h.lang=h.js.split("locale/")[1].replace(".js","");h.js=c.js+"timeline-min.js?"+u}if(!h.js.match("/")){h.css=c.css+h.type+".css?"+u;h.js=c.js+h.type;h.debug?h.js+=".js?"+u:h.js+="-min.js?"+u;h.id="storyjs-"+h.type}h.lang.match("/")?c.locale=h.lang:c.locale=c.locale+h.lang+".js?"+u;T();/*déjà intégré dans le fichier css global !! LoadLib.css(h.css,w);*/w();if(h.font=="default"){l.font.js=!0;l.font.css=!0}else{var d;if(h.font.match("/")){d=h.font.split(".css")[0].split("/");c.font.name=d[d.length-1];c.font.css=h.font}else{c.font.name=h.font;c.font.css=c.font.css+h.font+".css?"+u}LoadLib.css(c.font.css,E);for(var v=0;v<p.length;v++)if(c.font.name==p[v].name){c.font.google=!0;WebFontConfig={google:{families:p[v].google}}}c.font.google?LoadLib.js(c.font.js,S):l.font.js=!0}try{l.has_jquery=jQuery;l.has_jquery=!0;if(l.has_jquery){var f=parseFloat(jQuery.fn.jquery);f<parseFloat(a)?l.jquery=!1:l.jquery=!0}}catch(m){l.jquery=!1}l.jquery?g():LoadLib.js(c.jquery,g);this.onloaded_check_again=function(){x()}}LazyLoad=function(e){function u(t,n){var r=e.createElement(t),i;for(i in n)n.hasOwnProperty(i)&&r.setAttribute(i,n[i]);return r}function a(e){var t=r[e],n,o;if(t){n=t.callback;o=t.urls;o.shift();i=0;if(!o.length){n&&n.call(t.context,t.obj);r[e]=null;s[e].length&&l(e)}}}function f(){var n=navigator.userAgent;t={async:e.createElement("script").async===!0};(t.webkit=/AppleWebKit\//.test(n))||(t.ie=/MSIE/.test(n))||(t.opera=/Opera/.test(n))||(t.gecko=/Gecko\//.test(n))||(t.unknown=!0)}function l(i,o,l,p,d){var v=function(){a(i)},m=i==="css",g=[],y,b,w,E,S,x;t||f();if(o){o=typeof o=="string"?[o]:o.concat();if(m||t.async||t.gecko||t.opera)s[i].push({urls:o,callback:l,obj:p,context:d});else for(y=0,b=o.length;y<b;++y)s[i].push({urls:[o[y]],callback:y===b-1?l:null,obj:p,context:d})}if(r[i]||!(E=r[i]=s[i].shift()))return;n||(n=e.head||e.getElementsByTagName("head")[0]);S=E.urls;for(y=0,b=S.length;y<b;++y){x=S[y];if(m)w=t.gecko?u("style"):u("link",{href:x,rel:"stylesheet"});else{w=u("script",{src:x});w.async=!1}w.className="lazyload";w.setAttribute("charset","utf-8");if(t.ie&&!m)w.onreadystatechange=function(){if(/loaded|complete/.test(w.readyState)){w.onreadystatechange=null;v()}};else if(m&&(t.gecko||t.webkit))if(t.webkit){E.urls[y]=w.href;h()}else{w.innerHTML='@import "'+x+'";';c(w)}else w.onload=w.onerror=v;g.push(w)}for(y=0,b=g.length;y<b;++y)n.appendChild(g[y])}function c(e){var t;try{t=!!e.sheet.cssRules}catch(n){i+=1;i<200?setTimeout(function(){c(e)},50):t&&a("css");return}a("css")}function h(){var e=r.css,t;if(e){t=o.length;while(--t>=0)if(o[t].href===e.urls[0]){a("css");break}i+=1;e&&(i<200?setTimeout(h,50):a("css"))}}var t,n,r={},i=0,s={css:[],js:[]},o=e.styleSheets;return{css:function(e,t,n,r){l("css",e,t,n,r)},js:function(e,t,n,r){l("js",e,t,n,r)}}}(this.document);LoadLib=function(e){function n(e){var n=0,r=!1;for(n=0;n<t.length;n++)t[n]==e&&(r=!0);if(r)return!0;t.push(e);return!1}var t=[];return{css:function(e,t,r,i){n(e)||LazyLoad.css(e,t,r,i)},js:function(e,t,r,i){n(e)||LazyLoad.js(e,t,r,i)}}}(this.document);var WebFontConfig;if(typeof embed_path=="undefined"||typeof embed_path=="undefined")var embed_path=getEmbedScriptPath("storyjs-embed.js").split("js/")[0];(function(){typeof url_config=="object"?createStoryJS(url_config):typeof timeline_config=="object"?createStoryJS(timeline_config):typeof storyjs_config=="object"?createStoryJS(storyjs_config):typeof config=="object"&&createStoryJS(config)})();
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
//============================================================
//
// The MIT License
//
// Copyright (C) 2013 Matthew Wagerfield - @mwagerfield
//
// Permission is hereby granted, free of charge, to any
// person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the
// Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute,
// sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do
// so, subject to the following conditions:
//
// The above copyright notice and this permission notice
// shall be included in all copies or substantial portions
// of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY
// OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
// LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
// AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
// OR OTHER DEALINGS IN THE SOFTWARE.
//
//============================================================

/**
 * jQuery/Zepto Parallax Plugin
 * @author Matthew Wagerfield - @mwagerfield
 * @description Creates a parallax effect between an array of layers,
 *              driving the motion from the gyroscope output of a smartdevice.
 *              If no gyroscope is available, the cursor position is used.
 */
;(function($, window, document, undefined) {

  var NAME = 'parallax';
  var MAGIC_NUMBER = 30;
  var DEFAULTS = {
    calibrationThreshold: 100,
    calibrationDelay: 500,
    supportDelay: 500,
    calibrateX: false,
    calibrateY: true,
    invertX: true,
    invertY: true,
    limitX: false,
    limitY: false,
    scalarX: 10.0,
    scalarY: 10.0,
    frictionX: 0.1,
    frictionY: 0.1
  };

  function Plugin(element, options) {

    // DOM Context
    this.element = element;

    // Selections
    this.$context = $(element).data('api', this);
    this.$layers = this.$context.find('.layer');

    // Data Extraction
    var data = {
      calibrateX: this.$context.data('calibrate-x') || null,
      calibrateY: this.$context.data('calibrate-y') || null,
      invertX: this.$context.data('invert-x') || null,
      invertY: this.$context.data('invert-y') || null,
      limitX: parseFloat(this.$context.data('limit-x')) || null,
      limitY: parseFloat(this.$context.data('limit-y')) || null,
      scalarX: parseFloat(this.$context.data('scalar-x')) || null,
      scalarY: parseFloat(this.$context.data('scalar-y')) || null,
      frictionX: parseFloat(this.$context.data('friction-x')) || null,
      frictionY: parseFloat(this.$context.data('friction-y')) || null
    };

    // Delete Null Data Values
    for (var key in data) {
      if (data[key] === null) delete data[key];
    }

    // Compose Settings Object
    $.extend(this, DEFAULTS, options, data);

    // States
    this.calibrationTimer = null;
    this.calibrationFlag = true;
    this.enabled = false;
    this.depths = [];
    this.raf = null;

    // Offset
    this.ox = 0;
    this.oy = 0;
    this.ow = 0;
    this.oh = 0;

    // Calibration
    this.cx = 0;
    this.cy = 0;

    // Input
    this.ix = 0;
    this.iy = 0;

    // Motion
    this.mx = 0;
    this.my = 0;

    // Velocity
    this.vx = 0;
    this.vy = 0;

    // Callbacks
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
    this.onOrientationTimer = this.onOrientationTimer.bind(this);
    this.onCalibrationTimer = this.onCalibrationTimer.bind(this);
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    // Initialise
    this.initialise();
  }

  Plugin.prototype.transformSupport = function(value) {
    var element = document.createElement('div');
    var propertySupport = false;
    var propertyValue = null;
    var featureSupport = false;
    var cssProperty = null;
    var jsProperty = null;
    for (var i = 0, l = this.vendors.length; i < l; i++) {
      if (this.vendors[i] !== null) {
        cssProperty = this.vendors[i][0] + 'transform';
        jsProperty = this.vendors[i][1] + 'Transform';
      } else {
        cssProperty = 'transform';
        jsProperty = 'transform';
      }
      if (element.style[jsProperty] !== undefined) {
        propertySupport = true;
        break;
      }
    }
    switch(value) {
      case '2D':
        featureSupport = propertySupport;
        break;
      case '3D':
        if (propertySupport) {
          document.body.appendChild(element);
          element.style[jsProperty] = 'translate3d(1px,1px,1px)';
          propertyValue = window.getComputedStyle(element).getPropertyValue(cssProperty);
          featureSupport = propertyValue !== undefined && propertyValue.length > 0 && propertyValue !== "none";
          document.body.removeChild(element);
        }
        break;
    }
    return featureSupport;
  };

  Plugin.prototype.ww = null;
  Plugin.prototype.wh = null;
  Plugin.prototype.hw = null;
  Plugin.prototype.hh = null;
  Plugin.prototype.portrait = null;
  Plugin.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
  Plugin.prototype.vendors = [null,['-webkit-','webkit'],['-moz-','Moz'],['-o-','O'],['-ms-','ms']];
  Plugin.prototype.motionSupport = !!window.DeviceMotionEvent;
  Plugin.prototype.orientationSupport = !!window.DeviceOrientationEvent;
  Plugin.prototype.orientationStatus = 0;
  Plugin.prototype.transform2DSupport = Plugin.prototype.transformSupport('2D');
  Plugin.prototype.transform3DSupport = Plugin.prototype.transformSupport('3D');

  Plugin.prototype.initialise = function() {

    // Configure Styles
    if (this.$context.css('position') === 'static') {
      this.$context.css({
        position:'relative'
      });
    }
    this.$layers.css({
      position:'absolute',
      display:'block',
      height:'100%',
      width:'100%',
      left: 0,
      top: 0
    });
    this.$layers.first().css({
      position:'relative'
    });

    // Cache Depths
    this.$layers.each($.proxy(function(index, element) {
      this.depths.push($(element).data('depth') || 0);
    }, this));

    // Hardware Accelerate Elements
    this.accelerate(this.$context);
    this.accelerate(this.$layers);

    // Setup
    this.updateDimensions();
    this.enable();
    this.queueCalibration(this.calibrationDelay);
  };

  Plugin.prototype.updateDimensions = function() {

    // Cache Context Dimensions
    this.ox = this.$context.offset().left;
    this.oy = this.$context.offset().top;
    this.ow = this.$context.width();
    this.oh = this.$context.height();

    // Cache Window Dimensions
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;
    this.hw = this.ww / 2;
    this.hh = this.wh / 2;
  };

  Plugin.prototype.queueCalibration = function(delay) {
    clearTimeout(this.calibrationTimer);
    this.calibrationTimer = setTimeout(this.onCalibrationTimer, delay);
  };

  Plugin.prototype.enable = function() {
    if (!this.enabled) {
      this.enabled = true;
      if (this.orientationSupport) {
        this.portrait = null;
        window.addEventListener('deviceorientation', this.onDeviceOrientation);
        setTimeout(this.onOrientationTimer, this.supportDelay);
      } else {
        this.cx = 0;
        this.cy = 0;
        this.portrait = false;
        window.addEventListener('mousemove', this.onMouseMove);
      }
      window.addEventListener('resize', this.onWindowResize);
      this.raf = requestAnimationFrame(this.onAnimationFrame);
    }
  };

  Plugin.prototype.disable = function() {
    if (this.enabled) {
      this.enabled = false;
      if (this.orientationSupport) {
        window.removeEventListener('deviceorientation', this.onDeviceOrientation);
      } else {
        window.removeEventListener('mousemove', this.onMouseMove);
      }
      window.removeEventListener('resize', this.onWindowResize);
      cancelAnimationFrame(this.raf);
    }
  };

  Plugin.prototype.calibrate = function(x, y) {
    this.calibrateX = x === undefined ? this.calibrateX : x;
    this.calibrateY = y === undefined ? this.calibrateY : y;
  };

  Plugin.prototype.invert = function(x, y) {
    this.invertX = x === undefined ? this.invertX : x;
    this.invertY = y === undefined ? this.invertY : y;
  };

  Plugin.prototype.friction = function(x, y) {
    this.frictionX = x === undefined ? this.frictionX : x;
    this.frictionY = y === undefined ? this.frictionY : y;
  };

  Plugin.prototype.scalar = function(x, y) {
    this.scalarX = x === undefined ? this.scalarX : x;
    this.scalarY = y === undefined ? this.scalarY : y;
  };

  Plugin.prototype.limit = function(x, y) {
    this.limitX = x === undefined ? this.limitX : x;
    this.limitY = y === undefined ? this.limitY : y;
  };

  Plugin.prototype.clamp = function(value, min, max) {
    value = Math.max(value, min);
    value = Math.min(value, max);
    return value;
  };

  Plugin.prototype.css = function(element, property, value) {
    var jsProperty = null;
    for (var i = 0, l = this.vendors.length; i < l; i++) {
      if (this.vendors[i] !== null) {
        jsProperty = $.camelCase(this.vendors[i][1] + '-' + property);
      } else {
        jsProperty = property;
      }
      if (element.style[jsProperty] !== undefined) {
        element.style[jsProperty] = value;
        break;
      }
    }
  };

  Plugin.prototype.accelerate = function($element) {
    for (var i = 0, l = $element.length; i < l; i++) {
      var element = $element[i];
      this.css(element, 'transform', 'translate3d(0,0,0)');
      this.css(element, 'transform-style', 'preserve-3d');
      this.css(element, 'backface-visibility', 'hidden');
    }
  };

  Plugin.prototype.setPosition = function(element, x, y) {
    x += '%';
    y += '%';
    if (this.transform3DSupport) {
      this.css(element, 'transform', 'translate3d('+x+','+y+',0)');
    } else if (this.transform2DSupport) {
      this.css(element, 'transform', 'translate('+x+','+y+')');
    } else {
      element.style.left = x;
      element.style.top = y;
    }
  };

  Plugin.prototype.onOrientationTimer = function(event) {
    if (this.orientationSupport && this.orientationStatus === 0) {
      this.disable();
      this.orientationSupport = false;
      this.enable();
    }
  };

  Plugin.prototype.onCalibrationTimer = function(event) {
    this.calibrationFlag = true;
  };

  Plugin.prototype.onWindowResize = function(event) {
    this.updateDimensions();
  };

  Plugin.prototype.onAnimationFrame = function() {
    var dx = this.ix - this.cx;
    var dy = this.iy - this.cy;
    if ((Math.abs(dx) > this.calibrationThreshold) || (Math.abs(dy) > this.calibrationThreshold)) {
      this.queueCalibration(0);
    }
    if (this.portrait) {
      this.mx = (this.calibrateX ? dy : this.iy) * this.scalarX;
      this.my = (this.calibrateY ? dx : this.ix) * this.scalarY;
    } else {
      this.mx = (this.calibrateX ? dx : this.ix) * this.scalarX;
      this.my = (this.calibrateY ? dy : this.iy) * this.scalarY;
    }
    if (!isNaN(parseFloat(this.limitX))) {
      this.mx = this.clamp(this.mx, -this.limitX, this.limitX);
    }
    if (!isNaN(parseFloat(this.limitY))) {
      this.my = this.clamp(this.my, -this.limitY, this.limitY);
    }
    this.vx += (this.mx - this.vx) * this.frictionX;
    this.vy += (this.my - this.vy) * this.frictionY;
    for (var i = 0, l = this.$layers.length; i < l; i++) {
      var depth = this.depths[i];
      var layer = this.$layers[i];
      var xOffset = this.vx * depth * (this.invertX ? -1 : 1);
      var yOffset = this.vy * depth * (this.invertY ? -1 : 1);
      this.setPosition(layer, xOffset, yOffset);
    }
    this.raf = requestAnimationFrame(this.onAnimationFrame);
  };

  Plugin.prototype.onDeviceOrientation = function(event) {

    // Validate environment and event properties.
    if (!this.desktop && event.beta !== null && event.gamma !== null) {

      // Set orientation status.
      this.orientationStatus = 1;

      // Extract Rotation
      var x = (event.beta  || 0) / MAGIC_NUMBER; //  -90 :: 90
      var y = (event.gamma || 0) / MAGIC_NUMBER; // -180 :: 180

      // Detect Orientation Change
      var portrait = window.innerHeight > window.innerWidth;
      if (this.portrait !== portrait) {
        this.portrait = portrait;
        this.calibrationFlag = true;
      }

      // Set Calibration
      if (this.calibrationFlag) {
        this.calibrationFlag = false;
        this.cx = x;
        this.cy = y;
      }

      // Set Input
      this.ix = x;
      this.iy = y;
    }
  };

  Plugin.prototype.onMouseMove = function(event) {

    // Calculate Input
    this.ix = (event.pageX - this.hw) / this.hw;
    this.iy = (event.pageY - this.hh) / this.hh;
  };

  var API = {
    enable: Plugin.prototype.enable,
    disable: Plugin.prototype.disable,
    calibrate: Plugin.prototype.calibrate,
    friction: Plugin.prototype.friction,
    invert: Plugin.prototype.invert,
    scalar: Plugin.prototype.scalar,
    limit: Plugin.prototype.limit
  };

  $.fn[NAME] = function (value) {
    var args = arguments;
    return this.each(function () {
      var $this = $(this);
      var plugin = $this.data(NAME);
      if (!plugin) {
        plugin = new Plugin(this, value);
        $this.data(NAME, plugin);
      }
      if (API[value]) {
        plugin[value].apply(plugin, Array.prototype.slice.call(args, 1));
      }
    });
  };

})(window.jQuery || window.Zepto, window, document);

/**
 * Request Animation Frame Polyfill.
 * @author Tino Zijdel
 * @author Paul Irish
 * @see https://gist.github.com/paulirish/1579671
 */
;(function() {

  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }

}());

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
			lang: _local,
			embed_id: 'timeline',
			start_at_end: true
		});
	}

	// captcha sur formulaire de contact
	$('#contact, #register').motionCaptcha({
		errorMsg: 'Ré-essayes...',
		successMsg: 'Captcha réussi'
	});

	// calculateur de jutsus
	var _calculateur = new Calculateur();

	// parallax
	$('.ninjas').parallax();
});