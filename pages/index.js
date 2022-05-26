import styles from '../styles/Home.module.css'
import useSwr, {useSWRConfig} from "swr";
import {useRouter} from "next/router";

export async function fetcher(path, options) {
  const response = await fetch(path);

  console.log({options});

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

const useApiMutate = (path) => {
    const { mutate, cache } = useSWRConfig();

    return async (options) => {
        const cacheKeys = cache.keys();

        const keys = [];
        for (const key of cacheKeys) {
            if (!key.includes('$swr$') && new RegExp(path).test(key)) {
                console.log('mutating key', key);

                keys.push(key);
            }
        }

        if (!options) {
            return Promise.all(keys.map(key => mutate(key)));
        }

        return Promise.all(keys.map(key => mutate(key, options)));
    }
}

export default function Home() {
  const router = useRouter();
  const {data} = useSwr(['/api/hello', {test: 'true'}], {test: 'true', fetcher: (path, options) => fetcher(path, options)});
  const { cache, mutate: globalMutate } = useSWRConfig();

  const customMutate = useApiMutate('/api/hello');

  console.log({cache});

  return (
    <div className={styles.container}>
      {data?.num ?? 'No Data In Cache'}

      <h2>Mutates</h2>
      <p style={{cursor: 'pointer'}} onClick={async () => {
          customMutate();
      }}>(Custom) Mutate Same Page</p>
      <p style={{cursor: 'pointer'}} onClick={async () => {
          globalMutate('/api/hello');
      }}>(Global without hook) Mutate same page just using endpoint (mutate('/api/hello'))... this doesn't work </p>

      <h2>Routing</h2>
      <p style={{cursor: 'pointer'}} onClick={async () => {
          await customMutate();
          router.push('/newPage');
      }}>Mutate first (await) then route</p>
      <p style={{cursor: 'pointer'}} onClick={async () => {
          customMutate();
          router.push('/newPage');
      }}>Mutate and route in parallel</p>
      <p style={{cursor: 'pointer'}} onClick={async () => {
          router.push('/newPage');
      }}>route without mutate</p>
      <p style={{cursor: 'pointer'}} onClick={async () => {
          customMutate({num: 'optimistic data'});
          router.push('/newPage');
      }}>route with optimistic update mutate</p>
    </div>
  )
}
