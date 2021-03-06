const dgramAsPromised = require("dgram-as-promised");
import { Pixel } from "./pixel";
const packetTimeout = require('./config.json').general.timeout;

export class UDPClient {
	private socket = dgramAsPromised.createSocket('udp4');
	private port: number;
	private ipAddress: string;
	private messageQueue: Array<Pixel[]> = [];

	constructor(ipAddress: string, port: number) {
		this.port = port;
		this.ipAddress = ipAddress;
		this.send();
	}

	public async send() {
		
		if (!this.messageQueue || this.messageQueue.length === 0) {
			setTimeout(() => { this.send() }, packetTimeout);			
			return;
		}

		let sending: Pixel[] = this.messageQueue.shift();
		for (let i = 0; i < sending.length; i++) {
			let theResponse = await this.socket.send(sending[i].getString(), 0, sending[i].getString().length, this.port, this.ipAddress);
			console.log(sending[i].getIndex() + " sent");			
		}

		setTimeout(() => { this.send() }, packetTimeout);
	}

	public queue(message: Pixel[]): void {
		this.messageQueue.push(message);
	}

	public clearMessageQueue = function (): void {
		this.messageQueue = [];
	}
}