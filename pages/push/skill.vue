<template>
	<view class="push">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="content">
			<view   class="bg-white nav" >
				<view class="cu-item nav-item active" @click="navAdd">自定义</view>
				<view class="cu-item nav-item" :class="item.check?'nav-active':''" v-for="(item,index) in navlist" :key="index" @click="navClick(item)" :data-id="index">
					{{item.title}}
				</view>
			
			</view>

		</view>
		<view class="regeditwrip">
			<view class="regedit" @click="pushClick">
				确定
			</view>
		</view>
		<!-- 添加技能 -->
<!-- 		<view class="popup" v-if="skillBoolean">
			<view class="mb" @click="skillClose"></view>
			<view class="addlike">
				<input class="addlikeinput" v-model="liketext" @input="addlikeInput" />
				<text class="addlikelength">{{liketext.length}}/8字</text>
				<text class="addlikebtn" @click="addLikebtn">确定</text>
			</view>
		</view> -->
		<!-- 价格输入框 -->
		<Skill ref="skill" :isShow="skillShow" @close="skillClose" @ok="okSkill"></Skill>
	</view>
</template>

<script>
	import Tool from '../../utils/tool.js'
	import Skill from '../../components/skill/skill.vue'
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
					title: '选择我的技能', //title
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
				type:1,//1求助 2新鲜事 3闲置 4鹊桥 5达人
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
				types:'',
				data:[]
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		mounted(){
			this.types = this.$mp.query.type
			if(this.$mp.query.data){
				console.log(this.$mp.query.data)
				this.data = this.$mp.query.data
				console.log(this.data)
				this.$forceUpdate()
			}
			this.getcommunitySkill()
			
		},
		methods:{
			//encodeURIComponent(JSON.stringify(car));
			//var da=decodeURIComponent(options.data);


			pushClick(){				
				var list = []
				this.navlist.map((item)=>{
					if(item.check){
						list.push(item)
					}
				})
				var data = encodeURIComponent(JSON.stringify(list));
				if(this.types){
					uni.redirectTo({
							url:'/pages/update/dareninfo?data='+data
					})
					
				}else{
					uni.redirectTo({
						url:'/pages/push/edit?data='+data+'&type=6'
					})
				}
			},
			navClick(obj){
				this.navlist.map((item)=>{
					if(item.skill_id == obj.skill_id){
						item.check = !item.check
					}
				})
				this.$forceUpdate()
			},
			navAdd(){
				this.skillShow = true
			},
			skillClose(){
				this.skillShow = false
			},
			// 获取技能
			getcommunitySkill(){
				this.Api.communitySkill({}).then((result) => {
					if(result.code == 1){
						result.data.map((item) => {
							if(this.data.indexOf(item.skill_id) > -1){
								item.check = true
							}else{
								item.check = false
							}
							
						})
						this.navlist = result.data
					}
				})
			},
			okSkill(){
				if(!this.$refs.skill.inputValue){
					uni.showToast({
						title: '请输入技能',
						duration: 2000
					});
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
					}else{
						uni.showToast({
							title:  result.msg,
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
			Skill
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
			.nav-type{
				font-size:36upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(51,51,51,1);
				line-height:50upx;
				margin-bottom: 20upx;
			}
			.nav{
				
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				.nav-item{
					width:fit-content;
					padding-left:20upx;
					padding-right:20upx;
					margin-bottom:20upx;
					line-height: 42upx!important;
					height:42upx;
					background:rgba(222,222,222,0.5);
					border-radius:21upx;
				}
				.active{
					background:rgba(255,156,0,0.1);
					color:#FF9C00;
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
			}
			.servercontent-a{
				text-align: left;
			}
			.contentwrap{
				min-height: 441upx;
				padding-bottom: 32upx;
				padding-tip:32upx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				border-bottom: 1px solid rgba(222,222,222,0.5);
				margin-top: 32upx;
				.servercontent{
					min-height:200upx;
					font-size:30upx;
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
					border-bottom: 2upx solid red;
					border-bottom: 2upx solid rgba(222,222,222,0.5);
					.label-text{
						width:102upx;
						font-size:26upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(51,51,51,1);
						line-height:84upx;
					}
					.label-input{
						flex:1;
						font-size:26upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(153,153,153,0.5);
						line-height:84upx;
						height:84upx;
					}
					.label-image{
						width:60upx;
						height:60upx;
					}
					
				}
				.inputwrap::last-child{
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
