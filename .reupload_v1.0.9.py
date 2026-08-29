#!/usr/bin/env python3
# Re-upload v1.0.9 after release asset update
import json, os, urllib.request, urllib.error

TOKEN = os.environ["GH_TOKEN"]
REPO = "zhjich123/zhjich123"
AUTH = {"Authorization": f"token {TOKEN}", "Accept": "application/vnd.github.v3+json", "User-Agent": "trae-release-bot"}

# 1) Delete existing release
try:
    req = urllib.request.Request(f"https://api.github.com/repos/{REPO}/releases/tags/v1.0.9",
                                 headers=AUTH)
    with urllib.request.urlopen(req) as r:
        existing = json.loads(r.read().decode())
    rid = existing.get("id")
    # Delete its assets first
    for a in existing.get("assets", []):
        try:
            da = urllib.request.Request(f"https://api.github.com/repos/{REPO}/releases/assets/{a['id']}",
                                         headers=AUTH, method="DELETE")
            with urllib.request.urlopen(da): pass
            print(f"Deleted asset id={a['id']} name={a['name']}")
        except urllib.error.HTTPError as e:
            print(f"Del asset err {e.code}: {e.read().decode()[:300]}")
    delreq = urllib.request.Request(f"https://api.github.com/repos/{REPO}/releases/{rid}",
                                    headers=AUTH, method="DELETE")
    with urllib.request.urlopen(delreq): pass
    print(f"Deleted release id={rid}")
except urllib.error.HTTPError as e:
    if e.code != 404:
        print(f"Check release err {e.code}: {e.read().decode()[:400]}")
    else:
        print("No existing release")

# 2) Create new release
BODY = """## v1.0.9 (2026-08-30)

### 🚨 紧急修复（用户反馈 3 项 Bug）
1. **FAB 悬浮圆按钮不再和面板耦合移动**  
   - FAB 拖拽变量从通用名 `dragging/moved/origX` 改为闭包私有 `btnDragging/btnOn*`  
   - btn 事件监听改为 capture phase + 全部 `stopPropagation()`，防止和任何 header/panel 事件串扰
2. **删除面板窗口移动功能**（用户明确要求：窗口不能移动）  
   - 移除整个 header `cursor:move` + `mousedown/mousemove/mouseup` 拖拽逻辑  
   - 移除 snapLeft/snapRight/snapTop 吸附判断
3. **面板永远出现在【右边中间】**（再也不会到左上角 / 最左边）  
   - 强制 `forceRight = true`：桌面端永远 `right:16px;top:(innerHeight - panelEstH)/2`  
   - 忽略历史 `snapEdge=left/top` 和 `panelX<15`（贴左）配置  
   - 只有历史 Y 值（savedY）合理时沿用

### 🎨 Apple 主题 · iOS 27 液态玻璃
5 层物理模型：refraction blur40px + tint 染色 + --mx/--my 鼠标流动高光 + 边缘定义 + 双层阴影

### 🖱 拖动把手 Grip（高对比永现版）
- dragBar / hDragBar 6→16px，cornerDrag 12→28px
- 填充色 100% 不透明（纯黑/纯白）+ 反色 0.8px 轮廓 + drop-shadow
- corner ↘ 斜线：**双层 SVG 叠加描边**（反色粗底+主色线）替代对 line 无效的 `-webkit-text-stroke`
- hDragBar 视觉对齐改为 align-items:center

### 📐 Tab
- Tab 栏 overflow-x:auto 可横滚，tab `flex:0 0 auto` 不再截断
"""

import time as _t
payload = json.dumps({
    "tag_name": "v1.0.9",
    "target_commitish": "main",
    "name": "v1.0.9 · 紧急修复：FAB独立+面板固定右中+禁止拖动",
    "body": BODY,
    "draft": False, "prerelease": False
}).encode()
req = urllib.request.Request(f"https://api.github.com/repos/{REPO}/releases",
                             data=payload, method="POST",
                             headers={**AUTH, "Content-Type": "application/json"})
with urllib.request.urlopen(req) as r:
    j = json.loads(r.read().decode())
rid = j["id"]
upload_url = j["upload_url"].split("{")[0]
html_url = j["html_url"]
print(f"\nNEW RELEASE id={rid}")
print(f"URL: {html_url}")

# 3) Upload JS
JS_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "media-sniffer-1.0.9.user.js")
with open(JS_PATH, "rb") as f:
    data = f.read()
fname = "media-sniffer-1.0.9.user.js"
url = f"{upload_url}?name={urllib.request.quote(fname)}&label={urllib.request.quote(fname)}"
h = {**AUTH, "Content-Type": "text/javascript; charset=utf-8"}
req2 = urllib.request.Request(url, data=data, method="POST", headers=h)
with urllib.request.urlopen(req2) as r:
    a = json.loads(r.read().decode())
print(f"\nASSET OK  download: {a['browser_download_url']}")
print("\nDONE.")
