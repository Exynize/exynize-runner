import {Component} from '../db';
import {transpileCode, extractRequires, installNodeModule} from '../code';
import {runInVm} from '../vm';

export const run = async (componentId) => {
    // find component in db
    const comp = await Component.find(componentId);
    console.log('got comp:', comp);
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
    return runInVm(source, comp.args, comp.type);
};
