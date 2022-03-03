import React from "react";
import Grid from "@material-ui/core/Grid";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export default function Home() {
    return(
        <main style={{ padding: "1rem 0" }}>
        <h2>General Takeaways</h2>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={3}>
            <Dropdown placeholder="Countries" />
          </Grid>
          <Grid item xs={3}>
            <Dropdown placeholder="Criteria"/>
          </Grid>
        </Grid>
      </main>
    );
}