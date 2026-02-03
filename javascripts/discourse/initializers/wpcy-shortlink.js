import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.0.0", (api) => {
    const shortDomain = settings.short_domain || "wpcy.com";
    const buttonLabel = settings.button_label || "复制短链";

    api.addTopicFooterButton({
        id: "copy-shortlink",
        icon: "link",
        label: buttonLabel,
        title: "复制短链接到剪贴板",

        action() {
            const topicId = this.topic?.id;
            if (!topicId) return;

            const shortUrl = `https://${shortDomain}/t/${topicId}`;

            navigator.clipboard.writeText(shortUrl).then(() => {
                // 临时修改按钮文字
                const btn = document.querySelector(".copy-shortlink-btn");
                if (btn) {
                    const label = btn.querySelector(".d-button-label");
                    if (label) {
                        const original = label.textContent;
                        label.textContent = "已复制!";
                        setTimeout(() => {
                            label.textContent = original;
                        }, 1500);
                    }
                }
            }).catch(() => {
                // Fallback
                const input = document.createElement("input");
                input.value = shortUrl;
                document.body.appendChild(input);
                input.select();
                document.execCommand("copy");
                document.body.removeChild(input);
                alert("已复制: " + shortUrl);
            });
        },

        classNames: ["copy-shortlink-btn"],
        dependentKeys: ["topic.id"],
        displayed() {
            return !!this.topic?.id;
        }
    });
});
