declare module 'bun' {
	interface Env {
		DISCORD_TOKEN: string;
		TEST_SERVER_ID: string;
		API_PORT: Number;
		MYSQL_HOST: string;
		MYSQL_PORT: Number;
		MYSQL_USER: string;
		MYSQL_PASSWORD: string;
		MYSQL_DATABASE: string;
	}
}
