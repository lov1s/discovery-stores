import { table, findRecordByFilter, getMinifiedRecords } from "@/lib/airtable";
import { NextApiRequest, NextApiResponse } from "next";

const favouriteCoffeeStore = async(req: NextApiRequest, res:NextApiResponse) => {
    if (req.method === "PUT") {
        try {
            const { id } = req.body

            if (id) {
                const records = await findRecordByFilter(id)

                if (records.length !== 0) {
                    const record = records[0]
                    const calculateVoting = parseInt(record.recordId) + 1 // record.rating
              
                    const updateRecord = await table.update([
                        {
                            id: record.recordId,
                            fields: {
                                rating: calculateVoting
                            }
                        }
                    ])
                    if(updateRecord){
                        const minifiedRecords = getMinifiedRecords(updateRecord)
                        res.json(minifiedRecords)
                    }
                    
                } else {
                    res.json({ message: `id could be found` })
                }
            } else {
                res.status(400)
                res.json({ message: "Id is missing" })
            }

        } catch (err) {
            res.status(500)
            console.log({ message: "Error upvoting ", err })
        }

    }

}

export default favouriteCoffeeStore