/**
 @author: XWANG
 @date: 2024/1/11
 @description: 理财
 */
import { BaseWebComponent } from '../components/web/BaseWebComponent'

@Component
export struct FinancePage {
  build() {
    Stack(){
      BaseWebComponent({src:"https://fmall.hfzq.com.cn/index.html#/fundIndex"})
    }
    .height("100%").width("100%")
  }
}