import { NextApiRequest, NextApiResponse } from "next";
import { getLog4brainsInstance, Search } from "../../lib";
import { toAdr } from "../../types";

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
    .json(
      Search.createFromAdrs(
        (await getLog4brainsInstance().searchAdrs()).map(toAdr)
      ).serializeIndex()
    );
};
