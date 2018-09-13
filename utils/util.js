const colorList = ["#003399", "#006699", "#0066CC", "#009933", "#009966", "#009999", "#0099CC", "#333399", "#336699", "#339933", "#339999", "#3399CC", "#33CC99", "#663366", "#666633", "#666699", "#66CC99", "#66CCCC", "#993366", "#993399", "#999999", "#99CC00", "#99CC33", "#99CC66", "#99CCCC", "#CC0066", "#CC3399", "#CC6600", "#CC6633", "#CC6699", "#CC9999", "#CCCC00", "#CCCC33", "#CCCC44", "#CCCC99", "#CCCCCC", "#CCFF00", "#CCFF66", "#FF0033", "#FF33CC", "#FF6600", "#FF6666", "#FF9900", "#FF9933", "#FF9966", "#FF9999", "#FF99CC", "#FFCC00", "#FFCC33", "#FFCC99", "#FFCCCC", "#FFFF00", "#FFFF66", "#FFFF99", "#FFFFCC", "#FFFFFF"]

const ckList = [{ "val": "#003399", "checked": false }, { "val": "#339999", "checked": false }, { "val": "#663366", "checked": false }, { "val": "#666699", "checked": false }, { "val": "#66CC99", "checked": false }, { "val": "#993366", "checked": false }, { "val": "#993399", "checked": false }, { "val": "#99CC66", "checked": false }, { "val": "#CC3399", "checked": false }, { "val": "#CC6699", "checked": false }, { "val": "#CCCC99", "checked": false }, { "val": "#CCFF00", "checked": false }, { "val": "#FF33CC", "checked": false }, { "val": "#FF6666", "checked": false },  { "val": "#FFFF99", "checked": false }, { "val": "#FFFFFF", "checked": false }]

const getColor = () =>{
  let i = parseInt(Math.random() * 56)
  return colorList[i]
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const drawText = function (textVal, axisX, colors, _this){
  let ctx = _this.data.ctx
  let dwidth = _this.data.device.width
  let dheight = _this.data.device.height
  let fontSize = _this.data.fontObj.size
  let fontw = _this.data.fontObj.width

  let gradient = ctx.createLinearGradient(0, 0, fontw* 10, 0);
  for (let i = 0; i < colors.length;i++){
    gradient.addColorStop((i+1) / colors.length, colors[i])
  }
  
  ctx.restore()
  ctx.font = fontSize + "px Georgia";
  ctx.fillStyle = gradient;
  ctx.textBaseline = "middle";
  
  ctx.fillText(textVal, axisX, -dwidth / 2);
  ctx.save()
  ctx.draw(false, function () {

  })
}

module.exports ={
  drawText: drawText,
  getColor: getColor,
  formatTime: formatTime,
  colorList: colorList,
  ckList: ckList
}