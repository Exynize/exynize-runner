import logger from '../logger';
import {transpileCode, extractRequires, installNodeModule} from '../code';
import {runInVm} from '../vm';

// get component info
const [,, componentJSON] = process.argv;
const component = JSON.parse(componentJSON);

const run = async (comp) => {
    const log = (msg) => comp.mode === 'test' ? process.send({type: 'result', data: `[log]: ${msg}`}) : logger.debug;
    // transpile source
    const source = transpileCode(comp.source);
    // extract package names from require statements
    const requires = extractRequires(source);
    // only install and log progress if there are any deps
    if (requires.length > 0) {
        log(`installing requires: ${requires.map(r => `'${r}'`).join(', ')}`);
        // install all requires
        for (const pkg of requires) {
            await installNodeModule(pkg);
            log(`installed ${pkg}`);
        }
        log(`all dependencies installed! running...`);
    }
    // create exec function
    const exec = (args) => {
        // run
        runInVm(source, args, comp.componentType)
        .subscribe(
            res => process.send({type: 'result', data: res}),
            e => process.send({type: 'error', data: e}),
            () => process.send({type: 'done', data: true}),
        );
    };
    // if test mode or source
    // execute with passed args
    if (comp.mode === 'test' || comp.componentType === 'source') {
        exec(comp.args);
        return;
    }

    // if not running in test mode and not source
    // listen for outside messages for re-execution
    process.on('message', msg => {
        const args = [...comp.args, msg.data];
        exec(args);
    });
};

// run and catch errors
run(component).catch(e => process.send({type: 'error', data: e}));
