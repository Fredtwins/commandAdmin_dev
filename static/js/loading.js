var loading = loading || {};

(function(loading) {
	
	loading.init = function(obj, oops, backFn) {
		var ops = {
			loadtype: 1,
			color: "#ed5565",
			top: "0",
			width: "100%",
			height: "100%",
			scale: 1
		}
		for (var key in oops) {
			ops[key] = oops[key];
		}

		obj.innerHTML = '<div class="loader">'+ getLoadingType(ops.loadtype) +'</div>';
		obj.style.backgroundColor = ops.color;
		obj.children[0].style.width = ops.width;
		obj.children[0].style.height = ops.height;
		obj.children[0].style.top = ops.top;
		obj.children[0].style.transform = 'scale(' + ops.scale + ')'
		
		setTimeout(function() {
			if (backFn) {
				backFn();
			}
		}, ops.time);

	}

	function getLoadingType(n) {
		var type = [
			'<div class="loader-inner ball-pulse"><div></div><div></div><div></div></div>',
			'<div class="loader-inner ball-grid-pulse"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>',
			'<div class="loader-inner ball-clip-rotate"><div></div></div>',
			'<div class="loader-inner ball-clip-rotate-pulse"><div></div><div></div></div>',
			'<div class="loader-inner square-spin"><div></div></div>',
			'<div class="loader-inner ball-clip-rotate-multiple"><div></div><div></div></div>',
			'<div class="loader-inner ball-pulse-rise"><div></div><div></div><div></div><div></div><div></div></div>',
			'<div class="loader-inner ball-rotate"><div></div></div>',
			'<div class="loader-inner cube-transition"><div></div><div></div></div>',
			'<div class="loader-inner ball-zig-zag"><div></div><div></div></div>',
			'<div class="loader-inner ball-zig-zag-deflect"><div></div><div></div></div>',
			'<div class="loader-inner ball-triangle-path"><div></div><div></div><div></div></div>',
			'<div class="loader-inner ball-scale"><div></div></div>',
			'<div class="loader-inner line-scale"><div></div><div></div><div></div><div></div><div></div></div>',
			'<div class="loader-inner line-scale-party"><div></div><div></div><div></div><div></div></div>',
			'<div class="loader-inner ball-scale-multiple"><div></div><div></div><div></div></div>',
			'<div class="loader-inner ball-pulse-sync"><div></div><div></div><div></div></div>',
			'<div class="loader-inner ball-beat"><div></div><div></div><div></div></div></div>',
			'<div class="loader-inner line-scale-pulse-out"><div></div><div></div><div></div><div></div><div></div></div>',
			'<div class="loader-inner line-scale-pulse-out-rapid"><div></div><div></div><div></div><div></div><div></div></div>',
			'<div class="loader-inner ball-scale-ripple"><div></div></div>',
			'<div class="loader-inner ball-scale-ripple-multiple"><div></div><div></div><div></div></div>',
			'<div class="loader-inner ball-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>',
			'<div class="loader-inner line-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>',
			'<div class="loader-inner triangle-skew-spin"><div></div></div>',
			'<div class="loader-inner pacman"><div></div><div></div><div></div><div></div><div></div></div>',
			'<div class="loader-inner ball-grid-beat"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>',
			'<div class="loader-inner semi-circle-spin"><div></div></div>'
		]
		return (n==undefined || n>type.length-1) ? type[0] : type[n];
	}

})(loading)