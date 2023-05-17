import { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { getErrorMessage } from '@/utils/error';
import AppLoading from '@/components/AppLoading';

export default function VariableName() {
  const [count, setCount] = useState(0);
  const [variables, setVariables] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariables(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (count === 10) {
        return console.log('입력 한도 10개에 도달했습니다.');
      }

      const response = await axios.post('/api/variableName', { variables });

      if (response.status !== 200) {
        throw response.data || new Error('Something went wrong');
      }

      const lines = response.data.result.trim().split('\n');
      const names = lines.map((line: string) => line.split('. ')[1]);

      setResult(names);
      setCount(count + 1);
      setQuestion(variables);
      setVariables('');
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error));
    }
  };

  return (
    <>
      {isLoading && <AppLoading />}
      <Main>
        <Heading1>GPT3.5: 변수명 추천</Heading1>
        {count > 0 && <p>이 앱을 {count}번 사용하였습니다.</p>}
        <Form onSubmit={onSubmit}>
          <Input
            type="text"
            name="variables"
            placeholder="원하는 변수명을 간단히 설명해 주세요."
            value={variables}
            onChange={onChange}
          />
          <SubmitBtn type="submit">변수명 생성</SubmitBtn>
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
