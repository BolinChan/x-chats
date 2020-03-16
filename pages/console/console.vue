<template>
	<view class="console">
		<scroll-view 
			class="msgs" 
			scroll-y 
			:scroll-top="scrollTop" 
			:scroll-into-view="scrollToView" 
			:scroll-with-animation="scrollAnimation"
			scroll-anchoring
		>
			<view class="container">
				<view 
					class="x-row msg" 
					:class="{ 'reversal': item.status !== 'received' }" 
					v-for="(item, index) in msg" 
					:key="index"
					:id="`msg${index}`"
				>
					<view class="avatar" v-if="item.status === 'received'">
						<x-thumb :src="item.avatar" size="80"></x-thumb>
					</view>
					<view class="context" v-if="item.type === 'text'">
						{{item.content}}
					</view>
					<view class="image" v-if="item.type === 'image'">
						<image :src="item.content" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="x-bottom x-row edit-bar">
			<view class="action" @click="imgMsg">
				<image src="/static/console/plus.png" mode="widthFix"></image>
			</view>
			<input 
				class="editer" 
				type="text" 
				placeholder="Message" 
				cursor-spacing="10" 
				confirm-type="send" 
				confirm-hold v-model="message"
				@confirm="textMsg" 
			/>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	import msgList from '../../data';
	const format = "YYYY-MM-DD hh:mm";
	let isLimit = false;
	export default {
		data() {
			return {
				msg: [],
				scrollTop: 0,
				scrollToView: '',
				scrollAnimation: false,
				message: ""
			};
		},
		onLoad() {
			this.$tools.loading();
			this.fetchData();
		},
		methods: {
			fetchData() {
				this.$tools.hideLoading();
				uni.setNavigationBarTitle({ title: "好友" });
				this.msg = msgList;

				this.$nextTick(function() {
					this.scrollTop = 9999;
					this.$nextTick(function() {
						this.scrollAnimation = true;
					});
				})
			},
			async imgMsg() {
				const { err, data } = await this.$tools.chooseImage();
				if (!err) {
					const content = data[0];
					this.sendMsg({ content, type: 'image' })
				}
			},
			textMsg() {
				const content = this.message;
				let str = content.trimAll();
				this.message = "";
				if (!str) {
					return this.$tools.toast('不能发送空白消息！');
				}
				this.sendMsg({ content, type: 'text' });
			},
			scrollToBottom() {
				const msg = this.msg;
				if (msg && msg.length) {
					this.scrollToView = `msg${msg.length - 1}`;
				}
			},
			sendMsg(msg) {
				if (msg) {
					msg = {
						...msg,
						avatar: 'https://img.la/88x88',
						nick: '小明',
						time: dayjs().format(format),
						status: 'temp'
					}
					this.receiveMsg(msg);
					
					// simulated msg
					setTimeout(() => {
						msg = {
							...msg,
							avatar: '/static/logo.png',
							nick: '好友A',
							time: dayjs().format(format),
							status: 'received'
						}
						this.receiveMsg(msg);
					}, 2000);
				}
			},
			receiveMsg(msg) {
				this.msg.push(msg);
				this.$nextTick(this.scrollToBottom);
				const { status } = msg;
				if (status === 'received') {
					if (!isLimit) {
						uni.vibrateLong({ success: this.limitVibrate })
					}
				}
			},
			limitVibrate() {
				isLimit = true;
				setTimeout(() => {
					isLimit = false;
				}, 1000);
			}
		}
	}
</script>

<style scoped lang="scss">
	$basehei: 30px;

	.console {
		.msgs {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: $tabbar-hei;
			overflow-anchor: auto;

			.container {
				padding: 15rpx;

				.msg {
					padding: 15rpx;
					align-items: flex-start;

					.avatar {
						padding-right: 20rpx;
					}

					.context {
						background-color: #E9E9E9;
						line-height: 40rpx;
						padding: 20rpx;
						min-width: 120rpx;
						min-height: 80rpx;
						position: relative;
						border-radius: $radius;
						overflow: hidden;
						word-wrap: break-word;
						white-space: pre-wrap;
					}

					.image {
						border-radius: $radius;
						width: 250rpx;
						height: 250rpx;
						overflow: hidden;

						image {
							width: 100%;
						}
					}
				}

				.reversal {
					flex-direction: row-reverse;

					.context {
						background-color: $main-color;
						color: #FFFFFF;
						max-width: calc(750rpx - 60rpx - 80rpx - 20rpx);
					}
				}
			}
		}

		.edit-bar {
			position: fixed;
			left: 0;
			right: 0;
			align-items: flex-end;
			min-height: $tabbar-hei;
			padding: 10px 30rpx;
			background-color: #F7F7F7;

			.action {
				width: $basehei;
				height: $basehei;
				margin-right: 20rpx;

				image {
					width: $basehei;
					height: $basehei;
				}
			}

			.editer {
				background-color: #FFFFFF;
				height: $basehei;
				// 	min-height: $basehei;
				// 	max-height: 144rpx;
				// 	line-height: 42rpx;
				// 	padding: 9rpx 20rpx;
				padding-left: 20rpx;
				padding-right: 20rpx;
				border-radius: $radius;
			}
		}
	}
</style>
