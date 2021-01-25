<template>
	<view class="myspare">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view :class="['usedwrap',nodataShow ? 'usedwrapfix' : '']">
			<UsedItem  v-for="(item, index) in postList" :pitem="item" :key="index" :usedIndex="index" :avatar="show"/>
			<Nodata v-if="nodataShow"/>
		</view>
	</view>
</template>

<script>
	import UsedItem from '../../components/usedItem/useditem.vue'
	import Nodata from '../../components/nodata/nodata.vue'
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				show:false,
				config: {
					title: '我的闲置', //title
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
				query:{},
				postList:[],
				page:1,
				pages_size:10,
				total_pages:0,
				nodataShow:false
			};
		},
		mounted() {
			this.query = this.$mp.query
			if(this.query.type == 3){
				this.config.title = this.query.user_nickname+'的闲置'
			}
			this.getList()
			
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods:{
			getList(ismore){
				if(this.query.type != 3){
					this.Api.getUserDynamicsList(this.query).then((result) => {
						console.log(result)
					})
				}else{
					this.Api.getOtherUserDynamicsList(this.query).then((result) => {
						if(result.code == 1){
							if(ismore){
								this.postList = this.postList.concat(result.data.list)
								this.total_pages = result.data.total_pages
							}else{
								this.postList = result.data.list
								this.total_pages = result.data.total_pages
							}
							if(this.postList.length){
								this.nodataShow = false
							}else{
								this.nodataShow = true
							}
						}
					})
				}
		
			},
			customConduct(e){
				console.log(e)
			},
			navClick(obj){
				this.cateIndex = obj.id
			}
		},
		components: {
			navigationCustom,
			UsedItem,
			Nodata
		}
	};
</script>

<style lang="scss" scoped>
	.myspare{
		display: flex;
		flex-direction: column;
		.usedwrap {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
		}
		.usedwrapfix{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding-top:250upx;
		}
	}
</style>
