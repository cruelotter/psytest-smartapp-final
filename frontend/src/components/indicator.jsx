import React from "react";

import { Row } from '@sberdevices/plasma-ui/components/Grid';
import { Toast } from '@sberdevices/plasma-ui';

import './centerIndicators.css'
import './marginIndicators.css'

class Indicators extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
            <Row className = 'centerInd'>
                <div className='indWrapper'> <Toast  text={`Вопрос:: ${this.props.num}/${this.props.total}`} /> </div>
                <div className='indWrapper'> <Toast  text={`Нейротизм: ${this.props.lives}`} /> </div>
                <div className='indWrapper'> <Toast  text={`Экстраверсия: ${this.props.mana}`} /> </div>
                <div className='indWrapper'> <Toast  text={`Ложь: ${this.props.glory}`} /> </div>
            </Row>
        );
    }
  }

export default Indicators;