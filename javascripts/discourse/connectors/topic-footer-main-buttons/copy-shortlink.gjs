import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import DButton from "discourse/components/d-button";

export default class CopyShortlink extends Component {
  @tracked copied = false;
  
  get shortUrl() {
    const domain = settings.short_domain || "wpcy.com";
    const topicId = this.args.outletArgs?.topic?.id;
    return topicId ? `https://${domain}/t/${topicId}` : null;
  }
  
  get buttonLabel() {
    return this.copied ? "已复制!" : (settings.button_label || "复制短链");
  }
  
  @action
  copyShortlink() {
    if (!this.shortUrl) return;
    
    navigator.clipboard.writeText(this.shortUrl).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 1500);
    }).catch(() => {
      const input = document.createElement("input");
      input.value = this.shortUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 1500);
    });
  }
  
  <template>
    {{#if this.shortUrl}}
      <DButton
        @action={{this.copyShortlink}}
        @icon={{if this.copied "check" "link"}}
        @label={{this.buttonLabel}}
        class="btn-default copy-shortlink-btn"
      />
    {{/if}}
  </template>
}
