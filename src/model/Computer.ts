import type { Component } from "./Component.ts";

// Common interface: a basic computer and every upgrade look the same to the caller.
export interface Computer {
  getDescription(): string;
  getPrice(): number;
  getPerformance(): number;
  getComponents(): Component[];
}
