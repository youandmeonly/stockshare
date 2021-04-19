import React, { Component } from 'react';
import MainGrid from './styles/Maingrid'
import GridContainer from './styles/GridContainer'
import StocksName from './components/StocksName'
import Title from './styles/AppTitle'
import SecondaryButton from './styles/SecondaryButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';

class App extends Component {
  constructor(){
    super()
    this.state = {
      emptySelectedStocks: false,
      loading: false,
      snackbar: false,
      snackBarMessage: ''
    }
  }
  showSnackBar = (message) => {
    this.setState({
      snackbar: true,
      snackBarMessage: message
    })
  }

  closeSnackBar = () => {
    this.setState({
      snackbar: false
    })
  }

  showLoading = () => {
    this.setState({
      loading: true
    })
  }

  hideLoading = () => {
    this.setState({
      loading: false
    })
  }

  clearAll = () =>{
    this.setState({
        emptySelectedStocks : true
    })
  }

  backToNormalState = () => {
    this.setState({
      emptySelectedStocks: false
    })
  }

  render() {
    return (
      <div>
        <Title />
        <GridContainer>
          <MainGrid xs={12} elevation={0}>
            <StocksName backToNormalState={this.backToNormalState}  clearstocks={this.state.emptySelectedStocks} showLoading={this.showLoading} hideLoading={this.hideLoading} showSnackBar={this.showSnackBar} />
          </MainGrid>
          
          <MainGrid xs={12}>
            <SecondaryButton onClick={this.clearAll}>Clear All</SecondaryButton>
          </MainGrid>
        </GridContainer>
        {
          this.state.loading && (
            <div style={{
              position: 'fixed',
              backgroundColor: 'black',
              zIndex: 10, left: '0%',
              top: '0%',
              width: '-webkit-fill-available',
              height: '-webkit-fill-available',
              opacity: 0.5
            }}>
              <CircularProgress style={{ position: 'fixed', left: '50%', top: '50%', zIndex: 100, color: 'white' }} />
            </div>
          )
        }
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={this.state.snackbar}
          autoHideDuration={6000}
          onClose={this.closeSnackBar}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.snackBarMessage}</span>}
        />

      </div>
    );
  }
}

export default App;
