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
			<view class="x-row msg" v-for="(item, index) in msg" :key="index" :id="`msg${index}`">
				<x-thumb src="https://img.la/88x88"></x-thumb>
				<view class="context">dsadsadsadasdsadasdasdsa{{index}}</view>
			</view>
		</scroll-view>
		<view class="x-bottom x-row edit-bar">
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
	import msg from './../../data';
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
			setTimeout(()=>{
				this.fetchData();
			}, 1000);
		},
		// onShow() {
		// 	this.scrollTop = 99999;
		// },
		methods: {
			fetchData() {
				uni.setNavigationBarTitle({ title: "好友" });
				this.msg = msg;
				this.$nextTick(function(){
					this.scrollTop = 9999;
					this.$nextTick(function() {
						this.scrollAnimation = true;
					});
				})
				// if (this._props && this._props.hasOwnProperty('userid')) {
				// 	const { userid } = this._props;
				// 	uni.setNavigationBarTitle({ title: `好友${userid+1}` });
				// 	this.msg = new Array(15);
				// 	this.msg = [
				// 		{
				// 			type: 'text',
				// 			constent: '在吗？',
				// 			status: 'sended'
				// 		},
				// 		{
				// 			type: 'text',
				// 			constent: "waht's up?",
				// 			status: 'received'
				// 		}
				// 	];
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
			//滚动到底部
			scrollToBottom(){
				const msg = this.msg;
				if(msg && msg.length){
					this.scrollToView = `msg${msg.length - 1}`;
				}
			},
			//重置scrollToView
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
			.msg{
				padding: 30rpx;
				align-items: flex-start;
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
