import '../styles/dyl.css'
import { ChakraProvider } from '@chakra-ui/react'
import Navbar from '../component/navbar'
import Account from '../component/account'
import checkToken from '../functions/checkToken'
import { useState, useEffect } from 'react'
import Loading from '../component/loading'
import {useRouter} from 'next/router'
import Router from 'next/router'
function MyApp({ Component, pageProps })
{
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  useEffect(() =>
  {

      setToken(sessionStorage.getItem('token'))
    
  }, [pageProps])


  useEffect(() =>
  {
    const start = () =>
    {
      setIsLoading(true)
    }
    const end = () =>
    {
      setIsLoading(false)
    }
    Router.events.on("routeChangeStart", start)
    Router.events.on("routeChangeComplete", end)
    Router.events.on("routeChangeError", end)
    return () =>
    {
      Router.events.off("routeChangeStart", start)
      Router.events.off("routeChangeComplete", end)
      Router.events.off("routeChangeError", end)
    }
  }, [])


  return (
    <ChakraProvider>
      <Loading isLoading={isLoading} />
      {(token !== null) ?
        <>
          <Navbar />
          <Account />
        </>
        :
        null
      }
      <Component {...pageProps} />

    </ChakraProvider>)
}

export default MyApp
