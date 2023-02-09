import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { calculateDistances } from "../../Api";

const SearchResult = () => {
    const [allDistances, setAllDistances] = useState({} as any);
    const [selectedCities, setSelectedCities] = useState([] as any);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const cityOfOrigin = urlParams.get("cityOfOrigin");
    const dateOfTrip = new Date(urlParams.get("dateOfTrip")!).toLocaleDateString("en-US");
    const cityOfDestination = urlParams.get("cityOfDestination");
    const numberOfPassengers = urlParams.get("numberOfPassengers");

    let intermediateCities: any;

    if (urlParams.get("intermediateCities")) {
        intermediateCities = decodeURIComponent(urlParams.get("intermediateCities")!);
    }

    const calcDistances = () => {
        const selected = [cityOfOrigin, cityOfDestination];
        if (intermediateCities) intermediateCities.split(",").forEach((city: any) => selected.push(city));
        setSelectedCities(selected);
        calculateDistances(selected).then((result) => {
            setAllDistances(result);
            setLoading(false);
        }).catch((e) => {
            setErrorMessage(e);
            setIsSnackbarOpen(true);
            setLoading(false);
        });
    };

    useEffect(() => {
        calcDistances();
    }, []);

    return (
        <Box sx={{ padding: 3, width: '90%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '12px' }}>
                <Typography variant="h5" component="h3">
                    Trip Information
                </Typography>
            </Box>

            <Paper>
                <Box sx={{ padding: '12px' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography component="p">
                                City of Origin: <b>{cityOfOrigin}</b>
                            </Typography>
                            <Typography component="p">
                                City of Destination: <b>{cityOfDestination}</b>
                            </Typography>
                            <Typography component="p">
                                Number of Passengers: <b>{numberOfPassengers}</b>
                            </Typography>
                        </Grid>
                        {intermediateCities
                            ? <Grid item xs={12} sm={6}>
                                <Typography component="p">
                                    Intermediate Cities:
                                </Typography>
                                {intermediateCities.split(',').map((city: string, index: number) => (
                                    <Typography component="p" key={index}><b>{city}</b></Typography>
                                ))}
                            </Grid>
                            : ''}
                        <Grid item xs={12} sm={12}>
                            <Typography component="p">
                                Date of Trip: <b>{dateOfTrip}</b>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {!errorMessage && <Box sx={{ paddingTop: '24px' }}>
                {!loading && selectedCities?.length && allDistances?.totalDistances
                    ? <Paper>
                        <Box sx={{ padding: '12px' }}>
                            <Typography variant="h5" component="h3">
                                Total Distance: {allDistances.total} km
                            </Typography>
                        </Box>

                        <Box sx={{ padding: '12px' }}>
                            <Grid container spacing={3}>
                                {allDistances.totalDistances.map((distanceData: any, index: number) => (
                                    <Grid item xs={20} sm={20} key={index}>
                                        <Typography component="p">
                                            Distance between {distanceData.fromCity} and {distanceData.toCity}:{" "}
                                            {distanceData.distance} km
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Paper>
                    : <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>}
            </Box>}

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={isSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => setIsSnackbarOpen(false)}
            >
                <Alert severity="error">{errorMessage}</Alert>
            </Snackbar>
        </Box>
    )
}

export default SearchResult;