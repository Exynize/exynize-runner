import {exec} from 'child_process';
const execPromise = Promise.promisify(exec);

export const installNodeModule = (name) => execPromise(`npm install ${name}`);
