import { ExpectedAsProductTypes  } from "./foreignTypes";

export interface CartItem extends ExpectedAsProductTypes {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
}
