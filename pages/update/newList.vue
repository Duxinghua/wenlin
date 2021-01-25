<template>
	<!-- 新鲜事 -->
	<view class="newlist">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				config: {
					title: '新鲜事列表', //title
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
				navIndex:1,
				page:1,
				page_size:10,
				community_menu:'',
				list:[],
				total:0,
				total_page:0
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		mounted() {
			this.community_menu = uni.getStorageSync('community_menu')
			this.getList()
		},
		methods:{
			customConduct(e){
				console.log(e)
			},
			getList(ismore){
				var data = {
					page:this.page,
					page_size:this.page_size,
					community_id:uni.getStorageSync('community_id'),
					type:this.navIndex
				}
				this.Api.myNeighbour(data).then((result) => {
					if(result.code == 1){
						if(ismore){
							this.total_page = result.data.total_page
							this.list = this.list.concat(result.data.list)
							this.total = result.data.total
							
						}else{
							this.total_page = result.data.total_page
							this.list = result.data.list
							this.total = result.data.total
						}
					}
				})
			}
		},
		onReachBottom() {
			if(this.total_page > this.page){
				this.page++
				this.getList(true)
			}
		},
		components: {
			navigationCustom
		}
	};
</script>

<style lang="scss" scoped>
	.newlist{
		display: flex;
		flex-direction: column;
	}
</style>
