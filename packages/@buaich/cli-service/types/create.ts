export type CreateOptions = {
  template?: string;
  force?: boolean;
  deps?: string[];
  skip?: boolean;
};

export type CreateInfo = {
  appName: string;
  options: CreateOptions;
};
