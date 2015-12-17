// get babel & config
const babel = require('babel-core');
const babelConfig = {
    presets: ['react', 'es2015', 'stage-1'],
    plugins: ['typecheck'],
};

export const transpileCode = (jsString) => {
    const transformed = babel.transform(jsString, babelConfig);
    return transformed.code;
};
