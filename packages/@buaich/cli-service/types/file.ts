export enum Template {
  Vue = "vue-webpack5",
  React = "react-vite",
}
export const DEFAULT_TEMPLATE: Template = Template.Vue;
export const SUPPORTED_TEMPLATES: readonly Template[] = [
  Template.React,
  Template.Vue,
];

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
