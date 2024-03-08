import { MLog } from '@app/commlib/src/main/ets/log/MLog';
import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import hilog from '@ohos.hilog';
import window from '@ohos.window';
import util from '@ohos.util';
import { ListResponse } from '../pages/demo/market/optionalstock/components/trend_canvas/model/ResponseModel';

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onCreate');
  }

  onDestroy() {
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onDestroy');
  }

  onWindowStageCreate(windowStage: window.WindowStage) {
    // Main window is created, set main page for this ability
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageCreate');

    windowStage.loadContent('pages/Index', (err, data) => {
      if (err.code) {
        hilog.error(0x0000, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err) ?? '');
        return;
      }
      hilog.info(0x0000, 'testTag', 'Succeeded in loading the content. Data: %{public}s', JSON.stringify(data) ?? '');
    });
    let files = this.context.resourceManager.getRawFileListSync("") // 返回rawfile资源列表
    let trendDataArr: Uint8Array = this.context.resourceManager.getRawFileContentSync("trend_data.json")

    let textDecoder = util.TextDecoder.create("utf-8",{ignoreBOM: true});
    let retStr = textDecoder.decodeWithStream(trendDataArr, {stream: false});

    let rawJson: Record<string, Object> = JSON.parse(retStr)
    let jsonModel: ListResponse = JSON.parse(retStr)
    globalThis.trendListItemModel = jsonModel.ayContents
  }

  onWindowStageDestroy() {
    // Main window is destroyed, release UI related resources
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
  }

  onForeground() {
    // Ability has brought to foreground
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onForeground');
  }

  onBackground() {
    // Ability has back to background
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onBackground');
  }
}
