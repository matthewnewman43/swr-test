import '../styles/globals.css'
import {SWRConfig} from "swr";

function MyApp({ Component, pageProps }) {
  return <SWRConfig>
    <Component {...pageProps} />
  </SWRConfig>
}

export default MyApp
