import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { later } from "@ember/runloop";

export default class ShortlinkDisplay extends Component {
  @tracked copied = false;

  get shortUrl() {
    const shortDomain = settings?.short_domain || "wpcy.com";
    const topicId = this.args?.outletArgs?.topic?.id;
    if (!topicId) {
      return null;
    }
    return `https://${shortDomain}/t/${topicId}`;
  }

  @action
  copyShortlink() {
    const shortUrl = this.shortUrl;
    if (!shortUrl) {
      return;
    }
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shortUrl);
    }

    this.copied = true;
    later(() => {
      this.copied = false;
    }, 1500);
  }
}

<template>
  {{#if this.shortUrl}}
    <div class="shortlink-container">
      <span class="shortlink-label">短链:</span>
      <code
        class={{if this.copied "shortlink-url copied" "shortlink-url"}}
        title="点击复制"
        {{on "click" this.copyShortlink}}
      >
        {{if this.copied "已复制!" this.shortUrl}}
      </code>
    </div>
  {{/if}}
</template>
