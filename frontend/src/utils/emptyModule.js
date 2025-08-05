// Comprehensive mock module to replace @solana/spl-token-group
// This prevents the problematic package from loading

// Mock the getBytesCodec function that's causing the error
const getBytesCodec = () => ({
  encode: () => new Uint8Array(),
  decode: () => ({}),
  read: () => ({}),
  write: () => 0,
  size: () => 0,
});

// Mock all possible exports
const mockExports = {
  // Classes
  TokenGroup: class TokenGroup {
    constructor() {}
    static fromAccountInfo() { return new TokenGroup(); }
    static fromAccountAddress() { return Promise.resolve(new TokenGroup()); }
  },
  TokenGroupMember: class TokenGroupMember {
    constructor() {}
    static fromAccountInfo() { return new TokenGroupMember(); }
    static fromAccountAddress() { return Promise.resolve(new TokenGroupMember()); }
  },
  
  // Functions
  createTokenGroup: () => Promise.resolve({}),
  createTokenGroupMember: () => Promise.resolve({}),
  getTokenGroup: () => Promise.resolve({}),
  getTokenGroupMember: () => Promise.resolve({}),
  
  // Constants
  TOKEN_GROUP_PROGRAM_ID: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  
  // Codec functions
  getBytesCodec,
  getU8Codec: () => getBytesCodec(),
  getU16Codec: () => getBytesCodec(),
  getU32Codec: () => getBytesCodec(),
  getU64Codec: () => getBytesCodec(),
  getStringCodec: () => getBytesCodec(),
  getArrayCodec: () => getBytesCodec(),
  getStructCodec: () => getBytesCodec(),
  getOptionCodec: () => getBytesCodec(),
};

// Export as both named and default exports
module.exports = mockExports;
module.exports.default = mockExports;

// Also export individual functions for ES6 imports
Object.keys(mockExports).forEach(key => {
  module.exports[key] = mockExports[key];
}); 