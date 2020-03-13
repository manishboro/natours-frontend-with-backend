export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibWFuaXNoYm9ybyIsImEiOiJjazcwczFwdjMwMGJrM2xtdDA2aGtjano0In0.DEWb2BKOGNz19usGXDSC6Q';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/manishboro/ck70s9qvh0gwq1iru7ovyia6x',
    center: [-118.269071, 34.063846],
    zoom: 4,
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    //Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
