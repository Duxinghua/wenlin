<template>
	<!-- 我的小区 -->
	<view class="integral">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<view class="searchlist">
				<view class="searchitem" v-for="(item,index) in list" :key="index" :index="index" @click="goCom(item)">
			<!-- 		<image :src="item.logo" class="headeravater"></image> -->
					<view class="headeravater">
						<u-image :src="item.logo" :height="headerHeight" ></u-image>
					</view>
					<view class="area">
						<text class="t1">{{item.title}}</text>
						<text class="t2">{{item.address}}</text>
					</view>
					<view class="btncancel" @click.stop="setDefault(item)" v-if="list.length > 1 && item.default != 1">设置</view>
				</view>
				<view class="searchitem" @click="add">
					<image src="../../static/addc.png" class="headeravater"></image>
					<view class="area">
						<text class="t1">添加小区</text>
						<text class="t2">最多可添加4个小区</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 小区退出 -->
		<view class="popup" v-if="logoutShow">
			<view class="mb"></view>
			<view class="logout">
				<view class="t1">
					退出后所有信息将无法找回， 确定退出吗？
				</view>
				<view class="t2">
					<text class="s1" @click="confirmBtn">确定</text>
					<text class="s2" @click="logoutCancel">取消</text>
				</view>
			</view>
		</view>
		<!-- 设置默认小区 -->
		<setCommit ref="setcommit"></setCommit>
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	import setCommit from '../../components/setcommit/setcommit.vue'
	export default {
		data() {
			return {
				config: {
					title: '我的小区', //title
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
				cateIndex:1,
				logoutShow:false,
				list:[],
				result:{},
				delcommunity_id:''
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		mounted(){
			
		},
		computed:{
			headerHeight(){
				return 96
			}
		},
		onShow() {
			this.myCommunity()
		},
		methods:{
			goCom(item){
				uni.navigateTo({
					url:'/pages/index/communitycard?community_id='+item.community_id
				})
			},
			customConduct(e){
				console.log(e)
			},
			navClick(obj){
				this.cateIndex = obj.id
			},
			setDefault(obj){
				var _this = this
				uni.showActionSheet({
				    itemList: ['设为默认小区', '退出小区'],
				    success: function (res) {
				        if(res.tapIndex == 0){
							_this.Api.setDefaultCommunity({community_id:obj.community_id}).then((result) => {
								if(result.code == 1){
									uni.showToast({
										icon:'success',
										title:result.msg,
										duration:2000,
										success: () => {
											uni.setStorageSync('community_id',obj.community_id);
											uni.setStorageSync('community_menu',obj.title+'('+obj.total+')');
											uni.setStorageSync('committee_id',obj.committee_id);
											_this.myCommunity()
										}
									})
								}
							})
						}else if(res.tapIndex == 1){
							_this.delcommunity_id = obj.community_id
							_this.logoutShow = true

						}
				    },
				    fail: function (res) {
				       
				    }
				});
			},
			confirmBtn(){
				var all = uni.getStorageSync('all_community')
				var index = ''
				var obj = []
				all.map((item) => {
					if(item.community_id != this.delcommunity_id){
						obj.push(item)
					}
				})
				this.Api.exitCommunity({community_id:this.delcommunity_id}).then((result) => {
					if(result.code == 1){
						uni.showToast({
							icon:'success',
							title:result.msg,
							duration:2000,
							success: () => {
								uni.setStorageSync('all_community',obj)
								this.logoutShow = false
								this.list = []
								this.myCommunity()
							}
						})
					}
					
				})
			},
			getShowControl(){
				this.Api.myCommunity({}).then((result) => {
					console.log(result,'result')
					if(result.code == 1){
						if(result.data.length > 1){
							var obj = result.data
							obj.map((item)=>{
								console.log(item)
								item.logo = item.logo ? item.logo : this.Config.minUrl + 'logovi.jpg'
							})
							this.list = obj
							this.$refs.list = result.data
							this.$refs.setcommit.show()
						}else{
							var obj = result.data[0]
							uni.setStorageSync('community_id',obj.community_id)
							uni.setStorageSync('committee_id',obj.committee_id)
						}
					}
				})
				
			},
			logoutCancel(){
				this.logoutShow = false
			},
			add(){
				var maxJoin = uni.getStorageSync('maxJoin')
				if(maxJoin <= this.list.length){
					uni.showToast({
						title:'您最多只能加入'+maxJoin+'个小区',
						icon:'none',
						duration:2000
					})
					return
				}else{
					uni.navigateTo({
						url:'/pages/update/setcommunity'
					})
				}
		
			},
			myCommunity(){
				this.Api.myCommunity({}).then((result) => {
					if(result.code == 1){
						var obj = result.data
						obj.map((item)=>{
							console.log(item)
							item.logo = item.logo ? item.logo : this.Config.minUrl  +  'logovi.jpg'
						})
						this.list = obj
					}
				})
			}
		},
		components: {
			navigationCustom,
			setCommit
		}
	};
</script>

<style lang="scss" scoped>
	.integral{
		display: flex;
		flex-direction: column;
		.content{
			display: flex;
			flex-direction: column;
			padding:24upx 24upx 0 24upx;
			box-sizing: border-box;
			.searchlist{
				display: flex;
				flex-direction: column;
				.searchitem:first-child{
					margin-top:20upx;
				}
				.searchitem{
					height:160upx;
					border-bottom: 1upx solid rgba(222,222,222,0.6);
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					.headeravater{
						width:96upx;
						height:96upx;
						border-radius: 50%;
						margin-right:16upx;
						overflow: hidden;
					}
					.area{
						display: flex;
						flex:1;
						flex-direction: column;
						align-items: flex-start;
						.t1{
							font-size:30upx;
							font-family:PingFang-SC-Bold,PingFang-SC;
							font-weight:bold;
							color:rgba(51,51,51,1);
							line-height:42upx;
							text-align: center;
						}
						.t2{
							font-size:24upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(102,102,102,1);
							line-height:34upx;
						}
					}
					.btncancel{
						margin-left:auto;
						width:92upx;
						height:56upx;
						border-radius:8upx;
						background: #FF9C00;
						color:white;
						font-size:26upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						line-height: 56upx;
						text-align: center;
					}
				}
			}
		}
		.popup {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 3000;
			.mb {
				position: fixed;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: 3001;
				background: rgba(0, 0, 0, 0.3);
			}
			.logout {
				position: fixed;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				width: 580upx;
				height: 320upx;
				background: rgba(255, 255, 255, 1);
				border-radius: 16upx;
				z-index: 3002;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.t1{
					font-size:36upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(51,51,51,1);
					line-height:50upx;
					padding:46upx 38upx 0 38upx;
					text-align: center;
				}
				.t2{
					height:126upx;
					display: flex;
					flex-direction: row;
					border-top:1px solid rgba(222,222,222,0.6);
					.s1,.s2{
						width:50%;
						height:126upx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size:32upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(51,51,51,1);
					}
					.s1{
						border-right: 1px solid rgba(222,222,222,0.6);;
					}
					.s2{
						color:#FF9C00;
					}
				}
			}
		}
				
	}
</style>
