<template>
	<view class="setup">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="dk">
			<view class="dkitem" v-for="(item,index) in ulist" :key="index">
		<!-- 		<image :src="item.avatar ? item.avatar : '../../static/c-w-ico.png'" class="avatar"></image> -->
				<view class="avatar" @click="go(index == 0 ? ('setup?uid='+item.id) :  ('ag?id='+item.id))">
					{{item.avatarl}}
				</view>
				<view class="dkinfo" @click="go(index == 0 ? ('setup?uid='+item.id) :  ('ag?id='+item.id))">
					<view class="username">
						{{item.username}}
					</view>
					<view class="dkdes">
						已完成核酸筛查打卡 <text>{{item.clock_rounds}}</text> 次
					</view>
					<view class="dkdes" v-if="item.last_clock_time != 0">
						最近一次打卡时间：<text class="dktime">{{item.last_clock_time  | formatTime}}</text>
					</view>
					<view class="dkdes" v-if="item.last_clock_time == 0">
						你还没有打卡
					</view>
				</view>
				<view class="dkbtn" @click="go('dkdetail?id='+item.id)">
					{{item.user_type == 1 ? '打卡' : '代打卡'}}
				</view>
			</view>
		</view>
		<view class="end">
			<view class="dkcount">
				当前代打卡共同居住<text>{{userCont}}</text>人
			</view>
			<view class="dkadd" @click="go('ag')">
				<text class="s">+</text>
				<text class="s">添加</text>
			</view>
			<image src="https://sq.wenlinapp.com/upload/dynamics/20220123/91161160c8728968d740e84e077920fe_thumb.png" class="y" @click="go('yy')"></image>
			<view class="dkinfos" @click="go('yy')">
				<view>每人每天只可打卡1次</view>
				<view>如健康码为红码或其他特殊情况，可点击上门预约做核酸</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		components:{
			navigationCustom
		},
		data(){
			return{
				userCont:0,
				ulist:[],
				idcard:'',
				mobile:'',
				username:'',
				community_name:'',
				community_id:'',
				building:'',
				building_detail:'',
				buildCs:{
					width:'190rpx'
				},
				communityCs:{
					width:'434rpx'
				},
				communityCs1:{
					width:'270rpx'
				},
				communityCs2:{
					width:'260rpx'
				},
				config: {
					title: '打卡', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type:3, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200 ,//滑动的高度限制，超过这个高度即背景全部显示
			}
		},
		onLoad() {
			this.myUsers()
		},
		onShow() {
			this.myUsers()
		},
		methods:{
			myUsers(){
				this.Api.myUsersList({}).then((result) => {
					if(result.code == 1){
						
						var userCont = 0
						result.data.map((item) => {
							var l =  new String(item.username)
							if(l.length >= 2){
								item.avatarl = l.substr(l.length - 2)
							}else{
								item.avatarl = l.substr(0)
							}
							if(item.user_type == 2){
								userCont += 1
							}
						})
						this.ulist = result.data
						this.userCont = userCont
					}
				})
			},
			go(url){
				uni.navigateTo({
					url:url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: #F7F9FF;
	}
	.setup{
		width: 100%;
		min-height:100vh;
		display: flex;
		flex-direction: column;
		background: #F7F9FF;
		.dk{
			width: 100%;
			display: flex;
			flex-direction: column;
			.dkitem{
				padding:40rpx 28rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				align-items: center;
				background: white;
				position: relative;
				.avatar{
					width:120rpx;
					height:120rpx;
					border-radius: 50%;
					margin-right: 28rpx;
					line-height: 120rpx;
					font-size: 40rpx;
					color:white;
					text-align: center;
					
					background-color:rgba($color: #0F75E7, $alpha: .7) 
					
				}
				.dkinfo{
					display: flex;
					flex-direction: column;
					.username{
						font-size: 31rpx;
						font-weight: bold;
						color: #0F75E7;
						margin-bottom: 20rpx;
					}
					.dkdes{
						font-size: 24rpx;
						font-weight: 500;
						color: #0D1C3F;
						line-height: 36rpx;
						text{
							color:red;
							margin:0 10rpx;
						}
						.dktime{
							font-weight: bold;
							color:#333333;
						}
					}
				}
				.dkbtn{
					width: 148rpx;
					height: 61rpx;
					line-height: 61rpx;
					text-align: center;
					background: #0F75E7;
					border-radius: 10rpx;
					color:white;
					margin-left: auto;
				}
			}
			.dkitem:nth-child(1){
				margin-bottom: 10rpx;
				position: unset;
			}
			.dkitem::after{
				position: absolute;
				left:50%;
				transform: translateX(-50%);
				width:calc(100% - 75rpx);
				bottom: 0rpx;
				height: 2rpx;
				background: #B1B9CA;
				content:'';
			}
			.dkitem:nth-child(1)::after{
				display: none;
			}
			.dkitem:last-child::after{
				display: none;
			}

		}
		.end{
			display: flex;
			flex-direction: column;
			.dkcount{
				font-size: 34rpx;
				margin-top:66rpx;
				font-weight: 500;
				color: #0D1C3F;
				text-align: center;
				text{
					color:red;
					margin:0 10rpx;
				}
			}
			.dkadd{
				width: 670rpx;
				height: 99rpx;
				background: rgba(47, 95, 184, 0);
				border: 2rpx solid #0F75E7;
				border-radius: 10rpx;
				margin:28rpx auto 0 auto;
				color: #0F75E7;
				display: flex;
				justify-content: center;
				flex-direction: row;
				align-items: center;
				.s{
					font-size: 38rpx;
					font-weight: bold;
					margin:0 10rpx;
				}
			}
			.y{
				width: 178rpx;
				height:183rpx;
				margin:276rpx auto 30rpx auto;
			}
			.dkinfos{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-size: 26rpx;
				font-weight: 500;
				color: #95A0B6;
				margin-bottom: 40rpx;
				view{
					line-height: 40rpx;
				}
				text{
					color:red;
					margin:0 10rpx;
					text-decoration: underline;
				}
			}
		}
	}
</style>
