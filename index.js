function createDateInterval(daysAgo) {
    return [
        new Date(dtAgo(daysAgo + 1)),
        new Date(dtAgo(daysAgo))
    ]

    function dtAgo(d) {
        return Date.now() - (d + 1) * 60 * 60 * 1000
    }
}

window.addEventListener('load', (e) => {
    const map = L.map(document.body).setView({lat: 59.428315784042574, lng: 22.6263427734375}, 7)
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map)

    window.map = map

    L.gmx.loadLayer('Z6BDM', '0FDBF9D073A1428F94E8492F1E2AF2EE').then(function (layer) {
        const clusterLayer = new ClusterLayer({
            dataLayer: layer
        })

        clusterLayer.setDateInterval.apply(clusterLayer, createDateInterval(0))
        map.addLayer(clusterLayer)

        window.clusterLayer = clusterLayer
    }, function (err) {
        console.error(err);
    })
})
