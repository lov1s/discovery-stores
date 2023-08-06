import { fetchCoffeeStores } from "@/lib/coffee-stores"
import { NextApiRequest, NextApiResponse } from "next";

const getCoffeeStoresById = async (req: NextApiRequest, res: NextApiResponse) => {
    try{
        const{latLong, limit} = req.query
        const response = await fetchCoffeeStores(latLong as string, Number(limit))
        res.status(200)
        res.json(response)
    } catch(error){
        console.log("There is an error", error)
        res.status(500)
        res.json({message: "Something went wrong", error})
    }
}

export default getCoffeeStoresById