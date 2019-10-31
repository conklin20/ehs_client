import { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { logout } from '../../store/actions/auth'; 

class Logout extends Component {

  componentWillMount() {
    // console.log(this.props)
    this.props.dispatch(logout())
    this.props.history.push('/')
  }

  render() {
    return null
  }
}
// Logout.propTypes = {
//   dispatch: PropTypes.func.isRequired,
//   router: PropTypes.object.isRequired
// }

export default withRouter(connect()(Logout))