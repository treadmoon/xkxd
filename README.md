## 微信小程序canvas应用 模仿LED灯牌

#### 小程序：小葵小灯应援灯

前言：小程序发布以来一直就很火，最近得空学习了一下。反正前端来什么都的学一下，新东西来的又快！扯远了~，为了验证一下学习成果，就做了一个练手的小程序项目。忘了为什么要做一个灯牌的原因，就当是上帝交给我的任务吧！

## 一.准备工作

嘿嘿嘿！略略略~

## 二.项目开发

简单说一下小程序：

-<code>wxml</code>文件，就当他是HTML  
-<code>wxss</code>文件，就当她是CSS  
-<code>wxs </code>文件，你看这个文件，它又……不要唱了。他是小程序的脚本语言，可以看做小程序的JS.  

![alt 效果图](https://mlcjq.com/myimg/xkxd/1.png)  
先放一张效果图  
1. 先写页面，看一下wxml语法，和写HTML差不多，写过vue的人更清楚了，样式也和css一样。
2. 画板用的就是画布<code>canvas</code>。属性控制面板的动画，直接调用小程序的API接口<code>Animation</code>,使用起来也很简单，参考官方文档即可。  
3. 该项目的核心点就是画布<code>canvas</code>的动画处理了  

```
//注：ctx = wx.createCanvasContext('mainCanvas')

ctx.font = fontSize + "px Georgia";  
ctx.fillStyle = gradient;  
ctx.textBaseline = "middle";  
ctx.fillText(textVal, axisX, -dwidth / 2);  
```
一目了然，如何在画布上写字,并且可以设置字体、颜色、大写、<code>位置</code>。对，我给位置画了重点，文字的动画都要靠它了。 

文字的彩色，就是创建一个线性的渐变颜色，API接口<code>createLinearGradient</code>，贴出对应代码：  
```
let gradient = ctx.createLinearGradient(0, 0, fontw * density, 0);
gradient.addColorStop(0, colors[0] || '#ffffff')
for (let i = 0; i < colors.length; i++) {
    gradient.addColorStop((i + 1) / colors.length, colors[i])
}
```  


接下来就到了坑点了：
1. 小程序不能横屏，这就比较坑啊。怎么办，我只能：
```
 ctx.rotate(90 * Math.PI / 180)
```
旋转90度，这时候要注意了，画布的文字的坐标就要以下图为标准了：  
![alt 效果图](https://mlcjq.com/myimg/xkxd/2.png)  
所以要使文字达到滚屏效果，正确的的方式是改变X的坐标，贴出对应代码：
```
if (fontw > dheight) {
    if (axisX <= -fontw) {
        axisX = dheight
    }
    axisX -= this.data.config.moveSpeed
} else {
    axisX = (dheight - fontw) / 2
}
```  

2. 还有一个坑就是，小程序不支持<code>requestAnimationFrame
</code>也没有找到对应的画布动画API，只能写好几个<code>setTimeout</code>和<code>setInterval</code>，这个东西用多了总归不好，但是目前只能这样。  

3. 小程序居然没有调色板，这个也是没办法，我只能写一个颜色数组了，写了一些主流颜色。  
![alt 效果图](https://mlcjq.com/myimg/xkxd/3.png)  
是的，这些颜色块其实是<code>checkbox</code>伪装的，这样就可以颜色多选了。

4. 最后一个坑就是我的代码有点乱，借口是：工作还是挺忙的996呢！部门就我一个*顶梁柱*开发。（哎呀！顶梁柱歪了）

第一次写小程序，总想丰富点什么，就想着往上面加东西，加了一个倒计时、在线时钟。又把分享按钮，客服功能都加了上去，小程序都有完整的API。既然我加了分享，你们就多分享分享，把我的小程序用蹦。

[贴上github代码地址：https://github.com/treadmoon/xkxd](https://github.com/treadmoon/xkxd)：
