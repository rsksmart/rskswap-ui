import { GetterTree } from "vuex";
import { SessionState } from "./types";
import { RootState } from "../types";
import { ALL_TOKENS } from "@/constants/tokens/tokens";
import { Token } from "@/types/token";

// export const getters: GetterTree<SessionState, RootState> = {};

export const getters: GetterTree<SessionState, RootState> = {
  allTokens(): Token[] {
    return ALL_TOKENS;
  },
};
