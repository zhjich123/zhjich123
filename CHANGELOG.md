# 更新日志

## v1.10 · 性能优化 + iOS 27 流体玻璃 · 2026-10-02

- **[性能 · 热路径]** 五个高频函数改为「不构造 URL 对象」的字符串直算并加记忆化，实测提速（3086 条 URL 语料 × 5 轮平均）：
  - `SEC.isSafeUrl` 首字符分流：3.73 ms → 0.66 ms（**≈5.6×**）
  - `SEC.absUrl` 规范绝对地址直通 + 结果记忆化：3.03 ms → 0.59 ms（**≈5.1×**）
  - `SEC.nameFromUrl` 记忆化：4.43 ms → 1.52 ms（≈2.9×）
  - `SEC.guessKind` 改用扩展名查表（替代 4 条正则）+ 记忆化：1.84 ms → 1.21 ms（≈1.5×）
  - `SEC.extFromUrl` 记忆化
  - 等价性：上述函数在 3086 条语料上与旧实现**结果完全一致**（0 差异）
- **[性能 · 状态与网络]** `U.uniq` 对象键改 `Set`；`State.save` 改为 250 ms 防抖并挂 `pagehide`/`beforeunload`/`visibilitychange` 落盘；
  `NetState._flush` 去掉冗余全表去重；`installNetHook` / `UI.registerShortcuts` / `State.init` 幂等化（重复注入不再叠加监听器）；
  `AutoUpdater._checkRaw` 增加 30 s 在途合并。
- **[性能 · 渲染]** 资源卡片由「每卡片一个 dblclick 监听」改为一次性事件委托；非虚拟网格改单次 `innerHTML` 构建；
  `UI.VirtualList` 重写为**节点回收池 + 索引→节点 Map + `requestAnimationFrame` 合并滚动 + 签名比对**（仅选中态变化才重渲）
  \+ `ResizeObserver` 跟踪视口，彻底去掉「每次滚动全量 `innerHTML` 重建」；
  `UI.applyUiStyle` 按 `style|dark|mobile|palette` 键记忆化，不再重复重建整段 CSS。
- **[性能 · 动效]** 删除命中所有后代的 `#_ms_panel *` 全局过渡规则（原先每个卡片/按钮都参与合成与样式重算），
  改为只给面板主要容器挂过渡、切换主题时临时开 `_ms_theming`；面板关闭 / 页面切后台时 `body._ms_glass_idle` 暂停全部无限动画。
- **[UI · iOS 27 流体玻璃]** 「苹果」风格原地重写为 **iOS 27 流体玻璃（Liquid Glass）**，深/浅色与桌面/移动端四套参数：
  - **流体色团**：`._ms_gl_wrap` 内三个大色斑以 23 / 29 / 34 秒多段关键帧漂移（位移 + 缩放同时变），静态不对称圆角（非正圆，更接近液滴），
    只动 `transform` 走合成层，不触发重排重绘；移动端自动减一个色团以省合成开销。
  - **粘滞跟随**：`UI._bindGlassMotion` 每帧只向指针目标靠 18%（视差 12%）插值，高光、湿润反射与色团是「被拖着流过去」而非硬跟手指；
    收敛后立即停止 `requestAnimationFrame`（不空转），面板矩形做缓存避免每帧强制布局。
  - **折射与厚度**：镜面高光 `._ms_gl_spec` + 反向对位的湿润反射 `._ms_gl_wet`（`calc()` 驱动的对位光斑）；
    顶部高光采用「静态版 + 指针增强版」两条规则渐进增强，后者解析失败自动回退。
  - **按压反馈**：`._ms_pressing` 触发波纹漾开 + 色团加速（23 s → 11 s）+ 湿润反射增强，控件圆角收紧后弹性回弹。
  - 材质 `blur(44/38px) saturate(215/185%) brightness(1.07/1.04)` + 顶部强高光 / 两侧渐弱 / 底部弱反光的镜面边缘 + 青品红边缘色散 + 9.5 s 光扫。
  - 兼容：旧配置 `uiStyle:'apple'` 在 `State.load()` 中于 `validateConfig` **之前**迁移为 `'ios27'`（否则旧用户配置会被整体重置）。
  - 克制：不改卡片 `border`（保住选中态 2px 主色描边），不直接命中 `[data-url]`（避免误伤视频缩略图占位）；
    `@supports not (backdrop-filter)` 时退化为高不透明底，`prefers-reduced-motion` 时关闭全部动效；配色跟随用户自选 palette。
- **[修复]** `UI.createPanel()` / `SEC.absUrl` 等函数被调用但从未定义，导致切换界面语言后面板被移除却无法重建 —— 已改为真实函数。
- **[修复]** `Selection.getBatchActions()` 缺失，选择模式下「批量」菜单渲染时抛错，导致同排的「重新扫描 / 关闭」按钮一起消失 —— 已补实现。
- **[清理]** 删除死代码：`U.escHtml` / `U.b64Encode` / `U.b64Decode` / `U.chunk` / `U.uid` / `U.randColor`、`SEC.safeUrl`、
  `AES.pad16` / `AES.bytesToStr`、`Selection.isFavorite` / `removeFavorite` / `getGroups`、`State.shouldRun`、
  `unregisterGroupRule` / `getGroupRules` / `unregisterBatchAction`、`UI._unobserveVlinkCards`；清理 18 行混入注释的 SVG（-10.6 KB）。
- **[清理]** M3U8 的 `GM_xmlhttpRequest` / XHR 双路径合并为 `M3U8._httpGet`（并修掉其 `done` 双回调问题）；
  5 处重复的 title / `og:image` 抓取块合并为 `VideoResolver.fillFromHtml`。
- **[已知问题]** 以下为上游遗留、本版未改动：① 分组功能空转——`registerGroupRule` / `toggleGroup` 有 UI 入口，
  但渲染路径不读分组结果，点「按域名分组」不会改变显示；② 「停止下载」没有 UI 入口——`Dl.stop` / `M3U8.stopDownload`
  与文案 `dlStopped` 都在，只是没有任何地方调用；③ `ScannerService` / `DownloadManager` 及其各 Backend 原型类为上游框架预留，脚本内从不实例化。
- **[注意]** 本版基于 **v1.0.8** 分支开发。v1.0.9 的以下改动不在本版范围内：移动端 Tab 条横向滚动修复、`U.isMobile` 三重判定、
  面板拖拽重构与拖拽把手配色、浮动按钮拖拽加固、按钮 `innerHTML` 图标渲染修复、Tab 标签图标前缀调整、日语/韩语 `selectBtn` 补齐、4 个插件图标更换。
  如需完整合并请反馈。

## v1.0.9 · Apple iOS 27 真·液态玻璃版 · 2026-08-29
- **[UI · Apple 主题 · 核心升级]** 升级为 iOS 27 同款 Liquid Glass 5 层真实液态玻璃物理模型：
  - Layer 1 折射层（中心 blur 28px / 边缘 blur 62px 径向 mask + scale(1.015) 边缘放大）
  - Layer 2 染色层（极低半透底 + 冷蓝/暖粉 色散微光叠层 + `--pressure` 受压变浓）
  - Layer 3 流动高光层（`radial-gradient` 光斑跟随 `--mx/--my` 指针坐标流动，实现水膜反光）
  - Layer 4 边界层（顶部 1px hairline 高光线 + 左缘 mask 渐变反光曲面）
  - Layer 5 阴影层（单层柔和下抛阴影，无多层堆叠）
- **[UI · 流动性引擎]** 新增 `UI._bindLiquidPointer()` 指针位置追踪器（`pointermove`/`touchmove` + `requestAnimationFrame` 节流），
  实时写入 `--mx/--my/--px/--py/--pressure` 5 个 CSS 变量，**面板 / Tab 外层胶囊 / 选中白胶囊 / 悬浮按钮 4 处独立高光**随鼠标流动，
  切换为 normal/material 主题时自动移除所有液态 DOM 层，避免残留。
- **[UI · Apple 主题 · 回归简洁]** 彻底删除所有装饰性过强代码：`conic-gradient` 虹彩光环、`inset 0 0 40px` 内散光、多重阴影堆叠，
  保留纯粹 Apple Liquid Glass 标准公式，无彩虹无发光点。
- **[UI · 交互修复]** 修复 Tab 条横向「滑不动 / 右侧被切」：
  - `#_ms_tabs overflow:hidden` → `overflow-x:auto` + 滚动条隐藏 + `scroll-snap` 惯性吸附
  - Apple 主题 Tab 内联 `flex:1` → `flex:0 0 auto; min-width:auto`，防止 Tab 被压缩导致右边溢出裁切
  - 选中 Tab 切换后自动 `rebind` 液态高光指针追踪
- **[UI · 组件液态化同步]** Tab 外层胶囊、选中白胶囊、资源卡片、Footer、搜索框、悬浮按钮全部独立液态分层；
  悬浮按钮 AssistiveTouch 升级为「折射层 + 染色色散层 + 流动水珠高光 + inset 顶高光」4 层水珠玻璃。
- **[全局]** 版本号统一升级 v1.0.8 → v1.0.9（UserScript 头 `@name`/`@version`、`VERSION` 常量、四语 `infoLine1` 版本信息）。

## v1.0.8
- 新增「插件市场」功能：独立的「插件」Tab，支持市场浏览 + 已安装管理双视图
- PluginManager 核心模块：完整的安装 / 卸载 / 启用 / 禁用 / 持久化存储 API
- 内置 8 个示例插件：自动翻译、批量重命名、视频去水印、自动封面提取、画质增强、快捷键增强、暗色主题Pro、资源导出助手
- 插件卡片 UI：分类渐变图标、版本/作者/安装日期元信息、启用/禁用状态徽章
- 子 Tab 切换栏（市场 / 已安装），渐变色激活态 + SVG 图标
- 修复翻译引擎下拉框乱码问题：原生 select → 自定义下拉组件，支持 SVG 图标显示
- ICONS 新增：store（商店）、pause（暂停）SVG 矢量图标
- LANG 多语言补全：中/英/日/韩四语言 × 50+ 条插件相关文本

## v1.0.7
- 修复翻译引擎返回原文不触发降级的问题（如翻译 "Holle" 时原样返回）
- MyMemory 引擎优化：优先使用 matches 中质量最高的翻译，增加原文返回检测
- 翻译降级机制改进：优先选择免费引擎，降级后也检测原文返回
- 修复分段翻译闭包变量问题，分段也增加原文返回检测
- 修复按钮 SVG 图标被当作纯文本显示的问题（textContent → innerHTML）
- 为所有按钮添加 flexbox 对齐样式，SVG 图标与文字水平居中对齐
- 修复翻译状态栏 engine.icon SVG 渲染问题
- 全面清理 LANG 字典语法错误（中/英/日/韩四语言版本）
- 清理残留 emoji 字符，统一使用 SVG 矢量图标

## v1.0.6
- 修复 IIFE 模块拆分导致的变量作用域错误，脚本启动崩溃问题
- 修复右下角浮动按钮不显示（SVG 矢量图标替换 emoji）
- 新增全局错误捕获，启动失败时控制台打印详细堆栈便于排查
- 统一模块变量名：`Utils→U`、`I18n→LANG`、`Settings→State`、`Translate→TranslateEngine`、`Downloader→Dl`
- 窗口 resize 时自动将浮动按钮拉回可视区域

## v1.0.5
- 统一配置对象 `MS_CONFIG`：集中管理 SVG 图标、颜色、尺寸、配色方案
- 组件工厂函数 `MS_FACTORY`：统一创建按钮、弹窗、卡片等 DOM 组件
- IIFE 模块拆分：按功能拆分为独立模块（Utils、i18n、Security、State、NetHook、Toast 等）
- 修复暗色/苹果风格按钮占比过大问题（grid 自适应布局）
- 修复自定义配色方案 `customPalettes` 未持久化保存
- 修复"成功"按钮文字为"保存"
- 修复 emoji 图标在部分设备显示为"?"的问题（替换为 SVG）

## v1.0.4
- 自定义主题色盘：支持添加、编辑、删除自定义渐变色方案
- 面板位置记忆：新增高度、位置、上次打开标签页的记忆
- 浮动按钮快捷操作面板：桌面右键 / 移动局长按触发快捷菜单

## v1.0.3
- 新增脚本市场 / 插件系统（自定义规则、第三方解析器插件）
- 界面支持中/英/日/韩多语言

## v1.0.2
- 新增三种界面风格：普通 / Material 3 / 苹果玻璃拟态
- 苹果风格下浮动按钮同步应用玻璃拟态效果

## v1.0.1
- 修复自动更新目标仓库为 `zhjich123/zhjich123`
- 修复翻译功能 CORS 问题，改用 `GM_xmlhttpRequest`

## v1.0.0
- 首个正式版本发布
- 完整的图片/视频/音频/M3U8 嗅探功能
- 支持 AES-128 解密与 M3U8 分片合并
- 内置多引擎翻译与划词翻译
- 完整的移动端适配