# 更新日志

## v1.14

**修复「每次升级都会多装一个脚本」+ 接入原生自动更新 + 第三批 13 项稳定性/性能修复**

---

### 🔴 核心缺陷 · 每装一次新版就多出一个脚本条目

从 v1.10 起，每次升版本号都顺手把 `@name` 一起改了：

| 版本 | `@name` | 安装结果 |
|---|---|---|
| v1.0.8 / 1.0.8.1 / 1.0.8.2 | `…Media Sniffer Pro v1.0.8`（三次**完全一样**） | ✅ 互相覆盖，同一个条目 |
| v1.10 | `…Media Sniffer Pro v1.10` | ❌ 新条目 |
| v1.11 | `…Media Sniffer Pro v1.11` | ❌ 新条目 |
| v1.12 | `…Media Sniffer Pro v1.12` | ❌ 新条目 |
| v1.13 | `…Media Sniffer Pro v1.13` | ❌ 新条目 |

脚本管理器（Tampermonkey / Violentmonkey / Quetta 等）用 **`@name` + `@namespace`**
组合判定「这是不是同一个脚本」。名字一变就是另一个脚本，于是每次升级都新增条目，
旧的必须手动删。1.0.8.x 那三次之所以能正常覆盖，恰恰是因为名字没动。

- **修复**：`@name` 冻结为 **`媒体嗅探器 Media Sniffer Pro`**（去掉版本号）。
  版本号只由 `@version` 承担，管理器会单独显示；面板与「关于」页照旧显示版本号。
- **修复**：`@namespace` 保持 `http://tampermonkey.net/` **不动** —— 它和 `@name`
  共同决定身份，改了等于又换一个脚本，且今后都不应再动。

### 🟡 次要缺陷 · 更新提示只能把人送去「带版本号」的下载页

脚本此前没有 `@downloadURL` / `@updateURL`，内置更新器只能弹窗让你
「去 GitHub 下载」，链接是 `releases/download/v1.13/media-sniffer-1.13.user.js`
这种**带版本号的文件名** —— 手动装一次就多一个条目，把上面的问题又放大一倍。

- **新增**：元数据补 `@downloadURL` / `@updateURL`，两者都指向**固定文件名**
  `media-sniffer.user.js`。油猴从此能自己检查更新并**原地覆盖**，不必再手动下载。
- **改进**：更新弹窗主按钮由「去 GitHub 下载」改为 **「一键更新」**，目标从
  `info.htmlUrl`（带版本号）换成同一个固定名地址，点一下就是原地覆盖；
  想看完整更新日志时，下方新增次要文字链「查看 Release 页面」。
- **加固**：三处地址共用脚本内常量 `MS_CONFIG.UPDATE_URL`
  （元数据 ↔ 常量 ↔ 弹窗按钮），避免以后改一处漏一处、一处原地覆盖一处装成新脚本。

---

### 🔴 下载器 · 取消任务会永久卡死整个队列

- **修复**：`DownloadManager.cancel()` 在「任务已有 controller」这条分支上
  **完全不归还并发槽**（另一条分支才减 `_running`）。取消几次之后 `_running` 就再也
  回不到 `maxConcurrent`，队列**永久停止调度**，之后所有下载都排着不动。
  现在两条分支统一走 `_finish()`，并新增 `_slotTaken` / `_slotReleased` 精确记账 ——
  「排队中、从未占用槽位」的任务被取消时**不会**误减别人的槽（原实现会，导致并发数超发）。
- **修复**：取消后 backend 仍可能补一次错误回调，原逻辑会顺手记一条「下载失败」历史。
  现在任务已是 `cancelled` 时只把槽还回去，不再改状态、不再写失败历史。

### 🔴 下载器 · 取消 / 暂停时后台线程根本不终止

- **修复**：`new Worker(...)` 创建出来的 worker **从未登记**进 `self.workers`，
  于是 `_cleanup()` 遍历的永远是空数组 —— 取消或暂停时在途的 worker 会一路跑到自然结束
  （白耗流量，还会与「暂停时被中断的下载不会再有回调」的假设矛盾，resume 后同一分片被重复下载）。
  现在创建后立刻登记、结束（成功/失败/取消）时摘除，`_cleanup()` 真正 `terminate()`，
  `pause()` 也会终止在途 worker。
- **修复**：主线程分片下载（无 Worker 环境的回退路径）在取消时直接 `return`，
  **回调永不触发** → `pendingChunks` 不递减 → 任务卡在 `running`。
  现在取消时同样走 `cb('cancelled')`，让计数回到平衡；并新增 per-chunk
  「只回调一次」保护，避免取消钩子与 XHR 回调撞车导致计数多减、变负。

### 🔴 性能 · DOM 变更监听挂着整个页面

- **修复**：浮动按钮守护 observer 原来是
  `observe(document.documentElement, {subtree: true})` —— 页面**任何**角落的 DOM 变更
  都会进回调队列，回调里还要把每次 mutation 的 `removedNodes` 全遍历一遍。
  而它要判定的只有一件事：「按钮还在不在」。现在改为**只观察按钮的父节点、且不递归**，
  重建后重新对准；万一目标失效，原有的轮询本就是第二道保障。
- **修复**：主扫描 observer（发现新媒体元素 → 增量扫描）只在**面板打开期间**才挂载，
  关闭面板即 `disconnect()`。它的产出全部依赖 `State.panelOpen` —— 面板没开时
  遍历一遍就丢掉，纯烧 CPU。这是长会话（尤其 SPA）里脚本最高的一项固定开销。

### 🔴 性能 · 虚拟列表滚动时每帧强制同步布局

- **修复**：`update() → measure()` 里读的 `clientWidth` / `clientHeight` / `offsetTop` /
  `clientTop` 全是**强制同步布局**的读操作，而 `update()` 挂在滚动路径上 ——
  等于每帧重算一次布局，长列表必然掉帧。现在尺寸只在确实可能变化时重量
  （初始一次 / ResizeObserver 触发 / 显式 `update(true)`），滚动路径只读一次
  `scrollTop` 并缓存在**写 DOM 之前**（此刻最不容易触发同步布局）。
  `setItems()` 也同步改为显式 `update(true)`。

### 🔴 性能 · 桌面端滚动时液态玻璃仍在逐帧重采样

- **修复**：`UI._panelGlassFreeze` 里写着 `if (!UI._panelMob() || ...) return;` ——
  **只对移动端生效**。桌面端 420px 面板的 `blur(44px)` 在滚动时同样每帧重新采样整个面板区域。
  现在去掉移动端门槛，两端一致；并新增 `#_ms_box` 滚动监听：
  滚动期间切不透明底，**停下 240ms**（滑动 420ms）后自动恢复。

### 🟡 B 站重试链形同虚设

- **修复**：`primaryApi` 与 `backupApi` 是**同一串地址**（都是 `/x/web-interface/view?`）——
  主接口失败后的所谓「重试」等于原地重试，白等一个 RTT，没有任何退路。
  现在改为真正的重试链：`view`（标准接口）→ `view/detail`（备用接口，返回体是另一套
  `data.View` 结构，按 detail 解析）。顺带把散落在 `onload` / `catch` / `onerror` /
  `ontimeout` 四处的「下一级」逻辑（共 5 份）收敛成一个 `fetchNextApi`，
  以后改链上的地址只需改一处。
  > 不采用 `/x/web-interface/wbi/view` —— 那个接口强制 WBI 签名（需 `w_rid` + `wts`），
  > 未签名请求直接返回 `-403`，做备用接口毫无意义。

### 🟡 收尾回调不幂等 · 一次任务弹两条完成提示

- **修复**：`Dl.batch` 的 `finish()` 没有守卫。`DownloadManager` 对同一任务既可能回调
  `onComplete` 又可能回调 `onError`（分片收尾成功、合并阶段再抛错，或双回调），
  两边的判断都是 `done + failed >= total` → `finish()` 被执行两次：
  **弹两条完成 toast、`doneCb` 被调两次**。已加幂等守卫。
- **修复**：`DownloadManager._finish` 同样无幂等守卫，一次任务双回调会把 `_running`
  多减一次 → 并发槽凭空变多、队列超发。已加 `_finished` 守卫 + 统一的
  `_releaseSlot`（只归还「确实占用过」的那个槽一次）。

### 🟢 其他

- **修复**：m3u8 预览窗的下载按钮，失败时弹的是 `transFail`（「✕ 翻译失败」）——
  下载失败却提示翻译失败，用户对不上号。改用专有的 `m3u8Fail`（四语言词典均已存在）。
- **修复**：`AutoUpdater._semverCompare` 对纯数字 tag（如 `tag_name` 只写成 `"2"`）
  靠 `parseInt(parts[1]) || 0` 侥幸兜住 `NaN`，对 `"2b"` / `"1.x"` 这类段的行为也不稳定。
  改为显式取每段开头的数字、非数字段稳定归 0（`null` / 空串也不再抛错）。
- **修复**：`U.lru` 的普通对象分支把键队列挂在 `store.__keys` 上，**污染了缓存对象自身的键空间** ——
  `for...in` 会多出一个 `__keys`，`JSON.stringify(缓存)` 会把整个键队列一起序列化出去。
  键队列改存闭包变量。

### ✅ 验证

- **新增** `t-identity.js`：**31 项断言** 把「身份必须稳定」固化下来 —— `@name` 不含任何
  `x.y` 形式版本号、`@namespace` 冻结在已知值、`@downloadURL` / `@updateURL` 存在且不含版本号、
  两处地址一致、`MS_CONFIG.UPDATE_URL` 与元数据一致、弹窗主按钮真实调用
  `window.open(MS_CONFIG.UPDATE_URL)`、`info.htmlUrl` 仅作为次要入口保留。
  配 **`_rev-identity.js` 反向验证 20/20**。
- **新增** `t-p0d.js`：**118 项断言**，覆盖下载器并发槽记账、worker 登记与终止、
  取消回调结清、observer 挂载时机与递归性、虚拟列表按需重量、两端玻璃冻结、
  B 站重试链（真跑 GM 桩，验证两次请求地址不同 + detail 结构解析）、
  两处幂等、文案、版本比较、LRU 键空间、单调时钟定义顺序。
  配 **`_rev-p0d.js` 反向验证 25/25**。
- **`t-vgrid.js` 扩到 42 项**：新增一节用**布局属性读取计数器**证明
  「纯滚动期间读取任何布局属性次数 = 0」，并验证 `update(true)` 能强制重量。
- **`t-version.js` 扩到 39 项**：新增 `@downloadURL` / `@updateURL` 存在性与「不含版本号」校验、
  `@name` 不得含版本号、残留旧版本号扫描范围从 `1.10` 扩到 **`1.11 ~ 1.13`**。
- **回归全绿**：`t-vgrid` 42 · `t-p0d` 118 · `t-p0c` 179 · `t-p0b` 105 · `t-p0` 49 ·
  `t-panel` 185 · `t-ios27` 144 · `t-version` 39 · `t-identity` 31 · `t-perf2` 148 ·
  `t-refs`（无未定义引用）。
- **反向验证全绿**：`_rev` 34/34 · `_rev-vgrid` 12/12 · `_rev-perf2` 28/28 ·
  `_rev-identity` 20/20 · `_rev-p0d` 25/25。反向验证过程中抓到并修掉了 5 条**无效断言**
  （注释里提到了缺陷写法本身，导致断言被注释满足），已统一改为「只看可执行代码」。
- `audit.js` 通过（SVG 混注释 0 处）；`make-preview.js` 预览已重生成。

### ⚠️ 行为变化

**桌面端现在也会在滚动 / 滑动期间把液态玻璃换成不透明底**（原设计是「桌面窄面板代价可接受、
不动玻璃」）。这是「桌面端滚动卡顿」一项的直接结果，两端现在一致；
滚动停止 240ms、滑动结束 420ms 后自动恢复。

### ⚠️ 一次性收尾（做完这一步以后永久生效）

由于历史版本已经装成了多个独立条目，**这次仍需手动清理一次**：

1. 在脚本管理器里**卸载全部旧条目**（预计 5 个：
   `…Media Sniffer Pro v1.0.8`、`…v1.10`、`…v1.11`、`…v1.12`、`…v1.13`）
2. 只安装一次新的 **`媒体嗅探器 Media Sniffer Pro`**（v1.14）
3. 之后点「检查更新」即可原地覆盖，不会再冒出新条目

> 说明：即使脚本管理器不支持 `@updateURL` 自动更新，仅「`@name` 冻结」这一项
> 也已经解决重复安装 —— 手动装新版同样是覆盖。其余是让更新更省事。

## v1.13

**修复「图片一多就糊成一团」的虚拟网格渲染 Bug + 补 @license 声明**

### 🔴 严重缺陷 · 图片超过 100 张后卡片全部重叠

资源列表在条目超过 100 时会切到虚拟列表，但那个虚拟列表有两个叠加的实现错误，
表现为**卡片疯狂重叠、整块区域糊成一团、既没有网格结构也没法点选**。

- **修复**：虚拟列表按「整行一项」排版，而 `renderItem` 返回的是**网格卡片**
  （缩略图 `width:100%` + `aspect-ratio:1/1`）。`position:absolute;left:0;right:0`
  让卡片占满整行、被打成整屏宽的方块，行高却只按固定 130px 递增 →
  相邻卡片互相覆盖。已改为**真正的网格虚拟化**：量容器宽度算列数
  （移动端固定 2 列，桌面端按与非虚拟路径**完全相同**的 `minmax(120px,1fr)` 规则自适应），
  每张卡按 `(行, 列)` 绝对定位，行高 = 单元格高 + 间距。
  两条路径的 `gap` / `padding` / 文字区高度共用同一组参数，因此 100 张前后布局不会跳变。
- **修复**：虚拟列表读错了滚动容器。传入的 `container` 上写了 `flex:1;overflow-y:auto`，
  但它的父级 `#_ms_box` **不是 flex 容器**，`flex:1` 失效、高度被内容撑开、自身永远不会滚动 ——
  真正滚动的是 `#_ms_box`。后果是 `container.scrollTop` 恒为 0（滚动时列表完全不更新），
  `container.clientHeight` 等于整块内容高度（「视口」变成全部条目，661 张卡一次性全塞进 DOM）。
  虚拟化不仅没生效，反而在最需要它的场景下最慢。已新增 `scrollParent` 参数显式传入真正的滚动源，
  视口高度读外层、滚动位置换算时减去顶部信息栏偏移（只在布局阶段算一次，不进每帧循环）。
- **修复**：滚动位置恢复与虚拟窗口不同步 —— 重建列表时 `scrollTop` 还是 0，
  导致重渲染（切筛选 / 切标签）后会先闪一下第一屏再跳回去。现在恢复后同步调用 `update()`。
- **修复**：面板被拖动缩放（列数变化）时已有节点的坐标全部失效 → 现在会重算列数并重排。

### 🟡 同一根因导致的两处「从未生效」的代码

两个滚动监听都挂在了不会滚动的 `container` 上，等于从未运行过：

- **修复**：视频缩略图按需加载 —— 原来只在首次渲染后加载一批，滚动时新进入视口的卡片
  **永远拿不到缩略图**。已改挂到 `#_ms_box`。
- **修复**：vLink 卡片的「滚动期间暂停动画」优化 —— 类名加了但从没加过对应时机。
  已改挂到 `#_ms_box`。
- 两处都补上**防累加**：`#_ms_box` 是常驻节点，重渲染前先摘掉上一轮的处理函数
  （原写法每轮渲染都会多挂一个）。

### 🟢 其他

- **新增**：元数据块补上 `@license GPL-3.0-or-later`（仓库此前无任何许可证声明）。
  版本一致性体检同步加了许可证校验，防止被误删或写错协议。

### ✅ 验证

- 新增 `t-vgrid.js`：**38 项断言**，用最小 DOM 桩**真跑**虚拟列表。核心是
  **卡片两两重叠检测**（661 张 → 0 组重叠）、不越界、列数 / 单元格尺寸 / 占位高度对账、
  只渲染视口内的行（**661 条实际只 18 个 DOM 节点**）、滚动到底能渲染到第 661 张、
  `destroy` 真解绑、`setItems` 不残留旧数据。
  另含一条前置校验：复刻旧逻辑（行高 130 + 方块高 336）证明它**必然重叠**，
  确保断言测的是真问题而不是空转。
- **反向验证 11/11**：把实现逐条还原成缺陷写法（退回整行一项、行高 130、
  `idx × 行高` 递进、删占位高度、滚动源退回 `container`、监听挂回 `container`、
  `destroy` 不解绑、重绑不摘旧函数…），测试全部如实报错。
- 许可证校验反向验证 3 项：删掉 `@license`、改成 `MIT`、尾部混入全角空格，均被拦下。
- 回归：`t-p0c` 179 · `t-p0b` 105 · `t-p0` 49 · `t-panel` 184 · `t-ios27` 144 · `t-version` 30 项全部通过；
  `t-refs` 无未定义引用；性能回归 5 函数 × 3086 条 URL 语料 **0 差异**。
- 依赖排查：全文件确认 `UI.VirtualList` 仅有一处调用方，改动面收敛，无其它虚拟列表路径受影响。

## v1.12

**第三批 17 项缺陷修复 + 6 项代码审查问题 + 版本号统一**

### 🔴 P0 · 严重缺陷

- **修复 · P0**：`HttpBackend._runChunked` 进入时硬清零 `finishedChunks` / `failedChunks`，
  而 `resume()` 会带着同一批 `chunks` 重新进入 —— 已完成的分片不会再有回调，计数归零后
  `settle()` 的条件永远凑不齐，**既不合并也不报错，任务永久卡在 running**。
  改用按分片真实状态重建计数、清掉 pause 遗留的 `running`、复位 `_chunksSettled`。

### 🟡 P2 · 功能性缺陷

- **修复**：`AutoUpdater._getCache` 直接 `JSON.parse(raw)`，假设存储里一定是字符串。
  手工改过 GM 存储、或旧版本存的是原生对象时会抛错 → 缓存永久失效 → **每次启动都重查 GitHub**。
  改为先判类型，并对非对象结果返回 `null`。
- **修复（XSS）**：`UI.previewM3u8` 两处直接拼 `url` 进 `innerHTML`，URL 含 `</` 会**破坏整个弹窗结构**。
  已加转义；并顺带把同属一类的远端注入面一起堵上 —— `streams[i].label` / `.resolution` / `keyMethod`
  都来自**攻击者可控**的 m3u8 文本。
- **修复（XSS）**：`UI.renderMedia` 的 vLink 卡片封面 `'<img src="' + vItem.cover + '"'` 未转义，
  `cover` 取自页面 `og:image`。已走 `escapeAttr`。
- **修复**：`MS_FACTORY.mediaCardHtml` 的选中描边硬编码 `MS_CONFIG.COLORS.primary`，
  切「玫瑰红」等配色后**卡片选中描边仍是靛蓝**。改为跟随当前配色，
  并补完同类残留 —— 选中光晕同样写死了 `rgba(99,102,241)`。
- **修复**：`DownloadManager._startTask` 中 `factory(...)` / `controller.start()` 裸调用，
  同步抛错时 `_running` 不回退 → **队列并发槽永久少一个**，多失败几次队列彻底不动。
  已用 try/catch 包住并统一走 `abortStart()`（发 onError + `_finish` 释放槽位）。

### 🟢 长期项 · 健壮性与可维护性

- 批量下载完成时连续弹两条 toast，后者**顶掉前者**的显示时机 → 合并为一条（有失败时才补成功数）。
- `UI._ios27Rgba` 只认 hex：自定义配色写 `rgb()` / `hsl()` 时原样返回，**液态玻璃的染色与折射整体失效**。
  补上 `rgb()/rgba()/hsl()/hsla()` 解析分支与具名色探测。
- `State.save` 有 250ms 防抖窗口，App 被系统强杀时可能来不及落盘 → 主题 / 语言这类
  「刚点完就期待记住」的关键项改为**同步写**，其余仍走防抖。
- `UI.VirtualList` 返回值被丢弃，同一容器反复 new 会**重复挂 ResizeObserver** →
  返回带 `destroy()` 的实例句柄；**并且让调用方真的调用**：
  `renderMedia` 在 `box.innerHTML` 覆盖前显式销毁旧列表（光有 destroy 没人调，泄漏依旧存在）。
- 资源扫描「拼 all 数组」的逻辑在 `Scanner.doFull` 与 `ScannerService._legacyScan` 里各写一遍，
  后续改一处漏一处就会让两条路径行为不一致 → 抽出 `Scanner.buildUnifiedList` 与
  `Scanner.mergeWithNetHits` 统一。
- 域名规则「只要存在任意一条 allow 规则就整体切换成白名单模式」**语义反直觉** ——
  用户想「额外放行某个站点」而加一条 allow，结果其它所有站点全被拦下。改为
  「allow 覆盖 block，都没命中即放行」。
- 切换语言时 `State.panel.remove()` 全量重建面板 → 拖拽状态、滚动位置、面板位置全丢且会闪一下。
  改为只就地刷新文案（标题栏 / 标签 / 底栏 / 设置页）。
- `#_ms_minimized_bar` 用 `box-shadow: ... !important` 硬压内联的按色阴影，内联值永远不生效。
  改为把配色阴影写进 CSS 变量 `--_ms_bar_shadow`，内联引用变量，两边不再打架。
  **核查误伤面时发现真 Bug**：`._ms_card` 的 `!important` 阴影会让「资源定位高亮环」完全不可见 ——
  改用内联 `important`（内联 important 优先级高于作者 important），并在动画结束后
  `removeProperty`，避免把卡片常态阴影钉死。
- `window.addEventListener('resize', U.throttle(...))` 绑定后不解绑，面板重建会**累加监听器** →
  处理器提到模块级 + `UI._unbindGlassMotion()`，重绑前先解绑。
- `VideoLinkPreview.switchPage` 已定义但 UI 无入口，多 P 切换是半成品 → **接通**：
  `VideoResolver.switchPage` 用目标分 P 的 `cid` 重新取流，UI 增加分 P 选择器
  （原先只弹了个 toast 的空壳）。
- `el.srcObject instanceof Blob` 对 `<video>` 几乎只可能是 MediaStream，分支形同死代码 →
  保留（成本仅一次 instanceof）并加注说明，避免后人误判删掉。
- 新增的 `_ms_vlink_paused` 类无对应 CSS，加/删都没差异 → 补上真实样式
  （`animation-play-state: paused`），让这个类真正具备语义。

### 🔧 代码审查问题修复

- **修复**：JS 块注释被写在**单引号字符串内部**（`'... " + '"   /* N2: ... */ loading=...'`）。
  因为前后都有 `+` 拼接符所以不是语法错误，但整段注释文字会**原样输出进 HTML**：
  浏览器把注释起始符当成属性名、`N2:` 当成另一个属性，挂上一堆垃圾属性，
  注释内容还会泄漏到页面源码里。注释已搬回 JS 层面。
- **修复**：切语言时 `tabBtns[i].innerHTML = label` 直接整块替换 → **丢失 tab 图标**。
  语言表里 `tabImg` 在 zh-CN 是纯文字（无 SVG）、en-US 才自带图标，于是
  从 en 切回 zh 图标消失、从 zh 切到 en 图标出现，且原有的两层 `<span>` 包装被打掉，
  **切一次语言整个 tab 栏视觉就崩**。已把图标表提到 `UI._tabIconMap`，
  新增 `UI._tabInnerHtml()` 统一生成「图标 + 文字」结构，创建与刷新共用同一函数。
  顺带修掉一个**原本就存在**的问题：en / ja / ko 的语言值自带 SVG，叠上图标表后会**双图标**，
  且经转义后会变成可见乱码 —— 新增 `UI._tabLabel()` 剥离语言值内嵌的 SVG。
- **修复**：注释推荐的「严格白名单用 `block:'*'`」**根本不生效** ——
  `type:'regex'` 时 `new RegExp('*')` 抛 `SyntaxError` 被 catch 吞掉（规则完全失效），
  `type:'host'` 又要求主机名真叫 `*`。已在 `_ruleMatch` 里对 `pattern === '*'` 做
  always-match 特判，让文档写法和实际行为对上。
- **修复**：vLink 卡片的 `title`（取自页面 `<a>` 的 textContent / title）与 `siteName` 仍未转义，
  已一并 escape；`siteIcon` 是内置 SVG 常量，**刻意保持原样**（转义会把标签打坏）。
- **修复**：`Selection._updateCardMark` / `_updateAllCards` 里的选中主色/光晕硬编码 ——
  初始渲染跟随配色了，但运行时点选 / Shift 多选仍会变回靛蓝。已统一走 `Selection._primary()`，
  并带 `UI.colors()` 异常时的兜底。

### 📦 其他

- 全局版本号统一为 **v1.12**：`@name`、`@version`、启动日志、`MS_CONFIG.VERSION`、`U.VERSION`
  与 4 种语言的 `infoLine1` 显示串。版本一致性体检 27 项断言通过。

### ✅ 验证

- 新增 `t-p0c.js`：**179 项断言全绿**，每条都抽真实实现跑在桩环境里，断言行为而非文本。
- **反向验证 34/34**：把每处修复逐条还原成缺陷代码，测试全部如实报错 ——
  证明断言不是空转（这一步抓出了 5 条原本无效的断言）。
- 回归：`t-p0b` 105 · `t-p0` 49 · `t-panel` 184 · `t-ios27` 144 · `t-version` 27 项全部通过；
  `t-refs` 无未定义引用；性能回归 5 函数 × 3086 条 URL 语料 **0 差异**。
- 测试基建同步加固：`stripComments` 由正则改为**词法扫描**（油猴元数据里的
  `@match` 通配符会被正则误判成块注释开头，曾把 25KB 真实代码整段删掉导致断言假绿），
  并加了剥注释后的代码哨兵自检。

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