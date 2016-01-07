import logger from '../logger';
import {transpileCode, extractRequires, installNodeModule} from '../code';

const installDeps = async function(src) {
    logger.debug('starting install deps');
    // transpile source
    const source = transpileCode(src);
    // extract package names from require statements
    const requires = extractRequires(source);
    // only install and log progress if there are any deps
    if (requires.length > 0) {
        logger.debug(`installing requires: ${requires.map(r => `'${r}'`).join(', ')}`);
        // install all requires
        for (const pkg of requires) {
            await installNodeModule(pkg);
            logger.debug(`installed ${pkg}`);
        }
        logger.debug(`all dependencies installed!`);
    }
};

export default installDeps;
