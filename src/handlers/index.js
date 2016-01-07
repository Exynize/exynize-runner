import execute from './execute';
import kill from './kill';
import command from './command';
import compile from './compile';

// commands constants
export const executeRoute = 'runner.execute';
export const killRoute = 'runner.kill';
export const commandRoute = 'runner.command';
export const compileRoute = 'runner.compile';

// running tasks
export const tasks = {};

// route handlers
export const routeHandlers = {
    [executeRoute]: execute,
    [killRoute]: kill,
    [commandRoute]: command,
    [compileRoute]: compile,
};
