// ==UserScript==
// @name         媒体嗅探器 Media Sniffer Pro v1.0.6
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  图片/视频/音频/m3u8 抓取 · AES-128解密 · 分片合并 · 虚拟列表 · 进度可视化 · 跨域兜底 · Cookie/Storage · 翻译 · 元信息 · 高级筛选
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
    console.info('[MS] 脚本开始加载，版本:', '1.0.6');



    // =========================================================================
    // 🎨 全局配置（图标 / 颜色 / 尺寸 / 配色板）
    // =========================================================================
    var MS_CONFIG = {
        VERSION: '1.0.6',
        ICONS: {
            chevronLeft: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.2));"><polyline points="15 18 9 12 15 6"></polyline></svg>',
            play: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.25));"><polygon points="5 3 21 12 5 21 5 3"></polygon></svg>',
            music: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.25));"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
            target: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,.35));"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4" fill="#ffffff"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line></svg>',
            check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            film: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>'
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
    // 🏭 组件工厂（按钮 / 元素 / 卡片 / 最小化栏）
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
            var bar = this.el('div',
                'position:fixed;display:none;align-items:center;justify-content:center;width:' + MS_CONFIG.SIZES.minimizedBarW + 'px;height:' + MS_CONFIG.SIZES.minimizedBarH + 'px;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.35);cursor:pointer;z-index:2147483645;user-select:none;overflow:hidden;transition:transform .25s cubic-bezier(.16,1,.3,1), opacity .25s cubic-bezier(.16,1,.3,1), background-color .35s ease;',
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
            var primary = MS_CONFIG.COLORS.primary;
            var borderStyle = isSel ? '2px solid ' + primary : (inSelMode ? '1px dashed ' + primary : '1px solid ' + c.border);
            var shadow = isSel ? 'box-shadow:0 4px 12px rgba(99,102,241,.35);' : '';
            var nameFontSize = isMobile ? '13px' : '11px';
            var namePadding = isMobile ? '8px 10px' : '6px 8px';
            var nameMaxHeight = isMobile ? '56px' : '48px';
            var markSize = isMobile ? '28px' : '24px';
            var markFontSize = isMobile ? '16px' : '14px';
            var iconSize = isMobile ? '32px' : '28px';
            var thumbHtml = '';
            if (kind === 'img') {
                thumbHtml = '<img src="' + url + '" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;" onerror="this.style.display=\'none\';this.parentNode.style.background=\'' + MS_CONFIG.COLORS.darkGradientEnd + '\';">';
            } else if (kind === 'video') {
                var cached = UI._thumbCache[url];
                var grad = 'linear-gradient(135deg,' + MS_CONFIG.COLORS.darkGradientStart + ',' + MS_CONFIG.COLORS.darkGradientEnd + ')';
                if (cached) {
                    thumbHtml = '<img src="' + cached + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;" onerror="var d=document.createElement(\'div\');d.style.cssText=\'width:100%;height:100%;background:' + grad + ';display:flex;align-items:center;justify-content:center;color:' + MS_CONFIG.COLORS.white + ';font-size:' + iconSize + ';\';d.textContent=\'' + MS_CONFIG.ICONS.play + '\';this.parentNode.appendChild(d);this.remove();">';
                } else {
                    thumbHtml = '<div class="_ms_v_thumb" data-url="' + url + '" style="width:100%;height:100%;background:' + grad + ';display:flex;align-items:center;justify-content:center;color:' + MS_CONFIG.COLORS.white + ';font-size:' + iconSize + ';">' + MS_CONFIG.ICONS.play + '</div>';
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
            return '<div class="_ms_card" data-url="' + url + '" data-idx="' + idx + '" draggable="' + (inSelMode ? 'true' : 'false') + '" style="position:relative;border-radius:' + MS_CONFIG.SIZES.cardRadius + 'px;background:' + c.bg2 + ';overflow:hidden;cursor:pointer;' + borderStyle + shadow + ';">' +
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
    // 🧩 模块 1：核心工具 (Utils) + 日志系统
    // =========================================================================
    var U = {};
    U.VERSION = '1.0.6';
    U.toStr = Object.prototype.toString;
    U.isArr = Array.isArray || function (x) { return U.toStr.call(x) === '[object Array]'; };
    U.isStr = function (x) { return typeof x === 'string'; };
    U.isNum = function (x) { return typeof x === 'number' && !isNaN(x); };
    U.isFn = function (x) { return typeof x === 'function'; };
    U.now = function () { return Date.now(); };
    U.uid = function () { return 'u' + U.now().toString(36) + Math.random().toString(36).slice(2, 8); };

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
            var ctx = this, args = arguments, n = U.now();
            var rem = wait - (n - last);
            if (rem <= 0) { if (t) { clearTimeout(t); t = null; updateTimer(); } last = n; fn.apply(ctx, args); }
            else if (!t) { t = setTimeout(function () { last = U.now(); t = null; updateTimer(); fn.apply(ctx, args); }, rem); updateTimer(); }
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
    U.escHtml = function (s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    };

    // ===== 数组去重 =====
    U.uniq = function (arr) {
        var seen = {}, out = [];
        for (var i = 0; i < arr.length; i++) {
            if (!seen[arr[i]]) { seen[arr[i]] = 1; out.push(arr[i]); }
        }
        return out;
    };

    // ===== 安全 JSON =====
    U.safeJson = function (s, def) {
        try { return JSON.parse(s); } catch (e) { return def; }
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
    U.randColor = function () {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    };

    // ===== 深拷贝 =====
    U.deepClone = function (obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (U.isArr(obj)) return obj.map(function (v) { return U.deepClone(v); });
        var out = {};
        for (var k in obj) if (obj.hasOwnProperty(k)) out[k] = U.deepClone(obj[k]);
        return out;
    };

    // ===== 数组分组 =====
    U.chunk = function (arr, size) {
        var out = [];
        for (var i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
        return out;
    };

    // ===== Base64 编解码 =====
    U.b64Encode = function (str) {
        try {
            if (typeof TextEncoder !== 'undefined') {
                var bytes = new TextEncoder('utf-8').encode(String(str));
                var bin = '';
                for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
                return btoa(bin);
            }
            return btoa(unescape(encodeURIComponent(str)));
        } catch (e) { return ''; }
    };
    U.b64Decode = function (b64) {
        try {
            if (typeof TextDecoder !== 'undefined') {
                var bin = atob(String(b64));
                var bytes = new Uint8Array(bin.length);
                for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
                return new TextDecoder('utf-8').decode(bytes);
            }
            return decodeURIComponent(escape(atob(b64)));
        } catch (e) { return ''; }
    };
        U.LOG = LOG;
        return U;
    })();
    var LOG = U.LOG;

    var LANG = (function () {
        'use strict';
    // =========================================================================

    // =========================================================================
    // 🌍 模块 1b：国际化系统 (i18n)
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
            'enabled': '✅ 已启用',
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
            'themeAuto': '跟随系统', 'themeLight': '☀ 亮色', 'themeDark': '🌙 暗色',
            'uiStyleSelect': '界面风格', 'uiStyleDesc': '切换面板整体视觉风格',
            'uiStyleNormal': '普通', 'uiStyleMaterial': 'Material', 'uiStyleApple': '苹果',
            'paletteSelect': '配色方案',
            'paletteIndigo': '靛蓝', 'palettePurple': '紫色', 'paletteBlue': '海蓝',
            'paletteGreen': '森绿', 'paletteOrange': '暖橙', 'paletteRose': '玫红',
            'grpTheme': '界面主题', 'grpPalette': '配色方案', 'grpUiStyle': '界面风格', 'grpNameTpl': '下载文件名模板',
            'grpBatch': '批量下载设置', 'grpAria2': 'Aria2 推送设置', 'grpM3u8': 'm3u8 流媒体设置',
            'grpHeaders': '请求头设置', 'grpLog': '日志级别', 'grpOther': '其他操作',
            'grpLang': '界面语言', 'grpDomainRules': '自定义域名规则', 'grpVideoThumb': '视频封面',
            'grpAutoUpdate': '自动更新检测', 'grpPersistSelection': '关闭面板保留选择',
            'grpShortcuts': '快捷键设置', 'grpDownloadHistory': '下载历史', 'grpResourceHistory': '资源历史',
            'enableHistory': '记录资源历史',
            'noResourceHistory': '暂无资源历史',
            'clearResourceHistory': '清空资源历史',
            'confirmClearResourceHistory': '确认清空资源历史？',
            'historyToday': '今天',
            'historyYesterday': '昨天',
            'historyWeek': '近7天',
            'historyOlder': '更早',
            'autoCheckUpdate': '自动检测更新', 'autoCheckUpdateDesc': '启动时自动检查最新版本',
            'persistSelection': '关闭面板保留选择', 'persistSelectionDesc': '关闭面板后保留已选资源，下次打开继续操作',
            'shiftSelectHint': '提示：选择模式下按住 Shift 点击卡片可连续多选',
            'checkNow': '立即检查', 'checkingUpdate': '正在检查更新...',
            'updateLatest': '已是最新版本', 'updateFound': '发现新版本',
            'updateCheckFail': '检查更新失败',
            'nameTpl': '下载文件名模板', 'saveRules': '保存域名规则',
            'rulesSaved': '已保存 {n} 条域名规则',
            'coverExtracted': '✅ 封面已提取并下载',
            'coverFail': '封面提取失败', 'coverWait': '正在提取封面，请稍候...',
            'loadingMeta': '加载中...',
            'copied': '已复制', 'noFiles': '无下载文件',
            'noSelected': '未选择文件', 'startDl': '开始下载...', 'renamePrompt': '重命名文件', 'dlDone': '下载完成：{name}',
            'done': '完成', 'stopped': '已停止', 'scanning': '正在扫描...',
            'scanDone': '扫描完成', 'filterApplied': '筛选已应用',
            'appTitle': '媒体嗅探器 Pro',
            'tabImg': '🖼 图片', 'tabVideo': '🎬 视频', 'tabAudio': '🎵 音频',
            'tabM3u8': '📺 流媒体', 'tabTranslate': '📖 翻译',
            'tabCookie': '🍪 Cookie', 'tabStorage': '💾 存储',
            'tabSettings': '⚙️ 设置',
            'btnSelAll': '全选', 'btnSelNone': '取消全选',
            'extractCover': '提取封面', 'filterPanel': '筛选设置',
            'advFilterTitle': '🔧 高级筛选设置',
            'advFilterDesc': '设置阈值后，点击"应用筛选"重新过滤资源列表',
            'minImageSize': '最小图片大小（字节）',
            'minImageWidth': '最小图片宽度（px）',
            'minVideoDuration': '最小视频时长（秒）',
            'applyFilterBtn': '应用筛选',
            'filterNoMatch': '筛选后无匹配结果',
            'minKb': '最小大小 (KB)', 'maxKb': '最大大小 (KB, 0=不限)',
            'apply': '应用', 'reset': '重置'
        ,
            'searchPlaceholder': '搜索...',
            'advFilter': '高级筛选',
            'noCookie': '暂无 Cookie',
            'copyCookieStr': '📋 复制 Cookie 字符串',
            'copyJson': '📋 复制 JSON',
            'addCookie': '➕ 新增 Cookie',
            'clearSite': '🗑 清空本站',
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
            'exportLs': '📤 导出 localStorage',
            'exportSs': '📤 导出 sessionStorage',
            'addItem': '➕ 新增项',
            'clearAll': '🗑 清空全部',
            'keyName': '键名',
            'keyValue': '键值',
            'confirmClearStorage': '确认清空存储？',
            'cleared': '已清空',
            'addToLs': '添加到 localStorage',
            'lsTitle': '📦 localStorage',
            'ssTitle': '💾 sessionStorage',
            'lsCount': '📦 localStorage {n} 条 · 💾 sessionStorage {m} 条',
            'transTitle': '📖 翻译工具',
            'transIntro': '· 使用 MyMemory 免费 API（国内可用）· 一次最多 500 字符<br/>· 快捷键 Alt+T 翻译当前页选中文字',
            'transInputPh': '请输入要翻译的文本...',
            'transResultPh': '翻译结果将显示在这里',
            'transBtn': '翻译',
            'zhToEn': '中→英',
            'enToZh': '英→中',
            'clearBtn': '清空',
            'copyResult': '📋 复制结果',
            'resultAsInput': '🔁 结果当输入',
            'plsInputText': '请输入文本',
            'translating': '⏳ 正在翻译（{from} → {to}）…',
            'translatingShort': '正在翻译...',
            'transDone': '✅ 翻译完成 · ',
            'transFail': '❌ 翻译失败',
            'transFailShort': '（翻译失败）',
            'transEngine': '翻译引擎',
            'transEngineSelect': '选择引擎',
            'transNeedKey': '此引擎需要 API Key',
            'transNetErr': '网络错误',
            'transTimeout': '请求超时',
            'transAllFail': '所有翻译引擎均失败',
            'transPartialFail': '部分分段翻译失败',
            'speakBtn': '🔊 发音',
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
            'copiedN': '✅ 已复制 {n} 字符',
            'copyFail': '复制失败',
            'noDlResource': '无下载资源',
            'downloading': '下载中...',
            'batchStart': '⬇ 开始批量下载 {n} 项（并发 {c}）',
            'batchDone': '✅ 批量下载完成：成功 {ok} / {total}，失败 {fail}，耗时 {t}秒',
            'dlStopped': '下载已停止',
            'scanDoneToast': '扫描完成',
            'filterAppliedToast': '筛选已应用',
            'noSelFile': '未选择文件',
            'startDlToast': '开始下载 {n} 个文件...',
            'noDlFile': '无下载文件',
            'noCopyUrl': '无链接可复制',
            'm3u8Start': '开始处理 m3u8',
            'm3u8Progress': '下载进度: {d}/{t}',
            'm3u8Fail': '❌ 下载失败',
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
            'm3u8Title': '📺 流媒体：{n} 个 m3u8',
            'noM3u8': '暂无 m3u8 资源',
            'dlMerge': '下载并合并',
            'genScriptBtn': '生成脚本',
            'detailBtn': '详情',
            'm3u8Detail': '📺 m3u8 流媒体详情',
            'parsing': '解析中...',
            'parseResult': '解析结果：{n} 个分片',
            'masterStreams': '多码率流，共 {n} 个子流：',
            'segmentsInfo': '分片列表，共 {n} 个分片，总时长 {t}',
            'encrypted': '🔐 AES 加密',
            'notEncrypted': '🔓 未加密',
            'yes': '是',
            'no': '否',
            'parseFailNet': '网络请求失败',
            'parseFailTimeout': '请求超时',
            'm3u8PreviewHint': 'm3u8 不可直接预览，请下载',
            'logLevelTitle': '📊 日志级别（调试用）',
            'logDebug': '调试',
            'logInfo': '信息',
            'logWarn': '警告',
            'logError': '错误',
            'otherOps': '🎨 其他操作',
            'exportAllConfig': '📤 导出全部配置',
            'importConfig': '📥 导入配置',
            'resetAll': '↺ 重置全部设置',
            'batchTitle': '📦 批量下载设置',
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
            'requestHeaders': '🔧 请求头设置',
            'referer': 'Referer:',
            'userAgent': 'User-Agent:',
            'cookie': 'Cookie:',
            'infoLine1': '媒体嗅探器 Pro v1.0.5 · SelectionManager · 拖拽排序 · 收藏夹 · 智能去重 · 分组 · 批量操作注册 · 插件系统',
            'infoLine2': '快捷键：Alt+T 翻译选中 · Alt+B 开关面板 · Esc 关闭',
            'clickTabScan': '点击标签扫描',
            'dlProgress': '下载进度',
            'dlProgressText': '{done} / {total}（失败 {fail}）· {speed} · 预计剩余 {eta}',
            'shortcutTitle': '⌨️ 快捷键设置',
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
            },
        'en-US': {
            'scan': 'Scan', 'rescan': 'Rescan', 'img': 'Images',
            'video': 'Videos', 'audio': 'Audio', 'm3u8': 'Streams',
            'translate': 'Translate', 'cookie': 'Cookies', 'storage': 'Storage',
            'settings': 'Settings', 'domain': 'Domain', 'close': 'Close',
            'download': 'Download', 'downloadAll': 'Download All',
            'downloadSel': 'Download Selected', 'copyUrl': 'Copy URL',
            'copyAllUrl': 'Copy All URLs', 'copySelUrl': 'Copy Selected URLs',
            'openTab': 'Open in New Tab', 'preview': 'Preview',
            'search': 'Search...', 'filter': 'Filter', 'filterSize': 'Size Filter',
            'minSize': 'Min Size (KB)', 'maxSize': 'Max Size (KB, 0=unlimited)',
            'applyFilter': 'Apply', 'resetFilter': 'Reset',
            'totalItems': 'Total:', 'items': 'items', 'showing': 'Showing {shown} / {total} items',
            'found': 'Found', 'selected': 'selected', 'selectAll': 'Select All',
            'deselectAll': 'Deselect All', 'noMedia': 'No resources yet',
            'lang': 'UI Language', 'theme': 'Theme', 'system': 'System',
            'light': 'Light', 'dark': 'Dark', 'autoMerge': 'Auto Merge',
            'autoThumb': 'Extract Video Thumbnails', 'autoThumbDesc': 'Auto load first video frame as thumbnail',
            'enabled': '✅ Enabled', 'disabled': '○ Disabled',
            'domainRules': 'Domain Rules',
            'domainRulesDesc': 'One per line: domain,img,video,audio,depth (e.g. baidu.com,1,0,0,1)',
            'clearCache': 'Clear Cache', 'saved': 'Saved', 'ok': 'OK',
            'fail': 'Failed', 'loading': 'Loading...',
            'confirm': 'Confirm', 'cancel': 'Cancel', 'size': 'Size',
            'duration': 'Duration', 'url': 'URL', 'name': 'Name',
            'hint': 'Click=Preview · Double-click=Download · Shift+click=Multi-select',
            'langSelect': 'UI Language', 'themeSelect': 'UI Theme',
            'themeAuto': 'System', 'themeLight': '☀ Light', 'themeDark': '🌙 Dark',
            'uiStyleSelect': 'UI Style', 'uiStyleDesc': 'Switch the panel visual style',
            'uiStyleNormal': 'Normal', 'uiStyleMaterial': 'Material', 'uiStyleApple': 'Apple',
            'paletteSelect': 'Color Scheme',
            'paletteIndigo': 'Indigo', 'palettePurple': 'Purple', 'paletteBlue': 'Blue',
            'paletteGreen': 'Green', 'paletteOrange': 'Orange', 'paletteRose': 'Rose',
            'grpTheme': 'UI Theme', 'grpPalette': 'Color Scheme', 'grpUiStyle': 'UI Style', 'grpNameTpl': 'Filename Template',
            'grpBatch': 'Batch Download', 'grpAria2': 'Aria2 Push', 'grpM3u8': 'm3u8 Stream',
            'grpHeaders': 'Request Headers', 'grpLog': 'Log Level', 'grpOther': 'Other Actions',
            'grpLang': 'UI Language', 'grpDomainRules': 'Domain Rules', 'grpVideoThumb': 'Video Thumbnail',
            'grpAutoUpdate': 'Auto Update', 'grpPersistSelection': 'Keep Selection on Close',
            'grpShortcuts': 'Shortcuts', 'grpDownloadHistory': 'Download History', 'grpResourceHistory': 'Resource History',
            'enableHistory': 'Record resource history',
            'noResourceHistory': 'No resource history',
            'clearResourceHistory': 'Clear resource history',
            'confirmClearResourceHistory': 'Clear resource history?',
            'historyToday': 'Today',
            'historyYesterday': 'Yesterday',
            'historyWeek': 'Last 7 days',
            'historyOlder': 'Older',
            'autoCheckUpdate': 'Auto Check Update', 'autoCheckUpdateDesc': 'Automatically check for updates on startup',
            'persistSelection': 'Keep Selection on Close', 'persistSelectionDesc': 'Keep selected resources after closing the panel',
            'shiftSelectHint': 'Tip: In selection mode, hold Shift and click cards to select a range',
            'checkNow': 'Check Now', 'checkingUpdate': 'Checking for updates...',
            'updateLatest': 'Already up to date', 'updateFound': 'New version found',
            'updateCheckFail': 'Update check failed',
            'nameTpl': 'Download Filename Template', 'saveRules': 'Save Domain Rules',
            'rulesSaved': 'Saved {n} domain rules',
            'coverExtracted': '✅ Cover extracted',
            'coverFail': 'Cover extraction failed', 'coverWait': 'Extracting cover...',
            'loadingMeta': 'Loading...',
            'copied': 'Copied', 'noFiles': 'No downloadable files',
            'noSelected': 'No files selected', 'startDl': 'Starting download...', 'renamePrompt': 'Rename file', 'dlDone': 'Download complete: {name}',
            'done': 'Done', 'stopped': 'Stopped', 'scanning': 'Scanning...',
            'scanDone': 'Scan complete', 'filterApplied': 'Filter applied',
            'appTitle': 'Media Sniffer Pro',
            'tabImg': '🖼 Images', 'tabVideo': '🎬 Videos', 'tabAudio': '🎵 Audio',
            'tabM3u8': '📺 Streams', 'tabTranslate': '📖 Translate',
            'tabCookie': '🍪 Cookies', 'tabStorage': '💾 Storage',
            'tabSettings': '⚙️ Settings',
            'btnSelAll': 'Select All', 'btnSelNone': 'Deselect All',
            'extractCover': 'Extract Cover', 'filterPanel': 'Filter Settings',
            'advFilterTitle': '🔧 Advanced Filter Settings',
            'advFilterDesc': 'Set thresholds, then click "Apply" to re-filter the resource list',
            'minImageSize': 'Min Image Size (bytes)',
            'minImageWidth': 'Min Image Width (px)',
            'minVideoDuration': 'Min Video Duration (sec)',
            'applyFilterBtn': 'Apply Filter',
            'filterNoMatch': 'No matches after filter',
            'minKb': 'Min Size (KB)', 'maxKb': 'Max Size (KB, 0=unlimited)',
            'apply': 'Apply', 'reset': 'Reset'
        ,
            'searchPlaceholder': '🔍 Search URL or filename…',
            'advFilter': '🔧 Advanced Filter',
            'noCookie': 'No cookies on this page',
            'copyCookieStr': '📋 Copy Cookie String',
            'copyJson': '📋 Copy JSON',
            'addCookie': '➕ Add Cookie',
            'clearSite': '🗑 Clear Site',
            'delete': 'Delete',
            'cookieName': 'Enter cookie name:',
            'cookieValue': 'Enter cookie value:',
            'confirmClearCookie': 'Clear all cookies for this site?',
            'clearedRefresh': '✅ Cleared, please refresh',
            'added': '✅ Added',
            'addFail': 'Add failed',
            'delFail': 'Delete failed',
            'clearFail': 'Clear failed',
            'readCookieFail': 'Cannot read cookies',
            'exportLs': '📤 Export localStorage',
            'exportSs': '📤 Export sessionStorage',
            'addItem': '➕ Add Item',
            'clearAll': '🗑 Clear All',
            'keyName': 'Key:',
            'keyValue': 'Value:',
            'confirmClearStorage': 'Clear localStorage and sessionStorage?',
            'cleared': '✅ Cleared',
            'addToLs': '✅ Added to localStorage',
            'lsTitle': '📦 localStorage',
            'ssTitle': '💾 sessionStorage',
            'lsCount': '📦 localStorage {n} · 💾 sessionStorage {m}',
            'transTitle': '🌐 Text Translation',
            'transIntro': '· MyMemory free API · Max 500 chars<br/>· Shortcut: Alt+T to translate selected text',
            'transInputPh': 'Enter or paste text to translate…',
            'transResultPh': 'Translation result appears here…',
            'transBtn': 'Translate',
            'zhToEn': 'ZH→EN',
            'enToZh': 'EN→ZH',
            'clearBtn': 'Clear',
            'copyResult': '📋 Copy Result',
            'resultAsInput': '🔁 Use as Input',
            'plsInputText': '⚠ Please enter text to translate',
            'translating': '⏳ Translating ({from} → {to})…',
            'translatingShort': '⏳ Translating, please wait…',
            'transDone': '✅ Translated · ',
            'transFail': '❌ Translation failed',
            'transFailShort': '(failed)',
            'transEngine': 'Engine',
            'transEngineSelect': 'Select Engine',
            'transNeedKey': 'This engine requires API Key',
            'transNetErr': 'Network error',
            'transTimeout': 'Request timeout',
            'transAllFail': 'All translation engines failed',
            'transPartialFail': 'Some segments failed',
            'speakBtn': '🔊 Speak',
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
            'downloadSelBtn': '⬇ Download',
            'copyN': 'Copy ({n})',
            'downloadN': 'Download ({n})',
            'genScript': '📝 Generate Script',
            'rescan': '🔄 Rescan',
            'plsCheck': 'Please select resources first',
            'scriptCopied': '✅ aria2 script generated and copied',
            'rescanDone': '✅ Rescanned',
            'copiedN': '✅ Copied {n} chars',
            'copyFail': 'Copy failed',
            'noDlResource': 'No downloadable resources',
            'downloading': '⏳ Download already in progress',
            'batchStart': '⬇ Starting batch download of {n} items ({c} concurrent)',
            'batchDone': '✅ Batch done: {ok}/{total} success, {fail} failed, {t}s',
            'dlStopped': '⏹ Download stopped',
            'scanDoneToast': '✅ Scan complete',
            'filterAppliedToast': '✅ Filter applied',
            'noSelFile': 'No files selected',
            'startDlToast': 'Starting download of {n} files...',
            'noDlFile': 'No downloadable files',
            'noCopyUrl': 'No URLs to copy',
            'm3u8Start': '⏳ Starting m3u8 download...',
            'm3u8Progress': 'Progress: {d}/{t}',
            'm3u8Fail': '❌ Download failed',
            'm3u8Done': '✅ m3u8 merged and downloaded',
            'previewFail': 'Preview failed',
            'extractFail': 'Extraction failed',
            'logLevelChanged': '✅ Log level changed',
            'resetDone': '✅ Reset',
            'plsSelectText': 'Please select text to translate first',
            'transSelText': '🌐 Translate Selection',
            'confirmDlSel': 'Download {n} selected files? (may block the page)',
            'confirmDlAll': 'Download all {n} files?',
            'confirmReset': 'Reset all settings?',
            'pasteJson': 'Paste config JSON:',
            'm3u8Title': '📺 Streams: {n} m3u8',
            'noM3u8': 'No m3u8 streams found',
            'dlMerge': '⬇ Download & Merge',
            'genScriptBtn': '📝 Generate Script',
            'detailBtn': '👁 Details',
            'm3u8Detail': '📺 m3u8 Stream Details',
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
            'logLevelTitle': '📊 Log Level (debug)',
            'logDebug': 'DEBUG (verbose)',
            'logInfo': 'INFO (default)',
            'logWarn': 'WARN',
            'logError': 'ERROR (errors only)',
            'otherOps': '🎨 Other Actions',
            'exportAllConfig': '📤 Export All Config',
            'importConfig': '📥 Import Config',
            'resetAll': '↺ Reset All Settings',
            'batchTitle': '📦 Batch Download Settings',
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
            'requestHeaders': '🔧 Request Headers',
            'referer': 'Referer:',
            'userAgent': 'User-Agent:',
            'cookie': 'Cookie:',
            'infoLine1': 'Media Sniffer Pro v1.0.5 · SelectionManager · Drag Sort · Favorites · Smart Dedup · Groups · Batch Actions · Plugin System',
            'infoLine2': 'Shortcuts: Alt+T Translate · Alt+B Toggle · Esc Close',
            'clickTabScan': 'Click a tab above to start scanning',
            'dlProgress': 'Download Progress',
            'dlProgressText': '{done} / {total} ({fail} failed) · {speed} · ETA {eta}',
            'shortcutTitle': '⌨️ Shortcuts',
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
            },
        'ja-JP': {
            'scan': 'スキャン', 'rescan': '再スキャン', 'img': '画像',
            'video': '動画', 'audio': '音声', 'm3u8': 'ストリーム',
            'translate': '翻訳', 'cookie': 'Cookie', 'storage': 'ストレージ',
            'settings': '設定', 'domain': 'ドメイン', 'close': '閉じる',
            'download': 'ダウンロード', 'downloadAll': '一括ダウンロード',
            'downloadSel': '選択した項目をダウンロード', 'copyUrl': 'リンクをコピー',
            'copyAllUrl': '全リンクをコピー', 'copySelUrl': '選択したリンクをコピー',
            'openTab': '新しいタブで開く', 'preview': 'プレビュー',
            'search': '検索...', 'filter': 'フィルター', 'filterSize': 'サイズフィルター',
            'minSize': '最小サイズ (KB)', 'maxSize': '最大サイズ (KB, 0=制限なし)',
            'applyFilter': '適用', 'resetFilter': 'リセット',
            'totalItems': '合計:', 'items': '項目', 'showing': '{shown} / {total} 件を表示中',
            'found': '見つかりました', 'selected': '選択済み',
            'selectAll': 'すべて選択', 'deselectAll': '選択解除',
            'noMedia': 'リソースはありません', 'lang': '言語',
            'theme': 'テーマ', 'system': 'システムに従う', 'light': 'ライト',
            'dark': 'ダーク', 'autoMerge': '自動結合', 'autoThumb': '動画サムネイル抽出',
            'autoThumbDesc': '動画フレームをサムネイルとして自動読み込み',
            'enabled': '✅ 有効', 'disabled': '○ 無効',
            'domainRules': 'ドメインルール', 'domainRulesDesc': '1行1ルール: ドメイン,画像,動画,音声,深度 (例: baidu.com,1,0,0,1)',
            'clearCache': 'キャッシュをクリア', 'saved': '保存しました', 'ok': 'OK',
            'fail': '失敗', 'loading': '読み込み中...', 'confirm': '確認',
            'cancel': 'キャンセル', 'size': 'サイズ', 'duration': '長さ',
            'url': 'URL', 'name': '名前', 'hint': 'クリック=プレビュー · ダブルクリック=ダウンロード',
            'langSelect': 'UI言語', 'themeSelect': 'UIテーマ',
            'themeAuto': 'システム', 'themeLight': '☀ ライト', 'themeDark': '🌙 ダーク',
            'uiStyleSelect': 'UIスタイル', 'uiStyleDesc': 'パネルの外観スタイルを切り替え',
            'uiStyleNormal': '通常', 'uiStyleMaterial': 'Material', 'uiStyleApple': 'Apple',
            'paletteSelect': '配色スキーム',
            'paletteIndigo': 'インディゴ', 'palettePurple': 'パープル', 'paletteBlue': 'ブルー',
            'paletteGreen': 'グリーン', 'paletteOrange': 'オレンジ', 'paletteRose': 'ローズ',
            'autoCheckUpdate': '自動更新チェック', 'autoCheckUpdateDesc': '起動時に自動で更新を確認',
            'checkNow': '今すぐ確認', 'checkingUpdate': '更新を確認中...',
            'updateLatest': '最新バージョンです', 'updateFound': '新しいバージョンが見つかりました',
            'updateCheckFail': '更新チェックに失敗しました',
            'nameTpl': 'ダウンロードファイル名テンプレート', 'saveRules': 'ドメインルールを保存',
            'rulesSaved': '{n} 件のルールを保存しました',
            'coverExtracted': '✅ カバーを抽出しました',
            'coverFail': 'カバー抽出に失敗しました', 'coverWait': 'カバー抽出中...',
            'loadingMeta': '読み込み中...',
            'copied': 'コピーしました', 'noFiles': 'ダウンロード可能なファイルはありません',
            'noSelected': 'ファイルが選択されていません', 'startDl': 'ダウンロード開始...', 'renamePrompt': 'ファイル名を変更', 'dlDone': 'ダウンロード完了：{name}',
            'done': '完了', 'stopped': '停止しました', 'scanning': 'スキャン中...',
            'scanDone': 'スキャン完了', 'filterApplied': 'フィルターを適用しました',
            'appTitle': 'メディアスニッファー Pro',
            'tabImg': '🖼 画像', 'tabVideo': '🎬 動画', 'tabAudio': '🎵 音声',
            'tabM3u8': '📺 ストリーム', 'tabTranslate': '📖 翻訳',
            'tabCookie': '🍪 Cookie', 'tabStorage': '💾 ストレージ',
            'tabSettings': '⚙️ 設定',
            'btnSelAll': 'すべて選択', 'btnSelNone': '選択解除',
            'extractCover': 'カバー抽出', 'filterPanel': 'フィルター設定',
            'advFilterTitle': '🔧 詳細フィルター設定',
            'advFilterDesc': 'しきい値を設定し、「適用」をクリックしてリストを再フィルター',
            'minImageSize': '最小画像サイズ（バイト）',
            'minImageWidth': '最小画像幅（px）',
            'minVideoDuration': '最小動画長（秒）',
            'applyFilterBtn': 'フィルター適用',
            'filterNoMatch': 'フィルターに一致する項目はありません',
            'minKb': '最小サイズ (KB)', 'maxKb': '最大サイズ (KB, 0=制限なし)',
            'apply': '適用', 'reset': 'リセット'
        ,
            'searchPlaceholder': '🔍 URLまたはファイル名を検索…',
            'advFilter': '🔧 詳細フィルター',
            'noCookie': 'このページにCookieはありません',
            'copyCookieStr': '📋 Cookie文字列コピー',
            'copyJson': '📋 JSONコピー',
            'addCookie': '➕ Cookie追加',
            'clearSite': '🗑 サイトをクリア',
            'delete': '削除',
            'cookieName': 'Cookie名を入力：',
            'cookieValue': 'Cookie値を入力：',
            'confirmClearCookie': 'このサイトのCookieをすべて削除しますか？',
            'clearedRefresh': '✅ クリアしました、更新してください',
            'added': '✅ 追加しました',
            'addFail': '追加失敗',
            'delFail': '削除失敗',
            'clearFail': 'クリア失敗',
            'readCookieFail': 'Cookieを読み込めません',
            'exportLs': '📤 localStorageをエクスポート',
            'exportSs': '📤 sessionStorageをエクスポート',
            'addItem': '➕ 項目を追加',
            'clearAll': '🗑 すべてクリア',
            'keyName': 'キー：',
            'keyValue': '値：',
            'confirmClearStorage': 'localStorageとsessionStorageをクリアしますか？',
            'cleared': '✅ クリアしました',
            'addToLs': '✅ localStorageに追加しました',
            'lsTitle': '📦 localStorage',
            'ssTitle': '💾 sessionStorage',
            'lsCount': '📦 localStorage {n}件 · 💾 sessionStorage {m}件',
            'transTitle': '🌐 テキスト翻訳',
            'transIntro': '・MyMemory無料API ・最大500文字<br/>・ショートカット: Alt+Tで選択テキスト翻訳',
            'transInputPh': '翻訳するテキストを入力または貼り付け…',
            'transResultPh': '翻訳結果がここに表示されます…',
            'transBtn': '翻訳',
            'zhToEn': '中→英',
            'enToZh': '英→中',
            'clearBtn': 'クリア',
            'copyResult': '📋 結果をコピー',
            'resultAsInput': '🔁 結果を入力に',
            'plsInputText': '⚠ 翻訳するテキストを入力してください',
            'translating': '⏳ 翻訳中（{from} → {to}）…',
            'translatingShort': '⏳ 翻訳中、しばらくお待ちください…',
            'transDone': '✅ 翻訳完了 · ',
            'transFail': '❌ 翻訳失敗',
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
            'downloadSelBtn': '⬇ ダウンロード',
            'copyN': 'コピー({n})',
            'downloadN': 'ダウンロード({n})',
            'genScript': '📝 スクリプト生成',
            'rescan': '🔄 再スキャン',
            'plsCheck': 'リソースを選択してください',
            'scriptCopied': '✅ aria2スクリプト生成・コピー完了',
            'rescanDone': '✅ 再スキャン完了',
            'copiedN': '✅ {n}文字コピーしました',
            'copyFail': 'コピー失敗',
            'noDlResource': 'ダウンロード可能なリソースはありません',
            'downloading': '⏳ ダウンロード中です',
            'batchStart': '⬇ 一括DL開始：{n}件（同時{c}件）',
            'batchDone': '✅ 一括DL完了：成功{ok}/{total}件、失敗{fail}件、{t}秒',
            'dlStopped': '⏹ DL停止しました',
            'scanDoneToast': '✅ スキャン完了',
            'filterAppliedToast': '✅ フィルター適用済み',
            'noSelFile': 'ファイルが選択されていません',
            'startDlToast': '{n}ファイルのDLを開始...',
            'noDlFile': 'ダウンロード可能なファイルはありません',
            'noCopyUrl': 'コピーするURLはありません',
            'm3u8Start': '⏳ m3u8のDLを開始...',
            'm3u8Progress': '進捗: {d}/{t}',
            'm3u8Fail': '❌ DL失敗',
            'm3u8Done': '✅ m3u8 結合・DL完了',
            'previewFail': 'プレビュー失敗',
            'extractFail': '抽出失敗',
            'logLevelChanged': '✅ ログレベル変更',
            'resetDone': '✅ リセット完了',
            'plsSelectText': '翻訳するテキストを選択してください',
            'transSelText': '🌐 選択を翻訳',
            'confirmDlSel': '{n}ファイルをDLしますか？（ページが固まる場合があります）',
            'confirmDlAll': '全{n}ファイルをDLしますか？',
            'confirmReset': 'すべての設定をリセットしますか？',
            'pasteJson': '設定JSONを貼り付け：',
            'm3u8Title': '📺 ストリーム：{n} m3u8',
            'noM3u8': 'm3u8ストリームはありません',
            'dlMerge': '⬇ DLして結合',
            'genScriptBtn': '📝 スクリプト生成',
            'detailBtn': '👁 詳細',
            'm3u8Detail': '📺 m3u8ストリーム詳細',
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
            'logLevelTitle': '📊 ログレベル（デバッグ用）',
            'logDebug': 'DEBUG（詳細）',
            'logInfo': 'INFO（デフォルト）',
            'logWarn': 'WARN（警告）',
            'logError': 'ERROR（エラーのみ）',
            'otherOps': '🎨 その他の操作',
            'exportAllConfig': '📤 全設定エクスポート',
            'importConfig': '📥 設定インポート',
            'resetAll': '↺ 全設定リセット',
            'batchTitle': '📦 一括DL設定',
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
            'requestHeaders': '🔧 リクエストヘッダー',
            'referer': 'Referer:',
            'userAgent': 'User-Agent:',
            'cookie': 'Cookie:',
            'infoLine1': 'メディアスニッファー Pro v1.0.5 · モジュール設計 · AES-128復号 · 仮想リスト · 進捗可視化 · プラグインシステム',
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
            },
        'ko-KR': {
            'scan': '스캔', 'rescan': '재스캔', 'img': '이미지',
            'video': '영상', 'audio': '오디오', 'm3u8': '스트림',
            'translate': '번역', 'cookie': '쿠키', 'storage': '저장소',
            'settings': '설정', 'domain': '도메인', 'close': '닫기',
            'download': '다운로드', 'downloadAll': '전체 다운로드',
            'downloadSel': '선택 다운로드', 'copyUrl': '링크 복사',
            'copyAllUrl': '전체 링크 복사', 'copySelUrl': '선택 링크 복사',
            'openTab': '새 탭에서 열기', 'preview': '미리보기',
            'search': '검색...', 'filter': '필터', 'filterSize': '크기 필터',
            'minSize': '최소 크기 (KB)', 'maxSize': '최대 크기 (KB, 0=제한없음)',
            'applyFilter': '적용', 'resetFilter': '재설정',
            'totalItems': '총:', 'items': '개', 'showing': '{shown} / {total} 항목 표시 중',
            'found': '발견', 'selected': '선택됨',
            'selectAll': '전체 선택', 'deselectAll': '선택 해제',
            'noMedia': '리소스 없음', 'lang': '언어',
            'theme': '테마', 'system': '시스템 설정', 'light': '라이트',
            'dark': '다크', 'autoMerge': '자동 병합', 'autoThumb': '영상 썸네일 추출',
            'autoThumbDesc': '동영상 첫 프레임을 썸네일로',
            'enabled': '✅ 활성', 'disabled': '○ 비활성',
            'domainRules': '도메인 규칙', 'domainRulesDesc': '줄당 1규칙: 도메인,이미지,영상,음성,깊이',
            'clearCache': '캐시 지우기', 'saved': '저장됨', 'ok': 'OK',
            'fail': '실패', 'loading': '로딩 중...', 'confirm': '확인',
            'cancel': '취소', 'size': '크기', 'duration': '길이',
            'url': 'URL', 'name': '이름', 'hint': '클릭=미리보기 · 더블클릭=다운로드',
            'langSelect': 'UI 언어', 'themeSelect': 'UI 테마',
            'themeAuto': '시스템', 'themeLight': '☀ 라이트', 'themeDark': '🌙 다크',
            'uiStyleSelect': 'UI 스타일', 'uiStyleDesc': '패널 시각 스타일 전환',
            'uiStyleNormal': '일반', 'uiStyleMaterial': 'Material', 'uiStyleApple': 'Apple',
            'paletteSelect': '컬러 스킴',
            'paletteIndigo': '인디고', 'palettePurple': '퍼플', 'paletteBlue': '블루',
            'paletteGreen': '그린', 'paletteOrange': '오렌지', 'paletteRose': '로즈',
            'autoCheckUpdate': '자동 업데이트 확인', 'autoCheckUpdateDesc': '시작 시 자동으로 업데이트 확인',
            'checkNow': '지금 확인', 'checkingUpdate': '업데이트 확인 중...',
            'updateLatest': '최신 버전입니다', 'updateFound': '새 버전 발견',
            'updateCheckFail': '업데이트 확인 실패',
            'nameTpl': '다운로드 파일명 템플릿', 'saveRules': '도메인 규칙 저장',
            'rulesSaved': '{n}개의 규칙이 저장됨',
            'coverExtracted': '✅ 썸네일 추출됨',
            'coverFail': '썸네일 추출 실패', 'coverWait': '썸네일 추출 중...',
            'loadingMeta': '로딩 중...',
            'copied': '복사됨', 'noFiles': '다운로드할 파일 없음',
            'noSelected': '선택된 파일 없음', 'startDl': '다운로드 시작...', 'renamePrompt': '파일 이름 변경', 'dlDone': '다운로드 완료: {name}',
            'done': '완료', 'stopped': '중지됨', 'scanning': '스캔 중...',
            'scanDone': '스캔 완료', 'filterApplied': '필터 적용됨',
            'appTitle': '미디어 스니퍼 Pro',
            'tabImg': '🖼 이미지', 'tabVideo': '🎬 영상', 'tabAudio': '🎵 오디오',
            'tabM3u8': '📺 스트림', 'tabTranslate': '📖 번역',
            'tabCookie': '🍪 쿠키', 'tabStorage': '💾 저장소',
            'tabSettings': '⚙️ 설정',
            'btnSelAll': '전체 선택', 'btnSelNone': '선택 해제',
            'extractCover': '썸네일 추출', 'filterPanel': '필터 설정',
            'advFilterTitle': '🔧 고급 필터 설정',
            'advFilterDesc': '임계값을 설정한 후 "적용"을 클릭하여 리스트를 다시 필터링',
            'minImageSize': '최소 이미지 크기（바이트）',
            'minImageWidth': '최소 이미지 너비（px）',
            'minVideoDuration': '최소 영상 길이（초）',
            'applyFilterBtn': '필터 적용',
            'filterNoMatch': '필터와 일치하는 항목 없음',
            'minKb': '최소 크기 (KB)', 'maxKb': '최대 크기 (KB, 0=제한없음)',
            'apply': '적용', 'reset': '재설정'
        ,
            'searchPlaceholder': '🔍 URL 또는 파일명 검색…',
            'advFilter': '🔧 고급 필터',
            'noCookie': '이 페이지에 쿠키가 없습니다',
            'copyCookieStr': '📋 쿠키 문자열 복사',
            'copyJson': '📋 JSON 복사',
            'addCookie': '➕ 쿠키 추가',
            'clearSite': '🗑 사이트 비우기',
            'delete': '삭제',
            'cookieName': '쿠키 이름을 입력하세요:',
            'cookieValue': '쿠키 값을 입력하세요:',
            'confirmClearCookie': '이 사이트의 모든 쿠키를 지우시겠습니까?',
            'clearedRefresh': '✅ 지워졌습니다, 새로고침하세요',
            'added': '✅ 추가됨',
            'addFail': '추가 실패',
            'delFail': '삭제 실패',
            'clearFail': '비우기 실패',
            'readCookieFail': '쿠키를 읽을 수 없습니다',
            'exportLs': '📤 localStorage 내보내기',
            'exportSs': '📤 sessionStorage 내보내기',
            'addItem': '➕ 항목 추가',
            'clearAll': '🗑 모두 비우기',
            'keyName': '키:',
            'keyValue': '값:',
            'confirmClearStorage': 'localStorage와 sessionStorage를 비우시겠습니까?',
            'cleared': '✅ 비워졌습니다',
            'addToLs': '✅ localStorage에 추가됨',
            'lsTitle': '📦 localStorage',
            'ssTitle': '💾 sessionStorage',
            'lsCount': '📦 localStorage {n}개 · 💾 sessionStorage {m}개',
            'transTitle': '🌐 텍스트 번역',
            'transIntro': '· MyMemory 무료 API · 최대 500자<br/>· 단축키: Alt+T로 선택 텍스트 번역',
            'transInputPh': '번역할 텍스트를 입력하거나 붙여넣으세요…',
            'transResultPh': '번역 결과가 여기에 표시됩니다…',
            'transBtn': '번역',
            'zhToEn': '중→영',
            'enToZh': '영→중',
            'clearBtn': '비우기',
            'copyResult': '📋 결과 복사',
            'resultAsInput': '🔁 결과를 입력으로',
            'plsInputText': '⚠ 번역할 텍스트를 입력하세요',
            'translating': '⏳ 번역 중（{from} → {to}）…',
            'translatingShort': '⏳ 번역 중입니다…',
            'transDone': '✅ 번역 완료 · ',
            'transFail': '❌ 번역 실패',
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
            'downloadSelBtn': '⬇ 다운로드',
            'copyN': '복사({n})',
            'downloadN': '다운로드({n})',
            'genScript': '📝 스크립트 생성',
            'rescan': '🔄 재스캔',
            'plsCheck': '리소스를 선택하세요',
            'scriptCopied': '✅ aria2 스크립트 생성 및 복사됨',
            'rescanDone': '✅ 재스캔 완료',
            'copiedN': '✅ {n}자 복사됨',
            'copyFail': '복사 실패',
            'noDlResource': '다운로드 가능한 리소스가 없습니다',
            'downloading': '⏳ 이미 다운로드 중입니다',
            'batchStart': '⬇ 일괄 다운로드 시작: {n}개（동시 {c}개）',
            'batchDone': '✅ 일괄 완료: 성공 {ok}/{total}, 실패 {fail}, {t}초',
            'dlStopped': '⏹ 다운로드 중지됨',
            'scanDoneToast': '✅ 스캔 완료',
            'filterAppliedToast': '✅ 필터 적용됨',
            'noSelFile': '선택된 파일이 없습니다',
            'startDlToast': '{n}개 파일 다운로드 시작...',
            'noDlFile': '다운로드할 파일이 없습니다',
            'noCopyUrl': '복사할 URL이 없습니다',
            'm3u8Start': '⏳ m3u8 다운로드 시작...',
            'm3u8Progress': '진행률: {d}/{t}',
            'm3u8Fail': '❌ 다운로드 실패',
            'm3u8Done': '✅ m3u8 병합 및 다운로드 완료',
            'previewFail': '미리보기 실패',
            'extractFail': '추출 실패',
            'logLevelChanged': '✅ 로그 레벨 변경됨',
            'resetDone': '✅ 재설정됨',
            'plsSelectText': '번역할 텍스트를 먼저 선택하세요',
            'transSelText': '🌐 선택 번역',
            'confirmDlSel': '{n}개 파일을 다운로드하시겠습니까?（페이지가 느려질 수 있습니다）',
            'confirmDlAll': '총 {n}개 파일을 다운로드하시겠습니까?',
            'confirmReset': '모든 설정을 재설정하시겠습니까?',
            'pasteJson': '설정 JSON 붙여넣기:',
            'm3u8Title': '📺 스트림: {n} m3u8',
            'noM3u8': 'm3u8 스트림이 없습니다',
            'dlMerge': '⬇ 다운로드 및 병합',
            'genScriptBtn': '📝 스크립트 생성',
            'detailBtn': '👁 세부정보',
            'm3u8Detail': '📺 m3u8 스트림 세부정보',
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
            'logLevelTitle': '📊 로그 레벨（디버그용）',
            'logDebug': 'DEBUG（상세）',
            'logInfo': 'INFO（기본）',
            'logWarn': 'WARN（경고）',
            'logError': 'ERROR（오류만）',
            'otherOps': '🎨 기타 작업',
            'exportAllConfig': '📤 전체 설정 내보내기',
            'importConfig': '📥 설정 가져오기',
            'resetAll': '↺ 모든 설정 재설정',
            'batchTitle': '📦 일괄 다운로드 설정',
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
            'requestHeaders': '🔧 요청 헤더',
            'referer': 'Referer:',
            'userAgent': 'User-Agent:',
            'cookie': 'Cookie:',
            'infoLine1': '미디어 스니퍼 Pro v1.0.5 · 모듈 구조 · AES-128 복호화 · 가상 리스트 · 진행률 · 플러그인 시스템',
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
            'ctxClose': '닫기'
            }
    };
    LANG.get = function (key, vars) {
        var lang = (State.config && State.config.uiLang) ? State.config.uiLang : 'zh-CN';
        var t = LANG.strings[lang] || LANG.strings['zh-CN'];
        var val = t[key] !== undefined ? t[key] : key;
        if (vars) {
            for (var k in vars) {
                if (Object.prototype.hasOwnProperty.call(vars, k)) {
                    val = String(val).replace(new RegExp('\\{' + k + '\\}', 'g'), String(vars[k]));
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
        // 🛡 模块 2：安全 (Security) + AES-128 解密
    // =========================================================================
    var SEC = {};
    SEC.ALLOWED_PROTOCOLS = { 'http:': 1, 'https:': 1 };
    SEC.ALLOWED_MIME_PREFIX = { 'image/': 1, 'video/': 1, 'audio/': 1 };

    // ===== URL 安全判断 =====
    SEC.isSafeUrl = function (url) {
        if (!url || !U.isStr(url)) return false;
        var trimmed = url.trim();
        if (!trimmed) return false;
        var lower = trimmed.toLowerCase();
        if (/^\s*javascript\s*:/i.test(lower)) return false;
        if (/^\s*vbscript\s*:/i.test(lower)) return false;
        if (lower.indexOf('data:') === 0) {
            var mime = lower.substring(5).split(';')[0].toLowerCase();
            for (var prefix in SEC.ALLOWED_MIME_PREFIX) if (SEC.ALLOWED_MIME_PREFIX.hasOwnProperty(prefix) && mime.indexOf(prefix) === 0) return true;
            return false;
        }
        if (lower.indexOf('blob:') === 0) return true;
        if (lower.indexOf('file:') === 0) return true;
        try {
            var parsed = new URL(trimmed, location.href);
            return !!SEC.ALLOWED_PROTOCOLS[parsed.protocol];
        } catch (e) {
            if (/^[\/\.]/.test(trimmed)) return true;
            return false;
        }
    };

    SEC.safeUrl = function (url) {
        if (!SEC.isSafeUrl(url)) return '';
        return String(url).trim();
    };

    SEC.absUrl = function (src, baseUrl) {
        if (!src) return '';
        try { return new URL(src, baseUrl || location.href).href; } catch (e) { return String(src).trim(); }
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
        s = s.replace(/^[\s\.]+/, '');
        s = s.replace(/[\s\.]+$/, '');
        if (s.length > 180) s = s.substring(0, 170) + '_' + U.now().toString(36).slice(-4);
        if (/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)/i.test(s)) s = '_' + s;
        if (!s.trim()) s = 'file-' + U.now();
        return s;
    };

    SEC.extFromUrl = function (url) {
        try {
            var p = new URL(url, location.href).pathname;
            var m = p.match(/\.([a-zA-Z0-9]{1,8})$/);
            return m ? m[1].toLowerCase() : '';
        } catch (e) { return ''; }
    };

    SEC.nameFromUrl = function (url) {
        try { var p = new URL(url, location.href).pathname.split('/'); return p[p.length - 1] || 'file'; } catch (e) { return 'file'; }
    };

    SEC.guessKind = function (url) {
        if (!url || !U.isStr(url)) return '';
        var path = url.toLowerCase().split('?')[0].split('#')[0];
        if (/\.(png|jpe?g|gif|webp|bmp|svg|avif|ico|tiff?)$/i.test(path)) return 'image';
        if (/\.(mp4|webm|ogg|ogv|mov|mkv|avi|flv|ts|m4v|3gp|mpeg|mpg|rm|rmvb|wmv)$/i.test(path)) return 'video';
        if (/\.(mp3|wav|flac|aac|oga|opus|m4a|wma|amr|ape|ogg|mid)$/i.test(path)) return 'audio';
        if (/\.m3u8?(\?|#|$)/i.test(path)) return 'm3u8';
        return '';
    };

    SEC.VIDEO_SITES = {
        'bilibili': {
            name: '哔哩哔哩',
            icon: '📺',
            match: function(url) {
                try {
                    var u = new URL(url);
                    var host = u.hostname;
                    return /bilibili\.com$/i.test(host) || /b23\.tv$/i.test(host);
                } catch(e) { return false; }
            },
            isVideo: function(url) {
                try {
                    var u = new URL(url);
                    var path = u.pathname;
                    return /^\/video\/BV/i.test(path) || /^\/video\/av/i.test(path) || /^\/bangumi\/play\//i.test(path);
                } catch(e) { return false; }
            }
        },
        'douyin': {
            name: '抖音',
            icon: '🎵',
            match: function(url) {
                try {
                    var u = new URL(url);
                    return /douyin\.com$/i.test(u.hostname) || /iesdouyin\.com$/i.test(u.hostname);
                } catch(e) { return false; }
            },
            isVideo: function(url) {
                try {
                    var u = new URL(url);
                    return /\/video\//i.test(u.pathname) || /\/note\//i.test(u.pathname);
                } catch(e) { return false; }
            }
        },
        'kuaishou': {
            name: '快手',
            icon: '⚡',
            match: function(url) {
                try {
                    var u = new URL(url);
                    return /kuaishou\.com$/i.test(u.hostname) || /gifshow\.com$/i.test(u.hostname);
                } catch(e) { return false; }
            },
            isVideo: function(url) {
                try {
                    var u = new URL(url);
                    return /\/short-video\//i.test(u.pathname) || /\/video\//i.test(u.pathname);
                } catch(e) { return false; }
            }
        },
        'xiaohongshu': {
            name: '小红书',
            icon: '📕',
            match: function(url) {
                try {
                    var u = new URL(url);
                    return /xiaohongshu\.com$/i.test(u.hostname) || /xhslink\.com$/i.test(u.hostname);
                } catch(e) { return false; }
            },
            isVideo: function(url) {
                try {
                    var u = new URL(url);
                    var path = u.pathname;
                    return /^\/explore\//i.test(path) || /^\/discovery\/item\//i.test(path) || /\/short-video\//i.test(path) || /\/video\//i.test(path);
                } catch(e) { return false; }
            }
        },
        'weibo': {
            name: '微博',
            icon: '🌐',
            match: function(url) {
                try {
                    var u = new URL(url);
                    return /weibo\.com$/i.test(u.hostname) || /weibo\.cn$/i.test(u.hostname);
                } catch(e) { return false; }
            },
            isVideo: function(url) {
                try {
                    var u = new URL(url);
                    return /\/tv\/show\//i.test(u.pathname) || /\/video\//i.test(u.pathname);
                } catch(e) { return false; }
            }
        },
        'zhihu': {
            name: '知乎',
            icon: '💡',
            match: function(url) {
                try {
                    var u = new URL(url);
                    return /zhihu\.com$/i.test(u.hostname);
                } catch(e) { return false; }
            },
            isVideo: function(url) {
                try {
                    var u = new URL(url);
                    var path = u.pathname;
                    return /\/video\//i.test(path) || /\/question\/\d+\/answer\/\d+/i.test(path);
                } catch(e) { return false; }
            }
        },
        'weixin': {
            name: '微信视频号',
            icon: '💬',
            match: function(url) {
                try {
                    var u = new URL(url);
                    return /channels\.weixin\.qq\.com$/i.test(u.hostname);
                } catch(e) { return false; }
            },
            isVideo: function(url) {
                try {
                    var u = new URL(url);
                    return /\/video\//i.test(u.pathname) || /\/feed\//i.test(u.pathname);
                } catch(e) { return false; }
            }
        }
    };

    SEC.detectVideoSite = function(url) {
        if (!url || !U.isStr(url)) return null;
        for (var key in SEC.VIDEO_SITES) {
            if (SEC.VIDEO_SITES.hasOwnProperty(key)) {
                var site = SEC.VIDEO_SITES[key];
                if (site.match(url) && site.isVideo(url)) {
                    return { key: key, name: site.name, icon: site.icon };
                }
            }
        }
        return null;
    };

    // ===== AES-128-CBC 解密（用于 HLS 加密 m3u8）=====
    // 使用浏览器原生 Web Crypto API (crypto.subtle)，保证算法正确性并利用硬件加速
    var AES = {};

    // 将 Uint8Array 转为 16 字节（不足补零，超过截断）
    AES.pad16 = function (bytes) {
        if (!bytes) return null;
        var out = new Uint8Array(16);
        var n = Math.min(16, bytes.length);
        for (var i = 0; i < n; i++) out[i] = bytes[i];
        return out;
    };

    // hex -> Uint8Array
    AES.hexToBytes = function (hex) {
        if (!hex || hex.length % 2 !== 0) return null;
        var out = new Uint8Array(hex.length / 2);
        for (var i = 0; i < hex.length; i += 2) {
            out[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return out;
    };

    // Uint8Array -> 字符串（用于调试，不做 += 拼接）
    AES.bytesToStr = function (arr) {
        if (!arr) return '';
        try {
            if (typeof TextDecoder !== 'undefined') return new TextDecoder('utf-8').decode(arr);
        } catch (e) {}
        // 兜底: 使用 Array.join
        var chars = new Array(arr.length);
        for (var i = 0; i < arr.length; i++) chars[i] = String.fromCharCode(arr[i]);
        return chars.join('');
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
                // 下一行是 URL
                if (i + 1 < lines.length) {
                    var nextLine = lines[i + 1].trim();
                    if (nextLine && nextLine.indexOf('#') !== 0) {
                        result.streams.push({
                            url: SEC.absUrl(nextLine, baseUrl),
                            bandwidth: bandwidth,
                            resolution: resolution,
                            label: bandwidth > 5000000 ? '高清' : bandwidth > 2000000 ? '标清' : '低清'
                        });
                        i++; // 跳过 URL 行
                    }
                }
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

    // ===== 获取密钥 =====
    M3U8.fetchKey = function (keyUrl, cb) {
        // 优先使用 GM_xmlhttpRequest 支持跨域；失败降级到 XHR
        var useGM = (typeof GM_xmlhttpRequest === 'function');
        var method = useGM ? 'GM_xmlhttpRequest' : 'XMLHttpRequest';
        LOG.info('密钥请求方式:', method, 'URL:', keyUrl);

        try {
            if (useGM) {
                var gmTimeout = setTimeout(function () { cb(null, '密钥请求超时'); }, 25000);
                try {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: keyUrl,
                        responseType: 'arraybuffer',
                        onload: function (resp) {
                            clearTimeout(gmTimeout);
                            try {
                                if (resp.status >= 200 && resp.status < 300 && resp.response) {
                                    var keyBytes = new Uint8Array(resp.response);
                                    if (keyBytes.length === 16) { LOG.info('密钥获取成功 (GM)'); cb(keyBytes, null); }
                                    else cb(null, '密钥长度错误: ' + keyBytes.length);
                                } else cb(null, '密钥请求失败 (GM): ' + resp.status);
                            } catch (err) { cb(null, 'GM 密钥处理异常: ' + err.message); }
                        },
                        onerror: function (err) {
                            clearTimeout(gmTimeout);
                            LOG.warn('GM 密钥请求失败，降级 XHR:', err);
                            // 降级 XHR
                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', keyUrl, true);
                            xhr.responseType = 'arraybuffer';
                            xhr.timeout = 15000;
                            xhr.onload = function () {
                                if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
                                    var keyBytes = new Uint8Array(xhr.response);
                                    if (keyBytes.length === 16) { LOG.info('密钥获取成功 (XHR)'); cb(keyBytes, null); }
                                    else cb(null, '密钥长度错误: ' + keyBytes.length);
                                } else cb(null, '密钥请求失败: ' + xhr.status);
                            };
                            xhr.onerror = function () { cb(null, '密钥请求网络错误'); };
                            xhr.ontimeout = function () { cb(null, '密钥请求超时'); };
                            xhr.send();
                        },
                        ontimeout: function () { cb(null, '密钥请求超时'); }
                    });
                } catch (ge) { cb(null, 'GM 请求异常: ' + ge.message); }
            } else {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', keyUrl, true);
                xhr.responseType = 'arraybuffer';
                xhr.timeout = 15000;
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
                        var keyBytes = new Uint8Array(xhr.response);
                        if (keyBytes.length === 16) { LOG.info('密钥获取成功'); cb(keyBytes, null); }
                        else cb(null, '密钥长度错误: ' + keyBytes.length);
                    } else cb(null, '密钥请求失败: ' + xhr.status);
                };
                xhr.onerror = function () { cb(null, '密钥请求网络错误'); };
                xhr.ontimeout = function () { cb(null, '密钥请求超时'); };
                xhr.send();
            }
        } catch (e) { cb(null, '密钥请求异常: ' + e.message); }
    };

    // ===== 下载单个分片 =====
    M3U8.fetchSegment = function (segUrl, cb) {
        // 优先使用 GM_xmlhttpRequest 支持跨域；失败降级到 XHR
        var useGM = (typeof GM_xmlhttpRequest === 'function');

        try {
            if (useGM) {
                var gmTimeout = setTimeout(function () { cb(null, '分片请求超时'); }, 40000);
                try {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: segUrl,
                        responseType: 'arraybuffer',
                        onload: function (resp) {
                            clearTimeout(gmTimeout);
                            try {
                                if (resp.status >= 200 && resp.status < 300 && resp.response) {
                                    cb(new Uint8Array(resp.response), null);
                                } else cb(null, '分片请求失败: ' + resp.status);
                            } catch (err) { cb(null, 'GM 分片处理异常: ' + err.message); }
                        },
                        onerror: function (err) {
                            clearTimeout(gmTimeout);
                            LOG.warn('GM 分片请求失败，降级 XHR');
                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', segUrl, true);
                            xhr.responseType = 'arraybuffer';
                            xhr.timeout = 30000;
                            xhr.onload = function () {
                                if (xhr.status >= 200 && xhr.status < 300 && xhr.response) cb(new Uint8Array(xhr.response), null);
                                else cb(null, '分片请求失败: ' + xhr.status);
                            };
                            xhr.onerror = function () { cb(null, '分片网络错误'); };
                            xhr.ontimeout = function () { cb(null, '分片超时'); };
                            xhr.send();
                        },
                        ontimeout: function () { cb(null, '分片请求超时'); }
                    });
                } catch (ge) { cb(null, 'GM 分片请求异常: ' + ge.message); }
            } else {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', segUrl, true);
                xhr.responseType = 'arraybuffer';
                xhr.timeout = 30000;
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300 && xhr.response) cb(new Uint8Array(xhr.response), null);
                    else cb(null, '分片请求失败: ' + xhr.status);
                };
                xhr.onerror = function () { cb(null, '分片网络错误'); };
                xhr.ontimeout = function () { cb(null, '分片超时'); };
                xhr.send();
            }
        } catch (e) { cb(null, '分片请求异常: ' + e.message); }
    };

    // ===== 下载并解密所有分片，合并为完整视频 =====
    M3U8.downloadAndMerge = function (m3u8Url, options, progressCb, doneCb) {
        // options: {quality: 'auto'|'high'|'medium'|'low', concurrency: 3}
        var opts = options || {};
        var concurrency = opts.concurrency || 3;
        var qualityPref = opts.quality || 'auto';

        // 获取 m3u8 内容（优先 GM_xmlhttpRequest 支持跨域）
        try {
            var fetchM3u8 = function(url, onOk, onErr) {
                if (typeof GM_xmlhttpRequest === 'function') {
                    try {
                        GM_xmlhttpRequest({
                            method: 'GET', url: url, timeout: 25000,
                            onload: function (resp) {
                                if (resp.status >= 200 && resp.status < 300 && resp.responseText) onOk(resp.responseText);
                                else onErr('m3u8 请求失败: ' + resp.status);
                            },
                            onerror: function () {
                                LOG.warn('GM m3u8 请求失败，降级 XHR');
                                var xhr = new XMLHttpRequest();
                                xhr.open('GET', url, true); xhr.timeout = 20000;
                                xhr.onload = function () {
                                    if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText) onOk(xhr.responseText);
                                    else onErr('m3u8 请求失败: ' + xhr.status);
                                };
                                xhr.onerror = function () { onErr('m3u8 网络错误'); };
                                xhr.ontimeout = function () { onErr('m3u8 超时'); };
                                xhr.send();
                            },
                            ontimeout: function () { onErr('m3u8 请求超时'); }
                        });
                        return;
                    } catch (ge) { LOG.warn('GM m3u8 请求异常:', ge.message); }
                }
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true); xhr.timeout = 20000;
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText) onOk(xhr.responseText);
                    else onErr('m3u8 请求失败: ' + xhr.status);
                };
                xhr.onerror = function () { onErr('m3u8 网络错误'); };
                xhr.ontimeout = function () { onErr('m3u8 超时'); };
                xhr.send();
            };

            fetchM3u8(m3u8Url, function(m3u8Text) {
                var parsed = M3U8.parse(m3u8Text, m3u8Url);
                if (parsed.isMaster && parsed.streams.length > 0) {
                    var selectedStream = M3U8.selectStream(parsed.streams, qualityPref);
                    LOG.info('选择码率:', selectedStream.label, selectedStream.resolution);
                    M3U8.downloadAndMerge(selectedStream.url, opts, progressCb, doneCb);
                    return;
                }
                if (parsed.segments.length === 0) { doneCb(null, 'm3u8 无分片'); return; }
                LOG.info('开始下载分片:', parsed.segments.length, '加密:', parsed.encrypted);

                var proceed = function(key) {
                    M3U8._downloadSegments(parsed.segments, key, parsed.keyIv, concurrency, progressCb, doneCb);
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
    M3U8._downloadSegments = function (segments, key, iv, concurrency, progressCb, doneCb) {
        var total = segments.length;
        var downloaded = 0;
        var failed = 0;
        var chunks = new Array(total);
        var idx = 0;
        var running = 0;
        M3U8._stopped = false;
        var completed = new Array(total); // 记录每个分片是否完成

        function tryFinish() {
            if (idx < total) return;
            if (running > 0) return;
            if (M3U8._stopped) return;
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
            // HLS 默认：使用分片序号（Media Sequence Number）作为 IV
            var out = new Uint8Array(16);
            var seqNum = segIndex; // 使用数组下标近似
            var str = (seqNum || 0).toString(16).padStart(32, '0');
            for (var i = 0; i < 16; i++) out[i] = parseInt(str.substr(i * 2, 2), 16);
            return out;
        }

        function worker() {
            if (M3U8._stopped || idx >= total) { tryFinish(); return; }
            var curIdx = idx++;
            running++;
            M3U8.fetchSegment(segments[curIdx].url, function (data, err) {
                if (err) {
                    failed++; running--;
                    LOG.warn('分片下载失败:', curIdx, err);
                    if (!M3U8._stopped) worker(); else tryFinish();
                    return;
                }
                // 如果加密，使用异步 AES-128-CBC 解密
                if (key) {
                    var segIv = makeIv(curIdx);
                    AES.decryptCBC(data, key, segIv, function (dec, derr) {
                        if (derr) {
                            failed++; running--;
                            LOG.warn('分片解密失败:', curIdx, derr);
                            if (!M3U8._stopped) worker(); else tryFinish();
                            return;
                        }
                        chunks[curIdx] = dec;
                        downloaded++; running--;
                        if (progressCb) progressCb(downloaded, total, failed);
                        if (!M3U8._stopped) worker(); else tryFinish();
                    });
                } else {
                    chunks[curIdx] = data;
                    downloaded++; running--;
                    if (progressCb) progressCb(downloaded, total, failed);
                    if (!M3U8._stopped) worker(); else tryFinish();
                }
            });
        }

        for (var w = 0; w < concurrency; w++) worker();
    };

    // ===== 停止下载 =====
    M3U8.stopDownload = function () {
        M3U8._stopped = true;
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
    // 💾 模块 4：状态管理 (State) + 配置校验
    // =========================================================================
    var DEFAULT_CONFIG = {
        theme: 'auto',
        uiStyle: 'normal',         // 界面风格: normal / material / apple
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
        translateCache: {},
        downloading: false,
        downloadProgress: null,  // {total, done, failed, speed, eta}
        downloadHistory: [],     // {url, name, time, success}
        // P1-2: 元信息缓存
        metaCache: {},           // url -> {size, width, height, duration, type}
        streamMap: {},           // streamId -> videoElement（MediaStream 录制用）
        // P2-4: 多标签页同步
        syncChannel: null,
    };

    // ===== 配置校验 =====
    State.validateConfig = function (cfg) {
        var errors = [];
        if (!cfg) return ['配置为空'];
        // 检查必要字段类型
        if (typeof cfg.theme !== 'string' || !['auto','light','dark'].includes(cfg.theme)) errors.push('theme 必须是 auto/light/dark');
        if (typeof cfg.uiStyle !== 'string' || !['normal','material','apple'].includes(cfg.uiStyle)) errors.push('uiStyle 必须是 normal/material/apple');
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
                if (raw && typeof raw === 'object') {
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

    State.save = function () {
        try {
            if (typeof GM_setValue === 'function') GM_setValue('ms_config_v8', State.config);
            if (State.syncChannel) State._broadcast({ type: 'config', data: State.config });
        } catch (e) { LOG.error('配置保存失败:', e); }
    };

    // ===== 资源历史记录 =====
    State._historyKey = '_ms_history';
    State._historyLimit = 200;
    State._ensureHistory = function () {
        if (State._history) return;
        State._history = [];
        try {
            if (typeof GM_getValue === 'function') {
                var raw = GM_getValue(State._historyKey, '');
                if (raw) {
                    var arr = U.safeJson(raw, null);
                    if (Array.isArray(arr)) State._history = arr;
                }
            }
        } catch (e) { LOG.warn('load history failed', e); }
    };
    State._saveHistory = function () {
        try {
            if (typeof GM_setValue === 'function' && State._history) {
                GM_setValue(State._historyKey, JSON.stringify(State._history));
            }
        } catch (e) { LOG.warn('save history failed', e); }
    };
    State.addHistory = function (items) {
        if (!State.config.enableHistory) return;
        if (!items || items.length === 0) return;
        State._ensureHistory();
        var changed = false;
        for (var i = 0; i < items.length; i++) {
            var it = items[i];
            if (!it || !it.url) continue;
            var kind = it.type || it.kind || SEC.guessKind(it.url) || 'video';
            var existing = -1;
            for (var j = State._history.length - 1; j >= 0; j--) {
                if (State._history[j].url === it.url && State._history[j].kind === kind) { existing = j; break; }
            }
            if (existing >= 0) State._history.splice(existing, 1);
            State._history.unshift({
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
        while (State._history.length > State._historyLimit) State._history.pop();
        State._saveHistory();
    };
    State.getHistory = function () { State._ensureHistory(); return State._history.slice(); };
    State.clearHistory = function () { State._history = []; State._saveHistory(); };

    State._computeTheme = function () {
        var theme = State.config.theme;
        if (theme === 'auto') {
            // 跟随系统：检查 prefers-color-scheme
            try {
                if (typeof matchMedia === 'function') {
                    var m = matchMedia('(prefers-color-scheme: dark)');
                    State._computedTheme = m.matches ? 'dark' : 'light';
                    // 监听系统主题变化
                    if (typeof m.addEventListener === 'function') {
                        m.addEventListener('change', function(ev) {
                            State._computedTheme = ev.matches ? 'dark' : 'light';
                            if (typeof applyPanelThemeNow === 'function') applyPanelThemeNow();
                        });
                    } else if (typeof m.addListener === 'function') {
                        m.addListener(function(ev) {
                            State._computedTheme = ev.matches ? 'dark' : 'light';
                            if (typeof applyPanelThemeNow === 'function') applyPanelThemeNow();
                        });
                    }
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
            return { ok: true, msg: '✅ 配置已导入并校验通过' };
        } catch (e) { return { ok: false, msg: '解析失败: ' + e.message }; }
    };
    State.resetConfig = function () {
        State.config = U.deepClone(DEFAULT_CONFIG);
        State.save();
        LOG.setLevel(DEFAULT_CONFIG.logLevel);
    };

    State.shouldRun = function () {
        try {
            var host = location.hostname;
            if (State.config.whitelistMode) {
                for (var i = 0; i < State.config.whitelist.length; i++)
                    if (host === State.config.whitelist[i] || host.indexOf('.' + State.config.whitelist[i]) !== -1) return true;
                return false;
            }
            for (var j = 0; j < State.config.blacklist.length; j++)
                if (host === State.config.blacklist[j] || host.indexOf('.' + State.config.blacklist[j]) !== -1) return false;
        } catch (e) {}
        return true;
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
    // 🕵 模块 5：网络拦截 (Net Hook) + 防抖聚合
    // =========================================================================
    var NetState = { hits: new Set(), queue: [], flushing: false };
    NetState._flush = function () {
        if (NetState.flushing || NetState.queue.length === 0) return;
        NetState.flushing = true;
        var batch = NetState.queue.splice(0, Math.min(100, NetState.queue.length));
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
        State.images = U.uniq(State.images);
        State.videos = U.uniq(State.videos);
        State.audios = U.uniq(State.audios);
        State.m3u8 = U.uniq(State.m3u8);
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
    var installNetHook = NetState.install;
    var Toast = (function () {
        'use strict';
    // =========================================================================
    // 📣 模块 6：Toast + 状态条
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

    function toast(msg, color, dur, onClick) {
        try {
            var clickable = typeof onClick === 'function';
            var t = document.createElement('div');
            t.style.cssText = 'position:fixed;left:50%;top:60px;transform:translateX(-50%);padding:10px 20px;border-radius:12px;background:' + (color || MS_CONFIG.COLORS.success) + ';color:' + MS_CONFIG.COLORS.white + ';font-size:14px;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,.3);z-index:' + (MS_CONFIG.SIZES.zMax - 1) + ';pointer-events:' + (clickable ? 'auto' : 'none') + ';cursor:' + (clickable ? 'pointer' : 'default') + ';max-width:90vw;text-align:center;';
            t.textContent = msg || '';
            if (clickable) t.addEventListener('click', function (e) { try { onClick(e); } catch (err) {} });
            (document.body || document.documentElement).appendChild(t);
            setTimeout(function () {
                try { t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(-10px)'; } catch (e) {}
                setTimeout(function () { try { t.remove(); } catch (e) {} }, 300);
            }, dur || 2200);
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
    // 🎬 模块 6b：视频平台地址解析 (Video Resolver)
    // =========================================================================
    var VideoResolver = {};
    VideoResolver._cache = {};
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

    VideoResolver.resolve = function(url, cb, options) {
        if (VideoResolver._cache[url]) { cb(VideoResolver._cache[url], null); return; }
        if (VideoResolver._isErrorCached(url)) {
            cb(null, VideoResolver._errorCache[url].error);
            return;
        }
        if (Plugins.tryCustomParser(url, function(data, err) {
            if (data) {
                VideoResolver._cache[url] = data;
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
        var timedOut = false;
        var resolveTimeout = null;
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
                    clearTimeout(resolveTimeout);
                    VideoResolver._cache[url] = data;
                    cb(data, null);
                } else {
                    handleAttemptError(err);
                }
            }, currentAttempt);
        };
        var handleAttemptError = function(err) {
            attempt++;
            if (attempt < retryTimes) {
                var delay = 500 * Math.pow(2, attempt - 1);
                setTimeout(tryResolve, delay);
            } else {
                clearTimeout(resolveTimeout);
                VideoResolver._cacheError(url, err || '解析失败');
                cb(null, err || '解析失败');
            }
        };
        resolveTimeout = setTimeout(function() {
            timedOut = true;
            VideoResolver._cacheError(url, '解析总超时');
            cb(null, '解析总超时');
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
            var backupApi = 'https://api.bilibili.com/x/web-interface/view?';
            var thirdApi = 'https://api.bilibili.com/x/web-interface/view/detail?';
            if (bvid) {
                primaryApi += 'bvid=' + encodeURIComponent(bvid);
                backupApi += 'bvid=' + encodeURIComponent(bvid);
                thirdApi += 'bvid=' + encodeURIComponent(bvid);
            } else {
                primaryApi += 'aid=' + aid;
                backupApi += 'aid=' + aid;
                thirdApi += 'aid=' + aid;
            }
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
                        siteIcon: '📺',
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
                                    if (apiIndex === 0) {
                                        fetchVideoInfo(backupApi, 1, false);
                                    } else if (apiIndex === 1) {
                                        fetchVideoInfo(thirdApi, 2, true);
                                    } else {
                                        var errInfo = VideoResolver._classifyError(data, 'api');
                                        cb(null, errInfo.message);
                                    }
                                }
                            } catch(e) {
                                if (apiIndex === 0) {
                                    fetchVideoInfo(backupApi, 1, false);
                                } else if (apiIndex === 1) {
                                    fetchVideoInfo(thirdApi, 2, true);
                                } else {
                                    cb(null, e.message);
                                }
                            }
                        },
                        onerror: function() {
                            if (apiIndex === 0) {
                                fetchVideoInfo(backupApi, 1, false);
                            } else if (apiIndex === 1) {
                                fetchVideoInfo(thirdApi, 2, true);
                            } else {
                                cb(null, '网络请求失败');
                            }
                        },
                        ontimeout: function() {
                            if (apiIndex === 0) {
                                fetchVideoInfo(backupApi, 1, false);
                            } else if (apiIndex === 1) {
                                fetchVideoInfo(thirdApi, 2, true);
                            } else {
                                cb(null, '请求超时');
                            }
                        }
                    });
                };
                fetchVideoInfo(primaryApi, 0, false);
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
                                siteIcon: '🎵',
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
                                siteIcon: '⚡',
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
                                var titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                                if (titleMatch) {
                                    result.title = titleMatch[1].trim();
                                }
                                var coverMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
                                if (coverMatch) {
                                    result.cover = coverMatch[1];
                                }
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
                                siteIcon: '📕',
                                siteName: '小红书'
                            };
                            var titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                            if (titleMatch) {
                                result.title = titleMatch[1].trim();
                            }
                            var coverMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
                            if (coverMatch) {
                                result.cover = coverMatch[1];
                            }
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
                                siteIcon: '🌐',
                                siteName: '微博'
                            };
                            var titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                            if (titleMatch) {
                                result.title = titleMatch[1].trim();
                            }
                            var coverMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
                            if (coverMatch) {
                                result.cover = coverMatch[1];
                            }
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
                                siteIcon: '💡',
                                siteName: '知乎'
                            };
                            var titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                            if (titleMatch) {
                                result.title = titleMatch[1].trim();
                            }
                            var coverMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
                            if (coverMatch) {
                                result.cover = coverMatch[1];
                            }
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
                                siteIcon: '💬',
                                siteName: '微信视频号'
                            };
                            var titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                            if (titleMatch) {
                                result.title = titleMatch[1].trim();
                            }
                            var coverMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
                            if (coverMatch) {
                                result.cover = coverMatch[1];
                            }
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
    // 🔌 模块 6c+：脚本市场 / 插件系统 (Plugins)
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

    Plugins.isUrlAllowed = function (url) {
        if (!url) return true;
        var host = '';
        try { host = new URL(url, location.href).hostname; } catch (e) {}
        var rules = Plugins.listRules();
        var hasAllow = false, allowed = false, blocked = false;
        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            if (!r.enabled) continue;
            if (r.action === 'allow') {
                hasAllow = true;
                if (Plugins._ruleMatch(r, host, url)) allowed = true;
            } else if (r.action === 'block' && Plugins._ruleMatch(r, host, url)) {
                blocked = true;
            }
        }
        if (hasAllow) return allowed;
        return !blocked;
    };

    Plugins.shouldRunOnHost = function (host) {
        var rules = Plugins.listRules();
        var hasAllow = false, allowed = false, blocked = false;
        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            if (!r.enabled) continue;
            if (r.action === 'allow') {
                hasAllow = true;
                if (Plugins._ruleMatch(r, host, '')) allowed = true;
            } else if (r.action === 'block' && Plugins._ruleMatch(r, host, '')) {
                blocked = true;
            }
        }
        if (hasAllow) return allowed;
        return !blocked;
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
                            siteIcon: '🔌',
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
    // 🔄 模块 6d：自动更新器 (AutoUpdater)
    // =========================================================================
    var AutoUpdater = {};
    AutoUpdater._lastCheckKey = '_ms_last_update_check';
    AutoUpdater._skipVersionKey = '_ms_skip_version';

    AutoUpdater._semverCompare = function (v1, v2) {
        var parse = function (v) {
            v = v.replace(/^v/i, '').replace(/-beta.*/i, '').replace(/-alpha.*/i, '').replace(/-rc.*/i, '');
            var parts = v.split('.');
            return [parseInt(parts[0]) || 0, parseInt(parts[1]) || 0, parseInt(parts[2]) || 0];
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
            var obj = JSON.parse(raw);
            return obj;
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
                    '<span style="font-size:24px;">🎉</span>' +
                    '<span style="font-size:18px;font-weight:700;">发现新版本</span>' +
                '</div>' +
                '<div style="font-size:13px;opacity:.9;">' + LANG.t('mediaSniffer') + ' v' + info.version.replace(/^v/i, '') + '</div>';

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
            dlBtn.textContent = '去 GitHub 下载';
            dlBtn.style.cssText = 'flex:1;padding:12px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:14px;font-weight:600;cursor:pointer;';
            dlBtn.onclick = function () {
                try {
                    window.open(info.htmlUrl, '_blank');
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

    AutoUpdater.check = function (options) {
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
    // 🎬 模块 6c：视频链接预览 (Video Link Preview)
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
                    siteIcon: '⚠️',
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

        var siteIcon = data.siteIcon || '📺';
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
                options += '<option value="' + i + '" ' + selected + '>' + (q.label || ('清晰度 ' + i)) + '</option>';
            }
            return options;
        }

        function buildStatsHtml() {
            var stats = [];
            if (data.viewCount !== undefined) stats.push('<span title="播放量">▶️ ' + _formatNumber(data.viewCount) + '</span>');
            if (data.likeCount !== undefined) stats.push('<span title="点赞">👍 ' + _formatNumber(data.likeCount) + '</span>');
            if (data.coinCount !== undefined) stats.push('<span title="投币">🪙 ' + _formatNumber(data.coinCount) + '</span>');
            if (data.favoriteCount !== undefined) stats.push('<span title="收藏">⭐ ' + _formatNumber(data.favoriteCount) + '</span>');
            if (data.replyCount !== undefined) stats.push('<span title="评论">💬 ' + _formatNumber(data.replyCount) + '</span>');
            if (stats.length === 0) return '';
            return '<div style="display:flex;flex-wrap:wrap;gap:12px;font-size:12px;color:' + c.sub + ';margin-bottom:10px;">' + stats.join('') + '</div>';
        }

        function buildUploaderHtml() {
            var parts = [];
            if (ownerFace) {
                parts.push('<img src="' + ownerFace + '" alt="" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">');
            }
            if (owner) {
                parts.push('<span style="font-size:13px;color:' + c.txt + ';font-weight:500;">' + owner + '</span>');
            }
            if (data.pubdate) {
                parts.push('<span style="font-size:11px;color:' + c.sub + ';">📅 ' + _formatPubDate(data.pubdate) + '</span>');
            }
            if (parts.length === 0) return '';
            return '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-top:1px solid ' + c.border + ';margin-top:8px;">' + parts.join('') + '</div>';
        }

        function buildVideoInfoHtml() {
            var rows = [];
            if (data.bvid) {
                rows.push('<span>📺 BV号: <code style="background:' + c.bg + ';padding:2px 6px;border-radius:4px;">' + data.bvid + '</code></span>');
            }
            if (data.duration) {
                rows.push('<span>⏱ 时长: ' + Math.floor(data.duration / 60) + ':' + String(data.duration % 60).padStart(2, '0') + '</span>');
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

        function buildErrorHtml() {
            if (!resolveError) return '';
            return '<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px;margin-bottom:16px;text-align:center;">' +
                '<div style="font-size:32px;margin-bottom:8px;">⚠️</div>' +
                '<div style="font-size:14px;color:#dc2626;font-weight:500;margin-bottom:4px;">解析失败</div>' +
                '<div style="font-size:12px;color:#ef4444;margin-bottom:12px;">' + resolveError + '</div>' +
                (originalUrl ? '<button id="_ms_vlp_retry" style="padding:8px 20px;border:none;border-radius:8px;background:#ef4444;color:#fff;font-size:13px;font-weight:500;cursor:pointer;">🔄 重试</button>' : '') +
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
                    (siteName ? '<span style="font-size:12px;color:' + c.sub + ';">— ' + siteName + '</span>' : '') +
                '</div>' +
                '<button id="_ms_vlp_close" style="width:40px;height:40px;border:none;border-radius:10px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;flex-shrink:0;">×</button>' +
            '</div>' +
            '</div>' +

            '<div style="padding:' + (isMobile ? '12px 14px' : '20px') + ';">' +
                buildErrorHtml() +

                // 标题区域
                '<div style="margin-bottom:12px;">' +
                    '<h2 style="margin:0 0 8px;font-size:' + (isMobile ? '16px' : '18px') + ';color:' + c.txt + ';line-height:1.4;">' + title + '</h2>' +
                    buildStatsHtml() +
                '</div>' +

                // 视频播放器区域
                '<div id="_ms_vlp_player" style="background:#000;border-radius:12px;overflow:hidden;margin-bottom:12px;position:relative;touch-action:manipulation;">' +
                    (cover ? '<img id="_ms_vlp_cover" src="' + cover + '" style="width:100%;display:block;max-height:360px;object-fit:contain;">' : '') +
                    '<div id="_ms_vlp_loading" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:14px;">加载中...</div>' +
                    '<div id="_ms_vlp_video_error" style="display:none;position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);flex-direction:column;align-items:center;justify-content:center;color:#fff;padding:20px;text-align:center;">' +
                        '<div style="font-size:32px;margin-bottom:8px;">⚠️</div>' +
                        '<div id="_ms_vlp_error_msg" style="font-size:13px;margin-bottom:12px;">视频加载失败</div>' +
                        '<button id="_ms_vlp_video_retry" style="padding:6px 16px;border:none;border-radius:6px;background:#ef4444;color:#fff;font-size:12px;cursor:pointer;">🔄 重试</button>' +
                    '</div>' +
                '</div>' +

                // 画质选择
                buildQualitySelectorHtml() +

                // 视频信息
                buildVideoInfoHtml() +

                // UP主信息
                buildUploaderHtml() +

                // 操作按钮
                '<div id="_ms_vlp_autoplay_row" style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding:10px 14px;background:' + c.bg2 + ';border-radius:10px;">' +
                    '<span style="font-size:13px;color:' + c.txt + ';display:flex;align-items:center;gap:6px;">' +
                        '<span>🔊</span>自动播放' +
                    '</span>' +
                    '<div id="_ms_vlp_autoplay_toggle" style="position:relative;width:44px;height:24px;border-radius:12px;cursor:pointer;transition:background 0.2s;background:' + (State.config.autoPlayPreview ? '#6366f1' : c.bg3) + ';">' +
                        '<div style="position:absolute;top:2px;left:' + (State.config.autoPlayPreview ? '22px' : '2px') + ';width:20px;height:20px;border-radius:50%;background:#fff;transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>' +
                    '</div>' +
                '</div>' +
                (isMobile ?
                '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px;margin-bottom:16px;">' +
                    '<button id="_ms_vlp_play" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 8px;border:none;border-radius:12px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-size:12px;font-weight:600;cursor:pointer;">' +
                        '<span style="font-size:22px;">▶️</span><span>播放</span>' +
                    '</button>' +
                    '<button id="_ms_vlp_dl" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 8px;border:none;border-radius:12px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-size:12px;font-weight:600;cursor:pointer;">' +
                        '<span style="font-size:22px;">📥</span><span>下载</span>' +
                    '</button>' +
                    '<button id="_ms_vlp_copy" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 8px;border:none;border-radius:12px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;font-size:12px;font-weight:600;cursor:pointer;">' +
                        '<span style="font-size:22px;">📋</span><span>复制</span>' +
                    '</button>' +
                '</div>' :
                '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;margin-bottom:16px;">' +
                    '<button id="_ms_vlp_play" style="flex:1;min-width:120px;padding:12px 20px;border:none;border-radius:10px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-size:14px;font-weight:600;cursor:pointer;">▶ 播放视频</button>' +
                    '<button id="_ms_vlp_dl" style="flex:1;min-width:120px;padding:12px 20px;border:none;border-radius:10px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-size:14px;font-weight:600;cursor:pointer;">📥 下载视频</button>' +
                    '<button id="_ms_vlp_copy" style="flex:1;min-width:120px;padding:12px 20px;border:none;border-radius:10px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;font-size:14px;font-weight:600;cursor:pointer;">📋 复制链接</button>' +
                '</div>') +

                // 链接显示
                '<div style="border-top:1px solid ' + c.border + ';padding-top:16px;">' +
                    '<div style="font-size:12px;color:' + c.sub + ';margin-bottom:6px;">视频地址</div>' +
                    '<div id="_ms_vlp_video_url_text" style="background:' + c.bg2 + ';border-radius:8px;padding:10px;font-size:11px;color:' + c.txt + ';word-break:break-all;max-height:80px;overflow-y:auto;font-family:monospace;">' + (videoUrl || '解析中...') + '</div>' +
                    (audioUrl ? '<div style="margin-top:8px;"><div style="font-size:12px;color:' + c.sub + ';margin-bottom:6px;">音频地址（DASH格式）</div><div style="background:' + c.bg2 + ';border-radius:8px;padding:10px;font-size:11px;color:' + c.txt + ';word-break:break-all;max-height:60px;overflow-y:auto;font-family:monospace;">' + audioUrl + '</div></div>' : '') +
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
                var currentTime = vid.currentTime;
                var wasPlaying = !vid.paused;
                vid.src = newUrl;
                vid.load();
                if (wasPlaying) {
                    vid.play().catch(function(){});
                }
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
            var page = pages[index];
            toast('切换到 P' + (index + 1) + ': ' + (page.part || ''), '#6366f1');
        }
    };

        return VideoLinkPreview;
    })();
    var Meta = (function () {
        'use strict';
    // =========================================================================
    // 📊 模块 7：元信息提取 (Meta Fetcher - P1-2)
    // =========================================================================
    var Meta = {};
    // 获取文件大小（通过 HEAD 请求 Content-Length）
    Meta.fetchSize = function (url, cb) {
        if (State.metaCache[url] && State.metaCache[url].size) { cb(State.metaCache[url].size, null); return; }
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', url, true);
            xhr.timeout = 10000;
            xhr.onload = function () {
                var size = 0;
                try { size = parseInt(xhr.getResponseHeader('Content-Length') || '0', 10); } catch (e) {}
                if (!State.metaCache[url]) State.metaCache[url] = {};
                State.metaCache[url].size = size;
                cb(size > 0 ? size : null, null);
            };
            xhr.onerror = function () { cb(null, '网络错误'); };
            xhr.ontimeout = function () { cb(null, '超时'); };
            xhr.send();
        } catch (e) { cb(null, e.message); }
    };

    // 获取图片尺寸（通过加载图片）
    Meta.fetchImageSize = function (url, cb) {
        if (State.metaCache[url] && State.metaCache[url].width) { cb(State.metaCache[url].width, State.metaCache[url].height, null); return; }
        try {
            var img = new Image();
            img.onload = function () {
                if (!State.metaCache[url]) State.metaCache[url] = {};
                State.metaCache[url].width = img.naturalWidth || img.width;
                State.metaCache[url].height = img.naturalHeight || img.height;
                cb(img.naturalWidth || img.width, img.naturalHeight || img.height, null);
            };
            img.onerror = function () { cb(null, null, '加载失败'); };
            img.src = url;
        } catch (e) { cb(null, null, e.message); }
    };

    // 获取视频时长（通过加载 video 元素）
    Meta.fetchVideoDuration = function (url, cb) {
        if (State.metaCache[url] && State.metaCache[url].duration) { cb(State.metaCache[url].duration, null); return; }
        try {
            var v = document.createElement('video');
            v.preload = 'metadata';
            v.onloadedmetadata = function () {
                if (!State.metaCache[url]) State.metaCache[url] = {};
                State.metaCache[url].duration = v.duration;
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
                if (!State.metaCache[url]) State.metaCache[url] = {};
                State.metaCache[url].duration = a.duration;
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

        function worker(idx) {
            if (idx >= total) {
                if (done >= total) doneCb(results);
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
    Meta.filterResources = function (urls, kind) {
        var cfg = State.config;
        var filtered = [];
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            var meta = State.metaCache[url] || {};
            var pass = true;

            if (kind === 'image') {
                // 图片大小筛选
                if (cfg.minImageSize > 0 && meta.size && meta.size < cfg.minImageSize) pass = false;
                if (cfg.minImageWidth > 0 && meta.width && meta.width < cfg.minImageWidth) pass = false;
                if (cfg.minImageHeight > 0 && meta.height && meta.height < cfg.minImageHeight) pass = false;
            } else if (kind === 'video') {
                if (cfg.minVideoDuration > 0 && meta.duration && meta.duration < cfg.minVideoDuration) pass = false;
                if (cfg.maxVideoDuration > 0 && meta.duration && meta.duration > cfg.maxVideoDuration) pass = false;
            } else if (kind === 'audio') {
                if (cfg.minAudioDuration > 0 && meta.duration && meta.duration < cfg.minAudioDuration) pass = false;
            }

            if (pass) filtered.push(url);
        }
        LOG.info('筛选结果:', kind, '原始', urls.length, '过滤后', filtered.length);
        return filtered;
    };

        return Meta;
    })();
    var TranslateEngine = (function () {
        'use strict';
    // =========================================================================
    // 🌐 模块 8：翻译引擎 (TranslateEngine) - 多引擎架构
    // =========================================================================
    var TranslateEngine = {};

    // ===== 引擎注册表 =====
    TranslateEngine._engines = {};
    TranslateEngine._current = 'mymemory';

    // ===== 语言映射 =====
    TranslateEngine.LANG_MAP = {
        'zh-CN': 'zh-CN', 'zh': 'zh-CN', 'zh-TW': 'zh-TW',
        'en': 'en', 'en-US': 'en', 'en-GB': 'en',
        'ja': 'ja', 'ko': 'ko', 'fr': 'fr', 'de': 'de',
        'es': 'es', 'ru': 'ru', 'pt': 'pt', 'it': 'it',
        'ar': 'ar', 'th': 'th', 'vi': 'vi', 'id': 'id',
        'auto': 'auto'
    };

    // ===== 注册引擎 =====
    TranslateEngine.register = function (key, config) {
        TranslateEngine._engines[key] = {
            key: key,
            name: config.name || key,
            label: config.label || key,
            icon: config.icon || '🌐',
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
        var cacheKey = engine.key + '|' + f + '|' + t + '|' + text.substring(0, 100);
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
                State.translateCache[cacheKey] = result;
                if (cb) cb(result, null);
            }
        });
    };

    // ===== 分段翻译 =====
    TranslateEngine._translateChunks = function (engine, text, from, to, cb, baseCacheKey) {
        var maxChunk = engine.maxChars - 50; // 留出安全余量
        var chunks = [];
        var sentences = text.split(/[。！？.!?!\n]+/);
        var current = '';

        for (var i = 0; i < sentences.length; i++) {
            var s = sentences[i];
            if ((current + s).length > maxChunk) {
                if (current.trim()) chunks.push(current.trim());
                current = s;
            } else {
                current += s;
            }
        }
        if (current.trim()) chunks.push(current.trim());

        if (chunks.length === 0) chunks = [text.substring(0, maxChunk)];

        LOG.debug('分段翻译:', chunks.length, '段');

        var results = [];
        var failed = 0;
        var pending = chunks.length;

        for (var j = 0; j < chunks.length; j++) {
            engine.translate(chunks[j], from, to, function (result, err) {
                pending--;
                if (err) {
                    failed++;
                    LOG.warn('分段失败:', j, err);
                } else {
                    results.push(result);
                }
                if (pending === 0) {
                    if (failed > 0 && results.length === 0) {
                        if (cb) cb(null, LANG.t('transFail'));
                    } else {
                        var finalResult = results.join('\n');
                        State.translateCache[baseCacheKey] = finalResult;
                        if (cb) cb(finalResult, failed > 0 ? LANG.t('transPartialFail') : null);
                    }
                }
            });
        }
    };

    // ===== 降级备用引擎 =====
    TranslateEngine._fallback = function (text, from, to, cb, failedKey, cacheKey) {
        var engines = TranslateEngine.list();
        var fallbackEngines = [];

        for (var i = 0; i < engines.length; i++) {
            if (engines[i].key !== failedKey) {
                fallbackEngines.push(engines[i]);
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
                TranslateEngine._fallback(text, from, to, cb, nextEngine.key, cacheKey);
            } else {
                State.translateCache[cacheKey] = result;
                if (cb) cb(result, null);
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
        icon: '🌍',
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
                if (data && data.responseData && data.responseData.translatedText) {
                    result = data.responseData.translatedText;
                }
                if (data && data.matches && data.matches.length > 0) {
                    // 使用最高质量的匹配
                    for (var i = 0; i < data.matches.length; i++) {
                        if (data.matches[i].quality > 70) {
                            result = data.matches[i].translation;
                            break;
                        }
                    }
                }
                if (!result) { if (cb) cb(null, LANG.t('transFail')); return; }
                // 识别 MyMemory 免费额度警告并作为错误返回
                if (/MYMEMORY WARNING|INVALID LANGUAGE PAIR|NO QUERY SPECIFIED/i.test(result)) {
                    if (cb) cb(null, result);
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
        icon: '🔷',
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
        icon: '🟦',
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
        icon: '🔵',
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
        icon: '🟩',
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
    // 🔎 模块 9：DOM 扫描器 (Scanner) + requestIdleCallback 分批处理
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
            function scanFrames(win) {
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
            try {
                var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
                var textNode;
                var re = /(https?:\/\/[^\s"'<>]+\.m3u8?[^\s"'<>]*)/gi;
                while ((textNode = walker.nextNode()) !== null) {
                    var matches = textNode.textContent.match(re);
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
    Scanner.scanBackgroundsAsync = function (cb) {
        var urls = [];
        var all = document.getElementsByTagName('*');
        var limit = Math.min(all.length, 3000);
        var batchSize = 200;
        var idx = 0;
        var re = /url\(\s*(["']?)([^"')]+)\1\s*\)/;

        function batch() {
            var end = Math.min(idx + batchSize, limit);
            for (var i = idx; i < end; i++) {
                try {
                    var bg = getComputedStyle(all[i]).backgroundImage;
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
            State.images = U.uniq(imgUrls.concat(bgImgs).concat(Array.from(NetState.hits).filter(function (u) { return SEC.guessKind(u) === 'image'; })));
            State.videos = U.uniq(vidUrls.concat(Array.from(NetState.hits).filter(function (u) { return SEC.guessKind(u) === 'video'; })));
            State.audios = U.uniq(audUrls.concat(Array.from(NetState.hits).filter(function (u) { return SEC.guessKind(u) === 'audio'; })));
            State.m3u8 = U.uniq(m3u8Urls.concat(Array.from(NetState.hits).filter(function (u) { return SEC.guessKind(u) === 'm3u8'; })));
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
    // ⬇ 模块 9.6：新版扫描服务 (ScannerService) - 增量扫描 + Worker + 平台适配器
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
                var all = [];
                for (var i = 0; i < imgUrls.length; i++) all.push({ url: imgUrls[i], type: 'image', source: 'dom' });
                for (var j = 0; j < bgImgs.length; j++) all.push({ url: bgImgs[j], type: 'image', source: 'dom' });
                NetState.hits.forEach(function (u) {
                    var k = SEC.guessKind(u);
                    if (k === 'image' || k === 'video' || k === 'audio' || k === 'm3u8') all.push({ url: u, type: k, source: 'network' });
                });
                for (var v = 0; v < vidUrls.length; v++) all.push({ url: vidUrls[v], type: 'video', source: 'dom' });
                for (var a = 0; a < audUrls.length; a++) all.push({ url: audUrls[a], type: 'audio', source: 'dom' });
                for (var m = 0; m < m3u8Urls.length; m++) all.push({ url: m3u8Urls[m], type: 'm3u8', source: 'dom' });
                for (var l = 0; l < vidLinks.length; l++) {
                    var vl = vidLinks[l];
                    all.push({
                        url: vl.url,
                        type: 'stream',
                        source: 'link',
                        title: vl.title,
                        site: vl
                    });
                }
                cb(all);
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
    // ⬇ 模块 9.5：下载管理器 (DownloadManager) - 统一下载队列 + backend 扩展
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
            var ctx = {
                config: self.config,
                updateProgress: function (loaded, total) { self._updateProgress(task, loaded, total); },
                updateChunks: function (chunks, totalBytes) { self._updateChunks(task, chunks, totalBytes); },
                getResumeRecord: function (cb) { self._dbGet(self.config.storeTasks, task.id, function (err, rec) { cb(err, rec); }); }
            };
            var controller = factory(task, {
                onStart: function () { self._emit(task, 'onStart'); },
                onProgress: function (loaded, total) { self._updateProgress(task, loaded, total); },
                onComplete: function (result) {
                    self._updateProgress(task, result.totalBytes || task.totalBytes, result.totalBytes || task.totalBytes);
                    self._addHistory({ url: task.url, name: task.filename, time: U.now(), success: true, size: result.totalBytes, backend: task.backend });
                    self._emit(task, 'onComplete', result);
                    self._finish(task, true);
                },
                onError: function (error) {
                    task.state = 'error';
                    self._addHistory({ url: task.url, name: task.filename, time: U.now(), success: false, error: error.message, backend: task.backend });
                    self._emit(task, 'onError', error);
                    self._finish(task, false);
                },
                onPause: function () { task.state = 'paused'; self._emit(task, 'onPause'); },
                onResume: function () { task.state = 'running'; self._emit(task, 'onResume'); }
            }, ctx);
            task.controller = controller;
            this._updateTaskStore(task);
            if (controller && isFn(controller.start)) controller.start();
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

        DownloadManager.prototype._finish = function (task, success) {
            this._running = Math.max(0, this._running - 1);
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
                task.controller.cancel(cb);
            } else {
                this._removeTaskStore(task.id);
                this._running = Math.max(0, this._running - 1);
                if (cb) cb();
                this._schedule();
            }
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
                chunks.push({ start: start, end: end, done: false, buffer: null });
            }
            return chunks;
        };

        HttpBackend.prototype._runChunked = function () {
            var self = this;
            var threads = clamp(self.ctx.config.threads, 1, 8);
            self.pendingChunks = 0;
            self.finishedChunks = 0;

            function next() {
                if (self.cancelled) return;
                if (self.paused) return;
                var seq = self._nextPendingSeq();
                if (seq < 0) {
                    if (self.pendingChunks === 0) self._mergeAndFinish();
                    return;
                }
                var chunk = self.chunks[seq];
                self.pendingChunks++;
                self._downloadChunk(seq, chunk, function (err) {
                    self.pendingChunks--;
                    if (!err) self.finishedChunks++;
                    self._reportChunkProgress();
                    if (self.finishedChunks === self.chunks.length) {
                        self._mergeAndFinish();
                    } else {
                        next();
                    }
                });
                if (self.pendingChunks < threads) next();
            }
            next();
        };

        HttpBackend.prototype._nextPendingSeq = function () {
            for (var i = 0; i < this.chunks.length; i++) {
                if (!this.chunks[i].done && !this.chunks[i].running) return i;
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

            function attempt() {
                if (self.cancelled) { chunk.running = false; cb('cancelled'); return; }
                if (!self.workerUrl) {
                    // 不支持 Worker，回退到当前线程 XHR 单 chunk 下载
                    self._downloadChunkMainThread(seq, chunk, cb);
                    return;
                }
                var worker = null;
                try {
                    worker = new Worker(self.workerUrl);
                } catch (e) {
                    self._downloadChunkMainThread(seq, chunk, cb);
                    return;
                }
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
                            cb(data.error);
                        }
                        return;
                    }
                    chunk.buffer = data.buffer;
                    chunk.done = true;
                    chunk.running = false;
                    cleanup();
                    cb();
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
                        cb('worker error');
                    }
                }
                worker.addEventListener('message', onMessage);
                worker.addEventListener('error', onError);
                try { worker.postMessage(msg, []); } catch (e) {
                    cleanup();
                    chunk.running = false;
                    cb('postMessage failed');
                }
            }
            attempt();
        };

        HttpBackend.prototype._downloadChunkMainThread = function (seq, chunk, cb) {
            var self = this;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', self.task.url, true);
            xhr.responseType = 'arraybuffer';
            xhr.timeout = 30000;
            for (var k in self.headers) { try { xhr.setRequestHeader(k, self.headers[k]); } catch (e) {} }
            xhr.setRequestHeader('Range', 'bytes=' + chunk.start + '-' + chunk.end);
            xhr.onload = function () {
                if (self.cancelled) return;
                if (xhr.status >= 200 && xhr.status < 300) {
                    chunk.buffer = xhr.response;
                    chunk.done = true;
                    chunk.running = false;
                    cb();
                } else {
                    chunk.running = false;
                    cb('HTTP ' + xhr.status);
                }
            };
            xhr.onerror = function () { chunk.running = false; cb('network error'); };
            xhr.ontimeout = function () { chunk.running = false; cb('timeout'); };
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
                    GM_download({
                        url: self.task.url,
                        name: self.task.filename,
                        headers: self.headers.Referer ? { Referer: self.headers.Referer } : undefined,
                        onload: function () {
                            if (isFn(self.callbacks.onProgress)) self.callbacks.onProgress(1, 1);
                            if (isFn(self.callbacks.onComplete)) self.callbacks.onComplete({ url: self.task.url, filename: self.task.filename, totalBytes: -1 });
                            self._cleanup();
                        },
                        onerror: function () { self._downloadSingleXHR(); }
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
    // ⬇ 模块 10：下载引擎 (Downloader) + 进度可视化 (P0-3)
    // =========================================================================
    var Dl = {};
    Dl._usedNames = new Set();

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
        Dl._usedNames.add(candidate);
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
        return SEC.safeFilename(out) + (out.indexOf('.' + finalExt) === -1 && !/\.([a-z0-9]{1,8})$/i.test(out) ? '.' + finalExt : '');
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

        function finish() {
            State.downloading = false;
            State.downloadProgress = null;
            var elapsed = (U.now() - startTime) / 1000;
            toast(LANG.t('batchDone', {ok: total - failed, total: total, fail: failed, t: elapsed.toFixed(1)}));
            if (total - failed > 0) toast(LANG.t('batchSuccessN', {n: total - failed}));
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

        Dl._dm.enqueue(items, {
            onComplete: function (id, result) {
                done++;
                updateProgress();
                if (done + failed >= total) finish();
            },
            onError: function (id, error) {
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
            script += '\nfor i, url in enumerate(urls):\n    name = "' + domain + '_' + timestamp + '_{:03d}.bin".format(i+1)\n    try:\n        req = urllib.request.Request(url, headers=headers)\n        with urllib.request.urlopen(req) as resp:\n            with open(name, "wb") as f: f.write(resp.read())\n        print("✅", name)\n    except Exception as e: print("❌", name, e)\n';
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
    // 🖼 模块 10.5：选择管理器 (SelectionManager) - 方案三吸收方案二
    // 在面向最常见场景的流式 API 基础上，保留批量操作/分组/去重/收藏夹的扩展注册能力
    // =========================================================================
    var Selection = {};

    // ---- 内部状态初始化 ----
    Selection._ensureState = function () {
        if (!State._favorites) {
            State._favorites = new Set();
            try {
                if (typeof GM_getValue === 'function') {
                    var raw = GM_getValue('ms_favorites_v1', '');
                    if (raw) {
                        var arr = JSON.parse(raw);
                        if (Array.isArray(arr)) {
                            for (var i = 0; i < arr.length; i++) State._favorites.add(arr[i]);
                        }
                    }
                }
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
    Selection.isActive = function () { return State.selectionMode; };
    Selection.has = function (id) { return State.selected.has(id); };
    Selection.getIds = function () { return Array.from(State.selected); };
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
    Selection.setRange = function (startId, endId, list, value) {
        if (!list || list.length === 0) return;
        var start = list.indexOf(startId);
        var end = list.indexOf(endId);
        if (start < 0 || end < 0) return;
        var s = Math.min(start, end), e = Math.max(start, end);
        var v = typeof value === 'undefined' ? true : value;
        for (var i = s; i <= e; i++) {
            if (v) State.selected.add(list[i]);
            else State.selected.delete(list[i]);
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
    Selection.setOrder = function (orderedIds) {
        if (Array.isArray(orderedIds)) State._selOrder = orderedIds.slice();
    };
    Selection.getOrder = function (list) {
        if (!State._selOrder || State._selOrder.length === 0) return list ? list.slice() : [];
        var ordered = [];
        var set = new Set(list || []);
        for (var i = 0; i < State._selOrder.length; i++) {
            if (set.has(State._selOrder[i])) ordered.push(State._selOrder[i]);
        }
        for (var j = 0; j < (list || []).length; j++) {
            if (ordered.indexOf(list[j]) === -1) ordered.push(list[j]);
        }
        return ordered;
    };
    Selection.resetOrder = function () { State._selOrder = []; };

    // ---- 收藏夹 ----
    Selection.favorites = function () { Selection._ensureState(); return Array.from(State._favorites); };
    Selection.isFavorite = function (id) { Selection._ensureState(); return State._favorites.has(id); };
    Selection.addFavorite = function (id) {
        Selection._ensureState();
        State._favorites.add(id);
        Selection._saveFavorites();
    };
    Selection.removeFavorite = function (id) {
        Selection._ensureState();
        State._favorites.delete(id);
        Selection._saveFavorites();
    };
    Selection.toggleFavorite = function (id) {
        if (Selection.isFavorite(id)) Selection.removeFavorite(id);
        else Selection.addFavorite(id);
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
    Selection.unregisterGroupRule = function (id) { Selection._ensureState(); delete State._groupRules[id]; State._activeGroups.delete(id); };
    Selection.getGroupRules = function () { Selection._ensureState(); return Object.keys(State._groupRules).map(function(k){ return State._groupRules[k]; }); };
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
    Selection.getGroups = function (items) {
        Selection._ensureState();
        var rules = Selection.activeGroups();
        if (rules.length === 0) return { '__all__': items ? items.slice() : [] };
        var result = {};
        for (var r = 0; r < rules.length; r++) {
            var g = Selection.group(items, rules[r]);
            var keys = Object.keys(g);
            for (var k = 0; k < keys.length; k++) {
                var key = keys[k];
                result[rules[r] + ':' + key] = g[key];
            }
        }
        return result;
    };

    // ---- 批量操作注册 ----
    Selection.registerBatchAction = function (id, label, fn, options) {
        Selection._ensureState();
        if (!id || typeof fn !== 'function') return;
        State._batchActions[id] = { id: id, label: label || id, fn: fn, options: options || {} };
    };
    Selection.unregisterBatchAction = function (id) { Selection._ensureState(); delete State._batchActions[id]; };
    Selection.getBatchActions = function () { Selection._ensureState(); return Object.keys(State._batchActions).map(function(k){ return State._batchActions[k]; }); };
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
    Selection._updateCardMark = function (url) {
        var card = document.querySelector('[data-url="' + CSS.escape(url) + '"]');
        if (!card) return;
        var mark = card.querySelector('._ms_sel_mark');
        var isSel = State.selected.has(url);
        if (mark) {
            if (State.selectionMode) {
                mark.style.display = 'flex';
                mark.style.background = isSel ? MS_CONFIG.COLORS.primary : 'rgba(255,255,255,.9)';
                mark.style.border = isSel ? 'none' : '2px solid ' + MS_CONFIG.COLORS.primary;
                mark.style.color = isSel ? MS_CONFIG.COLORS.white : MS_CONFIG.COLORS.primary;
                mark.textContent = isSel ? '\u2713' : '';
            } else {
                mark.style.display = 'none';
            }
        }
        card.style.border = isSel ? '2px solid ' + MS_CONFIG.COLORS.primary : (State.selectionMode ? '1px dashed ' + MS_CONFIG.COLORS.primary : '');
        card.style.boxShadow = isSel ? '0 4px 12px rgba(99,102,241,.35)' : '';
    };
    Selection._updateAllCards = function () {
        var marks = document.querySelectorAll('._ms_sel_mark');
        for (var i = 0; i < marks.length; i++) {
            marks[i].style.display = State.selectionMode ? 'flex' : 'none';
        }
        var cards = document.querySelectorAll('[data-url]');
        for (var j = 0; j < cards.length; j++) {
            var url = cards[j].getAttribute('data-url');
            var isSel = State.selected.has(url);
            if (State.selectionMode) {
                cards[j].style.border = isSel ? '2px solid ' + MS_CONFIG.COLORS.primary : '1px dashed ' + MS_CONFIG.COLORS.primary;
                cards[j].style.boxShadow = isSel ? '0 4px 12px rgba(99,102,241,.35)' : '';
            } else {
                cards[j].style.border = '';
                cards[j].style.boxShadow = '';
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
    var UI = (function () {
        'use strict';
    // =========================================================================
    // 🖼 模块 11：UI 面板 + 虚拟列表 (P0-2) + 进度条 + 媒体预览 (P1-1)
    // =========================================================================
    var UI = {};

    UI._thumbCache = {};
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
                        UI._thumbCache[url] = dataUrl;
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
                                d.textContent = '▶';
                                elem.parentNode.appendChild(d);
                            };
                            elem.parentNode.replaceChild(img, elem);
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
            var isPlaceholder = firstChild && firstChild.tagName === 'DIV' && firstChild.textContent === '🎬' && firstChild.style.width === '100%';
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
                    d.textContent = '🎬';
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
                resolveBtn.textContent = '✅ 已解析';
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

    UI._unobserveVlinkCards = function(container) {
        if (!UI._vlinkObserver) return;
        var cards = container.querySelectorAll('[data-vlink]');
        for (var i = 0; i < cards.length; i++) {
            UI._vlinkObserver.unobserve(cards[i]);
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

            // 同步当前界面风格到浮动按钮
            try { UI.applyUiStyle(); } catch (e) {}

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

            LOG.info('浮动按钮创建成功 ✓');
        } catch (err) {
            LOG.error('浮动按钮创建失败:', err.message);
        }
    };

    // 按钮守护：MutationObserver + 轮询双重保障
    UI._floatGuardRunning = false;
    UI._rebuildTimer = null;
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
            mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
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
        var dark = State.getTheme() === 'dark';
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
        var built = UI._palettes[id];
        if (built) return State.getTheme() === 'dark' ? built.dark : built.light;
        if (custom) {
            var mode = State.getTheme() === 'dark' ? (custom.dark || {}) : (custom.light || {});
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
        var dark = State.getTheme() === 'dark';
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
            var dark = State.getTheme() === 'dark';
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

    // ===== 界面风格（普通 / Material / Apple 玻璃） =====
    UI.applyUiStyle = function () {
        var style = State.config && State.config.uiStyle ? State.config.uiStyle : 'normal';
        if (!['normal', 'material', 'apple'].includes(style)) style = 'normal';
        var dark = State.getTheme() === 'dark';
        var panel = State.panel;
        if (panel) {
            panel.classList.remove('_ms_style_normal', '_ms_style_material', '_ms_style_apple', '_ms_dark');
            panel.classList.add('_ms_style_' + style);
            if (dark) panel.classList.add('_ms_dark');
        }
        // 同步浮动按钮风格类
        var floatBtn = UI._floatBtn || document.getElementById('_ms_float');
        if (floatBtn) {
            floatBtn.classList.remove('_ms_btn_apple');
            if (style === 'apple') floatBtn.classList.add('_ms_btn_apple');
        }
        var styleId = '_ms_ui_style_css';
        var el = document.getElementById(styleId);
        if (!el) {
            el = document.createElement('style');
            el.id = styleId;
            (document.head || document.documentElement).appendChild(el);
        }
        var css = '';
        // 主题色（深/浅）切换时所有相关元素都有平滑过渡
        css += '#_ms_panel, #_ms_panel * { transition: background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease; }';
        var isMob = U.isMobile();
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
        } else if (style === 'apple') {
            var r2 = isMob ? '0' : '24px 0 0 24px';
            var bg = dark ? 'rgba(22,24,38,0.55)' : 'rgba(255,255,255,0.20)';
            var border = dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.35)';
            var headerBg = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.14)';
            var tabBg = dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.12)';
            var shadow = dark ? '-30px 0 80px rgba(0,0,0,0.45)' : '-30px 0 80px rgba(0,0,0,0.25)';
            var highlight = dark ? 'linear-gradient(180deg,rgba(255,255,255,0.18),transparent)' : 'linear-gradient(180deg,rgba(255,255,255,0.55),transparent)';
            var cardBg = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.14)';
            var cardBgHover = dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.20)';
            var boxMargin = isMob ? '0' : '0 10px 10px 10px';
            var boxRadius = isMob ? '0' : '16px';
            css += '#_ms_panel._ms_style_apple { background:' + bg + ' !important; backdrop-filter:blur(28px) saturate(200%) !important; -webkit-backdrop-filter:blur(28px) saturate(200%) !important; border-left:1px solid ' + border + ' !important; box-shadow:' + shadow + ' !important; border-radius:' + r2 + ' !important; }';
            css += '#_ms_panel._ms_style_apple::before { content:""; position:absolute; inset:0; pointer-events:none; border-radius:' + r2 + '; border-left:1px solid ' + (dark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.65)') + '; mask-image:linear-gradient(to bottom,#000 0%,transparent 60%); -webkit-mask-image:linear-gradient(to bottom,#000 0%,transparent 60%); }';
            css += '#_ms_panel._ms_style_apple::after { content:""; position:absolute; inset:0; pointer-events:none; border-radius:' + r2 + '; background:' + highlight + '; opacity:' + (dark ? '0.35' : '0.55') + '; mask-image:linear-gradient(to bottom,#000 0%,transparent 45%); -webkit-mask-image:linear-gradient(to bottom,#000 0%,transparent 45%); }';
            css += '#_ms_panel._ms_style_apple > div:first-child { background:' + headerBg + ' !important; border-bottom:1px solid ' + border + ' !important; position:relative; backdrop-filter:blur(20px) saturate(180%) !important; -webkit-backdrop-filter:blur(20px) saturate(180%) !important; box-shadow:inset 0 1px 0 ' + (dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.45)') + ' !important; }';
            css += '#_ms_panel._ms_style_apple > div:first-child::after { content:""; position:absolute; left:0; right:0; top:0; height:1px; background:' + (dark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)') + '; }';
            css += '#_ms_panel._ms_style_apple #_ms_tabs { background:' + tabBg + ' !important; border-bottom:1px solid ' + border + ' !important; backdrop-filter:blur(12px) saturate(160%) !important; -webkit-backdrop-filter:blur(12px) saturate(160%) !important; }';
            css += '#_ms_panel._ms_style_apple #_ms_search, #_ms_panel._ms_style_apple #_ms_filter, #_ms_panel._ms_style_apple #_ms_progress { background:' + tabBg + ' !important; border-bottom:1px solid ' + border + ' !important; backdrop-filter:blur(8px) saturate(140%) !important; -webkit-backdrop-filter:blur(8px) saturate(140%) !important; }';
            css += '#_ms_panel._ms_style_apple #_ms_box { background:' + cardBg + ' !important; border:1px solid ' + border + ' !important; border-radius:' + boxRadius + ' !important; margin:' + boxMargin + ' !important; box-shadow:inset 0 1px 0 ' + (dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.35)') + ' !important; }';
            css += '#_ms_panel._ms_style_apple #_ms_footer { background:' + cardBg + ' !important; border:1px solid ' + border + ' !important; border-radius:' + boxRadius + ' !important; margin:' + boxMargin + ' !important; }';
            css += '#_ms_panel._ms_style_apple [data-url] { background:' + cardBg + ' !important; border:1px solid ' + border + ' !important; border-radius:16px !important; transition:transform .15s ease, background .2s ease, box-shadow .2s ease, color .35s ease, border-color .35s ease !important; }';
            css += '#_ms_panel._ms_style_apple [data-url]:active { transform:scale(0.97) !important; }';
            css += '#_ms_panel._ms_style_apple [data-url]:hover { background:' + cardBgHover + ' !important; box-shadow:0 8px 24px rgba(0,0,0,' + (dark ? '0.35' : '0.12') + ') !important; }';
            css += '#_ms_panel._ms_style_apple ._ms_tab { background:rgba(255,255,255,0.10) !important; border-radius:10px !important; transition:transform .15s ease, background .2s ease, color .35s ease, border-color .35s ease !important; }';
            css += '#_ms_panel._ms_style_apple ._ms_tab:active { transform:scale(0.94) !important; }';
            css += '#_ms_panel._ms_style_apple button { transition:transform .15s ease, box-shadow .2s ease, background .35s ease, color .35s ease !important; }';
            css += '#_ms_panel._ms_style_apple button:active { transform:scale(0.96) !important; }';
            css += '#_ms_panel._ms_style_apple ::-webkit-scrollbar { width:6px; height:6px; }';
            css += '#_ms_panel._ms_style_apple ::-webkit-scrollbar-track { background:transparent; }';
            css += '#_ms_panel._ms_style_apple ::-webkit-scrollbar-thumb { background:' + (dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)') + '; border-radius:10px; }';
            css += '#_ms_panel._ms_style_apple ::-webkit-scrollbar-thumb:hover { background:' + (dark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.28)') + '; }';
            // 苹果风格：右下角浮动按钮也使用玻璃拟态
            var btnBg = dark ? 'rgba(120,120,255,0.22)' : 'rgba(255,255,255,0.25)';
            var btnBorder = dark ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.45)';
            var btnShadow = dark ? '0 8px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)' : '0 8px 28px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.35)';
            css += '#_ms_float._ms_btn_apple { background:' + btnBg + ' !important; backdrop-filter:blur(18px) saturate(180%) !important; -webkit-backdrop-filter:blur(18px) saturate(180%) !important; border:1px solid ' + btnBorder + ' !important; box-shadow:' + btnShadow + ' !important; transition:transform .2s ease, background .2s ease !important; }';
            css += '#_ms_float._ms_btn_apple:active { transform:scale(0.90) !important; }';
        } else {
            // normal：不注入额外覆盖样式，由 JS 内联样式控制
        }
        el.textContent = css;
    };

    UI.setUiStyle = function (style) {
        if (!['normal', 'material', 'apple'].includes(style)) style = 'normal';
        State.config.uiStyle = style;
        State.save();
        try { UI.applyUiStyle(); } catch (e) { LOG.error('应用界面风格失败:', e); }
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

        container.addEventListener('touchstart', onDown, { passive: true });
        container.addEventListener('touchmove', onMove, { passive: true });
        container.addEventListener('touchend', onUp, { passive: true });
        container.addEventListener('touchcancel', onUp, { passive: true });
        container.addEventListener('mousedown', onDown);
        container.addEventListener('mousemove', onMove);
        container.addEventListener('mouseup', onUp);
        container.addEventListener('mouseleave', onUp);
    };

    // ===== 虚拟列表组件 =====
    UI.VirtualList = function (container, items, renderItem, itemHeight, overscan) {
        // container: DOM 元素
        // items: 数据数组
        // renderItem: function(item, index) => HTML string
        // itemHeight: 每项高度（px）
        // overscan: 预渲染数量
        var vh = itemHeight || 120;
        var os = overscan || 5;
        var scrollTop = 0;
        var viewportHeight = 0;
        var totalHeight = items.length * vh;
        var renderZone = null;

        function update() {
            try {
                viewportHeight = container.clientHeight || 400;
                var startIdx = Math.max(0, Math.floor(scrollTop / vh) - os);
                var endIdx = Math.min(items.length, Math.ceil((scrollTop + viewportHeight) / vh) + os);
                var offsetY = startIdx * vh;

                if (!renderZone) {
                    renderZone = document.createElement('div');
                    renderZone.style.cssText = 'position:absolute;top:0;left:0;right:0;';
                    container.appendChild(renderZone);
                }

                var html = '';
                for (var i = startIdx; i < endIdx; i++) {
                    html += renderItem(items[i], i);
                }
                renderZone.innerHTML = html;
                renderZone.style.top = offsetY + 'px';
                container.scrollTop = scrollTop;
            } catch (e) {}
        }

        container.style.position = 'relative';
        container.style.overflowY = 'auto';
        container.innerHTML = '<div style="height:' + totalHeight + 'px;"></div>';

        container.addEventListener('scroll', U.throttle(function () {
            scrollTop = container.scrollTop;
            update();
        }, 50));

        update();
        return { update: update, setItems: function (newItems) { items = newItems; totalHeight = items.length * vh; container.innerHTML = '<div style="height:' + totalHeight + 'px;"></div>'; renderZone = null; update(); } };
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
        State.panel.style.transform = 'translateX(0) scale(1)';
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
        State.panel.style.cssText = 'position:fixed;' + posStyle + hStyle + 'width:' + w + 'px;background:' + c.bg + ';color:' + c.txt + ';border-radius:' + (isMob ? '0' : '16px') + ';box-shadow:-30px 0 60px rgba(0,0,0,.35);display:none;flex-direction:column;overflow:hidden;z-index:2147483645;transform:translateX(100%) scale(0.97);opacity:0;transition:transform .4s cubic-bezier(.16,1,.3,1), opacity .4s cubic-bezier(.16,1,.3,1), background-color .35s ease, color .35s ease, border-color .35s ease, box-shadow .35s ease, left .3s ease, top .3s ease;font-family:system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;';

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
                State.panel.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1), opacity .4s cubic-bezier(.16,1,.3,1), background-color .35s ease, color .35s ease, border-color .35s ease, box-shadow .35s ease';
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
                State.panel.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1), opacity .4s cubic-bezier(.16,1,.3,1), background-color .35s ease, color .35s ease, border-color .35s ease, box-shadow .35s ease, left .3s ease, top .3s ease';
            });
        }

        // Tabs
        var tabBar = document.createElement('div');
        tabBar.id = '_ms_tabs';
        tabBar.style.cssText = 'display:flex;gap:4px;padding:8px 10px;background:' + c.bg2 + ';border-bottom:1px solid ' + c.border + ';overflow-x:auto;flex-shrink:0;transition: background-color 0.3s, color 0.3s;';
        var tabs = [
            { key: 'img', label: LANG.t('tabImg') },
            { key: 'video', label: LANG.t('tabVideo') },
            { key: 'audio', label: LANG.t('tabAudio') },
            { key: 'm3u8', label: LANG.t('tabM3u8') },
            { key: 'translate', label: LANG.t('tabTranslate') },
            { key: 'cookie', label: LANG.t('tabCookie') },
            { key: 'storage', label: LANG.t('tabStorage') },
            { key: 'settings', label: LANG.t('tabSettings') },
        ];
        for (var i = 0; i < tabs.length; i++) {
            (function (t) {
                var btn = document.createElement('button');
                btn.className = '_ms_tab';
                btn.setAttribute('data-tab', t.key);
                btn.textContent = t.label;
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
        progressWrap.innerHTML = '<div style="font-size:12px;color:' + c.sub + ';margin-bottom:4px;">' + LANG.t('dlProgress') + '</div><div style="height:8px;background:' + c.bg3 + ';border-radius:4px;overflow:hidden;"><div id="_ms_progress_bar" style="height:100%;background:linear-gradient(135deg,' + MS_CONFIG.COLORS.primary + ',' + MS_CONFIG.COLORS.primary2 + ');width:0%;transition:width .3s;"></div></div><div id="_ms_progress_text" style="font-size:11px;color:' + c.sub + ';margin-top:4px;">0 / 0</div>';
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
        });
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
        try { UI.applyUiStyle(); } catch (e) { LOG.error('初始化界面风格失败:', e); }
    };

    UI._applyTabStyle = function (btn, active) {
        var c = UI.colors();
        var isApple = State.config && State.config.uiStyle === 'apple';
        var bg, color, shadow;
        if (active) {
            if (isApple) {
                bg = 'linear-gradient(135deg,rgba(99,102,241,0.82),rgba(139,92,246,0.82))';
                shadow = 'box-shadow:0 4px 14px rgba(99,102,241,.25), inset 0 1px 0 rgba(255,255,255,.25);';
            } else {
                bg = 'linear-gradient(135deg,#6366f1,#8b5cf6)';
                shadow = 'box-shadow:0 4px 12px rgba(99,102,241,.3);';
            }
            color = '#fff';
        } else {
            bg = State.getTheme() === 'dark' ? '#334155' : '#e2e8f0';
            color = c.sub;
            shadow = '';
        }
        btn.style.cssText = 'flex:1;min-width:60px;padding:8px 4px;border:none;border-radius:8px;background:' + bg + ';color:' + color + ';font-size:12px;font-weight:' + (active ? '700' : '500') + ';cursor:pointer;white-space:nowrap;transition:background .35s ease, color .35s ease, box-shadow .35s ease, transform .15s ease;' + shadow;
    };

    UI.openPanel = function () {
        if (!State.panel) UI.buildPanel();
        State.panelOpen = true;
        if (!U.isMobile() && State.config.panelMinimized) {
            UI.minimizePanel();
        } else {
            State.panel.style.display = 'flex';
            State.panel.style.opacity = '0';
            requestAnimationFrame(function () {
                State.panel.style.transform = 'translateX(0) scale(1)';
                State.panel.style.opacity = '1';
            });
        }
        var startTab = State.config.lastTab || State.tab || 'img';
        var total = State.images.length + State.videos.length + State.audios.length + State.m3u8.length;
        if (total === 0) Scanner.doFull(function () { toast(LANG.t('scanDoneToast')); UI.switchTab(startTab); });
        else UI.switchTab(startTab);
    };

    UI.closePanel = function () {
        if (!State.panel) return;
        State.panelOpen = false;
        if (State.selectionMode && !State.config.persistSelection) Selection.exit();
        // 停止面板内正在播放的音视频预览
        try {
            var mediaEls = State.panel.querySelectorAll('video, audio');
            for (var i = 0; i < mediaEls.length; i++) {
                try { mediaEls[i].pause(); } catch (e) {}
            }
        } catch (e) {}
        // 清理渲染节流计时器
        try {
            if (State._renderThrottled && State._renderThrottled._timer) {
                clearTimeout(State._renderThrottled._timer);
                State._renderThrottled._timer = null;
            }
        } catch (e) {}
        State.panel.style.transform = 'translateX(100%) scale(0.97)';
        State.panel.style.opacity = '0';
        if (State.minimizedBar) State.minimizedBar.style.display = 'none';
        setTimeout(function () { if (!State.panelOpen && State.panel) State.panel.style.display = 'none'; }, 420);
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
            { icon: '📂', label: LANG.t('ctxOpenPanel'), action: function () { UI.openPanel(); } },
            { icon: '📥', label: LANG.t('ctxQuickDownload'), action: function () { UI.quickDownload(); } },
            { icon: '🌐', label: LANG.t('ctxTranslate'), action: function () { UI.openPanel(); UI.switchTab('translate'); } },
            { icon: '⚙️', label: LANG.t('ctxSettings'), action: function () { UI.openPanel(); UI.switchTab('settings'); } },
            { icon: '✖️', label: LANG.t('ctxClose'), action: function () {} }
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
            else if (tab === 'settings') UI.renderSettings();
        }

        var box = document.getElementById('_ms_box');
        if (!box) { renderTab(); return; }
        box.style.opacity = '0';
        box.style.pointerEvents = 'none';
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                renderTab();
                box.scrollTop = 0;
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
            closeBtn.textContent = '✕';
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

        var icon = kind === 'img' ? '🖼' : kind === 'video' ? '🎬' : kind === 'audio' ? '🎵' : '📺';
        var label = kind === 'img' ? LANG.t('tabImg').replace(/^[🖼🎬🎵📺]/, '') : kind === 'video' ? LANG.t('tabVideo').replace(/^[🖼🎬🎵📺]/, '') : kind === 'audio' ? LANG.t('tabAudio').replace(/^[🖼🎬🎵📺]/, '') : LANG.t('tabM3u8').replace(/^[🖼🎬🎵📺]/, '');
        var total = all.length;
        var shown = kwList.length;
        var totalLinks = vLinkList.length;
        var isMobile = UI._isMobile();
        var btnPadding = isMobile ? '10px 14px' : '6px 10px';
        var btnFontSize = isMobile ? '13px' : '11px';
        var titleFontSize = isMobile ? '15px' : '13px';
        var topPadding = isMobile ? '12px 16px' : '10px 14px';

        // 顶部信息栏 + 筛选 + 批量按钮
        var topHtml = '';
        topHtml += '<div style="padding:' + topPadding + ';font-size:' + titleFontSize + ';color:' + c.sub + ';border-bottom:1px solid ' + c.border + ';background:' + c.bg2 + ';">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">' +
                '<div><span style="font-size:' + (isMobile ? '18px' : '16px') + ';margin-right:4px;">' + icon + '</span><b style="color:' + c.txt + ';">' + label + '</b>：' + LANG.t('showing', {shown: shown, total: total}) + (totalLinks > 0 ? ' + 🔗 ' + totalLinks + ' 个页面链接' : '') + '</div>' +
                '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
                    '<button id="_ms_sel_all" style="padding:' + btnPadding + ';border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:' + btnFontSize + ';cursor:pointer;">' + LANG.t('btnSelAll') + '</button>' +
                    '<button id="_ms_sel_none" style="padding:' + btnPadding + ';border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:' + btnFontSize + ';cursor:pointer;">' + LANG.t('btnSelNone') + '</button>' +
                    '<button id="_ms_dl_sel" style="padding:' + btnPadding + ';border:none;border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:' + btnFontSize + ';font-weight:600;cursor:pointer;">📥 ' + LANG.t('downloadSel') + '</button>' +
                    '<button id="_ms_dl_all" style="padding:' + btnPadding + ';border:none;border-radius:8px;background:linear-gradient(135deg,#10b981,#34d399);color:#fff;font-size:' + btnFontSize + ';font-weight:600;cursor:pointer;">📥 ' + LANG.t('downloadAll') + '</button>' +
                    '<button id="_ms_copy_sel" style="padding:' + btnPadding + ';border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:' + btnFontSize + ';cursor:pointer;">📋 ' + LANG.t('copySelUrl') + '</button>' +
                    '<button id="_ms_copy_all" style="padding:' + btnPadding + ';border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:' + btnFontSize + ';cursor:pointer;">📋 ' + LANG.t('copyAllUrl') + '</button>' +
                    '<button id="_ms_show_filter" style="padding:' + btnPadding + ';border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:' + btnFontSize + ';cursor:pointer;">🔧 ' + LANG.t('filter') + '</button>' +
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
                '<span>🔗 视频页面链接（点击解析获取下载地址）</span>' +
                '<button id="_ms_batch_resolve" style="padding:' + (isMobile ? '10px 16px' : '6px 12px') + ';border:none;border-radius:8px;background:linear-gradient(135deg,#8b5cf6,#a855f7);color:#fff;font-size:' + (isMobile ? '14px' : '11px') + ';font-weight:600;cursor:pointer;flex-shrink:0;">🔄 一键解析全部</button>' +
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
            var gridCols = isMobile ? 'grid-template-columns:1fr;' : 'grid-template-columns:repeat(auto-fill,minmax(160px,1fr));';
            var coverHeight = isMobile ? '200px' : '90px';
            var titleFontSize = isMobile ? '15px' : '12px';
            var titleHeight = isMobile ? '44px' : '32px';
            var metaFontSize = isMobile ? '13px' : '10px';
            var cardPadding = isMobile ? '10px 12px' : '6px 8px';
            var gridPadding = isMobile ? 'padding:0 12px 12px;' : 'padding:0 10px 10px;';
            var gridGap = isMobile ? 'gap:12px;' : 'gap:8px;';
            vlinkGrid.style.cssText = 'display:grid;' + gridCols + gridGap + gridPadding;
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
                    { icon: '▶️', label: '预览视频', action: function() { VideoLinkPreview.preview(vData.url); } },
                    { icon: '📋', label: '复制链接', action: function() { copyText(vData.url); } },
                    { icon: '📥', label: '下载视频', action: function() { VideoLinkPreview.preview(vData.url); } },
                    { icon: '🔗', label: '打开原网页', action: function() { window.open(vData.url, '_blank'); } },
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
                    vCoverHtml = '<img src="' + vItem.cover + '" loading="lazy" style="width:100%;height:' + coverHeight + ';object-fit:cover;display:block;" onerror="var d=document.createElement(\'div\');d.style.cssText=\'width:100%;height:' + coverHeight + ';background:linear-gradient(135deg,#1e293b,#334155);display:flex;align-items:center;justify-content:center;color:#fff;font-size:' + (isMobile ? '36px' : '24px') + ';\';d.textContent=\'🎬\';this.parentNode.replaceChild(d,this);">';
                } else {
                    var iconSize = isMobile ? '36px' : '24px';
                    vCoverHtml = '<div style="width:100%;height:' + coverHeight + ';background:linear-gradient(135deg,#1e293b,#334155);display:flex;align-items:center;justify-content:center;color:#fff;font-size:' + iconSize + ';">🎬</div>';
                }
                var isResolved = UI._vlinkResolved[vItem.url];
                var resolveBtnText = isResolved ? '✅ 已解析' : '解析 ⬇';
                var resolveBtnColor = isResolved ? '#10b981' : '#8b5cf6';
                vCard.innerHTML = vCoverHtml +
                    '<div style="padding:' + cardPadding + ';">' +
                        '<div style="font-size:' + titleFontSize + ';color:' + c.txt + ';line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;height:' + titleHeight + ';">' + vItem.title + '</div>' +
                        '<div style="font-size:' + metaFontSize + ';color:' + c.sub + ';margin-top:6px;display:flex;align-items:center;justify-content:space-between;">' +
                            '<span>' + vItem.siteIcon + ' ' + vItem.siteName + '</span>' +
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
                    batchBtn.textContent = '⏳ 解析中...';
                    UI.batchResolveVlinks(vLinkList, function(completed, total, successCount, failedCount) {
                        var pct = total > 0 ? (completed / total * 100) : 0;
                        if (progressBar) progressBar.style.width = pct.toFixed(1) + '%';
                        if (progressText) progressText.textContent = '已解析 ' + completed + '/' + total + '，成功 ' + successCount + '，失败 ' + failedCount;
                        if (progressPct) progressPct.textContent = pct.toFixed(0) + '%';
                    }, function(total, successCount, failedCount) {
                        batchBtn.disabled = false;
                        batchBtn.style.opacity = '1';
                        batchBtn.style.cursor = 'pointer';
                        batchBtn.textContent = '🔄 一键解析全部';
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

        // 使用虚拟列表（超过 100 条时）
        var useVirtual = kwList.length > 100;
        var container = document.createElement('div');
        container.style.cssText = 'flex:1;overflow-y:auto;position:relative;';
        box.appendChild(container);

        if (useVirtual) {
            UI.VirtualList(container, kwList, function (url, idx) {
                return UI._renderMediaCard(url, idx, kind);
            }, 130, 10);
            container.addEventListener('click', function (e) {
                var t = e.target.closest && e.target.closest('[data-url]');
                if (!t) return;
                if (t._msLongPressTriggered) { t._msLongPressTriggered = false; return; }
                var u = t.getAttribute('data-url');
                var idx = parseInt(t.getAttribute('data-idx'), 10);
                if (State.selectionMode && e.shiftKey && typeof State._lastSelIdx === 'number') {
                    var start = Math.min(State._lastSelIdx, idx);
                    var end = Math.max(State._lastSelIdx, idx);
                    var targetState = State._lastSelState;
                    for (var si = start; si <= end; si++) {
                        if (targetState) State.selected.add(kwList[si]);
                        else State.selected.delete(kwList[si]);
                        Selection._updateCardMark(kwList[si]);
                    }
                    State._lastSelIdx = idx;
                    Selection._refreshToolbar();
                } else if (State.selectionMode) {
                    Selection.toggle(u);
                    Selection._updateCardMark(u);
                    State._lastSelIdx = idx;
                    State._lastSelState = State.selected.has(u);
                    Selection._refreshToolbar();
                } else {
                    UI.previewMedia(u, kind);
                }
            });
        } else {
            var grid = document.createElement('div');
            var gridCols = isMobile ? 'grid-template-columns:repeat(2,1fr);' : 'grid-template-columns:repeat(auto-fill,minmax(120px,1fr));';
            var gridGap = isMobile ? 'gap:10px;' : 'gap:8px;';
            var gridPad = isMobile ? 'padding:12px;' : 'padding:10px;';
            grid.style.cssText = 'display:grid;' + gridCols + gridGap + gridPad;
            for (var i = 0; i < kwList.length; i++) {
                var cardEl = document.createElement('div');
                cardEl.innerHTML = UI._renderMediaCard(kwList[i], i, kind);
                var firstChild = cardEl.firstElementChild;
                if (firstChild) {
                    (function (url, el, k, idx) {
                        el.addEventListener('click', function (e) {
                            if (el._msLongPressTriggered) { el._msLongPressTriggered = false; return; }
                            if (State.selectionMode && e.shiftKey && typeof State._lastSelIdx === 'number') {
                                var start = Math.min(State._lastSelIdx, idx);
                                var end = Math.max(State._lastSelIdx, idx);
                                var targetState = State._lastSelState;
                                for (var si = start; si <= end; si++) {
                                    if (targetState) State.selected.add(kwList[si]);
                                    else State.selected.delete(kwList[si]);
                                    Selection._updateCardMark(kwList[si]);
                                }
                                State._lastSelIdx = idx;
                                Selection._refreshToolbar();
                            } else if (State.selectionMode) {
                                Selection.toggle(url);
                                Selection._updateCardMark(url);
                                State._lastSelIdx = idx;
                                State._lastSelState = State.selected.has(url);
                                Selection._refreshToolbar();
                            } else {
                                UI.previewMedia(url, k);
                            }
                        });
                        el.addEventListener('dblclick', function () {
                            try {
                                Dl.one(url, Dl.buildName(url, 1, '', State.config.nameTpl), State.config.batchRetry, State.config.customHeaders);
                            } catch (e) {}
                        });
                        // 选择模式下启用拖拽排序
                        el.addEventListener('dragstart', function (e) {
                            if (!State.selectionMode) { e.preventDefault(); return; }
                            UI._dragSrcIdx = idx;
                            el.style.opacity = '0.5';
                            try { e.dataTransfer.effectAllowed = 'move'; } catch (err) {}
                        });
                        el.addEventListener('dragend', function () {
                            el.style.opacity = '';
                            UI._dragSrcIdx = null;
                            var cards = grid.querySelectorAll('._ms_card');
                            for (var ci = 0; ci < cards.length; ci++) cards[ci].style.transform = '';
                        });
                        el.addEventListener('dragover', function (e) {
                            if (typeof UI._dragSrcIdx !== 'number') return;
                            e.preventDefault();
                            try { e.dataTransfer.dropEffect = 'move'; } catch (err) {}
                        });
                        el.addEventListener('drop', function (e) {
                            if (typeof UI._dragSrcIdx !== 'number') return;
                            e.preventDefault();
                            var targetIdx = idx;
                            if (UI._dragSrcIdx !== targetIdx) {
                                Selection.move(UI._dragSrcIdx, targetIdx, kwList);
                                UI.renderMedia(kind);
                            }
                        });
                    })(kwList[i], firstChild, kind, i);
                }
                grid.appendChild(cardEl.firstElementChild || cardEl);
            }
            container.appendChild(grid);
        }
        UI._bindCardLongPress(container);

        UI.renderFooter(kind, kwList);
        bindFilterButtons(kind);
        bindActionButtons(kind, kwList);
        requestAnimationFrame(function () { box.scrollTop = scrollTop; });

        if (kind === 'video' && State.config.autoExtractThumb) {
            setTimeout(function () { UI._loadVisibleVideoThumbs(container); }, 100);
            container.addEventListener('scroll', function () {
                clearTimeout(UI._thumbScrollTimer);
                UI._thumbScrollTimer = setTimeout(function () { UI._loadVisibleVideoThumbs(container); }, 200);
            });
        }

        if (kind === 'video' && vLinkList.length > 0) {
            container.addEventListener('scroll', function () {
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
                target = box.querySelector('[data-vlink="' + CSS.escape(url) + '"]');
            } else if (kind === 'm3u8') {
                target = box.querySelector('[data-url="' + CSS.escape(url) + '"]');
            } else {
                target = box.querySelector('[data-url="' + CSS.escape(url) + '"]');
            }
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                target.style.transition = 'box-shadow .3s';
                target.style.boxShadow = '0 0 0 3px ' + MS_CONFIG.COLORS.primary;
                setTimeout(function () { target.style.boxShadow = ''; }, 1500);
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
            item.innerHTML = '<div style="font-size:13px;font-weight:600;color:' + c.txt + ';margin-bottom:6px;word-break:break-all;">' + U.trunc(url, 60) + '</div>' +
                '<div style="font-size:11px;color:' + c.sub + ';margin-bottom:8px;">' + SEC.nameFromUrl(url) + '</div>' +
                '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
                '<button data-op="download" data-url="' + url + '" style="padding:8px 12px;border:none;border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:12px;font-weight:600;cursor:pointer;flex:1;">' + LANG.t('dlMerge') + '</button>' +
                '<button data-op="preview" data-url="' + url + '" style="padding:8px 12px;border:none;border-radius:8px;background:linear-gradient(135deg,#0ea5e9,#6366f1);color:#fff;font-size:12px;font-weight:600;cursor:pointer;flex:1;">' + LANG.t('preview') + '</button>' +
                '<button data-op="script" data-url="' + url + '" style="padding:8px 12px;border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:12px;font-weight:600;cursor:pointer;flex:1;">' + LANG.t('genScriptBtn') + '</button>' +
                '<button data-op="detail" data-url="' + url + '" style="padding:8px 12px;border:none;border-radius:8px;background:' + c.bg3 + ';color:' + c.txt + ';font-size:12px;font-weight:600;cursor:pointer;">' + LANG.t('detailBtn') + '</button>' +
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
                '<div style="background:' + c.bg2 + ';padding:12px;border-radius:10px;font-size:12px;color:' + c.sub + ';word-break:break-all;margin-bottom:16px;font-family:monospace;">' + url + '</div>' +
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
                                    '<b>' + parsed.streams[i].label + '</b> · ' + parsed.streams[i].resolution + ' · ' + U.formatSize(parsed.streams[i].bandwidth) + '/s' +
                                    '</div>';
                            }
                        } else {
                            html += '<div style="font-size:12px;color:' + c.sub + ';">' + LANG.t('segmentsInfo', {n: parsed.segments.length, t: U.formatTime(parsed.duration)}) + '</div>';
                            html += '<div style="font-size:12px;color:' + (parsed.encrypted ? '#ef4444' : '#10b981') + ';margin-top:6px;">' + (parsed.encrypted ? LANG.t('encrypted') : LANG.t('notEncrypted')) + (parsed.encrypted ? ' (' + parsed.keyMethod + ')' : '') + '</div>';
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
                    if (err) toast(LANG.t('transFail') + ': ' + err, '#ef4444');
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
            closeBtn.textContent = '✕';
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
                } else if (typeof Hls !== 'undefined') {
                    initHls();
                } else {
                    var hlsScript = document.createElement('script');
                    hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
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
                b.textContent = label; b.style.cssText = 'padding:12px 14px;border:none;border-radius:10px;background:linear-gradient(135deg,' + gradient + ');color:#fff;font-size:13px;font-weight:600;cursor:pointer;';
                b.addEventListener('click', handler); btnWrap.appendChild(b);
            }
            mkBtn('⬇ ' + LANG.t('download'), '#6366f1,#8b5cf6', function () {
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
            mkBtn('📋 ' + LANG.t('copyUrl'), '#10b981,#34d399', function () { copyText(url); });
            mkBtn('🌐 ' + LANG.t('openTab'), '#f59e0b,#fbbf24', function () { try { window.open(url, '_blank'); } catch (e) {} });
            if (kind === 'video') {
                mkBtn('⏺ 录制媒体流', '#ef4444,#f87171', function () {
                    var found = UI._findStreamElement(url);
                    if (found && found.el) {
                        Dl.recordStream(found.el, 10000, Dl.buildName(url, 1, 'webm', State.config.nameTpl));
                    } else {
                        toast('未找到可录制的媒体流', '#f59e0b');
                    }
                });
            }
            if (kind === 'video' || kind === 'm3u8') {
                mkBtn('🎞 ' + LANG.t('extractCover'), '#ec4899,#f472b6', function () {
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
            btn('✕ ' + LANG.t('close'), '#ef4444', function () {
                Selection.exit();
            });
        } else {
            // ===== 普通模式 =====
            var info2 = document.createElement('div');
            info2.style.cssText = 'font-size:12px;color:' + c.sub + ';margin-bottom:6px;text-align:center;';
            info2.textContent = LANG.t('selInfo', {sel: selCount, shown: displayList.length, total: total});
            ft.appendChild(info2);

            // 选择按钮（主入口）
            btn('☑ ' + LANG.t('selectBtn'), 'linear-gradient(135deg,#6366f1,#8b5cf6)', function () {
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

        var engineSel = document.createElement('select');
        engineSel.style.cssText = 'flex:1;padding:8px 10px;border:1px solid ' + c.border + ';border-radius:8px;background:' + c.bg + ';color:' + c.txt + ';font-size:13px;font-family:inherit;';
        var engines = TranslateEngine.list();
        var currentEngineKey = State.config.translateEngine || 'mymemory';
        for (var ei = 0; ei < engines.length; ei++) {
            var eOpt = document.createElement('option');
            eOpt.value = engines[ei].key;
            eOpt.textContent = engines[ei].icon + ' ' + engines[ei].label;
            if (engines[ei].key === currentEngineKey) eOpt.selected = true;
            engineSel.appendChild(eOpt);
        }
        engineSel.addEventListener('change', function () {
            TranslateEngine.use(engineSel.value);
            toast(LANG.t('saved'));
        });
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
            b.textContent = label; b.style.cssText = 'flex:1;min-width:110px;padding:10px 12px;border:none;border-radius:10px;background:' + bg + ';color:#fff;font-size:13px;font-weight:600;cursor:pointer;';
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
                toast('🔊 ' + LANG.t('saved'));
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
            statusEl.textContent = engine.icon + ' ' + LANG.t('translating', {from: from, to: to});
            statusEl.style.color = '#6366f1';
            output.textContent = LANG.t('translatingShort');
            TranslateEngine.translate(text, from, to, function (result, err) {
                if (err) { statusEl.textContent = LANG.t('transFail') + ': ' + err; statusEl.style.color = '#ef4444'; output.textContent = LANG.t('transFailShort') + err; }
                else { statusEl.textContent = engine.icon + ' ' + LANG.t('transDone') + new Date().toLocaleTimeString(); statusEl.style.color = '#10b981'; output.textContent = result; }
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
            b.textContent = label;
            b.style.cssText = (flex ? 'flex:' + flex + ';' : 'flex:1;') + 'min-width:110px;padding:10px 12px;border:none;border-radius:10px;background:linear-gradient(135deg,' + color + ');color:#fff;font-size:13px;font-weight:600;cursor:pointer;';
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
            b.textContent = label;
            b.style.cssText = 'flex:1;min-width:110px;padding:10px 12px;border:none;border-radius:10px;background:linear-gradient(135deg,' + color + ');color:#fff;font-size:13px;font-weight:600;cursor:pointer;';
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

    // ===== 设置 Tab =====
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
            arrow.textContent = expanded ? '▼' : '▶';
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
        var themes = [['auto', '🖥 ' + LANG.t('themeAuto')], ['light', '☀ ' + LANG.t('themeLight')], ['dark', '🌙 ' + LANG.t('themeDark')]];
        for (var ti = 0; ti < themes.length; ti++) {
            (function (t) {
                var b = document.createElement('button');
                b.textContent = t[1];
                var active = State.config.theme === t[0];
                b.style.cssText = 'width:100%;min-width:0;padding:10px;border:none;border-radius:10px;background:' + (active ? 'linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ')' : c.bg3) + ';color:' + (active ? '#fff' : c.txt) + ';font-size:13px;font-weight:600;cursor:pointer;' + (active ? 'box-shadow:0 4px 12px ' + c.primary + '4d;' : '');
                b.addEventListener('click', function () { State.config.theme = t[0]; State.save(); applyPanelThemeNow(); UI.renderSettings(); toast(LANG.t('saved')); });
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
        var styles = [['normal', LANG.t('uiStyleNormal')], ['material', LANG.t('uiStyleMaterial')], ['apple', LANG.t('uiStyleApple')]];
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
        cpSave.textContent = '💾 ' + LANG.t('ok');
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
        function numSetting(label, key, min, max, step) {
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
            row.appendChild(lab); row.appendChild(inp); confRow.appendChild(row);
        }
        numSetting(LANG.t('concurrency'), 'batchConcurrency', 1, 8, 1);
        numSetting(LANG.t('intervalMs'), 'batchDelay', 50, 5000, 100);
        numSetting(LANG.t('retries'), 'batchRetry', 0, 5, 1);
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
        numSetting(segLabel, 'm3u8Concurrency', 1, 8, 1);
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
            b.textContent = label;
            b.style.cssText = (flex ? 'flex:' + flex + ';' : 'flex:1;') + 'min-width:100px;padding:10px 12px;border:none;border-radius:10px;background:' + color + ';color:#fff;font-size:13px;cursor:pointer;font-weight:600;';
            b.addEventListener('click', handler); ob.appendChild(b);
        }
        mkOBtn(LANG.t('rescan'), 'linear-gradient(135deg,#6366f1,#8b5cf6)', function () { Scanner.doFull(function () { toast(LANG.t('rescanDone')); UI.renderMedia(State.tab); }); });
        mkOBtn(LANG.t('exportAllConfig'), '#10b981', function () { copyText(State.exportConfig()); }, 1.3);
        mkOBtn(LANG.t('importConfig'), '#f59e0b', function () {
            var t = prompt(LANG.t('pasteJson'));
            if (!t) return;
            var res = State.importConfig(t);
            if (res.ok) { toast('✅ ' + res.msg); applyPanelThemeNow(); UI.renderSettings(); }
            else toast('❌ ' + res.msg, '#ef4444');
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
                    State.save(); 
                    toast(LANG.t('saved')); 
                    if (State.panel) {
                        var wasOpen = State.panel.classList.contains('_ms_open');
                        State.panel.remove();
                        State.panel = null;
                        UI.createPanel();
                        if (wasOpen) State.panel.classList.add('_ms_open');
                        UI.switchTab(State.tab || 'img');
                    }
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
        drBtn.textContent = '💾 ' + LANG.t('saveRules');
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
        if (typeof UI._pluginSettingTab !== 'string') UI._pluginSettingTab = 'rules';
        var pluginContent = document.createElement('div');
        var pluginDesc = document.createElement('div');
        pluginDesc.textContent = UI._pluginSettingTab === 'rules' ? LANG.t('pluginRulesDesc') : LANG.t('pluginParsersDesc');
        pluginDesc.style.cssText = 'font-size:12px;color:' + c.sub + ';margin-bottom:10px;';
        pluginContent.appendChild(pluginDesc);

        var pluginTabWrap = document.createElement('div');
        pluginTabWrap.style.cssText = 'display:flex;gap:8px;margin-bottom:12px;';
        var pluginTabs = [['rules', LANG.t('pluginRules')], ['parsers', LANG.t('pluginParsers')]];
        function updatePluginTabStyles() {
            var btns = pluginTabWrap.querySelectorAll('button');
            for (var bi = 0; bi < btns.length; bi++) {
                var isActive = pluginTabs[bi][0] === UI._pluginSettingTab;
                btns[bi].style.background = isActive ? 'linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ')' : c.bg3;
                btns[bi].style.color = isActive ? '#fff' : c.txt;
            }
            pluginDesc.textContent = UI._pluginSettingTab === 'rules' ? LANG.t('pluginRulesDesc') : LANG.t('pluginParsersDesc');
        }
        for (var pti = 0; pti < pluginTabs.length; pti++) {
            (function (pt) {
                var b = document.createElement('button');
                b.textContent = pt[1];
                b.style.cssText = 'flex:1;padding:10px;border:none;border-radius:10px;background:' + (UI._pluginSettingTab === pt[0] ? 'linear-gradient(135deg,' + c.primary + ',' + c.primary2 + ')' : c.bg3) + ';color:' + (UI._pluginSettingTab === pt[0] ? '#fff' : c.txt) + ';font-size:13px;font-weight:600;cursor:pointer;';
                b.addEventListener('click', function () {
                    UI._pluginSettingTab = pt[0];
                    rulesSection.style.display = UI._pluginSettingTab === 'rules' ? 'block' : 'none';
                    parsersSection.style.display = UI._pluginSettingTab === 'parsers' ? 'block' : 'none';
                    updatePluginTabStyles();
                });
                pluginTabWrap.appendChild(b);
            })(pluginTabs[pti]);
        }
        pluginContent.appendChild(pluginTabWrap);

        var rulesSection = document.createElement('div');
        rulesSection.style.display = UI._pluginSettingTab === 'rules' ? 'block' : 'none';
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
        ruleFormTitle.textContent = '➕ ' + LANG.t('addRule');
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
            ruleFormTitle.textContent = '➕ ' + LANG.t('addRule');
            ruleNameInp.value = '';
            rulePatternInp.value = '';
            ruleTypeSel.value = 'host';
            ruleActionSel.value = 'block';
            ruleEnabledCb.checked = true;
        }
        function showRuleForm(rule) {
            ruleEditingId = rule.id;
            ruleFormTitle.textContent = '✏️ ' + LANG.t('edit') + ' ' + (rule.name || rule.pattern);
            ruleNameInp.value = rule.name || '';
            rulePatternInp.value = rule.pattern || '';
            ruleTypeSel.value = rule.type || 'host';
            ruleActionSel.value = rule.action || 'block';
            ruleEnabledCb.checked = rule.enabled !== false;
        }

        var ruleFormBtns = document.createElement('div');
        ruleFormBtns.style.cssText = 'display:flex;gap:8px;';
        var ruleSaveBtn = document.createElement('button');
        ruleSaveBtn.textContent = '💾 ' + LANG.t('ok');
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
        parsersSection.style.display = UI._pluginSettingTab === 'parsers' ? 'block' : 'none';
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
        parserFormTitle.textContent = '➕ ' + LANG.t('addParser');
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
            parserFormTitle.textContent = '➕ ' + LANG.t('addParser');
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
            parserFormTitle.textContent = '✏️ ' + LANG.t('edit') + ' ' + (parser.name || parser.matchPattern);
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
        parserSaveBtn.textContent = '💾 ' + LANG.t('ok');
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
        thumbInfo.innerHTML = '<div style="font-size:13px;font-weight:700;color:' + c.txt + ';">🎞 ' + LANG.t('autoThumb') + '</div><div style="font-size:11px;color:' + c.sub + ';margin-top:2px;">' + LANG.t('autoThumbDesc') + '</div>';
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
        updInfo.innerHTML = '<div style="font-size:13px;font-weight:700;color:' + c.txt + ';">🔄 ' + LANG.t('autoCheckUpdate') + '</div><div style="font-size:11px;color:' + c.sub + ';margin-top:2px;">' + LANG.t('autoCheckUpdateDesc') + '</div>';
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
        persistInfo.innerHTML = '<div style="font-size:13px;font-weight:700;color:' + c.txt + ';">💾 ' + LANG.t('persistSelection') + '</div><div style="font-size:11px;color:' + c.sub + ';margin-top:2px;">' + LANG.t('persistSelectionDesc') + '</div>';
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
            if (kind === 'image') return '🖼 ' + LANG.t('img');
            if (kind === 'audio') return '🎵 ' + LANG.t('audio');
            if (kind === 'm3u8') return '📺 ' + LANG.t('m3u8');
            if (kind === 'stream') return '🔗 ' + LANG.t('video');
            return '🎬 ' + LANG.t('video');
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
                    left.textContent = (item.success ? '✅ ' : '❌ ') + (item.name || item.url);
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
        try { UI.applyUiStyle(); } catch (e) { LOG.error('应用界面风格失败:', e); }
        State._applyTheme = applyPanelThemeNow;
    }

    // 注册渲染防抖
    State._renderThrottled = U.throttle(function () {
        var t = State.tab;
        if (t === 'img' || t === 'video' || t === 'audio' || t === 'm3u8') UI.renderMedia(t);
    }, 400);

    UI.registerShortcuts = function () {
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
                        toast(err ? '❌ 翻译失败' : LANG.t('transDone'));
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
    // 💬 模块 14：选中文字翻译浮窗
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
    // 🚀 模块 15：初始化 + 轮询守护 + 动态内容适配
    // =========================================================================
    State.init = function () {
        if (window.top !== window.self) return false;

        var host = document.body || document.documentElement;
        if (!host || host.nodeType !== 1) return false;

        State.load();

        if (!State.scanner) {
            try {
                State.scanner = createScanner({ useWorker: true, incremental: true });
                State.scanner.start();
            } catch (e) { LOG.warn('ScannerService 初始化失败:', e); }
        }

        try { UI.buildFloatBtn(); } catch (e) { LOG.warn('构建浮动按钮失败:', e.message); }
        try { UI.buildSelectionPopup(); } catch (e) { LOG.warn('构建选区浮窗失败:', e.message); }
        try { UI.registerShortcuts(); } catch (e) { LOG.warn('注册快捷键失败:', e.message); }
        try { installNetHook(); } catch (e) { LOG.warn('网络拦截安装失败:', e.message); }

        LOG.info('初始化完成');

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

        return true;
    };

    // SPA 路由变化重新触发
    try {
        window.addEventListener('hashchange', function () { setTimeout(State.init, 300); });
        window.addEventListener('popstate', function () { setTimeout(State.init, 300); });
        // 动态内容适配：监听 DOM 变化（MutationObserver）
        var _mo = null;
        var _moPaused = false;
        var _moResumeTimer = null;

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
        _mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
        LOG.info('MutationObserver 已启动');
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
    setTimeout(State.init, 500);
    setTimeout(State.init, 1500);
    setTimeout(State.init, 3000);

    // window.load 兜底
    window.addEventListener('load', function () {
        setTimeout(State.init, 300);
        setTimeout(State.init, 1200);
    });
        return {};
    })();
    } catch (_msFatal) {
        console.error('[MS] 致命错误，脚本未能启动:', _msFatal);
        try { console.error(_msFatal.stack); } catch (e) {}
    }
})();
