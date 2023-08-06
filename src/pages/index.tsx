import { Inter } from 'next/font/google'
import Card from '@/components/card/card'
import styles from '../styles/home.module.css'
import IcoffeeStores from '../data/coffee-stores.interface'
import { fetchCoffeeStores } from '@/lib/coffee-stores'
import useTrackLocation from '@/hooks/use-track-location'
import { useContext, useEffect, useState } from 'react'
import { ACTION_TYPES, StoreContext } from '@/store/store-context'
import {BasicProps, CoffeeStores} from "@/interfaces/interfaces";

const inter = Inter({ subsets: ['latin'] })

export async function getStaticProps(context: IcoffeeStores) {
  
  let coffeeStores = await fetchCoffeeStores();
  coffeeStores = JSON.parse(JSON.stringify(coffeeStores))
  return {
    props: {
      coffeeStores,
    }
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}

export default function Home(props: BasicProps) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation();


  const handleOnBtnClick = () => {
    handleTrackLocation()
  }


  const [coffeeStoresError, setCoffeeStoresError] = useState<string | null>(null)

  const { dispatch, state } = useContext(StoreContext)
  //@ts-ignore
  const { coffeeStores, latLong, limit } = state

  useEffect(() => {

    if (latLong) {
      const fetchedCoffeeStores = async () => {
        try {
          const response = await fetch(`api/getCoffeeStoresById?latLong=${latLong}&limit=12`);
          const coffeeStores = await response.json()
          // setCoffeeStoresNear(NearcoffeeStores)
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores }
          })
          setCoffeeStoresError("")
        } catch (error) {
          setCoffeeStoresError(getErrorMessage(error))
        }
      }
      fetchedCoffeeStores()
    }
  }, [latLong])
  return (
    <main className={`mainPage ${inter.className}`}>
      <div className={styles.wrapper}>
        <div className={styles.titlePage}>
          <div className={styles.btnWrapp}>
            <h3 className={styles.mainTitle}>Discover Coffee shops and Tea houses near you</h3>
            <button className={styles.findButton} onClick={handleOnBtnClick}>{isFindingLocation ? "Locating..." : "Near me"}</button>
          </div>
          {locationErrorMsg && <p>Something wrong: {locationErrorMsg}</p>}
          {coffeeStoresError && <p>Something wrong: {coffeeStoresError}</p>}
          {coffeeStores.length > 0 && (
            <>
              <div className={styles.elementTitle}>Stores near me</div>
              <div className={styles.cardLayout}>
                {coffeeStores.map((coffeeStore: CoffeeStores) => {

                  return (
                    <Card key={coffeeStore.id} title={coffeeStore.name} imgUrl={coffeeStore.image_url} cardUrl={`/coffee-store/${coffeeStore.id}`}></Card>
                  )
                })}
              </div>
            </>
          )}
          {props.coffeeStores.length > 0 && (
            <>
              <div><h2 className={styles.elementTitle}>Coffee shops and Tea houses</h2></div>
              <div className={styles.cardLayout}>
                {props.coffeeStores.map((coffeeStore: CoffeeStores) => {
                  return (
                    <Card key={coffeeStore.id} title={coffeeStore.name} imgUrl={coffeeStore.image_url} cardUrl={`/coffee-store/${coffeeStore.id}`}></Card>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
