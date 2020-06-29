import path from "path";
import Crypto from 'crypto';
import {spawn} from 'child_process';
import fs from 'fs-extra';
import TerserPlugin from 'terser-webpack-plugin';

export default class {
    constructor() {
        this.appPath = `${path.resolve(process.env.PWD)}`;
        this.salt = 'rambazamba';
        this.hash = Crypto.createHash('md5').update(this.salt).digest("hex");

        //
        this.config = {
            mode: 'production',
            entry: {
                app: './src/app.js'
            },
            target: 'web',
            output: {
                filename: './js/app.min.js',
                path: `${this.appPath}/dist`,
            },
            watch: false,
            cache: false,
            infrastructureLogging: {level: 'warn', debug: true},


            optimization: {
                minimize: true,
                minimizer: [
                    new TerserPlugin({
                        cache: false,
                        parallel: true,
                        sourceMap: false,
                        extractComments: false,
                        terserOptions: {
                            mangle: true,
                            compress: true,
                            comments: false
                            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                        }
                    }),
                ],
            },

            module: {
                rules: [
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
                        test: /.scss$/,
                        use: [
                            'style-loader',
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[name].min.css',
                                    outputPath: './css/'
                                }
                            },
                            'extract-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: false,
                                },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: false,
                                },
                            },
                        ],
                    },
                ],
            },

            plugins: [
                {
                    apply: (compiler) => {
                        compiler.hooks.afterEmit.tap('Complete', (compilation) => {
                            fs.copySync(`${this.appPath}/../public/`, `${this.appPath}/dist`);

                            //sedReplace('js?', `min.js?`, `${this.appPath}/dist/index.html`);
                            //sedReplace('css?', `min.css?`, `${this.appPath}/dist/index.html`);
                            sedReplace('?hash', `?${this.hash}`, `${this.appPath}/dist/index.html`);
                            //sedReplace('debug: true', 'debug: false', `${this.appPath}/dist/index.html`);
                        });
                    }
                }
            ]
        };

        //
        return this.config;
    }
}

const sedReplace = function (replaceFrom, replaceTo, replaceFile) {
    const replaceCommand = `s#${replaceFrom}#${replaceTo}#g`;
    const spawnOptions = [
        '-i',
        replaceCommand,
        replaceFile
    ];
    setTimeout(() => {
        const proc = spawn('sed', spawnOptions);
        proc.on('error', (err) => {
            console.error('>>> ERROR', err);
        });
        proc.stdout.on('data', (data) => {
            console.log(data.toString());
        });
        proc.stderr.on('data', (data) => {
            console.log(data.toString());
        });
    }, 2000);
};
