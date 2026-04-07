export async function registerCreateCommand(program) {
  program
    .command("create")
    .argument("<project-name>")
    .action(async (projectName) => {
      console.log(`Creating a new Bloom project: ${projectName}`);
    });
}
