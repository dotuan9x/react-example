# React storybook example

Chi tiết storybook: https://storybook.js.org/

Hướng dẫn chi tiết cài đặt storybook từ trang chủ: https://storybook.js.org/docs/react/get-started/introduction

## Các bước cài đặt storybook 
Bước 1: cài đặt các package cần thiết của storybook ở devDependencies
```shell
"@babel/preset-typescript": "^7.10.4",
"@storybook/addon-actions": "6.2.5",
"@storybook/addon-essentials": "6.2.5",
"@storybook/addon-links": "6.2.5",
"@storybook/addon-storysource": "6.2.5",
"@storybook/addons": "6.2.5",
"@storybook/builder-webpack5": "^6.2.9",
"@storybook/react": "6.2.5",
"@storybook/storybook-deployer": "^2.8.7",
"dotenv-webpack": "^7.0.3",
```
Thêm cấu hình `scripts` như sau
```shell
"scripts": {
    "start": "webpack serve --mode development --config scripts/webpack.config.js",
    "build": "webpack --mode production --config scripts/webpack.build.js",
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook",
    "storybook:deploy": "storybook-to-ghpages --existing-output-dir=storybook-static"
  }
```

Bước 2: thêm folder `.storybook` chứa các file cấu hình của storybook, và thêm folder `stories` chứa các file markdown để document cho các components và project

Bước 3: Chạy storybook bằng command line `npm run storybook`
