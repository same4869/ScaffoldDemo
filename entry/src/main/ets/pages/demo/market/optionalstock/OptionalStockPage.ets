/**
 @author: XWANG
 @date: 2024/2/2
 @description: 自选股首页
 */
import StockListView from './components/StockListView'
import StockIndexInfo from './stocklist/StockIndexInfo'
import StockIndexTop from './stocklist/StockIndexTop'

@Component
export struct OptionalStockPage {
  @State indexExpanded: boolean = false

  build() {
    Column() {

      Column() {
        StockIndexTop({indexExpanded: $indexExpanded})

        if (this.indexExpanded) {
          StockIndexInfo()
        }

        StockListView()
      }
      .backgroundColor(0xFFFFFF)
      .borderRadius(10)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(0xF2F4F7)
  }
}