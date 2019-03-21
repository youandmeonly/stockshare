import React from 'react'
import PrimaryButton from '../styles/PrimaryButton'
import SecondaryButton from '../styles/SecondaryButton'
import XLSX from 'xlsx'
import MainGrid from '../styles/Maingrid'
import GridContainer from '../styles/GridContainer'
import SelectStocks from '../styles/SelectStocks'
import FadeError from '../styles/FadeError'

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
            stocksdata: [],
            currenttimeseries: '',
            selectedStocks: [],
            stockslimit: false,
        }
        this.realtime = 'Real-Time'
        this.day5 = '5 Day'
        this.month1 = '1 Month'
        this.ytd = 'YTD'
    }

    changeFile = (event) => {
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
        }(this)
    }

    changeRangeOfApiData = () =>{
        
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

        this.props.renderchart(this.graphdata)
    }

    timeseriesapi = (selectedvalue) => {
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
        fetch(api)
            .then(res => res.json())
            .then(
                (result) => {

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
                    let yaxis = { data: yaxisdata, label: symbol, name: symbol, borderColor: this.props.getRandomColor(), borderWidth: 1,}
                    this.stocksarray.push(yaxis)
                    this.graphdata.datasets = this.stocksarray

                    this.props.renderchart(this.graphdata)
                },
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
                this.props.renderchart({})
            }
            
        }
    }

    apiCall = (timeseries) => {
        if (timeseries !== this.state.currenttimeseries) 
        {
            this.props.sectordata(timeseries)
            this.setState({
                currenttimeseries: timeseries
            }, ()=> {
                if(!this.apiType.includes(timeseries) || this.apiType === ''){
                    this.rendertimeseriesgraph(this.state.selectedStocks)
                }
                else{
                    this.changeRangeOfApiData()
                }
            })
        }
        else if(this.apiType === ''){
            this.rendertimeseriesgraph(this.state.selectedStocks)
        }
        
    }

    limitexceeded = (value) =>{
        this.setState({
            stockslimit : value
        })
    }

    componentWillReceiveProps(newprops)
    {
        debugger
        this.setState({
            // selectedStocks : []
        })
    }
    render() {
        console.log("in render", this.state.currenttimeseries)
        return (
            <div>
                <GridContainer>
                    <MainGrid xs={3} elevation={0}>
                        <PrimaryButton onChange={this.changeFile}>Upload File</PrimaryButton>
                    </MainGrid>
                    <MainGrid xs={6} elevation={0}>
                        <SelectStocks stocksdata={this.state.stocksdata} rendertimeseriesgraph={this.rendertimeseriesgraph} limitexceeded = {(bool)=>this.limitexceeded(bool)} clearselectedstocks={this.state.selectedStocks}/>
                    </MainGrid>
                    <MainGrid xs={3} elevation={0}>
                        <FadeError error = {this.state.stockslimit}/>
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
                </GridContainer>
            </div>
        );
    }
}

export default StocksName;