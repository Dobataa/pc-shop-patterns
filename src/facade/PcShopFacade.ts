import { ConfigurationDirector } from "../builder/ConfigurationDirector.ts";
import { applyUpgrade, upgradeTypes, type UpgradeType } from "../decorator/upgrades.ts";
import type { Computer } from "../model/Computer.ts";
import type { BaseType, Order } from "../order/Order.ts";

export const baseTypes: BaseType[] = ["SERVER", "OFFICE_PC", "GAMING_PC"];

// Facade: the only class the UI talks to. It hides the builder, decorators and orders.
export class PcShopFacade {
  private director = new ConfigurationDirector();
  private orders = new Map<number, Order>();
  private nextId = 1;

  listBaseConfigurations() {
    return baseTypes.map((type) => {
      const pc = this.buildBase(type);
      return { type, price: pc.getPrice(), performance: pc.getPerformance() };
    });
  }

  listUpgrades() {
    const base = this.director.buildOfficePc();
    return upgradeTypes.map((type) => {
      const upgraded = applyUpgrade(base, type);
      // An upgrade's own price/performance = difference to the computer without it.
      return {
        type,
        price: upgraded.getPrice() - base.getPrice(),
        performance: upgraded.getPerformance() - base.getPerformance(),
      };
    });
  }

  createOrder(customer: string, type: BaseType): number {
    if (!baseTypes.includes(type)) throw new Error(`Unknown base configuration: ${type}`);
    if (customer.trim() === "") throw new Error("Customer name is required");
    const order: Order = {
      id: this.nextId++,
      customer: customer.trim(),
      baseType: type,
      upgrades: [],
      status: "DRAFT",
    };
    this.orders.set(order.id, order);
    return order.id;
  }

  addUpgrade(orderId: number, upgrade: UpgradeType): void {
    if (!upgradeTypes.includes(upgrade)) throw new Error(`Unknown upgrade: ${upgrade}`);
    this.getDraft(orderId).upgrades.push(upgrade);
  }

  removeLastUpgrade(orderId: number): void {
    const order = this.getDraft(orderId);
    if (order.upgrades.length === 0) throw new Error("Order has no upgrades to remove");
    order.upgrades.pop();
  }

  getSummary(orderId: number): string {
    const order = this.getOrder(orderId);
    const pc = this.buildComputer(order);
    const lines = pc.getComponents().map((c) => `  - ${c.name}: ${c.price} EUR, ${c.performance} pts`);
    return [
      `Order #${order.id} (${order.status}) for ${order.customer}`,
      pc.getDescription(),
      ...lines,
      `Total price: ${pc.getPrice()} EUR`,
      `Total performance: ${pc.getPerformance()} pts`,
    ].join("\n");
  }

  confirmOrder(orderId: number): void {
    this.getDraft(orderId).status = "CONFIRMED";
  }

  listOrders(): string[] {
    return [...this.orders.values()].map((o) => {
      const pc = this.buildComputer(o);
      return `#${o.id} ${o.customer} - ${o.baseType} - ${pc.getPrice()} EUR - ${o.status}`;
    });
  }

  // --- private helpers ---

  private buildBase(type: BaseType): Computer {
    if (type === "SERVER") return this.director.buildServer();
    if (type === "OFFICE_PC") return this.director.buildOfficePc();
    return this.director.buildGamingPc();
  }

  // Start from the base computer and wrap it with every upgrade in order.
  private buildComputer(order: Order): Computer {
    let pc = this.buildBase(order.baseType);
    for (const upgrade of order.upgrades) {
      pc = applyUpgrade(pc, upgrade);
    }
    return pc;
  }

  private getOrder(orderId: number): Order {
    const order = this.orders.get(orderId);
    if (!order) throw new Error(`Order #${orderId} not found`);
    return order;
  }

  // Same as getOrder, but refuses confirmed orders.
  private getDraft(orderId: number): Order {
    const order = this.getOrder(orderId);
    if (order.status === "CONFIRMED") throw new Error(`Order #${orderId} is confirmed and cannot be changed`);
    return order;
  }
}
