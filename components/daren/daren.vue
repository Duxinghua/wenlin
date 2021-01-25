<template>
	<view class="daren">
		<u-image width="112rpx" height="112rpx" :src="src"></u-image>
		<view class="userinfo">
			<view class="username">
				去就二天以内去看
			</view>
			<view class="tagwrap">
				<view class="tagitem">
					家政
				</view>
			</view>
		</view>
		<view class="scorewrap">
			<image src="../../static/push-a.png" class="push"></image>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	props:{
			item:{
				type: Object
			}
	},
	methods:{
		
	}
};
</script>

<style lang="scss" scoped>
	.daren{
		display: flex;
		flex-direction: column;
		width:100%;
		.userinfo{
			display: flex;
			flex-direction: column;
			.tagwrap{
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				align-content: flex-start;
				.tagitem{
					padding:3px 6px;
					box-sizing: border-box;
					background: #95A0B6;
					font-size: 16px;
					color:white;
					border-radius: 10px;
					margin-right:20px;
				}
			}
		}
		.scorewrap{
			display: flex;
			flex-direction: row;
			align-items: center;
			.push{
				width:38px;
				height:36px;
				margin-right:10px;
			}
		}
	}
	
</style>
