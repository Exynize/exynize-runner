import {stat} from 'fs';
import {join} from 'path';
import {exec} from 'child_process';
const execPromise = Promise.promisify(exec);
const statPromise = Promise.promisify(stat);

export const installNodeModule = (name) =>
    statPromise(join(__dirname, '..', '..', 'node_modules', name))
    .catch(() => execPromise(`npm install ${name}`));
