<script>
  import { onMount, onDestroy } from "svelte"
  import Color from "../color/color.js"

  // export let cols = ["shopName"]
  export let rows = [{ shopName: "1" }, { shopName: "贡茶" }, { shopName: "long long long long text" }]

  let canvas, ctx
  let unobserveContainer

  let container = {
    elem: null,
    width: 300,
    height: 150,
    unobserve: null,
  }

  let scroll = {
    elem: null,
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    hscrolling: false,
  }

  let sheet = {
    width: 3000,
    height: 2000,
    top: 0,
    left: 0,
    rowHeight: 48,
    colWidth: 200,
  }

  function initSheet(rows) {
    // rows: [{height: number, cells: [{type: 'text', value: any}]}]
    // cols: [{width: number}]
    const maxColNum = Math.max(...rows.map(row => row.cells.length))
    const cols = Array.from(Array(maxColNum).keys()).map(i => ({ width: sheet.colWidth }))
    const width = cols.map(col => col.width ?? sheet.colWidth).reduce((p, w) => p + w, 0)
    const height = rows.map(row => row.height ?? sheet.rowHeight).reduce((p, h) => p + h, 0)
  }

  $: rows && initSheet(rows)

  function observeContainer() {
    let observer = new ResizeObserver(entries => {
      if (entries[0]) {
        container.width = entries[0].contentRect.width
        container.height = entries[0].contentRect.height
        console.log(container.width, container.height)
        resize()
        redraw()
      }
    })
    observer.observe(container.elem)
    return () => observer.unobserve(container.elem)
  }

  function getSheetHeight() {
    return rows.map(row => row.height ?? sheet.rowHeight).reduce((p, h) => p + h, 0)
  }

  function getSheetWidth() {
    return rows.map(row => row.width ?? sheet.colWidth).reduce((p, w) => p + w, 0)
  }

  function drawRect([x, y, w, h], { width, color } = {}) {
    ctx.lineWidth = width ?? 1
    ctx.strokeStyle = color ?? Color.red300
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.stroke()
  }

  function drawBorder([[x1, y1], [x2, y2]], { width, color } = {}) {
    ctx.lineWidth = width ?? 1
    ctx.strokeStyle = color ?? Color.red200
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  function drawHorizontalBorder([x, y, w], { width, color } = {}) {
    drawBorder(
      [
        [x, y],
        [x + w, y],
      ],
      { width, color }
    )
  }

  function drawVerticalBorder([x, y, h], { width, color } = {}) {
    drawBorder(
      [
        [x, y],
        [x, y + h],
      ],
      { width, color }
    )
  }

  function testDrawBorder(y = 10) {
    drawBorder(
      [
        [10, y],
        [60, y],
      ],
      { width: 2, color: Color.red300 }
    )
  }

  function drawText([x, y, w, h], text, { font, baseline } = {}) {
    ctx.save()
    let region = new Path2D()
    region.rect(x, y, w, h)
    ctx.clip(region)

    ctx.textBaseline = baseline ?? "top"
    ctx.font = font ?? "24px 微软雅黑"
    ctx.fillText(text, x, y)
    ctx.restore()
  }

  function testDrawText() {
    for (let [i, row] of rows.entries()) {
      drawHorizontalBorder([10, i * 40 + 30, canvas.width], { color: Color.green300 })
      drawRect([10, i * 40 + 30, 100, 28])
      drawText([10, i * 40 + 30, 100, 28], row.shopName, {})
    }
  }

  function splitHorizontalEdges(a, b) {
    // b before a
    if (b.x2 <= a.x1) return [b, a]
    // b after  a
    if (b.x1 >= a.x2) return [a, b]
    // b contain a
    if (b.x1 <= a.x1 && b.x2 >= a.x2) return [b]
    // a contain b
    if (b.x1 >= a.x1 && b.x2 <= a.x2) return [{ ...a, x1: a.x1, x2: b.x1 }, b, { ...a, x1: b.x2, x2: a.x2 }]
    // b before intersect a
    if (b.x2 >= a.x1 && b.x2 <= a.x2) return [b, { ...a, x1: b.x2, x2: a.x2 }]
    // b after intersect a
    if (b.x1 >= a.x1 && b.x1 <= a.x2) return [{ ...a, x1: a.x1, x2: b.x1 }, b]
    return [a, b]
  }

  function isHorizontalEdgesIntersect(edges) {
    const splitedLen = edges.map(edge => edge.x2 - edge.x1).reduce((p, w) => p + w, 0)
    const minX = Math.min.apply(edges.map(edge => edge.x1)),
      maxX = Math.max.apply(edges.map(edge => edge.x2)),
      mergedLen = maxX - minX
    return splitedLen != mergedLen
  }

  function collideHorizontalEdges(...edges) {
    // edge: [x, y, w] type: row | row | cell
    // [0, 50] [30, 80]  [50 70]
  }

  function drawGrid() {
    let lastRowY = 0
    for (let row of rows) {
      let rowHeight = row.height ?? sheet.rowHeight
      drawHorizontalBorder([0, rowHeight + lastRowY, sheet.width], { color: Color.green300 })
      lastRowY += rowHeight
    }
  }

  function resheet() {
    sheet.height = getSheetHeight()
    sheet.width = getSheetWidth()
  }

  function resize() {
    canvas.width = container.width * 2
    canvas.height = container.height * 2
  }

  function redraw() {
    console.log("redraw")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // testDrawText()
    drawGrid()
  }

  onMount(() => {
    container.unobserve = observeContainer()
    ctx = canvas.getContext("2d")
    resheet()
    resize()
    redraw()
  })

  onDestroy(() => {
    container?.unobserve()
  })

  function onClick(e) {
    console.log(e)
  }

  function onWheel(e) {
    if (sheet.height <= container.height) return
    console.log(e)
    scroll.top += (e.wheelDeltaY / 12) * -1
    scroll.top = Math.max(0, Math.min(container.height - scroll.height, scroll.top))

    sheet.top = (scroll.top / (container.height - scroll.height)) * (sheet.height - container.height)
    sheet.top = Math.max(0, Math.min(sheet.height - container.height, sheet.top))

    console.log(sheet.top, scroll.top)
  }

  function onHScroll(e) {
    if (!scroll.hscrolling) return
    console.log(e)
    // distance: [0, container.width - scroll.width]
    scroll.left += e.movementX
    scroll.left = Math.max(0, Math.min(container.width - scroll.width, scroll.left))

    // distance: [0, sheet.width - container.width]
    sheet.left = (scroll.left / (container.width - scroll.width)) * (sheet.width - container.width)
    sheet.left = Math.max(0, Math.min(sheet.width - container.width, sheet.left))

    console.log(sheet.left, scroll.left)
  }

  function startHScroll(e) {
    scroll.hscrolling = true
    document.body.addEventListener("mousemove", onHScroll)
  }

  function endHScroll(e) {
    scroll.hscrolling = false
    document.body.removeEventListener("mousemove", onHScroll)
  }
</script>

<svelte:body on:mouseup={endHScroll} />

<div bind:this={container.elem} class="relative p-4 w-screen h-screen" on:wheel={onWheel}>
  <!-- scroll bar -->
  <!-- <div class="bg-green-50 absolute top-0 bottom-0 right-0" style="width: 10px"> -->
  <div
    class="bg-gray-300 absolute"
    class:hidden={sheet.height <= container.height}
    style="width: 8px; height: {scroll.height}px; border-radius: 20px; right: 2px; top: {scroll.top}px"
  />
  <div
    class="bg-gray-300 absolute select-none"
    class:hidden={sheet.width <= container.width}
    style="height: 8px; width: {scroll.width}px; border-radius: 20px; bottom: 2px; left: {scroll.left}px"
    on:mousedown={startHScroll}
  />

  <!-- </div> -->
  <canvas bind:this={canvas} on:click={onClick} style="width: {container.width}px; height: {container.height}px" />
</div>
