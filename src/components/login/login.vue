<template>
	<div class="login">
		<div class="login-warpper">
			<div class="login-title">
				<img src="./img/title.png"/>
			</div>
			<div class="login-box">
				<div class="login-box-warpper">
					<div class="login-box-title">
						用户登录
					</div>
					<div class="login-box-content">
						<div class="username">
							<Input 
								v-model="info.username" 
								size="large"
								@on-focus="usernameFocus"
								@on-enter="commit"
								placeholder="请输入账号">
								<Icon slot="prepend" type="person" size="18"></Icon>
							</Input>
							<transition name="fade">
								<div v-show="showUsernameVer" class="verification">用户名不能为空</div>
							</transition>	
						</div>
						<div class="password">
							<Input 
								v-model="info.password"
								size="large"
								type="password"
								@on-focus="passwordFocus"
								@on-enter="commit"
								placeholder="请输入密码">
								<Icon slot="prepend" type="locked" size="18"></Icon>
							</Input>
							<transition name="fade">
								<div v-show="showPasswordVer" class="verification">密码不能为空</div>								
							</transition>	 
						</div>
						<div class="code">
							<Row>
								<Col span="12">
									<Input 
										v-model="info.code"
										size="large"
										@on-focus="codeFocus"
										@on-enter="commit"
										placeholder="请输入验证码"
										style="width: 115px;">
										</Input>
								</Col>
								<Col span="12">
									<div class="login-code" @click="createCode" v-html="info.codeWrite"></div>
								</Col>
							</Row>
							<transition name="fade">
								<div v-show="showCodeVer" class="verification">验证码不能为空</div>								
							</transition>	 
						</div>
					</div>
					<div class="login-box-commit" @click="commit">
						<Button type="info" :loading="showLoading" long>
					        <span v-if="!showLoading">登录</span>
					        <span v-else>登录中...</span>
					    </Button>
					</div>
				</div>
			</div>
			
			<warn-model 
				ref="error-model"
				title="错误" 
				:message="errInfo.message"
				@sure="closeErrModel"></warn-model>
		</div>
	</div>
</template>

<script>
	import { mapMutations } from 'vuex'
	import { warnModelMixin } from 'common/js/mixins'
	import { setUserIng } from 'common/js/util'
	import { ERR_OK } from 'api/config'
	import { goLogin } from 'api/login'
	
	export default {
		mixins: [warnModelMixin],
		created() {
			this.createCode()
		},
		data() {
			return {
				info: {
					username: '',
					password: '',
					code: '',
					codeWrite: ''
				},
				showUsernameVer: false,
				showPasswordVer: false,
				showCodeVer: false,
				errModel: false,
				errInfo: {},
				showLoading: false
			}
		},
		methods: {
			createCode() {
				this.info.codeWrite = '';
				let codeLength = 4;
				//验证码的长度
				let codeChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
					'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
					'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
				];
				//所有候选组成验证码的字符，当然也可以用中文的
				for(let i = 0; i < codeLength; i++) {
					let charNum = Math.floor(Math.random() * 52);
					this.info.codeWrite += codeChars[charNum];
				}
			},
			closeErrModel() {
				this.createCode()
				this.$refs['error-model'].hideModel()
				setTimeout(() => {
					this.errInfo = {}					
				}, 400)
			},
			usernameFocus() {
				this.showUsernameVer = false
			},
			passwordFocus() {
				this.showPasswordVer = false
			},
			codeFocus() {
				this.showCodeVer = false
			},
			commit() {
				if(this.showLoading) {
					return
				}
				
				if (!this.info.username) {
					this.showUsernameVer = true
				}
				if (!this.info.password) {
					this.showPasswordVer = true
				}
				if (!this.info.code) {
					this.showCodeVer = true
				}
				if (this.showUsernameVer || this.showPasswordVer || this.showCodeVer) {
					return
				}
				
				if (this.info.code.toUpperCase() != this.info.codeWrite.toUpperCase()) {
					this.errInfo = {
						message: '验证码错误'
					}
					this.$refs['error-model'].showModel()
					this.info.code = ''
					return
				}
				
				this._goLogin()
				
			},
			_goLogin() {
				this.showLoading = true
				let info = {
					username: this.info.username,
					password: this.info.password
				}
				goLogin(info).then(res => {
					if (res.code === ERR_OK) {
						
						if(res.result.role !== '管理员') {
							this.errInfo = {
								message: '非管理员没有权限进入该系统。'
							}
							this.$refs['error-model'].showModel()
							this.info.code = ''
						}else {
							if (res.result.job) {
								res.result.work = [res.result.role, res.result.job]
							}else {
								res.result.work = [res.result.role]
							}

							setUserIng(res.result)
							this.$router.push('/home/map')
							
							this.info = {
								username: '',
								password: ''
							}
							this.showUsernameVer = false
							this.showPasswordVer = false
						}
					}else {
						this.errInfo = res
						this.$refs['error-model'].showModel()
						this.info.code = ''
					}
					this.showLoading = false
				})
			},
			...mapMutations([
				'SET_USER'
			])
		}
	}
</script>

<style lang="less">
	@import url('~common/less/animate.less');

	.login {
		width: 100%;
		height: 100%;
		.login-warpper {
			width: 100%;
			height: 100%;
			background-image: url(./img/BG.png);
			background-size: cover;
			position: relative;
			.login-title {
				width: 865px;
				height: 106px;
				position: absolute;
				left: 50px;
				top: 50px;
				img {
					width: 100%;
				}
			}
			.login-box {
				width: 300px;
				height: 300px;
				position: absolute;
				top: 0;
				bottom: 0;
				right: 100px;
				margin: auto 0;
				.login-box-title {
					width: 100%;
					text-align: center;
					font-size: 20px;
					font-weight: 700;
					color: rgb(0, 204, 255);
					padding: 20px 0 15px;
				}
				.login-box-warpper {
					width: 100%;
					height: 100%;
					background-color: rgba(0, 0, 0, .5);
					position: relative;
					.login-box-content {
						width: 240px;
						margin: 0 auto;
						.username, .password, .code {
							margin-bottom: 20px;
							position: relative;
							.ivu-input-group-prepend {
								background-color: rgb(0, 204, 255) !important;
								color: white !important;
								border: none !important;
							}
							.verification {
								position: absolute;
								top: 38px;
								color: red;
								font-size: 12px;
							}
							.login-code {
								width: 95%;
								height: 36px;
								background-color: #dcdcdc;
								margin-left: 5%;
								letter-spacing: 3px;
								font-size: 26px;
								font-weight: bold;
								line-height: 36px;
								color: blue;
								text-align: center;
								cursor: pointer;
								user-select: none;
							}
						}
					}
					.login-box-commit {
						width: 240px;
						margin: auto;
						cursor: pointer;
						img {
							width: 100%;
						}
					}
				}
			}
		}
	}
</style>