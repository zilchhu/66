
ctx.clearRect = function() {
  console.log('clearRect', arguments)
  return CanvasRenderingContext2D.prototype.clearRect.apply(ctx, arguments)
}

ctx.fillRect = function() {
  console.log('fillRect', arguments)
  return CanvasRenderingContext2D.prototype.fillRect.apply(ctx, arguments)
}

ctx.strokeRect = function() {
  console.log('strokeRect', arguments)
  return CanvasRenderingContext2D.prototype.strokeRect.apply(ctx, arguments)
}

ctx.fillText = function() {
  console.log('fillText', arguments)
  return CanvasRenderingContext2D.prototype.fillText.apply(this, arguments)
}

ctx.strokeText = function() {
  console.log('strokeText', arguments)
  return CanvasRenderingContext2D.prototype.strokeText.apply(this, arguments)
}

ctx.measureText = function() {
  console.log('measureText', arguments)
  return CanvasRenderingContext2D.prototype.measureText.apply(this, arguments)
}

ctx.beginPath = function() {
  console.log('beginPath', arguments)
  return CanvasRenderingContext2D.prototype.beginPath.apply(this, arguments)
}

ctx.closePath = function() {
  console.log('closePath', arguments)
  return CanvasRenderingContext2D.prototype.closePath.apply(this, arguments)
}

ctx.moveTo = function() {
  console.log('moveTo', arguments)
  return CanvasRenderingContext2D.prototype.moveTo.apply(this, arguments)
}

ctx.lineTo = function() {
  console.log('lineTo', arguments)
  return CanvasRenderingContext2D.prototype.lineTo.apply(this, arguments)
}

ctx.rect = function() {
  console.log('rect', arguments)
  return CanvasRenderingContext2D.prototype.rect.apply(this, arguments)
}

ctx.fill = function() {
  console.log('fill', arguments)
  return CanvasRenderingContext2D.prototype.fill.apply(this, arguments)
}

ctx.stroke = function() {
  console.log('stroke', arguments)
  return CanvasRenderingContext2D.prototype.stroke.apply(this, arguments)
}

ctx.drawFocusIfNeeded = function() {
  console.log('drawFocusIfNeeded', arguments)
  return CanvasRenderingContext2D.prototype.drawFocusIfNeeded.apply(this, arguments)
}

ctx.scrollPathIntoView = function() {
  console.log('scrollPathIntoView', arguments)
  return CanvasRenderingContext2D.prototype.scrollPathIntoView.apply(this, arguments)
}

ctx.isPointInPath = function() {
  console.log('isPointInPath', arguments)
  return CanvasRenderingContext2D.prototype.isPointInPath.apply(this, arguments)
}

ctx.isPointInStroke = function() {
  console.log('isPointInStroke', arguments)
  return CanvasRenderingContext2D.prototype.isPointInStroke.apply(this, arguments)
}

ctx.getTransform = function() {
  console.log('getTransform', arguments)
  return CanvasRenderingContext2D.prototype.getTransform.apply(this, arguments)
}

ctx.rotate = function() {
  console.log('rotate', arguments)
  return CanvasRenderingContext2D.prototype.rotate.apply(this, arguments)
}

ctx.scale = function() {
  console.log('scale', arguments)
  return CanvasRenderingContext2D.prototype.scale.apply(this, arguments)
}

ctx.translate = function() {
  console.log('translate', arguments)
  return CanvasRenderingContext2D.prototype.translate.apply(this, arguments)
}

ctx.transform = function() {
  console.log('transform', arguments)
  return CanvasRenderingContext2D.prototype.transform.apply(this, arguments)
}

ctx.setTransform = function() {
  console.log('setTransform', arguments)
  return CanvasRenderingContext2D.prototype.setTransform.apply(this, arguments)
}

ctx.resetTransform = function() {
  console.log('resetTransform', arguments)
  return CanvasRenderingContext2D.prototype.resetTransform.apply(this, arguments)
}

ctx.drawImage = function() {
  console.log('drawImage', arguments)
  return CanvasRenderingContext2D.prototype.drawImage.apply(this, arguments)
}

ctx.getImageData = function() {
  console.log('getImageData', arguments)
  return CanvasRenderingContext2D.prototype.getImageData.apply(this, arguments)
}

ctx.putImageData = function() {
  console.log('putImageData', arguments)
  return CanvasRenderingContext2D.prototype.putImageData.apply(this, arguments)
}

ctx.save = function() {
  console.log('save', arguments)
  return CanvasRenderingContext2D.prototype.save.apply(this, arguments)
}

ctx.restore = function() {
  console.log('restore', arguments)
  return CanvasRenderingContext2D.prototype.restore.apply(this, arguments)
}

