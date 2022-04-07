export const drawStyles = [
	// ACTIVE (being drawn)
	// line stroke
	{
		id: 'gl-draw-line',
		type: 'line',
		filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
		layout: {
			'line-cap': 'round',
			'line-join': 'round'
		},
		paint: {
			'line-color': '#00bbb0',
			'line-dasharray': [0.2, 2],
			'line-width': 2
		}
	},
	// polygon fill
	{
		id: 'gl-draw-polygon-fill',
		type: 'fill',
		filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'draw_polygon']],
		paint: {
			'fill-color': '#a2e7e3',
			'fill-outline-color': '#00bbb0',
			'fill-opacity': 0.2
		}
	},
	// polygon outline stroke
	// This doesn't style the first edge of the polygon, which uses the line stroke styling instead
	{
		id: 'gl-draw-polygon-stroke-active',
		type: 'line',
		filter: ['all', ['==', '$type', 'Polygon']],
		layout: {
			'line-cap': 'round',
			'line-join': 'round'
		},
		paint: {
			'line-color': '#00bbb0',
			'line-dasharray': [0.2, 2],
			'line-width': 2
		}
	},
	// vertex point halos
	{
		id: 'gl-draw-polygon-and-line-vertex-halo-active',
		type: 'circle',
		filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
		paint: {
			'circle-radius': 5,
			'circle-color': '#a2e7e3'
		}
	},
	// vertex points
	{
		id: 'gl-draw-polygon-and-line-vertex-active',
		type: 'circle',
		filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
		paint: {
			'circle-radius': 3,
			'circle-color': '#00bbb0',
		}
	},

	// INACTIVE (static, already drawn)
	// line stroke
	{
		id: 'gl-draw-line-static',
		type: 'line',
		filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true'], ['==', 'mode', 'simple_select']],
		layout: {
			'line-cap': 'round',
			'line-join': 'round'
		},
		paint: {
			'line-color': '#a2e7e3',
			'line-width': 2
		}
	},
	// polygon fill
	{
		id: 'gl-draw-polygon-fill-static',
		type: 'fill',
		filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true'], ['==', 'mode', 'simple_select']],
		paint: {
			'fill-color': '#a2e7e3',
			'fill-outline-color': '#00bbb0',
			'fill-opacity': 0.3
		}
	},
	// polygon outline
	{
		id: 'gl-draw-polygon-stroke-static',
		type: 'line',
		filter: ['all', ['==', '$type', 'Polygon'], ['==', 'active', 'true'], ['==', 'mode', 'simple_select']],
		layout: {
			'line-cap': 'round',
			'line-join': 'round'
		},
		paint: {
			'line-color': '#00bbb0',
			'line-width': 2
		}
	},
];
