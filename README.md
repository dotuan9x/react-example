# React examples - Typescript blank
## Cấu trúc folder một project React Typescript blank

- public: chứa file `index.html` có element `<div id="root"></div>` để render ứng dụng React
- scripts: folder chứa các file webpack config 
- src: folder chứa các file xử lý trong ứng dụng React
- .babelrc, .eslintrc.js,... các file cấu hình cho một project React 

## Cách sử dụng
### Start application
```shell
npm install # Cài đặt các package cần thiết trong file package.json
npm run start # chạy ứng dụng, sau khi start thành công sẽ mở trình duyệt với đường dẫn http://localhost:8080/
```

### Bundle source code
```shell
npm run build # Sử dụng webpack để bundle các file tsx thành js, các file bundle sẽ được chứa trong thư mục build
```

