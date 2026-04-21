import pkg from "../package.json";
import { Command } from "commander";
import { create } from "@buaich/cli-service";

const program = new Command();
program.version(`@buaich/cli ${pkg.version}`); //cli version info

// create
program
  .command("create")
  .argument("[app-name]")
  .option("-t, --template <template>", "app's building template")
  .option("-f, --force", "enforce covering existed dir")
  .option("-o, --deps <deps...>", "other dependencies to install")
  .option("--odd <deps...>", "alias of --deps")
  .option("-s, --skip", "skip over installing dependencies")
  .action(async (appName, options) => {
    const { deps, odd, otherDependenciesDeclare, ...rest } = options;
    await create({
      appName,
      options: {
        ...rest,
        deps: deps ?? odd ?? otherDependenciesDeclare,
      },
    });
  });

program.parse();
