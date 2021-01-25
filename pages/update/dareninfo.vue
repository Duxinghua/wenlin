<template>
	<view class="push">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="content">
			<input  v-model="title"  placeholder-class="input-title"  class="input-title-a" type="text" placeholder="标题"  @input="titleInput" style="display: none;"/>
			<view class="skillwrap" v-if="type ==6">
				<view class="s1" @click="selectKill">
					<text class="t1">选择我的技能标签：</text>
					<image class="t2" src="../../static/cardmore.png" alt="">
				</view>
				<view class="sklist" v-if="skillList.length">
					<view class="cu-item nav-item" :class="item.check?'nav-active':''" v-for="(item,index) in skillList" :key="index" :data-id="index">
						{{item.title}}
					</view>
				</view>
			</view>
			<view class="contentwrap">
				<textarea maxlength="1000" class="servercontent-a" placeholder-class="servercontent" v-model="content" @input="contentInput" :placeholder="list[type]"></textarea>
				<view class="imgwrap">
					<view class="imgitem"  v-for="(item,index) in uploadList" :key="index"  v-if="uploadList.length">
						<image src="../../static/imguploaddel.png" class="uploadclose" @click="uploadDel(index)" />
						<image :src="item.http_url"></image>
					</view>
					
					<view class="imgupload"  @click="chooseImage" v-if="uploadList.length<9">
						<image src="../../static/imgjia.png" class="imgjia"></image>
					</view>
				</view>
			</view>
			<view class="radiowrap" v-if="type == 3">
				    
				        <label class="radioitem" v-for="(item,index) in buyList"  :key="index" @click="buyClick(item)">
							  <view class="radiot2">{{item.name}}</view>

							<image :class="['label-image',index === 3 ? 'label-image-fix' : '']" :src="item.check ? '../../static/radioselect.png' : '../../static/radionoselect.png' "></image>
			
				          
				        </label>
				    
			</view>
			<view class="pricewrap" v-if="type == 3" @click="priceClick">
				<text class="label">价格</text>
				<view class="pricetype">
					<text>￥{{sell_price}}</text>
					<image src="../../static/indexback.png" class="pricearrow"></image>
				</view>
			</view>
			<view class="contentinfo">
				<text class="label">联系方式：</text>
				<view class="inputwrap">
					<text class="label-text">手机号</text>
					<input class="label-input" placeholder-class="label-input" type="number" v-model="mobile"  />
				</view>
				<view class="inputwrap">
					<text class="label-text">微信号</text>
					<input class="label-input" placeholder-class="label-input" type="text" v-model="weixin" @input="weixinInput" />				</view>
			</view>
			<view class="contentinfo">
				<text class="label">显示范围：</text>
					<view class="inputwrap" v-for="(item,index) in radioList" :key="index" @click="radioClick(item)">
						<text class="label-text">{{item.name}}</text>
						<image class="label-image" :src="item.check ? '../../static/radioselect.png' : '../../static/radionoselect.png' "></image>
					</view>
			</view>
		</view>
		<view class="regeditwrip">
			<view class="regedit" @click="pushClick">
				{{pushText}}
			</view>
		</view>
		<!-- 添加技能 -->
		<view class="popup" v-if="skillBoolean">
			<view class="mb" @click="skillClose"></view>
			<view class="addlike">
				<input class="addlikeinput" v-model="liketext" @input="addlikeInput" />
				<text class="addlikelength">{{liketext.length}}/8字</text>
				<text class="addlikebtn" @click="addLikebtn">确定</text>
			</view>
		</view>
		<!-- 价格输入框 -->
		<view class="popup" v-if="priceView">
			<view class="mb"></view>
			<view class="priceinput">
				<view class="inputwrap" @click="inputTypeHandle(1)">
					<text class="pricetitle">价格</text>
					<text class="pricevalue">￥{{sell_price}}</text>
				</view>
				<view class="inputwrap"  @click="inputTypeHandle(2)" style="display: none;">
					<text class="pricetitle">入手价</text>
					<text class="pricevalue1">￥{{sell_price1}}</text>
				</view>
				<view class="inputwrap" style="display: none;">
					<text class="pricetitle">运费</text>
					<text class="pricevalue2"  @click="inputTypeHandle(3)">￥{{sell_price2}}</text>
					<view class="express">
						<image class="express-image" :src="true ? '../../static/radioselect.png' : '../../static/radionoselect.png' "></image>
						<text class="express-text">包邮</text>
					</view>
				</view>
				<view class="keywordwrap">
					<view class="keywordtop">
						<view class="numberwrip">
							<view class="number" @click="keyClick(1)">
								1
							</view>
							<view class="number" @click="keyClick(2)">
								2
							</view>
							<view class="number" @click="keyClick(3)">
								3
							</view>
							<view class="number" @click="keyClick(4)">
								4
							</view>
							<view class="number" @click="keyClick(5)">
								5
							</view>
							<view class="number" @click="keyClick(6)">
								6
							</view>
							
						</view>
						<view class="close" @click="keyClick('del')">
							<image class="keywordclose" src="../../static/keywordclose.png" mode=""></image>
						</view>

					</view>
					<view class="keywordtop">
						<view class="numberwrip">
							<view class="number" @click="keyClick(7)">
								7
							</view>
							<view class="number" @click="keyClick(8)">
								8
							</view>
							<view class="number" @click="keyClick(9)">
								9
							</view>
							<view class="number" @click="keyClick(0)">
								0
							</view>
							<view class="number number_txt" @click="keyClick('price')">
								面议
							</view>
							<view class="number number_back" @click="keyBack()">
								<image class="keywordclose" src="../../static/keywordback.png" mode=""></image>
							</view>
							
						</view>
						<view class="close close_text" @click="keyClick('confirm')">
							确定
						</view>
					
					</view>
					
				</view>
			</view>
		</view>
		<Skill ref="skill" :isShow="skillShow" @close="skillClose" @ok="okSkill"></Skill>
	</view>
</template>

<script>
	import Integraltip from '@/components/integraltip/integraltip.vue'
	import Skill from '../../components/skill/skill.vue'
	import Tool from '../../utils/tool.js'
	import {upload} from '../../utils/config.js'
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data () {
			return {
				radioCurrent:1,
				radioList:[
					{value:1,name:'所有人',check:true},
					{value:0,name:'本小区',check:false}
				],
				config: {
					title: '达人信息', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)",//文字颜色，默认白色
					type: 1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200 ,//滑动的高度限制，超过这个高度即背景全部显示
				title:'',
				content:'',
				TabCur:0,
				scrollLeft:0,
				navlist:[
				],
				type:6,//1求助 2新鲜事 3闲置 4鹊桥 5达人
				uploadList:[],
				liketext:'',
				buyList:[
					{name:'出售',value:1,check:true},
					{name:'赠送',value:2,check:false},
					{name:'出租',value:3,check:false},
					{name:'求购',value:4,check:false}
				],
				mobile:'',
				weixin:'',
				images:'',
				opening:1,//是否公开
				sell_type:1,
				sell_price:'',
				sell_price1:'',
				sell_price2:'',
				inputType:1,
				priceView:false,
				skillBoolean:false,//添加技能控制 
				list:{
					1:'发布求助内容，有困难找邻居帮忙~',
					2:'身边的新鲜事，随时随地分享给邻居~',
					3:'发布闲置物品或求购信息，给闲置物品找一个新的主人~',
					4:'发布鹊桥信息，缘分也许就在邻里之间~',
					6:'给邻居们秀一下我的特长和技能~'
				},
				skillShow:false,
				dataskill:'',
				skillList:[],
			    skillLists:[],
				pushText:'保存'
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		mounted(){
		
			this.mobile = uni.getStorageSync('mobile')
			this.weixin = uni.getStorageSync('weixin')
			
			if(this.$mp.query.data){
				var data = decodeURIComponent(this.$mp.query.data);
				data = JSON.parse(data)
				this.skillList = data
				this.navlist = data
			}
			this.getcommunitySkill()
			this.$forceUpdate()
	
		},
		methods:{
			selectKill(){
				uni.navigateTo({
					url:'/pages/push/skill?type=1&data='+this.detail.skill
				})
			},
			skillClose(){
				this.skillShow = false
			},
			//详情
			getmyDarenInfo(){
				var data = {
					community_id:uni.getStorageSync('community_id')
				}
				this.Api.myDarenInfo(data).then((result) => {
					console.log(result)
					if(result.code == 1){
						this.detail = result.data
						if(!result.data.id){
							this.pushText = '发布'
							return
						}else{
							this.pushText = '修改'
						}
						this.title = this.detail.title
						this.content = this.detail.content
						this.mobile = this.detail.mobile
						this.weixin = this.detail.weixin
						var list = []
						var s = upload.toString()
						if(result.data.images){
							result.data.images.map((item)=>{
								var obj = {}
								obj.url = item.replace(/https\:\/\/sq\.wenlinapp\.com\/upload\//g,'')
								obj.http_url = item
								obj.filename = item
								list.push(obj)
							})
						}
						this.radioList.map((item)=>{
							if(item.value == this.detail.opening){
								item.check = true
							}else{
								item.check = false
							}
						})
						var lists = []
						if(this.skillList.length == 0){
							if(result.data.skill){
								var ss = result.data.skill.split(",")
								this.navlist.map((item) => {
									ss.map((sitem) => {
										if(item.skill_id == sitem){
											item.check = true
											lists.push(item)
										}
									})
								})
								this.skillList = lists
							}
						}else{
							var slist = []
							this.skillList.map((item) => {
								slist.push(item.skill_id)
							})
							this.detail.skill = slist.join(",")
							console.log(this.detail.skill)
							
						}
						this.uploadList = list
						this.$forceUpdate()
					}
				})
			},
			// 获取技能
			getcommunitySkill(){
					this.Api.communitySkill({}).then((result) => {
						if(result.code == 1){
							result.data.map((item) => {
								item.check = false
							})
							if(this.navlist.length == 0) {
							this.navlist = result.data
							}
							this.getmyDarenInfo()
						}
					})
			},
			inputTypeHandle(e){
				this.inputType = e
			},
			keyBack(){
				this.priceView = false
			},
			//键盘输入处理
			keyClick(e){
				if(this.inputType == 1){
					if(!isNaN(e)){
						this.sell_price = !isNaN(this.sell_price) ? this.sell_price.toString() + e.toString() : ''
					}else if(e == 'del'){
						this.sell_price = !isNaN(this.sell_price) ? this.sell_price.substring(0,this.sell_price.length-1) : ''
					}else if(e == 'confirm'){
						this.priceView = false
					}else if(e == 'price'){
						this.sell_price = '面议'
					}
				}else if(this.inputType == 2){
					if(!isNaN(e)){
							this.sell_price1 = this.sell_price1.toString() + e.toString() 
						}else if(e == 'del'){
							this.sell_price1 = this.sell_price1.substring(0,this.sell_price1.length-1)
						}else if(e == 'confirm'){
							this.priceView = false
					}
					
				}else if(this.inputType == 3){
					if(!isNaN(e)){
							this.sell_price2 = this.sell_price2.toString() + e.toString() 
						}else if(e == 'del'){
							this.sell_price2 = this.sell_price2.substring(0,this.sell_price2.length-1)
						}else if(e == 'confirm'){
							this.priceView = false
						}
					
				}
				this.$forceUpdate()
			},
			//价格输入处理
			priceClick(){
				console.log(this.type,this.sell_type)
				if(this.type == 3){
					if(this.sell_type != 2){
						this.priceView = true
					}
				}
				
			},
			//图片处理
			uploadDel(e){
				this.uploadList.splice(e,1)
			},
			//发布处理
			pushClick(e){
				var that = this
				var data = {
					title:this.title,
					content:this.content,
					phone:this.mobile,
					weixin:this.weixin,
					opening:this.opening,
					type:this.type,
					community_id:uni.getStorageSync('community_id'),
					id:this.detail.id
				}
				var images = []
				this.uploadList.map((item) => {
					images.push(item.url)
				})
				if(!data.content){
					uni.showToast({
					    title: '请输入内容',
						icon:'none',
					    duration: 2000
					});
					return
				}
				// if(!data.phone){
				// 	uni.showToast({
				// 	    title: '请输入手机号',
				// 		icon:'none',
				// 	    duration: 2000
				// 	});
				// 	return
				// }
				// if(!data.weixin){
				// 	uni.showToast({
				// 	    title: '请输入微信号',
				// 		icon:'none',
				// 	    duration: 2000
				// 	});
				// 	return
				// }else{
				// 	uni.setStorageSync('weixin',data.weixin)
				// }
				if(this.type == 3){
					data.sell_type = this.sell_type
					data.sell_price = this.sell_price.length ? this.sell_price : '面议'
				}

				// if(images.length == 0){
				// 		uni.showToast({
				// 			title: '至少上传一张图片',
				// 			icon:'none',
				// 			duration: 2000
				// 		});
				// 		return
				// }
				data.images = images.join(',')
			
				
				if(this.type == 6){

					var skill = []
					this.skillList.map((item) => {
						if(item){
							skill.push(item.skill_id)
						}
					})
					if(skill.length == 0){
						uni.showToast({
						    title: '请选择技能',
							icon:'none',
						    duration: 2000
						});
						return
					}
					data.skill = skill.join(',')
					// if(!data.title){
					// 	uni.showToast({
					// 	    title: '请输入标题',
					// 		icon:'none',
					// 	    duration: 2000
					// 	});
					// 	return
					// }
				}
				if(this.type == 6){
					if(data.id){
						this.Api.updateMyDaren(data).then((result) => {
							if(result.code == 1){
								uni.showToast({
									title: result.msg,
									duration: 2000,
									success: () => {
										if(result.data.add){
											that.add_type = result.data.add == -1 ? '-' : '+'
											that.score_text = result.data.score
											that.$refs.integraltip.show()
											setTimeout(()=>{
												that.add_type = ''
												that.score_text = ''
												that.$refs.integraltip.close()
												uni.navigateBack({
													delta:2
												})
												
											},2000)
										}else{
											uni.navigateBack({
												delta:2
											})
										}
							
									}
								});
							}else{
								uni.showToast({
									title: result.msg,
									icon:'none',
									duration: 2000
								});
							}
						})
					}else{
						this.Api.publishDynamicsDaren(data).then((result) => {
							if(result.code == 1){
								uni.showToast({
									title: result.msg,
									duration: 2000,
									success: () => {
										if(result.data.add){
											that.add_type = result.data.add == -1 ? '-' : '+'
											that.score_text = result.data.score
											that.$refs.integraltip.show()
											setTimeout(()=>{
												that.add_type = ''
												that.score_text = ''
												that.$refs.integraltip.close()
												uni.navigateBack({
													delta:2
												})
												
											},2000)
										}else{
											uni.navigateBack({
												delta:2
											})
										}
								
									}
								});
							}else{
								uni.showToast({
									title: result.msg,
									icon: 'none',
									duration: 2000
								});
							}
						})
					}
				}
			},
			//上传图片处理
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
									}
								})
							})
						}
					})
			},
			customConduct(e){
				console.log(e)
			},
			//标题
			titleInput(e){
				this.title = e.detail.value
			},
			//内容
			contentInput(e){
				this.content = e.detail.value
			},
			//输入微信号
			weixinInput(e){
				this.weixin = e.detail.value
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			navClick(obj){
				this.navlist.map((item)=>{
					var flag = true
					if(item.skill_id == obj.skill_id){
						flag = !item.check
						item.check = flag
						console.log(flag)
					}
				})
			},
			buyClick(obj){
				this.buyList.map((item) => {
					if(item.name == obj.name){
						item.check = true
						if(this.sell_type != 2){
							this.sell_type = obj.value
						}else{
							this.sell_type = obj.value
						}
						this.sell_price = ''
					}else{
						item.check = false
					}
				})
			},
			//添加技能
			navAdd(e){
				this.skillShow = true
			},
			okSkill(){
				if(!this.$refs.skill.inputValue){
					uni.showToast({
						title: '请输入技能',
						icon:'none',
						duration: 2000
					});
					return;
				}
				var data = {
					title:this.$refs.skill.inputValue
				}
				this.Api.communityDynamicsAddSkill(data).then((result)=>{
					if(result.code == 1){
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
						this.skillShow = false
						this.$refs.skill.inputValue = ''
						this.getcommunitySkill()
						this.getmyDarenInfo()
					}else{
						uni.showToast({
							title:  result.msg,
							icon:'none',
							duration: 2000
						});
					}
				})
			},
			//是否公开
			radioClick(obj){
				this.radioList.map((item) => {
					if(item.name == obj.name){
						item.check = true
						this.opening = item.value
					}else{
						item.check = false
					}
				})
			},
			addlikeInput(e){
				this.$nextTick(function(){
					this.liketext = e.detail.value.substr(0,8)
				})
			
			}
		},
		components:{
			navigationCustom,
			Skill,
			Integraltip
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: whtie;
	}
	.push{
		display: flex;
		flex-direction: column;
		background: white;
		min-height:100vh;
		.content{
			display: flex;
			flex-direction: column;
			padding:24upx;
			box-sizing: border-box;
			padding-bottom: 190upx;
			.skillwrap{
				display: flex;
				flex-direction: column;
				min-height: 100upx;
				.s1{
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					height:100upx;
					color:#333;
					border-bottom: 1px solid rgba(222, 222, 222, 0.5);
					line-height: 100upx;
					.t1{
						font-size:30upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						color:rgba(51,51,51,1);
					}
					.t2{
						width:40upx;
						height:40upx;
						margin-top:30upx
					}
				}
				.sklist{
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-items: center;
					min-height: 72upx;
					padding-top:20upx;
					box-sizing: border-box;
					.nav-item{
						width:fit-content;
						padding-left:20upx;
						padding-right:20upx;
						line-height: 42upx!important;
						height:42upx;
			
						margin-right:20upx;
						margin-bottom: 20upx;
						background: rgba(255, 156, 0, 0.1);
						color: #FF9C00;
						border-radius:21upx;
					}
				}
			}
			.nav-type{
				font-size:36upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(51,51,51,1);
				line-height:50upx;
				margin-bottom: 20upx;
			}
			.nav{
				padding-bottom: 20upx;
				min-height: 72upx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				border-bottom: 1px solid rgba(222,222,222,0.5);
				.nav-item{
					width:fit-content;
					padding-left:20upx;
					padding-right:20upx;
					margin-bottom: 20upx;
					line-height: 42upx!important;
					height:42upx;
					background:rgba(222,222,222,0.5);
					border-radius:21upx;
				}
				.nav-active{
					background:rgba(255,156,0,0.1);
					color:#FF9C00;
				}
			}
			
			.input-title{
				font-size:30upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(153,153,153,1);
				border-bottom: 1px solid rgba(222,222,222,0.5);
			}
			.input-title-a{
				height:98upx;
				font-size:30upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:#333;
				line-height:98upx;
				text-align: left;
				border-bottom: 1px solid rgba(222,222,222,0.5);
				// margin-bottom: 24upx;
			}
			.servercontent-a{
				text-align: left;
				width:100%;
				font-size: 34upx;
				line-height: 52upx;
				color:#333;
			}
			.contentwrap{
				min-height: 441upx;
				padding-bottom: 32upx;
				// padding-top:32upx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				border-bottom: 1px solid rgba(222,222,222,0.5);
				margin-top: 32upx;
				.servercontent{
					min-height:200upx;
					font-size:34upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(153,153,153,1);
					line-height:42upx;
				}
				.imgwrap{
					display: flex;
					flex-direction: row;
					flex-wrap:wrap;
					.imgitem{
						width:176upx;
						height:176upx;
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
							left:136upx;
							top:0;
							width:40upx;
							z-index: 3;
							height:40upx;
						}
					}
					.imgupload{
						width:176upx;
						height:176upx;
						display: flex;
						justify-content: center;
						align-items: center;
						background: #DEDEDE;
						border-radius: 12upx;
						.imgjia{
							width:52upx;
							height:52upx;
						}
					}
				}
			}
			.radiowrap{
				display: flex;
				width:100%;
				flex-direction: row;
				justify-content: space-between;
				height:90upx;
				border-bottom: 2upx solid rgba(222,222,222,0.5);
				.radioitem{
					display: flex;
					flex-direction: row;
					align-items: center;
					.radiot2{
						font-size:28upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(51,51,51,1);
						line-height:40upx;
						margin-right:16upx;
					}
					.label-image{
						width:60upx;
						height:60upx;
						margin-right:48upx;
					}
					.label-image-fix{
						margin-right:-12upx;
					}
				}

			}
			.pricewrap{
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				height:90upx;
				border-bottom: 2upx solid rgba(222,222,222,0.5);
				.label{
					font-size:28upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(51,51,51,1);
			
				}
				.pricetype{
					display: flex;
					flex-direction: row;
					align-items: center;
					text{
						font-size:30upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(255,156,0,1);
					}
					.pricearrow{
						width:30upx;
						height:30upx;
						transform: rotate(180deg);
					}
				}
			}
			.contentinfo{
				display: flex;
				flex-direction: column;
				border-bottom: 2upx solid rgba(222,222,222,0.5);
				margin-top:32upx;
				.label{
					font-size:30upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:rgba(51,51,51,1);
					line-height:42upx;
					margin-bottom: 10upx;
					text-align: left;
				}
				.inputwrap{
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					margin-left:56upx;
					width:calc(100% - 56upx);
					height:84upx;
					border-bottom: 2upx solid rgba(222,222,222,0.5);
					.label-text{
						width:102upx;
						font-size:28upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(51,51,51,1);
						line-height:84upx;
					}
					.label-input{
						width:calc(100% - 102upx);
						font-size:26upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgb(153,153,153);
						line-height:84upx;
						height:84upx;
						text-align: left;
					}
					.label-image{
						width:60upx;
						height:60upx;
					}
					
				}
				.inputwrap:nth-of-type(2){
					border-bottom: 2upx solid transparent;
				}
				.inputwrap:last-child{
					border-bottom: 2upx solid transparent;
				}
			}
		}
		.popup{
			position: fixed;
			left:0;
			top:0;
			width:100%;
			height:100%;
			z-index: 3000;
			.mb{
				position: fixed;
				left:0;
				top:0;
				width:100%;
				height:100%;
				z-index: 3001;
				background: rgba(0,0,0,0.3);
			}
			.addlike{
				position: fixed;
				padding:0 24upx;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				z-index: 3002;
				left:0;
				bottom:0;
				width:100%;
				height:100upx;
				background:rgba(255,255,255,1);
				box-shadow:0px 12upx 20upx 0px rgba(0,0,0,0.1);
				.addlikeinput{
					width:600upx;
					height:60upx;
					background:rgba(234,234,234,0.3);
					border-radius:32upx;
					padding-left:24upx;
				}
				.addlikelength{
					position: absolute;
					right:150upx;
					top:50%;
					transform: translateY(-50%);
					font-size:24upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(51,51,51,1);
				}
				.addlikebtn{
					font-size:30upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(255,156,0,0.5);
				}
			}
			.priceinput{
				position: fixed;
				left:0;
				bottom: 0;
				width:100%;
				height:620upx;
				z-index: 3002;
				background:white;
				border-radius:16px 16px 0px 0px;
				padding:16upx 0;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				.inputwrap{
					display: flex;
					flex-direction: row;
					height:90upx;
					line-height: 90upx;
					margin-left:24upx;
					margin-right: 24upx;
					box-sizing: border-box;
					border-bottom: 2upx solid  rgba(222,222,222,0.6);
					.pricetitle{
						width:110upx;
						font-size:30upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(51,51,51,1);
						line-height: 90upx;
					}
					.pricevalue{
						font-size:36upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(51,51,51,1);
						line-height:90upx;
					}
					.pricevalue1{
						font-size:30upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(51,51,51,1);
					}
					.pricevalue2{
						font-size:30upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(153,153,153,1);
					}
					.express{
						display: flex;
						flex-direction: row;
						align-items: center;
						margin-left:auto;
						.express-image{
							width:64upx;
							height:64upx;
							margin-right:10upx;
						}
						.express-text{
							font-size:30upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(102,102,102,1);
						}
					}
				}
				.inputwrap:last-child{
					border-bottom: 2upx solid transparent;
				}
				.keywordwrap{
					display: flex;
					flex-direction: column;
					.keywordtop{
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						width:100%;
						.numberwrip{
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;
							height:212upx;
							width:558upx;
							border-top: 2upx solid  rgba(222,222,222,0.6);
							.number{
								font-size:40upx;
								font-family:PingFang-SC-Bold,PingFang-SC;
								font-weight:bold;
								color:rgba(51,51,51,1);
								display: flex;
								justify-content: center;
								text-align: center;
								width:186upx;
								height:106upx;
								line-height: 106upx;
								border-right:2upx solid  rgba(222,222,222,0.6);
								border-bottom: 2upx solid  rgba(222,222,222,0.6);
							}
							.number_txt{
								font-size: 32upx;
							}
							.number_back{
								display: flex;
								justify-content: center;
								align-items: center;
								.keywordclose{
									width:60upx;
									height:60upx;
								}
							}
						}
						.close{
							width:calc(100% - 558upx);
							height:212upx;
							display: flex;
							justify-content: center;
							align-items: center;
							border-bottom: 2upx solid  rgba(222,222,222,0.6);
							.keywordclose{
								width:60upx;
								height:60upx;
							}
						}
						.close_text{
							font-size:32upx;
							font-family:PingFang-SC-Bold,PingFang-SC;
							font-weight:bold;
							color:rgba(255,255,255,1);
							background: rgba(255, 156, 0, 1);
						}
					}
				}
			}
			
		}
		.regeditwrip{
			width:100%;
			height:110upx;
			background: white;
			position: fixed;
			left:0px;
			bottom: 0px;
			z-index: 3000;
			display: flex;
			justify-content: center;
			align-items: center;
			.regedit{
				width:702upx;
				height:80upx;
				background:rgba(255,156,0,1);
				font-size:32upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(255,255,255,1);
				line-height:80upx;
				letter-spacing:8px;
				box-sizing: border-box;
				text-align: center;
				border-radius: 20upx;
			}
		}
	}
</style>
