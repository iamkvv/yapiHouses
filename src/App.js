import './App.css'
//import { data1, data2, CompaniesData, HousesData } from './Data'

import React, { Component } from 'react'

import { DatePicker, ConfigProvider } from 'antd'
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
      <ConfigProvider locale={ru}>
        <div className="App">
          <div className="App-flex">
            <h2>Заголовок страницы</h2>
          </div>


          <div className="App-flex" style={{ width: 600, margin: "0 auto" }}>
            {/*     <Companies comps = {CompaniesData} onCompanyChange={this.onCompanyChange} ></Companies>
           <Houses houses = {this.state.HousesByComp}></Houses>  */}


            <div>
              <YandexMaps zoom={16} />
            </div>


          </div>


          <div className="App-flex">
            <DatePicker format={dateFormat} />
          </div>

          <div className="App-flex">
            <img className="App-logo" src={require('./react.svg')} />
          </div>
        </div>
      </ConfigProvider>
    )
  }
}

export default App
