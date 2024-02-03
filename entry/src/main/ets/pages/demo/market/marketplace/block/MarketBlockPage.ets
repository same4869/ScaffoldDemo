/**
 @author: XWANG
 @date: 2024/1/11
 @description: 市场-板块首页
 */

@Component
export struct MarketBlockPage {
  build() {
    Column(){
      Text("板块").fontSize(15)
        .height(50)
        .fontWeight(500)
        .textAlign(TextAlign.Center)
    }.height("100%").width("100%").backgroundColor("#9411d9")
  }
}