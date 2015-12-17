import r from 'rethinkdb';
import {db as dbConfig} from '../../config';

const rdb = async function() {
    const connection = await r.connect({host: dbConfig.host, port: dbConfig.port});
    const db = r.db(dbConfig.database);
    return {db, connection};
};

const table = async function() {
    const {db, connection} = await rdb();
    const t = db.table('components');
    return {t, connection};
};

const find = async function(id) {
    const {t, connection} = await table();
    const result = await t.get(id).run(connection);
    connection.close();
    return result;
};

export const Component = {
    find,
};
