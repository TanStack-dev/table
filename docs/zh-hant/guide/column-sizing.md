---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:42:14.279Z'
title: 欄位調整大小
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [column-sizing](../framework/react/examples/column-sizing)
- [column-resizing-performant](../framework/react/examples/column-resizing-performant)

## API

[欄位尺寸調整 API](../api/features/column-sizing)

## 欄位尺寸調整指南

欄位尺寸調整功能允許您選擇性地指定每個欄位的寬度，包括最小和最大寬度。同時也讓您和使用者能動態調整所有欄位的寬度，例如透過拖曳欄位標頭來實現。

### 欄位寬度

預設情況下，欄位會套用以下測量選項：

```tsx
export const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER,
}
```

這些預設值可以透過 `tableOptions.defaultColumn` 和個別欄位定義來覆寫，優先順序如前述順序。

```tsx
const columns = [
  {
    accessorKey: 'col1',
    size: 270, //為此欄位設定尺寸
  },
  //...
]

const table = useReactTable({
  //覆寫預設欄位尺寸
  defaultColumn: {
    size: 200, //起始欄位尺寸
    minSize: 50, //在欄位調整時強制執行
    maxSize: 500, //在欄位調整時強制執行
  },
})
```

欄位的「尺寸」在表格狀態中以數字形式儲存，通常會被解讀為像素單位值，但您可以根據需求將這些欄位尺寸值掛接到您的 CSS 樣式中。

作為一個無頭工具 (headless utility)，表格的欄位尺寸邏輯實際上只是一組狀態集合，您可以根據需求應用到自己的佈局中（我們的範例實作了兩種此邏輯的樣式）。您可以透過多種方式應用這些寬度測量：

- 語意化的 `table` 元素或任何以表格 CSS 模式顯示的元素
- `div/span` 元素或任何以非表格 CSS 模式顯示的元素
  - 具有固定寬度的區塊層級元素
  - 具有固定寬度的絕對定位元素
  - 具有彈性寬度的 Flexbox 定位元素
  - 具有彈性寬度的 Grid 定位元素
- 實際上任何能將單元格寬度內插到表格結構中的佈局機制

每種方法都有其權衡和限制，這些通常是 UI/元件函式庫或設計系統的觀點，幸運的是您不需要擔心這些 😉。

### 欄位調整大小

TanStack Table 提供內建的欄位調整大小狀態和 API，讓您可以輕鬆在表格 UI 中實作欄位調整大小功能，並提供多種 UX 和效能選項。

#### 啟用欄位調整大小

預設情況下，`column.getCanResize()` API 會對所有欄位回傳 `true`，但您可以透過 `enableColumnResizing` 表格選項禁用所有欄位的調整大小功能，或透過 `enableResizing` 欄位選項逐欄禁用。

```tsx
const columns = [
  {
    accessorKey: 'id',
    enableResizing: false, //僅對此欄位禁用調整大小
    size: 200, //起始欄位尺寸
  },
  //...
]
```

#### 欄位調整模式

預設情況下，欄位調整模式設為 `"onEnd"`。這表示 `column.getSize()` API 不會回傳新的欄位尺寸，直到使用者完成調整（拖曳）欄位。通常在調整欄位時會顯示一個小的 UI 指示器。

在 React TanStack Table 轉接器中，由於實現 60 fps 的欄位調整渲染可能較困難（取決於表格或網頁的複雜度），`"onEnd"` 欄位調整模式可以作為一個良好的預設選項，以避免使用者在調整欄位時出現卡頓或延遲。這並不是說您無法在使用 TanStack React Table 時實現 60 fps 的欄位調整渲染，但您可能需要進行額外的記憶化 (memoization) 或其他效能優化才能實現。

> 進階的欄位調整效能技巧將在[下方](#advanced-column-resizing-performance)討論。

如果您想將欄位調整模式改為 `"onChange"` 以實現即時的欄位調整渲染，可以透過 `columnResizeMode` 表格選項來設定。

```tsx
const table = useReactTable({
  //...
  columnResizeMode: 'onChange', //將欄位調整模式改為 "onChange"
})
```

#### 欄位調整方向

預設情況下，TanStack Table 假設表格標記語言 (markup) 是從左到右排列的。對於從右到左的佈局，您可能需要將欄位調整方向改為 `"rtl"`。

```tsx
const table = useReactTable({
  //...
  columnResizeDirection: 'rtl', //針對特定地區設定將欄位調整方向改為 "rtl"
})
```

#### 將欄位調整 API 連接到 UI

有幾個非常方便的 API 可以讓您將欄位調整的拖曳互動連接到 UI。

##### 欄位尺寸 API

要將欄位的尺寸應用到欄位標頭單元格、資料單元格或頁尾單元格，您可以使用以下 API：

```ts
header.getSize()
column.getSize()
cell.column.getSize()
```

如何將這些尺寸樣式應用到您的標記語言 (markup) 取決於您，但通常會使用 CSS 變數或內聯樣式來應用欄位尺寸。

```tsx
<th
  key={header.id}
  colSpan={header.colSpan}
  style={{ width: `${header.getSize()}px` }}
>
```

不過，如[進階欄位調整效能章節](#advanced-column-resizing-performance)所述，您可能需要考慮使用 CSS 變數來將欄位尺寸應用到您的標記語言。

##### 欄位調整 API

TanStack Table 提供預建的事件處理器，讓您的拖曳互動更容易實作。這些事件處理器只是便利函數，會呼叫其他內部 API 來更新欄位尺寸狀態並重新渲染表格。使用 `header.getResizeHandler()` 來連接您的欄位調整拖曳互動，適用於滑鼠和觸控事件。

```tsx
<ColumnResizeHandle
  onMouseDown={header.getResizeHandler()} //桌面版
  onTouchStart={header.getResizeHandler()} //行動版
/>
```

##### 使用 ColumnSizingInfoState 的欄位調整指示器

TanStack Table 會追蹤一個名為 `columnSizingInfo` 的狀態物件，您可以用它來渲染欄位調整指示器 UI。

```jsx
<ColumnResizeIndicator
  style={{
    transform: header.column.getIsResizing()
      ? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
      : '',
  }}
/>
```

#### 進階欄位調整效能

如果您正在建立大型或複雜的表格（並且使用 React 😉），您可能會發現如果沒有在渲染邏輯中加入適當的記憶化 (memoization)，使用者在調整欄位時可能會遇到效能下降的問題。

我們建立了一個[高效能欄位調整範例](../framework/react/examples/column-resizing-performant)，展示了如何在可能渲染緩慢的複雜表格中實現 60 fps 的欄位調整渲染。建議您直接查看該範例以了解如何實現，但以下是基本要點：

1. 不要在每個標頭和每個資料單元格上使用 `column.getSize()`。相反，**記憶化**所有欄位寬度的計算結果！
2. 在調整過程中記憶化您的表格主體 (Table Body)。
3. 使用 CSS 變數將欄位寬度傳遞給表格單元格。

如果遵循這些步驟，您應該能在調整欄位時看到顯著的效能提升。

如果您沒有使用 React，而是使用 Svelte、Vue 或 Solid 轉接器，可能不需要太擔心這些問題，但類似的原則仍然適用。
