var getColor = require('../../utils/util.js').getColor
var formatTime = require('../../utils/util.js').formatTime
var colorList = require('../../utils/util.js').colorList
var ckList = require('../../utils/util.js').ckList

Page({
  data: {
    colorList: colorList,
    ckList: ckList,
    ctx: null,
    ctxObj: {
      bottom: 331,
      animationData: {},
      canOpPanel: true,
    },
    device: {
      width: wx.getSystemInfoSync().windowWidth,
      height: wx.getSystemInfoSync().windowHeight
    },
    fontObj: {
      val: '小葵灯小脸萌！',
      txtVal: '欢迎来到小葵灯小脸萌！',
      size: 80,
      width: 0,
      color: '#009933',
      showType: [{
        key: '文字',
        val: 0
      }, {
        key: '倒计时',
        val: 1
      }, {
        key: '时间',
        val: 2
      }],
      showTypeVal: 0,
      stIndex: 0,
      axisX: 0,
      countNum: 10,
      countTime: ''
    },
    config: {
      colorTypes: [{
        key: '纯色',
        val: 0
      }, {
        key: '变色',
        val: 1
      }, {
        key: '彩色',
        val: 2,
        checked: 'true'
      }],
      colorType: 2, //0：纯色 1：变色 2：彩色
      moveSpeed: 1,
      duration: 1000, //颜色切换频率
      density: 3, //彩色密度
      colorIntval: null,
      axisIntval: null,
      countIntval: null,
      colors: [],
      bannerColors: [],
      bcIndex: 0
    },
    se: [{
        key: '常规',
        val: 0
      },
      {
        key: '立体',
        val: 1,
        checked: 'true'
      },
      {
        key: '发光',
        val: 2
      }
    ],
    seval: 1,
    slider: {
      color: "#88f",
      size: 21
    }
  },
  hidepanel: function() {
    if (!this.data.ctxObj.canOpPanel) return;
    this.setData({
      ['ctxObj.canOpPanel']: false
    })
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    this.animation = animation
    animation.translateY(450).rotate(45).step()
    animation.translateY(450).rotate(-45).step()
    this.setData({
      animationData: animation.export()
    })
    this.setData({
      ['ctxObj.bottom']: 0
    })
    setTimeout(() => {
      this.setData({
        ['ctxObj.canOpPanel']: true
      })
    }, 1100)
  },
  showpanel: function() {
    if (!this.data.ctxObj.canOpPanel) return;
    this.setData({
      ['ctxObj.canOpPanel']: false
    })
    var animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.translateY(0).rotate(0).step()
    this.setData({
      animationData: animation.export()
    })
    setTimeout(() => {
      this.setData({
        ['ctxObj.bottom']: 330
      })
      this.setData({
        ['ctxObj.canOpPanel']: true
      })
    }, 700)
  },
  pickstType: function(e) {
    this.setData({
      ['fontObj.showTypeVal']: e.detail.value
    })
    this.setData({
      ['fontObj.stIndex']: e.detail.value
    })
    if (e.detail.value == 0) {
      this.setData({
        ['fontObj.val']: this.data.fontObj.txtVal
      })
    }
    if (e.detail.value == 1) {
      this.setData({
        ['fontObj.val']: 10
      })
    }
    this.setTextType()
  },
  radioChange: function(e) {
    this.setData({
      ['config.colorType']: e.detail.value
    })
    this.setColors()
  },
  famailyChange: function(e) {
    this.setData({
      seval: e.detail.value
    })
  },
  changeColor: function(e) {
    this.setData({
      ['fontObj.color']: e.detail.value
    })
  },
  checkColor: function(e) {
    this.setData({
      ['config.bannerColors']: e.detail.value
    })
    let list = e.detail.value

    for (let i = 0; i < this.data.ckList.length; i++) {
      let item = this.data.ckList[i]
      if (list.indexOf(item.val) != -1) {
        this.setData({
          ['ckList[' + i + '].checked']: true
        })
      } else {
        this.setData({
          ['ckList[' + i + '].checked']: false
        })
      }
    }
    // this.data.config.bcIndex = 0
  },
  changeText: function(e) {
    if (this.data.fontObj.showTypeVal == 0) {
      this.setData({
        ['fontObj.val']: e.detail.value
      })
      this.setData({
        ['fontObj.txtVal']: e.detail.value
      })

    }
    if (this.data.fontObj.showTypeVal == 1) {
      this.setData({
        ['fontObj.val']: e.detail.value
      })
      if (isNaN(parseInt(this.data.fontObj.val))) {
        this.setData({
          ['fontObj.val']: 0
        })
        this.data.fontObj.countNum = 0
      } else {
        this.data.fontObj.countNum = parseInt(this.data.fontObj.val)
        this.setData({
          ['fontObj.val']: parseInt(this.data.fontObj.val)
        })
      }

    }
  },
  changeSpeed: function(e) {
    this.setData({
      ['config.moveSpeed']: e.detail.value
    })
  },
  cFontsize: function(e) {
    this.setData({
      ['fontObj.size']: e.detail.value
    })
  },
  cDuration: function(e) {
    this.setData({
      ['config.duration']: 2000 - e.detail.value
    })
    this.setColors()
  },
  cDensity: function(e) {
    this.setData({
      ['config.density']: 6 - e.detail.value
    })
  },
  onReady: function() {
    this.data.ctx = wx.createCanvasContext('mainCanvas')
    this.data.ctx.rotate(90 * Math.PI / 180)
    this.bannerText()
  },
  bannerText: function() {
    this.clearAllIntval()
    let showTypeVal = this.data.fontObj.showTypeVal
    let textVal = this.getTextval(showTypeVal)
    this.getTxtLength(textVal)
    this.getAxisXA()
    let ctx = this.data.ctx
    let dheight = this.data.device.height
    let duration = this.data.config.duration
    let axisX = this.data.fontObj.axisX
    let fontw = 0
    this.setColors()
    this.setTextType()
    this.data.config.axisIntval = setInterval(() => {
      let showTypeVal = this.data.fontObj.showTypeVal
      let colorType = this.data.config.colorType
      let colors = this.data.config.colors
      if (showTypeVal == 2) {
        textVal = this.data.fontObj.countTime
      }
      if (showTypeVal == 1) {
        textVal = this.data.fontObj.countNum
      }
      if (showTypeVal == 0) {
        textVal = this.data.fontObj.val
      }
      if (colorType == 0) {
        colors = new Array()
        colors[0] = this.data.fontObj.color
      }
      fontw = this.data.fontObj.width
      if (fontw > dheight) {
        if (axisX <= -fontw) {
          axisX = dheight
        }
        axisX -= this.data.config.moveSpeed
      } else {
        axisX = (dheight - fontw) / 2
      }
      this.drawText(textVal, axisX, colors)
    }, 16)
  },
  drawText: function(textVal, axisX, colors) {
    let ctx = wx.createCanvasContext('mainCanvas') //this.data.ctx
    let dwidth = this.data.device.width
    let dheight = this.data.device.height
    let fontSize = this.data.fontObj.size
    let fontw = this.data.fontObj.width
    let density = this.data.config.density
    let gradient = ctx.createLinearGradient(0, 0, fontw * density, 0);
    gradient.addColorStop(0, colors[0] || '#ffffff')
    for (let i = 0; i < colors.length; i++) {
      gradient.addColorStop((i + 1) / colors.length, colors[i])
    }
    ctx.rotate(90 * Math.PI / 180)
    ctx.font = fontSize + "px Georgia";
    ctx.fillStyle = gradient;
    ctx.textBaseline = "middle";
    ctx.fillText(textVal, axisX, -dwidth / 2);
    ctx.draw()
    this.data.fontObj.width = ctx.measureText(textVal).width;
  },
  setColors: function() {
    clearInterval(this.data.config.colorIntval)
    let colorType = this.data.config.colorType
    let duration = this.data.config.duration
    if (colorType == 1 || colorType == 2) {
      this.data.config.colorIntval = setInterval(() => {
        this.data.config.colors = this.getColorList(colorType)
      }, duration)
    }
  },
  setTextType: function() {
    clearInterval(this.data.config.countIntval)
    let showTypeVal = this.data.fontObj.showTypeVal
    if (showTypeVal == 1) {
      this.data.config.countIntval = setInterval(() => {
        if (this.data.fontObj.countNum <= 0) {
          this.data.fontObj.countNum = parseInt(this.data.fontObj.val) + 1
        }
        this.data.fontObj.countNum--
      }, 1000)
    }
    if (showTypeVal == 2) {
      this.data.config.countIntval = setInterval(() => {
        this.data.fontObj.countTime = formatTime(new Date())
      }, 1000)
    }
  },
  clearAllIntval: function() {
    clearInterval(this.data.config.colorIntval)
    clearInterval(this.data.config.axisIntval)
    clearInterval(this.data.config.countIntval)
  },
  getAxisXA: function() {
    let dheight = this.data.device.height
    let fontw = this.data.fontObj.width
    let initX = (dheight - fontw) / 2
    let axisX = 0
    if (fontw <= dheight) {
      axisX = initX
    } else {
      axisX = 120
    }
    this.data.fontObj.axisX = axisX
  },
  getTextval: function(showTypeVal) {
    let textVal = ''
    if (showTypeVal == 0) {
      textVal = this.data.fontObj.val
    }
    if (showTypeVal == 1) {
      textVal = 10
    }
    if (showTypeVal == 2) {
      textVal = formatTime(new Date())
    }
    this.data.fontObj.val = textVal
    return textVal;
  },
  getTxtLength: function(textVal) {
    this.drawText(textVal, 100, ["#ffffff"])
    this.data.fontObj.width = this.data.ctx.measureText(textVal).width;
  },
  getColorList: function(types) {
    let colorList = []
    let bcolor = this.data.config.bannerColors
    if (types == 2) {
      let length = 36
      for (let i = 0; i < length; i++) {
        colorList.push(getColor())
      }
    }
    if (types == 1 && bcolor.length == 0) {
      colorList.push(getColor())
    }
    if (types == 1 && bcolor.length > 0) {
      if (this.data.config.bcIndex >= bcolor.length) {
        this.data.config.bcIndex = 0
      }
      colorList.push(bcolor[this.data.config.bcIndex++])
    }
    return colorList;
  },
  onShareAppMessage: function() {
    return {
      title: "小葵灯",
      path: '/pages/index/index',
      imageUrl: '/imgs/share-bk.png',
    }
  }
})