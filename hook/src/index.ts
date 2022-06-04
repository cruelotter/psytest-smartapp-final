import { Dialute, SberRequest } from 'dialute';
import e from 'express';
import { stat } from 'fs';
import { data } from './data';


//const fs = require("fs");

//const rawData = fs.readFileSync("places.json");
//const places = JSON.parse(rawData);

const questions = data;

function* script(r: SberRequest) {
  const rsp = r.buildRsp();
  
  const state = {
    id: 0,
    e: 0,
    l: 0,
    n: 0,
    question: {},
    intro: false,
    done: false
  };

  function updateState(ans: any) {
    state.e += Number(typeof questions[state.id].options[0].koe.e == 'undefined'? '0' : questions[state.id].options[0].koe.e);
    state.l += Number(typeof questions[state.id].options[0].koe.l == 'undefined'? '0' : questions[state.id].options[0].koe.l);
    state.n += Number(typeof questions[state.id].options[0].koe.n == 'undefined'? '0' : questions[state.id].options[0].koe.n);

    state.id += 1;
    state.question = questions[state.id]
    rsp.data = state;
  }

  function startState() {
    state.intro = true;
    rsp.data = state;
  }

  startState();
  rsp.msg = 'Добро пожаловать!';
  rsp.msgJ = 'Привет!';
  yield rsp;

  while (state.id <= 56){
    if (r.type === 'SERVER_ACTION'){
      if (r.act?.action_id == 'click'){
        updateState(r.act.data);
      }
      yield rsp;
      continue;
    }
   
    else if (r.nlu.lemmaIntersection(['выход', 'выйти', 'выйди'])) {
      rsp.msg = 'Всего вам доброго!'
      rsp.msgJ = 'Еще увидимся. Пока!'
      rsp.end = true;
      rsp.data = {'type': 'close_app'}
    }

    yield rsp;
  }
  rsp.msg = 'Поздравляю! Вы знаете все места Москвы!'
  rsp.msgJ = 'Поздравляю! Ты знаешь все места Москвы!'
  yield rsp;
}

Dialute
  .fromEntrypoint(script as GeneratorFunction)
  .shareApp('../app/public')
  .start();
