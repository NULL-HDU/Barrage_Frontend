/* webpack.conf.js --- configuration for webpack
 *
 * Maintainer: Mephis Pheies ( MephistoMMM )
 * Email: mephistommm@gmail.com
 */

let join = require("path").join;
let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let entry = require("./entry.js")

let static_dir = join(__dirname, "./static");
let node_env = process.env.NODE_ENV;

let webpackDefineConfig = {
  "process.env": JSON.stringify(node_env)
}

// https://github.com/ampedandwired/html-webpack-plugin
let htmlWebpackPluginConfig = {
  filename: join(static_dir, "./index.html"),
  template: "template.html",
  inject: true,
};

let isDebug = true;
if (node_env === "production") {
    isDebug = false;
    Object.assign(htmlWebpackPluginConfig, {
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
    })
}

let uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;


let webpackconfig = {
    devtool: isDebug ? "eval" : "#source-map",
    entry: entry,
    output: {
        //where compiled files be put
        path: join(static_dir, "./dist"),
        //url for develop server
        publicPath: "/static/dist/", //uri while web set run
        filename: "[name].js"
    },
    module: {
        loaders: [{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ["es2015"]
            }
        }, { //Only do this use to local css!
            test: /\.css$/,
            loader: "style-loader!css-loader?modules",
        }, { //url-loader transforms image files. If the image size is smaller than 8192 bytes, it will be transformed into Data URL otherwise, it will be transformed into normal URL.
            test: /\.(png|jpg)$/,
            loader: "url-loader",
            query: {
                limit: 8192
            }
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=10000&minetype=application/font-woff"
        }, {
            test: /\.(ttf|eot|svg)$/,
            loader: "file-loader"
        }]
    },
    plugins: [
        new uglifyJsPlugin({
            //UglifyJs Plugin will minify output(bundle.js) JS codes.http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin(webpackDefineConfig),
        new HtmlWebpackPlugin(htmlWebpackPluginConfig)
    ],

    // a server for front end development
    devServer: {
        hot: true,
        historyApiFallback: {
            rewrites: [{
                from: /^\/(|index.html)$/,
                to: "/static/index.html"
            }],
        },
        proxy: {
            "/api/*": {
                target: "http://localhost:3000",
                secure: false,
            },
        }
    }
};

module.exports = webpackconfig;

/* webpack.conf.js ends here */
