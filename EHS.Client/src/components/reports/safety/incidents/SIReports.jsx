import React, { useState, useEffect, Fragment } from 'react'; 
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { fetchSafetyIncidents, clearData } from '../../../../store/actions/reports';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, TextField, Button, CircularProgress } from '@material-ui/core';
import queryString from 'query-string';
import moment from 'moment';
//Report Components 
import { SI_REPORTS } from '../../reportConfig';
import GeneratingReport from '../../GeneratingReport';
import EventDetailForm from './EventDetailForm';
import EventDetailReport from './EventDetailReport';
import SafeDaysForm from './SafeDaysForm'
import SafeDaysReport from './SafeDaysReport';
import OpenEventsForm from './OpenEventsForm';
import OpenEventsReport from './OpenEventsReport';
import InjuriesReport from './InjuriesReport';
import InjuriesForm from './InjuriesForm';
import RecordablesReport from './RecordablesReport';
import RecordablesForm from './RecordablesForm'

const useStyles = makeStyles(theme => ({
    header: {
        margin: theme.spacing(1), 
    },
	paper: {
		padding: theme.spacing(2),
		color: theme.palette.text.secondary,
        // minHeight: '94vh',	
        // height: '2000px',
	},
    button: {
        margin: theme.spacing(5), 
        height: '8em',
        width: '12em',
    }, 
    link: {
        textDecoration: 'none',
        color: 'black',

    },
}));

const SIReports = props => {
    const classes = useStyles(); 
    
    const [reportParams, setReportParams] = useState({});
    const [queryStringParams, setQueryStringParams] = useState(queryString.parse(props.location.search))
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(false); 
    // const [selectedDate, setSelectedDate] = React.useState(new Date());

    const { match, history, lookupData, reportData } = props; 
    
    const reportList = Object.keys(SI_REPORTS)
                            .filter(r => SI_REPORTS[r].enabled === true)
                            .map(r => {
                                return SI_REPORTS[r]
                            });
    
    useEffect(() => {        
        //clear data 
        props.clearData(match.params.report);

        setQueryStringParams(queryString.parse(props.location.search));

        fetchData(props.location.search); 
        
        return () => {
            //unmount
        }

    }, [props.location.search]);


    const handleSubmit = (config) => e => {
        e.preventDefault();
        
        Object.keys(reportParams)
            .map(p => {
                // console.log(params[p])
                if(reportParams[p]) queryStringParams[p] = reportParams[p]
            })
            
        setQueryStringParams(queryStringParams);
            
        // history.push(`?${queryString.stringify(queryStringParams)}&render=true`)
        history.push(`?${queryString.stringify(queryStringParams)}`)
    }
    
    const paramCheck = (required, provided) => {  
        let pass = true; 
        Object.keys(required).map(p => {
            if(!Object.keys(provided).includes(p)){
                console.log(`Missing ${p} parameter`)
                pass = false; 
                return false;
            };
        });
        return pass; 
    }

    const fetchData = (query) => {
        //get the config for this report 
        const config = reportList.find(r => r.url === match.url)
        //create new object with just the param names as keys, for the comparer 
        console.log(config)
        if(config){
            const requiredParams = {};
            config.parameters.filter(p => p.required).map(p => requiredParams[p.name] = '')
            //check if all required params have been supplied 
            let paramCheckRes = paramCheck(requiredParams, queryString.parse(props.location.search))
            console.log(paramCheckRes)
            //add any hidden params to the reportParams (dont want to display these in the querystring)
            if (config) {
                query += query.length === 0 ? '?' : '&' + config.parameters
                    .filter(p => p.hidden)
                    .map(p => `${p.name}=${p.defaultValue}`)
                    .join('&')
            }
    
            if(paramCheckRes){
                setLoading(true); 
                props.fetchSafetyIncidents(match.params.report, `${query}`)
                    .then(res => {
                        setLoading(false); 
                    });
            } else {
                //show alert requiring params
            }
        }
    }

    const handleChange = () => e => {
        // console.log(e.target.value)
        setReportParams({ ...reportParams, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value === '' ? null : e.target.value});
    }

    //for the react-select (single) component
    const handleAutoCompleteChange = (state, action)  => {
        setReportParams({ ...reportParams, [action.name]: state.value });
    }

    //could probably use the handleChange event above, but the below is what I found on from https://material-ui.com/components/pickers/
    const handleDateChange = (paramName, date) => {
        // setSelectedDate(date);
        console.log(moment(date).format('YYYY-MM-DD'))
        setReportParams({ ...reportParams, [paramName]: moment(date).format('YYYY-MM-DD') });
    };

    const reportComponent = () => {

        if(match.params.hasOwnProperty('report')){
            if(loading){
                return (
                    <GeneratingReport />
                )
            } else {
                switch(match.params.report){
                    case 'event':
                        return (
                            <Fragment>
                                {reportData[match.params.report] && reportData[match.params.report].length
                                    ?    
                                        <EventDetailReport
                                            data={reportData[match.params.report]}
                                            lookupData={lookupData}
                                        />
                                    :
                                        <EventDetailForm
                                            config={reportList.find(r => r.url === match.url)}
                                            handleSubmit={handleSubmit}
                                            handleChange={handleChange}
                                            queryStringParams={queryStringParams}
                                            lookupData={lookupData}
                                        />
                                }
                            </Fragment>
                        )
                    case 'safedays':
                        return (
                            <Fragment>
                                {reportData[match.params.report] && reportData[match.params.report].length
                                    ?    
                                        <SafeDaysReport
                                            data={reportData[match.params.report]}
                                            lookupData={lookupData}
                                        />
                                    :
                                        <SafeDaysForm
                                            config={reportList.find(r => r.url === match.url)}
                                            handleSubmit={handleSubmit}
                                            handleChange={handleChange}
                                            handleAutoCompleteChange={handleAutoCompleteChange}
                                            queryStringParams={queryStringParams}
                                            lookupData={lookupData}
                                        />
                                }
                            </Fragment>
                        )
                    case 'openbyhierarchy':
                        // console.log(reportData[match.params.report])
                        return (
                            <Fragment>
                                {reportData[match.params.report] && reportData[match.params.report].length
                                    ?    
                                        <OpenEventsReport
                                            data={reportData[match.params.report]}
                                            lookupData={lookupData}
                                            width={900}
                                            height={600}
                                        />
                                    :
                                        <OpenEventsForm
                                            config={reportList.find(r => r.url === match.url)}
                                            handleSubmit={handleSubmit}
                                            selectedDates={reportParams}
                                            handleDateChange={handleDateChange}
                                            queryStringParams={queryStringParams}
                                            lookupData={lookupData}
                                        />
                                }
                            </Fragment>
                        )
                    case 'injuries':
                        return (
                            <Fragment>
                                {reportData[match.params.report] && reportData[match.params.report].length
                                    ?    
                                        <InjuriesReport
                                            data={reportData[match.params.report]}
                                            lookupData={lookupData}
                                            userParams={props.location.search}
                                        />
                                    :
                                        <InjuriesForm
                                            config={reportList.find(r => r.url === match.url)}
                                            handleSubmit={handleSubmit}
                                            selectedDates={reportParams}
                                            handleDateChange={handleDateChange}
                                            handleAutoCompleteChange={handleAutoCompleteChange}
                                            queryStringParams={queryStringParams}
                                            lookupData={lookupData}
                                        />
                                }
                            </Fragment>
                        )
                    case 'recordables':
                        return (
                            <Fragment>
                                {reportData[match.params.report] && reportData[match.params.report].length
                                    ?    
                                        <RecordablesReport
                                            data={reportData[match.params.report]}
                                            lookupData={lookupData}
                                            userParams={props.location.search}
                                        />
                                    :
                                        <RecordablesForm
                                            config={reportList.find(r => r.url === match.url)}
                                            handleSubmit={handleSubmit}
                                            selectedDates={reportParams}
                                            handleDateChange={handleDateChange}
                                            handleAutoCompleteChange={handleAutoCompleteChange}
                                            queryStringParams={queryStringParams}
                                            lookupData={lookupData}
                                        />
                                }
                            </Fragment>
                        )
                    default:
                        return null
                }
            }
        }
    }

    return (
        <Paper className={classes.paper}>
            {!match.params.hasOwnProperty('report')
                ?
                    <Fragment>
                        <Typography className={classes.header} variant="h4" gutterbottom>
                            Safety Incident Reports
                        </Typography>
                        {reportList.map(r => {
                            return (
                                <Link key={r.name} to={r.url} className={classes.link}>
                                    <Button className={classes.button} variant="contained" color="primary" >
                                        {r.name}
                                    </Button>
                                </Link>
                            )
                        })}
                    </Fragment>
                :
                reportComponent()
            }
        </Paper>
    )
}

function mapStateToProps(state) {
	return {
		reportData: state.reportData, 
		lookupData: state.lookupData,
		currentUser: state.currentUser,
	};
}

export default connect(mapStateToProps, { 
    fetchSafetyIncidents,
    clearData,
})(SIReports);