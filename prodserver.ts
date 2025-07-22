import { createWSSGlobalInstance, onHttpServerUpgrade } from './src/lib/websocket/server.svelte.ts';

createWSSGlobalInstance();

const { server } = await import('./build/index.js');

// Handle WebSocket upgrades before any other request handling
server.server.removeAllListeners('upgrade'); // Remove any existing upgrade listeners
server.server.on('upgrade', (request, socket, head) => {
	if (request.url?.startsWith('/websocket')) {
		onHttpServerUpgrade(request, socket, head);
	} else {
		socket.destroy();
	}
});
