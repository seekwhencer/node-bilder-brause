import Generator from './lib/Generator.js';

const generatorOptions = {
    protocol: 'ws',
    host: 'zentrale',
    port: 3050
};

new Generator(generatorOptions).then(generator => {
    console.log('>>> GENERATOR IS UP AND WAITING...')
});
