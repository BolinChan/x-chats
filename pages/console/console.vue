<template>
	<view class="console">
		11111
		<x-bottom :safearea="isSafearea" backgroundColor="#F7F7F7">
			<view class="x-row bottom-bar">
				<textarea placeholder="Message" auto-height @focus="focused" @blur="blured" cursor-spacing="10" />
				<view class="btn">
					<button type="primary">Send</button>
				</view>
			</view>
		</x-bottom>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msg: null,
				isSafearea: true
			};
		},
		onLoad() {
			this.fetchData();
		},
		methods: {
			fetchData() {
				if (this._props && this._props.hasOwnProperty('userid')) {
					const { userid } = this._props;
					uni.setNavigationBarTitle({ title: `好友${userid+1}` });
					this.msg = [
						{
							type: 'text',
							constent: '在吗？',
							status: 'sended'
						},
						{
							type: 'text',
							constent: "waht's up?",
							status: 'received'
						}
					];
				} else {
					this.$tools.toast('好友不存在或已删除！');
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				}
			},
			focused() {
				this.isSafearea = false;
			},
			blured() {
				this.isSafearea = true;
			}
		}
	}
</script>

<style scoped lang="scss">
	$basehei: 30px;
	.console {
		.bottom-bar{
			align-items: flex-end;
			min-height: $tabbar-hei;
			padding: 10px 30rpx;
			textarea{
				background-color: #fff;
				min-height: $basehei;
				max-height: 144rpx;
				line-height: 42rpx;
				padding: 9rpx 20rpx;
				border-radius: 15rpx;
			}
			.btn{
				padding-left: 20rpx;
				button{
					height: $basehei;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>
