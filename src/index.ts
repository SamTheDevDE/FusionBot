import { Client, connectMySQL } from '#lib/structures';
import { startAPI } from '#root/api/api'
const client = new Client();

await connectMySQL();
await startAPI();
await client.login();
