/**
 @author: XWANG
 @date: 2024/1/11
 @description: 市场-沪深京首页
 */

@Component
export struct MarketHuShenJingPage {
  build() {
    Column(){
      Text("沪深京").fontSize(15)
        .height(50)
        .fontWeight(500)
        .textAlign(TextAlign.Center)
    }.height("100%").width("100%").backgroundColor("#34d1d9")
  }
}