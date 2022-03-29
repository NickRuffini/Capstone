import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class Weka extends Component {
    state = {
        isLoading: true,
        wekaInfo: [],
        classifierSelected: 'RandomForest',
        criteriaSelected: 'GDP'
    }

    // Initial API call when the component loads up for first time, gets Weka initial info
    async componentDidMount() {
        Promise.all([fetch('/api/weka/GDP')])

        .then(([res1]) => { 
            return Promise.all([res1.json()]) 
        })
        .then(([res1]) => {
            this.setState({wekaInfo :res1, isLoading: false});
            console.log(this.state.wekaInfo[0])
        });
    }  

    render() {
        const sortingCriteria = ['GDP', 'Total Deaths Per Million'];
        const sortingClassifiers = ['RandomForest'];

        const {isLoading, classifierSelected, criteriaSelected, wekaInfo} = this.state;

        // Formats the WEKA info so we can display it in the HTML
        function NewlineText(props) {
            const text = props.text;
            /*let textSplit = text.split(/[\s,]+/);
            console.log(textSplit);
            const newText = [];
    
            newText.push('Weka ' + textSplit[1]);
            newText.push('' + textSplit[2] + ' ' + textSplit[3] + ': ' + textSplit[4])
            newText.push('' + textSplit[5] + ' ' + textSplit[6] + ' ' + textSplit[7] + ': ' + textSplit[8])
            newText.push('' + textSplit[9] + ' ' + textSplit[10] + ' ' + textSplit[11] + ' '+ textSplit[12] + ': ' + textSplit[13])
            newText.push('' + textSplit[14] + ' ' + textSplit[15] + ' ' + textSplit[16] + ': ' + textSplit[17] + textSplit[18])
            newText.push('' + textSplit[19] + ' ' + textSplit[20] + ' ' + textSplit[21] + ' ' + textSplit[22] + ': ' + textSplit[23] + textSplit[24])
            newText.push('' + textSplit[25] + ' ' + textSplit[26] + ' ' + textSplit[27] + ' '+ textSplit[28] + ': ' + textSplit[29])
            return newText.map(str => <p>{str}</p>);*/
            return text;
        }

        const getCriteria = (criteriaName) => {
            if(classifierSelected === "") {
                Promise.all([fetch('/api/weka/' + criteriaName)])
          
                .then(([res1]) => { 
                   return Promise.all([res1.json()]) 
                })
                .then(([res1]) => {
                  this.setState({wekaInfo: res1, criteriaSelected: criteriaName});
                });
            }
            else {
                Promise.all([fetch('/api/weka/' + criteriaName)])
          
                .then(([res1]) => { 
                   return Promise.all([res1.json()]) 
                })
                .then(([res1]) => {
                  this.setState({wekaInfo: res1, criteriaSelected: criteriaName});
                });
            }
        }
      
        // Handles the API call when we change the Criteria we want to look at in graph
        // 1 case is when there is no country selected, so we just give generic stats for the criteria
        // 2nd case is when there IS a country to sort on
        const getClassifier = (classifierName) => {
            
        }

        if(isLoading) {
            return(<div>Loading...</div>)
        }

        return(
            <main style={{ padding: "1rem 0" }}>
                <h2>Weka Takeaways</h2>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={3}>
                    <Dropdown options={sortingCriteria} placeholder="GDP" onChange={(e)=>{
                        getCriteria(e.value)
                        }}/>
                    </Grid>
                    <Grid item xs={3}>
                    <Dropdown options={sortingClassifiers} placeholder="RandomForest" onChange={(e)=>{
                        getClassifier(e.value)
                        }}/>
                    </Grid>
                    <Grid item xs={12}>
                    <NewlineText text={wekaInfo[0]} />
                    </Grid>
                </Grid>
            </main>
        )
    }
}

export default Weka;