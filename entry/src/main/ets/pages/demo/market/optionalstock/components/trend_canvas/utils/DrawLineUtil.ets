import { Size } from '@kit.ArkUI';

export class DrawLineUtil {
  /**
   计算最大差值，计算maxValue和minValue同reference比较后的大的差值；若两个值都为0，直接返回默认2
   取绝对值返回，不会出现负数

   @param baseValue 参考值，昨收价
   @param maxValue 最大值
   @param minValue 最小值
   @return 最大差值，对应坐标轴Y轴的一半
   */
  static getMaxPriceDiff(baseValue: number, maxValue: number, minValue: number): number {
    if (maxValue == 0 && minValue == 0) {
      return 2
    }
    let maxDiff: number = Math.max(Math.abs(maxValue - baseValue), Math.abs(baseValue - minValue))
    return maxDiff
  }

  /**
   将区域差值转换成具体的屏幕坐标

   @param drawRect 显示的区域
   @param priceDiff 最新价 减 昨收价, 正或负
   @param maxDiff 最大绘制区间
   @return 屏幕坐标
   */
  static getPosYFromFrame(drawSize: Size, priceDiff: number, maxDiff: number): number {
    if (maxDiff == 0) {
        return drawSize.height * 0.5
    }

    if (priceDiff > maxDiff) {
        return 0
    }

    let fPos = drawSize.height * priceDiff / maxDiff
    if (drawSize.height * 0.5 - fPos > drawSize.height) {
        return drawSize.height
    }
    return drawSize.height * 0.5 - fPos
  }
}
