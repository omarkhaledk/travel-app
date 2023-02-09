import React, { useState, useEffect } from 'react';

import FormHelperText from '@mui/material/FormHelperText';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface Props {
  initialValue?: string;
  label: string;
  name: string;
  onChange: (event: React.ChangeEvent<{ value: any, name: string }>) => void;
  required?: boolean;
  api?: any;
  onBlur?: () => void;
  [key: string]: any;
}

const Select: React.FC<Props> = ({
  initialValue,
  label,
  name,
  onChange,
  required,
  api,
  onBlur,
  ...rest
}) => {
  const [value, setValue] = useState({} as any);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleChange = (event: any, val: any) => {
    setValue(val);
    if (val) onChange(Object.assign(event, { target: { value: val.value, name } }));
  };

  const handleTextFieldChange = (event: any) => {
    setSearchValue(event.target.value);
    if (!event.target.value) return setOptions([]);
    setLoading(true);

    (async () => {
      try {
        const results = api ? await api(event.target.value) : [];

        setOptions([...results]);
        setLoading(false);
      } catch (e: any) {
        setErrorMessage(e.toString());
        setIsSnackbarOpen(true);
        setLoading(false);
      }
    })();
  };

  useEffect(() => {
    if (initialValue) setValue({ label: initialValue, value: initialValue });
  }, [initialValue]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
  return (
    <div>

      <Autocomplete
        noOptionsText={!searchValue ? 'Enter a search term' : 'No options found'}
        disableClearable
        id={name}
        value={value}
        open={open}
        onChange={(e, val) => handleChange(e, val)}
        onOpen={() => { setOpen(true); }}
        onClose={() => { setOpen(false); }}
        isOptionEqualToValue={(option, val) => option.value === val.value}
        getOptionLabel={(option) => option.label || ''}
        options={options}
        loading={loading}
        onBlur={onBlur}
        renderInput={(params) => (
          <TextField
            {...params}
            label={required ? label + ' *' : label}
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

      {rest.helperText ? <FormHelperText style={{ color: '#d32f2f' }}>{rest.helperText}</FormHelperText> : ''}

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setIsSnackbarOpen(false)}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
    </div>
  );
}

export default Select;