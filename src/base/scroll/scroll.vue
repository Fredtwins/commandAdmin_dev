<template>
	<div class="scroll" ref="scroll" v-resize:throttle="onResize">
		<div class="scroll-warpper" ref="scroll-warpper">
			<slot></slot>			
		</div>
		<div 
			v-show="showScroll"
			class="scroll-box" 
			ref="scroll-box">
			<div 
				class="scroll-move" 
				ref="scroll-move" 
				@mousedown="scrollDown"
				@mouseenter="scrollEnter"
				@mouseleave="scrollLeave"></div>
		</div>
	</div>
</template>

<script>
	import resize from 'vue-resize-directive'
	import { prefixStyle } from 'common/js/dom'
	
	const userSelect = prefixStyle('user-select')
	
	export default {
		directives: {
	        resize
	   	},
		props: {
			width: {
				type: String,
				default: 15
			},
			bgColor: {
				type: String,
				default: 'white'
			},
			color: {
				type: String,
				default: 'red'
			},
			hoverColor: {
				type: String,
				default: ''
			}
		},
		mounted() {
			setTimeout(() => {
				this.initScroll()
				this.onmouseWheel(this.$refs['scroll'], this.scrollWheel)
			}, 20)
		},
		data() {
			return {
				showScroll: false	
			}
		},
		methods: {
			onResize() {
				this.scrollMove.style.top = ''
				this.scrollWarpper.style.top = ''
				this.initScroll()
			},
			scrollDown(event) {
				if(!this.showScroll) {
					return
				}
				let startY = event.clientY - this.scrollMove.offsetTop
				document.onmousemove = (event) => {
					document.getElementsByTagName('html')[0].style[userSelect] = 'none'
					document.getElementsByTagName('html')[0].style['cursor'] = 'default'
					
					this.scrollEnter()
					
					let Y = event.clientY - startY
					
					if (Y < 0) {
						Y = 0
					}
					
					if (Y > this.scroll.offsetHeight - this.scrollMove.offsetHeight) {
						Y = this.scroll.offsetHeight - this.scrollMove.offsetHeight
					}
					
					this.scrollMove.style.top = `${Y}px`
					this.scrollWarpper.style.top = `${-Y / (this.sH / this.swH)}px`
				}
				document.onmouseup = () => {
					this.scrollLeave()
					document.getElementsByTagName('html')[0].style[userSelect] = ''
					document.getElementsByTagName('html')[0].style['cursor'] = ''
					document.onmousemove = null
				}
			},
			scrollWheel(event, down) {
				if(!this.showScroll) {
					return
				}
				let wheel = (event.wheelDelta / 120) ||  -(event.detail / 3)
				
				let smT = this.scrollMove.offsetTop
				let swT = this.scrollWarpper.offsetTop
				
				let smY = smT - wheel * 10
				let swY = swT + (wheel * 10) / (this.sH / this.swH)
				
				if (smY < 0) {
					smY = 0
				}
				
				if (smY > this.scroll.offsetHeight - this.scrollMove.offsetHeight) {
					smY = this.scroll.offsetHeight - this.scrollMove.offsetHeight
				}
				
				if(swY < this.sH - this.swH) {
					swY = this.sH - this.swH
				}
				
				if(swY > 0) {
					swY = 0
				}
				
				this.scrollMove.style.top = `${smY}px`
				this.scrollWarpper.style.top = `${swY}px`
			},
			scrollEnter() {
				if(!this.hoverColor) {
					return
				}
				this.scrollMove.style.backgroundColor = this.hoverColor
			},
			scrollLeave() {
				if(!this.hoverColor) {
					return
				}
				this.scrollMove.style.backgroundColor = this.color
			},
			onmouseWheel(obj, cbfn) { //鼠标滚轮兼容事件
				var down = true;
				if(window.navigator.userAgent.indexOf("Firefox") > -1) {
					obj.addEventListener("DOMMouseScroll", fn, false);
				} else {
					obj.onmousewheel = fn;
				}
			
				function fn(event) {
					var event = event || window.event;
					if(event.detail) {
						down = event.detail > 0 ? true : false;
					} else {
						down = event.wheelDelta < 0 ? true : false;
					}
					cbfn.call(obj, event, down);
					if(event.preventDefault) {
						event.preventDefault();
					} else {
						window.event.returnValue = false;
					}
					return false;
				}
			},
			initScroll() {
				this.scroll = this.$refs['scroll']
				this.scrollWarpper = this.$refs['scroll-warpper']
				
				this.scrollBox = this.$refs['scroll-box']
				this.scrollMove = this.$refs['scroll-move']
				
				this.sH = this.scroll.offsetHeight
				this.swH = this.scrollWarpper.offsetHeight
				
				if(this.sH < this.swH) {
					this.showScroll = true
					setTimeout(() => {
						this.scrollBox.style.width = `${this.width}px`
						this.scrollBox.style.backgroundColor = this.bgColor
						
						this.scrollMove.style.height = `${this.sH / this.swH * this.sH}px`
						this.scrollMove.style.backgroundColor = this.color
					}, 20)
				}else {
					this.showScroll = false
				}
				
			}
		}
	}
</script>

<style scoped lang="less">
	.scroll {
		width: 100%;
		height: 100%;
		position: relative;
		.scroll-warpper {
			position: absolute;
		}
		.scroll-box {
			height: 100%;
			position: absolute;
			right: 0;
			top: 0;
			.scroll-move {
				width: 100%;
				border-radius: 5px;
				position: absolute;
			}
		}
	}
</style>