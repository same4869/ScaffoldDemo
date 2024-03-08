import { TrendPriceItemList } from '../model/ResponseModel'


export class StockDataItem {
  stockName: string = ''
  stockCode: string = ''
  price: string = ''
  change: string = ''
  range: string = ''

  constructor(stockName: string, stockCode: string, price: string, change: string, range: string) {
    this.stockName = stockName;
    this.stockCode = stockCode;
    this.price = price;
    this.change = change;
    this.range = range;
  }
}

export class StockCellModelItem {
  quoteData: StockDataItem
  trendListModel: TrendPriceItemList

  constructor(quote: StockDataItem, trend: TrendPriceItemList) {
    this.quoteData = quote
    this.trendListModel = trend
  }
}

export const stocksInitialList: StockDataItem[] = [
  new StockDataItem('荣联科技', '002642', '4.37', '-0.13', '-2.89%'),
  new StockDataItem('九联科技', '688609', '6.64', '-0.07', '-1.42%'),
]

// export const jsonDataStr = TrendDataModel.loadLocalJsonFileSync('data_list');

export const colors = ["#EC3529", "#2FC25B", "#FACC14", "#223273", "#8543E0", "#13C2C2", "#3436C7", "#F04864", "#cccccc"]

export class PointItem {
  date: string = ''
  value: number = 0
}

export interface Point {
  x: number
  y: number
}
