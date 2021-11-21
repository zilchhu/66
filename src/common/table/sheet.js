const merge = require('deepmerge')
const { Color } = require('../color/Color.js')
// import { Color} from '../color/Color.js'


function draw(ctx, opts) {
  function init(opts) {
    function initView(view) {
      return {
        canvasWidth: view.canvasWidth ?? 300,
        canvasHeight: view.canvasHeight ?? 150,
        colWidth: view.colWidth ?? 120,
        rowHeight: view.rowHeight ?? 24,
        borderWidth: view.borderWidth ?? 1,
        borderColor: view.borderColor ?? Color.gray100,
        scrollLeft: view.scrollLeft ?? 0,
      }
    }

    function initCols(cols) {
      return cols.map(col => {
        if (typeof col == 'object') return col
        if (typeof col == 'string') return { key: col, label: col }
        throw new Error('invalid col config')
      })
    }

    return { ...opts, view: initView(opts.view), cols: initCols(opts.cols) }
  }


  function view(opts) {

    function sliceRows(view, rows) {
      function getSliceStart() {
        let height = 0
        for (let [i, row] of rows.entries()) {
          let rowHeight = row.height ?? rowHeight
          if (height + rowHeight > view.scrollLeft) {
            return { offsetIndex: i, offsetPx: view.scrollLeft - height }
          }
          height += rowHeight
        }
        return { offsetIndex: 0, offsetPx: 0 }
      }

      function slice(start) {
        if (rows.length == 0) return []
        let y1 = (rows[start.offsetIndex].height ?? view.rowHeight) - start.offsetPx, i = start.offsetIndex
        let slices = []
        while (i < rows.length) {
          let rowHeight = rows[i].height ?? view.rowHeight
          slices.push({
            ...rows[i],
            height: rowHeight,
            y1,
            y2: y1 + rowHeight,
            style: merge(rows[i].style, {
              borderTop: { width: view.borderWidth, color: view.borderColor },
              borderBottom: { width: view.borderWidth, color: view.borderColor },
            })
          })
          if (y1 += rowHeight, y1 >= view.canvasHeight) break
        }
        return slices
      }

      return slice(getSliceStart())
    }

    function sliceCols(view, cols) {
      function getSliceStart() {
        let width = 0
        for (let [i, col] of cols.entries()) {
          let colWidth = col.width ?? view.colWidth
          if (width + colWidth > view.scrollLeft) {
            return { offsetIndex: i, offsetPx: view.scrollLeft - width }
          }
          width += colWidth
        }
        return { offsetIndex: 0, offsetPx: 0 }
      }

      function slice(start) {
        if (cols.length == 0) return []
        let x1 = (cols[start.offsetIndex].width ?? view.colWidth) - start.offsetPx, i = start.offsetIndex
        let slices = []
        while (i < cols.length) {
          let colWidth = cols[i].width ?? view.colWidth
          slices.push({
            ...cols[i],
            width: colWidth,
            x1,
            x2: x1 + colWidth,
            style: merge(cols[i].style, {
              borderLeft: { width: view.borderWidth, color: view.borderColor },
              borderRight: { width: view.borderWidth, color: view.borderColor },
            })
          })
          if (x1 += colWidth, x1 >= view.canvasWidth) break
        }
        return slices
      }

      return slice(getSliceStart())
    }

    function sumHeight(rows) {

    }

    const rows = sliceRows(opts.view, opts.rows)
    const cols = sliceCols(opts.view, opts.cols)
    console.log(rows, cols)
  }


  let _opts = init(opts)
  view(_opts)
}

function t3() {
  draw(null, {

  })
}



function t2() {
  const sheet00 = {
    cols: ['shopName'],
    rows: [['1']]
  }

  const sheet0 = {
    cols: ['shopName'],
    rows: [
      { shopName: '1' }
    ]
  }

  const sheet = {
    cols: [
      { key: 'shopName', label: '店铺名称' }
    ],
    rows: [
      { shopName: '1', _height: 24, _style: {} }
    ]
  }

  const sheet2 = {
    cols: [
      { key: 'shopName', label: '店铺名称', width: 100 }
    ],
    rows: [
      { cells: [{ type: 'text', value: '1' }], height: 24 }
    ]
  }

  const sheet3 = {
    cols: [
      {
        key: 'shopName', label: '店铺名称', width: 100, x1: 0, x2: 100,
        style: {
          borderLeft: { color: 'red', width: 1 },
          borderRight: { color: 'red', width: 1 },
          backgroundColor: 'yellow'
        }
      }
    ],
    rows: [
      {
        height: 24, y1: 0, y2: 24,
        cells: [
          {
            type: 'text', value: '1', x1: 0, x2: 100, y1: 0, y2: 24,
            style: { color: 'cyan' }
          }
        ],
        style: {
          borderTop: { color: 'green', width: 1 },
          borderBottom: { color: 'green', width: 1 },
          color: 'orange'
        }
      }
    ]
  }
  // draw(sheet)
}


class Selector {
  
}