declare const console: any;
declare const setTimeout: any;
declare const clearTimeout: any;
declare const setInterval: any;
declare const clearInterval: any;

let GLOBAL: any = {
    Infinity,
    NaN,
    undefined,

    isFinite,
    isNaN,
    parseFloat,
    parseInt,
    decodeURI,
    decodeURIComponent,
    encodeURI,
    encodeURIComponent,
    escape,
    unescape,

    Object,
    Function,
    Boolean,
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,

    Number,
    Math,
    Date,

    String,
    RegExp,

    Array,

    JSON,
};

if (typeof eval !== 'undefined') GLOBAL.eval = eval;

if (typeof Symbol !== 'undefined') GLOBAL.Symbol = Symbol;

if (typeof Int8Array !== 'undefined') GLOBAL.Int8Array = Int8Array;
if (typeof Uint8Array !== 'undefined') GLOBAL.Uint8Array = Uint8Array;
if (typeof Uint8ClampedArray !== 'undefined') GLOBAL.Uint8ClampedArray = Uint8ClampedArray;
if (typeof Int16Array !== 'undefined') GLOBAL.Int16Array = Int16Array;
if (typeof Uint16Array !== 'undefined') GLOBAL.Uint16Array = Uint16Array;
if (typeof Int32Array !== 'undefined') GLOBAL.Int32Array = Int32Array;
if (typeof Uint32Array !== 'undefined') GLOBAL.Uint32Array = Uint32Array;
if (typeof Float32Array !== 'undefined') GLOBAL.Float32Array = Float32Array;
if (typeof Float64Array !== 'undefined') GLOBAL.Float64Array = Float64Array;

if (typeof ArrayBuffer !== 'undefined') GLOBAL.ArrayBuffer = ArrayBuffer;
if (typeof DataView !== 'undefined') GLOBAL.DataView = DataView;

if (typeof Map !== 'undefined') GLOBAL.Map = Map;
if (typeof Set !== 'undefined') GLOBAL.Set = Set;
if (typeof WeakMap !== 'undefined') GLOBAL.WeakMap = WeakMap;
if (typeof WeakSet !== 'undefined') GLOBAL.WeakSet = WeakSet;

if (typeof Promise !== 'undefined') GLOBAL.Promise = Promise;

if (typeof Reflect !== 'undefined') GLOBAL.Reflect = Reflect;
if (typeof Proxy !== 'undefined') GLOBAL.Proxy = Proxy;

if (typeof console !== 'undefined') GLOBAL.console = console;

if (typeof setTimeout !== 'undefined') GLOBAL.setTimeout = setTimeout;
if (typeof clearTimeout !== 'undefined') GLOBAL.clearTimeout = clearTimeout;
if (typeof setInterval !== 'undefined') GLOBAL.setInterval = setInterval;
if (typeof clearInterval !== 'undefined') GLOBAL.clearInterval = clearInterval;

export default GLOBAL;
