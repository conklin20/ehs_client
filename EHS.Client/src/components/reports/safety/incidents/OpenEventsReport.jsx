import React, { Component, useEffect, useState, useRef, Fragment } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import moment from 'moment';
import { Grid, Typography, Button } from '@material-ui/core';
import { ATTR_CATS } from '../../../../helpers/attributeCategoryEnum';
import filterLookupDataByKey  from '../../../../helpers/filterLookupDataByKey';
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
    body: {
      margin: '15px',
      backgroundColor: '#F1F3F3',  
    },
    bar: {
        fill: '#6F257F',
    },
    print: {
        float: 'right',
        margin: 0,
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
class OpenEventsReportWPO extends Component {    
    constructor(props){
        super(props);
    }
    
    componentDidMount(){
        this.drawChart(); 
    }

    drawChart(){
        
        const { data, lookupData, classes, width, height, divElement } = this.props;
        
        //GROUP by hierarchy (department in this case), and SORT descending
        const groupedByHierarchy = d3.nest()
            .key(function(d) { return d.department; })
            // .rollup(function(c) { return c.length; })
            .entries(data)
            .sort((a, z) => d3.descending(a.values.length, z.values.length))
        // console.log(groupedByHierarchy)

        const keyCount = Object.keys(groupedByHierarchy).length;
        const 
            w = width, 
            h = height, 
            max = d3.max(groupedByHierarchy, d => d.values.length), 
            xPad = 5,
            yPad = 5
            
        // Define the div for the tooltip    
        var tooltip = d3.select(`#${divElement ? divElement : 'openEventsReportBody'}`)
            .append("div")	
            .attr('class', classes.tooltip)	

        const svg = d3.select(`#${divElement ? divElement : 'openEventsReportBody'}`)
            .append('svg')
            .attr('width', w)
            .attr('height', h)
        
        svg.selectAll('rect')
            .data(groupedByHierarchy)
            .enter()
            .append('rect')
            .attr('y', (d, i) => (i * (h / keyCount)))
            .attr('x', xPad)
            .attr('height', (d, i) => (h / keyCount) * .90)
            .attr('width', (d, i) => (d.values.length / max) * (w * .95))
            .attr('fill', '#2c3e50')
            .attr('rx', 5)
            .attr('ry', 5)	
            .on("mouseover", (d) => { return tooltip.style("visibility", "visible")
                    .html(() => {
                        return (
                            `<h3>${d.key}</h3>
                            <ul>
                            ${d.values.map(e => {
                                return `<li>${e.eventId} - ${moment(e.eventDate).format('ll')} - ${e.resultingCategory || e.initialCategory}</li>`
                            }).join('')}
                            <ul>`
                        )
                    })
                })
            .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");});        

        svg.selectAll('text')
            .data(groupedByHierarchy)
            .enter()
            .append('text')
            .text((d) => `${d.key} - ${d.values.length}`)
            .attr('y', (d, i) => (i * (h / keyCount)) + (h / keyCount) * .5)
            .attr('x', xPad + 5)
            .attr('fill', (d, i) => d.values.length > 0 ? '#95a5a6' : '#2c3e50')
            .attr('font-size', `1em` )
            .attr('font-weight', 'bold')
    }

    render() { 
        
        const { classes, divElement } = this.props;

        return (
            <div className={classes.reportBody}>	
                <Typography variant='h5' gutterBottom>
                    Open Events by Hierarchy
                </Typography>
                {
                    !divElement
                        ? <div id={'openEventsReportBody'}></div>
                        : null
                }                
            </div>
        )
    }
}

const OpenEventsReport = props => {
    const classes = useStyles();
    const componentRef = useRef();
    const { data, lookupData, width, height, divElement } = props; 

    return (        
        <Fragment>
            <ReactToPrint
                trigger={() => <Button className={classes.print} variant='outlined' color='primary'><PrintIcon fontSize='small'/></Button> }
                content={() => componentRef.current }
            />
            <OpenEventsReportWPO 
                ref={componentRef} 
                classes={classes} 
                data={data} 
                lookupData={lookupData} 
                width={width} 
                height={height} 
                divElement={divElement} 
            />
        </Fragment>
    )
}

export default OpenEventsReport;