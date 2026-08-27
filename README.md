# 北海道極境縱走旅行手冊

以沉浸式翻頁體驗呈現 2026 年 8 月 27 日至 9 月 5 日的北海道 10 天 9 夜自駕行程。路線由富良野、美瑛與旭川一路向北至稚內，再沿奧羅龍海岸線南下小樽與札幌。

## 特色

- 封面、路線總覽與 Day 1 至 Day 10，共 12 個翻頁章節
- 桌面鍵盤、按鈕、章節導覽與手機滑動操作
- 依行事曆確認的五段住宿資訊
- 11 張 Wikimedia Commons 實景照片與完整授權來源
- 響應式版面、深淺色支援與減少動態模式

## 本機開發

需要 Node.js 22.13.0 或更新版本。

```bash
npm ci
npm run dev
```

## 驗證

```bash
npm run lint
npx tsc --noEmit
npm test
```

## GitHub Pages

推送至 `main` 後，GitHub Actions 會自動建立靜態輸出並部署至 GitHub Pages。也可從 Actions 頁面手動執行 `Deploy to GitHub Pages`。

```bash
npm run build:pages
```

照片作者、原始檔案與 Creative Commons 授權連結可由網站右上角的「照片授權」開啟查看。
