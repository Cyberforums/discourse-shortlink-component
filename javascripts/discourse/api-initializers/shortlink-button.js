import { apiInitializer } from "discourse/lib/api";
import I18n from "discourse-i18n";

export default apiInitializer("0.11.1", (api) => {
  const shortDomain = settings.short_domain || "wpcy.com";

  // 使用翻译键，但在设置中允许覆盖
  // 如果 settings.button_label 和默认值不同，我们需要动态覆盖翻译或者直接使用
  // 为了简单，我们优先使用翻译键
  const buttonLabelKey = "wpcy_shortlink.copy_button";
  const buttonTitleKey = "wpcy_shortlink.copy_title";

  if (api.registerTopicFooterButton) {
    api.registerTopicFooterButton({
      id: "share-shortlink",
      icon: "link",
      priority: 250,

      // 使用翻译键
      label: buttonLabelKey,
      title: buttonTitleKey,

      action() {
        const topic = this.topic || (this.args && this.args.topic);
        if (!topic || !topic.id) return;

        const topicId = topic.id;
        const shortUrl = `https://${shortDomain}/t/${topicId}`;

        const doCopy = () => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(shortUrl);
          } else {
            const textArea = document.createElement("textarea");
            textArea.value = shortUrl;
            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.select();
            try {
              document.execCommand('copy');
              return Promise.resolve();
            } catch (err) {
              return Promise.reject(err);
            } finally {
              document.body.removeChild(textArea);
            }
          }
        };

        doCopy().then(() => {
          // 使用 api.container 获取服务，确保兼容性
          const container = api.container;

          // 尝试多种与用户交互的方式

          // 1. Flash Message (首选)
          const message = I18n.t("wpcy_shortlink.copied", { url: shortUrl });

          // 尝试通过 appEvents 触发
          if (this.appEvents) {
            this.appEvents.trigger("discourse:flash-message", {
              type: "success",
              message: message
            });
          }
          // 尝试通过 dialog 服务
          else if (container) {
            const dialog = container.lookup("service:dialog");
            if (dialog) {
              dialog.alert(message);
            } else {
              // 最后的手段
              alert(message);
            }
          } else {
            alert(message);
          }

        }).catch(() => {
          prompt(I18n.t("wpcy_shortlink.copy_failed"), shortUrl);
        });
      },

      classNames: ["share-shortlink-btn"],
      displayed() {
        return true;
      }
    });
  }
});
