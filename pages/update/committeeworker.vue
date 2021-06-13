<template>
	<view class="worker">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="workerlist">
			<view class="workeritem" v-for="(item,index) in list" :key="index">
<!-- 				<image :src="item.avatar"  ></image> -->
				<view class="avatar">
					<u-image :src="item.avatar" :height="headerHeight" mode="aspectFill"></u-image>
				</view>
				<view class="userinfo">
					<view class="um"><text class="name">{{item.user_name}}</text><text class="work">{{item.job_title}}</text></view>
					<text class="des">{{item.description}}</text>
				</view>
				<text class="mobile" @click="callPhone(item.contact_phone)">联系电话</text>
			</view>
			<Nodata v-if="NodataFlag" />
		</view>
		
	</view>
</template>

<script>
import Nodata from '@/components/nodata/nodata.vue';
import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
export default {
	components:{
		Nodata,
		navigationCustom
	},
	data() {
		return {
			id: 0, // 使用 marker点击事件 需要填写id
			title: 'map',
			latitude: 39.909,
			longitude: 116.39742,
			covers: [
				{
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../static/adico.png'
				}
			],
			config: {
				title: '工作人员', //title
				bgcolor: 'white', //背景颜色
				fontcolor: 'rgba(51, 51, 51, 1)', //文字颜色，默认白色
				type: 1, //type 1，3胶囊 2，4无胶囊模式
				transparent: false, //是否背景透明 默认白色
				linear: true, //是为开启下滑渐变
				share: false //是否将主页按钮显示为分享按钮
				// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
				// menuText:"返回", 当type为3或4的时候icon右边的文字
			},
			scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
			scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
			committee_id:'',
			list:[],
			NodataFlag:false
		};
	},
	mounted() {
		if(this.$mp.query.id){
			this.committee_id = this.$mp.query.id
			var data = {
				committee_id:this.committee_id
			}
			this.getList(data)
		}
		if(this.$mp.query.title){
			this.config.title = this.$mp.query.title
		}
	},
	computed:{
		headerHeight(){
			return 96
		}
	},
	methods:{
		getList(data){
			this.Api.getPersonnels(data).then((result) => {
				if(result.code == 1){
					this.list = result.data
					if(this.list.length){
						this.NodataFlag = false
					}else{
						this.NodataFlag = true
					}
				}
			})
		},
		callPhone(obj){
			uni.makePhoneCall({
				phoneNumber:obj
			})
		}
	}
};
</script>

<style lang="scss" scoped>
	.worker{
		display: flex;
		flex-direction: column;
		.workerlist{
			padding:24upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			/deep/ .nodata{
				
			}
			.workeritem{
				width:100%;
				display: flex;
				flex-direction: row;
				align-items: center;
				padding-top:32upx;
				padding-bottom: 32upx;
				border-bottom: 2upx solid rgba(222, 222, 222, 0.6);
				.avatar{
					width:96upx;
					height:96upx;
					border-radius: 50%;
					overflow: hidden;
					margin-right:16upx;
				}
				.userinfo{
					display: flex;
					flex-direction: column;
					.um{
						display: flex;
						flex-direction: row;
						align-items: center;
						.name{
							height:42upx;
							font-size:30upx;
							font-family:PingFang-SC-Bold,PingFang-SC;
							font-weight:bold;
							color:rgba(51,51,51,1);
							line-height:42upx;
							margin-right:28upx;
						}
						.work{

							font-size:24upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(51,51,51,1);
	
						}
					}
					.des{
						width:400upx;
						margin-top:8upx;
						height:34upx;
						font-size:24upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(102,102,102,1);
						line-height:34upx;
					}
				}
				.mobile{
					width:140upx;
					height:56upx;
					line-height: 56upx;
					text-align: center;
					border-radius:8upx;
					border:2upx solid rgba(255,156,0,1);
					font-size:26upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(255,156,0,1);
					margin-left:auto;
				}
			}
		}
	}
	
</style>
