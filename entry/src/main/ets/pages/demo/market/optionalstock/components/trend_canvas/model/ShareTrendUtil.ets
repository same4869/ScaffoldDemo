import { ListItem } from './ResponseModel'

export default class ShareTrendUtil {
  private static instance: ShareTrendUtil;
  ayContents?: ListItem[]

  private constructor() {
  }

  public static getInstance() {
    if (!ShareTrendUtil.instance) {
      ShareTrendUtil.instance = new ShareTrendUtil();
    }

    return ShareTrendUtil.instance;
  }

  someMethod() {}
}