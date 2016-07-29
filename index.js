window.addEventListener('load', () => {
    const map = L.map(document.body).setView([50, 30], 5)
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map)
})
