import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server';
import { YMaps, Map, ObjectManager, Placemark, Panorama, Clusterer, TrafficControl, RulerControl } from 'react-yandex-maps'

import Behavior from './Behavior'

import im from './test.jpg'
import Baloon from './Baloon'

//https://tech.yandex.ru/maps/jsbox/2.1/balloon_ajax

function qq(x) {
    console.log("QQ", x)
}


const ThemeContext = React.createContext('light');

class YandexMaps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ymaps: null,
            coord: [55.157, 61.442],
            centermap: [55.157, 61.442],
    
        }
    }
    mapInstance = null;
    API = null;
    showpanorama=false;



    checkPan = () => {
        console.log("CHECK PAN")
        if (window.YAPI) {
            // var p = document.getElementById("pan");
            // p.innerHTML="";
         

            window.YAPI.panorama.locate(this.state.pmcoord).then((res)=>{
                console.log("RES",res)
                //window.YAPI.panorama.Manager.closePlayer();
                
                // if (res.length) {
                //     this.setState({ showpanorama: true })
                // } else {
                //     this.setState({ showpanorama: false })
                // }

                 //this.setState({ showpanorama: res.length ? true : false })
                //   debugger
                    
                //  var qq=  window.YAPI.panorama.createPlayer("pan",this.state.pmcoord)
                //   .then((resolve) => {
                //         //let pn = resolve.getPanorama()
                //         console.log("resolve", resolve);
                //         debugger;

                //     })

                   // console.log("QQ",qq)

                //}

                
            })



            // window.YAPI.panorama.createPlayer("pan", this.state.pmcoord).then((resolve) => {
            //     let pn = resolve.getPanorama()
            //     console.log("PN", pn);
            //     debugger;

            // })

           // return true;
        }
    }



    onLoadMap = (apiobj) => {
        window.YAPI = apiobj;
        let map = this.mapInstance;

//var beh0 = new Behavior()
//console.log(beh0);

     //   var bb = apiobj.behavior.storage.add('mybehavior', Behavior);
       // bb.root = this;
    //    console.log("BB", bb.hash.mybehavior);

    

   // var ex=     map.behaviors.enable(['mybehavior']);

//    ex._behaviors.mybehavior.root2='123456';
//    ex._behaviors.mybehavior.root();

//    console.log("EX ",ex )

 //var mybeh= apiobj.behavior.storage.get('mybehavior')
//mybeh.root();
//var mybeh1 = new mybeh()

 //console.log("MYBEH1", mybeh );

// var z= mybeh();
 //z.root();
//mybeh.root("QWERTY");
//console.log("MYBEH1", mybeh );

        map.behaviors.enable('scrollZoom')
        ///
        // map.events.add('actiontick', function (e) {
        //     var tick = e.get('tick');
        //     console.log('Сейчас карта переместится в точку (' + map.options.get(
        //         'projection')
        //         .fromGlobalPixels(tick.globalPixelCenter, tick.zoom)
        //         .join(',') + ') в течение ' + e.get('tick')
        //             .duration + ' миллисекунд');
        // });
    }



    render() {
        console.log("context", ThemeContext, this)

        return (
            <div style={{ marginTop: 40 }} >


                <YMaps query={{
                    // ns: 'use-load-option',
                    lang: 'ru_RU',
                    mode: 'release',
                    apikey: 'a251630e-2cd2-42fb-a025-8e2f375579de',
                    load: 'package.full'
                }}

                >

                    <div style={{ width: "100%", display: "flex" }}>
                        <div style={{ width: "100%" }}>
                            <Map className="MapDef" name="myMap"

                                instanceRef={(map) => this.mapInstance = map}
                                onLoad={(y) => {

                                    console.log("Map onLoad", this, y); this.onLoadMap(y)
                                }}

                                state={{
                                    center: this.state.centermap,// [55.157, 61.442], 
                                    //margin:[0,0],
                                    type: 'yandex#map',
                                    zoom: this.props.zoom,
                                    // controls: ['zoomControl', 'searchControl', 'fullscreenControl'],
                                    //  pmcoord: [55.157, 61.442],
                                    blabla: 'BLA-BLA'
                                }}
                                onClick={(e) => {
                                    console.log("onClickMap_1", this.context);

                                    console.log("onClick", e, e.get('coords'));
                                    let coord = e.get('coords');

                                    //centermap - is OK!!

                                    this.setState({ pmcoord: coord, centermap: coord }, () => {

                                        window.YAPI.panorama.locate(this.state.pmcoord).then((res) => {
                                            debugger;
                                            if (res.length) {
                                                this.showpanorama=true;
                                            } else {
                                                this.showpanorama=false;
                                            }
                                        })

                                    })

                                    // , center:coord})

                                    //this.checkPan()


                                    //setTimeout(()=>{e.originalEvent.map.setCenter(coord)},15)

                                    //this._parent.getMap().setCenter(coords);
                                    // var myGeoObj = new window.YAPI.Placemark(
                                    //     e.get('coords'),
                                    //     {
                                    //         //layout:'<div style="padding:20px">123</div>',
                                    //         balloonContent: '<h1>простое содержание балуна</h1>',
                                    //          balloonContentHeader:'Header',
                                    //         // baloonContentBody:'<h2>это baloonContentBody!!</h2>',
                                    //          balloonContentFooter:'Footer'
                                    //     },
                                    //     {
                                    //         preset: 'islands#icon',
                                    //         iconColor: '#0095b6'
                                    //     }
                                    // );

                                    //  e.originalEvent.map.geoObjects.removeAll();
                                    //  e.originalEvent.map.geoObjects.add(myGeoObj);

                                }}

                            >
                                {/*
                                <Placemark
                                    geometry={this.state.pmcoord}
                                    properties={
                                        {
                                            iconContent: "<h2>Узнать адрес</h2>",
                                            hintContent: "Перетащите метку и кликните, чтобы узнать адрес"
                                        }
                                    }

                                    options={{
                                        preset: 'islands#dotIcon',
                                        iconColor: 'red',
                                        draggable: true,
                                        hasHint: true

                                    }}

                                    onLoad={(e) => { console.log("PM Load", e) }}
                                    onClick={(e, a) => {
                                        console.log("PM onClick", e);

                                        let y = e.get('name');
                                        debugger;
                                        console.log("PM onClick 2", y);

                                        let coords = e.get('coords');
                                        console.log('coords', coords);



                                        //centermap - is OK!!
                                        this.setState({ pmcoord: coords, centermap: coords })


                                        // setTimeout(function () {
                                        window.YAPI.geocode(coords, {
                                            results: 1
                                        }).then(function (res) {
                                            var newContent = res.geoObjects.get(0); //?
                                            console.log('newContent', newContent);
                                            console.log(newContent.properties._data.text);
                                            console.log(newContent.properties._data.name);
                                            console.log(newContent.properties.getAll())


                                            //console.log("FETCH",  Test()[0] )

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
                            <div id="pan" style={{ width:300,height: 225}}>
                            

                                {this.showpanorama ?
                                    <Panorama
                                        onDestroy={e => { console.log("destroy", e) }}
                                        onLoad={(l => { console.log("Panorama", l) })}
                                        point={this.state.pmcoord}
                                        options={
                                            {
                                                controls: ['zoomControl', 'fullscreenControl']
                                            }
                                        }
                                    />
                                    :
                                    <h2>Панорамы нет</h2>
                                }

                            </div>
                          
                            
{/* 
                            {this.checkPan() ?

                                this.state.pmcoord ?
                                    <Panorama
                                        onDestroy={e => { console.log("destroy", e) }}
                                        onLoad={(l => { console.log("Panorama", l) })}
                                        point={this.state.pmcoord}
                                        options={
                                            {
                                                controls: ['zoomControl', 'fullscreenControl']
                                            }
                                        }
                                    >
                                    :
                                        <h1>?????</h1>

                                    </Panorama> :
                                    <h2>???!!!</h2>

                                :
                                <h1>NOT!</h1>
                            }                   
*/}


                        </div>
                    </div>
                </YMaps>
            </div >
        )
    }
}

export default YandexMaps
