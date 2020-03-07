<template>
	<view class="x-bottom" :class="{ 'x-safearea': safearea }">
		<view class="box"><slot></slot></view>
	</view>
</template>

<script>
	export default {
		name: 'x-bottom',
		props: {
			safearea: {
				type: Boolean,
				default: true
			}
		}
	};
</script>

<style scoped lang="scss">
	.x-bottom {
		background-color: #fff;
		position: fixed;
		left: 0;
		right: 0;
		.box {
			min-height: $tabbar-hei;
		}
	}
</style>
