import React, { Component } from 'react';
import MainGrid from './styles/Maingrid'
import GridContainer from './styles/GridContainer'
import StocksName from './components/StocksName'
import LineGraph from './components/LineGraph'
import Sector from './components/SectorGraph'
import Title from './styles/AppTitle'
import SecondaryButton from './styles/SecondaryButton';

class App extends Component {
  constructor(){
    super()
    this.state = {
      chart : {},
      fullsector : null,
      singlesector : {},
      emptySelectedStocks : []
    }
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
        chart : {},
        singlesector : {},
        emptySelectedStocks : []
    })
  }
  render() {
    
    return (
      <div>
        <Title />
        <GridContainer>
          <MainGrid xs={12}>
            <StocksName sectordata = {this.getSectorData} renderchart = {this.renderChart} getRandomColor={this.getRandomColor} clearstocks={this.state.emptySelectedStocks}/>
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
      </div>
    );
  }
}

export default App;
