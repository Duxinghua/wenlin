<template>
	<!-- 个人名片 -->
	<view :class="['personalcard',scrollFixed ? 'personalcardfix' : '' ]">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="pcontent">
			<view class="userheader">
				<view class="avatarwrap">
					<image :src="detail.avatar" class="heading"></image>
					<image v-if="detail.skill.id" src="../../static/da.png" class="daing"></image>
				</view>
				<view class="userinfo">
					<text class="username">{{detail.user_nickname}}·{{detail.building}}#</text>
					<view class="userdes">
						<image src="../../static/man.png" class="manico" v-if="detail.sex == 1"></image>
						<image src="../../static/wuman.png" class="manico" v-else-if="detail.sex == 2"></image>
						<image src="../../static/mi.png" class="manico" v-else></image>
					    <view class="u2" v-if="detail.founder == 1">创</view>
					</view>
				</view>
				<view :class="['userbtn',detail.is_kown == 1 ? 'useracitve' : '']" @click="knowTodo" v-if="detail.is_kown != -1">
					{{know_text}}
				</view>
			</view>
			<view class="useritem" @click="goCommittee">
				<image src="../../static/personitem1.png" class="peronico"></image>
				<text class='t1'>所在小区:</text>
				<text class="t2">{{detail.community.title}}</text>
				<image class="ti" src="../../static/cardmore.png"></image>
			</view>
			<view class="useritem">
				<image src="../../static/personitem2.png" class="peronico"></image>
				<text class='t1'>认识他:</text>
				<text class="t2">{{detail.know_user_total}}</text>
				<view class="avatarwrap">
					<image src="../../static/heading.png" class="avatarw" :style="{left:(70*index)+'rpx','z-index':(index)}" v-for="(item,index) in 6" :key="index" :index="index"></image>
				</view>
			</view>
			<view class="useritem">
				<image src="../../static/personitem3.png" class="peronico"></image>
				<text class='t1'>爱心值:</text>
				<text class="t2">{{detail.love_value}}</text>
			</view>
			<view class="useritem">
				<image src="../../static/personitem4.png" class="peronico"></image>
				<text class='t1'>发贴数:</text>
				<text class="t2">{{detail.post_num}}</text>
			</view>
			<view class="useritem">
				<image src="../../static/personitem5.png" class="peronico"></image>
				<text class='t1'>当前积分:</text>
				<text class="t2">{{detail.score}}</text>
				<view class="inputjiwrap">
					转入积分
				</view>
			</view>
			<view class="useritem" @click="goDadetail" v-if="detail.skill_arr.length">
				<image src="../../static/personitem6.png" class="peronico"></image>
				<text class='t1'>我是达人:</text>
				<text class="t2">{{detail.skill_text}}</text>
				<image class="ti" src="../../static/cardmore.png"></image>
			</view>
			<view class="useritem useritemfix" @click="goUsed">
				<image src="../../static/personitem7.png" class="peronico"></image>
				<text class='t1'>闲置物品</text>
				<view class="imgwrap">
					<image class="imgitem" :src="item.images ? item.images[0] : ''" mode="" v-for="(item,index) in detail.sell_images" :key="index"></image>
				</view>
				<image class="ti" src="../../static/cardmore.png" ></image>
			</view>
			<view class="lybtn" @click="messageHandler" v-if="personShow">
				留言
			</view>
			<view class="gbbtn" @click="reportHandler" v-if="personShow">
				举报
			</view>
		</view>
		<LeaveWords :messageValue.sync="messageText" :typeFlag.sync="typeFlag" :messageShow.sync="messageShow" @textareaBlur="textareaBlur" @closeMessage="closeMessage" @submitTodo="submitTodo"/>
		<u-popup v-model="integralShow" closeable close-icon-size="41" mode="center" border-radius="10">
			<view class="integralwrap">
				<image :src="detail.avatar" class="headimgico"></image>
				<view class="headename">{{detail.user_nickname}}</view>
				<view class="integrinput">
					<view class="label">转入积分：</view>
					<u-input v-model="integralValue" type="number"  />
				</view>
				<view class="btnwrap">
					<view class="cancel">
						取消
					</view>
					<view class="confirmbtn">
						确定
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	import LeaveWords from '../../components/leavewords/leavewords.vue'
	export default {
		data () {
			return {
				config: {
					title: '个人名片', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type: 1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
				query:{},
				detail:{
					skill_arr:[]
				},
				know_text:'认识TA',
				messageShow:false,
				messageText:'',
				typeFlag:true,
				deliveryFlag: false,
				canvasFlag: true,
				scrollFixed:false,
				posterData:{},
				personShow:true,
				integralShow:false,
				integralValue:0
			}
		},
		mounted(options) {
			if(this.$mp.query){
				console.log(this.$mp.query,'query')
				var {...data} = this.$mp.query
				this.query = data
				console.log(this.$mp.query.user_id,'user_id',uni.getStorageSync('user').id )
					if(uni.getStorageSync('user').id == this.$mp.query.user_id){
						this.personShow = false
					}else{
						this.personShow = true
					}
				
			}
			this.getOtherUserInfo(this.query)
		},
		// onShareAppMessage:function(){
		// 	var community_id = uni.getStorageSync('community_id')
		// 	var user_id = uni.getStorageSync('user_id')
		// 	 return {
		// 	  title: uni.getStorageSync('user').user_nickname+'的个人名片，欢迎留言',
		// 	  imageUrl: 'https://sq.wenlinapp.com/appimg/send54.png'
		// 	 }
		// },
		// onShareTimeline(e) {
		// 	var query = {}
		// 	var community_id = uni.getStorageSync('community_id')
		// 	var user_id = uni.getStorageSync('user_id')
		// 	query.community_id = this.community_id
		// 	query.user_id = this.user_id
		//     // query=JSON.stringify(query);
		//     return {
		//       title: uni.getStorageSync('user').user_nickname+'的个人名片，欢迎留言',
		//       imageUrl: 'https://sq.wenlinapp.com/appimg/send54.png',
		//       query: query,
		//     }
		// },
		methods:{
			goCommittee(){
				uni.navigateTo({
					url:'/pages/index/communitycard?community_id='+this.detail.community_id
				})
			},
			textareaBlur(e){
				console.log(e.detail)
			},
			closeMessage(){
				this.messageShow = false
			},
			messageHandler(){
				if(uni.getStorageSync('singPage') == 1){
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon:'none',
						duration: 2000,
					})
					return
				}
				this.messageText = ''
				this.$forceUpdate()
				this.messageShow = true
			},
			goDadetail(){
				if(this.detail.skill_arr.length && this.detail.skill.opening == 1){

						uni.navigateTo({
							url:'/pages/index/detail?type=6&id='+this.detail.skill.id+'&community_id='+this.detail.community_id
						})
			
						
				}else{
					if(this.detail.community_id == uni.getStorageSync('community_id')){
						uni.navigateTo({
							url:'/pages/index/detail?type=6&id='+this.detail.skill.id+'&community_id='+this.detail.community_id
						})
					}else{
						uni.showToast({
							icon:'none',
							title:'本达人信息仅限本小区用户可见',
							duration:2000
						})
						return
					}
				}
			},
			goUsed(){
				uni.navigateTo({
					url:'/pages/update/myspare?user_id='+this.detail.user_id+'&type=3&community_id='+this.detail.community_id+'&user_nickname='+this.detail.user_nickname
				})
			},
			submitTodo(e){
				if(uni.getStorageSync('singPage') == 1){
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon:'none',
						duration: 2000,
					})
					return
				}
				if(!e){
					uni.showToast({
						icon:'',
						title:'请输入留言内容'
					})
					return
				}
				var data = {
					to_user_id: this.query.user_id,
					content:e,
					to_community_id: uni.getStorageSync('community_id'),
					from_community_id: uni.getStorageSync('community_id')
				}
				this.Api.userleaveMessage(data).then((result) => {
					if(result.code == 1){
						uni.showToast({
							icon:'success',
							title:result.msg,
							success: () => {
								this.messageText = ''
								this.messageShow = false
							}
						})
					}else{
						uni.showToast({
							icon:'none',
							title:result.msg,
							success: () => {
								
							}
						})
					}
				})
			},
			//is_kown=-1 是自己，is_kown=0 未认识，is_kown > 0 表明已认识
			knowTodo(){
				var data = {
					to_user_id:this.query.user_id,
					to_community_id: this.detail.community_id,
					from_community_id:this.detail.community_id
				}
				if(this.detail.is_kown == 0){
					this.usersetKown(data)
				}else if(this.detail.is_kown > 0){
					this.userunSetKown(data)
				}
			},
			//认识
			usersetKown(data){
				this.Api.usersetKown(data).then((result) => {
					if(result.code == 1){
						uni.showToast({
							icon:'success',
							title:result.msg,
							success: () => {
								this.getOtherUserInfo(this.query)
							}
						})
					}else{
						uni.showToast({
							icon:'none',
							title:result.msg,
							success: () => {
								
							}
						})
					}
				})
			},
			//取消认识
			userunSetKown(data){
				this.Api.userunSetKown(data).then((result) => {
					if(result.code == 1){
						uni.showToast({
							icon:'success',
							title:result.msg,
							success: () => {
								this.getOtherUserInfo(this.query)
							}
						})
					}else{
						uni.showToast({
							icon:'none',
							title:result.msg,
							success: () => {
								
							}
						})
					}
				})
			},
			getOtherUserInfo(data){
				this.Api.getOtherUserInfo(data).then((result)=>{
					if(result.code == 1){
						this.detail = result.data
						var obj = []
						if(result.data.skill.skill_desc){
							obj = result.data.skill.skill_desc.split(",")
							this.detail.skill_arr = obj
						}else{
							this.detail.skill_arr = []
						}

						this.detail.skill_text = obj.join("|")
						if(result.data.is_kown == -1){
							this.know_text = '自己'
						}else if(result.data.is_kown == 0) {
							this.know_text = '认识TA'
						}else if(result.data.is_kown == 1){
							this.know_text = '取消认识'
						}
					}
				})
			},
			reportHandler(){
				uni.navigateTo({
					url:'/pages/update/report?object_id='+this.query.user_id+'&object_type=10'
				})
			}
		},
		components:{
			navigationCustom,
			LeaveWords
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: white!important;
	}
	.personalcard{
		display: flex;
		flex-direction: column;
		background: whtie!important;
		min-height:100vh;
		.pcontent{
			padding:24upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			.userheader{
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-bottom: 16upx;
				.avatarwrap{
					width:115upx;
					height:115upx;
					margin-right:16upx;
					position: relative;
					.heading{
						position: absolute;
						left:0;
						top:0;
						width:100%;
						height:100%;
						border-radius: 50%;
						overflow: hidden;
					}
					.daing{
						position: absolute;
						right:0;
						bottom: 0;
						width:40upx;
						height: 40upx;
					}
				}
				.userinfo{
					display: flex;
					flex-direction: column;
					max-width:calc(100% - 280upx);
					.username{
						height:42upx;
						font-size:30upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(51,51,51,1);
						line-height:42upx;
						flex:1;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.userdes{
						display: flex;
						flex-direction: row;
						align-items: center;
						margin-top:8upx;
						.manico{
							width:40upx;
							height:36upx;
						}
						.u1{
							font-size:24upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(102,102,102,1);
							line-height:34upx;
							margin-right:24upx;
						}
						.u2{
							width:37upx;
							height:32upx;
							background:#08C299;
							border-radius:10upx;
							font-size:20upx;
							font-family:PingFang-SC-Bold,PingFang-SC;
							font-weight:bold;
							color:white;
							line-height:32upx;
							text-align: center;
						}
					}
				}
				.userbtn{
					width: 170upx;
					height: 61upx;
					background: linear-gradient(44deg, #FEAA0E, #FFC000);
					border-radius: 10upx;

					// border:2upx solid rgba(255,156,0,1);

					font-size:26upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:white;
					line-height:61upx;
					text-align: center;
					margin-left:auto;
				}
				.useracitve{
					background:#b9b8b7;
					color:#020433;
				}
			}
			.useritem{
				display: flex;
				flex-direction: row;
				height:106upx;
				line-height: 106upx;
				width:100%;
				align-items: center;
				border-bottom: 1px solid rgba(222, 222, 222, 0.5);
				.peronico{
					width:40upx;
					height:40upx;
					margin-right:12upx;
				}
				.t1{					
					font-size: 34upx;
					color: #020433;
					width:fit-content;
					margin-right:24upx;
					text-align: right;

					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;

				}
				.t2{
					font-size:34upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(51,51,51,1);
					margin-right: 40upx;
				}
				.ti{
					width:40upx;
					height:40upx;
					margin-left: auto;
				}
				.inputjiwrap{
					text-align: center;
					margin-left:auto;
					font-size: 26upx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #404B69;
					width: 170upx;
					height: 61upx;
					line-height: 61upx;
					background: rgba(255, 156, 0, 0);
					border: 1px solid #404B69;
					border-radius: 10upx;
				}
				.avatarwrap{
					display: flex;
					flex-direction: row;
					align-items: center;
					position: relative;
					height: 100%;
					flex:1;
					.avatarw{
						position: absolute;
						left:0;
						top:50%;
						transform: translateY(-50%);
						width:80upx;
						height:80upx;
						border-radius: 50%;
						border:4upx solid white;
					}
				}
			}
			.useritemfix{
				height:118upx;
				line-height: 118upx;
				.imgwrap{
					display: flex;
					flex-direction: row;
					.imgitem{
						width:72upx;
						height:72upx;
						border-radius:8upx;
						margin-right:24upx;
					}
				}
			}
			.lybtn{
				width:702upx;
				height: 100upx;
				background: linear-gradient(44deg, #FEAA0E, #FFC000);
				border-radius: 12upx;
				// box-shadow:0px 8upx 16upx 0px rgba(225,138,0,0.1);
				font-size:38upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(255,255,255,1);
				line-height:100upx;
				text-align: center;
				margin-top:24upx;
			}
			.gbbtn{
				width:702upx;
				height:100upx;
				background:rgba(216,216,216,1);
				// box-shadow:0px 8upx 16upx 0px rgba(51,51,51,0.1);
				border-radius:12upx;
				font-size:38upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:#404B69;
				line-height:100upx;
				text-align: center;
				margin-top:40upx
			}
		}
		.integralwrap{
			display: flex;
			flex-direction: column;
			width: 622upx;
			height: 695upx;
			background: #FFFFFF;
			border-radius: 10upx;
			padding:85upx 20upx 0 20upx;
			box-sizing: border-box;
			align-items: center;
			.headimgico{
				width:123upx;
				height:123upx;
				border-radius: 50%;
			}
			.headename{
				font-size: 34upx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #020433;
				margin-top:20upx;
			}
			.integrinput{
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-top:70upx;
				.label{
					font-size: 36upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #404B69;
				}
				/deep/ .u-input__input,
				/deep/ .u-input{
					width: 320upx;
					height: 92upx;
					background: #F7F9FF;
					border-radius: 10upx;
					line-height: 92upx;
					padding: 0 20upx;
					font-size: 42upx;
					box-sizing: border-box;
					font-family: PingFang SC;
					font-weight: bold;
					color: #FF9C00;
				}
			}
			.btnwrap{
				display:flex;
				flex-direction: row;
				margin-top:104upx;
				.cancel{
					width: 284upx;
					height: 99upx;
					background: #EEF2FA;
					border-radius: 10upx;
					line-height: 99upx;
					font-size: 38upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #404B69;
					text-align: center;
					margin-right:22upx;
				}
				.confirmbtn{
					width: 284upx;
					height: 99upx;
					background: linear-gradient(44deg, #FEAA0E, #FFC000);
					border-radius: 10upx;
					line-height: 99upx;
					font-size: 38upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: white;
					text-align: center;
				}
			}
		}
	}
	.personalcardfix{
		overflow: hidden;
		height: 100vh;
	}
</style>
