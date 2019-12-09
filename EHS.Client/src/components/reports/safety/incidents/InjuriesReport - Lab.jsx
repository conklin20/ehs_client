import React, { Component, useEffect, useState, useRef, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect } from "react-redux";
import moment from 'moment';
import { Grid, Typography, Button, Select, MenuItem, InputLabel } from '@material-ui/core';
import queryString from 'query-string';
import PrintIcon from '@material-ui/icons/Print'
import ReactToPrint from 'react-to-print';
import * as d3 from 'd3';

const useStyles = makeStyles(theme => ({
    header: {
        marginBottom: theme.spacing(1), 
    },
    reportBody: {
        textAlign: 'left',
    },
    print: {
        float: 'right',
        margin: 0,
    },
    formControl: {
        // margin: theme.spacing(2),
        width: 200,
    },
    svg: {
        width: '100%',
        height: '100%',
    },    
    pathSlice: {
        strokeWidth:'2px',
    },    
    polyline: {
        opacity: .3,
        stroke: 'black',
        strokeWidth: '2px',
        fill: 'none',
    }
}));

// To use the ReactToPrint lib these have to be class based components
// WPO = WithPrintOption
class InjuriesReportWPO extends Component {    
    constructor(props){
        super(props);

        this.state = {
            groupBy: 'area',
            groupByCategories: [
                { name: 'Area', field: 'area' },
                { name: 'Body Part', field: 'bodyPart' },
                { name: 'Department', field: 'department' },
                { name: 'Division', field: 'division' },
                { name: 'Equipment', field: 'equipmentInvolved' },
                { name: 'First Aid Type', field: 'firstAidType' },
                { name: 'Hours Worked', field: 'hoursWorkedPrior' },
                { name: 'Job Title', field: 'jobTitle' },
                { name: 'Material', field: 'materialInvolved' },
                { name: 'Nature of Injury', field: 'natureOfInjury' },
                { name: 'Medical Facility', field: 'offPlantMedicalFacility' },
                { name: 'Shift', field: 'shift' },
                { name: 'Site', field: 'site' },
                { name: 'Work Environment', field: 'workEnvironment' },
            ]
        }
    }

    componentDidMount(){
        this.drawChart(); 
    }

    componentDidUpdate(){
        this.drawChart(); 
    }

    drawChart(){
        
        const { data, classes } = this.props;

        //GROUP data by the selected field
        const groupedByX = d3.nest()
            .key(d => { return d[this.state.groupByCategories.find(g => g.field === this.state.groupBy).field]; })
            // .rollup(function(c) { return c.length; })
            .entries(data)

        console.log(groupedByX)

        let svg = d3.select("#injuriesReportBody")
            .append("svg")
            .append("g")

        svg.append("g")
            .attr("class", "slices");
        svg.append("g")
            .attr("class", "labels");
        svg.append("g")
            .attr("class", "lines");

        var width = 960,
            height = 450,
            radius = Math.min(width, height) / 2;
        
        var pie = d3.pie()
            .sort(null)
            .value(function(d) {
                return d.value;
            });
        
        var arc = d3.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);
        
        var outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);
        
        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
        var key = function(d){ return d.data.label; };

        let color = d3.scaleOrdinal()
            .domain(groupedByX)
            .range(d3.schemeSet3);
        
        change(groupedByX);

        function change(groupedData) {
            const dataObj = groupedData.map(d => {
                return {
                    label: d.key,
                    value: d.values.length
                }
            })
            /* ------- PIE SLICES -------*/
            let slice = svg.select(".slices").selectAll("path.slice")
                .data(pie(dataObj), key);
            console.log(slice)

            slice.enter()
                .insert("path")
                .style("fill", (d) => { return color(d.data.key); })
                .attr("class", classes.pathSlice);

            slice		
                .transition().duration(1000)
                .attrTween("d", (d) => {
                    this._current = this._current || d;
                    let interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return (t) => {
                        console.log(t)
                        return arc(interpolate(t));
                    };
                })

            slice.exit()
                .remove();

            /* ------- TEXT LABELS -------*/

            let text = svg.select(".labels").selectAll("text")
                .data(pie(dataObj), key);

            text.enter()
                .append("text")
                .attr("dy", ".35em")
                .text((d) => {
                    return d.data.label;
                });
            
            function midAngle(d){
                return d.startAngle + (d.endAngle - d.startAngle)/2;
            }

            text.transition().duration(1000)
                .attrTween("transform", function(d) {
                    this._current = this._current || d;
                    let interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        let d2 = interpolate(t);
                        let pos = outerArc.centroid(d2);
                        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                        return "translate("+ pos +")";
                    };
                })
                .styleTween("text-anchor", function(d){
                    this._current = this._current || d;
                    let interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        let d2 = interpolate(t);
                        return midAngle(d2) < Math.PI ? "start":"end";
                    };
                });

            text.exit()
                .remove();

            /* ------- SLICE TO TEXT POLYLINES -------*/

            let polyline = svg.select(".lines").selectAll("polyline")
                .data(pie(dataObj), key);
            
            polyline.enter()
                .append("polyline");

            polyline.transition().duration(1000)
                .attrTween("points", function(d){
                    this._current = this._current || d;
                    let interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        let d2 = interpolate(t);
                        let pos = outerArc.centroid(d2);
                        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return [arc.centroid(d2), outerArc.centroid(d2), pos];
                    };			
                });
            
            polyline.exit()
                .remove();
        };
    }

    render() {
        
        const { classes, userParams } = this.props; 
        console.log(queryString.parse(userParams))
        return (
            <div className={classes.reportBody}>	
                <Typography variant='h5' gutterBottom>
                    {`Injuries by ${this.state.groupByCategories.find(c => c.field == this.state.groupBy).name}`}
                </Typography>   
                <Typography variant='subtitle1'>
                    {`${queryString.parse(userParams).site}: ${queryString.parse(userParams).startDate} through ${queryString.parse(userParams).endDate || moment().format('YYYY-MM-DD')}`}
                </Typography>
                <Typography variant='body1'>                    
                    <InputLabel style={{marginTop: 5}} id='group-by-label'>Group By</InputLabel>                     
                    <Select
                        id='group-by'
                        variant='outlined'
                        className={classes.formControl}
                        labelId='group-by-label'
                        value={this.state.groupBy}
                        onChange={e => this.setState({
                            groupBy: e.target.value
                        })}
                    >
                    {
                        this.state.groupByCategories.map(c => {
                            return (
                                <MenuItem value={c.field} name={c.name}>{c.name}</MenuItem>
                            )
                        })
                    }
                    </Select>
                </Typography>
                <div id={'injuriesReportBody'}></div>  
            </div>
        )
    }
}


const InjuriesReport = props => {
    const classes = useStyles();
    const componentRef = useRef();
    const { data, lookupData, userParams } = props; 

    return (        
        <Fragment>
            <ReactToPrint
                trigger={() => <Button className={classes.print} variant='outlined' color='primary'><PrintIcon fontSize='small'/></Button> }
                content={() => componentRef.current }
            />
            <InjuriesReportWPO 
                ref={componentRef} 
                classes={classes} 
                data={data} 
                lookupData={lookupData} 
                userParams={userParams}
            />
        </Fragment>
    )
}

export default InjuriesReport;