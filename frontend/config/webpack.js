import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import * as Configs from './webpack.configs.js';

let env = `${process.env.ENV || 'dev'}`;

if (!['dev', 'prod'].includes(env))
    env = 'dev';

const config = new Configs[env]();

if (env === 'dev') {
    const server = new WebpackDevServer(webpack(config), config.devServer);
    server.listen(config.devServer.port,  config.devServer.host, err => {
        err ? console.log(err) : null;
        console.log('WebpackDevServer listening at:', config.devServer.host, ':', config.devServer.port);
    });
}

if (env === 'prod') {
    const bundler = webpack(config);
    bundler.run();
}

