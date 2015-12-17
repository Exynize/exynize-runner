import {Component} from '../db';
import {transpileCode, extractRequires, installNodeModule} from '../code';
import {runInVm} from '../vm';

const [,, id] = process.argv;

console.log('forked process for:', id);

const run = async (componentId) => {
    // find component in db
    const comp = await Component.find(componentId);
    console.log('got comp:', comp.name);
    // transpile source
    const source = transpileCode(comp.source);
    // extract package names from require statements
    const requires = extractRequires(source);
    console.log('got requires:', requires);
    // install all requires
    for (const pkg of requires) {
        await installNodeModule(pkg);
        console.log('installed', pkg);
    }
    console.log('running...');
    // run
    runInVm(source, comp.args, comp.type)
    .subscribe(res => console.log('result:', res));
};

run(id)
.catch(e => console.error(e));
