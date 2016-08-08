function pick(obj, keys) {
    return Object.keys(obj).filter(function(k) {
        return !!(keys.indexOf(k) + 1)
    }).reduce(function(prev, curr) {
        var o = {}
        o[curr] = obj[curr]
        return L.extend(prev, o)
    }, {})
}

window.ClusterLayer = L.Class.extend({
    // options.dataProvider
    // + MarkerClusterGroup options
    initialize: function(options) {
        L.setOptions(this, options)
        this._markerClusterGroup = L.markerClusterGroup(pick(this.options, [
            'showCoverageOnHover',
            'zoomToBoundsOnClick',
            'spiderfyOnMaxZoom',
            'removeOutsideVisibleBounds',
            'animate',
            'animateAddingMarkers',
            'disableClusteringAtZoom',
            'maxClusterRadius',
            'polygonOptions',
            'singleMarkerMode',
            'spiderLegPolylineOptions',
            'spiderfyDistanceMultiplier',
            'iconCreateFunction'
        ]));
    },

    _updateBbox: function() {
        this._styleManager.gmx.currentZoom = this._map.getZoom();
        var screenBounds = this._map.getBounds(),
            p1 = screenBounds.getNorthWest(),
            p2 = screenBounds.getSouthEast(),
            bbox = L.gmxUtil.bounds([
                [p1.lng, p1.lat],
                [p2.lng, p2.lat]
            ]);
        this._observer.setBounds(bbox);
    },

    onAdd: function(map) {
        this._bindDataProvider()

        this._map = map;
        this._styleManager = this.options.dataProvider._gmx.styleManager;
        this._styleManager.initStyles().then(function() {
            this._styleManager.gmx.currentZoom = this._map.getZoom();
            map.on('moveend', this._updateBbox, this);
        }.bind(this));

        map.addLayer(this._markerClusterGroup)
    },

    onRemove: function(map) {
        this._unbindDataProvider()
        map.removeLayer(this._markerClusterGroup)
        map.off('moveend', this._updateBbox, this);
    },

    setDateInterval: function(dateBegin, dateEnd) {
        this._dateInterval = [dateBegin, dateEnd]
        this._observer && this._observer.setDateInterval.apply(this._observer, this._dateInterval)
    },

    _bindDataProvider: function() {
        this._observer = this.options.dataProvider.addObserver({
            type: 'resend',
            filters: ['styleFilter'],
            dateInterval: this._dateInterval,
            callback: this._onObserverData.bind(this)
        })
    },

    _unbindDataProvider: function() {
        this.options.dataProvider.removeObserver(this._observer)
        this._observer = null
    },

    _onObserverData: function(data) {
        console.log(data.added.length);
    }
})
