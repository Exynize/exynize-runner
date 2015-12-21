import execute from './execute';
import kill from './kill';
import command from './command';

// commands constants
export const executeRoute = 'runner.execute';
export const killRoute = 'runner.kill';
export const commandRoute = 'runner.command';

// running tasks
export const tasks = {};

// route handlers
export const routeHandlers = {
    [executeRoute]: execute,
    [killRoute]: kill,
    [commandRoute]: command,
};
