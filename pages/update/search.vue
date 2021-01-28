<template>
	<!-- 搜索 -->
	<view :class="['searchwrap',scrollFixed ? 'searchwrapFix' : '']">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />

		<view class="searchcontent">
			<view class="searchfxied" :style="[{ top: CustomBar + 'px' }]">
				<view class="searchwraptop">
					<text class="area">天津</text>
					<view class="searchinputwrap">
						<input class="searchinput" type="text" placeholder="搜索问邻共享资源" v-model="searchValue" @input="searcInput" />
						<image class="searchclose" src="../../static/closes.png" v-if="searchValue.length" @click="searchClose"></image>
					</view>
					<text class="searchbtn" @click="searchHandler">搜索</text>
				</view>
				<view class="searchtip" v-if="!searchFlag">
					<text class="searchtext">搜索分类</text>
					<view class="searchcate">
						<view class="cateitem" v-for="(item, index) in tagList" :key="index" :index="index" @click="cateHandler(item)">
							<text class="catetext">{{ item.tag }}</text>
						</view>
					</view>
				</view>
				<view class="searchlist" v-if="searchFlag">
					<scroll-view scroll-x class="bg-white nav tagwrap" scroll-with-animation :scroll-left="scrollLeft">
						<!-- 分类 -->
						<view
							class="cu-item nav-item"
							:class="['tagitem', cateIndex == item.id ? 'active' : '']"
							v-for="(item, index) in tagList"
							:key="index"
							@click="cateClick(item)"
							@tap="tabSelect"
							:data-id="index"
						>
							{{ item.tag }}
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="listwrap">
				<PostItem
					:allFlag="allFlag"
					:type="type"
					v-for="(item, index) in list"
					:pitem="item"
					:key="index"
					@moreClick="moreClick"
					@helpPush="helpPush"
					@shareClick="shareClick"
				></PostItem>
				<Nodata v-if="nodataFlag" />
			</view>
		</view>
		<!-- 帮推 -->
		<Help ref="Help" :isShow="helpShow" @close="Helpcancel" @ok="ok" :score="score" />
		<FindFault :isShow="findFaultValue" :isCollect="findFaultCollect" :isType="findFaultType" @close="fClose" @collect="fCollect" @find="fFind" @report="report" />
		<Onshare :isShow="onShareShow" :isHome="isHome" :pos.sync="pos" @close="onShowclose" @ontodo="onShowtodo" @onshare="onShowshare" />
		<hchPoster ref="hchPoster" @cancel="canvasCancel" :simpleFlag="simpleFlag" :posterBgFlag="false" :canvasAttr.sync="posterData" />
	</view>
</template>

<script>
import Tool from '@/utils/tool.js'
import hchPoster from '../../wxcomponents/hch-poster/hch-poster.vue';
import Onshare from '@/components/onshare/onshare.vue';
import FindFault from '@/components/findFault/findFault.vue';
import Help from '@/components/help/help.vue';
import Nodata from '@/components/nodata/nodata.vue';
import PostItem from '@/components/postItem/postitem.vue';
import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
export default {
	data() {
		return {
			scrollFixed:false,
			isHome:true,
			config: {
				title: '搜索', //title
				bgcolor: 'white', //背景颜色
				fontcolor: 'rgba(51, 51, 51, 1)', //文字颜色，默认白色
				type: 1, //type 1，3胶囊 2，4无胶囊模式
				transparent: false, //是否背景透明 默认白色
				linear: false, //是为开启下滑渐变
				share: false //是否将主页按钮显示为分享按钮
				// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
				// menuText:"返回", 当type为3或4的时候icon右边的文字
			},
			scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
			scrollMaxHeight: 200,
			searchValue: '',
			tagList: [
				{
					id: 0,
					tag: '全部'
				}
			],
			searchFlag: false,
			scrollLeft: 0,
			cateIndex: 0,
			page: 0,
			page_size: 10,
			list: [],
			type: 0,
			total_pages: 0,
			nodataFlag: false,
			allFlag: true,
			helpObj: {},
			score: 0,
			helpShow: false,
			findFaultValue: false,
			findFaultType: 1,
			findFaultCollect: false,
			findFaultObject: {},
			onShareShow: false,
			pos: 'no',
			deliveryFlag: false,
			canvasFlag: true,
			simpleFlag:false,
			posterData: {
				marginLR: 30,
				marginTB: 80,
				radius: 0.03,
				innerLR: 20,
				innerTB: 20,
				posterRatio: 1.3,
				posterImgUrl: '',
				title: '',
				titleFontSize: 15,
				desFontSize: 14,
				desLineHeight: 22,
				titleLineHeight: 24,
				posterCodeUrl: 'https://sq.wenlinapp.com/upload/share/20200821/20200821233746683.png',
				codeWidth: 0.22,
				codeRatio: 1,
				codeRadius: 0.5,
				codeMT: 15,
				codeName: '问邻',
				codeNameMT: 15,
				tips: '长按/扫描识别进入贴子',
				posterBgUrl: '',
				avatarUrl: uni.getStorageSync('user').avatar,
				des: ''
			},
			CustomBar: this.CustomBar
		};
	},
	mounted() {
		if (!this.searchFlag) {
			this.tagList.shift();
		}
		this.tagList = this.tagList = [{id:0,tag:'全部'}].concat(this.Tool.navList)
	},
	watch: {
		// searchFlag(n) {
		// 	if (n) {
		// 		this.tagList.unshift({ id: 0, tag: '全部' });
		// 	} else {
		// 		this.tagList.shift();
		// 	}
		// }
	},
	onShareAppMessage:function(e){
		var image = '';
		if (e.from == 'button') {
			image = this.findFaultObject.images.length ? this.findFaultObject.images[0] : 'https://sq.wenlinapp.com/appimg/send54.png';
			if(this.findFaultObject.publish_type == 3){
				return {
					title: this.findFaultObject.title,
					imageUrl: image,
					path:
						'/pages/index/detail?srouce=1&id=' +
						this.findFaultObject.object_id +
						'&type=' +
						this.findFaultObject.type +
						'&dynamics_id=' +
						this.findFaultObject.id
				};
			}else if (this.findFaultObject.publish_type == 2) {
				if (this.findFaultObject.publish_type == 2 && this.findFaultObject.type == 5) {
					return {
						title: this.findFaultObject.title,
						imageUrl: image,
						path:
							'/pages/index/cdetail?srouce=1&id=' +
							this.findFaultObject.object_id +
							'&type=' +
							this.findFaultObject.type +
							'&dynamics_id=' +
							this.findFaultObject.id
					};
				} else {
					return {
						title: this.findFaultObject.title,
						imageUrl: image,
						path:
							'/pages/index/detail?srouce=1&id=' +
							this.findFaultObject.object_id +
							'&type=' +
							this.findFaultObject.type +
							'&dynamics_id=' +
							this.findFaultObject.id
					};
				}
			} else if (this.findFaultObject.publish_type == 1) {
				return {
					title:
						this.findFaultObject.content.length > 30
							? this.findFaultObject.content.substr(0, 30) + '...'
							: this.findFaultObject.content,
					imageUrl: image,
					path:
						'/pages/index/detail?srouce=1&id=' +
						this.findFaultObject.id +
						'&type=' +
						this.findFaultObject.type +
						'&dynamics_id=' +
						this.findFaultObject.object_id
				};
			} else {
				return {
					title: this.findFaultObject.title,
					imageUrl: image,
					path:
						'/pages/index/detail?srouce=1&id=' +
						this.findFaultObject.id +
						'&type=' +
						this.findFaultObject.type +
						'&dynamics_id=' +
						this.findFaultObject.object_id
				};
			}
		} else {
			image = 'https://sq.wenlinapp.com/appimg/send54.png';
			return {
				title:uni.getStorageSync('user').user_nickname+'邀请您加入问邻，看小区新鲜事',
				imageUrl: image,
				path:'/pages/index/index'
			};
		}
	},
	methods: {
		canvasCancel(val) {
			this.scrollFixed = false;
			this.canvasFlag = val;
		},
		// 分享弹窗
		shareClick(e) {
			this.findFaultObject = e;
			this.onShareShow = true;
		},
		onShowclose() {
			this.onShareShow = false;
		},
		onShowtodo() {
			this.scrollFixed = true;
			var pages = getCurrentPages(); //获取加载的页面

			var currentPage = pages[pages.length - 1]; //获取当前页面的对象
			console.log(currentPage.route);
			// return
			var data = {}
			if(this.findFaultObject.publish_type == 1 || this.findFaultCollect.publish_type == 3){
				data.page = 'pages/index/detail'
			}else if(this.findFaultCollect.publish_type == 2){
				if(this.findFaultCollect.type == 5){
					data.page = 'pages/index/cdetail'
				}else{
					data.page = 'pages/index/detail'
				}
			}else{
				data.page = 'pages/index/detail'
			}
			if (this.findFaultObject.type == 5) {
				if(this.findFaultObject.publish_type == 2){
					data.scene = 'id=' + this.findFaultObject.object_id + '&type=' + this.findFaultObject.type + '&d_id=' + this.findFaultObject.id
				}else{
					data.scene = 'id=' + this.findFaultObject.id + '&type=' + this.findFaultObject.type
				}
			} else if(this.findFaultObject.type == 7 ){
				data.scene = 'id=' + this.findFaultObject.object_id + '&type=' + this.findFaultObject.type + '&d_id=' + this.findFaultObject.id
			}else if(this.findFaultObject.type == 8){
				data.scene = 'id=' + this.findFaultObject.object_id + '&type=' + this.findFaultObject.type + '&d_id=' + this.findFaultObject.id
			}else{
				data.scene = 'id=' + this.findFaultObject.id + '&type=' + this.findFaultObject.type
			}
			this.Api.getWXACodeUnlimit(data).then(result => {
				if (result.code == 1) {
					this.$nextTick(() => {
						this.onShareShow = false;
						this.posterData.posterImgUrl = this.findFaultObject.images.length ? this.findFaultObject.images[0] : 'https://sq.wenlinapp.com/appimg/share500400.jpg';
						if (this.findFaultObject.publish_type == 3 || this.findFaultObject.publish_type == 2) {
							this.posterData.title = this.findFaultObject.title;
						} else if(this.findFaultObject.publish_type == 1){
							this.posterData.title = this.findFaultObject.content;
						}else{
							this.posterData.title = this.findFaultObject.title;
						}
						if (this.posterData.title.length > 35) {
							this.posterData.title = this.posterData.title.substr(0, 35) + '...';
						}
						this.posterData.avatarUrl = uni.getStorageSync('user').avatar;
						this.posterData.posterCodeUrl = result.data;
						this.posterData.des = uni.getStorageSync('user').user_nickname + '给你分享了一个' + Tool.resultValue(this.findFaultObject.type) + '信息';
						this.$forceUpdate();
						setTimeout(() => {
							this.canvasFlag = false; //显示canvas海报
							this.deliveryFlag = false; //关闭分享弹窗
							this.$refs.hchPoster.posterShow();
						}, 500);
					});
				}
			});
		},
		onShowshare() {
			this.onShareShow = false;
		},
		moreClick(e) {
			this.findFaultType = e.type;
			this.findFaultCollect = e.user_favorite == 0 ? false : true;
			this.findFaultObject = e;
			this.findFaultValue = true;
		},
		//收藏处理
		fCollect(e) {
			var data = {
				dynamics_id: this.findFaultObject.id,
				object_type: this.findFaultObject.type
			};
			if (e.type == 5 || e.type == 7) {
				data.dynamics_id = this.findFaultObject.object_id;
			}
			if (this.findFaultObject.user_favorite == 0) {
				this.Api.setFavorites(data).then(result => {
					if (result.code == 1) {
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
						this.findFaultValue = false;
						this.searchDynamics();
					} else {
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
					}
				});
			} else if (this.findFaultObject.user_favorite == 1) {
				this.Api.unsetFavorites(data).then(result => {
					if (result.code == 1) {
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
						this.findFaultValue = false;
						this.searchDynamics();
					} else {
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
					}
				});
			}
		},
		//找错处理
		fFind(e) {
			this.findFaultValue = false;
			this.messageText = '';
			this.$forceUpdate();
			this.messageShow = true;
		},
		report() {
			//findFaultObject
			uni.navigateTo({
				url: '/pages/update/report?object_id=' + this.findFaultObject.id + '&object_type=' + this.findFaultObject.type,
				success: () => {
					this.findFaultValue = false;
				}
			});
		},
		fClose() {
			this.findFaultValue = false;
		},
		helpPush(e) {
			this.helpObj = e;
			this.$getMyscore(res => {
				if (res.code == 1) {
					this.score = res.data.score;
					if (this.score == 0) {
						uni.showToast({
							title: '您的积分不足，请参加积分任务',
							icon: 'none',
							duration: 2000
						});
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/update/integral'
							});
						}, 2000);
					} else {
						this.helpShow = true;
					}
				}
			});
		},
		Helpcancel() {
			this.helpShow = false;
		},
		ok(e) {
			var score = this.$refs.Help.inputValue;
			if (!score) {
				uni.showToast({
					title: '请输入帮推积分',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			var data = {
				dynamics_id: this.helpObj.id,
				type: this.helpObj.type,
				community_id: uni.getStorageSync('community_id'),
				score: score
			};
			//
			// if(this.helpObj.type == 7 || this.helpObj.type == 5){
			// 	data.dynamics_id = this.helpObj.id
			// }
			this.Api.communityDynamicsPushDynamics(data).then(result => {
				if (result.code == 1) {
					uni.showToast({
						title: result.msg,
						duration: 2000,
						success: () => {
							setTimeout(() => {
								this.helpShow = false;
								this.$refs.Help.inputValue = 0;
								this.searchDynamics();
							}, 500);
						}
					});
				} else {
					uni.showToast({
						title: result.msg,
						duration: 2000,
						success: () => {}
					});
				}
			});
		},
		cateHandler(item) {
			this.type = item.id;
			// this.tagList.map((sitem)=>{
			// 	if(sitem.id = item.id){
			// 		this.cateIndex =  item.id
			// 		if(item.id == 0){
			// 			this.allFlag = true
			// 		}else{
			// 			this.allFlag = false
			// 		}
			// 	}
			// })
			this.cateIndex = item.id;
			if (item.id == 0) {
				this.allFlag = true;
			} else {
				this.allFlag = false;
			}
			this.searchFlag = true;
			this.page = 1;
			this.page_size = 10;
			this.list = [];
			this.total_pages = 0;
			this.$forceUpdate();
			this.searchDynamics();
		},
		customConduct() {},
		cateClick(item) {
			this.cateIndex = item.id;
			this.tagList.map(sitem => {
				if (sitem.id == item.id) {
					this.type = item.id;
				}
			});
			this.page = 1;
			this.page_size = 10;
			this.list = [];
			this.total_pages = 0;
			this.searchDynamics();
		},
		searcInput(e) {
			this.searchValue = e.detail.value;
		},
		searchClose(e) {
			this.searchValue = '';
			this.searchFlag = false;
			this.nodataFlag = false;
			this.list = [];
		},
		searchHandler() {
			if (!this.searchValue) {
				uni.showToast({
					icon: 'none',
					title: '请输入搜索关键字'
				});
				return;
			} else {
				this.searchFlag = true;
				this.page = 1;
				this.page_size = 10;
				this.list = [];
				this.total_pages = 0;
				this.searchDynamics();
			}
		},
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
		},
		searchDynamics(ismore) {
			var data = {
				title: this.searchValue,
				community_id: uni.getStorageSync('community_id'),
				page: this.page,
				page_size: this.page_size,
				type: this.type,
				latitude: uni.getStorageSync('latitude'),
				longitude: uni.getStorageSync('longitude')
			};
			this.Api.searchDynamics(data).then(result => {
				if (result.code == 1) {
					if (ismore) {
						this.list = thic.list.concat(result.data.list);
						this.total_pages = result.data.total_pages;
					} else {
						this.list = result.data.list;
						this.total_pages = result.data.total_pages;
					}
					if (this.list.length) {
						this.nodataFlag = false;
					} else {
						this.nodataFlag = true;
					}
				}
			});
		}
	},
	components: {
		navigationCustom,
		PostItem,
		Nodata,
		Help,
		FindFault,
		Onshare,
		hchPoster
	}
};
</script>

<style lang="scss" scoped>
.searchwrap {
	display: flex;
	flex-direction: column;
	background: white;
	min-height: 100vh;
	.searchcontent {
		width: 100%;
		padding: 32upx 24upx 24upx 24upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		.searchfxied {
			position: fixed;
			padding: 32upx 24upx 24upx 24upx;
			box-sizing: border-box;
			left: 0;
			top: 0;
			width: 100%;
			height: 180upx;
			display: flex;
			flex-direction: column;
			background: white;
			z-index: 3000;
			.searchwraptop {
				display: flex;
				flex-direction: row;
				justify-content: center;
				width: 100%;
				height: 60upx;
				.area {
					font-size: 28upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
					margin-right: 32upx;
					line-height: 60upx;
					height: 60upx;
				}
				.searchinputwrap {
					display: flex;
					flex-direction: row;
					flex: 1;
					position: relative;
					height: 60upx;
					.searchinput {
						width: 100%;
						height: 60upx;
						background: rgba(222, 222, 222, 0.3);
						border-radius: 30upx;
						padding-left: 30upx;
					}
					.searchclose {
						width: 40upx;
						height: 40upx;
						position: absolute;
						right: 10upx;
						top: 10upx;
						z-index: 3000;
					}
				}
				.searchbtn {
					font-size: 28upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					line-height: 60upx;
					text-align: center;
					margin-left: 40upx;
				}
			}
			.searchtip {
				display: flex;
				flex-direction: column;
				margin-top: 96upx;
				.searchtext {
					font-size: 24upx;
					text-align: center;
					width: 100%;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
					line-height: 34upx;
				}
				.searchcate {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					.cateitem {
						width: 33.33%;
						height: 42upx;
						margin-top: 48upx;
						text-align: center;
						border-right: 1upx solid #dedede;
						.catetext {
							width: fit-content;
							padding: 5upx 20upx;
							background: rgba(222, 222, 222, 0.3);
							border-radius: 21upx;
							font-size: 28upx;
							text-align: center;
							line-height: 48upx;
							font-family: PingFang-SC-Medium, PingFang-SC;
							font-weight: 500;
							color: rgba(51, 51, 51, 1);
						}
					}
					.cateitem:nth-child(3n) {
						border-right: 1upx solid transparent;
					}
				}
			}
			.searchlist {
				display: flex;
				flex-direction: column;
				margin-top: 24upx;
				.tagwrap {
					display: flex;
					flex-direction: row;
					width: 100%;
					.tagitem {
						font-size: 26upx;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
						line-height: 34upx;
						padding-left: 20upx;
						padding-right: 20upx;
						height: 42upx;
						line-height: 42upx;
						margin-right: 30upx;
						text-align: center;
						background: rgba(222, 222, 222, 0.3);
						border-radius: 21upx;
						width: fit-content;
					}
					.active {
						background: rgba(255, 156, 0, 0.1);
						color: #ff9c00;
					}
				}
			}
		}
		.listwrap {
			display: flex;
			flex-direction: column;
			margin-top:160upx;
			/deep/ .nodata {
				margin-top: 500upx;
			}
		}
	}
}
.searchwrapFix{
	overflow: hidden;
	height: 100vh;
}
</style>
