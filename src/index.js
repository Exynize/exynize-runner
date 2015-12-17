import {Component} from './db';
import {transpileCode, extractRequires, installNodeModule} from './code';
import {runInVm} from './vm';

const run = async () => {
    // get component id from env
    const componentId = process.env.EXYNIZE_COMPONENT_ID;
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
    runInVm(source, comp.args, comp.type)
    .subscribe(res => console.log('result:', res));
};

run()
.catch(e => {
    console.error(e);
    process.exit(1);
});
