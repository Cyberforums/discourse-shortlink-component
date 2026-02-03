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
        // 尝试从不同的地方获取 topic
        const topic = this.topic || (this.args && this.args.topic) || (this.outletArgs && this.outletArgs.topic);

        if (!topic || !topic.id) {
          console.error("WPCY Shortlink: Cannot find topic ID", this);
          alert("无法获取话题 ID");
          return;
        }

        const topicId = topic.id;
        const shortUrl = `https://${shortDomain}/t/${topicId}`;

        console.log("WPCY Shortlink: Copying", shortUrl);

        const doCopy = () => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(shortUrl);
          } else {
            const textArea = document.createElement("textarea");
            textArea.value = shortUrl;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
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
          // 尝试多种方式显示成功消息
          if (this.appEvents) {
            this.appEvents.trigger("discourse:flash-message", {
              type: "success",
              message: `已复制: ${shortUrl}`
            });
          } else if (api.container) {
            const appEvents = api.container.lookup("service:app-events");
            if (appEvents) {
              appEvents.trigger("discourse:flash-message", {
                type: "success",
                message: `已复制: ${shortUrl}`
              });
            } else {
              alert(`已复制: ${shortUrl}`);
            }
          } else {
            // 最后的降级方案：临时改变按钮文字
            // 注意：这可能不会触发重新渲染，取决于 Discourse 版本
            alert(`已复制: ${shortUrl}`);
          }
        }).catch((err) => {
          console.error("WPCY Shortlink: Copy failed", err);
          prompt("复制失败，请手动复制：", shortUrl);
        });
      },

      classNames: ["share-shortlink-btn"],
      displayed() {
        return true;
      }
    });
  }
});
