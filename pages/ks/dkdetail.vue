<template>
	<view class="yy">
		<navigation-custom :config="config"  :home="false" :scrollTop="scrollTop" @customConduct="customConduct"
			:scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<view class="form-item">
				<view class="label">
					请选择核酸筛查轮数：
				</view>
				<u-input v-model="rounds_name" :type="type" :border="true" placeholder="请选择轮次" @click="show = true" />
			</view>
			<view class="form-item-send">
				<view class="label">
					打卡记录
					<text>（选填）</text>
				</view>
				<u-input v-model="content" height="345" type="textarea" :border="true"  placeholder="用文字记录核酸筛查的每一瞬间~~" />

			</view>
			<view class="uploadwrap">
					<u-upload :header="headerObj" :action="action" :file-list="fileList" @on-success="uploadImg" @on-remove="removeImg"></u-upload>

			</view>
			
		</view>
		<view class="yybtn" @click="dkHandler">
			确定
		</view>
		<u-picker mode="selector" v-model="show" :default-selector="[0]" :range="selector" range-key="mark" @confirm="confirmHandler"></u-picker>

	</view>
</template>

<script>
	import {baseURL,appid} from '../../utils/config.js'
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		components: {
			navigationCustom
		},
		data() {
			return {
				userinfo_id:'',
				headerObj:{
					'XX-Device-Type':'wxapp',
					'XX-Token':'',
					'XX-Wxapp-AppId':''
				},
				fileList:[],
				uploadList:[],
				action:baseURL+'/api/community/upload/one',
				content:'',
				type: 'select',
				clock_rounds: '',
				rounds_name:'',
				show: false,
				selector: [
				],
				config: {
					title: '打卡详情', //title
					bgcolor: 'white', //背景颜色
					fontcolor: "rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type: 1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
			}
		},
		onLoad(options) {
			this.userinfo_id = options.id
			this.headerObj['XX-Token'] = uni.getStorageSync('token')
			this.headerObj['XX-Wxapp-AppId'] = appid
			this.getRounds()
		},
		methods:{
			getRounds(){
				this.Api.narounds({}).then((result) => {
					console.log(result)
					if(result.code == 1){
						this.selector = result.data
					}
				})
			},
			uploadImg(e){
				if(e.code == 1){
					this.uploadList.push(e.data.http_url)
				}
			},
			removeImg(e){
				this.uploadList.splice(e,1)
			},
			confirmHandler(e){
				var l = e[0]
				this.rounds_name = this.selector[l].mark
				this.clock_rounds = this.selector[l].rounds
			},
			dkHandler(){
				var data ={}
				if(this.rounds_name.length == 0){
					return this.$u.toast('请选择轮次')
				}else{
					data.clock_rounds = this.clock_rounds
				}
				if(this.content.length == 0){
					// return this.$u.toast('请输入原因')
				}else{
					data.content = this.content
				}
				data.userinfo_id = this.userinfo_id
				if(this.uploadList.length == 0){
					// return this.$u.toast('请上传图片')
				}else{
					data.images = this.uploadList.join(',')
				}
				this.Api.punchclock(data).then((result) => {
					if(result.code == 1){
						this.$u.toast('打卡成功')
						setTimeout(() => {
							uni.navigateBack({
								delta:1
							})
						},1000)
					}else{
						this.$u.toast(result.msg)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.yy {
		width: 100%;
		min-height: 100vh;
		background: white;
		padding-top: 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		/deep/ .u-btn-picker{
			font-size: 34rpx;
			font-weight: bold;
		}

		.content {
			padding: 0 24rpx;
			box-sizing: border-box;
			.form-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 20rpx;
				box-sizing: border-box;
				border-bottom: 10rpx solid #F7F9FF;
					.label{
						font-size: 36rpx;
						font-weight: 800;
						color: #020433;
						line-height: 47rpx;
						white-space: nowrap;
					}
					/deep/ .u-input__input{
						color:red;
						// font-size: 36rpx;
						// font-weight: bold;
					}

			}
			.form-item-send{
				padding-top:42rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				.label{
					font-size: 36rpx;
					font-weight: 800;
					color: #020433;
					line-height: 47rpx;
					margin-bottom: 42rpx;
					white-space: nowrap;
					text{
						color:#999999
					}
				}
			}
			.uploadwrap{
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				align-content: flex-start;
				margin-top: 20rpx;
			}
		}
		.yybtn{
			width: 670rpx;
			height: 99rpx;
			background: #0F75E7;
			border-radius: 10rpx;
			margin:auto auto 76rpx auto;
			font-size: 38rpx;
			line-height: 99rpx;
			text-align: center;
			font-weight: bold;
			color: #FFFFFF;
		}
	}
</style>
