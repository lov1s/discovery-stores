import { createApi } from 'unsplash-js';
import { photos } from 'unsplash-js/dist/internals';

interface Iresult {
  fsq_id: string,
  name: string,
  location: {
    address: string,
    locality: string,
  },
  image_url?: string
}
interface Ioptions{
  method: string,
  headers: {}
}
interface IunsplashResults{
  urls: {
    regular: string
  }
}
interface UnsplashPhoto {
  urls: {
    regular: string;
  };
}

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || "",
});


const getUrlForCoffeeStores = (query: string, latlong: string, limit: number) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latlong}&limit=${limit}`
}

const getListCoffeeStorePhotos = async (): Promise<string[]> => {
  const photos = await unsplash.search.getPhotos({
    query: "tea house",
    page: 1,
    perPage: 12,
    orientation: "landscape",
  })
  const unsplashResults: UnsplashPhoto[] = photos.response!.results;
  return unsplashResults.map(result => result.urls["regular"])
}

export const fetchCoffeeStores = async (latLong: string = "52.36729181680107%2C4.8893467290634325", limit: number = 12) => {
  const options:Ioptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FRSQ_API_KEY,
    },
  };
  
  const response = await fetch(getUrlForCoffeeStores("coffee", latLong, limit), options);
  const data = await response.json();

  const photos = await getListCoffeeStorePhotos()


  return data.results.map((result: Iresult, idx: number) => {
    return {
      id: result.fsq_id,
      name: result.name,
      adress: result.location.address,
      city: result.location.locality,
      image_url: photos.length > 0 ? photos[idx] : null,
    }
  });

}