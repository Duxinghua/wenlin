<template>
			<view class="openarea openinfomation">
				<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
				<view class="contents">
					<view class="openitem" @click.stop="openNear">
						<text class="opentitle">小区全称:</text>
						<input type="opentxt"  placeholder="请选择小区" v-model="params.title" @input="communityInput" />
						<!-- <image src="../../static/adico.png" class="adico"  /> -->
					</view>
					<view class="openitem" @click="getArea">
						<text class="opentitle">省市区:</text>
						<input type="opentxt" disabled="true" placeholder="请选择省市区" v-model="areaValue"  />
						<!-- <image src="../../static/adico.png" class="adico"  /> -->
					</view>
					<view class="openitem">
						<input type="opentxt"  placeholder="请选择或输入小区详细地址" v-model="params.address"  @input="addressInput"  />
						<view class="selectlocation" @click="getGPS">
							快速定位
						</view>
					</view>
					<view class="openitem" >
						<text class="opentitle">手机号:</text>
						<input type="opentxt"  placeholder="一键授权获取手机号" v-model="params.contact_phone"  @input="mobileInput"  />
						<button class="selectlocation" plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">一键授权</button>
					</view>
					<view class="openitem">
						<text class="opentitle">楼栋号:</text>
						<input type="opentxt" placeholder="请输入楼栋号,仅限数字、字母" v-model="params.building" @input="buildingInput" />
					</view>
					<view class="openitem">
						<text class="opentitle">单元号:</text>
						<input type="opentxt" placeholder="请输入单元号,仅限数字、字母" v-model="params.unit" @input="unitInput" />
					</view>
					<view class="openitem">
						<text class="opentitle">门牌号:</text>
						<input type="opentxt" placeholder="请输入门牌号,仅限数字、字母" v-model="params.room" @input="roomInput" />
					</view>
					<view class="openitem">
						<text class="opentitle">身份:</text>
						<input type="opentxt" placeholder="业主"  v-model="setcommunityValue" :disabled="true" @click="openPicker"/>
						<image src="../../static/down.png" class="opendown" @click="openPicker"/>
					</view>
					<view class="openitem">
						<text class="opentitle">小区图片:</text>
						<text class="opendes">请上传带小区名称的图片 （推荐小区正门）</text>
						<!-- <image src="../../static/resizeApi@2x.png" class="uploadico"></image> -->
					</view>
					<view class="imgwrap">
						<view class="imgitem"  v-for="(item,index) in uploadList" :key="index"  v-if="uploadList.length">
							<image src="../../static/imguploaddel.png" class="uploadclose" @click="uploadDel(index)" />
							<image :src="item.http_url"></image>
						</view>
						
						<view class="imgupload"  @click="chooseImage" v-if="uploadList.length<9">
							<image src="../../static/uploadico.png" class="imgjia"></image>
						</view>
					</view>
					<view class="openinfo">以上信息仅用于核实小区邻居真实身份，请放心填写，点击进入小区即代表同意<text class="rcolor" @click="gosecret"> {{textread}}</text> 。</view>
					<view :class="['graybtn',subFlag ? 'openbutton' : '']" hover-class="hover-openbutton" @click="setcommunityHandler">申请开通</view>
				</view>
				<!-- 选择业主身份 -->
					<u-popup mode="bottom" border-radius="60" v-model="pickerId">
				
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
<!-- 					<u-picker mode="region" @confirm="confirmHandler" confirm-color="#ff9c00" v-model="areaShow" :area-code='["13", "1303", "130304"]'></u-picker>
 -->					<!-- 推荐 -->
					<u-popup mode="bottom" border-radius="60" v-model="recommend">
						<view class="relist">
							<view class="reheader">附近的小区</view>
							<view class="reconlist">
								<view class="reconitem" v-for="(item,index) in recommendList" :key="index" :index="index">
									<view class="reconleft">
										<image src="../../static/itemico.png" class="reicoimg"></image>
										<view class="recontentlis">
											<view class="title">{{item.title}}</view>
											<view class="address">{{item.address}}</view>
										</view>
									</view>
									<view class="reconright" @click.stop="joinHandler(item)">
										立即加入
									</view>
								</view>
							</view>
							<view class="rebtn"  @click.stop="goback">
								返回继续申请
							</view>
						</view>
					</u-popup>
					<u-popup mode="bottom" border-radius="60" v-model="areaShow">
						<view class="toolbar">
							<view class="cancel" @click="areaShow = false">
								取消
							</view>
							<view class="confirm" @click="confirmadd">
								确定
							</view>
						</view>
					<van-area
					@change="changeHandler"
					  :area-list="areaList"
					  :columns-placeholder="['请选择', '请选择', '请选择']"
					/>
					</u-popup>
			</view>
			

</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	import areaList from '@/common/area.js'
	export default{
		components:{
			navigationCustom
		},
		data(){
			return{
				showtoolbar:true,
				areaShow:false,
				config: {
					title: '申请开通小区', //title
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
				areaObj:{},
				areaValue:'',
				address:'',
				mobile:'',
				finish:false,
				recommend:false,
				recommendList:[],
				areaList:areaList,
				uploadList:[],
				params:{
					title:'',
					address:'',
					contact_phone:'',
					province:'',
					city:'',
					area:'',
					building:'',
					unit:'',
					room:'',
					type:'',
					images:''
				},
				subFlag:false
			}
				
		},
		onLoad() {
			console.log(areaList)
			console.log('aaa')
		},
		onShow() {
			console.log('bbb')
		},
		watch:{
			params:{
				 handler:function(data){
					 var count = 0
					 var keys = Object.keys(data).length
					 Object.values(data).map((item,index)=>{
						// if(index != keys -1){
							if(item){
								count++
							}
						//}
					 })
					 if(count == keys){
						 this.subFlag = true
					 }else{
						 this.subFlag = false
					 }
				 },
				 deep:true
			}
		},
		methods:{
			joinHandler(item){
				uni.navigateTo({
					url:'personal?data='+encodeURIComponent(JSON.stringify(item))
				})
			},
			goback(){
				this.recommend = false
			},
			getGPS(){
				var that = this
				wx.getLocation({
				 type: 'wgs84',
				 isHighAccuracy:true,
					 success (res) {
					   const latitude = res.latitude
					   const longitude = res.longitude
						wx.chooseLocation({
							latitude,
							longitude,
							success:(res)=>{
							console.log(res,'res')	
								that.params.address = res.address
							}
						})
					}
				})
				
			},
			confirmadd(){
				if(this.areaObj[0].name && this.areaObj[1].name && this.areaObj[2].name){
					this.areaValue = this.areaObj[0].name+this.areaObj[1].name+this.areaObj[2].name
					this.params.province = this.areaObj[0].code
					this.params.city = this.areaObj[1].code
					this.params.area = this.areaObj[2].code
					this.areaShow = false
					
				}else{
					return this.$u.toast('请选择省市区')
				}
			},
			changeHandler(e){
				this.areaObj = e.detail.values
			},
			confirmHandler(e){
				this.areaObj = e
				this.areaValue = e.province.label+'/'+e.city.label+'/'+e.area.label
				console.log(this.areaValue)
				this.areaShow = false
			},
			// 手机号授权处理
			getPhoneNumber(e) {
				console.log(e);
				var { encryptedData, iv } = e.detail;
			
				this.Api.setUserPhoneBySecret({ encrypted_data: encryptedData, iv: iv }).then(result => {
					if (result.code == 1) {
						this.params.contact_phone = result.data
						uni.setStorageSync('mobile', result.data);
					}
				});
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			mobileInput(e){
				this.params.contact_phone = e.detail.value
			},
			addressInput(e){
				this.params.address = e.detail.value
			},
			openNear(){
				var data = {
					longitude:uni.getStorageSync('longitude'),
					latitude:uni.getStorageSync('latitude')
				}
				this.Api.getNearCommunity(data).then((result)=>{
					if(result.code == 1){
						if(result.data.length){
							this.recommend = true
							this.recommendList = result.data
						}
					}
				})
				
			},
			//小区处理
			communityInput(e) {
				this.params.title = e.detail.value;
				if(this.params.title.length == 0){
					return
				}else{
					this.Api.searchCommunity({title:this.params.title}).then((result)=>{
						if(result.code == 1){
							 if(result.data.length){
								 this.recommend = true
								 this.recommendList = result.data
							 }
						}
					})
				}
			},
			//楼栋处理 // replace(/[^\w\.\/]/ig,''
			buildingInput(e) {
				this.$nextTick(()=>{
					var target = e.detail.value.replace(/[^a-z|0-9]/gi, '')
					this.building = target
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
					url:'/pages/update/secret'
				})
			},
			getArea(){
				this.areaShow = true
			},
			//设置小区
			setcommunityHandler() {
				if(!this.subFlag){
					return this.$u.toast('请认真填写资料')
				}
				var that = this
				this.Api.communityOpening(this.params).then(result => {
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
									var url = uni.getStorageSync('url')
									if(url){
										uni.reLaunch({
										  url: url,
										  success() {
										  	uni.removeStorageSync('url')
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
				this.params.type = this.picker[this.pickerValue].value
				this.setcommunityValue = this.picker[this.pickerValue].label
				this.pickerId = false
			},
			chooseImage(){
				var that = this
				uni.chooseImage({
						count: 9 - this.uploadList.length, // 默认9
						sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
						success: function(res) {
							// 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
							// goods.localIds = res.localIds
							// _this.asyncUploadImage(goodsindex)
							var s = res.tempFilePaths
							s.map((item)=>{
								that.Api.uploadOne(item).then((result)=>{
									if(result.code == 1){
										console.log(result.data)
										that.uploadList.push(result.data)
										var images = []
										that.uploadList.map((item)=>{
											images.push(item.url)
										})
										that.params.images = images.join(',')
									}
								})
							})
						}
					})
			},
			//图片处理
			uploadDel(e){
				var that = this
				this.uploadList.splice(e,1)
				var images = []
				that.uploadList.map((item)=>{
					images.push(item.url)
				})
				that.params.images = images.join(',')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.imgwrap{
		display: flex;
		flex-direction: row;
		flex-wrap:wrap;
		.imgitem{
			width:191upx;
			height:153upx;
			position: relative;
			z-index: 1;
			margin-right:16upx;
			margin-bottom: 16upx;
			image{
				width:100%;
				height:100%;
				position: absolute;
				left:0;
				top:0;
				z-index: 2;
			}
			.uploadclose{
				position: absolute;
				left:151upx;
				top:0;
				width:40upx;
				z-index: 3;
				height:40upx;
			}
		}
		.imgupload{
			width:191upx;
			height:153upx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #DEDEDE;
			border-radius: 7upx;
			position: relative;
			.imgjia{
				position: absolute;
				left:0;
				top:0;
				width:100%;
				height:100%;
			}
		}
	}
	.openarea {
		width: 100%;
		min-height: 100vh;
		background: rgba(255, 255, 255, 1);
		border-radius: 16upx 16upx 0upx 0upx;
		display: flex;
		flex-direction: column;
		.toolbar{
			display: flex;
			flex-direction: row;
			align-items: center;
			height:100rpx;
			background: white;
			width:100%;
			padding:0 40rpx;
			box-sizing: border-box;
			font-size: 34rpx;
			.cancel{
				margin-right: auto;
				color:#666666;
			}
			.confirm{
				color: #FEAA0E;
			}
			
		}
		.contents{
			padding:0 40upx 100upx 40upx;
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

			.selectlocation{
				width: 170upx;
				height: 61upx;
				background: linear-gradient(44deg, #FEAA0E, #FFC000);
				border-radius: 10upx;
				line-height: 61upx;
				text-align: center;
				font-size: 26upx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				position: absolute;
				right:0;
				top:50%;
				transform: translateY(-50%);
				border:none!important;
				z-index: 3000;

			}
			.uploadico{
				width:92upx;
				height:62upx;
				margin-left:auto;
			}
			.opentitle {
				width: 165upx;
				font-size: 36upx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: #020433;
				margin-right: 30upx;
				text-align: left;
			}
			.opendes{
				flex:1;
				line-height: 36upx;
				font-size: 28upx;
				font-family: PingFang SC;
				color: #95A0B6;
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
		.graybtn{
			width: 100%;
			height: 100upx;
			background: #B9B8B7;
			border-radius: 12px;
			font-size: 38upx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: rgba(255, 255, 255, 1);
			line-height: 100upx;
			text-align: center;
			margin-top: 84upx;
			
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
			margin-top: 84upx;
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
			.relist{
				width: 100%;
				height: 881upx;
				background: #FFFFFF;
				border-radius: 60upx;
				display: flex;
				flex-direction: column;
				.reheader{
					line-height: 134upx;
					height: 134upx;
					width:100%;
					font-size: 36upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #020433;
					text-align: center;
				}
				.reconlist{
					height:553upx;
					display: flex;
					flex-direction: column;
					overflow-y: scroll;
					overflow-x:hidden;
					padding:0 30upx;
					box-sizing: border-box;
					.reconitem{
						width:100%;
						box-sizing: border-box;
						padding:30upx 0;
						border-bottom: 2upx solid #F0F0F0;
						display: flex;
						flex-direction: row;
						align-items: center;
						.reconleft{
							flex:1;
							display: flex;
							flex-direction: row;
							align-items: flex-start;
							.reicoimg{
								width:24upx;
								height:24upx;
								margin-top:10upx;
								margin-right:10upx;
							}
							.recontentlis{
								display: flex;
								flex-direction: column;
								.title{
									font-size: 36upx;
									font-family: PingFang SC;
									font-weight: 500;
									color: #020433;
								}
								.address{
									margin-top:27upx;
									font-size: 28upx;
									font-family: PingFang SC;
									font-weight: 500;
									color: #404B69;
								}
							}
						}
						.reconright{
							margin-left:auto;
							text-align: center;
							width: 170upx;
							height: 61upx;
							line-height:61upx;
							font-size: 26upx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #FFFFFF;
							background: linear-gradient(44deg, #FEAA0E, #FFC000);
							border-radius: 10upx;
						}
					}
				}
				.rebtn{
					width: 690upx;
					height: 100upx;
					background: linear-gradient(44deg, #FEAA0E, #FFC000);
					border-radius: 12upx;
					margin:30upx auto 0 auto;
					line-height: 100upx;
					text-align: center;
					font-size: 38upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #FFFFFF;
				}
			}
		
	}
	
	
</style>
