import compile from '../webpack/compile';
import {rabbit} from '../../config';
import logger from '../logger';

export default (channel, data, msg) => {
    if (!msg.id || !msg.source) {
        channel.reject(data);
        return;
    }

    // log
    logger.debug('got compile request:', msg);

    // write source to memory fs
    compile(msg)
    .then(res => {
        logger.debug('done compiling, sending result back...');
        channel.publish(rabbit.exchange, 'runner.compileResult.' + msg.id, new Buffer(JSON.stringify({data: res})));
    })
    .catch(err => {
        logger.error('error compiling webpack:', err);
        // publish response
        channel.publish(rabbit.exchange, 'runner.compileResult.' + msg.id, new Buffer(JSON.stringify({
            error: err.toString()
        })));
    });
    // acknowledge
    channel.ack(data);
};
