(function(win, doc){
	var myVideo = function(e,obj){
        if(!e && !obj) {
            throw new Error("请传入配置参数");
        }
        var arrSettings = [];
		var parentObj = obj;
		for(var i = 0;i<parentObj.length;i++){
			var arr = {
				videoBox : parentObj.eq(i)[0],     //视频父级
				video : parentObj.eq(i).find('.video')[0],            //获取视频
				videoControls : parentObj.eq(i).find('.video-controls')[0],  //控制条
				loadingLine : parentObj.eq(i).find('.loading-line')[0],
				loadingLineEm : parentObj.eq(i).find('.loading_em')[0],     //进度条
				loadingLineSp : parentObj.eq(i).find('.loading_span')[0],  //滑块
				VideoBtn : parentObj.eq(i).find('.video-btn')[0],         //播放按钮
				VideoNow : parentObj.eq(i).find('.video-now')[0],        //当前进度
				VideoCount : parentObj.eq(i).find('.video-count')[0],   //总进度
				VideoFullScreen : parentObj.eq(i).find('.video-fullscreen')[0], //全屏
				percent : 0, //播放进度
				autoPlay:'false' //自动播放
			}
			arrSettings.push(arr)
		}	
		//初始化  this.init(e,arrSettings[0])
		for(var i = 0;i< arrSettings.length;i++){
			var a = this.init(e,arrSettings[i]);
		}
	}
	myVideo.prototype = {
		init:function(e,defaultSettings){
			var that = this;
			defaultSettings.video.addEventListener("timeupdate",function(){
				defaultSettings.percent = Math.floor(this.currentTime/this.duration*100)
			    if(defaultSettings.percent != 0){
			    	defaultSettings.loadingLineEm.style.width = defaultSettings.percent + '%';
			    	defaultSettings.loadingLineSp.style.left = defaultSettings.percent + '%';
			    	defaultSettings.loadingLineSp.style.marginLeft = '-10px';
			    	defaultSettings.VideoNow.innerHTML = that.Appendzero(Math.floor(this.currentTime/60)) + ':' + that.Appendzero(Math.floor(this.currentTime%60))
			    	defaultSettings.VideoCount.innerHTML = that.Appendzero(Math.floor(this.duration/60)) + ':' + that.Appendzero(Math.floor(this.duration%60))
			    }
			    if(defaultSettings.percent == 100){
			    	defaultSettings.VideoBtn.setAttribute("class", "video-btn pause")
			    }
			});
			defaultSettings.VideoBtn.addEventListener('click',function(){
				that.playPause(defaultSettings)
			})
			defaultSettings.VideoFullScreen.addEventListener('click',function(){
				that.launchFullScreen(defaultSettings)
			})
			defaultSettings.videoBox.onmouseenter = function(){
				defaultSettings.videoControls.style.bottom = '0px'
			}
			defaultSettings.videoBox.onmouseleave = function(){
				defaultSettings.videoControls.style.bottom = '-75px'
			}
			if(defaultSettings.autoPlay == 'true'){
				that.playPause(defaultSettings)
			}
			window.onresize = function(){
				if(!that.checkFull()){
					defaultSettings.videoBox.setAttribute("class", "video-wrap")
			    	defaultSettings.VideoFullScreen.setAttribute("data-videofull", "false")
				}
			}
			that.videoRange(e,defaultSettings)
		},
		playPause:function(defaultSettings){
	       	if (defaultSettings.video.paused){
	        	defaultSettings.video.play();
	            defaultSettings.VideoBtn.setAttribute("class", "video-btn play")
	       	}else{
	            defaultSettings.video.pause();
	            defaultSettings.VideoBtn.setAttribute("class", "video-btn pause")
	       	}
		},
		Appendzero:function(obj){
			if(obj<10) return "0" +""+ obj;  
        	else return obj;
		},
		launchFullScreen:function(defaultSettings){
			if(defaultSettings.VideoFullScreen.getAttribute("data-videofull") == 'false'){
				var element = document.documentElement;
				if(element.requestFullScreen) {
			        element.requestFullScreen(); 
			    } else if(element.mozRequestFullScreen) {
			        element.mozRequestFullScreen(); 
			    } else if(element.webkitRequestFullScreen) {
			        element.webkitRequestFullScreen();
			    }
			    defaultSettings.videoBox.setAttribute("class", "video-wrap video-fullscreen-active")
		    	defaultSettings.VideoFullScreen.setAttribute("data-videofull", "true")
			}else{
				var element = document;
				if(element.exitFullscreen) {
			        element.exitFullscreen();
			    } else if(element.mozCancelFullScreen) {
			        element.mozCancelFullScreen(); 
			    } else if(element.webkitCancelFullScreen) {
			        element.webkitCancelFullScreen();
			    }
			    defaultSettings.videoBox.setAttribute("class", "video-wrap")
		    	defaultSettings.VideoFullScreen.setAttribute("data-videofull", "false")
			}
		},
		checkFull:function(){
			var isFull =  document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
			//to fix : false || undefined == undefined
			if(isFull === undefined) isFull = false;
			return isFull;
		},
		videoRange:function(e,aaa){
			//拖拽
			var defaultSettings = aaa;
			var dv = defaultSettings.loadingLineSp;
			var video = defaultSettings.video;
			var Lwidth = parseInt(defaultSettings.videoControls.offsetWidth);
			var isDown = false;
			var x;
			//鼠标按下事件
			dv.onmousedown = function(e) {
			    //获取x坐标和y坐标
			    x = e.clientX;
			
			    //获取左部的偏移量
			    l = dv.offsetLeft;
			    //开关打开
			    isDown = true;
			    //设置样式  
			}
			//鼠标移动
			win.onmousemove = function(e) {
			    if (isDown == false) {
			        return;
			    }
			    //获取x和y
			    var nx = e.clientX;
			    var ny = e.clientY;
			    //计算移动后的左偏移量的偏移量
			    var nl = nx - (x - l);
			    dv.style.left = (nl + 10) + 'px';
			    defaultSettings.loadingLineEm.style.width = (nl) + 'px';
			}
			//鼠标抬起事件
			dv.onmouseup = function() {
			    //开关关闭
			    isDown = false;
			    var time = parseInt(dv.style.left)/Lwidth*video.duration;
				video.currentTime = time;                      //修改视频时间
			}
			
			//点击
			var line = defaultSettings.loadingLine
			line.onclick=function(e){
				x = e.clientX;
				var getOffsetLeft = function(obj){    //递归获取元素,元素父级的左边距相加
		            var tmp = obj.offsetLeft;
		            var val = obj.offsetParent;
		            while(val != null){
		            tmp += val.offsetLeft;
		            	val = val.offsetParent;
		            }
		            return tmp;
				}
				x = x-getOffsetLeft(video);
				dv.style.left = (x + 10) + 'px';
			    defaultSettings.loadingLineEm.style.width = (x) + 'px';
			    var time = parseInt(dv.style.left)/Lwidth*video.duration;
				video.currentTime = time;                      //修改视频时间
			}
		}
	}
	win.myVideo = myVideo;
})(window, document)
