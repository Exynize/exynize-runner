import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import webpackConfig from './webpack.config';
import installDeps from './dependencies';
import logger from '../logger';

// save path for sources
const savePath = path.join(__dirname, '..', '..', 'component-sources');
// create folder if not exists
try {
    fs.accessSync(savePath);
} catch (e) {
    logger.debug('no save folder, creating...');
    fs.mkdirSync(savePath);
}

const compile = (id, source) => new Promise((resolve, reject) => {
    // write source to fs
    const file = path.join(savePath, id + '.js');
    fs.writeFileSync(file, source, 'utf8');
    logger.debug('saved to', file);
    // create memfs
    const memFs = new MemoryFS();
    // create config
    const cfg = {...webpackConfig};
    cfg.entry = file;
    // create compiler
    const compiler = webpack(cfg);
    compiler.outputFileSystem = memFs;
    logger.debug('starting compilation');
    compiler.run(err => {
        if (err) {
            logger.error('error compiling webpack:', err);
            return reject(err);
        }

        logger.debug('compiled webpack');
        const outPath = `${cfg.output.path}/${cfg.output.filename}`;
        const fileContent = memFs.readFileSync(outPath).toString();
        resolve(fileContent);
    });
});

// main compile function
export default ({id, source}) => Promise.resolve()
.then(() => installDeps(source))
.then(() => compile(id, source));
