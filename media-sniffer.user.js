// ==UserScript==
// @name         媒体嗅探器 Media Sniffer Pro
// @namespace    http://tampermonkey.net/
// @version      1.15
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
    console.info('[MS] 脚本开始加载，版本:', '1.15');



    // =========================================================================
    // <svg width="18" height="18" viewBox="0 0 24 24" style="vertical-align:middle;"><svg   viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.045a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.01 17.461 2 12 2z"></path></svg></svg> 全局配置（图标 / 颜色 / 尺寸 / 配色板）
    // =========================================================================
    var MS_CONFIG = {
        VERSION: '1.15',
        // 界面风格白名单（唯一真源）。必须放在 MS_CONFIG 里 —— 它在最外层作用域，
        // State IIFE 与 UI IIFE 是**并列**的两个 IIFE，写在其中一个里面另一个取不到。
        // （v1.15 首版曾把它放在 State IIFE 内，导致 UI.applyUiStyle 抛 ReferenceError
        //   并被三处 try-catch 吞掉：风格系统整体罢工，连 ios27 的玻璃层都不再挂载。）
        UI_STYLE_IDS: ['normal', 'material', 'ios27', 'neumorph', 'brutal', 'terminal'],
        // 更新地址（固定文件名，永不带版本号）
        //   · 元数据 @downloadURL / @updateURL 用的是同一个常量值，这里写死保持同步
        //   · 内置更新器弹窗的「一键更新」也指向它，点一下就是原地覆盖，
        //     不会再从 releases/download/vX.Y/... 这种带版本号的链接装成一个新脚本
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
            // 32：ICONS.film 与 ICONS.video 的路径完全一致，且全篇没有任何使用点 —— 已删除。
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
            blue:   { nameKey: 'paletteBlue',   light: { primary: '#3b82f6', primary2: '#06b6d4' }, dark: { primary: '#60a5fa', primary2: '#22d3ee' } },
            green:  { nameKey: 'paletteGreen',  light: { primary: '#10b981', primary2: '#14b8a6' }, dark: { primary: '#34d399', primary2: '#2dd4bf' } },
            orange: { nameKey: 'paletteOrange', light: { primary: '#f59e0b', primary2: '#f97316' }, dark: { primary: '#fbbf24', primary2: '#fb923c' } },
            rose:   { nameKey: 'paletteRose',   light: { primary: '#f43f5e', primary2: '#ec4899' }, dark: { primary: '#fb7185', primary2: '#f472b6' } }
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

    // =========================================================================
    //  ⚠ 图标显示方式修正（针对宿主页面的 CSS 重置）
    //
    //  很多站点（含 Tailwind Preflight）会写一条
    //      audio,canvas,embed,iframe,img,object,svg,video{vertical-align:middle;display:block}
    //  本脚本运行在**别人页面上**，这条规则会把我们所有 <svg> 图标变成块级元素。
    //  后果非常直观：凡是「图标 + 文字」拼在一个 innerHTML 里的按钮（例如
    //  设置页「添加自定义配色」的确定按钮、插件页规则表单的保存按钮）都会被拆成
    //  两行 —— 图标独占第一行并靠左（块级元素不受 text-align 影响），
    //  文字被挤到第二行居中，按钮高度直接翻倍，看上去就是一大块纯色。
    //  （脚本里原本只有 playSmall / checkBig 两个图标手写了
    //    style="display:inline-block;vertical-align:middle"，其余 100 多处都受影响。）
    //
    //  这里在**图标定义处**统一补齐，保证任何位置用到的图标都是行内元素；
    //  另外再注入一条兜底规则，覆盖少数直接写在 HTML 字符串里、不走 ICONS 的 <svg>。
    // =========================================================================
    try {
        (function normalizeIcons() {
            var NEED = 'display:inline-block;vertical-align:middle';
            var icons = MS_CONFIG.ICONS;
            for (var k in icons) {
                if (!Object.prototype.hasOwnProperty.call(icons, k)) continue;
                var v = icons[k];
                if (typeof v !== 'string' || v.indexOf('<svg') !== 0) continue;
                // 先取出开标签本身。只检查开标签 —— 图标内部元素可能带 display，
                // 拿整串去判断会误伤；而且插 style 也必须在开标签里。
                var om = v.match(/^<svg\b[^>]*?>/);
                if (!om) continue;
                var open = om[0];
                if (/display\s*:/.test(open)) continue;              // 已显式声明 → 尊重原值
                if (/\sstyle="/.test(open)) {
                    // 已有 style（例如 play 的 filter）→ 合并进去，
                    // 绝不能另起一个 style 属性：那样是非法 HTML，浏览器只认第一个。
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
            // 选择器带上我们的容器 / id 前缀，特异性高过宿主那条裸 `svg{}`，
            // 再加 !important 防住少数站点把重置写成 !important 的情况。
            st.textContent = '#_ms_panel svg,#_ms_float svg,#_ms_sel_pop svg,#_ms_queue_modal svg,'
                + '#_ms_vlp_modal svg,#_ms_footer_menu svg,#_ms_float_ctx_menu svg,#_ms_filter_panel svg,'
                + '._ms_toast svg,#_ms_minimized_bar svg,#_ms_status svg,[id^="_ms_"] svg'
                + '{display:inline-block !important;vertical-align:middle !important;}';
            (document.head || document.documentElement).appendChild(st);
        })();
    } catch (e) {}

    // =========================================================================
    //  组件工厂（按钮 / 元素 / 卡片 / 最小化栏）
    // =========================================================================
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
            // MINOR-26: 阴影改走 CSS 变量 --_ms_bar_shadow（由 applyUiStyle 按当前配色写入），
            // 内联值只作为兜底。原先这里写死 rgba(0,0,0,.35)，而 iOS27 规则用 !important
            // 覆盖它——内联值永远不生效，配色一变两者还容易不一致。
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
            // FIX-15: 原来硬编码靛蓝，切换「玫瑰红」等配色后卡片选中描边仍是旧色
            var primary = c.primary || MS_CONFIG.COLORS.primary;
            var borderStyle = isSel ? '2px solid ' + primary : (inSelMode ? '1px dashed ' + primary : '1px solid ' + c.border);
            // FIX-15: 描边改了、选中光晕还写死 rgba(99,102,241)，换成当前配色的同色透明版
            var shadow = isSel ? 'box-shadow:0 4px 12px ' + UI._ios27Rgba(primary, 0.35) + ';' : '';
            var nameFontSize = isMobile ? '13px' : '11px';
            var namePadding = isMobile ? '8px 10px' : '6px 8px';
            var nameMaxHeight = isMobile ? '56px' : '48px';
            var markSize = isMobile ? '28px' : '24px';
            var markFontSize = isMobile ? '16px' : '14px';
            var iconSize = isMobile ? '32px' : '28px';
            var thumbHtml = '';
            if (kind === 'img') {
                thumbHtml = '<img src="' + SEC.escapeAttr(url) + '" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;" onerror="this.style.display=\'none\';this.parentNode.style.background=\'' + MS_CONFIG.COLORS.darkGradientEnd + '\';">';
            } else if (kind === 'video') {
                var cached = UI._thumbCache[url];
                var grad = 'linear-gradient(135deg,' + MS_CONFIG.COLORS.darkGradientStart + ',' + MS_CONFIG.COLORS.darkGradientEnd + ')';
                if (cached) {
                    thumbHtml = '<img src="' + SEC.escapeAttr(cached) + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;" onerror="var d=document.createElement(\'div\');d.style.cssText=\'width:100%;height:100%;background:' + grad + ';display:flex;align-items:center;justify-content:center;color:' + MS_CONFIG.COLORS.white + ';font-size:' + iconSize + ';\';d.textContent=\'' + MS_CONFIG.ICONS.play + '\';this.parentNode.appendChild(d);this.remove();">';
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
                '<div style="padding:' + namePadding + ';font-size:' + nameFontSize + ';color:' + c.txt + ';line-height:1.3;word-break:break-all;overflow:hidden;max-height:' + nameMaxHeight + ';text-overflow:ellipsis;">' + U.trunc(SEC.nameFromUrl(url), isMobile ? 40 : 30) + '</div>' +
                markHtml +
                iframeBadge +
                '</div>';
        }
    };

    var U = (function () {
        'use strict';
    // =========================================================================
    //  模块 1：核心工具 (Utils) + 日志系统
    // =========================================================================
    var U = {};
    U.VERSION = '1.15';
    U.toStr = Object.prototype.toString;
    U.isArr = Array.isArray || function (x) { return U.toStr.call(x) === '[object Array]'; };
    U.isStr = function (x) { return typeof x === 'string'; };
    U.isNum = function (x) { return typeof x === 'number' && !isNaN(x); };
    U.isFn = function (x) { return typeof x === 'function'; };
    U.now = function () { return Date.now(); };
    // 性能 9：U.now() 除了计时还被用作「时间戳」和「ID 生成」（历史记录 time、
    // installTime、'file-' + U.now() 等），必须保持真实墙上时间，不能换成
    // performance.now()（那是页面加载起的毫秒数，会把历史时间显示成 1970 前后，
    // 也会让 ID 长度骤减、碰撞概率上升）。
    // 因此另开一个单调时钟专供「算耗时/限流」：performance.now 不受系统时间调整
    // 与 NTP 校准影响，且精度更高，单调性也有保证。
    // P2-13：原来 U.monoNow 定义在 U._monoNow 之前，函数体里却引用后者 ——
    // 靠「调用时闭包已求值」侥幸成立，读代码时很容易被当成引用了一个还不存在的成员
    // （反过来，若有人在赋值前调用 monoNow，就会静默退回 Date.now）。
    // 这里先把实现取出来存进局部变量，再定义 monoNow，依赖关系一眼可见。
    var monoImpl = (function () {
        try {
            if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                return function () { return performance.now(); };
            }
        } catch (e) {}
        return null;
    })();
    U._monoNow = monoImpl;                       // 保留旧引用点，便于调试/替换
    U.monoNow = monoImpl
        ? function () { return monoImpl(); }     // 有 performance.now：单调递增、不受系统时间调整影响
        : U.now;                                 // 没有则退回墙上时间（功能可用，只是不保证单调）
    // 性能 10 需要：把真正执行推到绘制前一帧
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

    // ===== 日志系统（分级 debug/info/warn/error）=====
    var LOG = {};
    LOG.LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
    LOG.level = LOG.LEVELS.INFO; // 默认 INFO 级别
    LOG.prefix = '[MS-v1]';
    LOG._out = function (lvl, args) {
        if (lvl < LOG.level) return;
        var method = lvl === 0 ? 'log' : lvl === 1 ? 'info' : lvl === 2 ? 'warn' : 'error';
        try { console[method].apply(console, [LOG.prefix].concat(Array.from(args))); } catch (e) {}
    };
    LOG.debug = function () { LOG._out(0, arguments); };
    LOG.info = function () { LOG._out(1, arguments); };
    LOG.warn = function () { LOG._out(2, arguments); };
    LOG.error = function () { LOG._out(3, arguments); };
    LOG.setLevel = function (lvl) { if (U.isNum(lvl) && lvl >= 0 && lvl <= 3) LOG.level = lvl; };

    // ===== 防抖/节流 =====
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
            // 性能 9：限流算差值用单调时钟，避免用户改系统时间 / NTP 校准时出现
            // rem 忽大忽小（时间往回跳时 rem 变大 → 该立刻执行却被推迟到下一轮）
            var ctx = this, args = arguments, n = U.monoNow();
            var rem = wait - (n - last);
            if (rem <= 0) { if (t) { clearTimeout(t); t = null; updateTimer(); } last = n; fn.apply(ctx, args); }
            else if (!t) { t = setTimeout(function () { last = U.monoNow(); t = null; updateTimer(); fn.apply(ctx, args); }, rem); updateTimer(); }
        };
        updateTimer();
        return ret;
    };

    // ===== requestIdleCallback 兼容 =====
    U.rIC = function (cb, opts) {
        try {
            if (typeof requestIdleCallback === 'function') return requestIdleCallback(cb, opts);
        } catch (e) {}
        return setTimeout(cb, 1);
    };

    // ===== HTML 转义 =====
    // ===== 数组去重（Set 实现，避免对象键与原型链开销）=====
    // 19：统一的安全执行包装。项目里大量 `try {} catch (e) {}` 会把异常吃得
    // 一点痕迹都不留 —— v1.15 首版「风格系统整体罢工」正是因为 applyUiStyle
    // 抛 ReferenceError 被空 catch 吞掉，只在控制台留了一行不起眼的日志。
    // 关键路径统一改用 safeRun：异常仍然被吞（不打断主流程），但一定会记日志。
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

    // 轻量字符串哈希（FNV-1a 32 位）。用于「需要区分长文本、但不想为此把
    // 全文存进键里」的场景 —— 比截断可靠，也比保留原文省内存。
    U.hashStr = function (str) {
        var h = 0x811c9dc5;
        var t = String(str == null ? '' : str);
        for (var i = 0; i < t.length; i++) {
            h ^= t.charCodeAt(i);
            h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
        }
        return h.toString(36);
    };

    // 性能 3：SPA 长会话里的几个缓存原来没有任何上限，页面开久了内存只涨不跌：
    //   · UI._thumbCache      —— 缓存的是 dataURL（视频封面），单条可达几十 KB，最要命
    //   · State.translateCache —— 翻译结果字符串
    //   · VideoResolver._cache —— 视频解析结果对象（含分 P / 清晰度列表）
    //   · Dl._usedNames        —— 重名文件名登记表
    // 这里给一个极简 LRU：Map 的插入顺序就是访问顺序，超限就淘汰最早的那个键。
    // 不做 get 时的 move-to-end（那是双倍 Map 操作），按「先入先出 + 超限裁剪」已经
    // 足够让内存有界，且实现只有几行、没有额外开销。
    U.lru = function (store, limit, onEvict) {
        var isMap = (typeof Map === 'function') && (store instanceof Map);
        var isSet = (typeof Set === 'function') && (store instanceof Set);
        // P1-12：普通对象的键队列存在闭包里，不再挂到 store.__keys 上。
        // 挂上去会污染缓存对象自身的键空间 —— for...in 会多出一个 __keys，
        // JSON.stringify(缓存) 会把整个键队列一起序列化出去（体积还会随条数增长），
        // 任何「遍历这个缓存对象」的代码都得先把它排除掉。
        var objKeys = [];
        var api = {
            limit: limit,
            set: function (key, val) {
                if (isSet) {
                    // 先删再加 = 真正按「最近使用」排序（Set.add 对已存在元素不会重排）
                    store.delete(key);
                    store.add(key);
                } else if (isMap) {
                    store.delete(key);
                    store.set(key, val);
                } else {
                    // 普通对象：先用 Map 语义记录顺序做不到，这里用显式的键队列
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

    // ===== 有界记忆化（热路径：URL 解析等纯函数）=====
    // new URL() 是热点里最贵的调用之一，缓存后重复 URL 直接命中。
    // 上限到达时按插入顺序批量淘汰 1/4，避免维护完整 LRU 的开销。
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

    // ===== 安全 JSON =====
    U.safeJson = function (s, def) {
        try { return JSON.parse(s); } catch (e) { return def; }
    };

    // FIX-12：GM_getValue 的类型取决于「写入时存的是什么」。
    // 本脚本用 GM_setValue(key, JSON.stringify(arr)) 存，所以读出是字符串；
    // 但如果用户从 Tampermonkey 面板手工改过、或历史版本存过原生数组/对象，
    // 读出来就是对象 —— 此时 JSON.parse(对象) 会抛错并被吞掉，历史静默清零。
    // 统一按「数组 / 字符串 / {items|history:[...]}」三种形态兼容。
    // FIX-14：CSS.escape 并非所有环境都有（脚本 @match *://*/*，会跑在各种
    // 内核的页面里；老 WebView / 老 Safari 都没有它，而它一旦缺失，
    // 调用处会直接抛 ReferenceError，定位资源功能整个失效）。
    // 没有就退回按 CSS 标识符规则自行转义（等价于标准 polyfill）。
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

    // ===== 日期格式化 =====
    U.dateStr = function () {
        var d = new Date();
        function pad(n) { return n < 10 ? '0' + n : String(n); }
        return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '_' + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
    };

    // ===== 字节大小显示 =====
    U.formatSize = function (b) {
        if (b == null || b < 0) return '';
        if (b < 1024) return b + ' B';
        if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
        if (b < 1073741824) return (b / 1048576).toFixed(1) + ' MB';
        return (b / 1073741824).toFixed(2) + ' GB';
    };

    // ===== 时间格式化（秒 → HH:MM:SS）=====
    U.formatTime = function (sec) {
        if (!U.isNum(sec) || sec < 0) return '00:00';
        var h = Math.floor(sec / 3600);
        var m = Math.floor((sec % 3600) / 60);
        var s = Math.floor(sec % 60);
        function pad(n) { return n < 10 ? '0' + n : String(n); }
        if (h > 0) return pad(h) + ':' + pad(m) + ':' + pad(s);
        return pad(m) + ':' + pad(s);
    };

    // ===== 字符串截断 =====
    U.trunc = function (s, n) {
        if (!U.isStr(s)) return '';
        if (s.length <= n) return s;
        return s.substring(0, n - 1) + '…';
    };

    // ===== 域名 =====
    U.getHost = function () {
        try { return (location.hostname || '').replace(/\./g, '-') || 'site'; } catch (e) { return 'site'; }
    };

    // ===== 移动端检测 =====
    U.isMobile = function () {
        try { return /Mobi|Android|iPhone|iPad|HarmonyOS/i.test(navigator.userAgent) || window.innerWidth < 700; } catch (e) { return false; }
    };

    // ===== 生成随机颜色 =====
    // ===== 深拷贝 =====
    U.deepClone = function (obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (U.isArr(obj)) return obj.map(function (v) { return U.deepClone(v); });
        var out = {};
        for (var k in obj) if (obj.hasOwnProperty(k)) out[k] = U.deepClone(obj[k]);
        return out;
    };

    // ===== 数组分组 =====
        U.LOG = LOG;
        return U;
    })();
    var LOG = U.LOG;

    var LANG = (function () {
        'use strict';
    // =========================================================================

    // =========================================================================
    // ===== 模块 1b：国际化系统 (i18n)
    // =========================================================================
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
            'tabAudio': '音频',
            'tabM3u8': '流媒体',
            'tabTranslate': '翻译',
            'tabCookie': 'Cookie',
            'tabStorage': '存储',
            'tabSettings': '设置',
            'btnSelAll': '全选', 'btnSelNone': '取消全选',
            'extractCover': '提取封面', 'filterPanel': '筛选设置',
            'advFilterTitle': MS_CONFIG.ICONS.wrench + '高级筛选设置',
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
            'copyCookieStr': MS_CONFIG.ICONS.copy + '复制 Cookie 字符串',
            'copyJson': '复制 JSON',
            'addCookie': MS_CONFIG.ICONS.plus + '新增 Cookie',
            'clearSite': MS_CONFIG.ICONS.trash + '清空本站',
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
            'addItem': MS_CONFIG.ICONS.plus + '新增项',
            'clearAll': MS_CONFIG.ICONS.trash + '清空全部',
            'keyName': '键名',
            'keyValue': '键值',
            'confirmClearStorage': '确认清空存储？',
            'cleared': '已清空',
            'addToLs': '添加到 localStorage',
            'lsTitle': MS_CONFIG.ICONS.package + 'localStorage',
            'ssTitle': 'sessionStorage',
            'lsCount': MS_CONFIG.ICONS.package + 'localStorage {n} 条 · sessionStorage {m} 条',
            'transTitle': '翻译工具',
            'transIntro': '· 使用 MyMemory 免费 API（国内可用）· 一次最多 500 字符<br/>· 快捷键 Alt+T 翻译当前页选中文字',
            'transInputPh': '请输入要翻译的文本...',
            'transResultPh': '翻译结果将显示在这里',
            'transBtn': '翻译',
            'zhToEn': '中→英',
            'enToZh': '英→中',
            'clearBtn': '清空',
            'copyResult': MS_CONFIG.ICONS.copy + '复制结果',
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
            'speakBtn': MS_CONFIG.ICONS.volume + '发音',
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
            'm3u8Fail': '下载失败',
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
            'm3u8Title': MS_CONFIG.ICONS.stream + '流媒体：{n} 个 m3u8',
            'noM3u8': '暂无 m3u8 资源',
            'dlMerge': '下载并合并',
            'genScriptBtn': '生成脚本',
            'detailBtn': '详情',
            'm3u8Detail': MS_CONFIG.ICONS.stream + 'm3u8 流媒体详情',
            'parsing': '解析中...',
            'parseResult': '解析结果：{n} 个分片',
            'masterStreams': '多码率流，共 {n} 个子流：',
            'segmentsInfo': '分片列表，共 {n} 个分片，总时长 {t}',
            'encrypted': MS_CONFIG.ICONS.lock + 'AES 加密',
            'notEncrypted': '未加密',
            'yes': '是',
            'no': '否',
            'parseFailNet': '网络请求失败',
            'parseFailTimeout': '请求超时',
            'm3u8PreviewHint': 'm3u8 不可直接预览，请下载',
            'logLevelTitle': MS_CONFIG.ICONS.chart + '日志级别（调试用）',
            'logDebug': '调试',
            'logInfo': '信息',
            'logWarn': '警告',
            'logError': '错误',
            'otherOps': MS_CONFIG.ICONS.palette + '其他操作',
            'exportAllConfig': '导出全部配置',
            'importConfig': MS_CONFIG.ICONS.download + '导入配置',
            'resetAll': '↻ 重置全部设置',
            'batchTitle': MS_CONFIG.ICONS.package + '批量下载设置',
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
            'requestHeaders': MS_CONFIG.ICONS.wrench + '请求头设置',
            'referer': 'Referer:',
            'userAgent': 'User-Agent:',
            'cookie': 'Cookie:',
            'infoLine1': '媒体嗅探器 Pro v1.15 · SelectionManager · 拖拽排序 · 收藏夹 · 智能去重 · 分组 · 批量操作注册 · 插件系统',
            'infoLine2': '快捷键：Alt+T 翻译选中 · Alt+B 开关面板 · Esc 关闭',
            'clickTabScan': '点击标签扫描',
            'dlProgress': '下载进度',
            'dlProgressText': '{done} / {total}（失败 {fail}）· {speed} · 预计剩余 {eta}',
            'shortcutTitle': MS_CONFIG.ICONS.keyboard + '快捷键设置',
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
            'advFilterTitle': MS_CONFIG.ICONS.wrench + 'Advanced Filter Settings',
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
            'copyCookieStr': MS_CONFIG.ICONS.copy + 'Copy Cookie String',
            'copyJson': 'Copy JSON',
            'addCookie': MS_CONFIG.ICONS.plus + 'Add Cookie',
            'clearSite': MS_CONFIG.ICONS.trash + 'Clear Site',
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
            'addItem': MS_CONFIG.ICONS.plus + 'Add Item',
            'clearAll': MS_CONFIG.ICONS.trash + 'Clear All',
            'keyName': 'Key:',
            'keyValue': 'Value:',
            'confirmClearStorage': 'Clear localStorage and sessionStorage?',
            'cleared': 'Cleared',
            'addToLs': '✓ Added to localStorage',
            'lsTitle': MS_CONFIG.ICONS.package + 'localStorage',
            'ssTitle': 'sessionStorage',
            'lsCount': MS_CONFIG.ICONS.package + 'localStorage {n} · sessionStorage {m}',
            'transTitle': 'Text Translation',
            'transIntro': '· MyMemory free API · Max 500 chars<br/>· Shortcut: Alt+T to translate selected text',
            'transInputPh': 'Enter or paste text to translate…',
            'transResultPh': 'Translation result appears here…',
            'transBtn': 'Translate',
            'zhToEn': 'ZH→EN',
            'enToZh': 'EN→ZH',
            'clearBtn': 'Clear',
            'copyResult': MS_CONFIG.ICONS.copy + 'Copy Result',
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
            'speakBtn': MS_CONFIG.ICONS.volume + 'Speak',
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
            'downloadSelBtn': MS_CONFIG.ICONS.arrowDown + 'Download',
            'copyN': 'Copy ({n})',
            'downloadN': 'Download ({n})',
            'genScript': MS_CONFIG.ICONS.edit + 'Generate Script',
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
            'm3u8Fail': 'Download failed',
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
            'm3u8Title': MS_CONFIG.ICONS.stream + 'Streams: {n} m3u8',
            'noM3u8': 'No m3u8 streams found',
            'dlMerge': MS_CONFIG.ICONS.arrowDown + 'Download & Merge',
            'genScriptBtn': MS_CONFIG.ICONS.edit + 'Generate Script',
            'detailBtn': 'Details',
            'm3u8Detail': MS_CONFIG.ICONS.stream + 'm3u8 Stream Details',
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
            'logLevelTitle': MS_CONFIG.ICONS.chart + 'Log Level (debug)',
            'logDebug': 'DEBUG (verbose)',
            'logInfo': 'INFO (default)',
            'logWarn': 'WARN',
            'logError': 'ERROR (errors only)',
            'otherOps': MS_CONFIG.ICONS.palette + 'Other Actions',
            'exportAllConfig': 'Export All Config',
            'importConfig': MS_CONFIG.ICONS.download + 'Import Config',
            'resetAll': '↻ Reset All Settings',
            'batchTitle': MS_CONFIG.ICONS.package + 'Batch Download Settings',
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
            'requestHeaders': MS_CONFIG.ICONS.wrench + 'Request Headers',
            'referer': 'Referer:',
            'userAgent': 'User-Agent:',
            'cookie': 'Cookie:',
            'infoLine1': 'Media Sniffer Pro v1.15 · SelectionManager · Drag Sort · Favorites · Smart Dedup · Groups · Batch Actions · Plugin System',
            'infoLine2': 'Shortcuts: Alt+T Translate · Alt+B Toggle · Esc Close',
            'clickTabScan': 'Click a tab above to start scanning',
            'dlProgress': 'Download Progress',
            'dlProgressText': '{done} / {total} ({fail} failed) · {speed} · ETA {eta}',
            'shortcutTitle': MS_CONFIG.ICONS.keyboard + 'Shortcuts',
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
            'advFilterTitle': MS_CONFIG.ICONS.wrench + '詳細フィルター設定',
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
            'copyCookieStr': MS_CONFIG.ICONS.copy + 'Cookie文字列コピー',
            'copyJson': 'JSONコピー',
            'addCookie': MS_CONFIG.ICONS.plus + 'Cookie追加',
            'clearSite': MS_CONFIG.ICONS.trash + 'サイトをクリア',
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
            'addItem': MS_CONFIG.ICONS.plus + '項目を追加',
            'clearAll': MS_CONFIG.ICONS.trash + 'すべてクリア',
            'keyName': 'キー：',
            'keyValue': '値：',
            'confirmClearStorage': 'localStorageとsessionStorageをクリアしますか？',
            'cleared': 'クリアしました',
            'addToLs': '✓ localStorageに追加しました',
            'lsTitle': MS_CONFIG.ICONS.package + 'localStorage',
            'ssTitle': 'sessionStorage',
            'lsCount': MS_CONFIG.ICONS.package + 'localStorage {n}件 ·  sessionStorage {m}件',
            'transTitle': 'テキスト翻訳',
            'transIntro': '・MyMemory無料API ・最大500文字<br/>・ショートカット: Alt+Tで選択テキスト翻訳',
            'transInputPh': '翻訳するテキストを入力または貼り付け…',
            'transResultPh': '翻訳結果がここに表示されます…',
            'transBtn': '翻訳',
            'zhToEn': '中→英',
            'enToZh': '英→中',
            'clearBtn': 'クリア',
            'copyResult': MS_CONFIG.ICONS.copy + '結果をコピー',
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
            'downloadSelBtn': MS_CONFIG.ICONS.arrowDown + 'ダウンロード',
            'copyN': 'コピー({n})',
            'downloadN': 'ダウンロード({n})',
            'genScript': MS_CONFIG.ICONS.edit + 'スクリプト生成',
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
            'm3u8Fail': 'DL失敗',
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
            'm3u8Title': MS_CONFIG.ICONS.stream + 'ストリーム：{n} m3u8',
            'noM3u8': 'm3u8ストリームはありません',
            'dlMerge': MS_CONFIG.ICONS.arrowDown + 'DLして結合',
            'genScriptBtn': MS_CONFIG.ICONS.edit + 'スクリプト生成',
            'detailBtn': '詳細',
            'm3u8Detail': MS_CONFIG.ICONS.stream + 'm3u8ストリーム詳細',
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
            'logLevelTitle': MS_CONFIG.ICONS.chart + 'ログレベル（デバッグ用）',
            'logDebug': 'DEBUG（詳細）',
            'logInfo': 'INFO（デフォルト）',
            'logWarn': 'WARN（警告）',
            'logError': 'ERROR（エラーのみ）',
            'otherOps': MS_CONFIG.ICONS.palette + 'その他の操作',
            'exportAllConfig': '全設定エクスポート',
            'importConfig': MS_CONFIG.ICONS.download + '設定インポート',
            'resetAll': '↻ 全設定リセット',
            'batchTitle': MS_CONFIG.ICONS.package + '一括DL設定',
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
            'requestHeaders': MS_CONFIG.ICONS.wrench + 'リクエストヘッダー',
            'referer': 'Referer:',
            'userAgent': 'User-Agent:',
            'cookie': 'Cookie:',
            'infoLine1': 'メディアスニッファー Pro v1.15 · モジュール設計 · AES-128復号 · 仮想リスト · 進捗可視化 · プラグインシステム',
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
            'advFilterTitle': MS_CONFIG.ICONS.wrench + '고급 필터 설정',
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
            'copyCookieStr': MS_CONFIG.ICONS.copy + '쿠키 문자열 복사',
            'copyJson': 'JSON 복사',
            'addCookie': MS_CONFIG.ICONS.plus + '쿠키 추가',
            'clearSite': MS_CONFIG.ICONS.trash + '사이트 비우기',
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
            'addItem': MS_CONFIG.ICONS.plus + '항목 추가',
            'clearAll': MS_CONFIG.ICONS.trash + '모두 비우기',
            'keyName': '키:',
            'keyValue': '값:',
            'confirmClearStorage': 'localStorage와 sessionStorage를 비우시겠습니까?',
            'cleared': '비워졌습니다',
            'addToLs': '✓ localStorage에 추가됨',
            'lsTitle': MS_CONFIG.ICONS.package + 'localStorage',
            'ssTitle': 'sessionStorage',
            'lsCount': MS_CONFIG.ICONS.package + 'localStorage {n}개 ·  sessionStorage {m}개',
            'transTitle': '텍스트 번역',
            'transIntro': '· MyMemory 무료 API · 최대 500자<br/>· 단축키: Alt+T로 선택 텍스트 번역',
            'transInputPh': '번역할 텍스트를 입력하거나 붙여넣으세요…',
            'transResultPh': '번역 결과가 여기에 표시됩니다…',
            'transBtn': '번역',
            'zhToEn': '중→영',
            'enToZh': '영→중',
            'clearBtn': '비우기',
            'copyResult': MS_CONFIG.ICONS.copy + '결과 복사',
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
            'downloadSelBtn': MS_CONFIG.ICONS.arrowDown + '다운로드',
            'copyN': '복사({n})',
            'downloadN': '다운로드({n})',
            'genScript': MS_CONFIG.ICONS.edit + '스크립트 생성',
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
            'm3u8Fail': '다운로드 실패',
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
            'm3u8Title': MS_CONFIG.ICONS.stream + '스트림: {n} m3u8',
            'noM3u8': 'm3u8 스트림이 없습니다',
            'dlMerge': MS_CONFIG.ICONS.arrowDown + '다운로드 및 병합',
            'genScriptBtn': MS_CONFIG.ICONS.edit + '스크립트 생성',
            'detailBtn': '세부정보',
            'm3u8Detail': MS_CONFIG.ICONS.stream + 'm3u8 스트림 세부정보',
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
            'logLevelTitle': MS_CONFIG.ICONS.chart + '로그 레벨（디버그용）',
            'logDebug': 'DEBUG（상세）',
            'logInfo': 'INFO（기본）',
            'logWarn': 'WARN（경고）',
            'logError': 'ERROR（오류만）',
            'otherOps': MS_CONFIG.ICONS.palette + '기타 작업',
            'exportAllConfig': '전체 설정 내보내기',
            'importConfig': MS_CONFIG.ICONS.download + '설정 가져오기',
            'resetAll': '↻ 모든 설정 재설정',
            'batchTitle': MS_CONFIG.ICONS.package + '일괄 다운로드 설정',
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
            'requestHeaders': MS_CONFIG.ICONS.wrench + '요청 헤더',
            'referer': 'Referer:',
            'userAgent': 'User-Agent:',
            'cookie': 'Cookie:',
            'infoLine1': '미디어 스니퍼 Pro v1.15 · 모듈 구조 · AES-128 복호화 · 가상 리스트 · 진행률 · 플러그인 시스템',
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
    // 占位符正则缓存：LANG.get 是渲染热路径（列表里每张卡都要取几条文案），
    // 原来每次调用都为每个占位符 new 一个 RegExp —— 一屏几十张卡就是上百次编译。
    // 正则只跟 key 名有关，缓存起来即可（上限 200，防止畸形 key 撑爆内存）。
    LANG._varReCache = {};
    LANG._varReCount = 0;
    LANG._varRe = function (k) {
        var re = LANG._varReCache[k];
        if (re) return re;
        re = new RegExp('\\{' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\}', 'g');
        if (LANG._varReCount < 200) { LANG._varReCache[k] = re; LANG._varReCount++; }
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

        return LANG;
    })();
    var SEC = (function () {
        'use strict';
    // ===== 模块 2：安全 (Security) + AES-128 解密
    // =========================================================================
    var SEC = {};
    SEC.ALLOWED_PROTOCOLS = { 'http:': 1, 'https:': 1 };
    SEC.ALLOWED_MIME_PREFIX = { 'image/': 1, 'video/': 1, 'audio/': 1 };

    // FIX-08：属性值转义。
    // 卡片 HTML 里的 data-url / src 是直接拼字符串的，而 URL 来自被嗅探的页面，
    // 只要出现一个双引号就能把属性截断、把后面的内容变成新属性（HTML 注入），
    // 轻则卡片渲染错乱、重则注入事件属性。
    // 注意：浏览器解析时会把实体解码回来，所以 getAttribute('data-url') 拿到的仍是原值，
    // querySelector('[data-url="..."]') 也仍然要用原始 URL 去匹配，两边无需额外处理。
    // 性能 1：原来 escapeAttr 串了 5 个 .replace，等于把整串扫 5 遍；
    // 资源卡片每张都要转义 URL，100 张卡就是 500 次全串遍历。
    // 现在改为「一次扫描 + 查表」：
    //   · 正则只扫一遍，命中才替换；
    //   · 绝大多数 URL / 文件名根本不含这 5 个字符，先做一次廉价检测直接返回原串，
    //     连替换回调都不进（热路径最常见的就是这种）。
    var ESC_ATTR_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    var ESC_HTML_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
    var ESC_ATTR_RE = /[&<>"']/g;   // 复用同一实例，避免每次调用编译正则
    var ESC_HTML_RE = /[&<>]/g;

    SEC.escapeAttr = function (s) {
        if (s == null) return '';
        s = String(s);
        if (!ESC_ATTR_RE.test(s)) return s;   // 快路径：无需转义
        ESC_ATTR_RE.lastIndex = 0;
        return s.replace(ESC_ATTR_RE, function (ch) { return ESC_ATTR_MAP[ch]; });
    };

    // 文本节点转义：URL 里出现 < 时不会被当成标签开头
    SEC.escapeHtml = function (s) {
        if (s == null) return '';
        s = String(s);
        if (!ESC_HTML_RE.test(s)) return s;
        ESC_HTML_RE.lastIndex = 0;
        return s.replace(ESC_HTML_RE, function (ch) { return ESC_HTML_MAP[ch]; });
    };
    // 由上面的表派生一份数组，热路径里避免 for...in
    SEC.MIME_PREFIX_LIST = (function () {
        var out = [];
        for (var k in SEC.ALLOWED_MIME_PREFIX) if (SEC.ALLOWED_MIME_PREFIX.hasOwnProperty(k)) out.push(k);
        return out;
    })();

    // ===== URL 安全判断 =====
    // 热路径优化：按首字母分流，http(s) 直接返回，不再构造 URL 对象。
    // 语义与旧实现保持一致（javascript:/vbscript: 一律拒绝，data: 仅放行三类媒体 MIME）。
    // 「//」后必须紧跟合法主机首字符（字母数字、非 ASCII 域名，或 IPv6 的 [..]），
    // 否则与旧实现（new URL 抛错后判 false）不一致
    SEC._httpRe = /^https?:\/\/(?:[A-Za-z0-9\u0080-\uFFFF]|\[[0-9A-Fa-f:.]+\])/i;
    SEC._ctrlRe = /^\s*(javascript|vbscript)\s*:/i;
    SEC._otherProtoRe = /^(blob|file):/i;
    SEC._relRe = /^[\/\.]/;
    SEC.isSafeUrl = function (url) {
        if (!url || !U.isStr(url)) return false;
        var i = 0, len = url.length;
        while (i < len && url.charCodeAt(i) <= 32) i++;     // 跳过前导空白
        if (i >= len) return false;
        var c = url.charCodeAt(i) | 32;                     // ASCII 小写
        if (c === 104) {                                     // h → http(s)
            if (SEC._httpRe.test(url.slice(i, i + 9))) {
                // 主机段（到第一个 / ? # 为止）不能含空白，否则 new URL 会抛错
                var rest = url.slice(i + 8);
                var cut = rest.search(/[\/?#]/);
                if (cut === -1) cut = rest.length;
                if (!/\s/.test(rest.slice(0, cut))) return true;
            }
        } else if (c === 47) {                               // / 相对路径
            return true;
        } else if (c === 106 || c === 118) {                 // j / v
            if (SEC._ctrlRe.test(url)) return false;
        } else if (c === 100) {                              // d → data:
            var low = url.toLowerCase();
            if (low.indexOf('data:') === 0) {
                var mime = low.substring(5).split(';')[0];
                var mps = SEC.MIME_PREFIX_LIST;
                for (var mi = 0; mi < mps.length; mi++) if (mime.indexOf(mps[mi]) === 0) return true;
                return false;
            }
        } else if (c === 98 || c === 102) {                  // b / f → blob: / file:
            if (SEC._otherProtoRe.test(url.trim())) return true;
        }
        try {
            var parsed = new URL(url.trim(), location.href);
            return !!SEC.ALLOWED_PROTOCOLS[parsed.protocol];
        } catch (e) {
            return SEC._relRe.test(url.trim());
        }
    };

    // 绝对地址快速通道：只有「URL 解析后不会变形」的规范形式才原样返回，
    // 其余（大写 scheme/主机、含空白、含非 ASCII、含需转义字符）交给解析器，
    // 保证与原实现字节级一致。解析结果按 src 记忆化（同一 src 会重复出现）。
    // 只认「解析后完全不变」的形式：小写 scheme、小写主机（可带端口）、紧跟 '/'、
    // 路径内只含无需转义的 ASCII 字符。
    SEC._absRe = /^https?:\/\/[a-z0-9](?:[a-z0-9\-.]*[a-z0-9])?(?::\d+)?\/[A-Za-z0-9\-._~!$&'()*+,;=:@%\/?#]*$/;
    SEC._absResolve = U.memo1(function (src) {
        try { return new URL(src, location.href).href; } catch (e) { return String(src).trim(); }
    }, 1500);
    SEC.absUrl = function (src, baseUrl) {
        if (!src) return '';
        // 已是规范绝对地址：无需解析。含 "/." 的路径可能被点段归一化，一律走解析器。
        if (!baseUrl && src.indexOf('/.') === -1 && SEC._absRe.test(src)) return src;
        if (baseUrl) {                                       // 带基准地址的调用（m3u8 解析）不走缓存
            try { return new URL(src, baseUrl).href; } catch (e) { return String(src).trim(); }
        }
        return SEC._absResolve(src);
    };

    // ===== 文件名安全化 =====
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
        // 31：原来把前导点也一起删了 —— '.gitignore' / '.env' 这类合法文件名
        // 会变成 'gitignore'。只去前导空白；连续点（路径穿越）单独处理。
        s = s.replace(/^\s+/, '');
        s = s.replace(/^\.+/, function (dots) { return dots.length > 1 ? '_' : dots; });   // '..' → '_'
        s = s.replace(/[\s\.]+$/, '');
        if (s.length > 180) {
            // 25：截断后缀原来用毫秒时间戳的末 4 位（36 进制）—— 同一毫秒内批量下载
            // 多个长文件名会得到完全相同的后缀，重名检测失效 → 互相覆盖。
            // 掺入随机分量，几十万次调用也几乎不会撞。
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

    // 直接切字符串取路径末段，等价于 pathname.split('/').pop()，但省掉一次 URL 解析。
    // 例外：空串与「scheme 后不带 //」的地址（javascript:/about:/data: …）仍走真实解析，
    // 这类输入 pathname 语义无法用字符串切分复刻。
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
            // 主机段含空格 → 非法地址（new URL 会抛错），与原实现的 "file" 兜底一致
            if ((slash === -1 ? s.substring(aStart) : s.substring(aStart, slash)).indexOf(' ') !== -1) return 'file';
            s = slash === -1 ? '/' : s.substring(slash);
        }
        var cut = s.lastIndexOf('/');
        var name = cut === -1 ? s : s.substring(cut + 1);
        return name || 'file';
    }, 1500);

    // 扩展名 → 类型查表（等价于原来的 4 条正则，但只需一次 lastIndexOf）。
    // 注意：ogg 在原实现里先命中 video 分支，这里保持同样的优先级。
    SEC._KIND_EXT = {
        png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', bmp: 'image',
        svg: 'image', avif: 'image', ico: 'image', tif: 'image', tiff: 'image',
        // 30：.ogg 绝大多数是音频（Vorbis / Opus），归到 video 会让「音频」标签页
        // 一条都看不到、而「视频」里全是音频。真正的 Ogg 视频用 .ogv（单独列出）。
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
                    // 优先用 detectVideoSite 传进来的解析结果（一次检测只解析一次 URL）
                    var u = parsed || new URL(url);
                    var host = u.hostname;
                    return /bilibili\.com$/i.test(host) || /b23\.tv$/i.test(host);
                } catch(e) { return false; }
            },
            isVideo: function(url, parsed) {
                try {
                    // 优先用 detectVideoSite 传进来的解析结果（一次检测只解析一次 URL）
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
                    // 优先用 detectVideoSite 传进来的解析结果（一次检测只解析一次 URL）
                    var u = parsed || new URL(url);
                    return /douyin\.com$/i.test(u.hostname) || /iesdouyin\.com$/i.test(u.hostname);
                } catch(e) { return false; }
            },
            isVideo: function(url, parsed) {
                try {
                    // 优先用 detectVideoSite 传进来的解析结果（一次检测只解析一次 URL）
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
                    // 优先用 detectVideoSite 传进来的解析结果（一次检测只解析一次 URL）
                    var u = parsed || new URL(url);
                    return /kuaishou\.com$/i.test(u.hostname) || /gifshow\.com$/i.test(u.hostname);
                } catch(e) { return false; }
            },
            isVideo: function(url, parsed) {
                try {
                    // 优先用 detectVideoSite 传进来的解析结果（一次检测只解析一次 URL）
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
                    // 优先用 detectVideoSite 传进来的解析结果（一次检测只解析一次 URL）
                    var u = parsed || new URL(url);
                    return /xiaohongshu\.com$/i.test(u.hostname) || /xhslink\.com$/i.test(u.hostname);
                } catch(e) { return false; }
            },
            isVideo: function(url, parsed) {
                try {
                    // 优先用 detectVideoSite 传进来的解析结果（一次检测只解析一次 URL）
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
                    // 优先用 detectVideoSite 传进来的解析结果（一次检测只解析一次 URL）
                    var u = parsed || new URL(url);
                    return /weibo\.com$/i.test(u.hostname) || /weibo\.cn$/i.test(u.hostname);
                } catch(e) { return false; }
            },
            isVideo: function(url, parsed) {
                try {
                    // 优先用 detectVideoSite 传进来的解析结果（一次检测只解析一次 URL）
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
                    // 优先用 detectVideoSite 传进来的解析结果（一次检测只解析一次 URL）
                    var u = parsed || new URL(url);
                    return /zhihu\.com$/i.test(u.hostname);
                } catch(e) { return false; }
            },
            isVideo: function(url, parsed) {
                try {
                    // 优先用 detectVideoSite 传进来的解析结果（一次检测只解析一次 URL）
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
                    // 优先用 detectVideoSite 传进来的解析结果（一次检测只解析一次 URL）
                    var u = parsed || new URL(url);
                    return /channels\.weixin\.qq\.com$/i.test(u.hostname);
                } catch(e) { return false; }
            },
            isVideo: function(url, parsed) {
                try {
                    // 优先用 detectVideoSite 传进来的解析结果（一次检测只解析一次 URL）
                    var u = parsed || new URL(url);
                    return /\/video\//i.test(u.pathname) || /\/feed\//i.test(u.pathname);
                } catch(e) { return false; }
            }
        }
    };

    SEC.detectVideoSite = function(url) {
        if (!url || !U.isStr(url)) return null;
        // 每个站点的 match / isVideo 内部都要 new URL(url) —— 8 个站点 × 2 次
        // = 一次检测最多 16 次 URL 解析（URL 构造在长 URL 上并不便宜，
        // 而卡片列表里每个视频链接都会调一次）。
        // 这里统一解析一次，把 {hostname, pathname} 透传给各站点；
        // 各站点仍优先用传入的解析结果，取不到时自己兜底（保持向后兼容）。
        var parsed = null;
        try {
            var u = new URL(url);
            parsed = { hostname: u.hostname, pathname: u.pathname, href: u.href };
        } catch (e) { return null; }          // 连 URL 都解析不了，必然不是受支持的站点
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

    // ===== AES-128-CBC 解密（用于 HLS 加密 m3u8）=====
    // 使用浏览器原生 Web Crypto API (crypto.subtle)，保证算法正确性并利用硬件加速
    var AES = {};

    // hex -> Uint8Array
    AES.hexToBytes = function (hex) {
        if (!hex || hex.length % 2 !== 0) return null;
        var out = new Uint8Array(hex.length / 2);
        for (var i = 0; i < hex.length; i += 2) {
            out[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return out;
    };

    // 核心：使用 Web Crypto API 进行 AES-128-CBC 解密
    // keyBytes: Uint8Array(16)
    // ivBytes: Uint8Array(16)
    // data: Uint8Array (待解密数据)
    // cb: function(decryptedUint8Array, err)
    AES.decryptCBC = function (data, keyBytes, ivBytes, cb) {
        if (!data || data.length === 0) { cb(null, '空数据'); return; }
        if (!keyBytes || keyBytes.length !== 16) { cb(null, '密钥长度错误: ' + (keyBytes ? keyBytes.length : 'null')); return; }

        // 对齐到 16 字节块
        var padLen = (16 - (data.length % 16)) % 16;
        var alignedData;
        if (padLen > 0) {
            alignedData = new Uint8Array(data.length + padLen);
            alignedData.set(data, 0);
        } else alignedData = new Uint8Array(data);

        var useIv = ivBytes && ivBytes.length === 16 ? ivBytes : new Uint8Array(16);

        // 优先使用 Web Crypto API
        try {
            if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.decrypt === 'function') {
                crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CBC' }, false, ['decrypt']).then(function (key) {
                    return crypto.subtle.decrypt({ name: 'AES-CBC', iv: useIv }, key, alignedData.buffer);
                }).then(function (decrypted) {
                    var out = new Uint8Array(decrypted);
                    // PKCS#7 unpadding
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
                    // Web Crypto 失败，提示但返回原始数据（可能未加密或密钥错误）
                    LOG.warn('Web Crypto AES 解密失败:', err && err.message);
                    cb(null, 'AES 解密失败: ' + (err && err.message ? err.message : err));
                });
                return;
            }
        } catch (e) {
            LOG.warn('Web Crypto 不可用，将尝试纯 JS 降级方案:', e.message);
        }

        // 纯 JS 降级方案（简单实现，仅作兜底）
        try {
            cb(data, 'Web Crypto 不可用，纯 JS 降级未实现');
        } catch (e) {
            cb(null, '解密异常: ' + e.message);
        }
    };

    var M3U8 = {};

    M3U8.parse = function (content, baseUrl) {
        var result = {
            isMaster: false,           // 是否是 master playlist（多码率）
            streams: [],               // master 的子流列表 [{url, bandwidth, resolution}]
            segments: [],              // 分片列表 [{url, duration}]
            encrypted: false,          // 是否加密
            keyMethod: null,           // 加密方法（AES-128）
            keyUrl: null,              // 密钥 URL
            keyIv: null,               // IV（16字节）
            duration: 0,               // 总时长（秒）
            targetDuration: 0,         // 分片最大时长
            mediaSequence: 0,          // EXT-X-MEDIA-SEQUENCE：首个分片的真实序号
        };
        if (!content) return result;
        var lines = content.split(/\r?\n/);
        var currentKey = null;
        var segDuration = 0;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line) continue;

            // #EXT-X-STREAM-INF: 多码率流
            if (line.indexOf('#EXT-X-STREAM-INF:') === 0) {
                result.isMaster = true;
                var info = line.substring('#EXT-X-STREAM-INF:'.length);
                var bandwidth = 0, resolution = '';
                var bwMatch = info.match(/BANDWIDTH=(\d+)/);
                if (bwMatch) bandwidth = parseInt(bwMatch[1], 10);
                var resMatch = info.match(/RESOLUTION=(\d+x\d+)/);
                if (resMatch) resolution = resMatch[1];
                // 紧随其后的「下一个非空且非注释行」才是 URI。
                // 原来只看 i + 1：规范允许两者之间夹空行（合法且常见），
                // 此时 nextLine 是空串 → 整条流被丢弃（表现为「多码率源一条都认不出」）。
                for (var si = i + 1; si < lines.length; si++) {
                    var nextLine = lines[si].trim();
                    if (!nextLine) continue;                    // 跳过空行
                    if (nextLine.charAt(0) === '#') break;      // 撞到标签 = 本 tag 没有 URI
                    result.streams.push({
                        url: SEC.absUrl(nextLine, baseUrl),
                        bandwidth: bandwidth,
                        resolution: resolution,
                        label: bandwidth > 5000000 ? '高清' : bandwidth > 2000000 ? '标清' : '低清'
                    });
                    i = si;                                     // 主循环从 URI 行之后继续
                    break;
                }
            }
            // #EXT-X-MEDIA-SEQUENCE: 首个分片的媒体序号
            // AES-128 在无显式 IV 时用「媒体序号」当 IV（RFC 8216 §5.2），
            // 而它**不一定从 0 开始**（直播回看 / 切片录播常见），必须解析出来。
            else if (line.indexOf('#EXT-X-MEDIA-SEQUENCE:') === 0) {
                var seqVal = parseInt(line.substring('#EXT-X-MEDIA-SEQUENCE:'.length), 10);
                if (!isNaN(seqVal) && seqVal >= 0) result.mediaSequence = seqVal;
            }
            // #EXT-X-KEY: 加密信息
            else if (line.indexOf('#EXT-X-KEY:') === 0) {
                result.encrypted = true;
                var keyInfo = line.substring('#EXT-X-KEY:'.length);
                var methodMatch = keyInfo.match(/METHOD=(\w+)/);
                if (methodMatch) result.keyMethod = methodMatch[1];
                var uriMatch = keyInfo.match(/URI="([^"]+)"/);
                if (uriMatch) result.keyUrl = uriMatch[1];
                var ivMatch = keyInfo.match(/IV=0x([0-9a-fA-F]+)/);
                if (ivMatch) result.keyIv = AES.hexToBytes(ivMatch[1]);
                else result.keyIv = null; // 默认用序号作为 IV
            }
            // #EXT-X-TARGETDURATION: 分片最大时长
            else if (line.indexOf('#EXT-X-TARGETDURATION:') === 0) {
                var tdMatch = line.match(/#EXT-X-TARGETDURATION:(\d+)/);
                if (tdMatch) result.targetDuration = parseInt(tdMatch[1], 10);
            }
            // #EXTINF: 分片时长
            else if (line.indexOf('#EXTINF:') === 0) {
                var durMatch = line.match(/#EXTINF:([\d.]+)/);
                if (durMatch) segDuration = parseFloat(durMatch[1]);
            }
            // 非 # 开头的行：分片 URL 或子 m3u8 URL
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
            // #EXT-X-ENDLIST: 结束标记
            else if (line === '#EXT-X-ENDLIST') {
                // 流结束
            }
        }
        LOG.info('M3U8 解析完成:', result.isMaster ? 'master' : 'media', 
                 result.isMaster ? result.streams.length + ' streams' : result.segments.length + ' segments',
                 result.encrypted ? 'encrypted:' + result.keyMethod : 'unencrypted');
        return result;
    };

    // ===== 统一 HTTP 取数（GM_xmlhttpRequest 优先，失败/超时降级 XHR）=====
    // 原来 fetchKey / fetchSegment / m3u8 拉取各复制了一份"GM + XHR"双路径代码，
    // 且缺少完成标记：GM 超时后 XHR 回包会二次回调。这里统一并加了 done 守卫。
    // 15：在飞请求登记表。
    // 原来 _httpGet 里的 XHR / GM handle 都是局部变量，stopDownload 只能置一个
    // 「已停止」标志 —— 已经发出去的分片请求仍会跑完（几 MB 到几十 MB 的流量白烧，
    // 移动端在弱网下尤其明显），下载也迟迟不退。
    // 现在登记每个在飞请求，stopDownload 时逐个 abort。
    M3U8._inflight = [];
    M3U8._trackInflight = function (handle) {
        if (!handle) return;
        M3U8._inflight.push(handle);
    };
    M3U8._untrackInflight = function (handle) {
        var i = M3U8._inflight.indexOf(handle);
        if (i >= 0) M3U8._inflight.splice(i, 1);
    };
    M3U8._abortInflight = function () {
        var list = M3U8._inflight.slice();
        M3U8._inflight.length = 0;
        for (var i = 0; i < list.length; i++) {
            try { list[i].abort(); } catch (e) {}
        }
    };

    M3U8._httpGet = function (url, opts, cb) {
        var o = opts || {};
        var wantBinary = o.binary === true;
        var timeoutMs = o.timeout || 25000;
        var tag = o.tag || '请求';
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
                M3U8._trackInflight(xhr);
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
            M3U8._trackInflight(gmHandle);
        } catch (ge) {
            LOG.warn('GM ' + tag + '异常，降级 XHR:', ge.message);
            viaXHR();
        }
    };

    // ===== 获取密钥 =====
    M3U8.fetchKey = function (keyUrl, cb) {
        LOG.info('密钥请求 URL:', keyUrl);
        M3U8._httpGet(keyUrl, { binary: true, timeout: 15000, tag: '密钥请求' }, function (err, bytes) {
            if (err) { cb(null, err); return; }
            if (bytes.length !== 16) { cb(null, '密钥长度错误: ' + bytes.length); return; }
            LOG.info('密钥获取成功');
            cb(bytes, null);
        });
    };

    // ===== 下载单个分片 =====
    M3U8.fetchSegment = function (segUrl, cb) {
        M3U8._httpGet(segUrl, { binary: true, timeout: 30000, tag: '分片请求' }, cb);
    };

    // ===== 下载并解密所有分片，合并为完整视频 =====
    M3U8.downloadAndMerge = function (m3u8Url, options, progressCb, doneCb) {
        // options: {quality: 'auto'|'high'|'medium'|'low', concurrency: 3}
        var opts = options || {};
        var concurrency = opts.concurrency || 3;
        var qualityPref = opts.quality || 'auto';
        // 每次下载各持一个运行令牌：并发多个任务时 stopDownload(token) 只停指定那个。
        // opts.runToken 允许调用方自己持有 token（例如外壳想在同一处统一停止）。
        var runToken = opts.runToken || M3U8._newRunToken();

        // 获取 m3u8 内容（优先 GM_xmlhttpRequest 支持跨域）
        try {
            var fetchM3u8 = function(url, onOk, onErr) {
                M3U8._httpGet(url, { timeout: 20000, tag: 'm3u8 请求' }, function (err, text) {
                    if (err) onErr(err); else onOk(text);
                });
            };

            fetchM3u8(m3u8Url, function(m3u8Text) {
                var parsed = M3U8.parse(m3u8Text, m3u8Url);
                if (parsed.isMaster && parsed.streams.length > 0) {
                    var selectedStream = M3U8.selectStream(parsed.streams, qualityPref);
                    LOG.info('选择码率:', selectedStream.label, selectedStream.resolution);
                    // 递归下钻子播放列表：沿用同一个 token（一键停止才能连带停掉）
                    M3U8.downloadAndMerge(selectedStream.url, opts, progressCb, doneCb);
                    return;
                }
                if (parsed.segments.length === 0) { doneCb(null, 'm3u8 无分片'); return; }
                LOG.info('开始下载分片:', parsed.segments.length, '加密:', parsed.encrypted);

                var proceed = function(key) {
                    // 传 runToken（并发隔离）+ mediaSequence（AES-128 无显式 IV 时用它算 IV）
                    M3U8._downloadSegments(parsed.segments, key, parsed.keyIv, concurrency,
                        progressCb, doneCb, runToken, parsed.mediaSequence);
                };
                if (parsed.encrypted && parsed.keyUrl) {
                    M3U8.fetchKey(parsed.keyUrl, function(key, err) {
                        if (err) { doneCb(null, err); return; }
                        proceed(key);
                    });
                } else {
                    proceed(null);
                }
            }, function(err) { doneCb(null, err); });
        } catch (e) { doneCb(null, 'm3u8 异常: ' + e.message); }
    };

    // ===== 选择码率 =====
    M3U8.selectStream = function (streams, preference) {
        if (!streams || streams.length === 0) return null;
        streams.sort(function (a, b) { return b.bandwidth - a.bandwidth; });
        if (preference === 'high' || preference === '高清') return streams[0];
        if (preference === 'low' || preference === '低清') return streams[streams.length - 1];
        if (preference === 'medium' || preference === '标清') return streams[Math.floor(streams.length / 2)];
        return streams[Math.floor(streams.length / 2)];
    };

    // ===== 批量下载分片并合并（支持异步 AES 解密）=====
    // 运行令牌：原来 M3U8._stopped 是**模块级全局标志**，两个任务并发时
    // 「停止」其中一个会把另一个一起停掉（表现为「另一个下了一半就不动了」）。
    // 现在每次下载各持一个 token，stopDownload(token) 可指定停哪一个；
    // 不传参则停全部（保持原有「一键停止」语义）。
    M3U8._activeRuns = [];
    M3U8._newRunToken = function () {
        var token = { stopped: false };
        M3U8._activeRuns.push(token);
        return token;
    };

    M3U8._downloadSegments = function (segments, key, iv, concurrency, progressCb, doneCb, runToken, mediaSequence) {
        var total = segments.length;
        var downloaded = 0;
        var failed = 0;
        var chunks = new Array(total);
        var idx = 0;
        var running = 0;
        // 内存保护：所有分片都驻留在 chunks 里，一部 2GB 的影片就是 2GB 的
        // Uint8Array（且解密路径还会再造一份），移动端必被系统杀掉。
        // 这里设总量阈值，超了就中止并明确告知走「生成下载脚本」用 aria2 之类的
        // 外部下载器 —— 比浏览器里默默 OOM 要好得多。
        var MAX_TOTAL_BYTES = 320 * 1024 * 1024;
        var loadedBytes = 0;
        var abortedForMemory = false;
        // 没传 token 时自建一个，保证单独调用本函数也能被 stopDownload 停掉
        var token = runToken || M3U8._newRunToken();
        // 兼容旧的 M3U8._stopped 读取点（若有外部代码依赖它）
        M3U8._stopped = false;
        // 性能 13：这里原本还分配了一个长度为 total 的「分片完成标记」数组，
        // 全程没有任何读写（真正的完成计数是同函数内的 idx / running / failed），
        // 白白占用内存，已删除。

        function tryFinish() {
            if (idx < total) return;
            if (running > 0) return;
            if (token.stopped) return;
            if (abortedForMemory) {
                // 主动放弃已下载的分片，尽快把内存还给系统
                for (var ai = 0; ai < total; ai++) chunks[ai] = null;
                doneCb(null, '文件过大（超过 ' + Math.round(MAX_TOTAL_BYTES / 1048576)
                    + 'MB），浏览器内下载可能耗尽内存。请改用「生成下载脚本」用 aria2 / curl 下载。');
                return;
            }
            if (failed > 0) { doneCb(null, '下载失败 ' + failed + ' 个分片'); return; }
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
            doneCb(merged, null);
        }

        function makeIv(segIndex) {
            if (iv && iv.length === 16) return iv;
            // 无显式 IV 时，RFC 8216 §5.2 规定用**媒体序号**（Media Sequence Number）
            // 作为 IV —— 即 mediaSequence + 分片下标，而不是分片下标本身。
            // 原来直接用下标近似：源站 media-sequence ≠ 0 时（直播回看 / 切片录播
            // 很常见）每个分片的 IV 都错位 → AES-128 解密全盘失败，
            // 用户看到的是一堆解不开的乱码分片。
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
                // 如果加密，使用异步 AES-128-CBC 解密
                // 累计字节数：超阈值立即停止调度（在途分片下载完就不再开新的）
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
            });
        }

        for (var w = 0; w < concurrency; w++) worker();
    };

    // ===== 停止下载 =====
    // stopDownload(token)：指定 token 则只停那一个任务；不传则停全部。
    // 兼容旧调用（无参）= 一键停止所有在跑的 m3u8 下载。
    M3U8.stopDownload = function (token) {
        M3U8._stopped = true;
        if (token) { token.stopped = true; }
        else {
            for (var i = 0; i < M3U8._activeRuns.length; i++) M3U8._activeRuns[i].stopped = true;
        }
        // 15：把在飞的分片请求真正掐掉（否则它们会继续把流量跑完）
        M3U8._abortInflight();
    };

        // ===== 生成下载脚本（跨域兜底）=====
    M3U8.generateDownloadScript = function (m3u8Url, format) {
        // format: 'curl' | 'wget' | 'aria2'
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
    // =========================================================================
    // ===== 模块 4：状态管理 (State) + 配置校验
    // =========================================================================
    var DEFAULT_CONFIG = {
        theme: 'auto',
        uiStyle: 'normal',         // 界面风格: normal / material / ios27 / neumorph / brutal / terminal
        palette: 'indigo',         // 配色方案: indigo/purple/blue/green/orange/rose 或 custom_xxx
        customPalettes: [],        // 自定义配色: [{id, name, light:{primary,primary2}, dark:{primary,primary2}}]
        uiLang: 'zh-CN',           // 界面语言: zh-CN / en-US / ja-JP / ko-KR
        nameTpl: '{域名}_{日期}_{序号}_{后缀}',
        whitelist: [],
        blacklist: [],
        whitelistMode: false,
        panelWidth: 460,
        panelHeight: 0,     // 0 表示自动（满高）
        panelX: null,       // 面板左侧坐标（桌面端）
        panelY: null,       // 面板顶部坐标（桌面端）
        panelSnapEdge: null, // 面板边缘吸附状态：left/right/top/null
        lastTab: 'img',     // 上次打开的标签页
        panelMinimized: false, // 面板是否处于最小化折叠状态（桌面端）
        btnPos: null,
        translateFrom: 'auto',
        translateTo: 'zh-CN',
        translateEngine: 'mymemory',    // 翻译引擎: mymemory / google / baidu / deepl
        batchConcurrency: 3,
        batchRetry: 2,
        batchDelay: 400,
        askBeforeDownload: true,   // 单个下载前是否询问重命名
        showStatusBar: true,
        logLevel: 1, // INFO
        // 高级筛选阈值
        minImageSize: 1024,
        minImageWidth: 50,
        minImageHeight: 50,
        minVideoDuration: 1,
        maxVideoDuration: 0,
        minAudioDuration: 1,
        // 显示筛选（新增）
        showMinSizeKB: 0,          // 显示最小大小 (KB), 0=不限制
        showMaxSizeKB: 0,          // 显示最大大小 (KB), 0=不限制
        autoExtractThumb: true,    // 自动提取视频封面作为缩略图
        autoPlayPreview: false,    // 视频预览自动播放
        persistSelection: false,   // 关闭面板后保留选择状态
        // 自定义请求头
        customHeaders: {
            Referer: '',
            UserAgent: '',
            Cookie: ''
        },
        // m3u8 设置
        m3u8Quality: 'auto',
        m3u8Concurrency: 3,
        m3u8AutoMerge: true,
        // 多标签页同步
        enableSync: true,
        // 资源历史记录
        enableHistory: true,
        // 自动更新检测
        autoCheckUpdate: true,
        // 设置页分组展开状态（新增）
        settingsExpanded: {},       // { groupId: boolean }
        // 自定义域名规则（新增）
        domainRules: [],            // [{domain: "baidu.com", img: true, video: true, audio: true, depth: 1}]
        // 脚本市场 / 插件系统（新增）
        customRules: [],            // [{id, name, pattern, type: 'host'|'url'|'regex', action: 'allow'|'block', enabled}]
        parserPlugins: [],          // [{id, name, matchPattern, apiUrl, method, headers, dataPath, enabled}]
        plugins: [],                // [{id, name, version, author, category, desc, icon, enabled, installTime, config}]
        // Aria2 RPC 推送设置
        aria2RpcUrl: '',
        aria2RpcSecret: '',
        // 可定制快捷键
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
        translateCache: {},   // 上限见 State._translateCacheLru
        downloading: false,
        downloadProgress: null,  // {total, done, failed, speed, eta}
        downloadHistory: [],     // {url, name, time, success}
        // P1-2: 元信息缓存
        metaCache: {},           // url -> {size, width, height, duration, type}（上限见 State._metaCacheLru）
        streamMap: {},           // streamId -> videoElement（MediaStream 录制用）
        // P2-4: 多标签页同步
        syncChannel: null,
    };

    // 性能 3：翻译结果缓存上限（字符串为主，400 条足够覆盖一页的按钮文案）
    State._translateCacheLru = U.lru(State.translateCache, 400);
    // 元信息缓存（尺寸 / 时长）是几个缓存里唯一漏掉上限的一个 —— SPA 长会话下
    // 每看过一个资源就多一条，只涨不跌。同样走上限管理。
    State._metaCacheLru = U.lru(State.metaCache, 2000);
    // 写元信息的唯一入口：保证每次落笔都会刷新 LRU 顺序并触发上限裁剪。
    // 读路径仍走 State.metaCache[url] 直接下标（零额外开销）。
    State.metaPut = function (url, key, val) {
        if (!url) return;
        if (!State.metaCache[url]) State.metaCache[url] = {};
        State.metaCache[url][key] = val;
        State._metaCacheLru.set(url, State.metaCache[url]);
    };

    // ===== 配置校验 =====
    State.validateConfig = function (cfg) {
        var errors = [];
        if (!cfg) return ['配置为空'];
        // 检查必要字段类型
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
                // 写的是对象（GM_setValue 直接存），但**读取端不能只认对象**：
                // 部分脚本管理器（ScriptCat / 旧版暴力猴 / 手工改过存储）会把
                // 值序列化成 JSON 字符串存回来。原来 `typeof raw === 'object'`
                // 直接不成立 → 整段加载被静默跳过 → 配置回默认值，
                // 用户表现为「设置莫名其妙全没了」。
                if (raw && typeof raw === 'string') {
                    var parsedCfg = U.safeJson(raw, null);
                    if (parsedCfg && typeof parsedCfg === 'object') raw = parsedCfg;
                }
                if (raw && typeof raw === 'object') {
                    // 兼容 v1.0.8 旧配置：'apple'（苹果玻璃）已升级为 iOS 27 液态玻璃
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
        // 设置日志级别
        LOG.setLevel(State.config.logLevel);
        // 计算主题
        State._computeTheme();
        // 初始化多标签页同步
        if (State.config.enableSync) State._initSync();
    };

    // 配置写入防抖：交互过程中 State.save() 会被高频调用，
    // 每次都序列化整份配置并写油猴存储既慢又废 IO，这里合并为 250ms 一次。
    State._saveTimer = null;
    State._flushSave = function () {
        if (State._saveTimer) { clearTimeout(State._saveTimer); State._saveTimer = null; }
        try {
            if (typeof GM_setValue === 'function') GM_setValue('ms_config_v8', State.config);
        } catch (e) { LOG.error('配置保存失败:', e); }
        // 性能 4：广播原先写在 State.save 里，而 save 是防抖入口 —— 调 30 次
        // 就会把整份 config（含自定义配色 / 插件 / 域名规则等数组）结构化克隆
        // 30 次并 postMessage 30 次，其中 29 次的结果会被下一次覆盖，纯属白烧 CPU。
        // 广播语义本来就和落盘一致（「配置定下来了，通知其他标签页」），
        // 因此挪到 _flushSave：真正的「本回合最后一次」才广播，次数与落盘次数 1:1。
        // immediate===true 的路径会直接调 _flushSave，所以关键配置的即时广播不受影响。
        try {
            if (State.syncChannel) State._broadcast({ type: 'config', data: State.config });
        } catch (e) {}
    };
    // immediate=true：关键配置（主题 / 界面语言）立即落盘，其余仍走 250ms 防抖
    State.save = function (immediate) {
        if (State._saveTimer) clearTimeout(State._saveTimer);
        // MINOR-20: App 被系统强杀时 250ms 窗口可能来不及落盘（pagehide 兜底并非 100% 触发）。
        // 主题 / 语言这类「用户刚点完就期待记住」的关键项改为立刻写；其余仍走防抖。
        if (immediate === true) {
            State._flushSave();
            return;
        }
        State._saveTimer = setTimeout(State._flushSave, 250);
    };

    // ===== 资源历史记录 =====
    State._historyKey = '_ms_history';
    State._historyLimit = 200;
    // 真源是 Map（url + kind → 记录），而不是数组。
    // 原来 addHistory 对每条新记录都要线性扫一遍历史（上限 200 条），
    // 批量入库 N 条就是 O(N × 200) —— 一次勾选上百个资源时是明显的主线程开销。
    // Map 的插入顺序天然就是「最近在前」，所以：
    //   · 查重    O(1)
    //   · 提到最近 O(1)（delete + set）
    //   · 裁剪    O(1)（删最早的键）
    State._historyMap = null;
    State._ensureHistory = function () {
        if (State._historyMap) return;
        State._historyMap = new Map();
        try {
            // FIX-12: 兼容 GM_getValue 返回字符串 / 原生数组 / 包装对象三种形态
            var arr = U.gmGetArray(State._historyKey, []);
            // 存储里的数组是「最新在前」，而 Map 需要「最早在前」（这样
            // getHistory() 反向遍历后仍是「最新在前」，与旧行为一致）。
            // 所以从数组末尾往前 set。
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
            // 先删再加 = 挪到「最近」端（Map 保持插入顺序）
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
        // 超限时从最早的开始丢（Map 的 keys() 就是插入顺序）
        while (map.size > State._historyLimit) {
            map.delete(map.keys().next().value);
        }
        State._saveHistory();
    };
    State.getHistory = function () {
        State._ensureHistory();
        // 对外仍返回数组（保持既有调用约定）；顺序 = 最近在前
        var out = [];
        State._historyMap.forEach(function (v) { out.push(v); });
        out.reverse();
        return out;
    };
    State.clearHistory = function () { State._historyMap = new Map(); State._saveHistory(); };

    // FIX-06: 系统主题监听只安装一次。
    // _computeTheme 会被 getTheme() 频繁调用（UI.colors() 每次都调），
    // 原来把 addEventListener 写在里面，每次调用都挂一个新监听 → 监听器无限堆积。
    State._themeWatcherInstalled = false;
    State._installThemeWatcher = function () {
        if (State._themeWatcherInstalled) return;
        State._themeWatcherInstalled = true;
        try {
            if (typeof matchMedia !== 'function') return;
            var m = matchMedia('(prefers-color-scheme: dark)');
            var onChange = function (ev) {
                State._computedTheme = ev.matches ? 'dark' : 'light';
                // FIX-07: applyPanelThemeNow 是 UI IIFE（第 8747 行起）里的局部函数，
                // State 在自己的闭包里访问不到它 —— 原写法 typeof 恒为 'undefined'，
                // 系统主题变化后面板不会刷新。改走 UI 注册到 State 上的钩子。
                if (typeof State._applyTheme === 'function') State._applyTheme();
            };
            if (typeof m.addEventListener === 'function') m.addEventListener('change', onChange);
            else if (typeof m.addListener === 'function') m.addListener(onChange);
        } catch (e) {}
    };

    State._computeTheme = function () {
        var theme = State.config.theme;
        if (theme === 'auto') {
            // 跟随系统：检查 prefers-color-scheme
            try {
                if (typeof matchMedia === 'function') {
                    State._computedTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    State._installThemeWatcher();   // FIX-06: 监听器只装一次（原来每次调用都注册 → 泄漏）
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

    // ===== 多标签页同步（BroadcastChannel）=====
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
                            LOG.info('收到同步资源');
                            State.images = msg.data.images || [];
                            State.videos = msg.data.videos || [];
                            State.audios = msg.data.audios || [];
                            State.m3u8 = msg.data.m3u8 || [];
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
    // =========================================================================
    // ===== 模块 5：网络拦截 (Net Hook) + 防抖聚合
    // =========================================================================
    var NetState = { hits: new Set(), queue: [], flushing: false };
    NetState._flush = function () {
        if (NetState.flushing || NetState.queue.length === 0) return;
        NetState.flushing = true;
        // 性能 11：原来一次最多 200，改成 100 的用意是「小批量、快响应」，
        // 但每次 flush 的固定成本（数组 splice + 循环 + 末尾一次 _renderThrottled
        // 与 _broadcast）与批量大小无关，批量越小固定成本占比越高。
        // 队列经常一次涌入几百条 URL，100 会让 flush 次数翻几倍。
        var batch = NetState.queue.splice(0, Math.min(200, NetState.queue.length));
        for (var i = 0; i < batch.length; i++) {
            var url = batch[i];
            if (!url || NetState.hits.has(url) || !SEC.isSafeUrl(url)) continue;
            NetState.hits.add(url);
            var abs = SEC.absUrl(url);
            var kind = SEC.guessKind(abs);
            if (kind === 'image') State.images.push(abs);
            else if (kind === 'video') State.videos.push(abs);
            else if (kind === 'audio') State.audios.push(abs);
            else if (kind === 'm3u8') State.m3u8.push(abs);
        }
        // 进入本函数前已用 NetState.hits 去重，这里无需再对整份列表做 uniq
        // （原实现对每次 flush 都要重新扫描全部 URL，资源多时是主要开销之一）
        NetState.flushing = false;
        if (State.panel && State.panelOpen && State._renderThrottled) {
            var t = State.tab;
            if (t === 'img' || t === 'video' || t === 'audio' || t === 'm3u8') State._renderThrottled();
        }
        // 同步到其他标签页
        if (State.config.enableSync) State._broadcast({ type: 'resources', data: { images: State.images, videos: State.videos, audios: State.audios, m3u8: State.m3u8 } });
    };
    NetState._scheduleFlush = U.throttle(NetState._flush, 500);
    NetState.collect = function (url) {
        if (!url || !U.isStr(url) || url.length < 6) return;
        NetState.queue.push(url.trim());
        NetState._scheduleFlush();
    };

    function installNetHook() {
        // 幂等：SPA 会多次触发 State.init，重复安装会让 fetch/XHR 包装层不断叠加
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
    // =========================================================================
    // ===== 模块 6：Toast + 状态条
    // =========================================================================
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

    // 颜色 -> rgba(...)：提示条在 iOS 27 下要半透明，所以把调用方给的颜色降成低透明度。
    // 支持 #rgb / #rrggbb / rgb() / rgba()，其它形式原样返回（退化为不透明）。
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

    // 提示条：从屏幕上方滑入 → 停留 2.5 秒 → 向上滑出淡出。
    // iOS 27 风格下改用液态玻璃材质（半透明染色 + 背景模糊 + 镜面边缘），
    // 其余风格保持原来的不透明纯色，避免影响 normal / material。
    var TOAST_DUR = 2500;
    function toast(msg, color, dur, onClick) {
        try {
            var clickable = typeof onClick === 'function';
            var base = color || MS_CONFIG.COLORS.success;
            var glass = false, dark = false;
            try {
                // 只有 ios27 走玻璃态轻提示；新拟物 / 粗野主义 / 终端 走普通分支，
                // 再由各风格的 CSS 换形状（见 UI._build*Css 里的 ._ms_toast 规则）。
                glass = !!(typeof State !== 'undefined' && State && State.config && State.config.uiStyle === 'ios27');
                // dark 用「有效明暗」：终端复古强制暗底，玻璃态以外的分支也拿它算遮罩深度
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
            var HIDDEN = 'translateX(-50%) translateY(calc(-100% - 72px))';   // 屏幕上方（任何高度都完全出界）
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
                t.style.transform = HIDDEN;      // 向上滑出
                setTimeout(function () { try { t.remove(); } catch (e) {} }, reduce ? 60 : 470);
            }

            if (reduce) {
                play();
            } else {
                // 先让起始状态渲染出来，再切到目标状态，过渡才会发生；
                // setTimeout 兜底：标签页在后台时 rAF 不触发。
                try { requestAnimationFrame(function () { requestAnimationFrame(play); }); } catch (e2) {}
                setTimeout(play, 90);
            }
            setTimeout(hide, dur || TOAST_DUR);
        } catch (e) {}
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
    // =========================================================================
    // ===== 模块 6b：视频平台地址解析 (Video Resolver)
    // =========================================================================
    var VideoResolver = {};
    VideoResolver._cache = {};
    // 性能 3：解析结果对象较重（含分 P / 清晰度列表），上限 60
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

    // 补齐解析结果的标题 / 封面（原本在 5 个平台分支里各复制了一遍同样的正则）
    VideoResolver.fillFromHtml = function (result, html) {
        var t = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (t) result.title = t[1].trim();
        var cov = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        if (cov) result.cover = cov[1];
        return result;
    };

    VideoResolver.resolve = function(url, cb, options) {
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
        // 统一收口：原来 handleAttemptError 的重试链与「总超时」定时器是两条独立路径，
        // 两边都可能调用 cb —— 用户在弹窗里看到的是「先报错、再突然又出结果」，
        // 而调用方拿着同一个 cb 做了两次收尾（重复弹 toast / 重复写入）。
        // 这里用一个 settled 标志把**所有** cb 出口收成一处。
        // （原 timedOut 变量只被赋值、从未被读取，是纯死变量，一并去掉。）
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
            if (settled) return;              // 已收口（例如总超时先到）就不再排重试
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
            // P1-6：原来 backupApi 与 primaryApi 是同一串地址
            // （都是 /x/web-interface/view?）—— 主接口失败后所谓「重试」等于原地重试，
            // 白等一个 RTT，没有任何退路。这里改成真正的重试链：
            //   level 0: /x/web-interface/view         —— 标准接口，字段最全
            //   level 1: /x/web-interface/view/detail  —— 备用接口，返回体是另一套结构
            //                                            （data.View 包裹），按 detail 解析
            // 注：不采用 /x/web-interface/wbi/view —— 那个接口强制 WBI 签名
            // （需要 w_rid + wts），未签名请求会直接返回 -403，做备用接口毫无意义。
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
                // 沿重试链前进一步；链尾则回错误。原来这段「下一级」逻辑在
                // onload / catch / onerror / ontimeout 四处各抄了一遍（共 5 份），
                // 一旦链上的地址改了就得同步改 5 处，极易漏。
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
                                    } catch(e) {}
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

    VideoResolver._resolveXiaohongshu = function(pageUrl, cb, attempt) {
        attempt = attempt || 0;
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: pageUrl,
                    headers: {
                        'Referer': 'https://www.xiaohongshu.com/',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
                    },
                    onload: function(resp) {
                        try {
                            var html = resp.responseText || resp.response || '';
                            var result = {
                                title: '',
                                cover: '',
                                videoUrl: '',
                                duration: 0,
                                author: '',
                                siteIcon: MS_CONFIG.ICONS.book,
                                siteName: '小红书'
                            };
VideoResolver.fillFromHtml(result, html);
                            result.error = '暂不支持解析';
                            cb(result, null);
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

    VideoResolver._resolveWeibo = function(pageUrl, cb, attempt) {
        attempt = attempt || 0;
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: pageUrl,
                    headers: {
                        'Referer': 'https://weibo.com/',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
                    },
                    onload: function(resp) {
                        try {
                            var html = resp.responseText || resp.response || '';
                            var result = {
                                title: '',
                                cover: '',
                                videoUrl: '',
                                duration: 0,
                                author: '',
                                siteIcon: MS_CONFIG.ICONS.globe,
                                siteName: '微博'
                            };
VideoResolver.fillFromHtml(result, html);
                            result.error = '暂不支持解析';
                            cb(result, null);
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

    VideoResolver._resolveZhihu = function(pageUrl, cb, attempt) {
        attempt = attempt || 0;
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: pageUrl,
                    headers: {
                        'Referer': 'https://www.zhihu.com/',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
                    },
                    onload: function(resp) {
                        try {
                            var html = resp.responseText || resp.response || '';
                            var result = {
                                title: '',
                                cover: '',
                                videoUrl: '',
                                duration: 0,
                                author: '',
                                siteIcon: MS_CONFIG.ICONS.bulb,
                                siteName: '知乎'
                            };
VideoResolver.fillFromHtml(result, html);
                            result.error = '暂不支持解析';
                            cb(result, null);
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

    VideoResolver._resolveWeixin = function(pageUrl, cb, attempt) {
        attempt = attempt || 0;
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: pageUrl,
                    headers: {
                        'Referer': 'https://channels.weixin.qq.com/',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
                    },
                    onload: function(resp) {
                        try {
                            var html = resp.responseText || resp.response || '';
                            var result = {
                                title: '',
                                cover: '',
                                videoUrl: '',
                                duration: 0,
                                author: '',
                                siteIcon: MS_CONFIG.ICONS.speech,
                                siteName: '微信视频号'
                            };
VideoResolver.fillFromHtml(result, html);
                            result.error = '暂不支持解析';
                            cb(result, null);
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

    VideoResolver._fetchPlayUrl = function(opts) {
        var bvid = opts.bvid;
        var aid = opts.aid;
        var cid = opts.cid;
        var qn = opts.qn || 64;
        var result = opts.result;
        var cb = opts.cb;
        // FIX-10：调用方可能传一个空对象进来（switchQuality 就是 result = {}），
        // 而下面会读 result.qualityDescriptions[v.id] —— undefined 取下标直接 TypeError。
        // 这里统一兜底成空表：清晰度名会退回 "1080P" 这类按高度生成的兜底文案。
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
        qualityDescriptions = qualityDescriptions || {};   // FIX-10：兜底，避免调用方漏传时取下标报错
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

    // MINOR-28: 多 P 切换此前只有 UI 侧的空壳 switchPage（只弹了个 toast），
    // 解析结果里的 data.pages（B 站每个分 P 的 cid/part）完全没用上。
    // 这里补上真正的实现：拿目标 P 的 cid 重新走一遍 playurl，再回灌到 data 上。
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
                    // 只记录分P信息，不覆盖 data.title（标题参与下载文件名，改了会串台）
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
    // =========================================================================
    // ===== 模块 6c+：脚本市场 / 插件系统 (Plugins)
    // =========================================================================
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
            // Bug C 修复：注释里推荐的「严格白名单用 block:'*'」原先根本不生效——
            // type:'regex' 时 new RegExp('*') 直接抛 SyntaxError 被 catch 吞掉，
            // type:'host' 又要求主机名真的叫 '*'。这里对 '*' 做 always-match 特判，
            // 让文档写法和实际行为对得上。
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

    // MINOR-24: 规则语义统一。
    // 原实现是「只要存在任意一条 allow 规则，就整体切换成白名单模式」——
    // 用户想「额外放行某个站点」而加一条 allow，结果其它所有站点全被拦下，非常反直觉。
    // 现在改为：
    //   命中 block 且没有命中 allow  → 拦
    //   命中 allow                   → 放行（allow 用来覆盖 block）
    //   都没命中                     → 放行（不再因为存在 allow 规则而误拦）
    // 需要严格白名单的用户：加一条 block + pattern:'*'（全匹配），再给要放行的站点加 allow。
    // pattern:'*' 已在 _ruleMatch 里特判为 always-match（见 Bug C 修复）。
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

    Plugins._callParserApi = function (plugin, pageUrl, cb) {
        try {
            var apiUrl = plugin.apiUrl.replace(/\{url\}/g, encodeURIComponent(pageUrl));
            var method = (plugin.method || 'GET').toUpperCase();
            var headers = plugin.headers || {};
            var req = {
                method: method,
                url: apiUrl,
                headers: headers,
                timeout: 15000,
                onload: function (res) {
                    try {
                        var data = U.safeJson(res.responseText, null);
                        if (!data) { cb(null, '插件返回非 JSON 数据'); return; }
                        var src = Plugins._getByPath(data, plugin.dataPath);
                        if (src === undefined) src = data;
                        var videos = src.videos || src.video || src.data || [];
                        if (!Array.isArray(videos)) videos = [videos];
                        var videoUrls = [], qualityList = [];
                        for (var i = 0; i < videos.length; i++) {
                            var v = videos[i];
                            var vurl = (typeof v === 'string' ? v : (v.url || v.link || v.src));
                            if (!vurl) continue;
                            videoUrls.push(vurl);
                            qualityList.push({ url: vurl, quality: v.quality || v.name || ('清晰度 ' + (i + 1)), type: 'video' });
                        }
                        if (!videoUrls.length && src.url) {
                            videoUrls.push(src.url);
                            qualityList.push({ url: src.url, quality: '默认', type: 'video' });
                        }
                        var out = {
                            title: src.title || src.name || '',
                            cover: src.cover || src.thumb || src.pic || '',
                            videoUrl: videoUrls[0] || '',
                            videoUrls: videoUrls,
                            qualityList: qualityList,
                            siteName: plugin.name,
                            siteIcon: MS_CONFIG.ICONS.plug,
                            duration: src.duration || 0,
                            author: src.author || src.uploader || ''
                        };
                        cb(out, null);
                    } catch (e) {
                        cb(null, '插件数据解析失败: ' + e.message);
                    }
                },
                onerror: function () { cb(null, '插件 API 请求失败'); },
                ontimeout: function () { cb(null, '插件 API 请求超时'); }
            };
            if (method === 'POST') req.data = '';
            GM_xmlhttpRequest(req);
        } catch (e) {
            cb(null, '插件调用异常: ' + e.message);
        }
    };

    Plugins.tryCustomParser = function (url, cb) {
        var plugins = Plugins.listParsers();
        for (var i = 0; i < plugins.length; i++) {
            var p = plugins[i];
            if (!p.enabled || !p.matchPattern || !p.apiUrl) continue;
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
    // =========================================================================
    // ===== 模块 6d：自动更新器 (AutoUpdater)
    // =========================================================================
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
            // P2-11：纯数字 tag（如 tag_name 只写成 "2"）用 parseInt(parts[1]) 会得到 NaN，
            // 原来靠 `|| 0` 侥幸兜住，可读性差且对 "2b" / "1.x" 这类段的行为不稳定。
            // 这里显式取每段开头的数字，非数字段稳定归 0。
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
            // N3: GM_getValue 的类型取决于写入时存了什么。手工改过存储、或旧版本
            // 存的是原生对象时 JSON.parse(对象) 会抛错 → 缓存失效 → 每次启动都重查 GitHub。
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
                // FIX-11：'mediaSniffer' 这个键在 LANG 表里不存在，LANG.get 对缺失键是原样返回，
                // 界面上会直接显示出那个键名（英文驼峰），与面板标题两套样式。改用已有的 'appTitle'。
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

            // 「一键更新」指向固定文件名地址（MS_CONFIG.UPDATE_URL），
            // 而不是 info.htmlUrl —— releases/download/<tag>/media-sniffer-<tag>.user.js
            // 每升一版文件名都变，脚本管理器据此判定为「另一个脚本」，
            // 于是越更新条目越多。固定名地址装上去永远是原地覆盖。
            var dlBtn = document.createElement('button');
            dlBtn.textContent = '一键更新';
            dlBtn.style.cssText = 'flex:1;padding:12px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:14px;font-weight:600;cursor:pointer;';
            dlBtn.onclick = function () {
                try {
                    // 直接用 window.open 打开 .user.js 时，浏览器常常按**纯文本**显示
                    // 那个文件（而不是交给脚本管理器安装），用户看到一屏代码会以为
                    // 「更新失败」。优先用 GM_download 让油猴接管下载，
                    // 拿不到时再退回新标签页（并提示需要点「安装」）。
                    var ok = false;
                    if (typeof GM_download === 'function') {
                        try {
                            GM_download({ url: MS_CONFIG.UPDATE_URL, name: 'media-sniffer.user.js' });
                            ok = true;
                        } catch (eDl) { ok = false; }
                    }
                    if (!ok) {
                        window.open(MS_CONFIG.UPDATE_URL, '_blank');
                        try { toast(LANG.t('updateManualHint') || '已打开脚本地址：浏览器若显示源码，请复制全文到脚本管理器新建安装', '#f59e0b'); } catch (eT) {}
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

            // 次要入口：想看完整更新日志 / 手动挑其它资源时，再去 Release 页
            var relLink = document.createElement('a');
            relLink.href = info.htmlUrl || 'https://github.com/zhjich123/zhjich123/releases';
            relLink.target = '_blank';
            relLink.rel = 'noopener noreferrer';
            relLink.textContent = '查看 Release 页面';
            relLink.style.cssText = 'display:block;text-align:center;margin-top:10px;font-size:12px;color:' + c.sub + ';text-decoration:underline;opacity:.85;';
            body.appendChild(relLink);

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

    // 多入口（面板 / 初始化重试）会在同一时间段重复触发检查，
    // 缓存又只在下发请求后写入，这里加一层在途合并，避免并发打同一个 API。
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
    // =========================================================================
    // ===== 模块 6c：视频链接预览 (Video Link Preview)
    // =========================================================================
    var VideoLinkPreview = {};
    VideoLinkPreview._cache = {};

    // 核心方法1：解析视频链接，返回元数据
    VideoLinkPreview.resolve = function(url, cb) {
        if (cb) {
            VideoResolver.resolve(url, function(data, err) {
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

    // 核心方法2：一键预览（解析成功后自动弹出预览窗口）
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

    // 显示预览弹窗
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
                // label 可能来自远端播放列表（清晰度名），必须转义
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
                // ownerFace 来自页面 og:image / 接口返回，含引号会截断 src 属性
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

        // MINOR-28: 分 P 选择器（仅当解析出多个分 P 时出现）
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
            // resolveError 是解析失败的原始信息（含远端返回的文本），必须转义
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

                // 标题区域
                '<div style="margin-bottom:12px;">' +
                    '<h2 style="margin:0 0 8px;font-size:' + (isMobile ? '16px' : '18px') + ';color:' + c.txt + ';line-height:1.4;">' + SEC.escapeHtml(title) + '</h2>' +
                    buildStatsHtml() +
                '</div>' +

                // 视频播放器区域
                '<div id="_ms_vlp_player" style="background:#000;border-radius:12px;overflow:hidden;margin-bottom:12px;position:relative;touch-action:manipulation;">' +
                    (cover ? '<img id="_ms_vlp_cover" src="' + SEC.escapeAttr(cover) + '" style="width:100%;display:block;max-height:360px;object-fit:contain;">' : '') +
                    '<div id="_ms_vlp_loading" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:14px;">加载中...</div>' +
                    '<div id="_ms_vlp_video_error" style="display:none;position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);flex-direction:column;align-items:center;justify-content:center;color:#fff;padding:20px;text-align:center;">' +
                        '<div style="font-size:32px;margin-bottom:8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>' +
                        '<div id="_ms_vlp_error_msg" style="font-size:13px;margin-bottom:12px;">视频加载失败</div>' +
                        '<button id="_ms_vlp_video_retry" style="padding:6px 16px;border:none;border-radius:6px;background:#ef4444;color:#fff;font-size:12px;cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg> 重试</button>' +
                    '</div>' +
                '</div>' +

                // 分P选择（MINOR-28）
                buildPageSelectorHtml() +

                // 画质选择
                buildQualitySelectorHtml() +

                // 视频信息
                buildVideoInfoHtml() +

                // UP主信息
                buildUploaderHtml() +

                // 操作按钮
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
                    '<button id="_ms_vlp_dl" style="flex:1;min-width:120px;padding:12px 20px;border:none;border-radius:10px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-size:14px;font-weight:600;cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> 下载视频</button>' +
                    '<button id="_ms_vlp_copy" style="flex:1;min-width:120px;padding:12px 20px;border:none;border-radius:10px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;font-size:14px;font-weight:600;cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> 复制链接</button>' +
                '</div>') +

                // 链接显示
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

        // 关闭按钮
        document.getElementById('_ms_vlp_close').onclick = function() {
            closeModal();
        };
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeModal();
        });

        function closeModal() {
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

        // 显示视频加载错误
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

        // 创建播放器
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

        // 切换画质
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
                // 原来读了 currentTime 却从未回写 —— 换个画质就把进度清零，
                // 用户得从头拖回去。这里在元数据就绪后把进度恢复（并继续播放）。
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
                // 兜底：某些容器 loadedmetadata 不会再来（例如直接命中缓存失败），
                // 2 秒后无论如何都尝试恢复一次
                setTimeout(function () {
                    try { vid.removeEventListener('loadedmetadata', onMeta); } catch (eR) {}
                    try {
                        if (wasPlaying && vid.paused) vid.play().catch(function () {});
                    } catch (eP) {}
                }, 2000);
            }
        }

        // 画质选择器事件
        var qualitySel = document.getElementById('_ms_vlp_quality');
        if (qualitySel) {
            qualitySel.addEventListener('change', function() {
                var idx = parseInt(qualitySel.value, 10);
                switchQuality(idx);
            });
        }

        // 分P选择器事件（MINOR-28）
        var pageSelEl = document.getElementById('_ms_vlp_page');
        if (pageSelEl) {
            pageSelEl.addEventListener('change', function() {
                var idx = parseInt(pageSelEl.value, 10);
                if (isNaN(idx)) return;
                switchPage(idx);
            });
        }

        // 视频重试按钮
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

        // 解析失败重试按钮
        var retryBtn = document.getElementById('_ms_vlp_retry');
        if (retryBtn && originalUrl) {
            retryBtn.addEventListener('click', function() {
                delete VideoLinkPreview._cache[originalUrl];
                overlay.remove();
                VideoLinkPreview.preview(originalUrl);
            });
        }

        // 播放按钮
        document.getElementById('_ms_vlp_play').onclick = function() {
            var vid = createPlayer();
            if (vid) {
                vid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(function() { vid.play().catch(function(){}); }, 100);
            }
        };

        // 下载按钮
        document.getElementById('_ms_vlp_dl').onclick = function() {
            if (!currentVideoUrl) {
                toast('视频地址不可用', '#f59e0b');
                return;
            }
            var name = title.replace(/[\\\/:\*\?"<>\|]/g, '_').substring(0, 100) + '.mp4';
            Dl.one(currentVideoUrl, name, State.config.batchRetry, State.config.customHeaders);
            toast('开始下载: ' + title.substring(0, 30), '#10b981');
        };

        // 复制链接按钮
        document.getElementById('_ms_vlp_copy').onclick = function() {
            var text = currentVideoUrl || '';
            if (!text) {
                toast('视频地址不可用', '#f59e0b');
                return;
            }
            copyText(text);
        };

        // 自动播放开关
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

        // ========== 触摸手势支持（仅移动端） ==========
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

            // 非 B 站 / 无 cid：无法换流，明确告知而不是假装成功（MINOR-28）
            if (!page.cid) {
                toast('该分P无法直接切换播放', '#f59e0b');
                if (pageSel) pageSel.value = String(prevIndex);
                return;
            }
            if (pageSel) pageSel.disabled = true;
            toast('切换到 P' + (index + 1) + (page.part ? ': ' + page.part : ''), '#6366f1');

            VideoResolver.switchPage(data, index, function(newData, err) {
                if (pageSel) pageSel.disabled = false;
                if (err || !newData) {
                    toast('切换分P失败: ' + (err || '未知错误'), '#ef4444');
                    if (pageSel) pageSel.value = String(prevIndex);
                    return;
                }
                currentPageIndex = index;
                // 回灌本地缓存（qualityList / videoQualities 是闭包副本，不刷新会串台）
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
    // =========================================================================
    // ===== 模块 7：元信息提取 (Meta Fetcher - P1-2)
    // =========================================================================
    var Meta = {};
    // 获取文件大小（通过 HEAD 请求 Content-Length）
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
        // FIX-09：原来只用裸 XMLHttpRequest 发 HEAD，跨域资源会因为 CORS 直接失败
        // （拿不到 Content-Length），而这类资源恰恰是最需要看体积的。
        // 改为 GM_xmlhttpRequest 优先（不受同源限制），失败再降级回 XHR。
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

    // 获取图片尺寸（通过加载图片）
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

    // 获取视频时长（通过加载 video 元素）
    // 批量筛选（Meta.batchFetch，并发 5）会把这里排成几十上百个请求。
    // 每个都要新建 <video> 并让浏览器去探元数据 —— 同时开太多会明显拖慢主进程，
    // 移动端还会因为原生解码器数量限制而大面积失败。
    // 这里加一个很小的串行队列：同时最多 2 个在探，其余排队等。
    // （说明：浏览器探 metadata 本身就是发 Range 请求取头部，无法再省流量；
    //   真正的问题是并发数，这里就是从并发下手。）
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
        // 同一个 url 正在探时直接复用结果，不重复入队
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

    // 获取音频时长
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

    // 批量获取元信息（用于筛选）
    Meta.batchFetch = function (urls, kind, progressCb, doneCb) {
        var total = urls.length;
        var done = 0;
        var results = {};
        var concurrency = 5;
        // 空输入直接返回：原来 total === 0 时，5 个 worker 全都命中
        // `idx >= total` 且 `done >= total`（0 >= 0 恒真）→ doneCb 被连调 5 次，
        // 调用方（批量筛选）会重复收尾 5 遍：弹 5 条 toast、写 5 次状态。
        if (total === 0) { if (doneCb) doneCb(results); return; }
        // 收口：即使将来出现其它「提前终止」分支，也保证只回调一次
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

    // 高级筛选（P1-3）
    // 32：这里原本还有一个 Meta.filterResources（按尺寸/时长过滤 URL 列表）。
    // 全篇搜不到任何调用方 —— 实际筛选逻辑在 UI.renderMedia 里内联实现，
    // 那份副本既不会被调用，也会在配置字段变动时「看着像是生效了」误导后续维护。
    // 已删除，保留这条说明便于对照历史。

        return Meta;
    })();
    var TranslateEngine = (function () {
        'use strict';
    // =========================================================================
    //  模块 8：翻译引擎 (TranslateEngine) - 多引擎架构
    // =========================================================================
    var TranslateEngine = {};

    // ===== 引擎注册表 =====
    TranslateEngine._engines = {};
    TranslateEngine._current = 'mymemory';

    // ===== 语言映射 =====
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

    // ===== 注册引擎 =====
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

    // ===== 获取可用引擎列表 =====
    TranslateEngine.list = function () {
        var list = [];
        for (var key in TranslateEngine._engines) {
            if (TranslateEngine._engines.hasOwnProperty(key)) {
                list.push(TranslateEngine._engines[key]);
            }
        }
        return list;
    };

    // ===== 获取当前引擎 =====
    TranslateEngine.current = function () {
        var key = State.config.translateEngine || TranslateEngine._current;
        return TranslateEngine._engines[key] || TranslateEngine._engines['mymemory'];
    };

    // ===== 切换引擎 =====
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

    // ===== 核心翻译方法 =====
    TranslateEngine.translate = function (text, fromLang, toLang, cb, engineKey) {
        if (!text || !text.trim()) { if (cb) cb('', null); return; }

        var engine = TranslateEngine._engines[engineKey] || TranslateEngine.current();
        var f = TranslateEngine.LANG_MAP[fromLang || State.config.translateFrom] || 'auto';
        var t = TranslateEngine.LANG_MAP[toLang || State.config.translateTo] || 'zh-CN';

        // 缓存检查
        // 缓存键原来只取文本前 100 个字符：只要两段文本前 100 字相同（长文里
        // 极常见 —— 同一篇文章的不同段落、带相同前缀的标题），就会互相命中，
        // 用户拿到的是**另一段文本的译文**。这里补上长度 + 一个轻量哈希，
        // 让不同的长文本几乎不可能撞键。
        var cacheKey = engine.key + '|' + f + '|' + t + '|' + text.length + '|' + U.hashStr(text);
        if (State.translateCache[cacheKey]) {
            LOG.debug('翻译缓存命中:', cacheKey);
            if (cb) cb(State.translateCache[cacheKey], null);
            return;
        }

        // 检查文本长度
        if (text.length > engine.maxChars) {
            LOG.warn('文本超出引擎限制:', text.length, '>', engine.maxChars);
            // 分段翻译
            TranslateEngine._translateChunks(engine, text, f, t, cb, cacheKey);
            return;
        }

        // 调用引擎翻译
        LOG.debug('调用引擎翻译:', engine.key, f, '->', t);
        engine.translate(text, f, t, function (result, err) {
            if (err) {
                LOG.warn('引擎翻译失败:', engine.key, err);
                // 尝试降级到备用引擎
                TranslateEngine._fallback(text, f, t, cb, engine.key, cacheKey);
            } else {
                // 检测原文返回：如果结果与原文完全相同，视为翻译失败
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

    // ===== 分段翻译 =====
    TranslateEngine._translateChunks = function (engine, text, from, to, cb, baseCacheKey) {
        var maxChunk = engine.maxChars - 50; // 留出安全余量
        // 用「捕获组」切分，分隔符会一并留在数组的奇数位上 —— 这样拼回去能恢复原标点。
        // 原来 split 不带捕获组，句号/感叹号/换行全被吃掉，最后只能用 '\n' 硬拼，
        // 结果译文要么黏成一片、要么每句都被换行割裂。
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
                        // 检测到原文返回，视为失败
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
                            // 各段自带其原有的标点 / 换行，直接相接即可（不再用 '\n' 硬拼）
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

    // ===== 降级备用引擎 =====
    // FIX-05: 用「已尝试集合」代替「只排除当前失败引擎」。
    // 原来只排除 failedKey：A 失败→试 B，B 失败→此时 A 又回到候选，于是 A、B 来回
    // 无限互相降级（异步递归，永不回调），表现为翻译一直转圈、请求停不下来。
    TranslateEngine._fallback = function (text, from, to, cb, failedKey, cacheKey, tried) {
        tried = tried || {};
        if (failedKey) tried[failedKey] = true;
        var engines = TranslateEngine.list();
        var fallbackEngines = [];

        // 优先选择不需要 API key 的引擎
        for (var i = 0; i < engines.length; i++) {
            var eng = engines[i];
            if (tried[eng.key]) continue;
            if (!eng.needKey || eng.apiKey) {
                fallbackEngines.push(eng);
            }
        }

        // 如果没有合适的引擎，回退到所有未尝试过的引擎
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
                // 继续尝试下一个
                TranslateEngine._fallback(text, from, to, cb, nextEngine.key, cacheKey, tried);
            } else {
                // 检测原文返回
                if (result && result.trim() === text.trim() && from !== 'auto') {
                    TranslateEngine._fallback(text, from, to, cb, nextEngine.key, cacheKey, tried);
                } else {
                    State._translateCacheLru.set(cacheKey, result);
                    if (cb) cb(result, null);
                }
            }
        });
    };

    // ===== 自动检测翻译 =====
    TranslateEngine.autoTranslate = function (text, cb) {
        var hasChinese = /[\u4e00-\u9fa5]/.test(text || '');
        var from = hasChinese ? 'zh-CN' : 'en';
        var to = hasChinese ? 'en' : 'zh-CN';
        TranslateEngine.translate(text, from, to, cb);
    };

    // ===== 发音（TTS） =====
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

    // =========================================================================
    // 注册翻译引擎
    // =========================================================================

    // ===== MyMemory 引擎（免费，国内可用）=====
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
                // MyMemory 可能在 responseStatus 中返回非 200 错误码
                if (data && data.responseStatus && (data.responseStatus < 200 || data.responseStatus >= 300)) {
                    var errMsg = data.responseDetails || ('MyMemory HTTP ' + data.responseStatus);
                    if (cb) cb(null, errMsg);
                    return;
                }
                var result = '';
                // 优先使用 matches 中质量最高的翻译
                if (data && data.matches && data.matches.length > 0) {
                    var bestMatch = null;
                    for (var i = 0; i < data.matches.length; i++) {
                        var m = data.matches[i];
                        // 跳过质量为 0 或未识别的匹配
                        if (!m.translation || m.quality === 0) continue;
                        if (!bestMatch || m.quality > bestMatch.quality) {
                            bestMatch = m;
                        }
                    }
                    if (bestMatch && bestMatch.translation) {
                        result = bestMatch.translation;
                    }
                }
                // 如果没有高质量匹配，使用 responseData
                if (!result && data && data.responseData && data.responseData.translatedText) {
                    result = data.responseData.translatedText;
                }
                if (!result) { if (cb) cb(null, LANG.t('transFail')); return; }
                // 识别 MyMemory 免费额度警告并作为错误返回
                if (/MYMEMORY WARNING|INVALID LANGUAGE PAIR|NO QUERY SPECIFIED/i.test(result)) {
                    if (cb) cb(null, result);
                    return;
                }
                // 检测原文返回：结果与输入相同视为翻译失败
                if (result.trim() === text.trim() && from !== 'auto') {
                    if (cb) cb(null, 'MyMemory returned original text');
                    return;
                }
                if (cb) cb(result, null);
            });
        }
    });

    // ===== Google 翻译引擎（需代理）=====
    TranslateEngine.register('google', {
        name: 'Google',
        label: 'Google 翻译',
        icon: MS_CONFIG.ICONS.diamond,
        maxChars: 5000,
        supportedLangs: ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'pt', 'it', 'ar', 'th', 'vi'],
        translate: function (text, from, to, cb) {
            var sl = from === 'auto' ? 'auto' : from;
            var tl = to;
            // 使用 Google Translate API（需要代理访问）
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

    // ===== Bing/Microsoft 翻译引擎 =====
    TranslateEngine.register('bing', {
        name: 'Bing',
        label: 'Bing 翻译',
        icon: MS_CONFIG.ICONS.square,
        maxChars: 5000,
        supportedLangs: ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'pt', 'it'],
        translate: function (text, from, to, cb) {
            var sl = from === 'auto' ? 'auto-detect' : from;
            var tl = to;
            // 使用 Bing Translate API
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

    // ===== 百度翻译引擎（需 API Key）=====
    TranslateEngine.register('baidu', {
        name: 'Baidu',
        label: '百度翻译',
        icon: MS_CONFIG.ICONS.circle,
        maxChars: 6000,
        needKey: true,
        supportedLangs: ['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'pt', 'it', 'ar', 'th', 'vi'],
        translate: function (text, from, to, cb) {
            // 百度翻译需要 API Key，这里提供框架，用户可自行配置
            if (!TranslateEngine._engines.baidu.apiKey) {
                if (cb) cb(null, LANG.t('transNeedKey'));
                return;
            }
            var appid = TranslateEngine._engines.baidu.apiKey;
            var salt = Date.now();
            var sign = ''; // 需要计算签名
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

    // ===== DeepL 翻译引擎（需 API Key）=====
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
            // DeepL API 调用
            if (cb) cb(null, 'DeepL 需要 API Key');
        }
    });

    // ===== 辅助方法：XHR GET =====
    TranslateEngine._xhrGet = function (url, timeout, cb) {
        try {
            // 优先使用 GM_xmlhttpRequest 绕过浏览器 CORS 限制
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
            // 兜底：标准 XHR（在同域或目标接口允许 CORS 时可用）
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

    // ===== 辅助方法：XHR POST =====
    TranslateEngine._xhrPost = function (url, body, timeout, cb) {
        try {
            // 优先使用 GM_xmlhttpRequest 绕过浏览器 CORS 限制
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
            // 兜底：标准 XHR
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

    // ===== 兼容旧接口 =====
    var Translator = TranslateEngine;

        return TranslateEngine;
    })();
    var Scanner = (function () {
        'use strict';
    // =========================================================================
    // ===== 模块 9：DOM 扫描器 (Scanner) + requestIdleCallback 分批处理
    // =========================================================================
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
                    // MediaStream / Blob 对象：记录元素本身，后续可通过 UI 下载
                    el.setAttribute('data-ms-srcobject', '1');
                    // WARN-12: 对 <video>/<audio> 来说 srcObject 几乎只会是 MediaStream，
                    // 这个 Blob 分支实际是给 <img>/<canvas> 之类也设置了 srcObject 的场景兜底。
                    // 保留（成本仅一次 instanceof），但加注说明，避免后人误判为死代码删掉。
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
            // 1. 当前页 video / source 标签
            var vs = document.querySelectorAll('video, video source, audio source');
            for (var i = 0; i < vs.length; i++) collectSrc(vs[i]);

            // 2. 递归 iframe 内的 video
            // 23：原来只防「自引用」（cw === win），但同源 iframe 完全可能出现
            // A 嵌 B、B 又嵌回 A 的环（一些站点用它做「伪全屏」）。那样会无限递归，
            // 直到爆栈被最外层 try-catch 吞掉 —— 表现为「扫描到一半就停了」。
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

            // 3. HLS.js / DASH.js / video.js 等播放器暴露的实例
            var playerRes = Scanner.scanPlayerInstances();
            for (var pr = 0; pr < playerRes.videos.length; pr++) add(playerRes.videos[pr]);

            // 4. a[href] 直接视频文件链接（扩展格式）
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

    // 抽取 HLS.js / DASH.js / video.js 播放器实例中的真实流媒体地址
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
            // HLS.js：全局 window.hls 实例 + video 元素上挂载的 hls 实例 + Hls.instances
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
            // DASH.js：getSource() 或 getManifest().url
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
            // video.js：currentSrc() + currentType()，mpegURL 类型同时加入 m3u8
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
            // 1. 当前页
            var vs = document.querySelectorAll('video, audio, source, a[href]');
            for (var i = 0; i < vs.length; i++) collectM3u8(vs[i]);

            // 2. 递归 iframe
            function scanFrames(win) {
                try {
                    var docs = [win.document];
                    var iframes = win.document.querySelectorAll('iframe, frame');
                    for (var f = 0; f < iframes.length; f++) {
                        try {
                            var cw = iframes[f].contentWindow;
                            if (cw && cw !== win) docs.push(cw.document);
                        } catch (e) {}
                    }
                    for (var d = 0; d < docs.length; d++) {
                        var fels = docs[d].querySelectorAll('video, audio, source, a[href]');
                        for (var fi = 0; fi < fels.length; fi++) collectM3u8(fels[fi]);
                    }
                } catch (e) {}
            }
            scanFrames(window);

            // 3. HLS.js / DASH.js / video.js
            var playerM3u8 = Scanner.scanPlayerInstances().m3u8;
            for (var pm = 0; pm < playerM3u8.length; pm++) add(playerM3u8[pm]);

            // 4. 页面中所有文本节点里的 m3u8 URL
            //    这是整条扫描里唯一「无界」的一段：TreeWalker 会走遍全页每一个文本节点，
            //    内容站动辄几十万节点，同步跑完能卡住主线程几百毫秒。
            //    加一个节点上限（超上限就停），并把单个节点的文本长度也截断 ——
            //    m3u8 地址不会藏在几十 KB 的长文本里，走 prefix 就够。
            try {
                var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
                var textNode;
                var re = /(https?:\/\/[^\s"'<>]+\.m3u8?[^\s"'<>]*)/gi;
                var textBudget = 8000;          // 最多检查 8000 个文本节点
                while (textBudget-- > 0 && (textNode = walker.nextNode()) !== null) {
                    var rawText = textNode.textContent;
                    if (!rawText || rawText.length < 8) continue;   // 纯空白/极短文本直接跳过
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

    // CSS background 扫描（分批处理避免阻塞）
    // 性能 5：能挂 background-image 的标签集合。原来用 getElementsByTagName('*')
    // 把 <script>/<style>/<meta>/<head>/<html> 甚至大量 <br>、纯文本 <span> 全拉进来，
    // 每个都要跑一次 getComputedStyle（这是强制样式计算，单次就是微秒级到毫秒级），
    // 3000 个元素全量算一遍在复杂页面上能卡住主线程好几百毫秒。
    // 这里改成只取「可能带背景图的容器/行内块标签」，并顺便把 NodeList 从 live 换成静态。
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
                    // 性能 5：隐藏元素（display:none / visibility:hidden）不可能被用户看到，
                    // 它们的背景图抓出来也是噪声。复用上面这一次 getComputedStyle 的结果判断，
                    // 不额外发起第二次样式计算，等于零成本过滤。
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

    // MINOR-23: 「把各类扫描结果 + 网络命中合并成一个数组」的逻辑原先在
    // Scanner.doFull 与 ScannerService._legacyScan 里各写了一遍（顺序、类型映射都靠人工对齐），
    // 后续改一处漏一处就会让两条路径行为不一致。这里统一。
    // 返回统一形状：{ url, type, source }，stream 类型额外带 title / site。
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

    // MINOR-23: doFull 的 fallback 与 _legacyScan 各自都要做「DOM 扫描结果 + 网络命中」，
    // 这里再抽一个按类型合并的助手，避免两处过滤条件写歪。
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
        LOG.info('开始全量扫描...');
        if (State.scanner) {
            State.scanner.scan().then(function () {
                LOG.info('扫描完成: 图片', State.images.length, '视频', State.videos.length, '音频', State.audios.length, 'm3u8', State.m3u8.length, '视频链接', State.videoLinks.length);
                if (cb) cb();
            }).catch(function (e) {
                LOG.warn('ScannerService.scan 失败:', e);
                if (cb) cb();
            });
            return;
        }
        // fallback：旧实现
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
            if (cb) cb();
            if (State.config.enableSync) State._broadcast({ type: 'resources', data: { images: State.images, videos: State.videos, audios: State.audios, m3u8: State.m3u8, videoLinks: State.videoLinks } });
        });
    };

        return Scanner;
    })();
    var ScannerService = (function () {
        'use strict';
    // =========================================================================
    // ===== 模块 9.6：新版扫描服务 (ScannerService) - 增量扫描 + Worker + 平台适配器
    // =========================================================================
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

        // Worker 脚本：后台 URL 分类/去重（不访问 DOM）
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

        // ---------- 平台适配器 ----------
        var PlatformAdapters = {};

        // YouTube 适配器：解析 ytInitialPlayerResponse
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

        // Bilibili 适配器：解析 __playinfo__
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

        // Twitter/X 适配器
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

        // Vimeo 适配器
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
                else if (r.type === 'stream' || r.site) videoLinks.push(r.site ? r.site : { url: r.url, title: r.title || '' });
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
            // 外部已存在全局 MutationObserver（_mo）负责增量扫描，
            // ScannerService 只标记为可工作状态；
            // 外部可手动调用 scanIncremental() 或在 _mo 回调中调用。
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

    // 工厂函数
    function createScanner(options) { return new ScannerService(options); }
        ScannerService.create = createScanner;
        return ScannerService;
    })();
    var createScanner = ScannerService.create;
    var DownloadManager = (function () {
        'use strict';

    // =========================================================================
    // ===== 模块 9.5：下载管理器 (DownloadManager) - 统一下载队列 + backend 扩展
    // =========================================================================
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

        // Worker 脚本：在 Blob URL 中运行，负责单 chunk 下载
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

        // ---------- IndexedDB ----------
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
                // 同步到 State.downloadHistory，保证设置页等已有逻辑可用
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
            // 同步到旧 State.downloadHistory，保证设置页等已有逻辑可用
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

        // ---------- Backend 注册 ----------
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

            // http backend：分块多线程下载 + 断点续传
            this.registerBackend('http', function (task, callbacks, ctx) {
                return new HttpBackend(task, callbacks, ctx, self._workerUrl);
            });

            // aria2 backend：推送 URL 到 Aria2 JSON-RPC
            this.registerBackend('aria2', function (task, callbacks, ctx) {
                return new Aria2Backend(task, callbacks, ctx);
            });

            // blob backend：fetch blob 后触发下载
            this.registerBackend('blob', function (task, callbacks, ctx) {
                return new BlobBackend(task, callbacks, ctx);
            });

            // stream backend：录制 MediaStream
            this.registerBackend('stream', function (task, callbacks, ctx) {
                return new StreamBackend(task, callbacks, ctx);
            });

            // m3u8 backend：调用 M3U8 下载合并
            this.registerBackend('m3u8', function (task, callbacks, ctx) {
                return new M3U8Backend(task, callbacks, ctx);
            });
        };

        // ---------- 任务生命周期 ----------
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
                    // P0-1 / P1-8：并发槽的占用与归还标记。
                    //   _slotTaken    —— 当前这次运行是否已经 this._running++
                    //   _slotReleased —— 槽是否已经归还（防重复归还）
                    //   _finished     —— 本次运行是否已经收尾（防 onComplete/onError/cancel 撞车）
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
            // P0-1：记下「这次运行确实占用了并发槽」。排队中从未占用的任务被取消时
            // 就不该减 _running（原实现的无 controller 分支会误减 → 并发数超发）。
            task._slotTaken = true;
            task._slotReleased = false;
            task._finished = false;
            // FIX-17: factory() / controller.start() 同步抛错时，原来没有任何地方回退 _running，
            // 并发槽就永久少一个（多失败几次队列会彻底不动）。这里统一兜住并收尾。
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
                    // P0-1：用户主动取消后，backend 仍可能补一次错误回调。
                    // 此时不该再记一条「下载失败」历史，也不该改状态 —— 只把槽还回去。
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
                abortStart(eFactory);      // FIX-17: factory 同步抛错同样要回退并发槽
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
                if (started) throw e;      // 已经跑起来了再抛错交给上层，避免重复收尾
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

        // 归还并发槽：幂等，且只归还「确实占用过」的那个槽
        DownloadManager.prototype._releaseSlot = function (task) {
            if (!task || !task._slotTaken || task._slotReleased) return false;
            task._slotReleased = true;
            this._running = Math.max(0, this._running - 1);
            return true;
        };

        DownloadManager.prototype._finish = function (task, success) {
            if (!task) return;
            // P1-8: 幂等守卫。onComplete 与 onError 有可能都被触发（例如分片阶段收尾成功、
            // 合并阶段又抛错），也可能与 cancel() 撞车 —— 重复执行会把 _running 多减一次，
            // 并发槽凭空变多、队列超发，_schedule() 也会被重复排队。
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
                // P0-1: 原来这条分支取消后完全不归还并发槽 —— 取消几次 _running 就永远
                // 低于 maxConcurrent，队列再也不会被调度。现在两条分支统一走 _finish()
                // （幂等）：backend 若自己回调了 onError/onComplete，重复调用也不会多减。
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
            // 重试 = 重新占用一个并发槽，标记必须复位，否则 _finish 会拒绝归还
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

        // ---------- HTTP Backend ----------
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
            // P1-10：在途分片的「取消钩子」。取消时逐个触发，让每个分片的回调
            // 都收到一次 'cancelled' —— 否则 pendingChunks 永远不归零，
            // _runChunked 的调度条件永远凑不齐，任务就停在 running 不动了。
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
                    // FIX-04: 续传记录可能来自「下载中被中断」的现场，chunk.running 会是 true；
                    // 若不清掉，_nextPendingSeq 永远跳过它 → 分片没人跑 → 用残缺 buffer 合并出坏文件
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
            // FIX-04r: 不能硬清零计数。resume() 会重新进入这里，而 chunks 是同一批，
            // 已完成的分片不会再有回调 —— 计数归零后 settle() 的条件（finished+failed
            // === chunks.length）永远凑不齐，于是既不合并也不报错，任务卡死在 running。
            // 改为按分片的真实状态重建计数，并把上次遗留的 running 复位。
            self.finishedChunks = 0;
            self.failedChunks = 0;
            for (var ci = 0; ci < self.chunks.length; ci++) {
                var c0 = self.chunks[ci];
                c0.running = false;               // 暂停时被中断的下载不会再有回调
                if (c0.failed) self.failedChunks++;
                else if (c0.done) self.finishedChunks++;
            }
            self._chunksSettled = false;          // 新一轮调度，复位幂等标志

            // FIX-04: 所有分片都有终态（成功 or 永久失败）时收尾。
            // 原来只看 finishedChunks === chunks.length，重试耗尽的分片既不 done 也不再成功，
            // _nextPendingSeq 又一直返回同一个 seq → 无限重试；这里补上失败收尾。
            function settle() {
                if (self._chunksSettled) return true;   // 幂等：cb 路径与 next() 路径都可能走到这里
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
                    // P0-1：取消后只是把在途分片的回调「结清」（让 pendingChunks 回到平衡），
                    // 不能再推进调度或走收尾 —— 否则 settle() 会报一次「分片下载失败」，
                    // 用户主动取消却被记成下载失败历史。
                    if (self.cancelled) return;
                    if (err) {
                        chunk.failed = true;   // FIX-04: 标记永久失败，避免被 _nextPendingSeq 反复挑中
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
                if (ch.done || ch.failed) continue;   // FIX-04: 跳过已完成与永久失败的分片
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

            // P1-10：一个分片只允许回调一次 —— 取消钩子与 worker / XHR 的回调可能同时到达，
            // 双回调会让 pendingChunks 多减一次（甚至变负），调度判断随之失准。
            var settled = false;
            function once(err) {
                if (settled) return;
                settled = true;
                cb(err);
            }

            // P0-2：取消时把在途分片一并「结清」（pendingChunks 回到平衡）
            var hook = function () { chunk.running = false; once('cancelled'); };
            self._cancelHooks.push(hook);
            function releaseHook() {
                var hi = self._cancelHooks.indexOf(hook);
                if (hi >= 0) self._cancelHooks.splice(hi, 1);
            }

            function attempt() {
                if (self.cancelled) { chunk.running = false; releaseHook(); once('cancelled'); return; }
                if (!self.workerUrl) {
                    // 不支持 Worker，回退到当前线程 XHR 单 chunk 下载
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
                // P0-2: 原来 createElement 出来的 worker 从不登记，self.workers 永远是空数组 →
                // _cleanup() 纯空转，取消/暂停时正在跑的 worker 会一路跑到自然结束
                // （白耗流量，还会让 resume 时同一分片被重复下载）。
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
                    // P0-2：结束（无论成功/失败/取消）都从登记表里摘掉，避免数组无限增长
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
            // P1-10：本地再兜一道「只回调一次」。取消钩子与 XHR 回调可能撞车，
            // 双回调会让外层 pendingChunks 多减一次，任务就永远等不到收尾条件。
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
                // P1-10: 原来直接 return —— 回调永远不来，pendingChunks 不递减，
                // 取消后 next() 卡住、任务停在 running 状态。
                // 取消时同样要走 once('cancelled')，让计数回到平衡。
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
                var blobUrl = URL.createObjectURL(blob);
                Dl.fallback(blobUrl, self.task.filename, self.headers);
                if (isFn(self.callbacks.onProgress)) self.callbacks.onProgress(self.totalBytes, self.totalBytes);
                if (isFn(self.callbacks.onComplete)) self.callbacks.onComplete({ url: self.task.url, filename: self.task.filename, blob: blob, blobUrl: blobUrl, totalBytes: self.totalBytes });
                self._cleanup();
            } catch (e) {
                if (isFn(self.callbacks.onError)) self.callbacks.onError({ message: 'Merge failed: ' + e.message });
            }
        };

        HttpBackend.prototype._downloadSingle = function () {
            var self = this;
            // 优先使用 GM_download（浏览器原生下载，不占用内存）
            if (typeof GM_download === 'function') {
                try {
                    // FIX-13：原来只把 Referer 传给 GM_download，config 里配的
                    // User-Agent / Cookie（以及 task.options.headers）全部丢掉 ——
                    // 需要登录态或防盗链校验的资源会直接下成 403 页面。
                    // 这里把 self.headers 整体透传（与 XHR / Worker 路径保持一致）。
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
                            // P0-1：取消后不要再回调 onComplete（否则会记一条成功历史 + 弹完成提示）
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
                    var blobUrl = URL.createObjectURL(blob);
                    Dl.fallback(blobUrl, self.task.filename, self.headers);
                    if (isFn(self.callbacks.onProgress)) self.callbacks.onProgress(xhr.response.byteLength, xhr.response.byteLength);
                    if (isFn(self.callbacks.onComplete)) self.callbacks.onComplete({ url: self.task.url, filename: self.task.filename, blob: blob, blobUrl: blobUrl, totalBytes: xhr.response.byteLength });
                    self._cleanup();
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
            // P0-2：暂停时把在途 worker 真正终止。原来 workers 从不登记、_cleanup 空转，
            // 暂停后旧 worker 会一路跑完 —— 与 _runChunked 里「暂停时被中断的下载不会再有回调」
            // （会把 running 复位）的假设互相矛盾，resume 后同一分片被重复下载。
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
            // P0-1 / P1-10：先把在途分片逐个结清（每个回调收到一次 'cancelled'，
            // pendingChunks 回到平衡、分片标记为失败），再真正终止全部 worker。
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

        // ---------- Aria2 Backend ----------
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

        // ---------- Blob Backend ----------
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

        // ---------- Stream Backend ----------
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

        // ---------- M3U8 Backend ----------
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
                            var blobUrl = URL.createObjectURL(blob);
                            Dl.fallback(blobUrl, self.task.filename, null);
                            LOG.info('m3u8 合并完成:', mergedData.length, '字节');
                            if (isFn(self.callbacks.onProgress)) self.callbacks.onProgress(mergedData.length, mergedData.length);
                            if (isFn(self.callbacks.onComplete)) self.callbacks.onComplete({ url: self.task.url, filename: self.task.filename, blob: blob, blobUrl: blobUrl, totalBytes: mergedData.length });
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
    // =========================================================================
    // ===== 模块 10：下载引擎 (Downloader) + 进度可视化 (P0-3)
    // =========================================================================
    var Dl = {};
    Dl._usedNames = new Set();
    // 性能 3：只需记住「近期用过的文件名」以避重，2000 条足够，超了从最早的开始丢
    Dl._usedNamesLru = U.lru(Dl._usedNames, 2000);

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
        // 24：原来用**未转义**的 out 去判断扩展名，却把 safeFilename(out) 作为最终名。
        // safeFilename 会删非法字符、去首尾空白与点、必要时截断 —— 任何一处改动
        // 都可能让「判断有后缀」与「实际有后缀」不一致（重复 .mp4.mp4 或整个丢掉后缀）。
        // 改为对最终名本身做判断。
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

    // 单个下载（支持自定义请求头 P1-4）
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
        try {
            if (typeof GM_download === 'function') {
                try {
                    GM_download({
                        url: url,
                        name: finalName,
                        headers: customHeaders.Referer ? { Referer: customHeaders.Referer } : undefined,
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

    Dl.fallback = function (url, name, headers) {
        try {
            var a = document.createElement('a');
            a.href = url; a.download = name || ''; a.target = '_blank'; a.rel = 'noopener';
            (document.documentElement || document.body).appendChild(a);
            try { a.click(); } catch (e) { try { window.open(url, '_blank'); } catch (e2) {} }
            setTimeout(function () { try { a.remove(); } catch (e) {} }, 400);
        } catch (e) { try { window.open(url, '_blank'); } catch (e2) {} }
    };

    // 推送到 Aria2 JSON-RPC
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

    // 下载 Blob URL：fetch 后重新创建 Object URL 触发下载
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

    // 录制 MediaStream 并下载
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

    // 批量下载（含进度可视化）
    Dl.batch = function (urls, kind, progressCb, doneCb) {
        if (!urls || urls.length === 0) { toast(LANG.t('noDlResource'), '#f59e0b'); return; }
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

        // P1-7：finish() 必须幂等。DownloadManager 对同一个任务既可能回调 onComplete
        // 又可能回调 onError（例如分片阶段收尾成功、合并阶段再抛错；或 #8 那种
        // 双回调），两边的判断都是 done + failed >= total —— 于是 finish() 被执行两次：
        // 弹两条完成 toast、doneCb 被调两次（调用方若拿着它再做收尾就会重复处理）。
        var finished = false;
        function finish() {
            if (finished) return;
            finished = true;
            State.downloading = false;
            State.downloadProgress = null;
            var elapsed = (U.now() - startTime) / 1000;
            // MINOR-18: 原来紧接着弹第二条（成功数），会把第一条「完成：成功 x / 总计 y / 耗时」顶掉，
            // 用户几乎看不到总览。合并成一条：有失败时才补上成功数，且延迟到总览展示之后。
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

        // 按 task id 去重：DownloadManager 对同一个任务既可能回调 onComplete
        // 又可能回调 onError（分片收尾成功、合并阶段再抛错），两边判断都是
        // `done + failed >= total` —— 于是计数会大于实际任务数（统计偏差），
        // 还可能在仍有任务没跑完时就提前 finish。
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

    // 停止下载（P1-5）
    Dl.stop = function () {
        State.downloading = false;
        State.downloadProgress = null;
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

    // 初始化 DownloadManager（使用当前并发配置）
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

    // 队列管理：查看/暂停/继续/取消/重试
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

    // 生成下载脚本（跨域兜底 P0-4）
    Dl.generateScript = function (urls, format) {
        // format: 'curl' | 'wget' | 'aria2' | 'python'
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

    // =========================================================================
    // ===== 模块 10.5：选择管理器 (SelectionManager) - 方案三吸收方案二
    // 在面向最常见场景的流式 API 基础上，保留批量操作/分组/去重/收藏夹的扩展注册能力
    // =========================================================================
    var Selection = {};

    // ---- 内部状态初始化 ----
    Selection._ensureState = function () {
        if (!State._favorites) {
            State._favorites = new Set();
            try {
                // 与 FIX-12 同源：原来直接 JSON.parse(raw)，GM_getValue 返回对象时抛错被吞，
                // 结果是收藏列表静默变空。改用统一助手兼容三种形态。
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

    // ---- 核心状态访问（向后兼容） ----
    Selection.add = function (id) { State.selected.add(id); };
    Selection.remove = function (id) { State.selected.delete(id); };
    Selection.toggle = function (id) {
        if (State.selected.has(id)) State.selected.delete(id);
        else State.selected.add(id);
    };
    Selection.clear = function () { State.selected.clear(); };

    // ---- 模式控制 ----
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

    // ---- 批量核心方法 ----
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
    // ---- 拖拽排序 ----
    Selection.move = function (fromIndex, toIndex, list) {
        if (!list || fromIndex === toIndex) return;
        var item = list[fromIndex];
        if (typeof item === 'undefined') return;
        State._selOrder = Array.from(list);
        State._selOrder.splice(fromIndex, 1);
        State._selOrder.splice(toIndex, 0, item);
    };
    // ---- 收藏夹 ----
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

    // ---- 去重 ----
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

    // ---- 分组 ----
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
    // ---- 批量操作注册 ----
    Selection.registerBatchAction = function (id, label, fn, options) {
        Selection._ensureState();
        if (!id || typeof fn !== 'function') return;
        State._batchActions[id] = { id: id, label: label || id, fn: fn, options: options || {} };
    };
    // 批量菜单需要它来列出已注册的动作（原缺失，导致「批量」按钮渲染时抛错）
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

    // ---- UI 辅助 ----
    // 遗留2：选中态主色统一出口，保证初始渲染与运行时更新永远同色
    Selection._primary = function () {
        try {
            var c = UI.colors();
            if (c && c.primary) return c.primary;
        } catch (e) {}
        return MS_CONFIG.COLORS.primary;
    };

    // 卡片选中态是靠**内联样式**表达的（border / box-shadow 直接写在元素上），
    // 而内联样式不带 !important —— 三种新风格（新拟物 / 粗野主义 / 终端）都用
    // `!important` 覆盖了 [data-url] 的 border 与 box-shadow，按 CSS 优先级
    // 「作者样式表的 !important 高于内联的非 !important」，选中态会被全部压掉，
    // 用户点了卡片完全看不出选没选中。
    // 解法与 MINOR-26 里 locateResource 的高亮环一致：内联也标 important
    // （内联 !important 高于作者样式表 !important）。
    // 传空串会连同 !important 一起清掉，元素回落到各风格 CSS 的默认边框/阴影，
    // 正是「取消选中」期望的结果。
    Selection._setBorderImportant = function (el, val) {
        if (!el || !el.style) return;
        try { el.style.setProperty('border', val, 'important'); }
        catch (e) { try { el.style.border = val; } catch (e2) {} }
    };
    Selection._setShadowImportant = function (el, val) {
        if (!el || !el.style) return;
        try { el.style.setProperty('box-shadow', val, 'important'); }
        catch (e) { try { el.style.boxShadow = val; } catch (e2) {} }
    };

    Selection._updateCardMark = function (url) {
        var card = document.querySelector('[data-url="' + U.cssEscape(url) + '"]');
        if (!card) return;
        var mark = card.querySelector('._ms_sel_mark');
        var isSel = State.selected.has(url);
        // 遗留2：这里原来写死 MS_CONFIG.COLORS.primary（靛蓝），FIX-15 只改了初始渲染，
        // 导致切「玫瑰红」等配色后卡片初次渲染是玫瑰红，一按选又变回靛蓝。
        // 与 mediaCardHtml 保持一致，统一取当前配色。
        var pri = Selection._primary();
        var selShadow = '0 4px 12px ' + UI._ios27Rgba(pri, 0.35);
        if (mark) {
            if (State.selectionMode) {
                mark.style.display = 'flex';
                // 角标同样走 important：它是内联绘制的小圆点，将来任何风格只要
                // 给 ._ms_sel_mark 加了带 !important 的规则就会把它压掉。
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
        // 遗留2：与 _updateCardMark 同源问题，一并跟随配色
        var pri2 = Selection._primary();
        var selShadow2 = '0 4px 12px ' + UI._ios27Rgba(pri2, 0.35);
        for (var j = 0; j < cards.length; j++) {
            var url = cards[j].getAttribute('data-url');
            var isSel = State.selected.has(url);
            if (State.selectionMode) {
                Selection._setBorderImportant(cards[j], isSel ? '2px solid ' + pri2 : '1px dashed ' + pri2);
                Selection._setShadowImportant(cards[j], isSel ? selShadow2 : '');
            } else {
                // 空串 = 连同 !important 一起清掉，回落到各风格 CSS 的默认样式
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

    // ---- 注册默认分组规则 ----
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

    // ---- 注册默认批量操作 ----
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
    // =========================================================================
    // 插件管理核心模块：安装 / 卸载 / 启用 / 禁用 / 持久化
    // =========================================================================
    var PM = {};

    // 内置市场插件（示例/预置）
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
    var UI = (function () {
        'use strict';
    // =========================================================================
    // ===== 模块 11：UI 面板 + 虚拟列表 (P0-2) + 进度条 + 媒体预览 (P1-1)
    // =========================================================================
    var UI = {};

    // 生效中的明暗模式。终端复古强制暗底（表格里明确 ❌ 不响应 light/dark），
    // 一切「按主题取色」的地方都必须走这个函数 —— 只改 CSS 不够：
    // JS 生成的内联样式（卡片、标签、设置页控件）数量远超 CSS 覆盖面，
    // 一旦漏掉就会出现「深底黑字」。
    // 定义放在 UI 模块最前面：它被 colors / listPalettes / toggle 等大量早于
    // 后续代码执行的地方调用，晚定义会踩「模块初始化期间就调用」的时序。
    UI.isEffectivelyDark = function () {
        try {
            if (State && State.config && State.config.uiStyle === 'terminal') return true;
        } catch (e) {}
        return State.getTheme() === 'dark';
    };

    UI._thumbCache = {};
    // 性能 3：dataURL 体积大，上限压到 240 条（够回看两屏，又不会无限涨）
    UI._thumbCacheLru = U.lru(UI._thumbCache, 240);
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

        // 用 blob URL 方式提取封面，绕过 CORS 限制
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
                        UI._thumbCacheLru.set(url, dataUrl);   // 性能 3：走上限管理
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

        // 优先使用 GM_xmlhttpRequest 获取 blob（绕过 CORS）
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
            // 降级：直接尝试用 video 标签加载
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
                                // FIX-03: elem 已被下面的 replaceChild 摘除，parentNode 为 null；
                                // 占位块应替换掉已挂上去的 img
                                if (img.parentNode) img.parentNode.replaceChild(d, img);
                            };
                            // FIX-03: 元素可能已被虚拟列表回收，先确认还在文档里
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
        VideoResolver.resolve(url, function(data, err) {
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
        var concurrent = VideoResolver._maxConcurrent || 3;

        function next() {
            if (index >= total) return;
            var currentIndex = index;
            index++;
            var url = urls[currentIndex];
            VideoResolver.resolve(url, function(data, err) {
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

    // ---- 浮动按钮（极简可靠版） ----
    UI._floatBtn = null;

    // 全局注入按钮样式（只执行一次，GM_addStyle 优先级最高）
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

            // 恢复保存的位置
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

            // 拖拽逻辑
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

            // 右键 / 长按弹出快捷菜单
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

            // 同步当前界面风格到浮动按钮（走 safeRun：异常不打断建按钮，但一定留日志）
            U.safeRun(function () { UI.applyUiStyle(); }, 'applyUiStyle(floatBtn)');

            // 窗口尺寸变化时把按钮拉回可视区
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

    // 按钮守护：MutationObserver + 轮询双重保障
    UI._floatGuardRunning = false;
    UI._rebuildTimer = null;
    UI._floatMO = null;
    UI._floatMOTarget = null;

    // P0-3：守护只观察「浮动按钮所在的父节点」，且不递归。
    // 原来 observe(document.documentElement, {subtree:true}) —— 页面任何角落的 DOM 变更
    // 都会进回调队列，回调里还要把每次 mutation 的 removedNodes 全遍历一遍。
    // 长会话（尤其 SPA）下这是脚本里最费 CPU 的一项，而它要判定的其实只有一件事：
    // 「按钮还在不在」。按钮始终是 body（或 documentElement）的直接子节点，
    // 所以监听它的父节点（childList，不递归）就足够精确；
    // 万一监听目标失效，下方本来就有轮询作为第二道保障。
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
                UI._floatMObserve();     // 重建后宿主可能变了，重新对准监听目标
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

    // ===== 配色方案（Palette）模块 =====
    // 明暗模式（auto/light/dark）与配色方案（palette）正交独立
    // palette 仅决定强调色（primary / primary2），bg / txt / border 仍由明暗模式决定
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

    // 内部：取当前 palette 在当前明暗模式下的强调色
    UI._paletteColors = function () {
        var id = UI.getPalette();
        var dark = UI.isEffectivelyDark();
        var built = UI._palettes[id];
        if (built) return dark ? built.dark : built.light;
        var custom = UI._getCustomPalette(id);        // FIX-01: 原缺这行，custom 未声明即引用 → ReferenceError
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

    // 注册内置预设配色
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

    // ===== iOS 风格 Toggle Switch =====
    // color: 主题色（可选，默认使用 palette 的 primary）
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

    // ===== 界面风格：iOS 27 液态玻璃（Liquid Glass）=====
    // 设计要点（对齐 iOS 26/27 的 Liquid Glass 语言）：
    //   1) 高通透材质：大半径模糊 + 高饱和 + 亮度补偿，页面内容从玻璃后透出
    //   2) 镜面边缘：顶部强高光、两侧渐弱、底部微弱反光，形成玻璃厚度感
    //   3) 折射色散：极低透明度的青 / 品红渐变，模拟玻璃边缘分光
    //   4) 同心灵动圆角：外壳 26px，内部控件半径递减
    //   5) 胶囊控件：标签页 / 搜索框 / 按钮全部胶囊化
    //   6) 弹性回弹：按压缩放走 spring 曲线 cubic-bezier(.34,1.56,.64,1)
    //   7) 光扫动效：9.5s 一次缓慢扫过的高光（transform 合成动画，不触发重排）
    //   8) 降级：不支持 backdrop-filter 时改用高不透明底；尊重 prefers-reduced-motion
    // 性能 8：具名色 → rgb 的换算结果缓存（键是原始具名色，如 'white'）
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
        // MINOR-19: 自定义配色可能写成 rgb()/rgba()/hsl()/hsla()。
        // 原来直接原样返回 → 液态玻璃的染色/折射拿不到 alpha，效果整体失效。
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
        // 具名色（red / white …）交给浏览器：用临时元素换算成 rgb，再拼 alpha
        if (/^[a-z]+$/i.test(h)) {
            // 性能 8：具名色只有 148 个，而这段代码的代价不低 ——
            // createElement + 挂到 body + getComputedStyle（强制布局/样式计算）+ 摘除。
            // 而液态玻璃层在每次应用样式、每次切主题时都会拿同一个颜色反复调它，
            // 光 'white' / 'transparent' 这类就能被调用几十次。
            // 换算结果与 alpha 无关（alpha 是最后拼上去的），所以缓存 rgb 前缀即可。
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
                            UI._namedColorCache[h] = rgbPrefix;   // 性能 8：命中后不再碰 DOM
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

        // ---- 流体玻璃材质参数（深 / 浅）----
        var glassColor = dark ? 'rgba(14,15,26,0.42)' : 'rgba(255,255,255,0.46)';
        var glassImage = dark
            ? 'linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.015) 44%)'
            : 'linear-gradient(180deg,rgba(255,255,255,0.46),rgba(255,255,255,0.06) 48%)';
        // 高饱和 + 亮度补偿：让背后流动的色团透出来时依旧清亮
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
        var sheen = 'radial-gradient(120% 55% at 12% -10%,' + (dark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.90)')
            + ',rgba(255,255,255,0) 60%),linear-gradient(135deg,' + rgba(A, 0.10) + ',' + rgba(A2, 0.06) + ' 48%,' + rgba(R, 0.05) + ')';
        var dispersion = 'linear-gradient(115deg,' + (dark ? 'rgba(120,200,255,0.12)' : 'rgba(120,200,255,0.18)')
            + ',rgba(255,255,255,0) 34%,rgba(255,255,255,0) 66%,' + (dark ? 'rgba(255,150,220,0.12)' : 'rgba(255,150,220,0.18)') + ')';
        var sweep = dark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.58)';
        var modalBg = dark ? 'rgba(21,22,34,0.74)' : 'rgba(255,255,255,0.80)';
        var modalBlur = dark ? 'blur(34px) saturate(200%)' : 'blur(30px) saturate(180%)';
        // 流体色团（背景里缓慢漂移的三个色块）
        var flow = [rgba(A, dark ? 0.60 : 0.42), rgba(A2, dark ? 0.55 : 0.38), rgba(R, dark ? 0.46 : 0.30)];
        var specA = dark ? 0.34 : 0.55;
        var rippleA = dark ? 0.40 : 0.60;

        var css = '';

        // 1) 外壳：高通透玻璃 + 镜面边缘 + 同心圆角
        css += S + '{background-color:' + glassColor + ' !important;background-image:' + glassImage + ' !important;'
            + '-webkit-backdrop-filter:' + glassBlur + ' !important;backdrop-filter:' + glassBlur + ' !important;'
            + 'border-radius:' + rOuter + ' !important;border:1px solid ' + rim + ' !important;box-sizing:border-box !important;overflow:hidden !important;'
            + 'box-shadow:' + panelShadow + ',inset 0 1px 0 ' + hiTop + ',inset 0 -1px 0 ' + hiBottom
            + ',inset 1px 0 0 ' + hiSide + ',inset -1px 0 0 ' + hiSide + ' !important;}';

        // 2) 面板子层：内容压在流体色团之上，镜面/波纹浮在最上层
        css += S + '>div:not(._ms_glass_layers){position:relative;z-index:1;}';
        css += L + '{position:absolute;inset:0;pointer-events:none;border-radius:inherit;overflow:hidden;contain:paint;}';

        // 3) 流体色团：三个大色斑以不同周期漂移，形成玻璃背后"流动"的感觉
        //    外层 wrap 承担指针视差（跟着手指缓慢偏移），内层色斑各自漂移，互不打架。
        css += L + ' ._ms_gl_wrap{position:absolute;inset:0;display:block;'
            + 'transform:translate3d(calc(var(--_ms_px,0) * 9px),calc(var(--_ms_py,0) * 9px),0);}';
        //    不完全正圆（静态不对称圆角）：更像organic的液滴，且不额外触发重绘
        css += L + ' ._ms_gl{position:absolute;display:block;opacity:.85;will-change:transform;'
            + 'border-radius:48% 52% 45% 55%/52% 45% 55% 48%;transform:translate3d(0,0,0);}';
        css += L + ' ._ms_gl_1{width:82%;height:46%;left:-12%;top:-10%;'
            + 'background-image:radial-gradient(closest-side,' + flow[0] + ',' + rgba(A, 0) + ' 72%);'
            + 'animation:_ms_fluid_a 23s cubic-bezier(.37,0,.63,1) infinite;}';
        css += L + ' ._ms_gl_2{width:74%;height:42%;right:-16%;top:24%;'
            + 'background-image:radial-gradient(closest-side,' + flow[1] + ',' + rgba(A2, 0) + ' 70%);'
            + 'animation:_ms_fluid_b 29s cubic-bezier(.37,0,.63,1) infinite;}';
        if (!isMob) {
            // 移动端只保留两团，减少合成压力
            css += L + ' ._ms_gl_3{width:88%;height:48%;left:-8%;bottom:-14%;'
                + 'background-image:radial-gradient(closest-side,' + flow[2] + ',' + rgba(R, 0) + ' 70%);'
                + 'animation:_ms_fluid_c 34s cubic-bezier(.37,0,.63,1) infinite;}';
        } else {
            css += L + ' ._ms_gl_3{display:none;}';
        }
        //    多段关键帧（每段都是位移+缩放同时变），保证任何时刻都在动，不会"卡在端点"
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

        // 4) 指向性镜面高光：跟随指针 / 手指位置（CSS 变量由 JS 写入，rAF 合并）
        css += L + ' ._ms_gl_spec{position:absolute;inset:0;z-index:6;'
            + 'background-image:radial-gradient(38% 32% at var(--_ms_sx,50%) var(--_ms_sy,-10%),rgba(255,255,255,' + specA + '),rgba(255,255,255,0) 70%);'
            + 'opacity:.9;transition:opacity .3s ease;}';
        // 5) 按压波纹：手指按下处漾开的一团光，松手后淡出
        css += L + ' ._ms_gl_ripple{position:absolute;inset:0;z-index:6;'
            + 'background-image:radial-gradient(34% 30% at var(--_ms_sx,50%) var(--_ms_sy,50%),rgba(255,255,255,' + rippleA + '),rgba(255,255,255,0) 72%);'
            + 'opacity:0;transition:opacity .38s cubic-bezier(.22,1,.36,1);}';
        // 5b) 湿润反射：与高光反向的第二光斑，像玻璃背面透出来的液体折射
        css += L + ' ._ms_gl_wet{position:absolute;inset:0;z-index:5;opacity:' + (dark ? '.42' : '.55') + ';'
            + 'background-image:radial-gradient(30% 26% at calc(100% - var(--_ms_sx,50%) * .82) calc(100% - var(--_ms_sy,50%) * .82),'
            + 'rgba(255,255,255,' + (dark ? '.14' : '.42') + '),rgba(255,255,255,0) 74%);}';
        css += S + '._ms_pressing ._ms_gl_ripple{opacity:1;transition:opacity .09s ease;}';
        css += S + '._ms_pressing ._ms_gl_1{animation-duration:11s;}';
        css += S + '._ms_pressing ._ms_gl_2{animation-duration:14s;}';
        css += S + '._ms_pressing ._ms_gl_wet{opacity:' + (dark ? '.62' : '.78') + ';transition:opacity .12s ease;}';

        // 6) 玻璃厚度：外缘镜面 + 内侧弯月面（色散微光）
        css += S + '::before{content:"";position:absolute;inset:0;z-index:3;pointer-events:none;border-radius:' + rOuter
            + ';background-image:' + sheen + ',' + dispersion + ';background-repeat:no-repeat;'
            + 'box-shadow:inset 0 0 26px rgba(255,255,255,' + (dark ? 0.08 : 0.30) + '),'
            + 'inset 3px 0 14px -8px rgba(120,200,255,' + (dark ? 0.35 : 0.55) + '),'
            + 'inset -3px 0 14px -8px rgba(255,150,220,' + (dark ? 0.35 : 0.55) + ');}';
        // 6b) 增强版：顶部高光随指针偏移（液体表面被"拉"出反光）。
        //     单独一条规则，解析失败时自动回退到上面那条静态高光。
        var sheenLive = 'radial-gradient(120% 55% at calc(6% + var(--_ms_sx,50%) * .30) calc(var(--_ms_sy,-10%) * .14 - 10%),'
            + (dark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.90)')
            + ',rgba(255,255,255,0) 60%),linear-gradient(135deg,' + rgba(A, 0.10) + ',' + rgba(A2, 0.06) + ' 48%,' + rgba(R, 0.05) + ')';
        css += S + '::before{background-image:' + sheenLive + ',' + dispersion + ';}';
        // 7) 光扫（合成层动画，只在可见时运行）
        css += S + '::after{content:"";position:absolute;top:-30%;bottom:-30%;left:-75%;width:60%;z-index:4;pointer-events:none;'
            + 'background-image:linear-gradient(100deg,rgba(255,255,255,0),' + sweep + ',rgba(255,255,255,0));'
            + 'transform:translate3d(-30%,0,0);opacity:0;animation:_ms_ios27_sweep 9.5s cubic-bezier(.45,.05,.55,.95) infinite;}';
        css += '@keyframes _ms_ios27_sweep{0%,52%{transform:translate3d(-30%,0,0);opacity:0;}60%{opacity:1;}100%{transform:translate3d(340%,0,0);opacity:0;}}';

        // 8) 标题栏：有色玻璃
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

        // 9) 标签页：胶囊 + 流体形变（按下时收紧圆角，像被按软）
        css += S + ' #_ms_tabs{background-color:transparent !important;background-image:none !important;'
            + 'border-bottom:1px solid ' + layerRim + ' !important;gap:6px !important;padding:10px 12px !important;}';
        css += S + ' ._ms_tab{border-radius:999px !important;background-color:' + layerBg + ' !important;background-image:none !important;'
            + 'color:' + c.sub + ' !important;box-shadow:inset 0 1px 0 ' + hiSoft + ' !important;'
            + 'transition:transform .3s ' + spring + ',border-radius .34s ' + spring + ',background-color .28s ease,color .28s ease,box-shadow .28s ease !important;}';
        css += S + ' ._ms_tab[data-active="1"]{background-image:linear-gradient(135deg,' + rgba(A, 1) + ',' + rgba(A2, 1) + ') !important;'
            + 'color:#fff !important;box-shadow:0 6px 20px ' + rgba(A, 0.34) + ',inset 0 1px 0 rgba(255,255,255,0.45) !important;}';
        css += S + ' ._ms_tab:active{transform:scale(.93) !important;border-radius:16px !important;}';

        // 10) 搜索 / 筛选 / 进度层
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

        // 11) 内容区 / 底部栏融入玻璃
        css += S + ' #_ms_box{background-color:transparent !important;background-image:none !important;}';
        css += S + ' #_ms_footer{background-color:transparent !important;background-image:none !important;border-top:1px solid ' + layerRim + ' !important;}';

        // 12) 资源卡片：玻璃瓦片（不动 border，保留选中态描边）
        css += S + ' ._ms_card{border-radius:' + rCard + ' !important;background-color:' + cardBg + ' !important;'
            + 'background-image:linear-gradient(180deg,' + (dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.35)') + ',rgba(255,255,255,0) 44%) !important;'
            + 'box-shadow:inset 0 1px 0 ' + hiSoft + ',' + cardRest + ' !important;'
            + 'transition:transform .34s ' + spring + ',border-radius .34s ' + spring + ',background-color .3s ease,box-shadow .3s ease !important;}';
        css += S + ' ._ms_card:hover{transform:translateY(-3px) scale(1.012) !important;background-color:' + cardHover + ' !important;'
            + 'box-shadow:inset 0 1px 0 ' + hiSoft + ',' + cardLift + ' !important;}';
        css += S + ' ._ms_card:active{transform:scale(.955) !important;border-radius:' + (isMob ? '26px' : '28px') + ' !important;}';

        // 13) 其余控件：胶囊 + 按下形变
        css += S + ' button:not(._ms_tab){border-radius:999px !important;'
            + 'transition:transform .3s ' + spring + ',border-radius .34s ' + spring + ',background-color .28s ease,color .28s ease,box-shadow .28s ease !important;}';
        css += S + ' button:not(._ms_tab):active{transform:scale(.94) !important;border-radius:14px !important;}';
        css += S + ' #_ms_box input:not([type="checkbox"]):not([type="radio"]),' + S + ' #_ms_box select,' + S + ' #_ms_box textarea{'
            + 'border-radius:14px !important;background-color:' + (dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.72)') + ' !important;'
            + 'border:1px solid ' + fieldRim + ' !important;box-shadow:inset 0 1px 0 ' + hiSoft + ' !important;}';

        // 14) 滚动条
        css += S + ' ::-webkit-scrollbar{width:8px;height:8px;}';
        css += S + ' ::-webkit-scrollbar-track{background:transparent;}';
        css += S + ' ::-webkit-scrollbar-thumb{background-color:' + (dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.16)') + ' !important;'
            + 'border-radius:999px !important;border:2px solid transparent !important;background-clip:padding-box !important;}';
        css += S + ' ::-webkit-scrollbar-thumb:hover{background-color:' + (dark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.26)') + ' !important;}';

        // 15) 浮动按钮：液态玻璃球
        //     原来是近乎不透明的实心渐变（底色 alpha 0.86~1.0），背景模糊几乎看不见；
        //     这里把染色压到 0.30~0.42，让背后的页面真正透上来，再加强模糊与镜面边缘，
        //     得到一颗「看得穿」的玻璃珠。图标是白色描边，仍有足够对比度。
        css += '#_ms_float._ms_btn_ios27{background-color:' + rgba(A, dark ? 0.30 : 0.40) + ' !important;'
            + 'background-image:radial-gradient(130% 130% at 28% 14%,' + rgba('#ffffff', dark ? 0.46 : 0.78) + ',' + rgba('#ffffff', 0) + ' 56%),'
            + 'linear-gradient(150deg,' + rgba(A, dark ? 0.36 : 0.44) + ',' + rgba(A2, dark ? 0.28 : 0.36) + ' 62%,' + rgba(R, dark ? 0.20 : 0.26) + ') !important;'
            + '-webkit-backdrop-filter:blur(30px) saturate(230%) brightness(1.10) !important;backdrop-filter:blur(30px) saturate(230%) brightness(1.10) !important;'
            + 'border:1px solid ' + rgba('#ffffff', dark ? 0.38 : 0.72) + ' !important;'
            + 'box-shadow:0 12px 34px ' + rgba(A, dark ? 0.40 : 0.34) + ',0 2px 10px rgba(0,0,0,' + (dark ? 0.34 : 0.18) + '),'
            + 'inset 0 1px 0 ' + rgba('#ffffff', dark ? 0.55 : 0.85) + ',inset 0 -3px 10px ' + rgba('#000000', dark ? 0.20 : 0.10) + ' !important;'
            + 'transition:transform .34s ' + spring + ',box-shadow .3s ease,border-radius .34s ' + spring + ' !important;}';
        css += '#_ms_float._ms_btn_ios27:active{transform:scale(.88) !important;}';
        // 无 backdrop-filter 时退回较实的底色，保证图标依然清晰可辨
        css += '@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){'
            + '#_ms_float._ms_btn_ios27{background-color:' + rgba(A, dark ? 0.86 : 0.94) + ' !important;}}';

        // 16) 面板外浮层：同一套流体玻璃语言
        css += B + ' #_ms_queue_modal,' + B + ' #_ms_vlp_modal{border-radius:26px !important;background-color:' + modalBg + ' !important;'
            + '-webkit-backdrop-filter:' + modalBlur + ' !important;backdrop-filter:' + modalBlur + ' !important;'
            + 'box-shadow:0 26px 70px rgba(0,0,0,' + (dark ? 0.60 : 0.24) + '),inset 0 0 0 1px ' + rim + ',inset 0 1px 0 ' + hiTop + ' !important;}';
        css += B + ' #_ms_footer_menu,' + B + ' #_ms_float_ctx_menu,' + B + ' #_ms_sel_pop{border-radius:20px !important;background-color:' + modalBg + ' !important;'
            + '-webkit-backdrop-filter:blur(28px) saturate(190%) !important;backdrop-filter:blur(28px) saturate(190%) !important;'
            + 'box-shadow:0 20px 50px rgba(0,0,0,' + (dark ? 0.55 : 0.22) + '),inset 0 0 0 1px ' + rim + ' !important;}';
        //      提示条的染色 / 高光 / 阴影由 toast() 按调用方传入的颜色逐条生成（内联样式），
        //      这里只用 !important 强制圆角与背景模糊；不能再写 box-shadow，
        //      否则会盖掉内联的按色阴影（!important 优先于非重要的内联样式）。
        css += B + ' ._ms_toast{border-radius:999px !important;-webkit-backdrop-filter:blur(26px) saturate(210%) brightness(1.06) !important;'
            + 'backdrop-filter:blur(26px) saturate(210%) brightness(1.06) !important;}';
        // MINOR-26: 迷你栏阴影不再用 !important 硬压内联值——改为把配色阴影写进 CSS 变量，
        // 内联的 box-shadow:var(--_ms_bar_shadow) 自然拿到同一份值，两边不会再打架。
        var barShadow = '0 12px 32px ' + rgba(A, 0.40) + ',inset 0 1px 0 rgba(255,255,255,0.45),inset 0 -2px 8px rgba(0,0,0,0.15)';
        try { document.documentElement.style.setProperty('--_ms_bar_shadow', barShadow); } catch (e0) {}
        css += B + ' #_ms_minimized_bar{border-radius:999px !important;-webkit-backdrop-filter:blur(20px) saturate(190%) !important;'
            + 'backdrop-filter:blur(20px) saturate(190%) !important;}';
        css += B + ' #_ms_status{border-radius:0 0 18px 18px !important;'
            + 'box-shadow:0 10px 28px rgba(0,0,0,' + (dark ? 0.45 : 0.20) + '),inset 0 -1px 0 rgba(255,255,255,0.35) !important;}';

        // 17) 空闲（面板关闭 / 页面切后台）：暂停所有无限动画，省电省 GPU
        var noBlurPanel = dark ? 'rgba(14,15,26,0.93)' : 'rgba(255,255,255,0.95)';
        var noBlurModal = dark ? 'rgba(21,22,34,0.96)' : 'rgba(255,255,255,0.97)';
        css += '@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){'
            + S + '{background-color:' + noBlurPanel + ' !important;}'
            + B + ' #_ms_queue_modal,' + B + ' #_ms_vlp_modal,' + B + ' #_ms_footer_menu,' + B + ' #_ms_float_ctx_menu,' + B + ' #_ms_sel_pop{background-color:' + noBlurModal + ' !important;}}';
        css += 'body._ms_glass_idle ' + S + ' ._ms_gl,' + 'body._ms_glass_idle ' + S + '::after{animation-play-state:paused !important;}';

        // 18) 减少动态效果
        css += '@media (prefers-reduced-motion: reduce){' + S + ' *,' + S + ',' + S + '::before,' + S + '::after,'
            + '#_ms_float._ms_btn_ios27{animation:none !important;transition-duration:.01ms !important;}'
            + L + ' ._ms_gl{opacity:.45;}}';

        return css;
    };

    // =========================================================================
    // ===== 界面风格：颜色工具 =====
    // 新拟物 / 粗野主义 / 终端 三种风格都要在「当前配色」基础上派生出一批
    // 同色系深浅色。原来只有 UI._ios27Rgba（只负责加 alpha），这里补一个最小的
    // 混色工具：把颜色朝白 / 黑方向线性插值，解析失败时原样返回（绝不吐 undefined）。
    // =========================================================================
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

    // amt > 0 向白靠、amt < 0 向黑靠（0~1）
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

    // =========================================================================
    // ===== 界面风格：新拟物 (Neumorphism) =====
    // 设计象限：柔和 / 同色系 / 光影塑形。响应 light/dark。
    //   · 控件与底同色，靠「左上高光 + 右下阴影」塑形，不描边、不分割线
    //   · 静止 = 凸起（外阴影），悬停 = 略微抬高，按下/激活 = 凹陷（inset）
    //     凸 → 凹的切换是这个风格的核心手感，所以所有可点元素都要有按下态
    //   · 暗色下高光降到 3~5% 白、阴影加深，否则会在深底上「发光」而非「塑形」
    // =========================================================================
    UI._buildNeumorphCss = function (dark, isMob) {
        var c = UI.colors();
        var pc = UI._paletteColors() || {};
        var A = pc.primary || MS_CONFIG.COLORS.primary;
        var A2 = pc.primary2 || MS_CONFIG.COLORS.primary2;
        var S = '#_ms_panel._ms_style_neumorph';
        var B = 'body._ms_neumorph';
        // 同色系底：暗色下再压暗一档，让「凸起」的高光有对比空间
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
        // 三套阴影：normal 凸起 / small 小件凸起 / pressed 凹陷
        var raise = '6px 6px 14px ' + lo + ',-6px -6px 14px ' + hi;
        var raiseSm = '4px 4px 9px ' + loSoft + ',-4px -4px 9px ' + hiSoft;
        var press = 'inset 4px 4px 9px ' + lo + ',inset -4px -4px 9px ' + hiSoft;
        var pressSm = 'inset 3px 3px 6px ' + lo + ',inset -3px -3px 6px ' + hiSoft;
        var accentText = dark ? UI._shade(A, 0.35) : UI._shade(A, -0.18);

        var css = '';
        // ---- 面板外壳：不要描边、不要硬阴影，靠一层极浅的外阴影与底分离 ----
        css += S + '{border-radius:' + rOuter + ' !important;background:' + base + ' !important;'
            + 'color:' + c.txt + ' !important;border:none !important;'
            + 'box-shadow:' + (isMob ? 'none' : '-10px 0 34px ' + lo + ',-2px 0 8px ' + loSoft) + ' !important;}';
        // ---- 顶部标题栏：同色系凸起面，靠底部一道极浅的凹陷分界（不用 border） ----
        css += S + ' > div:first-child{background:' + base + ' !important;color:' + c.txt + ' !important;'
            + 'border-radius:' + rTop + ' !important;border:none !important;'
            + 'box-shadow:0 1px 0 ' + hiSoft + ',0 6px 12px -8px ' + lo + ' !important;}';
        css += S + ' > div:first-child > div{color:' + c.txt + ' !important;font-weight:700 !important;letter-spacing:.2px !important;}';
        // 标题栏里的最小化 / 关闭按钮 → 圆形凸起小垫片
        css += S + ' > div:first-child button{background:' + base + ' !important;color:' + c.sub + ' !important;'
            + 'border:none !important;border-radius:50% !important;box-shadow:' + raiseSm + ' !important;'
            + 'transition:box-shadow .18s ease,transform .18s ease,color .18s ease !important;}';
        css += S + ' > div:first-child button:hover{color:' + accentText + ' !important;}';
        css += S + ' > div:first-child button:active{box-shadow:' + pressSm + ' !important;transform:scale(.96) !important;}';

        // ---- 标签栏：一枚凸起的胶囊槽，标签是槽里的小凸片，选中的凹陷下去 ----
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

        // ---- 输入框 / 下拉：凹陷的「刻槽」，是这套语言里最直观的静止形态 ----
        css += S + ' #_ms_search,' + S + ' #_ms_filter,' + S + ' #_ms_progress{background:' + base2 + ' !important;'
            + 'border:none !important;border-radius:' + rField + ' !important;margin:0 12px 8px !important;'
            + 'box-shadow:' + pressSm + ' !important;color:' + c.txt + ' !important;}';
        css += S + ' input:not([type="checkbox"]):not([type="radio"]),' + S + ' select,' + S + ' textarea{'
            + 'background:' + base2 + ' !important;color:' + c.txt + ' !important;border:none !important;'
            + 'border-radius:10px !important;box-shadow:' + pressSm + ' !important;}';
        css += S + ' input:focus,' + S + ' select:focus,' + S + ' textarea:focus{'
            + 'box-shadow:' + pressSm + ',0 0 0 3px ' + UI._alpha(A, dark ? 0.30 : 0.22) + ' !important;outline:none !important;}';

        // ---- 内容区：整块「凹进去」的底板，卡片浮在上面 ----
        css += S + ' #_ms_box{background:' + base2 + ' !important;border:none !important;'
            + 'border-radius:' + rCard + ' !important;margin:0 12px 10px !important;'
            + 'box-shadow:' + pressSm + ' !important;}';
        css += S + ' #_ms_footer{background:' + base + ' !important;border:none !important;'
            + 'border-radius:' + rCard + ' !important;margin:0 12px 10px !important;'
            + 'box-shadow:' + raiseSm + ' !important;}';
        // 底部按钮：凸起小垫片，按下凹陷
        css += S + ' #_ms_footer button{background:' + base + ' !important;color:' + c.txt + ' !important;'
            + 'border:none !important;border-radius:11px !important;box-shadow:' + raiseSm + ' !important;'
            + 'transition:box-shadow .18s ease,transform .18s ease,color .18s ease !important;}';
        css += S + ' #_ms_footer button:hover{color:' + accentText + ' !important;}';
        css += S + ' #_ms_footer button:active{box-shadow:' + pressSm + ' !important;transform:scale(.97) !important;}';

        // ---- 资源卡片：凸起方块；选中态凹陷 + 配色描边光晕 ----
        css += S + ' [data-url]{background:' + base + ' !important;border:none !important;'
            + 'border-radius:' + rCard + ' !important;box-shadow:' + raiseSm + ' !important;'
            + 'transition:box-shadow .2s ease,transform .2s ease !important;}';
        css += S + ' [data-url]:hover{box-shadow:6px 6px 14px ' + lo + ',-5px -5px 12px ' + hi + ' !important;'
            + 'transform:translateY(-1px) !important;}';
        css += S + ' [data-url]:active{box-shadow:' + pressSm + ' !important;transform:translateY(0) scale(.985) !important;}';
        // 名称栏是卡片的**第 2 个**子 div（第 1 个是缩略图，之后还有 _ms_sel_mark
        // 与可选的 iframeBadge），所以不能写 last-child —— 那会命中角标/徽标。
        css += S + ' [data-url] > div:nth-child(2){background:' + base + ' !important;'
            + 'color:' + c.txt + ' !important;border-radius:0 0 ' + rCard + ' ' + rCard + ' !important;}';

        // ---- 进度条：凹陷轨道 + 配色填充 ----
        css += S + ' #_ms_progress_bar{background:linear-gradient(135deg,' + A + ',' + A2 + ') !important;border-radius:999px !important;}';

        // ---- 面板外浮层：同一套同色系塑形语言（不做玻璃模糊） ----
        css += B + ' #_ms_queue_modal,' + B + ' #_ms_vlp_modal,' + B + ' #_ms_footer_menu,'
            + B + ' #_ms_float_ctx_menu,' + B + ' #_ms_sel_pop{background:' + base + ' !important;'
            + 'color:' + c.txt + ' !important;border:none !important;border-radius:18px !important;'
            + 'box-shadow:10px 10px 26px ' + lo + ',-8px -8px 20px ' + hi + ' !important;}';
        // 轻提示保留调用方传入的语义色（成功绿 / 警告橙 / 失败红），
        // 只把形状与阴影换成本风格 —— 若强行改成同色系底，「失败」就认不出了。
        css += B + ' ._ms_toast{border:none !important;border-radius:14px !important;'
            + 'box-shadow:0 10px 24px ' + lo + ',inset 0 1px 0 ' + hi + ' !important;'
            + 'text-shadow:0 1px 2px rgba(0,0,0,.22) !important;}';
        css += B + ' #_ms_minimized_bar{background:' + base + ' !important;color:' + c.txt + ' !important;'
            + 'border:none !important;box-shadow:' + raise + ' !important;}';
        css += B + ' #_ms_status{background:' + base + ' !important;color:' + c.txt + ' !important;'
            + 'border:none !important;box-shadow:0 6px 16px ' + lo + ' !important;}';

        // ---- 浮动按钮：一颗同色系「实体垫片」圆钮 ----
        css += '#_ms_float._ms_btn_neumorph{background:' + base + ' !important;background-image:none !important;'
            + 'color:' + accentText + ' !important;border:none !important;'
            + 'box-shadow:7px 7px 16px ' + lo + ',-6px -6px 14px ' + hi + ' !important;'
            + 'transition:box-shadow .2s ease,transform .2s ease !important;}';
        css += '#_ms_float._ms_btn_neumorph:active{box-shadow:' + press + ' !important;transform:scale(.94) !important;}';
        css += '#_ms_float._ms_btn_neumorph svg{color:' + accentText + ' !important;filter:none !important;}';

        // ---- 尊重 prefers-reduced-motion ----
        css += '@media (prefers-reduced-motion: reduce){' + S + ' *,' + S + ',' + S + '::before,' + S + '::after,'
            + '#_ms_float._ms_btn_neumorph{transition-duration:.01ms !important;animation:none !important;}}';
        return css;
    };

    // =========================================================================
    // ===== 界面风格：新粗野主义 (Neo-Brutalism) =====
    // 设计象限：硬边 / 粗描边 / 物理反馈。响应 light/dark（暗色换亮边）。
    //   · 零圆角、粗描边、**实心无模糊**的硬偏移阴影（6px 6px 0，不是 6px 6px 20px）
    //   · 交互反馈是「物理位移」：按下时整体平移 (3px,3px)、阴影同步收窄，
    //     视觉上像把按钮真的摁进纸面；而不是只改颜色
    //   · 亮色用黑墨 + 亮黄强调；暗色把墨换成白，强调色保持高饱和
    // =========================================================================
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
        // 暗色下强调色略微提亮，避免在深底上「糊」
        var pop = dark ? UI._shade(A, 0.24) : A;
        var pop2 = dark ? UI._shade(A2, 0.20) : A2;
        var popInk = dark ? '#000000' : '#000000';       // 强调面上一律用黑字（黄/青底上黑字最清楚）
        var edge = '3px solid ' + ink;
        var hard = '6px 6px 0 ' + ink;
        var hardSm = '4px 4px 0 ' + ink;
        var rOuter = isMob ? '0' : '0';
        // 按下 = 往阴影方向平移，同时阴影缩到 2px：制造「摁平」的物理感
        var pressTf = 'translate(3px,3px)';
        var pressShadow = '3px 3px 0 ' + ink;

        var css = '';
        // ---- 面板外壳：粗墨边 + 硬阴影，完全不用圆角 ----
        css += S + '{border-radius:' + rOuter + ' !important;background:' + paper + ' !important;'
            + 'color:' + txt + ' !important;border-left:' + edge + ' !important;'
            + 'box-shadow:' + (isMob ? 'none' : hard + ',12px 12px 0 ' + UI._alpha(ink, dark ? 0.28 : 0.14)) + ' !important;}';
        // ---- 标题栏：强调色实心块 + 下沿粗墨边 ----
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

        // ---- 标签栏：一排硬边方形按钮，选中的是强调色实心块 ----
        css += S + ' #_ms_tabs{background:' + paper2 + ' !important;border-bottom:' + edge + ' !important;'
            + 'border-radius:0 !important;gap:0 !important;padding:0 !important;}';
        css += S + ' ._ms_tab{background:' + paper + ' !important;color:' + txt + ' !important;'
            + 'border:none !important;border-right:2px solid ' + ink + ' !important;border-radius:0 !important;'
            + 'box-shadow:none !important;font-weight:800 !important;letter-spacing:.3px !important;'
            + 'transition:background-color .12s linear,color .12s linear !important;}';
        css += S + ' ._ms_tab[data-active="1"]{background:' + pop + ' !important;color:' + popInk + ' !important;'
            + 'box-shadow:inset 0 -4px 0 ' + ink + ' !important;}';
        css += S + ' ._ms_tab:not([data-active="1"]):hover{background:' + pop2 + ' !important;}';

        // ---- 输入框：白纸黑框，聚焦时换成强调色描边 ----
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

        // ---- 内容区 / 底栏：硬边块 ----
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

        // ---- 资源卡片：白纸黑框 + 硬阴影；悬停抬起、按下摁平 ----
        css += S + ' [data-url]{background:' + paper + ' !important;border:2px solid ' + ink + ' !important;'
            + 'border-radius:0 !important;box-shadow:' + hardSm + ' !important;'
            + 'transition:transform .09s linear,box-shadow .09s linear !important;}';
        css += S + ' [data-url]:hover{transform:translate(-2px,-2px) !important;'
            + 'box-shadow:6px 6px 0 ' + ink + ' !important;}';
        css += S + ' [data-url]:active{transform:' + pressTf + ' !important;box-shadow:1px 1px 0 ' + ink + ' !important;}';
        // 名称栏是第 2 个子 div（详见新拟物里的说明），不能写 last-child
        css += S + ' [data-url] > div:nth-child(2){background:' + paper + ' !important;'
            + 'color:' + txt + ' !important;border-top:2px solid ' + ink + ' !important;'
            + 'font-weight:700 !important;}';

        // ---- 进度条：硬边轨道 + 强调色填充（无渐变） ----
        css += S + ' #_ms_progress{background:' + paper + ' !important;}';
        css += S + ' #_ms_progress_bar{background:' + pop + ' !important;border-radius:0 !important;'
            + 'box-shadow:none !important;}';

        // ---- 面板外浮层：同一套硬边 + 硬阴影 ----
        css += B + ' #_ms_queue_modal,' + B + ' #_ms_vlp_modal,' + B + ' #_ms_footer_menu,'
            + B + ' #_ms_float_ctx_menu,' + B + ' #_ms_sel_pop{background:' + paper + ' !important;'
            + 'color:' + txt + ' !important;border:' + edge + ' !important;border-radius:0 !important;'
            + 'box-shadow:8px 8px 0 ' + ink + ' !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;}';
        // 保留语义底色（失败红 / 警告黄 一眼能分），只套上本风格的
        // 直角 + 粗黑边 + 硬偏移阴影 —— 色块配黑框正是粗野主义的招牌。
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

        // ---- 浮动按钮：一枚方糖（硬边方块，不是圆球） ----
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

    // =========================================================================
    // ===== 界面风格：终端复古 (Terminal) =====
    // 设计象限：等宽 / 扫描线 / 荧光氛围。**强制暗底**（不响应 light/dark）。
    //   · 全等宽字体 + 磷光绿前景 + 极低的底色（#070b07），像一台老 CRT
    //   · 面板 ::after 铺扫描线（repeating-linear-gradient），pointer-events:none
    //   · 文字带轻微 glow，标题栏末端一个闪烁光标
    //   · 强制暗底靠 !important 全覆盖：面板 / 卡片 / 输入框的内联配色都会被压掉，
    //     否则切到浅色主题时内联的浅色底会从荧光绿文字下面透出来
    // =========================================================================
    // 注意：dark 参数**有意不使用** —— 终端复古强制暗底，与系统主题无关。
    // 保留该形参只是为了三个构建函数签名一致（调用点不必为风格特判）。
    UI._buildTerminalCss = function (dark, isMob) {
        var S = '#_ms_panel._ms_style_terminal';
        var B = 'body._ms_terminal';
        var mono = 'ui-monospace,SFMono-Regular,Menlo,Consolas,"DejaVu Sans Mono","Courier New",monospace';
        var bg = '#070b07';          // 屏幕底
        var bg2 = '#0b120b';         // 略亮一档的块
        var fg = '#5cff8f';          // 磷光绿
        var fgDim = '#2f9e57';       // 次级文字
        var fgBright = '#c8ffd8';    // 高亮
        var line = 'rgba(92,255,143,0.28)';
        var lineSoft = 'rgba(92,255,143,0.13)';
        var glow = '0 0 6px rgba(92,255,143,0.55)';
        var rOuter = isMob ? '0' : '0';
        var scan = 'repeating-linear-gradient(180deg,rgba(0,0,0,0.34) 0px,rgba(0,0,0,0.34) 1px,'
            + 'rgba(0,0,0,0) 1px,rgba(0,0,0,0) 3px)';

        var css = '';
        // ---- 面板：黑底 + 绿字 + 满屏扫描线 ----
        css += S + '{border-radius:' + rOuter + ' !important;background:' + bg + ' !important;'
            + 'color:' + fg + ' !important;border:none !important;'
            + 'font-family:' + mono + ' !important;font-size:13px !important;letter-spacing:.2px !important;'
            + 'box-shadow:' + (isMob ? 'none' : '-1px 0 0 ' + line + ',-14px 0 40px rgba(0,0,0,0.7)') + ' !important;}';
        // 扫描线 + 一层极淡的 CRT 中心亮斑；不拦截指针
        css += S + '::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:4;'
            + 'background:' + scan + ',radial-gradient(120% 80% at 50% 0%,rgba(92,255,143,0.07),rgba(0,0,0,0) 62%);'
            + 'background-blend-mode:normal;opacity:.85;}';
        css += S + ' *{font-family:' + mono + ' !important;}';
        // 全局面板文字统一到磷光绿（次级色由下方更具体的规则覆盖）
        css += S + ',' + S + ' #_ms_box,' + S + ' #_ms_footer{color:' + fg + ' !important;}';

        // ---- 标题栏：命令行提示符风格，末端闪烁光标 ----
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

        // ---- 标签栏：像一行「命令行参数」，选中的反白 ----
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

        // ---- 输入框：下划线式输入（像老终端的光标行） ----
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

        // ---- 内容区 / 底栏 ----
        css += S + ' #_ms_box{background:' + bg + ' !important;border:none !important;border-radius:0 !important;'
            + 'box-shadow:inset 0 1px 0 ' + lineSoft + ' !important;margin:0 0 0 0 !important;}';
        css += S + ' #_ms_footer{background:' + bg2 + ' !important;'
            + 'border-top:1px solid ' + line + ' !important;border-radius:0 !important;margin:0 !important;}';
        css += S + ' #_ms_footer button{background:transparent !important;color:' + fg + ' !important;'
            + 'border:1px solid ' + line + ' !important;border-radius:0 !important;box-shadow:none !important;'
            + 'text-shadow:none !important;transition:background-color .12s linear,color .12s linear !important;}';
        css += S + ' #_ms_footer button:hover{background:' + UI._alpha(fg, 0.16) + ' !important;'
            + 'color:' + fgBright + ' !important;}';

        // ---- 资源卡片：方框 + 绿框，选中反白 ----
        css += S + ' [data-url]{background:' + bg2 + ' !important;border:1px solid ' + lineSoft + ' !important;'
            + 'border-radius:0 !important;box-shadow:none !important;'
            + 'transition:border-color .12s linear,background-color .12s linear !important;}';
        css += S + ' [data-url]:hover{border-color:' + fg + ' !important;'
            + 'background:' + UI._alpha(fg, 0.09) + ' !important;box-shadow:0 0 0 1px ' + UI._alpha(fg, 0.35) + ' !important;}';
        // 名称栏是第 2 个子 div（详见新拟物里的说明），不能写 last-child
        css += S + ' [data-url] > div:nth-child(2){background:' + bg2 + ' !important;'
            + 'color:' + fg + ' !important;border-top:1px solid ' + lineSoft + ' !important;}';

        // ---- 进度条：细长的荧光条 ----
        css += S + ' #_ms_progress_bar{background:' + fg + ' !important;border-radius:0 !important;'
            + 'box-shadow:0 0 8px ' + UI._alpha(fg, 0.65) + ' !important;}';

        // ---- 面板外浮层：同一套终端语言（全部走 !important 压掉内联配色） ----
        css += B + ' #_ms_queue_modal,' + B + ' #_ms_vlp_modal,' + B + ' #_ms_footer_menu,'
            + B + ' #_ms_float_ctx_menu,' + B + ' #_ms_sel_pop{background:' + bg2 + ' !important;'
            + 'color:' + fg + ' !important;border:1px solid ' + line + ' !important;border-radius:0 !important;'
            + 'box-shadow:0 0 0 1px ' + lineSoft + ',0 18px 60px rgba(0,0,0,0.8) !important;'
            + '-webkit-backdrop-filter:none !important;backdrop-filter:none !important;'
            + 'font-family:' + mono + ' !important;}';
        css += B + ' #_ms_queue_modal *,' + B + ' #_ms_vlp_modal *,' + B + ' #_ms_footer_menu *,'
            + B + ' #_ms_float_ctx_menu *,' + B + ' #_ms_sel_pop *{font-family:' + mono + ' !important;}';
        // 终端风的轻提示：保留调用方的语义底色（成功绿 / 警告黄 / 失败红），
        // 只把「形状与字体」换成终端语言 —— 直角、等宽、外加一圈硬黑描边。
        // 不用 currentColor 做边框/发光：内联颜色是统一的白色，取不到语义色。
        css += B + ' ._ms_toast{border-radius:0 !important;'
            + 'outline:1px solid rgba(0,0,0,0.55) !important;'
            + 'font-family:' + mono + ' !important;font-weight:700 !important;letter-spacing:.3px !important;'
            + '-webkit-backdrop-filter:none !important;backdrop-filter:none !important;}';
        css += B + ' #_ms_minimized_bar{background:' + bg2 + ' !important;color:' + fg + ' !important;'
            + 'border:1px solid ' + line + ' !important;border-radius:0 !important;box-shadow:none !important;}';
        css += B + ' #_ms_status{background:' + bg + ' !important;color:' + fg + ' !important;'
            + 'border-bottom:1px solid ' + line + ' !important;border-radius:0 !important;box-shadow:none !important;}';

        // ---- 浮动按钮：一个终端方形标记，方块光标在闪 ----
        css += '#_ms_float._ms_btn_terminal{background:' + bg2 + ' !important;background-image:none !important;'
            + 'color:' + fg + ' !important;border:1px solid ' + fg + ' !important;border-radius:0 !important;'
            + 'box-shadow:0 0 0 1px ' + lineSoft + ',0 0 16px ' + UI._alpha(fg, 0.45) + ' !important;'
            + 'transition:background-color .12s linear,box-shadow .12s linear !important;}';
        css += '#_ms_float._ms_btn_terminal:hover{background:' + UI._alpha(fg, 0.15) + ' !important;}';
        css += '#_ms_float._ms_btn_terminal:active{background:' + UI._alpha(fg, 0.3) + ' !important;'
            + 'box-shadow:0 0 0 1px ' + lineSoft + ',0 0 26px ' + UI._alpha(fg, 0.7) + ' !important;}';
        css += '#_ms_float._ms_btn_terminal svg{color:' + fg + ' !important;filter:none !important;}';

        // ---- 尊重 prefers-reduced-motion（含光标闪烁） ----
        css += '@media (prefers-reduced-motion: reduce){' + S + ' *,' + S + ',' + S + '::before,' + S + '::after,'
            + '#_ms_float._ms_btn_terminal{transition-duration:.01ms !important;animation:none !important;}'
            + S + ' > div:first-child > div::after{animation:none !important;opacity:1;}}';
        return css;
    };

    UI.applyUiStyle = function () {
        var style = State.config && State.config.uiStyle ? State.config.uiStyle : 'normal';
        if (MS_CONFIG.UI_STYLE_IDS.indexOf(style) < 0) style = 'normal';
        // 终端复古强制暗底：它不响应 light/dark（表格里明确标 ❌），
        // 因此主题也一并按深色取值，避免内联背景色与 CSS 覆盖打架。
        var dark = UI.isEffectivelyDark();
        var c = UI.colors();   // FIX-02: 末尾 _ms_sliding 规则要用 c.bg，原先未声明 → 抛错被 catch 吞掉，规则永不生效
        // 面板 / 浮动按钮 / body 三处的风格类名，按同一张映射表切换。
        // 原来只处理 ios27 一套，新增三种风格后必须集中管理，否则「切换风格时
        // 只摘掉上一次那一个类」的写法会留下残影（例如粗暴风格的黑框会跟着 ios27）。
        var panel = State.panel;
        if (panel) {
            for (var pi = 0; pi < MS_CONFIG.UI_STYLE_IDS.length; pi++) panel.classList.remove('_ms_style_' + MS_CONFIG.UI_STYLE_IDS[pi]);
            panel.classList.remove('_ms_dark');
            panel.classList.add('_ms_style_' + style);
            if (dark) panel.classList.add('_ms_dark');
        }
        // 同步浮动按钮风格类
        var floatBtn = UI._floatBtn || document.getElementById('_ms_float');
        if (floatBtn) {
            for (var fi = 0; fi < MS_CONFIG.UI_STYLE_IDS.length; fi++) floatBtn.classList.remove('_ms_btn_' + MS_CONFIG.UI_STYLE_IDS[fi]);
            floatBtn.classList.add('_ms_btn_' + style);
        }
        // 面板外的浮层（弹窗 / 菜单 / 轻提示）通过 body 标记统一走同一套语言。
        // 注意：只有 normal 不加标记（它靠 JS 内联样式），其余五种各一个 body 类。
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
        // 样式内容未变时直接跳过重建：applyUiStyle 会被主题切换、设置保存、
        // 初始化等多个入口反复调用，重建整段 CSS 会触发样式表重新解析。
        // 终端风格强制暗底、不随明暗变化，缓存键里固定成 'd'，
        // 免得切换系统主题时白重建一遍整段 CSS。
        var styleKey = style + '|' + (style === 'terminal' ? 'd' : (dark ? 'd' : 'l'))
            + '|' + (isMob ? 'm' : 'p') + '|' + UI.getPalette();
        if (UI._uiStyleKey === styleKey && el.textContent) {
            UI._syncIos27Layers(panel, style);
            return;
        }
        UI._uiStyleKey = styleKey;
        // 18：模块间靠「运行时顺序」串起来，一旦某个构建函数还没定义（比如
        // 被裁剪版本 / 提前调用），原来会直接抛 ReferenceError 被上层 catch 吞掉。
        // 这里显式检查并记日志，把「静默罢工」变成「一眼能看到的报错」。
        var needBuilder = { neumorph: '_buildNeumorphCss', brutal: '_buildBrutalCss', terminal: '_buildTerminalCss' }[style];
        if (needBuilder && typeof UI[needBuilder] !== 'function') {
            LOG.error('界面风格构建函数缺失: UI.' + needBuilder + '（风格 ' + style + ' 退回普通）');
            style = 'normal';
            panel && panel.classList && panel.classList.add('_ms_style_normal');
        }
        var css = '';
        // 只给面板主要容器挂过渡（原来用 #_ms_panel * 命中所有后代，
        // 会让每个卡片/按钮都参与合成与样式重算）；切换主题时再临时全量过渡。
        css += '#_ms_panel, #_ms_panel #_ms_tabs, #_ms_panel #_ms_box, #_ms_panel #_ms_footer, #_ms_panel #_ms_search { transition: background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease; }';
        css += '#_ms_panel._ms_theming, #_ms_panel._ms_theming * { transition: background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease !important; }';
        css += 'body._ms_glass_idle #_ms_panel._ms_style_ios27 *, body._ms_glass_idle #_ms_float._ms_btn_ios27 { animation-play-state: paused !important; }'
            // 终端风格的标题光标是无限闪烁动画，面板关闭 / 页面切后台时同样该停
            + 'body._ms_glass_idle #_ms_panel._ms_style_terminal > div:first-child > div::after { animation-play-state: paused !important; opacity: 0 !important; }';
        // WARN-13: UI._onVlinkScrollStart 会给正在滚动区域里的视频卡加 _ms_vlink_paused，
        // 但原先没有任何对应样式，加/删都毫无效果（纯死代码）。
        // 这里赋予它真实语义：快速滚动期间暂停卡片内的动画与过渡，减少合成开销。
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
            // iOS 27 液态玻璃：材质、镜面高光与动效全部由 UI._buildIos27Css 生成
            css += UI._buildIos27Css(dark, isMob);
        } else if (style === 'neumorph') {
            // 新拟物：同色系 + 光影塑形，凸起 / 凹陷两态切换
            css += UI._buildNeumorphCss(dark, isMob);
        } else if (style === 'brutal') {
            // 新粗野主义：硬边 + 粗描边 + 硬偏移阴影，按下时物理位移
            css += UI._buildBrutalCss(dark, isMob);
        } else if (style === 'terminal') {
            // 终端复古：强制暗底 + 等宽 + 扫描线（不响应 light/dark）
            css += UI._buildTerminalCss(dark, isMob);
        } else {
            // normal：不注入额外覆盖样式，由 JS 内联样式控制
        }
        // 滑动 / 滚动期间顶替全屏背景模糊（UI._panelGlassFreeze 会临时挂上 _ms_sliding）。
        // 必须追加在风格 CSS 之后：两者优先级相同（都是 1 个 id + 1 个 class），靠后者生效。
        if (style === 'ios27') {
            try {
                var slideBg = UI._ios27Rgba(c.bg, dark ? 0.90 : 0.94);
                if (/^rgba\(/.test(slideBg)) {
                    css += '#_ms_panel._ms_sliding{-webkit-backdrop-filter:none !important;backdrop-filter:none !important;'
                        + 'background-color:' + slideBg + ' !important;}';
                }
            } catch (e) {}
            // 滑动途中色团动画也暂停：面板在动的时候它们看不见，白烧 GPU
            css += '#_ms_panel._ms_sliding ._ms_glass_layers *{animation-play-state:paused !important;}';
        }
        el.textContent = css;
        UI._syncIos27Layers(panel, style);
    };

    // iOS 27 流体玻璃需要额外的子层容器（流体色团 / 指向性镜面高光 / 按压波纹），
    // 只在 ios27 风格下插入，其它风格移除，避免留下无用节点。
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

    // 指向性镜面高光 / 湿润反射 / 流体视差 / 按压波纹：
    // 目标位置来自指针，写入 CSS 变量前先做粘滞插值（每帧向目标靠 18%），
    // 所以玻璃是"被拖着慢慢流过去"，而不是硬跟手指；收敛后立即停掉 rAF，不空转。
    // 面板矩形做缓存，避免每帧强制布局。
    // 性能 2：是否支持 Pointer Events —— 决定动效事件只绑 pointer 还是退回 touch
    UI._hasPointerEvents = (function () {
        try { return typeof window !== 'undefined' && 'onpointerdown' in window && !!(window.PointerEvent); } catch (e) { return false; }
    })();

    var glassResizeHandler = null;   // MINOR-27: 当前挂着的 resize 处理器

    UI._bindGlassMotion = function (panel) {
        if (!panel || panel._msGlassBound) return;
        panel._msGlassBound = true;

        // MINOR-27: 先解绑上一轮遗留的监听（面板被 remove() 重建后，
        // 旧的 resize 监听还挂在 window 上，每次重建都会累加一份）。
        UI._unbindGlassMotion();

        var reduce = false;
        try { reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) {}

        var raf = 0, rect = null;
        var tx = 50, ty = -10, cx = 50, cy = -10;      // 高光位置（px）：目标 / 当前
        var tpx = 0, tpy = 0, cpx = 0, cpy = 0;        // 归一化视差（-1..1）：目标 / 当前
        var st = panel.style;

        function refreshRect() { try { rect = panel.getBoundingClientRect(); } catch (e) { rect = null; } }
        function write() {
            st.setProperty('--_ms_sx', cx.toFixed(1) + 'px');
            st.setProperty('--_ms_sy', cy.toFixed(1) + 'px');
            st.setProperty('--_ms_px', cpx.toFixed(3));
            st.setProperty('--_ms_py', cpy.toFixed(3));
        }
        function step() {
            var dx = tx - cx, dy = ty - cy;
            if (dx * dx + dy * dy < 0.25 && Math.abs(tpx - cpx) + Math.abs(tpy - cpy) < 0.004) {
                cx = tx; cy = ty; cpx = tpx; cpy = tpy;
                write();
                raf = 0;                                   // 收敛：停下，不再占用一帧
                return;
            }
            cx += dx * 0.18; cy += dy * 0.18;
            cpx += (tpx - cpx) * 0.12; cpy += (tpy - cpy) * 0.12;
            write();
            raf = requestAnimationFrame(step);
        }
        function kick() { if (!raf) raf = requestAnimationFrame(step); }
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
            // 回到静止态：高光落回顶部中央，视差归零
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

        // 性能 2：原来 pointer* 与 touch* 各绑一套，触屏上浏览器会把同一次触摸
        // 同时派发成 pointerdown 和 touchstart（touch 事件族与 pointer 事件族并存），
        // 于是 onDown / onMove 每次操作都跑两遍——两边都还各带一次
        // classList 操作与 setTimeout，等于白干一倍活。
        // 支持 Pointer Events 的环境只留 pointer 一套；老环境退回 touch。
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
        // MINOR-27: 把节流后的处理器存起来，销毁时才能精确解绑
        // （U.throttle 每次返回新函数，原来那个匿名包装根本无法 removeEventListener）。
        glassResizeHandler = U.throttle(refreshRect, 300);
        window.addEventListener('resize', glassResizeHandler);
    };

    // MINOR-27: 解绑玻璃动效的全局监听。面板销毁 / 重建前调用，避免 resize 监听累加。
    UI._unbindGlassMotion = function () {
        if (glassResizeHandler) {
            try { window.removeEventListener('resize', glassResizeHandler); } catch (e) {}
            glassResizeHandler = null;
        }
    };

    // 面板关闭 / 页面切到后台时暂停玻璃动效（液态色团与光扫都是无限动画）
    UI._glassIdle = function (on) {
        try {
            var bodyEl = document.body || document.documentElement;
            if (!bodyEl || !bodyEl.classList) return;
            if (on) bodyEl.classList.add('_ms_glass_idle');
            else bodyEl.classList.remove('_ms_glass_idle');
        } catch (e) {}
    };

    // P0-3：面板级 MutationObserver 的连接开关。真实实现位于文件末尾
    // （那里才创建 observer 实例）；这里先放空实现，避免 openPanel / closePanel
    // 在时序上早于 observer 创建时踩空。
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

    // ===== 卡片长按进入选择模式 =====
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
                    longPressEl._msLongPressTriggered = true;
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

        // 性能 2：原来 touch* 与 mouse* 各绑一套。触屏上浏览器在 touchend 之后
        // 还会补发一对 mousedown/mouseup（兼容鼠标事件），长按计时器因此会被
        // 启动两次；滑动手势更糟——touchmove 已经开始清理计时器，紧随其后的
        // mousemove 又判断一次，白白多做一轮坐标比较。
        // 支持 Pointer Events 的环境统一用 pointer，一套覆盖鼠标 / 触摸 / 触控笔。
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

    // ===== 虚拟列表组件 =====
    // 虚拟列表（节点复用版）
    // 旧实现每次滚动都重建整个可视区 innerHTML：图片重新挂载、DOM 全量重建，
    // 列表越长越卡。这里改为按 index 复用节点池，滚动只增删进出窗口的少量节点。
    // =========================================================================
    //  虚拟列表 / 虚拟网格（图片太多时的渲染优化）
    // =========================================================================
    // 原来这里把每个条目当成「整行一项」：position:absolute;left:0;right:0 + translate3d(0, idx*130px, 0)。
    // 但传入的 renderItem 返回的是**网格卡片**（缩略图 width:100% + aspect-ratio:1/1），
    // 在手机端会撑成整屏宽的方块，而行高却只按 130px 递增 —— 于是卡片之间疯狂重叠，
    // 整块区域糊成一团、既没有网格结构也没法点选。
    // 触发条件正是「图片超过 100 张」（renderMedia 里 useVirtual = kwList.length > 100），
    // 所以表现为「图片一多就崩」。
    //
    // 现在按**行**做虚拟化：先量容器宽度算出列数与单元格尺寸，只渲染视口内的行，
    // 每张卡按 (行, 列) 绝对定位，行高 = 单元格高 + 间距。
    UI.VirtualList = function (container, items, renderItem, opts) {
        var o = (typeof opts === 'number') ? { legacyRowHeight: opts } : (opts || {});
        var list = items || [];

        // 网格参数（默认对齐 renderMedia 里非虚拟网格的取值）
        var gap = o.gap != null ? o.gap : 8;
        var pad = o.padding != null ? o.padding : 10;
        var fixedCols = o.columns > 0 ? o.columns : 0;     // 移动端固定 2 列
        var minCardW = o.minCardWidth || 120;
        // 缩略图之下的文字区（内边距 + 标题最多两行 + 边框），用来定卡片高度
        var titleBlock = o.titleBlock != null ? o.titleBlock : 62;
        var os = o.overscan != null ? o.overscan : 4;
        // 真正的滚动容器。renderMedia 里传入的 container 是「内容底板」：
        // 它的父级 #_ms_box 才带 overflow-y:auto（container 上的 flex:1 因为父级不是
        // flex 容器而失效，高度被内容撑开，自身永远不会滚动）。
        // 之前只看 container.clientHeight / container.scrollTop —— 前者等于整块内容高度
        // （于是"视口"变成全部条目），后者恒为 0（于是滚动时不再更新）。
        var scroller = o.scrollParent || container;

        var nodes = new Map();      // index → DOM 节点
        var keys = {};              // index → 渲染签名（选中态变化时需要重绘）
        var pool = [];              // 回收池
        var viewportHeight = 0;
        var cols = fixedCols || 1;  // 实际列数（量宽后确定）
        var cellW = minCardW;
        var cardH = minCardW + titleBlock;
        var rowH = cardH + gap;
        var laidOutCols = 0;        // 上次布局用的列数，变化时需要重排已有节点
        var contentOffset = 0;      // container 相对外层滚动内容顶部的偏移
        var rafId = 0;
        // P0-4：measure() 里读的 clientWidth / clientHeight / offsetTop / clientTop
        // 全是「强制同步布局」的读操作，放在滚动路径上等于每帧重算一次布局 —— 长列表必掉帧。
        // 现在尺寸只在确实可能变化时重量（初始一次 / ResizeObserver 触发 / 显式 update(true)），
        // 滚动路径只读一次 scrollTop。
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

        // 量尺寸：列数 / 单元格宽 / 行高 / 占位高度
        function measure() {
            var w = container.clientWidth || 0;
            if (!w) w = (o.fallbackWidth || 320);   // 面板隐藏时量不到，等 ResizeObserver 再量
            var availW = Math.max(60, w - pad * 2);
            cols = fixedCols || Math.max(1, Math.floor((availW + gap) / (minCardW + gap)));
            cellW = (availW - gap * (cols - 1)) / cols;
            cardH = cellW + titleBlock;
            rowH = cardH + gap;
            if (scroller === container) {
                contentOffset = 0;
                viewportHeight = container.clientHeight || 400;
            } else {
                // container 顶边相对外层滚动内容顶部的偏移（顶部信息栏的高度）。
                // 只在布局阶段算一次，不放进每帧的 update 里，避免滚动时反复强制回流。
                var off = container.offsetTop - scroller.offsetTop - (scroller.clientTop || 0);
                contentOffset = (isFinite(off) && off > 0) ? off : 0;
                viewportHeight = scroller.clientHeight || 400;
            }
            var rows = Math.ceil(list.length / cols) || 1;
            spacer.style.height = Math.max(1, rows * rowH - gap + pad * 2) + 'px';
            // 顺手把滚动位置也读一次（此处已经在读布局，多读一个属性不再额外付代价），
            // 之后滚动路径就可以完全不碰布局属性。
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
                // P0-4：只有尺寸可能变了才重量。滚动（每帧）走的是缓存值，
                // 不再触发同步布局。
                if (force === true || needsMeasure) measure();
                var colsChanged = prevCols !== cols || laidOutCols !== cols;
                laidOutCols = cols;

                // 换算到 container 坐标系：外层滚动位置减去顶部信息栏高度
                var scrollTop = Math.max(0, lastScrollTop - contentOffset);
                var firstRow = Math.max(0, Math.floor(scrollTop / rowH) - os);
                var lastRow = Math.ceil((scrollTop + viewportHeight) / rowH) + os;
                var start = firstRow * cols;
                var end = Math.min(list.length, (lastRow + 1) * cols);
                var i, el;

                // 列数变了（面板被拖动缩放）→ 已有节点位置全部失效，先重排
                if (colsChanged) {
                    nodes.forEach(function (node, idx) { place(node, idx); });
                }

                // 回收窗口外节点
                nodes.forEach(function (node, idx) {
                    if (idx < start || idx >= end) {
                        if (node.parentNode === zone) zone.removeChild(node);
                        release(node);
                        nodes.delete(idx);
                    }
                });

                // 复用已有节点 / 新建缺失节点
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
            // 在写 DOM 之前读一次滚动位置（此刻最不容易触发同步布局），
            // update() 里就不再读任何布局属性
            lastScrollTop = scroller.scrollTop || 0;
            schedule();
        };
        scroller.addEventListener('scroll', onScroll, { passive: true });

        // MINOR-21: 句柄要留着，destroy() 时才能断开
        var resizeObs = null;
        function onWinResize() { needsMeasure = true; schedule(); }
        try {
            if (typeof ResizeObserver === 'function') {
                resizeObs = new ResizeObserver(onWinResize);
                resizeObs.observe(container);   // 宽度变化 → 重算列数与单元格尺寸
                if (scroller !== container) resizeObs.observe(scroller);   // 高度变化 → 重算视口
            } else {
                window.addEventListener('resize', onWinResize);
            }
        } catch (e) {}

        update();
        return {
            update: update,                       // update(true) = 强制重量尺寸后重排
            measure: function () { measure(); },
            // 供测试/外部查询当前布局结果
            metrics: function () {
                return { cols: cols, cellW: cellW, cardH: cardH, rowH: rowH, pad: pad, gap: gap };
            },
            renderedCount: function () { return nodes.size; },
            // MINOR-21: 同一容器反复 new 会重复挂 ResizeObserver / 滚动监听。
            // 返回实例句柄，调用方替换列表前先 .destroy()。
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
                // P0-4：尺寸计算已改为「按需」—— 这里必须显式要求重量，
                // 不能再靠把 cols 置 0 来「触发」重算（那样 update 不测尺寸时会
                // 用 cols=0 去算行数，占位高度直接变成 Infinity）。
                update(true);
            }
        };
    };
    // ===== 面板最小化/恢复 =====
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

    // ===== 构建面板 =====
    // =========================================================================
    // 面板出入场动画：右缘抽屉滑入 + 内层错峰跟进
    //
    // 桌面端与移动端的面板形态完全不同（桌面是 420px 宽的右缘抽屉，移动端是整屏覆盖），
    // 所以两套参数分开，不能共用：
    //   桌面：位移 + 轻微由小放大（transform-origin 在右中 → 像沿右边沿展开）+ 错峰跟进
    //   移动：整屏纯位移擦入（不做缩放扩散、不做整屏淡入）
    //         · 缩放扩散：整屏缩到 .94 会把页面从「缩小一圈的框」里露出来，像缩放而不像抽屉
    //         · 整屏淡入：全屏元素淡入 = 整屏糊成一片；不淡入就只有一条干净的推进边
    //         · 移动端 DPR 常是桌面 2~3 倍，整屏 44px 背景模糊在滑动中每帧都要重新
    //           采样 + 模糊整个屏幕，这是移动端掉帧的主因（见 UI._panelGlassFreeze）
    //   位移与透明度分层计时 / 出场更短更利落 / 尊重 prefers-reduced-motion
    // =========================================================================
    UI._PANEL_TF_HIDE = 'translateX(100%) scale(.94)';
    UI._PANEL_TF_SHOW = 'translateX(0) scale(1)';
    UI._PANEL_EASE_IN = 'cubic-bezier(.22,1,.36,1)';
    UI._PANEL_EASE_OUT = 'cubic-bezier(.3,0,.6,1)';   // 收走：起步即有响应 → 中段加速 → 末段收敛
    // 移动端：整屏长距离，起步要柔和一些（否则 400px 距离在 0.1s 内冲完会像「砸」进来），
    // 中段走完、尾段轻落
    UI._PANEL_MOB_TF_HIDE = 'translate3d(100%,0,0)';
    UI._PANEL_MOB_TF_SHOW = 'translate3d(0,0,0)';
    UI._PANEL_MOB_EASE_IN = 'cubic-bezier(.34,.72,.34,1)';
    UI._PANEL_MOB_EASE_OUT = 'cubic-bezier(.4,0,.6,1)';
    UI._staggerAnims = [];

    UI._panelMob = function () { return U.isMobile(); };

    /* 面板的隐藏/就位 transform：桌面带缩放（右缘展开），移动端纯位移擦入 */
    UI._panelTf = function (hidden) {
        if (UI._panelMob()) return hidden ? UI._PANEL_MOB_TF_HIDE : UI._PANEL_MOB_TF_SHOW;
        return hidden ? UI._PANEL_TF_HIDE : UI._PANEL_TF_SHOW;
    };

    /* 内层错峰的参数档位：移动端更轻（小块、少位移、且让开滚动内容区） */
    UI._panelAnimProfile = function () {
        if (UI._panelMob()) {
            // start>0：整屏擦入时面板不淡入，所以等内容跟上来再显形，
            // 否则滑动途中会看到「一整块空玻璃」再长出内容
            return { dur: 220, step: 30, start: 170, lead: 8, skipBox: true, fadeOnly: false };
        }
        return { dur: 380, step: 45, start: 0, lead: 22, skipBox: false, fadeOnly: false };
    };

    /* 错峰总时长（n 为参与的块数）；用于合成层释放与卡住兜底的时间窗 */
    UI._panelWindowMs = function (n) {
        var p = UI._panelAnimProfile();
        return p.start + Math.max(0, n - 1) * p.step + p.dur;
    };

    /* 面板本体的过渡串；phase: in（入场）/ out（出场）/ drag（拖动中，去掉 left/top 以便跟手）*/
    UI._panelTransition = function (phase) {
        if (UI._panelMob()) {
            // 移动端：只动 transform。不淡透明度 → 全屏元素不糊，也不会「空面板先到」
            var mm = phase === 'out' ? '.28s ' + UI._PANEL_MOB_EASE_OUT : '.34s ' + UI._PANEL_MOB_EASE_IN;
            var ms = 'transform ' + mm
                + ', background-color .35s ease, color .35s ease, border-color .35s ease, box-shadow .35s ease';
            if (phase !== 'drag') ms += ', left .3s ease, top .3s ease';
            return ms;
        }
        var move, fade;
        if (phase === 'out') {
            move = '.34s ' + UI._PANEL_EASE_OUT;
            // 出场让透明度与位移接近同步（不像入场那样提前淡完），
            // 否则面板先「隐身」再滑走，用户根本看不到收起的过程
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

    /* 取消内层错峰动画（快速开关面板时避免残留动画与新动画叠加）*/
    UI._staggerCancel = function () {
        var list = UI._staggerAnims;
        if (!list) return;
        for (var i = 0; i < list.length; i++) {
            try { list[i].cancel(); } catch (e) {}
        }
        list.length = 0;
        if (UI._staggerTimer) { clearTimeout(UI._staggerTimer); UI._staggerTimer = null; }
    };

    /* 动画期间把面板提到独立合成层（内含背景模糊，不提升容易掉帧）；
       动画跑完立刻释放，避免长期占用合成层内存 */
    UI._panelPerf = function (on) {
        var panel = State.panel;
        if (!panel) return;
        try {
            if (on) {
                panel.style.willChange = UI._panelMob() ? 'transform' : 'transform, opacity';
                if (UI._perfTimer) clearTimeout(UI._perfTimer);
                // 用理论上限（12 块）估算，保证不早于真实的错峰动画结束
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

    /* 移动端滑动期间临时停用全屏背景模糊。
       面板在移动端是整屏的，44px backdrop-filter 在 transform 动画中每帧都要重新
       采样并模糊整个屏幕（再乘上 2~3 倍的 DPR），是移动端滑动掉帧的主因；
       桌面面板只有 420px 宽、DPR 通常也低，代价可接受，因此保留玻璃外观不动。
       停用期间用接近不透明的主题底色顶替（0.34s 的滑动里肉眼几乎无感），
       滑动结束立刻恢复玻璃 —— 底色有 .35s 过渡，所以恢复时不会「啪」地跳。 */
    // P0-5：原来这里写着 `if (!UI._panelMob() || ...) return;` —— 只对移动端生效。
    // 但桌面端 420px 面板的 blur(44px) 在滚动时同样要每帧重新采样整个面板区域，
    // 一样卡；而且这个函数现在的触发点不止「面板滑入滑出」，还有滚动
    // （见 buildPanel 里挂到 #_ms_box 的 scroll 监听）。
    // holdMs 用于「持续按住」语义：滚动期间每次滚动事件都会重置计时器，
    // 停下来约 holdMs 之后才恢复玻璃效果。
    UI._panelGlassFreeze = function (on, holdMs) {
        var panel = State.panel;
        if (UI._glassTimer) { clearTimeout(UI._glassTimer); UI._glassTimer = null; }
        if (!panel || !panel.classList) return;
        // 只有 ios27 用了 backdrop-filter；新拟物 / 粗野主义 / 终端都是实心底色，
        // 没有可停的实时模糊，直接返回。
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

    /* 内层错峰入场：phase 传 'cancel' 只做清理 */
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
            // 玻璃层自带流体动画，不参与错峰
            if (!el || typeof el.animate !== 'function') continue;
            if (el.classList && el.classList.contains('_ms_glass_layers')) continue;
            // 移动端让开滚动内容区：长列表整块参与动画要额外合成/重绘，
            // 而且它本来就是「内容跟上」里最重的那块，跳过它观感几乎无差、代价差很多
            if (prof.skipBox && el.id === '_ms_box') continue;
            // 滚动内容区位移小一些：长列表整块位移的重绘代价更高
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
        // 保险：万一动画被环境卡住（元素停在首帧 opacity:0），到点直接收掉动画，内容恢复可见。
        // 时间窗按本轮实际块数算出来，面板以后加区块也不会把最后一块截断。
        UI._staggerTimer = setTimeout(function () { UI._staggerCancel(); }, UI._panelWindowMs(n) + 120);
    };

    // Bug B 修复：tab 图标表原先只存在于 buildPanel 的局部作用域，
    // 而 refreshPanelTexts 切语言时只塞 label——zh-CN 的 'tabImg' 是纯文字 '图片'（没有 SVG），
    // 于是从 en 切回 zh 图标就没了，而且原本的两层 <span> 包装也被整块覆盖掉。
    // 把图标表提到 UI 层，两处共用，切语言时重新拼完整结构。
    UI._tabIconMap = {
        img: MS_CONFIG.ICONS.image, video: MS_CONFIG.ICONS.video, audio: MS_CONFIG.ICONS.audio,
        m3u8: MS_CONFIG.ICONS.stream, translate: MS_CONFIG.ICONS.book, cookie: MS_CONFIG.ICONS.cookie,
        storage: MS_CONFIG.ICONS.package, settings: MS_CONFIG.ICONS.settings, plugins: MS_CONFIG.ICONS.plug
    };

    // tab 文案：语言表里 tabImg/tabVideo… 的取值不统一——zh-CN 是纯文字，
    // en-US / ja-JP / ko-KR 却把 SVG 一起拼进去了。图标现在统一由 UI._tabIconMap 提供，
    // 所以这里必须把语言值里的 SVG 剥掉，否则 en 下会出现两个图标。
    UI._tabLabel = function (key) {
        var langKey = 'tab' + key.charAt(0).toUpperCase() + key.slice(1);
        var raw = LANG.t(langKey);
        if (!raw || raw === langKey) return '';
        // 剥掉语言值里可能内嵌的 SVG（当前 ICONS 都是成对标签，但自闭合写法也要兜住）
        return String(raw)
            .replace(/<svg[\s\S]*?<\/svg>/gi, '')
            .replace(/<svg[^>]*\/>/gi, '')
            .trim();
    };

    // tab 内部结构（图标 + 文字）统一由这里生成，避免创建与刷新两条路径各拼一套
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
        // 移动端整屏面板：用 top:0 + bottom:0 定高，不用 100vh —— 移动浏览器的地址栏
        // 会改变「动态视口」，100vh 会让面板在滑动途中被重新定尺寸（表现为跳一下）
        var mobH = isMob ? 'max-height:none;' : hStyle;
        var tfOrigin = isMob ? '' : 'transform-origin:100% 50%;';
        // 移动端不做整屏淡入（全屏透明淡入会糊成一片），初始就是不透明，靠位移入场
        var initOpacity = isMob ? '1' : '0';
        State.panel.style.cssText = 'position:fixed;' + posStyle + mobH + 'width:' + w + 'px;background:' + c.bg + ';color:' + c.txt + ';border-radius:' + (isMob ? '0' : '16px') + ';box-shadow:-30px 0 60px rgba(0,0,0,.35);display:none;flex-direction:column;overflow:hidden;z-index:2147483645;' + tfOrigin + 'transform:' + UI._panelTf(true) + ';opacity:' + initOpacity + ';transition:' + UI._panelTransition('in') + ';font-family:system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;';

        // Header
        // Header
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

        // 标题栏拖动移动面板（桌面端）
        if (!isMob) {
            hd.style.cursor = 'move';
            var headerDragging = false, headerStartX = 0, headerStartY = 0, panelStartX = 0, panelStartY = 0;
            hd.addEventListener('mousedown', function (e) {
                if (e.target === closeBtn || e.target === minBtn) return;
                headerDragging = true;
                headerStartX = e.clientX; headerStartY = e.clientY;
                var rect = State.panel.getBoundingClientRect();
                panelStartX = rect.left; panelStartY = rect.top;
                // 拖动中：过渡里去掉 left/top，面板才会跟手
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

        // Tabs
        var tabBar = document.createElement('div');
        tabBar.id = '_ms_tabs';
        tabBar.style.cssText = 'display:flex;gap:4px;padding:8px 10px;background:' + c.bg2 + ';border-bottom:1px solid ' + c.border + ';overflow-x:auto;flex-shrink:0;transition: background-color 0.3s, color 0.3s;';
        // Bug B：图标表已提到 UI._tabIconMap，此处不再保留第二份（两份并存迟早走偏）
        // 文案一律走 UI._tabLabel（已剥掉语言表里内嵌的 SVG），图标由 _tabInnerHtml 统一补
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

        // 搜索栏
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

        // 高级筛选按钮
        var filterWrap = document.createElement('div');
        filterWrap.id = '_ms_filter';
        filterWrap.style.cssText = 'padding:4px 12px;background:' + c.bg2 + ';border-bottom:1px solid ' + c.border + ';display:none;transition: background-color 0.3s, color 0.3s;';
        var filterBtn = document.createElement('button');
        filterBtn.textContent = LANG.t('advFilter');
        filterBtn.style.cssText = 'padding:6px 12px;border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:12px;font-weight:600;cursor:pointer;';
        filterBtn.addEventListener('click', function () { UI.showFilterDialog(); });
        filterWrap.appendChild(filterBtn);
        State.panel.appendChild(filterWrap);

        // 进度条（下载时显示，点击打开队列详情）
        var progressWrap = document.createElement('div');
        progressWrap.id = '_ms_progress';
        progressWrap.style.cssText = 'padding:8px 12px;background:' + c.bg2 + ';border-bottom:1px solid ' + c.border + ';display:none;cursor:pointer;transition: background-color 0.3s, color 0.3s;';
        progressWrap.title = '点击查看下载队列';
        // 进度条原来写死 MS_CONFIG.COLORS.primary/primary2（默认靛蓝），切配色后不跟随
        progressWrap.innerHTML = '<div style="font-size:12px;color:' + c.sub + ';margin-bottom:4px;">' + LANG.t('dlProgress') + '</div><div style="height:8px;background:' + c.bg3 + ';border-radius:4px;overflow:hidden;"><div id="_ms_progress_bar" style="height:100%;background:linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ');width:0%;transition:width .3s;"></div></div><div id="_ms_progress_text" style="font-size:11px;color:' + c.sub + ';margin-top:4px;">0 / 0</div>';
        progressWrap.addEventListener('click', function () { UI.showDownloadQueue(); });
        State.panel.appendChild(progressWrap);

        // 内容区
        var box = document.createElement('div');
        box.id = '_ms_box';
        box.style.cssText = 'flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;background:' + c.bg + (isMob ? ';padding-bottom:env(safe-area-inset-bottom);' : '') + ';transition: background-color 0.3s, color 0.3s;';
        box.innerHTML = '<div style="padding:80px 20px;text-align:center;color:' + c.sub + ';font-size:14px;">' + LANG.t('clickTabScan') + '</div>';
        var _boxScrollTimer = null;
        box.addEventListener('scroll', function () {
            UI.pauseMO();
            if (_boxScrollTimer) clearTimeout(_boxScrollTimer);
            _boxScrollTimer = setTimeout(function () { UI.resumeMO(); }, 300);
            // P0-5：滚动期间把液态玻璃换成不透明底（桌面端同样生效）。
            // 挂在常驻的 #_ms_box 上，只绑一次；240ms 内没有新的滚动事件就自动恢复。
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

        // 底部栏
        var footer = document.createElement('div');
        footer.id = '_ms_footer';
        footer.style.cssText = 'flex-shrink:0;padding:' + (isMob ? '10px 14px calc(10px + env(safe-area-inset-bottom))' : '10px 14px') + ';background:' + c.bg + ';border-top:1px solid ' + c.border + ';display:none;transition: background-color 0.3s, color 0.3s;';
        State.panel.appendChild(footer);

        // 拖动调整宽度
        if (!isMob) {
            var dragBar = document.createElement('div');
            dragBar.style.cssText = 'position:absolute;left:0;top:0;bottom:0;width:6px;cursor:ew-resize;background:transparent;z-index:10;';
            var dragStartX = 0, dragStartW = 0, draggingPanel = false;
            dragBar.addEventListener('mousedown', function (e) { draggingPanel = true; dragStartX = e.clientX; dragStartW = State.panel.offsetWidth; e.preventDefault(); });
            document.addEventListener('mousemove', function (e) { if (!draggingPanel) return; var delta = dragStartX - e.clientX; var newW = Math.max(340, Math.min(900, dragStartW + delta)); State.panel.style.width = newW + 'px'; });
            document.addEventListener('mouseup', function () { if (draggingPanel) { draggingPanel = false; State.config.panelWidth = State.panel.offsetWidth; State.save(); } });
            State.panel.appendChild(dragBar);

            // 拖动调整高度
            var hDragBar = document.createElement('div');
            hDragBar.style.cssText = 'position:absolute;left:0;right:0;bottom:0;height:6px;cursor:ns-resize;background:transparent;z-index:10;';
            var dragStartY2 = 0, dragStartH = 0, draggingH = false;
            hDragBar.addEventListener('mousedown', function (e) { draggingH = true; dragStartY2 = e.clientY; dragStartH = State.panel.offsetHeight; e.preventDefault(); });
            document.addEventListener('mousemove', function (e) { if (!draggingH) return; var delta = e.clientY - dragStartY2; var newH = Math.max(300, Math.min(window.innerHeight - 20, dragStartH + delta)); State.panel.style.height = newH + 'px'; State.panel.style.maxHeight = 'none'; });
            document.addEventListener('mouseup', function () { if (draggingH) { draggingH = false; State.config.panelHeight = State.panel.offsetHeight; State.save(); } });
            State.panel.appendChild(hDragBar);

            // 右下角对角线缩放
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
        // iOS 27 液态玻璃：激活态样式交给 CSS（!important），这里只标记状态
        btn.setAttribute('data-active', active ? '1' : '0');
        var bg, color, shadow;
        if (active) {
            // 激活态原来硬编码靛蓝（#6366f1 / #8b5cf6 / rgba(99,102,241,...)），
            // 切到「玫瑰红」「青绿」等配色后 tab 仍是靛蓝 —— 与卡片、按钮不一致。
            // 统一走当前配色。
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
        UI._moConnect();                 // P0-3：面板打开才订阅 DOM 变更
        UI._glassIdle(false);
        if (!U.isMobile() && State.config.panelMinimized) {
            UI.minimizePanel();
        } else {
            var mob = UI._panelMob();
            State.panel.style.display = 'flex';
            if (wasOpen) {
                // 已经开着（例如切标签/快捷下载重复调用）：不重播入场，免得「闪一下又滑一遍」
                State.panel.style.transform = UI._panelTf(false);
                State.panel.style.opacity = '1';
            } else {
                State.panel.style.transition = UI._panelTransition('in');
                State.panel.style.transform = UI._panelTf(true);
                if (!mob) State.panel.style.opacity = '0';   // 移动端只做位移擦入，不淡全屏
                UI._panelPerf(true);
                UI._panelGlassFreeze(true);                  // 滑动期间停掉背景模糊（含桌面端）
                requestAnimationFrame(function () {
                    if (!State.panelOpen || !State.panel) return;   // 入场途中被关掉就不再播放
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
        UI._moDisconnect();              // P0-3：面板关了就没有渲染目标，订阅一并摘掉
        UI._glassIdle(true);
        if (State.selectionMode && !State.config.persistSelection) Selection.exit();
        // 停止面板内正在播放的音视频预览
        try {
            var mediaEls = State.panel.querySelectorAll('video, audio');
            for (var i = 0; i < mediaEls.length; i++) {
                try { mediaEls[i].pause(); } catch (e) {}
            }
        } catch (e) {}
        // 清理渲染节流计时器 / 待执行的 rAF 回调
        // 性能 10：_timer 现在可能是 rAF id，必须走 _cancel 才能正确中断
        try {
            if (State._renderThrottled) {
                if (State._renderThrottled._cancel) State._renderThrottled._cancel();
                else if (State._renderThrottled._timer) {
                    clearTimeout(State._renderThrottled._timer);
                    State._renderThrottled._timer = null;
                }
            }
        } catch (e) {}
        UI._staggerCancel();                                  // 入场动画没播完就被关掉时一并收掉
        UI._panelPerf(true);
        UI._panelGlassFreeze(true);                            // 滑出期间同样停掉背景模糊
        State.panel.style.transition = UI._panelTransition('out');
        State.panel.style.transform = UI._panelTf(true);
        // 移动端保持不透明滑出：全屏元素淡出同样会「糊」「看不清收起的动作」
        if (!UI._panelMob()) State.panel.style.opacity = '0';
        if (State.minimizedBar) State.minimizedBar.style.display = 'none';
        setTimeout(function () {
            if (!State.panelOpen && State.panel) {
                State.panel.style.display = 'none';
                UI._panelPerf(false);        // 面板已隐藏，顺手把合成层提示清掉
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
        }

        var box = document.getElementById('_ms_box');
        if (!box) { renderTab(); return; }
        // 22：原来每次切标签都无条件 box.scrollTop = 0 —— 只是去看了下别的标签、
        // 再切回来，列表就被拉回顶部，用户得重新往下翻（图片列表几百条时很难受）。
        // 现在按标签各自记住滚动位置，切回时恢复。
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
                // renderMedia 内部会自己恢复一份滚动位置；这里再把非媒体页
                // （翻译 / 设置 / Cookie 等）的位置也一并还原
                box.scrollTop = restoreTop;
                box.style.opacity = '1';
                box.style.pointerEvents = 'auto';
            });
        });
    };

    // ===== 进度更新 =====
    UI.updateProgress = function (prog) {
        var bar = document.getElementById('_ms_progress_bar');
        var txt = document.getElementById('_ms_progress_text');
        if (!bar || !txt) return;
        var pct = prog.total > 0 ? (prog.done / prog.total * 100) : 0;
        bar.style.width = pct.toFixed(1) + '%';
        txt.textContent = prog.done + ' / ' + prog.total + '（失败 ' + prog.failed + '）· ' + (prog.speed > 0 ? prog.speed.toFixed(1) + ' 项/秒' : '') + ' · 预计剩余 ' + U.formatTime(prog.eta);
    };

    // ===== 下载队列详情弹窗 =====
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
            function closeQueueOverlay() {
                clearInterval(timer);
                if (overlay.parentNode) overlay.remove();
                document.removeEventListener('keydown', escQueue);
            }
            function escQueue(e) { if (e.key === 'Escape') closeQueueOverlay(); }
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
            var timer = setInterval(render, 500);

            var escHandler = function (e) {
                if (e.key === 'Escape') {
                    clearInterval(timer);
                    try { overlay.remove(); } catch (err) {}
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        } catch (e) {
            LOG.warn('showDownloadQueue error:', e);
        }
    };

    // ===== 媒体渲染（使用虚拟列表）=====
    // 媒体卡片统一事件委托：原来每张卡片挂 6 个监听器（100 张卡片 = 600+ 监听器），
    // 改为在网格容器上各挂一次，靠 data-url / data-idx 反查目标。
    UI._bindMediaGrid = function (grid, kind, list) {
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
                Selection._updateCardMark(list[i]);
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

    // MINOR-21 补完：虚拟列表句柄的唯一持有者，销毁是幂等的
    UI._vlist = null;
    UI._destroyVirtualList = function () {
        if (UI._vlist && U.isFn(UI._vlist.destroy)) {
            try { UI._vlist.destroy(); } catch (e) { LOG.warn('销毁虚拟列表失败:', e); }
        }
        UI._vlist = null;
    };

    UI.renderMedia = function (kind) {
        if (kind !== 'img' && kind !== 'video' && kind !== 'audio' && kind !== 'm3u8') return;
        var box = document.getElementById('_ms_box');
        if (!box) return;
        var scrollTop = box.scrollTop;
        State._lastSelIdx = null;
        State._lastSelState = false;
        var c = UI.colors();
        var all = State.listFor(kind);

        // 按大小筛选（使用 metaCache）
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

        // 关键词筛选
        var kw = State.searchKeyword;
        var kwList = kw ? list.filter(function (u) { return u.toLowerCase().indexOf(kw) !== -1; }) : list;

        // 视频链接卡片列表
        var vLinkList = [];
        if (kind === 'video') {
            vLinkList = kw ? State.videoLinks.filter(function(v) {
                return v.title.toLowerCase().indexOf(kw) !== -1 || v.url.toLowerCase().indexOf(kw) !== -1;
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

        // MINOR-21 补完：光有 destroy() 没用，调用方必须真的调。
        // box.innerHTML 重新赋值会把旧的 container 整个丢弃，但 VirtualList 内部挂着
        // ResizeObserver 与 window resize 监听——它们不会因为 DOM 被移除而自动释放，
        // 每次重渲染就累加一份（切标签、改筛选、点刷新都会走这里）。
        UI._destroyVirtualList();

        // 顶部信息栏 + 筛选 + 批量按钮
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

        // 视频链接区域
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
            var cardMinWidth = isMobile ? '100%' : 'minmax(160px,1fr)';
            // 性能 7：这两个变量原来叫 gridCols / gridGap，和下面媒体网格的
            // 同名变量（而且是「字符串 vs 数字」两种类型）撞车 —— 全靠 var 提升
            // 侥幸能跑，任何一次调整声明顺序都可能让 vLink 网格拿到数字、
            // 或者让媒体网格拿到 CSS 字符串。改名隔离。
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
                    { icon: MS_CONFIG.ICONS.arrowRight, label: '预览视频', action: function() { VideoLinkPreview.preview(vData.url); } },
                    { icon: MS_CONFIG.ICONS.copy, label: '复制链接', action: function() { copyText(vData.url); } },
                    { icon: MS_CONFIG.ICONS.download, label: '下载视频', action: function() { VideoLinkPreview.preview(vData.url); } },
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
                    // N2: cover 来自页面 og:image，含引号会截断属性（必须 escapeAttr）。
                    // Bug A 修复：这行说明原来被写在单引号字符串内部——'<img src="' + ... + '"   /* N2: ... */ loading=...'——
                    // 因为前后都有 + 拼接符，所以不算语法错误，但整段注释文字会被原样输出进 HTML，
                    // 浏览器会把块注释起始符当成属性名、N2: 当成另一个属性，挂上一堆垃圾属性，
                    // 注释内容还会泄漏到页面源码里。注释必须留在 JS 层面。
                    // （此处刻意不写出该符号本身，避免下游按文本处理的工具把这一行误判成块注释开端）
                    vCoverHtml = '<img src="' + SEC.escapeAttr(vItem.cover) + '" loading="lazy" style="width:100%;height:' + coverHeight + ';object-fit:cover;display:block;" onerror="var d=document.createElement(\'div\');d.style.cssText=\'width:100%;height:' + coverHeight + ';background:linear-gradient(135deg,#1e293b,#334155);display:flex;align-items:center;justify-content:center;color:#fff;font-size:' + (isMobile ? '36px' : '24px') + ';\';d.innerHTML=\'<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>\';this.parentNode.replaceChild(d,this);">';
                } else {
                    var iconSize = isMobile ? '36px' : '24px';
                    vCoverHtml = '<div style="width:100%;height:' + coverHeight + ';background:linear-gradient(135deg,#1e293b,#334155);display:flex;align-items:center;justify-content:center;color:#fff;font-size:' + iconSize + ';"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg></div>';
                }
                var isResolved = UI._vlinkResolved[vItem.url];
                var resolveBtnText = isResolved ? '已解析' : '解析';
                var resolveBtnColor = isResolved ? '#10b981' : '#8b5cf6';
                vCard.innerHTML = vCoverHtml +
                    '<div style="padding:' + cardPadding + ';">' +
                        // 遗留1：title 来自页面 <a> 的 textContent/title，siteName 理论上也可能被站点文案污染，
                        // 两者都过一遍转义；siteIcon 是内置的 SVG 常量，绝不能再转义（会把 SVG 打坏）。
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
                        VideoLinkPreview.preview(vData.url);
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

        // 使用虚拟网格（超过 100 条时）
        var useVirtual = kwList.length > 100;
        var container = document.createElement('div');
        container.style.cssText = 'flex:1;overflow-y:auto;position:relative;';
        box.appendChild(container);

        // 网格尺寸参数：两条路径（虚拟 / 非虚拟）必须一致，否则滚动到 100 张前后布局会跳变
        var mediaGridGap = isMobile ? 10 : 8;
        var mediaGridPad = isMobile ? 12 : 10;
        var mediaGridCols = isMobile ? 2 : 0;   // 0 = 按容器宽度自适应
        // 缩略图之下的文字区高度：内边距(上下) + 标题最多两行 + 卡片边框
        var gridTitleBlock = isMobile ? (8 * 2 + 56 + 2) : (6 * 2 + 48 + 2);

        if (useVirtual) {
            // MINOR-21 补完：留下句柄，下次渲染（或面板重建）时显式销毁
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
                // 关键：#_ms_box 才是滚动容器（container 上的 flex:1 因为父级不是 flex 失效）
                scrollParent: box
            });
        } else {
            var grid = document.createElement('div');
            var mediaGridColsCss = isMobile ? 'grid-template-columns:repeat(2,1fr);' : 'grid-template-columns:repeat(auto-fill,minmax(120px,1fr));';
            var mediaGridGapCss = 'gap:' + mediaGridGap + 'px;';
            var mediaGridPadCss = 'padding:' + mediaGridPad + 'px;';
            grid.style.cssText = 'display:grid;' + mediaGridColsCss + mediaGridGapCss + mediaGridPadCss;
            // 一次性拼好整段 HTML 再赋值：避免 N 次 createElement + 解析 + append（触发多次布局）
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
            // 虚拟网格是按外层滚动位置决定渲染哪些行的：新的列表实例创建时
            // box.scrollTop 还是 0，必须在这里把窗口同步到恢复后的位置，
            // 否则重渲染（切筛选/切标签）后会先闪一下第一屏再跳回去。
            // update(true)：这里刚把 box.scrollTop 设回去，必须重量一次
            // （同时刷新内部缓存的滚动位置），否则渲染窗口还停在旧位置。
            if (UI._vlist && UI._vlist.update) UI._vlist.update(true);
        });

        // 注意：真正的滚动容器是 #_ms_box（box），container 自身不会滚动
        // （它上面的 flex:1 因为父级不是 flex 容器而失效，高度被内容撑开）。
        // 原先把这两个监听挂在 container 上 → 永远不会触发：
        //   · 视频缩略图只会在首次渲染后加载一批，滚动时新进入视口的卡片永远拿不到缩略图；
        //   · vLink 卡片的「滚动期间暂停动画」优化从未生效。
        // box 是常驻节点，所以每次重渲染前必须先摘掉上一轮的处理函数，否则会不断累加。
        function rebindBoxScroll(key, handler) {
            var prev = UI[key];
            if (prev) { try { box.removeEventListener('scroll', prev); } catch (e) {} }
            UI[key] = handler;
            box.addEventListener('scroll', handler, { passive: true });
        }

        // 26：从 video 切到别的标签后，_thumbScrollHandler 原本只在 kind === 'video'
        // 那一支里被替换 —— 切走后旧的处理器仍留在常驻的 #_ms_box 上，
        // 每次滚动都在跑「加载可见视频缩略图」，而此刻列表里根本没有视频卡。
        // 这里在渲染前无条件把两个滚动处理器都摘掉，之后再按需重绑。
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

        requestAnimationFrame(function () {
            box.scrollTop = scrollTop;
        });
    };

    // 辅助函数：绑定筛选按钮
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

    // 辅助函数：绑定批量操作按钮
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
                // MINOR-26: iOS27 下 ._ms_card 带 `box-shadow: ... !important`，
                // 普通内联阴影会被彻底盖掉 → 定位高亮环等于没画。
                // 内联同样标 important（内联 important 优先级高于作者 important），
                // 并在动画结束后 removeProperty，避免把卡片常态阴影钉死。
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

    // ===== m3u8 Tab（特殊渲染）=====
    UI.renderM3u8 = function () {
        var box = document.getElementById('_ms_box');
        if (!box) return;
        var c = UI.colors();
        var list = State.m3u8;
        var kw = State.searchKeyword;
        if (kw) list = list.filter(function (u) { return u.toLowerCase().indexOf(kw) !== -1; });

        box.innerHTML = '<div style="padding:10px 14px;font-size:13px;color:' + c.sub + ';border-bottom:1px solid ' + c.border + ';background:' + c.bg2 + ';">' + LANG.t('m3u8Title', {n: list.length}) + '</div>';

        if (list.length === 0) {
            box.innerHTML += '<div style="padding:60px 20px;text-align:center;color:' + c.sub + ';font-size:14px;">' + LANG.t('noM3u8') + '</div>';
            UI.renderFooter('m3u8', []);
            return;
        }

        // m3u8 列表（显示详细信息）
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
                '<button data-op="download" data-url="' + SEC.escapeAttr(url) + '" style="padding:8px 12px;border:none;border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:12px;font-weight:600;cursor:pointer;flex:1;">' + LANG.t('dlMerge') + '</button>' +
                '<button data-op="preview" data-url="' + SEC.escapeAttr(url) + '" style="padding:8px 12px;border:none;border-radius:8px;background:linear-gradient(135deg,#0ea5e9,#6366f1);color:#fff;font-size:12px;font-weight:600;cursor:pointer;flex:1;">' + LANG.t('preview') + '</button>' +
                '<button data-op="script" data-url="' + SEC.escapeAttr(url) + '" style="padding:8px 12px;border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:12px;font-weight:600;cursor:pointer;flex:1;">' + LANG.t('genScriptBtn') + '</button>' +
                '<button data-op="detail" data-url="' + SEC.escapeAttr(url) + '" style="padding:8px 12px;border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:12px;font-weight:600;cursor:pointer;">' + LANG.t('detailBtn') + '</button>' +
                '</div>';
            // 绑定按钮事件
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

    // 根据 URL 查找页面上对应的 MediaStream video 元素
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

    // ===== m3u8 详情弹窗 =====
    UI.previewM3u8 = function (url) {
        try {
            var c = UI.colors();
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:2147483650;padding:20px;';
            var modal = document.createElement('div');
            modal.style.cssText = 'max-width:600px;width:100%;background:' + c.bg + ';color:' + c.txt + ';border-radius:16px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.5);';

            modal.innerHTML = '<div style="font-size:16px;font-weight:700;margin-bottom:12px;">' + LANG.t('m3u8Detail') + '</div>' +
                '<div style="background:' + c.bg2 + ';padding:12px;border-radius:10px;font-size:12px;color:' + c.sub + ';word-break:break-all;margin-bottom:16px;font-family:monospace;">' + SEC.escapeHtml(url) + '</div>' +   // N1: URL 含 < 时会被当成标签开头，破坏整个弹窗结构
                '<div id="_ms_m3u8_info" style="padding:16px;background:' + c.bg2 + ';border-radius:10px;margin-bottom:16px;">' + LANG.t('parsing') + '</div>' +
                '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
                '<button id="_ms_m3u8_dl" style="flex:1;min-width:120px;padding:12px;border:none;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:14px;font-weight:600;cursor:pointer;">' + LANG.t('dlMerge') + '</button>' +
                '<button id="_ms_m3u8_script" style="flex:1;min-width:120px;padding:12px;border:none;border-radius:10px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:14px;font-weight:600;cursor:pointer;">' + LANG.t('genScriptBtn') + '</button>' +
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

            // 解析 m3u8
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
                                    /* N1: label/resolution/keyMethod 都来自远端 m3u8 文本（攻击者可控），与 url 同一注入类 */
                                    '<b>' + SEC.escapeHtml(parsed.streams[i].label) + '</b> · ' + SEC.escapeHtml(parsed.streams[i].resolution) + ' · ' + U.formatSize(parsed.streams[i].bandwidth) + '/s' +
                                    '</div>';
                            }
                        } else {
                            html += '<div style="font-size:12px;color:' + c.sub + ';">' + LANG.t('segmentsInfo', {n: parsed.segments.length, t: U.formatTime(parsed.duration)}) + '</div>';
                            html += '<div style="font-size:12px;color:' + (parsed.encrypted ? '#ef4444' : '#10b981') + ';margin-top:6px;">' + (parsed.encrypted ? LANG.t('encrypted') : LANG.t('notEncrypted')) + (parsed.encrypted ? ' (' + SEC.escapeHtml(parsed.keyMethod) + ')' : '') + '</div>';
                        }
                        info.innerHTML = html;
                    }
                }
            };
            xhr.onerror = function () { var info = document.getElementById('_ms_m3u8_info'); if (info) info.innerHTML = '<div style="color:#ef4444;">' + LANG.t('parseFailNet') + '</div>'; };
            xhr.ontimeout = function () { var info = document.getElementById('_ms_m3u8_info'); if (info) info.innerHTML = '<div style="color:#ef4444;">' + LANG.t('parseFailTimeout') + '</div>'; };
            xhr.send();

            // 绑定按钮
            document.getElementById('_ms_m3u8_dl').addEventListener('click', function () {
                toast(LANG.t('startDl'));
                M3U8.downloadAndMerge(url, { quality: State.config.m3u8Quality }, null, function (data, err) {
                    // P1-9：这里原来弹的是 LANG.t('transFail')（「✕ 翻译失败」）——
                    // m3u8 下载失败却提示翻译失败，用户对不上号。改用专有的 m3u8Fail。
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

    // ===== 媒体预览弹窗（P1-1）=====
    UI.previewMedia = function (url, kind) {
        try {
            var c = UI.colors();
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:2147483650;padding:20px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);';
            var modal = document.createElement('div');
            modal.style.cssText = 'max-width:min(92vw,900px);max-height:92vh;background:' + c.bg + ';color:' + c.txt + ';border-radius:18px;padding:18px;box-shadow:0 30px 80px rgba(0,0,0,.6);overflow:auto;animation:msfade .2s ease-out;';

            // hls.js 实例清理
            var hlsInstance = null;
            function cleanupPreview() {
                if (hlsInstance) { try { hlsInstance.destroy(); } catch(e) {} hlsInstance = null; }
            }

            // 头部
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

            // 媒体预览区域
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
                    // 主动提取封面
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

                function initHls() {
                    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
                        hlsInstance = new Hls({
                            xhrSetup: function(xhr, u) {
                                xhr.setRequestHeader('Referer', window.location.href);
                                xhr.setRequestHeader('User-Agent', navigator.userAgent);
                            }
                        });
                        hlsInstance.loadSource(url);
                        hlsInstance.attachMedia(v);
                        hlsInstance.on(Hls.Events.ERROR, function(event, data) {
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
                } else if (typeof Hls !== 'undefined' || (typeof window !== 'undefined' && window.Hls)) {
                    // typeof Hls 只能探到「当前脚本作用域可见」的 Hls；页面自己在用的
                    // 那个实例挂在 window.Hls 上，这里一并复用 —— 省一次 CDN 下载，
                    // 也绕开了「站点 CSP 不放行 jsdelivr」的情况。
                    if (typeof Hls === 'undefined' && typeof window !== 'undefined' && window.Hls) {
                        Hls = window.Hls;
                    }
                    initHls();
                } else {
                    var hlsScript = document.createElement('script');
                    // 固定版本：@latest 会在上游发新版时行为突变（甚至换 API），
                    // 而且部分站点的 CSP 只放行白名单域，离线时更是完全不可用。
                    // 1.5.17 是稳定版，接口与当前调用方式一致。
                    // 下面还会优先复用页面自己已经加载的 window.Hls（见 useHls 分支）。
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

            // URL 显示
            var urlBox = document.createElement('div');
            urlBox.style.cssText = 'background:' + c.bg2 + ';padding:10px 12px;border-radius:10px;font-size:11px;color:' + c.sub + ';word-break:break-all;margin-bottom:10px;font-family:SF Mono,Consolas,monospace;line-height:1.5;';
            urlBox.textContent = url;
            modal.appendChild(urlBox);

            // 元信息
            var metaBox = document.createElement('div');
            metaBox.style.cssText = 'background:' + c.bg2 + ';padding:10px 12px;border-radius:10px;font-size:12px;color:' + c.sub + ';margin-bottom:12px;line-height:1.7;';
            metaBox.innerHTML = '<span style="color:' + c.txt + ';">' + LANG.t('loadingMeta') + '</span>';
            modal.appendChild(metaBox);

            // 获取元信息
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

            // 操作按钮
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

            // 键盘快捷键
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

            modal.innerHTML = '<div style="font-size:16px;font-weight:700;margin-bottom:16px;">' + LANG.t('advFilterTitle') + '</div>' +
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
                // 重新渲染
                UI.renderMedia(State.tab);
            });
            document.getElementById('_ms_filter_close').addEventListener('click', function () { overlay.remove(); });
        } catch (e) {}
    };

    // ===== 底部栏 =====
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
        function btn(label, color, handler, flex, textColor) {
            var b = document.createElement('button');
            b.textContent = label;
            var bg = color.indexOf(',') > -1 && color.indexOf('gradient') === -1 ? 'linear-gradient(135deg,' + color + ')' : color;
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
            // ===== 选择模式：操作栏 =====
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
            });
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
            // 收藏 / 去重 / 分组 / 批量
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
            // 退出选择
            btn(LANG.t('close'), '#ef4444', function () {
                Selection.exit();
            });
        } else {
            // ===== 普通模式 =====
            var info2 = document.createElement('div');
            info2.style.cssText = 'font-size:12px;color:' + c.sub + ';margin-bottom:6px;text-align:center;';
            info2.textContent = LANG.t('selInfo', {sel: selCount, shown: displayList.length, total: total});
            ft.appendChild(info2);

            // 选择按钮（主入口）
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

    // ===== 底部菜单弹出层 =====
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

    // ===== 翻译 Tab =====
    UI.renderTranslate = function () {
        var box = document.getElementById('_ms_box');
        if (!box) return;
        var c = UI.colors();
        box.innerHTML = '';
        var container = document.createElement('div');
        container.style.cssText = 'padding:14px 16px;';

        var intro = document.createElement('div');
        intro.style.cssText = 'padding:14px 16px;border-radius:14px;background:' + c.bg2 + ';border:1px solid ' + c.border + ';margin-bottom:14px;font-size:12px;color:' + c.sub + ';line-height:1.8;';
        intro.innerHTML = '<div style="font-size:14px;font-weight:600;color:' + c.txt + ';margin-bottom:6px;">' + LANG.t('transTitle') + '</div>' +
            LANG.t('transIntro');
        container.appendChild(intro);

        // ===== 引擎选择 =====
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

        // ===== 语言选择 =====
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

        // ===== 输入区域 =====
        var input = document.createElement('textarea');
        input.placeholder = LANG.t('transInputPh');
        input.style.cssText = 'width:100%;min-height:130px;padding:10px 12px;border:1px solid ' + c.border + ';border-radius:10px;font-size:13px;line-height:1.6;background:' + c.bg + ';color:' + c.txt + ';font-family:inherit;box-sizing:border-box;resize:vertical;';
        container.appendChild(input);

        // ===== 操作按钮 =====
        var btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;gap:8px;margin-top:10px;margin-bottom:14px;flex-wrap:wrap;';
        function makeBtn(label, bg, handler, parent) {
            var b = document.createElement('button');
            b.innerHTML = label; b.style.cssText = 'flex:1;min-width:110px;padding:10px 12px;border:none;border-radius:10px;background:' + bg + ';color:#fff;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;';
            b.addEventListener('click', handler);
            (parent || btnRow).appendChild(b);
        }
        makeBtn(LANG.t('transBtn'), 'linear-gradient(135deg,#6366f1,#8b5cf6)', function () { doTranslate(false); });
        makeBtn(LANG.t('zhToEn'), '#f59e0b', function () { fromSel.value = 'zh-CN'; toSel.value = 'en'; State.config.translateFrom = 'zh-CN'; State.config.translateTo = 'en'; State.save(); doTranslate(false); });
        makeBtn(LANG.t('enToZh'), '#10b981', function () { fromSel.value = 'en'; toSel.value = 'zh-CN'; State.config.translateFrom = 'en'; State.config.translateTo = 'zh-CN'; State.save(); doTranslate(false); });
        makeBtn(LANG.t('clearBtn'), '#475569', function () { input.value = ''; output.textContent = LANG.t('transResultPh'); statusEl.textContent = ''; });
        container.appendChild(btnRow);

        // ===== 状态显示 =====
        var statusEl = document.createElement('div');
        statusEl.style.cssText = 'font-size:12px;color:' + c.sub + ';margin-bottom:8px;';
        container.appendChild(statusEl);

        // ===== 输出区域 =====
        var output = document.createElement('div');
        output.style.cssText = 'padding:14px 16px;border-radius:10px;background:' + c.bg2 + ';border:2px dashed ' + c.border + ';color:' + c.txt + ';font-size:14px;line-height:1.8;word-break:break-word;white-space:pre-wrap;min-height:80px;';
        output.textContent = LANG.t('transResultPh');
        container.appendChild(output);

        // ===== 结果操作按钮 =====
        var btnRow2 = document.createElement('div');
        btnRow2.style.cssText = 'display:flex;gap:8px;margin-top:10px;margin-bottom:18px;';
        makeBtn(LANG.t('copyResult'), '#6366f1', function () { copyText(output.textContent || ''); }, btnRow2);
        makeBtn(LANG.t('resultAsInput'), '#10b981', function () { if (output.textContent && output.textContent !== LANG.t('transResultPh')) input.value = output.textContent; }, btnRow2);
        makeBtn(LANG.t('speakBtn'), '#f59e0b', function () {
            if (output.textContent && output.textContent !== LANG.t('transResultPh')) {
                TranslateEngine.speak(output.textContent, toSel.value);
                toast(LANG.t('saved'));
            }
        }, btnRow2);
        container.appendChild(btnRow2);

        box.appendChild(container);

        // ===== 翻译执行函数 =====
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

    // ===== Cookie Tab =====
    UI.renderCookie = function () {
        var box = document.getElementById('_ms_box');
        if (!box) return;
        var c = UI.colors();
        box.innerHTML = '';
        var container = document.createElement('div');
        container.style.cssText = 'padding:12px 14px;';

        var btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;';
        function mkBtn(label, color, handler, flex) {
            var b = document.createElement('button');
            b.innerHTML = label;
            b.style.cssText = (flex ? 'flex:' + flex + ';' : 'flex:1;') + 'min-width:110px;padding:10px 12px;border:none;border-radius:10px;background:linear-gradient(135deg,' + color + ');color:#fff;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;';
            b.addEventListener('click', handler); btnRow.appendChild(b);
        }
        mkBtn(LANG.t('copyCookieStr'), '#6366f1,#8b5cf6', function () { try { copyText(document.cookie || '（空）'); } catch (e) { toast(LANG.t('readCookieFail'), '#ef4444'); } });
        mkBtn(LANG.t('copyJson'), '#10b981,#34d399', function () { var pairs = parseCookies(); copyText(JSON.stringify(pairs, null, 2)); });
        mkBtn(LANG.t('addCookie'), '#f59e0b,#fbbf24', function () {
            var name = prompt(LANG.t('cookieName'));
            if (!name) return;
            var val = prompt(LANG.t('cookieValue'));
            if (val == null) return;
            try { document.cookie = name + '=' + val + ';path=/;domain=' + location.hostname; toast(LANG.t('added')); UI.renderCookie(); } catch (e) { toast(LANG.t('addFail') + ': ' + e.message, '#ef4444'); }
        });
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
        });
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

    // ===== Storage Tab =====
    UI.renderStorage = function () {
        var box = document.getElementById('_ms_box');
        if (!box) return;
        var c = UI.colors();
        box.innerHTML = '';
        var container = document.createElement('div');
        container.style.cssText = 'padding:12px 14px;';

        var btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;';
        function mkBtn(label, color, handler) {
            var b = document.createElement('button');
            b.innerHTML = label;
            b.style.cssText = 'flex:1;min-width:110px;padding:10px 12px;border:none;border-radius:10px;background:linear-gradient(135deg,' + color + ');color:#fff;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;';
            b.addEventListener('click', handler); btnRow.appendChild(b);
        }
        mkBtn(LANG.t('exportLs'), '#6366f1,#8b5cf6', function () { var items = readStorage('ls'); copyText(JSON.stringify(items, null, 2)); });
        mkBtn(LANG.t('exportSs'), '#10b981,#34d399', function () { var items = readStorage('ss'); copyText(JSON.stringify(items, null, 2)); });
        mkBtn(LANG.t('addItem'), '#f59e0b,#fbbf24', function () {
            var k = prompt(LANG.t('keyName')); if (!k) return;
            var v = prompt(LANG.t('keyValue')); if (v == null) return;
            try { localStorage.setItem(k, v); toast(LANG.t('addToLs')); UI.renderStorage(); }
            catch (e) { toast(LANG.t('addFail') + ': ' + e.message, '#ef4444'); }
        });
        mkBtn(LANG.t('clearAll'), '#ef4444,#f87171', function () {
            if (!confirm(LANG.t('confirmClearStorage'))) return;
            try { localStorage.clear(); sessionStorage.clear(); toast(LANG.t('cleared')); UI.renderStorage(); }
            catch (e) { toast(LANG.t('clearFail') + ': ' + e.message, '#ef4444'); }
        });
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
        info.textContent = LANG.t('lsCount', {n: ls.length, m: ss.length});
        container.appendChild(info);

        function renderSection(title, items, scope) {
            if (items.length === 0) return;
            var h = document.createElement('div');
            h.style.cssText = 'font-weight:700;color:' + c.txt + ';margin:14px 0 6px;font-size:13px;';
            h.textContent = title + '（' + items.length + '）';
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
        renderSection(LANG.t('lsTitle'), ls, 'ls');
        renderSection(LANG.t('ssTitle'), ss, 'ss');

        box.appendChild(container);
    };

    // ===== 插件 Tab：市场 + 已安装 =====
    UI.renderPlugins = function () {
        var box = document.getElementById('_ms_box');
        if (!box) return;
        var c = UI.colors();
        var primary = MS_CONFIG.COLORS.primary;
        var primary2 = MS_CONFIG.COLORS.primary2;

        // 确保插件已从存储加载
        try { PluginManager.load(); } catch (e) { LOG.warn('PluginManager.load failed:', e); }

        var container = document.createElement('div');
        container.style.cssText = 'padding:12px 14px 20px;';

        // 子 Tab 切换栏
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

        // 统计条
        var statsBar = document.createElement('div');
        statsBar.style.cssText = 'font-size:12px;color:' + c.sub + ';margin-bottom:10px;padding:0 2px;';
        container.appendChild(statsBar);

        // 插件卡片列表容器
        var listWrap = document.createElement('div');
        listWrap.style.cssText = 'display:flex;flex-direction:column;gap:10px;';
        container.appendChild(listWrap);

        function makeCard(plugin, isInstalledView) {
            var card = document.createElement('div');
            card.style.cssText = 'padding:14px;border-radius:12px;background:' + c.bg2 + ';border:1px solid ' + c.border + ';';

            var top = document.createElement('div');
            top.style.cssText = 'display:flex;gap:12px;align-items:flex-start;margin-bottom:10px;';

            // 插件图标
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

            // 插件信息
            var info = document.createElement('div');
            info.style.cssText = 'flex:1;min-width:0;';

            var nameRow = document.createElement('div');
            nameRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:4px;';
            var nameEl = document.createElement('div');
            nameEl.style.cssText = 'font-size:14px;font-weight:700;color:' + c.txt + ';';
            nameEl.textContent = PluginManager.localName(plugin);
            nameRow.appendChild(nameEl);

            // 分类徽章
            var catBadge = document.createElement('span');
            catBadge.style.cssText = 'flex-shrink:0;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600;background:' + c.bg3 + ';color:' + c.sub + ';';
            catBadge.textContent = PluginManager.categoryLabel(plugin.category);
            nameRow.appendChild(catBadge);

            // 启用状态徽章（已安装视图）
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

            // 操作按钮
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
                // 市场视图：安装按钮
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
                // 已安装视图：启用/禁用 + 卸载
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
                    // 按安装时间倒序
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

    // ===== 设置 Tab =====
    // MINOR-25: 只刷新界面文案，不重建面板。
    // 语言切换只影响文字，重建整棵 DOM 会把拖拽位置 / 滚动位置 / 卡片渲染结果一起丢掉。
    UI.refreshPanelTexts = function () {
        // 语言切换会连带 UI.renderMedia 重渲染，句柄由 renderMedia 内部销毁，这里不必重复
        var panel = State.panel;
        if (!panel) return;
        try {
            // 标题栏
            var hd = panel.children && panel.children[0];
            if (hd) {
                var titleEl = hd.querySelector ? hd.querySelector('div') : null;
                if (titleEl) titleEl.textContent = LANG.t('appTitle');
            }
            // 标签页：优先用已有的样式重绘函数，保留激活态
            var tabBtns = panel.querySelectorAll('._ms_tab');
            for (var i = 0; i < tabBtns.length; i++) {
                var key = tabBtns[i].getAttribute('data-tab');
                if (!key) continue;
                var active = tabBtns[i].getAttribute('data-active') === '1';
                // 语言表里的键是 tabImg / tabVideo …（首字母大写）
                // 文案由 UI._tabLabel 统一提供（已剥掉语言表内嵌的 SVG，
                // 否则 en/ja/ko 下会和 _tabIconMap 的图标重复）
                var label = UI._tabLabel(key);
                if (!label) label = tabBtns[i].textContent || '';
                // Bug B 修复：必须重建「图标 + 文字」的完整两层结构。
                // 原来直接 innerHTML = label：zh-CN 的 label 是纯文字，图标会丢；
                // 而且会把原有的 <span style="display:inline-flex"> 包装打掉，整个 tab 栏视觉崩掉。
                tabBtns[i].innerHTML = UI._tabInnerHtml(key, label);
                if (typeof UI._applyTabStyle === 'function') UI._applyTabStyle(tabBtns[i], active);
            }
            // 搜索框占位文案
            var si = panel.querySelector ? panel.querySelector('#_ms_search input') : null;
            if (si && si.placeholder && LANG.t('searchPlaceholder') !== 'searchPlaceholder') si.placeholder = LANG.t('searchPlaceholder');
            // 当前标签页内容重新渲染（卡片里的按钮/提示文案）
            if (typeof UI.renderMedia === 'function') UI.renderMedia(State.tab);
            // 设置页文案
            if (State.tab === 'settings' && typeof UI.renderSettings === 'function') UI.renderSettings();
        } catch (e) { LOG.warn('刷新界面文案失败:', e); }
    };

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

        // 主题
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

        // 界面风格
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

        // 配色方案
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

        // 自定义配色
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

        // 下载文件名模板
        var tplInput = document.createElement('input');
        tplInput.type = 'text';
        tplInput.value = State.config.nameTpl;
        tplInput.style.cssText = 'width:100%;padding:8px 10px;border:1px solid ' + c.border + ';border-radius:8px;font-size:13px;background:' + c.bg + ';color:' + c.txt + ';box-sizing:border-box;';
        tplInput.addEventListener('change', function () { State.config.nameTpl = tplInput.value || '{域名}_{日期}_{序号}_{后缀}'; State.save(); toast(LANG.t('saved')); });
        container.appendChild(makeGroup('nameTpl', LANG.t('grpNameTpl'), tplInput));

        // 批量下载设置
        var confRow = document.createElement('div');
        confRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center;';
        // 性能 6：原来 numSetting 不带 parent 参数，直接 confRow.appendChild(row) ——
        // 隐式依赖「调用时外层正好是批量下载那一段」。结果 m3u8 的「分片并发」
        // 因为调用点在 m3u8 分组里却又被塞回了 confRow，UI 上跑到了「批量下载」组，
        // 用户在下载设置里改的其实是 m3u8 并发（属于功能 bug，不只是性能问题）。
        // 现在显式传 parent，行为不再取决于调用位置。
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

        // Aria2 RPC 推送设置
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

        // m3u8 设置
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
        // 性能 6（bug 修复）：归位到 m3u8 分组，不再跑到「批量下载」组里
        numSetting(segLabel, 'm3u8Concurrency', 1, 8, 1, m3u8Row);
        container.appendChild(makeGroup('m3u8', LANG.t('grpM3u8'), m3u8Row));

        // 自定义请求头（P1-4）
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

        // 日志级别（P2-2）
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

        // 其他操作
        var ob = document.createElement('div');
        ob.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';
        function mkOBtn(label, color, handler, flex) {
            var b = document.createElement('button');
            b.innerHTML = label;
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
        }, 1.3);
        mkOBtn(LANG.t('resetAll'), '#ef4444', function () {
            if (!confirm(LANG.t('confirmReset'))) return;
            State.resetConfig(); applyPanelThemeNow(); toast(LANG.t('resetDone')); UI.renderSettings();
        }, 1.2);
        container.appendChild(makeGroup('other', LANG.t('grpOther'), ob));

        // 界面语言
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
                    State.save(true);   // MINOR-20: 语言立即落盘（被强杀也记得住）
                    toast(LANG.t('saved')); 
                    // MINOR-25: 原来 remove() 整个面板再重建 —— 拖拽位置、滚动位置、
                    // 已渲染的卡片与选中态全部丢失，面板还会闪一下。
                    // 现在只刷新文案（标题栏 / 标签 / 底栏 / 设置页自身）。
                    UI.refreshPanelTexts();
                };
                langContainer.appendChild(lb);
            })(langs[li]);
        }
        container.appendChild(makeGroup('lang', LANG.t('grpLang'), langContainer));

        // 域名规则
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

        // 脚本市场 / 插件系统
        // 34：页面内状态原来直接挂在 UI 对象上（UI._settingsState.pluginTab），
        // 与「UI 是函数集合」的语义混在一起，也不便统一重置。
        // 统一收进 UI._settingsState（只放设置页的临时 UI 状态，不进持久化配置）。
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
                        metaEl.textContent = parser.apiUrl || parser.matchPattern;
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

        function resetParserForm() {
            parserEditingId = null;
            parserFormTitle.innerHTML = MS_CONFIG.ICONS.plus + ' ' + LANG.t('addParser');
            parserNameInp.value = '';
            parserMatchInp.value = '';
            parserApiInp.value = '';
            parserMethodSel.value = 'GET';
            parserDataPathInp.value = '';
            parserHeadersTa.value = '';
            parserEnabledCb.checked = true;
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
            parserEnabledCb.checked = parser.enabled !== false;
        }

        var parserFormBtns = document.createElement('div');
        parserFormBtns.style.cssText = 'display:flex;gap:8px;';
        var parserSaveBtn = document.createElement('button');
        parserSaveBtn.innerHTML = MS_CONFIG.ICONS.save + ' ' + LANG.t('ok');
        parserSaveBtn.style.cssText = 'flex:1;padding:8px 12px;border:none;border-radius:8px;background:linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ');color:#fff;font-size:12px;font-weight:600;cursor:pointer;';
        parserSaveBtn.onclick = function () {
            var name = parserNameInp.value.trim();
            var matchPattern = parserMatchInp.value.trim();
            var apiUrl = parserApiInp.value.trim();
            if (!matchPattern || !apiUrl) { toast(LANG.t('plsInputText'), '#f59e0b'); return; }
            var headers = {};
            try {
                if (parserHeadersTa.value.trim()) {
                    var h = JSON.parse(parserHeadersTa.value.trim());
                    if (h && typeof h === 'object' && !Array.isArray(h)) headers = h;
                }
            } catch (e) {
                toast('Headers JSON ' + LANG.t('fail'), '#ef4444'); return;
            }
            var obj = {
                name: name, matchPattern: matchPattern, apiUrl: apiUrl,
                method: parserMethodSel.value, dataPath: parserDataPathInp.value.trim(),
                headers: headers, enabled: parserEnabledCb.checked
            };
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

        // 视频封面选项
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

        // 自动更新检测
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
                    // 弹窗已由 showUpdatePopup 处理
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

        // 选择状态持久化
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

        // 快捷键设置
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

        // 资源历史
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

        // 下载历史
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

        var info = document.createElement('div');
        info.style.cssText = 'padding:12px;border-radius:10px;background:' + c.bg2 + ';font-size:11px;color:' + c.sub + ';line-height:1.8;text-align:center;';
        info.innerHTML = LANG.t('infoLine1') + '<br/>' + LANG.t('infoLine2');
        container.appendChild(info);

        box.appendChild(container);
    };

    // 即时应用主题与界面风格
    function applyPanelThemeNow() {
        if (!State.panel) return;
        var c = UI.colors();
        // 主题切换期间才打开全量过渡（切换结束立即摘掉，避免长期占用合成层）
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
    // FIX-07: 把主题应用函数注册到 State 上。
    // 必须放在函数体外面：原先是 applyPanelThemeNow 自己最后一行赋值，
    // 意味着「首次被调用之前」State._applyTheme 一直是 undefined，
    // 此时若系统主题变化，监听器拿不到钩子（配合上面的改动才真正闭环）。
    State._applyTheme = applyPanelThemeNow;

    // 性能 10：渲染防抖原为 400ms setTimeout —— 抓到资源到首屏要等 400ms，
    // 连续抓取时尾部每次再等 400ms，翻标签/滚动时明显「慢半拍」。
    // 改为「80ms 防抖 + requestAnimationFrame 合帧」：
    //   · 80ms 属于感知不到的量级，且足以把同一波抓取（一次 DOM 变更常触发
    //     十几个 MutationObserver 回调）合并成一次渲染
    //   · 真正执行放进 rAF：在浏览器下一次绘制前统一改 DOM，既不会出现中间态，
    //     也不会因为落在计时器队列尾部而在繁忙时被进一步拖后
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
        // 幂等：否则每次 State.init 都会再加一份 document 级 keydown 监听
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
                    Translator.autoTranslate(text, function (result, err) {
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

    // =========================================================================
    // ===== 模块 14：选中文字翻译浮窗
    // =========================================================================
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
                Translator.autoTranslate(text, function (result, err) {
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
    // =========================================================================
    // ===== 模块 15：初始化 + 轮询守护 + 动态内容适配
    // =========================================================================
    // 初始化幂等：入口在 document-end、load、多个 setTimeout、SPA 路由事件里都会触发，
    // 一次性工作（读配置 / 起扫描器 / 装 hook / 查更新）只做第一次，重复调用只补建 UI。
    State._booted = false;
    State.init = function () {
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

        // 可重复执行：页面（SPA）可能移除浮动按钮，这里做存在性补建
        try { UI.buildFloatBtn(); } catch (e) { LOG.warn('构建浮动按钮失败:', e.message); }

        return true;
    };

    // 配置防抖写入的兜底落盘：页面隐藏 / 卸载 / 进入后台前立即写一次，避免丢配置
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

    // SPA 路由变化重新触发
    try {
        window.addEventListener('hashchange', function () { setTimeout(State.init, 300); });
        window.addEventListener('popstate', function () { setTimeout(State.init, 300); });
        // 动态内容适配：监听 DOM 变化（MutationObserver）
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
        // P0-3：只在面板打开期间挂上。这个 observer 的产出（「发现新媒体元素 → 增量扫描」）
        // 全部依赖 State.panelOpen —— 面板没开时遍历一遍就丢掉，纯烧 CPU。
        // 而 subtree:true 挂在 documentElement 上，页面任何一处 DOM 变更都会进队列
        // （SPA 里几乎每帧都有），长会话下是最高的一项固定开销。
        // 面板打开/关闭由 UI._moConnect / UI._moDisconnect 控制（见 openPanel / closePanel）。
        UI._moConnect = function () {
            if (!_mo || _moConnected) return;
            try {
                _mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
                _moConnected = true;
            } catch (e) { LOG.warn('MutationObserver 挂载失败:', e); }
        };
        UI._moDisconnect = function () {
            if (!_mo || !_moConnected) return;
            _moConnected = false;
            try { _mo.disconnect(); } catch (e) {}
            if (_moResumeTimer) { clearTimeout(_moResumeTimer); _moResumeTimer = null; }
            _moPaused = false;
        };
        LOG.info('MutationObserver 已就绪（面板打开时挂载）');
        // 时序兜底：observer 是在文件末尾创建的，而面板可能在那之前就已经打开
        // （State.init → openPanel 走的是当时的空实现），这里补一次连接。
        if (State.panelOpen) UI._moConnect();
    } catch (e) { LOG.warn('MutationObserver 不可用:', e); }

    // 窗口 resize
    try {
        window.addEventListener('resize', U.throttle(function () {
            var b = UI._floatBtn || document.getElementById('_ms_float');
            if (!b) return;
            var x = parseFloat(b.style.left), y = parseFloat(b.style.top);
            if (!isNaN(x) && x > window.innerWidth - 66) b.style.left = (window.innerWidth - 66) + 'px';
            if (!isNaN(y) && y > window.innerHeight - 66) b.style.top = (window.innerHeight - 66) + 'px';
        }, 300));
    } catch (e) {}

    // 初始化 — document-end 时 body 已存在，直接执行
    State.init();

    // 兜底重试（SPA 页面可能延迟加载）
    // 性能 12：原来五个定时器各自独立注册，500/1500/3000ms 全都会无条件跑一遍
    // State.init。问题是页面刚打开时正是加载资源最忙的时候 —— 尤其 500ms 那一发
    // 几乎必然和首屏渲染撞车，白占主线程，还会因为 State.init 里要建面板 DOM
    // 而加重首屏卡顿。
    // 改成串行链 + requestIdleCallback：每次都在浏览器空闲时才尝试，
    // 且一旦 init 离上一次成功不足 minGap 就跳过，实际执行次数通常 < 5。
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

    // window.load 兜底（同样只在空闲时跑，避免和 load 事件后的资源收尾抢主线程）
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
