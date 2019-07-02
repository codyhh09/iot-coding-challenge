import { LOADCITYWEATHER, LOADCITYFORCAST, CITYERROR } from '../actions/weatherAction';

const initalState = {
	cityName: '',
	cities: [],
	forcasts: [],
	error: null
};

export default function (state = initalState, action) {
	switch (action.type) {
		case LOADCITYWEATHER:
			return {
				...state,
				cityName: action.cityName,
				cities: action.cities,
				error: null
			};
		case LOADCITYFORCAST:
			return {
				...state,
				cityName: action.cityName,
				forcasts: action.forcasts,
				error: null
			}
		case CITYERROR:
			return {
				...state,
				error: {
					status: action.status,
					message: action.message
				}
			};
		default:
			return state;
	}
}
