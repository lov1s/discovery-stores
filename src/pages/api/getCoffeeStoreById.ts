import { findRecordByFilter } from "@/lib/airtable";
import { NextApiRequest, NextApiResponse } from "next";

const getCoffeeStoreById = async (req: NextApiRequest, res: NextApiResponse) => {
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  try {
    if (!id) {
      res.status(400).json({ message: "Id is missing" });
      return;
    }

    const records = await findRecordByFilter(id);

    if (records.length === 0) {
      res.status(404).json({ message: `No coffee store found with the provided id` });
      return;
    }

    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching coffee store:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default getCoffeeStoreById;