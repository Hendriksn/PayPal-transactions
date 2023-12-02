import type { AppProps } from 'next/app'
// Added custom scss stylesheet
import '../styles/style.scss'

/**
 * NextJS default
 * 
 * @param param0 
 * @returns 
 */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
