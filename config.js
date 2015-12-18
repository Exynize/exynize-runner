export const rabbit = {
    host: process.env.RABBITMQ_NODENAME || 'docker.dev',
    exchange: 'exynize.components.exchange',
};
