import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {Observable, Subject} from 'rx';

export const runWithVm = (vmFunction, args = [], componentType = 'processor') => {
    const compiledArgs = args.map(arg => {
        try {
            const newArg = JSON.parse(arg);
            return newArg;
        } catch (e) {
            return arg;
        }
    });
    if (componentType === 'processor') {
        const functionResult = vmFunction(...compiledArgs);
        return functionResult;
    }

    if (componentType === 'source') {
        // create
        const subject = new Subject();
        // push to args
        compiledArgs.push(subject);
        // execute
        setTimeout(() => vmFunction(...compiledArgs), 10);
        return subject;
    }

    if (componentType === 'render') {
        const Component = vmFunction();
        const props = {data: compiledArgs[0]};
        const element = React.createElement(Component, props);
        return Observable.create(obs => {
            try {
                const res = ReactDOMServer.renderToString(element);
                obs.onNext(res);
                obs.onCompleted();
            } catch (err) {
                obs.onError(err);
            }
        });
    }

    throw new Error('Unknown component type:', componentType);
};
