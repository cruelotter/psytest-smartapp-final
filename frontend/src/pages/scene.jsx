import getScene, { API_URL } from '../services/APIHelper.js'
import React from 'react';

import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";

import { Button } from '@sberdevices/ui/components/Button/Button';
import { Row, Col } from '@sberdevices/plasma-ui/components/Grid';
import { Spinner } from '@sberdevices/plasma-ui/components/Spinner'

import Indicators from '../components/indicator'
import './scene.css';
import '../components/centerButtons.css'
import '../components/centerText.css'
import '../components/centerPic.css'
import '../components/sthg.css'
import '../components/startText.css'
import '../components/buttonText.css'
import '../components/lastBut.css'
import '../components/centerSpinner.css'

let characterID;

let firstRepeat = false;

let e = 0;
let l = 0;
let n = 0;

let counter = 0
let currentId = 1;
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

    const state = {
      item_selector: {
        items: { 
          text : this.state.scene.text, 
          texts : this.state.scene.texts,
          texta : this.state.scene.texta,
          textj : this.state.scene.textj,
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
    

    if (this.state.scene.options[1]) {
      if (this.state.scene.options[1].text.includes('выйти') && this.state.scene.options[1].text.includes(choice.toLowerCase())) {
        console.log("EXIT")
        this.exit();
      }
    }

    if (choice == 'да' || choice == 'один' || choice == 'первый' || choice == 'первое' || choice == 'первую') {
      choice = 1;
      e = e + Number(typeof this.state.scene.options[0].koe.e == 'undefined'? '0' : this.state.scene.options[0].koe.e);
      l = l + Number(typeof this.state.scene.options[0].koe.l == 'undefined'? '0' : this.state.scene.options[0].koe.l);
      n = n + Number(typeof this.state.scene.options[0].koe.n == 'undefined'? '0' : this.state.scene.options[0].koe.n);
    }
    if (choice == 'нет' || action.choice == 'два' || choice == 'второй'|| choice == 'второе' || choice == 'вторую') {
      choice = 2;
      e = e + Number(typeof this.state.scene.options[0].koe.e == 'undefined'? '0' : this.state.scene.options[0].koe.e);
      l = l + Number(typeof this.state.scene.options[0].koe.l == 'undefined'? '0' : this.state.scene.options[0].koe.l);
      n = n + Number(typeof this.state.scene.options[0].koe.n == 'undefined'? '0' : this.state.scene.options[0].koe.n);
    }
    if (choice == 'возможно' || action.choice == 'три' || choice == 'третий'|| choice == 'третье' || choice == 'третью') {
      choice = 3;
      e = e + Number(typeof this.state.scene.options[0].koe.e == 'undefined'? '0' : this.state.scene.options[0].koe.e);
      l = l + Number(typeof this.state.scene.options[0].koe.l == 'undefined'? '0' : this.state.scene.options[0].koe.l);
      n = n + Number(typeof this.state.scene.options[0].koe.n == 'undefined'? '0' : this.state.scene.options[0].koe.n);
    }

    currentId = currentId + 1;
    this.state.scene.options.forEach((arr, index) => {
      this.moveTo(currentId);
      isChanged = true;
    })

    if (!isChanged) {
      this.sendException();
    }
    //return this.state;
  }

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

    console.log('NEXT IS ', nextId);
    console.log('ARRAY = ', curNodes);

    if (!nextId) {

    }

    if ((nextId == 1) && this.state.scene.id > 1) {
      setBackground.backgroundImage = '';
      curNodes = nodesArr.slice(0, nodesArr.length);
    }

    getScene(nextId)
      .then((response) => {
        const { data } = response;

        this.setState({ scene: data , character : characterID});
        this.newScene();

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

        if (currentId == 56) {
          return (
            < >
              <Col type="calc" offsetS={1} offsetM={2} offsetL={3} offsetXL={4} sizeS={1} sizeM={2} sizeL={3} sizeXL={4} />
              <h1 className='textWrapper'> { 'Вы победили! ' } </h1>
              <Button scaleOnInteraction = {false} scaleOnHover = {false} scaleOnPress = {false} style={{ marginBottom: '5rem', width: '100%' }} stretch={true} size="l" onClick={ () => this.add_note({choice: 'выйти'}) }>
                <div className='butTextWrapper'> {'Выход'} </div>
              </Button>
            </>
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
                  <Indicators total={56} num={currentId} lives={e} mana={l} glory={n} />
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