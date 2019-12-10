import React, { Component, useEffect, useState, useRef, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect } from "react-redux";
import moment from 'moment';
import { Grid, Typography, Button, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core';
import { ATTR_CATS } from '../../../../helpers/attributeCategoryEnum';
import filterLookupDataByKey  from '../../../../helpers/filterLookupDataByKey';
import PrintIcon from '@material-ui/icons/Print'
import ReactToPrint from 'react-to-print';
import queryString from 'query-string';
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
        marginRight: theme.spacing(2),
        width: 200,
    },
    tooltip: {	
        position: 'absolute',	
        zIndex: 10,	
        visibility: 'hidden',	
        backgroundColor: theme.palette.primary.light,
        padding: theme.spacing(1),
        borderRadius: '8px',	
    },
}));

// To use the ReactToPrint lib these have to be class based components
// WPO = WithPrintOption
class RecordablesReportWPO extends Component {    
    constructor(props){
        super(props);
        
        this.state = {
            groupBy: 'area',
            showTable: false, 
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

        let width = 900,
            height = 600,
            margin = 40
        
        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        let radius = Math.min(width, height) / 2 - margin
        
        d3.select("#recordablesReportBody").selectAll("svg").remove();

        // append the svg object to the div called 'reportBody'
        let svg = d3.select("#recordablesReportBody")
            .append("svg")
                .attr("width", width)
                .attr("height", height)
            .append("g")
                .attr("transform", "translate(" + (width - 300) / 2 + "," + height / 2 + ")");

        // set the color scale
        let color = d3.scaleSequential(d3.interpolateBlues);

        // Compute the position of each group on the pie:
        let pie = d3.pie()
            .value(d => {return d.value.values.length; })
            .sort(null) // This make sure that group order remains the same in the pie chart
        
        // Define the div for the tooltip    
        var tooltip = d3.select('#recordablesReportBody')
            .append("div")	
            .attr('class', classes.tooltip)	

        let dataReady = pie(d3.entries(groupedByX)) 

	    /* ------- PIE CHART -------*/
        let path = svg.selectAll("path")
            .data(dataReady)        
            .enter()
            .append('path')
            // .merge(path)
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
            )
            .attr('fill', (d,i) => { 
                // console.log((i+1)/dataReady.length)
                return(color((i+1)/dataReady.length)) 
            })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 1)
        
        path
            .transition()
            .duration(1000)

        path
            .on("mouseover", (d) => { return tooltip.style("visibility", "visible")
                    .html(() => {
                        return (
                            `<h3>${d.data.value.key}</h3>
                             <div>${d.data.value.values.length} Recordables</div>
                            `
                        )
                    })
                })
            .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");}); 
           
        // remove the group that is not present anymore
        path
            .exit()
            .remove()


        /* ------- LEGEND -------*/
        let l = svg.selectAll("svg")
            .data(dataReady)

        l
            .enter()
            .append("circle")
                .attr("cx", 300)
                .attr("cy", (d,i) => { return -250 + i*25}) // -250 being the starting point  25 is the distance between dots
                .attr("r", 7)
                .style("fill", (d, i) => { return(color((i+1)/dataReady.length)) })                
        l
            .enter()
            .append('text')
                .text((d) => `${d.data.value.key} - ${d.value}`)
                .attr('x', 315)
                .attr('y', (d,i) => { return -245 + i*25})
                .attr('font-size', `1em` )
                // .attr('font-weight', 'bold')
        
        // remove the group that is not present anymore
        l
            .exit()
            .remove()   


        /* ------- TABLE -------*/
        if(this.state.showTable){
            let ƒ =  function(field){
                return function(object){
                    return object[field]
                }
            }
            
            let columns = [
                { 
                    head: this.state.groupByCategories.find(c => c.field === this.state.groupBy).name, 
                    cl: this.state.groupBy, 
                    html: ƒ(this.state.groupBy)
                },
                { head: 'Event#', cl: 'eventId', html: ƒ('eventId') }
            ]

            let t = svg.selectAll("svg")
                .append("table")
            
            t.append('thead').append('tr')
                .selectAll('th')
                .data(columns).enter()
                .append('th')
                .attr('class', ƒ('cl'))
                .text(ƒ('head'));

                
            // create table body
            t.append('tbody')
                .selectAll('tr')
                .data(dataReady)
                .enter()
                .append('tr')
                .selectAll('td')
                .data(function(row, i) {
                    console.log(row)
                    return columns.map(function(c) {
                        // compute cell values for this specific row
                        var cell = {};
                        d3.keys(c).forEach(function(k) {
                            cell[k] = typeof c[k] == 'function' ? c[k](row,i) : c[k];
                        });
                        console.log(cell)
                        return cell;
                    });
                }).enter()
                    .append('td')
                    .html(ƒ('html'))
                    .attr('class', ƒ('cl'));
            
            // remove the group that is not present anymore
            t
                .exit()
                .remove()   
            
        }
    }

    render() {
        
        const { classes, userParams } = this.props; 

        return (
            <div className={classes.reportBody}>	
                <Typography variant='h5' gutterBottom>
                    {`Recordable Detail`}
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
                    {/* <FormControlLabel
                        control={
                        <Checkbox
                            checked={this.state.showTable}
                            onChange={e => this.setState({
                                showTable: e.target.checked
                            })}
                            value={this.state.showTable}
                            color="primary"
                        />
                        }
                        label="Show Table"
                        className={classes.formControl}
                    /> */}
                </Typography>
                <div id={'recordablesReportBody'}></div>  
            </div>
        )
    }
}


const RecordablesReport = props => {
    const classes = useStyles();
    const componentRef = useRef();
    const { data, lookupData, userParams } = props; 

    return (        
        <Fragment>
            <ReactToPrint
                trigger={() => <Button className={classes.print} variant='outlined' color='primary'><PrintIcon fontSize='small'/></Button> }
                content={() => componentRef.current }
            />
            <RecordablesReportWPO 
                ref={componentRef} 
                classes={classes} 
                data={data} 
                lookupData={lookupData} 
                userParams={userParams}
            />
        </Fragment>
    )
}

export default RecordablesReport;