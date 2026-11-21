import type { Component } from "../model/Component.ts";
import type { Computer } from "../model/Computer.ts";

// Decorator base: wraps another Computer and adds one extra component on top.
export abstract class UpgradeDecorator implements Computer {
  constructor(protected inner: Computer, private extra: Component) {}

  getDescription(): string {
    return `${this.inner.getDescription()} + ${this.extra.name}`;
  }

  getPrice(): number {
    return this.inner.getPrice() + this.extra.price;
  }

  getPerformance(): number {
    return this.inner.getPerformance() + this.extra.performance;
  }

  getComponents(): Component[] {
    return [...this.inner.getComponents(), this.extra];
  }
}
