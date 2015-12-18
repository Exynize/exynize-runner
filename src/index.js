import Rx from 'rx';
import amqp from 'amqplib';
import {rabbit} from '../config';
import {join} from 'path';
import {fork} from 'child_process';
import logger from './logger';

// running tasks
const tasks = {};

// start runner function
const startRunner = (data) => Rx.Observable.create(obs => {
    // fork child
    const child = fork(join(__dirname, 'runner', 'index.js'), [JSON.stringify(data)]);
    // store to running
    tasks[data.id] = child;
    // listen for messages
    child.on('message', response => {
        logger.debug('sending resp from', data.id, 'data: ', response);
        obs.onNext({id: data.id, response});
        // only complete runner on test runs
        if (response.type === 'done' && data.mode === 'test') {
            obs.onCompleted();
        }
    });
});

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
    const {queue} = await channel.assertQueue('exynize-runner-queue', {exclusive: true});
    logger.debug('got queue');
    // bind to keys
    await channel.bindQueue(queue, rabbit.exchange, 'runner.execute.#');
    await channel.bindQueue(queue, rabbit.exchange, 'runner.kill.#');
    await channel.bindQueue(queue, rabbit.exchange, 'runner.command.#');
    logger.debug('bound queue, consuming...');
    // listen for messages
    channel.consume(queue, (data) => {
        const msg = JSON.parse(data.content.toString());
        logger.debug('got message:', msg, 'from:', data.fields.routingKey);
        // only run if has all needed fields
        if (data.fields.routingKey === 'runner.execute' && msg.id && msg.source && msg.componentType) {
            startRunner(msg)
            .subscribe(({id, response}) => {
                logger.debug('respose:', response);
                // publish response
                channel.publish(rabbit.exchange, 'runner.result.' + id, new Buffer(JSON.stringify(response)));
            });
        } else if (data.fields.routingKey === 'runner.kill' && msg.id && tasks[msg.id]) {
            tasks[msg.id].kill();
            delete tasks[msg.id];
        } else if (data.fields.routingKey === 'runner.command' && msg.id && tasks[msg.id]) {
            tasks[msg.id].send(msg);
        }
        // acknowledge
        channel.ack(data);
    });
};

// start listening & catch errors
listen().catch(e => console.error(e));
