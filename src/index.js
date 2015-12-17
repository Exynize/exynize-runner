import {join} from 'path';
import {fork} from 'child_process';

// get component id from env
const componentId = process.env.EXYNIZE_COMPONENT_ID;

// start runner function
const startRunner = (id) => {
    // fork child
    fork(join(__dirname, 'runner', 'index.js'), [id]);
};


// start
startRunner(componentId);
