import formInfo from '@ohos.app.form.formInfo';
import formBindingData from '@ohos.app.form.formBindingData';
import FormExtensionAbility from '@ohos.app.form.FormExtensionAbility';
import formProvider from '@ohos.app.form.formProvider';

export default class EntryFormAbility extends FormExtensionAbility {
  onAddForm(want) {
    // Called to return a FormBindingData object.
    // let formData = {};
    // 在入参want中可以取出卡片的唯一标识：formId
    let formId: string = want.parameters[formInfo.FormParam.IDENTITY_KEY];
    // 使用方创建卡片时触发，提供方需要返回卡片数据绑定类
    let obj = {
      'title': 'titleOnAddForm',
      'detail': 'detailOnAddForm'
    };
    return formBindingData.createFormBindingData(obj);
  }

  onCastToNormalForm(formId) {
    // Called when the form provider is notified that a temporary form is successfully
    // converted to a normal form.
    // 使用方将临时卡片转换为常态卡片触发，提供方需要做相应的处理
    console.info(`[EntryFormAbility] onCastToNormalForm, formId: ${formId}`);
  }

  onUpdateForm(formId) {
    // Called to notify the form provider to update a specified form.
    // 若卡片支持定时更新/定点更新/卡片使用方主动请求更新功能，则提供方需要重写该方法以支持数据更新
    console.info('[EntryFormAbility] onUpdateForm');
    let obj = {
      'title': 'titleOnUpdateForm',
      'detail': 'detailOnUpdateForm'
    };
    let formData = formBindingData.createFormBindingData(obj);
    formProvider.updateForm(formId, formData).catch((err) => {
      if (err) {
        // 异常分支打印
        console.error(`[EntryFormAbility] Failed to updateForm. Code: ${err.code}, message: ${err.message}`);
        return;
      }
    });
  }

  onChangeFormVisibility(newStatus) {
    // Called when the form provider receives form events from the system.
    // 需要配置formVisibleNotify为true，且为系统应用才会回调
    console.info('[EntryFormAbility] onChangeFormVisibility');
  }

  onFormEvent(formId, message) {
    // Called when a specified message event defined by the form provider is triggered.
    // 若卡片支持触发事件，则需要重写该方法并实现对事件的触发
    console.info('[EntryFormAbility] onFormEvent');
  }

  onRemoveForm(formId) {
    // Called to notify the form provider that a specified form has been destroyed.
    // 当对应的卡片删除时触发的回调，入参是被删除的卡片ID
    console.info('[EntryFormAbility] onRemoveForm');
  }

  onAcquireFormState(want) {
    // Called to return a {@link FormState} object.
    // 卡片提供方接收查询卡片状态通知接口，默认返回卡片初始状态。
    return formInfo.FormState.READY;
  }
};