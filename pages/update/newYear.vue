<template>
	<view class="newyear">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="content">
			<view class="header">
				<u-image :src="imgURl+'bg1.png'" width="100%" height="100%"></u-image>
				<view class="title">
					我是小区名
				</view>
				<view class="anbtn">
					<u-image :src="imgURl + 'an.png'" class="an"  width="100%" height="100%"></u-image>
				</view>
			</view>
			<view class="body">
				<view class="list">
					<view class="listitem" v-for="(item,index) in 70">
						<view class="no">
							NO.300
						</view>
						<view class="ucc">
							<view class="userwrap">
								<view class="avatar">
								<u-image src="../../static/a1.png" width="100%" height="100%" border-radius="50%"></u-image>
								</view>
								<view class="username">
									用户昵称七个字
								</view>
								<view class="title">
									给大家拜年了
								</view>
							</view>
							<view class="paicont">
								牛年行大运，牛年行大运，牛年行大运，牛年行大运，牛年行大运,牛年···
							</view>
							<view class="toolitem">
								<view class="time">
									1-09 12:26
								</view>
								<view class="share">
									<image src="../../static/check.png"></image>
									<view class="text">分享</view>
								</view>
								<view class="like">
									<image src="../../static/check.png"></image>
									<view class="text">分享</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default{
		components:{
			navigationCustom
		},
		data(){
			return {
				imgURl:this.Config.minUrl,
				config: {
					title: '拜年接龙', //title
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
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		}
	}
</script>

<style lang="scss" scoped>
	.newyear{
		display: flex;
		flex-direction: column;
		.content{
			display: flex;
			flex-direction: column;
			padding-bottom: 30rpx;
			box-sizing: border-box;
			.header{
				width:100%;
				height: 378rpx;
				position: relative;
				z-index: 100;
				.anbtn{
					position: absolute;
					right:136rpx;
					top:250rpx;
					width: 268rpx;
					height:70rpx;
					z-index: 250;
				}
				.title{
					font-size: 31rpx;
					font-family: Microsoft YaHei;
					font-weight: bold;
					color: #FFF8F3;
					position: absolute;
					top:48rpx;
					left:352rpx;
					z-index: 251;
				}
			}
			.body{
				position: static;
				z-index: 99;
				margin-top:-20rpx;
				width:100%;
				padding:20rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				.list{
					min-height: 900rpx;
					border-radius: 20rpx;		
					background: linear-gradient(0deg, #CD4533, #A9242E);
					.listitem{
						display: flex;
						flex-direction: row;
						align-items: flex-start;
						padding:20rpx;
						box-sizing: border-box;
						.no{
							font-size: 20rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #E89163;
							width:90rpx;
							line-height:67rpx;
						}
						.ucc{
							width:calc(100% - 105rpx);
							margin-left:15rpx;
							display: flex;
							flex-direction: column;
							padding-bottom: 20rpx;
							border-bottom: 2rpx solid #D24E42;
							.userwrap{
								display: flex;
								flex-direction: row;
								align-items: center;
								font-size: 24rpx;
								font-family: PingFang SC;
								font-weight: 500;
								color: #FFF9AE;
								.avatar{
									width: 67rpx;
									height: 67rpx;
									border-radius: 34rpx;
									margin-right:23rpx;
								}
								.username{
									width:180rpx;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
								}
								.title{
									flex:1;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
								}
								
							}
							.paicont{
								font-size: 30rpx;
								font-family: PingFang SC;
								font-weight: 500;
								color: #FFF7B2;
								padding-left:90rpx;
							}
							.toolitem{
								display: flex;
								flex-direction: row;
								align-items: center;
								font-size: 24rpx;
								font-family: PingFang SC;
								font-weight: 500;
								margin-top:20rpx;
								padding-left:90rpx;
								box-sizing: border-box;
								color: #E89163;
								.time,.share,.like{
									flex:auto;
									display: flex;
									flex-direction: row;
									align-items: center;
								}
								.like{
									justify-content: flex-end;
								}
								image{
									width:30rpx;
									height:30rpx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
