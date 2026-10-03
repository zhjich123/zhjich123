# 媒体嗅探器 Media Sniffer Pro

一个功能强大的 Tampermonkey / ScriptCat 油猴脚本，用于抓取网页中的图片、视频、音频、m3u8 流媒体资源，支持批量下载、AES-128 解密、翻译、Cookie/Storage 管理等功能。

> **当前版本：v1.13** · [下载最新版](https://github.com/zhjich123/zhjich123/releases/latest)

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

## bug反馈

如有 bug 或者有什么建议的欢迎反馈！

邮箱：zhengjingchen123456@outlook.com

## 更新日志

### v1.13
**修复「图片一多就糊成一团」的虚拟网格渲染 Bug + 补 @license 声明**

- **修复 · 严重**：图片超过 100 张切到虚拟列表后**卡片疯狂重叠、糊成一团**。
  根因是虚拟列表按「整行一项」排版（`left:0;right:0` 占满整行），而卡片实际是网格卡片
  （缩略图 `width:100%` + `aspect-ratio:1/1`）→ 被打成整屏宽的方块，
  行高却只按固定 130px 递增。已改为**真正的网格虚拟化**：按容器宽度算列数
  （移动端 2 列 / 桌面端按与非虚拟路径完全相同的 `minmax(120px,1fr)` 规则自适应），
  每张卡按 (行, 列) 绝对定位，行高 = 单元格高 + 间距
- **修复 · 严重**：虚拟列表读错了滚动容器。`container` 上的 `flex:1` 因其父级 `#_ms_box`
  不是 flex 容器而失效、自身永不滚动 —— 真正滚动的是 `#_ms_box`。于是 `scrollTop` 恒为 0
  （滚动时列表不更新）、`clientHeight` 等于整块内容高度（661 张卡一次性全塞进 DOM），
  虚拟化完全没生效，反而在最需要它的场景下最慢。已新增 `scrollParent` 参数显式传入真正的滚动源
- **修复**：滚动位置恢复后同步虚拟窗口，避免重渲染时先闪第一屏再跳回去
- **修复**：面板拖动缩放（列数变化）后重算列数并重排已有节点
- **修复**：两处挂在不会滚动的 `container` 上、**从未生效**的滚动监听 ——
  视频缩略图按需加载（滚动时新进入视口的卡片永远拿不到缩略图）、
  vLink 卡片滚动期间暂停动画。均已改挂到 `#_ms_box` 并补上防累加
- **新增**：元数据块补 `@license GPL-3.0-or-later`；版本一致性体检同步加入许可证校验
- **验证**：新增 `t-vgrid.js` 38 项断言（用最小 DOM 桩真跑虚拟列表，核心是
  **卡片两两重叠检测**：661 张 → 0 组重叠；只渲染视口内的行：661 条 → 实际 18 个 DOM 节点）；
  **反向验证 11/11**（逐条还原缺陷写法确认测试会失败）；回归 179 + 105 + 49 + 184 + 144 + 30 项全绿；
  性能 5 函数 × 3086 条 URL 语料 **0 差异**


### v1.12
**第三批 17 项缺陷修复 + 6 项代码审查问题 + 版本号统一**

- **修复 · P0**：`HttpBackend._runChunked` 进入时硬清零分片计数，而 `resume()` 带的是同一批分片 ——
  已完成的分片不会再有回调，`settle()` 条件永远凑不齐，**既不合并也不报错，任务永久卡在 running**。
  改为按分片真实状态重建计数 + 清掉 pause 遗留的 `running` + 复位 `_chunksSettled`
- **修复 · XSS**：`UI.previewM3u8` 两处直接拼 `url` 进 `innerHTML`，URL 含 `</` 会破坏整个弹窗结构；
  并顺带堵上同类的远端注入面（m3u8 文本里的 `label` / `resolution` / `keyMethod` 均为攻击者可控）
- **修复 · XSS**：`UI.renderMedia` 的 vLink 卡片封面未转义（`cover` 取自页面 `og:image`）
- **修复**：`mediaCardHtml` 选中描边硬编码靛蓝，切「玫瑰红」等配色后仍是旧色；并补完同类残留（选中光晕）
- **修复**：`_startTask` 里 `factory()` / `controller.start()` 裸调用，同步抛错时并发槽不回退 →
  **队列并发槽永久少一个**；已统一走 `abortStart()` 释放槽位
- **修复**：`AutoUpdater._getCache` 假设存储一定是字符串，遇到原生对象/坏 JSON 抛错 → 缓存永久失效 →
  **每次启动都重查 GitHub**
- **修复**：域名规则「存在 allow 即进入白名单模式」语义反直觉（加一条 allow 会拦下其它所有站点）→
  改为「allow 覆盖 block，都没命中即放行」；同时修掉注释推荐的 `block:'*'` **根本不生效**
  （`new RegExp('*')` 抛错被吞），已对 `pattern === '*'` 做 always-match 特判
- **修复**：切语言时 `innerHTML = label` 整块替换 → **丢失 tab 图标**（zh-CN 语言值无 SVG，
  且两层 `<span>` 包装被打掉，切一次语言 tab 栏视觉就崩）→ 图标表提到 `UI._tabIconMap`，
  新增 `UI._tabInnerHtml()` 统一生成结构；顺带修掉 en/ja/ko **双图标**（语言值自带 SVG）的老问题
- **修复**：JS 块注释被写在单引号字符串内部 → 整段注释**原样输出进 HTML**，挂上一堆垃圾属性并泄漏到页面源码
- **修复**：vLink 卡片 `title` / `siteName` 未转义（`siteIcon` 是内置 SVG，刻意不转义）
- **修复**：`Selection._updateCardMark` / `_updateAllCards` 运行时更新仍写死靛蓝 →
  初始渲染跟随配色、一按选又变回去；已统一走 `Selection._primary()`
- **健壮性**：`UI._ios27Rgba` 补 `rgb()/hsl()` 解析（原来非 hex 配色会让液态玻璃染色/折射整体失效）；
  主题/语言改为**同步落盘**；批量完成合并为一条 toast
- **内存**：`UI.VirtualList` 返回 `destroy()` 句柄，并**让调用方真的调用**
  （`renderMedia` 在覆盖 DOM 前显式销毁，否则 ResizeObserver 每轮重渲染累加）
- **重构**：资源扫描的「拼 all 数组」两处重复逻辑抽成 `Scanner.buildUnifiedList` /
  `Scanner.mergeWithNetHits`；语言切换不再 remove 重建面板（保留拖拽/滚动位置）
- **样式**：迷你栏阴影改走 CSS 变量，不再用 `!important` 硬压内联按色阴影；
  核查误伤面时发现真 Bug —— `._ms_card` 的 `!important` 阴影让**资源定位高亮环完全不可见**，已修
- **动效**：玻璃动效的 resize 监听改为可解绑（原先面板重建会累加监听）
- **功能接通**：`VideoLinkPreview` 的多 P 切换从空壳（只弹 toast）接通为真实实现，
  用目标分 P 的 `cid` 重新取流并加上分 P 选择器
- **注释**：`srcObject instanceof Blob` 保留并注明原因；`_ms_vlink_paused` 补上真实样式（原本无对应 CSS）
- **版本**：全局统一 v1.12（`@name` / `@version` / 启动日志 / `MS_CONFIG.VERSION` / `U.VERSION` / 4 语言显示串）
- **验证**：新增 179 项断言；**反向验证 34/34**（逐条还原缺陷代码确认测试会失败，抓出 5 条无效断言）；
  回归 105 + 49 + 184 + 144 + 27 项全绿；性能 5 函数 × 3086 条 URL 语料 **0 差异**


### v1.11
**液态玻璃控件与面板动效 + 6 项 P0 缺陷修复**

- **UI · 液态玻璃控件**：iOS 27 下两个浮层控件补上真正的玻璃材质
  - 浮动按钮底色透明度 0.86 / 0.94 → **0.30 / 0.40**（深/浅），`blur(30px) saturate(230%) brightness(1.10)` + 径向高光 + 150° 染色渐变 + 镜面描边
  - 轻提示条改为半透明染色 + `blur(26px) saturate(210%)`，阴影按传入颜色推导（红色错误提示也是红的）
  - 无 `backdrop-filter` 时自动退回较实底色；`normal` / `material` 风格不受影响
- **UI · 提示条动效**：改为**从顶部滑入 → 停留 2.5 秒 → 向上滑出**后移除节点
  - 起点 `translateY(calc(-100% - 72px))` 保证完全出界、不露边；滑入 0.42s 弹性曲线、出场 0.40s
  - 双 `requestAnimationFrame` + 90ms `setTimeout` 兜底（后台标签页 rAF 不触发，只靠 rAF 会让提示条永不出现）
- **UI · 面板出入场**：桌面/移动端拆成两套参数（420px 右缘抽屉 vs 整屏覆盖，形态完全不同）
  - **桌面**：起点 `translateX(100%) scale(.94)` + `transform-origin:100% 50%`（沿右缘展开）；位移 0.46s 强 ease-out（50% 时间走完 96%）
  - **内层错峰**：标题栏 → 标签 → 搜索 → 内容 → 底栏依次轻推入场（间隔 45ms / 单块 380ms），滚动区位移更小
  - **关闭**：0.34s 收走，透明度与位移同步（原先提前淡完 → 面板先「隐身」再滑走，看不到收起过程）
  - 修复：重复调用 `openPanel` 会「闪一下又滑一遍」；入场途中关闭面板会被 rAF 弹回来
- **性能 · 移动端面板动效**：整屏面板的 44px `backdrop-filter` 在滑动中每帧要重新模糊整个屏幕（412×915 × DPR3 ≈ **3.4M 像素/帧**），
  是移动端掉帧主因 —— 滑动期间临时停用模糊并用主题底色顶替（420ms 后自动恢复玻璃），同时暂停色团动画；桌面端不动
  - 移动端改为**纯位移擦入**：不做缩放扩散（整屏缩放会露出背后页面）、不做整屏淡入（会糊成一片）
  - 曲线按整屏距离重算：入场 `.34s cubic-bezier(.34,.72,.34,1)`，起步柔和、中段走完、尾段轻落
  - 内层错峰加 170ms 起始延迟（避免看到「一整块空玻璃」）、跳过最重的滚动内容区
  - 不再用 `max-height:100vh`（移动浏览器地址栏会改变动态视口，导致滑动中被重新定尺寸）
- **修复 · P0**：`UI._paletteColors` 引用未声明的 `custom` → 使用自定义调色板必抛 `ReferenceError`
- **修复 · P0**：`UI.applyUiStyle` 引用未声明的 `c` → 异常被吞掉，`_ms_sliding` 规则从未生成，移动端滑动优化失效
- **修复 · P0**：缩略图失败兜底用 `elem.parentNode.appendChild`（`elem` 已被摘除）→ 必抛 `TypeError`，占位图标永远显示不出来
- **修复 · P0**：分片重试耗尽后 `done` 仍为 `false` → `_nextPendingSeq` 反复挑同一片，**无限重试**；
  已补 `failed` 标记 + 跳过 + 终态收尾（附失败分片范围，不合并残缺文件），并修掉重复合并与续传 `running` 残留
- **修复 · P0**：翻译降级只排除「当前」引擎 → 两引擎都失败时 A、B **无限互相降级**；改为已尝试集合 `tried`
- **修复 · P0**：`_computeTheme` 每次调用都注册 `matchMedia` 监听 → 监听器无限堆积的内存泄漏
- **验证**：P0 49 · 面板动画 184 · iOS 27 玻璃 143 · 版本一致性 27 项断言；性能回归 5 函数 × 3086 条 URL 语料 **0 差异**；
  6 项 P0 均做反向验证（还原修复后测试确实失败），确保测的是行为而非文本


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

### 许可证
GPL-3.0-or-later