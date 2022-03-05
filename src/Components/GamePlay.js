import React, {useState, useEffect} from 'react';
import axios from 'axios';
import $ from 'jquery';
import randomSentence from 'random-sentence';
import Lottie from 'react-lottie';
import loaderJson from '../assets/loader.json';

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
            resetGame();
        }

        if(e.target.value[i] === word[i]){
            setanswer(e.target.value);
            document.getElementById('alert').innerHTML = '';
                if(e.target.value === word){
                    document.getElementById('alert').innerHTML = "Congratulations! You have completed this Level";
                    setanswer('');
                    getWord();
                    setmultiplier(5);
                    setlevel(level+1);
                    setscore(score + (multiplier * level));
                }
            return;
        }
        
        document.getElementById('alert').innerHTML = "Please Enter Correctly";
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
        setword(sentence);
        
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
        const data = {
            name : playerName,
            score : score
        }
        axios.post('https://wprdracebackend.herokuapp.com/insert_player/', data).then(res=>{
            alert('Saved Successfully');
            $("#closeModalButton").click();
            getPlayers();
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
          
        }).catch(err=>console.log(err));

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
                </div>
            </div>
            <div className='flex justify-center'>
                <h2 className='text-2xl font-medium bg-indigo-500 text-white my-3 px-4 py-2 rounded-xl'>{word}</h2>
            </div>


            <div>
                <input className='border-2 border-green-500 rounded-lg px-3 py-2 col-6' placeholder='Enter the Sentence here' onChange={checkSpelling} value={answer} />
            </div>
            <div className='text-xl py-3'> Misstype Left :  <span className='text-red-500 font-semibold rounded-xl'>{stackLimit}</span></div>
            <div className='flex justify-center'>
                <div className='flex justify-around col-2'>
                    <button className='px-4 py-1 rounded-lg bg-red-500 text-white' onClick={resetGame}>Reset</button>
                    <button className='px-4 py-1 rounded-lg bg-blue-500 text-white'>Save</button>
                </div>
            </div>
            <div id="alert"></div>

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

                    {/* <table className='table'>
                        <tr>
                            <th>Score</th>
                            <th>Level</th>
                            <th>Multiplier</th>
                        </tr>
                        <tr className='mt-2'>
                            <td className='bg-green-500 mt-2 py-2 ' >{score}</td>
                            <td>{level}</td>
                            <td>{multiplier}</td>
                        </tr>
                    </table> */}
                </div>
            </div>

            <hr className='my-3'></hr>

            <div>
                <div className='text-3xl font-semibold border-x-2 border-green-500 flex justify-center'>
                    <div className='border-l-4 border-r-4 rounded-lg border-yellow-500 px-3'>
                        Game Stats <i class="fa-solid fa-chart-pie"></i>
                    </div>
                </div>

                <div className='flex justify-around mt-4'>
                    <div className='col-4 bg-yellow-600 px-3 py-2 rounded-lg justify-between'>
                        <div className='text-white font-bold text-xl'><i style={{color:'#FFD700'}} class="fa-solid  fa-trophy"></i></div>
                        <table className='table-auto p-3 col-10'>
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

                    <div className='col-6 flex px-3 py-2 rounded-lg justify-between'>
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
                                        
                                        <p class="text-3xl font-semibold text-center text-gray-800">{leaderboard.averageScore}</p>
                                        <p class="text-lg text-center text-gray-500">Average Score</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <button type="button" className="d-none btn btn-primary" data-toggle="modal" id="modalBuuton" data-target="#exampleModal">
            Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Confirmation</h5>
                    <button type="button" id="closeModalButton" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    Do you want to Save your Score?
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
                    <button type="button" onClick={savePlayerInfo} className="btn btn-primary">Yes</button>
                </div>
                </div>
            </div>
            </div>

        </div>
      </>
  )
}

export default GamePlay