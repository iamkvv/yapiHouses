import React, { Component } from 'react'
import {Row,Col} from 'antd'
import ReactDOMServer from 'react-dom/server';

import ReactDOM from 'react-dom';

import { YMaps, Map } from 'react-yandex-maps'

import MyForm from './myform'

//https://tech.yandex.ru/maps/jsbox/2.1/balloon_ajax

class YandexMaps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ymaps: null,
            showpan:false,
           // coord: [55.157, 61.442],
            centermap: [55.15886441349485, 61.4025500698089],  
        }
    }

    mapInstance = null;
    API = null;
    lastPlayer = null;
    PMark = null;

componentDidMount(){
    this.setState({showpan:true})
}

    //строим панораму
    getPanorama = (coord) => {
        if (this.lastPlayer && this.lastPlayer._engine) {
            this.lastPlayer.destroy();
        }
        this.lastPlayer = window.YAPI.panorama.locate(coord).done((pans) => {
            if (pans.length) {
                this.lastPlayer = new window.YAPI.panorama.Player(
                    'pan1',
                    pans[0],
                    {
                        direction: [6, 6],
                        controls: ['panoramaName', 'zoomControl', 'fullscreenControl']
                    }
                );
                this.setState({ showpan: true })
            } else {
                this.setState({ showpan: false })
            }
        })
    }


    
    setBalloonLayout = (prp) => {
        const html = ReactDOMServer.renderToString(<MyForm test="qwerty" />);
        console.log(html);
        var Layout =  window.YAPI.templateLayoutFactory.createClass(
            `<div id="balloon">${html}</div>`,
            {
                build: function () {
                    Layout.superclass.build.call(this);
                    ReactDOM.hydrate(
                        <MyForm test= {prp} />,
                        document.getElementById('balloon'),
                    );
                },
            }
        );
        return Layout;
    }

    setSearch = (apiobj) => {

        // Создаем экземпляр класса ymaps.control.SearchControl
      var mySearchControl = new apiobj.control.SearchControl({
            options: {
                noPlacemark: true, //??
                draggable: true,
                provider: 'yandex#map',
                noPopup:true,
            }
        });

 
        // const html = ReactDOMServer.renderToString(<MyForm test="qwerty" />);
        // console.log(html);
        // var Layout = apiobj.templateLayoutFactory.createClass(
        //     `<div id="balloon">${html}</div>`,
        //     {
        //         build: function () {
        //             Layout.superclass.build.call(this);
        //             ReactDOM.hydrate(
        //                 <MyForm test="qwerty 123" />,
        //                 document.getElementById('balloon'),
        //             );
        //         },
        //     }
        // );


            // Результаты поиска будем помещать в коллекцию.
         var  mySearchResults = new apiobj.GeoObjectCollection(null, {
                hintContentLayout: apiobj.templateLayoutFactory.createClass('<h1>$[properties.name]</h1> <h2>{{properties.coord}}</h2>'),
                //balloonContentLayout:Layout
              //it's just test  balloonContentLayout:  apiobj.templateLayoutFactory.createClass('<div style="background-color:blue; padding:20px">123</div>')
                // balloonContentLayout:  apiobj.templateLayoutFactory.createClass(
                //     `<div id="balloon" style="width:auto">${html}</div>`,
                // ),
            });
        
console.log('mySearchResults',mySearchResults);
mySearchResults["options"].set("balloonMinWidth", 700);
mySearchResults["options"].set("balloonMaxWidth", 800);
mySearchResults["options"].set("balloonMinHeight", 200);

//mySearchResults["options"].set("zIndex", 9999); //??? не работает

//mySearchResults["options"].set("autoPanDuration", 3000); //??

//debugger;
//https://yandex.ru/blog/mapsapi/47686

            this.mapInstance.controls.add(mySearchControl);
            this.mapInstance.geoObjects.add(mySearchResults);

        // При клике по найденному объекту метка становится красной.
        //mySearchResults.events.add('click', function (e) {
        //    e.get('target').options.set('preset', 'islands#redIcon');
        //});


        // Выбранный результат помещаем в коллекцию.
        var self = this;
        mySearchControl.events.add('resultselect', function (e) {
            var index = e.get('index');
            //debugger; //mySearchControl.getResult(index)._value.geometry._coordinates

            mySearchControl.getResult(index).then(function (res) {
            let addr = res.properties.get('name'); //res.properties.get('text') res.properties.getAll()
            res.properties.set("coord",res.geometry.getCoordinates()); //это мое св-во для hint'a

              let ly = self.setBalloonLayout(addr);
              res["options"].set("balloonContentLayout", ly  );

              mySearchResults.add(res);
            });
        })
            .add('submit', function () {
                mySearchResults.removeAll();
               // вроде удаляет ранее найденную метку
        })
        
    }


    onLoadMap = (apiobj) => {
        window.YAPI = apiobj; //убрать window
        let map = this.mapInstance;

        this.PMark = new window.YAPI.Placemark(
            this.state.centermap, // [0, 0],
            {
                hintContent: "Перетащите метку, чтобы выбрать дом",
                balloonContent: '<h1>простое содержание балуна</h1>',

                balloonContentHeader: 'Header',
                // baloonContentBody:'<h2>это baloonContentBody!!</h2>',
                balloonContentFooter: 'Footer'
            },
            {
                preset: 'islands#icon',
                iconColor: 'red',//'#0095b6',
                
                draggable: true
            },
        )

        map.geoObjects.add(this.PMark);
        this.getPanorama(this.state.centermap);

        //после перемещения метки ищем Yandex-адрес и панораму
        this.PMark.events.add("dragend", (e) => {
            let coord = e.originalEvent.target.geometry._coordinates;
            let addrPromise = this.getYAddress(coord);

            addrPromise.then((r) => {
                this.PMark.properties._data.hintContent = r;
            }).done(() => {
                this.getPanorama(coord);

                //https://flaviocopes.com/fetch-api/#using-fetch
                fetch('https://yamaz.ru/api/Values/items')
                    .then(response => response.json())
                    .then(data => console.log(data))

                this.setState({ pmcoord: coord });
            })
        })
    }

        //получаем Yandex-адрес
        getYAddress = (coord) => {
            let mess1 = '<p>Перетащите метку, чтобы выбрать дом </p>';
            let mess2 = '<h3>Выбранный адрес:</h3>';
            let mess3 = '<p>Дом не выбран</p>';

            return window.YAPI.geocode(coord, {
                results: 1
            }).then((r) => {
                let shortaddr = r.geoObjects.get(0).properties._data.name;
                if (shortaddr.split(',').length > 1) {
                    return  mess1 + mess2 + '<h3><strong>' + shortaddr + '</strong></h3>'
                } else {
                    return mess1 + mess3
                }
            })
        }

    render() {
        console.log("RENDER" )

        return (
            <Col span={22} offset={1}>
                <YMaps query={{
                    // ns: 'use-load-option',
                    lang: 'ru_RU',
                    mode: 'release',
                    apikey: 'a251630e-2cd2-42fb-a025-8e2f375579de',
                    load: 'package.full'
                }}>
                    <Row type='flex' gutter={0}>
                        <Col span={18} style={{ zIndex: 9999 }}>
                            <Map className="MapDef"
                                instanceRef={(map) => this.mapInstance = map}
                                state={{
                                    center: this.state.centermap,// [55.157, 61.442], 
                                    type: 'yandex#map',
                                    zoom: this.props.zoom,
                                   controls:[] //'searchControl'
                                }}
                                onLoad={(y) => {
                                    this.onLoadMap(y);
                                    this.setSearch(y);
                                }}
                                onClick={(e) => {
                                    let coord = e.get('coords');

                                    this.setState({ pmcoord: coord });
                                    e.originalEvent.map.setCenter(coord)

                                    let addrPromise = this.getYAddress(coord);
                                    addrPromise.then((r) => {
                                        this.PMark.properties._data.hintContent = r;
                                    })

                                    this.PMark.geometry._coordinates = coord;
                                   ///tmp!!! e.originalEvent.map.geoObjects.removeAll(); вернуть
                                    e.originalEvent.map.geoObjects.add(this.PMark);

                                    this.getPanorama(coord);

                                    //https://flaviocopes.com/fetch-api/#using-fetch
                                    fetch('https://yamaz.ru/api/Values/items')
                                        .then(response => response.json())
                                        .then(data => console.log(data))
                                }}>
                            </Map>
                        </Col>

                        <Col span={6} >
                            <div className="panorama">
                                <h4>
                                    TEST <span>{this.state.pmcoord}</span>
                                </h4>
                                <div id="pan1" style={{ margin: '0 auto', border:'2px solid ivory', height: 300, width: 300 }}>
                                    <div style={{ display: this.state.showpan ? "none" : "block" }}>
                                        Для выбранной точки панорама отсутствует
                                </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </YMaps>
            </Col >
        )
    }
}

export default YandexMaps
