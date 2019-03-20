import React from 'react'
import SecondaryButton from '../styles/SecondaryButton'

class FetchApi extends React.Component{
    constructor(props)
    {
        super(props)
        this.state ={
            graphdata : null
        }
    }
    apiCall = () =>
    {
        fetch("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=ABT&outputsize=full&apikey=HCINAQ4TW2SBN2Y8")
          .then(res => res.json())
          .then(
            (result) => {
                console.log("api",result)
                console.log("keys",Object.keys(result))
                console.log("time",result[Object.keys(result)[1]])
                this.setState({
                    graphdata : result
                })
                
                this.props.renderchart(result)
            },
            
            (error) => {
                console.log("err")
              
            }
          )
    }
    render()
    {
        return(
            <div>
                <SecondaryButton onClick={this.apiCall}>Time Series</SecondaryButton>
            </div>
        );
    }
}

export default FetchApi;