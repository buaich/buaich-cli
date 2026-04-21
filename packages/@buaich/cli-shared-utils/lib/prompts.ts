import prompts from "prompts";

/**
 * Prompt for user input and return a typed result.
 * Exits the process if the user cancels.
 * @template Type
 * @param sentences Prompt(s) passed through to the prompts library.
 * @returns Resolved response object.
 */
export async function promptFor<Type extends Record<string, unknown>>(
  sentences: prompts.PromptObject | prompts.PromptObject[],
): Promise<Type> {
  const response = await prompts(sentences, {
    onCancel: () => {
      process.exit(0);
    },
  });

  return response as unknown as Type;
}
