import { test } from "node:test";
import assert from "node:assert";
import { PcShopFacade } from "../src/facade/PcShopFacade.ts";

test("full scenario: create, upgrade, remove, confirm", () => {
  const shop = new PcShopFacade();
  const id = shop.createOrder("Ivan", "GAMING_PC"); // 890 EUR
  shop.addUpgrade(id, "EXTRA_RAM"); // +70
  shop.addUpgrade(id, "LIQUID_COOLING"); // +120
  shop.removeLastUpgrade(id); // back to 960
  assert.match(shop.getSummary(id), /Total price: 960 EUR/);

  shop.confirmOrder(id);
  assert.match(shop.getSummary(id), /\(CONFIRMED\)/);
  assert.strictEqual(shop.listOrders().length, 1);
});

test("confirmed order cannot be changed", () => {
  const shop = new PcShopFacade();
  const id = shop.createOrder("Maria", "SERVER");
  shop.confirmOrder(id);
  assert.throws(() => shop.addUpgrade(id, "EXTRA_SSD"), /confirmed/);
  assert.throws(() => shop.removeLastUpgrade(id), /confirmed/);
  assert.throws(() => shop.confirmOrder(id), /confirmed/);
});

test("errors for unknown order and empty upgrade list", () => {
  const shop = new PcShopFacade();
  assert.throws(() => shop.getSummary(99), /not found/);
  const id = shop.createOrder("Petar", "OFFICE_PC");
  assert.throws(() => shop.removeLastUpgrade(id), /no upgrades/);
});
