import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
  const shortDomain = settings.short_domain || "wpcy.com";
  const buttonLabel = settings.button_label || "复制短链";

  if (api.registerTopicFooterButton) {
    api.registerTopicFooterButton({
      id: "share-shortlink",
      icon: "link",
      priority: 250,
      label: buttonLabel,
      title: "复制短链接到剪贴板",
      action() {
        const topicId = this.topic.id;
        const shortUrl = `https://${shortDomain}/t/${topicId}`;

        const doCopy = () => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(shortUrl);
          } else {
            // Unsecure context fallback
            const textArea = document.createElement("textarea");
            textArea.value = shortUrl;
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
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
          this.appEvents.trigger("discourse:flash-message", {
            type: "success",
            message: `已复制: ${shortUrl}`
          });
        }).catch(() => {
          prompt("请手动复制：", shortUrl);
        });
      },
      classNames: ["share-shortlink-btn"],
      displayed() {
        return true;
      }
    });
  } else {
    console.warn("WPCY Shortlink: registerTopicFooterButton not available");
  }
});
