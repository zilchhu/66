<script>
  import { onMount, onDestroy } from "svelte"
  // props
  let rows = []

  let container = {
    elem: null,
    width: 0,
    height: 0,
    unobResize: null,
  }

  let canvas = {
    elem: null,
    width: 300,
    height: 150,
    offsetHeight: 14,
    offsetWidth: 14,
  }

  let sheet = {
    colWidth: 100 * 2,
    rowHeight: 24 * 2,
    rows: [],
    cols: [],
    width: 0,
    height: 0,
    startRowIndex: 0,
    startRowOffsetHeight: 0,
    endRowIndex: 0,
    startColIndex: 0,
    startColOffsetWidth: 0,
    endColIndex: 0,
  }

  let scroll = {
    top: 14,
    height: 50,
  }

  let ctx = null


  /*
    rows[prop] -> sheet.rows -> sheet.height

    scroll.top[wheel] -> sheet.top -> (sheet.startRowIndex, sheet.startRowOffsetHeight)
    container.height[resize] -> canvas.height, sheet.startRowIndex, sheet.startRowOffsetHeight -> sheet.endRowIndex
  */


  function obContainerResize() {
    let observer = new ResizeObserver(entries => {
      if (entries[0]) {
        container = { ...container, width: entries[0].contentRect.width, height: entries[0].contentRect.height }
        // resize()
        // resheet()
        // redraw()
      }
    })
    observer.observe(container.elem)
    return () => observer.unobserve(container.elem)
  }

  function sum(ns) {
    return ns.reduce((p, n) => p + n, 0)
  }

  function mockRows(rowNum = 1000, colNum = 50) {
    rows = Array.from(Array(rowNum).keys()).map(i => {
      return {
        cells: Array.from(Array(colNum).keys()).map(j => {
          return {
            type: "text",
            content: `Row${i}-Col${j}`,
          }
        }),
      }
    })
  }

  function initSheet() {
    let sheetRows = rows.map(row => ({ ...row, height: row.height ?? sheet.rowHeight, cells: row.cells ?? [] }))
    let sheetHeight = sum(sheetRows.map(row => row.height))

    let maxColsNum = Math.max(...sheetRows.map(row => row.cells.length))
    let sheetCols = Array.from(Array(maxColsNum).keys()).map(i => ({ width: sheet.colWidth }))
    let sheetWidth = sum(sheetCols.map(col => col.width))

    sheet = { ...sheet, width: sheetWidth, height: sheetHeight, rows: sheetRows, cols: sheetCols }
  }

  mockRows()
  initSheet()
  $: console.log(sheet)

  function resize() {
    canvas = { ...canvas, width: container.width * 2, height: container.height * 2 }
    canvas.elem.width = canvas.width
    canvas.elem.height = canvas.height

    scroll.height = (canvas.height / sheet.height) * container.height
  }

  function resheet() {
    function getEndRowIndex() {
      let { startRowIndex, startRowOffsetHeight } = sheet

      let y = -startRowOffsetHeight
      for (let i = startRowIndex; i < sheet.rows.length; i++) {
        if (y > canvas.height) {
          return i
        }
        y += sheet.rows[i].height
      }
      return sheet.rows.length
    }

    function getEndColIndex() {
      let { startColIndex, startColOffsetWidth } = sheet

      let x = -startColOffsetWidth
      for (let i = startColIndex; i < sheet.cols.length; i++) {
        if (x > canvas.width) {
          return i
        }
        x += sheet.cols[i].width
      }
      return sheet.cols.length
    }

    let sheetEndRowIndex = getEndRowIndex()
    let sheetEndColIndex = getEndColIndex()

    sheet = {
      ...sheet,
      endRowIndex: sheetEndRowIndex,
      endColIndex: sheetEndColIndex,
    }
  }

  function redraw() {
    function drawTextCell([x, y, w, h], text, { font, baseline } = {}) {
      ctx.save()
      let region = new Path2D()
      region.rect(x, y, w, h)
      ctx.clip(region)

      ctx.textBaseline = baseline ?? "top"
      ctx.font = font ?? "24px 微软雅黑"
      ctx.fillText(text, x, y)
      ctx.restore()
    }

    function drawCells() {
      let { startRowIndex, endRowIndex, startColIndex, endColIndex, startRowOffsetHeight, startColOffsetWidth } = sheet
      let y = -startRowOffsetHeight
      for (let i = startRowIndex; i < endRowIndex; i++) {
        let row = sheet.rows[i]
        let h = row.height
        let x = -startColOffsetWidth
        for (let j = startColIndex; j < endColIndex; j++) {
          let cell = row.cells[j]
          let col = sheet.cols[j]
          let w = col.width
          drawTextCell([x, y, w, h], cell.content)
          x += w
        }
        y += h
      }
    }

    ctx.fillRect(0, 0, 20, 20)
    drawCells()
  }

  function onVScroll(e) {
    scroll.top += (e.wheelDeltaY / 12) * -1
    scroll.top = Math.max(
      canvas.offsetHeight,
      Math.min(container.height + canvas.offsetHeight - scroll.height, scroll.top)
    )
  }

  onMount(() => {
    container.unobResize = obContainerResize()
    ctx = canvas.elem.getContext("2d")
  })

  onDestroy(() => {
    container?.unobResize()
  })
</script>

<div
  bind:this={container.elem}
  class="relative w-screen h-screen"
  style="padding: {canvas.offsetHeight}px"
  on:wheel={onVScroll}
>
  <!-- scroll bar -->
  <div
    class="bg-gray-300 absolute"
    class:hidden={sheet.height <= container.height}
    style="width: 8px; height: {scroll.height}px; border-radius: 20px; right: 2px; top: {scroll.top}px"
  />

  <!-- </div> -->
  <canvas bind:this={canvas.elem} style="width: {container.width}px; height: {container.height}px" />
</div>
