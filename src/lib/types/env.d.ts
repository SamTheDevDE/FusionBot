declare module 'bun' {
	interface Env {
		DISCORD_TOKEN: string;
		TEST_SERVER_ID: string;
		API_PORT: Number;
	}
}
