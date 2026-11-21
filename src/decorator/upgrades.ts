import type { Computer } from "../model/Computer.ts";
import { UpgradeDecorator } from "./UpgradeDecorator.ts";

// Concrete decorators: each one only says which component it adds.
export class ExtraRam extends UpgradeDecorator {
  constructor(computer: Computer) {
    super(computer, { name: "Extra 16GB RAM", price: 70, performance: 12 });
  }
}

export class BetterGpu extends UpgradeDecorator {
  constructor(computer: Computer) {
    super(computer, { name: "RTX 4080 GPU", price: 900, performance: 70 });
  }
}

export class ExtraSsd extends UpgradeDecorator {
  constructor(computer: Computer) {
    super(computer, { name: "Extra 1TB SSD", price: 80, performance: 8 });
  }
}

export class LiquidCooling extends UpgradeDecorator {
  constructor(computer: Computer) {
    super(computer, { name: "Liquid cooling", price: 120, performance: 10 });
  }
}

export const upgradeTypes = ["EXTRA_RAM", "BETTER_GPU", "EXTRA_SSD", "LIQUID_COOLING"] as const;
export type UpgradeType = (typeof upgradeTypes)[number];

// Wraps the computer with the chosen upgrade.
export function applyUpgrade(computer: Computer, type: UpgradeType): Computer {
  switch (type) {
    case "EXTRA_RAM":
      return new ExtraRam(computer);
    case "BETTER_GPU":
      return new BetterGpu(computer);
    case "EXTRA_SSD":
      return new ExtraSsd(computer);
    case "LIQUID_COOLING":
      return new LiquidCooling(computer);
  }
}
