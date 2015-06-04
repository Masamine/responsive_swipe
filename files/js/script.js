(function($){
	
	var parent  = $('#slide');
	var target  = parent.find(".inner");
	var nav     = $("#nav");
	var pcNavi  = $("#pcnavi");
	var element = $("#target").find("li");
	var length  = element.length;
	var SPEED   = 120;
	var SCALE   = 0.5;
	var current = 0;
	
	var navi = "";
	for(var i = 0; i < length; i++) {
		var cls = (i == 0) ? "current" : "";
		navi += '<li class="'+ cls +'">●</li>';
	}
	nav.append(navi);
	
	judgeWindow();
	$(window).on("resize", judgeWindow);
	
	/*ウィンドウ幅判定処理
	=================================================== */
	function judgeWindow() {
		
		var width = parent.width();
		var judge = $(window).width() > 600;
		
		element.css("width", width);
		
		if(judge) {
			
			var btn = pcNavi.find("li");
			btn.on("click", function(){ slide($(this)); });
			
		} else {
			swipe();
		}
		
		changePosition();
		
		return false;
	}
	
	/* Slide for PC
	=================================================== */
	function slide(trigger) {
		
		var id       = trigger.attr("id");
		var pos      = Number(target.css("left").split("px")[0]);
		var pWidth   = parent.width();
		var maxWidth = (length - 1) * parent.width() * -1;
		
		pos     = (id == "right") ?  pos - pWidth :  pos + pWidth;
		
		if(pos > 0 || pos < maxWidth || target.is(":animated")) return false;
		
		animateBox(target, pos);
		
		return false;
	}
	
	function animateBox(box, px) {
		
		box.stop().animate({"left" : px}, SPEED * 2, function(){ changeNavi(box); });
		
		return false;
	}
	
	/* Swipe for SP
	=================================================== */
	function swipe() {
		
		target.on({
			
			/* スワイプ開始
			=================================================== */
			'touchstart': function(e) {
				this.touchX = event.changedTouches[0].pageX;
				this.slideX = $(this).position().left;
			},
			
			/* スワイプ中
			=================================================== */
			'touchmove': function(e) {
				e.preventDefault();	//他のタッチ操作を止める
				this.slideX = this.slideX - (this.touchX - event.changedTouches[0].pageX );
				$(this).css({left : this.slideX});
				this.accel = (event.changedTouches[0].pageX - this.touchX) * 5;
				this.touchX = event.changedTouches[0].pageX;
			},
			
			/* スワイプ終了
			=================================================== */
			'touchend resize': function(e) {
				
				var pWidth = parent.width();
				var tWidth = $(this).width();
				
				if (this.accel > pWidth * SCALE) {
					this.accel = pWidth * SCALE;
				}
				if (this.accel < -pWidth * SCALE) {
					this.accel = -pWidth * SCALE;
				}
				
				this.slideX += this.accel;
				this.accel = 0;
				
				if (this.slideX > 0) {
					this.slideX = 0;
					$(this).stop().animate({
						"left" : this.slideX
					}, SPEED, function() { changeNavi($(this)) });
				} else if (this.slideX < -pWidth * (length - 1)) {
					 this.slideX = -pWidth * length;
					 $(this).stop().animate({left : -pWidth * (length - 1)}, SPEED, function() { changeNavi($(this)) });
				} else {
					edge = this.slideX % pWidth;
					if (edge > -pWidth * 0.5) {
						this.slideX -= edge;
						$(this).stop().animate({
							"left" : this.slideX
						}, SPEED, function() { changeNavi($(this)) });
					} else {
						this.slideX = this.slideX - edge - pWidth;
						$(this).stop().animate({
							"left" : this.slideX
						}, SPEED, function() { changeNavi($(this)) });
					}
				}
				
			}
		});
		
		return false;
	}
	
	/* Change Navi
	=================================================== */
	function changeNavi(t) {
		
		var current = Math.abs(t.css("left").split("px")[0]) / parent.width();
		nav.find("li").removeClass("current").eq(current).addClass("current");
		
		return false;
	}
	
	/* Change Position
	=================================================== */
	function changePosition() {
		
		var width   = parent.width();
		var current = nav.find("li").index($(".current"));
		
		target.css("left", -current * width);
		
		return false;
	}
	
	return false;
	
})(jQuery);