import { findRecordByFilter } from "@/lib/airtable";
import { NextApiRequest, NextApiResponse } from "next";

const getCoffeeStoreById = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  try {
    if (id) {
      
      const records = await findRecordByFilter(id);

      if (records.length !== 0) {
        res.json(records);
      } else {
        res.json({ message: `id could not be found` });
      }
    } else {
      res.status(400);
      res.json({ message: "Id is missing" });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: "Something went wrong", error });
  }
};

export default getCoffeeStoreById;