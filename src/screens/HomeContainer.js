import { connect } from 'react-redux'
import Home from './Home'

const mapStateToProps = state => {
  return {
    // any state for the home screen
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // any dispatch actions for the home screen
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)