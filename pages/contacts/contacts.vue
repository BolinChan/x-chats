<template>
	<view class="contacts">
		<view class="search-bar">
			<view class="x-center x-desc ipt">
				<text class="icon-search"></text>搜索
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped lang="scss">
	.contacts{
		.search-bar{
			background-color: #F7F7F7;
			padding: 20rpx 30rpx;
			.ipt{
				background-color: rgb(233, 233, 233);
				height: 30px;
				border-radius: 15rpx;
			}
		}
	}
</style>
