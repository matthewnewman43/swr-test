import styles from '../styles/Home.module.css'
import useSwr, {useSWRConfig} from "swr";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";

export async function fetcher(path) {
  const response = await fetch(path);

  let responseData;
  try {
    // IMPORTANT: don't add more logic in this try block.
    // Otherwise legitimate errors can be lost with 4XX responses.
    responseData = (await response.json());
  } catch (e) {
    throw e;
  }

  console.log({responseData});
  return responseData;
}

export default function NewPage() {
  const router = useRouter();
  const {data, mutate} = useSwr(['/api/hello', {test: 'true'}], {test: 'true', fetcher: (path, options) => fetcher(path, options)});

  return (
    <div className={styles.container}>
        {data?.num ?? 'No Data In Cache'}

      <p style={{cursor: 'pointer'}} onClick={async () => {
        await mutate('/api/hello');
      }}>Mutate Same Page</p>
      <p style={{cursor: 'pointer'}} onClick={async () => {
        router.push('/');
      }}>Back to home</p>
    </div>
  )
}
