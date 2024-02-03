/**
 @author: XWANG
 @date: 2024/2/3
 @description: 行情-市场-港股tab
 */

@Component
export struct MarketHkPage {
  build() {
    Column(){
      Text("港股").fontSize(15)
        .height(50)
        .fontWeight(500)
        .textAlign(TextAlign.Center)
    }.height("100%").width("100%").backgroundColor("#f99000")
  }
}