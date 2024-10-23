import { Client } from '#lib/structures';
import { startAPI } from '#root/api/api'
const client = new Client();

await startAPI();
await client.login();
