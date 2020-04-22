
const BigInteger = require('big-integer');
const assert = require('assert');
const Common = require('./Common');

const assertId = function (id) {
    Common.assertId(id);
    assert(Common.isFungible(id), 'id must have the NF bit set to 0')
}

const maxBaseCollectionId = function (outputBase = 10) {
    return Common.makeMask(255)
        .toString(outputBase)
}

const makeCollectionId = function (baseCollectionId, outputBase = 10) {
    baseCollectionId = BigInteger(baseCollectionId);
    const max = BigInteger(maxBaseCollectionId());
    assert(baseCollectionId.leq(maxBaseCollectionId()), `baseCollectionId is too big (max=${max.toString(outputBase)})`)
    return baseCollectionId
        .toString(outputBase);
}

const getCollectionId = function (id, outputBase = 10) {
    assertId(id);
    return BigInteger(id)
        .toString(outputBase);
}

module.exports = {
    maxBaseCollectionId,
    makeCollectionId,
    getCollectionId
}