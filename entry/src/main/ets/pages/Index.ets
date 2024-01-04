import { MLog, MPreferencesUtil, MToast } from '@app/commlib'
import { MLoadingDialog, MCommDialog } from '@app/uilib'

@Entry
@Component
struct Index {
  @State message: string = 'Hello World'
  @State loadingTips: string = "加载中..."
  @State loadingShow: boolean = false

  //全局的loading
  loadingDialogController: CustomDialogController = new CustomDialogController({
    builder: MLoadingDialog({ loadingTips: this.loadingTips }),
    autoCancel: true,
    gridCount: 2,
    cancel: () => {
      this.loadingShow = false
    }
  })
  @State dialogTitle: Resource = $r('app.string.dialog_about_title')
  @State dialogContent: Resource = $r('app.string.project_desc')
  dialogController: CustomDialogController = new CustomDialogController({
    builder: MCommDialog({ title: $dialogTitle, description: $dialogContent, showPositive: false })
  })
  dialogController2: CustomDialogController = new CustomDialogController({
    builder: MCommDialog({
      title: $dialogTitle,
      description: $dialogContent,
      showPositive: false,
      contentBuilder: GlobalBuilder1
    })
  })

  aboutToAppear() {
    MLog.init({
      tag: "demo2"
    })

    MLog.debug("2333333")

    this.loadingShow = true
    this.loadingDialogController.open()
  }

  build() {
    Row() {
      Column() {
        Text(this.message)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
        Button("click toast").fontSize('16vp').onClick(
          () => {
            MToast.showToast("hahahah")
            this.loadingDialogController.close()
            this.loadingShow = false
          }
        )
        Row() {
          Button("save sp").fontSize('16vp').onClick(() => {
            MPreferencesUtil.put("key1", "1234")
          })
          Button("load sp").fontSize('16vp').margin('5vp').onClick(() => {
            MPreferencesUtil.get("key1").then((ret) => {
              MLog.debug("ret : %{public}s" + ret)
              this.message = ret as string
            })
          })
        }

        Row() {
          Button("showCusDia1").fontSize('16vp').onClick(() => {
            this.dialogController.open()
          })
          Button("showCusDia2").fontSize('16vp').onClick(() => {
            this.dialogController2.open()
          })
        }
      }
      .width('100%')
    }
    .height('100%')
  }
}

@Builder function GlobalBuilder1() {
  Column() {
    Text('自定义dialog')
      .width(400)
      .height(50)
      .backgroundColor(Color.Green)
  }
}