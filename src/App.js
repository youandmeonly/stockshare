import React, { Component } from 'react';
import MainGrid from './styles/Maingrid'
import GridContainer from './styles/GridContainer'
import StocksName from './components/StocksName'
import FetchApi from './components/FetchApi'
import LineGraph from './components/LineGraph'
import Sector from './components/SectorGraph'

class App extends Component {
  constructor(){
    super()
    this.state = {
      chart : {},
      fullsector : null,
      singlesector : {},
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
      console.log('this.state.fullsector[sectorrank]', this.state.fullsector[sectorrank])
      return {
        singlesector : this.state.fullsector[sectorrank]
    }})
    
  }
  
  componentDidMount = () => {
    fetch("https://www.alphavantage.co/query?function=SECTOR&apikey=demo")
      .then(res => res.json())
      .then(
        (result) => {
          console.log('sectrdata api : ',result)
          
            this.setState({
                fullsector : result
            })
        },
        (error) => {
            console.log("err")
          
        }
      )
}

  render() {
    console.log('sectrdata state : ',this.state.fullsector)
    console.log("graph",this.state.chart)
    console.log("state.sector", this.state.singlesector)
    return (
      <div>
        <GridContainer>
          <MainGrid xs={12}>
            <StocksName sectordata = {this.getSectorData} renderchart = {this.renderChart}/>
          </MainGrid>
          <MainGrid xs={12}>
            <LineGraph graph = {this.state.chart} />
          </MainGrid>
          <MainGrid xs={12}>
            <Sector sector={this.state.singlesector} />
          </MainGrid>
          {/* <MainGrid>
            <FetchApi renderchart = {this.renderChart}/>
          </MainGrid> */}
        </GridContainer>
        
      </div>
    );
  }
}

export default App;
