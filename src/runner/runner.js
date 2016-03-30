import _ from 'lodash';
import logger from '../logger';
import {transpileCode, extractRequires, installNodeModule} from '../code';
import {runWithVm, compileInVm} from '../vm';
import stringifyError from '../util/stringifyError';

// get component info
const [,, componentJSON] = process.argv;
const component = JSON.parse(componentJSON);

const handleRequest = (vmFunction, data) => {
    if (_.isFunction(vmFunction.routeHandler)) {
        logger.debug('handling request with glob function');
        return vmFunction.routeHandler(data);
    }

    const prop = data.method.toLowerCase();
    if (_.isObject(vmFunction.routeHandler) && vmFunction.routeHandler[prop]) {
        logger.debug('handling request with "', prop, '" function');
        return vmFunction.routeHandler[prop](data);
    }

    // return no-op
    return () => {};
};

const run = async (comp) => {
    const log = (msg) => comp.mode === 'test' ? process.send({type: 'result', data: `[log]: ${msg}`}) : logger.debug;
    // transpile source
    const source = transpileCode(comp.source);
    // extract package names from require statements
    const requires = extractRequires(source);
    // only install and log progress if there are any deps
    if (requires.length > 0) {
        log(`installing requires: ${requires.map(r => `'${r}'`).join(', ')}`);
        // install all requires
        for (const pkg of requires) {
            await installNodeModule(pkg);
            log(`installed ${pkg}`);
        }
        log('all dependencies installed! running...');
    }
    // pre-compile source
    const vmFunction = compileInVm(source);
    // create exec function
    const exec = (args, responseId) => {
        let cleanErrorHandlers = () => {};
        // also handle all uncaught exceptions
        const handleError = err => {
            process.send({type: 'error', data: stringifyError(err), responseId});
            cleanErrorHandlers();
        };
        // define clean function
        cleanErrorHandlers = () => {
            process.removeListener('uncaughtException', handleError);
            process.removeListener('unhandledRejection', handleError);
        };
        process.on('uncaughtException', handleError);
        process.on('unhandledRejection', handleError);
        // run
        runWithVm(vmFunction.default, args, comp.componentType)
        .subscribe(
            res => process.send({type: 'result', data: res, responseId}),
            e => {
                process.send({type: 'error', data: stringifyError(e), responseId});
                cleanErrorHandlers();
            },
            () => {
                process.send({type: 'done', data: true, responseId});
                cleanErrorHandlers();
            },
        );
    };

    // if not running in test mode and not source
    // listen for outside messages for re-execution
    process.on('message', msg => {
        logger.debug('incoming message:', msg);
        // handle source requests
        if (comp.componentType === 'source') {
            // only handle requests with type
            if (msg.data.type === 'incoming-http-request') {
                handleRequest(vmFunction, msg.data);
            }

            return;
        }
        // otherwise simply work with incoming data
        const args = [...comp.args, msg.data];
        exec(args, msg.responseId);
    });

    // if test mode or source
    // execute with passed args
    if (comp.mode === 'test' || comp.componentType === 'source') {
        exec(comp.args);
        return;
    }
};

// run and catch errors
run(component).catch(e => process.send({type: 'error', data: stringifyError(e)}));
