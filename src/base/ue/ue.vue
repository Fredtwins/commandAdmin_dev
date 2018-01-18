<template>
	<div class="editor-warpper">
		<script  
			id="editor"
			ref="editor" 
			type="text/plain"
			style="width: 100%;height: 100%;"></script>
	</div>
</template>

<script>
	
	export default {
		mounted() {
			this.initEditor()
		},
		data() {
			return {
				Ue: null
			}
		},
		methods: {
		   	getContent() {
		   		return this.Ue.getContent()
		   	},
		   	setContent(str) {
				this.Ue.setContent(str)
		   	},
		    initEditor() {
	   		  	this.Ue = UE.getEditor(this.$refs.editor)
	   		  	
	   		  	this.Ue.addListener('ready', () => {
					this.$emit('ready')
				})
		    }
		},
		beforeDestroy() {
			UE.delEditor(this.$refs.editor)
			
			this.Ue.destroy();
		}
	}
</script>

<style scoped lang="less">
	.editor-warpper {
		width: 100%;
		height: 100%;
	}
</style>