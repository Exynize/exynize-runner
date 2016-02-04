import execute from './execute';
import kill from './kill';
import command from './command';
import compile from './compile';

// commands constants
const executeRoute = 'runner.execute';
const killRoute = 'runner.kill';
const commandRoute = 'runner.command';
const compileRoute = 'runner.compile';

// running tasks
export const tasks = {};

// route handlers
export const routeHandlers = {
    [executeRoute]: execute,
    [killRoute]: kill,
    [commandRoute]: command,
    [compileRoute]: compile,
};
