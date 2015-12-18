import {transpileCode, extractRequires, installNodeModule} from '../code';
import {runInVm} from '../vm';

const log = (msg) => process.send({type: 'result', data: `[log]: ${msg}`});

// get component info
const [,, componentJSON] = process.argv;
const component = JSON.parse(componentJSON);

const run = async (comp) => {
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
    // run
    runInVm(source, comp.args, comp.componentType)
    .subscribe(
        res => process.send({type: 'result', data: res}),
        e => process.send({type: 'error', data: e}),
        () => process.send({type: 'done', data: true}),
    );
};

// run and catch errors
run(component).catch(e => process.send({type: 'error', data: e}));
