import {tasks} from './index';
import logger from '../logger';

export default (msg, _, ack, nack) => {
    if (!msg.id || !tasks[msg.id]) {
        logger.debug('got command, task not found:', JSON.stringify(msg));
        nack();
        return;
    }

    // log
    logger.debug('got command request:', msg.id);

    // pass command
    tasks[msg.id].send(msg);
    // acknowledge
    ack();
};
