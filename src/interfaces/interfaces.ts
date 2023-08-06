export interface BasicProps{
    coffeeStores: []
}
export interface  StaticProps{
    params: {id: string}
}
export interface BasicStore{
    coffeeStore?: []
}
export interface CoffeeStore extends BasicStore{
    id: number,
    name: string,
    adress: string,
    neighbourhood?: string,
    image_url: string,
    rating?: number,
    locality?: string
}

export interface CoffeeStores extends BasicProps{
    id: number,
    name: string,
    image_url: string,
    address: string,
    city: string
}

export interface DestructorStore{
    name?: string,
    city?:string,
    adress?:string,
    rating?: number,
    image_url?: string
}