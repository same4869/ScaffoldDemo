import {  colors, PointItem, Point } from '../viewmodel/InitialData'
import { TrendPriceItemList } from '../model/ResponseModel'
import { DrawLineUtil } from '../utils/DrawLineUtil';
import { Size } from '@kit.ArkUI';

@Component
export struct StockTrendView {
  @Prop data: TrendPriceItemList
  @State xTicks: String[] = [] // x轴显示的刻度
  @State yTicks: number[] = [] // y轴显示的刻度值
  private settings: RenderingContextSettings = new RenderingContextSettings(true)
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings)
  private path2Db: Path2D = new Path2D()
  @Prop canvasWidth: number = 6 // 画布的宽度
  @Prop canvasHeight: number = 4 // 画布的高度
  private yWidth = 0 // y轴的文字宽度
  private xHeight = 0 // X轴的文字高度
  private points: Point[] = [] // 原始数量大小
  private grayColor = Color.Gray
  @State minY: number = this.xHeight // 对应的是y轴最小值
  @Prop xGridCount: number = 5 // x轴网格线的数量
  @Prop yGridCount: number = 5 // y轴网格线的数量
  private drawInterval: number = -1; // 定时器

  aboutToAppear() {

  }

  computePointsData() {
    let maxValue: number = this.data.nHighPrice
    let minValue: number = this.data.nLowPrice
    let preClose: number = this.data.nPreClose

    let canvasSize: Size = {width: this.canvasWidth, height: this.canvasHeight}
    let xGapUnit = (this.canvasWidth - this.yWidth) / this.data.nMaxCount
    let maxDiff = DrawLineUtil.getMaxPriceDiff(preClose, maxValue, minValue) * 2

    for (let i: number = 0; i < this.data.nCount; i++) {
      let newPrice = this.data.newPriceArr[i]
      let pointX = i * xGapUnit
      let pointY = DrawLineUtil.getPosYFromFrame(canvasSize, newPrice - preClose, maxDiff)
      this.points.push({
        x: pointX,
        y: pointY
      })
    }
  }
  updateTime = () => {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasWidth)
  }

  // 画网格
  drawGrid() {
    this.context.save()
    this.context.fillStyle = this.grayColor
    this.context.strokeStyle = this.grayColor
    let height = (this.canvasHeight - this.xHeight) / (this.yGridCount - 1) - 1
    let width = (this.canvasWidth - this.yWidth) / (this.xGridCount - 1) - 1

    // 横向
    for (let i = 0; i < this.yGridCount; i++) {
      this.context.beginPath()
      this.context.fillStyle = colors[i]
      this.context.moveTo(this.yWidth, height * i + 1)
      if (i == 2) {
        this.context.setLineDash([3, 3])
      } else {
        this.context.setLineDash([])
      }

      this.context.lineTo(this.canvasWidth, height * i)
      this.context.stroke()
    }
    // 纵向
    this.context.setLineDash([])
    for (let i = 0; i < this.xGridCount; i++) {
      this.context.beginPath()
      this.context.fillStyle = colors[i]
      this.context.moveTo(width * i + this.yWidth+1, 0)
      this.context.lineTo(width * i + this.yWidth+1, this.canvasHeight - this.xHeight)
      this.context.stroke()
    }

    this.context.restore()
  }


  drawLine() {
    this.context.save()
    this.context.beginPath()
    this.context.lineWidth = 1
    this.context.strokeStyle = this.lineColor()
    this.context.imageSmoothingQuality = 'medium'

    let total = this.data.nCount
    for (let i = 0; i < total; i++) {
      if (i == 0) {
        this.context.moveTo(this.points[i].x, this.points[i].y)
      } else {
        this.context.lineTo(this.points[i].x, this.points[i].y)
      }
    }
    this.context.stroke()
    this.context.restore()
  }
  lineColor(): string {
    const preClose: number = this.data.nPreClose
    let lastPrice: number = this.data.newPriceArr[this.data.nCount-1]

    return lastPrice-preClose >= 0 ? '#EC3529' : '#10A361'
  }
  drawArea() {
    this.context.save()
    this.context.beginPath()
    let height = this.canvasHeight - this.xHeight
    let gradient = this.context.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0.0, this.lineColor())
    gradient.addColorStop(1.0, '#f7f7f7')
    this.context.fillStyle = gradient
    let start = 0
    this.path2Db.moveTo(this.points[0].x, this.points[0].y)
    for (let i = 1; i < this.points.length; i++) {
      this.path2Db.lineTo(this.points[i].x, this.points[i].y)
      if (i === this.points.length - 1) {
        this.path2Db.lineTo(this.points[i].x, height)
        this.path2Db.lineTo(this.points[start].x, height)
      }
    }
    this.path2Db.closePath()
    this.context.fill(this.path2Db)
    this.context.restore()
  }

  build() {
    Column() {
      Stack({ alignContent: Alignment.Center }) {
        Canvas(this.context)
          .id('canvas')
          .width('100%')
          .height('100%')
          .onAreaChange((oldValue: Area, newValue: Area) => {
            this.canvasWidth = newValue.width as number
            this.canvasHeight = newValue.height as number

            this.context.clearRect(0, 0, this.canvasWidth, this.canvasWidth)
            this.computePointsData()
            this.drawGrid()
            this.drawLine()

            this.drawArea()
          })
          .onReady(() => {
            // this.context.clearRect(0, 0, this.canvasWidth, this.canvasWidth)
          })
          .onTouch((e: TouchEvent) => {

          })
          .backgroundColor(Color.White)
      }

    }

  }

  aboutToDisappear() {
    if (this.drawInterval !== -1) {
      clearInterval(this.drawInterval)
    }
  }

}