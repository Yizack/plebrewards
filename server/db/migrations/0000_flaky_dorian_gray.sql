CREATE TABLE `connections` (
	`id` integer PRIMARY KEY NOT NULL,
	`id_user` integer NOT NULL,
	`type` text NOT NULL,
	`refresh_token` text,
	`client_id` text NOT NULL,
	`client_secret` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id_user` integer PRIMARY KEY NOT NULL,
	`user_login` text NOT NULL,
	`username` text NOT NULL,
	`refresh_token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
