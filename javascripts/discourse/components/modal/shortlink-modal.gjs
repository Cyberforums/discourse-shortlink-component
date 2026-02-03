import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import DModal from "discourse/components/d-modal";
import DButton from "discourse/components/d-button";

export default class ShortlinkModal extends Component {
  @tracked copied = false;
  
  get shortUrl() {
    return this.args.model.shortUrl;
  }

  @action
  copy() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.shortUrl);
    } else {
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = this.shortUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
    
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }

  <template>
    <DModal @title="话题短链接" @closeModal={{@closeModal}} class="shortlink-modal">
      <:body>
        <div class="shortlink-modal-body">
          <input type="text" value={{this.shortUrl}} readonly class="shortlink-input" />
        </div>
      </:body>
      <:footer>
        <DButton
          @label={{if this.copied "已复制" "复制链接"}}
          @icon={{if this.copied "check" "copy"}}
          @action={{this.copy}}
          class="btn-primary"
        />
        <DButton
          @label="关闭"
          @action={{@closeModal}}
          class="btn-flat"
        />
      </:footer>
    </DModal>
  </template>
}
