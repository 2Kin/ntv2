/*
 * Basic jQuery Slider plug-in v.1.3
 *
 * http://www.basic-slider.com
 *
 * Authored by John Cobb
 * http://www.johncobb.name
 * @john0514
 *
 * Copyright 2011, John Cobb
 * License: GNU General Public License, version 3 (GPL-3.0)
 * http://www.opensource.org/licenses/gpl-3.0.html
 *
 */

;(function($) {

    "use strict";

    $.fn.bjqs = function(o) {
        
        // slider default settings
        var defaults        = {

            // w + h to enforce consistency
            width           : 700,
            height          : 300,

            // transition valuess
            animtype        : 'fade',
            animduration    : 450,      // length of transition
            animspeed       : 4000,     // delay between transitions
            automatic       : true,     // enable/disable automatic slide rotation

            // control and marker configuration
            showcontrols    : true,     // enable/disable next + previous UI elements
            centercontrols  : true,     // vertically center controls
            nexttext        : 'Next',   // text/html inside next UI element
            prevtext        : 'Prev',   // text/html inside previous UI element
            showmarkers     : true,     // enable/disable individual slide UI markers
            centermarkers   : true,     // horizontally center markers

            // interaction values
            keyboardnav     : true,     // enable/disable keyboard navigation
            hoverpause      : true,     // enable/disable pause slides on hover

            // presentational options
            usecaptions     : true,     // enable/disable captions using img title attribute
            randomstart     : false,     // start from a random slide
            responsive      : false     // enable responsive behaviour

        };

        // create settings from defauls and user options
        var settings        = $.extend({}, defaults, o);

        // slider elements
        var $wrapper        = this,
            $slider         = $wrapper.find('ul.bjqs'),
            $slides         = $slider.children('li'),

            // control elements
            $c_wrapper      = null,
            $c_fwd          = null,
            $c_prev         = null,

            // marker elements
            $m_wrapper      = null,
            $m_markers      = null,

            // elements for slide animation
            $canvas         = null,
            $clone_first    = null,
            $clone_last     = null;

        // state management object
        var state           = {
            slidecount      : $slides.length,   // total number of slides
            animating       : false,            // bool: is transition is progress
            paused          : false,            // bool: is the slider paused
            currentslide    : 1,                // current slide being viewed (not 0 based)
            nextslide       : 0,                // slide to view next (not 0 based)
            currentindex    : 0,                // current slide being viewed (0 based)
            nextindex       : 0,                // slide to view next (0 based)
            interval        : null              // interval for automatic rotation
        };

        var responsive      = {
            width           : null,
            height          : null,
            ratio           : null
        };

        // helpful variables
        var vars            = {
            fwd             : 'forward',
            prev            : 'previous'
        };
            
        // run through options and initialise settings
        var init = function() {

            // differentiate slider li from content li
            $slides.addClass('bjqs-slide');

            // conf dimensions, responsive or static
            if( settings.responsive ){
                conf_responsive();
            }
            else{
                conf_static();
            }

            // configurations only avaliable if more than 1 slide
            if( state.slidecount > 1 ){

                // enable random start
                if (settings.randomstart){
                    conf_random();
                }

                // create and show controls
                if( settings.showcontrols ){
                    conf_controls();
                }

                // create and show markers
                if( settings.showmarkers ){
                    conf_markers();
                }

                // enable slidenumboard navigation
                if( settings.keyboardnav ){
                    conf_keynav();
                }

                // enable pause on hover
                if (settings.hoverpause && settings.automatic){
                    conf_hoverpause();
                }

                // conf slide animation
                if (settings.animtype === 'slide'){
                    conf_slide();
                }

            } else {
                // Stop automatic animation, because we only have one slide! 
                settings.automatic = false;
            }

            if(settings.usecaptions){
                conf_captions();
            }

            // TODO: need to accomodate random start for slide transition setting
            if(settings.animtype === 'slide' && !settings.randomstart){
                state.currentindex = 1;
                state.currentslide = 2;
            }

            // slide components are hidden by default, show them now
            $slider.show();
            $slides.eq(state.currentindex).show();

            // Finally, if automatic is set to true, kick off the interval
            if(settings.automatic){
                state.interval = setInterval(function () {
                    go(vars.fwd, false);
                }, settings.animspeed);
            }

        };

        var conf_responsive = function() {

            responsive.width    = $wrapper.outerWidth();
            responsive.ratio    = responsive.width/settings.width,
            responsive.height   = settings.height * responsive.ratio;

            if(settings.animtype === 'fade'){

                // initial setup
                $slides.css({
                    'height'        : settings.height,
                    'width'         : '100%'
                });
                $slides.children('img').css({
                    'height'        : settings.height,
                    'width'         : '100%'
                });
                $slider.css({
                    'height'        : settings.height,
                    'width'         : '100%'
                });
                $wrapper.css({
                    'height'        : settings.height,
                    'max-width'     : settings.width,
                    'position'      : 'relative'
                });

                if(responsive.width < settings.width){

                    $slides.css({
                        'height'        : responsive.height
                    });
                    $slides.children('img').css({
                        'height'        : responsive.height
                    });
                    $slider.css({
                        'height'        : responsive.height
                    });
                    $wrapper.css({
                        'height'        : responsive.height
                    });

                }

                $(window).resize(function() {

                    // calculate and update dimensions
                    responsive.width    = $wrapper.outerWidth();
                    responsive.ratio    = responsive.width/settings.width,
                    responsive.height   = settings.height * responsive.ratio;

                    $slides.css({
                        'height'        : responsive.height
                    });
                    $slides.children('img').css({
                        'height'        : responsive.height
                    });
                    $slider.css({
                        'height'        : responsive.height
                    });
                    $wrapper.css({
                        'height'        : responsive.height
                    });

                });

            }

            if(settings.animtype === 'slide'){

                // initial setup
                $slides.css({
                    'height'        : settings.height,
                    'width'         : settings.width
                });
                $slides.children('img').css({
                    'height'        : settings.height,
                    'width'         : settings.width
                });
                $slider.css({
                    'height'        : settings.height,
                    'width'         : settings.width * settings.slidecount
                });
                $wrapper.css({
                    'height'        : settings.height,
                    'max-width'     : settings.width,
                    'position'      : 'relative'
                });

                if(responsive.width < settings.width){

                    $slides.css({
                        'height'        : responsive.height
                    });
                    $slides.children('img').css({
                        'height'        : responsive.height
                    });
                    $slider.css({
                        'height'        : responsive.height
                    });
                    $wrapper.css({
                        'height'        : responsive.height
                    });

                }

                $(window).resize(function() {

                    // calculate and update dimensions
                    responsive.width    = $wrapper.outerWidth(),
                    responsive.ratio    = responsive.width/settings.width,
                    responsive.height   = settings.height * responsive.ratio;

                    $slides.css({
                        'height'        : responsive.height,
                        'width'         : responsive.width
                    });
                    $slides.children('img').css({
                        'height'        : responsive.height,
                        'width'         : responsive.width
                    });
                    $slider.css({
                        'height'        : responsive.height,
                        'width'         : responsive.width * settings.slidecount
                    });
                    $wrapper.css({
                        'height'        : responsive.height
                    });
                    $canvas.css({
                        'height'        : responsive.height,
                        'width'         : responsive.width
                    });

                    resize_complete(function(){
                        go(false,state.currentslide);
                    }, 200, "some unique string");

                });

            }

        };

        var resize_complete = (function () {
            
            var timers = {};
            
            return function (callback, ms, uniqueId) {
                if (!uniqueId) {
                    uniqueId = "Don't call this twice without a uniqueId";
                }
                if (timers[uniqueId]) {
                    clearTimeout (timers[uniqueId]);
                }
                timers[uniqueId] = setTimeout(callback, ms);
            };

        })();

        // enforce fixed sizing on slides, slider and wrapper
        var conf_static = function() {

            $slides.css({
                'height'    : settings.height,
                'width'     : settings.width
            });
            $slider.css({
                'height'    : settings.height,
                'width'     : settings.width
            });
            $wrapper.css({
                'height'    : settings.height,
                'width'     : settings.width,
                'position'  : 'relative'
            });

        };

        var conf_slide = function() {

            // create two extra elements which are clones of the first and last slides
            $clone_first    = $slides.eq(0).clone();
            $clone_last     = $slides.eq(state.slidecount-1).clone();

            // add them to the DOM where we need them
            $clone_first.attr({'data-clone' : 'last', 'data-slide' : 0}).appendTo($slider).show();
            $clone_last.attr({'data-clone' : 'first', 'data-slide' : 0}).prependTo($slider).show();

            // update the elements object
            $slides             = $slider.children('li');
            state.slidecount    = $slides.length;

            // create a 'canvas' element which is neccessary for the slide animation to work
            $canvas = $('<div class="bjqs-wrapper"></div>');

            // if the slider is responsive && the calculated width is less than the max width
            if(settings.responsive && (responsive.width < settings.width)){

                $canvas.css({
                    'width'     : responsive.width,
                    'height'    : responsive.height,
                    'overflow'  : 'hidden',
                    'position'  : 'relative'
                });

                // update the dimensions to the slider to accomodate all the slides side by side
                $slider.css({
                    'width'     : responsive.width * (state.slidecount + 2),
                    'left'      : -responsive.width * state.currentslide
                });

            }
            else {

                $canvas.css({
                    'width'     : settings.width,
                    'height'    : settings.height,
                    'overflow'  : 'hidden',
                    'position'  : 'relative'
                });

                // update the dimensions to the slider to accomodate all the slides side by side
                $slider.css({
                    'width'     : settings.width * (state.slidecount + 2),
                    'left'      : -settings.width * state.currentslide
                });

            }

            // add some inline styles which will align our slides for left-right sliding
            $slides.css({
                'float'         : 'left',
                'position'      : 'relative',
                'display'       : 'list-item'
            });

            // 'everything.. in it's right place'
            $canvas.prependTo($wrapper);
            $slider.appendTo($canvas);

        };

        var conf_controls = function() {

            // create the elements for the controls
            $c_wrapper  = $('<ul class="bjqs-controls"></ul>');
            $c_fwd      = $('<li class="bjqs-next"><a href="#" data-direction="'+ vars.fwd +'">' + settings.nexttext + '</a></li>');
            $c_prev     = $('<li class="bjqs-prev"><a href="#" data-direction="'+ vars.prev +'">' + settings.prevtext + '</a></li>');

            // bind click events
            $c_wrapper.on('click','a',function(e){

                e.preventDefault();
                var direction = $(this).attr('data-direction');

                if(!state.animating){

                    if(direction === vars.fwd){
                        go(vars.fwd,false);
                    }

                    if(direction === vars.prev){
                        go(vars.prev,false);
                    }

                }

            });

            // put 'em all together
            $c_prev.appendTo($c_wrapper);
            $c_fwd.appendTo($c_wrapper);
            $c_wrapper.appendTo($wrapper);

            // vertically center the controls
            if (settings.centercontrols) {

                $c_wrapper.addClass('v-centered');

                // calculate offset % for vertical positioning
                var offset_px   = ($wrapper.height() - $c_fwd.children('a').outerHeight()) / 2,
                    ratio       = (offset_px / settings.height) * 100,
                    offset      = ratio + '%';

                $c_fwd.find('a').css('top', offset);
                $c_prev.find('a').css('top', offset);

            }

        };

        var conf_markers = function() {

            // create a wrapper for our markers
            $m_wrapper = $('<ol class="bjqs-markers"></ol>');

            // for every slide, create a marker
            $.each($slides, function(key, slide){

                var slidenum    = key + 1,
                    gotoslide   = key + 1;
                
                if(settings.animtype === 'slide'){
                    // + 2 to account for clones
                    gotoslide = key + 2;
                }

                var marker = $('<li><a href="#">'+ slidenum +'</a></li>');

                // set the first marker to be active
                if(slidenum === state.currentslide){ marker.addClass('active-marker'); }

                // bind the click event
                marker.on('click','a',function(e){
                    e.preventDefault();
                    if(!state.animating && state.currentslide !== gotoslide){
                        go(false,gotoslide);
                    }
                });

                // add the marker to the wrapper
                marker.appendTo($m_wrapper);

            });

            $m_wrapper.appendTo($wrapper);
            $m_markers = $m_wrapper.find('li');

            // center the markers
            if (settings.centermarkers) {
                $m_wrapper.addClass('h-centered');
                var offset = (settings.width - $m_wrapper.width()) / 2;
                $m_wrapper.css('left', offset);
            }

        };

        var conf_keynav = function() {

            $(document).keyup(function (event) {

                if (!state.paused) {
                    clearInterval(state.interval);
                    state.paused = true;
                }

                if (!state.animating) {
                    if (event.keyCode === 39) {
                        event.preventDefault();
                        go(vars.fwd, false);
                    } else if (event.keyCode === 37) {
                        event.preventDefault();
                        go(vars.prev, false);
                    }
                }

                if (state.paused && settings.automatic) {
                    state.interval = setInterval(function () {
                        go(vars.fwd);
                    }, settings.animspeed);
                    state.paused = false;
                }

            });

        };

        var conf_hoverpause = function() {

            $wrapper.hover(function () {
                if (!state.paused) {
                    clearInterval(state.interval);
                    state.paused = true;
                }
            }, function () {
                if (state.paused) {
                    state.interval = setInterval(function () {
                        go(vars.fwd, false);
                    }, settings.animspeed);
                    state.paused = false;
                }
            });

        };

        var conf_captions = function() {

            $.each($slides, function (key, slide) {

                var caption = $(slide).children('img:first-child').attr('title');

                // Account for images wrapped in links
                if(!caption){
                    caption = $(slide).children('a').find('img:first-child').attr('title');
                }

                if (caption) {
                    caption = $('<p class="bjqs-caption">' + caption + '</p>');
                    caption.appendTo($(slide));
                }

            });

        };

        var conf_random = function() {

            var rand            = Math.floor(Math.random() * state.slidecount) + 1;
            state.currentslide  = rand;
            state.currentindex  = rand-1;

        };

        var set_next = function(direction) {

            if(direction === vars.fwd){
                
                if($slides.eq(state.currentindex).next().length){
                    state.nextindex = state.currentindex + 1;
                    state.nextslide = state.currentslide + 1;
                }
                else{
                    state.nextindex = 0;
                    state.nextslide = 1;
                }

            }
            else{

                if($slides.eq(state.currentindex).prev().length){
                    state.nextindex = state.currentindex - 1;
                    state.nextslide = state.currentslide - 1;
                }
                else{
                    state.nextindex = state.slidecount - 1;
                    state.nextslide = state.slidecount;
                }

            }

        };

        var go = function(direction, position) {

            // only if we're not already doing things
            if(!state.animating){

                // doing things
                state.animating = true;

                if(position){
                    state.nextslide = position;
                    state.nextindex = position-1;
                }
                else{
                    set_next(direction);
                }

                // fade animation
                if(settings.animtype === 'fade'){

                    if(settings.showmarkers){
                        $m_markers.removeClass('active-marker');
                        $m_markers.eq(state.nextindex).addClass('active-marker');
                    }

                    // fade out current
                    $slides.eq(state.currentindex).fadeOut(settings.animduration);
                    // fade in next
                    $slides.eq(state.nextindex).fadeIn(settings.animduration, function(){

                        // update state variables
                        state.animating = false;
                        state.currentslide = state.nextslide;
                        state.currentindex = state.nextindex;

                    });

                }

                // slide animation
                if(settings.animtype === 'slide'){

                    if(settings.showmarkers){
                        
                        var markerindex = state.nextindex-1;

                        if(markerindex === state.slidecount-2){
                            markerindex = 0;
                        }
                        else if(markerindex === -1){
                            markerindex = state.slidecount-3;
                        }

                        $m_markers.removeClass('active-marker');
                        $m_markers.eq(markerindex).addClass('active-marker');
                    }

                    // if the slider is responsive && the calculated width is less than the max width
                    if(settings.responsive && ( responsive.width < settings.width ) ){
                        state.slidewidth = responsive.width;
                    }
                    else{
                        state.slidewidth = settings.width;
                    }

                    $slider.animate({'left': -state.nextindex * state.slidewidth }, settings.animduration, function(){

                        state.currentslide = state.nextslide;
                        state.currentindex = state.nextindex;

                        // is the current slide a clone?
                        if($slides.eq(state.currentindex).attr('data-clone') === 'last'){

                            // affirmative, at the last slide (clone of first)
                            $slider.css({'left': -state.slidewidth });
                            state.currentslide = 2;
                            state.currentindex = 1;

                        }
                        else if($slides.eq(state.currentindex).attr('data-clone') === 'first'){

                            // affirmative, at the fist slide (clone of last)
                            $slider.css({'left': -state.slidewidth *(state.slidecount - 2)});
                            state.currentslide = state.slidecount - 1;
                            state.currentindex = state.slidecount - 2;

                        }

                        state.animating = false;

                    });

                }

            }

        };

        // lets get the party started :)
        init();

    };

})(jQuery);
var unityObject={javaInstallDone:function(d,a,b){var c=parseInt(d.substring(d.lastIndexOf("_")+1),10);if(!isNaN(c)){setTimeout(function(){UnityObject2.instances[c].javaInstallDoneCallback(d,a,b)},10)}}};var UnityObject2=function(J){var ac=[],i=window,Y=document,W=navigator,E=null,h=[],af=(document.location.protocol=="https:"),y=af?"https://ssl-webplayer.unity3d.com/":"http://webplayer.unity3d.com/",K="_unity_triedjava",G=a(K),r="_unity_triedclickonce",u=a(r),aa=false,B=[],O=false,w=null,f=null,P=null,l=[],T=null,q=[],V=false,U="installed",L="missing",b="broken",v="unsupported",C="ready",z="start",F="error",Z="first",A="java",s="clickonce",M=false,R=null,x={pluginName:"Unity Player",pluginMimeType:"application/vnd.unity",baseDownloadUrl:y+"download_webplayer-3.x/",fullInstall:false,autoInstall:false,enableJava:true,enableJVMPreloading:false,enableClickOnce:true,enableUnityAnalytics:false,enableGoogleAnalytics:true,params:{},attributes:{},referrer:null,debugLevel:0};x=jQuery.extend(true,x,J);if(x.referrer===""){x.referrer=null}if(af){x.enableUnityAnalytics=false}function a(ag){var ah=new RegExp(escape(ag)+"=([^;]+)");if(ah.test(Y.cookie+";")){ah.exec(Y.cookie+";");return RegExp.$1}return false}function e(ag,ah){document.cookie=escape(ag)+"="+escape(ah)+"; path=/"}function N(am){var an=0,ai,al,aj,ag,ah;if(am){var ak=am.toLowerCase().match(/^(\d+)(?:\.(\d+)(?:\.(\d+)([dabfr])?(\d+)?)?)?$/);if(ak&&ak[1]){ai=ak[1];al=ak[2]?ak[2]:0;aj=ak[3]?ak[3]:0;ag=ak[4]?ak[4]:"r";ah=ak[5]?ak[5]:0;an|=((ai/10)%10)<<28;an|=(ai%10)<<24;an|=(al%10)<<20;an|=(aj%10)<<16;an|={d:2<<12,a:4<<12,b:6<<12,f:8<<12,r:8<<12}[ag];an|=((ah/100)%10)<<8;an|=((ah/10)%10)<<4;an|=(ah%10)}}return an}function ae(al,ag){var ai=Y.getElementsByTagName("body")[0];var ah=Y.createElement("object");var aj=0;if(ai&&ah){ah.setAttribute("type",x.pluginMimeType);ah.style.visibility="hidden";ai.appendChild(ah);var ak=0;(function(){if(typeof ah.GetPluginVersion==="undefined"){if(ak++<10){setTimeout(arguments.callee,10)}else{ai.removeChild(ah);al(null)}}else{var am={};if(ag){for(aj=0;aj<ag.length;++aj){am[ag[aj]]=ah.GetUnityVersion(ag[aj])}}am.plugin=ah.GetPluginVersion();ai.removeChild(ah);al(am)}})()}else{al(null)}}function c(){var ag=x.fullInstall?"UnityWebPlayerFull.exe":"UnityWebPlayer.exe";if(x.referrer!==null){ag+="?referrer="+x.referrer}return ag}function ab(){var ag="UnityPlayer.plugin.zip";if(x.referrer!=null){ag+="?referrer="+x.referrer}return ag}function m(){return x.baseDownloadUrl+(t.win?c():ab())}function D(ai,ah,aj,ag){if(ai===L){M=true}if(jQuery.inArray(ai,q)===-1){if(M){j.send(ai,ah,aj,ag)}q.push(ai)}T=ai}var t=function(){var ai=W.userAgent,ak=W.platform;var al=/chrome/i.test(ai);var am={w3:typeof Y.getElementById!="undefined"&&typeof Y.getElementsByTagName!="undefined"&&typeof Y.createElement!="undefined",win:ak?/win/i.test(ak):/win/i.test(ai),mac:ak?/mac/i.test(ak):/mac/i.test(ai),ie:/msie/i.test(ai)?parseFloat(ai.replace(/^.*msie ([0-9]+(\.[0-9]+)?).*$/i,"$1")):false,ff:/firefox/i.test(ai),op:/opera/i.test(ai),ch:al,ch_v:/chrome/i.test(ai)?parseFloat(ai.replace(/^.*chrome\/(\d+(\.\d+)?).*$/i,"$1")):false,sf:/safari/i.test(ai)&&!al,wk:/webkit/i.test(ai)?parseFloat(ai.replace(/^.*webkit\/(\d+(\.\d+)?).*$/i,"$1")):false,x64:/win64/i.test(ai)&&/x64/i.test(ai),moz:/mozilla/i.test(ai)?parseFloat(ai.replace(/^.*mozilla\/([0-9]+(\.[0-9]+)?).*$/i,"$1")):0,mobile:/ipad/i.test(ak)||/iphone/i.test(ak)||/ipod/i.test(ak)||/android/i.test(ai)||/windows phone/i.test(ai)};am.clientBrand=am.ch?"ch":am.ff?"ff":am.sf?"sf":am.ie?"ie":am.op?"op":"??";am.clientPlatform=am.win?"win":am.mac?"mac":"???";var an=Y.getElementsByTagName("script");for(var ag=0;ag<an.length;++ag){var aj=an[ag].src.match(/^(.*)3\.0\/uo\/UnityObject2\.js$/i);if(aj){x.baseDownloadUrl=aj[1];break}}function ah(aq,ap){for(var ar=0;ar<Math.max(aq.length,ap.length);++ar){var ao=(ar<aq.length)&&aq[ar]?new Number(aq[ar]):0;var at=(ar<ap.length)&&ap[ar]?new Number(ap[ar]):0;if(ao<at){return -1}if(ao>at){return 1}}return 0}am.java=function(){if(W.javaEnabled()){var ar=(am.win&&am.ff);var av=false;if(ar||av){if(typeof W.mimeTypes!="undefined"){var au=ar?[1,6,0,12]:[1,4,2,0];for(var aq=0;aq<W.mimeTypes.length;++aq){if(W.mimeTypes[aq].enabledPlugin){var ao=W.mimeTypes[aq].type.match(/^application\/x-java-applet;(?:jpi-)?version=(\d+)(?:\.(\d+)(?:\.(\d+)(?:_(\d+))?)?)?$/);if(ao!=null){if(ah(au,ao.slice(1))<=0){return true}}}}}}else{if(am.win&&am.ie){if(typeof ActiveXObject!="undefined"){function ap(aw){try{return new ActiveXObject("JavaWebStart.isInstalled."+aw+".0")!=null}catch(ax){return false}}function at(aw){try{return new ActiveXObject("JavaPlugin.160_"+aw)!=null}catch(ax){return false}}if(ap("1.7.0")){return true}if(am.ie>=8){if(ap("1.6.0")){for(var aq=12;aq<=50;++aq){if(at(aq)){if(am.ie==9&&am.moz==5&&aq<24){continue}else{return true}}}return false}}else{return ap("1.6.0")||ap("1.5.0")||ap("1.4.2")}}}}}return false}();am.co=function(){if(am.win&&am.ie){var ao=ai.match(/(\.NET CLR [0-9.]+)|(\.NET[0-9.]+)/g);if(ao!=null){var ar=[3,5,0];for(var aq=0;aq<ao.length;++aq){var ap=ao[aq].match(/[0-9.]{2,}/g)[0].split(".");if(ah(ar,ap)<=0){return true}}}}return false}();return am}();var j=function(){var ag=function(){var ao=new Date();var an=Date.UTC(ao.getUTCFullYear(),ao.getUTCMonth(),ao.getUTCDay(),ao.getUTCHours(),ao.getUTCMinutes(),ao.getUTCSeconds(),ao.getUTCMilliseconds());return an.toString(16)+am().toString(16)}();var ai=0;var ah=window._gaq=(window._gaq||[]);ak();function am(){return Math.floor(Math.random()*2147483647)}function ak(){var at=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";var ap=Y.getElementsByTagName("script");var au=false;for(var ar=0;ar<ap.length;++ar){if(ap[ar].src&&ap[ar].src.toLowerCase()==at.toLowerCase()){au=true;break}}if(!au){var aq=Y.createElement("script");aq.type="text/javascript";aq.async=true;aq.src=at;var ao=document.getElementsByTagName("script")[0];ao.parentNode.insertBefore(aq,ao)}var an=(x.debugLevel===0)?"UA-16068464-16":"UA-16068464-17";ah.push(["unity._setDomainName","none"]);ah.push(["unity._setAllowLinker",true]);ah.push(["unity._setReferrerOverride"," "+this.location.toString()]);ah.push(["unity._setAccount",an]);ah.push(["unity._setCustomVar",1,"Revision","e0e43d8876fe",2])}function aj(ar,ap,at,ao){if(!x.enableUnityAnalytics){if(ao){ao()}return}var an="http://unityanalyticscapture.appspot.com/event?u="+encodeURIComponent(ag)+"&s="+encodeURIComponent(ai)+"&e="+encodeURIComponent(ar);an+="&v="+encodeURIComponent("e0e43d8876fe");if(x.referrer!==null){an+="?r="+x.referrer}if(ap){an+="&t="+encodeURIComponent(ap)}if(at){an+="&d="+encodeURIComponent(at)}var aq=new Image();if(ao){aq.onload=aq.onerror=ao}aq.src=an}function al(ap,an,aq,ay){if(!x.enableGoogleAnalytics){if(ay){ay()}return}var av="/webplayer/install/"+ap;var aw="?";if(an){av+=aw+"t="+encodeURIComponent(an);aw="&"}if(aq){av+=aw+"d="+encodeURIComponent(aq);aw="&"}if(ay){ah.push(function(){setTimeout(ay,1000)})}var at=x.src;if(at.length>40){at=at.replace("http://","");var ao=at.split("/");var ax=ao.shift();var ar=ao.pop();at=ax+"/../"+ar;while(at.length<40&&ao.length>0){var au=ao.pop();if(at.length+au.length+5<40){ar=au+"/"+ar}else{ar="../"+ar}at=ax+"/../"+ar}}ah.push(["unity._setCustomVar",2,"GameURL",at,3]);ah.push(["unity._setCustomVar",1,"UnityObjectVersion","2",3]);if(an){ah.push(["unity._setCustomVar",3,"installMethod",an,3])}ah.push(["unity._trackPageview",av])}return{send:function(aq,ap,at,an){if(x.enableUnityAnalytics||x.enableGoogleAnalytics){n("Analytics SEND",aq,ap,at,an)}++ai;var ar=2;var ao=function(){if(0==--ar){w=null;window.location=an}};if(at===null||at===undefined){at=""}aj(aq,ap,at,an?ao:null);al(aq,ap,at,an?ao:null)}}}();function I(ai,aj,ak){var ag,an,al,am,ah;if(t.win&&t.ie){an="";for(ag in ai){an+=" "+ag+'="'+ai[ag]+'"'}al="";for(ag in aj){al+='<param name="'+ag+'" value="'+aj[ag]+'" />'}ak.outerHTML="<object"+an+">"+al+"</object>"}else{am=Y.createElement("object");for(ag in ai){am.setAttribute(ag,ai[ag])}for(ag in aj){ah=Y.createElement("param");ah.name=ag;ah.value=aj[ag];am.appendChild(ah)}ak.parentNode.replaceChild(am,ak)}}function o(ag){if(typeof ag=="undefined"){return false}if(!ag.complete){return false}if(typeof ag.naturalWidth!="undefined"&&ag.naturalWidth==0){return false}return true}function H(aj){var ah=false;for(var ai=0;ai<l.length;ai++){if(!l[ai]){continue}var ag=Y.images[l[ai]];if(!o(ag)){ah=true}else{l[ai]=null}}if(ah){setTimeout(arguments.callee,100)}else{setTimeout(function(){d(aj)},100)}}function d(aj){var al=Y.getElementById(aj);if(!al){al=Y.createElement("div");var ag=Y.body.lastChild;Y.body.insertBefore(al,ag.nextSibling)}var ak=x.baseDownloadUrl+"3.0/jws/";var ah={id:aj,type:"application/x-java-applet",code:"JVMPreloader",width:1,height:1,name:"JVM Preloader"};var ai={context:aj,codebase:ak,classloader_cache:false,scriptable:true,mayscript:true};I(ah,ai,al);jQuery("#"+aj).show()}function S(ah){G=true;e(K,G);var aj=Y.getElementById(ah);var al=ah+"_applet_"+E;B[al]={attributes:x.attributes,params:x.params,callback:x.callback,broken:x.broken};var an=B[al];var ak={id:al,type:"application/x-java-applet",archive:x.baseDownloadUrl+"3.0/jws/UnityWebPlayer.jar",code:"UnityWebPlayer",width:1,height:1,name:"Unity Web Player"};if(t.win&&t.ff){ak.style="visibility: hidden;"}var am={context:al,jnlp_href:x.baseDownloadUrl+"3.0/jws/UnityWebPlayer.jnlp",classloader_cache:false,installer:m(),image:y+"installation/unitylogo.png",centerimage:true,boxborder:false,scriptable:true,mayscript:true};for(var ag in an.params){if(ag=="src"){continue}if(an.params[ag]!=Object.prototype[ag]){am[ag]=an.params[ag];if(ag.toLowerCase()=="logoimage"){am.image=an.params[ag]}else{if(ag.toLowerCase()=="backgroundcolor"){am.boxbgcolor="#"+an.params[ag]}else{if(ag.toLowerCase()=="bordercolor"){am.boxborder=true}else{if(ag.toLowerCase()=="textcolor"){am.boxfgcolor="#"+an.params[ag]}}}}}}var ai=Y.createElement("div");aj.appendChild(ai);I(ak,am,ai);jQuery("#"+ah).show()}function X(ag){setTimeout(function(){var ah=Y.getElementById(ag);if(ah){ah.parentNode.removeChild(ah)}},0)}function g(ak){var al=B[ak],aj=Y.getElementById(ak),ai;if(!aj){return}aj.width=al.attributes.width||600;aj.height=al.attributes.height||450;var ah=aj.parentNode;var ag=ah.childNodes;for(var am=0;am<ag.length;am++){ai=ag[am];if(ai.nodeType==1&&ai!=aj){ah.removeChild(ai)}}}function k(ai,ag,ah){n("_javaInstallDoneCallback",ai,ag,ah);if(!ag){D(F,A,ah)}}function ad(){ac.push(arguments);if(x.debugLevel>0&&window.console&&window.console.log){console.log(Array.prototype.slice.call(arguments))}}function n(){ac.push(arguments);if(x.debugLevel>1&&window.console&&window.console.log){console.log(Array.prototype.slice.call(arguments))}}function p(ag){if(/^[-+]?[0-9]+$/.test(ag)){ag+="px"}return ag}var Q={getLogHistory:function(){return ac},getConfig:function(){return x},getPlatformInfo:function(){return t},initPlugin:function(ag,ah){x.targetEl=ag;x.src=ah;n("ua:",t);this.detectUnity(this.handlePluginStatus)},detectUnity:function(ar,ah){var ap=this;var aj=L;var al;W.plugins.refresh();if(t.clientBrand==="??"||t.clientPlatform==="???"||t.mobile){aj=v}else{if(t.op&&t.mac){aj=v;al="OPERA-MAC"}else{if(typeof W.plugins!="undefined"&&W.plugins[x.pluginName]&&typeof W.mimeTypes!="undefined"&&W.mimeTypes[x.pluginMimeType]&&W.mimeTypes[x.pluginMimeType].enabledPlugin){aj=U;if(t.sf&&/Mac OS X 10_6/.test(W.appVersion)){ae(function(at){if(!at||!at.plugin){aj=b;al="OSX10.6-SFx64"}D(aj,P,al);ar.call(ap,aj,at)},ah);return}else{if(t.mac&&t.ch){ae(function(at){if(at&&(N(at.plugin)<=N("2.6.1f3"))){aj=b;al="OSX-CH-U<=2.6.1f3"}D(aj,P,al);ar.call(ap,aj,at)},ah);return}else{if(ah){ae(function(at){D(aj,P,al);ar.call(ap,aj,at)},ah);return}}}}else{if(typeof i.ActiveXObject!="undefined"){try{var aq=new ActiveXObject("UnityWebPlayer.UnityWebPlayer.1");var ai=aq.GetPluginVersion();if(ah){var an={};for(var ag=0;ag<ah.length;++ag){an[ah[ag]]=aq.GetUnityVersion(ah[ag])}an.plugin=ai}aj=U;if(ai=="2.5.0f5"){var ao=/Windows NT \d+\.\d+/.exec(W.userAgent);if(ao&&ao.length>0){var am=parseFloat(ao[0].split(" ")[2]);if(am>=6){aj=b;al="WIN-U2.5.0f5"}}}}catch(ak){if(t.win&&t.ie&&t.x64){aj=v;al="WIN-IEx64"}}}}}}D(aj,P,al);ar.call(ap,aj,an)},handlePluginStatus:function(ai,ag){var ah=x.targetEl;var ak=jQuery(ah);switch(ai){case U:this.notifyProgress(ak);this.embedPlugin(ak,x.callback);break;case L:this.notifyProgress(ak);var aj=this;var al=(x.debugLevel===0)?1000:8000;setTimeout(function(){x.targetEl=ah;aj.detectUnity(aj.handlePluginStatus)},al);break;case b:this.notifyProgress(ak);break;case v:this.notifyProgress(ak);break}},getPluginURL:function(){var ag="http://unity3d.com/webplayer/";if(t.win){ag=x.baseDownloadUrl+c()}else{if(W.platform=="MacIntel"){ag=x.baseDownloadUrl+(x.fullInstall?"webplayer-i386.dmg":"webplayer-mini.dmg");if(x.referrer!==null){ag+="?referrer="+x.referrer}}else{if(W.platform=="MacPPC"){ag=x.baseDownloadUrl+(x.fullInstall?"webplayer-ppc.dmg":"webplayer-mini.dmg");if(x.referrer!==null){ag+="?referrer="+x.referrer}}}}return ag},getClickOnceURL:function(){return x.baseDownloadUrl+"3.0/co/UnityWebPlayer.application?installer="+encodeURIComponent(x.baseDownloadUrl+c())},embedPlugin:function(aj,ar){aj=jQuery(aj).empty();var ap=x.src;var ah=x.width||"100%";var am=x.height||"100%";var aq=this;if(t.win&&t.ie){var ai="";for(var ag in x.attributes){if(x.attributes[ag]!=Object.prototype[ag]){if(ag.toLowerCase()=="styleclass"){ai+=' class="'+x.attributes[ag]+'"'}else{if(ag.toLowerCase()!="classid"){ai+=" "+ag+'="'+x.attributes[ag]+'"'}}}}var al="";al+='<param name="src" value="'+ap+'" />';al+='<param name="firstFrameCallback" value="UnityObject2.instances['+E+'].firstFrameCallback();" />';for(var ag in x.params){if(x.params[ag]!=Object.prototype[ag]){if(ag.toLowerCase()!="classid"){al+='<param name="'+ag+'" value="'+x.params[ag]+'" />'}}}var ao='<object classid="clsid:444785F1-DE89-4295-863A-D46C3A781394" style="display: block; width: '+p(ah)+"; height: "+p(am)+';"'+ai+">"+al+"</object>";var an=jQuery(ao);aj.append(an);h.push(aj.attr("id"));R=an[0]}else{var ak=jQuery("<embed/>").attr({src:ap,type:x.pluginMimeType,width:ah,height:am,firstFrameCallback:"UnityObject2.instances["+E+"].firstFrameCallback();"}).attr(x.attributes).attr(x.params).css({display:"block",width:p(ah),height:p(am)}).appendTo(aj);R=ak[0]}if(!t.sf||!t.mac){setTimeout(function(){R.focus()},100)}if(ar){ar()}},getBestInstallMethod:function(){var ag="Manual";if(x.enableJava&&t.java&&G===false){ag="JavaInstall"}else{if(x.enableClickOnce&&t.co&&u===false){ag="ClickOnceIE"}}return ag},installPlugin:function(ah){if(ah==null||ah==undefined){ah=this.getBestInstallMethod()}var ag=null;switch(ah){case"JavaInstall":this.doJavaInstall(x.targetEl.id);break;case"ClickOnceIE":var ai=jQuery("<iframe src='"+this.getClickOnceURL()+"' style='display:none;' />");jQuery(x.targetEl).append(ai);break;default:case"Manual":var ai=jQuery("<iframe src='"+this.getPluginURL()+"' style='display:none;' />");jQuery(x.targetEl).append(ai);break}P=ah;j.send(z,ah,null,null)},trigger:function(ah,ag){if(ag){n('trigger("'+ah+'")',ag)}else{n('trigger("'+ah+'")')}jQuery(document).trigger(ah,ag)},notifyProgress:function(ag){if(typeof aa!=="undefined"&&typeof aa==="function"){var ah={ua:t,pluginStatus:T,bestMethod:null,lastType:P,targetEl:x.targetEl,unityObj:this};if(T===L){ah.bestMethod=this.getBestInstallMethod()}if(f!==T){f=T;aa(ah)}}},observeProgress:function(ag){aa=ag},firstFrameCallback:function(){n("*** firstFrameCallback ("+E+") ***");T=Z;this.notifyProgress();if(M===true){j.send(T,P)}},setPluginStatus:function(ai,ah,aj,ag){D(ai,ah,aj,ag)},doJavaInstall:function(ag){S(ag)},jvmPreloaded:function(ag){X(ag)},appletStarted:function(ag){g(ag)},javaInstallDoneCallback:function(ai,ag,ah){k(ai,ag,ah)},getUnity:function(){return R}};E=UnityObject2.instances.length;UnityObject2.instances.push(Q);return Q};UnityObject2.instances=[];
/*
* jQuery tagit
*
* Copyright 2011, Nico Rehwaldt
* Released under the MIT license
* 
* 
* Inspired by jQuery UI tagit (http://aehlke.github.com/tag-it/) but with 
* cleaner syntax, less styles and bootstrap (http://twitter.github.com/bootstrap) 
* support.
* 
* @version v1.0 (06/2011)
* @author nico.rehwaldt
* 
* Starting with a simple ul element
* 
*     <ul id="tags"></ul>
* 
* Make it a tagit element
* 
*     $("#tags").tagit();
* 
* yields the following markup:
* 
*     <ul id="tags" class="fake-input tagit" tabindex="1">
*        <li class="tag"><span>Hello World!</span><input type="hidden" name="tag" value="Hello World!"><a class="close">x</a></li>
*        <li class="tag"><span>Bar</span><input type="hidden" name="tag" value="Bar"><a class="close">x</a></li>
*        <li class="tag"><span>Foo</span><input type="hidden" name="tag" value="Foo"><a class="close">x</a></li>
*        <li class="tagit-edit-handle">
*            <input type="text" class="no-style"><ul></ul>
*        </li>
*     </ul>
* 
* Feel free to style it (as you wish).
* 
* Methods
* =======
* 
* addTag(name): Adds a tag with the given name
* 
* Options
* =======
* var options = { 
*     // Field to be sent in form for each selected tag
*     field: "tags", 
*     
*     // Source to autocomplete from
*     tags: []       
*     
*     // Function to provide the tags
*     tags: function(input) {
*         // return tags based on input variations
*     }
* };
*/
(function($) {
    var tagit = {
        "addTag": function(tag) {
            var element;
            var self = $(this);

            if (typeof tag === "string") {
                
                var selection = $(this).find("input[type=hidden]").filter(function() {
                    return $(this).val() == tag;
                });
                
                // Tag already added
                if (selection.length) {
                    return;
                }
                
                element = $('<li></li>');
            } else {
                element = $(tag);
                tag = element.text();
            }

            var data = self.data("tagit");
            
            var hiddenInput = $('<input type="hidden"/>')
                                    .attr("name", data.field)
                                    .val(tag);

            element
                .empty()
                .append($("<span></span>").text(tag))
                .append(hiddenInput);

            var close = $('<a class="close"></a>');
            close
                .text(unescape("%D7"))
                .click(function() {
                    $(this).parent().remove();
                });
            
            element
                .addClass("tag")
                .append(close);

            if (!$(element).parent().length) {
               element.insertBefore($(".tagit-edit-handle", self));
            }

            self.trigger("tagit-tag-added", [tag]);
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
		// ajout autocomplete pour ajax
		autocomplete:function(tags, autocomplete){
            var currentTags = $(this).tagit("getTags");

			autocomplete.empty();
			
			var availableTags = $.grep(tags, function(e) {
				return $.inArray(e, currentTags) == -1;
			});
			
			var count = 0;
			$.each(availableTags, function(i, e) {
				autocomplete.append($("<li></li>").text(e));
				count++;
			});
			
			if (count > 0) {
				autocomplete.addClass("open");
			} else {
				autocomplete.removeClass("open");
			}
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
                            .find("input[type=text]");/* .focus(); suppression puisque ça créé une boucle !*/
                    }).bind("focusout", function(event) {
                        $(this).removeClass("focused");
                        input.val("");
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
                                    e.tagit("addTag", selection.text());
                                    self.val("");
                                }
                            }

                            event.preventDefault();
                        } else 
                        // tab key pressed
                        if (keyCode == 9) {
                            if (tag) {
                                e.tagit("addTag", self.val());
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
                                }else{
									autocomplete.empty();
									
									var availableTags = $.grep(tags, function(e) {
										return $.inArray(e, currentTags) == -1;
									});
									
									var count = 0;
									$.each(availableTags, function(i, e) {
										if (e.toLowerCase().indexOf(tag) == 0) {
											autocomplete.append($("<li></li>").text(e));
											count++;
										}
									});
									
									if (count > 0) {
										autocomplete.addClass("open");
									} else {
										autocomplete.removeClass("open");
									}
								}
                            }
                        }
                    });

                    autocomplete.click(function(event) {
                        var target = $(event.target);
                        if (target.is("li")) {
                            $(e).tagit("addTag", target.text());
                        }
                    });
                    
                    e.append($('<li class="tagit-edit-handle"></li>').append(input).append(autocomplete))
                     .addClass("tagit");

                    $("li:not(.tagit-edit-handle)", e).each(function() {
                        $(e).tagit("addTag", this);
                    });
                }
            });
        }
    });

    $.fn.tagit.defaults = {
        field: "tag",
        tags: []
    };
})(jQuery);
/**
 * jQuery Bracket
 *
 * Copyright (c) 2011-2013, Teijo Laine,
 * http://aropupu.fi/bracket/
 *
 * Licenced under the MIT licence
 */
(function ($) {
  var JqueryBracket = function (opts) {
    var align = opts.dir === 'lr' ? 'right' : 'left'
    var resultIdentifier

    function defaultEdit(span, data, done) {
      var input = $('<input type="text">')
      input.val(data)
      span.html(input)
      input.focus()
      input.blur(function () {
        done(input.val())
      })
      input.keydown(function (e) {
        var key = (e.keyCode || e.which)
        if (key === 9 /*tab*/ || key === 13 /*return*/ || key === 27 /*esc*/) {
          e.preventDefault()
          done(input.val(), (key !== 27))
        }
      })
    }

    function defaultRender(container, team, score) {
      container.append(team)
    }

    function assert(statement) {
      if (!statement)
        throw new Error('Assertion error')
    }

    if (!opts)
      throw new Error('Options not set')
    if (!opts.el)
      throw new Error('Invalid jQuery object as container')
    if (!opts.init && !opts.save)
      throw new Error('No bracket data or save callback given')
    if (opts.userData === undefined)
      opts.userData = null

    if (opts.decorator && (!opts.decorator.edit || !opts.decorator.render))
      throw new Error('Invalid decorator input')
    else if (!opts.decorator)
      opts.decorator = { edit: defaultEdit, render: defaultRender }

    var data
    if (!opts.init)
      opts.init = {teams: [
        ['', '']
      ],
        results: [] }

    data = opts.init

    var topCon = $('<div class="jQBracket ' + opts.dir + '"></div>').appendTo(opts.el.empty())

    // http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function renderAll(save) {
      resultIdentifier = 0
      w.render()
      if (l && f) {
        l.render()
        f.render()
      }
      postProcess(topCon)

      if (save) {
        data.results[0] = w.results()
        if (l && f) {
          data.results[1] = l.results()
          data.results[2] = f.results()
        }
        if (opts.save)
          opts.save(data, opts.userData)
      }
    }

    var Match = function (round, data, idx, results, renderCb) {
      function connector(height, shift, teamCon) {
        var width = parseInt($('.round:first').css('margin-right'), 10) / 2
        var drop = true;
        // drop:
        // [team]'\
        //         \_[team]
        // !drop:
        //         /'[team]
        // [team]_/
        if (height < 0) {
          drop = false;
          height = -height;
        }
        /* straight lines are prettier */
        if (height < 2)
          height = 0

        var src = $('<div class="connector"></div>').appendTo(teamCon);
        src.css('height', height);
        src.css('width', width + 'px');
        src.css(align, (-width - 2) + 'px');

        if (shift >= 0)
          src.css('top', shift + 'px');
        else
          src.css('bottom', (-shift) + 'px');

        if (drop)
          src.css('border-bottom', 'none');
        else
          src.css('border-top', 'none');

        var dst = $('<div class="connector"></div>').appendTo(src);
        dst.css('width', width + 'px');
        dst.css(align, -width + 'px');
        if (drop)
          dst.css('bottom', '0px');
        else
          dst.css('top', '0px');

        return src;
      }

      function winner() {
        if (isNumber(data[0].score) && isNumber(data[1].score)) {
          if (data[0].score > data[1].score)
            return data[0]
          else if (data[0].score < data[1].score)
            return data[1]
        }

        return {source: null, name: null, id: -1, score: null}
      }

      function loser() {
        if (isNumber(data[0].score) && isNumber(data[1].score)) {
          if (data[0].score > data[1].score)
            return data[1]
          else if (data[0].score < data[1].score)
            return data[0]
        }

        return {source: null, name: null, id: -1, score: null}
      }

      function teamElement(round, team, isReady) {
        var rId = resultIdentifier
        var sEl = $('<span id="result-' + rId + '"></span>')
        var score
        if (!team.name || !isReady) {
          score = '--'
        }
        else {
          if (!isNumber(team.score))
            team.score = 0
          score = team.score
        }
        sEl.append(score)

        resultIdentifier += 1

        var name = !team.name ? '--' : team.name
        var tEl = $('<div class="team"></div>');
        var nEl = $('<b></b>').appendTo(tEl)

        if (round === 0)
          tEl.attr('id', 'team-' + rId)

        opts.decorator.render(nEl, name, score)

        if (isNumber(team.idx))
          tEl.attr('index', team.idx)

        if (team.name === null)
          tEl.addClass('na')
        else if (winner().name === team.name)
          tEl.addClass('win')
        else if (loser().name === team.name)
          tEl.addClass('lose')

        tEl.append(sEl)

        if (!(team.name === null || !isReady || !opts.save) && opts.save) {
          nEl.click(function () {
            var span = $(this)

            function editor() {
              function done_fn(val, next) {
                if (val)
                  opts.init.teams[~~(team.idx / 2)][team.idx % 2] = val
                renderAll(true)
                span.click(editor)
                var labels = opts.el.find('#team-' + (team.idx + 1) + ' b:first')
                if (labels.length && next === true && round === 0)
                  $(labels).click()
              }

              span.unbind()
              opts.decorator.edit(span, team.name, done_fn)
            }

            editor()
          })
          if (team.name) {
            sEl.click(function () {
              var span = $(this)

              function editor() {
                span.unbind()

                var score
                if (!isNumber(team.score))
                  score = '0'
                else
                  score = span.text()

                var input = $('<input type="text">')
                input.val(score)
                span.html(input)

                input.focus().select()
                input.keydown(function (e) {
                  if (!isNumber($(this).val()))
                    $(this).addClass('error')
                  else
                    $(this).removeClass('error')

                  var key = (e.keyCode || e.which)
                  if (key === 9 || key === 13 || key === 27) {
                    e.preventDefault()
                    $(this).blur()
                    if (key === 27)
                      return

                    var next = topCon.find('span[id=result-' + (rId + 1) + ']')
                    if (next)
                      next.click()
                  }
                })
                input.blur(function () {
                  var val = input.val()
                  if ((!val || !isNumber(val)) && !isNumber(team.score))
                    val = '0'
                  else if ((!val || !isNumber(val)) && isNumber(team.score))
                    val = team.score

                  span.html(val)
                  if (isNumber(val) && score !== parseInt(val, 10)) {
                    team.score = parseInt(val, 10)
                    renderAll(true)
                  }
                  span.click(editor)
                })
              }

              editor()
            })
          }
        }
        return tEl;
      }

      var connectorCb = null
      var alignCb = null

      var matchCon = $('<div class="match"></div>')
      var teamCon = $('<div class="teamContainer"></div>')

      data[0].id = 0
      data[1].id = 1

      data[0].name = data[0].source().name
      data[1].name = data[1].source().name

      data[0].score = !results ? null : results[0]
      data[1].score = !results ? null : results[1]

      /* match has score even though teams haven't yet been decided */
      /* todo: would be nice to have in preload check, maybe too much work */
      if ((!data[0].name || !data[1].name) && (isNumber(data[0].score) || isNumber(data[1].score))) {
        console.log('ERROR IN SCORE DATA: ' + data[0].source().name + ': ' + data[0].score + ', ' + data[1].source().name + ': ' + data[1].score)
        data[0].score = data[1].score = null
      }

      return {
        el: matchCon,
        id: idx,
        round: function () {
          return round
        },
        connectorCb: function (cb) {
          connectorCb = cb
        },
        connect: function (cb) {
          var connectorOffset = teamCon.height() / 4
          var matchupOffset = matchCon.height() / 2
          var shift
          var height

          if (!cb || cb === null) {
            if (idx % 2 === 0) { // dir == down
              if (this.winner().id === 0) {
                shift = connectorOffset
                height = matchupOffset
              }
              else if (this.winner().id === 1) {
                shift = connectorOffset * 3
                height = matchupOffset - connectorOffset * 2
              }
              else {
                shift = connectorOffset * 2
                height = matchupOffset - connectorOffset
              }
            }
            else { // dir == up
              if (this.winner().id === 0) {
                shift = -connectorOffset * 3
                height = -matchupOffset + connectorOffset * 2
              }
              else if (this.winner().id === 1) {
                shift = -connectorOffset
                height = -matchupOffset
              }
              else {
                shift = -connectorOffset * 2
                height = -matchupOffset + connectorOffset
              }
            }
          }
          else {
            var info = cb(teamCon, this)
            if (info === null) /* no connector */
              return
            shift = info.shift
            height = info.height
          }
          teamCon.append(connector(height, shift, teamCon));
        },
        winner: winner,
        loser: loser,
        first: function () {
          return data[0]
        },
        second: function () {
          return data[1]
        },
        setAlignCb: function (cb) {
          alignCb = cb
        },
        render: function () {
          matchCon.empty()
          teamCon.empty()

          data[0].name = data[0].source().name
          data[1].name = data[1].source().name
          data[0].idx = data[0].source().idx
          data[1].idx = data[1].source().idx

          var isReady = false
          if ((data[0].name || data[0].name === '') &&
              (data[1].name || data[1].name === ''))
            isReady = true

          if (!winner().name)
            teamCon.addClass('np')
          else
            teamCon.removeClass('np')

          teamCon.append(teamElement(round.id, data[0], isReady))
          teamCon.append(teamElement(round.id, data[1], isReady))

          matchCon.appendTo(round.el)
          matchCon.append(teamCon)

          this.el.css('height', (round.bracket.el.height() / round.size()) + 'px');
          teamCon.css('top', (this.el.height() / 2 - teamCon.height() / 2) + 'px');

          /* todo: move to class */
          if (alignCb)
            alignCb(teamCon)

          var isLast = false
          if (typeof(renderCb) === 'function')
            isLast = renderCb(this)

          if (!isLast)
            this.connect(connectorCb)
        },
        results: function () {
          return [data[0].score, data[1].score]
        }
      }
    }

    var Round = function (bracket, previousRound, roundIdx, results, doRenderCb) {
      var matches = []
      var roundCon = $('<div class="round"></div>')

      return {
        el: roundCon,
        bracket: bracket,
        id: roundIdx,
        addMatch: function (teamCb, renderCb) {
          var matchIdx = matches.length
          var teams

          if (teamCb !== null)
            teams = teamCb()
          else
            teams = [
              {source: bracket.round(roundIdx - 1).match(matchIdx * 2).winner},
              {source: bracket.round(roundIdx - 1).match(matchIdx * 2 + 1).winner}
            ]

          var match = new Match(this, teams, matchIdx, !results ? null : results[matchIdx], renderCb)
          matches.push(match)
          return match;
        },
        match: function (id) {
          return matches[id]
        },
        prev: function () {
          return previousRound
        },
        size: function () {
          return matches.length
        },
        render: function () {
          roundCon.empty()
          if (typeof(doRenderCb) === 'function')
            if (!doRenderCb())
              return
          roundCon.appendTo(bracket.el)
          $.each(matches, function (i, ma) {
            ma.render()
          })
        },
        results: function () {
          var results = []
          $.each(matches, function (i, ma) {
            results.push(ma.results())
          })
          return results
        }
      }
    }

    var Bracket = function (bracketCon, results, teams) {
      var rounds = []

      return {
        el: bracketCon,
        addRound: function (doRenderCb) {
          var id = rounds.length
          var previous = null
          if (id > 0)
            previous = rounds[id - 1]

          var round = new Round(this, previous, id, !results ? null : results[id], doRenderCb)
          rounds.push(round)
          return round;
        },
        dropRound: function () {
          rounds.pop()
        },
        round: function (id) {
          return rounds[id]
        },
        size: function () {
          return rounds.length
        },
        final: function () {
          return rounds[rounds.length - 1].match(0)
        },
        winner: function () {
          return rounds[rounds.length - 1].match(0).winner()
        },
        loser: function () {
          return rounds[rounds.length - 1].match(0).loser()
        },
        render: function () {
          bracketCon.empty()
          /* Length of 'rounds' can increase during render in special case when
           LB win in finals adds new final round in match render callback.
           Therefore length must be read on each iteration. */
          for (var i = 0; i < rounds.length; i += 1)
            rounds[i].render()
        },
        results: function () {
          var results = []
          $.each(rounds, function (i, ro) {
            results.push(ro.results())
          })
          return results
        }
      }
    }

    function isValid(data) {
      var t = data.teams
      var r = data.results

      if (!t) {
        console.log('no teams', data)
        return false
      }

      if (!r)
        return true

      if (t.length < r[0][0].length) {
        console.log('more results than teams', data)
        return false
      }

      for (var b = 0; b < r.length; b += 1) {
        for (var i = 0; i < ~~(r[b].length / 2); i += 1) {
          if (r[b][2 * i].length < r[b][2 * i + 1].length) {
            console.log('previous round has less scores than next one', data)
            return false
          }
        }
      }

      for (var i = 0; i < r[0].length; i += 1) {
        if (!r[1] || !r[1][i * 2])
          break;

        if (r[0][i].length <= r[1][i * 2].length) {
          console.log('lb has more results than wb', data)
          return false
        }
      }

      try {
        $.each(r, function (i, br) {
          $.each(br, function (i, ro) {
            $.each(ro, function (i, ma) {
              if (ma.length !== 2) {
                console.log('match size not valid', ma)
                throw 'match size not valid'
              }
              /*logical xor*/
              if (!(isNumber(ma[0]) ? isNumber(ma[1]) : !isNumber(ma[1]))) {
                console.log('mixed results', ma)
                throw 'mixed results'
              }
            })
          })
        })
      }
      catch (e) {
        console.log(e)
        return false
      }

      return true
    }

    function postProcess(container) {
      var Track = function (teamIndex, cssClass) {
        var index = teamIndex;
        var elements = container.find('.team[index=' + index + ']')
        var addedClass
        if (!cssClass)
          addedClass = 'highlight'
        else
          addedClass = cssClass

        return {
          highlight: function () {
            elements.each(function () {
              $(this).addClass(addedClass)

              if ($(this).hasClass('win'))
                $(this).parent().find('.connector').addClass(addedClass)
            })
          },

          deHighlight: function () {
            elements.each(function () {
              $(this).removeClass(addedClass)
              $(this).parent().find('.connector').removeClass(addedClass)
            })
          }
        }
      }

      var source = f || w

      var winner = source.winner()
      var loser = source.loser()

      var winTrack = null
      var loseTrack = null

      if (winner && loser) {
        winTrack = new Track(winner.idx, 'highlightWinner');
        loseTrack = new Track(loser.idx, 'highlightLoser');
        winTrack.highlight()
        loseTrack.highlight()
      }

      container.find('.team').mouseover(function () {
        var i = $(this).attr('index')
        var track = new Track(i);
        track.highlight()
        $(this).mouseout(function () {
          track.deHighlight()
          $(this).unbind('mouseout')
        })
      })

    }

    function winnerBubbles(match) {
      var el = match.el
      var winner = el.find('.team.win')
      winner.append('<div class="bubble">1st</div>')
      var loser = el.find('.team.lose')
      loser.append('<div class="bubble">2nd</div>')
      return true
    }

    function consolationBubbles(match) {
      var el = match.el
      var winner = el.find('.team.win')
      winner.append('<div class="bubble third">3rd</div>')
      var loser = el.find('.team.lose')
      loser.append('<div class="bubble fourth">4th</div>')
      return true
    }

    function prepareWinners(winners, data, isSingleElimination) {
      var teams = data.teams;
      var results = data.results;
      var rounds = Math.log(teams.length * 2) / Math.log(2);
      var matches = teams.length;
      var graphHeight = winners.el.height();
      var round

      for (var r = 0; r < rounds; r += 1) {
        round = winners.addRound()

        for (var m = 0; m < matches; m += 1) {
          var teamCb = null

          if (r === 0) {
            teamCb = function () {
              var t = teams[m]
              var i = m
              return [
                {source: function () {
                  return {name: t[0], idx: (i * 2)}
                }},
                {source: function () {
                  return {name: t[1], idx: (i * 2 + 1)}
                }}
              ]
            }
          }

          if (!(r === rounds - 1 && isSingleElimination)) {
            round.addMatch(teamCb)
          }
          else {
            var match = round.addMatch(teamCb, winnerBubbles)
            match.setAlignCb(function (tC) {
              tC.css('top', '');
              tC.css('position', 'absolute');
              if (opts.skipConsolationRound)
                tC.css('top', (match.el.height() / 2 - tC.height() / 2) + 'px');
              else
                tC.css('bottom', (-tC.height() / 2) + 'px');
            })
          }
        }
        matches /= 2;
      }

      if (isSingleElimination) {
        winners.final().connectorCb(function () {
          return null
        })

        if (teams.length > 1 && !opts.skipConsolationRound) {
          var third = winners.final().round().prev().match(0).loser
          var fourth = winners.final().round().prev().match(1).loser
          var consol = round.addMatch(function () {
                return [
                  {source: third},
                  {source: fourth}
                ]
              },
              consolationBubbles)

          consol.setAlignCb(function (tC) {
            var height = (winners.el.height()) / 2
            consol.el.css('height', (height) + 'px');

            var topShift = tC.height()

            tC.css('top', (topShift) + 'px');
          })

          consol.connectorCb(function () {
            return null
          })
        }
      }
    }

    function prepareLosers(winners, losers, data) {
      var teams = data.teams;
      var results = data.results;
      var rounds = Math.log(teams.length * 2) / Math.log(2) - 1;
      var matches = teams.length / 2;
      var graphHeight = losers.el.height();

      for (var r = 0; r < rounds; r += 1) {
        for (var n = 0; n < 2; n += 1) {
          var round = losers.addRound()

          for (var m = 0; m < matches; m += 1) {
            var teamCb = null

            /* special cases */
            if (!(n % 2 === 0 && r !== 0)) {
              teamCb = function () {
                /* first round comes from winner bracket */
                if (n % 2 === 0 && r === 0) {
                  return [
                    {source: winners.round(0).match(m * 2).loser},
                    {source: winners.round(0).match(m * 2 + 1).loser}
                  ]
                }
                else { /* match with dropped */
                  var winnerMatch = m
                  /* To maximize the time it takes for two teams to play against
                   * eachother twice, WB losers are assigned in reverse order
                   * every second round of LB */
                  if (r % 2 === 0)
                    winnerMatch = matches - m - 1
                  return [
                    {source: losers.round(r * 2).match(m).winner},
                    {source: winners.round(r + 1).match(winnerMatch).loser}
                  ]
                }
              }
            }

            var match = round.addMatch(teamCb)
            var teamCon = match.el.find('.teamContainer')
            match.setAlignCb(function () {
              teamCon.css('top', (match.el.height() / 2 - teamCon.height() / 2) + 'px');
            })

            if (r < rounds - 1 || n < 1) {
              var cb = null
              // inside lower bracket
              if (n % 2 === 0) {
                cb = function (tC, match) {
                  var connectorOffset = tC.height() / 4
                  var height = 0;
                  var shift = 0;

                  if (match.winner().id === 0) {
                    shift = connectorOffset
                  }
                  else if (match.winner().id === 1) {
                    height = -connectorOffset * 2;
                    shift = connectorOffset
                  }
                  else {
                    shift = connectorOffset * 2
                  }
                  return {height: height, shift: shift}
                }
              }
              match.connectorCb(cb)
            }
          }
        }
        matches /= 2;
      }
    }

    function prepareFinals(finals, winners, losers, data) {
      var round = finals.addRound()
      var match = round.addMatch(function () {
            return [
              {source: winners.winner},
              {source: losers.winner}
            ]
          },
          function (match) {
            /* Track if container has been resized for final rematch */
            var _isResized = false
            /* LB winner won first final match, need a new one */
            if ((match.winner().name !== null && match.winner().name === losers.winner().name)) {
              if (finals.size() === 2)
                return
              /* This callback is ugly, would be nice to make more sensible solution */
              var round = finals.addRound(function () {
                var rematch = ((match.winner().name !== null && match.winner().name === losers.winner().name))
                if (_isResized === false) {
                  if (rematch) {
                    _isResized = true
                    //topCon.css('width', (parseInt(topCon.css('width'), 10) + 140) + 'px')
                  }
                }
                if (!rematch && _isResized) {
                  _isResized = false
                  finals.dropRound()
                  //topCon.css('width', (parseInt(topCon.css('width'), 10) - 140) + 'px')
                }
                return rematch
              })
              /* keep order the same, WB winner top, LB winner below */
              var match2 = round.addMatch(function () {
                    return [
                      {source: match.first},
                      {source: match.second}
                    ]
                  },
                  winnerBubbles)

              match.connectorCb(function (tC) {
                return {height: 0, shift: tC.height() / 2}
              })

              match2.connectorCb(function () {
                return null
              })
              match2.setAlignCb(function (tC) {
                var height = (winners.el.height() + losers.el.height())
                match2.el.css('height', (height) + 'px');

                var topShift = (winners.el.height() / 2 + winners.el.height() + losers.el.height() / 2) / 2 - tC.height()

                tC.css('top', (topShift) + 'px')
              })
              return false
            }
            else {
              return winnerBubbles(match)
            }
          })

      match.setAlignCb(function (tC) {
        var height = (winners.el.height() + losers.el.height())
        if (!opts.skipConsolationRound)
          height /= 2
        match.el.css('height', (height) + 'px');

        var topShift = (winners.el.height() / 2 + winners.el.height() + losers.el.height() / 2) / 2 - tC.height()

        tC.css('top', (topShift) + 'px')
      })

      var shift
      var height

      if (!opts.skipConsolationRound) {
        var fourth = losers.final().round().prev().match(0).loser
        var consol = round.addMatch(function () {
              return [
                {source: fourth},
                {source: losers.loser}
              ]
            },
            consolationBubbles)
        consol.setAlignCb(function (tC) {
          var height = (winners.el.height() + losers.el.height()) / 2
          consol.el.css('height', (height) + 'px');

          var topShift = (winners.el.height() / 2 + winners.el.height() + losers.el.height() / 2) / 2 + tC.height() / 2 - height

          tC.css('top', (topShift) + 'px');
        })

        match.connectorCb(function () {
          return null
        })
        consol.connectorCb(function () {
          return null
        })
      }

      winners.final().connectorCb(function (tC) {
        var connectorOffset = tC.height() / 4
        var topShift = (winners.el.height() / 2 + winners.el.height() + losers.el.height() / 2) / 2 - tC.height() / 2
        var matchupOffset = topShift - winners.el.height() / 2
        if (winners.winner().id === 0) {
          height = matchupOffset + connectorOffset * 2
          shift = connectorOffset
        }
        else if (winners.winner().id === 1) {
          height = matchupOffset
          shift = connectorOffset * 3
        }
        else {
          height = matchupOffset + connectorOffset
          shift = connectorOffset * 2
        }
        height -= tC.height() / 2
        return {height: height, shift: shift}
      })

      losers.final().connectorCb(function (tC) {
        var connectorOffset = tC.height() / 4
        var topShift = (winners.el.height() / 2 + winners.el.height() + losers.el.height() / 2) / 2 - tC.height() / 2
        var matchupOffset = topShift - winners.el.height() / 2
        if (losers.winner().id === 0) {
          height = matchupOffset
          shift = connectorOffset * 3
        }
        else if (losers.winner().id === 1) {
          height = matchupOffset + connectorOffset * 2
          shift = connectorOffset
        }
        else {
          height = matchupOffset + connectorOffset
          shift = connectorOffset * 2
        }
        height += tC.height() / 2
        return {height: -height, shift: -shift}
      })
    }

    var w, l, f

    var r = data.results

    function depth(a) {
      function df(a, d) {
        if (a instanceof Array)
          return df(a[0], d + 1)
        return d
      }

      return df(a, 0)
    }

    function wrap(a, d) {
      if (d > 0)
        a = wrap([a], d - 1)
      return a
    }

    /* wrap data to into necessary arrays */
    r = wrap(r, 4 - depth(r))
    data.results = r

    var isSingleElimination = (r.length <= 1)

    if (opts.save) {
      var tools = $('<div class="tools"></div>').appendTo(topCon)
      var inc = $('<span class="increment">+</span>').appendTo(tools)
      inc.click(function () {
        var i
        var len = data.teams.length
        for (i = 0; i < len; i += 1)
          data.teams.push(['', ''])
        return new JqueryBracket(opts)
      })

      if (data.teams.length > 1 && data.results.length === 1 ||
          data.teams.length > 2 && data.results.length === 3) {
        var dec = $('<span class="decrement">-</span>').appendTo(tools)
        dec.click(function () {
          if (data.teams.length > 1) {
            data.teams = data.teams.slice(0, data.teams.length / 2)
            return new JqueryBracket(opts)
          }
        })
      }

      var type
      if (data.results.length === 1 && data.teams.length > 1) {
        type = $('<span class="doubleElimination">de</span>').appendTo(tools)
        type.click(function () {
          if (data.teams.length > 1 && data.results.length < 3) {
            data.results.push([], [])
            return new JqueryBracket(opts)
          }
        })
      }
      else if (data.results.length === 3 && data.teams.length > 1) {
        type = $('<span class="singleElimination">se</span>').appendTo(tools)
        type.click(function () {
          if (data.results.length === 3) {
            data.results = data.results.slice(0, 1)
            return new JqueryBracket(opts)
          }
        })
      }
    }

    var fEl, wEl, lEl

    if (isSingleElimination) {
      wEl = $('<div class="bracket"></div>').appendTo(topCon)
    }
    else {
      fEl = $('<div class="finals"></div>').appendTo(topCon)
      wEl = $('<div class="bracket"></div>').appendTo(topCon)
      lEl = $('<div class="loserBracket"></div>').appendTo(topCon)
    }

    var height = data.teams.length * 60

    wEl.css('height', height)

    // reserve space for consolation round
    if (isSingleElimination && data.teams.length <= 2 && !opts.skipConsolationRound) {
      height += 30
      topCon.css('height', height)
    }

    if (lEl)
      lEl.css('height', wEl.height() / 2)

    var rounds
    if (isSingleElimination)
      rounds = Math.log(data.teams.length * 2) / Math.log(2)
    else
      rounds = (Math.log(data.teams.length * 2) / Math.log(2) - 1) * 2 + 1
/*
    if (opts.save)
      topCon.css('width', rounds * 140 + 40)
    else
      topCon.css('width', rounds * 140 + 10)*/

    w = new Bracket(wEl, !r || !r[0] ? null : r[0], data.teams)

    if (!isSingleElimination) {
      l = new Bracket(lEl, !r || !r[1] ? null : r[1], null)
      f = new Bracket(fEl, !r || !r[2] ? null : r[2], null)
    }

    prepareWinners(w, data, isSingleElimination)

    if (!isSingleElimination) {
      prepareLosers(w, l, data);
      prepareFinals(f, w, l, data);
    }

    renderAll(false)

    return {
      data: function () {
        return opts.init
      }
    }
  }

  var methods = {
    init: function (opts) {
      var that = this
      opts.el = this
      opts.dir = opts.dir || 'lr'
      opts.skipConsolationRound = opts.skipConsolationRound || false
      if (opts.dir !== 'lr' && opts.dir !== 'rl')
        $.error('Direction must be either: "lr" or "rl"')
      var bracket = new JqueryBracket(opts)
      $(this).data('bracket', {target: that, obj: bracket})
      return bracket
    },
    data: function () {
      var bracket = $(this).data('bracket')
      return bracket.obj.data()
    }
  }

  $.fn.bracket = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments)
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.bracket')
    }
  }
})(jQuery)

$(document).ready(function(){

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
	var _nav = $(".menu>ul>li>a");
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
		$(".menu>ul").toggleClass("hidden-phone");
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
			plugins : "autolink link image lists pagebreak emoticons media contextmenu paste noneditable nonbreaking",
			schema: "html5",
			theme: "modern",
			width : '100%',
			height:300,
			entity_encoding : "raw",
			paste_auto_cleanup_on_paste : true,
			apply_source_formatting : true,
			force_br_newlines : true,
			convert_urls : false,
			relative_urls : false,
			media_strict: false,
			auto_focus : false,
			inline: true,

			// Theme options
			toolbar : "undo,redo,|,bold,italic,underline,strikethrough,forecolor,|,link,unlink,|,justifyleft,justifycenter,justifyright,justifyfull,bullist,|,emoticons,image,imageshack,media",
			menubar : false,
			statusbar : false,
			tab_focus : ':prev,:next',
			valid_elements : "@[id|class|title|style],span[data-mce-type|data-mce-style|align],a[href|target],legend,fieldset,img[src|alt|align|height|width],object[classid|width|height|codebase|*],param[name|value|_value],embed[type|width|height|src|*],ul,li,ol,p[align],font[face|size|color],strong/b,em/i,u,strike,br",
			language : 'fr_FR',
		});
	}

	// le jeu
	var unityPlayer = $("#unityPlayer");
	if(unityPlayer.length>0){
		var u = new UnityObject2({
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
		u.observeProgress(function (progress) {
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
		u.initPlugin(unityPlayer.get(0), "loader_.unity3d");
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
				$("html,body").animate({scrollTop: _answer.parent().offset().top-20},'slow');
			});
		});
	}

	// tag-it
	var _destination = $("#destinations");
	if(_destination.length>0){
		_destination.tagit({
			tags: function(input, autocomplete) {
				if(_destination.query)
					_destination.query.abort();
				_destination.query = $.ajax({
					dataType:'json',
					url:'xml/destination.json?q='+input.toLowerCase(),
					complete:function(result){
						_destination.tagit(
							"autocomplete",
							eval(result.responseText),
							autocomplete
						);
					}
				});
			},
			field: "destination"
		});
	}

	// bracket pour tournoi
	var _bracket = $("#bracket");
	if(_bracket.length>0){
		_bracket.bracket({
			init: {
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
		}
		});
	}

	// timeline des évènements
	var _timeline = $("#timeline");
	if(_timeline.length>0){
		createStoryJS({
			type:		'timeline',
			width:		'100%',
			height:		'600',
			source:		{
				"timeline":
				{
					"headline":"Sh*t People Say",
					"type":"default",
					"text":"People say stuff",
					"startDate":"2012,1,26",
					"date": [
						{
							"startDate":"2011,12,12",
							"endDate":"2012,1,27",
							"headline":"Vine",
							"text":"<p>Vine Test</p>",
							"asset":
							{
								"media":"https://vine.co/v/b55LOA1dgJU",
								"credit":"",
								"caption":""
							}
						},
						{
							"startDate":"2012,1,26",
							"endDate":"2012,1,27",
							"headline":"Sh*t Politicians Say",
							"text":"<p>In true political fashion, his character rattles off common jargon heard from people running for office.</p>",
							"asset":
							{
								"media":"http://youtu.be/u4XpeU9erbg",
								"credit":"",
								"caption":""
							}
						},
						{
							"startDate":"2012,1,10",
							"headline":"Sh*t Nobody Says",
							"text":"<p>Have you ever heard someone say “can I burn a copy of your Nickelback CD?” or “my Bazooka gum still has flavor!” Nobody says that.</p>",
							"asset":
							{
								"media":"http://youtu.be/f-x8t0JOnVw",
								"credit":"",
								"caption":""
							}
						},
						{
							"startDate":"2012,1,26",
							"headline":"Sh*t Chicagoans Say",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/Ofy5gNkKGOo",
								"credit":"",
								"caption":""
							}
						},
						{
							"startDate":"2011,12,12",
							"headline":"Sh*t Girls Say",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/u-yLGIH7W9Y",
								"credit":"",
								"caption":"Writers & Creators: Kyle Humphrey & Graydon Sheppard"
							}
						},
						{
							"startDate":"2012,1,4",
							"headline":"Sh*t Broke People Say",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/zyyalkHjSjo",
								"credit":"",
								"caption":""
							}
						},

						{
							"startDate":"2012,1,4",
							"headline":"Sh*t Silicon Valley Says",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/BR8zFANeBGQ",
								"credit":"",
								"caption":"written, filmed, and edited by Kate Imbach & Tom Conrad"
							}
						},
						{
							"startDate":"2011,12,25",
							"headline":"Sh*t Vegans Say",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/OmWFnd-p0Lw",
								"credit":"",
								"caption":""
							}
						},
						{
							"startDate":"2012,1,23",
							"headline":"Sh*t Graphic Designers Say",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/KsT3QTmsN5Q",
								"credit":"",
								"caption":""
							}
						},
						{
							"startDate":"2011,12,30",
							"headline":"Sh*t Wookiees Say",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/vJpBCzzcSgA",
								"credit":"",
								"caption":""
							}
						},
						{
							"startDate":"2012,1,17",
							"headline":"Sh*t People Say About Sh*t People Say Videos",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/c9ehQ7vO7c0",
								"credit":"",
								"caption":""
							}
						},
						{
							"startDate":"2012,1,20",
							"headline":"Sh*t Social Media Pros Say",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/eRQe-BT9g_U",
								"credit":"",
								"caption":""
							}
						},
						{
							"startDate":"2012,1,11",
							"headline":"Sh*t Old People Say About Computers",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/HRmc5uuoUzA",
								"credit":"",
								"caption":""
							}
						},
						{
							"startDate":"2012,1,11",
							"headline":"Sh*t College Freshmen Say",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/rwozXzo0MZk",
								"credit":"",
								"caption":""
							}
						},
						{
							"startDate":"2011,12,16",
							"headline":"Sh*t Girls Say - Episode 2",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/kbovd-e-hRg",
								"credit":"",
								"caption":"Writers & Creators: Kyle Humphrey & Graydon Sheppard"
							}
						},
						{
							"startDate":"2011,12,24",
							"headline":"Sh*t Girls Say - Episode 3 Featuring Juliette Lewis",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/bDHUhT71JN8",
								"credit":"",
								"caption":"Writers & Creators: Kyle Humphrey & Graydon Sheppard"
							}
						},
						{
							"startDate":"2012,1,27",
							"headline":"Sh*t Web Designers Say",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/MEOb_meSHhQ",
								"credit":"",
								"caption":""
							}
						},
						{
							"startDate":"2012,1,12",
							"headline":"Sh*t Hipsters Say",
							"text":"No meme is complete without a bit of hipster-bashing.",
							"asset":
							{
								"media":"http://youtu.be/FUhrSVyu0Kw",
								"credit":"",
								"caption":"Written, Directed, Conceptualized and Performed by Carrie Valentine and Jessica Katz"
							}
						},
						{
							"startDate":"2012,1,6",
							"headline":"Sh*t Cats Say",
							"text":"No meme is complete without cats. This had to happen, obviously.",
							"asset":
							{
								"media":"http://youtu.be/MUX58Vi-YLg",
								"credit":"",
								"caption":""
							}
						},
						{
							"startDate":"2012,1,21",
							"headline":"Sh*t Cyclists Say",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/GMCkuqL9IcM",
								"credit":"",
								"caption":"Video script, production, and editing by Allen Krughoff of Hardcastle Photography"
							}
						},
						{
							"startDate":"2011,12,30",
							"headline":"Sh*t Yogis Say",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/IMC1_RH_b3k",
								"credit":"",
								"caption":""
							}
						},
						{
							"startDate":"2012,1,18",
							"headline":"Sh*t New Yorkers Say",
							"text":"",
							"asset":
							{
								"media":"http://youtu.be/yRvJylbSg7o",
								"credit":"",
								"caption":"Directed and Edited by Matt Mayer, Produced by Seth Keim, Written by Eliot Glazer. Featuring Eliot and Ilana Glazer, who are siblings, not married."
							}
						}
					]
				}
			},
			embed_id:	'timeline'
		});
	}
});