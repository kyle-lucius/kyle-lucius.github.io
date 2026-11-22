# Kyle Lucius 的个人主页

Kyle Lucius（代号 KDL）的中文单页 Astro 作品集，发布于 [kyle-lucius.github.io](https://kyle-lucius.github.io/)。

## 本地开发

使用 Node.js 22.12 或更高版本。在仓库根目录运行以下命令，然后打开终端显示的预览地址。

```sh
npm ci
npm run dev
```

首页内容位于 `src/pages/index.astro`，排版和响应式样式位于 `src/styles/site.css`。

## 构建与发布

```sh
npm run build
npm run preview
```

Astro 将静态页面输出到 `dist/`。在仓库的 Settings → Pages 中选择 GitHub Actions 作为发布源。推送到 `main` 后，工作流会安装依赖、构建并部署到站点根路径。也可以在 Actions 的 **Deploy to GitHub Pages** 中手动运行。
