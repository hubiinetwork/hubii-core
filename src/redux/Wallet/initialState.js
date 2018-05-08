export default {
  loading: false,
  error: false,
  data: [
    {
      name: "my wallet",
      totalBalance: 100.234,
      type: "Hubii Wallet",
      credentials: {
        address: "196028cb75cc39323597bac3e4ce0166f3beb4ee",
        id: "58af2b82-195e-44fd-9344-d775f968f97b",
        version: 3,
        Crypto: {
          cipher: "aes-128-ctr",
          cipherparams: { iv: "8be780ee26a581697d78c5b536a786dc" },
          ciphertext:
            "b8034604963989d9965e461903cc2af276c569d9a8fb62ddb28e9c01f7290089",
          kdf: "scrypt",
          kdfparams: {
            salt:
              "8e2984188916bba215f9d376d9f35dc44bd22f06ea0ab116741463b5483b6325",
            n: 131072,
            dklen: 32,
            p: 1,
            r: 8
          },
          mac:
            "c39d9415bafdf63c9c3510baf79590cc248ade2af53c9bb15086667c0a9e6e3d"
        },
        "x-ethers": {
          client: "ethers.js",
          gethFilename:
            "UTC--2018-04-18T10-38-30.0Z--196028cb75cc39323597bac3e4ce0166f3beb4ee",
          mnemonicCounter: "e7697bfe3dd014e99a631ce9d2bfbcad",
          mnemonicCiphertext: "5087871e5f5836e25dfe2f9cd117248b",
          version: "0.1"
        }
      }
    }
  ]
};
