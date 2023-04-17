import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styled from 'styled-components';
import { getErrorMessage } from '@/utils/error';

export default function Home() {
  const [count, setCount] = useState(0);
  const [animal, setAnimal] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<string[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimal(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (count === 10) {
        return console.log('You have reached the limit of 10 animals');
      }

      const response = await axios.post('/api/petName', { animal });

      if (response.status !== 200) {
        throw response.data || new Error('Something went wrong');
      }

      const lines = response.data.result.trim().split('\n');
      const names = lines.map((line: string) => line.split('. ')[1]);

      setResult(names);
      setCount(count + 1);
      setQuestion(animal);
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
      <Main>
        <Heading1>GPT_PET_NAMER</Heading1>
        {count > 0 && <p>You&apos;ve used this app {count} times</p>}
        <Form onSubmit={onSubmit}>
          <Input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animal}
            onChange={onChange}
          />
          <SubmitBtn type="submit">Generate names</SubmitBtn>
        </Form>
        <ResultWrap>
          <Question>{question}</Question>
          <Result>
            {result.map((str, index) => {
              return <li key={index}>{str}</li>;
            })}
          </Result>
        </ResultWrap>
      </Main>
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding-top: 10rem;
  background: rgb(9, 121, 98);
  background: linear-gradient(
    151deg,
    rgba(9, 121, 98, 1) 32%,
    rgba(9, 121, 88, 1) 46%,
    rgba(9, 121, 26, 1) 78%
  );
`;

const Heading1 = styled.h1`
  font-size: 3.2rem;
  line-height: 4rem;
  font-weight: bold;
  color: #202123;
  margin: 1.6rem 0 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 32rem;
`;

const Input = styled.input`
  margin-top: 1rem;
  padding: 1.2rem 1.6rem;
  background: #fff;
  border: 1px solid #10a37f;
  border-radius: 0.4rem;
  margin-bottom: 2.4rem;
  outline-color: #10a37f;

  &::placeholder {
    color: #8e8ea0;
    opacity: 1;
  }
`;

const SubmitBtn = styled.button`
  padding: 1.2rem 0;
  color: #fff;
  background-color: #10a37f;
  border: none;
  border-radius: 0.4rem;
  text-align: center;
  cursor: pointer;
`;

const ResultWrap = styled.article`
  margin-top: 2rem;
`;

const Question = styled.h2`
  margin-bottom: 1rem;
  font-size: 2.4rem;
  color: #202123;
  text-align: center;
`;

const Result = styled.ul`
  counter-reset: item;
  font-weight: bold;

  li {
    position: relative;
    font-size: 1.6rem;

    + li {
      margin-top: 0.8rem;
    }

    &:before {
      content: counter(item) '. ';
      counter-increment: item;
    }
  }
`;
