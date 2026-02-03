import { apiInitializer } from "discourse/lib/api";
import I18n from "discourse-i18n";
import ShortlinkFooterButton from "../components/shortlink-footer-button";
import PostShortlinkButton from "../components/post-shortlink-button";

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

  // 1. 话题底部按钮 (Create Reply 之前) - 大按钮
  api.renderInOutlet("topic-footer-main-buttons-before-create", ShortlinkFooterButton);

  // 2. 主贴内容下方 - 小按钮 (确保全员可见)
  // 使用 post-after-cooked outlet，它在帖子内容之后，操作菜单之前
  api.renderInOutlet("post-after-cooked", PostShortlinkButton);
});
