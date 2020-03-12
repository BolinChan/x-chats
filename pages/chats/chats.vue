<template>
	<view class="chats">
		<view class="search-bar">
			<view class="x-center x-desc ipt">
				<text class="icon-search"></text>搜索
			</view>
		</view>
		<view v-if="list">
			<view class="list" v-if="list.length">
				<view 
					class="x-row item" 
					hover-class="item-hover" 
					v-for="(item, index) in list" 
					:key="index" 
					@click="$toNav('console', { userid: index })"
				>
					<view class="thumb">
						<x-thumb src="https://img.la/110x110" size="110"></x-thumb>
					</view>
					<view class="x-flex x-col main">
						<view class="x-row title">
							<view class="x-flex x-one-line nick">
								Notion 中文社区
							</view>
							<view class="x-sub x-desc time">
								11/22/19
							</view>
						</view>
						<view class="x-flex x-row context">
							<view class="x-flex x-sub x-desc msg">
								<x-ellipsis lines="2">
									监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参），参考示例监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参），参考示例
								</x-ellipsis>
							</view>
							<view class="tag">
								<view class="x-center x-info badge">
									99
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<x-empty v-else></x-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: null
			};
		},
		onLoad() {
			this.fetchData();
		},
		methods: {
			fetchData() {
				this.list = new Array(10);
			}
		}
	}
</script>

<style scoped lang="scss">
	.chats {
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

		.list {
			.item {
				transition: all .1s;
				padding-left: 30rpx;

				.thumb {
					padding-right: 20rpx;
				}

				.main {
					height: 150rpx;
					padding: 20rpx 0;
					padding-right: 10rpx;
					border-bottom: $border;

					.title {
						padding-bottom: 10rpx;

						.nick {
							padding-right: 20rpx;
							font-weight: 600;
						}

						.time {
							padding-right: 20rpx;
						}
					}

					.context {
						.msg {
							padding-right: 20rpx;
						}

						.tag {
							padding-right: 20rpx;

							.badge {
								color: #FFFFFF;
								background: $linear;
								padding: 0 10rpx;
								border-radius: 19rpx;
								min-width: 38rpx;
								min-height: 38rpx;
							}
						}
					}
				}
			}

			.item:last-child {
				.main {
					border: none;
				}
			}

			.item-hover {
				@extend %x-hover;
			}
		}
	}
</style>
