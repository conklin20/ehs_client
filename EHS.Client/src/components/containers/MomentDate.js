import React  from 'react';
import Moment from 'react-moment';
 
export default class MomentDate extends React.Component {
    render() {
        return (
            <Moment format="YYYY/MM/DD">
                props.date
            </Moment>
        );
    }
}