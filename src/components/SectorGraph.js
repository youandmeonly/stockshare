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
        if(newprops.sectorChanged)
        {
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
    }

    render(){
        return(
            <Bar
                data = {this.state.chartdata}
            />
        );
    }
}

export default Chart;