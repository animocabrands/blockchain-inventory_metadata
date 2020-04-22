const BigInteger = require('big-integer');
const Common = require('./Common');
const assert = require('assert');

const assertNfMaskLength = function (nfMaskLength) {
    Common.assertNfMaskLength(nfMaskLength);
    assert(nfMaskLength > 0, 'nfMaskLength must be > 0 to manage Non Fungibles');
}

const assertId = function (id) {
    Common.assertId(id);
    assert(!Common.isFungible(id), 'id must have the NF bit set to 1');
}

// Collections

// 1 bit is reserved for the non fungible flag
// If nfMaskLength == 1, baseCollectionId can be 0 only (0 bit to encode value)
// If nfMaskLength == 2, baseCollectionId can be 0 or 1 (1 bit to encode value)
// If nfMaskLength == 3, baseCollectionId can be 0, 1, 2 or 3 (2 bits to encode value)
const maxBaseCollectionId = function (nfMaskLength, outputBase = 10) {
    assertNfMaskLength(nfMaskLength);
    return Common.makeMask(nfMaskLength - 1).toString(outputBase);
}

const makeCollectionMask = function (nfMaskLength) {
    assertNfMaskLength(nfMaskLength);
    return Common.makeMask(nfMaskLength).shiftLeft(256 - nfMaskLength);
}

const makeCollectionId = function (baseCollectionId, nfMaskLength, outputBase = 10) {
    // assertNfMaskLength(nfMaskLength);
    baseCollectionId = BigInteger(baseCollectionId);
    const max = BigInteger(maxBaseCollectionId(nfMaskLength));
    assert(baseCollectionId.leq(max), `baseCollectionId is too big (max=${max.toString(outputBase)})`);
    return baseCollectionId
        .shiftLeft(256 - nfMaskLength)
        .or(Common.NonFungibleFlag)
        .toString(outputBase);
}

const getCollectionId = function (id, nfMaskLength, outputBase = 10) {
    // assertNfMaskLength(nfMaskLength); // already done in makeCollectionMask()
    assertId(id);
    return BigInteger(id)
        .and(makeCollectionMask(nfMaskLength))
        .toString(outputBase);
}

const getBaseCollectionId = function (id, nfMaskLength, outputBase = 10) {
    // assertNfMaskLength(nfMaskLength); // already done in getCollectionId()
    // assertId(id); // already done in getCollectionId()
    return BigInteger(getCollectionId(id, nfMaskLength))
        .xor(Common.NonFungibleFlag) // remove nf flag
        .shiftRight(256 - nfMaskLength)
        .toString(outputBase);
}

// Tokens

const maxBaseTokenId = function (nfMaskLength, outputBase = 10) {
    assertNfMaskLength(nfMaskLength);
    return Common.makeMask(256 - nfMaskLength).toString(outputBase);
}

const makeTokenMask = function (nfMaskLength) {
    // assertNfMaskLength(nfMaskLength); // already done in maxBaseTokenId()
    return maxBaseTokenId(nfMaskLength);
}

const makeTokenId = function (baseTokenId, baseCollectionId, nfMaskLength, outputBase = 10) {
    // assertNfMaskLength(nfMaskLength); // already done in maxBaseTokenId()

    baseTokenId = BigInteger(baseTokenId);
    assert(!baseTokenId.eq(BigInteger('0')), 'baseTokenId must not be 0');
    const max = BigInteger(maxBaseTokenId(nfMaskLength));
    assert(baseTokenId.leq(max), `baseTokenId is too big (max=${max.toString(outputBase)})`);

    const collectionId = BigInteger(makeCollectionId(baseCollectionId, nfMaskLength));

    return baseTokenId
        .or(collectionId)
        .toString(outputBase);
}

const getBaseTokenId = function (id, nfMaskLength, outputBase = 10) {
    // assertNfMaskLength(nfMaskLength); // already done in makeTokenMask()
    assertId(id);
    return BigInteger(id)
        .and(makeTokenMask(nfMaskLength))
        .toString(outputBase);
}

module.exports = {
    maxBaseCollectionId,
    // makeCollectionMask,
    makeCollectionId,
    getCollectionId,
    getBaseCollectionId,

    maxBaseTokenId,
    // makeTokenMask,
    makeTokenId,
    getBaseTokenId,
}