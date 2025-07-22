import { EventEmitter } from 'events';

import { browser } from '$app/environment';

interface MessageEvent {
	type: string;
	data: unknown;
}

class socketState extends EventEmitter {
	private socket: WebSocket | null = null;
	messages: MessageEvent[] = [];

	// Reconnect configs
	private reconnectInterval = 5000; // 5 seconds
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

	constructor() {
		super();
		if (browser) {
			this.connect();
		}
	}

	private connect() {
		const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
		const host = window.location.host;

		this.socket = new WebSocket(`${protocol}://${host}/websocket`);

		this.socket.addEventListener('open', () => {
			if (this.reconnectTimer) {
				clearTimeout(this.reconnectTimer);
				this.reconnectTimer = null;
			}
		});

		this.socket.addEventListener('message', (event) => {
			this.onMessage(event);
		});

		this.socket.addEventListener('close', () => {
			this.scheduleReconnect();
		});
	}

	private scheduleReconnect() {
		if (!this.reconnectTimer) {
			this.reconnectTimer = setTimeout(() => {
				this.connect();
			}, this.reconnectInterval);
		}
	}

	private onMessage(event: { data: ArrayBuffer | Buffer | Buffer[] | string }) {
		if (event.data) {
			const newmessage = JSON.parse(
				typeof event.data === 'string' ? event.data : event.data.toString()
			);
			this.messages.push(newmessage);
			this.emit(newmessage.messageType, newmessage.data);
			this.emit('message', newmessage); // global broadcast
		}
	}
}

export const socket = new socketState();
