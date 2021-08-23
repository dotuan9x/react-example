# React Tailwindcss example

Chi tiết về tailwindcss: https://tailwindcss.com/

Tài liệu hướng dẫn cài đặt tailwindcss trong React: https://tailwindcss.com/docs/guides/create-react-app

## Hướng dẫn cài đặt chi tiết
**Bước 1:** cài đặt các package cần thiết, trong file package.json thêm các package sau:
```shell
# package.json
"autoprefixer": "^10.2.6",
"postcss": "^8.3.0",
"postcss-loader": "6.1.1",
"tailwindcss": "^2.1.4",
"style-loader": "3.2.1",
"css-loader": "6.2.0"
```

- `tailwindcss` package chính của tailwindcss
- `autoprefixer`, `postcss`: tailwindcss có sử dụng 2 package này cho quá trình compite
- `postcss-loader`, `style-loader`, `css-loader`: các loader của webpack, được sử dụng để đọc và xử lý các file css

**Bước 2:** thêm 2 file `postcss.config.js` và `tailwind.config.js` chứa các cấu hình của tailwind và postcss

**Bước 3:** ở file `src/index.tsx` thêm đoạn css của tailwindcss
```tsx
// Tailwindcss
import 'tailwindcss/tailwind.css';
```

**Bước 4:** thêm loader cho file `webpack.config.js` và `webpack.build.js`

Trong phần rules ta thêm các loader để xử lý cho file css
```js
rules: [
    {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
    },
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader'
        }
    },
    {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
    }
]
```
