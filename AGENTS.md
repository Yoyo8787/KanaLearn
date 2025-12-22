# KanaLearn Agents 指南

## 專案概覽

- 使用 **React + TypeScript + Vite**，並搭配 **Tailwind CSS（v4）**。
- UI 狀態與統計資料透過 `src/utils/storage.ts` 存放於 `localStorage`。
- 語音相關功能使用 **Web Speech API**，需處理瀏覽器不支援的情況。

## 快速開始

- 安裝相依套件：`npm install`
- 啟動開發伺服器：`npm run dev`
- 執行 Lint：`npm run lint`
- 建置專案：`npm run build`

## 開發規範

- 使用 `.prettierrc` 中的共用格式設定（單引號、無分號、結尾逗號、每行最多 100 字元）。
- 元件需完整型別化；若狀態需共用，優先提升至 `App.tsx` 管理。
- 採用 Tailwind 的 utility-first 寫法；新增 UI 時請一併加入 `dark:` 變體。
- UI 偏好設定請使用 `saveUIPreferences` 儲存，並以 `loadUIPreferences` 讀取。

## 主題（Theming）

- 深色模式由 `App.tsx` 控制，並儲存在 `UIPreferences.darkMode`。
- 透過切換 `document.documentElement` 上的 `dark` class，並設定 `color-scheme` 來套用主題。
- 新增介面區塊時，請同時提供亮色與深色模式下的背景、邊框與文字顏色。

## QA 注意事項

- 核心字串請維持使用**繁體中文**，除非有明確的 UX 理由需要調整。

## 回答給我用中文
