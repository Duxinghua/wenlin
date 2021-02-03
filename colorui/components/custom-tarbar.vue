<template>
	<view class="cu-bar tabbar bg-white cu-bar-tabbar cu-footer-tabbar">
		<view :class="['action',selectIndex == 1? 'text-customy-active' : 'text-customy']" @click="switchTab(1)">
			<image class="tab-meico" :src="selectIndex == 1 ? '../../static/home-a.png' : '../../static/home.png'"></image>
			<view :class="['tab-item',selectIndex == 1 ? 'tab-item-active' : '']">首页</view>
		</view>
		<view :class="['action',selectIndex == 4? 'text-customy-active' : 'text-customy']" @click="switchTab(4)">
			<image class="tab-meico" :src="selectIndex == 4 ? '../../static/find-a.png' : '../../static/find.png'"></image>
			<view :class="['tab-item',selectIndex == 4? 'tab-item-active' : '']">发现</view>
		</view>
		<view :class="['action','tab-action',selectIndex == 2 ? 'text-customy-active' : 'text-customy','add-action']" @click="switchTab(2)">
<!-- 			<button :style="{'background': selectIndex == 2 ? '#FF9C00' : '#d8d8d8'}" :class="['cu-btn','cuIcon-add',selectIndex == 2 ? 'text-customy-fixa' : 'text-customy-fixb','shadow']"></button>
 -->			<image class="tab-meico tab-pusb-a" src='../../static/pushb-a.png'></image>
		</view>
		<view :class="['action',selectIndex == 5? 'text-customy-active' : 'text-customy']" @click="switchTab(5)">
			<image class="tab-meico" :src="selectIndex == 5 ? '../../static/convenience-a.png' : '../../static/convenience.png'"></image>
			<view :class="['tab-item',selectIndex == 5? 'tab-item-active' : '']">便民</view>
		</view>
		<view :class="['action',selectIndex == 3? 'text-customy-active' : 'text-customy']" @click="switchTab(3)">
<!-- 			<view class="cuIcon-my"></view> -->
			<image class="tab-meico" :src="selectIndex == 3 ? '../../static/me-a.png' : '../../static/me.png'"></image>
			<view :class="['tab-item',selectIndex == 3? 'tab-item-active' : '']">我的</view>
		</view>
	</view>
</template>

<script>
import Bus from '../../utils/bus.js'
export default {
	props:['selectIndex'],
	data() {
		return {
			activeIndex: '',
			activeNum:1
		};
	},
	onLoad() {
		// this.activeIndex = this.selectIndex
	},
	watch:{
		activeIndex(n,o){
			console.log(n,o)
		}
	},
	methods: {
		switchTab(e){
			uni.setStorageSync('o',e)
			var index = e
			if(e == 3){
				if(!uni.getStorageSync('token')){
					Bus.$emit('noToken')
					return
				}else{
					if(!uni.getStorageSync('community_id')){
						Bus.$emit('noToken')
						return
					}
				}
			}
			if(e == 2){
				if(!uni.getStorageSync('token')){
					// Bus.$emit('noToken')
					return
				}else{
					if(!uni.getStorageSync('community_id')){
						// Bus.$emit('noToken')
						return
					}
				}
			}
			if(index == 2){
				var target = uni.getStorageSync('menuIndex')

				if(target == 1){
					index = 1
					
				}else if(target == 3){
					index = 3
				}else if(target == 2){
					console.log(target,'ta')
				}else if(target == 4){
					index = 4
				}else if(target == 5){
					index = 5
				}
			}else if(index == 3){
				uni.setStorageSync('menuIndex',3)
			}else if(index == 1){
				uni.setStorageSync('menuIndex',1)
			 
			}else if(index == 4){
				uni.setStorageSync('menuIndex',4)
			}else if(index == 5){
				uni.setStorageSync('menuIndex',5)
			}
			

			
			this.$emit('togger',index)
		}
	},
}
</script>

<style lang="scss" >
.cu-bar-fixed{
	position: fixed;
	left:0;
	top:0;
	width:100%;
}
.tab-meico{
	width: 60upx;
	height:56upx;
	display: flex;
	margin: 0 auto;
}
.tab-pusb-a{
	position: absolute;
	z-index: 15;
	width:104upx;
	height: 104upx;
	border-radius: 50%;
	border: 13upx solid white;
	left:50%;
	transform: translateX(-50%);
	top:-50upx;
}
.tab-item{
	font-size: 22upx;
	font-family: PingFang SC;
	font-weight: 500;
	color:#95A0B6;
	margin-top:10upx;
}
.tab-item-active{
	color:#020433;
}
.tab-action{
	border-radius: 50%;
}
.cu-footer-tabbar{
	box-shadow: 0upx 12upx 20upx 0upx rgba(0, 0, 0, 0.4);
}
</style>
