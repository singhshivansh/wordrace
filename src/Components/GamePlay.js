import React, {useState, useEffect} from 'react';
import axios from 'axios';
import $ from 'jquery';
import randomSentence from 'random-sentence';
import Lottie from 'react-lottie';
import loaderJson from '../assets/loader.json';
import errorSound from '../assets/error.wav';
import levelUpAudio from '../assets/level.wav';
import successAudio from '../assets/levelUp.wav';


const GamePlay = () => {

    const [word, setword] = useState('');
    const [answer, setanswer] = useState('');
    const [stackLimit, setstackLimit] = useState(0);
    const [score, setscore] = useState(0);
    const [level, setlevel] = useState(1);
    const [multiplier, setmultiplier] = useState(5);
    const playerName = localStorage.getItem('playerName');
    const [players, setplayers] = useState([]);
    const [loader, setloader] = useState(false);
    const audio = new Audio(errorSound);
    const successSound = new Audio(successAudio);
    const levelUpSound = new Audio(levelUpAudio);

    const [leaderboard, setleaderboard] = useState({
        totalGame : 0,
        highestScore : 0,
        averageScore : 0
    });

    // const [playerName, setplayerName] = useState(localStorage.getItem('playerName'));

    const checkSpelling = (e) => {
        const i = answer.length;
        if(stackLimit <= 0){
            document.getElementById('alert').innerHTML = "EndGame! Please Try Again";
            alert("EndGame! Please Try Again");
            $("#modalBuuton").click();
        }

        if(e.target.value[i] === word[i]){
            setanswer(e.target.value);
            document.getElementById('alert').innerHTML = '';
                if(e.target.value === word){
                    document.getElementById('alert').innerHTML = "Congratulations! You have completed this Level";
                    levelUpSound.play();
                    setanswer('');
                    getWord();
                    setmultiplier(5);
                    setlevel(level+1);
                    setscore(score + (multiplier * level));
                }
                successSound.play();
            return;
        }
        
        document.getElementById('alert').innerHTML = "Please Enter Correctly";
        audio.play();
        if(stackLimit > 0){
            setstackLimit(stackLimit-1);
        }
        if(multiplier > 1){
            setmultiplier(multiplier-1);
        }
        // console.log(stackLimit);
    }

    const getWord = () => {
        const sentence = randomSentence({words : 3});
        setword(sentence.slice(0, sentence.length-1));
        
        setstackLimit(10);
    }

    const resetGame = ()=>{
        setanswer('');
        getWord();
        setmultiplier(5);
        setlevel(1);
        setscore(0);
    }

    const savePlayerInfo = () => {
        setloader(true);
        const data = {
            name : playerName,
            score : score
        }
        axios.post('https://wprdracebackend.herokuapp.com/insert_player/', data).then(res=>{
            alert('Saved Successfully');
            $("#closeModalButton").click();
            getPlayers();
            resetGame();
            setloader(false);
            return;
        }).catch(err=>console.log(err));
    }

    const getPlayers = () => {
        setloader(true);
        axios.get('https://wprdracebackend.herokuapp.com/').then(res=>{
            // console.log(res.data)
            setplayers(res.data.players);
            setleaderboard({
                highestScore : res.data.players[0].score,
                totalGame : res.data.count,
                averageScore : (res.data.sum[0].total)/(res.data.count)
            })
            setloader(false);
          
        }).catch(err=>{
            setloader(false);
            setleaderboard({
                averageScore : 0,
                highestScore : 0,
                totalGame : 0
            });
            console.log(err);
        });

    }

    useEffect(()=>{
        getWord();
        getPlayers();
    }, []);

  return (
      <>
        {
            loader ? 
            <div className='' style={{height : '120vh', display : 'grid', placeContent : 'center', width : '100vw', backgroundColor : 'rgb(255,255,255,0.6)', position : 'fixed', zIndex: '100'}}>
                {/* <iframe src="https://embed.lottiefiles.com/animation/66433"></iframe> */}
                <Lottie 
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: loaderJson,
                        rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice"
                        }
                    }}
                    height={200}
                    width={200}
                />
            </div> : null
        }
        <div className='h-full w-full'>
            <div className='text-3xl mt-3 font-semibold border-x-2 border-green-500 flex justify-center'>
                <div className='border-l-4 border-r-4 rounded-lg border-yellow-500 px-3'>
                    GamePlay <i class="fas fa-gamepad"></i>
                </div>
            </div>
            <div className='flex justify-around'>
                <h3 className='text-xl font-medium'>Player : <span className='text-green-600'>{playerName}</span></h3>
                <div>
                    <button className='px-4 py-1 rounded-lg bg-green-500 text-white' onClick={e=>{window.location.href = '/'}}>New Game</button>
                    <button type="button" class="px-4 ml-2 py-1 rounded-lg bg-gray-400 text-white" data-toggle="modal" data-target="#exampleModalCenter">
                        Instructions
                    </button>
                </div>
            </div>
            <div className='flex justify-center'>
                <h2 className='text-2xl font-medium bg-indigo-500 text-white my-3 px-4 py-2 rounded-xl'>{word}</h2>
            </div>


            <div>
                <input className='border-2 border-green-500 rounded-lg px-3 py-2 col-6' placeholder='Enter the above Sentence here' onChange={checkSpelling} value={answer} />
            </div>
            <div className='text-xl py-3'> Misstype Left :  <span className='text-red-500 font-semibold rounded-xl'>{stackLimit}</span></div>
            <div className='flex justify-center'>
                <div className='flex justify-around col-2'>
                    <button className='px-4 py-1 rounded-lg bg-red-500 text-white' onClick={resetGame}>Reset</button>
                    <button className='px-4 py-1 rounded-lg bg-blue-500 text-white' onClick={savePlayerInfo}>Save</button>
                </div>
            </div>
            <div id="alert" className='py-3'></div>

            <div className='d-flex justify-content-center'>
                <div className='col-10 d-flex justify-content-around'>
                    <div class="col-3 ">
                        <div id="jh-stats-positive" className="flex flex-col justify-center px-4 py-3 bg-white shadow-xl rounded-lg border-r-4 border-l-4 border-gray-400">
                            <div className="">
                                {/* <div><i class="fas fa-2x fa-gamepad"></i></div> */}
                                <p class="text-3xl font-semibold text-center text-gray-800">{score}</p>
                                <p class="text-lg text-center text-gray-500">Score</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-3 ">
                        <div id="jh-stats-positive" className="flex flex-col justify-center px-4 py-3 bg-white shadow-xl rounded-lg border-l-4 border-r-4 border-gray-400">
                            <div className="">
                                {/* <div><i class="fas fa-2x fa-gamepad"></i></div> */}
                                <p class="text-3xl font-semibold text-center text-gray-800">{level}</p>
                                <p class="text-lg text-center text-gray-500">Level</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-3 ">
                        <div id="jh-stats-positive" className="flex flex-col justify-center px-4 py-3 bg-white shadow-xl rounded-lg border-l-4 border-r-4 border-gray-400">
                            <div className="">
                                {/* <div><i class="fas fa-2x fa-gamepad"></i></div> */}
                                <p class="text-3xl font-semibold text-center text-gray-800">{multiplier}x</p>
                                <p class="text-lg text-center text-gray-500">Multiplier</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <hr className='my-3'></hr>

            <div className='mb-5'>
                <div className='text-3xl font-semibold border-x-2 border-green-500 flex justify-center'>
                    <div className='border-l-4 border-r-4 rounded-lg border-yellow-500 px-3'>
                        Game Stats <i class="fa-solid fa-chart-pie"></i>
                    </div>
                </div>

                <div className='lg:flex mx-2 justify-around mt-4'>
                    <div className='col-lg-4 col-sm-10 bg-gray-400 text-white shadow-2xl px-3 py-2 rounded-lg justify-between'>
                        <div className='text-white font-bold text-xl'><i style={{color:'#FFD700'}} class="fa-solid  fa-trophy"></i></div>
                        <table className='table-auto  p-3 col-10'>
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            {
                                players.map(item=>{
                                   return(
                                    <tr>
                                        <td>{item.name}</td>
                                        <td>{item.score}</td>
                                    </tr>
                                   )
                                })
                            }
                        </table>
                    </div>

                    <div className='col-lg-6 col-sm-10 flex px-3 py-2 rounded-lg justify-around'>
                        <div class="w-full sm:w-3/4 px-2 flex-1 my-2 transform transition delay-75 hover:scale-105">
                            <div class="w-full ">
                                <div id="jh-stats-positive" className="flex flex-col justify-center px-4 py-3 bg-white shadow-xl rounded-lg border-l-4 border-blue-500">
                                    <div className="">
                                        <p class="text-3xl font-semibold text-center text-gray-800">{leaderboard.totalGame}</p>
                                        <p class="text-lg text-center text-gray-500">Total Games</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="w-full sm:w-3/4 px-2 flex-1 my-2 transform transition delay-75 hover:scale-105">
                            <div class="w-full ">
                                <div id="jh-stats-positive" className="flex flex-col justify-center px-4 py-3 bg-white shadow-xl rounded-lg border-l-4 border-blue-500">
                                    <div className="">
                                        
                                        <p class="text-3xl font-semibold text-center text-gray-800">{leaderboard.highestScore}</p>
                                        <p class="text-lg text-center text-gray-500">Highest Score</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="w-full sm:w-3/4 px-2 flex-1 my-2 transform transition delay-75 hover:scale-105">
                            <div class="w-full ">
                                <div id="jh-stats-positive" className="flex flex-col justify-center px-4 py-3 bg-white shadow-xl rounded-lg border-l-4 border-blue-500">
                                    <div className="">
                                        
                                        <p class="text-3xl font-semibold text-center text-gray-800">{leaderboard.averageScore.toFixed(2)}</p>
                                        <p class="text-lg text-center text-gray-500">Average Score</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Confirmation</h5>
                    <button type="button" id="closeModalButton" onClick={resetGame} className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    Do you want to Save your Score?
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={resetGame} data-dismiss="modal">No</button>
                    <button type="button" onClick={savePlayerInfo} className="btn btn-primary">Yes</button>
                </div>
                </div>
            </div>
            </div>

            

            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title font-bold text-2xl" id="exampleModalLongTitle">Instructions</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div className='px-3' id='instructionContainer'>
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
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>

            <div class="modal fade" id="successfullModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title font-bold text-2xl" id="exampleModalLongTitle">Instructions</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Saved Successfully !
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>

        </div>
      </>
  )
}

export default GamePlay