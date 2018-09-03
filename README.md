基于 D2Admin 的CMS系统

## 开源项目

[Github 仓库](https://github.com/d2-projects/d2-admin) |
[项目文档](http://d2admin.fairyever.com/zh/)

## 项目结构
```
├─ public
├─ dist // 打包生成的文件夹
├─ src
│  ├─ api   // 接口请求
│  ├─ assets // 资源
│  │  ├─ icons
│  │  ├─ image
│  │  ├─ library
│  │  └─ style
│  ├─ components // 组件
│  │  ├─ common // 公用组件
│  │  └─ ......
│  ├─ i18n // 多国语
│  ├─ libs // 通用库
│  ├─ menu // 菜单
│  ├─ mock // 模拟数据
│  ├─ pages // 页面
│  ├─ plugin // 插件
│  ├─ router // 路由
│  ├─ store // vuex
│  ├─ App.vue
│  ├─ main.js //入口
│  └─ setting.js //界面热键设置
├─ static // 静态资源
├─ .babelrc
├─ .editorconfig
├─ .eslintignore
├─ .eslintrc.js
├─ .gitattributes
├─ .gitignore
├─ .postcssrc.js
├─ LICENSE
├─ README.md
├─ index.html
└─ package.json
```

```
// 安装依赖
npm i

// 运行开发环境
npm run dev

// 测试环境打包
npm run test

// 正式环境打包
npm run build
```

