# 更新日志

## v1.11 · 液态玻璃控件与面板动效 + 6 项 P0 缺陷修复 · 2026-10-02

- **[UI · 液态玻璃]** iOS 27 风格下的两个浮层控件补上真正的玻璃材质（此前仍是近乎实心的旧底色，与面板的流体玻璃不搭）：
  - **浮动按钮** `#_ms_float._ms_btn_ios27`：底色透明度由 0.86 / 0.94 降到 **0.30 / 0.40**（深 / 浅），
    配 `blur(30px) saturate(230%) brightness(1.10)`、径向白色高光 + 150° 染色渐变、1px 镜面描边与顶部内高光 —— 背后内容真正透得上来。
    补 `@supports not (backdrop-filter)` 兜底（退回较实的底色），图标在不支持模糊的浏览器上依然清晰。
  - **轻提示条** `._ms_toast`：改为半透明染色（`rgba(16,185,129,0.42)`，浅色 0.52）+ `blur(26px) saturate(210%)` + 上下渐变高光 + 镜面边框，
    阴影**按调用方传入的颜色推导**（红色错误提示因此也是红的）；`normal` / `material` 风格完全不受影响，仍为不透明纯色。
- **[UI · 提示条动效]** 提示条改为**从屏幕顶部滑入 → 停留 2.5 秒 → 向上滑出**后移除节点（原为原地淡出并上移 10px）：
  - 起点 `translateY(calc(-100% - 72px))`：任何提示条高度都保证完全在屏幕外，不会露一条边。
  - 滑入 0.42s 弹性回弹曲线、透明度 0.28s 更快显形；出场 0.40s 向上收回后移除节点，不留残留 DOM。
  - 用**双 `requestAnimationFrame` + 90 ms `setTimeout` 兜底**驱动：后台标签页里 rAF 不触发，只靠 rAF 会让提示条永不出现。
  - `prefers-reduced-motion` 下不做位移，直接显隐。
- **[UI · 面板出入场]** 面板「从右往左出现」重做，桌面与移动端**分两套参数**（桌面是 420px 右缘抽屉，移动端是整屏覆盖，形态完全不同，不能共用）：
  - **桌面**：起点 `translateX(100%) scale(.94)` + `transform-origin:100% 50%`，视觉上沿右边缘展开；
    位移 0.46s 强 ease-out（50% 时间走完 96% 路程，尾段几乎静止地落位），透明度 0.24s 更快显形（原两者同为 0.4s，面板会长时间半透明地飘）。
  - **内层错峰**：标题栏 → 标签 → 搜索 → 内容 → 底栏依次从右侧轻推入场（间隔 45 ms、单块 380 ms），滚动内容区位移更小（12 px），
    用 `Element.animate` + `fill:backwards`（延迟期间保持未出现，播完不残留合成层）。
  - **关闭更利落**：位移 0.34s 收走曲线 + 透明度 0.3 s **与位移同步**（原先提前淡完，面板先隐身再滑走，根本看不到收起过程）。
  - **[修复]** 重复调用 `openPanel`（切标签 / 快捷下载）原先会「闪一下又滑一遍」—— 检测到已打开即跳过重播。
  - **[修复]** 入场途中关闭面板会被 rAF 回调「弹回来」—— 回调补状态检查。
  - 动画期间把面板提到独立合成层（内含背景模糊，不提升容易掉帧），**900 ms 后自动释放**，不长期占用合成层内存。
- **[性能 · 移动端面板动效]** 移动端滑动不再照搬桌面参数，三处针对性的调整：
  - **停用全屏背景模糊**：面板在移动端是整屏的，44px `backdrop-filter` 在滑动中每帧都要重新采样并模糊整个屏幕，
    再乘上 2~3 倍 DPR（412×915 约 **3.4 M 像素/帧**）—— 这是移动端滑动掉帧的主因。滑动期间挂 `_ms_sliding` 临时停用模糊，
    用接近不透明的主题底色顶替（0.34 s 内肉眼几乎无感），**420 ms 后自动恢复玻璃**，底色本身有 0.35 s 过渡所以恢复时不跳；
    同时暂停色团动画（面板在动时看不见，白烧 GPU）。桌面端**不动**（窄面板代价可接受，不牺牲观感）。
  - **改为纯位移擦入**：不做缩放扩散（整屏缩到 .94 会把页面从「缩小一圈的框」里露出来，像缩放不像抽屉）、
    不做整屏淡入（全屏元素淡入 = 整屏糊成一片），只有一条干净的推进边。
  - **曲线与时长按整屏距离重算**：入场 `.34s cubic-bezier(.34,.72,.34,1)`、出场 `.28s`。桌面曲线前 10% 时间就冲完 40%，
    在 400 px 长距离上等于「砸」进来；新曲线 10% 走 22%、50% 走 89%，起步柔和、中段走完、尾段轻落。
  - **内层错峰减负**：整屏面板不淡入，内容若一开始就消失会看到「一整块空玻璃」再长出内容 —— 故加 170 ms 起始延迟（面板基本到位时内容再显形），
    单块 220 ms、间隔 30 ms、位移 8 px，并**跳过最重的滚动内容区**（长列表整块参与动画要额外合成/重绘，跳过观感几乎无差、代价差很多）。
  - **[修复]** 移动端不再使用 `max-height:100vh`：移动浏览器地址栏会改变动态视口，`100vh` 会让面板在滑动途中被重新定尺寸（表现为跳一下），改用 `top:0 + bottom:0` 定高。
- **[修复 · P0]** `UI._paletteColors` 引用了从未声明的 `custom`：一旦使用**自定义调色板**就抛 `ReferenceError`，
  调色板直接失效。已补 `var custom = UI._getCustomPalette(id);`。
- **[修复 · P0]** `UI.applyUiStyle` 中 `_ms_sliding` 规则读取了未声明的 `c`（主题底色），异常被 `catch` 吞掉，
  导致该规则**从未生成**、移动端滑动停用模糊的优化等于没生效。已补 `var c = UI.colors();`。
- **[修复 · P0]** `UI._loadVisibleVideoThumbs` 缩略图加载失败的兜底里用了 `elem.parentNode.appendChild(...)`：
  但 `elem` 早已被上一行的 `replaceChild(img, elem)` 摘除，`parentNode` 为 `null` —— 失败时必抛 `TypeError`，
  占位图标永远显示不出来。已改为替换已挂上的 `img`，并对元素被虚拟列表回收的情况加保护。
- **[修复 · P0]** `HttpBackend._runChunked` 分片重试耗尽后回调错误，但 `chunk.done` 仍为 `false`，
  `_nextPendingSeq()` 会**一直返回同一个 seq → 无限重试**，任务永远停在 running。四处联动修复：
  1. `_makeChunks` / 续传恢复时为每个分片补 `running` / `failed` 字段；
  2. `_nextPendingSeq` 跳过 `done || failed`；
  3. 失败回调统一标记 `chunk.failed = true`（覆盖 worker error / postMessage / HTTP 非 2xx / onerror / ontimeout **全部失败路径**）；
  4. 新增收尾判定：所有分片都到终态时，有失败则回调 `onError`（附失败分片范围）并释放 worker，**不合并**残缺文件。
  另修掉两个同源缺陷：收尾逻辑加幂等标志（回调路径与 `next()` 路径都会走到，原先会**重复合并 / 重复触发下载**）；
  续传记录里 `running:true` 的残留会在恢复时清掉（否则该分片被永久跳过，最后用残缺 buffer 合并出坏文件）。
- **[修复 · P0]** `TranslateEngine._fallback` 只排除「当前失败引擎」，其他已失败引擎会重新进入候选 ——
  两个引擎都失败时 A、B **无限互相降级**（异步递归，永不回调），表现为翻译一直转圈、请求停不下来。
  改为**已尝试集合** `tried`，遍历完所有引擎后回调 `transAllFail`。
- **[修复 · P0]** `State._computeTheme` 每次调用都注册一个 `matchMedia` 监听器，而 `State.getTheme()`
  每次都会调用它（`UI.colors()` 又大量调用 `getTheme()`）→ 监听器无限堆积的内存泄漏。
  已抽出 `State._installThemeWatcher()` 做一次性安装，并兼容只支持 `addListener` 的旧浏览器。
- **[验证]** 全套无依赖测试：P0 缺陷 49 项 · 面板动画 184 项 · iOS 27 玻璃 143 项 · 版本一致性 27 项 ·
  未定义引用 0 项 · 性能回归（3086 条 URL 语料 × 5 个函数）0 差异。
  P0 的 6 项均做过**反向验证**：把修复逐个还原，确认测试真的会失败（分别抓到 `ReferenceError` / 规则缺失 /
  `Cannot read properties of null` / 同一分片被下载 51 次 / 同一引擎被调用 31 次 / 监听器数量 100），确保测试测的是行为而非文本。

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