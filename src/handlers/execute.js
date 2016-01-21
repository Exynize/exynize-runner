import Rx from 'rx';
import {join} from 'path';
import {fork} from 'child_process';
import logger from '../logger';
import {tasks} from './index';
import {rabbit} from '../../config';

// start runner function
const startRunner = (data) => Rx.Observable.create(obs => {
    // fork child
    const child = fork(join(__dirname, '..', 'runner', 'index.js'), [JSON.stringify(data)]);
    // store to running
    tasks[data.id] = child;
    // listen for messages
    child.on('message', response => {
        logger.debug('sending resp from', data.id, 'to', response.responseId, 'type:', response.type);
        obs.onNext({id: data.id, response});
        // only complete runner on test runs
        if (response.type === 'done' && data.mode === 'test') {
            obs.onCompleted();
        }
    });
});

export default (channel, data, msg) => {
    // if no needed data present - reject
    if (!msg.id || !msg.source || !msg.componentType) {
        channel.reject(data);
        return;
    }

    // log
    logger.debug('got execute request:', msg);

    // start
    startRunner(msg)
    .subscribe(({id, response}) => {
        logger.debug('respose from:', id, 'to', response.responseId, 'type:', response.type);
        // publish response
        const rid = response.responseId || id;
        channel.publish(rabbit.exchange, 'runner.result.' + rid, new Buffer(JSON.stringify(response)));
    });
    // acknowledge
    channel.ack(data);
};
