/**
 * Public definitions
 */

/**
 * Socket IO Server
 */
interface SocketIOServer {
  attachController(controller);
  io: SocketIO.Server
}
/**
 * Bootstrap root controller and create io server
 * @param RootController
 * @returns {SocketIOServer} server
 */
export function bootstrapSocketIO(rootController): SocketIOServer;

/**
 * Creates server with options
 * @param {number | string | HttpServer} serverOrPort
 * @param {any} options
 * @returns {(target:Function)=>void}
 * @constructor
 */
export function Connect(serverOrPort: any, opts?: any);

/**
 * Registers middleware
 * @param {Function} fn
 * @returns {(target:Function)=>void}
 * @constructor
 */
export function Middleware(fn: Function);

/**
 * Register global event (**io.on**)
 * @param {string} event
 * @constructor
 */
export function OnIO(event: string);

/**
 * register **connection** listener (**io.on('connection', fn)**)
 * @constructor
 */
export function OnConnect();

/**
 * @alias {OnConnect}
 * @type {()=>MethodDecorator}
 */
export function OnConnection();

/**
 * Register socket event (**socket.on**);
 * @param {string} event
 * @constructor
 */
export function OnSocket(event: string);

/**
 * Returns server itself
 * @type {(name?:string)=>ParameterDecorator}
 */
export function IO();

/**
 * Returns socket
 * @type {(name?:string)=>ParameterDecorator}
 */
export function Socket();

/**
 * Returns event arguments (excluding callback)(if it exists)
 * @type {(name?:string)=>ParameterDecorator}
 */
export function Args();

/**
 * Returns callback function (if it exists)
 * @type {(name?:string)=>ParameterDecorator}
 */
export function Callback();
