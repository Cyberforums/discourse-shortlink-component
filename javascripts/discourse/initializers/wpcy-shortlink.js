import { withPluginApi } from "discourse/lib/plugin-api";

export default {
    name: "wpcy-shortlink",
    initialize() {
        withPluginApi("1.0.0", (api) => {
            const shortDomain = settings.short_domain || "wpcy.com";
            const buttonLabel = settings.button_label || "复制短链";

            // Add button to topic footer buttons
            api.addTopicFooterButton({
                id: "copy-shortlink",
                icon: "link",
                title: buttonLabel,
                label: buttonLabel,
                action() {
                    const topicId = this.topic.id;
                    const shortUrl = `https://${shortDomain}/t/${topicId}`;

                    navigator.clipboard.writeText(shortUrl).then(() => {
                        // Show success message
                        const originalLabel = this.get("label");
                        this.set("label", "已复制!");
                        this.set("icon", "check");

                        setTimeout(() => {
                            this.set("label", originalLabel);
                            this.set("icon", "link");
                        }, 2000);
                    }).catch(() => {
                        // Fallback for older browsers
                        const textarea = document.createElement("textarea");
                        textarea.value = shortUrl;
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textarea);

                        const originalLabel = this.get("label");
                        this.set("label", "已复制!");
                        setTimeout(() => {
                            this.set("label", originalLabel);
                        }, 2000);
                    });
                },
                dropdown() {
                    return this.site.mobileView;
                },
                classNames: ["copy-shortlink-btn"],
                priority: 250,
            });

            // Also add to share modal
            api.addSharingSource({
                id: "shortlink",
                title: buttonLabel,
                icon: "link",
                generateUrl(link, title) {
                    // Extract topic ID from URL
                    const match = link.match(/\/t\/[^\/]+\/(\d+)/);
                    if (match) {
                        return `https://${shortDomain}/t/${match[1]}`;
                    }
                    return link;
                },
                shouldOpenInPopup: false,
                popupHeight: 0,
                popupWidth: 0,
            });
        });
    },
};
