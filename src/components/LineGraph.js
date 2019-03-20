import React from 'react'
import {Bar , Line} from 'react-chartjs-2'

class Chart extends React.Component{
    constructor()
    {
        super();
        this.state = {
            chartdata : {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 0, 3],
                            
                            name: "2016",
                            showInLegend: true,
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)'
                                
                            ],
                            borderWidth: 5
                    },
                    {
                        label: '# of Votes',
                        data: [19, 19, 0, 5, 8, 3],
                        
                        name: "2020",
                        showInLegend: true,
                        borderColor: [
                        
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 5
                }],
        }
        }
    }

    componentWillReceiveProps = (newprops , old) =>
    {
        console.log("newprops", newprops.graph)
        this.setState({
            chartdata : newprops.graph,
            
        })
        
    }

    render(){
        return(
            <Line
                data = {this.state.chartdata}
            />
        );
    }
}

export default Chart;