import { fetchCoffeeStores } from "@/lib/coffee-stores"

const getCoffeeStoresById = async (req, res) => {
    try{
        const{latLong, limit} = req.query
        const response = await fetchCoffeeStores(latLong, limit)
        res.status(200)
        res.json(response)
    } catch(error){
        console.log("There is an error", error)
        res.status(500)
        res.json({message: "Something went wrong", error})
    }
}

export default getCoffeeStoresById