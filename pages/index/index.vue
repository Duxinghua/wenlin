<template>
	<view class="index">
		<Find v-if="activeIndex == 4" ref="find" />
		<My v-if="activeIndex == 3" />
		<Convenience v-if="activeIndex == 5"  ref="convenience"/>
		<Push v-if="activeIndex == 2" />
		<Home v-if="activeIndex == 1" ref="home" />
		<Toolbar :selectIndex="activeIndex" @togger="toggerHander" />
		<!-- 分享 -->
		<hchPoster ref="hchPoster" @cancel="canvasCancel" :simpleFlag="simpleFlag" :posterBgFlag="false" :canvasAttr.sync="posterData" />
		<view :hidden="canvasFlag">
			<!-- 海报 要放外面放组件里面 会找不到 canvas-->
			<canvas class="canvas" canvas-id="myCanvas"></canvas>
			<!-- 海报 -->
		</view>
		<!-- 发布组件 -->
		<Pushedit ref="Pushedit" />
	</view>
</template>

<script>
import Home from './home.vue';
import My from '../my/index.vue';
import Push from '../push/index.vue';
import Find from './find.vue';
import Toolbar from '../../colorui/components/custom-tarbar.vue';
import hchPoster from '../../wxcomponents/hch-poster/hch-poster.vue';
import Convenience from './convenience.vue';
import Pushedit from '../../components/pushedit/pushedit.vue';
export default {
	data() {
		return {
			activeIndex: 1,
			deliveryFlag: false,
			canvasFlag: true,
			canvasFlagShow: true,
			posterData: {},
			goBack: 1,
			simpleFlag: false
		};
	},
	computed: {},
	components: {
		Home,
		Find,
		My,
		Push,
		Toolbar,
		hchPoster,
		Pushedit,
		Convenience
	},
	mounted() {
		uni.setStorageSync('menuIndex', 1);
		if (this.$mp.query.index) {
			this.activeIndex = this.$mp.query.index;
		}
	},
	onShareAppMessage: function(e) {
		var image = '';	
		var shareObj = {}
		if(this.activeIndex == 1){
			shareObj = this.$refs.home.findFaultObject
		}else if(this.activeIndex == 4){
			shareObj = this.$refs.find.findFaultObject
		}else if(this.activeIndex == 5){
			shareObj = this.$refs.convenience.findFaultObject
		}
		console.log( )
		if (e.from == 'button') {
			image = shareObj.images.length ? shareObj.images[0] : 'https://sq.wenlinapp.com/appimg/send54.png';
			if(shareObj.publish_type == 3){
				return {
					title: shareObj.title,
					imageUrl: image,
					path:
						'/pages/index/detail?srouce=1&id=' +
						shareObj.object_id +
						'&type=' +
						shareObj.type +
						'&dynamics_id=' +
						shareObj.id
				};
			}else if (shareObj.publish_type == 2) {
				if (shareObj.publish_type == 2 && shareObj.type == 5) {
					return {
						title: shareObj.title,
						imageUrl: image,
						path:
							'/pages/index/cdetail?srouce=1&id=' +
							shareObj.object_id +
							'&type=' +
							shareObj.type +
							'&dynamics_id=' +
							shareObj.id
					};
				} else {
					return {
						title: shareObj.title,
						imageUrl: image,
						path:
							'/pages/index/detail?srouce=1&id=' +
							shareObj.object_id +
							'&type=' +
							shareObj.type +
							'&dynamics_id=' +
							shareObj.id
					};
				}
			} else if (shareObj.publish_type == 1) {
				if(shareObj.type != 17 && shareObj.type != 16 && shareObj.type == 18){
					var content = shareObj.content
					if(shareObj.sell_type && shareObj.sell_type == 2){
						content = '赠送:'+content
					}
					return {
						title:
							content.length > 30
								? content.substr(0, 30) + '...'
								: content,
						imageUrl: image,
						path:
							'/pages/index/detail?srouce=1&id=' +
							shareObj.id +
							'&type=' +
							shareObj.type +
							'&dynamics_id=' +
							shareObj.object_id
					};
				}else if(shareObj.type == 17){
					var content = shareObj.content
					return {
						title:
							content.length > 30
								? content.substr(0, 30) + '...'
								: content,
						imageUrl: image,
						path:
							'/pages/index/ptdetail?srouce=1&id=' +
							shareObj.id +
							'&type=' +
							shareObj.type +
							'&dynamics_id=' +
							shareObj.object_id
					};
					
				}else if(shareObj.type == 16){
					var content = shareObj.content
					return {
						title:
							content.length > 30
								? content.substr(0, 30) + '...'
								: content,
						imageUrl: image,
						path:
							'/pages/index/ysdetail?srouce=1&id=' +
							shareObj.id +
							'&type=' +
							shareObj.type +
							'&dynamics_id=' +
							shareObj.object_id
					};
					
				}else if(shareObj.type == 18){
					return {
						title: shareObj.title,
						imageUrl: image,
						path:
							'/pages/index/detail?srouce=1&id=' +
							shareObj.id +
							'&type=' +
							shareObj.type +
							'&dynamics_id=' +
							shareObj.object_id
					};
					
				}else{
					var content = shareObj.content
					return {
						title: content.length > 30
								? content.substr(0, 30) + '...'
								: content,
						imageUrl: image,
						path:
							'/pages/index/detail?srouce=1&id=' +
							shareObj.id +
							'&type=' +
							shareObj.type +
							'&dynamics_id=' +
							shareObj.object_id
					};
				}
			} else {
				return {
					title: shareObj.title,
					imageUrl: image,
					path:
						'/pages/index/detail?srouce=1&id=' +
						shareObj.id +
						'&type=' +
						shareObj.type +
						'&dynamics_id=' +
						shareObj.object_id
				};
			}
		} else {
			image = 'https://sq.wenlinapp.com/appimg/send54.png';
			return {
				title:uni.getStorageSync('user').user_nickname+'邀请你加入问邻',
				imageUrl: image,
				path:'/pages/index/index'
			};
		}
	},
	/*
	onShareTimeline(e) {
		var query = {}
	    // query=JSON.stringify(query);
	    return {
	      title: uni.getStorageSync('user').user_nickname+'邀请你加入'+uni.getStorageSync('community_name')+'小区，与邻居们一起共建共享小区',
	      imageUrl: 'https://sq.wenlinapp.com/appimg/send.png',
	      query: query,
	    }
	},
	*/
	methods: {
		canvasCancel(val) {
			this.canvasFlag = val;
		},
		changeHome() {
			this.activeIndex = 3;
		},
		toggerHander(e) {
			var index = e;
			this.activeIndex = index;
			if (uni.getStorageSync('o') == 2) {
				if (uni.getStorageSync('mobile')) {
					this.$refs.Pushedit.isMo = false;
				} else {
					this.$refs.Pushedit.isMo = true;
				}
				this.$refs.Pushedit.pushshow();
			}
		},
		createCanvasImageEvn() {
			setTimeout(() => {
				this.canvasFlag = false; //显示canvas海报
				this.deliveryFlag = false; //关闭分享弹窗
				console.log(this.posterData, 'data');
				this.$refs.hchPoster.posterShow();
			}, 500);
		}
	}
};
</script>

<style lang="scss">
.index {
	display: flex;
	flex-direction: column;
}
</style>
