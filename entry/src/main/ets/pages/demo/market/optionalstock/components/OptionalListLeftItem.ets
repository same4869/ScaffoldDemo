import { StockCellModelItem } from './trend_canvas/viewmodel/InitialData'

@Component
export default struct OptionalListLeftItem {
  @Prop item: StockCellModelItem

  build() {
    Column() {
      Text(this.item.quoteData.stockName).width('100%')
      Text(this.item.quoteData.stockCode).width('100%').fontColor(Color.Gray)
    }
    .justifyContent(FlexAlign.SpaceEvenly)
    .width('100%')
    .height('100%')
  }
}
