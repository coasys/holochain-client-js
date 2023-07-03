import require$$0 from 'ws';
import require$$0$1 from 'crypto';

let wasm$1;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm$1.memory.buffer);
    }
    return cachedUint8Memory0;
}

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
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
    return x === undefined || x === null;
}

let cachedInt32Memory0 = new Int32Array();

function getInt32Memory0() {
    if (cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm$1.memory.buffer);
    }
    return cachedInt32Memory0;
}

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedFloat64Memory0 = new Float64Array();

function getFloat64Memory0() {
    if (cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm$1.memory.buffer);
    }
    return cachedFloat64Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {any} value
* @returns {Uint8Array}
*/
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
    } catch (e) {
        wasm$1.__wbindgen_exn_store(addHeapObject(e));
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
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
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
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
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'number' ? obj : undefined;
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
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbg_next_579e583d33566a86 = function(arg0) {
        const ret = getObject(arg0).next;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_next_aaef7c8aa5e212ac = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).next();
        return addHeapObject(ret);
    }, arguments) };
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
    imports.wbg.__wbg_get_765201544a2b6869 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_97ae9d8645dc388b = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
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

function finalizeInit(instance, module) {
    wasm$1 = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedFloat64Memory0 = new Float64Array();
    cachedInt32Memory0 = new Int32Array();
    cachedUint8Memory0 = new Uint8Array();


    return wasm$1;
}

function initSync(module) {
    const imports = getImports();

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input) {

    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

var exports$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    hashZomeCall: hashZomeCall$1,
    initSync: initSync,
    'default': init
});

const base64codes = [62,0,0,0,63,52,53,54,55,56,57,58,59,60,61,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,0,0,0,0,0,0,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];

        function getBase64Code(charCode) {
            return base64codes[charCode - 43];
        }

        function base64_decode(str) {
            let missingOctets = str.endsWith("==") ? 2 : str.endsWith("=") ? 1 : 0;
            let n = str.length;
            let result = new Uint8Array(3 * (n / 4));
            let buffer;

            for (let i = 0, j = 0; i < n; i += 4, j += 3) {
                buffer =
                    getBase64Code(str.charCodeAt(i)) << 18 |
                    getBase64Code(str.charCodeAt(i + 1)) << 12 |
                    getBase64Code(str.charCodeAt(i + 2)) << 6 |
                    getBase64Code(str.charCodeAt(i + 3));
                result[j] = buffer >> 16;
                result[j + 1] = (buffer >> 8) & 0xFF;
                result[j + 2] = buffer & 0xFF;
            }

            return result.subarray(0, result.length - missingOctets);
        }

        const wasm_code = base64_decode("AGFzbQEAAAABrAEYYAJ/fwF/YAN/f38Bf2ABfwF/YAJ/fwBgAX8AYAN/f38AYAABf2AFf39/f38AYAR/f39/AGAAAGABfwF+YAZ/f39/f38AYAR/f39/AX9gBX9/f39/AX9gBn9/f39/fwF/YAl/f39/f39+fn4AYAd/f39/f39/AX9gA35/fwF/YAV/f35/fwBgBH9+f38AYAV/f3x/fwBgBH98f38AYAV/f31/fwBgBH99f38AArAJJAN3YmcaX193YmluZGdlbl9vYmplY3RfZHJvcF9yZWYABAN3YmcVX193YmluZGdlbl9zdHJpbmdfZ2V0AAMDd2JnFF9fd2JpbmRnZW5faXNfb2JqZWN0AAIDd2JnFF9fd2JpbmRnZW5fZXJyb3JfbmV3AAADd2JnEl9fd2JpbmRnZW5faXNfbnVsbAACA3diZxdfX3diaW5kZ2VuX2lzX3VuZGVmaW5lZAACA3diZxZfX3diaW5kZ2VuX2Jvb2xlYW5fZ2V0AAIDd2JnFV9fd2JpbmRnZW5fbnVtYmVyX2dldAADA3diZx1fX3diZ19TdHJpbmdfOWFhMTdkNjI0OGQ1MTlhNQADA3diZxpfX3diZ19nZXRfNzIzZjgzYmEwYzM0ODcxYQAAA3diZxtfX3diaW5kZ2VuX29iamVjdF9jbG9uZV9yZWYAAgN3YmcWX193YmluZGdlbl9pc19mdW5jdGlvbgACA3diZxtfX3diZ19uZXh0XzU3OWU1ODNkMzM1NjZhODYAAgN3YmcbX193YmdfbmV4dF9hYWVmN2M4YWE1ZTIxMmFjAAIDd2JnG19fd2JnX2RvbmVfMWI3M2IwNjcyZTE1ZjIzNAACA3diZxxfX3diZ192YWx1ZV8xY2NjMzZiYzAzNDYyZDcxAAIDd2JnH19fd2JnX2l0ZXJhdG9yXzZmOWQ0ZjI4ODQ1ZjQyNmMABgN3YmcaX193YmdfZ2V0Xzc2NTIwMTU0NGEyYjY4NjkAAAN3YmcbX193YmdfY2FsbF85N2FlOWQ4NjQ1ZGMzODhiAAADd2JnFV9fd2JpbmRnZW5fc3RyaW5nX25ldwAAA3diZx5fX3diZ19pc0FycmF5XzI3YzQ2YzY3ZjQ5OGUxNWQAAgN3YmctX193YmdfaW5zdGFuY2VvZl9BcnJheUJ1ZmZlcl9lNWU0OGY0NzYyYzU2MTBiAAIDd2JnHV9fd2JnX3ZhbHVlc19lNDI2NzFhY2JmMTFlYzA0AAIDd2JnGl9fd2JnX25ld184ZDJhZjAwYmMxZTMyOWVlAAADd2JnJF9fd2JnX2lzU2FmZUludGVnZXJfZGZhMDU5M2U4ZDdhYzM1YQACA3diZx1fX3diZ19idWZmZXJfM2YzZDc2NGQ0NzQ3ZDU2NAACA3diZxpfX3diZ19uZXdfOGMzZjAwNTIyNzJhNDU3YQACA3diZxpfX3diZ19zZXRfODNkYjk2OTBmOTM1M2U3OQAFA3diZx1fX3diZ19sZW5ndGhfOWUxYWUxOTAwY2IwZmJkNQACA3diZyxfX3diZ19pbnN0YW5jZW9mX1VpbnQ4QXJyYXlfOTcxZWVkYTY5ZWI3NTAwMwACA3diZxpfX3diZ19uZXdfYWJkYTc2ZTg4M2JhOGE1ZgAGA3diZxxfX3diZ19zdGFja182NTgyNzlmZTQ0NTQxY2Y2AAMDd2JnHF9fd2JnX2Vycm9yX2Y4NTE2NjdhZjcxYmNmYzYAAwN3YmcXX193YmluZGdlbl9kZWJ1Z19zdHJpbmcAAwN3YmcQX193YmluZGdlbl90aHJvdwADA3diZxFfX3diaW5kZ2VuX21lbW9yeQAGA9IB0AECAAQBAAABAwUOCAEBAAMFAQMDAQAPCwALAhAAAAARAAEDBAAGAwIHAAACAgAFBQUDDAcICAMCAwsDAAMAAwIGBwABAAAFAAADBQAAAAADAAMAAAAAAAAAAAQJAQEBAQUDAA0JCQMCBAAAAAAAAwUFAwQEBAEFAA4DABIUBxYNAwQIAAECAAIDAAEAAAwAAwIAAAcAAAQAAAMCAAICAgICAgMCAAAFBQUAAwEAAAIAAAkAAAICAgIDAQABAQEAAAAAAAAAAAIGAAACAgMKCgoEBAcBcAGJAYkBBQMBABEGCQF/AUGAgMAACweSAQcGbWVtb3J5AgAMaGFzaFpvbWVDYWxsAFsRX193YmluZGdlbl9tYWxsb2MAigESX193YmluZGdlbl9yZWFsbG9jAJgBH19fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIA0QEPX193YmluZGdlbl9mcmVlALIBFF9fd2JpbmRnZW5fZXhuX3N0b3JlALkBCfABAQBBAQuIAfMBugHiAdIB5QHkAecB4QHm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AkEoRg0CQShBKEG03sAAEGkACyADQShBtN7AABBpAAtB3t7AAEEdQbTewAAQgwEACyAAKAIAIAVqIQIgAUEfcSIHRQRAIAAgAjYCACAADwsCQCACQQFrIgNBJ00EQCACIQQgACADQQJ0akEEaigCACIGQQAgAWsiAXYiA0UNASACQSdNBEAgACACQQJ0akEEaiADNgIAIAJBAWohBAwCCyACQShBtN7AABBpAAsgA0EoQbTewAAQaQALAkAgAiAFQQFqIghLBEAgAUEfcSEBIAJBAnQgAGpBBGshAwNAIAJBAmtBKE8NAiADQQRqIAYgB3QgAygCACIGIAF2cjYCACADQQRrIQMgCCACQQFrIgJJDQALCyAAIAVBAnRqQQRqIgEgASgCACAHdDYCACAAIAQ2AgAgAA8LQX9BKEG03sAAEGkAC5EHAQV/IAAQ7gEiACAAENcBIgIQ6wEhAQJAAkACQCAAENgBDQAgACgCACEDAkAgABDEAUUEQCACIANqIQIgACADEOwBIgBBqOrAACgCAEcNASABKAIEQQNxQQNHDQJBoOrAACACNgIAIAAgAiABEJkBDwsgAiADakEQaiEADAILIANBgAJPBEAgABBGDAELIABBDGooAgAiBCAAQQhqKAIAIgVHBEAgBSAENgIMIAQgBTYCCAwBC0GQ58AAQZDnwAAoAgBBfiADQQN2d3E2AgALAkAgARC9AQRAIAAgAiABEJkBDAELAkACQAJAQazqwAAoAgAgAUcEQCABQajqwAAoAgBHDQFBqOrAACAANgIAQaDqwABBoOrAACgCACACaiIBNgIAIAAgARCrAQ8LQazqwAAgADYCAEGk6sAAQaTqwAAoAgAgAmoiATYCACAAIAFBAXI2AgQgAEGo6sAAKAIARg0BDAILIAEQ1wEiAyACaiECAkAgA0GAAk8EQCABEEYMAQsgAUEMaigCACIEIAFBCGooAgAiAUcEQCABIAQ2AgwgBCABNgIIDAELQZDnwABBkOfAACgCAEF+IANBA3Z3cTYCAAsgACACEKsBIABBqOrAACgCAEcNAkGg6sAAIAI2AgAMAwtBoOrAAEEANgIAQajqwABBADYCAAtByOrAACgCACABTw0BQQhBCBCvASEAQRRBCBCvASEBQRBBCBCvASEDQQBBEEEIEK8BQQJ0ayICQYCAfCADIAAgAWpqa0F3cUEDayIAIAAgAksbRQ0BQazqwAAoAgBFDQFBCEEIEK8BIQBBFEEIEK8BIQFBEEEIEK8BIQJBAAJAQaTqwAAoAgAiBCACIAEgAEEIa2pqIgJNDQBBrOrAACgCACEBQbjqwAAhAAJAA0AgASAAKAIATwRAIAAQxgEgAUsNAgsgACgCCCIADQALQQAhAAsgABDZAQ0AIABBDGooAgAaDAALQQAQSGtHDQFBpOrAACgCAEHI6sAAKAIATQ0BQcjqwABBfzYCAA8LIAJBgAJJDQEgACACEEVB0OrAAEHQ6sAAKAIAQQFrIgA2AgAgAA0AEEgaDwsPCyACQXhxQZjnwABqIQECf0GQ58AAKAIAIgNBASACQQN2dCICcQRAIAEoAggMAQtBkOfAACACIANyNgIAIAELIQMgASAANgIIIAMgADYCDCAAIAE2AgwgACADNgIIC40HAQh/AkACQCAAKAIIIgpBAUcgACgCECIDQQFHcUUEQAJAIANBAUcNACABIAJqIQkgAEEUaigCAEEBaiEHIAEhBANAAkAgBCEDIAdBAWsiB0UNACADIAlGDQICfyADLAAAIgVBAE4EQCAFQf8BcSEFIANBAWoMAQsgAy0AAUE/cSEIIAVBH3EhBCAFQV9NBEAgBEEGdCAIciEFIANBAmoMAQsgAy0AAkE/cSAIQQZ0ciEIIAVBcEkEQCAIIARBDHRyIQUgA0EDagwBCyAEQRJ0QYCA8ABxIAMtAANBP3EgCEEGdHJyIgVBgIDEAEYNAyADQQRqCyIEIAYgA2tqIQYgBUGAgMQARw0BDAILCyADIAlGDQAgAywAACIEQQBOIARBYElyIARBcElyRQRAIARB/wFxQRJ0QYCA8ABxIAMtAANBP3EgAy0AAkE/cUEGdCADLQABQT9xQQx0cnJyQYCAxABGDQELAkACQCAGRQ0AIAIgBk0EQEEAIQMgAiAGRg0BDAILQQAhAyABIAZqLAAAQUBIDQELIAEhAwsgBiACIAMbIQIgAyABIAMbIQELIApFDQIgAEEMaigCACEGAkAgAkEQTwRAIAEgAhApIQQMAQsgAkUEQEEAIQQMAQsgAkEDcSEFAkAgAkEBa0EDSQRAQQAhBCABIQMMAQsgAkF8cSEHQQAhBCABIQMDQCAEIAMsAABBv39KaiADLAABQb9/SmogAywAAkG/f0pqIAMsAANBv39KaiEEIANBBGohAyAHQQRrIgcNAAsLIAVFDQADQCAEIAMsAABBv39KaiEEIANBAWohAyAFQQFrIgUNAAsLIAQgBkkEQCAGIARrIgQhBgJAAkACQEEAIAAtACAiAyADQQNGG0EDcSIDQQFrDgIAAQILQQAhBiAEIQMMAQsgBEEBdiEDIARBAWpBAXYhBgsgA0EBaiEDIABBHGooAgAhBCAAQRhqKAIAIQUgACgCBCEAAkADQCADQQFrIgNFDQEgBSAAIAQoAhARAABFDQALQQEPC0EBIQMgAEGAgMQARg0CIAUgASACIAQoAgwRAQANAkEAIQMDQCADIAZGBEBBAA8LIANBAWohAyAFIAAgBCgCEBEAAEUNAAsgA0EBayAGSQ8LDAILIAAoAhggASACIABBHGooAgAoAgwRAQAhAwsgAw8LIAAoAhggASACIABBHGooAgAoAgwRAQAL0wgBAX8jAEEwayICJAACfwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCAALQAAQQFrDhEBAgMEBQYHCAkKCwwNDg8QEQALIAIgAC0AAToACCACQSxqQQE2AgAgAkICNwIcIAJBpKHAADYCGCACQdsANgIUIAIgAkEQajYCKCACIAJBCGo2AhAgASACQRhqEGsMEQsgAiAAKQMINwMIIAJBLGpBATYCACACQgI3AhwgAkGIocAANgIYIAJB3AA2AhQgAiACQRBqNgIoIAIgAkEIajYCECABIAJBGGoQawwQCyACIAApAwg3AwggAkEsakEBNgIAIAJCAjcCHCACQYihwAA2AhggAkHdADYCFCACIAJBEGo2AiggAiACQQhqNgIQIAEgAkEYahBrDA8LIAIgACsDCDkDCCACQSxqQQE2AgAgAkICNwIcIAJB7KDAADYCGCACQd4ANgIUIAIgAkEQajYCKCACIAJBCGo2AhAgASACQRhqEGsMDgsgAiAAKAIENgIIIAJBLGpBATYCACACQgI3AhwgAkHMoMAANgIYIAJB3wA2AhQgAiACQRBqNgIoIAIgAkEIajYCECABIAJBGGoQawwNCyACIAApAgQ3AwggAkEsakEBNgIAIAJCATcCHCACQbigwAA2AhggAkHgADYCFCACIAJBEGo2AiggAiACQQhqNgIQIAEgAkEYahBrDAwLIAJBLGpBADYCACACQdiewAA2AiggAkIBNwIcIAJBqKDAADYCGCABIAJBGGoQawwLCyACQSxqQQA2AgAgAkHYnsAANgIoIAJCATcCHCACQZSgwAA2AhggASACQRhqEGsMCgsgAkEsakEANgIAIAJB2J7AADYCKCACQgE3AhwgAkGAoMAANgIYIAEgAkEYahBrDAkLIAJBLGpBADYCACACQdiewAA2AiggAkIBNwIcIAJB7J/AADYCGCABIAJBGGoQawwICyACQSxqQQA2AgAgAkHYnsAANgIoIAJCATcCHCACQdSfwAA2AhggASACQRhqEGsMBwsgAkEsakEANgIAIAJB2J7AADYCKCACQgE3AhwgAkHEn8AANgIYIAEgAkEYahBrDAYLIAJBLGpBADYCACACQdiewAA2AiggAkIBNwIcIAJBuJ/AADYCGCABIAJBGGoQawwFCyACQSxqQQA2AgAgAkHYnsAANgIoIAJCATcCHCACQayfwAA2AhggASACQRhqEGsMBAsgAkEsakEANgIAIAJB2J7AADYCKCACQgE3AhwgAkGYn8AANgIYIAEgAkEYahBrDAMLIAJBLGpBADYCACACQdiewAA2AiggAkIBNwIcIAJBgJ/AADYCGCABIAJBGGoQawwCCyACQSxqQQA2AgAgAkHYnsAANgIoIAJCATcCHCACQeiewAA2AhggASACQRhqEGsMAQsgASAAKAIEIABBCGooAgAQrQELIAJBMGokAAvYBgEIfwJAAkAgAEEDakF8cSICIABrIgQgAUsgBEEES3INACABIARrIgZBBEkNACAGQQNxIQdBACEBAkAgACACRg0AIARBA3EhAwJAIAIgAEF/c2pBA0kEQCAAIQIMAQsgBEF8cSEIIAAhAgNAIAEgAiwAAEG/f0pqIAIsAAFBv39KaiACLAACQb9/SmogAiwAA0G/f0pqIQEgAkEEaiECIAhBBGsiCA0ACwsgA0UNAANAIAEgAiwAAEG/f0pqIQEgAkEBaiECIANBAWsiAw0ACwsgACAEaiEAAkAgB0UNACAAIAZBfHFqIgIsAABBv39KIQUgB0EBRg0AIAUgAiwAAUG/f0pqIQUgB0ECRg0AIAUgAiwAAkG/f0pqIQULIAZBAnYhBCABIAVqIQMDQCAAIQEgBEUNAiAEQcABIARBwAFJGyIFQQNxIQYgBUECdCEIAkAg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AQECfyMAQSBrIgIkACACIAA2AgwgAiABKAIYQajfwABBESABQRxqKAIAKAIMEQEAOgAYIAIgATYCECACQQA6ABkgAkEANgIUIAJBEGogAkEMakGY38AAEEQhAAJ/IAItABgiASACKAIUIgNFDQAaIAFB/wFxIQFBASABDQAaIAAoAgAhAAJAIANBAUcNACACLQAZRQ0AIAAtAABBBHENAEEBIAAoAhhBgsvAAEEBIABBHGooAgAoAgwRAQANARoLIAAoAhhB7MfAAEEBIABBHGooAgAoAgwRAQALIAJBIGokAEH/AXFBAEcL4QEAAkAgASgCAEECRgRAIAAgAikCADcCACAAQQhqIAJBCGooAgA2AgAMAQsgACABKQIANwIAIABBCGogAUEIaigCADYCAAJAAkACQAJAIAIoAgAOAwABBAELIAItAARBA0cNAyACQQhqIgAoAgAiASgCACABKAIEKAIAEQQAIAEoAgQiAkEEaigCAA0BDAILIAItAARBA0cNAiACQQhqIgAoAgAiASgCACABKAIEKAIAEQQAIAEoAgQiAkEEaigCAEUNAQsgAkEIaigCABogASgCABAmIAAoAgAhAQsgARAmCwvOAQECfyMAQSBrIgMkAAJAAkAgASABIAJqIgFLDQAgAEEEaigCACICQQF0IgQgASABIARJGyIBQQggAUEISxsiAUF/c0EfdiEEAkAgAgRAIANBATYCGCADIAI2AhQgAyAAKAIANgIQDAELIANBADYCGAsgAyABIAQgA0EQahBXIAMoAgQhAiADKAIARQRAIAAgAjYCACAAQQRqIAE2AgAMAgsgA0EIaigCACIAQYGAgIB4Rg0BIABFDQAgAiAAENsBAAsQiAEACyADQSBqJAALzgEBAn8jAEEgayIDJAACQAJAIAEgASACaiIBSw0AIABBBGooAgAiAkEBdCIEIAEgASAESRsiAUEIIAFBCEsbIgFBf3NBH3YhBAJAIAIEQCADQQE2AhggAyACNgIUIAMgACgCADYCEAwBCyADQQA2AhgLIAMgASAEIANBEGoQWCADKAIEIQIgAygCAEUEQCAAIAI2AgAgAEEEaiABNgIADAILIANBCGooAgAiAEGBgICAeEYNASAARQ0AIAIgABDbAQALEIgBAAsgA0EgaiQAC8wBAQN/IwBBIGsiAiQAAkACQCABQQFqIgFFDQAgAEEEaigCACIDQQF0IgQgASABIARJGyIBQQggAUEISxsiAUF/c0EfdiEEAkAgAwRAIAJBATYCGCACIAM2AhQgAiAAKAIANgIQDAELIAJBADYCGAsgAiABIAQgAkEQahBXIAIoAgQhAyACKAIARQRAIAAgAzYCACAAQQRqIAE2AgAMAgsgAkEIaigCACIAQYGAgIB4Rg0BIABFDQAgAyAAENsBAAsQiAEACyACQSBqJAAL0gEBAX8jAEEQayIEJAAgBCAAKAIYIAEgAiAAQRxqKAIAKAIMEQEAOgAIIAQgADYCACAEIAJFOgAJIARBADYCBCAEIANB6JzAABBEIQACfyAELQAIIgEgBCgCBCICRQ0AGkEBIAENABogACgCACEAAkAgAkEBRw0AIAQtAAlFDQAgAC0AAEEEcQ0AQQEgACgCGEGCy8AAQQEgAEEcaigCACgCDBEBAA0BGgsgACgCGEHsx8AAQQEgAEEcaigCACgCDBEBAAsgBEEQaiQAQf8BcUEARwuIAgECfyMAQSBrIgUkAEGE58AAQYTnwAAoAgAiBkEBajYCAAJAAkAgBkEASA0AQdzqwABB3OrAACgCAEEBaiIGNgIAIAZBAksNACAFIAQ6ABggBSADNgIUIAUgAjYCECAFQcinwAA2AgwgBUHYocAANgIIQfTmwAAoAgAiAkEASA0AQfTmwAAgAkEBaiICNgIAQfTmwABB/ObAACgCAAR/IAUgACABKAIQEQMAIAUgBSkDADcDCEH85sAAKAIAIAVBCGpBgOfAACgCACgCFBEDAEH05sAAKAIABSACC0EBazYCACAGQQFLDQAgBA0BCwALIwBBEGsiAiQAIAIgATYCDCACIAA2AggAC7oBAAJAIAIEQAJAAkACfwJAAkAgAUEATgRAIAMoAggNASABDQJBASECDAQLDAYLIAMoAgQiAkUEQCABRQRAQQEhAgwECyABQQEQuAEMAgsgAygCACACQQEgARCwAQwBCyABQQEQuAELIgJFDQELIAAgAjYCBCAAQQhqIAE2AgAgAEEANgIADwsgACABNgIEIABBCGpBATYCACAAQQE2AgAPCyAAIAE2AgQLIABBCGpBADYCACAAQQE2AgALrQEBAX8CQCACBEACfwJAAkACQCABQQBOBEAgAygCCEUNAiADKAIEIgQNASABDQMgAgwE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ajYCDCACIAEQzQEgAiAAQQJqNgIMIAIgARDNASACLQAEBH9BAQUgAigCACIAQRhqKAIAQYXLwABBASAAQRxqKAIAKAIMEQEACyACQRBqJAALbQEBfyMAQTBrIgMkACADIAI2AgQgAyABNgIAIANBHGpBAjYCACADQSxqQQs2AgAgA0ICNwIMIANBgIXAADYCCCADQQw2AiQgAyAANgIgIAMgA0EgajYCGCADIAM2AiggA0EIahBaIANBMGokAAtbAQJ/IwBBIGsiAiQAIAFBHGooAgAhAyABKAIYIAJBGGogACgCACIAQRBqKQIANwMAIAJBEGogAEEIaikCADcDACACIAApAgA3AwggAyACQQhqEDAgAkEgaiQAC2wBBH8jAEEgayICJABBASEDAkAgACABEEMNACABQRxqKAIAIQQgASgCGCACQQA2AhwgAkHIr8AANgIYIAJCATcCDCACQfDHwAA2AgggBCACQQhqEDANACAAQQRqIAEQQyEDCyACQSBqJAAgAwttAQF/IwBBMGsiAyQAIAMgATYCBCADIAA2AgAgA0EcakECNgIAIANBLGpBDjYCACADQgI3AgwgA0G4yMAANgIIIANBDjYCJCADIANBIGo2AhggAyADNgIoIAMgA0EEajYCICADQQhqIAIQiQEAC1YBAn8jAEEgayICJAAgAUEcaigCACEDIAEoAhggAkEYaiAAQRBqKQIANwMAIAJBEGogAEEIaikCADcDACACIAApAgA3AwggAyACQQhqEDAgAkEgaiQAC1YBAn8jAEEgayICJAAgAEEcaigCACEDIAAoAhggAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAyACQQhqEDAgAkEgaiQAC2YBAX8jAEEgayICJAAgAkH4ocAANgIEIAIgADYCACACQRhqIAFBEGopAgA3AwAgAkEQaiABQQhqKQIANwMAIAIgASkCADcDCCACQYyiwAAgAkEEakGMosAAIAJBCGpBpKnAABA8AAtjAQF/IwBBIGsiAyQAIANBqKrAADYCBCADIAA2AgAgA0EYaiABQRBqKQIANwMAIANBEGogAUEIaikCADcDACADIAEpAgA3AwggA0H8ocAAIANBBGpB/KHAACADQQhqIAIQPAALWQEBfyMAQSBrIgIkACACIAAoAgA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakHAj8AAIAJBCGoQMCACQSBqJAALWQEBfyMAQSBrIgIkACACIAAoAgA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakHYkMAAIAJBCGoQMCACQSBqJAALWQEBfyMAQSBrIgIkACACIAAoAgA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakHglcAAIAJBCGoQMCACQSBqJAALWQEBfyMAQSBrIgIkACACIAAoAgA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakHAocAAIAJBCGoQMCACQSBqJAALaAAjAEEwayIBJABBsObAAC0AAARAIAFBHGpBATYCACABQgI3AgwgAUHApcAANgIIIAFBDjYCJCABIAA2AiwgASABQSBqNgIYIAEgAUEsajYCICABQQhqQeilwAAQiQEACyABQTBqJAALWQEBfyMAQSBrIgIkACACIAAoAgA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakH8rcAAIAJBCGoQMCACQSBqJAALaAECfyABKAIAIQMCQAJAAkAgAUEIaigCACIBRQRAQQEhAgwBCyABQQBIDQEgAUEBELgBIgJFDQILIAIgAyABEOABIQIgACABNgIIIAAgATYCBCAAIAI2AgAPCxCIAQALIAFBARDbAQALWQEBfyMAQSBrIgIkACACIAAoAgA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakGAzcAAIAJBCGoQMCACQSBqJAALVgEBfyMAQSBrIgIkACACIAA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakHAj8AAIAJBCGoQMCACQSBqJAALVgEBfyMAQSBrIgIkACACIAA2AgQgAkEYaiABQRBqKQIANwMAIAJBEGogAUEIaikCADcDACACIAEpAgA3AwggAkEEakHYkMAAIAJBCGoQMCACQSBq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ICJBAWsQ3gEaQTALIQAgM0EQdEGAgARqQRB1IjMgOkwgIiAxT3INAyAiIDlqIAA6AAAgIkEBaiEiDAMLIBxBKEG03sAAEGkACyAAIDFBiLfAABBpAAsgIiAxQZi3wAAQygEACyAiIDFNDQAgIiAxQai3wAAQygEACyA7IDM7AQggOyAiNgIEIDsgOTYCACAhQdAGaiQADAULIABBKEG03sAAEMoBAAsgHkEoQbTewAAQygEACyAgQShBtN7AABDKAQALQcTewABBGkG03sAAEIMBAAsgI0HICGogI0GYCGooAgA2AgAgIyAjKQOQCDcDwAgLIDogIy4ByAgiAEgEQCAjQQhqICMoAsAIICMoAsQIIAAgNiAjQZAIahA6ICMoAgwhACAjKAIIDAQLQQIhACAjQQI7AZAIIDYEQCAjQaAIaiA2NgIAICNBADsBnAggI0ECNgKYCCAjQajHwAA2ApQIICNBkAhqDAQLQQEhACAjQQE2ApgIICNBrcfAADYClAggI0GQCGoMAwtBAiEAICNBAjsBkAggNgRAICNBoAhqIDY2AgAgI0EAOwGcCCAjQQI2ApgIICNBqMfAADYClAggI0GQCGoMAwtBASEAICNBATYCmAggI0Gtx8AANgKUCCAjQZAIagwCCyAjQQM2ApgIICNBrsfAADYClAggI0ECOwGQCCAjQZAIagwBCyAjQQM2ApgIICNBscfAADYClAggI0ECOwGQCEEBIQBByK/AACE9ICNBkAhqCyEBICNBzAhqIAA2AgAgIyABNgLICCAjIEE2AsQIICMgPTYCwAggPCAjQcAIahAxICNB8AhqJAAMAQtBtMfAAEElQdzHwAAQgwEACw8LIAEgGiEBIwBBgAFrIickACBFvSEEAkAgRSBFYgRAQQIhAAwBCyAEQv////////8HgyIFQoCAgICAgIAIhCAEQgGGQv7///////8PgyAEQjSIp0H/D3EiKBsiA0IBgyEHQQMhAAJAAkACQEEBQQJBBCAEQoCAgICAgID4/wCDIgJQIhobIAJCgICAgICAgPj/AFEbQQNBBCAaGyAFUBtBAmsOAwABAgMLQQQhAAwCCyAoQbMIayEsIAdQIQBCASEGDAELQoCAgICAgIAgIANCAYYgA0KAgICAgICACFEiGhshA0ICQgEgGhshBiAHUCEAQct3Qcx3IBobIChqISwLICcgLDsBeCAnIAY3A3AgJ0IBNwNoICcgAzcDYCAnIAA6AHoCfyAAQQJrQf8BcSIAQQMgAEEDSRsiGgRAQavHwABBrMfAAEHIr8AAIAEbIARCAFMbISxBASEAQQEgBEI/iKcgARshPQJAAkACQCAaQQJrDgIBAAILICdBIGohJCAnQQ9qIR8jAEEwayIpJAACQAJAAkACQAJAAkACQCAnQeAAaiIAKQMAIgVQRQRAIAApAwgiA1BFBEAgACkDECICUEUEQCAFIAIgBXwiAlgEQCAFIAUgA30iBloEQAJAAkAgAkL//////////x9YBEAgKSAALwEYIho7AQggKSAGNwMAIBogGkEgayAaIAJCgICAgBBUIgEbIgBBEGsgACACQiCGIAIgARsiAkKAgICAgIDAAFQiARsiAEEIayAAIAJCEIYgAiABGyICQoCAgICAgICAAVQiARsiAEEEayAAIAJCCIYgAiABGyICQoCAgICAgICAEFQiARsiAEECayAAIAJCBIYgAiABGyICQoCAgICAgICAwABUIgAbIAJCAoYgAiAAGyIEQj+Hp0F/c2oiAWtBEHRBEHUiAEEASA0CIClCfyAArSICiCIDIAaDNwMQIAMgBlQNDSApIBo7AQggKSAFNwMAICkgAyAFgzcDECADIAVUDQ1BoH8gAWtBEHRBEHVB0ABsQbCnBWpBzhBtIgBB0QBPDQEgAEEEdCIAQbi3wABqKQMAIgNC/////w+DIg0gBSACQj+DIgeGIgJCIIgiFX4iBUIgiCIJIANCIIgiDyAVfnwgDyACQv////8PgyIDfiICQiCIIhB8IAVC/////w+DIAMgDX5CIIh8IAJC/////w+DfEKAgICACHxCIIghFkIBQQAgASAAQcC3wABqLwEAamtBP3GtIgiGIgxCAX0hDiANIAYgB4YiAkIgiCIFfiIDQv////8PgyANIAJC/////w+DIgJ+QiCIfCACIA9+IgJC/////w+DfEKAgICACHxCIIghESAFIA9+IQsgAkIgiCEGIANCIIghByAAQcK3wABqLwEAIRoCfwJAAkAgDyAEIARCf4VCP4iGIgJCIIgiF34iBCANIBd+IgVCIIgiGHwgDyACQv////8PgyIDfiICQiCIIhl8IAVC/////w+DIAMgDX5CIIh8IAJC/////w+DfEKAgICACHxC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AiQgJ0ECOwEgQQEhAEHIr8AAISwgJ0EgagshASAnQdwAaiAANgIAICcgATYCWCAnID02AlQgJyAsNgJQICdB0ABqEDEgJ0GAAWokAA8LIBtBKEG03sAAEMoBAAsgG0EoQbTewAAQaQALIBxBKEG03sAAEMoBAAs5AAJAAn8gAkGAgMQARwRAQQEgACACIAEoAhARAAANARoLIAMNAUEACw8LIAAgAyAEIAEoAgwRAQALQAEBfyMAQSBrIgAkACAAQRxqQQA2AgAgAEHYocAANgIYIABCATcCDCAAQcCkwAA2AgggAEEIakHIpMAAEIkBAAtAAQF/IwBBIGsiACQAIABBHGpBADYCACAAQZSuwAA2AhggAEIBNwIMIABBxK7AADYCCCAAQQhqQcyuwAAQiQEAC98CAQJ/IwBBIGsiAiQAIAJBAToAGCACIAE2AhQgAiAANgIQIAJBhMnAADYCDCACQcivwAA2AggjAEEQayIBJAACQCACQQhqIgAoAgwiAgRAIAAoAggiA0UNASABIAI2AgggASAANgIEIAEgAzYCACMAQRBrIgAkACAAQQhqIAFBCGooAgA2AgAgACABKQIANwMAIwBBEGsiASQAIAAoAgAiAkEUaigCACEDAkACfwJAAkAgAigCBA4CAAEDCyADDQJBACECQdihwAAMAQsgAw0BIAIoAgAiAygCBCECIAMoAgALIQMgASACNgIEIAEgAzYCACABQbSnwAAgACgCBCIBKAIIIAAoAgggAS0AEBBWAAsgAUEANgIEIAEgAjYCACABQaCnwAAgACgCBCIBKAIIIAAoAgggAS0AEBBWAAtBnKLAAEErQfCmwAAQgwEAC0GcosAAQStB4KbAABCDAQALMwACQCAAQfz///8HSw0AIABFBEBBBA8LIAAgAEH9////B0lBAnQQuAEiAEUNACAADwsACz0BAX8gACgCACEBAkAgAEEEai0AAA0AQYTnwAAoAgBB/////wdxRQ0AEOoBDQAgAUEBOgABCyABQQA6AAALjB0CFH8EfiMAQRBrIhMkACATIAE2AgwgEyAANgIIAn8jAEEgayIJJAAgE0EIaiIAQQRqKAIAIQ0gACgCACELAkBBAEHYksAAKAIAEQIAIhEEQCARKAIADQEgEUF/NgIAIBFBBGoiCEEEaigCACICQQxrIQMgDQR+IA1BB3EhAQJAIA1BAWtBB0kEQEKlxoihyJyn+UshFiALIQAMAQsgDUF4cSEEQqXGiKHInKf5SyEWIAshAANAIAAxAAcgADEABiAAMQAFIAAxAAQgADEAAyAAMQACIAAxAAEgFiAAMQAAhUKzg4CAgCB+hUKzg4CAgCB+hUKzg4CAgCB+hUKzg4CAgCB+hUKzg4CAgCB+hUKzg4CAgCB+hUKzg4CAgCB+hUKzg4CAgCB+IRYgAEEIaiEAIARBCGsiBA0ACwsgAQRAA0AgFiAAMQAAhUKzg4CAgCB+IRYgAEEBaiEAIAFBAWsiAQ0ACwsgFkL/AYVCs4OAgIAgfgVC7taLsMjJnLKvfwsiGEIZiEL/AINCgYKEiJCgwIABfiEZIBinIQAgCCgCACEBAkADQAJAIAIgACABcSIAaikAACIXIBmFIhZCf4UgFkKBgoSIkKDAgAF9g0KAgYKEiJCgwIB/gyIWUA0AA0ACQCANIANBACAWeqdBA3YgAGogAXFrIgRBDGxqIgdBBGooAgBGBEAgBygCACALIA0Q3wFFDQELIBZCAX0gFoMiFlBFDQEMAgsLIAkgCzYCBCAJQRBqIAg2AgAgCUEIaiANNgIAIAlBDGogAiAEQQxsajYCACAJQQA2AgAMAgsgFyAXQgGGg0KAgYKEiJCgwIB/g1AEQCAAIAVBCGoiBWohAAwBCwsgCCgCCEUEQEEAIQAjAEEwayIPJAACQCAIQQxqKAIAIhBBAWoiASAQSQRAEH4gDygCDBoMAQsCQAJAAn8CQCAIKAIAIgwgDEEBaiIHQQN2QQdsIAxBCEkbIhVBAXYgAUkEQCABIBVBAWoiACAAIAFJGyIAQQhJDQFBfyAAQQN0QQduQQFrZ3ZBAWogACAAQf////8BcUYNAhoQfiAPKAIsQYGAgIB4Rw0FIA8oAigMAgsgCEEEaigCACEEQQAhAQNAAkACfyAAQQFxBEAgAUEHaiIAIAFJIAAgB09yDQIgAUEIagwBCyABIAdJIgJFDQEgAiABIgBqCyEBIAAgBGoiACAAKQMAIhZCf4VCB4hCgYKEiJCgwIABgyAWQv/+/fv379+//wCEfDcDAEEBIQAMAQsLAkACQCAHQQhPBEAgBCAHaiAEKQAANwAADAELAkACQAJ/AkAgByIDIARBCGoiAiAEIgBrSwRAIAAgA2ohBSACIANqIQEgA0EPSw0BIAIMAgsgA0EPTQRAIAIhAQwDCyACQQAgAmtBA3EiBWohBiAFBEAgAiEBIAAhAgNAIAEgAi0AADoAACACQQFqIQIgAUEBaiIBIAZJDQALCyAGIAMgBWsiA0F8cSIKaiEBAkAgACAFaiIFQQNxIgIEQCAKQQBMDQEgBUF8cSIOQQRqIQBBACACQQN0IhJrQRhxIRQgDigCACECA0AgBiACIBJ2IAAoAgAiAiAUdHI2AgAgAEEEaiEAIAZBBGoiBiABSQ0ACwwBCyAKQQBMDQAgBSEAA0AgBiAAKAIANgIAIABBBGohACAGQQRqIgYgAUkNAAsLIANBA3EhAyAFIApqIQAMAgsgAUF8cSECQQAgAUEDcSIKayEOIAoEQCAAIANqQQFrIQYDQCABQQFrIgEgBi0AADoAACAGQQFrIQYgASACSw0ACwsgAiADIAprIgpBfHEiA2shAUEAIANrIQMCQCAFIA5qIgVBA3EiBgRAIANBAE4NASAFQXxxIg5BBGshAEEAIAZBA3QiEmtBGHEhFCAOKAIAIQYDQCACQQRrIgIgBiAUdCAAKAIAIgYgEnZyNgIAIABBBGshACABIAJJDQALDAELIANBAE4NACAAIApqQQRrIQADQCACQQRrIgIgACgCADYCACAAQQRrIQAgASACSQ0ACwsgCkEDcSIARQ0CIAMgBWohBSABIABrCyECIAVBAWshAANAIAFBAWsiASAALQAAOgAAIABBAWshACABIAJLDQALDAELIANFDQAgASADaiECA0AgASAALQAAOgAAIABBAWohACABQQFqIgEgAkkNAAsLIAdFDQELIARBDGshDkEAIQEDQAJAIAQgASICaiIFLQAAQYABRw0AIA4gAkF0bGohBiAEIAJBf3NBDGxqIQcCQANAIAwgBkEEaigCACIABH4gBigCACEBIABBB3EhA0KlxoihyJyn+UshFgJAIABBAWtBB0kEQCABIQAMAQsgAEF4cSEKA0AgATEAByABMQAGIAExAAUgATEABCABMQADIAExAAIgATEAASAWIAExAACFQrODgICAIH6FQrODgICAIH6FQrODgICAIH6FQrODgICAIH6FQrODgICAIH6FQrODgICAIH6FQrODgICAIH6FQrODgICAIH4hFiABQQhqIgAhASAKQQhrIgoNAAsLIAMEQANAIBYgADEAAIVCs4OAgIAgfiEWIABBAWohACADQQFrIgMNAAsLIBZC/wGFQrODgICAIH4FQu7Wi7DIyZyyr38LpyIKcSIDIQAgAyAEaikAAEKAgYKEiJCgwIB/gyIWUARAQQghASADIQADQCAAIAFqIQAgAUEIaiEBIAQgACAMcSIAaikAAEKAgYKEiJCgwIB/gyIWUA0ACwsgBCAWeqdBA3YgAGogDHEiAGosAABBAE4EQCAEKQMAQoCBgoSIkKDAgH+DeqdBA3YhAAsgACADayACIANrcyAMcUEITwRAIAQgAEF/c0EMbGohASAAIARqIgMtAAAgAyAKQRl2IgM6AAAgAEEIayAMcSAEakEIaiADOgAAQf8BRg0CIAcoAAAhACAHIAEoAAA2AAAgASAANgAAIAEoAAQhACABIAcoAAQ2AAQgByAANgAEIActAAohACAHIAEtAAo6AAogASAAOgAKIActAAshACAHIAEtAAs6AAsgASAAOgALIAcvAAghACAHIAEvAAg7AAggASAAOwAIDAELCyAFIApBGXYiADoAACACQQhrIAxxIARqQQhqIAA6AAAMAQsgBUH/AToAACACQQhrIAxxIARqQQhqQf8BOgAAIAFBCGogB0EIaigAADYAACABIAcpAAA3AAALIAJBAWohASACIAxHDQALCyAIIBUgEGs2AggMBAtBBEEIIABBBEkbCyIBrUIMfiIWQiCIpw0AIBanIgBBB2oiAiAASQ0AIAJBeHEiAiABQQhqIgRqIgAgAk8NAQsQfiAPKAIUGgwBCwJAAkAgAEEATgRAQQghAwJAIABFDQAgAEEIELgBIgMNACAAQQgQ2wEACyACIANqQf8BIAQQ3gEhBCABQQFrIgUgAUEDdkEHbCAFQQhJGyAQa60gEK1CIIaEIRcgB0UEQCAIIBc3AgggCCAFNgIAIAgoAgQhAiAIIAQ2AgQMAwsgCEEEaigCACICQQxrIRADQCACIAZqLAAAQQBOBEAgBCAFIBAgBkF0bGoiAUEEaigCACIABH4gASgCACEBIABBB3EhCkKlxoihyJyn+UshFgJAIABBAWtBB0kEQCABIQAMAQsgAEF4cSEDA0AgATEAByABMQAGIAExAAUgATEABCABMQADIAExAAIgATEAASAWIAExAACFQrODgICAIH6FQrODgICAIH6FQrODgICAIH6FQrOD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BHFFBEAgASgCGEHwysAAQQYgAUEcaigCACgCDBEBAAwBCyACQQE6AA8gAiABKQIYNwMAIAIgAkEPajYCCEEBIAJB7MrAAEEDEDcNABogASgCGEHvysAAQQEgASgCHCgCDBEBAAsiAToABCACQRBqJAAgAEEQaiQAIAEL8wIBAn8gACgCACIALQAAIABBADoAAEEBcUUEQEG4jsAAQStBsI/AABCDAQALIwBBIGsiACQAAkACQAJAQYTnwAAoAgBB/////wdxBEAQ6gFFDQELQfTmwAAoAgBB9ObAAEF/NgIADQECQAJAQYTnwAAoAgBB/////wdxRQRAQYDnwAAoAgAhAUGA58AAQYyOwAA2AgBB/ObAACgCACECQfzmwABBATYCAAwBCxDqAUGA58AAKAIAIQFBgOfAAEGMjsAANgIAQfzmwAAoAgAhAkH85sAAQQE2AgBFDQELQYTnwAAoAgBB/////wdxRQ0AEOoBDQBB+ObAAEEBOgAAC0H05sAAQQA2AgACQCACRQ0AIAIgASgCABEEACABQQRqKAIARQ0AIAFBCGooAgAaIAIQJgsgAEEgaiQADAILIABBHGpBADYCACAAQdihwAA2AhggAEIBNwIMIABBrKbAADYCCCAAQQhqQdCmwAAQiQEACwALCzQAIABBAzoAICAAQoCAgICABDcCACAAIAE2AhggAEEANgIQIABBADYCCCAAQRxqIAI2AgALMAAgASgCGCACQQsgAUEcaigCACgCDBEBACECIABBADoABSAAIAI6AAQgACABNgIACycAIAAgACgCBEEBcSABckECcjYCBCAAIAFqIgAgACgCBEEBcjYCBAs6AQJ/QdDmwAAtAAAhAUHQ5sAAQQA6AABB1ObAACgCACECQdTmwABBADYCACAAIAI2AgQgACABNgIACyEAAkAgAC0AAEEDRw0AIABBCGooAgBFDQAgACgCBBAmCwsgAQF/AkAgACgCBCIBRQ0AIABBCGooAgBFDQAgARAmCwsjAAJAIAFB/P///wdNBEAgACABQQQgAhCwASIADQELAAsgAAsjACACIAIoAgRBfnE2AgQgACABQQFyNgIEIAAgAWogATYCAAseACAAKAIAIgCtQgAgAKx9IABBAE4iABsgACABEEILHgAgAEUEQBDUAQALIAAgAiADIAQgBSABKAIQEQ0ACyMAIABBADYCACAAIAEpAgA3AgQgAEEMaiABQQhqKAIANgIACx8BAn4gACkDACICIAJCP4ciA4UgA30gAkIAWSABEEILHAAgAEUEQBDUAQALIAAgAiADIAQgASgCEBETAAscACAARQRAENQBAAsgACACIAMgBCABKAIQERUACxwAIABFBEAQ1AEACyAAIAIgAyAEIAEoAhARCAALHAAgAEUEQBDUAQALIAAgAiADIAQgASgCEBEXAAscACAARQRAENQBAAsgACACIAMgBCABKAIQEQwACx4AIAAgAUEDcjYCBCAAIAFqIgAgACgCBEEBcjYCBAsUACAAQQRqKAIABEAgACgCABAmCwsaACAARQRAENQBAAsgACACIAMgASgCEBEFAAsiACAALQAARQRAIAFBmM7AAEEFECcPCyABQZTOwABBBBAnCxgAIABFBEAQ1AEACyAAIAIgASgCEBEAAAsZAQF/IAAoAhAiAQR/IAEFIABBFGooAgALCxgAIAAoAgAiACgCACAAQQhqKAIAIAEQKgsSAEEAQRkgAEEBdmsgAEEfRhsLFgAgACABQQFyNgIEIAAgAWogATYCAAscACABKAIYQfjHwABBDiABQRxqKAIAKAIMEQEACxkAIAAoAhggASACIABBHGooAgAoAgwRAQALHAAgASgCGEG538AAQQUgAUEcaigCACgCDBEBAAsQACAAIAFqQQFrQQAgAWtxC48GAQZ/An8gACEFAkACQAJAIAJBCU8EQCADIAIQOCIHDQFBAAwEC0EIQQgQrwEhAEEUQQgQrwEhAUEQQQgQrwEhAkEAQRBBCBCvAUECdGsiBEGAgHwgAiAAIAFqamtBd3FBA2siACAAIARLGyADTQ0BQRAgA0EEakEQQQgQrwFBBWsgA0sbQQgQrwEhAiAFEO4BIgAgABDXASIEEOsBIQECQAJAAkACQAJAAkACQCAAEMQBRQRAIAIgBE0NASABQazqwAAoAgBGDQIgAUGo6sAAKAIARg0DIAEQvQENByABENcBIgYgBGoiCCACSQ0HIAggAmshBCAGQYACSQ0EIAEQRgwFCyAAENcBIQEgAkGAAkkNBiABIAJrQYGACEkgAkEEaiABTXENBSABIAAoAgAiAWpBEGohBCACQR9qQYCABBCvASECDAYLQRBBCBCvASAEIAJrIgFLDQQgACACEOsBIQQg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BEEDcUULDAAgACABQQNyNgIECw0AIAAoAgAgACgCBGoL1gIBAn8gACgCACEAIwBBEGsiAiQAAkACfwJAIAFBgAFPBEAgAkEANgIMIAFBgBBPDQEgAiABQT9xQYABcjoADSACIAFBBnZBwAFyOgAMQQIMAgsgACgCCCIDIAAoAgRGBEAgACADEFQgACgCCCEDCyAAIANBAWo2AgggACgCACADaiABOgAADAILIAFBgIAETwRAIAIgAUE/cUGAAXI6AA8gAiABQQZ2QT9xQYABcjoADiACIAFBDHZBP3FBgAFyOgANIAIgAUESdkEHcUHwAXI6AAxBBAwBCyACIAFBP3FBgAFyOgAOIAIgAUEMdkHgAXI6AAwgAiABQQZ2QT9xQYABcjoADUEDCyEBIAEgAEEEaigCACAAKAIIIgNrSwRAIAAgAyABEFIgACgCCCEDCyAAKAIAIANqIAJBDGogARDgARogACABIANqNgIICyACQRBqJABBAAsOACAAKAIAGgNADAALAAttAQF/IwBBMGsiAyQAIAMgATYCBCADIAA2AgAgA0EcakECNgIAIANBLGpBDjYCACADQgI3AgwgA0Goz8AANgIIIANBDjYCJCADIANBIGo2AhggAyADQQRqNgIoIAMgAzYCICADQQhqIAIQiQEAC20BAX8jAEEwayIDJAAgAyABNgIEIAMgADYCACADQRxqQQI2AgAgA0EsakEONgIAIANCAjcCDCADQcjPwAA2AgggA0EONgIkIAMgA0EgajYCGCADIANBBGo2AiggAyADNgIgIANBCGogAhCJAQALbQEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBHGpBAjYCACADQSxqQQ42AgAgA0ICNwIMIANB/M/AADYCCCADQQ42AiQgAyADQSBqNgIYIAMgA0EEajYCKCADIAM2AiAgA0EIaiACEIkBAAsNACAANQIAQQEgARBCC9gCAgR/An4jAEFAaiICJABBASEEAkAgAC0ABA0AIAAtAAUhBAJAAkACQCAAKAIAIgMoAgAiBUEEcUUEQCAEDQEMAwsgBA0BQQEhBCADKAIYQYPLwABBASADQRxqKAIAKAIMEQEADQMgAygCACEFDAELQQEhBCADKAIYQerKwABBAiADQRxqKAIAKAIMEQEARQ0BDAILQQEhBCACQQE6ABcgAkE0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AAAAAAEAAAAFAAAAAQAAAAAAAAABAAAABgAAAAEAAAAAAAAAAQAAAAcAAAABAAAAAAAAAAEAAAAIAAAAAQAAAAAAAAABAAAABAAAAAEAAAAAAAAAAQAAAAkAAAABAAAAAAAAAAEAAAAKAAAAcHJvdmVuYW5jZWNlbGxfaWR6b21lX25hbWVmbl9uYW1lY2FwX3NlY3JldHBheWxvYWRub25jZWV4cGlyZXNfYXRjYWxsZWQgYE9wdGlvbjo6dW53cmFwKClgIG9uIGEgYE5vbmVgIHZhbHVlL1VzZXJzL2pvc3QvLmNhcmdvL3JlZ2lzdHJ5L3NyYy9naXRodWIuY29tLTFlY2M2Mjk5ZGI5ZWM4MjMvc2VyZGUtd2FzbS1iaW5kZ2VuLTAuMy4xL3NyYy9kZS5ycwAAOAEQAF4AAABZAAAAHwAAAA8AAAAMAAAABAAAABAAAAARAAAAEgAAAGEgRGlzcGxheSBpbXBsZW1lbnRhdGlvbiByZXR1cm5lZCBhbiBlcnJvciB1bmV4cGVjdGVkbHkAEwAAAAAAAAABAAAAFAAAAC9ydXN0Yy82OWY5YzMzZDcxYzg3MWZjMTZhYzQ0NTIxMTI4MWM2ZTdhMzQwOTQzL2xpYnJhcnkvYWxsb2Mvc3JjL3N0cmluZy5ycwAIAhAASwAAAOgJAAAJAAAAaW52YWxpZCB2YWx1ZTogLCBleHBlY3RlZCAAAGQCEAAPAAAAcwIQAAsAAABtaXNzaW5nIGZpZWxkIGBgkAIQAA8AAACfAhAAAQAAAGludmFsaWQgbGVuZ3RoIACwAhAADwAAAHMCEAALAAAAZHVwbGljYXRlIGZpZWxkIGAAAADQAhAAEQAAAJ8CEAABAAAAFQAAAAwAAAAEAAAAFgAAABcAAAASAAAAYSBEaXNwbGF5IGltcGxlbWVudGF0aW9uIHJldHVybmVkIGFuIGVycm9yIHVuZXhwZWN0ZWRseQAYAAAAAAAAAAEAAAAUAAAAL3J1c3RjLzY5ZjljMzNkNzFjODcxZmMxNmFjNDQ1MjExMjgxYzZlN2EzNDA5NDMvbGlicmFyeS9hbGxvYy9zcmMvc3RyaW5nLnJzAFQDEABLAAAA6AkAAAkAAAAzIGJ5dGUgcHJlZml4AAAAGAAAAAAAAAABAAAAGQAAAC9Vc2Vycy9qb3N0Ly5jYXJnby9yZWdpc3RyeS9zcmMvZ2l0aHViLmNvbS0xZWNjNjI5OWRiOWVjODIzL2hvbG9faGFzaC0wLjEuMC1iZXRhLXJjLjAvc3JjL2hhc2hfdHlwZS9wcmltaXRpdmUucnPQAxAAcAAAAE0AAAARAAAASG9sb0hhc2ggc2VyaWFsaXplZCByZXByZXNlbnRhdGlvbiBtdXN0IGJlIGV4YWN0bHkgMzkgYnl0ZXNIb2xvSGFzaCBlcnJvcjogAIsEEAAQAAAAYSBIb2xvSGFzaCBvZiBwcmltaXRpdmUgaGFzaF90eXBlAAAAGwAAAAwAAAAEAAAAHAAAAB0AAAASAAAAYSBEaXNwbGF5IGltcGxlbWVudGF0aW9uIHJldHVybmVkIGFuIGVycm9yIHVuZXhwZWN0ZWRseQAeAAAAAAAAAAEAAAAUAAAAL3J1c3RjLzY5ZjljMzNkNzFjODcxZmMxNmFjNDQ1MjExMjgxYzZlN2EzNDA5NDMvbGlicmFyeS9hbGxvYy9zcmMvc3RyaW5nLnJzACgFEABLAAAA6AkAAAkAAABwcm92ZW5hbmNlY2VsbF9pZHpvbWVfbmFtZWZuX25hbWVjYXBfc2VjcmV0cGF5bG9hZG5vbmNlZXhwaXJlc19hdFpvbWVDYWxsVW5zaWduZWQAAACEBRAACgAAAI4FEAAHAAAAlQUQAAkAAACeBRAABwAAAKUFEAAKAAAArwUQAAcAAAC2BRAABQAAALsFEAAKAAAAIGJ5dGVzLCBnb3QgIGJ5dGVzAAAYBhAAAAAAABgGEAAMAAAAJAYQAAYAAAAgAAAAIAAAAAgAAAAEAAAAAgAAAC9Vc2Vycy9qb3N0Ly5jYXJnby9yZWdpc3RyeS9zcmMvZ2l0aHViLmNvbS0xZWNjNjI5OWRiOWVjODIzL2hvbG9faGFzaC0wLjEuMC1iZXRhLXJjLjAvc3JjL2hhc2gucnMAAABYBhAAYQAAAF8AAAAtAAAAIGJ5dGVzLCBnb3QgIGJ5dGVzAADMBhAAAAAAAMwGEAAMAAAA2AYQAAYAAABAAAAAIQAAAAgAAAAEAAAAAgAAACIAAAAAAAAAAQAAACMAAAAkAAAAJQAAACIAAAAEAAAABAAAACYAAAAnAAAAY2FsbGVkIGBPcHRpb246OnVud3JhcCgpYCBvbiBhIGBOb25lYCB2YWx1ZS9ydXN0Yy82OWY5YzMzZDcxYzg3MWZjMTZhYzQ0NTIxMTI4MWM2ZTdhMzQwOTQzL2xpYnJhcnkvc3RkL3NyYy9zeW5jL29uY2UucnMAYwcQAEwAAACPAAAAKQAAACIAAAAEAAAABAAAACgAAAApAAAAKgAAAC9Vc2Vycy9qb3N0Ly5jYXJnby9yZWdpc3RyeS9zcmMvZ2l0aHViLmNvbS0xZWNjNjI5OWRiOWVjODIzL2NvbnNvbGVfZXJyb3JfcGFuaWNfaG9vay0wLjEuNy9zcmMvbGliLnJzAAAA2AcQAGUAAACVAAAADgAAAFAIEAAAAAAALAAAAAQAAAAEAAAALQAAAC4AAAAvAAAAMQAAAAwAAAAEAAAAMgAAADMAAAA0AAAAYSBEaXNwbGF5IGltcGxlbWVudGF0aW9uIHJldHVybmVkIGFuIGVycm9yIHVuZXhwZWN0ZWRseQA1AAAAAAAAAAEAAAAUAAAAL3J1c3RjLzY5ZjljMzNkNzFjODcxZmMxNmFjNDQ1MjExMjgxYzZlN2EzNDA5NDMvbGlicmFyeS9hbGxvYy9zcmMvc3RyaW5nLnJzANAIEABLAAAA6AkAAAkAAABpbnZhbGlkIHR5cGU6ICwgZXhwZWN0ZWQgAAAALAkQAA4AAAA6CRAACwAAADYAAAAAAAAA//////////9jYW5ub3QgYWNjZXNzIGEgVGhyZWFkIExvY2FsIFN0b3JhZ2UgdmFsdWUgZHVyaW5nIG9yIGFmdGVyIGRlc3RydWN0aW9uAAA3AAAAAAAAAAEAAAA4AAAAL3J1c3RjLzY5ZjljMzNkNzFjODcxZmMxNmFjNDQ1MjExMjgxYzZlN2EzNDA5NDMvbGlicmFyeS9zdGQvc3JjL3RocmVhZC9sb2NhbC5ycwDACRAATwAAAKYBAAAJAAAAYWxyZWFkeSBib3Jyb3dlZDcAAAAAAAAAAQAAADkAAAAvVXNlcnMvam9zdC8uY2FyZ28vcmVnaXN0cnkvc3JjL2dpdGh1Yi5jb20tMWVjYzYyOTlkYjllYzgyMy9zZXJkZS13YXNtLWJpbmRnZW4tMC4zLjEvc3JjL2xpYi5ycwBAChAAXwAAABgAAAAOAAAAY2xvc3VyZSBpbnZva2VkIHJlY3Vyc2l2ZWx5IG9yIGRlc3Ryb3llZCBhbHJlYWR5RgAAAAQAAAAEAAAARwAAAEgAAABJAAAASgAAAAwAAAAEAAAASwAAAEwAAABNAAAAYSBEaXNwbGF5IGltcGxlbWVudGF0aW9uIHJldHVybmVkIGFuIGVycm9yIHVuZXhwZWN0ZWRseQBOAAAAAAAAAAEAAAAUAAAAL3J1c3RjLzY5ZjljMzNkNzFjODcxZmMxNmFjNDQ1MjExMjgxYzZlN2EzNDA5NDMvbGlicmFyeS9hbGxvYy9zcmMvc3RyaW5nLnJzAFgLEABLAAAA6AkAAAkAAAAKClN0YWNrOgoKSnNWYWx1ZSgpAL4LEAAIAAAAxgsQAAEAAABhIGJ5dGUgYXJyYXkgb2YgbGVuZ3RoIADYCxAAFwAAACAAAABzdHJ1Y3QgWm9tZUNhbGxVbnNpZ25lZHR1cGxlIHN0cnVjdCBDZWxsSWRhIGJ5dGUgYXJyYXkgb2YgbGVuZ3RoIAAAACYMEAAXAAAAQAAAAIQgJEFnZW50UHViS2V5hC0kRG5hSGFzaC9Vc2Vycy9qb3N0Ly5jYXJnby9yZWdpc3RyeS9zcmMvZ2l0aHViLmNvbS0xZWNjNjI5OWRiOWVjODIzL2hvbG9faGFzaC0wLjEuMC1iZXRhLXJjLjAvc3JjL2VuY29kZS5yc2NhbGxlZCBgUmVzdWx0Ojp1bndyYXAoKWAgb24gYW4gYEVycmAgdmFsdWUAAFAAAAAQAAAABAAAABoAAABkDBAAYwAAAIMAAAAFAAAAUQAAAAQAAAAEAAAAUgAAAEJhZEhhc2hTaXplQmFkQ2hlY2tzdW1CYWRQcmVmaXgAUwAAAAQAAAAEAAAAVAAAAFMAAAAEAAAABAAAAFUAAABCYWRTaXplQmFkQmFzZTY0Tm9VL1VzZXJzL2pvc3QvLmNhcmdvL3JlZ2lzdHJ5L3NyYy9naXRodWIuY29tLTFlY2M2Mjk5ZGI5ZWM4MjMvYmxha2UyYl9zaW1kLTAuNS4xMS9zcmMvcG9ydGFibGUucnMAAHcNEABfAAAAlgAAABUAAAAvVXNlcnMvam9zdC8uY2FyZ28vcmVnaXN0cnkvc3JjL2dpdGh1Yi5jb20tMWVjYzYyOTlkYjllYzgyMy9ibGFrZTJiX3NpbWQtMC41LjExL3NyYy9saWIucnMAAOgNEABaAAAATgIAAAoAAABUDhAAAAAAAERlc2VyaWFsaXplAFcAAAAEAAAABAAAAFgAAABTZXJpYWxpemVieXRlIGFycmF5ZGVwdGggbGltaXQgZXhjZWVkZWRzZXJpYWxpemUgZGF0YSBtb2RlbCBpcyBpbnZhbGlkOiCfDhAAIQAAAGF0dGVtcHQgdG8gc2VyaWFsaXplIHN0cnVjdCwgc2VxdWVuY2Ugb3IgbWFwIHdpdGggdW5rbm93biBsZW5ndGhpbnZhbGlkIHZhbHVlIHdyaXRlOiAAAAAIDxAAFQAAAGVycm9yIHdoaWxlIHdyaXRpbmcgbXVsdGktYnl0ZSBNZXNzYWdlUGFjayB2YWx1ZXN0cnVjdCB2YXJpYW50AABYDxAADgAAAHR1cGxlIHZhcmlhbnQAAABwDxAADQAAAG5ld3R5cGUgdmFyaWFudACIDxAADwAAAHVuaXQgdmFyaWFudKAPEAAMAAAAZW51bbQPEAAEAAAAbWFwAMAPEAADAAAAc2VxdWVuY2XMDxAACAAAAG5ld3R5cGUgc3RydWN0AADcDxAADgAAAE9wdGlvbiB2YWx1ZfQPEAAMAAAAdW5pdCB2YWx1ZQAACBAQAAoAAABieXRlIGFycmF5AAAcEBAACgAAAHN0cmluZyAAMBAQAAcAAABjaGFyYWN0ZXIgYGBAEBAACwAAAEsQEAABAAAAZmxvYXRpbmcgcG9pbnQgYFwQEAAQAAAASxAQAAEAAABpbnRlZ2VyIGAAAAB8EBAACQAAAEsQEAABAAAAYm9vbGVhbiBgAAAAmBAQAAkAAABLEBAAAQAAAGEgc3RyaW5naTY0AGIAAAAEAAAABAAAAGMAAABkAAAAZQAAAGFscmVhZHkgYm9ycm93ZWRiAAAAAAAAAAEAAAA5AAAAAAAAAGIAAAAEAAAABAAAAGYAAABiAAAABAAAAAQAAABnAAAAY2FsbGVkIGBPcHRpb246OnVud3JhcCgpYCBvbiBhIGBOb25lYCB2YWx1ZWNhbGxlZCBgUmVzdWx0Ojp1bndyYXAoKWAgb24gYW4gYEVycmAgdmFsdWVBY2Nlc3NFcnJvcnVzZSBvZiBzdGQ6OnRocmVhZDo6Y3VycmVudCgpIGlzIG5vdCBwb3NzaWJsZSBhZnRlciB0aGUgdGhyZWFkJ3MgbG9jYWwgZGF0YSBoYXMgYmVlbiBkZXN0cm95ZWRsaWJyYXJ5L3N0ZC9zcmMvdGhyZWFkL21vZC5yc9sREAAdAAAA3QIAAAUAAABmYWlsZWQgdG8gZ2VuZXJhdGUgdW5pcXVlIHRocmVhZCBJRDogYml0c3BhY2UgZXhoYXVzdGVkAAgSEAA3AAAA2xEQAB0AAABWBAAADQAAAFBvaXNvbkVycm9ybGlicmFyeS9zdGQvc3JjL3N5c19jb21tb24vdGhyZWFkX2luZm8ucnNjEhAAKQAAABYAAAAzAAAAbWVtb3J5IGFsbG9jYXRpb24gb2YgIGJ5dGVzIGZhaWxlZAoAnBIQABUAAACxEhAADgAAAGxpYnJhcnkvc3RkL3NyYy9hbGxvYy5yc9ASEAAYAAAAVQEAAAkAAABjYW5ub3QgbW9kaWZ5IHRoZSBwYW5pYyBob29rIGZyb20gYSBwYW5pY2tpbmcgdGhyZWFk+BIQADQAAABsaWJyYXJ5L3N0ZC9zcmMvcGFuaWNraW5nLnJzNBMQABwAAACGAAAACQAAADQTEAAcAAAAPgIAAA8AAAA0ExAAHAAAAD0CAAAPAAAAaAAAAAwAAAAEAAAAaQAAAGIAAAAIAAAABAAAAGoAAABrAAAAEAAAAAQAAABsAAAAbQAAAGIAAAAIAAAABAAAAG4AAABvAAAAYgAAAAAAAAABAAAAcAAAAGNvbmR2YXIgd2FpdCBub3Qgc3VwcG9ydGVkAADYExAAGgAAAGxpYnJhcnkvc3RkL3NyYy9zeXMvd2FzbS8uLi91bnN1cHBvcnRlZC9sb2Nrcy9jb25kdmFyLnJz/BMQADgAAAAWAAAACQAAAGNhbm5vdCByZWN1cnNpdmVseSBhY3F1aXJlIG11dGV4RBQQACAAAABsaWJyYXJ5L3N0ZC9zcmMvc3lzL3dhc20vLi4vdW5zdXBwb3J0ZWQvbG9ja3MvbXV0ZXgucnMAAGwUEAA2AAAAFgAAAAkAAABhc3NlcnRpb24gZmFpbGVkOiBzdGF0ZV9hbmRfcXVldWUuYWRkcigpICYgU1RBVEVfTUFTSyA9PSBSVU5OSU5HT25jZSBpbnN0YW5jZSBoYXMgcHJldmlvdXNseSBiZWVuIHBvaXNvbmVkAAD0FBAAKgAAAAIAAABsaWJyYXJ5L3N0ZC9zcmMvc3lzX2NvbW1vbi9vbmNlL2dlbmVyaWMucnMAACwVEAAqAAAA+AAAAAkAAAAsFRAAKgAAAAUBAAAeAAAA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");

        var wasm = async () => {
                await init(wasm_code);
                return exports$1;
            };

// eslint-disable-next-line
let instance = undefined;
async function hashZomeCall(value) {
    if (!instance) {
        instance = await wasm();
    }
    return instance.hashZomeCall(value);
}

/**
 * @public
 */
var CellType;
(function (CellType) {
    CellType["Provisioned"] = "provisioned";
    CellType["Cloned"] = "cloned";
    CellType["Stem"] = "stem";
})(CellType || (CellType = {}));
/**
 * @public
 */
var CellProvisioningStrategy;
(function (CellProvisioningStrategy) {
    /**
     * Always create a new Cell when installing this App
     */
    CellProvisioningStrategy["Create"] = "create";
    /**
     * Always create a new Cell when installing the App,
     * and use a unique network seed to ensure a distinct DHT network.
     *
     * Not implemented
     */
    // CreateClone = "create_clone",
    /**
     * Require that a Cell is already installed which matches the DNA version
     * spec, and which has an Agent that's associated with this App's agent
     * via DPKI. If no such Cell exists, *app installation fails*.
     */
    CellProvisioningStrategy["UseExisting"] = "use_existing";
    /**
     * Try `UseExisting`, and if that fails, fallback to `Create`
     */
    CellProvisioningStrategy["CreateIfNoExists"] = "create_if_no_exists";
    /**
     * Disallow provisioning altogether. In this case, we expect
     * `clone_limit > 0`: otherwise, no Cells will ever be created.
     *
     * Not implemented
     */
    // Disabled = "disabled",
})(CellProvisioningStrategy || (CellProvisioningStrategy = {}));
/**
 * @public
 */
var AppStatusFilter;
(function (AppStatusFilter) {
    AppStatusFilter["Enabled"] = "enabled";
    AppStatusFilter["Disabled"] = "disabled";
    AppStatusFilter["Running"] = "running";
    AppStatusFilter["Stopped"] = "stopped";
    AppStatusFilter["Paused"] = "paused";
})(AppStatusFilter || (AppStatusFilter = {}));

var d$1=Object.defineProperty;var e=(c,a)=>{for(var b in a)d$1(c,b,{get:a[b],enumerable:!0});};

var w={};e(w,{convertFileSrc:()=>u,invoke:()=>d,transformCallback:()=>s});function l(){return window.crypto.getRandomValues(new Uint32Array(1))[0]}function s(r,n=!1){let e=l(),t=`_${e}`;return Object.defineProperty(window,t,{value:o=>(n&&Reflect.deleteProperty(window,t),r?.(o)),writable:!1,configurable:!0}),e}async function d(r,n={}){return new Promise((e,t)=>{let o=s(i=>{e(i),Reflect.deleteProperty(window,`_${a}`);},!0),a=s(i=>{t(i),Reflect.deleteProperty(window,`_${o}`);},!0);window.__TAURI_IPC__({cmd:r,callback:o,error:a,...n});})}function u(r,n="asset"){let e=encodeURIComponent(r);return navigator.userAgent.includes("Windows")?`https://${n}.localhost/${e}`:`${n}://localhost/${e}`}

// Integer Utility
var UINT32_MAX = 4294967295;
// DataView extension to handle int64 / uint64,
// where the actual range is 53-bits integer (a.k.a. safe integer)
function setUint64(view, offset, value) {
    var high = value / 4294967296;
    var low = value; // high bits are truncated by DataView
    view.setUint32(offset, high);
    view.setUint32(offset + 4, low);
}
function setInt64(view, offset, value) {
    var high = Math.floor(value / 4294967296);
    var low = value; // high bits are truncated by DataView
    view.setUint32(offset, high);
    view.setUint32(offset + 4, low);
}
function getInt64(view, offset) {
    var high = view.getInt32(offset);
    var low = view.getUint32(offset + 4);
    return high * 4294967296 + low;
}
function getUint64(view, offset) {
    var high = view.getUint32(offset);
    var low = view.getUint32(offset + 4);
    return high * 4294967296 + low;
}

var _a, _b, _c;
var TEXT_ENCODING_AVAILABLE = (typeof process === "undefined" || ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a["TEXT_ENCODING"]) !== "never") &&
    typeof TextEncoder !== "undefined" &&
    typeof TextDecoder !== "undefined";
function utf8Count(str) {
    var strLength = str.length;
    var byteLength = 0;
    var pos = 0;
    while (pos < strLength) {
        var value = str.charCodeAt(pos++);
        if ((value & 0xffffff80) === 0) {
            // 1-byte
            byteLength++;
            continue;
        }
        else if ((value & 0xfffff800) === 0) {
            // 2-bytes
            byteLength += 2;
        }
        else {
            // handle surrogate pair
            if (value >= 0xd800 && value <= 0xdbff) {
                // high surrogate
                if (pos < strLength) {
                    var extra = str.charCodeAt(pos);
                    if ((extra & 0xfc00) === 0xdc00) {
                        ++pos;
                        value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
                    }
                }
            }
            if ((value & 0xffff0000) === 0) {
                // 3-byte
                byteLength += 3;
            }
            else {
                // 4-byte
                byteLength += 4;
            }
        }
    }
    return byteLength;
}
function utf8EncodeJs(str, output, outputOffset) {
    var strLength = str.length;
    var offset = outputOffset;
    var pos = 0;
    while (pos < strLength) {
        var value = str.charCodeAt(pos++);
        if ((value & 0xffffff80) === 0) {
            // 1-byte
            output[offset++] = value;
            continue;
        }
        else if ((value & 0xfffff800) === 0) {
            // 2-bytes
            output[offset++] = ((value >> 6) & 0x1f) | 0xc0;
        }
        else {
            // handle surrogate pair
            if (value >= 0xd800 && value <= 0xdbff) {
                // high surrogate
                if (pos < strLength) {
                    var extra = str.charCodeAt(pos);
                    if ((extra & 0xfc00) === 0xdc00) {
                        ++pos;
                        value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
                    }
                }
            }
            if ((value & 0xffff0000) === 0) {
                // 3-byte
                output[offset++] = ((value >> 12) & 0x0f) | 0xe0;
                output[offset++] = ((value >> 6) & 0x3f) | 0x80;
            }
            else {
                // 4-byte
                output[offset++] = ((value >> 18) & 0x07) | 0xf0;
                output[offset++] = ((value >> 12) & 0x3f) | 0x80;
                output[offset++] = ((value >> 6) & 0x3f) | 0x80;
            }
        }
        output[offset++] = (value & 0x3f) | 0x80;
    }
}
var sharedTextEncoder = TEXT_ENCODING_AVAILABLE ? new TextEncoder() : undefined;
var TEXT_ENCODER_THRESHOLD = !TEXT_ENCODING_AVAILABLE
    ? UINT32_MAX
    : typeof process !== "undefined" && ((_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b["TEXT_ENCODING"]) !== "force"
        ? 200
        : 0;
function utf8EncodeTEencode(str, output, outputOffset) {
    output.set(sharedTextEncoder.encode(str), outputOffset);
}
function utf8EncodeTEencodeInto(str, output, outputOffset) {
    sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}
var utf8EncodeTE = (sharedTextEncoder === null || sharedTextEncoder === void 0 ? void 0 : sharedTextEncoder.encodeInto) ? utf8EncodeTEencodeInto : utf8EncodeTEencode;
var CHUNK_SIZE = 4096;
function utf8DecodeJs(bytes, inputOffset, byteLength) {
    var offset = inputOffset;
    var end = offset + byteLength;
    var units = [];
    var result = "";
    while (offset < end) {
        var byte1 = bytes[offset++];
        if ((byte1 & 0x80) === 0) {
            // 1 byte
            units.push(byte1);
        }
        else if ((byte1 & 0xe0) === 0xc0) {
            // 2 bytes
            var byte2 = bytes[offset++] & 0x3f;
            units.push(((byte1 & 0x1f) << 6) | byte2);
        }
        else if ((byte1 & 0xf0) === 0xe0) {
            // 3 bytes
            var byte2 = bytes[offset++] & 0x3f;
            var byte3 = bytes[offset++] & 0x3f;
            units.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
        }
        else if ((byte1 & 0xf8) === 0xf0) {
            // 4 bytes
            var byte2 = bytes[offset++] & 0x3f;
            var byte3 = bytes[offset++] & 0x3f;
            var byte4 = bytes[offset++] & 0x3f;
            var unit = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
            if (unit > 0xffff) {
                unit -= 0x10000;
                units.push(((unit >>> 10) & 0x3ff) | 0xd800);
                unit = 0xdc00 | (unit & 0x3ff);
            }
            units.push(unit);
        }
        else {
            units.push(byte1);
        }
        if (units.length >= CHUNK_SIZE) {
            result += String.fromCharCode.apply(String, units);
            units.length = 0;
        }
    }
    if (units.length > 0) {
        result += String.fromCharCode.apply(String, units);
    }
    return result;
}
var sharedTextDecoder = TEXT_ENCODING_AVAILABLE ? new TextDecoder() : null;
var TEXT_DECODER_THRESHOLD = !TEXT_ENCODING_AVAILABLE
    ? UINT32_MAX
    : typeof process !== "undefined" && ((_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c["TEXT_DECODER"]) !== "force"
        ? 200
        : 0;
function utf8DecodeTD(bytes, inputOffset, byteLength) {
    var stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
    return sharedTextDecoder.decode(stringBytes);
}

/**
 * ExtData is used to handle Extension Types that are not registered to ExtensionCodec.
 */
var ExtData = /** @class */ (function () {
    function ExtData(type, data) {
        this.type = type;
        this.data = data;
    }
    return ExtData;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DecodeError = /** @class */ (function (_super) {
    __extends(DecodeError, _super);
    function DecodeError(message) {
        var _this = _super.call(this, message) || this;
        // fix the prototype chain in a cross-platform way
        var proto = Object.create(DecodeError.prototype);
        Object.setPrototypeOf(_this, proto);
        Object.defineProperty(_this, "name", {
            configurable: true,
            enumerable: false,
            value: DecodeError.name,
        });
        return _this;
    }
    return DecodeError;
}(Error));

// https://github.com/msgpack/msgpack/blob/master/spec.md#timestamp-extension-type
var EXT_TIMESTAMP = -1;
var TIMESTAMP32_MAX_SEC = 0x100000000 - 1; // 32-bit unsigned int
var TIMESTAMP64_MAX_SEC = 0x400000000 - 1; // 34-bit unsigned int
function encodeTimeSpecToTimestamp(_a) {
    var sec = _a.sec, nsec = _a.nsec;
    if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
        // Here sec >= 0 && nsec >= 0
        if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
            // timestamp 32 = { sec32 (unsigned) }
            var rv = new Uint8Array(4);
            var view = new DataView(rv.buffer);
            view.setUint32(0, sec);
            return rv;
        }
        else {
            // timestamp 64 = { nsec30 (unsigned), sec34 (unsigned) }
            var secHigh = sec / 0x100000000;
            var secLow = sec & 0xffffffff;
            var rv = new Uint8Array(8);
            var view = new DataView(rv.buffer);
            // nsec30 | secHigh2
            view.setUint32(0, (nsec << 2) | (secHigh & 0x3));
            // secLow32
            view.setUint32(4, secLow);
            return rv;
        }
    }
    else {
        // timestamp 96 = { nsec32 (unsigned), sec64 (signed) }
        var rv = new Uint8Array(12);
        var view = new DataView(rv.buffer);
        view.setUint32(0, nsec);
        setInt64(view, 4, sec);
        return rv;
    }
}
function encodeDateToTimeSpec(date) {
    var msec = date.getTime();
    var sec = Math.floor(msec / 1e3);
    var nsec = (msec - sec * 1e3) * 1e6;
    // Normalizes { sec, nsec } to ensure nsec is unsigned.
    var nsecInSec = Math.floor(nsec / 1e9);
    return {
        sec: sec + nsecInSec,
        nsec: nsec - nsecInSec * 1e9,
    };
}
function encodeTimestampExtension(object) {
    if (object instanceof Date) {
        var timeSpec = encodeDateToTimeSpec(object);
        return encodeTimeSpecToTimestamp(timeSpec);
    }
    else {
        return null;
    }
}
function decodeTimestampToTimeSpec(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    // data may be 32, 64, or 96 bits
    switch (data.byteLength) {
        case 4: {
            // timestamp 32 = { sec32 }
            var sec = view.getUint32(0);
            var nsec = 0;
            return { sec: sec, nsec: nsec };
        }
        case 8: {
            // timestamp 64 = { nsec30, sec34 }
            var nsec30AndSecHigh2 = view.getUint32(0);
            var secLow32 = view.getUint32(4);
            var sec = (nsec30AndSecHigh2 & 0x3) * 0x100000000 + secLow32;
            var nsec = nsec30AndSecHigh2 >>> 2;
            return { sec: sec, nsec: nsec };
        }
        case 12: {
            // timestamp 96 = { nsec32 (unsigned), sec64 (signed) }
            var sec = getInt64(view, 4);
            var nsec = view.getUint32(0);
            return { sec: sec, nsec: nsec };
        }
        default:
            throw new DecodeError("Unrecognized data size for timestamp (expected 4, 8, or 12): ".concat(data.length));
    }
}
function decodeTimestampExtension(data) {
    var timeSpec = decodeTimestampToTimeSpec(data);
    return new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
}
var timestampExtension = {
    type: EXT_TIMESTAMP,
    encode: encodeTimestampExtension,
    decode: decodeTimestampExtension,
};

// ExtensionCodec to handle MessagePack extensions
var ExtensionCodec = /** @class */ (function () {
    function ExtensionCodec() {
        // built-in extensions
        this.builtInEncoders = [];
        this.builtInDecoders = [];
        // custom extensions
        this.encoders = [];
        this.decoders = [];
        this.register(timestampExtension);
    }
    ExtensionCodec.prototype.register = function (_a) {
        var type = _a.type, encode = _a.encode, decode = _a.decode;
        if (type >= 0) {
            // custom extensions
            this.encoders[type] = encode;
            this.decoders[type] = decode;
        }
        else {
            // built-in extensions
            var index = 1 + type;
            this.builtInEncoders[index] = encode;
            this.builtInDecoders[index] = decode;
        }
    };
    ExtensionCodec.prototype.tryToEncode = function (object, context) {
        // built-in extensions
        for (var i = 0; i < this.builtInEncoders.length; i++) {
            var encodeExt = this.builtInEncoders[i];
            if (encodeExt != null) {
                var data = encodeExt(object, context);
                if (data != null) {
                    var type = -1 - i;
                    return new ExtData(type, data);
                }
            }
        }
        // custom extensions
        for (var i = 0; i < this.encoders.length; i++) {
            var encodeExt = this.encoders[i];
            if (encodeExt != null) {
                var data = encodeExt(object, context);
                if (data != null) {
                    var type = i;
                    return new ExtData(type, data);
                }
            }
        }
        if (object instanceof ExtData) {
            // to keep ExtData as is
            return object;
        }
        return null;
    };
    ExtensionCodec.prototype.decode = function (data, type, context) {
        var decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
        if (decodeExt) {
            return decodeExt(data, type, context);
        }
        else {
            // decode() does not fail, returns ExtData instead.
            return new ExtData(type, data);
        }
    };
    ExtensionCodec.defaultCodec = new ExtensionCodec();
    return ExtensionCodec;
}());

function ensureUint8Array(buffer) {
    if (buffer instanceof Uint8Array) {
        return buffer;
    }
    else if (ArrayBuffer.isView(buffer)) {
        return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }
    else if (buffer instanceof ArrayBuffer) {
        return new Uint8Array(buffer);
    }
    else {
        // ArrayLike<number>
        return Uint8Array.from(buffer);
    }
}
function createDataView(buffer) {
    if (buffer instanceof ArrayBuffer) {
        return new DataView(buffer);
    }
    var bufferView = ensureUint8Array(buffer);
    return new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
}

var DEFAULT_MAX_DEPTH = 100;
var DEFAULT_INITIAL_BUFFER_SIZE = 2048;
var Encoder = /** @class */ (function () {
    function Encoder(extensionCodec, context, maxDepth, initialBufferSize, sortKeys, forceFloat32, ignoreUndefined, forceIntegerToFloat) {
        if (extensionCodec === void 0) { extensionCodec = ExtensionCodec.defaultCodec; }
        if (context === void 0) { context = undefined; }
        if (maxDepth === void 0) { maxDepth = DEFAULT_MAX_DEPTH; }
        if (initialBufferSize === void 0) { initialBufferSize = DEFAULT_INITIAL_BUFFER_SIZE; }
        if (sortKeys === void 0) { sortKeys = false; }
        if (forceFloat32 === void 0) { forceFloat32 = false; }
        if (ignoreUndefined === void 0) { ignoreUndefined = false; }
        if (forceIntegerToFloat === void 0) { forceIntegerToFloat = false; }
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
    Encoder.prototype.reinitializeState = function () {
        this.pos = 0;
    };
    /**
     * This is almost equivalent to {@link Encoder#encode}, but it returns an reference of the encoder's internal buffer and thus much faster than {@link Encoder#encode}.
     *
     * @returns Encodes the object and returns a shared reference the encoder's internal buffer.
     */
    Encoder.prototype.encodeSharedRef = function (object) {
        this.reinitializeState();
        this.doEncode(object, 1);
        return this.bytes.subarray(0, this.pos);
    };
    /**
     * @returns Encodes the object and returns a copy of the encoder's internal buffer.
     */
    Encoder.prototype.encode = function (object) {
        this.reinitializeState();
        this.doEncode(object, 1);
        return this.bytes.slice(0, this.pos);
    };
    Encoder.prototype.doEncode = function (object, depth) {
        if (depth > this.maxDepth) {
            throw new Error("Too deep objects in depth ".concat(depth));
        }
        if (object == null) {
            this.encodeNil();
        }
        else if (typeof object === "boolean") {
            this.encodeBoolean(object);
        }
        else if (typeof object === "number") {
            this.encodeNumber(object);
        }
        else if (typeof object === "string") {
            this.encodeString(object);
        }
        else {
            this.encodeObject(object, depth);
        }
    };
    Encoder.prototype.ensureBufferSizeToWrite = function (sizeToWrite) {
        var requiredSize = this.pos + sizeToWrite;
        if (this.view.byteLength < requiredSize) {
            this.resizeBuffer(requiredSize * 2);
        }
    };
    Encoder.prototype.resizeBuffer = function (newSize) {
        var newBuffer = new ArrayBuffer(newSize);
        var newBytes = new Uint8Array(newBuffer);
        var newView = new DataView(newBuffer);
        newBytes.set(this.bytes);
        this.view = newView;
        this.bytes = newBytes;
    };
    Encoder.prototype.encodeNil = function () {
        this.writeU8(0xc0);
    };
    Encoder.prototype.encodeBoolean = function (object) {
        if (object === false) {
            this.writeU8(0xc2);
        }
        else {
            this.writeU8(0xc3);
        }
    };
    Encoder.prototype.encodeNumber = function (object) {
        if (Number.isSafeInteger(object) && !this.forceIntegerToFloat) {
            if (object >= 0) {
                if (object < 0x80) {
                    // positive fixint
                    this.writeU8(object);
                }
                else if (object < 0x100) {
                    // uint 8
                    this.writeU8(0xcc);
                    this.writeU8(object);
                }
                else if (object < 0x10000) {
                    // uint 16
                    this.writeU8(0xcd);
                    this.writeU16(object);
                }
                else if (object < 0x100000000) {
                    // uint 32
                    this.writeU8(0xce);
                    this.writeU32(object);
                }
                else {
                    // uint 64
                    this.writeU8(0xcf);
                    this.writeU64(object);
                }
            }
            else {
                if (object >= -0x20) {
                    // negative fixint
                    this.writeU8(0xe0 | (object + 0x20));
                }
                else if (object >= -0x80) {
                    // int 8
                    this.writeU8(0xd0);
                    this.writeI8(object);
                }
                else if (object >= -0x8000) {
                    // int 16
                    this.writeU8(0xd1);
                    this.writeI16(object);
                }
                else if (object >= -0x80000000) {
                    // int 32
                    this.writeU8(0xd2);
                    this.writeI32(object);
                }
                else {
                    // int 64
                    this.writeU8(0xd3);
                    this.writeI64(object);
                }
            }
        }
        else {
            // non-integer numbers
            if (this.forceFloat32) {
                // float 32
                this.writeU8(0xca);
                this.writeF32(object);
            }
            else {
                // float 64
                this.writeU8(0xcb);
                this.writeF64(object);
            }
        }
    };
    Encoder.prototype.writeStringHeader = function (byteLength) {
        if (byteLength < 32) {
            // fixstr
            this.writeU8(0xa0 + byteLength);
        }
        else if (byteLength < 0x100) {
            // str 8
            this.writeU8(0xd9);
            this.writeU8(byteLength);
        }
        else if (byteLength < 0x10000) {
            // str 16
            this.writeU8(0xda);
            this.writeU16(byteLength);
        }
        else if (byteLength < 0x100000000) {
            // str 32
            this.writeU8(0xdb);
            this.writeU32(byteLength);
        }
        else {
            throw new Error("Too long string: ".concat(byteLength, " bytes in UTF-8"));
        }
    };
    Encoder.prototype.encodeString = function (object) {
        var maxHeaderSize = 1 + 4;
        var strLength = object.length;
        if (strLength > TEXT_ENCODER_THRESHOLD) {
            var byteLength = utf8Count(object);
            this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
            this.writeStringHeader(byteLength);
            utf8EncodeTE(object, this.bytes, this.pos);
            this.pos += byteLength;
        }
        else {
            var byteLength = utf8Count(object);
            this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
            this.writeStringHeader(byteLength);
            utf8EncodeJs(object, this.bytes, this.pos);
            this.pos += byteLength;
        }
    };
    Encoder.prototype.encodeObject = function (object, depth) {
        // try to encode objects with custom codec first of non-primitives
        var ext = this.extensionCodec.tryToEncode(object, this.context);
        if (ext != null) {
            this.encodeExtension(ext);
        }
        else if (Array.isArray(object)) {
            this.encodeArray(object, depth);
        }
        else if (ArrayBuffer.isView(object)) {
            this.encodeBinary(object);
        }
        else if (typeof object === "object") {
            this.encodeMap(object, depth);
        }
        else {
            // symbol, function and other special object come here unless extensionCodec handles them.
            throw new Error("Unrecognized object: ".concat(Object.prototype.toString.apply(object)));
        }
    };
    Encoder.prototype.encodeBinary = function (object) {
        var size = object.byteLength;
        if (size < 0x100) {
            // bin 8
            this.writeU8(0xc4);
            this.writeU8(size);
        }
        else if (size < 0x10000) {
            // bin 16
            this.writeU8(0xc5);
            this.writeU16(size);
        }
        else if (size < 0x100000000) {
            // bin 32
            this.writeU8(0xc6);
            this.writeU32(size);
        }
        else {
            throw new Error("Too large binary: ".concat(size));
        }
        var bytes = ensureUint8Array(object);
        this.writeU8a(bytes);
    };
    Encoder.prototype.encodeArray = function (object, depth) {
        var size = object.length;
        if (size < 16) {
            // fixarray
            this.writeU8(0x90 + size);
        }
        else if (size < 0x10000) {
            // array 16
            this.writeU8(0xdc);
            this.writeU16(size);
        }
        else if (size < 0x100000000) {
            // array 32
            this.writeU8(0xdd);
            this.writeU32(size);
        }
        else {
            throw new Error("Too large array: ".concat(size));
        }
        for (var _i = 0, object_1 = object; _i < object_1.length; _i++) {
            var item = object_1[_i];
            this.doEncode(item, depth + 1);
        }
    };
    Encoder.prototype.countWithoutUndefined = function (object, keys) {
        var count = 0;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (object[key] !== undefined) {
                count++;
            }
        }
        return count;
    };
    Encoder.prototype.encodeMap = function (object, depth) {
        var keys = Object.keys(object);
        if (this.sortKeys) {
            keys.sort();
        }
        var size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;
        if (size < 16) {
            // fixmap
            this.writeU8(0x80 + size);
        }
        else if (size < 0x10000) {
            // map 16
            this.writeU8(0xde);
            this.writeU16(size);
        }
        else if (size < 0x100000000) {
            // map 32
            this.writeU8(0xdf);
            this.writeU32(size);
        }
        else {
            throw new Error("Too large map object: ".concat(size));
        }
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var key = keys_2[_i];
            var value = object[key];
            if (!(this.ignoreUndefined && value === undefined)) {
                this.encodeString(key);
                this.doEncode(value, depth + 1);
            }
        }
    };
    Encoder.prototype.encodeExtension = function (ext) {
        var size = ext.data.length;
        if (size === 1) {
            // fixext 1
            this.writeU8(0xd4);
        }
        else if (size === 2) {
            // fixext 2
            this.writeU8(0xd5);
        }
        else if (size === 4) {
            // fixext 4
            this.writeU8(0xd6);
        }
        else if (size === 8) {
            // fixext 8
            this.writeU8(0xd7);
        }
        else if (size === 16) {
            // fixext 16
            this.writeU8(0xd8);
        }
        else if (size < 0x100) {
            // ext 8
            this.writeU8(0xc7);
            this.writeU8(size);
        }
        else if (size < 0x10000) {
            // ext 16
            this.writeU8(0xc8);
            this.writeU16(size);
        }
        else if (size < 0x100000000) {
            // ext 32
            this.writeU8(0xc9);
            this.writeU32(size);
        }
        else {
            throw new Error("Too large extension object: ".concat(size));
        }
        this.writeI8(ext.type);
        this.writeU8a(ext.data);
    };
    Encoder.prototype.writeU8 = function (value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setUint8(this.pos, value);
        this.pos++;
    };
    Encoder.prototype.writeU8a = function (values) {
        var size = values.length;
        this.ensureBufferSizeToWrite(size);
        this.bytes.set(values, this.pos);
        this.pos += size;
    };
    Encoder.prototype.writeI8 = function (value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setInt8(this.pos, value);
        this.pos++;
    };
    Encoder.prototype.writeU16 = function (value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setUint16(this.pos, value);
        this.pos += 2;
    };
    Encoder.prototype.writeI16 = function (value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setInt16(this.pos, value);
        this.pos += 2;
    };
    Encoder.prototype.writeU32 = function (value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setUint32(this.pos, value);
        this.pos += 4;
    };
    Encoder.prototype.writeI32 = function (value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setInt32(this.pos, value);
        this.pos += 4;
    };
    Encoder.prototype.writeF32 = function (value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setFloat32(this.pos, value);
        this.pos += 4;
    };
    Encoder.prototype.writeF64 = function (value) {
        this.ensureBufferSizeToWrite(8);
        this.view.setFloat64(this.pos, value);
        this.pos += 8;
    };
    Encoder.prototype.writeU64 = function (value) {
        this.ensureBufferSizeToWrite(8);
        setUint64(this.view, this.pos, value);
        this.pos += 8;
    };
    Encoder.prototype.writeI64 = function (value) {
        this.ensureBufferSizeToWrite(8);
        setInt64(this.view, this.pos, value);
        this.pos += 8;
    };
    return Encoder;
}());

var defaultEncodeOptions = {};
/**
 * It encodes `value` in the MessagePack format and
 * returns a byte buffer.
 *
 * The returned buffer is a slice of a larger `ArrayBuffer`, so you have to use its `#byteOffset` and `#byteLength` in order to convert it to another typed arrays including NodeJS `Buffer`.
 */
function encode$1(value, options) {
    if (options === void 0) { options = defaultEncodeOptions; }
    var encoder = new Encoder(options.extensionCodec, options.context, options.maxDepth, options.initialBufferSize, options.sortKeys, options.forceFloat32, options.ignoreUndefined, options.forceIntegerToFloat);
    return encoder.encodeSharedRef(value);
}

function prettyByte(byte) {
    return "".concat(byte < 0 ? "-" : "", "0x").concat(Math.abs(byte).toString(16).padStart(2, "0"));
}

var DEFAULT_MAX_KEY_LENGTH = 16;
var DEFAULT_MAX_LENGTH_PER_KEY = 16;
var CachedKeyDecoder = /** @class */ (function () {
    function CachedKeyDecoder(maxKeyLength, maxLengthPerKey) {
        if (maxKeyLength === void 0) { maxKeyLength = DEFAULT_MAX_KEY_LENGTH; }
        if (maxLengthPerKey === void 0) { maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY; }
        this.maxKeyLength = maxKeyLength;
        this.maxLengthPerKey = maxLengthPerKey;
        this.hit = 0;
        this.miss = 0;
        // avoid `new Array(N)`, which makes a sparse array,
        // because a sparse array is typically slower than a non-sparse array.
        this.caches = [];
        for (var i = 0; i < this.maxKeyLength; i++) {
            this.caches.push([]);
        }
    }
    CachedKeyDecoder.prototype.canBeCached = function (byteLength) {
        return byteLength > 0 && byteLength <= this.maxKeyLength;
    };
    CachedKeyDecoder.prototype.find = function (bytes, inputOffset, byteLength) {
        var records = this.caches[byteLength - 1];
        FIND_CHUNK: for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
            var record = records_1[_i];
            var recordBytes = record.bytes;
            for (var j = 0; j < byteLength; j++) {
                if (recordBytes[j] !== bytes[inputOffset + j]) {
                    continue FIND_CHUNK;
                }
            }
            return record.str;
        }
        return null;
    };
    CachedKeyDecoder.prototype.store = function (bytes, value) {
        var records = this.caches[bytes.length - 1];
        var record = { bytes: bytes, str: value };
        if (records.length >= this.maxLengthPerKey) {
            // `records` are full!
            // Set `record` to an arbitrary position.
            records[(Math.random() * records.length) | 0] = record;
        }
        else {
            records.push(record);
        }
    };
    CachedKeyDecoder.prototype.decode = function (bytes, inputOffset, byteLength) {
        var cachedValue = this.find(bytes, inputOffset, byteLength);
        if (cachedValue != null) {
            this.hit++;
            return cachedValue;
        }
        this.miss++;
        var str = utf8DecodeJs(bytes, inputOffset, byteLength);
        // Ensure to copy a slice of bytes because the byte may be NodeJS Buffer and Buffer#slice() returns a reference to its internal ArrayBuffer.
        var slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
        this.store(slicedCopyOfBytes, str);
        return str;
    };
    return CachedKeyDecoder;
}());

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (undefined && undefined.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (undefined && undefined.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); };
var __asyncGenerator = (undefined && undefined.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var isValidMapKeyType = function (key) {
    var keyType = typeof key;
    return keyType === "string" || keyType === "number";
};
var HEAD_BYTE_REQUIRED = -1;
var EMPTY_VIEW = new DataView(new ArrayBuffer(0));
var EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
// IE11: Hack to support IE11.
// IE11: Drop this hack and just use RangeError when IE11 is obsolete.
var DataViewIndexOutOfBoundsError = (function () {
    try {
        // IE11: The spec says it should throw RangeError,
        // IE11: but in IE11 it throws TypeError.
        EMPTY_VIEW.getInt8(0);
    }
    catch (e) {
        return e.constructor;
    }
    throw new Error("never reached");
})();
var MORE_DATA = new DataViewIndexOutOfBoundsError("Insufficient data");
var sharedCachedKeyDecoder = new CachedKeyDecoder();
var Decoder = /** @class */ (function () {
    function Decoder(extensionCodec, context, maxStrLength, maxBinLength, maxArrayLength, maxMapLength, maxExtLength, keyDecoder) {
        if (extensionCodec === void 0) { extensionCodec = ExtensionCodec.defaultCodec; }
        if (context === void 0) { context = undefined; }
        if (maxStrLength === void 0) { maxStrLength = UINT32_MAX; }
        if (maxBinLength === void 0) { maxBinLength = UINT32_MAX; }
        if (maxArrayLength === void 0) { maxArrayLength = UINT32_MAX; }
        if (maxMapLength === void 0) { maxMapLength = UINT32_MAX; }
        if (maxExtLength === void 0) { maxExtLength = UINT32_MAX; }
        if (keyDecoder === void 0) { keyDecoder = sharedCachedKeyDecoder; }
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
    Decoder.prototype.reinitializeState = function () {
        this.totalPos = 0;
        this.headByte = HEAD_BYTE_REQUIRED;
        this.stack.length = 0;
        // view, bytes, and pos will be re-initialized in setBuffer()
    };
    Decoder.prototype.setBuffer = function (buffer) {
        this.bytes = ensureUint8Array(buffer);
        this.view = createDataView(this.bytes);
        this.pos = 0;
    };
    Decoder.prototype.appendBuffer = function (buffer) {
        if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) {
            this.setBuffer(buffer);
        }
        else {
            var remainingData = this.bytes.subarray(this.pos);
            var newData = ensureUint8Array(buffer);
            // concat remainingData + newData
            var newBuffer = new Uint8Array(remainingData.length + newData.length);
            newBuffer.set(remainingData);
            newBuffer.set(newData, remainingData.length);
            this.setBuffer(newBuffer);
        }
    };
    Decoder.prototype.hasRemaining = function (size) {
        return this.view.byteLength - this.pos >= size;
    };
    Decoder.prototype.createExtraByteError = function (posToShow) {
        var _a = this, view = _a.view, pos = _a.pos;
        return new RangeError("Extra ".concat(view.byteLength - pos, " of ").concat(view.byteLength, " byte(s) found at buffer[").concat(posToShow, "]"));
    };
    /**
     * @throws {@link DecodeError}
     * @throws {@link RangeError}
     */
    Decoder.prototype.decode = function (buffer) {
        this.reinitializeState();
        this.setBuffer(buffer);
        var object = this.doDecodeSync();
        if (this.hasRemaining(1)) {
            throw this.createExtraByteError(this.pos);
        }
        return object;
    };
    Decoder.prototype.decodeMulti = function (buffer) {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.reinitializeState();
                    this.setBuffer(buffer);
                    _a.label = 1;
                case 1:
                    if (!this.hasRemaining(1)) return [3 /*break*/, 3];
                    return [4 /*yield*/, this.doDecodeSync()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    Decoder.prototype.decodeAsync = function (stream) {
        var stream_1, stream_1_1;
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var decoded, object, buffer, e_1_1, _b, headByte, pos, totalPos;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        decoded = false;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, 7, 12]);
                        stream_1 = __asyncValues(stream);
                        _c.label = 2;
                    case 2: return [4 /*yield*/, stream_1.next()];
                    case 3:
                        if (!(stream_1_1 = _c.sent(), !stream_1_1.done)) return [3 /*break*/, 5];
                        buffer = stream_1_1.value;
                        if (decoded) {
                            throw this.createExtraByteError(this.totalPos);
                        }
                        this.appendBuffer(buffer);
                        try {
                            object = this.doDecodeSync();
                            decoded = true;
                        }
                        catch (e) {
                            if (!(e instanceof DataViewIndexOutOfBoundsError)) {
                                throw e; // rethrow
                            }
                            // fallthrough
                        }
                        this.totalPos += this.pos;
                        _c.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _c.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _c.trys.push([7, , 10, 11]);
                        if (!(stream_1_1 && !stream_1_1.done && (_a = stream_1.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(stream_1)];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        if (decoded) {
                            if (this.hasRemaining(1)) {
                                throw this.createExtraByteError(this.totalPos);
                            }
                            return [2 /*return*/, object];
                        }
                        _b = this, headByte = _b.headByte, pos = _b.pos, totalPos = _b.totalPos;
                        throw new RangeError("Insufficient data in parsing ".concat(prettyByte(headByte), " at ").concat(totalPos, " (").concat(pos, " in the current buffer)"));
                }
            });
        });
    };
    Decoder.prototype.decodeArrayStream = function (stream) {
        return this.decodeMultiAsync(stream, true);
    };
    Decoder.prototype.decodeStream = function (stream) {
        return this.decodeMultiAsync(stream, false);
    };
    Decoder.prototype.decodeMultiAsync = function (stream, isArray) {
        return __asyncGenerator(this, arguments, function decodeMultiAsync_1() {
            var isArrayHeaderRequired, arrayItemsLeft, stream_2, stream_2_1, buffer, e_2, e_3_1;
            var e_3, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        isArrayHeaderRequired = isArray;
                        arrayItemsLeft = -1;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 13, 14, 19]);
                        stream_2 = __asyncValues(stream);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, __await(stream_2.next())];
                    case 3:
                        if (!(stream_2_1 = _b.sent(), !stream_2_1.done)) return [3 /*break*/, 12];
                        buffer = stream_2_1.value;
                        if (isArray && arrayItemsLeft === 0) {
                            throw this.createExtraByteError(this.totalPos);
                        }
                        this.appendBuffer(buffer);
                        if (isArrayHeaderRequired) {
                            arrayItemsLeft = this.readArraySize();
                            isArrayHeaderRequired = false;
                            this.complete();
                        }
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 9, , 10]);
                        _b.label = 5;
                    case 5:
                        return [4 /*yield*/, __await(this.doDecodeSync())];
                    case 6: return [4 /*yield*/, _b.sent()];
                    case 7:
                        _b.sent();
                        if (--arrayItemsLeft === 0) {
                            return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 5];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        e_2 = _b.sent();
                        if (!(e_2 instanceof DataViewIndexOutOfBoundsError)) {
                            throw e_2; // rethrow
                        }
                        return [3 /*break*/, 10];
                    case 10:
                        this.totalPos += this.pos;
                        _b.label = 11;
                    case 11: return [3 /*break*/, 2];
                    case 12: return [3 /*break*/, 19];
                    case 13:
                        e_3_1 = _b.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 19];
                    case 14:
                        _b.trys.push([14, , 17, 18]);
                        if (!(stream_2_1 && !stream_2_1.done && (_a = stream_2.return))) return [3 /*break*/, 16];
                        return [4 /*yield*/, __await(_a.call(stream_2))];
                    case 15:
                        _b.sent();
                        _b.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        if (e_3) throw e_3.error;
                        return [7 /*endfinally*/];
                    case 18: return [7 /*endfinally*/];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    Decoder.prototype.doDecodeSync = function () {
        DECODE: while (true) {
            var headByte = this.readHeadByte();
            var object = void 0;
            if (headByte >= 0xe0) {
                // negative fixint (111x xxxx) 0xe0 - 0xff
                object = headByte - 0x100;
            }
            else if (headByte < 0xc0) {
                if (headByte < 0x80) {
                    // positive fixint (0xxx xxxx) 0x00 - 0x7f
                    object = headByte;
                }
                else if (headByte < 0x90) {
                    // fixmap (1000 xxxx) 0x80 - 0x8f
                    var size = headByte - 0x80;
                    if (size !== 0) {
                        this.pushMapState(size);
                        this.complete();
                        continue DECODE;
                    }
                    else {
                        object = {};
                    }
                }
                else if (headByte < 0xa0) {
                    // fixarray (1001 xxxx) 0x90 - 0x9f
                    var size = headByte - 0x90;
                    if (size !== 0) {
                        this.pushArrayState(size);
                        this.complete();
                        continue DECODE;
                    }
                    else {
                        object = [];
                    }
                }
                else {
                    // fixstr (101x xxxx) 0xa0 - 0xbf
                    var byteLength = headByte - 0xa0;
                    object = this.decodeUtf8String(byteLength, 0);
                }
            }
            else if (headByte === 0xc0) {
                // nil
                object = null;
            }
            else if (headByte === 0xc2) {
                // false
                object = false;
            }
            else if (headByte === 0xc3) {
                // true
                object = true;
            }
            else if (headByte === 0xca) {
                // float 32
                object = this.readF32();
            }
            else if (headByte === 0xcb) {
                // float 64
                object = this.readF64();
            }
            else if (headByte === 0xcc) {
                // uint 8
                object = this.readU8();
            }
            else if (headByte === 0xcd) {
                // uint 16
                object = this.readU16();
            }
            else if (headByte === 0xce) {
                // uint 32
                object = this.readU32();
            }
            else if (headByte === 0xcf) {
                // uint 64
                object = this.readU64();
            }
            else if (headByte === 0xd0) {
                // int 8
                object = this.readI8();
            }
            else if (headByte === 0xd1) {
                // int 16
                object = this.readI16();
            }
            else if (headByte === 0xd2) {
                // int 32
                object = this.readI32();
            }
            else if (headByte === 0xd3) {
                // int 64
                object = this.readI64();
            }
            else if (headByte === 0xd9) {
                // str 8
                var byteLength = this.lookU8();
                object = this.decodeUtf8String(byteLength, 1);
            }
            else if (headByte === 0xda) {
                // str 16
                var byteLength = this.lookU16();
                object = this.decodeUtf8String(byteLength, 2);
            }
            else if (headByte === 0xdb) {
                // str 32
                var byteLength = this.lookU32();
                object = this.decodeUtf8String(byteLength, 4);
            }
            else if (headByte === 0xdc) {
                // array 16
                var size = this.readU16();
                if (size !== 0) {
                    this.pushArrayState(size);
                    this.complete();
                    continue DECODE;
                }
                else {
                    object = [];
                }
            }
            else if (headByte === 0xdd) {
                // array 32
                var size = this.readU32();
                if (size !== 0) {
                    this.pushArrayState(size);
                    this.complete();
                    continue DECODE;
                }
                else {
                    object = [];
                }
            }
            else if (headByte === 0xde) {
                // map 16
                var size = this.readU16();
                if (size !== 0) {
                    this.pushMapState(size);
                    this.complete();
                    continue DECODE;
                }
                else {
                    object = {};
                }
            }
            else if (headByte === 0xdf) {
                // map 32
                var size = this.readU32();
                if (size !== 0) {
                    this.pushMapState(size);
                    this.complete();
                    continue DECODE;
                }
                else {
                    object = {};
                }
            }
            else if (headByte === 0xc4) {
                // bin 8
                var size = this.lookU8();
                object = this.decodeBinary(size, 1);
            }
            else if (headByte === 0xc5) {
                // bin 16
                var size = this.lookU16();
                object = this.decodeBinary(size, 2);
            }
            else if (headByte === 0xc6) {
                // bin 32
                var size = this.lookU32();
                object = this.decodeBinary(size, 4);
            }
            else if (headByte === 0xd4) {
                // fixext 1
                object = this.decodeExtension(1, 0);
            }
            else if (headByte === 0xd5) {
                // fixext 2
                object = this.decodeExtension(2, 0);
            }
            else if (headByte === 0xd6) {
                // fixext 4
                object = this.decodeExtension(4, 0);
            }
            else if (headByte === 0xd7) {
                // fixext 8
                object = this.decodeExtension(8, 0);
            }
            else if (headByte === 0xd8) {
                // fixext 16
                object = this.decodeExtension(16, 0);
            }
            else if (headByte === 0xc7) {
                // ext 8
                var size = this.lookU8();
                object = this.decodeExtension(size, 1);
            }
            else if (headByte === 0xc8) {
                // ext 16
                var size = this.lookU16();
                object = this.decodeExtension(size, 2);
            }
            else if (headByte === 0xc9) {
                // ext 32
                var size = this.lookU32();
                object = this.decodeExtension(size, 4);
            }
            else {
                throw new DecodeError("Unrecognized type byte: ".concat(prettyByte(headByte)));
            }
            this.complete();
            var stack = this.stack;
            while (stack.length > 0) {
                // arrays and maps
                var state = stack[stack.length - 1];
                if (state.type === 0 /* State.ARRAY */) {
                    state.array[state.position] = object;
                    state.position++;
                    if (state.position === state.size) {
                        stack.pop();
                        object = state.array;
                    }
                    else {
                        continue DECODE;
                    }
                }
                else if (state.type === 1 /* State.MAP_KEY */) {
                    if (!isValidMapKeyType(object)) {
                        throw new DecodeError("The type of key must be string or number but " + typeof object);
                    }
                    if (object === "__proto__") {
                        throw new DecodeError("The key __proto__ is not allowed");
                    }
                    state.key = object;
                    state.type = 2 /* State.MAP_VALUE */;
                    continue DECODE;
                }
                else {
                    // it must be `state.type === State.MAP_VALUE` here
                    state.map[state.key] = object;
                    state.readCount++;
                    if (state.readCount === state.size) {
                        stack.pop();
                        object = state.map;
                    }
                    else {
                        state.key = null;
                        state.type = 1 /* State.MAP_KEY */;
                        continue DECODE;
                    }
                }
            }
            return object;
        }
    };
    Decoder.prototype.readHeadByte = function () {
        if (this.headByte === HEAD_BYTE_REQUIRED) {
            this.headByte = this.readU8();
            // console.log("headByte", prettyByte(this.headByte));
        }
        return this.headByte;
    };
    Decoder.prototype.complete = function () {
        this.headByte = HEAD_BYTE_REQUIRED;
    };
    Decoder.prototype.readArraySize = function () {
        var headByte = this.readHeadByte();
        switch (headByte) {
            case 0xdc:
                return this.readU16();
            case 0xdd:
                return this.readU32();
            default: {
                if (headByte < 0xa0) {
                    return headByte - 0x90;
                }
                else {
                    throw new DecodeError("Unrecognized array type byte: ".concat(prettyByte(headByte)));
                }
            }
        }
    };
    Decoder.prototype.pushMapState = function (size) {
        if (size > this.maxMapLength) {
            throw new DecodeError("Max length exceeded: map length (".concat(size, ") > maxMapLengthLength (").concat(this.maxMapLength, ")"));
        }
        this.stack.push({
            type: 1 /* State.MAP_KEY */,
            size: size,
            key: null,
            readCount: 0,
            map: {},
        });
    };
    Decoder.prototype.pushArrayState = function (size) {
        if (size > this.maxArrayLength) {
            throw new DecodeError("Max length exceeded: array length (".concat(size, ") > maxArrayLength (").concat(this.maxArrayLength, ")"));
        }
        this.stack.push({
            type: 0 /* State.ARRAY */,
            size: size,
            array: new Array(size),
            position: 0,
        });
    };
    Decoder.prototype.decodeUtf8String = function (byteLength, headerOffset) {
        var _a;
        if (byteLength > this.maxStrLength) {
            throw new DecodeError("Max length exceeded: UTF-8 byte length (".concat(byteLength, ") > maxStrLength (").concat(this.maxStrLength, ")"));
        }
        if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
            throw MORE_DATA;
        }
        var offset = this.pos + headerOffset;
        var object;
        if (this.stateIsMapKey() && ((_a = this.keyDecoder) === null || _a === void 0 ? void 0 : _a.canBeCached(byteLength))) {
            object = this.keyDecoder.decode(this.bytes, offset, byteLength);
        }
        else if (byteLength > TEXT_DECODER_THRESHOLD) {
            object = utf8DecodeTD(this.bytes, offset, byteLength);
        }
        else {
            object = utf8DecodeJs(this.bytes, offset, byteLength);
        }
        this.pos += headerOffset + byteLength;
        return object;
    };
    Decoder.prototype.stateIsMapKey = function () {
        if (this.stack.length > 0) {
            var state = this.stack[this.stack.length - 1];
            return state.type === 1 /* State.MAP_KEY */;
        }
        return false;
    };
    Decoder.prototype.decodeBinary = function (byteLength, headOffset) {
        if (byteLength > this.maxBinLength) {
            throw new DecodeError("Max length exceeded: bin length (".concat(byteLength, ") > maxBinLength (").concat(this.maxBinLength, ")"));
        }
        if (!this.hasRemaining(byteLength + headOffset)) {
            throw MORE_DATA;
        }
        var offset = this.pos + headOffset;
        var object = this.bytes.subarray(offset, offset + byteLength);
        this.pos += headOffset + byteLength;
        return object;
    };
    Decoder.prototype.decodeExtension = function (size, headOffset) {
        if (size > this.maxExtLength) {
            throw new DecodeError("Max length exceeded: ext length (".concat(size, ") > maxExtLength (").concat(this.maxExtLength, ")"));
        }
        var extType = this.view.getInt8(this.pos + headOffset);
        var data = this.decodeBinary(size, headOffset + 1 /* extType */);
        return this.extensionCodec.decode(data, extType, this.context);
    };
    Decoder.prototype.lookU8 = function () {
        return this.view.getUint8(this.pos);
    };
    Decoder.prototype.lookU16 = function () {
        return this.view.getUint16(this.pos);
    };
    Decoder.prototype.lookU32 = function () {
        return this.view.getUint32(this.pos);
    };
    Decoder.prototype.readU8 = function () {
        var value = this.view.getUint8(this.pos);
        this.pos++;
        return value;
    };
    Decoder.prototype.readI8 = function () {
        var value = this.view.getInt8(this.pos);
        this.pos++;
        return value;
    };
    Decoder.prototype.readU16 = function () {
        var value = this.view.getUint16(this.pos);
        this.pos += 2;
        return value;
    };
    Decoder.prototype.readI16 = function () {
        var value = this.view.getInt16(this.pos);
        this.pos += 2;
        return value;
    };
    Decoder.prototype.readU32 = function () {
        var value = this.view.getUint32(this.pos);
        this.pos += 4;
        return value;
    };
    Decoder.prototype.readI32 = function () {
        var value = this.view.getInt32(this.pos);
        this.pos += 4;
        return value;
    };
    Decoder.prototype.readU64 = function () {
        var value = getUint64(this.view, this.pos);
        this.pos += 8;
        return value;
    };
    Decoder.prototype.readI64 = function () {
        var value = getInt64(this.view, this.pos);
        this.pos += 8;
        return value;
    };
    Decoder.prototype.readF32 = function () {
        var value = this.view.getFloat32(this.pos);
        this.pos += 4;
        return value;
    };
    Decoder.prototype.readF64 = function () {
        var value = this.view.getFloat64(this.pos);
        this.pos += 8;
        return value;
    };
    return Decoder;
}());

var defaultDecodeOptions = {};
/**
 * It decodes a single MessagePack object in a buffer.
 *
 * This is a synchronous decoding function.
 * See other variants for asynchronous decoding: {@link decodeAsync()}, {@link decodeStream()}, or {@link decodeArrayStream()}.
 *
 * @throws {@link RangeError} if the buffer is incomplete, including the case where the buffer is empty.
 * @throws {@link DecodeError} if the buffer contains invalid data.
 */
function decode$1(buffer, options) {
    if (options === void 0) { options = defaultDecodeOptions; }
    var decoder = new Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decode(buffer);
}

const __HC_LAUNCHER_ENV__ = "__HC_LAUNCHER_ENV__";
const isLauncher = typeof window === "object" && __HC_LAUNCHER_ENV__ in window;
const getLauncherEnvironment = () => isLauncher ? window[__HC_LAUNCHER_ENV__] : undefined;
const signZomeCallTauri = async (request) => {
    const zomeCallUnsigned = {
        provenance: Array.from(request.provenance),
        cell_id: [Array.from(request.cell_id[0]), Array.from(request.cell_id[1])],
        zome_name: request.zome_name,
        fn_name: request.fn_name,
        payload: Array.from(encode$1(request.payload)),
        nonce: Array.from(await randomNonce()),
        expires_at: getNonceExpiration(),
    };
    const signedZomeCallTauri = await d("sign_zome_call", { zomeCallUnsigned });
    const signedZomeCall = {
        provenance: Uint8Array.from(signedZomeCallTauri.provenance),
        cap_secret: null,
        cell_id: [
            Uint8Array.from(signedZomeCallTauri.cell_id[0]),
            Uint8Array.from(signedZomeCallTauri.cell_id[1]),
        ],
        zome_name: signedZomeCallTauri.zome_name,
        fn_name: signedZomeCallTauri.fn_name,
        payload: Uint8Array.from(signedZomeCallTauri.payload),
        signature: Uint8Array.from(signedZomeCallTauri.signature),
        expires_at: signedZomeCallTauri.expires_at,
        nonce: Uint8Array.from(signedZomeCallTauri.nonce),
    };
    return signedZomeCall;
};

/**
 * @public
 */
var GrantedFunctionsType;
(function (GrantedFunctionsType) {
    GrantedFunctionsType["All"] = "All";
    GrantedFunctionsType["Listed"] = "Listed";
})(GrantedFunctionsType || (GrantedFunctionsType = {}));

const anyMap = new WeakMap();
const eventsMap = new WeakMap();
const producersMap = new WeakMap();

const anyProducer = Symbol('anyProducer');
const resolvedPromise = Promise.resolve();

// Define symbols for "meta" events.
const listenerAdded = Symbol('listenerAdded');
const listenerRemoved = Symbol('listenerRemoved');

let canEmitMetaEvents = false;
let isGlobalDebugEnabled = false;

function assertEventName(eventName) {
	if (typeof eventName !== 'string' && typeof eventName !== 'symbol' && typeof eventName !== 'number') {
		throw new TypeError('`eventName` must be a string, symbol, or number');
	}
}

function assertListener(listener) {
	if (typeof listener !== 'function') {
		throw new TypeError('listener must be a function');
	}
}

function getListeners(instance, eventName) {
	const events = eventsMap.get(instance);
	if (!events.has(eventName)) {
		return;
	}

	return events.get(eventName);
}

function getEventProducers(instance, eventName) {
	const key = typeof eventName === 'string' || typeof eventName === 'symbol' || typeof eventName === 'number' ? eventName : anyProducer;
	const producers = producersMap.get(instance);
	if (!producers.has(key)) {
		return;
	}

	return producers.get(key);
}

function enqueueProducers(instance, eventName, eventData) {
	const producers = producersMap.get(instance);
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

function iterator(instance, eventNames) {
	eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

	let isFinished = false;
	let flush = () => {};
	let queue = [];

	const producer = {
		enqueue(item) {
			queue.push(item);
			flush();
		},
		finish() {
			isFinished = true;
			flush();
		},
	};

	for (const eventName of eventNames) {
		let set = getEventProducers(instance, eventName);
		if (!set) {
			set = new Set();
			const producers = producersMap.get(instance);
			producers.set(eventName, set);
		}

		set.add(producer);
	}

	return {
		async next() {
			if (!queue) {
				return {done: true};
			}

			if (queue.length === 0) {
				if (isFinished) {
					queue = undefined;
					return this.next();
				}

				await new Promise(resolve => {
					flush = resolve;
				});

				return this.next();
			}

			return {
				done: false,
				value: await queue.shift(),
			};
		},

		async return(value) {
			queue = undefined;

			for (const eventName of eventNames) {
				const set = getEventProducers(instance, eventName);
				if (set) {
					set.delete(producer);
					if (set.size === 0) {
						const producers = producersMap.get(instance);
						producers.delete(eventName);
					}
				}
			}

			flush();

			return arguments.length > 0
				? {done: true, value: await value}
				: {done: true};
		},

		[Symbol.asyncIterator]() {
			return this;
		},
	};
}

function defaultMethodNamesOrAssert(methodNames) {
	if (methodNames === undefined) {
		return allEmitteryMethods;
	}

	if (!Array.isArray(methodNames)) {
		throw new TypeError('`methodNames` must be an array of strings');
	}

	for (const methodName of methodNames) {
		if (!allEmitteryMethods.includes(methodName)) {
			if (typeof methodName !== 'string') {
				throw new TypeError('`methodNames` element must be a string');
			}

			throw new Error(`${methodName} is not Emittery method`);
		}
	}

	return methodNames;
}

const isMetaEvent = eventName => eventName === listenerAdded || eventName === listenerRemoved;

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

class Emittery {
	static mixin(emitteryPropertyName, methodNames) {
		methodNames = defaultMethodNamesOrAssert(methodNames);
		return target => {
			if (typeof target !== 'function') {
				throw new TypeError('`target` must be function');
			}

			for (const methodName of methodNames) {
				if (target.prototype[methodName] !== undefined) {
					throw new Error(`The property \`${methodName}\` already exists on \`target\``);
				}
			}

			function getEmitteryProperty() {
				Object.defineProperty(this, emitteryPropertyName, {
					enumerable: false,
					value: new Emittery(),
				});
				return this[emitteryPropertyName];
			}

			Object.defineProperty(target.prototype, emitteryPropertyName, {
				enumerable: false,
				get: getEmitteryProperty,
			});

			const emitteryMethodCaller = methodName => function (...args) {
				return this[emitteryPropertyName][methodName](...args);
			};

			for (const methodName of methodNames) {
				Object.defineProperty(target.prototype, methodName, {
					enumerable: false,
					value: emitteryMethodCaller(methodName),
				});
			}

			return target;
		};
	}

	static get isDebugEnabled() {
		// In a browser environment, `globalThis.process` can potentially reference a DOM Element with a `#process` ID,
		// so instead of just type checking `globalThis.process`, we need to make sure that `globalThis.process.env` exists.
		// eslint-disable-next-line n/prefer-global/process
		if (typeof globalThis.process?.env !== 'object') {
			return isGlobalDebugEnabled;
		}

		// eslint-disable-next-line n/prefer-global/process
		const {env} = globalThis.process ?? {env: {}};
		return env.DEBUG === 'emittery' || env.DEBUG === '*' || isGlobalDebugEnabled;
	}

	static set isDebugEnabled(newValue) {
		isGlobalDebugEnabled = newValue;
	}

	constructor(options = {}) {
		anyMap.set(this, new Set());
		eventsMap.set(this, new Map());
		producersMap.set(this, new Map());

		producersMap.get(this).set(anyProducer, new Set());

		this.debug = options.debug ?? {};

		if (this.debug.enabled === undefined) {
			this.debug.enabled = false;
		}

		if (!this.debug.logger) {
			this.debug.logger = (type, debugName, eventName, eventData) => {
				try {
					// TODO: Use https://github.com/sindresorhus/safe-stringify when the package is more mature. Just copy-paste the code.
					eventData = JSON.stringify(eventData);
				} catch {
					eventData = `Object with the following keys failed to stringify: ${Object.keys(eventData).join(',')}`;
				}

				if (typeof eventName === 'symbol' || typeof eventName === 'number') {
					eventName = eventName.toString();
				}

				const currentTime = new Date();
				const logTime = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}.${currentTime.getMilliseconds()}`;
				console.log(`[${logTime}][emittery:${type}][${debugName}] Event Name: ${eventName}\n\tdata: ${eventData}`);
			};
		}
	}

	logIfDebugEnabled(type, eventName, eventData) {
		if (Emittery.isDebugEnabled || this.debug.enabled) {
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
				set = new Set();
				const events = eventsMap.get(this);
				events.set(eventName, set);
			}

			set.add(listener);

			this.logIfDebugEnabled('subscribe', eventName, undefined);

			if (!isMetaEvent(eventName)) {
				emitMetaEvent(this, listenerAdded, {eventName, listener});
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

			this.logIfDebugEnabled('unsubscribe', eventName, undefined);

			if (!isMetaEvent(eventName)) {
				emitMetaEvent(this, listenerRemoved, {eventName, listener});
			}
		}
	}

	once(eventNames) {
		let off_;

		const promise = new Promise(resolve => {
			off_ = this.on(eventNames, data => {
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
			throw new TypeError('`eventName` cannot be meta event `listenerAdded` or `listenerRemoved`');
		}

		this.logIfDebugEnabled('emit', eventName, eventData);

		enqueueProducers(this, eventName, eventData);

		const listeners = getListeners(this, eventName) ?? new Set();
		const anyListeners = anyMap.get(this);
		const staticListeners = [...listeners];
		const staticAnyListeners = isMetaEvent(eventName) ? [] : [...anyListeners];

		await resolvedPromise;
		await Promise.all([
			...staticListeners.map(async listener => {
				if (listeners.has(listener)) {
					return listener(eventData);
				}
			}),
			...staticAnyListeners.map(async listener => {
				if (anyListeners.has(listener)) {
					return listener(eventName, eventData);
				}
			}),
		]);
	}

	async emitSerial(eventName, eventData) {
		assertEventName(eventName);

		if (isMetaEvent(eventName) && !canEmitMetaEvents) {
			throw new TypeError('`eventName` cannot be meta event `listenerAdded` or `listenerRemoved`');
		}

		this.logIfDebugEnabled('emitSerial', eventName, eventData);

		const listeners = getListeners(this, eventName) ?? new Set();
		const anyListeners = anyMap.get(this);
		const staticListeners = [...listeners];
		const staticAnyListeners = [...anyListeners];

		await resolvedPromise;
		/* eslint-disable no-await-in-loop */
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
		/* eslint-enable no-await-in-loop */
	}

	onAny(listener) {
		assertListener(listener);

		this.logIfDebugEnabled('subscribeAny', undefined, undefined);

		anyMap.get(this).add(listener);
		emitMetaEvent(this, listenerAdded, {listener});
		return this.offAny.bind(this, listener);
	}

	anyEvent() {
		return iterator(this);
	}

	offAny(listener) {
		assertListener(listener);

		this.logIfDebugEnabled('unsubscribeAny', undefined, undefined);

		emitMetaEvent(this, listenerRemoved, {listener});
		anyMap.get(this).delete(listener);
	}

	clearListeners(eventNames) {
		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

		for (const eventName of eventNames) {
			this.logIfDebugEnabled('clear', eventName, undefined);

			if (typeof eventName === 'string' || typeof eventName === 'symbol' || typeof eventName === 'number') {
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

				for (const [eventName, listeners] of eventsMap.get(this).entries()) {
					listeners.clear();
					eventsMap.get(this).delete(eventName);
				}

				for (const [eventName, producers] of producersMap.get(this).entries()) {
					for (const producer of producers) {
						producer.finish();
					}

					producers.clear();
					producersMap.get(this).delete(eventName);
				}
			}
		}
	}

	listenerCount(eventNames) {
		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
		let count = 0;

		for (const eventName of eventNames) {
			if (typeof eventName === 'string') {
				count += anyMap.get(this).size
					+ (getListeners(this, eventName)?.size ?? 0)
					+ (getEventProducers(this, eventName)?.size ?? 0)
					+ (getEventProducers(this)?.size ?? 0);

				continue;
			}

			if (typeof eventName !== 'undefined') {
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
		if (typeof target !== 'object' || target === null) {
			throw new TypeError('`target` must be an object');
		}

		methodNames = defaultMethodNamesOrAssert(methodNames);

		for (const methodName of methodNames) {
			if (target[methodName] !== undefined) {
				throw new Error(`The property \`${methodName}\` already exists on \`target\``);
			}

			Object.defineProperty(target, methodName, {
				enumerable: false,
				value: this[methodName].bind(this),
			});
		}
	}
}

const allEmitteryMethods = Object.getOwnPropertyNames(Emittery.prototype).filter(v => v !== 'constructor');

Object.defineProperty(Emittery, 'listenerAdded', {
	value: listenerAdded,
	writable: false,
	enumerable: true,
	configurable: false,
});
Object.defineProperty(Emittery, 'listenerRemoved', {
	value: listenerRemoved,
	writable: false,
	enumerable: true,
	configurable: false,
});

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var node = require$$0;

/**
 * @public
 */
const SignalType = {
    App: "App",
    System: "System",
};

/**
 * A Websocket client which can make requests and receive responses,
 * as well as send and receive signals.
 *
 * Uses Holochain's websocket WireMessage for communication.
 *
 * @public
 */
class WsClient extends Emittery {
    socket;
    pendingRequests;
    index;
    constructor(socket) {
        super();
        this.socket = socket;
        this.pendingRequests = {};
        this.index = 0;
        //@ts-ignore
        socket.on("message", async (serializedMessage) => {
            // If data is not a buffer (nodejs), it will be a blob (browser)
            let deserializedData;
            if (typeof window === "object" &&
                serializedMessage.data instanceof window.Blob) {
                deserializedData = await serializedMessage.data.arrayBuffer();
            }
            else {
                if (typeof Buffer !== "undefined" &&
                    Buffer.isBuffer(serializedMessage.data)) {
                    deserializedData = serializedMessage.data;
                }
                else {
                    throw new Error("websocket client: unknown message format");
                }
            }
            const message = decode$1(deserializedData);
            assertHolochainMessage(message);
            if (message.type === "signal") {
                if (message.data === null) {
                    throw new Error("received a signal without data");
                }
                const deserializedSignal = decode$1(message.data);
                assertHolochainSignal(deserializedSignal);
                if (SignalType.System in deserializedSignal) {
                    // We have received a system signal, do nothing
                    return;
                }
                const encodedAppSignal = deserializedSignal[SignalType.App];
                // In order to return readable content to the UI, the signal payload must also be deserialized.
                const payload = decode$1(encodedAppSignal.signal);
                const signal = {
                    cell_id: encodedAppSignal.cell_id,
                    zome_name: encodedAppSignal.zome_name,
                    payload,
                };
                this.emit("signal", signal);
            }
            else if (message.type === "response") {
                this.handleResponse(message);
            }
            else {
                console.error(`Got unrecognized Websocket message type: ${message.type}`);
            }
        });
        //@ts-ignore
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
            const socket = new node.StandardWebSocketClient(url);
            // make sure that there are no uncaught connection
            // errors because that causes nodejs thread to crash
            // with uncaught exception
            socket.on("error", () => {
                reject(new Error(`could not connect to holochain conductor, please check that a conductor service is running and available at ${url}`));
            });
            socket.on("open", () => {
                const client = new WsClient(socket);
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
        const encodedMsg = encode$1({
            type: "signal",
            data: encode$1(data),
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
            const encodedMsg = encode$1({
                id,
                type: "request",
                data: encode$1(request),
            });
            const promise = new Promise((resolve, reject) => {
                this.pendingRequests[id] = { resolve, reject };
            });
            this.socket.send(encodedMsg);
            this.index += 1;
            return promise;
        }
        else {
            return Promise.reject(new Error("Socket is not open"));
        }
    }
    handleResponse(msg) {
        const id = msg.id;
        if (this.pendingRequests[id]) {
            if (msg.data === null || msg.data === undefined) {
                this.pendingRequests[id].reject(new Error("Response canceled by responder"));
            }
            else {
                this.pendingRequests[id].resolve(decode$1(msg.data));
            }
            delete this.pendingRequests[id];
        }
        else {
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
}
function assertHolochainMessage(message) {
    if (typeof message === "object" &&
        message !== null &&
        "type" in message &&
        "data" in message) {
        return;
    }
    throw new Error(`unknown message format ${JSON.stringify(message, null, 4)}`);
}
function assertHolochainSignal(signal) {
    if (typeof signal === "object" &&
        signal !== null &&
        Object.values(SignalType).some((type) => type in signal)) {
        return;
    }
    throw new Error(`unknown signal format ${JSON.stringify(signal, null, 4)}`);
}

const ERROR_TYPE = "error";
const DEFAULT_TIMEOUT = 15000;
/**
 * Take a Requester function which deals with tagged requests and responses,
 * and return a Requester which deals only with the inner data types, also
 * with the optional Transformer applied to further modify the input and output.
 *
 * @public
 */
const requesterTransformer = (requester, tag, transform = identityTransformer) => async (req, timeout) => {
    const transformedInput = await transform.input(req);
    const input = { type: tag, data: transformedInput };
    const response = await requester(input, timeout);
    const output = transform.output(response.data);
    return output;
};
const identity$1 = (x) => x;
const identityTransformer = {
    input: identity$1,
    output: identity$1,
};
const catchError = (res) => {
    return res.type === ERROR_TYPE ? Promise.reject(res) : Promise.resolve(res);
};
const promiseTimeout = (promise, tag, ms) => {
    let id;
    const timeout = new Promise((_, reject) => {
        id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error(`Timed out in ${ms}ms: ${tag}`));
        }, ms);
    });
    return new Promise((res, rej) => {
        Promise.race([promise, timeout])
            .then((a) => {
            clearTimeout(id);
            return res(a);
        })
            .catch((e) => {
            return rej(e);
        });
    });
};
const CLONE_ID_DELIMITER = ".";
/**
 * Check if a cell's role name is a valid clone id.
 *
 * @param roleName - The role name to check.
 *
 * @public
 */
const isCloneId = (roleName) => roleName.includes(CLONE_ID_DELIMITER);
/**
 * Parse a clone id and get the role name part of it.
 *
 * @param roleName - The role name to parse.
 * @public
 */
const getBaseRoleNameFromCloneId = (roleName) => {
    if (!isCloneId(roleName)) {
        throw new Error("invalid clone id: no clone id delimiter found in role name");
    }
    return roleName.split(CLONE_ID_DELIMITER)[0];
};
/**
 * Identifier of a clone cell, composed of the DNA's role id and the index
 * of the clone, starting at 0.
 *
 * Example: `profiles.0`
 *
 * @public
 */
class CloneId {
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
        return new CloneId(parts[0], parseInt(parts[1]));
    }
    toString() {
        return `${this.roleName}${CLONE_ID_DELIMITER}${this.index}`;
    }
    getBaseRoleName() {
        return this.roleName;
    }
}

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var naclFast = {exports: {}};

(function (module) {
	(function(nacl) {

	// Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
	// Public domain.
	//
	// Implementation derived from TweetNaCl version 20140427.
	// See for details: http://tweetnacl.cr.yp.to/

	var gf = function(init) {
	  var i, r = new Float64Array(16);
	  if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
	  return r;
	};

	//  Pluggable, initialized in high-level API below.
	var randombytes = function(/* x, n */) { throw new Error('no PRNG'); };

	var _0 = new Uint8Array(16);
	var _9 = new Uint8Array(32); _9[0] = 9;

	var gf0 = gf(),
	    gf1 = gf([1]),
	    _121665 = gf([0xdb41, 1]),
	    D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
	    D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]),
	    X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]),
	    Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]),
	    I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

	function ts64(x, i, h, l) {
	  x[i]   = (h >> 24) & 0xff;
	  x[i+1] = (h >> 16) & 0xff;
	  x[i+2] = (h >>  8) & 0xff;
	  x[i+3] = h & 0xff;
	  x[i+4] = (l >> 24)  & 0xff;
	  x[i+5] = (l >> 16)  & 0xff;
	  x[i+6] = (l >>  8)  & 0xff;
	  x[i+7] = l & 0xff;
	}

	function vn(x, xi, y, yi, n) {
	  var i,d = 0;
	  for (i = 0; i < n; i++) d |= x[xi+i]^y[yi+i];
	  return (1 & ((d - 1) >>> 8)) - 1;
	}

	function crypto_verify_16(x, xi, y, yi) {
	  return vn(x,xi,y,yi,16);
	}

	function crypto_verify_32(x, xi, y, yi) {
	  return vn(x,xi,y,yi,32);
	}

	function core_salsa20(o, p, k, c) {
	  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
	      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
	      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
	      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
	      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
	      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
	      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
	      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
	      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
	      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
	      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
	      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
	      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
	      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
	      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
	      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

	  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
	      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
	      x15 = j15, u;

	  for (var i = 0; i < 20; i += 2) {
	    u = x0 + x12 | 0;
	    x4 ^= u<<7 | u>>>(32-7);
	    u = x4 + x0 | 0;
	    x8 ^= u<<9 | u>>>(32-9);
	    u = x8 + x4 | 0;
	    x12 ^= u<<13 | u>>>(32-13);
	    u = x12 + x8 | 0;
	    x0 ^= u<<18 | u>>>(32-18);

	    u = x5 + x1 | 0;
	    x9 ^= u<<7 | u>>>(32-7);
	    u = x9 + x5 | 0;
	    x13 ^= u<<9 | u>>>(32-9);
	    u = x13 + x9 | 0;
	    x1 ^= u<<13 | u>>>(32-13);
	    u = x1 + x13 | 0;
	    x5 ^= u<<18 | u>>>(32-18);

	    u = x10 + x6 | 0;
	    x14 ^= u<<7 | u>>>(32-7);
	    u = x14 + x10 | 0;
	    x2 ^= u<<9 | u>>>(32-9);
	    u = x2 + x14 | 0;
	    x6 ^= u<<13 | u>>>(32-13);
	    u = x6 + x2 | 0;
	    x10 ^= u<<18 | u>>>(32-18);

	    u = x15 + x11 | 0;
	    x3 ^= u<<7 | u>>>(32-7);
	    u = x3 + x15 | 0;
	    x7 ^= u<<9 | u>>>(32-9);
	    u = x7 + x3 | 0;
	    x11 ^= u<<13 | u>>>(32-13);
	    u = x11 + x7 | 0;
	    x15 ^= u<<18 | u>>>(32-18);

	    u = x0 + x3 | 0;
	    x1 ^= u<<7 | u>>>(32-7);
	    u = x1 + x0 | 0;
	    x2 ^= u<<9 | u>>>(32-9);
	    u = x2 + x1 | 0;
	    x3 ^= u<<13 | u>>>(32-13);
	    u = x3 + x2 | 0;
	    x0 ^= u<<18 | u>>>(32-18);

	    u = x5 + x4 | 0;
	    x6 ^= u<<7 | u>>>(32-7);
	    u = x6 + x5 | 0;
	    x7 ^= u<<9 | u>>>(32-9);
	    u = x7 + x6 | 0;
	    x4 ^= u<<13 | u>>>(32-13);
	    u = x4 + x7 | 0;
	    x5 ^= u<<18 | u>>>(32-18);

	    u = x10 + x9 | 0;
	    x11 ^= u<<7 | u>>>(32-7);
	    u = x11 + x10 | 0;
	    x8 ^= u<<9 | u>>>(32-9);
	    u = x8 + x11 | 0;
	    x9 ^= u<<13 | u>>>(32-13);
	    u = x9 + x8 | 0;
	    x10 ^= u<<18 | u>>>(32-18);

	    u = x15 + x14 | 0;
	    x12 ^= u<<7 | u>>>(32-7);
	    u = x12 + x15 | 0;
	    x13 ^= u<<9 | u>>>(32-9);
	    u = x13 + x12 | 0;
	    x14 ^= u<<13 | u>>>(32-13);
	    u = x14 + x13 | 0;
	    x15 ^= u<<18 | u>>>(32-18);
	  }
	   x0 =  x0 +  j0 | 0;
	   x1 =  x1 +  j1 | 0;
	   x2 =  x2 +  j2 | 0;
	   x3 =  x3 +  j3 | 0;
	   x4 =  x4 +  j4 | 0;
	   x5 =  x5 +  j5 | 0;
	   x6 =  x6 +  j6 | 0;
	   x7 =  x7 +  j7 | 0;
	   x8 =  x8 +  j8 | 0;
	   x9 =  x9 +  j9 | 0;
	  x10 = x10 + j10 | 0;
	  x11 = x11 + j11 | 0;
	  x12 = x12 + j12 | 0;
	  x13 = x13 + j13 | 0;
	  x14 = x14 + j14 | 0;
	  x15 = x15 + j15 | 0;

	  o[ 0] = x0 >>>  0 & 0xff;
	  o[ 1] = x0 >>>  8 & 0xff;
	  o[ 2] = x0 >>> 16 & 0xff;
	  o[ 3] = x0 >>> 24 & 0xff;

	  o[ 4] = x1 >>>  0 & 0xff;
	  o[ 5] = x1 >>>  8 & 0xff;
	  o[ 6] = x1 >>> 16 & 0xff;
	  o[ 7] = x1 >>> 24 & 0xff;

	  o[ 8] = x2 >>>  0 & 0xff;
	  o[ 9] = x2 >>>  8 & 0xff;
	  o[10] = x2 >>> 16 & 0xff;
	  o[11] = x2 >>> 24 & 0xff;

	  o[12] = x3 >>>  0 & 0xff;
	  o[13] = x3 >>>  8 & 0xff;
	  o[14] = x3 >>> 16 & 0xff;
	  o[15] = x3 >>> 24 & 0xff;

	  o[16] = x4 >>>  0 & 0xff;
	  o[17] = x4 >>>  8 & 0xff;
	  o[18] = x4 >>> 16 & 0xff;
	  o[19] = x4 >>> 24 & 0xff;

	  o[20] = x5 >>>  0 & 0xff;
	  o[21] = x5 >>>  8 & 0xff;
	  o[22] = x5 >>> 16 & 0xff;
	  o[23] = x5 >>> 24 & 0xff;

	  o[24] = x6 >>>  0 & 0xff;
	  o[25] = x6 >>>  8 & 0xff;
	  o[26] = x6 >>> 16 & 0xff;
	  o[27] = x6 >>> 24 & 0xff;

	  o[28] = x7 >>>  0 & 0xff;
	  o[29] = x7 >>>  8 & 0xff;
	  o[30] = x7 >>> 16 & 0xff;
	  o[31] = x7 >>> 24 & 0xff;

	  o[32] = x8 >>>  0 & 0xff;
	  o[33] = x8 >>>  8 & 0xff;
	  o[34] = x8 >>> 16 & 0xff;
	  o[35] = x8 >>> 24 & 0xff;

	  o[36] = x9 >>>  0 & 0xff;
	  o[37] = x9 >>>  8 & 0xff;
	  o[38] = x9 >>> 16 & 0xff;
	  o[39] = x9 >>> 24 & 0xff;

	  o[40] = x10 >>>  0 & 0xff;
	  o[41] = x10 >>>  8 & 0xff;
	  o[42] = x10 >>> 16 & 0xff;
	  o[43] = x10 >>> 24 & 0xff;

	  o[44] = x11 >>>  0 & 0xff;
	  o[45] = x11 >>>  8 & 0xff;
	  o[46] = x11 >>> 16 & 0xff;
	  o[47] = x11 >>> 24 & 0xff;

	  o[48] = x12 >>>  0 & 0xff;
	  o[49] = x12 >>>  8 & 0xff;
	  o[50] = x12 >>> 16 & 0xff;
	  o[51] = x12 >>> 24 & 0xff;

	  o[52] = x13 >>>  0 & 0xff;
	  o[53] = x13 >>>  8 & 0xff;
	  o[54] = x13 >>> 16 & 0xff;
	  o[55] = x13 >>> 24 & 0xff;

	  o[56] = x14 >>>  0 & 0xff;
	  o[57] = x14 >>>  8 & 0xff;
	  o[58] = x14 >>> 16 & 0xff;
	  o[59] = x14 >>> 24 & 0xff;

	  o[60] = x15 >>>  0 & 0xff;
	  o[61] = x15 >>>  8 & 0xff;
	  o[62] = x15 >>> 16 & 0xff;
	  o[63] = x15 >>> 24 & 0xff;
	}

	function core_hsalsa20(o,p,k,c) {
	  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
	      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
	      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
	      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
	      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
	      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
	      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
	      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
	      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
	      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
	      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
	      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
	      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
	      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
	      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
	      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

	  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
	      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
	      x15 = j15, u;

	  for (var i = 0; i < 20; i += 2) {
	    u = x0 + x12 | 0;
	    x4 ^= u<<7 | u>>>(32-7);
	    u = x4 + x0 | 0;
	    x8 ^= u<<9 | u>>>(32-9);
	    u = x8 + x4 | 0;
	    x12 ^= u<<13 | u>>>(32-13);
	    u = x12 + x8 | 0;
	    x0 ^= u<<18 | u>>>(32-18);

	    u = x5 + x1 | 0;
	    x9 ^= u<<7 | u>>>(32-7);
	    u = x9 + x5 | 0;
	    x13 ^= u<<9 | u>>>(32-9);
	    u = x13 + x9 | 0;
	    x1 ^= u<<13 | u>>>(32-13);
	    u = x1 + x13 | 0;
	    x5 ^= u<<18 | u>>>(32-18);

	    u = x10 + x6 | 0;
	    x14 ^= u<<7 | u>>>(32-7);
	    u = x14 + x10 | 0;
	    x2 ^= u<<9 | u>>>(32-9);
	    u = x2 + x14 | 0;
	    x6 ^= u<<13 | u>>>(32-13);
	    u = x6 + x2 | 0;
	    x10 ^= u<<18 | u>>>(32-18);

	    u = x15 + x11 | 0;
	    x3 ^= u<<7 | u>>>(32-7);
	    u = x3 + x15 | 0;
	    x7 ^= u<<9 | u>>>(32-9);
	    u = x7 + x3 | 0;
	    x11 ^= u<<13 | u>>>(32-13);
	    u = x11 + x7 | 0;
	    x15 ^= u<<18 | u>>>(32-18);

	    u = x0 + x3 | 0;
	    x1 ^= u<<7 | u>>>(32-7);
	    u = x1 + x0 | 0;
	    x2 ^= u<<9 | u>>>(32-9);
	    u = x2 + x1 | 0;
	    x3 ^= u<<13 | u>>>(32-13);
	    u = x3 + x2 | 0;
	    x0 ^= u<<18 | u>>>(32-18);

	    u = x5 + x4 | 0;
	    x6 ^= u<<7 | u>>>(32-7);
	    u = x6 + x5 | 0;
	    x7 ^= u<<9 | u>>>(32-9);
	    u = x7 + x6 | 0;
	    x4 ^= u<<13 | u>>>(32-13);
	    u = x4 + x7 | 0;
	    x5 ^= u<<18 | u>>>(32-18);

	    u = x10 + x9 | 0;
	    x11 ^= u<<7 | u>>>(32-7);
	    u = x11 + x10 | 0;
	    x8 ^= u<<9 | u>>>(32-9);
	    u = x8 + x11 | 0;
	    x9 ^= u<<13 | u>>>(32-13);
	    u = x9 + x8 | 0;
	    x10 ^= u<<18 | u>>>(32-18);

	    u = x15 + x14 | 0;
	    x12 ^= u<<7 | u>>>(32-7);
	    u = x12 + x15 | 0;
	    x13 ^= u<<9 | u>>>(32-9);
	    u = x13 + x12 | 0;
	    x14 ^= u<<13 | u>>>(32-13);
	    u = x14 + x13 | 0;
	    x15 ^= u<<18 | u>>>(32-18);
	  }

	  o[ 0] = x0 >>>  0 & 0xff;
	  o[ 1] = x0 >>>  8 & 0xff;
	  o[ 2] = x0 >>> 16 & 0xff;
	  o[ 3] = x0 >>> 24 & 0xff;

	  o[ 4] = x5 >>>  0 & 0xff;
	  o[ 5] = x5 >>>  8 & 0xff;
	  o[ 6] = x5 >>> 16 & 0xff;
	  o[ 7] = x5 >>> 24 & 0xff;

	  o[ 8] = x10 >>>  0 & 0xff;
	  o[ 9] = x10 >>>  8 & 0xff;
	  o[10] = x10 >>> 16 & 0xff;
	  o[11] = x10 >>> 24 & 0xff;

	  o[12] = x15 >>>  0 & 0xff;
	  o[13] = x15 >>>  8 & 0xff;
	  o[14] = x15 >>> 16 & 0xff;
	  o[15] = x15 >>> 24 & 0xff;

	  o[16] = x6 >>>  0 & 0xff;
	  o[17] = x6 >>>  8 & 0xff;
	  o[18] = x6 >>> 16 & 0xff;
	  o[19] = x6 >>> 24 & 0xff;

	  o[20] = x7 >>>  0 & 0xff;
	  o[21] = x7 >>>  8 & 0xff;
	  o[22] = x7 >>> 16 & 0xff;
	  o[23] = x7 >>> 24 & 0xff;

	  o[24] = x8 >>>  0 & 0xff;
	  o[25] = x8 >>>  8 & 0xff;
	  o[26] = x8 >>> 16 & 0xff;
	  o[27] = x8 >>> 24 & 0xff;

	  o[28] = x9 >>>  0 & 0xff;
	  o[29] = x9 >>>  8 & 0xff;
	  o[30] = x9 >>> 16 & 0xff;
	  o[31] = x9 >>> 24 & 0xff;
	}

	function crypto_core_salsa20(out,inp,k,c) {
	  core_salsa20(out,inp,k,c);
	}

	function crypto_core_hsalsa20(out,inp,k,c) {
	  core_hsalsa20(out,inp,k,c);
	}

	var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
	            // "expand 32-byte k"

	function crypto_stream_salsa20_xor(c,cpos,m,mpos,b,n,k) {
	  var z = new Uint8Array(16), x = new Uint8Array(64);
	  var u, i;
	  for (i = 0; i < 16; i++) z[i] = 0;
	  for (i = 0; i < 8; i++) z[i] = n[i];
	  while (b >= 64) {
	    crypto_core_salsa20(x,z,k,sigma);
	    for (i = 0; i < 64; i++) c[cpos+i] = m[mpos+i] ^ x[i];
	    u = 1;
	    for (i = 8; i < 16; i++) {
	      u = u + (z[i] & 0xff) | 0;
	      z[i] = u & 0xff;
	      u >>>= 8;
	    }
	    b -= 64;
	    cpos += 64;
	    mpos += 64;
	  }
	  if (b > 0) {
	    crypto_core_salsa20(x,z,k,sigma);
	    for (i = 0; i < b; i++) c[cpos+i] = m[mpos+i] ^ x[i];
	  }
	  return 0;
	}

	function crypto_stream_salsa20(c,cpos,b,n,k) {
	  var z = new Uint8Array(16), x = new Uint8Array(64);
	  var u, i;
	  for (i = 0; i < 16; i++) z[i] = 0;
	  for (i = 0; i < 8; i++) z[i] = n[i];
	  while (b >= 64) {
	    crypto_core_salsa20(x,z,k,sigma);
	    for (i = 0; i < 64; i++) c[cpos+i] = x[i];
	    u = 1;
	    for (i = 8; i < 16; i++) {
	      u = u + (z[i] & 0xff) | 0;
	      z[i] = u & 0xff;
	      u >>>= 8;
	    }
	    b -= 64;
	    cpos += 64;
	  }
	  if (b > 0) {
	    crypto_core_salsa20(x,z,k,sigma);
	    for (i = 0; i < b; i++) c[cpos+i] = x[i];
	  }
	  return 0;
	}

	function crypto_stream(c,cpos,d,n,k) {
	  var s = new Uint8Array(32);
	  crypto_core_hsalsa20(s,n,k,sigma);
	  var sn = new Uint8Array(8);
	  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
	  return crypto_stream_salsa20(c,cpos,d,sn,s);
	}

	function crypto_stream_xor(c,cpos,m,mpos,d,n,k) {
	  var s = new Uint8Array(32);
	  crypto_core_hsalsa20(s,n,k,sigma);
	  var sn = new Uint8Array(8);
	  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
	  return crypto_stream_salsa20_xor(c,cpos,m,mpos,d,sn,s);
	}

	/*
	* Port of Andrew Moon's Poly1305-donna-16. Public domain.
	* https://github.com/floodyberry/poly1305-donna
	*/

	var poly1305 = function(key) {
	  this.buffer = new Uint8Array(16);
	  this.r = new Uint16Array(10);
	  this.h = new Uint16Array(10);
	  this.pad = new Uint16Array(8);
	  this.leftover = 0;
	  this.fin = 0;

	  var t0, t1, t2, t3, t4, t5, t6, t7;

	  t0 = key[ 0] & 0xff | (key[ 1] & 0xff) << 8; this.r[0] = ( t0                     ) & 0x1fff;
	  t1 = key[ 2] & 0xff | (key[ 3] & 0xff) << 8; this.r[1] = ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
	  t2 = key[ 4] & 0xff | (key[ 5] & 0xff) << 8; this.r[2] = ((t1 >>> 10) | (t2 <<  6)) & 0x1f03;
	  t3 = key[ 6] & 0xff | (key[ 7] & 0xff) << 8; this.r[3] = ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
	  t4 = key[ 8] & 0xff | (key[ 9] & 0xff) << 8; this.r[4] = ((t3 >>>  4) | (t4 << 12)) & 0x00ff;
	  this.r[5] = ((t4 >>>  1)) & 0x1ffe;
	  t5 = key[10] & 0xff | (key[11] & 0xff) << 8; this.r[6] = ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
	  t6 = key[12] & 0xff | (key[13] & 0xff) << 8; this.r[7] = ((t5 >>> 11) | (t6 <<  5)) & 0x1f81;
	  t7 = key[14] & 0xff | (key[15] & 0xff) << 8; this.r[8] = ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
	  this.r[9] = ((t7 >>>  5)) & 0x007f;

	  this.pad[0] = key[16] & 0xff | (key[17] & 0xff) << 8;
	  this.pad[1] = key[18] & 0xff | (key[19] & 0xff) << 8;
	  this.pad[2] = key[20] & 0xff | (key[21] & 0xff) << 8;
	  this.pad[3] = key[22] & 0xff | (key[23] & 0xff) << 8;
	  this.pad[4] = key[24] & 0xff | (key[25] & 0xff) << 8;
	  this.pad[5] = key[26] & 0xff | (key[27] & 0xff) << 8;
	  this.pad[6] = key[28] & 0xff | (key[29] & 0xff) << 8;
	  this.pad[7] = key[30] & 0xff | (key[31] & 0xff) << 8;
	};

	poly1305.prototype.blocks = function(m, mpos, bytes) {
	  var hibit = this.fin ? 0 : (1 << 11);
	  var t0, t1, t2, t3, t4, t5, t6, t7, c;
	  var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;

	  var h0 = this.h[0],
	      h1 = this.h[1],
	      h2 = this.h[2],
	      h3 = this.h[3],
	      h4 = this.h[4],
	      h5 = this.h[5],
	      h6 = this.h[6],
	      h7 = this.h[7],
	      h8 = this.h[8],
	      h9 = this.h[9];

	  var r0 = this.r[0],
	      r1 = this.r[1],
	      r2 = this.r[2],
	      r3 = this.r[3],
	      r4 = this.r[4],
	      r5 = this.r[5],
	      r6 = this.r[6],
	      r7 = this.r[7],
	      r8 = this.r[8],
	      r9 = this.r[9];

	  while (bytes >= 16) {
	    t0 = m[mpos+ 0] & 0xff | (m[mpos+ 1] & 0xff) << 8; h0 += ( t0                     ) & 0x1fff;
	    t1 = m[mpos+ 2] & 0xff | (m[mpos+ 3] & 0xff) << 8; h1 += ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
	    t2 = m[mpos+ 4] & 0xff | (m[mpos+ 5] & 0xff) << 8; h2 += ((t1 >>> 10) | (t2 <<  6)) & 0x1fff;
	    t3 = m[mpos+ 6] & 0xff | (m[mpos+ 7] & 0xff) << 8; h3 += ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
	    t4 = m[mpos+ 8] & 0xff | (m[mpos+ 9] & 0xff) << 8; h4 += ((t3 >>>  4) | (t4 << 12)) & 0x1fff;
	    h5 += ((t4 >>>  1)) & 0x1fff;
	    t5 = m[mpos+10] & 0xff | (m[mpos+11] & 0xff) << 8; h6 += ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
	    t6 = m[mpos+12] & 0xff | (m[mpos+13] & 0xff) << 8; h7 += ((t5 >>> 11) | (t6 <<  5)) & 0x1fff;
	    t7 = m[mpos+14] & 0xff | (m[mpos+15] & 0xff) << 8; h8 += ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
	    h9 += ((t7 >>> 5)) | hibit;

	    c = 0;

	    d0 = c;
	    d0 += h0 * r0;
	    d0 += h1 * (5 * r9);
	    d0 += h2 * (5 * r8);
	    d0 += h3 * (5 * r7);
	    d0 += h4 * (5 * r6);
	    c = (d0 >>> 13); d0 &= 0x1fff;
	    d0 += h5 * (5 * r5);
	    d0 += h6 * (5 * r4);
	    d0 += h7 * (5 * r3);
	    d0 += h8 * (5 * r2);
	    d0 += h9 * (5 * r1);
	    c += (d0 >>> 13); d0 &= 0x1fff;

	    d1 = c;
	    d1 += h0 * r1;
	    d1 += h1 * r0;
	    d1 += h2 * (5 * r9);
	    d1 += h3 * (5 * r8);
	    d1 += h4 * (5 * r7);
	    c = (d1 >>> 13); d1 &= 0x1fff;
	    d1 += h5 * (5 * r6);
	    d1 += h6 * (5 * r5);
	    d1 += h7 * (5 * r4);
	    d1 += h8 * (5 * r3);
	    d1 += h9 * (5 * r2);
	    c += (d1 >>> 13); d1 &= 0x1fff;

	    d2 = c;
	    d2 += h0 * r2;
	    d2 += h1 * r1;
	    d2 += h2 * r0;
	    d2 += h3 * (5 * r9);
	    d2 += h4 * (5 * r8);
	    c = (d2 >>> 13); d2 &= 0x1fff;
	    d2 += h5 * (5 * r7);
	    d2 += h6 * (5 * r6);
	    d2 += h7 * (5 * r5);
	    d2 += h8 * (5 * r4);
	    d2 += h9 * (5 * r3);
	    c += (d2 >>> 13); d2 &= 0x1fff;

	    d3 = c;
	    d3 += h0 * r3;
	    d3 += h1 * r2;
	    d3 += h2 * r1;
	    d3 += h3 * r0;
	    d3 += h4 * (5 * r9);
	    c = (d3 >>> 13); d3 &= 0x1fff;
	    d3 += h5 * (5 * r8);
	    d3 += h6 * (5 * r7);
	    d3 += h7 * (5 * r6);
	    d3 += h8 * (5 * r5);
	    d3 += h9 * (5 * r4);
	    c += (d3 >>> 13); d3 &= 0x1fff;

	    d4 = c;
	    d4 += h0 * r4;
	    d4 += h1 * r3;
	    d4 += h2 * r2;
	    d4 += h3 * r1;
	    d4 += h4 * r0;
	    c = (d4 >>> 13); d4 &= 0x1fff;
	    d4 += h5 * (5 * r9);
	    d4 += h6 * (5 * r8);
	    d4 += h7 * (5 * r7);
	    d4 += h8 * (5 * r6);
	    d4 += h9 * (5 * r5);
	    c += (d4 >>> 13); d4 &= 0x1fff;

	    d5 = c;
	    d5 += h0 * r5;
	    d5 += h1 * r4;
	    d5 += h2 * r3;
	    d5 += h3 * r2;
	    d5 += h4 * r1;
	    c = (d5 >>> 13); d5 &= 0x1fff;
	    d5 += h5 * r0;
	    d5 += h6 * (5 * r9);
	    d5 += h7 * (5 * r8);
	    d5 += h8 * (5 * r7);
	    d5 += h9 * (5 * r6);
	    c += (d5 >>> 13); d5 &= 0x1fff;

	    d6 = c;
	    d6 += h0 * r6;
	    d6 += h1 * r5;
	    d6 += h2 * r4;
	    d6 += h3 * r3;
	    d6 += h4 * r2;
	    c = (d6 >>> 13); d6 &= 0x1fff;
	    d6 += h5 * r1;
	    d6 += h6 * r0;
	    d6 += h7 * (5 * r9);
	    d6 += h8 * (5 * r8);
	    d6 += h9 * (5 * r7);
	    c += (d6 >>> 13); d6 &= 0x1fff;

	    d7 = c;
	    d7 += h0 * r7;
	    d7 += h1 * r6;
	    d7 += h2 * r5;
	    d7 += h3 * r4;
	    d7 += h4 * r3;
	    c = (d7 >>> 13); d7 &= 0x1fff;
	    d7 += h5 * r2;
	    d7 += h6 * r1;
	    d7 += h7 * r0;
	    d7 += h8 * (5 * r9);
	    d7 += h9 * (5 * r8);
	    c += (d7 >>> 13); d7 &= 0x1fff;

	    d8 = c;
	    d8 += h0 * r8;
	    d8 += h1 * r7;
	    d8 += h2 * r6;
	    d8 += h3 * r5;
	    d8 += h4 * r4;
	    c = (d8 >>> 13); d8 &= 0x1fff;
	    d8 += h5 * r3;
	    d8 += h6 * r2;
	    d8 += h7 * r1;
	    d8 += h8 * r0;
	    d8 += h9 * (5 * r9);
	    c += (d8 >>> 13); d8 &= 0x1fff;

	    d9 = c;
	    d9 += h0 * r9;
	    d9 += h1 * r8;
	    d9 += h2 * r7;
	    d9 += h3 * r6;
	    d9 += h4 * r5;
	    c = (d9 >>> 13); d9 &= 0x1fff;
	    d9 += h5 * r4;
	    d9 += h6 * r3;
	    d9 += h7 * r2;
	    d9 += h8 * r1;
	    d9 += h9 * r0;
	    c += (d9 >>> 13); d9 &= 0x1fff;

	    c = (((c << 2) + c)) | 0;
	    c = (c + d0) | 0;
	    d0 = c & 0x1fff;
	    c = (c >>> 13);
	    d1 += c;

	    h0 = d0;
	    h1 = d1;
	    h2 = d2;
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
	    for (; i < 16; i++) this.buffer[i] = 0;
	    this.fin = 1;
	    this.blocks(this.buffer, 0, 16);
	  }

	  c = this.h[1] >>> 13;
	  this.h[1] &= 0x1fff;
	  for (i = 2; i < 10; i++) {
	    this.h[i] += c;
	    c = this.h[i] >>> 13;
	    this.h[i] &= 0x1fff;
	  }
	  this.h[0] += (c * 5);
	  c = this.h[0] >>> 13;
	  this.h[0] &= 0x1fff;
	  this.h[1] += c;
	  c = this.h[1] >>> 13;
	  this.h[1] &= 0x1fff;
	  this.h[2] += c;

	  g[0] = this.h[0] + 5;
	  c = g[0] >>> 13;
	  g[0] &= 0x1fff;
	  for (i = 1; i < 10; i++) {
	    g[i] = this.h[i] + c;
	    c = g[i] >>> 13;
	    g[i] &= 0x1fff;
	  }
	  g[9] -= (1 << 13);

	  mask = (c ^ 1) - 1;
	  for (i = 0; i < 10; i++) g[i] &= mask;
	  mask = ~mask;
	  for (i = 0; i < 10; i++) this.h[i] = (this.h[i] & mask) | g[i];

	  this.h[0] = ((this.h[0]       ) | (this.h[1] << 13)                    ) & 0xffff;
	  this.h[1] = ((this.h[1] >>>  3) | (this.h[2] << 10)                    ) & 0xffff;
	  this.h[2] = ((this.h[2] >>>  6) | (this.h[3] <<  7)                    ) & 0xffff;
	  this.h[3] = ((this.h[3] >>>  9) | (this.h[4] <<  4)                    ) & 0xffff;
	  this.h[4] = ((this.h[4] >>> 12) | (this.h[5] <<  1) | (this.h[6] << 14)) & 0xffff;
	  this.h[5] = ((this.h[6] >>>  2) | (this.h[7] << 11)                    ) & 0xffff;
	  this.h[6] = ((this.h[7] >>>  5) | (this.h[8] <<  8)                    ) & 0xffff;
	  this.h[7] = ((this.h[8] >>>  8) | (this.h[9] <<  5)                    ) & 0xffff;

	  f = this.h[0] + this.pad[0];
	  this.h[0] = f & 0xffff;
	  for (i = 1; i < 8; i++) {
	    f = (((this.h[i] + this.pad[i]) | 0) + (f >>> 16)) | 0;
	    this.h[i] = f & 0xffff;
	  }

	  mac[macpos+ 0] = (this.h[0] >>> 0) & 0xff;
	  mac[macpos+ 1] = (this.h[0] >>> 8) & 0xff;
	  mac[macpos+ 2] = (this.h[1] >>> 0) & 0xff;
	  mac[macpos+ 3] = (this.h[1] >>> 8) & 0xff;
	  mac[macpos+ 4] = (this.h[2] >>> 0) & 0xff;
	  mac[macpos+ 5] = (this.h[2] >>> 8) & 0xff;
	  mac[macpos+ 6] = (this.h[3] >>> 0) & 0xff;
	  mac[macpos+ 7] = (this.h[3] >>> 8) & 0xff;
	  mac[macpos+ 8] = (this.h[4] >>> 0) & 0xff;
	  mac[macpos+ 9] = (this.h[4] >>> 8) & 0xff;
	  mac[macpos+10] = (this.h[5] >>> 0) & 0xff;
	  mac[macpos+11] = (this.h[5] >>> 8) & 0xff;
	  mac[macpos+12] = (this.h[6] >>> 0) & 0xff;
	  mac[macpos+13] = (this.h[6] >>> 8) & 0xff;
	  mac[macpos+14] = (this.h[7] >>> 0) & 0xff;
	  mac[macpos+15] = (this.h[7] >>> 8) & 0xff;
	};

	poly1305.prototype.update = function(m, mpos, bytes) {
	  var i, want;

	  if (this.leftover) {
	    want = (16 - this.leftover);
	    if (want > bytes)
	      want = bytes;
	    for (i = 0; i < want; i++)
	      this.buffer[this.leftover + i] = m[mpos+i];
	    bytes -= want;
	    mpos += want;
	    this.leftover += want;
	    if (this.leftover < 16)
	      return;
	    this.blocks(this.buffer, 0, 16);
	    this.leftover = 0;
	  }

	  if (bytes >= 16) {
	    want = bytes - (bytes % 16);
	    this.blocks(m, mpos, want);
	    mpos += want;
	    bytes -= want;
	  }

	  if (bytes) {
	    for (i = 0; i < bytes; i++)
	      this.buffer[this.leftover + i] = m[mpos+i];
	    this.leftover += bytes;
	  }
	};

	function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
	  var s = new poly1305(k);
	  s.update(m, mpos, n);
	  s.finish(out, outpos);
	  return 0;
	}

	function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
	  var x = new Uint8Array(16);
	  crypto_onetimeauth(x,0,m,mpos,n,k);
	  return crypto_verify_16(h,hpos,x,0);
	}

	function crypto_secretbox(c,m,d,n,k) {
	  var i;
	  if (d < 32) return -1;
	  crypto_stream_xor(c,0,m,0,d,n,k);
	  crypto_onetimeauth(c, 16, c, 32, d - 32, c);
	  for (i = 0; i < 16; i++) c[i] = 0;
	  return 0;
	}

	function crypto_secretbox_open(m,c,d,n,k) {
	  var i;
	  var x = new Uint8Array(32);
	  if (d < 32) return -1;
	  crypto_stream(x,0,32,n,k);
	  if (crypto_onetimeauth_verify(c, 16,c, 32,d - 32,x) !== 0) return -1;
	  crypto_stream_xor(m,0,c,0,d,n,k);
	  for (i = 0; i < 32; i++) m[i] = 0;
	  return 0;
	}

	function set25519(r, a) {
	  var i;
	  for (i = 0; i < 16; i++) r[i] = a[i]|0;
	}

	function car25519(o) {
	  var i, v, c = 1;
	  for (i = 0; i < 16; i++) {
	    v = o[i] + c + 65535;
	    c = Math.floor(v / 65536);
	    o[i] = v - c * 65536;
	  }
	  o[0] += c-1 + 37 * (c-1);
	}

	function sel25519(p, q, b) {
	  var t, c = ~(b-1);
	  for (var i = 0; i < 16; i++) {
	    t = c & (p[i] ^ q[i]);
	    p[i] ^= t;
	    q[i] ^= t;
	  }
	}

	function pack25519(o, n) {
	  var i, j, b;
	  var m = gf(), t = gf();
	  for (i = 0; i < 16; i++) t[i] = n[i];
	  car25519(t);
	  car25519(t);
	  car25519(t);
	  for (j = 0; j < 2; j++) {
	    m[0] = t[0] - 0xffed;
	    for (i = 1; i < 15; i++) {
	      m[i] = t[i] - 0xffff - ((m[i-1]>>16) & 1);
	      m[i-1] &= 0xffff;
	    }
	    m[15] = t[15] - 0x7fff - ((m[14]>>16) & 1);
	    b = (m[15]>>16) & 1;
	    m[14] &= 0xffff;
	    sel25519(t, m, 1-b);
	  }
	  for (i = 0; i < 16; i++) {
	    o[2*i] = t[i] & 0xff;
	    o[2*i+1] = t[i]>>8;
	  }
	}

	function neq25519(a, b) {
	  var c = new Uint8Array(32), d = new Uint8Array(32);
	  pack25519(c, a);
	  pack25519(d, b);
	  return crypto_verify_32(c, 0, d, 0);
	}

	function par25519(a) {
	  var d = new Uint8Array(32);
	  pack25519(d, a);
	  return d[0] & 1;
	}

	function unpack25519(o, n) {
	  var i;
	  for (i = 0; i < 16; i++) o[i] = n[2*i] + (n[2*i+1] << 8);
	  o[15] &= 0x7fff;
	}

	function A(o, a, b) {
	  for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
	}

	function Z(o, a, b) {
	  for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
	}

	function M(o, a, b) {
	  var v, c,
	     t0 = 0,  t1 = 0,  t2 = 0,  t3 = 0,  t4 = 0,  t5 = 0,  t6 = 0,  t7 = 0,
	     t8 = 0,  t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0,
	    t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0,
	    t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0,
	    b0 = b[0],
	    b1 = b[1],
	    b2 = b[2],
	    b3 = b[3],
	    b4 = b[4],
	    b5 = b[5],
	    b6 = b[6],
	    b7 = b[7],
	    b8 = b[8],
	    b9 = b[9],
	    b10 = b[10],
	    b11 = b[11],
	    b12 = b[12],
	    b13 = b[13],
	    b14 = b[14],
	    b15 = b[15];

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

	  t0  += 38 * t16;
	  t1  += 38 * t17;
	  t2  += 38 * t18;
	  t3  += 38 * t19;
	  t4  += 38 * t20;
	  t5  += 38 * t21;
	  t6  += 38 * t22;
	  t7  += 38 * t23;
	  t8  += 38 * t24;
	  t9  += 38 * t25;
	  t10 += 38 * t26;
	  t11 += 38 * t27;
	  t12 += 38 * t28;
	  t13 += 38 * t29;
	  t14 += 38 * t30;
	  // t15 left as is

	  // first car
	  c = 1;
	  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
	  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
	  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
	  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
	  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
	  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
	  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
	  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
	  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
	  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
	  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
	  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
	  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
	  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
	  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
	  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
	  t0 += c-1 + 37 * (c-1);

	  // second car
	  c = 1;
	  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
	  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
	  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
	  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
	  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
	  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
	  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
	  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
	  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
	  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
	  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
	  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
	  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
	  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
	  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
	  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
	  t0 += c-1 + 37 * (c-1);

	  o[ 0] = t0;
	  o[ 1] = t1;
	  o[ 2] = t2;
	  o[ 3] = t3;
	  o[ 4] = t4;
	  o[ 5] = t5;
	  o[ 6] = t6;
	  o[ 7] = t7;
	  o[ 8] = t8;
	  o[ 9] = t9;
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
	  for (a = 0; a < 16; a++) c[a] = i[a];
	  for (a = 253; a >= 0; a--) {
	    S(c, c);
	    if(a !== 2 && a !== 4) M(c, c, i);
	  }
	  for (a = 0; a < 16; a++) o[a] = c[a];
	}

	function pow2523(o, i) {
	  var c = gf();
	  var a;
	  for (a = 0; a < 16; a++) c[a] = i[a];
	  for (a = 250; a >= 0; a--) {
	      S(c, c);
	      if(a !== 1) M(c, c, i);
	  }
	  for (a = 0; a < 16; a++) o[a] = c[a];
	}

	function crypto_scalarmult(q, n, p) {
	  var z = new Uint8Array(32);
	  var x = new Float64Array(80), r, i;
	  var a = gf(), b = gf(), c = gf(),
	      d = gf(), e = gf(), f = gf();
	  for (i = 0; i < 31; i++) z[i] = n[i];
	  z[31]=(n[31]&127)|64;
	  z[0]&=248;
	  unpack25519(x,p);
	  for (i = 0; i < 16; i++) {
	    b[i]=x[i];
	    d[i]=a[i]=c[i]=0;
	  }
	  a[0]=d[0]=1;
	  for (i=254; i>=0; --i) {
	    r=(z[i>>>3]>>>(i&7))&1;
	    sel25519(a,b,r);
	    sel25519(c,d,r);
	    A(e,a,c);
	    Z(a,a,c);
	    A(c,b,d);
	    Z(b,b,d);
	    S(d,e);
	    S(f,a);
	    M(a,c,a);
	    M(c,b,e);
	    A(e,a,c);
	    Z(a,a,c);
	    S(b,a);
	    Z(c,d,f);
	    M(a,c,_121665);
	    A(a,a,d);
	    M(c,c,a);
	    M(a,d,f);
	    M(d,b,x);
	    S(b,e);
	    sel25519(a,b,r);
	    sel25519(c,d,r);
	  }
	  for (i = 0; i < 16; i++) {
	    x[i+16]=a[i];
	    x[i+32]=c[i];
	    x[i+48]=b[i];
	    x[i+64]=d[i];
	  }
	  var x32 = x.subarray(32);
	  var x16 = x.subarray(16);
	  inv25519(x32,x32);
	  M(x16,x16,x32);
	  pack25519(q,x16);
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
	  var s = new Uint8Array(32);
	  crypto_scalarmult(s, x, y);
	  return crypto_core_hsalsa20(k, _0, s, sigma);
	}

	var crypto_box_afternm = crypto_secretbox;
	var crypto_box_open_afternm = crypto_secretbox_open;

	function crypto_box(c, m, d, n, y, x) {
	  var k = new Uint8Array(32);
	  crypto_box_beforenm(k, y, x);
	  return crypto_box_afternm(c, m, d, n, k);
	}

	function crypto_box_open(m, c, d, n, y, x) {
	  var k = new Uint8Array(32);
	  crypto_box_beforenm(k, y, x);
	  return crypto_box_open_afternm(m, c, d, n, k);
	}

	var K = [
	  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
	  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
	  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
	  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
	  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
	  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
	  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
	  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
	  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
	  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
	  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
	  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
	  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
	  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
	  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
	  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
	  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
	  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
	  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
	  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
	  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
	  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
	  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
	  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
	  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
	  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
	  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
	  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
	  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
	  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
	  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
	  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
	  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
	  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
	  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
	  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
	  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
	  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
	  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
	  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
	];

	function crypto_hashblocks_hl(hh, hl, m, n) {
	  var wh = new Int32Array(16), wl = new Int32Array(16),
	      bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7,
	      bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7,
	      th, tl, i, j, h, l, a, b, c, d;

	  var ah0 = hh[0],
	      ah1 = hh[1],
	      ah2 = hh[2],
	      ah3 = hh[3],
	      ah4 = hh[4],
	      ah5 = hh[5],
	      ah6 = hh[6],
	      ah7 = hh[7],

	      al0 = hl[0],
	      al1 = hl[1],
	      al2 = hl[2],
	      al3 = hl[3],
	      al4 = hl[4],
	      al5 = hl[5],
	      al6 = hl[6],
	      al7 = hl[7];

	  var pos = 0;
	  while (n >= 128) {
	    for (i = 0; i < 16; i++) {
	      j = 8 * i + pos;
	      wh[i] = (m[j+0] << 24) | (m[j+1] << 16) | (m[j+2] << 8) | m[j+3];
	      wl[i] = (m[j+4] << 24) | (m[j+5] << 16) | (m[j+6] << 8) | m[j+7];
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

	      // add
	      h = ah7;
	      l = al7;

	      a = l & 0xffff; b = l >>> 16;
	      c = h & 0xffff; d = h >>> 16;

	      // Sigma1
	      h = ((ah4 >>> 14) | (al4 << (32-14))) ^ ((ah4 >>> 18) | (al4 << (32-18))) ^ ((al4 >>> (41-32)) | (ah4 << (32-(41-32))));
	      l = ((al4 >>> 14) | (ah4 << (32-14))) ^ ((al4 >>> 18) | (ah4 << (32-18))) ^ ((ah4 >>> (41-32)) | (al4 << (32-(41-32))));

	      a += l & 0xffff; b += l >>> 16;
	      c += h & 0xffff; d += h >>> 16;

	      // Ch
	      h = (ah4 & ah5) ^ (~ah4 & ah6);
	      l = (al4 & al5) ^ (~al4 & al6);

	      a += l & 0xffff; b += l >>> 16;
	      c += h & 0xffff; d += h >>> 16;

	      // K
	      h = K[i*2];
	      l = K[i*2+1];

	      a += l & 0xffff; b += l >>> 16;
	      c += h & 0xffff; d += h >>> 16;

	      // w
	      h = wh[i%16];
	      l = wl[i%16];

	      a += l & 0xffff; b += l >>> 16;
	      c += h & 0xffff; d += h >>> 16;

	      b += a >>> 16;
	      c += b >>> 16;
	      d += c >>> 16;

	      th = c & 0xffff | d << 16;
	      tl = a & 0xffff | b << 16;

	      // add
	      h = th;
	      l = tl;

	      a = l & 0xffff; b = l >>> 16;
	      c = h & 0xffff; d = h >>> 16;

	      // Sigma0
	      h = ((ah0 >>> 28) | (al0 << (32-28))) ^ ((al0 >>> (34-32)) | (ah0 << (32-(34-32)))) ^ ((al0 >>> (39-32)) | (ah0 << (32-(39-32))));
	      l = ((al0 >>> 28) | (ah0 << (32-28))) ^ ((ah0 >>> (34-32)) | (al0 << (32-(34-32)))) ^ ((ah0 >>> (39-32)) | (al0 << (32-(39-32))));

	      a += l & 0xffff; b += l >>> 16;
	      c += h & 0xffff; d += h >>> 16;

	      // Maj
	      h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2);
	      l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2);

	      a += l & 0xffff; b += l >>> 16;
	      c += h & 0xffff; d += h >>> 16;

	      b += a >>> 16;
	      c += b >>> 16;
	      d += c >>> 16;

	      bh7 = (c & 0xffff) | (d << 16);
	      bl7 = (a & 0xffff) | (b << 16);

	      // add
	      h = bh3;
	      l = bl3;

	      a = l & 0xffff; b = l >>> 16;
	      c = h & 0xffff; d = h >>> 16;

	      h = th;
	      l = tl;

	      a += l & 0xffff; b += l >>> 16;
	      c += h & 0xffff; d += h >>> 16;

	      b += a >>> 16;
	      c += b >>> 16;
	      d += c >>> 16;

	      bh3 = (c & 0xffff) | (d << 16);
	      bl3 = (a & 0xffff) | (b << 16);

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

	      if (i%16 === 15) {
	        for (j = 0; j < 16; j++) {
	          // add
	          h = wh[j];
	          l = wl[j];

	          a = l & 0xffff; b = l >>> 16;
	          c = h & 0xffff; d = h >>> 16;

	          h = wh[(j+9)%16];
	          l = wl[(j+9)%16];

	          a += l & 0xffff; b += l >>> 16;
	          c += h & 0xffff; d += h >>> 16;

	          // sigma0
	          th = wh[(j+1)%16];
	          tl = wl[(j+1)%16];
	          h = ((th >>> 1) | (tl << (32-1))) ^ ((th >>> 8) | (tl << (32-8))) ^ (th >>> 7);
	          l = ((tl >>> 1) | (th << (32-1))) ^ ((tl >>> 8) | (th << (32-8))) ^ ((tl >>> 7) | (th << (32-7)));

	          a += l & 0xffff; b += l >>> 16;
	          c += h & 0xffff; d += h >>> 16;

	          // sigma1
	          th = wh[(j+14)%16];
	          tl = wl[(j+14)%16];
	          h = ((th >>> 19) | (tl << (32-19))) ^ ((tl >>> (61-32)) | (th << (32-(61-32)))) ^ (th >>> 6);
	          l = ((tl >>> 19) | (th << (32-19))) ^ ((th >>> (61-32)) | (tl << (32-(61-32)))) ^ ((tl >>> 6) | (th << (32-6)));

	          a += l & 0xffff; b += l >>> 16;
	          c += h & 0xffff; d += h >>> 16;

	          b += a >>> 16;
	          c += b >>> 16;
	          d += c >>> 16;

	          wh[j] = (c & 0xffff) | (d << 16);
	          wl[j] = (a & 0xffff) | (b << 16);
	        }
	      }
	    }

	    // add
	    h = ah0;
	    l = al0;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[0];
	    l = hl[0];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[0] = ah0 = (c & 0xffff) | (d << 16);
	    hl[0] = al0 = (a & 0xffff) | (b << 16);

	    h = ah1;
	    l = al1;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[1];
	    l = hl[1];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[1] = ah1 = (c & 0xffff) | (d << 16);
	    hl[1] = al1 = (a & 0xffff) | (b << 16);

	    h = ah2;
	    l = al2;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[2];
	    l = hl[2];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[2] = ah2 = (c & 0xffff) | (d << 16);
	    hl[2] = al2 = (a & 0xffff) | (b << 16);

	    h = ah3;
	    l = al3;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[3];
	    l = hl[3];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[3] = ah3 = (c & 0xffff) | (d << 16);
	    hl[3] = al3 = (a & 0xffff) | (b << 16);

	    h = ah4;
	    l = al4;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[4];
	    l = hl[4];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[4] = ah4 = (c & 0xffff) | (d << 16);
	    hl[4] = al4 = (a & 0xffff) | (b << 16);

	    h = ah5;
	    l = al5;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[5];
	    l = hl[5];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[5] = ah5 = (c & 0xffff) | (d << 16);
	    hl[5] = al5 = (a & 0xffff) | (b << 16);

	    h = ah6;
	    l = al6;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[6];
	    l = hl[6];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[6] = ah6 = (c & 0xffff) | (d << 16);
	    hl[6] = al6 = (a & 0xffff) | (b << 16);

	    h = ah7;
	    l = al7;

	    a = l & 0xffff; b = l >>> 16;
	    c = h & 0xffff; d = h >>> 16;

	    h = hh[7];
	    l = hl[7];

	    a += l & 0xffff; b += l >>> 16;
	    c += h & 0xffff; d += h >>> 16;

	    b += a >>> 16;
	    c += b >>> 16;
	    d += c >>> 16;

	    hh[7] = ah7 = (c & 0xffff) | (d << 16);
	    hl[7] = al7 = (a & 0xffff) | (b << 16);

	    pos += 128;
	    n -= 128;
	  }

	  return n;
	}

	function crypto_hash(out, m, n) {
	  var hh = new Int32Array(8),
	      hl = new Int32Array(8),
	      x = new Uint8Array(256),
	      i, b = n;

	  hh[0] = 0x6a09e667;
	  hh[1] = 0xbb67ae85;
	  hh[2] = 0x3c6ef372;
	  hh[3] = 0xa54ff53a;
	  hh[4] = 0x510e527f;
	  hh[5] = 0x9b05688c;
	  hh[6] = 0x1f83d9ab;
	  hh[7] = 0x5be0cd19;

	  hl[0] = 0xf3bcc908;
	  hl[1] = 0x84caa73b;
	  hl[2] = 0xfe94f82b;
	  hl[3] = 0x5f1d36f1;
	  hl[4] = 0xade682d1;
	  hl[5] = 0x2b3e6c1f;
	  hl[6] = 0xfb41bd6b;
	  hl[7] = 0x137e2179;

	  crypto_hashblocks_hl(hh, hl, m, n);
	  n %= 128;

	  for (i = 0; i < n; i++) x[i] = m[b-n+i];
	  x[n] = 128;

	  n = 256-128*(n<112?1:0);
	  x[n-9] = 0;
	  ts64(x, n-8,  (b / 0x20000000) | 0, b << 3);
	  crypto_hashblocks_hl(hh, hl, x, n);

	  for (i = 0; i < 8; i++) ts64(out, 8*i, hh[i], hl[i]);

	  return 0;
	}

	function add(p, q) {
	  var a = gf(), b = gf(), c = gf(),
	      d = gf(), e = gf(), f = gf(),
	      g = gf(), h = gf(), t = gf();

	  Z(a, p[1], p[0]);
	  Z(t, q[1], q[0]);
	  M(a, a, t);
	  A(b, p[0], p[1]);
	  A(t, q[0], q[1]);
	  M(b, b, t);
	  M(c, p[3], q[3]);
	  M(c, c, D2);
	  M(d, p[2], q[2]);
	  A(d, d, d);
	  Z(e, b, a);
	  Z(f, d, c);
	  A(g, d, c);
	  A(h, b, a);

	  M(p[0], e, f);
	  M(p[1], h, g);
	  M(p[2], g, f);
	  M(p[3], e, h);
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

	function scalarmult(p, q, s) {
	  var b, i;
	  set25519(p[0], gf0);
	  set25519(p[1], gf1);
	  set25519(p[2], gf1);
	  set25519(p[3], gf0);
	  for (i = 255; i >= 0; --i) {
	    b = (s[(i/8)|0] >> (i&7)) & 1;
	    cswap(p, q, b);
	    add(q, p);
	    add(p, p);
	    cswap(p, q, b);
	  }
	}

	function scalarbase(p, s) {
	  var q = [gf(), gf(), gf(), gf()];
	  set25519(q[0], X);
	  set25519(q[1], Y);
	  set25519(q[2], gf1);
	  M(q[3], X, Y);
	  scalarmult(p, q, s);
	}

	function crypto_sign_keypair(pk, sk, seeded) {
	  var d = new Uint8Array(64);
	  var p = [gf(), gf(), gf(), gf()];
	  var i;

	  if (!seeded) randombytes(sk, 32);
	  crypto_hash(d, sk, 32);
	  d[0] &= 248;
	  d[31] &= 127;
	  d[31] |= 64;

	  scalarbase(p, d);
	  pack(pk, p);

	  for (i = 0; i < 32; i++) sk[i+32] = pk[i];
	  return 0;
	}

	var L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);

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
	  for (j = 0; j < 32; j++) x[j] -= carry * L[j];
	  for (i = 0; i < 32; i++) {
	    x[i+1] += x[i] >> 8;
	    r[i] = x[i] & 255;
	  }
	}

	function reduce(r) {
	  var x = new Float64Array(64), i;
	  for (i = 0; i < 64; i++) x[i] = r[i];
	  for (i = 0; i < 64; i++) r[i] = 0;
	  modL(r, x);
	}

	// Note: difference from C - smlen returned, not passed as argument.
	function crypto_sign(sm, m, n, sk) {
	  var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
	  var i, j, x = new Float64Array(64);
	  var p = [gf(), gf(), gf(), gf()];

	  crypto_hash(d, sk, 32);
	  d[0] &= 248;
	  d[31] &= 127;
	  d[31] |= 64;

	  var smlen = n + 64;
	  for (i = 0; i < n; i++) sm[64 + i] = m[i];
	  for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];

	  crypto_hash(r, sm.subarray(32), n+32);
	  reduce(r);
	  scalarbase(p, r);
	  pack(sm, p);

	  for (i = 32; i < 64; i++) sm[i] = sk[i];
	  crypto_hash(h, sm, n + 64);
	  reduce(h);

	  for (i = 0; i < 64; i++) x[i] = 0;
	  for (i = 0; i < 32; i++) x[i] = r[i];
	  for (i = 0; i < 32; i++) {
	    for (j = 0; j < 32; j++) {
	      x[i+j] += h[i] * d[j];
	    }
	  }

	  modL(sm.subarray(32), x);
	  return smlen;
	}

	function unpackneg(r, p) {
	  var t = gf(), chk = gf(), num = gf(),
	      den = gf(), den2 = gf(), den4 = gf(),
	      den6 = gf();

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
	  if (neq25519(chk, num)) M(r[0], r[0], I);

	  S(chk, r[0]);
	  M(chk, chk, den);
	  if (neq25519(chk, num)) return -1;

	  if (par25519(r[0]) === (p[31]>>7)) Z(r[0], gf0, r[0]);

	  M(r[3], r[0], r[1]);
	  return 0;
	}

	function crypto_sign_open(m, sm, n, pk) {
	  var i;
	  var t = new Uint8Array(32), h = new Uint8Array(64);
	  var p = [gf(), gf(), gf(), gf()],
	      q = [gf(), gf(), gf(), gf()];

	  if (n < 64) return -1;

	  if (unpackneg(q, pk)) return -1;

	  for (i = 0; i < n; i++) m[i] = sm[i];
	  for (i = 0; i < 32; i++) m[i+32] = pk[i];
	  crypto_hash(h, m, n);
	  reduce(h);
	  scalarmult(p, q, h);

	  scalarbase(q, sm.subarray(32));
	  add(p, q);
	  pack(t, p);

	  n -= 64;
	  if (crypto_verify_32(sm, 0, t, 0)) {
	    for (i = 0; i < n; i++) m[i] = 0;
	    return -1;
	  }

	  for (i = 0; i < n; i++) m[i] = sm[i + 64];
	  return n;
	}

	var crypto_secretbox_KEYBYTES = 32,
	    crypto_secretbox_NONCEBYTES = 24,
	    crypto_secretbox_ZEROBYTES = 32,
	    crypto_secretbox_BOXZEROBYTES = 16,
	    crypto_scalarmult_BYTES = 32,
	    crypto_scalarmult_SCALARBYTES = 32,
	    crypto_box_PUBLICKEYBYTES = 32,
	    crypto_box_SECRETKEYBYTES = 32,
	    crypto_box_BEFORENMBYTES = 32,
	    crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES,
	    crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES,
	    crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES,
	    crypto_sign_BYTES = 64,
	    crypto_sign_PUBLICKEYBYTES = 32,
	    crypto_sign_SECRETKEYBYTES = 64,
	    crypto_sign_SEEDBYTES = 32,
	    crypto_hash_BYTES = 64;

	nacl.lowlevel = {
	  crypto_core_hsalsa20: crypto_core_hsalsa20,
	  crypto_stream_xor: crypto_stream_xor,
	  crypto_stream: crypto_stream,
	  crypto_stream_salsa20_xor: crypto_stream_salsa20_xor,
	  crypto_stream_salsa20: crypto_stream_salsa20,
	  crypto_onetimeauth: crypto_onetimeauth,
	  crypto_onetimeauth_verify: crypto_onetimeauth_verify,
	  crypto_verify_16: crypto_verify_16,
	  crypto_verify_32: crypto_verify_32,
	  crypto_secretbox: crypto_secretbox,
	  crypto_secretbox_open: crypto_secretbox_open,
	  crypto_scalarmult: crypto_scalarmult,
	  crypto_scalarmult_base: crypto_scalarmult_base,
	  crypto_box_beforenm: crypto_box_beforenm,
	  crypto_box_afternm: crypto_box_afternm,
	  crypto_box: crypto_box,
	  crypto_box_open: crypto_box_open,
	  crypto_box_keypair: crypto_box_keypair,
	  crypto_hash: crypto_hash,
	  crypto_sign: crypto_sign,
	  crypto_sign_keypair: crypto_sign_keypair,
	  crypto_sign_open: crypto_sign_open,

	  crypto_secretbox_KEYBYTES: crypto_secretbox_KEYBYTES,
	  crypto_secretbox_NONCEBYTES: crypto_secretbox_NONCEBYTES,
	  crypto_secretbox_ZEROBYTES: crypto_secretbox_ZEROBYTES,
	  crypto_secretbox_BOXZEROBYTES: crypto_secretbox_BOXZEROBYTES,
	  crypto_scalarmult_BYTES: crypto_scalarmult_BYTES,
	  crypto_scalarmult_SCALARBYTES: crypto_scalarmult_SCALARBYTES,
	  crypto_box_PUBLICKEYBYTES: crypto_box_PUBLICKEYBYTES,
	  crypto_box_SECRETKEYBYTES: crypto_box_SECRETKEYBYTES,
	  crypto_box_BEFORENMBYTES: crypto_box_BEFORENMBYTES,
	  crypto_box_NONCEBYTES: crypto_box_NONCEBYTES,
	  crypto_box_ZEROBYTES: crypto_box_ZEROBYTES,
	  crypto_box_BOXZEROBYTES: crypto_box_BOXZEROBYTES,
	  crypto_sign_BYTES: crypto_sign_BYTES,
	  crypto_sign_PUBLICKEYBYTES: crypto_sign_PUBLICKEYBYTES,
	  crypto_sign_SECRETKEYBYTES: crypto_sign_SECRETKEYBYTES,
	  crypto_sign_SEEDBYTES: crypto_sign_SEEDBYTES,
	  crypto_hash_BYTES: crypto_hash_BYTES,

	  gf: gf,
	  D: D,
	  L: L,
	  pack25519: pack25519,
	  unpack25519: unpack25519,
	  M: M,
	  A: A,
	  S: S,
	  Z: Z,
	  pow2523: pow2523,
	  add: add,
	  set25519: set25519,
	  modL: modL,
	  scalarmult: scalarmult,
	  scalarbase: scalarbase,
	};

	/* High-level API */

	function checkLengths(k, n) {
	  if (k.length !== crypto_secretbox_KEYBYTES) throw new Error('bad key size');
	  if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error('bad nonce size');
	}

	function checkBoxLengths(pk, sk) {
	  if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error('bad public key size');
	  if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error('bad secret key size');
	}

	function checkArrayTypes() {
	  for (var i = 0; i < arguments.length; i++) {
	    if (!(arguments[i] instanceof Uint8Array))
	      throw new TypeError('unexpected type, use Uint8Array');
	  }
	}

	function cleanup(arr) {
	  for (var i = 0; i < arr.length; i++) arr[i] = 0;
	}

	nacl.randomBytes = function(n) {
	  var b = new Uint8Array(n);
	  randombytes(b, n);
	  return b;
	};

	nacl.secretbox = function(msg, nonce, key) {
	  checkArrayTypes(msg, nonce, key);
	  checkLengths(key, nonce);
	  var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
	  var c = new Uint8Array(m.length);
	  for (var i = 0; i < msg.length; i++) m[i+crypto_secretbox_ZEROBYTES] = msg[i];
	  crypto_secretbox(c, m, m.length, nonce, key);
	  return c.subarray(crypto_secretbox_BOXZEROBYTES);
	};

	nacl.secretbox.open = function(box, nonce, key) {
	  checkArrayTypes(box, nonce, key);
	  checkLengths(key, nonce);
	  var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
	  var m = new Uint8Array(c.length);
	  for (var i = 0; i < box.length; i++) c[i+crypto_secretbox_BOXZEROBYTES] = box[i];
	  if (c.length < 32) return null;
	  if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
	  return m.subarray(crypto_secretbox_ZEROBYTES);
	};

	nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
	nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
	nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;

	nacl.scalarMult = function(n, p) {
	  checkArrayTypes(n, p);
	  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
	  if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size');
	  var q = new Uint8Array(crypto_scalarmult_BYTES);
	  crypto_scalarmult(q, n, p);
	  return q;
	};

	nacl.scalarMult.base = function(n) {
	  checkArrayTypes(n);
	  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
	  var q = new Uint8Array(crypto_scalarmult_BYTES);
	  crypto_scalarmult_base(q, n);
	  return q;
	};

	nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
	nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;

	nacl.box = function(msg, nonce, publicKey, secretKey) {
	  var k = nacl.box.before(publicKey, secretKey);
	  return nacl.secretbox(msg, nonce, k);
	};

	nacl.box.before = function(publicKey, secretKey) {
	  checkArrayTypes(publicKey, secretKey);
	  checkBoxLengths(publicKey, secretKey);
	  var k = new Uint8Array(crypto_box_BEFORENMBYTES);
	  crypto_box_beforenm(k, publicKey, secretKey);
	  return k;
	};

	nacl.box.after = nacl.secretbox;

	nacl.box.open = function(msg, nonce, publicKey, secretKey) {
	  var k = nacl.box.before(publicKey, secretKey);
	  return nacl.secretbox.open(msg, nonce, k);
	};

	nacl.box.open.after = nacl.secretbox.open;

	nacl.box.keyPair = function() {
	  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
	  var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
	  crypto_box_keypair(pk, sk);
	  return {publicKey: pk, secretKey: sk};
	};

	nacl.box.keyPair.fromSecretKey = function(secretKey) {
	  checkArrayTypes(secretKey);
	  if (secretKey.length !== crypto_box_SECRETKEYBYTES)
	    throw new Error('bad secret key size');
	  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
	  crypto_scalarmult_base(pk, secretKey);
	  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
	};

	nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
	nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
	nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
	nacl.box.nonceLength = crypto_box_NONCEBYTES;
	nacl.box.overheadLength = nacl.secretbox.overheadLength;

	nacl.sign = function(msg, secretKey) {
	  checkArrayTypes(msg, secretKey);
	  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
	    throw new Error('bad secret key size');
	  var signedMsg = new Uint8Array(crypto_sign_BYTES+msg.length);
	  crypto_sign(signedMsg, msg, msg.length, secretKey);
	  return signedMsg;
	};

	nacl.sign.open = function(signedMsg, publicKey) {
	  checkArrayTypes(signedMsg, publicKey);
	  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
	    throw new Error('bad public key size');
	  var tmp = new Uint8Array(signedMsg.length);
	  var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
	  if (mlen < 0) return null;
	  var m = new Uint8Array(mlen);
	  for (var i = 0; i < m.length; i++) m[i] = tmp[i];
	  return m;
	};

	nacl.sign.detached = function(msg, secretKey) {
	  var signedMsg = nacl.sign(msg, secretKey);
	  var sig = new Uint8Array(crypto_sign_BYTES);
	  for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
	  return sig;
	};

	nacl.sign.detached.verify = function(msg, sig, publicKey) {
	  checkArrayTypes(msg, sig, publicKey);
	  if (sig.length !== crypto_sign_BYTES)
	    throw new Error('bad signature size');
	  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
	    throw new Error('bad public key size');
	  var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
	  var m = new Uint8Array(crypto_sign_BYTES + msg.length);
	  var i;
	  for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
	  for (i = 0; i < msg.length; i++) sm[i+crypto_sign_BYTES] = msg[i];
	  return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
	};

	nacl.sign.keyPair = function() {
	  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
	  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
	  crypto_sign_keypair(pk, sk);
	  return {publicKey: pk, secretKey: sk};
	};

	nacl.sign.keyPair.fromSecretKey = function(secretKey) {
	  checkArrayTypes(secretKey);
	  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
	    throw new Error('bad secret key size');
	  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
	  for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32+i];
	  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
	};

	nacl.sign.keyPair.fromSeed = function(seed) {
	  checkArrayTypes(seed);
	  if (seed.length !== crypto_sign_SEEDBYTES)
	    throw new Error('bad seed size');
	  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
	  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
	  for (var i = 0; i < 32; i++) sk[i] = seed[i];
	  crypto_sign_keypair(pk, sk, true);
	  return {publicKey: pk, secretKey: sk};
	};

	nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
	nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
	nacl.sign.seedLength = crypto_sign_SEEDBYTES;
	nacl.sign.signatureLength = crypto_sign_BYTES;

	nacl.hash = function(msg) {
	  checkArrayTypes(msg);
	  var h = new Uint8Array(crypto_hash_BYTES);
	  crypto_hash(h, msg, msg.length);
	  return h;
	};

	nacl.hash.hashLength = crypto_hash_BYTES;

	nacl.verify = function(x, y) {
	  checkArrayTypes(x, y);
	  // Zero length arguments are considered not equal.
	  if (x.length === 0 || y.length === 0) return false;
	  if (x.length !== y.length) return false;
	  return (vn(x, 0, y, 0, x.length) === 0) ? true : false;
	};

	nacl.setPRNG = function(fn) {
	  randombytes = fn;
	};

	(function() {
	  // Initialize PRNG if environment provides CSPRNG.
	  // If not, methods calling randombytes will throw.
	  var crypto = typeof self !== 'undefined' ? (self.crypto || self.msCrypto) : null;
	  if (crypto && crypto.getRandomValues) {
	    // Browsers.
	    var QUOTA = 65536;
	    nacl.setPRNG(function(x, n) {
	      var i, v = new Uint8Array(n);
	      for (i = 0; i < n; i += QUOTA) {
	        crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
	      }
	      for (i = 0; i < n; i++) x[i] = v[i];
	      cleanup(v);
	    });
	  } else if (typeof commonjsRequire !== 'undefined') {
	    // Node.js.
	    crypto = require$$0$1;
	    if (crypto && crypto.randomBytes) {
	      nacl.setPRNG(function(x, n) {
	        var i, v = crypto.randomBytes(n);
	        for (i = 0; i < n; i++) x[i] = v[i];
	        cleanup(v);
	      });
	    }
	  }
	})();

	})(module.exports ? module.exports : (self.nacl = self.nacl || {})); 
} (naclFast));

var naclFastExports = naclFast.exports;
var nacl = /*@__PURE__*/getDefaultExportFromCjs(naclFastExports);

/**
 *  base64.ts
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 *
 * @author Dan Kogai (https://github.com/dankogai)
 */
const version = '3.7.5';
/**
 * @deprecated use lowercase `version`.
 */
const VERSION = version;
const _hasatob = typeof atob === 'function';
const _hasbtoa = typeof btoa === 'function';
const _hasBuffer = typeof Buffer === 'function';
const _TD = typeof TextDecoder === 'function' ? new TextDecoder() : undefined;
const _TE = typeof TextEncoder === 'function' ? new TextEncoder() : undefined;
const b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const b64chs = Array.prototype.slice.call(b64ch);
const b64tab = ((a) => {
    let tab = {};
    a.forEach((c, i) => tab[c] = i);
    return tab;
})(b64chs);
const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
const _fromCC = String.fromCharCode.bind(String);
const _U8Afrom = typeof Uint8Array.from === 'function'
    ? Uint8Array.from.bind(Uint8Array)
    : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
const _mkUriSafe = (src) => src
    .replace(/=/g, '').replace(/[+\/]/g, (m0) => m0 == '+' ? '-' : '_');
const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, '');
/**
 * polyfill version of `btoa`
 */
const btoaPolyfill = (bin) => {
    // console.log('polyfilled');
    let u32, c0, c1, c2, asc = '';
    const pad = bin.length % 3;
    for (let i = 0; i < bin.length;) {
        if ((c0 = bin.charCodeAt(i++)) > 255 ||
            (c1 = bin.charCodeAt(i++)) > 255 ||
            (c2 = bin.charCodeAt(i++)) > 255)
            throw new TypeError('invalid character found');
        u32 = (c0 << 16) | (c1 << 8) | c2;
        asc += b64chs[u32 >> 18 & 63]
            + b64chs[u32 >> 12 & 63]
            + b64chs[u32 >> 6 & 63]
            + b64chs[u32 & 63];
    }
    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
/**
 * does what `window.btoa` of web browsers do.
 * @param {String} bin binary string
 * @returns {string} Base64-encoded string
 */
const _btoa = _hasbtoa ? (bin) => btoa(bin)
    : _hasBuffer ? (bin) => Buffer.from(bin, 'binary').toString('base64')
        : btoaPolyfill;
const _fromUint8Array = _hasBuffer
    ? (u8a) => Buffer.from(u8a).toString('base64')
    : (u8a) => {
        // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
        const maxargs = 0x1000;
        let strs = [];
        for (let i = 0, l = u8a.length; i < l; i += maxargs) {
            strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
        }
        return _btoa(strs.join(''));
    };
/**
 * converts a Uint8Array to a Base64 string.
 * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
 * @returns {string} Base64 string
 */
const fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const utob = (src: string) => unescape(encodeURIComponent(src));
// reverting good old fationed regexp
const cb_utob = (c) => {
    if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 0x80 ? c
            : cc < 0x800 ? (_fromCC(0xc0 | (cc >>> 6))
                + _fromCC(0x80 | (cc & 0x3f)))
                : (_fromCC(0xe0 | ((cc >>> 12) & 0x0f))
                    + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
                    + _fromCC(0x80 | (cc & 0x3f)));
    }
    else {
        var cc = 0x10000
            + (c.charCodeAt(0) - 0xD800) * 0x400
            + (c.charCodeAt(1) - 0xDC00);
        return (_fromCC(0xf0 | ((cc >>> 18) & 0x07))
            + _fromCC(0x80 | ((cc >>> 12) & 0x3f))
            + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
            + _fromCC(0x80 | (cc & 0x3f)));
    }
};
const re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-8 string
 * @returns {string} UTF-16 string
 */
const utob = (u) => u.replace(re_utob, cb_utob);
//
const _encode = _hasBuffer
    ? (s) => Buffer.from(s, 'utf8').toString('base64')
    : _TE
        ? (s) => _fromUint8Array(_TE.encode(s))
        : (s) => _btoa(utob(s));
/**
 * converts a UTF-8-encoded string to a Base64 string.
 * @param {boolean} [urlsafe] if `true` make the result URL-safe
 * @returns {string} Base64 string
 */
const encode = (src, urlsafe = false) => urlsafe
    ? _mkUriSafe(_encode(src))
    : _encode(src);
/**
 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
 * @returns {string} Base64 string
 */
const encodeURI = (src) => encode(src, true);
// This trick is found broken https://github.com/dankogai/js-base64/issues/130
// const btou = (src: string) => decodeURIComponent(escape(src));
// reverting good old fationed regexp
const re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
const cb_btou = (cccc) => {
    switch (cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                | ((0x3f & cccc.charCodeAt(1)) << 12)
                | ((0x3f & cccc.charCodeAt(2)) << 6)
                | (0x3f & cccc.charCodeAt(3)), offset = cp - 0x10000;
            return (_fromCC((offset >>> 10) + 0xD800)
                + _fromCC((offset & 0x3FF) + 0xDC00));
        case 3:
            return _fromCC(((0x0f & cccc.charCodeAt(0)) << 12)
                | ((0x3f & cccc.charCodeAt(1)) << 6)
                | (0x3f & cccc.charCodeAt(2)));
        default:
            return _fromCC(((0x1f & cccc.charCodeAt(0)) << 6)
                | (0x3f & cccc.charCodeAt(1)));
    }
};
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-16 string
 * @returns {string} UTF-8 string
 */
const btou = (b) => b.replace(re_btou, cb_btou);
/**
 * polyfill version of `atob`
 */
const atobPolyfill = (asc) => {
    // console.log('polyfilled');
    asc = asc.replace(/\s+/g, '');
    if (!b64re.test(asc))
        throw new TypeError('malformed base64.');
    asc += '=='.slice(2 - (asc.length & 3));
    let u24, bin = '', r1, r2;
    for (let i = 0; i < asc.length;) {
        u24 = b64tab[asc.charAt(i++)] << 18
            | b64tab[asc.charAt(i++)] << 12
            | (r1 = b64tab[asc.charAt(i++)]) << 6
            | (r2 = b64tab[asc.charAt(i++)]);
        bin += r1 === 64 ? _fromCC(u24 >> 16 & 255)
            : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255)
                : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
    }
    return bin;
};
/**
 * does what `window.atob` of web browsers do.
 * @param {String} asc Base64-encoded string
 * @returns {string} binary string
 */
const _atob = _hasatob ? (asc) => atob(_tidyB64(asc))
    : _hasBuffer ? (asc) => Buffer.from(asc, 'base64').toString('binary')
        : atobPolyfill;
//
const _toUint8Array = _hasBuffer
    ? (a) => _U8Afrom(Buffer.from(a, 'base64'))
    : (a) => _U8Afrom(_atob(a).split('').map(c => c.charCodeAt(0)));
/**
 * converts a Base64 string to a Uint8Array.
 */
const toUint8Array = (a) => _toUint8Array(_unURI(a));
//
const _decode = _hasBuffer
    ? (a) => Buffer.from(a, 'base64').toString('utf8')
    : _TD
        ? (a) => _TD.decode(_toUint8Array(a))
        : (a) => btou(_atob(a));
const _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == '-' ? '+' : '/'));
/**
 * converts a Base64 string to a UTF-8 string.
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {string} UTF-8 string
 */
const decode = (src) => _decode(_unURI(src));
/**
 * check if a value is a valid Base64 string
 * @param {String} src a value to check
  */
const isValid = (src) => {
    if (typeof src !== 'string')
        return false;
    const s = src.replace(/\s+/g, '').replace(/={0,2}$/, '');
    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};
//
const _noEnum = (v) => {
    return {
        value: v, enumerable: false, writable: true, configurable: true
    };
};
/**
 * extend String.prototype with relevant methods
 */
const extendString = function () {
    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
    _add('fromBase64', function () { return decode(this); });
    _add('toBase64', function (urlsafe) { return encode(this, urlsafe); });
    _add('toBase64URI', function () { return encode(this, true); });
    _add('toBase64URL', function () { return encode(this, true); });
    _add('toUint8Array', function () { return toUint8Array(this); });
};
/**
 * extend Uint8Array.prototype with relevant methods
 */
const extendUint8Array = function () {
    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
    _add('toBase64', function (urlsafe) { return fromUint8Array(this, urlsafe); });
    _add('toBase64URI', function () { return fromUint8Array(this, true); });
    _add('toBase64URL', function () { return fromUint8Array(this, true); });
};
/**
 * extend Builtin prototypes with relevant methods
 */
const extendBuiltins = () => {
    extendString();
    extendUint8Array();
};
const gBase64 = {
    version: version,
    VERSION: VERSION,
    atob: _atob,
    atobPolyfill: atobPolyfill,
    btoa: _btoa,
    btoaPolyfill: btoaPolyfill,
    fromBase64: decode,
    toBase64: encode,
    encode: encode,
    encodeURI: encodeURI,
    encodeURL: encodeURI,
    utob: utob,
    btou: btou,
    decode: decode,
    isValid: isValid,
    fromUint8Array: fromUint8Array,
    toUint8Array: toUint8Array,
    extendString: extendString,
    extendUint8Array: extendUint8Array,
    extendBuiltins: extendBuiltins,
};

/**
 * Decodes a Base64 encoded string to a byte array hash.
 *
 * @param hash - The Base64 encoded string to decode.
 * @returns The hash in byte format.
 *
 * @public
 */
function decodeHashFromBase64(hash) {
    return gBase64.toUint8Array(hash.slice(1));
}
/**
 * Encode a byte array hash to a Base64 string.
 *
 * @param hash - The hash to encode to a Base64 string.
 * @returns The Base64 encoded string
 *
 * @public
 */
function encodeHashToBase64(hash) {
    return `u${gBase64.fromUint8Array(hash, true)}`;
}

const signingCredentials = new Map();
/**
 * Get credentials for signing zome calls.
 *
 * @param cellId - Cell id to get credentials of.
 * @returns The keys and cap secret required for signing a zome call.
 *
 * @public
 */
const getSigningCredentials = (cellId) => {
    const cellIdB64 = encodeHashToBase64(cellId[0]).concat(encodeHashToBase64(cellId[1]));
    return signingCredentials.get(cellIdB64);
};
/**
 * Set credentials for signing zome calls.
 *
 * @param cellId - Cell id to set credentials for.
 *
 * @public
 */
const setSigningCredentials = (cellId, credentials) => {
    const cellIdB64 = encodeHashToBase64(cellId[0]).concat(encodeHashToBase64(cellId[1]));
    signingCredentials.set(cellIdB64, credentials);
};
/**
 * Generates a key pair for signing zome calls.
 *
 * @returns The signing key pair and an agent pub key based on the public key.
 *
 * @public
 */
const generateSigningKeyPair = () => {
    const keyPair = nacl.sign.keyPair();
    const signingKey = new Uint8Array([132, 32, 36].concat(...keyPair.publicKey).concat(...[0, 0, 0, 0]));
    return [keyPair, signingKey];
};
/**
 * @public
 */
const randomCapSecret = () => randomByteArray(64);
/**
 * @public
 */
const randomNonce = async () => randomByteArray(32);
/**
 * @public
 */
const randomByteArray = async (length) => {
    if (typeof window !== "undefined" &&
        "crypto" in window &&
        "getRandomValues" in window.crypto) {
        return window.crypto.getRandomValues(new Uint8Array(length));
    }
    else {
        const crypto = await import('crypto');
        return new Uint8Array(crypto.randomBytes(length));
    }
};
/**
 * @public
 */
const getNonceExpiration = () => (Date.now() + 5 * 60 * 1000) * 1000; // 5 mins from now in microseconds

/**
 * A class for interacting with a conductor's Admin API.
 *
 * @public
 */
class AdminWebsocket {
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
        this.defaultTimeout =
            defaultTimeout === undefined ? DEFAULT_TIMEOUT : defaultTimeout;
    }
    /**
     * Factory mehtod to create a new instance connected to the given URL.
     *
     * @param url - A `ws://` URL used as the connection address.
     * @param defaultTimeout - The default timeout for any request.
     * @returns A promise for a new connected instance.
     */
    static async connect(url, defaultTimeout) {
        // Check if we are in the launcher's environment, and if so, redirect the url to connect to
        const env = getLauncherEnvironment();
        if (env?.ADMIN_INTERFACE_PORT) {
            url = `ws://127.0.0.1:${env.ADMIN_INTERFACE_PORT}`;
        }
        const wsClient = await WsClient.connect(url);
        return new AdminWebsocket(wsClient, defaultTimeout);
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
                        assignees: [signingKey],
                    },
                },
            },
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
}
const listAppsTransform = {
    input: (req) => {
        const args = {};
        if (req.status_filter) {
            args.status_filter = getAppStatusInApiForm(req.status_filter);
        }
        return args;
    },
    output: (res) => res,
};
const dumpStateTransform = {
    input: (req) => req,
    output: (res) => {
        return JSON.parse(res);
    },
};
function getAppStatusInApiForm(status_filter) {
    switch (status_filter) {
        case AppStatusFilter.Running:
            return {
                Running: null,
            };
        case AppStatusFilter.Enabled:
            return {
                Enabled: null,
            };
        case AppStatusFilter.Paused:
            return {
                Paused: null,
            };
        case AppStatusFilter.Disabled:
            return {
                Disabled: null,
            };
        case AppStatusFilter.Stopped:
            return {
                Stopped: null,
            };
    }
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

var freeGlobal$1 = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal$1 || freeSelf || Function('return this')();

var root$1 = root;

/** Built-in value references. */
var Symbol$1 = root$1.Symbol;

var Symbol$2 = Symbol$1;

/** Used for built-in method references. */
var objectProto$d = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$d.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$d.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$a.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$c.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var symbolTag$2 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag$2);
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray$1 = isArray;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol$2 ? Symbol$2.prototype : undefined,
    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray$1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}

/** Used to detect overreaching core-js shims. */
var coreJsData = root$1['__core-js_shared__'];

var coreJsData$1 = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/** Used for built-in method references. */
var funcProto$2 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$b = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$9).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/* Built-in method references that are verified to be native. */
var WeakMap$1 = getNative(root$1, 'WeakMap');

var WeakMap$2 = WeakMap$1;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

var baseCreate$1 = baseCreate;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var defineProperty$1 = defineProperty;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty$1 ? identity : function(func, string) {
  return defineProperty$1(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

var baseSetToString$1 = baseSetToString;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString$1);

var setToString$1 = setToString;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty$1) {
    defineProperty$1(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$8.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$9;

  return value === proto;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag$2;
}

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$8.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$8.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$7.call(value, 'callee') &&
    !propertyIsEnumerable$1.call(value, 'callee');
};

var isArguments$1 = isArguments;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */
var freeExports$2 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$2 = freeExports$2 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;

/** Built-in value references. */
var Buffer$2 = moduleExports$2 ? root$1.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer$2 ? Buffer$2.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

var isBuffer$1 = isBuffer;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$4 = '[object Map]',
    numberTag$2 = '[object Number]',
    objectTag$3 = '[object Object]',
    regexpTag$2 = '[object RegExp]',
    setTag$4 = '[object Set]',
    stringTag$2 = '[object String]',
    weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] =
typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] =
typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] =
typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] =
typedArrayTags[uint32Tag$2] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] =
typedArrayTags[arrayBufferTag$2] = typedArrayTags[boolTag$2] =
typedArrayTags[dataViewTag$3] = typedArrayTags[dateTag$2] =
typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag$4] = typedArrayTags[numberTag$2] =
typedArrayTags[objectTag$3] = typedArrayTags[regexpTag$2] =
typedArrayTags[setTag$4] = typedArrayTags[stringTag$2] =
typedArrayTags[weakMapTag$2] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal$1.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

var nodeUtil$1 = nodeUtil;

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

var isTypedArray$1 = isTypedArray;

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray$1(value),
      isArg = !isArr && isArguments$1(value),
      isBuff = !isArr && !isArg && isBuffer$1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray$1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$6.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

var nativeKeys$1 = nativeKeys;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys$1(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$5.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$4.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray$1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

var nativeCreate$1 = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate$1) {
    var result = data[key];
    return result === HASH_UNDEFINED$1 ? undefined : result;
  }
  return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate$1 ? (data[key] !== undefined) : hasOwnProperty$2.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate$1 && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

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

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/* Built-in method references that are verified to be native. */
var Map$1 = getNative(root$1, 'Map');

var Map$2 = Map$1;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map$2 || ListCache),
    'string': new Hash
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var stringToPath$1 = stringToPath;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString$1(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray$1(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath$1(toString$1(value));
}

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/** Built-in value references. */
var spreadableSymbol = Symbol$2 ? Symbol$2.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray$1(value) || isArguments$1(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString$1(overRest(func, undefined, flatten), func + '');
}

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

var getPrototype$1 = getPrototype;

/** `Object#toString` result references. */
var objectTag$2 = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag$2) {
    return false;
  }
  var proto = getPrototype$1(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$1.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map$2 || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer$1 = moduleExports ? root$1.Buffer : undefined,
    allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$1.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols$1 ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols$1(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

var getSymbols$1 = getSymbols;

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols$1(source), object);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols$1(object));
    object = getPrototype$1(object);
  }
  return result;
};

var getSymbolsIn$1 = getSymbolsIn;

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn$1(source), object);
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols$1);
}

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn$1);
}

/* Built-in method references that are verified to be native. */
var DataView$1 = getNative(root$1, 'DataView');

var DataView$2 = DataView$1;

/* Built-in method references that are verified to be native. */
var Promise$1 = getNative(root$1, 'Promise');

var Promise$2 = Promise$1;

/* Built-in method references that are verified to be native. */
var Set$1 = getNative(root$1, 'Set');

var Set$2 = Set$1;

/** `Object#toString` result references. */
var mapTag$3 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$3 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView$2),
    mapCtorString = toSource(Map$2),
    promiseCtorString = toSource(Promise$2),
    setCtorString = toSource(Set$2),
    weakMapCtorString = toSource(WeakMap$2);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView$2 && getTag(new DataView$2(new ArrayBuffer(1))) != dataViewTag$2) ||
    (Map$2 && getTag(new Map$2) != mapTag$3) ||
    (Promise$2 && getTag(Promise$2.resolve()) != promiseTag) ||
    (Set$2 && getTag(new Set$2) != setTag$3) ||
    (WeakMap$2 && getTag(new WeakMap$2) != weakMapTag$1)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$3;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$3;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var getTag$1 = getTag;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/** Built-in value references. */
var Uint8Array$1 = root$1.Uint8Array;

var Uint8Array$2 = Uint8Array$1;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array$2(result).set(new Uint8Array$2(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$2 ? Symbol$2.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1 = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$1:
      return cloneArrayBuffer(object);

    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);

    case dataViewTag$1:
      return cloneDataView(object, isDeep);

    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return cloneTypedArray(object, isDeep);

    case mapTag$2:
      return new Ctor;

    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);

    case regexpTag$1:
      return cloneRegExp(object);

    case setTag$2:
      return new Ctor;

    case symbolTag$1:
      return cloneSymbol(object);
  }
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate$1(getPrototype$1(object))
    : {};
}

/** `Object#toString` result references. */
var mapTag$1 = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag$1(value) == mapTag$1;
}

/* Node.js helper references. */
var nodeIsMap = nodeUtil$1 && nodeUtil$1.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

var isMap$1 = isMap;

/** `Object#toString` result references. */
var setTag$1 = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag$1(value) == setTag$1;
}

/* Node.js helper references. */
var nodeIsSet = nodeUtil$1 && nodeUtil$1.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

var isSet$1 = isSet;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1,
    CLONE_FLAT_FLAG$1 = 2,
    CLONE_SYMBOLS_FLAG$1 = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG$1,
      isFlat = bitmask & CLONE_FLAT_FLAG$1,
      isFull = bitmask & CLONE_SYMBOLS_FLAG$1;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray$1(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag$1(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer$1(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet$1(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap$1(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */
function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap(paths, function(path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});

var omit$1 = omit;

/**
 * A class to establish a websocket connection to an App interface, for a
 * specific agent and app.
 *
 * @public
 */
class AppAgentWebsocket {
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
            installed_app_id: this.installedAppId,
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
            installed_app_id: installed_app_id,
        });
        const appAgentWs = new AppAgentWebsocket(appWebsocket, installed_app_id, appInfo.agent_pub_key);
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
        }
        else {
            request = {
                ...request,
                provenance: this.myPubKey,
            };
        }
        if ("role_name" in request && request.role_name) {
            const appInfo = this.cachedAppInfo || (await this.appInfo());
            const cell_id = this.getCellIdFromRoleName(request.role_name, appInfo);
            const zomeCallPayload = {
                ...omit$1(request, "role_name"),
                provenance: this.myPubKey,
                cell_id,
            };
            return this.appWebsocket.callZome(zomeCallPayload, timeout);
        }
        else if ("cell_id" in request && request.cell_id) {
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
            ...args,
        });
        this.cachedAppInfo = undefined;
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
            ...args,
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
            ...args,
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
                const currentCellId = CellType.Provisioned in cellInfo
                    ? cellInfo[CellType.Provisioned].cell_id
                    : CellType.Cloned in cellInfo
                        ? cellInfo[CellType.Cloned].cell_id
                        : undefined;
                if (currentCellId && isSameCell(currentCellId, cellId)) {
                    return true;
                }
            }
        }
        return false;
    }
}
const isSameCell = (cellId1, cellId2) => cellId1[0].every((byte, index) => byte === cellId2[0][index]) &&
    cellId1[1].every((byte, index) => byte === cellId2[1][index]);

/**
 * A class to establish a websocket connection to an App interface of a
 * Holochain conductor.
 *
 * @public
 */
class AppWebsocket extends Emittery {
    client;
    defaultTimeout;
    overrideInstalledAppId;
    constructor(client, defaultTimeout, overrideInstalledAppId) {
        super();
        this.client = client;
        this.defaultTimeout =
            defaultTimeout === undefined ? DEFAULT_TIMEOUT : defaultTimeout;
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
        // Check if we are in the launcher's environment, and if so, redirect the url to connect to
        const env = getLauncherEnvironment();
        if (env?.APP_INTERFACE_PORT) {
            url = `ws://127.0.0.1:${env.APP_INTERFACE_PORT}`;
        }
        const wsClient = await WsClient.connect(url);
        const appWebsocket = new AppWebsocket(wsClient, defaultTimeout, env?.INSTALLED_APP_ID);
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
}
const callZomeTransform = {
    input: async (request) => {
        if ("signature" in request) {
            return request;
        }
        const signedZomeCall = isLauncher
            ? await signZomeCallTauri(request)
            : await signZomeCall(request);
        return signedZomeCall;
    },
    output: (response) => decode$1(response),
};
const appInfoTransform = (appWs) => ({
    input: (request) => {
        if (appWs.overrideInstalledAppId) {
            return {
                installed_app_id: appWs.overrideInstalledAppId,
            };
        }
        return request;
    },
    output: (response) => response,
});
/**
 * @public
 */
const signZomeCall = async (request) => {
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
        payload: encode$1(request.payload),
        nonce: await randomNonce(),
        expires_at: getNonceExpiration(),
    };
    const hashedZomeCall = await hashZomeCall(unsignedZomeCallPayload);
    const signature = nacl
        .sign(hashedZomeCall, signingCredentialsForCell.keyPair.secretKey)
        .subarray(0, nacl.sign.signatureLength);
    const signedZomeCall = {
        ...unsignedZomeCallPayload,
        signature,
    };
    return signedZomeCall;
};

/**
 * @public
 */
var ActionType;
(function (ActionType) {
    ActionType["Dna"] = "Dna";
    ActionType["AgentValidationPkg"] = "AgentValidationPkg";
    ActionType["InitZomesComplete"] = "InitZomesComplete";
    ActionType["CreateLink"] = "CreateLink";
    ActionType["DeleteLink"] = "DeleteLink";
    ActionType["OpenChain"] = "OpenChain";
    ActionType["CloseChain"] = "CloseChain";
    ActionType["Create"] = "Create";
    ActionType["Update"] = "Update";
    ActionType["Delete"] = "Delete";
})(ActionType || (ActionType = {}));

// https://github.com/holochain/holochain/blob/develop/crates/types/src/dht_op.rs
/**
 * @public
 */
var DhtOpType;
(function (DhtOpType) {
    DhtOpType["StoreRecord"] = "StoreRecord";
    DhtOpType["StoreEntry"] = "StoreEntry";
    DhtOpType["RegisterAgentActivity"] = "RegisterAgentActivity";
    DhtOpType["RegisterUpdatedContent"] = "RegisterUpdatedContent";
    DhtOpType["RegisterUpdatedRecord"] = "RegisterUpdatedRecord";
    DhtOpType["RegisterDeletedBy"] = "RegisterDeletedBy";
    DhtOpType["RegisterDeletedEntryAction"] = "RegisterDeletedEntryAction";
    DhtOpType["RegisterAddLink"] = "RegisterAddLink";
    DhtOpType["RegisterRemoveLink"] = "RegisterRemoveLink";
})(DhtOpType || (DhtOpType = {}));
/**
 * @public
 */
function getDhtOpType(op) {
    return Object.keys(op)[0];
}
/**
 * @public
 */
function getDhtOpAction(op) {
    const opType = getDhtOpType(op);
    const action = Object.values(op)[0][1];
    if (opType === DhtOpType.RegisterAddLink) {
        return {
            type: "CreateLink",
            ...action,
        };
    }
    if (opType === DhtOpType.RegisterUpdatedContent ||
        opType === DhtOpType.RegisterUpdatedRecord) {
        return {
            type: "Update",
            ...action,
        };
    }
    if (action.author)
        return action;
    else {
        const actionType = Object.keys(action)[0];
        return {
            type: actionType,
            ...action[actionType],
        };
    }
}
/**
 * @public
 */
function getDhtOpEntry(op) {
    return Object.values(op)[0][2];
}
/**
 * @public
 */
function getDhtOpSignature(op) {
    return Object.values(op)[0][1];
}

/**
 * Generate a valid hash of a non-existing entry.
 *
 * From https://github.com/holochain/holochain/blob/develop/crates/holo_hash/src/hash_type/primitive.rs
 *
 * @returns An {@link EntryHash}.
 *
 * @public
 */
async function fakeEntryHash() {
    const randomBytes = await randomByteArray(36);
    return new Uint8Array([0x84, 0x21, 0x24, ...randomBytes]);
}
/**
 * Generate a valid agent key of a non-existing agent.
 *
 * @returns An {@link AgentPubKey}.
 *
 * @public
 */
async function fakeAgentPubKey() {
    const randomBytes = await randomByteArray(36);
    return new Uint8Array([0x84, 0x20, 0x24, ...randomBytes]);
}
/**
 * Generate a valid hash of a non-existing action.
 *
 * @returns An {@link ActionHash}.
 *
 * @public
 */
async function fakeActionHash() {
    const randomBytes = await randomByteArray(36);
    return new Uint8Array([0x84, 0x29, 0x24, ...randomBytes]);
}
/**
 * Generate a valid hash of a non-existing DNA.
 *
 * @returns A {@link DnaHash}.
 *
 * @public
 */
async function fakeDnaHash() {
    const randomBytes = await randomByteArray(36);
    return new Uint8Array([0x84, 0x2d, 0x24, ...randomBytes]);
}

export { ActionType, AdminWebsocket, AppAgentWebsocket, AppStatusFilter, AppWebsocket, CellProvisioningStrategy, CellType, CloneId, DhtOpType, GrantedFunctionsType, SignalType, WsClient, decodeHashFromBase64, encodeHashToBase64, fakeActionHash, fakeAgentPubKey, fakeDnaHash, fakeEntryHash, generateSigningKeyPair, getDhtOpAction, getDhtOpEntry, getDhtOpSignature, getDhtOpType, getNonceExpiration, getSigningCredentials, hashZomeCall, randomByteArray, randomCapSecret, randomNonce, setSigningCredentials, signZomeCall };
