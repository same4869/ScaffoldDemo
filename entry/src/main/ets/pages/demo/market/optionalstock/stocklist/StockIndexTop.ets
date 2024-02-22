import { StockIndexData } from '../../../model/StockIndexData'
import StockIndexItem from './StockIndexItem'

@Component
export default struct StockIndexTop {
  @State stockIndexArr: StockIndexData[] = [
    {
      lastPrice: '2954.97',
      indexName: '上证',
      precent: +0.14
    },
    {
      lastPrice: '8970.49',
      indexName: '深成',
      precent: -0.06
    },
    {
      lastPrice: '1744.66',
      indexName: '创业',
      precent: -0.45
    },
    {
      lastPrice: '1744.66',
      indexName: '创业',
      precent: -0.45
    },
  ]

  @Link indexExpanded: boolean
  private selectIndex: number | undefined

  build() {
    Row({space: 9}) {
      List() {
        ForEach(this.stockIndexArr, (stockIndex: StockIndexData, index: number) => {
          ListItem() {
            StockIndexItem({stockIndex: stockIndex})
          }
          .onClick(() => {
            if (this.selectIndex === index) {
              this.selectIndex = undefined
            } else {
              this.selectIndex = index
            }

            this.indexExpanded = this.selectIndex !== undefined && this.selectIndex >= 0
          })
        })
      }
      .listDirection(Axis.Horizontal)
      .scrollBar(BarState.Off)
      .height('100%')
      .layoutWeight(1)

      Row() {
        this.RightButtonBuilder($r('app.media.hq_msg_icon'), '资讯')
        this.RightButtonBuilder($r('app.media.hq_warning_icon'), '盯盘')
      }
      .width(88)
      .height('100%')
    }
    .backgroundColor(0xFFFFFF)
    .width('100%')
    .height(60)
  }

  @Builder RightButtonBuilder(imgSrc: Resource, title: string) {
    Button({buttonStyle: ButtonStyleMode.TEXTUAL}) {
      Column({space: 2}) {
        Image(imgSrc)
          .width(24)
          .aspectRatio(1)
          .margin({top: 8})
        Text(title)
          .fontSize(12)
          .fontColor(0x222222)
      }
      .width('100%')
      .height('100%')

    }
    .width(40)
    .height('100%')
  }
}