import { findRecordByFilter, getMinifiedRecords, table } from "@/lib/airtable";
import { NextApiRequest, NextApiResponse } from "next";

const createCoffeeStore = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const { id, name, adress, locality, rating, image_url } = req.body
        try {
            if (id) {
                const records = await findRecordByFilter(id)

                if (records.length !== 0) {
                    res.json(records)
                } else {
                    // Creat a record
                    if (name) {
                        const createRecords = await table.create([
                            {
                                fields: {
                                    id,
                                    name,
                                    adress,
                                    locality,
                                    rating,
                                    image_url
                                }
                            }
                        ])
                        const records = getMinifiedRecords(createRecords)
                        res.json(records)
                    } else {
                        res.status(400)
                        res.json({ message: "Name is missing" })
                    }

                }
            } else {
                res.status(400)
                res.json({ message: "Id is missing" })
            }

        } catch (error) {
            console.log("Error creating or finding store", error)
            res.status(500)
            res.json({ message: "Error creating or finding store" })
        }
    } else {
        res.json({ message: "method is GET" })
    }
}

export default createCoffeeStore
