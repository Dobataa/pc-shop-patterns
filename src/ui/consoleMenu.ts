import { createInterface } from "node:readline/promises";
import { PcShopFacade } from "../facade/PcShopFacade.ts";
import type { BaseType } from "../order/Order.ts";
import type { UpgradeType } from "../decorator/upgrades.ts";

const MENU = `
=== PC Shop ===
1. Show base configurations
2. New order
3. Add upgrade
4. Remove last upgrade
5. Order summary
6. Confirm order
7. List orders
0. Exit`;

export async function runMenu(): Promise<void> {
  const shop = new PcShopFacade(); // the UI only knows the facade
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  // Reads one line at a time (also works when input is piped). At end of input it answers "0" = exit.
  const lines = rl[Symbol.asyncIterator]();
  async function ask(question: string): Promise<string> {
    process.stdout.write(question + " ");
    const next = await lines.next();
    if (next.done) return "0";
    console.log(next.value); // echo, so piped runs read like a real session
    return next.value;
  }
  const askOrderId = async () => Number(await ask("Order id:"));

  // Shows a numbered list and returns the chosen item.
  async function choose<T extends string>(title: string, items: { type: T; label: string }[]): Promise<T> {
    console.log(title);
    items.forEach((item, i) => console.log(`  ${i + 1}. ${item.label}`));
    const choice = items[Number(await ask("Choice:")) - 1];
    if (!choice) throw new Error("Invalid choice");
    return choice.type;
  }

  const baseItems = () =>
    shop.listBaseConfigurations().map((b) => ({
      type: b.type,
      label: `${b.type} - ${b.price} EUR, ${b.performance} pts`,
    }));

  const upgradeItems = () =>
    shop.listUpgrades().map((u) => ({
      type: u.type,
      label: `${u.type} - +${u.price} EUR, +${u.performance} pts`,
    }));

  while (true) {
    console.log(MENU);
    const option = (await ask("Select:")).trim();
    if (option === "0") break;

    // One try/catch: any error from the facade is shown and the menu continues.
    try {
      if (option === "1") {
        baseItems().forEach((b) => console.log(b.label));
      } else if (option === "2") {
        const customer = await ask("Customer name:");
        const type = await choose<BaseType>("Base configuration:", baseItems());
        console.log(`Created order #${shop.createOrder(customer, type)}`);
      } else if (option === "3") {
        const id = await askOrderId();
        shop.addUpgrade(id, await choose<UpgradeType>("Upgrade:", upgradeItems()));
        console.log("Upgrade added.");
      } else if (option === "4") {
        shop.removeLastUpgrade(await askOrderId());
        console.log("Last upgrade removed.");
      } else if (option === "5") {
        console.log(shop.getSummary(await askOrderId()));
      } else if (option === "6") {
        shop.confirmOrder(await askOrderId());
        console.log("Order confirmed.");
      } else if (option === "7") {
        const orders = shop.listOrders();
        console.log(orders.length ? orders.join("\n") : "No orders yet.");
      } else {
        console.log("Unknown option, try again.");
      }
    } catch (error) {
      console.log(`Error: ${(error as Error).message}`);
    }
  }

  rl.close();
  console.log("Goodbye!");
}
