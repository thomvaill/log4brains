import { NextApiRequest, NextApiResponse } from "next";
import { getLog4brainsInstance, logger } from "../../../lib";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (!req.query.slugAndMore || !Array.isArray(req.query.slugAndMore)) {
    res.status(404).send("Not Found");
    return;
  }
  const uri = [...req.query.slugAndMore];
  const action = uri.pop();
  const slug = uri.join("/");

  if (req.method === "POST" && action === "_open-in-editor") {
    await getLog4brainsInstance().openAdrInEditor(slug, () => {
      logger.warn("We were not able to detect your preferred editor :(");
      logger.warn(
        "You can define it by setting your $VISUAL or $EDITOR environment variable in ~/.zshenv or ~/.bashrc"
      );
    });
    res.status(200).send("");
    return;
  }

  res.status(404).send("Not Found");
};
