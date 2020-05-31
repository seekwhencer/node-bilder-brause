import * as Configs from './webpack.configs.js';

export default function() {
    let env = `${process.env.ENV || 'dev'}`;

    if (!['dev', 'prod'].includes(env))
        env = 'dev';

    return new Configs[env]();
}
