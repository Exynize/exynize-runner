import {tasks} from './index';
import logger from '../logger';

export default (msg, _, ack, nack) => {
    if (!msg.id || !tasks[msg.id]) {
        nack();
        return;
    }

    // log
    logger.debug('got kill request:', msg);

    // kill
    tasks[msg.id].kill();
    delete tasks[msg.id];
    // acknowledge
    ack();
};
