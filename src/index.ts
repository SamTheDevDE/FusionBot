import { Client, connectMySQL } from '#lib/structures';
import { startAPI } from '#root/api/api'
import startDashboard from "#root/dashboard/app"
const client = new Client();

await connectMySQL();
await startAPI();
await startDashboard();
await client.login();
