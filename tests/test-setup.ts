/* eslint-disable no-var */
process.env.VUE_APP_RELAYER_ADDRESS = "0x722D892e6dDaa0EFDe08aC23FF25571D86FBacD4";
process.env.VUE_APP_CHAIN_ID = '31';
// mocking TextEncoder/TextDecoder
const init = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { TextEncoder, TextDecoder } = require("util");

  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
};
init();
