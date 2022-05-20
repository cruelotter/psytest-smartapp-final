import React from "react";

import { Row } from '@sberdevices/plasma-ui/components/Grid';
import { Toast } from '@sberdevices/plasma-ui';
import { setConstantValue } from "typescript";

import './centerIndicators.css'
import './marginIndicators.css'

class Indicators extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
            <Row className = 'centerInd'>
                <div className='indWrapper'> <Toast  text={`Количество жизней: ${this.props.lives}💖`} /> </div>
                <div className='indWrapper'> <Toast  text={`Мана: ${this.props.mana}🧙`} /> </div>
                <div className='indWrapper'> <Toast  text={`Слава: ${this.props.glory}🎺`} /> </div>
            </Row>
        );
    }
  }

export default Indicators;