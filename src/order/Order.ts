import type { UpgradeType } from "../decorator/upgrades.ts";

export type BaseType = "SERVER" | "OFFICE_PC" | "GAMING_PC";
export type OrderStatus = "DRAFT" | "CONFIRMED";

// An order stores only the choices. The Computer chain is built from them when needed.
export type Order = {
  id: number;
  customer: string;
  baseType: BaseType;
  upgrades: UpgradeType[];
  status: OrderStatus;
};
