import React, {useState} from 'react';
import { createBrowserHistory } from 'history';
// import {browser}
import { Link } from 'react-router-dom';

const HomePage = () => {
    const history = createBrowserHistory();
    const [name, setname] = useState('');
    const submitButtonFn = () => {
        if(name.length  === 0){
            alert('Please Enter a Name');
            return;
        }
        localStorage.setItem('playerName', name);
        window.location.href = '/game'
    }

  return (
    <div className='' style={{height : '80vh', display : 'grid', 'placeContent' : 'center'}}>
        <h1 className='text-4xl font-bold'>Welcome to Word Race</h1>
        <div className='py-2'>
            <h3 className='text-2xl py-3'>Please Enter Your Name</h3>
            <input placeholder='Enter your Name' onChange={e=>setname(e.target.value)} value={name} className='form-control' />
            <button className='my-2 py-2 px-3 rounded-lg text-white bg-green-500' onClick={submitButtonFn}>
                Submit
                {/* <Link to='/game'  style={{textDecoration : 'none'}} > Button </Link> */}
            </button>
        </div>

    </div>
  )
}
;
export default HomePage;