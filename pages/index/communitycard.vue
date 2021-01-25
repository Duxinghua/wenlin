<template>
	<!-- 小区名片 -->
	<view class="personalcard">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="pcontent">
			<view class="userheader" @click="goHome">
				<view class="avatarwrap">
				<!-- 	<image :src="detail.logo" class="heading"></image> -->
					<u-image :src="detail.logo" :height="headerHeight" ></u-image>
<!-- 					<image src="../../static/da.png" class="daing"></image> -->
				</view>
				<view class="userinfwrap">
					<view class="userinfo">
						<view class="username">{{detail.title}}小区
							<text class="userdes">
								{{detail.create_time | formatTimeYMD}}被{{detail.create_user}}创建
							</text>
						</view>
					</view>
					<view class="address">
						{{detail.address}}
					</view>
				</view>
			</view>
			<view class="darenwrap">
				<image src="../../static/heading.png" class="avatarico" v-for="(item,index) in 11" :key="index" :index="index"></image>
				<view class="avatarico avatarwt">
					更多
				</view>
			</view>
			<view class="itemwrap">
				<view class="labelitem">
					<view class="labelnum">
						{{detail.count_user}}
					</view>
					<view class="labeltext">
						邻居
					</view>
				</view>
				<view class="labelitem">
					<view class="labelnum">
						{{detail.count_dynamics}}
					</view>
					<view class="labeltext">
						发贴
					</view>
				</view>
				<view class="labelitem">
					<view class="labelnum">
						9k
					</view>
					<view class="labeltext">
						社区公益
					</view>
				</view>
			</view>
			<view class="swiper-wrap">
				
						<view class="swiperimg" v-for="(item,index) in detail.images" :key="index" :index="index">
							<u-image :src="item" :height="sheaderHeight"  mode="aspectFill"></u-image>
						</view>
			
			</view>
<!-- 			<view class="useritem">
				<text class='t1'>创建人</text>
				<text class="t2">{{detail.create_user}}</text>
			</view> -->
	<!-- 		<view class="useritem">
				<text class='t1'>邻居</text>
				<text class="t2">{{detail.count_user}}</text>
			</view> -->
	<!-- 		<view class="useritem">
				<text class='t1'>发贴</text>
				<text class="t2">{{detail.count_dynamics}}</text>
			</view> -->
<!-- 			<view class="useritem">
				<text class='t1'>积分</text>
				<text class="t2"></text>
			</view> -->
	<!-- 		<view class="useritem" @click="getmaps">
				<text class='t1'>地址</text>
				<view class="t2">{{detail.address}}</view>
				<image class="ti" src="../../static/cardmore.png"></image>
			</view> -->

			<view class="lybtn" @click="goJoin">
				{{detail.is_join == 1 ? '邀请邻居' :'加入小区'}}
			</view>
			<!-- 留言组件 -->
<!-- 			<view class="popup" >
				<view class="mb" ></view>
				<view class="message">
					<view class="openheader">
						<text>留言</text>
						<image src="../../static/close.png" class="opencolse" @click="closePicker"/>
					</view>
					<view class="textwrap">
						<view class="tip">
							<text class="t1">0</text>
							<text class="t2">/200</text>
						</view>
						<textarea class="textarea" placeholder="想对TA说点什么，不超过200字"></textarea>
					</view>
					<view hover-class="hoverclass">提交</view>
				</view>
			</view> -->
		</view>
		<!-- 分享 -->
<!-- 		<hchPoster ref="hchPoster" :canvasFlag.sync="canvasFlag" @cancel="canvasCancel" :posterObj.sync="posterData"/>
 -->	
		<hchPoster ref="hchPoster" @cancel="canvasCancel" :simpleFlag="simpleFlag" :posterBgFlag="false" :canvasAttr.sync="posterData" />
		
		<view :hidden="canvasFlag"><!-- 海报 要放外面放组件里面 会找不到 canvas-->
			<canvas class="canvas"  canvas-id="myCanvas" ></canvas><!-- 海报 -->
		</view>
		
		<!-- 选择小区 -->
		<view class="popup" style="display: none;">
			<view class="mb"></view>
			<view class="openarea choosearea"></view>
		</view>
		<!-- 个人信息 -->
		<view class="popup" v-if="setcommunity">
			<view class="mb" @click="setcommunityClose"></view>
			<view class="openarea openinfomation">
				<view class="openheader">
					<text>填写个人信息</text>
					<image src="../../static/close.png" class="opencolse"  @click="setcommunityClose"/>
				</view>
				<!-- @click="getMap" -->
				<view class="openitem" >
					<text class="opentitle">小区全称</text>
					<input type="opentxt" disabled="true" placeholder="请选择小区" v-model="community" @input="communityInput" />
				<!-- 	<image src="../../static/adico.png" class="adico"  /> -->
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
					<image src="../../static/down.png" class="opendown" @click="openPicker"/>
				</view>
				<view class="openinfo">以上信息仅用于核实小区邻居真实身份，请放心填写，点击进入小区即代表同意<text class="rcolor" @click="gosecret"> {{textread}}</text> 。</view>
				<view class="openbutton" hover-class="hover-openbutton" @click="setcommunityHandler">进入小区</view>
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
				<picker-view  :value="pickerValue" @change="pickerChange" class="pickerview" indicator-style="height:50px;" >
					<picker-view-column>
						<view class="item" style="line-height:50px" v-for="(item,index) in picker" :key="index">{{item.label}}</view>
					</picker-view-column>
				</picker-view>
			
				<view class="openbutton" hover-class="hover-openbutton" @click="pickerClick">确认</view>
			</view>
		</view>
		<!-- 分享功能 -->
		<Onshare  :isShow="onShareShow" :isHome="true" @close="onShowclose" @onsend="onsend" @ontodo="onShowtodo" @onshare="onShowshare" />
		<Firend ref="Firend" />
	</view>
</template>

<script>
	import Onshare from '@/components/onshare/onshare.vue';
	import Firend from '../../components/onfirend/onfirend.vue';
	import hchPoster from '../../wxcomponent/hch-poster/hch-poster.vue';
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data () {
			return {
				config: {
					title: '小区名片', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type: 1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: true, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
				detail:{},
				community_id:'',
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				indicatorColor: 'rgba(255, 255, 255, 1)',
				indicatorActiveColor: 'rgba(255, 156, 0, 1)',
				deliveryFlag: false,
				canvasFlag: true,
				scrollFixed:false,
				posterData:{
					marginLR: 30,
					marginTB: 80,
					radius: 0.03,
					innerLR: 20,
					innerTB: 20,
					posterRatio: 1.3,
					posterImgUrl: "",
					title: "",
					titleFontSize: 15,
					desFontSize: 14,
					desLineHeight: 22,
					titleLineHeight: 24,
					posterCodeUrl: "https://sq.wenlinapp.com/upload/share/20200821/20200821233746683.png",
					codeWidth: 0.3,
					codeRatio: 1,
					codeRadius: 0.5,
					codeMT: 15,
					codeName: "问邻",
					codeNameMT: 15,
					tips: "长按/扫描识别加入小区",
					posterBgUrl:'',
					avatarUrl: uni.getStorageSync('user').avatar,
					des:''
				},
				simpleFlag:false,
				openCommunity:false,
				mobile:'',
				communityAddress:'',
				communityTitle:'',
				setcommunity:false,
				textread: `《问邻服务协议及隐私政策》`,
				community: '', //小区名
				building: '', //楼栋号
				unit: 1, //单元号
				pickerId:false,//选择业主
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
				communityId: '',
				setcommunityType:1,
				setcommunityValue:'业主',
				onShareShow:false
			}
		},
		onLoad(options){
			console.log(options,'options')
		},
		mounted() {
			console.log(this.$mp.query)
			this.community_id = this.$mp.query.community_id
			if(this.$mp.query.community_id){
				uni.setStorageSync('pid',this.$mp.query.pid)
				uni.setStorageSync('pcommunity_id',this.community_id)
			}
			var scene = decodeURIComponent(this.$mp.query.scene);
			console.log(scene)
			if(this.$mp.query.scene){
			var scene = decodeURIComponent(this.$mp.query.scene);
			console.log(scene)
			var arr = scene.split("&")
			var community_id = ''
			var pid = ''
				if( arr[0].split("=")[0] == 'community_id'){
					community_id =  arr[0].split("=")[1]
					pid = arr[1].split("=")[1]
					this.community_id = community_id
					uni.setStorageSync('pcommunity_id',community_id)
					uni.setStorageSync('pid',pid)
				}else{
					community_id = arr[1].split("=")[1]
					pid = arr[0].split("=")[1]
					uni.setStorageSync('pid',pid)
					uni.setStorageSync('pcommunity_id',community_id)
				}
			}
			this.getDetail()
			this.mobile = uni.getStorageSync('mobile')
		},
		onShareAppMessage:function(){
			// var community_id = uni.getStorageSync('community_id')
			var community_id = this.community_id
			var user_id = uni.getStorageSync('user_id')
			 return {
			  title: uni.getStorageSync('user').user_nickname+'邀请你加入'+this.detail.title+'小区，与邻居们一起共建共享小区',
			  imageUrl:this.detail.images && this.detail.images.length ? this.detail.images[0] : 'https://sq.wenlinapp.com/appimg/send54.png',
			  path: '/pages/index/communitycard?community_id='+community_id+'&pid='+user_id
			 }
		},
		onShareTimeline(e) {
			var query = {}
			// var community_id = this.community_id
			var user_id = uni.getStorageSync('user_id')
			query.community_id = this.community_id
			query.pid = this.user_id
		    // query=JSON.stringify(query);
		    return {
		      title: uni.getStorageSync('user').user_nickname+'邀请你加入'+this.detail.title+'小区，与邻居们一起共建共享小区',
		      imageUrl: this.detail.images && this.detail.images.length ? this.detail.images[0] :'https://sq.wenlinapp.com/appimg/send54.png',
		      query: query,
		    }
		},
		computed:{
			headerHeight(){
				return 96
			},
			sheaderHeight(){
				return 250
			}
		},
		methods:{
			goHome(){
				uni.navigateTo({
					url:'/pages/index/index'
				})
			},
			gosecret(){
				uni.navigateTo({
					url:'/pages/update/secret'
				})
			},
			//转发朋友圈
			onsend(){
				this.onShareShow = false
				this.$refs.Firend.onshow()
			},
			onShowclose(){
				this.onShareShow = false
			},
			onActivelink(){
				this.onShareShow = true
			},
			onShowshare(){
				this.onShareShow = false
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
			setcommunityClose(){
				this.setcommunity = false
			},
			getmaps(){
				var that = this
				 uni.getLocation({
				      type: 'wgs84', 
				      success: function (res) {
						uni.openLocation({//​使用微信内置地图查看位置。
						  latitude: parseFloat(that.detail.latitude),//要去的纬度-地址
						  longitude:  parseFloat(that.detail.longitude),//要去的经度-地址
						  name: "",
						  address: that.detail.address
						})
					}
				})
			},
			//是否通过地图选择
			getMap() {
				// var that = this;
				// if (uni.getStorageSync('longitude')) {
				// 	uni.chooseLocation({
				// 		latitude: uni.getStorageSync('latitude'),
				// 		longitude: uni.getStorageSync('longitude'),
				// 		success: res => {
				// 			console.log(res);
				// 			this.community = res.name;
				// 		}
				// 	});
				// } else {
				// }
				var that = this
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
					// var that = this;
					// if (uni.getStorageSync('longitude')) {
					// 	uni.chooseLocation({
					// 		latitude: uni.getStorageSync('latitude'),
					// 		longitude: uni.getStorageSync('longitude'),
					// 		success: res => {
					// 			this.communityAddress = res.address
					// 		}
					// 	});
					// } else {
					// 	uni.showToast({
					// 		title: '您未开通地图授权，请输入地址',
					// 		duration: 2000
					// 	});
					// }
					that.Api.getNearCommunity({latitude:uni.getStorageSync('latitude'),longitude:uni.getStorageSync('longitude')}).then((result) => {
						if(result.code == 1){
							that.searchCommunityList = result.data;
							that.chooseCommunity = true
						}
					})
					
				})
				
				
			},
			//小区处理
			communityInput(e) {
				this.community = e.detail.value;
			},
			//楼栋处理 // replace(/[^\w\.\/]/ig,''
			buildingInput(e) {
				this.building = e.detail.value.replace(/[^a-z|0-9]/gi, '');
			},
			unitInput(e) {
				this.unit = e.detail.value.replace(/[^a-z|0-9]/gi, '');
			},
			roomInput(e) {
				this.room = e.detail.value.replace(/[^a-z|0-9]/gi, '');
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
						icon:'none',
						title: '请输入小区名',
						duration: 2000
					});
					return
				}
				if(!this.communityAddress){
					uni.showToast({
						icon:'none',
						title: '请输入小区地址',
						duration: 2000
					});
					return
				}
				if(!this.mobile){
					uni.showToast({
						icon:'none',
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
								uni.navigateTo({
									url:'/pages/index/index'
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
			getDetail(){
				var data = {
					community_id:this.community_id
				}
				this.Api.communityDetail(data).then((result) => {
					if(result.code == 1){
						this.detail = result.data
						this.detail.logo  = this.detail.logo ? this.detail.logo : this.Config.minUrl+'logovi.jpg'
						this.communityTitle = result.data.title
						this.communityAddress = result.data.address
						if(!this.detail.images.length){
							this.detail.images = ['https://sq.wenlinapp.com/appimg/send54.png']
						}
						uni.setStorageSync('pcommittee_id',result.data.committee_id)
						uni.setStorageSync('ptitle',result.data.title)
						uni.setStorageSync('paddress',result.data.address)
					}
				})
			},
			goJoin(){
				if(uni.getStorageSync('singPage') == 1){
					uni.showToast({
						title: '请前往小程序使用完整服务',
						icon:'none',
						duration: 2000,
					})
					return
				}
				if(this.detail.is_join == 1){
					this.onActivelink()
				}else{

						var that = this
						var auth = new Promise(function(resolve, reject){
						    uni.login({
						    	success: (res) => {
						    		let { errMsg,code} = res
						    		if(errMsg == 'login:ok'){
						    			that.Api.wechatAuth({code:code}).then((result)=>{
						    				if(result.code == 1){
						    					uni.setStorageSync('token', result.data.token);
						    					uni.setStorageSync('user', result.data.user);
												uni.setStorageSync('maxJoin', result.data.max_join);
						    					uni.setStorageSync('mobile', result.data.user.mobile);
						    					uni.setStorageSync('all_community', result.data.all_community);
												resolve()
											}
											
						    			})
						    		}
						    	}
						    })
						    
								
						});
						auth.then((res) => {
							if(uni.getStorageSync('token')){
									var all = uni.getStorageSync('all_community')
									var maxJoin = uni.getStorageSync('maxJoin')
									console.log(JSON.stringify(all),'all')
									console.log(this.detail.title,'title')
									var flag = false
									all.map((item) => {
										if(item.title == this.detail.title){
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
									this.community = uni.getStorageSync('ptitle')
									this.community_id = uni.getStorageSync('pcommunity_id')
				
							}else{
								uni.navigateTo({
									url:'/pages/index/index'
								})
							}
						})
					
					}
				
			},
			onShowtodo(){
				this.onShareShow = false
				this.scrollFixed = true
				var pages = getCurrentPages() //获取加载的页面
				
				var currentPage = pages[pages.length-1] //获取当前页面的对象
				console.log(currentPage.route)
				// return
				var community_id = uni.getStorageSync('community_id')
				var user_id = uni.getStorageSync('user_id')
				//currentPage.route
				var data = {
					scene:'community_id='+community_id+'&pid='+user_id,
					page: currentPage.route
				}
				this.Api.getWXACodeUnlimit(data).then((result) => {
					if(result.code == 1){
						this.$nextTick(() => {							
							this.posterData.posterImgUrl =  this.detail.images.length ? this.detail.images[0] : 'https://sq.wenlinapp.com/appimg/share500400.jpg'
							this.posterData.avatarUrl = uni.getStorageSync('user').avatar
							this.posterData.posterCodeUrl = result.data
							this.posterData.title =  uni.getStorageSync('user').user_nickname+'邀请你加入'+this.detail.title+'小区邻里互助平台'
							this.$forceUpdate()
							setTimeout(()=>{
								this.canvasFlag=false;//显示canvas海报
								this.deliveryFlag = false;//关闭分享弹窗
								this.$refs.hchPoster.posterShow()
							},500)
						
						})
						
					}
				})
				
				
			},
			canvasCancel(val){
				this.scrollFixed = false
				this.canvasFlag=val;
			},
			setcommunityHandler(){
				if(!this.community_id){
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
					community_id: this.community_id,
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
								that.setcommunity = false
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
									uni.reLaunch({
									  url: '/pages/index/index'
									})
								}
					
							}
						});
					
					}
				})
			}
		},
		components:{
			navigationCustom,
			hchPoster,
			Onshare,
			Firend
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
			padding-top:24upx;
			padding-bottom: 24upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			.userheader{
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-bottom: 16upx;
				padding-left:25upx;
				padding-right:25upx;
				box-sizing: border-box;
				.avatarwrap{
					width:140upx;
					height:140upx;
					margin-right:23upx;
					border-radius: 50%;
					overflow: hidden;
					position: relative;
					/deep/ .u-image__image{
						width:140upx;
						height:140upx;
						border-radius: 50%;
					}
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
				.userinfwrap{
					display: flex;
					flex-direction: column;
					flex:1;
				}
				.address{
					margin-top:16upx;
					font-size: 28upx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #404B69;
				}
				.userinfo{
					display: flex;
					flex-direction: row;
					align-items: center;
					.username{
						font-size: 36upx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #020433;
						color:rgba(51,51,51,1);
						margin-right:20upx;
					}
					.userdes{
				
							font-size:20upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
						    color: #020433;
							margin-left:24upx;
					}
				}
				.userbtn{
					width:126upx;
					border-radius:8upx;
					border:2upx solid rgba(255,156,0,1);
					height:56upx;
					font-size:26upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(255,156,0,1);
					line-height:56upx;
					text-align: center;
					margin-left:auto;
				}
			}
			.darenwrap{
				margin-top:40upx;
				width:624upx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				align-content: flex-start;
				margin:0 auto;
				.avatarico{
					width:80upx;
					height:80upx;
					border-radius: 50%;
					border:4upx solid white;
					margin-right:24upx;
					margin-bottom: 24upx;
				}
				.avatarico:nth-child(6n){
					margin-right:0upx;
				}
				.avatarwt{
					background: #EEF2FA;
					font-size: 24upx;
					width: 80upx;
					height:80upx;
					line-height: 80upx;
					text-align: center;
					font-family: PingFang SC;
					font-weight: 500;
					color: #020433;
				}
			}
			.itemwrap{
				width:624upx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				align-content: flex-start;
				margin:30upx auto;
				.labelitem{
					width:calc(33.33% - 4upx);
					display: flex;
					flex-direction: column;
					align-items: center;
					border-right:2upx solid #F0F0F0;
					.labelnum{
						font-size: 36upx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #020433;
					}
					.labeltext{
						font-size: 28upx;
						margin-top:10upx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #020433;
					}
				}
				.labelitem:nth-child(3n){
					border-right: none;
				}
			}
			.swiper-wrap{
				width:100%;
				border-top: 20upx solid #F7F9FF;
				padding-top:20upx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				align-content: flex-start;
		
					.swiperimg{
						width:33.33%;
						height:250upx;
					}
				
			}
			.useritem{
				display: flex;
				flex-direction: row;
				height:106upx;
				// line-height: 106upx;
				width:calc(100% - 48upx);
				margin:0 auto;
				align-items: center;
				border-bottom: 1px solid rgba(222, 222, 222, 0.5);
				.t1{
					width:112upx;
					margin-right:24upx;
					text-align: right;
					font-size:28upx;
					line-height: 38upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(51,51,51,1);
				}
				.t2{
					font-size:28upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(51,51,51,1);
					width:calc(100% - 112upx)
				}
				.ti{
					width:40upx;
					height:40upx;
					margin-left: auto;
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
					}
				}
			}
			.lybtn{
				width: 654upx;
				height: 100upx;
				background: linear-gradient(44deg, #FEAA0E, #FFC000);
				border-radius: 12px 12px 12px 12px;
				box-shadow:0px 8upx 16upx 0px rgba(225,138,0,0.1);
				font-size:36upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(255,255,255,1);
				line-height:100upx;
				text-align: center;
				margin-top:234upx;
				position: fixed;
				left:50%;
				transform: translateX(-50%);
				bottom: 100upx;
			}
			.gbbtn{
				width:702upx;
				height:80upx;
				background:rgba(216,216,216,1);
				box-shadow:0px 8upx 16upx 0px rgba(51,51,51,0.1);
				border-radius:40upx;
				font-size:36upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(51,51,51,1);
				line-height:80upx;
				text-align: center;
				margin-top:40upx
			}
			
			.popup {
				position: fixed;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: 40000;
				.mb {
					position: fixed;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					z-index: 4001;
					background: rgba(0, 0, 0, 0.6);
				}
				// 留言
				.message {
					position: fixed;
					left: 0;
					bottom: 0;
					width: 100%;
					height: 760upx;
					z-index: 4001;
					width:750upx;
					height:760upx;
					padding-left: 24upx;
					padding-right:24upx;
					box-sizing: border-box;
					background:rgba(255,255,255,1);
					border-radius:16upx 16upx 0px 0px;
					.openheader {
						height: 108upx;
						line-height: 108upx;
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
					.textwrap{
						width:100%;
						height:400upx;
						background:rgba(222,222,222,0.3);
						border-radius:8upx;
						position: relative;
						.textarea{
							position: absolute;
							left:0;
							top:0;
							width:100%;
							height:100%;
							padding:20upx;
							font-size:26upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(153,153,153,1);
							line-height:36upx;
						}
						.tip{
							position: absolute;
							right:20upx;
							bottom: 20upx;
							font-size:26upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(51,51,51,1);
							line-height:u36px;
							display: flex;
							flex-direction: row;
							.t2{
								color:rgba(153, 153, 153, 1)
							}
						}
					}
					hoverclass{
						background: rgba(255, 156, 0, 1);
					}
					
				}
				.message view:last-child{
					width:702upx;
					height:80upx;
					background:rgba(255,156,0,0.5);
					box-shadowss:0px 8upx 16upx 0px rgba(225,138,0,0.1);
					border-radius:40upx;
					margin-top:64upx;
					font-size:36upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(255,255,255,1);
					line-height:80upx;
					text-align: center;
				}
			}
		}
		
		.popup {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 40000;
			.mb {
				position: fixed;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: 4001;
				background: rgba(0, 0, 0, 0.6);
			}
			//选择业主
			.chooseid{
				height:500upx;
				bottom:0;
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
			// 开通小区
			.openarea {
				position: absolute;
				left: 0;
				bottom: 0;
				z-index: 4002;
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
					.rcolor{
						color: #ff9c00;
					}
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
			// 个人信息
			.openinfomation {
				height: 916upx;
			}
		}
	}
</style>
