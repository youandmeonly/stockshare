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
                    // backgroundColor: [
                    //     'rgba(255, 99, 132, 0.2)',
                    //     'rgba(54, 162, 235, 0.2)',
                    //     'rgba(255, 206, 86, 0.2)',
                    //     'rgba(75, 192, 192, 0.2)',
                    //     'rgba(153, 102, 255, 0.2)',
                    //     'rgba(255, 159, 64, 0.2)'
                    // ],
                    // borderColor: [
                    //     'rgba(255, 99, 132, 1)',
                    //     'rgba(54, 162, 235, 1)',
                    //     'rgba(255, 206, 86, 1)',
                    //     'rgba(75, 192, 192, 1)',
                    //     'rgba(153, 102, 255, 1)',
                    //     'rgba(255, 159, 64, 1)',
                    //     '#009688',
                    //     '#9c27b0',
                    //     '#1D298C'
                    // ],
                    borderWidth: 2
            }],
        }
        }
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
      

    componentWillReceiveProps(newprops,oldprops){
        console.log('changed sectr data : ',newprops)
        const bordercolor = []
        const bgcolor = []
        const hvcolor = []
        for(let i=0; i<Object.keys(newprops.sector).length ;i++){
            bordercolor.push(this.getRandomColor())
            bgcolor.push(this.getRandomColor())
            hvcolor.push(this.getRandomColor())
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