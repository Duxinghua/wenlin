<template>
	<view class="yy">
		<navigation-custom :config="config" :scrollTop="scrollTop" :home="false" @customConduct="customConduct"
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
					请输入上门原因
					<text>（必填）</text>
				</view>
				<u-input v-model="content" height="345" type="textarea" :border="true"  placeholder="医生及志愿者力量紧缺，请说明上门做核酸原因" />

			</view>
			
		</view>
		<view class="yybtn" @click="addAppointment">
			确定
		</view>
		<u-picker mode="selector" @confirm="confirmHandler" v-model="show" :default-selector="[0]" :range="selector" range-key="mark"></u-picker>

	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		components: {
			navigationCustom
		},
		data() {
			return {
				content:'',
				type: 'select',
				rounds: '',
				rounds_name:'',
				show: false,
				selector: [
				],
				config: {
					title: '上门预约', //title
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
		onLoad() {
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
			confirmHandler(e){
				var l = e[0]
				this.rounds_name = this.selector[l].mark
				this.rounds = this.selector[l].rounds
			},
			addAppointment(){
				var data = {}
				if(this.rounds_name.length == 0){
					return this.$u.toast('请选择轮次')
				}else{
					data.rounds = this.rounds
				}
				if(this.content.length == 0){
					return this.$u.toast('请输入上门原因')
				}else{
					data.content = this.content
				}
				this.Api.addAppointment(data).then((result) => {
					if(result.code == 1){
						this.$u.toast('预约成功')
						setTimeout(() => {
							uni.navigateBack({
								delta:1
							})
						},1000)
					}else{
						return this.$u.toast(result.msg)
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
						font-size: 36rpx;
						font-weight: bold;
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
						color:#FE6363
					}
				}
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
