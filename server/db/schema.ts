import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id_user: integer("id_user").primaryKey(),
  user_login: text("user_login").notNull().unique(),
  username: text("username").notNull(),
  refresh_token: text("refresh_token").notNull(),
  created_at: integer("created_at").notNull(),
  updated_at: integer("updated_at").notNull(),
  language: text("language").notNull().default("en")
});

export const connections = sqliteTable("connections", {
  id_user: integer("id_user").references(() => users.id_user).notNull(),
  type: text("type").notNull(),
  refresh_token: text("refresh_token"),
  client_id: text("client_id").notNull(),
  client_secret: text("client_secret").notNull(),
  created_at: integer("created_at").notNull(),
  updated_at: integer("updated_at").notNull()
}, table => ({
  pk: primaryKey({ columns: [table.id_user, table.type] })
}));

export const songlists = sqliteTable("songlists", {
  id: integer("id").primaryKey(),
  user_login: text("user_login").notNull().references(() => users.user_login, { onUpdate: "cascade", onDelete: "cascade" }),
  track_id: text("track_id").notNull(),
  track_name: text("track_name").notNull(),
  track_artists: text("track_artists").notNull(),
  user_requested: text("user_requested").notNull(),
  date_added: integer("date_added").notNull()
});
