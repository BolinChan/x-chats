<template>
	<text class="x-countdown" @click="click">
		{{ second === total ? title : `${second} S` }}
	</text>
</template>

<script>
	let timer = null;
	export default {
		name: 'x-countdown',
		props: {
			title: {
				type: String,
				default: '获取验证码'
			},
			total: {
				type: [Number, String],
				default: 60
			},
			startBefore: {
				type: Function,
				default: null
			}
		},
		data() {
			return {
				second: 60
			};
		},
		created() {
			this.init();
		},
		methods: {
			init() {
				const total = Number(this.total);
				this.second = total && total > 0 ? total : 60;
			},
			async click() {
				if (this.second === this.total) {
					let res = { err: false, msg: '' };
					if (this.startBefore) {
						res = await this.startBefore();
					}
					if (res && !res.err) {
						this.$tools.toast(res);
						this.start();
					}
				}
			},
			start() {
				this.cancel();
				this.second--;
				timer = setInterval(() => {
					this.second--;
					if (this.second < 1) {
						this.init();
						this.cancel();
					}
				}, 1000);
			},
			cancel() {
				if (timer) {
					clearInterval(timer);
					timer = null;
				}
			}
		},
		beforeDestroy() {
			this.cancel();
		}
	};
</script>

<style></style>
