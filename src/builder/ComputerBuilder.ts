import type { Component } from "../model/Component.ts";
import type { Computer } from "../model/Computer.ts";

// The finished computer. It just holds a list of components and sums them up.
class BasicComputer implements Computer {
  constructor(private name: string, private components: Component[]) {}

  getDescription(): string {
    return this.name;
  }

  getPrice(): number {
    return this.components.reduce((sum, c) => sum + c.price, 0);
  }

  getPerformance(): number {
    return this.components.reduce((sum, c) => sum + c.performance, 0);
  }

  getComponents(): Component[] {
    return [...this.components];
  }
}

// Builder: collects parts step by step, build() checks the required ones.
export class ComputerBuilder {
  private cpu?: Component;
  private ram?: Component;
  private storage?: Component;
  private gpu?: Component;
  private psu?: Component;

  constructor(private name: string) {}

  withCpu(cpu: Component): this {
    this.cpu = cpu;
    return this;
  }

  withRam(ram: Component): this {
    this.ram = ram;
    return this;
  }

  withStorage(storage: Component): this {
    this.storage = storage;
    return this;
  }

  withGpu(gpu: Component): this {
    this.gpu = gpu;
    return this;
  }

  withPsu(psu: Component): this {
    this.psu = psu;
    return this;
  }

  build(): Computer {
    if (!this.cpu) throw new Error("Cannot build: CPU is missing");
    if (!this.ram) throw new Error("Cannot build: RAM is missing");
    if (!this.storage) throw new Error("Cannot build: storage is missing");

    // GPU and PSU are optional, so we only add them if they were set.
    const parts = [this.cpu, this.ram, this.storage];
    if (this.gpu) parts.push(this.gpu);
    if (this.psu) parts.push(this.psu);
    return new BasicComputer(this.name, parts);
  }
}
