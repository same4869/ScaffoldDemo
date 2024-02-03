export class MarketPlaceViewModel {
  /**
   * 市场页面所有tab
   */
  marketTabList: MarketTabBean[] = [
    {
      name: "沪深京",
      value: 10
    },
    {
      name: "板块",
      value: 20
    },
    {
      name: "科创板",
      value: 30
    },
    {
      name: "创业板",
      value: 40
    },
    {
      name: "新三板",
      value: 50
    },
    {
      name: "港股",
      value: 60
    },
    {
      name: "全球",
      value: 70
    },
    {
      name: "更多",
      value: 80
    }
  ]
}

export class MarketTabBean {
  name: string = ""
  value: number = 0
}