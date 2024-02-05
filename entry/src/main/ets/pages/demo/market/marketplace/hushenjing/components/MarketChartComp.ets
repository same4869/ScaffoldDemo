/**
 @author: XWANG
 @date: 2024/2/3
 @description: 市场-沪深京首页-涨跌分布，主力净流入，北向资金这些图表
 */

@Component
export struct MarketChartComp {
  build() {
    Column() {
      Row() {
        Text("开盘中")
          .fontSize(22)
          .fontColor($r("app.color.color_black"))
          .align(Alignment.Start)

        Text("收起")
          .fontSize(16)
          .fontSize($r("app.color.color_777"))
          .margin({ left: 4 })

        Blank()

        Row() {
          Text("沪深成交额：8057亿 >")
            .fontSize(18)
            .fontSize($r("app.color.color_555"))
        }
      }.width("100%")
    }.width("100%")
    .backgroundColor($r("app.color.color_white"))
    .borderRadius(8)
    .padding(16)
  }
}