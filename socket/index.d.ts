/**
 * Public definitions
 */

/**
 * Attach controllers to IO server
 * @param {SocketIO.Server} io
 * @param {Object[]} Controllers
 */
export function bootstrapSocketIO(io: SocketIO.Server, Controllers: any[])

/**
 * Attach Controller to already existed socket io server
 * With this approach you can't define global middleware, it's up to you.
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * @param Controller
 */
export function attachControllerToSocket(io: SocketIO.Server, socket: SocketIO.Socket, Controller);

/**
 * Registers controller for namespace
 * @param {String} namespace
 * @returns {(target:Function)=>void}
 * @constructor
 */
export function Controller(namespace: string);

/**
 * Registers global middleware
 * @param {Function} fn
 * @returns {(target:Function)=>void}
 * @constructor
 */
export function Middleware(fn: Function);

/**
 * Registers socket middleware
 * @param {Function} fn
 * @returns {(target:Function)=>void}
 * @constructor
 */
export function SocketMiddleware(fn: Function);

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
 * Register disconnect socket event (**socket.on('disconnect', fn)**);
 * @constructor
 */
export function OnDisconnect();

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
