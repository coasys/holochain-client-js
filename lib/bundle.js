var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@msgpack/msgpack/dist/utils/int.js
var require_int = __commonJS({
  "node_modules/@msgpack/msgpack/dist/utils/int.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.getUint64 = exports3.getInt64 = exports3.setInt64 = exports3.setUint64 = exports3.UINT32_MAX = void 0;
    exports3.UINT32_MAX = 4294967295;
    function setUint64(view, offset, value) {
      const high = value / 4294967296;
      const low = value;
      view.setUint32(offset, high);
      view.setUint32(offset + 4, low);
    }
    exports3.setUint64 = setUint64;
    function setInt64(view, offset, value) {
      const high = Math.floor(value / 4294967296);
      const low = value;
      view.setUint32(offset, high);
      view.setUint32(offset + 4, low);
    }
    exports3.setInt64 = setInt64;
    function getInt64(view, offset) {
      const high = view.getInt32(offset);
      const low = view.getUint32(offset + 4);
      return high * 4294967296 + low;
    }
    exports3.getInt64 = getInt64;
    function getUint64(view, offset) {
      const high = view.getUint32(offset);
      const low = view.getUint32(offset + 4);
      return high * 4294967296 + low;
    }
    exports3.getUint64 = getUint64;
  }
});

// node_modules/@msgpack/msgpack/dist/utils/utf8.js
var require_utf8 = __commonJS({
  "node_modules/@msgpack/msgpack/dist/utils/utf8.js"(exports3) {
    "use strict";
    var _a;
    var _b;
    var _c;
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.utf8DecodeTD = exports3.TEXT_DECODER_THRESHOLD = exports3.utf8DecodeJs = exports3.utf8EncodeTE = exports3.TEXT_ENCODER_THRESHOLD = exports3.utf8EncodeJs = exports3.utf8Count = void 0;
    var int_1 = require_int();
    var TEXT_ENCODING_AVAILABLE = (typeof process === "undefined" || ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a["TEXT_ENCODING"]) !== "never") && typeof TextEncoder !== "undefined" && typeof TextDecoder !== "undefined";
    function utf8Count(str) {
      const strLength = str.length;
      let byteLength = 0;
      let pos = 0;
      while (pos < strLength) {
        let value = str.charCodeAt(pos++);
        if ((value & 4294967168) === 0) {
          byteLength++;
          continue;
        } else if ((value & 4294965248) === 0) {
          byteLength += 2;
        } else {
          if (value >= 55296 && value <= 56319) {
            if (pos < strLength) {
              const extra = str.charCodeAt(pos);
              if ((extra & 64512) === 56320) {
                ++pos;
                value = ((value & 1023) << 10) + (extra & 1023) + 65536;
              }
            }
          }
          if ((value & 4294901760) === 0) {
            byteLength += 3;
          } else {
            byteLength += 4;
          }
        }
      }
      return byteLength;
    }
    exports3.utf8Count = utf8Count;
    function utf8EncodeJs(str, output, outputOffset) {
      const strLength = str.length;
      let offset = outputOffset;
      let pos = 0;
      while (pos < strLength) {
        let value = str.charCodeAt(pos++);
        if ((value & 4294967168) === 0) {
          output[offset++] = value;
          continue;
        } else if ((value & 4294965248) === 0) {
          output[offset++] = value >> 6 & 31 | 192;
        } else {
          if (value >= 55296 && value <= 56319) {
            if (pos < strLength) {
              const extra = str.charCodeAt(pos);
              if ((extra & 64512) === 56320) {
                ++pos;
                value = ((value & 1023) << 10) + (extra & 1023) + 65536;
              }
            }
          }
          if ((value & 4294901760) === 0) {
            output[offset++] = value >> 12 & 15 | 224;
            output[offset++] = value >> 6 & 63 | 128;
          } else {
            output[offset++] = value >> 18 & 7 | 240;
            output[offset++] = value >> 12 & 63 | 128;
            output[offset++] = value >> 6 & 63 | 128;
          }
        }
        output[offset++] = value & 63 | 128;
      }
    }
    exports3.utf8EncodeJs = utf8EncodeJs;
    var sharedTextEncoder = TEXT_ENCODING_AVAILABLE ? new TextEncoder() : void 0;
    exports3.TEXT_ENCODER_THRESHOLD = !TEXT_ENCODING_AVAILABLE ? int_1.UINT32_MAX : typeof process !== "undefined" && ((_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b["TEXT_ENCODING"]) !== "force" ? 200 : 0;
    function utf8EncodeTEencode(str, output, outputOffset) {
      output.set(sharedTextEncoder.encode(str), outputOffset);
    }
    function utf8EncodeTEencodeInto(str, output, outputOffset) {
      sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
    }
    exports3.utf8EncodeTE = (sharedTextEncoder === null || sharedTextEncoder === void 0 ? void 0 : sharedTextEncoder.encodeInto) ? utf8EncodeTEencodeInto : utf8EncodeTEencode;
    var CHUNK_SIZE = 4096;
    function utf8DecodeJs(bytes, inputOffset, byteLength) {
      let offset = inputOffset;
      const end = offset + byteLength;
      const units = [];
      let result = "";
      while (offset < end) {
        const byte1 = bytes[offset++];
        if ((byte1 & 128) === 0) {
          units.push(byte1);
        } else if ((byte1 & 224) === 192) {
          const byte2 = bytes[offset++] & 63;
          units.push((byte1 & 31) << 6 | byte2);
        } else if ((byte1 & 240) === 224) {
          const byte2 = bytes[offset++] & 63;
          const byte3 = bytes[offset++] & 63;
          units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
        } else if ((byte1 & 248) === 240) {
          const byte2 = bytes[offset++] & 63;
          const byte3 = bytes[offset++] & 63;
          const byte4 = bytes[offset++] & 63;
          let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
          if (unit > 65535) {
            unit -= 65536;
            units.push(unit >>> 10 & 1023 | 55296);
            unit = 56320 | unit & 1023;
          }
          units.push(unit);
        } else {
          units.push(byte1);
        }
        if (units.length >= CHUNK_SIZE) {
          result += String.fromCharCode(...units);
          units.length = 0;
        }
      }
      if (units.length > 0) {
        result += String.fromCharCode(...units);
      }
      return result;
    }
    exports3.utf8DecodeJs = utf8DecodeJs;
    var sharedTextDecoder = TEXT_ENCODING_AVAILABLE ? new TextDecoder() : null;
    exports3.TEXT_DECODER_THRESHOLD = !TEXT_ENCODING_AVAILABLE ? int_1.UINT32_MAX : typeof process !== "undefined" && ((_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c["TEXT_DECODER"]) !== "force" ? 200 : 0;
    function utf8DecodeTD(bytes, inputOffset, byteLength) {
      const stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
      return sharedTextDecoder.decode(stringBytes);
    }
    exports3.utf8DecodeTD = utf8DecodeTD;
  }
});

// node_modules/@msgpack/msgpack/dist/ExtData.js
var require_ExtData = __commonJS({
  "node_modules/@msgpack/msgpack/dist/ExtData.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.ExtData = void 0;
    var ExtData = class {
      constructor(type, data) {
        this.type = type;
        this.data = data;
      }
    };
    exports3.ExtData = ExtData;
  }
});

// node_modules/@msgpack/msgpack/dist/DecodeError.js
var require_DecodeError = __commonJS({
  "node_modules/@msgpack/msgpack/dist/DecodeError.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.DecodeError = void 0;
    var DecodeError = class _DecodeError extends Error {
      constructor(message) {
        super(message);
        const proto = Object.create(_DecodeError.prototype);
        Object.setPrototypeOf(this, proto);
        Object.defineProperty(this, "name", {
          configurable: true,
          enumerable: false,
          value: _DecodeError.name
        });
      }
    };
    exports3.DecodeError = DecodeError;
  }
});

// node_modules/@msgpack/msgpack/dist/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/@msgpack/msgpack/dist/timestamp.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.timestampExtension = exports3.decodeTimestampExtension = exports3.decodeTimestampToTimeSpec = exports3.encodeTimestampExtension = exports3.encodeDateToTimeSpec = exports3.encodeTimeSpecToTimestamp = exports3.EXT_TIMESTAMP = void 0;
    var DecodeError_1 = require_DecodeError();
    var int_1 = require_int();
    exports3.EXT_TIMESTAMP = -1;
    var TIMESTAMP32_MAX_SEC = 4294967296 - 1;
    var TIMESTAMP64_MAX_SEC = 17179869184 - 1;
    function encodeTimeSpecToTimestamp({ sec, nsec }) {
      if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
        if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
          const rv = new Uint8Array(4);
          const view = new DataView(rv.buffer);
          view.setUint32(0, sec);
          return rv;
        } else {
          const secHigh = sec / 4294967296;
          const secLow = sec & 4294967295;
          const rv = new Uint8Array(8);
          const view = new DataView(rv.buffer);
          view.setUint32(0, nsec << 2 | secHigh & 3);
          view.setUint32(4, secLow);
          return rv;
        }
      } else {
        const rv = new Uint8Array(12);
        const view = new DataView(rv.buffer);
        view.setUint32(0, nsec);
        (0, int_1.setInt64)(view, 4, sec);
        return rv;
      }
    }
    exports3.encodeTimeSpecToTimestamp = encodeTimeSpecToTimestamp;
    function encodeDateToTimeSpec(date) {
      const msec = date.getTime();
      const sec = Math.floor(msec / 1e3);
      const nsec = (msec - sec * 1e3) * 1e6;
      const nsecInSec = Math.floor(nsec / 1e9);
      return {
        sec: sec + nsecInSec,
        nsec: nsec - nsecInSec * 1e9
      };
    }
    exports3.encodeDateToTimeSpec = encodeDateToTimeSpec;
    function encodeTimestampExtension(object) {
      if (object instanceof Date) {
        const timeSpec = encodeDateToTimeSpec(object);
        return encodeTimeSpecToTimestamp(timeSpec);
      } else {
        return null;
      }
    }
    exports3.encodeTimestampExtension = encodeTimestampExtension;
    function decodeTimestampToTimeSpec(data) {
      const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
      switch (data.byteLength) {
        case 4: {
          const sec = view.getUint32(0);
          const nsec = 0;
          return { sec, nsec };
        }
        case 8: {
          const nsec30AndSecHigh2 = view.getUint32(0);
          const secLow32 = view.getUint32(4);
          const sec = (nsec30AndSecHigh2 & 3) * 4294967296 + secLow32;
          const nsec = nsec30AndSecHigh2 >>> 2;
          return { sec, nsec };
        }
        case 12: {
          const sec = (0, int_1.getInt64)(view, 4);
          const nsec = view.getUint32(0);
          return { sec, nsec };
        }
        default:
          throw new DecodeError_1.DecodeError(`Unrecognized data size for timestamp (expected 4, 8, or 12): ${data.length}`);
      }
    }
    exports3.decodeTimestampToTimeSpec = decodeTimestampToTimeSpec;
    function decodeTimestampExtension(data) {
      const timeSpec = decodeTimestampToTimeSpec(data);
      return new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
    }
    exports3.decodeTimestampExtension = decodeTimestampExtension;
    exports3.timestampExtension = {
      type: exports3.EXT_TIMESTAMP,
      encode: encodeTimestampExtension,
      decode: decodeTimestampExtension
    };
  }
});

// node_modules/@msgpack/msgpack/dist/ExtensionCodec.js
var require_ExtensionCodec = __commonJS({
  "node_modules/@msgpack/msgpack/dist/ExtensionCodec.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.ExtensionCodec = void 0;
    var ExtData_1 = require_ExtData();
    var timestamp_1 = require_timestamp();
    var ExtensionCodec = class {
      constructor() {
        this.builtInEncoders = [];
        this.builtInDecoders = [];
        this.encoders = [];
        this.decoders = [];
        this.register(timestamp_1.timestampExtension);
      }
      register({ type, encode: encode5, decode: decode4 }) {
        if (type >= 0) {
          this.encoders[type] = encode5;
          this.decoders[type] = decode4;
        } else {
          const index = 1 + type;
          this.builtInEncoders[index] = encode5;
          this.builtInDecoders[index] = decode4;
        }
      }
      tryToEncode(object, context) {
        for (let i = 0; i < this.builtInEncoders.length; i++) {
          const encodeExt = this.builtInEncoders[i];
          if (encodeExt != null) {
            const data = encodeExt(object, context);
            if (data != null) {
              const type = -1 - i;
              return new ExtData_1.ExtData(type, data);
            }
          }
        }
        for (let i = 0; i < this.encoders.length; i++) {
          const encodeExt = this.encoders[i];
          if (encodeExt != null) {
            const data = encodeExt(object, context);
            if (data != null) {
              const type = i;
              return new ExtData_1.ExtData(type, data);
            }
          }
        }
        if (object instanceof ExtData_1.ExtData) {
          return object;
        }
        return null;
      }
      decode(data, type, context) {
        const decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
        if (decodeExt) {
          return decodeExt(data, type, context);
        } else {
          return new ExtData_1.ExtData(type, data);
        }
      }
    };
    exports3.ExtensionCodec = ExtensionCodec;
    ExtensionCodec.defaultCodec = new ExtensionCodec();
  }
});

// node_modules/@msgpack/msgpack/dist/utils/typedArrays.js
var require_typedArrays = __commonJS({
  "node_modules/@msgpack/msgpack/dist/utils/typedArrays.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.createDataView = exports3.ensureUint8Array = void 0;
    function ensureUint8Array(buffer) {
      if (buffer instanceof Uint8Array) {
        return buffer;
      } else if (ArrayBuffer.isView(buffer)) {
        return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      } else if (buffer instanceof ArrayBuffer) {
        return new Uint8Array(buffer);
      } else {
        return Uint8Array.from(buffer);
      }
    }
    exports3.ensureUint8Array = ensureUint8Array;
    function createDataView(buffer) {
      if (buffer instanceof ArrayBuffer) {
        return new DataView(buffer);
      }
      const bufferView = ensureUint8Array(buffer);
      return new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
    }
    exports3.createDataView = createDataView;
  }
});

// node_modules/@msgpack/msgpack/dist/Encoder.js
var require_Encoder = __commonJS({
  "node_modules/@msgpack/msgpack/dist/Encoder.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.Encoder = exports3.DEFAULT_INITIAL_BUFFER_SIZE = exports3.DEFAULT_MAX_DEPTH = void 0;
    var utf8_1 = require_utf8();
    var ExtensionCodec_1 = require_ExtensionCodec();
    var int_1 = require_int();
    var typedArrays_1 = require_typedArrays();
    exports3.DEFAULT_MAX_DEPTH = 100;
    exports3.DEFAULT_INITIAL_BUFFER_SIZE = 2048;
    var Encoder = class {
      constructor(extensionCodec = ExtensionCodec_1.ExtensionCodec.defaultCodec, context = void 0, maxDepth = exports3.DEFAULT_MAX_DEPTH, initialBufferSize = exports3.DEFAULT_INITIAL_BUFFER_SIZE, sortKeys = false, forceFloat32 = false, ignoreUndefined = false, forceIntegerToFloat = false) {
        this.extensionCodec = extensionCodec;
        this.context = context;
        this.maxDepth = maxDepth;
        this.initialBufferSize = initialBufferSize;
        this.sortKeys = sortKeys;
        this.forceFloat32 = forceFloat32;
        this.ignoreUndefined = ignoreUndefined;
        this.forceIntegerToFloat = forceIntegerToFloat;
        this.pos = 0;
        this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
        this.bytes = new Uint8Array(this.view.buffer);
      }
      reinitializeState() {
        this.pos = 0;
      }
      /**
       * This is almost equivalent to {@link Encoder#encode}, but it returns an reference of the encoder's internal buffer and thus much faster than {@link Encoder#encode}.
       *
       * @returns Encodes the object and returns a shared reference the encoder's internal buffer.
       */
      encodeSharedRef(object) {
        this.reinitializeState();
        this.doEncode(object, 1);
        return this.bytes.subarray(0, this.pos);
      }
      /**
       * @returns Encodes the object and returns a copy of the encoder's internal buffer.
       */
      encode(object) {
        this.reinitializeState();
        this.doEncode(object, 1);
        return this.bytes.slice(0, this.pos);
      }
      doEncode(object, depth) {
        if (depth > this.maxDepth) {
          throw new Error(`Too deep objects in depth ${depth}`);
        }
        if (object == null) {
          this.encodeNil();
        } else if (typeof object === "boolean") {
          this.encodeBoolean(object);
        } else if (typeof object === "number") {
          this.encodeNumber(object);
        } else if (typeof object === "string") {
          this.encodeString(object);
        } else {
          this.encodeObject(object, depth);
        }
      }
      ensureBufferSizeToWrite(sizeToWrite) {
        const requiredSize = this.pos + sizeToWrite;
        if (this.view.byteLength < requiredSize) {
          this.resizeBuffer(requiredSize * 2);
        }
      }
      resizeBuffer(newSize) {
        const newBuffer = new ArrayBuffer(newSize);
        const newBytes = new Uint8Array(newBuffer);
        const newView = new DataView(newBuffer);
        newBytes.set(this.bytes);
        this.view = newView;
        this.bytes = newBytes;
      }
      encodeNil() {
        this.writeU8(192);
      }
      encodeBoolean(object) {
        if (object === false) {
          this.writeU8(194);
        } else {
          this.writeU8(195);
        }
      }
      encodeNumber(object) {
        if (Number.isSafeInteger(object) && !this.forceIntegerToFloat) {
          if (object >= 0) {
            if (object < 128) {
              this.writeU8(object);
            } else if (object < 256) {
              this.writeU8(204);
              this.writeU8(object);
            } else if (object < 65536) {
              this.writeU8(205);
              this.writeU16(object);
            } else if (object < 4294967296) {
              this.writeU8(206);
              this.writeU32(object);
            } else {
              this.writeU8(207);
              this.writeU64(object);
            }
          } else {
            if (object >= -32) {
              this.writeU8(224 | object + 32);
            } else if (object >= -128) {
              this.writeU8(208);
              this.writeI8(object);
            } else if (object >= -32768) {
              this.writeU8(209);
              this.writeI16(object);
            } else if (object >= -2147483648) {
              this.writeU8(210);
              this.writeI32(object);
            } else {
              this.writeU8(211);
              this.writeI64(object);
            }
          }
        } else {
          if (this.forceFloat32) {
            this.writeU8(202);
            this.writeF32(object);
          } else {
            this.writeU8(203);
            this.writeF64(object);
          }
        }
      }
      writeStringHeader(byteLength) {
        if (byteLength < 32) {
          this.writeU8(160 + byteLength);
        } else if (byteLength < 256) {
          this.writeU8(217);
          this.writeU8(byteLength);
        } else if (byteLength < 65536) {
          this.writeU8(218);
          this.writeU16(byteLength);
        } else if (byteLength < 4294967296) {
          this.writeU8(219);
          this.writeU32(byteLength);
        } else {
          throw new Error(`Too long string: ${byteLength} bytes in UTF-8`);
        }
      }
      encodeString(object) {
        const maxHeaderSize = 1 + 4;
        const strLength = object.length;
        if (strLength > utf8_1.TEXT_ENCODER_THRESHOLD) {
          const byteLength = (0, utf8_1.utf8Count)(object);
          this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
          this.writeStringHeader(byteLength);
          (0, utf8_1.utf8EncodeTE)(object, this.bytes, this.pos);
          this.pos += byteLength;
        } else {
          const byteLength = (0, utf8_1.utf8Count)(object);
          this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
          this.writeStringHeader(byteLength);
          (0, utf8_1.utf8EncodeJs)(object, this.bytes, this.pos);
          this.pos += byteLength;
        }
      }
      encodeObject(object, depth) {
        const ext = this.extensionCodec.tryToEncode(object, this.context);
        if (ext != null) {
          this.encodeExtension(ext);
        } else if (Array.isArray(object)) {
          this.encodeArray(object, depth);
        } else if (ArrayBuffer.isView(object)) {
          this.encodeBinary(object);
        } else if (typeof object === "object") {
          this.encodeMap(object, depth);
        } else {
          throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(object)}`);
        }
      }
      encodeBinary(object) {
        const size = object.byteLength;
        if (size < 256) {
          this.writeU8(196);
          this.writeU8(size);
        } else if (size < 65536) {
          this.writeU8(197);
          this.writeU16(size);
        } else if (size < 4294967296) {
          this.writeU8(198);
          this.writeU32(size);
        } else {
          throw new Error(`Too large binary: ${size}`);
        }
        const bytes = (0, typedArrays_1.ensureUint8Array)(object);
        this.writeU8a(bytes);
      }
      encodeArray(object, depth) {
        const size = object.length;
        if (size < 16) {
          this.writeU8(144 + size);
        } else if (size < 65536) {
          this.writeU8(220);
          this.writeU16(size);
        } else if (size < 4294967296) {
          this.writeU8(221);
          this.writeU32(size);
        } else {
          throw new Error(`Too large array: ${size}`);
        }
        for (const item of object) {
          this.doEncode(item, depth + 1);
        }
      }
      countWithoutUndefined(object, keys2) {
        let count = 0;
        for (const key of keys2) {
          if (object[key] !== void 0) {
            count++;
          }
        }
        return count;
      }
      encodeMap(object, depth) {
        const keys2 = Object.keys(object);
        if (this.sortKeys) {
          keys2.sort();
        }
        const size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys2) : keys2.length;
        if (size < 16) {
          this.writeU8(128 + size);
        } else if (size < 65536) {
          this.writeU8(222);
          this.writeU16(size);
        } else if (size < 4294967296) {
          this.writeU8(223);
          this.writeU32(size);
        } else {
          throw new Error(`Too large map object: ${size}`);
        }
        for (const key of keys2) {
          const value = object[key];
          if (!(this.ignoreUndefined && value === void 0)) {
            this.encodeString(key);
            this.doEncode(value, depth + 1);
          }
        }
      }
      encodeExtension(ext) {
        const size = ext.data.length;
        if (size === 1) {
          this.writeU8(212);
        } else if (size === 2) {
          this.writeU8(213);
        } else if (size === 4) {
          this.writeU8(214);
        } else if (size === 8) {
          this.writeU8(215);
        } else if (size === 16) {
          this.writeU8(216);
        } else if (size < 256) {
          this.writeU8(199);
          this.writeU8(size);
        } else if (size < 65536) {
          this.writeU8(200);
          this.writeU16(size);
        } else if (size < 4294967296) {
          this.writeU8(201);
          this.writeU32(size);
        } else {
          throw new Error(`Too large extension object: ${size}`);
        }
        this.writeI8(ext.type);
        this.writeU8a(ext.data);
      }
      writeU8(value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setUint8(this.pos, value);
        this.pos++;
      }
      writeU8a(values) {
        const size = values.length;
        this.ensureBufferSizeToWrite(size);
        this.bytes.set(values, this.pos);
        this.pos += size;
      }
      writeI8(value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setInt8(this.pos, value);
        this.pos++;
      }
      writeU16(value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setUint16(this.pos, value);
        this.pos += 2;
      }
      writeI16(value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setInt16(this.pos, value);
        this.pos += 2;
      }
      writeU32(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setUint32(this.pos, value);
        this.pos += 4;
      }
      writeI32(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setInt32(this.pos, value);
        this.pos += 4;
      }
      writeF32(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setFloat32(this.pos, value);
        this.pos += 4;
      }
      writeF64(value) {
        this.ensureBufferSizeToWrite(8);
        this.view.setFloat64(this.pos, value);
        this.pos += 8;
      }
      writeU64(value) {
        this.ensureBufferSizeToWrite(8);
        (0, int_1.setUint64)(this.view, this.pos, value);
        this.pos += 8;
      }
      writeI64(value) {
        this.ensureBufferSizeToWrite(8);
        (0, int_1.setInt64)(this.view, this.pos, value);
        this.pos += 8;
      }
    };
    exports3.Encoder = Encoder;
  }
});

// node_modules/@msgpack/msgpack/dist/encode.js
var require_encode = __commonJS({
  "node_modules/@msgpack/msgpack/dist/encode.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.encode = void 0;
    var Encoder_1 = require_Encoder();
    var defaultEncodeOptions = {};
    function encode5(value, options = defaultEncodeOptions) {
      const encoder = new Encoder_1.Encoder(options.extensionCodec, options.context, options.maxDepth, options.initialBufferSize, options.sortKeys, options.forceFloat32, options.ignoreUndefined, options.forceIntegerToFloat);
      return encoder.encodeSharedRef(value);
    }
    exports3.encode = encode5;
  }
});

// node_modules/@msgpack/msgpack/dist/utils/prettyByte.js
var require_prettyByte = __commonJS({
  "node_modules/@msgpack/msgpack/dist/utils/prettyByte.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.prettyByte = void 0;
    function prettyByte(byte) {
      return `${byte < 0 ? "-" : ""}0x${Math.abs(byte).toString(16).padStart(2, "0")}`;
    }
    exports3.prettyByte = prettyByte;
  }
});

// node_modules/@msgpack/msgpack/dist/CachedKeyDecoder.js
var require_CachedKeyDecoder = __commonJS({
  "node_modules/@msgpack/msgpack/dist/CachedKeyDecoder.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.CachedKeyDecoder = void 0;
    var utf8_1 = require_utf8();
    var DEFAULT_MAX_KEY_LENGTH = 16;
    var DEFAULT_MAX_LENGTH_PER_KEY = 16;
    var CachedKeyDecoder = class {
      constructor(maxKeyLength = DEFAULT_MAX_KEY_LENGTH, maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY) {
        this.maxKeyLength = maxKeyLength;
        this.maxLengthPerKey = maxLengthPerKey;
        this.hit = 0;
        this.miss = 0;
        this.caches = [];
        for (let i = 0; i < this.maxKeyLength; i++) {
          this.caches.push([]);
        }
      }
      canBeCached(byteLength) {
        return byteLength > 0 && byteLength <= this.maxKeyLength;
      }
      find(bytes, inputOffset, byteLength) {
        const records = this.caches[byteLength - 1];
        FIND_CHUNK:
          for (const record of records) {
            const recordBytes = record.bytes;
            for (let j = 0; j < byteLength; j++) {
              if (recordBytes[j] !== bytes[inputOffset + j]) {
                continue FIND_CHUNK;
              }
            }
            return record.str;
          }
        return null;
      }
      store(bytes, value) {
        const records = this.caches[bytes.length - 1];
        const record = { bytes, str: value };
        if (records.length >= this.maxLengthPerKey) {
          records[Math.random() * records.length | 0] = record;
        } else {
          records.push(record);
        }
      }
      decode(bytes, inputOffset, byteLength) {
        const cachedValue = this.find(bytes, inputOffset, byteLength);
        if (cachedValue != null) {
          this.hit++;
          return cachedValue;
        }
        this.miss++;
        const str = (0, utf8_1.utf8DecodeJs)(bytes, inputOffset, byteLength);
        const slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
        this.store(slicedCopyOfBytes, str);
        return str;
      }
    };
    exports3.CachedKeyDecoder = CachedKeyDecoder;
  }
});

// node_modules/@msgpack/msgpack/dist/Decoder.js
var require_Decoder = __commonJS({
  "node_modules/@msgpack/msgpack/dist/Decoder.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.Decoder = exports3.DataViewIndexOutOfBoundsError = void 0;
    var prettyByte_1 = require_prettyByte();
    var ExtensionCodec_1 = require_ExtensionCodec();
    var int_1 = require_int();
    var utf8_1 = require_utf8();
    var typedArrays_1 = require_typedArrays();
    var CachedKeyDecoder_1 = require_CachedKeyDecoder();
    var DecodeError_1 = require_DecodeError();
    var isValidMapKeyType = (key) => {
      const keyType = typeof key;
      return keyType === "string" || keyType === "number";
    };
    var HEAD_BYTE_REQUIRED = -1;
    var EMPTY_VIEW = new DataView(new ArrayBuffer(0));
    var EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
    exports3.DataViewIndexOutOfBoundsError = (() => {
      try {
        EMPTY_VIEW.getInt8(0);
      } catch (e2) {
        return e2.constructor;
      }
      throw new Error("never reached");
    })();
    var MORE_DATA = new exports3.DataViewIndexOutOfBoundsError("Insufficient data");
    var sharedCachedKeyDecoder = new CachedKeyDecoder_1.CachedKeyDecoder();
    var Decoder = class {
      constructor(extensionCodec = ExtensionCodec_1.ExtensionCodec.defaultCodec, context = void 0, maxStrLength = int_1.UINT32_MAX, maxBinLength = int_1.UINT32_MAX, maxArrayLength = int_1.UINT32_MAX, maxMapLength = int_1.UINT32_MAX, maxExtLength = int_1.UINT32_MAX, keyDecoder = sharedCachedKeyDecoder) {
        this.extensionCodec = extensionCodec;
        this.context = context;
        this.maxStrLength = maxStrLength;
        this.maxBinLength = maxBinLength;
        this.maxArrayLength = maxArrayLength;
        this.maxMapLength = maxMapLength;
        this.maxExtLength = maxExtLength;
        this.keyDecoder = keyDecoder;
        this.totalPos = 0;
        this.pos = 0;
        this.view = EMPTY_VIEW;
        this.bytes = EMPTY_BYTES;
        this.headByte = HEAD_BYTE_REQUIRED;
        this.stack = [];
      }
      reinitializeState() {
        this.totalPos = 0;
        this.headByte = HEAD_BYTE_REQUIRED;
        this.stack.length = 0;
      }
      setBuffer(buffer) {
        this.bytes = (0, typedArrays_1.ensureUint8Array)(buffer);
        this.view = (0, typedArrays_1.createDataView)(this.bytes);
        this.pos = 0;
      }
      appendBuffer(buffer) {
        if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) {
          this.setBuffer(buffer);
        } else {
          const remainingData = this.bytes.subarray(this.pos);
          const newData = (0, typedArrays_1.ensureUint8Array)(buffer);
          const newBuffer = new Uint8Array(remainingData.length + newData.length);
          newBuffer.set(remainingData);
          newBuffer.set(newData, remainingData.length);
          this.setBuffer(newBuffer);
        }
      }
      hasRemaining(size) {
        return this.view.byteLength - this.pos >= size;
      }
      createExtraByteError(posToShow) {
        const { view, pos } = this;
        return new RangeError(`Extra ${view.byteLength - pos} of ${view.byteLength} byte(s) found at buffer[${posToShow}]`);
      }
      /**
       * @throws {@link DecodeError}
       * @throws {@link RangeError}
       */
      decode(buffer) {
        this.reinitializeState();
        this.setBuffer(buffer);
        const object = this.doDecodeSync();
        if (this.hasRemaining(1)) {
          throw this.createExtraByteError(this.pos);
        }
        return object;
      }
      *decodeMulti(buffer) {
        this.reinitializeState();
        this.setBuffer(buffer);
        while (this.hasRemaining(1)) {
          yield this.doDecodeSync();
        }
      }
      async decodeAsync(stream) {
        let decoded = false;
        let object;
        for await (const buffer of stream) {
          if (decoded) {
            throw this.createExtraByteError(this.totalPos);
          }
          this.appendBuffer(buffer);
          try {
            object = this.doDecodeSync();
            decoded = true;
          } catch (e2) {
            if (!(e2 instanceof exports3.DataViewIndexOutOfBoundsError)) {
              throw e2;
            }
          }
          this.totalPos += this.pos;
        }
        if (decoded) {
          if (this.hasRemaining(1)) {
            throw this.createExtraByteError(this.totalPos);
          }
          return object;
        }
        const { headByte, pos, totalPos } = this;
        throw new RangeError(`Insufficient data in parsing ${(0, prettyByte_1.prettyByte)(headByte)} at ${totalPos} (${pos} in the current buffer)`);
      }
      decodeArrayStream(stream) {
        return this.decodeMultiAsync(stream, true);
      }
      decodeStream(stream) {
        return this.decodeMultiAsync(stream, false);
      }
      async *decodeMultiAsync(stream, isArray2) {
        let isArrayHeaderRequired = isArray2;
        let arrayItemsLeft = -1;
        for await (const buffer of stream) {
          if (isArray2 && arrayItemsLeft === 0) {
            throw this.createExtraByteError(this.totalPos);
          }
          this.appendBuffer(buffer);
          if (isArrayHeaderRequired) {
            arrayItemsLeft = this.readArraySize();
            isArrayHeaderRequired = false;
            this.complete();
          }
          try {
            while (true) {
              yield this.doDecodeSync();
              if (--arrayItemsLeft === 0) {
                break;
              }
            }
          } catch (e2) {
            if (!(e2 instanceof exports3.DataViewIndexOutOfBoundsError)) {
              throw e2;
            }
          }
          this.totalPos += this.pos;
        }
      }
      doDecodeSync() {
        DECODE:
          while (true) {
            const headByte = this.readHeadByte();
            let object;
            if (headByte >= 224) {
              object = headByte - 256;
            } else if (headByte < 192) {
              if (headByte < 128) {
                object = headByte;
              } else if (headByte < 144) {
                const size = headByte - 128;
                if (size !== 0) {
                  this.pushMapState(size);
                  this.complete();
                  continue DECODE;
                } else {
                  object = {};
                }
              } else if (headByte < 160) {
                const size = headByte - 144;
                if (size !== 0) {
                  this.pushArrayState(size);
                  this.complete();
                  continue DECODE;
                } else {
                  object = [];
                }
              } else {
                const byteLength = headByte - 160;
                object = this.decodeUtf8String(byteLength, 0);
              }
            } else if (headByte === 192) {
              object = null;
            } else if (headByte === 194) {
              object = false;
            } else if (headByte === 195) {
              object = true;
            } else if (headByte === 202) {
              object = this.readF32();
            } else if (headByte === 203) {
              object = this.readF64();
            } else if (headByte === 204) {
              object = this.readU8();
            } else if (headByte === 205) {
              object = this.readU16();
            } else if (headByte === 206) {
              object = this.readU32();
            } else if (headByte === 207) {
              object = this.readU64();
            } else if (headByte === 208) {
              object = this.readI8();
            } else if (headByte === 209) {
              object = this.readI16();
            } else if (headByte === 210) {
              object = this.readI32();
            } else if (headByte === 211) {
              object = this.readI64();
            } else if (headByte === 217) {
              const byteLength = this.lookU8();
              object = this.decodeUtf8String(byteLength, 1);
            } else if (headByte === 218) {
              const byteLength = this.lookU16();
              object = this.decodeUtf8String(byteLength, 2);
            } else if (headByte === 219) {
              const byteLength = this.lookU32();
              object = this.decodeUtf8String(byteLength, 4);
            } else if (headByte === 220) {
              const size = this.readU16();
              if (size !== 0) {
                this.pushArrayState(size);
                this.complete();
                continue DECODE;
              } else {
                object = [];
              }
            } else if (headByte === 221) {
              const size = this.readU32();
              if (size !== 0) {
                this.pushArrayState(size);
                this.complete();
                continue DECODE;
              } else {
                object = [];
              }
            } else if (headByte === 222) {
              const size = this.readU16();
              if (size !== 0) {
                this.pushMapState(size);
                this.complete();
                continue DECODE;
              } else {
                object = {};
              }
            } else if (headByte === 223) {
              const size = this.readU32();
              if (size !== 0) {
                this.pushMapState(size);
                this.complete();
                continue DECODE;
              } else {
                object = {};
              }
            } else if (headByte === 196) {
              const size = this.lookU8();
              object = this.decodeBinary(size, 1);
            } else if (headByte === 197) {
              const size = this.lookU16();
              object = this.decodeBinary(size, 2);
            } else if (headByte === 198) {
              const size = this.lookU32();
              object = this.decodeBinary(size, 4);
            } else if (headByte === 212) {
              object = this.decodeExtension(1, 0);
            } else if (headByte === 213) {
              object = this.decodeExtension(2, 0);
            } else if (headByte === 214) {
              object = this.decodeExtension(4, 0);
            } else if (headByte === 215) {
              object = this.decodeExtension(8, 0);
            } else if (headByte === 216) {
              object = this.decodeExtension(16, 0);
            } else if (headByte === 199) {
              const size = this.lookU8();
              object = this.decodeExtension(size, 1);
            } else if (headByte === 200) {
              const size = this.lookU16();
              object = this.decodeExtension(size, 2);
            } else if (headByte === 201) {
              const size = this.lookU32();
              object = this.decodeExtension(size, 4);
            } else {
              throw new DecodeError_1.DecodeError(`Unrecognized type byte: ${(0, prettyByte_1.prettyByte)(headByte)}`);
            }
            this.complete();
            const stack = this.stack;
            while (stack.length > 0) {
              const state = stack[stack.length - 1];
              if (state.type === 0) {
                state.array[state.position] = object;
                state.position++;
                if (state.position === state.size) {
                  stack.pop();
                  object = state.array;
                } else {
                  continue DECODE;
                }
              } else if (state.type === 1) {
                if (!isValidMapKeyType(object)) {
                  throw new DecodeError_1.DecodeError("The type of key must be string or number but " + typeof object);
                }
                if (object === "__proto__") {
                  throw new DecodeError_1.DecodeError("The key __proto__ is not allowed");
                }
                state.key = object;
                state.type = 2;
                continue DECODE;
              } else {
                state.map[state.key] = object;
                state.readCount++;
                if (state.readCount === state.size) {
                  stack.pop();
                  object = state.map;
                } else {
                  state.key = null;
                  state.type = 1;
                  continue DECODE;
                }
              }
            }
            return object;
          }
      }
      readHeadByte() {
        if (this.headByte === HEAD_BYTE_REQUIRED) {
          this.headByte = this.readU8();
        }
        return this.headByte;
      }
      complete() {
        this.headByte = HEAD_BYTE_REQUIRED;
      }
      readArraySize() {
        const headByte = this.readHeadByte();
        switch (headByte) {
          case 220:
            return this.readU16();
          case 221:
            return this.readU32();
          default: {
            if (headByte < 160) {
              return headByte - 144;
            } else {
              throw new DecodeError_1.DecodeError(`Unrecognized array type byte: ${(0, prettyByte_1.prettyByte)(headByte)}`);
            }
          }
        }
      }
      pushMapState(size) {
        if (size > this.maxMapLength) {
          throw new DecodeError_1.DecodeError(`Max length exceeded: map length (${size}) > maxMapLengthLength (${this.maxMapLength})`);
        }
        this.stack.push({
          type: 1,
          size,
          key: null,
          readCount: 0,
          map: {}
        });
      }
      pushArrayState(size) {
        if (size > this.maxArrayLength) {
          throw new DecodeError_1.DecodeError(`Max length exceeded: array length (${size}) > maxArrayLength (${this.maxArrayLength})`);
        }
        this.stack.push({
          type: 0,
          size,
          array: new Array(size),
          position: 0
        });
      }
      decodeUtf8String(byteLength, headerOffset) {
        var _a;
        if (byteLength > this.maxStrLength) {
          throw new DecodeError_1.DecodeError(`Max length exceeded: UTF-8 byte length (${byteLength}) > maxStrLength (${this.maxStrLength})`);
        }
        if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
          throw MORE_DATA;
        }
        const offset = this.pos + headerOffset;
        let object;
        if (this.stateIsMapKey() && ((_a = this.keyDecoder) === null || _a === void 0 ? void 0 : _a.canBeCached(byteLength))) {
          object = this.keyDecoder.decode(this.bytes, offset, byteLength);
        } else if (byteLength > utf8_1.TEXT_DECODER_THRESHOLD) {
          object = (0, utf8_1.utf8DecodeTD)(this.bytes, offset, byteLength);
        } else {
          object = (0, utf8_1.utf8DecodeJs)(this.bytes, offset, byteLength);
        }
        this.pos += headerOffset + byteLength;
        return object;
      }
      stateIsMapKey() {
        if (this.stack.length > 0) {
          const state = this.stack[this.stack.length - 1];
          return state.type === 1;
        }
        return false;
      }
      decodeBinary(byteLength, headOffset) {
        if (byteLength > this.maxBinLength) {
          throw new DecodeError_1.DecodeError(`Max length exceeded: bin length (${byteLength}) > maxBinLength (${this.maxBinLength})`);
        }
        if (!this.hasRemaining(byteLength + headOffset)) {
          throw MORE_DATA;
        }
        const offset = this.pos + headOffset;
        const object = this.bytes.subarray(offset, offset + byteLength);
        this.pos += headOffset + byteLength;
        return object;
      }
      decodeExtension(size, headOffset) {
        if (size > this.maxExtLength) {
          throw new DecodeError_1.DecodeError(`Max length exceeded: ext length (${size}) > maxExtLength (${this.maxExtLength})`);
        }
        const extType = this.view.getInt8(this.pos + headOffset);
        const data = this.decodeBinary(
          size,
          headOffset + 1
          /* extType */
        );
        return this.extensionCodec.decode(data, extType, this.context);
      }
      lookU8() {
        return this.view.getUint8(this.pos);
      }
      lookU16() {
        return this.view.getUint16(this.pos);
      }
      lookU32() {
        return this.view.getUint32(this.pos);
      }
      readU8() {
        const value = this.view.getUint8(this.pos);
        this.pos++;
        return value;
      }
      readI8() {
        const value = this.view.getInt8(this.pos);
        this.pos++;
        return value;
      }
      readU16() {
        const value = this.view.getUint16(this.pos);
        this.pos += 2;
        return value;
      }
      readI16() {
        const value = this.view.getInt16(this.pos);
        this.pos += 2;
        return value;
      }
      readU32() {
        const value = this.view.getUint32(this.pos);
        this.pos += 4;
        return value;
      }
      readI32() {
        const value = this.view.getInt32(this.pos);
        this.pos += 4;
        return value;
      }
      readU64() {
        const value = (0, int_1.getUint64)(this.view, this.pos);
        this.pos += 8;
        return value;
      }
      readI64() {
        const value = (0, int_1.getInt64)(this.view, this.pos);
        this.pos += 8;
        return value;
      }
      readF32() {
        const value = this.view.getFloat32(this.pos);
        this.pos += 4;
        return value;
      }
      readF64() {
        const value = this.view.getFloat64(this.pos);
        this.pos += 8;
        return value;
      }
    };
    exports3.Decoder = Decoder;
  }
});

// node_modules/@msgpack/msgpack/dist/decode.js
var require_decode = __commonJS({
  "node_modules/@msgpack/msgpack/dist/decode.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.decodeMulti = exports3.decode = exports3.defaultDecodeOptions = void 0;
    var Decoder_1 = require_Decoder();
    exports3.defaultDecodeOptions = {};
    function decode4(buffer, options = exports3.defaultDecodeOptions) {
      const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
      return decoder.decode(buffer);
    }
    exports3.decode = decode4;
    function decodeMulti(buffer, options = exports3.defaultDecodeOptions) {
      const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
      return decoder.decodeMulti(buffer);
    }
    exports3.decodeMulti = decodeMulti;
  }
});

// node_modules/@msgpack/msgpack/dist/utils/stream.js
var require_stream = __commonJS({
  "node_modules/@msgpack/msgpack/dist/utils/stream.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.ensureAsyncIterable = exports3.asyncIterableFromStream = exports3.isAsyncIterable = void 0;
    function isAsyncIterable(object) {
      return object[Symbol.asyncIterator] != null;
    }
    exports3.isAsyncIterable = isAsyncIterable;
    function assertNonNull(value) {
      if (value == null) {
        throw new Error("Assertion Failure: value must not be null nor undefined");
      }
    }
    async function* asyncIterableFromStream(stream) {
      const reader = stream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            return;
          }
          assertNonNull(value);
          yield value;
        }
      } finally {
        reader.releaseLock();
      }
    }
    exports3.asyncIterableFromStream = asyncIterableFromStream;
    function ensureAsyncIterable(streamLike) {
      if (isAsyncIterable(streamLike)) {
        return streamLike;
      } else {
        return asyncIterableFromStream(streamLike);
      }
    }
    exports3.ensureAsyncIterable = ensureAsyncIterable;
  }
});

// node_modules/@msgpack/msgpack/dist/decodeAsync.js
var require_decodeAsync = __commonJS({
  "node_modules/@msgpack/msgpack/dist/decodeAsync.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.decodeStream = exports3.decodeMultiStream = exports3.decodeArrayStream = exports3.decodeAsync = void 0;
    var Decoder_1 = require_Decoder();
    var stream_1 = require_stream();
    var decode_1 = require_decode();
    async function decodeAsync(streamLike, options = decode_1.defaultDecodeOptions) {
      const stream = (0, stream_1.ensureAsyncIterable)(streamLike);
      const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
      return decoder.decodeAsync(stream);
    }
    exports3.decodeAsync = decodeAsync;
    function decodeArrayStream(streamLike, options = decode_1.defaultDecodeOptions) {
      const stream = (0, stream_1.ensureAsyncIterable)(streamLike);
      const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
      return decoder.decodeArrayStream(stream);
    }
    exports3.decodeArrayStream = decodeArrayStream;
    function decodeMultiStream(streamLike, options = decode_1.defaultDecodeOptions) {
      const stream = (0, stream_1.ensureAsyncIterable)(streamLike);
      const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
      return decoder.decodeStream(stream);
    }
    exports3.decodeMultiStream = decodeMultiStream;
    function decodeStream(streamLike, options = decode_1.defaultDecodeOptions) {
      return decodeMultiStream(streamLike, options);
    }
    exports3.decodeStream = decodeStream;
  }
});

// node_modules/@msgpack/msgpack/dist/index.js
var require_dist = __commonJS({
  "node_modules/@msgpack/msgpack/dist/index.js"(exports3) {
    "use strict";
    Object.defineProperty(exports3, "__esModule", { value: true });
    exports3.decodeTimestampExtension = exports3.encodeTimestampExtension = exports3.decodeTimestampToTimeSpec = exports3.encodeTimeSpecToTimestamp = exports3.encodeDateToTimeSpec = exports3.EXT_TIMESTAMP = exports3.ExtData = exports3.ExtensionCodec = exports3.Encoder = exports3.DataViewIndexOutOfBoundsError = exports3.DecodeError = exports3.Decoder = exports3.decodeStream = exports3.decodeMultiStream = exports3.decodeArrayStream = exports3.decodeAsync = exports3.decodeMulti = exports3.decode = exports3.encode = void 0;
    var encode_1 = require_encode();
    Object.defineProperty(exports3, "encode", { enumerable: true, get: function() {
      return encode_1.encode;
    } });
    var decode_1 = require_decode();
    Object.defineProperty(exports3, "decode", { enumerable: true, get: function() {
      return decode_1.decode;
    } });
    Object.defineProperty(exports3, "decodeMulti", { enumerable: true, get: function() {
      return decode_1.decodeMulti;
    } });
    var decodeAsync_1 = require_decodeAsync();
    Object.defineProperty(exports3, "decodeAsync", { enumerable: true, get: function() {
      return decodeAsync_1.decodeAsync;
    } });
    Object.defineProperty(exports3, "decodeArrayStream", { enumerable: true, get: function() {
      return decodeAsync_1.decodeArrayStream;
    } });
    Object.defineProperty(exports3, "decodeMultiStream", { enumerable: true, get: function() {
      return decodeAsync_1.decodeMultiStream;
    } });
    Object.defineProperty(exports3, "decodeStream", { enumerable: true, get: function() {
      return decodeAsync_1.decodeStream;
    } });
    var Decoder_1 = require_Decoder();
    Object.defineProperty(exports3, "Decoder", { enumerable: true, get: function() {
      return Decoder_1.Decoder;
    } });
    Object.defineProperty(exports3, "DataViewIndexOutOfBoundsError", { enumerable: true, get: function() {
      return Decoder_1.DataViewIndexOutOfBoundsError;
    } });
    var DecodeError_1 = require_DecodeError();
    Object.defineProperty(exports3, "DecodeError", { enumerable: true, get: function() {
      return DecodeError_1.DecodeError;
    } });
    var Encoder_1 = require_Encoder();
    Object.defineProperty(exports3, "Encoder", { enumerable: true, get: function() {
      return Encoder_1.Encoder;
    } });
    var ExtensionCodec_1 = require_ExtensionCodec();
    Object.defineProperty(exports3, "ExtensionCodec", { enumerable: true, get: function() {
      return ExtensionCodec_1.ExtensionCodec;
    } });
    var ExtData_1 = require_ExtData();
    Object.defineProperty(exports3, "ExtData", { enumerable: true, get: function() {
      return ExtData_1.ExtData;
    } });
    var timestamp_1 = require_timestamp();
    Object.defineProperty(exports3, "EXT_TIMESTAMP", { enumerable: true, get: function() {
      return timestamp_1.EXT_TIMESTAMP;
    } });
    Object.defineProperty(exports3, "encodeDateToTimeSpec", { enumerable: true, get: function() {
      return timestamp_1.encodeDateToTimeSpec;
    } });
    Object.defineProperty(exports3, "encodeTimeSpecToTimestamp", { enumerable: true, get: function() {
      return timestamp_1.encodeTimeSpecToTimestamp;
    } });
    Object.defineProperty(exports3, "decodeTimestampToTimeSpec", { enumerable: true, get: function() {
      return timestamp_1.decodeTimestampToTimeSpec;
    } });
    Object.defineProperty(exports3, "encodeTimestampExtension", { enumerable: true, get: function() {
      return timestamp_1.encodeTimestampExtension;
    } });
    Object.defineProperty(exports3, "decodeTimestampExtension", { enumerable: true, get: function() {
      return timestamp_1.decodeTimestampExtension;
    } });
  }
});

// node_modules/isomorphic-ws/node.js
var require_node = __commonJS({
  "node_modules/isomorphic-ws/node.js"(exports3, module2) {
    "use strict";
    module2.exports = __require("ws");
  }
});

// node_modules/tweetnacl/nacl-fast.js
var require_nacl_fast = __commonJS({
  "node_modules/tweetnacl/nacl-fast.js"(exports3, module2) {
    (function(nacl3) {
      "use strict";
      var gf = function(init2) {
        var i, r = new Float64Array(16);
        if (init2)
          for (i = 0; i < init2.length; i++)
            r[i] = init2[i];
        return r;
      };
      var randombytes = function() {
        throw new Error("no PRNG");
      };
      var _0 = new Uint8Array(16);
      var _9 = new Uint8Array(32);
      _9[0] = 9;
      var gf0 = gf(), gf1 = gf([1]), _121665 = gf([56129, 1]), D = gf([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), D2 = gf([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), X = gf([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), Y = gf([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), I = gf([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
      function ts64(x, i, h, l2) {
        x[i] = h >> 24 & 255;
        x[i + 1] = h >> 16 & 255;
        x[i + 2] = h >> 8 & 255;
        x[i + 3] = h & 255;
        x[i + 4] = l2 >> 24 & 255;
        x[i + 5] = l2 >> 16 & 255;
        x[i + 6] = l2 >> 8 & 255;
        x[i + 7] = l2 & 255;
      }
      function vn(x, xi, y, yi, n) {
        var i, d3 = 0;
        for (i = 0; i < n; i++)
          d3 |= x[xi + i] ^ y[yi + i];
        return (1 & d3 - 1 >>> 8) - 1;
      }
      function crypto_verify_16(x, xi, y, yi) {
        return vn(x, xi, y, yi, 16);
      }
      function crypto_verify_32(x, xi, y, yi) {
        return vn(x, xi, y, yi, 32);
      }
      function core_salsa20(o, p, k, c) {
        var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u2;
        for (var i = 0; i < 20; i += 2) {
          u2 = x0 + x12 | 0;
          x4 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x4 + x0 | 0;
          x8 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x8 + x4 | 0;
          x12 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x12 + x8 | 0;
          x0 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x5 + x1 | 0;
          x9 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x9 + x5 | 0;
          x13 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x13 + x9 | 0;
          x1 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x1 + x13 | 0;
          x5 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x10 + x6 | 0;
          x14 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x14 + x10 | 0;
          x2 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x2 + x14 | 0;
          x6 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x6 + x2 | 0;
          x10 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x15 + x11 | 0;
          x3 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x3 + x15 | 0;
          x7 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x7 + x3 | 0;
          x11 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x11 + x7 | 0;
          x15 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x0 + x3 | 0;
          x1 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x1 + x0 | 0;
          x2 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x2 + x1 | 0;
          x3 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x3 + x2 | 0;
          x0 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x5 + x4 | 0;
          x6 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x6 + x5 | 0;
          x7 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x7 + x6 | 0;
          x4 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x4 + x7 | 0;
          x5 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x10 + x9 | 0;
          x11 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x11 + x10 | 0;
          x8 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x8 + x11 | 0;
          x9 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x9 + x8 | 0;
          x10 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x15 + x14 | 0;
          x12 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x12 + x15 | 0;
          x13 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x13 + x12 | 0;
          x14 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x14 + x13 | 0;
          x15 ^= u2 << 18 | u2 >>> 32 - 18;
        }
        x0 = x0 + j0 | 0;
        x1 = x1 + j1 | 0;
        x2 = x2 + j2 | 0;
        x3 = x3 + j3 | 0;
        x4 = x4 + j4 | 0;
        x5 = x5 + j5 | 0;
        x6 = x6 + j6 | 0;
        x7 = x7 + j7 | 0;
        x8 = x8 + j8 | 0;
        x9 = x9 + j9 | 0;
        x10 = x10 + j10 | 0;
        x11 = x11 + j11 | 0;
        x12 = x12 + j12 | 0;
        x13 = x13 + j13 | 0;
        x14 = x14 + j14 | 0;
        x15 = x15 + j15 | 0;
        o[0] = x0 >>> 0 & 255;
        o[1] = x0 >>> 8 & 255;
        o[2] = x0 >>> 16 & 255;
        o[3] = x0 >>> 24 & 255;
        o[4] = x1 >>> 0 & 255;
        o[5] = x1 >>> 8 & 255;
        o[6] = x1 >>> 16 & 255;
        o[7] = x1 >>> 24 & 255;
        o[8] = x2 >>> 0 & 255;
        o[9] = x2 >>> 8 & 255;
        o[10] = x2 >>> 16 & 255;
        o[11] = x2 >>> 24 & 255;
        o[12] = x3 >>> 0 & 255;
        o[13] = x3 >>> 8 & 255;
        o[14] = x3 >>> 16 & 255;
        o[15] = x3 >>> 24 & 255;
        o[16] = x4 >>> 0 & 255;
        o[17] = x4 >>> 8 & 255;
        o[18] = x4 >>> 16 & 255;
        o[19] = x4 >>> 24 & 255;
        o[20] = x5 >>> 0 & 255;
        o[21] = x5 >>> 8 & 255;
        o[22] = x5 >>> 16 & 255;
        o[23] = x5 >>> 24 & 255;
        o[24] = x6 >>> 0 & 255;
        o[25] = x6 >>> 8 & 255;
        o[26] = x6 >>> 16 & 255;
        o[27] = x6 >>> 24 & 255;
        o[28] = x7 >>> 0 & 255;
        o[29] = x7 >>> 8 & 255;
        o[30] = x7 >>> 16 & 255;
        o[31] = x7 >>> 24 & 255;
        o[32] = x8 >>> 0 & 255;
        o[33] = x8 >>> 8 & 255;
        o[34] = x8 >>> 16 & 255;
        o[35] = x8 >>> 24 & 255;
        o[36] = x9 >>> 0 & 255;
        o[37] = x9 >>> 8 & 255;
        o[38] = x9 >>> 16 & 255;
        o[39] = x9 >>> 24 & 255;
        o[40] = x10 >>> 0 & 255;
        o[41] = x10 >>> 8 & 255;
        o[42] = x10 >>> 16 & 255;
        o[43] = x10 >>> 24 & 255;
        o[44] = x11 >>> 0 & 255;
        o[45] = x11 >>> 8 & 255;
        o[46] = x11 >>> 16 & 255;
        o[47] = x11 >>> 24 & 255;
        o[48] = x12 >>> 0 & 255;
        o[49] = x12 >>> 8 & 255;
        o[50] = x12 >>> 16 & 255;
        o[51] = x12 >>> 24 & 255;
        o[52] = x13 >>> 0 & 255;
        o[53] = x13 >>> 8 & 255;
        o[54] = x13 >>> 16 & 255;
        o[55] = x13 >>> 24 & 255;
        o[56] = x14 >>> 0 & 255;
        o[57] = x14 >>> 8 & 255;
        o[58] = x14 >>> 16 & 255;
        o[59] = x14 >>> 24 & 255;
        o[60] = x15 >>> 0 & 255;
        o[61] = x15 >>> 8 & 255;
        o[62] = x15 >>> 16 & 255;
        o[63] = x15 >>> 24 & 255;
      }
      function core_hsalsa20(o, p, k, c) {
        var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u2;
        for (var i = 0; i < 20; i += 2) {
          u2 = x0 + x12 | 0;
          x4 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x4 + x0 | 0;
          x8 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x8 + x4 | 0;
          x12 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x12 + x8 | 0;
          x0 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x5 + x1 | 0;
          x9 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x9 + x5 | 0;
          x13 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x13 + x9 | 0;
          x1 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x1 + x13 | 0;
          x5 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x10 + x6 | 0;
          x14 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x14 + x10 | 0;
          x2 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x2 + x14 | 0;
          x6 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x6 + x2 | 0;
          x10 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x15 + x11 | 0;
          x3 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x3 + x15 | 0;
          x7 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x7 + x3 | 0;
          x11 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x11 + x7 | 0;
          x15 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x0 + x3 | 0;
          x1 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x1 + x0 | 0;
          x2 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x2 + x1 | 0;
          x3 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x3 + x2 | 0;
          x0 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x5 + x4 | 0;
          x6 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x6 + x5 | 0;
          x7 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x7 + x6 | 0;
          x4 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x4 + x7 | 0;
          x5 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x10 + x9 | 0;
          x11 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x11 + x10 | 0;
          x8 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x8 + x11 | 0;
          x9 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x9 + x8 | 0;
          x10 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x15 + x14 | 0;
          x12 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x12 + x15 | 0;
          x13 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x13 + x12 | 0;
          x14 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x14 + x13 | 0;
          x15 ^= u2 << 18 | u2 >>> 32 - 18;
        }
        o[0] = x0 >>> 0 & 255;
        o[1] = x0 >>> 8 & 255;
        o[2] = x0 >>> 16 & 255;
        o[3] = x0 >>> 24 & 255;
        o[4] = x5 >>> 0 & 255;
        o[5] = x5 >>> 8 & 255;
        o[6] = x5 >>> 16 & 255;
        o[7] = x5 >>> 24 & 255;
        o[8] = x10 >>> 0 & 255;
        o[9] = x10 >>> 8 & 255;
        o[10] = x10 >>> 16 & 255;
        o[11] = x10 >>> 24 & 255;
        o[12] = x15 >>> 0 & 255;
        o[13] = x15 >>> 8 & 255;
        o[14] = x15 >>> 16 & 255;
        o[15] = x15 >>> 24 & 255;
        o[16] = x6 >>> 0 & 255;
        o[17] = x6 >>> 8 & 255;
        o[18] = x6 >>> 16 & 255;
        o[19] = x6 >>> 24 & 255;
        o[20] = x7 >>> 0 & 255;
        o[21] = x7 >>> 8 & 255;
        o[22] = x7 >>> 16 & 255;
        o[23] = x7 >>> 24 & 255;
        o[24] = x8 >>> 0 & 255;
        o[25] = x8 >>> 8 & 255;
        o[26] = x8 >>> 16 & 255;
        o[27] = x8 >>> 24 & 255;
        o[28] = x9 >>> 0 & 255;
        o[29] = x9 >>> 8 & 255;
        o[30] = x9 >>> 16 & 255;
        o[31] = x9 >>> 24 & 255;
      }
      function crypto_core_salsa20(out, inp, k, c) {
        core_salsa20(out, inp, k, c);
      }
      function crypto_core_hsalsa20(out, inp, k, c) {
        core_hsalsa20(out, inp, k, c);
      }
      var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
      function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
        var z = new Uint8Array(16), x = new Uint8Array(64);
        var u2, i;
        for (i = 0; i < 16; i++)
          z[i] = 0;
        for (i = 0; i < 8; i++)
          z[i] = n[i];
        while (b >= 64) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < 64; i++)
            c[cpos + i] = m[mpos + i] ^ x[i];
          u2 = 1;
          for (i = 8; i < 16; i++) {
            u2 = u2 + (z[i] & 255) | 0;
            z[i] = u2 & 255;
            u2 >>>= 8;
          }
          b -= 64;
          cpos += 64;
          mpos += 64;
        }
        if (b > 0) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < b; i++)
            c[cpos + i] = m[mpos + i] ^ x[i];
        }
        return 0;
      }
      function crypto_stream_salsa20(c, cpos, b, n, k) {
        var z = new Uint8Array(16), x = new Uint8Array(64);
        var u2, i;
        for (i = 0; i < 16; i++)
          z[i] = 0;
        for (i = 0; i < 8; i++)
          z[i] = n[i];
        while (b >= 64) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < 64; i++)
            c[cpos + i] = x[i];
          u2 = 1;
          for (i = 8; i < 16; i++) {
            u2 = u2 + (z[i] & 255) | 0;
            z[i] = u2 & 255;
            u2 >>>= 8;
          }
          b -= 64;
          cpos += 64;
        }
        if (b > 0) {
          crypto_core_salsa20(x, z, k, sigma);
          for (i = 0; i < b; i++)
            c[cpos + i] = x[i];
        }
        return 0;
      }
      function crypto_stream(c, cpos, d3, n, k) {
        var s2 = new Uint8Array(32);
        crypto_core_hsalsa20(s2, n, k, sigma);
        var sn = new Uint8Array(8);
        for (var i = 0; i < 8; i++)
          sn[i] = n[i + 16];
        return crypto_stream_salsa20(c, cpos, d3, sn, s2);
      }
      function crypto_stream_xor(c, cpos, m, mpos, d3, n, k) {
        var s2 = new Uint8Array(32);
        crypto_core_hsalsa20(s2, n, k, sigma);
        var sn = new Uint8Array(8);
        for (var i = 0; i < 8; i++)
          sn[i] = n[i + 16];
        return crypto_stream_salsa20_xor(c, cpos, m, mpos, d3, sn, s2);
      }
      var poly1305 = function(key) {
        this.buffer = new Uint8Array(16);
        this.r = new Uint16Array(10);
        this.h = new Uint16Array(10);
        this.pad = new Uint16Array(8);
        this.leftover = 0;
        this.fin = 0;
        var t0, t1, t2, t3, t4, t5, t6, t7;
        t0 = key[0] & 255 | (key[1] & 255) << 8;
        this.r[0] = t0 & 8191;
        t1 = key[2] & 255 | (key[3] & 255) << 8;
        this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
        t2 = key[4] & 255 | (key[5] & 255) << 8;
        this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
        t3 = key[6] & 255 | (key[7] & 255) << 8;
        this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
        t4 = key[8] & 255 | (key[9] & 255) << 8;
        this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
        this.r[5] = t4 >>> 1 & 8190;
        t5 = key[10] & 255 | (key[11] & 255) << 8;
        this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
        t6 = key[12] & 255 | (key[13] & 255) << 8;
        this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
        t7 = key[14] & 255 | (key[15] & 255) << 8;
        this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
        this.r[9] = t7 >>> 5 & 127;
        this.pad[0] = key[16] & 255 | (key[17] & 255) << 8;
        this.pad[1] = key[18] & 255 | (key[19] & 255) << 8;
        this.pad[2] = key[20] & 255 | (key[21] & 255) << 8;
        this.pad[3] = key[22] & 255 | (key[23] & 255) << 8;
        this.pad[4] = key[24] & 255 | (key[25] & 255) << 8;
        this.pad[5] = key[26] & 255 | (key[27] & 255) << 8;
        this.pad[6] = key[28] & 255 | (key[29] & 255) << 8;
        this.pad[7] = key[30] & 255 | (key[31] & 255) << 8;
      };
      poly1305.prototype.blocks = function(m, mpos, bytes) {
        var hibit = this.fin ? 0 : 1 << 11;
        var t0, t1, t2, t3, t4, t5, t6, t7, c;
        var d0, d1, d22, d3, d4, d5, d6, d7, d8, d9;
        var h0 = this.h[0], h1 = this.h[1], h2 = this.h[2], h3 = this.h[3], h4 = this.h[4], h5 = this.h[5], h6 = this.h[6], h7 = this.h[7], h8 = this.h[8], h9 = this.h[9];
        var r0 = this.r[0], r1 = this.r[1], r2 = this.r[2], r3 = this.r[3], r4 = this.r[4], r5 = this.r[5], r6 = this.r[6], r7 = this.r[7], r8 = this.r[8], r9 = this.r[9];
        while (bytes >= 16) {
          t0 = m[mpos + 0] & 255 | (m[mpos + 1] & 255) << 8;
          h0 += t0 & 8191;
          t1 = m[mpos + 2] & 255 | (m[mpos + 3] & 255) << 8;
          h1 += (t0 >>> 13 | t1 << 3) & 8191;
          t2 = m[mpos + 4] & 255 | (m[mpos + 5] & 255) << 8;
          h2 += (t1 >>> 10 | t2 << 6) & 8191;
          t3 = m[mpos + 6] & 255 | (m[mpos + 7] & 255) << 8;
          h3 += (t2 >>> 7 | t3 << 9) & 8191;
          t4 = m[mpos + 8] & 255 | (m[mpos + 9] & 255) << 8;
          h4 += (t3 >>> 4 | t4 << 12) & 8191;
          h5 += t4 >>> 1 & 8191;
          t5 = m[mpos + 10] & 255 | (m[mpos + 11] & 255) << 8;
          h6 += (t4 >>> 14 | t5 << 2) & 8191;
          t6 = m[mpos + 12] & 255 | (m[mpos + 13] & 255) << 8;
          h7 += (t5 >>> 11 | t6 << 5) & 8191;
          t7 = m[mpos + 14] & 255 | (m[mpos + 15] & 255) << 8;
          h8 += (t6 >>> 8 | t7 << 8) & 8191;
          h9 += t7 >>> 5 | hibit;
          c = 0;
          d0 = c;
          d0 += h0 * r0;
          d0 += h1 * (5 * r9);
          d0 += h2 * (5 * r8);
          d0 += h3 * (5 * r7);
          d0 += h4 * (5 * r6);
          c = d0 >>> 13;
          d0 &= 8191;
          d0 += h5 * (5 * r5);
          d0 += h6 * (5 * r4);
          d0 += h7 * (5 * r3);
          d0 += h8 * (5 * r2);
          d0 += h9 * (5 * r1);
          c += d0 >>> 13;
          d0 &= 8191;
          d1 = c;
          d1 += h0 * r1;
          d1 += h1 * r0;
          d1 += h2 * (5 * r9);
          d1 += h3 * (5 * r8);
          d1 += h4 * (5 * r7);
          c = d1 >>> 13;
          d1 &= 8191;
          d1 += h5 * (5 * r6);
          d1 += h6 * (5 * r5);
          d1 += h7 * (5 * r4);
          d1 += h8 * (5 * r3);
          d1 += h9 * (5 * r2);
          c += d1 >>> 13;
          d1 &= 8191;
          d22 = c;
          d22 += h0 * r2;
          d22 += h1 * r1;
          d22 += h2 * r0;
          d22 += h3 * (5 * r9);
          d22 += h4 * (5 * r8);
          c = d22 >>> 13;
          d22 &= 8191;
          d22 += h5 * (5 * r7);
          d22 += h6 * (5 * r6);
          d22 += h7 * (5 * r5);
          d22 += h8 * (5 * r4);
          d22 += h9 * (5 * r3);
          c += d22 >>> 13;
          d22 &= 8191;
          d3 = c;
          d3 += h0 * r3;
          d3 += h1 * r2;
          d3 += h2 * r1;
          d3 += h3 * r0;
          d3 += h4 * (5 * r9);
          c = d3 >>> 13;
          d3 &= 8191;
          d3 += h5 * (5 * r8);
          d3 += h6 * (5 * r7);
          d3 += h7 * (5 * r6);
          d3 += h8 * (5 * r5);
          d3 += h9 * (5 * r4);
          c += d3 >>> 13;
          d3 &= 8191;
          d4 = c;
          d4 += h0 * r4;
          d4 += h1 * r3;
          d4 += h2 * r2;
          d4 += h3 * r1;
          d4 += h4 * r0;
          c = d4 >>> 13;
          d4 &= 8191;
          d4 += h5 * (5 * r9);
          d4 += h6 * (5 * r8);
          d4 += h7 * (5 * r7);
          d4 += h8 * (5 * r6);
          d4 += h9 * (5 * r5);
          c += d4 >>> 13;
          d4 &= 8191;
          d5 = c;
          d5 += h0 * r5;
          d5 += h1 * r4;
          d5 += h2 * r3;
          d5 += h3 * r2;
          d5 += h4 * r1;
          c = d5 >>> 13;
          d5 &= 8191;
          d5 += h5 * r0;
          d5 += h6 * (5 * r9);
          d5 += h7 * (5 * r8);
          d5 += h8 * (5 * r7);
          d5 += h9 * (5 * r6);
          c += d5 >>> 13;
          d5 &= 8191;
          d6 = c;
          d6 += h0 * r6;
          d6 += h1 * r5;
          d6 += h2 * r4;
          d6 += h3 * r3;
          d6 += h4 * r2;
          c = d6 >>> 13;
          d6 &= 8191;
          d6 += h5 * r1;
          d6 += h6 * r0;
          d6 += h7 * (5 * r9);
          d6 += h8 * (5 * r8);
          d6 += h9 * (5 * r7);
          c += d6 >>> 13;
          d6 &= 8191;
          d7 = c;
          d7 += h0 * r7;
          d7 += h1 * r6;
          d7 += h2 * r5;
          d7 += h3 * r4;
          d7 += h4 * r3;
          c = d7 >>> 13;
          d7 &= 8191;
          d7 += h5 * r2;
          d7 += h6 * r1;
          d7 += h7 * r0;
          d7 += h8 * (5 * r9);
          d7 += h9 * (5 * r8);
          c += d7 >>> 13;
          d7 &= 8191;
          d8 = c;
          d8 += h0 * r8;
          d8 += h1 * r7;
          d8 += h2 * r6;
          d8 += h3 * r5;
          d8 += h4 * r4;
          c = d8 >>> 13;
          d8 &= 8191;
          d8 += h5 * r3;
          d8 += h6 * r2;
          d8 += h7 * r1;
          d8 += h8 * r0;
          d8 += h9 * (5 * r9);
          c += d8 >>> 13;
          d8 &= 8191;
          d9 = c;
          d9 += h0 * r9;
          d9 += h1 * r8;
          d9 += h2 * r7;
          d9 += h3 * r6;
          d9 += h4 * r5;
          c = d9 >>> 13;
          d9 &= 8191;
          d9 += h5 * r4;
          d9 += h6 * r3;
          d9 += h7 * r2;
          d9 += h8 * r1;
          d9 += h9 * r0;
          c += d9 >>> 13;
          d9 &= 8191;
          c = (c << 2) + c | 0;
          c = c + d0 | 0;
          d0 = c & 8191;
          c = c >>> 13;
          d1 += c;
          h0 = d0;
          h1 = d1;
          h2 = d22;
          h3 = d3;
          h4 = d4;
          h5 = d5;
          h6 = d6;
          h7 = d7;
          h8 = d8;
          h9 = d9;
          mpos += 16;
          bytes -= 16;
        }
        this.h[0] = h0;
        this.h[1] = h1;
        this.h[2] = h2;
        this.h[3] = h3;
        this.h[4] = h4;
        this.h[5] = h5;
        this.h[6] = h6;
        this.h[7] = h7;
        this.h[8] = h8;
        this.h[9] = h9;
      };
      poly1305.prototype.finish = function(mac, macpos) {
        var g = new Uint16Array(10);
        var c, mask, f, i;
        if (this.leftover) {
          i = this.leftover;
          this.buffer[i++] = 1;
          for (; i < 16; i++)
            this.buffer[i] = 0;
          this.fin = 1;
          this.blocks(this.buffer, 0, 16);
        }
        c = this.h[1] >>> 13;
        this.h[1] &= 8191;
        for (i = 2; i < 10; i++) {
          this.h[i] += c;
          c = this.h[i] >>> 13;
          this.h[i] &= 8191;
        }
        this.h[0] += c * 5;
        c = this.h[0] >>> 13;
        this.h[0] &= 8191;
        this.h[1] += c;
        c = this.h[1] >>> 13;
        this.h[1] &= 8191;
        this.h[2] += c;
        g[0] = this.h[0] + 5;
        c = g[0] >>> 13;
        g[0] &= 8191;
        for (i = 1; i < 10; i++) {
          g[i] = this.h[i] + c;
          c = g[i] >>> 13;
          g[i] &= 8191;
        }
        g[9] -= 1 << 13;
        mask = (c ^ 1) - 1;
        for (i = 0; i < 10; i++)
          g[i] &= mask;
        mask = ~mask;
        for (i = 0; i < 10; i++)
          this.h[i] = this.h[i] & mask | g[i];
        this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
        this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
        this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
        this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
        this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
        this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
        this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
        this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
        f = this.h[0] + this.pad[0];
        this.h[0] = f & 65535;
        for (i = 1; i < 8; i++) {
          f = (this.h[i] + this.pad[i] | 0) + (f >>> 16) | 0;
          this.h[i] = f & 65535;
        }
        mac[macpos + 0] = this.h[0] >>> 0 & 255;
        mac[macpos + 1] = this.h[0] >>> 8 & 255;
        mac[macpos + 2] = this.h[1] >>> 0 & 255;
        mac[macpos + 3] = this.h[1] >>> 8 & 255;
        mac[macpos + 4] = this.h[2] >>> 0 & 255;
        mac[macpos + 5] = this.h[2] >>> 8 & 255;
        mac[macpos + 6] = this.h[3] >>> 0 & 255;
        mac[macpos + 7] = this.h[3] >>> 8 & 255;
        mac[macpos + 8] = this.h[4] >>> 0 & 255;
        mac[macpos + 9] = this.h[4] >>> 8 & 255;
        mac[macpos + 10] = this.h[5] >>> 0 & 255;
        mac[macpos + 11] = this.h[5] >>> 8 & 255;
        mac[macpos + 12] = this.h[6] >>> 0 & 255;
        mac[macpos + 13] = this.h[6] >>> 8 & 255;
        mac[macpos + 14] = this.h[7] >>> 0 & 255;
        mac[macpos + 15] = this.h[7] >>> 8 & 255;
      };
      poly1305.prototype.update = function(m, mpos, bytes) {
        var i, want;
        if (this.leftover) {
          want = 16 - this.leftover;
          if (want > bytes)
            want = bytes;
          for (i = 0; i < want; i++)
            this.buffer[this.leftover + i] = m[mpos + i];
          bytes -= want;
          mpos += want;
          this.leftover += want;
          if (this.leftover < 16)
            return;
          this.blocks(this.buffer, 0, 16);
          this.leftover = 0;
        }
        if (bytes >= 16) {
          want = bytes - bytes % 16;
          this.blocks(m, mpos, want);
          mpos += want;
          bytes -= want;
        }
        if (bytes) {
          for (i = 0; i < bytes; i++)
            this.buffer[this.leftover + i] = m[mpos + i];
          this.leftover += bytes;
        }
      };
      function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
        var s2 = new poly1305(k);
        s2.update(m, mpos, n);
        s2.finish(out, outpos);
        return 0;
      }
      function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
        var x = new Uint8Array(16);
        crypto_onetimeauth(x, 0, m, mpos, n, k);
        return crypto_verify_16(h, hpos, x, 0);
      }
      function crypto_secretbox(c, m, d3, n, k) {
        var i;
        if (d3 < 32)
          return -1;
        crypto_stream_xor(c, 0, m, 0, d3, n, k);
        crypto_onetimeauth(c, 16, c, 32, d3 - 32, c);
        for (i = 0; i < 16; i++)
          c[i] = 0;
        return 0;
      }
      function crypto_secretbox_open(m, c, d3, n, k) {
        var i;
        var x = new Uint8Array(32);
        if (d3 < 32)
          return -1;
        crypto_stream(x, 0, 32, n, k);
        if (crypto_onetimeauth_verify(c, 16, c, 32, d3 - 32, x) !== 0)
          return -1;
        crypto_stream_xor(m, 0, c, 0, d3, n, k);
        for (i = 0; i < 32; i++)
          m[i] = 0;
        return 0;
      }
      function set25519(r, a) {
        var i;
        for (i = 0; i < 16; i++)
          r[i] = a[i] | 0;
      }
      function car25519(o) {
        var i, v, c = 1;
        for (i = 0; i < 16; i++) {
          v = o[i] + c + 65535;
          c = Math.floor(v / 65536);
          o[i] = v - c * 65536;
        }
        o[0] += c - 1 + 37 * (c - 1);
      }
      function sel25519(p, q, b) {
        var t, c = ~(b - 1);
        for (var i = 0; i < 16; i++) {
          t = c & (p[i] ^ q[i]);
          p[i] ^= t;
          q[i] ^= t;
        }
      }
      function pack25519(o, n) {
        var i, j, b;
        var m = gf(), t = gf();
        for (i = 0; i < 16; i++)
          t[i] = n[i];
        car25519(t);
        car25519(t);
        car25519(t);
        for (j = 0; j < 2; j++) {
          m[0] = t[0] - 65517;
          for (i = 1; i < 15; i++) {
            m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
            m[i - 1] &= 65535;
          }
          m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
          b = m[15] >> 16 & 1;
          m[14] &= 65535;
          sel25519(t, m, 1 - b);
        }
        for (i = 0; i < 16; i++) {
          o[2 * i] = t[i] & 255;
          o[2 * i + 1] = t[i] >> 8;
        }
      }
      function neq25519(a, b) {
        var c = new Uint8Array(32), d3 = new Uint8Array(32);
        pack25519(c, a);
        pack25519(d3, b);
        return crypto_verify_32(c, 0, d3, 0);
      }
      function par25519(a) {
        var d3 = new Uint8Array(32);
        pack25519(d3, a);
        return d3[0] & 1;
      }
      function unpack25519(o, n) {
        var i;
        for (i = 0; i < 16; i++)
          o[i] = n[2 * i] + (n[2 * i + 1] << 8);
        o[15] &= 32767;
      }
      function A(o, a, b) {
        for (var i = 0; i < 16; i++)
          o[i] = a[i] + b[i];
      }
      function Z(o, a, b) {
        for (var i = 0; i < 16; i++)
          o[i] = a[i] - b[i];
      }
      function M(o, a, b) {
        var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
        v = a[0];
        t0 += v * b0;
        t1 += v * b1;
        t2 += v * b2;
        t3 += v * b3;
        t4 += v * b4;
        t5 += v * b5;
        t6 += v * b6;
        t7 += v * b7;
        t8 += v * b8;
        t9 += v * b9;
        t10 += v * b10;
        t11 += v * b11;
        t12 += v * b12;
        t13 += v * b13;
        t14 += v * b14;
        t15 += v * b15;
        v = a[1];
        t1 += v * b0;
        t2 += v * b1;
        t3 += v * b2;
        t4 += v * b3;
        t5 += v * b4;
        t6 += v * b5;
        t7 += v * b6;
        t8 += v * b7;
        t9 += v * b8;
        t10 += v * b9;
        t11 += v * b10;
        t12 += v * b11;
        t13 += v * b12;
        t14 += v * b13;
        t15 += v * b14;
        t16 += v * b15;
        v = a[2];
        t2 += v * b0;
        t3 += v * b1;
        t4 += v * b2;
        t5 += v * b3;
        t6 += v * b4;
        t7 += v * b5;
        t8 += v * b6;
        t9 += v * b7;
        t10 += v * b8;
        t11 += v * b9;
        t12 += v * b10;
        t13 += v * b11;
        t14 += v * b12;
        t15 += v * b13;
        t16 += v * b14;
        t17 += v * b15;
        v = a[3];
        t3 += v * b0;
        t4 += v * b1;
        t5 += v * b2;
        t6 += v * b3;
        t7 += v * b4;
        t8 += v * b5;
        t9 += v * b6;
        t10 += v * b7;
        t11 += v * b8;
        t12 += v * b9;
        t13 += v * b10;
        t14 += v * b11;
        t15 += v * b12;
        t16 += v * b13;
        t17 += v * b14;
        t18 += v * b15;
        v = a[4];
        t4 += v * b0;
        t5 += v * b1;
        t6 += v * b2;
        t7 += v * b3;
        t8 += v * b4;
        t9 += v * b5;
        t10 += v * b6;
        t11 += v * b7;
        t12 += v * b8;
        t13 += v * b9;
        t14 += v * b10;
        t15 += v * b11;
        t16 += v * b12;
        t17 += v * b13;
        t18 += v * b14;
        t19 += v * b15;
        v = a[5];
        t5 += v * b0;
        t6 += v * b1;
        t7 += v * b2;
        t8 += v * b3;
        t9 += v * b4;
        t10 += v * b5;
        t11 += v * b6;
        t12 += v * b7;
        t13 += v * b8;
        t14 += v * b9;
        t15 += v * b10;
        t16 += v * b11;
        t17 += v * b12;
        t18 += v * b13;
        t19 += v * b14;
        t20 += v * b15;
        v = a[6];
        t6 += v * b0;
        t7 += v * b1;
        t8 += v * b2;
        t9 += v * b3;
        t10 += v * b4;
        t11 += v * b5;
        t12 += v * b6;
        t13 += v * b7;
        t14 += v * b8;
        t15 += v * b9;
        t16 += v * b10;
        t17 += v * b11;
        t18 += v * b12;
        t19 += v * b13;
        t20 += v * b14;
        t21 += v * b15;
        v = a[7];
        t7 += v * b0;
        t8 += v * b1;
        t9 += v * b2;
        t10 += v * b3;
        t11 += v * b4;
        t12 += v * b5;
        t13 += v * b6;
        t14 += v * b7;
        t15 += v * b8;
        t16 += v * b9;
        t17 += v * b10;
        t18 += v * b11;
        t19 += v * b12;
        t20 += v * b13;
        t21 += v * b14;
        t22 += v * b15;
        v = a[8];
        t8 += v * b0;
        t9 += v * b1;
        t10 += v * b2;
        t11 += v * b3;
        t12 += v * b4;
        t13 += v * b5;
        t14 += v * b6;
        t15 += v * b7;
        t16 += v * b8;
        t17 += v * b9;
        t18 += v * b10;
        t19 += v * b11;
        t20 += v * b12;
        t21 += v * b13;
        t22 += v * b14;
        t23 += v * b15;
        v = a[9];
        t9 += v * b0;
        t10 += v * b1;
        t11 += v * b2;
        t12 += v * b3;
        t13 += v * b4;
        t14 += v * b5;
        t15 += v * b6;
        t16 += v * b7;
        t17 += v * b8;
        t18 += v * b9;
        t19 += v * b10;
        t20 += v * b11;
        t21 += v * b12;
        t22 += v * b13;
        t23 += v * b14;
        t24 += v * b15;
        v = a[10];
        t10 += v * b0;
        t11 += v * b1;
        t12 += v * b2;
        t13 += v * b3;
        t14 += v * b4;
        t15 += v * b5;
        t16 += v * b6;
        t17 += v * b7;
        t18 += v * b8;
        t19 += v * b9;
        t20 += v * b10;
        t21 += v * b11;
        t22 += v * b12;
        t23 += v * b13;
        t24 += v * b14;
        t25 += v * b15;
        v = a[11];
        t11 += v * b0;
        t12 += v * b1;
        t13 += v * b2;
        t14 += v * b3;
        t15 += v * b4;
        t16 += v * b5;
        t17 += v * b6;
        t18 += v * b7;
        t19 += v * b8;
        t20 += v * b9;
        t21 += v * b10;
        t22 += v * b11;
        t23 += v * b12;
        t24 += v * b13;
        t25 += v * b14;
        t26 += v * b15;
        v = a[12];
        t12 += v * b0;
        t13 += v * b1;
        t14 += v * b2;
        t15 += v * b3;
        t16 += v * b4;
        t17 += v * b5;
        t18 += v * b6;
        t19 += v * b7;
        t20 += v * b8;
        t21 += v * b9;
        t22 += v * b10;
        t23 += v * b11;
        t24 += v * b12;
        t25 += v * b13;
        t26 += v * b14;
        t27 += v * b15;
        v = a[13];
        t13 += v * b0;
        t14 += v * b1;
        t15 += v * b2;
        t16 += v * b3;
        t17 += v * b4;
        t18 += v * b5;
        t19 += v * b6;
        t20 += v * b7;
        t21 += v * b8;
        t22 += v * b9;
        t23 += v * b10;
        t24 += v * b11;
        t25 += v * b12;
        t26 += v * b13;
        t27 += v * b14;
        t28 += v * b15;
        v = a[14];
        t14 += v * b0;
        t15 += v * b1;
        t16 += v * b2;
        t17 += v * b3;
        t18 += v * b4;
        t19 += v * b5;
        t20 += v * b6;
        t21 += v * b7;
        t22 += v * b8;
        t23 += v * b9;
        t24 += v * b10;
        t25 += v * b11;
        t26 += v * b12;
        t27 += v * b13;
        t28 += v * b14;
        t29 += v * b15;
        v = a[15];
        t15 += v * b0;
        t16 += v * b1;
        t17 += v * b2;
        t18 += v * b3;
        t19 += v * b4;
        t20 += v * b5;
        t21 += v * b6;
        t22 += v * b7;
        t23 += v * b8;
        t24 += v * b9;
        t25 += v * b10;
        t26 += v * b11;
        t27 += v * b12;
        t28 += v * b13;
        t29 += v * b14;
        t30 += v * b15;
        t0 += 38 * t16;
        t1 += 38 * t17;
        t2 += 38 * t18;
        t3 += 38 * t19;
        t4 += 38 * t20;
        t5 += 38 * t21;
        t6 += 38 * t22;
        t7 += 38 * t23;
        t8 += 38 * t24;
        t9 += 38 * t25;
        t10 += 38 * t26;
        t11 += 38 * t27;
        t12 += 38 * t28;
        t13 += 38 * t29;
        t14 += 38 * t30;
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        c = 1;
        v = t0 + c + 65535;
        c = Math.floor(v / 65536);
        t0 = v - c * 65536;
        v = t1 + c + 65535;
        c = Math.floor(v / 65536);
        t1 = v - c * 65536;
        v = t2 + c + 65535;
        c = Math.floor(v / 65536);
        t2 = v - c * 65536;
        v = t3 + c + 65535;
        c = Math.floor(v / 65536);
        t3 = v - c * 65536;
        v = t4 + c + 65535;
        c = Math.floor(v / 65536);
        t4 = v - c * 65536;
        v = t5 + c + 65535;
        c = Math.floor(v / 65536);
        t5 = v - c * 65536;
        v = t6 + c + 65535;
        c = Math.floor(v / 65536);
        t6 = v - c * 65536;
        v = t7 + c + 65535;
        c = Math.floor(v / 65536);
        t7 = v - c * 65536;
        v = t8 + c + 65535;
        c = Math.floor(v / 65536);
        t8 = v - c * 65536;
        v = t9 + c + 65535;
        c = Math.floor(v / 65536);
        t9 = v - c * 65536;
        v = t10 + c + 65535;
        c = Math.floor(v / 65536);
        t10 = v - c * 65536;
        v = t11 + c + 65535;
        c = Math.floor(v / 65536);
        t11 = v - c * 65536;
        v = t12 + c + 65535;
        c = Math.floor(v / 65536);
        t12 = v - c * 65536;
        v = t13 + c + 65535;
        c = Math.floor(v / 65536);
        t13 = v - c * 65536;
        v = t14 + c + 65535;
        c = Math.floor(v / 65536);
        t14 = v - c * 65536;
        v = t15 + c + 65535;
        c = Math.floor(v / 65536);
        t15 = v - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        o[0] = t0;
        o[1] = t1;
        o[2] = t2;
        o[3] = t3;
        o[4] = t4;
        o[5] = t5;
        o[6] = t6;
        o[7] = t7;
        o[8] = t8;
        o[9] = t9;
        o[10] = t10;
        o[11] = t11;
        o[12] = t12;
        o[13] = t13;
        o[14] = t14;
        o[15] = t15;
      }
      function S(o, a) {
        M(o, a, a);
      }
      function inv25519(o, i) {
        var c = gf();
        var a;
        for (a = 0; a < 16; a++)
          c[a] = i[a];
        for (a = 253; a >= 0; a--) {
          S(c, c);
          if (a !== 2 && a !== 4)
            M(c, c, i);
        }
        for (a = 0; a < 16; a++)
          o[a] = c[a];
      }
      function pow2523(o, i) {
        var c = gf();
        var a;
        for (a = 0; a < 16; a++)
          c[a] = i[a];
        for (a = 250; a >= 0; a--) {
          S(c, c);
          if (a !== 1)
            M(c, c, i);
        }
        for (a = 0; a < 16; a++)
          o[a] = c[a];
      }
      function crypto_scalarmult(q, n, p) {
        var z = new Uint8Array(32);
        var x = new Float64Array(80), r, i;
        var a = gf(), b = gf(), c = gf(), d3 = gf(), e2 = gf(), f = gf();
        for (i = 0; i < 31; i++)
          z[i] = n[i];
        z[31] = n[31] & 127 | 64;
        z[0] &= 248;
        unpack25519(x, p);
        for (i = 0; i < 16; i++) {
          b[i] = x[i];
          d3[i] = a[i] = c[i] = 0;
        }
        a[0] = d3[0] = 1;
        for (i = 254; i >= 0; --i) {
          r = z[i >>> 3] >>> (i & 7) & 1;
          sel25519(a, b, r);
          sel25519(c, d3, r);
          A(e2, a, c);
          Z(a, a, c);
          A(c, b, d3);
          Z(b, b, d3);
          S(d3, e2);
          S(f, a);
          M(a, c, a);
          M(c, b, e2);
          A(e2, a, c);
          Z(a, a, c);
          S(b, a);
          Z(c, d3, f);
          M(a, c, _121665);
          A(a, a, d3);
          M(c, c, a);
          M(a, d3, f);
          M(d3, b, x);
          S(b, e2);
          sel25519(a, b, r);
          sel25519(c, d3, r);
        }
        for (i = 0; i < 16; i++) {
          x[i + 16] = a[i];
          x[i + 32] = c[i];
          x[i + 48] = b[i];
          x[i + 64] = d3[i];
        }
        var x32 = x.subarray(32);
        var x16 = x.subarray(16);
        inv25519(x32, x32);
        M(x16, x16, x32);
        pack25519(q, x16);
        return 0;
      }
      function crypto_scalarmult_base(q, n) {
        return crypto_scalarmult(q, n, _9);
      }
      function crypto_box_keypair(y, x) {
        randombytes(x, 32);
        return crypto_scalarmult_base(y, x);
      }
      function crypto_box_beforenm(k, y, x) {
        var s2 = new Uint8Array(32);
        crypto_scalarmult(s2, x, y);
        return crypto_core_hsalsa20(k, _0, s2, sigma);
      }
      var crypto_box_afternm = crypto_secretbox;
      var crypto_box_open_afternm = crypto_secretbox_open;
      function crypto_box(c, m, d3, n, y, x) {
        var k = new Uint8Array(32);
        crypto_box_beforenm(k, y, x);
        return crypto_box_afternm(c, m, d3, n, k);
      }
      function crypto_box_open(m, c, d3, n, y, x) {
        var k = new Uint8Array(32);
        crypto_box_beforenm(k, y, x);
        return crypto_box_open_afternm(m, c, d3, n, k);
      }
      var K = [
        1116352408,
        3609767458,
        1899447441,
        602891725,
        3049323471,
        3964484399,
        3921009573,
        2173295548,
        961987163,
        4081628472,
        1508970993,
        3053834265,
        2453635748,
        2937671579,
        2870763221,
        3664609560,
        3624381080,
        2734883394,
        310598401,
        1164996542,
        607225278,
        1323610764,
        1426881987,
        3590304994,
        1925078388,
        4068182383,
        2162078206,
        991336113,
        2614888103,
        633803317,
        3248222580,
        3479774868,
        3835390401,
        2666613458,
        4022224774,
        944711139,
        264347078,
        2341262773,
        604807628,
        2007800933,
        770255983,
        1495990901,
        1249150122,
        1856431235,
        1555081692,
        3175218132,
        1996064986,
        2198950837,
        2554220882,
        3999719339,
        2821834349,
        766784016,
        2952996808,
        2566594879,
        3210313671,
        3203337956,
        3336571891,
        1034457026,
        3584528711,
        2466948901,
        113926993,
        3758326383,
        338241895,
        168717936,
        666307205,
        1188179964,
        773529912,
        1546045734,
        1294757372,
        1522805485,
        1396182291,
        2643833823,
        1695183700,
        2343527390,
        1986661051,
        1014477480,
        2177026350,
        1206759142,
        2456956037,
        344077627,
        2730485921,
        1290863460,
        2820302411,
        3158454273,
        3259730800,
        3505952657,
        3345764771,
        106217008,
        3516065817,
        3606008344,
        3600352804,
        1432725776,
        4094571909,
        1467031594,
        275423344,
        851169720,
        430227734,
        3100823752,
        506948616,
        1363258195,
        659060556,
        3750685593,
        883997877,
        3785050280,
        958139571,
        3318307427,
        1322822218,
        3812723403,
        1537002063,
        2003034995,
        1747873779,
        3602036899,
        1955562222,
        1575990012,
        2024104815,
        1125592928,
        2227730452,
        2716904306,
        2361852424,
        442776044,
        2428436474,
        593698344,
        2756734187,
        3733110249,
        3204031479,
        2999351573,
        3329325298,
        3815920427,
        3391569614,
        3928383900,
        3515267271,
        566280711,
        3940187606,
        3454069534,
        4118630271,
        4000239992,
        116418474,
        1914138554,
        174292421,
        2731055270,
        289380356,
        3203993006,
        460393269,
        320620315,
        685471733,
        587496836,
        852142971,
        1086792851,
        1017036298,
        365543100,
        1126000580,
        2618297676,
        1288033470,
        3409855158,
        1501505948,
        4234509866,
        1607167915,
        987167468,
        1816402316,
        1246189591
      ];
      function crypto_hashblocks_hl(hh, hl, m, n) {
        var wh = new Int32Array(16), wl = new Int32Array(16), bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l2, a, b, c, d3;
        var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
        var pos = 0;
        while (n >= 128) {
          for (i = 0; i < 16; i++) {
            j = 8 * i + pos;
            wh[i] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
            wl[i] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
          }
          for (i = 0; i < 80; i++) {
            bh0 = ah0;
            bh1 = ah1;
            bh2 = ah2;
            bh3 = ah3;
            bh4 = ah4;
            bh5 = ah5;
            bh6 = ah6;
            bh7 = ah7;
            bl0 = al0;
            bl1 = al1;
            bl2 = al2;
            bl3 = al3;
            bl4 = al4;
            bl5 = al5;
            bl6 = al6;
            bl7 = al7;
            h = ah7;
            l2 = al7;
            a = l2 & 65535;
            b = l2 >>> 16;
            c = h & 65535;
            d3 = h >>> 16;
            h = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
            l2 = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
            a += l2 & 65535;
            b += l2 >>> 16;
            c += h & 65535;
            d3 += h >>> 16;
            h = ah4 & ah5 ^ ~ah4 & ah6;
            l2 = al4 & al5 ^ ~al4 & al6;
            a += l2 & 65535;
            b += l2 >>> 16;
            c += h & 65535;
            d3 += h >>> 16;
            h = K[i * 2];
            l2 = K[i * 2 + 1];
            a += l2 & 65535;
            b += l2 >>> 16;
            c += h & 65535;
            d3 += h >>> 16;
            h = wh[i % 16];
            l2 = wl[i % 16];
            a += l2 & 65535;
            b += l2 >>> 16;
            c += h & 65535;
            d3 += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d3 += c >>> 16;
            th = c & 65535 | d3 << 16;
            tl = a & 65535 | b << 16;
            h = th;
            l2 = tl;
            a = l2 & 65535;
            b = l2 >>> 16;
            c = h & 65535;
            d3 = h >>> 16;
            h = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
            l2 = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
            a += l2 & 65535;
            b += l2 >>> 16;
            c += h & 65535;
            d3 += h >>> 16;
            h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
            l2 = al0 & al1 ^ al0 & al2 ^ al1 & al2;
            a += l2 & 65535;
            b += l2 >>> 16;
            c += h & 65535;
            d3 += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d3 += c >>> 16;
            bh7 = c & 65535 | d3 << 16;
            bl7 = a & 65535 | b << 16;
            h = bh3;
            l2 = bl3;
            a = l2 & 65535;
            b = l2 >>> 16;
            c = h & 65535;
            d3 = h >>> 16;
            h = th;
            l2 = tl;
            a += l2 & 65535;
            b += l2 >>> 16;
            c += h & 65535;
            d3 += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d3 += c >>> 16;
            bh3 = c & 65535 | d3 << 16;
            bl3 = a & 65535 | b << 16;
            ah1 = bh0;
            ah2 = bh1;
            ah3 = bh2;
            ah4 = bh3;
            ah5 = bh4;
            ah6 = bh5;
            ah7 = bh6;
            ah0 = bh7;
            al1 = bl0;
            al2 = bl1;
            al3 = bl2;
            al4 = bl3;
            al5 = bl4;
            al6 = bl5;
            al7 = bl6;
            al0 = bl7;
            if (i % 16 === 15) {
              for (j = 0; j < 16; j++) {
                h = wh[j];
                l2 = wl[j];
                a = l2 & 65535;
                b = l2 >>> 16;
                c = h & 65535;
                d3 = h >>> 16;
                h = wh[(j + 9) % 16];
                l2 = wl[(j + 9) % 16];
                a += l2 & 65535;
                b += l2 >>> 16;
                c += h & 65535;
                d3 += h >>> 16;
                th = wh[(j + 1) % 16];
                tl = wl[(j + 1) % 16];
                h = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
                l2 = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
                a += l2 & 65535;
                b += l2 >>> 16;
                c += h & 65535;
                d3 += h >>> 16;
                th = wh[(j + 14) % 16];
                tl = wl[(j + 14) % 16];
                h = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
                l2 = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
                a += l2 & 65535;
                b += l2 >>> 16;
                c += h & 65535;
                d3 += h >>> 16;
                b += a >>> 16;
                c += b >>> 16;
                d3 += c >>> 16;
                wh[j] = c & 65535 | d3 << 16;
                wl[j] = a & 65535 | b << 16;
              }
            }
          }
          h = ah0;
          l2 = al0;
          a = l2 & 65535;
          b = l2 >>> 16;
          c = h & 65535;
          d3 = h >>> 16;
          h = hh[0];
          l2 = hl[0];
          a += l2 & 65535;
          b += l2 >>> 16;
          c += h & 65535;
          d3 += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d3 += c >>> 16;
          hh[0] = ah0 = c & 65535 | d3 << 16;
          hl[0] = al0 = a & 65535 | b << 16;
          h = ah1;
          l2 = al1;
          a = l2 & 65535;
          b = l2 >>> 16;
          c = h & 65535;
          d3 = h >>> 16;
          h = hh[1];
          l2 = hl[1];
          a += l2 & 65535;
          b += l2 >>> 16;
          c += h & 65535;
          d3 += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d3 += c >>> 16;
          hh[1] = ah1 = c & 65535 | d3 << 16;
          hl[1] = al1 = a & 65535 | b << 16;
          h = ah2;
          l2 = al2;
          a = l2 & 65535;
          b = l2 >>> 16;
          c = h & 65535;
          d3 = h >>> 16;
          h = hh[2];
          l2 = hl[2];
          a += l2 & 65535;
          b += l2 >>> 16;
          c += h & 65535;
          d3 += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d3 += c >>> 16;
          hh[2] = ah2 = c & 65535 | d3 << 16;
          hl[2] = al2 = a & 65535 | b << 16;
          h = ah3;
          l2 = al3;
          a = l2 & 65535;
          b = l2 >>> 16;
          c = h & 65535;
          d3 = h >>> 16;
          h = hh[3];
          l2 = hl[3];
          a += l2 & 65535;
          b += l2 >>> 16;
          c += h & 65535;
          d3 += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d3 += c >>> 16;
          hh[3] = ah3 = c & 65535 | d3 << 16;
          hl[3] = al3 = a & 65535 | b << 16;
          h = ah4;
          l2 = al4;
          a = l2 & 65535;
          b = l2 >>> 16;
          c = h & 65535;
          d3 = h >>> 16;
          h = hh[4];
          l2 = hl[4];
          a += l2 & 65535;
          b += l2 >>> 16;
          c += h & 65535;
          d3 += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d3 += c >>> 16;
          hh[4] = ah4 = c & 65535 | d3 << 16;
          hl[4] = al4 = a & 65535 | b << 16;
          h = ah5;
          l2 = al5;
          a = l2 & 65535;
          b = l2 >>> 16;
          c = h & 65535;
          d3 = h >>> 16;
          h = hh[5];
          l2 = hl[5];
          a += l2 & 65535;
          b += l2 >>> 16;
          c += h & 65535;
          d3 += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d3 += c >>> 16;
          hh[5] = ah5 = c & 65535 | d3 << 16;
          hl[5] = al5 = a & 65535 | b << 16;
          h = ah6;
          l2 = al6;
          a = l2 & 65535;
          b = l2 >>> 16;
          c = h & 65535;
          d3 = h >>> 16;
          h = hh[6];
          l2 = hl[6];
          a += l2 & 65535;
          b += l2 >>> 16;
          c += h & 65535;
          d3 += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d3 += c >>> 16;
          hh[6] = ah6 = c & 65535 | d3 << 16;
          hl[6] = al6 = a & 65535 | b << 16;
          h = ah7;
          l2 = al7;
          a = l2 & 65535;
          b = l2 >>> 16;
          c = h & 65535;
          d3 = h >>> 16;
          h = hh[7];
          l2 = hl[7];
          a += l2 & 65535;
          b += l2 >>> 16;
          c += h & 65535;
          d3 += h >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d3 += c >>> 16;
          hh[7] = ah7 = c & 65535 | d3 << 16;
          hl[7] = al7 = a & 65535 | b << 16;
          pos += 128;
          n -= 128;
        }
        return n;
      }
      function crypto_hash(out, m, n) {
        var hh = new Int32Array(8), hl = new Int32Array(8), x = new Uint8Array(256), i, b = n;
        hh[0] = 1779033703;
        hh[1] = 3144134277;
        hh[2] = 1013904242;
        hh[3] = 2773480762;
        hh[4] = 1359893119;
        hh[5] = 2600822924;
        hh[6] = 528734635;
        hh[7] = 1541459225;
        hl[0] = 4089235720;
        hl[1] = 2227873595;
        hl[2] = 4271175723;
        hl[3] = 1595750129;
        hl[4] = 2917565137;
        hl[5] = 725511199;
        hl[6] = 4215389547;
        hl[7] = 327033209;
        crypto_hashblocks_hl(hh, hl, m, n);
        n %= 128;
        for (i = 0; i < n; i++)
          x[i] = m[b - n + i];
        x[n] = 128;
        n = 256 - 128 * (n < 112 ? 1 : 0);
        x[n - 9] = 0;
        ts64(x, n - 8, b / 536870912 | 0, b << 3);
        crypto_hashblocks_hl(hh, hl, x, n);
        for (i = 0; i < 8; i++)
          ts64(out, 8 * i, hh[i], hl[i]);
        return 0;
      }
      function add(p, q) {
        var a = gf(), b = gf(), c = gf(), d3 = gf(), e2 = gf(), f = gf(), g = gf(), h = gf(), t = gf();
        Z(a, p[1], p[0]);
        Z(t, q[1], q[0]);
        M(a, a, t);
        A(b, p[0], p[1]);
        A(t, q[0], q[1]);
        M(b, b, t);
        M(c, p[3], q[3]);
        M(c, c, D2);
        M(d3, p[2], q[2]);
        A(d3, d3, d3);
        Z(e2, b, a);
        Z(f, d3, c);
        A(g, d3, c);
        A(h, b, a);
        M(p[0], e2, f);
        M(p[1], h, g);
        M(p[2], g, f);
        M(p[3], e2, h);
      }
      function cswap(p, q, b) {
        var i;
        for (i = 0; i < 4; i++) {
          sel25519(p[i], q[i], b);
        }
      }
      function pack(r, p) {
        var tx = gf(), ty = gf(), zi = gf();
        inv25519(zi, p[2]);
        M(tx, p[0], zi);
        M(ty, p[1], zi);
        pack25519(r, ty);
        r[31] ^= par25519(tx) << 7;
      }
      function scalarmult(p, q, s2) {
        var b, i;
        set25519(p[0], gf0);
        set25519(p[1], gf1);
        set25519(p[2], gf1);
        set25519(p[3], gf0);
        for (i = 255; i >= 0; --i) {
          b = s2[i / 8 | 0] >> (i & 7) & 1;
          cswap(p, q, b);
          add(q, p);
          add(p, p);
          cswap(p, q, b);
        }
      }
      function scalarbase(p, s2) {
        var q = [gf(), gf(), gf(), gf()];
        set25519(q[0], X);
        set25519(q[1], Y);
        set25519(q[2], gf1);
        M(q[3], X, Y);
        scalarmult(p, q, s2);
      }
      function crypto_sign_keypair(pk, sk, seeded) {
        var d3 = new Uint8Array(64);
        var p = [gf(), gf(), gf(), gf()];
        var i;
        if (!seeded)
          randombytes(sk, 32);
        crypto_hash(d3, sk, 32);
        d3[0] &= 248;
        d3[31] &= 127;
        d3[31] |= 64;
        scalarbase(p, d3);
        pack(pk, p);
        for (i = 0; i < 32; i++)
          sk[i + 32] = pk[i];
        return 0;
      }
      var L = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
      function modL(r, x) {
        var carry, i, j, k;
        for (i = 63; i >= 32; --i) {
          carry = 0;
          for (j = i - 32, k = i - 12; j < k; ++j) {
            x[j] += carry - 16 * x[i] * L[j - (i - 32)];
            carry = Math.floor((x[j] + 128) / 256);
            x[j] -= carry * 256;
          }
          x[j] += carry;
          x[i] = 0;
        }
        carry = 0;
        for (j = 0; j < 32; j++) {
          x[j] += carry - (x[31] >> 4) * L[j];
          carry = x[j] >> 8;
          x[j] &= 255;
        }
        for (j = 0; j < 32; j++)
          x[j] -= carry * L[j];
        for (i = 0; i < 32; i++) {
          x[i + 1] += x[i] >> 8;
          r[i] = x[i] & 255;
        }
      }
      function reduce(r) {
        var x = new Float64Array(64), i;
        for (i = 0; i < 64; i++)
          x[i] = r[i];
        for (i = 0; i < 64; i++)
          r[i] = 0;
        modL(r, x);
      }
      function crypto_sign(sm, m, n, sk) {
        var d3 = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
        var i, j, x = new Float64Array(64);
        var p = [gf(), gf(), gf(), gf()];
        crypto_hash(d3, sk, 32);
        d3[0] &= 248;
        d3[31] &= 127;
        d3[31] |= 64;
        var smlen = n + 64;
        for (i = 0; i < n; i++)
          sm[64 + i] = m[i];
        for (i = 0; i < 32; i++)
          sm[32 + i] = d3[32 + i];
        crypto_hash(r, sm.subarray(32), n + 32);
        reduce(r);
        scalarbase(p, r);
        pack(sm, p);
        for (i = 32; i < 64; i++)
          sm[i] = sk[i];
        crypto_hash(h, sm, n + 64);
        reduce(h);
        for (i = 0; i < 64; i++)
          x[i] = 0;
        for (i = 0; i < 32; i++)
          x[i] = r[i];
        for (i = 0; i < 32; i++) {
          for (j = 0; j < 32; j++) {
            x[i + j] += h[i] * d3[j];
          }
        }
        modL(sm.subarray(32), x);
        return smlen;
      }
      function unpackneg(r, p) {
        var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
        set25519(r[2], gf1);
        unpack25519(r[1], p);
        S(num, r[1]);
        M(den, num, D);
        Z(num, num, r[2]);
        A(den, r[2], den);
        S(den2, den);
        S(den4, den2);
        M(den6, den4, den2);
        M(t, den6, num);
        M(t, t, den);
        pow2523(t, t);
        M(t, t, num);
        M(t, t, den);
        M(t, t, den);
        M(r[0], t, den);
        S(chk, r[0]);
        M(chk, chk, den);
        if (neq25519(chk, num))
          M(r[0], r[0], I);
        S(chk, r[0]);
        M(chk, chk, den);
        if (neq25519(chk, num))
          return -1;
        if (par25519(r[0]) === p[31] >> 7)
          Z(r[0], gf0, r[0]);
        M(r[3], r[0], r[1]);
        return 0;
      }
      function crypto_sign_open(m, sm, n, pk) {
        var i;
        var t = new Uint8Array(32), h = new Uint8Array(64);
        var p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
        if (n < 64)
          return -1;
        if (unpackneg(q, pk))
          return -1;
        for (i = 0; i < n; i++)
          m[i] = sm[i];
        for (i = 0; i < 32; i++)
          m[i + 32] = pk[i];
        crypto_hash(h, m, n);
        reduce(h);
        scalarmult(p, q, h);
        scalarbase(q, sm.subarray(32));
        add(p, q);
        pack(t, p);
        n -= 64;
        if (crypto_verify_32(sm, 0, t, 0)) {
          for (i = 0; i < n; i++)
            m[i] = 0;
          return -1;
        }
        for (i = 0; i < n; i++)
          m[i] = sm[i + 64];
        return n;
      }
      var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
      nacl3.lowlevel = {
        crypto_core_hsalsa20,
        crypto_stream_xor,
        crypto_stream,
        crypto_stream_salsa20_xor,
        crypto_stream_salsa20,
        crypto_onetimeauth,
        crypto_onetimeauth_verify,
        crypto_verify_16,
        crypto_verify_32,
        crypto_secretbox,
        crypto_secretbox_open,
        crypto_scalarmult,
        crypto_scalarmult_base,
        crypto_box_beforenm,
        crypto_box_afternm,
        crypto_box,
        crypto_box_open,
        crypto_box_keypair,
        crypto_hash,
        crypto_sign,
        crypto_sign_keypair,
        crypto_sign_open,
        crypto_secretbox_KEYBYTES,
        crypto_secretbox_NONCEBYTES,
        crypto_secretbox_ZEROBYTES,
        crypto_secretbox_BOXZEROBYTES,
        crypto_scalarmult_BYTES,
        crypto_scalarmult_SCALARBYTES,
        crypto_box_PUBLICKEYBYTES,
        crypto_box_SECRETKEYBYTES,
        crypto_box_BEFORENMBYTES,
        crypto_box_NONCEBYTES,
        crypto_box_ZEROBYTES,
        crypto_box_BOXZEROBYTES,
        crypto_sign_BYTES,
        crypto_sign_PUBLICKEYBYTES,
        crypto_sign_SECRETKEYBYTES,
        crypto_sign_SEEDBYTES,
        crypto_hash_BYTES,
        gf,
        D,
        L,
        pack25519,
        unpack25519,
        M,
        A,
        S,
        Z,
        pow2523,
        add,
        set25519,
        modL,
        scalarmult,
        scalarbase
      };
      function checkLengths(k, n) {
        if (k.length !== crypto_secretbox_KEYBYTES)
          throw new Error("bad key size");
        if (n.length !== crypto_secretbox_NONCEBYTES)
          throw new Error("bad nonce size");
      }
      function checkBoxLengths(pk, sk) {
        if (pk.length !== crypto_box_PUBLICKEYBYTES)
          throw new Error("bad public key size");
        if (sk.length !== crypto_box_SECRETKEYBYTES)
          throw new Error("bad secret key size");
      }
      function checkArrayTypes() {
        for (var i = 0; i < arguments.length; i++) {
          if (!(arguments[i] instanceof Uint8Array))
            throw new TypeError("unexpected type, use Uint8Array");
        }
      }
      function cleanup(arr) {
        for (var i = 0; i < arr.length; i++)
          arr[i] = 0;
      }
      nacl3.randomBytes = function(n) {
        var b = new Uint8Array(n);
        randombytes(b, n);
        return b;
      };
      nacl3.secretbox = function(msg, nonce, key) {
        checkArrayTypes(msg, nonce, key);
        checkLengths(key, nonce);
        var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
        var c = new Uint8Array(m.length);
        for (var i = 0; i < msg.length; i++)
          m[i + crypto_secretbox_ZEROBYTES] = msg[i];
        crypto_secretbox(c, m, m.length, nonce, key);
        return c.subarray(crypto_secretbox_BOXZEROBYTES);
      };
      nacl3.secretbox.open = function(box, nonce, key) {
        checkArrayTypes(box, nonce, key);
        checkLengths(key, nonce);
        var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
        var m = new Uint8Array(c.length);
        for (var i = 0; i < box.length; i++)
          c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
        if (c.length < 32)
          return null;
        if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0)
          return null;
        return m.subarray(crypto_secretbox_ZEROBYTES);
      };
      nacl3.secretbox.keyLength = crypto_secretbox_KEYBYTES;
      nacl3.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
      nacl3.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
      nacl3.scalarMult = function(n, p) {
        checkArrayTypes(n, p);
        if (n.length !== crypto_scalarmult_SCALARBYTES)
          throw new Error("bad n size");
        if (p.length !== crypto_scalarmult_BYTES)
          throw new Error("bad p size");
        var q = new Uint8Array(crypto_scalarmult_BYTES);
        crypto_scalarmult(q, n, p);
        return q;
      };
      nacl3.scalarMult.base = function(n) {
        checkArrayTypes(n);
        if (n.length !== crypto_scalarmult_SCALARBYTES)
          throw new Error("bad n size");
        var q = new Uint8Array(crypto_scalarmult_BYTES);
        crypto_scalarmult_base(q, n);
        return q;
      };
      nacl3.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
      nacl3.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
      nacl3.box = function(msg, nonce, publicKey, secretKey) {
        var k = nacl3.box.before(publicKey, secretKey);
        return nacl3.secretbox(msg, nonce, k);
      };
      nacl3.box.before = function(publicKey, secretKey) {
        checkArrayTypes(publicKey, secretKey);
        checkBoxLengths(publicKey, secretKey);
        var k = new Uint8Array(crypto_box_BEFORENMBYTES);
        crypto_box_beforenm(k, publicKey, secretKey);
        return k;
      };
      nacl3.box.after = nacl3.secretbox;
      nacl3.box.open = function(msg, nonce, publicKey, secretKey) {
        var k = nacl3.box.before(publicKey, secretKey);
        return nacl3.secretbox.open(msg, nonce, k);
      };
      nacl3.box.open.after = nacl3.secretbox.open;
      nacl3.box.keyPair = function() {
        var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
        crypto_box_keypair(pk, sk);
        return { publicKey: pk, secretKey: sk };
      };
      nacl3.box.keyPair.fromSecretKey = function(secretKey) {
        checkArrayTypes(secretKey);
        if (secretKey.length !== crypto_box_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
        crypto_scalarmult_base(pk, secretKey);
        return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
      };
      nacl3.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
      nacl3.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
      nacl3.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
      nacl3.box.nonceLength = crypto_box_NONCEBYTES;
      nacl3.box.overheadLength = nacl3.secretbox.overheadLength;
      nacl3.sign = function(msg, secretKey) {
        checkArrayTypes(msg, secretKey);
        if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
        crypto_sign(signedMsg, msg, msg.length, secretKey);
        return signedMsg;
      };
      nacl3.sign.open = function(signedMsg, publicKey) {
        checkArrayTypes(signedMsg, publicKey);
        if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
          throw new Error("bad public key size");
        var tmp = new Uint8Array(signedMsg.length);
        var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
        if (mlen < 0)
          return null;
        var m = new Uint8Array(mlen);
        for (var i = 0; i < m.length; i++)
          m[i] = tmp[i];
        return m;
      };
      nacl3.sign.detached = function(msg, secretKey) {
        var signedMsg = nacl3.sign(msg, secretKey);
        var sig = new Uint8Array(crypto_sign_BYTES);
        for (var i = 0; i < sig.length; i++)
          sig[i] = signedMsg[i];
        return sig;
      };
      nacl3.sign.detached.verify = function(msg, sig, publicKey) {
        checkArrayTypes(msg, sig, publicKey);
        if (sig.length !== crypto_sign_BYTES)
          throw new Error("bad signature size");
        if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
          throw new Error("bad public key size");
        var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
        var m = new Uint8Array(crypto_sign_BYTES + msg.length);
        var i;
        for (i = 0; i < crypto_sign_BYTES; i++)
          sm[i] = sig[i];
        for (i = 0; i < msg.length; i++)
          sm[i + crypto_sign_BYTES] = msg[i];
        return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
      };
      nacl3.sign.keyPair = function() {
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
        crypto_sign_keypair(pk, sk);
        return { publicKey: pk, secretKey: sk };
      };
      nacl3.sign.keyPair.fromSecretKey = function(secretKey) {
        checkArrayTypes(secretKey);
        if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        for (var i = 0; i < pk.length; i++)
          pk[i] = secretKey[32 + i];
        return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
      };
      nacl3.sign.keyPair.fromSeed = function(seed) {
        checkArrayTypes(seed);
        if (seed.length !== crypto_sign_SEEDBYTES)
          throw new Error("bad seed size");
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
        for (var i = 0; i < 32; i++)
          sk[i] = seed[i];
        crypto_sign_keypair(pk, sk, true);
        return { publicKey: pk, secretKey: sk };
      };
      nacl3.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
      nacl3.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
      nacl3.sign.seedLength = crypto_sign_SEEDBYTES;
      nacl3.sign.signatureLength = crypto_sign_BYTES;
      nacl3.hash = function(msg) {
        checkArrayTypes(msg);
        var h = new Uint8Array(crypto_hash_BYTES);
        crypto_hash(h, msg, msg.length);
        return h;
      };
      nacl3.hash.hashLength = crypto_hash_BYTES;
      nacl3.verify = function(x, y) {
        checkArrayTypes(x, y);
        if (x.length === 0 || y.length === 0)
          return false;
        if (x.length !== y.length)
          return false;
        return vn(x, 0, y, 0, x.length) === 0 ? true : false;
      };
      nacl3.setPRNG = function(fn) {
        randombytes = fn;
      };
      (function() {
        var crypto = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
        if (crypto && crypto.getRandomValues) {
          var QUOTA = 65536;
          nacl3.setPRNG(function(x, n) {
            var i, v = new Uint8Array(n);
            for (i = 0; i < n; i += QUOTA) {
              crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
            }
            for (i = 0; i < n; i++)
              x[i] = v[i];
            cleanup(v);
          });
        } else if (typeof __require !== "undefined") {
          crypto = __require("crypto");
          if (crypto && crypto.randomBytes) {
            nacl3.setPRNG(function(x, n) {
              var i, v = crypto.randomBytes(n);
              for (i = 0; i < n; i++)
                x[i] = v[i];
              cleanup(v);
            });
          }
        }
      })();
    })(typeof module2 !== "undefined" && module2.exports ? module2.exports : self.nacl = self.nacl || {});
  }
});

// node_modules/@holochain/serialization/dist/index.js
var wasm$1;
var heap = new Array(32).fill(void 0);
heap.push(void 0, null, true, false);
function getObject(idx) {
  return heap[idx];
}
var heap_next = heap.length;
function dropObject(idx) {
  if (idx < 36)
    return;
  heap[idx] = heap_next;
  heap_next = idx;
}
function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
var WASM_VECTOR_LEN = 0;
var cachedUint8Memory0 = new Uint8Array();
function getUint8Memory0() {
  if (cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm$1.memory.buffer);
  }
  return cachedUint8Memory0;
}
var cachedTextEncoder = new TextEncoder("utf-8");
var encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
} : function(arg, view) {
  const buf = cachedTextEncoder.encode(arg);
  view.set(buf);
  return {
    read: arg.length,
    written: buf.length
  };
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length);
    getUint8Memory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len);
  const mem = getUint8Memory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127)
      break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
function isLikeNone(x) {
  return x === void 0 || x === null;
}
var cachedInt32Memory0 = new Int32Array();
function getInt32Memory0() {
  if (cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm$1.memory.buffer);
  }
  return cachedInt32Memory0;
}
var cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
function addHeapObject(obj) {
  if (heap_next === heap.length)
    heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
var cachedFloat64Memory0 = new Float64Array();
function getFloat64Memory0() {
  if (cachedFloat64Memory0.byteLength === 0) {
    cachedFloat64Memory0 = new Float64Array(wasm$1.memory.buffer);
  }
  return cachedFloat64Memory0;
}
function debugString(val) {
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    return toString.call(val);
  }
  if (className == "Object") {
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  if (val instanceof Error) {
    return `${val.name}: ${val.message}
${val.stack}`;
  }
  return className;
}
function getArrayU8FromWasm0(ptr, len) {
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
function hashZomeCall$1(value) {
  try {
    const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
    wasm$1.hashZomeCall(retptr, addHeapObject(value));
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    if (r3) {
      throw takeObject(r2);
    }
    var v0 = getArrayU8FromWasm0(r0, r1).slice();
    wasm$1.__wbindgen_free(r0, r1 * 1);
    return v0;
  } finally {
    wasm$1.__wbindgen_add_to_stack_pointer(16);
  }
}
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e2) {
    wasm$1.__wbindgen_exn_store(addHeapObject(e2));
  }
}
async function load(module2, imports) {
  if (typeof Response === "function" && module2 instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module2, imports);
      } catch (e2) {
        if (module2.headers.get("Content-Type") != "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e2);
        } else {
          throw e2;
        }
      }
    }
    const bytes = await module2.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance2 = await WebAssembly.instantiate(module2, imports);
    if (instance2 instanceof WebAssembly.Instance) {
      return { instance: instance2, module: module2 };
    } else {
      return instance2;
    }
  }
}
function getImports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
  };
  imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof obj === "string" ? obj : void 0;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    const ret = typeof val === "object" && val !== null;
    return ret;
  };
  imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_is_null = function(arg0) {
    const ret = getObject(arg0) === null;
    return ret;
  };
  imports.wbg.__wbindgen_is_undefined = function(arg0) {
    const ret = getObject(arg0) === void 0;
    return ret;
  };
  imports.wbg.__wbindgen_boolean_get = function(arg0) {
    const v = getObject(arg0);
    const ret = typeof v === "boolean" ? v ? 1 : 0 : 2;
    return ret;
  };
  imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof obj === "number" ? obj : void 0;
    getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
  };
  imports.wbg.__wbg_String_9aa17d6248d519a5 = function(arg0, arg1) {
    const ret = String(getObject(arg1));
    const ptr0 = passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbg_get_723f83ba0c34871a = function(arg0, arg1) {
    const ret = getObject(arg0)[takeObject(arg1)];
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_is_function = function(arg0) {
    const ret = typeof getObject(arg0) === "function";
    return ret;
  };
  imports.wbg.__wbg_next_579e583d33566a86 = function(arg0) {
    const ret = getObject(arg0).next;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_next_aaef7c8aa5e212ac = function() {
    return handleError(function(arg0) {
      const ret = getObject(arg0).next();
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_done_1b73b0672e15f234 = function(arg0) {
    const ret = getObject(arg0).done;
    return ret;
  };
  imports.wbg.__wbg_value_1ccc36bc03462d71 = function(arg0) {
    const ret = getObject(arg0).value;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_iterator_6f9d4f28845f426c = function() {
    const ret = Symbol.iterator;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_get_765201544a2b6869 = function() {
    return handleError(function(arg0, arg1) {
      const ret = Reflect.get(getObject(arg0), getObject(arg1));
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_call_97ae9d8645dc388b = function() {
    return handleError(function(arg0, arg1) {
      const ret = getObject(arg0).call(getObject(arg1));
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_isArray_27c46c67f498e15d = function(arg0) {
    const ret = Array.isArray(getObject(arg0));
    return ret;
  };
  imports.wbg.__wbg_instanceof_ArrayBuffer_e5e48f4762c5610b = function(arg0) {
    let result;
    try {
      result = getObject(arg0) instanceof ArrayBuffer;
    } catch {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbg_values_e42671acbf11ec04 = function(arg0) {
    const ret = getObject(arg0).values();
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_new_8d2af00bc1e329ee = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_isSafeInteger_dfa0593e8d7ac35a = function(arg0) {
    const ret = Number.isSafeInteger(getObject(arg0));
    return ret;
  };
  imports.wbg.__wbg_buffer_3f3d764d4747d564 = function(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_new_8c3f0052272a457a = function(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_set_83db9690f9353e79 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
  };
  imports.wbg.__wbg_length_9e1ae1900cb0fbd5 = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
  };
  imports.wbg.__wbg_instanceof_Uint8Array_971eeda69eb75003 = function(arg0) {
    let result;
    try {
      result = getObject(arg0) instanceof Uint8Array;
    } catch {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
    const ret = new Error();
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
    const ret = getObject(arg1).stack;
    const ptr0 = passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
    try {
      console.error(getStringFromWasm0(arg0, arg1));
    } finally {
      wasm$1.__wbindgen_free(arg0, arg1);
    }
  };
  imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr0 = passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  imports.wbg.__wbindgen_memory = function() {
    const ret = wasm$1.memory;
    return addHeapObject(ret);
  };
  return imports;
}
function finalizeInit(instance2, module2) {
  wasm$1 = instance2.exports;
  init.__wbindgen_wasm_module = module2;
  cachedFloat64Memory0 = new Float64Array();
  cachedInt32Memory0 = new Int32Array();
  cachedUint8Memory0 = new Uint8Array();
  return wasm$1;
}
function initSync(module2) {
  const imports = getImports();
  if (!(module2 instanceof WebAssembly.Module)) {
    module2 = new WebAssembly.Module(module2);
  }
  const instance2 = new WebAssembly.Instance(module2, imports);
  return finalizeInit(instance2, module2);
}
async function init(input) {
  const imports = getImports();
  if (typeof input === "string" || typeof Request === "function" && input instanceof Request || typeof URL === "function" && input instanceof URL) {
    input = fetch(input);
  }
  const { instance: instance2, module: module2 } = await load(await input, imports);
  return finalizeInit(instance2, module2);
}
var exports2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  hashZomeCall: hashZomeCall$1,
  initSync,
  "default": init
});
var base64codes = [62, 0, 0, 0, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 0, 0, 0, 0, 0, 0, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
function getBase64Code(charCode) {
  return base64codes[charCode - 43];
}
function base64_decode(str) {
  let missingOctets = str.endsWith("==") ? 2 : str.endsWith("=") ? 1 : 0;
  let n = str.length;
  let result = new Uint8Array(3 * (n / 4));
  let buffer;
  for (let i = 0, j = 0; i < n; i += 4, j += 3) {
    buffer = getBase64Code(str.charCodeAt(i)) << 18 | getBase64Code(str.charCodeAt(i + 1)) << 12 | getBase64Code(str.charCodeAt(i + 2)) << 6 | getBase64Code(str.charCodeAt(i + 3));
    result[j] = buffer >> 16;
    result[j + 1] = buffer >> 8 & 255;
    result[j + 2] = buffer & 255;
  }
  return result.subarray(0, result.length - missingOctets);
}
var wasm_code = base64_decode("AGFzbQEAAAABrAEYYAJ/fwF/YAN/f38Bf2ABfwF/YAJ/fwBgAX8AYAN/f38AYAABf2AFf39/f38AYAR/f39/AGAAAGABfwF+YAZ/f39/f38AYAR/f39/AX9gBX9/f39/AX9gBn9/f39/fwF/YAl/f39/f39+fn4AYAd/f39/f39/AX9gA35/fwF/YAV/f35/fwBgBH9+f38AYAV/f3x/fwBgBH98f38AYAV/f31/fwBgBH99f38AArAJJAN3YmcaX193YmluZGdlbl9vYmplY3RfZHJvcF9yZWYABAN3YmcVX193YmluZGdlbl9zdHJpbmdfZ2V0AAMDd2JnFF9fd2JpbmRnZW5faXNfb2JqZWN0AAIDd2JnFF9fd2JpbmRnZW5fZXJyb3JfbmV3AAADd2JnEl9fd2JpbmRnZW5faXNfbnVsbAACA3diZxdfX3diaW5kZ2VuX2lzX3VuZGVmaW5lZAACA3diZxZfX3diaW5kZ2VuX2Jvb2xlYW5fZ2V0AAIDd2JnFV9fd2JpbmRnZW5fbnVtYmVyX2dldAADA3diZx1fX3diZ19TdHJpbmdfOWFhMTdkNjI0OGQ1MTlhNQADA3diZxpfX3diZ19nZXRfNzIzZjgzYmEwYzM0ODcxYQAAA3diZxtfX3diaW5kZ2VuX29iamVjdF9jbG9uZV9yZWYAAgN3YmcWX193YmluZGdlbl9pc19mdW5jdGlvbgACA3diZxtfX3diZ19uZXh0XzU3OWU1ODNkMzM1NjZhODYAAgN3YmcbX193YmdfbmV4dF9hYWVmN2M4YWE1ZTIxMmFjAAIDd2JnG19fd2JnX2RvbmVfMWI3M2IwNjcyZTE1ZjIzNAACA3diZxxfX3diZ192YWx1ZV8xY2NjMzZiYzAzNDYyZDcxAAIDd2JnH19fd2JnX2l0ZXJhdG9yXzZmOWQ0ZjI4ODQ1ZjQyNmMABgN3YmcaX193YmdfZ2V0Xzc2NTIwMTU0NGEyYjY4NjkAAAN3YmcbX193YmdfY2FsbF85N2FlOWQ4NjQ1ZGMzODhiAAADd2JnFV9fd2JpbmRnZW5fc3RyaW5nX25ldwAAA3diZx5fX3diZ19pc0FycmF5XzI3YzQ2YzY3ZjQ5OGUxNWQAAgN3YmctX193YmdfaW5zdGFuY2VvZl9BcnJheUJ1ZmZlcl9lNWU0OGY0NzYyYzU2MTBiAAIDd2JnHV9fd2JnX3ZhbHVlc19lNDI2NzFhY2JmMTFlYzA0AAIDd2JnGl9fd2JnX25ld184ZDJhZjAwYmMxZTMyOWVlAAADd2JnJF9fd2JnX2lzU2FmZUludGVnZXJfZGZhMDU5M2U4ZDdhYzM1YQACA3diZx1fX3diZ19idWZmZXJfM2YzZDc2NGQ0NzQ3ZDU2NAACA3diZxpfX3diZ19uZXdfOGMzZjAwNTIyNzJhNDU3YQACA3diZxpfX3diZ19zZXRfODNkYjk2OTBmOTM1M2U3OQAFA3diZx1fX3diZ19sZW5ndGhfOWUxYWUxOTAwY2IwZmJkNQACA3diZyxfX3diZ19pbnN0YW5jZW9mX1VpbnQ4QXJyYXlfOTcxZWVkYTY5ZWI3NTAwMwACA3diZxpfX3diZ19uZXdfYWJkYTc2ZTg4M2JhOGE1ZgAGA3diZxxfX3diZ19zdGFja182NTgyNzlmZTQ0NTQxY2Y2AAMDd2JnHF9fd2JnX2Vycm9yX2Y4NTE2NjdhZjcxYmNmYzYAAwN3YmcXX193YmluZGdlbl9kZWJ1Z19zdHJpbmcAAwN3YmcQX193YmluZGdlbl90aHJvdwADA3diZxFfX3diaW5kZ2VuX21lbW9yeQAGA9IB0AECAAQBAAABAwUOCAEBAAMFAQMDAQAPCwALAhAAAAARAAEDBAAGAwIHAAACAgAFBQUDDAcICAMCAwsDAAMAAwIGBwABAAAFAAADBQAAAAADAAMAAAAAAAAAAAQJAQEBAQUDAA0JCQMCBAAAAAAAAwUFAwQEBAEFAA4DABIUBxYNAwQIAAECAAIDAAEAAAwAAwIAAAcAAAQAAAMCAAICAgICAgMCAAAFBQUAAwEAAAIAAAkAAAICAgIDAQABAQEAAAAAAAAAAAIGAAACAgMKCgoEBAcBcAGJAYkBBQMBABEGCQF/AUGAgMAACweSAQcGbWVtb3J5AgAMaGFzaFpvbWVDYWxsAFsRX193YmluZGdlbl9tYWxsb2MAigESX193YmluZGdlbl9yZWFsbG9jAJgBH19fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIA0QEPX193YmluZGdlbl9mcmVlALIBFF9fd2JpbmRnZW5fZXhuX3N0b3JlALkBCfABAQBBAQuIAfMBugHiAdIB5QHkAecB4QHmAeMBtQEotwHMAaQBggFBdvMBrgGkAYIBQfMBUGCkAYIBQfMBmgHzAfMB8wHvAe8B7wGRAZEBgQFAbl7zAYEBQG+1AaQBggFBd/MBT/MBjwGsAaIBXKABogGbAacBpQGgAaABoQGfAZ4B8wGBAUBwpAGCAUF48wGxAZYB8wGNAfMBqQFlefMBqQHVAbcBpgHPAZ0BhQFHuwFy8wF/P3GOAdYBpAHxAfABlwFJWYQBvAHyAYsBkAHzAYABxwFzyAFntAG+AbUBamg78wHyAdABN016zgFMdd0BCquLBdAB3yECD38BfiMAQRBrIggkAAJAAkAgAEH1AU8EQEEIQQgQrwEhAkEUQQgQrwEhA0EQQQgQrwEhBUEAQRBBCBCvAUECdGsiBEGAgHwgBSACIANqamtBd3FBA2siAiACIARLGyAATQ0CIABBBGpBCBCvASEEQZTnwAAoAgBFDQFBACAEayEBAkACQAJ/QQAgBEGAAkkNABpBHyAEQf///wdLDQAaIARBBiAEQQh2ZyIAa3ZBAXEgAEEBdGtBPmoLIgdBAnRBoOnAAGooAgAiAARAIAQgBxCqAXQhBkEAIQNBACECA0ACQCAAENcBIgUgBEkNACAFIARrIgUgAU8NACAAIQIgBSIBDQBBACEBDAMLIABBFGooAgAiBSADIAUgACAGQR12QQRxakEQaigCACIARxsgAyAFGyEDIAZBAXQhBiAADQALIAMEQCADIQAMAgsgAg0CC0EAIQJBASAHdBCzAUGU58AAKAIAcSIARQ0DIAAQwwFoQQJ0QaDpwABqKAIAIgBFDQMLA0AgACACIAAQ1wEiAiAETyACIARrIgMgAUlxIgUbIQIgAyABIAUbIQEgABCoASIADQALIAJFDQILIARBoOrAACgCACIATSABIAAgBGtPcQ0BIAIgBBDrASEAIAIQRgJAQRBBCBCvASABTQRAIAIgBBDFASAAIAEQqwEgAUGAAk8EQCAAIAEQRQwCCyABQXhxQZjnwABqIQMCf0GQ58AAKAIAIgVBASABQQN2dCIBcQRAIAMoAggMAQtBkOfAACABIAVyNgIAIAMLIQEgAyAANgIIIAEgADYCDCAAIAM2AgwgACABNgIIDAELIAIgASAEahCjAQsgAhDtASIBRQ0BDAILQRAgAEEEakEQQQgQrwFBBWsgAEsbQQgQrwEhBAJAAkACQAJ/AkACQEGQ58AAKAIAIgUgBEEDdiIBdiIAQQNxRQRAIARBoOrAACgCAE0NByAADQFBlOfAACgCACIARQ0HIAAQwwFoQQJ0QaDpwABqKAIAIgIQ1wEgBGshASACEKgBIgAEQANAIAAQ1wEgBGsiAyABIAEgA0siAxshASAAIAIgAxshAiAAEKgBIgANAAsLIAIgBBDrASEFIAIQRkEQQQgQrwEgAUsNBSACIAQQxQEgBSABEKsBQaDqwAAoAgAiBkUNBCAGQXhxQZjnwABqIQBBqOrAACgCACEDQZDnwAAoAgAiB0EBIAZBA3Z0IgZxRQ0CIAAoAggMAwsCQCAAQX9zQQFxIAFqIgBBA3QiA0Gg58AAaigCACIBQQhqKAIAIgIgA0GY58AAaiIDRwRAIAIgAzYCDCADIAI2AggMAQtBkOfAACAFQX4gAHdxNgIACyABIABBA3QQowEgARDtASEBDAcLAkBBASABQR9xIgF0ELMBIAAgAXRxEMMBaCIAQQN0IgNBoOfAAGooAgAiAkEIaigCACIBIANBmOfAAGoiA0cEQCABIAM2AgwgAyABNgIIDAELQZDnwABBkOfAACgCAEF+IAB3cTYCAAsgAiAEEMUBIAIgBBDrASIFIABBA3QgBGsiBBCrAUGg6sAAKAIAIgMEQCADQXhxQZjnwABqIQBBqOrAACgCACEBAn9BkOfAACgCACIGQQEgA0EDdnQiA3EEQCAAKAIIDAELQZDnwAAgAyAGcjYCACAACyEDIAAgATYCCCADIAE2AgwgASAANgIMIAEgAzYCCAtBqOrAACAFNgIAQaDqwAAgBDYCACACEO0BIQEMBgtBkOfAACAGIAdyNgIAIAALIQYgACADNgIIIAYgAzYCDCADIAA2AgwgAyAGNgIIC0Go6sAAIAU2AgBBoOrAACABNgIADAELIAIgASAEahCjAQsgAhDtASIBDQELAkACQAJAAkACQAJAAkACQCAEQaDqwAAoAgAiAUsEQEGk6sAAKAIAIgAgBEsNAkEIQQgQrwEgBGpBFEEIEK8BakEQQQgQrwFqQYCABBCvASIBQRB2QAAhACAIQQA2AgggCEEAIAFBgIB8cSAAQX9GIgEbNgIEIAhBACAAQRB0IAEbNgIAIAgoAgAiAQ0BQQAhAQwJC0Go6sAAKAIAIQBBEEEIEK8BIAEgBGsiAUsEQEGo6sAAQQA2AgBBoOrAACgCACEBQaDqwABBADYCACAAIAEQowEgABDtASEBDAkLIAAgBBDrASECQaDqwAAgATYCAEGo6sAAIAI2AgAgAiABEKsBIAAgBBDFASAAEO0BIQEMCAsgCCgCCCEFQbDqwAAgCCgCBCIDQbDqwAAoAgBqIgA2AgBBtOrAAEG06sAAKAIAIgIgACAAIAJJGzYCAAJAAkBBrOrAACgCAARAQbjqwAAhAANAIAAQxgEgAUYNAiAAKAIIIgANAAsMAgtBzOrAACgCACIARSAAIAFLcg0DDAcLIAAQ2QENACAAENoBIAVHDQAgACgCACICQazqwAAoAgAiBk0EfyACIAAoAgRqIAZLBUEACw0DC0HM6sAAQczqwAAoAgAiACABIAAgAUkbNgIAIAEgA2ohAkG46sAAIQACQAJAA0AgAiAAKAIARwRAIAAoAggiAA0BDAILCyAAENkBDQAgABDaASAFRg0BC0Gs6sAAKAIAIQJBuOrAACEAAkADQCACIAAoAgBPBEAgABDGASACSw0CCyAAKAIIIgANAAtBACEACyACIAAQxgEiD0EUQQgQrwEiDmtBF2siABDtASIGQQgQrwEgBmsgAGoiACAAQRBBCBCvASACakkbIgYQ7QEhByAGIA4Q6wEhAEEIQQgQrwEhCUEUQQgQrwEhC0EQQQgQrwEhDEGs6sAAIAEgARDtASIKQQgQrwEgCmsiDRDrASIKNgIAQaTqwAAgA0EIaiAMIAkgC2pqIA1qayIJNgIAIAogCUEBcjYCBEEIQQgQrwEhC0EUQQgQrwEhDEEQQQgQrwEhDSAKIAkQ6wEgDSAMIAtBCGtqajYCBEHI6sAAQYCAgAE2AgAgBiAOEMUBQbjqwAApAgAhECAHQQhqQcDqwAApAgA3AgAgByAQNwIAQcTqwAAgBTYCAEG86sAAIAM2AgBBuOrAACABNgIAQcDqwAAgBzYCAANAIABBBBDrASAAQQc2AgQiAEEEaiAPSQ0ACyACIAZGDQcgAiAGIAJrIgAgAiAAEOsBEJkBIABBgAJPBEAgAiAAEEUMCAsgAEF4cUGY58AAaiEBAn9BkOfAACgCACIDQQEgAEEDdnQiAHEEQCABKAIIDAELQZDnwAAgACADcjYCACABCyEAIAEgAjYCCCAAIAI2AgwgAiABNgIMIAIgADYCCAwHCyAAKAIAIQUgACABNgIAIAAgACgCBCADajYCBCABEO0BIgBBCBCvASECIAUQ7QEiA0EIEK8BIQYgASACIABraiICIAQQ6wEhASACIAQQxQEgBSAGIANraiIAIAIgBGprIQRBrOrAACgCACAARwRAIABBqOrAACgCAEYNBCAAKAIEQQNxQQFHDQUCQCAAENcBIgNBgAJPBEAgABBGDAELIABBDGooAgAiBSAAQQhqKAIAIgZHBEAgBiAFNgIMIAUgBjYCCAwBC0GQ58AAQZDnwAAoAgBBfiADQQN2d3E2AgALIAMgBGohBCAAIAMQ6wEhAAwFC0Gs6sAAIAE2AgBBpOrAAEGk6sAAKAIAIARqIgA2AgAgASAAQQFyNgIEIAIQ7QEhAQwHC0Gk6sAAIAAgBGsiATYCAEGs6sAAQazqwAAoAgAiACAEEOsBIgI2AgAgAiABQQFyNgIEIAAgBBDFASAAEO0BIQEMBgtBzOrAACABNgIADAMLIAAgACgCBCADajYCBEGk6sAAKAIAIANqIQFBrOrAACgCACIAIAAQ7QEiAEEIEK8BIABrIgIQ6wEhAEGk6sAAIAEgAmsiATYCAEGs6sAAIAA2AgAgACABQQFyNgIEQQhBCBCvASECQRRBCBCvASEDQRBBCBCvASEFIAAgARDrASAFIAMgAkEIa2pqNgIEQcjqwABBgICAATYCAAwDC0Go6sAAIAE2AgBBoOrAAEGg6sAAKAIAIARqIgA2AgAgASAAEKsBIAIQ7QEhAQwDCyABIAQgABCZASAEQYACTwRAIAEgBBBFIAIQ7QEhAQwDCyAEQXhxQZjnwABqIQACf0GQ58AAKAIAIgNBASAEQQN2dCIFcQRAIAAoAggMAQtBkOfAACADIAVyNgIAIAALIQMgACABNgIIIAMgATYCDCABIAA2AgwgASADNgIIIAIQ7QEhAQwCC0HQ6sAAQf8fNgIAQcTqwAAgBTYCAEG86sAAIAM2AgBBuOrAACABNgIAQaTnwABBmOfAADYCAEGs58AAQaDnwAA2AgBBoOfAAEGY58AANgIAQbTnwABBqOfAADYCAEGo58AAQaDnwAA2AgBBvOfAAEGw58AANgIAQbDnwABBqOfAADYCAEHE58AAQbjnwAA2AgBBuOfAAEGw58AANgIAQcznwABBwOfAADYCAEHA58AAQbjnwAA2AgBB1OfAAEHI58AANgIAQcjnwABBwOfAADYCAEHc58AAQdDnwAA2AgBB0OfAAEHI58AANgIAQeTnwABB2OfAADYCAEHY58AAQdDnwAA2AgBB4OfAAEHY58AANgIAQeznwABB4OfAADYCAEHo58AAQeDnwAA2AgBB9OfAAEHo58AANgIAQfDnwABB6OfAADYCAEH858AAQfDnwAA2AgBB+OfAAEHw58AANgIAQYTowABB+OfAADYCAEGA6MAAQfjnwAA2AgBBjOjAAEGA6MAANgIAQYjowABBgOjAADYCAEGU6MAAQYjowAA2AgBBkOjAAEGI6MAANgIAQZzowABBkOjAADYCAEGY6MAAQZDowAA2AgBBpOjAAEGY6MAANgIAQazowABBoOjAADYCAEGg6MAAQZjowAA2AgBBtOjAAEGo6MAANgIAQajowABBoOjAADYCAEG86MAAQbDowAA2AgBBsOjAAEGo6MAANgIAQcTowABBuOjAADYCAEG46MAAQbDowAA2AgBBzOjAAEHA6MAANgIAQcDowABBuOjAADYCAEHU6MAAQcjowAA2AgBByOjAAEHA6MAANgIAQdzowABB0OjAADYCAEHQ6MAAQcjowAA2AgBB5OjAAEHY6MAANgIAQdjowABB0OjAADYCAEHs6MAAQeDowAA2AgBB4OjAAEHY6MAANgIAQfTowABB6OjAADYCAEHo6MAAQeDowAA2AgBB/OjAAEHw6MAANgIAQfDowABB6OjAADYCAEGE6cAAQfjowAA2AgBB+OjAAEHw6MAANgIAQYzpwABBgOnAADYCAEGA6cAAQfjowAA2AgBBlOnAAEGI6cAANgIAQYjpwABBgOnAADYCAEGc6cAAQZDpwAA2AgBBkOnAAEGI6cAANgIAQZjpwABBkOnAADYCAEEIQQgQrwEhAkEUQQgQrwEhBUEQQQgQrwEhBkGs6sAAIAEgARDtASIAQQgQrwEgAGsiARDrASIANgIAQaTqwAAgA0EIaiAGIAIgBWpqIAFqayIBNgIAIAAgAUEBcjYCBEEIQQgQrwEhAkEUQQgQrwEhA0EQQQgQrwEhBSAAIAEQ6wEgBSADIAJBCGtqajYCBEHI6sAAQYCAgAE2AgALQQAhAUGk6sAAKAIAIgAgBE0NAEGk6sAAIAAgBGsiATYCAEGs6sAAQazqwAAoAgAiACAEEOsBIgI2AgAgAiABQQFyNgIEIAAgBBDFASAAEO0BIQELIAhBEGokACABC5wJAQd/AkAgAUH/CU0EQCABQQV2IQUCQAJAAkAgACgCACIEBEAgACAEQQJ0aiECIAAgBCAFakECdGohBiAEQQFrIgNBJ0shBANAIAQNBCADIAVqIgdBKE8NAiAGIAIoAgA2AgAgBkEEayEGIAJBBGshAiADQQFrIgNBf0cNAAsLIAFBIEkNBCAAQQA2AgQgAUHAAE8NAQwECyAHQShBtN7AABBpAAsgAEEIakEANgIAIAVBASAFQQFLGyICQQJGDQIgAEEMakEANgIAIAJBA0YNAiAAQRBqQQA2AgAgAkEERg0CIABBFGpBADYCACACQQVGDQIgAEEYakEANgIAIAJBBkYNAiAAQRxqQQA2AgAgAkEHRg0CIABBIGpBADYCACACQQhGDQIgAEEkakEANgIAIAJBCUYNAiAAQShqQQA2AgAgAkEKRg0CIABBLGpBADYCACACQQtGDQIgAEEwakEANgIAIAJBDEYNAiAAQTRqQQA2AgAgAkENRg0CIABBOGpBADYCACACQQ5GDQIgAEE8akEANgIAIAJBD0YNAiAAQUBrQQA2AgAgAkEQRg0CIABBxABqQQA2AgAgAkERRg0CIABByABqQQA2AgAgAkESRg0CIABBzABqQQA2AgAgAkETRg0CIABB0ABqQQA2AgAgAkEURg0CIABB1ABqQQA2AgAgAkEVRg0CIABB2ABqQQA2AgAgAkEWRg0CIABB3ABqQQA2AgAgAkEXRg0CIABB4ABqQQA2AgAgAkEYRg0CIABB5ABqQQA2AgAgAkEZRg0CIABB6ABqQQA2AgAgAkEaRg0CIABB7ABqQQA2AgAgAkEbRg0CIABB8ABqQQA2AgAgAkEcRg0CIABB9ABqQQA2AgAgAkEdRg0CIABB+ABqQQA2AgAgAkEeRg0CIABB/ABqQQA2AgAgAkEfRg0CIABBgAFqQQA2AgAgAkEgRg0CIABBhAFqQQA2AgAgAkEhRg0CIABBiAFqQQA2AgAgAkEiRg0CIABBjAFqQQA2AgAgAkEjRg0CIABBkAFqQQA2AgAgAkEkRg0CIABBlAFqQQA2AgAgAkElRg0CIABBmAFqQQA2AgAgAkEmRg0CIABBnAFqQQA2AgAgAkEnRg0CIABBoAFqQQA2AgAgAkEoRg0CQShBKEG03sAAEGkACyADQShBtN7AABBpAAtB3t7AAEEdQbTewAAQgwEACyAAKAIAIAVqIQIgAUEfcSIHRQRAIAAgAjYCACAADwsCQCACQQFrIgNBJ00EQCACIQQgACADQQJ0akEEaigCACIGQQAgAWsiAXYiA0UNASACQSdNBEAgACACQQJ0akEEaiADNgIAIAJBAWohBAwCCyACQShBtN7AABBpAAsgA0EoQbTewAAQaQALAkAgAiAFQQFqIghLBEAgAUEfcSEBIAJBAnQgAGpBBGshAwNAIAJBAmtBKE8NAiADQQRqIAYgB3QgAygCACIGIAF2cjYCACADQQRrIQMgCCACQQFrIgJJDQALCyAAIAVBAnRqQQRqIgEgASgCACAHdDYCACAAIAQ2AgAgAA8LQX9BKEG03sAAEGkAC5EHAQV/IAAQ7gEiACAAENcBIgIQ6wEhAQJAAkACQCAAENgBDQAgACgCACEDAkAgABDEAUUEQCACIANqIQIgACADEOwBIgBBqOrAACgCAEcNASABKAIEQQNxQQNHDQJBoOrAACACNgIAIAAgAiABEJkBDwsgAiADakEQaiEADAILIANBgAJPBEAgABBGDAELIABBDGooAgAiBCAAQQhqKAIAIgVHBEAgBSAENgIMIAQgBTYCCAwBC0GQ58AAQZDnwAAoAgBBfiADQQN2d3E2AgALAkAgARC9AQRAIAAgAiABEJkBDAELAkACQAJAQazqwAAoAgAgAUcEQCABQajqwAAoAgBHDQFBqOrAACAANgIAQaDqwABBoOrAACgCACACaiIBNgIAIAAgARCrAQ8LQazqwAAgADYCAEGk6sAAQaTqwAAoAgAgAmoiATYCACAAIAFBAXI2AgQgAEGo6sAAKAIARg0BDAILIAEQ1wEiAyACaiECAkAgA0GAAk8EQCABEEYMAQsgAUEMaigCACIEIAFBCGooAgAiAUcEQCABIAQ2AgwgBCABNgIIDAELQZDnwABBkOfAACgCAEF+IANBA3Z3cTYCAAsgACACEKsBIABBqOrAACgCAEcNAkGg6sAAIAI2AgAMAwtBoOrAAEEANgIAQajqwABBADYCAAtByOrAACgCACABTw0BQQhBCBCvASEAQRRBCBCvASEBQRBBCBCvASEDQQBBEEEIEK8BQQJ0ayICQYCAfCADIAAgAWpqa0F3cUEDayIAIAAgAksbRQ0BQazqwAAoAgBFDQFBCEEIEK8BIQBBFEEIEK8BIQFBEEEIEK8BIQJBAAJAQaTqwAAoAgAiBCACIAEgAEEIa2pqIgJNDQBBrOrAACgCACEBQbjqwAAhAAJAA0AgASAAKAIATwRAIAAQxgEgAUsNAgsgACgCCCIADQALQQAhAAsgABDZAQ0AIABBDGooAgAaDAALQQAQSGtHDQFBpOrAACgCAEHI6sAAKAIATQ0BQcjqwABBfzYCAA8LIAJBgAJJDQEgACACEEVB0OrAAEHQ6sAAKAIAQQFrIgA2AgAgAA0AEEgaDwsPCyACQXhxQZjnwABqIQECf0GQ58AAKAIAIgNBASACQQN2dCICcQRAIAEoAggMAQtBkOfAACACIANyNgIAIAELIQMgASAANgIIIAMgADYCDCAAIAE2AgwgACADNgIIC40HAQh/AkACQCAAKAIIIgpBAUcgACgCECIDQQFHcUUEQAJAIANBAUcNACABIAJqIQkgAEEUaigCAEEBaiEHIAEhBANAAkAgBCEDIAdBAWsiB0UNACADIAlGDQICfyADLAAAIgVBAE4EQCAFQf8BcSEFIANBAWoMAQsgAy0AAUE/cSEIIAVBH3EhBCAFQV9NBEAgBEEGdCAIciEFIANBAmoMAQsgAy0AAkE/cSAIQQZ0ciEIIAVBcEkEQCAIIARBDHRyIQUgA0EDagwBCyAEQRJ0QYCA8ABxIAMtAANBP3EgCEEGdHJyIgVBgIDEAEYNAyADQQRqCyIEIAYgA2tqIQYgBUGAgMQARw0BDAILCyADIAlGDQAgAywAACIEQQBOIARBYElyIARBcElyRQRAIARB/wFxQRJ0QYCA8ABxIAMtAANBP3EgAy0AAkE/cUEGdCADLQABQT9xQQx0cnJyQYCAxABGDQELAkACQCAGRQ0AIAIgBk0EQEEAIQMgAiAGRg0BDAILQQAhAyABIAZqLAAAQUBIDQELIAEhAwsgBiACIAMbIQIgAyABIAMbIQELIApFDQIgAEEMaigCACEGAkAgAkEQTwRAIAEgAhApIQQMAQsgAkUEQEEAIQQMAQsgAkEDcSEFAkAgAkEBa0EDSQRAQQAhBCABIQMMAQsgAkF8cSEHQQAhBCABIQMDQCAEIAMsAABBv39KaiADLAABQb9/SmogAywAAkG/f0pqIAMsAANBv39KaiEEIANBBGohAyAHQQRrIgcNAAsLIAVFDQADQCAEIAMsAABBv39KaiEEIANBAWohAyAFQQFrIgUNAAsLIAQgBkkEQCAGIARrIgQhBgJAAkACQEEAIAAtACAiAyADQQNGG0EDcSIDQQFrDgIAAQILQQAhBiAEIQMMAQsgBEEBdiEDIARBAWpBAXYhBgsgA0EBaiEDIABBHGooAgAhBCAAQRhqKAIAIQUgACgCBCEAAkADQCADQQFrIgNFDQEgBSAAIAQoAhARAABFDQALQQEPC0EBIQMgAEGAgMQARg0CIAUgASACIAQoAgwRAQANAkEAIQMDQCADIAZGBEBBAA8LIANBAWohAyAFIAAgBCgCEBEAAEUNAAsgA0EBayAGSQ8LDAILIAAoAhggASACIABBHGooAgAoAgwRAQAhAwsgAw8LIAAoAhggASACIABBHGooAgAoAgwRAQAL0wgBAX8jAEEwayICJAACfwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCAALQAAQQFrDhEBAgMEBQYHCAkKCwwNDg8QEQALIAIgAC0AAToACCACQSxqQQE2AgAgAkICNwIcIAJBpKHAADYCGCACQdsANgIUIAIgAkEQajYCKCACIAJBCGo2AhAgASACQRhqEGsMEQsgAiAAKQMINwMIIAJBLGpBATYCACACQgI3AhwgAkGIocAANgIYIAJB3AA2AhQgAiACQRBqNgIoIAIgAkEIajYCECABIAJBGGoQawwQCyACIAApAwg3AwggAkEsakEBNgIAIAJCAjcCHCACQYihwAA2AhggAkHdADYCFCACIAJBEGo2AiggAiACQQhqNgIQIAEgAkEYahBrDA8LIAIgACsDCDkDCCACQSxqQQE2AgAgAkICNwIcIAJB7KDAADYCGCACQd4ANgIUIAIgAkEQajYCKCACIAJBCGo2AhAgASACQRhqEGsMDgsgAiAAKAIENgIIIAJBLGpBATYCACACQgI3AhwgAkHMoMAANgIYIAJB3wA2AhQgAiACQRBqNgIoIAIgAkEIajYCECABIAJBGGoQawwNCyACIAApAgQ3AwggAkEsakEBNgIAIAJCATcCHCACQbigwAA2AhggAkHgADYCFCACIAJBEGo2AiggAiACQQhqNgIQIAEgAkEYahBrDAwLIAJBLGpBADYCACACQdiewAA2AiggAkIBNwIcIAJBqKDAADYCGCABIAJBGGoQawwLCyACQSxqQQA2AgAgAkHYnsAANgIoIAJCATcCHCACQZSgwAA2AhggASACQRhqEGsMCgsgAkEsakEANgIAIAJB2J7AADYCKCACQgE3AhwgAkGAoMAANgIYIAEgAkEYahBrDAkLIAJBLGpBADYCACACQdiewAA2AiggAkIBNwIcIAJB7J/AADYCGCABIAJBGGoQawwICyACQSxqQQA2AgAgAkHYnsAANgIoIAJCATcCHCACQdSfwAA2AhggASACQRhqEGsMBwsgAkEsakEANgIAIAJB2J7AADYCKCACQgE3AhwgAkHEn8AANgIYIAEgAkEYahBrDAYLIAJBLGpBADYCACACQdiewAA2AiggAkIBNwIcIAJBuJ/AADYCGCABIAJBGGoQawwFCyACQSxqQQA2AgAgAkHYnsAANgIoIAJCATcCHCACQayfwAA2AhggASACQRhqEGsMBAsgAkEsakEANgIAIAJB2J7AADYCKCACQgE3AhwgAkGYn8AANgIYIAEgAkEYahBrDAMLIAJBLGpBADYCACACQdiewAA2AiggAkIBNwIcIAJBgJ/AADYCGCABIAJBGGoQawwCCyACQSxqQQA2AgAgAkHYnsAANgIoIAJCATcCHCACQeiewAA2AhggASACQRhqEGsMAQsgASAAKAIEIABBCGooAgAQrQELIAJBMGokAAvYBgEIfwJAAkAgAEEDakF8cSICIABrIgQgAUsgBEEES3INACABIARrIgZBBEkNACAGQQNxIQdBACEBAkAgACACRg0AIARBA3EhAwJAIAIgAEF/c2pBA0kEQCAAIQIMAQsgBEF8cSEIIAAhAgNAIAEgAiwAAEG/f0pqIAIsAAFBv39KaiACLAACQb9/SmogAiwAA0G/f0pqIQEgAkEEaiECIAhBBGsiCA0ACwsgA0UNAANAIAEgAiwAAEG/f0pqIQEgAkEBaiECIANBAWsiAw0ACwsgACAEaiEAAkAgB0UNACAAIAZBfHFqIgIsAABBv39KIQUgB0EBRg0AIAUgAiwAAUG/f0pqIQUgB0ECRg0AIAUgAiwAAkG/f0pqIQULIAZBAnYhBCABIAVqIQMDQCAAIQEgBEUNAiAEQcABIARBwAFJGyIFQQNxIQYgBUECdCEIAkAg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AQECfyMAQSBrIgIkACACIAA2AgwgAiABKAIYQajfwABBESABQRxqKAIAKAIMEQEAOgAYIAIgATYCECACQQA6ABkgAkEANgIUIAJBEGogAkEMakGY38AAEEQhAAJ/IAItABgiASACKAIUIgNFDQAaIAFB/wFxIQFBASABDQAaIAAoAgAhAAJAIANBAUcNACACLQAZRQ0AIAAtAABBBHENAEEBIAAoAhhBgsvAAEEBIABBHGooAgAoAgwRAQANARoLIAAoAhhB7MfAAEEBIABBHGooAgAoAgwRAQALIAJBIGokAEH/AXFBAEcL4QEAAkAgASgCAEECRgRAIAAgAikCADcCACAAQQhqIAJBCGooAgA2AgAMAQsgACABKQIANwIAIABBCGogAUEIaigCADYCAAJAAkACQAJAIAIoAgAOAwABBAELIAItAARBA0cNAyACQQhqIgAoAgAiASgCACABKAIEKAIAEQQAIAEoAgQiAkEEaigCAA0BDAILIAItAARBA0cNAiACQQhqIgAoAgAiASgCACABKAIEKAIAEQQAIAEoAgQiAkEEaigCAEUNAQsgAkEIaigCABogASgCABAmIAAoAgAhAQsgARAmCwvOAQECfyMAQSBrIgMkAAJAAkAgASABIAJqIgFLDQAgAEEEaigCACICQQF0IgQgASABIARJGyIBQQggAUEISxsiAUF/c0EfdiEEAkAgAgRAIANBATYCGCADIAI2AhQgAyAAKAIANgIQDAELIANBADYCGAsgAyABIAQgA0EQahBXIAMoAgQhAiADKAIARQRAIAAgAjYCACAAQQRqIAE2AgAMAgsgA0EIaigCACIAQYGAgIB4Rg0BIABFDQAgAiAAENsBAAsQiAEACyADQSBqJAALzgEBAn8jAEEgayIDJAACQAJAIAEgASACaiIBSw0AIABBBGooAgAiAkEBdCIEIAEgASAESRsiAUEIIAFBCEsbIgFBf3NBH3YhBAJAIAIEQCADQQE2AhggAyACNgIUIAMgACgCADYCEAwBCyADQQA2AhgLIAMgASAEIANBEGoQWCADKAIEIQIgAygCAEUEQCAAIAI2AgAgAEEEaiABNgIADAILIANBCGooAgAiAEGBgICAeEYNASAARQ0AIAIgABDbAQALEIgBAAsgA0EgaiQAC8wBAQN/IwBBIGsiAiQAAkACQCABQQFqIgFFDQAgAEEEaigCACIDQQF0IgQgASABIARJGyIBQQggAUEISxsiAUF/c0EfdiEEAkAgAwRAIAJBATYCGCACIAM2AhQgAiAAKAIANgIQDAELIAJBADYCGAsgAiABIAQgAkEQahBXIAIoAgQhAyACKAIARQRAIAAgAzYCACAAQQRqIAE2AgAMAgsgAkEIaigCACIAQYGAgIB4Rg0BIABFDQAgAyAAENsBAAsQiAEACyACQSBqJAAL0gEBAX8jAEEQayIEJAAgBCAAKAIYIAEgAiAAQRxqKAIAKAIMEQEAOgAIIAQgADYCACAEIAJFOgAJIARBADYCBCAEIANB6JzAABBEIQACfyAELQAIIgEgBCgCBCICRQ0AGkEBIAENABogACgCACEAAkAgAkEBRw0AIAQtAAlFDQAgAC0AAEEEcQ0AQQEgACgCGEGCy8AAQQEgAEEcaigCACgCDBEBAA0BGgsgACgCGEHsx8AAQQEgAEEcaigCACgCDBEBAAsgBEEQaiQAQf8BcUEARwuIAgECfyMAQSBrIgUkAEGE58AAQYTnwAAoAgAiBkEBajYCAAJAAkAgBkEASA0AQdzqwABB3OrAACgCAEEBaiIGNgIAIAZBAksNACAFIAQ6ABggBSADNgIUIAUgAjYCECAFQcinwAA2AgwgBUHYocAANgIIQfTmwAAoAgAiAkEASA0AQfTmwAAgAkEBaiICNgIAQfTmwABB/ObAACgCAAR/IAUgACABKAIQEQMAIAUgBSkDADcDCEH85sAAKAIAIAVBCGpBgOfAACgCACgCFBEDAEH05sAAKAIABSACC0EBazYCACAGQQFLDQAgBA0BCwALIwBBEGsiAiQAIAIgATYCDCACIAA2AggAC7oBAAJAIAIEQAJAAkACfwJAAkAgAUEATgRAIAMoAggNASABDQJBASECDAQLDAYLIAMoAgQiAkUEQCABRQRAQQEhAgwECyABQQEQuAEMAgsgAygCACACQQEgARCwAQwBCyABQQEQuAELIgJFDQELIAAgAjYCBCAAQQhqIAE2AgAgAEEANgIADwsgACABNgIEIABBCGpBATYCACAAQQE2AgAPCyAAIAE2AgQLIABBCGpBADYCACAAQQE2AgALrQEBAX8CQCACBEACfwJAAkACQCABQQBOBEAgAygCCEUNAiADKAIEIgQNASABDQMgAgwE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ajYCDCACIAEQzQEgAiAAQQJqNgIMIAIgARDNASACLQAEBH9BAQUgAigCACIAQRhqKAIAQYXLwABBASAAQRxqKAIAKAIMEQEACyACQRBqJAALbQEBfyMAQTBrIgMkACADIAI2AgQgAyABNgIAIANBHGpBAjYCACADQSxqQQs2AgAgA0ICNwIMIANBgIXAADYCCCADQQw2AiQgAyAANgIgIAMgA0EgajYCGCADIAM2AiggA0EIahBaIANBMGokAAtbAQJ/IwBBIGsiAiQAIAFBHGooAgAhAyABKAIYIAJBGGogACgCACIAQRBqKQIANwMAIAJBEGogAEEIaikCADcDACACIAApAgA3AwggAyACQQhqEDAgAkEgaiQAC2wBBH8jAEEgayICJABBASEDAkAgACABEEMNACABQRxqKAIAIQQgASgCGCACQQA2AhwgAkHIr8AANgIYIAJCATcCDCACQfDHwAA2AgggBCACQQhqEDANACAAQQRqIAEQQyEDCyACQSBqJAAgAwttAQF/IwBBMGsiAyQAIAMgATYCBCADIAA2AgAgA0EcakECNgIAIANBLGpBDjYCACADQgI3AgwgA0G4yMAANgIIIANBDjYCJCADIANBIGo2AhggAyADNgIoIAMgA0EEajYCICADQQhqIAIQiQEAC1YBAn8jAEEgayICJAAgAUEcaigCACEDIAEoAhggAkEYaiAAQRBqKQIANwMAIAJBEGogAEEIaikCADcDACACIAApAgA3AwggAyACQQhqEDAgAkEgaiQAC1YBAn8jAEEgayICJAAgAEEcaigCACEDIAAoAhggAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAyACQQhqEDAgAkEgaiQAC2YBAX8jAEEgayICJAAgAkH4ocAANgIEIAIgADYCACACQRhqIAFBEGopAgA3AwAgAkEQaiABQQhqKQIANwMAIAIgASkCADcDCCACQYyiwAAgAkEEakGMosAAIAJBCGpBpKnAABA8AAtjAQF/IwBBIGsiAyQAIANBqKrAADYCBCADIAA2AgAgA0EYaiABQRBqKQIANwMAIANBEGogAUEIaikCADcDACADIAEpAgA3AwggA0H8ocAAIANBBGpB/KHAACADQQhqIAIQPAALWQEBfyMAQSBrIgIkACACIAAoAgA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakHAj8AAIAJBCGoQMCACQSBqJAALWQEBfyMAQSBrIgIkACACIAAoAgA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakHYkMAAIAJBCGoQMCACQSBqJAALWQEBfyMAQSBrIgIkACACIAAoAgA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakHglcAAIAJBCGoQMCACQSBqJAALWQEBfyMAQSBrIgIkACACIAAoAgA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakHAocAAIAJBCGoQMCACQSBqJAALaAAjAEEwayIBJABBsObAAC0AAARAIAFBHGpBATYCACABQgI3AgwgAUHApcAANgIIIAFBDjYCJCABIAA2AiwgASABQSBqNgIYIAEgAUEsajYCICABQQhqQeilwAAQiQEACyABQTBqJAALWQEBfyMAQSBrIgIkACACIAAoAgA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakH8rcAAIAJBCGoQMCACQSBqJAALaAECfyABKAIAIQMCQAJAAkAgAUEIaigCACIBRQRAQQEhAgwBCyABQQBIDQEgAUEBELgBIgJFDQILIAIgAyABEOABIQIgACABNgIIIAAgATYCBCAAIAI2AgAPCxCIAQALIAFBARDbAQALWQEBfyMAQSBrIgIkACACIAAoAgA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakGAzcAAIAJBCGoQMCACQSBqJAALVgEBfyMAQSBrIgIkACACIAA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakHAj8AAIAJBCGoQMCACQSBqJAALVgEBfyMAQSBrIgIkACACIAA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakHYkMAAIAJBCGoQMCACQSBq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ICJBAWsQ3gEaQTALIQAgM0EQdEGAgARqQRB1IjMgOkwgIiAxT3INAyAiIDlqIAA6AAAgIkEBaiEiDAMLIBxBKEG03sAAEGkACyAAIDFBiLfAABBpAAsgIiAxQZi3wAAQygEACyAiIDFNDQAgIiAxQai3wAAQygEACyA7IDM7AQggOyAiNgIEIDsgOTYCACAhQdAGaiQADAULIABBKEG03sAAEMoBAAsgHkEoQbTewAAQygEACyAgQShBtN7AABDKAQALQcTewABBGkG03sAAEIMBAAsgI0HICGogI0GYCGooAgA2AgAgIyAjKQOQCDcDwAgLIDogIy4ByAgiAEgEQCAjQQhqICMoAsAIICMoAsQIIAAgNiAjQZAIahA6ICMoAgwhACAjKAIIDAQLQQIhACAjQQI7AZAIIDYEQCAjQaAIaiA2NgIAICNBADsBnAggI0ECNgKYCCAjQajHwAA2ApQIICNBkAhqDAQLQQEhACAjQQE2ApgIICNBrcfAADYClAggI0GQCGoMAwtBAiEAICNBAjsBkAggNgRAICNBoAhqIDY2AgAgI0EAOwGcCCAjQQI2ApgIICNBqMfAADYClAggI0GQCGoMAwtBASEAICNBATYCmAggI0Gtx8AANgKUCCAjQZAIagwCCyAjQQM2ApgIICNBrsfAADYClAggI0ECOwGQCCAjQZAIagwBCyAjQQM2ApgIICNBscfAADYClAggI0ECOwGQCEEBIQBByK/AACE9ICNBkAhqCyEBICNBzAhqIAA2AgAgIyABNgLICCAjIEE2AsQIICMgPTYCwAggPCAjQcAIahAxICNB8AhqJAAMAQtBtMfAAEElQdzHwAAQgwEACw8LIAEgGiEBIwBBgAFrIickACBFvSEEAkAgRSBFYgRAQQIhAAwBCyAEQv////////8HgyIFQoCAgICAgIAIhCAEQgGGQv7///////8PgyAEQjSIp0H/D3EiKBsiA0IBgyEHQQMhAAJAAkACQEEBQQJBBCAEQoCAgICAgID4/wCDIgJQIhobIAJCgICAgICAgPj/AFEbQQNBBCAaGyAFUBtBAmsOAwABAgMLQQQhAAwCCyAoQbMIayEsIAdQIQBCASEGDAELQoCAgICAgIAgIANCAYYgA0KAgICAgICACFEiGhshA0ICQgEgGhshBiAHUCEAQct3Qcx3IBobIChqISwLICcgLDsBeCAnIAY3A3AgJ0IBNwNoICcgAzcDYCAnIAA6AHoCfyAAQQJrQf8BcSIAQQMgAEEDSRsiGgRAQavHwABBrMfAAEHIr8AAIAEbIARCAFMbISxBASEAQQEgBEI/iKcgARshPQJAAkACQCAaQQJrDgIBAAILICdBIGohJCAnQQ9qIR8jAEEwayIpJAACQAJAAkACQAJAAkACQCAnQeAAaiIAKQMAIgVQRQRAIAApAwgiA1BFBEAgACkDECICUEUEQCAFIAIgBXwiAlgEQCAFIAUgA30iBloEQAJAAkAgAkL//////////x9YBEAgKSAALwEYIho7AQggKSAGNwMAIBogGkEgayAaIAJCgICAgBBUIgEbIgBBEGsgACACQiCGIAIgARsiAkKAgICAgIDAAFQiARsiAEEIayAAIAJCEIYgAiABGyICQoCAgICAgICAAVQiARsiAEEEayAAIAJCCIYgAiABGyICQoCAgICAgICAEFQiARsiAEECayAAIAJCBIYgAiABGyICQoCAgICAgICAwABUIgAbIAJCAoYgAiAAGyIEQj+Hp0F/c2oiAWtBEHRBEHUiAEEASA0CIClCfyAArSICiCIDIAaDNwMQIAMgBlQNDSApIBo7AQggKSAFNwMAICkgAyAFgzcDECADIAVUDQ1BoH8gAWtBEHRBEHVB0ABsQbCnBWpBzhBtIgBB0QBPDQEgAEEEdCIAQbi3wABqKQMAIgNC/////w+DIg0gBSACQj+DIgeGIgJCIIgiFX4iBUIgiCIJIANCIIgiDyAVfnwgDyACQv////8PgyIDfiICQiCIIhB8IAVC/////w+DIAMgDX5CIIh8IAJC/////w+DfEKAgICACHxCIIghFkIBQQAgASAAQcC3wABqLwEAamtBP3GtIgiGIgxCAX0hDiANIAYgB4YiAkIgiCIFfiIDQv////8PgyANIAJC/////w+DIgJ+QiCIfCACIA9+IgJC/////w+DfEKAgICACHxCIIghESAFIA9+IQsgAkIgiCEGIANCIIghByAAQcK3wABqLwEAIRoCfwJAAkAgDyAEIARCf4VCP4iGIgJCIIgiF34iBCANIBd+IgVCIIgiGHwgDyACQv////8PgyIDfiICQiCIIhl8IAVC/////w+DIAMgDX5CIIh8IAJC/////w+DfEKAgICACHxC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AiQgJ0ECOwEgQQEhAEHIr8AAISwgJ0EgagshASAnQdwAaiAANgIAICcgATYCWCAnID02AlQgJyAsNgJQICdB0ABqEDEgJ0GAAWokAA8LIBtBKEG03sAAEMoBAAsgG0EoQbTewAAQaQALIBxBKEG03sAAEMoBAAs5AAJAAn8gAkGAgMQARwRAQQEgACACIAEoAhARAAANARoLIAMNAUEACw8LIAAgAyAEIAEoAgwRAQALQAEBfyMAQSBrIgAkACAAQRxqQQA2AgAgAEHYocAANgIYIABCATcCDCAAQcCkwAA2AgggAEEIakHIpMAAEIkBAAtAAQF/IwBBIGsiACQAIABBHGpBADYCACAAQZSuwAA2AhggAEIBNwIMIABBxK7AADYCCCAAQQhqQcyuwAAQiQEAC98CAQJ/IwBBIGsiAiQAIAJBAToAGCACIAE2AhQgAiAANgIQIAJBhMnAADYCDCACQcivwAA2AggjAEEQayIBJAACQCACQQhqIgAoAgwiAgRAIAAoAggiA0UNASABIAI2AgggASAANgIEIAEgAzYCACMAQRBrIgAkACAAQQhqIAFBCGooAgA2AgAgACABKQIANwMAIwBBEGsiASQAIAAoAgAiAkEUaigCACEDAkACfwJAAkAgAigCBA4CAAEDCyADDQJBACECQdihwAAMAQsgAw0BIAIoAgAiAygCBCECIAMoAgALIQMgASACNgIEIAEgAzYCACABQbSnwAAgACgCBCIBKAIIIAAoAgggAS0AEBBWAAsgAUEANgIEIAEgAjYCACABQaCnwAAgACgCBCIBKAIIIAAoAgggAS0AEBBWAAtBnKLAAEErQfCmwAAQgwEAC0GcosAAQStB4KbAABCDAQALMwACQCAAQfz///8HSw0AIABFBEBBBA8LIAAgAEH9////B0lBAnQQuAEiAEUNACAADwsACz0BAX8gACgCACEBAkAgAEEEai0AAA0AQYTnwAAoAgBB/////wdxRQ0AEOoBDQAgAUEBOgABCyABQQA6AAALjB0CFH8EfiMAQRBrIhMkACATIAE2AgwgEyAANgIIAn8jAEEgayIJJAAgE0EIaiIAQQRqKAIAIQ0gACgCACELAkBBAEHYksAAKAIAEQIAIhEEQCARKAIADQEgEUF/NgIAIBFBBGoiCEEEaigCACICQQxrIQMgDQR+IA1BB3EhAQJAIA1BAWtBB0kEQEKlxoihyJyn+UshFiALIQAMAQsgDUF4cSEEQqXGiKHInKf5SyEWIAshAANAIAAxAAcgADEABiAAMQAFIAAxAAQgADEAAyAAMQACIAAxAAEgFiAAMQAAhUKzg4CAgCB+hUKzg4CAgCB+hUKzg4CAgCB+hUKzg4CAgCB+hUKzg4CAgCB+hUKzg4CAgCB+hUKzg4CAgCB+hUKzg4CAgCB+IRYgAEEIaiEAIARBCGsiBA0ACwsgAQRAA0AgFiAAMQAAhUKzg4CAgCB+IRYgAEEBaiEAIAFBAWsiAQ0ACwsgFkL/AYVCs4OAgIAgfgVC7taLsMjJnLKvfwsiGEIZiEL/AINCgYKEiJCgwIABfiEZIBinIQAgCCgCACEBAkADQAJAIAIgACABcSIAaikAACIXIBmFIhZCf4UgFkKBgoSIkKDAgAF9g0KAgYKEiJCgwIB/gyIWUA0AA0ACQCANIANBACAWeqdBA3YgAGogAXFrIgRBDGxqIgdBBGooAgBGBEAgBygCACALIA0Q3wFFDQELIBZCAX0gFoMiFlBFDQEMAgsLIAkgCzYCBCAJQRBqIAg2AgAgCUEIaiANNgIAIAlBDGogAiAEQQxsajYCACAJQQA2AgAMAgsgFyAXQgGGg0KAgYKEiJCgwIB/g1AEQCAAIAVBCGoiBWohAAwBCwsgCCgCCEUEQEEAIQAjAEEwayIPJAACQCAIQQxqKAIAIhBBAWoiASAQSQRAEH4gDygCDBoMAQsCQAJAAn8CQCAIKAIAIgwgDEEBaiIHQQN2QQdsIAxBCEkbIhVBAXYgAUkEQCABIBVBAWoiACAAIAFJGyIAQQhJDQFBfyAAQQN0QQduQQFrZ3ZBAWogACAAQf////8BcUYNAhoQfiAPKAIsQYGAgIB4Rw0FIA8oAigMAgsgCEEEaigCACEEQQAhAQNAAkACfyAAQQFxBEAgAUEHaiIAIAFJIAAgB09yDQIgAUEIagwBCyABIAdJIgJFDQEgAiABIgBqCyEBIAAgBGoiACAAKQMAIhZCf4VCB4hCgYKEiJCgwIABgyAWQv/+/fv379+//wCEfDcDAEEBIQAMAQsLAkACQCAHQQhPBEAgBCAHaiAEKQAANwAADAELAkACQAJ/AkAgByIDIARBCGoiAiAEIgBrSwRAIAAgA2ohBSACIANqIQEgA0EPSw0BIAIMAgsgA0EPTQRAIAIhAQwDCyACQQAgAmtBA3EiBWohBiAFBEAgAiEBIAAhAgNAIAEgAi0AADoAACACQQFqIQIgAUEBaiIBIAZJDQALCyAGIAMgBWsiA0F8cSIKaiEBAkAgACAFaiIFQQNxIgIEQCAKQQBMDQEgBUF8cSIOQQRqIQBBACACQQN0IhJrQRhxIRQgDigCACECA0AgBiACIBJ2IAAoAgAiAiAUdHI2AgAgAEEEaiEAIAZBBGoiBiABSQ0ACwwBCyAKQQBMDQAgBSEAA0AgBiAAKAIANgIAIABBBGohACAGQQRqIgYgAUkNAAsLIANBA3EhAyAFIApqIQAMAgsgAUF8cSECQQAgAUEDcSIKayEOIAoEQCAAIANqQQFrIQYDQCABQQFrIgEgBi0AADoAACAGQQFrIQYgASACSw0ACwsgAiADIAprIgpBfHEiA2shAUEAIANrIQMCQCAFIA5qIgVBA3EiBgRAIANBAE4NASAFQXxxIg5BBGshAEEAIAZBA3QiEmtBGHEhFCAOKAIAIQYDQCACQQRrIgIgBiAUdCAAKAIAIgYgEnZyNgIAIABBBGshACABIAJJDQALDAELIANBAE4NACAAIApqQQRrIQADQCACQQRrIgIgACgCADYCACAAQQRrIQAgASACSQ0ACwsgCkEDcSIARQ0CIAMgBWohBSABIABrCyECIAVBAWshAANAIAFBAWsiASAALQAAOgAAIABBAWshACABIAJLDQALDAELIANFDQAgASADaiECA0AgASAALQAAOgAAIABBAWohACABQQFqIgEgAkkNAAsLIAdFDQELIARBDGshDkEAIQEDQAJAIAQgASICaiIFLQAAQYABRw0AIA4gAkF0bGohBiAEIAJBf3NBDGxqIQcCQANAIAwgBkEEaigCACIABH4gBigCACEBIABBB3EhA0KlxoihyJyn+UshFgJAIABBAWtBB0kEQCABIQAMAQsgAEF4cSEKA0AgATEAByABMQAGIAExAAUgATEABCABMQADIAExAAIgATEAASAWIAExAACFQrODgICAIH6FQrODgICAIH6FQrODgICAIH6FQrODgICAIH6FQrODgICAIH6FQrODgICAIH6FQrODgICAIH6FQrODgICAIH4hFiABQQhqIgAhASAKQQhrIgoNAAsLIAMEQANAIBYgADEAAIVCs4OAgIAgfiEWIABBAWohACADQQFrIgMNAAsLIBZC/wGFQrODgICAIH4FQu7Wi7DIyZyyr38LpyIKcSIDIQAgAyAEaikAAEKAgYKEiJCgwIB/gyIWUARAQQghASADIQADQCAAIAFqIQAgAUEIaiEBIAQgACAMcSIAaikAAEKAgYKEiJCgwIB/gyIWUA0ACwsgBCAWeqdBA3YgAGogDHEiAGosAABBAE4EQCAEKQMAQoCBgoSIkKDAgH+DeqdBA3YhAAsgACADayACIANrcyAMcUEITwRAIAQgAEF/c0EMbGohASAAIARqIgMtAAAgAyAKQRl2IgM6AAAgAEEIayAMcSAEakEIaiADOgAAQf8BRg0CIAcoAAAhACAHIAEoAAA2AAAgASAANgAAIAEoAAQhACABIAcoAAQ2AAQgByAANgAEIActAAohACAHIAEtAAo6AAogASAAOgAKIActAAshACAHIAEtAAs6AAsgASAAOgALIAcvAAghACAHIAEvAAg7AAggASAAOwAIDAELCyAFIApBGXYiADoAACACQQhrIAxxIARqQQhqIAA6AAAMAQsgBUH/AToAACACQQhrIAxxIARqQQhqQf8BOgAAIAFBCGogB0EIaigAADYAACABIAcpAAA3AAALIAJBAWohASACIAxHDQALCyAIIBUgEGs2AggMBAtBBEEIIABBBEkbCyIBrUIMfiIWQiCIpw0AIBanIgBBB2oiAiAASQ0AIAJBeHEiAiABQQhqIgRqIgAgAk8NAQsQfiAPKAIUGgwBCwJAAkAgAEEATgRAQQghAwJAIABFDQAgAEEIELgBIgMNACAAQQgQ2wEACyACIANqQf8BIAQQ3gEhBCABQQFrIgUgAUEDdkEHbCAFQQhJGyAQa60gEK1CIIaEIRcgB0UEQCAIIBc3AgggCCAFNgIAIAgoAgQhAiAIIAQ2AgQMAwsgCEEEaigCACICQQxrIRADQCACIAZqLAAAQQBOBEAgBCAFIBAgBkF0bGoiAUEEaigCACIABH4gASgCACEBIABBB3EhCkKlxoihyJyn+UshFgJAIABBAWtBB0kEQCABIQAMAQsgAEF4cSEDA0AgATEAByABMQAGIAExAAUgATEABCABMQADIAExAAIgATEAASAWIAExAACFQrODgICAIH6FQrODgICAIH6FQrODgICAIH6FQrOD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BHFFBEAgASgCGEHwysAAQQYgAUEcaigCACgCDBEBAAwBCyACQQE6AA8gAiABKQIYNwMAIAIgAkEPajYCCEEBIAJB7MrAAEEDEDcNABogASgCGEHvysAAQQEgASgCHCgCDBEBAAsiAToABCACQRBqJAAgAEEQaiQAIAEL8wIBAn8gACgCACIALQAAIABBADoAAEEBcUUEQEG4jsAAQStBsI/AABCDAQALIwBBIGsiACQAAkACQAJAQYTnwAAoAgBB/////wdxBEAQ6gFFDQELQfTmwAAoAgBB9ObAAEF/NgIADQECQAJAQYTnwAAoAgBB/////wdxRQRAQYDnwAAoAgAhAUGA58AAQYyOwAA2AgBB/ObAACgCACECQfzmwABBATYCAAwBCxDqAUGA58AAKAIAIQFBgOfAAEGMjsAANgIAQfzmwAAoAgAhAkH85sAAQQE2AgBFDQELQYTnwAAoAgBB/////wdxRQ0AEOoBDQBB+ObAAEEBOgAAC0H05sAAQQA2AgACQCACRQ0AIAIgASgCABEEACABQQRqKAIARQ0AIAFBCGooAgAaIAIQJgsgAEEgaiQADAILIABBHGpBADYCACAAQdihwAA2AhggAEIBNwIMIABBrKbAADYCCCAAQQhqQdCmwAAQiQEACwALCzQAIABBAzoAICAAQoCAgICABDcCACAAIAE2AhggAEEANgIQIABBADYCCCAAQRxqIAI2AgALMAAgASgCGCACQQsgAUEcaigCACgCDBEBACECIABBADoABSAAIAI6AAQgACABNgIACycAIAAgACgCBEEBcSABckECcjYCBCAAIAFqIgAgACgCBEEBcjYCBAs6AQJ/QdDmwAAtAAAhAUHQ5sAAQQA6AABB1ObAACgCACECQdTmwABBADYCACAAIAI2AgQgACABNgIACyEAAkAgAC0AAEEDRw0AIABBCGooAgBFDQAgACgCBBAmCwsgAQF/AkAgACgCBCIBRQ0AIABBCGooAgBFDQAgARAmCwsjAAJAIAFB/P///wdNBEAgACABQQQgAhCwASIADQELAAsgAAsjACACIAIoAgRBfnE2AgQgACABQQFyNgIEIAAgAWogATYCAAseACAAKAIAIgCtQgAgAKx9IABBAE4iABsgACABEEILHgAgAEUEQBDUAQALIAAgAiADIAQgBSABKAIQEQ0ACyMAIABBADYCACAAIAEpAgA3AgQgAEEMaiABQQhqKAIANgIACx8BAn4gACkDACICIAJCP4ciA4UgA30gAkIAWSABEEILHAAgAEUEQBDUAQALIAAgAiADIAQgASgCEBETAAscACAARQRAENQBAAsgACACIAMgBCABKAIQERUACxwAIABFBEAQ1AEACyAAIAIgAyAEIAEoAhARCAALHAAgAEUEQBDUAQALIAAgAiADIAQgASgCEBEXAAscACAARQRAENQBAAsgACACIAMgBCABKAIQEQwACx4AIAAgAUEDcjYCBCAAIAFqIgAgACgCBEEBcjYCBAsUACAAQQRqKAIABEAgACgCABAmCwsaACAARQRAENQBAAsgACACIAMgASgCEBEFAAsiACAALQAARQRAIAFBmM7AAEEFECcPCyABQZTOwABBBBAnCxgAIABFBEAQ1AEACyAAIAIgASgCEBEAAAsZAQF/IAAoAhAiAQR/IAEFIABBFGooAgALCxgAIAAoAgAiACgCACAAQQhqKAIAIAEQKgsSAEEAQRkgAEEBdmsgAEEfRhsLFgAgACABQQFyNgIEIAAgAWogATYCAAscACABKAIYQfjHwABBDiABQRxqKAIAKAIMEQEACxkAIAAoAhggASACIABBHGooAgAoAgwRAQALHAAgASgCGEG538AAQQUgAUEcaigCACgCDBEBAAsQACAAIAFqQQFrQQAgAWtxC48GAQZ/An8gACEFAkACQAJAIAJBCU8EQCADIAIQOCIHDQFBAAwEC0EIQQgQrwEhAEEUQQgQrwEhAUEQQQgQrwEhAkEAQRBBCBCvAUECdGsiBEGAgHwgAiAAIAFqamtBd3FBA2siACAAIARLGyADTQ0BQRAgA0EEakEQQQgQrwFBBWsgA0sbQQgQrwEhAiAFEO4BIgAgABDXASIEEOsBIQECQAJAAkACQAJAAkACQCAAEMQBRQRAIAIgBE0NASABQazqwAAoAgBGDQIgAUGo6sAAKAIARg0DIAEQvQENByABENcBIgYgBGoiCCACSQ0HIAggAmshBCAGQYACSQ0EIAEQRgwFCyAAENcBIQEgAkGAAkkNBiABIAJrQYGACEkgAkEEaiABTXENBSABIAAoAgAiAWpBEGohBCACQR9qQYCABBCvASECDAYLQRBBCBCvASAEIAJrIgFLDQQgACACEOsBIQQgACACEJQBIAQgARCUASAEIAEQMgwEC0Gk6sAAKAIAIARqIgQgAk0NBCAAIAIQ6wEhASAAIAIQlAEgASAEIAJrIgJBAXI2AgRBpOrAACACNgIAQazqwAAgATYCAAwDC0Gg6sAAKAIAIARqIgQgAkkNAwJAQRBBCBCvASAEIAJrIgFLBEAgACAEEJQBQQAhAUEAIQQMAQsgACACEOsBIgQgARDrASEGIAAgAhCUASAEIAEQqwEgBiAGKAIEQX5xNgIEC0Go6sAAIAQ2AgBBoOrAACABNgIADAILIAFBDGooAgAiCSABQQhqKAIAIgFHBEAgASAJNgIMIAkgATYCCAwBC0GQ58AAQZDnwAAoAgBBfiAGQQN2d3E2AgALQRBBCBCvASAETQRAIAAgAhDrASEBIAAgAhCUASABIAQQlAEgASAEEDIMAQsgACAIEJQBCyAADQMLIAMQJCIBRQ0BIAEgBSAAENcBQXhBfCAAEMQBG2oiACADIAAgA0kbEOABIAUQJgwDCyAHIAUgASADIAEgA0kbEOABGiAFECYLIAcMAQsgABDEARogABDtAQsLFAAgACgCACAAQQhqKAIAIAEQ3AELCwAgAQRAIAAQJgsLDwAgAEEBdCIAQQAgAGtyCxUAIAEgACgCACIAKAIAIAAoAgQQJwsUACAAKAIAIAEgACgCBCgCDBEAAAuuCAEDfyMAQfAAayIFJAAgBSADNgIMIAUgAjYCCAJAAkACQAJAIAUCfwJAAkAgAUGBAk8EQANAIAAgBmogBkEBayEGQYACaiwAAEG/f0wNAAsgBkGBAmoiByABSQ0CIAFBgQJrIAZHDQQgBSAHNgIUDAELIAUgATYCFAsgBSAANgIQQcivwAAhBkEADAELIAAgBmpBgQJqLAAAQb9/TA0BIAUgBzYCFCAFIAA2AhBBjNDAACEGQQULNgIcIAUgBjYCGAJAIAEgAkkiBiABIANJckUEQAJ/AkACQCACIANNBEACQAJAIAJFDQAgASACTQRAIAEgAkYNAQwCCyAAIAJqLAAAQUBIDQELIAMhAgsgBSACNgIgIAIgASIGSQRAIAJBAWoiBkEAIAJBA2siAyACIANJGyIDSQ0GIAAgBmogACADamshBgNAIAZBAWshBiAAIAJqIAJBAWshAiwAAEFASA0ACyACQQFqIQYLAkAgBkUNACABIAZNBEAgASAGRg0BDAoLIAAgBmosAABBv39MDQkLIAEgBkYNBwJAIAAgBmoiAiwAACIDQQBIBEAgAi0AAUE/cSEAIANBH3EhASADQV9LDQEgAUEGdCAAciEADAQLIAUgA0H/AXE2AiRBAQwECyACLQACQT9xIABBBnRyIQAgA0FwTw0BIAAgAUEMdHIhAAwCCyAFQeQAakH6ADYCACAFQdwAakH6ADYCACAFQdQAakEONgIAIAVBxABqQQQ2AgAgBUIENwI0IAVB8NDAADYCMCAFQQ42AkwgBSAFQcgAajYCQCAFIAVBGGo2AmAgBSAFQRBqNgJYIAUgBUEMajYCUCAFIAVBCGo2AkgMCAsgAUESdEGAgPAAcSACLQADQT9xIABBBnRyciIAQYCAxABGDQULIAUgADYCJEEBIABBgAFJDQAaQQIgAEGAEEkNABpBA0EEIABBgIAESRsLIQAgBSAGNgIoIAUgACAGajYCLCAFQcQAakEFNgIAIAVB7ABqQfoANgIAIAVB5ABqQfoANgIAIAVB3ABqQf0ANgIAIAVB1ABqQf4ANgIAIAVCBTcCNCAFQcTRwAA2AjAgBUEONgJMIAUgBUHIAGo2AkAgBSAFQRhqNgJoIAUgBUEQajYCYCAFIAVBKGo2AlggBSAFQSRqNgJQIAUgBUEgajYCSAwFCyAFIAIgAyAGGzYCKCAFQcQAakEDNgIAIAVB3ABqQfoANgIAIAVB1ABqQfoANgIAIAVCAzcCNCAFQbTQwAA2AjAgBUEONgJMIAUgBUHIAGo2AkAgBSAFQRhqNgJYIAUgBUEQajYCUCAFIAVBKGo2AkgMBAsgAyAGQYjSwAAQywEACyAAIAFBACAHIAQQtgEAC0GtxMAAQSsgBBCDAQALIAAgASAGIAEgBBC2AQALIAVBMGogBBCJAQALEQAgACgCACAAKAIEIAEQ3AELCAAgACABEDgLFgBB1ObAACAANgIAQdDmwABBAToAAAsRACABIAAoAgAgACgCBBCtAQsQACAAKAIAIAAoAgQgARAqCxMAIABBkKfAADYCBCAAIAE2AgALDQAgAC0ABEECcUEBdgsQACABIAAoAgAgACgCBBAnCw0AIAAtAABBEHFBBHYLDQAgAC0AAEEgcUEFdgsMACAAKAIAEBVBAEcLDAAgACgCABAdQQBHCwoAQQAgAGsgAHELCwAgAC0ABEEDcUULDAAgACABQQNyNgIECw0AIAAoAgAgACgCBGoL1gIBAn8gACgCACEAIwBBEGsiAiQAAkACfwJAIAFBgAFPBEAgAkEANgIMIAFBgBBPDQEgAiABQT9xQYABcjoADSACIAFBBnZBwAFyOgAMQQIMAgsgACgCCCIDIAAoAgRGBEAgACADEFQgACgCCCEDCyAAIANBAWo2AgggACgCACADaiABOgAADAILIAFBgIAETwRAIAIgAUE/cUGAAXI6AA8gAiABQQZ2QT9xQYABcjoADiACIAFBDHZBP3FBgAFyOgANIAIgAUESdkEHcUHwAXI6AAxBBAwBCyACIAFBP3FBgAFyOgAOIAIgAUEMdkHgAXI6AAwgAiABQQZ2QT9xQYABcjoADUEDCyEBIAEgAEEEaigCACAAKAIIIgNrSwRAIAAgAyABEFIgACgCCCEDCyAAKAIAIANqIAJBDGogARDgARogACABIANqNgIICyACQRBqJABBAAsOACAAKAIAGgNADAALAAttAQF/IwBBMGsiAyQAIAMgATYCBCADIAA2AgAgA0EcakECNgIAIANBLGpBDjYCACADQgI3AgwgA0Goz8AANgIIIANBDjYCJCADIANBIGo2AhggAyADQQRqNgIoIAMgAzYCICADQQhqIAIQiQEAC20BAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRxqQQI2AgAgA0EsakEONgIAIANCAjcCDCADQcjPwAA2AgggA0EONgIkIAMgA0EgajYCGCADIANBBGo2AiggAyADNgIgIANBCGogAhCJAQALbQEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBHGpBAjYCACADQSxqQQ42AgAgA0ICNwIMIANB/M/AADYCCCADQQ42AiQgAyADQSBqNgIYIAMgA0EEajYCKCADIAM2AiAgA0EIaiACEIkBAAsNACAANQIAQQEgARBCC9gCAgR/An4jAEFAaiICJABBASEEAkAgAC0ABA0AIAAtAAUhBAJAAkACQCAAKAIAIgMoAgAiBUEEcUUEQCAEDQEMAwsgBA0BQQEhBCADKAIYQYPLwABBASADQRxqKAIAKAIMEQEADQMgAygCACEFDAELQQEhBCADKAIYQerKwABBAiADQRxqKAIAKAIMEQEARQ0BDAILQQEhBCACQQE6ABcgAkE0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AAAAAAEAAAAFAAAAAQAAAAAAAAABAAAABgAAAAEAAAAAAAAAAQAAAAcAAAABAAAAAAAAAAEAAAAIAAAAAQAAAAAAAAABAAAABAAAAAEAAAAAAAAAAQAAAAkAAAABAAAAAAAAAAEAAAAKAAAAcHJvdmVuYW5jZWNlbGxfaWR6b21lX25hbWVmbl9uYW1lY2FwX3NlY3JldHBheWxvYWRub25jZWV4cGlyZXNfYXRjYWxsZWQgYE9wdGlvbjo6dW53cmFwKClgIG9uIGEgYE5vbmVgIHZhbHVlL1VzZXJzL2pvc3QvLmNhcmdvL3JlZ2lzdHJ5L3NyYy9naXRodWIuY29tLTFlY2M2Mjk5ZGI5ZWM4MjMvc2VyZGUtd2FzbS1iaW5kZ2VuLTAuMy4xL3NyYy9kZS5ycwAAOAEQAF4AAABZAAAAHwAAAA8AAAAMAAAABAAAABAAAAARAAAAEgAAAGEgRGlzcGxheSBpbXBsZW1lbnRhdGlvbiByZXR1cm5lZCBhbiBlcnJvciB1bmV4cGVjdGVkbHkAEwAAAAAAAAABAAAAFAAAAC9ydXN0Yy82OWY5YzMzZDcxYzg3MWZjMTZhYzQ0NTIxMTI4MWM2ZTdhMzQwOTQzL2xpYnJhcnkvYWxsb2Mvc3JjL3N0cmluZy5ycwAIAhAASwAAAOgJAAAJAAAAaW52YWxpZCB2YWx1ZTogLCBleHBlY3RlZCAAAGQCEAAPAAAAcwIQAAsAAABtaXNzaW5nIGZpZWxkIGBgkAIQAA8AAACfAhAAAQAAAGludmFsaWQgbGVuZ3RoIACwAhAADwAAAHMCEAALAAAAZHVwbGljYXRlIGZpZWxkIGAAAADQAhAAEQAAAJ8CEAABAAAAFQAAAAwAAAAEAAAAFgAAABcAAAASAAAAYSBEaXNwbGF5IGltcGxlbWVudGF0aW9uIHJldHVybmVkIGFuIGVycm9yIHVuZXhwZWN0ZWRseQAYAAAAAAAAAAEAAAAUAAAAL3J1c3RjLzY5ZjljMzNkNzFjODcxZmMxNmFjNDQ1MjExMjgxYzZlN2EzNDA5NDMvbGlicmFyeS9hbGxvYy9zcmMvc3RyaW5nLnJzAFQDEABLAAAA6AkAAAkAAAAzIGJ5dGUgcHJlZml4AAAAGAAAAAAAAAABAAAAGQAAAC9Vc2Vycy9qb3N0Ly5jYXJnby9yZWdpc3RyeS9zcmMvZ2l0aHViLmNvbS0xZWNjNjI5OWRiOWVjODIzL2hvbG9faGFzaC0wLjEuMC1iZXRhLXJjLjAvc3JjL2hhc2hfdHlwZS9wcmltaXRpdmUucnPQAxAAcAAAAE0AAAARAAAASG9sb0hhc2ggc2VyaWFsaXplZCByZXByZXNlbnRhdGlvbiBtdXN0IGJlIGV4YWN0bHkgMzkgYnl0ZXNIb2xvSGFzaCBlcnJvcjogAIsEEAAQAAAAYSBIb2xvSGFzaCBvZiBwcmltaXRpdmUgaGFzaF90eXBlAAAAGwAAAAwAAAAEAAAAHAAAAB0AAAASAAAAYSBEaXNwbGF5IGltcGxlbWVudGF0aW9uIHJldHVybmVkIGFuIGVycm9yIHVuZXhwZWN0ZWRseQAeAAAAAAAAAAEAAAAUAAAAL3J1c3RjLzY5ZjljMzNkNzFjODcxZmMxNmFjNDQ1MjExMjgxYzZlN2EzNDA5NDMvbGlicmFyeS9hbGxvYy9zcmMvc3RyaW5nLnJzACgFEABLAAAA6AkAAAkAAABwcm92ZW5hbmNlY2VsbF9pZHpvbWVfbmFtZWZuX25hbWVjYXBfc2VjcmV0cGF5bG9hZG5vbmNlZXhwaXJlc19hdFpvbWVDYWxsVW5zaWduZWQAAACEBRAACgAAAI4FEAAHAAAAlQUQAAkAAACeBRAABwAAAKUFEAAKAAAArwUQAAcAAAC2BRAABQAAALsFEAAKAAAAIGJ5dGVzLCBnb3QgIGJ5dGVzAAAYBhAAAAAAABgGEAAMAAAAJAYQAAYAAAAgAAAAIAAAAAgAAAAEAAAAAgAAAC9Vc2Vycy9qb3N0Ly5jYXJnby9yZWdpc3RyeS9zcmMvZ2l0aHViLmNvbS0xZWNjNjI5OWRiOWVjODIzL2hvbG9faGFzaC0wLjEuMC1iZXRhLXJjLjAvc3JjL2hhc2gucnMAAABYBhAAYQAAAF8AAAAtAAAAIGJ5dGVzLCBnb3QgIGJ5dGVzAADMBhAAAAAAAMwGEAAMAAAA2AYQAAYAAABAAAAAIQAAAAgAAAAEAAAAAgAAACIAAAAAAAAAAQAAACMAAAAkAAAAJQAAACIAAAAEAAAABAAAACYAAAAnAAAAY2FsbGVkIGBPcHRpb246OnVud3JhcCgpYCBvbiBhIGBOb25lYCB2YWx1ZS9ydXN0Yy82OWY5YzMzZDcxYzg3MWZjMTZhYzQ0NTIxMTI4MWM2ZTdhMzQwOTQzL2xpYnJhcnkvc3RkL3NyYy9zeW5jL29uY2UucnMAYwcQAEwAAACPAAAAKQAAACIAAAAEAAAABAAAACgAAAApAAAAKgAAAC9Vc2Vycy9qb3N0Ly5jYXJnby9yZWdpc3RyeS9zcmMvZ2l0aHViLmNvbS0xZWNjNjI5OWRiOWVjODIzL2NvbnNvbGVfZXJyb3JfcGFuaWNfaG9vay0wLjEuNy9zcmMvbGliLnJzAAAA2AcQAGUAAACVAAAADgAAAFAIEAAAAAAALAAAAAQAAAAEAAAALQAAAC4AAAAvAAAAMQAAAAwAAAAEAAAAMgAAADMAAAA0AAAAYSBEaXNwbGF5IGltcGxlbWVudGF0aW9uIHJldHVybmVkIGFuIGVycm9yIHVuZXhwZWN0ZWRseQA1AAAAAAAAAAEAAAAUAAAAL3J1c3RjLzY5ZjljMzNkNzFjODcxZmMxNmFjNDQ1MjExMjgxYzZlN2EzNDA5NDMvbGlicmFyeS9hbGxvYy9zcmMvc3RyaW5nLnJzANAIEABLAAAA6AkAAAkAAABpbnZhbGlkIHR5cGU6ICwgZXhwZWN0ZWQgAAAALAkQAA4AAAA6CRAACwAAADYAAAAAAAAA//////////9jYW5ub3QgYWNjZXNzIGEgVGhyZWFkIExvY2FsIFN0b3JhZ2UgdmFsdWUgZHVyaW5nIG9yIGFmdGVyIGRlc3RydWN0aW9uAAA3AAAAAAAAAAEAAAA4AAAAL3J1c3RjLzY5ZjljMzNkNzFjODcxZmMxNmFjNDQ1MjExMjgxYzZlN2EzNDA5NDMvbGlicmFyeS9zdGQvc3JjL3RocmVhZC9sb2NhbC5ycwDACRAATwAAAKYBAAAJAAAAYWxyZWFkeSBib3Jyb3dlZDcAAAAAAAAAAQAAADkAAAAvVXNlcnMvam9zdC8uY2FyZ28vcmVnaXN0cnkvc3JjL2dpdGh1Yi5jb20tMWVjYzYyOTlkYjllYzgyMy9zZXJkZS13YXNtLWJpbmRnZW4tMC4zLjEvc3JjL2xpYi5ycwBAChAAXwAAABgAAAAOAAAAY2xvc3VyZSBpbnZva2VkIHJlY3Vyc2l2ZWx5IG9yIGRlc3Ryb3llZCBhbHJlYWR5RgAAAAQAAAAEAAAARwAAAEgAAABJAAAASgAAAAwAAAAEAAAASwAAAEwAAABNAAAAYSBEaXNwbGF5IGltcGxlbWVudGF0aW9uIHJldHVybmVkIGFuIGVycm9yIHVuZXhwZWN0ZWRseQBOAAAAAAAAAAEAAAAUAAAAL3J1c3RjLzY5ZjljMzNkNzFjODcxZmMxNmFjNDQ1MjExMjgxYzZlN2EzNDA5NDMvbGlicmFyeS9hbGxvYy9zcmMvc3RyaW5nLnJzAFgLEABLAAAA6AkAAAkAAAAKClN0YWNrOgoKSnNWYWx1ZSgpAL4LEAAIAAAAxgsQAAEAAABhIGJ5dGUgYXJyYXkgb2YgbGVuZ3RoIADYCxAAFwAAACAAAABzdHJ1Y3QgWm9tZUNhbGxVbnNpZ25lZHR1cGxlIHN0cnVjdCBDZWxsSWRhIGJ5dGUgYXJyYXkgb2YgbGVuZ3RoIAAAACYMEAAXAAAAQAAAAIQgJEFnZW50UHViS2V5hC0kRG5hSGFzaC9Vc2Vycy9qb3N0Ly5jYXJnby9yZWdpc3RyeS9zcmMvZ2l0aHViLmNvbS0xZWNjNjI5OWRiOWVjODIzL2hvbG9faGFzaC0wLjEuMC1iZXRhLXJjLjAvc3JjL2VuY29kZS5yc2NhbGxlZCBgUmVzdWx0Ojp1bndyYXAoKWAgb24gYW4gYEVycmAgdmFsdWUAAFAAAAAQAAAABAAAABoAAABkDBAAYwAAAIMAAAAFAAAAUQAAAAQAAAAEAAAAUgAAAEJhZEhhc2hTaXplQmFkQ2hlY2tzdW1CYWRQcmVmaXgAUwAAAAQAAAAEAAAAVAAAAFMAAAAEAAAABAAAAFUAAABCYWRTaXplQmFkQmFzZTY0Tm9VL1VzZXJzL2pvc3QvLmNhcmdvL3JlZ2lzdHJ5L3NyYy9naXRodWIuY29tLTFlY2M2Mjk5ZGI5ZWM4MjMvYmxha2UyYl9zaW1kLTAuNS4xMS9zcmMvcG9ydGFibGUucnMAAHcNEABfAAAAlgAAABUAAAAvVXNlcnMvam9zdC8uY2FyZ28vcmVnaXN0cnkvc3JjL2dpdGh1Yi5jb20tMWVjYzYyOTlkYjllYzgyMy9ibGFrZTJiX3NpbWQtMC41LjExL3NyYy9saWIucnMAAOgNEABaAAAATgIAAAoAAABUDhAAAAAAAERlc2VyaWFsaXplAFcAAAAEAAAABAAAAFgAAABTZXJpYWxpemVieXRlIGFycmF5ZGVwdGggbGltaXQgZXhjZWVkZWRzZXJpYWxpemUgZGF0YSBtb2RlbCBpcyBpbnZhbGlkOiCfDhAAIQAAAGF0dGVtcHQgdG8gc2VyaWFsaXplIHN0cnVjdCwgc2VxdWVuY2Ugb3IgbWFwIHdpdGggdW5rbm93biBsZW5ndGhpbnZhbGlkIHZhbHVlIHdyaXRlOiAAAAAIDxAAFQAAAGVycm9yIHdoaWxlIHdyaXRpbmcgbXVsdGktYnl0ZSBNZXNzYWdlUGFjayB2YWx1ZXN0cnVjdCB2YXJpYW50AABYDxAADgAAAHR1cGxlIHZhcmlhbnQAAABwDxAADQAAAG5ld3R5cGUgdmFyaWFudACIDxAADwAAAHVuaXQgdmFyaWFudKAPEAAMAAAAZW51bbQPEAAEAAAAbWFwAMAPEAADAAAAc2VxdWVuY2XMDxAACAAAAG5ld3R5cGUgc3RydWN0AADcDxAADgAAAE9wdGlvbiB2YWx1ZfQPEAAMAAAAdW5pdCB2YWx1ZQAACBAQAAoAAABieXRlIGFycmF5AAAcEBAACgAAAHN0cmluZyAAMBAQAAcAAABjaGFyYWN0ZXIgYGBAEBAACwAAAEsQEAABAAAAZmxvYXRpbmcgcG9pbnQgYFwQEAAQAAAASxAQAAEAAABpbnRlZ2VyIGAAAAB8EBAACQAAAEsQEAABAAAAYm9vbGVhbiBgAAAAmBAQAAkAAABLEBAAAQAAAGEgc3RyaW5naTY0AGIAAAAEAAAABAAAAGMAAABkAAAAZQAAAGFscmVhZHkgYm9ycm93ZWRiAAAAAAAAAAEAAAA5AAAAAAAAAGIAAAAEAAAABAAAAGYAAABiAAAABAAAAAQAAABnAAAAY2FsbGVkIGBPcHRpb246OnVud3JhcCgpYCBvbiBhIGBOb25lYCB2YWx1ZWNhbGxlZCBgUmVzdWx0Ojp1bndyYXAoKWAgb24gYW4gYEVycmAgdmFsdWVBY2Nlc3NFcnJvcnVzZSBvZiBzdGQ6OnRocmVhZDo6Y3VycmVudCgpIGlzIG5vdCBwb3NzaWJsZSBhZnRlciB0aGUgdGhyZWFkJ3MgbG9jYWwgZGF0YSBoYXMgYmVlbiBkZXN0cm95ZWRsaWJyYXJ5L3N0ZC9zcmMvdGhyZWFkL21vZC5yc9sREAAdAAAA3QIAAAUAAABmYWlsZWQgdG8gZ2VuZXJhdGUgdW5pcXVlIHRocmVhZCBJRDogYml0c3BhY2UgZXhoYXVzdGVkAAgSEAA3AAAA2xEQAB0AAABWBAAADQAAAFBvaXNvbkVycm9ybGlicmFyeS9zdGQvc3JjL3N5c19jb21tb24vdGhyZWFkX2luZm8ucnNjEhAAKQAAABYAAAAzAAAAbWVtb3J5IGFsbG9jYXRpb24gb2YgIGJ5dGVzIGZhaWxlZAoAnBIQABUAAACxEhAADgAAAGxpYnJhcnkvc3RkL3NyYy9hbGxvYy5yc9ASEAAYAAAAVQEAAAkAAABjYW5ub3QgbW9kaWZ5IHRoZSBwYW5pYyBob29rIGZyb20gYSBwYW5pY2tpbmcgdGhyZWFk+BIQADQAAABsaWJyYXJ5L3N0ZC9zcmMvcGFuaWNraW5nLnJzNBMQABwAAACGAAAACQAAADQTEAAcAAAAPgIAAA8AAAA0ExAAHAAAAD0CAAAPAAAAaAAAAAwAAAAEAAAAaQAAAGIAAAAIAAAABAAAAGoAAABrAAAAEAAAAAQAAABsAAAAbQAAAGIAAAAIAAAABAAAAG4AAABvAAAAYgAAAAAAAAABAAAAcAAAAGNvbmR2YXIgd2FpdCBub3Qgc3VwcG9ydGVkAADYExAAGgAAAGxpYnJhcnkvc3RkL3NyYy9zeXMvd2FzbS8uLi91bnN1cHBvcnRlZC9sb2Nrcy9jb25kdmFyLnJz/BMQADgAAAAWAAAACQAAAGNhbm5vdCByZWN1cnNpdmVseSBhY3F1aXJlIG11dGV4RBQQACAAAABsaWJyYXJ5L3N0ZC9zcmMvc3lzL3dhc20vLi4vdW5zdXBwb3J0ZWQvbG9ja3MvbXV0ZXgucnMAAGwUEAA2AAAAFgAAAAkAAABhc3NlcnRpb24gZmFpbGVkOiBzdGF0ZV9hbmRfcXVldWUuYWRkcigpICYgU1RBVEVfTUFTSyA9PSBSVU5OSU5HT25jZSBpbnN0YW5jZSBoYXMgcHJldmlvdXNseSBiZWVuIHBvaXNvbmVkAAD0FBAAKgAAAAIAAABsaWJyYXJ5L3N0ZC9zcmMvc3lzX2NvbW1vbi9vbmNlL2dlbmVyaWMucnMAACwVEAAqAAAA+AAAAAkAAAAsFRAAKgAAAAUBAAAeAAAA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");
var wasm = async () => {
  await init(wasm_code);
  return exports2;
};
var instance = void 0;
async function hashZomeCall(value) {
  if (!instance) {
    instance = await wasm();
  }
  return instance.hashZomeCall(value);
}

// lib/api/admin/types.js
var CellType;
(function(CellType2) {
  CellType2["Provisioned"] = "provisioned";
  CellType2["Cloned"] = "cloned";
  CellType2["Stem"] = "stem";
})(CellType || (CellType = {}));
var CellProvisioningStrategy;
(function(CellProvisioningStrategy2) {
  CellProvisioningStrategy2["Create"] = "create";
  CellProvisioningStrategy2["UseExisting"] = "use_existing";
  CellProvisioningStrategy2["CreateIfNoExists"] = "create_if_no_exists";
})(CellProvisioningStrategy || (CellProvisioningStrategy = {}));
var AppStatusFilter;
(function(AppStatusFilter2) {
  AppStatusFilter2["Enabled"] = "enabled";
  AppStatusFilter2["Disabled"] = "disabled";
  AppStatusFilter2["Running"] = "running";
  AppStatusFilter2["Stopped"] = "stopped";
  AppStatusFilter2["Paused"] = "paused";
})(AppStatusFilter || (AppStatusFilter = {}));

// node_modules/@tauri-apps/api/chunk-FEIY7W7S.js
var d = Object.defineProperty;
var e = (c, a) => {
  for (var b in a)
    d(c, b, { get: a[b], enumerable: true });
};

// node_modules/@tauri-apps/api/chunk-5UWJICAP.js
var w = {};
e(w, { convertFileSrc: () => u, invoke: () => d2, transformCallback: () => s });
function l() {
  return window.crypto.getRandomValues(new Uint32Array(1))[0];
}
function s(r, n = false) {
  let e2 = l(), t = `_${e2}`;
  return Object.defineProperty(window, t, { value: (o) => (n && Reflect.deleteProperty(window, t), r?.(o)), writable: false, configurable: true }), e2;
}
async function d2(r, n = {}) {
  return new Promise((e2, t) => {
    let o = s((i) => {
      e2(i), Reflect.deleteProperty(window, `_${a}`);
    }, true), a = s((i) => {
      t(i), Reflect.deleteProperty(window, `_${o}`);
    }, true);
    window.__TAURI_IPC__({ cmd: r, callback: o, error: a, ...n });
  });
}
function u(r, n = "asset") {
  let e2 = encodeURIComponent(r);
  return navigator.userAgent.includes("Windows") ? `https://${n}.localhost/${e2}` : `${n}://localhost/${e2}`;
}

// lib/environments/launcher.js
var import_msgpack = __toESM(require_dist(), 1);
var __HC_LAUNCHER_ENV__ = "__HC_LAUNCHER_ENV__";
var isLauncher = typeof window === "object" && __HC_LAUNCHER_ENV__ in window;
var getLauncherEnvironment = () => isLauncher ? window[__HC_LAUNCHER_ENV__] : void 0;
var signZomeCallTauri = async (request) => {
  const zomeCallUnsigned = {
    provenance: Array.from(request.provenance),
    cell_id: [Array.from(request.cell_id[0]), Array.from(request.cell_id[1])],
    zome_name: request.zome_name,
    fn_name: request.fn_name,
    payload: Array.from((0, import_msgpack.encode)(request.payload)),
    nonce: Array.from(await randomNonce()),
    expires_at: getNonceExpiration()
  };
  const signedZomeCallTauri = await d2("sign_zome_call", { zomeCallUnsigned });
  const signedZomeCall = {
    provenance: Uint8Array.from(signedZomeCallTauri.provenance),
    cap_secret: null,
    cell_id: [
      Uint8Array.from(signedZomeCallTauri.cell_id[0]),
      Uint8Array.from(signedZomeCallTauri.cell_id[1])
    ],
    zome_name: signedZomeCallTauri.zome_name,
    fn_name: signedZomeCallTauri.fn_name,
    payload: Uint8Array.from(signedZomeCallTauri.payload),
    signature: Uint8Array.from(signedZomeCallTauri.signature),
    expires_at: signedZomeCallTauri.expires_at,
    nonce: Uint8Array.from(signedZomeCallTauri.nonce)
  };
  return signedZomeCall;
};

// lib/hdk/capabilities.js
var GrantedFunctionsType;
(function(GrantedFunctionsType2) {
  GrantedFunctionsType2["All"] = "All";
  GrantedFunctionsType2["Listed"] = "Listed";
})(GrantedFunctionsType || (GrantedFunctionsType = {}));

// lib/api/client.js
var import_msgpack2 = __toESM(require_dist(), 1);

// node_modules/emittery/maps.js
var anyMap = /* @__PURE__ */ new WeakMap();
var eventsMap = /* @__PURE__ */ new WeakMap();
var producersMap = /* @__PURE__ */ new WeakMap();

// node_modules/emittery/index.js
var anyProducer = Symbol("anyProducer");
var resolvedPromise = Promise.resolve();
var listenerAdded = Symbol("listenerAdded");
var listenerRemoved = Symbol("listenerRemoved");
var canEmitMetaEvents = false;
var isGlobalDebugEnabled = false;
function assertEventName(eventName) {
  if (typeof eventName !== "string" && typeof eventName !== "symbol" && typeof eventName !== "number") {
    throw new TypeError("`eventName` must be a string, symbol, or number");
  }
}
function assertListener(listener) {
  if (typeof listener !== "function") {
    throw new TypeError("listener must be a function");
  }
}
function getListeners(instance2, eventName) {
  const events = eventsMap.get(instance2);
  if (!events.has(eventName)) {
    return;
  }
  return events.get(eventName);
}
function getEventProducers(instance2, eventName) {
  const key = typeof eventName === "string" || typeof eventName === "symbol" || typeof eventName === "number" ? eventName : anyProducer;
  const producers = producersMap.get(instance2);
  if (!producers.has(key)) {
    return;
  }
  return producers.get(key);
}
function enqueueProducers(instance2, eventName, eventData) {
  const producers = producersMap.get(instance2);
  if (producers.has(eventName)) {
    for (const producer of producers.get(eventName)) {
      producer.enqueue(eventData);
    }
  }
  if (producers.has(anyProducer)) {
    const item = Promise.all([eventName, eventData]);
    for (const producer of producers.get(anyProducer)) {
      producer.enqueue(item);
    }
  }
}
function iterator(instance2, eventNames) {
  eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
  let isFinished = false;
  let flush = () => {
  };
  let queue = [];
  const producer = {
    enqueue(item) {
      queue.push(item);
      flush();
    },
    finish() {
      isFinished = true;
      flush();
    }
  };
  for (const eventName of eventNames) {
    let set = getEventProducers(instance2, eventName);
    if (!set) {
      set = /* @__PURE__ */ new Set();
      const producers = producersMap.get(instance2);
      producers.set(eventName, set);
    }
    set.add(producer);
  }
  return {
    async next() {
      if (!queue) {
        return { done: true };
      }
      if (queue.length === 0) {
        if (isFinished) {
          queue = void 0;
          return this.next();
        }
        await new Promise((resolve) => {
          flush = resolve;
        });
        return this.next();
      }
      return {
        done: false,
        value: await queue.shift()
      };
    },
    async return(value) {
      queue = void 0;
      for (const eventName of eventNames) {
        const set = getEventProducers(instance2, eventName);
        if (set) {
          set.delete(producer);
          if (set.size === 0) {
            const producers = producersMap.get(instance2);
            producers.delete(eventName);
          }
        }
      }
      flush();
      return arguments.length > 0 ? { done: true, value: await value } : { done: true };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function defaultMethodNamesOrAssert(methodNames) {
  if (methodNames === void 0) {
    return allEmitteryMethods;
  }
  if (!Array.isArray(methodNames)) {
    throw new TypeError("`methodNames` must be an array of strings");
  }
  for (const methodName of methodNames) {
    if (!allEmitteryMethods.includes(methodName)) {
      if (typeof methodName !== "string") {
        throw new TypeError("`methodNames` element must be a string");
      }
      throw new Error(`${methodName} is not Emittery method`);
    }
  }
  return methodNames;
}
var isMetaEvent = (eventName) => eventName === listenerAdded || eventName === listenerRemoved;
function emitMetaEvent(emitter, eventName, eventData) {
  if (isMetaEvent(eventName)) {
    try {
      canEmitMetaEvents = true;
      emitter.emit(eventName, eventData);
    } finally {
      canEmitMetaEvents = false;
    }
  }
}
var Emittery = class _Emittery {
  static mixin(emitteryPropertyName, methodNames) {
    methodNames = defaultMethodNamesOrAssert(methodNames);
    return (target) => {
      if (typeof target !== "function") {
        throw new TypeError("`target` must be function");
      }
      for (const methodName of methodNames) {
        if (target.prototype[methodName] !== void 0) {
          throw new Error(`The property \`${methodName}\` already exists on \`target\``);
        }
      }
      function getEmitteryProperty() {
        Object.defineProperty(this, emitteryPropertyName, {
          enumerable: false,
          value: new _Emittery()
        });
        return this[emitteryPropertyName];
      }
      Object.defineProperty(target.prototype, emitteryPropertyName, {
        enumerable: false,
        get: getEmitteryProperty
      });
      const emitteryMethodCaller = (methodName) => function(...args) {
        return this[emitteryPropertyName][methodName](...args);
      };
      for (const methodName of methodNames) {
        Object.defineProperty(target.prototype, methodName, {
          enumerable: false,
          value: emitteryMethodCaller(methodName)
        });
      }
      return target;
    };
  }
  static get isDebugEnabled() {
    if (typeof globalThis.process?.env !== "object") {
      return isGlobalDebugEnabled;
    }
    const { env } = globalThis.process ?? { env: {} };
    return env.DEBUG === "emittery" || env.DEBUG === "*" || isGlobalDebugEnabled;
  }
  static set isDebugEnabled(newValue) {
    isGlobalDebugEnabled = newValue;
  }
  constructor(options = {}) {
    anyMap.set(this, /* @__PURE__ */ new Set());
    eventsMap.set(this, /* @__PURE__ */ new Map());
    producersMap.set(this, /* @__PURE__ */ new Map());
    producersMap.get(this).set(anyProducer, /* @__PURE__ */ new Set());
    this.debug = options.debug ?? {};
    if (this.debug.enabled === void 0) {
      this.debug.enabled = false;
    }
    if (!this.debug.logger) {
      this.debug.logger = (type, debugName, eventName, eventData) => {
        try {
          eventData = JSON.stringify(eventData);
        } catch {
          eventData = `Object with the following keys failed to stringify: ${Object.keys(eventData).join(",")}`;
        }
        if (typeof eventName === "symbol" || typeof eventName === "number") {
          eventName = eventName.toString();
        }
        const currentTime = /* @__PURE__ */ new Date();
        const logTime = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}.${currentTime.getMilliseconds()}`;
        console.log(`[${logTime}][emittery:${type}][${debugName}] Event Name: ${eventName}
	data: ${eventData}`);
      };
    }
  }
  logIfDebugEnabled(type, eventName, eventData) {
    if (_Emittery.isDebugEnabled || this.debug.enabled) {
      this.debug.logger(type, this.debug.name, eventName, eventData);
    }
  }
  on(eventNames, listener) {
    assertListener(listener);
    eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
    for (const eventName of eventNames) {
      assertEventName(eventName);
      let set = getListeners(this, eventName);
      if (!set) {
        set = /* @__PURE__ */ new Set();
        const events = eventsMap.get(this);
        events.set(eventName, set);
      }
      set.add(listener);
      this.logIfDebugEnabled("subscribe", eventName, void 0);
      if (!isMetaEvent(eventName)) {
        emitMetaEvent(this, listenerAdded, { eventName, listener });
      }
    }
    return this.off.bind(this, eventNames, listener);
  }
  off(eventNames, listener) {
    assertListener(listener);
    eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
    for (const eventName of eventNames) {
      assertEventName(eventName);
      const set = getListeners(this, eventName);
      if (set) {
        set.delete(listener);
        if (set.size === 0) {
          const events = eventsMap.get(this);
          events.delete(eventName);
        }
      }
      this.logIfDebugEnabled("unsubscribe", eventName, void 0);
      if (!isMetaEvent(eventName)) {
        emitMetaEvent(this, listenerRemoved, { eventName, listener });
      }
    }
  }
  once(eventNames) {
    let off_;
    const promise = new Promise((resolve) => {
      off_ = this.on(eventNames, (data) => {
        off_();
        resolve(data);
      });
    });
    promise.off = off_;
    return promise;
  }
  events(eventNames) {
    eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
    for (const eventName of eventNames) {
      assertEventName(eventName);
    }
    return iterator(this, eventNames);
  }
  async emit(eventName, eventData) {
    assertEventName(eventName);
    if (isMetaEvent(eventName) && !canEmitMetaEvents) {
      throw new TypeError("`eventName` cannot be meta event `listenerAdded` or `listenerRemoved`");
    }
    this.logIfDebugEnabled("emit", eventName, eventData);
    enqueueProducers(this, eventName, eventData);
    const listeners = getListeners(this, eventName) ?? /* @__PURE__ */ new Set();
    const anyListeners = anyMap.get(this);
    const staticListeners = [...listeners];
    const staticAnyListeners = isMetaEvent(eventName) ? [] : [...anyListeners];
    await resolvedPromise;
    await Promise.all([
      ...staticListeners.map(async (listener) => {
        if (listeners.has(listener)) {
          return listener(eventData);
        }
      }),
      ...staticAnyListeners.map(async (listener) => {
        if (anyListeners.has(listener)) {
          return listener(eventName, eventData);
        }
      })
    ]);
  }
  async emitSerial(eventName, eventData) {
    assertEventName(eventName);
    if (isMetaEvent(eventName) && !canEmitMetaEvents) {
      throw new TypeError("`eventName` cannot be meta event `listenerAdded` or `listenerRemoved`");
    }
    this.logIfDebugEnabled("emitSerial", eventName, eventData);
    const listeners = getListeners(this, eventName) ?? /* @__PURE__ */ new Set();
    const anyListeners = anyMap.get(this);
    const staticListeners = [...listeners];
    const staticAnyListeners = [...anyListeners];
    await resolvedPromise;
    for (const listener of staticListeners) {
      if (listeners.has(listener)) {
        await listener(eventData);
      }
    }
    for (const listener of staticAnyListeners) {
      if (anyListeners.has(listener)) {
        await listener(eventName, eventData);
      }
    }
  }
  onAny(listener) {
    assertListener(listener);
    this.logIfDebugEnabled("subscribeAny", void 0, void 0);
    anyMap.get(this).add(listener);
    emitMetaEvent(this, listenerAdded, { listener });
    return this.offAny.bind(this, listener);
  }
  anyEvent() {
    return iterator(this);
  }
  offAny(listener) {
    assertListener(listener);
    this.logIfDebugEnabled("unsubscribeAny", void 0, void 0);
    emitMetaEvent(this, listenerRemoved, { listener });
    anyMap.get(this).delete(listener);
  }
  clearListeners(eventNames) {
    eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
    for (const eventName of eventNames) {
      this.logIfDebugEnabled("clear", eventName, void 0);
      if (typeof eventName === "string" || typeof eventName === "symbol" || typeof eventName === "number") {
        const set = getListeners(this, eventName);
        if (set) {
          set.clear();
        }
        const producers = getEventProducers(this, eventName);
        if (producers) {
          for (const producer of producers) {
            producer.finish();
          }
          producers.clear();
        }
      } else {
        anyMap.get(this).clear();
        for (const [eventName2, listeners] of eventsMap.get(this).entries()) {
          listeners.clear();
          eventsMap.get(this).delete(eventName2);
        }
        for (const [eventName2, producers] of producersMap.get(this).entries()) {
          for (const producer of producers) {
            producer.finish();
          }
          producers.clear();
          producersMap.get(this).delete(eventName2);
        }
      }
    }
  }
  listenerCount(eventNames) {
    eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
    let count = 0;
    for (const eventName of eventNames) {
      if (typeof eventName === "string") {
        count += anyMap.get(this).size + (getListeners(this, eventName)?.size ?? 0) + (getEventProducers(this, eventName)?.size ?? 0) + (getEventProducers(this)?.size ?? 0);
        continue;
      }
      if (typeof eventName !== "undefined") {
        assertEventName(eventName);
      }
      count += anyMap.get(this).size;
      for (const value of eventsMap.get(this).values()) {
        count += value.size;
      }
      for (const value of producersMap.get(this).values()) {
        count += value.size;
      }
    }
    return count;
  }
  bindMethods(target, methodNames) {
    if (typeof target !== "object" || target === null) {
      throw new TypeError("`target` must be an object");
    }
    methodNames = defaultMethodNamesOrAssert(methodNames);
    for (const methodName of methodNames) {
      if (target[methodName] !== void 0) {
        throw new Error(`The property \`${methodName}\` already exists on \`target\``);
      }
      Object.defineProperty(target, methodName, {
        enumerable: false,
        value: this[methodName].bind(this)
      });
    }
  }
};
var allEmitteryMethods = Object.getOwnPropertyNames(Emittery.prototype).filter((v) => v !== "constructor");
Object.defineProperty(Emittery, "listenerAdded", {
  value: listenerAdded,
  writable: false,
  enumerable: true,
  configurable: false
});
Object.defineProperty(Emittery, "listenerRemoved", {
  value: listenerRemoved,
  writable: false,
  enumerable: true,
  configurable: false
});

// lib/api/client.js
var import_isomorphic_ws = __toESM(require_node(), 1);

// lib/api/app/types.js
var SignalType = {
  App: "App",
  System: "System"
};

// lib/api/client.js
var WsClient = class _WsClient extends Emittery {
  socket;
  pendingRequests;
  index;
  constructor(socket) {
    super();
    this.socket = socket;
    this.pendingRequests = {};
    this.index = 0;
    socket.on("message", async (serializedMessage) => {
      let deserializedData;
      if (typeof window === "object" && serializedMessage.data instanceof window.Blob) {
        deserializedData = await serializedMessage.data.arrayBuffer();
      } else {
        if (typeof Buffer !== "undefined" && Buffer.isBuffer(serializedMessage.data)) {
          deserializedData = serializedMessage.data;
        } else {
          throw new Error("websocket client: unknown message format");
        }
      }
      const message = (0, import_msgpack2.decode)(deserializedData);
      assertHolochainMessage(message);
      if (message.type === "signal") {
        if (message.data === null) {
          throw new Error("received a signal without data");
        }
        const deserializedSignal = (0, import_msgpack2.decode)(message.data);
        assertHolochainSignal(deserializedSignal);
        if (SignalType.System in deserializedSignal) {
          return;
        }
        const encodedAppSignal = deserializedSignal[SignalType.App];
        const payload = (0, import_msgpack2.decode)(encodedAppSignal.signal);
        const signal = {
          cell_id: encodedAppSignal.cell_id,
          zome_name: encodedAppSignal.zome_name,
          payload
        };
        this.emit("signal", signal);
      } else if (message.type === "response") {
        this.handleResponse(message);
      } else {
        console.error(`Got unrecognized Websocket message type: ${message.type}`);
      }
    });
    socket.on("close", (event) => {
      const pendingRequestIds = Object.keys(this.pendingRequests).map((id) => parseInt(id));
      if (pendingRequestIds.length) {
        pendingRequestIds.forEach((id) => {
          const error = new Error(`Websocket closed with pending requests. Close event code: ${event.code}, request id: ${id}`);
          this.pendingRequests[id].reject(error);
          delete this.pendingRequests[id];
        });
      }
    });
  }
  /**
   * Instance factory for creating WsClients.
   *
   * @param url - The `ws://` URL to connect to.
   * @returns An new instance of the WsClient.
   */
  static connect(url) {
    return new Promise((resolve, reject) => {
      const socket = new import_isomorphic_ws.StandardWebSocketClient(url);
      socket.on("error", () => {
        reject(new Error(`could not connect to holochain conductor, please check that a conductor service is running and available at ${url}`));
      });
      socket.on("open", () => {
        const client = new _WsClient(socket);
        resolve(client);
      });
    });
  }
  /**
   * Sends data as a signal.
   *
   * @param data - Data to send.
   */
  emitSignal(data) {
    const encodedMsg = (0, import_msgpack2.encode)({
      type: "signal",
      data: (0, import_msgpack2.encode)(data)
    });
    this.socket.send(encodedMsg);
  }
  /**
   * Send requests to the connected websocket.
   *
   * @param request - The request to send over the websocket.
   * @returns
   */
  request(request) {
    if (this.socket.readyState === this.socket.OPEN) {
      const id = this.index;
      const encodedMsg = (0, import_msgpack2.encode)({
        id,
        type: "request",
        data: (0, import_msgpack2.encode)(request)
      });
      const promise = new Promise((resolve, reject) => {
        this.pendingRequests[id] = { resolve, reject };
      });
      this.socket.send(encodedMsg);
      this.index += 1;
      return promise;
    } else {
      return Promise.reject(new Error("Socket is not open"));
    }
  }
  handleResponse(msg) {
    const id = msg.id;
    if (this.pendingRequests[id]) {
      if (msg.data === null || msg.data === void 0) {
        this.pendingRequests[id].reject(new Error("Response canceled by responder"));
      } else {
        this.pendingRequests[id].resolve((0, import_msgpack2.decode)(msg.data));
      }
      delete this.pendingRequests[id];
    } else {
      console.error(`Got response with no matching request. id=${id}`);
    }
  }
  /**
   * Close the websocket connection.
   */
  close(code) {
    const closedPromise = new Promise((resolve) => this.socket.on("close", resolve));
    this.socket.close(code);
    return closedPromise;
  }
};
function assertHolochainMessage(message) {
  if (typeof message === "object" && message !== null && "type" in message && "data" in message) {
    return;
  }
  throw new Error(`unknown message format ${JSON.stringify(message, null, 4)}`);
}
function assertHolochainSignal(signal) {
  if (typeof signal === "object" && signal !== null && Object.values(SignalType).some((type) => type in signal)) {
    return;
  }
  throw new Error(`unknown signal format ${JSON.stringify(signal, null, 4)}`);
}

// lib/api/common.js
var ERROR_TYPE = "error";
var DEFAULT_TIMEOUT = 15e3;
var requesterTransformer = (requester, tag, transform = identityTransformer) => async (req, timeout) => {
  const transformedInput = await transform.input(req);
  const input = { type: tag, data: transformedInput };
  const response = await requester(input, timeout);
  const output = transform.output(response.data);
  return output;
};
var identity = (x) => x;
var identityTransformer = {
  input: identity,
  output: identity
};
var catchError = (res) => {
  return res.type === ERROR_TYPE ? Promise.reject(res) : Promise.resolve(res);
};
var promiseTimeout = (promise, tag, ms) => {
  let id;
  const timeout = new Promise((_, reject) => {
    id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`Timed out in ${ms}ms: ${tag}`));
    }, ms);
  });
  return new Promise((res, rej) => {
    Promise.race([promise, timeout]).then((a) => {
      clearTimeout(id);
      return res(a);
    }).catch((e2) => {
      return rej(e2);
    });
  });
};
var CLONE_ID_DELIMITER = ".";
var isCloneId = (roleName) => roleName.includes(CLONE_ID_DELIMITER);
var getBaseRoleNameFromCloneId = (roleName) => {
  if (!isCloneId(roleName)) {
    throw new Error("invalid clone id: no clone id delimiter found in role name");
  }
  return roleName.split(CLONE_ID_DELIMITER)[0];
};
var CloneId = class _CloneId {
  roleName;
  index;
  constructor(roleName, index) {
    this.roleName = roleName;
    this.index = index;
  }
  /**
   * Parse a role id of a clone cell to obtain a clone id instance.
   * @param roleName - Role id to parse.
   * @returns A clone id instance.
   */
  static fromRoleName(roleName) {
    const parts = roleName.split(CLONE_ID_DELIMITER);
    if (parts.length !== 2) {
      throw new Error("Malformed clone id: must consist of {role id.clone index}");
    }
    return new _CloneId(parts[0], parseInt(parts[1]));
  }
  toString() {
    return `${this.roleName}${CLONE_ID_DELIMITER}${this.index}`;
  }
  getBaseRoleName() {
    return this.roleName;
  }
};

// lib/api/zome-call-signing.js
var import_tweetnacl = __toESM(require_nacl_fast(), 1);

// node_modules/js-base64/base64.mjs
var version = "3.7.5";
var VERSION = version;
var _hasatob = typeof atob === "function";
var _hasbtoa = typeof btoa === "function";
var _hasBuffer = typeof Buffer === "function";
var _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
var _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
var b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var b64chs = Array.prototype.slice.call(b64ch);
var b64tab = ((a) => {
  let tab = {};
  a.forEach((c, i) => tab[c] = i);
  return tab;
})(b64chs);
var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
var _fromCC = String.fromCharCode.bind(String);
var _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
var _mkUriSafe = (src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_");
var _tidyB64 = (s2) => s2.replace(/[^A-Za-z0-9\+\/]/g, "");
var btoaPolyfill = (bin) => {
  let u32, c0, c1, c2, asc = "";
  const pad = bin.length % 3;
  for (let i = 0; i < bin.length; ) {
    if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
      throw new TypeError("invalid character found");
    u32 = c0 << 16 | c1 << 8 | c2;
    asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
  }
  return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
var _btoa = _hasbtoa ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
var _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
  const maxargs = 4096;
  let strs = [];
  for (let i = 0, l2 = u8a.length; i < l2; i += maxargs) {
    strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
  }
  return _btoa(strs.join(""));
};
var fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
var cb_utob = (c) => {
  if (c.length < 2) {
    var cc = c.charCodeAt(0);
    return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
  } else {
    var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
    return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
  }
};
var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
var utob = (u2) => u2.replace(re_utob, cb_utob);
var _encode = _hasBuffer ? (s2) => Buffer.from(s2, "utf8").toString("base64") : _TE ? (s2) => _fromUint8Array(_TE.encode(s2)) : (s2) => _btoa(utob(s2));
var encode3 = (src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
var encodeURI = (src) => encode3(src, true);
var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
var cb_btou = (cccc) => {
  switch (cccc.length) {
    case 4:
      var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
      return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
    case 3:
      return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
    default:
      return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
  }
};
var btou = (b) => b.replace(re_btou, cb_btou);
var atobPolyfill = (asc) => {
  asc = asc.replace(/\s+/g, "");
  if (!b64re.test(asc))
    throw new TypeError("malformed base64.");
  asc += "==".slice(2 - (asc.length & 3));
  let u24, bin = "", r1, r2;
  for (let i = 0; i < asc.length; ) {
    u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
    bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
  }
  return bin;
};
var _atob = _hasatob ? (asc) => atob(_tidyB64(asc)) : _hasBuffer ? (asc) => Buffer.from(asc, "base64").toString("binary") : atobPolyfill;
var _toUint8Array = _hasBuffer ? (a) => _U8Afrom(Buffer.from(a, "base64")) : (a) => _U8Afrom(_atob(a).split("").map((c) => c.charCodeAt(0)));
var toUint8Array = (a) => _toUint8Array(_unURI(a));
var _decode = _hasBuffer ? (a) => Buffer.from(a, "base64").toString("utf8") : _TD ? (a) => _TD.decode(_toUint8Array(a)) : (a) => btou(_atob(a));
var _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == "-" ? "+" : "/"));
var decode2 = (src) => _decode(_unURI(src));
var isValid = (src) => {
  if (typeof src !== "string")
    return false;
  const s2 = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
  return !/[^\s0-9a-zA-Z\+/]/.test(s2) || !/[^\s0-9a-zA-Z\-_]/.test(s2);
};
var _noEnum = (v) => {
  return {
    value: v,
    enumerable: false,
    writable: true,
    configurable: true
  };
};
var extendString = function() {
  const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
  _add("fromBase64", function() {
    return decode2(this);
  });
  _add("toBase64", function(urlsafe) {
    return encode3(this, urlsafe);
  });
  _add("toBase64URI", function() {
    return encode3(this, true);
  });
  _add("toBase64URL", function() {
    return encode3(this, true);
  });
  _add("toUint8Array", function() {
    return toUint8Array(this);
  });
};
var extendUint8Array = function() {
  const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
  _add("toBase64", function(urlsafe) {
    return fromUint8Array(this, urlsafe);
  });
  _add("toBase64URI", function() {
    return fromUint8Array(this, true);
  });
  _add("toBase64URL", function() {
    return fromUint8Array(this, true);
  });
};
var extendBuiltins = () => {
  extendString();
  extendUint8Array();
};
var gBase64 = {
  version,
  VERSION,
  atob: _atob,
  atobPolyfill,
  btoa: _btoa,
  btoaPolyfill,
  fromBase64: decode2,
  toBase64: encode3,
  encode: encode3,
  encodeURI,
  encodeURL: encodeURI,
  utob,
  btou,
  decode: decode2,
  isValid,
  fromUint8Array,
  toUint8Array,
  extendString,
  extendUint8Array,
  extendBuiltins
};

// lib/utils/base64.js
function decodeHashFromBase64(hash) {
  return gBase64.toUint8Array(hash.slice(1));
}
function encodeHashToBase64(hash) {
  return `u${gBase64.fromUint8Array(hash, true)}`;
}

// lib/api/zome-call-signing.js
var signingCredentials = /* @__PURE__ */ new Map();
var getSigningCredentials = (cellId) => {
  const cellIdB64 = encodeHashToBase64(cellId[0]).concat(encodeHashToBase64(cellId[1]));
  return signingCredentials.get(cellIdB64);
};
var setSigningCredentials = (cellId, credentials) => {
  const cellIdB64 = encodeHashToBase64(cellId[0]).concat(encodeHashToBase64(cellId[1]));
  signingCredentials.set(cellIdB64, credentials);
};
var generateSigningKeyPair = () => {
  const keyPair = import_tweetnacl.default.sign.keyPair();
  const signingKey = new Uint8Array([132, 32, 36].concat(...keyPair.publicKey).concat(...[0, 0, 0, 0]));
  return [keyPair, signingKey];
};
var randomCapSecret = () => randomByteArray(64);
var randomNonce = async () => randomByteArray(32);
var randomByteArray = async (length) => {
  if (typeof window !== "undefined" && "crypto" in window && "getRandomValues" in window.crypto) {
    return window.crypto.getRandomValues(new Uint8Array(length));
  } else {
    const crypto = await import("crypto");
    return new Uint8Array(crypto.randomBytes(length));
  }
};
var getNonceExpiration = () => (Date.now() + 5 * 60 * 1e3) * 1e3;

// lib/api/admin/websocket.js
var AdminWebsocket = class _AdminWebsocket {
  /**
   * The websocket client used for transporting requests and responses.
   */
  client;
  /**
   * Default timeout for any request made over the websocket.
   */
  defaultTimeout;
  constructor(client, defaultTimeout) {
    this.client = client;
    this.defaultTimeout = defaultTimeout === void 0 ? DEFAULT_TIMEOUT : defaultTimeout;
  }
  /**
   * Factory mehtod to create a new instance connected to the given URL.
   *
   * @param url - A `ws://` URL used as the connection address.
   * @param defaultTimeout - The default timeout for any request.
   * @returns A promise for a new connected instance.
   */
  static async connect(url, defaultTimeout) {
    const env = getLauncherEnvironment();
    if (env?.ADMIN_INTERFACE_PORT) {
      url = `ws://127.0.0.1:${env.ADMIN_INTERFACE_PORT}`;
    }
    const wsClient = await WsClient.connect(url);
    return new _AdminWebsocket(wsClient, defaultTimeout);
  }
  _requester(tag, transformer) {
    return requesterTransformer((req, timeout) => promiseTimeout(this.client.request(req), tag, timeout || this.defaultTimeout).then(catchError), tag, transformer);
  }
  /**
   * Send a request to open the given port for {@link AppWebsocket} connections.
   */
  attachAppInterface = this._requester("attach_app_interface");
  /**
   * Enable a stopped app.
   */
  enableApp = this._requester("enable_app");
  /**
   * Disable a running app.
   */
  disableApp = this._requester("disable_app");
  /**
   * Dump the state of the specified cell, including its source chain, as JSON.
   */
  dumpState = this._requester("dump_state", dumpStateTransform);
  /**
   * Dump the full state of the specified cell, including its chain and DHT
   * shard, as JSON.
   */
  dumpFullState = this._requester("dump_full_state");
  /**
   * Generate a new agent pub key.
   */
  generateAgentPubKey = this._requester("generate_agent_pub_key");
  /**
   * Register a DNA for later app installation.
   *
   * Stores the given DNA into the Holochain DNA database and returns the hash of it.
   */
  registerDna = this._requester("register_dna");
  /**
   * Get the DNA definition for the specified DNA hash.
   */
  getDnaDefinition = this._requester("get_dna_definition");
  /**
   * Uninstall the specified app from Holochain.
   */
  uninstallApp = this._requester("uninstall_app");
  /**
   * Install the specified app into Holochain.
   */
  installApp = this._requester("install_app");
  /**
   * List all registered DNAs.
   */
  listDnas = this._requester("list_dnas");
  /**
   * List all installed cell ids.
   */
  listCellIds = this._requester("list_cell_ids");
  /**
   * List all installed apps.
   */
  listApps = this._requester("list_apps", listAppsTransform);
  /**
   * List all attached app interfaces.
   */
  listAppInterfaces = this._requester("list_app_interfaces");
  /**
   * Request all available info about an agent.
   */
  agentInfo = this._requester("agent_info");
  /**
   * Add an existing agent to Holochain.
   */
  addAgentInfo = this._requester("add_agent_info");
  /**
   * Delete a disabled clone cell.
   */
  deleteCloneCell = this._requester("delete_clone_cell");
  /**
   * Grant a zome call capability for an agent, to be used for signing zome
   * calls.
   */
  grantZomeCallCapability = this._requester("grant_zome_call_capability");
  // zome call signing related methods
  /**
   * Grant a capability for signing zome calls.
   *
   * @param cellId - The cell to grant the capability for.
   * @param functions - The zome functions to grant the capability for.
   * @param signingKey - The assignee of the capability.
   * @returns The cap secret of the created capability.
   */
  grantSigningKey = async (cellId, functions, signingKey) => {
    const capSecret = await randomCapSecret();
    await this.grantZomeCallCapability({
      cell_id: cellId,
      cap_grant: {
        tag: "zome-call-signing-key",
        functions,
        access: {
          Assigned: {
            secret: capSecret,
            assignees: [signingKey]
          }
        }
      }
    });
    return capSecret;
  };
  /**
   * Generate and authorize a new key pair for signing zome calls.
   *
   * @param cellId - The cell id to create the capability grant for.
   * @param functions - Zomes and functions to authorize the signing key for
   * (optional). When no functions are specified, the capability will be
   * granted for all zomes and functions.
   */
  authorizeSigningCredentials = async (cellId, functions) => {
    const [keyPair, signingKey] = generateSigningKeyPair();
    const capSecret = await this.grantSigningKey(cellId, functions || { [GrantedFunctionsType.All]: null }, signingKey);
    setSigningCredentials(cellId, { capSecret, keyPair, signingKey });
  };
};
var listAppsTransform = {
  input: (req) => {
    const args = {};
    if (req.status_filter) {
      args.status_filter = getAppStatusInApiForm(req.status_filter);
    }
    return args;
  },
  output: (res) => res
};
var dumpStateTransform = {
  input: (req) => req,
  output: (res) => {
    return JSON.parse(res);
  }
};
function getAppStatusInApiForm(status_filter) {
  switch (status_filter) {
    case AppStatusFilter.Running:
      return {
        Running: null
      };
    case AppStatusFilter.Enabled:
      return {
        Enabled: null
      };
    case AppStatusFilter.Paused:
      return {
        Paused: null
      };
    case AppStatusFilter.Disabled:
      return {
        Disabled: null
      };
    case AppStatusFilter.Stopped:
      return {
        Stopped: null
      };
  }
}

// node_modules/lodash-es/_freeGlobal.js
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeGlobal_default = freeGlobal;

// node_modules/lodash-es/_root.js
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal_default || freeSelf || Function("return this")();
var root_default = root;

// node_modules/lodash-es/_Symbol.js
var Symbol2 = root_default.Symbol;
var Symbol_default = Symbol2;

// node_modules/lodash-es/_getRawTag.js
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
  try {
    value[symToStringTag] = void 0;
    var unmasked = true;
  } catch (e2) {
  }
  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
var getRawTag_default = getRawTag;

// node_modules/lodash-es/_objectToString.js
var objectProto2 = Object.prototype;
var nativeObjectToString2 = objectProto2.toString;
function objectToString(value) {
  return nativeObjectToString2.call(value);
}
var objectToString_default = objectToString;

// node_modules/lodash-es/_baseGetTag.js
var nullTag = "[object Null]";
var undefinedTag = "[object Undefined]";
var symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag2 && symToStringTag2 in Object(value) ? getRawTag_default(value) : objectToString_default(value);
}
var baseGetTag_default = baseGetTag;

// node_modules/lodash-es/isObjectLike.js
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var isObjectLike_default = isObjectLike;

// node_modules/lodash-es/isSymbol.js
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike_default(value) && baseGetTag_default(value) == symbolTag;
}
var isSymbol_default = isSymbol;

// node_modules/lodash-es/_arrayMap.js
function arrayMap(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
var arrayMap_default = arrayMap;

// node_modules/lodash-es/isArray.js
var isArray = Array.isArray;
var isArray_default = isArray;

// node_modules/lodash-es/_baseToString.js
var INFINITY = 1 / 0;
var symbolProto = Symbol_default ? Symbol_default.prototype : void 0;
var symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray_default(value)) {
    return arrayMap_default(value, baseToString) + "";
  }
  if (isSymbol_default(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
var baseToString_default = baseToString;

// node_modules/lodash-es/isObject.js
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var isObject_default = isObject;

// node_modules/lodash-es/identity.js
function identity2(value) {
  return value;
}
var identity_default = identity2;

// node_modules/lodash-es/isFunction.js
var asyncTag = "[object AsyncFunction]";
var funcTag = "[object Function]";
var genTag = "[object GeneratorFunction]";
var proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject_default(value)) {
    return false;
  }
  var tag = baseGetTag_default(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var isFunction_default = isFunction;

// node_modules/lodash-es/_coreJsData.js
var coreJsData = root_default["__core-js_shared__"];
var coreJsData_default = coreJsData;

// node_modules/lodash-es/_isMasked.js
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData_default && coreJsData_default.keys && coreJsData_default.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var isMasked_default = isMasked;

// node_modules/lodash-es/_toSource.js
var funcProto = Function.prototype;
var funcToString = funcProto.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e2) {
    }
    try {
      return func + "";
    } catch (e2) {
    }
  }
  return "";
}
var toSource_default = toSource;

// node_modules/lodash-es/_baseIsNative.js
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto2 = Function.prototype;
var objectProto3 = Object.prototype;
var funcToString2 = funcProto2.toString;
var hasOwnProperty2 = objectProto3.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject_default(value) || isMasked_default(value)) {
    return false;
  }
  var pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource_default(value));
}
var baseIsNative_default = baseIsNative;

// node_modules/lodash-es/_getValue.js
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
var getValue_default = getValue;

// node_modules/lodash-es/_getNative.js
function getNative(object, key) {
  var value = getValue_default(object, key);
  return baseIsNative_default(value) ? value : void 0;
}
var getNative_default = getNative;

// node_modules/lodash-es/_WeakMap.js
var WeakMap2 = getNative_default(root_default, "WeakMap");
var WeakMap_default = WeakMap2;

// node_modules/lodash-es/_baseCreate.js
var objectCreate = Object.create;
var baseCreate = function() {
  function object() {
  }
  return function(proto) {
    if (!isObject_default(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
}();
var baseCreate_default = baseCreate;

// node_modules/lodash-es/_apply.js
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
var apply_default = apply;

// node_modules/lodash-es/_copyArray.js
function copyArray(source, array) {
  var index = -1, length = source.length;
  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}
var copyArray_default = copyArray;

// node_modules/lodash-es/_shortOut.js
var HOT_COUNT = 800;
var HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
var shortOut_default = shortOut;

// node_modules/lodash-es/constant.js
function constant(value) {
  return function() {
    return value;
  };
}
var constant_default = constant;

// node_modules/lodash-es/_defineProperty.js
var defineProperty = function() {
  try {
    var func = getNative_default(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e2) {
  }
}();
var defineProperty_default = defineProperty;

// node_modules/lodash-es/_baseSetToString.js
var baseSetToString = !defineProperty_default ? identity_default : function(func, string) {
  return defineProperty_default(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant_default(string),
    "writable": true
  });
};
var baseSetToString_default = baseSetToString;

// node_modules/lodash-es/_setToString.js
var setToString = shortOut_default(baseSetToString_default);
var setToString_default = setToString;

// node_modules/lodash-es/_arrayEach.js
function arrayEach(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}
var arrayEach_default = arrayEach;

// node_modules/lodash-es/_isIndex.js
var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
var isIndex_default = isIndex;

// node_modules/lodash-es/_baseAssignValue.js
function baseAssignValue(object, key, value) {
  if (key == "__proto__" && defineProperty_default) {
    defineProperty_default(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value,
      "writable": true
    });
  } else {
    object[key] = value;
  }
}
var baseAssignValue_default = baseAssignValue;

// node_modules/lodash-es/eq.js
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
var eq_default = eq;

// node_modules/lodash-es/_assignValue.js
var objectProto4 = Object.prototype;
var hasOwnProperty3 = objectProto4.hasOwnProperty;
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty3.call(object, key) && eq_default(objValue, value)) || value === void 0 && !(key in object)) {
    baseAssignValue_default(object, key, value);
  }
}
var assignValue_default = assignValue;

// node_modules/lodash-es/_copyObject.js
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1, length = props.length;
  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue_default(object, key, newValue);
    } else {
      assignValue_default(object, key, newValue);
    }
  }
  return object;
}
var copyObject_default = copyObject;

// node_modules/lodash-es/_overRest.js
var nativeMax = Math.max;
function overRest(func, start, transform) {
  start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
  return function() {
    var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply_default(func, this, otherArgs);
  };
}
var overRest_default = overRest;

// node_modules/lodash-es/isLength.js
var MAX_SAFE_INTEGER2 = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
}
var isLength_default = isLength;

// node_modules/lodash-es/isArrayLike.js
function isArrayLike(value) {
  return value != null && isLength_default(value.length) && !isFunction_default(value);
}
var isArrayLike_default = isArrayLike;

// node_modules/lodash-es/_isPrototype.js
var objectProto5 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto5;
  return value === proto;
}
var isPrototype_default = isPrototype;

// node_modules/lodash-es/_baseTimes.js
function baseTimes(n, iteratee) {
  var index = -1, result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
var baseTimes_default = baseTimes;

// node_modules/lodash-es/_baseIsArguments.js
var argsTag = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike_default(value) && baseGetTag_default(value) == argsTag;
}
var baseIsArguments_default = baseIsArguments;

// node_modules/lodash-es/isArguments.js
var objectProto6 = Object.prototype;
var hasOwnProperty4 = objectProto6.hasOwnProperty;
var propertyIsEnumerable = objectProto6.propertyIsEnumerable;
var isArguments = baseIsArguments_default(function() {
  return arguments;
}()) ? baseIsArguments_default : function(value) {
  return isObjectLike_default(value) && hasOwnProperty4.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
var isArguments_default = isArguments;

// node_modules/lodash-es/stubFalse.js
function stubFalse() {
  return false;
}
var stubFalse_default = stubFalse;

// node_modules/lodash-es/isBuffer.js
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer2 = moduleExports ? root_default.Buffer : void 0;
var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse_default;
var isBuffer_default = isBuffer;

// node_modules/lodash-es/_baseIsTypedArray.js
var argsTag2 = "[object Arguments]";
var arrayTag = "[object Array]";
var boolTag = "[object Boolean]";
var dateTag = "[object Date]";
var errorTag = "[object Error]";
var funcTag2 = "[object Function]";
var mapTag = "[object Map]";
var numberTag = "[object Number]";
var objectTag = "[object Object]";
var regexpTag = "[object RegExp]";
var setTag = "[object Set]";
var stringTag = "[object String]";
var weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]";
var dataViewTag = "[object DataView]";
var float32Tag = "[object Float32Array]";
var float64Tag = "[object Float64Array]";
var int8Tag = "[object Int8Array]";
var int16Tag = "[object Int16Array]";
var int32Tag = "[object Int32Array]";
var uint8Tag = "[object Uint8Array]";
var uint8ClampedTag = "[object Uint8ClampedArray]";
var uint16Tag = "[object Uint16Array]";
var uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag2] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag2] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
  return isObjectLike_default(value) && isLength_default(value.length) && !!typedArrayTags[baseGetTag_default(value)];
}
var baseIsTypedArray_default = baseIsTypedArray;

// node_modules/lodash-es/_baseUnary.js
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var baseUnary_default = baseUnary;

// node_modules/lodash-es/_nodeUtil.js
var freeExports2 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule2 = freeExports2 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
var freeProcess = moduleExports2 && freeGlobal_default.process;
var nodeUtil = function() {
  try {
    var types = freeModule2 && freeModule2.require && freeModule2.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e2) {
  }
}();
var nodeUtil_default = nodeUtil;

// node_modules/lodash-es/isTypedArray.js
var nodeIsTypedArray = nodeUtil_default && nodeUtil_default.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary_default(nodeIsTypedArray) : baseIsTypedArray_default;
var isTypedArray_default = isTypedArray;

// node_modules/lodash-es/_arrayLikeKeys.js
var objectProto7 = Object.prototype;
var hasOwnProperty5 = objectProto7.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_default(value), isArg = !isArr && isArguments_default(value), isBuff = !isArr && !isArg && isBuffer_default(value), isType = !isArr && !isArg && !isBuff && isTypedArray_default(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes_default(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty5.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex_default(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
var arrayLikeKeys_default = arrayLikeKeys;

// node_modules/lodash-es/_overArg.js
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var overArg_default = overArg;

// node_modules/lodash-es/_nativeKeys.js
var nativeKeys = overArg_default(Object.keys, Object);
var nativeKeys_default = nativeKeys;

// node_modules/lodash-es/_baseKeys.js
var objectProto8 = Object.prototype;
var hasOwnProperty6 = objectProto8.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype_default(object)) {
    return nativeKeys_default(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty6.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
var baseKeys_default = baseKeys;

// node_modules/lodash-es/keys.js
function keys(object) {
  return isArrayLike_default(object) ? arrayLikeKeys_default(object) : baseKeys_default(object);
}
var keys_default = keys;

// node_modules/lodash-es/_nativeKeysIn.js
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
var nativeKeysIn_default = nativeKeysIn;

// node_modules/lodash-es/_baseKeysIn.js
var objectProto9 = Object.prototype;
var hasOwnProperty7 = objectProto9.hasOwnProperty;
function baseKeysIn(object) {
  if (!isObject_default(object)) {
    return nativeKeysIn_default(object);
  }
  var isProto = isPrototype_default(object), result = [];
  for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty7.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
var baseKeysIn_default = baseKeysIn;

// node_modules/lodash-es/keysIn.js
function keysIn(object) {
  return isArrayLike_default(object) ? arrayLikeKeys_default(object, true) : baseKeysIn_default(object);
}
var keysIn_default = keysIn;

// node_modules/lodash-es/_isKey.js
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;
function isKey(value, object) {
  if (isArray_default(value)) {
    return false;
  }
  var type = typeof value;
  if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol_default(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
var isKey_default = isKey;

// node_modules/lodash-es/_nativeCreate.js
var nativeCreate = getNative_default(Object, "create");
var nativeCreate_default = nativeCreate;

// node_modules/lodash-es/_hashClear.js
function hashClear() {
  this.__data__ = nativeCreate_default ? nativeCreate_default(null) : {};
  this.size = 0;
}
var hashClear_default = hashClear;

// node_modules/lodash-es/_hashDelete.js
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var hashDelete_default = hashDelete;

// node_modules/lodash-es/_hashGet.js
var HASH_UNDEFINED = "__lodash_hash_undefined__";
var objectProto10 = Object.prototype;
var hasOwnProperty8 = objectProto10.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate_default) {
    var result = data[key];
    return result === HASH_UNDEFINED ? void 0 : result;
  }
  return hasOwnProperty8.call(data, key) ? data[key] : void 0;
}
var hashGet_default = hashGet;

// node_modules/lodash-es/_hashHas.js
var objectProto11 = Object.prototype;
var hasOwnProperty9 = objectProto11.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate_default ? data[key] !== void 0 : hasOwnProperty9.call(data, key);
}
var hashHas_default = hashHas;

// node_modules/lodash-es/_hashSet.js
var HASH_UNDEFINED2 = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate_default && value === void 0 ? HASH_UNDEFINED2 : value;
  return this;
}
var hashSet_default = hashSet;

// node_modules/lodash-es/_Hash.js
function Hash(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear_default;
Hash.prototype["delete"] = hashDelete_default;
Hash.prototype.get = hashGet_default;
Hash.prototype.has = hashHas_default;
Hash.prototype.set = hashSet_default;
var Hash_default = Hash;

// node_modules/lodash-es/_listCacheClear.js
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
var listCacheClear_default = listCacheClear;

// node_modules/lodash-es/_assocIndexOf.js
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_default(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var assocIndexOf_default = assocIndexOf;

// node_modules/lodash-es/_listCacheDelete.js
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
var listCacheDelete_default = listCacheDelete;

// node_modules/lodash-es/_listCacheGet.js
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  return index < 0 ? void 0 : data[index][1];
}
var listCacheGet_default = listCacheGet;

// node_modules/lodash-es/_listCacheHas.js
function listCacheHas(key) {
  return assocIndexOf_default(this.__data__, key) > -1;
}
var listCacheHas_default = listCacheHas;

// node_modules/lodash-es/_listCacheSet.js
function listCacheSet(key, value) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
var listCacheSet_default = listCacheSet;

// node_modules/lodash-es/_ListCache.js
function ListCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear_default;
ListCache.prototype["delete"] = listCacheDelete_default;
ListCache.prototype.get = listCacheGet_default;
ListCache.prototype.has = listCacheHas_default;
ListCache.prototype.set = listCacheSet_default;
var ListCache_default = ListCache;

// node_modules/lodash-es/_Map.js
var Map2 = getNative_default(root_default, "Map");
var Map_default = Map2;

// node_modules/lodash-es/_mapCacheClear.js
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash_default(),
    "map": new (Map_default || ListCache_default)(),
    "string": new Hash_default()
  };
}
var mapCacheClear_default = mapCacheClear;

// node_modules/lodash-es/_isKeyable.js
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
var isKeyable_default = isKeyable;

// node_modules/lodash-es/_getMapData.js
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable_default(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
var getMapData_default = getMapData;

// node_modules/lodash-es/_mapCacheDelete.js
function mapCacheDelete(key) {
  var result = getMapData_default(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
var mapCacheDelete_default = mapCacheDelete;

// node_modules/lodash-es/_mapCacheGet.js
function mapCacheGet(key) {
  return getMapData_default(this, key).get(key);
}
var mapCacheGet_default = mapCacheGet;

// node_modules/lodash-es/_mapCacheHas.js
function mapCacheHas(key) {
  return getMapData_default(this, key).has(key);
}
var mapCacheHas_default = mapCacheHas;

// node_modules/lodash-es/_mapCacheSet.js
function mapCacheSet(key, value) {
  var data = getMapData_default(this, key), size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
var mapCacheSet_default = mapCacheSet;

// node_modules/lodash-es/_MapCache.js
function MapCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear_default;
MapCache.prototype["delete"] = mapCacheDelete_default;
MapCache.prototype.get = mapCacheGet_default;
MapCache.prototype.has = mapCacheHas_default;
MapCache.prototype.set = mapCacheSet_default;
var MapCache_default = MapCache;

// node_modules/lodash-es/memoize.js
var FUNC_ERROR_TEXT = "Expected a function";
function memoize(func, resolver) {
  if (typeof func != "function" || resolver != null && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache_default)();
  return memoized;
}
memoize.Cache = MapCache_default;
var memoize_default = memoize;

// node_modules/lodash-es/_memoizeCapped.js
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
  var result = memoize_default(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  var cache = result.cache;
  return result;
}
var memoizeCapped_default = memoizeCapped;

// node_modules/lodash-es/_stringToPath.js
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = memoizeCapped_default(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46) {
    result.push("");
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
  });
  return result;
});
var stringToPath_default = stringToPath;

// node_modules/lodash-es/toString.js
function toString2(value) {
  return value == null ? "" : baseToString_default(value);
}
var toString_default = toString2;

// node_modules/lodash-es/_castPath.js
function castPath(value, object) {
  if (isArray_default(value)) {
    return value;
  }
  return isKey_default(value, object) ? [value] : stringToPath_default(toString_default(value));
}
var castPath_default = castPath;

// node_modules/lodash-es/_toKey.js
var INFINITY2 = 1 / 0;
function toKey(value) {
  if (typeof value == "string" || isSymbol_default(value)) {
    return value;
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY2 ? "-0" : result;
}
var toKey_default = toKey;

// node_modules/lodash-es/_baseGet.js
function baseGet(object, path) {
  path = castPath_default(path, object);
  var index = 0, length = path.length;
  while (object != null && index < length) {
    object = object[toKey_default(path[index++])];
  }
  return index && index == length ? object : void 0;
}
var baseGet_default = baseGet;

// node_modules/lodash-es/_arrayPush.js
function arrayPush(array, values) {
  var index = -1, length = values.length, offset = array.length;
  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}
var arrayPush_default = arrayPush;

// node_modules/lodash-es/_isFlattenable.js
var spreadableSymbol = Symbol_default ? Symbol_default.isConcatSpreadable : void 0;
function isFlattenable(value) {
  return isArray_default(value) || isArguments_default(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
var isFlattenable_default = isFlattenable;

// node_modules/lodash-es/_baseFlatten.js
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1, length = array.length;
  predicate || (predicate = isFlattenable_default);
  result || (result = []);
  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush_default(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}
var baseFlatten_default = baseFlatten;

// node_modules/lodash-es/flatten.js
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten_default(array, 1) : [];
}
var flatten_default = flatten;

// node_modules/lodash-es/_flatRest.js
function flatRest(func) {
  return setToString_default(overRest_default(func, void 0, flatten_default), func + "");
}
var flatRest_default = flatRest;

// node_modules/lodash-es/_getPrototype.js
var getPrototype = overArg_default(Object.getPrototypeOf, Object);
var getPrototype_default = getPrototype;

// node_modules/lodash-es/isPlainObject.js
var objectTag2 = "[object Object]";
var funcProto3 = Function.prototype;
var objectProto12 = Object.prototype;
var funcToString3 = funcProto3.toString;
var hasOwnProperty10 = objectProto12.hasOwnProperty;
var objectCtorString = funcToString3.call(Object);
function isPlainObject(value) {
  if (!isObjectLike_default(value) || baseGetTag_default(value) != objectTag2) {
    return false;
  }
  var proto = getPrototype_default(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty10.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString3.call(Ctor) == objectCtorString;
}
var isPlainObject_default = isPlainObject;

// node_modules/lodash-es/_baseSlice.js
function baseSlice(array, start, end) {
  var index = -1, length = array.length;
  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;
  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}
var baseSlice_default = baseSlice;

// node_modules/lodash-es/_stackClear.js
function stackClear() {
  this.__data__ = new ListCache_default();
  this.size = 0;
}
var stackClear_default = stackClear;

// node_modules/lodash-es/_stackDelete.js
function stackDelete(key) {
  var data = this.__data__, result = data["delete"](key);
  this.size = data.size;
  return result;
}
var stackDelete_default = stackDelete;

// node_modules/lodash-es/_stackGet.js
function stackGet(key) {
  return this.__data__.get(key);
}
var stackGet_default = stackGet;

// node_modules/lodash-es/_stackHas.js
function stackHas(key) {
  return this.__data__.has(key);
}
var stackHas_default = stackHas;

// node_modules/lodash-es/_stackSet.js
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache_default) {
    var pairs = data.__data__;
    if (!Map_default || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache_default(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
var stackSet_default = stackSet;

// node_modules/lodash-es/_Stack.js
function Stack(entries) {
  var data = this.__data__ = new ListCache_default(entries);
  this.size = data.size;
}
Stack.prototype.clear = stackClear_default;
Stack.prototype["delete"] = stackDelete_default;
Stack.prototype.get = stackGet_default;
Stack.prototype.has = stackHas_default;
Stack.prototype.set = stackSet_default;
var Stack_default = Stack;

// node_modules/lodash-es/_baseAssign.js
function baseAssign(object, source) {
  return object && copyObject_default(source, keys_default(source), object);
}
var baseAssign_default = baseAssign;

// node_modules/lodash-es/_baseAssignIn.js
function baseAssignIn(object, source) {
  return object && copyObject_default(source, keysIn_default(source), object);
}
var baseAssignIn_default = baseAssignIn;

// node_modules/lodash-es/_cloneBuffer.js
var freeExports3 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule3 = freeExports3 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports3 = freeModule3 && freeModule3.exports === freeExports3;
var Buffer3 = moduleExports3 ? root_default.Buffer : void 0;
var allocUnsafe = Buffer3 ? Buffer3.allocUnsafe : void 0;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}
var cloneBuffer_default = cloneBuffer;

// node_modules/lodash-es/_arrayFilter.js
function arrayFilter(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
var arrayFilter_default = arrayFilter;

// node_modules/lodash-es/stubArray.js
function stubArray() {
  return [];
}
var stubArray_default = stubArray;

// node_modules/lodash-es/_getSymbols.js
var objectProto13 = Object.prototype;
var propertyIsEnumerable2 = objectProto13.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols ? stubArray_default : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter_default(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable2.call(object, symbol);
  });
};
var getSymbols_default = getSymbols;

// node_modules/lodash-es/_copySymbols.js
function copySymbols(source, object) {
  return copyObject_default(source, getSymbols_default(source), object);
}
var copySymbols_default = copySymbols;

// node_modules/lodash-es/_getSymbolsIn.js
var nativeGetSymbols2 = Object.getOwnPropertySymbols;
var getSymbolsIn = !nativeGetSymbols2 ? stubArray_default : function(object) {
  var result = [];
  while (object) {
    arrayPush_default(result, getSymbols_default(object));
    object = getPrototype_default(object);
  }
  return result;
};
var getSymbolsIn_default = getSymbolsIn;

// node_modules/lodash-es/_copySymbolsIn.js
function copySymbolsIn(source, object) {
  return copyObject_default(source, getSymbolsIn_default(source), object);
}
var copySymbolsIn_default = copySymbolsIn;

// node_modules/lodash-es/_baseGetAllKeys.js
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_default(object) ? result : arrayPush_default(result, symbolsFunc(object));
}
var baseGetAllKeys_default = baseGetAllKeys;

// node_modules/lodash-es/_getAllKeys.js
function getAllKeys(object) {
  return baseGetAllKeys_default(object, keys_default, getSymbols_default);
}
var getAllKeys_default = getAllKeys;

// node_modules/lodash-es/_getAllKeysIn.js
function getAllKeysIn(object) {
  return baseGetAllKeys_default(object, keysIn_default, getSymbolsIn_default);
}
var getAllKeysIn_default = getAllKeysIn;

// node_modules/lodash-es/_DataView.js
var DataView2 = getNative_default(root_default, "DataView");
var DataView_default = DataView2;

// node_modules/lodash-es/_Promise.js
var Promise2 = getNative_default(root_default, "Promise");
var Promise_default = Promise2;

// node_modules/lodash-es/_Set.js
var Set2 = getNative_default(root_default, "Set");
var Set_default = Set2;

// node_modules/lodash-es/_getTag.js
var mapTag2 = "[object Map]";
var objectTag3 = "[object Object]";
var promiseTag = "[object Promise]";
var setTag2 = "[object Set]";
var weakMapTag2 = "[object WeakMap]";
var dataViewTag2 = "[object DataView]";
var dataViewCtorString = toSource_default(DataView_default);
var mapCtorString = toSource_default(Map_default);
var promiseCtorString = toSource_default(Promise_default);
var setCtorString = toSource_default(Set_default);
var weakMapCtorString = toSource_default(WeakMap_default);
var getTag = baseGetTag_default;
if (DataView_default && getTag(new DataView_default(new ArrayBuffer(1))) != dataViewTag2 || Map_default && getTag(new Map_default()) != mapTag2 || Promise_default && getTag(Promise_default.resolve()) != promiseTag || Set_default && getTag(new Set_default()) != setTag2 || WeakMap_default && getTag(new WeakMap_default()) != weakMapTag2) {
  getTag = function(value) {
    var result = baseGetTag_default(value), Ctor = result == objectTag3 ? value.constructor : void 0, ctorString = Ctor ? toSource_default(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag2;
        case mapCtorString:
          return mapTag2;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag2;
        case weakMapCtorString:
          return weakMapTag2;
      }
    }
    return result;
  };
}
var getTag_default = getTag;

// node_modules/lodash-es/_initCloneArray.js
var objectProto14 = Object.prototype;
var hasOwnProperty11 = objectProto14.hasOwnProperty;
function initCloneArray(array) {
  var length = array.length, result = new array.constructor(length);
  if (length && typeof array[0] == "string" && hasOwnProperty11.call(array, "index")) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}
var initCloneArray_default = initCloneArray;

// node_modules/lodash-es/_Uint8Array.js
var Uint8Array2 = root_default.Uint8Array;
var Uint8Array_default = Uint8Array2;

// node_modules/lodash-es/_cloneArrayBuffer.js
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array_default(result).set(new Uint8Array_default(arrayBuffer));
  return result;
}
var cloneArrayBuffer_default = cloneArrayBuffer;

// node_modules/lodash-es/_cloneDataView.js
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer_default(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
var cloneDataView_default = cloneDataView;

// node_modules/lodash-es/_cloneRegExp.js
var reFlags = /\w*$/;
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}
var cloneRegExp_default = cloneRegExp;

// node_modules/lodash-es/_cloneSymbol.js
var symbolProto2 = Symbol_default ? Symbol_default.prototype : void 0;
var symbolValueOf = symbolProto2 ? symbolProto2.valueOf : void 0;
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}
var cloneSymbol_default = cloneSymbol;

// node_modules/lodash-es/_cloneTypedArray.js
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer_default(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
var cloneTypedArray_default = cloneTypedArray;

// node_modules/lodash-es/_initCloneByTag.js
var boolTag2 = "[object Boolean]";
var dateTag2 = "[object Date]";
var mapTag3 = "[object Map]";
var numberTag2 = "[object Number]";
var regexpTag2 = "[object RegExp]";
var setTag3 = "[object Set]";
var stringTag2 = "[object String]";
var symbolTag2 = "[object Symbol]";
var arrayBufferTag2 = "[object ArrayBuffer]";
var dataViewTag3 = "[object DataView]";
var float32Tag2 = "[object Float32Array]";
var float64Tag2 = "[object Float64Array]";
var int8Tag2 = "[object Int8Array]";
var int16Tag2 = "[object Int16Array]";
var int32Tag2 = "[object Int32Array]";
var uint8Tag2 = "[object Uint8Array]";
var uint8ClampedTag2 = "[object Uint8ClampedArray]";
var uint16Tag2 = "[object Uint16Array]";
var uint32Tag2 = "[object Uint32Array]";
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag2:
      return cloneArrayBuffer_default(object);
    case boolTag2:
    case dateTag2:
      return new Ctor(+object);
    case dataViewTag3:
      return cloneDataView_default(object, isDeep);
    case float32Tag2:
    case float64Tag2:
    case int8Tag2:
    case int16Tag2:
    case int32Tag2:
    case uint8Tag2:
    case uint8ClampedTag2:
    case uint16Tag2:
    case uint32Tag2:
      return cloneTypedArray_default(object, isDeep);
    case mapTag3:
      return new Ctor();
    case numberTag2:
    case stringTag2:
      return new Ctor(object);
    case regexpTag2:
      return cloneRegExp_default(object);
    case setTag3:
      return new Ctor();
    case symbolTag2:
      return cloneSymbol_default(object);
  }
}
var initCloneByTag_default = initCloneByTag;

// node_modules/lodash-es/_initCloneObject.js
function initCloneObject(object) {
  return typeof object.constructor == "function" && !isPrototype_default(object) ? baseCreate_default(getPrototype_default(object)) : {};
}
var initCloneObject_default = initCloneObject;

// node_modules/lodash-es/_baseIsMap.js
var mapTag4 = "[object Map]";
function baseIsMap(value) {
  return isObjectLike_default(value) && getTag_default(value) == mapTag4;
}
var baseIsMap_default = baseIsMap;

// node_modules/lodash-es/isMap.js
var nodeIsMap = nodeUtil_default && nodeUtil_default.isMap;
var isMap = nodeIsMap ? baseUnary_default(nodeIsMap) : baseIsMap_default;
var isMap_default = isMap;

// node_modules/lodash-es/_baseIsSet.js
var setTag4 = "[object Set]";
function baseIsSet(value) {
  return isObjectLike_default(value) && getTag_default(value) == setTag4;
}
var baseIsSet_default = baseIsSet;

// node_modules/lodash-es/isSet.js
var nodeIsSet = nodeUtil_default && nodeUtil_default.isSet;
var isSet = nodeIsSet ? baseUnary_default(nodeIsSet) : baseIsSet_default;
var isSet_default = isSet;

// node_modules/lodash-es/_baseClone.js
var CLONE_DEEP_FLAG = 1;
var CLONE_FLAT_FLAG = 2;
var CLONE_SYMBOLS_FLAG = 4;
var argsTag3 = "[object Arguments]";
var arrayTag2 = "[object Array]";
var boolTag3 = "[object Boolean]";
var dateTag3 = "[object Date]";
var errorTag2 = "[object Error]";
var funcTag3 = "[object Function]";
var genTag2 = "[object GeneratorFunction]";
var mapTag5 = "[object Map]";
var numberTag3 = "[object Number]";
var objectTag4 = "[object Object]";
var regexpTag3 = "[object RegExp]";
var setTag5 = "[object Set]";
var stringTag3 = "[object String]";
var symbolTag3 = "[object Symbol]";
var weakMapTag3 = "[object WeakMap]";
var arrayBufferTag3 = "[object ArrayBuffer]";
var dataViewTag4 = "[object DataView]";
var float32Tag3 = "[object Float32Array]";
var float64Tag3 = "[object Float64Array]";
var int8Tag3 = "[object Int8Array]";
var int16Tag3 = "[object Int16Array]";
var int32Tag3 = "[object Int32Array]";
var uint8Tag3 = "[object Uint8Array]";
var uint8ClampedTag3 = "[object Uint8ClampedArray]";
var uint16Tag3 = "[object Uint16Array]";
var uint32Tag3 = "[object Uint32Array]";
var cloneableTags = {};
cloneableTags[argsTag3] = cloneableTags[arrayTag2] = cloneableTags[arrayBufferTag3] = cloneableTags[dataViewTag4] = cloneableTags[boolTag3] = cloneableTags[dateTag3] = cloneableTags[float32Tag3] = cloneableTags[float64Tag3] = cloneableTags[int8Tag3] = cloneableTags[int16Tag3] = cloneableTags[int32Tag3] = cloneableTags[mapTag5] = cloneableTags[numberTag3] = cloneableTags[objectTag4] = cloneableTags[regexpTag3] = cloneableTags[setTag5] = cloneableTags[stringTag3] = cloneableTags[symbolTag3] = cloneableTags[uint8Tag3] = cloneableTags[uint8ClampedTag3] = cloneableTags[uint16Tag3] = cloneableTags[uint32Tag3] = true;
cloneableTags[errorTag2] = cloneableTags[funcTag3] = cloneableTags[weakMapTag3] = false;
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== void 0) {
    return result;
  }
  if (!isObject_default(value)) {
    return value;
  }
  var isArr = isArray_default(value);
  if (isArr) {
    result = initCloneArray_default(value);
    if (!isDeep) {
      return copyArray_default(value, result);
    }
  } else {
    var tag = getTag_default(value), isFunc = tag == funcTag3 || tag == genTag2;
    if (isBuffer_default(value)) {
      return cloneBuffer_default(value, isDeep);
    }
    if (tag == objectTag4 || tag == argsTag3 || isFunc && !object) {
      result = isFlat || isFunc ? {} : initCloneObject_default(value);
      if (!isDeep) {
        return isFlat ? copySymbolsIn_default(value, baseAssignIn_default(result, value)) : copySymbols_default(value, baseAssign_default(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag_default(value, tag, isDeep);
    }
  }
  stack || (stack = new Stack_default());
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);
  if (isSet_default(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap_default(value)) {
    value.forEach(function(subValue, key2) {
      result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
  }
  var keysFunc = isFull ? isFlat ? getAllKeysIn_default : getAllKeys_default : isFlat ? keysIn_default : keys_default;
  var props = isArr ? void 0 : keysFunc(value);
  arrayEach_default(props || value, function(subValue, key2) {
    if (props) {
      key2 = subValue;
      subValue = value[key2];
    }
    assignValue_default(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
  });
  return result;
}
var baseClone_default = baseClone;

// node_modules/lodash-es/last.js
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : void 0;
}
var last_default = last;

// node_modules/lodash-es/_parent.js
function parent(object, path) {
  return path.length < 2 ? object : baseGet_default(object, baseSlice_default(path, 0, -1));
}
var parent_default = parent;

// node_modules/lodash-es/_baseUnset.js
function baseUnset(object, path) {
  path = castPath_default(path, object);
  object = parent_default(object, path);
  return object == null || delete object[toKey_default(last_default(path))];
}
var baseUnset_default = baseUnset;

// node_modules/lodash-es/_customOmitClone.js
function customOmitClone(value) {
  return isPlainObject_default(value) ? void 0 : value;
}
var customOmitClone_default = customOmitClone;

// node_modules/lodash-es/omit.js
var CLONE_DEEP_FLAG2 = 1;
var CLONE_FLAT_FLAG2 = 2;
var CLONE_SYMBOLS_FLAG2 = 4;
var omit = flatRest_default(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap_default(paths, function(path) {
    path = castPath_default(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject_default(object, getAllKeysIn_default(object), result);
  if (isDeep) {
    result = baseClone_default(result, CLONE_DEEP_FLAG2 | CLONE_FLAT_FLAG2 | CLONE_SYMBOLS_FLAG2, customOmitClone_default);
  }
  var length = paths.length;
  while (length--) {
    baseUnset_default(result, paths[length]);
  }
  return result;
});
var omit_default = omit;

// lib/api/app-agent/websocket.js
var AppAgentWebsocket = class _AppAgentWebsocket {
  appWebsocket;
  installedAppId;
  cachedAppInfo;
  myPubKey;
  emitter;
  constructor(appWebsocket, installedAppId, myPubKey) {
    this.appWebsocket = appWebsocket;
    this.emitter = new Emittery();
    const env = getLauncherEnvironment();
    this.installedAppId = env?.INSTALLED_APP_ID || installedAppId;
    this.myPubKey = myPubKey;
    this.appWebsocket.on("signal", (signal) => {
      if (this.containsCell(signal.cell_id)) {
        this.emitter.emit("signal", signal);
      }
    });
  }
  /**
   * Request the app's info, including all cell infos.
   *
   * @returns The app's {@link AppInfo}.
   */
  async appInfo() {
    const appInfo = await this.appWebsocket.appInfo({
      installed_app_id: this.installedAppId
    });
    this.cachedAppInfo = appInfo;
    return appInfo;
  }
  /**
   * Instance factory for creating AppAgentWebsockets.
   *
   * @param url - The `ws://` URL of the App API to connect to.
   * @param installed_app_id - ID of the App to link to.
   * @param defaultTimeout - Timeout to default to for all operations.
   * @returns A new instance of an AppAgentWebsocket.
   */
  static async connect(url, installed_app_id, defaultTimeout) {
    const appWebsocket = await AppWebsocket.connect(url, defaultTimeout);
    const appInfo = await appWebsocket.appInfo({
      installed_app_id
    });
    const appAgentWs = new _AppAgentWebsocket(appWebsocket, installed_app_id, appInfo.agent_pub_key);
    appAgentWs.cachedAppInfo = appInfo;
    return appAgentWs;
  }
  /**
   * Get a cell id by its role name or clone id.
   *
   * @param roleName - The role name or clone id of the cell.
   * @param appInfo - The app info containing all cell infos.
   * @returns The cell id or throws an error if not found.
   */
  getCellIdFromRoleName(roleName, appInfo) {
    if (isCloneId(roleName)) {
      const baseRoleName = getBaseRoleNameFromCloneId(roleName);
      if (!(baseRoleName in appInfo.cell_info)) {
        throw new Error(`No cell found with role_name ${roleName}`);
      }
      const cloneCell = appInfo.cell_info[baseRoleName].find((c) => CellType.Cloned in c && c[CellType.Cloned].clone_id === roleName);
      if (!cloneCell || !(CellType.Cloned in cloneCell)) {
        throw new Error(`No clone cell found with clone id ${roleName}`);
      }
      return cloneCell[CellType.Cloned].cell_id;
    }
    if (!(roleName in appInfo.cell_info)) {
      throw new Error(`No cell found with role_name ${roleName}`);
    }
    const cell = appInfo.cell_info[roleName].find((c) => CellType.Provisioned in c);
    if (!cell || !(CellType.Provisioned in cell)) {
      throw new Error(`No provisioned cell found with role_name ${roleName}`);
    }
    return cell[CellType.Provisioned].cell_id;
  }
  /**
   * Call a zome.
   *
   * @param request - The zome call arguments.
   * @param timeout - A timeout to override the default.
   * @returns The zome call's response.
   */
  async callZome(request, timeout) {
    if ("provenance" in request) {
      if ("role_name" in request && request.role_name) {
        throw new Error("Cannot find other agent's cells based on role name. Use cell id when providing a provenance.");
      }
    } else {
      request = {
        ...request,
        provenance: this.myPubKey
      };
    }
    if ("role_name" in request && request.role_name) {
      const appInfo = this.cachedAppInfo || await this.appInfo();
      const cell_id = this.getCellIdFromRoleName(request.role_name, appInfo);
      const zomeCallPayload = {
        ...omit_default(request, "role_name"),
        provenance: this.myPubKey,
        cell_id
      };
      return this.appWebsocket.callZome(zomeCallPayload, timeout);
    } else if ("cell_id" in request && request.cell_id) {
      return this.appWebsocket.callZome(request, timeout);
    }
    throw new Error("callZome requires a role_name or cell_id arg");
  }
  /**
   * Clone an existing provisioned cell.
   *
   * @param args - Specify the cell to clone.
   * @returns The created clone cell.
   */
  async createCloneCell(args) {
    const clonedCell = this.appWebsocket.createCloneCell({
      app_id: this.installedAppId,
      ...args
    });
    this.cachedAppInfo = void 0;
    return clonedCell;
  }
  /**
   * Enable a disabled clone cell.
   *
   * @param args - Specify the clone cell to enable.
   * @returns The enabled clone cell.
   */
  async enableCloneCell(args) {
    return this.appWebsocket.enableCloneCell({
      app_id: this.installedAppId,
      ...args
    });
  }
  /**
   * Disable an enabled clone cell.
   *
   * @param args - Specify the clone cell to disable.
   */
  async disableCloneCell(args) {
    return this.appWebsocket.disableCloneCell({
      app_id: this.installedAppId,
      ...args
    });
  }
  /**
   * Register an event listener for signals.
   *
   * @param eventName - Event name to listen to (currently only "signal").
   * @param listener - The function to call when event is triggered.
   * @returns A function to unsubscribe the event listener.
   */
  on(eventName, listener) {
    return this.emitter.on(eventName, listener);
  }
  containsCell(cellId) {
    const appInfo = this.cachedAppInfo;
    if (!appInfo) {
      return false;
    }
    for (const roleName of Object.keys(appInfo.cell_info)) {
      for (const cellInfo of appInfo.cell_info[roleName]) {
        const currentCellId = CellType.Provisioned in cellInfo ? cellInfo[CellType.Provisioned].cell_id : CellType.Cloned in cellInfo ? cellInfo[CellType.Cloned].cell_id : void 0;
        if (currentCellId && isSameCell(currentCellId, cellId)) {
          return true;
        }
      }
    }
    return false;
  }
};
var isSameCell = (cellId1, cellId2) => cellId1[0].every((byte, index) => byte === cellId2[0][index]) && cellId1[1].every((byte, index) => byte === cellId2[1][index]);

// lib/api/app/websocket.js
var import_msgpack3 = __toESM(require_dist(), 1);
var import_tweetnacl2 = __toESM(require_nacl_fast(), 1);
var AppWebsocket = class _AppWebsocket extends Emittery {
  client;
  defaultTimeout;
  overrideInstalledAppId;
  constructor(client, defaultTimeout, overrideInstalledAppId) {
    super();
    this.client = client;
    this.defaultTimeout = defaultTimeout === void 0 ? DEFAULT_TIMEOUT : defaultTimeout;
    this.overrideInstalledAppId = overrideInstalledAppId;
  }
  /**
   * Instance factory for creating AppWebsockets.
   *
   * @param url - The `ws://` URL of the App API to connect to.
   * @param defaultTimeout - Timeout to default to for all operations.
   * @returns A new instance of an AppWebsocket.
   */
  static async connect(url, defaultTimeout) {
    const env = getLauncherEnvironment();
    if (env?.APP_INTERFACE_PORT) {
      url = `ws://127.0.0.1:${env.APP_INTERFACE_PORT}`;
    }
    const wsClient = await WsClient.connect(url);
    const appWebsocket = new _AppWebsocket(wsClient, defaultTimeout, env?.INSTALLED_APP_ID);
    wsClient.on("signal", (signal) => appWebsocket.emit("signal", signal));
    return appWebsocket;
  }
  _requester = (tag, transformer) => requesterTransformer((req, timeout) => promiseTimeout(this.client.request(req), tag, timeout || this.defaultTimeout).then(catchError), tag, transformer);
  /**
   * Request the app's info, including all cell infos.
   *
   * @returns The app's {@link AppInfo}.
   */
  appInfo = this._requester("app_info", appInfoTransform(this));
  /**
   * Call a zome.
   *
   * @param request - The zome call arguments.
   * @param timeout - A timeout to override the default.
   * @returns The zome call's response.
   */
  callZome = this._requester("call_zome", callZomeTransform);
  /**
   * Clone an existing provisioned cell.
   *
   * @param args - Specify the cell to clone.
   * @returns The created clone cell.
   */
  createCloneCell = this._requester("create_clone_cell");
  /**
   * Enable a disabled clone cell.
   *
   * @param args - Specify the clone cell to enable.
   * @returns The enabled clone cell.
   */
  enableCloneCell = this._requester("enable_clone_cell");
  /**
   * Disable an enabled clone cell.
   *
   * @param args - Specify the clone cell to disable.
   */
  disableCloneCell = this._requester("disable_clone_cell");
  /**
   * Request network info about gossip status.
   */
  networkInfo = this._requester("network_info");
};
var callZomeTransform = {
  input: async (request) => {
    if ("signature" in request) {
      return request;
    }
    const signedZomeCall = isLauncher ? await signZomeCallTauri(request) : await signZomeCall(request);
    return signedZomeCall;
  },
  output: (response) => (0, import_msgpack3.decode)(response)
};
var appInfoTransform = (appWs) => ({
  input: (request) => {
    if (appWs.overrideInstalledAppId) {
      return {
        installed_app_id: appWs.overrideInstalledAppId
      };
    }
    return request;
  },
  output: (response) => response
});
var signZomeCall = async (request) => {
  const signingCredentialsForCell = getSigningCredentials(request.cell_id);
  if (!signingCredentialsForCell) {
    throw new Error(`cannot sign zome call: no signing credentials have been authorized for cell [${encodeHashToBase64(request.cell_id[0])}, ${encodeHashToBase64(request.cell_id[1])}]`);
  }
  const unsignedZomeCallPayload = {
    cap_secret: signingCredentialsForCell.capSecret,
    cell_id: request.cell_id,
    zome_name: request.zome_name,
    fn_name: request.fn_name,
    provenance: signingCredentialsForCell.signingKey,
    payload: (0, import_msgpack3.encode)(request.payload),
    nonce: await randomNonce(),
    expires_at: getNonceExpiration()
  };
  const hashedZomeCall = await hashZomeCall(unsignedZomeCallPayload);
  const signature = import_tweetnacl2.default.sign(hashedZomeCall, signingCredentialsForCell.keyPair.secretKey).subarray(0, import_tweetnacl2.default.sign.signatureLength);
  const signedZomeCall = {
    ...unsignedZomeCallPayload,
    signature
  };
  return signedZomeCall;
};

// lib/hdk/action.js
var ActionType;
(function(ActionType2) {
  ActionType2["Dna"] = "Dna";
  ActionType2["AgentValidationPkg"] = "AgentValidationPkg";
  ActionType2["InitZomesComplete"] = "InitZomesComplete";
  ActionType2["CreateLink"] = "CreateLink";
  ActionType2["DeleteLink"] = "DeleteLink";
  ActionType2["OpenChain"] = "OpenChain";
  ActionType2["CloseChain"] = "CloseChain";
  ActionType2["Create"] = "Create";
  ActionType2["Update"] = "Update";
  ActionType2["Delete"] = "Delete";
})(ActionType || (ActionType = {}));

// lib/hdk/dht-ops.js
var DhtOpType;
(function(DhtOpType2) {
  DhtOpType2["StoreRecord"] = "StoreRecord";
  DhtOpType2["StoreEntry"] = "StoreEntry";
  DhtOpType2["RegisterAgentActivity"] = "RegisterAgentActivity";
  DhtOpType2["RegisterUpdatedContent"] = "RegisterUpdatedContent";
  DhtOpType2["RegisterUpdatedRecord"] = "RegisterUpdatedRecord";
  DhtOpType2["RegisterDeletedBy"] = "RegisterDeletedBy";
  DhtOpType2["RegisterDeletedEntryAction"] = "RegisterDeletedEntryAction";
  DhtOpType2["RegisterAddLink"] = "RegisterAddLink";
  DhtOpType2["RegisterRemoveLink"] = "RegisterRemoveLink";
})(DhtOpType || (DhtOpType = {}));
function getDhtOpType(op) {
  return Object.keys(op)[0];
}
function getDhtOpAction(op) {
  const opType = getDhtOpType(op);
  const action = Object.values(op)[0][1];
  if (opType === DhtOpType.RegisterAddLink) {
    return {
      type: "CreateLink",
      ...action
    };
  }
  if (opType === DhtOpType.RegisterUpdatedContent || opType === DhtOpType.RegisterUpdatedRecord) {
    return {
      type: "Update",
      ...action
    };
  }
  if (action.author)
    return action;
  else {
    const actionType = Object.keys(action)[0];
    return {
      type: actionType,
      ...action[actionType]
    };
  }
}
function getDhtOpEntry(op) {
  return Object.values(op)[0][2];
}
function getDhtOpSignature(op) {
  return Object.values(op)[0][1];
}

// lib/utils/fake-hash.js
async function fakeEntryHash() {
  const randomBytes = await randomByteArray(36);
  return new Uint8Array([132, 33, 36, ...randomBytes]);
}
async function fakeAgentPubKey() {
  const randomBytes = await randomByteArray(36);
  return new Uint8Array([132, 32, 36, ...randomBytes]);
}
async function fakeActionHash() {
  const randomBytes = await randomByteArray(36);
  return new Uint8Array([132, 41, 36, ...randomBytes]);
}
async function fakeDnaHash() {
  const randomBytes = await randomByteArray(36);
  return new Uint8Array([132, 45, 36, ...randomBytes]);
}
export {
  ActionType,
  AdminWebsocket,
  AppAgentWebsocket,
  AppStatusFilter,
  AppWebsocket,
  CellProvisioningStrategy,
  CellType,
  CloneId,
  DhtOpType,
  GrantedFunctionsType,
  SignalType,
  WsClient,
  decodeHashFromBase64,
  encodeHashToBase64,
  fakeActionHash,
  fakeAgentPubKey,
  fakeDnaHash,
  fakeEntryHash,
  generateSigningKeyPair,
  getDhtOpAction,
  getDhtOpEntry,
  getDhtOpSignature,
  getDhtOpType,
  getNonceExpiration,
  getSigningCredentials,
  hashZomeCall,
  randomByteArray,
  randomCapSecret,
  randomNonce,
  setSigningCredentials,
  signZomeCall
};
/*! Bundled license information:

lodash-es/lodash.js:
  (**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/
//# sourceMappingURL=bundle.js.map
