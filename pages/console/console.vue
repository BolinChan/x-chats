<template>
	<view class="console">
		<scroll-view 
			class="msgs" 
			:scroll-y="true" 
			:upper-threshold="50" 
			:lower-threshold="50" 
			:scroll-top="scrollTop"
			:scroll-into-view="scrollToView" 
			:scroll-with-animation="scrollAnimation" 
			:enable-back-to-top="false"
			:show-scrollbar="false"
			@scrolltoupper="scrolltoupper" 
			@scrolltolower="scrolltolower"
		>
			<view class="container">
				<view
					class="x-row msg"
					:class="{ 'reversal': item.status === 'sended' }"
					v-for="(item, index) in msg" 
					:key="index" 
					:id="`msg${index}`"
				>
					<view class="avatar" v-if="item.status === 'received'">
						<x-thumb :src="item.avatar" size="80"></x-thumb>
					</view>
					<view class="context">{{item.content}}</view>
				</view>
			</view>
		</scroll-view>
		<view class="x-bottom x-row edit-bar">
			<view class="action" @click="chooseImage">
				<image src="/static/console/plus.png" mode="widthFix"></image>
			</view>
			<textarea 
				placeholder="Message" 
				:auto-height="true" 
				:fixed="true" 
				:cursor-spacing="10" 
				@focus="scrollToBottom" 
				@blur="reset" 
			/>
			<view class="btn">
				<button type="primary">Send</button>
			</view>
		</view>
	</view>
</template>

<script>
	import msgList from '../../data';
	export default {
		data() {
			return {
				msg: [],
				scrollTop: 0,
				scrollToView: '',
				scrollAnimation: false
			};
		},
		onLoad() {
			this.$tools.loading();
			setTimeout(()=>{
				this.fetchData();
			}, 1000);
		},
		// onShow() {
		// 	this.scrollTop = 99999;
		// },
		methods: {
			fetchData() {
				this.$tools.hideLoading();
				uni.setNavigationBarTitle({ title: "好友" });
				this.msg = msgList;
				this.$nextTick(function(){
					this.scrollTop = 9999;
					this.$nextTick(function() {
						this.scrollAnimation = true;
					});
				})
				// if (this._props && this._props.hasOwnProperty('userid')) {
				// 	const { userid } = this._props;
				// 	uni.setNavigationBarTitle({ title: `好友${userid+1}` });
				//  this.msg = msgList;
				// } else {
				// 	this.$tools.toast('好友不存在或已删除！');
				// 	setTimeout(() => {
				// 		uni.navigateBack();
				// 	}, 1000);
				// }
			},
			scrolltoupper(){
				
			},
			scrolltolower(){
				
			},
			// 选取照片
			async chooseImage(){
				const { err, data } = await this.$tools.chooseImage();
				if(!err){
					console.log(data[0]);
				}
			},
			// 滚动到底部
			scrollToBottom(){
				const msg = this.msg;
				if(msg && msg.length){
					this.scrollToView = `msg${msg.length - 1}`;
				}
			},
			// 重置scrollToView
			reset(){
				this.scrollToView = '';
			}
		}
	}
</script>

<style scoped lang="scss">
	$basehei: 30px;
	.console {
		.msgs{
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: $tabbar-hei;
			.container{
				padding: 15rpx;
				.msg{
					padding: 15rpx;
					align-items: flex-start;
					.avatar{
						padding-right: 20rpx;
					}
					.context{
						background-color: #E9E9E9;
						line-height: 40rpx;
						padding: 20rpx;
						min-height: 80rpx;
						position: relative;
						border-radius: $radius;
						overflow: hidden;
						word-wrap: break-word;
					}
				}
				.reversal{
					flex-direction: row-reverse;
					.context{
						background-color: $main-color;
						color: #FFFFFF;
						max-width: calc(750rpx - 60rpx - 80rpx - 20rpx);
					}
				}
			}
		}
		.edit-bar{
			position: fixed;
			left: 0;
			right: 0;
			align-items: flex-end;
			min-height: $tabbar-hei;
			padding: 10px 30rpx;
			background-color: #F7F7F7;
			.action{
				width: $basehei;
				height: $basehei;
				margin-right: 20rpx;
				image{
					width: $basehei;
					height: $basehei;
				}
			}
			textarea{
				background-color: #FFFFFF;
				min-height: $basehei;
				max-height: 144rpx;
				line-height: 42rpx;
				padding: 9rpx 20rpx;
				border-radius: $radius;
			}
			.btn{
				padding-left: 20rpx;
				button{
					width: 88rpx;
					height: $basehei;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>
