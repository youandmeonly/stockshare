import React from 'react'
import PrimaryButton from '../styles/PrimaryButton'
import TextFieldBox from '../styles/TextFieldBox'
import SecondaryButton from '../styles/SecondaryButton'
import XLSX from 'xlsx'
import MainGrid from '../styles/Maingrid'
import GridContainer from '../styles/GridContainer'
import SelectStocks from '../styles/SelectStocks'

class StocksName extends React.Component{
    constructor()
    {
        super();
        this.graphdata = {
            labels : [],
            datasets : []
        }
        this.stocksarray =[]
        this.state = {
            stocksdata : [],
            // graphdata : null,
            currenttimeseries : '',
        }
        this.realtime = 'Real-Time'
        this.day5 = '5 Day'
        this.month1 = '1 Month'
        this.ytd = 'YTD'
    }
    
    changeFile = (event) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(event.target.files[0]);
        console.log("file",event.target.files[0])
        reader.onload = (instance) => function(instance){
            var data = new Uint8Array(reader.result);
            var wb = XLSX.read(data,{type:'array'})
            const ws = wb.Sheets['Sheet1'];
            const data = XLSX.utils.sheet_to_json(ws, {raw:true});
            console.log('excel',data)
            instance.setState({
                stocksdata : data,
            })
        }(this)
    }


    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      timeseriesapi = (selectedvalue) =>{
        let api = ''
        let symbol = selectedvalue
        if(this.state.currenttimeseries == this.realtime)
        {
            api = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+symbol+"&interval=5min&outputsize=full&apikey=HCINAQ4TW2SBN2Y8"
        }
        else
        {
            api = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+symbol+"&outputsize=full&apikey=HCINAQ4TW2SBN2Y8"
        }
        fetch(api)
          .then(res => res.json())
          .then(
            (result) => {
            
                let timeseriesobj = result[Object.keys(result).find(series=>series.includes('Time'))]
                console.log(timeseriesobj)
                this.graphdata.labels = Object.keys(timeseriesobj).sort()
                
                let yaxisdata = []
                for(let key in timeseriesobj)
                {
                    yaxisdata.push(timeseriesobj[key]['4. close'])
                }
                let yaxis = {data : yaxisdata , label : symbol , name : symbol , borderColor : this.getRandomColor() , borderWidth : 3}
                console.log('y axis', yaxis)
                this.stocksarray.push(yaxis)
                this.graphdata.datasets = this.stocksarray
                
                this.props.renderchart(this.graphdata)
            },
            
            (error) => {
                console.log("err")
              
            }
          )
      }

    rendertimeseriesgraph = (selectedvalues) =>{
        console.log('selectd vals : ',selectedvalues)
        this.stocksarray = []
        for(let i=0;i<selectedvalues.length;i++)
        {
            this.timeseriesapi(selectedvalues[i].value)
        }
    }

    apiCall = (timeseries) =>
    {
        
        if(timeseries != this.state.currenttimeseries){
            {this.props.sectordata(timeseries)}
            this.setState({
                currenttimeseries : timeseries
            })
        }
    }

    render(){
        return(
            <div>
                <input type='file' id='file' onChange={this.changeFile}/>
                <GridContainer>
                    <MainGrid xs={3} elevation={0}>
                        <PrimaryButton onChange={this.changeFile}>Upload File</PrimaryButton>
                    </MainGrid>
                    <MainGrid xs={6} elevation={0}>
                        <SelectStocks stocksdata = {this.state.stocksdata} rendertimeseriesgraph = {this.rendertimeseriesgraph} />
                    </MainGrid>
                </GridContainer>

                <GridContainer>
                    <MainGrid xs={3} elevation={0}>
                        <SecondaryButton onClick={()=>this.apiCall(this.realtime)}>{this.realtime}</SecondaryButton>          
                    </MainGrid>
                    <MainGrid xs={3} elevation={0}>
                        <SecondaryButton onClick={()=>this.apiCall(this.day5)}>{this.day5}</SecondaryButton>          
                    </MainGrid>
                    <MainGrid xs={3} elevation={0}>
                        <SecondaryButton onClick={()=>this.apiCall(this.month1)}>{this.month1}</SecondaryButton>          
                    </MainGrid>
                    <MainGrid xs={3} elevation={0}>
                        <SecondaryButton onClick={()=>this.apiCall(this.ytd)}>{this.ytd}</SecondaryButton>          
                    </MainGrid>
                </GridContainer>
            </div>
        );
    }
}

export default StocksName;