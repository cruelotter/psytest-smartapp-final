import {TaskList} from '../pages/TaskList';
import getScene, { API_URL } from '../services/APIHelper.js'
import React, { useEffect, useState } from 'react';

import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";

import { darkSber } from '@sberdevices/plasma-tokens/themes';
import { Button } from '@sberdevices/ui/components/Button/Button';
import { Container, Row, Col } from '@sberdevices/plasma-ui/components/Grid';
import { Image } from '@sberdevices/ui/components/Image/Image';
import { Spinner } from '@sberdevices/plasma-ui/components/Spinner'
import { Headline1 } from '@sberdevices/plasma-ui';

import Indicators from './indicators'
import './scene.css';
import './centerButtons.css'
import './centerText.css'
import './centerPic.css'
import './sthg.css'
import './startText.css'
import './marginIndicators.css'
import './buttonText.css'
import './lastBut.css'
import './centerSpinner.css'
import { createMethodSignature } from 'typescript';

const YOUDIED = 99999;
const YOUWIN = 100000;

let characterID;

let firstRepeat = false;

let lives = 3;
let mana = 50;
let glory = 50;

let counter = 0;
let currentId = 0;
let pictures = [];

let nodesArr;
let curNodes;

const setBackground = {
  backgroundImage: ''
}

const initializeAssistant = (getState/*: any*/) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};


const fetchedData = async (id) => {
  return await getScene(id);
}

export class Scene extends React.Component {
  constructor(props) {
    super(props);
    console.log('constructor');

    //this.value = 0;

    this.state = {
      notes: [],
      scene:           null,
      backgroundImage: { background: '' }
    };

    this.assistant = initializeAssistant(() => this.getStateForAssistant() );
    this.assistant.on("data", (event/*: any*/) => {
      switch (event.type) {
        case 'character':
          characterID = event.character.id;
          this.setState({scene: this.state.scene, character: characterID});
          console.log("CHARACTER= ", characterID);
        // case 'action':
        //   console.log(`assistant.on(data)`, event);
        //   const { action } = event
        //   this.dispatchAssistantAction(action);
      }
      console.log(`assistant.on(data)`, event);
      const { action } = event
      this.dispatchAssistantAction(action);
    });
    this.assistant.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    });

  }

  async componentDidMount() {
    console.log('componentDidMount');
    const response = await getScene(currentId);
    console.log(response);
    const { data } = response;

    if (data.nodesArr) {
      nodesArr = data.nodesArr.slice(0, data.nodesArr.length);
      console.log('nodesArr', nodesArr);
      curNodes = nodesArr.slice(0, nodesArr.length);
    }

    this.setState({ scene: data , character : characterID});
    this.read();
  }

  getStateForAssistant () {
    console.log('getStateForAssistant: this.state:', this.state);

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    }
    
    // const rand =  Math.floor(Math.random() * this.state.scene.options.length);
    // const rand = this.state.scene.options.length == 1 ? 0 :  Math.floor(Math.random() * this.state.scene.options.length);

    const state = {
      item_selector: {
        items: { 
          text : this.state.scene.text, 
          texts : this.state.scene.texts,
          texta : this.state.scene.texta,
          textj : this.state.scene.textj,
          // userSuggest: this.state.scene.options[rand].text[0]
          userSuggest: this.state.scene.options[getRandomInt(0, this.state.scene.options.length)].text[0]
         }
      }
    };

    console.log('getStateForAssistant: state:', state)
    return state;
  }

  dispatchAssistantAction (action) {
    console.log('dispatchAssistantAction', action);
    if (action) {
      switch (action.type) {
        case 'add_note':
          console.log('add_note', action, 'action.choice = ', action.choice);
          return this.add_note(action);

        
        case 'read':
          return this.read();

        case 'newScene':
          return this.newScene();

        /*
        case 'delete_note':
          return this.delete_note(action);
        default:
          throw new Error();
        */
      }
    }
  }

  exit () {
    this.assistant.close();
  }

  read () {
    this.assistant.sendData( { action : { action_id : 'read' } } );
  }

  newScene () {
    this.assistant.sendData( { action : { action_id : 'newScene' } } );
  }

  sendException() {
    this.assistant.sendData( { action : { action_id : 'noMatch' } } );
  }

  add_note (action) {
    let choice = action.choice;
    let isChanged = false;

    choice = choice.toLowerCase();
    
    console.log(choice);

    // if (this.state.scene.options[1]) {
    //   if (this.state.scene.options[1].text.find((element) => {if (element == 'выйти') return true;}) && this.state.scene.options[1].text.find((element) => {if (element == choice.toLowerCase()) return true;})) {
    //     this.exit();
    //   }
    // }

    if (this.state.scene.options[1]) {
      if (this.state.scene.options[1].text.includes('выйти') && this.state.scene.options[1].text.includes(choice.toLowerCase())) {
        console.log("EXIT")
        this.exit();
      }
      // console.log("FINDING A WAY OUT ", this.state.scene.options[1].text.includes('выйти'));
      // console.log("THE CHOICE ", choice);
      // console.log("PROBABLY ANOTHER WAY ", this.state.scene.options[1].text.includes(choice.toLowerCase()));
    }

    if (choice == 'один' || choice == 'первый' || choice == 'первое' || choice == 'первую') {
      choice = 1;
    }
    if (action.choice == 'два' || choice == 'второй'|| choice == 'второе' || choice == 'вторую') {
      choice = 2;
    }
    if (action.choice == 'три' || choice == 'третий'|| choice == 'третье' || choice == 'третью') {
      choice = 3;
    }
    if (action.choice == 'четыре' || choice == 'четвертый'|| choice == 'четвертое' || choice == 'четвертую') {
      choice = 4;
    }

    this.state.scene.options.forEach((arr, index) => {

      if (index + 1 === choice) {
        this.moveTo(arr.id);
        isChanged = true;
      }

      console.log('ARR = ' + arr.text);

      arr.text.forEach((item) => {
        console.log("item = ", item)
        if (item.toLowerCase() === choice) {
          this.moveTo(arr.id);
          isChanged = true;
        }
      })
    })

    if (!isChanged) {
      this.sendException();
    }
    //return this.state;
  }

  /*add_note (action) {
    console.log('add_note', action);
    this.setState({
      notes: [
        ...this.state.notes,
        {
          id:        Math.random().toString(36).substring(7),
          title:     action.note,
          completed: false,
        },
      ],
    })
  }*/

  setBackgrounds (curImg) {
    pictures.push(curImg);
    //debugger;
    let string = ``;
    pictures.reverse();
    pictures.forEach((pic, index) => {
      string = string + `url(${API_URL}/${pic}.png) center no-repeat`;
      if (index < pictures.length - 1){
        string = string + ',';
      }
    });
    //setBackgroundImage({background : string});
    this.setState({ backgroundImage: {background : string}, character: characterID})
    pictures.reverse();
  }
  
  moveTo(nextId) {
    //fetchedData(nextId)
    counter++;

    if ((lives <= 0 || mana <= 0 || glory <= 0) && this.state.scene.id != YOUDIED ) {
      nextId = YOUDIED;
    }

    if ((lives > 0 && (mana >= 200 || glory >= 200)) && this.state.scene.id != YOUWIN ) {
      nextId = YOUWIN;
    }

    console.log('NEXT IS ', nextId);
    console.log('ARRAY = ', curNodes);

    if (!nextId) {

      if (curNodes.length == 0) {
        console.log('NODES ARR = ', nodesArr);
        if (!firstRepeat) {
          nextId = 12321;
          firstRepeat = true;

          console.log('REPEAT POINT NODES ARR' ,nodesArr);
          curNodes = nodesArr.slice(0, nodesArr.length);
          console.log('REPEAT POINT CUR NODS' ,curNodes);
        }
        else{
          console.log('REPEAT POINT NODES ARR' ,nodesArr);
          curNodes = nodesArr.slice(0, nodesArr.length);
          console.log('REPEAT POINT CUR NODS' ,curNodes);
          
          nextId = Math.floor(Math.random() * curNodes.length);
          let tmp = nextId;
          nextId = curNodes[nextId];
          curNodes.splice(tmp, 1);
          console.log('NEXT ID = ', nextId);
        }
      }
      else {
        nextId = Math.floor(Math.random() * curNodes.length);
        let tmp = nextId;
        nextId = curNodes[nextId];
        curNodes.splice(tmp, 1);
        console.log(curNodes);
      }
    }

    if ((nextId == 1) && this.state.scene.id > 1) {
      setBackground.backgroundImage = '';
      curNodes = nodesArr.slice(0, nodesArr.length);
      counter = 1;
      lives = 3;
      mana = 50;
      glory = 50; 
    }

    getScene(nextId)
      .then((response) => {
        const { data } = response;
        //setScene(data);
        if (data.bonus) {
          lives += data.bonus.lives;
          mana += data.bonus.mana;
          glory += data.bonus.glory;
        }

        this.setState({ scene: data , character : characterID});
        this.newScene();
        // this.read();
        // counter++;
        console.log('COUNTER = ', counter);

        if (counter > 0 && data.img) {
          this.setBackgrounds(data.img);
        } 
      });
  }

  neededText(scene) {
    if (scene.text) {
      return scene.text;
    }
    if (characterID === 'joy'){
      return scene.textj;
    }
    if (characterID === 'eva'){
      return scene.texta;
    }
    return scene.texts;
  }

  render() {

    /*
    const [scene, setScene] = useState(null);
    const [scene, setScene] = useState(null);

    const [backgroundImage, setBackgroundImage] = useState({background : ''});

    const fetchedData = async (id) => {
       return await getScene(id);
    }
    
    useEffect(() => {
       fetchedData(currentId).then((response) => {
           console.log(response);
           const { data } = response;
           setScene(data);
       })
    }, []);
    */
    
    const { scene, backgroundImage } = this.state;
    console.log("SCENE ", scene);
    if (scene) {
      if (scene.options) {

        if (counter == 0) {
          return (
            < >
              <Col type="calc" offsetS={1} offsetM={2} offsetL={3} offsetXL={4} sizeS={1} sizeM={2} sizeL={3} sizeXL={4} />
              <h1 className='textWrapper'> { this.neededText(scene) } </h1>
              {
                scene.options.map((item) => {
                  return (
                    <Row>
                      <Button scaleOnInteraction = {false} scaleOnHover = {false} scaleOnPress = {false} style={{ marginBottom: '5rem', width: '100%' }} stretch={true} size="l" onClick={ () => this.add_note({choice: item.text[0]}) }>
                      <div className='butTextWrapper'> {item.text[0]} </div>
                      </Button>
                    </Row>
                  );
                })
              }
            </>
          );
        }

        if (counter < 7) {
          return(
                <Row className='rowWrapper'>
                  <Col sizeS={4} sizeM={3} sizeL={4} sizeXL={6} className='centerPic'>
                    <div style={backgroundImage} className = 'img-Wrapper'>
                    </div>
                   
                  </Col>
                  <Col className = 'centerBut' type="rel" offsetS={0} offsetM={0} offsetL={1} offsetXL={0} sizeS={4} sizeM={3} sizeL={3} sizeXL={6}>
                    <h1 className='centerText'> { this.neededText(scene) } </h1>
                    {
                      scene.options.map((item) => {
                        return (
                          <Row>
                            <Button key={item.id} scaleOnInteraction = {false} scaleOnHover = {false} scaleOnPress = {false} style={{ marginBottom: '12px', width: '100%' }} stretch={true} size="s" onClick={ () => this.add_note({choice: item.text[0]}) }>
                            <div className='butTextWrapper'> {item.text[0]} </div>
                            </Button>
                          </Row>
                        );
                      })
                    }
                  </Col>
            </Row>
          );
        }

        return(
          <>
              <Row className='rowWrapper'>
                <Col sizeS={4} sizeM={3} sizeL={4} sizeXL={6} className='centerPic'>
                  <div style={backgroundImage} className = 'img-Wrapper'>
                  </div>
                </Col>
                <Col className = 'centerBut' type="rel" offsetS={0} offsetM={0} offsetL={1} offsetXL={0} sizeS={4} sizeM={3} sizeL={3} sizeXL={6}>
                  <h1 className='centerText'> { this.neededText(scene) } </h1>
                  <Indicators lives={lives} mana={mana} glory={glory} />
                  {
                    scene.options.map((item) => {
                      return (
                        <Row type="rel" sizeS={4} sizeM={6} sizeL={6} sizeXL={6}>
                          <Button key={item.id} scaleOnInteraction = {false} scaleOnHover = {false} scaleOnPress = {false} style={{ marginBottom: '12px', width: '100%' }} stretch={true} size="s" onClick={ () => this.add_note({choice: item.text[0]}) }>
                            <div className='butTextWrapper'> {item.text[0]} </div>
                          </Button>
                        </Row>
                      );
                    })
                  }
                  </Col>
              </Row>
            </>
        );
      }
    } else {
      return (<Spinner className='spinnerWrapper'/>);
    }
  }
}

export default Scene;