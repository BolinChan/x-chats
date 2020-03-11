import config from "../config";
import { isUrl, fetch, download } from "../services/request";
const sha1 = require('sha1');

// 富文本图片样式设置
export const richTextReplace = (text = '') => {
	if(text) {
		const regex = new RegExp('<img', 'gi');
		text = text.replace(regex, `<img style="max-width: 100%;"`);
	}
	return text;
}

// sha1加密
export const pwd2sha1  = (val) => {
	return val? sha1(val): '';
}

// 获取缓存
export const getStorageSync = (key) => {
	try {
		key = uni.getStorageSync(key);
	} catch (err) {
		key = "";
	}
	return key;
};

// 选择图片
/**
 * @description 选择图片
 * @param {number=}  count
 * @param {Object=}  payload
 * @return {Object}
 */
export const chooseImage = (count = 1, payload = {}) => new Promise((resolve) => {
	uni.chooseImage({
		count,
		success: ({ tempFilePaths }) => resolve({ err: false, msg: "获取图片成功~", data: tempFilePaths }),
		fail: () => resolve({ err: true, msg: "获取图片失败！", data: "" }),
		...payload
	});
});

// 消息提示
export const toast = (title = "", icon = "none", payload = {}) => {
	hideLoading();
	if (!title) return;
	if (typeof title !== "string") {
		if('err' in title) {
			if (!title.err) icon = "success";
			title = title.msg;
		} else {
			title = '';
		}
	}
	if (title) uni.showToast({ icon, title, ...payload });
};

// loading提示框(≤30s)
let delay = null;
let timer = null;
export const loading = (title = "", mask = true) => {
	hideLoading();
	delay = setTimeout(() => {
		clearTimeout(delay);
		delay = null;
		uni.showLoading({ title, mask, success: startLoading });
	}, 300);
};
const startLoading = () => {
	timer = setTimeout(hideLoading, 30000);
};
export const hideLoading = () => {
	if(delay){
		clearTimeout(delay);
		delay = null;
	}
	if (timer) {
		clearTimeout(timer);
		timer = null;
		uni.hideLoading();
	}
};

// 登录
export const login = provider => new Promise((resolve) => {
	uni.login({
		provider,
		success: data => resolve({ err: false, msg: "登录成功~", data }),
		fail: () => resolve({ err: true, msg: "登录失败！", data: "" })
	});
});

// 分享
export const share = (provider, payload = {}) => new Promise((resolve) => {
	uni.share({
		provider,
		success: () => resolve({ err: false, msg: "分享成功~", data: "" }),
		fail: () => resolve({ err: true, msg: "分享失败！", data: "" }),
		...payload
	});
});

// 保存图片到系统相册
export const saveImageToPhotosAlbum = (filePath) => new Promise(async (resolve) => {
	if (isUrl(filePath)) {
		filePath = await download(filePath);
		filePath = filePath.data;
	}
	if (filePath) {
		uni.saveImageToPhotosAlbum({
			filePath,
			success: () => resolve({ err: false, msg: '保存成功~', data: '' }),
			fail: () => resolve({ err: true, msg: '保存失败！', data: '' })
		})
	}
});

// 调用第三方应用
export const openURL = url => new Promise((resolve) => {
	plus.runtime.openURL(url, () => resolve({ err: true, msg: "打开失败，请确保应用已安装！", data: "" }));
});

// 更新APPwgt文件
export const updateWgt = () => {
	return new Promise(async (reslove, reject) => {
		plus.runtime.getProperty(plus.runtime.appid, async (widgetInfo) => {
			let res = await fetch(config.wgt_url, widgetInfo);
			const { data, err, msg } = res;
			if (!err) {
				const { update, wgtUrl } = data;
				if (update && wgtUrl) {
					uni.showLoading({ title: '正在更新，请稍后', mask: true });
					uni.hideLoading();
					plus.downloader.createDownload(
						wgtUrl, 
						{ filename: '_doc/update/' + widgetInfo.name + '/' + new Date().getTime() + '/' },
						(res, code) => {
							uni.hideLoading();
							plus.runtime.install(
								res.filename, 
								{ force: false },
								(res) => { plus.runtime.restart() },
								(e) => { uni.redirectTo({ url: '/pages/index/index' }) }
							);
						}
					).start();
				}
			} else {
				uni.hideLoading();
				uni.redirectTo({ url: '/pages/index/index' });
			}
		});
	});
}
