import type { Computer } from "../model/Computer.ts";
import { ComputerBuilder } from "./ComputerBuilder.ts";

// Director: knows the recipe for each base configuration.
export class ConfigurationDirector {
  buildServer(): Computer {
    return new ComputerBuilder("Server")
      .withCpu({ name: "Xeon 16-core CPU", price: 900, performance: 60 })
      .withRam({ name: "64GB ECC RAM", price: 400, performance: 25 })
      .withStorage({ name: "2TB SSD", price: 250, performance: 15 })
      .withPsu({ name: "850W PSU", price: 150, performance: 0 })
      .build();
  }

  buildOfficePc(): Computer {
    return new ComputerBuilder("Office PC")
      .withCpu({ name: "Core i3 CPU", price: 120, performance: 20 })
      .withRam({ name: "8GB RAM", price: 40, performance: 8 })
      .withStorage({ name: "256GB SSD", price: 40, performance: 10 })
      .build();
  }

  buildGamingPc(): Computer {
    return new ComputerBuilder("Gaming PC")
      .withCpu({ name: "Core i7 CPU", price: 350, performance: 45 })
      .withRam({ name: "16GB RAM", price: 70, performance: 15 })
      .withStorage({ name: "1TB NVMe SSD", price: 90, performance: 20 })
      .withGpu({ name: "RTX 4060 GPU", price: 300, performance: 50 })
      .withPsu({ name: "650W PSU", price: 80, performance: 0 })
      .build();
  }
}
