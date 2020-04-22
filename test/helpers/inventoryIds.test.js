const BigInteger = require('big-integer');
const { AssertionError } = require('assert');
const { NonFungibleFlag, isFungible, Fungible, NonFungible } = require('../../src/helpers/inventoryIds');
const { makeMask } = require('../../src/helpers/inventoryIds/common');

require('chai').should();

describe('Inventory Ids Helper', function () {
    describe('Fungibles', function () {
        describe('maxBaseCollectionId()', function () {
            it('should return the correct value', function () {
                Fungible.maxBaseCollectionId(16).toUpperCase().should.equal('7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')
            });
        });

        describe('makeCollectionId()', function () {
            it('should return the correct value', function () {
                Fungible.makeCollectionId(0).should.equal('0');
                Fungible.makeCollectionId(1).should.equal('1');
                Fungible.makeCollectionId(2).should.equal('2');
            });
            it('should throw if baseCollectionId is too big', function () {
                Fungible.makeCollectionId(Fungible.maxBaseCollectionId(), 16).toUpperCase().should.equal('7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
                (function () {
                    Fungible.makeCollectionId(BigInteger(Fungible.maxBaseCollectionId()).plus('1')); // overflow on the non fungible flag
                }).should.throw(AssertionError);
            });
        });

        describe('getCollectionId()', function () {
            it('should return the correct value', function () {
                Fungible.getCollectionId(0).should.equal('0');
                Fungible.getCollectionId(1).should.equal('1');
                Fungible.getCollectionId(2).should.equal('2');
                Fungible.getCollectionId(Fungible.maxBaseCollectionId(), 16).toUpperCase().should.equal('7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
            });
            it('should throw if baseCollectionId is too big', function () {
                (function () {
                    Fungible.getCollectionId(BigInteger(Fungible.maxBaseCollectionId()).plus('1')); // overflow on the non fungible flag
                }).should.throw(AssertionError);
            });
        });
    });

    describe('Non Fungibles', function () {

        describe('maxBaseCollectionId()', function () {
            it('should throw if nfMaskLength = 0', function () {
                (function () {
                    NonFungible.maxBaseCollectionId(0);
                }).should.throw(AssertionError);
            });
            it('should throw if nfMaskLength >= 256', function () {
                (function () {
                    NonFungible.maxBaseCollectionId(256);
                }).should.throw(AssertionError);
                (function () {
                    NonFungible.maxBaseCollectionId(257);
                }).should.throw(AssertionError);
            });
            it('should return the correct value', function () {
                NonFungible.maxBaseCollectionId(1).should.equal('0');
                NonFungible.maxBaseCollectionId(2).should.equal('1');
                NonFungible.maxBaseCollectionId(3).should.equal('3');
                NonFungible.maxBaseCollectionId(4).should.equal('7');
                NonFungible.maxBaseCollectionId(5).should.equal('15');
                NonFungible.maxBaseCollectionId(255, 16).toUpperCase().should.equal('3FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
            });
        });

        describe('makeCollectionId()', function () {

            const shouldReturnCorrectValue = function (baseCollectionId, nfMaskLength, value) {
                it(`should return the correct value for baseCollectionId=${baseCollectionId} and nfMaskLength=${nfMaskLength}`, function () {
                    const collectionId = NonFungible.makeCollectionId(baseCollectionId, nfMaskLength);
                    collectionId.should.equal(value);
                    NonFungible.getCollectionId(collectionId, nfMaskLength).should.equal(collectionId);
                    NonFungible.getBaseCollectionId(collectionId, nfMaskLength).should.equal(baseCollectionId);
                    isFungible(collectionId).should.equal(false);
                });
            }

            const shouldThrow = function (baseCollectionId, nfMaskLength) {
                it(`should throw for baseCollectionId=${baseCollectionId} and nfMaskLength=${nfMaskLength}`, function () {
                    (function () {
                        NonFungible.makeCollectionId(baseCollectionId, nfMaskLength);
                    }).should.throw(AssertionError);
                });
            }

            context('with nfMaskLength = 0', function () {
                shouldThrow(0, 0);
            });
            context('with nfMaskLength >= 256', function () {
                shouldThrow(0, 256);
                shouldThrow(0, 257);
            });
            context('with Non Fungible mask length = 1 (one collection possible)', function () {

                shouldReturnCorrectValue('0', 1, NonFungibleFlag.toString(10));

                context('overflowing baseCollectionId values', function () {
                    shouldThrow(1, 1);
                    shouldThrow(2, 1);
                });
            });
            context('with Non Fungible mask length = 2 (2 collections possible)', function () {
                shouldReturnCorrectValue('0', 2, NonFungibleFlag.toString(10));
                shouldReturnCorrectValue('1', 2, makeMask(2).shiftLeft('254').toString(10));

                context('overflowing baseCollectionId values', function () {
                    shouldThrow(2, 2);
                    shouldThrow(3, 2);
                });
            });
            context('with Non Fungible mask length = 3 (4 collections possible)', function () {
                shouldReturnCorrectValue('0', 3, NonFungibleFlag.toString(10));
                shouldReturnCorrectValue('2', 3, makeMask(2).shiftLeft('254').toString(10));
                shouldReturnCorrectValue('3', 3, makeMask(3).shiftLeft('253').toString(10));

                context('overflowing baseCollectionId values', function () {
                    shouldThrow(4, 3);
                    shouldThrow(5, 3);
                });
            });
            context('with Non Fungible mask length = 255', function () {
                shouldReturnCorrectValue('0', 255, NonFungibleFlag.toString(10));
                shouldReturnCorrectValue(NonFungible.maxBaseCollectionId(255), 255, makeMask(255).shiftLeft('1').toString(10));

                context('overflowing baseCollectionId values', function () {
                    shouldThrow(BigInteger(NonFungible.maxBaseCollectionId(255)).plus('1'), 255);
                    shouldThrow(BigInteger(NonFungible.maxBaseCollectionId(255)).plus('2'), 255);
                });
            });
        });

        describe('maxBaseTokenId()', function () {
            it('should throw nfMaskLength = 0', function () {
                (function () {
                    NonFungible.maxBaseTokenId(0);
                }).should.throw(AssertionError);
            });
            it('should throw nfMaskLength >= 256', function () {
                (function () {
                    NonFungible.maxBaseTokenId(256);
                }).should.throw(AssertionError);
                (function () {
                    NonFungible.maxBaseTokenId(257);
                }).should.throw(AssertionError);
            });
            it('should return the correct value', function () {
                NonFungible.maxBaseTokenId(1, 16).toUpperCase().should.equal('7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
                NonFungible.maxBaseTokenId(2, 16).toUpperCase().should.equal('3FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
                NonFungible.maxBaseTokenId(3, 16).toUpperCase().should.equal('1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
                NonFungible.maxBaseTokenId(253).should.equal('7');
                NonFungible.maxBaseTokenId(254).should.equal('3');
                NonFungible.maxBaseTokenId(255).should.equal('1');
            });
        });

        describe('makeTokenId()', function () {

            const shouldReturnCorrectValue = function (baseTokenId, baseCollectionId, nfMaskLength, value) {
                it(`should return the correct value for baseTokenId=${baseTokenId}, baseCollectionId=${baseCollectionId} and nfMaskLength=${nfMaskLength}`, function () {
                    const tokenId = NonFungible.makeTokenId(baseTokenId, baseCollectionId, nfMaskLength);
                    tokenId.should.equal(value);
                    NonFungible.getBaseTokenId(tokenId, nfMaskLength).should.equal(BigInteger(baseTokenId).toString(10));
                    isFungible(tokenId).should.equal(false);
                });
            }

            const shouldThrow = function (baseTokenId, baseCollectionId, nfMaskLength) {
                it(`should throw for baseTokenId=${baseTokenId}, baseCollectionId=${baseCollectionId} and nfMaskLength=${nfMaskLength}`, function () {
                    (function () {
                        NonFungible.makeTokenId(baseTokenId, baseCollectionId, nfMaskLength);
                    }).should.throw(AssertionError);
                });
            }

            context('with nfMaskLength = 0', function () {
                shouldThrow(1, 0, 0);
            });
            context('with nfMaskLength >= 256', function () {
                shouldThrow(1, 0, 256);
                shouldThrow(1, 0, 257);
            });
            context('with baseTokenId = 0', function () {
                shouldThrow(0, 1, 1);
                shouldThrow(0, 1, 32);
                shouldThrow(0, 1, 255);
            });
            context('with Non Fungible mask length = 255 (only one token possible)', function () {
                context('with baseTokenId = 1 (max)', function () {
                    shouldReturnCorrectValue('1', '0', 255, BigInteger('8000000000000000000000000000000000000000000000000000000000000001', 16).toString(10));
                    shouldReturnCorrectValue('1', '1', 255, BigInteger('8000000000000000000000000000000000000000000000000000000000000003', 16).toString(10));
                    shouldReturnCorrectValue('1', '2', 255, BigInteger('8000000000000000000000000000000000000000000000000000000000000005', 16).toString(10));
                    shouldReturnCorrectValue('1', BigInteger(NonFungible.maxBaseCollectionId(255)).minus('1'), 255, BigInteger('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD', 16).toString(10));
                    shouldReturnCorrectValue('1', NonFungible.maxBaseCollectionId(255), 255, BigInteger('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16).toString(10));
                });
                context('overflowing baseTokenId values', function () {
                    shouldThrow(2, 0, 255);
                    shouldThrow(3, 0, 255);
                });
                context('overflowing baseCollectionId values', function () {
                    shouldThrow(1, BigInteger(NonFungible.maxBaseCollectionId(255)).plus('1'), 255);
                    shouldThrow(1, BigInteger(NonFungible.maxBaseCollectionId(255)).plus('2'), 255);
                });
            });
            context('with Non Fungible mask length = 254 (3 tokens possible)', function () {
                context('with baseTokenId = 1', function () {
                    shouldReturnCorrectValue('1', '0', 254, BigInteger('8000000000000000000000000000000000000000000000000000000000000001', 16).toString(10));
                    shouldReturnCorrectValue('1', '1', 254, BigInteger('8000000000000000000000000000000000000000000000000000000000000005', 16).toString(10));
                    shouldReturnCorrectValue('1', '2', 254, BigInteger('8000000000000000000000000000000000000000000000000000000000000009', 16).toString(10));
                    shouldReturnCorrectValue('1', BigInteger(NonFungible.maxBaseCollectionId(254)).minus('1'), 254, BigInteger('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9', 16).toString(10));
                    shouldReturnCorrectValue('1', NonFungible.maxBaseCollectionId(254), 254, BigInteger('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD', 16).toString(10));
                });
                context('with baseTokenId = 3 (max)', function () {
                    shouldReturnCorrectValue('3', '0', 254, BigInteger('8000000000000000000000000000000000000000000000000000000000000003', 16).toString(10));
                    shouldReturnCorrectValue('3', '1', 254, BigInteger('8000000000000000000000000000000000000000000000000000000000000007', 16).toString(10));
                    shouldReturnCorrectValue('3', '2', 254, BigInteger('800000000000000000000000000000000000000000000000000000000000000B', 16).toString(10));
                    shouldReturnCorrectValue('3', BigInteger(NonFungible.maxBaseCollectionId(254)).minus('1'), 254, BigInteger('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFB', 16).toString(10));
                    shouldReturnCorrectValue('3', NonFungible.maxBaseCollectionId(254), 254, BigInteger('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16).toString(10));
                });

                context('overflowing baseTokenId values', function () {
                    shouldThrow(4, 0, 254);
                    shouldThrow(5, 0, 254);
                });
                context('overflowing baseCollectionId values', function () {
                    shouldThrow(1, BigInteger(NonFungible.maxBaseCollectionId(254)).plus('1'), 254);
                    shouldThrow(1, BigInteger(NonFungible.maxBaseCollectionId(254)).plus('2'), 254);
                });
            });
            context('with Non Fungible mask length = 2 (2 collections possible)', function () {
                context('with baseCollectionId = 0', function () {
                    shouldReturnCorrectValue('1', '0', 2, BigInteger('8000000000000000000000000000000000000000000000000000000000000001', 16).toString(10));
                    shouldReturnCorrectValue('2', '0', 2, BigInteger('8000000000000000000000000000000000000000000000000000000000000002', 16).toString(10));
                    shouldReturnCorrectValue(BigInteger(NonFungible.maxBaseTokenId(2)).minus('1'), '0', 2, BigInteger('BFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE', 16).toString(10));
                    shouldReturnCorrectValue(BigInteger(NonFungible.maxBaseTokenId(2)), '0', 2, BigInteger('BFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16).toString(10));
                });
                context('with baseCollectionId = 1 (max)', function () {
                    shouldReturnCorrectValue('1', '1', 2, BigInteger('C000000000000000000000000000000000000000000000000000000000000001', 16).toString(10));
                    shouldReturnCorrectValue('2', '1', 2, BigInteger('C000000000000000000000000000000000000000000000000000000000000002', 16).toString(10));
                    shouldReturnCorrectValue(BigInteger(NonFungible.maxBaseTokenId(2)).minus('1'), '0', 2, BigInteger('BFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE', 16).toString(10));
                    shouldReturnCorrectValue(BigInteger(NonFungible.maxBaseTokenId(2)), '0', 2, BigInteger('BFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16).toString(10));
                });

                context('overflowing baseTokenId values', function () {
                    shouldThrow(BigInteger(NonFungible.maxBaseTokenId(2)).plus('1'), 0, 2);
                    shouldThrow(BigInteger(NonFungible.maxBaseTokenId(2)).plus('2'), 0, 2);
                });
                context('overflowing baseCollectionId values', function () {
                    shouldThrow(1, 2, 2);
                    shouldThrow(1, 3, 2);
                });
            });
            context('with Non Fungible mask length = 1 (one collection possible)', function () {
                context('with baseCollectionId = 0', function () {

                    shouldReturnCorrectValue('1', '0', 1, BigInteger('8000000000000000000000000000000000000000000000000000000000000001', 16).toString(10));
                    shouldReturnCorrectValue('2', '0', 1, BigInteger('8000000000000000000000000000000000000000000000000000000000000002', 16).toString(10));
                    shouldReturnCorrectValue(BigInteger(NonFungible.maxBaseTokenId(1)).minus('1'), '0', 1, BigInteger('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE', 16).toString(10));
                    shouldReturnCorrectValue(BigInteger(NonFungible.maxBaseTokenId(1)), '0', 1, BigInteger('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16).toString(10));

                    context('overflowing baseTokenId values', function () {
                        shouldThrow(BigInteger(NonFungible.maxBaseTokenId(1)).plus('1'), 0, 1);
                        shouldThrow(BigInteger(NonFungible.maxBaseTokenId(1)).plus('2'), 0, 1);
                    });
                    context('overflowing baseCollectionId values', function () {
                        shouldThrow(1, 1, 1);
                        shouldThrow(1, 1, 1);
                    });
                });
            });
        });
    });
});
