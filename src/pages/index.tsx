import Image from 'next/image'
import { Inter } from 'next/font/google'
import Card from '@/components/card/card'
import cardImage from '../components/card/coffeeshop.jpg'
import styles from '../styles/home.module.css'
import coffeeStoresData from '../data/coffee-stores.json'
import IcoffeeStores from '../data/coffee-stores.interface'
import { fetchCoffeeStores } from '@/lib/coffee-stores'
import useTrackLocation from '@/hooks/use-track-location'
import { useContext, useEffect, useState } from 'react'
import { ACTION_TYPES, StoreContext } from '@/store/store-context'

const inter = Inter({ subsets: ['latin'] })

export async function getStaticProps(context: IcoffeeStores) {

  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores,
    }
  }
}


export default function Home(props: IcoffeeStores) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation();
  

  const handleOnBtnClick = () => {
    handleTrackLocation()
  }

  
  const [coffeeStoresError, setcoffeeStoresError] = useState(null)

  const {dispatch, state} = useContext(StoreContext)
  const {coffeeStores, latLong, limit} = state

  useEffect( () => {
    
    if(latLong){
      const fetchedCoffeeStores = async () =>{
        try{
          const response = await fetch(`api/getCoffeeStoresById?latLong=${latLong}&limit=12`);
          const coffeeStores = await response.json()
          // setCoffeeStoresNear(NearcoffeeStores)
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {coffeeStores}
        })
        setcoffeeStoresError("")
        } catch (error) {
          setcoffeeStoresError(error.message)
        }
      }
      fetchedCoffeeStores()
    }
  }, [latLong])
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <button onClick={handleOnBtnClick}>{isFindingLocation ? "Locating..." : "Near me"}</button>
      {locationErrorMsg && <p>Something wrong: {locationErrorMsg}</p>}
      {coffeeStoresError && <p>Something wrong: {coffeeStoresError}</p>}
      {coffeeStores.length > 0 && (
        <>
          <div>Stores near me</div>
          <div className={styles.cardLayout}>
            {coffeeStores.map((coffeeStore) => {
              return (
                <Card key={coffeeStore.id} title={coffeeStore.name} imgUrl={coffeeStore.image_url} cardUrl={`/coffee-store/${coffeeStore.id}`}></Card>
              )
            })}
          </div>
        </>
      )}
      {props.coffeeStores.length > 0 && (
        <>
          <div>Coffee shops</div>
          <div className={styles.cardLayout}>
            {props.coffeeStores.map((coffeeStore: IcoffeeStores) => {
              return (
                <Card key={coffeeStore.id} title={coffeeStore.name} imgUrl={coffeeStore.image_url} cardUrl={`/coffee-store/${coffeeStore.id}`}></Card>
              )
            })}
          </div>
        </>
      )}

    </main>
  )
}
