import Component from "@glimmer/component";
import { action } from "@ember/object";
import { service } from "@ember/service";
import ShortlinkModal from "./modal/shortlink-modal";

export default class ShortlinkFooterButton extends Component {
    @service modal;
    @service router;

    get shortDomain() {
        return settings.short_domain || "wpcy.com";
    }

    get topicId() {
        // 尝试从 outletArgs 或当前路由获取
        return this.args.outletArgs?.topic?.id ||
            this.router.currentRoute?.params?.id ||
            this.args.topic?.id;
    }

    @action
    showShortlinkModal() {
        if (!this.topicId) return;

        const shortUrl = `https://${this.shortDomain}/t/${this.topicId}`;

        this.modal.show(ShortlinkModal, {
            model: { shortUrl: shortUrl }
        });
    }
}
