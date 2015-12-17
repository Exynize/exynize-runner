import {Component} from './db';

const run = async () => {
    const componentId = process.env.EXYNIZE_COMPONENT_ID;
    const comp = await Component.find(componentId);
    console.log(comp);
};

run()
.catch(e => {
    console.error(e);
    process.exit(1);
});
