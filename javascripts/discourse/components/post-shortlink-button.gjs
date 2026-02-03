import Component from "@glimmer/component";
import { action } from "@ember/object";
import { service } from "@ember/service";
import ShortlinkModal from "./modal/shortlink-modal";

export default class PostShortlinkButton extends Component {
  @service modal;

  get shortDomain() {
    return settings.short_domain || "wpcy.com";
  }
  
  get isFirstPost() {
    return this.args.outletArgs?.post?.post_number === 1;
  }
  
  get topicId() {
    return this.args.outletArgs?.post?.topic_id;
  }

  @action
  showShortlinkModal() {
    if (!this.topicId) return;
    
    const shortUrl = `https://${this.shortDomain}/t/${this.topicId}`;
    
    this.modal.show(ShortlinkModal, {
      model: { shortUrl: shortUrl }
    });
  }

  <template>
    {{#if this.isFirstPost}}
      <div class="post-shortlink-container" style="margin-top: 10px; border-top: 1px solid var(--primary-low); padding-top: 10px;">
        <DButton
          @action={{this.showShortlinkModal}}
          @icon="share-nodes"
          @label="wpcy_shortlink.button_label"
          @title="wpcy_shortlink.button_title"
          class="btn-default share-shortlink-btn"
        />
      </div>
    {{/if}}
  </template>
}
