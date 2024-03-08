import { stocksInitialList, StockDataItem, StockCellModelItem } from './InitialData';

import {ListItem, TrendPriceItemList} from '../model/ResponseModel';

/**
 * create a List range
 */
export const createListRange = (): StockCellModelItem[] => {
  console.log(globalThis.trendListItemModel.length.toString())
  let primitiveArr: ListItem[] = globalThis.trendListItemModel

  let result: StockCellModelItem[] = primitiveArr.map((item) => {
    let trendList:TrendPriceItemList = TrendPriceItemList.parseTrendPriceBytes(
      item.dictReturn.LINENEWPRICEINDEX.tztValue)
    let quote = new StockDataItem(item.stockInfo.stockName, item.stockInfo.stockCode, item.dictReturn.NewPriceIndex.tztValue, item.dictReturn.UpDownIndex.tztValue, item.dictReturn.UpDownPIndex.tztValue)
    return new StockCellModelItem(quote, trendList)
  })

  return result;
}

/**
 * LazyLoad Class
 */
class BasicDataSource implements IDataSource {
  private listeners: DataChangeListener[] = [];

  public totalCount(): number {
    return 0;
  }

  public getData(index: number): StockCellModelItem | undefined {
    return undefined;
  }

  registerDataChangeListener(listener: DataChangeListener): void {
    if (this.listeners.indexOf(listener) < 0) {
      this.listeners.push(listener);
    }
  }

  unregisterDataChangeListener(listener: DataChangeListener): void {
    const position = this.listeners.indexOf(listener);
    if (position >= 0) {
      this.listeners.splice(position, 1);
    }
  }

  notifyDataReload(): void {
    this.listeners.forEach((listener: DataChangeListener) => {
      listener.onDataReloaded();
    })
  }

  notifyDataAdd(index: number): void {
    this.listeners.forEach((listener: DataChangeListener) => {
      listener.onDataAdd(index);
    })
  }

  notifyDataChange(index: number): void {
    this.listeners.forEach((listener: DataChangeListener) => {
      listener.onDataChange(index);
    })
  }

  notifyDataDelete(index: number): void {
    this.listeners.forEach((listener: DataChangeListener) => {
      listener.onDataDelete(index);
    })
  }

  notifyDataMove(from: number, to: number): void {
    this.listeners.forEach((listener: DataChangeListener) => {
      listener.onDataMove(from, to);
    })
  }
}

export class ListDataSource extends BasicDataSource {
  private listData = createListRange();

  public totalCount(): number {
    return this.listData.length;
  }

  public getData(index: number): StockCellModelItem {
    return this.listData[index];
  }

  public pushData(): void {
  }
}
