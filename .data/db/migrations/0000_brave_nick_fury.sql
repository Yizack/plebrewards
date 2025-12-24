CREATE TABLE `connections` (
	`id_user` integer NOT NULL,
	`type` text NOT NULL,
	`refresh_token` text,
	`client_id` text NOT NULL,
	`client_secret` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`id_user`, `type`),
	FOREIGN KEY (`id_user`) REFERENCES `users`(`id_user`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `songlists` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_login` text NOT NULL,
	`track_id` text NOT NULL,
	`track_name` text NOT NULL,
	`track_artists` text NOT NULL,
	`user_requested` text NOT NULL,
	`date_added` integer NOT NULL,
	FOREIGN KEY (`user_login`) REFERENCES `users`(`user_login`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id_user` integer PRIMARY KEY NOT NULL,
	`user_login` text NOT NULL,
	`username` text NOT NULL,
	`refresh_token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`language` text DEFAULT 'en' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_user_login_unique` ON `users` (`user_login`);