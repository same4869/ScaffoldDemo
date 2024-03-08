import util from '@ohos.util';
export interface BaseResponse {
  message: string
  statusCode: number
}
export interface ListResponse extends BaseResponse {
  ayContents: ListItem[]
  ayTitles: AyTitle[]
  indexDict: IndexDict
  nsDownCount: string
  nsFlatCount: string
  nsRiseCount: string
  qtyTotalNum: number
  rankNum: number
  startPos: number
  totals: number
}

export interface ListItem {
  dictReturn: DictReturn
  stockInfo: StockInfo
  stockValues: StockValue[]
}

export interface DictReturn {
  UpDownPIndex: UpDownPindex
  StockCodeIndex: StockCodeIndex
  "5": N5
  UpDownIndex: UpDownIndex
  StockNameIndex: StockNameIndex
  TotalMIndex: TotalMindex
  NewPriceIndex: NewPriceIndex
  LINENEWPRICEINDEX: Linenewpriceindex
}

export interface UpDownPindex {
  tztColorFlag: string
  tztColor: string
  tztKey: string
  tztValue: string
}

export interface StockCodeIndex {
  tztColorFlag: string
  tztColor: string
  tztKey: string
  tztValue: string
}

export interface N5 {
  tztColorFlag: string
  tztColor: string
  tztKey: string
  tztValue: string
}

export interface UpDownIndex {
  tztColorFlag: string
  tztColor: string
  tztKey: string
  tztValue: string
}

export interface StockNameIndex {
  tztColorFlag: string
  tztColor: string
  tztKey: string
  tztValue: string
}

export interface TotalMindex {
  tztColorFlag: string
  tztColor: string
  tztKey: string
  tztValue: string
}

export interface NewPriceIndex {
  tztColorFlag: string
  tztColor: string
  tztKey: string
  tztValue: string
}

export interface Linenewpriceindex {
  tztColorFlag: string
  tztColor: string
  tztKey: string
  tztValue: string
}

export interface StockInfo {
  propType: string
  sbStatus: string
  sbType: string
  status: string
  stockCode: string
  stockCommMode: number
  stockName: string
  stockProp: string
  stockType: number
}

export interface StockValue {
  tztColorFlag: string
  tztColor: string
  tztKey: string
  tztValue: string
}

export interface AyTitle {
  stockValues: StockValue2[]
}

export interface StockValue2 {
  tztColorFlag: string
  tztColor: string
  tztSortKey: string
  tztKey: string
  tztValue: string
}

export interface IndexDict {
  UPDOWNPTHISYEARINDEX: number
  UpDownIndex: number
  StockNameIndex: number
  LeadStockCodeIndex: number
  ShockRangeIndex: number
  TimeIndex: number
  UPDOWNPTHISWEEKINDEX: number
  UpDownPIndex: number
  TotalHPerIndex: number
  QuickUpDownPIndex: number
  UPDOWNPTHISMONTHINDEX: number
  YCLOSEPRICE: number
  LeadNewPriceIndex: number
  CONTUPINDEX: number
  TotalMIndex: number
  NewPriceIndex: number
  LINENEWPRICEINDEX: number
  ValueIndex: number
  TotalHIndex: number
  NameIndex: number
  LeadStockNameIndex: number
  StockCodeIndex: number
  MARKETSTATUSINDEX: number
  ChangePerIndex: number
  ZJLXRiseIndex: number
  LeadUpDownPIndex: number
}

export class TrendPriceItemList {
  nCount: number = 0 // 记录数，是到当前开盘分钟为止返回的记录数
  nPriceUnit: number = 0 // 价格单位，如：1000 表示单位“厘”，价格除以此值转为单位“元”
  nPreClose: number = 0 // 昨收价
  nMaxCount: number = 0 // 总记录数
  nHighPrice: number = 0 // 最高价
  nLowPrice: number = 0 // 最低价
  newPriceArr: number[] = []

  static getNumber(nData: Uint8Array, start: number, length: number): number {
    let value: number = 0
    let temp: number = 0
    for (let i = 0; i < length; i++) {
      temp = nData[start + i]
      value += ((temp >> 4 & 15) << 8 * i + 4) + ((temp & 15) << 8 * i)
    }
    return value
  }

  static parseTrendPriceBytes(dataStr: string): TrendPriceItemList {
    let priceItemList: TrendPriceItemList = new TrendPriceItemList()
    let base64Helper = new util.Base64Helper()
    const decodeDataArr: Uint8Array = base64Helper.decodeSync(dataStr)
    let index = 0
    while (decodeDataArr.length > index) {
      priceItemList.nCount = TrendPriceItemList.getNumber(decodeDataArr,index,4)
      index += 4;
      priceItemList.nPriceUnit = TrendPriceItemList.getNumber(decodeDataArr,index,4)
      index += 4;
      priceItemList.nPreClose = TrendPriceItemList.getNumber(decodeDataArr,index,4) / priceItemList.nPriceUnit
      index += 4;
      priceItemList.nMaxCount = TrendPriceItemList.getNumber(decodeDataArr,index,4)
      index += 4;
      priceItemList.nHighPrice = TrendPriceItemList.getNumber(decodeDataArr,index,4) / priceItemList.nPriceUnit
      index += 4;
      priceItemList.nLowPrice = TrendPriceItemList.getNumber(decodeDataArr,index,4) / priceItemList.nPriceUnit
      index += 4;
      let newPriceArr: number[] = []
      for (let i = 0; i < priceItemList.nCount; i++) {
        const lastPrice: number = TrendPriceItemList.getNumber(decodeDataArr, index, 8) / priceItemList.nPriceUnit
        newPriceArr.push(lastPrice)
        index += 8
      }
      priceItemList.newPriceArr = newPriceArr;
    }
    return priceItemList
  }
}