const ErFailure = require('./error/ErFailure');

/**
 * Memory itself.
 * @type {{}}
 */
const BLOCKS = {}

/**
 * Blocks identifier
 * @type {number}
 */
let identifier = 0

/**
 * Dynamic memory.
 * @type {{
 *  malloc: (number) => number,
 *  read: (number, number, number) => Array.<number>,
 *  free: (number) => void,
 *  write: (number, number, data: Array.<number>) => void
 * }}
 */
const heaps = {
  /**
   * Allocate block in memory of given size.
   * @param {number} size - Size of the block to allocate
   * @returns {number} - Identifier of allocated block
   */
  malloc: function(size) {
    const id = ++identifier
    if (Object.hasOwn(BLOCKS, id)) {
      throw new ErFailure(
        `Can't allocate block in memory with identifier ${id} because it's already allocated`
      )
    }
    BLOCKS[id] = Array(size).fill(0)
    return id
  },
  /**
   * Write given data to the block in memory by given identifier.
   * @param {number} id - Identifier
   * @param {number} offset - Offset
   * @param {Array.<number>} data - Data tto write
   */
  write: function(id, offset, data) {
    if (!Object.hasOwn(BLOCKS, id)) {
      throw new ErFailure(
        `Can't read a block in memory with identifier ${id} because it's not allocated`,
      )
    }
    const current = BLOCKS[id]
    const length = current.length;
    if (length < offset + data.length) {
      throw new ErFailure(
        `Can't write ${data.length} bytes with offset ${offset} to the block with identifier ${id}, because only ${length} were allocated`,
      );
    }
    const result = Array(length).fill(0)
    if (offset > 0) {
      result.splice(0, offset, ...current.slice(0, offset))
    }
    result.splice(offset, data.length, ...data)
    if (length > offset + data.length) {
      result.splice(
        offset + data.length,
        length - offset - data.length,
        ...current.slice(offset + data.length)
      )
    }
    BLOCKS[id] = result
  },
  /**
   * Get data from the block in memory by identifier.
   * @param {number} id - Identifier
   * @param {number} offset - Offset
   * @param {number} length - Length
   * @returns {Array.<number>} - Data from the block in memory
   */
  read: function(id, offset, length) {
    if (!Object.hasOwn(BLOCKS, id)) {
      throw new ErFailure(
        `Block in memory by identifier ${id} is not allocated, can't read`,
      );
    }
    const bytes = BLOCKS[id]
    if (offset + length > bytes.length) {
      throw new ErFailure(
        `Can't read ${length} bytes from offset ${offset}, because only ${bytes.length} are allocated`,
      );
    }
    return bytes.slice(offset, offset + length)
  },
  /**
   * Free the block in memory by identifier.
   * @param {number} id - Identifier of pointer
   */
  free: function(id) {
    if (!Object.hasOwn(BLOCKS, id)) {
      throw new ErFailure(
        `Can't free a block in memory with identifier ${id} because it's not allocated`,
      );
    }
    delete BLOCKS[id]
  }
}

module.exports = heaps
