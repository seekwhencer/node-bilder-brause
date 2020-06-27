import StyleLintPlugin from 'stylelint-webpack-plugin';
import path from 'path';

export default class {
    constructor() {
        //
        this.appPath = `${path.resolve(process.env.PWD)}`;

        //
        this.config = {
            entry: {
                app: './src/app.js'
            },
            target: 'web',
            mode: 'development',
            devtool: 'inline-source-map',
            output: {
                filename: './js/[name].js',
                path: `${this.appPath}/dist`,
                hotUpdateChunkFilename: `../../.hot/hot-update.js`,
                hotUpdateMainFilename: `../../.hot/hot-update.json`
            },

            module: {
                rules: [
                    {
                        enforce: 'pre',
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'eslint-loader',
                    },
                    {
                        test: /\.html?$/,
                        loader: "template-literals-loader"
                    },
                    {
                        test: /\.(png|svg|jpg|gif|jpe?g)$/,
                        use: [
                            {
                                options: {
                                    name: "[name].[ext]",
                                    outputPath: "../images/"
                                },
                                loader: "file-loader"
                            }
                        ]
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            'style-loader',
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[name].css',
                                    outputPath: '../dist/css/'
                                }
                            },
                            'extract-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true,
                                },
                            }
                        ],
                    }
                ],
            },

            plugins: [
                new StyleLintPlugin()
            ],

            devServer: {
                contentBase: ['../public', 'dist'],
                publicPath: '/',
                compress: false,
                host: '0.0.0.0',
                port: 9000,
                headers: {
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, Accept, X-Requested-With, Content-Type, Authorization",
                    "Access-Control-Allow-Origin": "*",
                },
                hot: true,
                index: `${this.appPath}/public/dev.html`,
                writeToDisk: true,
                watchOptions: {
                    poll: true
                },
                watchContentBase: true,
                proxy: {
                    context: () => true,
                    target: 'http://zentrale:3050',
                    bypass: (req, res, proxyOptions) => {
                        if (req.path === '/') {
                            console.log('>>>> WEBPACK PROXY SKIPPING REQUEST', req.path);
                            return '/dev.html';
                        }
                    }
                }
            }
        };

        //
        return this.config;
    }
}
