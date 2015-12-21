import {tasks} from './index';
import logger from '../logger';

export default (channel, data, msg) => {
    if (!msg.id || !tasks[msg.id]) {
        channel.reject(data);
        return;
    }

    // log
    logger.debug('got kill request:', msg);

    // kill
    tasks[msg.id].kill();
    delete tasks[msg.id];
    // acknowledge
    channel.ack(data);
};
