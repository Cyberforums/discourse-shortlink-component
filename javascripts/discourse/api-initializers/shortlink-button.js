import { apiInitializer } from "discourse/lib/api";
import { h } from "virtual-dom";
import { later } from "@ember/runloop";

export default apiInitializer("0.11.1", (api) => {
  const shortDomain = settings.short_domain || "wpcy.com";

  api.createWidget("shortlink-display", {
    tagName: "div.shortlink-container",

    buildKey: (attrs) => `shortlink-display-${attrs.topicId}`,

    defaultState() {
      return { copied: false };
    },

    html(attrs, state) {
      const shortUrl = `https://${shortDomain}/t/${attrs.topicId}`;

      return [
        h("span.shortlink-label", "短链:"),
        h(
          "code.shortlink-url",
          {
            attributes: { title: "点击复制" },
            className: state.copied ? "copied" : null,
            onclick: () => this.sendWidgetAction("copyShortlink", { shortUrl }),
          },
          state.copied ? "已复制!" : shortUrl
        ),
      ];
    },

    copyShortlink({ shortUrl }) {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(shortUrl);
      }

      this.state.copied = true;
      this.scheduleRerender();

      later(() => {
        this.state.copied = false;
        this.scheduleRerender();
      }, 1500);
    },
  });

  api.decorateWidget("topic-title:after", (helper) => {
    const topic = helper.getModel();
    if (!topic || !topic.id) return;

    return helper.attach("shortlink-display", { topicId: topic.id });
  });
});
