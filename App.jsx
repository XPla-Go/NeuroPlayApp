/*If you want to check the effectiveness of the program without the NeuroPlay equipment,
then replace the code from lines 36 to 54 with the attached ones and compile the jsx file
by going to cmd in the project folder and insert
"npx babel --watch App.jsx --out-dir . --presets react-app / prod"
after installing babel in the npm modules.

    const [concentrationValue, setConcentrationValue] = useState(0)
    const [connectionInd, setConnectionInd] = useState(true)
    const [isGameRun, setGameRun] = useState(false)

    //setting the interval for receiving data
    useEffect(() => {
        let id = setInterval(() => {
            setConcentrationValue(concentrationValue + 1 < 100 ? concentrationValue + 1 : 100)
        }, 100)
        return () => clearInterval(id) //don't forget to clear interval
    })
*/


//connecting to NeuroPlay
const neuroplay = new NeuroplayConnector();
neuroplay.connect();

//simplification
const useState = React.useState;
const useEffect = React.useEffect;

function App() {  //main component
    //initializes states
    const [languageInd, setLanguageInd] = useState("en") //ability to change the language
    const [isMeditationShow, setMeditationVis] = useState(false) //index of meditation data visible
    const [isConcentrationShow, setConcentrationVis] = useState(false) //index of concentration data visible
    const [meditationValue, setMeditationValue] = useState(null) //meditation data
    const [concentrationValue, setConcentrationValue] = useState(null) //concentration data
    const [connectionInd, setConnectionInd] = useState(false)
    const [isGameRun, setGameRun] = useState(false)

    //setting the interval for receiving data
    neuroplay.on('bci', (data) => {
        if (data && data.result === true) {
            if (!connectionInd) setConnectionInd(true)
            setMeditationValue(data["meditation"])
            setConcentrationValue(data["concentration"])
        } else {
            if (connectionInd) setConnectionInd(false)
            setConcentrationValue(null)
            setMeditationValue(null)
        }
    });
    useEffect(() => {
        let id = setInterval(() => neuroplay.send('bci'), 100) //update the data every 100ms
        return () => clearInterval(id) //don't forget to clear interval
    })

    return (
            <div className="mainWrapper">
                <div className="wall"
                     style={{filter: `brightness(${isGameRun ? concentrationValue / 100 : 0.7})`}}> </div>
                <StartUpScreen languageInd={languageInd} isGameRun={isGameRun} setGameRun={setGameRun}/>
                <Settings setLanguageInd={setLanguageInd} languageInd={languageInd} isMeditationShow={isMeditationShow}
                          setMeditationVis={setMeditationVis} isConcentrationShow={isConcentrationShow}
                          setConcentrationVis={setConcentrationVis}/>
                <Information languageInd={languageInd}/>
                <MedConStateVisualisation languageInd={languageInd} isMeditationShow={isMeditationShow}
                                          isConcentrationShow={isConcentrationShow} meditationValue={meditationValue}
                                          concentrationValue={concentrationValue} connectionInd={connectionInd}/>
                <GamePanel isGameRun={isGameRun} concentrationValue={concentrationValue} connectionInd={connectionInd}/>
            </div>
    )
}

function StartUpScreen(props) {
    return (
        <section id="startScreenSection" style={{transform: props.isGameRun ? "translateY(100vh)" : "translateY(0)"}}>
            <h2>{props.languageInd === "ru" ? "Начать" : "Run"}</h2>
            <button onClick={() => props.setGameRun(true)}><img src="img/play-button.png" alt=">"/></button>
        </section>
    )
}

function Settings(props) {
    const [isSettingsOpen, setStateSettingsOpen] = useState(false);
    return (
        <div className="settingsBox" onMouseLeave={() => setStateSettingsOpen(false)}>
            <button
                style={{transform: isSettingsOpen ? "rotate(-90deg)" : "rotate(0)"}}
                className="openButton"
                onClick={() => setStateSettingsOpen(!isSettingsOpen)}>
                <img src="img/settings.png" alt=""/>
            </button>
            <ul style={{transform: isSettingsOpen ? "translateX(0)" : "translateX(calc(-100% - 20px)"}}>
                <li>
                    <button onClick={() => props.setLanguageInd(props.languageInd === "en" ? "ru" : "en")}>
                        {props.languageInd === "ru" ? "Русский" : "English"}
                    </button>
                </li>
                <li>
                    <button onClick={() => props.setMeditationVis(!props.isMeditationShow)}>
                        {props.languageInd === "ru" ? "Медитация" : "Meditation"}: {props.isMeditationShow ? "ON" : "OFF"}
                    </button>
                </li>
                <li>
                    <button onClick={() => props.setConcentrationVis(!props.isConcentrationShow)}>
                        {props.languageInd === "ru" ? "Концентрация" : "Concentration"} : {props.isConcentrationShow ? "ON" : "OFF"}
                    </button>
                </li>
            </ul>
        </div>
    )
}

function Information(props) {
    const [isInformationOpen, setStateInformationOpen] = useState(false)
    return (
        <div className="informationBox" onMouseLeave={() => setStateInformationOpen(false)}>
            <button
                className="openButton"
                onClick={() => setStateInformationOpen(!isInformationOpen)}>
                <img src="./img/information.png" alt="i"/>
            </button>
            <p
                style={{transform: isInformationOpen ? "translateX(0)" : "translateX(calc(100% + 20px)"}}>
                {props.languageInd === "ru" ? "Заставьте лампочку светиться ярче, повысив концентрацию, но учтите, что мухи при этом будут летать быстрее." : "Make the bulb glow brighter for more concentration, but keep in mind that the flies will fly faster."}
                <span>{props.languageInd === "ru" ? "Версия: 1.0.2" : "Version: 1.0.2"}</span>
            </p>
        </div>
    )
}

function MedConStateVisualisation(props) {
    return (
        <div className="medConBox">
            {props.isMeditationShow ? <p>{props.languageInd === "ru" ? "Медитация" : "Meditation"}: {
                props.connectionInd ? `${props.meditationValue}%`: "NONE"}</p> : false}
            {props.isConcentrationShow ? <p>{props.languageInd === "ru" ? "Концентрация" : "Concentration"}: {
                props.connectionInd ? `${props.concentrationValue}%` : "NONE"}</p> : false}
        </div>
    )
}

function GamePanel(props) {
    return (
        <section className="gamePanel"  style={{transform: props.isGameRun ? "translateY(0)" : "translateY(-100vh)"}}>
            <LampBox concentrationValue={props.concentrationValue} connectionInd={props.connectionInd}
                     isGameRun={props.isGameRun}/>
            <FirstFly concentrationValue={props.concentrationValue}/>
            <SecondFly concentrationValue={props.concentrationValue}/>
        </section>
    )
}

function LampBox(props) {
    return (
        <div className="lamp">
            <div className="lampGlassCircle" style={{
            borderColor: props.connectionInd && ((props.concentrationValue / 100) > 0.1) ? `rgba(255, 255, 255, ${props.concentrationValue / 100})` : "rgba(255, 255, 255, 0.1)"}}>
                <div className="stand-wires"  style={{background: props.connectionInd ? `rgba(${props.concentrationValue * 2 > 50 ? props.concentrationValue * 2 : 50}, ${props.concentrationValue * 2 > 50 ? props.concentrationValue * 2 : 50}, ${props.concentrationValue * 2 > 50 ? props.concentrationValue * 2 : 50}, 1)` : "#000"}}> </div>
                <div className="wires-box" style={{borderColor: props.connectionInd ? `rgba(${props.concentrationValue * 2.55 > 50 ? props.concentrationValue * 2.55 : 50}, ${props.concentrationValue * 2.55 > 50 ? props.concentrationValue * 2.55 : 50}, 0, 1)` : "#000"}}>
                    <svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 39.47 200.15" stroke={props.connectionInd ? `rgba(${props.concentrationValue * 2.55 > 50 ? props.concentrationValue * 2.55 : 50}, ${props.concentrationValue * 2 > 50 ? props.concentrationValue * 2.55 : 50}, 0, 1)` : "#00"}>
                        <path className="cls-1"
                              d="M633.5,330.5c-3.16,13.41-.86,21.76,2,27,4.7,8.6,11.43,9.78,13,18,1.6,8.38-4.78,10.42-4,20,.89,10.95,9.59,12.73,9,22-.49,7.75-6.67,8.08-8,17-1.42,9.53,5.25,11.77,4,21-1.33,9.85-9.37,10.6-10,20-.59,8.68,6.12,10.26,5,18-1.2,8.31-9.37,9.58-13,20a28.42,28.42,0,0,0-1,14"
                              transform="translate(-622.05 -328.66)"/>
                    </svg>
                    <svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 39.47 200.15" stroke={props.connectionInd ? `rgba(${props.concentrationValue * 2.55 > 50 ? props.concentrationValue * 2.55 : 50}, ${props.concentrationValue * 2 > 50 ? props.concentrationValue * 2.55 : 50}, 0, 1)` : "#00"}>
                        <path className="cls-1"
                              d="M633.5,330.5c-3.16,13.41-.86,21.76,2,27,4.7,8.6,11.43,9.78,13,18,1.6,8.38-4.78,10.42-4,20,.89,10.95,9.59,12.73,9,22-.49,7.75-6.67,8.08-8,17-1.42,9.53,5.25,11.77,4,21-1.33,9.85-9.37,10.6-10,20-.59,8.68,6.12,10.26,5,18-1.2,8.31-9.37,9.58-13,20a28.42,28.42,0,0,0-1,14"
                              transform="translate(-622.05 -328.66)"/>
                    </svg>
                </div>
                <div className="glow-wires" style={{background: props.connectionInd ? `rgba(${props.concentrationValue * 2.55 > 50 ? props.concentrationValue * 2.55 : 50}, ${props.concentrationValue * 1.7 > 50 ? props.concentrationValue * 1.7 : 50}, 50, ${props.concentrationValue * 1.7 > 50 ? 1 : 0})` : "#000"}}> </div>
            </div>
            <div className="lampGlassCircleBack" style={{filter: `brightness(${props.isGameRun ? props.concentrationValue / 100 : 0.7})`, transition: props.isGameRun ? "0" : "1s"}}> </div>
            <div className="lampRectangle" style={{borderColor: props.connectionInd ? `rgb(${props.concentrationValue * 2.25 + 30}, ${props.concentrationValue * 2.25 + 30}, ${props.concentrationValue * 2.25 + 30})` : "rgb(50, 50, 50)"}}>
            </div>
            <div className="lampRectangleBack" style={{filter: `brightness(${props.isGameRun ? props.concentrationValue / 100 : 0.7})`, transition: props.isGameRun ? "0" : "1s"}}> </div>
            <div className="lampWire" style={{background: props.connectionInd ? `rgb(${props.concentrationValue * 2.25 + 30}, ${props.concentrationValue * 2.25 + 30}, ${props.concentrationValue * 2.25 + 30})` : "rgb(50, 50, 50)"}}> </div>
        </div>
    )
}

function FirstFly(props) {
    return (
        <div className="fly firstFly"
             style={{filter: `brightness(${props.concentrationValue / 100})`,
                 animation: `${(2 + (100 - props.concentrationValue) / 100).toFixed(4)}s first-fly linear infinite`}}>
            <div className="wings">
                <img src="img/wing.svg" alt=""/>
                <img src="img/wing.svg" alt=""/>
            </div>
        </div>
    )
}

function SecondFly(props) {
    return (
        <div className="fly secondFly"
             style={{filter: `brightness(${props.concentrationValue / 100})`,
                 animation: `${(2 + (100 - props.concentrationValue) / 100).toFixed(4)}s second-fly linear 0.7s infinite`}}>
            <div className="wings">
                <img src="img/wing.svg" alt=""/>
                <img src="img/wing.svg" alt=""/>
            </div>
        </div>
    )
}

ReactDOM.render(<App/>, document.getElementById('root'));