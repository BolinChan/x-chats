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
		.search-bar {
			background-color: #F7F7F7;
			height: $tabbar-hei;
			padding: 10px 30rpx;
		
			.ipt {
				background-color: #E9E9E9;
				height: 30px;
				border-radius: $radius;
			}
		}
	}
</style>
