import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import DModal from "discourse/components/d-modal";
import DButton from "discourse/components/d-button";

export default class ShortlinkModal extends Component {
  @tracked copied = false;
  
  get fullUrl() {
    return this.args.model.shortUrl;
  }
  
  get displayUrl() {
    return this.fullUrl.replace(/^https?:\/\//, '');
  }

  @action
  copy() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.fullUrl);
    } else {
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = this.fullUrl;
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
    <DModal @title="wpcy_shortlink.modal_title" @closeModal={{@closeModal}} class="shortlink-modal">
      <:body>
        <div class="shortlink-modal-body">
          <input type="text" value={{this.displayUrl}} readonly class="shortlink-input" />
        </div>
      </:body>
      <:footer>
        <DButton
          @label={{if this.copied "wpcy_shortlink.copied_label" "wpcy_shortlink.copy_label"}}
          @icon={{if this.copied "check" "copy"}}
          @action={{this.copy}}
          class="btn-primary"
        />
        <DButton
          @label="wpcy_shortlink.close_label"
          @action={{@closeModal}}
          class="btn-flat"
        />
      </:footer>
    </DModal>
  </template>
}
