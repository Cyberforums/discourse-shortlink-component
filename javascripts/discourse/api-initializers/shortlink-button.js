import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
    const shortDomain = settings.short_domain || "wpcy.com";

    // 在话题标题下方添加短链信息
    api.decorateWidget("topic-title:after", (helper) => {
        const topic = helper.getModel();
        if (!topic || !topic.id) return;

        const shortUrl = `https://${shortDomain}/t/${topic.id}`;

        return helper.rawHtml(`
      <div class="shortlink-container" style="margin: 5px 0; font-size: 13px;">
        <span style="color: #666;">短链:</span>
        <code id="shortlink-url" style="background: #f5f5f5; padding: 2px 6px; border-radius: 3px; cursor: pointer;" 
              onclick="navigator.clipboard.writeText('${shortUrl}').then(() => { this.textContent = '已复制!'; setTimeout(() => { this.textContent = '${shortUrl}'; }, 1500); })"
              title="点击复制">${shortUrl}</code>
      </div>
    `);
    });
});
