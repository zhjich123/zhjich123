# 媒体嗅探器 Media Sniffer Pro

一个功能强大的 Tampermonkey / ScriptCat 油猴脚本，用于抓取网页中的图片、视频、音频、m3u8 流媒体资源，支持批量下载、AES-128 解密、翻译、Cookie/Storage 管理等功能。

> **当前版本：v1.10** · [下载最新版](https://github.com/zhjich123/zhjich123/releases/latest)

## 功能特性

- 多类型资源嗅探：图片、视频、音频、m3u8 流媒体
- 虚拟列表与进度可视化
- AES-128 解密与分片合并
- 批量下载与 Aria2 推送
- 翻译工具（中/英/日/韩等多语言）
- Cookie / Storage 管理
- 界面主题与界面风格切换（普通 / Material / **iOS 27 流体玻璃**）
- 自定义域名规则
- 自定义主题色盘：支持添加、编辑、删除自定义渐变色方案
- 面板位置记忆与快捷操作面板
- 脚本市场 / 插件系统：自定义过滤规则 + 第三方解析器插件
- 多语言界面（简体中文 / English / 日本語 / 한국어）

## 安装方式

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 或 [ScriptCat](https://docs.scriptcat.org/) 扩展
2. 访问 [Releases](https://github.com/zhjich123/zhjich123/releases) 页面
3. 下载最新版本的 `.user.js` 文件
4. 点击安装即可使用

## 快捷键

- `Alt + B`：开关面板
- `Alt + T`：翻译选中文本
- `Esc`：关闭面板

## 更新日志

### v1.10
**性能优化 + iOS 27 流体玻璃**

- **性能**：8 个热路径函数改为不构造 `URL` 对象的字符串直算并加记忆化，实测（3086 条 URL 语料 × 5 轮平均）
  `isSafeUrl` **≈5.6×**、`absUrl` **≈5.1×**、`nameFromUrl` ≈2.9×、`guessKind` ≈1.5×；
  且在 3086 条语料上与旧实现结果**完全一致（0 差异）**
- **性能 · 状态与网络**：`U.uniq` 改用 `Set`；`State.save` 250 ms 防抖 + 页面隐藏时落盘；
  `NetState._flush` 去掉冗余全表去重；hook / 快捷键注册 / `State.init` 幂等化；`AutoUpdater` 30 s 在途合并
- **性能 · 渲染**：资源卡片改为事件委托（不再每卡片一个监听器）；`UI.VirtualList` 重写为
  节点回收池 + 索引→节点 Map + rAF 合并滚动 + 签名比对 + `ResizeObserver`，去掉「每次滚动全量 `innerHTML` 重建」；
  `applyUiStyle` 按风格/主题/端/palette 记忆化；删除命中所有后代的 `#_ms_panel *` 全局过渡
- **UI · iOS 27 流体玻璃**：原「苹果」风格**原地重写**，设置里选项名显示为「iOS 27」
  - 玻璃背后三个色斑以 23 / 29 / 34 秒多段关键帧漂移（只动 `transform` 走合成层），移动端自动减一个色团
  - **粘滞跟随**：每帧只向指针目标靠 18%，高光/湿润反射/色团是「被拖着流过去」而非硬跟手指，收敛后立即停止 rAF 不空转
  - 镜面高光 + 反向对位的湿润反射；顶部高光用「静态版 + 指针增强版」渐进增强，解析失败自动回退
  - 按压触发波纹漾开 + 色团加速（23 s → 11 s）+ 反射增强，控件圆角收紧后弹性回弹
  - 无 `backdrop-filter` 时退化为高不透明底；`prefers-reduced-motion` 时关闭全部动效；配色跟随自选 palette
  - 旧配置 `uiStyle:'apple'` 自动迁移为 `'ios27'`，不会重置用户配置
- **修复**：`UI.createPanel()` / `SEC.absUrl` 相关函数被调用但从未定义 → 切换界面语言后面板被移除却无法重建
- **修复**：`Selection.getBatchActions()` 缺失 → 选择模式下点「批量」菜单抛错，「重新扫描 / 关闭」按钮一起消失
- **清理**：删除 `U.escHtml` / `b64Encode` / `b64Decode` / `chunk` / `uid` / `randColor`、`SEC.safeUrl`、
  `AES.pad16` / `bytesToStr`、`Selection.isFavorite` / `removeFavorite` / `getGroups` 等死代码，以及 18 行混入注释的 SVG（-10.6 KB）
- **清理**：M3U8 的 GM_xmlhttpRequest / XHR 双路径合并为 `M3U8._httpGet`（并修掉其双回调）；
  5 处重复的 title / `og:image` 抓取块合并为 `VideoResolver.fillFromHtml`

### v1.0.9
**Apple iOS 27 真·液态玻璃版**

- Apple 主题升级为 iOS 27 同款 Liquid Glass 五层液态玻璃物理模型：折射层 / 染色层 / 流动高光层 / 边界层 / 阴影层
- 新增 `UI._bindLiquidPointer()` 指针位置追踪（`pointermove` / `touchmove` + rAF 节流），
  实时写入 `--mx/--my/--px/--py/--pressure` 五个 CSS 变量，面板 / Tab 胶囊 / 选中胶囊 / 悬浮按钮 4 处独立高光随鼠标流动
- 切回 normal / material 主题时自动移除全部液态 DOM 层，避免残留
- 删除装饰性过强代码（`conic-gradient` 虹彩光环、`inset` 内散光、多重阴影堆叠），回归纯正 Apple Liquid Glass 公式
- 修复 Tab 条横向「滑不动 / 右侧被切」：`overflow:hidden` → `overflow-x:auto` + 滚动条隐藏 + `scroll-snap` 惯性吸附
- 组件液态化同步：Tab 胶囊、选中胶囊、资源卡片、Footer、搜索框、悬浮按钮全部独立液态分层
- 版本号统一升级 v1.0.8 → v1.0.9


### v1.0.8
- 新增「插件市场」：独立「插件」Tab，市场浏览 + 已安装管理双视图
- PluginManager 核心模块：安装/卸载/启用/禁用/持久化存储完整 API
- 内置 8 个示例插件（自动翻译、批量重命名、视频去水印、自动封面、画质增强、快捷键Pro、暗色Pro、资源导出）
- 修复翻译引擎下拉框 SVG 乱码：原生 select → 自定义下拉组件
- ICONS 新增 store、pause SVG 图标
- 中/英/日/韩 × 50+ 条插件相关多语言文本

### v1.0.7
- 修复翻译引擎返回原文不触发降级的问题（如翻译 "Holle" 时原样返回）
- MyMemory 引擎优化：优先使用 matches 中质量最高的翻译
- 翻译降级机制改进：优先选择免费引擎，降级后也检测原文返回
- 修复按钮 SVG 图标被当作纯文本显示的问题（textContent → innerHTML）
- 为所有按钮添加 flexbox 对齐样式，SVG 图标与文字水平居中对齐
- 全面清理 LANG 字典语法错误（中/英/日/韩四语言版本）
- 清理残留 emoji 字符，统一使用 SVG 矢量图标

### v1.0.6
- 修复 IIFE 模块拆分导致的变量作用域错误，脚本启动崩溃问题
- 修复右下角浮动按钮不显示（SVG 矢量图标替换 emoji）
- 新增全局错误捕获，启动失败时打印详细堆栈
- 统一模块变量名，清理冗余代码

### v1.0.5
- 统一配置对象 `MS_CONFIG` 与组件工厂 `MS_FACTORY`
- IIFE 模块按功能拆分，提高代码可维护性
- 修复暗色/苹果风格按钮占比、自定义配色持久化等多项问题

### v1.0.4
- 自定义主题色盘：支持添加、编辑、删除自定义渐变色方案
- 面板位置记忆：新增高度、位置、上次打开标签页的记忆
- 浮动按钮快捷操作面板：桌面右键 / 移动局长按触发快捷菜单

### v1.0.3
- 新增脚本市场 / 插件系统
- 界面支持中/英/日/韩多语言

### v1.0.2
- 新增三种界面风格：普通 / Material / 苹果玻璃拟态
- 苹果风格下浮动按钮同步应用玻璃拟态效果

### v1.0.1
- 修复自动更新检测功能
- 修复翻译功能（改用 GM_xmlhttpRequest 解决 CORS 限制）

### v1.0.0
- 初始版本发布