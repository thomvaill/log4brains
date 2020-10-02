import Joi from "joi";

type AdrFolderConfig = {
  name?: string;
  path: string;
  tags?: string[];
};

const adrFolderSchema = Joi.object({
  name: Joi.string().hostname(),
  path: Joi.string().required(),
  tags: Joi.array().items(Joi.string())
});

export type Log4brainsConfig = {
  project: {
    name: string;
  };
  adrFolders: AdrFolderConfig[];
  repository?: {
    provider: string;
    github?: {
      owner: string;
      repo: string;
    };
  };
};

export const schema = Joi.object({
  project: Joi.object({
    name: Joi.string().hostname().required()
  }).required(),
  adrFolders: Joi.array().items(adrFolderSchema).min(1).required(),
  repository: Joi.object({
    provider: Joi.string().valid("github").required(),
    github: Joi.object({
      owner: Joi.string().required(),
      repo: Joi.string().required()
    }).when("provider", {
      is: "github",
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
  })
});
