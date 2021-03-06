var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// 目录
var ROOT_PATH = path.resolve(__dirname);
var SOURCE_PATH = path.resolve(ROOT_PATH, 'source');
var VENDOR_PATH = path.resolve(ROOT_PATH, 'vendor');

module.exports = function (options) {

    var entry = {
        app: path.resolve(SOURCE_PATH, 'index'),
        vendor: [
            'angular',
            'ui-router',
            'oc.lazyLoad',
            'ui-bootstrap',
            'echarts',
            'jquery',
            'bootstrap',
            'iconfont'
        ]
    };

    options.staticPath = options.staticPath || 'static';

    var output = {
        path: options.dir,
        filename: options.staticPath + '/js/[name].js',
        chunkFilename: options.staticPath + '/js/[name].js',
        publicPath: options.publicPath || null
    };

    if (options.sourcemaps) {
        output.sourceMapFilename = options.staticPath + '/sourcemap/[name].map';
    }

    var aliases = {
        'angular': path.resolve(VENDOR_PATH, 'angular', 'angular.js'),
        'ui-router': path.resolve(VENDOR_PATH, 'ui-router', 'angular-ui-router.js'),
        'oc.lazyLoad': path.resolve(VENDOR_PATH, 'oclazyload', 'ocLazyLoad.js'),
        'ui-bootstrap': path.resolve(VENDOR_PATH, 'ui-bootstrap', 'ui-bootstrap-tpls.js'),
        'jquery': path.resolve(VENDOR_PATH, 'jquery', 'jquery.js'),
        'bootstrap': path.resolve(VENDOR_PATH, 'bootstrap', 'bootstrap.css'),
        'iconfont': path.resolve(VENDOR_PATH, 'iconfont', 'iconfont.css'),

        /* ======== echarts ======== */
        'echarts': path.resolve(VENDOR_PATH, 'echarts', 'echarts.all.js'),
        //'echarts.chart.gauge': path.resolve(VENDOR_PATH, 'echarts', 'chart', 'gauge.js'),
        //'echarts.component.tooltip': path.resolve(VENDOR_PATH, 'echarts', 'component', 'tooltip.js'),
        //'echarts.component.toolbox': path.resolve(VENDOR_PATH, 'echarts', 'component', 'toolbox.js')
    };

    var loaders = [
        // JS LOADER
        // Reference: https://github.com/babel/babel-loader
        // Compiles ES6 and ES7 into ES5 code
        {
            test: /\.js$/,
            loader: 'babel',
            include: [SOURCE_PATH],
            query: {
                cacheDirectory: true,
                presets: ['es2015', 'stage-1'],
                plugins: [
                    //'babel-plugin-transform-runtime',
                    //'babel-plugin-add-module-exports',
                    'babel-plugin-transform-decorators-legacy',
                ]
            },
            exclude: [/node_modules/]
        },
        // ng-cache-loader
        // Reference: https://github.com/teux/ng-cache-loader
        // Webpack loader to put HTML partials in the Angular's $templateCache.
        {
            test: /\.tpl$/,
            //loader: 'ng-cache',
            loader: 'html',
            include: SOURCE_PATH,
            exclude: /partial/
        },
        // CSS LOADER
        // Reference: https://github.com/webpack/css-loader
        // Allow loading css through js
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader"),
            include: [SOURCE_PATH, VENDOR_PATH]
        },
        {
            test: /\.png$/,
            loader: 'url?limit=100000&mimetype=image/png&name=' + options.staticPath + '/img/[name].[hash].[ext]'
        },
        {
            test: /\.jpg$/,
            loader: 'url?name=' + options.staticPath + '/img/[name].[hash].[ext]'
        },
        {
            test: /\.(woff|woff2|ttf|eot|svg)(\?t=\d+)?$/,
            loader: 'file?limit=10000&name=' + options.staticPath + '/fonts/[name].[hash].[ext]'
        }
    ];

    var plugins = [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new ExtractTextPlugin(options.staticPath + "/css/[name].css"),
        new HtmlWebpackPlugin({
            filename: options.outputHTML,
            template: path.resolve(SOURCE_PATH, 'index.html'),
            inject: 'body'
        })
    ];

    if (options.chunk) {
        plugins.push(new webpack.optimize.CommonsChunkPlugin('vendor', options.staticPath + '/js/vendor.js'));
    }

    if (options.minimize) {
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            warnings: false,
            mangle: {
                except: ['$q', '$ocLazyLoad']
            },
            sourceMap: false
        }));
    }

    return {
        entry: entry,
        output: output,
        module: {
            loaders: loaders,
            noParse: /\.min\.js/
        },
        plugins: plugins,
        resolve: {
            alias: aliases
        },
        devtool: options.devtool
    }
};
