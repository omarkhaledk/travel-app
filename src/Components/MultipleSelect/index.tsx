import React, { useState, useEffect } from 'react';

import FormHelperText from '@mui/material/FormHelperText';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface Props {
    initialValue: any[];
    label: string;
    name: string;
    helperText: any;
    onChange: (event: any) => void;
    required?: boolean;
    api?: any;
    onBlur?: () => void;
}

const MultipleSelect: React.FC<Props> = ({
    initialValue,
    label,
    name,
    onChange,
    required,
    api,
    onBlur,
    helperText
}) => {
    const [value, setValue] = useState(initialValue || []);
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([] as any);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

    const handleChange = (event: any, option: any) => {
        const v = [...(value || []), option].filter(x => x !== null);
        setValue(v);
        onChange({ target: { value: v.map(val => val.value), name } });
    };

    const handleDelete = (deletedOption: any) => {
        setValue(value.filter(val => val.value !== deletedOption.value));
        onChange({ target: { value: value.filter(val => val.value !== deletedOption.value).map(val => val.value), name } });
    };

    const handleTextFieldChange = (event: any) => {
        setSearchValue(event.target.value);
        if (!event.target.value) return setOptions([]);
        setLoading(true);

        (async () => {
            try {
                let results = api ? await api(event.target.value) : [];

                if (value?.length) {
                    results = results.filter((x: any) => !value.find(y => y.value === x.value))
                }

                setOptions([...results]);
                setLoading(false);
            } catch (e: any) {
                setErrorMessage(e);
                setIsSnackbarOpen(true);
                setLoading(false)
            }
        })();
    };

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <div>

            <Autocomplete
                disableClearable
                onBlur={onBlur}
                noOptionsText={!searchValue ? 'Enter a search term' : 'No options found'}
                id={name}
                value={value}
                open={open}
                onChange={(e, val) => handleChange(e, val)}
                onOpen={() => { setOpen(true); }}
                onClose={() => {
                    setOpen(false);
                    setSearchValue('');
                }}
                isOptionEqualToValue={(option, val) => option.value === val.value}
                getOptionLabel={(option) => option.label || ''}
                options={options}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        onChange={handleTextFieldChange}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />

            <Box sx={{ padding: '8px 0' }}>
                {value.map((option, i) => (
                    option ? <Chip key={i + 1} label={option?.label} onDelete={() => handleDelete(option)} /> : ''
                ))}
            </Box>

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={isSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => setIsSnackbarOpen(false)}
            >
                <Alert severity="error">{errorMessage}</Alert>
            </Snackbar>

            {helperText ? <FormHelperText style={{ color: '#d32f2f' }}>{helperText}</FormHelperText> : ''}
        </div>
    );
}

export default MultipleSelect;