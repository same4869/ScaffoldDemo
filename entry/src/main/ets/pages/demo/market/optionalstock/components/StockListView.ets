import { MLog } from '@app/commlib'
/**
 @author: XWANG
 @date: 2024/2/26
 @description: 自选股首页，联动滑动的列表
 */
import { OpListDataBean, OptionalStockViewModel } from '../viewmodel/OptionalStockViewModel'

let vm: OptionalStockViewModel = new OptionalStockViewModel()

@Component
export default struct StockListView {
  private scrollList: Array<Scroller> = []
  @State scrollIndex: number = -1

  async aboutToAppear() {
    vm.opTestDataList.forEach((item) => {
      this.scrollList.push(new Scroller())
    })
    MLog.debug(`>>>>>>>>${this.scrollList.length}`)
  }

  build() {
    Column() {
      List() {
        ForEach(vm.opTestDataList, (item: OpListDataBean, index) => {
          ListItem() {
            Row() {
              Column() {
                Text(item.stockName).width(80).textAlign(TextAlign.Center)
                Text(item.stockCode).width(80).textAlign(TextAlign.Center).fontColor(Color.Gray)
              }

              Scroll(this.scrollList[index]) {
                Row() {
                  Text(item.newPrice).width(75).textAlign(TextAlign.Center).fontColor(Color.Red)
                  Text(item.priceRange).width(75).textAlign(TextAlign.Center).fontColor(Color.Red)
                  Text(`第三列`).width(75).textAlign(TextAlign.Center).fontColor(Color.Green)
                  Text(`第四列`).width(75).textAlign(TextAlign.Center)
                  Text(`第五列`).width(75).textAlign(TextAlign.Center).fontColor(Color.Green)
                  Text(`第六列`).width(75).textAlign(TextAlign.Center)
                  Text(`第七列`).width(75).textAlign(TextAlign.Center)
                }
                .height(60)
              }
              .scrollBar(BarState.Off)
              .flexShrink(1)
              .flexGrow(1)
              // .scrollable((this.scrollIndex == -1 || this.scrollIndex == index) ? ScrollDirection.Horizontal : ScrollDirection.None)
              .scrollable(ScrollDirection.Horizontal)
              .onScrollStart(() => {
                // if (this.scrollIndex != -1) {
                //   LogUtils.debug(`滚动的条目${this.scrollIndex}>>>>>>${index}`)
                //   return
                // }
                this.scrollIndex = index
              })
              .onScrollStop(() => {
                MLog.debug(`停止滚动的条目${this.scrollIndex}>>>>>>${index}`)
                if (this.scrollIndex == index) {
                  this.scrollIndex = -1
                }
              })
              .onScroll((xOffset, yOffset) => {
                MLog.debug(`滚动的条目${this.scrollIndex} index：${index} scrollIndex:${this.scrollIndex}`)
                if (index == this.scrollIndex) {
                  this.scrollList.forEach((scroller, Index) => {
                    if (index != Index) {
                      scroller.scrollBy(xOffset, 0)
                    }
                    MLog.debug(`>>>>>>>>${xOffset}`)
                  })
                }
              })
            }
            .width("100%")
            .height(60)
          }
        })
      }
      .scrollBar(BarState.Off)
      .width('100%')
      .height("100%")
      .cachedCount(100)
      .flexGrow(1)
    }
    .width("100%")
    .height("100%")
  }
}