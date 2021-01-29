const BigInteger = require('big-integer');
const assert = require('assert');

const MaxNonFungibleMaskLength = 255;
const NonFungibleFlag = BigInteger('1').shiftLeft(255);


const assertId = function (id) {
    assert(BigInteger(id).leq(makeMask(256)), 'id too big (more than 256 bits)')
}

const assertNfMaskLength = function (nfMaskLength) {
    assert(
        nfMaskLength >= 0 && nfMaskLength <= MaxNonFungibleMaskLength,
        `nfMaskLength must be a Number between 0 and ${MaxNonFungibleMaskLength}`
    );
}

const isFungible = function (id) {
    return BigInteger(id)
        .and(NonFungibleFlag)
        .equals('0');
}

const isNonFungibleToken = function (id, nfMaskLength) {
    assertId(id);
    return !isFungible(id) && !BigInteger(id).and(makeMask(256 - nfMaskLength)).equals('0');
}

const makeMask = function (nbBits) {
    return BigInteger('1')
        .shiftLeft(nbBits)
        .subtract('1')
}

module.exports = {
    MaxNonFungibleMaskLength,
    NonFungibleFlag,
    assertId,
    assertNfMaskLength,
    isFungible,
    isNonFungibleToken,
    makeMask,
}
