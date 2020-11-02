import gitUrlParse from "git-url-parse";
import parseGitConfig from "parse-git-config";
import path from "path";
import { GitRepositoryConfig, Log4brainsConfig, gitProviders } from "./schema";

type GitRemoteConfig = {
  url: string;
};
function isGitRemoteConfig(remoteConfig: any): remoteConfig is GitRemoteConfig {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return typeof remoteConfig === "object" && remoteConfig.url !== undefined;
}

export function guessGitRepositoryConfig(
  existingConfig: Log4brainsConfig,
  workdir: string
): GitRepositoryConfig | undefined {
  // URL
  let url = existingConfig.project.repository?.url;
  if (!url) {
    // Try to guess from the current Git configuration
    // We use parse-git-config and not SimpleGit because we want this method to remain synchronous
    const gitConfig = parseGitConfig.sync({
      path: path.join(workdir, ".git/config")
    });
    if (isGitRemoteConfig(gitConfig['remote "origin"'])) {
      url = gitConfig['remote "origin"'].url;
    }
  }
  if (!url) {
    return undefined;
  }

  const urlInfo = gitUrlParse(url);
  if (
    !urlInfo.protocol.includes("https") &&
    !urlInfo.protocol.includes("http")
  ) {
    // Probably an SSH URL -> we try to convert it to HTTPS
    url = urlInfo.toString("https");
  }

  url = url.replace(/\/$/, ""); // remove a possible trailing-slash

  // PROVIDER
  let provider = existingConfig.project.repository?.provider;
  if (!provider || !gitProviders.includes(provider)) {
    // Try to guess from the URL
    provider =
      gitProviders.filter((p) => urlInfo.resource.includes(p)).pop() ||
      "generic";
  }

  // PATTERN
  let viewFileUriPattern =
    existingConfig.project.repository?.viewFileUriPattern;
  if (!viewFileUriPattern) {
    switch (provider) {
      case "gitlab":
        viewFileUriPattern = "/-/blob/%branch/%path";
        break;

      case "bitbucket":
        viewFileUriPattern = "/src/%branch/%path";
        break;

      case "github":
      default:
        viewFileUriPattern = "/blob/%branch/%path";
        break;
    }
  }

  return {
    url,
    provider,
    viewFileUriPattern
  };
}
