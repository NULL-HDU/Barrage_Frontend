# readme for developers

## 说明

该开发环境使用了 webpack 打包 js代码，css文件和 png|jpg|woff|ttf|eot|svg文件, 在开发时应该先开启 webpack-dev-server 并在 `src` 文件夹下面开发。

在文件`entry.js`文件的module中注册入口文件， **key**为导出文件名前缀，**value**为入口文件地址，可参照 test.js 的注册方式。

打包代码时，webpack 会将 `entry.js` 中的各个入口文件，以及它们的依赖都编译到导出目录（`/static/dist`）。而且，每个入口文件的导出路径（`/static/dist/*`[^footnoot2]）以**script** tag形式自动插入到 `template.html`文件的 **body** tag内部生成新的 html文件并导出至 `./static/index.html`。

production环境下编译还具有代码压缩能力。默认有三种环境： **development**，**testing**， **production**[^footnote1]。

webpack-dev-server 会监听本地 **8080** 端口，以`./`文件夹为服务文件夹，不过 `/`路径和 `/index.html` 都会被重写到 `/static/index.html`路径，所以开启webpack-dev-server后能够直接访问导出的index.html。

webpack-dev-server 会将 `/api/*`路径重定向到 `http://localhost:3000`，便于后期api拓展时的开发。

*ps: webpack-dev-server 开启环境为 development*

该开发环境还配置了 `.eslintrc` 作为linter配置文件。


## ready

环境准备, 开发前请先准备环境。

```sh
npm install
```

## command

### development环境下编译
```sh
npm run webpack
```

### 开启webpack-dev-server
```sh
npm run webpack-server
```

### testing环境下编译
```sh
npm run webpack-test
```

### production环境下编译
```sh 
npm run webpack-pro
```


[^footnoot1]: 环境的不同只是 **NODE_ENV** 这个环境变量的值得不同, e.g. NODE_ENV=development
[^footnoot2]: /static/dist/* 和 /static/index.html 都会被 git 忽略。
