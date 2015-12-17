export const db = {
    host: process.env.EXYNIZE_DB_HOST || 'docker.dev',
    database: process.env.EXYNIZE_DB_NAME || 'exynizedb',
    user: '',
    password: '',
};
