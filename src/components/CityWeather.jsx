import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GetCityWeather, GetCityForcast } from '../actions/weatherAction';

class CityWeather extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			name: '',
			forcastDay: 0
		};

		this.onChange = this.onChange.bind(this);
		this.onChangeDay = this.onChangeDay.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(event) {
		let { target } = event;

		this.setState({
			[ target.name ]: target.value
		});
	}

	onChangeDay(event) {
		let { target } = event;

		this.setState({
			[ target.name ]: target.value
		});
	}

	onSubmit(event) {
		event.preventDefault();
		let { name } = this.state;

		this.props.onGetCityWeather(name);
		this.props.onGetCityForcast(name);
	}

	render() {
		let { cityName, city, forcast, error } = this.props;
		let { forcastDay } = this.state;

		return (
			<div>
				<input type="text" name='name' onChange={ this.onChange } />
				<button onClick={ this.onSubmit }>Result</button>
				{ error === null ? <React.Fragment>
					{ city !== undefined && city !== null &&
						<section>
							<h1>{ cityName }</h1>
							<div>
								<label>High temperature:</label> { city.temp_max }
							</div>
							<div>
								<label>Low temperature:</label> { city.temp_min }
							</div>
							<div>
								<label>Current temperature:</label> { city.temp }
							</div>
							<div>
								<label>Current weater description:</label> { city.description }
							</div>
						</section> }
					{ forcast !== undefined && forcast !== null &&
						<section>
							<h2>Forcast</h2>
							<div>{ forcast.forcasts[ forcastDay ].day }</div>
							<div>Number of Day: { parseInt(forcastDay) + 1 }</div>
							<input type="range" defaultValue={ forcastDay } min="0" max={ forcast.forcasts.length - 1 } name="forcastDay" onChange={ this.onChange } />
							<div>
								<label>High temperature:</label> { forcast.forcasts[ forcastDay ].temp_max }
							</div>
							<div>
								<label>Low temperature:</label> { forcast.forcasts[ forcastDay ].temp_min }
							</div>
							<div>
								<label>Current temperature:</label> { forcast.forcasts[ forcastDay ].temp }
							</div>
							<div>
								<label>Current weater description:</label> { forcast.forcasts[ forcastDay ].description }
							</div>

						</section>
					}
				</React.Fragment> :
					<div>
						<h3>Error:</h3>
						{ error.status }: { error.message }
					</div> }


			</div>
		);
	}
}

const mapStateToProps = (state) => {
	let { cities, forcasts, cityName, error } = state.weatherState;
	let city = cities.find(city => city.name === cityName);
	let forcast = forcasts.find(value => value.name === cityName);

	return {
		city,
		cityName,
		forcast,
		error
	}
}

const mapActionToProps = (dispatch) => {
	return bindActionCreators(
		{
			onGetCityWeather: GetCityWeather,
			onGetCityForcast: GetCityForcast
		},
		dispatch
	);
};

export default connect(mapStateToProps, mapActionToProps)(CityWeather);