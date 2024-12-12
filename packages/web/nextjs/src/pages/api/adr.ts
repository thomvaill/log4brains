import { NextApiRequest, NextApiResponse } from "next";
import { getLog4brainsInstance } from "../../lib/core-api";
import { toAdrLight } from "../../lib-shared/types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== "GET") {
    res.status(404).send("Not Found");
    return;
  }

  res
    .status(200)
    .json((await getLog4brainsInstance().searchAdrs()).map(toAdrLight));
};
