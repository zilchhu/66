<script>
  import { onMount, onDestroy } from "svelte"
  import Color from "../color/color.js"
  // props
  let rows = []

  let sheetDefaultRowHeight = 24 * 2,
    sheetDefaultColWidth = 100 * 2,
    sheetRows = [],
    sheetColsNum = 0,
    sheetCols = [],
    sheetWidth = 0,
    sheetHeight = 0,
    sheetScrollVRange = 0,
    sheetTop = 0,
    sheetStartRowIdx = 0,
    sheetStartRowOffsetDis = 0,
    sheetEndRowIdx = 0,
    sheetStartColIdx = 0,
    sheetStartColOffsetDis = 0,
    sheetEndColIdx = 50

  let containerElem = null,
    containerUnOb = null,
    containerWidth = 0,
    containerHeight = 0

  let canvasElem = null,
    canvasWidth = 0,
    canvasHeight = 0

  let scrollHeight = 50,
    scrollWidth = 50,
    scrollVRange = 0,
    scrollHRange = 0,
    scrollTop = 0,
    scrollLeft = 0,
    scrollVing = false,
    scrollHing = false

  let ctx = null

  /*
    rows[prop] -> sheet.rows -> sheet.height

    scroll.top[wheel] -> sheet.top -> (sheet.startRowIndex, sheet.startRowOffsetHeight)
    container.height[resize] -> canvas.height, sheet.startRowIndex, sheet.startRowOffsetHeight -> sheet.endRowIndex
  */

  function sum(ns) {
    return ns.reduce((p, n) => p + n, 0)
  }

  // sheet part
  $: sheetRows = rows.map(row => ({ ...row, height: row.height ?? sheetDefaultRowHeight }))
  $: sheetHeight = sum(sheetRows.map(row => row.height))
  $: sheetFixedRows = sheetRows.filter(row => row.fixed)
  $: sheetFixedHeight = sum(sheetFixedRows.map(row => row.height))

  $: sheetColsNum = Math.max(...sheetRows.map(row => row.cells?.length ?? 0))
  $: sheetCols = Array.from(Array(sheetColsNum).keys()).map(_ => ({ width: sheetDefaultColWidth }))
  $: sheetWidth = sum(sheetCols.map(col => col.width))
  $: sheetFixedCols = sheetCols.filter(col => col.fixed)
  $: sheetFixedWidth = sum(sheetFixedCols.map(col => col.width))

  // canvas part
  $: canvasHeight = containerHeight * 2
  $: canvasWidth = containerWidth * 2
  $: canvasElem && [canvasWidth] && setCanvasWidth()
  $: canvasElem && [canvasHeight] && setCanvasHeight()

  // scroll part
  $: scrollVRange = containerHeight - scrollHeight
  $: scrollHRange = containerWidth - scrollWidth
  $: scrollHeight = (canvasHeight / sheetHeight) * containerHeight
  $: scrollWidth = (canvasWidth / sheetWidth) * containerWidth
  $: scrolling = scrollVing || scrollHing

  // sheet part2
  $: sheetScrollVRange = sheetHeight - containerHeight
  $: sheetScrollHRange = sheetWidth - containerWidth
  $: sheetTop = Math.max(0, Math.min(sheetScrollVRange, (scrollTop / scrollVRange) * sheetScrollVRange))
  $: sheetLeft = Math.max(0, Math.min(sheetScrollHRange, (scrollLeft / scrollHRange) * sheetScrollHRange))
  $: [sheetRows, sheetTop] && setSheetStartRow()
  $: [sheetRows, sheetStartRowIdx, sheetStartRowOffsetDis, canvasHeight] && setSheetEndRow()
  $: [sheetCols, sheetLeft] && setSheetStartCol()
  $: [sheetCols, sheetStartColIdx, sheetStartColOffsetDis, canvasWidth] && setSheetEndCol()
  // $: console.log(scrollTop, sheetTop, sheetStartRowIdx, sheetEndRowIdx)

  // canvas part2
  $: ctx && [
      canvasWidth,
      canvasHeight,
      sheetStartRowIdx,
      sheetStartRowOffsetDis,
      sheetStartColIdx,
      sheetStartColOffsetDis,
    ] &&
    draw()

  function setSheetStartRow() {
    function calcIdxAndDis() {
      let y = 0
      for (let [i, row] of sheetRows.entries()) {
        if (y + row.height > sheetTop) {
          return [i, sheetTop - y]
        }
        y += row.height
      }
      return [sheetRows.length - 1, 0]
    }

    let c = calcIdxAndDis()
    sheetStartRowIdx = c[0]
    sheetStartRowOffsetDis = c[1]
  }

  function setSheetEndRow() {
    function calcIdx() {
      let y = -sheetStartRowOffsetDis
      for (let i = sheetStartRowIdx; i < sheetRows.length; i++) {
        y += sheetRows[i].height
        if (y >= canvasHeight) {
          return i
        }
      }
      return sheetRows.length - 1
    }

    let c = calcIdx()
    sheetEndRowIdx = c
  }

  function setSheetStartCol() {
    function calcIdxAndDis() {
      let x = 0
      for (let [i, col] of sheetCols.entries()) {
        if (x + col.width > sheetLeft) {
          return [i, sheetLeft - x]
        }
        x += col.width
      }
      return [sheetCols.length - 1, 0]
    }

    let c = calcIdxAndDis()
    sheetStartColIdx = c[0]
    sheetStartColOffsetDis = c[1]
  }

  function setSheetEndCol() {
    function calcIdx() {
      let x = -sheetStartColOffsetDis
      for (let i = sheetStartColIdx; i < sheetCols.length; i++) {
        x += sheetCols[i].width
        if (x >= canvasWidth) {
          return i
        }
      }
      return sheetCols.length - 1
    }

    let c = calcIdx()
    sheetEndColIdx = c
  }

  function setCanvasWidth() {
    canvasElem.width = canvasWidth
  }

  function setCanvasHeight() {
    canvasElem.height = canvasHeight
  }

  function mockRows(rowNum = 1000, colNum = 50) {
    rows = Array.from(Array(rowNum).keys()).map(i => {
      return {
        cells: Array.from(Array(colNum).keys()).map(j => {
          return {
            type: "text",
            content: j == 2 ? `行r${i}-列c${j}`: `Row${i}-Col${j}`,
          }
        }),
        fixed: i == 0 ? true : false,
      }
    })
  }

  mockRows()

  function obContainerResize() {
    let observer = new ResizeObserver(entries => {
      if (entries[0]) {
        containerHeight = entries[0].contentRect.height
        containerWidth = entries[0].contentRect.width
      }
    })
    observer.observe(containerElem)
    return () => observer.unobserve(containerElem)
  }

  onMount(() => {
    ctx = canvasElem.getContext("2d")
    containerUnOb = obContainerResize()
  })

  onDestroy(() => {
    containerUnOb()
  })

  function onScrollVByWheel(e) {
    if (sheetHeight <= containerHeight) return
    scrollVing = true
    scrollTop += (e.wheelDeltaY / sheetScrollVRange) * scrollVRange * -1
    scrollTop = Math.max(0, Math.min(scrollVRange, scrollTop))
  }

  function onScrollVByDrag(e) {
    if (!scrollVing || sheetHeight <= containerHeight) return
    scrollTop += e.movementY
    scrollTop = Math.max(0, Math.min(scrollVRange, scrollTop))
  }

  function onScrollHByDrag(e) {
    if (!scrollHing || sheetWidth <= containerWidth) return
    scrollLeft += e.movementX
    scrollLeft = Math.max(0, Math.min(scrollHRange, scrollLeft))
  }

  function startScrollV(e) {
    scrollVing = true
    document.body.addEventListener("mousemove", onScrollVByDrag)
    e.preventDefault()
    e.stopPropagation()
  }

  function startScrollH(e) {
    scrollHing = true
    document.body.addEventListener("mousemove", onScrollHByDrag)
    e.preventDefault()
    e.stopPropagation()
  }

  function stopScroll(e) {
    scrollVing = false
    scrollHing = false
    document.body.removeEventListener("mousemove", onScrollVByDrag)
    document.body.removeEventListener("mousemove", onScrollHByDrag)
  }

  function draw() {
    function clipRect([x, y, w, h]) {
      ctx.save()
      let region = new Path2D()
      region.rect(x, y, w, h)
      ctx.clip(region)
    }

    function drawTextCell([x, y, w, h], text, { font, baseline } = {}) {
      // console.log(text)
      clipRect([x, y, w, h])
      ctx.textBaseline = baseline ?? "middle" // top, middle
      ctx.font = font ?? "24px 微软雅黑"
      if (ctx.textBaseline == "top") ctx.fillText(text, x, y)
      else if (ctx.textBaseline == "middle") ctx.fillText(text, x, y + h / 2)
      ctx.restore()
    }

    function drawHorizontalBorder([x1, y1, x2, y2]) {
      ctx.lineWidth = 1
      ctx.strokeStyle = Color.gray300
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    function drawNormalCells() {
      console.log(sheetStartRowIdx, sheetEndRowIdx, sheetStartColIdx, sheetEndColIdx)

      let y = -sheetStartRowOffsetDis
      for (let i = sheetStartRowIdx; i <= sheetEndRowIdx; i++) {
        let row = sheetRows[i]
        let h = row.height
        let x = -sheetStartColOffsetDis
        for (let j = sheetStartColIdx; j <= sheetEndColIdx; j++) {
          let cell = row.cells[j]
          let col = sheetCols[j]
          let w = col.width
          drawTextCell([x, y, w, h], cell.content)
          drawHorizontalBorder([x, y, x + w, y])
          x += w
        }
        y += h
      }
    }

    function drawFixedRowsCells() {
      ctx.clearRect(0, 0, canvasWidth, sheetFixedHeight)
      let y = 0
      for (let row of sheetFixedRows) {
        let h = row.height
        let x = -sheetStartColOffsetDis
        for (let j = sheetStartColIdx; j <= sheetEndColIdx; j++) {
          let cell = row.cells[j]
          let col = sheetCols[j]
          let w = col.width
          drawTextCell([x, y, w, h], cell.content)
          x += w
        }
        y += h
      }
    }

    function drawCells() {
      drawNormalCells()
      if (sheetFixedRows.length > 0) drawFixedRowsCells()
    }

    if (!ctx) return

    console.log("redraw")
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.fillRect(0, 0, 30, 10)
    drawCells()
  }
</script>

<svelte:body on:mouseup={stopScroll} on:mouseleave={stopScroll} />

<div bind:this={containerElem} class="relative w-full h-full" class:select-none={scrolling} on:wheel={onScrollVByWheel}>
  <div
    class="bg-gray-300 absolute"
    class:hidden={sheetHeight <= containerHeight}
    style="width: 8px; height: {scrollHeight}px; border-radius: 20px; right: 2px; top: {scrollTop}px"
    on:mousedown={startScrollV}
  />

  <div
    class="bg-gray-300 absolute"
    class:hidden={sheetWidth <= containerWidth}
    style="height: 8px; width: {scrollWidth}px; border-radius: 20px; bottom: 2px; left: {scrollLeft}px"
    on:mousedown={startScrollH}
  />

  <canvas bind:this={canvasElem} style="width: {containerWidth}px; height: {containerHeight}px" />
</div>
