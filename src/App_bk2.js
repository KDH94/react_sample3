import logo from './logo.svg';
import './App.css';
import { legacy_createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

function Main() {
  return (
    <div>
      <h1>메인이다!</h1>
      <div>슬라이더~~
        <Product></Product>
      </div>
    </div>
  )
}

function Product() {
  return (
    <div>
      제품 목록~~~~
      <Board></Board>
    </div>
  )
}

function Board() {
  let num = useSelector((state)=>{return state.num;});
  //let num2 = store.getState().num; 이건 렌더링이 안 됨.
  return (
    <div>
      숫자: {num}<br />
      게시판 목록~~~~~~
    </div>
  )
}

function Main2() {
  return (
    <div> 
      <h1>서브 메인이다!</h1>
      <div>슬라이더~~22
        <Product2></Product2>
      </div>
    </div>
  )
}

function Product2() {
  let subFn = useDispatch();
  return (
    <div>
      숫자: <button onClick={()=>{
        subFn({type: "sub"});
      }}>감소!</button><br />
      제품 목록~~~~2222
      <Board2></Board2>
    </div>
  )
}

function Board2() {
  let addFn = useDispatch();
  return (
    <div>
      숫자: <button onClick={()=>{
        addFn({type: "add"});
      }}>증가!</button> <br />
      게시판 목록~~~~~~222222
    </div>
  )
}
function reducer(state, action) {
  console.log("action=>", action);
  if(state === undefined) {
    return {num: 1}
  }
  let newState = {...state};
  if(action.type == "add") {
    newState.num += 1;
  } else if(action.type == "sub") {
    newState.num -= 1;
  }
  return newState;
}

const store = legacy_createStore(reducer);

function App() {
  //let hong = {name: "홍길동", adrr: {post: 1234, area: "인천"}, age: 20};
  //let copyHong = _.cloneDeep(hong);

  return (
    <>
      <Provider store={store}>
        <Main></Main>
        <Main2></Main2>
      </Provider>
    </>
  );
}

export default App;
