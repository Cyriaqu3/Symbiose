require('package-script').spawn([
      {
          command: "npm",
          args: ["install", "-g", "bower"]
      },
      {
          command: "npm",
          args: ["install", "-g", "gulp"]
      },
      {
          command: "npm",
          args: ["install", "-g", "electron"]
      },
      {
          command: "gulp",
          args: ["prepare-dev-env"]
      }
  ]);
