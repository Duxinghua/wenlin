<template>
	<!-- 添加小区 -->
	<view class="integral">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<view class="search"  :style="[{top:CustomBar + 'px'}]">
				<view class="searchwrap">
					<image src="../../static/search.png" class="searchico" mode=""></image>
					<input class="searchinput" v-model="searchValue"  placeholder-class="collectsearch" placeholder="请输入您的小区全称" @input="searchInput"/>
					<image src="../../static/searchdel.png" class="searcchdel" v-if="searchFlag" @click="searchClear"></image>
				</view>
				<text @click="search">搜索</text>
			</view>
			<view class="searchlist">
				<view class="searchitem" v-for="(item,index) in list" :key="index" :index="index" @click="selHandler(item)">
					<text class="t1">{{item.title}}</text>
					<text class="t2">{{item.address}}</text>
				</view>
				<Nodata v-if="noDataFlag" :text.sync="tips"></Nodata>
 				<view class="searchresult" v-if="opencommunity" @click="createCommuntiy">
					<text class="s1">没有自己的小区，您可以立即</text>
					<text class="s2">申请开通</text>
				</view>
			</view>
		</view>
		<!-- 个人信息 -->
		<view class="popup" v-if="setcommunity">
			<view class="mb" @click="setcommunityClose"></view>
			<view class="openarea openinfomation">
				<view class="openheader">
					<text>填写个人信息</text>
					<image src="../../static/close.png" class="opencolse"  @click="setcommunityClose"/>
				</view>
				<view class="openitem">
					<text class="opentitle">小区全称</text>
					<input type="opentxt" disabled="true" placeholder="请选择小区" v-model="community"/>
					<!-- <image src="../../static/adico.png" class="adico" @click="getMap" /> -->
				</view>
				<view class="openitem">
					<text class="opentitle">楼栋号</text>
					<input type="opentxt" placeholder="请输入楼栋号,仅限数字、字母" v-model="building" @input="buildingInput" />
				</view>
				<view class="openitem">
					<text class="opentitle">单元号</text>
					<input type="opentxt" placeholder="请输入单元号,仅限数字、字母" v-model="unit" @input="unitInput" />
				</view>
				<view class="openitem">
					<text class="opentitle">门牌号</text>
					<input type="opentxt" placeholder="请输入门牌号,仅限数字、字母" v-model="room" @input="roomInput" />
				</view>
				<view class="openitem">
					<text class="opentitle">身份</text>
					<input type="opentxt" placeholder="业主"  v-model="setcommunityValue" :disabled="true" @click="openPicker"/>
					<image src="../../static/down.png" class="opendown" @click="openPicker" />
				</view>
				<view class="openinfo">以上信息仅用于核实小区邻居真实身份，请放心填写，点击进入小区即代表同意。<text class="rcolor" @click="gosecret"> {{textread}}</text></view>
				<view class="openbutton" hover-class="hover-openbutton" @click="setcommunityHandler">立即申请</view>
			</view>
		</view>
		<!-- 选择业主身份 -->
		<view class="popup" v-if="pickerId">
			<view class="mb" @click="closePicker"></view>
			<view class="openarea chooseid">
				<view class="openheader">
					<text>选择业主身份</text>
					<image src="../../static/close.png" class="opencolse" @click="closePicker"/>
				</view>
				<picker-view  :value="pickerValue" @change="pickerChange" class="pickerview">
					<picker-view-column>
						<view class="item" v-for="(item,index) in picker" :key="index">{{item.label}}</view>
					</picker-view-column>
				</picker-view>
			
				<view class="openbutton" hover-class="hover-openbutton" @click="pickerClick">确认</view>
			</view>
		</view>
		
		<!-- 开通小区 -->
		<view class="popup" v-if="openCommunity">
			<view class="mb" @click="setClose"></view>
			<view class="openarea">
				<view class="openheader">
					<text>开通小区</text>
					<image src="../../static/close.png" class="opencolse" @click="setClose" />
				</view>
				<view class="openitem">
					<text class="opentitle">小区全称</text>
					<input type="opentxt" placeholder="请输入小区全称" v-model="communityTitle" @input="communityTitleInput" />
				</view>
				<view class="openitem">
					<text class="opentitle">小区地址</text>
					<input type="opentxt" placeholder="请输入详细地址" v-model="communityAddress" @input="communityAddressInput" />
					<image src="../../static/adico.png" class="adico"  @click="getAddress"/>
				</view>
				<view class="openitem">
					<text class="opentitle">手机号</text>
					<input type="opentxt" v-model="mobile" disabled="true" placeholder="请授权" />
					<button class="openmobile" plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">一键授权</button>
				</view>
				<view class="openbutton" hover-class="hover-openbutton" @click="openCommunityHandler">立即申请</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import Nodata from '@/components/nodata/nodata.vue';
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				config: {
					title: '设置小区', //title
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
				searchFlag:false,
				searchValue:'',
				list:[],
				opencommunity:false,
			    setcommunity: false, 
				setcommunityObj:{},
				community:'',
				building:'',
				unit:1,
				room:'',
				pickerId:false,
				picker: [{
					value:1,
					label:'业主'},
					{
					value:2,
					label:'亲友'
					},
					{
					value:3,
					label:'租客'
					}
				],
				pickerValue:0,
				selectIndex: 1,
				setcommunityType:1,
				setcommunityValue:'业主',
				textread: `《问邻服务协议及隐私政策》`,
				openCommunity:false,
				mobile:'',
				communityAddress:'',
				communityTitle:'',
				CustomBar: this.CustomBar,
				noDataFlag:false,
				tips:'附近暂无小区，可以开通您所在的小区'
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		mounted() {
			this.mobile = uni.getStorageSync('mobile')
			this.getList()
		},
		methods:{
			getList(){
				var p = new Promise((resolve, reject) => {
					if (!uni.getStorageSync('longitude')) {
						uni.getLocation({
							success: res => {
								// latitude: 30.39085
								// longitude: 114.89495
								uni.setStorageSync('latitude', res.latitude);
								uni.setStorageSync('longitude', res.longitude);
							},
							fail: err => {
								console.log(err);
								uni.showToast({
									title: '您未开通地图授权，请输入地址',
									icon:'none',
									duration: 2000
								});
							}
						});
						
					}
					resolve();
				})
				p.then((data)=>{
					var that = this;
					if (uni.getStorageSync('longitude')) {
						that.Api.getNearCommunity({latitude:uni.getStorageSync('latitude'),longitude:uni.getStorageSync('longitude')}).then((result) => {
							if(result.code == 1){
								that.list = result.data;
								this.opencommunity = true
								if(that.list.length){
									that.noDataFlag = false
								}else{
									that.noDataFlag = true
								}
								this.tips = '附近暂无小区，可以开通您所在的小区'
							}
						})
				
					}
				})
		
			},
			communityTitleInput(e){
				
			},
			createCommuntiy(){
				uni.navigateTo({
					url:'../update/openingcommunity'
				})
				//this.openCommunity = true
			},
			setClose(){
				this.openCommunity = false
			},
			// 手机号授权处理
			getPhoneNumber(e) {
				console.log(e);
				var { encryptedData, iv } = e.detail;
			
				this.Api.setUserPhoneBySecret({ encrypted_data: encryptedData, iv: iv }).then(result => {
					if (result.code == 1) {
						this.mobile = result.data
						uni.setStorageSync('mobile', result.data);
					}
				});
			},
			//开通小区获取地址
			getAddress(){
				var p = new Promise((resolve, reject) => {
					if (!uni.getStorageSync('longitude')) {
						uni.getLocation({
							success: res => {
								// latitude: 30.39085
								// longitude: 114.89495
								uni.setStorageSync('latitude', res.latitude);
								uni.setStorageSync('longitude', res.longitude);
							},
							fail: err => {
								console.log(err);
							}
						});
						
					}
					resolve();
				})
				p.then((data)=>{
					var that = this;
					if (uni.getStorageSync('longitude')) {
						uni.chooseLocation({
							latitude: uni.getStorageSync('latitude'),
							longitude: uni.getStorageSync('longitude'),
							success: res => {
								this.communityAddress = res.address
							}
						});
					} else {
						uni.showToast({
							title: '您未开通地图授权，请输入地址',
							duration: 2000
						});
					}
				})
			},
			communityAddressInput(e){
				this.communityAddress = e.detail.value
			},
			openCommunityHandler(){
				if(!this.communityTitle){
					uni.showToast({
						title: '请输入小区名',
						icon:'none',
						duration: 2000
					});
					return
				}
				if(!this.communityAddress){
					uni.showToast({
						title: '请输入小区地址',
						duration: 2000
					});
					return
				}
				if(!this.mobile){
					uni.showToast({
						title: '请输入手机号',
						duration: 2000
					});
					return
				}
				this.Api.communityOpening({title:this.communityTitle,address:this.communityAddress,contact_phone:this.mobile}).then((result) => {
					if(result.code == 1){
						uni.showToast({
							title: result.msg,
							duration: 2000,
							success: () => {
								uni.navigateBack({
									delta:1
								})
							}
						});
					}else{
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
					}
				})
			},
			gosecret(){
				uni.navigateTo({
					url:'/pages/update/secret'
				})
			},
			//选择业主事件
			openPicker(e){
				this.pickerId = true
			},
			closePicker(e){
				this.pickerId = false
			},
			//业主选择
			pickerChange(e){
				var target = e.detail.value[0]
				this.pickerValue = target
			},
			pickerClick(e){
				this.setcommunityType = this.picker[this.pickerValue].value
				this.setcommunityValue = this.picker[this.pickerValue].label
				this.pickerId = false
			},
			selHandler(obj){
				this.setcommunityObj = obj
				this.community = obj.title
				var all = uni.getStorageSync('all_community')
				var flag = false
				all.map((item) => {
					if(item.title == obj.title){

						flag = true
					}
				})
				if(flag){
					uni.showToast({
						title:'您已加入过本小区，不能重复加入',
						icon:'none',
						duration:2000
					})
					return
				}
				var maxJoin = uni.getStorageSync('maxJoin')
				if(maxJoin == all.length){
					uni.showToast({
						title:'您最多只能加入'+maxJoin+'个小区',
						icon:'none',
						duration:2000
					})
					return
				}else{
					this.setcommunity = true
				}
			},
			buildingInput(e) {
				this.building = e.detail.value.replace(/[^a-z|0-9]/gi, '');
			},
			unitInput(e) {
				this.unit = e.detail.value.replace(/[^a-z|0-9]/gi, '');
			},
			roomInput(e) {
				this.room = e.detail.value.replace(/[^a-z|0-9]/gi, '');
			},
			setcommunityClose(e){
				this.setcommunity = false
			},
			customConduct(e){
				console.log(e)
			},
			searchInput(){
				this.searchFlag = true
				this.opencommunity = false
				this.search()
			},
			searchClear(e){
				this.searchValue = ''
				this.list = []
				this.opencommunity = false
				this.searchFlag = false
			},
			search(){
				if(!this.searchValue){
					uni.showToast({
						title:'请输入搜索小区',
						icon:'none',
						duration:2000
					})
					return
				}
				var data = {
					title: this.searchValue
				}
				this.Api.searchCommunity(data).then((result)=>{
					if(result.code == 1){
						this.list = result.data
						this.opencommunity = true
						if(this.list.length){
							this.noDataFlag = false
						}else{
							this.noDataFlag = true
						}
						this.tips = '没有搜索到您要加入的小区'
					}
				})
			},
			//设置小区
			setcommunityHandler() {
				if(!this.building){
					uni.showToast({
						icon:'none',
						title:'请输入楼栋号'
					})
					return
				}
				if(!this.unit){
					uni.showToast({
						icon:'none',
						title:'请输入单元号'
					})
					return
					
				}
				if(!this.room){
					uni.showToast({
						icon:'none',
						title:'请输入门牌号'
					})
					return
				}
				var data = {
					building: this.building,
					unit: this.unit,
					community_id: this.setcommunityObj.community_id,
					room: this.room,
					type: this.setcommunityType
				};
				var all = uni.getStorageSync('all_community')
				var obj = {"community_id":data.community_id,"title":this.community,"committee_id":0,"total":0}
				all.push(obj)
				this.Api.setUserCommunityInfo(data).then(result => {
					if (result.code == 1) {
						uni.setStorageSync('all_community',all)
						uni.showToast({
							title: result.msg,
							duration: 2000,
							success: () => {
								uni.navigateBack({
									delta:1
								})
							}
						});
					}
				});
			}
		},
		components: {
			navigationCustom,
			Nodata
		}
	};
</script>

<style lang="scss" scoped>
	.integral{
		display: flex;
		flex-direction: column;
		padding-bottom: 100upx;
		.content{
			display: flex;
			flex-direction: column;
			padding:24upx 24upx 0 24upx;
			box-sizing: border-box;
			.search{
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				position: fixed;
				left:0;
				top:0;
				width:100%;
				padding:24upx;
				background: white;
				z-index: 1000;
				.searchwrap{
					display: flex;
					align-items: center;
					position: relative;
					line-height: 64upx;
					width:626upx;
					height:64upx;
					background:rgba(222,222,222,0.3);
					border-radius:32upx;
					padding-left:24upx;
					padding-right:24upx;
					box-sizing: border-box;
					.searchico{
						width:44upx;
						height:44upx;
					}
					.searchinput{
						width:480upx;
					}
					.searcchdel{
						width: 40rpx;
						height: 40rpx;
						margin-left:auto;
					}
				}
			}
			.searchlist{
				display: flex;
				flex-direction: column;
				margin-top: 54upx;
				/deep/ .nodata{
					top:450upx;
				}
				.searchresult{
					padding-top:24upx;
					font-weight: bold;
					font-size: 28upx;
					display: inline-flex;
					align-items: center;
					position: fixed;
					left:0;
					bottom: 0;
					width:100%;
					height:120upx;
					padding:0 28upx;
					box-sizing: border-box;
					background: white;
					box-shadow: 0rpx 12rpx 20rpx 0rpx rgba(0, 0, 0, 0.4);
					.s2{
						display: flex;
						width:142upx;
						height:56upx;
						text-align: center;
						justify-content: center;
						line-height: 56upx;
						background:rgba(255,156,0,1);
						border-radius:8upx;
						font-size: 28upx;
						color:white;
						margin-left:30upx;
						text-align: center;
					}
				}
				.searchitem:first-child{
					margin-top:20upx;
				}
				.searchitem::after{
					content:'';
					width:12upx;
					height:12upx;
					border-radius: 50%;
					position: absolute;
					top:50%;
					left:0;
					transform: translateY(-50%);
					background:rgba(153,153,153,0.6);
				}
				.searchitem{
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: flex-start;
					height:146upx;
					padding-left:32upx;
					border-bottom: 1upx solid #DEDEDE;
					position: relative;
					.t1{
						height:40upx;
						font-size:28upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:#FF9C00;
						line-height:40upx;
						display: flex;
						flex-direction: row;
						.s2{
							margin-right:10upx;
							color:#333333;
						}
					}
					.t2{
						height:34upx;
						font-size:24upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:#999999;
						line-height:34upx;
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
			z-index: 2000;
			.mb {
				position: fixed;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: 2001;
				background: rgba(0, 0, 0, 0.6);
			}
		// 开通小区
			.openarea {
				position: absolute;
				left: 0;
				bottom: 0;
				z-index: 3009;
				width: 100%;
				height: 652upx;
				background: rgba(255, 255, 255, 1);
				border-radius: 16upx 16upx 0upx 0upx;
				display: flex;
				flex-direction: column;
				padding-left: 48upx;
				padding-right: 48upx;
				box-sizing: border-box;
				.openheader {
					height: 100upx;
					line-height: 100upx;
					font-size: 32upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
					display: flex;
					align-items: center;
					text {
						flex: 1;
						display: flex;
						justify-content: center;
					}
					.opencolse {
						width: 31upx;
						height: 31upx;
					}
					.selectback{
						position: absolute;
						left:48upx;
						top:50upx;
						margin-top:-16upx;
						width:23upx;
						height:32upx;
					}
				}
				.openitem {
					display: flex;
					flex-direction: row;
					align-items: center;
					position: relative;
					height: 90upx;
					border-bottom: 2upx solid rgba(222, 222, 222, 0.3);
					.opentitle {
						width: 120upx;
						font-size: 30upx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						font-weight: bold;
						color: rgba(51, 51, 51, 1);
						margin-right: 30upx;
						text-align: right;
					}
					.opentxt {
						width: calc(100% - 72upx - 150upx);
						font-size: 26upx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: rgba(153, 153, 153, 0.5);
						// display: flex;
						// justify-content: flex-end;
					}
					.opendown {
						width: 30upx;
						height: 20upx;
						margin-left: auto;
					}
					input {
						width: calc(100% - 72upx - 150upx);
					}
					.adico {
						width: 32upx;
						height: 42upx;
						display: flex;
						margin-left: auto;
					}
					.openmobile {
						width: 136upx;
						height: 56upx;
						background: rgba(255, 156, 0, 1);
						border-radius: 8upx;
						border: none;
						font-size: 26upx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						font-weight: bold;
						color: rgba(255, 255, 255, 1);
						line-height: 56upx;
						text-align: center;
						padding: 0;
					}
				}
				// 说明
				.openinfo {
					width: 100%;
					font-size: 22upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
					line-height: 32upx;
					margin-top: 20upx;
					.rcolor{color:#FF9C00;}
				}
				.openbutton {
					width: 100%;
					height: 80upx;
					background: #ff9c00;
					border-radius: 8upx;
					font-size: 34upx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: rgba(255, 255, 255, 1);
					line-height: 80upx;
					text-align: center;
					margin-top: 64upx;
				}
				.hover-openbutton {
					background: rgba(255, 156, 0, 0.5) !important;
				}
			}
			.openinfomation{
				height:916upx;
			}
			//选择业主
			.chooseid{
				height:500upx;
				.pickerview{
					width:100%;
					height:200upx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					.item{
						width: 100%;
						font-size: 34upx;
						text-align: center;
					}
				}
			}
			
		}
	}
</style>
