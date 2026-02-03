import { apiInitializer } from "discourse/lib/api";
import I18n from "discourse-i18n";
import ShortlinkFooterButton from "../components/shortlink-footer-button";
import ShortlinkModal from "../components/modal/shortlink-modal";

export default apiInitializer("0.11.1", (api) => {
  // 动态注入翻译
  const translations = {
    zh_CN: {
      wpcy_shortlink: {
        button_label: "短链接",
        button_title: "获取本话题短链接",
        modal_title: "话题短链接",
        copy_label: "复制链接",
        copied_label: "已复制",
        close_label: "关闭"
      }
    },
    en: {
      wpcy_shortlink: {
        button_label: "Short Link",
        button_title: "Get short link for this topic",
        modal_title: "Topic Short Link",
        copy_label: "Copy Link",
        copied_label: "Copied",
        close_label: "Close"
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
    if (I18n.extras) {
      Object.keys(translations).forEach(lang => {
        if (!I18n.extras[lang]) I18n.extras[lang] = {};
        Object.assign(I18n.extras[lang], translations[lang]);
      });
    }
  } catch (e) {
    console.warn("WPCY Shortlink: Translation injection failed", e);
  }

  // 渲染到话题底部按钮区域 (在回复、通知等按钮旁边)
  // 这个 outlet 通常对所有用户可见
  // 渲染到话题底部按钮区域 (主要位置)
  api.renderInOutlet("topic-footer-main-buttons-before-create", ShortlinkFooterButton);

  // 额外添加：在主楼的帖子菜单中显示小图标 (确保未登录用户可见)
  if (api.addPostMenuButton) {
    api.addPostMenuButton("wpcy-shortlink", (attrs) => {
      if (attrs.post_number !== 1) return;
      return {
        action: "showShortlinkModal",
        icon: "share-nodes",
        className: "share-shortlink-menu-btn",
        title: "wpcy_shortlink.button_title",
        position: "first"
      };
    });

    api.attachWidgetAction("post-menu", "showShortlinkModal", function () {
      const topicId = this.model.topic_id;
      if (!topicId) return;

      const shortDomain = settings.short_domain || "wpcy.com";
      const shortUrl = `https://${shortDomain}/t/${topicId}`;

      const modal = api.container.lookup("service:modal");
      modal.show(ShortlinkModal, {
        model: { shortUrl: shortUrl }
      });
    });
  }
});
