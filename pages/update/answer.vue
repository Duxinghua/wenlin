<template>
	<view class="answer">
		<image :src="Config.minUrl + 'anserbg.jpg'" class="bg"></image>
		<image  @click.stop="detailHandler" src="../../static/answerbtn.png" class="answerbtn" ></image>
		<view class="subtext">
			已有 {{detail.detail ? detail.detail.join_num : 0}} 人参加活动
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				Config:this.Config,
				answer_id:'',
				detail:{
					
					detail:{
						join_num:0
					}
				}
			}
		},
		onLoad(options) {
			console.log(options,'options')
			var that = this
			var auth = new Promise(function(resolve, reject) {
				var token = uni.getStorageSync('token')
				var all_community = uni.getStorageSync('all_community')
				if(!token && !all_community){
					uni.login({
						success: res => {
							let { errMsg, code } = res;
							if (errMsg == 'login:ok') {
								that.Api.wechatAuth({ code: code }).then(result => {
									if (result.code == 1) {
										uni.setStorageSync('token', result.data.token);
										uni.setStorageSync('user', result.data.user);
										uni.setStorageSync('mobile', result.data.user.mobile);
										uni.setStorageSync('all_community', result.data.all_community.length ? result.data.all_community : []);
										resolve();
									}
								});
							}
						}
					});
				}else{
					resolve();
				}
			});
			auth.then(status => {
				var token = uni.getStorageSync('token');
				var all_community = uni.getStorageSync('all_community');
				if(options.scene){
				var scene = decodeURIComponent(options.scene);
				var arr = scene.split("=")
					if(arr[0]){
						
						that.answer_id = arr[1]
						
					}
				}
				if(options.answer_id){
					that.answer_id  = options.answer_id
				}
				var data = {
					answer_id:that.answer_id
				}
				that.Api.questionList(data).then((result)=>{
					if(result.code == 1){
						that.detail = result.data
					}
				})
			})
			
		},
		methods:{
			detailHandler(){
				uni.navigateTo({
					url:'answerdetail?answer_id='+this.answer_id
				})
				if(this.detail.has_answer == 1){
					//return this.$u.toast('您已参加此次答题，请下次再来参与')
				}else{
					uni.navigateTo({
						url:'answerdetail?answer_id='+this.answer_id
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.answer{
		display: flex;
		flex-direction: column;
		position: relative;
		.bg{
			position: absolute;
			left:0;
			top:0;
			width:100%;
			height: 1624rpx;
		}
		.answerbtn{
			position: fixed;
			width:618rpx;
			height:148rpx;
			left:50%;
			transform: translateX(-50%);
			bottom: 250rpx;
		}
		.subtext{
			position: fixed;
			left:50%;
			width: fit-content;
			transform: translateX(-50%);
			bottom: 200rpx;
			color:white;
		}
	}
</style>
