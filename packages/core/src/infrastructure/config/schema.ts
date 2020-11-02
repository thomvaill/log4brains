import Joi from "joi";

type ProjectPackageConfig = Readonly<{
  name: string;
  path: string;
  adrFolder: string;
}>;

const projectPackageSchema = Joi.object({
  name: Joi.string().hostname().required(),
  path: Joi.string().required(),
  adrFolder: Joi.string().required()
});

export const gitProviders = [
  "github",
  "gitlab",
  "bitbucket",
  "generic"
] as const;
export type GitProvider = typeof gitProviders[number];

// Optional values are automatically guessed at configuration build time
export type GitRepositoryConfig = Readonly<{
  url?: string;
  provider?: GitProvider;
  viewFileUriPattern?: string;
}>;

const gitRepositorySchema = Joi.object({
  url: Joi.string().uri(), // Guessed from the current Git configuration if omitted
  provider: Joi.string().valid(...gitProviders), // Guessed from url if omitted (useful for enterprise plans with custom domains)
  viewFileUriPattern: Joi.string() // Useful for unsupported providers. Example for GitHub: /blob/%branch/%path
});

type ProjectConfig = Readonly<{
  name: string;
  adrFolder: string;
  packages?: ProjectPackageConfig[];
  repository?: GitRepositoryConfig;
}>;

const projectSchema = Joi.object({
  name: Joi.string().hostname().required(),
  adrFolder: Joi.string().required(),
  packages: Joi.array().items(projectPackageSchema),
  repository: gitRepositorySchema
});

export type Log4brainsConfig = Readonly<{
  project: ProjectConfig;
}>;

export const schema = Joi.object({
  project: projectSchema.required()
});
