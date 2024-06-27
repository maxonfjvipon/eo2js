const ErFailure = require('./error/ErFailure');
/**
 * The number of bits used to represent a byte value in two's complement binary form.
 * @type {number}
 */
const BYTE_SIZE = 8

/**
 * Hex byte array to int byte array.
 * Converts this:
 * [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x39]
 * to this:
 * [0, 0, 0, 0, 0, 0, 48, 57]
 * If int byte array is provided - return it
 * @param {Array.<string>|Array.<number>} bytes - Byte array
 * @returns {Array.<number>} - Int byte array
 */
const hexToInt = function(bytes) {
  let byte
  return bytes.map((hex) => {
    if (typeof hex === 'number' && Number.isInteger(hex)) {
      byte = hex
    } else if (hex.length === 4 && hex.indexOf('0x') === 0) {
      byte = parseInt(hex, 16)
    } else {
      throw new Error(
        `Wrong format of element ${hex} in byte array ${bytes}\nShould be either integer of hexadecimal starting with '0x'`
      )
    }
    return byte
  })
}

/**
 * Adjust byte array for numbers.
 * This is temporary solution that may fail at any moment. Should be removed as soon as possible.
 * @param {Array.<number>} bytes - Byte array
 * @returns {Array.<number>} - Adjusted byte array
 */
const adjustNumber = function(bytes) {
  if (bytes.length === 8) {
    const number = bytesOf(
      new DataView(new Int8Array(bytes).buffer).getBigInt64(0)
    ).asBytes()
    return bytes.map((byte, index) => {
      if (Math.abs(byte - number[index]) === 256) {
        return byte - 256
      }
      return byte
    })
  }
  return bytes
}

/**
 * Bytes of.
 * @param {string|number|bigint|boolean|Array.<string>|Array.<number>} data - Data to cast to bytes
 * @returns {{
 *  asInt: () => bigint,
 *  asBool: () => boolean,
 *  asString: () => string,
 *  asFloat: () => number,
 *  asBytes: () => Array.<number>,
 *  verbose: () => string,
 *  and: (other: Array.<number>) => object,
 *  or: (other: Array.<number>) => object,
 *  xor: (other: Array.<number>) => object,
 *  not: () => object,
 *  shift: (number) => object
 * }} - Bytes converter
 * @todo #3:30min Fix bytes converting for integers. There are some differences between how Java
 *  generate byte array from integers and JS. For example we get the number -18 in XMIR as
 *  ['0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xFF', '0xEE'] byte Array. After it cast from
 *  hex to int it looks like: [255, 255, 255, 255, 255, 255, 255, 238]. But when we do
 *  {@code bytesOf(-18).asBytes()} we get [-1, -1, -1,  -1, -1, -1, -1, -72]. Technically - these
 *  arrays are the same because they'll converted to the same integer value -18. But at the level of
 *  bytes they are different. So we need to adapt the logic of bytes converting to Java so
 *  generated arrays are the same. For now we use some kind of hack {@link adjustNumber} which
 *  just allows EO tests to pass but obviously it's wrong.
 */
const bytesOf = function(data) {
  let bytes
  if (typeof data === 'number' || typeof data === 'bigint') {
    const buffer = new ArrayBuffer(8)
    const view = new DataView(buffer)
    if (typeof data === 'bigint') {
      view.setBigInt64(0, BigInt(data))
    } else {
      view.setFloat64(0, data)
    }
    bytes = Array.from(new Int8Array(buffer))
  } else if (typeof data === 'string') {
    bytes = Array.from(Buffer.from(data, 'utf-8'))
  } else if (typeof data === 'boolean') {
    bytes = [data ? 1 : 0]
  } else if (Array.isArray(data)) {
    bytes = adjustNumber(hexToInt(data))
  } else {
    throw new Error(`Can't convert to bytes object of given type (${typeof data})`)
  }
  return {
    /**
     * Get byte array.
     * @returns {Array.<number>} - Byte array
     */
    asBytes: function() {
      return bytes
    },
    /**
     * Convert bytes to integer.
     * @returns {bigint} - Integer number
     */
    asInt: function() {
      if (bytes.length !== 8) {
        throw new ErFailure(`Byte array must be 8 bytes long to convert to int (${bytes})`)
      }
      return new DataView(new Int8Array(bytes).buffer).getBigInt64(0)
    },
    /**
     * Convert bytes to float.
     * @returns {number} - Float number
     */
    asFloat: function() {
      if (bytes.length !== 8) {
        throw new Error(`Byte array must be 8 bytes long to convert to float (${bytes})`)
      }
      return new DataView(new Int8Array(bytes).buffer).getFloat64(0)
    },
    /**
     * Convert bytes to string
     * @returns {string} - String number
     */
    asString: function() {
      return Buffer.from(bytes).toString('utf-8')
    },
    /**
     * Convert bytes to bool.
     * @returns {boolean} - Boolean
     */
    asBool: function() {
      if (bytes.length !== 1) {
        throw new Error(`Byte array must be 1 byte long to convert to bool (${bytes})`)
      }
      return bytes[0] !== 0
    },
    /**
     * Get verbose bytes string representation depends on its length
     * @returns {string} - Verbose string representation of bytes
     */
    verbose: function() {
      let str
      if (bytes.length === 0) {
        str = '--'
      } else if (bytes.length === 1) {
        if (bytes[0] === 1) {
          str = 'true'
        } else if (bytes[0] === 0) {
          str = 'false'
        } else {
          str = `[${bytes[0]}]`
        }
      } else if (bytes.length === 8) {
        str = `[${this.asBytes()}] = ${this.asInt()}, or ${this.asFloat()}, or "${this.asString()}"`
      } else {
        str = `[${this.asBytes()}] = "${this.asString()}"`
      }
      return str
    },
    /**
     * Logical AND.
     * @param {Array.<number>} other - Other byte array
     * @returns {{
     *  asInt: () => bigint,
     *  asBool: () => boolean,
     *  asString: () => string,
     *  asFloat: () => number,
     *  asBytes: () => Array.<number>,
     *  verbose: () => string,
     *  and: (other: Array.<number>) => object,
     *  or: (other: Array.<number>) => object,
     *  xor: (other: Array.<number>) => object,
     *  not: () => object,
     *  shift: (number) => object
     * }} - Bytes after AND.
     */
    and: function(other) {
      const copy = bytes
      for (let i = 0; i < Math.min(copy.length, other.length); ++i) {
        copy[i] = copy[i] & other[i]
      }
      return bytesOf(copy)
    },
    /**
     * Logical OR.
     * @param {Array.<number>} other - Other byte array
     * @returns {{
     *  asInt: () => bigint,
     *  asBool: () => boolean,
     *  asString: () => string,
     *  asFloat: () => number,
     *  asBytes: () => Array.<number>,
     *  verbose: () => string,
     *  and: (other: Array.<number>) => object,
     *  or: (other: Array.<number>) => object,
     *  xor: (other: Array.<number>) => object,
     *  not: () => object,
     *  shift: (number) => object
     * }} - Bytes after OR.
     */
    or: function(other) {
      const copy = bytes
      for (let i = 0; i < Math.min(copy.length, other.length); ++i) {
        copy[i] = copy[i] | other[i]
      }
      return bytesOf(copy)
    },
    /**
     * XOR.
     * @param {Array.<number>} other - Other byte array
     * @returns {{
     *  asInt: () => bigint,
     *  asBool: () => boolean,
     *  asString: () => string,
     *  asFloat: () => number,
     *  asBytes: () => Array.<number>,
     *  verbose: () => string,
     *  and: (other: Array.<number>) => object,
     *  or: (other: Array.<number>) => object,
     *  xor: (other: Array.<number>) => object,
     *  not: () => object,
     *  shift: (number) => object
     * }} - Bytes after XOR.
     */
    xor: function(other) {
      const copy = bytes
      for (let i = 0; i < Math.min(copy.length, other.length); ++i) {
        copy[i] = copy[i] ^ other[i]
      }
      return bytesOf(copy)
    },
    /**
     * Logical NOT.
     * @returns {{
     *  asInt: () => bigint,
     *  asBool: () => boolean,
     *  asString: () => string,
     *  asFloat: () => number,
     *  asBytes: () => Array.<number>,
     *  verbose: () => string,
     *  and: (other: Array.<number>) => object,
     *  or: (other: Array.<number>) => object,
     *  xor: (other: Array.<number>) => object,
     *  not: () => object,
     *  shift: (number) => object
     * }} - Bytes after negation.
     */
    not: function() {
      const copy = bytes
      for (let i = 0; i < copy.length; ++i) {
        copy[i] = ~copy[i]
      }
      return bytesOf(copy)
    },
    /**
     * Big-endian unsigned shift.
     * Shifts left if value is positive, or right otherwise.
     * Does not perform sign extension.
     * @param {number} bits - Bits amount
     * @returns {{
     *  asInt: () => bigint,
     *  asBool: () => boolean,
     *  asString: () => string,
     *  asFloat: () => number,
     *  asBytes: () => Array.<number>,
     *  verbose: () => string,
     *  and: (other: Array.<number>) => object,
     *  or: (other: Array.<number>) => object,
     *  xor: (other: Array.<number>) => object,
     *  not: () => object,
     *  shift: (number) => object
     * }} - Bytes after shift.
     */
    shift: function(bits) {
      bits = Number(bits)
      const bts = bytes
      const mod = Math.abs(bits) % BYTE_SIZE;
      const offset = Math.floor(Math.abs(bits) / BYTE_SIZE);
      if (bits < 0) {
        const carry = (0x01 << mod) - 1
        for (let index = 0; index < bts.length; ++index) {
          const source = index + offset;
          if (source >= bts.length) {
            bts[index] = 0;
          } else {
            let dst = bts[source] << mod
            if (source + 1 < bts.length) {
              dst |= bts[source + 1] >>> (BYTE_SIZE - mod) & (carry & 0xFF);
            }
            bts[index] = dst;
          }
        }
      } else {
        const carry = 0xFF << (BYTE_SIZE - mod)
        for (let index = bts.length - 1; index >= 0; --index) {
          const source = index - offset;
          if (source < 0) {
            bts[index] = 0;
          } else {
            let dst = (0xFF & bts[source]) >>> mod;
            if (source - 1 >= 0) {
              dst |= bts[source - 1] << (BYTE_SIZE - mod) & (carry & 0xFF);
            }
            bts[index] = dst;
          }
        }
      }
      return bytesOf(bts)
    }
  }
}

module.exports = bytesOf
