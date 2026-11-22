# Kyle "KDL" Lucius 的个人主页

中文 Astro 个人主页与博客，发布于 [kyle-lucius.github.io](https://kyle-lucius.github.io/)。

## 本地开发

使用 Node.js 22.12 或更高版本。在仓库根目录运行以下命令，然后打开终端显示的预览地址。

```sh
npm ci
npm run dev
```

首页内容位于 `src/pages/index.astro`，排版和响应式样式位于 `src/styles/site.css`。

## 写开发笔记

在 `src/content/blog/` 新建 Markdown 文件。用小写英文字母、数字和连字符命名，例如 `first-mod.md` 对应 `/blog/first-mod/`。在文件开头填写：

```markdown
---
title: 我的第一篇模组笔记
description: 一句简短的摘要。
date: '2026-11-22'
draft: true
---

从这里开始写正文。
```

`npm run dev` 会显示草稿，并在列表和文章页标注「草稿」。定稿后填写发布日期并将 `draft` 改为 `false`。运行 `npm run build` 和 `npm run preview` 检查正式版，生产构建会排除仍标记为草稿的内容。未公开的草稿请留在本地，推送到公开仓库的 Markdown 源文件可以被其他人查看。

## 构建与发布

```sh
npm run build
npm run preview
```

Astro 将静态页面输出到 `dist/`。在仓库的 Settings → Pages 中选择 GitHub Actions 作为发布源。推送到 `main` 后，工作流会安装依赖、构建并部署到站点根路径。也可以在 Actions 的 **Deploy to GitHub Pages** 中手动运行。
