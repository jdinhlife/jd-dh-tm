'use strict';
var React = require('react'),
    TM = require('../Logic/tripManager.js');

/* eslint-disable no-unused-vars */
var Tokenizer = require('react-typeahead').Tokenizer,
    DatePicker = require('react-date-picker'),
    NewTrip = require('./tripForm-newTrip.js');
/* eslint-enable */

var config = require('../Logic/config'); // eslint-disable-line no-unused-vars

var lang = config.language,
    locale = config.locale,
    getText = config.getText;

var TripForm = React.createClass({
    getInitialState: function () {
        return {
            clients: [],
            drivers: [],
            filterOptions: this.props.filterOptions,
            fClients: [],
            fDrivers: [],
            type: '',
            typeFilter: [
                {
                    '7s': true
                },
                {
                    '16s': true
                },
                {
                    '16s2': true
                }
            ]
        };
    },

    componentWillReceiveProps: function () {
        var filterOptions = this.props.filterOptions,
            fClients = filterOptions.clients || [],
            fDrivers = filterOptions.drivers || [];

        this.setState({
            filterOptions: filterOptions,
            fClients: fClients,
            fDrivers: fDrivers,
            clients: TM.getClients(this.props.data),
            drivers: TM.getDrivers(this.props.data)
        });
    },

    handleClientsTokenAdd: function (token) {
        var fClients = this.state.fClients,
            filterOptions = this.state.filterOptions;
        fClients = fClients.concat([token]);
        filterOptions.clients = fClients;
        this.props.updateView(filterOptions);
    },

    handleClientsTokenRemove: function (token) {
        var fClients = this.state.fClients,
            filterOptions = this.state.filterOptions;
        fClients.splice(fClients.indexOf(token), 1);
        filterOptions.clients = fClients;
        this.props.updateView(filterOptions);
    },

    handleDriversTokenAdd: function (token) {
        var fDrivers = this.state.fDrivers,
            filterOptions = this.state.filterOptions;
        fDrivers = fDrivers.concat([token]);
        filterOptions.drivers = fDrivers;
        this.props.updateView(filterOptions);
    },

    handleDriversTokenRemove: function (token) {
        var fDrivers = this.state.fDrivers,
            filterOptions = this.state.filterOptions;
        fDrivers.splice(fDrivers.indexOf(token), 1);
        filterOptions.drivers = fDrivers;
        this.props.updateView(filterOptions);
    },

    /**
     * handle date change for date pickers
     * @param {Moment} date
     * @param {string} type - 'start' or 'end'
     */
    handleDateChange: function (date, type) {
        var filterOptions = this.state.filterOptions;
        if (type === 'start') {
            filterOptions.startDate = date;
            if (TM.dateCompare(filterOptions.endDate, filterOptions.startDate) === -1) {
                filterOptions.endDate = date;
            }
        } else {
            filterOptions.endDate = date;
        }
        this.props.updateView(filterOptions);
    },

    handleStartDateChange: function (date) {
        this.handleDateChange(date, 'start');
        // console.log(date);
    },

    handleEndDateChange: function (date) {
        this.handleDateChange(date, 'end');
        // console.log(date);
    },

    handleTypeChange: function (event) {
        var typeFilter = this.state.typeFilter,
            filterOptions = this.state.filterOptions;
        typeFilter.map(function(filter){
            var key =  Object.keys(filter)[0];
            if (key === event){
                filter[key] = !filter[key];
            }
        });
        filterOptions.typeFilter = typeFilter;
        this.props.updateView(filterOptions);
    },

    getNewTripForm: function() {
        if (this.props.editable) {
            return (
                <NewTrip
                    clients={this.state.clients}
                    drivers={this.state.drivers}
                    createNewTrip={this.props.createNewTrip}/>
            );
        }
    },

    render: function () {
        var typeFilters = this.state.typeFilter.map(function(type){
            var key =  Object.keys(type)[0];
            return (
                <div className="medium-4 column" key={key}>
                    <input
                        type="checkbox"
                        id={'typeFilter-' + key}
                        checked={type[key]}
                        onChange={this.handleTypeChange.bind(this, key)}
                    />
                    <label htmlFor={'typeFilter-' + key}>{getText(lang, locale, key)}</label>
                </div>
            );
        }.bind(this));
        return (
            <div className="trip-form print-hide">
                {this.getNewTripForm()}
                <div className="trip-filter row">
                    <div className="column"><h3>{getText(lang, locale, 'Options')}</h3></div>
                    <div className="trip-filter__type">
                        {typeFilters}
                    </div>
                    <div className="row">
                        <div className="trip-filter__client column medium-6">
                            <Tokenizer
                                options={this.state.clients}
                                onTokenAdd={this.handleClientsTokenAdd}
                                onTokenRemove={this.handleClientsTokenRemove}
                                placeholder={getText(lang, locale, 'Client')}
                            />
                        </div>
                        <div className="trip-filter__driver medium-6 column">
                            <Tokenizer
                                options={this.state.drivers}
                                onTokenAdd={this.handleDriversTokenAdd}
                                onTokenRemove={this.handleDriversTokenRemove}
                                placeholder={getText(lang, locale, 'Driver')}
                            />
                        </div>
                    </div>
                    <div className="trip-filter__date">
                        <div className="trip-filter__sDate medium-6 column">
                            <h5 className="text-center">{getText(lang, locale, 'From')}</h5>
                            <DatePicker
                                date={this.state.filterOptions.startDate}
                                dateFormat="DD/MM/YYYY"
                                onChange={this.handleStartDateChange}
                                locale="vi"
                                hideFooter="true" />
                        </div>
                        <div className="trip-filter__eDate medium-6 column">
                            <h5 className="text-center">{getText(lang, locale, 'To')}</h5>
                            <DatePicker
                                date={this.state.filterOptions.endDate}
                                dateFormat="DD/MM/YYYY"
                                onChange={this.handleEndDateChange}
                                locale="vi"
                                hideFooter="true"
                                minDate={this.state.filterOptions.startDate}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = TripForm;
