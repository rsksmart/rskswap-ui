import { parseMessageToSign } from "@/helpers/SignHelper";
import { parsedMessage } from "../mocks/parsedMessage";

describe("SignHelper", () => {
  it("Should create the parsed message structure", () => {
    const messageParsed = parseMessageToSign(
      "0",
      1654847820,
      "AnyswapV6ERC20",
      "0xa7260287Ab1845CA27A921AaE0048090AADB5F75",
      "0xC7E2506A8Aa65F35C7A524Aef399fa731aF1780d",
      0.1,
      18
    );
    expect(JSON.stringify(messageParsed)).toEqual(JSON.stringify(parsedMessage));
  });

  it("Should return wrong parsed message", () => {
    const messageParsed = parseMessageToSign(
        "0",
        1654847820,
        "AnyswapV6ERC21",
        "0xa7260287Ab1845CA27A921AaE0048090AADB5F75",
        "0xC7E2506A8Aa65F35C7A524Aef399fa731aF1780d",
        0.1,
        18
      );
    expect(JSON.stringify(messageParsed)).not.toEqual(JSON.stringify(parsedMessage));
  });
});
