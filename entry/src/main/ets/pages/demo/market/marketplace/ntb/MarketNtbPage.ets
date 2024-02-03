/**
 @author: XWANG
 @date: 2024/2/3
 @description: 市场-新三板-new third block
 */

@Component
export struct MarketNtbPage {
  build() {
    Column(){
      Text("新三板").fontSize(15)
        .height(50)
        .fontWeight(500)
        .textAlign(TextAlign.Center)
    }.height("100%").width("100%").backgroundColor("#941129")
  }
}