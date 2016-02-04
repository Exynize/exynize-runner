import Microwork from 'microwork';
import {rabbit} from '../config';
import logger from './logger';
import {routeHandlers} from './handlers';

// init runner
const runner = new Microwork({host: rabbit.host, exchange: rabbit.exchange});
// subscribe to topics
Object.keys(routeHandlers).forEach(async (topic) => {
    const handler = routeHandlers[topic];
    await runner.subscribe(topic, handler, {}, {}, {ack: false});
    logger.debug('subscribed to:', topic);
});
