/**
 @author: XWANG
 @date: 2024/1/11
 @description: 市场-沪深京首页
 */
import { TopIndexCardComp } from './components/TopIndexCardComp'

@Component
export struct MarketHuShenJingPage {
  build() {
    Column() {
      //   Text("沪深京").fontSize(15)
      //     .height(50)
      //     .fontWeight(500)
      //     .textAlign(TextAlign.Center)
      Scroll() {
        Row({ space: 10 }) {
          TopIndexCardComp()
          TopIndexCardComp()
          TopIndexCardComp()
          TopIndexCardComp()
          TopIndexCardComp()
        }.padding({ top: 8, bottom: 8 })
      }
      .scrollable(ScrollDirection.Horizontal)
      .scrollBar(BarState.Off)
      .padding({ left: 16, right: 16, bottom: 12 })
      .edgeEffect(EdgeEffect.Spring)

    }.height("100%").width("100%").backgroundColor("#f4f4f4")
  }
}