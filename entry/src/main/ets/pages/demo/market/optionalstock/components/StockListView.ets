import { MLog } from '@app/commlib'
/**
 @author: XWANG
 @date: 2024/2/26
 @description: 自选股首页，联动滑动的列表
 */
import { OpListDataBean, OptionalStockViewModel } from '../viewmodel/OptionalStockViewModel'
import { StockTrendView } from './trend_canvas/view/StockTrendView'
import { createListRange } from './trend_canvas/viewmodel/ListDataSource'
import { stocksInitialList, StockDataItem, StockCellModelItem } from './trend_canvas/viewmodel/InitialData'

let vm: OptionalStockViewModel = new OptionalStockViewModel()
const listData: StockCellModelItem[] = createListRange()

@Component
export default struct StockListView {
  private leftScroller: Scroller = new Scroller()
  private rightScroller: Scroller = new Scroller()
  private flag = true

  aboutToAppear() {

  }

  build() {
    Row() {
      List({scroller: this.leftScroller}) {
        ForEach(listData, (item: StockCellModelItem) => {
          ListItem() {
            Column() {
              Text(item.quoteData.stockName).width('100%')
              Text(item.quoteData.stockCode).width('100%').fontColor(Color.Gray)
            }
            .height(60)
            .justifyContent(FlexAlign.SpaceEvenly)
          }
        })
      }
      .onTouch(() => this.flag = true)
      .onScrollFrameBegin((offset: number) => {
        if (this.flag) {
          this.rightScroller.scrollBy(0, offset)
        }
        return { offsetRemain: offset };
      })
      .scrollBar(BarState.Off)
      .edgeEffect(EdgeEffect.None)
      .width(130)
      .height('100%')

      Scroll() {
        List({scroller: this.rightScroller}) {
          ForEach(listData, (item: StockCellModelItem) => {
            ListItem() {
              Row() {
                StockTrendView({ data:item.trendListModel }).width(75)
                Text(item.quoteData.price).width(75).textAlign(TextAlign.Center).fontColor(Color.Red)
                Text(item.quoteData.range).width(75).textAlign(TextAlign.Center).fontColor(Color.Red)
                Text(`第三列`).width(75).textAlign(TextAlign.Center).fontColor(Color.Green)
                Text(`第四列`).width(75).textAlign(TextAlign.Center)
                Text(`第五列`).width(75).textAlign(TextAlign.Center).fontColor(Color.Green)
                Text(`第六列`).width(75).textAlign(TextAlign.Center)
                Text(`第七列`).width(75).textAlign(TextAlign.Center)
              }
              .height(60)
            }
          })
        }
        .onTouch(() => this.flag = false)
        .onScrollFrameBegin((offset: number) => {
          if (!this.flag) {
            this.leftScroller.scrollBy(0, offset)
          }
          return { offsetRemain: offset };
        })
        .width(525)
        .height('100%')
        .scrollBar(BarState.Off)
        .edgeEffect(EdgeEffect.None)
      }
      .scrollBar(BarState.Off)
      .layoutWeight(1)
      .scrollable(ScrollDirection.Horizontal)
      .height('100%')
    }
    .width("100%")
    .height("100%")
  }
}
