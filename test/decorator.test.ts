import { test } from "node:test";
import assert from "node:assert";
import { ConfigurationDirector } from "../src/builder/ConfigurationDirector.ts";
import { applyUpgrade, ExtraRam, LiquidCooling } from "../src/decorator/upgrades.ts";

const officePc = () => new ConfigurationDirector().buildOfficePc(); // 200 EUR, 38 points

test("one decorator adds its price, performance and component", () => {
  const pc = new ExtraRam(officePc());
  assert.strictEqual(pc.getPrice(), 270);
  assert.strictEqual(pc.getPerformance(), 50);
  assert.strictEqual(pc.getComponents().length, 4);
});

test("different decorators stack", () => {
  const pc = new LiquidCooling(new ExtraRam(officePc()));
  assert.strictEqual(pc.getPrice(), 390);
  assert.strictEqual(pc.getPerformance(), 60);
  assert.strictEqual(pc.getDescription(), "Office PC + Extra 16GB RAM + Liquid cooling");
});

test("the same decorator can be applied twice", () => {
  const pc = applyUpgrade(applyUpgrade(officePc(), "EXTRA_RAM"), "EXTRA_RAM");
  assert.strictEqual(pc.getPrice(), 340);
  assert.strictEqual(pc.getPerformance(), 62);
});
