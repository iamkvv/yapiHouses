function Behavior() {
    this.options = new window.YAPI.option.Manager(); // Менеджер опций
    this.events = new window.YAPI.event.Manager(); // Менеджер событий
    
    this.root2 = null
    this.root = function(k){alert(this.root2)}
}

Behavior.prototype = {
    constructor: Behavior,
    // Когда поведение будет включено, добавится событие щелчка на карту
    enable: function () {
        /*
        this._parent - родителем для поведения является менеджер поведений;
        this._parent.getMap() - получаем ссылку на карту;
        this._parent.getMap().events.add - добавляем слушатель события на карту.
        */
        this._parent.getMap().events.add('click', this._onClick, this);
    },
    disable: function () {
        this._parent.getMap().events.remove('click', this._onClick, this);
    },
    // Устанавливает родителя для исходного поведения.
    setParent: function (parent) { this._parent = parent; },
    // Получает родителя
    getParent: function () { return this._parent; },
    // центрирование по месту клика.
    _onClick: function (e) {

        alert(this.root);

        var coords = e.get('coords');
        this._parent.getMap().setCenter(coords);
        console.log("Click", this, e.get("coords"));

        // var pan = window.YAPI.panorama.createPlayer("pan", coords)
        // console.log("PAN", pan);

        var myGeoObject = new window.YAPI.Placemark(
            e.get('coords'),
            {
                //layout:'<div style="padding:20px">123</div>',
                balloonContent: '<h1>простое содержание балуна</h1>',
                balloonContentHeader: 'Header',
                // baloonContentBody:'<h2>это baloonContentBody!!</h2>',
                balloonContentFooter: 'Footer'
            },
            {
                preset: 'islands#icon',
                iconColor: '#0095b6',
                iconColor: 'red',
                draggable: true,
                hasHint: true,

            })

        myGeoObject.events.add([
            'mapchange', 'geometrychange', 'pixelgeometrychange', 'optionschange', 'propertieschange',
            'balloonopen', 'balloonclose', 'hintopen', 'hintclose', 'dragstart', 'dragend'
        ], function (e) {


            console.log("E", e.originalEvent.target.geometry._coordinates);

            var crd = e.originalEvent.target.geometry._coordinates

            //var pan = window.YAPI.panorama.createPlayer("pan", crd)

            console.log("PAN", pan);

        });



        this._parent.getMap().geoObjects.removeAll();
        this._parent.getMap().geoObjects.add(myGeoObject);
    }
}

export default Behavior