import React, { useState } from 'react';

import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Select from '../../Components/Select'
import MultipleSelect from '../../Components/MultipleSelect';
import { Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FormHelperText from '@mui/material/FormHelperText';
import { useNavigate } from "react-router-dom";

import { getCitiesByName } from '../../Api';

interface Values {
    cityOfOrigin: string;
    intermediateCities: { label: string, value: string }[];
    cityOfDestination: string;
    dateOfTrip: Date | string;
    numberOfPassengers: number | string;
}

interface Errors {
    cityOfOrigin?: string;
    intermediateCities?: string;
    cityOfDestination?: string;
    dateOfTrip?: string;
    numberOfPassengers?: string;
}

const validate = (values: Values) => {
    const errors: Errors = {};

    if (values.numberOfPassengers && values.numberOfPassengers < 1) {
        errors.numberOfPassengers = 'Please enter a positive number';
    }

    if (values.dateOfTrip && new Date(values.dateOfTrip) < new Date()) {
        errors.dateOfTrip = 'Selected date must be in the future'
    }

    return errors;
};

const HomePage = () => {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const intermediateCitiesString = urlParams.get('intermediateCities');
    const intermediateCities = intermediateCitiesString
        ? decodeURIComponent(intermediateCitiesString).split(',').map(x => ({ label: x, value: x }))
        : [];

    const formik = useFormik<Values>({
        initialValues: {
            cityOfOrigin: urlParams.get('cityOfOrigin') || '',
            intermediateCities,
            cityOfDestination: urlParams.get('cityOfDestination') || '',
            dateOfTrip: urlParams.get('dateOfTrip') ? new Date(urlParams.get('dateOfTrip') || '') : '',
            numberOfPassengers: urlParams.get('numberOfPassengers') || ''
        },
        validate,
        onSubmit: () => {
            setLoading(true);
            setTimeout(() => {
                const params = formatParams();
                const url = '/search-result?' + params;
                navigate(url);
            }, (1500))
        },
    });

    const formatParams = () => {
        const { cityOfOrigin, cityOfDestination, dateOfTrip, numberOfPassengers, intermediateCities } = formik.values;

        const params = new URLSearchParams();
        if (cityOfOrigin) params.set("cityOfOrigin", cityOfOrigin);
        if (cityOfDestination) params.set("cityOfDestination", cityOfDestination);
        if (dateOfTrip) params.set("dateOfTrip", new Date(dateOfTrip).toISOString());
        if (numberOfPassengers) params.set("numberOfPassengers", numberOfPassengers.toString());

        if (intermediateCities?.length) {
            const selectedCities = intermediateCities.map(x => x.value || x);
            const intermediateCitiesString = encodeURIComponent(selectedCities.join(','));
            params.set("intermediateCities", intermediateCitiesString);
        }
        return params;
    }

    const onBlur = () => {
        const params = formatParams();
        window.history.replaceState(null, "Travel App", '/?' + params.toString())
    }

    const isSubmitDisabled = !formik.values.cityOfOrigin ||
        !formik.values.cityOfDestination ||
        !formik.values.dateOfTrip ||
        (!formik.values.numberOfPassengers || formik.values.numberOfPassengers < 1);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>

            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                <Typography variant="h5" component="h3">
                    Trip Details
                </Typography>
            </Box>

            <Box sx={{ padding: 3, width: '90%' }}>
                <Grid container direction={"column"} spacing={2}>
                    <Grid item>
                        <Select
                            initialValue={formik.values.cityOfOrigin}
                            label="City of Origin"
                            name="cityOfOrigin"
                            onChange={(e: any) => formik.handleChange(e)}
                            error={formik.touched.cityOfOrigin && formik.errors.cityOfOrigin ? Boolean(formik.errors.cityOfOrigin) : null}
                            helperText={formik.touched.cityOfOrigin && formik.errors.cityOfOrigin ? formik.errors.cityOfOrigin : null}
                            api={getCitiesByName}
                            onBlur={onBlur}
                            required
                        />
                    </Grid>

                    <Grid item>
                        <MultipleSelect
                            initialValue={formik.values.intermediateCities}
                            label="Intermediate Cities"
                            name="intermediateCities"
                            helperText={formik.touched.intermediateCities && formik.errors.intermediateCities ? formik.errors.intermediateCities : null}
                            onChange={(e: any) => formik.handleChange(e)}
                            api={getCitiesByName}
                            onBlur={onBlur}
                            required={false}
                        />
                    </Grid>

                    <Grid item>
                        <Select
                            initialValue={formik.values.cityOfDestination}
                            label="City of Destination"
                            name="cityOfDestination"
                            onChange={(e: any) => formik.handleChange(e)}
                            error={formik.touched.cityOfDestination && formik.errors.cityOfDestination ? Boolean(formik.errors.cityOfDestination) : null}
                            helperText={formik.touched.cityOfDestination && formik.errors.cityOfDestination ? formik.errors.cityOfDestination : null}
                            api={getCitiesByName}
                            onBlur={onBlur}
                            required
                        />
                    </Grid>

                    <Grid item>
                        <MobileDatePicker
                            label="Date of Trip *"
                            inputFormat="MM/DD/YYYY"
                            value={formik.values.dateOfTrip || null}
                            onChange={value => { formik.handleChange({ target: { value, name: "dateOfTrip" } }) }}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                            onClose={onBlur}
                            disablePast
                        />
                        {formik.errors.dateOfTrip
                            ? <FormHelperText style={{ color: '#d32f2f' }}>
                                {formik.errors.dateOfTrip}
                            </FormHelperText> : ''}
                    </Grid>

                    <Grid item>
                        <TextField
                            id="numberOfPassengers"
                            name="numberOfPassengers"
                            onChange={formik.handleChange}
                            value={formik.values.numberOfPassengers}
                            label="Number of Passengers"
                            variant="outlined"
                            InputProps={{ inputMode: 'numeric', pattern: '^[1-9]+[0-9]*$' } as any}
                            type="number"
                            error={Boolean(formik.errors.numberOfPassengers)}
                            helperText={formik.errors.numberOfPassengers}
                            onBlur={onBlur}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item>
                        <LoadingButton
                            loading={loading}
                            variant="outlined"
                            disabled={isSubmitDisabled}
                            onClick={(event) => formik.handleSubmit(event as any)}
                        >
                            Submit
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Box>
        </LocalizationProvider>
    );
};


export default HomePage;