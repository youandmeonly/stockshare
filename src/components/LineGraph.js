import React from 'react'
import {Bar , Line} from 'react-chartjs-2'

class Chart extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            chartdata : props.graph
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