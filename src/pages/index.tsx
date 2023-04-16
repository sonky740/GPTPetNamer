import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { getErrorMessage } from '@/utils/error';

export default function Home() {
  const [count, setCount] = useState(0);
  const [animal, setAnimal] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimal(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (count === 10) {
        return console.log('You have reached the limit of 10 animals');
      }

      const response = await axios.post('/api/generate', { animal });

      if (response.status !== 200) {
        throw response.data || new Error('Something went wrong');
      }
      setCount(count + 1);
      setAnimal('');
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error));
    }
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="GPT PET NAMER" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>GPT_PET_NAMER</h1>
        {count > 0 && <p>You&apos;ve used this app {count} times</p>}
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animal}
            onChange={onChange}
          />
          <button type="submit">Submit</button>
        </form>
      </main>
    </>
  );
}
