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

type GitRepositoryConfig = Readonly<{
  provider: "github"; // TODO: add more providers + a generic one
  github?: Readonly<{
    owner: string;
    repo: string;
  }>;
}>;

const gitRepositorySchema = Joi.object({
  provider: Joi.string().valid("github").required(),
  github: Joi.object({
    owner: Joi.string().required(),
    repo: Joi.string().required()
  }).when("provider", {
    is: "github",
    then: Joi.required(),
    otherwise: Joi.forbidden()
  })
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
