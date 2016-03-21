import {stat} from 'fs';
import {join} from 'path';
import {exec} from 'child_process';
import Bluebird from 'bluebird';
const execPromise = Bluebird.promisify(exec);
const statPromise = Bluebird.promisify(stat);

export const installNodeModule = (name) =>
    statPromise(join(__dirname, '..', '..', 'node_modules', name))
    .catch(() => execPromise(`npm install ${name}`));
