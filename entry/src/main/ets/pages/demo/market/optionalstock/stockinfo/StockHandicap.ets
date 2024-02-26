import UpdownsBarWidget from '../painter/UpdownsBarWidget'

@Component
export default struct StockHandicap {
  build() {
    Column({space: 8}) {
      this.StockHandicapItem('成交额', '2905.97亿')
      this.StockHandicapItem('成交量', '2.75亿')
      this.StockHandicapItem('涨家数', '1517', '#EC3529')
      this.StockHandicapItem('跌家数', '686', '#10A361')
      this.StockHandicapItem('平家数', '62', '#999999')

      UpdownsBarWidget()
        .width('100%')
        .height(4)
    }
    .width(124)
    .height('100%')
    .padding({top: 10, left: 12, right: 12})
  }

  @Builder StockHandicapItem(title: string, value: string, color: ResourceColor = '#222222') {
    Row() {
      Text(title)
        .fontSize(12)
        .fontColor('#666666')

      Blank()

      Text(value)
        .fontSize(12)
        .fontColor(color)
    }
    .width('100%')
    .height(17)
  }
}