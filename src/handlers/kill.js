import {tasks} from './index';

export default (channel, data, msg) => {
    if (!msg.id || !tasks[msg.id]) {
        channel.reject(data);
        return;
    }

    // kill
    tasks[msg.id].kill();
    delete tasks[msg.id];
    // acknowledge
    channel.ack(data);
};
