<template>
	<!-- 验证 -->
	<view class="personal">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<view class="personalitem">
				<text class="label">
					小区名称
				</text>
				<input class="text" placeholder="XXX" />
			</view>
			<view class="personalitem">
				<text class="label">
					楼栋号
				</text>
				<input class="text" placeholder="1#" />
			</view>
			<view class="personalitem">
				<text class="label">
					单元号
				</text>
				<input class="text" placeholder="1#" />

			</view>
			<view class="personalitem">
				<text class="label">
					门牌号
				</text>
				<input class="text" placeholder="1#" />

			</view>
			<view class="personalitem">
				<text class="label">
					身份
				</text>
				<text class="text">
					业主
				</text>
			</view>
			<view class="personalitem">
				<text class="label">
					性别
				</text>
				<text class="text">
					男
				</text>
			</view>
			<view class="personalitem">
				<text class="label">
					手机号
				</text>
				<input class="text" placeholder="000000" />
			</view>
			<view class="personalitem">
				<text class="label">
					车牌号
				</text>
				<input class="text" placeholder="sss" />

			</view>
			<view class="personalitem">
				<text class="label">
					上传附件
				</text>
				<text class="text">
				身份证明文件
				</text>
			</view>
			<view class="submitwrap">
				提交
			</view>
		</view>
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				config: {
					title: '验证身份', //title
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
				scrollMaxHeight: 200 //滑动的高度限制，超过这个高度即背景全部显示
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods:{
			customConduct(e){
				console.log(e)
			}
		},
		components: {
			navigationCustom
		}
	};
</script>

<style lang="scss" scoped>
	.personal{
		display: flex;
		flex-direction: column;
		.content{
			display: flex;
			flex-direction: column;
			padding-left:24upx;
			padding-right:24upx;
			box-sizing: border-box;
			.personalitem{
				height:104upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				border-bottom: 1px solid #DEDEDE;
				.label{
					width:120upx;
					text-align: right;
					font-size:28upx;
					margin-right:24upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(51,51,51,1);
				}
				.text{
					font-size:28upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(51,51,51,1);
					width:calc(100% - 120upx);
					text-align: left;
				}
			}
			.submitwrap{
				width:100%;
				height:80upx;
				line-height: 80upx;
				text-align: center;
				background:rgba(255,156,0,1);
				box-shadow:0px 8px 16px 0px rgba(225,138,0,0.1);
				border-radius:40upx;
				font-size:36upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(255,255,255,1);
				letter-spacing:8px;
				margin-top:50upx;
			}
		}
	}
</style>
