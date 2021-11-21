function colStrIndexToNum(str) {
  // split str
  const chars = str.split("")
  // num per char
  const nums = chars.map((c, i, a) => (c ? (c.charCodeAt() - 64) * Math.pow(26, a.length - 1 - i) : 0))
  console.log(nums)
  // sum
  return nums.reduce((p, n) => p + n, 0)
}


function colNumIndexToStr(num) {
  
}