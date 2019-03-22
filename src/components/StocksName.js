import React from 'react'
import PrimaryButton from '../styles/PrimaryButton'
import SecondaryButton from '../styles/SecondaryButton'
import XLSX from 'xlsx'
import MainGrid from '../styles/Maingrid'
import GridContainer from '../styles/GridContainer'
import SelectStocks from '../styles/SelectStocks'
import Sector from './SectorGraph'
import LineGraph from './LineGraph'

class StocksName extends React.Component {
    constructor() {
        super();
        this.graphdata = {
            labels: [],
            datasets: []
        }
        this.stocksarray = []
        this.apiType = ''
        this.totaldays = 0
        this.xaxisLabels = []
        this.state = {
            chart : {},
            fullsector : null,
            singlesector : {},
            stocksdata: [],
            currenttimeseries: '',
            selectedStocks: [],
            stockslimit: false,
            sectorChanged: false,
        }
        this.realtime = 'Real-Time'
        this.day5 = '5 Day'
        this.month1 = '1 Month'
        this.ytd = 'YTD'
    }

    changeFile = (event) => {
        const {showLoading, hideLoading} = this.props;
        showLoading()
        const reader = new FileReader();
        reader.readAsArrayBuffer(event.target.files[0]);
        reader.onload = (instance) => function (instance) {
            var data = new Uint8Array(reader.result);
            var wb = XLSX.read(data, { type: 'array' })
            const ws = wb.Sheets['Sheet1'];
            const data = XLSX.utils.sheet_to_json(ws, { raw: true });
            instance.setState({
                stocksdata: data,
            })
            hideLoading()
        }(this)
    }
    renderChart = (data) =>
    {
        this.setState({
            chart : data,
        })
    }
    changeRangeOfApiData = () =>{
        if(this.state.selectedStocks.length !== 0)
        {
            if (this.state.currenttimeseries === this.month1) {
                this.graphdata.labels = this.xaxisLabels.slice(this.totaldays - 30, this.totaldays)
            }
            else if (this.state.currenttimeseries === this.day5) {
                this.graphdata.labels = this.xaxisLabels.slice(this.totaldays - 5, this.totaldays)
            }
            else if (this.state.currenttimeseries === this.ytd) {
                let currentyear = new Date().getFullYear()
                this.graphdata.labels = this.xaxisLabels.filter(i => i.includes(currentyear))
            }
            this.renderChart(this.graphdata)
        }
    }

    timeseriesapi = (selectedvalue) => {
        const {showLoading, hideLoading, showSnackBar} = this.props;
        let api = ''
        let symbol = selectedvalue
        if (this.state.currenttimeseries === this.realtime) {
            api = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + symbol + "&interval=5min&outputsize=full&apikey=HCINAQ4TW2SBN2Y8"
            this.apiType = 'Real-Time'
        }
        else {
            api = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&outputsize=full&apikey=HCINAQ4TW2SBN2Y8"
            this.apiType = '5 Day,1 Month,YTD'
        }
        showLoading()
        fetch(api)
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.hasOwnProperty('Notes') || result.hasOwnProperty('Note')) {
                        showSnackBar('You have reached Maximum requests count')
                        hideLoading()
                        return
                    }
                    let timeseriesobj = result[Object.keys(result).find(series => series.includes('Time'))]
                    this.graphdata.labels = Object.keys(timeseriesobj).sort()
                    this.totaldays = this.graphdata.labels.length
                    this.xaxisLabels = this.graphdata.labels
                    if (this.state.currenttimeseries === this.month1) {
                        this.graphdata.labels = this.graphdata.labels.slice(this.totaldays - 30, this.totaldays)
                    }
                    else if (this.state.currenttimeseries === this.day5) {
                        this.graphdata.labels = this.graphdata.labels.slice(this.totaldays - 5, this.totaldays)
                    }
                    else if (this.state.currenttimeseries === this.ytd) {
                        let currentyear = new Date().getFullYear()
                        this.graphdata.labels = this.graphdata.labels.filter(i => i.includes(currentyear))
                    }

                    let yaxisdata = []
                    for (let key in timeseriesobj) {
                        yaxisdata.push(timeseriesobj[key]['4. close'])
                    }
                    let yaxis = { data: yaxisdata, label: symbol, name: symbol, borderColor: this.getRandomColor(), borderWidth: 1,}
                    this.stocksarray.push(yaxis)
                    this.graphdata.datasets = this.stocksarray
                    this.renderChart(this.graphdata)
                    hideLoading()
                },
                (error) => {
                    hideLoading()
                }

            )
    }

    rendertimeseriesgraph = (selectedvalues) => {
        this.setState({
            selectedStocks : selectedvalues
        })
        if (this.state.currenttimeseries !== '') {
            this.stocksarray = []
            for (let i = 0; i < selectedvalues.length; i++) {
                this.timeseriesapi(selectedvalues[i].value)
            }
            if(selectedvalues.length === 0)
            {
                this.renderChart({labels:[]})
            }
            
        }
    }
    renderonlytimseriesgraph = (selectedvalues)=>{
        this.rendertimeseriesgraph(selectedvalues)
        this.setState({
            sectorChanged: false
        })
    }
    apiCall = (timeseries) => {
        if (timeseries !== this.state.currenttimeseries) 
        {
            this.getSectorData(timeseries)
            this.setState({
                currenttimeseries: timeseries,
                sectorChanged : true
            }, ()=> {
                if(!this.apiType.includes(timeseries) || this.apiType === ''){
                    this.rendertimeseriesgraph(this.state.selectedStocks)
                }
                else{
                    this.changeRangeOfApiData()
                }
            })
        }
        // else if(this.apiType === ''){
        //     this.rendertimeseriesgraph(this.state.selectedStocks)
        //     this.setState({
        //         sectorChanged : false
        //     })
        // }
        
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
    componentWillReceiveProps(newprops)
    {
        if(newprops.clearstocks){
            this.setState({
                selectedStocks : [],
                chart : {
                    labels : []
                  },
                singlesector : {},
                currenttimeseries : ''
            })
            this.apiType = ''
            this.props.backToNormalState()
        }
    }
    render() {
        return (
            <div>
                <GridContainer>
                    <MainGrid xs={3} elevation={0}>
                        <PrimaryButton onChange={this.changeFile}>Upload File</PrimaryButton>
                    </MainGrid>
                    <MainGrid xs={6} elevation={0}>
                        <SelectStocks showSnackBar={this.props.showSnackBar} stocksdata={this.state.stocksdata} renderonlytimseriesgraph={this.renderonlytimseriesgraph}  clearselectedstocks={this.state.selectedStocks} multivalues={this.state.selectedStocks}/>
                    </MainGrid>
                </GridContainer>

                <GridContainer>
                    <MainGrid xs={3} elevation={0}>
                        <SecondaryButton onClick={() => this.apiCall(this.realtime)}>{this.realtime}</SecondaryButton>
                    </MainGrid>
                    <MainGrid xs={3} elevation={0}>
                        <SecondaryButton onClick={() => this.apiCall(this.day5)}>{this.day5}</SecondaryButton>
                    </MainGrid>
                    <MainGrid xs={3} elevation={0}>
                        <SecondaryButton onClick={() => this.apiCall(this.month1)}>{this.month1}</SecondaryButton>
                    </MainGrid>
                    <MainGrid xs={3} elevation={0}>
                        <SecondaryButton onClick={() => this.apiCall(this.ytd)}>{this.ytd}</SecondaryButton>
                    </MainGrid>

                    <MainGrid xs={6}>
                        <LineGraph graph = {this.state.chart}  />
                    </MainGrid>
                    <MainGrid xs={6}>
                        <Sector sector={this.state.singlesector} getRandomColor={this.getRandomColor} sectorChanged={this.state.sectorChanged}/>
                    </MainGrid>
                </GridContainer>

            </div>
        );
    }
}

export default StocksName;