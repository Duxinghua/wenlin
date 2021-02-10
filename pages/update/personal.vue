<template>
			<view class="openarea openinfomation">
				<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
				<view class="contents">
					<view class="openitem" >
						<text class="opentitle">小区全称:</text>
						<input type="opentxt" disabled="true" placeholder="请选择小区" v-model="community" @input="communityInput" />
						<image src="../../static/adico.png" class="adico" style="display: none;" />
					</view>
					<view class="openitem">
						<text class="opentitle">楼栋号:</text>
						<input type="opentxt" placeholder="请输入楼栋号,仅限数字、字母" v-model="building" @input="buildingInput" />
					</view>
					<view class="openitem">
						<text class="opentitle">单元号:</text>
						<input type="opentxt" placeholder="请输入单元号,仅限数字、字母" v-model="unit" @input="unitInput" />
					</view>
					<view class="openitem">
						<text class="opentitle">门牌号:</text>
						<input type="opentxt" placeholder="请输入门牌号,仅限数字、字母" v-model="room" @input="roomInput" />
					</view>
					<view class="openitem">
						<text class="opentitle">身份:</text>
						<input type="opentxt" placeholder="业主"  v-model="setcommunityValue" :disabled="true" @click="openPicker"/>
						<image src="../../static/down.png" class="opendown" @click="openPicker"/>
					</view>
					<view class="openinfo">以上信息仅用于核实小区邻居真实身份，请放心填写，点击进入小区即代表同意<text class="rcolor" @click="gosecret"> {{textread}}</text> 。</view>
					<view class="openbutton" hover-class="hover-openbutton" @click="setcommunityHandler">进入小区</view>
				</view>
				<!-- 选择业主身份 -->
					<u-popup mode="bottom" v-model="pickerId">
				
					<view class="chooseid">
						<view class="openheader">
							<text>选择业主身份</text>
							<image src="../../static/close.png" class="opencolse" @click="closePicker"/>
						</view>
						<picker-view  :value="pickerValue" @change="pickerChange" class="pickerview" indicator-style="height:50px;" >
							<picker-view-column>
								<view class="item" style="line-height:50px" v-for="(item,index) in picker" :key="index">{{item.label}}</view>
							</picker-view-column>
						</picker-view>
					
						<view class="openbutton" hover-class="hover-openbutton" @click="pickerClick">确认</view>
					</view>
					</u-popup>
			</view>
			

</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default{
		components:{
			navigationCustom
		},
		data(){
			return{
				config: {
					title: '输入个人信息', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"#0D1C3F",//文字颜色，默认白色
					type: 1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200,
				community:'',
				building:'',
				unit:'',
				room:'',
				setcommunityValue:'',
				textread: `《问邻服务协议及隐私政策》`,
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
				communityObj:{}
			}
				
		},
		onLoad(options) {
			if(options.data){
				this.communityObj = JSON.parse(decodeURIComponent(options.data))
				this.community = this.communityObj.title
				this.communityId = this.communityObj.community_id
			}
		},
		methods:{
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			//小区处理
			communityInput(e) {
				this.$nextTick(()=>{
					this.community = e.detail.value;
					this.$forceUpdate()
				})
			},
			//楼栋处理 // replace(/[^\w\.\/]/ig,''
			buildingInput(e) {
				this.$nextTick(()=>{
					this.building = e.detail.value.replace(/[^a-z|0-9]/gi, '');
					this.$forceUpdate()
				})
			},
			unitInput(e) {
				this.$nextTick(()=>{
					this.unit = e.detail.value.replace(/[^a-z|0-9]/gi, '');
					this.$forceUpdate()
				})
			},
			roomInput(e) {
				this.$nextTick(()=>{
					this.room = e.detail.value.replace(/[^a-z|0-9]/gi, '');
					this.$forceUpdate()
				})
			},
			gosecret(){
				uni.navigateTo({
					url:'/pages/index/secret'
				})
			},
			//设置小区
			setcommunityHandler() {
				if(!this.communityId){
					uni.showToast({
						title: '请选择小区',
						icon:'none',
						duration: 2000
					});
					return
				}
				if(!this.building){
					uni.showToast({
						title: '请输入楼栋号',
						icon:'none',
						duration: 2000
					});
					return
				}
				if(!this.unit){
					uni.showToast({
						title: '请输入单元号',
						icon:'none',
						duration: 2000
					});
					return
				}
				if(!this.room){
					uni.showToast({
						title: '请输入门牌号',
						icon:'none',
						duration: 2000
					});
					return
				}
				var data = {
					building: this.building,
					unit: this.unit,
					community_id: this.communityId,
					room: this.room,
					type: this.setcommunityType
				};
				var that = this
				this.Api.setUserCommunityInfo(data).then(result => {
					if (result.code == 1) {
						uni.showToast({
							title: result.msg,
							duration: 2000,
							success: () => {
								uni.setStorageSync('committee_id', result.data.committee_id);
								uni.setStorageSync('community_id', result.data.community_id);
								uni.setStorageSync('community_menu',this.communityTitle);
								this.community_menu = this.communityTitle

								//绑定上下级
								var pid = uni.getStorageSync('pid')
			
								if(pid){
									var pdata = {
										from_user_id:pid
									}
									that.Api.inviteNeighbor(pdata).then((result)=>{
				
											uni.reLaunch({
											  url: '/pages/index/index'
											})
										
									})
								}else{
									var url = uni.getStorageSync('paiUrl')
									if(url){
										uni.reLaunch({
											url:url,
											success() {
												uni.removeStorageSync('paiUrl')
											}
										})
									}else{
										uni.reLaunch({
										  url: '/pages/index/index'
										})
									}
									
								}
					
							}
						});
				
					}
				});
			},
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.openarea {
		width: 100%;
		min-height: 100vh;
		background: rgba(255, 255, 255, 1);
		border-radius: 16upx 16upx 0upx 0upx;
		display: flex;
		flex-direction: column;
		.contents{
			padding:0 40upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
		}
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
			height: 117upx;
			border-bottom: 2upx solid rgba(222, 222, 222, 0.3);
			.opentitle {
				width: 165upx;
				font-size: 36upx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: #020433;
				margin-right: 30upx;
				text-align: left;
			}
			.opentxt {
				width: calc(100% - 72upx - 160upx);
				font-size: 30upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: #020433;
				// display: flex;
				// justify-content: flex-end;
			}
			.opendown {
				width: 35upx;
				height: 25upx;
				margin-left: auto;
			}
			input {
				width: calc(100% - 72upx - 160upx);
				font-size: 30upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: #020433;
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
			font-size: 24upx;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: #95A0B6;
			line-height: 32upx;
			margin-top: 20upx;
			.rcolor{
				color: #ff9c00;
			}
		}
		.openbutton {
			width: 100%;
			height: 100upx;
			background: linear-gradient(44deg, #FEAA0E, #FFC000);
			border-radius: 12px;
			font-size: 38upx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: rgba(255, 255, 255, 1);
			line-height: 100upx;
			text-align: center;
			margin-top: 64upx;
		}
		.hover-openbutton {
			background: rgba(255, 156, 0, 0.5) !important;
		}

			//选择业主
			.chooseid{
				height:550upx;
				padding:0 40upx;
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

				// bottom:calc(100rpx + env(safe-area-inset-bottom) / 2);
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
	
	
</style>
