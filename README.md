# WPCY Short Link Component

[English](#english) | [中文](#中文)

---

## 中文

文派社区短链接 Discourse 主题组件。

### 功能

- 在话题底部添加「短链接」按钮（登录用户）
- 在主楼内容下方添加短链按钮（所有用户）
- 点击弹出 Modal 显示短链并一键复制
- 短链格式：`wpcy.com/t/话题ID`

### 安装

1. 进入 Discourse 管理后台
2. 导航到 **外观** → **主题**
3. 点击 **安装** → **从 Git 仓库**
4. 输入：`https://github.com/Cyberforums/discourse-shortlink-component`
5. 将组件添加到当前主题

### 设置

| 设置项 | 默认值 | 说明 |
|--------|--------|------|
| `short_domain` | `wpcy.com` | 短链接域名 |

### 文件结构

```
discourse-shortlink-component/
├── about.json                           # 组件元数据
├── settings.yml                         # 配置选项
├── LICENSE                              # MIT 许可证
├── common/
│   └── common.scss                      # 样式
└── javascripts/discourse/
    ├── api-initializers/
    │   └── shortlink-button.js          # 主入口 & 翻译注入
    └── components/
        ├── shortlink-footer-button.js   # 底部按钮逻辑
        ├── shortlink-footer-button.hbs  # 底部按钮模板
        ├── post-shortlink-button.gjs    # 帖子内按钮 (Glimmer)
        └── modal/
            └── shortlink-modal.gjs      # 弹窗组件 (Glimmer)
```

### 兼容性

- **最低版本**：Discourse v3.6.0+
- **测试版本**：Discourse v2026.1.0

---

## English

A Discourse theme component for WPCY short links.

### Features

- Adds a "Short Link" button to topic footer (logged-in users)
- Adds a short link button below the first post (all users)
- Click to open a modal with copyable short link
- Format: `wpcy.com/t/topicID`

### Installation

1. Go to Discourse Admin Panel
2. Navigate to **Appearance** → **Themes**
3. Click **Install** → **From a git repository**
4. Enter: `https://github.com/Cyberforums/discourse-shortlink-component`
5. Add the component to your active theme

### Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `short_domain` | `wpcy.com` | Short link domain |

### Compatibility

- **Minimum**: Discourse v3.6.0+
- **Tested**: Discourse v2026.1.0

---

## License

MIT
