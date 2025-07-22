import type { IncomingMessage } from 'http';
import { nanoid } from 'nanoid';
import type { Duplex } from 'stream';
import { parse } from 'url';
import type { WebSocketServer as WSServer } from 'ws';
import { WebSocket, WebSocketServer } from 'ws';

import type { ExtendedWebSocket } from '../../app';

export interface ExtendedWebSocketServer extends WSServer {
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

export const GlobalThisWSS = Symbol.for('sveltekit.wss');

export type ExtendedGlobal = typeof globalThis & {
	[GlobalThisWSS]: ExtendedWebSocketServer;
};

export interface WebSocketMessage {
	messageType: string;
	data?: Record<string, unknown>;
}

export const onHttpServerUpgrade = (req: IncomingMessage, sock: Duplex, head: Buffer) => {
	const pathname = req.url ? parse(req.url).pathname : null;
	if (pathname !== '/websocket') return;

	const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];

	wss.handleUpgrade(req, sock, head, (ws) => {
		wss.emit('connection', ws as ExtendedWebSocket, req);
	});
};

export const createWSSGlobalInstance = () => {
	const wss = new WebSocketServer({ noServer: true }) as ExtendedWebSocketServer;

	(globalThis as ExtendedGlobal)[GlobalThisWSS] = wss;

	const clientInfo = new Map<
		string,
		{
			userId: string | null;
			connectedAt: Date;
			lastActivity: Date;
		}
	>();

	wss.on('connection', (ws: WebSocket) => {
		const extWs = ws as ExtendedWebSocket;
		const socketId = nanoid();
		extWs.socketId = socketId;

		clientInfo.set(socketId, {
			userId: null,
			connectedAt: new Date(),
			lastActivity: new Date()
		});

		extWs.on('close', () => {
			clientInfo.delete(socketId);
		});

		extWs.on('error', () => {
			clientInfo.delete(socketId);
		});
	});

	wss.clientInfo = clientInfo;

	return wss;
};

export const getGlobalWss = (): ExtendedWebSocketServer => {
	const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
	if (!wss) {
		throw new Error('WebSocket Server not initialized');
	}
	return wss;
};

export const broadcastToUsers = (
	wss: ExtendedWebSocketServer,
	userIds: string[],
	message: WebSocketMessage
) => {
	const messageStr = typeof message === 'string' ? message : JSON.stringify(message);

	wss.clients.forEach((client: WebSocket) => {
		const extClient = client as ExtendedWebSocket;
		if (extClient.readyState === 1 && extClient.userId && userIds.includes(extClient.userId)) {
			extClient.send(messageStr);
		}
	});
};

export const broadcastToUsersGlobal = (userIds: string[], message: WebSocketMessage) => {
	const wss = getGlobalWss();
	const messageStr = typeof message === 'string' ? message : JSON.stringify(message);

	wss.clients.forEach((client: WebSocket) => {
		const extClient = client as ExtendedWebSocket;
		if (extClient.readyState === 1 && extClient.userId && userIds.includes(extClient.userId)) {
			extClient.send(messageStr);
		}
	});
};

export const broadcastToUsersWithoutLocals = (userIds: string[], message: WebSocketMessage) => {
	const wss = getGlobalWss();
	const messageStr = typeof message === 'string' ? message : JSON.stringify(message);

	console.log('Current connected users: ', wss.clients);
	wss.clients.forEach((client: WebSocket) => {
		const extClient = client as ExtendedWebSocket;
		if (extClient.readyState === 1 && extClient.userId && userIds.includes(extClient.userId)) {
			extClient.send(messageStr);
		}
	});
};

export const getActiveUserConnections = (userId: string) => {
	const wss = getGlobalWss();
	const activeConnections = Array.from(wss.clients)
		.map((client) => client as ExtendedWebSocket)
		.filter((client) => client.readyState === 1 && client.userId === userId);

	return activeConnections;
};

export const getConnectionInfo = (userId: string) => {
	const wss = getGlobalWss();
	const connections = [];
	for (const [socketId, info] of wss.clientInfo.entries()) {
		if (info.userId === userId) {
			connections.push({
				socketId,
				...info
			});
		}
	}
	return connections;
};
