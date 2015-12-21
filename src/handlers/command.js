import {tasks} from './index';
import logger from '../logger';

export default (channel, data, msg) => {
    if (!msg.id || !tasks[msg.id]) {
        channel.reject(data);
        return;
    }

    // log
    logger.debug('got command request:', msg);

    // pass command
    tasks[msg.id].send(msg);
    // acknowledge
    channel.ack(data);
};
