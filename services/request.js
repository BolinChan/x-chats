import config from "../config";
import api from "./api";
import { getStorageSync, toast } from "../common/tools";

const isDev = process.env.NODE_ENV === "development";

export const isUrl = (url) => {
	return /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url);
};

const interceptor = (url) => {
	let options = false;
	if (url in api) url = config.api_url + api[url];
	if (isUrl(url)) {
		options = {
			url,
			header: { Authorization: `bearer ${getStorageSync("token")}` }
		};
	} else {
		if (isDev) toast("接口错误或未定义！");
	}
	return options;
};

const success = (statusCode, data) => {
	let res = { err: true, msg: "网络错误请稍后重试！", data: "" };

	if (statusCode === 200) {
		if (typeof data === "string") {
			try {
				data = JSON.parse(data);
			} catch (e) {
				if (isDev) toast(e);
			}
		}
		res = typeof data !== "string" ? data : { err: false, msg: "", data };
	}

	if (res.err) toast(res);
	return res;
};

const fail = (errMsg) => {
	const res = { err: true, msg: errMsg, data: "" };
	toast(res);
	return res;
};

// POST请求
export const fetch = (url, data = {}) => new Promise((resolve) => {
	const options = interceptor(url);
	if (options) {
		uni.request({
			data,
			method: "POST",
			success: ({ statusCode, data }) => resolve(success(statusCode, data)),
			fail: ({ errMsg }) => resolve(fail(errMsg)),
			...options
		});
	}
});

// 表单提交
export const submit = (url, formData = null) => new Promise((resolve) => {
	if (formData && "files" in formData && Object.keys(formData.files).length > 0) {
		let options = interceptor(url);
		if (options) {
			let files = [];
			for (let key in formData.files) {
				files.push({ name: key, uri: formData.files[key] });
			}
			delete formData.files;
			uni.uploadFile({
				fileType: "image",
				filePath: "",
				name: "",
				files,
				formData,
				success: ({ statusCode, data }) => resolve(success(statusCode, data)),
				fail: ({ errMsg }) => resolve(fail(errMsg)),
				...options
			});
		}
	} else {
		resolve(fetch(url, formData));
	}
});

// 图片上传
export const upload = (filePath, url = config.upload_url) => new Promise((resolve) => {
	let options = interceptor(url);
	if (options) {
		uni.uploadFile({
			fileType: "image",
			filePath,
			name: "filePath",
			success: ({ statusCode, data }) => resolve(success(statusCode, data)),
			fail: ({ errMsg }) => resolve(fail(errMsg)),
			...options
		});
	}
});

// 下载文件
export const download = (url) => new Promise((resolve) => {
	let options = interceptor(url);
	if (options) {
		uni.downloadFile({
			success: ({ statusCode, tempFilePath }) => resolve(success(statusCode, tempFilePath)),
			fail: ({ errMsg }) => resolve(fail(errMsg)),
			...options
		});
	}
});
