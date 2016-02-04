import compile from '../webpack/compile';
import logger from '../logger';

export default (msg, reply, ack, nack) => {
    if (!msg.id || !msg.source) {
        nack();
        return;
    }

    // log
    logger.debug('got compile request:', msg);

    // write source to memory fs
    compile(msg)
    .then(res => {
        logger.debug('done compiling, sending result back...');
        reply('runner.compileResult.' + msg.id, {data: res});
    })
    .catch(err => {
        logger.error('error compiling webpack:', err);
        // publish response
        reply('runner.compileResult.' + msg.id, {error: err.toString()});
    });
    // acknowledge
    ack();
};
