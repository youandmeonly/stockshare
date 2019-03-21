import React from 'react'
import {Bar} from 'react-chartjs-2'

class Chart extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            chartdata : {
                labels: Object.keys(props.sector),
                datasets: [{
                    data: Object.values(props.sector),
                    label: 'Sector Graph',
                    borderWidth: 2,
                    hoverBorderWidth: 3,
            }],
        }
        }
    }

    componentWillReceiveProps(newprops,oldprops){
        console.log('changed sectr data : ',newprops)
        const bordercolor = []
        const bgcolor = []
        const hvcolor = []
        for(let i=0; i<Object.keys(newprops.sector).length ;i++){
            bordercolor.push(this.props.getRandomColor())
            bgcolor.push(this.props.getRandomColor())
            hvcolor.push(this.props.getRandomColor())
        }
            
        this.setState(prevState => ({
            chartdata: {
                ...prevState.chartdata,
                labels: Object.keys(newprops.sector),
                datasets: [{
                    ...prevState.chartdata.datasets[0],
                    data: Object.values(newprops.sector).map(e => e.replace('%','')),
                    backgroundColor: bgcolor,
                    borderColor: bordercolor,
                    hoverBackgroundColor: hvcolor,
                }]
            }
        }))
    }

    // componentWillMount = () =>
    // {
    //     if(Object.keys(this.state.sectordata) == 0)
    //     {
    //         console.log('fffffffff')
    //         return false
    //     }
    //     else{
    //         return true
    //     }
    // }
    render(){
        console.log("data", this.state.chartdata)
        return(
            <Bar
                data = {this.state.chartdata}
            />
        );
    }
}

export default Chart;