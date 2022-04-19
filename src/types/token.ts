export interface Token {
  token?: string;
  symbol: string;
  name: string;
  typeId: number;
  decimals: number;
  icon: string;
  type: "ERC20" | "NATIVE";
  address?: string;
}
