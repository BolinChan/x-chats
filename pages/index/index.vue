<template>
	<view></view>
</template>

<script>
	export default {
		onLoad() {
			if (process.env.NODE_ENV === 'development') {
				// uni.reLaunch({ url: '/pages/login/login' });
				uni.switchTab({ url: '/pages/chats/chats' });
			} else {
				this.tools.loading();
				setTimeout(() => this.$store.dispatch('checkToken'), 1000);
			}
		}
	};
</script>

<style></style>
