var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*If you want to check the effectiveness of the program without the NeuroPlay equipment,
then replace the code from lines 36 to 54 with the attached ones and compile the jsx file
by going to cmd in the project folder and insert
"npx babel --watch App.jsx --out-dir. - -presets react-app / prod"
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
var neuroplay = new NeuroplayConnector();
neuroplay.connect();

//simplification
var useState = React.useState;
var useEffect = React.useEffect;

function App() {
    //main component
    var _useState = useState("en"),
        _useState2 = _slicedToArray(_useState, 2),
        languageInd = _useState2[0],
        setLanguageInd = _useState2[1]; //ability to change the language


    var _useState3 = useState(false),
        _useState4 = _slicedToArray(_useState3, 2),
        isMeditationShow = _useState4[0],
        setMeditationVis = _useState4[1]; //index of meditation data visible


    var _useState5 = useState(false),
        _useState6 = _slicedToArray(_useState5, 2),
        isConcentrationShow = _useState6[0],
        setConcentrationVis = _useState6[1]; //index of concentration data visible


    var _useState7 = useState(null),
        _useState8 = _slicedToArray(_useState7, 2),
        meditationValue = _useState8[0],
        setMeditationValue = _useState8[1]; //meditation data


    var _useState9 = useState(null),
        _useState10 = _slicedToArray(_useState9, 2),
        concentrationValue = _useState10[0],
        setConcentrationValue = _useState10[1]; //concentration data


    var _useState11 = useState(false),
        _useState12 = _slicedToArray(_useState11, 2),
        connectionInd = _useState12[0],
        setConnectionInd = _useState12[1];

    var _useState13 = useState(false),
        _useState14 = _slicedToArray(_useState13, 2),
        isGameRun = _useState14[0],
        setGameRun = _useState14[1];

    //setting the interval for receiving data


    neuroplay.on('bci', function (data) {
        if (data && data.result === true) {
            if (!connectionInd) setConnectionInd(true);
            setMeditationValue(data["meditation"]);
            setConcentrationValue(data["concentration"]);
        } else {
            if (connectionInd) setConnectionInd(false);
            setConcentrationValue(null);
            setMeditationValue(null);
        }
    });
    useEffect(function () {
        var id = setInterval(function () {
            return neuroplay.send('bci');
        }, 100); //update the data every 100ms
        return function () {
            return clearInterval(id);
        }; //don't forget to clear interval
    });

    return React.createElement(
        "div",
        { className: "mainWrapper" },
        React.createElement(
            "div",
            { className: "wall",
                style: { filter: "brightness(" + (isGameRun ? concentrationValue / 100 : 0.7) + ")" } },
            " "
        ),
        React.createElement(StartUpScreen, { languageInd: languageInd, isGameRun: isGameRun, setGameRun: setGameRun }),
        React.createElement(Settings, { setLanguageInd: setLanguageInd, languageInd: languageInd, isMeditationShow: isMeditationShow,
            setMeditationVis: setMeditationVis, isConcentrationShow: isConcentrationShow,
            setConcentrationVis: setConcentrationVis }),
        React.createElement(Information, { languageInd: languageInd }),
        React.createElement(MedConStateVisualisation, { languageInd: languageInd, isMeditationShow: isMeditationShow,
            isConcentrationShow: isConcentrationShow, meditationValue: meditationValue,
            concentrationValue: concentrationValue, connectionInd: connectionInd }),
        React.createElement(GamePanel, { isGameRun: isGameRun, concentrationValue: concentrationValue, connectionInd: connectionInd })
    );
}

function StartUpScreen(props) {
    return React.createElement(
        "section",
        { id: "startScreenSection", style: { transform: props.isGameRun ? "translateY(100vh)" : "translateY(0)" } },
        React.createElement(
            "h2",
            null,
            props.languageInd === "ru" ? "Начать" : "Run"
        ),
        React.createElement(
            "button",
            { onClick: function onClick() {
                    return props.setGameRun(true);
                } },
            React.createElement("img", { src: "img/play-button.png", alt: ">" })
        )
    );
}

function Settings(props) {
    var _useState15 = useState(false),
        _useState16 = _slicedToArray(_useState15, 2),
        isSettingsOpen = _useState16[0],
        setStateSettingsOpen = _useState16[1];

    return React.createElement(
        "div",
        { className: "settingsBox", onMouseLeave: function onMouseLeave() {
                return setStateSettingsOpen(false);
            } },
        React.createElement(
            "button",
            {
                style: { transform: isSettingsOpen ? "rotate(-90deg)" : "rotate(0)" },
                className: "openButton",
                onClick: function onClick() {
                    return setStateSettingsOpen(!isSettingsOpen);
                } },
            React.createElement("img", { src: "img/settings.png", alt: "" })
        ),
        React.createElement(
            "ul",
            { style: { transform: isSettingsOpen ? "translateX(0)" : "translateX(calc(-100% - 20px)" } },
            React.createElement(
                "li",
                null,
                React.createElement(
                    "button",
                    { onClick: function onClick() {
                            return props.setLanguageInd(props.languageInd === "en" ? "ru" : "en");
                        } },
                    props.languageInd === "ru" ? "Русский" : "English"
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "button",
                    { onClick: function onClick() {
                            return props.setMeditationVis(!props.isMeditationShow);
                        } },
                    props.languageInd === "ru" ? "Медитация" : "Meditation",
                    ": ",
                    props.isMeditationShow ? "ON" : "OFF"
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "button",
                    { onClick: function onClick() {
                            return props.setConcentrationVis(!props.isConcentrationShow);
                        } },
                    props.languageInd === "ru" ? "Концентрация" : "Concentration",
                    " : ",
                    props.isConcentrationShow ? "ON" : "OFF"
                )
            )
        )
    );
}

function Information(props) {
    var _useState17 = useState(false),
        _useState18 = _slicedToArray(_useState17, 2),
        isInformationOpen = _useState18[0],
        setStateInformationOpen = _useState18[1];

    return React.createElement(
        "div",
        { className: "informationBox", onMouseLeave: function onMouseLeave() {
                return setStateInformationOpen(false);
            } },
        React.createElement(
            "button",
            {
                className: "openButton",
                onClick: function onClick() {
                    return setStateInformationOpen(!isInformationOpen);
                } },
            React.createElement("img", { src: "./img/information.png", alt: "i" })
        ),
        React.createElement(
            "p",
            {
                style: { transform: isInformationOpen ? "translateX(0)" : "translateX(calc(100% + 20px)" } },
            props.languageInd === "ru" ? "Заставьте лампочку светиться ярче, повысив концентрацию, но учтите, что мухи при этом будут летать быстрее." : "Make the bulb glow brighter for more concentration, but keep in mind that the flies will fly faster.",
            React.createElement(
                "span",
                null,
                props.languageInd === "ru" ? "Версия: 1.0.2" : "Version: 1.0.2"
            )
        )
    );
}

function MedConStateVisualisation(props) {
    return React.createElement(
        "div",
        { className: "medConBox" },
        props.isMeditationShow ? React.createElement(
            "p",
            null,
            props.languageInd === "ru" ? "Медитация" : "Meditation",
            ": ",
            props.connectionInd ? props.meditationValue + "%" : "NONE"
        ) : false,
        props.isConcentrationShow ? React.createElement(
            "p",
            null,
            props.languageInd === "ru" ? "Концентрация" : "Concentration",
            ": ",
            props.connectionInd ? props.concentrationValue + "%" : "NONE"
        ) : false
    );
}

function GamePanel(props) {
    return React.createElement(
        "section",
        { className: "gamePanel", style: { transform: props.isGameRun ? "translateY(0)" : "translateY(-100vh)" } },
        React.createElement(LampBox, { concentrationValue: props.concentrationValue, connectionInd: props.connectionInd,
            isGameRun: props.isGameRun }),
        React.createElement(FirstFly, { concentrationValue: props.concentrationValue }),
        React.createElement(SecondFly, { concentrationValue: props.concentrationValue })
    );
}

function LampBox(props) {
    return React.createElement(
        "div",
        { className: "lamp" },
        React.createElement(
            "div",
            { className: "lampGlassCircle", style: {
                    borderColor: props.connectionInd && props.concentrationValue / 100 > 0.1 ? "rgba(255, 255, 255, " + props.concentrationValue / 100 + ")" : "rgba(255, 255, 255, 0.1)" } },
            React.createElement(
                "div",
                { className: "stand-wires", style: { background: props.connectionInd ? "rgba(" + (props.concentrationValue * 2 > 50 ? props.concentrationValue * 2 : 50) + ", " + (props.concentrationValue * 2 > 50 ? props.concentrationValue * 2 : 50) + ", " + (props.concentrationValue * 2 > 50 ? props.concentrationValue * 2 : 50) + ", 1)" : "#000" } },
                " "
            ),
            React.createElement(
                "div",
                { className: "wires-box", style: { borderColor: props.connectionInd ? "rgba(" + (props.concentrationValue * 2.55 > 50 ? props.concentrationValue * 2.55 : 50) + ", " + (props.concentrationValue * 2.55 > 50 ? props.concentrationValue * 2.55 : 50) + ", 0, 1)" : "#000" } },
                React.createElement(
                    "svg",
                    { id: "\u0421\u043B\u043E\u0439_1", "data-name": "\u0421\u043B\u043E\u0439 1", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 39.47 200.15", stroke: props.connectionInd ? "rgba(" + (props.concentrationValue * 2.55 > 50 ? props.concentrationValue * 2.55 : 50) + ", " + (props.concentrationValue * 2 > 50 ? props.concentrationValue * 2.55 : 50) + ", 0, 1)" : "#00" },
                    React.createElement("path", { className: "cls-1",
                        d: "M633.5,330.5c-3.16,13.41-.86,21.76,2,27,4.7,8.6,11.43,9.78,13,18,1.6,8.38-4.78,10.42-4,20,.89,10.95,9.59,12.73,9,22-.49,7.75-6.67,8.08-8,17-1.42,9.53,5.25,11.77,4,21-1.33,9.85-9.37,10.6-10,20-.59,8.68,6.12,10.26,5,18-1.2,8.31-9.37,9.58-13,20a28.42,28.42,0,0,0-1,14",
                        transform: "translate(-622.05 -328.66)" })
                ),
                React.createElement(
                    "svg",
                    { id: "\u0421\u043B\u043E\u0439_1", "data-name": "\u0421\u043B\u043E\u0439 1", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 39.47 200.15", stroke: props.connectionInd ? "rgba(" + (props.concentrationValue * 2.55 > 50 ? props.concentrationValue * 2.55 : 50) + ", " + (props.concentrationValue * 2 > 50 ? props.concentrationValue * 2.55 : 50) + ", 0, 1)" : "#00" },
                    React.createElement("path", { className: "cls-1",
                        d: "M633.5,330.5c-3.16,13.41-.86,21.76,2,27,4.7,8.6,11.43,9.78,13,18,1.6,8.38-4.78,10.42-4,20,.89,10.95,9.59,12.73,9,22-.49,7.75-6.67,8.08-8,17-1.42,9.53,5.25,11.77,4,21-1.33,9.85-9.37,10.6-10,20-.59,8.68,6.12,10.26,5,18-1.2,8.31-9.37,9.58-13,20a28.42,28.42,0,0,0-1,14",
                        transform: "translate(-622.05 -328.66)" })
                )
            ),
            React.createElement(
                "div",
                { className: "glow-wires", style: { background: props.connectionInd ? "rgba(" + (props.concentrationValue * 2.55 > 50 ? props.concentrationValue * 2.55 : 50) + ", " + (props.concentrationValue * 1.7 > 50 ? props.concentrationValue * 1.7 : 50) + ", 50, " + (props.concentrationValue * 1.7 > 50 ? 1 : 0) + ")" : "#000" } },
                " "
            )
        ),
        React.createElement(
            "div",
            { className: "lampGlassCircleBack", style: { filter: "brightness(" + (props.isGameRun ? props.concentrationValue / 100 : 0.7) + ")", transition: props.isGameRun ? "0" : "1s" } },
            " "
        ),
        React.createElement("div", { className: "lampRectangle", style: { borderColor: props.connectionInd ? "rgb(" + (props.concentrationValue * 2.25 + 30) + ", " + (props.concentrationValue * 2.25 + 30) + ", " + (props.concentrationValue * 2.25 + 30) + ")" : "rgb(50, 50, 50)" } }),
        React.createElement(
            "div",
            { className: "lampRectangleBack", style: { filter: "brightness(" + (props.isGameRun ? props.concentrationValue / 100 : 0.7) + ")", transition: props.isGameRun ? "0" : "1s" } },
            " "
        ),
        React.createElement(
            "div",
            { className: "lampWire", style: { background: props.connectionInd ? "rgb(" + (props.concentrationValue * 2.25 + 30) + ", " + (props.concentrationValue * 2.25 + 30) + ", " + (props.concentrationValue * 2.25 + 30) + ")" : "rgb(50, 50, 50)" } },
            " "
        )
    );
}

function FirstFly(props) {
    return React.createElement(
        "div",
        { className: "fly firstFly",
            style: { filter: "brightness(" + props.concentrationValue / 100 + ")",
                animation: (2 + (100 - props.concentrationValue) / 100).toFixed(4) + "s first-fly linear infinite" } },
        React.createElement(
            "div",
            { className: "wings" },
            React.createElement("img", { src: "img/wing.svg", alt: "" }),
            React.createElement("img", { src: "img/wing.svg", alt: "" })
        )
    );
}

function SecondFly(props) {
    return React.createElement(
        "div",
        { className: "fly secondFly",
            style: { filter: "brightness(" + props.concentrationValue / 100 + ")",
                animation: (2 + (100 - props.concentrationValue) / 100).toFixed(4) + "s second-fly linear 0.7s infinite" } },
        React.createElement(
            "div",
            { className: "wings" },
            React.createElement("img", { src: "img/wing.svg", alt: "" }),
            React.createElement("img", { src: "img/wing.svg", alt: "" })
        )
    );
}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));