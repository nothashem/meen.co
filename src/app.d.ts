// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { WebSocket } from 'ws';

import { ExtendedWebSocketServer } from '@/websocket/server.svelte';

export interface ExtendedWebSocket extends WebSocket {
	socketId: string;
	userId: string;
}

export interface ExtendedWebSocketServer extends WebSocketServer {
	clients: Set<ExtendedWebSocket>;
	clientInfo: Map<
		string,
		{
			userId: string | null;
			connectedAt: Date;
			lastActivity: Date;
		}
	>;
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: typeof users.$inferSelect;
			auth: ReturnType<typeof import('./auth').auth>;
			session?: {
				user?: {
					email?: string | null;
					name?: string | null;
				} | null;
			} | null;
			wss: ExtendedWebSocketServer;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		// interface Platform {}
	}
}

export {};
