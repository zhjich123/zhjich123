// ==UserScript==
// @name         媒体嗅探器 Media Sniffer Pro
// @namespace    http://tampermonkey.net/
// @version      1.18
// @description  图片/视频/音频/m3u8 抓取 · AES-128解密 · 分片合并 · 虚拟列表 · 进度可视化 · 跨域兜底 · Cookie/Storage · 翻译 · 元信息 · 高级筛选 · iOS 27 液态玻璃界面
// @license      GPL-3.0-or-later
// @downloadURL  https://raw.githubusercontent.com/zhjich123/zhjich123/main/media-sniffer.user.js
// @updateURL    https://raw.githubusercontent.com/zhjich123/zhjich123/main/media-sniffer.user.js
// @match        *://*/*
// @exclude      *://*chrome.google.com/*
// @exclude      *://*chromewebstore.google.com/*
// @exclude      *://*microsoft.com/*edge*
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-end
// @noframes
// @connect      *
// @connect      bilibili.com
// @connect      bilivideo.com
// @connect      b23.tv
// @connect      douyin.com
// @connect      kuaishou.com
// @connect      xiaohongshu.com
// @connect      xhslink.com
// @connect      weibo.com
// @connect      weibo.cn
// @connect      zhihu.com
// @connect      zhimg.com
// @connect      weixin.qq.com
// @connect      qpic.cn
// ==/UserScript==

(function () {
	'use strict';

	if (window.top !== window.self) {
		return;
	}

	try {
	console.info('[MS] 脚本开始加载，版本:', '1.18');
		var MS_CONFIG = {
		VERSION: '1.18',
										UI_STYLE_IDS: ['normal', 'material', 'ios27', 'neumorph', 'brutal', 'terminal'],
										UPDATE_URL: 'https://raw.githubusercontent.com/zhjich123/zhjich123/main/media-sniffer.user.js',
		ICONS: {
			chevronLeft: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.2));"><polyline points="15 18 9 12 15 6"></polyline></svg>',
			play: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.25));"><polygon points="5 3 21 12 5 21 5 3"></polygon></svg>',
			playSmall: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block;vertical-align:middle;"><polygon points="5 3 21 12 5 21 5 3"></polygon></svg>',
			music: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.25));"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
			target: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.35));"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4" fill="#ffffff"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line></svg>',
			check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
			checkBig: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>',
			checkWhite: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
						image: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
			video: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>',
			audio: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
			stream: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>',
			download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
			downloadWhite: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
			copy: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
			filter: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>',
			wrench: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>',
			link: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
			trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
			plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
			package: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
			globe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
			cross: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
			crossWhite: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
			warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
			warningWhite: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
			edit: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
			sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
			moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
			palette: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.045a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.01 17.461 2 12 2z"></path></svg>',
			settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
			cookie: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="9" cy="9" r="1.5" fill="currentColor"></circle><circle cx="15" cy="8" r="1.5" fill="currentColor"></circle><circle cx="15" cy="15" r="1.5" fill="currentColor"></circle><circle cx="9" cy="16" r="1.5" fill="currentColor"></circle></svg>',
			book: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
			chart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
			refresh: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>',
			volume: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>',
			speech: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>',
			search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
			eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
			plug: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 11V7a4 4 0 0 0-8 0v4"></path><rect x="8" y="11" width="8" height="10" rx="1"></rect></svg>',
			shield: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
			info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
			monitor: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
			arrowDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>',
			arrowRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="8 5 8 19 19 12 8 5"></polygon></svg>',
			stop: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>',
			hourglass: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"></path><path d="M5 2h14"></path><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path></svg>',
			calendar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
			timer: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
			star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
			thumbsUp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',
			coin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="6" x2="12" y2="12"></line><path d="M12 16h.01"></path></svg>',
			lightning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
			bulb: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z"></path></svg>',
			folder: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
			rocket: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>',
			keyboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6" y2="8.01"></line><line x1="10" y1="8" x2="10" y2="8.01"></line><line x1="14" y1="8" x2="14" y2="8.01"></line><line x1="18" y1="8" x2="18" y2="8.01"></line><line x1="6" y1="12" x2="6" y2="12.01"></line><line x1="10" y1="12" x2="10" y2="12.01"></line><line x1="14" y1="12" x2="14" y2="12.01"></line><line x1="18" y1="12" x2="18" y2="12.01"></line><line x1="6" y1="16" x2="18" y2="16"></line></svg>',
			lock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
			unlock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>',
			detective: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 11c.57.57 1.33.89 2.12.89s1.58-.32 2.12-.89"></path><circle cx="12" cy="11" r="6"></circle><path d="M4 4l2 2"></path><path d="M20 4l-2 2"></path></svg>',
			megaphone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>',
			party: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a3 3 0 1 0-6 0 3 3 0 0 0 6 0z"></path><path d="M6 15l2.5-2.5"></path><path d="M16.5 11.5L22 16"></path><path d="M12 18v4"></path><path d="M2 22l4-10 5.5 5.5L22 2"></path></svg>',
			checkMark: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
			diamond: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2L2 8l10 14L22 8l-4-6H6z"></path></svg>',
			square: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"></rect></svg>',
			circle: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9"></circle></svg>',
			searchBig: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
			checkBox: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
			record: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"></circle></svg>',
			reload: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>',
			save: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
			monitorBig: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
			streamBig: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>',
			pause: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
			store: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1-5h16l1 5"></path><path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"></path><path d="M9 22V12h6v10"></path><path d="M3 9h18"></path></svg>'
		},
		COLORS: {
			primary: '#6366f1',
			primary2: '#8b5cf6',
			darkPrimary: '#4f46e5',
			info: '#0ea5e9',
			info2: '#3b82f6',
			success: '#10b981',
			success2: '#059669',
			warn: '#f59e0b',
			danger: '#ef4444',
			danger2: '#dc2626',
			rose: '#ec4899',
			rose2: '#f43f5e',
			orange: '#f97316',
			purple: '#8b5cf6',
			purple2: '#a855f7',
			white: '#ffffff',
			black: '#000000',
			dark: { bg: '#0f172a', bg2: '#1e293b', bg3: '#334155', txt: '#e2e8f0', sub: '#94a3b8', border: '#334155' },
			light: { bg: '#ffffff', bg2: '#f8fafc', bg3: '#e2e8f0', txt: '#0f172a', sub: '#475569', border: '#e2e8f0' },
			darkGradientStart: '#1e293b',
			darkGradientEnd: '#334155',
			audioGradientStart: '#ec4899',
			audioGradientEnd: '#f97316',
			m3u8GradientStart: '#0ea5e9',
			m3u8GradientEnd: '#6366f1'
		},
		PALETTE_ORDER: ['indigo', 'purple', 'blue', 'green', 'orange', 'rose'],
		PALETTES: {
			indigo: { nameKey: 'paletteIndigo', light: { primary: '#6366f1', primary2: '#8b5cf6' }, dark: { primary: '#818cf8', primary2: '#a78bfa' } },
			purple: { nameKey: 'palettePurple', light: { primary: '#8b5cf6', primary2: '#a855f7' }, dark: { primary: '#a78bfa', primary2: '#c084fc' } },
			blue: { nameKey: 'paletteBlue', light: { primary: '#3b82f6', primary2: '#06b6d4' }, dark: { primary: '#60a5fa', primary2: '#22d3ee' } },
			green: { nameKey: 'paletteGreen', light: { primary: '#10b981', primary2: '#14b8a6' }, dark: { primary: '#34d399', primary2: '#2dd4bf' } },
			orange: { nameKey: 'paletteOrange', light: { primary: '#f59e0b', primary2: '#f97316' }, dark: { primary: '#fbbf24', primary2: '#fb923c' } },
			rose: { nameKey: 'paletteRose', light: { primary: '#f43f5e', primary2: '#ec4899' }, dark: { primary: '#fb7185', primary2: '#f472b6' } }
		},
		SIZES: {
			floatBtn: 62,
			floatBtnFont: 28,
			headerBtn: 30,
			minimizedBarW: 60,
			minimizedBarH: 56,
			minimizedIcon: 26,
			cardRadius: 10,
			btnRadius: 8,
			panelRadius: 16,
			zMax: 2147483647
		}
	};
															try {
		(function normalizeIcons() {
			var NEED = 'display:inline-block;vertical-align:middle';
			var icons = MS_CONFIG.ICONS;
			for (var k in icons) {
				if (!Object.prototype.hasOwnProperty.call(icons, k)) continue;
				var v = icons[k];
				if (typeof v !== 'string' || v.indexOf('<svg') !== 0) continue;
												var om = v.match(/^<svg\b[^>]*?>/);
				if (!om) continue;
				var open = om[0];
				if (/display\s*:/.test(open)) continue; 
				if (/\sstyle="/.test(open)) {
															open = open.replace(/\sstyle="/, ' style="' + NEED + ';');
				} else {
					open = open.replace(/^<svg\b/, '<svg style="' + NEED + '"');
				}
				icons[k] = open + v.slice(om[0].length);
			}
		})();

		(function ensureSvgInlineCss() {
			var id = '_ms_icon_fix_css';
			if (document.getElementById(id)) return;
			var st = document.createElement('style');
			st.id = id;
									st.textContent = '#_ms_panel svg,#_ms_float svg,#_ms_sel_pop svg,#_ms_queue_modal svg,'
				+ '#_ms_vlp_modal svg,#_ms_footer_menu svg,#_ms_float_ctx_menu svg,#_ms_filter_panel svg,'
				+ '._ms_toast svg,#_ms_minimized_bar svg,#_ms_status svg,[id^="_ms_"] svg'
				+ '{display:inline-block !important;vertical-align:middle !important;}';
			(document.head || document.documentElement).appendChild(st);
		})();
	} catch (e) {}
		var MS_FACTORY = {
		_isArr: Array.isArray || function (x) { return Object.prototype.toString.call(x) === '[object Array]'; },
		el: function (tag, css, attrs, children) {
			var node = document.createElement(tag || 'div');
			if (css) {
				if (typeof css === 'string') node.style.cssText = css;
				else for (var k in css) if (css.hasOwnProperty(k)) node.style[k] = css[k];
			}
			if (attrs) {
				for (var k in attrs) if (attrs.hasOwnProperty(k)) {
					if (k === 'text') node.textContent = attrs[k];
					else if (k === 'html') node.innerHTML = attrs[k];
					else node.setAttribute(k, attrs[k]);
				}
			}
			if (children != null) {
				var list = this._isArr(children) ? children : [children];
				for (var i = 0; i < list.length; i++) {
					var c = list[i];
					if (c == null) continue;
					if (typeof c === 'string') node.appendChild(document.createTextNode(c));
					else node.appendChild(c);
				}
			}
			return node;
		},
		btn: function (text, onClick, css, attrs) {
			var b = this.el('button', css || '', attrs);
			b.textContent = text || '';
			b.style.cursor = 'pointer';
			if (typeof onClick === 'function') b.addEventListener('click', onClick);
			return b;
		},
		iconBtn: function (icon, onClick, css, attrs) {
			var b = this.el('button', css || '', attrs);
			b.innerHTML = icon || '';
			b.style.cursor = 'pointer';
			if (typeof onClick === 'function') b.addEventListener('click', onClick);
			return b;
		},
		headerBtn: function (text, title, onClick) {
			return this.btn(text, onClick,
				'width:' + MS_CONFIG.SIZES.headerBtn + 'px;height:' + MS_CONFIG.SIZES.headerBtn + 'px;border-radius:50%;border:none;background:rgba(255,255,255,.25);color:' + MS_CONFIG.COLORS.white + ';font-size:18px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;',
				{ title: title }
			);
		},
		minimizedBar: function () {
			var c = UI.colors();
												var bar = this.el('div',
				'position:fixed;display:none;align-items:center;justify-content:center;width:' + MS_CONFIG.SIZES.minimizedBarW + 'px;height:' + MS_CONFIG.SIZES.minimizedBarH + 'px;border-radius:14px;box-shadow:var(--_ms_bar_shadow, 0 8px 24px rgba(0,0,0,.35));cursor:pointer;z-index:2147483645;user-select:none;overflow:hidden;transition:transform .25s cubic-bezier(.16,1,.3,1), opacity .25s cubic-bezier(.16,1,.3,1), background-color .35s ease;',
				{ id: '_ms_minimized_bar' }
			);
			bar.style.background = 'linear-gradient(135deg,' + c.primary + ' 0%,' + c.primary2 + ' 100%)';
			bar.style.color = MS_CONFIG.COLORS.white;
			bar.innerHTML = MS_CONFIG.ICONS.chevronLeft;
			bar.addEventListener('click', UI.toggleMinimize);
			return bar;
		},
		mediaCardHtml: function (url, idx, kind) {
			var c = UI.colors();
			var isMobile = UI._isMobile();
			var isSel = State.selected.has(url);
			var inSelMode = State.selectionMode;
						var primary = c.primary || MS_CONFIG.COLORS.primary;
			var borderStyle = isSel ? '2px solid ' + primary : (inSelMode ? '1px dashed ' + primary : '1px solid ' + c.border);
						var shadow = isSel ? 'box-shadow:0 4px 12px ' + UI._ios27Rgba(primary, 0.35) + ';' : '';
			var nameFontSize = isMobile ? '13px' : '11px';
			var namePadding = isMobile ? '8px 10px' : '6px 8px';
			var nameMaxHeight = isMobile ? '56px' : '48px';
			var markSize = isMobile ? '28px' : '24px';
			var markFontSize = isMobile ? '16px' : '14px';
			var iconSize = isMobile ? '32px' : '28px';
			var thumbHtml = '';
			if (kind === 'img') {
																thumbHtml = '<img src="' + SEC.escapeAttr(url) + '" loading="lazy" referrerpolicy="no-referrer" data-ms-thumb="img" style="width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;">';
			} else if (kind === 'video') {
				var cached = UI._thumbCache[url];
				var grad = 'linear-gradient(135deg,' + MS_CONFIG.COLORS.darkGradientStart + ',' + MS_CONFIG.COLORS.darkGradientEnd + ')';
				if (cached) {
															thumbHtml = '<img src="' + SEC.escapeAttr(cached) + '" loading="lazy" data-ms-thumb="video" style="width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;">';
				} else {
					thumbHtml = '<div class="_ms_v_thumb" data-url="' + SEC.escapeAttr(url) + '" style="width:100%;height:100%;background:' + grad + ';display:flex;align-items:center;justify-content:center;color:' + MS_CONFIG.COLORS.white + ';font-size:' + iconSize + ';">' + MS_CONFIG.ICONS.play + '</div>';
				}
			} else if (kind === 'audio') {
				thumbHtml = '<div style="width:100%;height:100%;background:linear-gradient(135deg,' + MS_CONFIG.COLORS.audioGradientStart + ',' + MS_CONFIG.COLORS.audioGradientEnd + ');display:flex;align-items:center;justify-content:center;color:' + MS_CONFIG.COLORS.white + ';font-size:' + iconSize + ';">' + MS_CONFIG.ICONS.music + '</div>';
			} else {
				thumbHtml = '<div style="width:100%;height:100%;background:linear-gradient(135deg,' + MS_CONFIG.COLORS.m3u8GradientStart + ',' + MS_CONFIG.COLORS.m3u8GradientEnd + ');display:flex;align-items:center;justify-content:center;color:' + MS_CONFIG.COLORS.white + ';font-size:' + (isMobile ? '24px' : '20px') + ';font-weight:700;">m3u8</div>';
			}
			var markDisplay = inSelMode ? 'flex' : 'none';
			var markHtml = '<div class="_ms_sel_mark" style="position:absolute;top:' + (isMobile ? '8px' : '6px') + ';right:' + (isMobile ? '8px' : '6px') + ';width:' + markSize + ';height:' + markSize + ';border-radius:50%;' + (isSel ? 'background:' + primary + ';color:' + MS_CONFIG.COLORS.white + ';' : 'background:rgba(255,255,255,.9);border:2px solid ' + primary + ';color:' + primary + ';') + 'display:' + markDisplay + ';align-items:center;justify-content:center;z-index:2;">' + (isSel ? MS_CONFIG.ICONS.check : '') + '</div>';
			var iframeBadge = '';
			if (kind === 'video' && Scanner._iframeVideoUrls && Scanner._iframeVideoUrls.has(url)) {
				iframeBadge = '<div style="position:absolute;top:' + (isMobile ? '8px' : '6px') + ';left:' + (isMobile ? '8px' : '6px') + ';padding:2px 6px;border-radius:4px;background:rgba(0,0,0,.6);color:' + MS_CONFIG.COLORS.white + ';font-size:10px;font-weight:600;z-index:2;pointer-events:none;">' + LANG.t('iframeBadge') + '</div>';
			}
			return '<div class="_ms_card" data-url="' + SEC.escapeAttr(url) + '" data-idx="' + SEC.escapeAttr(idx) + '" draggable="' + (inSelMode ? 'true' : 'false') + '" style="position:relative;border-radius:' + MS_CONFIG.SIZES.cardRadius + 'px;background:' + c.bg2 + ';overflow:hidden;cursor:pointer;' + borderStyle + shadow + ';">' +
				'<div style="width:100%;aspect-ratio:1/1;overflow:hidden;background:' + c.bg3 + ';display:flex;align-items:center;justify-content:center;">' + thumbHtml + '</div>' +
																				'<div style="padding:' + namePadding + ';font-size:' + nameFontSize + ';color:' + c.txt + ';line-height:1.3;word-break:break-all;overflow:hidden;max-height:' + nameMaxHeight + ';text-overflow:ellipsis;">' + SEC.escapeHtml(U.trunc(SEC.nameFromUrl(url), isMobile ? 40 : 30)) + '</div>' +
				markHtml +
				iframeBadge +
				'</div>';
		}
	};

	var U = (function () {
		'use strict';
		var U = {};
	U.VERSION = '1.18';

					(function () {
		try {
			if (typeof String.prototype.padStart !== 'function') {
				String.prototype.padStart = function (len, pad) {
					var str = String(this);
					var target = Number(len) || 0;
					if (str.length >= target) return str;
					var filler = pad === undefined ? ' ' : String(pad);
					if (!filler) return str;
					var need = target - str.length;
					var fill = '';
					while (fill.length < need) fill += filler;
					return fill.slice(0, need) + str;
				};
			}
			if (typeof String.prototype.padEnd !== 'function') {
				String.prototype.padEnd = function (len, pad) {
					var str = String(this);
					var target = Number(len) || 0;
					if (str.length >= target) return str;
					var filler = pad === undefined ? ' ' : String(pad);
					if (!filler) return str;
					var need = target - str.length;
					var fill = '';
					while (fill.length < need) fill += filler;
					return str + fill.slice(0, need);
				};
			}
		} catch (e) {}
	})();
	U.toStr = Object.prototype.toString;
	U.isArr = Array.isArray || function (x) { return U.toStr.call(x) === '[object Array]'; };
	U.isStr = function (x) { return typeof x === 'string'; };
	U.isNum = function (x) { return typeof x === 'number' && !isNaN(x); };
	U.isFn = function (x) { return typeof x === 'function'; };
	U.now = function () { return Date.now(); };
	var monoImpl = (function () {
		try {
			if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
				return function () { return performance.now(); };
			}
		} catch (e) {}
		return null;
	})();
	U._monoNow = monoImpl; 
	U.monoNow = monoImpl
		? function () { return monoImpl(); } 
		: U.now; 
		U.rAF = (function () {
		try {
			if (typeof requestAnimationFrame === 'function') {
				return function (cb) { return requestAnimationFrame(cb); };
			}
		} catch (e) {}
		return function (cb) { return setTimeout(cb, 16); };
	})();
	U.cAF = (function () {
		try {
			if (typeof cancelAnimationFrame === 'function') {
				return function (id) { if (id) cancelAnimationFrame(id); };
			}
		} catch (e) {}
		return function (id) { if (id) clearTimeout(id); };
	})();
	var LOG = {};
	LOG.LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
	LOG.LEVEL_NAMES = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
	LOG.level = LOG.LEVELS.INFO; 
	LOG.prefix = '[MS-v1]';
										LOG.buffer = [];
	LOG.maxBuffer = 400;
	LOG._fmtArg = function (v) {
		if (v === null) return 'null';
		if (v === undefined) return 'undefined';
		var t = typeof v;
		if (t === 'string') return v;
		if (t === 'number' || t === 'boolean') return String(v);
		if (v instanceof Error) return (v.name || 'Error') + ': ' + (v.message || '');
		if (t === 'function') return 'function ' + (v.name || 'anonymous');
		try {
			var j = JSON.stringify(v);
			return j === undefined ? Object.prototype.toString.call(v) : j;
		} catch (e) {
			return Object.prototype.toString.call(v); 
		}
	};
	LOG._record = function (lvl, args) {
		try {
			var parts = [];
			for (var i = 0; i < args.length; i++) parts.push(LOG._fmtArg(args[i]));
			var msg = parts.join(' ');
			if (msg.length > 400) msg = msg.slice(0, 400) + '…';
			LOG.buffer.push({ t: U.now(), lvl: lvl, msg: msg });
						if (LOG.buffer.length > LOG.maxBuffer) {
				LOG.buffer.splice(0, LOG.buffer.length - LOG.maxBuffer);
			}
		} catch (e) {}
	};
	LOG._out = function (lvl, args) {
		LOG._record(lvl, args); 
		if (lvl < LOG.level) return;
		var method = lvl === 0 ? 'log' : lvl === 1 ? 'info' : lvl === 2 ? 'warn' : 'error';
		try { console[method].apply(console, [LOG.prefix].concat(Array.from(args))); } catch (e) {}
	};
	LOG.debug = function () { LOG._out(0, arguments); };
	LOG.info = function () { LOG._out(1, arguments); };
	LOG.warn = function () { LOG._out(2, arguments); };
	LOG.error = function () { LOG._out(3, arguments); };
	LOG.setLevel = function (lvl) { if (U.isNum(lvl) && lvl >= 0 && lvl <= 3) LOG.level = lvl; };
		LOG.clearBuffer = function () { LOG.buffer.length = 0; };
	LOG.dump = function (minLvl) {
		var out = [];
		var lo = (minLvl == null) ? 0 : minLvl;
		for (var i = 0; i < LOG.buffer.length; i++) {
			var e = LOG.buffer[i];
			if (e.lvl < lo) continue;
			out.push(e);
		}
		return out;
	};
	U.debounce = function (fn, wait) {
		var t = null;
		return function () {
			var ctx = this, args = arguments;
			if (t) clearTimeout(t);
			t = setTimeout(function () { fn.apply(ctx, args); }, wait);
		};
	};
	U.throttle = function (fn, wait) {
		var last = 0, t = null;
		function updateTimer() { ret._timer = t; }
		var ret = function () {
			var ctx = this, args = arguments, n = U.monoNow();
			var rem = wait - (n - last);
			if (rem <= 0) { if (t) { clearTimeout(t); t = null; updateTimer(); } last = n; fn.apply(ctx, args); }
			else if (!t) { t = setTimeout(function () { last = U.monoNow(); t = null; updateTimer(); fn.apply(ctx, args); }, rem); updateTimer(); }
		};
		updateTimer();
		return ret;
	};
	U.rIC = function (cb, opts) {
		try {
			if (typeof requestIdleCallback === 'function') return requestIdleCallback(cb, opts);
		} catch (e) {}
		return setTimeout(cb, 1);
	};
						U.safeRun = function (fn, label) {
		try {
			return fn();
		} catch (e) {
			try {
				if (typeof LOG !== 'undefined' && LOG && LOG.error) {
					LOG.error('[safeRun] ' + (label || '?') + ' 失败:', e && e.message ? e.message : e);
				}
			} catch (e2) {}
			return undefined;
		}
	};

			U.hashStr = function (str) {
		var h = 0x811c9dc5;
		var t = String(str == null ? '' : str);
		for (var i = 0; i < t.length; i++) {
			h ^= t.charCodeAt(i);
			h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
		}
		return h.toString(36);
	};

	U.lru = function (store, limit, onEvict) {
		var isMap = (typeof Map === 'function') && (store instanceof Map);
		var isSet = (typeof Set === 'function') && (store instanceof Set);
										var objKeys = [];
		var api = {
			limit: limit,
			set: function (key, val) {
				if (isSet) {
										store.delete(key);
					store.add(key);
				} else if (isMap) {
					store.delete(key);
					store.set(key, val);
				} else {
										if (Object.prototype.hasOwnProperty.call(store, key)) {
						var at = objKeys.indexOf(key);
						if (at >= 0) objKeys.splice(at, 1);
					}
					store[key] = val;
					objKeys.push(key);
				}
				api.trim();
				return val;
			},
			trim: function () {
				if (isSet) {
					while (store.size > limit) {
						var evicted = store.values().next().value;
						store.delete(evicted);
						if (onEvict) { try { onEvict(evicted); } catch (e) {} }
					}
					return;
				}
				if (isMap) {
					while (store.size > limit) {
						var oldest = store.keys().next().value;
						store.delete(oldest);
						if (onEvict) { try { onEvict(oldest); } catch (e) {} }
					}
					return;
				}
				while (objKeys.length > limit) {
					var k = objKeys.shift();
					delete store[k];
					if (onEvict) { try { onEvict(k); } catch (e) {} }
				}
			},
			has: function (key) {
				if (isMap || isSet) return store.has(key);
				return Object.prototype.hasOwnProperty.call(store, key);
			},
			size: function () {
				if (isMap || isSet) return store.size;
				return objKeys.length;
			}
		};
		return api;
	};

	U.uniq = function (arr) {
		if (!arr || arr.length === 0) return [];
		if (arr.length === 1) return [arr[0]];
		var seen = new Set(), out = [];
		for (var i = 0; i < arr.length; i++) {
			var v = arr[i];
			if (!seen.has(v)) { seen.add(v); out.push(v); }
		}
		return out;
	};
									U.memo1 = function (fn, max) {
		var cap = max || 1500;
		var cache = new Map();
		return function (a) {
			var hit = cache.get(a);
			if (hit !== undefined) return hit;
			var v = fn.call(this, a);
			if (cache.size >= cap) {
				var drop = Math.floor(cap / 4), it = cache.keys(), nk;
				for (var i = 0; i < drop; i++) {
					nk = it.next();
					if (nk.done) break;
					cache.delete(nk.value);
				}
			}
			cache.set(a, v);
			return v;
		};
	};
	U.safeJson = function (s, def) {
		try { return JSON.parse(s); } catch (e) { return def; }
	};

										U.cssEscape = function (value) {
		if (typeof CSS !== 'undefined' && CSS && typeof CSS.escape === 'function') {
			return CSS.escape(String(value == null ? '' : value));
		}
		var str = String(value == null ? '' : value);
		var length = str.length, result = '', index = -1, codeUnit;
		while (++index < length) {
			codeUnit = str.charCodeAt(index);
			if (codeUnit === 0x0000) { result += '\uFFFD'; continue; }
			if ((codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit === 0x007F ||
				(index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
				(index === 1 && codeUnit >= 0x0030 && codeUnit <= 0x0039 && str.charCodeAt(0) === 0x002D)) {
				result += '\\' + codeUnit.toString(16) + ' ';
				continue;
			}
			if (index === 0 && length === 1 && codeUnit === 0x002D) { result += '\\' + str.charAt(index); continue; }
			if (codeUnit >= 0x0080 || codeUnit === 0x002D || codeUnit === 0x005F ||
				(codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
				(codeUnit >= 0x0041 && codeUnit <= 0x005A) ||
				(codeUnit >= 0x0061 && codeUnit <= 0x007A)) {
				result += str.charAt(index);
				continue;
			}
			result += '\\' + str.charAt(index);
		}
		return result;
	};

	U.gmGetArray = function (key, def) {
		try {
			if (typeof GM_getValue !== 'function') return def;
			var raw = GM_getValue(key, null);
			if (raw == null || raw === '') return def;
			if (Array.isArray(raw)) return raw;
			if (typeof raw === 'string') {
				var arr = U.safeJson(raw, null);
				return Array.isArray(arr) ? arr : def;
			}
			if (typeof raw === 'object') {
				for (var i = 0; i < 2; i++) {
					var k = i === 0 ? 'items' : 'history';
					if (Array.isArray(raw[k])) return raw[k];
				}
			}
			return def;
		} catch (e) { return def; }
	};
	U.dateStr = function () {
		var d = new Date();
		function pad(n) { return n < 10 ? '0' + n : String(n); }
		return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '_' + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
	};
	U.formatSize = function (b) {
		if (b == null || b < 0) return '';
		if (b < 1024) return b + ' B';
		if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
		if (b < 1073741824) return (b / 1048576).toFixed(1) + ' MB';
		return (b / 1073741824).toFixed(2) + ' GB';
	};
	U.formatTime = function (sec) {
		if (!U.isNum(sec) || sec < 0) return '00:00';
		var h = Math.floor(sec / 3600);
		var m = Math.floor((sec % 3600) / 60);
		var s = Math.floor(sec % 60);
		function pad(n) { return n < 10 ? '0' + n : String(n); }
		if (h > 0) return pad(h) + ':' + pad(m) + ':' + pad(s);
		return pad(m) + ':' + pad(s);
	};
	U.trunc = function (s, n) {
		if (!U.isStr(s)) return '';
		if (s.length <= n) return s;
		return s.substring(0, n - 1) + '…';
	};
	U.getHost = function () {
		try { return (location.hostname || '').replace(/\./g, '-') || 'site'; } catch (e) { return 'site'; }
	};
	U.isMobile = function () {
		try {
			var ua = navigator.userAgent;
			if (/Mobi|Android|iPhone|HarmonyOS/i.test(ua)) return true;
			if (/iPad/i.test(ua)) return true;
			if (/Mac OS X/i.test(ua) && navigator.maxTouchPoints > 0) return true;
			return window.innerWidth < 700;
		} catch (e) { return false; }
	};
		U.deepClone = function (obj) {
		if (obj === null || typeof obj !== 'object') return obj;
		if (U.isArr(obj)) return obj.map(function (v) { return U.deepClone(v); });
		var out = {};
		for (var k in obj) if (obj.hasOwnProperty(k)) out[k] = U.deepClone(obj[k]);
		return out;
	};
		U.LOG = LOG;
		return U;
	})();
	var LOG = U.LOG;

	var LANG = (function () {
		'use strict';

		var LANG = {};
											LANG.strings = {
		'zh-CN': {
			'scan': '扫描',
			'rescan': '重新扫描',
			'img': '图片',
			'video': '视频',
			'audio': '音频',
			'm3u8': '流媒体',
			'translate': '翻译',
			'cookie': 'Cookie',
			'storage': '存储',
			'settings': '设置',
			'domain': '域名',
			'close': '关闭',
			'download': '下载',
			'downloadAll': '下载全部',
			'downloadSel': '下载选中',
			'copyUrl': '复制链接',
			'copyAllUrl': '复制全部链接',
			'copySelUrl': '复制选中链接',
			'openTab': '新标签打开',
			'preview': '预览',
			'search': '搜索...',
			'filter': '筛选',
			'filterSize': '文件大小筛选',
			'minSize': '最小大小 (KB)',
			'maxSize': '最大大小 (KB, 0=不限)',
			'applyFilter': '应用筛选',
			'resetFilter': '重置筛选',
			'totalItems': '共',
			'items': '项',
			'showing': '显示 {shown} / {total} 项',
			'found': '找到',
			'selected': '已选',
			'selectAll': '全选',
			'deselectAll': '取消全选',
			'noMedia': '暂无资源',
			'lang': '界面语言',
			'theme': '主题',
			'system': '跟随系统',
			'light': '亮色',
			'dark': '暗色',
			'autoMerge': '自动合并分片',
			'autoThumb': '自动提取视频封面',
			'autoThumbDesc': '自动尝试加载视频首帧作为缩略图',
			'enabled': '已启用',
			'disabled': '○ 已禁用',
			'domainRules': '自定义域名规则',
			'domainRulesDesc': '为特定域名设置扫描策略（一行一条：域名,图片扫描,视频扫描,音频扫描,深度，例如: baidu.com,1,0,0,1）',
			'clearCache': '清除缓存',
			'saved': '已保存',
			'ok': '成功',
			'fail': '失败',
			'loading': '加载中...',
			'confirm': '确认',
			'cancel': '取消',
			'size': '大小',
			'duration': '时长',
			'url': '链接',
			'name': '名称',
			'hint': '普通点击=预览 · 双击=下载 · Shift+点击=多选',
			'langSelect': '界面语言', 'themeSelect': '界面主题',
			'themeAuto': '跟随系统', 'themeLight': '亮色',
			'themeDark': '暗色',
			'uiStyleSelect': '界面风格',
			'uiStyleDesc': '切换面板整体视觉风格（iOS 27 液态玻璃 / 新拟物 / 粗野主义 / 终端复古）',
			'uiStyleNormal': '普通',
			'uiStyleMaterial': 'Material', 'uiStyleIos27': 'iOS 27',
			'updateManualHint': '已打开脚本地址：若浏览器显示的是源码，请全选复制后在脚本管理器里新建脚本粘贴',
			'updateOpenHint': '已打开更新页面，请在脚本管理器里确认「更新」',
			'updateOpenFail': '无法自动打开更新页，地址已复制，请粘贴到浏览器地址栏',
			'updateDownloadScript': '或：下载脚本文件（.user.js）',
			'updateDownloading': '已开始下载脚本文件，请手动安装',
			'uiStyleNeumorph': '新拟物', 'uiStyleBrutal': '粗野主义', 'uiStyleTerminal': '终端',
			'paletteSelect': '配色方案',
			'paletteIndigo': '靛蓝',
			'palettePurple': '紫色', 'paletteBlue': '海蓝',
			'paletteGreen': '森绿', 'paletteOrange': '暖橙',
			'paletteRose': '玫红',
			'grpTheme': '界面主题',
			'grpPalette': '配色方案', 'grpUiStyle': '界面风格',
			'grpNameTpl': '下载文件名模板',
			'grpBatch': '批量下载设置',
			'grpAria2': 'Aria2 推送设置', 'grpM3u8': 'm3u8 流媒体设置',
			'grpHeaders': '请求头设置', 'grpLog': '日志级别',
			'grpOther': '其他操作',
			'grpLang': '界面语言',
			'grpDomainRules': '自定义域名规则', 'grpVideoThumb': '视频封面',
			'grpAutoUpdate': '自动更新检测', 'grpPersistSelection': '关闭面板保留选择',
			'grpShortcuts': '快捷键设置', 'grpDownloadHistory': '下载历史',
			'grpResourceHistory': '资源历史',
			'enableHistory': '记录资源历史',
			'noResourceHistory': '暂无资源历史',
			'clearResourceHistory': '清空资源历史',
			'confirmClearResourceHistory': '确认清空资源历史？',
			'historyToday': '今天',
			'historyYesterday': '昨天',
			'historyWeek': '近7天',
			'historyOlder': '更早',
			'autoCheckUpdate': '自动检测更新',
			'autoCheckUpdateDesc': '启动时自动检查最新版本',
			'persistSelection': '关闭面板保留选择',
			'persistSelectionDesc': '关闭面板后保留已选资源，下次打开继续操作',
			'shiftSelectHint': '提示：选择模式下按住 Shift 点击卡片可连续多选',
			'checkNow': '立即检查', 'checkingUpdate': '正在检查更新...',
			'updateLatest': '已是最新版本', 'updateFound': '发现新版本',
			'updateCheckFail': '检查更新失败',
			'nameTpl': '下载文件名模板',
			'saveRules': '保存域名规则',
			'rulesSaved': '已保存 {n} 条域名规则',
			'coverExtracted': '封面已提取并下载',
			'coverFail': '封面提取失败',
			'coverWait': '正在提取封面，请稍候...',
			'loadingMeta': '加载中...',
			'copied': '已复制', 'noFiles': '无下载文件',
			'noSelected': '未选择文件', 'startDl': '开始下载...',
			'renamePrompt': '重命名文件', 'dlDone': '下载完成：{name}',
			'done': '完成', 'stopped': '已停止',
			'scanning': '正在扫描...',
			'scanDone': '扫描完成',
			'filterApplied': '筛选已应用',
			'appTitle': '媒体嗅探器 Pro',
			'tabImg': '图片', 'tabVideo': '视频',
			'tabDiag': '诊断',
			'diagTitle': '诊断与自检',
			'diagDesc': '排查问题时把「复制报告」的内容发给开发者即可',
			'diagEnv': '环境',
			'diagStats': '运行统计',
			'diagCaches': '缓存占用',
			'diagPerf': '耗时打点',
			'diagSelfCheck': '自检结果',
			'diagLogs': '运行日志',
			'diagRunCheck': '重新自检',
			'diagCopyReport': '复制报告',
			'diagClearLogs': '清空日志',
			'diagCopied': '报告已复制到剪贴板',
			'diagCopyFail': '复制失败，请手动选择文本',
			'diagLogLevel': '日志级别',
			'diagAllLevels': '全部',
			'diagEmptyLogs': '（暂无日志）',
			'diagRefresh': '刷新',
			'tabAudio': '音频',
			'tabM3u8': '流媒体',
			'tabTranslate': '翻译',
			'tabCookie': 'Cookie',
			'tabStorage': '存储',
			'tabSettings': '设置',
			'btnSelAll': '全选', 'btnSelNone': '取消全选',
			'extractCover': '提取封面', 'filterPanel': '筛选设置',
			'advFilterTitle': '高级筛选设置',
			'advFilterDesc': '设置阈值后，点击"应用筛选"重新过滤资源列表',
			'minImageSize': '最小图片大小（字节）',
			'minImageWidth': '最小图片宽度（px）',
			'minVideoDuration': '最小视频时长（秒）',
			'applyFilterBtn': '应用筛选',
			'filterNoMatch': '筛选后无匹配结果',
			'minKb': '最小大小 (KB)',
			'maxKb': '最大大小 (KB, 0=不限)',
			'apply': '应用',
			'reset': '重置'
		,
			'searchPlaceholder': '搜索...',
			'advFilter': '高级筛选',
			'noCookie': '暂无 Cookie',
			'copyCookieStr': '复制 Cookie 字符串',
			'copyJson': '复制 JSON',
			'addCookie': '新增 Cookie',
			'clearSite': '清空本站',
			'delete': '删除',
			'cookieName': 'Cookie 名称',
			'cookieValue': '请输入 Cookie 值：',
			'confirmClearCookie': '确认清空本站 Cookie？',
			'clearedRefresh': '已清空，请刷新页面',
			'added': '已添加',
			'addFail': '添加失败',
			'delFail': '删除失败',
			'clearFail': '清空失败',
			'readCookieFail': '读取 Cookie 失败',
			'exportLs': '导出 localStorage',
			'exportSs': '导出 sessionStorage',
			'addItem': '新增项',
			'clearAll': '清空全部',
			'keyName': '键名',
			'keyValue': '键值',
			'confirmClearStorage': '确认清空存储？',
			'cleared': '已清空',
			'addToLs': '添加到 localStorage',
			'lsTitle': 'localStorage',
			'ssTitle': 'sessionStorage',
			'lsCount': 'localStorage {n} 条 · sessionStorage {m} 条',
			'transTitle': '翻译工具',
			'transIntro': '· 使用 MyMemory 免费 API（国内可用）· 一次最多 500 字符\n· 快捷键 Alt+T 翻译当前页选中文字',
			'transInputPh': '请输入要翻译的文本...',
			'transResultPh': '翻译结果将显示在这里',
			'transBtn': '翻译',
			'zhToEn': '中→英',
			'enToZh': '英→中',
			'clearBtn': '清空',
			'copyResult': '复制结果',
			'resultAsInput': '结果当输入',
			'plsInputText': '请输入文本',
			'translating': '正在翻译（{from} → {to}）…',
			'translatingShort': '正在翻译...',
			'transDone': '翻译完成 ·',
			'transFail': '✕ 翻译失败',
			'transFailShort': '（翻译失败）',
			'transEngine': '翻译引擎',
			'transEngineSelect': '选择引擎',
			'transNeedKey': '此引擎需要 API Key',
			'transNetErr': '网络错误',
			'transTimeout': '请求超时',
			'transAllFail': '所有翻译引擎均失败',
			'transPartialFail': '部分分段翻译失败',
			'speakBtn': '发音',
			'transHistory': '翻译历史',
			'transNoHistory': '暂无翻译历史',
			'transClearHistory': '清空历史',
			'engineMyMemory': 'MyMemory（免费）',
			'engineGoogle': 'Google 翻译',
			'engineBing': 'Bing 翻译',
			'engineBaidu': '百度翻译',
			'engineDeepL': 'DeepL（高质量）',
			'autoDetect': '自动检测',
			'zhLang': '中文',
			'enLang': '英语',
			'jaLang': '日语',
			'koLang': '韩语',
			'frLang': '法语',
			'deLang': '德语',
			'esLang': '西语',
			'ruLang': '俄语',
			'selInfo': '已选 {sel} / {shown}（共 {total}）',
			'selectAllBtn': '全选',
			'selectBtn': '选择',
			'invertSel': '反选',
			'clearSel': '清除选择',
			'copySelBtn': '复制选中',
			'downloadSelBtn': '下载选中',
			'copyN': '复制({n})',
			'downloadN': '下载({n})',
			'genScript': '生成下载脚本',
			'plsCheck': '请至少选择一项',
			'scriptCopied': '脚本已复制到剪贴板',
			'rescanDone': '重新扫描完成',
			'copiedN': '已复制 {n} 字符',
			'copyFail': '复制失败',
			'noDlResource': '无下载资源',
			'downloading': '下载中...',
			'batchStart': '开始批量下载 {n} 项（并发 {c}）',
			'batchDone': '✓ 批量下载完成：成功 {ok} / {total}，失败 {fail}，耗时 {t}秒',
			'dlStopped': '下载已停止',
			'scanDoneToast': '扫描完成',
			'filterAppliedToast': '筛选已应用',
			'noSelFile': '未选择文件',
			'startDlToast': '开始下载 {n} 个文件...',
			'noDlFile': '无下载文件',
			'noCopyUrl': '无链接可复制',
			'm3u8Start': '开始处理 m3u8',
			'm3u8Progress': '下载进度: {d}/{t}',
			'muxPreparing': '准备合流…', 'muxStageLib': '加载合流组件…', 'muxStageVideo': '下载视频轨 {p}%',
			'muxStageAudio': '下载音频轨 {p}%', 'muxStageParse': '解析轨道…', 'muxStageMux': '合并音视频…',
			'muxStageVerify': '校验产物…', 'muxOk': '合流完成', 'muxFail': '合流失败', 'muxSaved': '已保存合流后的视频',
			'muxSeparate': '已改为分别下载音视频（请用 ffmpeg 合并）', 'muxNoAudio': '这条流没有独立音频轨',
			'm3u8Done': 'm3u8 下载完成',
			'previewFail': '预览失败',
			'extractFail': '提取失败',
			'logLevelChanged': '日志级别已更改',
			'resetDone': '已重置为默认配置',
			'plsSelectText': '请选择文本',
			'transSelText': '翻译选中文本',
			'confirmDlSel': '开始下载 {n} 个文件？（同时下载可能会阻塞页面）',
			'confirmDlAll': '开始下载 {n} 个文件？',
			'confirmReset': '确认重置所有配置？',
			'pasteJson': '粘贴 JSON 配置',
			'm3u8Title': '流媒体：{n} 个 m3u8',
			'noM3u8': '暂无 m3u8 资源',
			'dlMerge': '下载并合并',
			'genScriptBtn': '生成脚本',
			'detailBtn': '详情',
			'm3u8Detail': 'm3u8 流媒体详情',
			'parsing': '解析中...',
			'parseResult': '解析结果：{n} 个分片',
			'masterStreams': '多码率流，共 {n} 个子流：',
			'segmentsInfo': '分片列表，共 {n} 个分片，总时长 {t}',
			'encrypted': 'AES 加密',
			'notEncrypted': '未加密',
			'yes': '是',
			'no': '否',
			'parseFailNet': '网络请求失败',
			'parseFailTimeout': '请求超时',
			'm3u8PreviewHint': 'm3u8 不可直接预览，请下载',
			'logLevelTitle': '日志级别（调试用）',
			'logDebug': '调试',
			'logInfo': '信息',
			'logWarn': '警告',
			'logError': '错误',
			'otherOps': '其他操作',
			'exportAllConfig': '导出全部配置',
			'importConfig': '导入配置',
			'resetAll': '↻ 重置全部设置',
			'batchTitle': '批量下载设置',
			'concurrency': '并发数：',
			'intervalMs': '间隔(ms)：',
			'retries': '重试次数：',
			'm3u8Settings': 'm3u8 流媒体设置',
			'qualityLabel': '默认码率：',
			'segmentsLabel': '分片并发：',
			'qualityAuto': '自动选择',
			'qualityHigh': '最高清晰度',
			'qualityMedium': '中等清晰度',
			'qualityLow': '最低清晰度',
			'requestHeaders': '请求头设置',
			'referer': 'Referer:',
			'userAgent': 'User-Agent:',
			'cookie': 'Cookie:',
			'infoLine1': '媒体嗅探器 Pro v1.18 · SelectionManager · 拖拽排序 · 收藏夹 · 智能去重 · 分组 · 批量操作注册 · 插件系统',
			'infoLine2': '快捷键：Alt+T 翻译选中 · Alt+B 开关面板 · Esc 关闭',
			'clickTabScan': '点击标签扫描',
			'dlProgress': '下载进度',
			'dlProgressText': '{done} / {total}（失败 {fail}）· {speed} · 预计剩余 {eta}',
			'shortcutTitle': '快捷键设置',
			'shortcutToggle': '开关面板',
			'shortcutTranslate': '翻译选中',
			'shortcutClose': '关闭面板',
			'shortcutKey': '按键',
			'shortcutMod': '修饰键',
			'shortcutModNone': '无',
			'shortcutModAlt': 'Alt',
			'shortcutModCtrl': 'Ctrl',
			'shortcutModShift': 'Shift',
			'iframeBadge': 'iframe',
			'sendAria2': '发送到 Aria2',
			'downloadHistory': '下载历史',
			'clearHistory': '清空',
			'batchSuccessN': '成功下载 {n} 个文件',
			'aria2Settings': 'Aria2 推送设置',
			'aria2RpcUrl': 'Aria2 RPC 地址',
			'aria2RpcSecret': 'Aria2 RPC 密钥',
			'aria2Pushed': '已推送 {n} 个链接到 Aria2',
			'aria2PushFail': 'Aria2 推送失败',
			'aria2NoUrl': '未配置 Aria2 RPC 地址',
			'grpPlugins': '脚本市场 / 插件系统',
			'pluginRules': '自定义规则',
			'pluginRulesDesc': '按 host / URL / 正则匹配资源，决定允许或阻止显示',
			'pluginRuleName': '规则名称',
			'pluginRulePattern': '匹配内容',
			'pluginRuleType': '匹配方式',
			'pluginRuleHost': '域名',
			'pluginRuleUrl': 'URL 包含',
			'pluginRuleRegex': '正则表达式',
			'pluginRuleAction': '动作',
			'pluginRuleAllow': '允许',
			'pluginRuleBlock': '阻止',
			'pluginParsers': '解析器插件',
			'pluginParsersDesc': '第三方视频解析接口，匹配 URL 后优先调用',
			'parserName': '插件名称',
			'parserMatch': 'URL 匹配正则',
			'parserApi': 'API 地址（可用 {url} 占位符）',
			'parserMethod': '请求方式',
			'parserDataPath': '数据字段路径（可选）',
			'parserHeaders': '请求头 JSON（可选）',
			'addRule': '添加规则',
			'addParser': '添加解析器',
			'parserSteps': '多步流水线（steps，JSON，高级）',
			'parserStepsHint': '按顺序请求多个接口，用 {{变量}} 把上一步的结果传给下一步。留空即为单步模式。',
			'parserTemplate': '从模板新建',
			'parserTemplatePick': '选择模板…',
			'parserRunsTips': '适用站点（正则）',
			'grpAudioId': '音频识别（听歌识曲）',
			'audioIdDesc': '录几秒音频识别歌曲名 / 歌手，识别成功后一键复制分享。密钥只保存在本地。',
			'audioIdProvider': '识别通道',
			'audioIdNeedKey': '请先在设置里填好识别通道的密钥 / 地址',
			'audioIdBusy': '正在识别中，请稍候…',
			'transcribeBusy': '正在转写中，请稍候…',
			'webdavBackupFail': '备份失败: {e}',
			'audioIdProviderAudD': 'AudD（推荐，一个 Token 即可）',
			'audioIdProviderAcr': 'ACRCloud（付费/自建账号）',
			'audioIdProviderCustom': '自定义接口',
			'audioIdToken': 'AudD API Token',
			'audioIdAcrHost': 'ACRCloud Host',
			'audioIdAcrKey': 'ACRCloud Access Key',
			'audioIdAcrSecret': 'ACRCloud Access Secret',
			'audioIdCustomUrl': '自定义接口地址（POST 音频，返回 JSON）',
			'audioIdSeconds': '录音时长（秒）',
			'audioIdSource': '音频来源',
			'audioIdSourcePage': '页面播放的声音（免权限）',
			'audioIdSourceMic': '麦克风（对着外放录音）',
			'audioIdRun': '开始识别',
			'audioIdStageCapture': '正在录音…还剩 {s} 秒',
			'audioIdStageIdentify': '正在识别…',
			'audioIdNoMatch': '没听出来这首曲子（换个段落或延长录音再试）',
			'audioIdResult': '识别结果',
			'audioIdCopyInfo': '复制歌曲信息',
			'audioIdCopiedInfo': '已复制歌曲信息',
			'audioIdHistory': '识别历史',
			'audioIdClearHistory': '清空识别历史',
			'audioIdNoHistory': '还没有识别记录',
			'grpTranscribe': '转文字 + AI 摘要',
			'transcribeDesc': '把视频的音频轨转成文稿，再让 AI 出一份摘要。多轨站点可直接用音频轨，无需先下载视频。密钥只保存在本地。',
			'asrBaseUrl': 'ASR 接口地址（Whisper 兼容）',
			'asrKey': 'ASR 密钥',
			'asrModel': 'ASR 模型',
			'asrLang': '语言（auto=自动）',
			'asrMaxMB': '单次上传上限（MB）',
			'asrChunkSeconds': '超限时每片秒数',
			'aiBaseUrl': 'AI 接口地址（OpenAI 兼容）',
			'aiKey': 'AI 密钥',
			'aiModel': 'AI 模型',
			'aiPromptStyle': '摘要风格',
			'styleSummary': '结构化摘要',
			'stylePoints': '要点清单',
			'styleTimeline': '时间轴提纲',
			'styleQa': '问答对',
			'transcribeRun': '转文字',
			'transcribeStageFetch': '下载音频…',
			'transcribeStageDecode': '解码并重采样…',
			'transcribeStageAsr': '转写中 {i}/{n}',
			'transcribeStageUpload': '上传中…',
			'transcribeStageSummary': 'AI 生成摘要…',
			'transcribeResult': '转写结果',
			'transcribeCopyText': '复制全文',
			'transcribeCopyMd': '复制 Markdown',
			'transcribeSaveMd': '保存为 .md',
			'transcribeSummaryFailed': '（摘要失败：{e}）',
			'transcribeNoKey': '请先在设置里填写 ASR 密钥',
			'transcribeHistory': '转写历史',
			'transcribeClearHistory': '清空转写历史',
			'transcribeNoHistory': '还没有转写记录',
			'transcribeHistoryTruncated': '历史仅保留前 {n} 字',
			'grpWebdav': 'WebDAV 后端（NAS）',
			'webdavDesc': '把配置与历史同步到 WebDAV，并可把下载文件直接存进 NAS。密码仅保存在本地，不会写入备份文件。',
			'webdavEnabled': '启用 WebDAV',
			'webdavUrl': 'WebDAV 地址（https://nas.example.com/dav/）',
			'webdavDir': '子目录',
			'webdavUser': '用户名',
			'webdavPass': '密码',
			'webdavTest': '测试连接',
			'webdavTesting': '正在测试…',
			'webdavTestOk': '连接成功，目录下 {n} 个文件',
			'webdavBackup': '备份到云端',
			'webdavRestore': '从云端恢复',
			'webdavBackupOk': '已备份（{kb} KB）',
			'webdavRestoreOk': '已恢复 {n} 项配置',
			'webdavLastSync': '上次同步：{t}',
			'webdavNever': '从未同步',
			'webdavUploadDownloads': '下载文件直接存到 NAS（不落本地下载目录）',
			'webdavUploaded': '已上传到 NAS：{name}',
			'webdavUploadFailed': 'NAS 上传失败（已回退到本地下载）: {e}',
			'webdavNeedConfig': '请先填写 WebDAV 地址',
			'edit': '编辑',
			'noRules': '暂无自定义规则',
			'noParsers': '暂无解析器插件',
			'pluginSaved': '插件配置已保存',
			'pluginDeleted': '已删除',
			'confirmDeleteRule': '确认删除这条规则？',
			'confirmDeleteParser': '确认删除这个解析器插件？',
			'paletteCustom': '自定义',
			'paletteAddCustom': '添加自定义配色',
			'paletteName': '配色名称',
			'paletteLightPrimary': '亮色主色',
			'paletteLightSecondary': '亮色辅色',
			'paletteDarkPrimary': '暗色主色',
			'paletteDarkSecondary': '暗色辅色',
			'paletteEdit': '编辑配色',
			'confirmDeletePalette': '确认删除该配色？',
			'ctxOpenPanel': '打开面板',
			'ctxQuickDownload': '快速下载',
			'ctxTranslate': '翻译',
			'ctxSettings': '设置',
			'ctxClose': '关闭',
			'tabPlugins': '插件',
			'pluginMarket': '插件市场',
			'pluginInstalled': '已安装',
			'pluginInstall': '安装',
			'pluginUninstall': '卸载',
			'pluginEnable': '启用',
			'pluginDisable': '禁用',
			'pluginInstalledN': '已安装 {n} 个插件',
			'pluginMarketN': '市场共 {n} 个插件',
			'noInstalledPlugins': '暂无已安装插件，去市场看看吧',
			'pluginInstalledToast': '插件「{name}」安装成功',
			'pluginUninstalledToast': '插件「{name}」已卸载',
			'pluginEnabledToast': '插件「{name}」已启用',
			'pluginDisabledToast': '插件「{name}」已禁用',
			'pluginVersion': '版本',
			'pluginAuthor': '作者',
			'pluginCategory': '分类',
			'pluginDesc': '简介',
			'pluginCatEnhance': '增强功能',
			'pluginCatDownload': '下载辅助',
			'pluginCatParse': '解析扩展',
			'pluginCatUi': '界面美化',
			'pluginCatTool': '实用工具',
			'confirmUninstallPlugin': '确认卸载插件「{name}」？该插件的配置数据也会被清除。',
			'pluginAutoTrans': '自动翻译插件',
			'pluginAutoTransDesc': '资源列表一键批量翻译文件名，支持多引擎切换',
			'pluginBatchRename': '批量重命名',
			'pluginBatchRenameDesc': '按规则对下载文件名进行批量重命名：序号、日期、域名、自定义模板',
			'pluginNoWatermark': '视频去水印',
			'pluginNoWatermarkDesc': '对常见视频平台提取无水印直链，支持抖音、快手、小红书等',
			'pluginAutoCover': '自动封面提取',
			'pluginAutoCoverDesc': '自动分析视频元数据并提取高清封面，支持自定义尺寸',
			'pluginQualityBoost': '画质增强',
			'pluginQualityBoostDesc': '搜索并优先选择更高码率/更高分辨率的媒体资源版本',
			'pluginShortcutsPlus': '快捷键增强',
			'pluginShortcutsPlusDesc': '增加更多自定义快捷键：全选、反选、批量下载、快速筛选等',
			'pluginDarkPro': '暗色主题Pro',
			'pluginDarkProDesc': '提供更多精致的暗色配色方案，支持毛玻璃和渐变色效果',
			'pluginExportList': '资源导出助手',
			'pluginExportListDesc': '把资源列表导出为 HTML/Markdown/CSV/JSON 多种格式，方便分享和存档',
			'pluginSubTabMarket': '市场',
			'pluginSubTabInstalled': '已安装',
			},
		'en-US': {
			'scan': 'Scan',
			'rescan': 'Rescan', 'img': 'Images',
			'video': 'Videos', 'audio': 'Audio',
			'm3u8': 'Streams',
			'translate': 'Translate',
			'cookie': 'Cookies', 'storage': 'Storage',
			'settings': 'Settings', 'domain': 'Domain',
			'close': 'Close',
			'download': 'Download',
			'downloadAll': 'Download All',
			'downloadSel': 'Download Selected',
			'copyUrl': 'Copy URL',
			'copyAllUrl': 'Copy All URLs',
			'copySelUrl': 'Copy Selected URLs',
			'openTab': 'Open in New Tab',
			'preview': 'Preview',
			'search': 'Search...',
			'filter': 'Filter', 'filterSize': 'Size Filter',
			'minSize': 'Min Size (KB)', 'maxSize': 'Max Size (KB, 0=unlimited)',
			'applyFilter': 'Apply', 'resetFilter': 'Reset',
			'totalItems': 'Total:', 'items': 'items',
			'showing': 'Showing {shown} / {total} items',
			'found': 'Found',
			'selected': 'selected', 'selectAll': 'Select All',
			'deselectAll': 'Deselect All', 'noMedia': 'No resources yet',
			'lang': 'UI Language', 'theme': 'Theme',
			'system': 'System',
			'light': 'Light',
			'dark': 'Dark', 'autoMerge': 'Auto Merge',
			'autoThumb': 'Extract Video Thumbnails', 'autoThumbDesc': 'Auto load first video frame as thumbnail',
			'enabled': 'Enabled', 'disabled': '○ Disabled',
			'domainRules': 'Domain Rules',
			'domainRulesDesc': 'One per line: domain,img,video,audio,depth (e.g. baidu.com,1,0,0,1)',
			'clearCache': 'Clear Cache', 'saved': 'Saved',
			'ok': 'OK',
			'fail': 'Failed',
			'loading': 'Loading...',
			'confirm': 'Confirm',
			'cancel': 'Cancel', 'size': 'Size',
			'duration': 'Duration', 'url': 'URL',
			'name': 'Name',
			'hint': 'Click=Preview · Double-click=Download · Shift+click=Multi-select',
			'langSelect': 'UI Language', 'themeSelect': 'UI Theme',
			'themeAuto': 'System', 'themeLight': 'Light',
			'themeDark': 'Dark',
			'uiStyleSelect': 'UI Style',
			'uiStyleDesc': 'Switch the panel visual style (Liquid Glass / Neumorphism / Neo-Brutalism / Terminal)',
			'uiStyleNormal': 'Normal',
			'uiStyleMaterial': 'Material', 'uiStyleIos27': 'iOS 27',
			'updateManualHint': 'Script URL opened: if the browser shows source code, copy it all and paste into a new userscript',
			'updateOpenHint': 'Update page opened — confirm “Update” in your userscript manager',
			'updateOpenFail': 'Could not open the update page; the URL is copied — paste it into the address bar',
			'updateDownloadScript': 'Or: download the script file (.user.js)',
			'updateDownloading': 'Download started — install it manually',
			'uiStyleNeumorph': 'Neumorphism', 'uiStyleBrutal': 'Neo-Brutalism', 'uiStyleTerminal': 'Terminal',
			'paletteSelect': 'Color Scheme',
			'paletteIndigo': 'Indigo',
			'palettePurple': 'Purple', 'paletteBlue': 'Blue',
			'paletteGreen': 'Green', 'paletteOrange': 'Orange',
			'paletteRose': 'Rose',
			'grpTheme': 'UI Theme',
			'grpPalette': 'Color Scheme', 'grpUiStyle': 'UI Style',
			'grpNameTpl': 'Filename Template',
			'grpBatch': 'Batch Download',
			'grpAria2': 'Aria2 Push', 'grpM3u8': 'm3u8 Stream',
			'grpHeaders': 'Request Headers', 'grpLog': 'Log Level',
			'grpOther': 'Other Actions',
			'grpLang': 'UI Language',
			'grpDomainRules': 'Domain Rules', 'grpVideoThumb': 'Video Thumbnail',
			'grpAutoUpdate': 'Auto Update', 'grpPersistSelection': 'Keep Selection on Close',
			'grpShortcuts': 'Shortcuts', 'grpDownloadHistory': 'Download History',
			'grpResourceHistory': 'Resource History',
			'enableHistory': 'Record resource history',
			'noResourceHistory': 'No resource history',
			'clearResourceHistory': 'Clear resource history',
			'confirmClearResourceHistory': 'Clear resource history?',
			'historyToday': 'Today',
			'historyYesterday': 'Yesterday',
			'historyWeek': 'Last 7 days',
			'historyOlder': 'Older',
			'autoCheckUpdate': 'Auto Check Update',
			'autoCheckUpdateDesc': 'Automatically check for updates on startup',
			'persistSelection': 'Keep Selection on Close',
			'persistSelectionDesc': 'Keep selected resources after closing the panel',
			'shiftSelectHint': 'Tip: In selection mode, hold Shift and click cards to select a range',
			'checkNow': 'Check Now', 'checkingUpdate': 'Checking for updates...',
			'updateLatest': 'Already up to date', 'updateFound': 'New version found',
			'updateCheckFail': 'Update check failed',
			'nameTpl': 'Download Filename Template',
			'saveRules': 'Save Domain Rules',
			'rulesSaved': 'Saved {n} domain rules',
			'coverExtracted': 'Cover extracted',
			'coverFail': 'Cover extraction failed',
			'coverWait': 'Extracting cover...',
			'loadingMeta': 'Loading...',
			'copied': 'Copied', 'noFiles': 'No downloadable files',
			'noSelected': 'No files selected', 'startDl': 'Starting download...',
			'renamePrompt': 'Rename file', 'dlDone': 'Download complete: {name}',
			'done': 'Done', 'stopped': 'Stopped',
			'scanning': 'Scanning...',
			'scanDone': 'Scan complete',
			'filterApplied': 'Filter applied',
			'appTitle': 'Media Sniffer Pro',
			'tabImg': 'Images',
			'tabDiag': 'Diagnostics',
			'diagTitle': 'Diagnostics & Self-check',
			'diagDesc': 'When reporting a problem, send the developer the "Copy report" output',
			'diagEnv': 'Environment',
			'diagStats': 'Runtime stats',
			'diagCaches': 'Cache usage',
			'diagPerf': 'Timing marks',
			'diagSelfCheck': 'Self-check',
			'diagLogs': 'Logs',
			'diagRunCheck': 'Re-run check',
			'diagCopyReport': 'Copy report',
			'diagClearLogs': 'Clear logs',
			'diagCopied': 'Report copied to clipboard',
			'diagCopyFail': 'Copy failed — please select the text manually',
			'diagLogLevel': 'Log level',
			'diagAllLevels': 'All',
			'diagEmptyLogs': '(no logs yet)',
			'diagRefresh': 'Refresh',
			'tabVideo': 'Videos',
			'tabAudio': 'Audio',
			'tabM3u8': 'Streams',
			'tabTranslate': 'Translate',
			'tabCookie': 'Cookies',
			'tabStorage': 'Storage',
			'tabSettings': ' Settings',
			'btnSelAll': 'Select All',
			'btnSelNone': 'Deselect All',
			'extractCover': 'Extract Cover',
			'filterPanel': 'Filter Settings',
			'advFilterTitle': 'Advanced Filter Settings',
			'advFilterDesc': 'Set thresholds, then click "Apply" to re-filter the resource list',
			'minImageSize': 'Min Image Size (bytes)',
			'minImageWidth': 'Min Image Width (px)',
			'minVideoDuration': 'Min Video Duration (sec)',
			'applyFilterBtn': 'Apply Filter',
			'filterNoMatch': 'No matches after filter',
			'minKb': 'Min Size (KB)',
			'maxKb': 'Max Size (KB, 0=unlimited)',
			'apply': 'Apply',
			'reset': 'Reset'
		,
			'searchPlaceholder': 'Search URL or filename…',
			'advFilter': 'Advanced Filter',
			'noCookie': 'No cookies on this page',
			'copyCookieStr': 'Copy Cookie String',
			'copyJson': 'Copy JSON',
			'addCookie': 'Add Cookie',
			'clearSite': 'Clear Site',
			'delete': 'Delete',
			'cookieName': 'Enter cookie name:',
			'cookieValue': 'Enter cookie value:',
			'confirmClearCookie': 'Clear all cookies for this site?',
			'clearedRefresh': 'Cleared, please refresh',
			'added': '✓ Added',
			'addFail': 'Add failed',
			'delFail': 'Delete failed',
			'clearFail': 'Clear failed',
			'readCookieFail': 'Cannot read cookies',
			'exportLs': 'Export localStorage',
			'exportSs': 'Export sessionStorage',
			'addItem': 'Add Item',
			'clearAll': 'Clear All',
			'keyName': 'Key:',
			'keyValue': 'Value:',
			'confirmClearStorage': 'Clear localStorage and sessionStorage?',
			'cleared': 'Cleared',
			'addToLs': '✓ Added to localStorage',
			'lsTitle': 'localStorage',
			'ssTitle': 'sessionStorage',
			'lsCount': 'localStorage {n} · sessionStorage {m}',
			'transTitle': 'Text Translation',
			'transIntro': '· MyMemory free API · Max 500 chars\n· Shortcut: Alt+T to translate selected text',
			'transInputPh': 'Enter or paste text to translate…',
			'transResultPh': 'Translation result appears here…',
			'transBtn': 'Translate',
			'zhToEn': 'ZH→EN',
			'enToZh': 'EN→ZH',
			'clearBtn': 'Clear',
			'copyResult': 'Copy Result',
			'resultAsInput': 'Use as Input',
			'plsInputText': 'Please enter text to translate',
			'translating': '⌛ Translating ({from} → {to})…',
			'translatingShort': 'Translating, please wait…',
			'transDone': '✓ Translated ·',
			'transFail': 'Translation failed',
			'transFailShort': '(failed)',
			'transEngine': 'Engine',
			'transEngineSelect': 'Select Engine',
			'transNeedKey': 'This engine requires API Key',
			'transNetErr': 'Network error',
			'transTimeout': 'Request timeout',
			'transAllFail': 'All translation engines failed',
			'transPartialFail': 'Some segments failed',
			'speakBtn': 'Speak',
			'transHistory': 'History',
			'transNoHistory': 'No translation history',
			'transClearHistory': 'Clear History',
			'engineMyMemory': 'MyMemory (Free)',
			'engineGoogle': 'Google Translate',
			'engineBing': 'Bing Translate',
			'engineBaidu': 'Baidu Translate',
			'engineDeepL': 'DeepL (High Quality)',
			'autoDetect': 'Auto Detect',
			'zhLang': 'Chinese',
			'enLang': 'English',
			'jaLang': 'Japanese',
			'koLang': 'Korean',
			'frLang': 'French',
			'deLang': 'German',
			'esLang': 'Spanish',
			'ruLang': 'Russian',
			'selInfo': '{sel} selected / {shown} shown ({total} total)',
			'selectAllBtn': 'Select All',
			'selectBtn': 'Select',
			'invertSel': 'Invert',
			'clearSel': 'Clear',
			'copySelBtn': 'Copy',
			'downloadSelBtn': 'Download',
			'copyN': 'Copy ({n})',
			'downloadN': 'Download ({n})',
			'genScript': 'Generate Script',
			'rescan': 'Rescan',
			'plsCheck': 'Please select resources first',
			'scriptCopied': 'aria2 script generated and copied',
			'rescanDone': '✓ Rescanned',
			'copiedN': 'Copied {n} chars',
			'copyFail': 'Copy failed',
			'noDlResource': 'No downloadable resources',
			'downloading': 'Download already in progress',
			'batchStart': '⬇ Starting batch download of {n} items ({c} concurrent)',
			'batchDone': 'Batch done: {ok}/{total} success, {fail} failed, {t}s',
			'dlStopped': '■ Download stopped',
			'scanDoneToast': 'Scan complete',
			'filterAppliedToast': '✓ Filter applied',
			'noSelFile': 'No files selected',
			'startDlToast': 'Starting download of {n} files...',
			'noDlFile': 'No downloadable files',
			'noCopyUrl': 'No URLs to copy',
			'm3u8Start': 'Starting m3u8 download...',
			'm3u8Progress': 'Progress: {d}/{t}',
			'muxPreparing': 'Preparing mux…', 'muxStageLib': 'Loading mux engine…', 'muxStageVideo': 'Downloading video track {p}%',
			'muxStageAudio': 'Downloading audio track {p}%', 'muxStageParse': 'Parsing tracks…', 'muxStageMux': 'Muxing…',
			'muxStageVerify': 'Verifying…', 'muxOk': 'Mux complete', 'muxFail': 'Mux failed', 'muxSaved': 'Saved muxed video',
			'muxSeparate': 'Downloading tracks separately (merge with ffmpeg)', 'muxNoAudio': 'No separate audio track in this stream',
			'm3u8Done': '✓ m3u8 merged and downloaded',
			'previewFail': 'Preview failed',
			'extractFail': 'Extraction failed',
			'logLevelChanged': 'Log level changed',
			'resetDone': '✓ Reset',
			'plsSelectText': 'Please select text to translate first',
			'transSelText': 'Translate Selection',
			'confirmDlSel': 'Download {n} selected files? (may block the page)',
			'confirmDlAll': 'Download all {n} files?',
			'confirmReset': 'Reset all settings?',
			'pasteJson': 'Paste config JSON:',
			'm3u8Title': 'Streams: {n} m3u8',
			'noM3u8': 'No m3u8 streams found',
			'dlMerge': 'Download & Merge',
			'genScriptBtn': 'Generate Script',
			'detailBtn': 'Details',
			'm3u8Detail': 'm3u8 Stream Details',
			'parsing': 'Parsing...',
			'parseResult': 'Parse result:',
			'masterStreams': 'Master playlist, {n} variants:',
			'segmentsInfo': '{n} segments, total duration {t}',
			'encrypted': 'Encrypted',
			'notEncrypted': 'Not encrypted',
			'yes': 'Yes',
			'no': 'No',
			'parseFailNet': 'Parse failed: network error',
			'parseFailTimeout': 'Parse failed: timeout',
			'm3u8PreviewHint': 'Stream (m3u8): use download function',
			'logLevelTitle': 'Log Level (debug)',
			'logDebug': 'DEBUG (verbose)',
			'logInfo': 'INFO (default)',
			'logWarn': 'WARN',
			'logError': 'ERROR (errors only)',
			'otherOps': 'Other Actions',
			'exportAllConfig': 'Export All Config',
			'importConfig': 'Import Config',
			'resetAll': '↻ Reset All Settings',
			'batchTitle': 'Batch Download Settings',
			'concurrency': 'Concurrency:',
			'intervalMs': 'Interval (ms):',
			'retries': 'Retries:',
			'm3u8Settings': 'm3u8 Stream Settings',
			'qualityLabel': 'Quality:',
			'segmentsLabel': 'Segments:',
			'qualityAuto': 'Auto',
			'qualityHigh': 'Best Quality',
			'qualityMedium': 'Medium',
			'qualityLow': 'Low',
			'requestHeaders': 'Request Headers',
			'referer': 'Referer:',
			'userAgent': 'User-Agent:',
			'cookie': 'Cookie:',
			'infoLine1': 'Media Sniffer Pro v1.18 · SelectionManager · Drag Sort · Favorites · Smart Dedup · Groups · Batch Actions · Plugin System',
			'infoLine2': 'Shortcuts: Alt+T Translate · Alt+B Toggle · Esc Close',
			'clickTabScan': 'Click a tab above to start scanning',
			'dlProgress': 'Download Progress',
			'dlProgressText': '{done} / {total} ({fail} failed) · {speed} · ETA {eta}',
			'shortcutTitle': 'Shortcuts',
			'shortcutToggle': 'Toggle Panel',
			'shortcutTranslate': 'Translate Selection',
			'shortcutClose': 'Close Panel',
			'shortcutKey': 'Key',
			'shortcutMod': 'Modifier',
			'shortcutModNone': 'None',
			'shortcutModAlt': 'Alt',
			'shortcutModCtrl': 'Ctrl',
			'shortcutModShift': 'Shift',
			'iframeBadge': 'iframe',
			'sendAria2': 'Send to Aria2',
			'downloadHistory': 'Download History',
			'clearHistory': 'Clear History',
			'batchSuccessN': 'Successfully downloaded {n} files',
			'aria2Settings': 'Aria2 Push Settings',
			'aria2RpcUrl': 'Aria2 RPC URL',
			'aria2RpcSecret': 'Aria2 RPC Secret',
			'aria2Pushed': 'Pushed {n} links to Aria2',
			'aria2PushFail': 'Aria2 push failed',
			'aria2NoUrl': 'Aria2 RPC URL not configured',
			'grpPlugins': 'Script Market / Plugins',
			'pluginRules': 'Custom Rules',
			'pluginRulesDesc': 'Filter resources by host / URL / regex with allow or block action',
			'pluginRuleName': 'Rule Name',
			'pluginRulePattern': 'Pattern',
			'pluginRuleType': 'Match Type',
			'pluginRuleHost': 'Host',
			'pluginRuleUrl': 'URL Contains',
			'pluginRuleRegex': 'Regex',
			'pluginRuleAction': 'Action',
			'pluginRuleAllow': 'Allow',
			'pluginRuleBlock': 'Block',
			'pluginParsers': 'Parser Plugins',
			'pluginParsersDesc': 'Third-party video parser APIs, matched URLs are resolved first',
			'parserName': 'Plugin Name',
			'parserMatch': 'URL Match Regex',
			'parserApi': 'API URL (use {url} placeholder)',
			'parserMethod': 'Method',
			'parserDataPath': 'Data Field Path (optional)',
			'parserHeaders': 'Headers JSON (optional)',
			'addRule': 'Add Rule',
			'addParser': 'Add Parser',
			'parserSteps': 'Multi-step pipeline (steps, JSON, advanced)',
			'parserStepsHint': 'Call APIs in order; pass results forward with {{var}}. Leave empty for single-step mode.',
			'parserTemplate': 'New from template',
			'parserTemplatePick': 'Pick a template…',
			'parserRunsTips': 'Applies to (regex)',
			'grpAudioId': 'Audio Recognition (Song ID)',
			'audioIdDesc': 'Record a few seconds to identify the song and artist, then copy a shareable line. Keys stay on your device.',
			'audioIdProvider': 'Provider',
			'audioIdNeedKey': 'Set the provider key/endpoint in Settings first',
			'audioIdBusy': 'Identifying, please wait…',
			'transcribeBusy': 'Transcribing, please wait…',
			'webdavBackupFail': 'Backup failed: {e}',
			'audioIdProviderAudD': 'AudD (recommended, one token)',
			'audioIdProviderAcr': 'ACRCloud (paid / self-hosted)',
			'audioIdProviderCustom': 'Custom endpoint',
			'audioIdToken': 'AudD API Token',
			'audioIdAcrHost': 'ACRCloud Host',
			'audioIdAcrKey': 'ACRCloud Access Key',
			'audioIdAcrSecret': 'ACRCloud Access Secret',
			'audioIdCustomUrl': 'Custom endpoint (POST audio, return JSON)',
			'audioIdSeconds': 'Record seconds',
			'audioIdSource': 'Audio source',
			'audioIdSourcePage': 'Playing in page (no permission)',
			'audioIdSourceMic': 'Microphone (hold near speaker)',
			'audioIdRun': 'Identify',
			'audioIdStageCapture': 'Recording… {s}s left',
			'audioIdStageIdentify': 'Identifying…',
			'audioIdNoMatch': 'No match (try another part or record longer)',
			'audioIdResult': 'Match found',
			'audioIdCopyInfo': 'Copy song info',
			'audioIdCopiedInfo': 'Song info copied',
			'audioIdHistory': 'Recognition history',
			'audioIdClearHistory': 'Clear history',
			'audioIdNoHistory': 'No records yet',
			'grpTranscribe': 'Transcript + AI Summary',
			'transcribeDesc': 'Turn a video\'s audio track into text, then let AI summarize it. Multi-track sites expose an audio track directly, so no download needed. Keys stay on your device.',
			'asrBaseUrl': 'ASR endpoint (Whisper-compatible)',
			'asrKey': 'ASR key',
			'asrModel': 'ASR model',
			'asrLang': 'Language (auto)',
			'asrMaxMB': 'Upload limit per request (MB)',
			'asrChunkSeconds': 'Chunk seconds when over limit',
			'aiBaseUrl': 'AI endpoint (OpenAI-compatible)',
			'aiKey': 'AI key',
			'aiModel': 'AI model',
			'aiPromptStyle': 'Summary style',
			'styleSummary': 'Structured summary',
			'stylePoints': 'Key points',
			'styleTimeline': 'Timed outline',
			'styleQa': 'Q&A pairs',
			'transcribeRun': 'Transcribe',
			'transcribeStageFetch': 'Downloading audio…',
			'transcribeStageDecode': 'Decoding / resampling…',
			'transcribeStageAsr': 'Transcribing {i}/{n}',
			'transcribeStageUpload': 'Uploading…',
			'transcribeStageSummary': 'AI summarizing…',
			'transcribeResult': 'Transcript',
			'transcribeCopyText': 'Copy text',
			'transcribeCopyMd': 'Copy Markdown',
			'transcribeSaveMd': 'Save as .md',
			'transcribeSummaryFailed': '(summary failed: {e})',
			'transcribeNoKey': 'Set your ASR key in Settings first',
			'transcribeHistory': 'Transcript history',
			'transcribeClearHistory': 'Clear history',
			'transcribeNoHistory': 'No records yet',
			'transcribeHistoryTruncated': 'History keeps only the first {n} characters',
			'grpWebdav': 'WebDAV Backend (NAS)',
			'webdavDesc': 'Sync settings and history to WebDAV, and optionally store downloads straight on your NAS. Passwords stay local and are never written into backups.',
			'webdavEnabled': 'Enable WebDAV',
			'webdavUrl': 'WebDAV URL (https://nas.example.com/dav/)',
			'webdavDir': 'Subfolder',
			'webdavUser': 'Username',
			'webdavPass': 'Password',
			'webdavTest': 'Test connection',
			'webdavTesting': 'Testing…',
			'webdavTestOk': 'Connected — {n} files in folder',
			'webdavBackup': 'Back up to cloud',
			'webdavRestore': 'Restore from cloud',
			'webdavBackupOk': 'Backed up ({kb} KB)',
			'webdavRestoreOk': 'Restored {n} settings',
			'webdavLastSync': 'Last sync: {t}',
			'webdavNever': 'never',
			'webdavUploadDownloads': 'Store downloads on NAS (skip local download folder)',
			'webdavUploaded': 'Uploaded to NAS: {name}',
			'webdavUploadFailed': 'NAS upload failed (fell back to local download): {e}',
			'webdavNeedConfig': 'Fill in the WebDAV URL first',
			'edit': 'Edit',
			'noRules': 'No custom rules',
			'noParsers': 'No parser plugins',
			'pluginSaved': 'Plugin config saved',
			'pluginDeleted': 'Deleted',
			'confirmDeleteRule': 'Delete this rule?',
			'confirmDeleteParser': 'Delete this parser plugin?',
			'paletteCustom': 'Custom',
			'paletteAddCustom': 'Add Custom Palette',
			'paletteName': 'Palette Name',
			'paletteLightPrimary': 'Light Primary',
			'paletteLightSecondary': 'Light Secondary',
			'paletteDarkPrimary': 'Dark Primary',
			'paletteDarkSecondary': 'Dark Secondary',
			'paletteEdit': 'Edit Palette',
			'confirmDeletePalette': 'Delete this palette?',
			'ctxOpenPanel': 'Open Panel',
			'ctxQuickDownload': 'Quick Download',
			'ctxTranslate': 'Translate',
			'ctxSettings': 'Settings',
			'ctxClose': 'Close',
			'tabPlugins': 'Plugins',
			'pluginMarket': 'Marketplace',
			'pluginInstalled': 'Installed',
			'pluginInstall': 'Install',
			'pluginUninstall': 'Uninstall',
			'pluginEnable': 'Enable',
			'pluginDisable': 'Disable',
			'pluginInstalledN': '{n} plugin(s) installed',
			'pluginMarketN': '{n} plugin(s) available',
			'noInstalledPlugins': 'No installed plugins. Browse the Marketplace!',
			'pluginInstalledToast': 'Plugin "{name}" installed',
			'pluginUninstalledToast': 'Plugin "{name}" uninstalled',
			'pluginEnabledToast': 'Plugin "{name}" enabled',
			'pluginDisabledToast': 'Plugin "{name}" disabled',
			'pluginVersion': 'Version',
			'pluginAuthor': 'Author',
			'pluginCategory': 'Category',
			'pluginDesc': 'Description',
			'pluginCatEnhance': 'Enhancement',
			'pluginCatDownload': 'Download',
			'pluginCatParse': 'Parser',
			'pluginCatUi': 'UI Theme',
			'pluginCatTool': 'Tools',
			'confirmUninstallPlugin': 'Uninstall plugin "{name}"? All its settings will be cleared.',
			'pluginAutoTrans': 'Auto Translate',
			'pluginAutoTransDesc': 'Batch translate filenames in the resource list with multi-engine support',
			'pluginBatchRename': 'Batch Rename',
			'pluginBatchRenameDesc': 'Rename downloaded files in batch using customizable patterns: index, date, domain, templates',
			'pluginNoWatermark': 'No Watermark',
			'pluginNoWatermarkDesc': 'Extract direct video links without watermark for TikTok, Kuaishou, Xiaohongshu, etc.',
			'pluginAutoCover': 'Auto Cover Extractor',
			'pluginAutoCoverDesc': 'Auto analyze video metadata and extract high quality covers with customizable sizes',
			'pluginQualityBoost': 'Quality Booster',
			'pluginQualityBoostDesc': 'Search and prefer higher bitrate / higher resolution media versions',
			'pluginShortcutsPlus': 'Shortcuts Plus',
			'pluginShortcutsPlusDesc': 'More customizable shortcuts: select all, invert, batch download, quick filter',
			'pluginDarkPro': 'Dark Theme Pro',
			'pluginDarkProDesc': 'More exquisite dark color palettes with frosted glass and gradient effects',
			'pluginExportList': 'Resource Exporter',
			'pluginExportListDesc': 'Export resource list to HTML / Markdown / CSV / JSON for sharing and archiving',
			'pluginSubTabMarket': 'Market',
			'pluginSubTabInstalled': 'Installed',
			},
		'ja-JP': {
			'scan': 'スキャン',
			'rescan': '再スキャン', 'img': '画像',
			'video': '動画', 'audio': '音声',
			'm3u8': 'ストリーム',
			'translate': '翻訳',
			'cookie': 'Cookie', 'storage': 'ストレージ',
			'settings': '設定', 'domain': 'ドメイン',
			'close': '閉じる',
			'download': 'ダウンロード',
			'downloadAll': '一括ダウンロード',
			'downloadSel': '選択した項目をダウンロード',
			'copyUrl': 'リンクをコピー',
			'copyAllUrl': '全リンクをコピー',
			'copySelUrl': '選択したリンクをコピー',
			'openTab': '新しいタブで開く',
			'preview': 'プレビュー',
			'search': '検索...',
			'filter': 'フィルター', 'filterSize': 'サイズフィルター',
			'minSize': '最小サイズ (KB)', 'maxSize': '最大サイズ (KB, 0=制限なし)',
			'applyFilter': '適用', 'resetFilter': 'リセット',
			'totalItems': '合計:', 'items': '項目',
			'showing': '{shown} / {total} 件を表示中',
			'found': '見つかりました',
			'selected': '選択済み',
			'selectAll': 'すべて選択',
			'deselectAll': '選択解除',
			'noMedia': 'リソースはありません',
			'lang': '言語',
			'theme': 'テーマ',
			'system': 'システムに従う', 'light': 'ライト',
			'dark': 'ダーク', 'autoMerge': '自動結合',
			'autoThumb': '動画サムネイル抽出',
			'autoThumbDesc': '動画フレームをサムネイルとして自動読み込み',
			'enabled': '有効', 'disabled': '○ 無効',
			'domainRules': 'ドメインルール', 'domainRulesDesc': '1行1ルール: ドメイン,画像,動画,音声,深度 (例: baidu.com,1,0,0,1)',
			'clearCache': 'キャッシュをクリア', 'saved': '保存しました',
			'ok': 'OK',
			'fail': '失敗',
			'loading': '読み込み中...', 'confirm': '確認',
			'cancel': 'キャンセル', 'size': 'サイズ',
			'duration': '長さ',
			'url': 'URL',
			'name': '名前', 'hint': 'クリック=プレビュー · ダブルクリック=ダウンロード',
			'langSelect': 'UI言語', 'themeSelect': 'UIテーマ',
			'themeAuto': 'システム', 'themeLight': 'ライト',
			'themeDark': 'ダーク',
			'uiStyleSelect': 'UIスタイル',
			'uiStyleDesc': 'パネルの外観スタイルを切り替え（Liquid Glass / ニューモーフィズム / ネオブルータリズム / ターミナル）',
			'uiStyleNormal': '通常',
			'uiStyleMaterial': 'Material', 'uiStyleIos27': 'iOS 27',
			'updateManualHint': 'スクリプトURLを開きました：ソースが表示された場合は全選択コピーして新規スクリプトに貼り付けてください',
			'updateOpenHint': '更新ページを開きました。スクリプトマネージャーで「更新」を確認してください',
			'updateOpenFail': '更新ページを開けませんでした。URLをコピーしたのでアドレスバーに貼り付けてください',
			'updateDownloadScript': 'または：スクリプトファイルをダウンロード（.user.js）',
			'updateDownloading': 'ダウンロードを開始しました。手動でインストールしてください',
			'uiStyleNeumorph': 'ニューモーフィズム', 'uiStyleBrutal': 'ネオブルータリズム', 'uiStyleTerminal': 'ターミナル',
			'paletteSelect': '配色スキーム',
			'paletteIndigo': 'インディゴ',
			'palettePurple': 'パープル', 'paletteBlue': 'ブルー',
			'paletteGreen': 'グリーン', 'paletteOrange': 'オレンジ',
			'paletteRose': 'ローズ',
			'autoCheckUpdate': '自動更新チェック',
			'autoCheckUpdateDesc': '起動時に自動で更新を確認',
			'checkNow': '今すぐ確認',
			'checkingUpdate': '更新を確認中...',
			'updateLatest': '最新バージョンです',
			'updateFound': '新しいバージョンが見つかりました',
			'updateCheckFail': '更新チェックに失敗しました',
			'nameTpl': 'ダウンロードファイル名テンプレート', 'saveRules': 'ドメインルールを保存',
			'rulesSaved': '{n} 件のルールを保存しました',
			'coverExtracted': 'カバーを抽出しました',
			'coverFail': 'カバー抽出に失敗しました', 'coverWait': 'カバー抽出中...',
			'loadingMeta': '読み込み中...',
			'copied': 'コピーしました',
			'noFiles': 'ダウンロード可能なファイルはありません',
			'noSelected': 'ファイルが選択されていません',
			'startDl': 'ダウンロード開始...', 'renamePrompt': 'ファイル名を変更',
			'dlDone': 'ダウンロード完了：{name}',
			'done': '完了',
			'stopped': '停止しました', 'scanning': 'スキャン中...',
			'scanDone': 'スキャン完了', 'filterApplied': 'フィルターを適用しました',
			'appTitle': 'メディアスニッファー Pro',
			'tabImg': '画像',
			'tabDiag': '診断',
			'diagTitle': '診断とセルフチェック',
			'diagDesc': '問題を報告する際は「レポートをコピー」の内容を開発者に送ってください',
			'diagEnv': '環境',
			'diagStats': '実行統計',
			'diagCaches': 'キャッシュ使用量',
			'diagPerf': '所要時間の記録',
			'diagSelfCheck': 'セルフチェック',
			'diagLogs': '実行ログ',
			'diagRunCheck': '再チェック',
			'diagCopyReport': 'レポートをコピー',
			'diagClearLogs': 'ログを消す',
			'diagCopied': 'レポートをクリップボードにコピーしました',
			'diagCopyFail': 'コピー失敗。手動で選択してください',
			'diagLogLevel': 'ログレベル',
			'diagAllLevels': 'すべて',
			'diagEmptyLogs': '（ログなし）',
			'diagRefresh': '更新',
			'tabVideo': '動画',
			'tabAudio': '音声',
			'tabM3u8': 'ストリーム',
			'tabTranslate': '翻訳',
			'tabCookie': 'Cookie',
			'tabStorage': 'ストレージ',
			'tabSettings': ' 設定',
			'btnSelAll': 'すべて選択',
			'btnSelNone': '選択解除',
			'extractCover': 'カバー抽出',
			'filterPanel': 'フィルター設定',
			'advFilterTitle': '詳細フィルター設定',
			'advFilterDesc': 'しきい値を設定し、「適用」をクリックしてリストを再フィルター',
			'minImageSize': '最小画像サイズ（バイト）',
			'minImageWidth': '最小画像幅（px）',
			'minVideoDuration': '最小動画長（秒）',
			'applyFilterBtn': 'フィルター適用',
			'filterNoMatch': 'フィルターに一致する項目はありません',
			'minKb': '最小サイズ (KB)',
			'maxKb': '最大サイズ (KB, 0=制限なし)',
			'apply': '適用',
			'reset': 'リセット'
		,
			'searchPlaceholder': 'URLまたはファイル名を検索…',
			'advFilter': '詳細フィルター',
			'noCookie': 'このページにCookieはありません',
			'copyCookieStr': 'Cookie文字列コピー',
			'copyJson': 'JSONコピー',
			'addCookie': 'Cookie追加',
			'clearSite': 'サイトをクリア',
			'delete': '削除',
			'cookieName': 'Cookie名を入力：',
			'cookieValue': 'Cookie値を入力：',
			'confirmClearCookie': 'このサイトのCookieをすべて削除しますか？',
			'clearedRefresh': 'クリアしました、更新してください',
			'added': '✓ 追加しました',
			'addFail': '追加失敗',
			'delFail': '削除失敗',
			'clearFail': 'クリア失敗',
			'readCookieFail': 'Cookieを読み込めません',
			'exportLs': 'localStorageをエクスポート',
			'exportSs': 'sessionStorageをエクスポート',
			'addItem': '項目を追加',
			'clearAll': 'すべてクリア',
			'keyName': 'キー：',
			'keyValue': '値：',
			'confirmClearStorage': 'localStorageとsessionStorageをクリアしますか？',
			'cleared': 'クリアしました',
			'addToLs': '✓ localStorageに追加しました',
			'lsTitle': 'localStorage',
			'ssTitle': 'sessionStorage',
			'lsCount': 'localStorage {n}件 ·  sessionStorage {m}件',
			'transTitle': 'テキスト翻訳',
			'transIntro': '・MyMemory無料API ・最大500文字\n・ショートカット: Alt+Tで選択テキスト翻訳',
			'transInputPh': '翻訳するテキストを入力または貼り付け…',
			'transResultPh': '翻訳結果がここに表示されます…',
			'transBtn': '翻訳',
			'zhToEn': '中→英',
			'enToZh': '英→中',
			'clearBtn': 'クリア',
			'copyResult': '結果をコピー',
			'resultAsInput': '結果を入力に',
			'plsInputText': '翻訳するテキストを入力してください',
			'translating': '⌛ 翻訳中（{from} → {to}）…',
			'translatingShort': '翻訳中、しばらくお待ちください…',
			'transDone': '✓ 翻訳完了 ·',
			'transFail': '翻訳失敗',
			'transFailShort': '（失敗）',
			'autoDetect': '自動検出',
			'zhLang': '中国語',
			'enLang': '英語',
			'jaLang': '日本語',
			'koLang': '韓国語',
			'frLang': 'フランス語',
			'deLang': 'ドイツ語',
			'esLang': 'スペイン語',
			'ruLang': 'ロシア語',
			'selInfo': '{sel}件選択 / {shown}件表示（全{total}件）',
			'selectAllBtn': 'すべて選択',
			'invertSel': '反転',
			'clearSel': 'クリア',
			'copySelBtn': 'コピー',
			'downloadSelBtn': 'ダウンロード',
			'copyN': 'コピー({n})',
			'downloadN': 'ダウンロード({n})',
			'genScript': 'スクリプト生成',
			'rescan': '再スキャン',
			'plsCheck': 'リソースを選択してください',
			'scriptCopied': 'aria2スクリプト生成・コピー完了',
			'rescanDone': '✓ 再スキャン完了',
			'copiedN': '{n}文字コピーしました',
			'copyFail': 'コピー失敗',
			'noDlResource': 'ダウンロード可能なリソースはありません',
			'downloading': 'ダウンロード中です',
			'batchStart': '⬇ 一括DL開始：{n}件（同時{c}件）',
			'batchDone': '一括DL完了：成功{ok}/{total}件、失敗{fail}件、{t}秒',
			'dlStopped': '■ DL停止しました',
			'scanDoneToast': 'スキャン完了',
			'filterAppliedToast': '✓ フィルター適用済み',
			'noSelFile': 'ファイルが選択されていません',
			'startDlToast': '{n}ファイルのDLを開始...',
			'noDlFile': 'ダウンロード可能なファイルはありません',
			'noCopyUrl': 'コピーするURLはありません',
			'm3u8Start': 'm3u8のDLを開始...',
			'm3u8Progress': '進捗: {d}/{t}',
			'muxPreparing': '合流を準備…', 'muxStageLib': '合流エンジンを読込中…', 'muxStageVideo': '映像トラックをDL中 {p}%',
			'muxStageAudio': '音声トラックをDL中 {p}%', 'muxStageParse': 'トラックを解析…', 'muxStageMux': '合成中…',
			'muxStageVerify': '検証中…', 'muxOk': '合流完了', 'muxFail': '合流失敗', 'muxSaved': '合流済み動画を保存しました',
			'muxSeparate': '映像と音声を別々にDLします（ffmpeg で結合）', 'muxNoAudio': '独立した音声トラックがありません',
			'm3u8Done': '✓ m3u8 結合・DL完了',
			'previewFail': 'プレビュー失敗',
			'extractFail': '抽出失敗',
			'logLevelChanged': 'ログレベル変更',
			'resetDone': '✓ リセット完了',
			'plsSelectText': '翻訳するテキストを選択してください',
			'transSelText': '選択を翻訳',
			'confirmDlSel': '{n}ファイルをDLしますか？（ページが固まる場合があります）',
			'confirmDlAll': '全{n}ファイルをDLしますか？',
			'confirmReset': 'すべての設定をリセットしますか？',
			'pasteJson': '設定JSONを貼り付け：',
			'm3u8Title': 'ストリーム：{n} m3u8',
			'noM3u8': 'm3u8ストリームはありません',
			'dlMerge': 'DLして結合',
			'genScriptBtn': 'スクリプト生成',
			'detailBtn': '詳細',
			'm3u8Detail': 'm3u8ストリーム詳細',
			'parsing': '解析中...',
			'parseResult': '解析結果：',
			'masterStreams': 'マスタープレイリスト、{n}ストリーム：',
			'segmentsInfo': '{n}セグメント、合計時間 {t}',
			'encrypted': '暗号化',
			'notEncrypted': '暗号化なし',
			'yes': 'はい',
			'no': 'いいえ',
			'parseFailNet': '解析失敗：ネットワークエラー',
			'parseFailTimeout': '解析失敗：タイムアウト',
			'm3u8PreviewHint': 'ストリーム (m3u8)：ダウンロード機能を使ってください',
			'logLevelTitle': 'ログレベル（デバッグ用）',
			'logDebug': 'DEBUG（詳細）',
			'logInfo': 'INFO（デフォルト）',
			'logWarn': 'WARN（警告）',
			'logError': 'ERROR（エラーのみ）',
			'otherOps': 'その他の操作',
			'exportAllConfig': '全設定エクスポート',
			'importConfig': '設定インポート',
			'resetAll': '↻ 全設定リセット',
			'batchTitle': '一括DL設定',
			'concurrency': '同時実行数:',
			'intervalMs': '間隔(ms):',
			'retries': 'リトライ:',
			'm3u8Settings': 'm3u8ストリーム設定',
			'qualityLabel': '品質:',
			'segmentsLabel': 'セグメント:',
			'qualityAuto': '自動',
			'qualityHigh': '最高',
			'qualityMedium': '中',
			'qualityLow': '低',
			'requestHeaders': 'リクエストヘッダー',
			'referer': 'Referer:',
			'userAgent': 'User-Agent:',
			'cookie': 'Cookie:',
			'infoLine1': 'メディアスニッファー Pro v1.18 · モジュール設計 · AES-128復号 · 仮想リスト · 進捗可視化 · プラグインシステム',
			'infoLine2': 'ショートカット: Alt+T 翻訳 · Alt+B パネル切替 · Esc 閉じる',
			'clickTabScan': '上のタブをクリックしてスキャン開始',
			'dlProgress': 'ダウンロード進捗',
			'dlProgressText': '{done} / {total}（失敗 {fail}）· {speed} · 残り {eta}',
			'sendAria2': 'Aria2に送信',
			'downloadHistory': 'ダウンロード履歴',
			'clearHistory': '履歴をクリア',
			'grpResourceHistory': 'リソース履歴',
			'enableHistory': 'リソース履歴を記録',
			'noResourceHistory': 'リソース履歴がありません',
			'clearResourceHistory': 'リソース履歴をクリア',
			'confirmClearResourceHistory': 'リソース履歴をクリアしますか？',
			'historyToday': '今日',
			'historyYesterday': '昨日',
			'historyWeek': '過去7日間',
			'historyOlder': 'それ以前',
			'batchSuccessN': '{n} 件のファイルをダウンロードしました',
			'aria2Settings': 'Aria2 プッシュ設定',
			'aria2RpcUrl': 'Aria2 RPC URL',
			'aria2RpcSecret': 'Aria2 RPC シークレット',
			'aria2Pushed': '{n} 件のリンクをAria2に送信しました',
			'aria2PushFail': 'Aria2送信に失敗しました',
			'aria2NoUrl': 'Aria2 RPC URLが未設定です',
			'grpPlugins': 'スクリプトマーケット / プラグイン',
			'pluginRules': 'カスタムルール',
			'pluginRulesDesc': 'host / URL / 正規表現でリソースを許可またはブロック',
			'pluginRuleName': 'ルール名',
			'pluginRulePattern': 'パターン',
			'pluginRuleType': '一致方式',
			'pluginRuleHost': 'ホスト',
			'pluginRuleUrl': 'URLに含む',
			'pluginRuleRegex': '正規表現',
			'pluginRuleAction': 'アクション',
			'pluginRuleAllow': '許可',
			'pluginRuleBlock': 'ブロック',
			'pluginParsers': 'パーサープラグイン',
			'pluginParsersDesc': 'サードパーティ動画解析API、一致URLを優先して呼び出す',
			'parserName': 'プラグイン名',
			'parserMatch': 'URL一致正規表現',
			'parserApi': 'API URL（{url}プレースホルダー使用可）',
			'parserMethod': 'メソッド',
			'parserDataPath': 'データフィールドパス（任意）',
			'parserHeaders': 'ヘッダーJSON（任意）',
			'addRule': 'ルール追加',
			'addParser': 'パーサー追加',
			'parserSteps': 'マルチステップ（steps、JSON、上級）',
			'parserStepsHint': '複数APIを順に呼び出し、{{変数}} で前の結果を次へ渡します。空欄なら単一ステップ。',
			'parserTemplate': 'テンプレートから作成',
			'parserTemplatePick': 'テンプレートを選択…',
			'parserRunsTips': '適用サイト（正規表現）',
			'grpAudioId': '楽曲認識（曲名検索）',
			'audioIdDesc': '数秒録音して曲名・アーティストを特定し、ワンタッチで共有用テキストをコピー。キーは端末内のみに保存します。',
			'audioIdProvider': '認識チャンネル',
			'audioIdNeedKey': '先に設定で認識チャンネルのキー / アドレスを入力してください',
			'audioIdBusy': '認識中です。しばらくお待ちください…',
			'transcribeBusy': '文字起こし中です。しばらくお待ちください…',
			'webdavBackupFail': 'バックアップ失敗: {e}',
			'audioIdProviderAudD': 'AudD（推奨・トークン1つ）',
			'audioIdProviderAcr': 'ACRCloud（有料/自前）',
			'audioIdProviderCustom': 'カスタムAPI',
			'audioIdToken': 'AudD API Token',
			'audioIdAcrHost': 'ACRCloud Host',
			'audioIdAcrKey': 'ACRCloud Access Key',
			'audioIdAcrSecret': 'ACRCloud Access Secret',
			'audioIdCustomUrl': 'カスタムAPI（音声をPOSTしJSONを返す）',
			'audioIdSeconds': '録音秒数',
			'audioIdSource': '音声ソース',
			'audioIdSourcePage': 'ページ再生音（権限不要）',
			'audioIdSourceMic': 'マイク（スピーカーに向ける）',
			'audioIdRun': '認識開始',
			'audioIdStageCapture': '録音中…残り {s} 秒',
			'audioIdStageIdentify': '認識中…',
			'audioIdNoMatch': '曲を特定できませんでした（別の箇所か長めに録音してください）',
			'audioIdResult': '認識結果',
			'audioIdCopyInfo': '曲情報をコピー',
			'audioIdCopiedInfo': '曲情報をコピーしました',
			'audioIdHistory': '認識履歴',
			'audioIdClearHistory': '履歴を消去',
			'audioIdNoHistory': '記録はまだありません',
			'grpTranscribe': '文字起こし + AI要約',
			'transcribeDesc': '動画の音声トラックを文字起こしし、AIで要約します。マルチトラックサイトは音声トラックを直接使えるので動画DL不要。キーは端末内のみ。',
			'asrBaseUrl': 'ASRエンドポイント（Whisper互換）',
			'asrKey': 'ASRキー',
			'asrModel': 'ASRモデル',
			'asrLang': '言語（auto=自動）',
			'asrMaxMB': '1回のアップロード上限（MB）',
			'asrChunkSeconds': '超過時の分割秒数',
			'aiBaseUrl': 'AIエンドポイント（OpenAI互換）',
			'aiKey': 'AIキー',
			'aiModel': 'AIモデル',
			'aiPromptStyle': '要約スタイル',
			'styleSummary': '構造化要約',
			'stylePoints': '要点リスト',
			'styleTimeline': 'タイムライン',
			'styleQa': 'Q&A形式',
			'transcribeRun': '文字起こし',
			'transcribeStageFetch': '音声を取得中…',
			'transcribeStageDecode': 'デコード/リサンプル中…',
			'transcribeStageAsr': '変換中 {i}/{n}',
			'transcribeStageUpload': 'アップロード中…',
			'transcribeStageSummary': 'AIが要約中…',
			'transcribeResult': '文字起こし結果',
			'transcribeCopyText': '全文をコピー',
			'transcribeCopyMd': 'Markdownをコピー',
			'transcribeSaveMd': '.md として保存',
			'transcribeSummaryFailed': '（要約失敗：{e}）',
			'transcribeNoKey': '先に設定でASRキーを入力してください',
			'transcribeHistory': '文字起こし履歴',
			'transcribeClearHistory': '履歴を消去',
			'transcribeNoHistory': '記録はまだありません',
			'transcribeHistoryTruncated': '履歴は先頭 {n} 文字のみ保存',
			'grpWebdav': 'WebDAVバックエンド（NAS）',
			'webdavDesc': '設定と履歴をWebDAVに同期し、ダウンロードをNASへ直接保存できます。パスワードは端末内のみでバックアップに含めません。',
			'webdavEnabled': 'WebDAVを有効化',
			'webdavUrl': 'WebDAV URL（https://nas.example.com/dav/）',
			'webdavDir': 'サブフォルダ',
			'webdavUser': 'ユーザー名',
			'webdavPass': 'パスワード',
			'webdavTest': '接続テスト',
			'webdavTesting': 'テスト中…',
			'webdavTestOk': '接続成功・フォルダ内 {n} 件',
			'webdavBackup': 'クラウドへバックアップ',
			'webdavRestore': 'クラウドから復元',
			'webdavBackupOk': 'バックアップ完了（{kb} KB）',
			'webdavRestoreOk': '{n} 項目を復元しました',
			'webdavLastSync': '前回同期：{t}',
			'webdavNever': '未同期',
			'webdavUploadDownloads': 'ダウンロードをNASへ直接保存',
			'webdavUploaded': 'NASへアップロード済み：{name}',
			'webdavUploadFailed': 'NASへのアップロードに失敗（ローカル保存に切替）: {e}',
			'webdavNeedConfig': '先にWebDAVアドレスを入力してください',
			'edit': '編集',
			'noRules': 'カスタムルールなし',
			'noParsers': 'パーサープラグインなし',
			'pluginSaved': 'プラグイン設定を保存しました',
			'pluginDeleted': '削除しました',
			'confirmDeleteRule': 'このルールを削除しますか？',
			'confirmDeleteParser': 'このパーサープラグインを削除しますか？',
			'paletteCustom': 'カスタム',
			'paletteAddCustom': 'カスタム配色を追加',
			'paletteName': '配色名',
			'paletteLightPrimary': 'ライトメイン',
			'paletteLightSecondary': 'ライトサブ',
			'paletteDarkPrimary': 'ダークメイン',
			'paletteDarkSecondary': 'ダークサブ',
			'paletteEdit': '配色を編集',
			'confirmDeletePalette': 'この配色を削除しますか？',
			'ctxOpenPanel': 'パネルを開く',
			'ctxQuickDownload': 'クイックダウンロード',
			'ctxTranslate': '翻訳',
			'ctxSettings': '設定',
			'ctxClose': '閉じる',
			'tabPlugins': 'プラグイン',
			'pluginMarket': 'マーケット',
			'pluginInstalled': 'インストール済み',
			'pluginInstall': 'インストール',
			'pluginUninstall': 'アンインストール',
			'pluginEnable': '有効化',
			'pluginDisable': '無効化',
			'pluginInstalledN': 'インストール済み {n} 件',
			'pluginMarketN': 'マーケット合計 {n} 件',
			'noInstalledPlugins': 'インストール済みプラグインはありません。マーケットをご覧ください',
			'pluginInstalledToast': 'プラグイン「{name}」をインストールしました',
			'pluginUninstalledToast': 'プラグイン「{name}」をアンインストールしました',
			'pluginEnabledToast': 'プラグイン「{name}」を有効化しました',
			'pluginDisabledToast': 'プラグイン「{name}」を無効化しました',
			'pluginVersion': 'バージョン',
			'pluginAuthor': '作者',
			'pluginCategory': 'カテゴリ',
			'pluginDesc': '説明',
			'pluginCatEnhance': '機能拡張',
			'pluginCatDownload': 'ダウンロード',
			'pluginCatParse': 'パーサー',
			'pluginCatUi': 'UIテーマ',
			'pluginCatTool': 'ツール',
			'confirmUninstallPlugin': 'プラグイン「{name}」をアンインストールしますか？設定データも削除されます。',
			'pluginAutoTrans': '自動翻訳プラグイン',
			'pluginAutoTransDesc': 'リソース一括のファイル名翻訳、複数エンジン切替対応',
			'pluginBatchRename': '一括リネーム',
			'pluginBatchRenameDesc': 'ダウンロードファイル名をルールで一括改名：連番、日付、ドメイン、テンプレート',
			'pluginNoWatermark': '動画透かし除去',
			'pluginNoWatermarkDesc': '人気動画サイトの透かしなし直リンクを抽出（抖音、快手、小红书など）',
			'pluginAutoCover': '自動カバー抽出',
			'pluginAutoCoverDesc': '動画メタデータを自動解析し高画質カバーを抽出、サイズカスタマイズ可',
			'pluginQualityBoost': '画質ブースト',
			'pluginQualityBoostDesc': 'より高ビットレート/高解像度のメディアを優先的に検索',
			'pluginShortcutsPlus': 'ショートカット強化',
			'pluginShortcutsPlusDesc': '全選、反転、一括DL、クイックフィルタなどのショートカット追加',
			'pluginDarkPro': 'ダークテーマPro',
			'pluginDarkProDesc': 'すりガラス・グラデーション対応の高品質ダークテーマ',
			'pluginExportList': 'リソース出力',
			'pluginExportListDesc': 'リソース一覧をHTML/Markdown/CSV/JSON形式で出力、共有・保存に便利',
			'pluginSubTabMarket': 'マーケット',
			'pluginSubTabInstalled': 'インストール済み',
			},
		'ko-KR': {
			'scan': '스캔',
			'rescan': '재스캔', 'img': '이미지',
			'video': '영상', 'audio': '오디오',
			'm3u8': '스트림',
			'translate': '번역',
			'cookie': '쿠키', 'storage': '저장소',
			'settings': '설정', 'domain': '도메인',
			'close': '닫기',
			'download': '다운로드',
			'downloadAll': '전체 다운로드',
			'downloadSel': '선택 다운로드',
			'copyUrl': '링크 복사',
			'copyAllUrl': '전체 링크 복사',
			'copySelUrl': '선택 링크 복사',
			'openTab': '새 탭에서 열기',
			'preview': '미리보기',
			'search': '검색...',
			'filter': '필터', 'filterSize': '크기 필터',
			'minSize': '최소 크기 (KB)', 'maxSize': '최대 크기 (KB, 0=제한없음)',
			'applyFilter': '적용', 'resetFilter': '재설정',
			'totalItems': '총:', 'items': '개',
			'showing': '{shown} / {total} 항목 표시 중',
			'found': '발견',
			'selected': '선택됨',
			'selectAll': '전체 선택',
			'deselectAll': '선택 해제',
			'noMedia': '리소스 없음',
			'lang': '언어',
			'theme': '테마',
			'system': '시스템 설정', 'light': '라이트',
			'dark': '다크', 'autoMerge': '자동 병합',
			'autoThumb': '영상 썸네일 추출',
			'autoThumbDesc': '동영상 첫 프레임을 썸네일로',
			'enabled': '활성', 'disabled': '○ 비활성',
			'domainRules': '도메인 규칙', 'domainRulesDesc': '줄당 1규칙: 도메인,이미지,영상,음성,깊이',
			'clearCache': '캐시 지우기', 'saved': '저장됨',
			'ok': 'OK',
			'fail': '실패',
			'loading': '로딩 중...', 'confirm': '확인',
			'cancel': '취소', 'size': '크기',
			'duration': '길이',
			'url': 'URL',
			'name': '이름', 'hint': '클릭=미리보기 · 더블클릭=다운로드',
			'langSelect': 'UI 언어', 'themeSelect': 'UI 테마',
			'themeAuto': '시스템', 'themeLight': '라이트',
			'themeDark': '다크',
			'uiStyleSelect': 'UI 스타일',
			'uiStyleDesc': '패널 시각 스타일 전환(Liquid Glass / 뉴모피즘 / 네오 브루탈리즘 / 터미널)',
			'uiStyleNormal': '일반',
			'uiStyleMaterial': 'Material', 'uiStyleIos27': 'iOS 27',
			'updateManualHint': '스크립트 주소를 열었습니다. 소스가 보이면 전체 복사 후 새 스크립트에 붙여넣으세요',
			'updateOpenHint': '업데이트 페이지를 열었습니다. 스크립트 관리자에서 “업데이트”를 확인하세요',
			'updateOpenFail': '업데이트 페이지를 열 수 없습니다. 주소를 복사했으니 브라우저 주소창에 붙여넣으세요',
			'updateDownloadScript': '또는: 스크립트 파일 다운로드 (.user.js)',
			'updateDownloading': '다운로드를 시작했습니다. 수동으로 설치하세요',
			'uiStyleNeumorph': '뉴모피즘', 'uiStyleBrutal': '네오 브루탈리즘', 'uiStyleTerminal': '터미널',
			'paletteSelect': '컬러 스킴',
			'paletteIndigo': '인디고',
			'palettePurple': '퍼플', 'paletteBlue': '블루',
			'paletteGreen': '그린', 'paletteOrange': '오렌지',
			'paletteRose': '로즈',
			'autoCheckUpdate': '자동 업데이트 확인',
			'autoCheckUpdateDesc': '시작 시 자동으로 업데이트 확인',
			'checkNow': '지금 확인',
			'checkingUpdate': '업데이트 확인 중...',
			'updateLatest': '최신 버전입니다',
			'updateFound': '새 버전 발견',
			'updateCheckFail': '업데이트 확인 실패',
			'nameTpl': '다운로드 파일명 템플릿', 'saveRules': '도메인 규칙 저장',
			'rulesSaved': '{n}개의 규칙이 저장됨',
			'coverExtracted': '썸네일 추출됨',
			'coverFail': '썸네일 추출 실패', 'coverWait': '썸네일 추출 중...',
			'loadingMeta': '로딩 중...',
			'copied': '복사됨',
			'noFiles': '다운로드할 파일 없음',
			'noSelected': '선택된 파일 없음',
			'startDl': '다운로드 시작...', 'renamePrompt': '파일 이름 변경',
			'dlDone': '다운로드 완료: {name}',
			'done': '완료',
			'stopped': '중지됨', 'scanning': '스캔 중...',
			'scanDone': '스캔 완료', 'filterApplied': '필터 적용됨',
			'appTitle': '미디어 스니퍼 Pro',
			'tabImg': '이미지',
			'tabDiag': '진단',
			'diagTitle': '진단 및 자체 점검',
			'diagDesc': '문제를 보고할 때 "보고서 복사" 내용을 개발자에게 보내주세요',
			'diagEnv': '환경',
			'diagStats': '실행 통계',
			'diagCaches': '캐시 사용량',
			'diagPerf': '소요 시간 기록',
			'diagSelfCheck': '자체 점검',
			'diagLogs': '실행 로그',
			'diagRunCheck': '다시 점검',
			'diagCopyReport': '보고서 복사',
			'diagClearLogs': '로그 지우기',
			'diagCopied': '보고서를 클립보드에 복사했습니다',
			'diagCopyFail': '복사 실패 — 직접 선택해 주세요',
			'diagLogLevel': '로그 레벨',
			'diagAllLevels': '전체',
			'diagEmptyLogs': '(로그 없음)',
			'diagRefresh': '새로고침',
			'tabVideo': '영상',
			'tabAudio': '오디오',
			'tabM3u8': '스트림',
			'tabTranslate': '번역',
			'tabCookie': '쿠키',
			'tabStorage': '저장소',
			'tabSettings': ' 설정',
			'btnSelAll': '전체 선택',
			'btnSelNone': '선택 해제',
			'extractCover': '썸네일 추출',
			'filterPanel': '필터 설정',
			'advFilterTitle': '고급 필터 설정',
			'advFilterDesc': '임계값을 설정한 후 "적용"을 클릭하여 리스트를 다시 필터링',
			'minImageSize': '최소 이미지 크기（바이트）',
			'minImageWidth': '최소 이미지 너비（px）',
			'minVideoDuration': '최소 영상 길이（초）',
			'applyFilterBtn': '필터 적용',
			'filterNoMatch': '필터와 일치하는 항목 없음',
			'minKb': '최소 크기 (KB)',
			'maxKb': '최대 크기 (KB, 0=제한없음)',
			'apply': '적용',
			'reset': '재설정'
		,
			'searchPlaceholder': 'URL 또는 파일명 검색…',
			'advFilter': '고급 필터',
			'noCookie': '이 페이지에 쿠키가 없습니다',
			'copyCookieStr': '쿠키 문자열 복사',
			'copyJson': 'JSON 복사',
			'addCookie': '쿠키 추가',
			'clearSite': '사이트 비우기',
			'delete': '삭제',
			'cookieName': '쿠키 이름을 입력하세요:',
			'cookieValue': '쿠키 값을 입력하세요:',
			'confirmClearCookie': '이 사이트의 모든 쿠키를 지우시겠습니까?',
			'clearedRefresh': '지워졌습니다, 새로고침하세요',
			'added': '✓ 추가됨',
			'addFail': '추가 실패',
			'delFail': '삭제 실패',
			'clearFail': '비우기 실패',
			'readCookieFail': '쿠키를 읽을 수 없습니다',
			'exportLs': 'localStorage 내보내기',
			'exportSs': 'sessionStorage 내보내기',
			'addItem': '항목 추가',
			'clearAll': '모두 비우기',
			'keyName': '키:',
			'keyValue': '값:',
			'confirmClearStorage': 'localStorage와 sessionStorage를 비우시겠습니까?',
			'cleared': '비워졌습니다',
			'addToLs': '✓ localStorage에 추가됨',
			'lsTitle': 'localStorage',
			'ssTitle': 'sessionStorage',
			'lsCount': 'localStorage {n}개 ·  sessionStorage {m}개',
			'transTitle': '텍스트 번역',
			'transIntro': '· MyMemory 무료 API · 최대 500자\n· 단축키: Alt+T로 선택 텍스트 번역',
			'transInputPh': '번역할 텍스트를 입력하거나 붙여넣으세요…',
			'transResultPh': '번역 결과가 여기에 표시됩니다…',
			'transBtn': '번역',
			'zhToEn': '중→영',
			'enToZh': '영→중',
			'clearBtn': '비우기',
			'copyResult': '결과 복사',
			'resultAsInput': '결과를 입력으로',
			'plsInputText': '번역할 텍스트를 입력하세요',
			'translating': '⌛ 번역 중（{from} → {to}）…',
			'translatingShort': '번역 중입니다…',
			'transDone': '✓ 번역 완료 ·',
			'transFail': '번역 실패',
			'transFailShort': '（실패）',
			'autoDetect': '자동 감지',
			'zhLang': '중국어',
			'enLang': '영어',
			'jaLang': '일본어',
			'koLang': '한국어',
			'frLang': '프랑스어',
			'deLang': '독일어',
			'esLang': '스페인어',
			'ruLang': '러시아어',
			'selInfo': '{sel}개 선택 / {shown}개 표시（총 {total}개）',
			'selectAllBtn': '전체 선택',
			'invertSel': '반전',
			'clearSel': '비우기',
			'copySelBtn': '복사',
			'downloadSelBtn': '다운로드',
			'copyN': '복사({n})',
			'downloadN': '다운로드({n})',
			'genScript': '스크립트 생성',
			'rescan': '재스캔',
			'plsCheck': '리소스를 선택하세요',
			'scriptCopied': 'aria2 스크립트 생성 및 복사됨',
			'rescanDone': '✓ 재스캔 완료',
			'copiedN': '{n}자 복사됨',
			'copyFail': '복사 실패',
			'noDlResource': '다운로드 가능한 리소스가 없습니다',
			'downloading': '이미 다운로드 중입니다',
			'batchStart': '⬇ 일괄 다운로드 시작: {n}개（동시 {c}개）',
			'batchDone': '일괄 완료: 성공 {ok}/{total}, 실패 {fail}, {t}초',
			'dlStopped': '■ 다운로드 중지됨',
			'scanDoneToast': '스캔 완료',
			'filterAppliedToast': '✓ 필터 적용됨',
			'noSelFile': '선택된 파일이 없습니다',
			'startDlToast': '{n}개 파일 다운로드 시작...',
			'noDlFile': '다운로드할 파일이 없습니다',
			'noCopyUrl': '복사할 URL이 없습니다',
			'm3u8Start': 'm3u8 다운로드 시작...',
			'm3u8Progress': '진행률: {d}/{t}',
			'muxPreparing': '합류 준비 중…', 'muxStageLib': '합류 엔진 로드 중…', 'muxStageVideo': '비디오 트랙 다운로드 {p}%',
			'muxStageAudio': '오디오 트랙 다운로드 {p}%', 'muxStageParse': '트랙 분석 중…', 'muxStageMux': '합치는 중…',
			'muxStageVerify': '검증 중…', 'muxOk': '합류 완료', 'muxFail': '합류 실패', 'muxSaved': '합류된 동영상을 저장했습니다',
			'muxSeparate': '트랙을 각각 다운로드합니다 (ffmpeg 로 병합)', 'muxNoAudio': '독립 오디오 트랙이 없습니다',
			'm3u8Done': '✓ m3u8 병합 및 다운로드 완료',
			'previewFail': '미리보기 실패',
			'extractFail': '추출 실패',
			'logLevelChanged': '로그 레벨 변경됨',
			'resetDone': '✓ 재설정됨',
			'plsSelectText': '번역할 텍스트를 먼저 선택하세요',
			'transSelText': '선택 번역',
			'confirmDlSel': '{n}개 파일을 다운로드하시겠습니까?（페이지가 느려질 수 있습니다）',
			'confirmDlAll': '총 {n}개 파일을 다운로드하시겠습니까?',
			'confirmReset': '모든 설정을 재설정하시겠습니까?',
			'pasteJson': '설정 JSON 붙여넣기:',
			'm3u8Title': '스트림: {n} m3u8',
			'noM3u8': 'm3u8 스트림이 없습니다',
			'dlMerge': '다운로드 및 병합',
			'genScriptBtn': '스크립트 생성',
			'detailBtn': '세부정보',
			'm3u8Detail': 'm3u8 스트림 세부정보',
			'parsing': '분석 중...',
			'parseResult': '분석 결과:',
			'masterStreams': '마스터 플레이리스트, {n}개 스트림:',
			'segmentsInfo': '{n}개 세그먼트, 총 재생시간 {t}',
			'encrypted': '암호화됨',
			'notEncrypted': '암호화 안됨',
			'yes': '예',
			'no': '아니요',
			'parseFailNet': '분석 실패: 네트워크 오류',
			'parseFailTimeout': '분석 실패: 시간 초과',
			'm3u8PreviewHint': '스트림 (m3u8): 다운로드 기능을 사용하세요',
			'logLevelTitle': '로그 레벨（디버그용）',
			'logDebug': 'DEBUG（상세）',
			'logInfo': 'INFO（기본）',
			'logWarn': 'WARN（경고）',
			'logError': 'ERROR（오류만）',
			'otherOps': '기타 작업',
			'exportAllConfig': '전체 설정 내보내기',
			'importConfig': '설정 가져오기',
			'resetAll': '↻ 모든 설정 재설정',
			'batchTitle': '일괄 다운로드 설정',
			'concurrency': '동시 실행:',
			'intervalMs': '간격(ms):',
			'retries': '재시도:',
			'm3u8Settings': 'm3u8 스트림 설정',
			'qualityLabel': '품질:',
			'segmentsLabel': '세그먼트:',
			'qualityAuto': '자동',
			'qualityHigh': '최고 화질',
			'qualityMedium': '중간 화질',
			'qualityLow': '최저 화질',
			'requestHeaders': '요청 헤더',
			'referer': 'Referer:',
			'userAgent': 'User-Agent:',
			'cookie': 'Cookie:',
			'infoLine1': '미디어 스니퍼 Pro v1.18 · 모듈 구조 · AES-128 복호화 · 가상 리스트 · 진행률 · 플러그인 시스템',
			'infoLine2': '단축키: Alt+T 번역 · Alt+B 패널 토글 · Esc 닫기',
			'clickTabScan': '위 탭을 클릭하여 스캔 시작',
			'dlProgress': '다운로드 진행률',
			'dlProgressText': '{done} / {total}（실패 {fail}）· {speed} · 남은 시간 {eta}',
			'sendAria2': 'Aria2로 전송',
			'downloadHistory': '다운로드 기록',
			'clearHistory': '기록 지우기',
			'grpResourceHistory': '리소스 기록',
			'enableHistory': '리소스 기록 저장',
			'noResourceHistory': '리소스 기록 없음',
			'clearResourceHistory': '리소스 기록 지우기',
			'confirmClearResourceHistory': '리소스 기록을 지우시겠습니까?',
			'historyToday': '오늘',
			'historyYesterday': '어제',
			'historyWeek': '최근 7일',
			'historyOlder': '이전',
			'batchSuccessN': '{n}개 파일 다운로드 성공',
			'aria2Settings': 'Aria2 푸시 설정',
			'aria2RpcUrl': 'Aria2 RPC URL',
			'aria2RpcSecret': 'Aria2 RPC 비밀',
			'aria2Pushed': '{n}개 링크를 Aria2로 푸시했습니다',
			'aria2PushFail': 'Aria2 푸시 실패',
			'aria2NoUrl': 'Aria2 RPC URL 미설정',
			'grpPlugins': '스크립트 마켓 / 플러그인',
			'pluginRules': '사용자 규칙',
			'pluginRulesDesc': 'host / URL / 정규식으로 리소스 허용 또는 차단',
			'pluginRuleName': '규칙 이름',
			'pluginRulePattern': '패턴',
			'pluginRuleType': '일치 방식',
			'pluginRuleHost': '호스트',
			'pluginRuleUrl': 'URL 포함',
			'pluginRuleRegex': '정규식',
			'pluginRuleAction': '동작',
			'pluginRuleAllow': '허용',
			'pluginRuleBlock': '차단',
			'pluginParsers': '파서 플러그인',
			'pluginParsersDesc': '서드파티 비디오 파싱 API, 일치 URL 우선 호출',
			'parserName': '플러그인 이름',
			'parserMatch': 'URL 일치 정규식',
			'parserApi': 'API 주소 ({url} 자리표시자 사용 가능)',
			'parserMethod': '요청 방식',
			'parserDataPath': '데이터 필드 경로 (선택)',
			'parserHeaders': '헤더 JSON (선택)',
			'addRule': '규칙 추가',
			'addParser': '파서 추가',
			'parserSteps': '다단계 파이프라인 (steps, JSON, 고급)',
			'parserStepsHint': '여러 API를 순서대로 호출하고 {{변수}} 로 이전 결과를 전달합니다. 비우면 단일 단계입니다.',
			'parserTemplate': '템플릿에서 생성',
			'parserTemplatePick': '템플릿 선택…',
			'parserRunsTips': '적용 사이트 (정규식)',
			'grpAudioId': '음악 인식(노래 찾기)',
			'audioIdDesc': '몇 초 녹음해 곡명과 아티스트를 찾고 공유용 텍스트를 복사합니다. 키는 기기에만 저장됩니다.',
			'audioIdProvider': '인식 채널',
			'audioIdNeedKey': '설정에서 인식 채널 키 / 주소를 먼저 입력하세요',
			'audioIdBusy': '인식 중입니다. 잠시만 기다려 주세요…',
			'transcribeBusy': '받아쓰기 중입니다. 잠시만 기다려 주세요…',
			'webdavBackupFail': '백업 실패: {e}',
			'audioIdProviderAudD': 'AudD(권장, 토큰 하나)',
			'audioIdProviderAcr': 'ACRCloud(유료/자체)',
			'audioIdProviderCustom': '사용자 API',
			'audioIdToken': 'AudD API Token',
			'audioIdAcrHost': 'ACRCloud Host',
			'audioIdAcrKey': 'ACRCloud Access Key',
			'audioIdAcrSecret': 'ACRCloud Access Secret',
			'audioIdCustomUrl': '사용자 API(오디오 POST, JSON 반환)',
			'audioIdSeconds': '녹음 길이(초)',
			'audioIdSource': '오디오 소스',
			'audioIdSourcePage': '페이지 재생음(권한 불필요)',
			'audioIdSourceMic': '마이크(스피커에 대고 녹음)',
			'audioIdRun': '인식 시작',
			'audioIdStageCapture': '녹음 중… {s}초 남음',
			'audioIdStageIdentify': '인식 중…',
			'audioIdNoMatch': '곡을 찾지 못했습니다(다른 구간이나 더 길게 시도)',
			'audioIdResult': '인식 결과',
			'audioIdCopyInfo': '곡 정보 복사',
			'audioIdCopiedInfo': '곡 정보를 복사했습니다',
			'audioIdHistory': '인식 기록',
			'audioIdClearHistory': '기록 지우기',
			'audioIdNoHistory': '기록이 없습니다',
			'grpTranscribe': '받아쓰기 + AI 요약',
			'transcribeDesc': '영상의 오디오 트랙을 텍스트로 바꾸고 AI가 요약합니다. 다중 트랙 사이트는 오디오 트랙을 바로 써서 다운로드가 필요 없습니다. 키는 기기에만 저장됩니다.',
			'asrBaseUrl': 'ASR 주소(Whisper 호환)',
			'asrKey': 'ASR 키',
			'asrModel': 'ASR 모델',
			'asrLang': '언어(auto=자동)',
			'asrMaxMB': '요청당 업로드 한도(MB)',
			'asrChunkSeconds': '초과 시 분할 초',
			'aiBaseUrl': 'AI 주소(OpenAI 호환)',
			'aiKey': 'AI 키',
			'aiModel': 'AI 모델',
			'aiPromptStyle': '요약 스타일',
			'styleSummary': '구조화 요약',
			'stylePoints': '핵심 목록',
			'styleTimeline': '타임라인 개요',
			'styleQa': '질의응답',
			'transcribeRun': '받아쓰기',
			'transcribeStageFetch': '오디오 내려받는 중…',
			'transcribeStageDecode': '디코딩/리샘플 중…',
			'transcribeStageAsr': '변환 중 {i}/{n}',
			'transcribeStageUpload': '업로드 중…',
			'transcribeStageSummary': 'AI 요약 중…',
			'transcribeResult': '받아쓰기 결과',
			'transcribeCopyText': '전체 복사',
			'transcribeCopyMd': 'Markdown 복사',
			'transcribeSaveMd': '.md 로 저장',
			'transcribeSummaryFailed': '(요약 실패: {e})',
			'transcribeNoKey': '설정에서 ASR 키를 먼저 입력하세요',
			'transcribeHistory': '받아쓰기 기록',
			'transcribeClearHistory': '기록 지우기',
			'transcribeNoHistory': '기록이 없습니다',
			'transcribeHistoryTruncated': '기록은 앞 {n}자만 보관됩니다',
			'grpWebdav': 'WebDAV 백엔드(NAS)',
			'webdavDesc': '설정과 기록을 WebDAV에 동기화하고 다운로드를 NAS에 바로 저장할 수 있습니다. 비밀번호는 기기에만 있고 백업에 포함되지 않습니다.',
			'webdavEnabled': 'WebDAV 사용',
			'webdavUrl': 'WebDAV 주소(https://nas.example.com/dav/)',
			'webdavDir': '하위 폴더',
			'webdavUser': '사용자 이름',
			'webdavPass': '비밀번호',
			'webdavTest': '연결 테스트',
			'webdavTesting': '테스트 중…',
			'webdavTestOk': '연결 성공 · 폴더에 {n}개',
			'webdavBackup': '클라우드로 백업',
			'webdavRestore': '클라우드에서 복원',
			'webdavBackupOk': '백업 완료({kb} KB)',
			'webdavRestoreOk': '{n}개 설정 복원',
			'webdavLastSync': '마지막 동기화: {t}',
			'webdavNever': '없음',
			'webdavUploadDownloads': '다운로드를 NAS에 바로 저장',
			'webdavUploaded': 'NAS에 업로드됨: {name}',
			'webdavUploadFailed': 'NAS 업로드 실패(로컬 저장으로 전환): {e}',
			'webdavNeedConfig': 'WebDAV 주소를 먼저 입력하세요',
			'edit': '편집',
			'noRules': '사용자 규칙 없음',
			'noParsers': '파서 플러그인 없음',
			'pluginSaved': '플러그인 설정 저장됨',
			'pluginDeleted': '삭제됨',
			'confirmDeleteRule': '이 규칙을 삭제할까요?',
			'confirmDeleteParser': '이 파서 플러그인을 삭제할까요?',
			'paletteCustom': '사용자 정의',
			'paletteAddCustom': '사용자 정의 색상 추가',
			'paletteName': '색상 이름',
			'paletteLightPrimary': '밝은 주색',
			'paletteLightSecondary': '밝은 보조색',
			'paletteDarkPrimary': '어두운 주색',
			'paletteDarkSecondary': '어두운 보조색',
			'paletteEdit': '색상 편집',
			'confirmDeletePalette': '이 색상을 삭제할까요?',
			'ctxOpenPanel': '패널 열기',
			'ctxQuickDownload': '빠른 다운로드',
			'ctxTranslate': '번역',
			'ctxSettings': '설정',
			'ctxClose': '닫기',
			'tabPlugins': '플러그인',
			'pluginMarket': '마켓',
			'pluginInstalled': '설치됨',
			'pluginInstall': '설치',
			'pluginUninstall': '제거',
			'pluginEnable': '활성화',
			'pluginDisable': '비활성화',
			'pluginInstalledN': '설치된 플러그인 {n}개',
			'pluginMarketN': '마켓 플러그인 {n}개',
			'noInstalledPlugins': '설치된 플러그인이 없습니다. 마켓을 둘러보세요',
			'pluginInstalledToast': '플러그인 「{name}」 설치 완료',
			'pluginUninstalledToast': '플러그인 「{name}」 제거됨',
			'pluginEnabledToast': '플러그인 「{name}」 활성화됨',
			'pluginDisabledToast': '플러그인 「{name}」 비활성화됨',
			'pluginVersion': '버전',
			'pluginAuthor': '제작자',
			'pluginCategory': '카테고리',
			'pluginDesc': '설명',
			'pluginCatEnhance': '기능 향상',
			'pluginCatDownload': '다운로드',
			'pluginCatParse': '파서',
			'pluginCatUi': 'UI 테마',
			'pluginCatTool': '도구',
			'confirmUninstallPlugin': '플러그인 「{name}」을 제거하시겠습니까? 모든 설정이 삭제됩니다.',
			'pluginAutoTrans': '자동 번역',
			'pluginAutoTransDesc': '리소스 파일명 일괄 번역, 다중 엔진 지원',
			'pluginBatchRename': '일괄 이름 변경',
			'pluginBatchRenameDesc': '규칙에 따라 파일명 일괄 변경: 번호, 날짜, 도메인, 템플릿',
			'pluginNoWatermark': '영상 워터마크 제거',
			'pluginNoWatermarkDesc': '틱톡, 콰이셔우, 샤오홍슈 등의 워터마크 없는 직접 링크 추출',
			'pluginAutoCover': '자동 커버 추출',
			'pluginAutoCoverDesc': '영상 메타데이터 분석 후 고품질 커버 추출, 크기 커스텀 가능',
			'pluginQualityBoost': '화질 부스트',
			'pluginQualityBoostDesc': '더 높은 비트레이트/고해상도 미디어 우선 검색',
			'pluginShortcutsPlus': '단축키 강화',
			'pluginShortcutsPlusDesc': '전체 선택, 반전, 일괄 다운, 빠른 필터 등의 단축키 추가',
			'pluginDarkPro': '다크 테마 Pro',
			'pluginDarkProDesc': '프로스티드 글라스 & 그라데이션 효과의 고품질 다크 테마',
			'pluginExportList': '리소스 내보내기',
			'pluginExportListDesc': '리소스 목록을 HTML/Markdown/CSV/JSON으로 내보내기, 공유와 저장에 편리',
			'pluginSubTabMarket': '마켓',
			'pluginSubTabInstalled': '설치됨',
			}
	};
				LANG._varReCache = {};
	LANG._varReCount = 0;
	LANG._varRe = function (k) {
		var re = LANG._varReCache[k];
		if (re) return re;
		re = new RegExp('\\{' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\}', 'g');
								if (LANG._varReCount >= 200) {
			LANG._varReCache = {};
			LANG._varReCount = 0;
		}
		LANG._varReCache[k] = re;
		LANG._varReCount++;
		return re;
	};
	LANG.get = function (key, vars) {
		var lang = (State.config && State.config.uiLang) ? State.config.uiLang : 'zh-CN';
		var t = LANG.strings[lang] || LANG.strings['zh-CN'];
		var val = t[key] !== undefined ? t[key] : key;
		if (vars) {
			for (var k in vars) {
				if (Object.prototype.hasOwnProperty.call(vars, k)) {
					val = String(val).replace(LANG._varRe(k), String(vars[k]));
				}
			}
		}
		return val;
	};
	LANG.t = LANG.get;

				LANG.assertPlainText = function () {
								if (LANG._asserted) return LANG._assertedResult || [];
		LANG._asserted = true;
		var bad = [];
		try {
			for (var lang in LANG.strings) {
				if (!Object.prototype.hasOwnProperty.call(LANG.strings, lang)) continue;
				var table = LANG.strings[lang];
				for (var k in table) {
					if (!Object.prototype.hasOwnProperty.call(table, k)) continue;
					var v = table[k];
															if (typeof v === 'string' && /<[a-zA-Z\/!]/.test(v)) bad.push(lang + '.' + k);
				}
			}
		} catch (e) { return []; }
		if (bad.length) {
			try { LOG.warn('[LANG] 以下文案里含标记，违反「LANG 只存纯文本」约定（图标请走 UI.iconTextEl / _tabIconMap）:', bad.join(', ')); } catch (e2) {}
		}
		LANG._assertedResult = bad;
		return bad;
	};

		return LANG;
	})();
	var M3U8;   // 由 SEC IIFE 内部赋值；必须在最外层声明，否则 9132/15371 等外部调用点会 ReferenceError
	var SEC = (function () {
		'use strict';
		var SEC = {};
	SEC.ALLOWED_PROTOCOLS = { 'http:': 1, 'https:': 1 };
	SEC.ALLOWED_MIME_PREFIX = { 'image/': 1, 'video/': 1, 'audio/': 1 };

							var ESC_ATTR_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
	var ESC_HTML_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
	var ESC_ATTR_RE = /[&<>"']/g; 
	var ESC_HTML_RE = /[&<>]/g;

	SEC.escapeAttr = function (s) {
		if (s == null) return '';
		s = String(s);
		if (!ESC_ATTR_RE.test(s)) return s; 
		ESC_ATTR_RE.lastIndex = 0;
		return s.replace(ESC_ATTR_RE, function (ch) { return ESC_ATTR_MAP[ch]; });
	};

		SEC.escapeHtml = function (s) {
		if (s == null) return '';
		s = String(s);
		if (!ESC_HTML_RE.test(s)) return s;
		ESC_HTML_RE.lastIndex = 0;
		return s.replace(ESC_HTML_RE, function (ch) { return ESC_HTML_MAP[ch]; });
	};
		SEC.MIME_PREFIX_LIST = (function () {
		var out = [];
		for (var k in SEC.ALLOWED_MIME_PREFIX) if (SEC.ALLOWED_MIME_PREFIX.hasOwnProperty(k)) out.push(k);
		return out;
	})();
					SEC._httpRe = /^https?:\/\/(?:[A-Za-z0-9\u0080-\uFFFF]|\[[0-9A-Fa-f:.]+\])/i;
	SEC._ctrlRe = /^\s*(javascript|vbscript)\s*:/i;
	SEC._otherProtoRe = /^(blob|file):/i;
	SEC._relRe = /^[\/\.]/;
	SEC.isSafeUrl = function (url) {
		if (!url || !U.isStr(url)) return false;
		var i = 0, len = url.length;
		while (i < len && url.charCodeAt(i) <= 32) i++; 
		if (i >= len) return false;
		var c = url.charCodeAt(i) | 32; 
		if (c === 104) { 
			if (SEC._httpRe.test(url.slice(i, i + 9))) {
								var rest = url.slice(i + 8);
				var cut = rest.search(/[\/?#]/);
				if (cut === -1) cut = rest.length;
				if (!/\s/.test(rest.slice(0, cut))) return true;
			}
		} else if (c === 47) { 
			return true;
		} else if (c === 106 || c === 118) { 
			if (SEC._ctrlRe.test(url)) return false;
		} else if (c === 100) { 
			var low = url.toLowerCase();
			if (low.indexOf('data:') === 0) {
				var mime = low.substring(5).split(';')[0];
				var mps = SEC.MIME_PREFIX_LIST;
				for (var mi = 0; mi < mps.length; mi++) if (mime.indexOf(mps[mi]) === 0) return true;
				return false;
			}
		} else if (c === 98 || c === 102) { 
			if (SEC._otherProtoRe.test(url.trim())) return true;
		}
		try {
			var parsed = new URL(url.trim(), location.href);
			return !!SEC.ALLOWED_PROTOCOLS[parsed.protocol];
		} catch (e) {
			return SEC._relRe.test(url.trim());
		}
	};

						SEC._absRe = /^https?:\/\/[a-z0-9](?:[a-z0-9\-.]*[a-z0-9])?(?::\d+)?\/[A-Za-z0-9\-._~!$&'()*+,;=:@%\/?#]*$/;
	SEC._absResolve = U.memo1(function (src) {
		try { return new URL(src, location.href).href; } catch (e) { return String(src).trim(); }
	}, 1500);
	SEC.absUrl = function (src, baseUrl) {
		if (!src) return '';
				if (!baseUrl && src.indexOf('/.') === -1 && SEC._absRe.test(src)) return src;
		if (baseUrl) { 
			try { return new URL(src, baseUrl).href; } catch (e) { return String(src).trim(); }
		}
		return SEC._absResolve(src);
	};
	SEC.safeFilename = function (name) {
		if (name == null) return 'file-' + U.now();
		var s = String(name);
		try {
			if (/%[0-9a-fA-F]{2}/.test(s)) {
				var decoded = decodeURIComponent(s);
				if (decoded && decoded.indexOf('\u0000') === -1) s = decoded;
			}
		} catch (e) {}
		s = s.replace(/[\x00-\x1F\x7F]/g, '');
		s = s.replace(/[\\\/:\*\?"<>\|]/g, '_');
						s = s.replace(/^\s+/, '');
		s = s.replace(/^\.+/, function (dots) { return dots.length > 1 ? '_' : dots; }); 
		s = s.replace(/[\s\.]+$/, '');
		if (s.length > 180) {
												s = s.substring(0, 165) + '_'
				+ U.now().toString(36).slice(-3)
				+ Math.random().toString(36).slice(2, 5);
		}
		if (/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i.test(s)) s = '_' + s;
		if (!s.trim()) s = 'file-' + U.now();
		return s;
	};

	SEC.extFromUrl = U.memo1(function (url) {
		try {
			var p = new URL(url, location.href).pathname;
			var m = p.match(/\.([a-zA-Z0-9]{1,8})$/);
			return m ? m[1].toLowerCase() : '';
		} catch (e) { return ''; }
	}, 1500);

				SEC._schemeNoSlashRe = /^[a-z][a-z0-9+.\-]*:(?!\/\/)/i;
	SEC.nameFromUrl = U.memo1(function (url) {
		var s = url == null ? '' : String(url).trim();
		if (!s || SEC._schemeNoSlashRe.test(s)) {
			try {
				var pa = new URL(s, location.href).pathname.split('/');
				return pa[pa.length - 1] || 'file';
			} catch (e) { return 'file'; }
		}
		var q = s.indexOf('?'); if (q !== -1) s = s.substring(0, q);
		var h = s.indexOf('#'); if (h !== -1) s = s.substring(0, h);
		var sc = s.indexOf('://');
		if (sc !== -1) {
			var aStart = sc + 3;
			var slash = s.indexOf('/', aStart);
						if ((slash === -1 ? s.substring(aStart) : s.substring(aStart, slash)).indexOf(' ') !== -1) return 'file';
			s = slash === -1 ? '/' : s.substring(slash);
		}
		var cut = s.lastIndexOf('/');
		var name = cut === -1 ? s : s.substring(cut + 1);
		return name || 'file';
	}, 1500);

			SEC._KIND_EXT = {
		png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', bmp: 'image',
		svg: 'image', avif: 'image', ico: 'image', tif: 'image', tiff: 'image',
						mp4: 'video', webm: 'video', ogg: 'audio', ogv: 'video', mov: 'video', mkv: 'video',
		avi: 'video', flv: 'video', ts: 'video', m4v: 'video', '3gp': 'video', mpeg: 'video',
		mpg: 'video', rm: 'video', rmvb: 'video', wmv: 'video',
		mp3: 'audio', wav: 'audio', flac: 'audio', aac: 'audio', oga: 'audio', opus: 'audio',
		m4a: 'audio', wma: 'audio', amr: 'audio', ape: 'audio', mid: 'audio',
		m3u8: 'm3u8', m3u: 'm3u8'
	};
	SEC.guessKind = U.memo1(function (url) {
		if (!url || !U.isStr(url)) return '';
		var end = url.length;
		var q = url.indexOf('?'); if (q !== -1 && q < end) end = q;
		var h = url.indexOf('#'); if (h !== -1 && h < end) end = h;
		var dot = url.lastIndexOf('.', end - 1);
		if (dot === -1 || dot < end - 12) return '';
		return SEC._KIND_EXT[url.slice(dot + 1, end).toLowerCase()] || '';
	}, 2000);

	SEC.VIDEO_SITES = {
		'bilibili': {
			name: '哔哩哔哩',
			icon: MS_CONFIG.ICONS.stream,
			match: function(url, parsed) {
				try {
										var u = parsed || new URL(url);
					var host = u.hostname;
					return /bilibili\.com$/i.test(host) || /b23\.tv$/i.test(host);
				} catch(e) { return false; }
			},
			isVideo: function(url, parsed) {
				try {
										var u = parsed || new URL(url);
					var path = u.pathname;
					return /^\/video\/BV/i.test(path) || /^\/video\/av/i.test(path) || /^\/bangumi\/play\//i.test(path);
				} catch(e) { return false; }
			}
		},
		'douyin': {
			name: '抖音',
			icon: MS_CONFIG.ICONS.audio,
			match: function(url, parsed) {
				try {
										var u = parsed || new URL(url);
					return /douyin\.com$/i.test(u.hostname) || /iesdouyin\.com$/i.test(u.hostname);
				} catch(e) { return false; }
			},
			isVideo: function(url, parsed) {
				try {
										var u = parsed || new URL(url);
					return /\/video\//i.test(u.pathname) || /\/note\//i.test(u.pathname);
				} catch(e) { return false; }
			}
		},
		'kuaishou': {
			name: '快手',
			icon: MS_CONFIG.ICONS.lightning,
			match: function(url, parsed) {
				try {
										var u = parsed || new URL(url);
					return /kuaishou\.com$/i.test(u.hostname) || /gifshow\.com$/i.test(u.hostname);
				} catch(e) { return false; }
			},
			isVideo: function(url, parsed) {
				try {
										var u = parsed || new URL(url);
					return /\/short-video\//i.test(u.pathname) || /\/video\//i.test(u.pathname);
				} catch(e) { return false; }
			}
		},
		'xiaohongshu': {
			name: '小红书',
			icon: MS_CONFIG.ICONS.book,
			match: function(url, parsed) {
				try {
										var u = parsed || new URL(url);
					return /xiaohongshu\.com$/i.test(u.hostname) || /xhslink\.com$/i.test(u.hostname);
				} catch(e) { return false; }
			},
			isVideo: function(url, parsed) {
				try {
										var u = parsed || new URL(url);
					var path = u.pathname;
					return /^\/explore\//i.test(path) || /^\/discovery\/item\//i.test(path) || /\/short-video\//i.test(path) || /\/video\//i.test(path);
				} catch(e) { return false; }
			}
		},
		'weibo': {
			name: '微博',
			icon: MS_CONFIG.ICONS.globe,
			match: function(url, parsed) {
				try {
										var u = parsed || new URL(url);
					return /weibo\.com$/i.test(u.hostname) || /weibo\.cn$/i.test(u.hostname);
				} catch(e) { return false; }
			},
			isVideo: function(url, parsed) {
				try {
										var u = parsed || new URL(url);
					return /\/tv\/show\//i.test(u.pathname) || /\/video\//i.test(u.pathname);
				} catch(e) { return false; }
			}
		},
		'zhihu': {
			name: '知乎',
			icon: MS_CONFIG.ICONS.bulb,
			match: function(url, parsed) {
				try {
										var u = parsed || new URL(url);
					return /zhihu\.com$/i.test(u.hostname);
				} catch(e) { return false; }
			},
			isVideo: function(url, parsed) {
				try {
										var u = parsed || new URL(url);
					var path = u.pathname;
					return /\/video\//i.test(path) || /\/question\/\d+\/answer\/\d+/i.test(path);
				} catch(e) { return false; }
			}
		},
		'weixin': {
			name: '微信视频号',
			icon: MS_CONFIG.ICONS.speech,
			match: function(url, parsed) {
				try {
										var u = parsed || new URL(url);
					return /channels\.weixin\.qq\.com$/i.test(u.hostname);
				} catch(e) { return false; }
			},
			isVideo: function(url, parsed) {
				try {
										var u = parsed || new URL(url);
					return /\/video\//i.test(u.pathname) || /\/feed\//i.test(u.pathname);
				} catch(e) { return false; }
			}
		}
	};

	SEC.detectVideoSite = function(url) {
		if (!url || !U.isStr(url)) return null;
												var parsed = null;
		try {
			var u = new URL(url);
			parsed = { hostname: u.hostname, pathname: u.pathname, href: u.href };
		} catch (e) { return null; } 
		for (var key in SEC.VIDEO_SITES) {
			if (SEC.VIDEO_SITES.hasOwnProperty(key)) {
				var site = SEC.VIDEO_SITES[key];
				if (site.match(url, parsed) && site.isVideo(url, parsed)) {
					return { key: key, name: site.name, icon: site.icon };
				}
			}
		}
		return null;
	};
		var AES = {};

		AES.hexToBytes = function (hex) {
		if (!hex || hex.length % 2 !== 0) return null;
		var out = new Uint8Array(hex.length / 2);
		for (var i = 0; i < hex.length; i += 2) {
			out[i / 2] = parseInt(hex.substr(i, 2), 16);
		}
		return out;
	};

		AES._SBOX = null;
	AES._RSBOX = null;
	AES._rotl8 = function (x, n) { return ((x << n) | (x >> (8 - n))) & 0xFF; };
	AES._buildTables = function () {
		if (AES._SBOX) return;
		var sbox = new Uint8Array(256), rsbox = new Uint8Array(256);
		var p = 1, q = 1;
		do {
			p = (p ^ (p << 1) ^ ((p & 0x80) ? 0x1B : 0)) & 0xFF;
			q ^= q << 1; q ^= q << 2; q ^= q << 4; q &= 0xFF;
			if (q & 0x80) q ^= 0x09;
			sbox[p] = ((q ^ AES._rotl8(q, 1) ^ AES._rotl8(q, 2) ^ AES._rotl8(q, 3) ^ AES._rotl8(q, 4)) ^ 0x63) & 0xFF;
		} while (p !== 1);
		sbox[0] = 0x63;
		for (var i = 0; i < 256; i++) rsbox[sbox[i]] = i;
		AES._SBOX = sbox; AES._RSBOX = rsbox;
	};
	AES._gfMul = function (a, b) {
		var r = 0;
		for (var i = 0; i < 8; i++) {
			if (b & 1) r ^= a;
			var hi = a & 0x80;
			a = (a << 1) & 0xFF;
			if (hi) a ^= 0x1B;
			b >>= 1;
		}
		return r;
	};
	AES._pureDecrypt = function (data, key, iv) {
		AES._buildTables();
		var sbox = AES._SBOX, rsbox = AES._RSBOX;
		var rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1B, 0x36];
		var w = new Uint8Array(176);
		for (var i0 = 0; i0 < 16; i0++) w[i0] = key[i0];
		for (var i1 = 16; i1 < 176; i1 += 4) {
			var t0 = w[i1 - 4], t1 = w[i1 - 3], t2 = w[i1 - 2], t3 = w[i1 - 1];
			if (i1 % 16 === 0) {
				var tmp = t0;
				t0 = sbox[t1] ^ rcon[(i1 / 16) - 1]; t1 = sbox[t2]; t2 = sbox[t3]; t3 = sbox[tmp];
			}
			w[i1] = w[i1 - 16] ^ t0; w[i1 + 1] = w[i1 - 15] ^ t1; w[i1 + 2] = w[i1 - 14] ^ t2; w[i1 + 3] = w[i1 - 13] ^ t3;
		}
		var n = data.length, out = new Uint8Array(n);
		var prev = new Uint8Array(16), blk = new Uint8Array(16), s = new Uint8Array(16), t = new Uint8Array(16);
		for (var j0 = 0; j0 < 16; j0++) prev[j0] = (iv && iv.length === 16) ? iv[j0] : 0;
		for (var off = 0; off < n; off += 16) {
			for (var b0 = 0; b0 < 16; b0++) blk[b0] = data[off + b0];
			for (var b1 = 0; b1 < 16; b1++) s[b1] = blk[b1] ^ w[160 + b1];
			for (var round = 9; round >= 1; round--) {
				t[0] = s[0]; t[1] = s[13]; t[2] = s[10]; t[3] = s[7];
				t[4] = s[4]; t[5] = s[1]; t[6] = s[14]; t[7] = s[11];
				t[8] = s[8]; t[9] = s[5]; t[10] = s[2]; t[11] = s[15];
				t[12] = s[12]; t[13] = s[9]; t[14] = s[6]; t[15] = s[3];
				for (var b2 = 0; b2 < 16; b2++) s[b2] = rsbox[t[b2]] ^ w[round * 16 + b2];
				for (var c = 0; c < 4; c++) {
					var x0 = s[c * 4], x1 = s[c * 4 + 1], x2 = s[c * 4 + 2], x3 = s[c * 4 + 3];
					s[c * 4] = AES._gfMul(x0, 14) ^ AES._gfMul(x1, 11) ^ AES._gfMul(x2, 13) ^ AES._gfMul(x3, 9);
					s[c * 4 + 1] = AES._gfMul(x0, 9) ^ AES._gfMul(x1, 14) ^ AES._gfMul(x2, 11) ^ AES._gfMul(x3, 13);
					s[c * 4 + 2] = AES._gfMul(x0, 13) ^ AES._gfMul(x1, 9) ^ AES._gfMul(x2, 14) ^ AES._gfMul(x3, 11);
					s[c * 4 + 3] = AES._gfMul(x0, 11) ^ AES._gfMul(x1, 13) ^ AES._gfMul(x2, 9) ^ AES._gfMul(x3, 14);
				}
			}
			t[0] = s[0]; t[1] = s[13]; t[2] = s[10]; t[3] = s[7];
			t[4] = s[4]; t[5] = s[1]; t[6] = s[14]; t[7] = s[11];
			t[8] = s[8]; t[9] = s[5]; t[10] = s[2]; t[11] = s[15];
			t[12] = s[12]; t[13] = s[9]; t[14] = s[6]; t[15] = s[3];
			for (var b3 = 0; b3 < 16; b3++) out[off + b3] = rsbox[t[b3]] ^ w[b3] ^ prev[b3];
			for (var b4 = 0; b4 < 16; b4++) prev[b4] = blk[b4];
		}
		return out;
	};

						AES.decryptCBC = function (data, keyBytes, ivBytes, cb) {
		if (!data || data.length === 0) { cb(null, '空数据'); return; }
		if (!keyBytes || keyBytes.length !== 16) { cb(null, '密钥长度错误: ' + (keyBytes ? keyBytes.length : 'null')); return; }

				var padLen = (16 - (data.length % 16)) % 16;
		var alignedData;
		if (padLen > 0) {
			alignedData = new Uint8Array(data.length + padLen);
			alignedData.set(data, 0);
		} else alignedData = new Uint8Array(data);

		var useIv = ivBytes && ivBytes.length === 16 ? ivBytes : new Uint8Array(16);

				try {
			if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.decrypt === 'function') {
				crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CBC' }, false, ['decrypt']).then(function (key) {
					return crypto.subtle.decrypt({ name: 'AES-CBC', iv: useIv }, key, alignedData.buffer);
				}).then(function (decrypted) {
					var out = new Uint8Array(decrypted);
										if (out.length > 0) {
						var pad = out[out.length - 1];
						if (pad > 0 && pad <= 16 && out.length >= pad) {
							var valid = true;
							for (var i = out.length - pad; i < out.length; i++) {
								if (out[i] !== pad) { valid = false; break; }
							}
							if (valid) out = out.slice(0, out.length - pad);
						}
					}
					cb(out, null);
				}).catch(function (err) {
										LOG.warn('Web Crypto AES 解密失败:', err && err.message);
					cb(null, 'AES 解密失败: ' + (err && err.message ? err.message : err));
				});
				return;
			}
		} catch (e) {
			LOG.warn('Web Crypto 不可用，将尝试纯 JS 降级方案:', e.message);
		}

				try {
			var pure = AES._pureDecrypt(alignedData, keyBytes, useIv);
			if (!pure) { cb(null, 'AES 解密失败（纯 JS 兜底）'); return; }
			var pout = pure;
			if (pout.length > 0) {
				var ppad = pout[pout.length - 1];
				if (ppad > 0 && ppad <= 16 && pout.length >= ppad) {
					var pvalid = true;
					for (var pi = pout.length - ppad; pi < pout.length; pi++) {
						if (pout[pi] !== ppad) { pvalid = false; break; }
					}
					if (pvalid) pout = pout.slice(0, pout.length - ppad);
				}
			}
			cb(pout, null);
		} catch (e) {
			LOG.warn('纯 JS AES 解密异常:', e.message);
			cb(null, '解密异常: ' + e.message);
		}
	};

	M3U8 = {};

	M3U8.parse = function (content, baseUrl) {
		var result = {
			isMaster: false, 
			streams: [], 
			segments: [], 
			encrypted: false, 
			keyMethod: null, 
			keyUrl: null, 
			keyIv: null, 
			keyRotated: false, 
			keyUris: [], 
			keyUriCount: 0, 
			duration: 0, 
			targetDuration: 0, 
			mediaSequence: 0, 
		};
		if (!content) return result;
		var lines = content.split(/\r?\n/);
		var currentKey = null;
		var segDuration = 0;

		for (var i = 0; i < lines.length; i++) {
			var line = lines[i].trim();
			if (!line) continue;

						if (line.indexOf('#EXT-X-STREAM-INF:') === 0) {
				result.isMaster = true;
				var info = line.substring('#EXT-X-STREAM-INF:'.length);
				var bandwidth = 0, resolution = '';
				var bwMatch = info.match(/BANDWIDTH=(\d+)/);
				if (bwMatch) bandwidth = parseInt(bwMatch[1], 10);
				var resMatch = info.match(/RESOLUTION=(\d+x\d+)/);
				if (resMatch) resolution = resMatch[1];
																for (var si = i + 1; si < lines.length; si++) {
					var nextLine = lines[si].trim();
					if (!nextLine) continue; 
					if (nextLine.charAt(0) === '#') break; 
					result.streams.push({
						url: SEC.absUrl(nextLine, baseUrl),
						bandwidth: bandwidth,
						resolution: resolution,
						label: bandwidth > 5000000 ? '高清' : bandwidth > 2000000 ? '标清' : '低清'
					});
					i = si; 
					break;
				}
			}
												else if (line.indexOf('#EXT-X-MEDIA-SEQUENCE:') === 0) {
				var seqVal = parseInt(line.substring('#EXT-X-MEDIA-SEQUENCE:'.length), 10);
				if (!isNaN(seqVal) && seqVal >= 0) result.mediaSequence = seqVal;
			}
						else if (line.indexOf('#EXT-X-KEY:') === 0) {
				result.encrypted = true;
				var keyInfo = line.substring('#EXT-X-KEY:'.length);
																								var methodMatch = keyInfo.match(/METHOD=(\w+)/);
				if (methodMatch) result.keyMethod = methodMatch[1];
				var uriMatch = keyInfo.match(/URI="([^"]+)"/);
				if (uriMatch) {
																				if (!result.keyUris) result.keyUris = [];
										if (result.keyUris.indexOf(uriMatch[1]) < 0) result.keyUris.push(uriMatch[1]);
					result.keyUriCount = result.keyUris.length;
					if (result.keyUriCount > 1) result.keyRotated = true;
					result.keyUrl = uriMatch[1];
				}
				var ivMatch = keyInfo.match(/IV=0x([0-9a-fA-F]+)/);
				if (ivMatch) result.keyIv = AES.hexToBytes(ivMatch[1]);
				else result.keyIv = null; 
			}
						else if (line.indexOf('#EXT-X-TARGETDURATION:') === 0) {
				var tdMatch = line.match(/#EXT-X-TARGETDURATION:(\d+)/);
				if (tdMatch) result.targetDuration = parseInt(tdMatch[1], 10);
			}
						else if (line.indexOf('#EXTINF:') === 0) {
				var durMatch = line.match(/#EXTINF:([\d.]+)/);
				if (durMatch) segDuration = parseFloat(durMatch[1]);
			}
						else if (line.indexOf('#') !== 0) {
				if (!result.isMaster) {
					result.segments.push({
						url: SEC.absUrl(line, baseUrl),
						duration: segDuration
					});
					result.duration += segDuration;
					segDuration = 0;
				}
			}
						else if (line === '#EXT-X-ENDLIST') {
							}
		}
		LOG.info('M3U8 解析完成:', result.isMaster ? 'master' : 'media',
				 result.isMaster ? result.streams.length + ' streams' : result.segments.length + ' segments',
				 result.encrypted ? 'encrypted:' + result.keyMethod : 'unencrypted');
		return result;
	};
				M3U8._inflight = [];
	M3U8._trackInflight = function (handle, token) {
		if (!handle) return;
		M3U8._inflight.push({ handle: handle, token: token || null });
	};
	M3U8._untrackInflight = function (handle) {
		for (var i = M3U8._inflight.length - 1; i >= 0; i--) {
			if (M3U8._inflight[i].handle === handle) { M3U8._inflight.splice(i, 1); return; }
		}
	};
		M3U8._abortInflight = function (token) {
		var remaining = [];
		for (var i = 0; i < M3U8._inflight.length; i++) {
			var item = M3U8._inflight[i];
			if (!token || item.token === token) {
				try { item.handle.abort(); } catch (e) {}
			} else {
				remaining.push(item);
			}
		}
		M3U8._inflight = remaining;
	};

	M3U8._httpGet = function (url, opts, cb) {
		var o = opts || {};
		var wantBinary = o.binary === true;
		var timeoutMs = o.timeout || 25000;
		var tag = o.tag || '请求';
	  var runToken = o.token || null;
		var done = false;
		var gmTimer = null;
		var finished = function (err, data) {
			if (done) return;
			done = true;
			if (gmTimer) { clearTimeout(gmTimer); gmTimer = null; }
			cb(err, data);
		};
		var viaXHR = function () {
			var xhr = new XMLHttpRequest();
			try {
				xhr.open('GET', url, true);
				if (wantBinary) xhr.responseType = 'arraybuffer';
				xhr.timeout = timeoutMs;
				var releaseXhr = function () { M3U8._untrackInflight(xhr); };
				xhr.onload = function () {
					releaseXhr();
					if (xhr.status >= 200 && xhr.status < 300) {
						var resp = wantBinary ? xhr.response : xhr.responseText;
						if (resp) finished(null, wantBinary ? new Uint8Array(resp) : resp);
						else finished(tag + '响应为空');
					} else finished(tag + '失败: ' + xhr.status);
				};
				xhr.onerror = function () { releaseXhr(); finished(tag + '网络错误'); };
				xhr.ontimeout = function () { releaseXhr(); finished(tag + '超时'); };
				xhr.onabort = function () { releaseXhr(); finished(tag + '已停止'); };
				M3U8._trackInflight(xhr, runToken);
				xhr.send();
			} catch (e) { M3U8._untrackInflight(xhr); finished(tag + '异常: ' + e.message); }
		};

		if (typeof GM_xmlhttpRequest !== 'function') { viaXHR(); return; }
		gmTimer = setTimeout(function () { gmTimer = null; finished(tag + '超时'); }, timeoutMs + 5000);
		try {
			var gmHandle = null;
			var gmRelease = function () { if (gmHandle) M3U8._untrackInflight(gmHandle); };
			gmHandle = GM_xmlhttpRequest({
				method: 'GET',
				url: url,
				timeout: timeoutMs,
				responseType: wantBinary ? 'arraybuffer' : undefined,
				onload: function (resp) {
					gmRelease();
					if (resp.status >= 200 && resp.status < 300) {
						var resp2 = wantBinary ? resp.response : resp.responseText;
						if (resp2) finished(null, wantBinary ? new Uint8Array(resp2) : resp2);
						else finished(tag + '响应为空');
					} else finished(tag + '失败: ' + resp.status);
				},
				onerror: function () {
					gmRelease();
					if (done) return;
					LOG.warn('GM ' + tag + '失败，降级 XHR');
					viaXHR();
				},
				onabort: function () { gmRelease(); finished(tag + '已停止'); },
				ontimeout: function () { gmRelease(); finished(tag + '超时'); }
			});
			M3U8._trackInflight(gmHandle, runToken);
		} catch (ge) {
			LOG.warn('GM ' + tag + '异常，降级 XHR:', ge.message);
			viaXHR();
		}
	};
	M3U8.fetchKey = function (keyUrl, cb, token) {
		LOG.info('密钥请求 URL:', keyUrl);
		M3U8._httpGet(keyUrl, { binary: true, timeout: 15000, tag: '密钥请求', token: token || null }, function (err, bytes) {
			if (err) { cb(null, err); return; }
			if (bytes.length !== 16) { cb(null, '密钥长度错误: ' + bytes.length); return; }
			LOG.info('密钥获取成功');
			cb(bytes, null);
		});
	};
	M3U8.fetchSegment = function (segUrl, cb, token) {
		M3U8._httpGet(segUrl, { binary: true, timeout: 30000, tag: '分片请求', token: token || null }, cb);
	};
	M3U8.downloadAndMerge = function (m3u8Url, options, progressCb, doneCb) {
				var opts = options || {};
		var concurrency = opts.concurrency || 3;
		var qualityPref = opts.quality || 'auto';
						var runToken = opts.runToken || M3U8._newRunToken();

								var settled = false;
		var finish = function (data, err) {
			if (settled) return;
			settled = true;
			M3U8._releaseRunToken(runToken);
			doneCb(data, err);
		};

				try {
			var fetchM3u8 = function(url, onOk, onErr) {
				M3U8._httpGet(url, { timeout: 20000, tag: 'm3u8 请求', token: runToken }, function (err, text) {
					if (err) onErr(err); else onOk(text);
				});
			};

			fetchM3u8(m3u8Url, function(m3u8Text) {
				var parsed = M3U8.parse(m3u8Text, m3u8Url);
				if (parsed.isMaster && parsed.streams.length > 0) {
					var selectedStream = M3U8.selectStream(parsed.streams, qualityPref);
					LOG.info('选择码率:', selectedStream.label, selectedStream.resolution);
																				var subOpts = {};
					for (var sk in opts) if (Object.prototype.hasOwnProperty.call(opts, sk)) subOpts[sk] = opts[sk];
					subOpts.runToken = runToken;
					settled = true; 
					M3U8.downloadAndMerge(selectedStream.url, subOpts, progressCb, doneCb);
					return;
				}
				if (parsed.segments.length === 0) { finish(null, 'm3u8 无分片'); return; }
												if (parsed.keyRotated) {
					LOG.warn('m3u8 密钥轮换，拒绝浏览器内合并:', parsed.keyUris);
																				var uniqKeyCount = parsed.keyUris.length || 1;
					finish(null, '这条播放列表在中途更换了加密密钥（共 '
						+ uniqKeyCount + ' 个不同密钥），浏览器内合并会解错前面的分片。'
						+ '请改用「生成下载脚本」用 aria2 / ffmpeg 下载并合并。');
					return;
				}
				LOG.info('开始下载分片:', parsed.segments.length, '加密:', parsed.encrypted);

				var proceed = function(key) {
										M3U8._downloadSegments(parsed.segments, key, parsed.keyIv, concurrency,
						progressCb, finish, runToken, parsed.mediaSequence);
				};
				if (parsed.encrypted && parsed.keyUrl) {
					M3U8.fetchKey(parsed.keyUrl, function(key, err) {
						if (err) { finish(null, err); return; }
						proceed(key);
					}, runToken);
				} else {
					proceed(null);
				}
			}, function(err) { finish(null, err); });
		} catch (e) { finish(null, 'm3u8 异常: ' + e.message); }
	};
	M3U8.selectStream = function (streams, preference) {
		if (!streams || streams.length === 0) return null;
		streams.sort(function (a, b) { return b.bandwidth - a.bandwidth; });
		if (preference === 'high' || preference === '高清') return streams[0];
		if (preference === 'low' || preference === '低清') return streams[streams.length - 1];
		if (preference === 'medium' || preference === '标清') return streams[Math.floor(streams.length / 2)];
		return streams[Math.floor(streams.length / 2)];
	};
					M3U8._activeRuns = [];
	M3U8._newRunToken = function () {
		var token = { stopped: false };
		M3U8._activeRuns.push(token);
		return token;
	};
				M3U8._releaseRunToken = function (token) {
		if (!token) return;
		var i = M3U8._activeRuns.indexOf(token);
		if (i >= 0) M3U8._activeRuns.splice(i, 1);
	};

	M3U8._downloadSegments = function (segments, key, iv, concurrency, progressCb, doneCb, runToken, mediaSequence) {
		var total = segments.length;
		var downloaded = 0;
		var failed = 0;
		var chunks = new Array(total);
		var idx = 0;
		var running = 0;
										var MAX_TOTAL_BYTES = 320 * 1024 * 1024;
		var loadedBytes = 0;
		var abortedForMemory = false;
				var token = runToken || M3U8._newRunToken();
				M3U8._stopped = false;

		function tryFinish() {
									if (token.stopped) { M3U8._releaseRunToken(token); return; }
			if (idx < total) return;
			if (running > 0) return;
			if (abortedForMemory) {
								for (var ai = 0; ai < total; ai++) chunks[ai] = null;
				M3U8._releaseRunToken(token);
				doneCb(null, '文件过大（超过 ' + Math.round(MAX_TOTAL_BYTES / 1048576)
					+ 'MB），浏览器内下载可能耗尽内存。请改用「生成下载脚本」用 aria2 / curl 下载。');
				return;
			}
			if (failed > 0) { M3U8._releaseRunToken(token); doneCb(null, '下载失败 ' + failed + ' 个分片'); return; }
			var totalLen = 0;
			for (var i = 0; i < total; i++) if (chunks[i]) totalLen += chunks[i].length;
			var merged = new Uint8Array(totalLen);
			var offset = 0;
			for (var i = 0; i < total; i++) {
				if (chunks[i]) {
					merged.set(chunks[i], offset);
					offset += chunks[i].length;
				}
			}
			LOG.info('分片合并完成:', totalLen, '字节');
			M3U8._releaseRunToken(token);
			doneCb(merged, null);
		}

		function makeIv(segIndex) {
			if (iv && iv.length === 16) return iv;
																		var seqNum = (mediaSequence || 0) + segIndex;
			var out = new Uint8Array(16);
			var str = seqNum.toString(16).padStart(32, '0');
			for (var i = 0; i < 16; i++) out[i] = parseInt(str.substr(i * 2, 2), 16);
			return out;
		}

		function worker() {
			if (abortedForMemory) { tryFinish(); return; }
			if (token.stopped || idx >= total) { tryFinish(); return; }
			var curIdx = idx++;
			running++;
			M3U8.fetchSegment(segments[curIdx].url, function (data, err) {
				if (err) {
					failed++; running--;
					LOG.warn('分片下载失败:', curIdx, err);
					if (!token.stopped) worker(); else tryFinish();
					return;
				}
												loadedBytes += (data && data.length) ? data.length : 0;
				if (loadedBytes > MAX_TOTAL_BYTES) {
					if (!abortedForMemory) {
						abortedForMemory = true;
						LOG.warn('分片总量超过阈值，中止浏览器内下载:', Math.round(loadedBytes / 1048576), 'MB');
					}
					running--;
					tryFinish();
					return;
				}
				if (key) {
					var segIv = makeIv(curIdx);
					AES.decryptCBC(data, key, segIv, function (dec, derr) {
						if (derr) {
							failed++; running--;
							LOG.warn('分片解密失败:', curIdx, derr);
							if (!token.stopped) worker(); else tryFinish();
							return;
						}
						chunks[curIdx] = dec;
						downloaded++; running--;
						if (progressCb) progressCb(downloaded, total, failed);
						if (!token.stopped) worker(); else tryFinish();
					});
				} else {
					chunks[curIdx] = data;
					downloaded++; running--;
					if (progressCb) progressCb(downloaded, total, failed);
					if (!token.stopped) worker(); else tryFinish();
				}
			}, token);
		}

		for (var w = 0; w < concurrency; w++) worker();
	};
			M3U8.stopDownload = function (token) {
		if (token) { token.stopped = true; }
		else {
			for (var i = 0; i < M3U8._activeRuns.length; i++) M3U8._activeRuns[i].stopped = true;
		}
				M3U8._stopped = M3U8._activeRuns.some(function (t) { return t.stopped; });
				M3U8._abortInflight(token);
	};
	M3U8.generateDownloadScript = function (m3u8Url, format) {
				var script = '';
		var filename = SEC.safeFilename(SEC.nameFromUrl(m3u8Url)) + '.mp4';

		if (format === 'aria2') {
			script = '# aria2 下载脚本（支持多线程）\n';
			script += '# 使用方法: aria2c -i download.txt\n\n';
			script += m3u8Url + '\n';
			script += '  out=' + filename + '\n';
			script += '  split=16\n';
			script += '  header="User-Agent: Mozilla/5.0"\n';
		} else if (format === 'wget') {
			script = '# wget 下载脚本\n';
			script += '# 使用方法: wget -i download.txt\n\n';
			script += '--user-agent="Mozilla/5.0"\n';
			script += '--referer="' + SEC.absUrl(m3u8Url) + '"\n';
			script += '-O "' + filename + '"\n';
			script += m3u8Url + '\n';
		} else {
			script = '# curl 下载脚本\n';
			script += '# 使用方法: bash download.sh\n\n';
			script += 'curl -L -A "Mozilla/5.0" -e "' + SEC.absUrl(m3u8Url) + '" -o "' + filename + '" "' + m3u8Url + '"\n';
		}
		return script;
	};

		return SEC;
	})();
	var State = (function () {
		'use strict';
		var DEFAULT_CONFIG = {
		theme: 'auto',
		uiStyle: 'normal', 
		palette: 'indigo', 
		customPalettes: [], 
		uiLang: 'zh-CN', 
		nameTpl: '{域名}_{日期}_{序号}_{后缀}',
		whitelist: [],
		blacklist: [],
		whitelistMode: false,
		panelWidth: 460,
		panelHeight: 0, 
		panelX: null, 
		panelY: null, 
		panelSnapEdge: null, 
		lastTab: 'img', 
		panelMinimized: false, 
		btnPos: null,
		translateFrom: 'auto',
		translateTo: 'zh-CN',
		translateEngine: 'mymemory', 
		batchConcurrency: 3,
		batchRetry: 2,
		batchDelay: 400,
		askBeforeDownload: true, 
		showStatusBar: true,
		logLevel: 1, 
				minImageSize: 1024,
		minImageWidth: 50,
		minImageHeight: 50,
		minVideoDuration: 1,
		maxVideoDuration: 0,
		minAudioDuration: 1,
				showMinSizeKB: 0, 
		showMaxSizeKB: 0, 
		autoExtractThumb: true, 
		autoPlayPreview: false, 
		persistSelection: false, 
				customHeaders: {
			Referer: '',
			UserAgent: '',
			Cookie: ''
		},
				m3u8Quality: 'auto',
		m3u8Concurrency: 3,
		m3u8AutoMerge: true,
				enableSync: true,
				enableHistory: true,
				autoCheckUpdate: true,
				settingsExpanded: {}, 
				domainRules: [], 
				customRules: [], 
		parserPlugins: [], 
		plugins: [], 
				aria2RpcUrl: '',
		aria2RpcSecret: '',
				audioIdProvider: 'audd', 
		audioIdToken: '', 
		audioIdAcrHost: '', 
		audioIdAcrKey: '',
		audioIdAcrSecret: '',
		audioIdCustomUrl: '',
		audioIdSeconds: 8, 
		audioIdSource: 'page', 
		audioIdHistory: [], 
				asrProvider: 'openai', 
		asrBaseUrl: 'https://api.openai.com/v1',
		asrKey: '', 
		asrModel: 'whisper-1',
		asrLang: 'auto',
		asrMaxMB: 24, 
		asrChunkSeconds: 600, 
		aiBaseUrl: 'https://api.openai.com/v1',
		aiKey: '',
		aiModel: 'gpt-4o-mini',
		aiPromptStyle: 'summary', 
		transcribeHistory: [],
				webdavEnabled: false,
		webdavUrl: '',
		webdavDir: 'media-sniffer/',
		webdavUser: '',
		webdavPass: '',
		webdavLastSyncAt: 0,
		webdavUploadDownloads: false, 
				shortcutToggle: 'b',
		shortcutTranslate: 't',
		shortcutClose: 'Escape',
		shortcutToggleMod: 'alt',
		shortcutTranslateMod: 'alt',
		shortcutCloseMod: '',
	};

	var State = {
		config: U.deepClone(DEFAULT_CONFIG),
		tab: 'img',
		images: [], videos: [], audios: [], m3u8: [], videoLinks: [],
		selected: new Set(),
		selectionMode: false,
		searchKeyword: '',
		panel: null, panelOpen: false,
		floatBtn: null,
		translateCache: {}, 
		downloading: false,
		downloadProgress: null, 
		downloadHistory: [], 
				metaCache: {}, 
		streamMap: {}, 
				syncChannel: null,
	};

	State._translateCacheLru = U.lru(State.translateCache, 200);
			State._metaCacheLru = U.lru(State.metaCache, 500);
			State.metaPut = function (url, key, val) {
		if (!url) return;
		if (!State.metaCache[url]) State.metaCache[url] = {};
		State.metaCache[url][key] = val;
		State._metaCacheLru.set(url, State.metaCache[url]);
	};
	State.validateConfig = function (cfg) {
		var errors = [];
		if (!cfg) return ['配置为空'];
				if (typeof cfg.theme !== 'string' || !['auto','light','dark'].includes(cfg.theme)) errors.push('theme 必须是 auto/light/dark');
		if (typeof cfg.uiStyle !== 'string' || !MS_CONFIG.UI_STYLE_IDS.includes(cfg.uiStyle)) errors.push('uiStyle 必须是 ' + MS_CONFIG.UI_STYLE_IDS.join('/'));
		if (typeof cfg.nameTpl !== 'string' || cfg.nameTpl.length > 200) errors.push('nameTpl 必须是字符串且不超过200字符');
		if (!U.isArr(cfg.whitelist)) errors.push('whitelist 必须是数组');
		if (!U.isArr(cfg.blacklist)) errors.push('blacklist 必须是数组');
		if (typeof cfg.whitelistMode !== 'boolean') errors.push('whitelistMode 必须是布尔值');
		if (!U.isNum(cfg.panelWidth) || cfg.panelWidth < 300 || cfg.panelWidth > 1000) errors.push('panelWidth 必须在 300-1000');
		if (cfg.panelHeight !== undefined && (!U.isNum(cfg.panelHeight) || cfg.panelHeight < 0 || cfg.panelHeight > 2000)) errors.push('panelHeight 必须在 0-2000');
		if (cfg.panelX !== undefined && cfg.panelX !== null && !U.isNum(cfg.panelX)) errors.push('panelX 必须是数字或 null');
		if (cfg.panelY !== undefined && cfg.panelY !== null && !U.isNum(cfg.panelY)) errors.push('panelY 必须是数字或 null');
		if (cfg.lastTab !== undefined && typeof cfg.lastTab !== 'string') errors.push('lastTab 必须是字符串');
		if (cfg.panelMinimized !== undefined && typeof cfg.panelMinimized !== 'boolean') errors.push('panelMinimized 必须是布尔值');
		if (!U.isNum(cfg.batchConcurrency) || cfg.batchConcurrency < 1 || cfg.batchConcurrency > 8) errors.push('batchConcurrency 必须在 1-8');
		if (!U.isNum(cfg.batchRetry) || cfg.batchRetry < 0 || cfg.batchRetry > 10) errors.push('batchRetry 必须在 0-10');
		if (!U.isNum(cfg.batchDelay) || cfg.batchDelay < 50 || cfg.batchDelay > 5000) errors.push('batchDelay 必须在 50-5000');
		if (typeof cfg.askBeforeDownload !== 'boolean') errors.push('askBeforeDownload 必须是布尔值');
		if (!U.isNum(cfg.logLevel) || cfg.logLevel < 0 || cfg.logLevel > 3) errors.push('logLevel 必须在 0-3');
				if (cfg.audioIdProvider !== undefined && ['audd', 'acrcloud', 'custom'].indexOf(cfg.audioIdProvider) < 0) errors.push('audioIdProvider 必须是 audd/acrcloud/custom');
		if (cfg.audioIdSeconds !== undefined && (!U.isNum(cfg.audioIdSeconds) || cfg.audioIdSeconds < 3 || cfg.audioIdSeconds > 20)) errors.push('audioIdSeconds 必须在 3-20');
		if (cfg.audioIdSource !== undefined && ['page', 'mic'].indexOf(cfg.audioIdSource) < 0) errors.push('audioIdSource 必须是 page/mic');
		if (cfg.audioIdHistory !== undefined && !U.isArr(cfg.audioIdHistory)) errors.push('audioIdHistory 必须是数组');
		if (cfg.asrMaxMB !== undefined && (!U.isNum(cfg.asrMaxMB) || cfg.asrMaxMB < 1 || cfg.asrMaxMB > 100)) errors.push('asrMaxMB 必须在 1-100');
		if (cfg.asrChunkSeconds !== undefined && (!U.isNum(cfg.asrChunkSeconds) || cfg.asrChunkSeconds < 30 || cfg.asrChunkSeconds > 1800)) errors.push('asrChunkSeconds 必须在 30-1800');
		if (cfg.aiPromptStyle !== undefined && ['summary', 'points', 'timeline', 'qa'].indexOf(cfg.aiPromptStyle) < 0) errors.push('aiPromptStyle 必须是 summary/points/timeline/qa');
		if (cfg.transcribeHistory !== undefined && !U.isArr(cfg.transcribeHistory)) errors.push('transcribeHistory 必须是数组');
		if (cfg.webdavEnabled !== undefined && typeof cfg.webdavEnabled !== 'boolean') errors.push('webdavEnabled 必须是布尔值');
		if (cfg.webdavUrl !== undefined && typeof cfg.webdavUrl !== 'string') errors.push('webdavUrl 必须是字符串');
		if (!U.isNum(cfg.minImageSize) || cfg.minImageSize < 0) errors.push('minImageSize 必须 >= 0');
		if (!U.isNum(cfg.minImageWidth) || cfg.minImageWidth < 0) errors.push('minImageWidth 必须 >= 0');
		if (!U.isNum(cfg.minImageHeight) || cfg.minImageHeight < 0) errors.push('minImageHeight 必须 >= 0');
		if (!U.isNum(cfg.minVideoDuration) || cfg.minVideoDuration < 0) errors.push('minVideoDuration 必须 >= 0');
		if (!U.isNum(cfg.maxVideoDuration) || cfg.maxVideoDuration < 0) errors.push('maxVideoDuration 必须 >= 0');
		if (!U.isNum(cfg.minAudioDuration) || cfg.minAudioDuration < 0) errors.push('minAudioDuration 必须 >= 0');
		if (typeof cfg.m3u8Quality !== 'string' || !['auto','high','medium','low'].includes(cfg.m3u8Quality)) errors.push('m3u8Quality 必须是 auto/high/medium/low');
		if (!U.isNum(cfg.m3u8Concurrency) || cfg.m3u8Concurrency < 1 || cfg.m3u8Concurrency > 8) errors.push('m3u8Concurrency 必须在 1-8');
		if (typeof cfg.m3u8AutoMerge !== 'boolean') errors.push('m3u8AutoMerge 必须是布尔值');
		if (typeof cfg.enableSync !== 'boolean') errors.push('enableSync 必须是布尔值');
		if (typeof cfg.enableHistory !== 'boolean') errors.push('enableHistory 必须是布尔值');
		if (cfg.settingsExpanded !== undefined && (typeof cfg.settingsExpanded !== 'object' || cfg.settingsExpanded === null || Array.isArray(cfg.settingsExpanded))) errors.push('settingsExpanded 必须是对象');
		if (cfg.customRules !== undefined && !U.isArr(cfg.customRules)) errors.push('customRules 必须是数组');
		if (cfg.parserPlugins !== undefined && !U.isArr(cfg.parserPlugins)) errors.push('parserPlugins 必须是数组');
		if (cfg.plugins !== undefined && !U.isArr(cfg.plugins)) errors.push('plugins 必须是数组');
		if (cfg.customPalettes !== undefined && !U.isArr(cfg.customPalettes)) errors.push('customPalettes 必须是数组');
		return errors;
	};

	State._mergeDefault = function (cfg) {
		if (!cfg || typeof cfg !== 'object') return U.deepClone(DEFAULT_CONFIG);
		var out = U.deepClone(DEFAULT_CONFIG);
		for (var k in DEFAULT_CONFIG) if (DEFAULT_CONFIG.hasOwnProperty(k) && cfg[k] !== undefined) out[k] = cfg[k];
		return out;
	};

	State.load = function () {
		try {
			if (typeof GM_getValue === 'function') {
				var raw = GM_getValue('ms_config_v8', null);
																								if (raw && typeof raw === 'string') {
					var parsedCfg = U.safeJson(raw, null);
					if (parsedCfg && typeof parsedCfg === 'object') raw = parsedCfg;
				}
				if (raw && typeof raw === 'object') {
										if (raw.uiStyle === 'apple') raw.uiStyle = 'ios27';
					var errors = State.validateConfig(raw);
					if (errors.length > 0) {
						LOG.warn('配置校验失败:', errors);
						State.config = U.deepClone(DEFAULT_CONFIG);
					} else {
						State.config = State._mergeDefault(raw);
					}
				}
			}
		} catch (e) { LOG.error('配置加载失败:', e); }
				LOG.setLevel(State.config.logLevel);
				State._computeTheme();
				if (State.config.enableSync) State._initSync();
	};

			State._saveTimer = null;
	State._flushSave = function () {
		if (State._saveTimer) { clearTimeout(State._saveTimer); State._saveTimer = null; }
		try {
			if (typeof GM_setValue === 'function') GM_setValue('ms_config_v8', State.config);
		} catch (e) { LOG.error('配置保存失败:', e); }
		try {
			if (State.syncChannel) State._broadcast({ type: 'config', data: State.config });
		} catch (e) {}
	};
		State.save = function (immediate) {
		if (State._saveTimer) clearTimeout(State._saveTimer);
						if (immediate === true) {
			State._flushSave();
			return;
		}
		State._saveTimer = setTimeout(State._flushSave, 250);
	};
	State._historyKey = '_ms_history';
	State._historyLimit = 200;
								State._historyMap = null;
	State._ensureHistory = function () {
		if (State._historyMap) return;
		State._historyMap = new Map();
		try {
						var arr = U.gmGetArray(State._historyKey, []);
												for (var i = arr.length - 1; i >= 0; i--) {
				var r = arr[i];
				if (r && r.url) State._historyMap.set(r.url + '\u0000' + (r.kind || ''), r);
			}
		} catch (e) { LOG.warn('load history failed', e); }
	};
	State._saveHistory = function () {
		try {
			if (typeof GM_setValue === 'function' && State._historyMap) {
				GM_setValue(State._historyKey, JSON.stringify(State.getHistory()));
			}
		} catch (e) { LOG.warn('save history failed', e); }
	};
	State.addHistory = function (items) {
		if (!State.config.enableHistory) return;
		if (!items || items.length === 0) return;
		State._ensureHistory();
		var map = State._historyMap;
		var changed = false;
		for (var i = 0; i < items.length; i++) {
			var it = items[i];
			if (!it || !it.url) continue;
			var kind = it.type || it.kind || SEC.guessKind(it.url) || 'video';
			var key = it.url + '\u0000' + kind;
						if (map.has(key)) map.delete(key);
			map.set(key, {
				url: it.url,
				kind: kind,
				title: it.title || '',
				size: it.size || 0,
				timestamp: it.timestamp || U.now(),
				pageUrl: it.pageUrl || window.location.href
			});
			changed = true;
		}
		if (!changed) return;
				while (map.size > State._historyLimit) {
			map.delete(map.keys().next().value);
		}
		State._saveHistory();
	};
	State.getHistory = function () {
		State._ensureHistory();
				var out = [];
		State._historyMap.forEach(function (v) { out.push(v); });
		out.reverse();
		return out;
	};
	State.clearHistory = function () { State._historyMap = new Map(); State._saveHistory(); };

				State._themeWatcherInstalled = false;
	State._installThemeWatcher = function () {
		if (State._themeWatcherInstalled) return;
		State._themeWatcherInstalled = true;
		try {
			if (typeof matchMedia !== 'function') return;
			var m = matchMedia('(prefers-color-scheme: dark)');
			var onChange = function (ev) {
				State._computedTheme = ev.matches ? 'dark' : 'light';
																if (typeof State._applyTheme === 'function') State._applyTheme();
			};
			if (typeof m.addEventListener === 'function') m.addEventListener('change', onChange);
			else if (typeof m.addListener === 'function') m.addListener(onChange);
		} catch (e) {}
	};

	State._computeTheme = function () {
		var theme = State.config.theme;
		if (theme === 'auto') {
						try {
				if (typeof matchMedia === 'function') {
					State._computedTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
					State._installThemeWatcher(); 
					return;
				}
			} catch (e) {}
			State._computedTheme = 'dark';
		} else {
			State._computedTheme = theme;
		}
	};

	State.getTheme = function () {
		State._computeTheme();
		return State._computedTheme;
	};
	State._initSync = function () {
		try {
			if (typeof BroadcastChannel === 'function') {
				State.syncChannel = new BroadcastChannel('media-sniffer-sync');
				State.syncChannel.onmessage = function (ev) {
					try {
						var msg = ev.data;
						if (msg && msg.type === 'config') {
							LOG.info('收到同步配置');
							State.config = State._mergeDefault(msg.data);
							State._computeTheme();
							if (State._applyTheme) State._applyTheme();
						} else if (msg && msg.type === 'resources') {
																												if (msg.append) {
								LOG.info('收到同步资源（增量）');
								var inc = msg.data || {};
								var mergeIn = function (arr, list) {
									if (!U.isArr(list) || !list.length) return;
									for (var mi = 0; mi < list.length; mi++) {
										var u = list[mi];
										if (!u || NetHook.hits.has(u)) continue;
										NetHook._addHit(u);
										arr.push(u);
									}
								};
								mergeIn(State.images, inc.images);
								mergeIn(State.videos, inc.videos);
								mergeIn(State.audios, inc.audios);
								mergeIn(State.m3u8, inc.m3u8);
								State._evictResources();
							} else {
								LOG.info('收到同步资源');
								State.images = msg.data.images || [];
								State.videos = msg.data.videos || [];
								State.audios = msg.data.audios || [];
								State.m3u8 = msg.data.m3u8 || [];
							}
							if (State._renderThrottled) State._renderThrottled();
						}
					} catch (e) { LOG.error('同步消息处理失败:', e); }
				};
			}
		} catch (e) { LOG.warn('BroadcastChannel 不可用:', e); }
	};

	State._broadcast = function (msg) {
		try { if (State.syncChannel) State.syncChannel.postMessage(msg); } catch (e) {}
	};

	State.exportConfig = function () { return JSON.stringify(State.config, null, 2); };
	State.importConfig = function (jsonStr) {
		try {
			var parsed = U.safeJson(jsonStr, null);
			if (!parsed || typeof parsed !== 'object') return { ok: false, msg: 'JSON 格式错误' };
			var errors = State.validateConfig(parsed);
			if (errors.length > 0) return { ok: false, msg: '配置校验失败:\n' + errors.join('\n') };
			State.config = State._mergeDefault(parsed);
			State.save();
			LOG.setLevel(State.config.logLevel);
			return { ok: true, msg: '配置已导入并校验通过' };
		} catch (e) { return { ok: false, msg: '解析失败: ' + e.message }; }
	};
	State.resetConfig = function () {
		State.config = U.deepClone(DEFAULT_CONFIG);
		State.save();
		LOG.setLevel(DEFAULT_CONFIG.logLevel);
	};

			State._MAX_RESOURCES = 10000;
	State._evictResources = function () {
		var lists = [State.images, State.videos, State.audios, State.m3u8];
		for (var i = 0; i < lists.length; i++) {
			var arr = lists[i];
			if (arr && arr.length > State._MAX_RESOURCES) {
				arr.splice(0, arr.length - State._MAX_RESOURCES);
			}
		}
	};

	State.listFor = function (tab) {
		if (tab === 'img') return State.images;
		if (tab === 'video') return State.videos;
		if (tab === 'audio') return State.audios;
		if (tab === 'm3u8') return State.m3u8;
		return [];
	};

		return State;
	})();
	var NetHook = (function () {
		'use strict';
		var NetState = { hits: new Set(), _hitsOrder: [], _MAX_HITS: 5000, queue: [], flushing: false };
	NetState._addHit = function (url) {
		if (NetState.hits.has(url)) return true;
		if (NetState.hits.size >= NetState._MAX_HITS) {
			var oldest = NetState._hitsOrder.shift();
			if (oldest) NetState.hits.delete(oldest);
		}
		NetState.hits.add(url);
		NetState._hitsOrder.push(url);
		return false;
	};
	NetState._flush = function () {
		if (NetState.flushing || NetState.queue.length === 0) return;
		if (typeof Diag !== 'undefined') Diag.stats.netFlushCount++;
		if (typeof Diag !== 'undefined') Diag.stats.netFlushLastAt = U.now();
		NetState.flushing = true;
		var batch = NetState.queue.splice(0, Math.min(200, NetState.queue.length));
		var added = { images: [], videos: [], audios: [], m3u8: [] };
		for (var i = 0; i < batch.length; i++) {
			var url = batch[i];
			if (!url || NetState.hits.has(url) || !SEC.isSafeUrl(url)) continue;
			NetState._addHit(url);
			var abs = SEC.absUrl(url);
			var kind = SEC.guessKind(abs);
			if (kind === 'image') { State.images.push(abs); added.images.push(abs); }
			else if (kind === 'video') { State.videos.push(abs); added.videos.push(abs); }
			else if (kind === 'audio') { State.audios.push(abs); added.audios.push(abs); }
			else if (kind === 'm3u8') { State.m3u8.push(abs); added.m3u8.push(abs); }
		}
		State._evictResources();
						NetState.flushing = false;
		if (State.panel && State.panelOpen && State._renderThrottled) {
			var t = State.tab;
			if (t === 'img' || t === 'video' || t === 'audio' || t === 'm3u8') State._renderThrottled();
		}
										if (State.config.enableSync && (added.images.length || added.videos.length || added.audios.length || added.m3u8.length)) {
			State._broadcast({ type: 'resources', append: true, data: added });
		}
	};
	NetState._scheduleFlush = U.throttle(NetState._flush, 500);
	NetState.collect = function (url) {
		if (!url || !U.isStr(url) || url.length < 6) return;
		NetState.queue.push(url.trim());
		NetState._scheduleFlush();
	};

	function installNetHook() {
				if (installNetHook._installed) return;
		installNetHook._installed = true;
		try {
			var OrigXHR = window.XMLHttpRequest;
			if (!OrigXHR) return;
			var origOpen = OrigXHR.prototype.open;
			if (origOpen && U.isFn(origOpen)) {
				OrigXHR.prototype.open = function (method, url) {
					try { if (url) NetState.collect(String(url)); } catch (e) {}
					return origOpen.apply(this, arguments);
				};
			}
			if (U.isFn(window.fetch)) {
				var origFetch = window.fetch;
				window.fetch = function (input, init) {
					try {
						var url = U.isStr(input) ? input : (input && input.url ? input.url : '');
						if (url) NetState.collect(String(url));
					} catch (e) {}
					return origFetch.apply(this, arguments);
				};
			}
			LOG.info('网络拦截已安装');
		} catch (e) { LOG.warn('网络拦截安装失败:', e); }
	}

		NetState.install = installNetHook;
		return NetState;
	})();
	var installNetHook = NetHook.install;
	var Toast = (function () {
		'use strict';
		var STATUS_BAR = null;
	function showStatus(text, color, autoHideMs) {
		try {
			if (State.config && State.config.showStatusBar === false) return;
			var host = document.documentElement || document.body;
			if (!host) return false;
			var _remove = function (el) {
				try { el.style.transition = 'opacity 0.6s ease'; el.style.opacity = '0'; setTimeout(function () { try { el.remove(); } catch (ee) {} }, 650); } catch (e) { try { el.remove(); } catch (ee) {} }
			};
			if (!STATUS_BAR) {
				STATUS_BAR = document.createElement('div');
				STATUS_BAR.id = '_ms_status';
				STATUS_BAR.style.cssText = 'position:fixed;top:0;left:0;right:0;padding:7px 12px;background:' + (color || MS_CONFIG.COLORS.success) + ';color:' + MS_CONFIG.COLORS.white + ';font-size:12px;font-weight:600;z-index:' + MS_CONFIG.SIZES.zMax + ';text-align:center;font-family:system-ui,sans-serif;border-bottom:2px solid rgba(0,0,0,.15);box-shadow:0 2px 8px rgba(0,0,0,.2);cursor:pointer;opacity:1;';
				host.appendChild(STATUS_BAR);
				STATUS_BAR.addEventListener('click', function () { _remove(STATUS_BAR); });
			} else { STATUS_BAR.style.display = ''; STATUS_BAR.style.opacity = '1'; }
			STATUS_BAR.textContent = text || '';
			STATUS_BAR.style.background = color || MS_CONFIG.COLORS.success;
			var delay = (typeof autoHideMs === 'number' && autoHideMs > 0) ? autoHideMs : 3000;
			try { if (STATUS_BAR._hideTimer) clearTimeout(STATUS_BAR._hideTimer); } catch (e) {}
			STATUS_BAR._hideTimer = setTimeout(function () { _remove(STATUS_BAR); }, delay);
			return true;
		} catch (e) { return false; }
	}

			function toastRgba(color, alpha) {
		var h = String(color == null ? '' : color).trim();
		var m = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(h);
		if (m) {
			var s = m[1];
			if (s.length === 3) s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2);
			var n = parseInt(s, 16);
			return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + alpha + ')';
		}
		var m2 = /^rgba?\(([^)]+)\)$/i.exec(h);
		if (m2) {
			var p = m2[1].split(',');
			if (p.length >= 3) return 'rgba(' + p[0].trim() + ',' + p[1].trim() + ',' + p[2].trim() + ',' + alpha + ')';
		}
		return h || 'rgba(16,185,129,' + alpha + ')';
	}

				var TOAST_DUR = 2500;
				var TOAST_MAX = 3;
	var TOAST_DEDUP_MS = 800;
	var _toastLive = 0;
	var _toastQueue = [];
	var _toastLast = { msg: '', at: 0 };

	function _toastDrain() {
		if (_toastLive >= TOAST_MAX || !_toastQueue.length) return;
		var job = _toastQueue.shift();
		_toastRender(job.msg, job.color, job.dur, job.onClick);
	}

	function toast(msg, color, dur, onClick) {
		try {
			var text = String(msg == null ? '' : msg);
			var now = U.now();
						if (text === _toastLast.msg && (now - _toastLast.at) < TOAST_DEDUP_MS) return;
			_toastLast.msg = text;
			_toastLast.at = now;
			if (_toastLive >= TOAST_MAX) {
								if (_toastQueue.length < TOAST_MAX * 4) {
					_toastQueue.push({ msg: text, color: color, dur: dur, onClick: onClick });
				}
				return;
			}
			_toastRender(text, color, dur, onClick);
		} catch (e) {}
	}

	function _toastRender(msg, color, dur, onClick) {
		try {
			_toastLive++;
			if (typeof Diag !== 'undefined') Diag.stats.toastCount++;
			var clickable = typeof onClick === 'function';
			var base = color || MS_CONFIG.COLORS.success;
			var glass = false, dark = false;
			try {
												glass = !!(typeof State !== 'undefined' && State && State.config && State.config.uiStyle === 'ios27');
								dark = !!(typeof UI !== 'undefined' && UI && typeof UI.isEffectivelyDark === 'function'
					? UI.isEffectivelyDark()
					: (typeof State !== 'undefined' && State && typeof State.getTheme === 'function' && State.getTheme() === 'dark'));
			} catch (e0) {}

			var t = document.createElement('div');
			var css = 'position:fixed;left:50%;top:60px;padding:10px 20px;border-radius:12px;color:'
				+ MS_CONFIG.COLORS.white + ';font-size:14px;font-weight:500;z-index:' + (MS_CONFIG.SIZES.zMax - 1)
				+ ';pointer-events:' + (clickable ? 'auto' : 'none') + ';cursor:' + (clickable ? 'pointer' : 'default')
				+ ';max-width:90vw;text-align:center;';
			if (glass) {
				css += 'background:' + toastRgba(base, dark ? 0.42 : 0.52) + ';'
					+ 'background-image:linear-gradient(180deg,' + toastRgba('#ffffff', dark ? 0.22 : 0.54) + ','
					+ toastRgba('#ffffff', 0.04) + ' 52%,' + toastRgba(base, dark ? 0.30 : 0.36) + ');'
					+ 'border:1px solid ' + toastRgba('#ffffff', dark ? 0.28 : 0.66) + ';'
					+ '-webkit-backdrop-filter:blur(26px) saturate(210%) brightness(1.06);backdrop-filter:blur(26px) saturate(210%) brightness(1.06);'
					+ 'box-shadow:0 14px 38px ' + toastRgba(base, dark ? 0.36 : 0.30) + ',0 2px 8px rgba(0,0,0,' + (dark ? 0.38 : 0.16) + '),'
					+ 'inset 0 1px 0 ' + toastRgba('#ffffff', dark ? 0.45 : 0.80) + ',inset 0 -2px 8px ' + toastRgba('#000000', 0.12) + ';'
					+ 'text-shadow:0 1px 2px rgba(0,0,0,.22);';
			} else {
				css += 'background:' + base + ';box-shadow:0 8px 24px rgba(0,0,0,.3);text-shadow:0 1px 2px rgba(0,0,0,.16);';
			}
			t.style.cssText = css;
			t.textContent = msg || '';
			if (clickable) t.addEventListener('click', function (e) { try { onClick(e); } catch (err) {} });
			t.className = '_ms_toast';

			var reduce = false;
			try { reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e1) {}
			var HIDDEN = 'translateX(-50%) translateY(calc(-100% - 72px))'; 
			var SHOWN = 'translateX(-50%) translateY(0)';

			t.style.willChange = 'transform,opacity';
			t.style.transition = 'none';
			t.style.opacity = '0';
			t.style.transform = HIDDEN;
			(document.body || document.documentElement).appendChild(t);

			var played = false;
			function play() {
				if (played) return;
				played = true;
				if (reduce) { t.style.transition = 'none'; t.style.opacity = '1'; t.style.transform = SHOWN; return; }
				t.style.transition = 'transform .42s cubic-bezier(.22,1.14,.36,1),opacity .28s ease';
				t.style.opacity = '1';
				t.style.transform = SHOWN;
			}
			function hide() {
				t.style.transition = reduce ? 'none' : 'transform .40s cubic-bezier(.45,0,.72,.25),opacity .36s ease';
				t.style.opacity = '0';
				t.style.transform = HIDDEN; 
				setTimeout(function () { try { t.remove(); } catch (e) {} }, reduce ? 60 : 470);
			}

			if (reduce) {
				play();
			} else {
												try { requestAnimationFrame(function () { requestAnimationFrame(play); }); } catch (e2) {}
				setTimeout(play, 90);
			}
			var gone = false;
			var release = function () {
				if (gone) return;
				gone = true;
				_toastLive = Math.max(0, _toastLive - 1);
				_toastDrain();
			};
			setTimeout(function () { hide(); release(); }, dur || TOAST_DUR);
		} catch (e) { _toastLive = Math.max(0, _toastLive - 1); _toastDrain(); }
	}
	function copyText(text) {
		try { if (typeof GM_setClipboard === 'function') { GM_setClipboard(text); toast(LANG.t('copiedN', {n: String(text).length})); return; } } catch (e) {}
		try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(function () { toast(LANG.t('copied')); }, function () { fallbackCopy(text); }); return; } } catch (e) {}
		fallbackCopy(text);
	}
	function fallbackCopy(text) {
		var ta = null;
		try {
			ta = document.createElement('textarea');
			ta.value = text;
			ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
			(document.documentElement || document.body).appendChild(ta);
			ta.focus();
			ta.select();
			document.execCommand('copy');
			toast(LANG.t('copied'));
		} catch (e) {
			toast(LANG.t('copyFail'), '#ef4444');
		} finally {
			if (ta) {
				try { ta.remove(); } catch (e) {}
			}
		}
	}

		return { showStatus: showStatus, toast: toast, copyText: copyText };
	})();
	var toast = Toast.toast;
	var copyText = Toast.copyText;
	var Resolver = (function () {
		'use strict';
		var VideoResolver = {};
	VideoResolver._cache = {};
	VideoResolver._cacheLru = U.lru(VideoResolver._cache, 60);
	VideoResolver._errorCache = {};
	VideoResolver._retryTimes = 3;
	VideoResolver._maxConcurrent = 3;
	VideoResolver._timeout = 15000;
	VideoResolver._errorCacheTTL = 5 * 60 * 1000;

	VideoResolver._isErrorCached = function(url) {
		var cached = VideoResolver._errorCache[url];
		if (!cached) return false;
		if (Date.now() - cached.timestamp > VideoResolver._errorCacheTTL) {
			delete VideoResolver._errorCache[url];
			return false;
		}
		return true;
	};

	VideoResolver._cacheError = function(url, err) {
		VideoResolver._errorCache[url] = {
			error: err,
			timestamp: Date.now()
		};
	};

		VideoResolver.fillFromHtml = function (result, html) {
		var t = html.match(/<title[^>]*>([^<]+)<\/title>/i);
		if (t) result.title = t[1].trim();
		var cov = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
		if (cov) result.cover = cov[1];
		return result;
	};

	VideoResolver.resolve = function(url, cb, options) {
		if (typeof Diag !== 'undefined') Diag.stats.resolveCount++;
		if (VideoResolver._cache[url]) { cb(VideoResolver._cache[url], null); return; }
		if (VideoResolver._isErrorCached(url)) {
			cb(null, VideoResolver._errorCache[url].error);
			return;
		}
		if (Plugins.tryCustomParser(url, function(data, err) {
			if (data) {
				VideoResolver._cacheLru.set(url, data);
				cb(data, null);
			} else {
				VideoResolver._cacheError(url, err || '插件解析失败');
				cb(null, err || '插件解析失败');
			}
		})) return;
		var site = SEC.detectVideoSite(url);
		if (!site) { cb(null, '不支持的视频站点'); return; }
		var retryTimes = (options && options.retryTimes) || VideoResolver._retryTimes;
		var attempt = 0;
		var resolver = null;
		var resolveTimeout = null;
												var settled = false;
		var finish = function (data, err) {
			if (settled) return;
			settled = true;
			if (resolveTimeout) { clearTimeout(resolveTimeout); resolveTimeout = null; }
			cb(data, err);
		};
		if (site.key === 'bilibili') {
			resolver = VideoResolver._resolveBilibili;
		} else if (site.key === 'douyin') {
			resolver = VideoResolver._resolveDouyin;
		} else if (site.key === 'kuaishou') {
			resolver = VideoResolver._resolveKuaishou;
		} else if (site.key === 'xiaohongshu') {
			resolver = VideoResolver._resolveXiaohongshu;
		} else if (site.key === 'weibo') {
			resolver = VideoResolver._resolveWeibo;
		} else if (site.key === 'zhihu') {
			resolver = VideoResolver._resolveZhihu;
		} else if (site.key === 'weixin') {
			resolver = VideoResolver._resolveWeixin;
		} else {
			cb(null, '暂不支持解析 ' + site.name);
			return;
		}
		var tryResolve = function() {
			var currentAttempt = attempt;
			var attemptTimedOut = false;
			var attemptTimeout = setTimeout(function() {
				attemptTimedOut = true;
				handleAttemptError('解析超时');
			}, VideoResolver._timeout);
			var callbackCalled = false;
			resolver(url, function(data, err) {
				if (callbackCalled) return;
				callbackCalled = true;
				clearTimeout(attemptTimeout);
				if (attemptTimedOut) return;
				if (data) {
					VideoResolver._cacheLru.set(url, data);
					finish(data, null);
				} else {
					handleAttemptError(err);
				}
			}, currentAttempt);
		};
		var handleAttemptError = function(err) {
			if (settled) return; 
			attempt++;
			if (attempt < retryTimes) {
				var delay = 500 * Math.pow(2, attempt - 1);
				setTimeout(tryResolve, delay);
			} else {
				VideoResolver._cacheError(url, err || '解析失败');
				finish(null, err || '解析失败');
			}
		};
		resolveTimeout = setTimeout(function () {
			VideoResolver._cacheError(url, '解析总超时');
			finish(null, '解析总超时');
		}, VideoResolver._timeout * retryTimes);
		tryResolve();
	};

	VideoResolver._classifyError = function(data, errType) {
		if (errType === 'network') return { type: 'network', message: '网络错误，请检查网络连接' };
		if (errType === 'timeout') return { type: 'timeout', message: '请求超时，请稍后重试' };
		if (data && data.code === -101) return { type: 'login', message: '需要登录Cookie，请先登录B站' };
		if (data && data.code === -102) return { type: 'cookie_expired', message: 'Cookie已过期，请重新登录B站' };
		if (data && data.code === -403) return { type: 'region_limit', message: '该视频受地域限制，无法观看' };
		if (data && data.code === -402) return { type: 'vip_only', message: '该视频需要大会员才能观看' };
		if (data && data.code === 69000) return { type: 'vip_only', message: '该视频需要大会员才能观看' };
		if (data && data.code === 69001) return { type: 'region_limit', message: '该视频受地域限制，无法观看' };
		if (data && data.code === -412) return { type: 'rate_limit', message: '接口限流，请稍后再试' };
		if (data && data.code === -404) return { type: 'not_found', message: '视频不存在或已被删除' };
		if (data && data.message) {
			var msg = data.message || '';
			if (msg.indexOf('登录') !== -1 || msg.indexOf('cookie') !== -1 || msg.indexOf('Cookie') !== -1) {
				return { type: 'cookie_expired', message: 'Cookie已过期，请重新登录B站' };
			}
			if (msg.indexOf('地域') !== -1 || msg.indexOf('地区') !== -1 || msg.indexOf('限制') !== -1) {
				return { type: 'region_limit', message: '该视频受地域限制，无法观看' };
			}
			if (msg.indexOf('会员') !== -1 || msg.indexOf('VIP') !== -1 || msg.indexOf('付费') !== -1) {
				return { type: 'vip_only', message: '该视频需要大会员才能观看' };
			}
			return { type: 'api', message: data.message };
		}
		return { type: 'unknown', message: errType || '未知错误' };
	};

	VideoResolver._resolveBilibili = function(pageUrl, cb, attempt) {
		attempt = attempt || 0;
		try {
			var bvMatch = pageUrl.match(/\/video\/(BV[a-zA-Z0-9]+)/i);
			var avMatch = pageUrl.match(/\/video\/av(\d+)/i);
			var bvid = bvMatch ? bvMatch[1] : '';
			var aid = avMatch ? avMatch[1] : '';
			if (!bvid && !aid) { cb(null, '未找到 BV/AV 号'); return; }
																											var primaryApi = 'https://api.bilibili.com/x/web-interface/view?';
			var thirdApi = 'https://api.bilibili.com/x/web-interface/view/detail?';
			var query = bvid ? ('bvid=' + encodeURIComponent(bvid)) : ('aid=' + aid);
			primaryApi += query;
			thirdApi += query;
			var apiChain = [
				{ url: primaryApi, isDetail: false },
				{ url: thirdApi, isDetail: true }
			];
			if (typeof GM_xmlhttpRequest === 'function') {
				var parseVideoData = function(data, isDetail) {
					var videoData = isDetail && data.data ? (data.data.View || data.data) : data.data;
					if (!videoData) return null;
					var stat = videoData.stat || {};
					var result = {
						title: videoData.title || '',
						cover: videoData.pic || '',
						duration: videoData.duration || 0,
						owner: videoData.owner ? videoData.owner.name : '',
						ownerFace: videoData.owner ? videoData.owner.face : '',
						ownerMid: videoData.owner ? videoData.owner.mid : '',
						aid: videoData.aid,
						bvid: videoData.bvid,
						cid: videoData.cid,
						desc: videoData.desc || '',
						pages: videoData.pages || [],
						siteIcon: MS_CONFIG.ICONS.stream,
						siteName: '哔哩哔哩',
						viewCount: stat.view || 0,
						likeCount: stat.like || 0,
						coinCount: stat.coin || 0,
						favoriteCount: stat.favorite || 0,
						replyCount: stat.reply || 0,
						danmakuCount: stat.danmaku || 0,
						shareCount: stat.share || 0,
						play: stat.view || 0,
						like: stat.like || 0,
						coin: stat.coin || 0,
						favorite: stat.favorite || 0,
						reply: stat.reply || 0,
						danmaku: stat.danmaku || 0,
						share: stat.share || 0,
						pubdate: videoData.pubdate || 0,
						qualityDescriptions: {
							127: '8K 超高清',
							126: '杜比视界',
							125: 'HDR 真彩色',
							120: '4K 超清',
							116: '1080P 60帧',
							112: '1080P+ 高码率',
							80: '1080P 高清',
							74: '720P 60帧',
							64: '720P 高清',
							32: '480P 清晰',
							16: '360P 流畅',
							6: '240P 极速'
						}
					};
					result.currentQn = 64;
					return result;
				};
																var fetchNextApi = function(apiIndex, errMsg) {
					var ni = apiIndex + 1;
					if (ni < apiChain.length) {
						fetchVideoInfo(apiChain[ni].url, ni, apiChain[ni].isDetail);
					} else {
						cb(null, errMsg);
					}
				};
				var fetchVideoInfo = function(infoApiUrl, apiIndex, isDetail) {
					GM_xmlhttpRequest({
						method: 'GET',
						url: infoApiUrl,
						responseType: 'json',
						timeout: VideoResolver._timeout,
						headers: {
							'Referer': 'https://www.bilibili.com/',
			'User-Agent': 'Mozilla/5.0'
						},
						onload: function(resp) {
							try {
								var data = resp.response;
								if (typeof data === 'string') data = JSON.parse(data);
								var result = parseVideoData(data, isDetail);
								if (result) {
									if (result.cid) {
										VideoResolver._fetchPlayUrl({
											bvid: bvid,
											aid: result.aid,
											cid: result.cid,
											qn: 64,
											result: result,
											cb: cb,
											useBackup: false
										});
									} else {
										cb(result, null);
									}
								} else {
									var errInfo = VideoResolver._classifyError(data, 'api');
									fetchNextApi(apiIndex, errInfo.message);
								}
							} catch(e) {
								fetchNextApi(apiIndex, e.message);
							}
						},
						onerror: function() {
							fetchNextApi(apiIndex, '网络请求失败');
						},
						ontimeout: function() {
							fetchNextApi(apiIndex, '请求超时');
						}
					});
				};
				fetchVideoInfo(apiChain[0].url, 0, apiChain[0].isDetail);
			} else {
				cb(null, '需要 Tampermonkey 环境');
			}
		} catch(e) { cb(null, e.message); }
	};

	VideoResolver._resolveDouyin = function(pageUrl, cb, attempt) {
		attempt = attempt || 0;
		try {
			var videoIdMatch = pageUrl.match(/\/video\/(\d+)/i) || pageUrl.match(/\/note\/(\d+)/i);
			var videoId = videoIdMatch ? videoIdMatch[1] : '';
			if (!videoId) { cb(null, '未找到抖音视频ID'); return; }
			if (typeof GM_xmlhttpRequest === 'function') {
				GM_xmlhttpRequest({
					method: 'GET',
					url: pageUrl,
					headers: {
						'Referer': 'https://www.douyin.com/',
			'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
					},
					onload: function(resp) {
						try {
							var html = resp.responseText || resp.response || '';
							var renderData = null;
							var renderMatch = html.match(/window\.__INIT_PROPS__\s*=\s*(\{[\s\S]*?\})\s*;?\s*<\/script>/i);
							if (renderMatch) {
								renderData = U.safeJson(renderMatch[1], null);
							}
							if (!renderData) {
								var renderMatch2 = html.match(/RENDER_DATA\s*=\s*["']([^"']+)["']/i);
								if (renderMatch2) {
									try {
										var decoded = decodeURIComponent(renderMatch2[1]);
										renderData = U.safeJson(decoded, null);
																				if (!renderData) LOG.debug('[抖音] RENDER_DATA 不是合法 JSON（前 80 字）:', String(decoded).slice(0, 80));
									} catch (e) {
																																								LOG.debug('[抖音] RENDER_DATA 解码失败:', e && e.message);
									}
								} else {
									LOG.debug('[抖音] 页面里没有 RENDER_DATA / __INIT_PROPS__（站点可能改版了）');
								}
							}
							var result = {
								title: '',
								cover: '',
								videoUrl: '',
								duration: 0,
								author: '',
								siteIcon: MS_CONFIG.ICONS.audio,
								siteName: '抖音',
								videoId: videoId,
								viewCount: 0,
								likeCount: 0,
								commentCount: 0,
								shareCount: 0
							};
							var videoInfo = null;
							if (renderData) {
								try {
									var initialData = renderData.initialData || renderData;
									if (initialData.video) {
										videoInfo = initialData.video;
									} else if (initialData.itemInfo && initialData.itemInfo.itemStruct) {
										videoInfo = initialData.itemInfo.itemStruct;
									} else {
										for (var key in initialData) {
											if (initialData[key] && initialData[key].video) {
												videoInfo = initialData[key].video;
												break;
											}
										}
									}
								} catch(e) {}
							}
							if (videoInfo) {
								result.title = videoInfo.desc || videoInfo.title || '';
								if (videoInfo.cover) {
									if (typeof videoInfo.cover === 'string') {
										result.cover = videoInfo.cover;
									} else if (videoInfo.cover.url_list && videoInfo.cover.url_list.length > 0) {
										result.cover = videoInfo.cover.url_list[0];
									} else if (videoInfo.cover.origin_cover && videoInfo.cover.origin_cover.url_list && videoInfo.cover.origin_cover.url_list.length > 0) {
										result.cover = videoInfo.cover.origin_cover.url_list[0];
									} else if (videoInfo.cover.dynamic_cover && videoInfo.cover.dynamic_cover.url_list && videoInfo.cover.dynamic_cover.url_list.length > 0) {
										result.cover = videoInfo.cover.dynamic_cover.url_list[0];
									}
								}
								if (videoInfo.author) {
									result.author = videoInfo.author.nickname || videoInfo.author.unique_id || '';
								}
								if (videoInfo.duration) {
									result.duration = Math.floor(videoInfo.duration / 1000);
								}
								if (videoInfo.statistics) {
									result.viewCount = videoInfo.statistics.play_count || videoInfo.statistics.view_count || 0;
									result.likeCount = videoInfo.statistics.digg_count || videoInfo.statistics.like_count || 0;
									result.commentCount = videoInfo.statistics.comment_count || 0;
									result.shareCount = videoInfo.statistics.share_count || 0;
								} else if (videoInfo.stats) {
									result.viewCount = videoInfo.stats.playCount || videoInfo.stats.viewCount || 0;
									result.likeCount = videoInfo.stats.diggCount || videoInfo.stats.likeCount || 0;
									result.commentCount = videoInfo.stats.commentCount || 0;
									result.shareCount = videoInfo.stats.shareCount || 0;
								} else {
									result.viewCount = videoInfo.play_count || videoInfo.view_count || videoInfo.playCount || videoInfo.viewCount || 0;
									result.likeCount = videoInfo.digg_count || videoInfo.like_count || videoInfo.diggCount || videoInfo.likeCount || 0;
									result.commentCount = videoInfo.comment_count || videoInfo.commentCount || 0;
									result.shareCount = videoInfo.share_count || videoInfo.shareCount || 0;
								}
								if (videoInfo.video) {
									var v = videoInfo.video;
									if (v.play_addr && v.play_addr.url_list && v.play_addr.url_list.length > 0) {
										result.videoUrl = v.play_addr.url_list[0];
									} else if (v.play_addr_h264 && v.play_addr_h264.url_list && v.play_addr_h264.url_list.length > 0) {
										result.videoUrl = v.play_addr_h264.url_list[0];
									}
									if (!result.cover && v.cover && v.cover.url_list && v.cover.url_list.length > 0) {
										result.cover = v.cover.url_list[0];
									}
								}
								if (result.videoUrl) {
									cb(result, null);
								} else {
									result.error = '无法获取真实视频地址';
									cb(result, null);
								}
							} else {
								cb(null, '解析抖音视频信息失败');
							}
						} catch(e) { cb(null, e.message); }
					},
					onerror: function() {
						cb(null, '网络请求失败');
					},
					ontimeout: function() {
						cb(null, '请求超时');
					}
				});
			} else {
				cb(null, '需要 Tampermonkey 环境');
			}
		} catch(e) { cb(null, e.message); }
	};

	VideoResolver._resolveKuaishou = function(pageUrl, cb, attempt) {
		attempt = attempt || 0;
		try {
			var videoIdMatch = pageUrl.match(/\/short-video\/([^/?#]+)/i) || pageUrl.match(/\/video\/([^/?#]+)/i);
			var videoId = videoIdMatch ? videoIdMatch[1] : '';
			if (!videoId) { cb(null, '未找到快手视频ID'); return; }
			if (typeof GM_xmlhttpRequest === 'function') {
				GM_xmlhttpRequest({
					method: 'GET',
					url: pageUrl,
					headers: {
						'Referer': 'https://www.kuaishou.com/',
			'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
					},
					onload: function(resp) {
						try {
							var html = resp.responseText || resp.response || '';
							var apolloData = null;
							var apolloMatch = html.match(/window\.__APOLLO_STATE__\s*=\s*(\{[\s\S]*?\})\s*;?\s*<\/script>/i);
							if (apolloMatch) {
								apolloData = U.safeJson(apolloMatch[1], null);
							}
							var result = {
								title: '',
								cover: '',
								videoUrl: '',
								duration: 0,
								author: '',
								siteIcon: MS_CONFIG.ICONS.lightning,
								siteName: '快手',
								videoId: videoId,
								viewCount: 0,
								likeCount: 0,
								commentCount: 0,
								shareCount: 0
							};
							var videoInfo = null;
							if (apolloData) {
								try {
									for (var key in apolloData) {
										if (apolloData.hasOwnProperty(key)) {
											var item = apolloData[key];
											if (item && (item.photoUrl || item.coverUrl || item.mp4Url) && (item.caption || item.description)) {
												videoInfo = item;
												break;
											}
										}
									}
									if (!videoInfo) {
										for (var k in apolloData) {
											if (apolloData.hasOwnProperty(k)) {
												var obj = apolloData[k];
												if (obj && typeof obj === 'object') {
													for (var subKey in obj) {
														if (obj.hasOwnProperty(subKey)) {
															var subItem = obj[subKey];
															if (subItem && (subItem.photoUrl || subItem.coverUrl || subItem.mp4Url)) {
																videoInfo = subItem;
																break;
															}
														}
													}
													if (videoInfo) break;
												}
											}
										}
									}
								} catch(e) {}
							}
							if (!videoInfo) {
VideoResolver.fillFromHtml(result, html);
								if (result.title || result.cover) {
									result.error = '无法获取真实视频地址';
									cb(result, null);
								} else {
									cb(null, '解析快手视频信息失败');
								}
								return;
							}
							result.title = videoInfo.caption || videoInfo.description || videoInfo.title || '';
							if (videoInfo.coverUrl) {
								result.cover = videoInfo.coverUrl;
							} else if (videoInfo.cover && videoInfo.cover.url) {
								result.cover = videoInfo.cover.url;
							} else if (videoInfo.thumbnailUrl) {
								result.cover = videoInfo.thumbnailUrl;
							} else if (videoInfo.photoUrl) {
								result.cover = videoInfo.photoUrl;
							}
							if (videoInfo.mp4Url) {
								result.videoUrl = videoInfo.mp4Url;
							} else if (videoInfo.mainMvUrls && videoInfo.mainMvUrls.length > 0) {
								result.videoUrl = videoInfo.mainMvUrls[0];
							} else if (videoInfo.video && videoInfo.video.url) {
								result.videoUrl = videoInfo.video.url;
							}
							if (videoInfo.duration) {
								result.duration = Math.floor(videoInfo.duration / 1000);
							} else if (videoInfo.timestamp) {
								result.duration = Math.floor(videoInfo.timestamp / 1000);
							}
							if (videoInfo.userName) {
								result.author = videoInfo.userName;
							} else if (videoInfo.user && videoInfo.user.name) {
								result.author = videoInfo.user.name;
							} else if (videoInfo.user && videoInfo.user.userName) {
								result.author = videoInfo.user.userName;
							}
							if (videoInfo.statistics) {
								result.viewCount = videoInfo.statistics.viewCount || videoInfo.statistics.view_count || videoInfo.statistics.playCount || videoInfo.statistics.play_count || 0;
								result.likeCount = videoInfo.statistics.likeCount || videoInfo.statistics.like_count || videoInfo.statistics.likedCount || 0;
								result.commentCount = videoInfo.statistics.commentCount || videoInfo.statistics.comment_count || 0;
								result.shareCount = videoInfo.statistics.shareCount || videoInfo.statistics.share_count || 0;
							} else if (videoInfo.stats) {
								result.viewCount = videoInfo.stats.viewCount || videoInfo.stats.view_count || videoInfo.stats.playCount || videoInfo.stats.play_count || 0;
								result.likeCount = videoInfo.stats.likeCount || videoInfo.stats.like_count || videoInfo.stats.likedCount || 0;
								result.commentCount = videoInfo.stats.commentCount || videoInfo.stats.comment_count || 0;
								result.shareCount = videoInfo.stats.shareCount || videoInfo.stats.share_count || 0;
							} else {
								result.viewCount = videoInfo.viewCount || videoInfo.view_count || videoInfo.playCount || videoInfo.play_count || videoInfo.view_count || 0;
								result.likeCount = videoInfo.likeCount || videoInfo.like_count || videoInfo.likedCount || videoInfo.liked_count || 0;
								result.commentCount = videoInfo.commentCount || videoInfo.comment_count || 0;
								result.shareCount = videoInfo.shareCount || videoInfo.share_count || 0;
							}
							if (result.videoUrl) {
								cb(result, null);
							} else {
								result.error = '无法获取真实视频地址';
								cb(result, null);
							}
						} catch(e) { cb(null, e.message); }
					},
					onerror: function() {
						cb(null, '网络请求失败');
					},
					ontimeout: function() {
						cb(null, '请求超时');
					}
				});
			} else {
				cb(null, '需要 Tampermonkey 环境');
			}
		} catch(e) { cb(null, e.message); }
	};

				VideoResolver._stubResolve = function (siteName, siteIcon, referer) {
		return function (pageUrl, cb, attempt) {
			attempt = attempt || 0;
			try {
				if (typeof GM_xmlhttpRequest !== 'function') { cb(null, '需要 Tampermonkey 环境'); return; }
				GM_xmlhttpRequest({
					method: 'GET',
					url: pageUrl,
					headers: {
						'Referer': referer,
						'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
					},
					onload: function (resp) {
						try {
							var html = resp.responseText || resp.response || '';
							var result = {
								title: '', cover: '', videoUrl: '', duration: 0, author: '',
								siteIcon: siteIcon, siteName: siteName
							};
							VideoResolver.fillFromHtml(result, html);
							result.error = '暂不支持解析';
							cb(result, null);
						} catch (e) { cb(null, e.message); }
					},
					onerror: function () { cb(null, '网络请求失败'); },
					ontimeout: function () { cb(null, '请求超时'); }
				});
			} catch (e) { cb(null, e.message); }
		};
	};

	VideoResolver._resolveXiaohongshu = VideoResolver._stubResolve('小红书', MS_CONFIG.ICONS.book, 'https://www.xiaohongshu.com/');
	VideoResolver._resolveWeibo = VideoResolver._stubResolve('微博', MS_CONFIG.ICONS.globe, 'https://weibo.com/');
			VideoResolver._resolveZhihu = VideoResolver._stubResolve('知乎', MS_CONFIG.ICONS.bulb, 'https://www.zhihu.com/');
	VideoResolver._resolveWeixin = VideoResolver._stubResolve('微信视频号', MS_CONFIG.ICONS.speech, 'https://channels.weixin.qq.com/');

	VideoResolver._fetchPlayUrl = function(opts) {
		var bvid = opts.bvid;
		var aid = opts.aid;
		var cid = opts.cid;
		var qn = opts.qn || 64;
		var result = opts.result;
		var cb = opts.cb;
								result = result || {};
		if (!result.qualityDescriptions) result.qualityDescriptions = {};
		var useBackup = opts.useBackup || false;
		var apiIndex = opts.apiIndex !== undefined ? opts.apiIndex : (useBackup ? 1 : 0);
		var primaryPlayApi = 'https://api.bilibili.com/x/player/playurl?';
		var backupPlayApi = 'https://api.bilibili.com/x/player/wbi/playurl?';
		var thirdPlayApi = 'https://api.bilibili.com/x/player/playurl/v1?';
		var apiList = [primaryPlayApi, backupPlayApi, thirdPlayApi];
		var baseUrl = apiList[apiIndex] || primaryPlayApi;
		var playUrl = baseUrl;
		if (bvid) playUrl += 'bvid=' + bvid;
		else playUrl += 'avid=' + aid;
		playUrl += '&cid=' + cid + '&qn=' + qn + '&fnval=16&fourk=1';
		var tryNextApi = function() {
			var nextIndex = apiIndex + 1;
			if (nextIndex < apiList.length) {
				VideoResolver._fetchPlayUrl({
					bvid: bvid,
					aid: aid,
					cid: cid,
					qn: qn,
					result: result,
					cb: cb,
					apiIndex: nextIndex
				});
				return true;
			}
			return false;
		};
		GM_xmlhttpRequest({
			method: 'GET',
			url: playUrl,
			responseType: 'json',
			timeout: VideoResolver._timeout,
			headers: {
				'Referer': 'https://www.bilibili.com/',
			'User-Agent': 'Mozilla/5.0'
			},
			onload: function(resp2) {
				try {
					var pdata = resp2.response;
					if (typeof pdata === 'string') pdata = JSON.parse(pdata);
					if (pdata && pdata.data && pdata.data.durl && pdata.data.durl.length > 0) {
						result.videoUrl = pdata.data.durl[0].url;
						result.videoUrls = pdata.data.durl.map(function(d){ return d.url; });
						result.quality = pdata.data.quality || '';
						result.currentQn = pdata.data.quality || qn;
						result.acceptQuality = pdata.data.accept_quality || [];
						result.acceptDescription = pdata.data.accept_description || [];
						result.qualityList = VideoResolver._buildQualityList(pdata.data, result.qualityDescriptions);
						cb(result, null);
					} else if (pdata && pdata.data && pdata.data.dash) {
						var dash = pdata.data.dash;
						if (dash.video && dash.video.length > 0) {
							var sortedVideos = dash.video.slice().sort(function(a, b) {
								return (b.id || 0) - (a.id || 0);
							});
							result.videoUrl = sortedVideos[0].baseUrl || sortedVideos[0].base_url || '';
							result.videoQualities = sortedVideos.map(function(v) {
								return {
									quality: v.id,
									qn: v.id,
									desc: result.qualityDescriptions[v.id] || (v.height + 'P'),
									url: v.baseUrl || v.base_url || '',
									height: v.height,
									width: v.width,
									codecs: v.codecs || ''
								};
							});
							result.qualityList = result.videoQualities;
						}
						if (dash.audio && dash.audio.length > 0) {
							var sortedAudios = dash.audio.slice().sort(function(a, b) {
								return (b.bandwidth || 0) - (a.bandwidth || 0);
							});
							result.audioUrl = sortedAudios[0].baseUrl || sortedAudios[0].base_url || '';
							result.audioQualities = sortedAudios.map(function(a) {
								return {
									id: a.id,
									url: a.baseUrl || a.base_url || '',
									label: (a.bandwidth ? Math.round(a.bandwidth / 1000) + 'kbps' : '音频')
								};
							});
						}
						result.isDash = true;
						result.acceptQuality = sortedVideos ? sortedVideos.map(function(v) { return v.id; }) : [];
						result.currentQn = pdata.data.quality || qn;
						result.quality = pdata.data.quality || '';
						result.dash = dash;
						cb(result, null);
					} else if (pdata && pdata.code !== 0) {
						if (!tryNextApi()) {
							var errInfo = VideoResolver._classifyError(pdata, 'api');
							result.error = errInfo.message;
							cb(result, null);
						}
						return;
					} else {
						if (!tryNextApi()) {
							cb(result, null);
						}
						return;
					}
				} catch(e) {
					if (!tryNextApi()) {
						cb(result, null);
					}
				}
			},
			onerror: function() {
				if (!tryNextApi()) {
					cb(result, null);
				}
			},
			ontimeout: function() {
				if (!tryNextApi()) {
					cb(result, null);
				}
			}
		});
	};

	VideoResolver._buildQualityList = function(playData, qualityDescriptions) {
		var list = [];
		qualityDescriptions = qualityDescriptions || {}; 
		var acceptQuality = playData.accept_quality || [];
		var acceptDescription = playData.accept_description || [];
		for (var i = 0; i < acceptQuality.length; i++) {
			var qn = acceptQuality[i];
			var desc = acceptDescription[i] || qualityDescriptions[qn] || ('清晰度 ' + qn);
			list.push({
				quality: qn,
				qn: qn,
				desc: desc
			});
		}
		return list;
	};

	VideoResolver.getQualityList = function(data) {
		if (!data || !data.qualityList) return [];
		return data.qualityList;
	};

	VideoResolver.switchQuality = function(data, qn, cb) {
		if (!data || !data.bvid || !data.cid) {
			cb(null, '缺少必要的视频信息');
			return;
		}
		var newResult = {};
		VideoResolver._fetchPlayUrl({
			bvid: data.bvid,
			aid: data.aid,
			cid: data.cid,
			qn: qn,
			result: newResult,
			cb: function(newData, err) {
				if (newData && newData.videoUrl) {
					data.videoUrl = newData.videoUrl;
					data.videoUrls = newData.videoUrls || data.videoUrls;
					data.quality = newData.quality;
					data.currentQn = newData.currentQn;
					data.qualityList = newData.qualityList || data.qualityList;
					if (newData.audioUrl) data.audioUrl = newData.audioUrl;
					if (newData.isDash) data.isDash = newData.isDash;
					if (newData.dash) data.dash = newData.dash;
					if (newData.videoQualities) data.videoQualities = newData.videoQualities;
					if (newData.audioQualities) data.audioQualities = newData.audioQualities;
					if (newData.acceptQuality) data.acceptQuality = newData.acceptQuality;
					cb(data, null);
				} else {
					cb(null, err || '切换画质失败');
				}
			},
			useBackup: false
		});
	};

				VideoResolver.switchPage = function(data, index, cb) {
		if (!data || !data.pages || !data.pages[index]) { cb(null, '分P不存在'); return; }
		var page = data.pages[index];
		if (!page.cid) { cb(null, '该分P缺少 cid，无法切换'); return; }
		if (!data.bvid && !data.aid) { cb(null, '缺少必要的视频信息'); return; }
		if (String(page.cid) === String(data.cid)) { cb(data, null); return; }
		var newResult = {};
		VideoResolver._fetchPlayUrl({
			bvid: data.bvid,
			aid: data.aid,
			cid: page.cid,
			qn: data.currentQn || data.quality || 64,
			result: newResult,
			cb: function(newData, err) {
				if (newData && newData.videoUrl) {
					data.videoUrl = newData.videoUrl;
					data.videoUrls = newData.videoUrls || data.videoUrls;
					data.quality = newData.quality;
					data.currentQn = newData.currentQn;
					data.qualityList = newData.qualityList || data.qualityList;
					if (newData.audioUrl) data.audioUrl = newData.audioUrl;
					data.isDash = newData.isDash;
					data.dash = newData.dash;
					data.videoQualities = newData.videoQualities || data.videoQualities;
					data.audioQualities = newData.audioQualities || data.audioQualities;
					data.acceptQuality = newData.acceptQuality || data.acceptQuality;
					data.cid = page.cid;
					data.pageIndex = index;
										if (page.part) data.pagePart = page.part;
					if (page.duration) data.pageDuration = page.duration;
					cb(data, null);
				} else {
					cb(null, err || '切换分P失败');
				}
			},
			useBackup: false
		});
	};

	VideoResolver.batchResolve = function(urls, cb, progressCb) {
		var results = {};
		var errors = {};
		var total = urls.length;
		var completed = 0;
		var successCount = 0;
		var failedCount = 0;
		var index = 0;
		var concurrent = VideoResolver._maxConcurrent;

		if (total === 0) {
			cb({ results: results, errors: errors }, null);
			return;
		}

		var next = function() {
			if (index >= total) return;
			var currentIndex = index;
			index++;
			var url = urls[currentIndex];
			VideoResolver.resolve(url, function(data, err) {
				completed++;
				if (data) {
					results[url] = data;
					successCount++;
				} else {
					errors[url] = err;
					failedCount++;
				}
				if (progressCb) {
					progressCb(completed, total, successCount, failedCount);
				}
				if (completed >= total) {
					cb({ results: results, errors: errors }, null);
				} else {
					next();
				}
			});
		};

		for (var i = 0; i < Math.min(concurrent, total); i++) {
			next();
		}
	};

		return VideoResolver;
	})();
	var Plugins = (function () {
		'use strict';
		var Plugins = {};

	Plugins._id = function () {
		return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
	};

	Plugins.listRules = function () {
		return U.isArr(State.config.customRules) ? State.config.customRules.slice() : [];
	};

	Plugins.listParsers = function () {
		return U.isArr(State.config.parserPlugins) ? State.config.parserPlugins.slice() : [];
	};

	Plugins._ruleMatch = function (rule, host, url) {
		if (!rule || !rule.enabled || !rule.pattern) return false;
		try {
															if (rule.pattern === '*') return true;
			if (rule.type === 'host') {
				return host === rule.pattern || (host.length > rule.pattern.length && host.substr(host.length - rule.pattern.length - 1) === '.' + rule.pattern);
			}
			if (rule.type === 'url') {
				return url.indexOf(rule.pattern) !== -1;
			}
			if (rule.type === 'regex') {
				return new RegExp(rule.pattern, 'i').test(url);
			}
		} catch (e) { LOG.warn('规则匹配失败:', e); }
		return false;
	};

										Plugins._evalRules = function (host, url) {
		var rules = Plugins.listRules();
		var allowed = false, blocked = false;
		for (var i = 0; i < rules.length; i++) {
			var r = rules[i];
			if (!r.enabled) continue;
			if (!Plugins._ruleMatch(r, host, url)) continue;
			if (r.action === 'allow') allowed = true;
			else if (r.action === 'block') blocked = true;
		}
		return { allowed: allowed, blocked: blocked, pass: allowed ? true : !blocked };
	};

	Plugins.isUrlAllowed = function (url) {
		if (!url) return true;
		var host = '';
		try { host = new URL(url, location.href).hostname; } catch (e) {}
		return Plugins._evalRules(host, url).pass;
	};

	Plugins.shouldRunOnHost = function (host) {
		return Plugins._evalRules(host, '').pass;
	};

	Plugins.filterResources = function () {
		var keys = ['images', 'videos', 'audios', 'm3u8'];
		for (var i = 0; i < keys.length; i++) {
			var k = keys[i];
			if (!U.isArr(State[k])) continue;
			State[k] = State[k].filter(function (item) {
				var url = typeof item === 'string' ? item : (item && item.url ? item.url : '');
				return Plugins.isUrlAllowed(url);
			});
		}
		if (U.isArr(State.videoLinks)) {
			State.videoLinks = State.videoLinks.filter(function (item) {
				var url = typeof item === 'string' ? item : (item && item.url ? item.url : '');
				return Plugins.isUrlAllowed(url);
			});
		}
	};

	Plugins._getByPath = function (obj, path) {
		if (!path) return obj;
		var parts = String(path).split('.');
		var cur = obj;
		for (var i = 0; i < parts.length; i++) {
			if (cur == null) return undefined;
			cur = cur[parts[i]];
		}
		return cur;
	};

																														
		Plugins._interpolate = function (tpl, vars) {
		if (tpl == null) return '';
		return String(tpl).replace(/\{\{\s*([\w$.]+)\s*\}\}/g, function (m, key) {
			var v = vars ? vars[key] : undefined;
			if (v === undefined || v === null) return '';
			try { return String(v); } catch (e) { return ''; }
		});
	};

		Plugins._captureVars = function (pattern, pageUrl) {
		var vars = { url: encodeURIComponent(pageUrl || ''), page: pageUrl || '' };
		if (!pattern) return vars;
		try {
			var m = new RegExp(pattern, 'i').exec(pageUrl || '');
			if (!m) return vars;
			for (var i = 1; i < m.length; i++) vars['g' + i] = m[i] == null ? '' : String(m[i]);
			if (m.groups) {
				for (var k in m.groups) {
					if (Object.prototype.hasOwnProperty.call(m.groups, k)) vars[k] = m.groups[k] == null ? '' : String(m.groups[k]);
				}
			}
		} catch (e) { LOG.warn('[Plugins] matchPattern 无效:', e.message); }
		return vars;
	};

				Plugins._runSteps = function (plugin, pageUrl, cb) {
		var steps = (U.isArr(plugin.steps) && plugin.steps.length) ? plugin.steps : [{
			url: plugin.apiUrl, method: plugin.method, headers: plugin.headers, dataPath: plugin.dataPath
		}];
		var vars = Plugins._captureVars(plugin.matchPattern, pageUrl);
		var ctx = { src: null, raw: null, step: null, vars: vars };
		var idx = 0;
		var finished = false;

		function fail(msg) { if (finished) return; finished = true; cb(msg, null); }

		function next() {
			if (idx >= steps.length) { if (finished) return; finished = true; cb(null, ctx); return; }
			var st = steps[idx] || {};
			var rawUrl = Plugins._interpolate(st.url || '', vars);
			if (!rawUrl) { fail('第 ' + (idx + 1) + ' 步缺少 url'); return; }
			if (typeof SEC !== 'undefined' && SEC.isSafeUrl && !SEC.isSafeUrl(rawUrl)) {
				fail('第 ' + (idx + 1) + ' 步 URL 不被允许（' + rawUrl.slice(0, 60) + '）'); return;
			}
			var method = String(st.method || plugin.method || 'GET').toUpperCase();
			var req = {
				method: method,
				url: rawUrl,
				headers: st.headers || plugin.headers || {},
				timeout: st.timeout || 15000,
				onload: function (res) {
					if (finished) return;
					if (res.status < 200 || res.status >= 300) { fail('第 ' + (idx + 1) + ' 步 HTTP ' + res.status); return; }
					var data = U.safeJson(res.responseText, null);
					if (!data) { fail('第 ' + (idx + 1) + ' 步返回非 JSON'); return; }
					ctx.raw = data;
					if (st.save && typeof st.save === 'object') {
						for (var k in st.save) {
							if (!Object.prototype.hasOwnProperty.call(st.save, k)) continue;
							var v = Plugins._getByPath(data, st.save[k]);
							if (v !== undefined && v !== null) vars[k] = v;
						}
					}
					var node = st.dataPath ? Plugins._getByPath(data, st.dataPath) : data;
					ctx.src = (node === undefined || node === null) ? data : node;
					ctx.step = st;
					idx++;
					next();
				},
				onerror: function () { fail('第 ' + (idx + 1) + ' 步请求失败'); },
				ontimeout: function () { fail('第 ' + (idx + 1) + ' 步请求超时'); }
			};
			if (method === 'POST') req.data = Plugins._interpolate(st.body || plugin.body || '', vars);
			try {
				if (typeof GM_xmlhttpRequest !== 'function') { fail('需要 Tampermonkey 环境'); return; }
				GM_xmlhttpRequest(req);
			} catch (e) { fail('第 ' + (idx + 1) + ' 步调用异常: ' + e.message); }
		}
		next();
	};

		Plugins._extractSources = function (src, step, plugin) {
		var sp = (step && step.sources) || {};
		var vPath = sp.videoPath || 'video';
		var aPath = sp.audioPath || 'audio';
		var idKey = sp.idPath || 'id';
		var pickUrl = function (it) {
			if (typeof it === 'string') return it;
			return (it && (it.baseUrl || it.base_url || it.url || it.src)) || '';
		};
		var vList = Plugins._getByPath(src, vPath);
		var aList = Plugins._getByPath(src, aPath);
		if (!Array.isArray(vList)) vList = vList ? [vList] : [];
		if (!Array.isArray(aList)) aList = aList ? [aList] : [];
		if (!vList.length) return null;

		var byIdDesc = function (a, b) { return (Number(b[idKey]) || 0) - (Number(a[idKey]) || 0); };
		var sorted = vList.slice().sort(byIdDesc);
		var aSorted = aList.slice().sort(byIdDesc);
		var bestAudio = aSorted.length ? pickUrl(aSorted[0]) : '';

		var videoUrls = [], qualityList = [];
		for (var i = 0; i < sorted.length; i++) {
			var u = pickUrl(sorted[i]);
			if (!u) continue;
			videoUrls.push(u);
			qualityList.push({
				url: u,
				quality: sorted[i].label || sorted[i].quality || String(sorted[i][idKey] || ('清晰度 ' + (i + 1))),
				id: sorted[i][idKey], type: 'video'
			});
		}
		if (!videoUrls.length) return null;
		return {
			videoUrl: videoUrls[0], videoUrls: videoUrls, qualityList: qualityList,
			audioUrl: bestAudio, isDash: !!(bestAudio && bestAudio !== videoUrls[0])
		};
	};

		Plugins._shapeResult = function (src, plugin) {
		var out = {
			title: '', cover: '', videoUrl: '', videoUrls: [], qualityList: [],
			siteName: plugin.name || '', siteIcon: MS_CONFIG.ICONS.plug,
			duration: 0, author: '', isDash: false, audioUrl: ''
		};
		if (src == null) return out;
		if (typeof src === 'string') {
			out.videoUrl = src; out.videoUrls = [src];
			out.qualityList = [{ url: src, quality: '默认', type: 'video' }];
			return out;
		}
		out.title = src.title || src.name || '';
		out.cover = src.cover || src.thumb || src.pic || '';
		out.duration = src.duration || 0;
		out.author = src.author || src.uploader || '';

		var videos = src.videos || src.video || src.data || [];
		if (!Array.isArray(videos)) videos = [videos];
		var videoUrls = [], qualityList = [];
		for (var i = 0; i < videos.length; i++) {
			var v = videos[i];
			var vurl = (typeof v === 'string' ? v : (v && (v.url || v.link || v.src || v.baseUrl || v.base_url)));
			if (!vurl) continue;
			videoUrls.push(vurl);
			qualityList.push({
				url: vurl,
				quality: (v && (v.quality || v.name || v.label)) || ('清晰度 ' + (i + 1)),
				id: v && v.id, type: 'video'
			});
		}
		if (!videoUrls.length && src.url) {
			videoUrls.push(src.url);
			qualityList.push({ url: src.url, quality: '默认', type: 'video' });
		}
		out.videoUrls = videoUrls;
		out.qualityList = qualityList;
		out.videoUrl = videoUrls[0] || '';
		return out;
	};

		Plugins.validateParser = function (p) {
		var errs = [];
		p = p || {};
		if (!p.name || !String(p.name).trim()) errs.push('名称不能为空');
		if (!p.matchPattern || !String(p.matchPattern).trim()) errs.push('匹配规则不能为空');
		else {
			try { new RegExp(p.matchPattern); }
			catch (e) { errs.push('匹配规则不是合法正则: ' + e.message); }
		}
		var hasSteps = U.isArr(p.steps) && p.steps.length > 0;
		if (!hasSteps && !p.apiUrl) errs.push('单步解析器必须填 apiUrl（或用 steps 配置多步）');
		if (hasSteps) {
			if (p.steps.length > 8) errs.push('步骤最多 8 步');
			for (var i = 0; i < p.steps.length; i++) {
				var st = p.steps[i] || {};
				if (!st.url) errs.push('第 ' + (i + 1) + ' 步缺少 url');
				if (st.method && ['GET', 'POST'].indexOf(String(st.method).toUpperCase()) === -1) {
					errs.push('第 ' + (i + 1) + ' 步 method 只支持 GET / POST');
				}
				if (st.save && typeof st.save !== 'object') errs.push('第 ' + (i + 1) + ' 步 save 必须是对象');
			}
		}
		if (p.apiUrl && /\{\{\s*[\w$.]+\s*\}\}/.test(String(p.apiUrl)) && !hasSteps) {
						var unknown = [];
			String(p.apiUrl).replace(/\{\{\s*([\w$.]+)\s*\}\}/g, function (m, k) {
				if (k !== 'url' && k !== 'page' && !/^g\d+$/.test(k)) unknown.push(k);
				return m;
			});
			if (unknown.length) {
				errs.push('单步模式的 apiUrl 用不了变量 ' + unknown.join(', ')
					+ '（这些来自 matchPattern 命名组或前序步骤的 save，需要改成 steps 多步）');
			}
		}
		return errs;
	};

		Plugins.PARSER_TEMPLATES = [
		{
			key: 'bilibili-two-step',
			label: 'B 站（两步：view → playurl）',
			parser: {
				name: '哔哩哔哩（示例）',
				matchPattern: 'bilibili\\.com/video/(?<bvid>BV[0-9A-Za-z]+)',
				enabled: false,
				steps: [
					{
						url: 'https://api.bilibili.com/x/web-interface/view?bvid={{bvid}}',
						headers: { 'Referer': 'https://www.bilibili.com/', 'User-Agent': 'Mozilla/5.0' },
						save: { cid: 'data.cid', title: 'data.title', cover: 'data.pic' }
					},
					{
						url: 'https://api.bilibili.com/x/player/playurl?bvid={{bvid}}&cid={{cid}}&fnval=16&fourk=1',
						headers: { 'Referer': 'https://www.bilibili.com/', 'User-Agent': 'Mozilla/5.0' },
						dataPath: 'data',
						sources: { videoPath: 'dash.video', audioPath: 'dash.audio', videoUrlPath: 'baseUrl', idPath: 'id' }
					}
				]
			}
		},
		{
			key: 'single-step',
			label: '单步 HTTP + JSON 路径',
			parser: {
				name: '通用接口',
				matchPattern: '',
				apiUrl: 'https://example.com/api?url={{url}}',
				dataPath: 'data',
				enabled: false,
				steps: []
			}
		}
	];

	Plugins.templateParser = function (key) {
		var tpls = Plugins.PARSER_TEMPLATES;
		for (var i = 0; i < tpls.length; i++) {
			if (tpls[i].key === key) {
				var clone = JSON.parse(JSON.stringify(tpls[i].parser));
				clone.id = Plugins._id();
				return clone;
			}
		}
		return null;
	};

		Plugins._callParserApi = function (plugin, pageUrl, cb) {
		try {
			Plugins._runSteps(plugin, pageUrl, function (err, ctx) {
				if (err) { cb(null, err); return; }
				try {
					var out = Plugins._shapeResult(ctx.src, plugin);
										var hasSources = ctx.step && ctx.step.sources && Object.keys(ctx.step.sources).length;
					if (hasSources) {
						var dash = Plugins._extractSources(ctx.src, ctx.step, plugin);
						if (dash) {
							out.videoUrl = dash.videoUrl;
							out.videoUrls = dash.videoUrls;
							out.qualityList = dash.qualityList;
							out.audioUrl = dash.audioUrl;
							out.isDash = dash.isDash;
						}
					}
										if (ctx.vars) {
						if (!out.title && ctx.vars.title) out.title = String(ctx.vars.title);
						if (!out.cover && ctx.vars.cover) out.cover = String(ctx.vars.cover);
					}
					if (!out.videoUrl && !out.videoUrls.length) { cb(null, '插件未解析出video地址'); return; }
					cb(out, null);
				} catch (e2) {
					cb(null, '插件数据解析失败: ' + e2.message);
				}
			});
		} catch (e) {
			cb(null, '插件调用异常: ' + e.message);
		}
	};

	Plugins.tryCustomParser = function (url, cb) {
		var plugins = Plugins.listParsers();
		for (var i = 0; i < plugins.length; i++) {
			var p = plugins[i];
						var hasSteps = U.isArr(p.steps) && p.steps.length > 0;
			if (!p.enabled || !p.matchPattern || (!p.apiUrl && !hasSteps)) continue;
			try {
				if (new RegExp(p.matchPattern, 'i').test(url)) {
					Plugins._callParserApi(p, url, cb);
					return true;
				}
			} catch (e) { LOG.warn('解析器插件匹配失败:', e); }
		}
		return false;
	};

	Plugins.addRule = function (rule) {
		rule = rule || {};
		rule.id = rule.id || Plugins._id();
		rule.name = rule.name || '';
		rule.pattern = rule.pattern || '';
		rule.type = ['host', 'url', 'regex'].indexOf(rule.type) !== -1 ? rule.type : 'host';
		rule.action = ['allow', 'block'].indexOf(rule.action) !== -1 ? rule.action : 'block';
		rule.enabled = typeof rule.enabled === 'boolean' ? rule.enabled : true;
		if (!U.isArr(State.config.customRules)) State.config.customRules = [];
		State.config.customRules.push(rule);
		State.save();
		return rule;
	};

	Plugins.updateRule = function (id, updates) {
		var rules = State.config.customRules || [];
		for (var i = 0; i < rules.length; i++) {
			if (rules[i].id === id) {
				for (var k in updates) if (updates.hasOwnProperty(k)) rules[i][k] = updates[k];
				State.save();
				return true;
			}
		}
		return false;
	};

	Plugins.removeRule = function (id) {
		State.config.customRules = (State.config.customRules || []).filter(function (r) { return r.id !== id; });
		State.save();
	};

	Plugins.addParser = function (parser) {
		parser = parser || {};
		parser.id = parser.id || Plugins._id();
		parser.name = parser.name || '';
		parser.matchPattern = parser.matchPattern || '';
		parser.apiUrl = parser.apiUrl || '';
		parser.method = ['GET', 'POST'].indexOf((parser.method || '').toUpperCase()) !== -1 ? parser.method.toUpperCase() : 'GET';
		parser.headers = typeof parser.headers === 'object' && parser.headers !== null ? parser.headers : {};
		parser.dataPath = parser.dataPath || '';
				if (!U.isArr(parser.steps)) parser.steps = [];
		parser.steps = parser.steps.filter(function (s) { return s && typeof s === 'object'; }).slice(0, 8);
		parser.enabled = typeof parser.enabled === 'boolean' ? parser.enabled : true;
		if (!U.isArr(State.config.parserPlugins)) State.config.parserPlugins = [];
		State.config.parserPlugins.push(parser);
		State.save();
		return parser;
	};

	Plugins.updateParser = function (id, updates) {
		var plugins = State.config.parserPlugins || [];
		for (var i = 0; i < plugins.length; i++) {
			if (plugins[i].id === id) {
				for (var k in updates) if (updates.hasOwnProperty(k)) plugins[i][k] = updates[k];
				State.save();
				return true;
			}
		}
		return false;
	};

	Plugins.removeParser = function (id) {
		State.config.parserPlugins = (State.config.parserPlugins || []).filter(function (p) { return p.id !== id; });
		State.save();
	};

		return Plugins;
	})();
	var AutoUpdater = (function () {
		'use strict';
		var AutoUpdater = {};
	AutoUpdater._lastCheckKey = '_ms_last_update_check';
	AutoUpdater._skipVersionKey = '_ms_skip_version';

	AutoUpdater._semverCompare = function (v1, v2) {
		var parse = function (v) {
			v = String(v == null ? '' : v)
				.replace(/^v/i, '')
				.replace(/-beta.*/i, '')
				.replace(/-alpha.*/i, '')
				.replace(/-rc.*/i, '');
												var parts = v.split('.');
			var out = [];
			for (var i = 0; i < 3; i++) {
				var seg = String(parts[i] == null ? '' : parts[i]).replace(/[^0-9].*$/, '');
				var n = Number(seg);
				out.push(isFinite(n) && n > 0 ? Math.floor(n) : 0);
			}
			return out;
		};
		var a = parse(v1), b = parse(v2);
		for (var i = 0; i < 3; i++) {
			if (a[i] > b[i]) return 1;
			if (a[i] < b[i]) return -1;
		}
		return 0;
	};

	AutoUpdater._isPrerelease = function (tag, data) {
		if (data && data.prerelease === true) return true;
		return /beta|alpha|rc|pre/i.test(tag);
	};

	AutoUpdater._getCache = function () {
		try {
			var raw = GM_getValue(AutoUpdater._lastCheckKey, '');
			if (!raw) return null;
									var obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
			return obj && typeof obj === 'object' ? obj : null;
		} catch (e) { return null; }
	};

	AutoUpdater._setCache = function (data) {
		try {
			GM_setValue(AutoUpdater._lastCheckKey, JSON.stringify(data));
		} catch (e) {}
	};

	AutoUpdater._getSkippedVersion = function () {
		try { return GM_getValue(AutoUpdater._skipVersionKey, ''); } catch (e) { return ''; }
	};

	AutoUpdater._setSkippedVersion = function (v) {
		try { GM_setValue(AutoUpdater._skipVersionKey, v); } catch (e) {}
	};

	AutoUpdater.fetchLatestVersion = function (repo) {
		return new Promise(function (resolve, reject) {
			try {
				var url = 'https://api.github.com/repos/' + repo + '/releases/latest';
				GM_xmlhttpRequest({
					method: 'GET',
					url: url,
					timeout: 10000,
					onload: function (resp) {
						try {
							if (resp.status !== 200) {
								reject(new Error('HTTP ' + resp.status));
								return;
							}
							var data = JSON.parse(resp.responseText);
							resolve({
								version: data.tag_name || '',
								name: data.name || '',
								isPrerelease: AutoUpdater._isPrerelease(data.tag_name, data),
								changelog: data.body || '',
								htmlUrl: data.html_url || '',
								publishedAt: data.published_at || '',
								assets: data.assets || [],
							});
						} catch (e) { reject(e); }
					},
					onerror: function () { reject(new Error('network error')); },
					ontimeout: function () { reject(new Error('timeout')); },
				});
			} catch (e) { reject(e); }
		});
	};

	AutoUpdater.compareVersions = function (v1, v2) {
		return AutoUpdater._semverCompare(v1, v2);
	};

	AutoUpdater.showUpdatePopup = function (info, options) {
		try {
			var c = UI.colors();
			var isMobile = window.innerWidth < 768;
			var opts = options || {};

			var overlay = document.createElement('div');
			overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:2147483651;padding:20px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);';

			var modal = document.createElement('div');
			modal.style.cssText = 'max-width:min(92vw,520px);width:100%;background:' + c.bg + ';color:' + c.txt + ';border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,.5);overflow:hidden;animation:msfade .25s ease-out;';

			var header = document.createElement('div');
			header.style.cssText = 'padding:20px 24px 16px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;position:relative;';
			header.innerHTML =
				'<div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">' +
					'<span style="font-size:24px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a3 3 0 1 0-6 0 3 3 0 0 0 6 0z"></path><path d="M6 15l2.5-2.5"></path><path d="M16.5 11.5L22 16"></path><path d="M12 18v4"></path><path d="M2 22l4-10 5.5 5.5L22 2"></path></svg></span>' +
					'<span style="font-size:18px;font-weight:700;">发现新版本</span>' +
				'</div>' +
												'<div style="font-size:13px;opacity:.9;">' + LANG.t('appTitle') + ' v' + info.version.replace(/^v/i, '') + '</div>';

			var closeBtn = document.createElement('button');
			closeBtn.textContent = '×';
			closeBtn.style.cssText = 'position:absolute;top:12px;right:12px;width:32px;height:32px;border:none;border-radius:50%;background:rgba(255,255,255,.15);color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;';
			closeBtn.onclick = function () { try { overlay.remove(); } catch(e) {} };
			header.appendChild(closeBtn);
			modal.appendChild(header);

			var body = document.createElement('div');
			body.style.cssText = 'padding:18px 24px 24px;';

			var changelogTitle = document.createElement('div');
			changelogTitle.style.cssText = 'font-size:14px;font-weight:600;margin-bottom:10px;color:' + c.txt + ';';
			changelogTitle.textContent = '更新内容';
			body.appendChild(changelogTitle);

			var changelogBox = document.createElement('div');
			changelogBox.style.cssText = 'background:' + c.bg2 + ';border-radius:10px;padding:12px 14px;font-size:13px;color:' + c.sub + ';line-height:1.7;max-height:240px;overflow-y:auto;margin-bottom:18px;';
			var clText = info.changelog
				.replace(/^#+\s*/gm, '')
				.replace(/\*\*/g, '')
				.replace(/```[\s\S]*?```/g, '')
				.replace(/<[^>]+>/g, '')
				.substring(0, 600);
			changelogBox.textContent = clText || '暂无更新说明';
			body.appendChild(changelogBox);

			var btnWrap = document.createElement('div');
			btnWrap.style.cssText = 'display:flex;gap:10px;';

															var dlBtn = document.createElement('button');
			dlBtn.textContent = '一键更新';
			dlBtn.style.cssText = 'flex:1;padding:12px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:14px;font-weight:600;cursor:pointer;';
			dlBtn.onclick = function () {
				try {
																																																																						var url = MS_CONFIG.UPDATE_URL;
					var openedVia = '';
					if (typeof GM_openInTab === 'function') {
						try {
							GM_openInTab(url, { active: true, insert: true, setParent: true });
							openedVia = 'gm';
						} catch (eOpen) { openedVia = ''; }
					}
					if (!openedVia) {
						try {
																					var w = window.open(url, '_blank');
							if (w) openedVia = 'win';
						} catch (eWin) { openedVia = ''; }
					}
					if (openedVia === 'gm') {
						toast(LANG.t('updateOpenHint'), '#10b981');
					} else if (openedVia === 'win') {
												toast(LANG.t('updateManualHint'), '#f59e0b');
					} else {
						try { copyText(url); } catch (eCopy) {}
						toast(LANG.t('updateOpenFail'), '#f59e0b');
					}
					overlay.remove();
				} catch (e) {}
			};
			btnWrap.appendChild(dlBtn);

			var skipBtn = document.createElement('button');
			skipBtn.textContent = '跳过此版本';
			skipBtn.style.cssText = 'padding:12px 16px;border:1px solid ' + c.border + ';border-radius:10px;background:transparent;color:' + c.sub + ';font-size:13px;cursor:pointer;';
			skipBtn.onclick = function () {
				try {
					AutoUpdater._setSkippedVersion(info.version);
					overlay.remove();
				} catch (e) {}
			};
			btnWrap.appendChild(skipBtn);

			var laterBtn = document.createElement('button');
			laterBtn.textContent = '暂不更新';
			laterBtn.style.cssText = 'padding:12px 16px;border:1px solid ' + c.border + ';border-radius:10px;background:transparent;color:' + c.txt + ';font-size:13px;cursor:pointer;';
			laterBtn.onclick = function () { try { overlay.remove(); } catch(e) {} };
			btnWrap.appendChild(laterBtn);

			body.appendChild(btnWrap);

						var relLink = document.createElement('a');
			relLink.href = info.htmlUrl || 'https://github.com/zhjich123/zhjich123/releases';
			relLink.target = '_blank';
			relLink.rel = 'noopener noreferrer';
			relLink.textContent = '查看 Release 页面';
			relLink.style.cssText = 'display:block;text-align:center;margin-top:10px;font-size:12px;color:' + c.sub + ';text-decoration:underline;opacity:.85;';
			body.appendChild(relLink);

															var dlFileLink = document.createElement('div');
			dlFileLink.textContent = LANG.t('updateDownloadScript');
			dlFileLink.style.cssText = 'display:block;text-align:center;margin-top:6px;font-size:12px;color:' + c.sub
				+ ';text-decoration:underline;opacity:.75;cursor:pointer;';
			dlFileLink.onclick = function () {
				try {
					if (typeof GM_download === 'function') {
						GM_download({ url: MS_CONFIG.UPDATE_URL, name: 'media-sniffer.user.js' });
						toast(LANG.t('updateDownloading'), '#10b981');
					} else {
						try { copyText(MS_CONFIG.UPDATE_URL); } catch (eCopy) {}
						toast(LANG.t('updateOpenFail'), '#f59e0b');
					}
				} catch (e) {
					try { copyText(MS_CONFIG.UPDATE_URL); } catch (eCopy2) {}
					toast(LANG.t('updateOpenFail'), '#f59e0b');
				}
			};
			body.appendChild(dlFileLink);

			modal.appendChild(body);
			overlay.appendChild(modal);

			overlay.addEventListener('click', function (e) { if (e.target === overlay) try { overlay.remove(); } catch(e) {} });
			document.body.appendChild(overlay);

			var escHandler = function(e) {
				if (e.key === 'Escape') { try { overlay.remove(); document.removeEventListener('keydown', escHandler); } catch(err) {} }
			};
			document.addEventListener('keydown', escHandler);
		} catch (e) {
			LOG.warn('AutoUpdater show popup error:', e);
		}
	};

	AutoUpdater._checkRaw = function (options) {
		return new Promise(function (resolve) {
			try {
				var opts = options || {};
				var currentVersion = opts.currentVersion || U.VERSION;
				var repo = opts.repo || 'zhjich123/zhjich123';
				var intervalHours = opts.checkIntervalHours != null ? opts.checkIntervalHours : 24;
				var popupOpts = opts.popup || {};

				var cache = AutoUpdater._getCache();
				var now = Date.now();
				var intervalMs = intervalHours * 60 * 60 * 1000;

				if (cache && cache.checkedAt && (now - cache.checkedAt < intervalMs) && !opts.force) {
					resolve({ status: 'cached', latestVersion: cache.latestVersion });
					return;
				}

				AutoUpdater.fetchLatestVersion(repo).then(function (info) {
					try {
						var skipped = AutoUpdater._getSkippedVersion();
						var hasUpdate = AutoUpdater.compareVersions(currentVersion, info.version) < 0;
						var isStable = !info.isPrerelease;

						AutoUpdater._setCache({
							checkedAt: now,
							latestVersion: info.version,
							isPrerelease: info.isPrerelease,
						});

						if (hasUpdate && isStable && skipped !== info.version) {
							AutoUpdater.showUpdatePopup(info, popupOpts);
							resolve({ status: 'update-available', latestVersion: info.version, info: info });
						} else if (hasUpdate && info.isPrerelease) {
							resolve({ status: 'prerelease-skipped', latestVersion: info.version });
						} else if (skipped === info.version) {
							resolve({ status: 'skipped-by-user', latestVersion: info.version });
						} else {
							resolve({ status: 'up-to-date', latestVersion: info.version });
						}
					} catch (e) {
						resolve({ status: 'error', error: e.message });
					}
				}).catch(function (err) {
					LOG.warn('AutoUpdater check failed:', err);
					resolve({ status: 'error', error: err.message });
				});
			} catch (e) {
				LOG.warn('AutoUpdater check error:', e);
				resolve({ status: 'error', error: e.message });
			}
		});
	};

			AutoUpdater._inflight = null;
	AutoUpdater._inflightAt = 0;
	AutoUpdater.check = function (options) {
		var opts = options || {};
		if (!opts.force && AutoUpdater._inflight && (U.now() - AutoUpdater._inflightAt) < 30000) {
			return AutoUpdater._inflight;
		}
		var p = AutoUpdater._checkRaw(options);
		AutoUpdater._inflight = p;
		AutoUpdater._inflightAt = U.now();
		return p;
	};

	AutoUpdater.checkNow = function (options) {
		var opts = options || {};
		opts.force = true;
		return AutoUpdater.check(opts);
	};

		return AutoUpdater;
	})();
	var VideoPreview = (function () {
		'use strict';
		var VideoLinkPreview = {};
	VideoLinkPreview._cache = {};

		VideoLinkPreview.resolve = function(url, cb) {
		if (cb) {
			Resolver.resolve(url, function(data, err) {
				if (data) {
					VideoLinkPreview._cache[url] = data;
					cb(data, null);
				} else {
					cb(null, err || '解析失败');
				}
			});
		} else {
			return new Promise(function(resolve, reject) {
				VideoLinkPreview.resolve(url, function(data, err) {
					if (data) resolve(data);
					else reject(err ? new Error(err) : new Error('解析失败'));
				});
			});
		}
	};

		VideoLinkPreview.preview = function(url) {
		VideoLinkPreview.resolve(url, function(data, err) {
			if (err) {
				VideoLinkPreview.showModal({
					_error: err,
					_url: url,
					title: '解析失败',
					siteIcon: '!',
					siteName: ''
				});
				return;
			}
			data._url = url;
			VideoLinkPreview.showModal(data);
		});
	};

	function _formatNumber(num) {
		if (num === undefined || num === null || num === '') return '-';
		num = Number(num) || 0;
		if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
		if (num >= 10000) return (num / 10000).toFixed(1) + '万';
		return String(num);
	}

	function _formatPubDate(timestamp) {
		if (!timestamp) return '';
		var d = new Date(timestamp * 1000);
		var now = new Date();
		var diff = (now - d) / 1000;
		if (diff < 60) return '刚刚';
		if (diff < 3600) return Math.floor(diff / 60) + '分钟前';
		if (diff < 86400) return Math.floor(diff / 3600) + '小时前';
		if (diff < 2592000) return Math.floor(diff / 86400) + '天前';
		return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
	}

		VideoLinkPreview.showModal = function(data) {
		var c = UI.colors();
		var isMobile = window.innerWidth < 768;

		var overlay = document.createElement('div');
		overlay.id = '_ms_vlp_overlay';
		overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:2147483647;display:flex;align-items:' + (isMobile ? 'flex-end' : 'center') + ';justify-content:center;padding:' + (isMobile ? '0' : '20px') + ';';

		var width = isMobile ? window.innerWidth : Math.min(720, window.innerWidth - 40);
		var modal = document.createElement('div');
		modal.id = '_ms_vlp_modal';
		modal.style.cssText = 'background:' + c.bg + ';border-radius:' + (isMobile ? '16px 16px 0 0' : '16px') + ';max-width:' + width + 'px;width:100%;max-height:' + (isMobile ? '92vh' : '90vh') + ';overflow-y:auto;box-shadow:0 25px 80px rgba(0,0,0,0.5);transition:transform 0.3s ease, opacity 0.3s ease;' + (isMobile ? 'padding-bottom:env(safe-area-inset-bottom);' : '');

		var siteIcon = data.siteIcon || MS_CONFIG.ICONS.stream;
		var siteName = data.siteName || '';
		var title = data.title || '未知标题';
		var owner = data.owner || '';
		var ownerFace = data.ownerFace || '';
		var cover = data.cover || '';
		var videoUrl = data.videoUrl || (data.videoUrls && data.videoUrls[0]) || '';
		var audioUrl = data.audioUrl || '';
		var currentVideoUrl = videoUrl;
		var qualityList = data.qualityList || [];
		var videoQualities = data.videoQualities || [];
		var isDash = data.isDash || false;
		var pages = data.pages || [];
		var currentPageIndex = 0;
		var resolveError = data._error || '';
		var originalUrl = data._url || '';

		function buildQualityOptions() {
			if (!qualityList || qualityList.length === 0) return '';
			var options = '';
			for (var i = 0; i < qualityList.length; i++) {
				var q = qualityList[i];
				var selected = (q.url === currentVideoUrl || (data.videoUrls && data.videoUrls[i] === currentVideoUrl)) ? 'selected' : '';
								options += '<option value="' + i + '" ' + selected + '>' + SEC.escapeHtml(q.label || ('清晰度 ' + i)) + '</option>';
			}
			return options;
		}

		function buildStatsHtml() {
			var stats = [];
			if (data.viewCount !== undefined) stats.push('<span title="播放量"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="8 5 8 19 19 12 8 5"></polygon></svg> ' + _formatNumber(data.viewCount) + '</span>');
			if (data.likeCount !== undefined) stats.push('<span title="点赞"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg> ' + _formatNumber(data.likeCount) + '</span>');
			if (data.coinCount !== undefined) stats.push('<span title="投币"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="6" x2="12" y2="12"></line><path d="M12 16h.01"></path></svg> ' + _formatNumber(data.coinCount) + '</span>');
			if (data.favoriteCount !== undefined) stats.push('<span title="收藏"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> ' + _formatNumber(data.favoriteCount) + '</span>');
			if (data.replyCount !== undefined) stats.push('<span title="评论"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> ' + _formatNumber(data.replyCount) + '</span>');
			if (stats.length === 0) return '';
			return '<div style="display:flex;flex-wrap:wrap;gap:12px;font-size:12px;color:' + c.sub + ';margin-bottom:10px;">' + stats.join('') + '</div>';
		}

		function buildUploaderHtml() {
			var parts = [];
			if (ownerFace) {
								parts.push('<img src="' + SEC.escapeAttr(ownerFace) + '" alt="" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">');
			}
			if (owner) {
				parts.push('<span style="font-size:13px;color:' + c.txt + ';font-weight:500;">' + SEC.escapeHtml(owner) + '</span>');
			}
			if (data.pubdate) {
				parts.push('<span style="font-size:11px;color:' + c.sub + ';"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ' + _formatPubDate(data.pubdate) + '</span>');
			}
			if (parts.length === 0) return '';
			return '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-top:1px solid ' + c.border + ';margin-top:8px;">' + parts.join('') + '</div>';
		}

		function buildVideoInfoHtml() {
			var rows = [];
			if (data.bvid) {
				rows.push('<span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg> BV号: <code style="background:' + c.bg + ';padding:2px 6px;border-radius:4px;">' + SEC.escapeHtml(data.bvid) + '</code></span>');
			}
			if (data.duration) {
				rows.push('<span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> 时长: ' + Math.floor(data.duration / 60) + ':' + String(data.duration % 60).padStart(2, '0') + '</span>');
			}
			if (rows.length === 0) return '';
			return '<div style="background:' + c.bg2 + ';border-radius:10px;padding:12px 16px;font-size:12px;color:' + c.sub + ';line-height:1.8;">' +
				'<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">' + rows.join('') + '</div>' +
			'</div>';
		}

		function buildQualitySelectorHtml() {
			if (!qualityList || qualityList.length === 0) return '';
			return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">' +
				'<span style="font-size:12px;color:' + c.sub + ';">画质:</span>' +
				'<select id="_ms_vlp_quality" style="padding:6px 10px;border:1px solid ' + c.border + ';border-radius:8px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;cursor:pointer;">' +
					buildQualityOptions() +
				'</select>' +
				(isDash ? '<span style="font-size:11px;color:' + c.sub + ';">（DASH格式）</span>' : '') +
			'</div>';
		}

				function buildPageSelectorHtml() {
			if (!pages || pages.length <= 1) return '';
			var opts = '';
			for (var i = 0; i < pages.length; i++) {
				var pt = pages[i] || {};
				var label = 'P' + (i + 1) + (pt.part ? ' ' + pt.part : '');
				if (label.length > 40) label = label.substring(0, 38) + '…';
				opts += '<option value="' + i + '"' + (i === currentPageIndex ? ' selected' : '') + '>' + SEC.escapeHtml(label) + '</option>';
			}
			return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">' +
				'<span style="font-size:12px;color:' + c.sub + ';">分P:</span>' +
				'<select id="_ms_vlp_page" style="max-width:70%;padding:6px 10px;border:1px solid ' + c.border + ';border-radius:8px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;cursor:pointer;">' + opts + '</select>' +
				'<span style="font-size:11px;color:' + c.sub + ';">共' + pages.length + 'P</span>' +
			'</div>';
		}

		function buildErrorHtml() {
			if (!resolveError) return '';
						return '<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px;margin-bottom:16px;text-align:center;">' +
				'<div style="font-size:32px;margin-bottom:8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>' +
				'<div style="font-size:14px;color:#dc2626;font-weight:500;margin-bottom:4px;">解析失败</div>' +
				'<div style="font-size:12px;color:#ef4444;margin-bottom:12px;">' + SEC.escapeHtml(resolveError) + '</div>' +
				(originalUrl ? '<button id="_ms_vlp_retry" style="padding:8px 20px;border:none;border-radius:8px;background:#ef4444;color:#fff;font-size:13px;font-weight:500;cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg> 重试</button>' : '') +
			'</div>';
		}

		modal.innerHTML =
			'<div style="position:sticky;top:0;background:' + c.bg + ';z-index:10;">' +
			(isMobile ? '<div id="_ms_vlp_drag_handle" style="padding:12px 0 4px;display:flex;justify-content:center;cursor:grab;touch-action:none;">' +
				'<div style="width:40px;height:5px;border-radius:3px;background:' + c.bg3 + ';"></div>' +
				'</div>' : '') +
			'<div style="padding:' + (isMobile ? '0 16px 12px' : '16px 20px') + ';border-bottom:1px solid ' + c.border + ';display:flex;align-items:center;justify-content:space-between;">' +
				'<div style="display:flex;align-items:center;gap:8px;font-size:' + (isMobile ? '15px' : '16px') + ';font-weight:600;color:' + c.txt + ';">' +
					'<span style="font-size:20px;">' + siteIcon + '</span>' +
					'<span>视频预览</span>' +
					(siteName ? '<span style="font-size:12px;color:' + c.sub + ';">— ' + SEC.escapeHtml(siteName) + '</span>' : '') +
				'</div>' +
				'<button id="_ms_vlp_close" style="width:40px;height:40px;border:none;border-radius:10px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;flex-shrink:0;">×</button>' +
			'</div>' +
			'</div>' +

			'<div style="padding:' + (isMobile ? '12px 14px' : '20px') + ';">' +
				buildErrorHtml() +

								'<div style="margin-bottom:12px;">' +
					'<h2 style="margin:0 0 8px;font-size:' + (isMobile ? '16px' : '18px') + ';color:' + c.txt + ';line-height:1.4;">' + SEC.escapeHtml(title) + '</h2>' +
					buildStatsHtml() +
				'</div>' +

								'<div id="_ms_vlp_player" style="background:#000;border-radius:12px;overflow:hidden;margin-bottom:12px;position:relative;touch-action:manipulation;">' +
					(cover ? '<img id="_ms_vlp_cover" src="' + SEC.escapeAttr(cover) + '" style="width:100%;display:block;max-height:360px;object-fit:contain;">' : '') +
					'<div id="_ms_vlp_loading" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:14px;">加载中...</div>' +
					'<div id="_ms_vlp_video_error" style="display:none;position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);flex-direction:column;align-items:center;justify-content:center;color:#fff;padding:20px;text-align:center;">' +
						'<div style="font-size:32px;margin-bottom:8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>' +
						'<div id="_ms_vlp_error_msg" style="font-size:13px;margin-bottom:12px;">视频加载失败</div>' +
						'<button id="_ms_vlp_video_retry" style="padding:6px 16px;border:none;border-radius:6px;background:#ef4444;color:#fff;font-size:12px;cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg> 重试</button>' +
					'</div>' +
				'</div>' +

								buildPageSelectorHtml() +

								buildQualitySelectorHtml() +

								buildVideoInfoHtml() +

								buildUploaderHtml() +

								'<div id="_ms_vlp_autoplay_row" style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding:10px 14px;background:' + c.bg2 + ';border-radius:10px;">' +
					'<span style="font-size:13px;color:' + c.txt + ';display:flex;align-items:center;gap:6px;">' +
						'<span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></span>自动播放' +
					'</span>' +
					'<div id="_ms_vlp_autoplay_toggle" style="position:relative;width:44px;height:24px;border-radius:12px;cursor:pointer;transition:background 0.2s;background:' + (State.config.autoPlayPreview ? '#6366f1' : c.bg3) + ';">' +
						'<div style="position:absolute;top:2px;left:' + (State.config.autoPlayPreview ? '22px' : '2px') + ';width:20px;height:20px;border-radius:50%;background:#fff;transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>' +
					'</div>' +
				'</div>' +
				(isMobile ?
				'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px;margin-bottom:16px;">' +
					'<button id="_ms_vlp_play" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 8px;border:none;border-radius:12px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-size:12px;font-weight:600;cursor:pointer;">' +
						'<span style="font-size:22px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="8 5 8 19 19 12 8 5"></polygon></svg></span><span>播放</span>' +
					'</button>' +
					'<button id="_ms_vlp_dl" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 8px;border:none;border-radius:12px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-size:12px;font-weight:600;cursor:pointer;">' +
						'<span style="font-size:22px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></span><span>下载</span>' +
					'</button>' +
					'<button id="_ms_vlp_copy" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 8px;border:none;border-radius:12px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;font-size:12px;font-weight:600;cursor:pointer;">' +
						'<span style="font-size:22px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></span><span>复制</span>' +
					'</button>' +
				'</div>' :
				'<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;margin-bottom:16px;">' +
					'<button id="_ms_vlp_play" style="flex:1;min-width:120px;padding:12px 20px;border:none;border-radius:10px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-size:14px;font-weight:600;cursor:pointer;">▶ 播放视频</button>' +
					'<button id="_ms_vlp_asr" style="flex:1;min-width:100px;padding:12px 14px;border:none;border-radius:10px;background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;font-size:14px;font-weight:600;cursor:pointer;">' + MS_CONFIG.ICONS.speech + ' ' + LANG.t('transcribeRun') + '</button>' +
					'<button id="_ms_vlp_dl" style="flex:1;min-width:100px;padding:12px 14px;border:none;border-radius:10px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-size:14px;font-weight:600;cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> 下载视频</button>' +
					'<button id="_ms_vlp_copy" style="flex:1;min-width:120px;padding:12px 20px;border:none;border-radius:10px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;font-size:14px;font-weight:600;cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> 复制链接</button>' +
				'</div>') +

								'<div style="border-top:1px solid ' + c.border + ';padding-top:16px;">' +
					'<div style="font-size:12px;color:' + c.sub + ';margin-bottom:6px;">视频地址</div>' +
					'<div id="_ms_vlp_video_url_text" style="background:' + c.bg2 + ';border-radius:8px;padding:10px;font-size:11px;color:' + c.txt + ';word-break:break-all;max-height:80px;overflow-y:auto;font-family:monospace;">' + SEC.escapeHtml(videoUrl || '解析中...') + '</div>' +
					(audioUrl ? '<div style="margin-top:8px;"><div style="font-size:12px;color:' + c.sub + ';margin-bottom:6px;">音频地址（DASH格式）</div><div style="background:' + c.bg2 + ';border-radius:8px;padding:10px;font-size:11px;color:' + c.txt + ';word-break:break-all;max-height:60px;overflow-y:auto;font-family:monospace;">' + SEC.escapeHtml(audioUrl) + '</div></div>' : '') +
				'</div>' +
			'</div>';

		overlay.appendChild(modal);
		document.body.appendChild(overlay);

		if (isMobile) {
			modal.style.transform = 'translateY(100%)';
			requestAnimationFrame(function() {
				modal.style.transition = 'transform 0.3s cubic-bezier(.22,1,.36,1)';
				modal.style.transform = 'translateY(0)';
			});
		}

		var playerDiv = document.getElementById('_ms_vlp_player');
		var loadingDiv = document.getElementById('_ms_vlp_loading');
		var coverImg = document.getElementById('_ms_vlp_cover');
		var videoErrorDiv = document.getElementById('_ms_vlp_video_error');
		var videoErrorMsg = document.getElementById('_ms_vlp_error_msg');
		var videoUrlText = document.getElementById('_ms_vlp_video_url_text');

		if (State.config.autoPlayPreview && currentVideoUrl) {
			setTimeout(function() {
				var vid = createPlayer();
				if (vid) {
					vid.play().catch(function(){});
				}
			}, 300);
		}

				document.getElementById('_ms_vlp_close').onclick = function() {
			closeModal();
		};
		overlay.addEventListener('click', function(e) {
			if (e.target === overlay) closeModal();
		});

		function closeModal() {
			abortedFlag = true; 
			if (muxHandle) { try { muxHandle.abort(); } catch (e) {} muxHandle = null; }
			UI._vlpAbortMux = null;
			if (isMobile) {
				modal.style.transform = 'translateY(100%)';
				overlay.style.background = 'rgba(0,0,0,0)';
			} else {
				modal.style.opacity = '0';
				modal.style.transform = 'scale(0.95)';
				overlay.style.background = 'rgba(0,0,0,0)';
			}
			setTimeout(function() {
				overlay.remove();
			}, 300);
		}

				function showVideoError(msg) {
			if (videoErrorDiv) {
				videoErrorDiv.style.display = 'flex';
				if (videoErrorMsg) videoErrorMsg.textContent = msg || '视频加载失败';
			}
			if (loadingDiv) loadingDiv.style.display = 'none';
		}

		function hideVideoError() {
			if (videoErrorDiv) videoErrorDiv.style.display = 'none';
		}

				var createPlayer = function(autoPlay) {
			if (loadingDiv) loadingDiv.remove();
			if (coverImg) coverImg.remove();
			hideVideoError();

			var oldVid = playerDiv.querySelector('video');
			if (oldVid) oldVid.remove();

			var vid = document.createElement('video');
			vid.controls = true;
			vid.autoplay = autoPlay !== false ? State.config.autoPlayPreview : false;
			vid.style.cssText = 'width:100%;display:block;max-height:400px;';
			vid.setAttribute('playsinline', '');
			vid.setAttribute('webkit-playsinline', '');

			if (currentVideoUrl) {
				vid.src = currentVideoUrl;
				vid.onerror = function() {
					showVideoError('视频加载失败，请尝试直接下载');
				};
				vid.onloadstart = function() {
					hideVideoError();
				};
			} else {
				showVideoError('未获取到视频地址');
			}

			playerDiv.appendChild(vid);
			return vid;
		};

				function switchQuality(index) {
			var newUrl = '';
			if (videoQualities && videoQualities[index]) {
				newUrl = videoQualities[index].url;
			} else if (data.videoUrls && data.videoUrls[index]) {
				newUrl = data.videoUrls[index];
			}
			if (!newUrl || newUrl === currentVideoUrl) return;

			currentVideoUrl = newUrl;
			if (videoUrlText) videoUrlText.textContent = newUrl;

			var vid = playerDiv.querySelector('video');
			if (vid) {
												var resumeAt = vid.currentTime || 0;
				var wasPlaying = !vid.paused;
				vid.src = newUrl;
				var onMeta = function () {
					vid.removeEventListener('loadedmetadata', onMeta);
					try {
						if (resumeAt > 0 && isFinite(vid.duration) && resumeAt < vid.duration) {
							vid.currentTime = resumeAt;
						}
					} catch (eSeek) {}
					if (wasPlaying) vid.play().catch(function () {});
				};
				vid.addEventListener('loadedmetadata', onMeta);
				vid.load();
												setTimeout(function () {
					try { vid.removeEventListener('loadedmetadata', onMeta); } catch (eR) {}
					try {
						if (wasPlaying && vid.paused) vid.play().catch(function () {});
					} catch (eP) {}
				}, 2000);
			}
		}

				var qualitySel = document.getElementById('_ms_vlp_quality');
		if (qualitySel) {
			qualitySel.addEventListener('change', function() {
				var idx = parseInt(qualitySel.value, 10);
				switchQuality(idx);
			});
		}

				var pageSelEl = document.getElementById('_ms_vlp_page');
		if (pageSelEl) {
			pageSelEl.addEventListener('change', function() {
				var idx = parseInt(pageSelEl.value, 10);
				if (isNaN(idx)) return;
				switchPage(idx);
			});
		}

				var videoRetryBtn = document.getElementById('_ms_vlp_video_retry');
		if (videoRetryBtn) {
			videoRetryBtn.addEventListener('click', function() {
				var vid = playerDiv.querySelector('video');
				if (vid) {
					hideVideoError();
					vid.load();
				} else {
					createPlayer();
				}
			});
		}

				var retryBtn = document.getElementById('_ms_vlp_retry');
		if (retryBtn && originalUrl) {
			retryBtn.addEventListener('click', function() {
				delete VideoLinkPreview._cache[originalUrl];
				overlay.remove();
				VideoLinkPreview.preview(originalUrl);
			});
		}

				document.getElementById('_ms_vlp_play').onclick = function() {
			var vid = createPlayer();
			if (vid) {
				vid.scrollIntoView({ behavior: 'smooth', block: 'center' });
				setTimeout(function() { vid.play().catch(function(){}); }, 100);
			}
		};

												var abortedFlag = false;
		var muxStatusEl = null;
		function muxSay(msg) {
			if (!muxStatusEl || !muxStatusEl.parentNode) {
				muxStatusEl = document.createElement('div');
				muxStatusEl.style.cssText = 'margin-top:10px;padding:8px 12px;border-radius:8px;background:' + c.bg2
					+ ';color:' + c.sub + ';font-size:12px;text-align:center;line-height:1.6;';
				var rowEl = dlBtnEl && dlBtnEl.parentNode;
				if (rowEl && rowEl.parentNode) rowEl.parentNode.insertBefore(muxStatusEl, rowEl.nextSibling);
				else modal.appendChild(muxStatusEl);
			}
			muxStatusEl.textContent = msg;
		}
		function muxClear() {
			if (muxStatusEl && muxStatusEl.parentNode) muxStatusEl.parentNode.removeChild(muxStatusEl);
			muxStatusEl = null;
		}
		var muxHandle = null;
		var dlBtnEl = document.getElementById('_ms_vlp_dl');
		var muxStageText = {
			lib: function () { return LANG.t('muxStageLib'); },
			video: function (l, t) { return LANG.t('muxStageVideo', { p: (t > 0 ? Math.round(l / t * 100) : 0) }); },
			audio: function (l, t) { return LANG.t('muxStageAudio', { p: (t > 0 ? Math.round(l / t * 100) : 0) }); },
			parse: function () { return LANG.t('muxStageParse'); },
			mux: function () { return LANG.t('muxStageMux'); },
			verify: function () { return LANG.t('muxStageVerify'); }
		};
		function muxFallbackToSeparate(reason) {
			muxClear();
			muxSay(LANG.t('muxFail') + ': ' + reason + ' · ' + LANG.t('muxSeparate'));
			VideoMux.saveSeparate(currentVideoUrl, audioUrl, title.substring(0, 80));
			LOG.warn('[VideoMux] 降级为分别下载:', reason);
		}
		if (dlBtnEl) dlBtnEl.onclick = function() {
			if (muxHandle) return; 
			if (!currentVideoUrl) { toast('视频地址不可用', '#f59e0b'); return; }
			var rawName = title.replace(/[\\\/:\*\?"<>\|]/g, '_').substring(0, 100);
			if (!(isDash && audioUrl)) {
								Dl.one(currentVideoUrl, rawName + '.mp4', State.config.batchRetry, State.config.customHeaders);
				toast('开始下载: ' + title.substring(0, 30), '#10b981');
				return;
			}
			muxSay(LANG.t('muxPreparing'));
			dlBtnEl.disabled = true; dlBtnEl.style.opacity = '0.6';
			muxHandle = VideoMux.run({
				videoUrl: currentVideoUrl,
				audioUrl: audioUrl,
				baseName: rawName,
				onStage: function (stage, loaded, total) {
					if (abortedFlag) return;
					var f = muxStageText[stage];
					muxSay(LANG.t('muxPreparing') + ' ' + (f ? f(loaded, total) : stage));
				}
			}, function (res) {
				muxHandle = null;
				UI._vlpAbortMux = null;
				dlBtnEl.disabled = false; dlBtnEl.style.opacity = '';
				if (abortedFlag) return;
				if (res.ok && res.blob) {
					muxSay(LANG.t('muxOk'));
					try {
						Dl.fallback(URL.createObjectURL(res.blob), res.filename, null);
						toast(LANG.t('muxSaved') + ': ' + res.filename, '#10b981');
					} catch (eSave) {
						muxFallbackToSeparate('保存失败 ' + eSave.message);
						return;
					}
					setTimeout(muxClear, 2500);
				} else {
					muxFallbackToSeparate(res.reason || '未知原因');
				}
			});
						UI._vlpAbortMux = function () {
				abortedFlag = true;
				if (muxHandle) { try { muxHandle.abort(); } catch (e) {} muxHandle = null; }
			};
		};

				var asrBtnEl = document.getElementById('_ms_vlp_asr');
		if (asrBtnEl) asrBtnEl.onclick = function() {
			var useUrl = (audioUrl || currentVideoUrl) || '';
			if (!useUrl) { toast(LANG.t('transcribeNoKey'), '#f59e0b'); return; }
			UI.runTranscribe(useUrl, title);
		};

				document.getElementById('_ms_vlp_copy').onclick = function() {
			var text = currentVideoUrl || '';
			if (!text) {
				toast('视频地址不可用', '#f59e0b');
				return;
			}
			copyText(text);
		};

				var autoplayToggle = document.getElementById('_ms_vlp_autoplay_toggle');
		if (autoplayToggle) {
			autoplayToggle.addEventListener('click', function() {
				State.config.autoPlayPreview = !State.config.autoPlayPreview;
				State.save();
				var isOn = State.config.autoPlayPreview;
				autoplayToggle.style.background = isOn ? '#6366f1' : UI.colors().bg3;
				var knob = autoplayToggle.querySelector('div');
				if (knob) knob.style.left = isOn ? '22px' : '2px';
				toast(isOn ? '自动播放已开启' : '自动播放已关闭', isOn ? '#6366f1' : '#64748b');
			});
		}
		if (isMobile) {
			var dragHandle = document.getElementById('_ms_vlp_drag_handle');
			var touchStartX = 0;
			var touchStartY = 0;
			var touchStartTime = 0;
			var lastTapTime = 0;
			var isDragging = false;
			var dragDirection = null;
			var SWIPE_THRESHOLD = 50;
			var TAP_MAX_DURATION = 300;
			var DOUBLE_TAP_DELAY = 300;

			function getCurrentQualityIndex() {
				var sel = document.getElementById('_ms_vlp_quality');
				if (sel) return parseInt(sel.value, 10);
				return 0;
			}

			if (dragHandle) {
				dragHandle.addEventListener('touchstart', function(e) {
					if (e.touches.length !== 1) return;
					var touch = e.touches[0];
					touchStartX = touch.clientX;
					touchStartY = touch.clientY;
					touchStartTime = Date.now();
					isDragging = true;
					dragDirection = null;
					modal.style.transition = 'none';
					try { e.preventDefault(); } catch (e2) {}
				}, { passive: false });

				dragHandle.addEventListener('touchmove', function(e) {
					if (!isDragging || e.touches.length !== 1) return;
					var touch = e.touches[0];
					var deltaX = touch.clientX - touchStartX;
					var deltaY = touch.clientY - touchStartY;

					if (!dragDirection) {
						if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
							dragDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
						}
					}

					if (dragDirection === 'vertical' && deltaY > 0) {
						var translateY = Math.min(deltaY, window.innerHeight * 0.6);
						var opacity = Math.max(0, 1 - deltaY / (window.innerHeight * 0.6));
						modal.style.transform = 'translateY(' + translateY + 'px)';
						overlay.style.background = 'rgba(0,0,0,' + (0.85 * opacity) + ')';
						try { e.preventDefault(); } catch (e2) {}
					}
				}, { passive: false });

				dragHandle.addEventListener('touchend', function(e) {
					if (!isDragging) return;
					isDragging = false;
					modal.style.transition = 'transform 0.3s cubic-bezier(.22,1,.36,1)';

					var touch = e.changedTouches[0];
					var deltaY = touch.clientY - touchStartY;
					var deltaTime = Date.now() - touchStartTime;

					if (dragDirection === 'vertical' && (deltaY > SWIPE_THRESHOLD * 2 || deltaY > window.innerHeight * 0.25)) {
						closeModal();
						return;
					}

					if (dragDirection === 'vertical' && deltaY > 0) {
						modal.style.transform = 'translateY(0)';
						overlay.style.background = '';
					}
				}, { passive: true });
			}

			if (playerDiv) {
				playerDiv.addEventListener('touchstart', function(e) {
					if (e.touches.length !== 1) return;
					var touch = e.touches[0];
					touchStartX = touch.clientX;
					touchStartY = touch.clientY;
					touchStartTime = Date.now();
					isDragging = true;
					dragDirection = null;
				}, { passive: true });

				playerDiv.addEventListener('touchmove', function(e) {
					if (!isDragging || e.touches.length !== 1) return;
					var touch = e.touches[0];
					var deltaX = touch.clientX - touchStartX;
					var deltaY = touch.clientY - touchStartY;

					if (!dragDirection) {
						if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
							dragDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
						}
					}
				}, { passive: true });

				playerDiv.addEventListener('touchend', function(e) {
					if (!isDragging) return;
					isDragging = false;

					var touch = e.changedTouches[0];
					var deltaX = touch.clientX - touchStartX;
					var deltaY = touch.clientY - touchStartY;
					var deltaTime = Date.now() - touchStartTime;

					if (dragDirection === 'horizontal' && Math.abs(deltaX) > SWIPE_THRESHOLD) {
						var qIdx = getCurrentQualityIndex();
						var totalQ = qualityList && qualityList.length ? qualityList.length : (data.videoUrls ? data.videoUrls.length : 0);
						if (totalQ > 1) {
							var newIdx = qIdx;
							if (deltaX < 0 && qIdx < totalQ - 1) {
								newIdx = qIdx + 1;
							} else if (deltaX > 0 && qIdx > 0) {
								newIdx = qIdx - 1;
							}
							if (newIdx !== qIdx) {
								switchQuality(newIdx);
								var qSel = document.getElementById('_ms_vlp_quality');
								if (qSel) qSel.value = newIdx;
								toast('画质: ' + (qualityList && qualityList[newIdx] && qualityList[newIdx].label ? qualityList[newIdx].label : ('清晰度 ' + (newIdx + 1))), '#6366f1');
							}
						}
						return;
					}

					if (deltaTime < TAP_MAX_DURATION && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
						var now = Date.now();
						if (now - lastTapTime < DOUBLE_TAP_DELAY) {
							var vid = playerDiv.querySelector('video');
							if (vid) {
								if (vid.paused) {
									vid.play().catch(function(){});
								} else {
									vid.pause();
								}
							}
							lastTapTime = 0;
						} else {
							lastTapTime = now;
						}
					}
				}, { passive: true });
			}
		}

		function switchPage(index) {
			if (!pages || !pages[index]) return;
			if (index === currentPageIndex) return;
			var page = pages[index];
			var pageSel = document.getElementById('_ms_vlp_page');
			var prevIndex = currentPageIndex;

						if (!page.cid) {
				toast('该分P无法直接切换播放', '#f59e0b');
				if (pageSel) pageSel.value = String(prevIndex);
				return;
			}
			if (pageSel) pageSel.disabled = true;
			toast('切换到 P' + (index + 1) + (page.part ? ': ' + page.part : ''), '#6366f1');

			Resolver.switchPage(data, index, function(newData, err) {
				if (pageSel) pageSel.disabled = false;
				if (err || !newData) {
					toast('切换分P失败: ' + (err || '未知错误'), '#ef4444');
					if (pageSel) pageSel.value = String(prevIndex);
					return;
				}
				currentPageIndex = index;
								qualityList = data.qualityList || [];
				videoQualities = data.videoQualities || [];
				currentVideoUrl = data.videoUrl || '';
				if (videoUrlText && currentVideoUrl) videoUrlText.textContent = currentVideoUrl;

				var qSel = document.getElementById('_ms_vlp_quality');
				if (qSel) qSel.innerHTML = buildQualityOptions();

				var vid = playerDiv.querySelector('video');
				if (vid && currentVideoUrl) {
					var wasPlaying = !vid.paused;
					vid.src = currentVideoUrl;
					vid.load();
					if (wasPlaying) vid.play().catch(function(){});
				}
			});
		}
	};

		return VideoLinkPreview;
	})();
	var Meta = (function () {
		'use strict';
		var Meta = {};
		Meta.fetchSize = function (url, cb) {
		if (State.metaCache[url] && State.metaCache[url].size) { cb(State.metaCache[url].size, null); return; }
		var done = false;
		function finish(size, err) {
			if (done) return;
			done = true;
			if (!err) {
				State.metaPut(url, 'size', size);
				cb(size > 0 ? size : null, null);
			} else cb(null, err);
		}
								function viaXHR() {
			try {
				var xhr = new XMLHttpRequest();
				xhr.open('HEAD', url, true);
				xhr.timeout = 10000;
				xhr.onload = function () {
					var size = 0;
					try { size = parseInt(xhr.getResponseHeader('Content-Length') || '0', 10); } catch (e) {}
					finish(size, null);
				};
				xhr.onerror = function () { finish(0, '网络错误'); };
				xhr.ontimeout = function () { finish(0, '超时'); };
				xhr.send();
			} catch (e) { finish(0, e.message); }
		}
		if (typeof GM_xmlhttpRequest !== 'function') { viaXHR(); return; }
		try {
			GM_xmlhttpRequest({
				method: 'HEAD',
				url: url,
				timeout: 10000,
				onload: function (resp) {
					var size = 0;
					try {
						var raw = null;
						if (resp.responseHeaders) {
							var mm = /content-length:\s*(\d+)/i.exec(resp.responseHeaders);
							if (mm) raw = mm[1];
						}
						size = parseInt(raw || '0', 10);
					} catch (e) {}
					finish(size, null);
				},
				onerror: function () { viaXHR(); },
				ontimeout: function () { finish(0, '超时'); }
			});
		} catch (e) { viaXHR(); }
	};

		Meta.fetchImageSize = function (url, cb) {
		if (State.metaCache[url] && State.metaCache[url].width) { cb(State.metaCache[url].width, State.metaCache[url].height, null); return; }
		try {
			var img = new Image();
			img.onload = function () {
				State.metaPut(url, 'width', img.naturalWidth || img.width);
				State.metaPut(url, 'height', img.naturalHeight || img.height);
				cb(img.naturalWidth || img.width, img.naturalHeight || img.height, null);
			};
			img.onerror = function () { cb(null, null, '加载失败'); };
			img.src = url;
		} catch (e) { cb(null, null, e.message); }
	};

								Meta._durationQueue = [];
	Meta._durationRunning = 0;
	Meta._DURATION_CONCURRENCY = 2;
	Meta._runDurationQueue = function () {
		while (Meta._durationRunning < Meta._DURATION_CONCURRENCY && Meta._durationQueue.length > 0) {
			var job = Meta._durationQueue.shift();
			Meta._durationRunning++;
			job(function () {
				Meta._durationRunning--;
				Meta._runDurationQueue();
			});
		}
	};

	Meta.fetchVideoDuration = function (url, cb) {
		if (State.metaCache[url] && State.metaCache[url].duration) { cb(State.metaCache[url].duration, null); return; }
				if (!Meta._durationPending) Meta._durationPending = {};
		if (Meta._durationPending[url]) { Meta._durationPending[url].push(cb); return; }
		Meta._durationPending[url] = [cb];
		Meta._durationQueue.push(function (release) {
			var waiters = Meta._durationPending[url] || [];
			delete Meta._durationPending[url];
			var releaseAll = function (dur, err) {
				for (var wi = 0; wi < waiters.length; wi++) { try { waiters[wi](dur, err); } catch (eW) {} }
				release();
			};
			Meta._fetchVideoDurationNow(url, releaseAll);
		});
		Meta._runDurationQueue();
	};

	Meta._fetchVideoDurationNow = function (url, cb) {
		try {
			var v = document.createElement('video');
			v.preload = 'metadata';
			v.onloadedmetadata = function () {
				State.metaPut(url, 'duration', v.duration);
				cb(v.duration, null);
				v.src = '';
			};
			v.onerror = function () { cb(null, '加载失败'); };
			v.src = url;
		} catch (e) { cb(null, e.message); }
	};

		Meta.fetchAudioDuration = function (url, cb) {
		if (State.metaCache[url] && State.metaCache[url].duration) { cb(State.metaCache[url].duration, null); return; }
		try {
			var a = document.createElement('audio');
			a.preload = 'metadata';
			a.onloadedmetadata = function () {
				State.metaPut(url, 'duration', a.duration);
				cb(a.duration, null);
				a.src = '';
			};
			a.onerror = function () { cb(null, '加载失败'); };
			a.src = url;
		} catch (e) { cb(null, e.message); }
	};

		Meta.batchFetch = function (urls, kind, progressCb, doneCb) {
		var total = urls.length;
		var done = 0;
		var results = {};
		var concurrency = 5;
								if (total === 0) { if (doneCb) doneCb(results); return; }
				var finished = false;
		function settle() {
			if (finished) return;
			finished = true;
			if (doneCb) doneCb(results);
		}

		function worker(idx) {
			if (idx >= total) {
				if (done >= total) settle();
				return;
			}
			var url = urls[idx];
			var next = function () { done++; if (progressCb) progressCb(done, total); worker(idx + concurrency); };

			if (kind === 'image') {
				Meta.fetchImageSize(url, function (w, h, err) {
					results[url] = { width: w, height: h, error: err };
					next();
				});
			} else if (kind === 'video') {
				Meta.fetchVideoDuration(url, function (dur, err) {
					results[url] = { duration: dur, error: err };
					next();
				});
			} else if (kind === 'audio') {
				Meta.fetchAudioDuration(url, function (dur, err) {
					results[url] = { duration: dur, error: err };
					next();
				});
			} else {
				Meta.fetchSize(url, function (size, err) {
					results[url] = { size: size, error: err };
					next();
				});
			}
		}
		for (var w = 0; w < concurrency; w++) worker(w);
	};

					
		return Meta;
	})();
	var TranslateEngine = (function () {
		'use strict';
		var TranslateEngine = {};
	TranslateEngine._engines = {};
	TranslateEngine._current = 'mymemory';
	TranslateEngine.LANG_MAP = {
		'zh-CN': 'zh-CN',
			'zh': 'zh-CN', 'zh-TW': 'zh-TW',
			'en': 'en', 'en-US': 'en',
			'en-GB': 'en',
		'ja': 'ja',
			'ko': 'ko', 'fr': 'fr',
			'de': 'de',
		'es': 'es',
			'ru': 'ru', 'pt': 'pt',
			'it': 'it',
		'ar': 'ar',
			'th': 'th', 'vi': 'vi',
			'id': 'id',
		'auto': 'auto'
	};
	TranslateEngine.register = function (key, config) {
		TranslateEngine._engines[key] = {
			key: key,
			name: config.name || key,
			label: config.label || key,
			icon: config.icon || MS_CONFIG.ICONS.globe,
			maxChars: config.maxChars || 500,
			timeout: config.timeout || 25000,
			supportedLangs: config.supportedLangs || ['zh-CN', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'],
			translate: config.translate,
			needKey: config.needKey || false,
			apiKey: config.apiKey || ''
		};
		LOG.debug('注册翻译引擎:', key, config.name);
	};
	TranslateEngine.list = function () {
		var list = [];
		for (var key in TranslateEngine._engines) {
			if (TranslateEngine._engines.hasOwnProperty(key)) {
				list.push(TranslateEngine._engines[key]);
			}
		}
		return list;
	};
	TranslateEngine.current = function () {
		var key = State.config.translateEngine || TranslateEngine._current;
		return TranslateEngine._engines[key] || TranslateEngine._engines['mymemory'];
	};
	TranslateEngine.use = function (key) {
		if (TranslateEngine._engines[key]) {
			TranslateEngine._current = key;
			State.config.translateEngine = key;
			State.save();
			LOG.info('切换翻译引擎:', key);
			return true;
		}
		return false;
	};
	TranslateEngine.translate = function (text, fromLang, toLang, cb, engineKey) {
		if (!text || !text.trim()) { if (cb) cb('', null); return; }

		var engine = TranslateEngine._engines[engineKey] || TranslateEngine.current();
		var f = TranslateEngine.LANG_MAP[fromLang || State.config.translateFrom] || 'auto';
		var t = TranslateEngine.LANG_MAP[toLang || State.config.translateTo] || 'zh-CN';

												var cacheKey = engine.key + '|' + f + '|' + t + '|' + text.length + '|' + U.hashStr(text);
		if (State.translateCache[cacheKey]) {
			LOG.debug('翻译缓存命中:', cacheKey);
			if (cb) cb(State.translateCache[cacheKey], null);
			return;
		}

				if (text.length > engine.maxChars) {
			LOG.warn('文本超出引擎限制:', text.length, '>', engine.maxChars);
						TranslateEngine._translateChunks(engine, text, f, t, cb, cacheKey);
			return;
		}

				LOG.debug('调用引擎翻译:', engine.key, f, '->', t);
		engine.translate(text, f, t, function (result, err) {
			if (err) {
				LOG.warn('引擎翻译失败:', engine.key, err);
								TranslateEngine._fallback(text, f, t, cb, engine.key, cacheKey);
			} else {
								if (result && result.trim() === text.trim() && f !== 'auto') {
					LOG.warn('引擎返回原文，触发降级:', engine.key);
					TranslateEngine._fallback(text, f, t, cb, engine.key, cacheKey);
				} else {
					State._translateCacheLru.set(cacheKey, result);
					if (cb) cb(result, null);
				}
			}
		});
	};
	TranslateEngine._translateChunks = function (engine, text, from, to, cb, baseCacheKey) {
		var maxChunk = engine.maxChars - 50; 
								var pieces = text.split(/([。！？!?\n]+)/);
		var chunks = [];
		var current = '';
		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i];
			if (!piece) continue;
			if ((current + piece).length > maxChunk) {
				if (current.trim()) chunks.push(current.trim());
				current = piece;
			} else {
				current += piece;
			}
		}
		if (current.trim()) chunks.push(current.trim());

		if (chunks.length === 0) chunks = [text.substring(0, maxChunk)];

		LOG.debug('分段翻译:', chunks.length, '段');

		var results = [];
		var failed = 0;
		var pending = chunks.length;
		var originalReturns = 0;

		for (var j = 0; j < chunks.length; j++) {
			(function (chunk, idx) {
				engine.translate(chunk, from, to, function (result, err) {
					pending--;
					if (err) {
						failed++;
						LOG.warn('分段失败:', idx, err);
					} else if (result && result.trim() === chunk.trim() && from !== 'auto') {
												originalReturns++;
						failed++;
						LOG.warn('分段返回原文:', idx);
					} else {
						results[idx] = result;
					}
					if (pending === 0) {
						if (failed > 0 && results.length === 0) {
							if (cb) cb(null, LANG.t('transFail'));
						} else {
														var finalResult = results.join('');
							State._translateCacheLru.set(baseCacheKey, finalResult);
							if (failed > originalReturns) {
								if (cb) cb(finalResult, LANG.t('transPartialFail'));
							} else {
								if (cb) cb(finalResult, null);
							}
						}
					}
				});
			})(chunks[j], j);
		}
	};
				TranslateEngine._fallback = function (text, from, to, cb, failedKey, cacheKey, tried) {
		tried = tried || {};
		if (failedKey) tried[failedKey] = true;
		var engines = TranslateEngine.list();
		var fallbackEngines = [];

				for (var i = 0; i < engines.length; i++) {
			var eng = engines[i];
			if (tried[eng.key]) continue;
			if (!eng.needKey || eng.apiKey) {
				fallbackEngines.push(eng);
			}
		}

				if (fallbackEngines.length === 0) {
			for (var j = 0; j < engines.length; j++) {
				if (!tried[engines[j].key]) fallbackEngines.push(engines[j]);
			}
		}

		if (fallbackEngines.length === 0) {
			if (cb) cb(null, LANG.t('transAllFail'));
			return;
		}

		LOG.info('降级到备用引擎:', fallbackEngines[0].key);
		var nextEngine = fallbackEngines[0];
		nextEngine.translate(text, from, to, function (result, err) {
			if (err) {
								TranslateEngine._fallback(text, from, to, cb, nextEngine.key, cacheKey, tried);
			} else {
								if (result && result.trim() === text.trim() && from !== 'auto') {
					TranslateEngine._fallback(text, from, to, cb, nextEngine.key, cacheKey, tried);
				} else {
					State._translateCacheLru.set(cacheKey, result);
					if (cb) cb(result, null);
				}
			}
		});
	};
	TranslateEngine.autoTranslate = function (text, cb) {
		var hasChinese = /[\u4e00-\u9fa5]/.test(text || '');
		var from = hasChinese ? 'zh-CN' : 'en';
		var to = hasChinese ? 'en' : 'zh-CN';
		TranslateEngine.translate(text, from, to, cb);
	};
	TranslateEngine.speak = function (text, lang) {
		if (!text) return;
		var l = TranslateEngine.LANG_MAP[lang] || 'en';
		if (l === 'zh-CN') l = 'zh-CN';
		else if (l === 'zh-TW') l = 'zh-TW';
		try {
			if ('speechSynthesis' in window) {
				var utter = new SpeechSynthesisUtterance(text);
				utter.lang = l;
				utter.rate = 1.0;
				speechSynthesis.cancel();
				speechSynthesis.speak(utter);
				LOG.debug('TTS 发音:', l, text.substring(0, 50));
			}
		} catch (e) {
			LOG.warn('TTS 失败:', e.message);
		}
	};
	
	TranslateEngine.register('mymemory', {
		name: 'MyMemory',
		label: 'MyMemory（免费）',
		icon: MS_CONFIG.ICONS.globe,
		maxChars: 500,
		supportedLangs: ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'pt', 'it', 'ar'],
		translate: function (text, from, to, cb) {
			var pair = encodeURIComponent(from === 'auto' ? 'autodetect' : from) + '%7C' + encodeURIComponent(to);
			var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text.substring(0, 500)) + '&langpair=' + pair;
			TranslateEngine._xhrGet(url, 25000, function (data, err) {
				if (err) { if (cb) cb(null, err); return; }
								if (data && data.responseStatus && (data.responseStatus < 200 || data.responseStatus >= 300)) {
					var errMsg = data.responseDetails || ('MyMemory HTTP ' + data.responseStatus);
					if (cb) cb(null, errMsg);
					return;
				}
				var result = '';
								if (data && data.matches && data.matches.length > 0) {
					var bestMatch = null;
					for (var i = 0; i < data.matches.length; i++) {
						var m = data.matches[i];
												if (!m.translation || m.quality === 0) continue;
						if (!bestMatch || m.quality > bestMatch.quality) {
							bestMatch = m;
						}
					}
					if (bestMatch && bestMatch.translation) {
						result = bestMatch.translation;
					}
				}
								if (!result && data && data.responseData && data.responseData.translatedText) {
					result = data.responseData.translatedText;
				}
				if (!result) { if (cb) cb(null, LANG.t('transFail')); return; }
								if (/MYMEMORY WARNING|INVALID LANGUAGE PAIR|NO QUERY SPECIFIED/i.test(result)) {
					if (cb) cb(null, result);
					return;
				}
								if (result.trim() === text.trim() && from !== 'auto') {
					if (cb) cb(null, 'MyMemory returned original text');
					return;
				}
				if (cb) cb(result, null);
			});
		}
	});
	TranslateEngine.register('google', {
		name: 'Google',
		label: 'Google 翻译',
		icon: MS_CONFIG.ICONS.diamond,
		maxChars: 5000,
		supportedLangs: ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'pt', 'it', 'ar', 'th', 'vi'],
		translate: function (text, from, to, cb) {
			var sl = from === 'auto' ? 'auto' : from;
			var tl = to;
						var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + sl + '&tl=' + tl + '&dt=t&q=' + encodeURIComponent(text);
			TranslateEngine._xhrGet(url, 20000, function (data, err) {
				if (err) { if (cb) cb(null, err); return; }
				try {
					var result = '';
					if (Array.isArray(data) && data[0]) {
						for (var i = 0; i < data[0].length; i++) {
							if (data[0][i] && data[0][i][0]) {
								result += data[0][i][0];
							}
						}
					}
					if (!result) { if (cb) cb(null, LANG.t('transFail')); return; }
					if (cb) cb(result, null);
				} catch (e) { if (cb) cb(null, e.message); }
			});
		}
	});
	TranslateEngine.register('bing', {
		name: 'Bing',
		label: 'Bing 翻译',
		icon: MS_CONFIG.ICONS.square,
		maxChars: 5000,
		supportedLangs: ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'pt', 'it'],
		translate: function (text, from, to, cb) {
			var sl = from === 'auto' ? 'auto-detect' : from;
			var tl = to;
						var url = 'https://www.bing.com/ttranslatev3?isVertical=1&IG=&IID=&from=' + sl + '&to=' + tl + '&text=' + encodeURIComponent(text);
			TranslateEngine._xhrPost(url, 'text=' + encodeURIComponent(text), 20000, function (data, err) {
				if (err) { if (cb) cb(null, err); return; }
				try {
					var result = '';
					if (data && data[0] && data[0].translations && data[0].translations[0]) {
						result = data[0].translations[0].text;
					}
					if (!result) { if (cb) cb(null, LANG.t('transFail')); return; }
					if (cb) cb(result, null);
				} catch (e) { if (cb) cb(null, e.message); }
			});
		}
	});
	TranslateEngine.register('baidu', {
		name: 'Baidu',
		label: '百度翻译',
		icon: MS_CONFIG.ICONS.circle,
		maxChars: 6000,
		needKey: true,
		supportedLangs: ['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'pt', 'it', 'ar', 'th', 'vi'],
		translate: function (text, from, to, cb) {
						if (!TranslateEngine._engines.baidu.apiKey) {
				if (cb) cb(null, LANG.t('transNeedKey'));
				return;
			}
			var appid = TranslateEngine._engines.baidu.apiKey;
			var salt = Date.now();
			var sign = ''; 
			var url = 'https://fanyi-api.baidu.com/api/trans/vip/translate?q=' + encodeURIComponent(text) + '&from=' + from + '&to=' + to + '&appid=' + appid + '&salt=' + salt + '&sign=' + sign;
			TranslateEngine._xhrGet(url, 20000, function (data, err) {
				if (err) { if (cb) cb(null, err); return; }
				try {
					var result = '';
					if (data && data.trans_result && data.trans_result[0]) {
						for (var i = 0; i < data.trans_result.length; i++) {
							result += data.trans_result[i].dst;
						}
					}
					if (!result) { if (cb) cb(null, LANG.t('transFail')); return; }
					if (cb) cb(result, null);
				} catch (e) { if (cb) cb(null, e.message); }
			});
		}
	});
	TranslateEngine.register('deepl', {
		name: 'DeepL',
		label: 'DeepL（高质量）',
		icon: MS_CONFIG.ICONS.square,
		maxChars: 5000,
		needKey: true,
		supportedLangs: ['zh', 'en', 'ja', 'de', 'fr', 'es', 'pt', 'it', 'ru'],
		translate: function (text, from, to, cb) {
			if (!TranslateEngine._engines.deepl.apiKey) {
				if (cb) cb(null, LANG.t('transNeedKey'));
				return;
			}
						if (cb) cb(null, 'DeepL 需要 API Key');
		}
	});
	TranslateEngine._xhrGet = function (url, timeout, cb) {
		try {
						if (typeof GM_xmlhttpRequest === 'function') {
				GM_xmlhttpRequest({
					method: 'GET',
					url: url,
					timeout: timeout || 25000,
					onload: function (resp) {
						if (resp.status >= 200 && resp.status < 300) {
							try {
								var data = U.safeJson(resp.responseText, null);
								if (cb) cb(data, null);
							} catch (e) { if (cb) cb(null, e.message); }
						} else {
							if (cb) cb(null, 'HTTP ' + resp.status);
						}
					},
					onerror: function () { if (cb) cb(null, LANG.t('transNetErr')); },
					ontimeout: function () { if (cb) cb(null, LANG.t('transTimeout')); }
				});
				return;
			}
						var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.timeout = timeout || 25000;
			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4) return;
				if (xhr.status >= 200 && xhr.status < 300) {
					try {
						var data = U.safeJson(xhr.responseText, null);
						if (cb) cb(data, null);
					} catch (e) { if (cb) cb(null, e.message); }
				} else {
					if (cb) cb(null, 'HTTP ' + xhr.status);
				}
			};
			xhr.onerror = function () { if (cb) cb(null, LANG.t('transNetErr')); };
			xhr.ontimeout = function () { if (cb) cb(null, LANG.t('transTimeout')); };
			xhr.send();
		} catch (e) { if (cb) cb(null, e.message); }
	};
	TranslateEngine._xhrPost = function (url, body, timeout, cb) {
		try {
						if (typeof GM_xmlhttpRequest === 'function') {
				GM_xmlhttpRequest({
					method: 'POST',
					url: url,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					data: body,
					timeout: timeout || 25000,
					onload: function (resp) {
						if (resp.status >= 200 && resp.status < 300) {
							try {
								var data = U.safeJson(resp.responseText, null);
								if (cb) cb(data, null);
							} catch (e) { if (cb) cb(null, e.message); }
						} else {
							if (cb) cb(null, 'HTTP ' + resp.status);
						}
					},
					onerror: function () { if (cb) cb(null, LANG.t('transNetErr')); },
					ontimeout: function () { if (cb) cb(null, LANG.t('transTimeout')); }
				});
				return;
			}
						var xhr = new XMLHttpRequest();
			xhr.open('POST', url, true);
			xhr.timeout = timeout || 25000;
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4) return;
				if (xhr.status >= 200 && xhr.status < 300) {
					try {
						var data = U.safeJson(xhr.responseText, null);
						if (cb) cb(data, null);
					} catch (e) { if (cb) cb(null, e.message); }
				} else {
					if (cb) cb(null, 'HTTP ' + xhr.status);
				}
			};
			xhr.onerror = function () { if (cb) cb(null, LANG.t('transNetErr')); };
			xhr.ontimeout = function () { if (cb) cb(null, LANG.t('transTimeout')); };
			xhr.send(body);
		} catch (e) { if (cb) cb(null, e.message); }
	};
	var Translator = TranslateEngine;

		return TranslateEngine;
	})();
	var Scanner = (function () {
		'use strict';
		var Scanner = {};
	Scanner._iframeVideoUrls = new Set();
	Scanner.scanImages = function () {
		var urls = [];
		try {
			var imgs = document.getElementsByTagName('img');
			for (var i = 0; i < imgs.length; i++) {
				var src = imgs[i].getAttribute('src') || imgs[i].getAttribute('data-src') || imgs[i].getAttribute('data-original') || imgs[i].getAttribute('data-lazy-src') || '';
				if (src && SEC.isSafeUrl(src)) urls.push(SEC.absUrl(src));
			}
			var links = document.getElementsByTagName('a');
			for (var j = 0; j < links.length; j++) {
				var href = links[j].getAttribute('href') || '';
				if (/^[^?#]+\.(png|jpe?g|gif|webp|bmp|svg|avif)(\?|#|$)/i.test(href) && SEC.isSafeUrl(href)) urls.push(SEC.absUrl(href));
			}
		} catch (e) {}
		return urls;
	};
	Scanner.scanVideos = function () {
		var urls = [];
		var seen = {};
		Scanner._iframeVideoUrls = new Set();
		function add(u) {
			if (!u || seen[u]) return;
			seen[u] = true;
			urls.push(u);
		}
		function collectSrc(el) {
			if (!el) return;
			var src = el.getAttribute('src') || el.getAttribute('data-src') || el.getAttribute('data-original') || el.getAttribute('data-url') || '';
			if (src && SEC.isSafeUrl(src)) add(SEC.absUrl(src));
			try {
				if (el.currentSrc && SEC.isSafeUrl(el.currentSrc)) add(SEC.absUrl(el.currentSrc));
			} catch (e) {}
			try {
				if (el.srcObject && typeof el.srcObject === 'object') {
										el.setAttribute('data-ms-srcobject', '1');
																				if (typeof Blob !== 'undefined' && el.srcObject instanceof Blob) {
						var blobUrl = URL.createObjectURL(el.srcObject);
						el.setAttribute('data-ms-blob-url', blobUrl);
						if (SEC.isSafeUrl(blobUrl)) add(blobUrl);
					} else if (typeof MediaStream !== 'undefined' && el.srcObject instanceof MediaStream) {
						var streamId = 'ms-stream-' + U.now() + '-' + Math.floor(Math.random() * 1000000);
						el.setAttribute('data-ms-stream-id', streamId);
						State.streamMap[streamId] = el;
					}
				}
			} catch (e) {}
		}
		function extractVideoSrc(el) {
			if (!el) return '';
			var src = el.getAttribute('src') || el.getAttribute('data-src') || el.getAttribute('data-original') || el.getAttribute('data-url') || '';
			if (src && SEC.isSafeUrl(src)) return SEC.absUrl(src);
			try {
				if (el.currentSrc && SEC.isSafeUrl(el.currentSrc)) return SEC.absUrl(el.currentSrc);
			} catch (e) {}
			return '';
		}
		try {
						var vs = document.querySelectorAll('video, video source, audio source');
			for (var i = 0; i < vs.length; i++) collectSrc(vs[i]);

															var visitedWins = [];
			function scanFrames(win) {
				if (visitedWins.indexOf(win) >= 0) return;
				visitedWins.push(win);
				try {
					var topFvs = win.document.querySelectorAll('video, video source, audio source');
					for (var ti = 0; ti < topFvs.length; ti++) collectSrc(topFvs[ti]);
					var iframes = win.document.querySelectorAll('iframe, frame');
					for (var f = 0; f < iframes.length; f++) {
						try {
							var cw = iframes[f].contentWindow;
							if (!cw || cw === win) continue;
							var iframeUrls = [];
							var fvs = cw.document.querySelectorAll('video, video source, audio source');
							for (var fi = 0; fi < fvs.length; fi++) {
								var u = extractVideoSrc(fvs[fi]);
								if (u) iframeUrls.push(u);
							}
							for (var ui = 0; ui < iframeUrls.length; ui++) {
								add(iframeUrls[ui]);
								Scanner._iframeVideoUrls.add(iframeUrls[ui]);
							}
							if (iframeUrls.length > 0) {
								iframes[f].setAttribute('data-ms-iframe-video-count', String(iframeUrls.length));
							}
							scanFrames(cw);
						} catch (e) {}
					}
				} catch (e) {}
			}
			scanFrames(window);

						var playerRes = Scanner.scanPlayerInstances();
			for (var pr = 0; pr < playerRes.videos.length; pr++) add(playerRes.videos[pr]);

						var links = document.querySelectorAll('a[href]');
			for (var j = 0; j < links.length; j++) {
				var href = links[j].getAttribute('href') || '';
				if (/^[^?#]+\.(mp4|webm|ogg|ogv|mov|mkv|avi|flv|f4v|ts|m2ts|m4v|3gp|mpeg|mpg|rm|rmvb|wmv|asf|vob|divx)(\?|#|$)/i.test(href) && SEC.isSafeUrl(href)) {
					add(SEC.absUrl(href));
				}
			}
		} catch (e) {}
		return urls;
	};

		Scanner.scanPlayerInstances = function () {
		var result = { videos: [], m3u8: [] };
		var seen = { videos: {}, m3u8: {} };
		function add(kind, u) {
			if (!u || seen[kind][u]) return;
			seen[kind][u] = true;
			result[kind].push(u);
		}
		function addVideo(u) { add('videos', u); }
		function addM3u8(u) { add('m3u8', u); add('videos', u); }
		try {
						if (window.hls && window.hls.url) {
				addM3u8(SEC.absUrl(window.hls.url));
			}
			var hlsVideos = document.querySelectorAll('video');
			for (var hi = 0; hi < hlsVideos.length; hi++) {
				var hlsInst = hlsVideos[hi].hls || hlsVideos[hi]._hls || (hlsVideos[hi].player && hlsVideos[hi].player.hls) || null;
				if (hlsInst && hlsInst.url) addM3u8(SEC.absUrl(hlsInst.url));
			}
			if (window.Hls && window.Hls.instances) {
				for (var hk in window.Hls.instances) {
					if (!window.Hls.instances.hasOwnProperty(hk)) continue;
					var hlsGlobal = window.Hls.instances[hk];
					if (hlsGlobal && hlsGlobal.url) addM3u8(SEC.absUrl(hlsGlobal.url));
				}
			}
		} catch (e) {}
		try {
						if (window.dashjs || (window.Player && window.Player.prototype)) {
				var dashVideos = document.querySelectorAll('video');
				for (var di = 0; di < dashVideos.length; di++) {
					var dp = dashVideos[di].dashPlayer || dashVideos[di]._dashjsPlayer;
					if (!dp) continue;
					var src = '';
					try {
						if (typeof dp.getSource === 'function') src = dp.getSource();
						if (!src && dp.getManifest && typeof dp.getManifest === 'function') {
							var manifest = dp.getManifest();
							if (manifest && manifest.url) src = manifest.url;
						}
					} catch (e) {}
					if (src) {
						var absSrc = SEC.absUrl(src);
						addVideo(absSrc);
						if (/\.m3u8?(\?|#|$)/i.test(src)) addM3u8(absSrc);
						if (/\.mpd(\?|#|$)/i.test(src)) addVideo(absSrc);
					}
				}
			}
		} catch (e) {}
		try {
						if (window.videojs && typeof window.videojs === 'function') {
				var vjsTargets = document.querySelectorAll('.video-js, video');
				for (var vi = 0; vi < vjsTargets.length; vi++) {
					var vel = vjsTargets[vi];
					var id = vel.id || (vel.getAttribute && vel.getAttribute('data-player-id'));
					var player = null;
					try {
						if (id && window.videojs.getPlayer) player = window.videojs.getPlayer(id);
						if (!player && window.videojs.players && window.videojs.players[id]) player = window.videojs.players[id];
					} catch (e) {}
					if (!player || typeof player.currentSrc !== 'function') continue;
					var vsrc = player.currentSrc();
					var vtype = '';
					try { if (typeof player.currentType === 'function') vtype = player.currentType(); } catch (e) {}
					if (!vsrc) continue;
					var absVsrc = SEC.absUrl(vsrc);
					addVideo(absVsrc);
					if (/\.m3u8?(\?|#|$)/i.test(vsrc) || vtype === 'application/x-mpegURL' || vtype === 'application/vnd.apple.mpegurl') {
						addM3u8(absVsrc);
					}
				}
			}
		} catch (e) {}
		return result;
	};

	Scanner.scanAudios = function () {
		var urls = [];
		try {
			var auds = document.querySelectorAll('audio, audio source');
			for (var i = 0; i < auds.length; i++) {
				var s = auds[i].getAttribute('src') || '';
				if (s && SEC.isSafeUrl(s)) urls.push(SEC.absUrl(s));
			}
			var links = document.getElementsByTagName('a');
			for (var j = 0; j < links.length; j++) {
				var href = links[j].getAttribute('href') || '';
				if (/^[^?#]+\.(mp3|wav|flac|aac|oga|opus|m4a|wma|amr|ape)(\?|#|$)/i.test(href) && SEC.isSafeUrl(href)) urls.push(SEC.absUrl(href));
			}
		} catch (e) {}
		return urls;
	};
	Scanner.scanM3u8 = function () {
		var urls = [];
		var seen = {};
		function add(u) {
			if (!u || seen[u]) return;
			seen[u] = true;
			urls.push(u);
		}
		function collectM3u8(el) {
			if (!el) return;
			var s = el.getAttribute('src') || el.getAttribute('data-src') || el.getAttribute('data-url') || '';
			if (!s && el.tagName === 'A') s = el.getAttribute('href') || '';
			if (s && /\.m3u8?(\?|#|$)/i.test(s) && SEC.isSafeUrl(s)) add(SEC.absUrl(s));
		}
		try {
						var vs = document.querySelectorAll('video, audio, source, a[href]');
			for (var i = 0; i < vs.length; i++) collectM3u8(vs[i]);

																					var visitedWins = [];
			function scanFrames(win) {
				if (!win || visitedWins.indexOf(win) >= 0) return;
				visitedWins.push(win);
				try {
					var fels = win.document.querySelectorAll('video, audio, source, a[href]');
					for (var fi = 0; fi < fels.length; fi++) collectM3u8(fels[fi]);
					var iframes = win.document.querySelectorAll('iframe, frame');
					for (var f = 0; f < iframes.length; f++) {
						try {
							var cw = iframes[f].contentWindow;
							if (!cw || cw === win) continue;
							scanFrames(cw);
						} catch (e) {}
					}
				} catch (e) {}
			}
			scanFrames(window);

						var playerM3u8 = Scanner.scanPlayerInstances().m3u8;
			for (var pm = 0; pm < playerM3u8.length; pm++) add(playerM3u8[pm]);

																		try {
				var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
				var textNode;
				var re = /(https?:\/\/[^\s"'<>]+\.m3u8?[^\s"'<>]*)/gi;
																				var textBudget = 30000; 
				while (textBudget-- > 0 && (textNode = walker.nextNode()) !== null) {
					var rawText = textNode.textContent;
					if (!rawText || rawText.length < 8) continue; 
					if (rawText.indexOf('m3u8') < 0 && rawText.indexOf('.ts') < 0) continue;
					var matches = String(rawText).substring(0, 4000).match(re);
					if (matches) {
						for (var m = 0; m < matches.length; m++) {
							if (SEC.isSafeUrl(matches[m])) add(SEC.absUrl(matches[m]));
						}
					}
				}
			} catch (e) {}
		} catch (e) {}
		return urls;
	};

	Scanner.scanVideoLinks = function () {
		var results = [];
		var seen = {};
		try {
			var links = document.querySelectorAll('a[href]');
			for (var i = 0; i < links.length; i++) {
				var a = links[i];
				var href = a.getAttribute('href') || '';
				if (!href || href.indexOf('#') === 0) continue;
				var absUrl = SEC.absUrl(href);
				var site = SEC.detectVideoSite(absUrl);
				if (!site || seen[absUrl]) continue;
				seen[absUrl] = true;
				var title = '';
				var cover = '';
				try {
					var img = a.querySelector('img');
					if (img) {
						cover = img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-original') || '';
						if (cover) cover = SEC.absUrl(cover);
					}
					var titleEl = a.querySelector('[title], .title, .name, .desc, h3, h4, p');
					if (titleEl) {
						title = titleEl.getAttribute('title') || titleEl.textContent || '';
					}
					if (!title) {
						title = a.getAttribute('title') || a.textContent || '';
					}
					title = title.trim().replace(/\s+/g, ' ');
					if (title.length > 80) title = title.substring(0, 77) + '...';
				} catch(e) {}
				results.push({
					url: absUrl,
					site: site.key,
					siteName: site.name,
					siteIcon: site.icon,
					title: title || SEC.nameFromUrl(absUrl),
					cover: cover
				});
			}
		} catch (e) {}
		return results;
	};

		var BG_SCAN_SELECTOR = 'div,section,article,aside,header,footer,main,nav,figure,figcaption,'
		+ 'li,ul,ol,dl,dt,dd,td,th,tr,table,tbody,thead,tfoot,form,fieldset,label,button,'
		+ 'a,span,p,blockquote,pre,code,em,strong,small,h1,h2,h3,h4,h5,h6,picture,video,iframe,body';

	Scanner.scanBackgroundsAsync = function (cb) {
		var urls = [];
		var all = document.querySelectorAll(BG_SCAN_SELECTOR);
		var limit = Math.min(all.length, 3000);
		var batchSize = 200;
		var idx = 0;
		var re = /url\(\s*(["']?)([^"')]+)\1\s*\)/;

		function batch() {
			var end = Math.min(idx + batchSize, limit);
			for (var i = idx; i < end; i++) {
				try {
					var cs = getComputedStyle(all[i]);
					if (!cs || cs.display === 'none' || cs.visibility === 'hidden') continue;
					var bg = cs.backgroundImage;
					if (!bg || bg === 'none' || bg.indexOf('url(') < 0) continue;
					var m = bg.match(re);
					if (!m || !m[2]) continue;
					var url = m[2].trim();
					if (SEC.isSafeUrl(url)) {
						var abs = SEC.absUrl(url);
						if (SEC.guessKind(abs) === 'image') urls.push(abs);
					}
				} catch (ee) {}
			}
			idx = end;
			if (idx < limit) U.rIC(batch, { timeout: 50 });
			else cb(urls);
		}
		U.rIC(batch, { timeout: 50 });
	};

					Scanner.buildUnifiedList = function (parts) {
		var p = parts || {};
		var all = [];
		function push(arr, type, source) {
			if (!arr) return;
			for (var i = 0; i < arr.length; i++) {
				if (arr[i]) all.push({ url: arr[i], type: type, source: source });
			}
		}
		push(p.imgUrls, 'image', 'dom');
		push(p.bgImgs, 'image', 'dom');
		if (NetHook && NetHook.hits) {
			NetHook.hits.forEach(function (u) {
				var k = SEC.guessKind(u);
				if (k === 'image' || k === 'video' || k === 'audio' || k === 'm3u8') {
					all.push({ url: u, type: k, source: 'network' });
				}
			});
		}
		push(p.vidUrls, 'video', 'dom');
		push(p.audUrls, 'audio', 'dom');
		push(p.m3u8Urls, 'm3u8', 'dom');
		if (p.vidLinks) {
			for (var l = 0; l < p.vidLinks.length; l++) {
				var vl = p.vidLinks[l];
				all.push({ url: vl.url, type: 'stream', source: 'link', title: vl.title, site: vl });
			}
		}
		return all;
	};

			Scanner.mergeWithNetHits = function (domUrls, kind) {
		var out = (domUrls || []).slice();
		if (NetHook && NetHook.hits) {
			NetHook.hits.forEach(function (u) {
				if (SEC.guessKind(u) === kind) out.push(u);
			});
		}
		return U.uniq(out);
	};

	Scanner.doFull = function (cb) {
				if (typeof Diag !== 'undefined') Diag.stats.fullScanCount++;
		if (typeof Diag !== 'undefined') Diag.stats.fullScanLastAt = U.now();
		var _diagT0 = U.monoNow();
		LOG.info('开始全量扫描...');
				function diagFinish() {
			if (typeof Diag !== 'undefined') Diag.stats.fullScanLastMs = Math.round(U.monoNow() - _diagT0);
															if (typeof Diag !== 'undefined') Diag.stats.fullScanLastFound = State.images.length + State.videos.length + State.audios.length + State.m3u8.length; 
		}
		if (State.scanner) {
			State.scanner.scan().then(function () {
				LOG.info('扫描完成: 图片', State.images.length, '视频', State.videos.length, '音频', State.audios.length, 'm3u8', State.m3u8.length, '视频链接', State.videoLinks.length);
				diagFinish();
				if (cb) cb();
			}).catch(function (e) {
				LOG.warn('ScannerService.scan 失败:', e);
				diagFinish();
				if (cb) cb();
			});
			return;
		}

				var imgUrls = Scanner.scanImages();
		var vidUrls = Scanner.scanVideos();
		var audUrls = Scanner.scanAudios();
		var m3u8Urls = Scanner.scanM3u8();
		var vidLinks = Scanner.scanVideoLinks();
		Scanner.scanBackgroundsAsync(function (bgImgs) {
			State.images = Scanner.mergeWithNetHits(imgUrls.concat(bgImgs), 'image');
			State.videos = Scanner.mergeWithNetHits(vidUrls, 'video');
			State.audios = Scanner.mergeWithNetHits(audUrls, 'audio');
			State.m3u8 = Scanner.mergeWithNetHits(m3u8Urls, 'm3u8');
			State.videoLinks = vidLinks;
			Plugins.filterResources();
			LOG.info('扫描完成: 图片', State.images.length, '视频', State.videos.length, '音频', State.audios.length, 'm3u8', State.m3u8.length, '视频链接', State.videoLinks.length);
			diagFinish();
			if (cb) cb();
			if (State.config.enableSync) State._broadcast({ type: 'resources', data: { images: State.images, videos: State.videos, audios: State.audios, m3u8: State.m3u8, videoLinks: State.videoLinks } });
		});
	};

		return Scanner;
	})();
	var ScannerService = (function () {
		'use strict';
		var ScannerService = (function () {
		function extend(target, source) {
			if (!source) return target;
			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
			}
			return target;
		}
		function isFn(x) { return typeof x === 'function'; }
		function isStr(x) { return typeof x === 'string'; }
		function now() { return Date.now ? Date.now() : +new Date(); }
		function hashId(url, type) {
			var s = (url || '') + '|' + (type || '');
			var h = 0;
			for (var i = 0; i < s.length; i++) {
				h = ((h << 5) - h) + s.charCodeAt(i);
				h |= 0;
			}
			return 'r-' + (h < 0 ? 'n' + (-h) : h);
		}

				var WORKER_SCRIPT = [
			'self.onmessage = function(e) {',
			'  var data = e.data;',
			'  var items = data.items || [];',
			'  var seen = {};',
			'  var results = [];',
			'  for (var i = 0; i < items.length; i++) {',
			'    var it = items[i];',
			'    if (!it || !it.url) continue;',
			'    var key = it.url + "|" + it.type;',
			'    if (seen[key]) continue;',
			'    seen[key] = true;',
			'    results.push(it);',
			'  }',
			'  self.postMessage({id:data.id, results:results});',
			'};'
		].join('\n');

		function createWorkerUrl() {
			try {
				var blob = new Blob([WORKER_SCRIPT], { type: 'application/javascript' });
				return URL.createObjectURL(blob);
			} catch (e) { return null; }
		}

		function runWorker(workerUrl, items, cb) {
			if (!workerUrl) { cb(null, items); return; }
			try {
				var worker = new Worker(workerUrl);
				var done = false;
				var id = 'w-' + now() + '-' + Math.random().toString(36).slice(2, 6);
				function cleanup() {
					done = true;
					try { worker.terminate(); } catch (e) {}
				}
				worker.onmessage = function (e) {
					if (done) return;
					if (e.data && e.data.id === id) {
						cleanup();
						cb(null, e.data.results || items);
					}
				};
				worker.onerror = function () {
					if (done) return;
					cleanup();
					cb(null, items);
				};
				worker.postMessage({ id: id, items: items });
				setTimeout(function () {
					if (!done) { cleanup(); cb(null, items); }
				}, 10000);
			} catch (e) { cb(null, items); }
		}

				var PlatformAdapters = {};

				PlatformAdapters.youtube = {
			name: 'youtube',
			match: function (ctx) { return /youtube\.com/.test(ctx.location.href); },
			parse: function (ctx) {
				var items = [];
				try {
					var yt = window.ytInitialPlayerResponse || window.ytInitialPlayerConfig;
					if (!yt && window.ytplayer && window.ytplayer.config) yt = window.ytplayer.config.args;
					if (yt && yt.streamingData) {
						var formats = [].concat(yt.streamingData.formats || [], yt.streamingData.adaptiveFormats || []);
						var title = (yt.videoDetails && yt.videoDetails.title) || '';
						for (var i = 0; i < formats.length; i++) {
							var f = formats[i];
							if (f && f.url) {
								items.push({
									url: f.url,
									type: /audio/.test(f.mimeType || '') ? 'audio' : 'video',
									title: title,
									quality: f.qualityLabel || f.quality || '',
									source: 'platform',
									platform: 'youtube'
								});
							}
						}
					}
				} catch (e) {}
				return items;
			}
		};

				PlatformAdapters.bilibili = {
			name: 'bilibili',
			match: function (ctx) { return /bilibili\.com/.test(ctx.location.href); },
			parse: function (ctx) {
				var items = [];
				try {
					var info = window.__playinfo__;
					if (info && info.data) {
						var dash = info.data.dash;
						var title = '';
						try { title = document.title.replace(/_哔哩哔哩.*$/, '').trim(); } catch (e) {}
						if (dash) {
							if (dash.video) {
								for (var i = 0; i < dash.video.length; i++) {
									var v = dash.video[i];
									if (v.baseUrl) items.push({ url: v.baseUrl, type: 'video', title: title, quality: String(v.id), source: 'platform', platform: 'bilibili' });
								}
							}
							if (dash.audio) {
								for (var j = 0; j < dash.audio.length; j++) {
									var a = dash.audio[j];
									if (a.baseUrl) items.push({ url: a.baseUrl, type: 'audio', title: title, quality: String(a.id), source: 'platform', platform: 'bilibili' });
								}
							}
						}
						if (info.data.durl) {
							for (var k = 0; k < info.data.durl.length; k++) {
								var d = info.data.durl[k];
								if (d.url) items.push({ url: d.url, type: 'video', title: title, source: 'platform', platform: 'bilibili' });
							}
						}
					}
				} catch (e) {}
				return items;
			}
		};

				PlatformAdapters.twitter = {
			name: 'twitter',
			match: function (ctx) { return /(twitter\.com|x\.com)/.test(ctx.location.href); },
			parse: function (ctx) {
				var items = [];
				try {
					var scripts = document.querySelectorAll('script');
					for (var i = 0; i < scripts.length; i++) {
						var text = scripts[i].textContent || '';
						var re = /https:\/\/video\.twimg\.com\/[^"'<>\s]+/g;
						var m;
						while ((m = re.exec(text)) !== null) {
							items.push({ url: m[0], type: 'video', source: 'platform', platform: 'twitter' });
						}
					}
					var metas = document.querySelectorAll('meta[property="og:video"], meta[property="og:video:secure_url"]');
					for (var j = 0; j < metas.length; j++) {
						var u = metas[j].getAttribute('content');
						if (u) items.push({ url: u, type: 'video', source: 'platform', platform: 'twitter' });
					}
				} catch (e) {}
				return items;
			}
		};

				PlatformAdapters.vimeo = {
			name: 'vimeo',
			match: function (ctx) { return /vimeo\.com/.test(ctx.location.href); },
			parse: function (ctx) {
				var items = [];
				try {
					var config = window.vimeo && window.vimeo.clip_page_config;
					if (config && config.player) {
						var p = config.player;
						if (p.config_url) items.push({ url: p.config_url, type: 'video', source: 'platform', platform: 'vimeo' });
					}
					var iframes = document.querySelectorAll('iframe[src*="player.vimeo.com"]');
					for (var i = 0; i < iframes.length; i++) {
						var src = iframes[i].getAttribute('src');
						if (src) items.push({ url: src, type: 'video', source: 'platform', platform: 'vimeo' });
					}
				} catch (e) {}
				return items;
			}
		};

		function ScannerService(options) {
			this.config = {
				useWorker: true,
				incremental: true,
				observerThrottleMs: 500,
				adapterPriority: ['youtube', 'bilibili', 'twitter', 'vimeo'],
				enableLegacy: true
			};
			extend(this.config, options || {});
			this._adapters = {};
			this._customAdapters = [];
			this._results = [];
			this._seen = {};
			this._scanning = false;
			this._observer = null;
			this._workerUrl = createWorkerUrl();
			this._pendingFlush = null;
			this._initBuiltInAdapters();
		}

		ScannerService.prototype._initBuiltInAdapters = function () {
			for (var name in PlatformAdapters) {
				if (Object.prototype.hasOwnProperty.call(PlatformAdapters, name)) {
					this._adapters[name] = PlatformAdapters[name];
				}
			}
		};

		ScannerService.prototype.registerAdapter = function (adapter) {
			if (!adapter || !isStr(adapter.name) || !isFn(adapter.match) || !isFn(adapter.parse)) return this;
			this._customAdapters.push(adapter);
			this._adapters[adapter.name] = adapter;
			return this;
		};

		ScannerService.prototype._runAdapters = function () {
			var ctx = { location: window.location, document: document };
			var items = [];
			var order = this.config.adapterPriority || [];
			var handled = false;
			for (var i = 0; i < order.length; i++) {
				var name = order[i];
				var adapter = this._adapters[name];
				if (adapter && adapter.match(ctx)) {
					try {
						var res = adapter.parse(ctx);
						if (res && res.length > 0) {
							items = items.concat(res);
							handled = true;
						}
					} catch (e) { LOG.warn('Scanner adapter error:', name, e); }
				}
			}
			for (var j = 0; j < this._customAdapters.length; j++) {
				var ca = this._customAdapters[j];
				if (ca.match(ctx)) {
					try {
						var cres = ca.parse(ctx);
						if (cres && cres.length > 0) items = items.concat(cres);
					} catch (e) { LOG.warn('Scanner custom adapter error:', ca.name, e); }
				}
			}
			return { items: items, handled: handled };
		};

		ScannerService.prototype._normalizeItems = function (rawItems, defaultSource) {
			var items = [];
			for (var i = 0; i < rawItems.length; i++) {
				var it = rawItems[i];
				if (!it || !it.url) continue;
				var url = it.url;
				try { url = SEC.absUrl(url); } catch (e) {}
				var type = it.type || SEC.guessKind(url) || 'video';
				var id = it.id || hashId(url, type);
				if (this._seen[id]) continue;
				this._seen[id] = true;
				items.push({
					id: id,
					url: url,
					type: type,
					title: it.title || '',
					pageUrl: it.pageUrl || window.location.href,
					source: it.source || defaultSource || 'dom',
					quality: it.quality || '',
					size: it.size || 0,
					platform: it.platform || '',
					site: it.site || null,
					timestamp: now()
				});
			}
			return items;
		};

		ScannerService.prototype._legacyScan = function (cb) {
			var self = this;
			if (!self.config.enableLegacy) { cb(); return; }
			var imgUrls = Scanner.scanImages();
			var vidUrls = Scanner.scanVideos();
			var audUrls = Scanner.scanAudios();
			var m3u8Urls = Scanner.scanM3u8();
			var vidLinks = Scanner.scanVideoLinks();
			Scanner.scanBackgroundsAsync(function (bgImgs) {
				cb(Scanner.buildUnifiedList({
					imgUrls: imgUrls, bgImgs: bgImgs, vidUrls: vidUrls,
					audUrls: audUrls, m3u8Urls: m3u8Urls, vidLinks: vidLinks
				}));
			});
		};

		ScannerService.prototype.scan = function (options) {
			var self = this;
			return new Promise(function (resolve) {
				self._scanning = true;
				var opts = extend({ reset: true }, options || {});
				if (opts.reset) { self._results = []; self._seen = {}; }
				var adapterRes = self._runAdapters();
				self._legacyScan(function (legacyItems) {
					var all = legacyItems.concat(adapterRes.items || []);
					var normalized = self._normalizeItems(all, 'dom');
					if (self.config.useWorker && self._workerUrl) {
						runWorker(self._workerUrl, normalized, function (err, results) {
							self._mergeResults(results);
							self._syncState();
							self._scanning = false;
							resolve(self.results.slice());
						});
					} else {
						self._mergeResults(normalized);
						self._syncState();
						self._scanning = false;
						resolve(self.results.slice());
					}
				});
			});
		};

		ScannerService.prototype.scanIncremental = function (options) {
			var self = this;
			return new Promise(function (resolve) {
				var adapterRes = self._runAdapters();
				var legacyItems = [];
				if (self.config.enableLegacy) {
					var imgUrls = Scanner.scanImages();
					var vidUrls = Scanner.scanVideos();
					var audUrls = Scanner.scanAudios();
					var m3u8Urls = Scanner.scanM3u8();
					for (var i = 0; i < imgUrls.length; i++) legacyItems.push({ url: imgUrls[i], type: 'image', source: 'dom' });
					for (var v = 0; v < vidUrls.length; v++) legacyItems.push({ url: vidUrls[v], type: 'video', source: 'dom' });
					for (var a = 0; a < audUrls.length; a++) legacyItems.push({ url: audUrls[a], type: 'audio', source: 'dom' });
					for (var m = 0; m < m3u8Urls.length; m++) legacyItems.push({ url: m3u8Urls[m], type: 'm3u8', source: 'dom' });
				}
				var all = legacyItems.concat(adapterRes.items || []);
				var normalized = self._normalizeItems(all, 'dom');
				self._mergeResults(normalized);
				self._syncState();
				resolve(self.results.slice());
			});
		};

		ScannerService.prototype._mergeResults = function (items) {
			for (var i = 0; i < items.length; i++) this._results.push(items[i]);
			try { State.addHistory(items); } catch (e) { LOG.warn('add history failed', e); }
		};

		ScannerService.prototype._syncState = function () {
			var images = [], videos = [], audios = [], m3u8 = [], videoLinks = [];
			for (var i = 0; i < this._results.length; i++) {
				var r = this._results[i];
				if (r.type === 'image') images.push(r.url);
				else if (r.type === 'video') videos.push(r.url);
				else if (r.type === 'audio') audios.push(r.url);
				else if (r.type === 'm3u8') m3u8.push(r.url);
				else if (r.type === 'stream' || r.site) {
					// 修复：r.site 在部分来源里是**站点 key 字符串**（SEC 扫描产出），
					// 直接 push 会让渲染层拿不到 url / title —— 卡片空白，
					// 且带搜索词时 v.title.toLowerCase() 抛 TypeError，
					// 导致整个视频 Tab 渲染中断（解析 / 多选 / 预览全部失效）。
					// 这里统一归一化成对象。
					var _lo = (r.site && typeof r.site === 'object') ? r.site : r;
					videoLinks.push({
						url: _lo.url || '',
						title: _lo.title || '',
						cover: _lo.cover || '',
						siteName: _lo.siteName || '',
						siteIcon: _lo.siteIcon || ''
					});
				}
			}
			State.images = U.uniq(images);
			State.videos = U.uniq(videos);
			State.audios = U.uniq(audios);
			State.m3u8 = U.uniq(m3u8);
			State.videoLinks = videoLinks;
			Plugins.filterResources();
			if (State.config.enableSync) {
				State._broadcast({ type: 'resources', data: { images: State.images, videos: State.videos, audios: State.audios, m3u8: State.m3u8, videoLinks: State.videoLinks } });
			}
		};

		ScannerService.prototype.start = function () {
												this._scanning = true;
			LOG.info('ScannerService 已启动');
			return this;
		};

		ScannerService.prototype.stop = function () {
			this._scanning = false;
			if (this._observer) {
				try { this._observer.disconnect(); } catch (e) {}
				this._observer = null;
			}
			return this;
		};

		ScannerService.prototype.destroy = function () {
			this.stop();
			if (this._workerUrl) { try { URL.revokeObjectURL(this._workerUrl); } catch (e) {} }
			this._results = [];
			this._seen = {};
			return this;
		};

		Object.defineProperty(ScannerService.prototype, 'results', {
			get: function () { return this._results.slice(); }
		});

		Object.defineProperty(ScannerService.prototype, 'scanning', {
			get: function () { return this._scanning; }
		});

		return ScannerService;
	})();

		function createScanner(options) { return new ScannerService(options); }
		ScannerService.create = createScanner;
		return ScannerService;
	})();
	var createScanner = ScannerService.create;
	var DownloadManager = (function () {
		'use strict';
		var DownloadManager = (function () {
		function extend(target, source) {
			if (!source) return target;
			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
			}
			return target;
		}

		function isNum(x) { return typeof x === 'number' && !isNaN(x); }
		function isStr(x) { return typeof x === 'string'; }
		function isFn(x) { return typeof x === 'function'; }
		function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

				var WORKER_SCRIPT = [
			'self.onmessage = function(e) {',
			'  var data = e.data;',
			'  var xhr = new XMLHttpRequest();',
			'  xhr.open("GET", data.url, true);',
			'  xhr.responseType = "arraybuffer";',
			'  xhr.timeout = data.timeout || 30000;',
			'  if (data.headers) {',
			'    for (var k in data.headers) {',
			'      try { xhr.setRequestHeader(k, data.headers[k]); } catch(err) {}',
			'    }',
			'  }',
			'  if (typeof data.start === "number" && typeof data.end === "number") {',
			'    xhr.setRequestHeader("Range", "bytes=" + data.start + "-" + data.end);',
			'  }',
			'  xhr.onload = function() {',
			'    if (xhr.status >= 200 && xhr.status < 300) {',
			'      self.postMessage({id:data.id, seq:data.seq, start:data.start, end:data.end, status:xhr.status, buffer:xhr.response}, [xhr.response]);',
			'    } else {',
			'      self.postMessage({id:data.id, seq:data.seq, error:"HTTP " + xhr.status});',
			'    }',
			'  };',
			'  xhr.onerror = function() { self.postMessage({id:data.id, seq:data.seq, error:"network error"}); };',
			'  xhr.ontimeout = function() { self.postMessage({id:data.id, seq:data.seq, error:"timeout"}); };',
			'  xhr.send();',
			'};'
		].join('\n');

		function createWorkerBlobUrl() {
			try {
				var blob = new Blob([WORKER_SCRIPT], { type: 'application/javascript' });
				return URL.createObjectURL(blob);
			} catch (e) {
				return null;
			}
		}

		function DownloadManager(options) {
			this.config = {
				maxConcurrent: 3,
				chunkSize: 2 * 1024 * 1024,
				threads: 4,
				threshold: 10 * 1024 * 1024,
				retry: 3,
				dbName: 'MediaSnifferDownloads',
				storeTasks: 'tasks',
				storeHistory: 'history',
				historyLimit: 200
			};
			extend(this.config, options || {});
			this._backends = {};
			this._queue = [];
			this._running = 0;
			this._tasks = {};
			this._history = [];
			this._db = null;
			this._workerUrl = createWorkerBlobUrl();
			this._initDefaultBackends();
			this._initDB(this._loadHistory.bind(this));
		}

				DownloadManager.prototype._initDB = function (cb) {
			var self = this;
			var idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
			if (!idb) { if (cb) cb(); return; }
			try {
				var req = idb.open(self.config.dbName, 1);
				req.onupgradeneeded = function (e) {
					var db = e.target.result;
					if (!db.objectStoreNames.contains(self.config.storeTasks)) db.createObjectStore(self.config.storeTasks, { keyPath: 'id' });
					if (!db.objectStoreNames.contains(self.config.storeHistory)) db.createObjectStore(self.config.storeHistory, { keyPath: 'id' });
				};
				req.onsuccess = function (e) {
					self._db = e.target.result;
					if (cb) cb();
				};
				req.onerror = function () {
					LOG.warn('DownloadManager: IndexedDB open failed');
					if (cb) cb();
				};
			} catch (err) {
				LOG.warn('DownloadManager: IndexedDB init error', err);
				if (cb) cb();
			}
		};

		DownloadManager.prototype._dbTransaction = function (storeName, mode) {
			if (!this._db) return null;
			try { return this._db.transaction([storeName], mode).objectStore(storeName); }
			catch (e) { return null; }
		};

		DownloadManager.prototype._dbPut = function (storeName, data, cb) {
			var store = this._dbTransaction(storeName, 'readwrite');
			if (!store) { if (cb) cb(new Error('no store')); return; }
			try {
				var req = store.put(data);
				req.onsuccess = function () { if (cb) cb(); };
				req.onerror = function (e) { if (cb) cb(e.target.error); };
			} catch (e) { if (cb) cb(e); }
		};

		DownloadManager.prototype._dbGet = function (storeName, id, cb) {
			var store = this._dbTransaction(storeName, 'readonly');
			if (!store) { if (cb) cb(new Error('no store')); return; }
			try {
				var req = store.get(id);
				req.onsuccess = function (e) { if (cb) cb(null, e.target.result); };
				req.onerror = function (e) { if (cb) cb(e.target.error); };
			} catch (e) { if (cb) cb(e); }
		};

		DownloadManager.prototype._dbDelete = function (storeName, id, cb) {
			var store = this._dbTransaction(storeName, 'readwrite');
			if (!store) { if (cb) cb(new Error('no store')); return; }
			try {
				var req = store.delete(id);
				req.onsuccess = function () { if (cb) cb(); };
				req.onerror = function (e) { if (cb) cb(e.target.error); };
			} catch (e) { if (cb) cb(e); }
		};

		DownloadManager.prototype._dbGetAll = function (storeName, cb) {
			var store = this._dbTransaction(storeName, 'readonly');
			if (!store) { if (cb) cb([]); return; }
			try {
				var req = store.getAll();
				req.onsuccess = function (e) { if (cb) cb(e.target.result || []); };
				req.onerror = function () { if (cb) cb([]); };
			} catch (e) { if (cb) cb([]); }
		};

		DownloadManager.prototype._loadHistory = function () {
			var self = this;
			this._dbGetAll(this.config.storeHistory, function (records) {
				records = records || [];
				records.sort(function (a, b) { return (a.time || 0) - (b.time || 0); });
				self._history = records;
				while (self._history.length > self.config.historyLimit) {
					var old = self._history.shift();
					if (old && old.id) self._dbDelete(self.config.storeHistory, old.id);
				}
								try {
					if (State && State.downloadHistory) {
						State.downloadHistory = self._history.slice();
					}
				} catch (e) {}
			});
		};

		DownloadManager.prototype._addHistory = function (record) {
			record.id = record.id || ('h-' + U.now() + '-' + Math.random().toString(36).slice(2, 8));
			record.time = record.time || U.now();
			this._history.push(record);
			while (this._history.length > this.config.historyLimit) {
				var old = this._history.shift();
				if (old && old.id) this._dbDelete(this.config.storeHistory, old.id);
			}
			this._dbPut(this.config.storeHistory, record);
						try {
				if (State && State.downloadHistory) {
					State.downloadHistory.push(record);
					while (State.downloadHistory.length > this.config.historyLimit) State.downloadHistory.shift();
				}
			} catch (e) {}
		};

		DownloadManager.prototype._updateTaskStore = function (task) {
			if (!task || !task.id) return;
			var snapshot = {
				id: task.id,
				url: task.url,
				filename: task.filename,
				state: task.state,
				progress: task.progress,
				chunks: task.chunks,
				totalBytes: task.totalBytes,
				backend: task.backend,
				meta: task.meta,
				updatedAt: U.now()
			};
			this._dbPut(this.config.storeTasks, snapshot);
		};

		DownloadManager.prototype._removeTaskStore = function (id) {
			this._dbDelete(this.config.storeTasks, id);
		};

				DownloadManager.prototype.registerBackend = function (name, factory) {
			if (!isStr(name) || !isFn(factory)) return this;
			this._backends[name] = factory;
			return this;
		};

		DownloadManager.prototype._getBackend = function (name) {
			return this._backends[name] || null;
		};

		DownloadManager.prototype._initDefaultBackends = function () {
			var self = this;

						this.registerBackend('http', function (task, callbacks, ctx) {
				return new HttpBackend(task, callbacks, ctx, self._workerUrl);
			});

						this.registerBackend('aria2', function (task, callbacks, ctx) {
				return new Aria2Backend(task, callbacks, ctx);
			});

						this.registerBackend('blob', function (task, callbacks, ctx) {
				return new BlobBackend(task, callbacks, ctx);
			});

						this.registerBackend('stream', function (task, callbacks, ctx) {
				return new StreamBackend(task, callbacks, ctx);
			});

						this.registerBackend('m3u8', function (task, callbacks, ctx) {
				return new M3U8Backend(task, callbacks, ctx);
			});
		};

				DownloadManager.prototype.enqueue = function (items, callbacks) {
			callbacks = callbacks || {};
			if (!Array.isArray(items)) items = [items];
			var ids = [];
			for (var i = 0; i < items.length; i++) {
				var item = items[i] || {};
				var id = item.id || ('dm-' + U.now() + '-' + Math.random().toString(36).slice(2, 8));
				var task = {
					id: id,
					url: item.url,
					filename: item.filename,
					backend: item.backend || 'http',
					priority: isNum(item.priority) ? item.priority : 0,
					meta: item.meta || {},
					options: item.options || {},
					state: 'queued',
					progress: { loaded: 0, total: -1, percent: 0 },
					chunks: null,
					totalBytes: -1,
					controller: null,
																									_slotTaken: false,
					_slotReleased: false,
					_finished: false,
					callbacks: callbacks,
					createdAt: U.now()
				};
				this._tasks[id] = task;
				this._queue.push(task);
				ids.push(id);
			}
			this._sortQueue();
			this._schedule();
			return ids;
		};

		DownloadManager.prototype._sortQueue = function () {
			this._queue.sort(function (a, b) { return b.priority - a.priority; });
		};

		DownloadManager.prototype._schedule = function () {
			while (this._running < this.config.maxConcurrent && this._queue.length > 0) {
				var task = this._queue.shift();
				if (!task || task.state === 'cancelled') continue;
				this._startTask(task);
			}
		};

		DownloadManager.prototype._startTask = function (task) {
			var self = this;
			var factory = this._getBackend(task.backend);
			if (!factory) {
				task.state = 'error';
				self._emit(task, 'onError', { message: 'Unknown backend: ' + task.backend });
				self._finish(task);
				return;
			}
			task.state = 'running';
			this._running++;
									task._slotTaken = true;
			task._slotReleased = false;
			task._finished = false;
									var started = false;
			function abortStart(e) {
				LOG.error('启动下载任务失败:', e);
				task.state = 'error';
				self._emit(task, 'onError', { message: 'Backend start failed: ' + (e && e.message ? e.message : e) });
				self._finish(task, false);
			}
			var ctx = {
				config: self.config,
				updateProgress: function (loaded, total) { self._updateProgress(task, loaded, total); },
				updateChunks: function (chunks, totalBytes) { self._updateChunks(task, chunks, totalBytes); },
				getResumeRecord: function (cb) { self._dbGet(self.config.storeTasks, task.id, function (err, rec) { cb(err, rec); }); }
			};
			var controller = null;
			try {
			controller = factory(task, {
				onStart: function () { self._emit(task, 'onStart'); },
				onProgress: function (loaded, total) { self._updateProgress(task, loaded, total); },
				onComplete: function (result) {
					self._updateProgress(task, result.totalBytes || task.totalBytes, result.totalBytes || task.totalBytes);
					self._addHistory({ url: task.url, name: task.filename, time: U.now(), success: true, size: result.totalBytes, backend: task.backend });
					self._emit(task, 'onComplete', result);
					self._finish(task, true);
				},
				onError: function (error) {
															if (task.state === 'cancelled') { self._finish(task, false); return; }
					task.state = 'error';
					self._addHistory({ url: task.url, name: task.filename, time: U.now(), success: false, error: error.message, backend: task.backend });
					self._emit(task, 'onError', error);
					self._finish(task, false);
				},
				onPause: function () { task.state = 'paused'; self._emit(task, 'onPause'); },
				onResume: function () { task.state = 'running'; self._emit(task, 'onResume'); }
			}, ctx);
			} catch (eFactory) {
				abortStart(eFactory); 
				return;
			}
			task.controller = controller;
			this._updateTaskStore(task);
			try {
				if (controller && isFn(controller.start)) {
					controller.start();
					started = true;
				} else {
					abortStart(new Error('backend returned no controller'));
				}
			} catch (e) {
				if (started) throw e; 
				abortStart(e);
			}
		};

		DownloadManager.prototype._updateProgress = function (task, loaded, total) {
			if (!task) return;
			task.progress.loaded = loaded || 0;
			task.progress.total = total || -1;
			task.progress.percent = total > 0 ? Math.round(loaded / total * 100) : 0;
			task.totalBytes = total > 0 ? total : task.totalBytes;
			this._emit(task, 'onProgress', task.progress);
			this._updateTaskStore(task);
		};

		DownloadManager.prototype._updateChunks = function (task, chunks, totalBytes) {
			if (!task) return;
			task.chunks = chunks;
			if (totalBytes > 0) task.totalBytes = totalBytes;
			this._updateTaskStore(task);
		};

		DownloadManager.prototype._emit = function (task, eventName, arg1, arg2) {
			var cb = task.callbacks && task.callbacks[eventName];
			if (isFn(cb)) {
				try { cb(task.id, arg1, arg2); } catch (e) { LOG.warn('DownloadManager callback error', e); }
			}
			var globalCb = this._globalCallbacks && this._globalCallbacks[eventName];
			if (isFn(globalCb)) {
				try { globalCb(task.id, arg1, arg2); } catch (e) { LOG.warn('DownloadManager global callback error', e); }
			}
		};

				DownloadManager.prototype._releaseSlot = function (task) {
			if (!task || !task._slotTaken || task._slotReleased) return false;
			task._slotReleased = true;
			this._running = Math.max(0, this._running - 1);
			return true;
		};

		DownloadManager.prototype._finish = function (task, success) {
			if (!task) return;
												if (task._finished) return;
			task._finished = true;
			this._releaseSlot(task);
			if (success) {
				task.state = 'completed';
				this._removeTaskStore(task.id);
			}
			var self = this;
			setTimeout(function () { self._schedule(); }, 10);
		};

		DownloadManager.prototype.pause = function (id, cb) {
			var task = this._tasks[id];
			if (!task) { if (cb) cb(new Error('Task not found')); return false; }
			if (task.state === 'queued') {
				task.state = 'paused';
				if (cb) cb();
				return true;
			}
			if (task.controller && isFn(task.controller.pause)) {
				task.controller.pause(cb);
				return true;
			}
			if (cb) cb();
			return false;
		};

		DownloadManager.prototype.resume = function (id, cb) {
			var task = this._tasks[id];
			if (!task) { if (cb) cb(new Error('Task not found')); return false; }
			if (task.state === 'paused') {
				task.state = 'queued';
				this._queue.push(task);
				this._sortQueue();
				this._schedule();
				if (cb) cb();
				return true;
			}
			if (task.controller && isFn(task.controller.resume)) {
				task.controller.resume(cb);
				return true;
			}
			if (cb) cb();
			return false;
		};

		DownloadManager.prototype.cancel = function (id, cb) {
			var task = this._tasks[id];
			if (!task) { if (cb) cb(new Error('Task not found')); return false; }
			task.state = 'cancelled';
			var idx = this._queue.indexOf(task);
			if (idx >= 0) this._queue.splice(idx, 1);
			if (task.controller && isFn(task.controller.cancel)) {
																try { task.controller.cancel(cb); } catch (e) { if (cb) cb(e); }
			} else if (cb) {
				cb();
			}
			this._removeTaskStore(task.id);
			this._finish(task, false);
			return true;
		};

		DownloadManager.prototype.retry = function (id, cb) {
			var task = this._tasks[id];
			if (!task) { if (cb) cb(new Error('Task not found')); return false; }
			if (task.state !== 'error' && task.state !== 'cancelled') { if (cb) cb(new Error('Task not retryable')); return false; }
			task.state = 'queued';
			task.progress = { loaded: 0, total: -1, percent: 0 };
			task.chunks = null;
			task.totalBytes = -1;
			task.controller = null;
						task._slotTaken = false;
			task._slotReleased = false;
			task._finished = false;
			this._queue.push(task);
			this._sortQueue();
			this._schedule();
			if (cb) cb();
			return true;
		};

		DownloadManager.prototype.getQueue = function (cb) {
			var running = [];
			for (var id in this._tasks) {
				if (this._tasks[id].state !== 'completed' && this._tasks[id].state !== 'cancelled') {
					running.push(this._taskInfo(this._tasks[id]));
				}
			}
			if (cb) cb(running);
			return running;
		};

		DownloadManager.prototype.getHistory = function (cb, filter) {
			var list = this._history.slice();
			if (filter && isFn(filter)) list = list.filter(filter);
			if (cb) cb(list);
			return list;
		};

		DownloadManager.prototype.clearHistory = function (cb) {
			var self = this;
			this._history = [];
			var store = this._dbTransaction(this.config.storeHistory, 'readwrite');
			if (!store) { if (cb) cb(); return; }
			try {
				var req = store.clear();
				req.onsuccess = function () { if (cb) cb(); };
				req.onerror = function () { if (cb) cb(); };
			} catch (e) { if (cb) cb(); }
		};

		DownloadManager.prototype.configure = function (options) {
			extend(this.config, options || {});
			return this;
		};

		DownloadManager.prototype._taskInfo = function (task) {
			return {
				id: task.id,
				url: task.url,
				filename: task.filename,
				state: task.state,
				progress: task.progress,
				backend: task.backend,
				priority: task.priority,
				meta: task.meta,
				createdAt: task.createdAt
			};
		};

		DownloadManager.prototype.destroy = function () {
			for (var id in this._tasks) {
				if (this._tasks[id].state === 'running' && this._tasks[id].controller) {
					try { this._tasks[id].controller.cancel(); } catch (e) {}
				}
			}
			this._queue = [];
			this._tasks = {};
			this._running = 0;
			if (this._workerUrl) { try { URL.revokeObjectURL(this._workerUrl); } catch (e) {} }
			if (this._db) { try { this._db.close(); } catch (e) {} }
		};

				function HttpBackend(task, callbacks, ctx, workerUrl) {
			this.task = task;
			this.callbacks = callbacks;
			this.ctx = ctx;
			this.workerUrl = workerUrl;
			this.workers = [];
			this.paused = false;
			this.cancelled = false;
			this.chunks = [];
			this.totalBytes = -1;
			this.completedBytes = 0;
												this._cancelHooks = [];
			this.pendingChunks = 0;
			this.finishedChunks = 0;
			this.headers = {};
			this.retryMap = {};
			this._initHeaders();
		}

		HttpBackend.prototype._initHeaders = function () {
			var customHeaders = State.config.customHeaders || {};
			if (customHeaders.Referer) this.headers.Referer = customHeaders.Referer;
			if (customHeaders.UserAgent) this.headers['User-Agent'] = customHeaders.UserAgent;
			if (customHeaders.Cookie) this.headers.Cookie = customHeaders.Cookie;
			if (this.task.options && this.task.options.headers) extend(this.headers, this.task.options.headers);
		};

		HttpBackend.prototype.start = function () {
			var self = this;
			if (self.cancelled) return;
			if (isFn(self.callbacks.onStart)) self.callbacks.onStart();
			self._probeSize(function (total, supportsRange) {
				if (self.cancelled) return;
				self.totalBytes = total;
				var useChunk = supportsRange && total > self.ctx.config.threshold && self.ctx.config.threads > 1 && self.workerUrl;
				if (useChunk) {
					self._resumeOrStartChunks(total);
				} else {
					self._downloadSingle();
				}
			});
		};

		HttpBackend.prototype._probeSize = function (cb) {
			var self = this;
			var url = self.task.url;
			if (!url) { cb(-1, false); return; }
			var xhr = new XMLHttpRequest();
			xhr.open('HEAD', url, true);
			xhr.timeout = 15000;
			for (var k in self.headers) { try { xhr.setRequestHeader(k, self.headers[k]); } catch (e) {} }
			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4) return;
				var total = -1;
				var acceptRanges = false;
				try {
					var len = xhr.getResponseHeader('Content-Length');
					if (len) total = parseInt(len, 10);
					var ar = xhr.getResponseHeader('Accept-Ranges');
					if (ar && ar.indexOf('bytes') !== -1) acceptRanges = true;
				} catch (e) {}
				cb(total, acceptRanges);
			};
			xhr.onerror = function () { cb(-1, false); };
			xhr.ontimeout = function () { cb(-1, false); };
			xhr.send();
		};

		HttpBackend.prototype._resumeOrStartChunks = function (total) {
			var self = this;
			self.ctx.getResumeRecord(function (err, rec) {
				if (!err && rec && rec.chunks && rec.totalBytes === total) {
					self.chunks = rec.chunks;
															for (var i = 0; i < self.chunks.length; i++) {
						self.chunks[i].running = false;
						self.chunks[i].failed = false;
					}
				} else {
					self.chunks = self._makeChunks(total);
				}
				self._runChunked();
			});
		};

		HttpBackend.prototype._makeChunks = function (total) {
			var size = this.ctx.config.chunkSize;
			var chunks = [];
			for (var start = 0; start < total; start += size) {
				var end = Math.min(start + size - 1, total - 1);
				chunks.push({ start: start, end: end, done: false, running: false, failed: false, buffer: null });
			}
			return chunks;
		};

		HttpBackend.prototype._runChunked = function () {
			var self = this;
			var threads = clamp(self.ctx.config.threads, 1, 8);
			self.pendingChunks = 0;
															self.finishedChunks = 0;
			self.failedChunks = 0;
			for (var ci = 0; ci < self.chunks.length; ci++) {
				var c0 = self.chunks[ci];
				c0.running = false; 
				if (c0.failed) self.failedChunks++;
				else if (c0.done) self.finishedChunks++;
			}
			self._chunksSettled = false; 

												function settle() {
				if (self._chunksSettled) return true; 
				if (self.finishedChunks + self.failedChunks < self.chunks.length) return false;
				self._chunksSettled = true;
				if (self.failedChunks > 0) {
					var failedRanges = [];
					for (var i = 0; i < self.chunks.length; i++) {
						if (self.chunks[i].failed) failedRanges.push(self.chunks[i].start + '-' + self.chunks[i].end);
					}
					if (isFn(self.callbacks.onError)) {
						self.callbacks.onError({
							message: 'Chunk download failed (' + self.failedChunks + '/' + self.chunks.length + ' chunks): ' + failedRanges.join(',')
						});
					}
					self._cleanup();
				} else {
					self._mergeAndFinish();
				}
				return true;
			}

			function next() {
				if (self.cancelled) return;
				if (self.paused) return;
				var seq = self._nextPendingSeq();
				if (seq < 0) {
					if (self.pendingChunks === 0) settle();
					return;
				}
				var chunk = self.chunks[seq];
				self.pendingChunks++;
				self._downloadChunk(seq, chunk, function (err) {
					self.pendingChunks--;
																				if (self.cancelled) return;
					if (err) {
						chunk.failed = true; 
						self.failedChunks++;
					} else {
						self.finishedChunks++;
					}
					self._reportChunkProgress();
					if (!settle()) next();
				});
				if (self.pendingChunks < threads) next();
			}
			next();
		};

		HttpBackend.prototype._nextPendingSeq = function () {
			for (var i = 0; i < this.chunks.length; i++) {
				var ch = this.chunks[i];
				if (ch.done || ch.failed) continue; 
				if (!ch.running) return i;
			}
			return -1;
		};

		HttpBackend.prototype._reportChunkProgress = function () {
			var loaded = 0;
			for (var i = 0; i < this.chunks.length; i++) {
				if (this.chunks[i].done) loaded += (this.chunks[i].end - this.chunks[i].start + 1);
			}
			this.completedBytes = loaded;
			if (isFn(this.callbacks.onProgress)) this.callbacks.onProgress(loaded, this.totalBytes);
			if (isFn(this.ctx.updateChunks)) this.ctx.updateChunks(this.chunks, this.totalBytes);
		};

		HttpBackend.prototype._downloadChunk = function (seq, chunk, cb) {
			var self = this;
			chunk.running = true;
			var retries = self.retryMap[seq] || 0;
			var maxRetries = self.ctx.config.retry;

									var settled = false;
			function once(err) {
				if (settled) return;
				settled = true;
				cb(err);
			}

						var hook = function () { chunk.running = false; once('cancelled'); };
			self._cancelHooks.push(hook);
			function releaseHook() {
				var hi = self._cancelHooks.indexOf(hook);
				if (hi >= 0) self._cancelHooks.splice(hi, 1);
			}

			function attempt() {
				if (self.cancelled) { chunk.running = false; releaseHook(); once('cancelled'); return; }
				if (!self.workerUrl) {
										self._downloadChunkMainThread(seq, chunk, once);
					return;
				}
				var worker = null;
				try {
					worker = new Worker(self.workerUrl);
				} catch (e) {
					self._downloadChunkMainThread(seq, chunk, once);
					return;
				}
																self.workers.push(worker);
				var msg = {
					id: self.task.id,
					seq: seq,
					url: self.task.url,
					start: chunk.start,
					end: chunk.end,
					headers: self.headers,
					timeout: 30000
				};
				var done = false;
				function cleanup() {
					done = true;
					try { worker.removeEventListener('message', onMessage); } catch (e) {}
					try { worker.removeEventListener('error', onError); } catch (e) {}
					try { worker.terminate(); } catch (e) {}
										var wi = self.workers.indexOf(worker);
					if (wi >= 0) self.workers.splice(wi, 1);
					releaseHook();
				}
				function onMessage(e) {
					if (done) return;
					var data = e.data;
					if (data.error) {
						cleanup();
						if (retries < maxRetries) {
							retries++;
							self.retryMap[seq] = retries;
							setTimeout(attempt, 600 * retries);
						} else {
							chunk.running = false;
							releaseHook();
							once(data.error);
						}
						return;
					}
					chunk.buffer = data.buffer;
					chunk.done = true;
					chunk.running = false;
					cleanup();
					once();
				}
				function onError(e) {
					if (done) return;
					cleanup();
					if (retries < maxRetries) {
						retries++;
						self.retryMap[seq] = retries;
						setTimeout(attempt, 600 * retries);
					} else {
						chunk.running = false;
						releaseHook();
						once('worker error');
					}
				}
				worker.addEventListener('message', onMessage);
				worker.addEventListener('error', onError);
				try { worker.postMessage(msg, []); } catch (e) {
					cleanup();
					chunk.running = false;
					once('postMessage failed');
				}
			}
			attempt();
		};

		HttpBackend.prototype._downloadChunkMainThread = function (seq, chunk, cb) {
			var self = this;
									var called = false;
			function once(err) {
				if (called) return;
				called = true;
				cb(err);
			}
			var xhr = new XMLHttpRequest();
			xhr.open('GET', self.task.url, true);
			xhr.responseType = 'arraybuffer';
			xhr.timeout = 30000;
			for (var k in self.headers) { try { xhr.setRequestHeader(k, self.headers[k]); } catch (e) {} }
			xhr.setRequestHeader('Range', 'bytes=' + chunk.start + '-' + chunk.end);
			xhr.onload = function () {
																if (self.cancelled) { chunk.running = false; once('cancelled'); return; }
				if (xhr.status >= 200 && xhr.status < 300) {
					chunk.buffer = xhr.response;
					chunk.done = true;
					chunk.running = false;
					once();
				} else {
					chunk.running = false;
					once('HTTP ' + xhr.status);
				}
			};
			xhr.onerror = function () { chunk.running = false; once('network error'); };
			xhr.ontimeout = function () { chunk.running = false; once('timeout'); };
			xhr.send();
		};

		HttpBackend.prototype._mergeAndFinish = function () {
			var self = this;
			try {
				var buffers = [];
				for (var i = 0; i < self.chunks.length; i++) buffers.push(self.chunks[i].buffer);
				var blob = new Blob(buffers);
																Dl.deliverBlob(blob, self.task.filename, self.headers, function (err, blobUrl) {
					if (isFn(self.callbacks.onProgress)) self.callbacks.onProgress(self.totalBytes, self.totalBytes);
					if (isFn(self.callbacks.onComplete)) self.callbacks.onComplete({
						url: self.task.url, filename: self.task.filename, blob: blob, blobUrl: blobUrl,
						totalBytes: self.totalBytes, storage: blobUrl ? 'local' : 'nas'
					});
					self._cleanup();
				});
			} catch (e) {
				if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: 'Merge failed: ' + e.message });
			}
		};

		HttpBackend.prototype._downloadSingle = function () {
			var self = this;
															if (typeof GM_download === 'function' && !Dl.wantsNasSave()) {
				try {
																									var gmHeaders;
					for (var hk in self.headers) {
						if (Object.prototype.hasOwnProperty.call(self.headers, hk) && self.headers[hk]) {
							if (!gmHeaders) gmHeaders = {};
							gmHeaders[hk] = self.headers[hk];
						}
					}
					GM_download({
						url: self.task.url,
						name: self.task.filename,
						headers: gmHeaders,
						onload: function () {
														if (self.cancelled) return;
							if (isFn(self.callbacks.onProgress)) self.callbacks.onProgress(1, 1);
							if (isFn(self.callbacks.onComplete)) self.callbacks.onComplete({ url: self.task.url, filename: self.task.filename, totalBytes: -1 });
							self._cleanup();
						},
						onerror: function () { if (!self.cancelled) self._downloadSingleXHR(); }
					});
					return;
				} catch (e) { self._downloadSingleXHR(); }
			} else {
				self._downloadSingleXHR();
			}
		};

		HttpBackend.prototype._downloadSingleXHR = function () {
			var self = this;
			var xhr = new XMLHttpRequest();
			xhr.open('GET', self.task.url, true);
			xhr.responseType = 'arraybuffer';
			xhr.timeout = 60000;
			for (var k in self.headers) { try { xhr.setRequestHeader(k, self.headers[k]); } catch (e) {} }
			xhr.onprogress = function (e) {
				if (self.cancelled) { try { xhr.abort(); } catch (e2) {} return; }
				if (e.lengthComputable) self.totalBytes = e.total;
				if (isFn(self.callbacks.onProgress)) self.callbacks.onProgress(e.loaded, self.totalBytes);
			};
			xhr.onload = function () {
				if (self.cancelled) return;
				if (xhr.status >= 200 && xhr.status < 300) {
					var blob = new Blob([xhr.response]);
					Dl.deliverBlob(blob, self.task.filename, self.headers, function (err, blobUrl) {
						if (isFn(self.callbacks.onProgress)) self.callbacks.onProgress(xhr.response.byteLength, xhr.response.byteLength);
						if (isFn(self.callbacks.onComplete)) self.callbacks.onComplete({
							url: self.task.url, filename: self.task.filename, blob: blob, blobUrl: blobUrl,
							totalBytes: xhr.response.byteLength, storage: blobUrl ? 'local' : 'nas'
						});
						self._cleanup();
					});
				} else {
					if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: 'HTTP ' + xhr.status });
				}
			};
			xhr.onerror = function () { if (!self.cancelled && isFn(self.callbacks.onError)) self.callbacks.onError({ message: 'network error' }); };
			xhr.ontimeout = function () { if (!self.cancelled && isFn(self.callbacks.onError)) self.callbacks.onError({ message: 'timeout' }); };
			xhr.send();
		};

		HttpBackend.prototype.pause = function (cb) {
			this.paused = true;
												this._cleanup();
			if (isFn(this.callbacks.onPause)) this.callbacks.onPause();
			if (isFn(this.ctx.updateChunks)) this.ctx.updateChunks(this.chunks, this.totalBytes);
			if (cb) cb();
		};

		HttpBackend.prototype.resume = function (cb) {
			this.paused = false;
			if (isFn(this.callbacks.onResume)) this.callbacks.onResume();
			if (this.chunks && this.chunks.length > 0) this._runChunked();
			else this.start();
			if (cb) cb();
		};

		HttpBackend.prototype.cancel = function (cb) {
			this.cancelled = true;
			this.paused = false;
									var hooks = this._cancelHooks || [];
			this._cancelHooks = [];
			for (var i = 0; i < hooks.length; i++) {
				try { hooks[i](); } catch (e) {}
			}
			this.pendingChunks = 0;
			this._cleanup();
			if (cb) cb();
		};

		HttpBackend.prototype._cleanup = function () {
			for (var i = 0; i < this.workers.length; i++) {
				try { this.workers[i].terminate(); } catch (e) {}
			}
			this.workers = [];
		};

				function Aria2Backend(task, callbacks, ctx) {
			this.task = task;
			this.callbacks = callbacks;
			this.ctx = ctx;
			this.cancelled = false;
		}

		Aria2Backend.prototype.start = function () {
			var self = this;
			if (self.cancelled) return;
			if (isFn(self.callbacks.onStart)) self.callbacks.onStart();
			var rpcUrl = State.config.aria2RpcUrl;
			if (!rpcUrl) {
				if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: 'Aria2 RPC URL not set' });
				return;
			}
			var secret = State.config.aria2RpcSecret || '';
			var customHeaders = State.config.customHeaders || {};
			var headers = [];
			if (customHeaders.Referer) headers.push('Referer: ' + customHeaders.Referer);
			if (customHeaders.UserAgent) headers.push('User-Agent: ' + customHeaders.UserAgent);
			if (customHeaders.Cookie) headers.push('Cookie: ' + customHeaders.Cookie);
			var options = { out: self.task.filename, split: 16 };
			if (headers.length > 0) options.header = headers;
			var params = [[self.task.url], options];
			if (secret) params.unshift('token:' + secret);
			var body = JSON.stringify({ jsonrpc: '2.0', id: 'dm-' + self.task.id, method: 'aria2.addUri', params: params });
			if (typeof fetch !== 'function') {
				if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: 'fetch not supported' });
				return;
			}
			fetch(rpcUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body })
				.then(function (res) { return res.json(); })
				.then(function (data) {
					if (self.cancelled) return;
					if (data && data.error) {
						if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: data.error.message || 'Aria2 error' });
					} else {
						if (isFn(self.callbacks.onProgress)) self.callbacks.onProgress(0, -1);
						if (isFn(self.callbacks.onComplete)) self.callbacks.onComplete({ url: self.task.url, filename: self.task.filename, backend: 'aria2', gid: data.result });
					}
				})
				.catch(function (err) {
					if (self.cancelled) return;
					if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: err.message || 'Aria2 push failed' });
				});
		};

		Aria2Backend.prototype.pause = function (cb) { if (cb) cb(); };
		Aria2Backend.prototype.resume = function (cb) { this.start(); if (cb) cb(); };
		Aria2Backend.prototype.cancel = function (cb) { this.cancelled = true; if (cb) cb(); };

				function BlobBackend(task, callbacks, ctx) {
			this.task = task;
			this.callbacks = callbacks;
			this.ctx = ctx;
			this.cancelled = false;
		}

		BlobBackend.prototype.start = function () {
			var self = this;
			if (self.cancelled) return;
			if (isFn(self.callbacks.onStart)) self.callbacks.onStart();
			fetch(self.task.url)
				.then(function (resp) {
					if (self.cancelled) return null;
					if (!resp.ok) throw new Error('fetch failed');
					return resp.blob();
				})
				.then(function (blob) {
					if (self.cancelled || !blob) return;
					var blobUrl = URL.createObjectURL(blob);
					Dl.fallback(blobUrl, self.task.filename, null);
					setTimeout(function () { URL.revokeObjectURL(blobUrl); }, 60000);
					if (isFn(self.callbacks.onProgress)) self.callbacks.onProgress(blob.size, blob.size);
					if (isFn(self.callbacks.onComplete)) self.callbacks.onComplete({ url: self.task.url, filename: self.task.filename, blob: blob, blobUrl: blobUrl, totalBytes: blob.size });
				})
				.catch(function (err) {
					if (self.cancelled) return;
					Dl.fallback(self.task.url, self.task.filename, null);
					if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: err.message });
				});
		};

		BlobBackend.prototype.pause = function (cb) { if (cb) cb(); };
		BlobBackend.prototype.resume = function (cb) { this.start(); if (cb) cb(); };
		BlobBackend.prototype.cancel = function (cb) { this.cancelled = true; if (cb) cb(); };

				function StreamBackend(task, callbacks, ctx) {
			this.task = task;
			this.callbacks = callbacks;
			this.ctx = ctx;
			this.recorder = null;
			this.cancelled = false;
		}

		StreamBackend.prototype.start = function () {
			var self = this;
			if (self.cancelled) return;
			if (isFn(self.callbacks.onStart)) self.callbacks.onStart();
			try {
				var videoElement = self.task.options && self.task.options.videoElement;
				var stream = videoElement ? videoElement.srcObject : null;
				if (!stream || typeof MediaStream === 'undefined' || !(stream instanceof MediaStream)) {
					if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: 'No recordable MediaStream' });
					return;
				}
				var mimeTypes = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
				var mimeType = '';
				for (var i = 0; i < mimeTypes.length; i++) {
					if (MediaRecorder.isTypeSupported(mimeTypes[i])) { mimeType = mimeTypes[i]; break; }
				}
				if (!mimeType) {
					if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: 'MediaRecorder not supported' });
					return;
				}
				var recorder = new MediaRecorder(stream, { mimeType: mimeType });
				self.recorder = recorder;
				var chunks = [];
				recorder.ondataavailable = function (e) {
					if (e.data && e.data.size > 0) chunks.push(e.data);
				};
				recorder.onstop = function () {
					var ext = mimeType.indexOf('mp4') !== -1 ? 'mp4' : 'webm';
					var blob = new Blob(chunks, { type: mimeType.split(';')[0] });
					var blobUrl = URL.createObjectURL(blob);
					var filename = self.task.filename || ('record_' + U.dateStr() + '.' + ext);
					Dl.fallback(blobUrl, filename, null);
					setTimeout(function () { URL.revokeObjectURL(blobUrl); }, 60000);
					if (isFn(self.callbacks.onProgress)) self.callbacks.onProgress(blob.size, blob.size);
					if (isFn(self.callbacks.onComplete)) self.callbacks.onComplete({ url: self.task.url, filename: filename, blob: blob, blobUrl: blobUrl, totalBytes: blob.size });
				};
				recorder.onerror = function () {
					if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: 'Recording failed' });
				};
				recorder.start();
				var durationMs = self.task.options && self.task.options.durationMs ? self.task.options.durationMs : 10000;
				if (durationMs > 0) {
					setTimeout(function () {
						if (recorder.state !== 'inactive') recorder.stop();
					}, durationMs);
				}
			} catch (e) {
				if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: e.message });
			}
		};

		StreamBackend.prototype.pause = function (cb) {
			if (this.recorder && this.recorder.state === 'recording') { try { this.recorder.pause(); } catch (e) {} }
			if (cb) cb();
		};
		StreamBackend.prototype.resume = function (cb) {
			if (this.recorder && this.recorder.state === 'paused') { try { this.recorder.resume(); } catch (e) {} }
			if (cb) cb();
		};
		StreamBackend.prototype.cancel = function (cb) {
			this.cancelled = true;
			if (this.recorder && this.recorder.state !== 'inactive') { try { this.recorder.stop(); } catch (e) {} }
			if (cb) cb();
		};

				function M3U8Backend(task, callbacks, ctx) {
			this.task = task;
			this.callbacks = callbacks;
			this.ctx = ctx;
			this.cancelled = false;
		}

		M3U8Backend.prototype.start = function () {
			var self = this;
			if (self.cancelled) return;
			if (isFn(self.callbacks.onStart)) self.callbacks.onStart();
			try {
				M3U8.downloadAndMerge(
					self.task.url,
					{
						quality: State.config.m3u8Quality,
						concurrency: State.config.m3u8Concurrency
					},
					function (segDone, segTotal, segFailed) {
						if (self.cancelled) return;
						if (segTotal > 0 && isFn(self.callbacks.onProgress)) {
							self.callbacks.onProgress(segDone, segTotal);
						}
					},
					function (mergedData, err) {
						if (self.cancelled) return;
						if (err) {
							if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: err.message || 'm3u8 failed' });
						} else if (mergedData && mergedData.length > 0) {
							var blob = new Blob([mergedData], { type: 'video/mp2t' });
							LOG.info('m3u8 合并完成:', mergedData.length, '字节');
							Dl.deliverBlob(blob, self.task.filename, null, function (err, blobUrl) {
								if (isFn(self.callbacks.onProgress)) self.callbacks.onProgress(mergedData.length, mergedData.length);
								if (isFn(self.callbacks.onComplete)) self.callbacks.onComplete({
									url: self.task.url, filename: self.task.filename, blob: blob, blobUrl: blobUrl,
									totalBytes: mergedData.length, storage: blobUrl ? 'local' : 'nas'
								});
							});
						} else {
							if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: 'Empty m3u8 data' });
						}
					}
				);
			} catch (e) {
				if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: e.message });
			}
		};

		M3U8Backend.prototype.pause = function (cb) { if (cb) cb(); };
		M3U8Backend.prototype.resume = function (cb) { this.start(); if (cb) cb(); };
		M3U8Backend.prototype.cancel = function (cb) { this.cancelled = true; if (cb) cb(); };

		return DownloadManager;
	})();

		return DownloadManager;
	})();
	var Dl = (function () {
		'use strict';
		var Dl = {};
	Dl._usedNames = new Set();
	Dl._usedNamesLru = U.lru(Dl._usedNames, 500);

	Dl.uniqueName = function (name) {
		if (!name) return name;
		var orig = String(name);
		var m = orig.match(/^(.+?)(\.[a-z0-9]{1,8})?$/i);
		var base = m && m[1] ? m[1] : orig;
		var ext = m && m[2] ? m[2] : '';
		var n = 0;
		var candidate = orig;
		while (Dl._usedNames.has(candidate)) {
			n++;
			candidate = base + ' (' + n + ')' + ext;
		}
		Dl._usedNamesLru.set(candidate);
		return candidate;
	};

	Dl.buildName = function (url, idx, ext, tpl) {
		var template = tpl || State.config.nameTpl;
		var finalExt = ext || SEC.extFromUrl(url) || 'bin';
		var out = template
			.replace(/\{域名\}/gi, U.getHost())
			.replace(/\{日期\}/gi, U.dateStr())
			.replace(/\{序号\}/gi, String(idx).padStart(3, '0'))
			.replace(/\{后缀\}/gi, finalExt)
			.replace(/\{文件名\}/gi, SEC.nameFromUrl(url));
										var safe = SEC.safeFilename(out);
		var hasExt = safe.indexOf('.' + finalExt) !== -1 || /\.([a-z0-9]{1,8})$/i.test(safe);
		return safe + (hasExt ? '' : '.' + finalExt);
	};

	Dl._openUrl = function (url) {
		try { if (typeof GM_openInTab === 'function') { GM_openInTab(url, true); return; } } catch (e) {}
		try { window.open(url, '_blank'); } catch (e) {}
	};

	Dl._notifyDone = function (name, url) {
		if (!url) return;
		toast(LANG.t('dlDone', {name: name || url}), '#10b981', 3500, function () { Dl._openUrl(url); });
	};

		Dl.one = function (url, name, retry, headers, noAsk) {
		if (noAsk !== true && State.config.askBeforeDownload !== false) {
			var inputName = window.prompt(LANG.t('renamePrompt'), name || '');
			if (inputName === null) return;
			if (typeof inputName === 'string' && inputName.trim() !== '') name = inputName.trim();
		}
		var tries = retry == null ? State.config.batchRetry : retry;
		var finalName = name;
		var customHeaders = headers || State.config.customHeaders || {};
		function finish() { Dl._notifyDone(finalName, url); }
										function gmHeadersOf() {
			var h = null;
			for (var k in customHeaders) {
				if (!Object.prototype.hasOwnProperty.call(customHeaders, k)) continue;
				if (!customHeaders[k]) continue;
				if (!h) h = {};
				h[k] = customHeaders[k];
			}
			return h;
		}
		try {
			if (typeof GM_download === 'function') {
				try {
					GM_download({
						url: url,
						name: finalName,
						headers: gmHeadersOf(),
						onload: finish,
						onerror: function () {
							if (tries > 0) setTimeout(function () { Dl.one(url, finalName, tries - 1, headers, true); }, 600);
							else { Dl.fallback(url, finalName, headers); finish(); }
						}
					});
					return;
				} catch (ge) {}
			}
			Dl.fallback(url, finalName, headers);
			finish();
		} catch (e) { Dl.fallback(url, finalName, headers); finish(); }
	};
							Dl.wantsNasSave = function () {
		try {
			return !!State.config.webdavUploadDownloads
				&& typeof WebDAV !== 'undefined' && WebDAV.enabled && WebDAV.enabled();
		} catch (e) { return false; }
	};

												Dl.routeBlobToNas = function (blob, name, cb) {
		if (!blob || !Dl.wantsNasSave()) return false;
		try {
			WebDAV.uploadBlob(blob, name, function (err) { if (cb) cb(err || null); });
			return true;
		} catch (e) {
						LOG.warn('[Dl] NAS 上传发起失败，回退本地:', e);
			return false;
		}
	};

					Dl.deliverBlob = function (blob, name, headers, onSettled) {
		var settled = false;
		function settle(err, blobUrl) {
			if (settled) return;
			settled = true;
			if (typeof onSettled === 'function') onSettled(err || null, blobUrl || '');
		}
		var taken = Dl.routeBlobToNas(blob, name, function (nasErr) {
			if (!nasErr) {
				toast(LANG.t('webdavUploaded', { name: name }), '#10b981');
				settle(null, '');
				return;
			}
			toast(LANG.t('webdavUploadFailed', { e: nasErr.message }), '#ef4444');
			var u = '';
			try { u = URL.createObjectURL(blob); Dl.fallback(u, name, headers); } catch (e) {}
			settle(nasErr, u);
		});
		if (taken) return true;
		var localUrl = '';
		try { localUrl = URL.createObjectURL(blob); Dl.fallback(localUrl, name, headers); } catch (e) {}
		settle(null, localUrl);
		return false;
	};

	Dl.fallback = function (url, name, headers) {
		try {
			var a = document.createElement('a');
			a.href = url; a.download = name || ''; a.target = '_blank'; a.rel = 'noopener';
			(document.documentElement || document.body).appendChild(a);
			try { a.click(); } catch (e) { try { window.open(url, '_blank'); } catch (e2) {} }
			setTimeout(function () { try { a.remove(); } catch (e) {} }, 400);
		} catch (e) { try { window.open(url, '_blank'); } catch (e2) {} }
	};

		Dl.pushToAria2 = function (urls, kind) {
		var rpcUrl = State.config.aria2RpcUrl;
		if (!rpcUrl) { toast(LANG.t('aria2NoUrl'), '#f59e0b'); return; }
		if (!urls || urls.length === 0) { toast(LANG.t('plsCheck'), '#f59e0b'); return; }
		var secret = State.config.aria2RpcSecret || '';
		var customHeaders = State.config.customHeaders || {};
		var headers = [];
		if (customHeaders.Referer) headers.push('Referer: ' + customHeaders.Referer);
		if (customHeaders.UserAgent) headers.push('User-Agent: ' + customHeaders.UserAgent);
		if (customHeaders.Cookie) headers.push('Cookie: ' + customHeaders.Cookie);
		var sent = 0, failed = 0;
		function pushOne(i) {
			if (i >= urls.length) {
				if (failed > 0) toast(LANG.t('aria2PushFail') + ' (' + failed + ')', '#ef4444');
				else toast(LANG.t('aria2Pushed', {n: sent}));
				return;
			}
			var url = urls[i];
			var fileName = Dl.buildName(url, i + 1, '', State.config.nameTpl);
			var options = { out: fileName, split: 16 };
			if (headers.length > 0) options.header = headers;
			var params = [[url], options];
			if (secret) params.unshift('token:' + secret);
			var body = JSON.stringify({ jsonrpc: '2.0', id: 'ms-' + i, method: 'aria2.addUri', params: params });
			if (typeof fetch !== 'function') {
				failed++;
				pushOne(i + 1);
				return;
			}
			fetch(rpcUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: body
			}).then(function (res) { return res.json(); })
			  .then(function (data) {
				  if (data && data.error) { failed++; LOG.warn('Aria2 RPC error:', data.error); }
				  else sent++;
				  pushOne(i + 1);
			  })
			  .catch(function (err) {
				  failed++;
				  LOG.warn('Aria2 push failed:', err);
				  pushOne(i + 1);
			  });
		}
		pushOne(0);
	};

		Dl.downloadBlob = function (url, filename) {
		if (State.config.askBeforeDownload !== false) {
			var inputName = window.prompt(LANG.t('renamePrompt'), filename || '');
			if (inputName === null) return;
			if (typeof inputName === 'string' && inputName.trim() !== '') filename = inputName.trim();
		}
		try {
			fetch(url)
				.then(function (resp) {
					if (!resp.ok) throw new Error('fetch failed');
					return resp.blob();
				})
				.then(function (blob) {
					var blobUrl = URL.createObjectURL(blob);
					Dl.fallback(blobUrl, filename, null);
					Dl._notifyDone(filename, blobUrl);
					setTimeout(function () { URL.revokeObjectURL(blobUrl); }, 60000);
				})
				.catch(function (err) {
					LOG.warn('Blob download failed:', err);
					Dl.fallback(url, filename, null);
					Dl._notifyDone(filename, url);
				});
		} catch (e) {
			Dl.fallback(url, filename, null);
			Dl._notifyDone(filename, url);
		}
	};

		Dl.recordStream = function (videoElement, durationMs, filename) {
		try {
			var stream = videoElement ? videoElement.srcObject : null;
			if (!stream || typeof MediaStream === 'undefined' || !(stream instanceof MediaStream)) {
				toast('未找到可录制的媒体流', '#ef4444');
				return;
			}
			var mimeTypes = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
			var mimeType = '';
			for (var i = 0; i < mimeTypes.length; i++) {
				if (MediaRecorder.isTypeSupported(mimeTypes[i])) { mimeType = mimeTypes[i]; break; }
			}
			if (!mimeType) {
				toast('当前浏览器不支持 MediaRecorder 录制', '#ef4444');
				return;
			}
			var recorder = new MediaRecorder(stream, { mimeType: mimeType });
			var chunks = [];
			recorder.ondataavailable = function (e) {
				if (e.data && e.data.size > 0) chunks.push(e.data);
			};
			recorder.onstop = function () {
				var ext = mimeType.indexOf('mp4') !== -1 ? 'mp4' : 'webm';
				var blob = new Blob(chunks, { type: mimeType.split(';')[0] });
				var blobUrl = URL.createObjectURL(blob);
				Dl.fallback(blobUrl, filename || ('record_' + U.dateStr() + '.' + ext), null);
				setTimeout(function () { URL.revokeObjectURL(blobUrl); }, 60000);
			};
			recorder.onerror = function () {
				toast('录制失败', '#ef4444');
			};
			recorder.start();
			toast('直播/媒体流需要录制下载，开始录制...', '#6366f1');
			if (durationMs && durationMs > 0) {
				setTimeout(function () {
					if (recorder.state !== 'inactive') recorder.stop();
				}, durationMs);
			}
			return recorder;
		} catch (e) {
			LOG.warn('recordStream error:', e);
			toast('录制失败: ' + e.message, '#ef4444');
		}
	};

		Dl.batch = function (urls, kind, progressCb, doneCb) {
		if (!urls || urls.length === 0) { toast(LANG.t('noDlResource'), '#f59e0b'); return; }
		if (typeof Diag !== 'undefined') Diag.stats.downloadCount++;
		if (State.downloading) { toast(LANG.t('downloading'), '#f59e0b'); return; }
		State.downloading = true;
		var total = urls.length;
		var startTime = U.now();
		var done = 0, failed = 0;
		var lastUpdate = startTime, lastDone = 0;

		State.downloadProgress = { total: total, done: 0, failed: 0, speed: 0, eta: 0 };
		toast(LANG.t('batchStart', {n: total, c: State.config.batchConcurrency}));

		Dl._initDM();

		function updateProgress() {
			var now = U.now();
			var elapsed = now - lastUpdate;
			if (elapsed > 500) {
				var speed = (done - lastDone) / (elapsed / 1000);
				State.downloadProgress.done = done;
				State.downloadProgress.failed = failed;
				State.downloadProgress.speed = speed;
				State.downloadProgress.eta = speed > 0 ? (total - done) / speed : 0;
				lastUpdate = now;
				lastDone = done;
				if (progressCb) progressCb(State.downloadProgress);
			}
		}

										var finished = false;
		function finish() {
			if (finished) return;
			finished = true;
			State.downloading = false;
			State.downloadProgress = null;
			var elapsed = (U.now() - startTime) / 1000;
									var doneMsg = LANG.t('batchDone', {ok: total - failed, total: total, fail: failed, t: elapsed.toFixed(1)});
			if (failed > 0 && total - failed > 0) {
				doneMsg += ' · ' + LANG.t('batchSuccessN', {n: total - failed});
			}
			toast(doneMsg);
			if (doneCb) doneCb({ total: total, success: total - failed, failed: failed, elapsed: elapsed });
		}

		var items = [];
		for (var i = 0; i < urls.length; i++) {
			var url = urls[i];
			var kindNow = kind || SEC.guessKind(url);
			var backend = kindNow === 'm3u8' ? 'm3u8' : 'http';
			items.push({
				url: url,
				filename: Dl.uniqueName(Dl.buildName(url, i + 1, '', State.config.nameTpl)),
				backend: backend,
				priority: 0,
				meta: { index: i + 1, kind: kindNow, source: 'batch' },
				options: { kind: kindNow }
			});
		}

										var counted = {};
		Dl._dm.enqueue(items, {
			onComplete: function (id, result) {
				if (counted[id]) return;
				counted[id] = true;
				done++;
				updateProgress();
				if (done + failed >= total) finish();
			},
			onError: function (id, error) {
				if (counted[id]) return;
				counted[id] = true;
				failed++;
				updateProgress();
				if (done + failed >= total) finish();
			},
			onProgress: function (id, progress) {
				updateProgress();
			}
		});
	};

		Dl.stop = function () {
		State.downloading = false;
		State.downloadProgress = null;
				try { if (UI._vlpAbortMux) { UI._vlpAbortMux(); UI._vlpAbortMux = null; } } catch (eMux) {}
		if (Dl._dm) {
			var tasks = Dl._dm.getQueue();
			for (var i = 0; i < tasks.length; i++) {
				if (tasks[i].state === 'running' || tasks[i].state === 'queued' || tasks[i].state === 'paused') {
					Dl._dm.cancel(tasks[i].id);
				}
			}
		}
		toast(LANG.t('dlStopped'));
	};

		Dl._initDM = function () {
		if (!Dl._dm) {
			Dl._dm = new DownloadManager({
				maxConcurrent: Math.max(1, Math.min(8, State.config.batchConcurrency)),
				chunkSize: 1024 * 1024,
				threads: 4,
				threshold: 10 * 1024 * 1024,
				retry: State.config.batchRetry,
				historyLimit: 200
			});
		} else {
			Dl._dm.configure({
				maxConcurrent: Math.max(1, Math.min(8, State.config.batchConcurrency)),
				retry: State.config.batchRetry
			});
		}
		return Dl._dm;
	};

		Dl.getQueue = function () {
		return Dl._dm ? Dl._dm.getQueue().slice().sort(function (a, b) { return (a.createdAt || 0) - (b.createdAt || 0); }) : [];
	};
	Dl.pauseTask = function (id, cb) {
		if (!Dl._dm) { if (cb) cb(new Error('No download manager')); return false; }
		return Dl._dm.pause(id, cb);
	};
	Dl.resumeTask = function (id, cb) {
		if (!Dl._dm) { if (cb) cb(new Error('No download manager')); return false; }
		return Dl._dm.resume(id, cb);
	};
	Dl.cancelTask = function (id, cb) {
		if (!Dl._dm) { if (cb) cb(new Error('No download manager')); return false; }
		return Dl._dm.cancel(id, cb);
	};
	Dl.retryTask = function (id, cb) {
		if (!Dl._dm) { if (cb) cb(new Error('No download manager')); return false; }
		return Dl._dm.retry(id, cb);
	};

		Dl.generateScript = function (urls, format) {
				var script = '';
		var timestamp = U.dateStr();
		var domain = U.getHost();

		if (format === 'aria2') {
			script = '# aria2 批量下载脚本\n# 使用方法: aria2c -i download.txt\n# 生成时间: ' + timestamp + '\n\n';
			for (var i = 0; i < urls.length; i++) {
				var url = urls[i];
				var name = Dl.buildName(url, i + 1, '', State.config.nameTpl);
				script += url + '\n';
				script += '  out=' + name + '\n';
				script += '  split=16\n';
				if (State.config.customHeaders.Referer) script += '  header="Referer: ' + State.config.customHeaders.Referer + '"\n';
				script += '\n';
			}
		} else if (format === 'wget') {
			script = '# wget 批量下载脚本\n# 使用方法: wget -i download.txt\n# 生成时间: ' + timestamp + '\n\n';
			script += '--user-agent="Mozilla/5.0"\n';
			if (State.config.customHeaders.Referer) script += '--referer="' + State.config.customHeaders.Referer + '"\n';
			script += '\n';
			for (var i = 0; i < urls.length; i++) {
				var url = urls[i];
				var name = Dl.buildName(url, i + 1, '', State.config.nameTpl);
				script += '-O "' + name + '"\n';
				script += url + '\n\n';
			}
		} else if (format === 'python') {
			script = '# Python 批量下载脚本\n# 使用方法: python download.py\n# 生成时间: ' + timestamp + '\n\n';
			script += 'import urllib.request\nimport os\n\nurls = [\n';
			for (var i = 0; i < urls.length; i++) script += '    "' + urls[i] + '",\n';
			script += ']\n\nheaders = {"User-Agent": "Mozilla/5.0"}\n';
			if (State.config.customHeaders.Referer) script += 'headers["Referer"] = "' + State.config.customHeaders.Referer + '"\n';
			script += '\nfor i, url in enumerate(urls):\n    name = "' + domain + '_' + timestamp + '_{:03d}.bin".format(i+1)\n    try:\n        req = urllib.request.Request(url, headers=headers)\n        with urllib.request.urlopen(req) as resp:\n            with open(name, "wb") as f: f.write(resp.read())\n        print("[OK]", name)\n    except Exception as e: print("[ERR]", name, e)\n';
		} else {
			script = '# curl 批量下载脚本\n# 使用方法: bash download.sh\n# 生成时间: ' + timestamp + '\n\n';
			for (var i = 0; i < urls.length; i++) {
				var url = urls[i];
				var name = Dl.buildName(url, i + 1, '', State.config.nameTpl);
				script += 'curl -L -A "Mozilla/5.0"';
				if (State.config.customHeaders.Referer) script += ' -e "' + State.config.customHeaders.Referer + '"';
				script += ' -o "' + name + '" "' + url + '"\n';
			}
		}
		return script;
	};
		return Dl;
	})();
	var Selection = (function () {
		'use strict';
			var Selection = {};

		Selection._ensureState = function () {
		if (!State._favorites) {
			State._favorites = new Set();
			try {
												var arr = U.gmGetArray('ms_favorites_v1', []);
				for (var i = 0; i < arr.length; i++) State._favorites.add(arr[i]);
			} catch (e) { LOG.warn('load favorites failed', e); }
		}
		if (!State._selOrder) State._selOrder = [];
		if (!State._dedupKey) State._dedupKey = 'url';
		if (!State._groupRules) State._groupRules = {};
		if (!State._activeGroups) State._activeGroups = new Set();
		if (!State._batchActions) State._batchActions = {};
	};
	Selection._saveFavorites = function () {
		try {
			if (typeof GM_setValue === 'function' && State._favorites) {
				GM_setValue('ms_favorites_v1', JSON.stringify(Array.from(State._favorites)));
			}
		} catch (e) { LOG.warn('save favorites failed', e); }
	};

		Selection.add = function (id) { State.selected.add(id); };
	Selection.remove = function (id) { State.selected.delete(id); };
	Selection.toggle = function (id) {
		if (State.selected.has(id)) State.selected.delete(id);
		else State.selected.add(id);
	};
	Selection.clear = function () { State.selected.clear(); };

		Selection.enter = function () {
		Selection._ensureState();
		State.selectionMode = true;
		Selection._updateAllCards();
		Selection._refreshToolbar();
		try { if (navigator.vibrate) navigator.vibrate(15); } catch (e) {}
	};
	Selection.exit = function () {
		State.selectionMode = false;
		if (!State.config.persistSelection) State.selected.clear();
		State._lastSelIdx = null;
		State._lastSelState = false;
		Selection._updateAllCards();
		Selection._refreshToolbar();
	};

		Selection.toggleAll = function (list, value) {
		if (!list || list.length === 0) return;
		if (typeof value === 'undefined') {
			var allSelected = true;
			for (var i = 0; i < list.length; i++) {
				if (!State.selected.has(list[i])) { allSelected = false; break; }
			}
			value = !allSelected;
		}
		for (var j = 0; j < list.length; j++) {
			if (value) State.selected.add(list[j]);
			else State.selected.delete(list[j]);
		}
	};
	Selection.invert = function (list) {
		if (!list) return;
		for (var i = 0; i < list.length; i++) {
			if (State.selected.has(list[i])) State.selected.delete(list[i]);
			else State.selected.add(list[i]);
		}
	};
		Selection.move = function (fromIndex, toIndex, list) {
		if (!list || fromIndex === toIndex) return;
		var item = list[fromIndex];
		if (typeof item === 'undefined') return;
		State._selOrder = Array.from(list);
		State._selOrder.splice(fromIndex, 1);
		State._selOrder.splice(toIndex, 0, item);
	};
		Selection.favorites = function () { Selection._ensureState(); return Array.from(State._favorites); };
	Selection.addFavorite = function (id) {
		Selection._ensureState();
		State._favorites.add(id);
		Selection._saveFavorites();
	};
	Selection.clearFavorites = function () {
		Selection._ensureState();
		State._favorites.clear();
		Selection._saveFavorites();
	};

		Selection.setDedupKey = function (key) { Selection._ensureState(); State._dedupKey = key || 'url'; };
	Selection.getDedupKey = function () { Selection._ensureState(); return State._dedupKey; };
	Selection.dedup = function (items) {
		if (!items) return [];
		var key = Selection.getDedupKey();
		var seen = new Set();
		var out = [];
		for (var i = 0; i < items.length; i++) {
			var it = items[i];
			var k = (key === 'url') ? (typeof it === 'string' ? it : it.url) : (it && it[key]);
			if (k && !seen.has(k)) {
				seen.add(k);
				out.push(it);
			}
		}
		return out;
	};
	Selection.getDuplicates = function (items) {
		if (!items) return [];
		var key = Selection.getDedupKey();
		var seen = new Set();
		var dups = [];
		for (var i = 0; i < items.length; i++) {
			var it = items[i];
			var k = (key === 'url') ? (typeof it === 'string' ? it : it.url) : (it && it[key]);
			if (!k) continue;
			if (seen.has(k)) dups.push(it);
			else seen.add(k);
		}
		return dups;
	};

		Selection.registerGroupRule = function (id, label, fn) {
		Selection._ensureState();
		if (!id || typeof fn !== 'function') return;
		State._groupRules[id] = { id: id, label: label || id, fn: fn };
	};
	Selection.toggleGroup = function (ruleId) {
		Selection._ensureState();
		if (State._activeGroups.has(ruleId)) State._activeGroups.delete(ruleId);
		else State._activeGroups.add(ruleId);
	};
	Selection.activeGroups = function () { Selection._ensureState(); return Array.from(State._activeGroups); };
	Selection.group = function (items, ruleId) {
		Selection._ensureState();
		var rule = ruleId ? State._groupRules[ruleId] : null;
		if (!items) return {};
		var groups = { '__ungrouped__': [] };
		for (var i = 0; i < items.length; i++) {
			var it = items[i];
			var key = rule ? rule.fn(it) : null;
			if (!key) {
				groups['__ungrouped__'].push(it);
			} else {
				if (!groups[key]) groups[key] = [];
				groups[key].push(it);
			}
		}
		return groups;
	};
		Selection.registerBatchAction = function (id, label, fn, options) {
		Selection._ensureState();
		if (!id || typeof fn !== 'function') return;
		State._batchActions[id] = { id: id, label: label || id, fn: fn, options: options || {} };
	};
		Selection.getBatchActions = function () {
		Selection._ensureState();
		var ids = Object.keys(State._batchActions);
		var out = [];
		for (var i = 0; i < ids.length; i++) out.push(State._batchActions[ids[i]]);
		return out;
	};
	Selection.runBatch = function (id, items) {
		Selection._ensureState();
		var action = State._batchActions[id];
		if (!action || typeof action.fn !== 'function') return Promise.reject(new Error('batch action not found: ' + id));
		var safeItems = items || [];
		var preview = action.options.preview;
		if (preview && typeof preview === 'function') {
			var plan = preview(safeItems);
			if (plan === false) return Promise.resolve({ cancelled: true });
		}
		return Promise.resolve(action.fn(safeItems, action.options));
	};

			Selection._primary = function () {
		try {
			var c = UI.colors();
			if (c && c.primary) return c.primary;
		} catch (e) {}
		return MS_CONFIG.COLORS.primary;
	};

													Selection._clearImportant = function (el, name) {
		try { el.style.removeProperty(name); } catch (e) { try { el.style[name] = ''; } catch (e2) {} }
	};
	Selection._setBorderImportant = function (el, val) {
		if (!el || !el.style) return;
		if (val === '' || val == null) { Selection._clearImportant(el, 'border'); return; }
		try { el.style.setProperty('border', val, 'important'); }
		catch (e) { try { el.style.border = val; } catch (e2) {} }
	};
	Selection._setShadowImportant = function (el, val) {
		if (!el || !el.style) return;
		if (val === '' || val == null) { Selection._clearImportant(el, 'box-shadow'); return; }
		try { el.style.setProperty('box-shadow', val, 'important'); }
		catch (e) { try { el.style.boxShadow = val; } catch (e2) {} }
	};

	Selection._updateCardMark = function (url) {
		var card = document.querySelector('[data-url="' + U.cssEscape(url) + '"]');
		if (!card) return;
		var mark = card.querySelector('._ms_sel_mark');
		var isSel = State.selected.has(url);
								var pri = Selection._primary();
		var selShadow = '0 4px 12px ' + UI._ios27Rgba(pri, 0.35);
		if (mark) {
			if (State.selectionMode) {
				mark.style.display = 'flex';
												try { mark.style.setProperty('background', isSel ? pri : 'rgba(255,255,255,.9)', 'important'); }
				catch (eBg) { mark.style.background = isSel ? pri : 'rgba(255,255,255,.9)'; }
				Selection._setBorderImportant(mark, isSel ? 'none' : '2px solid ' + pri);
				try { mark.style.setProperty('color', isSel ? MS_CONFIG.COLORS.white : pri, 'important'); }
				catch (eCl) { mark.style.color = isSel ? MS_CONFIG.COLORS.white : pri; }
				mark.textContent = isSel ? '\u2713' : '';
			} else {
				mark.style.display = 'none';
			}
		}
		Selection._setBorderImportant(card,
			isSel ? '2px solid ' + pri : (State.selectionMode ? '1px dashed ' + pri : ''));
		Selection._setShadowImportant(card, isSel ? selShadow : '');
	};
	Selection._updateAllCards = function () {
		var marks = document.querySelectorAll('._ms_sel_mark');
		for (var i = 0; i < marks.length; i++) {
			marks[i].style.display = State.selectionMode ? 'flex' : 'none';
		}
		var cards = document.querySelectorAll('[data-url]');
				var pri2 = Selection._primary();
		var selShadow2 = '0 4px 12px ' + UI._ios27Rgba(pri2, 0.35);
		for (var j = 0; j < cards.length; j++) {
			var url = cards[j].getAttribute('data-url');
			var isSel = State.selected.has(url);
			if (State.selectionMode) {
				Selection._setBorderImportant(cards[j], isSel ? '2px solid ' + pri2 : '1px dashed ' + pri2);
				Selection._setShadowImportant(cards[j], isSel ? selShadow2 : '');
			} else {
								Selection._setBorderImportant(cards[j], '');
				Selection._setShadowImportant(cards[j], '');
			}
		}
	};
	Selection._refreshToolbar = function () {
		var ft = document.getElementById('_ms_footer');
		if (!ft) return;
		UI.renderFooter(State.tab, State.listFor(State.tab));
	};

		Selection.registerGroupRule('domain', '按域名', function (it) {
		var url = typeof it === 'string' ? it : (it && it.url);
		if (!url) return null;
		try { return new URL(url).hostname; } catch (e) { return null; }
	});
	Selection.registerGroupRule('ext', '按扩展名', function (it) {
		var url = typeof it === 'string' ? it : (it && it.url);
		if (!url) return null;
		var m = url.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/);
		return m ? m[1].toLowerCase() : 'unknown';
	});
	Selection.registerGroupRule('type', '按类型', function (it) {
		if (typeof it === 'string') return 'url';
		return (it && it.type) || 'unknown';
	});

		Selection.registerBatchAction('favorite', '加入收藏夹', function (items) {
		for (var i = 0; i < items.length; i++) Selection.addFavorite(typeof items[i] === 'string' ? items[i] : (items[i] && items[i].url));
		toast('已收藏 ' + items.length + ' 项');
		return { ok: true, count: items.length };
	}, { multi: true });
	Selection.registerBatchAction('copy', '复制链接', function (items) {
		var urls = [];
		for (var i = 0; i < items.length; i++) urls.push(typeof items[i] === 'string' ? items[i] : (items[i] && items[i].url));
		copyText(urls.join('\n'));
		return { ok: true, count: items.length };
	}, { multi: true });
	Selection.registerBatchAction('dedup', '智能去重', function (items) {
		var unique = Selection.dedup(items);
		toast('去重后剩余 ' + unique.length + ' 项');
		return { ok: true, unique: unique };
	}, { multi: true });

	Selection._ensureState();

		return Selection;
	})();
	var PluginManager = (function () {
		'use strict';
		var PM = {};

		PM.MARKET_PLUGINS = [
		{
			id: 'auto-translate',
			nameKey: 'pluginAutoTrans',
			descKey: 'pluginAutoTransDesc',
			version: '1.0.0',
			author: 'MediaSniffer Team',
			category: 'enhance',
			icon: MS_CONFIG.ICONS.speech
		},
		{
			id: 'batch-rename',
			nameKey: 'pluginBatchRename',
			descKey: 'pluginBatchRenameDesc',
			version: '1.0.0',
			author: 'MediaSniffer Team',
			category: 'download',
			icon: MS_CONFIG.ICONS.edit
		},
		{
			id: 'no-watermark',
			nameKey: 'pluginNoWatermark',
			descKey: 'pluginNoWatermarkDesc',
			version: '1.0.0',
			author: 'MediaSniffer Team',
			category: 'parse',
			icon: MS_CONFIG.ICONS.shield
		},
		{
			id: 'auto-cover',
			nameKey: 'pluginAutoCover',
			descKey: 'pluginAutoCoverDesc',
			version: '1.0.1',
			author: 'MediaSniffer Team',
			category: 'enhance',
			icon: MS_CONFIG.ICONS.image
		},
		{
			id: 'quality-boost',
			nameKey: 'pluginQualityBoost',
			descKey: 'pluginQualityBoostDesc',
			version: '1.0.0',
			author: 'MediaSniffer Team',
			category: 'enhance',
			icon: MS_CONFIG.ICONS.rocket
		},
		{
			id: 'shortcuts-plus',
			nameKey: 'pluginShortcutsPlus',
			descKey: 'pluginShortcutsPlusDesc',
			version: '1.0.0',
			author: 'MediaSniffer Team',
			category: 'tool',
			icon: MS_CONFIG.ICONS.keyboard
		},
		{
			id: 'dark-pro',
			nameKey: 'pluginDarkPro',
			descKey: 'pluginDarkProDesc',
			version: '1.1.0',
			author: 'MediaSniffer Team',
			category: 'ui',
			icon: MS_CONFIG.ICONS.moon
		},
		{
			id: 'export-list',
			nameKey: 'pluginExportList',
			descKey: 'pluginExportListDesc',
			version: '1.0.0',
			author: 'MediaSniffer Team',
			category: 'tool',
			icon: MS_CONFIG.ICONS.folder
		}
	];

	PM._plugins = [];

	PM.load = function () {
		try {
			PM._plugins = (State.config && State.config.plugins) ? U.deepClone(State.config.plugins) : [];
		} catch (e) {
			LOG.warn('PluginManager.load error:', e);
			PM._plugins = [];
		}
	};

	PM.save = function () {
		try {
			if (!State.config) State.config = {};
			State.config.plugins = U.deepClone(PM._plugins);
			State.save();
		} catch (e) {
			LOG.warn('PluginManager.save error:', e);
		}
	};

	PM.getInstalled = function () {
		return PM._plugins.slice();
	};

	PM.getMarket = function () {
		var installedIds = {};
		for (var i = 0; i < PM._plugins.length; i++) installedIds[PM._plugins[i].id] = true;
		var out = [];
		for (var j = 0; j < PM.MARKET_PLUGINS.length; j++) {
			var mp = PM.MARKET_PLUGINS[j];
			out.push({
				id: mp.id,
				nameKey: mp.nameKey,
				descKey: mp.descKey,
				version: mp.version,
				author: mp.author,
				category: mp.category,
				icon: mp.icon,
				installed: !!installedIds[mp.id]
			});
		}
		return out;
	};

	PM.isInstalled = function (id) {
		for (var i = 0; i < PM._plugins.length; i++) if (PM._plugins[i].id === id) return true;
		return false;
	};

	PM.get = function (id) {
		for (var i = 0; i < PM._plugins.length; i++) if (PM._plugins[i].id === id) return PM._plugins[i];
		return null;
	};

	PM.getMarketPlugin = function (id) {
		for (var i = 0; i < PM.MARKET_PLUGINS.length; i++) if (PM.MARKET_PLUGINS[i].id === id) return PM.MARKET_PLUGINS[i];
		return null;
	};

	PM.install = function (id) {
		if (PM.isInstalled(id)) return { ok: false, reason: 'already' };
		var mp = PM.getMarketPlugin(id);
		if (!mp) return { ok: false, reason: 'notfound' };
		var plugin = {
			id: mp.id,
			nameKey: mp.nameKey,
			descKey: mp.descKey,
			version: mp.version,
			author: mp.author,
			category: mp.category,
			icon: mp.icon,
			enabled: true,
			installTime: U.now(),
			config: {}
		};
		PM._plugins.push(plugin);
		PM.save();
		return { ok: true, plugin: plugin };
	};

	PM.uninstall = function (id) {
		var found = -1;
		for (var i = 0; i < PM._plugins.length; i++) if (PM._plugins[i].id === id) { found = i; break; }
		if (found === -1) return { ok: false, reason: 'notfound' };
		var removed = PM._plugins.splice(found, 1)[0];
		PM.save();
		return { ok: true, plugin: removed };
	};

	PM.enable = function (id) {
		var p = PM.get(id);
		if (!p) return { ok: false, reason: 'notfound' };
		if (p.enabled) return { ok: false, reason: 'already' };
		p.enabled = true;
		PM.save();
		return { ok: true, plugin: p };
	};

	PM.disable = function (id) {
		var p = PM.get(id);
		if (!p) return { ok: false, reason: 'notfound' };
		if (!p.enabled) return { ok: false, reason: 'already' };
		p.enabled = false;
		PM.save();
		return { ok: true, plugin: p };
	};

	PM.categoryLabel = function (cat) {
		var map = {
			enhance: LANG.t('pluginCatEnhance'),
			download: LANG.t('pluginCatDownload'),
			parse: LANG.t('pluginCatParse'),
			ui: LANG.t('pluginCatUi'),
			tool: LANG.t('pluginCatTool')
		};
		return map[cat] || cat;
	};

	PM.localName = function (p) {
		return LANG.t(p.nameKey || p.id);
	};

	PM.localDesc = function (p) {
		return LANG.t(p.descKey || (p.id + 'Desc'));
	};

	return PM;
	})();
															var Diag = (function () {
		'use strict';
								var ui = function () {
			try { return (typeof UI !== 'undefined' && UI) ? UI : null; } catch (e) { return null; }
		};
		var Diag = {};

		Diag.startedAt = U.now();
		Diag.startedMono = U.monoNow();

				Diag._marks = {};
		Diag.mark = function (name) {
			if (!name) return;
			var m = Diag._marks[name] || (Diag._marks[name] = { count: 0 });
			m.at = U.now();
			m.count++;
		};
				Diag.since = function (name) {
			var m = Diag._marks[name];
			return (m && m.at) ? (U.now() - m.at) : null;
		};
		Diag.marks = function () { return Diag._marks; };

				Diag.stats = {
			fullScanCount: 0, fullScanLastMs: 0, fullScanLastAt: 0, fullScanLastFound: 0,
			renderCount: 0, renderLastMs: 0,
			netFlushCount: 0, netFlushLastAt: 0,
			toastCount: 0,
			downloadCount: 0, downloadFailCount: 0,
			resolveCount: 0, resolveFailCount: 0,
			muxCount: 0, muxFailCount: 0,
			audioIdCount: 0, audioIdFailCount: 0,
			transcribeCount: 0, transcribeFailCount: 0,
			webdavCount: 0, webdavFailCount: 0,
		};
		Diag.timed = function (name, fn) {
			var t0 = U.monoNow();
			try { return fn(); }
			finally {
				var dt = U.monoNow() - t0;
				var m = Diag._marks[name] || (Diag._marks[name] = { count: 0, totalMs: 0 });
				m.at = U.now();
				m.count++;
				m.totalMs = (m.totalMs || 0) + dt;
				m.lastMs = dt;
				m.maxMs = Math.max(m.maxMs || 0, dt);
			}
		};

				Diag._gmApis = [
			['GM_xmlhttpRequest', 'function'],
			['GM_download', 'function'],
			['GM_setValue', 'function'],
			['GM_getValue', 'function'],
			['GM_deleteValue', 'function'],
			['GM_listValues', 'function'],
			['GM_addStyle', 'function'],
			['GM_openInTab', 'function'],
			['GM_setClipboard', 'function'],
			['GM_registerMenuCommand', 'function'],
			['GM_notification', 'function'],
			['GM_info', 'object'],
			['GM_getResourceText', 'function'],
			['GM_addValueChangeListener', 'function'],
		];
		Diag.gmApis = function () {
			var out = [];
			for (var i = 0; i < Diag._gmApis.length; i++) {
				var name = Diag._gmApis[i][0], want = Diag._gmApis[i][1];
				var v = null, has = false;
				try { v = eval(name); } catch (e) { v = undefined; } 
				has = (want === 'function') ? (typeof v === 'function') : (typeof v === 'object' && v !== null);
				out.push({ name: name, ok: has });
			}
			return out;
		};

				Diag.snapshot = function () {
			var snap = {};
			var safe = function (fn, def) { try { return fn(); } catch (e) { return def; } };

			snap.version = U.VERSION;
			snap.scriptVersion = safe(function () { return MS_CONFIG.VERSION; }, '');
			snap.uptimeMs = U.now() - Diag.startedAt;
			snap.now = U.now();

						snap.env = safe(function () {
				return {
					href: location.href,
					host: location.hostname,
					isTop: (function () { try { return window.top === window.self; } catch (e) { return null; } })(),
					innerW: window.innerWidth, innerH: window.innerHeight,
					dpr: window.devicePixelRatio || 1,
					isMobile: U.isMobile(),
					online: (typeof navigator !== 'undefined' && 'onLine' in navigator) ? navigator.onLine : null,
					ua: (navigator && navigator.userAgent) || '',
				};
			}, {});

						snap.ui = safe(function () {
				return {
					uiStyle: State.config.uiStyle,
					themeSetting: State.config.theme,
					themeEffective: (ui() && ui().isEffectivelyDark) ? (ui().isEffectivelyDark() ? 'dark' : 'light') : 'n/a',
					palette: (ui() && ui().getPalette) ? ui().getPalette() : 'n/a',
					uiLang: State.config.uiLang,
					currentTab: State.tab,
				};
			}, {});

						snap.resources = safe(function () {
				return {
					images: State.images.length,
					videos: State.videos.length,
					audios: State.audios.length,
					m3u8: State.m3u8.length,
					videoLinks: State.videoLinks.length,
					selected: State.selected.size,
					history: safe(function () { return State.getHistory().length; }, 0),
				};
			}, {});

						snap.caches = safe(function () {
				var metaKeys = Object.keys(State.metaCache || {}).length;
				return [
					{ name: 'UI._thumbCache', size: Object.keys((ui() && ui()._thumbCache) || {}).length, limit: 240 },
					{ name: 'State.translateCache', size: Object.keys(State.translateCache || {}).length, limit: 400 },
					{ name: 'State.metaCache', size: metaKeys, limit: 500 },
					{ name: 'Resolver._cache', size: safe(function () { return Object.keys(Resolver._cache).length; }, 0), limit: 60 },
					{ name: 'Dl._usedNames', size: safe(function () { return Dl._usedNames.size; }, 0), limit: 500 },
				];
			}, []);

						snap.runtime = safe(function () {
				return {
					moConnected: !!(ui() && ui()._moConnectedFlag),
					floatMoTarget: (ui() && ui()._floatMOTarget) ? (ui()._floatMOTarget.id || ui()._floatMOTarget.nodeName) : null,
					floatGuardRunning: !!(ui() && ui()._floatGuardRunning),
					themeWatcherInstalled: !!State._themeWatcherInstalled,
					m3u8ActiveRuns: safe(function () { return M3U8._activeRuns.length; }, 0),
					m3u8Inflight: safe(function () { return M3U8._inflight.length; }, 0),
					durationQueue: safe(function () { return Meta._durationQueue.length; }, 0),
					panelBuilt: !!State.panel,
					panelOpen: !!State.panelOpen,
					quickbarIdle: safe(function () { return !!(document.body && document.body.classList && document.body.classList.contains('_ms_glass_idle')); }, null),
					iconFixCss: !!document.getElementById('_ms_icon_fix_css'),
				};
			}, {});

						snap.perf = safe(function () {
				var out = [];
				for (var k in Diag._marks) {
					if (!Object.prototype.hasOwnProperty.call(Diag._marks, k)) continue;
					var m = Diag._marks[k];
					out.push({ name: k, count: m.count, lastMs: m.lastMs == null ? null : Math.round(m.lastMs), maxMs: m.maxMs == null ? null : Math.round(m.maxMs), totalMs: m.totalMs == null ? null : Math.round(m.totalMs) });
				}
				out.sort(function (a, b) { return (b.totalMs || 0) - (a.totalMs || 0); });
				return out;
			}, []);

			snap.stats = safe(function () { return JSON.parse(JSON.stringify(Diag.stats)); }, {});

			snap.logCount = safe(function () { return LOG.buffer.length; }, 0);

			return snap;
		};

						Diag.selfCheck = function () {
			var items = [];
			function add(name, ok, detail) { items.push({ name: name, ok: !!ok, detail: detail || '' }); }

						var apis = Diag.gmApis();
			var missCore = [];
			apis.forEach(function (a) {
				if (['GM_xmlhttpRequest', 'GM_setValue', 'GM_getValue'].indexOf(a.name) >= 0 && !a.ok) missCore.push(a.name);
			});
			add('GM 核心 API', missCore.length === 0,
				missCore.length ? ('缺少 ' + missCore.join(' / ')) : ('可用 ' + apis.filter(function (a) { return a.ok; }).length + '/' + apis.length));

						try {
				var k = 'ms_diag_probe';
				GM_setValue(k, { t: U.now() });
				var back = GM_getValue(k, null);
				var okStore = !!(back && back.t);
				if (typeof GM_deleteValue === 'function') { try { GM_deleteValue(k); } catch (e2) {} }
				add('配置存储往返', okStore, okStore ? 'GM_setValue → GM_getValue 一致' : '写入后读回为空/不匹配');
			} catch (e) { add('配置存储往返', false, e.message); }

						try {
				var xhr = new XMLHttpRequest();
				add('XMLHttpRequest', !!xhr, '可创建');
			} catch (e) { add('XMLHttpRequest', false, e.message); }

						try {
				var wk = new Worker(URL.createObjectURL(new Blob(['self.onmessage=function(){}'], { type: 'application/javascript' })));
				var okWk = !!wk;
				try { wk.terminate(); } catch (e3) {}
				add('Web Worker', okWk, okWk ? '分片并发下载可用' : '');
			} catch (e) { add('Web Worker', false, '不可用（分片下载会退回单线程）: ' + e.message); }

						add('IndexedDB', typeof indexedDB !== 'undefined' && !!indexedDB,
				typeof indexedDB !== 'undefined' && indexedDB ? '任务存储可用' : '不可用（断点续传失效）');

						var okBlob = false, detailBlob = '';
			try {
				var b = new Blob([new Uint8Array([1, 2, 3])]);
				var u = URL.createObjectURL(b);
				okBlob = !!u;
				if (u) URL.revokeObjectURL(u);
				detailBlob = okBlob ? '分片合并落盘可用' : '';
			} catch (e) { detailBlob = e.message; }
			add('Blob / ObjectURL', okBlob, detailBlob);

						var okBlur = false;
			try {
				var d = document.createElement('div');
				d.style.cssText = 'backdrop-filter:blur(1px);-webkit-backdrop-filter:blur(1px);';
				okBlur = !!(d.style.backdropFilter || d.style.webkitBackdropFilter);
			} catch (e) {}
			add('backdrop-filter', okBlur, okBlur ? '液态玻璃可用' : '不支持（ios27 会退回不透明底）');

						var hasPointer = !!(ui() && ui()._hasPointerEvents);
			add('Pointer Events', hasPointer,
				hasPointer ? '动效只绑 pointer 一套' : '退回 touch 一套');

						add('requestIdleCallback', typeof requestIdleCallback === 'function',
				typeof requestIdleCallback === 'function' ? '空闲调度可用' : '退回 setTimeout(…,1)');

						add('ResizeObserver', typeof ResizeObserver === 'function',
				typeof ResizeObserver === 'function' ? '虚拟列表可按需重量' : '退回 window.resize');

						add('面板 DOM', !!State.panel, State.panel ? '已构建' : '尚未构建（点开面板后再看）');
			add('样式表注入', !!document.getElementById('_ms_ui_style_css'), '');
			add('图标修正 CSS', !!document.getElementById('_ms_icon_fix_css'),
				document.getElementById('_ms_icon_fix_css') ? '宿主 svg{display:block} 已被覆盖' : '未注入（图标可能被宿主 CSS 拆行）');

						var total = State.images.length + State.videos.length + State.audios.length + State.m3u8.length;
			add('资源扫描', total > 0, total > 0 ? ('已抓到 ' + total + ' 条') : '当前页未抓到资源（可在媒体标签页点「重新扫描」）');

						try {
				var probe = document.querySelector('#_ms_panel svg');
				if (probe && window.getComputedStyle) {
					var disp = window.getComputedStyle(probe).display;
					add('图标 display 实测', disp === 'inline-block', '实测 display = ' + disp + (disp === 'inline-block' ? '' : '（应为 inline-block，否则按钮会被拆成两行）'));
				} else {
					add('图标 display 实测', !State.panel, State.panel ? '面板内暂无可探测的图标' : '面板未构建，跳过');
				}
			} catch (e) { add('图标 display 实测', false, e.message); }

			return items;
		};

				Diag.report = function (opts) {
			opts = opts || {};
			var L = [];
			var now = new Date();
			L.push('===== Media Sniffer Pro 诊断报告 =====');
			L.push('生成时间: ' + now.toISOString() + ' (本地 ' + now.toLocaleString() + ')');
			L.push('');

			var snap = Diag.snapshot();
			L.push('## 版本');
			L.push('  userscript  : v' + snap.version);
			L.push('  MS_CONFIG   : v' + snap.scriptVersion);
			L.push('  已运行      : ' + Math.round(snap.uptimeMs / 1000) + ' 秒');
			L.push('');

			L.push('## 环境');
			var e = snap.env || {};
			L.push('  页面        : ' + (e.href || ''));
			L.push('  域名        : ' + (e.host || ''));
			L.push('  顶层窗口    : ' + (e.isTop === null ? '未知（跨域）' : e.isTop));
			L.push('  视口        : ' + e.innerW + ' × ' + e.innerH + '  @' + e.dpr + 'x');
			L.push('  移动端判定  : ' + e.isMobile);
			L.push('  UA          : ' + (e.ua || ''));
			L.push('');

			L.push('## 界面');
			var ui = snap.ui || {};
			L.push('  风格 / 主题 : ' + ui.uiStyle + ' / ' + ui.themeSetting + ' (生效 ' + ui.themeEffective + ')');
			L.push('  配色 / 语言 : ' + ui.palette + ' / ' + ui.uiLang);
			L.push('  当前标签    : ' + ui.currentTab);
			L.push('');

			L.push('## 资源');
			var r = snap.resources || {};
			L.push('  图片 ' + r.images + ' · 视频 ' + r.videos + ' · 音频 ' + r.audios + ' · m3u8 ' + r.m3u8 + ' · 视频链接 ' + r.videoLinks);
			L.push('  已选中 ' + r.selected + ' · 历史 ' + r.history);
			L.push('');

			L.push('## 缓存');
			(snap.caches || []).forEach(function (c) {
				L.push('  ' + c.name + ' : ' + c.size + ' / ' + c.limit);
			});
			L.push('');

			L.push('## 运行时');
			var rt = snap.runtime || {};
			Object.keys(rt).forEach(function (k) { L.push('  ' + k + ' : ' + rt[k]); });
			L.push('');

			L.push('## 耗时打点（按累计降序）');
			if ((snap.perf || []).length === 0) L.push('  （无）');
			(snap.perf || []).forEach(function (p) {
				L.push('  ' + p.name.padEnd(22) + ' 次数 ' + p.count
					+ '  最近 ' + p.lastMs + 'ms  峰值 ' + p.maxMs + 'ms  累计 ' + p.totalMs + 'ms');
			});
			L.push('');

			L.push('## GM API');
			Diag.gmApis().forEach(function (a) {
				L.push('  ' + (a.ok ? '[✓]' : '[×]') + ' ' + a.name);
			});
			L.push('');

			if (opts.selfCheck !== false) {
				L.push('## 自检');
				Diag.selfCheck().forEach(function (it) {
					L.push('  ' + (it.ok ? '[✓]' : '[×]') + ' ' + it.name + (it.detail ? '  — ' + it.detail : ''));
				});
				L.push('');
			}

			var logs = LOG.dump(opts.logLevel == null ? 0 : opts.logLevel);
			if (opts.logs !== false) {
				L.push('## 日志（最近 ' + logs.length + ' 条，级别 ' + (LOG.LEVEL_NAMES[opts.logLevel] || 'ALL') + ' 以上）');
				if (logs.length === 0) L.push('  （空）');
				logs.forEach(function (g) {
					var d = new Date(g.t);
					L.push('  ' + d.toTimeString().slice(0, 8) + '.' + String(d.getMilliseconds()).padStart(3, '0')
						+ ' [' + LOG.LEVEL_NAMES[g.lvl] + '] ' + g.msg);
				});
			}
			var reportText = L.join('\n');
						try {
				if (typeof WebDAV !== 'undefined' && WebDAV.redact) reportText = WebDAV.redact(reportText);
			} catch (eRedact) {}
			return reportText;
		};

		return Diag;
	})();
																									var VideoMux = (function () {
		'use strict';
		var VideoMux = {};

				VideoMux.LIB_URL = 'https://cdn.jsdelivr.net/npm/mp4box@0.5.4/dist/mp4box.all.min.js';
		VideoMux.LIB_TIMEOUT = 20000;
						VideoMux.MAX_TOTAL_BYTES = 480 * 1024 * 1024;

		VideoMux._lib = null;
		VideoMux._queue = null;

		VideoMux._pickLib = function () {
			try { if (typeof MP4Box !== 'undefined' && MP4Box && MP4Box.createFile) return MP4Box; } catch (e) {}
			try {
				if (typeof window !== 'undefined' && window.MP4Box && window.MP4Box.createFile) return window.MP4Box;
			} catch (e) {}
			return null;
		};

		VideoMux.ensureLib = function (cb) {
			if (VideoMux._lib) { cb(null, VideoMux._lib); return; }
			var have = VideoMux._pickLib();
			if (have) { VideoMux._lib = have; cb(null, have); return; }
						if (VideoMux._queue) { VideoMux._queue.push(cb); return; }
			VideoMux._queue = [cb];
			var done = function (err, lib) {
				if (lib) VideoMux._lib = lib;
				var q = VideoMux._queue || [];
				VideoMux._queue = null;
				for (var i = 0; i < q.length; i++) { try { q[i](err, lib); } catch (e) {} }
			};
			var settled = false;
			var once = function (err, lib) { if (settled) return; settled = true; done(err, lib); };
			try {
				var sc = document.createElement('script');
				sc.src = VideoMux.LIB_URL;
				sc.async = true;
				sc.onload = function () {
					var lib = VideoMux._pickLib();
					once(lib ? null : new Error('mp4box 加载完成但未挂载全局'), lib);
				};
				sc.onerror = function () { once(new Error('mp4box 加载失败（网络不通或被站点 CSP 拦截）')); };
				(document.head || document.documentElement).appendChild(sc);
				setTimeout(function () { once(new Error('mp4box 加载超时')); }, VideoMux.LIB_TIMEOUT);
			} catch (e) { once(e); }
		};

		
		VideoMux.fetchStream = function (url, onProgress, cb) {
			var headers = {};
			var ch = State.config.customHeaders || {};
			if (ch.Referer) headers.Referer = ch.Referer;
			if (ch.UserAgent) headers['User-Agent'] = ch.UserAgent;
			if (ch.Cookie) headers.Cookie = ch.Cookie;
			var done = false;
			var handle = { abort: function () {} };
			var finish = function (err, ab) { if (done) return; done = true; cb(err, ab); };
			var viaXHR = function () {
				var xhr = new XMLHttpRequest();
				handle.abort = function () { try { xhr.abort(); } catch (e) {} };
				try {
					xhr.open('GET', url, true);
					xhr.responseType = 'arraybuffer';
					xhr.timeout = 180000;
					for (var k in headers) { try { xhr.setRequestHeader(k, headers[k]); } catch (e) {} }
					xhr.onprogress = function (e) {
						if (onProgress && e.lengthComputable) onProgress(e.loaded, e.total);
					};
					xhr.onload = function () {
						if (xhr.status >= 200 && xhr.status < 300) finish(null, xhr.response);
						else finish(new Error('HTTP ' + xhr.status));
					};
					xhr.onerror = function () { finish(new Error('网络错误')); };
					xhr.ontimeout = function () { finish(new Error('超时')); };
					xhr.onabort = function () { finish(new Error('已取消')); };
					xhr.send();
				} catch (e) { finish(e); }
			};
			if (typeof GM_xmlhttpRequest !== 'function') { viaXHR(); return handle; }
			try {
				var gm = GM_xmlhttpRequest({
					method: 'GET', url: url, responseType: 'arraybuffer',
					timeout: 180000, headers: headers,
					onprogress: function (r) { if (onProgress && r.lengthComputable) onProgress(r.loaded, r.total); },
					onload: function (r) {
						if (r.status >= 200 && r.status < 300) finish(null, r.response);
						else if (r.status === 0) viaXHR(); 
						else finish(new Error('HTTP ' + r.status));
					},
					onerror: function () { viaXHR(); }, 
					ontimeout: function () { finish(new Error('超时')); },
					onabort: function () { finish(new Error('已取消')); }
				});
				if (gm && typeof gm.abort === 'function') handle.abort = function () { try { gm.abort(); } catch (e) {} };
			} catch (e) { viaXHR(); }
			return handle;
		};

		
		VideoMux.extract = function (lib, ab, want, cb) {
			var file = lib.createFile();
			var out = null, settled = false;
			var finish = function (err, res) { if (settled) return; settled = true; cb(err, res); };
			file.onError = function (e) { finish(new Error('mp4box 解析出错: ' + e)); };
			file.onReady = function (info) {
				var list = want === 'video' ? info.videoTracks : info.audioTracks;
				if (!list || !list.length) { finish(new Error('这条流里没有' + (want === 'video' ? '视频' : '音频') + '轨')); return; }
				var track = list[0];
				var trak = file.getTrackById(track.id);
				var stsd = trak && trak.mdia && trak.mdia.minf && trak.mdia.minf.stbl && trak.mdia.minf.stbl.stsd;
				var entry = stsd && stsd.entries && stsd.entries[0];
				if (!entry) { finish(new Error('缺少 sample description（拿不到解码配置）')); return; }
				out = {
					track: track, entry: entry, entryType: entry.type,
					timescale: track.timescale,
					duration: track.samples_duration || track.duration || 0,
					samples: []
				};
				try {
					file.setExtractionOptions(track.id, null, { nbSamples: 1e9 });
					file.start();
				} catch (e) { finish(e); }
			};
			file.onSamples = function (id, user, list) {
				if (!out) return;
				for (var i = 0; i < list.length; i++) {
					var s = list[i];
					out.samples.push({
						data: s.data, dts: s.dts || 0, cts: s.cts || 0,
						duration: s.duration || 1, is_sync: !!s.is_sync
					});
				}
			};
			try {
				ab.fileStart = 0;
				file.appendBuffer(ab, true);
				file.flush();
								setTimeout(function () {
					if (!out) { finish(new Error('解析未完成')); return; }
					if (!out.samples.length) { finish(new Error('没解析出任何样本')); return; }
					finish(null, out);
				}, 0);
			} catch (e) { finish(e); }
		};

		
		VideoMux.build = function (lib, v, a, cb) {
			try {
				var out = lib.createFile();
																																var vDescBoxes = (v.entry.boxes && v.entry.boxes.length) ? v.entry.boxes : [v.entry];
				var vOpts = {
					id: 1, type: v.entryType, timescale: v.timescale, hdlr: 'vide',
					language: (v.track && v.track.language) || 'und',
					media_duration: v.duration, duration: v.duration,
					description_boxes: vDescBoxes
				};
				if (v.track && v.track.video) {
					vOpts.width = v.track.video.width;
					vOpts.height = v.track.video.height;
				}
				var vId = out.addTrack(vOpts);
				if (!vId) { cb(new Error('视频轨创建失败（不支持的编码格式 ' + v.entryType + '）')); return; }

				var aDescBoxes = (a.entry.boxes && a.entry.boxes.length) ? a.entry.boxes : [a.entry];
				var aOpts = {
					id: 2, type: a.entryType, timescale: a.timescale, hdlr: 'soun',
					language: (a.track && a.track.language) || 'und',
					media_duration: a.duration, duration: a.duration,
					description_boxes: aDescBoxes
				};
				if (a.track && a.track.audio) {
					aOpts.channel_count = a.track.audio.channel_count || 2;
					aOpts.samplesize = a.track.audio.sample_size || 16;
															aOpts.samplerate = Math.round(a.track.audio.sample_rate) || 44100;
				}
				var aId = out.addTrack(aOpts);
				if (!aId) { cb(new Error('音频轨创建失败（不支持的编码格式 ' + a.entryType + '）')); return; }

				var i;
				for (i = 0; i < v.samples.length; i++) {
					var vs = v.samples[i];
					out.addSample(vId, vs.data, { duration: vs.duration, cts: vs.cts, dts: vs.dts, is_sync: vs.is_sync });
				}
				for (i = 0; i < a.samples.length; i++) {
					var as = a.samples[i];
					out.addSample(aId, as.data, { duration: as.duration, cts: as.cts, dts: as.dts, is_sync: as.is_sync });
				}
				cb(null, out.getBuffer());
			} catch (e) { cb(e); }
		};

		
		VideoMux.verify = function (lib, ab, expectV, expectA, cb) {
			var file = lib.createFile();
			var settled = false, info = null;
			var vN = 0, aN = 0, vCodec = '', aCodec = '';
			var finish = function (res) { if (settled) return; settled = true; cb(res); };
			file.onError = function () { finish({ ok: false, reason: '产物无法解析' }); };
			file.onReady = function (i) {
				info = i;
				try {
					i.videoTracks.forEach(function (t) { vCodec = t.codec || ''; file.setExtractionOptions(t.id, 'v', { nbSamples: 1e9 }); });
					i.audioTracks.forEach(function (t) { aCodec = t.codec || ''; file.setExtractionOptions(t.id, 'a', { nbSamples: 1e9 }); });
					file.start();
				} catch (e) { finish({ ok: false, reason: e.message }); }
			};
			file.onSamples = function (id, user, list) {
				for (var i = 0; i < list.length; i++) {
					if (user === 'v') vN++; else aN++;
				}
			};
			try {
				ab.fileStart = 0;
				file.appendBuffer(ab, true);
				setTimeout(function () {
					if (!info) { finish({ ok: false, reason: '产物没有 moov' }); return; }
					var okTracks = info.videoTracks.length >= 1 && info.audioTracks.length >= 1;
																														var nearEnough = function (got, want) {
						if (want <= 0) return got === want;
						return Math.abs(got - want) <= 2 || got >= Math.ceil(want * 0.99);
					};
					var okSamples = nearEnough(vN, expectV) && nearEnough(aN, expectA);
					finish({
						ok: okTracks && okSamples,
						video: vN, audio: aN, vCodec: vCodec, aCodec: aCodec,
						reason: !okTracks ? '产物缺少视频或音频轨'
							: (!okSamples ? ('样本数不符（视频 ' + vN + '/' + expectV + '，音频 ' + aN + '/' + expectA + '）') : '')
					});
				}, 0);
			} catch (e) { finish({ ok: false, reason: e.message }); }
		};

		
		VideoMux.saveSeparate = function (videoUrl, audioUrl, baseName) {
			var name = SEC.safeFilename(baseName || 'dash');
			try {
				Dl.one(videoUrl, name + '.video.mp4', 0, State.config.customHeaders, true);
				if (audioUrl) Dl.one(audioUrl, name + '.audio.m4a', 0, State.config.customHeaders, true);
			} catch (e) { LOG.warn('降级下载两条流失败:', e); }
		};

		
		VideoMux.run = function (opts, cb) {
			var videoUrl = opts.videoUrl, audioUrl = opts.audioUrl, baseName = opts.baseName || 'video';
			var onStage = opts.onStage || function () {};
			var aborted = false;
			var handles = [];
			var result = { ok: false, reason: '', blob: null, filename: '' };
			var done = function (err, blob) {
				if (aborted) return;
				if (err) { result.reason = err.message || String(err); cb(result); return; }
				result.ok = true; result.blob = blob;
				result.filename = SEC.safeFilename(baseName) + '.mp4';
				cb(result);
			};
			var fail = function (msg) { result.ok = false; result.reason = msg; cb(result); };

			if (!videoUrl) { fail('没有视频地址'); return { abort: function () {} }; }
			if (!audioUrl) { fail('这条流没有独立音频轨（可能是普通 MP4，无需合流）'); return { abort: function () {} }; }

			Diag.stats.muxCount++;
			onStage('lib', 0, 0);
			VideoMux.ensureLib(function (libErr, lib) {
				if (aborted) return;
				if (libErr) { Diag.stats.muxFailCount++; fail('mp4box 加载失败：' + libErr.message); return; }

				onStage('video', 0, 0);
				var vBytes = 0, aBytes = 0;
				var checkSize = function () {
					if (vBytes + aBytes > VideoMux.MAX_TOTAL_BYTES) {
						try { handles.forEach(function (h) { h.abort && h.abort(); }); } catch (e) {}
						Diag.stats.muxFailCount++;
						fail('文件过大（合计约 ' + Math.round((vBytes + aBytes) / 1048576)
							+ 'MB），浏览器内合流需要把两轨同时放进内存，可能耗尽内存。请改用「生成下载脚本」用 aria2 / ffmpeg 合并。');
						return true;
					}
					return false;
				};

				handles.push(VideoMux.fetchStream(videoUrl, function (l, t) {
					vBytes = l;
					if (!checkSize()) onStage('video', l, t);
				}, function (vErr, vAb) {
					if (aborted) return;
					if (vErr) { Diag.stats.muxFailCount++; fail('视频轨下载失败：' + vErr.message); return; }
					onStage('audio', 0, 0);
					handles.push(VideoMux.fetchStream(audioUrl, function (l, t) {
						aBytes = l;
						if (!checkSize()) onStage('audio', l, t);
					}, function (aErr, aAb) {
						if (aborted) return;
						if (aErr) { Diag.stats.muxFailCount++; fail('音频轨下载失败：' + aErr.message); return; }

						onStage('parse', 0, 0);
						VideoMux.extract(lib, vAb, 'video', function (ev, V) {
							if (aborted) return;
							if (ev) { Diag.stats.muxFailCount++; fail('视频轨解析失败：' + ev.message); return; }
							VideoMux.extract(lib, aAb, 'audio', function (ea, A) {
								if (aborted) return;
								if (ea) { Diag.stats.muxFailCount++; fail('音频轨解析失败：' + ea.message); return; }
								onStage('mux', 0, 0);
								VideoMux.build(lib, V, A, function (eb, muxed) {
									if (aborted) return;
									if (eb) { Diag.stats.muxFailCount++; fail('合流失败：' + eb.message); return; }
									onStage('verify', 0, 0);
									VideoMux.verify(lib, muxed, V.samples.length, A.samples.length, function (res) {
										if (aborted) return;
										if (!res.ok) {
											Diag.stats.muxFailCount++;
											fail('合流结果校验未通过（' + res.reason + '），已保留下载的两条原始流');
											VideoMux.saveSeparate(videoUrl, audioUrl, baseName);
											return;
										}
										var blob = null;
										try { blob = new Blob([muxed], { type: 'video/mp4' }); } catch (eBlob) {}
										if (!blob) { Diag.stats.muxFailCount++; fail('产物打包失败'); return; }
										LOG.info('[VideoMux] 合流成功: 视频', res.video, '样本 / 音频', res.audio,
											'样本 · 视频码', res.vCodec, '/ 音频码', res.aCodec);
										done(null, blob);
									});
								});
							});
						});
					}));
				}));
			});
			return { abort: function () { aborted = true; try { handles.forEach(function (h) { h.abort && h.abort(); }); } catch (e) {} } };
		};

		return VideoMux;
	})();
													var WebDAV = (function () {
		'use strict';
		var WebDAV = {};

		WebDAV.TIMEOUT = 25000;
		WebDAV.MAX_BLOB = 512 * 1024 * 1024; 
		WebDAV.BACKUP_NAME = 'media-sniffer-backup.json';

						WebDAV._secrets = new Set();

				WebDAV.isSafeUrl = function (u) {
			return typeof u === 'string' && /^https?:\/\//i.test(u.trim());
		};

		WebDAV.enabled = function () {
			return !!State.config.webdavEnabled && !!WebDAV._base();
		};

		WebDAV._base = function () {
			var u = String(State.config.webdavUrl || '').trim();
			if (!u || !WebDAV.isSafeUrl(u)) return '';
			return u.charAt(u.length - 1) === '/' ? u : u + '/';
		};

				WebDAV._dir = function () {
			var d = String(State.config.webdavDir || '').trim();
			d = d.replace(/^\/+|\/+$/g, '');
			d = d.split('/').filter(function (seg) {
				return seg && seg !== '.' && seg !== '..';
			}).join('/');
			return d ? d + '/' : '';
		};

		WebDAV._fileUrl = function (name) {
			var base = WebDAV._base();
			if (!base) return '';
			return base + WebDAV._dir() + String(name == null ? '' : name).replace(/^\/+/, '');
		};

				WebDAV._b64 = function (str) {
			var s = String(str == null ? '' : str);
			try {
				var bytes = new TextEncoder().encode(s);
				var bin = '';
				for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
				return btoa(bin);
			} catch (e) {
				try { return btoa(unescape(encodeURIComponent(s))); } catch (e2) { return ''; }
			}
		};

		WebDAV._headers = function (extra) {
			var h = extra || {};
			h['User-Agent'] = h['User-Agent'] || (MS_CONFIG.UA || 'MediaSniffer');
			var user = String(State.config.webdavUser || '');
			var pass = String(State.config.webdavPass || '');
			if (user || pass) {
				h['Authorization'] = 'Basic ' + WebDAV._b64(user + ':' + pass);
				if (pass) WebDAV._secrets.add(pass);
				if (user) WebDAV._secrets.add(user + ':' + pass);
			}
			return h;
		};

				WebDAV._req = function (method, url, body, opts, cb) {
			opts = opts || {};
			if (!WebDAV.isSafeUrl(url)) { cb(new Error('URL 不被允许（只支持 http/https）')); return; }
			if (typeof GM_xmlhttpRequest !== 'function') { cb(new Error('需要 Tampermonkey 环境')); return; }
			var done = false;
			var finish = function (err, res) { if (done) return; done = true; cb(err, res); };
			var req = {
				method: method,
				url: url,
				headers: WebDAV._headers(opts.headers),
												timeout: opts.timeout == null ? WebDAV.TIMEOUT : opts.timeout,
				data: body,
				onload: function (res) { finish(null, res); },
				onerror: function () { finish(new Error('网络请求失败')); },
				ontimeout: function () { finish(new Error('请求超时')); }
			};
			if (opts.responseType) req.responseType = opts.responseType;
			if (opts.onprogress) req.onprogress = opts.onprogress;
			try { GM_xmlhttpRequest(req); } catch (e) { finish(e); }
		};

				WebDAV._statusHint = function (code) {
			if (code === 401) return '认证失败（401）—— 检查用户名 / 密码';
			if (code === 403) return '无权限（403）';
			if (code === 404) return '路径不存在（404）';
			if (code === 405) return '服务器不允许该操作（405）';
			if (code === 409) return '父目录不存在（409）—— 需要先创建目录';
			if (code === 423) return '资源被锁定（423）';
			if (code === 507) return '空间不足（507）';
			if (code >= 500) return '服务器错误（' + code + '）';
			return 'HTTP ' + code;
		};

		

				WebDAV.mkcol = function (path, cb) {
			var base = WebDAV._base();
			if (!base) { cb(new Error('未配置 WebDAV 地址')); return; }
			var segs = String(path || '').replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
			var i = 0;
			var url = base;
			(function step() {
				if (i >= segs.length) { cb(null, true); return; }
				url += segs[i] + '/';
				i++;
				WebDAV._req('MKCOL', url, '', {}, function (err, res) {
					if (err) { cb(err); return; }
										if (res.status === 201 || res.status === 405) { step(); return; }
					cb(new Error(WebDAV._statusHint(res.status)));
				});
			})();
		};

		WebDAV.put = function (name, data, cb) {
			var url = WebDAV._fileUrl(name);
			if (!url) { cb(new Error('未配置 WebDAV 地址')); return; }
			WebDAV._req('PUT', url, data, {}, function (err, res) {
				if (err) { cb(err); return; }
				if (res.status >= 200 && res.status < 300) { cb(null, true); return; }
				cb(new Error(WebDAV._statusHint(res.status)));
			});
		};

		WebDAV.get = function (name, cb) {
			var url = WebDAV._fileUrl(name);
			if (!url) { cb(new Error('未配置 WebDAV 地址')); return; }
			WebDAV._req('GET', url, null, {}, function (err, res) {
				if (err) { cb(err); return; }
				if (res.status === 404) { cb(new Error('文件不存在')); return; }
				if (res.status < 200 || res.status >= 300) { cb(new Error(WebDAV._statusHint(res.status))); return; }
				cb(null, res.responseText);
			});
		};

		WebDAV.del = function (name, cb) {
			var url = WebDAV._fileUrl(name);
			if (!url) { cb(new Error('未配置 WebDAV 地址')); return; }
			WebDAV._req('DELETE', url, null, {}, function (err, res) {
				if (err) { cb(err); return; }
				if (res.status >= 200 && res.status < 300 || res.status === 404) { cb(null, true); return; }
				cb(new Error(WebDAV._statusHint(res.status)));
			});
		};

				WebDAV.list = function (cb) {
			var base = WebDAV._base();
			if (!base) { cb(new Error('未配置 WebDAV 地址')); return; }
			var url = base + WebDAV._dir();
			var body = '<?xml version="1.0" encoding="utf-8"?>'
				+ '<d:propfind xmlns:d="DAV:"><d:prop>'
				+ '<d:displayname/><d:getcontentlength/><d:getlastmodified/>'
				+ '</d:prop></d:propfind>';
			WebDAV._req('PROPFIND', url, body, {
				headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Depth': '1' }
			}, function (err, res) {
				if (err) { cb(err); return; }
				if (res.status !== 207 && (res.status < 200 || res.status >= 300)) {
					cb(new Error(WebDAV._statusHint(res.status))); return;
				}
				cb(null, WebDAV._parsePropfind(res.responseText, url));
			});
		};

						WebDAV._pathOf = function (href) {
			var s = String(href || '').split('?')[0].split('#')[0];
			s = s.replace(/^https?:\/\/[^/]*/i, '');
			try { return decodeURIComponent(s); } catch (e) { return s; }
		};
		WebDAV._normPath = function (p) { return String(p || '').replace(/\/+$/, ''); };

		WebDAV._parsePropfind = function (xml, baseUrl) {
			var out = [];
			if (!xml) return out;
			var doc = null;
			try {
				doc = new DOMParser().parseFromString(xml, 'application/xml');
			} catch (e) { return out; }
			if (!doc || !doc.getElementsByTagName) return out;
									var basePath = WebDAV._normPath(WebDAV._pathOf(baseUrl));
			var responses = doc.getElementsByTagNameNS ? doc.getElementsByTagNameNS('DAV:', 'response') : null;
			if (!responses || !responses.length) responses = doc.getElementsByTagName('response');
			for (var i = 0; i < responses.length; i++) {
				var r = responses[i];
				var hrefEl = r.getElementsByTagName('href')[0];
				if (!hrefEl) continue;
				var href = hrefEl.textContent || '';
				var path = WebDAV._normPath(WebDAV._pathOf(href));
				if (basePath && path === basePath) continue; 
				var name = decodeURIComponent(href.replace(/\/+$/, '').split('/').pop() || '');
				if (!name) continue;
				var sizeEl = r.getElementsByTagName('getcontentlength')[0];
				var modEl = r.getElementsByTagName('getlastmodified')[0];
				out.push({
					name: name,
					href: href,
					dir: /\/$/.test(href),
					size: sizeEl ? parseInt(sizeEl.textContent, 10) || 0 : 0,
					mtime: modEl ? (modEl.textContent || '') : ''
				});
			}
			return out;
		};

		WebDAV.test = function (cb) {
			var base = WebDAV._base();
			if (!base) { cb(new Error('请先填写 WebDAV 地址')); return; }
			var dir = WebDAV._dir().replace(/\/$/, '');
			var go = function () {
				WebDAV.list(function (err, items) {
					if (err) { cb(err); return; }
					cb(null, { ok: true, count: items.length, items: items.slice(0, 20) });
				});
			};
			if (!dir) { go(); return; }
						WebDAV.mkcol(dir, function (e1) {
				if (e1) { cb(e1); return; }
				go();
			});
		};

		

						WebDAV.uploadUrl = function (url, name, onProgress, cb) {
			WebDAV._req('GET', url, null, {
				responseType: 'blob',
				timeout: 0, 
				onprogress: function (e) {
					if (onProgress && e && e.lengthComputable) onProgress(e.loaded, e.total);
				}
			}, function (err, res) {
				if (err) { cb(new Error('源文件下载失败: ' + err.message)); return; }
				if (res.status < 200 || res.status >= 300) { cb(new Error(WebDAV._statusHint(res.status))); return; }
				var blob = res.response;
				if (!blob) { cb(new Error('未取到文件内容')); return; }
				if (blob.size > WebDAV.MAX_BLOB) { cb(new Error('文件过大（超过 ' + Math.round(WebDAV.MAX_BLOB / 1048576) + 'MB）')); return; }
				WebDAV.put(name, blob, cb);
			});
		};

		WebDAV.uploadBlob = function (blob, name, cb) {
			if (!blob) { cb(new Error('内容为空')); return; }
			if (blob.size > WebDAV.MAX_BLOB) { cb(new Error('文件过大')); return; }
			WebDAV.put(name, blob, cb);
		};

		

		WebDAV.BACKUP_KEYS = [
			'theme', 'uiStyle', 'palette', 'customPalettes', 'uiLang', 'nameTpl',
			'whitelist', 'blacklist', 'whitelistMode',
			'panelWidth', 'panelHeight', 'panelX', 'panelY', 'panelSnapEdge', 'panelMinimized', 'lastTab',
			'batchConcurrency', 'batchRetry', 'batchDelay', 'askBeforeDownload', 'showStatusBar', 'logLevel',
			'minImageSize', 'minImageWidth', 'minImageHeight', 'minVideoDuration', 'maxVideoDuration', 'minAudioDuration',
			'showMinSizeKB', 'showMaxSizeKB', 'autoExtractThumb', 'autoPlayPreview', 'persistSelection',
			'customHeaders', 'm3u8Quality', 'm3u8Concurrency', 'm3u8AutoMerge',
			'enableSync', 'enableHistory', 'autoCheckUpdate', 'settingsExpanded',
			'domainRules', 'customRules', 'parserPlugins', 'plugins',
			'aria2RpcUrl', 
			'translateFrom', 'translateTo', 'translateEngine',
			'shortcutToggle', 'shortcutTranslate', 'shortcutClose',
			'shortcutToggleMod', 'shortcutTranslateMod', 'shortcutCloseMod',
			'audioIdProvider', 'audioIdSeconds', 'audioIdSource', 'audioIdAutoSave',
			'asrProvider', 'asrBaseUrl', 'asrModel', 'asrLang', 'asrMaxMB',
			'aiBaseUrl', 'aiModel', 'aiPromptStyle',
			'webdavUrl', 'webdavDir' 
		];

				WebDAV.NEVER_BACKUP = ['webdavPass', 'webdavUser', 'aria2RpcSecret', 'audioIdToken',
			'audioIdAcrKey', 'audioIdAcrSecret', 'asrKey', 'aiKey'];

		WebDAV.buildBackup = function () {
			var cfg = {};
			for (var i = 0; i < WebDAV.BACKUP_KEYS.length; i++) {
				var k = WebDAV.BACKUP_KEYS[i];
				if (WebDAV.NEVER_BACKUP.indexOf(k) >= 0) continue;
				if (Object.prototype.hasOwnProperty.call(State.config, k)) {
					cfg[k] = JSON.parse(JSON.stringify(State.config[k]));
				}
			}
			var payload = {
				app: 'media-sniffer',
				schema: 1,
				version: (typeof MS_CONFIG !== 'undefined' && MS_CONFIG.VERSION) || '',
				savedAt: U.now(),
				host: (function () { try { return location.hostname; } catch (e) { return ''; } })(),
				config: cfg,
				history: {
					audioId: U.isArr(State.config.audioIdHistory) ? State.config.audioIdHistory.slice(0, 50) : [],
					transcribe: U.isArr(State.config.transcribeHistory) ? State.config.transcribeHistory.slice(0, 30) : [],
					downloads: U.isArr(State.downloadHistory) ? State.downloadHistory.slice(0, 200) : []
				}
			};
			return JSON.stringify(payload, null, 2);
		};

		WebDAV.backup = function (cb) {
			if (!WebDAV.enabled()) { cb(new Error('WebDAV 未启用或未配置地址')); return; }
			var dir = WebDAV._dir().replace(/\/$/, '');
			var doPut = function () {
				var text = WebDAV.buildBackup();
				WebDAV.put(WebDAV.BACKUP_NAME, text, function (err) {
					if (err) { Diag.stats.webdavFailCount++; cb(err); return; }
					State.config.webdavLastSyncAt = U.now();
					State.save();
					Diag.stats.webdavCount++;
					cb(null, { bytes: text.length });
				});
			};
			if (dir) WebDAV.mkcol(dir, function () { doPut(); });
			else doPut();
		};

				WebDAV.applyBackup = function (obj) {
			if (!obj || obj.app !== 'media-sniffer' || !obj.config || typeof obj.config !== 'object') {
				return { ok: false, reason: '不是本脚本的备份文件' };
			}
			var applied = 0;
			for (var i = 0; i < WebDAV.BACKUP_KEYS.length; i++) {
				var k = WebDAV.BACKUP_KEYS[i];
				if (WebDAV.NEVER_BACKUP.indexOf(k) >= 0) continue;
				if (!Object.prototype.hasOwnProperty.call(obj.config, k)) continue;
				if (obj.config[k] === undefined) continue;
				State.config[k] = obj.config[k];
				applied++;
			}
			if (obj.history) {
				if (U.isArr(obj.history.audioId)) State.config.audioIdHistory = obj.history.audioId.slice(0, 50);
				if (U.isArr(obj.history.transcribe)) State.config.transcribeHistory = obj.history.transcribe.slice(0, 30);
				if (U.isArr(obj.history.downloads)) State.downloadHistory = obj.history.downloads.slice(0, 200);
			}
			State.save();
			return { ok: true, applied: applied };
		};

		WebDAV.restore = function (cb) {
			if (!WebDAV.enabled()) { cb(new Error('WebDAV 未启用或未配置地址')); return; }
			WebDAV.get(WebDAV.BACKUP_NAME, function (err, text) {
				if (err) { Diag.stats.webdavFailCount++; cb(err); return; }
				var obj = U.safeJson(text, null);
				if (!obj) { cb(new Error('备份文件不是合法 JSON')); return; }
				var r = WebDAV.applyBackup(obj);
				if (!r.ok) { cb(new Error(r.reason)); return; }
				Diag.stats.webdavCount++;
				cb(null, r);
			});
		};

				WebDAV.redact = function (text) {
			var s = String(text == null ? '' : text);
			var secrets = Array.from(WebDAV._secrets);
			['webdavPass', 'webdavUser', 'aria2RpcSecret', 'audioIdToken', 'audioIdAcrKey',
				'audioIdAcrSecret', 'asrKey', 'aiKey'].forEach(function (k) {
				var v = State.config[k];
				if (v) secrets.push(String(v));
			});
			for (var i = 0; i < secrets.length; i++) {
				var sec = secrets[i];
				if (!sec || sec.length < 4) continue;
				s = s.split(sec).join('***');
			}
						s = s.replace(/\b(sk|key|token)-[A-Za-z0-9_\-]{8,}/gi, '$1-***');
			return s;
		};

		return WebDAV;
	})();
																		var AudioID = (function () {
		'use strict';
		var AudioID = {};

		AudioID.MIN_SECONDS = 3;
		AudioID.MAX_SECONDS = 20;
		AudioID.MAX_UPLOAD = 12 * 1024 * 1024;
		AudioID.HISTORY_MAX = 30;

				AudioID._mimeCandidates = [
			'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/ogg', 'audio/mp4'
		];

		AudioID.pickMime = function () {
			if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return '';
			for (var i = 0; i < AudioID._mimeCandidates.length; i++) {
				try { if (MediaRecorder.isTypeSupported(AudioID._mimeCandidates[i])) return AudioID._mimeCandidates[i]; } catch (e) {}
			}
			return '';
		};

		

						AudioID.findPlayingMedia = function () {
			var list;
			try { list = document.querySelectorAll('video,audio'); } catch (e) { return null; }
			for (var i = 0; i < list.length; i++) {
				var el = list[i];
				try {
					if (el.paused || el.ended) continue;
					if (!(el.currentTime > 0)) continue;
					if (el.readyState < 2) continue;
					if (!(el.captureStream || el.mozCaptureStream)) continue;
					return el;
				} catch (e2) {}
			}
			return null;
		};

		AudioID._streamOf = function (el) {
			try {
				if (el.captureStream) return el.captureStream();
				if (el.mozCaptureStream) return el.mozCaptureStream();
			} catch (e) {}
			return null;
		};

		

				AudioID.capture = function (seconds, source, onTick, cb) {
			var secs = Math.max(AudioID.MIN_SECONDS, Math.min(AudioID.MAX_SECONDS, Number(seconds) || 8));
																					var stopAll = [];
			var stopRec = null;
			var settled = false;
			var finish = function (err, blob, mime) {
				if (settled) return;
				settled = true;
				if (stopRec) { try { stopRec(); } catch (e) {} stopRec = null; }
				stopAll.forEach(function (f) { try { f(); } catch (e) {} });
				cb(err, blob, mime);
			};

			if (typeof MediaRecorder === 'undefined' || !MediaRecorder) { finish(new Error('浏览器不支持 MediaRecorder，无法录音识别')); return { abort: function () {} }; }

			function begin(stream, ownStream) {
				if (!stream) { finish(new Error('没有可用的音频流')); return; }
				var mime = AudioID.pickMime();
				var rec;
				try {
					rec = mime ? new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 64000 })
						: new MediaRecorder(stream);
				} catch (e) {
					try { rec = new MediaRecorder(stream); }
					catch (e2) { finish(new Error('无法创建录音器: ' + e2.message)); return; }
				}
				var chunks = [];
				rec.ondataavailable = function (e) { if (e && e.data && e.data.size > 0) chunks.push(e.data); };
				rec.onerror = function (e) { finish(new Error('录音失败: ' + ((e && e.error && e.error.name) || '未知'))); };
				rec.onstop = function () {
					var type = rec.mimeType || mime || 'audio/webm';
					var blob = null;
					try { blob = new Blob(chunks, { type: type }); } catch (e) {}
					if (!blob || !blob.size) { finish(new Error('没录到音频（页面是否静音 / 麦克风被占用？）')); return; }
					if (blob.size > AudioID.MAX_UPLOAD) { finish(new Error('录音过大（' + Math.round(blob.size / 1048576) + 'MB），请缩短时长')); return; }
					finish(null, blob, type);
				};
								stopRec = function () { try { if (rec.state !== 'inactive') rec.stop(); } catch (e) {} };
				if (ownStream) stopAll.push(function () { try { ownStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} });

				var left = Math.ceil(secs);
				onTick && onTick(left, secs);
				var timer = setInterval(function () {
					left--;
					onTick && onTick(Math.max(0, left), secs);
					if (left <= 0) { clearInterval(timer); try { rec.stop(); } catch (e) {} }
				}, 1000);
				stopAll.push(function () { clearInterval(timer); });

				try { rec.start(250); } 
				catch (e) { finish(new Error('启动录音失败: ' + e.message)); }
			}

			if (source === 'mic') {
				if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
					finish(new Error('浏览器不支持麦克风录音（需要 HTTPS）')); return { abort: function () {} };
				}
				navigator.mediaDevices.getUserMedia({
										audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
				}).then(function (stream) {
					begin(stream, stream);
				}).catch(function (err) {
					finish(new Error('麦克风不可用: ' + (err && err.name ? err.name : '权限被拒绝')));
				});
			} else {
				var el = AudioID.findPlayingMedia();
				if (!el) {
					finish(new Error('页面里没有正在播放的媒体（可以改用「麦克风」模式）'));
					return { abort: function () {} };
				}
				var stream = AudioID._streamOf(el);
				if (!stream) { finish(new Error('无法从播放器抓取音频流')); return { abort: function () {} }; }
				begin(stream, null);
			}

			return { abort: function () { finish(new Error('已取消')); } };
		};

		

		AudioID._identifyAudD = function (blob, cb) {
			var token = String(State.config.audioIdToken || '').trim();
			if (!token) { cb(new Error('未填写 AudD API Token')); return; }
			var fd;
			try {
				fd = new FormData();
				fd.append('api_token', token);
				fd.append('return', 'apple_music,spotify,deezer,lyrics');
				var ext = /ogg/.test(blob.type) ? 'ogg' : (/mp4/.test(blob.type) ? 'mp4' : 'webm');
				fd.append('file', blob, 'sample.' + ext);
			} catch (e) { cb(new Error('组装请求失败: ' + e.message)); return; }
			AudioID._post('https://api.audd.io/', fd, {}, function (err, res) {
				if (err) { cb(err); return; }
				if (res.status < 200 || res.status >= 300) { cb(new Error('识别服务返回 HTTP ' + res.status)); return; }
				var data = U.safeJson(res.responseText, null);
				if (!data) { cb(new Error('识别服务返回非 JSON')); return; }
				if (data.status === 'error') {
																				var errMsg = (data.error && (data.error.error_message || data.error.error_code)) || '未知';
					cb(new Error('识别服务报错: ' + errMsg));
					return;
				}
				if (!data.result) { cb(null, null); return; } 
				cb(null, AudioID._normalizeAudD(data.result));
			});
		};

		AudioID._normalizeAudD = function (r) {
			var links = [];
			if (r.song_link) links.push({ label: 'AudD', url: r.song_link });
			if (r.spotify && r.spotify.external_urls && r.spotify.external_urls.spotify) {
				links.push({ label: 'Spotify', url: r.spotify.external_urls.spotify });
			}
			if (r.apple_music && r.apple_music.url) links.push({ label: 'Apple Music', url: r.apple_music.url });
			if (r.deezer && r.deezer.link) links.push({ label: 'Deezer', url: r.deezer.link });
			return {
				artist: r.artist || '', title: r.title || '', album: r.album || '',
				cover: (r.spotify && r.spotify.album && r.spotify.album.images && r.spotify.album.images[0]
					&& r.spotify.album.images[0].url) || (r.apple_music && r.apple_music.artwork && r.apple_music.artwork.url) || '',
				releaseDate: r.release_date || '', label: r.label || '',
				links: links, provider: 'audd', lyrics: (r.lyrics && r.lyrics.lyrics) || ''
			};
		};

		

								AudioID._utf8 = function (str) {
			var s = String(str == null ? '' : str);
			try {
				if (typeof TextEncoder === 'function') return new TextEncoder().encode(s);
			} catch (e) {}
			try {
								var bin = unescape(encodeURIComponent(s));
				var out = new Uint8Array(bin.length);
				for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
				return out;
			} catch (e2) {
				var fb = new Uint8Array(s.length);
				for (var j = 0; j < s.length; j++) fb[j] = s.charCodeAt(j) & 0xff;
				return fb;
			}
		};

		AudioID._hmacSha1B64 = function (secret, message) {
			return new Promise(function (resolve, reject) {
				try {
					if (!(window.crypto && window.crypto.subtle && window.crypto.subtle.importKey)) {
						reject(new Error('环境不支持 SubtleCrypto，无法为 ACRCloud 计算签名')); return;
					}
					window.crypto.subtle.importKey('raw', AudioID._utf8(secret), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
						.then(function (key) { return window.crypto.subtle.sign('HMAC', key, AudioID._utf8(message)); })
						.then(function (sig) {
							var bytes = new Uint8Array(sig), bin = '';
							for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
							resolve(btoa(bin));
						})
						.catch(function (e) { reject(new Error('签名计算失败: ' + e.message)); });
				} catch (e) { reject(e); }
			});
		};

		AudioID._identifyAcrCloud = function (blob, cb) {
			var host = String(State.config.audioIdAcrHost || '').trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
			var key = String(State.config.audioIdAcrKey || '').trim();
			var secret = String(State.config.audioIdAcrSecret || '').trim();
			if (!host || !key || !secret) { cb(new Error('ACRCloud 需要填 Host / Access Key / Access Secret 三项')); return; }
									if (/\s/.test(host) || host.indexOf('/') >= 0 || host.indexOf('\\') >= 0) {
				cb(new Error('ACRCloud Host 格式不对（只填域名，如 identify-us-west-1.acrcloud.com）'));
				return;
			}

			var uri = '/v1/identify';
			var dataType = 'audio';
			var sigVersion = '1';
			var ts = String(Math.floor(U.now() / 1000));
			var stringToSign = ['POST', uri, key, dataType, sigVersion, ts].join('\n');

			AudioID._hmacSha1B64(secret, stringToSign).then(function (sig) {
				var fd;
				try {
					fd = new FormData();
					fd.append('access_key', key);
					fd.append('data_type', dataType);
					fd.append('signature_version', sigVersion);
					fd.append('signature', sig);
					fd.append('sample_bytes', String(blob.size));
					fd.append('timestamp', ts);
					fd.append('sample', blob, 'sample.webm');
				} catch (e) { cb(new Error('组装请求失败: ' + e.message)); return; }
				AudioID._post('https://' + host + uri, fd, {}, function (err, res) {
					if (err) { cb(err); return; }
					if (res.status < 200 || res.status >= 300) { cb(new Error('识别服务返回 HTTP ' + res.status)); return; }
					var data = U.safeJson(res.responseText, null);
					if (!data) { cb(new Error('识别服务返回非 JSON')); return; }
					if (data.status && data.status.code && data.status.code !== 0) {
												if (data.status.code === 1001) { cb(null, null); return; }
						cb(new Error('识别服务报错: ' + (data.status.msg || data.status.code)));
						return;
					}
					var m = data.metadata;
					if (!m || !m.music || !m.music.length) { cb(null, null); return; }
					cb(null, AudioID._normalizeAcr(m.music[0]));
				});
			}).catch(function (e) { cb(e); });
		};

		AudioID._normalizeAcr = function (m) {
			var links = [];
			if (m.external_metadata) {
				['spotify', 'youtube', 'deezer', 'apple_music'].forEach(function (k) {
					var v = m.external_metadata[k];
					if (!v) return;
					var url = v.url || (v.external_ids && v.external_ids[k]);
					if (typeof url === 'string' && /^https?:/.test(url)) links.push({ label: k, url: url });
				});
			}
			var artists = (m.artists || []).map(function (a) { return a.name; }).filter(Boolean).join(', ');
			var album = (m.album && m.album.name) || '';
			return {
				artist: artists, title: m.title || '', album: album,
				cover: '', releaseDate: (m.release_date || ''), label: (m.label || ''),
				links: links, provider: 'acrcloud', lyrics: ''
			};
		};

		

		AudioID._identifyCustom = function (blob, cb) {
			var url = String(State.config.audioIdCustomUrl || '').trim();
			if (!url) { cb(new Error('未填写自定义识别接口地址')); return; }
			if (!/^https?:\/\//i.test(url)) { cb(new Error('自定义接口只支持 http/https')); return; }
			var fd;
			try { fd = new FormData(); fd.append('file', blob, 'sample.webm'); }
			catch (e) { cb(new Error('组装请求失败: ' + e.message)); return; }
			AudioID._post(url, fd, {}, function (err, res) {
				if (err) { cb(err); return; }
				if (res.status < 200 || res.status >= 300) { cb(new Error('接口返回 HTTP ' + res.status)); return; }
				var data = U.safeJson(res.responseText, null);
				if (!data) { cb(new Error('接口返回非 JSON')); return; }
				var r = data.result || data.data || data;
				if (data.status && data.status !== 'success' && !r.title) { cb(null, null); return; }
				if (!r || (!r.title && !r.song)) { cb(null, null); return; }
				var links = [];
				if (Array.isArray(r.links)) {
					r.links.forEach(function (l) {
						if (!l || !l.url) return;
						var u = String(l.url);
												if (!/^https?:\/\//i.test(u)) return;
						links.push({ label: String(l.label || l.name || 'Link'), url: u });
					});
				}
				cb(null, {
					artist: r.artist || r.singer || '', title: r.title || r.song || '',
					album: r.album || '', cover: r.cover || r.pic || '', releaseDate: r.release_date || '',
					label: r.label || '', links: links, provider: 'custom', lyrics: r.lyrics || ''
				});
			});
		};

				AudioID._post = function (url, data, headers, cb) {
			if (typeof GM_xmlhttpRequest !== 'function') { cb(new Error('需要 Tampermonkey 环境')); return; }
			var done = false;
			var finish = function (err, res) { if (done) return; done = true; cb(err, res); };
			var h = headers || {};
			try { GM_xmlhttpRequest({
				method: 'POST',
				url: url,
				data: data,
				headers: h,
				timeout: 30000,
				onload: function (res) { finish(null, res); },
				onerror: function () { finish(new Error('网络请求失败')); },
				ontimeout: function () { finish(new Error('识别请求超时')); }
			}); } catch (e) { finish(e); }
		};

		AudioID.identify = function (blob, cb) {
			var p = String(State.config.audioIdProvider || 'audd');
			if (p === 'acrcloud') { AudioID._identifyAcrCloud(blob, cb); return; }
			if (p === 'custom') { AudioID._identifyCustom(blob, cb); return; }
			AudioID._identifyAudD(blob, cb);
		};

		

		AudioID.run = function (opts, cb) {
			opts = opts || {};
			var onStage = opts.onStage || function () {};
			var aborted = false;
			var handle = null;
			Diag.stats.audioIdCount++;
			onStage('capture', 0);
			handle = AudioID.capture(opts.seconds, opts.source, function (left) {
				if (!aborted) onStage('capture', left);
			}, function (err, blob) {
				if (aborted) return;
				if (err) { Diag.stats.audioIdFailCount++; cb({ ok: false, reason: err.message }); return; }
				onStage('identify', blob.size);
				AudioID.identify(blob, function (e2, res) {
					if (aborted) return;
					if (e2) { Diag.stats.audioIdFailCount++; cb({ ok: false, reason: e2.message }); return; }
					if (!res) { cb({ ok: false, reason: 'no-match' }); return; }
					res.at = U.now();
					res.bytes = blob.size;
					AudioID.pushHistory(res);
					cb({ ok: true, result: res });
				});
			});
			return { abort: function () { aborted = true; if (handle && handle.abort) handle.abort(); } };
		};

		AudioID.pushHistory = function (r) {
			if (!U.isArr(State.config.audioIdHistory)) State.config.audioIdHistory = [];
			State.config.audioIdHistory.unshift({
				artist: r.artist, title: r.title, album: r.album, cover: r.cover,
				links: r.links, provider: r.provider, at: r.at || U.now()
			});
			if (State.config.audioIdHistory.length > AudioID.HISTORY_MAX) {
				State.config.audioIdHistory.length = AudioID.HISTORY_MAX;
			}
			State.save();
		};

		AudioID.clearHistory = function () {
			State.config.audioIdHistory = [];
			State.save();
		};

				AudioID.format = function (r) {
			var s = [r.title || '未知曲目'];
			if (r.artist) s.push('— ' + r.artist);
			if (r.album) s.push('《' + r.album + '》');
			var line = s.join(' ');
			if (r.releaseDate) line += ' (' + r.releaseDate + ')';
			return line;
		};

		return AudioID;
	})();
																var Transcribe = (function () {
		'use strict';
		var Transcribe = {};

		Transcribe.MAX_UPLOAD = 24 * 1024 * 1024; 
		Transcribe.MAX_SOURCE = 300 * 1024 * 1024; 
		Transcribe.DECODE_LIMIT = 64 * 1024 * 1024; 
		Transcribe.CHUNK_SECONDS = 600; 
		Transcribe.TARGET_RATE = 16000;
		Transcribe.HISTORY_MAX = 30;
								Transcribe.HISTORY_TEXT_MAX = 4000;

				
		Transcribe.ready = function () {
			return !!String(State.config.asrKey || '').trim();
		};

		Transcribe.summaryReady = function () {
			return !!String(State.config.aiKey || '').trim();
		};

		

		Transcribe._join = function (base, path) {
			var b = String(base || '').trim().replace(/\/+$/, '');
			if (!b) return '';
			return b + (path.charAt(0) === '/' ? path : '/' + path);
		};

		Transcribe._asrEndpoint = function () {
			return Transcribe._join(State.config.asrBaseUrl || 'https://api.openai.com/v1', '/audio/transcriptions');
		};

		Transcribe._chatEndpoint = function () {
			return Transcribe._join(State.config.aiBaseUrl || 'https://api.openai.com/v1', '/chat/completions');
		};

		Transcribe._req = function (opts, cb) {
			if (typeof GM_xmlhttpRequest !== 'function') { cb(new Error('需要 Tampermonkey 环境')); return; }
			var url = opts.url;
			if (!/^https?:\/\//i.test(String(url || ''))) { cb(new Error('接口地址只支持 http/https')); return; }
			var done = false;
			var finish = function (err, res) { if (done) return; done = true; cb(err, res); };
			var req = {
				method: opts.method || 'POST',
				url: url,
				headers: opts.headers || {},
				data: opts.data,
								timeout: opts.timeout == null ? 180000 : opts.timeout,
				onload: function (res) { finish(null, res); },
				onerror: function () { finish(new Error('网络请求失败')); },
				ontimeout: function () { finish(new Error('请求超时（长音频建议调小分片时长）')); }
			};
			if (opts.responseType) req.responseType = opts.responseType;
			if (opts.onprogress) req.onprogress = opts.onprogress;
			try { GM_xmlhttpRequest(req); } catch (e) { finish(e); }
		};

		Transcribe._httpHint = function (status, body) {
			var msg = '';
			var j = U.safeJson(body, null);
			if (j && j.error) msg = j.error.message || j.error.code || '';
			if (status === 401) return '密钥无效或未授权（401）' + (msg ? '：' + msg : '');
			if (status === 403) return '无权限（403）' + (msg ? '：' + msg : '');
			if (status === 404) return '接口地址不存在（404）—— 检查 Base URL 是否要带 /v1';
			if (status === 413) return '文件过大（413）—— 请调小「分片时长」';
			if (status === 429) return '请求过于频繁 / 额度用尽（429）' + (msg ? '：' + msg : '');
			if (status >= 500) return '服务端错误（' + status + '）';
			return 'HTTP ' + status + (msg ? '：' + msg : '');
		};

		

		Transcribe.asr = function (blob, cb, onProgress) {
			var key = String(State.config.asrKey || '').trim();
			if (!key) { cb(new Error('未填写 ASR 密钥')); return; }
			var url = Transcribe._asrEndpoint();
			var fd;
			try {
				fd = new FormData();
				var ext = /wav/.test(blob.type) ? 'wav' : (/ogg/.test(blob.type) ? 'ogg' : (/mp4/.test(blob.type) ? 'm4a' : 'webm'));
				fd.append('file', blob, 'audio.' + ext);
				fd.append('model', String(State.config.asrModel || 'whisper-1'));
				if (State.config.asrLang && State.config.asrLang !== 'auto') fd.append('language', State.config.asrLang);
				fd.append('response_format', 'json');
			} catch (e) { cb(new Error('组装请求失败: ' + e.message)); return; }
			Transcribe._req({
				url: url,
				headers: { 'Authorization': 'Bearer ' + key },
				data: fd,
				onprogress: onProgress
			}, function (err, res) {
				if (err) { cb(err); return; }
				if (res.status < 200 || res.status >= 300) { cb(new Error(Transcribe._httpHint(res.status, res.responseText))); return; }
				var data = U.safeJson(res.responseText, null);
				if (!data) { cb(new Error('ASR 返回非 JSON')); return; }
				var text = data.text || (data.segments && data.segments.map(function (s) { return s.text; }).join('')) || '';
				cb(null, String(text).trim());
			});
		};

		

		Transcribe.buildPrompt = function (style) {
			var zh = String(State.config.uiLang || 'zh-CN').indexOf('zh') === 0;
			var map = zh ? {
				summary: '你是内容编辑。请阅读下面的音视频文稿，输出一份结构化摘要：\n1) 一句话概括（不超过 40 字）\n2) 核心要点（3-7 条，每条一个短句）\n3) 值得注意的细节或结论\n\n直接输出 Markdown，不要开场白。',
				points: '你是内容编辑。把下面的文稿整理成「要点清单」：每条以 `-` 开头，一句话，尽量保留数字/名称/结论。只输出清单，不要开场白。',
				timeline: '你是内容编辑。把下面的文稿整理成**带时间轴的提纲**：每 2-5 分钟一个条目，格式 `- [大致时间] 这一段讲了什么`。只输出提纲，不要开场白。',
				qa: '你是内容编辑。基于下面的文稿，生成 5-8 个「问题 + 答案」对，问题要覆盖最有信息量的点。用 Markdown 的 `### 问题` / 答案段的形式。'
			} : {
				summary: 'You are a content editor. Read the transcript below and produce a structured summary:\n1) One-sentence gist (max 25 words)\n2) Key points (3-7 bullets)\n3) Notable details or conclusions\n\nOutput Markdown only, no preamble.',
				points: 'You are a content editor. Turn the transcript into a bullet list of key points. Each line starts with "-", one sentence, keep numbers/names/conclusions. Output only the list.',
				timeline: 'You are a content editor. Turn the transcript into a timed outline: one item every 2-5 minutes, format `- [approx time] what this section covers`. Output only the outline.',
				qa: 'You are a content editor. Based on the transcript, produce 5-8 question/answer pairs covering the most informative points. Use Markdown `### question` followed by the answer.'
			};
			return map[style] || map.summary;
		};

				Transcribe.stripSegment = 12000;

		Transcribe.summarize = function (text, style, cb) {
			var key = String(State.config.aiKey || '').trim();
			if (!key) { cb(new Error('未填写 AI 密钥')); return; }
			var model = String(State.config.aiModel || 'gpt-4o-mini');
			var url = Transcribe._chatEndpoint();
			var prompt = Transcribe.buildPrompt(style || State.config.aiPromptStyle || 'summary');

			var parts = [];
			if (String(text).length > Transcribe.stripSegment) {
				var chunks = [];
				var lines = String(text).split('\n');
				var cur = '';
				for (var i = 0; i < lines.length; i++) {
					if ((cur + lines[i]).length > Transcribe.stripSegment && cur) { chunks.push(cur); cur = ''; }
					cur += lines[i] + '\n';
				}
				if (cur) chunks.push(cur);
				parts = chunks.slice(0, 12);
			} else {
				parts = [String(text)];
			}

			var texts = [];
			var idx = 0;
			(function step() {
				if (idx >= parts.length) {
					var merged = texts.join('\n\n');
					if (parts.length === 1) { cb(null, merged); return; }
										Transcribe._chat(url, key, model,
						'下面是同一份文稿的分段摘要，请合并成一份不重复的结构化摘要，保持 Markdown。只输出结果。\n\n' + merged,
						function (e2, r2) { if (e2) { cb(null, merged); return; } cb(null, r2); });
					return;
				}
				var seg = parts[idx];
				var head = parts.length > 1 ? ('（第 ' + (idx + 1) + '/' + parts.length + ' 段）\n') : '';
				Transcribe._chat(url, key, model, prompt + '\n\n---\n' + head + seg, function (e, r) {
					if (e) { cb(e); return; }
					texts.push(r);
					idx++;
					step();
				});
			})();
		};

		Transcribe._chat = function (url, key, model, userText, cb) {
			var payload = {
				model: model,
				messages: [
					{ role: 'system', content: '你是一个精确、简洁的中文内容编辑。' },
					{ role: 'user', content: userText }
				],
				temperature: 0.3
			};
			Transcribe._req({
				url: url,
				headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
				data: JSON.stringify(payload),
				timeout: 180000
			}, function (err, res) {
				if (err) { cb(err); return; }
				if (res.status < 200 || res.status >= 300) { cb(new Error(Transcribe._httpHint(res.status, res.responseText))); return; }
				var data = U.safeJson(res.responseText, null);
				if (!data || !data.choices || !data.choices.length) { cb(new Error('模型返回格式异常')); return; }
				var m = data.choices[0].message || {};
				cb(null, String(m.content || '').trim());
			});
		};

		

								Transcribe._writeAscii = function (view, off, s) {
			for (var i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
		};

		Transcribe.encodeWav = function (f32, sampleRate) {
			var len = f32.length;
			var buf = new ArrayBuffer(44 + len * 2);
			var view = new DataView(buf);
			Transcribe._writeAscii(view, 0, 'RIFF');
			view.setUint32(4, 36 + len * 2, true);
			Transcribe._writeAscii(view, 8, 'WAVE');
			Transcribe._writeAscii(view, 12, 'fmt ');
			view.setUint32(16, 16, true);
			view.setUint16(20, 1, true); 
			view.setUint16(22, 1, true); 
			view.setUint32(24, sampleRate, true);
			view.setUint32(28, sampleRate * 2, true);
			view.setUint16(32, 2, true);
			view.setUint16(34, 16, true);
			Transcribe._writeAscii(view, 36, 'data');
			view.setUint32(40, len * 2, true);
			var off = 44;
			for (var i = 0; i < len; i++) {
				var s = f32[i];
				if (s > 1) s = 1; else if (s < -1) s = -1;
				view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
				off += 2;
			}
			return buf;
		};

				Transcribe.decodeToMono = function (arrayBuffer, cb) {
			var AC = window.AudioContext || window.webkitAudioContext;
			if (!AC) { cb(new Error('环境不支持 AudioContext，无法切分音频')); return; }
			var ctx;
			try { ctx = new AC(); } catch (e) { cb(new Error('无法创建 AudioContext: ' + e.message)); return; }
			var done = false;
			var finish = function (err, r) { if (done) return; done = true; try { ctx.close(); } catch (e2) {} cb(err, r); };
			var fail = function (e) { finish(new Error('音频解码失败（格式可能不被浏览器支持）: ' + (e && e.message || e))); };
			try {
				var p = ctx.decodeAudioData(arrayBuffer, function (buf) {
					try {
						var secs = buf.duration;
						var frames = Math.ceil(secs * Transcribe.TARGET_RATE);
						if (!(frames > 0)) { fail('时长无效'); return; }
						var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
						if (!OAC) { fail('环境不支持 OfflineAudioContext'); return; }
						var off = new OAC(1, frames, Transcribe.TARGET_RATE);
						var src = off.createBufferSource();
						src.buffer = buf;
						src.connect(off.destination);
						src.start();
						off.startRendering().then(function (rendered) {
							finish(null, { data: rendered.getChannelData(0), rate: Transcribe.TARGET_RATE, seconds: secs });
						}).catch(function (e) { fail(e); });
					} catch (e) { fail(e); }
				}, fail);
				if (p && p.then) p.catch(fail);
			} catch (e) { fail(e); }
		};

				Transcribe.sliceWav = function (pcm, rate, chunkSeconds) {
			var per = Math.max(30, Number(chunkSeconds) || Transcribe.CHUNK_SECONDS) * rate;
			var out = [];
			for (var start = 0; start < pcm.length; start += per) {
				var end = Math.min(pcm.length, start + per);
				var sub = pcm.subarray ? pcm.subarray(start, end) : pcm.slice(start, end);
				var buf = Transcribe.encodeWav(sub, rate);
				out.push(new Blob([buf], { type: 'audio/wav' }));
			}
			return out;
		};

		

				Transcribe.fetchAudio = function (url, onProgress, cb) {
			var headers = {};
			try {
				var ch = State.config.customHeaders || {};
				if (ch.Referer) headers['Referer'] = ch.Referer;
				if (ch.UserAgent) headers['User-Agent'] = ch.UserAgent;
				if (ch.Cookie) headers['Cookie'] = ch.Cookie;
			} catch (e) {}
			var tooBig = false;
			Transcribe._req({
				method: 'GET',
				url: url,
				headers: headers,
				responseType: 'blob',
				timeout: 0, 
				onprogress: function (e) {
					if (!onProgress || !e || !e.lengthComputable) return;
					if (e.total > Transcribe.MAX_SOURCE) { tooBig = true; return; }
					onProgress(e.loaded, e.total);
				}
			}, function (err, res) {
				if (err) { cb(new Error('音频下载失败: ' + err.message)); return; }
				if (tooBig) { cb(new Error('音频过大（超过 ' + Math.round(Transcribe.MAX_SOURCE / 1048576) + 'MB）')); return; }
				if (res.status < 200 || res.status >= 300) { cb(new Error('音频下载失败 HTTP ' + res.status)); return; }
				if (!res.response) { cb(new Error('未取到音频内容')); return; }
				cb(null, res.response);
			});
		};

		

				Transcribe.transcribeBlob = function (blob, onStage, cb) {
			var maxBytes = (Number(State.config.asrMaxMB) || 24) * 1024 * 1024;
			if (blob.size <= maxBytes) {
				onStage && onStage('asr', 1, 1);
				Transcribe.asr(blob, cb, function (e) {
					if (e && e.lengthComputable) onStage && onStage('upload', e.loaded, e.total);
				});
				return;
			}
			if (blob.size > Transcribe.DECODE_LIMIT) {
				cb(new Error('音频约 ' + Math.round(blob.size / 1048576) + 'MB，超过本地切片上限（'
					+ Math.round(Transcribe.DECODE_LIMIT / 1048576) + 'MB）。请把「单次上传上限」调大，或改用外部工具分片。'));
				return;
			}
			onStage && onStage('decode', 0, 1);
			var rd = new FileReader();
			rd.onerror = function () { cb(new Error('读取音频内容失败')); };
			rd.onload = function () {
				Transcribe.decodeToMono(rd.result, function (err, pcm) {
					if (err) { cb(err); return; }
					var parts = Transcribe.sliceWav(pcm.data, pcm.rate, State.config.asrChunkSeconds || Transcribe.CHUNK_SECONDS);
					if (!parts.length) { cb(new Error('切分后没有可用片段')); return; }
					var texts = [];
					var i = 0;
					(function step() {
						if (i >= parts.length) { cb(null, texts.join('\n').trim()); return; }
						onStage && onStage('asr', i + 1, parts.length);
						Transcribe.asr(parts[i], function (e2, t) {
							if (e2) { cb(e2); return; }
							if (t) texts.push(t);
							i++;
							step();
						});
					})();
				});
			};
			try { rd.readAsArrayBuffer(blob); } catch (e) { cb(new Error('读取失败: ' + e.message)); }
		};

		Transcribe.run = function (opts, cb) {
			opts = opts || {};
			var onStage = opts.onStage || function () {};
			var url = opts.url;
			var blob = opts.blob;
			var doSummary = opts.summarize !== false && Transcribe.summaryReady();
			var aborted = false;
			Diag.stats.transcribeCount++;

			var afterText = function (err, text) {
				if (aborted) return;
				if (err) { Diag.stats.transcribeFailCount++; cb({ ok: false, reason: err.message }); return; }
				if (!text) { Diag.stats.transcribeFailCount++; cb({ ok: false, reason: '没有识别到语音内容' }); return; }
				if (!doSummary) { finish(null, text, ''); return; }
				onStage('summary', 0, 1);
				Transcribe.summarize(text, opts.style, function (e2, sum) {
					if (aborted) return;
										finish(null, text, sum || '', e2 ? e2.message : '');
				});
			};

			var finish = function (err, text, summary, sumErr) {
				if (aborted) return;
				if (err) { Diag.stats.transcribeFailCount++; cb({ ok: false, reason: err.message }); return; }
				var rec = {
					title: opts.title || '', url: url || '', at: U.now(),
					text: text, summary: summary || '', reason: sumErr || '',
					chars: text.length
				};
				Transcribe.pushHistory(rec);
				cb({ ok: true, result: rec });
			};

			if (blob) { Transcribe.transcribeBlob(blob, onStage, afterText); return { abort: function () { aborted = true; } }; }
			if (!url) { cb({ ok: false, reason: '没有音频来源' }); return { abort: function () {} }; }
			onStage('fetch', 0, 0);
			Transcribe.fetchAudio(url, function (l, t) { onStage('fetch', l, t); }, function (err, b) {
				if (aborted) return;
				if (err) { Diag.stats.transcribeFailCount++; cb({ ok: false, reason: err.message }); return; }
				Transcribe.transcribeBlob(b, onStage, afterText);
			});
			return { abort: function () { aborted = true; } };
		};

		Transcribe.pushHistory = function (rec) {
			if (!U.isArr(State.config.transcribeHistory)) State.config.transcribeHistory = [];
			State.config.transcribeHistory.unshift({
				title: rec.title, url: rec.url, at: rec.at, chars: rec.chars,
				text: String(rec.text || '').slice(0, Transcribe.HISTORY_TEXT_MAX),
				summary: String(rec.summary || '').slice(0, Transcribe.HISTORY_TEXT_MAX),
				truncated: String(rec.text || '').length > Transcribe.HISTORY_TEXT_MAX
			});
			if (State.config.transcribeHistory.length > Transcribe.HISTORY_MAX) {
				State.config.transcribeHistory.length = Transcribe.HISTORY_MAX;
			}
			State.save();
		};

		Transcribe.clearHistory = function () {
			State.config.transcribeHistory = [];
			State.save();
		};

		Transcribe.toMarkdown = function (rec) {
			var L = [];
			L.push('# ' + (rec.title || '转写文稿'));
			L.push('');
			L.push('- 来源: ' + (rec.url || '(本地录音)'));
			L.push('- 时间: ' + new Date(rec.at || U.now()).toLocaleString());
			L.push('- 字数: ' + (rec.chars || (rec.text || '').length));
			L.push('');
			if (rec.summary) { L.push('## AI 摘要'); L.push(''); L.push(rec.summary); L.push(''); }
			L.push('## 全文');
			L.push('');
			L.push(rec.text || '');
			return L.join('\n');
		};

		return Transcribe;
	})();

	var UI = (function () {
		'use strict';
		var UI = {};

							UI.isEffectivelyDark = function () {
		try {
			if (State && State.config && State.config.uiStyle === 'terminal') return true;
		} catch (e) {}
		return State.getTheme() === 'dark';
	};

	UI._thumbCache = {};
	UI._thumbCacheLru = U.lru(UI._thumbCache, 120);
	UI._thumbExtracting = {};

	UI._extractVideoThumb = function (url, onSuccess, onError) {
		if (UI._thumbCache[url]) {
			if (onSuccess) onSuccess(UI._thumbCache[url]);
			return;
		}
		if (UI._thumbExtracting[url]) return;
		UI._thumbExtracting[url] = true;

		var done = false;
		var cleanup = function () {
			done = true;
			delete UI._thumbExtracting[url];
		};

				var extractFromBlob = function(blob) {
			if (done) return;
			try {
				var blobUrl = URL.createObjectURL(blob);
				var video = document.createElement('video');
				video.src = blobUrl;
				video.muted = true;
				video.playsInline = true;
				video.preload = 'auto';

				var innerDone = false;
				var innerCleanup = function() {
					innerDone = true;
					try { video.pause(); video.src = ''; video.load(); } catch(e){}
					try { URL.revokeObjectURL(blobUrl); } catch(e){}
				};

				var onReady = function() {
					if (innerDone || done) return;
					try {
						var canvas = document.createElement('canvas');
						var w = video.videoWidth || 320;
						var h = video.videoHeight || 180;
						var maxW = 400;
						if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
						canvas.width = w;
						canvas.height = h;
						var ctx = canvas.getContext('2d');
						if (!ctx) { innerCleanup(); cleanup(); if (onError) onError(new Error('canvas context error')); return; }
						ctx.drawImage(video, 0, 0, w, h);
						var dataUrl = canvas.toDataURL('image/jpeg', 0.7);
						UI._thumbCacheLru.set(url, dataUrl); 
						innerCleanup();
						cleanup();
						if (onSuccess) onSuccess(dataUrl);
					} catch (err) {
						innerCleanup();
						cleanup();
						if (onError) onError(err);
					}
				};

				video.addEventListener('loadeddata', function() {
					if (innerDone || done) return;
					try { video.currentTime = Math.min(1, (video.duration || 2) / 4); } catch(e) { onReady(); }
				});
				video.addEventListener('seeked', onReady);
				video.addEventListener('error', function() {
					innerCleanup();
					cleanup();
					if (onError) onError(new Error('video decode error'));
				});
				setTimeout(function() {
					if (!innerDone && !done) { innerCleanup(); cleanup(); if (onError) onError(new Error('timeout')); }
				}, 15000);
				video.load();
			} catch (err) {
				cleanup();
				if (onError) onError(err);
			}
		};

				if (typeof GM_xmlhttpRequest === 'function') {
			try {
				GM_xmlhttpRequest({
					method: 'GET',
					url: url,
					responseType: 'blob',
					headers: { 'Range': 'bytes=0-524287', 'Referer': location.href },
					onload: function(response) {
						if (done) return;
						if (response.status >= 200 && response.status < 300 && response.response) {
							extractFromBlob(response.response);
						} else {
							cleanup();
							if (onError) onError(new Error('http ' + response.status));
						}
					},
					onerror: function() {
						cleanup();
						if (onError) onError(new Error('network error'));
					},
					ontimeout: function() {
						cleanup();
						if (onError) onError(new Error('timeout'));
					}
				});
			} catch (err) {
				cleanup();
				if (onError) onError(err);
			}
		} else {
						cleanup();
			if (onError) onError(new Error('GM_xmlhttpRequest unavailable'));
		}
	};

	UI._loadVisibleVideoThumbs = function (container) {
		if (!container) return;
		var thumbs = container.querySelectorAll('._ms_v_thumb');
		if (!thumbs || thumbs.length === 0) return;
		var containerRect = container.getBoundingClientRect();
		var count = 0;
		for (var i = 0; i < thumbs.length; i++) {
			if (count >= 4) break;
			var el = thumbs[i];
			var url = el.getAttribute('data-url');
			if (!url || UI._thumbCache[url] || UI._thumbExtracting[url]) continue;
			var rect = el.getBoundingClientRect();
			var visible = rect.bottom > containerRect.top && rect.top < containerRect.bottom;
			if (visible) {
				count++;
				(function (elem, u) {
					UI._extractVideoThumb(u, function (dataUrl) {
						try {
							var img = document.createElement('img');
							img.src = dataUrl;
							img.loading = 'lazy';
							img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;';
							img.onerror = function() {
								var d = document.createElement('div');
								d.style.cssText = 'width:100%;height:100%;background:linear-gradient(135deg,' + MS_CONFIG.COLORS.darkGradientStart + ',' + MS_CONFIG.COLORS.darkGradientEnd + ');display:flex;align-items:center;justify-content:center;color:' + MS_CONFIG.COLORS.white + ';font-size:28px;';
								d.innerHTML = MS_CONFIG.ICONS.arrowRight;
																								if (img.parentNode) img.parentNode.replaceChild(d, img);
							};
														var host = elem.parentNode;
							if (host) host.replaceChild(img, elem);
						} catch (e) {}
					});
				})(el, url);
			}
		}
	};

	UI._vlinkObserver = null;
	UI._vlinkResolving = {};
	UI._vlinkResolved = {};
	UI._vlinkScrollTimer = null;
	UI._vlinkIsScrolling = false;

	UI._initVlinkObserver = function() {
		if (UI._vlinkObserver) return;
		try {
			UI._vlinkObserver = new IntersectionObserver(function(entries) {
				for (var i = 0; i < entries.length; i++) {
					var entry = entries[i];
					var card = entry.target;
					var url = card.getAttribute('data-vlink');
					if (!url) continue;
					if (entry.isIntersecting) {
						card.classList.add('_ms_vlink_visible');
						if (!UI._vlinkIsScrolling && !UI._vlinkResolved[url] && !UI._vlinkResolving[url]) {
							UI._lazyResolveVlink(card, url);
						}
					} else {
						card.classList.remove('_ms_vlink_visible');
					}
				}
			}, { rootMargin: '100px', threshold: 0.1 });
		} catch (e) {
			UI._vlinkObserver = null;
		}
	};

	UI._lazyResolveVlink = function(card, url) {
		if (UI._vlinkResolved[url] || UI._vlinkResolving[url]) return;
		UI._vlinkResolving[url] = true;
		Resolver.resolve(url, function(data, err) {
			delete UI._vlinkResolving[url];
			if (data) {
				UI._vlinkResolved[url] = data;
				UI._updateVlinkCard(card, data);
			}
		});
	};

	UI._updateVlinkCard = function(card, data) {
		try {
			var c = UI.colors();
			var cover = data.cover || '';
			var title = data.title || '';
			var coverEl = card.querySelector('img');
			var firstChild = card.firstElementChild;
			var isPlaceholder = firstChild && firstChild.tagName === 'DIV' && firstChild.innerHTML === MS_CONFIG.ICONS.video && firstChild.style.width === '100%';
			if (cover && !coverEl && isPlaceholder) {
				var img = document.createElement('img');
				img.src = cover;
				img.loading = 'lazy';
				var h = firstChild.style.height || '90px';
				var iconSize = parseInt(h) >= 150 ? '36px' : '24px';
				img.style.cssText = 'width:100%;height:' + h + ';object-fit:cover;display:block;';
				img.onerror = function() {
					var d = document.createElement('div');
					d.style.cssText = 'width:100%;height:' + h + ';background:linear-gradient(135deg,#1e293b,#334155);display:flex;align-items:center;justify-content:center;color:#fff;font-size:' + iconSize + ';';
					d.innerHTML = MS_CONFIG.ICONS.video;
					this.parentNode.replaceChild(d, this);
				};
				firstChild.parentNode.replaceChild(img, firstChild);
			}
			if (title) {
				var infoDiv = card.children[1];
				if (infoDiv) {
					var titleDiv = infoDiv.firstElementChild;
					if (titleDiv && titleDiv.style.overflow === 'hidden') {
						titleDiv.textContent = title;
					}
				}
			}
			var resolveBtn = card.querySelector('._ms_resolve_btn');
			if (resolveBtn) {
				resolveBtn.innerHTML = MS_CONFIG.ICONS.checkBig + ' 已解析';
				resolveBtn.style.color = MS_CONFIG.COLORS.success;
			}
		} catch (e) {}
	};

	UI._observeVlinkCards = function(container) {
		if (!UI._vlinkObserver) UI._initVlinkObserver();
		if (!UI._vlinkObserver) return;
		var cards = container.querySelectorAll('[data-vlink]');
		for (var i = 0; i < cards.length; i++) {
			UI._vlinkObserver.observe(cards[i]);
		}
	};

	UI._onVlinkScrollStart = function() {
		UI._vlinkIsScrolling = true;
		var cards = document.querySelectorAll('[data-vlink]._ms_vlink_visible');
		for (var i = 0; i < cards.length; i++) {
			cards[i].classList.add('_ms_vlink_paused');
		}
	};

	UI._onVlinkScrollEnd = function() {
		UI._vlinkIsScrolling = false;
		var cards = document.querySelectorAll('[data-vlink]._ms_vlink_visible');
		for (var i = 0; i < cards.length; i++) {
			cards[i].classList.remove('_ms_vlink_paused');
			var url = cards[i].getAttribute('data-vlink');
			if (url && !UI._vlinkResolved[url] && !UI._vlinkResolving[url]) {
				UI._lazyResolveVlink(cards[i], url);
			}
		}
	};

	UI.batchResolveVlinks = function(vLinkList, progressCb, doneCb) {
		var urls = [];
		for (var i = 0; i < vLinkList.length; i++) {
			if (!UI._vlinkResolved[vLinkList[i].url]) {
				urls.push(vLinkList[i].url);
			}
		}
		if (urls.length === 0) {
			if (doneCb) doneCb(0, 0, 0);
			return;
		}
		var total = urls.length;
		var completed = 0;
		var successCount = 0;
		var failedCount = 0;
		var index = 0;
		var concurrent = Resolver._maxConcurrent || 3;

		function next() {
			if (index >= total) return;
			var currentIndex = index;
			index++;
			var url = urls[currentIndex];
			Resolver.resolve(url, function(data, err) {
				completed++;
				if (data) {
					successCount++;
					UI._vlinkResolved[url] = data;
					var card = document.querySelector('[data-vlink="' + url + '"]');
					if (card) UI._updateVlinkCard(card, data);
				} else {
					failedCount++;
				}
				if (progressCb) progressCb(completed, total, successCount, failedCount);
				if (completed >= total) {
					if (doneCb) doneCb(total, successCount, failedCount);
				} else {
					next();
				}
			});
		}

		for (var j = 0; j < Math.min(concurrent, total); j++) {
			next();
		}
	};

	UI._isMobile = function() {
		try { return window.innerWidth < 768; } catch (e) { return false; }
	};

	UI._setupMobileGestures = function() {
		if (!UI._isMobile()) return;
		var btn = UI._floatBtn;
		if (!btn) return;

		var snapTimer = null;
		function snapToEdge() {
			if (snapTimer) clearTimeout(snapTimer);
			snapTimer = setTimeout(function() {
				var rect = btn.getBoundingClientRect();
				var btnW = rect.width;
				var btnH = rect.height;
				var viewW = window.innerWidth;
				var viewH = window.innerHeight;
				var centerX = rect.left + btnW / 2;
				var newLeft = centerX < viewW / 2 ? 4 : viewW - btnW - 4;
				var newTop = Math.max(4, Math.min(viewH - btnH - 4, rect.top));
				btn.style.transition = 'left 0.3s cubic-bezier(.22,1,.36,1), top 0.3s cubic-bezier(.22,1,.36,1)';
				btn.style.left = newLeft + 'px';
				btn.style.top = newTop + 'px';
				btn.style.right = 'auto';
				btn.style.bottom = 'auto';
				setTimeout(function() {
					btn.style.transition = '';
				}, 300);
				if (State.config) {
					State.config.btnPos = { x: newLeft, y: newTop };
					try { State.save(); } catch (e) {}
				}
			}, 100);
		}

		var origUp = btn._msOrigUp;
		if (origUp) return;

		var touchEndHandler = function() {
			snapToEdge();
		};
		btn._msOrigUp = touchEndHandler;
		btn.addEventListener('touchend', touchEndHandler);
		btn.addEventListener('touchcancel', touchEndHandler);

		var panel = State.panel;
		if (panel) {
			var footer = document.getElementById('_ms_footer');
			if (footer) {
				footer.style.paddingBottom = 'calc(10px + env(safe-area-inset-bottom))';
			}
			var box = document.getElementById('_ms_box');
			if (box) {
				box.style.paddingBottom = 'env(safe-area-inset-bottom)';
			}
		}
	};

		UI._floatBtn = null;

		try {
		if (typeof GM_addStyle === 'function') {
			GM_addStyle([
				'#_ms_float {',
				'  position: fixed !important;',
				'  right: 16px !important;',
				'  bottom: 20px !important;',
				'  z-index: ' + (MS_CONFIG.SIZES.zMax) + ' !important;',
				'  width: ' + MS_CONFIG.SIZES.floatBtn + 'px !important;',
				'  height: ' + MS_CONFIG.SIZES.floatBtn + 'px !important;',
				'  border-radius: 50% !important;',
				'  border: none !important;',
				'  background: linear-gradient(135deg,' + MS_CONFIG.COLORS.primary2 + ',' + MS_CONFIG.COLORS.purple2 + ') !important;',
				'  cursor: pointer !important;',
				'  display: flex !important;',
				'  align-items: center !important;',
				'  justify-content: center !important;',
				'  visibility: visible !important;',
				'  opacity: 1 !important;',
				'  box-shadow: 0 8px 24px rgba(139,92,246,.6) !important;',
				'  user-select: none !important;',
				'  -webkit-user-select: none !important;',
				'  touch-action: manipulation !important;',
				'  -webkit-tap-highlight-color: transparent !important;',
				'  -webkit-appearance: none !important;',
				'  -moz-appearance: none !important;',
				'  appearance: none !important;',
				'  font-family: -apple-system, system-ui, "Apple Color Emoji", sans-serif !important;',
				'}',
				'#_ms_float:active {',
				'  transform: scale(0.92) !important;',
				'}',
			].join('\n'));
		}
	} catch (e) {}

	UI.buildFloatBtn = function () {
		if (window.__ms_btn_built__) return;
		var existing = document.getElementById('_ms_float');
		if (existing) {
			UI._floatBtn = existing;
			window.__ms_btn_built__ = true;
			UI._startFloatGuard();
			return;
		}
		var exists = UI._floatBtn && document.body && document.body.contains(UI._floatBtn);
		LOG.info('[MS] buildFloatBtn 调用, 已存在:', !!UI._floatBtn, 'body存在:', !!document.body, 'contains:', exists);
		if (exists) {
			window.__ms_btn_built__ = true;
			return;
		}
		var host = document.body || document.documentElement;
		if (!host || host.nodeType !== 1) {
			LOG.warn('[MS] buildFloatBtn: 宿主不存在，跳过');
			return;
		}

		try {
			var btn = document.createElement('div');
			btn.id = '_ms_float';
			btn.setAttribute('data-ms-btn', '1');
			btn.innerHTML = MS_CONFIG.ICONS.target;

						if (State.config && State.config.btnPos && State.config.btnPos.x != null && State.config.btnPos.y != null) {
				var px = parseFloat(State.config.btnPos.x);
				var py = parseFloat(State.config.btnPos.y);
				if (!isNaN(px) && !isNaN(py) && px >= 0 && px < window.innerWidth - 30 && py >= 0 && py < window.innerHeight - 30) {
					btn.style.left = px + 'px';
					btn.style.top = py + 'px';
					btn.style.right = 'auto';
					btn.style.bottom = 'auto';
				} else {
					State.config.btnPos = null;
				}
			}

						var dragging = false, moved = false, startX = 0, startY = 0, origX = 0, origY = 0;
			function onDown(e) {
				dragging = true; moved = false;
				var pt = e.touches ? e.touches[0] : e;
				startX = pt.clientX; startY = pt.clientY;
				var rect = btn.getBoundingClientRect();
				origX = rect.left; origY = rect.top;
				if (e.cancelable) { try { e.preventDefault(); } catch (e2) {} }
				try { e.stopPropagation(); } catch (e3) {}
				document.addEventListener('mousemove', onMove);
				document.addEventListener('mouseup', onUp);
			}
			function onMove(e) {
				if (!dragging) return;
				var pt = e.touches ? e.touches[0] : e;
				var dx = pt.clientX - startX, dy = pt.clientY - startY;
				if (!moved && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) moved = true;
				var nx = Math.max(4, Math.min(window.innerWidth - 66, origX + dx));
				var ny = Math.max(4, Math.min(window.innerHeight - 66, origY + dy));
				btn.style.left = nx + 'px'; btn.style.top = ny + 'px';
				btn.style.right = 'auto'; btn.style.bottom = 'auto';
				if (e.cancelable) { try { e.preventDefault(); } catch (e2) {} }
			}
			function onUp(e) {
				if (!dragging) return;
				dragging = false;
				document.removeEventListener('mousemove', onMove);
				document.removeEventListener('mouseup', onUp);
				if (moved) {
					var x = parseFloat(btn.style.left);
					var y = parseFloat(btn.style.top);
					if (!isNaN(x) && !isNaN(y) && State.config) {
						State.config.btnPos = { x: x, y: y };
						try { State.save(); } catch (e2) {}
					}
				} else {
					try {
						if (State.panelOpen) UI.closePanel();
						else UI.openPanel();
					} catch (e2) {}
				}
				if (e && e.cancelable) { try { e.preventDefault(); } catch (e3) {} }
			}

			btn.addEventListener('mousedown', onDown);
			try { btn.addEventListener('touchstart', onDown, { passive: false }); } catch (e) { btn.addEventListener('touchstart', onDown); }
			try { btn.addEventListener('touchmove', onMove, { passive: false }); } catch (e) { btn.addEventListener('touchmove', onMove); }
			btn.addEventListener('touchend', onUp);

						btn.addEventListener('contextmenu', function (e) {
				e.preventDefault();
				UI.showFloatContextMenu(e.clientX, e.clientY);
			});
			var longPressTimer = null;
			btn.addEventListener('touchstart', function (e) {
				longPressTimer = setTimeout(function () {
					longPressTimer = null;
					var touch = e.touches ? e.touches[0] : e;
					UI.showFloatContextMenu(touch.clientX, touch.clientY);
				}, 600);
			}, { passive: true });
			btn.addEventListener('touchend', function () { if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; } });
			btn.addEventListener('touchmove', function () { if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; } });

			host.appendChild(btn);
			UI._floatBtn = btn;
			window.__ms_btn_built__ = true;

			UI._startFloatGuard();
			UI._setupMobileGestures();

						U.safeRun(function () { UI.applyUiStyle(); }, 'applyUiStyle(floatBtn)');

						try {
				window.addEventListener('resize', function () {
					var b = UI._floatBtn || document.getElementById('_ms_float');
					if (!b) return;
					var rect = b.getBoundingClientRect();
					var size = MS_CONFIG.SIZES.floatBtn;
					var nx = Math.max(4, Math.min(window.innerWidth - size - 4, rect.left));
					var ny = Math.max(4, Math.min(window.innerHeight - size - 4, rect.top));
					if (nx !== rect.left || ny !== rect.top) {
						b.style.left = nx + 'px';
						b.style.top = ny + 'px';
						b.style.right = 'auto';
						b.style.bottom = 'auto';
						if (State.config) {
							State.config.btnPos = { x: nx, y: ny };
							try { State.save(); } catch (e2) {}
						}
					}
				});
			} catch (e) {}

			LOG.info('浮动按钮创建成功');
		} catch (err) {
			LOG.error('浮动按钮创建失败:', err.message);
		}
	};

		UI._floatGuardRunning = false;
	UI._rebuildTimer = null;
	UI._floatMO = null;
	UI._floatMOTarget = null;

								UI._floatMObserve = function () {
		if (!UI._floatMO) return;
		var btn = UI._floatBtn || document.getElementById('_ms_float');
		var target = (btn && btn.parentNode) || document.body || document.documentElement;
		if (!target || UI._floatMOTarget === target) return;
		try { UI._floatMO.disconnect(); } catch (e) {}
		try {
			UI._floatMO.observe(target, { childList: true });
			UI._floatMOTarget = target;
		} catch (e) {}
	};

	UI._startFloatGuard = function () {
		if (UI._floatGuardRunning) return;
		UI._floatGuardRunning = true;

		function scheduleRebuild() {
			if (UI._rebuildTimer) return;
			UI._rebuildTimer = setTimeout(function () {
				UI._rebuildTimer = null;
				UI._floatBtn = null;
				window.__ms_btn_built__ = false;
				UI.buildFloatBtn();
				UI._floatMObserve(); 
			}, 300);
		}

		try {
			var mo = new MutationObserver(function (mutations) {
				var btnRemoved = false;
				for (var i = 0; i < mutations.length; i++) {
					var removed = mutations[i].removedNodes;
					if (!removed) continue;
					for (var j = 0; j < removed.length; j++) {
						var node = removed[j];
						if (node.id === '_ms_float' || (node.getAttribute && node.getAttribute('data-ms-btn') === '1')) {
							btnRemoved = true;
							break;
						}
					}
					if (btnRemoved) break;
				}
				if (btnRemoved) {
					LOG.warn('检测到浮动按钮被移除，300ms 后重建');
					scheduleRebuild();
				}
			});
			UI._floatMO = mo;
			UI._floatMObserve();
			LOG.info('浮动按钮 MutationObserver 守护已启动');
		} catch (e) { LOG.warn('MutationObserver 守护启动失败:', e.message); }

		var guardCount = 0;
		function pollGuard() {
			try {
				var exists = document.getElementById('_ms_float');
				if (!exists) {
					LOG.warn('轮询检测到按钮缺失，重建中... 次数:', guardCount);
					scheduleRebuild();
				}
			} catch (e) {
				try { scheduleRebuild(); } catch (e2) {}
			}
			guardCount++;
			var delay = guardCount < 10 ? 2000 : 5000;
			setTimeout(pollGuard, delay);
		}
		setTimeout(pollGuard, 1000);
		setTimeout(pollGuard, 3000);
	};
			UI._palettes = {};
	UI._paletteOrder = [];

	UI.registerPalette = function (id, def) {
		if (!id || !def) return;
		var fallback = MS_CONFIG.PALETTES.indigo;
		UI._palettes[id] = {
			id: id,
			nameKey: def.nameKey || id,
			light: def.light || fallback.light,
			dark: def.dark || fallback.dark,
		};
		if (UI._paletteOrder.indexOf(id) === -1) UI._paletteOrder.push(id);
	};

	UI._getCustomPalette = function (id) {
		var list = State.config && U.isArr(State.config.customPalettes) ? State.config.customPalettes : [];
		for (var i = 0; i < list.length; i++) {
			if (list[i].id === id) return list[i];
		}
		return null;
	};

	UI.listPalettes = function () {
		var dark = UI.isEffectivelyDark();
		var out = [];
		for (var i = 0; i < UI._paletteOrder.length; i++) {
			var id = UI._paletteOrder[i];
			var p = UI._palettes[id];
			if (!p) continue;
			var mode = dark ? p.dark : p.light;
			out.push({
				id: id,
				name: LANG.t(p.nameKey),
				swatch: [mode.primary, mode.primary2],
			});
		}
		var custom = State.config && U.isArr(State.config.customPalettes) ? State.config.customPalettes : [];
		for (var ci = 0; ci < custom.length; ci++) {
			var cp = custom[ci];
			if (!cp || !cp.id) continue;
			var cMode = dark ? (cp.dark || {}) : (cp.light || {});
			out.push({
				id: cp.id,
				name: cp.name || LANG.t('paletteCustom'),
				swatch: [cMode.primary || MS_CONFIG.COLORS.primary, cMode.primary2 || MS_CONFIG.COLORS.primary2],
				custom: true,
			});
		}
		return out;
	};

	UI.getPalette = function () {
		var id = State.config && State.config.palette;
		if (!id) id = 'indigo';
		if (UI._palettes[id]) return id;
		if (UI._getCustomPalette(id)) return id;
		return 'indigo';
	};

		UI._paletteColors = function () {
		var id = UI.getPalette();
		var dark = UI.isEffectivelyDark();
		var built = UI._palettes[id];
		if (built) return dark ? built.dark : built.light;
		var custom = UI._getCustomPalette(id); 
		if (custom) {
			var mode = dark ? (custom.dark || {}) : (custom.light || {});
			return {
				primary: mode.primary || MS_CONFIG.COLORS.primary,
				primary2: mode.primary2 || MS_CONFIG.COLORS.primary2
			};
		}
		return UI._palettes['indigo'].light;
	};

	UI.setPalette = function (id) {
		if (!id) id = 'indigo';
		if (!UI._palettes[id] && !UI._getCustomPalette(id)) id = 'indigo';
		State.config.palette = id;
		State.save();
		try { applyPanelThemeNow(); } catch (e) {}
		try { UI.renderSettings(); } catch (e) {}
	};

	UI.addCustomPalette = function (pal) {
		if (!pal || !pal.id) return;
		var list = State.config.customPalettes || (State.config.customPalettes = []);
		for (var i = 0; i < list.length; i++) {
			if (list[i].id === pal.id) { list[i] = pal; return; }
		}
		list.push(pal);
		State.save();
	};

	UI.removeCustomPalette = function (id) {
		var list = State.config.customPalettes;
		if (!U.isArr(list)) return;
		State.config.customPalettes = list.filter(function (p) { return p.id !== id; });
		if (State.config.palette === id) UI.setPalette('indigo');
		else State.save();
	};

		for (var i = 0; i < MS_CONFIG.PALETTE_ORDER.length; i++) {
		var pid = MS_CONFIG.PALETTE_ORDER[i];
		UI.registerPalette(pid, MS_CONFIG.PALETTES[pid]);
	}

	UI.colors = function () {
		var dark = UI.isEffectivelyDark();
		var pc = UI._paletteColors();
		return {
			bg: dark ? MS_CONFIG.COLORS.dark.bg : MS_CONFIG.COLORS.light.bg,
			bg2: dark ? MS_CONFIG.COLORS.dark.bg2 : MS_CONFIG.COLORS.light.bg2,
			bg3: dark ? MS_CONFIG.COLORS.dark.bg3 : MS_CONFIG.COLORS.light.bg3,
			txt: dark ? MS_CONFIG.COLORS.dark.txt : MS_CONFIG.COLORS.light.txt,
			sub: dark ? MS_CONFIG.COLORS.dark.sub : MS_CONFIG.COLORS.light.sub,
			border: dark ? MS_CONFIG.COLORS.dark.border : MS_CONFIG.COLORS.light.border,
			primary: pc.primary,
			primary2: pc.primary2,
			success: MS_CONFIG.COLORS.success,
			warn: MS_CONFIG.COLORS.warn,
			danger: MS_CONFIG.COLORS.danger,
		};
	};
		UI.createToggle = function (initialState, onChange, color) {
		var container = document.createElement('div');
		container.style.cssText = 'position:relative;width:48px;height:28px;border-radius:14px;cursor:pointer;transition:background .25s ease;';

		var knob = document.createElement('div');
		knob.style.cssText = 'position:absolute;top:2px;width:24px;height:24px;border-radius:50%;background:' + MS_CONFIG.COLORS.white + ';box-shadow:0 2px 6px rgba(0,0,0,.25);transition:transform .25s ease;';

		container.appendChild(knob);

		function setColor(c) {
			var dark = UI.isEffectivelyDark();
			var bgOff = dark ? MS_CONFIG.COLORS.dark.bg3 : MS_CONFIG.COLORS.light.bg3;
			container.style.background = c ? c : bgOff;
		}

		function setState(on) {
			var c = UI.colors();
			if (on) {
				var activeColor = color || c.primary;
				container.style.background = activeColor;
				knob.style.transform = 'translateX(20px)';
			} else {
				setColor();
				knob.style.transform = 'translateX(0)';
			}
		}

		setState(initialState);

		container.addEventListener('click', function () {
			var newState = !initialState;
			initialState = newState;
			setState(newState);
			if (onChange) onChange(newState);
		});

		container._setState = setState;
		container._setColor = setColor;

		return container;
	};
										UI._namedColorCache = {};

	UI._ios27Rgba = function (color, alpha) {
		var h = String(color == null ? '' : color).trim();
		var m = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(h);
		if (m) {
			var s = m[1];
			if (s.length === 3) s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2);
			var n = parseInt(s, 16);
			return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + alpha + ')';
		}
						var m2 = /^rgba?\(([^)]+)\)$/i.exec(h);
		if (m2) {
			var parts = m2[1].split(/[,\/]/);
			if (parts.length >= 3) {
				var r = parseFloat(parts[0]), g = parseFloat(parts[1]), b = parseFloat(parts[2]);
				if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
					return 'rgba(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ',' + alpha + ')';
				}
			}
			return h;
		}
		var m3 = /^hsla?\(([^)]+)\)$/i.exec(h);
		if (m3) {
			var hp = m3[1].split(/[,\/]/);
			if (hp.length >= 3) {
				return 'hsla(' + hp[0].trim() + ',' + hp[1].trim() + ',' + hp[2].trim() + ',' + alpha + ')';
			}
			return h;
		}
				if (/^[a-z]+$/i.test(h)) {
			if (UI._namedColorCache[h]) {
				return 'rgba(' + UI._namedColorCache[h] + ',' + alpha + ')';
			}
			try {
				var probe = document.createElement('span');
				probe.style.color = h;
				if (probe.style.color) {
					probe.style.display = 'none';
					(document.body || document.documentElement).appendChild(probe);
					var computed = '';
					try { computed = window.getComputedStyle(probe).color; } catch (e) {}
					if (probe.parentNode) probe.parentNode.removeChild(probe);
					var m4 = /^rgba?\(([^)]+)\)$/i.exec(computed || '');
					if (m4) {
						var cp = m4[1].split(',');
						if (cp.length >= 3) {
							var rgbPrefix = cp[0].trim() + ',' + cp[1].trim() + ',' + cp[2].trim();
							UI._namedColorCache[h] = rgbPrefix; 
							return 'rgba(' + rgbPrefix + ',' + alpha + ')';
						}
					}
				}
			} catch (e) {}
		}
		return h || 'rgba(120,120,255,' + alpha + ')';
	};

	UI._buildIos27Css = function (dark, isMob) {
		var c = UI.colors();
		var pc = UI._paletteColors() || {};
		var rgba = UI._ios27Rgba;
		var A = pc.primary || MS_CONFIG.COLORS.primary;
		var A2 = pc.primary2 || MS_CONFIG.COLORS.primary2;
		var R = MS_CONFIG.COLORS.rose || A2;
		var S = '#_ms_panel._ms_style_ios27';
		var L = S + ' ._ms_glass_layers';
		var B = 'body._ms_ios27';
		var spring = 'cubic-bezier(.34,1.56,.64,1)';
		var rOuter = isMob ? '0' : '26px 0 0 26px';
		var rTop = isMob ? '0' : '26px 0 0 0';
		var rCard = isMob ? '18px' : '20px';

				var glassColor = dark ? 'rgba(14,15,26,0.42)' : 'rgba(255,255,255,0.46)';
		var glassImage = dark
			? 'linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.015) 44%)'
			: 'linear-gradient(180deg,rgba(255,255,255,0.46),rgba(255,255,255,0.06) 48%)';
				var glassBlur = dark ? 'blur(44px) saturate(215%) brightness(1.07)' : 'blur(38px) saturate(185%) brightness(1.04)';
		var rim = dark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.88)';
		var hiTop = dark ? 'rgba(255,255,255,0.34)' : 'rgba(255,255,255,0.96)';
		var hiBottom = dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.46)';
		var hiSide = dark ? 'rgba(255,255,255,0.11)' : 'rgba(255,255,255,0.62)';
		var hiSoft = dark ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.72)';
		var layerRim = dark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.055)';
		var layerBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.46)';
		var fieldBg = dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.70)';
		var fieldRim = dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)';
		var cardBg = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.52)';
		var cardHover = dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.80)';
		var cardRest = dark ? '0 3px 12px rgba(0,0,0,0.30)' : '0 3px 12px rgba(0,0,0,0.08)';
		var cardLift = dark ? '0 18px 40px rgba(0,0,0,0.50)' : '0 18px 40px rgba(0,0,0,0.18)';
		var panelShadow = dark
			? '-12px 0 90px rgba(0,0,0,0.60),-2px 0 26px rgba(0,0,0,0.38)'
			: '-12px 0 90px rgba(0,0,0,0.20),-2px 0 26px rgba(0,0,0,0.10)';
								var dispersion = 'linear-gradient(115deg,' + (dark ? 'rgba(120,200,255,0.12)' : 'rgba(120,200,255,0.18)')
			+ ',rgba(255,255,255,0) 34%,rgba(255,255,255,0) 66%,' + (dark ? 'rgba(255,150,220,0.12)' : 'rgba(255,150,220,0.18)') + ')';
		var sweep = dark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.58)';
		var modalBg = dark ? 'rgba(21,22,34,0.74)' : 'rgba(255,255,255,0.80)';
		var modalBlur = dark ? 'blur(34px) saturate(200%)' : 'blur(30px) saturate(180%)';
				var flow = [rgba(A, dark ? 0.60 : 0.42), rgba(A2, dark ? 0.55 : 0.38), rgba(R, dark ? 0.46 : 0.30)];
		var specA = dark ? 0.34 : 0.55;
		var rippleA = dark ? 0.40 : 0.60;

		var css = '';

				css += S + '{background-color:' + glassColor + ' !important;background-image:' + glassImage + ' !important;'
			+ '-webkit-backdrop-filter:' + glassBlur + ' !important;backdrop-filter:' + glassBlur + ' !important;'
			+ 'border-radius:' + rOuter + ' !important;border:1px solid ' + rim + ' !important;box-sizing:border-box !important;overflow:hidden !important;'
			+ 'box-shadow:' + panelShadow + ',inset 0 1px 0 ' + hiTop + ',inset 0 -1px 0 ' + hiBottom
			+ ',inset 1px 0 0 ' + hiSide + ',inset -1px 0 0 ' + hiSide + ' !important;}';

				css += S + '>div:not(._ms_glass_layers){position:relative;z-index:1;}';
		css += L + '{position:absolute;inset:0;pointer-events:none;border-radius:inherit;overflow:hidden;contain:paint;}';

						css += L + ' ._ms_gl_wrap{position:absolute;inset:0;display:block;'
			+ 'transform:translate3d(calc(var(--_ms_px,0) * 9px),calc(var(--_ms_py,0) * 9px),0);}';
												css += L + ' ._ms_gl{position:absolute;display:block;opacity:.85;'
			+ 'border-radius:48% 52% 45% 55%/52% 45% 55% 48%;transform:translate3d(0,0,0);}';
		css += L + '._ms_gl_moving ._ms_gl_wrap{will-change:transform;}';
		css += L + ' ._ms_gl_1{width:82%;height:46%;left:-12%;top:-10%;'
			+ 'background-image:radial-gradient(closest-side,' + flow[0] + ',' + rgba(A, 0) + ' 72%);'
			+ 'animation:_ms_fluid_a 23s cubic-bezier(.37,0,.63,1) infinite;}';
		css += L + ' ._ms_gl_2{width:74%;height:42%;right:-16%;top:24%;'
			+ 'background-image:radial-gradient(closest-side,' + flow[1] + ',' + rgba(A2, 0) + ' 70%);'
			+ 'animation:_ms_fluid_b 29s cubic-bezier(.37,0,.63,1) infinite;}';
		if (!isMob) {
						css += L + ' ._ms_gl_3{width:88%;height:48%;left:-8%;bottom:-14%;'
				+ 'background-image:radial-gradient(closest-side,' + flow[2] + ',' + rgba(R, 0) + ' 70%);'
				+ 'animation:_ms_fluid_c 34s cubic-bezier(.37,0,.63,1) infinite;}';
		} else {
			css += L + ' ._ms_gl_3{display:none;}';
		}
				css += '@keyframes _ms_fluid_a{0%{transform:translate3d(0,0,0) scale(1);}'
			+ '18%{transform:translate3d(9%,7%,0) scale(1.09);}'
			+ '37%{transform:translate3d(17%,13%,0) scale(1.15);}'
			+ '58%{transform:translate3d(4%,19%,0) scale(1.03);}'
			+ '79%{transform:translate3d(-9%,11%,0) scale(.93);}100%{transform:translate3d(0,0,0) scale(1);}}';
		css += '@keyframes _ms_fluid_b{0%{transform:translate3d(0,0,0) scale(1);}'
			+ '22%{transform:translate3d(-12%,-6%,0) scale(1.08);}'
			+ '40%{transform:translate3d(-18%,-10%,0) scale(1.10);}'
			+ '64%{transform:translate3d(-11%,6%,0) scale(1.01);}'
			+ '82%{transform:translate3d(-6%,18%,0) scale(.92);}100%{transform:translate3d(0,0,0) scale(1);}}';
		css += '@keyframes _ms_fluid_c{0%{transform:translate3d(0,0,0) scale(1.02);}'
			+ '26%{transform:translate3d(10%,-9%,0) scale(.96);}'
			+ '45%{transform:translate3d(14%,-14%,0) scale(.90);}'
			+ '68%{transform:translate3d(2%,-10%,0) scale(1.04);}'
			+ '86%{transform:translate3d(-12%,-6%,0) scale(1.12);}100%{transform:translate3d(0,0,0) scale(1.02);}}';

				css += L + ' ._ms_gl_spec{position:absolute;inset:0;z-index:6;'
			+ 'background-image:radial-gradient(38% 32% at calc(var(--_ms_sx,0.5) * 100%) calc(var(--_ms_sy,-0.1) * 100%),rgba(255,255,255,' + specA + '),rgba(255,255,255,0) 70%);'
			+ 'opacity:.9;transition:opacity .3s ease;}';
				css += L + ' ._ms_gl_ripple{position:absolute;inset:0;z-index:6;'
			+ 'background-image:radial-gradient(34% 30% at calc(var(--_ms_sx,0.5) * 100%) calc(var(--_ms_sy,0.5) * 100%),rgba(255,255,255,' + rippleA + '),rgba(255,255,255,0) 72%);'
			+ 'opacity:0;transition:opacity .38s cubic-bezier(.22,1,.36,1);}';
				css += L + ' ._ms_gl_wet{position:absolute;inset:0;z-index:5;opacity:' + (dark ? '.42' : '.55') + ';'
			+ 'background-image:radial-gradient(30% 26% at calc(100% - var(--_ms_sx,0.5) * 82%) calc(100% - var(--_ms_sy,0.5) * 82%),'
			+ 'rgba(255,255,255,' + (dark ? '.14' : '.42') + '),rgba(255,255,255,0) 74%);}';
		css += S + '._ms_pressing ._ms_gl_ripple{opacity:1;transition:opacity .09s ease;}';
		css += S + '._ms_pressing ._ms_gl_1{animation-duration:11s;}';
		css += S + '._ms_pressing ._ms_gl_2{animation-duration:14s;}';
		css += S + '._ms_pressing ._ms_gl_wet{opacity:' + (dark ? '.62' : '.78') + ';transition:opacity .12s ease;}';

																		css += S + '::before{content:"";position:absolute;inset:0;z-index:3;pointer-events:none;border-radius:' + rOuter
			+ ';box-shadow:inset 0 0 26px rgba(255,255,255,' + (dark ? 0.08 : 0.30) + '),'
			+ 'inset 3px 0 14px -8px rgba(120,200,255,' + (dark ? 0.35 : 0.55) + '),'
			+ 'inset -3px 0 14px -8px rgba(255,150,220,' + (dark ? 0.35 : 0.55) + ');}';
						var sheenLive = 'radial-gradient(120% 55% at calc(6% + var(--_ms_sx,0.5) * 30%) calc(var(--_ms_sy,-0.1) * 14% - 10%),'
			+ (dark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.90)')
			+ ',rgba(255,255,255,0) 60%),linear-gradient(135deg,' + rgba(A, 0.10) + ',' + rgba(A2, 0.06) + ' 48%,' + rgba(R, 0.05) + ')';
		css += S + '::before{background-image:' + sheenLive + ',' + dispersion + ';}';
				css += S + '::after{content:"";position:absolute;top:-30%;bottom:-30%;left:-75%;width:60%;z-index:4;pointer-events:none;'
			+ 'background-image:linear-gradient(100deg,rgba(255,255,255,0),' + sweep + ',rgba(255,255,255,0));'
			+ 'transform:translate3d(-30%,0,0);opacity:0;animation:_ms_ios27_sweep 9.5s cubic-bezier(.45,.05,.55,.95) infinite;}';
		css += '@keyframes _ms_ios27_sweep{0%,52%{transform:translate3d(-30%,0,0);opacity:0;}60%{opacity:1;}100%{transform:translate3d(340%,0,0);opacity:0;}}';

				css += S + '>div:first-child{background-color:' + rgba(A, dark ? 0.80 : 0.88) + ' !important;'
			+ 'background-image:linear-gradient(135deg,' + rgba(A, dark ? 0.92 : 0.96) + ',' + rgba(A2, dark ? 0.86 : 0.92) + ' 55%,' + rgba(R, dark ? 0.72 : 0.82) + ') !important;'
			+ 'border-bottom:none !important;border-radius:' + rTop + ' !important;'
			+ 'box-shadow:inset 0 1px 0 rgba(255,255,255,0.45),inset 0 -1px 0 rgba(255,255,255,0.10) !important;}';
		css += S + '>div:first-child>div:first-child{font-weight:650 !important;letter-spacing:.2px !important;text-shadow:0 1px 2px rgba(0,0,0,.18) !important;}';
		css += S + '>div:first-child button{border-radius:50% !important;border:none !important;background-color:rgba(255,255,255,0.20) !important;'
			+ 'background-image:linear-gradient(180deg,rgba(255,255,255,0.38),rgba(255,255,255,0.06)) !important;color:#fff !important;'
			+ 'box-shadow:inset 0 1px 0 rgba(255,255,255,0.55),0 2px 8px rgba(0,0,0,.16) !important;'
			+ 'transition:transform .3s ' + spring + ',background-color .25s ease !important;}';
		css += S + '>div:first-child button:active{transform:scale(.88) !important;}';

				css += S + ' #_ms_tabs{background-color:transparent !important;background-image:none !important;'
			+ 'border-bottom:1px solid ' + layerRim + ' !important;gap:6px !important;padding:10px 12px !important;}';
		css += S + ' ._ms_tab{border-radius:999px !important;background-color:' + layerBg + ' !important;background-image:none !important;'
			+ 'color:' + c.sub + ' !important;box-shadow:inset 0 1px 0 ' + hiSoft + ' !important;'
			+ 'transition:transform .3s ' + spring + ',border-radius .34s ' + spring + ',background-color .28s ease,color .28s ease,box-shadow .28s ease !important;}';
		css += S + ' ._ms_tab[data-active="1"]{background-image:linear-gradient(135deg,' + rgba(A, 1) + ',' + rgba(A2, 1) + ') !important;'
			+ 'color:#fff !important;box-shadow:0 6px 20px ' + rgba(A, 0.34) + ',inset 0 1px 0 rgba(255,255,255,0.45) !important;}';
		css += S + ' ._ms_tab:active{transform:scale(.93) !important;border-radius:16px !important;}';

				css += S + ' #_ms_search,' + S + ' #_ms_filter,' + S + ' #_ms_progress{background-color:transparent !important;background-image:none !important;'
			+ 'border-bottom:1px solid ' + layerRim + ' !important;}';
		css += S + ' #_ms_search input{border-radius:999px !important;background-color:' + fieldBg + ' !important;border:1px solid ' + fieldRim + ' !important;'
			+ 'color:' + c.txt + ' !important;padding:9px 16px !important;box-shadow:inset 0 1px 0 ' + hiSoft + ' !important;'
			+ 'transition:box-shadow .3s ease,border-color .3s ease,border-radius .34s ' + spring + ',background-color .3s ease !important;}';
		css += S + ' #_ms_search input:focus{outline:none !important;border-color:' + rgba(A, 0.7) + ' !important;'
			+ 'box-shadow:0 0 0 4px ' + rgba(A, 0.18) + ',inset 0 1px 0 ' + hiSoft + ' !important;}';
		css += S + ' #_ms_search input::placeholder{color:' + c.sub + ' !important;opacity:.72 !important;}';
		css += S + ' #_ms_progress_bar{border-radius:999px !important;background-image:linear-gradient(90deg,' + rgba(A, 1) + ',' + rgba(A2, 1) + ') !important;'
			+ 'box-shadow:0 0 12px ' + rgba(A, 0.55) + ' !important;}';

				css += S + ' #_ms_box{background-color:transparent !important;background-image:none !important;}';
		css += S + ' #_ms_footer{background-color:transparent !important;background-image:none !important;border-top:1px solid ' + layerRim + ' !important;}';

				css += S + ' ._ms_card{border-radius:' + rCard + ' !important;background-color:' + cardBg + ' !important;'
			+ 'background-image:linear-gradient(180deg,' + (dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.35)') + ',rgba(255,255,255,0) 44%) !important;'
			+ 'box-shadow:inset 0 1px 0 ' + hiSoft + ',' + cardRest + ' !important;'
			+ 'transition:transform .34s ' + spring + ',border-radius .34s ' + spring + ',background-color .3s ease,box-shadow .3s ease !important;}';
		css += S + ' ._ms_card:hover{transform:translateY(-3px) scale(1.012) !important;background-color:' + cardHover + ' !important;'
			+ 'box-shadow:inset 0 1px 0 ' + hiSoft + ',' + cardLift + ' !important;}';
		css += S + ' ._ms_card:active{transform:scale(.955) !important;border-radius:' + (isMob ? '26px' : '28px') + ' !important;}';

				css += S + ' button:not(._ms_tab){border-radius:999px !important;'
			+ 'transition:transform .3s ' + spring + ',border-radius .34s ' + spring + ',background-color .28s ease,color .28s ease,box-shadow .28s ease !important;}';
		css += S + ' button:not(._ms_tab):active{transform:scale(.94) !important;border-radius:14px !important;}';
		css += S + ' #_ms_box input:not([type="checkbox"]):not([type="radio"]),' + S + ' #_ms_box select,' + S + ' #_ms_box textarea{'
			+ 'border-radius:14px !important;background-color:' + (dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.72)') + ' !important;'
			+ 'border:1px solid ' + fieldRim + ' !important;box-shadow:inset 0 1px 0 ' + hiSoft + ' !important;}';

				css += S + ' ::-webkit-scrollbar{width:8px;height:8px;}';
		css += S + ' ::-webkit-scrollbar-track{background:transparent;}';
		css += S + ' ::-webkit-scrollbar-thumb{background-color:' + (dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.16)') + ' !important;'
			+ 'border-radius:999px !important;border:2px solid transparent !important;background-clip:padding-box !important;}';
		css += S + ' ::-webkit-scrollbar-thumb:hover{background-color:' + (dark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.26)') + ' !important;}';

										css += '#_ms_float._ms_btn_ios27{background-color:' + rgba(A, dark ? 0.30 : 0.40) + ' !important;'
			+ 'background-image:radial-gradient(130% 130% at 28% 14%,' + rgba('#ffffff', dark ? 0.46 : 0.78) + ',' + rgba('#ffffff', 0) + ' 56%),'
			+ 'linear-gradient(150deg,' + rgba(A, dark ? 0.36 : 0.44) + ',' + rgba(A2, dark ? 0.28 : 0.36) + ' 62%,' + rgba(R, dark ? 0.20 : 0.26) + ') !important;'
			+ '-webkit-backdrop-filter:blur(30px) saturate(230%) brightness(1.10) !important;backdrop-filter:blur(30px) saturate(230%) brightness(1.10) !important;'
			+ 'border:1px solid ' + rgba('#ffffff', dark ? 0.38 : 0.72) + ' !important;'
			+ 'box-shadow:0 12px 34px ' + rgba(A, dark ? 0.40 : 0.34) + ',0 2px 10px rgba(0,0,0,' + (dark ? 0.34 : 0.18) + '),'
			+ 'inset 0 1px 0 ' + rgba('#ffffff', dark ? 0.55 : 0.85) + ',inset 0 -3px 10px ' + rgba('#000000', dark ? 0.20 : 0.10) + ' !important;'
			+ 'transition:transform .34s ' + spring + ',box-shadow .3s ease,border-radius .34s ' + spring + ' !important;}';
		css += '#_ms_float._ms_btn_ios27:active{transform:scale(.88) !important;}';
				css += '@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){'
			+ '#_ms_float._ms_btn_ios27{background-color:' + rgba(A, dark ? 0.86 : 0.94) + ' !important;}}';

				css += B + ' #_ms_queue_modal,' + B + ' #_ms_vlp_modal{border-radius:26px !important;background-color:' + modalBg + ' !important;'
			+ '-webkit-backdrop-filter:' + modalBlur + ' !important;backdrop-filter:' + modalBlur + ' !important;'
			+ 'box-shadow:0 26px 70px rgba(0,0,0,' + (dark ? 0.60 : 0.24) + '),inset 0 0 0 1px ' + rim + ',inset 0 1px 0 ' + hiTop + ' !important;}';
		css += B + ' #_ms_footer_menu,' + B + ' #_ms_float_ctx_menu,' + B + ' #_ms_sel_pop{border-radius:20px !important;background-color:' + modalBg + ' !important;'
			+ '-webkit-backdrop-filter:blur(28px) saturate(190%) !important;backdrop-filter:blur(28px) saturate(190%) !important;'
			+ 'box-shadow:0 20px 50px rgba(0,0,0,' + (dark ? 0.55 : 0.22) + '),inset 0 0 0 1px ' + rim + ' !important;}';
								css += B + ' ._ms_toast{border-radius:999px !important;-webkit-backdrop-filter:blur(26px) saturate(210%) brightness(1.06) !important;'
			+ 'backdrop-filter:blur(26px) saturate(210%) brightness(1.06) !important;}';
						var barShadow = '0 12px 32px ' + rgba(A, 0.40) + ',inset 0 1px 0 rgba(255,255,255,0.45),inset 0 -2px 8px rgba(0,0,0,0.15)';
		try { document.documentElement.style.setProperty('--_ms_bar_shadow', barShadow); } catch (e0) {}
		css += B + ' #_ms_minimized_bar{border-radius:999px !important;-webkit-backdrop-filter:blur(20px) saturate(190%) !important;'
			+ 'backdrop-filter:blur(20px) saturate(190%) !important;}';
		css += B + ' #_ms_status{border-radius:0 0 18px 18px !important;'
			+ 'box-shadow:0 10px 28px rgba(0,0,0,' + (dark ? 0.45 : 0.20) + '),inset 0 -1px 0 rgba(255,255,255,0.35) !important;}';

				var noBlurPanel = dark ? 'rgba(14,15,26,0.93)' : 'rgba(255,255,255,0.95)';
		var noBlurModal = dark ? 'rgba(21,22,34,0.96)' : 'rgba(255,255,255,0.97)';
		css += '@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){'
			+ S + '{background-color:' + noBlurPanel + ' !important;}'
			+ B + ' #_ms_queue_modal,' + B + ' #_ms_vlp_modal,' + B + ' #_ms_footer_menu,' + B + ' #_ms_float_ctx_menu,' + B + ' #_ms_sel_pop{background-color:' + noBlurModal + ' !important;}}';
		css += 'body._ms_glass_idle ' + S + ' ._ms_gl,' + 'body._ms_glass_idle ' + S + '::after{animation-play-state:paused !important;}';

				css += '@media (prefers-reduced-motion: reduce){' + S + ' *,' + S + ',' + S + '::before,' + S + '::after,'
			+ '#_ms_float._ms_btn_ios27{animation:none !important;transition-duration:.01ms !important;}'
			+ L + ' ._ms_gl{opacity:.45;}}';

		return css;
	};
					UI._parseRgb = function (color) {
		var h = String(color == null ? '' : color).trim();
		var m = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(h);
		if (m) {
			var t = m[1];
			if (t.length === 3) t = t.charAt(0) + t.charAt(0) + t.charAt(1) + t.charAt(1) + t.charAt(2) + t.charAt(2);
			var n = parseInt(t, 16);
			return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
		}
		var m2 = /^rgba?\(([^)]+)\)$/i.exec(h);
		if (m2) {
			var p = m2[1].split(/[,\/]/);
			var r = parseFloat(p[0]), g = parseFloat(p[1]), b = parseFloat(p[2]);
			if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [Math.round(r), Math.round(g), Math.round(b)];
		}
		return null;
	};

		UI._shade = function (color, amt) {
		var p = UI._parseRgb(color);
		if (!p) return color;
		var t = amt >= 0 ? 255 : 0;
		var k = Math.abs(amt);
		return 'rgb(' + Math.round(p[0] + (t - p[0]) * k) + ','
			+ Math.round(p[1] + (t - p[1]) * k) + ','
			+ Math.round(p[2] + (t - p[2]) * k) + ')';
	};

	UI._alpha = function (color, a) {
		var p = UI._parseRgb(color);
		if (!p) return color;
		return 'rgba(' + p[0] + ',' + p[1] + ',' + p[2] + ',' + a + ')';
	};
							UI._buildNeumorphCss = function (dark, isMob) {
		var c = UI.colors();
		var pc = UI._paletteColors() || {};
		var A = pc.primary || MS_CONFIG.COLORS.primary;
		var A2 = pc.primary2 || MS_CONFIG.COLORS.primary2;
		var S = '#_ms_panel._ms_style_neumorph';
		var B = 'body._ms_neumorph';
				var base = dark ? UI._shade(c.bg, -0.20) : c.bg;
		var base2 = dark ? UI._shade(c.bg2, -0.16) : c.bg2;
		var hi = dark ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.96)';
		var hiSoft = dark ? 'rgba(255,255,255,0.028)' : 'rgba(255,255,255,0.78)';
		var lo = dark ? 'rgba(0,0,0,0.62)' : 'rgba(163,177,198,0.62)';
		var loSoft = dark ? 'rgba(0,0,0,0.40)' : 'rgba(163,177,198,0.44)';
		var rOuter = isMob ? '0' : '26px 0 0 26px';
		var rTop = isMob ? '0' : '26px 0 0 0';
		var rCard = isMob ? '16px' : '18px';
		var rField = '12px';
				var raise = '6px 6px 14px ' + lo + ',-6px -6px 14px ' + hi;
		var raiseSm = '4px 4px 9px ' + loSoft + ',-4px -4px 9px ' + hiSoft;
		var press = 'inset 4px 4px 9px ' + lo + ',inset -4px -4px 9px ' + hiSoft;
		var pressSm = 'inset 3px 3px 6px ' + lo + ',inset -3px -3px 6px ' + hiSoft;
		var accentText = dark ? UI._shade(A, 0.35) : UI._shade(A, -0.18);

		var css = '';
				css += S + '{border-radius:' + rOuter + ' !important;background:' + base + ' !important;'
			+ 'color:' + c.txt + ' !important;border:none !important;'
			+ 'box-shadow:' + (isMob ? 'none' : '-10px 0 34px ' + lo + ',-2px 0 8px ' + loSoft) + ' !important;}';
				css += S + ' > div:first-child{background:' + base + ' !important;color:' + c.txt + ' !important;'
			+ 'border-radius:' + rTop + ' !important;border:none !important;'
			+ 'box-shadow:0 1px 0 ' + hiSoft + ',0 6px 12px -8px ' + lo + ' !important;}';
		css += S + ' > div:first-child > div{color:' + c.txt + ' !important;font-weight:700 !important;letter-spacing:.2px !important;}';
				css += S + ' > div:first-child button{background:' + base + ' !important;color:' + c.sub + ' !important;'
			+ 'border:none !important;border-radius:50% !important;box-shadow:' + raiseSm + ' !important;'
			+ 'transition:box-shadow .18s ease,transform .18s ease,color .18s ease !important;}';
		css += S + ' > div:first-child button:hover{color:' + accentText + ' !important;}';
		css += S + ' > div:first-child button:active{box-shadow:' + pressSm + ' !important;transform:scale(.96) !important;}';

				css += S + ' #_ms_tabs{background:' + base2 + ' !important;border:none !important;'
			+ 'border-radius:16px !important;margin:10px 12px 6px !important;padding:5px !important;gap:5px !important;'
			+ 'box-shadow:' + pressSm + ' !important;}';
		css += S + ' ._ms_tab{background:' + base2 + ' !important;color:' + c.sub + ' !important;'
			+ 'border:none !important;border-radius:12px !important;box-shadow:none !important;'
			+ 'transition:box-shadow .18s ease,color .18s ease,transform .18s ease !important;}';
		css += S + ' ._ms_tab[data-active="1"]{background:' + base2 + ' !important;color:' + accentText + ' !important;'
			+ 'font-weight:700 !important;box-shadow:' + pressSm + ' !important;}';
		css += S + ' ._ms_tab:not([data-active="1"]):hover{box-shadow:' + raiseSm + ' !important;color:' + c.txt + ' !important;}';
		css += S + ' ._ms_tab:not([data-active="1"]):active{box-shadow:' + pressSm + ' !important;transform:scale(.97) !important;}';

				css += S + ' #_ms_search,' + S + ' #_ms_filter,' + S + ' #_ms_progress{background:' + base2 + ' !important;'
			+ 'border:none !important;border-radius:' + rField + ' !important;margin:0 12px 8px !important;'
			+ 'box-shadow:' + pressSm + ' !important;color:' + c.txt + ' !important;}';
		css += S + ' input:not([type="checkbox"]):not([type="radio"]),' + S + ' select,' + S + ' textarea{'
			+ 'background:' + base2 + ' !important;color:' + c.txt + ' !important;border:none !important;'
			+ 'border-radius:10px !important;box-shadow:' + pressSm + ' !important;}';
		css += S + ' input:focus,' + S + ' select:focus,' + S + ' textarea:focus{'
			+ 'box-shadow:' + pressSm + ',0 0 0 3px ' + UI._alpha(A, dark ? 0.30 : 0.22) + ' !important;outline:none !important;}';

				css += S + ' #_ms_box{background:' + base2 + ' !important;border:none !important;'
			+ 'border-radius:' + rCard + ' !important;margin:0 12px 10px !important;'
			+ 'box-shadow:' + pressSm + ' !important;}';
		css += S + ' #_ms_footer{background:' + base + ' !important;border:none !important;'
			+ 'border-radius:' + rCard + ' !important;margin:0 12px 10px !important;'
			+ 'box-shadow:' + raiseSm + ' !important;}';
				css += S + ' #_ms_footer button{background:' + base + ' !important;color:' + c.txt + ' !important;'
			+ 'border:none !important;border-radius:11px !important;box-shadow:' + raiseSm + ' !important;'
			+ 'transition:box-shadow .18s ease,transform .18s ease,color .18s ease !important;}';
		css += S + ' #_ms_footer button:hover{color:' + accentText + ' !important;}';
		css += S + ' #_ms_footer button:active{box-shadow:' + pressSm + ' !important;transform:scale(.97) !important;}';

				css += S + ' [data-url]{background:' + base + ' !important;border:none !important;'
			+ 'border-radius:' + rCard + ' !important;box-shadow:' + raiseSm + ' !important;'
			+ 'transition:box-shadow .2s ease,transform .2s ease !important;}';
		css += S + ' [data-url]:hover{box-shadow:6px 6px 14px ' + lo + ',-5px -5px 12px ' + hi + ' !important;'
			+ 'transform:translateY(-1px) !important;}';
		css += S + ' [data-url]:active{box-shadow:' + pressSm + ' !important;transform:translateY(0) scale(.985) !important;}';
						css += S + ' [data-url] > div:nth-child(2){background:' + base + ' !important;'
			+ 'color:' + c.txt + ' !important;border-radius:0 0 ' + rCard + ' ' + rCard + ' !important;}';

				css += S + ' #_ms_progress_bar{background:linear-gradient(135deg,' + A + ',' + A2 + ') !important;border-radius:999px !important;}';

				css += B + ' #_ms_queue_modal,' + B + ' #_ms_vlp_modal,' + B + ' #_ms_footer_menu,'
			+ B + ' #_ms_float_ctx_menu,' + B + ' #_ms_sel_pop{background:' + base + ' !important;'
			+ 'color:' + c.txt + ' !important;border:none !important;border-radius:18px !important;'
			+ 'box-shadow:10px 10px 26px ' + lo + ',-8px -8px 20px ' + hi + ' !important;}';
						css += B + ' ._ms_toast{border:none !important;border-radius:14px !important;'
			+ 'box-shadow:0 10px 24px ' + lo + ',inset 0 1px 0 ' + hi + ' !important;'
			+ 'text-shadow:0 1px 2px rgba(0,0,0,.22) !important;}';
		css += B + ' #_ms_minimized_bar{background:' + base + ' !important;color:' + c.txt + ' !important;'
			+ 'border:none !important;box-shadow:' + raise + ' !important;}';
		css += B + ' #_ms_status{background:' + base + ' !important;color:' + c.txt + ' !important;'
			+ 'border:none !important;box-shadow:0 6px 16px ' + lo + ' !important;}';

				css += '#_ms_float._ms_btn_neumorph{background:' + base + ' !important;background-image:none !important;'
			+ 'color:' + accentText + ' !important;border:none !important;'
			+ 'box-shadow:7px 7px 16px ' + lo + ',-6px -6px 14px ' + hi + ' !important;'
			+ 'transition:box-shadow .2s ease,transform .2s ease !important;}';
		css += '#_ms_float._ms_btn_neumorph:active{box-shadow:' + press + ' !important;transform:scale(.94) !important;}';
		css += '#_ms_float._ms_btn_neumorph svg{color:' + accentText + ' !important;filter:none !important;}';

				css += '@media (prefers-reduced-motion: reduce){' + S + ' *,' + S + ',' + S + '::before,' + S + '::after,'
			+ '#_ms_float._ms_btn_neumorph{transition-duration:.01ms !important;animation:none !important;}}';
		return css;
	};
							UI._buildBrutalCss = function (dark, isMob) {
		var c = UI.colors();
		var pc = UI._paletteColors() || {};
		var A = pc.primary || MS_CONFIG.COLORS.primary;
		var A2 = pc.primary2 || MS_CONFIG.COLORS.primary2;
		var S = '#_ms_panel._ms_style_brutal';
		var B = 'body._ms_brutal';
		var ink = dark ? '#ffffff' : '#000000';
		var paper = dark ? '#151515' : '#ffffff';
		var paper2 = dark ? '#1f1f1f' : '#f4f4f0';
		var txt = dark ? '#ffffff' : '#000000';
		var sub = dark ? '#c9c9c9' : '#3d3d3d';
				var pop = dark ? UI._shade(A, 0.24) : A;
		var pop2 = dark ? UI._shade(A2, 0.20) : A2;
								var popInk = '#000000';
		var edge = '3px solid ' + ink;
		var hard = '6px 6px 0 ' + ink;
		var hardSm = '4px 4px 0 ' + ink;
		var rOuter = isMob ? '0' : '0';
				var pressTf = 'translate(3px,3px)';
		var pressShadow = '3px 3px 0 ' + ink;

		var css = '';
				css += S + '{border-radius:' + rOuter + ' !important;background:' + paper + ' !important;'
			+ 'color:' + txt + ' !important;border-left:' + edge + ' !important;'
			+ 'box-shadow:' + (isMob ? 'none' : hard + ',12px 12px 0 ' + UI._alpha(ink, dark ? 0.28 : 0.14)) + ' !important;}';
				css += S + ' > div:first-child{background:' + pop + ' !important;color:' + popInk + ' !important;'
			+ 'border-bottom:' + edge + ' !important;border-radius:0 !important;}';
		css += S + ' > div:first-child > div{color:' + popInk + ' !important;font-weight:900 !important;'
			+ 'letter-spacing:.6px !important;text-transform:uppercase !important;}';
		css += S + ' > div:first-child button{background:' + paper + ' !important;color:' + ink + ' !important;'
			+ 'border:2px solid ' + ink + ' !important;border-radius:0 !important;'
			+ 'box-shadow:2px 2px 0 ' + ink + ' !important;font-weight:900 !important;'
			+ 'transition:transform .08s linear,box-shadow .08s linear,background-color .12s linear !important;}';
		css += S + ' > div:first-child button:hover{background:' + pop2 + ' !important;}';
		css += S + ' > div:first-child button:active{transform:' + pressTf + ' !important;box-shadow:0 0 0 ' + ink + ' !important;}';

				css += S + ' #_ms_tabs{background:' + paper2 + ' !important;border-bottom:' + edge + ' !important;'
			+ 'border-radius:0 !important;gap:0 !important;padding:0 !important;}';
		css += S + ' ._ms_tab{background:' + paper + ' !important;color:' + txt + ' !important;'
			+ 'border:none !important;border-right:2px solid ' + ink + ' !important;border-radius:0 !important;'
			+ 'box-shadow:none !important;font-weight:800 !important;letter-spacing:.3px !important;'
			+ 'transition:background-color .12s linear,color .12s linear !important;}';
		css += S + ' ._ms_tab[data-active="1"]{background:' + pop + ' !important;color:' + popInk + ' !important;'
			+ 'box-shadow:inset 0 -4px 0 ' + ink + ' !important;}';
		css += S + ' ._ms_tab:not([data-active="1"]):hover{background:' + pop2 + ' !important;}';

				css += S + ' #_ms_search,' + S + ' #_ms_filter,' + S + ' #_ms_progress{'
			+ 'background:' + paper + ' !important;color:' + txt + ' !important;'
			+ 'border:' + edge + ' !important;border-radius:0 !important;margin:10px 12px !important;'
			+ 'box-shadow:' + hardSm + ' !important;}';
		css += S + ' #_ms_progress{margin-bottom:10px !important;}';
		css += S + ' input:not([type="checkbox"]):not([type="radio"]),' + S + ' select,' + S + ' textarea{'
			+ 'background:' + paper + ' !important;color:' + txt + ' !important;'
			+ 'border:2px solid ' + ink + ' !important;border-radius:0 !important;font-weight:700 !important;}';
		css += S + ' input:focus,' + S + ' select:focus,' + S + ' textarea:focus{'
			+ 'border-color:' + pop + ' !important;box-shadow:3px 3px 0 ' + pop + ' !important;outline:none !important;}';

				css += S + ' #_ms_box{background:' + paper2 + ' !important;border:' + edge + ' !important;'
			+ 'border-radius:0 !important;margin:0 12px 10px !important;box-shadow:none !important;}';
		css += S + ' #_ms_footer{background:' + paper + ' !important;border-top:' + edge + ' !important;'
			+ 'border-radius:0 !important;margin:0 !important;box-shadow:none !important;}';
		css += S + ' #_ms_footer button{background:' + paper + ' !important;color:' + txt + ' !important;'
			+ 'border:2px solid ' + ink + ' !important;border-radius:0 !important;'
			+ 'box-shadow:3px 3px 0 ' + ink + ' !important;font-weight:800 !important;'
			+ 'transition:transform .08s linear,box-shadow .08s linear,background-color .12s linear !important;}';
		css += S + ' #_ms_footer button:hover{background:' + pop + ' !important;color:' + popInk + ' !important;}';
		css += S + ' #_ms_footer button:active{transform:' + pressTf + ' !important;box-shadow:0 0 0 ' + ink + ' !important;}';

				css += S + ' [data-url]{background:' + paper + ' !important;border:2px solid ' + ink + ' !important;'
			+ 'border-radius:0 !important;box-shadow:' + hardSm + ' !important;'
			+ 'transition:transform .09s linear,box-shadow .09s linear !important;}';
		css += S + ' [data-url]:hover{transform:translate(-2px,-2px) !important;'
			+ 'box-shadow:6px 6px 0 ' + ink + ' !important;}';
		css += S + ' [data-url]:active{transform:' + pressTf + ' !important;box-shadow:1px 1px 0 ' + ink + ' !important;}';
				css += S + ' [data-url] > div:nth-child(2){background:' + paper + ' !important;'
			+ 'color:' + txt + ' !important;border-top:2px solid ' + ink + ' !important;'
			+ 'font-weight:700 !important;}';

				css += S + ' #_ms_progress{background:' + paper + ' !important;}';
		css += S + ' #_ms_progress_bar{background:' + pop + ' !important;border-radius:0 !important;'
			+ 'box-shadow:none !important;}';

				css += B + ' #_ms_queue_modal,' + B + ' #_ms_vlp_modal,' + B + ' #_ms_footer_menu,'
			+ B + ' #_ms_float_ctx_menu,' + B + ' #_ms_sel_pop{background:' + paper + ' !important;'
			+ 'color:' + txt + ' !important;border:' + edge + ' !important;border-radius:0 !important;'
			+ 'box-shadow:8px 8px 0 ' + ink + ' !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;}';
						css += B + ' ._ms_toast{border:2px solid ' + ink + ' !important;border-radius:0 !important;'
			+ 'box-shadow:5px 5px 0 ' + ink + ' !important;font-weight:900 !important;'
			+ 'letter-spacing:.3px !important;text-shadow:0 1px 2px rgba(0,0,0,.35) !important;'
			+ '-webkit-backdrop-filter:none !important;backdrop-filter:none !important;}';
		css += B + ' #_ms_minimized_bar{background:' + pop + ' !important;color:' + popInk + ' !important;'
			+ 'border:2px solid ' + ink + ' !important;border-radius:0 !important;'
			+ 'box-shadow:4px 4px 0 ' + ink + ' !important;}';
		css += B + ' #_ms_status{background:' + paper + ' !important;color:' + txt + ' !important;'
			+ 'border-bottom:2px solid ' + ink + ' !important;border-radius:0 !important;'
			+ 'box-shadow:none !important;}';

				css += '#_ms_float._ms_btn_brutal{background:' + pop + ' !important;background-image:none !important;'
			+ 'color:' + popInk + ' !important;border:3px solid ' + ink + ' !important;border-radius:0 !important;'
			+ 'box-shadow:5px 5px 0 ' + ink + ' !important;'
			+ 'transition:transform .08s linear,box-shadow .08s linear !important;}';
		css += '#_ms_float._ms_btn_brutal:active{transform:' + pressTf + ' !important;box-shadow:0 0 0 ' + ink + ' !important;}';
		css += '#_ms_float._ms_btn_brutal svg{color:' + popInk + ' !important;filter:none !important;}';

		css += '@media (prefers-reduced-motion: reduce){' + S + ' *,' + S + ',' + S + '::before,' + S + '::after,'
			+ '#_ms_float._ms_btn_brutal{transition-duration:.01ms !important;animation:none !important;}}';
		return css;
	};
										UI._buildTerminalCss = function (dark, isMob) {
		var S = '#_ms_panel._ms_style_terminal';
		var B = 'body._ms_terminal';
		var mono = 'ui-monospace,SFMono-Regular,Menlo,Consolas,"DejaVu Sans Mono","Courier New",monospace';
		var bg = '#070b07'; 
		var bg2 = '#0b120b'; 
		var fg = '#5cff8f'; 
		var fgDim = '#2f9e57'; 
		var fgBright = '#c8ffd8'; 
		var line = 'rgba(92,255,143,0.28)';
		var lineSoft = 'rgba(92,255,143,0.13)';
		var glow = '0 0 6px rgba(92,255,143,0.55)';
		var rOuter = isMob ? '0' : '0';
		var scan = 'repeating-linear-gradient(180deg,rgba(0,0,0,0.34) 0px,rgba(0,0,0,0.34) 1px,'
			+ 'rgba(0,0,0,0) 1px,rgba(0,0,0,0) 3px)';

		var css = '';
				css += S + '{border-radius:' + rOuter + ' !important;background:' + bg + ' !important;'
			+ 'color:' + fg + ' !important;border:none !important;'
			+ 'font-family:' + mono + ' !important;font-size:13px !important;letter-spacing:.2px !important;'
			+ 'box-shadow:' + (isMob ? 'none' : '-1px 0 0 ' + line + ',-14px 0 40px rgba(0,0,0,0.7)') + ' !important;}';
				css += S + '::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:4;'
			+ 'background:' + scan + ',radial-gradient(120% 80% at 50% 0%,rgba(92,255,143,0.07),rgba(0,0,0,0) 62%);'
			+ 'background-blend-mode:normal;opacity:.85;}';
		css += S + ' *{font-family:' + mono + ' !important;}';
				css += S + ',' + S + ' #_ms_box,' + S + ' #_ms_footer{color:' + fg + ' !important;}';

				css += S + ' > div:first-child{background:' + bg2 + ' !important;color:' + fg + ' !important;'
			+ 'border-bottom:1px solid ' + line + ' !important;border-radius:0 !important;}';
		css += S + ' > div:first-child > div{color:' + fgBright + ' !important;font-weight:700 !important;'
			+ 'text-shadow:' + glow + ' !important;}';
		css += S + ' > div:first-child > div::after{content:"";display:inline-block;width:8px;height:14px;'
			+ 'margin-left:6px;vertical-align:-2px;background:' + fg + ';'
			+ 'animation:_ms_t_cursor 1.06s steps(1) infinite;}';
		css += '@keyframes _ms_t_cursor{0%,49%{opacity:1}50%,100%{opacity:0}}';
		css += S + ' > div:first-child button{background:transparent !important;color:' + fg + ' !important;'
			+ 'border:1px solid ' + line + ' !important;border-radius:0 !important;'
			+ 'box-shadow:none !important;font-weight:700 !important;text-shadow:none !important;'
			+ 'transition:background-color .12s linear,color .12s linear !important;}';
		css += S + ' > div:first-child button:hover{background:' + UI._alpha(fg, 0.16) + ' !important;'
			+ 'color:' + fgBright + ' !important;}';

				css += S + ' #_ms_tabs{background:' + bg2 + ' !important;border-bottom:1px solid ' + line + ' !important;'
			+ 'border-radius:0 !important;gap:0 !important;padding:0 !important;}';
		css += S + ' ._ms_tab{background:transparent !important;color:' + fgDim + ' !important;'
			+ 'border:none !important;border-right:1px solid ' + lineSoft + ' !important;border-radius:0 !important;'
			+ 'box-shadow:none !important;text-shadow:none !important;font-weight:700 !important;'
			+ 'transition:background-color .12s linear,color .12s linear !important;}';
		css += S + ' ._ms_tab[data-active="1"]{background:' + UI._alpha(fg, 0.16) + ' !important;'
			+ 'color:' + fgBright + ' !important;box-shadow:inset 0 -2px 0 ' + fg + ' !important;'
			+ 'text-shadow:' + glow + ' !important;}';
		css += S + ' ._ms_tab:not([data-active="1"]):hover{color:' + fg + ' !important;'
			+ 'background:' + UI._alpha(fg, 0.07) + ' !important;}';

				css += S + ' #_ms_search,' + S + ' #_ms_filter,' + S + ' #_ms_progress{'
			+ 'background:' + bg2 + ' !important;color:' + fg + ' !important;'
			+ 'border:none !important;border-bottom:1px solid ' + line + ' !important;border-radius:0 !important;'
			+ 'box-shadow:none !important;margin:0 12px 8px !important;}';
		css += S + ' input:not([type="checkbox"]):not([type="radio"]),' + S + ' select,' + S + ' textarea{'
			+ 'background:' + bg2 + ' !important;color:' + fg + ' !important;'
			+ 'border:1px solid ' + lineSoft + ' !important;border-radius:0 !important;text-shadow:none !important;}';
		css += S + ' input:focus,' + S + ' select:focus,' + S + ' textarea:focus{'
			+ 'border-color:' + fg + ' !important;box-shadow:0 0 0 1px ' + UI._alpha(fg, 0.5) + ' !important;'
			+ 'outline:none !important;}';
		css += S + ' input::placeholder,' + S + ' textarea::placeholder{color:' + fgDim + ' !important;}';

				css += S + ' #_ms_box{background:' + bg + ' !important;border:none !important;border-radius:0 !important;'
			+ 'box-shadow:inset 0 1px 0 ' + lineSoft + ' !important;margin:0 0 0 0 !important;}';
		css += S + ' #_ms_footer{background:' + bg2 + ' !important;'
			+ 'border-top:1px solid ' + line + ' !important;border-radius:0 !important;margin:0 !important;}';
		css += S + ' #_ms_footer button{background:transparent !important;color:' + fg + ' !important;'
			+ 'border:1px solid ' + line + ' !important;border-radius:0 !important;box-shadow:none !important;'
			+ 'text-shadow:none !important;transition:background-color .12s linear,color .12s linear !important;}';
		css += S + ' #_ms_footer button:hover{background:' + UI._alpha(fg, 0.16) + ' !important;'
			+ 'color:' + fgBright + ' !important;}';

				css += S + ' [data-url]{background:' + bg2 + ' !important;border:1px solid ' + lineSoft + ' !important;'
			+ 'border-radius:0 !important;box-shadow:none !important;'
			+ 'transition:border-color .12s linear,background-color .12s linear !important;}';
		css += S + ' [data-url]:hover{border-color:' + fg + ' !important;'
			+ 'background:' + UI._alpha(fg, 0.09) + ' !important;box-shadow:0 0 0 1px ' + UI._alpha(fg, 0.35) + ' !important;}';
				css += S + ' [data-url] > div:nth-child(2){background:' + bg2 + ' !important;'
			+ 'color:' + fg + ' !important;border-top:1px solid ' + lineSoft + ' !important;}';

				css += S + ' #_ms_progress_bar{background:' + fg + ' !important;border-radius:0 !important;'
			+ 'box-shadow:0 0 8px ' + UI._alpha(fg, 0.65) + ' !important;}';

				css += B + ' #_ms_queue_modal,' + B + ' #_ms_vlp_modal,' + B + ' #_ms_footer_menu,'
			+ B + ' #_ms_float_ctx_menu,' + B + ' #_ms_sel_pop{background:' + bg2 + ' !important;'
			+ 'color:' + fg + ' !important;border:1px solid ' + line + ' !important;border-radius:0 !important;'
			+ 'box-shadow:0 0 0 1px ' + lineSoft + ',0 18px 60px rgba(0,0,0,0.8) !important;'
			+ '-webkit-backdrop-filter:none !important;backdrop-filter:none !important;'
			+ 'font-family:' + mono + ' !important;}';
		css += B + ' #_ms_queue_modal *,' + B + ' #_ms_vlp_modal *,' + B + ' #_ms_footer_menu *,'
			+ B + ' #_ms_float_ctx_menu *,' + B + ' #_ms_sel_pop *{font-family:' + mono + ' !important;}';
								css += B + ' ._ms_toast{border-radius:0 !important;'
			+ 'outline:1px solid rgba(0,0,0,0.55) !important;'
			+ 'font-family:' + mono + ' !important;font-weight:700 !important;letter-spacing:.3px !important;'
			+ '-webkit-backdrop-filter:none !important;backdrop-filter:none !important;}';
		css += B + ' #_ms_minimized_bar{background:' + bg2 + ' !important;color:' + fg + ' !important;'
			+ 'border:1px solid ' + line + ' !important;border-radius:0 !important;box-shadow:none !important;}';
		css += B + ' #_ms_status{background:' + bg + ' !important;color:' + fg + ' !important;'
			+ 'border-bottom:1px solid ' + line + ' !important;border-radius:0 !important;box-shadow:none !important;}';

				css += '#_ms_float._ms_btn_terminal{background:' + bg2 + ' !important;background-image:none !important;'
			+ 'color:' + fg + ' !important;border:1px solid ' + fg + ' !important;border-radius:0 !important;'
			+ 'box-shadow:0 0 0 1px ' + lineSoft + ',0 0 16px ' + UI._alpha(fg, 0.45) + ' !important;'
			+ 'transition:background-color .12s linear,box-shadow .12s linear !important;}';
		css += '#_ms_float._ms_btn_terminal:hover{background:' + UI._alpha(fg, 0.15) + ' !important;}';
		css += '#_ms_float._ms_btn_terminal:active{background:' + UI._alpha(fg, 0.3) + ' !important;'
			+ 'box-shadow:0 0 0 1px ' + lineSoft + ',0 0 26px ' + UI._alpha(fg, 0.7) + ' !important;}';
		css += '#_ms_float._ms_btn_terminal svg{color:' + fg + ' !important;filter:none !important;}';

				css += '@media (prefers-reduced-motion: reduce){' + S + ' *,' + S + ',' + S + '::before,' + S + '::after,'
			+ '#_ms_float._ms_btn_terminal{transition-duration:.01ms !important;animation:none !important;}'
			+ S + ' > div:first-child > div::after{animation:none !important;opacity:1;}}';
		return css;
	};

	UI.applyUiStyle = function () {
		var style = State.config && State.config.uiStyle ? State.config.uiStyle : 'normal';
		if (MS_CONFIG.UI_STYLE_IDS.indexOf(style) < 0) style = 'normal';
						var dark = UI.isEffectivelyDark();
		var c = UI.colors(); 
								var panel = State.panel;
		if (panel) {
			for (var pi = 0; pi < MS_CONFIG.UI_STYLE_IDS.length; pi++) panel.classList.remove('_ms_style_' + MS_CONFIG.UI_STYLE_IDS[pi]);
			panel.classList.remove('_ms_dark');
			panel.classList.add('_ms_style_' + style);
			if (dark) panel.classList.add('_ms_dark');
		}
				var floatBtn = UI._floatBtn || document.getElementById('_ms_float');
		if (floatBtn) {
			for (var fi = 0; fi < MS_CONFIG.UI_STYLE_IDS.length; fi++) floatBtn.classList.remove('_ms_btn_' + MS_CONFIG.UI_STYLE_IDS[fi]);
			floatBtn.classList.add('_ms_btn_' + style);
		}
						try {
			var bodyEl = document.body || document.documentElement;
			if (bodyEl && bodyEl.classList) {
				for (var bi = 0; bi < MS_CONFIG.UI_STYLE_IDS.length; bi++) bodyEl.classList.remove('_ms_' + MS_CONFIG.UI_STYLE_IDS[bi]);
				if (style !== 'normal') bodyEl.classList.add('_ms_' + style);
			}
		} catch (e) {}
		var styleId = '_ms_ui_style_css';
		var el = document.getElementById(styleId);
		if (!el) {
			el = document.createElement('style');
			el.id = styleId;
			(document.head || document.documentElement).appendChild(el);
		}
		var isMob = U.isMobile();
										var styleKey = style + '|' + (style === 'terminal' ? 'd' : (dark ? 'd' : 'l'))
			+ '|' + (isMob ? 'm' : 'p') + '|' + UI.getPalette();
		if (UI._uiStyleKey === styleKey && el.textContent) {
			UI._syncIos27Layers(panel, style);
			return;
		}
		UI._uiStyleKey = styleKey;
								var needBuilder = { neumorph: '_buildNeumorphCss', brutal: '_buildBrutalCss', terminal: '_buildTerminalCss' }[style];
		if (needBuilder && typeof UI[needBuilder] !== 'function') {
			LOG.error('界面风格构建函数缺失: UI.' + needBuilder + '（风格 ' + style + ' 退回普通）');
			style = 'normal';
			panel && panel.classList && panel.classList.add('_ms_style_normal');
		}
		var css = '';
						css += '#_ms_panel, #_ms_panel #_ms_tabs, #_ms_panel #_ms_box, #_ms_panel #_ms_footer, #_ms_panel #_ms_search { transition: background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease; }';
		css += '#_ms_panel._ms_theming, #_ms_panel._ms_theming * { transition: background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease !important; }';
		css += 'body._ms_glass_idle #_ms_panel._ms_style_ios27 *, body._ms_glass_idle #_ms_float._ms_btn_ios27 { animation-play-state: paused !important; }'
						+ 'body._ms_glass_idle #_ms_panel._ms_style_terminal > div:first-child > div::after { animation-play-state: paused !important; opacity: 0 !important; }';
								css += '._ms_vlink_paused, ._ms_vlink_paused * { animation-play-state: paused !important; transition: none !important; }';
		if (style === 'material') {
			var r = isMob ? '0' : '28px 0 0 28px';
			var headerR = isMob ? '0' : '28px 0 0 0';
			var tabR = isMob ? '16px 16px 0 0' : '20px 0 0 0';
			css += '#_ms_panel._ms_style_material { border-radius:' + r + ' !important; box-shadow:-24px 0 70px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,0,0,0.06) !important; overflow:hidden !important; }';
			css += '#_ms_panel._ms_style_material > div:first-child { border-radius:' + headerR + ' !important; }';
			css += '#_ms_panel._ms_style_material #_ms_tabs { border-radius:' + tabR + ' !important; margin:0 10px !important; border:1px solid ' + (dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)') + ' !important; border-bottom:none !important; }';
			css += '#_ms_panel._ms_style_material #_ms_search, #_ms_panel._ms_style_material #_ms_filter, #_ms_panel._ms_style_material #_ms_progress { margin:0 10px !important; border-radius:0 0 12px 12px !important; border:1px solid ' + (dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)') + ' !important; border-top:none !important; }';
			css += '#_ms_panel._ms_style_material #_ms_box { margin:0 10px 10px 10px !important; border-radius:16px !important; border:1px solid ' + (dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)') + ' !important; }';
			css += '#_ms_panel._ms_style_material #_ms_footer { margin:0 10px 10px 10px !important; border-radius:16px !important; border:1px solid ' + (dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)') + ' !important; }';
			css += '#_ms_panel._ms_style_material ._ms_tab { border-radius:20px !important; }';
			css += '#_ms_panel._ms_style_material [data-url] { border-radius:16px !important; }';
		} else if (style === 'ios27') {
						css += UI._buildIos27Css(dark, isMob);
		} else if (style === 'neumorph') {
						css += UI._buildNeumorphCss(dark, isMob);
		} else if (style === 'brutal') {
						css += UI._buildBrutalCss(dark, isMob);
		} else if (style === 'terminal') {
						css += UI._buildTerminalCss(dark, isMob);
		} else {
					}
						if (style === 'ios27') {
			try {
				var slideBg = UI._ios27Rgba(c.bg, dark ? 0.90 : 0.94);
				if (/^rgba\(/.test(slideBg)) {
					css += '#_ms_panel._ms_sliding{-webkit-backdrop-filter:none !important;backdrop-filter:none !important;'
						+ 'background-color:' + slideBg + ' !important;}';
				}
			} catch (e) {}
						css += '#_ms_panel._ms_sliding ._ms_glass_layers *{animation-play-state:paused !important;}';
		}
		el.textContent = css;
		UI._syncIos27Layers(panel, style);
	};

			UI._syncIos27Layers = function (panel, style) {
		if (!panel || !panel.insertBefore) return;
		var layers = panel.querySelector ? panel.querySelector('._ms_glass_layers') : null;
		if (style === 'ios27') {
			if (!layers) {
				layers = document.createElement('div');
				layers.className = '_ms_glass_layers';
				layers.setAttribute('aria-hidden', 'true');
				layers.innerHTML = '<i class="_ms_gl_wrap"><i class="_ms_gl _ms_gl_1"></i><i class="_ms_gl _ms_gl_2"></i>'
					+ '<i class="_ms_gl _ms_gl_3"></i></i><i class="_ms_gl_wet"></i>'
					+ '<i class="_ms_gl_spec"></i><i class="_ms_gl_ripple"></i>';
				if (panel.firstChild) panel.insertBefore(layers, panel.firstChild);
				else panel.appendChild(layers);
			}
			UI._bindGlassMotion(panel);
		} else if (layers && layers.parentNode) {
			layers.parentNode.removeChild(layers);
		}
	};

					UI._hasPointerEvents = (function () {
		try { return typeof window !== 'undefined' && 'onpointerdown' in window && !!(window.PointerEvent); } catch (e) { return false; }
	})();

	var glassResizeHandler = null; 

	UI._bindGlassMotion = function (panel) {
		if (!panel || panel._msGlassBound) return;
		panel._msGlassBound = true;

						UI._unbindGlassMotion();

		var reduce = false;
		try { reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) {}

		var raf = 0, rect = null;
		var tx = 50, ty = -10, cx = 50, cy = -10; 
		var tpx = 0, tpy = 0, cpx = 0, cpy = 0; 
		var st = panel.style;

		function refreshRect() { try { rect = panel.getBoundingClientRect(); } catch (e) { rect = null; } }
										function write() {
			var rw = (rect && rect.width) || 0;
			var rh = (rect && rect.height) || 0;
			st.setProperty('--_ms_sx', (rw ? (cx / rw) : 0.5).toFixed(4));
			st.setProperty('--_ms_sy', (rh ? (cy / rh) : -0.1).toFixed(4));
			st.setProperty('--_ms_px', cpx.toFixed(3));
			st.setProperty('--_ms_py', cpy.toFixed(3));
		}
						var layersEl = null;
		function setMoving(on) {
			try {
				if (!layersEl) layersEl = panel.querySelector('._ms_glass_layers') || panel;
				if (layersEl && layersEl.classList) layersEl.classList[on ? 'add' : 'remove']('_ms_gl_moving');
			} catch (e) {}
		}
		function step() {
			var dx = tx - cx, dy = ty - cy;
			if (dx * dx + dy * dy < 0.25 && Math.abs(tpx - cpx) + Math.abs(tpy - cpy) < 0.004) {
				cx = tx; cy = ty; cpx = tpx; cpy = tpy;
				write();
				raf = 0; 
				setMoving(false); 
				return;
			}
			cx += dx * 0.18; cy += dy * 0.18;
			cpx += (tpx - cpx) * 0.12; cpy += (tpy - cpy) * 0.12;
			write();
			raf = requestAnimationFrame(step);
		}
		function kick() { if (!raf) { setMoving(true); raf = requestAnimationFrame(step); } }
		function update(x, y) {
			if (!rect || !rect.width || !rect.height) refreshRect();
			if (!rect || !rect.width || !rect.height) return;
			tx = x - rect.left; ty = y - rect.top;
			tpx = Math.max(-1, Math.min(1, (tx / rect.width - 0.5) * 2));
			tpy = Math.max(-1, Math.min(1, (ty / rect.height - 0.5) * 2));
			if (reduce) { cx = tx; cy = ty; cpx = tpx; cpy = tpy; write(); return; }
			kick();
		}
		function onMove(e) {
			var p = e.touches ? e.touches[0] : e;
			if (p) update(p.clientX, p.clientY);
		}
		function onLeave() {
			refreshRect();
			if (!rect || !rect.width) return;
						tx = rect.width * 0.5; ty = -rect.height * 0.1;
			tpx = 0; tpy = 0;
			if (reduce) { cx = tx; cy = ty; cpx = tpx; cpy = tpy; write(); return; }
			kick();
		}
		function onDown(e) {
			var p = e.touches ? e.touches[0] : e;
			if (!p) return;
			update(p.clientX, p.clientY);
			panel.classList.add('_ms_pressing');
			clearTimeout(panel._msPressTimer);
			panel._msPressTimer = setTimeout(function () { panel.classList.remove('_ms_pressing'); }, 620);
		}

		if (UI._hasPointerEvents) {
			panel.addEventListener('pointermove', onMove, { passive: true });
			panel.addEventListener('pointerdown', onDown, { passive: true });
			panel.addEventListener('pointerleave', onLeave, { passive: true });
		} else {
			panel.addEventListener('touchmove', onMove, { passive: true });
			panel.addEventListener('touchstart', onDown, { passive: true });
			panel.addEventListener('touchend', onLeave, { passive: true });
			panel.addEventListener('touchcancel', onLeave, { passive: true });
		}
						glassResizeHandler = U.throttle(refreshRect, 300);
		window.addEventListener('resize', glassResizeHandler);
	};

		UI._unbindGlassMotion = function () {
		if (glassResizeHandler) {
			try { window.removeEventListener('resize', glassResizeHandler); } catch (e) {}
			glassResizeHandler = null;
		}
	};

		UI._glassIdle = function (on) {
		try {
			var bodyEl = document.body || document.documentElement;
			if (!bodyEl || !bodyEl.classList) return;
			if (on) bodyEl.classList.add('_ms_glass_idle');
			else bodyEl.classList.remove('_ms_glass_idle');
		} catch (e) {}
	};

				UI._moConnect = function () {};
	UI._moDisconnect = function () {};

	UI.setUiStyle = function (style) {
		if (MS_CONFIG.UI_STYLE_IDS.indexOf(style) < 0) style = 'normal';
		State.config.uiStyle = style;
		State.save();
		U.safeRun(function () { UI.applyUiStyle(); }, 'applyUiStyle');
		try { applyPanelThemeNow(); } catch (e) {}
		try { UI.renderSettings(); } catch (e) {}
	};
	UI._bindCardLongPress = function (container) {
		var longPressEl = null;
		var longPressTimer = null;
		var longPressStartX = 0;
		var longPressStartY = 0;
		var longPressUrl = null;
		var longPressIdx = null;

		function onDown(e) {
			var t = e.target.closest && e.target.closest('[data-url]');
			if (!t) return;
			longPressEl = t;
			var pt = e.touches ? e.touches[0] : e;
			longPressStartX = pt.clientX;
			longPressStartY = pt.clientY;
			longPressUrl = t.getAttribute('data-url');
			longPressIdx = parseInt(t.getAttribute('data-idx'), 10);
			longPressTimer = setTimeout(function () {
				longPressTimer = null;
				if (State.selectionMode) {
					longPressEl = null;
					return;
				}
				Selection.enter();
				if (longPressUrl && !State.selected.has(longPressUrl)) {
					State.selected.add(longPressUrl);
					Selection._updateCardMark(longPressUrl);
					Selection._refreshToolbar();
				}
				if (typeof longPressIdx === 'number' && !isNaN(longPressIdx)) {
					State._lastSelIdx = longPressIdx;
					State._lastSelState = true;
				}
				if (longPressEl) {
					var marked = longPressEl;
					marked._msLongPressTriggered = true;
																									clearTimeout(marked._msLpTm);
					marked._msLpTm = setTimeout(function () {
						try { marked._msLongPressTriggered = false; } catch (e) {}
					}, 800);
				}
			}, 400);
		}

		function onMove(e) {
			if (!longPressTimer) return;
			var pt = e.touches ? e.touches[0] : e;
			if (Math.abs(pt.clientX - longPressStartX) > 6 || Math.abs(pt.clientY - longPressStartY) > 6) {
				clearTimeout(longPressTimer);
				longPressTimer = null;
				longPressEl = null;
			}
		}

		function onUp() {
			if (longPressTimer) {
				clearTimeout(longPressTimer);
				longPressTimer = null;
			}
			longPressEl = null;
		}

		if (UI._hasPointerEvents) {
			container.addEventListener('pointerdown', onDown, { passive: true });
			container.addEventListener('pointermove', onMove, { passive: true });
			container.addEventListener('pointerup', onUp, { passive: true });
			container.addEventListener('pointercancel', onUp, { passive: true });
			container.addEventListener('pointerleave', onUp, { passive: true });
		} else {
			container.addEventListener('touchstart', onDown, { passive: true });
			container.addEventListener('touchmove', onMove, { passive: true });
			container.addEventListener('touchend', onUp, { passive: true });
			container.addEventListener('touchcancel', onUp, { passive: true });
			container.addEventListener('mousedown', onDown);
			container.addEventListener('mousemove', onMove);
			container.addEventListener('mouseup', onUp);
			container.addEventListener('mouseleave', onUp);
		}
	};
														UI.VirtualList = function (container, items, renderItem, opts) {
		var o = (typeof opts === 'number') ? { legacyRowHeight: opts } : (opts || {});
		var list = items || [];

				var gap = o.gap != null ? o.gap : 8;
		var pad = o.padding != null ? o.padding : 10;
		var fixedCols = o.columns > 0 ? o.columns : 0; 
		var minCardW = o.minCardWidth || 120;
				var titleBlock = o.titleBlock != null ? o.titleBlock : 62;
		var os = o.overscan != null ? o.overscan : 4;
												var scroller = o.scrollParent || container;

		var nodes = new Map(); 
		var keys = {}; 
		var pool = []; 
		var viewportHeight = 0;
		var cols = fixedCols || 1; 
		var cellW = minCardW;
		var cardH = minCardW + titleBlock;
		var rowH = cardH + gap;
		var laidOutCols = 0; 
		var contentOffset = 0; 
		var rafId = 0;
										var needsMeasure = true;
		var lastScrollTop = 0;

		var zone = document.createElement('div');
		var spacer = document.createElement('div');

		zone.style.cssText = 'position:absolute;top:0;left:0;right:0;';
		container.style.position = 'relative';
		container.style.overflowY = 'auto';
		container.innerHTML = '';
		container.appendChild(spacer);
		container.appendChild(zone);

		function sig(idx) {
			var u = list[idx];
			var sel = (State.selected && State.selected.has) ? (State.selected.has(u) ? 1 : 0) : 0;
			return idx + '|' + sel + '|' + (State.selectionMode ? 1 : 0);
		}

				function measure() {
			var w = container.clientWidth || 0;
			if (!w) w = (o.fallbackWidth || 320); 
			var availW = Math.max(60, w - pad * 2);
			cols = fixedCols || Math.max(1, Math.floor((availW + gap) / (minCardW + gap)));
			cellW = (availW - gap * (cols - 1)) / cols;
			cardH = cellW + titleBlock;
			rowH = cardH + gap;
			if (scroller === container) {
				contentOffset = 0;
				viewportHeight = container.clientHeight || 400;
			} else {
												var off = container.offsetTop - scroller.offsetTop - (scroller.clientTop || 0);
				contentOffset = (isFinite(off) && off > 0) ? off : 0;
				viewportHeight = scroller.clientHeight || 400;
			}
			var rows = Math.ceil(list.length / cols) || 1;
			spacer.style.height = Math.max(1, rows * rowH - gap + pad * 2) + 'px';
									lastScrollTop = scroller.scrollTop || 0;
			needsMeasure = false;
		}

		function place(el, idx) {
			var r = Math.floor(idx / cols), c = idx % cols;
			el.style.width = cellW + 'px';
			el.style.height = cardH + 'px';
			el.style.left = (pad + c * (cellW + gap)) + 'px';
			el.style.top = (pad + r * rowH) + 'px';
			el.style.transform = 'translate3d(0,0,0)';
		}

		function acquire(idx) {
			var el = pool.pop();
			if (!el) {
				el = document.createElement('div');
				el.style.cssText = 'position:absolute;will-change:transform;';
			}
			el.innerHTML = renderItem(list[idx], idx);
			keys[idx] = sig(idx);
			return el;
		}

		function release(el) {
			el.style.transform = 'translate3d(0,0,0)';
			if (pool.length < 80) pool.push(el);
		}

		function update(force) {
			rafId = 0;
			try {
				var prevCols = cols;
												if (force === true || needsMeasure) measure();
				var colsChanged = prevCols !== cols || laidOutCols !== cols;
				laidOutCols = cols;

								var scrollTop = Math.max(0, lastScrollTop - contentOffset);
				var firstRow = Math.max(0, Math.floor(scrollTop / rowH) - os);
				var lastRow = Math.ceil((scrollTop + viewportHeight) / rowH) + os;
				var start = firstRow * cols;
				var end = Math.min(list.length, (lastRow + 1) * cols);
				var i, el;

								if (colsChanged) {
					nodes.forEach(function (node, idx) { place(node, idx); });
				}

								nodes.forEach(function (node, idx) {
					if (idx < start || idx >= end) {
						if (node.parentNode === zone) zone.removeChild(node);
						release(node);
						nodes.delete(idx);
					}
				});

								for (i = start; i < end; i++) {
					el = nodes.get(i);
					if (el) {
						var k = sig(i);
						if (keys[i] !== k) { el.innerHTML = renderItem(list[i], i); keys[i] = k; }
						continue;
					}
					el = acquire(i);
					place(el, i);
					zone.appendChild(el);
					nodes.set(i, el);
				}
			} catch (e) { LOG.warn('虚拟列表渲染失败:', e); }
		}

		function schedule() {
			if (rafId) return;
			rafId = requestAnimationFrame(update);
		}

		var onScroll = function () {
									lastScrollTop = scroller.scrollTop || 0;
			schedule();
		};
		scroller.addEventListener('scroll', onScroll, { passive: true });

				var resizeObs = null;
		function onWinResize() { needsMeasure = true; schedule(); }
		try {
			if (typeof ResizeObserver === 'function') {
				resizeObs = new ResizeObserver(onWinResize);
				resizeObs.observe(container); 
				if (scroller !== container) resizeObs.observe(scroller); 
			} else {
				window.addEventListener('resize', onWinResize);
			}
		} catch (e) {}

		update();
		return {
			update: update, 
			measure: function () { measure(); },
						metrics: function () {
				return { cols: cols, cellW: cellW, cardH: cardH, rowH: rowH, pad: pad, gap: gap };
			},
			renderedCount: function () { return nodes.size; },
									destroy: function () {
				try { scroller.removeEventListener('scroll', onScroll); } catch (e) {}
				try { if (resizeObs) { resizeObs.disconnect(); resizeObs = null; } } catch (e) {}
				try { window.removeEventListener('resize', onWinResize); } catch (e) {}
				try { if (rafId && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(rafId); } catch (e) {}
				rafId = 0;
				nodes.forEach(function (node) { if (node.parentNode === zone) zone.removeChild(node); release(node); });
				nodes.clear();
				keys = {};
				try { if (zone.parentNode) zone.parentNode.removeChild(zone); } catch (e) {}
				try { if (spacer.parentNode) spacer.parentNode.removeChild(spacer); } catch (e) {}
			},
			setItems: function (newItems) {
				list = newItems || [];
				nodes.forEach(function (node) { if (node.parentNode === zone) zone.removeChild(node); release(node); });
				nodes.clear();
				keys = {};
																update(true);
			}
		};
	};
	UI._buildMinimizedBar = function () {
		if (State.minimizedBar) return;
		var bar = MS_FACTORY.minimizedBar();
		document.documentElement.appendChild(bar);
		State.minimizedBar = bar;
	};

	UI.toggleMinimize = function () {
		if (!State.panel || U.isMobile()) return;
		if (State.config.panelMinimized) UI.restorePanel();
		else UI.minimizePanel();
	};

	UI.minimizePanel = function () {
		if (!State.panel || U.isMobile()) return;
		UI._buildMinimizedBar();
		var c = UI.colors();
		var bar = State.minimizedBar;
		bar.style.background = 'linear-gradient(135deg,' + c.primary + ' 0%,' + c.primary2 + ' 100%)';
		bar.style.color = '#fff';
		var rect = State.panel.getBoundingClientRect();
		var left, top;
		if (rect.width > 0 && rect.height > 0) {
			left = rect.left; top = rect.top;
		} else {
			var savedX = State.config.panelX != null ? parseFloat(State.config.panelX) : null;
			var savedY = State.config.panelY != null ? parseFloat(State.config.panelY) : null;
			if (savedX != null && !isNaN(savedX) && savedY != null && !isNaN(savedY)) {
				left = Math.max(4, Math.min(window.innerWidth - 64, savedX));
				top = Math.max(4, Math.min(window.innerHeight - 60, savedY));
			} else {
				left = Math.max(4, window.innerWidth - 64);
				top = 4;
			}
		}
		bar.style.left = left + 'px';
		bar.style.top = top + 'px';
		bar.style.right = 'auto';
		bar.style.bottom = 'auto';
		State.panel.style.display = 'none';
		UI._staggerCancel();
		UI._panelPerf(false);
		bar.style.display = 'flex';
		bar.style.opacity = '0';
		bar.style.transform = 'scale(0.9)';
		requestAnimationFrame(function () {
			bar.style.opacity = '1';
			bar.style.transform = 'scale(1)';
		});
		State.config.panelMinimized = true;
		State.save();
	};

	UI.restorePanel = function () {
		if (!State.panel || U.isMobile()) return;
		var bar = State.minimizedBar;
		State.panel.style.display = 'flex';
		State.panel.style.opacity = '0';
		State.panel.style.transition = UI._panelTransition('in');
		State.panel.style.transform = UI._panelTf(false);
		if (bar && bar.style.display !== 'none') {
			var rect = bar.getBoundingClientRect();
			var maxX = window.innerWidth - State.panel.offsetWidth - 4;
			var maxY = window.innerHeight - State.panel.offsetHeight - 4;
			var nx = Math.max(4, Math.min(maxX, rect.left));
			var ny = Math.max(4, Math.min(maxY, rect.top));
			State.panel.style.left = nx + 'px';
			State.panel.style.top = ny + 'px';
			State.panel.style.right = 'auto';
			State.panel.style.bottom = 'auto';
			State.config.panelX = nx;
			State.config.panelY = ny;
			bar.style.display = 'none';
		}
		requestAnimationFrame(function () {
			State.panel.style.opacity = '1';
		});
		State.config.panelMinimized = false;
		State.save();
	};
													UI._PANEL_TF_HIDE = 'translateX(100%) scale(.94)';
	UI._PANEL_TF_SHOW = 'translateX(0) scale(1)';
	UI._PANEL_EASE_IN = 'cubic-bezier(.22,1,.36,1)';
	UI._PANEL_EASE_OUT = 'cubic-bezier(.3,0,.6,1)'; 
			UI._PANEL_MOB_TF_HIDE = 'translate3d(100%,0,0)';
	UI._PANEL_MOB_TF_SHOW = 'translate3d(0,0,0)';
	UI._PANEL_MOB_EASE_IN = 'cubic-bezier(.34,.72,.34,1)';
	UI._PANEL_MOB_EASE_OUT = 'cubic-bezier(.4,0,.6,1)';
	UI._staggerAnims = [];

	UI._panelMob = function () { return U.isMobile(); };

	
	UI._panelTf = function (hidden) {
		if (UI._panelMob()) return hidden ? UI._PANEL_MOB_TF_HIDE : UI._PANEL_MOB_TF_SHOW;
		return hidden ? UI._PANEL_TF_HIDE : UI._PANEL_TF_SHOW;
	};

	
	UI._panelAnimProfile = function () {
		if (UI._panelMob()) {
									return { dur: 220, step: 30, start: 170, lead: 8, skipBox: true, fadeOnly: false };
		}
		return { dur: 380, step: 45, start: 0, lead: 22, skipBox: false, fadeOnly: false };
	};

	
	UI._panelWindowMs = function (n) {
		var p = UI._panelAnimProfile();
		return p.start + Math.max(0, n - 1) * p.step + p.dur;
	};

	
	UI._panelTransition = function (phase) {
		if (UI._panelMob()) {
						var mm = phase === 'out' ? '.28s ' + UI._PANEL_MOB_EASE_OUT : '.34s ' + UI._PANEL_MOB_EASE_IN;
			var ms = 'transform ' + mm
				+ ', background-color .35s ease, color .35s ease, border-color .35s ease, box-shadow .35s ease';
			if (phase !== 'drag') ms += ', left .3s ease, top .3s ease';
			return ms;
		}
		var move, fade;
		if (phase === 'out') {
			move = '.34s ' + UI._PANEL_EASE_OUT;
									fade = '.3s ease-in';
		} else {
			move = '.46s ' + UI._PANEL_EASE_IN;
			fade = '.24s ease-out';
		}
		var s = 'transform ' + move + ', opacity ' + fade
			+ ', background-color .35s ease, color .35s ease, border-color .35s ease, box-shadow .35s ease';
		if (phase !== 'drag') s += ', left .3s ease, top .3s ease';
		return s;
	};

	
	UI._staggerCancel = function () {
		var list = UI._staggerAnims;
		if (!list) return;
		for (var i = 0; i < list.length; i++) {
			try { list[i].cancel(); } catch (e) {}
		}
		list.length = 0;
		if (UI._staggerTimer) { clearTimeout(UI._staggerTimer); UI._staggerTimer = null; }
	};

	
	UI._panelPerf = function (on) {
		var panel = State.panel;
		if (!panel) return;
		try {
			if (on) {
				panel.style.willChange = UI._panelMob() ? 'transform' : 'transform, opacity';
				if (UI._perfTimer) clearTimeout(UI._perfTimer);
								var win = UI._panelWindowMs(12) + 150;
				UI._perfTimer = setTimeout(function () {
					UI._perfTimer = null;
					if (State.panel && State.panelOpen) State.panel.style.willChange = 'auto';
				}, win);
			} else {
				if (UI._perfTimer) { clearTimeout(UI._perfTimer); UI._perfTimer = null; }
				panel.style.willChange = 'auto';
			}
		} catch (e) {}
	};

	
							UI._panelGlassFreeze = function (on, holdMs) {
		var panel = State.panel;
		if (UI._glassTimer) { clearTimeout(UI._glassTimer); UI._glassTimer = null; }
		if (!panel || !panel.classList) return;
						if (State.config.uiStyle !== 'ios27') return;
		try {
			if (on) panel.classList.add('_ms_sliding');
			else panel.classList.remove('_ms_sliding');
		} catch (e) { return; }
		if (on) {
			var hold = (holdMs > 0) ? holdMs : 420;
			UI._glassTimer = setTimeout(function () {
				UI._glassTimer = null;
				UI._panelGlassFreeze(false);
			}, hold);
		}
	};

	
	UI._panelStagger = function (phase) {
		UI._staggerCancel();
		var panel = State.panel;
		if (phase === 'cancel' || !panel || !panel.children || typeof panel.animate !== 'function') return;
		try {
			if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		} catch (e) {}
		var prof = UI._panelAnimProfile();
		for (var i = 0, n = 0; i < panel.children.length; i++) {
			var el = panel.children[i];
						if (!el || typeof el.animate !== 'function') continue;
			if (el.classList && el.classList.contains('_ms_glass_layers')) continue;
									if (prof.skipBox && el.id === '_ms_box') continue;
						var lead = el.id === '_ms_box' ? Math.min(12, prof.lead) : prof.lead;
			try {
				UI._staggerAnims.push(el.animate(
					[{ opacity: 0, transform: 'translateX(' + lead + 'px)' },
					 { opacity: 1, transform: 'translateX(0)' }],
					{ duration: prof.dur, delay: prof.start + n * prof.step, easing: UI._PANEL_EASE_IN, fill: 'backwards' }
				));
			} catch (e2) {}
			n++;
		}
						UI._staggerTimer = setTimeout(function () { UI._staggerCancel(); }, UI._panelWindowMs(n) + 120);
	};

					UI._tabIconMap = {
		img: MS_CONFIG.ICONS.image, video: MS_CONFIG.ICONS.video, audio: MS_CONFIG.ICONS.audio,
		m3u8: MS_CONFIG.ICONS.stream, translate: MS_CONFIG.ICONS.book, cookie: MS_CONFIG.ICONS.cookie,
		storage: MS_CONFIG.ICONS.package, settings: MS_CONFIG.ICONS.settings, plugins: MS_CONFIG.ICONS.plug,
		diag: MS_CONFIG.ICONS.wrench
	};

				UI._tabLabel = function (key) {
		var langKey = 'tab' + key.charAt(0).toUpperCase() + key.slice(1);
		var raw = LANG.t(langKey);
		if (!raw || raw === langKey) return '';
				return String(raw)
			.replace(/<svg[\s\S]*?<\/svg>/gi, '')
			.replace(/<svg[^>]*\/>/gi, '')
			.trim();
	};

					UI.iconTextEl = function (icon, text) {
		var wrap = document.createElement('span');
		wrap.style.cssText = 'display:inline-flex;align-items:center;gap:6px;';
		if (icon) {
			var ic = document.createElement('span');
			ic.style.cssText = 'display:inline-flex;align-items:center;';
			ic.innerHTML = icon; 
			wrap.appendChild(ic);
		}
		var tx = document.createElement('span');
		tx.textContent = text == null ? '' : String(text);
		wrap.appendChild(tx);
		return wrap;
	};

		UI._tabInnerHtml = function (key, label) {
		var icon = (UI._tabIconMap && UI._tabIconMap[key]) || '';
		if (label == null || label === '') label = UI._tabLabel(key);
		return '<span style="display:inline-flex;align-items:center;gap:4px;">' + icon + '<span>' + SEC.escapeHtml(label) + '</span></span>';
	};

	UI.buildPanel = function () {
		if (State.panel) return;
		var isMob = U.isMobile();
		var w = isMob ? Math.min(window.innerWidth, 520) : State.config.panelWidth;
		var c = UI.colors();
		State.panel = document.createElement('div');
		State.panel.id = '_ms_panel';
		var savedX = !isMob && State.config.panelX != null ? parseFloat(State.config.panelX) : null;
		var savedY = !isMob && State.config.panelY != null ? parseFloat(State.config.panelY) : null;
		var savedH = !isMob && State.config.panelHeight > 0 ? parseFloat(State.config.panelHeight) : null;
		var posStyle;
		var maxX = window.innerWidth - Math.min(w, window.innerWidth * 0.92) - 8;
		var maxY = window.innerHeight - (savedH || 400) - 8;
		var snapEdge = !isMob ? State.config.panelSnapEdge : null;
		if (snapEdge === 'left') {
			var sy = savedY != null && !isNaN(savedY) ? Math.max(4, Math.min(maxY, savedY)) : 4;
			posStyle = 'left:0;top:' + sy + 'px;bottom:auto;right:auto;';
		} else if (snapEdge === 'right') {
			var sy2 = savedY != null && !isNaN(savedY) ? Math.max(4, Math.min(maxY, savedY)) : 4;
			posStyle = 'right:0;top:' + sy2 + 'px;bottom:auto;left:auto;';
		} else if (snapEdge === 'top') {
			var sx = savedX != null && !isNaN(savedX) ? Math.max(4, Math.min(maxX, savedX)) : 4;
			posStyle = 'left:' + sx + 'px;top:0;bottom:auto;right:auto;';
		} else if (savedX != null && !isNaN(savedX) && savedY != null && !isNaN(savedY)) {
			var x = Math.max(4, Math.min(maxX, savedX));
			var y = Math.max(4, Math.min(maxY, savedY));
			posStyle = 'left:' + x + 'px;top:' + y + 'px;bottom:auto;right:auto;';
		} else {
			posStyle = 'right:0;top:0;bottom:0;';
		}
		var hStyle = savedH ? 'height:' + savedH + 'px;max-height:96vh;' : 'max-height:100vh;';
						var mobH = isMob ? 'max-height:none;' : hStyle;
		var tfOrigin = isMob ? '' : 'transform-origin:100% 50%;';
				var initOpacity = isMob ? '1' : '0';
		State.panel.style.cssText = 'position:fixed;' + posStyle + mobH + 'width:' + w + 'px;background:' + c.bg + ';color:' + c.txt + ';border-radius:' + (isMob ? '0' : '16px') + ';box-shadow:-30px 0 60px rgba(0,0,0,.35);display:none;flex-direction:column;overflow:hidden;z-index:2147483645;' + tfOrigin + 'transform:' + UI._panelTf(true) + ';opacity:' + initOpacity + ';transition:' + UI._panelTransition('in') + ';font-family:system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;';

						var hd = document.createElement('div');
		hd.style.cssText = 'display:flex;align-items:center;padding:12px 16px;background:linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ' 55%,' + MS_CONFIG.COLORS.rose + ');color:' + MS_CONFIG.COLORS.white + ';flex-shrink:0;gap:8px;';
		hd.innerHTML = '<div style="flex:1;font-size:15px;font-weight:600;user-select:none;">' + LANG.t('appTitle') + '</div>';
		var minBtn = null;
		if (!isMob) {
			minBtn = MS_FACTORY.headerBtn('−', '最小化', UI.toggleMinimize);
			hd.appendChild(minBtn);
		}
		var closeBtn = MS_FACTORY.headerBtn('×', '关闭', UI.closePanel);
		hd.appendChild(closeBtn);
		State.panel.appendChild(hd);

				if (!isMob) {
			hd.style.cursor = 'move';
			var headerDragging = false, headerStartX = 0, headerStartY = 0, panelStartX = 0, panelStartY = 0;
			hd.addEventListener('mousedown', function (e) {
				if (e.target === closeBtn || e.target === minBtn) return;
				headerDragging = true;
				headerStartX = e.clientX; headerStartY = e.clientY;
				var rect = State.panel.getBoundingClientRect();
				panelStartX = rect.left; panelStartY = rect.top;
								State.panel.style.transition = UI._panelTransition('drag');
				e.preventDefault();
			});
			document.addEventListener('mousemove', function (e) {
				if (!headerDragging) return;
				var dx = e.clientX - headerStartX, dy = e.clientY - headerStartY;
				var pw = State.panel.offsetWidth, ph = State.panel.offsetHeight;
				var nx = Math.max(4, Math.min(window.innerWidth - pw - 4, panelStartX + dx));
				var ny = Math.max(4, Math.min(window.innerHeight - ph - 4, panelStartY + dy));
				var snapLeft = nx < 15;
				var snapRight = !snapLeft && (window.innerWidth - pw - nx) < 15;
				var snapTop = ny < 15;
				if (snapLeft) {
					State.panel.style.left = '0';
					State.panel.style.right = 'auto';
				} else if (snapRight) {
					State.panel.style.right = '0';
					State.panel.style.left = 'auto';
				} else {
					State.panel.style.left = nx + 'px';
					State.panel.style.right = 'auto';
				}
				if (snapTop) {
					State.panel.style.top = '0';
					State.panel.style.bottom = 'auto';
				} else {
					State.panel.style.top = ny + 'px';
					State.panel.style.bottom = 'auto';
				}
			});
			document.addEventListener('mouseup', function () {
				if (!headerDragging) return;
				headerDragging = false;
				var rect = State.panel.getBoundingClientRect();
				var x = rect.left, y = rect.top;
				var pw = State.panel.offsetWidth;
				State.config.panelSnapEdge = null;
				if (y < 15) {
					State.config.panelSnapEdge = 'top';
				} else if (x < 15) {
					State.config.panelSnapEdge = 'left';
				} else if (window.innerWidth - pw - x < 15) {
					State.config.panelSnapEdge = 'right';
				}
				State.config.panelX = x; State.config.panelY = y;
				State.save();
				State.panel.style.transition = UI._panelTransition('in');
			});
		}

				var tabBar = document.createElement('div');
		tabBar.id = '_ms_tabs';
		tabBar.style.cssText = 'display:flex;gap:4px;padding:8px 10px;background:' + c.bg2 + ';border-bottom:1px solid ' + c.border + ';overflow-x:auto;flex-shrink:0;transition: background-color 0.3s, color 0.3s;';
						var tabs = [
			{ key: 'img', label: UI._tabLabel('img') },
			{ key: 'video', label: UI._tabLabel('video') },
			{ key: 'audio', label: UI._tabLabel('audio') },
			{ key: 'm3u8', label: UI._tabLabel('m3u8') },
			{ key: 'translate', label: UI._tabLabel('translate') },
			{ key: 'cookie', label: UI._tabLabel('cookie') },
			{ key: 'storage', label: UI._tabLabel('storage') },
			{ key: 'plugins', label: UI._tabLabel('plugins') },
			{ key: 'settings', label: UI._tabLabel('settings') },
			{ key: 'diag', label: UI._tabLabel('diag') },
		];
		for (var i = 0; i < tabs.length; i++) {
			(function (t) {
				var btn = document.createElement('button');
				btn.className = '_ms_tab';
				btn.setAttribute('data-tab', t.key);
				btn.innerHTML = UI._tabInnerHtml(t.key, t.label);
				UI._applyTabStyle(btn, t.key === State.tab);
				btn.addEventListener('click', function () { UI.switchTab(t.key); });
				tabBar.appendChild(btn);
			})(tabs[i]);
		}
		State.panel.appendChild(tabBar);

				var searchWrap = document.createElement('div');
		searchWrap.id = '_ms_search';
		searchWrap.style.cssText = 'padding:6px 12px;background:' + c.bg2 + ';border-bottom:1px solid ' + c.border + ';display:none;transition: background-color 0.3s, color 0.3s;';
		var searchInput = document.createElement('input');
		searchInput.type = 'text';
		searchInput.placeholder = LANG.t('searchPlaceholder');
		searchInput.style.cssText = 'width:100%;padding:7px 12px;border:1px solid ' + c.border + ';border-radius:8px;background:' + c.bg + ';color:' + c.txt + ';font-size:13px;font-family:inherit;box-sizing:border-box;transition:background-color .35s ease, color .35s ease, border-color .35s ease;';
		searchInput.addEventListener('input', U.debounce(function () {
			State.searchKeyword = this.value.trim().toLowerCase();
			var t = State.tab;
			if (t === 'img' || t === 'video' || t === 'audio' || t === 'm3u8') State._renderThrottled();
		}, 250));
		searchWrap.appendChild(searchInput);
		State.panel.appendChild(searchWrap);

				var filterWrap = document.createElement('div');
		filterWrap.id = '_ms_filter';
		filterWrap.style.cssText = 'padding:4px 12px;background:' + c.bg2 + ';border-bottom:1px solid ' + c.border + ';display:none;transition: background-color 0.3s, color 0.3s;';
		var filterBtn = document.createElement('button');
		filterBtn.textContent = LANG.t('advFilter');
		filterBtn.style.cssText = 'padding:6px 12px;border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:12px;font-weight:600;cursor:pointer;';
		filterBtn.addEventListener('click', function () { UI.showFilterDialog(); });
		filterWrap.appendChild(filterBtn);
		State.panel.appendChild(filterWrap);

				var progressWrap = document.createElement('div');
		progressWrap.id = '_ms_progress';
		progressWrap.style.cssText = 'padding:8px 12px;background:' + c.bg2 + ';border-bottom:1px solid ' + c.border + ';display:none;cursor:pointer;transition: background-color 0.3s, color 0.3s;';
		progressWrap.title = '点击查看下载队列';
				progressWrap.innerHTML = '<div style="font-size:12px;color:' + c.sub + ';margin-bottom:4px;">' + LANG.t('dlProgress') + '</div><div style="height:8px;background:' + c.bg3 + ';border-radius:4px;overflow:hidden;"><div id="_ms_progress_bar" style="height:100%;background:linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ');width:0%;transition:width .3s;"></div></div><div id="_ms_progress_text" style="font-size:11px;color:' + c.sub + ';margin-top:4px;">0 / 0</div>';
		progressWrap.addEventListener('click', function () { UI.showDownloadQueue(); });
		State.panel.appendChild(progressWrap);

				var box = document.createElement('div');
		box.id = '_ms_box';
		box.style.cssText = 'flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;background:' + c.bg + (isMob ? ';padding-bottom:env(safe-area-inset-bottom);' : '') + ';transition: background-color 0.3s, color 0.3s;';
		box.innerHTML = '<div style="padding:80px 20px;text-align:center;color:' + c.sub + ';font-size:14px;">' + LANG.t('clickTabScan') + '</div>';
		var _boxScrollTimer = null;
		box.addEventListener('scroll', function () {
			UI.pauseMO();
			if (_boxScrollTimer) clearTimeout(_boxScrollTimer);
			_boxScrollTimer = setTimeout(function () { UI.resumeMO(); }, 300);
									UI._panelGlassFreeze(true, 240);
		}, { passive: true });
		box.addEventListener('click', function (e) {
			if (!State.selectionMode) return;
			var t = e.target.closest && e.target.closest('[data-url]');
			if (!t) {
				Selection.exit();
			}
		});
		State.panel.appendChild(box);

				var footer = document.createElement('div');
		footer.id = '_ms_footer';
		footer.style.cssText = 'flex-shrink:0;padding:' + (isMob ? '10px 14px calc(10px + env(safe-area-inset-bottom))' : '10px 14px') + ';background:' + c.bg + ';border-top:1px solid ' + c.border + ';display:none;transition: background-color 0.3s, color 0.3s;';
		State.panel.appendChild(footer);

				if (!isMob) {
			var dragBar = document.createElement('div');
			dragBar.style.cssText = 'position:absolute;left:0;top:0;bottom:0;width:6px;cursor:ew-resize;background:transparent;z-index:10;';
			var dragStartX = 0, dragStartW = 0, draggingPanel = false;
			dragBar.addEventListener('mousedown', function (e) { draggingPanel = true; dragStartX = e.clientX; dragStartW = State.panel.offsetWidth; e.preventDefault(); });
			document.addEventListener('mousemove', function (e) { if (!draggingPanel) return; var delta = dragStartX - e.clientX; var newW = Math.max(340, Math.min(900, dragStartW + delta)); State.panel.style.width = newW + 'px'; });
			document.addEventListener('mouseup', function () { if (draggingPanel) { draggingPanel = false; State.config.panelWidth = State.panel.offsetWidth; State.save(); } });
			State.panel.appendChild(dragBar);

						var hDragBar = document.createElement('div');
			hDragBar.style.cssText = 'position:absolute;left:0;right:0;bottom:0;height:6px;cursor:ns-resize;background:transparent;z-index:10;';
			var dragStartY2 = 0, dragStartH = 0, draggingH = false;
			hDragBar.addEventListener('mousedown', function (e) { draggingH = true; dragStartY2 = e.clientY; dragStartH = State.panel.offsetHeight; e.preventDefault(); });
			document.addEventListener('mousemove', function (e) { if (!draggingH) return; var delta = e.clientY - dragStartY2; var newH = Math.max(300, Math.min(window.innerHeight - 20, dragStartH + delta)); State.panel.style.height = newH + 'px'; State.panel.style.maxHeight = 'none'; });
			document.addEventListener('mouseup', function () { if (draggingH) { draggingH = false; State.config.panelHeight = State.panel.offsetHeight; State.save(); } });
			State.panel.appendChild(hDragBar);

						var cornerDrag = document.createElement('div');
			cornerDrag.style.cssText = 'position:absolute;right:0;bottom:0;width:12px;height:12px;cursor:nwse-resize;background:transparent;z-index:11;';
			var dragStartX3 = 0, dragStartY3 = 0, dragStartW2 = 0, dragStartH2 = 0, draggingCorner = false;
			cornerDrag.addEventListener('mousedown', function (e) { draggingCorner = true; dragStartX3 = e.clientX; dragStartY3 = e.clientY; dragStartW2 = State.panel.offsetWidth; dragStartH2 = State.panel.offsetHeight; e.preventDefault(); });
			document.addEventListener('mousemove', function (e) {
				if (!draggingCorner) return;
				var dx = e.clientX - dragStartX3, dy = e.clientY - dragStartY3;
				var newW = Math.max(340, Math.min(900, dragStartW2 + dx));
				var newH = Math.max(300, Math.min(window.innerHeight - 20, dragStartH2 + dy));
				State.panel.style.width = newW + 'px'; State.panel.style.height = newH + 'px';
				State.panel.style.maxHeight = 'none';
			});
			document.addEventListener('mouseup', function () {
				if (draggingCorner) {
					draggingCorner = false;
					State.config.panelWidth = State.panel.offsetWidth;
					State.config.panelHeight = State.panel.offsetHeight;
					State.save();
				}
			});
			State.panel.appendChild(cornerDrag);
		}

		document.documentElement.appendChild(State.panel);
		U.safeRun(function () { UI.applyUiStyle(); }, 'applyUiStyle(init)');
	};

	UI._applyTabStyle = function (btn, active) {
		var c = UI.colors();
		var isGlass = State.config && State.config.uiStyle === 'ios27';
				btn.setAttribute('data-active', active ? '1' : '0');
		var bg, color, shadow;
		if (active) {
												var pc = UI._paletteColors() || {};
			var pri = pc.primary || c.primary;
			var pri2 = pc.primary2 || c.primary2;
			if (isGlass) {
				bg = 'linear-gradient(135deg,' + UI._ios27Rgba(pri, 0.82) + ',' + UI._ios27Rgba(pri2, 0.82) + ')';
				shadow = 'box-shadow:0 4px 14px ' + UI._ios27Rgba(pri, 0.25) + ', inset 0 1px 0 rgba(255,255,255,.25);';
			} else {
				bg = 'linear-gradient(135deg,' + pri + ',' + pri2 + ')';
				shadow = 'box-shadow:0 4px 12px ' + UI._ios27Rgba(pri, 0.30) + ';';
			}
			color = '#fff';
		} else {
			bg = UI.isEffectivelyDark() ? '#334155' : '#e2e8f0';
			color = c.sub;
			shadow = '';
		}
		btn.style.cssText = 'flex:1;min-width:60px;padding:8px 4px;border:none;border-radius:8px;background:' + bg + ';color:' + color + ';font-size:12px;font-weight:' + (active ? '700' : '500') + ';cursor:pointer;white-space:nowrap;transition:background .35s ease, color .35s ease, box-shadow .35s ease, transform .15s ease;' + shadow;
	};

	UI.openPanel = function () {
		if (!State.panel) UI.buildPanel();
		var wasOpen = !!State.panelOpen && State.panel.style.display !== 'none';
		State.panelOpen = true;
		UI._moConnect(); 
		UI._glassIdle(false);
		if (!U.isMobile() && State.config.panelMinimized) {
			UI.minimizePanel();
		} else {
			var mob = UI._panelMob();
			State.panel.style.display = 'flex';
			if (wasOpen) {
								State.panel.style.transform = UI._panelTf(false);
				State.panel.style.opacity = '1';
			} else {
				State.panel.style.transition = UI._panelTransition('in');
				State.panel.style.transform = UI._panelTf(true);
				if (!mob) State.panel.style.opacity = '0'; 
				UI._panelPerf(true);
																UI._panelGlassFreeze(true, UI._panelWindowMs(12) + 80);
				requestAnimationFrame(function () {
					if (!State.panelOpen || !State.panel) return; 
					State.panel.style.transform = UI._panelTf(false);
					State.panel.style.opacity = '1';
					UI._panelStagger('in');
				});
			}
		}
		var startTab = State.config.lastTab || State.tab || 'img';
		var total = State.images.length + State.videos.length + State.audios.length + State.m3u8.length;
		if (total === 0) Scanner.doFull(function () { toast(LANG.t('scanDoneToast')); UI.switchTab(startTab); });
		else UI.switchTab(startTab);
	};

	UI.closePanel = function () {
		if (!State.panel) return;
		State.panelOpen = false;
		UI._moDisconnect(); 
		UI._glassIdle(true);
		if (State.selectionMode && !State.config.persistSelection) Selection.exit();
				try {
			var mediaEls = State.panel.querySelectorAll('video, audio');
			for (var i = 0; i < mediaEls.length; i++) {
				try { mediaEls[i].pause(); } catch (e) {}
			}
		} catch (e) {}
				try {
			if (State._renderThrottled) {
				if (State._renderThrottled._cancel) State._renderThrottled._cancel();
				else if (State._renderThrottled._timer) {
					clearTimeout(State._renderThrottled._timer);
					State._renderThrottled._timer = null;
				}
			}
		} catch (e) {}
		UI._staggerCancel(); 
		UI._panelPerf(true);
								UI._panelGlassFreeze(true, 400); 
		State.panel.style.transition = UI._panelTransition('out');
		State.panel.style.transform = UI._panelTf(true);
				if (!UI._panelMob()) State.panel.style.opacity = '0';
		if (State.minimizedBar) State.minimizedBar.style.display = 'none';
		setTimeout(function () {
			if (!State.panelOpen && State.panel) {
				State.panel.style.display = 'none';
				UI._panelPerf(false); 
			}
		}, 400);
	};

	UI.quickDownload = function () {
		UI.openPanel();
		function doDownload() {
			var order = [['img', State.images], ['video', State.videos], ['audio', State.audios], ['m3u8', State.m3u8]];
			for (var i = 0; i < order.length; i++) {
				var k = order[i][0], list = order[i][1];
				if (list && list.length > 0) {
					UI.switchTab(k);
					setTimeout(function (kind, items) {
						return function () {
							if (!confirm(LANG.t('confirmDlAll', {n: items.length}))) return;
							toast(LANG.t('startDlToast', {n: items.length}));
							Dl.batch(items, kind, null, null);
						};
					}(k, list), 120);
					return;
				}
			}
			toast(LANG.t('noDlFile'), '#ef4444');
		}
		var total = State.images.length + State.videos.length + State.audios.length + State.m3u8.length;
		if (total === 0) Scanner.doFull(doDownload);
		else doDownload();
	};

	UI.showFloatContextMenu = function (x, y) {
		var existing = document.getElementById('_ms_float_ctx_menu');
		if (existing) existing.remove();
		var c = UI.colors();
		var menu = document.createElement('div');
		menu.id = '_ms_float_ctx_menu';
		var items = [
			{ icon: MS_CONFIG.ICONS.folder, label: LANG.t('ctxOpenPanel'), action: function () { UI.openPanel(); } },
			{ icon: MS_CONFIG.ICONS.download, label: LANG.t('ctxQuickDownload'), action: function () { UI.quickDownload(); } },
			{ icon: MS_CONFIG.ICONS.globe, label: LANG.t('ctxTranslate'), action: function () { UI.openPanel(); UI.switchTab('translate'); } },
			{ icon: MS_CONFIG.ICONS.search, label: LANG.t('grpAudioId'), action: function () { UI.runAudioId(); } },
			{ icon: MS_CONFIG.ICONS.speech, label: LANG.t('transcribeRun'), action: function () {
				var u = (State.videoLinks && State.videoLinks.length) ? (State.videoLinks[0].url || State.videoLinks[0]) : '';
				if (!u) { toast(LANG.t('transcribeNoKey'), '#f59e0b'); return; }
				UI.runTranscribe(typeof u === 'string' ? u : u.url, '');
			} },
			{ icon: MS_CONFIG.ICONS.settings, label: LANG.t('ctxSettings'), action: function () { UI.openPanel(); UI.switchTab('settings'); } },
			{ icon: MS_CONFIG.ICONS.cross, label: LANG.t('ctxClose'), action: function () {} }
		];
		var menuH = items.length * 40 + 16;
		var mx = Math.min(Math.max(8, x), window.innerWidth - 180);
		var my = Math.min(Math.max(8, y), window.innerHeight - menuH);
		menu.style.cssText = 'position:fixed;left:' + mx + 'px;top:' + my + 'px;z-index:2147483648;background:' + c.bg + ';border:1px solid ' + c.border + ';border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.35);padding:6px;min-width:160px;font-family:system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;overflow:hidden;';
		for (var mi = 0; mi < items.length; mi++) {
			(function (item) {
				var btn = document.createElement('div');
				btn.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;font-size:13px;color:' + c.txt + ';transition:background .15s;';
				btn.innerHTML = '<span style="font-size:16px;">' + item.icon + '</span><span>' + item.label + '</span>';
				btn.addEventListener('mouseenter', function () { btn.style.background = c.bg3; });
				btn.addEventListener('mouseleave', function () { btn.style.background = 'transparent'; });
				btn.addEventListener('click', function (e) {
					e.stopPropagation();
					closeMenuAndCleanup();
					try { item.action(); } catch (e2) {}
				});
				menu.appendChild(btn);
			})(items[mi]);
		}
		function closeMenuAndCleanup() {
			if (!menu.parentNode) return;
			menu.remove();
			document.removeEventListener('mousedown', closeMenu, true);
			document.removeEventListener('touchstart', closeMenu, true);
			document.removeEventListener('keydown', closeMenuKey, true);
		}
		var closeMenu = function (e) {
			if (e.target !== menu && !menu.contains(e.target)) {
				closeMenuAndCleanup();
			}
		};
		var closeMenuKey = function (e) { if (e.key === 'Escape') { closeMenuAndCleanup(); } };
		setTimeout(function () {
			document.addEventListener('mousedown', closeMenu, true);
			document.addEventListener('touchstart', closeMenu, true);
			document.addEventListener('keydown', closeMenuKey, true);
		}, 50);
		document.body.appendChild(menu);
	};

	UI.switchTab = function (tab) {
		State.tab = tab;
		if (State.config && State.config.lastTab !== tab) {
			State.config.lastTab = tab;
			try { State.save(); } catch (e) {}
		}
		var tbs = document.querySelectorAll('._ms_tab');
		for (var i = 0; i < tbs.length; i++) UI._applyTabStyle(tbs[i], tbs[i].getAttribute('data-tab') === tab);
		var searchEl = document.getElementById('_ms_search');
		var filterEl = document.getElementById('_ms_filter');
		var footerEl = document.getElementById('_ms_footer');
		var progressEl = document.getElementById('_ms_progress');
		var isMedia = (tab === 'img' || tab === 'video' || tab === 'audio' || tab === 'm3u8');
		if (!isMedia && State.selectionMode) Selection.exit();
		if (searchEl) searchEl.style.display = isMedia ? 'block' : 'none';
		if (filterEl) filterEl.style.display = isMedia ? 'block' : 'none';
		if (footerEl) footerEl.style.display = isMedia ? 'block' : 'none';
		if (progressEl) progressEl.style.display = State.downloading ? 'block' : 'none';

		function renderTab() {
			if (tab === 'img') UI.renderMedia('img');
			else if (tab === 'video') UI.renderMedia('video');
			else if (tab === 'audio') UI.renderMedia('audio');
			else if (tab === 'm3u8') UI.renderM3u8();
			else if (tab === 'translate') UI.renderTranslate();
			else if (tab === 'cookie') UI.renderCookie();
			else if (tab === 'storage') UI.renderStorage();
			else if (tab === 'plugins') UI.renderPlugins();
			else if (tab === 'settings') UI.renderSettings();
			else if (tab === 'diag') UI.renderDiag();
		}

		var box = document.getElementById('_ms_box');
		if (!box) { renderTab(); return; }
								if (!UI._tabScroll) UI._tabScroll = {};
		var prevTab = State._prevTabForScroll;
		if (prevTab && prevTab !== tab) UI._tabScroll[prevTab] = box.scrollTop || 0;
		State._prevTabForScroll = tab;
		var restoreTop = UI._tabScroll[tab] || 0;
		box.style.opacity = '0';
		box.style.pointerEvents = 'none';
		requestAnimationFrame(function () {
			requestAnimationFrame(function () {
				renderTab();
												box.scrollTop = restoreTop;
				box.style.opacity = '1';
				box.style.pointerEvents = 'auto';
			});
		});
	};
	UI.updateProgress = function (prog) {
		var bar = document.getElementById('_ms_progress_bar');
		var txt = document.getElementById('_ms_progress_text');
		if (!bar || !txt) return;
		var pct = prog.total > 0 ? (prog.done / prog.total * 100) : 0;
		bar.style.width = pct.toFixed(1) + '%';
		txt.textContent = prog.done + ' / ' + prog.total + '（失败 ' + prog.failed + '）· ' + (prog.speed > 0 ? prog.speed.toFixed(1) + ' 项/秒' : '') + ' · 预计剩余 ' + U.formatTime(prog.eta);
	};
	UI.showDownloadQueue = function () {
		try {
			var existingOverlay = document.getElementById('_ms_queue_overlay');
			if (existingOverlay) { existingOverlay.remove(); return; }
			var c = UI.colors();
			var isMobile = window.innerWidth < 768;
			var overlay = document.createElement('div');
			overlay.id = '_ms_queue_overlay';
			overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;z-index:2147483652;padding:' + (isMobile ? '10px' : '20px') + ';';

			var modal = document.createElement('div');
			modal.id = '_ms_queue_modal';
			modal.style.cssText = 'max-width:' + (isMobile ? '100%' : 'min(92vw,560px)') + ';width:100%;max-height:' + (isMobile ? '96vh' : '85vh') + ';background:' + c.bg + ';color:' + c.txt + ';border-radius:16px;box-shadow:0 25px 80px rgba(0,0,0,.5);overflow:hidden;display:flex;flex-direction:column;';

			var header = document.createElement('div');
			header.style.cssText = 'padding:16px 20px;background:' + c.bg2 + ';border-bottom:1px solid ' + c.border + ';display:flex;align-items:center;justify-content:space-between;flex-shrink:0;';
			var title = document.createElement('div');
			title.style.cssText = 'font-size:16px;font-weight:700;';
			title.textContent = '下载队列';
			var closeBtn = document.createElement('button');
			closeBtn.innerHTML = MS_CONFIG.ICONS.cross;
			closeBtn.style.cssText = 'width:32px;height:32px;border:none;border-radius:50%;background:' + c.bg3 + ';color:' + c.txt + ';font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;';
			var queueTimer = null;
			function closeQueueOverlay() {
				if (queueTimer) { clearInterval(queueTimer); queueTimer = null; }
				if (overlay.parentNode) overlay.remove();
				document.removeEventListener('keydown', escQueue);
			}
												function escQueue(e) { if (e.key === 'Escape' || e.keyCode === 27) closeQueueOverlay(); }
			closeBtn.addEventListener('click', closeQueueOverlay);
			header.appendChild(title);
			header.appendChild(closeBtn);
			modal.appendChild(header);

			var body = document.createElement('div');
			body.id = '_ms_queue_body';
			body.style.cssText = 'flex:1;overflow-y:auto;padding:12px 16px 16px;';
			modal.appendChild(body);

			overlay.appendChild(modal);
			overlay.addEventListener('click', function (e) { if (e.target === overlay) closeQueueOverlay(); });
			document.addEventListener('keydown', escQueue);
			(document.documentElement || document.body).appendChild(overlay);

			function statusLabel(state) {
				if (state === 'running') return '下载中';
				if (state === 'queued') return '排队中';
				if (state === 'paused') return '已暂停';
				if (state === 'error') return '失败';
				return state;
			}
			function statusColor(state) {
				if (state === 'running') return '#6366f1';
				if (state === 'queued') return '#94a3b8';
				if (state === 'paused') return '#f59e0b';
				if (state === 'error') return '#ef4444';
				return '#94a3b8';
			}

			function render() {
				var tasks = Dl.getQueue();
				body.innerHTML = '';
				if (tasks.length === 0) {
					var empty = document.createElement('div');
					empty.style.cssText = 'padding:40px 20px;text-align:center;color:' + c.sub + ';font-size:14px;';
					empty.textContent = '当前没有下载任务';
					body.appendChild(empty);
					return;
				}
				for (var i = 0; i < tasks.length; i++) {
					var task = tasks[i];
					var row = document.createElement('div');
					row.style.cssText = 'padding:12px;border-radius:10px;background:' + c.bg2 + ';border:1px solid ' + c.border + ';margin-bottom:10px;';

					var top = document.createElement('div');
					top.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;';
					var name = document.createElement('div');
					name.style.cssText = 'font-size:13px;font-weight:600;color:' + c.txt + ';word-break:break-all;flex:1;';
					name.textContent = task.filename || '未知文件';
					var badge = document.createElement('span');
					badge.style.cssText = 'flex-shrink:0;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:600;color:#fff;background:' + statusColor(task.state) + ';';
					badge.textContent = statusLabel(task.state);
					top.appendChild(name);
					top.appendChild(badge);
					row.appendChild(top);

					var urlDiv = document.createElement('div');
					urlDiv.style.cssText = 'font-size:11px;color:' + c.sub + ';margin-bottom:8px;word-break:break-all;';
					urlDiv.textContent = U.trunc(task.url || '', 120);
					row.appendChild(urlDiv);

					var progressWrap = document.createElement('div');
					progressWrap.style.cssText = 'height:6px;background:' + c.bg3 + ';border-radius:3px;overflow:hidden;margin-bottom:8px;';
					var progressBar = document.createElement('div');
					var pct = task.progress && typeof task.progress.percent === 'number' ? Math.min(100, Math.max(0, task.progress.percent)) : 0;
					progressBar.style.cssText = 'height:100%;width:' + pct + '%;background:linear-gradient(90deg,#6366f1,#8b5cf6);transition:width .3s;';
					progressWrap.appendChild(progressBar);
					row.appendChild(progressWrap);

					var info = document.createElement('div');
					info.style.cssText = 'font-size:11px;color:' + c.sub + ';margin-bottom:8px;';
					var loaded = (task.progress && task.progress.loaded) || 0;
					var total = (task.progress && task.progress.total) || -1;
					info.textContent = pct + '%' + (total > 0 ? ' · ' + U.formatSize(loaded) + ' / ' + U.formatSize(total) : '');
					row.appendChild(info);

					var actions = document.createElement('div');
					actions.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;';
					function makeAction(label, color, handler) {
						var b = document.createElement('button');
						b.textContent = label;
						b.style.cssText = 'padding:5px 10px;border:none;border-radius:6px;background:' + color + ';color:#fff;font-size:11px;font-weight:600;cursor:pointer;';
						b.addEventListener('click', handler);
						return b;
					}
					if (task.state === 'running' || task.state === 'queued') {
						actions.appendChild(makeAction('暂停', '#f59e0b', function () { Dl.pauseTask(task.id); }));
						actions.appendChild(makeAction('取消', '#64748b', function () { Dl.cancelTask(task.id); }));
					} else if (task.state === 'paused') {
						actions.appendChild(makeAction('继续', '#10b981', function () { Dl.resumeTask(task.id); }));
						actions.appendChild(makeAction('取消', '#64748b', function () { Dl.cancelTask(task.id); }));
					} else if (task.state === 'error') {
						actions.appendChild(makeAction('重试', '#6366f1', function () { Dl.retryTask(task.id); }));
						actions.appendChild(makeAction('取消', '#64748b', function () { Dl.cancelTask(task.id); }));
					}
					row.appendChild(actions);
					body.appendChild(row);
				}
			}

			render();
												queueTimer = setInterval(render, 500);
		} catch (e) {
			LOG.warn('showDownloadQueue error:', e);
		}
	};
					UI._bindMediaThumbFallback = function (grid) {
		if (!grid || grid._msThumbFallbackBound) return;
		grid._msThumbFallbackBound = true;
								var isMob = U.isMobile();
		grid.addEventListener('error', function (e) {
			var img = e.target;
			if (!img || !img.getAttribute) return;
			var kind = img.getAttribute('data-ms-thumb');
			if (!kind) return;
			var c;
			try { c = UI.colors(); } catch (e2) { c = null; }
			var host = img.parentNode;
			if (!host) return;
			var d = document.createElement('div');
			if (kind === 'vlink') {
								var h = img.style.height || '100%';
				d.style.cssText = 'width:100%;height:' + h + ';background:linear-gradient(135deg,#1e293b,#334155)'
					+ ';display:flex;align-items:center;justify-content:center;color:#fff;font-size:' + (isMob ? '36px' : '24px') + ';';
				d.innerHTML = MS_CONFIG.ICONS.video;
			} else {
				var grad = kind === 'video'
					? 'linear-gradient(135deg,' + MS_CONFIG.COLORS.darkGradientStart + ',' + MS_CONFIG.COLORS.darkGradientEnd + ')'
					: MS_CONFIG.COLORS.darkGradientEnd;
				d.style.cssText = 'width:100%;height:100%;background:' + grad
					+ ';display:flex;align-items:center;justify-content:center;color:' + MS_CONFIG.COLORS.white + ';';
				if (kind === 'video') d.innerHTML = MS_CONFIG.ICONS.play;
			}
			try { host.replaceChild(d, img); } catch (e3) { try { host.appendChild(d); img.remove(); } catch (e4) {} }
		}, true); 
	};

			UI._bindMediaGrid = function (grid, kind, list) {
		UI._bindMediaThumbFallback(grid);
		function hit(e) {
			var t = e.target && e.target.closest ? e.target.closest('[data-url]') : null;
			return (t && grid.contains(t)) ? t : null;
		}
		function idxOf(el) {
			var n = parseInt(el.getAttribute('data-idx'), 10);
			return isNaN(n) ? -1 : n;
		}
		function applyRange(from, to, state) {
			var start = Math.min(from, to), end = Math.max(from, to), i;
			for (i = start; i <= end; i++) {
				if (list[i] === undefined) continue;
				if (state) State.selected.add(list[i]);
				else State.selected.delete(list[i]);
			}
																								if (end - start + 1 > 50) {
								clearTimeout(grid._msRangeTm);
				grid._msRangeTm = setTimeout(function () {
					try { Selection._updateAllCards(); } catch (e) {}
				}, 0);
			} else {
				for (i = start; i <= end; i++) {
					if (list[i] === undefined) continue;
					Selection._updateCardMark(list[i]);
				}
			}
		}
		grid.addEventListener('click', function (e) {
			var el = hit(e);
			if (!el) return;
			if (el._msLongPressTriggered) { el._msLongPressTriggered = false; return; }
			var url = el.getAttribute('data-url');
			var idx = idxOf(el);
			if (State.selectionMode && e.shiftKey && typeof State._lastSelIdx === 'number') {
				applyRange(State._lastSelIdx, idx, State._lastSelState);
				State._lastSelIdx = idx;
				Selection._refreshToolbar();
			} else if (State.selectionMode) {
				Selection.toggle(url);
				Selection._updateCardMark(url);
				State._lastSelIdx = idx;
				State._lastSelState = State.selected.has(url);
				Selection._refreshToolbar();
			} else {
				UI.previewMedia(url, kind);
			}
		});
		grid.addEventListener('dblclick', function (e) {
			var el = hit(e);
			if (!el) return;
			try {
				var url = el.getAttribute('data-url');
				Dl.one(url, Dl.buildName(url, 1, '', State.config.nameTpl), State.config.batchRetry, State.config.customHeaders);
			} catch (err) {}
		});
		grid.addEventListener('dragstart', function (e) {
			var el = hit(e);
			if (!el) return;
			if (!State.selectionMode) { e.preventDefault(); return; }
			UI._dragSrcIdx = idxOf(el);
			el.style.opacity = '0.5';
			try { e.dataTransfer.effectAllowed = 'move'; } catch (err) {}
		});
		grid.addEventListener('dragend', function () {
			UI._dragSrcIdx = null;
			var cards = grid.querySelectorAll('._ms_card');
			for (var ci = 0; ci < cards.length; ci++) { cards[ci].style.opacity = ''; cards[ci].style.transform = ''; }
		});
		grid.addEventListener('dragover', function (e) {
			if (typeof UI._dragSrcIdx !== 'number') return;
			e.preventDefault();
			try { e.dataTransfer.dropEffect = 'move'; } catch (err) {}
		});
		grid.addEventListener('drop', function (e) {
			if (typeof UI._dragSrcIdx !== 'number') return;
			var el = hit(e);
			if (!el) return;
			e.preventDefault();
			var targetIdx = idxOf(el);
			if (UI._dragSrcIdx !== targetIdx) {
				Selection.move(UI._dragSrcIdx, targetIdx, list);
				UI.renderMedia(kind);
			}
		});
	};

		UI._vlist = null;
	UI._destroyVirtualList = function () {
		if (UI._vlist && U.isFn(UI._vlist.destroy)) {
			try { UI._vlist.destroy(); } catch (e) { LOG.warn('销毁虚拟列表失败:', e); }
		}
		UI._vlist = null;
	};

	UI.renderMedia = function (kind) {
		if (kind !== 'img' && kind !== 'video' && kind !== 'audio' && kind !== 'm3u8') return;
		var _diagT0 = U.monoNow();
		if (typeof Diag !== 'undefined') Diag.stats.renderCount++;
		var box = document.getElementById('_ms_box');
		if (!box) return;
		var scrollTop = box.scrollTop;
		State._lastSelIdx = null;
		State._lastSelState = false;
		var c = UI.colors();
		var all = State.listFor(kind);

				var minKb = State.config.showMinSizeKB || 0;
		var maxKb = State.config.showMaxSizeKB || 0;
		var list = [];
		for (var i = 0; i < all.length; i++) {
			var u = all[i];
			if (minKb > 0 || maxKb > 0) {
				var meta = State.metaCache[u];
				if (meta && meta.size) {
					var kb = meta.size / 1024;
					if (minKb > 0 && kb < minKb) continue;
					if (maxKb > 0 && kb > maxKb) continue;
				}
			}
			list.push(u);
		}

				var kw = State.searchKeyword;
		var kwList = kw ? list.filter(function (u) { return u.toLowerCase().indexOf(kw) !== -1; }) : list;

				var vLinkList = [];
		if (kind === 'video') {
			vLinkList = kw ? State.videoLinks.filter(function(v) {
				if (!v || typeof v !== 'object') return false;
				var _vt = v.title == null ? '' : String(v.title).toLowerCase();
				var _vu = v.url == null ? '' : String(v.url).toLowerCase();
				return _vt.indexOf(kw) !== -1 || _vu.indexOf(kw) !== -1;
			}) : State.videoLinks.slice();
		}

		var icon = kind === 'img' ? MS_CONFIG.ICONS.image : kind === 'video' ? MS_CONFIG.ICONS.video : kind === 'audio' ? MS_CONFIG.ICONS.audio : MS_CONFIG.ICONS.stream;
		var label = kind === 'img' ? LANG.t('tabImg') : kind === 'video' ? LANG.t('tabVideo') : kind === 'audio' ? LANG.t('tabAudio') : LANG.t('tabM3u8');
		var total = all.length;
		var shown = kwList.length;
		var totalLinks = vLinkList.length;
		var isMobile = UI._isMobile();
		var btnPadding = isMobile ? '10px 14px' : '6px 10px';
		var btnFontSize = isMobile ? '13px' : '11px';
		var titleFontSize = isMobile ? '15px' : '13px';
		var topPadding = isMobile ? '12px 16px' : '10px 14px';

										UI._destroyVirtualList();

				var topHtml = '';
		topHtml += '<div style="padding:' + topPadding + ';font-size:' + titleFontSize + ';color:' + c.sub + ';border-bottom:1px solid ' + c.border + ';background:' + c.bg2 + ';">' +
			'<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">' +
				'<div><span style="font-size:' + (isMobile ? '18px' : '16px') + ';margin-right:4px;">' + icon + '</span><b style="color:' + c.txt + ';">' + label + '</b>：' + LANG.t('showing', {shown: shown, total: total}) + (totalLinks > 0 ? '<span style="display:inline-flex;align-items:center;">' + MS_CONFIG.ICONS.link + '</span> ' + totalLinks + ' 个页面链接' : '') + '</div>' +
				'<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
					'<button id="_ms_sel_all" style="padding:' + btnPadding + ';border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:' + btnFontSize + ';cursor:pointer;">' + LANG.t('btnSelAll') + '</button>' +
					'<button id="_ms_sel_none" style="padding:' + btnPadding + ';border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:' + btnFontSize + ';cursor:pointer;">' + LANG.t('btnSelNone') + '</button>' +
					'<button id="_ms_dl_sel" style="padding:' + btnPadding + ';border:none;border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:' + btnFontSize + ';font-weight:600;cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> ' + LANG.t('downloadSel') + '</button>' +
					'<button id="_ms_dl_all" style="padding:' + btnPadding + ';border:none;border-radius:8px;background:linear-gradient(135deg,#10b981,#34d399);color:#fff;font-size:' + btnFontSize + ';font-weight:600;cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> ' + LANG.t('downloadAll') + '</button>' +
					'<button id="_ms_copy_sel" style="padding:' + btnPadding + ';border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:' + btnFontSize + ';cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> ' + LANG.t('copySelUrl') + '</button>' +
					'<button id="_ms_copy_all" style="padding:' + btnPadding + ';border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:' + btnFontSize + ';cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> ' + LANG.t('copyAllUrl') + '</button>' +
					'<button id="_ms_show_filter" style="padding:' + btnPadding + ';border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:' + btnFontSize + ';cursor:pointer;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg> ' + LANG.t('filter') + '</button>' +
				'</div>' +
			'</div>' +
			'<div id="_ms_filter_panel" style="display:none;margin-top:10px;padding:10px;border-radius:8px;background:' + c.bg + ';border:1px solid ' + c.border + ';">' +
				'<div style="font-size:' + (isMobile ? '14px' : '12px') + ';color:' + c.txt + ';font-weight:600;margin-bottom:8px;">' + LANG.t('filterPanel') + '</div>' +
				'<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
					'<label style="font-size:' + (isMobile ? '13px' : '11px') + ';color:' + c.sub + ';">' + LANG.t('minKb') + '</label>' +
					'<input id="_ms_min_kb" type="number" value="' + minKb + '" min="0" style="width:' + (isMobile ? '100px' : '80px') + ';padding:' + (isMobile ? '8px' : '4px') + ';border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:' + (isMobile ? '14px' : '12px') + ';">' +
					'<label style="font-size:' + (isMobile ? '13px' : '11px') + ';color:' + c.sub + ';">' + LANG.t('maxKb') + '</label>' +
					'<input id="_ms_max_kb" type="number" value="' + maxKb + '" min="0" style="width:' + (isMobile ? '100px' : '80px') + ';padding:' + (isMobile ? '8px' : '4px') + ';border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:' + (isMobile ? '14px' : '12px') + ';">' +
					'<button id="_ms_apply_filter" style="padding:' + (isMobile ? '10px 16px' : '6px 12px') + ';border:none;border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:' + (isMobile ? '14px' : '12px') + ';cursor:pointer;">' + LANG.t('apply') + '</button>' +
					'<button id="_ms_reset_filter" style="padding:' + (isMobile ? '10px 16px' : '6px 12px') + ';border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:' + (isMobile ? '14px' : '12px') + ';cursor:pointer;">' + LANG.t('reset') + '</button>' +
				'</div>' +
			'</div>' +
		'</div>';
		box.innerHTML = topHtml;

				if (kind === 'video' && vLinkList.length > 0) {
			var vlinkSection = document.createElement('div');
			vlinkSection.style.cssText = 'border-bottom:1px solid ' + c.border + ';background:' + c.bg2 + ';';
			var headerHtml = '<div style="padding:8px 14px;font-size:' + (isMobile ? '14px' : '12px') + ';color:' + c.sub + ';font-weight:600;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">' +
				'<span>' + MS_CONFIG.ICONS.link + ' 视频页面链接（点击解析获取下载地址）</span>' +
				'<button id="_ms_batch_resolve" style="padding:' + (isMobile ? '10px 16px' : '6px 12px') + ';border:none;border-radius:8px;background:linear-gradient(135deg,#8b5cf6,#a855f7);color:#fff;font-size:' + (isMobile ? '14px' : '11px') + ';font-weight:600;cursor:pointer;flex-shrink:0;">' + MS_CONFIG.ICONS.refresh + ' ' + LANG.t('btnBatchResolve') + '</button>' +
				'</div>' +
				'<div id="_ms_batch_progress" style="display:none;padding:0 14px 10px;">' +
					'<div style="display:flex;align-items:center;justify-content:space-between;font-size:' + (isMobile ? '13px' : '11px') + ';color:' + c.txt + ';margin-bottom:6px;">' +
						'<span id="_ms_batch_progress_text">已解析 0/0，成功 0，失败 0</span>' +
						'<span id="_ms_batch_progress_pct">0%</span>' +
					'</div>' +
					'<div style="width:100%;height:' + (isMobile ? '10px' : '6px') + ';background:' + c.bg3 + ';border-radius:3px;overflow:hidden;">' +
						'<div id="_ms_batch_progress_bar" style="width:0%;height:100%;background:linear-gradient(90deg,#8b5cf6,#a855f7);transition:width 0.3s ease;border-radius:3px;"></div>' +
					'</div>' +
				'</div>';
			vlinkSection.innerHTML = headerHtml;
			var vlinkGrid = document.createElement('div');
			UI._bindMediaThumbFallback(vlinkGrid);
			var cardMinWidth = isMobile ? '100%' : 'minmax(160px,1fr)';
			var vlinkGridCols = isMobile ? 'grid-template-columns:1fr;' : 'grid-template-columns:repeat(auto-fill,minmax(160px,1fr));';
			var coverHeight = isMobile ? '200px' : '90px';
			var titleFontSize = isMobile ? '15px' : '12px';
			var titleHeight = isMobile ? '44px' : '32px';
			var metaFontSize = isMobile ? '13px' : '10px';
			var cardPadding = isMobile ? '10px 12px' : '6px 8px';
			var gridPadding = isMobile ? 'padding:0 12px 12px;' : 'padding:0 10px 10px;';
			var vlinkGridGap = isMobile ? 'gap:12px;' : 'gap:8px;';
			vlinkGrid.style.cssText = 'display:grid;' + vlinkGridCols + vlinkGridGap + gridPadding;
			var longPressTimer = null;
			var longPressTriggered = false;
			function showVlinkContextMenu(vData, card, x, y) {
				var c = UI.colors();
				var menu = document.createElement('div');
				menu.className = '_ms_vlink_ctx_menu';
				var menuW = Math.min(220, window.innerWidth - 20);
				var mx = Math.min(Math.max(10, x - menuW / 2), window.innerWidth - menuW - 10);
				var my = Math.min(Math.max(10, y), window.innerHeight - 260);
				menu.style.cssText = 'position:fixed;left:' + mx + 'px;top:' + my + 'px;z-index:2147483648;background:' + c.bg + ';border:1px solid ' + c.border + ';border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.35);padding:6px;min-width:' + menuW + 'px;';
				var items = [
					{ icon: MS_CONFIG.ICONS.arrowRight, label: '预览视频', action: function() { VideoPreview.preview(vData.url); } },
					{ icon: MS_CONFIG.ICONS.copy, label: '复制链接', action: function() { copyText(vData.url); } },
					{ icon: MS_CONFIG.ICONS.download, label: '下载视频', action: function() { VideoPreview.preview(vData.url); } },
					{ icon: MS_CONFIG.ICONS.link, label: '打开原网页', action: function() { window.open(vData.url, '_blank'); } },
				];
				for (var mi = 0; mi < items.length; mi++) {
					(function(item) {
						var btn = document.createElement('div');
						btn.style.cssText = 'display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:8px;cursor:pointer;font-size:14px;color:' + c.txt + ';';
						btn.innerHTML = '<span style="font-size:18px;">' + item.icon + '</span><span>' + item.label + '</span>';
						btn.addEventListener('click', function(e) {
							e.stopPropagation();
							menu.remove();
							try { item.action(); } catch (e2) {}
						});
						btn.addEventListener('touchstart', function() { this.style.background = c.bg3; }, { passive: true });
						btn.addEventListener('touchend', function() { this.style.background = 'transparent'; }, { passive: true });
						menu.appendChild(btn);
					})(items[mi]);
				}
				var closeMenu = function(e) {
					if (e.target !== menu && !menu.contains(e.target)) {
						menu.remove();
						document.removeEventListener('click', closeMenu, true);
						document.removeEventListener('touchstart', closeMenu, true);
					}
				};
				setTimeout(function() {
					document.addEventListener('click', closeMenu, true);
					document.addEventListener('touchstart', closeMenu, true);
				}, 50);
				document.body.appendChild(menu);
			}
			for (var vi = 0; vi < vLinkList.length; vi++) {
				var vItem = vLinkList[vi];
				if (!vItem || typeof vItem !== 'object' || !vItem.url) continue;
				var vCard = document.createElement('div');
				vCard.setAttribute('data-vlink', vItem.url);
				vCard.style.cssText = 'background:' + c.bg + ';border:1px solid ' + c.border + ';border-radius:10px;overflow:hidden;cursor:pointer;transition:transform 0.15s, box-shadow 0.15s, background-color .35s ease, color .35s ease, border-color .35s ease;touch-action:manipulation;-webkit-tap-highlight-color:transparent;';
				vCard.onmouseenter = function() { this.style.transform = 'translateY(-2px)'; this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; };
				vCard.onmouseleave = function() { this.style.transform = 'translateY(0)'; this.style.boxShadow = 'none'; };
				vCard.addEventListener('touchstart', function() { this.style.transform = 'scale(0.96)'; }, { passive: true });
				vCard.addEventListener('touchend', function() { var self = this; setTimeout(function() { self.style.transform = 'scale(1)'; }, 100); }, { passive: true });
				vCard.addEventListener('touchcancel', function() { this.style.transform = 'scale(1)'; }, { passive: true });
				var vCoverHtml;
				if (vItem.cover) {
																																			vCoverHtml = '<img src="' + SEC.escapeAttr(vItem.cover) + '" loading="lazy" data-ms-thumb="vlink" style="width:100%;height:' + coverHeight + ';object-fit:cover;display:block;">';
				} else {
					var iconSize = isMobile ? '36px' : '24px';
					vCoverHtml = '<div style="width:100%;height:' + coverHeight + ';background:linear-gradient(135deg,#1e293b,#334155);display:flex;align-items:center;justify-content:center;color:#fff;font-size:' + iconSize + ';"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg></div>';
				}
				var isResolved = UI._vlinkResolved[vItem.url];
				var resolveBtnText = isResolved ? '已解析' : '解析';
				var resolveBtnColor = isResolved ? '#10b981' : '#8b5cf6';
				vCard.innerHTML = vCoverHtml +
					'<div style="padding:' + cardPadding + ';">' +
																		'<div style="font-size:' + titleFontSize + ';color:' + c.txt + ';line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;height:' + titleHeight + ';">' + SEC.escapeHtml(vItem.title) + '</div>' +
						'<div style="font-size:' + metaFontSize + ';color:' + c.sub + ';margin-top:6px;display:flex;align-items:center;justify-content:space-between;">' +
							'<span>' + vItem.siteIcon + ' ' + SEC.escapeHtml(vItem.siteName) + '</span>' +
							'<span class="_ms_resolve_btn" style="color:' + resolveBtnColor + ';font-weight:600;">' + resolveBtnText + '</span>' +
						'</div>' +
					'</div>';
				(function(vData, card) {
					var lpTimer = null;
					var lpTriggered = false;
					var lpStartX = 0, lpStartY = 0;
					function lpStart(e) {
						lpTriggered = false;
						var t = e.touches ? e.touches[0] : e;
						lpStartX = t.clientX;
						lpStartY = t.clientY;
						lpTimer = setTimeout(function() {
							lpTriggered = true;
							if (navigator.vibrate) { try { navigator.vibrate(50); } catch (e2) {} }
							showVlinkContextMenu(vData, card, lpStartX, lpStartY);
						}, 500);
					}
					function lpMove(e) {
						if (!lpTimer) return;
						var t = e.touches ? e.touches[0] : e;
						if (Math.abs(t.clientX - lpStartX) > 10 || Math.abs(t.clientY - lpStartY) > 10) {
							clearTimeout(lpTimer);
							lpTimer = null;
						}
					}
					function lpEnd() {
						if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
					}
					card.addEventListener('touchstart', lpStart, { passive: true });
					card.addEventListener('touchmove', lpMove, { passive: true });
					card.addEventListener('touchend', lpEnd);
					card.addEventListener('touchcancel', lpEnd);
					card.addEventListener('click', function() {
						if (lpTriggered) { lpTriggered = false; return; }
						VideoPreview.preview(vData.url);
					});
				})(vItem, vCard);
				vlinkGrid.appendChild(vCard);
			}
			vlinkSection.appendChild(vlinkGrid);
			box.appendChild(vlinkSection);

			setTimeout(function() {
				UI._observeVlinkCards(vlinkSection);
			}, 50);

			var batchBtn = document.getElementById('_ms_batch_resolve');
			if (batchBtn) {
				batchBtn.addEventListener('click', function() {
					var progressDiv = document.getElementById('_ms_batch_progress');
					var progressBar = document.getElementById('_ms_batch_progress_bar');
					var progressText = document.getElementById('_ms_batch_progress_text');
					var progressPct = document.getElementById('_ms_batch_progress_pct');
					if (progressDiv) progressDiv.style.display = 'block';
					batchBtn.disabled = true;
					batchBtn.style.opacity = '0.6';
					batchBtn.style.cursor = 'not-allowed';
					batchBtn.innerHTML = MS_CONFIG.ICONS.hourglass + ' 解析中...';
					UI.batchResolveVlinks(vLinkList, function(completed, total, successCount, failedCount) {
						var pct = total > 0 ? (completed / total * 100) : 0;
						if (progressBar) progressBar.style.width = pct.toFixed(1) + '%';
						if (progressText) progressText.textContent = '已解析 ' + completed + '/' + total + '，成功 ' + successCount + '，失败 ' + failedCount;
						if (progressPct) progressPct.textContent = pct.toFixed(0) + '%';
					}, function(total, successCount, failedCount) {
						batchBtn.disabled = false;
						batchBtn.style.opacity = '1';
						batchBtn.style.cursor = 'pointer';
						batchBtn.innerHTML = MS_CONFIG.ICONS.refresh + ' 一键解析全部';
						toast('批量解析完成：成功 ' + successCount + '，失败 ' + failedCount, '#10b981');
					});
				});
			}
		}

		if (total === 0 && vLinkList.length === 0) {
			box.innerHTML += '<div style="padding:60px 20px;text-align:center;color:' + c.sub + ';font-size:14px;">' + LANG.t('noMedia') + '</div>';
			UI.renderFooter(kind, []);
			bindFilterButtons(kind);
			bindActionButtons(kind, []);
			requestAnimationFrame(function () { box.scrollTop = scrollTop; });
			return;
		}
		if (shown === 0 && (minKb > 0 || maxKb > 0 || kw)) {
			box.innerHTML += '<div style="padding:40px 20px;text-align:center;color:' + c.warn + ';font-size:13px;">' + LANG.t('filterNoMatch') + '</div>';
			UI.renderFooter(kind, []);
			bindFilterButtons(kind);
			bindActionButtons(kind, []);
			requestAnimationFrame(function () { box.scrollTop = scrollTop; });
			return;
		}

				var useVirtual = kwList.length > 100;
		var container = document.createElement('div');
		container.style.cssText = 'flex:1;overflow-y:auto;position:relative;';
		box.appendChild(container);

				var mediaGridGap = isMobile ? 10 : 8;
		var mediaGridPad = isMobile ? 12 : 10;
		var mediaGridCols = isMobile ? 2 : 0; 
				var gridTitleBlock = isMobile ? (8 * 2 + 56 + 2) : (6 * 2 + 48 + 2);

		if (useVirtual) {
						UI._vlist = UI.VirtualList(container, kwList, function (url, idx) {
				return UI._renderMediaCard(url, idx, kind);
			}, {
				columns: mediaGridCols,
				minCardWidth: 120,
				gap: mediaGridGap,
				padding: mediaGridPad,
				titleBlock: gridTitleBlock,
				overscan: 4,
				fallbackWidth: isMobile ? 360 : 420,
								scrollParent: box
			});
		} else {
			var grid = document.createElement('div');
			var mediaGridColsCss = isMobile ? 'grid-template-columns:repeat(2,1fr);' : 'grid-template-columns:repeat(auto-fill,minmax(120px,1fr));';
			var mediaGridGapCss = 'gap:' + mediaGridGap + 'px;';
			var mediaGridPadCss = 'padding:' + mediaGridPad + 'px;';
			grid.style.cssText = 'display:grid;' + mediaGridColsCss + mediaGridGapCss + mediaGridPadCss;
						var cardsHtml = '';
			for (var i = 0; i < kwList.length; i++) cardsHtml += UI._renderMediaCard(kwList[i], i, kind);
			grid.innerHTML = cardsHtml;
			container.appendChild(grid);
		}
		UI._bindMediaGrid(container, kind, kwList);
		UI._bindCardLongPress(container);

		UI.renderFooter(kind, kwList);
		bindFilterButtons(kind);
		bindActionButtons(kind, kwList);
		requestAnimationFrame(function () {
			box.scrollTop = scrollTop;
																		if (UI._vlist && UI._vlist.update) UI._vlist.update(true);
		});

														function rebindBoxScroll(key, handler) {
			var prev = UI[key];
			if (prev) { try { box.removeEventListener('scroll', prev); } catch (e) {} }
			UI[key] = handler;
			box.addEventListener('scroll', handler, { passive: true });
		}

										['_thumbScrollHandler', '_vlinkScrollHandler'].forEach(function (k) {
			var prev = UI[k];
			if (prev) { try { box.removeEventListener('scroll', prev); } catch (e) {} }
			UI[k] = null;
		});
		if (UI._thumbScrollTimer) { clearTimeout(UI._thumbScrollTimer); UI._thumbScrollTimer = null; }
		if (UI._vlinkScrollTimer) { clearTimeout(UI._vlinkScrollTimer); UI._vlinkScrollTimer = null; }

		if (kind === 'video' && State.config.autoExtractThumb) {
			setTimeout(function () { UI._loadVisibleVideoThumbs(container); }, 100);
			rebindBoxScroll('_thumbScrollHandler', function () {
				clearTimeout(UI._thumbScrollTimer);
				UI._thumbScrollTimer = setTimeout(function () { UI._loadVisibleVideoThumbs(container); }, 200);
			});
		}

		if (kind === 'video' && vLinkList.length > 0) {
			rebindBoxScroll('_vlinkScrollHandler', function () {
				UI._onVlinkScrollStart();
				clearTimeout(UI._vlinkScrollTimer);
				UI._vlinkScrollTimer = setTimeout(function () {
					UI._onVlinkScrollEnd();
				}, 150);
			});
		}

		if (typeof Diag !== 'undefined') Diag.stats.renderLastMs = Math.round(U.monoNow() - _diagT0);

		requestAnimationFrame(function () {
			box.scrollTop = scrollTop;
		});
	};

		function bindFilterButtons(kind) {
		try {
			var showBtn = document.getElementById('_ms_show_filter');
			if (showBtn) showBtn.onclick = function () {
				var p = document.getElementById('_ms_filter_panel');
				if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
			};
			var applyBtn = document.getElementById('_ms_apply_filter');
			if (applyBtn) applyBtn.onclick = function () {
				var minEl = document.getElementById('_ms_min_kb');
				var maxEl = document.getElementById('_ms_max_kb');
				var minV = minEl ? parseInt(minEl.value, 10) || 0 : 0;
				var maxV = maxEl ? parseInt(maxEl.value, 10) || 0 : 0;
				State.config.showMinSizeKB = minV;
				State.config.showMaxSizeKB = maxV;
				State.save();
				toast(LANG.t('filterAppliedToast'));
				UI.renderMedia(kind);
			};
			var resetBtn = document.getElementById('_ms_reset_filter');
			if (resetBtn) resetBtn.onclick = function () {
				State.config.showMinSizeKB = 0;
				State.config.showMaxSizeKB = 0;
				State.save();
				UI.renderMedia(kind);
			};
		} catch (e) {}
	}

		function bindActionButtons(kind, list) {
		try {
			var selAll = document.getElementById('_ms_sel_all');
			if (selAll) selAll.onclick = function () {
				for (var i = 0; i < list.length; i++) State.selected.add(list[i]);
				UI.renderMedia(kind);
			};
			var selNone = document.getElementById('_ms_sel_none');
			if (selNone) selNone.onclick = function () {
				State.selected.clear();
				UI.renderMedia(kind);
			};
			var dlSel = document.getElementById('_ms_dl_sel');
			if (dlSel) dlSel.onclick = function () {
				var selArr = [];
				for (var i = 0; i < list.length; i++) if (State.selected.has(list[i])) selArr.push(list[i]);
				if (selArr.length === 0) { toast(LANG.t('noSelFile'), '#ef4444'); return; }
				if (!confirm(LANG.t('confirmDlSel', {n: selArr.length}))) return;
				toast(LANG.t('startDlToast', {n: selArr.length}));
				Dl.batch(selArr, kind, null, null);
			};
			var dlAll = document.getElementById('_ms_dl_all');
			if (dlAll) dlAll.onclick = function () {
				if (!list || list.length === 0) { toast(LANG.t('noDlFile'), '#ef4444'); return; }
				if (!confirm(LANG.t('confirmDlAll', {n: list.length}))) return;
				toast(LANG.t('startDlToast', {n: list.length}));
				Dl.batch(list, kind, null, null);
			};
			var cpSel = document.getElementById('_ms_copy_sel');
			if (cpSel) cpSel.onclick = function () {
				var text = '';
				for (var i = 0; i < list.length; i++) if (State.selected.has(list[i])) text += list[i] + '\n';
				if (!text) { toast(LANG.t('noSelFile'), '#ef4444'); return; }
				copyText(text.trim());
			};
			var cpAll = document.getElementById('_ms_copy_all');
			if (cpAll) cpAll.onclick = function () {
				if (!list || list.length === 0) { toast(LANG.t('noCopyUrl'), '#ef4444'); return; }
				copyText(list.join('\n'));
			};
		} catch (e) {}
	}

	UI.locateResource = function (url, kind) {
		if (!url) return;
		var tab = kind === 'image' ? 'img' : kind === 'stream' ? 'video' : kind;
		UI.openPanel();
		UI.switchTab(tab);
		setTimeout(function () {
			var box = document.getElementById('_ms_box');
			if (!box) return;
			var target;
			if (kind === 'stream') {
				target = box.querySelector('[data-vlink="' + U.cssEscape(url) + '"]');
			} else if (kind === 'm3u8') {
				target = box.querySelector('[data-url="' + U.cssEscape(url) + '"]');
			} else {
				target = box.querySelector('[data-url="' + U.cssEscape(url) + '"]');
			}
			if (target) {
				target.scrollIntoView({ behavior: 'smooth', block: 'center' });
				target.style.transition = 'box-shadow .3s';
																				var ring = '0 0 0 3px ' + MS_CONFIG.COLORS.primary;
				try { target.style.setProperty('box-shadow', ring, 'important'); }
				catch (eRing) { target.style.boxShadow = ring; }
				setTimeout(function () {
					try { target.style.removeProperty('box-shadow'); } catch (eRing2) { target.style.boxShadow = ''; }
				}, 1500);
			}
		}, 120);
	};

	UI._renderMediaCard = function (url, idx, kind) {
		return MS_FACTORY.mediaCardHtml(url, idx, kind);
	};
	UI.renderM3u8 = function () {
		var box = document.getElementById('_ms_box');
		if (!box) return;
		var c = UI.colors();
		var list = State.m3u8;
		var kw = State.searchKeyword;
		if (kw) list = list.filter(function (u) { return u.toLowerCase().indexOf(kw) !== -1; });

		box.innerHTML = '<div style="padding:10px 14px;font-size:13px;color:' + c.sub + ';border-bottom:1px solid ' + c.border + ';background:' + c.bg2 + ';">' + MS_CONFIG.ICONS.stream + ' ' + LANG.t('m3u8Title', {n: list.length}) + '</div>';

		if (list.length === 0) {
			box.innerHTML += '<div style="padding:60px 20px;text-align:center;color:' + c.sub + ';font-size:14px;">' + LANG.t('noM3u8') + '</div>';
			UI.renderFooter('m3u8', []);
			return;
		}

				var container = document.createElement('div');
		container.style.cssText = 'padding:10px;';
		for (var i = 0; i < list.length; i++) {
			var url = list[i];
			var item = document.createElement('div');
			item.setAttribute('data-url', url);
			item.style.cssText = 'padding:12px;border-radius:10px;background:' + c.bg2 + ';border:1px solid ' + c.border + ';margin-bottom:8px;';
			item.innerHTML = '<div style="font-size:13px;font-weight:600;color:' + c.txt + ';margin-bottom:6px;word-break:break-all;">' + SEC.escapeHtml(U.trunc(url, 60)) + '</div>' +
				'<div style="font-size:11px;color:' + c.sub + ';margin-bottom:8px;">' + SEC.escapeHtml(SEC.nameFromUrl(url)) + '</div>' +
				'<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
				'<button data-op="download" data-url="' + SEC.escapeAttr(url) + '" style="padding:8px 12px;border:none;border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:12px;font-weight:600;cursor:pointer;flex:1;">' + MS_CONFIG.ICONS.arrowDown + ' ' + LANG.t('dlMerge') + '</button>' +
				'<button data-op="preview" data-url="' + SEC.escapeAttr(url) + '" style="padding:8px 12px;border:none;border-radius:8px;background:linear-gradient(135deg,#0ea5e9,#6366f1);color:#fff;font-size:12px;font-weight:600;cursor:pointer;flex:1;">' + LANG.t('preview') + '</button>' +
				'<button data-op="script" data-url="' + SEC.escapeAttr(url) + '" style="padding:8px 12px;border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:12px;font-weight:600;cursor:pointer;flex:1;">' + MS_CONFIG.ICONS.edit + ' ' + LANG.t('genScriptBtn') + '</button>' +
				'<button data-op="detail" data-url="' + SEC.escapeAttr(url) + '" style="padding:8px 12px;border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:12px;font-weight:600;cursor:pointer;">' + LANG.t('detailBtn') + '</button>' +
				'</div>';
						var btns = item.querySelectorAll('button');
			for (var j = 0; j < btns.length; j++) {
				btns[j].addEventListener('click', function (e) {
					var op = this.getAttribute('data-op');
					var u = this.getAttribute('data-url');
					if (op === 'download') {
						toast(LANG.t('m3u8Start'));
						M3U8.downloadAndMerge(u, { quality: State.config.m3u8Quality, concurrency: State.config.m3u8Concurrency },
							function (done, total, failed) { toast(LANG.t('m3u8Progress', {d: done, t: total}), '#6366f1'); },
							function (data, err) {
								if (err) toast(LANG.t('m3u8Fail') + ': ' + err, '#ef4444');
								else {
									var blob = new Blob([data], { type: 'video/mp2t' });
									var blobUrl = URL.createObjectURL(blob);
									var name = SEC.safeFilename(SEC.nameFromUrl(u)) + '.mp4';
									Dl.fallback(blobUrl, name, null);
									toast(LANG.t('m3u8Done'));
								}
							}
						);
					} else if (op === 'preview') {
						UI.previewMedia(u, 'm3u8');
					} else if (op === 'script') {
						var script = M3U8.generateDownloadScript(u, 'aria2');
						copyText(script);
						toast(LANG.t('scriptCopied'));
					} else if (op === 'detail') {
						UI.previewM3u8(u);
					}
				});
			}
			container.appendChild(item);
		}
		box.appendChild(container);
		UI.renderFooter('m3u8', list);
	};

		UI._findStreamElement = function (url) {
		try {
			if (State.streamMap) {
				for (var sid in State.streamMap) {
					if (!State.streamMap.hasOwnProperty(sid)) continue;
					var el = State.streamMap[sid];
					if (el && el.srcObject && typeof MediaStream !== 'undefined' && el.srcObject instanceof MediaStream) {
						return { id: sid, el: el };
					}
				}
			}
			var videos = document.querySelectorAll('video[data-ms-srcobject="1"]');
			for (var i = 0; i < videos.length; i++) {
				var ve = videos[i];
				if (ve.srcObject && typeof MediaStream !== 'undefined' && ve.srcObject instanceof MediaStream) {
					return { id: ve.getAttribute('data-ms-stream-id') || '', el: ve };
				}
			}
		} catch (e) {}
		return null;
	};
	UI.previewM3u8 = function (url) {
		try {
			var c = UI.colors();
			var overlay = document.createElement('div');
			overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:2147483650;padding:20px;';
			var modal = document.createElement('div');
			modal.style.cssText = 'max-width:600px;width:100%;background:' + c.bg + ';color:' + c.txt + ';border-radius:16px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.5);';

			modal.innerHTML = '<div style="font-size:16px;font-weight:700;margin-bottom:12px;">' + MS_CONFIG.ICONS.stream + ' ' + LANG.t('m3u8Detail') + '</div>' +
				'<div style="background:' + c.bg2 + ';padding:12px;border-radius:10px;font-size:12px;color:' + c.sub + ';word-break:break-all;margin-bottom:16px;font-family:monospace;">' + SEC.escapeHtml(url) + '</div>' + 
				'<div id="_ms_m3u8_info" style="padding:16px;background:' + c.bg2 + ';border-radius:10px;margin-bottom:16px;">' + LANG.t('parsing') + '</div>' +
				'<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
				'<button id="_ms_m3u8_dl" style="flex:1;min-width:120px;padding:12px;border:none;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:14px;font-weight:600;cursor:pointer;">' + MS_CONFIG.ICONS.arrowDown + ' ' + LANG.t('dlMerge') + '</button>' +
				'<button id="_ms_m3u8_script" style="flex:1;min-width:120px;padding:12px;border:none;border-radius:10px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:14px;font-weight:600;cursor:pointer;">' + MS_CONFIG.ICONS.edit + ' ' + LANG.t('genScriptBtn') + '</button>' +
				'<button id="_ms_m3u8_close" style="padding:12px 20px;border:none;border-radius:10px;background:#475569;color:#fff;font-size:14px;font-weight:600;cursor:pointer;">' + LANG.t('close') + '</button>' +
				'</div>';

			function closeM3u8Overlay() {
				try { xhr.abort(); } catch(e) {}
				if (overlay.parentNode) overlay.remove();
				document.removeEventListener('keydown', escM3u8);
			}
			function escM3u8(e) { if (e.key === 'Escape') closeM3u8Overlay(); }
			overlay.appendChild(modal);
			overlay.addEventListener('click', function (e) { if (e.target === overlay) closeM3u8Overlay(); });
			document.addEventListener('keydown', escM3u8);
			(document.documentElement || document.body).appendChild(overlay);

						var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.timeout = 15000;
			xhr.onload = function () {
				if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText) {
					var parsed = M3U8.parse(xhr.responseText, url);
					var info = document.getElementById('_ms_m3u8_info');
					if (info) {
						var html = '<div style="font-size:13px;color:' + c.txt + ';margin-bottom:8px;">' + LANG.t('parseResult') + '</div>';
						if (parsed.isMaster) {
							html += '<div style="font-size:12px;color:' + c.sub + ';">' + LANG.t('masterStreams', {n: parsed.streams.length}) + '</div>';
							for (var i = 0; i < parsed.streams.length; i++) {
								html += '<div style="padding:8px 10px;margin:4px 0;background:' + c.bg + ';border-radius:6px;font-size:12px;color:' + c.txt + ';">' +
									
									'<b>' + SEC.escapeHtml(parsed.streams[i].label) + '</b> · ' + SEC.escapeHtml(parsed.streams[i].resolution) + ' · ' + U.formatSize(parsed.streams[i].bandwidth) + '/s' +
									'</div>';
							}
						} else {
							html += '<div style="font-size:12px;color:' + c.sub + ';">' + LANG.t('segmentsInfo', {n: parsed.segments.length, t: U.formatTime(parsed.duration)}) + '</div>';
							html += '<div style="font-size:12px;color:' + (parsed.encrypted ? '#ef4444' : '#10b981') + ';margin-top:6px;">' + (parsed.encrypted ? (MS_CONFIG.ICONS.lock + ' ' + LANG.t('encrypted')) : LANG.t('notEncrypted')) + (parsed.encrypted ? ' (' + SEC.escapeHtml(parsed.keyMethod) + ')' : '') + '</div>';
						}
						info.innerHTML = html;
					}
				}
			};
			xhr.onerror = function () { var info = document.getElementById('_ms_m3u8_info'); if (info) info.innerHTML = '<div style="color:#ef4444;">' + LANG.t('parseFailNet') + '</div>'; };
			xhr.ontimeout = function () { var info = document.getElementById('_ms_m3u8_info'); if (info) info.innerHTML = '<div style="color:#ef4444;">' + LANG.t('parseFailTimeout') + '</div>'; };
			xhr.send();

						document.getElementById('_ms_m3u8_dl').addEventListener('click', function () {
				toast(LANG.t('startDl'));
				M3U8.downloadAndMerge(url, { quality: State.config.m3u8Quality }, null, function (data, err) {
															if (err) toast(LANG.t('m3u8Fail') + ': ' + err, '#ef4444');
					else {
						var blob = new Blob([data], { type: 'video/mp2t' });
						Dl.fallback(URL.createObjectURL(blob), SEC.safeFilename(SEC.nameFromUrl(url)) + '.mp4', null);
						toast(LANG.t('done'));
						closeM3u8Overlay();
					}
				});
			});
			document.getElementById('_ms_m3u8_script').addEventListener('click', function () {
				copyText(M3U8.generateDownloadScript(url, 'aria2'));
				toast(LANG.t('scriptCopied'));
			});
			document.getElementById('_ms_m3u8_close').addEventListener('click', closeM3u8Overlay);
		} catch (e) { toast(LANG.t('previewFail') + ': ' + e.message, '#ef4444'); }
	};
	UI.previewMedia = function (url, kind) {
		try {
			var c = UI.colors();
			var overlay = document.createElement('div');
			overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:2147483650;padding:20px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);';
			var modal = document.createElement('div');
			modal.style.cssText = 'max-width:min(92vw,900px);max-height:92vh;background:' + c.bg + ';color:' + c.txt + ';border-radius:18px;padding:18px;box-shadow:0 30px 80px rgba(0,0,0,.6);overflow:auto;animation:msfade .2s ease-out;';

						var hlsInstance = null;
			function cleanupPreview() {
				if (hlsInstance) { try { hlsInstance.destroy(); } catch(e) {} hlsInstance = null; }
			}

						var header = document.createElement('div');
			header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:10px;';
			var title = document.createElement('div');
			title.style.cssText = 'flex:1;font-size:14px;font-weight:700;word-break:break-all;line-height:1.4;';
			title.textContent = U.trunc(SEC.nameFromUrl(url) || url, 60);
			var closeBtn = document.createElement('button');
			closeBtn.innerHTML = MS_CONFIG.ICONS.cross;
			closeBtn.style.cssText = 'border:none;background:' + c.bg3 + ';color:' + c.txt + ';font-size:16px;width:34px;height:34px;border-radius:50%;cursor:pointer;flex-shrink:0;';
			function closePreviewOverlay() {
				cleanupPreview();
				try { overlay.remove(); } catch(e) {}
				document.removeEventListener('keydown', prevKeyHandler);
			}
			closeBtn.onclick = closePreviewOverlay;
			header.appendChild(title);
			header.appendChild(closeBtn);
			modal.appendChild(header);

						var mediaBox = document.createElement('div');
			mediaBox.style.cssText = 'margin-bottom:12px;border-radius:12px;overflow:hidden;background:' + c.bg2 + ';';

			if (kind === 'img') {
				var img = document.createElement('img');
				img.src = url; img.style.cssText = 'max-width:100%;max-height:65vh;display:block;margin:0 auto;border-radius:8px;';
				mediaBox.appendChild(img);
			} else if (kind === 'video') {
				var v = document.createElement('video');
				v.src = url; v.controls = true; v.autoplay = false;
				v.style.cssText = 'max-width:100%;max-height:65vh;display:block;margin:0 auto;border-radius:8px;background:#000;min-height:180px;';
				v.setAttribute('playsinline', '');
				var cachedPoster = UI._thumbCache[url];
				var isLiveDetected = false;
				var liveStreamEl = null;
				var liveBadge = document.createElement('div');
				liveBadge.textContent = '直播中 / LIVE';
				liveBadge.style.cssText = 'position:absolute;top:10px;left:10px;z-index:3;background:rgba(239,68,68,.92);color:#fff;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;pointer-events:none;display:none;';
				mediaBox.style.position = 'relative';
				mediaBox.appendChild(liveBadge);
				function detectLive() {
					if (isLiveDetected) return;
					try {
						if (v.duration === Infinity || v.duration === Number.POSITIVE_INFINITY) isLiveDetected = true;
					} catch (e) {}
					var found = UI._findStreamElement(url);
					if (found && found.el) {
						liveStreamEl = found.el;
						isLiveDetected = true;
					}
					if (isLiveDetected) {
						liveBadge.style.display = 'block';
						for (var mi = metaInfo.length - 1; mi >= 0; mi--) {
							if (metaInfo[mi].indexOf(LANG.t('duration')) === 0) metaInfo.splice(mi, 1);
						}
						updateMeta();
					}
				}
				if (cachedPoster) {
					v.poster = cachedPoster;
				} else {
					v.addEventListener('loadeddata', function() {
						try {
							v.currentTime = Math.min(1, (v.duration || 2) / 4);
							v.pause();
						} catch(e) {}
					});
										UI._extractVideoThumb(url, function(dataUrl) {
						try { v.poster = dataUrl; } catch(e) {}
					});
				}
				v.addEventListener('loadedmetadata', detectLive);
				setTimeout(detectLive, 100);
				mediaBox.appendChild(v);
			} else if (kind === 'audio') {
				var a = document.createElement('audio');
				a.src = url; a.controls = true; a.style.cssText = 'width:100%;padding:30px 20px;border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);';
				mediaBox.appendChild(a);
			} else if (kind === 'm3u8') {
				var v = document.createElement('video');
				v.controls = true; v.autoplay = false; v.volume = 0.8;
				v.setAttribute('playsinline', '');
				v.style.cssText = 'max-width:100%;max-height:65vh;display:block;margin:0 auto;border-radius:8px;background:#000;min-height:180px;';
				mediaBox.appendChild(v);

																				var HlsLib = null;
				function pickHls() {
					try {
						if (typeof window !== 'undefined' && window.Hls && window.Hls.isSupported) { HlsLib = window.Hls; return HlsLib; }
					} catch (e0) {}
										try { if (typeof Hls !== 'undefined' && Hls && Hls.isSupported) { HlsLib = Hls; return HlsLib; } } catch (e1) {}
					return null;
				}

				function initHls() {
					var lib = pickHls();
					if (lib) {
						hlsInstance = new lib({
							xhrSetup: function(xhr, u) {
								xhr.setRequestHeader('Referer', window.location.href);
								xhr.setRequestHeader('User-Agent', navigator.userAgent);
							}
						});
						hlsInstance.loadSource(url);
						hlsInstance.attachMedia(v);
						hlsInstance.on(lib.Events.ERROR, function(event, data) {
							if (data.fatal) {
								toast(LANG.t('previewFail') + ': ' + (data.details || 'HLS error'), '#ef4444');
							}
						});
					} else {
						mediaBox.innerHTML = '<div style="padding:30px;text-align:center;color:#ef4444;">' + LANG.t('previewFail') + ': HLS not supported</div>';
					}
				}

				if (v.canPlayType('application/vnd.apple.mpegurl')) {
					v.src = url;
				} else if (pickHls()) {
															initHls();
				} else {
					var hlsScript = document.createElement('script');
																									hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';
					hlsScript.async = true;
										hlsScript.onload = initHls;
					hlsScript.onerror = function() {
						mediaBox.innerHTML = '<div style="padding:30px;text-align:center;color:#ef4444;">' + LANG.t('previewFail') + ': hls.js load failed</div>';
					};
					document.head.appendChild(hlsScript);
				}
			} else {
				mediaBox.textContent = LANG.t('m3u8PreviewHint');
				mediaBox.style.cssText += 'padding:30px;text-align:center;';
			}
			modal.appendChild(mediaBox);

						var urlBox = document.createElement('div');
			urlBox.style.cssText = 'background:' + c.bg2 + ';padding:10px 12px;border-radius:10px;font-size:11px;color:' + c.sub + ';word-break:break-all;margin-bottom:10px;font-family:SF Mono,Consolas,monospace;line-height:1.5;';
			urlBox.textContent = url;
			modal.appendChild(urlBox);

						var metaBox = document.createElement('div');
			metaBox.style.cssText = 'background:' + c.bg2 + ';padding:10px 12px;border-radius:10px;font-size:12px;color:' + c.sub + ';margin-bottom:12px;line-height:1.7;';
			metaBox.innerHTML = '<span style="color:' + c.txt + ';">' + LANG.t('loadingMeta') + '</span>';
			modal.appendChild(metaBox);

						var metaInfo = [];
			function updateMeta() {
				if (metaInfo.length > 0) metaBox.innerHTML = metaInfo.join(' · ');
			}
			if (kind === 'img') {
				Meta.fetchImageSize(url, function (w, h, err) {
					if (w) metaInfo.push(LANG.t('size') + ': ' + w + ' × ' + h + 'px');
					updateMeta();
				});
			} else if (kind === 'video') {
				Meta.fetchVideoDuration(url, function (dur, err) {
					if (dur && !isLiveDetected) metaInfo.push(LANG.t('duration') + ': ' + U.formatTime(dur));
					updateMeta();
				});
			} else if (kind === 'audio') {
				Meta.fetchAudioDuration(url, function (dur, err) {
					if (dur) metaInfo.push(LANG.t('duration') + ': ' + U.formatTime(dur));
					updateMeta();
				});
			}
			Meta.fetchSize(url, function (size, err) {
				if (size) metaInfo.push(LANG.t('size') + ': ' + U.formatSize(size));
				metaInfo.push('URL: ' + url.substring(0, 40) + (url.length > 40 ? '...' : ''));
				updateMeta();
			});

						var btnWrap = document.createElement('div');
			btnWrap.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;';
			function mkBtn(label, gradient, handler) {
				var b = document.createElement('button');
				b.innerHTML = label; b.style.cssText = 'padding:12px 14px;border:none;border-radius:10px;background:linear-gradient(135deg,' + gradient + ');color:#fff;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;';
				b.addEventListener('click', handler); btnWrap.appendChild(b);
			}
			mkBtn(LANG.t('download'), '#6366f1,#8b5cf6', function () {
				try {
					if (url.indexOf('blob:') === 0) {
						Dl.downloadBlob(url, Dl.buildName(url, 1, 'mp4', State.config.nameTpl));
					} else {
						Dl.one(url, Dl.buildName(url, 1, '', State.config.nameTpl), State.config.batchRetry, State.config.customHeaders);
					}
					toast(LANG.t('startDl'));
				}
				catch(e) { toast(LANG.t('fail') + ': ' + e.message, '#ef4444'); }
			});
			mkBtn(LANG.t('copyUrl'), '#10b981,#34d399', function () { copyText(url); });
			mkBtn(LANG.t('openTab'), '#f59e0b,#fbbf24', function () { try { window.open(url, '_blank'); } catch (e) {} });
			if (kind === 'video') {
				mkBtn('录制媒体流', '#ef4444,#f87171', function () {
					var found = UI._findStreamElement(url);
					if (found && found.el) {
						Dl.recordStream(found.el, 10000, Dl.buildName(url, 1, 'webm', State.config.nameTpl));
					} else {
						toast('未找到可录制的媒体流', '#f59e0b');
					}
				});
			}
			if (kind === 'video' || kind === 'm3u8') {
				mkBtn(LANG.t('extractCover'), '#ec4899,#f472b6', function () {
					try {
						var video = document.createElement('video');
						video.crossOrigin = 'anonymous';
						video.src = url;
						video.muted = true;
						video.addEventListener('loadeddata', function () {
							try {
								video.currentTime = Math.min(1, (video.duration || 2) / 4);
								video.addEventListener('seeked', function () {
									var canvas = document.createElement('canvas');
									canvas.width = video.videoWidth || 640;
									canvas.height = video.videoHeight || 360;
									canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
									canvas.toBlob(function (blob) {
										var imgUrl = URL.createObjectURL(blob);
										var a = document.createElement('a');
										a.href = imgUrl;
										a.download = 'thumbnail_' + Date.now() + '.jpg';
										a.click();
										setTimeout(function(){ URL.revokeObjectURL(imgUrl); }, 1000);
										toast(LANG.t('coverExtracted'));
									}, 'image/jpeg', 0.9);
								});
							} catch (err) {
								toast(LANG.t('coverFail') + ': ' + err.message, '#ef4444');
							}
						});
						video.addEventListener('error', function () {
							toast(LANG.t('coverFail'), '#ef4444');
						});
						toast(LANG.t('coverWait'));
					} catch (err) { toast(LANG.t('extractFail') + ': ' + err.message, '#ef4444'); }
				});
			}
			modal.appendChild(btnWrap);

			overlay.appendChild(modal);
			overlay.addEventListener('click', function (e) { if (e.target === overlay) closePreviewOverlay(); });
			(document.documentElement || document.body).appendChild(overlay);

						var prevKeyHandler = function(e) {
				if (e.key === 'Escape') closePreviewOverlay();
			};
			document.addEventListener('keydown', prevKeyHandler);
		} catch (e) { toast(LANG.t('previewFail') + ': ' + e.message, '#ef4444'); }
	};

	UI.showFilterDialog = function () {
		try {
			var c = UI.colors();
			var overlay = document.createElement('div');
			overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:2147483650;padding:20px;';
			var modal = document.createElement('div');
			modal.style.cssText = 'max-width:400px;width:100%;background:' + c.bg + ';color:' + c.txt + ';border-radius:16px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.5);';

			modal.innerHTML = '<div style="font-size:16px;font-weight:700;margin-bottom:16px;">' + MS_CONFIG.ICONS.wrench + ' ' + LANG.t('advFilterTitle') + '</div>' +
				'<div style="font-size:13px;color:' + c.sub + ';margin-bottom:12px;">' + LANG.t('advFilterDesc') + '</div>' +
				'<div style="margin-bottom:12px;"><label style="font-size:12px;color:' + c.txt + ';display:block;margin-bottom:4px;">' + LANG.t('minImageSize') + '</label><input type="number" id="_ms_filter_img_size" value="' + State.config.minImageSize + '" style="width:100%;padding:8px;border:1px solid ' + c.border + ';border-radius:8px;background:' + c.bg + ';color:' + c.txt + ';font-size:13px;box-sizing:border-box;"></div>' +
				'<div style="margin-bottom:12px;"><label style="font-size:12px;color:' + c.txt + ';display:block;margin-bottom:4px;">' + LANG.t('minImageWidth') + '</label><input type="number" id="_ms_filter_img_w" value="' + State.config.minImageWidth + '" style="width:100%;padding:8px;border:1px solid ' + c.border + ';border-radius:8px;background:' + c.bg + ';color:' + c.txt + ';font-size:13px;box-sizing:border-box;"></div>' +
				'<div style="margin-bottom:12px;"><label style="font-size:12px;color:' + c.txt + ';display:block;margin-bottom:4px;">' + LANG.t('minVideoDuration') + '</label><input type="number" id="_ms_filter_vid_dur" value="' + State.config.minVideoDuration + '" style="width:100%;padding:8px;border:1px solid ' + c.border + ';border-radius:8px;background:' + c.bg + ';color:' + c.txt + ';font-size:13px;box-sizing:border-box;"></div>' +
				'<div style="display:flex;gap:8px;margin-top:16px;">' +
				'<button id="_ms_filter_apply" style="flex:1;padding:12px;border:none;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:14px;font-weight:600;cursor:pointer;">' + LANG.t('applyFilterBtn') + '</button>' +
				'<button id="_ms_filter_close" style="padding:12px 20px;border:none;border-radius:10px;background:#475569;color:#fff;font-size:14px;font-weight:600;cursor:pointer;">' + LANG.t('close') + '</button>' +
				'</div>';

			overlay.appendChild(modal);
			overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
			(document.documentElement || document.body).appendChild(overlay);

			document.getElementById('_ms_filter_apply').addEventListener('click', function () {
				State.config.minImageSize = parseInt(document.getElementById('_ms_filter_img_size').value || '0', 10);
				State.config.minImageWidth = parseInt(document.getElementById('_ms_filter_img_w').value || '0', 10);
				State.config.minVideoDuration = parseInt(document.getElementById('_ms_filter_vid_dur').value || '0', 10);
				State.save();
				toast(LANG.t('saved'));
				overlay.remove();
								UI.renderMedia(State.tab);
			});
			document.getElementById('_ms_filter_close').addEventListener('click', function () { overlay.remove(); });
		} catch (e) {}
	};
	UI.renderFooter = function (kind, list) {
		var ft = document.getElementById('_ms_footer');
		if (!ft) return;
		var c = UI.colors();
		var total = State.listFor(kind).length;
		var fullList = State.listFor(kind);
		var selList = [];
		for (var i = 0; i < list.length; i++) if (State.selected.has(list[i])) selList.push(list[i]);
		var selCount = selList.length;
		var displayList = list || [];

		ft.innerHTML = '';
		var wrap = document.createElement('div');
		wrap.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;';
																						var COLOR_ONLY = /^(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|transparent|currentColor|[a-zA-Z]+)$/;
		function asBackground(color) {
			var v = String(color == null ? '' : color).trim();
			if (!v) return '';
			if (v.indexOf('(') >= 0 || v.indexOf('gradient') >= 0) return v; 
			if (v.indexOf(',') < 0) return v; 
			var parts = v.split(',');
			for (var i = 0; i < parts.length; i++) {
				if (!COLOR_ONLY.test(parts[i].trim())) return v; 
			}
			return 'linear-gradient(135deg,' + v + ')';
		}
		function btn(label, color, handler, flex, textColor, icon) {
			var b = document.createElement('button');
												b.appendChild(UI.iconTextEl(icon || '', label));
			var bg = asBackground(color);
			b.style.cssText = (flex ? 'flex:' + flex + ';' : 'flex:1;') + 'min-width:60px;padding:8px 10px;border:none;border-radius:8px;background:' + bg + ';color:' + (textColor || '#fff') + ';font-size:12px;font-weight:600;cursor:pointer;';
			b.addEventListener('click', handler);
			wrap.appendChild(b);
			return b;
		}
		function menuBtn(label, color, items, textColor) {
			var b = btn(label, color, function (e) {
				UI._showFooterMenu(e.target, items);
			}, null, textColor);
			return b;
		}

		if (State.selectionMode) {
			var info = document.createElement('div');
			info.style.cssText = 'font-size:12px;color:' + c.sub + ';margin-bottom:6px;text-align:center;';
			info.textContent = LANG.t('selInfo', {sel: selCount, shown: displayList.length, total: total});
			ft.appendChild(info);

			btn(LANG.t('selectAllBtn'), c.bg3, function () {
				Selection.toggleAll(fullList, true);
				Selection._updateAllCards();
				Selection._refreshToolbar();
			}, null, c.txt);
			btn(LANG.t('invertSel'), c.bg3, function () {
				Selection.invert(fullList);
				Selection._updateAllCards();
				Selection._refreshToolbar();
			}, null, c.txt);
			btn(LANG.t('clearSel'), '#64748b,#94a3b8', function () {
				Selection.clear();
				Selection._updateAllCards();
				Selection._refreshToolbar();
			});
			btn(LANG.t('copyN', {n: selCount}), '#10b981,#34d399', function () {
				var picked = selList.length > 0 ? selList : fullList;
				copyText(picked.join('\n'));
			}, 1.3);
			btn(LANG.t('downloadN', {n: selCount}), '#6366f1,#8b5cf6', function () {
				var picked = selList.length > 0 ? selList : fullList;
				if (!picked || picked.length === 0) { toast(LANG.t('plsCheck'), '#f59e0b'); return; }
				var progEl = document.getElementById('_ms_progress');
				if (progEl) progEl.style.display = 'block';
				Dl.batch(picked, kind, UI.updateProgress, function (result) {
					if (progEl && Dl.getQueue().length === 0) progEl.style.display = 'none';
				});
			}, 1.5);
			btn(LANG.t('genScript'), '#f59e0b,#fbbf24', function () {
				var picked = selList.length > 0 ? selList : fullList;
				var script = Dl.generateScript(picked, 'aria2');
				copyText(script);
				toast(LANG.t('scriptCopied'));
			}, null, null, MS_CONFIG.ICONS.edit);
			btn(LANG.t('sendAria2'), '#06b6d4,#22d3ee', function () {
				var picked = selList.length > 0 ? selList : fullList;
				if (!picked || picked.length === 0) { toast(LANG.t('plsCheck'), '#f59e0b'); return; }
				Dl._initDM();
				var ariaItems = [];
				for (var ai = 0; ai < picked.length; ai++) {
					ariaItems.push({
						url: picked[ai],
						filename: Dl.uniqueName(Dl.buildName(picked[ai], ai + 1, '', State.config.nameTpl)),
						backend: 'aria2',
						priority: 0,
						meta: { source: 'aria2' }
					});
				}
				Dl._dm.enqueue(ariaItems, {
					onComplete: function (id, result) {},
					onError: function (id, error) { LOG.warn('Aria2 push failed', error); }
				});
				toast(LANG.t('aria2Pushed', {n: picked.length}));
			});
						menuBtn('收藏', '#f43f5e,#fb7185', [
				{ label: '收藏选中', handler: function () { Selection.runBatch('favorite', selList.length ? selList : fullList); } },
				{ label: '查看收藏夹', handler: function () { toast('收藏夹共 ' + Selection.favorites().length + ' 项'); } },
				{ label: '清空收藏夹', handler: function () { if (confirm('确定清空收藏夹？')) Selection.clearFavorites(); } }
			], '#fff');
			menuBtn('去重', '#8b5cf6,#a78bfa', [
				{ label: '按 URL 去重', handler: function () { Selection.setDedupKey('url'); Selection.runBatch('dedup', fullList); } },
				{ label: '按域名分组去重', handler: function () { Selection.toggleGroup('domain'); UI.renderMedia(kind); } },
				{ label: '查看重复项', handler: function () { var dups = Selection.getDuplicates(fullList); toast('发现 ' + dups.length + ' 个重复项'); } }
			], '#fff');
			menuBtn('分组', '#0ea5e9,#38bdf8', [
				{ label: '按域名', handler: function () { Selection.toggleGroup('domain'); UI.renderMedia(kind); } },
				{ label: '按扩展名', handler: function () { Selection.toggleGroup('ext'); UI.renderMedia(kind); } },
				{ label: '按类型', handler: function () { Selection.toggleGroup('type'); UI.renderMedia(kind); } },
				{ label: '重置分组', handler: function () { State._activeGroups.clear(); UI.renderMedia(kind); } }
			], '#fff');
			menuBtn('批量', '#14b8a6,#2dd4bf', Selection.getBatchActions().map(function (a) {
				return { label: a.label, handler: function () { Selection.runBatch(a.id, selList.length ? selList : fullList); } };
			}), '#fff');
			btn(LANG.t('rescan'), '#475569,#64748b', function () {
				Scanner.doFull(function () { toast(LANG.t('rescanDone')); UI.renderMedia(kind); });
			});
						btn(LANG.t('close'), '#ef4444', function () {
				Selection.exit();
			});
		} else {
			var info2 = document.createElement('div');
			info2.style.cssText = 'font-size:12px;color:' + c.sub + ';margin-bottom:6px;text-align:center;';
			info2.textContent = LANG.t('selInfo', {sel: selCount, shown: displayList.length, total: total});
			ft.appendChild(info2);

						btn(LANG.t('selectBtn'), 'linear-gradient(135deg,#6366f1,#8b5cf6)', function () {
				Selection.enter();
			}, 1.2);

			btn(LANG.t('selectAllBtn'), c.bg3, function () {
				Selection.toggleAll(fullList, true);
				UI.renderMedia(kind);
			}, null, c.txt);
			btn(LANG.t('invertSel'), c.bg3, function () {
				Selection.invert(fullList);
				UI.renderMedia(kind);
			}, null, c.txt);
			btn(LANG.t('clearSel'), '#64748b,#94a3b8', function () {
				Selection.clear();
				UI.renderMedia(kind);
			});
			btn(LANG.t('copyN', {n: selCount}), '#10b981,#34d399', function () {
				var picked = selList.length > 0 ? selList : fullList;
				copyText(picked.join('\n'));
			}, 1.3);
			btn(LANG.t('downloadN', {n: selCount}), '#6366f1,#8b5cf6', function () {
				var picked = selList.length > 0 ? selList : fullList;
				if (!picked || picked.length === 0) { toast(LANG.t('plsCheck'), '#f59e0b'); return; }
				var progEl = document.getElementById('_ms_progress');
				if (progEl) progEl.style.display = 'block';
				Dl.batch(picked, kind, UI.updateProgress, function (result) {
					if (progEl && Dl.getQueue().length === 0) progEl.style.display = 'none';
				});
			}, 1.5);
			btn(LANG.t('genScript'), '#f59e0b,#fbbf24', function () {
				var picked = selList.length > 0 ? selList : fullList;
				var script = Dl.generateScript(picked, 'aria2');
				copyText(script);
				toast(LANG.t('scriptCopied'));
			});
			btn(LANG.t('rescan'), '#475569,#64748b', function () {
				Scanner.doFull(function () { toast(LANG.t('rescanDone')); UI.renderMedia(kind); });
			});
		}
		ft.appendChild(wrap);
	};
	UI._showFooterMenu = function (anchor, items) {
		if (!items || items.length === 0) return;
		var existing = document.getElementById('_ms_footer_menu');
		if (existing) existing.remove();
		var c = UI.colors();
		var menu = document.createElement('div');
		menu.id = '_ms_footer_menu';
		menu.style.cssText = 'position:fixed;z-index:2147483647;background:' + c.bg2 + ';border:1px solid ' + c.border + ';border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.25);padding:6px;min-width:140px;';
		var rect = anchor.getBoundingClientRect();
		menu.style.left = Math.max(4, Math.min(window.innerWidth - 160, rect.left)) + 'px';
		menu.style.top = (rect.top - Math.min(items.length * 38 + 20, 260)) + 'px';
		for (var i = 0; i < items.length; i++) {
			(function (item) {
				var row = document.createElement('div');
				row.textContent = item.label;
				row.style.cssText = 'padding:8px 12px;border-radius:6px;cursor:pointer;font-size:13px;color:' + c.txt + ';white-space:nowrap;';
				row.addEventListener('mouseenter', function () { row.style.background = c.bg3; });
				row.addEventListener('mouseleave', function () { row.style.background = 'transparent'; });
				row.addEventListener('click', function () {
					menu.remove();
					if (typeof item.handler === 'function') item.handler();
				});
				menu.appendChild(row);
			})(items[i]);
		}
		document.body.appendChild(menu);
		setTimeout(function () {
			function onClickOutside(e) {
				if (!menu.contains(e.target)) {
					menu.remove();
					document.removeEventListener('click', onClickOutside, true);
				}
			}
			document.addEventListener('click', onClickOutside, true);
		}, 0);
	};
	UI.renderTranslate = function () {
		var box = document.getElementById('_ms_box');
		if (!box) return;
		var c = UI.colors();
		box.innerHTML = '';
		var container = document.createElement('div');
		container.style.cssText = 'padding:14px 16px;';

		var intro = document.createElement('div');
		intro.style.cssText = 'padding:14px 16px;border-radius:14px;background:' + c.bg2 + ';border:1px solid ' + c.border + ';margin-bottom:14px;font-size:12px;color:' + c.sub + ';line-height:1.8;';
										var introTitle = document.createElement('div');
		introTitle.style.cssText = 'font-size:14px;font-weight:600;color:' + c.txt + ';margin-bottom:6px;';
		introTitle.textContent = LANG.t('transTitle');
		intro.appendChild(introTitle);
		String(LANG.t('transIntro')).split('\n').forEach(function (line) {
			var lineEl = document.createElement('div');
			lineEl.textContent = line;
			intro.appendChild(lineEl);
		});
		container.appendChild(intro);
		var engineRow = document.createElement('div');
		engineRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:12px;';
		var engineLabel = document.createElement('span');
		engineLabel.style.cssText = 'font-size:13px;color:' + c.txt + ';font-weight:600;';
		engineLabel.textContent = LANG.t('transEngine') + ':';
		engineRow.appendChild(engineLabel);

		var engineSel = document.createElement('div');
		engineSel.style.cssText = 'flex:1;position:relative;';
		var engines = TranslateEngine.list();
		var currentEngineKey = State.config.translateEngine || 'mymemory';
		var currentEngine = null;
		for (var eii = 0; eii < engines.length; eii++) { if (engines[eii].key === currentEngineKey) { currentEngine = engines[eii]; break; } }
		if (!currentEngine) currentEngine = engines[0];
		var engineTrigger = document.createElement('div');
		engineTrigger.style.cssText = 'padding:8px 10px;border:1px solid ' + c.border + ';border-radius:8px;background:' + c.bg + ';color:' + c.txt + ';font-size:13px;font-family:inherit;cursor:pointer;display:flex;align-items:center;gap:6px;justify-content:space-between;';
		engineTrigger.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;">' + currentEngine.icon + '<span>' + currentEngine.label + '</span></span><span style="opacity:.6f;font-size:11px;">▼</span>';
		engineSel.appendChild(engineTrigger);
		var enginePanel = document.createElement('div');
		enginePanel.style.cssText = 'display:none;position:absolute;top:calc(100% + 4px);left:0;right:0;background:' + c.bg + ';border:1px solid ' + c.border + ';border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:999;overflow:hidden;';
		for (var ei = 0; ei < engines.length; ei++) {
			(function (eng) {
				var eItem = document.createElement('div');
				var isSel = eng.key === currentEngineKey;
				eItem.style.cssText = 'padding:10px 12px;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:13px;color:' + c.txt + ';' + (isSel ? 'background:' + (c.accent || '#6366f1') + '22;' : '');
				eItem.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;flex:1;">' + eng.icon + '<span>' + eng.label + '</span></span>' + (isSel ? '<span style="color:' + (c.accent || '#6366f1') + ';">●</span>' : '');
				eItem.addEventListener('click', function () {
					TranslateEngine.use(eng.key);
					engineTrigger.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;">' + eng.icon + '<span>' + eng.label + '</span></span><span style="opacity:.6f;font-size:11px;">▼</span>';
					enginePanel.style.display = 'none';
					toast(LANG.t('saved'));
				});
				enginePanel.appendChild(eItem);
			})(engines[ei]);
		}
		engineSel.appendChild(enginePanel);
		engineTrigger.addEventListener('click', function (e) {
			e.stopPropagation();
			enginePanel.style.display = enginePanel.style.display === 'block' ? 'none' : 'block';
		});
		document.addEventListener('click', function () { enginePanel.style.display = 'none'; });
		engineRow.appendChild(engineSel);
		container.appendChild(engineRow);
		var langRow = document.createElement('div');
		langRow.style.cssText = 'display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;';
		function makeLangSelect(value, onChange) {
			var sel = document.createElement('select');
			sel.style.cssText = 'flex:1;min-width:120px;padding:8px 10px;border:1px solid ' + c.border + ';border-radius:8px;background:' + c.bg + ';color:' + c.txt + ';font-size:13px;font-family:inherit;';
			var opts = [
				['auto', LANG.t('autoDetect')],
				['zh-CN', LANG.t('zhLang')],
				['en', LANG.t('enLang')],
				['ja', LANG.t('jaLang')],
				['ko', LANG.t('koLang')],
				['fr', LANG.t('frLang')],
				['de', LANG.t('deLang')],
				['es', LANG.t('esLang')],
				['ru', LANG.t('ruLang')],
				['pt', '葡萄牙语'],
				['it', '意大利语'],
				['ar', '阿拉伯语'],
				['th', '泰语'],
				['vi', '越南语']
			];
			for (var i = 0; i < opts.length; i++) {
				var opt = document.createElement('option');
				opt.value = opts[i][0]; opt.textContent = opts[i][1];
				if (opts[i][0] === value) opt.selected = true;
				sel.appendChild(opt);
			}
			sel.addEventListener('change', function () { onChange(sel.value); });
			return sel;
		}
		var fromSel = makeLangSelect(State.config.translateFrom, function (v) { State.config.translateFrom = v; State.save(); });
		var arrow = document.createElement('div');
		arrow.style.cssText = 'padding:8px 4px;color:' + c.sub + ';font-weight:700;font-size:16px;';
		arrow.textContent = '→';
		var toSel = makeLangSelect(State.config.translateTo, function (v) { State.config.translateTo = v; State.save(); });
		langRow.appendChild(fromSel); langRow.appendChild(arrow); langRow.appendChild(toSel);
		container.appendChild(langRow);
		var input = document.createElement('textarea');
		input.placeholder = LANG.t('transInputPh');
		input.style.cssText = 'width:100%;min-height:130px;padding:10px 12px;border:1px solid ' + c.border + ';border-radius:10px;font-size:13px;line-height:1.6;background:' + c.bg + ';color:' + c.txt + ';font-family:inherit;box-sizing:border-box;resize:vertical;';
		container.appendChild(input);
		var btnRow = document.createElement('div');
		btnRow.style.cssText = 'display:flex;gap:8px;margin-top:10px;margin-bottom:14px;flex-wrap:wrap;';
		function makeBtn(label, bg, handler, parent, icon) {
			var b = document.createElement('button');
			b.appendChild(UI.iconTextEl(icon || '', label));
			b.style.cssText = 'flex:1;min-width:110px;padding:10px 12px;border:none;border-radius:10px;background:' + bg + ';color:#fff;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;';
			b.addEventListener('click', handler);
			(parent || btnRow).appendChild(b);
		}
		makeBtn(LANG.t('transBtn'), 'linear-gradient(135deg,#6366f1,#8b5cf6)', function () { doTranslate(false); });
		makeBtn(LANG.t('zhToEn'), '#f59e0b', function () { fromSel.value = 'zh-CN'; toSel.value = 'en'; State.config.translateFrom = 'zh-CN'; State.config.translateTo = 'en'; State.save(); doTranslate(false); });
		makeBtn(LANG.t('enToZh'), '#10b981', function () { fromSel.value = 'en'; toSel.value = 'zh-CN'; State.config.translateFrom = 'en'; State.config.translateTo = 'zh-CN'; State.save(); doTranslate(false); });
		makeBtn(LANG.t('clearBtn'), '#475569', function () { input.value = ''; output.textContent = LANG.t('transResultPh'); statusEl.textContent = ''; });
		container.appendChild(btnRow);
		var statusEl = document.createElement('div');
		statusEl.style.cssText = 'font-size:12px;color:' + c.sub + ';margin-bottom:8px;';
		container.appendChild(statusEl);
		var output = document.createElement('div');
		output.style.cssText = 'padding:14px 16px;border-radius:10px;background:' + c.bg2 + ';border:2px dashed ' + c.border + ';color:' + c.txt + ';font-size:14px;line-height:1.8;word-break:break-word;white-space:pre-wrap;min-height:80px;';
		output.textContent = LANG.t('transResultPh');
		container.appendChild(output);
		var btnRow2 = document.createElement('div');
		btnRow2.style.cssText = 'display:flex;gap:8px;margin-top:10px;margin-bottom:18px;';
		makeBtn(LANG.t('copyResult'), '#6366f1', function () { copyText(output.textContent || ''); }, btnRow2, MS_CONFIG.ICONS.copy);
		makeBtn(LANG.t('resultAsInput'), '#10b981', function () { if (output.textContent && output.textContent !== LANG.t('transResultPh')) input.value = output.textContent; }, btnRow2);
		makeBtn(LANG.t('speakBtn'), '#f59e0b', function () {
			if (output.textContent && output.textContent !== LANG.t('transResultPh')) {
				TranslateEngine.speak(output.textContent, toSel.value);
				toast(LANG.t('saved'));
			}
		}, btnRow2, MS_CONFIG.ICONS.volume);
		container.appendChild(btnRow2);

		box.appendChild(container);
		function doTranslate(isAuto) {
			var text = (input.value || '').trim();
			if (!text) { statusEl.textContent = LANG.t('plsInputText'); statusEl.style.color = '#f59e0b'; return; }
			var from = isAuto ? 'auto' : fromSel.value;
			var to = toSel.value;
			var engine = TranslateEngine.current();
			statusEl.innerHTML = '<span style="display:inline-flex;align-items:center;gap:4px;">' + engine.icon + '<span>' + LANG.t('translating', {from: from, to: to}) + '</span></span>';
			statusEl.style.color = '#6366f1';
			output.textContent = LANG.t('translatingShort');
			TranslateEngine.translate(text, from, to, function (result, err) {
				if (err) { statusEl.textContent = LANG.t('transFail') + ': ' + err; statusEl.style.color = '#ef4444'; output.textContent = LANG.t('transFailShort') + err; }
				else { statusEl.innerHTML = '<span style="display:inline-flex;align-items:center;gap:4px;">' + engine.icon + '<span>' + LANG.t('transDone') + new Date().toLocaleTimeString() + '</span></span>'; statusEl.style.color = '#10b981'; output.textContent = result; }
			});
		}
	};
	UI.renderCookie = function () {
		var box = document.getElementById('_ms_box');
		if (!box) return;
		var c = UI.colors();
		box.innerHTML = '';
		var container = document.createElement('div');
		container.style.cssText = 'padding:12px 14px;';

		var btnRow = document.createElement('div');
		btnRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;';
		function mkBtn(label, color, handler, flex, icon) {
			var b = document.createElement('button');
						b.appendChild(UI.iconTextEl(icon || '', label));
			b.style.cssText = (flex ? 'flex:' + flex + ';' : 'flex:1;') + 'min-width:110px;padding:10px 12px;border:none;border-radius:10px;background:linear-gradient(135deg,' + color + ');color:#fff;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;';
			b.addEventListener('click', handler); btnRow.appendChild(b);
		}
		mkBtn(LANG.t('copyCookieStr'), '#6366f1,#8b5cf6', function () { try { copyText(document.cookie || '（空）'); } catch (e) { toast(LANG.t('readCookieFail'), '#ef4444'); } }, null, MS_CONFIG.ICONS.copy);
		mkBtn(LANG.t('copyJson'), '#10b981,#34d399', function () { var pairs = parseCookies(); copyText(JSON.stringify(pairs, null, 2)); });
		mkBtn(LANG.t('addCookie'), '#f59e0b,#fbbf24', function () {
			var name = prompt(LANG.t('cookieName'));
			if (!name) return;
			var val = prompt(LANG.t('cookieValue'));
			if (val == null) return;
			try { document.cookie = name + '=' + val + ';path=/;domain=' + location.hostname; toast(LANG.t('added')); UI.renderCookie(); } catch (e) { toast(LANG.t('addFail') + ': ' + e.message, '#ef4444'); }
		}, null, MS_CONFIG.ICONS.plus);
		mkBtn(LANG.t('clearSite'), '#ef4444,#f87171', function () {
			if (!confirm(LANG.t('confirmClearCookie'))) return;
			try {
				var cur = document.cookie || '';
				if (cur) {
					var arr = cur.split(';');
					for (var i = 0; i < arr.length; i++) {
						var idx = arr[i].indexOf('=');
						if (idx < 0) continue;
						var nm = arr[i].substring(0, idx).trim();
						document.cookie = nm + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + location.hostname;
						document.cookie = nm + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
					}
				}
				toast(LANG.t('clearedRefresh')); UI.renderCookie();
			} catch (e) { toast(LANG.t('clearFail') + ': ' + e.message, '#ef4444'); }
		}, null, MS_CONFIG.ICONS.trash);
		container.appendChild(btnRow);

		var pairs = parseCookies();
		if (pairs.length === 0) {
			var empty = document.createElement('div');
			empty.style.cssText = 'padding:40px;text-align:center;color:' + c.sub + ';font-size:14px;';
			empty.textContent = LANG.t('noCookie');
			container.appendChild(empty);
		} else {
			for (var i = 0; i < pairs.length; i++) {
				(function (p) {
					var row = document.createElement('div');
					row.style.cssText = 'padding:10px 12px;margin-bottom:6px;background:' + c.bg2 + ';border-radius:8px;border-left:3px solid #6366f1;';
					var top = document.createElement('div');
					top.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap;';
					var name = document.createElement('div');
					name.style.cssText = 'flex:1;min-width:0;word-break:break-all;color:#6366f1;font-weight:700;font-size:12px;';
					name.textContent = p.name;
					var del = document.createElement('button');
					del.textContent = LANG.t('delete');
					del.style.cssText = 'padding:4px 10px;border:none;border-radius:6px;background:#ef4444;color:#fff;font-size:11px;cursor:pointer;flex-shrink:0;';
					del.addEventListener('click', function () {
						try {
							document.cookie = p.name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + location.hostname;
							toast(LANG.t('done') + ': ' + p.name); UI.renderCookie();
						} catch (e) { toast(LANG.t('delFail') + ': ' + e.message, '#ef4444'); }
					});
					top.appendChild(name); top.appendChild(del);
					row.appendChild(top);
					var val = document.createElement('div');
					val.style.cssText = 'font-size:12px;color:' + c.sub + ';word-break:break-all;font-family:monospace;';
					val.textContent = p.value;
					row.appendChild(val);
					container.appendChild(row);
				})(pairs[i]);
			}
		}
		box.appendChild(container);
	};
	function parseCookies() {
		var out = [];
		try {
			var raw = document.cookie || '';
			if (!raw) return out;
			var arr = raw.split(';');
			for (var i = 0; i < arr.length; i++) {
				var idx = arr[i].indexOf('=');
				if (idx >= 0) out.push({ name: arr[i].substring(0, idx).trim(), value: arr[i].substring(idx + 1).trim() });
			}
		} catch (e) {}
		return out;
	}
	UI.renderStorage = function () {
		var box = document.getElementById('_ms_box');
		if (!box) return;
		var c = UI.colors();
		box.innerHTML = '';
		var container = document.createElement('div');
		container.style.cssText = 'padding:12px 14px;';

		var btnRow = document.createElement('div');
		btnRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;';
		function mkBtn(label, color, handler, icon) {
			var b = document.createElement('button');
			b.appendChild(UI.iconTextEl(icon || '', label));
			b.style.cssText = 'flex:1;min-width:110px;padding:10px 12px;border:none;border-radius:10px;background:linear-gradient(135deg,' + color + ');color:#fff;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;';
			b.addEventListener('click', handler); btnRow.appendChild(b);
		}
		mkBtn(LANG.t('exportLs'), '#6366f1,#8b5cf6', function () { var items = readStorage('ls'); copyText(JSON.stringify(items, null, 2)); });
		mkBtn(LANG.t('exportSs'), '#10b981,#34d399', function () { var items = readStorage('ss'); copyText(JSON.stringify(items, null, 2)); });
		mkBtn(LANG.t('addItem'), '#f59e0b,#fbbf24', function () {
			var k = prompt(LANG.t('keyName')); if (!k) return;
			var v = prompt(LANG.t('keyValue')); if (v == null) return;
			try { localStorage.setItem(k, v); toast(LANG.t('addToLs')); UI.renderStorage(); }
			catch (e) { toast(LANG.t('addFail') + ': ' + e.message, '#ef4444'); }}, MS_CONFIG.ICONS.plus);
		mkBtn(LANG.t('clearAll'), '#ef4444,#f87171', function () {
			if (!confirm(LANG.t('confirmClearStorage'))) return;
			try { localStorage.clear(); sessionStorage.clear(); toast(LANG.t('cleared')); UI.renderStorage(); }
			catch (e) { toast(LANG.t('clearFail') + ': ' + e.message, '#ef4444'); }
		}, MS_CONFIG.ICONS.trash);
		container.appendChild(btnRow);

		function readStorage(scope) {
			var out = [];
			try {
				var s = scope === 'ls' ? localStorage : sessionStorage;
				for (var i = 0; i < s.length; i++) {
					var k = s.key(i);
					out.push({ key: k, value: s.getItem(k) });
				}
			} catch (e) {}
			return out;
		}

		var ls = readStorage('ls'), ss = readStorage('ss');
		var info = document.createElement('div');
		info.style.cssText = 'padding:12px;border-radius:10px;background:' + c.bg2 + ';font-size:12px;color:' + c.sub + ';margin-bottom:12px;';
		info.appendChild(UI.iconTextEl(MS_CONFIG.ICONS.package, LANG.t('lsCount', {n: ls.length, m: ss.length})));
		container.appendChild(info);

		function renderSection(title, items, scope, icon) {
			if (items.length === 0) return;
			var h = document.createElement('div');
			h.style.cssText = 'font-weight:700;color:' + c.txt + ';margin:14px 0 6px;font-size:13px;';
			h.appendChild(UI.iconTextEl(icon || '', title + '（' + items.length + '）'));
			container.appendChild(h);
			for (var i = 0; i < items.length; i++) {
				(function (it) {
					var row = document.createElement('div');
					row.style.cssText = 'padding:10px 12px;margin-bottom:6px;background:' + c.bg2 + ';border-radius:8px;border-left:3px solid #6366f1;';
					var top = document.createElement('div');
					top.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap;';
					var name = document.createElement('div');
					name.style.cssText = 'flex:1;min-width:0;word-break:break-all;color:#6366f1;font-weight:700;font-size:12px;';
					name.textContent = it.key;
					var del = document.createElement('button');
					del.textContent = LANG.t('delete');
					del.style.cssText = 'padding:4px 10px;border:none;border-radius:6px;background:#ef4444;color:#fff;font-size:11px;cursor:pointer;flex-shrink:0;';
					del.addEventListener('click', function () {
						try {
							if (scope === 'ls') localStorage.removeItem(it.key); else sessionStorage.removeItem(it.key);
							toast(LANG.t('done')); UI.renderStorage();
						} catch (e) { toast(LANG.t('delFail'), '#ef4444'); }
					});
					top.appendChild(name); top.appendChild(del);
					row.appendChild(top);
					var val = document.createElement('div');
					val.style.cssText = 'font-size:12px;color:' + c.sub + ';word-break:break-all;font-family:monospace;max-height:100px;overflow:auto;';
					val.textContent = U.trunc(it.value, 500);
					row.appendChild(val);
					container.appendChild(row);
				})(items[i]);
			}
		}
		renderSection(LANG.t('lsTitle'), ls, 'ls', MS_CONFIG.ICONS.package);
		renderSection(LANG.t('ssTitle'), ss, 'ss', MS_CONFIG.ICONS.package);

		box.appendChild(container);
	};
	UI.renderPlugins = function () {
		var box = document.getElementById('_ms_box');
		if (!box) return;
		var c = UI.colors();
		var primary = MS_CONFIG.COLORS.primary;
		var primary2 = MS_CONFIG.COLORS.primary2;

				try { PluginManager.load(); } catch (e) { LOG.warn('PluginManager.load failed:', e); }

		var container = document.createElement('div');
		container.style.cssText = 'padding:12px 14px 20px;';

				var subTabBar = document.createElement('div');
		subTabBar.style.cssText = 'display:flex;gap:8px;margin-bottom:14px;';
		var subMarketBtn = document.createElement('button');
		var subInstalledBtn = document.createElement('button');
		var curSub = 'market';

		function applySubStyle(btn, active) {
			if (active) {
				btn.style.cssText = 'flex:1;padding:10px 12px;border:none;border-radius:10px;background:linear-gradient(135deg,' + primary + ',' + primary2 + ');color:#fff;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 12px rgba(99,102,241,.3);';
			} else {
				btn.style.cssText = 'flex:1;padding:10px 12px;border:1px solid ' + c.border + ';border-radius:10px;background:' + c.bg2 + ';color:' + c.sub + ';font-size:13px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;';
			}
		}
		subMarketBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:5px;">' + MS_CONFIG.ICONS.store + '<span>' + LANG.t('pluginSubTabMarket') + '</span></span>';
		subInstalledBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:5px;">' + MS_CONFIG.ICONS.plug + '<span>' + LANG.t('pluginSubTabInstalled') + '</span></span>';
		applySubStyle(subMarketBtn, true);
		applySubStyle(subInstalledBtn, false);

		function switchSub(target) {
			curSub = target;
			applySubStyle(subMarketBtn, target === 'market');
			applySubStyle(subInstalledBtn, target === 'installed');
			renderBody();
		}
		subMarketBtn.addEventListener('click', function () { switchSub('market'); });
		subInstalledBtn.addEventListener('click', function () { switchSub('installed'); });
		subTabBar.appendChild(subMarketBtn);
		subTabBar.appendChild(subInstalledBtn);
		container.appendChild(subTabBar);

				var statsBar = document.createElement('div');
		statsBar.style.cssText = 'font-size:12px;color:' + c.sub + ';margin-bottom:10px;padding:0 2px;';
		container.appendChild(statsBar);

				var listWrap = document.createElement('div');
		listWrap.style.cssText = 'display:flex;flex-direction:column;gap:10px;';
		container.appendChild(listWrap);

		function makeCard(plugin, isInstalledView) {
			var card = document.createElement('div');
			card.style.cssText = 'padding:14px;border-radius:12px;background:' + c.bg2 + ';border:1px solid ' + c.border + ';';

			var top = document.createElement('div');
			top.style.cssText = 'display:flex;gap:12px;align-items:flex-start;margin-bottom:10px;';

						var iconWrap = document.createElement('div');
			var gradMap = {
				enhance: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
				download: 'linear-gradient(135deg,#10b981,#14b8a6)',
				parse: 'linear-gradient(135deg,#f59e0b,#f97316)',
				ui: 'linear-gradient(135deg,#ec4899,#8b5cf6)',
				tool: 'linear-gradient(135deg,#0ea5e9,#3b82f6)'
			};
			var grad = gradMap[plugin.category] || gradMap.tool;
			iconWrap.style.cssText = 'flex-shrink:0;width:48px;height:48px;border-radius:12px;background:' + grad + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 4px 10px rgba(99,102,241,.2);';
			iconWrap.innerHTML = plugin.icon || MS_CONFIG.ICONS.plug;
			top.appendChild(iconWrap);

						var info = document.createElement('div');
			info.style.cssText = 'flex:1;min-width:0;';

			var nameRow = document.createElement('div');
			nameRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:4px;';
			var nameEl = document.createElement('div');
			nameEl.style.cssText = 'font-size:14px;font-weight:700;color:' + c.txt + ';';
			nameEl.textContent = PluginManager.localName(plugin);
			nameRow.appendChild(nameEl);

						var catBadge = document.createElement('span');
			catBadge.style.cssText = 'flex-shrink:0;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600;background:' + c.bg3 + ';color:' + c.sub + ';';
			catBadge.textContent = PluginManager.categoryLabel(plugin.category);
			nameRow.appendChild(catBadge);

						if (isInstalledView) {
				var statusBadge = document.createElement('span');
				if (plugin.enabled) {
					statusBadge.style.cssText = 'flex-shrink:0;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600;background:rgba(16,185,129,.15);color:#10b981;';
					statusBadge.textContent = LANG.t('enabled');
				} else {
					statusBadge.style.cssText = 'flex-shrink:0;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600;background:rgba(100,116,139,.18);color:#64748b;';
					statusBadge.textContent = LANG.t('disabled');
				}
				nameRow.appendChild(statusBadge);
			}
			info.appendChild(nameRow);

			var metaRow = document.createElement('div');
			metaRow.style.cssText = 'font-size:11px;color:' + c.sub + ';margin-bottom:6px;display:flex;flex-wrap:wrap;gap:8px 12px;';
			metaRow.innerHTML = '<span>' + MS_CONFIG.ICONS.coin + ' ' + LANG.t('pluginVersion') + ': ' + (plugin.version || '1.0.0') + '</span><span>' + MS_CONFIG.ICONS.thumbsUp + ' ' + LANG.t('pluginAuthor') + ': ' + (plugin.author || 'MediaSniffer') + '</span>';
			if (isInstalledView && plugin.installTime) {
				metaRow.innerHTML += '<span>' + MS_CONFIG.ICONS.calendar + ' ' + new Date(plugin.installTime).toLocaleDateString() + '</span>';
			}
			info.appendChild(metaRow);

			var descEl = document.createElement('div');
			descEl.style.cssText = 'font-size:12px;color:' + c.sub + ';line-height:1.5;';
			descEl.textContent = PluginManager.localDesc(plugin);
			info.appendChild(descEl);

			top.appendChild(info);
			card.appendChild(top);

						var actions = document.createElement('div');
			actions.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:4px;';

			function mkBtn(label, bgColor, hoverBg, handler, icon) {
				var b = document.createElement('button');
				var inner = '';
				if (icon) inner = '<span style="display:inline-flex;align-items:center;gap:5px;">' + icon + '<span>' + label + '</span></span>';
				else inner = label;
				b.innerHTML = inner;
				b.style.cssText = 'padding:7px 14px;border:none;border-radius:8px;background:' + bgColor + ';color:#fff;font-size:12px;font-weight:600;cursor:pointer;transition:filter .15s;';
				b.addEventListener('mouseenter', function () { b.style.filter = 'brightness(1.08)'; });
				b.addEventListener('mouseleave', function () { b.style.filter = 'none'; });
				b.addEventListener('click', handler);
				return b;
			}

			if (!isInstalledView) {
								var installed = PluginManager.isInstalled(plugin.id);
				if (installed) {
					var okBtn = document.createElement('button');
					okBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:5px;">' + MS_CONFIG.ICONS.checkBig + '<span>' + LANG.t('pluginInstalled') + '</span></span>';
					okBtn.style.cssText = 'padding:7px 14px;border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.sub + ';font-size:12px;font-weight:600;cursor:default;';
					okBtn.disabled = true;
					actions.appendChild(okBtn);
				} else {
					actions.appendChild(mkBtn(LANG.t('pluginInstall'), MS_CONFIG.COLORS.success, '#059669', function () {
						var res = PluginManager.install(plugin.id);
						if (res.ok) {
							toast(LANG.t('pluginInstalledToast', { name: PluginManager.localName(plugin) }));
							renderBody();
						}
					}, MS_CONFIG.ICONS.downloadWhite));
				}
			} else {
								if (plugin.enabled) {
					actions.appendChild(mkBtn(LANG.t('pluginDisable'), '#64748b', '#475569', function () {
						var res = PluginManager.disable(plugin.id);
						if (res.ok) {
							toast(LANG.t('pluginDisabledToast', { name: PluginManager.localName(plugin) }));
							renderBody();
						}
					}, MS_CONFIG.ICONS.pause));
				} else {
					actions.appendChild(mkBtn(LANG.t('pluginEnable'), MS_CONFIG.COLORS.success, '#059669', function () {
						var res = PluginManager.enable(plugin.id);
						if (res.ok) {
							toast(LANG.t('pluginEnabledToast', { name: PluginManager.localName(plugin) }));
							renderBody();
						}
					}, MS_CONFIG.ICONS.playSmall));
				}
				actions.appendChild(mkBtn(LANG.t('pluginUninstall'), MS_CONFIG.COLORS.danger, MS_CONFIG.COLORS.danger2, function () {
					var msg = LANG.t('confirmUninstallPlugin', { name: PluginManager.localName(plugin) });
					if (!confirm(msg)) return;
					var res = PluginManager.uninstall(plugin.id);
					if (res.ok) {
						toast(LANG.t('pluginUninstalledToast', { name: PluginManager.localName(plugin) }));
						renderBody();
					}
				}, MS_CONFIG.ICONS.trash));
			}
			card.appendChild(actions);
			return card;
		}

		function renderBody() {
			listWrap.innerHTML = '';
			if (curSub === 'market') {
				var market = PluginManager.getMarket();
				statsBar.textContent = LANG.t('pluginMarketN', { n: market.length });
				for (var i = 0; i < market.length; i++) {
					listWrap.appendChild(makeCard(market[i], false));
				}
			} else {
				var installed = PluginManager.getInstalled();
				statsBar.textContent = LANG.t('pluginInstalledN', { n: installed.length });
				if (installed.length === 0) {
					var empty = document.createElement('div');
					empty.style.cssText = 'padding:60px 20px;text-align:center;color:' + c.sub + ';font-size:14px;';
					empty.innerHTML = '<div style="font-size:48px;margin-bottom:14px;opacity:.4;">' + MS_CONFIG.ICONS.plug + '</div>' + LANG.t('noInstalledPlugins');
					listWrap.appendChild(empty);
				} else {
										installed.sort(function (a, b) { return (b.installTime || 0) - (a.installTime || 0); });
					for (var j = 0; j < installed.length; j++) {
						listWrap.appendChild(makeCard(installed[j], true));
					}
				}
			}
		}

		renderBody();
		box.innerHTML = '';
		box.appendChild(container);
	};
			UI.refreshPanelTexts = function () {
				var panel = State.panel;
		if (!panel) return;
		try {
						var hd = panel.children && panel.children[0];
			if (hd) {
				var titleEl = hd.querySelector ? hd.querySelector('div') : null;
				if (titleEl) titleEl.textContent = LANG.t('appTitle');
			}
						var tabBtns = panel.querySelectorAll('._ms_tab');
			for (var i = 0; i < tabBtns.length; i++) {
				var key = tabBtns[i].getAttribute('data-tab');
				if (!key) continue;
				var active = tabBtns[i].getAttribute('data-active') === '1';
																var label = UI._tabLabel(key);
				if (!label) label = tabBtns[i].textContent || '';
																tabBtns[i].innerHTML = UI._tabInnerHtml(key, label);
				if (typeof UI._applyTabStyle === 'function') UI._applyTabStyle(tabBtns[i], active);
			}
						var si = panel.querySelector ? panel.querySelector('#_ms_search input') : null;
			if (si && si.placeholder && LANG.t('searchPlaceholder') !== 'searchPlaceholder') si.placeholder = LANG.t('searchPlaceholder');
						if (typeof UI.renderMedia === 'function') UI.renderMedia(State.tab);
						if (State.tab === 'settings' && typeof UI.renderSettings === 'function') UI.renderSettings();
		} catch (e) { LOG.warn('刷新界面文案失败:', e); }
	};
			UI._diagLogLevel = 0; 
	UI.renderDiag = function () {
		var box = document.getElementById('_ms_box');
		if (!box) return;
		var c = UI.colors();
		var wrap = document.createElement('div');
		wrap.style.cssText = 'padding:12px 14px 24px;font-size:12px;color:' + c.txt + ';';

		function section(title) {
			var h = document.createElement('div');
			h.textContent = title;
			h.style.cssText = 'font-size:13px;font-weight:700;color:' + c.txt + ';margin:16px 0 8px;'
				+ 'padding-bottom:6px;border-bottom:1px solid ' + c.border + ';';
			wrap.appendChild(h);
			return h;
		}
		function card() {
			var d = document.createElement('div');
			d.style.cssText = 'background:' + c.bg2 + ';border:1px solid ' + c.border + ';border-radius:10px;'
				+ 'padding:10px 12px;line-height:1.9;';
			wrap.appendChild(d);
			return d;
		}
		function row(host, label, val, color) {
			var r = document.createElement('div');
			r.style.cssText = 'display:flex;gap:8px;align-items:baseline;';
			var l = document.createElement('span');
			l.textContent = label;
			l.style.cssText = 'flex:0 0 96px;color:' + c.sub + ';';
			var v = document.createElement('span');
			v.textContent = String(val);
			v.style.cssText = 'flex:1;word-break:break-all;font-family:SFMono-Regular,Consolas,monospace;'
				+ (color ? 'color:' + color + ';' : '');
			r.appendChild(l); r.appendChild(v);
			host.appendChild(r);
		}
				var titleRow = document.createElement('div');
		titleRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;';
		titleRow.innerHTML = '<div style="font-size:14px;font-weight:700;">' + LANG.t('diagTitle') + '</div>';
		wrap.appendChild(titleRow);

		var desc = document.createElement('div');
		desc.textContent = LANG.t('diagDesc');
		desc.style.cssText = 'font-size:11px;color:' + c.sub + ';margin:4px 0 10px;line-height:1.6;';
		wrap.appendChild(desc);

		var btnRow = document.createElement('div');
		btnRow.style.cssText = 'display:flex;gap:8px;';
		wrap.appendChild(btnRow);
		function mkBtn(label, primary, onClick) {
			var b = document.createElement('button');
			b.textContent = label;
			b.style.cssText = primary
				? 'flex:1;min-width:0;padding:9px 10px;border:none;border-radius:9px;background:linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ');color:#fff;font-size:12px;font-weight:700;cursor:pointer;'
				: 'flex:1;min-width:0;padding:9px 10px;border:1px solid ' + c.border + ';border-radius:9px;background:' + c.bg2 + ';color:' + c.txt + ';font-size:12px;font-weight:600;cursor:pointer;';
			b.addEventListener('click', onClick);
			return b;
		}
		btnRow.appendChild(mkBtn(LANG.t('diagCopyReport'), true, function () {
			var text = Diag.report({ logLevel: UI._diagLogLevel });
			var done = false;
			try {
				if (typeof GM_setClipboard === 'function') { GM_setClipboard(text); done = true; }
			} catch (e0) {}
			if (!done) {
				try {
					var ta = document.createElement('textarea');
					ta.value = text;
					ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
					document.body.appendChild(ta);
					ta.select();
					done = document.execCommand('copy');
					ta.remove();
				} catch (e1) { done = false; }
			}
						if (!done) {
				UI._showDiagText(text);
				toast(LANG.t('diagCopyFail'), '#f59e0b', 4000);
			} else {
				toast(LANG.t('diagCopied'), '#10b981');
			}
		}));
		btnRow.appendChild(mkBtn(LANG.t('diagRefresh'), false, function () { UI.renderDiag(); }));
		btnRow.appendChild(mkBtn(LANG.t('diagClearLogs'), false, function () {
			LOG.clearBuffer();
			UI.renderDiag();
			toast(LANG.t('diagClearLogs'), '#10b981');
		}));

		var snap = Diag.snapshot();

				section(LANG.t('diagEnv'));
		var envCard = card();
		var e = snap.env || {};
		row(envCard, '版本', 'v' + snap.version + ' (构建 ' + snap.scriptVersion + ')');
		row(envCard, '页面', (e.href || '').slice(0, 120));
		row(envCard, '视口', e.innerW + ' × ' + e.innerH + ' @' + e.dpr + 'x · ' + (e.isMobile ? '移动端' : '桌面端'));
		row(envCard, '顶层窗口', e.isTop === null ? '未知（跨域）' : (e.isTop ? '是' : '否（被嵌入 iframe）'));
		row(envCard, '已运行', Math.round(snap.uptimeMs / 1000) + ' 秒');
		row(envCard, '界面', (snap.ui.uiStyle || '') + ' · ' + (snap.ui.themeEffective === 'dark' ? '深色' : '浅色') + ' · ' + snap.ui.palette + ' · ' + snap.ui.uiLang);
		row(envCard, 'UA', (e.ua || '').slice(0, 110));

				section(LANG.t('diagStats'));
		var statCard = card();
		var r = snap.resources || {};
		row(statCard, '资源', '图片 ' + r.images + ' · 视频 ' + r.videos + ' · 音频 ' + r.audios + ' · m3u8 ' + r.m3u8 + ' · 链接 ' + r.videoLinks);
		var st = snap.stats || {};
		row(statCard, '扫描', st.fullScanCount + ' 次 · 最近 ' + st.fullScanLastMs + 'ms · 抓到 ' + st.fullScanLastFound + ' 条');
		row(statCard, '渲染', st.renderCount + ' 次 · 最近 ' + st.renderLastMs + 'ms');
		row(statCard, '网络入队', (st.netFlushCount || 0) + ' 次');
		row(statCard, '解析 / 失败', (st.resolveCount || 0) + ' / ' + (st.resolveFailCount || 0));
		var rt = snap.runtime || {};
		row(statCard, 'observer', rt.moConnected ? '已挂载（面板开着）' : '未挂载（面板关闭时正常）',
			rt.moConnected ? '#10b981' : c.sub);
		row(statCard, '守护轮询', rt.floatGuardRunning ? '运行中' : '未启动');
		row(statCard, 'm3u8 在跑', rt.m3u8ActiveRuns + ' 个任务 · 在飞请求 ' + rt.m3u8Inflight);
		row(statCard, '面板', (rt.panelBuilt ? '已构建' : '未构建') + ' · ' + (rt.panelOpen ? '打开中' : '已关闭'));
		row(statCard, '图标修正 CSS', rt.iconFixCss ? '已注入' : '未注入', rt.iconFixCss ? '#10b981' : '#f59e0b');

				section(LANG.t('diagCaches'));
		var cacheCard = card();
		(snap.caches || []).forEach(function (cc) {
			var pct = cc.limit > 0 ? Math.min(100, Math.round(cc.size / cc.limit * 100)) : 0;
			var line = document.createElement('div');
			line.style.cssText = 'display:flex;gap:8px;align-items:center;margin:2px 0;';
			var nm = document.createElement('span');
			nm.textContent = cc.name;
			nm.style.cssText = 'flex:0 0 150px;color:' + c.sub + ';font-family:monospace;font-size:11px;overflow:hidden;text-overflow:ellipsis;';
			var barWrap = document.createElement('div');
			barWrap.style.cssText = 'flex:1;height:6px;background:' + c.bg3 + ';border-radius:3px;overflow:hidden;';
			var bar = document.createElement('div');
			bar.style.cssText = 'height:100%;width:' + pct + '%;background:' + (pct >= 95 ? '#ef4444' : pct >= 75 ? '#f59e0b' : c.primary) + ';';
			barWrap.appendChild(bar);
			var num = document.createElement('span');
			num.textContent = cc.size + ' / ' + cc.limit;
			num.style.cssText = 'flex:0 0 76px;text-align:right;font-family:monospace;font-size:11px;color:' + c.txt + ';';
			line.appendChild(nm); line.appendChild(barWrap); line.appendChild(num);
			cacheCard.appendChild(line);
		});

				section(LANG.t('diagPerf'));
		var perfCard = card();
		var perf = snap.perf || [];
		if (perf.length === 0) {
			row(perfCard, '—', '（暂无打点：面板打开、扫描一次后再看）');
		} else {
			row(perfCard, '名称', '次数 · 最近 · 峰值 · 累计', c.sub);
			perf.slice(0, 14).forEach(function (p) {
				row(perfCard, p.name, p.count + ' · ' + p.lastMs + 'ms · ' + p.maxMs + 'ms · ' + p.totalMs + 'ms');
			});
		}

				section(LANG.t('diagSelfCheck'));
		var checkCard = card();
		var checks = Diag.selfCheck();
		var failN = 0;
		checks.forEach(function (it) {
			if (!it.ok) failN++;
			var line = document.createElement('div');
			line.style.cssText = 'display:flex;gap:8px;align-items:baseline;margin:1px 0;';
			var mark = document.createElement('span');
			mark.textContent = it.ok ? '✓' : '✗';
			mark.style.cssText = 'flex:0 0 14px;font-weight:700;color:' + (it.ok ? '#10b981' : '#ef4444') + ';';
			var nm = document.createElement('span');
			nm.textContent = it.name;
			nm.style.cssText = 'flex:0 0 132px;color:' + c.txt + ';';
			var dt = document.createElement('span');
			dt.textContent = it.detail || '';
			dt.style.cssText = 'flex:1;color:' + c.sub + ';font-size:11px;';
			line.appendChild(mark); line.appendChild(nm); line.appendChild(dt);
			checkCard.appendChild(line);
		});
		if (failN > 0) {
			var warn = document.createElement('div');
			warn.textContent = '⚠ 有 ' + failN + ' 项未通过 —— 相关功能会降级，但不是致命错误';
			warn.style.cssText = 'margin-top:8px;padding-top:8px;border-top:1px dashed ' + c.border + ';color:#f59e0b;font-size:11px;';
			checkCard.appendChild(warn);
		}

				section(LANG.t('diagLogs'));
		var logBar = document.createElement('div');
		logBar.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:8px;';
		var lvLab = document.createElement('span');
		lvLab.textContent = LANG.t('diagLogLevel');
		lvLab.style.cssText = 'font-size:11px;color:' + c.sub + ';';
		var lvSel = document.createElement('select');
		lvSel.style.cssText = 'flex:1;padding:5px 8px;border:1px solid ' + c.border + ';border-radius:7px;background:' + c.bg+' ;color:' + c.txt + ';font-size:11px;';
		[['0', LANG.t('diagAllLevels')], ['1', 'INFO'], ['2', 'WARN'], ['3', 'ERROR']].forEach(function (o) {
			var op = document.createElement('option');
			op.value = o[0]; op.textContent = o[1];
			if (Number(o[0]) === UI._diagLogLevel) op.selected = true;
			lvSel.appendChild(op);
		});
		lvSel.addEventListener('change', function () {
			UI._diagLogLevel = parseInt(lvSel.value, 10) || 0;
			UI.renderDiag();
		});
		logBar.appendChild(lvLab); logBar.appendChild(lvSel);
		wrap.appendChild(logBar);

		var logs = LOG.dump(UI._diagLogLevel);
		var logBox = document.createElement('div');
		logBox.style.cssText = 'background:' + c.bg2 + ';border:1px solid ' + c.border + ';border-radius:10px;'
			+ 'padding:8px 10px;max-height:340px;overflow-y:auto;font-family:SFMono-Regular,Consolas,monospace;font-size:11px;line-height:1.7;';
		if (logs.length === 0) {
			logBox.textContent = LANG.t('diagEmptyLogs');
			logBox.style.color = c.sub;
		} else {
			var LVL_COLOR = ['#64748b', c.sub, '#f59e0b', '#ef4444'];
			logs.forEach(function (g) {
				var d = new Date(g.t);
				var lineEl = document.createElement('div');
				lineEl.style.cssText = 'color:' + (LVL_COLOR[g.lvl] || c.sub) + ';word-break:break-all;';
				lineEl.textContent = d.toTimeString().slice(0, 8) + '.' + String(d.getMilliseconds()).padStart(3, '0')
					+ ' [' + LOG.LEVEL_NAMES[g.lvl] + '] ' + g.msg;
				logBox.appendChild(lineEl);
			});
						setTimeout(function () { try { logBox.scrollTop = logBox.scrollHeight; } catch (e2) {} }, 0);
		}
		wrap.appendChild(logBox);

		box.innerHTML = '';
		box.appendChild(wrap);
	};

						UI._showDiagText = function (text) {
		try {
			var c = UI.colors();
			var ov = document.createElement('div');
									var zIndex = 2147483000 + Math.min(UI._ai3Stack ? UI._ai3Stack.length : 0, 1000);
			ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:' + zIndex + ';padding:16px;';
			var m = document.createElement('div');
			m.style.cssText = 'max-width:min(94vw,640px);width:100%;max-height:84vh;display:flex;flex-direction:column;'
				+ 'background:' + c.bg + ';color:' + c.txt + ';border-radius:14px;padding:14px;box-shadow:0 24px 60px rgba(0,0,0,.5);';
			m.innerHTML = '<div style="font-size:13px;font-weight:700;margin-bottom:8px;">' + SEC.escapeHtml(LANG.t('diagCopyReport')) + '</div>';
			var ta = document.createElement('textarea');
			ta.value = text;
			ta.readOnly = true;
			ta.style.cssText = 'flex:1;min-height:320px;width:100%;box-sizing:border-box;background:' + c.bg2 + ';color:' + c.txt
				+ ';border:1px solid ' + c.border + ';border-radius:9px;padding:10px;font-family:monospace;font-size:11px;line-height:1.6;resize:vertical;';
			m.appendChild(ta);
			var close = document.createElement('button');
			close.textContent = '×';
			close.style.cssText = 'margin-top:10px;padding:9px;border:none;border-radius:9px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:13px;font-weight:600;cursor:pointer;';
						var settled = false;
			function dismiss() {
				if (settled) return;
				settled = true;
				if (handle && UI._ai3Stack) {
					var k = UI._ai3Stack.indexOf(handle);
					if (k >= 0) UI._ai3Stack.splice(k, 1);
				}
				try { ov.remove(); } catch (e3) {}
			}
			close.addEventListener('click', function () { dismiss(); });
						ov.addEventListener('click', function (e) { if (e.target === ov) dismiss(); });
			m.appendChild(close);
			ov.appendChild(m);
			document.body.appendChild(ov);

									var handle = { close: dismiss };
			if (!UI._ai3Stack) UI._ai3Stack = [];
			UI._ai3Stack.push(handle);
			if (typeof UI._ensureAi3Esc === 'function') UI._ensureAi3Esc();

			setTimeout(function () { try { ta.focus(); ta.select(); } catch (e4) {} }, 50);
		} catch (e) { LOG.warn('诊断报告兜底弹窗失败:', e); }
	};

	

			UI._ai3Stack = [];
	UI._ai3Seq = 0;
	UI._ai3EscInstalled = false;
	UI._ensureAi3Esc = function () {
		if (UI._ai3EscInstalled) return;
		UI._ai3EscInstalled = true;
		try {
									document.addEventListener('keydown', function (e) {
				if (!e || (e.key !== 'Escape' && e.keyCode !== 27)) return;
				if (!UI._ai3Stack || !UI._ai3Stack.length) return;
				e.stopPropagation();
				var top = UI._ai3Stack[UI._ai3Stack.length - 1];
				if (top && top.close) top.close();
			}, true);
		} catch (e) {}
	};

	UI._ai3Dialog = function (title, text, actions, onClose) {
		var c = UI.colors();
								var myId = '_ms_ai3_dlg_' + (++UI._ai3Seq);
		var overlay = document.createElement('div');
		overlay.id = myId;
		overlay.setAttribute('data-ms-ai3', '1');
								var zIndex = 2147483000 + Math.min(UI._ai3Stack.length, 1000);
		overlay.style.cssText = 'position:fixed;inset:0;z-index:' + zIndex + ';background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px;';
		var box = document.createElement('div');
		box.style.cssText = 'width:100%;max-width:580px;max-height:86vh;display:flex;flex-direction:column;background:' + c.bg + ';color:' + c.txt + ';border:1px solid ' + c.border + ';border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.45);font-family:inherit;overflow:hidden;';

		var head = document.createElement('div');
		head.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid ' + c.border + ';flex-shrink:0;';
		var titleEl = document.createElement('div');
		titleEl.style.cssText = 'font-size:15px;font-weight:700;';
		titleEl.textContent = title;
		var closeEl = document.createElement('button');
		closeEl.innerHTML = MS_CONFIG.ICONS.cross;
		closeEl.style.cssText = 'border:none;background:transparent;color:' + c.sub + ';cursor:pointer;padding:4px;';
		closeEl.onclick = function () { dismiss(); };
		head.appendChild(titleEl); head.appendChild(closeEl);

		var body = document.createElement('div');
		body.style.cssText = 'padding:14px 16px;overflow:auto;flex:1;font-size:13px;line-height:1.75;white-space:pre-wrap;word-break:break-word;';
		body.textContent = text || '';

		box.appendChild(head);
		box.appendChild(body);

		if (actions && actions.length) {
			var foot = document.createElement('div');
			foot.style.cssText = 'display:flex;gap:8px;padding:12px 16px;border-top:1px solid ' + c.border + ';flex-wrap:wrap;flex-shrink:0;';
			for (var i = 0; i < actions.length; i++) {
				(function (a) {
					var b = document.createElement('button');
					b.textContent = a.label;
					b.style.cssText = 'flex:1;min-width:110px;padding:10px 12px;border:none;border-radius:9px;font-size:12px;font-weight:600;cursor:pointer;'
						+ (a.kind === 'primary'
							? 'background:linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ');color:#fff;'
							: 'background:' + c.bg3 + ';color:' + c.txt + ';');
					b.onclick = function () { try { a.fn(overlay); } catch (e) { LOG.warn('[ai3] 动作失败:', e); } };
					foot.appendChild(b);
				})(actions[i]);
			}
			box.appendChild(foot);
		}
		overlay.appendChild(box);
		overlay.addEventListener('click', function (e) { if (e.target === overlay) dismiss(); });
		document.body.appendChild(overlay);

		var dismissed = false;
		function dismiss() {
			if (dismissed) return;
			dismissed = true;
			var k = UI._ai3Stack.indexOf(handle);
			if (k >= 0) UI._ai3Stack.splice(k, 1);
			try { overlay.remove(); } catch (e) {}
									try { if (onClose) onClose(); } catch (e) { LOG.warn('[ai3] onClose 失败:', e); }
		}

		var handle = {
			close: dismiss,
			body: body,
			id: myId,
			say: function (t) {
												if (body.textContent === t) return;
				var st = body.scrollTop;
				body.textContent = t;
				body.scrollTop = st;
			}
		};
		UI._ai3Stack.push(handle);
		UI._ensureAi3Esc();
		return handle;
	};

	UI._ai3Progress = function (title, initial, onClose) {
		return UI._ai3Dialog(title, initial || '…', [], onClose);
	};

	

	UI._audioIdConfigured = function () {
		var p = State.config.audioIdProvider;
		if (p === 'acrcloud') return !!(State.config.audioIdAcrHost && State.config.audioIdAcrKey && State.config.audioIdAcrSecret);
		if (p === 'custom') return !!State.config.audioIdCustomUrl;
		return !!String(State.config.audioIdToken || '').trim();
	};

	UI.runAudioId = function () {
				if (State._ai3Busy) { toast(LANG.t('audioIdBusy')); return; }
		if (!UI._audioIdConfigured()) {
			toast(LANG.t('audioIdNeedKey'), '#f59e0b');
			UI.openPanel();
			UI.switchTab('settings');
			State.config.settingsExpanded.audioId = true;
			State.save();
			setTimeout(function () { try { UI.renderSettings(); } catch (e) {} }, 60);
			return;
		}
		State._ai3Busy = true;
		var taskHandle = null;
		var finished = false;
				var dlg = UI._ai3Progress(LANG.t('audioIdRun'), '…', function () {
			if (finished) return; 
			finished = true;
			State._ai3Busy = false;
			UI._ai3Abort = null;
			if (taskHandle) { try { taskHandle.abort(); } catch (e) {} taskHandle = null; }
		});
		taskHandle = AudioID.run({
			seconds: State.config.audioIdSeconds,
			source: State.config.audioIdSource,
			onStage: function (stage, a) {
				if (finished) return;
				if (stage === 'capture') dlg.say(LANG.t('audioIdStageCapture', { s: Math.max(0, a) }));
				else dlg.say(LANG.t('audioIdStageIdentify'));
			}
		}, function (res) {
			if (finished) return; 
			finished = true;
			State._ai3Busy = false;
			UI._ai3Abort = null;
			taskHandle = null;
			dlg.close(); 
			if (res.ok) { UI._showAudioIdResult(res.result); return; }
			var msg = res.reason === 'no-match' ? LANG.t('audioIdNoMatch') : res.reason;
			UI._ai3Dialog(LANG.t('audioIdResult'), '❌ ' + msg, []);
		});
		UI._ai3Abort = function () {
			if (finished) return;
			finished = true;
			State._ai3Busy = false;
			if (taskHandle) { try { taskHandle.abort(); } catch (e) {} taskHandle = null; }
			try { dlg.close(); } catch (e) {}
		};
	};

	UI._showAudioIdResult = function (r) {
		var lines = [];
		lines.push('🎵 ' + (r.title || '?'));
		if (r.artist) lines.push('👤 ' + r.artist);
		if (r.album) lines.push('💿 ' + r.album);
		if (r.releaseDate) lines.push('📅 ' + r.releaseDate);
		if (r.label) lines.push('🏷 ' + r.label);
		if (r.lyrics) lines.push('');
		if (r.lyrics) lines.push(r.lyrics);
		var text = lines.join('\n');

		var actions = [{
			label: LANG.t('audioIdCopyInfo'), kind: 'primary',
			fn: function () { copyText(AudioID.format(r)); toast(LANG.t('audioIdCopiedInfo')); }
		}];
		for (var i = 0; i < (r.links || []).length && i < 3; i++) {
			(function (l) {
				if (!/^https?:\/\//i.test(l.url)) return;
				actions.push({ label: l.label, fn: function () { try { window.open(l.url, '_blank', 'noopener'); } catch (e) {} } });
			})(r.links[i]);
		}
		actions.push({
			label: LANG.t('webdavBackup'),
			fn: function () {
				if (!WebDAV.enabled()) { toast(LANG.t('webdavNeedConfig'), '#f59e0b'); return; }
				WebDAV.backup(function (err, res) {
															if (err) { toast(LANG.t('webdavBackupFail', { e: err.message }), '#ef4444'); return; }
					toast(LANG.t('webdavBackupOk', { kb: Math.round((res && res.bytes || 0) / 1024) }));
				});
			}
		});
		UI._ai3Dialog(LANG.t('audioIdResult'), text, actions);
	};

	

	UI.runTranscribe = function (url, title) {
				if (State._ai3Busy) { toast(LANG.t('transcribeBusy')); return; }
		if (!Transcribe.ready()) {
			toast(LANG.t('transcribeNoKey'), '#f59e0b');
			UI.openPanel(); UI.switchTab('settings');
			State.config.settingsExpanded.transcribe = true;
			State.save();
			setTimeout(function () { try { UI.renderSettings(); } catch (e) {} }, 60);
			return;
		}
		if (!url) { toast(LANG.t('transcribeNoKey'), '#f59e0b'); return; }
		State._ai3Busy = true;
		var taskHandle = null;
		var finished = false;
						var dlg = UI._ai3Progress(LANG.t('transcribeRun'), '…', function () {
			if (finished) return;
			finished = true;
			State._ai3Busy = false;
			UI._ai3Abort = null;
			if (taskHandle) { try { taskHandle.abort(); } catch (e) {} taskHandle = null; }
		});
		taskHandle = Transcribe.run({
			url: url, title: title,
			summarize: Transcribe.summaryReady(),
			style: State.config.aiPromptStyle,
			onStage: function (stage, a, b) {
				if (finished) return;
				if (stage === 'fetch') dlg.say(LANG.t('transcribeStageFetch') + (b > 0 ? ' ' + Math.round(a / b * 100) + '%' : ''));
				else if (stage === 'decode') dlg.say(LANG.t('transcribeStageDecode'));
				else if (stage === 'asr') dlg.say(LANG.t('transcribeStageAsr', { i: a, n: b }));
				else if (stage === 'upload') dlg.say(LANG.t('transcribeStageUpload') + (b > 0 ? ' ' + Math.round(a / b * 100) + '%' : ''));
				else if (stage === 'summary') dlg.say(LANG.t('transcribeStageSummary'));
			}
		}, function (res) {
			if (finished) return;
			finished = true;
			State._ai3Busy = false;
			UI._ai3Abort = null;
			taskHandle = null;
			dlg.close();
			if (!res.ok) { UI._ai3Dialog(LANG.t('transcribeResult'), '❌ ' + res.reason, []); return; }
			UI._showTranscribeResult(res.result);
		});
		UI._ai3Abort = function () {
			if (finished) return;
			finished = true;
			State._ai3Busy = false;
			if (taskHandle) { try { taskHandle.abort(); } catch (e) {} taskHandle = null; }
			try { dlg.close(); } catch (e) {}
		};
	};

	UI._showTranscribeResult = function (rec) {
		var parts = [];
						if (rec && rec.truncated) {
			parts.push('⚠ ' + LANG.t('transcribeHistoryTruncated', { n: Transcribe.HISTORY_TEXT_MAX }));
			parts.push('');
		}
		if (rec.summary) { parts.push('【AI 摘要】\n' + rec.summary); parts.push(''); }
		if (rec.reason) parts.push(LANG.t('transcribeSummaryFailed', { e: rec.reason }));
		parts.push('【全文】');
		parts.push(rec.text || '');
		var text = parts.join('\n');

		var md = Transcribe.toMarkdown(rec);
		var baseName = SEC.safeFilename(String(rec.title || 'transcript').slice(0, 60) || 'transcript');
		var actions = [
			{ label: LANG.t('transcribeCopyText'), kind: 'primary', fn: function () { copyText(text); toast(LANG.t('transcribeCopyText')); } },
			{ label: LANG.t('transcribeCopyMd'), fn: function () { copyText(md); toast(LANG.t('transcribeCopyMd')); } },
			{
				label: LANG.t('transcribeSaveMd'), fn: function () {
					try {
						var blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
						Dl.fallback(URL.createObjectURL(blob), baseName + '.md', null);
					} catch (e) { toast(String(e.message), '#ef4444'); }
				}
			},
			{
				label: LANG.t('webdavBackup'), fn: function () {
					if (!WebDAV.enabled()) { toast(LANG.t('webdavNeedConfig'), '#f59e0b'); return; }
					try {
						var blob2 = new Blob([md], { type: 'text/markdown;charset=utf-8' });
						WebDAV.uploadBlob(blob2, baseName + '.md', function (err) {
							if (err) { toast(String(err.message), '#ef4444'); return; }
							toast(LANG.t('webdavUploaded', { name: baseName + '.md' }));
						});
					} catch (e) { toast(String(e.message), '#ef4444'); }
				}
			}
		];
		UI._ai3Dialog(LANG.t('transcribeResult'), text, actions);
	};
									UI._BRAND_IMG = 'data:image/jpeg;base64,'
		+ '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'
		+ 'AAGAAAEgAAAAAAAAEgEgAAACAAAAAAAAAEwgUAAAEgkAAAAgAAEAgAkgAEEgQAAAkAAgAAAAAAEkEAAAEQAECQAEAAggAAkAAAEAAAEEAkEEkAgAgAAgkigEAAAEgAkAEAAEEAgkkAkAAEAEkAAGkgAAAAAAggEkggEAgEgEgkEQkAEkgAAAEAEgEEgAAkkkkkgA0kAkSEkEEAkkkAEAEAAAAEAAgEAAAgAmkggAAEggAAAAkEkEAAAAgAAAggAAAgAEAEMEEgAkEAkAAAgAAEEAAEAkAikAEAgAAAAgEgEkgAAAAEgAgggEggAAAkEEEAgAAAAAAAAACAgAAAAgEAAkAAAEkAAAEEEAkkAAAAAEEAEggAkEAAgkkAAEggggAAAAEkwAAAAAACAAAAAAAkAAEgAAEgkAAAAAEgAEAEkggAAEEAAAAAEAAAEAAAAkAAggAEEgAAAEAAgAAgAgAEkEkAAAAAkkgkAEAEAAAAkAgAAAAgEAkAEAEgAAAgAgkAEgkAgEgAEEgAEkkEgAAAEkgEkAAEgkgggEAAkgggAkAAAEAggAEgAAEAgEgAAAA0AAgkAEEgkkEAAEAgEkAAkkkkgAAAAEAEEgEAgkAEAkAAAEAgwkAEAEAkEAAAEgAEgEgEgAAAAAgkAkggAggAAAAAAAAEggEggAgQAEggAEEAAAAAEkAAAgAAAEkAAAgAAAkkkgkAEgkAFAAAAAgGkAEkAgAECgAAEgAkEAAEkAAiAAAEEikEkg'
		+ 'kgAAEkkAEkAAgggAAgAEgAgAAAEgAQEAgAAAkEAgEAggEAAgAEgggkEEkgEAAEkggAEkAAEAAAAAAAggAAgAAAEgACgAgEgoAgEAAJAAEAAEAggEkEgAkAAkEkAgkEgAkggggEUUEgIEACEFgAggEAEkgkAEgkgAAmAAAkEpAkkgkgAAAgkkEkAkgAAEAAEAkEEgEEkEgkkkgAgAAgAkAAkAAkkAAAAkEAgkkkggAAEkgkEgkkkAAAAAAAAEAAAgkAAkAAgAAAAAAAAAAEEgAAAAAAAAEAEkkAAAkgkkgkAkAEkAggkgAkkEAkAAAAAkAAEAAAAEgAAAAgAAAAkEkkkEAgAAAkEEEkkkkAEAkEAEEEkkEkEgAAAACAAAAAAgAAAAAgAAAAAAAEAkgkgAgAAgEgAEEkgEAkkgkgkggEEggEgAEAAEEgAAGgAAAEkQAAkkAAAAAggEEEAAkgkEEEEkEgEAkEEAgEEkkggEAAA0AmE0wEkEAmGAiWghgmAAkAAgAAAAAAgEkEkAEkEEkkggkAkAkkkAgQgAEAAggAkA6A26cHmmCGEiCiUgAgAAgAAgkgkkAEgEkgggAkAEEAEkAAAgAAAAAiioiGgiQzAEnkEwE0ggEEkAAAAAAEgEkggkAggkAgkgAkkEgEkEEEhgAAkEEgkEAkAgEAgAgkEggAAkEAAAAAAgEAEEAAEEkkkgAgEgkgEkgAAgAEggAAAAEAAEAAAAAAAEAAAgEkkkEAAAgAkkAggE'
		+ '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'
		;

	UI.renderSettings = function () {
		var box = document.getElementById('_ms_box');
		if (!box) return;
		var c = UI.colors();
		box.innerHTML = '';
		var container = document.createElement('div');
		container.style.cssText = 'padding:12px 14px;';

		function makeGroup(id, title, contentNode) {
			var expanded = State.config.settingsExpanded[id] !== false;
			var wrap = document.createElement('div');
			wrap.style.cssText = 'border-radius:12px;background:' + c.bg2 + ';border:1px solid ' + c.border + ';margin-bottom:14px;overflow:hidden;';
			var header = document.createElement('div');
			header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:12px 14px;cursor:pointer;user-select:none;-webkit-user-select:none;';
			var titleEl = document.createElement('div');
			titleEl.style.cssText = 'font-size:13px;font-weight:600;color:' + c.txt + ';';
			titleEl.textContent = title;
			var arrow = document.createElement('span');
			arrow.innerHTML = expanded ? '▼' : MS_CONFIG.ICONS.arrowRight;
			arrow.style.cssText = 'font-size:12px;color:' + c.sub + ';';
			header.appendChild(titleEl);
			header.appendChild(arrow);
			var body = document.createElement('div');
			body.style.cssText = 'padding:0 14px 14px 14px;display:' + (expanded ? 'block' : 'none') + ';';
			body.appendChild(contentNode);
			header.addEventListener('click', function () {
				State.config.settingsExpanded[id] = !expanded;
				State.save();
				UI.renderSettings();
			});
			wrap.appendChild(header);
			wrap.appendChild(body);
			return wrap;
		}

				var themeRow = document.createElement('div');
		themeRow.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px;';
		var themes = [['auto', LANG.t('themeAuto')], ['light', LANG.t('themeLight')], ['dark', LANG.t('themeDark')]];
		for (var ti = 0; ti < themes.length; ti++) {
			(function (t) {
				var b = document.createElement('button');
				b.textContent = t[1];
				var active = State.config.theme === t[0];
				b.style.cssText = 'width:100%;min-width:0;padding:10px;border:none;border-radius:10px;background:' + (active ? 'linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ')' : c.bg3) + ';color:' + (active ? '#fff' : c.txt) + ';font-size:13px;font-weight:600;cursor:pointer;' + (active ? 'box-shadow:0 4px 12px ' + c.primary + '4d;' : '');
				b.addEventListener('click', function () { State.config.theme = t[0]; State.save(true); applyPanelThemeNow(); UI.renderSettings(); toast(LANG.t('saved')); });
				themeRow.appendChild(b);
			})(themes[ti]);
		}
		container.appendChild(makeGroup('theme', LANG.t('grpTheme'), themeRow));

				var styleWrap = document.createElement('div');
		var styleDesc = document.createElement('div');
		styleDesc.textContent = LANG.t('uiStyleDesc');
		styleDesc.style.cssText = 'font-size:12px;color:' + c.sub + ';margin-bottom:10px;';
		styleWrap.appendChild(styleDesc);
		var styleRow = document.createElement('div');
		styleRow.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px;';
		var styles = [
			['normal', LANG.t('uiStyleNormal')],
			['material', LANG.t('uiStyleMaterial')],
			['ios27', LANG.t('uiStyleIos27')],
			['neumorph', LANG.t('uiStyleNeumorph')],
			['brutal', LANG.t('uiStyleBrutal')],
			['terminal', LANG.t('uiStyleTerminal')]
		];
		for (var si = 0; si < styles.length; si++) {
			(function (s) {
				var b = document.createElement('button');
				b.textContent = s[1];
				var active = State.config.uiStyle === s[0];
				b.style.cssText = 'width:100%;min-width:0;padding:10px;border:none;border-radius:10px;background:' + (active ? 'linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ')' : c.bg3) + ';color:' + (active ? '#fff' : c.txt) + ';font-size:13px;font-weight:600;cursor:pointer;' + (active ? 'box-shadow:0 4px 12px ' + c.primary + '4d;' : '');
				b.addEventListener('click', function () { UI.setUiStyle(s[0]); toast(LANG.t('saved')); });
				styleRow.appendChild(b);
			})(styles[si]);
		}
		styleWrap.appendChild(styleRow);
		container.appendChild(makeGroup('uiStyle', LANG.t('grpUiStyle'), styleWrap));

				var palWrap = document.createElement('div');
		var palRow = document.createElement('div');
		palRow.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill, minmax(72px, 1fr));gap:10px;';
		function renderPaletteGrid() {
			palRow.innerHTML = '';
			var palettes = UI.listPalettes();
			var curPal = UI.getPalette();
			for (var pi = 0; pi < palettes.length; pi++) {
				(function (pal) {
					var item = document.createElement('div');
					item.title = pal.name;
					var active = curPal === pal.id;
					var sw1 = pal.swatch[0], sw2 = pal.swatch[1];
					item.style.cssText = 'cursor:pointer;text-align:center;position:relative;';
					var chip = document.createElement('div');
					chip.style.cssText = 'width:100%;height:36px;border-radius:10px;background:linear-gradient(135deg,' + sw1 + ',' + sw2 + ');border:2px solid ' + (active ? c.txt : 'transparent') + ';' + (active ? 'box-shadow:0 4px 12px ' + sw1 + '59;' : '');
					var label = document.createElement('div');
					label.textContent = pal.name;
					label.style.cssText = 'margin-top:6px;font-size:11px;color:' + (active ? c.primary : c.sub) + ';font-weight:' + (active ? '600' : '400') + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
					item.appendChild(chip);
					item.appendChild(label);
					if (pal.custom) {
						var del = document.createElement('span');
						del.textContent = '×';
						del.style.cssText = 'position:absolute;top:-4px;right:-4px;width:16px;height:16px;line-height:16px;border-radius:50%;background:#ef4444;color:#fff;font-size:11px;text-align:center;cursor:pointer;z-index:2;';
						del.onclick = function (e) { e.stopPropagation(); if (!confirm(LANG.t('confirmDeletePalette'))) return; UI.removeCustomPalette(pal.id); renderPaletteGrid(); toast(LANG.t('pluginDeleted')); };
						item.appendChild(del);
					}
					item.addEventListener('click', function () { UI.setPalette(pal.id); toast(LANG.t('saved')); });
					palRow.appendChild(item);
				})(palettes[pi]);
			}
		}
		renderPaletteGrid();
		palWrap.appendChild(palRow);

				var customPalTitle = document.createElement('div');
		customPalTitle.textContent = LANG.t('paletteAddCustom');
		customPalTitle.style.cssText = 'font-size:13px;font-weight:700;color:' + c.txt + ';margin-top:14px;margin-bottom:8px;';
		palWrap.appendChild(customPalTitle);

		var customPalForm = document.createElement('div');
		customPalForm.style.cssText = 'padding:10px;border-radius:10px;background:' + c.bg2 + ';border:1px solid ' + c.border + ';';
		function colorInput(label, val) {
			var row = document.createElement('div');
			row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;';
			var lab = document.createElement('label');
			lab.textContent = label;
			lab.style.cssText = 'font-size:11px;color:' + c.sub + ';width:70px;flex-shrink:0;';
			var inp = document.createElement('input');
			inp.type = 'color'; inp.value = val;
			inp.style.cssText = 'width:32px;height:24px;border:none;padding:0;background:none;cursor:pointer;';
			var txt = document.createElement('input');
			txt.type = 'text'; txt.value = val;
			txt.style.cssText = 'flex:1;padding:5px 8px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;';
			inp.addEventListener('input', function () { txt.value = inp.value; });
			txt.addEventListener('input', function () { if (/^#[0-9a-fA-F]{6}$/.test(txt.value)) inp.value = txt.value; });
			row.appendChild(lab); row.appendChild(inp); row.appendChild(txt);
			return { row: row, inp: inp, txt: txt };
		}
		var cpName = document.createElement('input');
		cpName.type = 'text'; cpName.placeholder = LANG.t('paletteName');
		cpName.style.cssText = 'width:100%;padding:6px 8px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;box-sizing:border-box;margin-bottom:8px;';
		customPalForm.appendChild(cpName);
		var cpLP = colorInput(LANG.t('paletteLightPrimary'), '#6366f1');
		var cpLS = colorInput(LANG.t('paletteLightSecondary'), '#8b5cf6');
		var cpDP = colorInput(LANG.t('paletteDarkPrimary'), '#818cf8');
		var cpDS = colorInput(LANG.t('paletteDarkSecondary'), '#a78bfa');
		customPalForm.appendChild(cpLP.row);
		customPalForm.appendChild(cpLS.row);
		customPalForm.appendChild(cpDP.row);
		customPalForm.appendChild(cpDS.row);

		var cpSave = document.createElement('button');
		cpSave.innerHTML = MS_CONFIG.ICONS.save + ' ' + LANG.t('ok');
		cpSave.style.cssText = 'width:100%;padding:8px;border:none;border-radius:8px;background:linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ');color:#fff;font-size:12px;font-weight:600;cursor:pointer;margin-top:4px;';
		cpSave.onclick = function () {
			var name = cpName.value.trim();
			if (!name) { toast(LANG.t('plsInputText'), '#f59e0b'); return; }
			var id = 'custom_' + Date.now();
			UI.addCustomPalette({
				id: id,
				name: name,
				light: { primary: cpLP.txt.value, primary2: cpLS.txt.value },
				dark: { primary: cpDP.txt.value, primary2: cpDS.txt.value }
			});
			cpName.value = '';
			renderPaletteGrid();
			UI.setPalette(id);
			toast(LANG.t('pluginSaved'));
		};
		customPalForm.appendChild(cpSave);
		palWrap.appendChild(customPalForm);

		container.appendChild(makeGroup('palette', LANG.t('grpPalette'), palWrap));

				var tplInput = document.createElement('input');
		tplInput.type = 'text';
		tplInput.value = State.config.nameTpl;
		tplInput.style.cssText = 'width:100%;padding:8px 10px;border:1px solid ' + c.border + ';border-radius:8px;font-size:13px;background:' + c.bg + ';color:' + c.txt + ';box-sizing:border-box;';
		tplInput.addEventListener('change', function () { State.config.nameTpl = tplInput.value || '{域名}_{日期}_{序号}_{后缀}'; State.save(); toast(LANG.t('saved')); });
		container.appendChild(makeGroup('nameTpl', LANG.t('grpNameTpl'), tplInput));

				var confRow = document.createElement('div');
		confRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center;';
		function numSetting(label, key, min, max, step, parent) {
			var row = document.createElement('div');
			row.style.cssText = 'display:flex;align-items:center;gap:6px;';
			var lab = document.createElement('label');
			lab.style.cssText = 'font-size:12px;color:' + c.sub + ';';
			lab.textContent = label;
			var inp = document.createElement('input');
			inp.type = 'number'; inp.min = min; inp.max = max; inp.step = step; inp.value = State.config[key];
			inp.style.cssText = 'width:70px;padding:5px 8px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;';
			inp.addEventListener('change', function () {
				var v = parseFloat(inp.value);
				if (!isNaN(v) && v >= min && v <= max) { State.config[key] = v; State.save(); toast(LANG.t('saved')); }
			});
			row.appendChild(lab); row.appendChild(inp);
			(parent || confRow).appendChild(row);
			return row;
		}
		numSetting(LANG.t('concurrency'), 'batchConcurrency', 1, 8, 1, confRow);
		numSetting(LANG.t('intervalMs'), 'batchDelay', 50, 5000, 100, confRow);
		numSetting(LANG.t('retries'), 'batchRetry', 0, 5, 1, confRow);
		container.appendChild(makeGroup('batch', LANG.t('grpBatch'), confRow));

				var aria2Content = document.createElement('div');
		function aria2Input(label, key) {
			var row = document.createElement('div');
			row.style.cssText = 'margin-bottom:8px;';
			var lab = document.createElement('label');
			lab.style.cssText = 'font-size:12px;color:' + c.txt + ';display:block;margin-bottom:4px;';
			lab.textContent = label;
			var inp = document.createElement('input');
			inp.type = 'text';
			inp.value = State.config[key] || '';
			inp.style.cssText = 'width:100%;padding:8px 10px;border:1px solid ' + c.border + ';border-radius:8px;font-size:12px;background:' + c.bg + ';color:' + c.txt + ';box-sizing:border-box;';
			inp.addEventListener('change', function () { State.config[key] = inp.value; State.save(); toast(LANG.t('saved')); });
			row.appendChild(lab); row.appendChild(inp);
			return row;
		}
		aria2Content.appendChild(aria2Input(LANG.t('aria2RpcUrl'), 'aria2RpcUrl'));
		aria2Content.appendChild(aria2Input(LANG.t('aria2RpcSecret'), 'aria2RpcSecret'));
		container.appendChild(makeGroup('aria2', LANG.t('grpAria2'), aria2Content));

				var m3u8Row = document.createElement('div');
		m3u8Row.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center;';
		var qualitySel = document.createElement('select');
		qualitySel.style.cssText = 'padding:8px 10px;border:1px solid ' + c.border + ';border-radius:8px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;';
		var qOpts = [
			['auto', LANG.t('qualityAuto')],
			['high', LANG.t('qualityHigh')],
			['medium', LANG.t('qualityMedium')],
			['low', LANG.t('qualityLow')]
		];
		for (var qi = 0; qi < qOpts.length; qi++) {
			var opt = document.createElement('option');
			opt.value = qOpts[qi][0]; opt.textContent = qOpts[qi][1];
			if (qOpts[qi][0] === State.config.m3u8Quality) opt.selected = true;
			qualitySel.appendChild(opt);
		}
		qualitySel.addEventListener('change', function () { State.config.m3u8Quality = qualitySel.value; State.save(); toast(LANG.t('saved')); });
		var qLabel = document.createElement('label');
		qLabel.style.cssText = 'font-size:12px;color:' + c.sub + ';';
		qLabel.textContent = LANG.t('qualityLabel');
		m3u8Row.appendChild(qLabel); m3u8Row.appendChild(qualitySel);
		var segLabel = LANG.t('segmentsLabel');
				numSetting(segLabel, 'm3u8Concurrency', 1, 8, 1, m3u8Row);
		container.appendChild(makeGroup('m3u8', LANG.t('grpM3u8'), m3u8Row));

				var headersContent = document.createElement('div');
		function headerInput(label, key) {
			var row = document.createElement('div');
			row.style.cssText = 'margin-bottom:8px;';
			var lab = document.createElement('label');
			lab.style.cssText = 'font-size:12px;color:' + c.txt + ';display:block;margin-bottom:4px;';
			lab.textContent = label;
			var inp = document.createElement('input');
			inp.type = 'text';
			inp.value = State.config.customHeaders[key] || '';
			inp.style.cssText = 'width:100%;padding:8px 10px;border:1px solid ' + c.border + ';border-radius:8px;font-size:12px;background:' + c.bg + ';color:' + c.txt + ';box-sizing:border-box;';
			inp.addEventListener('change', function () { State.config.customHeaders[key] = inp.value; State.save(); toast(LANG.t('saved')); });
			row.appendChild(lab); row.appendChild(inp);
			return row;
		}
		headersContent.appendChild(headerInput(LANG.t('referer'), 'Referer'));
		headersContent.appendChild(headerInput(LANG.t('userAgent'), 'UserAgent'));
		headersContent.appendChild(headerInput(LANG.t('cookie'), 'Cookie'));
		container.appendChild(makeGroup('headers', LANG.t('grpHeaders'), headersContent));

				var logSel = document.createElement('select');
		logSel.style.cssText = 'padding:8px 10px;border:1px solid ' + c.border + ';border-radius:8px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;';
		var logOpts = [[0, LANG.t('logDebug')], [1, LANG.t('logInfo')], [2, LANG.t('logWarn')], [3, LANG.t('logError')]];
		for (var li = 0; li < logOpts.length; li++) {
			var opt = document.createElement('option');
			opt.value = logOpts[li][0]; opt.textContent = logOpts[li][1];
			if (logOpts[li][0] === State.config.logLevel) opt.selected = true;
			logSel.appendChild(opt);
		}
		logSel.addEventListener('change', function () { State.config.logLevel = parseInt(logSel.value, 10); LOG.setLevel(State.config.logLevel); State.save(); toast(LANG.t('logLevelChanged')); });
		container.appendChild(makeGroup('log', LANG.t('grpLog'), logSel));

				var ob = document.createElement('div');
		ob.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';
		function mkOBtn(label, color, handler, flex, icon) {
			var b = document.createElement('button');
			b.appendChild(UI.iconTextEl(icon || '', label));
			b.style.cssText = (flex ? 'flex:' + flex + ';' : 'flex:1;') + 'min-width:100px;padding:10px 12px;border:none;border-radius:10px;background:' + color + ';color:#fff;font-size:13px;cursor:pointer;font-weight:600;display:inline-flex;align-items:center;justify-content:center;gap:6px;';
			b.addEventListener('click', handler); ob.appendChild(b);
		}
		mkOBtn(LANG.t('rescan'), 'linear-gradient(135deg,#6366f1,#8b5cf6)', function () { Scanner.doFull(function () { toast(LANG.t('rescanDone')); UI.renderMedia(State.tab); }); });
		mkOBtn(LANG.t('exportAllConfig'), '#10b981', function () { copyText(State.exportConfig()); }, 1.3);
		mkOBtn(LANG.t('importConfig'), '#f59e0b', function () {
			var t = prompt(LANG.t('pasteJson'));
			if (!t) return;
			var res = State.importConfig(t);
			if (res.ok) { toast(res.msg); applyPanelThemeNow(); UI.renderSettings(); }
			else toast(res.msg, '#ef4444');
		}, 1.3, MS_CONFIG.ICONS.download);
		mkOBtn(LANG.t('resetAll'), '#ef4444', function () {
			if (!confirm(LANG.t('confirmReset'))) return;
			State.resetConfig(); applyPanelThemeNow(); toast(LANG.t('resetDone')); UI.renderSettings();
		}, 1.2);
		container.appendChild(makeGroup('other', LANG.t('grpOther'), ob));

				var langContainer = document.createElement('div');
		langContainer.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;';
		var langs = [['zh-CN', '简体中文'], ['en-US', 'English'], ['ja-JP', '日本語'], ['ko-KR', '한국어']];
		for (var li = 0; li < langs.length; li++) {
			(function (l) {
				var lb = document.createElement('button');
				lb.textContent = l[1] + ' (' + l[0] + ')';
				lb.style.cssText = 'padding:8px 14px;border:none;border-radius:8px;background:' + (State.config.uiLang === l[0] ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : c.bg3) + ';color:' + (State.config.uiLang === l[0] ? '#fff' : c.sub) + ';font-size:12px;font-weight:' + (State.config.uiLang === l[0] ? '700' : '500') + ';cursor:pointer;';
				lb.onclick = function () {
					State.config.uiLang = l[0];
					State.save(true); 
					toast(LANG.t('saved'));
																				UI.refreshPanelTexts();
				};
				langContainer.appendChild(lb);
			})(langs[li]);
		}
		container.appendChild(makeGroup('lang', LANG.t('grpLang'), langContainer));

				var drContent = document.createElement('div');
		var drText = document.createElement('textarea');
		drText.style.cssText = 'width:100%;min-height:80px;padding:8px;border:1px solid ' + c.border + ';border-radius:8px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;font-family:monospace;box-sizing:border-box;resize:vertical;';
		var drLines = [];
		if (State.config.domainRules && State.config.domainRules.length > 0) {
			for (var di = 0; di < State.config.domainRules.length; di++) {
				var r = State.config.domainRules[di];
				drLines.push((r.domain || '') + ',' + (r.img ? 1 : 0) + ',' + (r.video ? 1 : 0) + ',' + (r.audio ? 1 : 0) + ',' + (r.depth || 1));
			}
		}
		drText.value = drLines.join('\n');
		drContent.appendChild(drText);
		var drBtn = document.createElement('button');
		drBtn.innerHTML = MS_CONFIG.ICONS.save + ' ' + LANG.t('saveRules');
		drBtn.style.cssText = 'margin-top:8px;padding:8px 14px;border:none;border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:12px;font-weight:600;cursor:pointer;';
		drBtn.onclick = function () {
			var lines = drText.value.split(/[\r\n]+/).filter(function (l) { return l.trim().length > 0; });
			var rules = [];
			for (var ri = 0; ri < lines.length; ri++) {
				var parts = lines[ri].split(',').map(function (p) { return p.trim(); });
				if (parts.length >= 2) {
					rules.push({
						domain: parts[0],
						img: parseInt(parts[1], 10) === 1,
						video: parts.length > 2 ? parseInt(parts[2], 10) === 1 : true,
						audio: parts.length > 3 ? parseInt(parts[3], 10) === 1 : true,
						depth: parts.length > 4 ? Math.max(0, Math.min(2, parseInt(parts[4], 10) || 1)) : 1
					});
				}
			}
			State.config.domainRules = rules;
			State.save();
			toast(LANG.t('rulesSaved', { n: rules.length }));
			UI.renderSettings();
		};
		drContent.appendChild(drBtn);
		container.appendChild(makeGroup('domainRules', LANG.t('grpDomainRules'), drContent));

										if (!UI._settingsState) UI._settingsState = {};
		if (typeof UI._settingsState.pluginTab !== 'string') UI._settingsState.pluginTab = 'rules';
		var pluginContent = document.createElement('div');
		var pluginDesc = document.createElement('div');
		pluginDesc.textContent = UI._settingsState.pluginTab === 'rules' ? LANG.t('pluginRulesDesc') : LANG.t('pluginParsersDesc');
		pluginDesc.style.cssText = 'font-size:12px;color:' + c.sub + ';margin-bottom:10px;';
		pluginContent.appendChild(pluginDesc);

		var pluginTabWrap = document.createElement('div');
		pluginTabWrap.style.cssText = 'display:flex;gap:8px;margin-bottom:12px;';
		var pluginTabs = [['rules', LANG.t('pluginRules')], ['parsers', LANG.t('pluginParsers')]];
		function updatePluginTabStyles() {
			var btns = pluginTabWrap.querySelectorAll('button');
			for (var bi = 0; bi < btns.length; bi++) {
				var isActive = pluginTabs[bi][0] === UI._settingsState.pluginTab;
				btns[bi].style.background = isActive ? 'linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ')' : c.bg3;
				btns[bi].style.color = isActive ? '#fff' : c.txt;
			}
			pluginDesc.textContent = UI._settingsState.pluginTab === 'rules' ? LANG.t('pluginRulesDesc') : LANG.t('pluginParsersDesc');
		}
		for (var pti = 0; pti < pluginTabs.length; pti++) {
			(function (pt) {
				var b = document.createElement('button');
				b.textContent = pt[1];
				b.style.cssText = 'flex:1;padding:10px;border:none;border-radius:10px;background:' + (UI._settingsState.pluginTab === pt[0] ? 'linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ')' : c.bg3) + ';color:' + (UI._settingsState.pluginTab === pt[0] ? '#fff' : c.txt) + ';font-size:13px;font-weight:600;cursor:pointer;';
				b.addEventListener('click', function () {
					UI._settingsState.pluginTab = pt[0];
					rulesSection.style.display = UI._settingsState.pluginTab === 'rules' ? 'block' : 'none';
					parsersSection.style.display = UI._settingsState.pluginTab === 'parsers' ? 'block' : 'none';
					updatePluginTabStyles();
				});
				pluginTabWrap.appendChild(b);
			})(pluginTabs[pti]);
		}
		pluginContent.appendChild(pluginTabWrap);

		var rulesSection = document.createElement('div');
		rulesSection.style.display = UI._settingsState.pluginTab === 'rules' ? 'block' : 'none';
		var ruleListWrap = document.createElement('div');
		rulesSection.appendChild(ruleListWrap);

		function renderRuleList() {
			ruleListWrap.innerHTML = '';
			var rules = Plugins.listRules();
			if (rules.length === 0) {
				var empty = document.createElement('div');
				empty.style.cssText = 'font-size:12px;color:' + c.sub + ';padding:8px 0;';
				empty.textContent = LANG.t('noRules');
				ruleListWrap.appendChild(empty);
			} else {
				for (var ri = 0; ri < rules.length; ri++) {
					(function (rule) {
						var row = document.createElement('div');
						row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px;border-radius:8px;background:' + c.bg + ';border:1px solid ' + c.border + ';margin-bottom:8px;flex-wrap:wrap;';
						var info = document.createElement('div');
						info.style.cssText = 'flex:1;min-width:140px;';
						var nameEl = document.createElement('div');
						nameEl.style.cssText = 'font-size:13px;font-weight:600;color:' + c.txt + ';';
						nameEl.textContent = rule.name || rule.pattern;
						var metaEl = document.createElement('div');
						metaEl.style.cssText = 'font-size:11px;color:' + c.sub + ';margin-top:2px;';
						metaEl.textContent = (rule.action === 'allow' ? LANG.t('pluginRuleAllow') : LANG.t('pluginRuleBlock')) + ' · ' + rule.type + ' · ' + rule.pattern;
						info.appendChild(nameEl); info.appendChild(metaEl);
						row.appendChild(info);
						var toggle = UI.createToggle(rule.enabled, function (val) {
							Plugins.updateRule(rule.id, { enabled: val });
							toast(LANG.t('saved'));
						});
						toggle.style.flexShrink = '0';
						row.appendChild(toggle);
						var editBtn = document.createElement('button');
						editBtn.textContent = LANG.t('edit');
						editBtn.style.cssText = 'padding:5px 10px;border:none;border-radius:6px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:12px;cursor:pointer;font-weight:600;';
						editBtn.onclick = function () { showRuleForm(rule); };
						row.appendChild(editBtn);
						var delBtn = document.createElement('button');
						delBtn.textContent = LANG.t('delete');
						delBtn.style.cssText = 'padding:5px 10px;border:none;border-radius:6px;background:#ef4444;color:#fff;font-size:12px;cursor:pointer;font-weight:600;';
						delBtn.onclick = function () {
							if (!confirm(LANG.t('confirmDeleteRule'))) return;
							Plugins.removeRule(rule.id);
							renderRuleList();
							toast(LANG.t('pluginDeleted'));
						};
						row.appendChild(delBtn);
						ruleListWrap.appendChild(row);
					})(rules[ri]);
				}
			}
		}

		var ruleEditingId = null;
		var ruleFormWrap = document.createElement('div');
		ruleFormWrap.style.cssText = 'margin-top:10px;padding:12px;border-radius:10px;background:' + c.bg2 + ';border:1px solid ' + c.border + ';';
		var ruleFormTitle = document.createElement('div');
		ruleFormTitle.style.cssText = 'font-size:13px;font-weight:700;color:' + c.txt + ';margin-bottom:10px;';
		ruleFormTitle.innerHTML = MS_CONFIG.ICONS.plus + ' ' + LANG.t('addRule');
		ruleFormWrap.appendChild(ruleFormTitle);

		var ruleNameInp = document.createElement('input');
		ruleNameInp.type = 'text'; ruleNameInp.placeholder = LANG.t('pluginRuleName');
		ruleNameInp.style.cssText = 'width:100%;padding:7px 10px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;box-sizing:border-box;margin-bottom:8px;';
		ruleFormWrap.appendChild(ruleNameInp);
		var rulePatternInp = document.createElement('input');
		rulePatternInp.type = 'text'; rulePatternInp.placeholder = LANG.t('pluginRulePattern');
		rulePatternInp.style.cssText = ruleNameInp.style.cssText;
		ruleFormWrap.appendChild(rulePatternInp);

		var ruleTypeSel = document.createElement('select');
		ruleTypeSel.style.cssText = 'width:48%;padding:7px 10px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;box-sizing:border-box;margin-bottom:8px;margin-right:2%;';
		var ruleTypeOpts = [['host', LANG.t('pluginRuleHost')], ['url', LANG.t('pluginRuleUrl')], ['regex', LANG.t('pluginRuleRegex')]];
		for (var rti = 0; rti < ruleTypeOpts.length; rti++) {
			var opt = document.createElement('option');
			opt.value = ruleTypeOpts[rti][0]; opt.textContent = ruleTypeOpts[rti][1];
			ruleTypeSel.appendChild(opt);
		}
		ruleFormWrap.appendChild(ruleTypeSel);
		var ruleActionSel = document.createElement('select');
		ruleActionSel.style.cssText = 'width:48%;padding:7px 10px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;box-sizing:border-box;margin-bottom:8px;';
		var ruleActionOpts = [['allow', LANG.t('pluginRuleAllow')], ['block', LANG.t('pluginRuleBlock')]];
		for (var rai = 0; rai < ruleActionOpts.length; rai++) {
			var opt = document.createElement('option');
			opt.value = ruleActionOpts[rai][0]; opt.textContent = ruleActionOpts[rai][1];
			ruleActionSel.appendChild(opt);
		}
		ruleFormWrap.appendChild(ruleActionSel);

		var ruleEnabledRow = document.createElement('div');
		ruleEnabledRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;';
		var ruleEnabledLabel = document.createElement('span');
		ruleEnabledLabel.textContent = LANG.t('enabled');
		ruleEnabledLabel.style.cssText = 'font-size:12px;color:' + c.txt + ';';
		var ruleEnabledCb = document.createElement('input');
		ruleEnabledCb.type = 'checkbox'; ruleEnabledCb.checked = true;
		ruleEnabledCb.style.cssText = 'width:18px;height:18px;cursor:pointer;';
		ruleEnabledRow.appendChild(ruleEnabledLabel); ruleEnabledRow.appendChild(ruleEnabledCb);
		ruleFormWrap.appendChild(ruleEnabledRow);

		function resetRuleForm() {
			ruleEditingId = null;
			ruleFormTitle.innerHTML = MS_CONFIG.ICONS.plus + ' ' + LANG.t('addRule');
			ruleNameInp.value = '';
			rulePatternInp.value = '';
			ruleTypeSel.value = 'host';
			ruleActionSel.value = 'block';
			ruleEnabledCb.checked = true;
		}
		function showRuleForm(rule) {
			ruleEditingId = rule.id;
			ruleFormTitle.innerHTML = MS_CONFIG.ICONS.edit + ' ' + LANG.t('edit') + ' ' + (rule.name || rule.pattern);
			ruleNameInp.value = rule.name || '';
			rulePatternInp.value = rule.pattern || '';
			ruleTypeSel.value = rule.type || 'host';
			ruleActionSel.value = rule.action || 'block';
			ruleEnabledCb.checked = rule.enabled !== false;
		}

		var ruleFormBtns = document.createElement('div');
		ruleFormBtns.style.cssText = 'display:flex;gap:8px;';
		var ruleSaveBtn = document.createElement('button');
		ruleSaveBtn.innerHTML = MS_CONFIG.ICONS.save + ' ' + LANG.t('ok');
		ruleSaveBtn.style.cssText = 'flex:1;padding:8px 12px;border:none;border-radius:8px;background:linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ');color:#fff;font-size:12px;font-weight:600;cursor:pointer;';
		ruleSaveBtn.onclick = function () {
			var name = ruleNameInp.value.trim();
			var pattern = rulePatternInp.value.trim();
			if (!pattern) { toast(LANG.t('plsInputText'), '#f59e0b'); return; }
			var obj = { name: name, pattern: pattern, type: ruleTypeSel.value, action: ruleActionSel.value, enabled: ruleEnabledCb.checked };
			if (ruleEditingId) { Plugins.updateRule(ruleEditingId, obj); }
			else { Plugins.addRule(obj); }
			resetRuleForm(); renderRuleList(); toast(LANG.t('pluginSaved'));
		};
		var ruleCancelBtn = document.createElement('button');
		ruleCancelBtn.textContent = LANG.t('cancel');
		ruleCancelBtn.style.cssText = 'padding:8px 12px;border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:12px;font-weight:600;cursor:pointer;';
		ruleCancelBtn.onclick = resetRuleForm;
		ruleFormBtns.appendChild(ruleSaveBtn); ruleFormBtns.appendChild(ruleCancelBtn);
		ruleFormWrap.appendChild(ruleFormBtns);
		rulesSection.appendChild(ruleFormWrap);
		renderRuleList();

		var parsersSection = document.createElement('div');
		parsersSection.style.display = UI._settingsState.pluginTab === 'parsers' ? 'block' : 'none';
		var parserListWrap = document.createElement('div');
		parsersSection.appendChild(parserListWrap);

		function renderParserList() {
			parserListWrap.innerHTML = '';
			var parsers = Plugins.listParsers();
			if (parsers.length === 0) {
				var empty = document.createElement('div');
				empty.style.cssText = 'font-size:12px;color:' + c.sub + ';padding:8px 0;';
				empty.textContent = LANG.t('noParsers');
				parserListWrap.appendChild(empty);
			} else {
				for (var pi = 0; pi < parsers.length; pi++) {
					(function (parser) {
						var row = document.createElement('div');
						row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px;border-radius:8px;background:' + c.bg + ';border:1px solid ' + c.border + ';margin-bottom:8px;flex-wrap:wrap;';
						var info = document.createElement('div');
						info.style.cssText = 'flex:1;min-width:140px;';
						var nameEl = document.createElement('div');
						nameEl.style.cssText = 'font-size:13px;font-weight:600;color:' + c.txt + ';';
						nameEl.textContent = parser.name || parser.matchPattern;
						var metaEl = document.createElement('div');
						metaEl.style.cssText = 'font-size:11px;color:' + c.sub + ';margin-top:2px;word-break:break-all;';
						var stepN = (U.isArr(parser.steps) && parser.steps.length) ? parser.steps.length : 0;
						metaEl.textContent = (stepN ? ('[' + stepN + ' 步] ') : '') + (parser.apiUrl || parser.matchPattern);
						info.appendChild(nameEl); info.appendChild(metaEl);
						row.appendChild(info);
						var toggle = UI.createToggle(parser.enabled, function (val) {
							Plugins.updateParser(parser.id, { enabled: val });
							toast(LANG.t('saved'));
						});
						toggle.style.flexShrink = '0';
						row.appendChild(toggle);
						var editBtn = document.createElement('button');
						editBtn.textContent = LANG.t('edit');
						editBtn.style.cssText = 'padding:5px 10px;border:none;border-radius:6px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:12px;cursor:pointer;font-weight:600;';
						editBtn.onclick = function () { showParserForm(parser); };
						row.appendChild(editBtn);
						var delBtn = document.createElement('button');
						delBtn.textContent = LANG.t('delete');
						delBtn.style.cssText = 'padding:5px 10px;border:none;border-radius:6px;background:#ef4444;color:#fff;font-size:12px;cursor:pointer;font-weight:600;';
						delBtn.onclick = function () {
							if (!confirm(LANG.t('confirmDeleteParser'))) return;
							Plugins.removeParser(parser.id);
							renderParserList();
							toast(LANG.t('pluginDeleted'));
						};
						row.appendChild(delBtn);
						parserListWrap.appendChild(row);
					})(parsers[pi]);
				}
			}
		}

		var parserEditingId = null;
		var parserFormWrap = document.createElement('div');
		parserFormWrap.style.cssText = 'margin-top:10px;padding:12px;border-radius:10px;background:' + c.bg2 + ';border:1px solid ' + c.border + ';';
		var parserFormTitle = document.createElement('div');
		parserFormTitle.style.cssText = 'font-size:13px;font-weight:700;color:' + c.txt + ';margin-bottom:10px;';
		parserFormTitle.innerHTML = MS_CONFIG.ICONS.plus + ' ' + LANG.t('addParser');
		parserFormWrap.appendChild(parserFormTitle);

				var parserTplRow = document.createElement('div');
		parserTplRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;';
		var parserTplLab = document.createElement('span');
		parserTplLab.textContent = LANG.t('parserTemplate');
		parserTplLab.style.cssText = 'font-size:11px;color:' + c.sub + ';flex-shrink:0;';
		var parserTplSel = document.createElement('select');
		parserTplSel.style.cssText = 'flex:1;padding:6px 8px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;';
		var tplOpt0 = document.createElement('option');
		tplOpt0.value = ''; tplOpt0.textContent = LANG.t('parserTemplatePick');
		parserTplSel.appendChild(tplOpt0);
		var tplList = Plugins.PARSER_TEMPLATES || [];
		for (var tpi = 0; tpi < tplList.length; tpi++) {
			var tOpt = document.createElement('option');
			tOpt.value = tplList[tpi].key; tOpt.textContent = tplList[tpi].label;
			parserTplSel.appendChild(tOpt);
		}
		parserTplRow.appendChild(parserTplLab); parserTplRow.appendChild(parserTplSel);
		parserFormWrap.appendChild(parserTplRow);

		function parserInput(placeholder) {
			var inp = document.createElement('input');
			inp.type = 'text'; inp.placeholder = placeholder;
			inp.style.cssText = 'width:100%;padding:7px 10px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;box-sizing:border-box;margin-bottom:8px;';
			return inp;
		}
		var parserNameInp = parserInput(LANG.t('parserName'));
		var parserMatchInp = parserInput(LANG.t('parserMatch'));
		var parserApiInp = parserInput(LANG.t('parserApi'));
		parserFormWrap.appendChild(parserNameInp);
		parserFormWrap.appendChild(parserMatchInp);
		parserFormWrap.appendChild(parserApiInp);

		var parserMethodSel = document.createElement('select');
		parserMethodSel.style.cssText = 'width:48%;padding:7px 10px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;box-sizing:border-box;margin-bottom:8px;margin-right:2%;';
		var parserMethods = [['GET', 'GET'], ['POST', 'POST']];
		for (var pmi = 0; pmi < parserMethods.length; pmi++) {
			var opt = document.createElement('option');
			opt.value = parserMethods[pmi][0]; opt.textContent = parserMethods[pmi][1];
			parserMethodSel.appendChild(opt);
		}
		parserFormWrap.appendChild(parserMethodSel);
		var parserDataPathInp = parserInput(LANG.t('parserDataPath'));
		parserFormWrap.appendChild(parserDataPathInp);

		var parserHeadersTa = document.createElement('textarea');
		parserHeadersTa.placeholder = LANG.t('parserHeaders');
		parserHeadersTa.style.cssText = 'width:100%;min-height:60px;padding:7px 10px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;font-family:monospace;box-sizing:border-box;margin-bottom:8px;resize:vertical;';
		parserFormWrap.appendChild(parserHeadersTa);

				var parserStepsHintEl = document.createElement('div');
		parserStepsHintEl.textContent = LANG.t('parserStepsHint');
		parserStepsHintEl.style.cssText = 'font-size:11px;color:' + c.sub + ';margin-bottom:4px;line-height:1.5;';
		parserFormWrap.appendChild(parserStepsHintEl);
		var parserStepsTa = document.createElement('textarea');
		parserStepsTa.placeholder = LANG.t('parserSteps');
		parserStepsTa.style.cssText = 'width:100%;min-height:96px;padding:7px 10px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;font-family:monospace;box-sizing:border-box;margin-bottom:8px;resize:vertical;';
		parserFormWrap.appendChild(parserStepsTa);
		var parserErrEl = document.createElement('div');
		parserErrEl.style.cssText = 'display:none;font-size:11px;color:#ef4444;margin-bottom:8px;line-height:1.6;white-space:pre-wrap;';
		parserFormWrap.appendChild(parserErrEl);

		var parserEnabledRow = document.createElement('div');
		parserEnabledRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;';
		var parserEnabledLabel = document.createElement('span');
		parserEnabledLabel.textContent = LANG.t('enabled');
		parserEnabledLabel.style.cssText = 'font-size:12px;color:' + c.txt + ';';
		var parserEnabledCb = document.createElement('input');
		parserEnabledCb.type = 'checkbox'; parserEnabledCb.checked = true;
		parserEnabledCb.style.cssText = 'width:18px;height:18px;cursor:pointer;';
		parserEnabledRow.appendChild(parserEnabledLabel); parserEnabledRow.appendChild(parserEnabledCb);
		parserFormWrap.appendChild(parserEnabledRow);

		function showParserErr(errs) {
			if (!errs || !errs.length) { parserErrEl.style.display = 'none'; parserErrEl.textContent = ''; return; }
			parserErrEl.style.display = 'block';
			parserErrEl.textContent = errs.map(function (e) { return '· ' + e; }).join('\n');
		}
		function resetParserForm() {
			parserEditingId = null;
			parserFormTitle.innerHTML = MS_CONFIG.ICONS.plus + ' ' + LANG.t('addParser');
			parserNameInp.value = '';
			parserMatchInp.value = '';
			parserApiInp.value = '';
			parserMethodSel.value = 'GET';
			parserDataPathInp.value = '';
			parserHeadersTa.value = '';
			parserStepsTa.value = '';
			parserTplSel.value = '';
			parserEnabledCb.checked = true;
			showParserErr(null);
		}
		function showParserForm(parser) {
			parserEditingId = parser.id;
			parserFormTitle.innerHTML = MS_CONFIG.ICONS.edit + ' ' + LANG.t('edit') + ' ' + (parser.name || parser.matchPattern);
			parserNameInp.value = parser.name || '';
			parserMatchInp.value = parser.matchPattern || '';
			parserApiInp.value = parser.apiUrl || '';
			parserMethodSel.value = parser.method || 'GET';
			parserDataPathInp.value = parser.dataPath || '';
			parserHeadersTa.value = (parser.headers && Object.keys(parser.headers).length) ? JSON.stringify(parser.headers, null, 2) : '';
			parserStepsTa.value = (U.isArr(parser.steps) && parser.steps.length) ? JSON.stringify(parser.steps, null, 2) : '';
			parserTplSel.value = '';
			parserEnabledCb.checked = parser.enabled !== false;
			showParserErr(null);
		}
		function applyParserTemplate(key) {
			var tpl = Plugins.templateParser(key);
			if (!tpl) return;
			parserEditingId = null;
			parserFormTitle.innerHTML = MS_CONFIG.ICONS.plus + ' ' + LANG.t('addParser') + ' · ' + tpl.name;
			parserNameInp.value = tpl.name || '';
			parserMatchInp.value = tpl.matchPattern || '';
			parserApiInp.value = tpl.apiUrl || '';
			parserMethodSel.value = tpl.method || 'GET';
			parserDataPathInp.value = tpl.dataPath || '';
			parserHeadersTa.value = (tpl.headers && Object.keys(tpl.headers).length) ? JSON.stringify(tpl.headers, null, 2) : '';
			parserStepsTa.value = (U.isArr(tpl.steps) && tpl.steps.length) ? JSON.stringify(tpl.steps, null, 2) : '';
			parserEnabledCb.checked = false; 
			showParserErr(null);
		}
		parserTplSel.addEventListener('change', function () {
			if (parserTplSel.value) applyParserTemplate(parserTplSel.value);
		});

		var parserFormBtns = document.createElement('div');
		parserFormBtns.style.cssText = 'display:flex;gap:8px;';
		var parserSaveBtn = document.createElement('button');
		parserSaveBtn.innerHTML = MS_CONFIG.ICONS.save + ' ' + LANG.t('ok');
		parserSaveBtn.style.cssText = 'flex:1;padding:8px 12px;border:none;border-radius:8px;background:linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ');color:#fff;font-size:12px;font-weight:600;cursor:pointer;';
		parserSaveBtn.onclick = function () {
			showParserErr(null);
			var name = parserNameInp.value.trim();
			var matchPattern = parserMatchInp.value.trim();
			var apiUrl = parserApiInp.value.trim();
			var headers = {};
			try {
				if (parserHeadersTa.value.trim()) {
					var h = JSON.parse(parserHeadersTa.value.trim());
					if (h && typeof h === 'object' && !Array.isArray(h)) headers = h;
				}
			} catch (e) {
				showParserErr(['请求头 JSON 解析失败: ' + e.message]); return;
			}
			var steps = [];
			if (parserStepsTa.value.trim()) {
				try {
					var s = JSON.parse(parserStepsTa.value.trim());
					if (!Array.isArray(s)) { showParserErr(['steps 必须是数组']); return; }
					steps = s;
				} catch (e2) {
					showParserErr(['steps JSON 解析失败: ' + e2.message]); return;
				}
			}
			var obj = {
				name: name, matchPattern: matchPattern, apiUrl: apiUrl,
				method: parserMethodSel.value, dataPath: parserDataPathInp.value.trim(),
				headers: headers, steps: steps, enabled: parserEnabledCb.checked
			};
			var errs = Plugins.validateParser(obj);
			if (errs.length) { showParserErr(errs); return; }
			if (parserEditingId) { Plugins.updateParser(parserEditingId, obj); }
			else { Plugins.addParser(obj); }
			resetParserForm(); renderParserList(); toast(LANG.t('pluginSaved'));
		};
		var parserCancelBtn = document.createElement('button');
		parserCancelBtn.textContent = LANG.t('cancel');
		parserCancelBtn.style.cssText = 'padding:8px 12px;border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:12px;font-weight:600;cursor:pointer;';
		parserCancelBtn.onclick = resetParserForm;
		parserFormBtns.appendChild(parserSaveBtn); parserFormBtns.appendChild(parserCancelBtn);
		parserFormWrap.appendChild(parserFormBtns);
		parsersSection.appendChild(parserFormWrap);
		renderParserList();

		pluginContent.appendChild(rulesSection);
		pluginContent.appendChild(parsersSection);
		container.appendChild(makeGroup('plugins', LANG.t('grpPlugins'), pluginContent));

				var thumbInner = document.createElement('div');
		thumbInner.style.cssText = 'display:flex;align-items:center;justify-content:space-between;';
		var thumbInfo = document.createElement('div');
		thumbInfo.innerHTML = '<div style="font-size:13px;font-weight:700;color:' + c.txt + ';"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg> ' + LANG.t('autoThumb') + '</div><div style="font-size:11px;color:' + c.sub + ';margin-top:2px;">' + LANG.t('autoThumbDesc') + '</div>';
		var thumbToggle = UI.createToggle(State.config.autoExtractThumb, function (val) {
			State.config.autoExtractThumb = val;
			State.save();
			toast(LANG.t('saved'));
		});
		thumbInner.appendChild(thumbInfo);
		thumbInner.appendChild(thumbToggle);
		container.appendChild(makeGroup('videoThumb', LANG.t('grpVideoThumb'), thumbInner));

				var updContent = document.createElement('div');
		var updInner = document.createElement('div');
		updInner.style.cssText = 'display:flex;align-items:center;justify-content:space-between;';
		var updInfo = document.createElement('div');
		updInfo.innerHTML = '<div style="font-size:13px;font-weight:700;color:' + c.txt + ';"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg> ' + LANG.t('autoCheckUpdate') + '</div><div style="font-size:11px;color:' + c.sub + ';margin-top:2px;">' + LANG.t('autoCheckUpdateDesc') + '</div>';
		var updToggle = UI.createToggle(State.config.autoCheckUpdate, function (val) {
			State.config.autoCheckUpdate = val;
			State.save();
			toast(LANG.t('saved'));
		});
		updInner.appendChild(updInfo);
		updInner.appendChild(updToggle);
		updContent.appendChild(updInner);
		var updBtnRow = document.createElement('div');
		updBtnRow.style.cssText = 'margin-top:10px;display:flex;gap:8px;';
		var checkBtn = document.createElement('button');
		checkBtn.textContent = LANG.t('checkNow');
		checkBtn.style.cssText = 'flex:1;padding:8px 14px;border:none;border-radius:8px;background:linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ');color:#fff;font-size:12px;font-weight:600;cursor:pointer;';
		checkBtn.addEventListener('click', function () {
			if (checkBtn._loading) return;
			checkBtn._loading = true;
			var originalText = checkBtn.textContent;
			checkBtn.textContent = LANG.t('checkingUpdate');
			checkBtn.style.opacity = '0.7';
			checkBtn.style.cursor = 'not-allowed';
			AutoUpdater.checkNow({
				currentVersion: U.VERSION,
				repo: 'zhjich123/zhjich123',
			}).then(function (res) {
				checkBtn._loading = false;
				checkBtn.textContent = originalText;
				checkBtn.style.opacity = '1';
				checkBtn.style.cursor = 'pointer';
				if (res.status === 'up-to-date' || res.status === 'cached') {
					toast(LANG.t('updateLatest'));
				} else if (res.status === 'update-available') {
									} else if (res.status === 'prerelease-skipped') {
					toast(LANG.t('updateLatest'));
				} else if (res.status === 'skipped-by-user') {
					toast(LANG.t('updateLatest'));
				} else {
					toast(LANG.t('updateCheckFail') + ': ' + (res.error || ''), '#ef4444');
				}
			}).catch(function () {
				checkBtn._loading = false;
				checkBtn.textContent = originalText;
				checkBtn.style.opacity = '1';
				checkBtn.style.cursor = 'pointer';
				toast(LANG.t('updateCheckFail'), '#ef4444');
			});
		});
		updBtnRow.appendChild(checkBtn);
		updContent.appendChild(updBtnRow);
		container.appendChild(makeGroup('autoUpdate', LANG.t('grpAutoUpdate'), updContent));

				var persistInner = document.createElement('div');
		persistInner.style.cssText = 'display:flex;align-items:center;justify-content:space-between;';
		var persistInfo = document.createElement('div');
		persistInfo.innerHTML = '<div style="font-size:13px;font-weight:700;color:' + c.txt + ';"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> ' + LANG.t('persistSelection') + '</div><div style="font-size:11px;color:' + c.sub + ';margin-top:2px;">' + LANG.t('persistSelectionDesc') + '</div>';
		var persistToggle = UI.createToggle(State.config.persistSelection, function (val) {
			State.config.persistSelection = val;
			State.save();
			toast(LANG.t('saved'));
		});
		persistInner.appendChild(persistInfo);
		persistInner.appendChild(persistToggle);
		container.appendChild(makeGroup('persistSelection', LANG.t('grpPersistSelection'), persistInner));

				var scBody = document.createElement('div');
		scBody.style.cssText = 'display:flex;flex-direction:column;gap:10px;';
		var modOpts = [
			['', LANG.t('shortcutModNone')],
			['alt', LANG.t('shortcutModAlt')],
			['ctrl', LANG.t('shortcutModCtrl')],
			['shift', LANG.t('shortcutModShift')]
		];
		function shortcutSetting(label, key, modKey) {
			var row = document.createElement('div');
			row.style.cssText = 'display:flex;align-items:center;gap:8px;flex-wrap:wrap;';
			var lab = document.createElement('label');
			lab.style.cssText = 'font-size:12px;color:' + c.txt + ';min-width:80px;';
			lab.textContent = label;
			var keyInp = document.createElement('input');
			keyInp.type = 'text';
			keyInp.value = State.config[key];
			keyInp.style.cssText = 'width:90px;padding:6px 8px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;';
			var modLab = document.createElement('label');
			modLab.style.cssText = 'font-size:12px;color:' + c.sub + ';';
			modLab.textContent = LANG.t('shortcutMod');
			var modSel = document.createElement('select');
			modSel.style.cssText = 'padding:6px 8px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;';
			for (var mi = 0; mi < modOpts.length; mi++) {
				var opt = document.createElement('option');
				opt.value = modOpts[mi][0];
				opt.textContent = modOpts[mi][1];
				if (modOpts[mi][0] === State.config[modKey]) opt.selected = true;
				modSel.appendChild(opt);
			}
			function saveShortcut() {
				var k = (keyInp.value || '').trim();
				if (!k) return;
				State.config[key] = k;
				State.config[modKey] = modSel.value;
				State.save();
				toast(LANG.t('saved'));
			}
			keyInp.addEventListener('change', saveShortcut);
			modSel.addEventListener('change', saveShortcut);
			row.appendChild(lab);
			row.appendChild(keyInp);
			row.appendChild(modLab);
			row.appendChild(modSel);
			return row;
		}
		scBody.appendChild(shortcutSetting(LANG.t('shortcutToggle'), 'shortcutToggle', 'shortcutToggleMod'));
		scBody.appendChild(shortcutSetting(LANG.t('shortcutTranslate'), 'shortcutTranslate', 'shortcutTranslateMod'));
		scBody.appendChild(shortcutSetting(LANG.t('shortcutClose'), 'shortcutClose', 'shortcutCloseMod'));
		container.appendChild(makeGroup('shortcuts', LANG.t('grpShortcuts'), scBody));

				function historyHost(url) {
			try { var u = new URL(url, location.href); return u.hostname; } catch (e) { return url; }
		}
		function historyDateLabel(ts) {
			var d = new Date(ts);
			var now = new Date();
			var dYear = d.getFullYear(), dMonth = d.getMonth(), dDate = d.getDate();
			var nYear = now.getFullYear(), nMonth = now.getMonth(), nDate = now.getDate();
			if (dYear === nYear && dMonth === nMonth && dDate === nDate) return LANG.t('historyToday');
			var yest = new Date(now.getTime() - 86400000);
			if (dYear === yest.getFullYear() && dMonth === yest.getMonth() && dDate === yest.getDate()) return LANG.t('historyYesterday');
			var weekAgo = new Date(now.getTime() - 7 * 86400000);
			if (d.getTime() >= weekAgo.setHours(0, 0, 0, 0)) return LANG.t('historyWeek');
			return LANG.t('historyOlder');
		}
		function historyKindLabel(kind) {
			if (kind === 'image') return MS_CONFIG.ICONS.image + ' ' + LANG.t('img');
			if (kind === 'audio') return MS_CONFIG.ICONS.audio + ' ' + LANG.t('audio');
			if (kind === 'm3u8') return MS_CONFIG.ICONS.stream + ' ' + LANG.t('m3u8');
			if (kind === 'stream') return MS_CONFIG.ICONS.link + ' ' + LANG.t('video');
			return MS_CONFIG.ICONS.video + ' ' + LANG.t('video');
		}
		var rhWrap = document.createElement('div');
		var rhToggleRow = document.createElement('div');
		rhToggleRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;';
		var rhToggleLabel = document.createElement('div');
		rhToggleLabel.textContent = LANG.t('enableHistory');
		rhToggleLabel.style.cssText = 'font-size:13px;color:' + c.txt + ';';
		var rhToggle = UI.createToggle(State.config.enableHistory, function (val) {
			State.config.enableHistory = val;
			State.save();
			toast(LANG.t('saved'));
		});
		rhToggleRow.appendChild(rhToggleLabel);
		rhToggleRow.appendChild(rhToggle);
		rhWrap.appendChild(rhToggleRow);

		var rhList = document.createElement('div');
		rhList.style.cssText = 'max-height:260px;overflow:auto;margin-bottom:8px;';
		var rhItems = State.getHistory();
		if (rhItems.length === 0) {
			var rhEmpty = document.createElement('div');
			rhEmpty.style.cssText = 'font-size:12px;color:' + c.sub + ';padding:8px 0;';
			rhEmpty.textContent = LANG.t('noResourceHistory');
			rhList.appendChild(rhEmpty);
		} else {
			var rhGroups = {};
			for (var rhi = 0; rhi < rhItems.length; rhi++) {
				var label = historyDateLabel(rhItems[rhi].timestamp);
				if (!rhGroups[label]) rhGroups[label] = [];
				rhGroups[label].push(rhItems[rhi]);
			}
			var rhGroupOrder = [LANG.t('historyToday'), LANG.t('historyYesterday'), LANG.t('historyWeek'), LANG.t('historyOlder')];
			var rhGroupLabels = Object.keys(rhGroups);
			rhGroupLabels.sort(function (a, b) { return rhGroupOrder.indexOf(a) - rhGroupOrder.indexOf(b); });
			for (var rgi = 0; rgi < rhGroupLabels.length; rgi++) {
				var gLabel = rhGroupLabels[rgi];
				var gWrap = document.createElement('div');
				var gTitle = document.createElement('div');
				gTitle.textContent = gLabel;
				gTitle.style.cssText = 'font-size:12px;font-weight:600;color:' + c.sub + ';padding:6px 0;border-bottom:1px solid ' + c.border + ';margin-bottom:4px;';
				gWrap.appendChild(gTitle);
				var gItems = rhGroups[gLabel];
				for (var gii = 0; gii < gItems.length; gii++) {
					(function (ritem) {
						var row = document.createElement('div');
						row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid ' + c.border + ';font-size:12px;cursor:pointer;';
						row.title = ritem.url;
						var left = document.createElement('div');
						left.style.cssText = 'flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:' + c.txt + ';';
						left.textContent = historyKindLabel(ritem.kind) + ' · ' + historyHost(ritem.url);
						var right = document.createElement('div');
						right.style.cssText = 'color:' + c.sub + ';white-space:nowrap;';
						var timeStr = '';
						try { timeStr = new Date(ritem.timestamp).toLocaleTimeString(); } catch (e) {}
						right.textContent = timeStr;
						row.appendChild(left);
						row.appendChild(right);
						row.addEventListener('click', function () { UI.locateResource(ritem.url, ritem.kind); });
						gWrap.appendChild(row);
					})(gItems[gii]);
				}
				rhList.appendChild(gWrap);
			}
		}
		rhWrap.appendChild(rhList);
		var rhClearBtn = document.createElement('button');
		rhClearBtn.textContent = LANG.t('clearResourceHistory');
		rhClearBtn.style.cssText = 'padding:6px 12px;border:none;border-radius:6px;background:#64748b;color:#fff;font-size:12px;cursor:pointer;font-weight:600;';
		rhClearBtn.addEventListener('click', function () {
			if (!confirm(LANG.t('confirmClearResourceHistory'))) return;
			State.clearHistory();
			UI.renderSettings();
			toast(LANG.t('cleared'));
		});
		rhWrap.appendChild(rhClearBtn);
		container.appendChild(makeGroup('resourceHistory', LANG.t('grpResourceHistory'), rhWrap));

				var dhList = document.createElement('div');
		dhList.style.cssText = 'max-height:220px;overflow:auto;margin-bottom:8px;';
		var dhItems = State.downloadHistory.slice(-20);
		if (dhItems.length === 0) {
			var dhEmpty = document.createElement('div');
			dhEmpty.style.cssText = 'font-size:12px;color:' + c.sub + ';padding:8px 0;';
			dhEmpty.textContent = LANG.t('noDlFile');
			dhList.appendChild(dhEmpty);
		} else {
			for (var hi = dhItems.length - 1; hi >= 0; hi--) {
				(function (item) {
					var row = document.createElement('div');
					row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid ' + c.border + ';font-size:12px;';
					var left = document.createElement('div');
					left.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:' + c.txt + ';';
					left.innerHTML = (item.success ? MS_CONFIG.ICONS.checkBig + ' ' : MS_CONFIG.ICONS.cross + ' ') + (item.name || item.url);
					left.title = item.url;
					var timeStr = '';
					try { timeStr = new Date(item.time).toLocaleString(); } catch (e) {}
					var right = document.createElement('div');
					right.style.cssText = 'color:' + c.sub + ';white-space:nowrap;';
					right.textContent = timeStr;
					row.appendChild(left);
					row.appendChild(right);
					dhList.appendChild(row);
				})(dhItems[hi]);
			}
		}
		var dhContent = document.createElement('div');
		dhContent.appendChild(dhList);
		var dhClearBtn = document.createElement('button');
		dhClearBtn.textContent = LANG.t('clearHistory');
		dhClearBtn.style.cssText = 'padding:6px 12px;border:none;border-radius:6px;background:#64748b;color:#fff;font-size:12px;cursor:pointer;font-weight:600;';
		dhClearBtn.addEventListener('click', function () {
			State.downloadHistory = [];
			if (Dl._dm) Dl._dm.clearHistory();
			UI.renderSettings();
			toast(LANG.t('cleared'));
		});
		dhContent.appendChild(dhClearBtn);
		container.appendChild(makeGroup('downloadHistory', LANG.t('grpDownloadHistory'), dhContent));

		
		function _ai3Lab(text) {
			var el = document.createElement('div');
			el.textContent = text;
			el.style.cssText = 'font-size:11px;color:' + c.sub + ';margin:10px 0 4px;';
			return el;
		}
		function _ai3Desc(text) {
			var el = document.createElement('div');
			el.textContent = text;
			el.style.cssText = 'font-size:11px;color:' + c.sub + ';line-height:1.7;margin-bottom:6px;';
			return el;
		}
		function _ai3Inp(ph, val, type, onSave) {
			var el = document.createElement('input');
			el.type = type || 'text';
			el.placeholder = ph || '';
			el.value = val == null ? '' : String(val);
			el.style.cssText = 'width:100%;padding:7px 10px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;box-sizing:border-box;';
			el.addEventListener('change', function () { onSave(el.value); });
			return el;
		}
		function _ai3Sel(opts, cur, onChange) {
			var el = document.createElement('select');
			el.style.cssText = 'width:100%;padding:7px 10px;border:1px solid ' + c.border + ';border-radius:6px;background:' + c.bg + ';color:' + c.txt + ';font-size:12px;box-sizing:border-box;';
			for (var oi = 0; oi < opts.length; oi++) {
				var o = document.createElement('option');
				o.value = opts[oi][0];
				o.textContent = opts[oi][1];
				el.appendChild(o);
			}
			el.value = cur;
			el.addEventListener('change', function () { onChange(el.value); });
			return el;
		}
		function _ai3ToggleRow(label, init, onChange) {
			var row = document.createElement('div');
			row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin:10px 0;';
			var lb = document.createElement('span');
			lb.textContent = label;
			lb.style.cssText = 'font-size:12px;color:' + c.txt + ';flex:1;padding-right:10px;';
			row.appendChild(lb);
			row.appendChild(UI.createToggle(init, function (v) { onChange(v); toast(LANG.t('saved')); }));
			return row;
		}
		function _ai3Btns(btns) {
			var row = document.createElement('div');
			row.style.cssText = 'display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;';
			for (var bi = 0; bi < btns.length; bi++) {
				(function (b) {
					var el = document.createElement('button');
					el.textContent = b.label;
					el.style.cssText = 'flex:1;min-width:104px;padding:9px 12px;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;'
						+ (b.kind === 'primary'
							? 'background:linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ');color:#fff;'
							: 'background:' + c.bg3 + ';color:' + c.txt + ';');
					el.onclick = function () { try { b.fn(el); } catch (e) { toast(String(e.message), '#ef4444'); } };
					row.appendChild(el);
				})(btns[bi]);
			}
			return row;
		}
		function _ai3Empty(text) {
			var el = document.createElement('div');
			el.textContent = text;
			el.style.cssText = 'font-size:12px;color:' + c.sub + ';padding:8px 0;';
			return el;
		}
						function _ai3HistoryBox(rows) {
			var wrap = document.createElement('div');
			wrap.style.cssText = 'max-height:260px;overflow-y:auto;-webkit-overflow-scrolling:touch;padding-right:2px;';
			for (var i = 0; i < rows.length; i++) wrap.appendChild(rows[i]);
			return wrap;
		}
		function _ai3HistoryRow(main, sub) {
			var row = document.createElement('div');
			row.style.cssText = 'padding:8px 10px;border-radius:8px;background:' + c.bg + ';border:1px solid ' + c.border + ';margin-bottom:6px;';
			var m = document.createElement('div');
			m.textContent = main;
			m.style.cssText = 'font-size:12px;color:' + c.txt + ';word-break:break-word;';
			var s = document.createElement('div');
			s.textContent = sub;
			s.style.cssText = 'font-size:10px;color:' + c.sub + ';margin-top:2px;';
			row.appendChild(m); row.appendChild(s);
			return row;
		}

		
		var aidContent = document.createElement('div');
		(function () {
			aidContent.appendChild(_ai3Desc(LANG.t('audioIdDesc')));
			aidContent.appendChild(_ai3Lab(LANG.t('audioIdProvider')));
			aidContent.appendChild(_ai3Sel([
				['audd', LANG.t('audioIdProviderAudD')],
				['acrcloud', LANG.t('audioIdProviderAcr')],
				['custom', LANG.t('audioIdProviderCustom')]
			], State.config.audioIdProvider, function (v) {
				State.config.audioIdProvider = v; State.save(); UI.renderSettings();
			}));

			var prov = State.config.audioIdProvider;
			if (prov === 'acrcloud') {
				aidContent.appendChild(_ai3Lab(LANG.t('audioIdAcrHost')));
				aidContent.appendChild(_ai3Inp('identify-us-west-1.acrcloud.com', State.config.audioIdAcrHost, 'text', function (v) { State.config.audioIdAcrHost = v.trim(); State.save(); toast(LANG.t('saved')); }));
				aidContent.appendChild(_ai3Lab(LANG.t('audioIdAcrKey')));
				aidContent.appendChild(_ai3Inp('', State.config.audioIdAcrKey, 'password', function (v) { State.config.audioIdAcrKey = v.trim(); State.save(); toast(LANG.t('saved')); }));
				aidContent.appendChild(_ai3Lab(LANG.t('audioIdAcrSecret')));
				aidContent.appendChild(_ai3Inp('', State.config.audioIdAcrSecret, 'password', function (v) { State.config.audioIdAcrSecret = v.trim(); State.save(); toast(LANG.t('saved')); }));
			} else if (prov === 'custom') {
				aidContent.appendChild(_ai3Lab(LANG.t('audioIdCustomUrl')));
				aidContent.appendChild(_ai3Inp('https://your-server/identify', State.config.audioIdCustomUrl, 'text', function (v) { State.config.audioIdCustomUrl = v.trim(); State.save(); toast(LANG.t('saved')); }));
			} else {
				aidContent.appendChild(_ai3Lab(LANG.t('audioIdToken')));
				aidContent.appendChild(_ai3Inp('', State.config.audioIdToken, 'password', function (v) { State.config.audioIdToken = v.trim(); State.save(); toast(LANG.t('saved')); }));
			}

			aidContent.appendChild(_ai3Lab(LANG.t('audioIdSource')));
			aidContent.appendChild(_ai3Sel([
				['page', LANG.t('audioIdSourcePage')],
				['mic', LANG.t('audioIdSourceMic')]
			], State.config.audioIdSource, function (v) {
				State.config.audioIdSource = v; State.save(); toast(LANG.t('saved'));
			}));
			aidContent.appendChild(_ai3Lab(LANG.t('audioIdSeconds')));
			aidContent.appendChild(_ai3Inp('8', State.config.audioIdSeconds, 'number', function (v) {
				var n = parseInt(v, 10);
				if (!(n >= 3 && n <= 20)) { toast('3-20', '#f59e0b'); UI.renderSettings(); return; }
				State.config.audioIdSeconds = n; State.save(); toast(LANG.t('saved'));
			}));

			aidContent.appendChild(_ai3Btns([
				{ label: LANG.t('audioIdRun'), kind: 'primary', fn: function () { UI.runAudioId(); } }
			]));

			aidContent.appendChild(_ai3Lab(LANG.t('audioIdHistory')));
			var h = U.isArr(State.config.audioIdHistory) ? State.config.audioIdHistory : [];
			if (!h.length) aidContent.appendChild(_ai3Empty(LANG.t('audioIdNoHistory')));
			else {
				var aidRows = [];
				for (var hi = 0; hi < h.length; hi++) {
					aidRows.push(_ai3HistoryRow(
						AudioID.format(h[hi]),
						new Date(h[hi].at || 0).toLocaleString() + ' · ' + (h[hi].provider || '')
					));
				}
				aidContent.appendChild(_ai3HistoryBox(aidRows));
			}
			if (h.length) {
				aidContent.appendChild(_ai3Btns([
					{ label: LANG.t('audioIdClearHistory'), fn: function () { AudioID.clearHistory(); UI.renderSettings(); toast(LANG.t('saved')); } }
				]));
			}
		})();
		container.appendChild(makeGroup('audioId', LANG.t('grpAudioId'), aidContent));

		
		var trContent = document.createElement('div');
		(function () {
			trContent.appendChild(_ai3Desc(LANG.t('transcribeDesc')));
			trContent.appendChild(_ai3Lab(LANG.t('asrBaseUrl')));
			trContent.appendChild(_ai3Inp('https://api.openai.com/v1', State.config.asrBaseUrl, 'text', function (v) { State.config.asrBaseUrl = v.trim(); State.save(); toast(LANG.t('saved')); }));
			trContent.appendChild(_ai3Lab(LANG.t('asrKey')));
			trContent.appendChild(_ai3Inp('sk-…', State.config.asrKey, 'password', function (v) { State.config.asrKey = v.trim(); State.save(); toast(LANG.t('saved')); }));
			trContent.appendChild(_ai3Lab(LANG.t('asrModel')));
			trContent.appendChild(_ai3Inp('whisper-1', State.config.asrModel, 'text', function (v) { State.config.asrModel = v.trim(); State.save(); toast(LANG.t('saved')); }));
			trContent.appendChild(_ai3Lab(LANG.t('asrLang')));
			trContent.appendChild(_ai3Inp('auto', State.config.asrLang, 'text', function (v) { State.config.asrLang = v.trim(); State.save(); toast(LANG.t('saved')); }));
			trContent.appendChild(_ai3Lab(LANG.t('asrMaxMB')));
			trContent.appendChild(_ai3Inp('24', State.config.asrMaxMB, 'number', function (v) {
				var n = parseInt(v, 10);
				if (!(n >= 1 && n <= 100)) { toast('1-100', '#f59e0b'); UI.renderSettings(); return; }
				State.config.asrMaxMB = n; State.save(); toast(LANG.t('saved'));
			}));
			trContent.appendChild(_ai3Lab(LANG.t('asrChunkSeconds')));
			trContent.appendChild(_ai3Inp('600', State.config.asrChunkSeconds, 'number', function (v) {
				var n = parseInt(v, 10);
				if (!(n >= 30 && n <= 1800)) { toast('30-1800', '#f59e0b'); UI.renderSettings(); return; }
				State.config.asrChunkSeconds = n; State.save(); toast(LANG.t('saved'));
			}));

			trContent.appendChild(_ai3Lab(LANG.t('aiBaseUrl')));
			trContent.appendChild(_ai3Inp('https://api.openai.com/v1', State.config.aiBaseUrl, 'text', function (v) { State.config.aiBaseUrl = v.trim(); State.save(); toast(LANG.t('saved')); }));
			trContent.appendChild(_ai3Lab(LANG.t('aiKey')));
			trContent.appendChild(_ai3Inp('sk-…', State.config.aiKey, 'password', function (v) { State.config.aiKey = v.trim(); State.save(); toast(LANG.t('saved')); }));
			trContent.appendChild(_ai3Lab(LANG.t('aiModel')));
			trContent.appendChild(_ai3Inp('gpt-4o-mini', State.config.aiModel, 'text', function (v) { State.config.aiModel = v.trim(); State.save(); toast(LANG.t('saved')); }));
			trContent.appendChild(_ai3Lab(LANG.t('aiPromptStyle')));
			trContent.appendChild(_ai3Sel([
				['summary', LANG.t('styleSummary')],
				['points', LANG.t('stylePoints')],
				['timeline', LANG.t('styleTimeline')],
				['qa', LANG.t('styleQa')]
			], State.config.aiPromptStyle, function (v) {
				State.config.aiPromptStyle = v; State.save(); toast(LANG.t('saved'));
			}));

			trContent.appendChild(_ai3Lab(LANG.t('transcribeHistory')));
			var th = U.isArr(State.config.transcribeHistory) ? State.config.transcribeHistory : [];
			if (!th.length) trContent.appendChild(_ai3Empty(LANG.t('transcribeNoHistory')));
			else {
				var trRows = [];
				for (var ti = 0; ti < th.length; ti++) {
					(function (rec) {
						var isTrunc = !!rec.truncated
							|| String(rec.text || '').length >= Transcribe.HISTORY_TEXT_MAX;
						var meta = new Date(rec.at || 0).toLocaleString() + ' · ' + (rec.chars || 0) + ' 字'
							+ (isTrunc ? ' · ' + LANG.t('transcribeHistoryTruncated', { n: Transcribe.HISTORY_TEXT_MAX }) : '');
						var row = _ai3HistoryRow(rec.title || rec.url || '(no title)', meta);
						row.style.cursor = 'pointer';
						row.onclick = function () { UI._showTranscribeResult({ title: rec.title, url: rec.url, at: rec.at, text: rec.text, summary: rec.summary, chars: rec.chars, truncated: isTrunc }); };
						trRows.push(row);
					})(th[ti]);
				}
				trContent.appendChild(_ai3HistoryBox(trRows));
			}
			if (th.length) {
				trContent.appendChild(_ai3Btns([
					{ label: LANG.t('transcribeClearHistory'), fn: function () { Transcribe.clearHistory(); UI.renderSettings(); toast(LANG.t('saved')); } }
				]));
			}
		})();
		container.appendChild(makeGroup('transcribe', LANG.t('grpTranscribe'), trContent));

		
		var wdContent = document.createElement('div');
		(function () {
			wdContent.appendChild(_ai3Desc(LANG.t('webdavDesc')));
			wdContent.appendChild(_ai3ToggleRow(LANG.t('webdavEnabled'), !!State.config.webdavEnabled, function (v) {
				State.config.webdavEnabled = v; State.save(); UI.renderSettings();
			}));
			wdContent.appendChild(_ai3Lab(LANG.t('webdavUrl')));
			wdContent.appendChild(_ai3Inp('https://nas.example.com/dav/', State.config.webdavUrl, 'text', function (v) { State.config.webdavUrl = v.trim(); State.save(); toast(LANG.t('saved')); }));
			wdContent.appendChild(_ai3Lab(LANG.t('webdavDir')));
			wdContent.appendChild(_ai3Inp('media-sniffer/', State.config.webdavDir, 'text', function (v) { State.config.webdavDir = v.trim(); State.save(); toast(LANG.t('saved')); }));
			wdContent.appendChild(_ai3Lab(LANG.t('webdavUser')));
			wdContent.appendChild(_ai3Inp('', State.config.webdavUser, 'text', function (v) { State.config.webdavUser = v.trim(); State.save(); toast(LANG.t('saved')); }));
			wdContent.appendChild(_ai3Lab(LANG.t('webdavPass')));
			wdContent.appendChild(_ai3Inp('', State.config.webdavPass, 'password', function (v) { State.config.webdavPass = v; State.save(); toast(LANG.t('saved')); }));
			wdContent.appendChild(_ai3ToggleRow(LANG.t('webdavUploadDownloads'), !!State.config.webdavUploadDownloads, function (v) {
				State.config.webdavUploadDownloads = v; State.save();
			}));

			var last = State.config.webdavLastSyncAt;
			var lastEl = document.createElement('div');
			lastEl.textContent = LANG.t('webdavLastSync', { t: last ? new Date(last).toLocaleString() : LANG.t('webdavNever') });
			lastEl.style.cssText = 'font-size:11px;color:' + c.sub + ';margin:8px 0 2px;';
			wdContent.appendChild(lastEl);

			wdContent.appendChild(_ai3Btns([
				{
					label: LANG.t('webdavTest'), fn: function (btn) {
						if (!State.config.webdavUrl) { toast(LANG.t('webdavNeedConfig'), '#f59e0b'); return; }
						btn.textContent = LANG.t('webdavTesting');
						WebDAV.test(function (err, r) {
							if (err) { toast(err.message, '#ef4444'); UI.renderSettings(); return; }
							toast(LANG.t('webdavTestOk', { n: r.count }));
							UI.renderSettings();
						});
					}
				},
				{
					label: LANG.t('webdavBackup'), kind: 'primary', fn: function (btn) {
						if (!State.config.webdavUrl) { toast(LANG.t('webdavNeedConfig'), '#f59e0b'); return; }
						btn.textContent = LANG.t('webdavTesting');
						WebDAV.backup(function (err, r) {
							if (err) { toast(err.message, '#ef4444'); UI.renderSettings(); return; }
							toast(LANG.t('webdavBackupOk', { kb: Math.round((r.bytes || 0) / 1024) }));
							UI.renderSettings();
						});
					}
				},
				{
					label: LANG.t('webdavRestore'), fn: function (btn) {
						if (!State.config.webdavUrl) { toast(LANG.t('webdavNeedConfig'), '#f59e0b'); return; }
						btn.textContent = LANG.t('webdavTesting');
						WebDAV.restore(function (err, r) {
							if (err) { toast(err.message, '#ef4444'); UI.renderSettings(); return; }
							toast(LANG.t('webdavRestoreOk', { n: r.applied }));
							try { applyPanelThemeNow(); } catch (e) {}
							UI.renderSettings();
						});
					}
				}
			]));
		})();
		container.appendChild(makeGroup('webdav', LANG.t('grpWebdav'), wdContent));

		var info = document.createElement('div');
		info.style.cssText = 'padding:12px;border-radius:10px;background:' + c.bg2 + ';font-size:11px;color:' + c.sub + ';line-height:1.8;text-align:center;';
								var infoL1 = document.createElement('div');
		infoL1.textContent = LANG.t('infoLine1');
		var infoL2 = document.createElement('div');
		infoL2.textContent = LANG.t('infoLine2');
		info.appendChild(infoL1);
		info.appendChild(infoL2);
		container.appendChild(info);

								var brandWrap = document.createElement('div');
		brandWrap.style.cssText = 'margin-top:14px;border-radius:12px;overflow:hidden;'
			+ 'border:1px solid ' + c.border + ';background:#ffffff;';
		var brandImg = document.createElement('img');
		brandImg.alt = 'UserScript Developer';
		brandImg.loading = 'lazy';
		brandImg.decoding = 'async';
		brandImg.style.cssText = 'width:100%;height:auto;display:block;';
				brandImg.onerror = function () { try { brandWrap.remove(); } catch (e) {} };
		brandImg.src = UI._BRAND_IMG;
		brandWrap.appendChild(brandImg);
		container.appendChild(brandWrap);

		box.appendChild(container);
	};

		function applyPanelThemeNow() {
		if (!State.panel) return;
		var c = UI.colors();
				try {
			State.panel.classList.add('_ms_theming');
			clearTimeout(State._themingTimer);
			State._themingTimer = setTimeout(function () {
				if (State.panel) State.panel.classList.remove('_ms_theming');
			}, 450);
		} catch (e) {}
		State.panel.style.background = c.bg;
		State.panel.style.color = c.txt;
		var tabs = document.querySelector('#_ms_tabs');
		if (tabs) tabs.style.background = c.bg2;
		var search = document.getElementById('_ms_search');
		if (search) search.style.background = c.bg2;
		var filter = document.getElementById('_ms_filter');
		if (filter) filter.style.background = c.bg2;
		var progress = document.getElementById('_ms_progress');
		if (progress) progress.style.background = c.bg2;
		var box = document.getElementById('_ms_box');
		if (box) box.style.background = c.bg;
		var footer = document.getElementById('_ms_footer');
		if (footer) footer.style.background = c.bg;
		var tabBtns = document.querySelectorAll('._ms_tab');
		for (var i = 0; i < tabBtns.length; i++) {
			UI._applyTabStyle(tabBtns[i], tabBtns[i].getAttribute('data-tab') === State.tab);
		}
		U.safeRun(function () { UI.applyUiStyle(); }, 'applyUiStyle');
	}
					State._applyTheme = applyPanelThemeNow;

	State._renderThrottled = (function () {
		var timer = null, rafId = null, last = 0;
		function fire() {
			rafId = null;
			fn._timer = null;
			last = U.monoNow();
			var t = State.tab;
			if (t === 'img' || t === 'video' || t === 'audio' || t === 'm3u8') UI.renderMedia(t);
		}
		var fn = function () {
			var rem = 80 - (U.monoNow() - last);
			if (timer) { clearTimeout(timer); timer = null; }
			if (rem <= 0) {
				if (rafId === null) rafId = U.rAF(fire);
			} else {
				timer = setTimeout(function () { timer = null; if (rafId === null) rafId = U.rAF(fire); }, rem);
			}
			fn._timer = timer || rafId;
		};
		fn._timer = null;
		fn._cancel = function () {
			if (timer) { clearTimeout(timer); timer = null; }
			if (rafId !== null) { U.cAF(rafId); rafId = null; }
			fn._timer = null;
		};
		return fn;
	})();

	UI.registerShortcuts = function () {
				if (UI._shortcutsBound) return;
		UI._shortcutsBound = true;
		document.addEventListener('keydown', function (e) {
			var cfg = State.config;
			function modMatch(mod) {
				if (!mod) return true;
				if (mod === 'alt') return e.altKey;
				if (mod === 'ctrl') return e.ctrlKey;
				if (mod === 'shift') return e.shiftKey;
				return false;
			}
			var key = String(e.key);
			var low = key.toLowerCase();
			if (modMatch(cfg.shortcutTranslateMod) && low === (cfg.shortcutTranslate || '').toLowerCase()) {
				e.preventDefault();
				var text = '';
				try { text = (window.getSelection().toString() || '').trim(); } catch (err) {}
				if (!text) { toast(LANG.t('plsSelectText'), '#f59e0b'); UI.openPanel(); UI.switchTab('translate'); return; }
				UI.openPanel();
				setTimeout(function () {
					UI.switchTab('translate');
					var inp = document.querySelector('#_ms_box textarea');
					if (inp) inp.value = text;
					TranslateEngine.autoTranslate(text, function (result, err) {
						var outputs = document.querySelectorAll('#_ms_box div');
						for (var i = 0; i < outputs.length; i++) {
							if (outputs[i].textContent && outputs[i].textContent.indexOf('翻译结果') === 0) {
								outputs[i].textContent = err ? LANG.t('transFailShort') + err : result;
								break;
							}
						}
						toast(err ? LANG.t('transFail') : LANG.t('transDone'));
					});
				}, 250);
			}
			else if (modMatch(cfg.shortcutToggleMod) && low === (cfg.shortcutToggle || '').toLowerCase()) {
				e.preventDefault();
				if (State.panelOpen) UI.closePanel(); else UI.openPanel();
			}
			else if (modMatch(cfg.shortcutCloseMod) && key.toLowerCase() === (cfg.shortcutClose || '').toLowerCase() && State.panelOpen) {
				if (State.selectionMode) {
					Selection.exit();
				} else {
					UI.closePanel();
				}
			}
		});
		LOG.info('快捷键已注册');
	};
		UI.buildSelectionPopup = function () {
		if (document.getElementById('_ms_sel_pop')) return;
		var pop = document.createElement('div');
		pop.id = '_ms_sel_pop';
		pop.textContent = LANG.t('transSelText');
		pop.style.cssText = 'position:fixed;z-index:2147483647;padding:6px 14px;border-radius:18px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:13px;font-weight:600;box-shadow:0 6px 18px rgba(99,102,241,.5);cursor:pointer;font-family:system-ui,sans-serif;display:none;';
		pop.addEventListener('click', function () {
			var text = '';
			try { text = (window.getSelection().toString() || '').trim(); } catch (e) {}
			if (!text) { toast(LANG.t('plsSelectText'), '#f59e0b'); return; }
			UI.openPanel();
			setTimeout(function () {
				UI.switchTab('translate');
				var inp = document.querySelector('#_ms_box textarea');
				if (inp) inp.value = text;
				TranslateEngine.autoTranslate(text, function (result, err) {
					if (err) toast(LANG.t('transFail') + ': ' + err, '#ef4444');
					else {
						var outputs = document.querySelectorAll('#_ms_box div');
						for (var i = 0; i < outputs.length; i++) {
							if (outputs[i].textContent && outputs[i].textContent.indexOf('翻译结果') === 0) {
								outputs[i].textContent = result;
								break;
							}
						}
						toast(LANG.t('transDone'));
					}
				});
			}, 250);
			pop.style.display = 'none';
		});
		document.documentElement.appendChild(pop);
	};

	UI._updateSelectionPopup = U.throttle(function () {
		var pop = document.getElementById('_ms_sel_pop');
		if (!pop) return;
		try {
			var selText = (window.getSelection().toString() || '').trim();
			if (!selText || selText.length < 2) { pop.style.display = 'none'; return; }
			var ae = document.activeElement;
			if (ae && (ae.tagName === 'TEXTAREA' || (ae.tagName === 'INPUT' && (ae.type === 'text' || ae.type === 'search' || ae.type === 'password')))) {
				pop.style.display = 'none'; return;
			}
			var range = window.getSelection().getRangeAt(0);
			var rect = range.getBoundingClientRect();
			if (rect.width === 0 && rect.height === 0) { pop.style.display = 'none'; return; }
			pop.style.display = 'block';
			pop.style.left = Math.min(window.innerWidth - 120, Math.max(8, rect.left + rect.width / 2 - 50)) + 'px';
			pop.style.top = Math.max(8, rect.top - 38) + 'px';
		} catch (e) { pop.style.display = 'none'; }
	}, 300);

	document.addEventListener('mouseup', function (e) {
		if (e.target && e.target.id === '_ms_sel_pop') return;
		setTimeout(UI._updateSelectionPopup, 50);
	});
	document.addEventListener('touchend', function () { setTimeout(UI._updateSelectionPopup, 100); });
	document.addEventListener('mousedown', function (e) {
		if (!e.target || (e.target.id !== '_ms_sel_pop' && !e.target.closest('#_ms_sel_pop'))) {
			var p = document.getElementById('_ms_sel_pop');
			if (p) p.style.display = 'none';
		}
	});

		return UI;
	})();
	var Bootstrap = (function () {
		'use strict';
				State._booted = false;
	State.init = function () {
		if (typeof Diag !== 'undefined') Diag.mark('init'); 
						try { if (LANG.assertPlainText) LANG.assertPlainText(); } catch (eLang) {}
		if (window.top !== window.self) return false;

		var host = document.body || document.documentElement;
		if (!host || host.nodeType !== 1) return false;

		if (!State._booted) {
			State._booted = true;

			State.load();

			if (!State.scanner) {
				try {
					State.scanner = createScanner({ useWorker: true, incremental: true });
					State.scanner.start();
				} catch (e) { LOG.warn('ScannerService 初始化失败:', e); }
			}

			try { UI.buildSelectionPopup(); } catch (e) { LOG.warn('构建选区浮窗失败:', e.message); }
			try { UI.registerShortcuts(); } catch (e) { LOG.warn('注册快捷键失败:', e.message); }
			try { installNetHook(); } catch (e) { LOG.warn('网络拦截安装失败:', e.message); }

			setTimeout(function () {
				try {
					if (State.config.autoCheckUpdate) {
						AutoUpdater.check({
							currentVersion: U.VERSION,
							repo: 'zhjich123/zhjich123',
							checkIntervalHours: 24,
						});
					}
				} catch (e) { LOG.warn('自动更新检查失败:', e); }
			}, 3000);

			LOG.info('初始化完成');
		}

				try { UI.buildFloatBtn(); } catch (e) { LOG.warn('构建浮动按钮失败:', e.message); }

		return true;
	};

		try {
		window.addEventListener('pagehide', function () { State._flushSave(); });
		window.addEventListener('beforeunload', function () { State._flushSave(); });
		document.addEventListener('visibilitychange', function () {
			if (document.visibilityState === 'hidden') {
				State._flushSave();
				UI._glassIdle(true);
			} else {
				UI._glassIdle(false);
			}
		});
	} catch (e) {}

		try {
		window.addEventListener('hashchange', function () { setTimeout(State.init, 300); });
		window.addEventListener('popstate', function () { setTimeout(State.init, 300); });
				var _mo = null;
		var _moPaused = false;
		var _moResumeTimer = null;
		var _moConnected = false;

		UI.pauseMO = function () {
			_moPaused = true;
			if (_moResumeTimer) clearTimeout(_moResumeTimer);
		};
		UI.resumeMO = function () {
			_moResumeTimer = setTimeout(function () {
				_moPaused = false;
			}, 300);
		};

		_mo = new MutationObserver(U.debounce(function (mutations) {
			if (_moPaused) return;
			var hasNewMedia = false;
			for (var i = 0; i < mutations.length; i++) {
				var added = mutations[i].addedNodes;
				if (!added) continue;
				for (var j = 0; j < added.length; j++) {
					var node = added[j];
					if (node.nodeType !== 1) continue;
					if (node.tagName === 'IMG' || node.tagName === 'VIDEO' || node.tagName === 'AUDIO' || node.tagName === 'SOURCE' || node.tagName === 'IFRAME' || node.tagName === 'EMBED') {
						hasNewMedia = true;
						break;
					}
					var children = node.querySelectorAll ? node.querySelectorAll('img, video, audio, source, iframe, embed') : [];
					if (children.length > 0) { hasNewMedia = true; break; }
				}
				if (hasNewMedia) break;
			}
			if (hasNewMedia && State.panelOpen) {
				var t = State.tab;
				if (t === 'img' || t === 'video' || t === 'audio' || t === 'm3u8') {
					LOG.debug('检测到新媒体元素，触发扫描');
					if (State.scanner) {
						State.scanner.scanIncremental().then(function () { State._renderThrottled(); });
					} else {
						Scanner.doFull(function () { State._renderThrottled(); });
					}
				}
			}
		}, 500));
														UI._moConnectedFlag = false;
		UI._moConnect = function () {
			if (!_mo || _moConnected) return;
			try {
				_mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
				_moConnected = true;
				UI._moConnectedFlag = true;
			} catch (e) { LOG.warn('MutationObserver 挂载失败:', e); }
		};
		UI._moDisconnect = function () {
			if (!_mo || !_moConnected) return;
			_moConnected = false;
			UI._moConnectedFlag = false;
			try { _mo.disconnect(); } catch (e) {}
			if (_moResumeTimer) { clearTimeout(_moResumeTimer); _moResumeTimer = null; }
			_moPaused = false;
		};
		LOG.info('MutationObserver 已就绪（面板打开时挂载）');
						if (State.panelOpen) UI._moConnect();
	} catch (e) { LOG.warn('MutationObserver 不可用:', e); }

		try {
		window.addEventListener('resize', U.throttle(function () {
			var b = UI._floatBtn || document.getElementById('_ms_float');
			if (!b) return;
			var x = parseFloat(b.style.left), y = parseFloat(b.style.top);
			if (!isNaN(x) && x > window.innerWidth - 66) b.style.left = (window.innerWidth - 66) + 'px';
			if (!isNaN(y) && y > window.innerHeight - 66) b.style.top = (window.innerHeight - 66) + 'px';
		}, 300));
	} catch (e) {}

		State.init();

		var _initRetryAt = 0;
	var _initRetryPlan = [500, 1500, 3000];
	(function scheduleInitRetry(i) {
		if (i >= _initRetryPlan.length) return;
		var delay = _initRetryPlan[i] - (i > 0 ? _initRetryPlan[i - 1] : 0);
		setTimeout(function () {
			U.rIC(function () {
				try {
					var now = U.monoNow();
					if (now - _initRetryAt >= 400) { _initRetryAt = now; State.init(); }
				} catch (e) {}
				scheduleInitRetry(i + 1);
			}, { timeout: 300 });
		}, delay);
	})(0);

		window.addEventListener('load', function () {
		U.rIC(function () {
			_initRetryAt = U.monoNow();
			State.init();
			setTimeout(function () {
				U.rIC(function () { State.init(); }, { timeout: 300 });
			}, 900);
		}, { timeout: 500 });
	});
		return {};
	})();
	} catch (_msFatal) {
		console.error('[MS] 致命错误，脚本未能启动:', _msFatal);
		try { console.error(_msFatal.stack); } catch (e) {}
	}
})();
