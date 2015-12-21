import amqp from 'amqplib';
import {rabbit} from '../config';
import logger from './logger';
import {executeRoute, killRoute, commandRoute, routeHandlers} from './handlers';

const listen = async () => {
    // connect
    const connection = await amqp.connect(`amqp://${rabbit.host}`);
    logger.debug('connected to rabbit');
    // get two channels - receive and send
    const channel = await connection.createChannel();
    logger.debug('got channels');
    // assing topic
    await channel.assertExchange(rabbit.exchange, 'topic');
    logger.debug('got exchanges');
    // assig queue
    const {queue} = await channel.assertQueue(`exynize-runner-queue`);
    logger.debug('got queue');
    // bind to keys
    await channel.bindQueue(queue, rabbit.exchange, executeRoute);
    await channel.bindQueue(queue, rabbit.exchange, killRoute);
    await channel.bindQueue(queue, rabbit.exchange, commandRoute);
    logger.debug('bound queue, consuming...');
    // listen for messages
    channel.consume(queue, (data) => {
        const msg = JSON.parse(data.content.toString());
        // work with command
        if (routeHandlers[data.fields.routingKey]) {
            routeHandlers[data.fields.routingKey](channel, data, msg);
            return;
        }
        // if handler not found - reject message
        channel.reject(data);
    });
};

// start listening & catch errors
const start = () => listen()
.catch(e => {
    if (e.code === 'ECONNREFUSED') {
        logger.info(`Couldn't connect to rabbit, retrying in 5s...`);
        setTimeout(start, 5000);
        return;
    }
    logger.error(e);
});

// init start
start();
