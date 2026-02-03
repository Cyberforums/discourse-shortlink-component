# WPCY Short Link Component

文派社区短链接 Discourse 主题组件。

## 功能

- 在话题页面底部添加「复制短链」按钮
- 在分享菜单中添加短链接选项
- 点击后自动复制 `wpcy.com/t/话题ID` 到剪贴板

## 安装

1. 进入 Discourse 管理后台
2. 导航到 **外观** → **主题**
3. 点击 **安装** → **从 Git 仓库**
4. 输入仓库地址或上传 zip 文件
5. 将组件添加到当前主题

## 设置

| 设置项 | 默认值 | 说明 |
|--------|--------|------|
| `short_domain` | `wpcy.com` | 短链接域名 |
| `button_label` | `复制短链` | 按钮显示文字 |

## 文件结构

```
discourse-shortlink-component/
├── about.json           # 组件元数据
├── settings.yml         # 可配置选项
├── common/
│   └── common.scss      # 样式
└── javascripts/
    └── discourse/
        └── initializers/
            └── wpcy-shortlink.js  # 主逻辑
```

## 短链格式

| 短链 | 目标 |
|------|------|
| `wpcy.com/t/123` | 话题 #123 |
| `wpcy.com/c/slug` | 分类 |
| `wpcy.com/u/user` | 用户主页 |
| `wpcy.com/p/456` | 帖子 #456 |

## License

MIT
