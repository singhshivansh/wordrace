import React, {useState, useEffect} from 'react';
import { createBrowserHistory } from 'history';
import $ from 'jquery';
// import {browser}
import { Link } from 'react-router-dom';

const HomePage = () => {
    const history = createBrowserHistory();
    const [name, setname] = useState('');
    const [instructionButton, setinstructionButton] = useState(false);
    const submitButtonFn = () => {
        if(name.length  === 0){
            alert('Please Enter a Name');
            return;
        }
        localStorage.setItem('playerName', name);
        window.location.href = '/game'
    }

    const toggleInstructionButton = () =>{
        if(instructionButton){
            // $("#instructionContainer").removeClass('d-none');
            $("#instructionContainer").show(500);
            setinstructionButton(false);
        }else{
            // $("#instructionContainer").addClass('d-none');
            $("#instructionContainer").hide(500);

            setinstructionButton(true);
        }

        // $("#instructionContainer").toggleClass('d-none');
        // if($("#instructionContainer").hasClass('d-none')){
        //     setinstructionButton(false);
        // }else{
        //     setinstructionButton(true);
        // }
    }

    useEffect(()=>{
        toggleInstructionButton();
    }, []);

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

        <div>
            <div className='text-3xl font-bold flex justify-between'>
                Instructions
                <button onClick={toggleInstructionButton}>{instructionButton ? <i class="fas fa-plus"></i> : <i class="fas fa-minus"></i>}</button>    
            </div>
            <div className='' id='instructionContainer'>
                <div  className='text-xl font-semibold text-start'>How to play the game? </div>
                <ul className='list-disc text-start'>
                    <li>Register your name to get into the game.</li>
                    <li>See the displayed words carefully </li>
                    <li>Type in the words without getting mistakes.</li>
                </ul>

                <div className='text-xl font-semibold mt-3 text-start'>How the game plays?</div>
                <ul className='list-disc text-start'>
                    <li>The scores are directly proportional to the level of the gamer.
                        (e.g - For Level 4 Resultant Score = (4 * Multiplier))
                    </li>
                    <li>you can only miss type 10 times</li>
                    <li>the no. of times you miss type, the multiplier will decrease accordingly. </li>
                    <li>total score at one level will be the the score*multiplier</li>
                    <li>The overall score will be the addition of all the scores at each level.</li>
                </ul>
            </div>
        </div>

    </div>
  )
}
;
export default HomePage;