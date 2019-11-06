import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server';
import { YMaps, Map } from 'react-yandex-maps'

//https://tech.yandex.ru/maps/jsbox/2.1/balloon_ajax

class YandexMaps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ymaps: null,
           // coord: [55.157, 61.442],
            centermap: [55.15886441349485, 61.4025500698089],  
        }
    }

    mapInstance = null;
    API = null;
    lastPlayer = null;
    PMark = null;

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
                    return mess1 + mess2 + '<h3><strong>' + shortaddr + '</strong></h3>'
                } else {
                    return mess1 + mess3
                }
            })
        }

    render() {
        console.log("RENDER" )

        return (
            <div style={{ marginTop: 40 }} >
                <YMaps query={{
                    // ns: 'use-load-option',
                    lang: 'ru_RU',
                    mode: 'release',
                    apikey: 'a251630e-2cd2-42fb-a025-8e2f375579de',
                    load: 'package.full'
                }}>

                    <div style={{ width: "100%", display: "flex" }}>
                        <div style={{ zIndex:9999, width: "100%" }}>
                            <Map className="MapDef"
                                instanceRef={(map) => this.mapInstance = map}

                                onLoad={(y) => {
                                    console.log("Map onLoad", this, y); this.onLoadMap(y)
                                }}

                                state={{
                                    center: this.state.centermap,// [55.157, 61.442], 
                                    type: 'yandex#map',
                                    zoom: this.props.zoom,
                                }}
                                onClick={(e) => {
                                    let coord = e.get('coords');

                                    this.setState({ pmcoord: coord });
                                    e.originalEvent.map.setCenter(coord)

                                    this.PMark.geometry._coordinates=coord;
                                     e.originalEvent.map.geoObjects.removeAll();
                                     e.originalEvent.map.geoObjects.add(this.PMark);

                                     this.getPanorama(coord);

                                     //https://flaviocopes.com/fetch-api/#using-fetch
                                     fetch('https://yamaz.ru/api/Values/items')
                                     .then(response => response.json())
                                     .then(data => console.log(data))
                                }}>

                                {/*
                                            //    fetch("https://yamaz.ru/api/Values/items",{method: 'GET', mode:'cors' })
                                            //   .then(response => console.log response)

                                            //https://flaviocopes.com/fetch-api/#using-fetch
                                            fetch('https://yamaz.ru/api/Values/items')
                                                .then(response => response.json())
                                                .then(data => console.log(data))



                                            // res.geoObjects.get(0).properties.get('name') :
                                            // 'Не удалось определить адрес.';

                                            // Задаем новое содержимое балуна в соответствующее свойство метки.
                                            ///placemark.properties.set('balloonContent', newContent);
                                        })
                                        //);

                                    }}
                                />
                                */}

                            </Map>
                        </div>
                        <div style={{ width: 300 }}>
                            <h1>TEST <span>{this.state.pmcoord}</span>
                                <span>{}</span>
                            </h1>
                            <div id="pan1" style={{ height: 300, width: 300 }}>
                                <div style={{ display: this.state.showpan ? "none" : "block" }}>
                                    Тут нужно объснить, почему нет панорамы
                                </div>
                            </div>
                        </div>
                    </div>
                </YMaps>
            </div >
        )
    }
}

export default YandexMaps
