/**
 @author: XWANG
 @date: 2024/2/3
 @description: 市场-科创板
 */

@Component
export struct MarketTechPage {
  build() {
    Column(){
      Text("科创板").fontSize(15)
        .height(50)
        .fontWeight(500)
        .textAlign(TextAlign.Center)
    }.height("100%").width("100%").backgroundColor("#1491d9")
  }
}