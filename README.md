![](https://github.com/NULL-HDU/Barrage_Frontend/blob/develop/Logo.png)

*Special thanks to [Neoco](https://github.com/Neoco) for the logo.*

[![Travis](https://img.shields.io/travis/olistic/warriorjs.svg?style=flat-square)](https://travis-ci.org/olistic/warriorjs)
[![npm](https://img.shields.io/npm/v/warriorjs.svg?style=flat-square)](https://www.npmjs.com/package/warriorjs)

# Barrage - A Touhou Like Battle Shooting Game

Barrage is a multiplayer shooting web-based game like touhou shooting game.While playing this game,you have to control a warplane to destory the other players and obstacles.

So, how users can play this web-based game. Have you heard about this game and don’t know how to play it?Actually,you have to control your own warplane to destory the other players in the scene,and there will be some supplies on the scene some time,you can use these supplies to strengthen your warplane.

**Obstacles:**There will be some obstacles in the scene to hinder the plane,you can choose to destory these obstacles to expand the flight range.

**Supplies:**There will be some supplies in the scene some time,these supplies can give variety kinds of buff to strengthen players.So,you'd better get these supplies as soon as possible,you will never want these supplies fall into the hand of the enemies.

**Skills:**Different types of warplane may have different skills.Different skills may shoot different kinds of bullet.Different kinds of bullets have different damage and motion curve.Skills may have cooling time.Every warplane has three skills.You can left click to make a heavy attack,press E button to defend and press Q button to  use ultimate skill.

**Move:**You can use WASD buttons to move the warplane.

**Slow Mode:**You can hold the Shift key to slow down the warplane.This may help you avoid the dense bullets.

**Shoot:**While playing the game you have to shoot the obstacles and other players around you, for this task you should point your target by mouse and left-click or tap space button of your keyboard to shoot. In order to shoot continuously, you can hold the space bar button or the left button of the mouse.

**Requirements:** Now, what are the requirements to play this game, it is pretty easy to play this game. It does not need bulk requirements.


Still waiting for what?Grab the source and join in the fun!

**Visit:** The Barrage website<br />
**Learn:**API Docs,Support Forun and StackOverflow<br />
**Code:**Source code available in this repo.<br />
**Chat:**Slack<br />
**Be awesome:**Support the future of Barrage,we are glad to develop with you.<br />

Contents
- [What's New?](#whats-new)
- [Support Barrage](#support)
- [Download Barrage](#download)
- [Getting Started](#getting-started)
- [Building Barrage](#building-barrage)
- [Change Log](#change-log)
- [Requirements](#requirements)
- [Contributing](#contributing)

<a name="whats-new"></a>
## What's New?
> 29th December 2016

Welcome!

We've made some important structural changes to our git repo. You have a choice of 2 versions:

**[Barrage 1](https://github.com/NULL-HDU/Barrage_Frontend/archive/v1.0-beta.zip)**

**[Barrage 2](https://github.com/NULL-HDU/Barrage_Frontend/archive/v2.0.zip)**

For the latest information visit the Barrage web site, where we cover all two versions.Follow on Twitter and chat with fellow  Barrage developers in our Slack channels.

There are now more ways than ever to help support development of Barrage. The uptake so far has been fantastic, but this is an on-going mission. Thank you to everyone who supports our development, who shares our belief in the future of HTML5 gaming, and Barrage role in that.

Happy coding everyone!

Cheers,

Arthury - [@NULL Team](https://github.com/NULL-HDU)

<a name="support"></a>
## Support Barrage

Developing Barrage takes a lot of time, effort, and money. There are monthly running costs; such as hosting and services. As well as countless hours of development time, community support, and assistance resolving issues. We do this out of our love for Barrage, but at the end of the day there are real tangible costs involved.

If you have found Barrage interesting in your game time. Or have learned a lot from it, and are in a position to support us financially, without causing any detriment to yourself, then please do. There are a number of ways:
 
It all helps cover our running costs, and genuinely contributes towards future development.

## Download Barrage

All Barrage versions are [hosted on Github][Barrage].You can:

* Clone the git repository via [https][clone-http], [ssh][clone-ssh] or with the Github [Windows][clone-ghwin] or [Mac][clone-ghmac] clients.
* Download as [zip][get-zip] or [tar.gz][get-tgz]
* Checkout with [svn][clone-svn]

### License

Barrage is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0)

<a name="building-barrage"></a>
## Building Barrage

Barrage is provided ready compiled in the build folder of the repository. There are both plain and minified versions. The plain version is for use during development, and the minified version for production. You can also create your own builds.

### Webpack

We included a custom build for Webpack.

##### Webpack Config

``` javascript

let webpackconfig = {
    devtool: isDebug ? "eval" : "#source-map",
    entry: entry,
    output: {
        //where compiled files be put
        path: join(static_dir, `./${dist}`),
        //url for develop server
        publicPath: `/${_static_dir}/${dist}/`, //uri while web set run
        filename: "[name].js"
    },
    module: {
        loaders: [{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ["es2015", "react"]
            }
        }, { 
            test: /\.json$/,
            loader: "json",
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
        inline: true,
        historyApiFallback: {
            rewrites: [{
                from: /^\/(|index.html)$/,
                to: `/${_static_dir}/${index}`
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

```

See the [Building by Webpack tutorial][build-by-webpack] for details.

##### Building from source

Should you wish to build Barrage 2 from source you can take advantage of the provided [Grunt](http://gruntjs.com/) scripts. Ensure you have the required packages, and running `npm install` first.

Run `grunt` to perform a default build to the `dist` folder.

<a name="getting-started"></a>
## Getting Started
Our [Getting Started Guide](https://github.com/NULL-HDU/Barrage_Frontend/wiki/Getting-Started-Guide) will get you up to speed quickly. From setting up a web server, to picking an IDE. After which read our [API Documentation](https://github.com/NULL-HDU/Barrage_Frontend/wiki/API-Documentation). Please work through this, no matter what your development experience, to learn how Barrage approaches things.

<a name="requirements"></a>
## Requirements

Barrage requires a web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera on desktop. Barrage are not support mobile browser for now.

While Barrage does its best to ensure a consistent cross-platform experience, always be aware of browser and device limitations. This is especially important with memory and GPU limitations on mobile, and legacy browser HTML5 compatibility.

### JavaScript

Barrage is developed in ES6 JavaScript. We've made no assumptions about how you like to code, and were careful not to impose a strict structure upon you.

## Change Log

We have always been meticulous in recording changes to the Barrage code base, and where relevant, giving attribution to those in the community who helped with the change. You can find comprehensive Change Logs for all versions:

- [Barrage 2 Change Log](https://github.com/NULL-HDU/Barrage_Frontend/wiki/V2-ChangeLog).

<a name="contributing"></a>
## Contributing

The [Contributors Guide][contribute] contains full details on how to help with Barrage development. The main points are:

- Found a bug? Report it on [GitHub Issues][issues] and include a code sample. Please state which version of Barrage you are using! This is vitally important.

- Before contributing read the [code of conduct](https://github.com/NULL-HDU/Barrage_Frontend/wiki/Contributor-Code-of-Conduct).

## Created By

Created by [NULL Team](https://github.com/NULL-HDU).Powered by PixiJSv4.

The Barrage logo and characters are © 2016 NULL Team Limited.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[issues]: https://github.com/NULL-HDU/Barrage_Frontend/issues
[contribute]: https://github.com/NULL-HDU/Barrage_Frontend/wiki/Contributors-Guide
[get-zip]: https://github.com/NULL-HDU/Barrage_Frontend/archive/v2.0.zip
[get-tgz]: https://github.com/NULL-HDU/Barrage_Frontend/archive/v2.0.gz
[clone-http]: https://github.com/NULL-HDU/Barrage_Frontend.git
[clone-ssh]: git@github.com:NULL-HDU/Barrage_Frontend.git
[clone-svn]: https://github.com/NULL-HDU/Barrage_Frontend
[clone-ghwin]: github-windows://openRepo/https://github.com/NULL-HDU/Barrage_Frontend
[clone-ghmac]: github-mac://openRepo/https://github.com/NULL-HDU/Barrage_Frontend
[Barrage]: https://github.com/NULL-HDU/Barrage_Frontend
[build-by-webpack]: https://github.com/NULL-HDU/Barrage_Frontend/wiki/Building-by-Webpack-tutorial
