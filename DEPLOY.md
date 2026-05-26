# 部署到网上（获得可分享的链接）

游戏是纯静态页面，部署后可通过 **https://xxx.netlify.app** 这类链接直接玩，无需本地打开文件。

---

## 方式一：Netlify 拖拽部署（最简单，约 2 分钟）

不需要 Git，适合快速上线。

1. 打开 [https://app.netlify.com/drop](https://app.netlify.com/drop)（可用邮箱免费注册）
2. 把整个 **`cursordemo`** 文件夹拖到页面上
3. 等待部署完成，会得到一个网址，例如：`https://random-name-123.netlify.app`
4. 访问链接：
   - 首页：`https://你的域名.netlify.app/`
   - 雪梨 2048：`https://你的域名.netlify.app/xueli-2048/`
   - 萌萌 2048：`https://你的域名.netlify.app/game-2048/`

可在 Netlify 后台 **Domain settings** 里改成更好记的子域名。

---

## 方式二：GitHub Pages（免费，适合长期维护）

1. 在 GitHub 新建仓库，把 `cursordemo` 里的文件全部上传
2. 仓库 **Settings → Pages**
3. **Source** 选 `Deploy from a branch`
4. **Branch** 选 `main`，文件夹选 **`/ (root)`**
5. 保存后等待 1～2 分钟，访问：`https://你的用户名.github.io/仓库名/xueli-2048/`

---

## 方式三：Vercel

1. 打开 [https://vercel.com](https://vercel.com) 并登录
2. **Add New → Project**，导入 GitHub 仓库，或上传文件夹
3. **Root Directory** 保持为项目根目录，直接 Deploy
4. 完成后使用 Vercel 提供的 `https://xxx.vercel.app` 链接

---

## 部署后请用这些地址访问

| 版本 | 路径 |
|------|------|
| 首页（选版本） | `/` |
| 雪梨 2048（推荐） | `/xueli-2048/` |
| 萌萌 2048 | `/game-2048/` |

**注意：** 请使用 **https 开头的在线链接**，不要再用 `file:///C:/...` 本地文件方式打开。

---

## 常见问题

**Q：为什么本地双击 HTML 不行，上线就可以？**  
A：部分浏览器对本地文件的脚本有限制；部署到网站后是正常 https 访问，脚本可正常加载。

**Q：需要服务器吗？**  
A：不需要。Netlify / GitHub Pages / Vercel 都提供免费静态托管。
