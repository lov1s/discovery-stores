import Link from "next/link"
import { useRouter } from "next/router"
import Head from "next/head"
import Image from 'next/image'
import style from './coffeeStore.module.css'
import { fetchCoffeeStores } from "@/lib/coffee-stores"
import { useContext, useEffect, useState } from "react"
import { StoreContext } from "@/store/store-context"
import { isEmpty } from "@/utils"
import useSWR from "swr"
import {CoffeeStore, StaticProps} from "@/interfaces/interfaces";
import BackIcon from "@/assets/arrow_back.svg";


export async function getStaticPaths() {
    const coffeeStores = await fetchCoffeeStores();
    const paths = coffeeStores.map((coffeeStore: CoffeeStore) => {
        return {
            params: { id: coffeeStore.id.toString() }
        }
    }
    )
    return {
        paths,
        fallback: true
    }
}
export async function getStaticProps(staticProps: StaticProps) {
    const params = staticProps.params
    const coffeeStores = await fetchCoffeeStores();
    const findCoffeStoreId = coffeeStores.find((coffeeStore: CoffeeStore) => {
        return coffeeStore.id.toString() === params.id
    })
    return {
        props: {
            coffeeStore: findCoffeStoreId ? findCoffeStoreId : {}
        }
    }
}
const CoffeeStore = (initialProps: { coffeeStore?: CoffeeStore }) => {

    const router = useRouter()
    const id = router.query.id

    const [coffeeStore, setCoffeeStore] = useState<CoffeeStore | undefined>(initialProps.coffeeStore);

    const {
        state: { coffeeStores },
    } = useContext(StoreContext)

    const handleCreateCoffeeStore = async (coffeeStore: CoffeeStore) => {
        try {
            const {
                id,
                name,
                adress,
                locality,
                rating,
                image_url
            } = coffeeStore
            const response = await fetch("/api/createCoffeeStore", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    name,
                    adress,
                    locality,
                    rating: 0,
                    image_url
                })
            })
            const dbCoffeeStore = await response.json()
        } catch (err) {
            console.log("Err creating coffee stor", err)
        }
    }
    useEffect(() => {
        if (isEmpty(initialProps.coffeeStore!)) {
            if (coffeeStores.length > 0) {
                const coffeStoreFromContext = coffeeStores.find((coffeeStore: CoffeeStore) => {
                    return coffeeStore.id.toString() === id
                })
                if (coffeStoreFromContext) {
                    setCoffeeStore(coffeStoreFromContext)
                    handleCreateCoffeeStore(coffeStoreFromContext)
                }

            }
        } else {
            //SSG
            handleCreateCoffeeStore(initialProps.coffeeStore!);
        }
    }, [id, initialProps, initialProps.coffeeStore])

    const [votingCount, setVoitingCount] = useState(0)

    // Check type (...args)
    const fetcher = (...args: [string]) => {
        fetch(...args).then(res => res.json())
    }
    // Check data and fetcher types !!!
    const { data, error } = useSWR<any>(`/api/getCoffeeStoreById?id=${id}`, fetcher)
    useEffect(() => {
        if (data && data.length > 0) {
            setCoffeeStore(data[0])

            setVoitingCount(data[0].rating)
        }
    }, [data])

    const handleUpvoteButton = async () => {

        try {
            const response = await fetch("/api/favouriteCoffeeStore", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                })
            })
            const dbCoffeeStore = await response.json()
            if (dbCoffeeStore && dbCoffeeStore.length > 0) {
                let count = votingCount + 1
                setVoitingCount(count)
            }

        } catch (err) {
            console.log("Err upvoting", err)
        }

    }

    if (error) {
        console.log("Err from SWR ", error)
        return <div>Something went wrong</div>
    }

    if (router.isFallback) {
        return <div>Loading...</div>
    }

    const { name, locality, adress, rating, image_url } = coffeeStore || {};
    // {name: string, city: string, adress:string, rating: number, image_ur: string}
    return (
        <>
            <Head><title>{name}</title></Head>
            <div className={style.layout}>
                <div className={style.item_content}>
                    <Link className={style.back_link} href="/"><Image className={style.back_link__icon} src={BackIcon} width={18} height={18} alt={"iconBack"}/>Back</Link>
                    <h1 className={style.item_title}>{name}</h1>
                    <Image className={style.item_image} src={image_url || "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTIzNjF8MHwxfHNlYXJjaHwzfHx0ZWElMjBob3VzZXxlbnwwfDB8fHwxNjg1MDgyOTU4fDA&ixlib=rb-4.0.3&q=80&w=1080"} 
                    alt="Coffee Store" width={500} height={300} />
                </div>
                <div className={style.item_interaction}>
                    <p className={style.address}>{adress}</p>
                    <p className={style.neighbourhood}>{locality}</p>
                    <p className={style.rating}>{votingCount}</p>
                    <button onClick={handleUpvoteButton} className={style.voteBtn}>Up vote</button>
                </div>
            </div>
        </>
    )
}

export default CoffeeStore