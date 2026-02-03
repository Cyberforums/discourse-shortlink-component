import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
    const shortDomain = settings.short_domain || "wpcy.com";
    const buttonLabel = settings.button_label || "复制短链";

    api.decorateWidget("post-menu:before-extra-controls", (helper) => {
        const post = helper.getModel();
        if (!post || post.post_number !== 1) return;

        const topicId = post.topic_id;
        const shortUrl = `https://${shortDomain}/t/${topicId}`;

        return helper.attach("button", {
            action: "copyShortlink",
            icon: "link",
            label: buttonLabel,
            title: shortUrl,
            className: "copy-shortlink-btn"
        });
    });

    api.attachWidgetAction("post-menu", "copyShortlink", function () {
        const post = this.findAncestorModel();
        if (!post) return;

        const topicId = post.topic_id;
        const shortUrl = `https://${shortDomain}/t/${topicId}`;

        navigator.clipboard.writeText(shortUrl).then(() => {
            const dialog = this.register.lookup("service:dialog");
            if (dialog) {
                dialog.alert("已复制: " + shortUrl);
            } else {
                alert("已复制: " + shortUrl);
            }
        }).catch(() => {
            prompt("复制此链接:", shortUrl);
        });
    });
});
