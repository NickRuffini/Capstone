import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
            console.log(this.state.wekaInfo[1])
            console.log(this.state.wekaInfo[2]);
        });
    }  

    render() {
        const sortingCriteria = ['GDP', 'Total Deaths Per Million'];
        const sortingClassifiers = ['RandomForest'];

        const {isLoading, classifierSelected, criteriaSelected, wekaInfo} = this.state;

        function createData(criteria, number, percentage) {
            return { criteria, number, percentage };
        }

        function createAccuracyData(initial, tpRate, fpRate, precision, recall, fMeasure, mcc, rocArea, prcArea, classType) {
            return { initial, tpRate, fpRate, precision, recall, fMeasure, mcc, rocArea, prcArea, classType };
        }

        // Formats the WEKA summary info so we can display it in the HTML
        function WekaSummary(props) {
            const text = props.text;
            let textSplit = text.split(/[\s,]+/);
            console.log(textSplit);
            const newText = [];
    
            newText.push('' + textSplit[1]);
            newText.push('' + textSplit[2] + ' ' + textSplit[3] + ' ' + textSplit[4] + ': ')
            newText.push('' + textSplit[5])
            newText.push('' + textSplit[6] + '' + textSplit[7])
            newText.push('' + textSplit[7] + ' ' + textSplit[8] + ' ' + textSplit[9] + ' ' + textSplit[10] + ':')
            newText.push('' + textSplit[11])
            newText.push('' + textSplit[12] + '' + textSplit[13])
            newText.push('' + textSplit[14] + ' ' + textSplit[15] + ':')
            newText.push('' + textSplit[16])
            newText.push('' + textSplit[17] + ' ' + textSplit[18] + ' ' + textSplit[19] + ':')
            newText.push('' + textSplit[20])
            newText.push('' + textSplit[21] + ' ' + textSplit[22] + ' ' + textSplit[23] + ' ' + textSplit[24] + ':')
            newText.push('' + textSplit[25])
            newText.push('' + textSplit[26] + ' ' + textSplit[27] + ' '+ textSplit[28] + ':')
            newText.push('' + textSplit[29] + '' + textSplit[30])
            newText.push('' + textSplit[31] + ' ' + textSplit[32] + ' ' + textSplit[33] + ' ' + textSplit[34] + ':')
            newText.push('' + textSplit[35] + '' + textSplit[36])
            newText.push('' + textSplit[37] + ' ' + textSplit[38] + ' ' + textSplit[39] + ' ' + textSplit[40] + ':')
            newText.push('' + textSplit[41])

            const rows = [
                createData(newText[1], newText[2], newText[3]),
                createData(newText[4], newText[5], newText[6]),
                createData(newText[7], newText[8], ''),
                createData(newText[9], newText[10], ''),
                createData(newText[11], newText[12], ''),
                createData(newText[13], '', newText[14]),
                createData(newText[15], '', newText[16]),
                createData(newText[17], newText[18], ''),
            ];

            //return newText.map(str => <p>{str}</p>);
            //return text;
            return (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Criteria</TableCell>
                        <TableCell align="right">Number</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {row.criteria}
                          </TableCell>
                          <TableCell align="right">{row.number}</TableCell>
                          <TableCell align="right">{row.percentage}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            );
        }

        // Formats the WEKA matrix info so we can display it in the HTML
        function WekaMatrix(props) {
            const text = props.text;
            let textSplit = text.split(/[\s,]+/);
            console.log(textSplit);
            const newText = [];
    
            newText.push('' + textSplit[9]);
            newText.push('' + textSplit[10]);
            newText.push('' + textSplit[15]);
            newText.push('' + textSplit[16]);

            const rows = [
                createData('classified as', 'a', 'b'),
                createData('a = low', newText[0], newText[1]),
                createData('b = high', newText[2], newText[3]),
            ];

            return (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 100 }} aria-label="simple table">
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {row.criteria}
                          </TableCell>
                          <TableCell align="right">{row.number}</TableCell>
                          <TableCell align="right">{row.percentage}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            );
        }

        // Formats the WEKA chart info so we can display it in the HTML
        function WekaAccuracy(props) {
            const text = props.text;
            let textSplit = text.split(/[\s,]+/);
            console.log(textSplit);
            const newText = [];

            const rows = [
                createAccuracyData('', 'TP Rate', 'FP Rate', 'Precision', 'Recall', 'F-Measure', 'MCC', 'ROC Area', 'PRC Area', 'Class'),
                createAccuracyData('', textSplit[19], textSplit[20], textSplit[21], textSplit[22], textSplit[23], textSplit[24], textSplit[25], textSplit[26], textSplit[27]),
                createAccuracyData('', textSplit[28], textSplit[29], textSplit[30], textSplit[31], textSplit[32], textSplit[33], textSplit[34], textSplit[35], textSplit[36]),
                createAccuracyData('Weighted Average', textSplit[39], textSplit[40], textSplit[41], textSplit[42], textSplit[43], textSplit[44], textSplit[45], textSplit[46], ''),
            ];

            return (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 100 }} aria-label="simple table">
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {row.initial}
                          </TableCell>
                          <TableCell align="right">{row.tpRate}</TableCell>
                          <TableCell align="right">{row.fpRate}</TableCell>
                          <TableCell align="right">{row.precision}</TableCell>
                          <TableCell align="right">{row.recall}</TableCell>
                          <TableCell align="right">{row.fMeasure}</TableCell>
                          <TableCell align="right">{row.mcc}</TableCell>
                          <TableCell align="right">{row.rocArea}</TableCell>
                          <TableCell align="right">{row.prcArea}</TableCell>
                          <TableCell align="right">{row.classType}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            );
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
                    <Grid item xs={10}>
                        <WekaSummary text={wekaInfo[0]} />
                    </Grid>
                    <Grid item xs={3}>
                        <h3>Confusion Matrix</h3>
                        <WekaMatrix text={wekaInfo[1]} />
                    </Grid>
                    <Grid item xs={8}>
                        <h3>Detailed Accuracy by Class</h3>
                        <WekaAccuracy text={wekaInfo[2]} />
                    </Grid>
                </Grid>
            </main>
        )
    }
}

export default Weka;