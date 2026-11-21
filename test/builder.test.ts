import { test } from "node:test";
import assert from "node:assert";
import { ComputerBuilder } from "../src/builder/ComputerBuilder.ts";
import { ConfigurationDirector } from "../src/builder/ConfigurationDirector.ts";

const cpu = { name: "CPU", price: 100, performance: 10 };
const ram = { name: "RAM", price: 50, performance: 5 };
const storage = { name: "SSD", price: 30, performance: 3 };

test("build() sums price and performance of all parts", () => {
  const pc = new ComputerBuilder("Test")
    .withCpu(cpu)
    .withRam(ram)
    .withStorage(storage)
    .build();
  assert.strictEqual(pc.getPrice(), 180);
  assert.strictEqual(pc.getPerformance(), 18);
  assert.strictEqual(pc.getComponents().length, 3);
});

test("build() throws when a required part is missing", () => {
  const builder = new ComputerBuilder("Test").withCpu(cpu).withRam(ram);
  assert.throws(() => builder.build(), /storage is missing/);
});

test("director builds all three base configurations", () => {
  const director = new ConfigurationDirector();
  assert.strictEqual(director.buildServer().getDescription(), "Server");
  assert.strictEqual(director.buildOfficePc().getDescription(), "Office PC");
  assert.strictEqual(director.buildGamingPc().getPrice(), 890);
});
