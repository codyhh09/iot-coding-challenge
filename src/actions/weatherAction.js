export const LOADCITYWEATHER = 'LOAD_CITY_WEATHER';
export const LOADCITYFORCAST = 'LOAD_CITY_FORCAST';
export const CITYERROR = 'ERROR_CITY';

let appid = '0e1eb877b83ff3720ad05109c7965be6';

export const GetCityWeather = (cityName) => (dispatch, getState) => {
	let { cities } = getState().weatherState;
	cityName = cityName.toLowerCase();
	let cityIndex = cities.findIndex(city => city.name === cityName);

	fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${ appid }&q=${ cityName }&units=imperial`, {
		method: 'get'
	})
		.then(data => data.json())
		.then(data => {
			if (data.cod !== undefined) {
				dispatch(loadError(data.cod, data.message));
				return;
			}

			if (cityIndex < 0) {
				cities.push({
					name: cityName,
					temp_max: data.main.temp_max,
					temp_min: data.main.temp_min,
					temp: data.main.temp,
					description: data.weather[ 0 ].description
				});
			} else {
				cities[ cityIndex ] = {
					name: cityName,
					temp_max: data.main.temp_max,
					temp_min: data.main.temp_min,
					temp: data.main.temp,
					description: data.weather[ 0 ].description
				};
			}

			dispatch(loadCityWeather(cities, cityName));
		})
		.catch(err => dispatch(loadError(err.cod, err.message)));
};

export const GetCityForcast = (cityName) => (dispatch, getState) => {
	let { forcasts } = getState().weatherState;
	cityName = cityName.toLowerCase();
	let forcastIndex = forcasts.findIndex(city => city.name === cityName);

	fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=${ appid }&q=${ cityName }&units=imperial`, {
		method: 'get'
	})
		.then(data => data.json())
		.then(data => {
			if (data.cod === undefined) {
				dispatch(loadError(data.cod, data.message));
				return;
			}

			let results = fiveDayForcastBreakDown(data);

			if (forcastIndex < 0) {
				forcasts.push({
					name: cityName,
					forcasts: results
				});
			} else {
				forcasts[ forcastIndex ] = {
					name: cityName,
					forcasts: results
				};
			}

			dispatch(loadCityForcast(forcasts, cityName));
		})
		.catch(err => dispatch(loadError(err.cod, err.message)));
};

const fiveDayForcastBreakDown = (forcasts) => {
	let result = [];
	for (let index = 0; index < forcasts.list.length; index++) {
		let forcast = forcasts.list[ index ];

		let date = new Date(forcast.dt_txt);
		if (!result.some(data => data.day === date.toLocaleDateString())) {
			result.push({
				day: date.toLocaleDateString(),
				temp_max: forcast.main.temp_max,
				temp_min: forcast.main.temp_min,
				temp: forcast.main.temp,
				description: forcast.weather[ 0 ].description
			})
		}
	}

	return result;
}

const loadCityWeather = (cities, cityName) => ({
	type: LOADCITYWEATHER,
	cities: cities,
	cityName: cityName
});

const loadCityForcast = (forcasts, cityName) => ({
	type: LOADCITYFORCAST,
	forcasts: forcasts,
	cityName: cityName
});

const loadError = (code, message) => ({
	type: CITYERROR,
	status: code,
	message: message
});
