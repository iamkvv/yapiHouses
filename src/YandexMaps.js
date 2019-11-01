import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server';
import { YMaps,Map, ObjectManager, Placemark,Clusterer, TrafficControl, RulerControl } from 'react-yandex-maps'

import Behavior from './Behavior'

import im from './test.jpg'
import Baloon from './Baloon'

//https://tech.yandex.ru/maps/jsbox/2.1/balloon_ajax

async function Test(){
    //https://stackoverflow.com/questions/52896068/reactasp-net-core-no-access-control-allow-origin-header-is-present-on-the-r
   // console.log("TEST  https://localhost:44312/  ");
      return await fetch("https://yamaz.ru/api/Values/items",{method: 'GET', mode:'cors' })
     .then(response => response)
     .catch(error => console.log("ERR",error) );
 }


class YandexMaps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ymaps:null,
            coord:[55.157, 61.442],
            centermap:[55.157, 61.442]
        }
    }
    mapInstance=null;
    API=null;




    onLoadMap=(apiobj)=>{
        window.YAPI = apiobj;
        let map = this.mapInstance;

    //   var bb = apiobj.behavior.storage.add('mybehavior', Behavior);
    //   console.log("BB", bb);

    //     map.behaviors.enable('mybehavior');

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
        return (
            <div style={{marginTop:40}}>

                <YMaps   query={{
                    ns: 'use-load-option', 
                    lang:'ru_RU',
                    mode: 'release',
                    apikey:'a251630e-2cd2-42fb-a025-8e2f375579de',
                    load:'package.full'
                  }}>
                    
                        <Map className="MapDef" 
                            instanceRef={(map) => this.mapInstance = map}
                             onLoad={(y)=>{this.onLoadMap(y)}} 

                             state={{ 
                                center:  this.state.centermap,// [55.157, 61.442], 
                                //margin:[0,0],
                                type:'yandex#map',
                                zoom: this.props.zoom,
                                controls: ['zoomControl', 'searchControl', 'fullscreenControl'],
                                pmcoord:[55.157, 61.442]
                             }}
                                onClick={(e)=>{
                                    console.log("onClick",e,  e.get('coords') );
                                    let coord = e.get('coords');

                                    //centermap - is OK!!
                                    this.setState({pmcoord:coord,  centermap:coord})// , center:coord})
                                    
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
                            <Placemark
                             geometry={this.state.pmcoord}
                             properties={
                                 {
                                     iconContent:"<h2>Узнать адрес</h2>",
                                     hintContent: "Перетащите метку и кликните, чтобы узнать адрес"
                                }
                             }
                             
                             options={{preset:'islands#dotIcon',
                             iconColor : 'red',
                             draggable:true,
                             hasHint:true

                            }}

                             onLoad={(e)=>{console.log("PM",e)}}
                             onClick={(e)=>{
                                 console.log("PM onClick",e);
                                 let coords= e.get('coords');
                                 console.log('coords',coords);
                                
                                // setTimeout(function () {
                                    window.YAPI.geocode(coords, {
                                        results: 1
                                    }).then(function (res) {
                                        var newContent = res.geoObjects.get(0); //?
                                        console.log('newContent',newContent) ;     
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
                                       
                                    // let response =  fetch("https://yamaz.ru/api/Values/items");
                                    // if (response.ok) { 
                                    //   let json =  response.json();
                                    //   console.log(json)
                                    // } else {
                                    //     console.log("err", response )
                                    //   alert("Ошибка HTTP: " + response.status);
                                    // }


                                 








                                }}
                             
                             />
                        </Map>
                </YMaps>
            </div>
        )

    }
}

export default YandexMaps
