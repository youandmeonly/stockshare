import React, { Component } from 'react';
import MainGrid from './styles/Maingrid'
import GridContainer from './styles/GridContainer'
import StocksName from './components/StocksName'
import LineGraph from './components/LineGraph'
import Sector from './components/SectorGraph'
import Title from './styles/AppTitle'
import SecondaryButton from './styles/SecondaryButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';

class App extends Component {
  constructor(){
    super()
    this.state = {
      chart : {},
      fullsector : null,
      singlesector : {},
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

  renderChart = (data) =>
  {
    this.setState({
      chart : data,
    })
  }
  getSectorData = (sectorname) =>{
    const sectorkeys = Object.keys(this.state.fullsector)
    const sectorrank = sectorkeys.find(key => key.includes(sectorname))
    this.setState(() => {
      return {
        singlesector : this.state.fullsector[sectorrank]
    }})
  }
  
  getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }

  componentDidMount = () => {
    fetch("https://www.alphavantage.co/query?function=SECTOR&apikey=demo")
      .then(res => res.json())
      .then(
        (result) => {
            this.setState({
                fullsector : result
            })
        }
      )
  }

  clearAll = () =>{
    this.setState({
        chart : {
          labels : []
        },
        singlesector : {},
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
          <MainGrid xs={12}>
            <StocksName backToNormalState={this.backToNormalState} sectordata = {this.getSectorData} renderchart = {this.renderChart} getRandomColor={this.getRandomColor} clearstocks={this.state.emptySelectedStocks} showLoading={this.showLoading} hideLoading={this.hideLoading} showSnackBar={this.showSnackBar} />
          </MainGrid>
          <MainGrid xs={6}>
            <LineGraph graph = {this.state.chart}  />
          </MainGrid>
          <MainGrid xs={6}>
            <Sector sector={this.state.singlesector} getRandomColor={this.getRandomColor}/>
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
