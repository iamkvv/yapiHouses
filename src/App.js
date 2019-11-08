import './App.css'

import React, { Component } from 'react'

import {Row,Col, DatePicker, ConfigProvider } from 'antd'
import ru from 'antd/es/locale/ru_RU'

import Companies from './Companies'
import Houses from './Houses'
import YandexMaps from './YandexMaps'

const dateFormat = 'DD/MM/YYYY';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      HousesByComp: [],
      zoom: 16
    }
  }

  // componentDidMount() {
  //   let flt = this.filterHouses(CompaniesData[0].id)

  //   this.setState({
  //     HousesByComp: flt
  //   })
  // }

//     <Companies comps = {CompaniesData} onCompanyChange={this.onCompanyChange} ></Companies>
       //    <Houses houses = {this.state.HousesByComp}></Houses>  


  onCompanyChange = (value, e) => {
    console.log("val", value, e);
    this.setState({
      zoom: this.state.zoom - 1
    });
    this.setState({
      HousesByComp: this.filterHouses(value),
      // zoom:10
    });
    this.setState({
      zoom: this.state.zoom == 10 ? this.state.zoom - 1 : 10
    });
  }
  filterHouses = (compId) => {
    let flt = HousesData.filter((item => {
      return item.comp_id == compId;
    }))
    return flt
  }

  render() {
    return (
      <Row  gutter={16} style={{height:'100%',backgroundColor:'ivory'}}>
        <Row style={{height:80,textAlign:'center'}} type='flex' align="middle" >
        <Col  span={20} offset={2}>
          <h2 style={{letterSpacing:3}}>Заголовок страницы</h2>
          </Col>
        </Row>

          <YandexMaps zoom={16} />

      </Row>
    )
  }
}

export default App
