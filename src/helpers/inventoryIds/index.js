const Common = require('./Common');
const Fungible = require('./Fungible');
const NonFungible = require('./NonFungible');


// DEPRECATED
// function idInfo(id, nfMaskLength) {
//     id = BigInteger(id);
//     const fungible = id.and(NonFungibleBit).equals('0');
//     if (fungible || nfMaskLength == 0) {
//         return {
//             collectionId: id,
//             tokenId: BigInteger(),
//             isFungible: true
//         };
//     }
//     const collectionMask = BigInteger('1').shiftLeft(nfMaskLength).subtract('1').shiftLeft(255 - nfMaskLength);
//     const tokenMask = NonFungibleBit.or(collectionMask).not();
//     return {
//         collectionId: id.and(collectionMask),
//         baseCollectionId: id.and(collectionMask).shiftRight(256 - nfMaskLength),
//         baseTokenId: id.and(tokenMask),
//         isFungible: false
//     };
// }

// DEPRECATED
// const collectionId = function (id, nfMaskLength, outputBase = 10) {
//     assertNfMaskLength(nfMaskLength);
//     id = BigInteger(id);
//     if (isFungible(id)) {
//         return id.toString(outputBase);
//     }
//     const collectionMask = makeNonFungibleCollectionMask(nfMaskLength);
//     return id
//         .and(collectionMask)
//         .toString(outputBase);
// }

module.exports = {
    MaxNonFungibleMaskLength: Common.MaxNonFungibleMaskLength,
    NonFungibleFlag: Common.NonFungibleFlag,
    isFungible: Common.isFungible,

    Fungible,
    maxFungibleBaseCollectionId: Fungible.maxBaseCollectionId,
    makeFungibleCollectionId: Fungible.makeCollectionId,
    getFungibleCollectionId: Fungible.getCollectionId,

    NonFungible,
    maxNonFungibleBaseCollectionId: NonFungible.maxBaseCollectionId,
    makeNonFungibleCollectionId: NonFungible.makeCollectionId,
    getNonFungibleBaseCollectionId: NonFungible.getBaseCollectionId,
    getNonFungibleCollectionId: NonFungible.getCollectionId,
    maxNonFungibleBaseTokenId: NonFungible.maxBaseTokenId,
    makeNonFungibleTokenId: NonFungible.makeTokenId,
    getNonFungibleBaseTokenId: NonFungible.getBaseTokenId,

    /* DEPRECATED */
    // idInfo: idInfo,
    // nftId: NonFungible.makeTokenId,
    // collectionId,
}
