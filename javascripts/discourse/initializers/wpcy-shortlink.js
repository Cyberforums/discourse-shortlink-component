import { withPluginApi } from "discourse/lib/plugin-api";

export default {
    name: "wpcy-shortlink",

    initialize(container) {
        const siteSettings = container.lookup("service:site-settings");

        withPluginApi("1.0.0", (api) => {
            // Get settings from theme component
            const shortDomain = settings.short_domain || "wpcy.com";
            const buttonLabel = settings.button_label || "复制短链";

            // Add button to topic footer
            api.registerTopicFooterButton({
                id: "copy-shortlink",
                icon: "link",
                title: buttonLabel,

                action() {
                    const topic = this.topic;
                    if (!topic) return;

                    const topicId = topic.id;
                    const shortUrl = "https://" + shortDomain + "/t/" + topicId;

                    // Copy to clipboard
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(shortUrl).then(() => {
                            this.appEvents.trigger("discourse:flash-message", {
                                type: "success",
                                message: "已复制: " + shortUrl
                            });
                        });
                    } else {
                        // Fallback
                        const textarea = document.createElement("textarea");
                        textarea.value = shortUrl;
                        textarea.style.position = "fixed";
                        textarea.style.opacity = "0";
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textarea);

                        this.appEvents.trigger("discourse:flash-message", {
                            type: "success",
                            message: "已复制: " + shortUrl
                        });
                    }
                },

                classNames: ["copy-shortlink-btn"],
                priority: 250,
                displayed() {
                    return true;
                }
            });
        });
    }
};
