import Microwork from 'microwork';
import {rabbit} from '../config';
import logger from './logger';
import {routeHandlers} from './handlers';
import {consoleTransport} from './logger';

// init runner
const runner = new Microwork({host: rabbit.host, exchange: rabbit.exchange, loggingTransports: [consoleTransport]});
// subscribe to topics
Object.keys(routeHandlers).forEach(async (topic) => {
    const handler = routeHandlers[topic];
    await runner.subscribe(topic, handler, {}, {}, {ack: false});
    logger.debug('subscribed to:', topic);
});
// cleanup on exit
process.on('beforeExit', async () => {
    logger.debug('runner about to exit, closing connections...');
    await runner.stop();
});
