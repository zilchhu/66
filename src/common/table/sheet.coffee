class Cell
  constructor: ({@ctx, @x, @y, @width, @height}) ->
    @x2 = @x + @width
    @y2 = @y + @height

  draw_top_border: () ->
    @ctx.beginPath()
    @ctx.moveTo @x @y
    @ctx.lineTo @x2 @y
  

class Row
  constructor: ({@ctx, @view, @y1, @y2}) ->

  draw_top_border: () ->
    @ctx.beginPath()
    @ctx.moveTo @view.x1 @y1
    @ctx.lineTo @view.x2 @y1

  draw_bottom_border: () ->
    @ctx.beginPath()
    @ctx.moveTo @view.x1 @y2
    @ctx.lineTo @view.x2 @y2

class Selector
  constructor: ({ctx, sheet}) ->
    @ctx = ctx
    @sheet = sheet

  select: ([r1, c1, r2, c2]) -> 
    x1 = sheet.cols[c1].x1
    y1 = sheet.rows[r1].y1
    x2 = sheet.cols[c2].x2
    y2 = sheet.rows[r2].y2
    @ctx.strokeRect x1, x2, x2 - x1, y2 - y1


