import {tasks} from './index';

export default (channel, data, msg) => {
    if (!msg.id || !tasks[msg.id]) {
        channel.reject(data);
        return;
    }

    // pass command
    tasks[msg.id].send(msg);
    // acknowledge
    channel.ack(data);
};
