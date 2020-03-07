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
let timer = null;
export const loading = (title = "", mask = true) => {
	hideLoading();
	uni.showLoading({ title, mask, success: startLoading });
};
const startLoading = () => {
	timer = setTimeout(hideLoading, 30000);
};
export const hideLoading = () => {
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

// wgt更新
export const updateWgt = () => {
	plus.runtime.getProperty(plus.runtime.appid, async (widgetInfo) => {
		const res = await fetch(config.wgt_url, widgetInfo);
		if (res && !res.err) {
			const { update, wgtUrl } = res.data;
			if (update && wgtUrl) {
				uni.showLoading({ title: "正在更新，请稍候~", mask: true });
				const { err, data } = await download(wgtUrl);
				uni.hideLoading();
				if (err) {
					uploadFail();
				} else {
					plus.runtime.install(
						data, { force: false },
						() => {
							uni.showLoading({ title: "更新成功，正在重启~" });
							setTimeout(() => plus.runtime.restart(), 1000)
						},
						() => uploadFail()
					);
				}
			} else {
				uploadFail();
			}
		} else {
			uploadFail();
		}
	});
};

const uploadFail = () => {
	uni.reLaunch({ url: "/pages/index/index" });
}
