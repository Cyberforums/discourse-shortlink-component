import { apiInitializer } from "discourse/lib/api";
import I18n from "discourse-i18n";
import ShortlinkModal from "../components/modal/shortlink-modal";

export default apiInitializer("0.11.1", (api) => {
  const shortDomain = settings.short_domain || "wpcy.com";

  // 动态注入翻译 - 使用更健壮的方式
  const translations = {
    zh_CN: {
      wpcy_shortlink: {
        button_label: "短链接",
        button_title: "获取本话题短链接"
      }
    },
    en: {
      wpcy_shortlink: {
        button_label: "Short Link",
        button_title: "Get short link for this topic"
      }
    }
  };

  try {
    if (I18n.translations) {
      Object.keys(translations).forEach(lang => {
        if (!I18n.translations[lang]) I18n.translations[lang] = {};
        Object.assign(I18n.translations[lang], translations[lang]);
      });
    }

    // 如果 I18n.extras 存在也注入
    if (I18n.extras) {
      Object.keys(translations).forEach(lang => {
        if (!I18n.extras[lang]) I18n.extras[lang] = {};
        Object.assign(I18n.extras[lang], translations[lang]);
      });
    }
  } catch (e) {
    console.warn("WPCY Shortlink: Translation injection failed", e);
  }

  if (api.registerTopicFooterButton) {
    api.registerTopicFooterButton({
      id: "share-shortlink",
      icon: "link",
      priority: 250,

      // 使用我们刚刚注入的键
      label: "wpcy_shortlink.button_label",
      title: "wpcy_shortlink.button_title",

      action() {
        const topic = this.topic || (this.args && this.args.topic);
        if (!topic || !topic.id) return;

        const shortUrl = `https://${shortDomain}/t/${topic.id}`;

        // 使用 showModal 服务显示弹窗
        // api.container 或 this.container
        const modal = api.container.lookup("service:modal");
        modal.show(ShortlinkModal, {
          model: { shortUrl: shortUrl }
        });
      },

      classNames: ["share-shortlink-btn"],
      displayed() {
        return true;
      }
    });
  }
});
