import * as helper from "@/utils/address-helpers";
import * as utils from "@/utils";
import { transactionCallback } from "@/utils/transactions";

describe("transaction.ts", () => {
  it("transaction callback should throw error when callback function pass error as first parameter", () => {
    jest.spyOn(helper, "txExplorerLink").mockReturnValue("http://test.com");
    const promise = new Promise((resolve, reject) =>
      transactionCallback({ reject, resolve, web3: null, explorer: null })(
        { message: "error" },
        "Ox1234556789ABDCEF"
      )
    );
    expect(helper.txExplorerLink).toBeCalledTimes(1);
    expect(promise).rejects.toThrow("Execution failed error http://test.com");
  });

  it("transaction callback should resolve when waitForReceipt is sucessfull", () => {
    jest.spyOn(helper, "txExplorerLink").mockReturnValue("http://test.com");
    jest.spyOn(utils, "waitForReceipt").mockResolvedValue({ status: true });

    const promise = new Promise((resolve, reject) =>
      transactionCallback({ reject, resolve, web3: null, explorer: null })(
        null,
        "Ox1234556789ABDCEF"
      )
    );
    expect(helper.txExplorerLink).toBeCalledTimes(1);
    expect(utils.waitForReceipt).toBeCalledTimes(1);
    expect(promise).resolves.toMatchObject({ status: true });
  });

  it("transaction callback should reject when waitForReceipt is return status error", async () => {
    jest.spyOn(helper, "txExplorerLink").mockReturnValue("http://test.com");
    jest.spyOn(utils, "waitForReceipt").mockResolvedValue({ status: false });

    process.env.VUE_APP_EXPLORER_ADDRESS = "https://explorer.testnet.rsk.co";

    try {
      await new Promise((resolve, reject) =>
        transactionCallback({ reject, resolve, web3: null, explorer: null })(
          null,
          "Ox1234556789ABDCEF"
        )
      );
      fail("it should not reach here");
    } catch (error) {
      expect(helper.txExplorerLink).toBeCalledTimes(1);
      expect(utils.waitForReceipt).toBeCalledTimes(1);
      expect((error as { message: string }).message).toBe(
        '<span>Error: Transaction Info <a class="error-message" href="https://explorer.testnet.rsk.co/tx/Ox1234556789ABDCEF" target="_blank">https://explorer.testnet.rsk.co/tx/Ox1234556789ABDCEF</a></span>'
      );
    }
  });
});
