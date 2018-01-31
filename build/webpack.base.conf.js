var path = require('path');
var utils = require('./utils');
var config = require('../config');
var vueLoaderConfig = require('./vue-loader.conf');
//var ExtractTextPlugin = require("extract-text-webpack-plugin")

const museUiThemePathBak = path.join(
    resolve('node_modules'),
    'muse-ui/src/styles/themes/variables/default.less'
);
const museUiThemePath = resolve('src/assets/sass/yk-theme.less');

vueLoaderConfig.loaders.less = [
    'vue-style-loader',
    'css-loader',
    {
        loader: 'less-loader',
        options: {
            globalVars: {
                museUiTheme: `'${museUiThemePath}'`
            }
        }
    }
];

//console.log(vueLoaderConfig.loaders.less[2].options.globalVars.museUiTheme);
//console.log(vueLoaderConfig);

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

//替换配置文件
require("./replacePathConfig");

//发布放开
process.env.NODE_ENV = 'production';

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },

    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'muse-components': 'muse-ui/src'
        }
    },
    resolveLoader: {
        moduleExtensions: ['-loader']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },

            {
                test: /muse-ui.src.*?js$/,
                loader: 'babel-loader'
            },

            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
                // query: {
                //   presets: ['es2015']
                // }
            },
            {
                test: /\.(scss|sass)$/,
                use: ["node-sass", "vue-style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    }
};