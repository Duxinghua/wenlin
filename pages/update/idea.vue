<template>
	<view class="idea">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<view class="ideawrap">
				<textarea maxlength="500" class="textarea" v-model="textareaValue" @input="textareaInput" placeholder="说出你的建议与意见，不超过500字"></textarea>
				<text class="tips">{{textareaValue.length}}/500</text>
			</view>
			<view class="btns" @click="submitReport">提交</view>
		</view>
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				config: {
					title: '意见建议', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type:1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
				catelist:[
					{
						id:1,
						text:'全部'
					},
					{
						id:2,
						text:'求助'
					},
					{
						id:3,
						text:'新鲜事'
					},
					{
						id:4,
						text:'闲置'
					},
					{
						id:5,
						text:'鹊桥'
					},
					{
						id:6,
						text:'便民'
					},
					{
						id:7,
						text:'达人'
					}
					
	
				],
				headerIndex:1,
				textareaValue:''
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods:{
			customConduct(e){
				console.log(e)
			},
			textareaInput(e){
				var result = e.detail.value
				 result = result.substr(0,500)
				 this.textareaValue= result
			},
			submitReport(){
				if(!this.textareaValue){
					uni.showToast({
						icon:'none',
						title: '请输入建设与意见',
						duration: 2000
					})
					return
				}
				this.Api.addSuggestion({content:this.textareaValue,community_id:uni.getStorageSync('community_id')}).then((result) => {
					if(result.code == 1){
						uni.showToast({
							icon:'success',
							title: result.msg,
							duration: 2000,
							success: () => {
								uni.navigateBack({
									delta:1
								})
							}
						})
					}
				})
			}
		},
		components: {
			navigationCustom
		}
	};
</script>

<style lang="scss" scoped>
	.idea{
		display: flex;
		flex-direction: column;
		height: 100vh;
		.content{
			padding:24upx 24upx 80upx 24upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			.ideawrap{
				width:100%;
				height:400upx;
				position: relative;
				.textarea{
					position: absolute;
					left:0;
					top:0;
					width:100%;
					height:400upx;
					background:rgba(222,222,222,0.3);
					border-radius:8upx;
					text-align: left;
					padding:20upx;
					box-sizing: border-box;
				}
				.tips{
					position: absolute;
					right:20upx;
					bottom:20upx;
				}
			}
			.btns{
				width:702upx;
				height:80upx;
				background:#FF9C00;
				box-shadow:0px 8px 16px 0px rgba(225,138,0,0.1);
				border-radius:40upx;
				position: fixed;
				left:24upx;
				bottom: 100upx;;
				font-size:36upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:white;
				line-height: 80upx;
				text-align: center;
			}
		}
	}
</style>
