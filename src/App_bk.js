import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function Main(props) {
  return (
    <div>
      <h1>메인이다!</h1>
      <div>슬라이더~~
        <Product num={props.num}></Product>
      </div>
    </div>
  )
}

function Product(props) {
  return (
    <div>
      제품 목록~~~~
      <Board num={props.num}></Board>
    </div>
  )
}

function Board(props) {
  return (
    <div>
      숫자: {props.num}<br />
      게시판 목록~~~~~~
      {/* App 컴포넌트의 title 출력 */}
    </div>
  )
}

function Main2(props) {
  return (
    <div> 
      <h1>서브 메인이다!</h1>
      <div>슬라이더~~22
        <Product2 onAddNum={()=>{props.onAddNum()}}></Product2>
      </div>
    </div>
  )
}

function Product2(props) {
  return (
    <div>
      제품 목록~~~~2222
      <Board2 onAddNum={()=>{props.onAddNum()}}></Board2>
    </div>
  )
}

function Board2(props) {
  return (
    <div>
      숫자: <button onClick={()=>{
        props.onAddNum();
      }}>증가!</button> <br />
      게시판 목록~~~~~~222222
    </div>
  )
}

function App() {
  let [num, setNum] = useState(1);
  return (
    <>
      <Main num={num}></Main>
      <Main2 onAddNum={()=>{
        setNum(num + 1);
      }}></Main2>
    </>
  );
}

export default App;
