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
					:class="{ 'reversal': item.status !== 'received' }"
					v-for="(item, index) in msg" 
					:key="index" 
					:id="`msg${index}`"
					:animation="animationData[index] || {}"
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
				
				v-model="message"
			/>
			<view class="btn">
				<button type="primary" :disabled="!message" @click="textMsg">Send</button>
			</view>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs';
	import msgList from '../../data';
	export default {
		data() {
			return {
				msg: [],
				scrollTop: 0,
				scrollToView: '',
				scrollAnimation: false,
				animation: [],
				animationData: [],
				message:""
			};
		},
		onLoad() {
			this.$tools.loading();
			// setTimeout(()=>{
			// 	this.fetchData();
			// }, 1000);
			this.fetchData();
		},
		methods: {
			fetchData() {
				this.$tools.hideLoading();
				uni.setNavigationBarTitle({ title: "好友" });
				this.msg = msgList;
				
				// let len = msgList.length;
				// let delay = 0;
				// let limit = 100;
				// let animation = null;
				// for(let i = 0; len > i; i++) {
				// 	delay = (msgList.length - i) * limit - limit;
				// 	animation = uni.createAnimation({
				// 		duration: 300,
				// 		timingFunction: "ease",
				// 		delay
				// 	})
				// 	this.animation[i] = animation;
				// }
				
				this.$nextTick(function(){
					this.scrollTop = 9999;
					this.$nextTick(function() {
						this.scrollAnimation = true;
						// this.opacityAndTranslate();
					});
				})
			},
			// opacityAndTranslate() {
			// 	let animation = this.animation;
			// 	for(let i = 0; animation.length > i; i++){
			// 		animation[i].opacity(1).translateY(0).step()
			// 		this.animationData[i] = animation[i].export()
			// 	}
			// },
			scrolltoupper(){},
			scrolltolower(){},
			// 图片消息
			async chooseImage(){
				const { err, data } = await this.$tools.chooseImage();
				if(!err){
					console.log(data[0]);
				}
			},
			// 文本消息
			textMsg() {
				const content = this.message;
				let str = content;
				
				str = str.replace(/\ +/g,"");
				str = str.replace(/[\r\n]/g,"");
				
				this.message = "";
				if(str){
					// 基本组装
					this.sendMsg({ content, type: 'text' });
				}else{
					this.$tools.toast('不能发送空白消息');
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
			},
			// 发送消息
			sendMsg(msg) {
				if(msg){
					const time = dayjs().format("YYYY-MM-DD hh:mm:ss");
					msg = {
						...msg,
						avatar: 'https://img.la/88x88',
						nick: '小明',
						time,
						status:'temp'
					}
					this.msg.push(msg);
					this.$nextTick(function(){
						this.scrollToBottom()
					})
				}
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
					// transform: translateY(20px);
					// opacity: 0;
					padding: 15rpx;
					align-items: flex-start;
					.avatar{
						padding-right: 20rpx;
					}
					.context{
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
